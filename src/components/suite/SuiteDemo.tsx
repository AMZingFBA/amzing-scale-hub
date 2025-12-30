import { Play, Monitor, BarChart3, ShoppingBag } from 'lucide-react';

const SuiteDemo = () => {
  const screenshots = [
    {
      icon: Monitor,
      title: "Dashboard",
      description: "Vue d'ensemble de tes KPIs"
    },
    {
      icon: BarChart3,
      title: "Moniteur ROI",
      description: "Analyse rentabilité produits"
    },
    {
      icon: ShoppingBag,
      title: "Catalogue",
      description: "Fournisseurs et deals"
    }
  ];

  return (
    <section className="py-20 lg:py-28 relative bg-gradient-to-b from-transparent via-suite-card/30 to-transparent">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
            Aperçu de la plateforme
          </h2>
          <p className="text-suite-gray text-lg max-w-2xl mx-auto">
            Découvre l'interface et les fonctionnalités en action.
          </p>
        </div>

        {/* Screenshots grid */}
        <div className="grid md:grid-cols-3 gap-6 mb-12">
          {screenshots.map((item, index) => (
            <div
              key={index}
              className="bg-suite-card border border-white/10 rounded-2xl overflow-hidden group hover:border-suite-orange/30 transition-all duration-300"
            >
              {/* Screenshot placeholder */}
              <div className="aspect-video bg-gradient-to-br from-white/5 to-white/0 relative">
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="w-16 h-16 rounded-2xl bg-white/10 flex items-center justify-center">
                    <item.icon className="w-8 h-8 text-suite-gray" />
                  </div>
                </div>
                {/* Fake UI elements */}
                <div className="absolute top-4 left-4 right-4">
                  <div className="h-2 bg-white/10 rounded-full w-1/3 mb-2" />
                  <div className="h-2 bg-white/5 rounded-full w-1/2" />
                </div>
                <div className="absolute bottom-4 left-4 right-4 grid grid-cols-3 gap-2">
                  <div className="h-8 bg-white/5 rounded" />
                  <div className="h-8 bg-white/5 rounded" />
                  <div className="h-8 bg-white/5 rounded" />
                </div>
              </div>
              
              {/* Caption */}
              <div className="p-4">
                <h3 className="font-semibold text-white mb-1">{item.title}</h3>
                <p className="text-sm text-suite-gray">{item.description}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Video demo block */}
        <div className="bg-suite-card border border-white/10 rounded-2xl overflow-hidden">
          <div className="aspect-video relative bg-gradient-to-br from-suite-orange/10 via-transparent to-suite-blue/10">
            {/* Play button */}
            <button className="absolute inset-0 flex items-center justify-center group">
              <div className="w-20 h-20 rounded-full bg-suite-orange flex items-center justify-center shadow-lg shadow-suite-orange/30 group-hover:scale-110 transition-transform duration-300">
                <Play className="w-8 h-8 text-white ml-1" fill="white" />
              </div>
            </button>
            
            {/* Overlay text */}
            <div className="absolute bottom-6 left-6">
              <span className="bg-black/50 backdrop-blur-sm text-white text-sm font-medium px-3 py-1.5 rounded-full">
                Démo en 60 secondes
              </span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default SuiteDemo;
