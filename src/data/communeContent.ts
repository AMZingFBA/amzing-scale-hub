// Génération de contenu varié et unique par commune.
// Combinaisons : 4 paliers de population × 18 régions × variations rotatives
// + nom de ville injecté dans tous les textes => contenu suffisamment unique
// pour éviter le doorway/duplicate content.

import { Commune, REGIONS } from "./communes";

export function populationTier(p: number): 1 | 2 | 3 | 4 {
  if (p >= 200000) return 1; // métropole
  if (p >= 80000) return 2; // grande ville
  if (p >= 30000) return 3; // ville moyenne
  return 4; // petite ville
}

const TIER_LABEL: Record<number, string> = {
  1: "métropole",
  2: "grande ville",
  3: "ville moyenne",
  4: "ville",
};

// Contexte économique régional — 1 paragraphe par région
const REGION_CONTEXT: Record<string, string> = {
  "11": "L'Île-de-France concentre une part majeure du e-commerce français, avec une proximité directe aux centres logistiques Amazon de Brétigny, Saran et Lauwin-Planque. Les vendeurs y bénéficient de délais d'expédition courts et d'un accès rapide aux principaux grossistes nationaux.",
  "84": "L'Auvergne-Rhône-Alpes est un bassin industriel et logistique majeur, traversé par les flux Nord-Sud. Les vendeurs Amazon FBA y trouvent un tissu dense de fournisseurs, de transporteurs et de prestataires de préparation de commandes.",
  "93": "La région Provence-Alpes-Côte d'Azur dispose du port de Marseille-Fos, premier port français, ce qui en fait une zone d'arrivée privilégiée pour les imports de produits Amazon. La proximité avec les douanes simplifie les opérations d'importation.",
  "76": "L'Occitanie combine un tissu de PME exportatrices et une logistique structurée autour de Toulouse et Montpellier. Les vendeurs FBA y trouvent un équilibre entre coûts logistiques maîtrisés et accès aux marchés européens.",
  "75": "La Nouvelle-Aquitaine, vaste et diversifiée, offre des opportunités de sourcing local (alimentation, cosmétique, sport) particulièrement adaptées au marketplace Amazon. Bordeaux est un hub logistique en forte croissance.",
  "32": "Les Hauts-de-France abritent le centre logistique Amazon de Lauwin-Planque, l'un des plus importants d'Europe. La proximité avec la Belgique, les Pays-Bas et le Royaume-Uni en fait une zone stratégique pour le sourcing européen.",
  "44": "Le Grand Est bénéficie d'une position frontalière unique (Allemagne, Belgique, Luxembourg, Suisse), idéale pour sourcer auprès de grossistes européens et profiter de différentiels de prix sur les marketplaces Amazon de l'UE.",
  "52": "Les Pays de la Loire concentrent un tissu de fabricants et de PME industrielles, avec un port atlantique majeur (Nantes-Saint-Nazaire). Idéal pour le sourcing local et l'expédition vers FBA.",
  "53": "La Bretagne combine artisanat local et logistique portuaire (Brest, Saint-Malo). Les vendeurs FBA y trouvent des opportunités de produits différenciants (alimentation, cosmétique marine) souvent peu présents sur Amazon.",
  "28": "La Normandie, avec les ports du Havre et de Rouen, est une porte d'entrée majeure pour les imports. Les vendeurs Amazon FBA y bénéficient de coûts logistiques compétitifs et d'un accès direct aux fournisseurs internationaux.",
  "27": "La Bourgogne-Franche-Comté, centrale et bien desservie par l'autoroute A6, est un point de transit logistique pratique entre Paris, Lyon et la Suisse. Les coûts immobiliers y restent compétitifs pour un stockage tampon.",
  "24": "Le Centre-Val de Loire bénéficie d'une position centrale stratégique et accueille le centre logistique Amazon de Saran (Orléans). Les vendeurs FBA y trouvent un environnement direct pour préparer et expédier leurs marchandises.",
  "94": "La Corse impose des contraintes logistiques spécifiques (transport maritime, délais), que la maîtrise du FBA permet de contourner intégralement en déléguant le stockage à Amazon sur le continent.",
  "01": "La Guadeloupe présente des particularités logistiques liées à son éloignement métropolitain. Le modèle FBA permet aux entrepreneurs locaux de vendre sur Amazon France sans contrainte de stockage personnel.",
  "02": "La Martinique offre aux entrepreneurs locaux la possibilité de bâtir un business e-commerce sur Amazon France via FBA, en s'appuyant sur du sourcing métropolitain ou international.",
  "03": "La Guyane, par son éloignement, rend le modèle FBA particulièrement adapté : Amazon stocke et expédie depuis la métropole, vous gérez à distance.",
  "04": "La Réunion permet, grâce au modèle FBA, à des entrepreneurs réunionnais de vendre sur le marché métropolitain sans contrainte logistique propre.",
  "06": "Mayotte, comme les autres DOM, trouve dans le FBA un modèle économique viable pour vendre sur Amazon France sans gérer soi-même l'expédition.",
};

// Spécificité par palier de population
function tierIntro(name: string, tier: number, pop: number): string {
  const popStr = pop.toLocaleString("fr-FR");
  switch (tier) {
    case 1:
      return `${name}, avec ses ${popStr} habitants, est une métropole où le e-commerce et la vente sur Amazon connaissent une croissance forte. AMZing FBA accompagne les entrepreneurs et futurs vendeurs de ${name} qui souhaitent structurer une activité Amazon FBA sérieuse, avec une méthode claire et des outils adaptés.`;
    case 2:
      return `Vous habitez ${name} ou sa région et vous voulez développer une activité de vente sur Amazon FBA ? Avec ${popStr} habitants, ${name} concentre un tissu économique dynamique propice à l'entrepreneuriat digital. AMZing FBA vous accompagne à distance, sans déplacement.`;
    case 3:
      return `${name} (${popStr} habitants) est une ville à taille humaine où de plus en plus d'entrepreneurs se tournent vers la vente en ligne. AMZing FBA propose un accompagnement Amazon FBA structuré, pensé pour les profils qui veulent apprendre la méthode avant de se lancer.`;
    default:
      return `Pas besoin d'habiter Paris ou Lyon pour réussir sur Amazon FBA : depuis ${name}, vous pouvez bâtir une activité e-commerce sérieuse, à condition d'avoir la bonne méthode. AMZing FBA vous accompagne entièrement à distance, avec un suivi adapté à votre rythme.`;
  }
}

// 6 variations de section "pourquoi se lancer" rotées par index commune
const POURQUOI_VARIANTS = [
  (n: string) =>
    `Amazon est devenu en quelques années le canal de vente en ligne le plus consulté en France. À ${n} comme partout ailleurs, l'avantage du modèle FBA (Fulfilled by Amazon) est clair : vous envoyez vos produits dans un entrepôt Amazon, et la plateforme gère le stockage, l'expédition, le service client et les retours. Vous vous concentrez sur la sélection produit, l'achat et le pilotage de votre activité.`,
  (n: string) =>
    `Pour un entrepreneur basé à ${n}, vendre sur Amazon présente un avantage majeur : vous touchez immédiatement des millions de clients sans avoir à construire votre propre trafic. Le FBA enlève la contrainte logistique, qui est généralement le principal frein des nouveaux e-commerçants.`,
  (n: string) =>
    `Beaucoup de personnes à ${n} hésitent à se lancer sur Amazon, soit par manque de temps, soit par peur de mal faire. C'est précisément pour ces profils qu'AMZing FBA existe : nous structurons la démarche, nous identifions les bons produits et nous évitons les erreurs coûteuses du démarrage.`,
  (n: string) =>
    `À ${n}, vendre sur Amazon n'a plus rien d'expérimental : c'est un modèle économique éprouvé, utilisé par des milliers d'entrepreneurs français. La différence entre ceux qui réussissent et ceux qui échouent tient presque toujours à la méthode et à la rigueur de l'analyse produit.`,
  (n: string) =>
    `Le FBA n'est pas réservé à une élite parisienne. Depuis ${n}, avec un ordinateur et une méthode rigoureuse, vous pouvez démarrer une activité Amazon viable. L'accompagnement AMZing FBA vise à compresser votre courbe d'apprentissage de plusieurs mois.`,
  (n: string) =>
    `${n} fait partie des villes françaises où la vente en ligne se développe rapidement. Le modèle Amazon FBA séduit parce qu'il est concret : vous achetez un produit, vous l'envoyez chez Amazon, Amazon vend et expédie. Mais sans méthode pour sélectionner les produits, l'échec est quasi assuré.`,
];

// 5 variations de section méthode
const METHODE_VARIANTS = [
  (n: string) =>
    `L'accompagnement AMZing FBA pour les vendeurs de ${n} et de toute la France s'articule autour de quatre piliers : compréhension du marché Amazon, sourcing produit, analyse de rentabilité, structuration de l'activité. Chaque pilier fait l'objet d'outils et de méthodes spécifiques.`,
  (n: string) =>
    `Notre méthode pour les entrepreneurs de ${n} suit un fil conducteur précis : d'abord comprendre les règles du jeu Amazon (frais, FBA, FBM, taxes), ensuite identifier les bons produits avec nos outils d'analyse, puis structurer juridiquement et fiscalement votre activité.`,
  (n: string) =>
    `Pour un futur vendeur à ${n}, l'erreur la plus fréquente est de se lancer trop vite, sans avoir validé la rentabilité d'un produit. Notre méthode inverse ce schéma : on calcule d'abord la marge nette, on valide la concurrence, on évalue le risque, puis seulement on achète.`,
  (n: string) =>
    `La méthode AMZing FBA pour les vendeurs basés à ${n} s'appuie sur des outils concrets : calculateur de rentabilité Amazon, analyse Keepa, sourcing assisté par IA, suivi des marges. L'objectif est de remplacer l'intuition par la donnée.`,
  (n: string) =>
    `Depuis ${n} ou ailleurs, l'accompagnement fonctionne en visioconférence et via une plateforme d'outils accessibles 24/7. Pas besoin de se déplacer : tout est fait pour que vous puissiez avancer à votre rythme, en parallèle de votre activité actuelle.`,
];

// 5 variations FAQ
const FAQ_VARIANTS = [
  (n: string) => ({
    q: `Faut-il habiter à ${n} pour être accompagné par AMZing FBA ?`,
    a: `Non, l'accompagnement se fait entièrement à distance, par visioconférence et via notre plateforme d'outils. Que vous soyez à ${n}, à Paris ou dans un village, l'accès est le même.`,
  }),
  (n: string) => ({
    q: `Combien de temps faut-il prévoir pour se lancer depuis ${n} ?`,
    a: `Cela dépend de votre disponibilité, mais en règle générale, comptez 4 à 12 semaines entre le début de l'accompagnement et les premières ventes, selon le temps que vous consacrez chaque semaine au projet.`,
  }),
  (n: string) => ({
    q: `Quel budget de démarrage faut-il prévoir pour Amazon FBA à ${n} ?`,
    a: `Le budget dépend de la stratégie choisie (arbitrage, wholesale, marque propre). Lors du premier échange, nous évaluons ensemble ce qui est cohérent avec votre situation, sans promesse irréaliste.`,
  }),
  (n: string) => ({
    q: `Est-ce qu'AMZing FBA garantit des revenus à un vendeur de ${n} ?`,
    a: `Non. Aucun accompagnement sérieux ne peut garantir de revenus. La vente sur Amazon comporte des risques (stock invendu, baisses de prix, suspension de compte). Nous vous donnons une méthode et des outils, le résultat dépend de votre travail et des conditions de marché.`,
  }),
  (n: string) => ({
    q: `Comment se déroule la prise de contact pour un entrepreneur de ${n} ?`,
    a: `Vous remplissez un formulaire sur notre page accompagnement, nous échangeons par téléphone ou visio pour comprendre votre situation, puis nous vous proposons la formule la plus adaptée à votre profil.`,
  }),
];

export interface CommuneContent {
  intro: string;
  pourquoi: string;
  methode: string;
  regionContext: string;
  faq: { q: string; a: string }[];
  metaTitle: string;
  metaDescription: string;
  tierLabel: string;
  regionName: string;
}

export function buildContent(c: Commune, index: number): CommuneContent {
  const tier = populationTier(c.p);
  const regionName = REGIONS[c.r] ?? "France";
  const pourquoi = POURQUOI_VARIANTS[index % POURQUOI_VARIANTS.length](c.n);
  const methode = METHODE_VARIANTS[index % METHODE_VARIANTS.length](c.n);
  const regionContext = REGION_CONTEXT[c.r] ?? "";
  // 3 FAQ rotatives par ville
  const faq = [
    FAQ_VARIANTS[index % FAQ_VARIANTS.length](c.n),
    FAQ_VARIANTS[(index + 1) % FAQ_VARIANTS.length](c.n),
    FAQ_VARIANTS[(index + 2) % FAQ_VARIANTS.length](c.n),
    {
      q: `Pourquoi choisir AMZing FBA depuis ${c.n} ?`,
      a: `AMZing FBA s'adresse aux personnes sérieuses qui veulent une méthode, pas une promesse miracle. À ${c.n} comme partout en France, nous accompagnons les entrepreneurs qui acceptent de travailler une activité de fond sur Amazon.`,
    },
  ];
  return {
    intro: tierIntro(c.n, tier, c.p),
    pourquoi,
    methode,
    regionContext,
    faq,
    metaTitle: `Accompagnement Amazon FBA à ${c.n} (${c.d}) | AMZing FBA`,
    metaDescription: `Accompagnement Amazon FBA pour les entrepreneurs de ${c.n} et du département ${c.d}. Méthode, sourcing, analyse de rentabilité. 100% à distance.`,
    tierLabel: TIER_LABEL[tier],
    regionName,
  };
}
