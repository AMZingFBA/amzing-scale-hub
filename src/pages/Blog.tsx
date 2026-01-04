import { useState, useMemo } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { Search, Filter, BookOpen, TrendingUp, ArrowRight, ArrowLeft } from 'lucide-react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import SEO from '@/components/SEO';
import BlogCard from '@/components/blog/BlogCard';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { blogArticles, blogCategories, getPilierArticles } from '@/lib/blog-data';

const Blog = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [searchQuery, setSearchQuery] = useState('');
  
  const selectedCategory = searchParams.get('categorie') || 'all';

  const filteredArticles = useMemo(() => {
    let articles = [...blogArticles];
    
    // Filtre par catégorie
    if (selectedCategory !== 'all') {
      articles = articles.filter(a => a.category === selectedCategory);
    }
    
    // Filtre par recherche
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      articles = articles.filter(a => 
        a.title.toLowerCase().includes(query) ||
        a.excerpt.toLowerCase().includes(query) ||
        a.keywords.some(k => k.toLowerCase().includes(query))
      );
    }
    
    // Trier : piliers d'abord, puis par date
    return articles.sort((a, b) => {
      if (a.type === 'pilier' && b.type !== 'pilier') return -1;
      if (a.type !== 'pilier' && b.type === 'pilier') return 1;
      return new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime();
    });
  }, [selectedCategory, searchQuery]);

  const pilierArticles = getPilierArticles();
  const featuredArticle = pilierArticles[0];

  const handleCategoryChange = (category: string) => {
    if (category === 'all') {
      searchParams.delete('categorie');
    } else {
      searchParams.set('categorie', category);
    }
    setSearchParams(searchParams);
  };

  // Schema JSON-LD pour le blog
  const blogSchema = {
    "@context": "https://schema.org",
    "@type": "Blog",
    "name": "Blog AMZing FBA - Guides Amazon FBA",
    "description": "Guides complets, tutoriels et conseils pour réussir sur Amazon FBA. Sourcing, logistique, optimisation et stratégies de vente.",
    "url": "https://amzingfba.com/blog",
    "publisher": {
      "@type": "Organization",
      "name": "AMZing FBA",
      "logo": {
        "@type": "ImageObject",
        "url": "https://amzingfba.com/logo-amzing.png"
      }
    },
    "blogPost": blogArticles.slice(0, 10).map(article => ({
      "@type": "BlogPosting",
      "headline": article.title,
      "description": article.excerpt,
      "url": `https://amzingfba.com/blog/${article.slug}`,
      "datePublished": article.publishedAt,
      "dateModified": article.updatedAt,
      "author": {
        "@type": "Organization",
        "name": "AMZing FBA"
      }
    }))
  };

  return (
    <div className="min-h-screen bg-background">
      <SEO
        title="Blog Amazon FBA - Guides, Conseils et Stratégies | AMZing FBA"
        description="Découvrez nos guides complets sur Amazon FBA : sourcing de produits rentables, logistique, optimisation des ventes. Conseils d'experts pour réussir."
        keywords="blog amazon fba, guide fba, conseils amazon, tutoriel fba, formation amazon"
        schema={blogSchema}
      />
      
      <Navbar />
      
      <main className="pt-20">
        {/* Back Arrow */}
        <div className="container mx-auto px-4 pt-6">
          <Link 
            to="/" 
            className="inline-flex items-center justify-center w-10 h-10 rounded-full bg-muted/50 hover:bg-primary/10 text-muted-foreground hover:text-primary transition-all"
          >
            <ArrowLeft className="w-5 h-5" />
          </Link>
        </div>

        {/* Hero Section */}
        <section className="relative py-16 md:py-24 overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-background to-secondary/5" />
          <div className="container mx-auto px-4 relative">
            <div className="max-w-3xl mx-auto text-center">
              <Badge className="mb-4 bg-primary/10 text-primary border-0">
                <BookOpen className="w-3 h-3 mr-1" />
                Blog & Ressources
              </Badge>
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6">
                Tout savoir sur{' '}
                <span className="text-primary">Amazon FBA</span>
              </h1>
              <p className="text-xl text-muted-foreground mb-8">
                Guides complets, tutoriels pratiques et stratégies éprouvées pour 
                lancer et développer votre business Amazon FBA.
              </p>
              
              {/* Barre de recherche */}
              <div className="relative max-w-xl mx-auto">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                <Input
                  type="search"
                  placeholder="Rechercher un article..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-12 pr-4 py-6 text-lg rounded-full border-2 focus:border-primary"
                />
              </div>
            </div>
          </div>
        </section>

        {/* Filtres par catégorie */}
        <section className="border-y border-border bg-muted/30">
          <div className="container mx-auto px-4">
            <div className="flex items-center gap-2 py-4 overflow-x-auto scrollbar-hide">
              <Filter className="w-4 h-4 text-muted-foreground shrink-0" />
              <Button
                variant={selectedCategory === 'all' ? 'default' : 'ghost'}
                size="sm"
                onClick={() => handleCategoryChange('all')}
                className="shrink-0"
              >
                Tous
              </Button>
              {Object.entries(blogCategories).map(([key, category]) => (
                <Button
                  key={key}
                  variant={selectedCategory === key ? 'default' : 'ghost'}
                  size="sm"
                  onClick={() => handleCategoryChange(key)}
                  className="shrink-0"
                >
                  {category.name}
                </Button>
              ))}
            </div>
          </div>
        </section>

        {/* Article mis en avant */}
        {selectedCategory === 'all' && !searchQuery && featuredArticle && (
          <section className="py-12">
            <div className="container mx-auto px-4">
              <div className="flex items-center gap-2 mb-6">
                <TrendingUp className="w-5 h-5 text-primary" />
                <h2 className="text-xl font-bold">Article à la une</h2>
              </div>
              <BlogCard article={featuredArticle} featured />
            </div>
          </section>
        )}

        {/* Liste des articles */}
        <section className="py-12">
          <div className="container mx-auto px-4">
            {filteredArticles.length > 0 ? (
              <>
                <div className="flex items-center justify-between mb-8">
                  <h2 className="text-2xl font-bold">
                    {selectedCategory === 'all' 
                      ? 'Tous les articles' 
                      : blogCategories[selectedCategory as keyof typeof blogCategories]?.name}
                  </h2>
                  <span className="text-muted-foreground">
                    {filteredArticles.length} article{filteredArticles.length > 1 ? 's' : ''}
                  </span>
                </div>
                
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {filteredArticles
                    .filter(a => selectedCategory !== 'all' || searchQuery || a.slug !== featuredArticle?.slug)
                    .map(article => (
                      <BlogCard key={article.slug} article={article} />
                    ))}
                </div>
              </>
            ) : (
              <div className="text-center py-16">
                <p className="text-xl text-muted-foreground mb-4">
                  Aucun article trouvé pour "{searchQuery}"
                </p>
                <Button variant="outline" onClick={() => setSearchQuery('')}>
                  Réinitialiser la recherche
                </Button>
              </div>
            )}
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-16 bg-gradient-to-r from-primary/10 via-primary/5 to-secondary/10">
          <div className="container mx-auto px-4 text-center">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Prêt à passer à l'action ?
            </h2>
            <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
              Rejoignez des centaines de vendeurs Amazon qui utilisent nos outils 
              pour trouver des produits rentables chaque jour.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button asChild size="lg" variant="hero">
                <Link to="/tarifs">
                  Découvrir nos outils
                  <ArrowRight className="w-5 h-5 ml-2" />
                </Link>
              </Button>
              <Button asChild size="lg" variant="outline">
                <Link to="/formation">
                  Voir la formation
                </Link>
              </Button>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
};

export default Blog;
