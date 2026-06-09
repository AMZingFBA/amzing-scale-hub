import SitelinkPage from "@/components/sitelink/SitelinkPage";

const AnalyseRentabilite = () => (
  <SitelinkPage
    seoTitle="Analyse de Rentabilité Amazon FBA | AMZing FBA"
    seoDescription="Analysez la rentabilité de vos produits Amazon FBA avant achat : marge, ROI, frais Amazon, concurrence et volume de ventes potentiel."
    canonicalPath="/analyse-rentabilite-amazon"
    badge="Analyse de rentabilité"
    h1="Analyse de rentabilité pour vos produits Amazon"
    intro="Avant d’acheter un produit pour Amazon FBA, AMZing FBA vous aide à analyser sa rentabilité réelle : marge nette, ROI, frais Amazon, concurrence et risques."
    heroBullets={[
      "Calcul de marge nette après frais Amazon",
      "ROI prévisionnel et seuil de rentabilité",
      "Analyse de la concurrence et du volume",
      "Identification des risques avant achat",
    ]}
    ctaPrimaryLabel="Faire analyser mon projet"
    sections={[
      {
        title: "Ce que nous analysons sur chaque produit",
        body: (
          <ul className="list-disc space-y-2 pl-6">
            <li>Prix d’achat estimé et prix de vente cible</li>
            <li>Frais Amazon (commission, FBA, stockage)</li>
            <li>Marge brute et marge nette estimées</li>
            <li>ROI prévisionnel</li>
            <li>Volume de ventes potentiel</li>
            <li>Concurrence présente sur la fiche</li>
            <li>Risques : marque, restrictions, saisonnalité, retours</li>
          </ul>
        ),
      },
      {
        title: "Pourquoi cette analyse change tout",
        body: (
          <p>
            Beaucoup de vendeurs achètent des produits en se basant sur le prix d’achat et le prix
            affiché sur Amazon, sans tenir compte des frais réels et de la concurrence. Le résultat
            est souvent une marge bien plus faible que prévu, voire négative. Une analyse
            rigoureuse permet d’écarter les produits peu intéressants et de se concentrer sur ceux
            qui ont un vrai potentiel.
          </p>
        ),
      },
      {
        title: "Une aide à la décision, pas une promesse",
        body: (
          <p>
            L’analyse de rentabilité est un outil d’aide à la décision. Elle améliore la qualité de
            vos choix mais ne garantit pas que chaque produit sera rentable. Le marché, la
            concurrence, votre exécution et la logistique restent des facteurs majeurs.
          </p>
        ),
      },
    ]}
    features={[
      { icon: "line", title: "Marge & ROI", description: "Tous les indicateurs financiers clés." },
      { icon: "target", title: "Frais Amazon", description: "Commission, FBA, stockage pris en compte." },
      { icon: "shield", title: "Risques", description: "Marque, restrictions, retours, saisonnalité." },
      { icon: "sparkles", title: "Outils intégrés", description: "Calculs automatisés pour décider vite." },
      { icon: "users", title: "Avis d’expert", description: "Un regard externe sur vos opportunités." },
      { icon: "clock", title: "Décisions plus rapides", description: "Moins d’hésitation, plus d’action." },
    ]}
    faq={[
      { q: "Puis-je faire analyser n’importe quel produit ?", a: "Oui, dans la limite des règles Amazon. L’analyse couvre la plupart des catégories accessibles aux vendeurs FBA." },
      { q: "Combien de temps prend une analyse ?", a: "Les outils permettent une analyse rapide. L’équipe peut ensuite valider les points clés avec vous lors de l’accompagnement." },
      { q: "Cette analyse garantit-elle la rentabilité ?", a: "Non. Aucun outil ne peut garantir la rentabilité réelle d’un produit. Elle permet de prendre des décisions plus éclairées." },
    ]}
  />
);

export default AnalyseRentabilite;
