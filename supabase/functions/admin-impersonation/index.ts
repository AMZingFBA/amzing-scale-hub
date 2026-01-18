import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

Deno.serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_ANON_KEY') ?? '',
      {
        global: {
          headers: { Authorization: req.headers.get('Authorization')! },
        },
      }
    );

    // Verify the user is authenticated
    const authHeader = req.headers.get('Authorization');
    if (!authHeader?.startsWith('Bearer ')) {
      return new Response(
        JSON.stringify({ error: 'Non autorisé' }),
        { status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const token = authHeader.replace('Bearer ', '');
    const { data: claimsData, error: claimsError } = await supabaseClient.auth.getClaims(token);
    
    if (claimsError || !claimsData?.claims) {
      return new Response(
        JSON.stringify({ error: 'Token invalide' }),
        { status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const adminId = claimsData.claims.sub;

    // Check if user is admin
    const { data: isAdminData } = await supabaseClient.rpc('has_role', {
      _user_id: adminId,
      _role: 'admin'
    });

    if (!isAdminData) {
      return new Response(
        JSON.stringify({ error: 'Accès réservé aux administrateurs' }),
        { status: 403, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const { action, targetUserId } = await req.json();

    // Use service role for admin operations
    const supabaseAdmin = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    );

    if (action === 'impersonate') {
      // Generate a REAL session for the target user
      if (!targetUserId) {
        return new Response(
          JSON.stringify({ error: 'ID utilisateur requis' }),
          { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }

      // Get the target user's email
      const { data: userData, error: userError } = await supabaseAdmin.auth.admin.getUserById(targetUserId);
      
      if (userError || !userData?.user) {
        console.error('Error fetching user:', userError);
        return new Response(
          JSON.stringify({ error: 'Utilisateur non trouvé' }),
          { status: 404, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }

      const userEmail = userData.user.email;
      if (!userEmail) {
        return new Response(
          JSON.stringify({ error: 'Email utilisateur non trouvé' }),
          { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }

      // Generate a magic link for the user (without sending email)
      const { data: linkData, error: linkError } = await supabaseAdmin.auth.admin.generateLink({
        type: 'magiclink',
        email: userEmail,
        options: {
          redirectTo: `${req.headers.get('origin') || 'https://amzing-scale-hub.lovable.app'}/dashboard`
        }
      });

      if (linkError || !linkData) {
        console.error('Error generating link:', linkError);
        return new Response(
          JSON.stringify({ error: 'Erreur lors de la génération du lien de connexion' }),
          { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }

      // Log the impersonation for audit
      console.log(`Admin ${adminId} is impersonating user ${targetUserId} (${userEmail})`);

      // The linkData contains the action_link which is the magic link URL
      // We extract the token from it to use directly
      const actionLink = linkData.properties?.action_link;
      
      return new Response(
        JSON.stringify({ 
          success: true,
          // Return the magic link that will log in the user
          actionLink: actionLink,
          user: {
            id: userData.user.id,
            email: userData.user.email,
            user_metadata: userData.user.user_metadata
          }
        }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );

    } else {
      return new Response(
        JSON.stringify({ error: 'Action non reconnue' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

  } catch (error) {
    console.error('Error in admin-impersonation:', error);
    return new Response(
      JSON.stringify({ error: 'Erreur serveur' }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
