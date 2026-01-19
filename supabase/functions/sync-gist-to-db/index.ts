import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

// DISABLED - La synchronisation Gist a été désactivée
// Les produits Qogita sont maintenant gérés uniquement via l'import Excel
// Pour réactiver, voir la version précédente de ce fichier

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  console.log('⚠️ sync-gist-to-db est désactivé - Utiliser l\'import Excel à la place');
  
  return new Response(
    JSON.stringify({ 
      success: false,
      message: 'Cette fonction est désactivée. Utilisez l\'import Excel sur /produits-gagnants/produits-qogita'
    }),
    { 
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 200,
    }
  );
});
