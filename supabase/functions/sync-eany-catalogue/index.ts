import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const supabase = createClient(supabaseUrl, supabaseKey);

    const { products, action } = await req.json();

    // Clear action
    if (action === 'clear') {
      console.log('🗑️ Clearing Eany catalogue...');
      const { error } = await supabase
        .from('eany_catalogue')
        .delete()
        .neq('id', '00000000-0000-0000-0000-000000000000');

      if (error) throw error;

      return new Response(
        JSON.stringify({ success: true, message: 'Catalogue vidé' }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Import products
    if (!products || !Array.isArray(products)) {
      throw new Error('Products array required');
    }

    console.log(`📦 Importing ${products.length} Eany products...`);

    // Transform and validate products
    const validProducts = products
      .filter((p: any) => p.ean && typeof p.price_ht === 'number')
      .map((p: any) => ({
        ean: String(p.ean).trim(),
        brand: String(p.brand || '').trim(),
        price_ht: Number(p.price_ht) || 0
      }));

    if (validProducts.length === 0) {
      return new Response(
        JSON.stringify({ success: true, inserted: 0, message: 'No valid products' }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Insert in batches
    const batchSize = 1000;
    let totalInserted = 0;

    for (let i = 0; i < validProducts.length; i += batchSize) {
      const batch = validProducts.slice(i, i + batchSize);
      
      const { error } = await supabase
        .from('eany_catalogue')
        .insert(batch);

      if (error) {
        console.error(`Batch error at ${i}:`, error);
      } else {
        totalInserted += batch.length;
      }
    }

    console.log(`✅ Inserted ${totalInserted} products`);

    return new Response(
      JSON.stringify({ 
        success: true, 
        inserted: totalInserted,
        message: `${totalInserted} produits importés`
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    console.error('Error:', error);
    return new Response(
      JSON.stringify({ success: false, error: error instanceof Error ? error.message : 'Unknown error' }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 500 }
    );
  }
});
