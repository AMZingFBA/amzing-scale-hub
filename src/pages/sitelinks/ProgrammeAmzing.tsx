import SitelinkPage from "@/components/sitelink/SitelinkPage";

const ProgrammeAmzing = () => (
  <SitelinkPage
    seoTitle="Programme AMZing FBA | Accompagnement Amazon"
    seoDescription="Le programme AMZing FBA : un parcours structuré en 5 étapes pour comprendre, sourcer, analyser et développer votre activité Amazon FBA."
    canonicalPath="/programme-amzing-fba"
    badge="Programme AMZing FBA"
    h1="Le programme AMZing FBA"
    intro="Un parcours structuré en 5 étapes pour comprendre votre profil, définir vos critères, identifier des opportunités, sélectionner vos produits et ajuster votre stratégie dans la durée."
    heroBullets={[
      "Méthodologie claire en 5 étapes",
      "Outils et accompagnement intégrés",
      "Suivi régulier des avancées",
      "Adapté à votre profil et à votre budget",
    ]}
    ctaPrimaryLabel="Rejoindre le programme"
    sections={[
      {
        title: "Étape 1 — Compréhension du profil et des objectifs",
        body: (
          <p>
            Nous commençons par comprendre votre situation actuelle, vos objectifs, votre budget,
            votre temps disponible et votre niveau d’expérience. Cette étape est essentielle pour
            adapter l’accompagnement à votre réalité.
          </p>
        ),
      },
      {
        title: "Étape 2 — Définition des critères de sourcing",
        body: (
          <p>
            Nous définissons ensemble les critères qui vont guider votre sourcing : marge
            minimale, ROI cible, catégories, type de concurrence acceptable et risques à éviter.
            Ces critères sont la colonne vertébrale de votre stratégie produit.
          </p>
        ),
      },
      {
        title: "Étape 3 — Recherche et analyse des opportunités",
        body: (
          <p>
            Grâce aux outils IA et au sourcing automatisé, vous accédez à un flux d’opportunités
            filtrées selon vos critères. Chaque opportunité est analysée sur la marge, le ROI, la
            concurrence et les risques.
          </p>
        ),
      },
      {
        title: "Étape 4 — Sélection des produits",
        body: (
          <p>
            Vous prenez les décisions d’achat avec une vision claire des chiffres et des risques.
            L’équipe AMZing FBA peut valider avec vous les opportunités les plus prometteuses
            avant de vous engager.
          </p>
        ),
      },
      {
        title: "Étape 5 — Suivi, ajustements et amélioration",
        body: (
          <p>
            Vendre sur Amazon est un travail dans la durée. Le programme inclut un suivi pour
            ajuster votre stratégie, analyser vos performances et améliorer vos résultats au fil
            du temps. Les résultats dépendent de votre implication et du marché.
          </p>
        ),
      },
    ]}
    features={[
      { icon: "shield", title: "Cadre clair", description: "Une progression étape par étape." },
      { icon: "target", title: "Critères définis", description: "Des règles avant chaque action." },
      { icon: "sparkles", title: "Outils IA", description: "Sourcing et analyse accélérés." },
      { icon: "line", title: "Analyse rentabilité", description: "Marge et ROI sur chaque produit." },
      { icon: "users", title: "Suivi humain", description: "Un accompagnement régulier." },
      { icon: "clock", title: "Gain de temps", description: "Moins d’erreurs, plus d’action utile." },
    ]}
    faq={[
      { q: "Combien de temps dure le programme ?", a: "L’accompagnement est conçu sur 12 mois pour permettre une montée en compétence et un suivi dans la durée." },
      { q: "Est-ce adapté aux débutants ?", a: "Oui. Le programme s’adresse aux débutants comme aux vendeurs déjà actifs souhaitant se structurer." },
      { q: "Quels résultats puis-je attendre ?", a: "Aucun résultat n’est garanti. Le programme vise à vous donner une méthode, des outils et un cadre pour avancer sereinement." },
    ]}
  />
);

export default ProgrammeAmzing;
