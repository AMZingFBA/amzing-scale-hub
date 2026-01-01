import { Monitor, Tablet, Smartphone } from 'lucide-react';

const SuiteMockups = () => {
  return (
    <section className="py-20 lg:py-28 relative overflow-hidden">
      {/* Background gradient */}
      <div className="absolute inset-0 bg-gradient-to-b from-suite-orange/10 via-suite-blue/5 to-transparent" />
      
      <div className="relative max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-8">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
            Accessible sur <span className="text-suite-orange">tous tes appareils</span>
          </h2>
          <p className="text-suite-gray text-lg max-w-2xl mx-auto">
            Accède à AMZing FBA depuis ton ordinateur, ta tablette ou ton smartphone. Tes outils te suivent partout.
          </p>
        </div>

        {/* Mockups Container */}
        <div className="relative flex justify-center items-end h-[500px] md:h-[550px] lg:h-[600px]">
          
          {/* Phone Mockup - Left */}
          <div className="absolute left-0 md:left-[5%] lg:left-[10%] bottom-0 z-30 transform -rotate-3 hover:rotate-0 transition-transform duration-500">
            <div className="relative">
              {/* Phone Frame */}
              <div className="w-[140px] md:w-[180px] lg:w-[200px] bg-gray-900 rounded-[24px] p-2 shadow-2xl shadow-black/50 border border-gray-700">
                {/* Notch */}
                <div className="absolute top-4 left-1/2 -translate-x-1/2 w-16 h-5 bg-black rounded-full z-10" />
                {/* Screen */}
                <div className="bg-suite-bg rounded-[18px] overflow-hidden aspect-[9/19]">
                  {/* App Content */}
                  <div className="p-3 h-full flex flex-col">
                    {/* Header */}
                    <div className="flex items-center justify-between mb-3 pt-4">
                      <div className="text-[8px] font-bold text-suite-orange">AMZing FBA</div>
                      <div className="w-4 h-4 rounded-full bg-suite-orange/20" />
                    </div>
                    {/* Menu Items */}
                    <div className="space-y-2 flex-1">
                      <div className="bg-suite-blue/20 rounded-lg p-2">
                        <div className="text-[6px] text-white font-medium">Module 1 : Introduction</div>
                        <div className="text-[5px] text-suite-gray mt-1">4 leçons • 45 min</div>
                      </div>
                      <div className="bg-white/5 rounded-lg p-2">
                        <div className="text-[6px] text-white font-medium">Module 2 : Trouver des produits</div>
                        <div className="text-[5px] text-suite-gray mt-1">6 leçons • 1h20</div>
                      </div>
                      <div className="bg-white/5 rounded-lg p-2">
                        <div className="text-[6px] text-white font-medium">Module 3 : Analyse ROI</div>
                        <div className="text-[5px] text-suite-gray mt-1">5 leçons • 55 min</div>
                      </div>
                      <div className="bg-white/5 rounded-lg p-2">
                        <div className="text-[6px] text-white font-medium">Module 4 : Fournisseurs</div>
                        <div className="text-[5px] text-suite-gray mt-1">4 leçons • 50 min</div>
                      </div>
                      <div className="bg-white/5 rounded-lg p-2">
                        <div className="text-[6px] text-white font-medium">Module 5 : Lancement</div>
                        <div className="text-[5px] text-suite-gray mt-1">7 leçons • 1h30</div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              {/* Phone label */}
              <div className="absolute -bottom-8 left-1/2 -translate-x-1/2 flex items-center gap-1 text-suite-gray text-xs">
                <Smartphone className="w-3 h-3" />
                <span>Mobile</span>
              </div>
            </div>
          </div>

          {/* Laptop Mockup - Center */}
          <div className="relative z-20 transform hover:scale-105 transition-transform duration-500">
            <div className="relative">
              {/* Screen */}
              <div className="w-[280px] md:w-[400px] lg:w-[500px] bg-gray-900 rounded-t-lg p-2 border-t border-x border-gray-700">
                <div className="bg-suite-bg rounded-md overflow-hidden aspect-[16/10]">
                  {/* Browser chrome */}
                  <div className="bg-gray-800 px-3 py-1.5 flex items-center gap-2">
                    <div className="flex gap-1">
                      <div className="w-2 h-2 rounded-full bg-red-500" />
                      <div className="w-2 h-2 rounded-full bg-yellow-500" />
                      <div className="w-2 h-2 rounded-full bg-green-500" />
                    </div>
                    <div className="flex-1 bg-gray-700 rounded text-[6px] md:text-[8px] text-gray-400 px-2 py-0.5 text-center">
                      app.amzingfba.com
                    </div>
                  </div>
                  {/* Dashboard Content */}
                  <div className="p-3 md:p-4">
                    <div className="flex gap-3">
                      {/* Sidebar */}
                      <div className="w-1/4 space-y-2 hidden md:block">
                        <div className="bg-suite-orange/20 rounded p-2 text-[7px] text-white">Dashboard</div>
                        <div className="bg-white/5 rounded p-2 text-[7px] text-suite-gray">Produits</div>
                        <div className="bg-white/5 rounded p-2 text-[7px] text-suite-gray">Formation</div>
                        <div className="bg-white/5 rounded p-2 text-[7px] text-suite-gray">Fournisseurs</div>
                        <div className="bg-white/5 rounded p-2 text-[7px] text-suite-gray">Communauté</div>
                      </div>
                      {/* Main content */}
                      <div className="flex-1 space-y-2 md:space-y-3">
                        <div className="text-[8px] md:text-[10px] font-bold text-white">Bienvenue sur AMZing FBA</div>
                        {/* Stats cards */}
                        <div className="grid grid-cols-3 gap-2">
                          <div className="bg-suite-orange/20 rounded p-2 text-center">
                            <div className="text-[10px] md:text-sm font-bold text-suite-orange">127</div>
                            <div className="text-[5px] md:text-[7px] text-suite-gray">Produits</div>
                          </div>
                          <div className="bg-suite-blue/20 rounded p-2 text-center">
                            <div className="text-[10px] md:text-sm font-bold text-suite-blue">45%</div>
                            <div className="text-[5px] md:text-[7px] text-suite-gray">ROI Moyen</div>
                          </div>
                          <div className="bg-green-500/20 rounded p-2 text-center">
                            <div className="text-[10px] md:text-sm font-bold text-green-400">24</div>
                            <div className="text-[5px] md:text-[7px] text-suite-gray">Fournisseurs</div>
                          </div>
                        </div>
                        {/* Recent products */}
                        <div className="bg-white/5 rounded p-2">
                          <div className="text-[6px] md:text-[8px] text-white mb-2">Derniers produits ajoutés</div>
                          <div className="space-y-1">
                            <div className="flex justify-between text-[5px] md:text-[6px]">
                              <span className="text-suite-gray">Produit électronique</span>
                              <span className="text-green-400">+52% ROI</span>
                            </div>
                            <div className="flex justify-between text-[5px] md:text-[6px]">
                              <span className="text-suite-gray">Accessoire maison</span>
                              <span className="text-green-400">+38% ROI</span>
                            </div>
                            <div className="flex justify-between text-[5px] md:text-[6px]">
                              <span className="text-suite-gray">Article sport</span>
                              <span className="text-green-400">+45% ROI</span>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              {/* Laptop base */}
              <div className="w-[320px] md:w-[460px] lg:w-[560px] h-3 md:h-4 bg-gray-800 rounded-b-xl mx-auto border-b border-x border-gray-700" />
              <div className="w-[100px] md:w-[140px] lg:w-[160px] h-1 bg-gray-700 rounded-b mx-auto" />
              {/* Laptop label */}
              <div className="absolute -bottom-10 left-1/2 -translate-x-1/2 flex items-center gap-1.5 text-suite-gray text-sm">
                <Monitor className="w-4 h-4" />
                <span>Desktop</span>
              </div>
            </div>
          </div>

          {/* Tablet Mockup - Right */}
          <div className="absolute right-0 md:right-[5%] lg:right-[10%] bottom-0 z-10 transform rotate-3 hover:rotate-0 transition-transform duration-500">
            <div className="relative">
              {/* Tablet Frame */}
              <div className="w-[160px] md:w-[200px] lg:w-[240px] bg-gray-900 rounded-[16px] p-2 shadow-2xl shadow-black/50 border border-gray-700">
                {/* Camera */}
                <div className="absolute top-3 left-1/2 -translate-x-1/2 w-2 h-2 bg-gray-700 rounded-full" />
                {/* Screen */}
                <div className="bg-suite-bg rounded-[12px] overflow-hidden aspect-[3/4]">
                  {/* Content */}
                  <div className="p-3 h-full">
                    {/* Header */}
                    <div className="flex items-center justify-between mb-3">
                      <div className="text-[8px] font-bold text-suite-orange">Formation</div>
                      <div className="text-[6px] text-suite-gray">Module 1</div>
                    </div>
                    {/* Video placeholder */}
                    <div className="bg-gradient-to-br from-suite-blue/30 to-suite-orange/30 rounded-lg aspect-video mb-3 flex items-center justify-center">
                      <div className="w-8 h-8 md:w-10 md:h-10 rounded-full bg-white/20 flex items-center justify-center">
                        <div className="w-0 h-0 border-t-[6px] border-t-transparent border-l-[10px] border-l-white border-b-[6px] border-b-transparent ml-1" />
                      </div>
                    </div>
                    {/* Title */}
                    <div className="text-[8px] md:text-[10px] font-bold text-white mb-2">Introduction à Amazon FBA</div>
                    <div className="text-[6px] md:text-[7px] text-suite-gray mb-3">Durée : 15 min</div>
                    {/* Progress */}
                    <div className="bg-white/10 rounded-full h-1.5 mb-2">
                      <div className="bg-suite-orange h-full rounded-full w-1/3" />
                    </div>
                    <div className="text-[5px] md:text-[6px] text-suite-gray">33% complété</div>
                    {/* CTA */}
                    <div className="mt-3">
                      <div className="bg-suite-orange text-white text-[6px] md:text-[7px] font-medium py-1.5 px-3 rounded text-center">
                        Continuer
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              {/* Tablet label */}
              <div className="absolute -bottom-8 left-1/2 -translate-x-1/2 flex items-center gap-1 text-suite-gray text-xs">
                <Tablet className="w-3 h-3" />
                <span>Tablette</span>
              </div>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
};

export default SuiteMockups;
