// Sert un sitemap XML dynamique listant tous les blog_posts publiés.
// Accessible publiquement à /functions/v1/blog-sitemap ; un rewrite Netlify expose /blog-sitemap.xml.
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.45.0";

const SUPABASE_URL = Deno.env.get("SUPABASE_URL")!;
const SERVICE_KEY = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
const BASE = "https://amzingfba.com";

Deno.serve(async () => {
  const admin = createClient(SUPABASE_URL, SERVICE_KEY);
  const { data } = await admin
    .from("blog_posts")
    .select("slug, updated_at, published_at")
    .eq("status", "published")
    .order("published_at", { ascending: false })
    .limit(5000);

  const urls = (data || []).map((p: any) => {
    const last = (p.updated_at || p.published_at || new Date().toISOString()).slice(0, 10);
    return `  <url>
    <loc>${BASE}/blog/${p.slug}</loc>
    <lastmod>${last}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.7</priority>
  </url>`;
  }).join("\n");

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <url>
    <loc>${BASE}/blog</loc>
    <changefreq>daily</changefreq>
    <priority>0.8</priority>
  </url>
${urls}
</urlset>`;

  return new Response(xml, {
    headers: {
      "Content-Type": "application/xml; charset=utf-8",
      "Cache-Control": "public, max-age=600",
      "Access-Control-Allow-Origin": "*",
    },
  });
});
