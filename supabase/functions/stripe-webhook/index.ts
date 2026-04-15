import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import Stripe from "https://esm.sh/stripe@18.5.0";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.57.2";

const logStep = (step: string, details?: any) => {
  const detailsStr = details ? ` - ${JSON.stringify(details)}` : '';
  console.log(`[STRIPE-WEBHOOK] ${step}${detailsStr}`);
};

// Tradedoubler server-side tracking (Server to Server)
async function trackTradedoublerConversion(data: {
  transactionId: string;
  orderValue: number;
  voucher?: string;
  currency?: string;
  email?: string;
}) {
  try {
    const params = new URLSearchParams({
      organization: '2458850',
      event: '469662',
      orderNumber: data.transactionId,
      orderValue: data.orderValue.toFixed(2),
      currency: data.currency || 'EUR',
    });
    
    if (data.voucher) {
      params.append('voucher', data.voucher);
    }
    
    if (data.email) {
      const encoder = new TextEncoder();
      const emailData = encoder.encode(data.email.toLowerCase().trim());
      const hashBuffer = await crypto.subtle.digest('SHA-256', emailData);
      const hashArray = Array.from(new Uint8Array(hashBuffer));
      const hashHex = hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
      params.append('extid', hashHex);
      params.append('exttype', '1');
    }

    const trackingUrl = `https://tbs.tradedoubler.com/report?${params.toString()}`;
    
    logStep("Sending Tradedoubler S2S conversion", { 
      transactionId: data.transactionId, 
      orderValue: data.orderValue,
      url: trackingUrl 
    });

    const response = await fetch(trackingUrl, {
      method: 'GET',
      headers: {
        'User-Agent': 'Mozilla/5.0 (compatible; AmzingFBA-Server/1.0)',
        'Accept': '*/*',
      },
    });

    const responseText = await response.text();
    logStep("Tradedoubler response", { status: response.status, bodyLength: responseText.length });
    return response.ok;
  } catch (error) {
    logStep("Tradedoubler tracking error", { error: error instanceof Error ? error.message : 'Unknown' });
    return false;
  }
}

// Function to sync user to Airtable
async function syncUserToAirtable(userData: {
  email: string;
  full_name?: string;
  plan_type: string;
  subscription_type?: string;
  started_at?: string;
  stripe_customer_id?: string;
}) {
  const AIRTABLE_API_KEY = Deno.env.get('AIRTABLE_API_KEY');
  const AIRTABLE_BASE_ID = Deno.env.get('AIRTABLE_BASE_ID');
  
  if (!AIRTABLE_API_KEY || !AIRTABLE_BASE_ID) {
    logStep("Airtable not configured, skipping sync");
    return;
  }

  try {
    const searchUrl = `https://api.airtable.com/v0/${AIRTABLE_BASE_ID}/Users?filterByFormula={Email (principal)}="${userData.email}"`;
    const searchResponse = await fetch(searchUrl, {
      headers: { 'Authorization': `Bearer ${AIRTABLE_API_KEY}` },
    });
    const searchData = await searchResponse.json();

    let typeAbonnement = 'Gratuit';
    if (userData.plan_type === 'vip') {
      typeAbonnement = userData.subscription_type || 'Annuel';
    }

    const fields: Record<string, unknown> = {
      "Email (principal)": userData.email,
      "Nom": userData.full_name || '',
      "Abonnement actif": userData.plan_type === 'vip',
      "Type d’abonnement": typeAbonnement,
      "ID Stripe / RevenueCat": userData.stripe_customer_id || '',
      "Dernière connexion": new Date().toISOString().split('T')[0],
    };

    if (userData.started_at && userData.plan_type === 'vip') {
      fields["date activation"] = new Date(userData.started_at).toISOString().split('T')[0];
    }

    if (searchData.records && searchData.records.length > 0) {
      const recordId = searchData.records[0].id;
      await fetch(`https://api.airtable.com/v0/${AIRTABLE_BASE_ID}/Users/${recordId}`, {
        method: 'PATCH',
        headers: {
          'Authorization': `Bearer ${AIRTABLE_API_KEY}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ fields }),
      });
      logStep("Airtable user updated", { email: userData.email, typeAbonnement });
    } else {
      await fetch(`https://api.airtable.com/v0/${AIRTABLE_BASE_ID}/Users`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${AIRTABLE_API_KEY}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ records: [{ fields }] }),
      });
      logStep("Airtable user created", { email: userData.email, typeAbonnement });
    }
  } catch (error) {
    logStep("Airtable sync error", { error: error instanceof Error ? error.message : 'Unknown' });
  }
}

// ============================================================
// Generate professional invoice PDF matching company template
// ============================================================
function generateProfessionalInvoicePdf(data: {
  invoiceNumber: string;
  invoiceDate: string;
  dueDate: string;
  clientName: string;
  clientEmail: string;
  clientSiren?: string;
  amount: number;
}): Uint8Array {
  const esc = (s: string) => s.replace(/\\/g, '\\\\').replace(/\(/g, '\\(').replace(/\)/g, '\\)');
  const formatDate = (d: string) => {
    try {
      const parts = d.split('-');
      if (parts.length === 3) return `${parts[2]}/${parts[1]}/${parts[0]}`;
      return d;
    } catch { return d; }
  };

  const fmtDate = formatDate(data.invoiceDate);
  const fmtDue = formatDate(data.dueDate);
  const amountStr = data.amount.toFixed(2).replace('.', ',');

  const lines: string[] = [];
  let y = 750;

  lines.push(`BT /F1 28 Tf 50 ${y} Td (Facture) Tj ET`);
  y -= 40;

  lines.push(`BT /F1 10 Tf 50 ${y} Td (${esc(`Num\\351ro de facture`)}) Tj ET`);
  lines.push(`BT /F2 10 Tf 220 ${y} Td (${esc(data.invoiceNumber)}) Tj ET`);
  y -= 16;
  lines.push(`BT /F1 10 Tf 50 ${y} Td (Date d'\\351mission) Tj ET`);
  lines.push(`BT /F2 10 Tf 220 ${y} Td (${esc(fmtDate)}) Tj ET`);
  y -= 16;
  lines.push(`BT /F1 10 Tf 50 ${y} Td (Date d'\\351ch\\351ance) Tj ET`);
  lines.push(`BT /F2 10 Tf 220 ${y} Td (${esc(fmtDue)}) Tj ET`);
  y -= 30;

  lines.push(`0.85 0.85 0.85 RG 0.5 w 50 ${y} m 560 ${y} l S`);
  y -= 25;

  lines.push(`BT /F1 11 Tf 50 ${y} Td (EI - Zaghdoun Noa / N.Z Consulting) Tj ET`);
  lines.push(`BT /F1 11 Tf 310 ${y} Td (${esc(data.clientName)}) Tj ET`);
  y -= 16;
  lines.push(`BT /F2 9 Tf 50 ${y} Td (59 Rue De Ponthieu, Bureau 326) Tj ET`);
  lines.push(`BT /F2 9 Tf 310 ${y} Td (${esc(data.clientEmail)}) Tj ET`);
  y -= 14;
  lines.push(`BT /F2 9 Tf 50 ${y} Td (75008 Paris, FR) Tj ET`);
  if (data.clientSiren) {
    lines.push(`BT /F2 9 Tf 310 ${y} Td (SIREN: ${esc(data.clientSiren)}) Tj ET`);
  }
  y -= 14;
  lines.push(`BT /F2 9 Tf 50 ${y} Td (amzingfba26@gmail.com) Tj ET`);
  y -= 14;
  lines.push(`BT /F2 9 Tf 50 ${y} Td (SIRET: 99334892900015) Tj ET`);
  y -= 35;

  const tableTop = y;
  lines.push(`0.93 0.93 0.93 rg 50 ${y - 4} 510 20 re f`);
  lines.push(`0 0 0 rg`);
  lines.push(`BT /F1 9 Tf 55 ${y} Td (Description) Tj ET`);
  lines.push(`BT /F1 9 Tf 310 ${y} Td (Qt\\351) Tj ET`);
  lines.push(`BT /F1 9 Tf 360 ${y} Td (Prix unitaire) Tj ET`);
  lines.push(`BT /F1 9 Tf 445 ${y} Td (TVA \\(%\\)) Tj ET`);
  lines.push(`BT /F1 9 Tf 510 ${y} Td (Total HT) Tj ET`);
  y -= 25;

  lines.push(`BT /F2 9 Tf 55 ${y} Td (VIP - AMZING FBA) Tj ET`);
  lines.push(`BT /F2 9 Tf 318 ${y} Td (1) Tj ET`);
  lines.push(`BT /F2 9 Tf 360 ${y} Td (${esc(amountStr)} \\200) Tj ET`);
  lines.push(`BT /F2 9 Tf 455 ${y} Td (0 %) Tj ET`);
  lines.push(`BT /F2 9 Tf 510 ${y} Td (${esc(amountStr)} \\200) Tj ET`);
  y -= 20;

  lines.push(`0.85 0.85 0.85 RG 0.5 w 50 ${y} m 560 ${y} l S`);
  y -= 20;

  lines.push(`BT /F1 9 Tf 360 ${y} Td (Total HT) Tj ET`);
  lines.push(`BT /F2 9 Tf 510 ${y} Td (${esc(amountStr)} \\200) Tj ET`);
  y -= 18;
  lines.push(`BT /F1 9 Tf 360 ${y} Td (Montant total de la TVA) Tj ET`);
  lines.push(`BT /F2 9 Tf 510 ${y} Td (0,00 \\200) Tj ET`);
  y -= 18;
  lines.push(`0.85 0.85 0.85 RG 0.5 w 360 ${y + 14} m 560 ${y + 14} l S`);
  lines.push(`BT /F1 10 Tf 360 ${y} Td (Total TTC) Tj ET`);
  lines.push(`BT /F1 10 Tf 510 ${y} Td (${esc(amountStr)} \\200) Tj ET`);
  y -= 35;

  lines.push(`BT /F2 8 Tf 50 ${y} Td (TVA non applicable, art. 293 B du CGI) Tj ET`);
  y -= 20;
  lines.push(`BT /F2 7 Tf 50 ${y} Td (Pas d'escompte accord\\351 pour paiement anticip\\351.) Tj ET`);
  y -= 12;
  lines.push(`BT /F2 7 Tf 50 ${y} Td (En cas de non-paiement \\340 la date d'\\351ch\\351ance, des p\\351nalit\\351s calcul\\351es \\340 trois fois le taux) Tj ET`);
  y -= 12;
  lines.push(`BT /F2 7 Tf 50 ${y} Td (d'int\\351r\\352t l\\351gal seront appliqu\\351es.) Tj ET`);
  y -= 12;
  lines.push(`BT /F2 7 Tf 50 ${y} Td (Tout retard de paiement entra\\356nera une indemnit\\351 forfaitaire pour frais de recouvrement de 40\\200.) Tj ET`);
  y -= 40;

  lines.push(`0.93 0.93 0.93 rg 50 ${y - 4} 510 20 re f`);
  lines.push(`0 0 0 rg`);
  lines.push(`BT /F1 10 Tf 55 ${y} Td (D\\351tails du paiement) Tj ET`);
  y -= 22;
  lines.push(`BT /F1 9 Tf 55 ${y} Td (Nom du b\\351n\\351ficiaire) Tj ET`);
  lines.push(`BT /F2 9 Tf 220 ${y} Td (EI - Zaghdoun Noa / N.Z Consulting) Tj ET`);
  y -= 15;
  lines.push(`BT /F1 9 Tf 55 ${y} Td (BIC) Tj ET`);
  lines.push(`BT /F2 9 Tf 220 ${y} Td (QNTOFRP1XXX) Tj ET`);
  y -= 15;
  lines.push(`BT /F1 9 Tf 55 ${y} Td (IBAN) Tj ET`);
  lines.push(`BT /F2 9 Tf 220 ${y} Td (FR7616958000019328768276650) Tj ET`);
  y -= 15;
  lines.push(`BT /F1 9 Tf 55 ${y} Td (R\\351f\\351rence) Tj ET`);
  lines.push(`BT /F2 9 Tf 220 ${y} Td (${esc(data.invoiceNumber)}) Tj ET`);
  y -= 30;

  lines.push(`0.85 0.85 0.85 RG 0.5 w 50 ${y} m 560 ${y} l S`);
  y -= 15;
  lines.push(`BT /F2 8 Tf 50 ${y} Td (EI - Zaghdoun Noa / N.Z Consulting, EI) Tj ET`);
  lines.push(`BT /F2 8 Tf 460 ${y} Td (${esc(data.invoiceNumber)} \\267 1/1) Tj ET`);

  const streamContent = lines.join('\n');
  const streamLen = new TextEncoder().encode(streamContent).length;

  const obj1 = '1 0 obj\n<< /Type /Catalog /Pages 2 0 R >>\nendobj\n';
  const obj2 = '2 0 obj\n<< /Type /Pages /Kids [3 0 R] /Count 1 >>\nendobj\n';
  const obj3 = `3 0 obj\n<< /Type /Page /MediaBox [0 0 612 792] /Parent 2 0 R /Resources << /Font << /F1 4 0 R /F2 5 0 R >> >> /Contents 6 0 R >>\nendobj\n`;
  const obj4 = '4 0 obj\n<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica-Bold >>\nendobj\n';
  const obj5 = '5 0 obj\n<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica >>\nendobj\n';
  const obj6 = `6 0 obj\n<< /Length ${streamLen} >>\nstream\n${streamContent}\nendstream\nendobj\n`;

  const pdfBody = '%PDF-1.4\n' + obj1 + obj2 + obj3 + obj4 + obj5 + obj6;
  const bodyBytes = new TextEncoder().encode(pdfBody);

  const xrefOffset = bodyBytes.length;
  const xref = `xref\n0 7\n0000000000 65535 f \n`;
  const trailer = `trailer\n<< /Size 7 /Root 1 0 R >>\nstartxref\n${xrefOffset}\n%%EOF`;

  return new TextEncoder().encode(pdfBody + xref + trailer);
}

// ============================================================
// RUBYPAYEUR: Auto-submit failed payment for debt collection
// ============================================================
async function submitToRubypayeur(data: {
  email: string;
  full_name: string;
  phone?: string;
  siren?: string;
  amount: number;
  invoiceNumber: string;
  invoiceDate: string;
  dueDate: string;
  failedPaymentId: string;
  stripeInvoiceId?: string;
}, supabaseClient: any) {
  const RUBYPAYEUR_TOKEN = Deno.env.get('RUBYPAYEUR_TOKEN');
  if (!RUBYPAYEUR_TOKEN) {
    logStep("RUBYPAYEUR_TOKEN not configured, skipping submission");
    return null;
  }

  try {
    // Step 1: Authenticate to get Bearer token
    logStep("Rubypayeur: authenticating...");
    const authResponse = await fetch('https://rubypayeur.com/api/debt_auth', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ token: RUBYPAYEUR_TOKEN }),
    });

    if (!authResponse.ok) {
      const errText = await authResponse.text();
      logStep("Rubypayeur auth failed", { status: authResponse.status, body: errText });
      return null;
    }

    const authData = await authResponse.json();
    const authToken = authData.auth_token;
    if (!authToken) {
      logStep("Rubypayeur: no auth_token in response", authData);
      return null;
    }
    logStep("Rubypayeur: authenticated successfully");

    // Step 2: Create debt recovery case
    // Parse name into first/last
    const nameParts = (data.full_name || 'Client Inconnu').trim().split(' ');
    const firstName = nameParts[0] || 'Client';
    const lastName = nameParts.slice(1).join(' ') || 'Inconnu';

    const formData = new FormData();
    // Debtor info - use SIREN from profile if available
    formData.append('debt[siren]', data.siren || '000000000');
    formData.append('debt[gender]', 'male');
    formData.append('debt[first_name]', firstName);
    formData.append('debt[last_name]', lastName);
    formData.append('debt[email]', data.email);
    formData.append('debt[phone]', data.phone || '0184807678');

    // Invoice info
    formData.append('debt[items_attributes][0][amount]', data.amount.toFixed(2));
    formData.append('debt[items_attributes][0][invoice_number]', data.invoiceNumber);
    formData.append('debt[items_attributes][0][invoiced_on]', data.invoiceDate);
    formData.append('debt[items_attributes][0][due_date]', data.dueDate);

    // General info
    formData.append('debt[late_fee]', '1');
    formData.append('debt[comment]', `Impayé abonnement VIP AMZing FBA - ${data.email} - Facture ${data.invoiceNumber}`);
    formData.append('debt[terms_agree]', '1');

    // Attach billing_proof (Stripe invoice PDF or generated fallback)
    let pdfAttached = false;
    if (data.stripeInvoiceId) {
      try {
        const STRIPE_SECRET_KEY = Deno.env.get('STRIPE_SECRET_KEY');
        if (STRIPE_SECRET_KEY) {
          const invoiceRes = await fetch(`https://api.stripe.com/v1/invoices/${data.stripeInvoiceId}`, {
            headers: { 'Authorization': `Bearer ${STRIPE_SECRET_KEY}` },
          });
          const invoiceData = await invoiceRes.json();
          if (invoiceData.invoice_pdf) {
            const pdfRes = await fetch(invoiceData.invoice_pdf);
            if (pdfRes.ok) {
              const pdfBlob = await pdfRes.blob();
              formData.append('debt[items_attributes][0][billing_proof]', pdfBlob, `facture-${data.invoiceNumber}.pdf`);
              pdfAttached = true;
              logStep("Rubypayeur: attached Stripe invoice PDF");
            }
          }
        }
      } catch (pdfErr) {
        logStep("Failed to fetch invoice PDF", { error: pdfErr instanceof Error ? pdfErr.message : 'Unknown' });
      }
    }

    // Fallback: generate a professional invoice PDF matching company template
    if (!pdfAttached) {
      try {
        const pdfBytes = generateProfessionalInvoicePdf({
          invoiceNumber: data.invoiceNumber,
          invoiceDate: data.invoiceDate,
          dueDate: data.dueDate,
          clientName: data.full_name,
          clientEmail: data.email,
          clientSiren: data.siren,
          amount: data.amount,
        });
        const pdfFile = new File([pdfBytes], `facture-${data.invoiceNumber}.pdf`, { type: 'application/pdf' });
        formData.append('debt[items_attributes][0][billing_proof]', pdfFile);
        logStep("Rubypayeur: attached professional invoice PDF", { size: pdfFile.size });
      } catch (genErr) {
        logStep("Failed to generate invoice PDF", { error: genErr instanceof Error ? genErr.message : 'Unknown' });
      }
    }

    logStep("Rubypayeur: creating debt case", { 
      email: data.email, 
      amount: data.amount,
      invoice: data.invoiceNumber 
    });

    const debtResponse = await fetch('https://rubypayeur.com/api/debts', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${authToken}`,
      },
      body: formData,
    });

    const debtResult = await debtResponse.json();
    logStep("Rubypayeur: debt response", { status: debtResponse.status, result: debtResult });

    if (debtResult.ref) {
      // Update the failed_payment record with Rubypayeur reference
      await supabaseClient
        .from('failed_payments')
        .update({
          rubypayeur_submitted: true,
          rubypayeur_submitted_at: new Date().toISOString(),
          rubypayeur_ref: debtResult.ref,
          rubypayeur_status: 'submitted',
        })
        .eq('id', data.failedPaymentId);

      logStep("Rubypayeur: case created successfully", { ref: debtResult.ref });
      return debtResult.ref;
    } else {
      logStep("Rubypayeur: case creation failed", debtResult);
      
      // Record the error
      await supabaseClient
        .from('failed_payments')
        .update({
          rubypayeur_status: 'error',
          notes: `Erreur Rubypayeur: ${JSON.stringify(debtResult.errors || debtResult)}`,
        })
        .eq('id', data.failedPaymentId);

      return null;
    }
  } catch (error) {
    logStep("Rubypayeur: submission error", { error: error instanceof Error ? error.message : 'Unknown' });
    return null;
  }
}

// Send payment failed email via Resend
async function sendPaymentFailedEmail(email: string, fullName: string, failedDate: string) {
  try {
    const RESEND_API_KEY = Deno.env.get('RESEND_API_KEY');
    if (!RESEND_API_KEY) {
      logStep("RESEND_API_KEY not configured, skipping email");
      return false;
    }

    const formattedDate = new Date(failedDate).toLocaleDateString('fr-FR', {
      day: 'numeric', month: 'long', year: 'numeric'
    });

    const response = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${RESEND_API_KEY}`,
      },
      body: JSON.stringify({
        from: 'AMZing FBA <contact@amzingfba.com>',
        to: [email],
        subject: 'Échec de paiement - Action requise pour votre abonnement VIP',
        replyTo: 'contact@amzingfba.com',
        html: `
          <!DOCTYPE html>
          <html lang="fr">
          <head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1.0">
          <style>
            body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Arial, sans-serif; line-height: 1.6; color: #333; margin: 0; padding: 0; background: #f4f4f4; }
            .container { max-width: 600px; margin: 20px auto; background: #fff; border-radius: 10px; overflow: hidden; box-shadow: 0 2px 8px rgba(0,0,0,0.1); }
            .header { background: linear-gradient(135deg, #FF9900, #FF6600); color: white; padding: 40px 30px; text-align: center; }
            .header h1 { margin: 0; font-size: 24px; }
            .content { padding: 40px 30px; }
            .alert { background: #fff3cd; border-left: 4px solid #ff9900; padding: 15px 20px; margin: 25px 0; border-radius: 4px; }
            .alert strong { display: block; margin-bottom: 8px; color: #856404; }
            .button { display: inline-block; background: #FF9900; color: white; padding: 14px 32px; text-decoration: none; border-radius: 6px; margin: 25px 0; font-weight: 600; }
            .footer { text-align: center; padding: 20px 30px; color: #666; font-size: 13px; background: #f9f9f9; border-top: 1px solid #e0e0e0; }
          </style></head>
          <body>
            <div class="container">
              <div class="header"><h1>Échec de paiement</h1></div>
              <div class="content">
                <p>Bonjour ${fullName || 'cher utilisateur'},</p>
                <div class="alert">
                  <strong>Votre paiement a été refusé</strong>
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
                <p>Pour continuer à profiter de votre abonnement VIP, veuillez mettre à jour votre moyen de paiement.</p>
                <div style="text-align:center;">
                  <a href="https://amzingfba.com/tarifs" class="button">Mettre à jour mon paiement</a>
                </div>
                <p style="margin-top:30px;">⚠️ <strong>Sans régularisation, votre dossier sera automatiquement transmis à notre partenaire de recouvrement.</strong></p>
                <p style="margin-top:25px;">Cordialement,<br><strong>L'équipe AMZing FBA</strong></p>
              </div>
              <div class="footer">
                <p>© ${new Date().getFullYear()} AMZing FBA - N.Z Consulting - Tous droits réservés</p>
                <p><a href="https://amzingfba.com" style="color:#666;text-decoration:none;">amzingfba.com</a></p>
              </div>
            </div>
          </body></html>
        `,
      }),
    });

    logStep("Payment failed email sent", { email, status: response.status });
    return response.ok;
  } catch (error) {
    logStep("Payment failed email error", { error: error instanceof Error ? error.message : 'Unknown' });
    return false;
  }
}

// ============================================================
// MAIN WEBHOOK HANDLER
// ============================================================
serve(async (req) => {
  try {
    logStep("Webhook received");

    const stripeKey = Deno.env.get("STRIPE_SECRET_KEY");
    if (!stripeKey) throw new Error("STRIPE_SECRET_KEY not configured");

    const stripe = new Stripe(stripeKey, { apiVersion: "2025-08-27.basil" });
    const signature = req.headers.get("stripe-signature");
    
    if (!signature) {
      throw new Error("No Stripe signature found");
    }

    const body = await req.text();
    
    const webhookSecret = Deno.env.get("STRIPE_WEBHOOK_SECRET");
    if (!webhookSecret) {
      logStep("WARNING: No webhook secret configured");
    }

    let event: Stripe.Event;
    
    if (webhookSecret) {
      try {
        event = await stripe.webhooks.constructEventAsync(body, signature, webhookSecret);
        logStep("Signature verified");
      } catch (err) {
        const errorMsg = err instanceof Error ? err.message : "Unknown error";
        logStep("Signature verification failed", { error: errorMsg });
        return new Response(JSON.stringify({ error: "Invalid signature" }), {
          status: 400,
          headers: { "Content-Type": "application/json" },
        });
      }
    } else {
      event = JSON.parse(body);
    }

    logStep("Event type", { type: event.type });

    const supabaseClient = createClient(
      Deno.env.get("SUPABASE_URL") ?? "",
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? ""
    );

    // ============================================================
    // CHECKOUT COMPLETED
    // ============================================================
    if (event.type === "checkout.session.completed") {
      const session = event.data.object as Stripe.Checkout.Session;
      logStep("Checkout completed", { sessionId: session.id });

      const customerEmail = session.customer_email || session.customer_details?.email;
      if (!customerEmail) {
        logStep("ERROR: No customer email found");
        return new Response(JSON.stringify({ error: "No customer email" }), {
          status: 400, headers: { "Content-Type": "application/json" },
        });
      }

      const { data: profile, error: profileError } = await supabaseClient
        .from("profiles")
        .select("id, full_name")
        .eq("email", customerEmail)
        .single();

      if (profileError || !profile) {
        logStep("ERROR: User not found", { email: customerEmail });
        return new Response(JSON.stringify({ error: "User not found" }), {
          status: 404, headers: { "Content-Type": "application/json" },
        });
      }

      const expiresAt = new Date();
      expiresAt.setFullYear(expiresAt.getFullYear() + 1);
      const startedAt = new Date().toISOString();

      const { error: updateError } = await supabaseClient
        .from("subscriptions")
        .update({
          plan_type: "vip",
          status: "active",
          is_trial: false,
          trial_used: true,
          expires_at: expiresAt.toISOString(),
          started_at: startedAt,
          stripe_customer_id: session.customer as string,
          payment_provider: "stripe",
        })
        .eq("user_id", profile.id);

      if (updateError) {
        logStep("ERROR: Failed to update subscription", { error: updateError });
        return new Response(JSON.stringify({ error: "Failed to update subscription" }), {
          status: 500, headers: { "Content-Type": "application/json" },
        });
      }

      logStep("Subscription updated successfully", { userId: profile.id, expiresAt });

      // Mark any existing failed_payments as resolved for this user
      await supabaseClient
        .from("failed_payments")
        .update({ resolved: true, resolved_at: new Date().toISOString() })
        .eq("email", customerEmail)
        .eq("resolved", false);

      // Tradedoubler tracking
      const orderValue = session.amount_total ? session.amount_total / 100 : 0;
      let subscriptionType = 'Annuel';
      if (session.mode === 'subscription') {
        subscriptionType = 'Mensuel';
      } else if (orderValue < 100) {
        subscriptionType = 'Mensuel';
      }
      
      let voucher = "";
      if (session.total_details?.breakdown?.discounts && session.total_details.breakdown.discounts.length > 0) {
        const discount = session.total_details.breakdown.discounts[0];
        if (discount.discount?.coupon?.name) {
          voucher = discount.discount.coupon.name;
        }
      }

      await trackTradedoublerConversion({
        transactionId: session.id,
        orderValue,
        voucher: voucher || undefined,
        currency: session.currency?.toUpperCase() || 'EUR',
        email: customerEmail,
      });

      await syncUserToAirtable({
        email: customerEmail,
        full_name: profile.full_name || '',
        plan_type: "vip",
        subscription_type: subscriptionType,
        started_at: startedAt,
        stripe_customer_id: session.customer as string,
      });

      // Update referral
      const { data: referral } = await supabaseClient
        .from("affiliate_referrals")
        .select("id")
        .eq("referred_user_id", profile.id)
        .eq("payment_status", "en attente")
        .single();

      if (referral) {
        await supabaseClient
          .from("affiliate_referrals")
          .update({ payment_status: "payé", payment_month: new Date().toISOString().slice(0, 7) })
          .eq("id", referral.id);
      }
    }

    // ============================================================
    // SUBSCRIPTION UPDATED / DELETED
    // ============================================================
    if (event.type === "customer.subscription.updated" || event.type === "customer.subscription.deleted") {
      const subscription = event.data.object as Stripe.Subscription;
      logStep("Subscription event", { subscriptionId: subscription.id, status: subscription.status });

      const customer = await stripe.customers.retrieve(subscription.customer as string);
      if (customer.deleted) {
        return new Response(JSON.stringify({ received: true }), { status: 200, headers: { "Content-Type": "application/json" } });
      }

      const customerEmail = customer.email;
      if (!customerEmail) {
        return new Response(JSON.stringify({ received: true }), { status: 200, headers: { "Content-Type": "application/json" } });
      }

      const { data: profile } = await supabaseClient
        .from("profiles")
        .select("id, full_name")
        .eq("email", customerEmail)
        .single();

      if (!profile) {
        return new Response(JSON.stringify({ received: true }), { status: 200, headers: { "Content-Type": "application/json" } });
      }

      if (subscription.status === "active") {
        const { data: existingSub } = await supabaseClient
          .from("subscriptions")
          .select("expires_at, started_at")
          .eq("user_id", profile.id)
          .single();

        let expiresAt = existingSub?.expires_at;
        if (!expiresAt || new Date(expiresAt) < new Date()) {
          const newExpiry = new Date();
          newExpiry.setFullYear(newExpiry.getFullYear() + 1);
          expiresAt = newExpiry.toISOString();
        }

        await supabaseClient
          .from("subscriptions")
          .update({
            plan_type: "vip",
            status: "active",
            expires_at: expiresAt,
            stripe_customer_id: subscription.customer as string,
            payment_provider: "stripe",
          })
          .eq("user_id", profile.id);
        
        logStep("Subscription activated", { userId: profile.id, expiresAt });

        // Resolve failed payments
        await supabaseClient
          .from("failed_payments")
          .update({ resolved: true, resolved_at: new Date().toISOString() })
          .eq("email", customerEmail)
          .eq("resolved", false);

        await syncUserToAirtable({
          email: customerEmail,
          full_name: profile.full_name || '',
          plan_type: "vip",
          stripe_customer_id: subscription.customer as string,
        });

        const { data: referral } = await supabaseClient
          .from("affiliate_referrals")
          .select("id")
          .eq("referred_user_id", profile.id)
          .eq("payment_status", "en attente")
          .single();

        if (referral) {
          await supabaseClient
            .from("affiliate_referrals")
            .update({ payment_status: "payé", payment_month: new Date().toISOString().slice(0, 7) })
            .eq("id", referral.id);
        }
      } else if (subscription.status === "canceled" || subscription.status === "unpaid" || subscription.status === "past_due") {
        const { data: existingSub } = await supabaseClient
          .from("subscriptions")
          .select("expires_at, started_at")
          .eq("user_id", profile.id)
          .single();

        const now = new Date();
        const existingExpiry = existingSub?.expires_at ? new Date(existingSub.expires_at) : null;

        if (existingExpiry && existingExpiry > now) {
          await supabaseClient
            .from("subscriptions")
            .update({
              plan_type: "vip",
              status: "canceled",
              stripe_subscription_id: null,
            })
            .eq("user_id", profile.id);
          
          logStep("Subscription canceled but VIP maintained until engagement end", { 
            userId: profile.id, expiresAt: existingSub.expires_at 
          });

          await syncUserToAirtable({
            email: customerEmail,
            full_name: profile.full_name || '',
            plan_type: "vip",
            stripe_customer_id: subscription.customer as string,
          });
        } else {
          await supabaseClient
            .from("subscriptions")
            .update({
              plan_type: "free",
              status: "expired",
              is_trial: false,
              expires_at: now.toISOString(),
            })
            .eq("user_id", profile.id);
          
          logStep("Subscription expired", { userId: profile.id });

          await syncUserToAirtable({
            email: customerEmail,
            full_name: profile.full_name || '',
            plan_type: "free",
          });
        }
      }
    }

    // ============================================================
    // INVOICE PAYMENT FAILED - AUTOMATED RECOVERY SYSTEM
    // ============================================================
    if (event.type === "invoice.payment_failed") {
      const invoice = event.data.object as Stripe.Invoice;
      logStep("🔴 Invoice payment failed - Starting automated recovery", { invoiceId: invoice.id });

      const customer = await stripe.customers.retrieve(invoice.customer as string);
      if (customer.deleted) {
        return new Response(JSON.stringify({ received: true }), { status: 200, headers: { "Content-Type": "application/json" } });
      }

      const customerEmail = customer.email;
      if (!customerEmail) {
        return new Response(JSON.stringify({ received: true }), { status: 200, headers: { "Content-Type": "application/json" } });
      }

      const { data: profile } = await supabaseClient
        .from("profiles")
        .select("id, full_name, phone, siren")
        .eq("email", customerEmail)
        .single();

      if (!profile) {
        logStep("User not found", { email: customerEmail });
        return new Response(JSON.stringify({ received: true }), { status: 200, headers: { "Content-Type": "application/json" } });
      }

      // Keep VIP during engagement period
      const { data: existingSub } = await supabaseClient
        .from("subscriptions")
        .select("expires_at")
        .eq("user_id", profile.id)
        .single();

      const now = new Date();
      const existingExpiry = existingSub?.expires_at ? new Date(existingSub.expires_at) : null;

      if (existingExpiry && existingExpiry > now) {
        await supabaseClient
          .from("subscriptions")
          .update({ plan_type: "vip", status: "canceled" })
          .eq("user_id", profile.id);
        logStep("Payment failed but VIP maintained until engagement end", { expiresAt: existingSub.expires_at });
      } else {
        await supabaseClient
          .from("subscriptions")
          .update({ plan_type: "free", status: "unpaid", is_trial: false, expires_at: now.toISOString() })
          .eq("user_id", profile.id);
        logStep("VIP access suspended", { userId: profile.id });

        await syncUserToAirtable({
          email: customerEmail,
          full_name: profile.full_name || '',
          plan_type: "free",
        });
      }

      // ---- STEP 1: Record failed payment in database ----
      const amount = invoice.amount_due ? invoice.amount_due / 100 : 0;
      const failureReason = invoice.last_finalization_error?.message || 'Paiement refusé';

      // Check if we already have a record for this invoice
      const { data: existingFailure } = await supabaseClient
        .from("failed_payments")
        .select("id, attempt_count")
        .eq("stripe_invoice_id", invoice.id)
        .single();

      let failedPaymentId: string;

      if (existingFailure) {
        // Update attempt count
        await supabaseClient
          .from("failed_payments")
          .update({
            attempt_count: existingFailure.attempt_count + 1,
            failure_reason: failureReason,
          })
          .eq("id", existingFailure.id);
        failedPaymentId = existingFailure.id;
        logStep("Failed payment updated", { id: failedPaymentId, attempts: existingFailure.attempt_count + 1 });
      } else {
        const { data: newFailure } = await supabaseClient
          .from("failed_payments")
          .insert({
            user_id: profile.id,
            email: customerEmail,
            full_name: profile.full_name || '',
            phone: profile.phone || '',
            stripe_customer_id: invoice.customer as string,
            stripe_invoice_id: invoice.id,
            stripe_subscription_id: invoice.subscription as string || null,
            amount,
            currency: (invoice.currency || 'eur').toUpperCase(),
            failure_reason: failureReason,
          })
          .select('id')
          .single();
        
        failedPaymentId = newFailure?.id || '';
        logStep("Failed payment recorded", { id: failedPaymentId, amount });
      }

      // ---- STEP 2: Send email to customer ----
      const emailSent = await sendPaymentFailedEmail(
        customerEmail, 
        profile.full_name || '', 
        now.toISOString()
      );

      if (emailSent) {
        await supabaseClient
          .from("failed_payments")
          .update({ email_sent: true, email_sent_at: now.toISOString() })
          .eq("id", failedPaymentId);
        logStep("📧 Payment failed email sent", { email: customerEmail });
      }

      // ---- STEP 3: Submit to Rubypayeur for debt collection ----
      const invoiceDate = invoice.created 
        ? new Date(invoice.created * 1000).toISOString().split('T')[0]
        : now.toISOString().split('T')[0];
      const dueDate = invoice.due_date 
        ? new Date(invoice.due_date * 1000).toISOString().split('T')[0]
        : now.toISOString().split('T')[0];

      const rubypayeurRef = await submitToRubypayeur({
        email: customerEmail,
        full_name: profile.full_name || 'Client',
        phone: profile.phone || undefined,
        siren: profile.siren || undefined,
        amount,
        invoiceNumber: invoice.number || invoice.id,
        invoiceDate,
        dueDate,
        failedPaymentId,
        stripeInvoiceId: invoice.id,
      }, supabaseClient);

      if (rubypayeurRef) {
        logStep("🏦 Rubypayeur case created", { ref: rubypayeurRef, email: customerEmail });
      }

      logStep("✅ Automated recovery completed", { 
        email: customerEmail, 
        emailSent, 
        rubypayeurRef: rubypayeurRef || 'failed',
        amount 
      });
    }

    return new Response(JSON.stringify({ received: true }), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    logStep("ERROR", { message: errorMessage });
    return new Response(JSON.stringify({ error: errorMessage }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
});
