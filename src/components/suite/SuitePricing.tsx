import { Check, Shield, Zap, CreditCard } from 'lucide-react';

const SuitePricing = () => {
  const includedFeatures = [
    "Produits rentables envoyés chaque semaine",
    "ROI et marges calculés automatiquement",
    "Catalogue fournisseurs & deals exclusifs",
    "Templates & checklists",
    "Forma en ligne (modules & guides)",
    "Communauté privée",
    "Support 9h–19h (jours ouvrés)",
    "Appel hebdo (30–60 min)",
    "Nouveaux produits + mises à jour à vie"
  ];

  const scrollToCheckout = () => {
    // Placeholder - replace with actual checkout URL
    window.open('https://VOTRE_LIEN_STRIPE_CHECKOUT', '_blank');
  };

  return (
    <section id="pricing" className="py-20 lg:py-28 relative">
      {/* Background effect */}
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-suite-orange/5 to-transparent" />
      
      <div className="relative max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
            Accès à vie — <span className="text-suite-orange">1 499,99 €</span>
          </h2>
          <p className="text-suite-gray text-lg">
            Paiement en 1x ou en 3 à 5 fois (montants calculés automatiquement au checkout).
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
                ACCÈS À VIE
              </div>

              {/* Price */}
              <div className="mb-8">
                <div className="flex items-baseline gap-2 mb-2">
                  <span className="text-5xl font-bold text-white">1 499,99</span>
                  <span className="text-2xl text-white">€</span>
                </div>
                <p className="text-suite-gray">Paiement unique • Accès illimité</p>
              </div>

              {/* Payment options */}
              <div className="bg-white/5 rounded-xl p-4 mb-8">
                <div className="flex items-center gap-2 mb-3">
                  <CreditCard className="w-5 h-5 text-suite-gray" />
                  <span className="text-sm font-medium text-white">Options de paiement</span>
                </div>
                <div className="grid grid-cols-4 gap-2 text-center">
                  <div className="bg-white/5 rounded-lg py-2 px-1">
                    <span className="text-xs text-suite-gray block">1x</span>
                    <span className="text-sm font-semibold text-white">1499,99€</span>
                  </div>
                  <div className="bg-white/5 rounded-lg py-2 px-1">
                    <span className="text-xs text-suite-gray block">3x</span>
                    <span className="text-sm font-semibold text-white">~500€</span>
                  </div>
                  <div className="bg-white/5 rounded-lg py-2 px-1">
                    <span className="text-xs text-suite-gray block">4x</span>
                    <span className="text-sm font-semibold text-white">~375€</span>
                  </div>
                  <div className="bg-white/5 rounded-lg py-2 px-1">
                    <span className="text-xs text-suite-gray block">5x</span>
                    <span className="text-sm font-semibold text-white">~300€</span>
                  </div>
                </div>
                <p className="text-xs text-suite-gray/60 mt-2 text-center">
                  Montants exacts calculés au checkout
                </p>
              </div>

              {/* CTA Button */}
              <button
                onClick={scrollToCheckout}
                className="w-full bg-gradient-to-r from-suite-orange to-suite-orange/80 hover:from-suite-orange/90 hover:to-suite-orange text-white font-bold py-4 px-6 rounded-xl transition-all duration-300 hover:shadow-xl hover:shadow-suite-orange/30 text-lg mb-6"
              >
                Je prends l'accès à vie
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
