// Edge function appelée par cron (toutes les heures).
// 1) Récupère les données Google Search Console (28 derniers jours)
// 2) Combine 2 stratégies: quick-wins (positions 11-30) + impressions élevées / CTR faible
// 3) Choisit un mot-clé pas encore utilisé
// 4) Génère un article complet (texte + images) via Lovable AI
// 5) Publie + log dans auto_blog_runs + ping Google sitemap
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.45.0";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
};

const SUPABASE_URL = Deno.env.get("SUPABASE_URL")!;
const SERVICE_KEY = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY")!;
const GSC_KEY = Deno.env.get("GOOGLE_SEARCH_CONSOLE_API_KEY")!;
const SITE_URL = "https://amzingfba.com/";

function slugify(s: string) {
  return s.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "").slice(0, 80);
}

async function ensureUniqueSlug(supabase: any, base: string): Promise<string> {
  let slug = base; let i = 2;
  while (true) {
    const { data } = await supabase.from("blog_posts").select("id").eq("slug", slug).maybeSingle();
    if (!data) return slug;
    slug = `${base}-${i++}`;
    if (i > 20) return `${base}-${Date.now()}`;
  }
}

async function fetchGscQueries(): Promise<any[]> {
  const end = new Date();
  const start = new Date(end.getTime() - 28 * 24 * 60 * 60 * 1000);
  const fmt = (d: Date) => d.toISOString().slice(0, 10);
  const encoded = encodeURIComponent(SITE_URL);
  const res = await fetch(
    `https://connector-gateway.lovable.dev/google_search_console/webmasters/v3/sites/${encoded}/searchAnalytics/query`,
    {
      method: "POST",
      headers: {
        Authorization: `Bearer ${LOVABLE_API_KEY}`,
        "X-Connection-Api-Key": GSC_KEY,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        startDate: fmt(start),
        endDate: fmt(end),
        dimensions: ["query"],
        rowLimit: 500,
      }),
    },
  );
  if (!res.ok) {
    const t = await res.text();
    throw new Error(`GSC fetch failed ${res.status}: ${t.slice(0, 200)}`);
  }
  const data = await res.json();
  return data?.rows || [];
}

async function pickKeyword(supabase: any) {
  const rows = await fetchGscQueries();
  // rows: { keys:[query], clicks, impressions, ctr, position }
  // Strategy A: quick wins (position 11-30 with >= 50 impressions)
  const quickWins = rows
    .filter((r) => r.position >= 11 && r.position <= 30 && r.impressions >= 50)
    .sort((a, b) => b.impressions - a.impressions);
  // Strategy B: high impressions low CTR (>=200 impressions, ctr<0.02)
  const lowCtr = rows
    .filter((r) => r.impressions >= 200 && r.ctr < 0.02)
    .sort((a, b) => b.impressions - a.impressions);

  // Get already-used keywords
  const { data: used } = await supabase
    .from("auto_blog_runs")
    .select("keyword")
    .eq("status", "success");
  const usedSet = new Set((used || []).map((u: any) => u.keyword.toLowerCase()));

  // Also exclude keywords that already appear as a slug substring
  const { data: posts } = await supabase.from("blog_posts").select("slug,title");
  const existingSlugs = (posts || []).map((p: any) => p.slug.toLowerCase());

  const isUsable = (kw: string) => {
    const lk = kw.toLowerCase();
    if (usedSet.has(lk)) return false;
    const slug = slugify(kw);
    if (existingSlugs.some((s: string) => s.includes(slug) || slug.includes(s))) return false;
    return true;
  };

  // Alternate strategies: round-robin via current hour
  const hour = new Date().getUTCHours();
  const order = hour % 2 === 0 ? [quickWins, lowCtr] : [lowCtr, quickWins];
  const strategyName = hour % 2 === 0 ? "quick_win" : "low_ctr";

  for (const list of order) {
    for (const r of list) {
      const kw = r.keys?.[0];
      if (!kw) continue;
      if (kw.length < 4 || kw.length > 80) continue;
      if (isUsable(kw)) {
        return { keyword: kw, gsc: r, strategy: list === quickWins ? "quick_win" : "low_ctr" };
      }
    }
  }
  return null;
}

async function generateText(keyword: string, gsc: any) {
  const system = `Tu es un expert SEO francophone spécialisé Amazon FBA, sourcing, IA et e-commerce. Tu écris des articles complets (1500-2200 mots), structurés, naturels, sans bourrage de mots-clés.`;
  const user = `Génère un article de blog SEO pour la marque AMZing FBA, basé sur ce mot-clé Google Search Console:

Mot-clé: "${keyword}"
Données GSC: position ${gsc.position?.toFixed(1)}, ${gsc.impressions} impressions, ${gsc.clicks} clics, CTR ${(gsc.ctr * 100).toFixed(2)}%

Réponds UNIQUEMENT en JSON valide:
{
  "title": "titre accrocheur 50-65 caractères contenant le mot-clé",
  "metaTitle": "<60 caractères",
  "metaDescription": "<160 caractères vendeur",
  "excerpt": "150-200 caractères",
  "slug": "kebab-case-url",
  "readTime": 8-15,
  "content": "article Markdown complet (## H2, ### H3, listes, paragraphes), termine par section '## Passez à l'action' avec CTA vers /formation et /contact. Place [[IMAGE_1]] et [[IMAGE_2]] dans le corps.",
  "coverImagePrompt": "prompt EN photo pro business Amazon FBA",
  "coverImageAlt": "alt FR court",
  "imagePrompts": ["prompt EN 1", "prompt EN 2"],
  "imageAlts": ["alt FR 1", "alt FR 2"],
  "faqs": [{"question":"...","answer":"80-150 mots"}],
  "keywords": ["max 10"],
  "category": "guide-fba"
}`;
  const res = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
    method: "POST",
    headers: { "Content-Type": "application/json", Authorization: `Bearer ${LOVABLE_API_KEY}` },
    body: JSON.stringify({
      model: "google/gemini-2.5-pro",
      messages: [{ role: "system", content: system }, { role: "user", content: user }],
      response_format: { type: "json_object" },
    }),
  });
  if (!res.ok) throw new Error(`AI text ${res.status}: ${(await res.text()).slice(0, 200)}`);
  const data = await res.json();
  const raw = data?.choices?.[0]?.message?.content ?? "{}";
  try { return JSON.parse(raw); } catch {
    const m = raw.match(/\{[\s\S]*\}/);
    return m ? JSON.parse(m[0]) : {};
  }
}

async function generateImage(prompt: string): Promise<Uint8Array> {
  const res = await fetch("https://ai.gateway.lovable.dev/v1/images/generations", {
    method: "POST",
    headers: { "Content-Type": "application/json", Authorization: `Bearer ${LOVABLE_API_KEY}` },
    body: JSON.stringify({ model: "openai/gpt-image-2", prompt, size: "1536x1024", quality: "low", n: 1 }),
  });
  if (!res.ok) throw new Error(`Image ${res.status}`);
  const data = await res.json();
  const b64 = data?.data?.[0]?.b64_json;
  if (!b64) throw new Error("no image");
  return Uint8Array.from(atob(b64), (c) => c.charCodeAt(0));
}

async function uploadImage(admin: any, slug: string, idx: number, bytes: Uint8Array): Promise<string> {
  const path = `${slug}/${Date.now()}-${idx}.png`;
  const { error } = await admin.storage.from("blog-ai-images").upload(path, bytes, { contentType: "image/png" });
  if (error) throw new Error(error.message);
  return admin.storage.from("blog-ai-images").getPublicUrl(path).data.publicUrl;
}

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response("ok", { headers: corsHeaders });

  const admin = createClient(SUPABASE_URL, SERVICE_KEY);

  try {
    const picked = await pickKeyword(admin);
    if (!picked) {
      return new Response(JSON.stringify({ skipped: true, reason: "no eligible keyword" }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const ai = await generateText(picked.keyword, picked.gsc);
    if (!ai.title || !ai.content) throw new Error("AI returned incomplete article");

    const baseSlug = slugify(ai.slug || ai.title);
    const slug = await ensureUniqueSlug(admin, baseSlug);

    // Cover image
    let coverUrl: string | null = null;
    try {
      const bytes = await generateImage(ai.coverImagePrompt || `Professional Amazon FBA hero image about ${picked.keyword}`);
      coverUrl = await uploadImage(admin, slug, 0, bytes);
    } catch (e) { console.error("cover", e); }

    // Secondary images
    const imagesMeta: { url: string; alt: string }[] = [];
    let content: string = ai.content;
    const prompts: string[] = ai.imagePrompts || [];
    for (let i = 0; i < Math.min(prompts.length, 2); i++) {
      try {
        const bytes = await generateImage(prompts[i]);
        const url = await uploadImage(admin, slug, i + 1, bytes);
        const alt = ai.imageAlts?.[i] || picked.keyword;
        imagesMeta.push({ url, alt });
        const marker = `[[IMAGE_${i + 1}]]`;
        const md = `\n\n![${alt}](${url})\n*${alt}*\n\n`;
        if (content.includes(marker)) content = content.replaceAll(marker, md);
        else {
          const parts = content.split("\n\n");
          const pos = Math.floor(((i + 1) / (prompts.length + 1)) * parts.length);
          parts.splice(pos, 0, md.trim());
          content = parts.join("\n\n");
        }
      } catch (e) { console.error(`img ${i}`, e); }
    }
    content = content.replace(/\[\[IMAGE_\d+\]\]/g, "");

    const insertRow = {
      slug,
      title: ai.title,
      meta_title: (ai.metaTitle || ai.title).slice(0, 70),
      meta_description: (ai.metaDescription || ai.excerpt || "").slice(0, 180),
      excerpt: (ai.excerpt || "").slice(0, 400),
      content,
      category: ai.category || "guide-fba",
      keywords: Array.isArray(ai.keywords) ? ai.keywords.slice(0, 10) : [picked.keyword],
      related_slugs: [],
      cover_image: coverUrl,
      images: imagesMeta,
      faqs: Array.isArray(ai.faqs) ? ai.faqs : [],
      tone: "expert",
      read_time: Number(ai.readTime) || 10,
      author: "AMZing FBA",
      status: "published",
      published_at: new Date().toISOString(),
    };

    const { data: post, error } = await admin.from("blog_posts").insert(insertRow).select("id,slug").single();
    if (error) throw new Error(error.message);

    await admin.from("auto_blog_runs").insert({
      keyword: picked.keyword,
      strategy: picked.strategy,
      blog_post_id: post.id,
      blog_slug: post.slug,
      status: "success",
      gsc_data: picked.gsc,
    });

    // Ping Google sitemap (fire & forget)
    fetch(`https://www.google.com/ping?sitemap=${encodeURIComponent("https://amzingfba.com/blog-sitemap.xml")}`).catch(() => {});

    return new Response(JSON.stringify({ ok: true, keyword: picked.keyword, slug: post.slug, strategy: picked.strategy }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (e) {
    const msg = String((e as Error).message || e);
    console.error("auto-blog error:", msg);
    try {
      await admin.from("auto_blog_runs").insert({
        keyword: "(error)", strategy: "n/a", status: "error", error: msg.slice(0, 500),
      });
    } catch {}
    return new Response(JSON.stringify({ error: msg }), {
      status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
