UPDATE public.blog_posts
SET cover_image = REPLACE(
  cover_image,
  'https://wvmfzlogijvqcsgablrb.supabase.co/storage/v1/object/public/blog-ai-images/',
  'https://wvmfzlogijvqcsgablrb.supabase.co/functions/v1/blog-image/'
)
WHERE cover_image LIKE 'https://wvmfzlogijvqcsgablrb.supabase.co/storage/v1/object/public/blog-ai-images/%';

UPDATE public.blog_posts
SET content = REPLACE(
  content,
  'https://wvmfzlogijvqcsgablrb.supabase.co/storage/v1/object/public/blog-ai-images/',
  'https://wvmfzlogijvqcsgablrb.supabase.co/functions/v1/blog-image/'
)
WHERE content LIKE '%/storage/v1/object/public/blog-ai-images/%';