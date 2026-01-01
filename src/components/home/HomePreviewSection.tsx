import { Monitor, BarChart3, ShoppingBag, Crown, Package, TrendingUp, Users, Sparkles, BookOpen, MessageCircle, ExternalLink } from 'lucide-react';

const HomePreviewSection = () => {
  const screenshots = [
    {
      icon: Monitor,
      title: "Dashboard",
      description: "Vue d'ensemble de tes KPIs",
      content: "dashboard"
    },
    {
      icon: BarChart3,
      title: "Moniteur ROI",
      description: "Analyse rentabilité produits",
      content: "monitor"
    },
    {
      icon: ShoppingBag,
      title: "Catalogue",
      description: "Fournisseurs et deals",
      content: "catalogue"
    }
  ];

  const renderDashboardContent = () => (
    <div className="p-3 space-y-3">
      <div className="flex items-center gap-2">
        <div className="w-6 h-6 rounded bg-gradient-to-br from-primary to-primary-glow flex items-center justify-center">
          <Crown className="w-3 h-3 text-white" />
        </div>
        <span className="text-foreground text-xs font-medium">Espace VIP</span>
      </div>
      <div className="grid grid-cols-3 gap-2">
        <div className="bg-primary/10 rounded p-2 text-center">
          <Package className="w-3 h-3 text-primary mx-auto mb-1" />
          <p className="text-foreground text-xs font-bold">47</p>
        </div>
        <div className="bg-green-500/10 rounded p-2 text-center">
          <TrendingUp className="w-3 h-3 text-green-500 mx-auto mb-1" />
          <p className="text-foreground text-xs font-bold">34%</p>
        </div>
        <div className="bg-secondary/10 rounded p-2 text-center">
          <Users className="w-3 h-3 text-secondary mx-auto mb-1" />
          <p className="text-foreground text-xs font-bold">500+</p>
        </div>
      </div>
      <div className="space-y-1.5">
        {[
          { icon: BookOpen, label: "Introduction", color: "text-secondary" },
          { icon: Sparkles, label: "Produits Gagnants", color: "text-primary", badge: 12 },
          { icon: MessageCircle, label: "Communauté", color: "text-pink-500", badge: 8 },
        ].map((cat, i) => (
          <div key={i} className="flex items-center justify-between bg-muted/50 rounded px-2 py-1.5">
            <div className="flex items-center gap-2">
              <cat.icon className={`w-3 h-3 ${cat.color}`} />
              <span className="text-muted-foreground text-[10px]">{cat.label}</span>
            </div>
            {cat.badge && (
              <span className="bg-primary/20 text-primary text-[9px] px-1.5 rounded-full">{cat.badge}</span>
            )}
          </div>
        ))}
      </div>
    </div>
  );

  const renderMonitorContent = () => (
    <div className="p-3 space-y-3">
      <div className="flex items-center justify-between">
        <span className="text-foreground text-xs font-medium">Produits rentables</span>
        <span className="text-green-500 text-[10px]">Live</span>
      </div>
      <div className="space-y-2">
        {[
          { profit: "+8.45€", roi: "32%", hot: true },
          { profit: "+12.30€", roi: "45%", hot: false },
          { profit: "+6.20€", roi: "28%", hot: false },
          { profit: "+15.80€", roi: "52%", hot: true },
        ].map((product, i) => (
          <div key={i} className="flex items-center justify-between bg-muted/50 rounded px-2 py-1.5">
            <div className="flex items-center gap-2">
              <span className="text-green-500 font-semibold text-xs">{product.profit}</span>
              {product.hot && <span className="text-[9px]">🔥</span>}
            </div>
            <span className="text-muted-foreground text-[10px]">ROI {product.roi}</span>
          </div>
        ))}
      </div>
      <div className="bg-muted/50 rounded p-2 h-12 flex items-end justify-between gap-1">
        {[40, 65, 45, 80, 55, 70, 90].map((h, i) => (
          <div key={i} className="flex-1 bg-gradient-to-t from-primary/50 to-primary rounded-t" style={{ height: `${h}%` }} />
        ))}
      </div>
    </div>
  );

  const renderCatalogueContent = () => (
    <div className="p-3 space-y-3">
      <div className="flex items-center justify-between">
        <span className="text-foreground text-xs font-medium">Fournisseurs</span>
        <ExternalLink className="w-3 h-3 text-muted-foreground" />
      </div>
      <div className="space-y-2">
        {[
          { name: "Qogita", deals: 47, color: "from-primary/20 to-transparent" },
          { name: "Eany", deals: 23, color: "from-secondary/20 to-transparent" },
          { name: "Grossistes FR", deals: 15, color: "from-green-500/20 to-transparent" },
        ].map((supplier, i) => (
          <div key={i} className={`bg-gradient-to-r ${supplier.color} border border-border/50 rounded px-2 py-2`}>
            <div className="flex items-center justify-between">
              <span className="text-foreground text-xs font-medium">{supplier.name}</span>
              <span className="text-primary text-[10px]">{supplier.deals} deals</span>
            </div>
          </div>
        ))}
      </div>
      <div className="flex flex-wrap gap-1">
        {["Beauty", "Tech", "Maison", "Sport"].map((tag, i) => (
          <span key={i} className="bg-muted/50 text-muted-foreground text-[9px] px-2 py-0.5 rounded-full">{tag}</span>
        ))}
      </div>
    </div>
  );

  return (
    <section className="py-20 bg-muted/30">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Aperçu de la plateforme
          </h2>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            Découvre l{"'"}interface et les fonctionnalités en action.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-6 max-w-6xl mx-auto">
          {screenshots.map((item, index) => (
            <div
              key={index}
              className="bg-card border border-border rounded-2xl overflow-hidden group hover:border-primary/30 transition-all duration-300 shadow-sm hover:shadow-lg"
            >
              <div className="aspect-video bg-gradient-to-br from-background to-muted relative overflow-hidden">
                {item.content === "dashboard" && renderDashboardContent()}
                {item.content === "monitor" && renderMonitorContent()}
                {item.content === "catalogue" && renderCatalogueContent()}
              </div>
              
              <div className="p-4">
                <h3 className="font-semibold text-foreground mb-1">{item.title}</h3>
                <p className="text-sm text-muted-foreground">{item.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default HomePreviewSection;
