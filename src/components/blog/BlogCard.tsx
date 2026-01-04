import { Link } from 'react-router-dom';
import { Clock, ArrowRight, Calendar } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { BlogArticle, blogCategories } from '@/lib/blog-data';

interface BlogCardProps {
  article: BlogArticle;
  featured?: boolean;
}

const BlogCard = ({ article, featured = false }: BlogCardProps) => {
  const category = blogCategories[article.category];
  
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('fr-FR', {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
    });
  };

  if (featured) {
    return (
      <Link to={`/blog/${article.slug}`} className="block group">
        <Card className="overflow-hidden border-2 border-primary/20 hover:border-primary/50 transition-all duration-300 bg-gradient-to-br from-card to-primary/5">
          <div className="grid md:grid-cols-2 gap-0">
            <div className="relative h-64 md:h-auto overflow-hidden">
              <img
                src={article.image}
                alt={article.title}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-background/80 via-transparent to-transparent" />
              <Badge className="absolute top-4 left-4 bg-primary text-primary-foreground">
                Article Pilier
              </Badge>
            </div>
            <CardContent className="p-6 md:p-8 flex flex-col justify-center">
              <Badge variant="outline" className="w-fit mb-3 text-xs">
                {category.name}
              </Badge>
              <h2 className="text-2xl md:text-3xl font-bold mb-4 group-hover:text-primary transition-colors line-clamp-2">
                {article.title}
              </h2>
              <p className="text-muted-foreground mb-6 line-clamp-3">
                {article.excerpt}
              </p>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4 text-sm text-muted-foreground">
                  <span className="flex items-center gap-1">
                    <Calendar className="w-4 h-4" />
                    {formatDate(article.publishedAt)}
                  </span>
                  <span className="flex items-center gap-1">
                    <Clock className="w-4 h-4" />
                    {article.readTime} min
                  </span>
                </div>
                <span className="flex items-center gap-2 text-primary font-medium group-hover:gap-3 transition-all">
                  Lire <ArrowRight className="w-4 h-4" />
                </span>
              </div>
            </CardContent>
          </div>
        </Card>
      </Link>
    );
  }

  return (
    <Link to={`/blog/${article.slug}`} className="block group">
      <Card className="overflow-hidden h-full hover:shadow-lg hover:border-primary/30 transition-all duration-300">
        <div className="relative h-48 overflow-hidden">
          <img
            src={article.image}
            alt={article.title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-background/60 via-transparent to-transparent" />
          {article.type === 'pilier' && (
            <Badge className="absolute top-3 left-3 bg-primary/90 text-primary-foreground text-xs">
              Guide Complet
            </Badge>
          )}
        </div>
        <CardContent className="p-5">
          <Badge variant="outline" className="mb-3 text-xs">
            {category.name}
          </Badge>
          <h3 className="font-bold text-lg mb-2 group-hover:text-primary transition-colors line-clamp-2">
            {article.title}
          </h3>
          <p className="text-muted-foreground text-sm mb-4 line-clamp-2">
            {article.excerpt}
          </p>
          <div className="flex items-center justify-between text-xs text-muted-foreground">
            <span className="flex items-center gap-1">
              <Clock className="w-3 h-3" />
              {article.readTime} min de lecture
            </span>
            <span className="flex items-center gap-1 text-primary font-medium group-hover:gap-2 transition-all">
              Lire <ArrowRight className="w-3 h-3" />
            </span>
          </div>
        </CardContent>
      </Card>
    </Link>
  );
};

export default BlogCard;
