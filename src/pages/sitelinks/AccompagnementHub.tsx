import SitelinkPage from "@/components/sitelink/SitelinkPage";

const AccompagnementHub = () => (
  <SitelinkPage
    seoTitle="Accompagnement Amazon FBA | AMZing FBA"
    seoDescription="Accompagnement Amazon FBA structuré : méthode, outils IA, sourcing et analyse de rentabilité pour avancer sereinement sur Amazon."
    canonicalPath="/accompagnement-amazon-fba"
    badge="Accompagnement Amazon FBA"
    h1="Accompagnement Amazon FBA"
    intro="AMZing FBA accompagne les vendeurs Amazon et les futurs vendeurs avec une méthode claire, des outils IA et une analyse personnalisée pour structurer leur activité."
    heroBullets={[
      "Méthode progressive adaptée à votre profil et à votre budget",
      "Outils d’analyse produit, marge et ROI",
      "Sourcing assisté avec critères personnalisés",
      "Suivi régulier pour ajuster votre stratégie",
    ]}
    ctaPrimaryLabel="Demander un accompagnement"
    sections={[
      {
        title: "À qui s’adresse l’accompagnement AMZing FBA",
        body: (
          <p>
            Notre accompagnement s’adresse aux personnes qui souhaitent se lancer sur Amazon FBA
            avec une méthode claire, mais également aux vendeurs déjà actifs qui veulent structurer
            leur activité, améliorer leur sourcing ou mieux analyser leur rentabilité. Que vous
            soyez débutant, e-commerçant hors Amazon ou vendeur expérimenté, l’accompagnement est
            adapté à votre niveau, votre temps disponible et vos objectifs.
          </p>
        ),
      },
      {
        title: "Ce que AMZing FBA vous apporte",
        body: (
          <ul className="list-disc space-y-2 pl-6">
            <li>Une compréhension claire des frais Amazon, du FBA et du FBM.</li>
            <li>Une méthode pour analyser un produit avant de l’acheter.</li>
            <li>Des outils pour gagner du temps sur le sourcing et le tri des opportunités.</li>
            <li>Un cadre pour structurer votre activité dans la durée.</li>
            <li>Un suivi humain pour avancer sans rester bloqué.</li>
          </ul>
        ),
      },
      {
        title: "Pourquoi se faire accompagner",
        body: (
          <p>
            Beaucoup de vendeurs Amazon se lancent sans cadre, achètent des produits au hasard,
            sous-estiment les frais réels et perdent du temps sur des opportunités peu rentables.
            Un accompagnement structuré permet d’éviter ces erreurs, de prioriser les bonnes
            actions et de prendre des décisions plus rationnelles. L’objectif n’est pas de
            promettre des résultats irréalistes, mais de mettre toutes les chances de votre côté.
          </p>
        ),
      },
      {
        title: "Les erreurs fréquentes des vendeurs Amazon",
        body: (
          <ul className="list-disc space-y-2 pl-6">
            <li>Acheter un produit sans calculer la marge réelle après frais Amazon.</li>
            <li>Sous-estimer la concurrence et le volume nécessaire pour rentabiliser.</li>
            <li>Choisir un produit par instinct plutôt que par analyse de données.</li>
            <li>Ne pas anticiper les coûts logistiques, le stockage et les retours.</li>
            <li>Avancer sans méthode et abandonner après les premières difficultés.</li>
          </ul>
        ),
      },
    ]}
    features={[
      { icon: "shield", title: "Méthode structurée", description: "Une approche claire et progressive, étape par étape." },
      { icon: "sparkles", title: "Outils IA", description: "Analyse rapide des produits et des opportunités." },
      { icon: "users", title: "Accompagnement humain", description: "Un suivi pour ajuster et avancer sereinement." },
      { icon: "line", title: "Analyse de rentabilité", description: "Marge, ROI, frais Amazon, concurrence et risques." },
      { icon: "clock", title: "Gain de temps", description: "Automatisations et centralisation des informations." },
      { icon: "target", title: "Décisions éclairées", description: "Des critères clairs avant chaque décision d’achat." },
    ]}
    faq={[
      { q: "Faut-il avoir de l’expérience pour être accompagné ?", a: "Non. L’accompagnement est adapté aux débutants comme aux vendeurs déjà actifs sur Amazon ou hors Amazon." },
      { q: "Combien de temps faut-il consacrer par semaine ?", a: "Cela dépend de votre projet. Plus vous êtes impliqué, plus vous avancez vite. L’accompagnement s’adapte à votre rythme." },
      { q: "AMZing FBA garantit-il des résultats ?", a: "Non. Aucun résultat financier n’est garanti. Les résultats dépendent du profil, du budget, du marché et du travail fourni." },
      { q: "Comment démarrer ?", a: "Il suffit de remplir le formulaire d’accompagnement. L’équipe vous recontacte pour échanger sur votre projet." },
    ]}
  />
);

export default AccompagnementHub;
