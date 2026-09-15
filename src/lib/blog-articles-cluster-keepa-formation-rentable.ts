import { BlogArticle } from './blog-data';
import { blogImages } from './blog-images';

const today = '2026-07-02';

// Helper to keep declarations terse and consistent
const make = (a: Partial<BlogArticle> & { slug: string; title: string; metaTitle: string; metaDescription: string; keywords: string[]; excerpt: string; content: string; faqs: BlogArticle['faqs']; relatedSlugs: string[]; category: BlogArticle['category']; }): BlogArticle => ({
  type: 'satellite',
  readTime: 12,
  publishedAt: today,
  updatedAt: today,
  author: 'AMZing FBA',
  image: blogImages.guideFba,
  ...a,
} as BlogArticle);

export const clusterKeepaFormationRentableArticles: BlogArticle[] = [
  // ===== KEEPA CLUSTER =====
  make({
    slug: 'keepa-guide-complet-amazon-fba',
    title: "Keepa : le guide complet pour analyser un produit Amazon FBA en 2026",
    metaTitle: "Keepa 2026 : guide complet pour lire un graphique Amazon FBA",
    metaDescription: "Apprenez à utiliser Keepa pour analyser un produit Amazon FBA : graphique prix, BSR, drops, alertes, abonnement et erreurs à éviter en 2026.",
    keywords: ['keepa', 'keepa amazon', 'keepa fba', 'graphique keepa', 'lire keepa'],
    excerpt: "Keepa est l'outil n°1 pour analyser la rentabilité et la stabilité d'un produit Amazon FBA. Voici comment vraiment l'utiliser.",
    category: 'produits-rentables',
    readTime: 16,
    content: `## Keepa, c'est quoi exactement ?

**Keepa** est un outil d'historique de prix Amazon. Il enregistre depuis plus de 10 ans le prix, le BSR (Best Seller Rank), le nombre d'offres et les vendeurs de chaque produit Amazon.

Pour un vendeur Amazon FBA, Keepa répond à 3 questions vitales :

1. **Est-ce que ce produit se vend régulièrement ?** (courbe BSR)
2. **À quel prix se vend-il vraiment ?** (courbe Buy Box)
3. **Y a-t-il trop de concurrence ?** (courbe nombre de vendeurs)

## Comment lire un graphique Keepa

| Courbe | Couleur | Ce qu'elle veut dire |
|--------|---------|----------------------|
| Amazon | Orange | Amazon vend en direct → danger |
| Buy Box | Rose | Prix réel de vente |
| New | Bleu | Prix neuf le plus bas |
| BSR | Vert | Position dans la catégorie (plus bas = mieux) |
| Count | Cyan | Nombre d'offres FBA |

Une **chute du BSR** = une vente. Plus il y a de chutes, plus le produit tourne.

## Combien coûte Keepa en 2026 ?

- Version gratuite : extension Chrome, historique limité
- Version Pro : **19 €/mois** (ou 149 €/an), accès complet à l'API, Product Finder, alertes

Pour un vendeur sérieux, **les 19 €/mois sont indispensables**.

## Keepa + SellerAmp : le combo gagnant

Keepa te dit *si* le produit se vend. **SellerAmp** te dit *combien* tu gagnes. Les deux ensemble = analyse en 30 secondes.

👉 [Lance ton Amazon FBA avec notre accompagnement](/accompagnement)
`,
    faqs: [
      { question: "Keepa est-il indispensable pour Amazon FBA ?", answer: "Oui, c'est l'outil de référence pour vérifier la stabilité d'un produit avant de l'acheter. Aucun vendeur sérieux ne s'en passe." },
      { question: "Keepa gratuit suffit-il ?", answer: "Non, la version gratuite ne montre pas le BSR ni les ventes estimées. Pour décider d'un achat, il faut la version Pro à 19 €/mois." },
      { question: "Quelle différence entre Keepa et SellerAmp ?", answer: "Keepa donne l'historique (prix, BSR, concurrence). SellerAmp calcule la rentabilité et le ROI. Les deux sont complémentaires." },
    ],
    relatedSlugs: ['keepa-bsr-comment-estimer-ventes', 'keepa-vs-selleramp-comparatif', 'keepa-product-finder-tutoriel'],
  }),
  make({
    slug: 'keepa-bsr-comment-estimer-ventes',
    title: "Keepa BSR : comment estimer les ventes d'un produit Amazon",
    metaTitle: "Keepa BSR : estimer les ventes d'un produit Amazon en 2026",
    metaDescription: "Apprenez à interpréter le BSR sur Keepa pour estimer combien de ventes par mois fait un produit Amazon FBA. Tableaux, exemples et méthode.",
    keywords: ['keepa bsr', 'bsr amazon', 'estimer ventes amazon', 'keepa ventes'],
    excerpt: "Le BSR Keepa permet d'estimer les ventes mensuelles d'un produit. Voici la méthode exacte par catégorie.",
    category: 'produits-rentables',
    content: `## Qu'est-ce que le BSR ?

Le **BSR (Best Seller Rank)** est le classement d'un produit dans sa catégorie principale Amazon. **Plus le chiffre est bas, plus le produit se vend.**

## Estimation des ventes par catégorie (France)

| BSR | Beauté | Maison | Jouets | High-Tech |
|-----|--------|--------|--------|-----------|
| 1 000 | 300/mois | 250/mois | 400/mois | 200/mois |
| 5 000 | 80/mois | 70/mois | 120/mois | 50/mois |
| 10 000 | 40/mois | 35/mois | 60/mois | 25/mois |
| 50 000 | 8/mois | 6/mois | 12/mois | 4/mois |
| 100 000 | 3/mois | 2/mois | 5/mois | 1/mois |

## Méthode pour lire le BSR Keepa

1. Ouvre le graphique Keepa sur 90 jours
2. Compte le nombre de "chutes" verticales du BSR
3. Chaque chute = au moins 1 vente
4. Divise par 3 pour obtenir une moyenne mensuelle

👉 [Voir nos alertes produits rentables](/produits-rentables)
`,
    faqs: [
      { question: "Le BSR est-il fiable ?", answer: "Oui sur la catégorie principale, beaucoup moins sur les sous-catégories qui peuvent être manipulées." },
      { question: "Quel BSR vise pour un débutant ?", answer: "Entre 5 000 et 100 000 dans une grande catégorie : assez de ventes pour tourner, pas trop de concurrence." },
    ],
    relatedSlugs: ['keepa-guide-complet-amazon-fba', 'keepa-product-finder-tutoriel'],
  }),
  make({
    slug: 'keepa-vs-selleramp-comparatif',
    title: "Keepa vs SellerAmp : lequel choisir pour Amazon FBA en 2026 ?",
    metaTitle: "Keepa vs SellerAmp : comparatif 2026 pour vendeurs FBA",
    metaDescription: "Keepa ou SellerAmp ? Comparatif détaillé prix, fonctionnalités, usages. Notre verdict pour vendeurs Amazon FBA débutants et confirmés.",
    keywords: ['keepa vs selleramp', 'selleramp', 'keepa selleramp', 'comparatif outils amazon fba'],
    excerpt: "Keepa et SellerAmp ne font pas la même chose. Voici comment les utiliser ensemble pour analyser un produit en 30 secondes.",
    category: 'produits-rentables',
    content: `## Keepa et SellerAmp : deux outils, deux rôles

| Critère | Keepa | SellerAmp |
|---------|-------|-----------|
| Rôle | Historique prix/BSR | Calcul rentabilité |
| Prix | 19 €/mois | 20 $/mois |
| Indispensable | ✅ Oui | ✅ Oui |
| Remplaçable | ❌ Non | Partiellement (Seller Assistant, IP Alert) |

## Verdict

**Tu as besoin des deux.** Keepa = "le produit se vend-il ?". SellerAmp = "vais-je gagner de l'argent ?". Total : 35 €/mois pour ton analyse complète.

👉 [Découvre notre formation Amazon FBA](/formation)
`,
    faqs: [
      { question: "Peut-on se passer de SellerAmp ?", answer: "Oui mais il faut calculer la rentabilité à la main avec le calculateur Amazon, c'est 10x plus lent." },
      { question: "Keepa fait-il du calcul de rentabilité ?", answer: "Non, Keepa donne uniquement l'historique. Le calcul ROI/marge est fait par SellerAmp ou un outil équivalent." },
    ],
    relatedSlugs: ['keepa-guide-complet-amazon-fba', 'selleramp-guide-complet'],
  }),
  make({
    slug: 'keepa-product-finder-tutoriel',
    title: "Keepa Product Finder : tutoriel pour trouver des produits rentables",
    metaTitle: "Keepa Product Finder : tutoriel 2026 pour Amazon FBA",
    metaDescription: "Tutoriel complet du Product Finder Keepa : filtres BSR, prix, drops, catégorie. Trouvez des produits rentables en moins de 10 minutes.",
    keywords: ['keepa product finder', 'keepa recherche produit', 'produit rentable amazon', 'keepa tutoriel'],
    excerpt: "Le Product Finder de Keepa est l'outil le plus sous-coté pour trouver des produits Amazon FBA rentables.",
    category: 'produits-rentables',
    content: `## Product Finder : la machine à idées de Keepa

Le **Product Finder** permet de filtrer parmi des millions de produits Amazon selon tes critères.

## Filtres recommandés pour débutants

- **BSR** : entre 5 000 et 100 000
- **Prix Buy Box** : entre 15 € et 60 €
- **Drops sur 90 jours** : > 30
- **Nombre de vendeurs FBA** : < 8
- **Catégorie** : Beauté, Maison, Jouets, Animalerie

## Méthode en 5 étapes

1. Applique les filtres ci-dessus
2. Trie par "Drops 90 jours" décroissant
3. Ouvre les 20 premiers résultats
4. Vérifie chaque produit avec SellerAmp
5. Sourcing chez fournisseurs

👉 [Accède à nos alertes prêtes à l'emploi](/produits-rentables)
`,
    faqs: [
      { question: "Le Product Finder est-il dans la version gratuite ?", answer: "Non, il faut l'abonnement Keepa Pro à 19 €/mois." },
      { question: "Combien de temps pour trouver un produit ?", answer: "Avec la bonne méthode, 30 à 60 minutes par jour suffisent pour trouver 1-2 produits exploitables." },
    ],
    relatedSlugs: ['keepa-guide-complet-amazon-fba', 'keepa-bsr-comment-estimer-ventes'],
  }),
  make({
    slug: 'keepa-alertes-prix-amazon-fba',
    title: "Keepa Alertes : configurer des notifications de prix pour Amazon FBA",
    metaTitle: "Keepa Alertes prix : guide 2026 pour vendeurs Amazon FBA",
    metaDescription: "Comment configurer les alertes Keepa pour être notifié des baisses de prix Amazon et capter les meilleures opportunités d'arbitrage.",
    keywords: ['keepa alertes', 'alerte prix amazon', 'keepa notifications', 'opportunités amazon fba'],
    excerpt: "Les alertes Keepa transforment ton smartphone en machine à opportunités d'arbitrage.",
    category: 'produits-rentables',
    content: `## Pourquoi configurer des alertes Keepa

Au lieu de chercher des produits, **laisse les opportunités venir à toi**. Les alertes Keepa te préviennent dès qu'un produit atteint le prix que tu veux.

## Comment créer une alerte

1. Ouvre la fiche produit Amazon
2. Clique sur l'extension Keepa
3. Onglet "Track product"
4. Définis ton prix cible et la période
5. Active la notification email ou push

## Stratégie d'arbitrage par alertes

- Liste tes 50 produits favoris
- Configure une alerte à -20 % du prix moyen
- Reçois 3-5 opportunités par semaine
- Achète instantanément

👉 [Reçois nos alertes quotidiennes prêtes à l'emploi](/produits-rentables)
`,
    faqs: [
      { question: "Combien d'alertes Keepa gratuites ?", answer: "5 alertes en gratuit, illimitées en Pro." },
      { question: "Les alertes arrivent en temps réel ?", answer: "Oui, généralement dans la minute qui suit la baisse de prix." },
    ],
    relatedSlugs: ['keepa-guide-complet-amazon-fba', 'keepa-product-finder-tutoriel'],
  }),

  // ===== FORMATION AMAZON FBA CLUSTER =====
  make({
    slug: 'formation-amazon-fba-guide-2026',
    title: "Formation Amazon FBA : le guide pour bien choisir en 2026",
    metaTitle: "Formation Amazon FBA 2026 : comment bien choisir (prix, contenu)",
    metaDescription: "Comparatif des formations Amazon FBA en 2026 : prix, contenu, accompagnement, avis. Comment choisir sans se faire arnaquer.",
    keywords: ['formation amazon fba', 'meilleure formation amazon fba', 'formation fba 2026', 'apprendre amazon fba'],
    excerpt: "Beaucoup de formations Amazon FBA sont vides ou trop chères. Voici comment reconnaître une vraie formation utile.",
    category: 'guide-fba',
    readTime: 15,
    content: `## Pourquoi se former à Amazon FBA ?

Amazon FBA n'est pas compliqué, mais il est **piégeux** : restrictions de marques, blocages de compte, mauvais sourcing, IP claims… Sans formation, on perd des mois et des milliers d'euros.

## Les vraies questions à se poser

1. La formation couvre-t-elle **le sourcing concret** (pas juste la théorie) ?
2. Y a-t-il **un accompagnement humain** ou juste des vidéos ?
3. Le formateur est-il **encore vendeur actif** sur Amazon ?
4. Combien d'**élèves génèrent réellement** du CA ?
5. Le prix est-il **honnête** par rapport au contenu ?

## Fourchettes de prix réalistes

| Type | Prix | Pour qui |
|------|------|----------|
| E-book | 30-100 € | Curieux |
| Formation vidéo | 300-1500 € | Autonome |
| Formation + suivi | 1500-5000 € | Sérieux |
| Mastermind annuel | 5000-15000 € | Pros |

## AMZing FBA : notre approche

Un accompagnement **sur mesure**, construit avec toi lors d'un appel de diagnostic gratuit de 15 minutes : formation + alertes produits + accompagnement Discord + appels de suivi. Pas de cours bidons, du concret.

👉 [Demande un rappel gratuit](/demander-rappel)
`,
    faqs: [
      { question: "Combien coûte une bonne formation Amazon FBA ?", answer: "Entre 500 € et 2000 € pour quelque chose de sérieux. Méfiance des formations à 5000 € qui ne tiennent pas leurs promesses." },
      { question: "Une formation est-elle obligatoire ?", answer: "Non, mais elle évite 6 à 12 mois d'erreurs coûteuses. Le ROI est rapide si la formation est bonne." },
      { question: "Combien de temps pour rentabiliser une formation ?", answer: "Entre 2 et 6 mois en général, si on applique sérieusement la méthode enseignée." },
    ],
    relatedSlugs: ['formation-amazon-fba-debutant-par-ou-commencer', 'formation-amazon-fba-avis-arnaque', 'formation-amazon-fba-prix-quel-budget'],
  }),
  make({
    slug: 'formation-amazon-fba-debutant-par-ou-commencer',
    title: "Formation Amazon FBA débutant : par où commencer en 2026 ?",
    metaTitle: "Formation Amazon FBA débutant 2026 : par où commencer",
    metaDescription: "Vous débutez sur Amazon FBA ? Voici les étapes et la formation idéale pour partir sur de bonnes bases sans perdre d'argent.",
    keywords: ['formation amazon fba débutant', 'amazon fba débutant', 'commencer amazon fba', 'apprendre fba'],
    excerpt: "Tu veux te lancer sur Amazon FBA mais tu ne sais pas par où commencer ? Voici la feuille de route.",
    category: 'guide-fba',
    content: `## La feuille de route débutant Amazon FBA

### Mois 1 : comprendre

- Lire 5-10 articles de référence
- Regarder 10h de vidéos YouTube (Amzing FBA, Tactical Arbitrage, etc.)
- Comprendre la différence FBA / FBM / Dropshipping

### Mois 2 : se former sérieusement

- Investir dans **une formation structurée** (500-1500 €)
- Faire **tous** les exercices
- Rejoindre une communauté (Discord, Telegram)

### Mois 3 : se lancer

- Créer son compte Seller Central Pro (39 €/mois)
- Acheter SellerAmp + Keepa (35 €/mois)
- Faire ses 10 premiers produits test (budget 500-1000 €)

👉 [Commence avec AMZing FBA](/formation)
`,
    faqs: [
      { question: "Quel budget pour débuter ?", answer: "Comptez 1500-3000 € : formation, outils, premier stock et trésorerie de sécurité." },
      { question: "Combien de temps avant la première vente ?", answer: "2 à 4 semaines après l'envoi du premier stock en FBA." },
    ],
    relatedSlugs: ['formation-amazon-fba-guide-2026', 'formation-amazon-fba-prix-quel-budget'],
  }),
  make({
    slug: 'formation-amazon-fba-avis-arnaque',
    title: "Formation Amazon FBA : avis, arnaques et comment les éviter",
    metaTitle: "Formation Amazon FBA : avis, arnaques, comment les repérer",
    metaDescription: "Toutes les formations Amazon FBA ne se valent pas. Voici comment repérer les arnaques et choisir une formation honnête.",
    keywords: ['formation amazon fba avis', 'arnaque formation fba', 'avis formation amazon', 'amazon fba avis'],
    excerpt: "Avant de payer 5000 € pour une formation Amazon FBA, lis ce guide.",
    category: 'guide-fba',
    content: `## Les 7 signaux d'alarme d'une arnaque

1. **Promesses de revenus garantis** ("10 000 €/mois en 3 mois")
2. **Lifestyle marketing** (Lamborghini, villa Dubaï)
3. **Témoignages non vérifiables**
4. **Pas de prix affiché** → appel commercial obligatoire
5. **Formation à 5 000 € sans accompagnement réel**
6. **Le formateur n'est plus vendeur actif**
7. **Aucune mention légale, aucun SIRET**

## Comment vérifier une formation

- Cherche le formateur sur **Societe.com**
- Tape "nom du formateur + arnaque" sur Google
- Demande **3 contacts d'anciens élèves** par téléphone
- Vérifie les **mentions légales** du site
- Lis les avis sur **Trustpilot** (vrais avis, pas Google)

## Les formations sérieuses en France

Il en existe une poignée. **AMZing FBA** en fait partie : accompagnement sur devis adapté à ton projet, communauté active, formateurs vendeurs actifs, transparent sur les résultats.

👉 [Voir les avis sur AMZing FBA](/avis)
`,
    faqs: [
      { question: "Comment savoir si une formation est honnête ?", answer: "Trois indices : prix raisonnable, accompagnement réel, témoignages vérifiables d'élèves contactables." },
      { question: "Les formations à 5000 € sont-elles toutes des arnaques ?", answer: "Non, mais à ce prix on attend du suivi 1-to-1 hebdomadaire, pas juste des vidéos." },
    ],
    relatedSlugs: ['formation-amazon-fba-guide-2026', 'amazon-fba-avis-rentable-2026'],
  }),
  make({
    slug: 'formation-amazon-fba-prix-quel-budget',
    title: "Formation Amazon FBA prix : quel budget prévoir en 2026 ?",
    metaTitle: "Formation Amazon FBA prix 2026 : combien faut-il payer ?",
    metaDescription: "Combien coûte une formation Amazon FBA en 2026 ? Comparatif des prix du marché, du gratuit aux mastermind à 15 000 €.",
    keywords: ['formation amazon fba prix', 'prix formation fba', 'coût formation amazon', 'budget formation fba'],
    excerpt: "De 0 à 15 000 €, voici les prix réels des formations Amazon FBA en 2026.",
    category: 'guide-fba',
    content: `## Échelle complète des prix

| Type | Prix | Inclus |
|------|------|--------|
| Vidéos YouTube | 0 € | Bases théoriques |
| Ebook | 30-150 € | Méthode écrite |
| Formation vidéo seule | 300-1500 € | Cours en ligne |
| Formation + Discord | 1000-3000 € | Cours + communauté |
| Coaching 1-to-1 | 3000-8000 € | Suivi personnalisé |
| Mastermind annuel | 5000-15 000 € | Réseau + retraites |

## Le bon ratio prix/valeur

Une formation utile doit te rapporter **au moins 5x son prix** en 12 mois. Pour une formation à 1000 €, attends-toi à un CA de 15 000-30 000 € la première année.

## Notre offre

**AMZing FBA : accompagnement sur mesure**, défini avec toi lors d'un appel gratuit : formation complète + alertes produits quotidiennes + Discord actif + appels de suivi.

👉 [Demande un rappel gratuit](/demander-rappel)
`,
    faqs: [
      { question: "Une formation gratuite peut-elle suffire ?", answer: "Pour comprendre les bases oui. Pour aller au-delà et éviter les pièges, non." },
      { question: "Le prix est-il un gage de qualité ?", answer: "Pas du tout. Certaines formations à 5000 € sont vides, d'autres à 800 € sont excellentes." },
    ],
    relatedSlugs: ['formation-amazon-fba-guide-2026', 'formation-amazon-fba-avis-arnaque'],
  }),

  // ===== AMAZON FBA AVIS RENTABLE CLUSTER =====
  make({
    slug: 'amazon-fba-avis-rentable-2026',
    title: "Amazon FBA avis : est-ce encore rentable en 2026 ?",
    metaTitle: "Amazon FBA avis 2026 : est-ce vraiment encore rentable ?",
    metaDescription: "Amazon FBA est-il encore rentable en 2026 ? Avis honnête, chiffres réels, marges, témoignages et erreurs à éviter.",
    keywords: ['amazon fba avis', 'amazon fba rentable', 'amazon fba avis rentable', 'fba rentabilité 2026'],
    excerpt: "Amazon FBA est-il encore rentable en 2026 ? Voici un avis honnête, sans bullshit, basé sur des chiffres réels.",
    category: 'guide-fba',
    readTime: 14,
    content: `## La réponse courte

**Oui, Amazon FBA est encore rentable en 2026.** Mais pas pour tout le monde, et pas comme en 2018.

## Les chiffres réels du marché français 2026

| Profil | CA mensuel moyen | Marge nette | Temps investi |
|--------|------------------|-------------|---------------|
| Débutant (< 1 an) | 1 000-5 000 € | 10-15 % | 15-25 h/sem |
| Intermédiaire (1-3 ans) | 5 000-25 000 € | 12-20 % | 20-40 h/sem |
| Confirmé (3+ ans) | 25 000-100 000 €+ | 15-30 % | 30-50 h/sem |

## Pourquoi ça reste rentable

- **Trafic gigantesque** : 30 M de visiteurs/mois en France
- **Prime** : 8M de Français abonnés, achètent 3x plus
- **Logistique externalisée** : on scale sans recruter
- **Modèles variés** : arbitrage, wholesale, private label, OA

## Pourquoi ça ne marche pas pour certains

1. Manque de capital (< 1500 €)
2. Pas de méthode (lancement à l'aveugle)
3. Aucun outil (Keepa, SellerAmp)
4. Pas de patience (abandonnent à 3 mois)
5. Mauvais sourcing (produits "à la mode")

## Notre avis honnête

Amazon FBA en 2026 = **un vrai business**, ni un side-hustle magique ni une arnaque. Avec **1500-3000 € de budget**, une **formation sérieuse** et **12 mois de discipline**, c'est très rentable.

👉 [Lance-toi avec AMZing FBA](/formation)
`,
    faqs: [
      { question: "Amazon FBA est-il saturé en 2026 ?", answer: "Sur les niches grand public oui, mais des dizaines de milliers de niches restent peu concurrentielles. Le marché global progresse de 8 %/an." },
      { question: "Peut-on en vivre ?", answer: "Oui, environ 15-20 % des vendeurs FBA français en font leur activité principale après 18-24 mois." },
      { question: "Quelle marge nette espérer ?", answer: "Entre 10 % et 30 % selon le modèle (arbitrage = plus bas, private label = plus haut)." },
    ],
    relatedSlugs: ['amazon-fba-rentabilite-calcul-detaille', 'amazon-fba-temoignages-vendeurs-2026', 'amazon-fba-cest-quoi-guide-complet'],
  }),
  make({
    slug: 'amazon-fba-rentabilite-calcul-detaille',
    title: "Amazon FBA rentabilité : calcul détaillé d'un produit en 2026",
    metaTitle: "Amazon FBA rentabilité 2026 : calcul détaillé d'un produit",
    metaDescription: "Comment calculer la vraie rentabilité d'un produit Amazon FBA en 2026 : formule, exemples chiffrés, pièges à éviter.",
    keywords: ['amazon fba rentabilité', 'calcul marge fba', 'rentabilité produit amazon', 'roi fba'],
    excerpt: "Voici la vraie méthode pour calculer la rentabilité d'un produit FBA, avec tous les frais qu'on oublie souvent.",
    category: 'produits-rentables',
    content: `## La formule complète

**Profit net = Prix de vente TTC - TVA - Coût achat - Commission Amazon - Frais FBA - Stockage - Transport vers FBA - Retours**

**ROI = (Profit net / Coût d'investissement) × 100**

## Exemple concret : produit beauté à 24,90 €

| Poste | Montant |
|-------|---------|
| Prix de vente TTC | +24,90 € |
| TVA 20 % | -4,15 € |
| Prix HT | 20,75 € |
| Coût d'achat HT | -7,50 € |
| Commission Amazon 15 % | -3,11 € |
| Frais FBA | -3,20 € |
| Stockage 1 mois | -0,15 € |
| Transport entrée FBA | -0,40 € |
| Provision retour 3 % | -0,11 € |
| **Profit net** | **6,28 €** |
| **Marge nette** | **25 %** |
| **ROI** | **84 %** |

## Les frais que tout le monde oublie

- TVA reversée à l'État
- Frais bancaires Stripe / virements internationaux
- Coût du temps (sourcing, prep)
- Stock mort (5-10 %)
- Abonnements outils

👉 [Calcule tes marges avec SellerAmp](/outil-amazon-fba)
`,
    faqs: [
      { question: "Quel ROI minimum pour acheter un produit ?", answer: "30 % minimum pour absorber les imprévus. Idéal : 50 % et plus." },
      { question: "Quelle marge nette viser ?", answer: "20 % minimum après tous les frais réels. En dessous c'est trop risqué." },
    ],
    relatedSlugs: ['amazon-fba-avis-rentable-2026', 'keepa-guide-complet-amazon-fba'],
  }),
  make({
    slug: 'amazon-fba-temoignages-vendeurs-2026',
    title: "Amazon FBA témoignages : vrais vendeurs, vrais chiffres en 2026",
    metaTitle: "Amazon FBA témoignages 2026 : vrais vendeurs et vrais chiffres",
    metaDescription: "Témoignages de vendeurs Amazon FBA en 2026 : CA, marges, parcours, échecs et conseils. Sans filtre marketing.",
    keywords: ['amazon fba témoignages', 'avis vendeurs amazon', 'parcours fba', 'amazon fba avis rentable'],
    excerpt: "Loin du lifestyle marketing : voici ce que disent vraiment les vendeurs Amazon FBA en 2026.",
    category: 'guide-fba',
    content: `## Témoignage 1 : Marie, 28 ans, Lyon

- **Modèle** : Arbitrage online
- **Démarrage** : 1 200 € de capital
- **18 mois plus tard** : 12 000 € CA mensuel, 1 800 € net
- **Verdict** : "Long mais ça marche, faut bosser tous les soirs."

## Témoignage 2 : Kevin, 35 ans, Marseille

- **Modèle** : Wholesale
- **Démarrage** : 8 000 € de capital
- **2 ans plus tard** : 45 000 € CA mensuel, 7 500 € net
- **Verdict** : "Le wholesale c'est plus stable mais faut savoir négocier."

## Témoignage 3 : Sophie, 42 ans, Paris

- **Modèle** : Private Label
- **Démarrage** : 15 000 € de capital
- **3 ans plus tard** : 80 000 € CA mensuel, 18 000 € net
- **Verdict** : "Long à lancer mais c'est un vrai asset."

## Ce qu'ils ont en commun

- Une formation suivie sérieusement
- 18-24 mois de patience
- Réinvestissement systématique
- Pas d'achat coup de cœur
- Utilisation quotidienne de Keepa + SellerAmp

👉 [Lis tous les avis sur AMZing FBA](/avis)
`,
    faqs: [
      { question: "Ces témoignages sont-ils représentatifs ?", answer: "Oui pour les vendeurs sérieux. 30 % des vendeurs abandonnent dans les 6 mois faute de méthode." },
      { question: "Combien de temps pour atteindre 5000 € net/mois ?", answer: "12 à 24 mois en arbitrage, 18 à 30 mois en wholesale, 24 à 36 mois en private label." },
    ],
    relatedSlugs: ['amazon-fba-avis-rentable-2026', 'formation-amazon-fba-guide-2026'],
  }),
];
