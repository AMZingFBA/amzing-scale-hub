import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import Stripe from "https://esm.sh/stripe@18.5.0";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.57.2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

// Generate CGV PDF (Conditions Générales de Vente)
function generateCgvPdf(): Uint8Array {
  const esc = (s: string) => s.replace(/\\/g, '\\\\').replace(/\(/g, '\\(').replace(/\)/g, '\\)');

  const pages: string[][] = [];

  // ---- PAGE 1 ----
  const p1: string[] = [];
  let y = 750;
  p1.push(`BT /F1 22 Tf 50 ${y} Td (Conditions G\\351n\\351rales de Vente) Tj ET`);
  y -= 25;
  p1.push(`BT /F2 9 Tf 50 ${y} Td (AMZing FBA \\267 N.Z Consulting \\267 Derni\\350re mise \\340 jour : 25 novembre 2025) Tj ET`);
  y -= 30;

  p1.push(`BT /F1 12 Tf 50 ${y} Td (1. Champ d'application) Tj ET`); y -= 16;
  p1.push(`BT /F2 9 Tf 50 ${y} Td (Les pr\\351sentes CGV s'appliquent \\340 l'ensemble des ventes de formations en ligne, programmes) Tj ET`); y -= 13;
  p1.push(`BT /F2 9 Tf 50 ${y} Td (d'accompagnement, abonnements, acc\\350s membres et contenus num\\351riques propos\\351s par AMZing FBA.) Tj ET`); y -= 13;
  p1.push(`BT /F2 9 Tf 50 ${y} Td (Toute commande implique l'acceptation pleine et enti\\350re des pr\\351sentes CGV par le Client.) Tj ET`); y -= 22;

  p1.push(`BT /F1 12 Tf 50 ${y} Td (2. Identification du vendeur) Tj ET`); y -= 16;
  p1.push(`BT /F2 9 Tf 50 ${y} Td (N.Z Consulting \\267 Marque commerciale : AMZing FBA) Tj ET`); y -= 13;
  p1.push(`BT /F2 9 Tf 50 ${y} Td (59 Rue de Ponthieu, 75008 Paris, France \\267 SIRET : 993 348 929 00015) Tj ET`); y -= 13;
  p1.push(`BT /F2 9 Tf 50 ${y} Td (TVA non applicable, article 293 B du CGI \\267 Contact : contact@amzingfba.com) Tj ET`); y -= 22;

  p1.push(`BT /F1 12 Tf 50 ${y} Td (5. Cr\\351ation de compte et acceptation des CGV) Tj ET`); y -= 16;
  p1.push(`BT /F2 9 Tf 50 ${y} Td (Le Client accepte express\\351ment les CGV en cochant la case pr\\351vue \\340 cet effet lors de la cr\\351ation) Tj ET`); y -= 13;
  p1.push(`BT /F2 9 Tf 50 ${y} Td (de son compte ou de la passation de sa commande. Cette acceptation est irr\\351vocable.) Tj ET`); y -= 22;

  p1.push(`BT /F1 12 Tf 50 ${y} Td (6. Services propos\\351s et tarifs) Tj ET`); y -= 16;
  p1.push(`BT /F2 9 Tf 50 ${y} Td (Abonnement VIP : acc\\350s \\340 l'ensemble des outils, alertes, formations et ressources AMZing FBA.) Tj ET`); y -= 13;
  p1.push(`BT /F2 9 Tf 50 ${y} Td (Tarif : 700 \\200 \\(paiement annuel\\) ou 770 \\200 \\(12 mensualit\\351s de 64,16 \\200\\).) Tj ET`); y -= 13;
  p1.push(`BT /F2 9 Tf 50 ${y} Td (L'engagement est ferme pour une dur\\351e de 12 mois. Aucun remboursement partiel ne sera accord\\351.) Tj ET`); y -= 22;

  p1.push(`BT /F1 12 Tf 50 ${y} Td (7. Modalit\\351s de paiement) Tj ET`); y -= 16;
  p1.push(`BT /F2 9 Tf 50 ${y} Td (Le paiement s'effectue par carte bancaire via la plateforme s\\351curis\\351e Stripe.) Tj ET`); y -= 13;
  p1.push(`BT /F2 9 Tf 50 ${y} Td (En cas de facilit\\351 de paiement, le Client s'engage \\340 honorer l'int\\351gralit\\351 des 12 mensualit\\351s.) Tj ET`); y -= 22;

  p1.push(`BT /F1 12 Tf 50 ${y} Td (8. Dur\\351e de l'engagement et r\\351siliation) Tj ET`); y -= 16;
  p1.push(`BT /F2 9 Tf 50 ${y} Td (L'abonnement est souscrit pour une dur\\351e ferme et d\\351finitive de 12 mois.) Tj ET`); y -= 13;
  p1.push(`BT /F2 9 Tf 50 ${y} Td (En cas d'annulation anticip\\351e, les mensualit\\351s restantes demeurent exigibles.) Tj ET`); y -= 13;
  p1.push(`BT /F2 9 Tf 50 ${y} Td (Le Client ne peut se pr\\351valoir d'aucun droit \\340 remboursement pour la p\\351riode non \\351chue.) Tj ET`); y -= 22;

  p1.push(`BT /F1 12 Tf 50 ${y} Td (10. Impay\\351s et recouvrement) Tj ET`); y -= 16;
  p1.push(`BT /F2 9 Tf 50 ${y} Td (En cas de d\\351faut de paiement, des p\\351nalit\\351s de retard seront appliqu\\351es au taux de trois fois) Tj ET`); y -= 13;
  p1.push(`BT /F2 9 Tf 50 ${y} Td (le taux d'int\\351r\\352t l\\351gal, major\\351es d'une indemnit\\351 forfaitaire de 40 \\200 pour frais de recouvrement.) Tj ET`); y -= 13;
  p1.push(`BT /F2 9 Tf 50 ${y} Td (Le dossier pourra \\352tre transmis \\340 un organisme de recouvrement \\(Rubypayeur\\).) Tj ET`); y -= 22;

  p1.push(`BT /F1 12 Tf 50 ${y} Td (12. Droit de r\\351tractation) Tj ET`); y -= 16;
  p1.push(`BT /F2 9 Tf 50 ${y} Td (Conform\\351ment \\340 l'article L.221-28 du Code de la consommation, le Client renonce express\\351ment) Tj ET`); y -= 13;
  p1.push(`BT /F2 9 Tf 50 ${y} Td (\\340 son droit de r\\351tractation d\\350s lors que l'acc\\350s aux contenus num\\351riques a \\351t\\351 activ\\351.) Tj ET`); y -= 22;

  p1.push(`BT /F1 12 Tf 50 ${y} Td (15. Droit applicable et juridiction) Tj ET`); y -= 16;
  p1.push(`BT /F2 9 Tf 50 ${y} Td (Les pr\\351sentes CGV sont r\\351gies par le droit fran\\347ais.) Tj ET`); y -= 13;
  p1.push(`BT /F2 9 Tf 50 ${y} Td (En cas de litige, comp\\351tence exclusive est attribu\\351e aux tribunaux de Paris.) Tj ET`); y -= 30;

  p1.push(`BT /F2 8 Tf 50 ${y} Td (Document g\\351n\\351r\\351 automatiquement \\267 CGV compl\\350tes sur https://amzingfba.com/cgv) Tj ET`);
  pages.push(p1);

  // Build multi-page or single page PDF
  const pageObjects: string[] = [];
  const contentObjects: string[] = [];
  let objIndex = 6; // 1=catalog, 2=pages, 3=reserved, 4=font1, 5=font2

  for (let i = 0; i < pages.length; i++) {
    const streamContent = pages[i].join('\n');
    const streamLen = new TextEncoder().encode(streamContent).length;
    const pageObjIdx = objIndex++;
    const contentObjIdx = objIndex++;
    pageObjects.push(`${pageObjIdx} 0 obj\n<< /Type /Page /MediaBox [0 0 612 792] /Parent 2 0 R /Resources << /Font << /F1 4 0 R /F2 5 0 R >> >> /Contents ${contentObjIdx} 0 R >>\nendobj\n`);
    contentObjects.push(`${contentObjIdx} 0 obj\n<< /Length ${streamLen} >>\nstream\n${streamContent}\nendstream\nendobj\n`);
  }

  const kids = pageObjects.map((_, i) => `${6 + i * 2} 0 R`).join(' ');
  const obj1 = '1 0 obj\n<< /Type /Catalog /Pages 2 0 R >>\nendobj\n';
  const obj2 = `2 0 obj\n<< /Type /Pages /Kids [${kids}] /Count ${pages.length} >>\nendobj\n`;
  const obj4 = '4 0 obj\n<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica-Bold /Encoding /WinAnsiEncoding >>\nendobj\n';
  const obj5 = '5 0 obj\n<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica /Encoding /WinAnsiEncoding >>\nendobj\n';

  let pdfBody = '%PDF-1.4\n' + obj1 + obj2 + obj4 + obj5;
  for (let i = 0; i < pageObjects.length; i++) {
    pdfBody += pageObjects[i] + contentObjects[i];
  }

  const bodyBytes = new TextEncoder().encode(pdfBody);
  const xrefOffset = bodyBytes.length;
  const xref = `xref\n0 ${objIndex}\n0000000000 65535 f \n`;
  const trailer = `trailer\n<< /Size ${objIndex} /Root 1 0 R >>\nstartxref\n${xrefOffset}\n%%EOF`;

  return new TextEncoder().encode(pdfBody + xref + trailer);
}

// Generate professional invoice PDF
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

  const lines: string[] = [];
  let y = 750;

  lines.push(`BT /F1 28 Tf 50 ${y} Td (Facture) Tj ET`); y -= 40;
  lines.push(`BT /F1 10 Tf 50 ${y} Td (Num\\351ro de facture) Tj ET`);
  lines.push(`BT /F2 10 Tf 220 ${y} Td (${esc(data.invoiceNumber)}) Tj ET`); y -= 16;
  lines.push(`BT /F1 10 Tf 50 ${y} Td (Date d'\\351mission) Tj ET`);
  lines.push(`BT /F2 10 Tf 220 ${y} Td (${esc(fmtDate)}) Tj ET`); y -= 16;
  lines.push(`BT /F1 10 Tf 50 ${y} Td (Date d'\\351ch\\351ance) Tj ET`);
  lines.push(`BT /F2 10 Tf 220 ${y} Td (${esc(fmtDue)}) Tj ET`); y -= 30;

  lines.push(`0.85 0.85 0.85 RG 0.5 w 50 ${y} m 560 ${y} l S`); y -= 25;

  lines.push(`BT /F1 11 Tf 50 ${y} Td (EI - Zaghdoun Noa / N.Z Consulting) Tj ET`);
  const clientHeader = data.clientCompanyName || data.clientName;
  lines.push(`BT /F1 11 Tf 310 ${y} Td (${esc(clientHeader)}) Tj ET`); y -= 16;
  lines.push(`BT /F2 9 Tf 50 ${y} Td (59 Rue De Ponthieu, Bureau 326) Tj ET`);
  if (data.clientCompanyName && data.clientName) {
    lines.push(`BT /F2 9 Tf 310 ${y} Td (${esc(data.clientName)}) Tj ET`);
    y -= 14;
    lines.push(`BT /F2 9 Tf 50 ${y} Td (75008 Paris, FR) Tj ET`);
  } else {
    y -= 14;
    lines.push(`BT /F2 9 Tf 50 ${y} Td (75008 Paris, FR) Tj ET`);
  }
  if (data.clientAddress) {
    lines.push(`BT /F2 9 Tf 310 ${y} Td (${esc(data.clientAddress)}) Tj ET`);
  }
  y -= 14;
  lines.push(`BT /F2 9 Tf 50 ${y} Td (amzingfba26@gmail.com) Tj ET`);
  if (data.clientCity) {
    lines.push(`BT /F2 9 Tf 310 ${y} Td (${esc(data.clientCity)}${data.clientCountry ? ', ' + data.clientCountry : ''}) Tj ET`);
  }
  y -= 14;
  lines.push(`BT /F2 9 Tf 50 ${y} Td (SIRET: 99334892900015) Tj ET`);
  if (data.clientSiren) {
    lines.push(`BT /F2 9 Tf 310 ${y} Td (${esc(data.clientSiren)}) Tj ET`);
  }
  y -= 14;
  if (data.clientTvaNumber) {
    lines.push(`BT /F2 9 Tf 310 ${y} Td (${esc('Num\\351ro de TVA: ' + data.clientTvaNumber)}) Tj ET`);
    y -= 14;
  }
  lines.push(`BT /F2 9 Tf 310 ${y} Td (${esc(data.clientEmail)}) Tj ET`);
  y -= 35;

  // Table header
  lines.push(`0.93 0.93 0.93 rg 50 ${y - 4} 510 20 re f`);
  lines.push(`0 0 0 rg`);
  lines.push(`BT /F1 9 Tf 55 ${y} Td (Description) Tj ET`);
  lines.push(`BT /F1 9 Tf 310 ${y} Td (Qt\\351) Tj ET`);
  lines.push(`BT /F1 9 Tf 360 ${y} Td (Prix unitaire) Tj ET`);
  lines.push(`BT /F1 9 Tf 445 ${y} Td (TVA \\(%\\)) Tj ET`);
  lines.push(`BT /F1 9 Tf 510 ${y} Td (Total HT) Tj ET`); y -= 25;

  lines.push(`BT /F2 9 Tf 55 ${y} Td (VIP - AMZING FBA) Tj ET`);
  lines.push(`BT /F2 9 Tf 318 ${y} Td (1) Tj ET`);
  lines.push(`BT /F2 9 Tf 360 ${y} Td (${esc(amountStr)} \\200) Tj ET`);
  lines.push(`BT /F2 9 Tf 455 ${y} Td (0 %) Tj ET`);
  lines.push(`BT /F2 9 Tf 510 ${y} Td (${esc(amountStr)} \\200) Tj ET`); y -= 20;

  lines.push(`0.85 0.85 0.85 RG 0.5 w 50 ${y} m 560 ${y} l S`); y -= 20;

  lines.push(`BT /F1 9 Tf 360 ${y} Td (Total HT) Tj ET`);
  lines.push(`BT /F2 9 Tf 510 ${y} Td (${esc(amountStr)} \\200) Tj ET`); y -= 18;
  lines.push(`BT /F1 9 Tf 360 ${y} Td (Montant total de la TVA) Tj ET`);
  lines.push(`BT /F2 9 Tf 510 ${y} Td (0,00 \\200) Tj ET`); y -= 18;
  lines.push(`0.85 0.85 0.85 RG 0.5 w 360 ${y + 14} m 560 ${y + 14} l S`);
  lines.push(`BT /F1 10 Tf 360 ${y} Td (Total TTC) Tj ET`);
  lines.push(`BT /F1 10 Tf 510 ${y} Td (${esc(amountStr)} \\200) Tj ET`); y -= 35;

  lines.push(`BT /F2 8 Tf 50 ${y} Td (TVA non applicable, art. 293 B du CGI) Tj ET`); y -= 20;
  lines.push(`BT /F2 7 Tf 50 ${y} Td (Pas d'escompte accord\\351 pour paiement anticip\\351.) Tj ET`); y -= 12;
  lines.push(`BT /F2 7 Tf 50 ${y} Td (En cas de non-paiement, des p\\351nalit\\351s calcul\\351es \\340 trois fois le taux d'int\\351r\\352t l\\351gal seront appliqu\\351es.) Tj ET`); y -= 12;
  lines.push(`BT /F2 7 Tf 50 ${y} Td (Indemnit\\351 forfaitaire pour frais de recouvrement : 40 \\200.) Tj ET`); y -= 40;

  lines.push(`0.93 0.93 0.93 rg 50 ${y - 4} 510 20 re f`);
  lines.push(`0 0 0 rg`);
  lines.push(`BT /F1 10 Tf 55 ${y} Td (D\\351tails du paiement) Tj ET`); y -= 22;
  lines.push(`BT /F1 9 Tf 55 ${y} Td (Nom du b\\351n\\351ficiaire) Tj ET`);
  lines.push(`BT /F2 9 Tf 220 ${y} Td (EI - Zaghdoun Noa / N.Z Consulting) Tj ET`); y -= 15;
  lines.push(`BT /F1 9 Tf 55 ${y} Td (BIC) Tj ET`);
  lines.push(`BT /F2 9 Tf 220 ${y} Td (QNTOFRP1XXX) Tj ET`); y -= 15;
  lines.push(`BT /F1 9 Tf 55 ${y} Td (IBAN) Tj ET`);
  lines.push(`BT /F2 9 Tf 220 ${y} Td (FR7616958000019328768276650) Tj ET`); y -= 15;
  lines.push(`BT /F1 9 Tf 55 ${y} Td (R\\351f\\351rence) Tj ET`);
  lines.push(`BT /F2 9 Tf 220 ${y} Td (${esc(data.invoiceNumber)}) Tj ET`); y -= 30;

  lines.push(`0.85 0.85 0.85 RG 0.5 w 50 ${y} m 560 ${y} l S`); y -= 15;
  lines.push(`BT /F2 8 Tf 50 ${y} Td (EI - Zaghdoun Noa / N.Z Consulting, EI) Tj ET`);
  lines.push(`BT /F2 8 Tf 460 ${y} Td (${esc(data.invoiceNumber)} \\267 1/1) Tj ET`);

  const streamContent = lines.join('\n');
  const streamLen = new TextEncoder().encode(streamContent).length;

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

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { email, action } = await req.json();
    
    if (!email) {
      return new Response(JSON.stringify({ error: "email required" }), { status: 400, headers: corsHeaders });
    }

    console.log(`[RESUBMIT] Starting for ${email}, action: ${action || 'resubmit'}`);

    const RUBYPAYEUR_TOKEN = Deno.env.get('RUBYPAYEUR_TOKEN');
    if (!RUBYPAYEUR_TOKEN) {
      return new Response(JSON.stringify({ error: "RUBYPAYEUR_TOKEN not set" }), { status: 500, headers: corsHeaders });
    }

    const STRIPE_SECRET_KEY = Deno.env.get('STRIPE_SECRET_KEY');
    const supabaseAdmin = createClient(
      Deno.env.get("SUPABASE_URL") ?? "",
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? ""
    );

    // Get failed payment record
    const { data: fp, error: fpErr } = await supabaseAdmin
      .from('failed_payments')
      .select('*')
      .eq('email', email)
      .eq('resolved', false)
      .order('created_at', { ascending: false })
      .limit(1)
      .single();

    if (fpErr || !fp) {
      return new Response(JSON.stringify({ error: "No failed payment found for " + email }), { status: 404, headers: corsHeaders });
    }

    // Get profile
    const { data: profile } = await supabaseAdmin
      .from('profiles')
      .select('id, email, full_name, phone, siren, company_name')
      .eq('email', email)
      .single();

    // Authenticate with Rubypayeur
    const authResponse = await fetch('https://rubypayeur.com/api/debt_auth', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ token: RUBYPAYEUR_TOKEN }),
    });

    if (!authResponse.ok) {
      return new Response(JSON.stringify({ error: "Rubypayeur auth failed" }), { status: 500, headers: corsHeaders });
    }

    const authData = await authResponse.json();
    const authToken = authData.auth_token;

    // Step 1: Try to cancel old case if exists
    let oldCancelled = false;
    if (fp.rubypayeur_ref) {
      try {
        // Try DELETE endpoint
        const deleteRes = await fetch(`https://rubypayeur.com/api/debts/${fp.rubypayeur_ref}`, {
          method: 'DELETE',
          headers: { 'Authorization': `Bearer ${authToken}` },
        });
        console.log(`[RESUBMIT] Delete old case ${fp.rubypayeur_ref}: status ${deleteRes.status}`);
        
        if (deleteRes.ok) {
          oldCancelled = true;
        } else {
          // Try PUT to cancel
          const cancelRes = await fetch(`https://rubypayeur.com/api/debts/${fp.rubypayeur_ref}/cancel`, {
            method: 'PUT',
            headers: { 'Authorization': `Bearer ${authToken}`, 'Content-Type': 'application/json' },
          });
          console.log(`[RESUBMIT] Cancel old case ${fp.rubypayeur_ref}: status ${cancelRes.status}`);
          if (cancelRes.ok) oldCancelled = true;
        }
      } catch (e) {
        console.error(`[RESUBMIT] Failed to delete/cancel old case:`, e);
      }
    }

    // Step 2: Create new debt case with invoice + CGV
    const fullName = profile?.full_name || fp.full_name || 'Client';
    const nameParts = fullName.trim().split(' ');
    const firstName = nameParts[0] || 'Client';
    const lastName = nameParts.slice(1).join(' ') || 'Inconnu';

    const invoiceDate = fp.created_at.split('T')[0];
    const invoiceNumber = fp.stripe_invoice_id || `REC-${Date.now()}`;

    // Get billing address and TVA from Stripe
    let billingAddress = '';
    let billingCity = '';
    let billingCountry = '';
    let clientTvaNumber = '';
    if (fp.stripe_customer_id && STRIPE_SECRET_KEY) {
      try {
        const custRes = await fetch(`https://api.stripe.com/v1/customers/${fp.stripe_customer_id}`, {
          headers: { 'Authorization': `Bearer ${STRIPE_SECRET_KEY}` },
        });
        const custData = await custRes.json();
        const addr = custData.address;
        if (addr) {
          billingAddress = addr.line1 ? `${addr.line1}${addr.line2 ? ', ' + addr.line2 : ''}` : '';
          billingCity = addr.postal_code && addr.city ? `${addr.postal_code} ${addr.city}` : addr.city || '';
          billingCountry = addr.country || '';
        }
        if (custData.tax_ids?.data?.length) {
          clientTvaNumber = custData.tax_ids.data[0].value || '';
        }
      } catch (e) {
        console.error("[RESUBMIT] Failed to get Stripe customer:", e);
      }
    }

    const formData = new FormData();
    formData.append('debt[siren]', profile?.siren || fp.phone || '000000000');
    formData.append('debt[gender]', 'male');
    formData.append('debt[first_name]', firstName);
    formData.append('debt[last_name]', lastName);
    formData.append('debt[email]', email);
    formData.append('debt[phone]', profile?.phone || fp.phone || '0184807678');
    formData.append('debt[items_attributes][0][amount]', fp.amount.toFixed(2));
    formData.append('debt[items_attributes][0][invoice_number]', invoiceNumber);
    formData.append('debt[items_attributes][0][invoiced_on]', invoiceDate);
    formData.append('debt[items_attributes][0][due_date]', invoiceDate);
    formData.append('debt[late_fee]', '1');
    formData.append('debt[comment]', `Impayé abonnement VIP AMZing FBA - ${email} - Facture ${invoiceNumber} - CGV acceptées lors de l'inscription`);
    formData.append('debt[terms_agree]', '1');

    // Always use professional invoice PDF (matching company template)
    const pdfBytes = generateProfessionalInvoicePdf({
      invoiceNumber,
      invoiceDate,
      dueDate: invoiceDate,
      clientName: fullName,
      clientEmail: email,
      clientSiren: profile?.siren,
      clientCompanyName: profile?.company_name,
      clientAddress: billingAddress,
      clientCity: billingCity,
      clientCountry: billingCountry,
      clientTvaNumber: clientTvaNumber || undefined,
      amount: fp.amount,
    });
    const pdfFile = new File([pdfBytes], `facture-${invoiceNumber}.pdf`, { type: 'application/pdf' });
    formData.append('debt[items_attributes][0][billing_proof]', pdfFile);
    console.log("[RESUBMIT] Attached professional invoice PDF");

    // Attach CGV PDF as additional document
    try {
      const cgvPdfBytes = generateCgvPdf();
      const cgvFile = new File([cgvPdfBytes], 'CGV-AMZing-FBA.pdf', { type: 'application/pdf' });
      formData.append('debt[document]', cgvFile, 'CGV-AMZing-FBA.pdf');
      console.log(`[RESUBMIT] Attached CGV PDF (${cgvFile.size} bytes)`);
    } catch (e) {
      console.error("[RESUBMIT] Failed to generate CGV PDF:", e);
    }

    // Submit to Rubypayeur
    const debtResponse = await fetch('https://rubypayeur.com/api/debts', {
      method: 'POST',
      headers: { 'Authorization': `Bearer ${authToken}` },
      body: formData,
    });

    const debtResult = await debtResponse.json();
    console.log("[RESUBMIT] Rubypayeur response:", JSON.stringify(debtResult));

    if (debtResult.ref) {
      // Update failed_payment record
      await supabaseAdmin
        .from('failed_payments')
        .update({
          rubypayeur_submitted: true,
          rubypayeur_submitted_at: new Date().toISOString(),
          rubypayeur_ref: debtResult.ref,
          rubypayeur_status: 'submitted',
          notes: `Ressoumis le ${new Date().toLocaleDateString('fr-FR')} avec CGV. Ancien ref: ${fp.rubypayeur_ref || 'aucune'}${oldCancelled ? ' (supprimé)' : ''}`,
        })
        .eq('id', fp.id);

      return new Response(JSON.stringify({
        success: true,
        ref: debtResult.ref,
        old_ref: fp.rubypayeur_ref,
        old_cancelled: oldCancelled,
        message: `Nouveau dossier créé: ${debtResult.ref}`,
      }), { headers: { ...corsHeaders, 'Content-Type': 'application/json' } });
    } else {
      await supabaseAdmin
        .from('failed_payments')
        .update({
          rubypayeur_status: 'error',
          notes: `Erreur resoumission: ${JSON.stringify(debtResult.errors || debtResult)}`,
        })
        .eq('id', fp.id);

      return new Response(JSON.stringify({
        success: false,
        error: debtResult.errors || debtResult,
      }), { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } });
    }
  } catch (error) {
    console.error("[RESUBMIT] Error:", error);
    return new Response(JSON.stringify({ error: error instanceof Error ? error.message : 'Unknown error' }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
