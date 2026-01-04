import { useParams, Link, useNavigate } from 'react-router-dom';
import { ArrowLeft, Clock, Calendar, Share2, ChevronRight, User } from 'lucide-react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import SEO from '@/components/SEO';
import BlogFAQ from '@/components/blog/BlogFAQ';
import BlogSidebar from '@/components/blog/BlogSidebar';
import BlogArticleContent from '@/components/blog/BlogArticleContent';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { getArticleBySlug, blogCategories } from '@/lib/blog-data';
import { toast } from 'sonner';

const BlogPost = () => {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();
  
  const article = slug ? getArticleBySlug(slug) : undefined;
  
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
        <header className="relative py-12 md:py-16">
          <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-background to-secondary/5" />
          <div className="container mx-auto px-4 relative">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => navigate(-1)}
              className="mb-6"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Retour
            </Button>

            <div className="max-w-4xl">
              <div className="flex flex-wrap items-center gap-3 mb-4">
                <Badge variant="outline">{category.name}</Badge>
                {article.type === 'pilier' && (
                  <Badge className="bg-primary text-primary-foreground">
                    Guide Complet
                  </Badge>
                )}
              </div>

              <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-6 leading-tight">
                {article.title}
              </h1>

              <p className="text-xl text-muted-foreground mb-6">
                {article.excerpt}
              </p>

              <div className="flex flex-wrap items-center gap-6 text-sm text-muted-foreground">
                <div className="flex items-center gap-2">
                  <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                    <User className="w-5 h-5 text-primary" />
                  </div>
                  <div>
                    <p className="font-medium text-foreground">{article.author}</p>
                    <p className="text-xs">Expert Amazon FBA</p>
                  </div>
                </div>
                <span className="flex items-center gap-1">
                  <Calendar className="w-4 h-4" />
                  {formatDate(article.publishedAt)}
                </span>
                <span className="flex items-center gap-1">
                  <Clock className="w-4 h-4" />
                  {article.readTime} min de lecture
                </span>
                <Button variant="ghost" size="sm" onClick={handleShare}>
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
              <div className="absolute inset-0 bg-gradient-to-t from-background/40 to-transparent" />
            </div>
          </div>
        </div>

        {/* Contenu principal */}
        <div className="container mx-auto px-4 pb-16">
          <div className="grid lg:grid-cols-[1fr_320px] gap-12">
            {/* Article */}
            <div className="max-w-none">
              <BlogArticleContent article={article} />
              
              {/* FAQ */}
              {article.faqs.length > 0 && (
                <BlogFAQ faqs={article.faqs} articleTitle={article.title} />
              )}

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
    </div>
  );
};

export default BlogPost;
