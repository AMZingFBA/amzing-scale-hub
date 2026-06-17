import { Link } from 'react-router-dom';
import { ArrowRight, CheckCircle2, Shield, Sparkles, Star, Zap, PlayCircle, Users, Award, Lock } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

/**
 * Gros bloc de conversion à placer en fin d'article de blog.
 * Design premium "masterclass" pour justifier 700€.
 */
const BlogConversionCTA = () => {
  return (
    <section className="my-16 not-prose">
      <div className="relative overflow-hidden rounded-2xl border border-border/60 bg-card shadow-2xl">
        {/* En-tête bandeau premium */}
        <div className="relative bg-gradient-to-r from-foreground via-foreground/95 to-muted-foreground px-6 py-5 md:px-10 md:py-6">
          <div className="flex items-center gap-3 mb-2">
            <Award className="w-5 h-5 text-primary" />
            <span className="text-sm font-bold text-primary tracking-wider uppercase">
              Formation Certifiante
            </span>
          </div>
          <h2 className="text-2xl md:text-3xl font-extrabold text-primary-foreground leading-tight">
            Devenir Vendeur Amazon FBA
            <span className="block text-primary mt-1">En 30 Jours — Méthode Prouvée</span>
          </h2>
        </div>

        <div className="p-6 md:p-10 relative">
          {/* Glow décoratif */}
          <div className="absolute -top-20 -right-20 w-72 h-72 bg-primary/10 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute -bottom-20 -left-20 w-72 h-72 bg-primary/5 rounded-full blur-3xl pointer-events-none" />

          <div className="relative grid md:grid-cols-[1fr_auto] gap-8 items-start">
            <div className="space-y-6">
              {/* Pitch principal */}
              <div className="space-y-3">
                <Badge className="bg-primary/10 text-primary border-0 shadow-none font-semibold">
                  <Sparkles className="w-3 h-3 mr-1" />
                  Passez à l'action
                </Badge>
                <p className="text-base md:text-lg text-muted-foreground leading-relaxed">
                  Rejoignez <strong className="text-foreground">+500 vendeurs</strong> qui utilisent
                  AMZing FBA pour trouver des produits rentables, se former et scaler leur business
                  Amazon — <strong className="text-foreground">sans perdre des semaines à chercher seul.</strong>
                </p>
              </div>

              {/* Grille 2x2 de bénéfices */}
              <div className="grid sm:grid-cols-2 gap-3">
                {[
                  { icon: PlayCircle, text: '40+ heures de vidéo HD', sub: 'Formation complète pas à pas' },
                  { icon: Zap, text: 'Alertes produits quotidiennes', sub: 'Produits rentables livrés chaque jour' },
                  { icon: Users, text: 'Communauté privée Discord', sub: 'Échange avec +500 vendeurs' },
                  { icon: Shield, text: 'Garantie 30 jours', sub: 'Satisfait ou remboursé intégralement' },
                ].map(({ icon: Icon, text, sub }) => (
                  <div key={text} className="flex items-start gap-3 p-3 rounded-xl bg-muted/40 border border-border/50">
                    <Icon className="w-5 h-5 text-primary shrink-0 mt-0.5" />
                    <div>
                      <div className="font-semibold text-sm">{text}</div>
                      <div className="text-xs text-muted-foreground">{sub}</div>
                    </div>
                  </div>
                ))}
              </div>

              {/* CTA + prix */}
              <div className="flex flex-col sm:flex-row gap-3 sm:items-center">
                <Button asChild size="lg" className="font-bold text-base shadow-lg hover:shadow-xl transition-shadow px-8">
                  <Link to="/auth?tab=signup">
                    <Zap className="w-5 h-5 mr-2" />
                    Rejoindre la Formation
                    <ArrowRight className="w-5 h-5 ml-2" />
                  </Link>
                </Button>
                <Button asChild size="lg" variant="outline" className="font-semibold">
                  <Link to="/tarifs">Voir les tarifs</Link>
                </Button>
              </div>

              {/* Avis + stats */}
              <div className="flex flex-wrap items-center gap-4 pt-2">
                <div className="flex items-center gap-2">
                  {[1,2,3,4,5].map((i) => (
                    <Star key={i} className="w-4 h-4 fill-primary text-primary" />
                  ))}
                  <span className="text-sm font-semibold">4.9/5</span>
                </div>
                <span className="text-xs text-muted-foreground">
                  Basé sur 127 avis vérifiés · Sans engagement
                </span>
              </div>
            </div>

            {/* Colonne droite : stat card */}
            <div className="hidden md:flex flex-col gap-4 min-w-[200px]">
              <div className="bg-gradient-to-br from-primary/10 to-primary/5 rounded-xl p-6 border border-primary/20 text-center">
                <div className="text-5xl font-extrabold text-primary">+500</div>
                <div className="text-xs text-muted-foreground mt-1 uppercase tracking-wide font-medium">
                  Vendeurs actifs
                </div>
              </div>
              <div className="bg-muted/50 rounded-xl p-6 border border-border/50 text-center">
                <div className="text-5xl font-extrabold text-foreground">700€</div>
                <div className="text-xs text-muted-foreground mt-1 uppercase tracking-wide font-medium">
                  Investissement unique
                </div>
              </div>
              <div className="bg-muted/50 rounded-xl p-4 border border-border/50 flex items-center gap-3">
                <Lock className="w-5 h-5 text-primary shrink-0" />
                <div className="text-xs text-muted-foreground leading-tight">
                  <strong className="text-foreground">Paiement sécurisé</strong><br />
                  SSL 256-bit · Accès immédiat
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default BlogConversionCTA;
