import { Check, ArrowDown, Sparkles, Shield } from 'lucide-react';

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
    "Produits rentables envoyés chaque semaine",
    "Calcul ROI et marges automatique",
    "Accès fournisseurs & catalogues exclusifs",
    "Communauté privée + support 9h–19h",
    "Appel hebdo (30–60 min)"
  ];

  return (
    <section className="relative min-h-screen flex items-center pt-20 overflow-hidden">
      {/* Background gradient */}
      <div className="absolute inset-0 bg-gradient-to-br from-suite-bg via-suite-bg to-suite-blue/10" />
      
      {/* Decorative elements */}
      <div className="absolute top-20 left-10 w-72 h-72 bg-suite-orange/10 rounded-full blur-3xl" />
      <div className="absolute bottom-20 right-10 w-96 h-96 bg-suite-blue/10 rounded-full blur-3xl" />
      
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-20">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
          {/* Left content */}
          <div className="text-center lg:text-left">
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
            
            <p className="text-lg md:text-xl text-suite-gray mb-8 max-w-xl mx-auto lg:mx-0">
              AMZing FBA regroupe les outils, les produits rentables et l'accompagnement pour avancer vite, sans te disperser.
            </p>
            
            {/* Benefits list */}
            <ul className="space-y-3 mb-8 text-left max-w-md mx-auto lg:mx-0">
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
            <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
              <button
                onClick={scrollToPricing}
                className="group bg-gradient-to-r from-suite-orange to-suite-orange/80 hover:from-suite-orange/90 hover:to-suite-orange text-white font-semibold px-8 py-4 rounded-xl transition-all duration-300 hover:shadow-xl hover:shadow-suite-orange/30 text-lg"
              >
                Débloquer mon accès à vie
              </button>
              <button
                onClick={scrollToFeatures}
                className="flex items-center justify-center gap-2 border border-suite-gray/30 hover:border-suite-gray/50 text-white font-medium px-8 py-4 rounded-xl transition-all duration-300 hover:bg-white/5"
              >
                Voir ce que j'obtiens
                <ArrowDown className="w-4 h-4" />
              </button>
            </div>
          </div>
          
          {/* Right content - Mockup */}
          <div className="relative">
            <div className="relative bg-gradient-to-br from-suite-card to-suite-bg border border-white/10 rounded-2xl p-6 shadow-2xl">
              {/* Mockup header */}
              <div className="flex items-center gap-2 mb-4">
                <div className="w-3 h-3 rounded-full bg-red-500" />
                <div className="w-3 h-3 rounded-full bg-yellow-500" />
                <div className="w-3 h-3 rounded-full bg-green-500" />
                <span className="ml-4 text-sm text-suite-gray">Dashboard AMZing FBA</span>
              </div>
              
              {/* Mockup content placeholder */}
              <div className="space-y-4">
                <div className="h-8 bg-white/5 rounded-lg w-3/4" />
                <div className="grid grid-cols-3 gap-3">
                  <div className="h-24 bg-gradient-to-br from-suite-orange/20 to-transparent rounded-lg border border-suite-orange/20" />
                  <div className="h-24 bg-gradient-to-br from-suite-blue/20 to-transparent rounded-lg border border-suite-blue/20" />
                  <div className="h-24 bg-gradient-to-br from-green-500/20 to-transparent rounded-lg border border-green-500/20" />
                </div>
                <div className="h-32 bg-white/5 rounded-lg" />
                <div className="grid grid-cols-2 gap-3">
                  <div className="h-16 bg-white/5 rounded-lg" />
                  <div className="h-16 bg-white/5 rounded-lg" />
                </div>
              </div>
              
              {/* Badges */}
              <div className="absolute -top-3 -right-3 bg-suite-orange text-white text-xs font-bold px-3 py-1.5 rounded-full shadow-lg">
                Accès à vie
              </div>
              <div className="absolute -bottom-3 -left-3 flex items-center gap-2 bg-suite-card border border-white/10 text-white text-xs font-medium px-3 py-1.5 rounded-full shadow-lg">
                <Shield className="w-3 h-3 text-green-400" />
                Mises à jour incluses
              </div>
            </div>
            
            {/* Decorative glow */}
            <div className="absolute inset-0 bg-gradient-to-r from-suite-orange/20 to-suite-blue/20 blur-3xl -z-10 scale-110" />
          </div>
        </div>
      </div>
    </section>
  );
};

export default SuiteHero;
