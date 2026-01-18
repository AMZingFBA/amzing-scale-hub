import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface QogitaProduct {
  ean: string;
  brand: string;
  price_ht: number;
}

Deno.serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    const { products, action } = await req.json();

    console.log(`[sync-qogita-catalogue] Action: ${action}, Products count: ${products?.length || 0}`);

    if (action === 'clear') {
      // Clear all products
      const { error } = await supabase
        .from('qogita_catalogue')
        .delete()
        .neq('id', '00000000-0000-0000-0000-000000000000');

      if (error) {
        console.error('[sync-qogita-catalogue] Error clearing:', error);
        throw error;
      }

      console.log('[sync-qogita-catalogue] Catalogue cleared successfully');
      return new Response(
        JSON.stringify({ success: true, message: 'Catalogue cleared' }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    if (!products || !Array.isArray(products) || products.length === 0) {
      return new Response(
        JSON.stringify({ success: false, error: 'No products provided' }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 400 }
      );
    }

    // Validate and transform products
    const validProducts: QogitaProduct[] = products
      .filter((p: any) => p.ean && p.brand && p.price_ht !== undefined)
      .map((p: any) => ({
        ean: String(p.ean).trim(),
        brand: String(p.brand).trim(),
        price_ht: parseFloat(p.price_ht) || 0,
      }));

    console.log(`[sync-qogita-catalogue] Valid products: ${validProducts.length}`);

    // Insert in batches of 1000
    const batchSize = 1000;
    let insertedCount = 0;
    let errorCount = 0;

    for (let i = 0; i < validProducts.length; i += batchSize) {
      const batch = validProducts.slice(i, i + batchSize);
      
      const { error } = await supabase
        .from('qogita_catalogue')
        .upsert(batch, { onConflict: 'ean' });

      if (error) {
        console.error(`[sync-qogita-catalogue] Batch ${i / batchSize + 1} error:`, error);
        errorCount += batch.length;
      } else {
        insertedCount += batch.length;
        console.log(`[sync-qogita-catalogue] Batch ${i / batchSize + 1} inserted: ${batch.length} products`);
      }
    }

    console.log(`[sync-qogita-catalogue] Complete. Inserted: ${insertedCount}, Errors: ${errorCount}`);

    return new Response(
      JSON.stringify({ 
        success: true, 
        inserted: insertedCount, 
        errors: errorCount,
        total: validProducts.length 
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    console.error('[sync-qogita-catalogue] Error:', errorMessage);
    return new Response(
      JSON.stringify({ success: false, error: errorMessage }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 500 }
    );
  }
});
