import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  // Handle GET requests (browser access)
  if (req.method === 'GET') {
    return new Response(
      JSON.stringify({ 
        success: false, 
        error: 'Cette API nécessite une requête POST avec un body JSON contenant { products: [...] }' 
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 400 }
    );
  }

  try {
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const supabase = createClient(supabaseUrl, supabaseKey);

    const bodyText = await req.text();
    console.log('📥 Raw body length:', bodyText.length);
    
    if (!bodyText || bodyText.trim() === '') {
      throw new Error('Empty request body');
    }

    let body;
    try {
      body = JSON.parse(bodyText);
    } catch (parseError) {
      console.error('❌ JSON parse error:', parseError);
      console.error('❌ Body preview:', bodyText.substring(0, 200));
      throw new Error(`Invalid JSON: ${parseError}`);
    }

    console.log('📥 Request body keys:', Object.keys(body));
    console.log('📥 Products type:', typeof body.products);
    console.log('📥 Products is array:', Array.isArray(body.products));
    
    const { products } = body;

    if (!products || !Array.isArray(products)) {
      console.error('❌ Invalid products - received:', JSON.stringify(body).substring(0, 500));
      throw new Error('Invalid products data - expected { products: [...] }');
    }

    if (products.length === 0) {
      return new Response(
        JSON.stringify({ success: true, synced: 0, message: 'Aucun produit à synchroniser' }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 200 }
      );
    }

    // Log first product structure for debugging
    console.log('📦 First product sample:', JSON.stringify(products[0]));
    console.log(`📦 Syncing ${products.length} Qogita products...`);

    // Transform and insert products
    const transformedProducts = products.map((product: any, index: number) => {
      // Parse date - handle both "19/01/2026" and "2026-01-19" formats
      let timestamp;
      try {
        if (product.timestamp.includes('/')) {
          const parts = product.timestamp.split('/');
          timestamp = new Date(`${parts[2]}-${parts[1]}-${parts[0]}`).toISOString();
        } else {
          timestamp = new Date(product.timestamp).toISOString();
        }
      } catch (dateError) {
        console.error(`❌ Date parse error for product ${index}:`, product.timestamp, dateError);
        timestamp = new Date().toISOString();
      }

      const transformed = {
        ean: product.ean,
        timestamp,
        qogita_price_ht: product.qogita?.priceHT ?? null,
        qogita_price_ttc: product.qogita?.priceTTC ?? null,
        qogita_stock: product.qogita?.stock ?? null,
        selleramp_bsr: product.selleramp?.bsr ?? null,
        selleramp_sale_price: product.selleramp?.salePrice ?? null,
        selleramp_sales: product.selleramp?.sales ?? null,
        selleramp_sellers: product.selleramp?.sellers ?? null,
        selleramp_variations: product.selleramp?.variations ?? null,
        selleramp_url: product.selleramp?.url ?? null,
        amazon_url: product.amazon?.url ?? null,
        qogita_url: product.qogita?.url ?? null,
        fbm_profit: product.fbm?.profit ?? null,
        fbm_roi: product.fbm?.roi ?? null,
        fba_profit: product.fba?.profit ?? null,
        fba_roi: product.fba?.roi ?? null,
        alerts: product.alerts || [],
      };

      if (index === 0) {
        console.log('📦 Transformed product sample:', JSON.stringify(transformed));
      }

      return transformed;
    });

    // Upsert products (update if EAN exists, insert if not)
    console.log(`📤 Upserting ${transformedProducts.length} products to Supabase...`);
    
    const { data, error } = await supabase
      .from('qogita_products')
      .upsert(transformedProducts, { 
        onConflict: 'ean',
        ignoreDuplicates: false 
      })
      .select();

    if (error) {
      console.error('❌ Supabase upsert error:', JSON.stringify(error));
      throw new Error(`Database error: ${error.message} (code: ${error.code})`);
    }

    console.log(`✅ Successfully synced ${transformedProducts.length} products`);
    console.log('📊 Upsert result count:', data?.length ?? 'unknown');

    return new Response(
      JSON.stringify({ 
        success: true, 
        synced: transformedProducts.length,
        inserted: data?.length ?? transformedProducts.length,
        message: `${transformedProducts.length} produits synchronisés`
      }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200,
      }
    );

  } catch (error) {
    console.error('❌ Error in sync-qogita-products:', error);
    return new Response(
      JSON.stringify({ 
        success: false, 
        error: error instanceof Error ? error.message : 'Unknown error' 
      }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 500,
      }
    );
  }
});