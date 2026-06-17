import { Link } from 'react-router-dom';
import { ArrowRight, CheckCircle2, Sparkles, Star, Zap } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

/**
 * Gros bloc de conversion à placer en fin d'article de blog.
 * Pensé pour maximiser le clic après lecture.
 */
const BlogConversionCTA = () => {
  return (
    <section className="my-12 not-prose">
      <div className="relative overflow-hidden rounded-2xl border-2 border-primary/40 bg-gradient-to-br from-primary/15 via-background to-primary/5 p-6 md:p-10 shadow-2xl">
        <div className="absolute -top-20 -right-20 w-72 h-72 bg-primary/25 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-20 -left-20 w-72 h-72 bg-primary/15 rounded-full blur-3xl pointer-events-none" />

        <div className="relative grid md:grid-cols-[1fr_auto] gap-8 items-center">
          <div>
            <Badge className="mb-3 bg-primary text-primary-foreground border-0 shadow-md">
              <Sparkles className="w-3 h-3 mr-1" />
              Passez à l'action
            </Badge>
            <h2 className="text-2xl md:text-3xl font-extrabold mb-3 leading-tight">
              Prêt à lancer (ou décoller) sur Amazon FBA ?
            </h2>
            <p className="text-base md:text-lg text-muted-foreground mb-5">
              Rejoignez <strong className="text-foreground">+500 vendeurs</strong> qui utilisent
              AMZing FBA pour trouver des produits rentables, se former et scaler leur business
              Amazon — sans perdre des semaines à chercher seul.
            </p>

            <ul className="grid sm:grid-cols-2 gap-2 mb-6">
              {[
                'Alertes produits rentables quotidiennes',
                'Formation Amazon FBA complète',
                'Catalogues grossistes exclusifs',
                'Communauté + accompagnement',
              ].map((b) => (
                <li key={b} className="flex items-start gap-2 text-sm">
                  <CheckCircle2 className="w-4 h-4 text-primary shrink-0 mt-0.5" />
                  <span>{b}</span>
                </li>
              ))}
            </ul>

            <div className="flex flex-col sm:flex-row gap-3 sm:items-center">
              <Button asChild size="lg" variant="hero" className="font-bold shadow-lg">
                <Link to="/auth?tab=signup">
                  <Zap className="w-5 h-5 mr-2" />
                  Démarrer maintenant
                  <ArrowRight className="w-5 h-5 ml-2" />
                </Link>
              </Button>
              <Button asChild size="lg" variant="outline" className="font-semibold">
                <Link to="/tarifs">Voir les tarifs</Link>
              </Button>
            </div>

            <div className="flex items-center gap-2 mt-4">
              {[1, 2, 3, 4, 5].map((i) => (
                <Star key={i} className="w-4 h-4 fill-primary text-primary" />
              ))}
              <span className="text-xs text-muted-foreground">
                Noté 4.9/5 par nos membres · Sans engagement
              </span>
            </div>
          </div>

          <div className="hidden md:flex flex-col items-center justify-center text-center bg-primary/10 rounded-xl p-6 border border-primary/30 min-w-[180px]">
            <div className="text-4xl font-extrabold text-primary">+500</div>
            <div className="text-xs text-muted-foreground mt-1 uppercase tracking-wide">
              Vendeurs actifs
            </div>
            <div className="w-full border-t border-primary/20 my-4" />
            <div className="text-4xl font-extrabold text-primary">4.9★</div>
            <div className="text-xs text-muted-foreground mt-1 uppercase tracking-wide">
              Satisfaction
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default BlogConversionCTA;
