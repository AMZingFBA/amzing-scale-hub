// Centralized SEO data for all pages with robots directives

export interface SeoPageData {
  title: string;
  description: string;
  keywords?: string;
  robots: 'index,follow' | 'noindex,follow' | 'noindex,nofollow';
}

export const seoData: Record<string, SeoPageData> = {
  // ============================================
  // A. PAGES PUBLIQUES MARKETING (index, follow)
  // ============================================
  
  home: {
    title: "AMZing FBA – Formation Amazon FBA & Produits rentables",
    description: "AMZing FBA est une formation Amazon FBA couplée à une plateforme complète : guides, moniteurs de produits rentables, catalogue fournisseurs, cashback et logistique pour construire un business e-commerce rentable.",
    keywords: "formation amazon fba, guide amazon fba, business e-commerce rentable, produits rentables amazon, moniteurs produits rentables",
    robots: "index,follow",
  },
  
  formation: {
    title: "Formation Amazon FBA AMZing FBA – Business e-commerce rentable",
    description: "Formation Amazon FBA complète : méthode pas à pas, étude de cas, outils et moniteurs de produits rentables pour lancer et scaler un business e-commerce rentable sur Amazon.",
    keywords: "formation amazon fba, guide amazon fba, business e-commerce rentable, cours amazon fba, tutoriel amazon fba",
    robots: "index,follow",
  },
  
  tarifs: {
    title: "Tarifs AMZing FBA – Abonnements formation Amazon FBA",
    description: "Compare les formules AMZing FBA : accès à la formation Amazon FBA, aux moniteurs de produits rentables, au catalogue fournisseurs et aux services de logistique.",
    keywords: "tarifs formation amazon fba, abonnement amazon fba, prix moniteurs produits, outils business e-commerce",
    robots: "index,follow",
  },
  
  services: {
    title: "Services Amazon FBA – Moniteurs, catalogue & logistique | AMZing FBA",
    description: "Découvre les services AMZing FBA : moniteurs de produits rentables, accompagnement Amazon FBA, logistique, stockage, expédition et cashback fournisseurs.",
    keywords: "service logistique amazon fba, stockage fba, expédition amazon, business e-commerce rentable, moniteurs produits",
    robots: "index,follow",
  },
  
  guides: {
    title: "Guides Amazon FBA & e-commerce – AMZing FBA",
    description: "Accède aux guides Amazon FBA, fiches pratiques et ressources pour comprendre la vente sur Amazon, trouver des produits rentables et structurer ton business e-commerce.",
    keywords: "guide amazon fba, tutoriel amazon fba, ressources business e-commerce, conseil vendeur amazon",
    robots: "index,follow",
  },
  
  creationSociete: {
    title: "Créer sa société pour Amazon FBA – Guide pratique | AMZing FBA",
    description: "Guide et accompagnement pour créer ta société dédiée à Amazon FBA : choix du statut, démarches, fiscalité et bonnes pratiques pour un business e-commerce durable.",
    keywords: "créer société amazon fba, statut juridique amazon, sasu eurl amazon fba, micro-entreprise e-commerce",
    robots: "index,follow",
  },
  
  contact: {
    title: "Contact AMZing FBA – Équipe formation Amazon FBA",
    description: "Une question sur la formation Amazon FBA, les moniteurs de produits rentables ou la plateforme ? Contacte directement l'équipe AMZing FBA.",
    keywords: "contact amzing fba, support formation amazon fba, aide moniteurs produits",
    robots: "index,follow",
  },
  
  faq: {
    title: "FAQ AMZing FBA – Formation Amazon FBA & plateforme",
    description: "Toutes les réponses sur AMZing FBA : débuter sur Amazon FBA, budget, fonctionnement des moniteurs de produits rentables, abonnement et services inclus.",
    keywords: "faq formation amazon fba, questions produits rentables, aide business e-commerce",
    robots: "index,follow",
  },
  
  marketplace: {
    title: "Marketplace AMZing FBA – Offres pour vendeurs Amazon",
    description: "Découvre la marketplace AMZing FBA : offres, services et produits pensés pour les vendeurs Amazon FBA et les e-commerçants.",
    keywords: "marketplace amazon fba, vente stock amazon, achat lot amazon fba, business e-commerce",
    robots: "index,follow",
  },
  
  acheter: {
    title: "Acheter sur la marketplace AMZing FBA – Offres Amazon FBA",
    description: "Achète des services et produits sélectionnés pour booster ton business Amazon FBA via la marketplace AMZing FBA.",
    keywords: "acheter produits amazon fba, marketplace vendeurs amazon, offres business e-commerce",
    robots: "index,follow",
  },
  
  vendre: {
    title: "Vendre ses produits – Marketplace AMZing FBA",
    description: "Propose tes services ou produits à une audience de vendeurs Amazon via la marketplace AMZing FBA.",
    keywords: "vendre produits amazon fba, marketplace vendeurs, services amazon fba",
    robots: "index,follow",
  },
  
  cgv: {
    title: "Conditions générales de vente – AMZing FBA",
    description: "Consulte les conditions générales de vente applicables aux offres et abonnements AMZing FBA.",
    keywords: "cgv amzing fba, conditions vente formation amazon fba, conditions générales",
    robots: "index,follow",
  },
  
  cgu: {
    title: "Conditions générales d'utilisation – AMZing FBA",
    description: "Conditions générales d'utilisation du site, de la plateforme et des services AMZing FBA.",
    keywords: "cgu amzing fba, conditions utilisation, règles plateforme amazon fba",
    robots: "index,follow",
  },
  
  privacy: {
    title: "Privacy Policy – AMZing FBA",
    description: "Politique de confidentialité et de protection des données des utilisateurs de la plateforme AMZing FBA.",
    keywords: "privacy policy amzing fba, protection données, rgpd amazon fba",
    robots: "index,follow",
  },
  
  confidentialite: {
    title: "Politique de confidentialité – AMZing FBA",
    description: "Détails sur la gestion des données personnelles, la confidentialité et la sécurité des informations sur AMZing FBA.",
    keywords: "confidentialité amzing fba, protection données, rgpd formation amazon fba",
    robots: "index,follow",
  },
  
  refund: {
    title: "Politique de remboursement – AMZing FBA",
    description: "Conditions de remboursement applicables aux abonnements, offres et services AMZing FBA.",
    keywords: "remboursement amzing fba, politique retour formation amazon fba, annulation abonnement",
    robots: "index,follow",
  },
  
  mentionsLegales: {
    title: "Mentions légales – AMZing FBA",
    description: "Informations légales sur l'éditeur, l'hébergement et l'exploitation du site amzingfba.com.",
    keywords: "mentions légales amzing fba, informations légales plateforme amazon fba",
    robots: "index,follow",
  },
  
  affiliate: {
    title: "Programme d'affiliation AMZing FBA – Gagne des commissions",
    description: "Découvre le programme d'affiliation AMZing FBA : recommande la formation Amazon FBA et la plateforme, et gagne des commissions sur chaque vente.",
    keywords: "affiliation amzing fba, programme partenaire amazon fba, commission formation amazon",
    robots: "index,follow",
  },

  // ============================================
  // B. PAGES PUBLIQUES UTILITAIRES (noindex, follow)
  // ============================================
  
  auth: {
    title: "Connexion / Inscription – AMZing FBA",
    description: "Connecte-toi ou crée ton compte AMZing FBA pour accéder à la formation Amazon FBA et aux moniteurs de produits rentables.",
    robots: "noindex,follow",
  },
  
  forgotPassword: {
    title: "Mot de passe oublié – AMZing FBA",
    description: "Réinitialise le mot de passe de ton compte AMZing FBA pour retrouver l'accès à ton espace membre.",
    robots: "noindex,follow",
  },
  
  resetPassword: {
    title: "Réinitialiser le mot de passe – AMZing FBA",
    description: "Choisis un nouveau mot de passe pour sécuriser ton compte AMZing FBA.",
    robots: "noindex,follow",
  },
  
  suppressionCompte: {
    title: "Suppression de compte – AMZing FBA",
    description: "Demande la suppression de ton compte et de tes données personnelles sur AMZing FBA.",
    robots: "noindex,follow",
  },
  
  unsubscribe: {
    title: "Désabonnement emails – AMZing FBA",
    description: "Gère ton abonnement aux emails et notifications marketing AMZing FBA.",
    robots: "noindex,follow",
  },
  
  notFound: {
    title: "Page introuvable – AMZing FBA",
    description: "La page que tu recherches n'existe pas ou plus. Retourne vers AMZing FBA pour découvrir la formation Amazon FBA et la plateforme.",
    robots: "noindex,follow",
  },

  // ============================================
  // C. ESPACE AFFILIÉS (noindex, follow / nofollow pour admin)
  // ============================================
  
  affiliateSignup: {
    title: "Inscription programme d'affiliation – AMZing FBA",
    description: "Inscris-toi au programme d'affiliation AMZing FBA pour recommander la formation Amazon FBA et gagner des commissions.",
    robots: "noindex,follow",
  },
  
  affiliateLogin: {
    title: "Connexion affilié – AMZing FBA",
    description: "Connecte-toi à ton espace affilié AMZing FBA pour suivre tes commissions et tes performances.",
    robots: "noindex,follow",
  },
  
  affiliateVerify: {
    title: "Vérification compte affilié – AMZing FBA",
    description: "Vérifie et active ton compte affilié AMZing FBA.",
    robots: "noindex,follow",
  },
  
  affiliateDashboard: {
    title: "Dashboard affilié – AMZing FBA",
    description: "Suis tes ventes, commissions et statistiques d'affiliation AMZing FBA.",
    robots: "noindex,follow",
  },
  
  affiliateAdmin: {
    title: "Admin affiliation – AMZing FBA",
    description: "Interface d'administration du programme d'affiliation AMZing FBA.",
    robots: "noindex,nofollow",
  },

  // ============================================
  // D. ESPACE VIP / MEMBRE (noindex, follow)
  // ============================================
  
  dashboard: {
    title: "Tableau de bord – AMZing FBA",
    description: "Retrouve tes alertes produits, ton accès à la formation Amazon FBA et le suivi de ton business dans ton tableau de bord AMZing FBA.",
    robots: "noindex,follow",
  },
  
  debuter: {
    title: "Débuter sur Amazon FBA – Parcours guidé | AMZing FBA",
    description: "Suis le parcours guidé pour bien débuter sur Amazon FBA avec la méthode AMZing FBA.",
    robots: "noindex,follow",
  },
  
  gestionProduits: {
    title: "Gestion de tes produits Amazon FBA – AMZing FBA",
    description: "Centralise les informations sur tes produits Amazon FBA et suis leur performance depuis ton espace AMZing FBA.",
    robots: "noindex,follow",
  },
  
  factureAutorisation: {
    title: "Factures & autorisations – AMZing FBA",
    description: "Gère tes factures, autorisations et justificatifs liés à ton activité Amazon FBA.",
    robots: "noindex,follow",
  },
  
  cashback: {
    title: "Cashback fournisseurs – Espace membre AMZing FBA",
    description: "Accède à ton espace cashback fournisseurs et suis les montants récupérés sur tes achats pour Amazon FBA.",
    robots: "noindex,follow",
  },
  
  avisPage: {
    title: "Guide avis clients Amazon – AMZing FBA",
    description: "Guide pratique pour obtenir davantage d'avis clients sur Amazon et améliorer la crédibilité de tes fiches produits.",
    robots: "noindex,follow",
  },
  
  catalogue: {
    title: "Catalogue fournisseurs & produits – AMZing FBA",
    description: "Explore le catalogue de fournisseurs et de produits proposés aux membres AMZing FBA.",
    robots: "noindex,follow",
  },
  
  catalogueProduits: {
    title: "Catalogue détaillé de produits rentables – AMZing FBA",
    description: "Accède au détail des produits rentables identifiés par les moniteurs AMZing FBA.",
    robots: "noindex,follow",
  },
  
  produitsFind: {
    title: "Alertes produits rentables – Moniteur principal | AMZing FBA",
    description: "Consulte les alertes de produits rentables détectés pour Amazon FBA par la plateforme AMZing FBA.",
    robots: "noindex,follow",
  },
  
  produitsQogita: {
    title: "Alertes produits Qogita – AMZing FBA",
    description: "Vois les produits rentables issus du fournisseur Qogita détectés par AMZing FBA.",
    robots: "noindex,follow",
  },
  
  produitsEany: {
    title: "Alertes produits Eany – AMZing FBA",
    description: "Vois les produits rentables issus du fournisseur Eany détectés par AMZing FBA.",
    robots: "noindex,follow",
  },
  
  grossistes: {
    title: "Alertes grossistes – AMZing FBA",
    description: "Accède aux produits rentables identifiés chez différents grossistes.",
    robots: "noindex,follow",
  },
  
  promotions: {
    title: "Alertes promotions – AMZing FBA",
    description: "Suis les promotions intéressantes repérées par les moniteurs AMZing FBA.",
    robots: "noindex,follow",
  },
  
  sitelist: {
    title: "Liste de sites surveillés – AMZing FBA",
    description: "Consulte la liste des sites et fournisseurs surveillés par les moniteurs de produits AMZing FBA.",
    robots: "noindex,follow",
  },
  
  produitsGagnantsQogita: {
    title: "Produits gagnants Qogita – AMZing FBA",
    description: "Retrouve les produits gagnants identifiés chez Qogita via AMZing FBA.",
    robots: "noindex,follow",
  },
  
  productsQogita: {
    title: "Données produits Qogita – AMZing FBA",
    description: "Données détaillées des produits Qogita analysés par AMZing FBA.",
    robots: "noindex,follow",
  },
  
  productsEany: {
    title: "Données produits Eany – AMZing FBA",
    description: "Données détaillées des produits Eany analysés par AMZing FBA.",
    robots: "noindex,follow",
  },
  
  monitorQogita: {
    title: "Moniteur Qogita en temps réel – AMZing FBA",
    description: "Surveille en temps réel les opportunités produits chez Qogita via AMZing FBA.",
    robots: "noindex,follow",
  },
  
  notificationAlerts: {
    title: "Paramètres des alertes – AMZing FBA",
    description: "Configure tes notifications et alertes produits sur AMZing FBA.",
    robots: "noindex,follow",
  },
  
  rulesAlerts: {
    title: "Règles d'utilisation des alertes – AMZing FBA",
    description: "Règles et bonnes pratiques pour utiliser les alertes produits AMZing FBA.",
    robots: "noindex,follow",
  },
  
  annonces: {
    title: "Annonces & mises à jour – AMZing FBA",
    description: "Retrouve les annonces importantes et mises à jour pour les membres AMZing FBA.",
    robots: "noindex,follow",
  },
  
  actualite: {
    title: "Actualités membres – AMZing FBA",
    description: "Actualités, nouveautés et informations réservées aux membres AMZing FBA.",
    robots: "noindex,follow",
  },
  
  chat: {
    title: "Chat communauté – AMZing FBA",
    description: "Échange avec les autres membres de la communauté AMZing FBA en direct.",
    robots: "noindex,follow",
  },
  
  success: {
    title: "Salon Succès – Résultats des membres | AMZing FBA",
    description: "Retrouve les partages de succès, chiffres et résultats des membres AMZing FBA.",
    robots: "noindex,follow",
  },
  
  sales: {
    title: "Salon Ventes – Chiffres & deals | AMZing FBA",
    description: "Partage et suis les ventes et deals des membres AMZing FBA.",
    robots: "noindex,follow",
  },
  
  suggestions: {
    title: "Suggestions & feedback – AMZing FBA",
    description: "Propose des idées d'amélioration pour la plateforme et la formation AMZing FBA.",
    robots: "noindex,follow",
  },
  
  questions: {
    title: "Questions & entraide – Communauté AMZing FBA",
    description: "Pose tes questions sur Amazon FBA et échange avec la communauté AMZing FBA.",
    robots: "noindex,follow",
  },
  
  avis: {
    title: "Avis utilisateurs – Espace membre AMZing FBA",
    description: "Consulte ou laisse des avis sur la plateforme et les services AMZing FBA.",
    robots: "noindex,follow",
  },
  
  support: {
    title: "Support client – AMZing FBA",
    description: "Ouvre un ticket et échange avec le support client AMZing FBA.",
    robots: "noindex,follow",
  },
  
  ticket: {
    title: "Ticket support – AMZing FBA",
    description: "Détail du ticket de support pour ton compte AMZing FBA.",
    robots: "noindex,follow",
  },
  
  profile: {
    title: "Mon profil – AMZing FBA",
    description: "Gère les informations de ton profil et de ton compte AMZing FBA.",
    robots: "noindex,follow",
  },

  // ============================================
  // E. ROUTE MOBILE (noindex, follow)
  // ============================================
  
  androidPayment: {
    title: "Paiement Android – AMZing FBA",
    description: "Page technique de validation des paiements Android pour l'application AMZing FBA.",
    robots: "noindex,follow",
  },

  // ============================================
  // F. ROUTES ADMIN & DEBUG (noindex, nofollow)
  // ============================================
  
  adminTickets: {
    title: "Admin – Tickets support | AMZing FBA",
    description: "Interface d'administration des tickets de support AMZing FBA.",
    robots: "noindex,nofollow",
  },
  
  adminAlerts: {
    title: "Admin – Alertes produits | AMZing FBA",
    description: "Interface d'administration des alertes produits AMZing FBA.",
    robots: "noindex,nofollow",
  },
  
  adminProfiles: {
    title: "Admin – Profils utilisateurs | AMZing FBA",
    description: "Interface d'administration des profils utilisateurs AMZing FBA.",
    robots: "noindex,nofollow",
  },
  
  adminAirtableContacts: {
    title: "Admin – Airtable contacts | AMZing FBA",
    description: "Interface d'administration des contacts Airtable reliés à AMZing FBA.",
    robots: "noindex,nofollow",
  },
  
  adminAirtableUsers: {
    title: "Admin – Airtable users | AMZing FBA",
    description: "Interface d'administration des utilisateurs Airtable reliés à AMZing FBA.",
    robots: "noindex,nofollow",
  },
  
  testPush: {
    title: "Tests notifications push – AMZing FBA",
    description: "Page interne de test des notifications push AMZing FBA.",
    robots: "noindex,nofollow",
  },
  
  debugPush: {
    title: "Debug notifications push – AMZing FBA",
    description: "Page interne de debug des notifications push AMZing FBA.",
    robots: "noindex,nofollow",
  },
};

// Helper function to get SEO data with dynamic ticket ID
export const getTicketSeoData = (ticketId: string): SeoPageData => ({
  title: `Ticket support #${ticketId} – AMZing FBA`,
  description: `Détail du ticket de support #${ticketId} pour ton compte AMZing FBA.`,
  robots: "noindex,follow",
});

// JSON-LD Schemas
export const schemas = {
  organization: {
    "@context": "https://schema.org",
    "@type": "Organization",
    "name": "AMZing FBA",
    "url": "https://amzingfba.com/",
    "logo": "https://amzingfba.com/logo-amzing.png",
    "description": "AMZing FBA est une formation Amazon FBA couplée à une plateforme complète : guides, moniteurs de produits rentables, catalogue fournisseurs, cashback et logistique pour construire un business e-commerce rentable.",
    "contactPoint": {
      "@type": "ContactPoint",
      "contactType": "Customer Service",
      "email": "contact@amzingfba.com",
      "availableLanguage": ["French"]
    },
    "address": {
      "@type": "PostalAddress",
      "streetAddress": "59 Rue de Ponthieu",
      "addressLocality": "Paris",
      "postalCode": "75008",
      "addressCountry": "FR"
    },
    "sameAs": [
      "https://www.instagram.com/amzingfba"
    ]
  },

  localBusiness: {
    "@context": "https://schema.org",
    "@type": "LocalBusiness",
    "name": "AMZing FBA",
    "image": "https://amzingfba.com/logo-amzing.png",
    "@id": "https://amzingfba.com",
    "url": "https://amzingfba.com",
    "priceRange": "€€",
    "address": {
      "@type": "PostalAddress",
      "streetAddress": "59 Rue de Ponthieu",
      "addressLocality": "Paris",
      "addressRegion": "Île-de-France",
      "postalCode": "75008",
      "addressCountry": "FR"
    },
    "geo": {
      "@type": "GeoCoordinates",
      "latitude": 48.8738,
      "longitude": 2.3104
    },
    "openingHoursSpecification": {
      "@type": "OpeningHoursSpecification",
      "dayOfWeek": ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"],
      "opens": "09:00",
      "closes": "18:00"
    },
    "aggregateRating": {
      "@type": "AggregateRating",
      "ratingValue": "4.8",
      "reviewCount": "127"
    }
  },

  course: {
    "@context": "https://schema.org",
    "@type": "Course",
    "name": "Formation Amazon FBA Complète",
    "description": "Formation Amazon FBA complète : méthode pas à pas, étude de cas, outils et moniteurs de produits rentables pour lancer et scaler un business e-commerce rentable sur Amazon.",
    "provider": {
      "@type": "Organization",
      "name": "AMZing FBA",
      "sameAs": "https://amzingfba.com"
    },
    "offers": {
      "@type": "Offer",
      "category": "Paid",
      "priceCurrency": "EUR",
      "price": "34.99",
      "availability": "https://schema.org/InStock"
    },
    "hasCourseInstance": {
      "@type": "CourseInstance",
      "courseMode": "online",
      "courseWorkload": "PT10H"
    },
    "aggregateRating": {
      "@type": "AggregateRating",
      "ratingValue": "4.8",
      "reviewCount": "89"
    }
  },

  product: {
    "@context": "https://schema.org",
    "@type": "Product",
    "name": "AMZing FBA VIP",
    "description": "Abonnement VIP : accès à la formation Amazon FBA, moniteurs de produits rentables, catalogue fournisseurs, cashback et logistique.",
    "image": "https://amzingfba.com/logo-amzing.png",
    "brand": {
      "@type": "Brand",
      "name": "AMZing FBA"
    },
    "offers": {
      "@type": "Offer",
      "url": "https://amzingfba.com/tarifs",
      "priceCurrency": "EUR",
      "price": "34.99",
      "priceValidUntil": "2025-12-31",
      "availability": "https://schema.org/InStock",
      "itemCondition": "https://schema.org/NewCondition"
    },
    "aggregateRating": {
      "@type": "AggregateRating",
      "ratingValue": "4.9",
      "reviewCount": "156"
    }
  },

  reviews: {
    "@context": "https://schema.org",
    "@type": "Organization",
    "name": "AMZing FBA",
    "aggregateRating": {
      "@type": "AggregateRating",
      "ratingValue": "4.8",
      "bestRating": "5",
      "worstRating": "1",
      "ratingCount": "372"
    },
    "review": [
      {
        "@type": "Review",
        "author": { "@type": "Person", "name": "Sophie M." },
        "datePublished": "2024-11-20",
        "reviewBody": "Formation exceptionnelle ! J'ai lancé mon business Amazon FBA en 3 mois grâce aux conseils d'AMZing FBA.",
        "reviewRating": { "@type": "Rating", "ratingValue": "5", "bestRating": "5" }
      },
      {
        "@type": "Review",
        "author": { "@type": "Person", "name": "Marc D." },
        "datePublished": "2024-10-15",
        "reviewBody": "Les moniteurs de produits m'ont permis d'identifier 5 produits rentables dès le premier mois.",
        "reviewRating": { "@type": "Rating", "ratingValue": "5", "bestRating": "5" }
      },
      {
        "@type": "Review",
        "author": { "@type": "Person", "name": "Julie R." },
        "datePublished": "2024-09-08",
        "reviewBody": "Excellent accompagnement pour débuter sur Amazon. Les guides sont clairs et le support toujours disponible.",
        "reviewRating": { "@type": "Rating", "ratingValue": "4", "bestRating": "5" }
      }
    ]
  },

  howTo: {
    "@context": "https://schema.org",
    "@type": "HowTo",
    "name": "Comment lancer son business Amazon FBA",
    "description": "Guide complet pour démarrer votre activité de vente sur Amazon FBA.",
    "image": "https://amzingfba.com/hero-warehouse.jpg",
    "totalTime": "PT2M",
    "supply": [
      { "@type": "HowToSupply", "name": "Compte vendeur Amazon" },
      { "@type": "HowToSupply", "name": "Budget initial (minimum 500€)" },
      { "@type": "HowToSupply", "name": "Formation AMZing FBA" }
    ],
    "tool": [
      { "@type": "HowToTool", "name": "Moniteurs produits AMZing FBA" },
      { "@type": "HowToTool", "name": "Catalogue fournisseurs" }
    ],
    "step": [
      {
        "@type": "HowToStep",
        "position": 1,
        "name": "Créer votre compte vendeur Amazon",
        "text": "Inscrivez-vous en tant que vendeur professionnel sur Amazon.fr.",
        "url": "https://amzingfba.com/guides#creation-compte"
      },
      {
        "@type": "HowToStep",
        "position": 2,
        "name": "Identifier des produits rentables",
        "text": "Utilisez les moniteurs AMZing FBA pour découvrir des produits avec un ROI élevé.",
        "url": "https://amzingfba.com/guides#sourcing"
      },
      {
        "@type": "HowToStep",
        "position": 3,
        "name": "Sourcer vos produits",
        "text": "Commandez vos produits auprès de fournisseurs vérifiés.",
        "url": "https://amzingfba.com/marketplace"
      },
      {
        "@type": "HowToStep",
        "position": 4,
        "name": "Créer vos listings optimisés",
        "text": "Rédigez des titres et descriptions optimisés SEO.",
        "url": "https://amzingfba.com/guides#listings"
      },
      {
        "@type": "HowToStep",
        "position": 5,
        "name": "Expédier vers Amazon FBA",
        "text": "Envoyez vos produits vers les entrepôts Amazon.",
        "url": "https://amzingfba.com/services#logistique"
      }
    ]
  },

  faq: {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "mainEntity": [
      {
        "@type": "Question",
        "name": "Qu'est-ce qu'Amazon FBA ?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "Amazon FBA (Fulfillment by Amazon) est un service où Amazon gère le stockage, l'emballage et l'expédition de vos produits."
        }
      },
      {
        "@type": "Question",
        "name": "Combien coûte l'abonnement AMZing FBA ?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "L'abonnement VIP avec accès à la formation, aux moniteurs et à tous les outils est à 34,99€/mois."
        }
      },
      {
        "@type": "Question",
        "name": "Quel budget faut-il pour démarrer sur Amazon FBA ?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "Un budget minimum de 500-1000€ est recommandé pour acheter votre premier stock de produits."
        }
      },
      {
        "@type": "Question",
        "name": "Combien de temps faut-il pour être rentable ?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "Avec AMZing FBA, nos membres deviennent généralement rentables en 2-4 mois."
        }
      }
    ]
  },

  breadcrumbList: (items: { name: string; url: string }[]) => ({
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    "itemListElement": items.map((item, index) => ({
      "@type": "ListItem",
      "position": index + 1,
      "name": item.name,
      "item": item.url
    }))
  }),

  website: {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "name": "AMZing FBA",
    "url": "https://amzingfba.com/",
    "potentialAction": {
      "@type": "SearchAction",
      "target": "https://amzingfba.com/search?q={search_term_string}",
      "query-input": "required name=search_term_string"
    }
  },

  siteNavigation: {
    "@context": "https://schema.org",
    "@type": "SiteNavigationElement",
    "name": [
      "Formation Amazon FBA",
      "Moniteurs Produits",
      "Guides Amazon",
      "Services",
      "Tarifs",
      "Contact"
    ],
    "url": [
      "https://amzingfba.com/formation",
      "https://amzingfba.com/catalogue",
      "https://amzingfba.com/guides",
      "https://amzingfba.com/services",
      "https://amzingfba.com/tarifs",
      "https://amzingfba.com/contact"
    ]
  }
};
