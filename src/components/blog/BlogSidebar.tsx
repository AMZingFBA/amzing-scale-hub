import { Link } from 'react-router-dom';
import { ArrowRight, BookOpen, CheckCircle2, Star, Shield, Users, Zap, PlayCircle, Award } from 'lucide-react';
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
      {/* ─── CTA FORMATION PREMIUM ─── */}
      <div className="relative overflow-hidden rounded-2xl border border-border/60 bg-card shadow-2xl">
        {/* Bandeau premium en haut */}
        <div className="relative bg-gradient-to-r from-foreground via-foreground to-muted-foreground px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Award className="w-5 h-5 text-primary" />
              <span className="text-sm font-bold text-primary-foreground tracking-wide uppercase">
                Formation Certifiante
              </span>
            </div>
            <Badge className="bg-primary text-primary-foreground border-0 text-xs font-bold shadow-lg">
              700€
            </Badge>
          </div>
        </div>

        <div className="p-6 space-y-5">
          {/* Titre + preuve */}
          <div>
            <h3 className="text-xl font-extrabold leading-tight mb-2">
              Devenir Vendeur Amazon FBA
              <span className="block text-primary mt-1">En 30 Jours</span>
            </h3>
            <p className="text-sm text-muted-foreground leading-relaxed">
              La méthode complète pour créer un business Amazon rentable, 
              même en partant de zéro.
            </p>
          </div>

          {/* Preuve sociale chiffrée */}
          <div className="flex items-center gap-3 bg-muted/50 rounded-xl p-3">
            <div className="flex -space-x-2">
              {[1,2,3,4].map(i => (
                <div key={i} className="w-8 h-8 rounded-full bg-gradient-to-br from-primary/80 to-primary/40 border-2 border-background flex items-center justify-center text-[10px] font-bold text-primary-foreground">
                  {String.fromCharCode(64+i)}
                </div>
              ))}
            </div>
            <div className="text-xs">
              <span className="font-bold text-foreground">+500</span>
              <span className="text-muted-foreground"> membres formés</span>
            </div>
          </div>

          {/* Liste des inclusions */}
          <ul className="space-y-2.5">
            {[
              { icon: PlayCircle, text: '40+ heures de vidéo HD' },
              { icon: Users, text: 'Accès communauté privée Discord' },
              { icon: Zap, text: 'Alertes produits rentables' },
              { icon: Shield, text: 'Garantie 30 jours satisfait/remboursé' },
              { icon: CheckCircle2, text: 'Mises à jour à vie incluses' },
            ].map(({ icon: Icon, text }) => (
              <li key={text} className="flex items-center gap-2.5 text-sm">
                <Icon className="w-4 h-4 text-primary shrink-0" />
                <span>{text}</span>
              </li>
            ))}
          </ul>

          {/* Note / avis */}
          <div className="flex items-center gap-2 bg-primary/5 rounded-lg px-3 py-2">
            <div className="flex">
              {[1,2,3,4,5].map(i => (
                <Star key={i} className="w-3.5 h-3.5 fill-primary text-primary" />
              ))}
            </div>
            <span className="text-xs font-semibold">4.9/5</span>
            <span className="text-xs text-muted-foreground">· Basé sur 127 avis vérifiés</span>
          </div>

          {/* CTA Principal */}
          <Button asChild size="lg" className="w-full font-bold text-base shadow-lg hover:shadow-xl transition-shadow">
            <Link to="/auth?tab=signup">
              <Zap className="w-4 h-4 mr-2" />
              Rejoindre la Formation
              <ArrowRight className="w-4 h-4 ml-2" />
            </Link>
          </Button>

          <p className="text-[11px] text-center text-muted-foreground">
            Paiement sécurisé · Accès immédiat · Support 7j/7
          </p>
        </div>
      </div>

      {/* ─── ARTICLES LIÉS ─── */}
      {relatedArticles.length > 0 && (
        <Card className="border-border/60 shadow-sm">
          <CardHeader className="pb-3">
            <CardTitle className="text-base flex items-center gap-2">
              <BookOpen className="w-4 h-4 text-primary" />
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
                    className="w-16 h-16 object-cover rounded-lg shrink-0"
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

      {/* ─── CATÉGORIE ─── */}
      <Card className="border-border/60 shadow-sm">
        <CardHeader className="pb-3">
          <CardTitle className="text-base">Dans cette catégorie</CardTitle>
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

      {/* ─── GUIDES COMPLETS ─── */}
      {pilierArticles.length > 0 && (
        <Card className="border-border/60 shadow-sm">
          <CardHeader className="pb-3">
            <CardTitle className="text-base">Guides Complets</CardTitle>
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
