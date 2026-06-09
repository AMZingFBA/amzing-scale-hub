import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import SEO from "@/components/SEO";
import { Input } from "@/components/ui/input";
import { COMMUNES, REGIONS } from "@/data/communes";

const VillesIndex = () => {
  const [q, setQ] = useState("");

  const filtered = useMemo(() => {
    const s = q.trim().toLowerCase();
    if (!s) return COMMUNES;
    return COMMUNES.filter(
      (c) => c.n.toLowerCase().includes(s) || c.d.startsWith(s),
    );
  }, [q]);

  return (
    <main className="min-h-screen bg-background">
      <SEO
        title="Accompagnement Amazon FBA — Toutes les villes de France | AMZing FBA"
        description="Trouvez votre ville : accompagnement Amazon FBA disponible à distance dans plus de 1000 communes françaises. Méthode, sourcing, analyse de rentabilité."
      />
      <section className="container mx-auto px-4 py-16">
        <Link to="/" className="text-sm text-muted-foreground hover:text-primary">
          ← Retour à l'accueil
        </Link>
        <h1 className="mt-6 text-4xl font-bold tracking-tight md:text-5xl">
          Accompagnement Amazon FBA partout en France
        </h1>
        <p className="mt-4 max-w-2xl text-lg text-muted-foreground">
          AMZing FBA accompagne les entrepreneurs et futurs vendeurs Amazon dans plus de 1000
          communes françaises. L'accompagnement est 100% à distance : où que vous soyez,
          vous bénéficiez de la même méthode et des mêmes outils.
        </p>

        <div className="mt-8 max-w-md">
          <Input
            placeholder="Rechercher une ville ou un département (75, 13, 69…)"
            value={q}
            onChange={(e) => setQ(e.target.value)}
          />
          <p className="mt-2 text-xs text-muted-foreground">
            {filtered.length} commune{filtered.length > 1 ? "s" : ""} affichée
            {filtered.length > 1 ? "s" : ""} sur {COMMUNES.length}.
          </p>
        </div>

        <div className="mt-10 grid grid-cols-2 gap-x-6 gap-y-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
          {filtered.slice(0, 500).map((c) => (
            <Link
              key={c.s}
              to={`/accompagnement-amazon-fba/${c.s}`}
              className="truncate text-sm text-foreground/80 hover:text-primary hover:underline"
              title={`${c.n} (${c.d}) — ${REGIONS[c.r] ?? ""}`}
            >
              {c.n} <span className="text-xs text-muted-foreground">({c.d})</span>
            </Link>
          ))}
        </div>
        {filtered.length > 500 && (
          <p className="mt-6 text-sm text-muted-foreground">
            Affinez votre recherche pour voir d'autres résultats (500 premières villes affichées).
          </p>
        )}

        <div className="mt-16 rounded-lg border border-border bg-card p-6">
          <h2 className="text-xl font-semibold">Vous ne trouvez pas votre ville ?</h2>
          <p className="mt-2 text-muted-foreground">
            L'accompagnement étant 100% à distance, votre commune n'a pas besoin d'avoir sa propre
            page pour que vous en bénéficiiez.{" "}
            <Link to="/accompagnement" className="text-primary underline">
              Demandez un accompagnement directement
            </Link>
            .
          </p>
        </div>
      </section>
    </main>
  );
};

export default VillesIndex;
