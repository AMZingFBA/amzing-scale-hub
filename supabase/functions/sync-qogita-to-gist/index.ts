import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

const GITHUB_TOKEN = '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';
const GIST_ID = 'e85e0cf04f92a8acf34cc8a4a0bc61fe';

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  try {
    console.log('🔄 Début de la synchronisation Qogita -> Gist');
    
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const supabase = createClient(supabaseUrl, supabaseKey);

    // Récupérer tous les produits
    const { data: products, error: dbError } = await supabase
      .from('qogita_products')
      .select('*')
      .order('timestamp', { ascending: false });

    if (dbError) {
      console.error('❌ Erreur DB:', dbError);
      throw dbError;
    }

    console.log(`📦 ${products?.length || 0} produits récupérés de la DB`);

    // Transformer les données au format attendu par le frontend
    const formattedData = {
      data: (products || []).map((p: any) => ({
        ean: p.ean,
        timestamp: new Date(p.timestamp).toLocaleDateString('fr-FR'),
        qogita: {
          priceHT: p.qogita_price_ht,
          priceTTC: p.qogita_price_ttc,
          stock: p.qogita_stock
        },
        selleramp: {
          bsr: p.selleramp_bsr,
          salePrice: p.selleramp_sale_price,
          sales: p.selleramp_sales,
          sellers: p.selleramp_sellers,
          variations: p.selleramp_variations
        },
        fbm: {
          profit: p.fbm_profit,
          roi: p.fbm_roi
        },
        fba: {
          profit: p.fba_profit,
          roi: p.fba_roi
        },
        alerts: p.alerts || []
      }))
    };

    // Mettre à jour le Gist sur GitHub
    const gistResponse = await fetch(`https://api.github.com/gists/${GIST_ID}`, {
      method: 'PATCH',
      headers: {
        'Authorization': `Bearer ${GITHUB_TOKEN}`,
        'Accept': 'application/vnd.github.v3+json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        files: {
          'qogita-products.json': {
            content: JSON.stringify(formattedData, null, 2)
          }
        }
      })
    });

    if (!gistResponse.ok) {
      const error = await gistResponse.text();
      console.error('❌ Erreur GitHub:', error);
      throw new Error(`GitHub API error: ${gistResponse.status} - ${error}`);
    }

    const gistData = await gistResponse.json();
    console.log('✅ Gist mis à jour:', gistData.html_url);

    return new Response(
      JSON.stringify({ 
        success: true,
        products_count: products?.length || 0,
        gist_url: gistData.html_url,
        timestamp: new Date().toISOString()
      }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200,
      }
    );

  } catch (error) {
    console.error('❌ Erreur dans sync-qogita-to-gist:', error);
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
