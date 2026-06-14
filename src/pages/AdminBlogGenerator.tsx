import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Loader2, ArrowLeft, Sparkles, Eye, Save } from 'lucide-react';
import { useAuth } from '@/hooks/use-auth';
import { useAdmin } from '@/hooks/use-admin';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from '@/components/ui/select';
import BlogArticleContent from '@/components/blog/BlogArticleContent';
import BlogFAQ from '@/components/blog/BlogFAQ';

const slugify = (s: string) =>
  s.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '').slice(0, 80);

const AdminBlogGenerator = () => {
  const navigate = useNavigate();
  const { user, isLoading: authLoading } = useAuth();
  const { isAdmin, isLoading: adminLoading } = useAdmin();

  const [title, setTitle] = useState('');
  const [primaryKeywords, setPrimaryKeywords] = useState('');
  const [secondaryKeywords, setSecondaryKeywords] = useState('');
  const [imageCount, setImageCount] = useState(2);
  const [tone, setTone] = useState('professionnel');
  const [status, setStatus] = useState<'draft' | 'published'>('draft');
  const [category, setCategory] = useState('guide-fba');
  const [metaTitle, setMetaTitle] = useState('');
  const [metaDescription, setMetaDescription] = useState('');
  const [slug, setSlug] = useState('');
  const [generating, setGenerating] = useState(false);
  const [preview, setPreview] = useState<any>(null);

  useEffect(() => {
    if (!authLoading && !user) navigate('/auth');
    if (!adminLoading && user && !isAdmin) navigate('/');
  }, [user, isAdmin, authLoading, adminLoading, navigate]);

  useEffect(() => {
    if (title && !slug) setSlug(slugify(title));
  }, [title]); // eslint-disable-line

  const handleGenerate = async () => {
    if (!title.trim() || !primaryKeywords.trim()) {
      toast.error('Titre et mots-clés principaux requis');
      return;
    }
    setGenerating(true);
    setPreview(null);
    try {
      const { data, error } = await supabase.functions.invoke('admin-blog-generate', {
        body: {
          title,
          primaryKeywords: primaryKeywords.split(',').map(s => s.trim()).filter(Boolean),
          secondaryKeywords: secondaryKeywords.split(',').map(s => s.trim()).filter(Boolean),
          imageCount,
          tone,
          category,
          status,
          metaTitle: metaTitle || undefined,
          metaDescription: metaDescription || undefined,
          slug: slug || undefined,
        },
      });
      if (error) throw error;
      if ((data as any)?.error) throw new Error((data as any).error);
      setPreview((data as any).post);
      toast.success(
        status === 'published'
          ? 'Article publié avec succès !'
          : 'Brouillon enregistré'
      );
    } catch (e: any) {
      toast.error(e?.message || 'Erreur de génération');
    } finally {
      setGenerating(false);
    }
  };

  if (authLoading || adminLoading || !isAdmin) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin" />
      </div>
    );
  }

  // Adapter preview to BlogArticle shape for renderer
  const previewArticle = preview && {
    slug: preview.slug,
    title: preview.title,
    metaTitle: preview.meta_title,
    metaDescription: preview.meta_description,
    keywords: preview.keywords || [],
    excerpt: preview.excerpt || '',
    category: preview.category,
    type: 'satellite' as const,
    readTime: preview.read_time,
    publishedAt: (preview.published_at || preview.created_at || '').slice(0, 10),
    updatedAt: (preview.updated_at || preview.created_at || '').slice(0, 10),
    author: preview.author,
    image: preview.cover_image || '/og-image.jpg',
    content: preview.content,
    faqs: preview.faqs || [],
    relatedSlugs: [],
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main className="container mx-auto px-4 py-8 max-w-5xl">
        <div className="flex items-center justify-between mb-6">
          <Button variant="ghost" onClick={() => navigate('/admin/blog-articles')}>
            <ArrowLeft className="w-4 h-4 mr-2" /> Articles
          </Button>
          <h1 className="text-2xl md:text-3xl font-bold flex items-center gap-2">
            <Sparkles className="w-6 h-6 text-primary" />
            Générateur de blog IA
          </h1>
        </div>

        <Card className="mb-8">
          <CardHeader>
            <CardTitle>Paramètres de l'article</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label>Titre de l'article *</Label>
              <Input value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Ex: Comment trouver un produit rentable sur Amazon FBA en 2026" />
            </div>
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <Label>Mots-clés principaux * (séparés par virgule)</Label>
                <Input value={primaryKeywords} onChange={(e) => setPrimaryKeywords(e.target.value)} placeholder="amazon fba, produit gagnant" />
              </div>
              <div>
                <Label>Mots-clés secondaires</Label>
                <Input value={secondaryKeywords} onChange={(e) => setSecondaryKeywords(e.target.value)} placeholder="sourcing, rentabilité, keepa" />
              </div>
            </div>
            <div className="grid md:grid-cols-4 gap-4">
              <div>
                <Label>Nb d'images</Label>
                <Input type="number" min={0} max={6} value={imageCount} onChange={(e) => setImageCount(Number(e.target.value))} />
              </div>
              <div>
                <Label>Ton</Label>
                <Select value={tone} onValueChange={setTone}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="professionnel">Professionnel</SelectItem>
                    <SelectItem value="vendeur">Vendeur</SelectItem>
                    <SelectItem value="educatif">Éducatif</SelectItem>
                    <SelectItem value="expert">Expert Amazon FBA</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label>Catégorie</Label>
                <Select value={category} onValueChange={setCategory}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="guide-fba">Guide FBA</SelectItem>
                    <SelectItem value="produits-rentables">Produits Rentables</SelectItem>
                    <SelectItem value="logistique">Logistique</SelectItem>
                    <SelectItem value="vendre-amazon">Vendre sur Amazon</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label>Statut</Label>
                <Select value={status} onValueChange={(v) => setStatus(v as any)}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="draft">Brouillon</SelectItem>
                    <SelectItem value="published">Publier directement</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <Label>Meta title SEO (optionnel)</Label>
                <Input value={metaTitle} onChange={(e) => setMetaTitle(e.target.value)} maxLength={70} />
              </div>
              <div>
                <Label>Slug URL</Label>
                <Input value={slug} onChange={(e) => setSlug(slugify(e.target.value))} />
              </div>
            </div>
            <div>
              <Label>Meta description SEO (optionnel)</Label>
              <Textarea value={metaDescription} onChange={(e) => setMetaDescription(e.target.value)} maxLength={180} rows={2} />
            </div>

            <Button onClick={handleGenerate} disabled={generating} size="lg" className="w-full">
              {generating ? (
                <><Loader2 className="w-4 h-4 mr-2 animate-spin" /> Génération de l'article en cours…</>
              ) : (
                <><Sparkles className="w-4 h-4 mr-2" /> Générer l'article</>
              )}
            </Button>
          </CardContent>
        </Card>

        {previewArticle && (
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle className="flex items-center gap-2">
                <Eye className="w-5 h-5" /> Aperçu de l'article
              </CardTitle>
              <div className="flex gap-2">
                <Button variant="outline" onClick={() => navigate(`/admin/blog-articles`)}>
                  <Save className="w-4 h-4 mr-2" /> Gérer
                </Button>
                <Button onClick={() => window.open(`/blog/${preview.slug}`, '_blank')}>
                  Voir l'article
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              {preview.cover_image && (
                <img src={preview.cover_image} alt={previewArticle.title} className="w-full rounded-lg mb-6 aspect-video object-cover" />
              )}
              <h1 className="text-3xl font-bold mb-4">{previewArticle.title}</h1>
              <p className="text-muted-foreground mb-6">{previewArticle.excerpt}</p>
              <BlogArticleContent article={previewArticle} />
              {previewArticle.faqs.length > 0 && (
                <BlogFAQ faqs={previewArticle.faqs} articleTitle={previewArticle.title} />
              )}
            </CardContent>
          </Card>
        )}
      </main>
      <Footer />
    </div>
  );
};

export default AdminBlogGenerator;
