import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

const GIST_URL = 'https://gist.githubusercontent.com/raw/8152fd7f63434f16118c967e041a9144/results.json';

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  try {
    console.log('🔄 Début de la synchronisation Gist -> DB');
    
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const supabase = createClient(supabaseUrl, supabaseKey);

    // Récupérer les données du Gist
    const gistResponse = await fetch(GIST_URL);
    
    if (!gistResponse.ok) {
      throw new Error(`Erreur lors de la récupération du Gist: ${gistResponse.status}`);
    }

    const gistData = await gistResponse.json();
    const products = gistData.products || [];

    console.log(`📦 ${products.length} produits récupérés du Gist`);

    if (products.length === 0) {
      return new Response(
        JSON.stringify({ 
          success: true,
          synced: 0,
          message: 'Aucun produit à synchroniser'
        }),
        { 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          status: 200,
        }
      );
    }

    // Transformer les données au format DB
    const transformedProducts = products.map((product: any) => {
      // Convertir le timestamp du format français au format ISO
      const [datePart, timePart] = product.timestamp.split(' ');
      const [day, month, year] = datePart.split('/');
      const isoTimestamp = `${year}-${month}-${day}T${timePart}.000Z`;

      return {
        ean: product.ean,
        timestamp: isoTimestamp,
        qogita_price_ht: product.qogita?.priceHT || 0,
        qogita_price_ttc: product.qogita?.priceTTC || 0,
        qogita_stock: product.qogita?.stock || 0,
        selleramp_bsr: product.selleramp?.bsr || null,
        selleramp_sale_price: product.selleramp?.salePrice || null,
        selleramp_sales: product.selleramp?.sales || null,
        selleramp_sellers: product.selleramp?.sellers || null,
        selleramp_variations: product.selleramp?.variations || null,
        fbm_profit: product.fbm?.profit || null,
        fbm_roi: product.fbm?.roi || null,
        fba_profit: product.fba?.profit || null,
        fba_roi: product.fba?.roi || null,
        alerts: product.alerts || [],
      };
    });

    // Upsert dans la DB (mise à jour si existe, insertion sinon)
    const { data, error } = await supabase
      .from('qogita_products')
      .upsert(transformedProducts, { 
        onConflict: 'ean,timestamp',
        ignoreDuplicates: false 
      });

    if (error) {
      console.error('❌ Erreur lors de la synchronisation:', error);
      throw error;
    }

    console.log(`✅ ${transformedProducts.length} produits synchronisés vers la DB`);

    return new Response(
      JSON.stringify({ 
        success: true,
        synced: transformedProducts.length,
        message: `${transformedProducts.length} produits synchronisés`,
        gist_generated: gistData.generated
      }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200,
      }
    );

  } catch (error) {
    console.error('❌ Erreur dans sync-gist-to-db:', error);
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
