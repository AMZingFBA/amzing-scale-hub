import { useEffect, useState } from 'react';
import { useParams, Link, useNavigate, Navigate } from 'react-router-dom';
import { ArrowLeft, Clock, Calendar, Share2, ChevronRight, User, Award, BookOpen, Star } from 'lucide-react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import SEO from '@/components/SEO';
import BlogFAQ from '@/components/blog/BlogFAQ';
import BlogSidebar from '@/components/blog/BlogSidebar';
import BlogArticleContent from '@/components/blog/BlogArticleContent';
import BlogConversionCTA from '@/components/blog/BlogConversionCTA';
import BlogStickyMobileCTA from '@/components/blog/BlogStickyMobileCTA';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { getArticleBySlug, blogCategories, type BlogArticle } from '@/lib/blog-data';
import { fetchDbArticleBySlug } from '@/lib/blog-db';
import { toast } from 'sonner';

// Redirections SEO 301 (cannibalisation) — voir aussi netlify.toml
const BLOG_REDIRECTS: Record<string, string> = {
  'fba-amazon-cest-quoi-explication-complete': 'amazon-fba-cest-quoi-guide-complet',
  'cest-quoi-amazon-fba-definition-complete': 'amazon-fba-cest-quoi-guide-complet',
};

const BlogPost = () => {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();

  // Redirection SPA pour les slugs cannibalisants
  if (slug && BLOG_REDIRECTS[slug]) {
    return <Navigate to={`/blog/${BLOG_REDIRECTS[slug]}`} replace />;
  }


  const staticArticle = slug ? getArticleBySlug(slug) : undefined;
  const [article, setArticle] = useState<BlogArticle | undefined>(staticArticle);
  const [loading, setLoading] = useState(!staticArticle && !!slug);

  useEffect(() => {
    if (staticArticle || !slug) return;
    setLoading(true);
    fetchDbArticleBySlug(slug)
      .then((a) => setArticle(a))
      .finally(() => setLoading(false));
  }, [slug, staticArticle]);

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <main className="container mx-auto px-4 py-24 text-center">
          <p className="text-muted-foreground">Chargement de l'article…</p>
        </main>
        <Footer />
      </div>
    );
  }

  
  if (!article) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <main className="container mx-auto px-4 py-24 text-center">
          <h1 className="text-4xl font-bold mb-4">Article non trouvé</h1>
          <p className="text-muted-foreground mb-8">
            L'article que vous cherchez n'existe pas ou a été déplacé.
          </p>
          <Button asChild>
            <Link to="/blog">Retour au blog</Link>
          </Button>
        </main>
        <Footer />
      </div>
    );
  }

  const category = blogCategories[article.category];
  
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('fr-FR', {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
    });
  };

  const handleShare = async () => {
    const url = window.location.href;
    if (navigator.share) {
      try {
        await navigator.share({
          title: article.title,
          text: article.excerpt,
          url,
        });
      } catch {
        // User cancelled
      }
    } else {
      await navigator.clipboard.writeText(url);
      toast.success('Lien copié dans le presse-papier');
    }
  };

  // Schema JSON-LD pour l'article
  const articleSchema = {
    "@context": "https://schema.org",
    "@type": "Article",
    "headline": article.title,
    "description": article.excerpt,
    "image": `https://amzingfba.com${article.image}`,
    "datePublished": article.publishedAt,
    "dateModified": article.updatedAt,
    "author": {
      "@type": "Organization",
      "name": "AMZing FBA",
      "url": "https://amzingfba.com"
    },
    "publisher": {
      "@type": "Organization",
      "name": "AMZing FBA",
      "logo": {
        "@type": "ImageObject",
        "url": "https://amzingfba.com/logo-amzing.png"
      }
    },
    "mainEntityOfPage": {
      "@type": "WebPage",
      "@id": `https://amzingfba.com/blog/${article.slug}`
    },
    "keywords": article.keywords.join(', ')
  };

  // Breadcrumb schema
  const breadcrumbSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    "itemListElement": [
      {
        "@type": "ListItem",
        "position": 1,
        "name": "Accueil",
        "item": "https://amzingfba.com"
      },
      {
        "@type": "ListItem",
        "position": 2,
        "name": "Blog",
        "item": "https://amzingfba.com/blog"
      },
      {
        "@type": "ListItem",
        "position": 3,
        "name": category.name,
        "item": `https://amzingfba.com/blog?categorie=${category.slug}`
      },
      {
        "@type": "ListItem",
        "position": 4,
        "name": article.title,
        "item": `https://amzingfba.com/blog/${article.slug}`
      }
    ]
  };

  // FAQPage schema (si l'article a une FAQ)
  const faqSchema = article.faqs.length > 0 ? {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "mainEntity": article.faqs.map(f => ({
      "@type": "Question",
      "name": f.question,
      "acceptedAnswer": { "@type": "Answer", "text": f.answer }
    }))
  } : null;

  return (
    <div className="min-h-screen bg-background">
      <SEO
        title={article.metaTitle}
        description={article.metaDescription}
        keywords={article.keywords.join(', ')}
        image={`https://amzingfba.com${article.image}`}
        type="article"
        schema={articleSchema}
      />
      
      {/* Breadcrumb Schema */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />
      {faqSchema && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
        />
      )}
      
      
      <Navbar />
      
      <main>
        {/* Breadcrumb */}
        <nav className="border-b border-border bg-muted/30">
          <div className="container mx-auto px-4 py-3">
            <ol className="flex items-center gap-2 text-sm text-muted-foreground overflow-x-auto">
              <li>
                <Link to="/" className="hover:text-primary transition-colors">
                  Accueil
                </Link>
              </li>
              <ChevronRight className="w-4 h-4 shrink-0" />
              <li>
                <Link to="/blog" className="hover:text-primary transition-colors">
                  Blog
                </Link>
              </li>
              <ChevronRight className="w-4 h-4 shrink-0" />
              <li>
                <Link 
                  to={`/blog?categorie=${category.slug}`} 
                  className="hover:text-primary transition-colors"
                >
                  {category.name}
                </Link>
              </li>
              <ChevronRight className="w-4 h-4 shrink-0" />
              <li className="text-foreground font-medium truncate max-w-[200px]">
                {article.title}
              </li>
            </ol>
          </div>
        </nav>

        {/* Hero */}
        <header className="relative py-14 md:py-20 overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-primary/8 via-background to-secondary/5" />
          <div className="absolute top-0 right-0 w-96 h-96 bg-primary/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/3 pointer-events-none" />
          
          <div className="container mx-auto px-4 relative">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => navigate(-1)}
              className="mb-8 hover:bg-primary/10"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Retour
            </Button>

            <div className="max-w-4xl">
              {/* Badge formation certifiante */}
              <div className="flex flex-wrap items-center gap-3 mb-5">
                <Badge variant="outline" className="font-medium">{category.name}</Badge>
                {article.type === 'pilier' && (
                  <Badge className="bg-primary text-primary-foreground font-bold">
                    <Award className="w-3 h-3 mr-1" />
                    Guide Complet
                  </Badge>
                )}
                <div className="hidden sm:flex items-center gap-1.5 text-xs text-muted-foreground bg-muted/50 px-2.5 py-1 rounded-full">
                  <Star className="w-3 h-3 fill-primary text-primary" />
                  <span className="font-semibold text-foreground">4.9</span>
                  <span>· 127 avis</span>
                </div>
              </div>

              <h1 className="text-3xl md:text-4xl lg:text-5xl font-extrabold mb-6 leading-tight tracking-tight">
                {article.title}
              </h1>

              <p className="text-xl md:text-2xl text-muted-foreground mb-8 leading-relaxed max-w-3xl">
                {article.excerpt}
              </p>

              <div className="flex flex-wrap items-center gap-4 md:gap-8 text-sm">
                <div className="flex items-center gap-3 bg-muted/40 rounded-full px-4 py-2">
                  <div className="w-9 h-9 rounded-full bg-gradient-to-br from-primary/20 to-primary/10 flex items-center justify-center">
                    <User className="w-4 h-4 text-primary" />
                  </div>
                  <div>
                    <p className="font-semibold text-foreground text-sm">{article.author}</p>
                    <p className="text-xs text-muted-foreground">Expert Amazon FBA</p>
                  </div>
                </div>
                
                <div className="flex items-center gap-6 text-muted-foreground">
                  <span className="flex items-center gap-1.5">
                    <Calendar className="w-4 h-4" />
                    {formatDate(article.publishedAt)}
                  </span>
                  <span className="flex items-center gap-1.5">
                    <BookOpen className="w-4 h-4" />
                    {article.readTime} min
                  </span>
                </div>

                <Button variant="ghost" size="sm" onClick={handleShare} className="rounded-full hover:bg-muted/50">
                  <Share2 className="w-4 h-4 mr-2" />
                  Partager
                </Button>
              </div>
            </div>
          </div>
        </header>

        {/* Image hero */}
        <div className="container mx-auto px-4 -mt-4 mb-12">
          <div className="max-w-4xl">
            <div className="relative aspect-video rounded-xl overflow-hidden shadow-xl">
              <img
                src={article.image}
                alt={article.title}
                className="w-full h-full object-cover"
              />
              {/* Overlay sombre pour meilleure lisibilité */}
              <div className="absolute inset-0 bg-gradient-to-t from-background via-background/30 to-transparent" />
              {/* Badge catégorie sur l'image */}
              <div className="absolute bottom-4 left-4 right-4">
                <div className="flex items-center gap-2">
                  <Badge className="bg-primary/90 text-primary-foreground shadow-lg backdrop-blur-sm">
                    {category.name}
                  </Badge>
                  <span className="text-white/90 text-sm font-medium drop-shadow-lg">
                    {article.readTime} min de lecture
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Contenu principal */}
        <div className="container mx-auto px-4 pb-16">
          <div className="grid lg:grid-cols-[minmax(0,1fr)_320px] gap-12">
            {/* Article */}
            <div className="min-w-0 max-w-none overflow-hidden">
              <BlogArticleContent article={article} />

              {/* Bloc de conversion principal */}
              <BlogConversionCTA />

              {/* FAQ */}
              {article.faqs.length > 0 && (
                <BlogFAQ faqs={article.faqs} articleTitle={article.title} />
              )}

              {/* Second CTA après FAQ pour rattraper les lecteurs longs */}
              {article.faqs.length > 0 && <BlogConversionCTA />}

              {/* Tags */}
              <div className="mt-12 pt-8 border-t border-border">
                <p className="text-sm text-muted-foreground mb-3">Mots-clés :</p>
                <div className="flex flex-wrap gap-2">
                  {article.keywords.map(keyword => (
                    <Badge key={keyword} variant="secondary" className="text-xs">
                      {keyword}
                    </Badge>
                  ))}
                </div>
              </div>
            </div>

            {/* Sidebar */}
            <div className="hidden lg:block">
              <div className="sticky top-24">
                <BlogSidebar currentArticle={article} />
              </div>
            </div>
          </div>
        </div>
      </main>

      <Footer />
      <BlogStickyMobileCTA />
    </div>
  );
};

export default BlogPost;
