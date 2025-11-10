import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.39.3";
import { Resend } from "https://esm.sh/resend@4.0.0";
import { hash } from "https://deno.land/x/scrypt@v4.2.1/mod.ts";

const resend = new Resend(Deno.env.get("RESEND_API_KEY"));

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

interface SignupRequest {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  companyType: string;
  companyName?: string;
  siret?: string;
  billingAddress: string;
  phone: string;
  iban: string;
  bic: string;
  referralCode?: string;
}

const handler = async (req: Request): Promise<Response> => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const data: SignupRequest = await req.json();

    console.log("=== AFFILIATE SIGNUP REQUEST ===");
    console.log("Email:", data.email);

    const supabaseAdmin = createClient(
      Deno.env.get("SUPABASE_URL") ?? "",
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? ""
    );

    // Check if email already exists
    const { data: existingUser } = await supabaseAdmin
      .from("affiliate_users")
      .select("id")
      .eq("email", data.email.toLowerCase())
      .single();

    if (existingUser) {
      throw new Error("Un compte existe déjà avec cet email");
    }

    // Generate verification code
    const verificationCode = Math.floor(100000 + Math.random() * 900000).toString();

    // Generate unique referral code
    const { data: referralCodeData, error: referralCodeError } = await supabaseAdmin
      .rpc("generate_affiliate_referral_code");

    if (referralCodeError) {
      throw new Error("Erreur lors de la génération du code de parrainage");
    }

    // Hash password
    const passwordHash = await hash(data.password);

    // Create user
    const { data: newUser, error: insertError } = await supabaseAdmin
      .from("affiliate_users")
      .insert({
        first_name: data.firstName,
        last_name: data.lastName,
        email: data.email.toLowerCase(),
        password_hash: passwordHash,
        verification_code: verificationCode,
        company_type: data.companyType,
        company_name: data.companyName,
        siret: data.siret,
        billing_address: data.billingAddress,
        phone: data.phone,
        iban: data.iban,
        bic: data.bic,
        referral_code: referralCodeData,
        email_verified: false,
      })
      .select()
      .single();

    if (insertError) {
      console.error("Insert error:", insertError);
      throw new Error("Erreur lors de la création du compte");
    }

    // If user came from a referral link, create the referral relationship
    if (data.referralCode) {
      const { data: referrer } = await supabaseAdmin
        .from("affiliate_users")
        .select("id")
        .eq("referral_code", data.referralCode)
        .single();

      if (referrer) {
        await supabaseAdmin.from("affiliate_referrals").insert({
          referred_email: data.email.toLowerCase(),
          referred_user_id: newUser.id,
          referrer_user_id: referrer.id,
          payment_status: "en attente",
        });
      }
    }

    // Send verification email with custom HTML
    const emailResponse = await resend.emails.send({
      from: "AMZing FBA Affiliate <affiliation@amzingfba.com>",
      to: [data.email],
      subject: "Code de vérification - AMZing FBA Affiliate",
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
                          Bienvenue sur AMZing FBA Affiliate ! 🎉
                        </h1>
                      </td>
                    </tr>
                    <tr>
                      <td style="padding: 0 40px;">
                        <p style="margin: 16px 0; color: #525252; font-size: 16px; line-height: 24px;">
                          Bonjour ${data.firstName},
                        </p>
                        <p style="margin: 16px 0; color: #525252; font-size: 16px; line-height: 24px;">
                          Merci de vous être inscrit au programme d'affiliation AMZing FBA. 
                          Pour activer votre compte, veuillez utiliser le code de vérification ci-dessous :
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
                        <p style="margin: 16px 0; color: #525252; font-size: 16px; line-height: 24px;">
                          Si vous n'avez pas demandé ce code, vous pouvez ignorer cet email en toute sécurité.
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
        message: "Code de vérification envoyé par email",
        userId: newUser.id,
      }),
      {
        status: 200,
        headers: { "Content-Type": "application/json", ...corsHeaders },
      }
    );
  } catch (error: any) {
    console.error("Error in affiliate-signup:", error);
    
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
