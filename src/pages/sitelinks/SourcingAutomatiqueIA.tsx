import SitelinkPage from "@/components/sitelink/SitelinkPage";

const SourcingAutomatiqueIA = () => (
  <SitelinkPage
    seoTitle="Sourcing Automatique IA pour Amazon FBA | AMZing FBA"
    seoDescription="Sourcing automatique avec IA pour Amazon FBA : critères personnalisés, analyse de marge, ROI et concurrence pour identifier les opportunités plus vite."
    canonicalPath="/sourcing-automatique-ia"
    badge="Sourcing IA"
    h1="Sourcing automatique avec IA pour Amazon FBA"
    intro="Identifiez plus rapidement des opportunités produits intéressantes grâce à un sourcing automatisé, basé sur vos propres critères et assisté par l’intelligence artificielle."
    heroBullets={[
      "Recherche de produits selon des critères définis (marge, ROI, prix, niche)",
      "Analyse rapide de la concurrence et du potentiel",
      "Automatisation pour gagner un temps précieux",
      "Aide à la décision avant achat",
    ]}
    ctaPrimaryLabel="Découvrir le sourcing IA"
    sections={[
      {
        title: "Comment fonctionne le sourcing automatique IA",
        body: (
          <p>
            Le sourcing automatique AMZing FBA part de vos critères : budget, marge minimale, ROI
            cible, catégories, type de concurrence. L’IA analyse en continu un grand volume
            d’opportunités et fait remonter celles qui correspondent à vos paramètres. Vous gardez
            la décision finale, mais vous économisez des dizaines d’heures de recherche manuelle.
          </p>
        ),
      },
      {
        title: "Critères analysés",
        body: (
          <ul className="list-disc space-y-2 pl-6">
            <li>Marge nette estimée après frais Amazon</li>
            <li>ROI prévisionnel</li>
            <li>Prix d’achat et prix de vente</li>
            <li>Niveau de concurrence sur la fiche</li>
            <li>Volume de ventes potentiel</li>
            <li>Risques (marque, restrictions, saisonnalité)</li>
          </ul>
        ),
      },
      {
        title: "Ce que l’IA ne remplace pas",
        body: (
          <p>
            L’IA accélère la détection d’opportunités, mais elle ne remplace ni votre stratégie ni
            votre validation finale. AMZing FBA combine sourcing automatisé et accompagnement humain
            pour éviter les achats impulsifs. Aucun outil ne garantit des profits : l’objectif est
            d’aider à prendre des décisions plus rationnelles, plus vite.
          </p>
        ),
      },
    ]}
    features={[
      { icon: "sparkles", title: "Filtrage IA", description: "Tri rapide des opportunités selon vos critères." },
      { icon: "clock", title: "Automatisation", description: "Moins de recherche manuelle, plus d’analyse." },
      { icon: "line", title: "Analyse intégrée", description: "Marge, ROI et concurrence en un coup d’œil." },
      { icon: "target", title: "Critères personnalisés", description: "Vos règles, votre budget, vos objectifs." },
      { icon: "shield", title: "Aide à la décision", description: "Des signaux clairs avant chaque achat." },
      { icon: "users", title: "Suivi expert", description: "Un accompagnement pour valider vos choix." },
    ]}
    faq={[
      { q: "Le sourcing IA garantit-il des produits rentables ?", a: "Non. Aucun outil ne garantit la rentabilité. L’IA aide à identifier plus rapidement des opportunités correspondant à vos critères, mais la décision finale et le marché restent déterminants." },
      { q: "Puis-je personnaliser les critères ?", a: "Oui. Marge, ROI, prix, catégories, niveau de concurrence : les critères sont définis avec vous." },
      { q: "Faut-il être technique pour l’utiliser ?", a: "Non. Les outils sont pensés pour être accessibles, et l’équipe AMZing FBA vous accompagne dans la prise en main." },
    ]}
  />
);

export default SourcingAutomatiqueIA;
