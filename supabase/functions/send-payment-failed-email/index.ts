import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { Resend } from "https://esm.sh/resend@4.0.0";

const resend = new Resend(Deno.env.get("RESEND_API_KEY"));

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

interface PaymentFailedRequest {
  email: string;
  full_name: string;
  expires_at: string;
}

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { email, full_name, expires_at }: PaymentFailedRequest = await req.json();
    
    console.log(`[PAYMENT-FAILED-EMAIL] Sending email to ${email}`);

    const expiresDate = new Date(expires_at);
    const formattedDate = expiresDate.toLocaleDateString('fr-FR', {
      day: 'numeric',
      month: 'long',
      year: 'numeric'
    });

    const emailResponse = await resend.emails.send({
      from: "AMZing FBA <contact@amzingfba.com>",
      to: [email],
      subject: "⚠️ Échec de paiement - Action requise",
      html: `
        <!DOCTYPE html>
        <html>
          <head>
            <meta charset="utf-8">
            <style>
              body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
              .container { max-width: 600px; margin: 0 auto; padding: 20px; }
              .header { background: linear-gradient(135deg, #FF9900 0%, #FF6600 100%); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
              .content { background: #f9f9f9; padding: 30px; border-radius: 0 0 10px 10px; }
              .alert { background: #fff3cd; border-left: 4px solid #ff9900; padding: 15px; margin: 20px 0; }
              .button { display: inline-block; background: #FF9900; color: white; padding: 12px 30px; text-decoration: none; border-radius: 5px; margin: 20px 0; }
              .footer { text-align: center; margin-top: 20px; color: #666; font-size: 12px; }
            </style>
          </head>
          <body>
            <div class="container">
              <div class="header">
                <h1>⚠️ Échec de paiement</h1>
              </div>
              <div class="content">
                <p>Bonjour ${full_name || 'cher utilisateur'},</p>
                
                <div class="alert">
                  <strong>Votre paiement a été refusé</strong><br>
                  Date d'échec : ${formattedDate}
                </div>
                
                <p>Nous avons tenté de prélever le montant de votre abonnement VIP, mais le paiement a échoué.</p>
                
                <p><strong>Raisons possibles :</strong></p>
                <ul>
                  <li>Fonds insuffisants sur votre carte bancaire</li>
                  <li>Carte expirée ou bloquée</li>
                  <li>Problème technique avec votre banque</li>
                </ul>
                
                <p><strong>Action requise :</strong></p>
                <p>Pour continuer à profiter de votre abonnement VIP et accéder à tous nos services premium, veuillez mettre à jour votre moyen de paiement.</p>
                
                <div style="text-align: center;">
                  <a href="https://wvmfzlogijvqcsgablrb.supabase.co" class="button">
                    Mettre à jour mon paiement
                  </a>
                </div>
                
                <p style="margin-top: 30px;">Si vous avez des questions ou besoin d'aide, n'hésitez pas à nous contacter via le support.</p>
                
                <p>Cordialement,<br><strong>L'équipe AMZing FBA</strong></p>
              </div>
              <div class="footer">
                <p>© ${new Date().getFullYear()} AMZing FBA - Tous droits réservés</p>
              </div>
            </div>
          </body>
        </html>
      `,
    });

    console.log(`[PAYMENT-FAILED-EMAIL] Email sent successfully to ${email}:`, emailResponse);

    return new Response(JSON.stringify({ success: true, data: emailResponse }), {
      status: 200,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (error: any) {
    console.error("[PAYMENT-FAILED-EMAIL] Error:", error);
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
