// Configuration du maillage interne intelligent pour le SEO
// Définit les liens contextuels recommandés pour chaque page

export const internalLinks = {
  home: [
    { text: "Formation Amazon FBA complète", url: "/formation", context: "Apprenez à maîtriser Amazon FBA de A à Z" },
    { text: "Guides gratuits", url: "/guides", context: "Accédez à nos ressources gratuites" },
    { text: "Catalogue produits rentables", url: "/catalogue", context: "Découvrez des produits analysés et validés" },
    { text: "Services logistique", url: "/services", context: "Stockage et expédition sous 24h" }
  ],
  
  formation: [
    { text: "Guides complémentaires", url: "/guides", context: "Approfondissez vos connaissances" },
    { text: "Créer sa société", url: "/creation-societe", context: "Statut juridique optimal pour Amazon FBA" },
    { text: "Services d'accompagnement", url: "/services", context: "Soutien personnalisé pour réussir" },
    { text: "Voir les tarifs", url: "/tarifs", context: "Accès VIP avec tous les outils" }
  ],
  
  guides: [
    { text: "Formation structurée", url: "/formation", context: "Programme complet en vidéo" },
    { text: "Catalogue produits", url: "/catalogue", context: "Produits analysés prêts à sourcer" },
    { text: "Marketplace fournisseurs", url: "/marketplace", context: "Accédez à nos fournisseurs vérifiés" },
    { text: "Créer sa société", url: "/creation-societe", context: "Guide juridique complet" }
  ],
  
  tarifs: [
    { text: "Formation incluse", url: "/formation", context: "Accédez à la formation complète" },
    { text: "Catalogue produits", url: "/catalogue", context: "Moniteurs automatiques inclus" },
    { text: "Services logistique", url: "/services", context: "Stockage et expédition disponibles" },
    { text: "FAQ", url: "/faq", context: "Questions fréquentes sur l'abonnement" }
  ],
  
  services: [
    { text: "Catalogue produits", url: "/catalogue", context: "Trouvez vos produits à stocker" },
    { text: "Formation", url: "/formation", context: "Apprenez à optimiser votre logistique" },
    { text: "Marketplace", url: "/marketplace", context: "Sourcez directement via notre plateforme" },
    { text: "Tarifs", url: "/tarifs", context: "Accès VIP avec services inclus" }
  ],
  
  marketplace: [
    { text: "Catalogue produits analysés", url: "/catalogue", context: "Produits validés avec ROI calculé" },
    { text: "Services logistique", url: "/services", context: "Stockez et expédiez vos achats" },
    { text: "Guides sourcing", url: "/guides", context: "Négociation et analyse fournisseurs" },
    { text: "Abonnement VIP", url: "/tarifs", context: "Accès illimité à la marketplace" }
  ],
  
  contact: [
    { text: "FAQ", url: "/faq", context: "Réponses aux questions courantes" },
    { text: "Support", url: "/support", context: "Créer un ticket d'assistance" },
    { text: "Tarifs", url: "/tarifs", context: "Découvrir nos offres" },
    { text: "Accueil", url: "/", context: "Retour à la page d'accueil" }
  ],
  
  creationSociete: [
    { text: "Formation", url: "/formation", context: "Démarrer votre activité Amazon" },
    { text: "Guides", url: "/guides", context: "Ressources complémentaires" },
    { text: "Services", url: "/services", context: "Accompagnement personnalisé" },
    { text: "Contact", url: "/contact", context: "Questions sur votre statut juridique" }
  ]
};

// Récupérer les liens recommandés pour une page
export const getRecommendedLinks = (pageKey: keyof typeof internalLinks) => {
  return internalLinks[pageKey] || [];
};
