import { LogIn, Search, TrendingUp } from 'lucide-react';

const SuiteHowItWorks = () => {
  const steps = [
    {
      number: "01",
      icon: LogIn,
      title: "Tu accèdes à la Suite",
      description: "Connexion immédiate à tous les outils, la communauté et le support dès ton achat."
    },
    {
      number: "02",
      icon: Search,
      title: "Tu identifies des opportunités",
      description: "Utilise le moniteur ROI et applique les checklists pour valider tes produits."
    },
    {
      number: "03",
      icon: TrendingUp,
      title: "Tu avances avec le support",
      description: "Progresse chaque semaine avec l'appel hebdo et le support réactif."
    }
  ];

  return (
    <section className="py-20 lg:py-28 relative bg-gradient-to-b from-transparent via-suite-blue/5 to-transparent">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
            Comment ça marche ?
          </h2>
          <p className="text-suite-gray text-lg max-w-2xl mx-auto">
            Un process simple en 3 étapes pour commencer à générer des résultats.
          </p>
        </div>

        <div className="relative">
          {/* Connection line */}
          <div className="hidden lg:block absolute top-1/2 left-0 right-0 h-0.5 bg-gradient-to-r from-suite-orange via-suite-blue to-green-500 -translate-y-1/2" />
          
          <div className="grid lg:grid-cols-3 gap-8 lg:gap-6">
            {steps.map((step, index) => (
              <div key={index} className="relative">
                {/* Step card */}
                <div className="bg-suite-card border border-white/10 rounded-2xl p-8 text-center relative z-10">
                  {/* Number badge */}
                  <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-gradient-to-r from-suite-orange to-suite-blue text-white text-sm font-bold px-4 py-1 rounded-full">
                    {step.number}
                  </div>
                  
                  <div className="w-16 h-16 rounded-2xl bg-white/5 flex items-center justify-center mx-auto mb-6 mt-2">
                    <step.icon className="w-8 h-8 text-white" />
                  </div>
                  
                  <h3 className="text-xl font-bold text-white mb-3">{step.title}</h3>
                  <p className="text-suite-gray leading-relaxed">{step.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default SuiteHowItWorks;
