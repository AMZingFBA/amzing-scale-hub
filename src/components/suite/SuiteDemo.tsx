import { Monitor, BarChart3, ShoppingBag, Crown, Package, TrendingUp, Users, Sparkles, BookOpen, MessageCircle, ExternalLink, ArrowRight } from 'lucide-react';

const SuiteDemo = () => {
  const screenshots = [
    {
      icon: Monitor,
      title: "Dashboard",
      description: "Vue d'ensemble de tes KPIs",
      content: "dashboard",
      color: "from-primary to-primary-glow",
      borderColor: "border-primary/30 hover:border-primary"
    },
    {
      icon: BarChart3,
      title: "Moniteur ROI",
      description: "Analyse rentabilité produits",
      content: "monitor",
      color: "from-green-500 to-green-600",
      borderColor: "border-green-500/30 hover:border-green-500"
    },
    {
      icon: ShoppingBag,
      title: "Catalogue",
      description: "Fournisseurs et deals",
      content: "catalogue",
      color: "from-secondary to-accent",
      borderColor: "border-secondary/30 hover:border-secondary"
    }
  ];

  const renderDashboardContent = () => (
    <div className="p-4 space-y-3">
      {/* Header */}
      <div className="flex items-center gap-2">
        <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-primary to-primary-glow flex items-center justify-center">
          <Crown className="w-4 h-4 text-white" />
        </div>
        <span className="text-foreground text-sm font-medium">Espace VIP</span>
      </div>
      {/* Stats */}
      <div className="grid grid-cols-3 gap-2">
        <div className="bg-primary/10 border border-primary/20 rounded-lg p-2 text-center">
          <Package className="w-4 h-4 text-primary mx-auto mb-1" />
          <p className="text-foreground text-sm font-bold">47</p>
        </div>
        <div className="bg-green-500/10 border border-green-500/20 rounded-lg p-2 text-center">
          <TrendingUp className="w-4 h-4 text-green-400 mx-auto mb-1" />
          <p className="text-foreground text-sm font-bold">34%</p>
        </div>
        <div className="bg-blue-500/10 border border-blue-500/20 rounded-lg p-2 text-center">
          <Users className="w-4 h-4 text-blue-400 mx-auto mb-1" />
          <p className="text-foreground text-sm font-bold">500+</p>
        </div>
      </div>
      {/* Categories */}
      <div className="space-y-2">
        {[
          { icon: BookOpen, label: "Introduction", color: "text-blue-400", bg: "bg-blue-500/10 border-blue-500/20" },
          { icon: Sparkles, label: "Produits Gagnants", color: "text-primary", badge: 12, bg: "bg-primary/10 border-primary/20" },
          { icon: MessageCircle, label: "Communauté", color: "text-pink-400", badge: 8, bg: "bg-pink-500/10 border-pink-500/20" },
        ].map((cat, i) => (
          <div key={i} className={`flex items-center justify-between ${cat.bg} border rounded-lg px-3 py-2`}>
            <div className="flex items-center gap-2">
              <cat.icon className={`w-4 h-4 ${cat.color}`} />
              <span className="text-foreground/80 text-xs">{cat.label}</span>
            </div>
            {cat.badge && (
              <span className="bg-primary/20 text-primary text-xs px-2 py-0.5 rounded-full font-medium">{cat.badge}</span>
            )}
          </div>
        ))}
      </div>
    </div>
  );

  const renderMonitorContent = () => (
    <div className="p-4 space-y-3">
      {/* Header */}
      <div className="flex items-center justify-between">
        <span className="text-foreground text-sm font-medium">Produits rentables</span>
        <span className="text-green-400 text-xs flex items-center gap-1">
          <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
          Live
        </span>
      </div>
      {/* Products */}
      <div className="space-y-2">
        {[
          { profit: "+8.45€", roi: "32%", hot: true },
          { profit: "+12.30€", roi: "45%", hot: false },
          { profit: "+6.20€", roi: "28%", hot: false },
          { profit: "+15.80€", roi: "52%", hot: true },
        ].map((product, i) => (
          <div key={i} className="flex items-center justify-between bg-card/50 border border-border/50 rounded-lg px-3 py-2 hover:border-green-500/50 transition-colors">
            <div className="flex items-center gap-2">
              <span className="text-green-400 font-semibold text-sm">{product.profit}</span>
              {product.hot && <span className="text-xs">🔥</span>}
            </div>
            <span className="text-muted-foreground text-xs">ROI {product.roi}</span>
          </div>
        ))}
      </div>
      {/* Chart placeholder */}
      <div className="bg-card/50 border border-border/50 rounded-lg p-3 h-14 flex items-end justify-between gap-1">
        {[40, 65, 45, 80, 55, 70, 90].map((h, i) => (
          <div key={i} className="flex-1 bg-gradient-to-t from-green-500/50 to-green-400 rounded-t" style={{ height: `${h}%` }} />
        ))}
      </div>
    </div>
  );

  const renderCatalogueContent = () => (
    <div className="p-4 space-y-3">
      {/* Header */}
      <div className="flex items-center justify-between">
        <span className="text-foreground text-sm font-medium">Fournisseurs</span>
        <ExternalLink className="w-4 h-4 text-muted-foreground" />
      </div>
      {/* Suppliers */}
      <div className="space-y-2">
        {[
          { name: "Qogita", deals: 47, color: "from-primary/20 to-transparent", border: "border-primary/30" },
          { name: "Eany", deals: 23, color: "from-blue-500/20 to-transparent", border: "border-blue-500/30" },
          { name: "Grossistes FR", deals: 15, color: "from-green-500/20 to-transparent", border: "border-green-500/30" },
        ].map((supplier, i) => (
          <div key={i} className={`bg-gradient-to-r ${supplier.color} border ${supplier.border} rounded-lg px-3 py-2.5 hover:scale-[1.02] transition-transform cursor-pointer`}>
            <div className="flex items-center justify-between">
              <span className="text-foreground text-sm font-medium">{supplier.name}</span>
              <span className="text-primary text-xs font-medium">{supplier.deals} deals</span>
            </div>
          </div>
        ))}
      </div>
      {/* Tags */}
      <div className="flex flex-wrap gap-1.5">
        {["Beauty", "Tech", "Maison", "Sport"].map((tag, i) => (
          <span key={i} className="bg-card/50 border border-border/50 text-muted-foreground text-xs px-2.5 py-1 rounded-full">{tag}</span>
        ))}
      </div>
    </div>
  );

  return (
    <section className="py-20 lg:py-28 relative overflow-hidden">
      {/* Background style Index */}
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-muted/30 to-transparent" />
      <div className="absolute top-1/3 right-1/4 w-64 h-64 bg-secondary/20 rounded-full blur-3xl animate-pulse" />
      <div className="absolute bottom-1/3 left-1/4 w-48 h-48 bg-primary/20 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }} />
      
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="text-center mb-12">
          <div className="inline-block mb-4 bg-secondary/10 text-secondary border border-secondary/20 px-3 py-1 rounded-full text-sm font-medium">
            🖥️ Interface intuitive
          </div>
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
            Aperçu de la plateforme
          </h2>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            Découvre l{"'"}interface et les fonctionnalités en action.
          </p>
        </div>

        {/* Screenshots grid - Style cartes Index */}
        <div className="grid md:grid-cols-3 gap-6">
          {screenshots.map((item, index) => (
            <div
              key={index}
              className="group relative"
            >
              {/* Glow effect */}
              <div className={`absolute inset-0 bg-gradient-to-r ${item.color} rounded-2xl blur-lg opacity-50 group-hover:opacity-80 transition-opacity`} />
              
              <div className={`relative bg-background/90 backdrop-blur border-2 ${item.borderColor} rounded-2xl overflow-hidden shadow-lg hover:scale-[1.02] transition-all duration-300`}>
                {/* Real content */}
                <div className="aspect-video bg-gradient-to-br from-card to-muted/50 relative overflow-hidden">
                  {item.content === "dashboard" && renderDashboardContent()}
                  {item.content === "monitor" && renderMonitorContent()}
                  {item.content === "catalogue" && renderCatalogueContent()}
                </div>
                
                {/* Caption */}
                <div className="p-4 border-t border-border/50">
                  <div className="flex items-center gap-3">
                    <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${item.color} flex items-center justify-center group-hover:rotate-6 transition-transform`}>
                      <item.icon className="w-5 h-5 text-white" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-foreground">{item.title}</h3>
                      <p className="text-sm text-muted-foreground">{item.description}</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default SuiteDemo;
