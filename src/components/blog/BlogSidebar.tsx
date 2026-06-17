import { Link } from 'react-router-dom';
import { ArrowRight, BookOpen, CheckCircle2, Sparkles, Star, TrendingUp, Zap } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { BlogArticle, getRelatedArticles, getPilierArticles, blogCategories } from '@/lib/blog-data';

interface BlogSidebarProps {
  currentArticle: BlogArticle;
}

const BlogSidebar = ({ currentArticle }: BlogSidebarProps) => {
  const relatedArticles = getRelatedArticles(currentArticle);
  const pilierArticles = getPilierArticles().filter(a => a.slug !== currentArticle.slug).slice(0, 3);
  const category = blogCategories[currentArticle.category];

  return (
    <aside className="space-y-6">
      {/* CTA Box — version conversion forte */}
      <Card className="relative overflow-hidden border-2 border-primary/40 shadow-xl bg-gradient-to-br from-primary/15 via-primary/5 to-background">
        <div className="absolute -top-10 -right-10 w-32 h-32 bg-primary/20 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-10 -left-10 w-32 h-32 bg-primary/10 rounded-full blur-3xl pointer-events-none" />
        <CardContent className="p-6 relative">
          <Badge className="mb-3 bg-primary text-primary-foreground border-0 shadow-md">
            <Sparkles className="w-3 h-3 mr-1" />
            Offre limitée
          </Badge>
          <div className="flex items-center gap-2 mb-2">
            <TrendingUp className="w-5 h-5 text-primary" />
            <span className="font-bold text-primary text-sm uppercase tracking-wide">AMZing FBA</span>
          </div>
          <h3 className="font-extrabold text-xl mb-3 leading-tight">
            Trouvez vos prochains produits gagnants en 2 clics
          </h3>
          <ul className="space-y-2 mb-4">
            {[
              'Alertes produits rentables quotidiennes',
              'Formation Amazon FBA complète',
              'Communauté privée + suivi 1:1',
            ].map((b) => (
              <li key={b} className="flex items-start gap-2 text-sm">
                <CheckCircle2 className="w-4 h-4 text-primary shrink-0 mt-0.5" />
                <span>{b}</span>
              </li>
            ))}
          </ul>
          <div className="flex items-center gap-1 mb-3">
            {[1, 2, 3, 4, 5].map((i) => (
              <Star key={i} className="w-4 h-4 fill-primary text-primary" />
            ))}
            <span className="text-xs text-muted-foreground ml-1">+500 membres actifs</span>
          </div>
          <Button asChild size="lg" className="w-full font-bold shadow-lg" variant="hero">
            <Link to="/auth?tab=signup">
              <Zap className="w-4 h-4 mr-2" />
              Démarrer maintenant
              <ArrowRight className="w-4 h-4 ml-2" />
            </Link>
          </Button>
          <p className="text-[11px] text-center text-muted-foreground mt-2">
            Sans engagement · Accès immédiat
          </p>
        </CardContent>
      </Card>

      {/* Articles liés */}
      {relatedArticles.length > 0 && (
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-lg flex items-center gap-2">
              <BookOpen className="w-4 h-4" />
              Articles connexes
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {relatedArticles.map(article => (
              <Link
                key={article.slug}
                to={`/blog/${article.slug}`}
                className="block group"
              >
                <div className="flex gap-3 p-2 -mx-2 rounded-lg hover:bg-muted/50 transition-colors">
                  <img
                    src={article.image}
                    alt={article.title}
                    className="w-16 h-16 object-cover rounded shrink-0"
                  />
                  <div className="min-w-0">
                    <h4 className="font-medium text-sm line-clamp-2 group-hover:text-primary transition-colors">
                      {article.title}
                    </h4>
                    <span className="text-xs text-muted-foreground">
                      {article.readTime} min
                    </span>
                  </div>
                </div>
              </Link>
            ))}
          </CardContent>
        </Card>
      )}

      {/* Catégorie actuelle */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-lg">Dans cette catégorie</CardTitle>
        </CardHeader>
        <CardContent>
          <Link to={`/blog?categorie=${category.slug}`}>
            <Badge variant="outline" className="hover:bg-primary/10 transition-colors cursor-pointer">
              {category.name}
            </Badge>
          </Link>
          <p className="text-sm text-muted-foreground mt-2">
            {category.description}
          </p>
        </CardContent>
      </Card>

      {/* Guides principaux */}
      {pilierArticles.length > 0 && (
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-lg">Guides Complets</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            {pilierArticles.map(article => (
              <Link
                key={article.slug}
                to={`/blog/${article.slug}`}
                className="flex items-center gap-2 p-2 -mx-2 rounded-lg hover:bg-muted/50 transition-colors group"
              >
                <Badge className="shrink-0 bg-primary/10 text-primary border-0 text-xs">
                  Pilier
                </Badge>
                <span className="text-sm line-clamp-1 group-hover:text-primary transition-colors">
                  {article.title}
                </span>
              </Link>
            ))}
          </CardContent>
        </Card>
      )}
    </aside>
  );
};

export default BlogSidebar;
