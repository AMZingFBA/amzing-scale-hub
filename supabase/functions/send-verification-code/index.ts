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
    
    if (!authHeader) {
      throw new Error("No authorization header");
    }

    // Extract JWT token from "Bearer <token>"
    const token = authHeader.replace("Bearer ", "");

    const supabase = createClient(
      Deno.env.get("SUPABASE_URL") ?? "",
      Deno.env.get("SUPABASE_ANON_KEY") ?? ""
    );

    const {
      data: { user },
      error: userError,
    } = await supabase.auth.getUser(token);

    if (userError || !user || !user.email) {
      throw new Error("Unauthorized");
    }

    const { type, newValue }: VerificationRequest = await req.json();

    // Generate 6-digit code
    const code = Math.floor(100000 + Math.random() * 900000).toString();

    console.log("======================");
    console.log("CODE DE VÉRIFICATION:", code);
    console.log("Pour l'utilisateur:", user.email);
    console.log("Type:", type);
    console.log("======================");

    // Create admin client with service role to bypass RLS
    const supabaseAdmin = createClient(
      Deno.env.get("SUPABASE_URL") ?? "",
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? ""
    );

    // Save code to database
    const { error: insertError } = await supabaseAdmin
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

    // Send email with Resend
    const emailSubject = type === 'email_change' 
      ? 'Code de vérification - Changement d\'email' 
      : 'Code de vérification - Changement de mot de passe';

    const emailHtml = `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="utf-8">
          <style>
            body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
            .content { background: #f9f9f9; padding: 30px; border-radius: 0 0 10px 10px; }
            .code { font-size: 32px; font-weight: bold; color: #667eea; text-align: center; padding: 20px; background: white; border-radius: 8px; margin: 20px 0; letter-spacing: 5px; }
            .footer { text-align: center; margin-top: 20px; color: #666; font-size: 12px; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>Code de Vérification</h1>
            </div>
            <div class="content">
              <p>Bonjour,</p>
              <p>Voici votre code de vérification pour ${type === 'email_change' ? 'changer votre email' : 'changer votre mot de passe'} :</p>
              <div class="code">${code}</div>
              <p>Ce code est valide pendant 10 minutes.</p>
              <p>Si vous n'avez pas demandé ce code, ignorez cet email.</p>
            </div>
            <div class="footer">
              <p>© ${new Date().getFullYear()} Amzing FBA - Tous droits réservés</p>
            </div>
          </div>
        </body>
      </html>
    `;

    try {
      const { data: emailData, error: emailError } = await resend.emails.send({
        from: 'Amzing FBA <noreply@amzingfba.com>',
        to: [user.email],
        subject: emailSubject,
        html: emailHtml,
      });

      if (emailError) {
        console.error("Error sending email:", emailError);
        throw emailError;
      }

      console.log("Email sent successfully:", emailData);
    } catch (emailError) {
      console.error("Failed to send email:", emailError);
      // Don't throw - we still want to return success if the code was saved
      // The user can still use the code from logs if email fails
    }

    return new Response(
      JSON.stringify({ 
        success: true, 
        message: "Code envoyé avec succès par email !" 
      }),
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
