import { TrendingUp, Package, Bell, ArrowUpRight, Sparkles, Crown } from "lucide-react";

const MultiDeviceMockup = () => {
  return (
    <section
      className="py-20 lg:py-28 bg-slate-50 border-y border-slate-200/70"
      style={{ fontFamily: "'Plus Jakarta Sans', system-ui, sans-serif" }}
    >
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="max-w-3xl mx-auto text-center mb-16">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white border border-slate-200 text-[11px] font-bold uppercase tracking-[0.18em] text-slate-500 mb-5">
            <span className="w-2 h-2 rounded-full bg-[#FF9900]" />
            Web · iOS · Android
          </div>
          <h2 className="text-3xl md:text-5xl font-extrabold tracking-tight text-slate-900 mb-4">
            Disponible{" "}
            <span
              className="italic font-normal text-[#FF9900]"
              style={{ fontFamily: "'Instrument Serif', serif" }}
            >
              sur tous vos écrans.
            </span>
          </h2>
          <p className="text-slate-600 text-lg leading-relaxed">
            Sourcing depuis votre ordinateur, alertes produits sur mobile, suivi sur tablette.
            Une seule plateforme, partout avec vous.
          </p>
        </div>

        {/* Mockups composition */}
        <div className="relative max-w-6xl mx-auto">
          {/* Decorative orange glow */}
          <div className="absolute inset-x-0 top-1/2 -translate-y-1/2 h-[60%] bg-[radial-gradient(ellipse_60%_50%_at_50%_50%,rgba(255,153,0,0.10),transparent_70%)] pointer-events-none" />

          <div className="relative flex items-end justify-center gap-4 lg:gap-8">
            {/* ============== TABLET (left, behind) ============== */}
            <div className="hidden md:block relative w-[240px] lg:w-[280px] -mr-8 lg:-mr-12 mb-6 z-10 opacity-90">
              <div className="rounded-[2rem] bg-slate-900 p-2.5 shadow-[0_30px_60px_-25px_rgba(15,23,42,0.4)]">
                <div className="rounded-[1.5rem] bg-white overflow-hidden aspect-[3/4]">
                  {/* Tablet UI */}
                  <div className="bg-slate-50 border-b border-slate-200 px-3 py-2 flex items-center gap-1.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-slate-300" />
                    <span className="w-1.5 h-1.5 rounded-full bg-slate-300" />
                    <span className="w-1.5 h-1.5 rounded-full bg-slate-300" />
                  </div>
                  <div className="p-3 space-y-2.5">
                    <div className="flex items-center gap-2">
                      <span className="w-7 h-7 rounded-md bg-slate-900 flex items-center justify-center">
                        <Crown className="w-3.5 h-3.5 text-[#FF9900]" />
                      </span>
                      <div className="flex-1">
                        <div className="h-2 w-16 bg-slate-200 rounded" />
                        <div className="h-1.5 w-10 bg-slate-100 rounded mt-1" />
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-1.5">
                      {[1, 2, 3, 4].map((i) => (
                        <div key={i} className="bg-slate-50 border border-slate-200 rounded-md p-2">
                          <div className="h-1.5 w-8 bg-slate-200 rounded mb-1" />
                          <div className="h-3 w-10 bg-slate-900 rounded" />
                        </div>
                      ))}
                    </div>
                    <div className="bg-slate-50 border border-slate-200 rounded-md p-2 space-y-1.5">
                      <div className="flex justify-between items-center">
                        <div className="h-1.5 w-12 bg-slate-200 rounded" />
                        <div className="h-1.5 w-6 bg-[#FF9900]/40 rounded" />
                      </div>
                      <div className="h-1.5 w-full bg-slate-100 rounded" />
                      <div className="h-1.5 w-3/4 bg-slate-100 rounded" />
                    </div>
                    <div className="bg-slate-50 border border-slate-200 rounded-md p-2 space-y-1.5">
                      <div className="flex justify-between items-center">
                        <div className="h-1.5 w-10 bg-slate-200 rounded" />
                        <div className="h-1.5 w-8 bg-emerald-400/40 rounded" />
                      </div>
                      <div className="h-1.5 w-full bg-slate-100 rounded" />
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* ============== DESKTOP (center, hero) ============== */}
            <div className="relative w-full max-w-[680px] z-20">
              {/* Screen */}
              <div className="rounded-t-xl bg-slate-900 p-2.5 shadow-[0_40px_80px_-30px_rgba(15,23,42,0.45)]">
                {/* Title bar */}
                <div className="flex items-center justify-between mb-2 px-1">
                  <div className="flex items-center gap-1.5">
                    <span className="w-2.5 h-2.5 rounded-full bg-[#ff5f57]" />
                    <span className="w-2.5 h-2.5 rounded-full bg-[#febc2e]" />
                    <span className="w-2.5 h-2.5 rounded-full bg-[#28c840]" />
                  </div>
                  <div className="px-3 py-0.5 rounded bg-slate-800 text-[10px] text-slate-400 font-mono">
                    amzingfba.com/dashboard
                  </div>
                  <div className="w-12" />
                </div>
                {/* Screen content */}
                <div className="bg-white rounded-lg overflow-hidden">
                  {/* App header */}
                  <div className="bg-slate-50 border-b border-slate-200 px-4 py-2.5 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="w-7 h-7 rounded-md bg-slate-900 flex items-center justify-center">
                        <Crown className="w-3.5 h-3.5 text-[#FF9900]" />
                      </span>
                      <span className="text-xs font-bold text-slate-900">AMZing FBA</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <Bell className="w-3.5 h-3.5 text-slate-400" />
                      <span className="w-6 h-6 rounded-full bg-gradient-to-br from-[#FF9900] to-[#FF7A18]" />
                    </div>
                  </div>
                  <div className="p-4 lg:p-5 bg-slate-50/40">
                    {/* Stats */}
                    <div className="grid grid-cols-3 gap-2.5 mb-4">
                      {[
                        { icon: Package, label: "Produits", value: "47", trend: "+12" },
                        { icon: TrendingUp, label: "ROI moyen", value: "34 %", trend: "+5 pts" },
                        { icon: Sparkles, label: "Nouveaux", value: "12", trend: "Live" },
                      ].map((s, i) => (
                        <div key={i} className="bg-white rounded-lg p-2.5 border border-slate-200">
                          <div className="flex items-center justify-between mb-1.5">
                            <span className="w-6 h-6 rounded bg-slate-100 flex items-center justify-center">
                              <s.icon className="w-3 h-3 text-slate-600" />
                            </span>
                            <span className="text-[9px] font-bold text-emerald-600 bg-emerald-50 px-1 py-0.5 rounded">
                              {s.trend}
                            </span>
                          </div>
                          <p className="text-base font-extrabold text-slate-900 leading-none">{s.value}</p>
                          <p className="text-[9px] text-slate-500 mt-1 uppercase tracking-wider font-semibold">{s.label}</p>
                        </div>
                      ))}
                    </div>
                    {/* Chart placeholder + product list */}
                    <div className="grid grid-cols-5 gap-2.5">
                      <div className="col-span-3 bg-white rounded-lg border border-slate-200 p-3">
                        <div className="flex items-center justify-between mb-3">
                          <div className="h-2 w-20 bg-slate-200 rounded" />
                          <div className="h-2 w-12 bg-slate-100 rounded" />
                        </div>
                        {/* Fake bar chart */}
                        <div className="flex items-end gap-1.5 h-20">
                          {[40, 65, 45, 80, 55, 90, 70, 95, 60, 85, 75, 100].map((h, i) => (
                            <div
                              key={i}
                              className="flex-1 rounded-t bg-gradient-to-t from-[#FF9900] to-[#FFB347]"
                              style={{ height: `${h}%` }}
                            />
                          ))}
                        </div>
                      </div>
                      <div className="col-span-2 bg-white rounded-lg border border-slate-200 p-3 space-y-2">
                        {[
                          { tag: "HOT", profit: "+8,45 €" },
                          { tag: "NEW", profit: "+12,30 €" },
                          { tag: "", profit: "+6,20 €" },
                        ].map((p, i) => (
                          <div key={i} className="flex items-center justify-between text-[10px]">
                            <div className="flex items-center gap-1.5">
                              <code className="text-slate-400 font-mono">361427…</code>
                              {p.tag === "HOT" && (
                                <span className="bg-[#FF9900]/15 text-[#B26A00] text-[8px] font-bold px-1 py-0.5 rounded">
                                  HOT
                                </span>
                              )}
                              {p.tag === "NEW" && (
                                <span className="bg-slate-900 text-white text-[8px] font-bold px-1 py-0.5 rounded">
                                  NEW
                                </span>
                              )}
                            </div>
                            <span className="text-emerald-600 font-bold tabular-nums">{p.profit}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              {/* Stand */}
              <div className="mx-auto h-3 w-1/3 bg-slate-900 rounded-b-xl" />
              <div className="mx-auto h-1.5 w-1/2 bg-slate-800 rounded-b-2xl" />
            </div>

            {/* ============== PHONE (right, in front) ============== */}
            <div className="relative w-[150px] sm:w-[170px] lg:w-[190px] -ml-10 lg:-ml-16 mb-2 z-30">
              <div className="rounded-[2rem] bg-slate-900 p-1.5 shadow-[0_30px_60px_-20px_rgba(15,23,42,0.5)]">
                <div className="relative rounded-[1.6rem] bg-white overflow-hidden aspect-[9/19.5]">
                  {/* Notch */}
                  <div className="absolute top-1.5 left-1/2 -translate-x-1/2 w-16 h-4 bg-slate-900 rounded-full z-10" />
                  {/* Status bar space */}
                  <div className="h-6 bg-white" />
                  {/* App content */}
                  <div className="px-2.5 py-2 space-y-2">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-1.5">
                        <span className="w-6 h-6 rounded-md bg-slate-900 flex items-center justify-center">
                          <Crown className="w-3 h-3 text-[#FF9900]" />
                        </span>
                        <div className="h-1.5 w-10 bg-slate-200 rounded" />
                      </div>
                      <Bell className="w-3 h-3 text-slate-400" />
                    </div>
                    {/* Alert card */}
                    <div className="bg-[#FF9900]/8 border border-[#FF9900]/30 rounded-lg p-2">
                      <div className="flex items-center gap-1 mb-1">
                        <span className="w-1.5 h-1.5 rounded-full bg-[#FF9900] animate-pulse" />
                        <span className="text-[7px] font-bold uppercase tracking-wider text-[#B26A00]">
                          Nouveau produit
                        </span>
                      </div>
                      <div className="h-1.5 w-full bg-[#FF9900]/30 rounded mb-1" />
                      <div className="h-1.5 w-3/4 bg-[#FF9900]/20 rounded" />
                      <div className="flex items-center justify-between mt-1.5">
                        <span className="text-[8px] font-extrabold text-emerald-600">+12,30 €</span>
                        <span className="text-[7px] text-slate-500 font-semibold">ROI 45 %</span>
                      </div>
                    </div>
                    {/* Cards */}
                    {[1, 2, 3].map((i) => (
                      <div key={i} className="bg-slate-50 border border-slate-200 rounded-lg p-2 space-y-1">
                        <div className="flex justify-between items-center">
                          <div className="h-1.5 w-8 bg-slate-300 rounded" />
                          <div className="h-1.5 w-5 bg-slate-200 rounded" />
                        </div>
                        <div className="flex justify-between items-center">
                          <div className="h-2 w-10 bg-emerald-400/50 rounded" />
                          <ArrowUpRight className="w-2.5 h-2.5 text-slate-300" />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Captions row */}
          <div className="mt-12 grid grid-cols-3 gap-4 max-w-3xl mx-auto text-center">
            <div className="space-y-1">
              <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-slate-500">Tablette</p>
              <p className="text-xs text-slate-700 font-medium">Suivi en déplacement</p>
            </div>
            <div className="space-y-1">
              <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-[#B26A00]">Ordinateur</p>
              <p className="text-xs text-slate-900 font-semibold">Sourcing &amp; analyse complète</p>
            </div>
            <div className="space-y-1">
              <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-slate-500">Mobile</p>
              <p className="text-xs text-slate-700 font-medium">Alertes produits en temps réel</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default MultiDeviceMockup;
