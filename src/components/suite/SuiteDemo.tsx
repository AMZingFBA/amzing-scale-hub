import { Play, Monitor, BarChart3, ShoppingBag, Crown, Package, TrendingUp, Users, Sparkles, BookOpen, MessageCircle, Bell, Settings, ExternalLink  } from 'lucide-react';

const SuiteDemo = () => {
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
      {/* Header */}
      <div className="flex items-center gap-2">
        <div className="w-6 h-6 rounded bg-gradient-to-br from-suite-orange to-amber-500 flex items-center justify-center">
          <Crown className="w-3 h-3 text-white" />
        </div>
        <span className="text-white/80 text-xs font-medium">Espace VIP</span>
      </div>
      {/* Stats */}
      <div className="grid grid-cols-3 gap-2">
        <div className="bg-white/5 rounded p-2 text-center">
          <Package className="w-3 h-3 text-suite-orange mx-auto mb-1" />
          <p className="text-white text-xs font-bold">47</p>
        </div>
        <div className="bg-white/5 rounded p-2 text-center">
          <TrendingUp className="w-3 h-3 text-green-400 mx-auto mb-1" />
          <p className="text-white text-xs font-bold">34%</p>
        </div>
        <div className="bg-white/5 rounded p-2 text-center">
          <Users className="w-3 h-3 text-blue-400 mx-auto mb-1" />
          <p className="text-white text-xs font-bold">500+</p>
        </div>
      </div>
      {/* Categories */}
      <div className="space-y-1.5">
        {[
          { icon: BookOpen, label: "Introduction", color: "text-blue-400" },
          { icon: Sparkles, label: "Produits Gagnants", color: "text-suite-orange", badge: 12 },
          { icon: MessageCircle, label: "Communauté", color: "text-pink-400", badge: 8 },
        ].map((cat, i) => (
          <div key={i} className="flex items-center justify-between bg-white/5 rounded px-2 py-1.5">
            <div className="flex items-center gap-2">
              <cat.icon className={`w-3 h-3 ${cat.color}`} />
              <span className="text-white/70 text-[10px]">{cat.label}</span>
            </div>
            {cat.badge && (
              <span className="bg-suite-orange/20 text-suite-orange text-[9px] px-1.5 rounded-full">{cat.badge}</span>
            )}
          </div>
        ))}
      </div>
    </div>
  );

  const renderMonitorContent = () => (
    <div className="p-3 space-y-3">
      {/* Header */}
      <div className="flex items-center justify-between">
        <span className="text-white/80 text-xs font-medium">Produits rentables</span>
        <span className="text-green-400 text-[10px]">Live</span>
      </div>
      {/* Products */}
      <div className="space-y-2">
        {[
          { profit: "+8.45€", roi: "32%", hot: true },
          { profit: "+12.30€", roi: "45%", hot: false },
          { profit: "+6.20€", roi: "28%", hot: false },
          { profit: "+15.80€", roi: "52%", hot: true },
        ].map((product, i) => (
          <div key={i} className="flex items-center justify-between bg-white/5 rounded px-2 py-1.5">
            <div className="flex items-center gap-2">
              <span className="text-green-400 font-semibold text-xs">{product.profit}</span>
              {product.hot && <span className="text-[9px]">🔥</span>}
            </div>
            <span className="text-white/50 text-[10px]">ROI {product.roi}</span>
          </div>
        ))}
      </div>
      {/* Chart placeholder */}
      <div className="bg-white/5 rounded p-2 h-12 flex items-end justify-between gap-1">
        {[40, 65, 45, 80, 55, 70, 90].map((h, i) => (
          <div key={i} className="flex-1 bg-gradient-to-t from-suite-orange/50 to-suite-orange rounded-t" style={{ height: `${h}%` }} />
        ))}
      </div>
    </div>
  );

  const renderCatalogueContent = () => (
    <div className="p-3 space-y-3">
      {/* Header */}
      <div className="flex items-center justify-between">
        <span className="text-white/80 text-xs font-medium">Fournisseurs</span>
        <ExternalLink className="w-3 h-3 text-white/30" />
      </div>
      {/* Suppliers */}
      <div className="space-y-2">
        {[
          { name: "Qogita", deals: 47, color: "from-orange-500/20 to-transparent" },
          { name: "Eany", deals: 23, color: "from-blue-500/20 to-transparent" },
          { name: "Grossistes FR", deals: 15, color: "from-green-500/20 to-transparent" },
        ].map((supplier, i) => (
          <div key={i} className={`bg-gradient-to-r ${supplier.color} border border-white/10 rounded px-2 py-2`}>
            <div className="flex items-center justify-between">
              <span className="text-white/90 text-xs font-medium">{supplier.name}</span>
              <span className="text-suite-orange text-[10px]">{supplier.deals} deals</span>
            </div>
          </div>
        ))}
      </div>
      {/* Tags */}
      <div className="flex flex-wrap gap-1">
        {["Beauty", "Tech", "Maison", "Sport"].map((tag, i) => (
          <span key={i} className="bg-white/5 text-white/50 text-[9px] px-2 py-0.5 rounded-full">{tag}</span>
        ))}
      </div>
    </div>
  );

  return (
    <section className="py-20 lg:py-28 relative bg-gradient-to-b from-transparent via-suite-card/30 to-transparent">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
            Aperçu de la plateforme
          </h2>
          <p className="text-suite-gray text-lg max-w-2xl mx-auto">
            Découvre l{"'"}interface et les fonctionnalités en action.
          </p>
        </div>

        {/* Screenshots grid */}
        <div className="grid md:grid-cols-3 gap-6 mb-12">
          {screenshots.map((item, index) => (
            <div
              key={index}
              className="bg-suite-card border border-white/10 rounded-2xl overflow-hidden group hover:border-suite-orange/30 transition-all duration-300"
            >
              {/* Real content */}
              <div className="aspect-video bg-gradient-to-br from-[#12121a] to-[#0a0a12] relative overflow-hidden">
                {item.content === "dashboard" && renderDashboardContent()}
                {item.content === "monitor" && renderMonitorContent()}
                {item.content === "catalogue" && renderCatalogueContent()}
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
