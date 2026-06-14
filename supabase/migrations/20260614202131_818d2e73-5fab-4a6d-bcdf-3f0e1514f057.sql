CREATE TABLE public.auto_blog_runs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  keyword TEXT NOT NULL,
  strategy TEXT NOT NULL,
  blog_post_id UUID REFERENCES public.blog_posts(id) ON DELETE SET NULL,
  blog_slug TEXT,
  status TEXT NOT NULL DEFAULT 'success',
  error TEXT,
  gsc_data JSONB,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
CREATE UNIQUE INDEX auto_blog_runs_keyword_unique ON public.auto_blog_runs (LOWER(keyword)) WHERE status = 'success';
CREATE INDEX auto_blog_runs_created_at_idx ON public.auto_blog_runs (created_at DESC);

GRANT SELECT ON public.auto_blog_runs TO authenticated;
GRANT ALL ON public.auto_blog_runs TO service_role;

ALTER TABLE public.auto_blog_runs ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Admin can view auto blog runs"
ON public.auto_blog_runs FOR SELECT
TO authenticated
USING (public.has_role(auth.uid(), 'admin'));