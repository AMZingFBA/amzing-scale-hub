import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

function generateSecureToken(): string {
  const array = new Uint8Array(32);
  crypto.getRandomValues(array);
  return Array.from(array, byte => byte.toString(16).padStart(2, '0')).join('');
}

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

    const { action, targetUserId, impersonationToken } = await req.json();

    // Use service role for admin operations
    const supabaseAdmin = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    );

    if (action === 'generate') {
      // Generate a new impersonation token
      if (!targetUserId) {
        return new Response(
          JSON.stringify({ error: 'ID utilisateur requis' }),
          { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }

      // Clean up old tokens for this target user from this admin
      await supabaseAdmin
        .from('admin_impersonation_tokens')
        .delete()
        .eq('admin_id', adminId)
        .eq('target_user_id', targetUserId);

      // Also clean up all expired tokens
      await supabaseAdmin.rpc('cleanup_expired_impersonation_tokens');

      // Generate new token with 5 minute expiry
      const newToken = generateSecureToken();
      const expiresAt = new Date(Date.now() + 5 * 60 * 1000); // 5 minutes

      const { data: tokenData, error: insertError } = await supabaseAdmin
        .from('admin_impersonation_tokens')
        .insert({
          admin_id: adminId,
          target_user_id: targetUserId,
          token: newToken,
          expires_at: expiresAt.toISOString()
        })
        .select()
        .single();

      if (insertError) {
        console.error('Error creating token:', insertError);
        return new Response(
          JSON.stringify({ error: 'Erreur lors de la création du token' }),
          { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }

      return new Response(
        JSON.stringify({ 
          success: true, 
          token: newToken,
          expiresAt: expiresAt.toISOString()
        }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );

    } else if (action === 'validate') {
      // Validate an impersonation token
      if (!impersonationToken) {
        return new Response(
          JSON.stringify({ error: 'Token requis', valid: false }),
          { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }

      const { data: tokenData, error: tokenError } = await supabaseAdmin
        .from('admin_impersonation_tokens')
        .select('*')
        .eq('token', impersonationToken)
        .single();

      if (tokenError || !tokenData) {
        return new Response(
          JSON.stringify({ error: 'Token invalide', valid: false }),
          { status: 404, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }

      // Check if token is expired
      if (new Date(tokenData.expires_at) < new Date()) {
        // Delete expired token
        await supabaseAdmin
          .from('admin_impersonation_tokens')
          .delete()
          .eq('id', tokenData.id);

        return new Response(
          JSON.stringify({ error: 'Token expiré', valid: false }),
          { status: 410, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }

      // Get target user profile
      const { data: profileData, error: profileError } = await supabaseAdmin
        .from('profiles')
        .select('id, full_name, email, nickname')
        .eq('id', tokenData.target_user_id)
        .single();

      if (profileError || !profileData) {
        return new Response(
          JSON.stringify({ error: 'Utilisateur non trouvé', valid: false }),
          { status: 404, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }

      // Get subscription info
      const { data: subscriptionData } = await supabaseAdmin
        .from('subscriptions')
        .select('plan_type, status, expires_at, is_trial')
        .eq('user_id', tokenData.target_user_id)
        .single();

      // Mark token as used
      await supabaseAdmin
        .from('admin_impersonation_tokens')
        .update({ used_at: new Date().toISOString() })
        .eq('id', tokenData.id);

      return new Response(
        JSON.stringify({ 
          valid: true,
          user: profileData,
          subscription: subscriptionData,
          expiresAt: tokenData.expires_at
        }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );

    } else if (action === 'refresh') {
      // Refresh an existing token (extend by 5 more minutes)
      if (!impersonationToken) {
        return new Response(
          JSON.stringify({ error: 'Token requis' }),
          { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }

      const { data: existingToken, error: fetchError } = await supabaseAdmin
        .from('admin_impersonation_tokens')
        .select('*')
        .eq('token', impersonationToken)
        .single();

      if (fetchError || !existingToken) {
        return new Response(
          JSON.stringify({ error: 'Token non trouvé', valid: false }),
          { status: 404, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }

      // Generate new token and extend expiry
      const newToken = generateSecureToken();
      const newExpiresAt = new Date(Date.now() + 5 * 60 * 1000);

      const { error: updateError } = await supabaseAdmin
        .from('admin_impersonation_tokens')
        .update({ 
          token: newToken,
          expires_at: newExpiresAt.toISOString(),
          used_at: null
        })
        .eq('id', existingToken.id);

      if (updateError) {
        return new Response(
          JSON.stringify({ error: 'Erreur lors du rafraîchissement' }),
          { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }

      return new Response(
        JSON.stringify({ 
          success: true,
          token: newToken,
          expiresAt: newExpiresAt.toISOString()
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
