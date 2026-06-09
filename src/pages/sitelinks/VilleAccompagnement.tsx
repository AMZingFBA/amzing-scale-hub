import { useMemo } from "react";
import { useParams, Navigate, Link } from "react-router-dom";
import SitelinkPage from "@/components/sitelink/SitelinkPage";
import { COMMUNES } from "@/data/communes";
import { buildContent } from "@/data/communeContent";

const VilleAccompagnement = () => {
  const { slug } = useParams<{ slug: string }>();
  const idx = useMemo(() => COMMUNES.findIndex((c) => c.s === slug), [slug]);

  if (idx === -1) return <Navigate to="/villes" replace />;

  const commune = COMMUNES[idx];
  const c = buildContent(commune, idx);

  return (
    <SitelinkPage
      seoTitle={c.metaTitle}
      seoDescription={c.metaDescription}
      canonicalPath={`/accompagnement-amazon-fba/${commune.s}`}
      badge={`${commune.n} • Département ${commune.d}`}
      h1={`Accompagnement Amazon FBA à ${commune.n}`}
      intro={c.intro}
      heroBullets={[
        `Accompagnement 100% à distance, accessible depuis ${commune.n}`,
        "Méthode structurée : sourcing, analyse, rentabilité",
        "Outils d'analyse produit et de calcul de marge",
        `Suivi adapté au tissu économique de la région ${c.regionName}`,
      ]}
      ctaPrimaryLabel="Demander un accompagnement"
      sections={[
        {
          title: `Pourquoi se lancer sur Amazon FBA depuis ${commune.n}`,
          body: <p>{c.pourquoi}</p>,
        },
        {
          title: `Le contexte régional : ${c.regionName}`,
          body: (
            <>
              <p>{c.regionContext}</p>
              <p className="mt-3">
                {commune.n} fait partie du département {commune.d} et compte environ{" "}
                {commune.p.toLocaleString("fr-FR")} habitants. Cette {c.tierLabel} française
                bénéficie de l'écosystème logistique national qui rend le modèle Amazon FBA
                accessible sans contrainte géographique.
              </p>
            </>
          ),
        },
        {
          title: "Notre méthode d'accompagnement",
          body: <p>{c.methode}</p>,
        },
        {
          title: `Ce que nous évitons aux entrepreneurs de ${commune.n}`,
          body: (
            <ul className="list-disc space-y-2 pl-6">
              <li>Acheter un produit sans avoir calculé la marge nette réelle (frais Amazon inclus).</li>
              <li>Se lancer en marque propre sans validation de la demande.</li>
              <li>Sous-estimer le risque de stock invendu ou de baisse de prix.</li>
              <li>Confondre chiffre d'affaires et bénéfice net.</li>
              <li>Négliger la structuration juridique et fiscale dès le départ.</li>
            </ul>
          ),
        },
        {
          title: "Transparence sur les résultats",
          body: (
            <p>
              Aucun accompagnement Amazon FBA, à {commune.n} ou ailleurs, ne peut garantir de revenus.
              Le e-commerce comporte des risques réels : invendus, suspensions de compte, évolution
              des frais, concurrence. AMZing FBA s'engage sur la qualité de la méthode et des outils,
              pas sur des promesses de revenus.
            </p>
          ),
        },
      ]}
      features={[
        {
          icon: "target",
          title: "Sourcing structuré",
          description: "Une méthode pour identifier des produits pertinents, pas du hasard.",
        },
        {
          icon: "line",
          title: "Analyse de rentabilité",
          description: "Calcul de marge nette intégrant tous les frais Amazon FBA.",
        },
        {
          icon: "sparkles",
          title: "Outils IA",
          description: "Aide à la décision sur le sourcing et le tri des opportunités.",
        },
        {
          icon: "users",
          title: "Suivi humain",
          description: `Un interlocuteur dédié pour les entrepreneurs de ${commune.n}.`,
        },
        {
          icon: "shield",
          title: "Approche prudente",
          description: "Pas de promesse de revenus, focus sur la méthode et le risque.",
        },
        {
          icon: "phone",
          title: "Échange préalable",
          description: "Un appel pour vérifier ensemble la pertinence avant de s'engager.",
        },
      ]}
      faq={c.faq}
    />
  );
};

export default VilleAccompagnement;
