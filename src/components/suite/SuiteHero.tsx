import { Check, ArrowDown, Sparkles } from 'lucide-react';

const SuiteHero = () => {
  const scrollToPricing = () => {
    const pricingSection = document.getElementById('pricing');
    if (pricingSection) {
      pricingSection.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const scrollToFeatures = () => {
    const featuresSection = document.getElementById('solution');
    if (featuresSection) {
      featuresSection.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const benefits = [
    "30 produits rentables (40-50% ROI net) envoyés chaque jour",
    "Calcul ROI et marges automatique",
    "Accès fournisseurs & catalogues exclusifs",
    "Communauté privée + support 9h–19h",
    "Coaching hebdomadaire (30–60 min)"
  ];

  return (
    <section className="relative min-h-[80vh] flex items-center pt-20 overflow-hidden">
      {/* Background gradient */}
      <div className="absolute inset-0 bg-gradient-to-br from-suite-bg via-suite-bg to-suite-blue/10" />
      
      {/* Decorative elements */}
      <div className="absolute top-20 left-10 w-72 h-72 bg-suite-orange/10 rounded-full blur-3xl" />
      <div className="absolute bottom-20 right-10 w-96 h-96 bg-suite-blue/10 rounded-full blur-3xl" />
      
      <div className="relative max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-20">
        <div className="text-center">
          <div className="inline-flex items-center gap-2 bg-suite-orange/10 border border-suite-orange/20 rounded-full px-4 py-2 mb-6">
            <Sparkles className="w-4 h-4 text-suite-orange" />
            <span className="text-sm text-suite-orange font-medium">Accès à vie inclus</span>
          </div>
          
          <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold leading-tight mb-6">
            Le logiciel tout-en-un pour{' '}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-suite-orange to-suite-blue">
              lancer et scaler Amazon FBA
            </span>
            {' '}— à vie.
          </h1>
          
          <p className="text-lg md:text-xl text-suite-gray mb-8 max-w-2xl mx-auto">
            AMZing FBA regroupe les outils, les produits rentables et l{"'"}accompagnement pour avancer vite, sans te disperser.
          </p>
          
          {/* Benefits list */}
          <ul className="space-y-3 mb-8 text-left max-w-md mx-auto">
            {benefits.map((benefit, index) => (
              <li key={index} className="flex items-start gap-3">
                <div className="flex-shrink-0 w-5 h-5 rounded-full bg-suite-orange/20 flex items-center justify-center mt-0.5">
                  <Check className="w-3 h-3 text-suite-orange" />
                </div>
                <span className="text-suite-gray">{benefit}</span>
              </li>
            ))}
          </ul>
          
          {/* CTAs */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a
              href="https://calendly.com/amzingfba26/30min"
              target="_blank"
              rel="noopener noreferrer"
              className="group bg-gradient-to-r from-suite-orange to-suite-orange/80 hover:from-suite-orange/90 hover:to-suite-orange text-white font-semibold px-8 py-4 rounded-xl transition-all duration-300 hover:shadow-xl hover:shadow-suite-orange/30 text-lg"
            >
              Réserver un appel
            </a>
            <button
              onClick={scrollToFeatures}
              className="flex items-center justify-center gap-2 border border-suite-gray/30 hover:border-suite-gray/50 text-white font-medium px-8 py-4 rounded-xl transition-all duration-300 hover:bg-white/5"
            >
              Voir ce que j{"'"}obtiens
              <ArrowDown className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default SuiteHero;
