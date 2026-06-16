// Public proxy that streams files from the private "blog-ai-images" bucket.
// URL format: /functions/v1/blog-image/<slug>/<filename>.png
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.45.0";

const SUPABASE_URL = Deno.env.get("SUPABASE_URL")!;
const SERVICE_KEY = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "*",
};

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response("ok", { headers: corsHeaders });

  try {
    const url = new URL(req.url);
    // Path after the function name. Examples:
    // /functions/v1/blog-image/my-slug/123-0.png
    // /blog-image/my-slug/123-0.png
    const marker = "/blog-image/";
    const idx = url.pathname.indexOf(marker);
    if (idx === -1) return new Response("Not found", { status: 404 });
    const objectPath = decodeURIComponent(url.pathname.slice(idx + marker.length));
    if (!objectPath) return new Response("Missing path", { status: 400 });

    const admin = createClient(SUPABASE_URL, SERVICE_KEY);
    const { data, error } = await admin.storage.from("blog-ai-images").download(objectPath);
    if (error || !data) return new Response("Not found", { status: 404 });

    return new Response(data, {
      headers: {
        ...corsHeaders,
        "Content-Type": data.type || "image/png",
        "Cache-Control": "public, max-age=31536000, immutable",
      },
    });
  } catch (e) {
    return new Response(`Error: ${(e as Error).message}`, { status: 500 });
  }
});
