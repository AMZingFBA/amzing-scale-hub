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
      subject: "Échec de paiement - Action requise pour votre abonnement VIP",
      replyTo: "contact@amzingfba.com",
      text: `
Bonjour ${full_name || 'cher utilisateur'},

Votre paiement a été refusé
Date d'échec : ${formattedDate}

Nous avons tenté de prélever le montant de votre abonnement VIP, mais le paiement a échoué.

Raisons possibles :
- Fonds insuffisants sur votre carte bancaire
- Carte expirée ou bloquée
- Problème technique avec votre banque

Action requise :
Pour continuer à profiter de votre abonnement VIP et accéder à tous nos services premium, veuillez mettre à jour votre moyen de paiement en vous connectant à votre compte.

Si vous avez des questions ou besoin d'aide, n'hésitez pas à nous contacter via le support.

Cordialement,
L'équipe AMZing FBA

© ${new Date().getFullYear()} AMZing FBA - Tous droits réservés

Se désabonner des emails : https://www.amzingfba.com/
      `,
      html: `
        <!DOCTYPE html>
        <html lang="fr">
          <head>
            <meta charset="utf-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <meta http-equiv="Content-Type" content="text/html; charset=UTF-8">
            <title>Échec de paiement - AMZing FBA</title>
            <style>
              body { 
                font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
                line-height: 1.6; 
                color: #333;
                margin: 0;
                padding: 0;
                background-color: #f4f4f4;
              }
              .container { 
                max-width: 600px; 
                margin: 20px auto; 
                background: #ffffff;
                border-radius: 10px;
                overflow: hidden;
                box-shadow: 0 2px 8px rgba(0,0,0,0.1);
              }
              .header { 
                background: linear-gradient(135deg, #FF9900 0%, #FF6600 100%); 
                color: white; 
                padding: 40px 30px; 
                text-align: center;
              }
              .header h1 {
                margin: 0;
                font-size: 24px;
                font-weight: 600;
              }
              .content { 
                background: #ffffff; 
                padding: 40px 30px;
              }
              .alert { 
                background: #fff3cd; 
                border-left: 4px solid #ff9900; 
                padding: 15px 20px; 
                margin: 25px 0;
                border-radius: 4px;
              }
              .alert strong {
                display: block;
                margin-bottom: 8px;
                color: #856404;
              }
              .button { 
                display: inline-block; 
                background: #FF9900; 
                color: white; 
                padding: 14px 32px; 
                text-decoration: none; 
                border-radius: 6px; 
                margin: 25px 0;
                font-weight: 600;
                transition: background 0.3s ease;
              }
              .button:hover {
                background: #FF6600;
              }
              ul {
                margin: 15px 0;
                padding-left: 20px;
              }
              ul li {
                margin: 8px 0;
              }
              .footer { 
                text-align: center; 
                padding: 20px 30px;
                color: #666; 
                font-size: 13px;
                background: #f9f9f9;
                border-top: 1px solid #e0e0e0;
              }
              .section-title {
                font-weight: 600;
                margin-top: 25px;
                margin-bottom: 10px;
                color: #333;
              }
              @media only screen and (max-width: 600px) {
                .container {
                  margin: 0;
                  border-radius: 0;
                }
                .header, .content, .footer {
                  padding: 30px 20px;
                }
              }
            </style>
          </head>
          <body>
            <div class="container">
              <div class="header">
                <h1>Échec de paiement</h1>
              </div>
              <div class="content">
                <p>Bonjour ${full_name || 'cher utilisateur'},</p>
                
                <div class="alert">
                  <strong>Votre paiement a été refusé</strong>
                  Date d'échec : ${formattedDate}
                </div>
                
                <p>Nous avons tenté de prélever le montant de votre abonnement VIP, mais le paiement a échoué.</p>
                
                <p class="section-title">Raisons possibles :</p>
                <ul>
                  <li>Fonds insuffisants sur votre carte bancaire</li>
                  <li>Carte expirée ou bloquée</li>
                  <li>Problème technique avec votre banque</li>
                </ul>
                
                <p class="section-title">Action requise :</p>
                <p>Pour continuer à profiter de votre abonnement VIP et accéder à tous nos services premium, veuillez mettre à jour votre moyen de paiement.</p>
                
                <div style="text-align: center;">
                  <a href="https://amzingfba.com/tarifs" class="button">
                    Mettre à jour mon paiement
                  </a>
                </div>
                
                <p style="margin-top: 30px;">Si vous avez des questions ou besoin d'aide, n'hésitez pas à nous contacter via le support.</p>
                
                <p style="margin-top: 25px;">Cordialement,<br><strong>L'équipe AMZing FBA</strong></p>
              </div>
              <div class="footer">
                <p>© ${new Date().getFullYear()} AMZing FBA - Tous droits réservés</p>
                <p style="margin-top: 10px;">
                  <a href="https://amzingfba.com" style="color: #666; text-decoration: none;">amzingfba.com</a>
                </p>
                <p style="margin-top: 15px; padding-top: 15px; border-top: 1px solid #e0e0e0;">
                  <a href="https://www.amzingfba.com/" style="color: #999; text-decoration: underline; font-size: 12px;">Se désabonner des emails</a>
                </p>
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
