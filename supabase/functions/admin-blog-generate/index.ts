// Edge function: génère un article de blog complet via Lovable AI + images
// Accessible uniquement aux administrateurs (vérifie auth + rôle admin)
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.45.0";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
};

const SUPABASE_URL = Deno.env.get("SUPABASE_URL")!;
const SERVICE_KEY = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
const ANON_KEY = Deno.env.get("SUPABASE_ANON_KEY")!;
const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY")!;

interface BodyInput {
  title: string;
  primaryKeywords: string[];
  secondaryKeywords?: string[];
  imageCount?: number;
  tone?: string;
  category?: string;
  status?: "draft" | "published";
  metaTitle?: string;
  metaDescription?: string;
  slug?: string;
}

function slugify(s: string) {
  return s
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 80);
}

async function ensureUniqueSlug(supabase: any, base: string): Promise<string> {
  let slug = base;
  let i = 2;
  while (true) {
    const { data } = await supabase
      .from("blog_posts")
      .select("id")
      .eq("slug", slug)
      .maybeSingle();
    if (!data) return slug;
    slug = `${base}-${i++}`;
    if (i > 20) return `${base}-${Date.now()}`;
  }
}

async function generateText(input: BodyInput) {
  const system = `Tu es un expert SEO et rédacteur professionnel spécialisé Amazon FBA, sourcing, formation, IA et e-commerce. Tu rédiges des articles longs (1500-2200 mots), structurés, crédibles, en français, optimisés pour le référencement Google. Tu intègres naturellement les mots-clés fournis. Tu termines toujours par un appel à l'action vers la formation et l'accompagnement AMZing FBA (lien interne /formation et /contact).`;

  const user = `Rédige un article de blog complet.

Titre: ${input.title}
Mots-clés principaux: ${input.primaryKeywords.join(", ")}
Mots-clés secondaires: ${(input.secondaryKeywords || []).join(", ")}
Ton: ${input.tone || "professionnel et expert"}
Catégorie: ${input.category || "guide-fba"}

IMPORTANT: réponds UNIQUEMENT par un objet JSON valide (pas de texte autour, pas de markdown). Schéma:

{
  "metaTitle": "string (<60 caractères, accrocheur, contient mot-clé principal)",
  "metaDescription": "string (<160 caractères, vendeur, contient mot-clé)",
  "excerpt": "string (150-200 caractères, accroche)",
  "slug": "string (slug url propre, en kebab-case)",
  "readTime": number (minutes de lecture, 8-15),
  "content": "string (article complet en MARKDOWN: intro forte, sections ## H2, sous-sections ### H3, listes, paragraphes riches. Pas de # H1 - le titre est ailleurs. Termine par une section ## Passez à l'action avec un CTA vers /formation et /contact). Place exactement les marqueurs [[IMAGE_1]], [[IMAGE_2]]... aux endroits pertinents dans l'article pour insérer les images (sans marqueur pour la couverture).",
  "imagePrompts": ["prompt anglais court et précis pour chaque image secondaire à insérer, style photo professionnelle e-commerce / business Amazon FBA, moderne, lumineux"],
  "coverImagePrompt": "prompt anglais pour l'image de couverture (hero) professionnelle, moderne, business Amazon FBA",
  "imageAlts": ["alt text français court et SEO pour chaque image secondaire"],
  "coverImageAlt": "alt text français court et SEO pour la couverture",
  "faqs": [{"question": "string", "answer": "string (réponse complète 80-150 mots)"}],
  "keywords": ["string"]
}

Nombre d'images secondaires à prévoir (et donc de marqueurs [[IMAGE_N]] dans content): ${input.imageCount ?? 2}.
FAQ: 5 à 7 questions/réponses pertinentes SEO.
keywords: regroupe principaux + secondaires + variantes pertinentes (max 10).`;

  const res = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${LOVABLE_API_KEY}`,
    },
    body: JSON.stringify({
      model: "google/gemini-2.5-pro",
      messages: [
        { role: "system", content: system },
        { role: "user", content: user },
      ],
      response_format: { type: "json_object" },
    }),
  });

  if (!res.ok) {
    const txt = await res.text();
    throw new Error(`AI text gen failed ${res.status}: ${txt.slice(0, 300)}`);
  }
  const data = await res.json();
  const raw = data?.choices?.[0]?.message?.content ?? "{}";
  let parsed: any;
  try {
    parsed = JSON.parse(raw);
  } catch {
    // best-effort extract
    const m = raw.match(/\{[\s\S]*\}/);
    parsed = m ? JSON.parse(m[0]) : {};
  }
  return parsed;
}

async function generateImage(prompt: string): Promise<Uint8Array> {
  const res = await fetch("https://ai.gateway.lovable.dev/v1/images/generations", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${LOVABLE_API_KEY}`,
    },
    body: JSON.stringify({
      model: "openai/gpt-image-2",
      prompt,
      size: "1536x1024",
      quality: "low",
      n: 1,
    }),
  });
  if (!res.ok) {
    const txt = await res.text();
    throw new Error(`Image gen failed ${res.status}: ${txt.slice(0, 300)}`);
  }
  const data = await res.json();
  const b64 = data?.data?.[0]?.b64_json;
  if (!b64) throw new Error("No image returned");
  const bin = Uint8Array.from(atob(b64), (c) => c.charCodeAt(0));
  return bin;
}

async function uploadImage(supabaseAdmin: any, slug: string, idx: number, bytes: Uint8Array): Promise<string> {
  const path = `${slug}/${Date.now()}-${idx}.png`;
  const { error } = await supabaseAdmin.storage
    .from("blog-ai-images")
    .upload(path, bytes, { contentType: "image/png", upsert: false });
  if (error) throw new Error(`Upload failed: ${error.message}`);
  return `${SUPABASE_URL}/functions/v1/blog-image/${path}`;
}


Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response("ok", { headers: corsHeaders });

  try {
    const authHeader = req.headers.get("Authorization");
    if (!authHeader) {
      return new Response(JSON.stringify({ error: "Unauthorized" }), {
        status: 401, headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // Validate user + admin role
    const userClient = createClient(SUPABASE_URL, ANON_KEY, {
      global: { headers: { Authorization: authHeader } },
    });
    const { data: userData, error: userErr } = await userClient.auth.getUser();
    if (userErr || !userData?.user) {
      return new Response(JSON.stringify({ error: "Unauthorized" }), {
        status: 401, headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }
    const userId = userData.user.id;

    const supabaseAdmin = createClient(SUPABASE_URL, SERVICE_KEY);
    const { data: roleRow } = await supabaseAdmin
      .from("user_roles")
      .select("role")
      .eq("user_id", userId)
      .eq("role", "admin")
      .maybeSingle();
    if (!roleRow) {
      return new Response(JSON.stringify({ error: "Forbidden: admin only" }), {
        status: 403, headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const body = (await req.json()) as BodyInput;
    if (!body?.title || !Array.isArray(body.primaryKeywords) || body.primaryKeywords.length === 0) {
      return new Response(JSON.stringify({ error: "title et primaryKeywords requis" }), {
        status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const imageCount = Math.max(0, Math.min(6, Number(body.imageCount ?? 2)));

    // 1. Generate text
    const ai = await generateText({ ...body, imageCount });

    // 2. Slug
    const baseSlug = slugify(body.slug || ai.slug || body.title);
    const slug = await ensureUniqueSlug(supabaseAdmin, baseSlug);

    // 3. Cover image
    let coverUrl: string | null = null;
    try {
      const coverPrompt = ai.coverImagePrompt || `Professional modern hero image about ${body.title}, Amazon FBA e-commerce business, bright clean studio photography`;
      const coverBytes = await generateImage(coverPrompt);
      coverUrl = await uploadImage(supabaseAdmin, slug, 0, coverBytes);
    } catch (e) {
      console.error("Cover image error:", e);
    }

    // 4. Secondary images
    const imagesMeta: { url: string; alt: string }[] = [];
    let content: string = ai.content || "";
    for (let i = 0; i < imageCount; i++) {
      try {
        const prompt = ai.imagePrompts?.[i] || `Professional image illustrating ${body.title}, Amazon FBA business context, modern, bright`;
        const alt = ai.imageAlts?.[i] || body.title;
        const bytes = await generateImage(prompt);
        const url = await uploadImage(supabaseAdmin, slug, i + 1, bytes);
        imagesMeta.push({ url, alt });
        const marker = `[[IMAGE_${i + 1}]]`;
        const md = `\n\n![${alt}](${url})\n*${alt}*\n\n`;
        if (content.includes(marker)) {
          content = content.replaceAll(marker, md);
        } else {
          // Insert after paragraph at proportional position
          const parts = content.split("\n\n");
          const pos = Math.floor(((i + 1) / (imageCount + 1)) * parts.length);
          parts.splice(pos, 0, md.trim());
          content = parts.join("\n\n");
        }
      } catch (e) {
        console.error(`Image ${i} error:`, e);
      }
    }
    // strip any remaining markers
    content = content.replace(/\[\[IMAGE_\d+\]\]/g, "");

    // 5. Insert in DB
    const status = body.status === "published" ? "published" : "draft";
    const insertRow = {
      slug,
      title: body.title,
      meta_title: (body.metaTitle || ai.metaTitle || body.title).slice(0, 70),
      meta_description: (body.metaDescription || ai.metaDescription || ai.excerpt || "").slice(0, 180),
      excerpt: (ai.excerpt || "").slice(0, 400),
      content,
      category: body.category || "guide-fba",
      keywords: Array.isArray(ai.keywords) && ai.keywords.length ? ai.keywords : [...body.primaryKeywords, ...(body.secondaryKeywords || [])],
      related_slugs: [],
      cover_image: coverUrl,
      images: imagesMeta,
      faqs: Array.isArray(ai.faqs) ? ai.faqs : [],
      tone: body.tone || null,
      read_time: Number(ai.readTime) || 10,
      author: "AMZing FBA",
      status,
      author_id: userId,
      published_at: status === "published" ? new Date().toISOString() : null,
    };

    const { data: inserted, error: insertErr } = await supabaseAdmin
      .from("blog_posts")
      .insert(insertRow)
      .select("*")
      .single();

    if (insertErr) {
      return new Response(JSON.stringify({ error: insertErr.message }), {
        status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    return new Response(JSON.stringify({ post: inserted }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (e) {
    console.error("admin-blog-generate error:", e);
    return new Response(JSON.stringify({ error: String((e as Error).message || e) }), {
      status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
