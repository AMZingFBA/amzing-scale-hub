import { Link } from 'react-router-dom';
import { ArrowRight, BookOpen, TrendingUp } from 'lucide-react';
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
      {/* CTA Box */}
      <Card className="bg-gradient-to-br from-primary/10 via-primary/5 to-background border-primary/20">
        <CardContent className="p-6">
          <div className="flex items-center gap-2 mb-3">
            <TrendingUp className="w-5 h-5 text-primary" />
            <span className="font-bold text-primary">Produits Rentables</span>
          </div>
          <h3 className="font-bold text-lg mb-2">
            Recevez des alertes produits quotidiennes
          </h3>
          <p className="text-sm text-muted-foreground mb-4">
            Nos algorithmes détectent les meilleures opportunités Amazon FBA chaque jour.
          </p>
          <Button asChild className="w-full" variant="hero">
            <Link to="/tarifs">
              Découvrir AMZing FBA
              <ArrowRight className="w-4 h-4 ml-2" />
            </Link>
          </Button>
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
