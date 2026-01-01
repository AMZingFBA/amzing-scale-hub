import { Monitor, Tablet, Smartphone } from 'lucide-react';

const HomeMockups = () => {
  return (
    <section className="py-20 relative overflow-hidden bg-muted/30">
      <div className="absolute inset-0 bg-gradient-to-b from-primary/5 via-secondary/5 to-transparent" />
      
      <div className="relative container mx-auto px-4">
        <div className="text-center mb-2">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Accessible sur <span className="text-primary">tous tes appareils</span>
          </h2>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            Accède à AMZing FBA depuis ton ordinateur, ta tablette ou ton smartphone. Tes outils te suivent partout.
          </p>
        </div>

        <div className="relative md:flex md:justify-center md:items-end md:h-[420px] lg:h-[480px]">
          
          {/* Mobile Layout */}
          <div className="md:hidden flex flex-col items-center gap-8">
            
            {/* Laptop Mockup - Mobile */}
            <div className="relative">
              <div className="w-[280px] bg-gray-800 rounded-t-lg p-1.5 border-t border-x border-gray-600">
                <div className="bg-background rounded-md overflow-hidden aspect-[16/10]">
                  <div className="bg-muted px-2 py-1 flex items-center gap-2">
                    <div className="flex gap-1">
                      <div className="w-1.5 h-1.5 rounded-full bg-red-500" />
                      <div className="w-1.5 h-1.5 rounded-full bg-yellow-500" />
                      <div className="w-1.5 h-1.5 rounded-full bg-green-500" />
                    </div>
                    <div className="flex-1 bg-muted-foreground/20 rounded text-[6px] text-muted-foreground px-2 py-0.5 text-center">
                      app.amzingfba.com
                    </div>
                  </div>
                  <div className="p-2">
                    <div className="text-[8px] font-bold text-foreground mb-2">Bienvenue sur AMZing FBA</div>
                    <div className="grid grid-cols-3 gap-1">
                      <div className="bg-primary/20 rounded p-1 text-center">
                        <div className="text-[10px] font-bold text-primary">127</div>
                        <div className="text-[5px] text-muted-foreground">Produits</div>
                      </div>
                      <div className="bg-secondary/20 rounded p-1 text-center">
                        <div className="text-[10px] font-bold text-secondary">45%</div>
                        <div className="text-[5px] text-muted-foreground">ROI</div>
                      </div>
                      <div className="bg-green-500/20 rounded p-1 text-center">
                        <div className="text-[10px] font-bold text-green-500">24</div>
                        <div className="text-[5px] text-muted-foreground">Fournisseurs</div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="w-[310px] h-2 bg-gray-700 rounded-b-xl mx-auto border-b border-x border-gray-600" />
              <div className="w-[80px] h-1 bg-gray-600 rounded-b mx-auto" />
              <div className="mt-3 flex items-center justify-center gap-1 text-muted-foreground text-xs">
                <Monitor className="w-3 h-3" />
                <span>Desktop</span>
              </div>
            </div>

            {/* Phone & Tablet side by side on mobile */}
            <div className="flex gap-4 items-end">
              {/* Phone Mockup - Mobile */}
              <div className="relative">
                <div className="w-[100px] bg-gray-800 rounded-[16px] p-1.5 shadow-lg border border-gray-600">
                  <div className="absolute top-2.5 left-1/2 -translate-x-1/2 w-10 h-3 bg-black rounded-full z-10" />
                  <div className="bg-background rounded-[12px] overflow-hidden aspect-[9/19]">
                    <div className="p-2 h-full flex flex-col">
                      <div className="flex items-center justify-between mb-2 pt-3">
                        <div className="text-[6px] font-bold text-primary">AMZing FBA</div>
                        <div className="w-3 h-3 rounded-full bg-primary/20" />
                      </div>
                      <div className="space-y-1.5 flex-1">
                        <div className="bg-secondary/20 rounded p-1.5">
                          <div className="text-[5px] text-foreground font-medium">Module 1</div>
                        </div>
                        <div className="bg-muted rounded p-1.5">
                          <div className="text-[5px] text-foreground font-medium">Module 2</div>
                        </div>
                        <div className="bg-muted rounded p-1.5">
                          <div className="text-[5px] text-foreground font-medium">Module 3</div>
                        </div>
                        <div className="bg-muted rounded p-1.5">
                          <div className="text-[5px] text-foreground font-medium">Module 4</div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="mt-2 flex items-center justify-center gap-1 text-muted-foreground text-[10px]">
                  <Smartphone className="w-2.5 h-2.5" />
                  <span>Mobile</span>
                </div>
              </div>

              {/* Tablet Mockup - Mobile */}
              <div className="relative">
                <div className="w-[120px] bg-gray-800 rounded-[12px] p-1.5 shadow-lg border border-gray-600">
                  <div className="absolute top-2 left-1/2 -translate-x-1/2 w-1.5 h-1.5 bg-gray-600 rounded-full" />
                  <div className="bg-background rounded-[8px] overflow-hidden aspect-[3/4]">
                    <div className="p-2 h-full">
                      <div className="flex items-center justify-between mb-2">
                        <div className="text-[6px] font-bold text-primary">Formation</div>
                      </div>
                      <div className="bg-gradient-to-br from-secondary/30 to-primary/30 rounded aspect-video mb-2 flex items-center justify-center">
                        <div className="w-5 h-5 rounded-full bg-foreground/20 flex items-center justify-center">
                          <div className="w-0 h-0 border-t-[4px] border-t-transparent border-l-[6px] border-l-foreground border-b-[4px] border-b-transparent ml-0.5" />
                        </div>
                      </div>
                      <div className="text-[6px] font-bold text-foreground mb-1">Introduction FBA</div>
                      <div className="bg-muted rounded-full h-1 mb-1">
                        <div className="bg-primary h-full rounded-full w-1/3" />
                      </div>
                      <div className="text-[5px] text-muted-foreground">33%</div>
                    </div>
                  </div>
                </div>
                <div className="mt-2 flex items-center justify-center gap-1 text-muted-foreground text-[10px]">
                  <Tablet className="w-2.5 h-2.5" />
                  <span>Tablette</span>
                </div>
              </div>
            </div>
          </div>

          {/* Desktop Layout */}
          {/* Phone Mockup - Left */}
          <div className="hidden md:block absolute left-[5%] lg:left-[10%] bottom-0 z-30 transform -rotate-3 hover:rotate-0 transition-transform duration-500">
            <div className="relative">
              <div className="w-[180px] lg:w-[200px] bg-gray-800 rounded-[24px] p-2 shadow-2xl shadow-black/20 border border-gray-600">
                <div className="absolute top-4 left-1/2 -translate-x-1/2 w-16 h-5 bg-black rounded-full z-10" />
                <div className="bg-background rounded-[18px] overflow-hidden aspect-[9/19]">
                  <div className="p-3 h-full flex flex-col">
                    <div className="flex items-center justify-between mb-3 pt-4">
                      <div className="text-[8px] font-bold text-primary">AMZing FBA</div>
                      <div className="w-4 h-4 rounded-full bg-primary/20" />
                    </div>
                    <div className="space-y-2 flex-1">
                      <div className="bg-secondary/20 rounded-lg p-2">
                        <div className="text-[6px] text-foreground font-medium">Module 1 : Introduction</div>
                        <div className="text-[5px] text-muted-foreground mt-1">4 leçons • 45 min</div>
                      </div>
                      <div className="bg-muted rounded-lg p-2">
                        <div className="text-[6px] text-foreground font-medium">Module 2 : Trouver des produits</div>
                        <div className="text-[5px] text-muted-foreground mt-1">6 leçons • 1h20</div>
                      </div>
                      <div className="bg-muted rounded-lg p-2">
                        <div className="text-[6px] text-foreground font-medium">Module 3 : Analyse ROI</div>
                        <div className="text-[5px] text-muted-foreground mt-1">5 leçons • 55 min</div>
                      </div>
                      <div className="bg-muted rounded-lg p-2">
                        <div className="text-[6px] text-foreground font-medium">Module 4 : Fournisseurs</div>
                        <div className="text-[5px] text-muted-foreground mt-1">4 leçons • 50 min</div>
                      </div>
                      <div className="bg-muted rounded-lg p-2">
                        <div className="text-[6px] text-foreground font-medium">Module 5 : Lancement</div>
                        <div className="text-[5px] text-muted-foreground mt-1">7 leçons • 1h30</div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="absolute -bottom-8 left-1/2 -translate-x-1/2 flex items-center gap-1 text-muted-foreground text-xs">
                <Smartphone className="w-3 h-3" />
                <span>Mobile</span>
              </div>
            </div>
          </div>

          {/* Laptop Mockup - Center */}
          <div className="hidden md:block relative z-20 transform hover:scale-105 transition-transform duration-500">
            <div className="relative">
              <div className="w-[400px] lg:w-[500px] bg-gray-800 rounded-t-lg p-2 border-t border-x border-gray-600">
                <div className="bg-background rounded-md overflow-hidden aspect-[16/10]">
                  <div className="bg-muted px-3 py-1.5 flex items-center gap-2">
                    <div className="flex gap-1">
                      <div className="w-2 h-2 rounded-full bg-red-500" />
                      <div className="w-2 h-2 rounded-full bg-yellow-500" />
                      <div className="w-2 h-2 rounded-full bg-green-500" />
                    </div>
                    <div className="flex-1 bg-muted-foreground/20 rounded text-[8px] text-muted-foreground px-2 py-0.5 text-center">
                      app.amzingfba.com
                    </div>
                  </div>
                  <div className="p-4">
                    <div className="flex gap-3">
                      <div className="w-1/4 space-y-2">
                        <div className="bg-primary/20 rounded p-2 text-[7px] text-foreground">Dashboard</div>
                        <div className="bg-muted rounded p-2 text-[7px] text-muted-foreground">Produits</div>
                        <div className="bg-muted rounded p-2 text-[7px] text-muted-foreground">Formation</div>
                        <div className="bg-muted rounded p-2 text-[7px] text-muted-foreground">Fournisseurs</div>
                        <div className="bg-muted rounded p-2 text-[7px] text-muted-foreground">Communauté</div>
                      </div>
                      <div className="flex-1 space-y-3">
                        <div className="text-[10px] font-bold text-foreground">Bienvenue sur AMZing FBA</div>
                        <div className="grid grid-cols-3 gap-2">
                          <div className="bg-primary/20 rounded p-2 text-center">
                            <div className="text-sm font-bold text-primary">127</div>
                            <div className="text-[7px] text-muted-foreground">Produits</div>
                          </div>
                          <div className="bg-secondary/20 rounded p-2 text-center">
                            <div className="text-sm font-bold text-secondary">45%</div>
                            <div className="text-[7px] text-muted-foreground">ROI Moyen</div>
                          </div>
                          <div className="bg-green-500/20 rounded p-2 text-center">
                            <div className="text-sm font-bold text-green-500">24</div>
                            <div className="text-[7px] text-muted-foreground">Fournisseurs</div>
                          </div>
                        </div>
                        <div className="bg-muted rounded p-2">
                          <div className="text-[8px] text-foreground mb-2">Derniers produits ajoutés</div>
                          <div className="space-y-1">
                            <div className="flex justify-between text-[6px]">
                              <span className="text-muted-foreground">Produit électronique</span>
                              <span className="text-green-500">+52% ROI</span>
                            </div>
                            <div className="flex justify-between text-[6px]">
                              <span className="text-muted-foreground">Accessoire maison</span>
                              <span className="text-green-500">+38% ROI</span>
                            </div>
                            <div className="flex justify-between text-[6px]">
                              <span className="text-muted-foreground">Article sport</span>
                              <span className="text-green-500">+45% ROI</span>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="w-[460px] lg:w-[560px] h-4 bg-gray-700 rounded-b-xl mx-auto border-b border-x border-gray-600" />
              <div className="w-[140px] lg:w-[160px] h-1 bg-gray-600 rounded-b mx-auto" />
              <div className="absolute -bottom-10 left-1/2 -translate-x-1/2 flex items-center gap-1.5 text-muted-foreground text-sm">
                <Monitor className="w-4 h-4" />
                <span>Desktop</span>
              </div>
            </div>
          </div>

          {/* Tablet Mockup - Right */}
          <div className="hidden md:block absolute right-[5%] lg:right-[10%] bottom-0 z-10 transform rotate-3 hover:rotate-0 transition-transform duration-500">
            <div className="relative">
              <div className="w-[200px] lg:w-[240px] bg-gray-800 rounded-[16px] p-2 shadow-2xl shadow-black/20 border border-gray-600">
                <div className="absolute top-3 left-1/2 -translate-x-1/2 w-2 h-2 bg-gray-600 rounded-full" />
                <div className="bg-background rounded-[12px] overflow-hidden aspect-[3/4]">
                  <div className="p-3 h-full">
                    <div className="flex items-center justify-between mb-3">
                      <div className="text-[8px] font-bold text-primary">Formation</div>
                      <div className="text-[6px] text-muted-foreground">Module 1</div>
                    </div>
                    <div className="bg-gradient-to-br from-secondary/30 to-primary/30 rounded-lg aspect-video mb-3 flex items-center justify-center">
                      <div className="w-10 h-10 rounded-full bg-foreground/20 flex items-center justify-center">
                        <div className="w-0 h-0 border-t-[6px] border-t-transparent border-l-[10px] border-l-foreground border-b-[6px] border-b-transparent ml-1" />
                      </div>
                    </div>
                    <div className="text-[10px] font-bold text-foreground mb-2">Introduction à Amazon FBA</div>
                    <div className="text-[7px] text-muted-foreground mb-3">Durée : 15 min</div>
                    <div className="bg-muted rounded-full h-1.5 mb-2">
                      <div className="bg-primary h-full rounded-full w-1/3" />
                    </div>
                    <div className="text-[6px] text-muted-foreground">33% complété</div>
                    <div className="mt-3">
                      <div className="bg-primary text-white text-[7px] font-medium py-1.5 px-3 rounded text-center">
                        Continuer
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="absolute -bottom-8 left-1/2 -translate-x-1/2 flex items-center gap-1 text-muted-foreground text-xs">
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

export default HomeMockups;
