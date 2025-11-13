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

  try {
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const supabase = createClient(supabaseUrl, supabaseKey);

    const { products } = await req.json();

    if (!products || !Array.isArray(products)) {
      throw new Error('Invalid products data');
    }

    console.log(`Syncing ${products.length} Qogita products...`);

    // Transform and insert products
    const transformedProducts = products.map((product: any) => ({
      ean: product.ean,
      timestamp: new Date(product.timestamp.split('/').reverse().join('-')).toISOString(),
      qogita_price_ht: product.qogita.priceHT,
      qogita_price_ttc: product.qogita.priceTTC,
      qogita_stock: product.qogita.stock,
      selleramp_bsr: product.selleramp?.bsr,
      selleramp_sale_price: product.selleramp?.salePrice,
      selleramp_sales: product.selleramp?.sales,
      selleramp_sellers: product.selleramp?.sellers,
      selleramp_variations: product.selleramp?.variations,
      fbm_profit: product.fbm?.profit,
      fbm_roi: product.fbm?.roi,
      fba_profit: product.fba?.profit,
      fba_roi: product.fba?.roi,
      alerts: product.alerts || [],
    }));

    // Upsert products (update if EAN exists, insert if not)
    const { data, error } = await supabase
      .from('qogita_products')
      .upsert(transformedProducts, { 
        onConflict: 'ean',
        ignoreDuplicates: false 
      });

    if (error) {
      console.error('Error syncing products:', error);
      throw error;
    }

    console.log(`Successfully synced ${transformedProducts.length} products`);

    return new Response(
      JSON.stringify({ 
        success: true, 
        synced: transformedProducts.length,
        message: `${transformedProducts.length} produits synchronisés`
      }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200,
      }
    );

  } catch (error) {
    console.error('Error in sync-qogita-products:', error);
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