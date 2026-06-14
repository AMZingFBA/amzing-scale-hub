// Helpers to fetch AI-generated blog posts from the DB and adapt them
// to the existing BlogArticle interface used by Blog.tsx / BlogPost.tsx.
import { supabase } from '@/integrations/supabase/client';
import type { BlogArticle } from '@/lib/blog-data';

export interface DbBlogPost {
  id: string;
  slug: string;
  title: string;
  meta_title: string;
  meta_description: string;
  excerpt: string;
  content: string;
  category: string;
  keywords: string[];
  related_slugs: string[];
  cover_image: string | null;
  images: { url: string; alt: string }[];
  faqs: { question: string; answer: string }[];
  read_time: number;
  author: string;
  status: 'draft' | 'published';
  published_at: string | null;
  created_at: string;
  updated_at: string;
}

const FALLBACK_COVER = '/og-image.jpg';

export function dbToArticle(p: DbBlogPost): BlogArticle {
  const allowedCategories: BlogArticle['category'][] = [
    'guide-fba', 'produits-rentables', 'logistique', 'vendre-amazon',
  ];
  const category = (allowedCategories as string[]).includes(p.category)
    ? (p.category as BlogArticle['category'])
    : 'guide-fba';

  return {
    slug: p.slug,
    title: p.title,
    metaTitle: p.meta_title,
    metaDescription: p.meta_description,
    keywords: p.keywords || [],
    excerpt: p.excerpt,
    category,
    type: 'satellite',
    readTime: p.read_time || 8,
    publishedAt: (p.published_at || p.created_at).slice(0, 10),
    updatedAt: (p.updated_at || p.created_at).slice(0, 10),
    author: p.author || 'AMZing FBA',
    image: p.cover_image || FALLBACK_COVER,
    content: p.content,
    faqs: p.faqs || [],
    relatedSlugs: p.related_slugs || [],
  };
}

export async function fetchPublishedDbArticles(): Promise<BlogArticle[]> {
  const { data, error } = await supabase
    .from('blog_posts' as any)
    .select('*')
    .eq('status', 'published')
    .order('published_at', { ascending: false });
  if (error || !data) return [];
  return (data as unknown as DbBlogPost[]).map(dbToArticle);
}

export async function fetchDbArticleBySlug(slug: string): Promise<BlogArticle | undefined> {
  const { data, error } = await supabase
    .from('blog_posts' as any)
    .select('*')
    .eq('slug', slug)
    .eq('status', 'published')
    .maybeSingle();
  if (error || !data) return undefined;
  return dbToArticle(data as unknown as DbBlogPost);
}

export async function fetchAllDbPostsAdmin(): Promise<DbBlogPost[]> {
  const { data, error } = await supabase
    .from('blog_posts' as any)
    .select('*')
    .order('created_at', { ascending: false });
  if (error || !data) return [];
  return data as unknown as DbBlogPost[];
}
