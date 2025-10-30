import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.39.3";
import { Resend } from "https://esm.sh/resend@4.0.0";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

interface VerificationRequest {
  type: 'email_change' | 'password_change';
  newValue?: string;
}

const resend = new Resend(Deno.env.get("RESEND_API_KEY"));

const handler = async (req: Request): Promise<Response> => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const authHeader = req.headers.get("Authorization");
    console.log("Auth header received:", authHeader ? "Present" : "Missing");
    
    if (!authHeader) {
      console.error("No authorization header found");
      throw new Error("No authorization header");
    }

    const supabase = createClient(
      Deno.env.get("SUPABASE_URL") ?? "",
      Deno.env.get("SUPABASE_ANON_KEY") ?? "",
      {
        global: {
          headers: {
            Authorization: authHeader,
          },
        },
      }
    );

    const {
      data: { user },
      error: userError,
    } = await supabase.auth.getUser();

    console.log("User lookup result:", { hasUser: !!user, error: userError?.message });

    if (userError || !user) {
      console.error("User authentication failed:", userError?.message);
      throw new Error("Unauthorized");
    }
    
    console.log("User authenticated successfully:", user.email);

    const { type, newValue }: VerificationRequest = await req.json();

    // Generate 6-digit code
    const code = Math.floor(100000 + Math.random() * 900000).toString();

    // Save code to database
    const { error: insertError } = await supabase
      .from("verification_codes")
      .insert({
        user_id: user.id,
        code,
        type,
        new_value: newValue || null,
      });

    if (insertError) {
      console.error("Error inserting verification code:", insertError);
      throw insertError;
    }

    // Send verification code
    if (type === 'password_change') {
      // Send code to email
      const { error: emailError } = await resend.emails.send({
        from: "AMZing FBA <onboarding@resend.dev>",
        to: [user.email!],
        subject: "Code de vérification - Changement de mot de passe",
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
            <h1 style="color: #FF9900;">AMZing FBA</h1>
            <h2>Code de vérification</h2>
            <p>Vous avez demandé à changer votre mot de passe.</p>
            <p>Voici votre code de vérification :</p>
            <div style="background: #f5f5f5; padding: 20px; text-align: center; margin: 20px 0;">
              <h1 style="font-size: 48px; letter-spacing: 10px; margin: 0; color: #FF9900;">${code}</h1>
            </div>
            <p>Ce code expire dans 10 minutes.</p>
            <p>Si vous n'avez pas demandé ce changement, ignorez cet email.</p>
          </div>
        `,
      });

      if (emailError) {
        console.error("Error sending email:", emailError);
        throw new Error("Impossible d'envoyer l'email de vérification");
      }
    } else if (type === 'email_change') {
      // Get user's phone number
      const { data: profile } = await supabase
        .from("profiles")
        .select("phone")
        .eq("id", user.id)
        .single();

      if (!profile?.phone) {
        throw new Error("Aucun numéro de téléphone enregistré. Veuillez d'abord ajouter un numéro de téléphone.");
      }

      // For SMS, you would need to integrate with a service like Twilio
      // For now, we'll send to email as fallback
      console.log(`SMS Code for ${profile.phone}: ${code}`);
      
      // Send to email as backup/demo
      const { error: emailError } = await resend.emails.send({
        from: "AMZing FBA <onboarding@resend.dev>",
        to: [user.email!],
        subject: "Code de vérification - Changement d'email",
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
            <h1 style="color: #FF9900;">AMZing FBA</h1>
            <h2>Code de vérification</h2>
            <p>Vous avez demandé à changer votre adresse email.</p>
            <p><strong>Note:</strong> Ce code devrait normalement être envoyé par SMS au ${profile.phone}</p>
            <p>Voici votre code de vérification :</p>
            <div style="background: #f5f5f5; padding: 20px; text-align: center; margin: 20px 0;">
              <h1 style="font-size: 48px; letter-spacing: 10px; margin: 0; color: #FF9900;">${code}</h1>
            </div>
            <p>Ce code expire dans 10 minutes.</p>
            <p>Si vous n'avez pas demandé ce changement, ignorez cet email.</p>
          </div>
        `,
      });

      if (emailError) {
        console.error("Error sending email:", emailError);
        throw new Error("Impossible d'envoyer le code de vérification");
      }
    }

    return new Response(
      JSON.stringify({ success: true, message: "Code envoyé avec succès" }),
      {
        status: 200,
        headers: { "Content-Type": "application/json", ...corsHeaders },
      }
    );
  } catch (error: any) {
    console.error("Error in send-verification-code:", error);
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        status: 500,
        headers: { "Content-Type": "application/json", ...corsHeaders },
      }
    );
  }
};

serve(handler);
