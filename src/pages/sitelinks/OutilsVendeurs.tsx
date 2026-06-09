import SitelinkPage from "@/components/sitelink/SitelinkPage";

const OutilsVendeurs = () => (
  <SitelinkPage
    seoTitle="Outils pour Vendeurs Amazon FBA | AMZing FBA"
    seoDescription="Outils IA, automatisations et méthodes pour aider les vendeurs Amazon FBA à analyser, sourcer et décider plus vite. Gagnez du temps avec AMZing FBA."
    canonicalPath="/outils-vendeurs-amazon"
    badge="Outils vendeurs"
    h1="Des outils pour aider les vendeurs Amazon à gagner du temps"
    intro="AMZing FBA met à disposition des outils IA, des automatisations et une méthodologie pour aider les vendeurs Amazon à mieux organiser leur activité et prendre de meilleures décisions."
    heroBullets={[
      "Outils IA d’analyse produit",
      "Automatisations pour le suivi des opportunités",
      "Centralisation des données et des analyses",
      "Méthode pour éviter les décisions au hasard",
    ]}
    ctaPrimaryLabel="Accéder à l’accompagnement"
    sections={[
      {
        title: "Pourquoi structurer vos outils",
        body: (
          <p>
            Sans outils ni méthode, un vendeur Amazon perd beaucoup de temps à chercher des
            produits, comparer des prix, calculer des marges manuellement et suivre des
            opportunités dispersées. En centralisant ces tâches, AMZing FBA vous fait gagner du
            temps et améliore la qualité de vos décisions.
          </p>
        ),
      },
      {
        title: "Ce que vous trouvez dans l’écosystème AMZing FBA",
        body: (
          <ul className="list-disc space-y-2 pl-6">
            <li>Outils d’analyse produit avec calcul de marge et de ROI</li>
            <li>Suivi des opportunités issues du sourcing</li>
            <li>Automatisations pour la veille et la détection</li>
            <li>Centralisation des informations clés</li>
            <li>Accompagnement humain pour exploiter les outils</li>
          </ul>
        ),
      },
      {
        title: "Des outils au service d’une méthode",
        body: (
          <p>
            Les outils seuls ne suffisent pas : c’est la méthode qui fait la différence. AMZing FBA
            combine les deux pour vous aider à avancer avec clarté, sans vous noyer sous les
            données.
          </p>
        ),
      },
    ]}
    features={[
      { icon: "sparkles", title: "IA intégrée", description: "Analyse rapide et tri intelligent." },
      { icon: "clock", title: "Gain de temps", description: "Moins de manuel, plus d’analyse." },
      { icon: "line", title: "Données centralisées", description: "Vos opportunités au même endroit." },
      { icon: "target", title: "Décisions cadrées", description: "Critères clairs avant action." },
      { icon: "shield", title: "Méthode éprouvée", description: "Une logique de travail structurée." },
      { icon: "users", title: "Accompagnement", description: "Un suivi pour exploiter les outils." },
    ]}
    faq={[
      { q: "Les outils sont-ils accessibles aux débutants ?", a: "Oui. L’interface et l’accompagnement sont pensés pour être pris en main rapidement, même sans expérience préalable." },
      { q: "Faut-il payer un abonnement ?", a: "L’accès aux outils est inclus dans l’accompagnement AMZing FBA. Les conditions sont précisées lors de votre demande." },
      { q: "Ces outils remplacent-ils Helium 10 ou Keepa ?", a: "Ils ne remplacent pas tous les outils du marché. Ils complètent votre stack et la rendent plus efficace dans le cadre de la méthode AMZing FBA." },
    ]}
  />
);

export default OutilsVendeurs;
