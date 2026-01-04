// ============================================
// DONNÉES DU BLOG SEO - ARCHITECTURE EN SILOS
// ============================================

export interface BlogFAQ {
  question: string;
  answer: string;
}

export interface BlogArticle {
  slug: string;
  title: string;
  metaTitle: string;
  metaDescription: string;
  keywords: string[];
  excerpt: string;
  category: 'guide-fba' | 'produits-rentables' | 'logistique' | 'vendre-amazon';
  type: 'pilier' | 'satellite';
  readTime: number;
  publishedAt: string;
  updatedAt: string;
  author: string;
  image: string;
  content: string;
  faqs: BlogFAQ[];
  relatedSlugs: string[];
}

// ============================================
// ARTICLES PILIERS
// ============================================

const pilierGuideFba: BlogArticle = {
  slug: 'amazon-fba-cest-quoi-guide-complet',
  title: "Amazon FBA c'est quoi ? Le Guide Complet 2025",
  metaTitle: "Amazon FBA c'est quoi ? Guide Complet pour Débutants [2025]",
  metaDescription: "Découvrez Amazon FBA : fonctionnement, avantages, coûts et étapes pour débuter. Guide expert pour lancer votre business e-commerce sur Amazon en 2025.",
  keywords: ['amazon fba', "amazon fba c'est quoi", 'fba définition', 'fulfilled by amazon', 'vendre sur amazon', 'business amazon'],
  excerpt: "Amazon FBA (Fulfillment by Amazon) est un service où Amazon stocke, expédie et gère le service client pour vos produits. Découvrez comment ce modèle peut transformer votre business e-commerce.",
  category: 'guide-fba',
  type: 'pilier',
  readTime: 18,
  publishedAt: '2025-01-04',
  updatedAt: '2025-01-04',
  author: 'AMZing FBA',
  image: '/hero-warehouse.jpg',
  relatedSlugs: ['amazon-fba-vs-fbm', 'combien-coute-amazon-fba', 'comment-debuter-amazon-fba'],
  faqs: [
    {
      question: "Qu'est-ce que Amazon FBA exactement ?",
      answer: "Amazon FBA (Fulfillment by Amazon) est un service logistique proposé par Amazon. Vous envoyez vos produits dans les entrepôts Amazon, et ils se chargent du stockage, de l'emballage, de l'expédition aux clients, et même du service après-vente. Cela vous permet de vous concentrer sur le sourcing et le marketing plutôt que sur la logistique."
    },
    {
      question: "Est-ce rentable de vendre sur Amazon FBA en 2025 ?",
      answer: "Oui, Amazon FBA reste rentable en 2025, mais cela dépend de votre stratégie. Les vendeurs qui réussissent sont ceux qui maîtrisent le sourcing de produits rentables, l'analyse de la concurrence, et l'optimisation de leurs marges. Avec les bons outils et formations, des marges de 20 à 40% sont atteignables."
    },
    {
      question: "Combien faut-il investir pour débuter sur Amazon FBA ?",
      answer: "Le budget de départ varie selon votre stratégie. Pour l'arbitrage online, comptez 500 à 2000€. Pour le wholesale, prévoyez 3000 à 10000€. Pour le private label, le budget démarre généralement à 5000€ et peut aller jusqu'à 20000€ ou plus pour une marque solide."
    },
    {
      question: "Quelle est la différence entre FBA et FBM ?",
      answer: "FBA (Fulfillment by Amazon) signifie qu'Amazon gère toute la logistique. FBM (Fulfillment by Merchant) signifie que vous gérez vous-même le stockage et l'expédition. FBA offre l'éligibilité Prime et un meilleur référencement, mais implique des frais supplémentaires. FBM offre plus de contrôle mais demande plus de travail."
    },
    {
      question: "Faut-il créer une entreprise pour vendre sur Amazon ?",
      answer: "Oui, pour vendre sérieusement sur Amazon en France, vous devez avoir un statut juridique. L'auto-entrepreneur est idéal pour débuter avec un chiffre d'affaires limité. Pour des volumes plus importants, une SASU ou EURL est recommandée pour optimiser la fiscalité et les charges sociales."
    }
  ],
  content: `
## 📌 Résumé (TL;DR)

Amazon FBA (Fulfillment by Amazon) est le service logistique d'Amazon qui révolutionne le e-commerce. Vous envoyez vos produits dans leurs entrepôts, Amazon gère le stockage, l'expédition, et le SAV. Résultat : vous vous concentrez sur ce qui compte (sourcing, marketing) pendant qu'Amazon fait le reste. En 2025, ce modèle reste l'un des plus accessibles pour créer un business e-commerce rentable.

---

## Qu'est-ce que Amazon FBA et comment ça fonctionne ?

Amazon FBA, ou "Fulfillment by Amazon" (Expédié par Amazon en français), est un service logistique créé par Amazon pour permettre aux vendeurs tiers de bénéficier de son infrastructure mondiale.

### Le principe est simple :

1. **Vous sourcez vos produits** - Arbitrage, wholesale, ou private label
2. **Vous envoyez au centre Amazon** - Préparation selon les normes FBA
3. **Amazon stocke** - Dans leurs entrepôts optimisés
4. **Un client commande** - Sur Amazon.fr ou autres marketplaces
5. **Amazon expédie** - Livraison Prime en 24-48h
6. **Amazon gère le SAV** - Retours, remboursements, questions

> 💡 **Avantage clé** : Vos produits sont éligibles à Amazon Prime, ce qui augmente significativement vos ventes (les membres Prime achètent 2x plus).

---

## Pourquoi choisir Amazon FBA plutôt que la vente classique ?

### Les 7 avantages majeurs du modèle FBA

**1. L'éligibilité Prime**
Les 200+ millions de membres Prime dans le monde préfèrent acheter des produits avec livraison gratuite et rapide. Vos produits FBA obtiennent automatiquement ce badge.

**2. La Buy Box favorisée**
Amazon privilégie les vendeurs FBA dans l'attribution de la Buy Box, cette zone d'achat qui génère 82% des ventes.

**3. Zéro logistique à gérer**
Plus de colis à préparer, plus de courses à La Poste, plus de stocks chez vous. Amazon gère tout 24h/24, 7j/7.

**4. Service client inclus**
Les retours, remboursements et questions clients sont gérés par Amazon dans la langue du client.

**5. Scalabilité illimitée**
Que vous vendiez 10 ou 10 000 produits par mois, l'infrastructure Amazon absorbe le volume sans effort de votre part.

**6. Confiance client maximale**
Le logo "Expédié par Amazon" rassure les acheteurs et augmente les taux de conversion.

**7. Expansion internationale facilitée**
Avec le programme Pan-Européen, vos produits peuvent être vendus dans toute l'Europe depuis un seul compte.

---

## Quels sont les différents modèles business sur Amazon FBA ?

### L'Arbitrage Online (OA)

L'arbitrage consiste à acheter des produits en promotion sur des sites e-commerce et les revendre plus cher sur Amazon.

**Avantages :**
- Investissement initial faible (500-2000€)
- Pas de stock massif à gérer
- Résultats rapides

**Inconvénients :**
- Travail quotidien de recherche
- Marges variables
- Risques de restrictions de marques

### Le Wholesale (Grossiste)

Vous achetez en gros auprès de distributeurs officiels et revendez sur Amazon.

**Avantages :**
- Produits de marques connues
- Approvisionnement régulier
- Moins de restrictions

**Inconvénients :**
- Capital plus important (3000-10000€)
- Négociation avec les fournisseurs
- Concurrence sur les prix

### Le Private Label (Marque Propre)

Vous créez votre propre marque en faisant fabriquer des produits personnalisés.

**Avantages :**
- Marges plus élevées (30-50%)
- Contrôle total de la marque
- Asset vendable

**Inconvénients :**
- Investissement conséquent (5000-20000€)
- Temps de lancement plus long
- Compétences marketing requises

---

## Comment calculer la rentabilité d'un produit FBA ?

Pour savoir si un produit est rentable, vous devez maîtriser le calcul du ROI (Return on Investment).

### La formule de base :

**Profit = Prix de vente - Coût d'achat - Frais Amazon - Frais d'expédition**

### Les frais Amazon à prendre en compte :

| Type de frais | Description | Fourchette |
|---------------|-------------|------------|
| Commission | % sur le prix de vente | 8-15% |
| Frais FBA | Picking + packing | 2-5€/unité |
| Stockage mensuel | Par m³ occupé | 15-45€/m³ |
| Stockage longue durée | > 365 jours | Pénalités |

> 💡 **Conseil expert** : Visez un ROI minimum de 30% et une marge nette de 15€ minimum par produit pour couvrir les imprévus.

---

## Les erreurs fatales à éviter quand on débute

### Erreur #1 : Négliger l'analyse de la concurrence
Trop de débutants se lancent sur des produits ultra-concurrencés où les marges sont écrasées.

### Erreur #2 : Ignorer les restrictions de marques
Certaines marques nécessitent une autorisation ("ungating"). Vérifiez AVANT d'acheter.

### Erreur #3 : Sous-estimer les frais
Les frais FBA, stockage, retours... peuvent transformer un produit "rentable" en gouffre financier.

### Erreur #4 : Commander trop de stock
Commencez petit pour tester. Le stockage longue durée coûte cher.

### Erreur #5 : Négliger la qualité des listings
Un titre, des bullets et des images optimisés font la différence entre succès et échec.

---

## Les outils indispensables pour réussir sur Amazon FBA

### Pour l'analyse produit :
- **SellerAmp** : Analyse rapide de rentabilité
- **Keepa** : Historique des prix et rangs
- **Helium 10** : Suite complète pour vendeurs

### Pour le sourcing :
- **Tactical Arbitrage** : Scan de sites e-commerce
- **AMZing FBA** : Alertes produits rentables quotidiennes

### Pour la gestion :
- **InventoryLab** : Comptabilité et profits
- **RestockPro** : Gestion des réapprovisionnements

---

## Comment démarrer concrètement sur Amazon FBA ?

### Étape 1 : Créer votre structure juridique
Auto-entrepreneur pour commencer, puis SASU/EURL en croissance.

### Étape 2 : Ouvrir un compte vendeur Amazon
Compte Professionnel à 39€/mois (indispensable pour FBA).

### Étape 3 : Se former sérieusement
Investissez dans une formation de qualité plutôt que d'apprendre par les erreurs.

### Étape 4 : Commencer avec l'arbitrage
Le modèle le plus accessible pour comprendre le fonctionnement d'Amazon.

### Étape 5 : Réinvestir et scaler
Réinjectez vos profits pour augmenter votre inventaire et vos revenus.

---

## Conclusion

Amazon FBA représente une opportunité exceptionnelle de créer un business e-commerce rentable sans gérer la logistique. En 2025, le marché continue de croître et les opportunités restent nombreuses pour ceux qui s'y prennent correctement.

La clé du succès ? Se former, utiliser les bons outils, et commencer progressivement. Avec de la persévérance et une approche méthodique, Amazon FBA peut devenir une source de revenus significative.

**Prêt à vous lancer ?** Découvrez nos outils et formations pour maximiser vos chances de réussite.
`
};

const pilierProduitsRentables: BlogArticle = {
  slug: 'trouver-produits-rentables-amazon-fba',
  title: "Comment Trouver des Produits Rentables sur Amazon FBA",
  metaTitle: "Trouver Produits Rentables Amazon FBA : Guide Complet [2025]",
  metaDescription: "Apprenez à identifier et sourcer des produits rentables pour Amazon FBA. Méthodes, outils et critères de sélection pour maximiser vos profits.",
  keywords: ['produits rentables amazon', 'sourcing amazon fba', 'trouver produit amazon', 'arbitrage online', 'wholesale amazon'],
  excerpt: "Le sourcing est la clé du succès sur Amazon FBA. Découvrez les méthodes éprouvées pour trouver des produits qui génèrent des marges de 30% et plus.",
  category: 'produits-rentables',
  type: 'pilier',
  readTime: 15,
  publishedAt: '2025-01-04',
  updatedAt: '2025-01-04',
  author: 'AMZing FBA',
  image: '/produits-rentables-hero.jpg',
  relatedSlugs: ['amazon-fba-cest-quoi-guide-complet', 'arbitrage-online-amazon', 'wholesale-amazon-fba'],
  faqs: [
    {
      question: "Comment savoir si un produit est rentable sur Amazon ?",
      answer: "Un produit rentable présente un ROI d'au moins 30%, un rang de vente (BSR) inférieur à 100 000 dans sa catégorie, moins de 10 vendeurs FBA, et pas de domination par Amazon lui-même. Utilisez des outils comme SellerAmp pour calculer automatiquement la rentabilité en tenant compte de tous les frais."
    },
    {
      question: "Quels sont les meilleurs sites pour l'arbitrage online ?",
      answer: "Les meilleurs sites pour l'arbitrage incluent : Amazon lui-même (différences de prix entre marketplaces), Cdiscount, Fnac, Darty, Action, Lidl en ligne, et les grandes surfaces avec promotions. Les sites en liquidation comme Veepee peuvent aussi offrir de bonnes opportunités."
    },
    {
      question: "Combien de produits faut-il analyser par jour ?",
      answer: "Les vendeurs qui réussissent analysent entre 100 et 500 produits par jour. Avec de l'expérience et les bons outils, vous développez un œil pour repérer rapidement les opportunités. La régularité est plus importante que le volume : 1h de sourcing quotidien vaut mieux que 5h une fois par semaine."
    },
    {
      question: "Comment éviter les produits restreints sur Amazon ?",
      answer: "Vérifiez TOUJOURS l'éligibilité avant d'acheter via l'application Seller d'Amazon ou un outil comme IP Alert. Les catégories souvent restreintes incluent : beauté, santé, alimentation, jouets (période Q4), et de nombreuses marques de luxe. L'ungating est parfois possible avec des factures de grossistes agréés."
    },
    {
      question: "Quelle marge minimum viser sur Amazon FBA ?",
      answer: "Visez un ROI minimum de 30% et un profit net de 5€ minimum par unité pour les petits produits, 15€+ pour les produits plus chers. Ces seuils permettent d'absorber les imprévus (retours, baisse de prix, stockage prolongé). Les vendeurs expérimentés visent 50%+ de ROI."
    }
  ],
  content: `
## 📌 Résumé (TL;DR)

Trouver des produits rentables sur Amazon FBA demande méthode et outils. Les critères clés : ROI > 30%, BSR < 100k, peu de vendeurs FBA, pas de restrictions. L'arbitrage online est idéal pour débuter (scan de sites e-commerce), le wholesale pour scaler (achat en gros). Analysez 100+ produits/jour, utilisez SellerAmp pour le calcul, et vérifiez TOUJOURS les restrictions avant d'acheter.

---

## Quels sont les critères d'un produit rentable sur Amazon ?

### Les 7 critères essentiels à vérifier

**1. Le ROI (Return on Investment)**
Minimum 30% pour couvrir les imprévus. Formule : (Profit / Coût d'achat) × 100

**2. Le BSR (Best Sellers Rank)**
Inférieur à 100 000 dans la catégorie principale = le produit se vend régulièrement

**3. Le nombre de vendeurs FBA**
Moins de 10 vendeurs FBA = moins de concurrence pour la Buy Box

**4. La présence d'Amazon**
Si Amazon vend le produit, passez votre chemin. Ils ont toujours l'avantage.

**5. L'historique des prix (Keepa)**
Prix stable = marché sain. Prix en chute = attention danger.

**6. Les restrictions de vente**
Vérifiez l'ungating AVANT d'acheter. Rien de pire qu'un stock invendable.

**7. La saisonnalité**
Un produit peut être excellent en décembre et mort en février.

---

## Comment faire de l'arbitrage online efficacement ?

L'arbitrage online consiste à acheter des produits en promotion sur des sites e-commerce pour les revendre sur Amazon.

### Les meilleures sources pour l'arbitrage en France

| Site | Type de deals | Fréquence |
|------|---------------|-----------|
| Cdiscount | Déstockage | Quotidien |
| Fnac | Promos flash | Hebdomadaire |
| Amazon (autres pays) | Différences de prix | Permanent |
| Carrefour | Liquidations | Mensuel |
| Action/Lidl | Prix bas | Permanent |

### La méthode de scan efficace

1. **Installez les extensions** - SellerAmp, Keepa sur votre navigateur
2. **Parcourez les promotions** - Catégorie par catégorie
3. **Scannez l'EAN/ASIN** - Vérification instantanée
4. **Analysez les métriques** - ROI, BSR, concurrence
5. **Vérifiez les restrictions** - Application Seller Amazon
6. **Décidez en 30 secondes** - Acheter ou passer

> 💡 **Conseil expert** : Créez une routine quotidienne de 1-2h de sourcing. La régularité bat l'intensité.

---

## Le wholesale : acheter en gros pour de meilleures marges

Le wholesale consiste à établir des relations avec des distributeurs officiels pour acheter en volume.

### Comment trouver des fournisseurs wholesale

**Méthode 1 : Contacter directement les marques**
Recherchez le distributeur officiel sur le site de la marque et demandez les conditions revendeurs.

**Méthode 2 : Les salons professionnels**
Maison & Objet, Toy Fair, et autres salons B2B sont des mines d'or de contacts.

**Méthode 3 : Les annuaires professionnels**
Europages, Kompass, et les chambres de commerce référencent les grossistes.

### Les avantages du wholesale

- Produits de marques reconnues (demande existante)
- Approvisionnement régulier et prévisible
- Factures officielles pour l'ungating
- Relations durables = meilleures conditions

---

## Les outils indispensables pour le sourcing

### Pour l'analyse instantanée

**SellerAmp SAS** (Recommandé)
- Calcul automatique du ROI
- Vérification des restrictions
- Historique Keepa intégré
- Extension Chrome + App mobile

### Pour le scan massif

**Tactical Arbitrage**
- Scan automatisé de sites entiers
- Filtres avancés par ROI, BSR
- Gain de temps considérable

### Pour le suivi des prix

**Keepa**
- Historique des prix sur 2 ans
- Alertes de baisse de prix
- Analyse des tendances

---

## Les erreurs de sourcing qui tuent votre rentabilité

### Erreur #1 : Acheter sans vérifier les restrictions
50€ de stock inutilisable = leçon douloureuse. Vérifiez TOUJOURS avant.

### Erreur #2 : Ignorer la saisonnalité
Les décorations de Noël en janvier ? Mauvaise idée.

### Erreur #3 : Se fier uniquement au ROI
Un ROI de 100% sur un produit qui se vend 1 fois par mois = capital bloqué.

### Erreur #4 : Négliger les frais cachés
Frais de port vers Amazon, préparation, étiquetage... Tout compte.

### Erreur #5 : Acheter trop de quantité
Testez avec 3-5 unités avant de commander 50.

---

## Conclusion

Le sourcing de produits rentables est un skill qui se développe avec la pratique. Commencez par l'arbitrage pour comprendre les mécaniques, puis évoluez vers le wholesale pour scaler.

La clé : analyser beaucoup, acheter intelligemment, et toujours vérifier les restrictions. Avec les bons outils et une routine quotidienne, vous trouverez des opportunités que d'autres manquent.

**Besoin d'aide ?** AMZing FBA vous envoie chaque jour des alertes sur les produits rentables détectés par nos algorithmes.
`
};

const pilierLogistique: BlogArticle = {
  slug: 'logistique-amazon-fba-guide-complet',
  title: "Logistique Amazon FBA : Le Guide Complet",
  metaTitle: "Logistique Amazon FBA : Envoi, Stockage, Préparation [Guide 2025]",
  metaDescription: "Maîtrisez la logistique FBA : préparation des colis, étiquetage, envoi aux entrepôts Amazon. Évitez les erreurs coûteuses avec notre guide expert.",
  keywords: ['logistique amazon fba', 'envoi fba', 'préparation fba', 'étiquetage amazon', 'entrepôt amazon'],
  excerpt: "La logistique FBA peut sembler complexe au début. Ce guide vous explique étape par étape comment préparer et envoyer vos produits aux entrepôts Amazon sans erreur.",
  category: 'logistique',
  type: 'pilier',
  readTime: 14,
  publishedAt: '2025-01-04',
  updatedAt: '2025-01-04',
  author: 'AMZing FBA',
  image: '/fba-warehouse.jpg',
  relatedSlugs: ['amazon-fba-cest-quoi-guide-complet', 'prep-center-france', 'etiquetage-fba-regles'],
  faqs: [
    {
      question: "Comment envoyer ses produits à Amazon FBA ?",
      answer: "Créez un envoi dans Seller Central, imprimez les étiquettes FNSKU pour chaque produit, préparez les colis selon les normes Amazon, collez les étiquettes de transport, et expédiez vers le centre indiqué. Vous pouvez utiliser UPS via Amazon (tarifs négociés) ou votre propre transporteur."
    },
    {
      question: "Qu'est-ce que le code FNSKU ?",
      answer: "Le FNSKU (Fulfillment Network Stock Keeping Unit) est un code-barres unique généré par Amazon pour identifier vos produits dans leurs entrepôts. Il doit être collé sur chaque unité et masquer le code-barres original. C'est ce qui permet à Amazon de tracer VOS produits spécifiquement."
    },
    {
      question: "Combien coûte le stockage Amazon FBA ?",
      answer: "Le stockage standard coûte environ 15-26€/m³/mois selon la période (plus cher en Q4). Des frais de stockage longue durée s'appliquent après 365 jours. Pour minimiser les coûts, gérez bien votre rotation de stock et évitez le surstockage."
    },
    {
      question: "Qu'est-ce qu'un prep center ?",
      answer: "Un prep center est un entrepôt tiers qui reçoit vos produits, les prépare selon les normes Amazon (étiquetage, emballage, regroupement), et les envoie aux centres FBA. C'est utile si vous faites beaucoup de volume ou de l'arbitrage à distance. Comptez 1-3€ par unité."
    },
    {
      question: "Que faire si Amazon refuse mes produits ?",
      answer: "Si vos produits sont refusés (étiquetage incorrect, emballage endommagé, restrictions), Amazon vous facture des frais et les produits sont renvoyés ou détruits. Pour éviter cela : suivez scrupuleusement les guidelines, utilisez des matériaux de qualité, et vérifiez les restrictions avant envoi."
    }
  ],
  content: `
## 📌 Résumé (TL;DR)

La logistique FBA en 5 étapes : 1) Créez l'envoi dans Seller Central, 2) Imprimez et collez les étiquettes FNSKU, 3) Emballez selon les normes Amazon, 4) Collez les étiquettes de transport, 5) Expédiez au centre désigné. Les erreurs courantes (mauvais étiquetage, emballage inadapté) entraînent des refus et frais supplémentaires. Un prep center peut vous simplifier la vie moyennant 1-3€/unité.

---

## Comment créer un envoi FBA étape par étape ?

### Étape 1 : Accéder à la création d'envoi

Dans Seller Central, allez dans **Inventaire > Gérer l'inventaire FBA** puis sélectionnez les produits à envoyer et cliquez sur **Envoyer/Réapprovisionner l'inventaire**.

### Étape 2 : Configurer l'envoi

- Choisissez l'adresse d'expédition
- Indiquez les quantités par produit
- Sélectionnez le type d'emballage (individuel ou carton mixte)

### Étape 3 : Imprimer les étiquettes produit

Amazon génère les étiquettes FNSKU. Imprimez-les sur des étiquettes autocollantes compatibles (format recommandé : 63,5 x 38,1 mm).

### Étape 4 : Préparer les produits

- Collez le FNSKU sur chaque unité (masquant le code-barres original)
- Emballez si nécessaire (poly bag pour textiles, bubble wrap pour fragiles)
- Respectez les dimensions et poids maximum

### Étape 5 : Préparer les cartons

- Utilisez des cartons solides (double cannelure recommandée)
- Poids maximum : 23 kg par carton
- Ne mélangez pas les envois

### Étape 6 : Finaliser et expédier

- Imprimez les étiquettes de transport FBA
- Collez-les sur chaque carton
- Expédiez via UPS Amazon ou votre transporteur

---

## Les normes d'emballage Amazon FBA à respecter

### Produits nécessitant un emballage spécial

| Type de produit | Emballage requis |
|-----------------|------------------|
| Liquides | Sac plastique étanche |
| Fragiles | Bubble wrap + carton |
| Vêtements | Poly bag transparent |
| Petits articles | Regroupement en lot |
| Pointus/coupants | Protection des bords |

### Les erreurs d'emballage à éviter

- Cartons trop fragiles qui s'écrasent
- Produits qui bougent dans le carton
- Étiquettes mal positionnées ou illisibles
- Codes-barres originaux non masqués
- Poly bags sans avertissement étouffement

> 💡 **Conseil expert** : Investissez dans du matériel de qualité. Un carton écrasé = produits refusés = frais + retards.

---

## Comprendre les frais de stockage FBA

### Frais de stockage mensuel

| Période | Taille standard | Grande taille |
|---------|-----------------|---------------|
| Janvier - Septembre | 18,36€/m³ | 12,95€/m³ |
| Octobre - Décembre | 27,54€/m³ | 17,42€/m³ |

### Frais de stockage longue durée

- **271-365 jours** : Supplément appliqué
- **> 365 jours** : Frais significatifs + risque de destruction

### Comment minimiser les frais de stockage

1. **Envoyez par petites quantités** - Réapprovisionnez régulièrement
2. **Surveillez l'âge du stock** - Tableau de bord inventaire
3. **Liquidez les invendus** - Promotions ou retrait avant 365 jours
4. **Analysez la rotation** - Ne restockez que ce qui se vend

---

## Les prep centers : quand et pourquoi les utiliser ?

### Qu'est-ce qu'un prep center ?

Un prep center est un entrepôt tiers spécialisé dans la préparation FBA. Ils reçoivent vos produits, les préparent selon les normes Amazon, et les expédient aux centres FBA.

### Avantages des prep centers

- **Gain de temps** : Plus de préparation à faire vous-même
- **Professionnalisme** : Moins de refus Amazon
- **Scalabilité** : Gérez plus de volume sans espace supplémentaire
- **Arbitrage à distance** : Achetez partout, faites livrer au prep

### Inconvénients à considérer

- **Coût** : 1-3€ par unité (à intégrer dans vos calculs)
- **Délais** : Quelques jours supplémentaires
- **Contrôle** : Vous ne voyez pas les produits

### Les meilleurs prep centers en France

Plusieurs prep centers français offrent des services de qualité. Comparez les tarifs, délais, et avis avant de choisir. Certains proposent aussi le stockage temporaire et l'inspection qualité.

---

## Que faire en cas de problème avec un envoi ?

### Produits refusés à la réception

1. Vérifiez le motif dans Seller Central
2. Décidez : retour, destruction, ou nouvelle préparation
3. Corrigez l'erreur pour les prochains envois

### Produits perdus ou endommagés

Amazon indemnise les produits perdus ou endommagés dans leurs entrepôts. Vérifiez régulièrement vos rapports d'inventaire et ouvrez des réclamations si nécessaire.

### Stock bloqué

Le stock peut être bloqué pour diverses raisons (investigation, problème qualité). Consultez les alertes dans Seller Central et suivez les instructions pour débloquer.

---

## Conclusion

La logistique FBA demande de la rigueur mais devient une routine une fois maîtrisée. Les clés du succès : suivre les guidelines à la lettre, investir dans du matériel de qualité, et considérer un prep center si votre volume augmente.

Une bonne logistique = moins de refus, moins de frais, et plus de temps pour vous concentrer sur le sourcing et la croissance de votre business.
`
};

const pilierVendreAmazon: BlogArticle = {
  slug: 'comment-vendre-sur-amazon-guide-debutant',
  title: "Comment Vendre sur Amazon : Guide Débutant 2025",
  metaTitle: "Comment Vendre sur Amazon : Guide Complet Débutant [2025]",
  metaDescription: "Apprenez à vendre sur Amazon de A à Z. Création de compte, listing optimisé, Buy Box, publicité. Guide complet pour lancer votre business Amazon.",
  keywords: ['vendre sur amazon', 'devenir vendeur amazon', 'compte vendeur amazon', 'comment vendre amazon', 'business amazon'],
  excerpt: "Vous voulez vendre sur Amazon mais ne savez pas par où commencer ? Ce guide vous accompagne de la création du compte à votre première vente, avec tous les conseils pour réussir.",
  category: 'vendre-amazon',
  type: 'pilier',
  readTime: 16,
  publishedAt: '2025-01-04',
  updatedAt: '2025-01-04',
  author: 'AMZing FBA',
  image: '/compte-vendeur-amazon.jpg',
  relatedSlugs: ['amazon-fba-cest-quoi-guide-complet', 'creer-fiche-produit-amazon', 'amazon-seo-referencement'],
  faqs: [
    {
      question: "Combien coûte un compte vendeur Amazon ?",
      answer: "Le compte Individuel est gratuit mais prélève 0,99€ par vente. Le compte Professionnel coûte 39€/mois sans commission par vente. Pour FBA et des volumes significatifs, le compte Pro est indispensable et rapidement rentabilisé dès 40 ventes/mois."
    },
    {
      question: "Quels documents faut-il pour ouvrir un compte vendeur ?",
      answer: "Vous aurez besoin : d'une pièce d'identité valide, d'un justificatif de domicile récent, d'un RIB, d'une carte bancaire pour les frais, et d'un numéro de TVA intracommunautaire si vous êtes assujetti. Le processus de vérification prend généralement 24-48h."
    },
    {
      question: "Comment gagner la Buy Box sur Amazon ?",
      answer: "La Buy Box dépend de plusieurs facteurs : prix compétitif (mais pas toujours le plus bas), compte en bonne santé, FBA (avantage significatif), stock disponible, et historique de performance. Maintenez un taux de défaut < 1% et des expéditions dans les délais."
    },
    {
      question: "Faut-il faire de la publicité sur Amazon ?",
      answer: "Amazon PPC est fortement recommandé, surtout au lancement. Les campagnes Sponsored Products augmentent votre visibilité et génèrent des ventes qui améliorent votre référencement organique. Commencez avec un budget de 10-20€/jour et optimisez selon les résultats."
    },
    {
      question: "Comment obtenir des avis clients sur Amazon ?",
      answer: "Amazon interdit les avis incentivés. Les méthodes légales : le programme Amazon Vine (payant, pour les nouveaux produits), le bouton 'Demander un avis' dans Seller Central (30 jours après achat), et surtout un excellent produit et service qui génèrent naturellement des avis positifs."
    }
  ],
  content: `
## 📌 Résumé (TL;DR)

Vendre sur Amazon en 2025 reste une opportunité majeure. Les étapes clés : créer un compte Pro (39€/mois), choisir FBA pour l'éligibilité Prime, optimiser vos listings (titre, bullets, images), cibler la Buy Box, et utiliser Amazon PPC pour la visibilité. Évitez les erreurs classiques : prix non compétitifs, listings mal optimisés, et négligence des métriques de performance.

---

## Pourquoi vendre sur Amazon en 2025 ?

### Les chiffres qui parlent

- **300+ millions** de clients actifs dans le monde
- **60%** des recherches produit commencent sur Amazon
- **200+ millions** de membres Prime (qui achètent 2x plus)
- **Confiance** établie : les clients préfèrent Amazon

### Les avantages pour les vendeurs

1. **Audience massive** - Pas besoin de créer du trafic
2. **Infrastructure prête** - Paiements, logistique, SAV
3. **Crédibilité** - Le logo Amazon rassure les acheteurs
4. **Scalabilité** - De 10 à 10 000 ventes sans friction

---

## Comment créer son compte vendeur Amazon ?

### Étape 1 : Choisir le bon type de compte

| Critère | Individuel | Professionnel |
|---------|------------|---------------|
| Coût fixe | 0€ | 39€/mois |
| Commission/vente | 0,99€ | 0€ |
| Accès FBA | Oui | Oui |
| Rapports avancés | Non | Oui |
| Publicité | Limité | Complet |

> 💡 **Recommandation** : Commencez directement en Pro si vous visez plus de 40 ventes/mois.

### Étape 2 : Préparer les documents

- Pièce d'identité (CNI ou passeport)
- Justificatif de domicile (< 3 mois)
- RIB pour les paiements
- Carte bancaire pour les frais
- Numéro SIRET/SIREN
- Numéro de TVA (si assujetti)

### Étape 3 : Processus d'inscription

1. Rendez-vous sur sellercentral.amazon.fr
2. Cliquez sur "S'inscrire"
3. Suivez les étapes de vérification
4. Uploadez vos documents
5. Attendez la validation (24-48h généralement)

---

## Comment créer un listing qui vend ?

### Les éléments d'un listing optimisé

**Le titre (200 caractères max)**
Structure recommandée : Marque + Nom produit + Caractéristiques clés + Taille/Quantité

**Les bullet points (5 points)**
- Commencez par le bénéfice principal
- Un avantage par bullet
- Incluez les mots-clés naturellement
- Finissez par la garantie/SAV

**La description**
Développez les bénéfices, racontez l'histoire du produit, et incluez les détails techniques.

**Les images (minimum 6)**
- Image principale : fond blanc, produit seul
- Images secondaires : en situation, infographies, dimensions
- Format : 1500x1500 pixels minimum

### Les erreurs de listing à éviter

- Titre bourré de mots-clés (illisible)
- Images de mauvaise qualité
- Bullet points qui répètent le titre
- Pas de backend keywords
- Description trop courte

---

## Comment gagner la Buy Box ?

La Buy Box est la zone "Ajouter au panier" qui génère 82% des ventes.

### Les facteurs qui influencent la Buy Box

1. **Prix** - Compétitif mais pas forcément le plus bas
2. **Méthode d'expédition** - FBA a un avantage significatif
3. **Performance vendeur** - Taux de défaut < 1%
4. **Stock disponible** - Rupture = perte de Buy Box
5. **Ancienneté** - Les comptes établis sont favorisés

### Stratégies pour obtenir la Buy Box

- Utilisez FBA autant que possible
- Maintenez des métriques excellentes
- Restez compétitif sur le prix (repricers automatiques)
- Gardez du stock en permanence
- Répondez rapidement aux messages

---

## Amazon PPC : la publicité qui booste vos ventes

### Les types de campagnes

**Sponsored Products**
Annonces qui apparaissent dans les résultats de recherche. Idéal pour démarrer.

**Sponsored Brands**
Bannière avec votre logo et plusieurs produits. Pour les marques enregistrées.

**Sponsored Display**
Retargeting sur et hors Amazon. Pour les vendeurs avancés.

### Comment structurer vos campagnes

1. **Campagne automatique** - Laissez Amazon trouver les mots-clés
2. **Analysez les termes** - Identifiez ce qui convertit
3. **Campagne manuelle** - Ciblez les mots-clés rentables
4. **Optimisez** - Ajustez les enchères selon le ACOS

### Budget recommandé pour débuter

- Commencez avec 10-20€/jour
- Visez un ACOS < 30%
- Réinvestissez une partie des profits en pub

---

## Les métriques à surveiller absolument

### Métriques de performance vendeur

| Métrique | Objectif | Impact |
|----------|----------|--------|
| Taux de défaut | < 1% | Suspension si dépassé |
| Expéditions tardives | < 4% | Perte Buy Box |
| Taux d'annulation | < 2,5% | Perte Buy Box |

### Métriques business

- **Marge nette** - Après tous les frais
- **Rotation de stock** - Combien de fois par an
- **ACOS publicitaire** - Coût pub / Ventes pub
- **Taux de retour** - Par produit

---

## Conclusion

Vendre sur Amazon est accessible à tous mais demande de la méthode. Les clés du succès : un compte bien configuré, des listings optimisés, une stratégie prix intelligente, et de la publicité ciblée.

Commencez progressivement, apprenez de chaque vente, et scalez ce qui fonctionne. Avec de la persévérance et les bonnes pratiques, Amazon peut devenir une source de revenus significative.

**Prêt à vous lancer ?** Rejoignez AMZing FBA pour accéder à nos outils et notre communauté de vendeurs.
`
};

// ============================================
// ARTICLES SATELLITES
// ============================================

const articleFbaVsFbm: BlogArticle = {
  slug: 'amazon-fba-vs-fbm',
  title: "Amazon FBA vs FBM : Quelle Méthode Choisir ?",
  metaTitle: "Amazon FBA vs FBM : Comparatif Complet [2025]",
  metaDescription: "FBA ou FBM ? Découvrez les avantages et inconvénients de chaque méthode de fulfillment Amazon pour choisir la meilleure stratégie selon votre situation.",
  keywords: ['fba vs fbm', 'amazon fba ou fbm', 'fulfillment amazon', 'expédié par amazon', 'expédié par le vendeur'],
  excerpt: "FBA ou FBM ? Ce comparatif détaillé vous aide à choisir la méthode de fulfillment la plus adaptée à votre business Amazon.",
  category: 'guide-fba',
  type: 'satellite',
  readTime: 10,
  publishedAt: '2025-01-04',
  updatedAt: '2025-01-04',
  author: 'AMZing FBA',
  image: '/fbm-packages.jpg',
  relatedSlugs: ['amazon-fba-cest-quoi-guide-complet', 'combien-coute-amazon-fba', 'logistique-amazon-fba-guide-complet'],
  faqs: [
    {
      question: "Quelle est la différence entre FBA et FBM ?",
      answer: "FBA (Fulfillment by Amazon) signifie qu'Amazon stocke, emballe et expédie vos produits. FBM (Fulfillment by Merchant) signifie que vous gérez vous-même toute la logistique. FBA offre l'éligibilité Prime et un meilleur référencement, FBM offre plus de contrôle et moins de frais fixes."
    },
    {
      question: "FBA est-il plus rentable que FBM ?",
      answer: "Ça dépend. FBA est souvent plus rentable pour les produits à forte rotation grâce au volume de ventes supérieur (Prime). FBM peut être plus rentable pour les produits volumineux, à faible rotation, ou les marges serrées où chaque euro compte."
    },
    {
      question: "Peut-on utiliser FBA et FBM en même temps ?",
      answer: "Oui, c'est même recommandé ! Beaucoup de vendeurs utilisent FBA pour leurs best-sellers (volume, Prime) et FBM pour les produits volumineux ou à faible rotation. Cette stratégie hybride optimise les coûts et la flexibilité."
    }
  ],
  content: `
## 📌 Résumé (TL;DR)

FBA = Amazon gère tout (stockage, expédition, SAV) contre des frais. Avantages : Prime, Buy Box, scalabilité. FBM = vous gérez tout. Avantages : contrôle, marges potentiellement meilleures sur certains produits. La meilleure stratégie ? Souvent hybride : FBA pour les best-sellers, FBM pour le reste.

---

## Tableau comparatif FBA vs FBM

| Critère | FBA | FBM |
|---------|-----|-----|
| Stockage | Amazon | Chez vous |
| Expédition | Amazon | Vous |
| SAV | Amazon | Vous |
| Éligibilité Prime | ✅ Oui | ❌ Non (sauf SFP) |
| Buy Box | Avantagé | Désavantagé |
| Frais fixes | Élevés | Faibles |
| Contrôle | Faible | Total |
| Scalabilité | Excellente | Limitée |

---

## Quand choisir FBA ?

### FBA est idéal pour :

- **Produits à forte rotation** - Le volume compense les frais
- **Produits légers et compacts** - Frais FBA raisonnables
- **Vendeurs qui veulent scaler** - Pas de limite logistique
- **Ceux qui valorisent leur temps** - Zéro préparation de colis

### Les avantages concrets de FBA

1. Badge Prime = +30% de ventes en moyenne
2. Buy Box quasi garantie face aux vendeurs FBM
3. Service client 24/7 multilingue inclus
4. Aucune gestion des retours à faire
5. Expansion européenne facilitée

---

## Quand choisir FBM ?

### FBM est idéal pour :

- **Produits volumineux** - Frais FBA prohibitifs
- **Produits à faible rotation** - Éviter les frais de stockage
- **Marges serrées** - Chaque euro compte
- **Produits personnalisés** - Préparation spécifique requise

### Les avantages concrets de FBM

1. Contrôle total sur l'emballage et la présentation
2. Pas de frais de stockage Amazon
3. Flexibilité sur les produits (pas de restrictions FBA)
4. Contact direct avec les clients

---

## La stratégie hybride gagnante

Les vendeurs les plus performants utilisent les deux :

- **FBA** pour les 20% de produits qui font 80% du CA
- **FBM** pour les produits à faible rotation ou volumineux
- **FBM en backup** quand le stock FBA est épuisé

> 💡 **Conseil expert** : Testez les deux méthodes sur le même produit pendant 1 mois pour comparer les résultats réels.

---

## Conclusion

Il n'y a pas de réponse universelle. FBA est généralement recommandé pour débuter et scaler, mais FBM reste pertinent dans certaines situations. Analysez vos produits un par un et n'hésitez pas à mixer les approches.
`
};

const articleCombienCouteFba: BlogArticle = {
  slug: 'combien-coute-amazon-fba',
  title: "Combien Coûte Amazon FBA ? Tous les Frais Détaillés",
  metaTitle: "Coût Amazon FBA : Tous les Frais Expliqués [2025]",
  metaDescription: "Découvrez tous les frais Amazon FBA : commission, stockage, fulfillment, et coûts cachés. Calculez votre rentabilité avec notre guide détaillé.",
  keywords: ['coût amazon fba', 'frais amazon fba', 'tarif fba', 'commission amazon', 'rentabilité fba'],
  excerpt: "Avant de vous lancer, comprenez exactement combien coûte Amazon FBA. Ce guide détaille tous les frais pour calculer précisément votre rentabilité.",
  category: 'guide-fba',
  type: 'satellite',
  readTime: 12,
  publishedAt: '2025-01-04',
  updatedAt: '2025-01-04',
  author: 'AMZing FBA',
  image: '/logistics.jpg',
  relatedSlugs: ['amazon-fba-cest-quoi-guide-complet', 'amazon-fba-vs-fbm', 'comment-debuter-amazon-fba'],
  faqs: [
    {
      question: "Quels sont les frais principaux d'Amazon FBA ?",
      answer: "Les frais principaux sont : l'abonnement Pro (39€/mois), la commission sur vente (8-15% selon catégorie), les frais FBA (2-5€/unité selon taille), et le stockage mensuel (15-45€/m³). À cela s'ajoutent les frais de port vers Amazon et les éventuels frais de préparation."
    },
    {
      question: "Comment calculer si un produit est rentable ?",
      answer: "Profit = Prix de vente - Coût d'achat - Commission Amazon - Frais FBA - Stockage - Port vers Amazon. Visez un ROI minimum de 30% et un profit net de 5€+ par unité. Utilisez le calculateur FBA d'Amazon ou des outils comme SellerAmp pour des calculs précis."
    },
    {
      question: "Y a-t-il des frais cachés sur Amazon FBA ?",
      answer: "Oui, plusieurs frais sont souvent oubliés : retours (remboursement client + frais de traitement), stockage longue durée (> 365 jours), enlèvement de stock, étiquetage par Amazon (si vous ne le faites pas), et les frais de publicité PPC pour la visibilité."
    }
  ],
  content: `
## 📌 Résumé (TL;DR)

Les coûts FBA se décomposent en : abonnement Pro (39€/mois), commission (8-15%), frais FBA (2-5€/unité), stockage (15-45€/m³/mois). Pour être rentable, visez un ROI de 30%+ et intégrez TOUS les frais dans vos calculs, y compris les frais cachés (retours, longue durée, publicité).

---

## Les frais fixes Amazon

### Abonnement Seller Central

| Type | Coût | Pour qui |
|------|------|----------|
| Individuel | 0€ + 0,99€/vente | < 40 ventes/mois |
| Professionnel | 39€/mois | > 40 ventes/mois |

### Pourquoi le compte Pro est indispensable

- Accès complet aux rapports
- Pas de commission par vente
- Accès aux outils publicitaires
- Rentabilisé dès 40 ventes/mois

---

## Les commissions sur vente

Amazon prélève un pourcentage sur chaque vente selon la catégorie :

| Catégorie | Commission |
|-----------|------------|
| Électronique | 7-8% |
| Livres | 15% |
| Vêtements | 15% |
| Beauté | 8-15% |
| Maison | 15% |
| Jouets | 15% |

> 💡 **Note** : La commission s'applique sur le prix de vente TTC, frais de port inclus.

---

## Les frais FBA (Fulfillment)

Ces frais couvrent le picking, packing et l'expédition au client.

### Grille tarifaire simplifiée

| Taille produit | Poids | Frais FBA approx. |
|----------------|-------|-------------------|
| Petit | < 250g | 2,50€ |
| Standard | < 1kg | 3,50€ |
| Standard | 1-2kg | 4,50€ |
| Grand | > 2kg | 5€+ |

---

## Les frais de stockage

### Stockage mensuel standard

| Période | Taille standard | Grande taille |
|---------|-----------------|---------------|
| Jan-Sep | 18,36€/m³ | 12,95€/m³ |
| Oct-Déc | 27,54€/m³ | 17,42€/m³ |

### Stockage longue durée

- **> 365 jours** : Frais supplémentaires significatifs
- **Solution** : Liquidez ou retirez avant cette échéance

---

## Les frais cachés à ne pas oublier

1. **Port vers Amazon** - 2-5€ par envoi selon le transporteur
2. **Préparation** - Si vous utilisez un prep center (1-3€/unité)
3. **Retours** - Remboursement + frais de traitement
4. **Publicité PPC** - Budget marketing nécessaire
5. **Outils** - Keepa, SellerAmp, etc. (20-100€/mois)

---

## Exemple de calcul complet

**Produit vendu 25€ sur Amazon :**

| Poste | Montant |
|-------|---------|
| Prix de vente | 25€ |
| - Coût d'achat | -10€ |
| - Commission (15%) | -3,75€ |
| - Frais FBA | -3,50€ |
| - Stockage (estimé) | -0,50€ |
| - Port vers Amazon | -0,30€ |
| **= Profit net** | **6,95€** |
| **ROI** | **69,5%** |

---

## Conclusion

Amazon FBA a un coût, mais ces frais achètent du temps, de la scalabilité, et l'éligibilité Prime. La clé : intégrer TOUS les frais dans vos calculs AVANT d'acheter. Un produit qui semble rentable à première vue peut devenir un gouffre une fois tous les frais comptabilisés.

Utilisez les outils de calcul et ne vous fiez jamais aux apparences.
`
};

// ============================================
// EXPORT DES DONNÉES
// ============================================

export const blogArticles: BlogArticle[] = [
  // Piliers
  pilierGuideFba,
  pilierProduitsRentables,
  pilierLogistique,
  pilierVendreAmazon,
  // Satellites Guide FBA
  articleFbaVsFbm,
  articleCombienCouteFba,
];

export const blogCategories = {
  'guide-fba': {
    name: 'Guide Amazon FBA',
    description: 'Tout comprendre sur Amazon FBA',
    slug: 'guide-fba',
  },
  'produits-rentables': {
    name: 'Produits Rentables',
    description: 'Trouver et sourcer des produits',
    slug: 'produits-rentables',
  },
  'logistique': {
    name: 'Logistique FBA',
    description: 'Maîtriser la logistique Amazon',
    slug: 'logistique',
  },
  'vendre-amazon': {
    name: 'Vendre sur Amazon',
    description: 'Optimiser ses ventes sur Amazon',
    slug: 'vendre-amazon',
  },
};

export const getArticleBySlug = (slug: string): BlogArticle | undefined => {
  return blogArticles.find(article => article.slug === slug);
};

export const getArticlesByCategory = (category: string): BlogArticle[] => {
  return blogArticles.filter(article => article.category === category);
};

export const getRelatedArticles = (article: BlogArticle): BlogArticle[] => {
  return article.relatedSlugs
    .map(slug => getArticleBySlug(slug))
    .filter((a): a is BlogArticle => a !== undefined);
};

export const getPilierArticles = (): BlogArticle[] => {
  return blogArticles.filter(article => article.type === 'pilier');
};

export const getSatelliteArticles = (): BlogArticle[] => {
  return blogArticles.filter(article => article.type === 'satellite');
};
