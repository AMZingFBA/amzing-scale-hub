import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import Stripe from "https://esm.sh/stripe@18.5.0";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.57.2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

// ============================================================
// Send payment failed email via Resend (same as stripe-webhook)
// ============================================================
async function sendPaymentFailedEmail(email: string, fullName: string, failedDate: string) {
  try {
    const RESEND_API_KEY = Deno.env.get('RESEND_API_KEY');
    if (!RESEND_API_KEY) {
      console.log("[SYNC-STRIPE] RESEND_API_KEY not configured, skipping email");
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

    console.log(`[SYNC-STRIPE] Payment failed email sent to ${email}: status ${response.status}`);
    return response.ok;
  } catch (error) {
    console.error(`[SYNC-STRIPE] Email error for ${email}:`, error);
    return false;
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
  clientCompanyName?: string;
  clientAddress?: string;
  clientCity?: string;
  clientCountry?: string;
  clientTvaNumber?: string;
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

  // Build PDF content stream with professional layout
  const lines: string[] = [];
  let y = 750;

  // Title "Facture"
  lines.push(`BT /F1 28 Tf 50 ${y} Td (Facture) Tj ET`);
  y -= 40;

  // Invoice metadata
  lines.push(`BT /F1 10 Tf 50 ${y} Td (${esc(`Num\\351ro de facture`)}) Tj ET`);
  lines.push(`BT /F2 10 Tf 220 ${y} Td (${esc(data.invoiceNumber)}) Tj ET`);
  y -= 16;
  lines.push(`BT /F1 10 Tf 50 ${y} Td (Date d'\\351mission) Tj ET`);
  lines.push(`BT /F2 10 Tf 220 ${y} Td (${esc(fmtDate)}) Tj ET`);
  y -= 16;
  lines.push(`BT /F1 10 Tf 50 ${y} Td (Date d'\\351ch\\351ance) Tj ET`);
  lines.push(`BT /F2 10 Tf 220 ${y} Td (${esc(fmtDue)}) Tj ET`);
  y -= 30;

  // Separator line
  lines.push(`0.85 0.85 0.85 RG 0.5 w 50 ${y} m 560 ${y} l S`);
  y -= 25;

  // Emitter (left) / Client (right)
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

  // Table header
  const tableTop = y;
  lines.push(`0.93 0.93 0.93 rg 50 ${y - 4} 510 20 re f`);
  lines.push(`0 0 0 rg`);
  lines.push(`BT /F1 9 Tf 55 ${y} Td (Description) Tj ET`);
  lines.push(`BT /F1 9 Tf 310 ${y} Td (Qt\\351) Tj ET`);
  lines.push(`BT /F1 9 Tf 360 ${y} Td (Prix unitaire) Tj ET`);
  lines.push(`BT /F1 9 Tf 445 ${y} Td (TVA \\(%\\)) Tj ET`);
  lines.push(`BT /F1 9 Tf 510 ${y} Td (Total HT) Tj ET`);
  y -= 25;

  // Table row
  lines.push(`BT /F2 9 Tf 55 ${y} Td (VIP - AMZING FBA) Tj ET`);
  lines.push(`BT /F2 9 Tf 318 ${y} Td (1) Tj ET`);
  lines.push(`BT /F2 9 Tf 360 ${y} Td (${esc(amountStr)} \\200) Tj ET`);
  lines.push(`BT /F2 9 Tf 455 ${y} Td (0 %) Tj ET`);
  lines.push(`BT /F2 9 Tf 510 ${y} Td (${esc(amountStr)} \\200) Tj ET`);
  y -= 20;

  // Separator
  lines.push(`0.85 0.85 0.85 RG 0.5 w 50 ${y} m 560 ${y} l S`);
  y -= 20;

  // Totals
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

  // Legal mentions
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

  // Payment details section
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

  // Footer
  lines.push(`0.85 0.85 0.85 RG 0.5 w 50 ${y} m 560 ${y} l S`);
  y -= 15;
  lines.push(`BT /F2 8 Tf 50 ${y} Td (EI - Zaghdoun Noa / N.Z Consulting, EI) Tj ET`);
  lines.push(`BT /F2 8 Tf 460 ${y} Td (${esc(data.invoiceNumber)} \\267 1/1) Tj ET`);

  const streamContent = lines.join('\n');
  const streamLen = new TextEncoder().encode(streamContent).length;

  // Build PDF structure with both regular and bold Helvetica fonts
  const obj1 = '1 0 obj\n<< /Type /Catalog /Pages 2 0 R >>\nendobj\n';
  const obj2 = '2 0 obj\n<< /Type /Pages /Kids [3 0 R] /Count 1 >>\nendobj\n';
  const obj3 = `3 0 obj\n<< /Type /Page /MediaBox [0 0 612 792] /Parent 2 0 R /Resources << /Font << /F1 4 0 R /F2 5 0 R >> >> /Contents 6 0 R >>\nendobj\n`;
  const obj4 = '4 0 obj\n<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica-Bold /Encoding /WinAnsiEncoding >>\nendobj\n';
  const obj5 = '5 0 obj\n<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica /Encoding /WinAnsiEncoding >>\nendobj\n';
  const obj6 = `6 0 obj\n<< /Length ${streamLen} >>\nstream\n${streamContent}\nendstream\nendobj\n`;

  const pdfBody = '%PDF-1.4\n' + obj1 + obj2 + obj3 + obj4 + obj5 + obj6;
  const bodyBytes = new TextEncoder().encode(pdfBody);

  const xrefOffset = bodyBytes.length;
  const xref = `xref\n0 7\n0000000000 65535 f \n`;
  const trailer = `trailer\n<< /Size 7 /Root 1 0 R >>\nstartxref\n${xrefOffset}\n%%EOF`;

  return new TextEncoder().encode(pdfBody + xref + trailer);
}

// ============================================================
// Submit to Rubypayeur for debt collection (same as stripe-webhook)
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
    console.log("[SYNC-STRIPE] RUBYPAYEUR_TOKEN not configured, skipping");
    return null;
  }

  try {
    // Step 1: Authenticate
    const authResponse = await fetch('https://rubypayeur.com/api/debt_auth', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ token: RUBYPAYEUR_TOKEN }),
    });

    if (!authResponse.ok) {
      console.error("[SYNC-STRIPE] Rubypayeur auth failed:", authResponse.status);
      return null;
    }

    const authData = await authResponse.json();
    const authToken = authData.auth_token;
    if (!authToken) {
      console.error("[SYNC-STRIPE] Rubypayeur: no auth_token");
      return null;
    }

    // Step 2: Create debt case
    const nameParts = (data.full_name || 'Client Inconnu').trim().split(' ');
    const firstName = nameParts[0] || 'Client';
    const lastName = nameParts.slice(1).join(' ') || 'Inconnu';

    const formData = new FormData();
    formData.append('debt[siren]', data.siren || '000000000');
    formData.append('debt[gender]', 'male');
    formData.append('debt[first_name]', firstName);
    formData.append('debt[last_name]', lastName);
    formData.append('debt[email]', data.email);
    formData.append('debt[phone]', data.phone || '0184807678');
    formData.append('debt[items_attributes][0][amount]', data.amount.toFixed(2));
    formData.append('debt[items_attributes][0][invoice_number]', data.invoiceNumber);
    formData.append('debt[items_attributes][0][invoiced_on]', data.invoiceDate);
    formData.append('debt[items_attributes][0][due_date]', data.dueDate);
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
              console.log(`[SYNC-STRIPE] Rubypayeur: attached Stripe invoice PDF`);
            }
          }
        }
      } catch (pdfErr) {
        console.error("[SYNC-STRIPE] Failed to fetch invoice PDF:", pdfErr);
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
        console.log(`[SYNC-STRIPE] Rubypayeur: attached professional invoice PDF (${pdfFile.size} bytes)`);
      } catch (genErr) {
        console.error("[SYNC-STRIPE] Failed to generate invoice PDF:", genErr);
      }
    }

    console.log(`[SYNC-STRIPE] Rubypayeur: creating debt case for ${data.email}, amount: ${data.amount}€`);

    const debtResponse = await fetch('https://rubypayeur.com/api/debts', {
      method: 'POST',
      headers: { 'Authorization': `Bearer ${authToken}` },
      body: formData,
    });

    const debtResult = await debtResponse.json();

    if (debtResult.ref) {
      await supabaseClient
        .from('failed_payments')
        .update({
          rubypayeur_submitted: true,
          rubypayeur_submitted_at: new Date().toISOString(),
          rubypayeur_ref: debtResult.ref,
          rubypayeur_status: 'submitted',
        })
        .eq('id', data.failedPaymentId);

      console.log(`[SYNC-STRIPE] 🏦 Rubypayeur case created: ${debtResult.ref} for ${data.email}`);
      return debtResult.ref;
    } else {
      await supabaseClient
        .from('failed_payments')
        .update({
          rubypayeur_status: 'error',
          notes: `Erreur Rubypayeur: ${JSON.stringify(debtResult.errors || debtResult)}`,
        })
        .eq('id', data.failedPaymentId);

      console.error("[SYNC-STRIPE] Rubypayeur case creation failed:", debtResult);
      return null;
    }
  } catch (error) {
    console.error("[SYNC-STRIPE] Rubypayeur error:", error);
    return null;
  }
}

// ============================================================
// Automated recovery: create failed_payment + email + Rubypayeur
// ============================================================
async function runAutomatedRecovery(
  profile: { id: string; email: string; full_name: string | null; phone?: string | null; siren?: string | null },
  customer: Stripe.Customer,
  failedPayments: Stripe.PaymentIntent[],
  subscriptions: Stripe.Subscription[],
  supabaseAdmin: any
) {
  const now = new Date();
  const email = profile.email;

  // Find the most recent failed invoice
  const lastFailedPI = failedPayments[0];
  const amount = lastFailedPI ? lastFailedPI.amount / 100 : 64.16;
  const failureReason = lastFailedPI?.last_payment_error?.message || 'Paiement refusé';

  // Find the related subscription/invoice ID
  const unpaidSub = subscriptions.find(s => s.status === "past_due" || s.status === "unpaid");
  const stripeSubId = unpaidSub?.id || null;
  const stripeInvoiceId = lastFailedPI?.invoice as string || null;

  // Check if failed_payment record already exists for this user (not resolved)
  const { data: existingFailure } = await supabaseAdmin
    .from("failed_payments")
    .select("id, attempt_count, email_sent, rubypayeur_submitted")
    .eq("email", email)
    .eq("resolved", false)
    .order("created_at", { ascending: false })
    .limit(1)
    .single();

  let failedPaymentId: string;
  let alreadySentEmail = false;
  let alreadySubmittedRubypayeur = false;

  if (existingFailure) {
    // Update attempt count
    await supabaseAdmin
      .from("failed_payments")
      .update({
        attempt_count: existingFailure.attempt_count + 1,
        failure_reason: failureReason,
        updated_at: now.toISOString(),
      })
      .eq("id", existingFailure.id);
    
    failedPaymentId = existingFailure.id;
    alreadySentEmail = existingFailure.email_sent;
    alreadySubmittedRubypayeur = existingFailure.rubypayeur_submitted;
    console.log(`[SYNC-STRIPE] 📋 Updated existing failed_payment for ${email} (attempts: ${existingFailure.attempt_count + 1})`);
  } else {
    // Create new failed_payment record
    const { data: newFailure } = await supabaseAdmin
      .from("failed_payments")
      .insert({
        user_id: profile.id,
        email,
        full_name: profile.full_name || '',
        phone: profile.phone || '',
        stripe_customer_id: customer.id,
        stripe_invoice_id: stripeInvoiceId,
        stripe_subscription_id: stripeSubId,
        amount,
        currency: 'EUR',
        failure_reason: failureReason,
      })
      .select('id')
      .single();

    failedPaymentId = newFailure?.id || '';
    console.log(`[SYNC-STRIPE] 📋 Created new failed_payment for ${email}: ${failedPaymentId}`);
  }

  // Send email if not already sent
  if (!alreadySentEmail) {
    const emailSent = await sendPaymentFailedEmail(email, profile.full_name || '', now.toISOString());
    if (emailSent && failedPaymentId) {
      await supabaseAdmin
        .from("failed_payments")
        .update({ email_sent: true, email_sent_at: now.toISOString() })
        .eq("id", failedPaymentId);
      console.log(`[SYNC-STRIPE] 📧 Payment failed email sent to ${email}`);
    }
  } else {
    console.log(`[SYNC-STRIPE] 📧 Email already sent to ${email}, skipping`);
  }

  // Submit to Rubypayeur if not already done
  if (!alreadySubmittedRubypayeur && failedPaymentId) {
    const invoiceDate = lastFailedPI?.created
      ? new Date(lastFailedPI.created * 1000).toISOString().split('T')[0]
      : now.toISOString().split('T')[0];

    const rubypayeurRef = await submitToRubypayeur({
      email,
      full_name: profile.full_name || 'Client',
      phone: profile.phone || undefined,
      siren: profile.siren || undefined,
      amount,
      invoiceNumber: stripeInvoiceId || `SYNC-${now.getTime()}`,
      invoiceDate,
      dueDate: invoiceDate,
      failedPaymentId,
      stripeInvoiceId: stripeInvoiceId || undefined,
    }, supabaseAdmin);

    if (rubypayeurRef) {
      console.log(`[SYNC-STRIPE] 🏦 Rubypayeur case created: ${rubypayeurRef} for ${email}`);
    }
  } else if (alreadySubmittedRubypayeur) {
    console.log(`[SYNC-STRIPE] 🏦 Rubypayeur already submitted for ${email}, skipping`);
  }
}

// ============================================================
// MAIN SYNC HANDLER
// ============================================================
serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    console.log("[SYNC-STRIPE] Starting payment synchronization");
    
    const stripe = new Stripe(Deno.env.get("STRIPE_SECRET_KEY") || "", {
      apiVersion: "2025-08-27.basil",
    });

    const supabaseAdmin = createClient(
      Deno.env.get("SUPABASE_URL") ?? "",
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? ""
    );

    // Get all profiles with their subscriptions
    const { data: profiles, error: profilesError } = await supabaseAdmin
      .from("profiles")
      .select("id, email, full_name, phone, siren");

    if (profilesError) throw profilesError;
    
    // Get all subscriptions separately
    const { data: userSubscriptions, error: subsError } = await supabaseAdmin
      .from("subscriptions")
      .select("*");
      
    if (subsError) throw subsError;

    console.log(`[SYNC-STRIPE] Found ${profiles.length} profiles to check`);

    const results = {
      checked: 0,
      updated: 0,
      recovery_triggered: 0,
      failed_payments: [] as any[],
      errors: [] as any[]
    };

    for (const profile of profiles) {
      try {
        results.checked++;
        
        // Find subscription for this profile
        const userSubscription = userSubscriptions?.find((s: any) => s.user_id === profile.id);
        
        if (!userSubscription) {
          continue;
        }
        
        // Search for customer in Stripe by email
        const customers = await stripe.customers.list({
          email: profile.email,
          limit: 1
        });

        if (customers.data.length === 0) {
          continue;
        }

        const customer = customers.data[0];

        // Get recent payment intents for this customer
        const paymentIntents = await stripe.paymentIntents.list({
          customer: customer.id,
          limit: 10
        });

        // Check for failed payments
        const failedPaymentsList = paymentIntents.data.filter(
          (pi: Stripe.PaymentIntent) => pi.status === "requires_payment_method" || 
                pi.status === "canceled" ||
                (pi.last_payment_error !== null)
        );

        if (failedPaymentsList.length > 0) {
          results.failed_payments.push({
            email: profile.email,
            customer_id: customer.id,
            failed_count: failedPaymentsList.length,
          });
        }

        // Get Stripe subscriptions
        const subscriptionsList = await stripe.subscriptions.list({
          customer: customer.id,
          limit: 10
        });

        const activeSubscription = subscriptionsList.data.find(
          (sub: Stripe.Subscription) => sub.status === "active"
        );

        const hasUnpaidSubscription = subscriptionsList.data.some(
          (sub: Stripe.Subscription) => sub.status === "unpaid" || sub.status === "past_due"
        );

        // Determine correct status
        let newStatus = userSubscription.status || "active";
        let newPlanType = userSubscription.plan_type || "free";

        if (activeSubscription) {
          newStatus = "active";
          newPlanType = "vip";
        } else if (hasUnpaidSubscription || failedPaymentsList.length > 0) {
          newStatus = "unpaid";
          newPlanType = "free";
        } else if (subscriptionsList.data.length > 0) {
          const lastSub = subscriptionsList.data[0];
          if (lastSub.status === "canceled" || lastSub.status === "incomplete_expired") {
            newStatus = lastSub.status === "canceled" ? "canceled" : "expired";
            newPlanType = "free";
          }
        }

        // Update subscription in database if needed
        const needsUpdate = 
          userSubscription.stripe_customer_id !== customer.id ||
          userSubscription.status !== newStatus ||
          userSubscription.plan_type !== newPlanType;

        if (needsUpdate) {
          const updateData: any = {
            stripe_customer_id: customer.id,
            status: newStatus,
            plan_type: newPlanType,
            payment_provider: "stripe",
            updated_at: new Date().toISOString()
          };

          if (newStatus === "unpaid" || newStatus === "canceled" || newStatus === "expired") {
            if (subscriptionsList.data.length > 0) {
              const lastSub = subscriptionsList.data[0];
              if (lastSub.current_period_end) {
                updateData.expires_at = new Date(lastSub.current_period_end * 1000).toISOString();
              }
            }
          }

          if (activeSubscription && activeSubscription.current_period_end) {
            updateData.stripe_subscription_id = activeSubscription.id;
            updateData.expires_at = new Date(activeSubscription.current_period_end * 1000).toISOString();
          }

          const { error: updateError } = await supabaseAdmin
            .from("subscriptions")
            .update(updateData)
            .eq("user_id", profile.id);

          if (updateError) {
            console.error(`[SYNC-STRIPE] Error updating ${profile.email}:`, updateError);
            results.errors.push({ email: profile.email, error: updateError.message });
          } else {
            console.log(`[SYNC-STRIPE] Updated ${profile.email}: ${newStatus}, ${newPlanType}`);
            results.updated++;
          }
        }

        // ============================================================
        // FALLBACK RECOVERY: If unpaid + failed payments detected,
        // create failed_payment record + send email + Rubypayeur
        // (catches cases where webhook didn't fire)
        // ============================================================
        if ((newStatus === "unpaid" || hasUnpaidSubscription) && failedPaymentsList.length > 0) {
          console.log(`[SYNC-STRIPE] 🔴 Running automated recovery for ${profile.email}`);
          try {
            await runAutomatedRecovery(
              profile,
              customer,
              failedPaymentsList,
              subscriptionsList.data,
              supabaseAdmin
            );
            results.recovery_triggered++;
          } catch (recoveryError) {
            console.error(`[SYNC-STRIPE] Recovery error for ${profile.email}:`, recoveryError);
          }
        }

        // If payment was resolved (active sub found), mark failed_payments as resolved
        if (activeSubscription) {
          await supabaseAdmin
            .from("failed_payments")
            .update({ resolved: true, resolved_at: new Date().toISOString() })
            .eq("email", profile.email)
            .eq("resolved", false);
        }

      } catch (error) {
        console.error(`[SYNC-STRIPE] Error processing ${profile.email}:`, error);
        results.errors.push({ 
          email: profile.email, 
          error: error instanceof Error ? error.message : String(error)
        });
      }
    }

    console.log("[SYNC-STRIPE] Synchronization complete:", results);

    return new Response(JSON.stringify({
      success: true,
      summary: {
        profiles_checked: results.checked,
        subscriptions_updated: results.updated,
        recovery_triggered: results.recovery_triggered,
        failed_payments_found: results.failed_payments.length
      },
      failed_payments: results.failed_payments,
      errors: results.errors
    }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 200,
    });
  } catch (error) {
    console.error("[SYNC-STRIPE] Fatal error:", error);
    return new Response(JSON.stringify({ 
      error: error instanceof Error ? error.message : String(error)
    }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 500,
    });
  }
});
