import { Rocket, RefreshCcw, TrendingUp } from 'lucide-react';

const SuiteForWho = () => {
  const profiles = [
    {
      icon: Rocket,
      title: "Débutant",
      description: "Tu veux te lancer avec une structure claire, des checklists et un process pas à pas pour éviter les erreurs coûteuses.",
      color: "suite-orange"
    },
    {
      icon: RefreshCcw,
      title: "Vendeur en reconversion",
      description: "Tu viens d'un autre domaine et tu cherches une méthode éprouvée + un sourcing fiable pour démarrer sereinement.",
      color: "suite-blue"
    },
    {
      icon: TrendingUp,
      title: "Vendeur déjà actif",
      description: "Tu veux optimiser, trouver plus d'opportunités rapidement et scaler avec les bons outils et la bonne vitesse.",
      color: "green-500"
    }
  ];

  return (
    <section className="py-20 lg:py-28 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            <span className="text-white">Pour qui est </span>
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-suite-orange to-suite-blue">AMZing FBA Suite</span>
            <span className="text-white"> ?</span>
          </h2>
          <p className="text-suite-gray text-lg max-w-2xl mx-auto">
            Que tu démarres ou que tu cherches à passer au niveau supérieur, la Suite s'adapte à ton profil.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-6 lg:gap-8">
          {profiles.map((profile, index) => (
            <div
              key={index}
              className="group relative bg-suite-card border border-white/10 rounded-2xl p-8 hover:border-white/20 transition-all duration-300 hover:transform hover:-translate-y-1"
            >
              <div className={`w-14 h-14 rounded-xl bg-${profile.color}/10 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300`}>
                <profile.icon className={`w-7 h-7 ${profile.color === 'suite-orange' ? 'text-suite-orange' : profile.color === 'suite-blue' ? 'text-suite-blue' : 'text-green-500'}`} />
              </div>
              
              <h3 className="text-xl font-bold text-white mb-3">{profile.title}</h3>
              <p className="text-suite-gray leading-relaxed">{profile.description}</p>
              
              {/* Hover glow effect */}
              <div className={`absolute inset-0 rounded-2xl bg-gradient-to-br from-${profile.color}/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 -z-10`} />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default SuiteForWho;
