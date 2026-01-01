import { 
  Crown, 
  Package, 
  TrendingUp, 
  MessageCircle, 
  Bell, 
  Settings, 
  BookOpen, 
  Truck, 
  ShoppingCart,
  Sparkles,
  Users,
  BarChart3,
  ExternalLink,
  ArrowUpRight,
  Check,
  Clock,
  Star
} from 'lucide-react';

const HomeDashboardPreview = () => {
  const categories = [
    { icon: BookOpen, label: "Introduction", count: 3, color: "from-secondary to-blue-600" },
    { icon: Settings, label: "Outils", count: 2, color: "from-purple-500 to-purple-600" },
    { icon: Sparkles, label: "Produits Gagnants", count: 12, color: "from-primary to-primary-glow" },
    { icon: Truck, label: "Expédition", count: 1, color: "from-green-500 to-green-600" },
    { icon: Bell, label: "Informations", count: 5, color: "from-cyan-500 to-cyan-600" },
    { icon: MessageCircle, label: "Communauté", count: 8, color: "from-pink-500 to-pink-600" },
    { icon: ShoppingCart, label: "Marketplace", count: 4, color: "from-indigo-500 to-indigo-600" },
    { icon: Package, label: "Gestion Produits", count: 2, color: "from-teal-500 to-teal-600" },
  ];

  const recentProducts = [
    { ean: "3614272049529", profit: "+8.45€", roi: "32%", status: "hot" },
    { ean: "5011321868687", profit: "+12.30€", roi: "45%", status: "new" },
    { ean: "4005900612878", profit: "+6.20€", roi: "28%", status: "normal" },
  ];

  const stats = [
    { label: "Produits cette semaine", value: "47", icon: Package, trend: "+12" },
    { label: "ROI moyen", value: "34%", icon: TrendingUp, trend: "+5%" },
    { label: "Membres actifs", value: "500+", icon: Users, trend: null },
  ];

  return (
    <section className="py-20 relative overflow-hidden">
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary/5 rounded-full blur-3xl" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-secondary/5 rounded-full blur-3xl" />
      </div>

      <div className="container mx-auto px-4 relative">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Ton espace membre
          </h2>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            Un dashboard complet avec tous les outils et produits pour réussir sur Amazon FBA
          </p>
        </div>

        <div className="relative max-w-7xl mx-auto">
          <div className="absolute -inset-4 bg-gradient-to-r from-primary/10 via-secondary/10 to-primary/10 rounded-3xl blur-2xl opacity-50" />
          
          <div className="relative bg-card border border-border rounded-3xl overflow-hidden shadow-2xl">
            <div className="bg-gradient-to-r from-primary/10 to-secondary/10 px-6 py-4 border-b border-border flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary to-secondary flex items-center justify-center">
                  <Crown className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h3 className="font-bold text-foreground">Espace VIP</h3>
                  <p className="text-xs text-muted-foreground">AMZing FBA Dashboard</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-green-500 animate-pulse" />
                <span className="text-xs text-green-600">Connecté</span>
              </div>
            </div>

            <div className="p-6 lg:p-8">
              <div className="grid grid-cols-3 gap-4 mb-8">
                {stats.map((stat, index) => (
                  <div 
                    key={index}
                    className="bg-muted/50 rounded-xl p-4 border border-border/50 hover:border-primary/30 transition-all group"
                  >
                    <div className="flex items-center justify-between mb-2">
                      <stat.icon className="w-5 h-5 text-primary group-hover:scale-110 transition-transform" />
                      {stat.trend && (
                        <span className="text-xs text-green-600 flex items-center gap-1">
                          <ArrowUpRight className="w-3 h-3" />
                          {stat.trend}
                        </span>
                      )}
                    </div>
                    <p className="text-2xl font-bold text-foreground">{stat.value}</p>
                    <p className="text-xs text-muted-foreground">{stat.label}</p>
                  </div>
                ))}
              </div>

              <div className="grid lg:grid-cols-3 gap-6">
                <div className="lg:col-span-2 space-y-3">
                  <h4 className="text-sm font-semibold text-muted-foreground mb-4 flex items-center gap-2">
                    <BarChart3 className="w-4 h-4" />
                    Catégories
                  </h4>
                  <div className="grid grid-cols-2 gap-3">
                    {categories.map((cat, index) => (
                      <div 
                        key={index}
                        className="group bg-muted/30 hover:bg-muted/50 rounded-xl p-4 border border-border/50 hover:border-primary/30 transition-all cursor-pointer"
                      >
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-3">
                            <div className={`w-10 h-10 rounded-lg bg-gradient-to-br ${cat.color} flex items-center justify-center shadow-lg`}>
                              <cat.icon className="w-5 h-5 text-white" />
                            </div>
                            <span className="font-medium text-foreground group-hover:text-primary transition-colors">
                              {cat.label}
                            </span>
                          </div>
                          {cat.count > 0 && (
                            <div className="bg-primary/20 text-primary text-xs font-bold px-2 py-1 rounded-full">
                              {cat.count}
                            </div>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="space-y-3">
                  <h4 className="text-sm font-semibold text-muted-foreground mb-4 flex items-center gap-2">
                    <Sparkles className="w-4 h-4" />
                    Derniers produits
                  </h4>
                  <div className="space-y-2">
                    {recentProducts.map((product, index) => (
                      <div 
                        key={index}
                        className="group bg-muted/30 hover:bg-muted/50 rounded-xl p-4 border border-border/50 hover:border-green-500/30 transition-all cursor-pointer"
                      >
                        <div className="flex items-center justify-between mb-2">
                          <div className="flex items-center gap-2">
                            <code className="text-xs text-muted-foreground font-mono">
                              {product.ean.slice(0, 6)}...
                            </code>
                            {product.status === "hot" && (
                              <span className="bg-red-500/20 text-red-500 text-xs px-2 py-0.5 rounded-full animate-pulse">
                                🔥 HOT
                              </span>
                            )}
                            {product.status === "new" && (
                              <span className="bg-secondary/20 text-secondary text-xs px-2 py-0.5 rounded-full">
                                NEW
                              </span>
                            )}
                          </div>
                          <ExternalLink className="w-4 h-4 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity" />
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-green-600 font-bold">{product.profit}</span>
                          <span className="text-muted-foreground text-sm">ROI {product.roi}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                  
                  <button className="w-full bg-primary/10 hover:bg-primary/20 text-primary text-sm font-medium py-3 rounded-xl transition-all flex items-center justify-center gap-2 group">
                    Voir tous les produits
                    <ArrowUpRight className="w-4 h-4 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
                  </button>
                </div>
              </div>

              <div className="mt-8 pt-6 border-t border-border">
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  {[
                    { icon: Check, text: "Produits vérifiés", color: "text-green-500" },
                    { icon: Clock, text: "Màj quotidienne", color: "text-secondary" },
                    { icon: Star, text: "Support 9h-19h", color: "text-yellow-500" },
                    { icon: Users, text: "Communauté active", color: "text-purple-500" },
                  ].map((feature, index) => (
                    <div key={index} className="flex items-center gap-2 text-sm">
                      <feature.icon className={`w-4 h-4 ${feature.color}`} />
                      <span className="text-muted-foreground">{feature.text}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          <div className="absolute -top-4 -right-4 bg-gradient-to-r from-green-500 to-emerald-500 text-white text-sm font-bold px-4 py-2 rounded-full shadow-lg animate-bounce">
            47 nouveaux produits
          </div>
          <div className="absolute -bottom-4 -left-4 bg-gradient-to-r from-primary to-primary-glow text-white text-sm font-bold px-4 py-2 rounded-full shadow-lg">
            🔥 ROI moyen 34%
          </div>
        </div>
      </div>
    </section>
  );
};

export default HomeDashboardPreview;
