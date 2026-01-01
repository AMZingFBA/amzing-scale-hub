import { Monitor, Tablet, Smartphone, ArrowRight } from 'lucide-react';

const SuiteMockups = () => {
  return (
    <section className="py-20 lg:py-28 relative overflow-hidden">
      {/* Background style Index */}
      <div className="absolute inset-0 bg-gradient-to-r from-primary/20 via-secondary/10 to-primary/20" />
      <div className="absolute top-0 left-1/4 w-64 h-64 bg-primary/20 rounded-full blur-3xl animate-pulse" />
      <div className="absolute bottom-0 right-1/4 w-48 h-48 bg-secondary/20 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }} />
      
      <div className="relative max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 z-10">
        <div className="text-center mb-12">
          <div className="inline-block mb-4 bg-primary/10 text-primary border border-primary/20 px-3 py-1 rounded-full text-sm font-medium">
            📱 Multi-plateforme
          </div>
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
            Accessible sur <span className="text-primary">tous tes appareils</span>
          </h2>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            Accède à AMZing FBA depuis ton ordinateur, ta tablette ou ton smartphone. Tes outils te suivent partout.
          </p>
        </div>

        {/* Mockups Container */}
        <div className="relative md:flex md:justify-center md:items-end md:h-[420px] lg:h-[480px]">
          
          {/* Mobile Layout: All 3 devices stacked */}
          <div className="md:hidden flex flex-col items-center gap-8">
            
            {/* Laptop Mockup - Mobile */}
            <div className="relative group">
              <div className="absolute inset-0 bg-gradient-to-r from-primary to-primary-glow rounded-2xl blur-lg opacity-50 group-hover:opacity-80 transition-opacity" />
              <div className="relative">
                <div className="w-[280px] bg-card rounded-t-lg p-1.5 border-t border-x border-border">
                  <div className="bg-background rounded-md overflow-hidden aspect-[16/10]">
                    <div className="bg-muted px-2 py-1 flex items-center gap-2">
                      <div className="flex gap-1">
                        <div className="w-1.5 h-1.5 rounded-full bg-red-500" />
                        <div className="w-1.5 h-1.5 rounded-full bg-yellow-500" />
                        <div className="w-1.5 h-1.5 rounded-full bg-green-500" />
                      </div>
                      <div className="flex-1 bg-card rounded text-[6px] text-muted-foreground px-2 py-0.5 text-center">
                        app.amzingfba.com
                      </div>
                    </div>
                    <div className="p-2">
                      <div className="text-[8px] font-bold text-foreground mb-2">Bienvenue sur AMZing FBA</div>
                      <div className="grid grid-cols-3 gap-1">
                        <div className="bg-primary/20 border border-primary/30 rounded p-1 text-center">
                          <div className="text-[10px] font-bold text-primary">127</div>
                          <div className="text-[5px] text-muted-foreground">Produits</div>
                        </div>
                        <div className="bg-secondary/20 border border-secondary/30 rounded p-1 text-center">
                          <div className="text-[10px] font-bold text-secondary">45%</div>
                          <div className="text-[5px] text-muted-foreground">ROI</div>
                        </div>
                        <div className="bg-green-500/20 border border-green-500/30 rounded p-1 text-center">
                          <div className="text-[10px] font-bold text-green-400">24</div>
                          <div className="text-[5px] text-muted-foreground">Fournisseurs</div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="w-[310px] h-2 bg-muted rounded-b-xl mx-auto border-b border-x border-border" />
                <div className="w-[80px] h-1 bg-card rounded-b mx-auto" />
                <div className="mt-3 flex items-center justify-center gap-1 text-muted-foreground text-xs">
                  <Monitor className="w-3 h-3" />
                  <span>Desktop</span>
                </div>
              </div>
            </div>

            {/* Phone & Tablet side by side on mobile */}
            <div className="flex gap-4 items-end">
              {/* Phone Mockup - Mobile */}
              <div className="relative group">
                <div className="absolute inset-0 bg-gradient-to-r from-secondary to-accent rounded-2xl blur-lg opacity-50 group-hover:opacity-80 transition-opacity" />
                <div className="relative">
                  <div className="w-[100px] bg-card rounded-[16px] p-1.5 shadow-lg border border-border">
                    <div className="absolute top-2.5 left-1/2 -translate-x-1/2 w-10 h-3 bg-background rounded-full z-10" />
                    <div className="bg-background rounded-[12px] overflow-hidden aspect-[9/19]">
                      <div className="p-2 h-full flex flex-col">
                        <div className="flex items-center justify-between mb-2 pt-3">
                          <div className="text-[6px] font-bold text-primary">AMZing FBA</div>
                          <div className="w-3 h-3 rounded-full bg-primary/20" />
                        </div>
                        <div className="space-y-1.5 flex-1">
                          <div className="bg-secondary/20 border border-secondary/30 rounded p-1.5">
                            <div className="text-[5px] text-foreground font-medium">Module 1</div>
                          </div>
                          <div className="bg-card border border-border rounded p-1.5">
                            <div className="text-[5px] text-foreground font-medium">Module 2</div>
                          </div>
                          <div className="bg-card border border-border rounded p-1.5">
                            <div className="text-[5px] text-foreground font-medium">Module 3</div>
                          </div>
                          <div className="bg-card border border-border rounded p-1.5">
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
              </div>

              {/* Tablet Mockup - Mobile */}
              <div className="relative group">
                <div className="absolute inset-0 bg-gradient-to-r from-purple-500 to-purple-600 rounded-2xl blur-lg opacity-50 group-hover:opacity-80 transition-opacity" />
                <div className="relative">
                  <div className="w-[120px] bg-card rounded-[12px] p-1.5 shadow-lg border border-border">
                    <div className="absolute top-2 left-1/2 -translate-x-1/2 w-1.5 h-1.5 bg-muted rounded-full" />
                    <div className="bg-background rounded-[8px] overflow-hidden aspect-[3/4]">
                      <div className="p-2 h-full">
                        <div className="flex items-center justify-between mb-2">
                          <div className="text-[6px] font-bold text-primary">Formation</div>
                        </div>
                        <div className="bg-gradient-to-br from-secondary/30 to-primary/30 border border-secondary/30 rounded aspect-video mb-2 flex items-center justify-center">
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
          </div>

          {/* Desktop Layout: Three devices with absolute positioning */}
          {/* Phone Mockup - Left */}
          <div className="hidden md:block absolute left-[5%] lg:left-[10%] bottom-0 z-30 transform -rotate-3 hover:rotate-0 transition-transform duration-500">
            <div className="relative group">
              <div className="absolute inset-0 bg-gradient-to-r from-secondary to-accent rounded-[24px] blur-lg opacity-50 group-hover:opacity-80 transition-opacity" />
              {/* Phone Frame */}
              <div className="relative w-[180px] lg:w-[200px] bg-card rounded-[24px] p-2 shadow-2xl border-2 border-secondary/30 hover:border-secondary transition-colors">
                {/* Notch */}
                <div className="absolute top-4 left-1/2 -translate-x-1/2 w-16 h-5 bg-background rounded-full z-10" />
                {/* Screen */}
                <div className="bg-background rounded-[18px] overflow-hidden aspect-[9/19]">
                  {/* App Content */}
                  <div className="p-3 h-full flex flex-col">
                    {/* Header */}
                    <div className="flex items-center justify-between mb-3 pt-4">
                      <div className="text-[8px] font-bold text-primary">AMZing FBA</div>
                      <div className="w-4 h-4 rounded-full bg-primary/20" />
                    </div>
                    {/* Menu Items */}
                    <div className="space-y-2 flex-1">
                      <div className="bg-secondary/20 border border-secondary/30 rounded-lg p-2">
                        <div className="text-[6px] text-foreground font-medium">Module 1 : Introduction</div>
                        <div className="text-[5px] text-muted-foreground mt-1">4 leçons • 45 min</div>
                      </div>
                      <div className="bg-card border border-border rounded-lg p-2">
                        <div className="text-[6px] text-foreground font-medium">Module 2 : Trouver des produits</div>
                        <div className="text-[5px] text-muted-foreground mt-1">6 leçons • 1h20</div>
                      </div>
                      <div className="bg-card border border-border rounded-lg p-2">
                        <div className="text-[6px] text-foreground font-medium">Module 3 : Analyse ROI</div>
                        <div className="text-[5px] text-muted-foreground mt-1">5 leçons • 55 min</div>
                      </div>
                      <div className="bg-card border border-border rounded-lg p-2">
                        <div className="text-[6px] text-foreground font-medium">Module 4 : Fournisseurs</div>
                        <div className="text-[5px] text-muted-foreground mt-1">4 leçons • 50 min</div>
                      </div>
                      <div className="bg-card border border-border rounded-lg p-2">
                        <div className="text-[6px] text-foreground font-medium">Module 5 : Lancement</div>
                        <div className="text-[5px] text-muted-foreground mt-1">7 leçons • 1h30</div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              {/* Phone label */}
              <div className="absolute -bottom-8 left-1/2 -translate-x-1/2 flex items-center gap-1 text-muted-foreground text-xs">
                <Smartphone className="w-3 h-3" />
                <span>Mobile</span>
              </div>
            </div>
          </div>

          {/* Laptop Mockup - Center */}
          <div className="hidden md:block relative z-20 transform hover:scale-105 transition-transform duration-500">
            <div className="relative group">
              <div className="absolute inset-0 bg-gradient-to-r from-primary to-primary-glow rounded-2xl blur-lg opacity-50 group-hover:opacity-80 transition-opacity" />
              {/* Screen */}
              <div className="relative w-[400px] lg:w-[500px] bg-card rounded-t-lg p-2 border-t-2 border-x-2 border-primary/30 hover:border-primary transition-colors">
                <div className="bg-background rounded-md overflow-hidden aspect-[16/10]">
                  {/* Browser chrome */}
                  <div className="bg-muted px-3 py-1.5 flex items-center gap-2">
                    <div className="flex gap-1">
                      <div className="w-2 h-2 rounded-full bg-red-500" />
                      <div className="w-2 h-2 rounded-full bg-yellow-500" />
                      <div className="w-2 h-2 rounded-full bg-green-500" />
                    </div>
                    <div className="flex-1 bg-card rounded text-[8px] text-muted-foreground px-2 py-0.5 text-center">
                      app.amzingfba.com
                    </div>
                  </div>
                  {/* Dashboard Content */}
                  <div className="p-4">
                    <div className="flex gap-3">
                      {/* Sidebar */}
                      <div className="w-1/4 space-y-2">
                        <div className="bg-primary/20 border border-primary/30 rounded p-2 text-[7px] text-foreground">Dashboard</div>
                        <div className="bg-card border border-border rounded p-2 text-[7px] text-muted-foreground">Produits</div>
                        <div className="bg-card border border-border rounded p-2 text-[7px] text-muted-foreground">Formation</div>
                        <div className="bg-card border border-border rounded p-2 text-[7px] text-muted-foreground">Fournisseurs</div>
                        <div className="bg-card border border-border rounded p-2 text-[7px] text-muted-foreground">Communauté</div>
                      </div>
                      {/* Main content */}
                      <div className="flex-1 space-y-3">
                        <div className="text-[10px] font-bold text-foreground">Bienvenue sur AMZing FBA</div>
                        {/* Stats cards */}
                        <div className="grid grid-cols-3 gap-2">
                          <div className="bg-primary/20 border border-primary/30 rounded p-2 text-center">
                            <div className="text-sm font-bold text-primary">127</div>
                            <div className="text-[7px] text-muted-foreground">Produits</div>
                          </div>
                          <div className="bg-secondary/20 border border-secondary/30 rounded p-2 text-center">
                            <div className="text-sm font-bold text-secondary">45%</div>
                            <div className="text-[7px] text-muted-foreground">ROI Moyen</div>
                          </div>
                          <div className="bg-green-500/20 border border-green-500/30 rounded p-2 text-center">
                            <div className="text-sm font-bold text-green-400">24</div>
                            <div className="text-[7px] text-muted-foreground">Fournisseurs</div>
                          </div>
                        </div>
                        {/* Recent products */}
                        <div className="bg-card border border-border rounded p-2">
                          <div className="text-[8px] text-foreground mb-2">Derniers produits ajoutés</div>
                          <div className="space-y-1">
                            <div className="flex justify-between text-[6px]">
                              <span className="text-muted-foreground">Produit électronique</span>
                              <span className="text-green-400">+52% ROI</span>
                            </div>
                            <div className="flex justify-between text-[6px]">
                              <span className="text-muted-foreground">Accessoire maison</span>
                              <span className="text-green-400">+38% ROI</span>
                            </div>
                            <div className="flex justify-between text-[6px]">
                              <span className="text-muted-foreground">Article sport</span>
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
              <div className="w-[460px] lg:w-[560px] h-4 bg-muted rounded-b-xl mx-auto border-b-2 border-x-2 border-primary/30" />
              <div className="w-[140px] lg:w-[160px] h-1 bg-card rounded-b mx-auto" />
              {/* Laptop label */}
              <div className="absolute -bottom-10 left-1/2 -translate-x-1/2 flex items-center gap-1.5 text-muted-foreground text-sm">
                <Monitor className="w-4 h-4" />
                <span>Desktop</span>
              </div>
            </div>
          </div>

          {/* Tablet Mockup - Right */}
          <div className="hidden md:block absolute right-[5%] lg:right-[10%] bottom-0 z-10 transform rotate-3 hover:rotate-0 transition-transform duration-500">
            <div className="relative group">
              <div className="absolute inset-0 bg-gradient-to-r from-purple-500 to-purple-600 rounded-[16px] blur-lg opacity-50 group-hover:opacity-80 transition-opacity" />
              {/* Tablet Frame */}
              <div className="relative w-[200px] lg:w-[240px] bg-card rounded-[16px] p-2 shadow-2xl border-2 border-purple-500/30 hover:border-purple-500 transition-colors">
                {/* Camera */}
                <div className="absolute top-3 left-1/2 -translate-x-1/2 w-2 h-2 bg-muted rounded-full" />
                {/* Screen */}
                <div className="bg-background rounded-[12px] overflow-hidden aspect-[3/4]">
                  {/* Content */}
                  <div className="p-3 h-full">
                    {/* Header */}
                    <div className="flex items-center justify-between mb-3">
                      <div className="text-[8px] font-bold text-primary">Formation</div>
                      <div className="text-[6px] text-muted-foreground">Module 1</div>
                    </div>
                    {/* Video placeholder */}
                    <div className="bg-gradient-to-br from-secondary/30 to-primary/30 border border-secondary/30 rounded-lg aspect-video mb-3 flex items-center justify-center">
                      <div className="w-10 h-10 rounded-full bg-foreground/20 flex items-center justify-center">
                        <div className="w-0 h-0 border-t-[6px] border-t-transparent border-l-[10px] border-l-foreground border-b-[6px] border-b-transparent ml-1" />
                      </div>
                    </div>
                    {/* Title */}
                    <div className="text-[10px] font-bold text-foreground mb-2">Introduction à Amazon FBA</div>
                    <div className="text-[7px] text-muted-foreground mb-3">Durée : 15 min</div>
                    {/* Progress */}
                    <div className="bg-muted rounded-full h-1.5 mb-2">
                      <div className="bg-primary h-full rounded-full w-1/3" />
                    </div>
                    <div className="text-[6px] text-muted-foreground">33% complété</div>
                    {/* CTA */}
                    <div className="mt-3">
                      <div className="bg-primary text-primary-foreground text-[7px] font-medium py-1.5 px-3 rounded text-center">
                        Continuer
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              {/* Tablet label */}
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

export default SuiteMockups;
