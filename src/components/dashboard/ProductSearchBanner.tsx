import { Link } from 'react-router-dom';
import { Search, Zap, Globe, Filter, TrendingUp, ArrowRight, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function ProductSearchBanner() {
  return (
    <div className="relative mb-8 overflow-hidden rounded-2xl border border-primary/20 bg-gradient-to-br from-primary/10 via-card to-primary/5">
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-20 -right-20 w-72 h-72 bg-primary/10 rounded-full blur-3xl animate-pulse" />
        <div className="absolute -bottom-16 -left-16 w-56 h-56 bg-primary/8 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }} />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-32 bg-primary/5 rounded-full blur-3xl" />
      </div>

      <div className="relative z-10 p-6 md:p-8">
        {/* Badge */}
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-primary/15 border border-primary/25 text-primary text-xs font-semibold mb-4">
          <Sparkles className="w-3 h-3" />
          NOUVEAU — Intelligence Artificielle
        </div>

        {/* Title */}
        <h2 className="text-2xl md:text-3xl font-extrabold tracking-tight mb-2">
          Recherche de produits{' '}
          <span className="bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent">
            alimentée par l'IA
          </span>
        </h2>

        <p className="text-muted-foreground text-sm md:text-base max-w-xl mb-6">
          Notre moteur scrape <span className="font-bold text-foreground">+780 fournisseurs</span> en temps réel,
          croise les données Amazon et vous livre les produits les plus rentables — en quelques clics.
        </p>

        {/* Feature pills */}
        <div className="flex flex-wrap gap-2 mb-6">
          {[
            { icon: Globe, label: '780+ fournisseurs' },
            { icon: Filter, label: 'Filtres avancés' },
            { icon: TrendingUp, label: 'ROI & profit instantanés' },
            { icon: Zap, label: 'Résultats en ~2 min' },
          ].map(({ icon: Icon, label }) => (
            <span
              key={label}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-background/80 border border-border text-xs font-medium text-foreground backdrop-blur-sm"
            >
              <Icon className="w-3.5 h-3.5 text-primary" />
              {label}
            </span>
          ))}
        </div>

        {/* Stats row */}
        <div className="grid grid-cols-3 gap-3 mb-6 max-w-md">
          {[
            { value: '780+', label: 'Fournisseurs' },
            { value: '~2 min', label: 'Par recherche' },
            { value: '∞', label: 'Recherches' },
          ].map(({ value, label }) => (
            <div key={label} className="text-center p-3 rounded-xl bg-background/60 border border-border/50 backdrop-blur-sm">
              <p className="text-lg md:text-xl font-extrabold text-primary">{value}</p>
              <p className="text-[10px] md:text-xs text-muted-foreground font-medium">{label}</p>
            </div>
          ))}
        </div>

        {/* CTA */}
        <Link to="/product-search">
          <Button size="lg" className="group gap-2 text-sm font-bold shadow-lg shadow-primary/20 hover:shadow-primary/30 transition-all">
            <Search className="w-4 h-4" />
            Lancer une recherche
            <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
          </Button>
        </Link>
      </div>
    </div>
  );
}
