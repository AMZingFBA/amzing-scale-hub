import { Target, ShoppingBag, FileText, BookOpen, Users, Headphones } from 'lucide-react';

const SuiteSolution = () => {
  const features = [
    {
      icon: Target,
      title: "Produits rentables livrés",
      description: "Reçois chaque semaine des produits validés avec ROI calculé, prêts à sourcer.",
      color: "suite-orange"
    },
    {
      icon: ShoppingBag,
      title: "Catalogue fournisseurs",
      description: "Accède à notre réseau de fournisseurs vérifiés et aux deals exclusifs.",
      color: "suite-blue"
    },
    {
      icon: FileText,
      title: "Templates & checklists",
      description: "Listings optimisés, calculs de coûts, et checklists pour ne rien oublier.",
      color: "green-500"
    },
    {
      icon: BookOpen,
      title: "Formation en ligne",
      description: "Bibliothèque de modules et process pas à pas pour chaque étape.",
      color: "purple-500"
    },
    {
      icon: Users,
      title: "Communauté privée",
      description: "Échange avec d'autres vendeurs, partage d'opportunités et entraide.",
      color: "pink-500"
    },
    {
      icon: Headphones,
      title: "Support + Coaching hebdomadaire",
      description: "Support 9h-19h jours ouvrés + 1 Coaching par semaine (30-60 min).",
      color: "cyan-500"
    }
  ];

  const getColorClasses = (color: string) => {
    const colors: Record<string, { bg: string; text: string; border: string }> = {
      'suite-orange': { bg: 'bg-suite-orange/10', text: 'text-suite-orange', border: 'border-suite-orange/20' },
      'suite-blue': { bg: 'bg-suite-blue/10', text: 'text-suite-blue', border: 'border-suite-blue/20' },
      'green-500': { bg: 'bg-green-500/10', text: 'text-green-400', border: 'border-green-500/20' },
      'purple-500': { bg: 'bg-purple-500/10', text: 'text-purple-400', border: 'border-purple-500/20' },
      'pink-500': { bg: 'bg-pink-500/10', text: 'text-pink-400', border: 'border-pink-500/20' },
      'cyan-500': { bg: 'bg-cyan-500/10', text: 'text-cyan-400', border: 'border-cyan-500/20' },
    };
    return colors[color] || colors['suite-orange'];
  };

  return (
    <section id="solution" className="py-20 lg:py-28 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 bg-suite-orange/10 border border-suite-orange/20 rounded-full px-4 py-2 mb-6">
            <span className="text-sm text-suite-orange font-medium">La solution</span>
          </div>
          
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-suite-orange to-suite-blue">AMZing FBA</span>
          </h2>
          <p className="text-suite-gray text-lg max-w-2xl mx-auto">
            Des produits rentables livrés + les outils et l'accompagnement pour réussir sur Amazon FBA.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((feature, index) => {
            const colorClasses = getColorClasses(feature.color);
            return (
              <div
                key={index}
                className={`group bg-suite-card border border-white/10 rounded-2xl p-6 hover:${colorClasses.border} transition-all duration-300 hover:transform hover:-translate-y-1`}
              >
                <div className={`w-12 h-12 rounded-xl ${colorClasses.bg} flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300`}>
                  <feature.icon className={`w-6 h-6 ${colorClasses.text}`} />
                </div>
                
                <h3 className="text-lg font-bold text-white mb-2">{feature.title}</h3>
                <p className="text-suite-gray text-sm leading-relaxed">{feature.description}</p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default SuiteSolution;
