import { Link } from 'react-router-dom';
import { Search, Zap, Globe, Filter, TrendingUp, ArrowRight, Sparkles, Lock, Brain, BarChart3 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

export default function HomeAISearchPromo() {
  return (
    <section className="py-20 relative overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 bg-gradient-to-b from-background via-primary/5 to-background" />
      <div className="absolute top-10 left-1/4 w-80 h-80 bg-primary/10 rounded-full blur-[100px]" />
      <div className="absolute bottom-10 right-1/4 w-64 h-64 bg-secondary/10 rounded-full blur-[100px]" />

      <div className="container mx-auto px-4 relative z-10">
        {/* Header */}
        <div className="text-center mb-12">
          <Badge className="mb-4 bg-primary/15 text-primary border-primary/25 text-sm px-4 py-1.5">
            <Sparkles className="w-3.5 h-3.5 mr-1.5" />
            Exclusivité AMZing — Intelligence Artificielle
          </Badge>
          <h2 className="text-4xl md:text-5xl font-extrabold tracking-tight mb-4">
            Trouve les produits rentables{' '}
            <span className="bg-gradient-to-r from-primary via-primary/80 to-secondary bg-clip-text text-transparent">
              avant tout le monde
            </span>
          </h2>
          <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto">
            Notre IA scrape <strong className="text-foreground">+780 fournisseurs</strong> en temps réel, 
            croise les données Amazon et te livre les opportunités les plus rentables — automatiquement.
          </p>
        </div>

        {/* Main visual card */}
        <div className="max-w-5xl mx-auto">
          <div className="relative rounded-3xl border-2 border-primary/20 bg-card/80 backdrop-blur-sm overflow-hidden shadow-2xl shadow-primary/10">
            {/* Glow effect top */}
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-2/3 h-1 bg-gradient-to-r from-transparent via-primary to-transparent" />
            
            <div className="p-8 md:p-12">
              {/* Feature grid */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
                {[
                  {
                    icon: Brain,
                    title: 'IA de scraping',
                    desc: 'Analyse automatique de +780 fournisseurs européens avec filtres intelligents.',
                    color: 'from-primary to-primary/70',
                  },
                  {
                    icon: BarChart3,
                    title: 'Données Amazon croisées',
                    desc: 'BSR, prix, vendeurs, ROI FBA/FBM calculés instantanément pour chaque produit.',
                    color: 'from-secondary to-accent',
                  },
                  {
                    icon: Zap,
                    title: 'Résultats en ~2 min',
                    desc: 'Lance une recherche, va prendre un café. Les résultats arrivent tout seuls.',
                    color: 'from-orange-500 to-yellow-500',
                  },
                ].map(({ icon: Icon, title, desc, color }) => (
                  <div key={title} className="group relative p-6 rounded-2xl bg-background/60 border border-border/50 hover:border-primary/30 transition-all duration-300">
                    <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${color} flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}>
                      <Icon className="w-6 h-6 text-white" />
                    </div>
                    <h3 className="font-bold text-lg mb-2">{title}</h3>
                    <p className="text-sm text-muted-foreground">{desc}</p>
                  </div>
                ))}
              </div>

              {/* Stats bar */}
              <div className="flex flex-wrap justify-center gap-8 mb-10 py-6 rounded-2xl bg-muted/50 border border-border/30">
                {[
                  { value: '780+', label: 'Fournisseurs scannés', icon: Globe },
                  { value: 'ROI & Profit', label: 'Calculés automatiquement', icon: TrendingUp },
                  { value: 'Filtres pro', label: 'BSR, prix, catégorie…', icon: Filter },
                ].map(({ value, label, icon: Icon }) => (
                  <div key={label} className="flex items-center gap-3 px-4">
                    <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                      <Icon className="w-5 h-5 text-primary" />
                    </div>
                    <div>
                      <p className="font-extrabold text-foreground">{value}</p>
                      <p className="text-xs text-muted-foreground">{label}</p>
                    </div>
                  </div>
                ))}
              </div>

              {/* CTA */}
              <div className="text-center">
                <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20 text-primary text-sm font-medium mb-5">
                  <Lock className="w-4 h-4" />
                  Réservé aux membres AMZing
                </div>
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <Link to="/tarifs">
                    <Button size="lg" className="group gap-2 text-base font-bold shadow-lg shadow-primary/20 hover:shadow-primary/30 transition-all px-8">
                      <Search className="w-5 h-5" />
                      Débloquer la recherche IA
                      <ArrowRight className="w-5 h-5 transition-transform group-hover:translate-x-1" />
                    </Button>
                  </Link>
                </div>
                <p className="mt-4 text-sm text-muted-foreground">
                  Inclus dans l'abonnement AMZing — accès illimité
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
