import {
  Package,
  TrendingUp,
  Users,
  BarChart3,
  ArrowUpRight,
  Check,
  Clock,
  ShieldCheck,
  Sparkles,
  BookOpen,
  Settings,
  Truck,
  Bell,
  MessageCircle,
  ShoppingCart,
  Crown,
} from "lucide-react";
import { Link } from "react-router-dom";

const HomeDashboardPreview = () => {
  const categories = [
    { icon: BookOpen, label: "Introduction", count: 3 },
    { icon: Settings, label: "Outils", count: 2 },
    { icon: Sparkles, label: "Produits gagnants", count: 12 },
    { icon: Truck, label: "Expédition", count: 1 },
    { icon: Bell, label: "Informations", count: 5 },
    { icon: MessageCircle, label: "Communauté", count: 8 },
    { icon: ShoppingCart, label: "Marketplace", count: 4 },
    { icon: Package, label: "Gestion produits", count: 2 },
  ];

  const recentProducts = [
    { ean: "3614272049529", profit: "+8,45 €", roi: "32 %", status: "hot" as const },
    { ean: "5011321868687", profit: "+12,30 €", roi: "45 %", status: "new" as const },
    { ean: "4005900612878", profit: "+6,20 €", roi: "28 %", status: "normal" as const },
  ];

  const stats = [
    { label: "Produits cette semaine", value: "47", icon: Package, trend: "+12" },
    { label: "ROI moyen", value: "34 %", icon: TrendingUp, trend: "+5 pts" },
    { label: "Membres actifs", value: "500+", icon: Users, trend: null },
  ];

  return (
    <section className="py-20 lg:py-28 bg-white" style={{ fontFamily: "'Plus Jakarta Sans', system-ui, sans-serif" }}>
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="max-w-3xl mx-auto text-center mb-14">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-slate-100 border border-slate-200 text-[11px] font-bold uppercase tracking-[0.18em] text-slate-500 mb-5">
            <span className="w-2 h-2 rounded-full bg-[#FF9900]" />
            Espace membre
          </div>
          <h2 className="text-3xl md:text-5xl font-extrabold tracking-tight text-slate-900 mb-4">
            Une plateforme,{" "}
            <span className="italic font-normal text-[#FF9900]" style={{ fontFamily: "'Instrument Serif', serif" }}>
              tout au même endroit.
            </span>
          </h2>
          <p className="text-slate-600 text-lg leading-relaxed">
            Formation, outils de sourcing, alertes produits et accompagnement — réunis dans un seul tableau de bord.
          </p>
        </div>

        {/* Dashboard card */}
        <div className="relative max-w-6xl mx-auto">
          <div className="relative bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-[0_30px_80px_-30px_rgba(15,23,42,0.25)]">
            {/* Top chrome */}
            <div className="bg-slate-50 border-b border-slate-200 px-6 py-3.5 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="flex items-center gap-1.5">
                  <span className="w-2.5 h-2.5 rounded-full bg-slate-300" />
                  <span className="w-2.5 h-2.5 rounded-full bg-slate-300" />
                  <span className="w-2.5 h-2.5 rounded-full bg-slate-300" />
                </div>
                <div className="hidden sm:flex items-center gap-2 ml-3 px-3 py-1 rounded-md bg-white border border-slate-200 text-xs text-slate-500 font-mono">
                  amzingfba.com/dashboard
                </div>
              </div>
              <div className="flex items-center gap-2">
                <span className="w-8 h-8 rounded-lg bg-slate-900 text-white flex items-center justify-center">
                  <Crown className="w-4 h-4 text-[#FF9900]" />
                </span>
                <div className="text-right hidden sm:block">
                  <p className="text-xs font-semibold text-slate-900 leading-tight">Espace VIP</p>
                  <p className="text-[10px] text-slate-500 leading-tight">Connecté</p>
                </div>
              </div>
            </div>

            {/* Body */}
            <div className="p-6 lg:p-8 bg-slate-50/40">
              {/* Stats */}
              <div className="grid grid-cols-3 gap-3 sm:gap-4 mb-8">
                {stats.map((stat, index) => (
                  <div
                    key={index}
                    className="bg-white rounded-xl p-4 border border-slate-200 hover:border-slate-300 transition-colors"
                  >
                    <div className="flex items-center justify-between mb-3">
                      <span className="w-8 h-8 rounded-lg bg-slate-100 flex items-center justify-center">
                        <stat.icon className="w-4 h-4 text-slate-700" />
                      </span>
                      {stat.trend && (
                        <span className="text-[11px] font-semibold text-emerald-600 flex items-center gap-0.5 bg-emerald-50 px-1.5 py-0.5 rounded">
                          <ArrowUpRight className="w-3 h-3" />
                          {stat.trend}
                        </span>
                      )}
                    </div>
                    <p className="text-2xl font-extrabold text-slate-900 tracking-tight">{stat.value}</p>
                    <p className="text-[11px] text-slate-500 mt-0.5 uppercase tracking-wider font-semibold">{stat.label}</p>
                  </div>
                ))}
              </div>

              <div className="grid lg:grid-cols-3 gap-6">
                {/* Categories */}
                <div className="lg:col-span-2">
                  <div className="flex items-center justify-between mb-4">
                    <h4 className="text-[11px] font-bold uppercase tracking-[0.18em] text-slate-500 flex items-center gap-2">
                      <BarChart3 className="w-3.5 h-3.5" />
                      Catégories
                    </h4>
                    <span className="text-[11px] text-slate-400 font-medium">8 modules</span>
                  </div>
                  <div className="grid grid-cols-2 gap-2.5">
                    {categories.map((cat, index) => (
                      <div
                        key={index}
                        className="group bg-white hover:bg-slate-50 rounded-xl p-3.5 border border-slate-200 hover:border-slate-300 transition-all cursor-pointer flex items-center justify-between"
                      >
                        <div className="flex items-center gap-3 min-w-0">
                          <span className="w-9 h-9 rounded-lg bg-slate-100 group-hover:bg-[#FF9900]/10 flex items-center justify-center transition-colors flex-shrink-0">
                            <cat.icon className="w-4 h-4 text-slate-700 group-hover:text-[#FF9900] transition-colors" />
                          </span>
                          <span className="font-semibold text-sm text-slate-900 truncate">
                            {cat.label}
                          </span>
                        </div>
                        <span className="text-[11px] font-bold text-slate-500 bg-slate-100 px-2 py-0.5 rounded-full flex-shrink-0">
                          {cat.count}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Recent products */}
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <h4 className="text-[11px] font-bold uppercase tracking-[0.18em] text-slate-500 flex items-center gap-2">
                      <Sparkles className="w-3.5 h-3.5" />
                      Derniers produits
                    </h4>
                    <span className="text-[11px] text-emerald-600 font-semibold flex items-center gap-1">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                      Live
                    </span>
                  </div>
                  <div className="space-y-2.5">
                    {recentProducts.map((product, index) => (
                      <div
                        key={index}
                        className="group bg-white hover:bg-slate-50 rounded-xl p-3.5 border border-slate-200 hover:border-slate-300 transition-all cursor-pointer"
                      >
                        <div className="flex items-center justify-between mb-1.5">
                          <code className="text-[11px] text-slate-500 font-mono">
                            EAN · {product.ean.slice(0, 6)}…
                          </code>
                          {product.status === "hot" && (
                            <span className="bg-[#FF9900]/10 text-[#B26A00] text-[10px] font-bold px-2 py-0.5 rounded uppercase tracking-wider">
                              Hot
                            </span>
                          )}
                          {product.status === "new" && (
                            <span className="bg-slate-900 text-white text-[10px] font-bold px-2 py-0.5 rounded uppercase tracking-wider">
                              New
                            </span>
                          )}
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-emerald-600 font-extrabold tabular-nums">{product.profit}</span>
                          <span className="text-slate-500 text-xs font-semibold tabular-nums">ROI {product.roi}</span>
                        </div>
                      </div>
                    ))}
                  </div>

                  <Link
                    to="/dashboard"
                    className="mt-3 w-full bg-slate-900 hover:bg-slate-800 text-white text-sm font-semibold py-3 rounded-xl transition-colors flex items-center justify-center gap-2 group"
                  >
                    Voir tous les produits
                    <ArrowUpRight className="w-4 h-4 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
                  </Link>
                </div>
              </div>

              {/* Trust footer */}
              <div className="mt-8 pt-6 border-t border-slate-200">
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  {[
                    { icon: ShieldCheck, text: "Produits vérifiés" },
                    { icon: Clock, text: "Mise à jour quotidienne" },
                    { icon: Check, text: "Support 9h–19h" },
                    { icon: Users, text: "Communauté active" },
                  ].map((feature, index) => (
                    <div key={index} className="flex items-center gap-2 text-xs">
                      <feature.icon className="w-4 h-4 text-slate-400" />
                      <span className="text-slate-600 font-medium">{feature.text}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HomeDashboardPreview;
