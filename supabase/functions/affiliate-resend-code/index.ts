import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.39.3";
import { Resend } from "https://esm.sh/resend@4.0.0";

const resend = new Resend(Deno.env.get("RESEND_API_KEY"));

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

interface ResendRequest {
  email: string;
}

const handler = async (req: Request): Promise<Response> => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { email }: ResendRequest = await req.json();

    console.log("=== AFFILIATE RESEND CODE REQUEST ===");
    console.log("Email:", email);

    const supabaseAdmin = createClient(
      Deno.env.get("SUPABASE_URL") ?? "",
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? ""
    );

    // Get user
    const { data: user, error: getUserError } = await supabaseAdmin
      .from("affiliate_users")
      .select("*")
      .eq("email", email.toLowerCase())
      .single();

    if (getUserError || !user) {
      throw new Error("Utilisateur non trouvé");
    }

    if (user.email_verified) {
      throw new Error("Email déjà vérifié");
    }

    // Generate new verification code
    const verificationCode = Math.floor(100000 + Math.random() * 900000).toString();

    // Update user with new code
    const { error: updateError } = await supabaseAdmin
      .from("affiliate_users")
      .update({ verification_code: verificationCode })
      .eq("id", user.id);

    if (updateError) {
      throw new Error("Erreur lors de la génération du nouveau code");
    }

    // Send verification email with custom HTML
    const emailResponse = await resend.emails.send({
      from: "AMZing FBA Affiliate <onboarding@resend.dev>",
      to: [email],
      subject: "Nouveau code de vérification - AMZing FBA Affiliate",
      html: `
        <!DOCTYPE html>
        <html>
          <head>
            <meta charset="utf-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
          </head>
          <body style="margin: 0; padding: 0; background-color: #f6f9fc; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Ubuntu, sans-serif;">
            <table role="presentation" style="width: 100%; border-collapse: collapse;">
              <tr>
                <td style="padding: 40px 0; text-align: center;">
                  <table role="presentation" style="max-width: 600px; margin: 0 auto; background-color: #ffffff; border-radius: 8px; box-shadow: 0 2px 8px rgba(0,0,0,0.05);">
                    <tr>
                      <td style="padding: 40px 40px 20px;">
                        <h1 style="margin: 0; color: #1a1a1a; font-size: 32px; font-weight: bold; text-align: center;">
                          Nouveau code de vérification 🔄
                        </h1>
                      </td>
                    </tr>
                    <tr>
                      <td style="padding: 0 40px;">
                        <p style="margin: 16px 0; color: #525252; font-size: 16px; line-height: 24px;">
                          Bonjour ${user.first_name},
                        </p>
                        <p style="margin: 16px 0; color: #525252; font-size: 16px; line-height: 24px;">
                          Voici votre nouveau code de vérification :
                        </p>
                      </td>
                    </tr>
                    <tr>
                      <td style="padding: 32px 40px;">
                        <table role="presentation" style="width: 100%; background-color: #f4f4f4; border-radius: 8px;">
                          <tr>
                            <td style="padding: 24px; text-align: center;">
                              <div style="font-size: 48px; font-weight: bold; letter-spacing: 8px; color: #000000; font-family: monospace;">
                                ${verificationCode}
                              </div>
                            </td>
                          </tr>
                        </table>
                      </td>
                    </tr>
                    <tr>
                      <td style="padding: 0 40px;">
                        <p style="margin: 16px 0; color: #525252; font-size: 16px; line-height: 24px;">
                          Ce code est valable pendant <strong>10 minutes</strong>.
                        </p>
                      </td>
                    </tr>
                    <tr>
                      <td style="padding: 48px 40px 40px;">
                        <p style="margin: 0; color: #898989; font-size: 14px; line-height: 24px;">
                          Cordialement,<br>
                          L'équipe AMZing FBA
                        </p>
                      </td>
                    </tr>
                  </table>
                </td>
              </tr>
            </table>
          </body>
        </html>
      `,
    });

    console.log("Email sent:", emailResponse);

    return new Response(
      JSON.stringify({ 
        success: true, 
        message: "Nouveau code envoyé par email",
      }),
      {
        status: 200,
        headers: { "Content-Type": "application/json", ...corsHeaders },
      }
    );
  } catch (error: any) {
    console.error("Error in affiliate-resend-code:", error);
    
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        status: 400,
        headers: { "Content-Type": "application/json", ...corsHeaders },
      }
    );
  }
};

serve(handler);
