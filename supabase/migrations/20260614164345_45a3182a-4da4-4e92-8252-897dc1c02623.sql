CREATE POLICY "Public read blog-ai-images"
  ON storage.objects FOR SELECT
  USING (bucket_id = 'blog-ai-images');

CREATE POLICY "Admins upload blog-ai-images"
  ON storage.objects FOR INSERT TO authenticated
  WITH CHECK (bucket_id = 'blog-ai-images' AND public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins update blog-ai-images"
  ON storage.objects FOR UPDATE TO authenticated
  USING (bucket_id = 'blog-ai-images' AND public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins delete blog-ai-images"
  ON storage.objects FOR DELETE TO authenticated
  USING (bucket_id = 'blog-ai-images' AND public.has_role(auth.uid(), 'admin'));