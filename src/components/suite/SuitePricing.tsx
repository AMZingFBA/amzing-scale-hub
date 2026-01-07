import { Check, Shield, Zap, CreditCard, Loader2 } from 'lucide-react';
import { useSuiteCheckout } from '@/hooks/use-suite-checkout';

const SuitePricing = () => {
  const { startCheckout, isLoading } = useSuiteCheckout();

  const includedFeatures = [
    "Produits rentables envoyés chaque semaine",
    "ROI et marges calculés automatiquement",
    "Catalogue fournisseurs & deals exclusifs",
    "Templates & checklists",
    "Formation en ligne (modules & guides)",
    "Communauté privée",
    "Support 9h–19h (jours ouvrés)",
    "Coaching hebdomadaire (30–60 min)",
    "Nouveaux produits + mises à jour à vie"
  ];

  return (
    <section id="pricing" className="py-20 lg:py-28 relative">
      {/* Background effect */}
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-suite-orange/5 to-transparent" />
      
      <div className="relative max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
            Accès VIP — <span className="text-suite-orange">À partir de 64€/mois</span>
          </h2>
          <p className="text-suite-gray text-lg">
            Ou 700€ en une fois • Accès 12 mois complet
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-8 lg:gap-12">
          {/* Left column - What's included */}
          <div className="bg-suite-card border border-white/10 rounded-2xl p-8">
            <h3 className="text-xl font-bold text-white mb-6">Tout ce qui est inclus :</h3>
            
            <ul className="space-y-4">
              {includedFeatures.map((feature, index) => (
                <li key={index} className="flex items-start gap-3">
                  <div className="flex-shrink-0 w-5 h-5 rounded-full bg-suite-orange/20 flex items-center justify-center mt-0.5">
                    <Check className="w-3 h-3 text-suite-orange" />
                  </div>
                  <span className="text-white/90">{feature}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Right column - Price card */}
          <div className="relative">
            <div className="bg-gradient-to-br from-suite-card to-suite-bg border-2 border-suite-orange/50 rounded-2xl p-8 relative overflow-hidden">
              {/* Popular badge */}
              <div className="absolute top-0 right-0 bg-suite-orange text-white text-xs font-bold px-4 py-1.5 rounded-bl-xl">
                ACCÈS 12 MOIS
              </div>

              {/* Price */}
              <div className="mb-8">
                <p className="text-suite-gray text-sm mb-2 line-through">Valeur réelle : 1 200€/an</p>
                <div className="flex items-baseline gap-2 mb-1">
                  <span className="text-5xl font-bold text-white">64</span>
                  <span className="text-2xl text-white">€</span>
                  <span className="text-lg text-suite-gray">/mois × 12</span>
                </div>
                <p className="text-suite-gray">
                  ou <span className="text-white font-semibold">700€ TTC</span> en une fois 
                  <span className="ml-2 bg-green-500/20 text-green-400 text-xs font-bold px-2 py-0.5 rounded">-10%</span>
                </p>
              </div>


              {/* CTA Button */}
              <button
                onClick={startCheckout}
                disabled={isLoading}
                className="w-full bg-gradient-to-r from-suite-orange to-suite-orange/80 hover:from-suite-orange/90 hover:to-suite-orange text-white font-bold py-4 px-6 rounded-xl transition-all duration-300 hover:shadow-xl hover:shadow-suite-orange/30 text-lg mb-6 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" />
                    Chargement...
                  </>
                ) : (
                  "Nous rejoindre maintenant"
                )}
              </button>

              {/* Trust badges */}
              <div className="flex flex-wrap items-center justify-center gap-4 text-sm text-suite-gray">
                <div className="flex items-center gap-1.5">
                  <Shield className="w-4 h-4 text-green-400" />
                  <span>Paiement sécurisé</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <Zap className="w-4 h-4 text-yellow-400" />
                  <span>Accès immédiat</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <CreditCard className="w-4 h-4 text-suite-blue" />
                  <span>Facture disponible</span>
                </div>
              </div>
            </div>

            {/* Decorative glow */}
            <div className="absolute inset-0 bg-suite-orange/20 blur-3xl -z-10 scale-110 opacity-50" />
          </div>
        </div>
      </div>
    </section>
  );
};

export default SuitePricing;
