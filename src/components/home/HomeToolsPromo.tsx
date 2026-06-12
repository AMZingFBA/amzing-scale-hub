import { Link } from 'react-router-dom';
import { Search, FileSpreadsheet, ArrowRight, Zap, BarChart3, Globe, TrendingUp, CheckCircle2, Sparkles, Brain, Bot } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

export default function HomeToolsPromo() {
  return (
    <section className="py-20 relative overflow-hidden">
      {/* Background effects */}
      <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-background to-secondary/5" />
      <div className="absolute top-1/2 left-0 w-96 h-96 bg-primary/8 rounded-full blur-[120px] -translate-y-1/2" />
      <div className="absolute top-1/2 right-0 w-96 h-96 bg-secondary/8 rounded-full blur-[120px] -translate-y-1/2" />

      <div className="container mx-auto px-4 relative z-10">
        {/* Header */}
        <div className="text-center mb-14">
          <Badge className="mb-4 bg-gradient-to-r from-primary/15 to-secondary/15 text-primary border-primary/25 text-sm px-4 py-1.5">
            <Brain className="w-3.5 h-3.5 mr-1.5" />
            Outils IA — Inclus dans ton abonnement
          </Badge>
          <h2 className="text-4xl md:text-5xl font-extrabold tracking-tight mb-4">
            Une IA qui analyse tes produits{' '}
            <span className="bg-gradient-to-r from-primary via-orange-500 to-secondary bg-clip-text text-transparent">
              à ta place
            </span>
          </h2>
          <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto">
            Deux outils boostés à l'intelligence artificielle pour scanner, scorer et valider tes opportunités Amazon en quelques secondes.
          </p>
        </div>

        {/* Cards grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 max-w-6xl mx-auto">

          {/* AMZing AMP Card */}
          <div className="group relative">
            <div className="absolute -inset-1 bg-gradient-to-r from-primary via-orange-500 to-primary rounded-3xl blur-lg opacity-25 group-hover:opacity-50 transition-all duration-500" />
            <div className="relative rounded-3xl border-2 border-primary/20 bg-card/90 backdrop-blur-sm overflow-hidden shadow-xl hover:shadow-2xl hover:shadow-primary/10 transition-all duration-500 hover:-translate-y-1 h-full">
              {/* Top glow */}
              <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-primary via-orange-500 to-primary" />

              <div className="p-8">
                {/* Icon + Title */}
                <div className="flex items-center gap-4 mb-6">
                  <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-primary to-orange-500 flex items-center justify-center shadow-lg shadow-primary/30 group-hover:scale-110 group-hover:rotate-3 transition-all duration-300">
                    <Brain className="w-7 h-7 text-white" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <h3 className="text-2xl font-extrabold">AMZing AMP</h3>
                      <Badge variant="outline" className="text-[10px] px-1.5 py-0 border-primary/40 text-primary font-bold">
                        <Sparkles className="w-2.5 h-2.5 mr-0.5" />IA
                      </Badge>
                    </div>
                    <p className="text-sm text-muted-foreground">Analyse IA Multi-Pays</p>
                  </div>
                </div>

                {/* Description */}
                <p className="text-muted-foreground mb-6 leading-relaxed">
                  Entre un EAN ou ASIN — notre <strong className="text-foreground">IA propriétaire</strong> calcule la rentabilité, score le produit et compare <strong className="text-foreground">5 marketplaces Amazon</strong> (FR, UK, DE, ES, IT) en moins de 3 secondes.
                </p>

                {/* Features */}
                <div className="space-y-3 mb-8">
                  {[
                    'Score de rentabilité IA (0 → 100)',
                    'Prix Buy Box, FBA & FBM en temps réel',
                    'ROI et profit calculés automatiquement',
                    'Graphiques Keepa 30/90/180/365 jours',
                    'Analyse IA sur 5 pays européens',
                  ].map((feat) => (
                    <div key={feat} className="flex items-center gap-3 group/item">
                      <CheckCircle2 className="w-5 h-5 text-primary shrink-0 group-hover/item:scale-110 transition-transform" />
                      <span className="text-sm">{feat}</span>
                    </div>
                  ))}
                </div>

                {/* Stats */}
                <div className="grid grid-cols-3 gap-3 mb-8">
                  {[
                    { icon: Brain, value: 'IA', label: 'Scoring' },
                    { icon: Globe, value: '5', label: 'Pays' },
                    { icon: BarChart3, value: 'Keepa', label: 'Graphiques' },
                  ].map(({ icon: Icon, value, label }) => (
                    <div key={label} className="text-center p-3 rounded-xl bg-primary/5 border border-primary/10">
                      <Icon className="w-5 h-5 text-primary mx-auto mb-1" />
                      <div className="font-extrabold text-sm">{value}</div>
                      <div className="text-[11px] text-muted-foreground">{label}</div>
                    </div>
                  ))}
                </div>

                {/* CTA */}
                <Link to="/amzing-amp">
                  <Button className="w-full group/btn gap-2 font-bold shadow-lg shadow-primary/20 hover:shadow-primary/40 transition-all h-12 text-base">
                    <Brain className="w-5 h-5" />
                    Lancer l'analyse IA
                    <ArrowRight className="w-5 h-5 transition-transform group-hover/btn:translate-x-1" />
                  </Button>
                </Link>
              </div>
            </div>
          </div>

          {/* Analyse de Fichier Card */}
          <div className="group relative">
            <div className="absolute -inset-1 bg-gradient-to-r from-secondary via-blue-500 to-secondary rounded-3xl blur-lg opacity-25 group-hover:opacity-50 transition-all duration-500" />
            <div className="relative rounded-3xl border-2 border-secondary/20 bg-card/90 backdrop-blur-sm overflow-hidden shadow-xl hover:shadow-2xl hover:shadow-secondary/10 transition-all duration-500 hover:-translate-y-1 h-full">
              {/* Top glow */}
              <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-secondary via-blue-500 to-secondary" />

              <div className="p-8">
                {/* Icon + Title */}
                <div className="flex items-center gap-4 mb-6">
                  <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-secondary to-blue-500 flex items-center justify-center shadow-lg shadow-secondary/30 group-hover:scale-110 group-hover:rotate-3 transition-all duration-300">
                    <FileSpreadsheet className="w-7 h-7 text-white" />
                  </div>
                  <div>
                    <h3 className="text-2xl font-extrabold">Analyse de Fichier</h3>
                    <p className="text-sm text-muted-foreground">Analyse en masse</p>
                  </div>
                </div>

                {/* Description */}
                <p className="text-muted-foreground mb-6 leading-relaxed">
                  Importe ton fichier fournisseur (CSV, Excel) et laisse notre moteur analyser <strong className="text-foreground">des centaines de produits</strong> en une seule fois avec les donnees Amazon.
                </p>

                {/* Features */}
                <div className="space-y-3 mb-8">
                  {[
                    'Import CSV / Excel en un clic',
                    'Matching EAN → ASIN automatique',
                    'Calcul ROI, profit, fees pour chaque ligne',
                    'Export des resultats analyses',
                    'Ideal pour fichiers grossistes',
                  ].map((feat) => (
                    <div key={feat} className="flex items-center gap-3 group/item">
                      <CheckCircle2 className="w-5 h-5 text-secondary shrink-0 group-hover/item:scale-110 transition-transform" />
                      <span className="text-sm">{feat}</span>
                    </div>
                  ))}
                </div>

                {/* Stats */}
                <div className="grid grid-cols-3 gap-3 mb-8">
                  {[
                    { icon: FileSpreadsheet, value: 'CSV', label: 'Excel' },
                    { icon: Zap, value: '100+', label: 'Produits' },
                    { icon: TrendingUp, value: 'ROI', label: 'Par ligne' },
                  ].map(({ icon: Icon, value, label }) => (
                    <div key={label} className="text-center p-3 rounded-xl bg-secondary/5 border border-secondary/10">
                      <Icon className="w-5 h-5 text-secondary mx-auto mb-1" />
                      <div className="font-extrabold text-sm">{value}</div>
                      <div className="text-[11px] text-muted-foreground">{label}</div>
                    </div>
                  ))}
                </div>

                {/* CTA */}
                <Link to="/analyse-fichier">
                  <Button variant="secondary" className="w-full group/btn gap-2 font-bold shadow-lg shadow-secondary/20 hover:shadow-secondary/40 transition-all h-12 text-base">
                    <FileSpreadsheet className="w-5 h-5" />
                    Analyser un fichier
                    <ArrowRight className="w-5 h-5 transition-transform group-hover/btn:translate-x-1" />
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom trust line */}
        <div className="text-center mt-10">
          <div className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-muted/80 border border-border/50 text-sm text-muted-foreground">
            <Sparkles className="w-4 h-4 text-primary" />
            <span>Inclus dans l'abonnement AMZing — <strong className="text-foreground">acces illimite</strong></span>
          </div>
        </div>
      </div>
    </section>
  );
}
