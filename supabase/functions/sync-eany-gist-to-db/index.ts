import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

const GIST_URL = 'https://gist.githubusercontent.com/raw/aea9e1f76e9479a72df4cc0a529343f2/results.json';

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  try {
    console.log('🔄 Début de la synchronisation Eany Gist -> DB');
    
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

    console.log(`📦 ${products.length} produits Eany récupérés du Gist`);

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

    // Supprimer tous les anciens produits avant la synchronisation
    const { error: deleteError } = await supabase
      .from('eany_products')
      .delete()
      .neq('id', '00000000-0000-0000-0000-000000000000'); // Delete all

    if (deleteError) {
      console.error('❌ Erreur lors de la suppression:', deleteError);
      throw deleteError;
    }

    console.log('🗑️ Anciens produits Eany supprimés');

    // Transformer les données au format DB
    const transformedProducts = products.map((product: any) => {
      return {
        ean: product.ean,
        timestamp: new Date().toISOString(),
        qogita_price_ht: product.eanyPriceHT || 0,
        qogita_price_ttc: product.eanyPriceTTC || 0,
        qogita_stock: product.eanyStock || 0,
        qogita_url: product.eanyUrl || null,
        selleramp_bsr: product.bsr?.toString() || null,
        selleramp_sale_price: product.salePrice || null,
        selleramp_sales: product.sales?.toString() || null,
        selleramp_sellers: product.sellers?.toString() || null,
        selleramp_variations: product.variations?.toString() || null,
        selleramp_url: product.sellerampUrl || null,
        fbm_profit: product.profitFBM || null,
        fbm_roi: product.roiFBM || null,
        fba_profit: product.profitFBA || null,
        fba_roi: product.roiFBA || null,
        alerts: [],
        amazon_url: product.amazonUrl || null,
      };
    });

    // Insérer les nouveaux produits
    const { data, error } = await supabase
      .from('eany_products')
      .insert(transformedProducts);

    if (error) {
      console.error('❌ Erreur lors de la synchronisation:', error);
      throw error;
    }

    console.log(`✅ ${transformedProducts.length} produits Eany synchronisés vers la DB`);

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
    console.error('❌ Erreur dans sync-eany-gist-to-db:', error);
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