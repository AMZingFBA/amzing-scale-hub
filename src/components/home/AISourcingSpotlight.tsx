import { Sparkles, Brain, Search, TrendingUp, Check, ArrowUpRight, Zap, ShieldCheck, Bot, LineChart } from "lucide-react";
import { Link } from "react-router-dom";

const AISourcingSpotlight = () => {
  return (
    <section
      className="py-20 lg:py-28 bg-white"
      style={{ fontFamily: "'Plus Jakarta Sans', system-ui, sans-serif" }}
    >
      <div className="container mx-auto px-4">
        {/* Section header */}
        <div className="max-w-3xl mx-auto text-center mb-16">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-slate-900 text-white text-[11px] font-bold uppercase tracking-[0.18em] mb-5">
            <Sparkles className="w-3 h-3 text-[#FF9900]" />
            Propulsé par l'intelligence artificielle
          </div>
          <h2 className="text-3xl md:text-5xl font-extrabold tracking-tight text-slate-900 mb-4 leading-[1.1]">
            On source vos produits.{" "}
            <span
              className="italic font-normal text-[#FF9900]"
              style={{ fontFamily: "'Instrument Serif', serif" }}
            >
              Notre IA fait le tri.
            </span>
          </h2>
          <p className="text-slate-600 text-lg leading-relaxed">
            Plus besoin de scanner 500 produits par jour. Notre intelligence artificielle analyse,
            filtre et qualifie les opportunités pour ne vous présenter que les produits réellement rentables.
          </p>
        </div>

        {/* Two-card grid: IA Sourcing + AMZing AMP */}
        <div className="grid lg:grid-cols-2 gap-6 max-w-6xl mx-auto">
          {/* ============== CARD 1 — IA SOURCING ============== */}
          <div className="relative bg-slate-50 border border-slate-200 rounded-2xl p-8 lg:p-10 overflow-hidden">
            <div className="absolute top-0 right-0 w-64 h-64 bg-[#FF9900]/8 blur-3xl rounded-full pointer-events-none" />

            <div className="relative">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-12 h-12 rounded-xl bg-slate-900 flex items-center justify-center shadow-lg">
                  <Bot className="w-6 h-6 text-[#FF9900]" />
                </div>
                <div>
                  <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-slate-500">Sourcing automatisé</p>
                  <h3 className="text-xl font-extrabold text-slate-900">IA de sourcing</h3>
                </div>
              </div>

              <p className="text-slate-700 text-base leading-relaxed mb-6">
                Notre intelligence artificielle scanne en continu des milliers de produits chez plus de
                <span className="font-semibold text-slate-900"> 50 grossistes et marketplaces</span>.
                Elle vous livre chaque jour une sélection qualifiée, déjà filtrée selon vos critères.
              </p>

              {/* Mini live feed mockup */}
              <div className="bg-white rounded-xl border border-slate-200 p-4 mb-6">
                <div className="flex items-center justify-between mb-3">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500 flex items-center gap-1.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                    Flux IA · en direct
                  </span>
                  <span className="text-[10px] text-slate-400 font-mono">Maj il y a 2 min</span>
                </div>
                <div className="space-y-2">
                  {[
                    { src: "Auchan", profit: "+8,45 €", roi: "32 %", status: "ok" },
                    { src: "iBood", profit: "+12,30 €", roi: "45 %", status: "hot" },
                    { src: "Vibraforce", profit: "+6,20 €", roi: "28 %", status: "ok" },
                  ].map((p, i) => (
                    <div key={i} className="flex items-center justify-between text-xs py-1.5 border-b border-slate-100 last:border-0">
                      <div className="flex items-center gap-2">
                        <span className="w-2 h-2 rounded-full bg-slate-300" />
                        <span className="font-semibold text-slate-700">{p.src}</span>
                        {p.status === "hot" && (
                          <span className="bg-[#FF9900]/15 text-[#B26A00] text-[9px] font-bold px-1.5 py-0.5 rounded uppercase">Hot</span>
                        )}
                      </div>
                      <div className="flex items-center gap-3">
                        <span className="text-emerald-600 font-extrabold tabular-nums">{p.profit}</span>
                        <span className="text-slate-400 text-[11px] font-semibold tabular-nums">ROI {p.roi}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Bullet points */}
              <ul className="space-y-3 mb-6">
                {[
                  "Scan automatique de 50+ sources de sourcing",
                  "Filtres IA : marge, BSR, restrictions, IP",
                  "Alertes push instantanées sur mobile",
                  "Mises à jour quotidiennes 7 j/7",
                ].map((item, i) => (
                  <li key={i} className="flex items-start gap-3 text-sm text-slate-700">
                    <Check className="w-4 h-4 text-[#FF9900] flex-shrink-0 mt-0.5" strokeWidth={3} />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>

              <Link
                to="/dashboard"
                className="inline-flex items-center gap-2 text-sm font-bold text-slate-900 hover:text-[#FF9900] transition-colors group"
              >
                Voir le flux IA en action
                <ArrowUpRight className="w-4 h-4 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
              </Link>
            </div>
          </div>

          {/* ============== CARD 2 — AMZING AMP ============== */}
          <div className="relative bg-slate-900 text-white border border-slate-800 rounded-2xl p-8 lg:p-10 overflow-hidden">
            <div className="absolute top-0 right-0 w-64 h-64 bg-[#FF9900]/20 blur-3xl rounded-full pointer-events-none" />
            <div className="absolute bottom-0 left-0 w-72 h-72 bg-[#FF9900]/10 blur-3xl rounded-full pointer-events-none" />

            <div className="relative">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-[#FF9900] to-[#FF7A18] flex items-center justify-center shadow-[0_8px_30px_rgba(255,153,0,0.4)]">
                  <Brain className="w-6 h-6 text-white" />
                </div>
                <div>
                  <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-[#FFB347]">Analyse intelligente</p>
                  <h3 className="text-xl font-extrabold text-white flex items-center gap-2">
                    AMZing AMP
                    <span className="bg-[#FF9900] text-slate-900 text-[9px] font-extrabold px-1.5 py-0.5 rounded uppercase tracking-wider">IA</span>
                  </h3>
                </div>
              </div>

              <p className="text-white/70 text-base leading-relaxed mb-6">
                Collez un lien Amazon ou un EAN.{" "}
                <span className="text-white font-semibold">AMZing AMP vous dit en 3 secondes</span>{" "}
                si le produit est rentable : marge nette, ROI, BSR, restrictions, concurrence et risques de marque.
              </p>

              {/* Mini AMP analysis mockup */}
              <div className="bg-slate-950/60 backdrop-blur border border-white/10 rounded-xl p-4 mb-6">
                <div className="flex items-center gap-2 mb-3">
                  <Search className="w-3.5 h-3.5 text-white/40" />
                  <code className="text-[11px] text-white/60 font-mono truncate flex-1">amazon.fr/dp/B0CHX1W1XY</code>
                  <span className="bg-[#FF9900] text-slate-900 text-[10px] font-bold px-2 py-0.5 rounded">Analyser</span>
                </div>

                {/* Verdict bar */}
                <div className="bg-emerald-500/15 border border-emerald-500/30 rounded-lg px-3 py-2.5 mb-3 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Check className="w-4 h-4 text-emerald-400" strokeWidth={3} />
                    <span className="text-emerald-300 text-sm font-bold">Produit rentable</span>
                  </div>
                  <span className="text-emerald-400 text-xs font-extrabold tabular-nums">Score 87/100</span>
                </div>

                {/* Metrics grid */}
                <div className="grid grid-cols-4 gap-2 text-center">
                  {[
                    { label: "Marge", value: "+8,45 €" },
                    { label: "ROI", value: "32 %" },
                    { label: "BSR", value: "#1 240" },
                    { label: "Risque", value: "Faible" },
                  ].map((m, i) => (
                    <div key={i} className="bg-white/5 rounded-md py-2">
                      <p className="text-[9px] text-white/40 font-semibold uppercase tracking-wider mb-0.5">{m.label}</p>
                      <p className="text-xs font-extrabold text-white tabular-nums">{m.value}</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Bullet points */}
              <ul className="space-y-3 mb-6">
                {[
                  "Analyse complète en 3 secondes",
                  "Vérifie marge, ROI, BSR, restrictions",
                  "Détecte marques protégées et hijackers",
                  "Verdict clair : rentable ou à éviter",
                ].map((item, i) => (
                  <li key={i} className="flex items-start gap-3 text-sm text-white/85">
                    <Check className="w-4 h-4 text-[#FFB347] flex-shrink-0 mt-0.5" strokeWidth={3} />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>

              <Link
                to="/dashboard"
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg bg-[#FF9900] hover:bg-[#FFA826] text-slate-900 text-sm font-bold transition-colors group"
              >
                Tester AMZing AMP
                <ArrowUpRight className="w-4 h-4 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
              </Link>
            </div>
          </div>
        </div>

        {/* Bottom trust row */}
        <div className="max-w-6xl mx-auto mt-10 pt-8 border-t border-slate-200">
          <div className="flex flex-wrap justify-center items-center gap-x-10 gap-y-4 text-slate-500">
            <div className="flex items-center gap-2 text-xs font-medium">
              <Zap className="w-4 h-4 text-[#FF9900]" />
              <span>IA propriétaire — entraînée sur 1 700+ produits rentables</span>
            </div>
            <div className="flex items-center gap-2 text-xs font-medium">
              <ShieldCheck className="w-4 h-4 text-slate-400" />
              <span>Données vérifiées par un vendeur en activité</span>
            </div>
            <div className="flex items-center gap-2 text-xs font-medium">
              <LineChart className="w-4 h-4 text-slate-400" />
              <span>Précision moyenne : 94 %</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default AISourcingSpotlight;
