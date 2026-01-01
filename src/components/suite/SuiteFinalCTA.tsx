import { ArrowRight, Check } from 'lucide-react';

const SuiteFinalCTA = () => {
  const benefits = [
    "Produits rentables chaque semaine",
    "Catalogue fournisseurs exclusif",
    "Support + Coaching hebdomadaire",
    "Accès à vie, nouveaux produits inclus"
  ];

  const scrollToPricing = () => {
    const pricingSection = document.getElementById('pricing');
    if (pricingSection) {
      pricingSection.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <section className="py-20 lg:py-28 relative overflow-hidden">
      {/* Background gradient */}
      <div className="absolute inset-0 bg-gradient-to-br from-suite-orange/20 via-transparent to-suite-blue/20" />
      
      <div className="relative max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-6">
          Prêt à passer au niveau supérieur ?
        </h2>
        
        <p className="text-xl text-suite-gray mb-8 max-w-2xl mx-auto">
          Rejoins les vendeurs qui reçoivent des produits rentables chaque semaine et scalent plus vite avec AMZing FBA.
        </p>

        {/* Benefits recap */}
        <div className="flex flex-wrap justify-center gap-4 mb-10">
          {benefits.map((benefit, index) => (
            <div key={index} className="flex items-center gap-2 bg-white/5 border border-white/10 rounded-full px-4 py-2">
              <Check className="w-4 h-4 text-suite-orange" />
              <span className="text-sm text-white/90">{benefit}</span>
            </div>
          ))}
        </div>

        {/* CTA Button */}
        <button
          onClick={scrollToPricing}
          className="group inline-flex items-center gap-3 bg-gradient-to-r from-suite-orange to-suite-orange/80 hover:from-suite-orange/90 hover:to-suite-orange text-white font-bold py-5 px-10 rounded-xl transition-all duration-300 hover:shadow-xl hover:shadow-suite-orange/30 text-xl"
        >
          Débloquer mon accès à vie
          <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
        </button>

        <p className="mt-6 text-suite-gray">
          1 499,99 € — Paiement unique ou en plusieurs fois
        </p>
      </div>
    </section>
  );
};

export default SuiteFinalCTA;
