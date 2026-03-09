import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { name, email, phone, subject, message } = await req.json();

    if (!name || !email || !subject || !message) {
      return new Response(
        JSON.stringify({ error: "Champs requis manquants" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const RESEND_API_KEY = Deno.env.get("RESEND_API_KEY");
    
    if (!RESEND_API_KEY) {
      // Fallback: log the contact and return success
      console.log("Contact form submission (no email provider configured):", {
        name, email, phone, subject, message,
        timestamp: new Date().toISOString(),
      });
      return new Response(
        JSON.stringify({ success: true, note: "Message enregistré" }),
        { headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Send email via Resend
    const res = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${RESEND_API_KEY}`,
      },
      body: JSON.stringify({
        from: "AMZing FBA <noreply@amzingfba.com>",
        to: ["contact@amzingfba.com"],
        reply_to: email,
        subject: `[Contact] ${subject}`,
        html: `
          <h2>Nouveau message de contact</h2>
          <p><strong>Nom :</strong> ${name}</p>
          <p><strong>Email :</strong> ${email}</p>
          ${phone ? `<p><strong>Téléphone :</strong> ${phone}</p>` : ""}
          <p><strong>Sujet :</strong> ${subject}</p>
          <hr />
          <p>${message.replace(/\n/g, "<br/>")}</p>
        `,
      }),
    });

    if (!res.ok) {
      const errorData = await res.text();
      console.error("Resend error:", errorData);
      throw new Error("Échec de l'envoi de l'email");
    }

    return new Response(
      JSON.stringify({ success: true }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (error) {
    console.error("Error:", error);
    return new Response(
      JSON.stringify({ error: error.message }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
