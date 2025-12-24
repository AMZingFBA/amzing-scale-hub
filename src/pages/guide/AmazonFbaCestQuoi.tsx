import { ArrowRight, ArrowLeft, Package, Warehouse, Truck, DollarSign, CheckCircle2, XCircle, Scale, Target, Users, BookOpen, HelpCircle } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import SEO from "@/components/SEO";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

const AmazonFbaCestQuoi = () => {
  const navigate = useNavigate();

  const tableOfContents = [
    { id: "definition", label: "Définition simple d'Amazon FBA" },
    { id: "fonctionnement", label: "Comment fonctionne Amazon FBA" },
    { id: "avantages-inconvenients", label: "Avantages et inconvénients" },
    { id: "fba-vs-fbm", label: "Amazon FBA vs FBM (résumé)" },
    { id: "couts", label: "Combien ça coûte (aperçu)" },
    { id: "pour-qui", label: "Pour qui c'est adapté" },
    { id: "demarrer", label: "Comment démarrer" },
    { id: "aller-plus-loin", label: "Aller plus loin" },
    { id: "faq", label: "FAQ" },
  ];

  const faqItems = [
    {
      question: "Amazon FBA, ça veut dire quoi ?",
      answer: "FBA signifie \"Fulfillment by Amazon\", c'est-à-dire \"Expédié par Amazon\". Concrètement, tu envoies tes produits à Amazon, et ils gèrent le stockage, l'emballage, l'expédition aux clients et le service après-vente. Tu te concentres sur le sourcing et les ventes, Amazon s'occupe de la logistique."
    },
    {
      question: "Est-ce que Amazon FBA est rentable ?",
      answer: "Oui, Amazon FBA peut être rentable, mais cela dépend de plusieurs facteurs : le choix des produits, les marges, la concurrence et ta capacité à bien gérer tes coûts. Des vendeurs réalisent des marges nettes de 15% à 30%, mais cela nécessite une bonne stratégie de sourcing et d'analyse des produits."
    },
    {
      question: "Quelle différence entre FBA et FBM ?",
      answer: "Avec FBA, Amazon gère toute la logistique (stockage, expédition, SAV). Avec FBM (Fulfillment by Merchant), c'est toi qui gères tout. FBA te donne accès au badge Prime et simplifie la gestion, mais a des frais plus élevés. FBM te laisse plus de contrôle mais demande plus de travail quotidien."
    },
    {
      question: "Quel budget minimum pour commencer ?",
      answer: "Pour débuter sur Amazon FBA, prévois environ 500€ à 1500€ : l'abonnement vendeur Pro (39€/mois), du stock initial (300€-1000€), et des outils d'analyse. Tu peux commencer plus petit avec le plan individuel (sans abonnement) mais les frais par vente sont plus élevés."
    },
    {
      question: "Quels sont les risques principaux ?",
      answer: "Les principaux risques sont : choisir un produit avec trop de concurrence ou trop peu de demande, mal calculer ses marges (oublier des frais), avoir des problèmes de qualité produit, ou se faire suspendre par Amazon pour non-respect des règles. Une bonne formation et des outils d'analyse réduisent considérablement ces risques."
    },
    {
      question: "Combien de temps pour faire sa première vente ?",
      answer: "Cela dépend de ton organisation et du temps investi. Certains vendeurs font leur première vente en 2-4 semaines, d'autres prennent 2-3 mois pour bien se former avant de se lancer. L'important n'est pas la vitesse mais de faire les bons choix de produits dès le départ."
    }
  ];

  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "mainEntity": faqItems.map(item => ({
      "@type": "Question",
      "name": item.question,
      "acceptedAnswer": {
        "@type": "Answer",
        "text": item.answer
      }
    }))
  };

  const breadcrumbSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    "itemListElement": [
      { "@type": "ListItem", "position": 1, "name": "Accueil", "item": "https://amzingfba.com/" },
      { "@type": "ListItem", "position": 2, "name": "Amazon FBA c'est quoi", "item": "https://amzingfba.com/guide/amazon-fba-cest-quoi" }
    ]
  };

  const articleSchema = {
    "@context": "https://schema.org",
    "@type": "Article",
    "headline": "Amazon FBA c'est quoi ? Définition, fonctionnement, avantages & limites",
    "description": "Découvre ce qu'est Amazon FBA, comment ça fonctionne, les avantages et inconvénients, et comment démarrer. Guide complet pour débutants.",
    "author": { "@type": "Organization", "name": "AMZing FBA" },
    "publisher": { "@type": "Organization", "name": "AMZing FBA", "logo": { "@type": "ImageObject", "url": "https://amzingfba.com/logo-amzing.png" } },
    "datePublished": "2025-01-01",
    "dateModified": "2025-01-01"
  };

  return (
    <div className="min-h-screen bg-background">
      <SEO
        title="Amazon FBA c'est quoi ? Définition, fonctionnement, avantages & limites"
        description="Découvre ce qu'est Amazon FBA, comment ça fonctionne étape par étape, les avantages et inconvénients, et comment démarrer. Guide complet 2025."
        keywords="amazon fba c'est quoi, amazon fba définition, c'est quoi fba, amazon fba fonctionnement, amazon fba avantages, amazon fba inconvénients"
        schema={[faqSchema, breadcrumbSchema, articleSchema]}
        robots="index,follow"
      />
      <Navbar />

      {/* Back Arrow */}
      <Button
        variant="default"
        size="icon"
        className="fixed top-[140px] left-4 z-50 bg-primary hover:bg-primary/90 text-primary-foreground rounded-full shadow-lg"
        onClick={() => navigate(-1)}
      >
        <ArrowLeft className="h-5 w-5" />
      </Button>

      {/* Hero */}
      <section className="pt-32 pb-16 bg-gradient-to-br from-primary/10 via-background to-secondary/10">
        <div className="container mx-auto px-4 max-w-4xl">
          <Badge className="mb-4 bg-primary/10 text-primary border-primary/20">Guide complet</Badge>
          <h1 className="text-4xl md:text-5xl font-bold mb-6">Amazon FBA c'est quoi ?</h1>
          <p className="text-xl text-muted-foreground mb-8">
            FBA signifie "Fulfillment by Amazon". En français : expédié par Amazon. 
            Tu envoies tes produits à Amazon, ils gèrent le stockage, l'expédition et le SAV. 
            Toi, tu te concentres sur trouver des produits rentables.
          </p>
          
          {/* Table des matières */}
          <Card className="bg-muted/50">
            <CardContent className="pt-6">
              <h2 className="font-semibold mb-4 flex items-center gap-2">
                <BookOpen className="w-5 h-5" /> Sommaire
              </h2>
              <nav className="grid grid-cols-1 md:grid-cols-2 gap-2">
                {tableOfContents.map((item) => (
                  <a
                    key={item.id}
                    href={`#${item.id}`}
                    className="text-muted-foreground hover:text-primary transition-colors text-sm py-1"
                  >
                    → {item.label}
                  </a>
                ))}
              </nav>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Content */}
      <article className="py-12">
        <div className="container mx-auto px-4 max-w-4xl prose prose-lg dark:prose-invert">
          
          {/* Section 1 */}
          <section id="definition" className="mb-12 scroll-mt-24">
            <h2 className="text-3xl font-bold mb-4 flex items-center gap-3">
              <Package className="w-8 h-8 text-primary" />
              Définition simple d'Amazon FBA
            </h2>
            <p>
              <strong>Amazon FBA</strong> (Fulfillment by Amazon) est un service qui permet aux vendeurs d'utiliser les entrepôts et la logistique d'Amazon pour stocker et expédier leurs produits.
            </p>
            <p>
              Concrètement, voici comment ça fonctionne : tu achètes des produits (chez un fournisseur, en magasin, etc.), tu les envoies dans un entrepôt Amazon, et quand un client passe commande, Amazon s'occupe de tout : préparation, emballage, expédition, et même le service après-vente.
            </p>
            <p>
              En contrepartie, Amazon prélève des frais sur chaque vente (environ 15% du prix de vente) + des frais de logistique (stockage, expédition). L'avantage ? Tes produits sont éligibles à <strong>Amazon Prime</strong> et bénéficient de la confiance des acheteurs Amazon.
            </p>
          </section>

          {/* Section 2 */}
          <section id="fonctionnement" className="mb-12 scroll-mt-24">
            <h2 className="text-3xl font-bold mb-4 flex items-center gap-3">
              <Warehouse className="w-8 h-8 text-primary" />
              Comment fonctionne Amazon FBA (étapes)
            </h2>
            <div className="space-y-4">
              <div className="flex gap-4 items-start">
                <div className="w-8 h-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-bold shrink-0">1</div>
                <div>
                  <h3 className="font-semibold mb-1">Tu crées un compte vendeur Amazon</h3>
                  <p className="text-muted-foreground">Inscription sur Amazon Seller Central. Choix entre plan Individuel (0€/mois + 0,99€/vente) ou Professionnel (39€/mois).</p>
                </div>
              </div>
              <div className="flex gap-4 items-start">
                <div className="w-8 h-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-bold shrink-0">2</div>
                <div>
                  <h3 className="font-semibold mb-1">Tu trouves des produits à vendre</h3>
                  <p className="text-muted-foreground">Sourcing chez des fournisseurs (wholesale), en magasin (retail arbitrage), ou création de ta propre marque (private label).</p>
                </div>
              </div>
              <div className="flex gap-4 items-start">
                <div className="w-8 h-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-bold shrink-0">3</div>
                <div>
                  <h3 className="font-semibold mb-1">Tu prépares et envoies tes produits à Amazon</h3>
                  <p className="text-muted-foreground">Étiquetage des produits avec codes-barres Amazon, création d'un envoi dans Seller Central, expédition vers l'entrepôt Amazon assigné.</p>
                </div>
              </div>
              <div className="flex gap-4 items-start">
                <div className="w-8 h-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-bold shrink-0">4</div>
                <div>
                  <h3 className="font-semibold mb-1">Amazon stocke et gère ta logistique</h3>
                  <p className="text-muted-foreground">Tes produits sont réceptionnés, stockés et deviennent disponibles à la vente. Badge Prime activé.</p>
                </div>
              </div>
              <div className="flex gap-4 items-start">
                <div className="w-8 h-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-bold shrink-0">5</div>
                <div>
                  <h3 className="font-semibold mb-1">Un client commande = Amazon expédie</h3>
                  <p className="text-muted-foreground">Amazon prépare, emballe et expédie le colis. Il gère aussi les retours et le SAV.</p>
                </div>
              </div>
              <div className="flex gap-4 items-start">
                <div className="w-8 h-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-bold shrink-0">6</div>
                <div>
                  <h3 className="font-semibold mb-1">Tu reçois ton paiement (moins les frais)</h3>
                  <p className="text-muted-foreground">Amazon te verse le montant de la vente moins les commissions (référencement + FBA). Versements toutes les 2 semaines.</p>
                </div>
              </div>
            </div>
          </section>

          {/* Section 3 */}
          <section id="avantages-inconvenients" className="mb-12 scroll-mt-24">
            <h2 className="text-3xl font-bold mb-4 flex items-center gap-3">
              <Scale className="w-8 h-8 text-primary" />
              Avantages et inconvénients d'Amazon FBA
            </h2>
            
            <div className="grid md:grid-cols-2 gap-6 not-prose">
              <Card className="border-green-500/30">
                <CardContent className="pt-6">
                  <h3 className="font-semibold text-green-600 mb-4 flex items-center gap-2">
                    <CheckCircle2 className="w-5 h-5" /> Avantages
                  </h3>
                  <ul className="space-y-2 text-sm">
                    <li className="flex items-start gap-2">
                      <CheckCircle2 className="w-4 h-4 text-green-500 shrink-0 mt-0.5" />
                      <span><strong>Accès au badge Prime</strong> : Confiance des clients, meilleur taux de conversion</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle2 className="w-4 h-4 text-green-500 shrink-0 mt-0.5" />
                      <span><strong>Logistique déléguée</strong> : Plus de temps pour le sourcing et la stratégie</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle2 className="w-4 h-4 text-green-500 shrink-0 mt-0.5" />
                      <span><strong>Scalabilité</strong> : Vendre 10 ou 1000 produits, même effort côté logistique</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle2 className="w-4 h-4 text-green-500 shrink-0 mt-0.5" />
                      <span><strong>SAV géré par Amazon</strong> : Retours, remboursements, réclamations</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle2 className="w-4 h-4 text-green-500 shrink-0 mt-0.5" />
                      <span><strong>Trafic Amazon</strong> : Des millions de visiteurs chaque jour</span>
                    </li>
                  </ul>
                </CardContent>
              </Card>
              
              <Card className="border-red-500/30">
                <CardContent className="pt-6">
                  <h3 className="font-semibold text-red-600 mb-4 flex items-center gap-2">
                    <XCircle className="w-5 h-5" /> Inconvénients
                  </h3>
                  <ul className="space-y-2 text-sm">
                    <li className="flex items-start gap-2">
                      <XCircle className="w-4 h-4 text-red-500 shrink-0 mt-0.5" />
                      <span><strong>Frais Amazon</strong> : Commission + stockage + expédition (impact sur la marge)</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <XCircle className="w-4 h-4 text-red-500 shrink-0 mt-0.5" />
                      <span><strong>Dépendance à Amazon</strong> : Leurs règles, leurs décisions</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <XCircle className="w-4 h-4 text-red-500 shrink-0 mt-0.5" />
                      <span><strong>Concurrence intense</strong> : Beaucoup de vendeurs sur les mêmes produits</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <XCircle className="w-4 h-4 text-red-500 shrink-0 mt-0.5" />
                      <span><strong>Frais de stockage longue durée</strong> : Pénalités si stock ne tourne pas</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <XCircle className="w-4 h-4 text-red-500 shrink-0 mt-0.5" />
                      <span><strong>Pas de relation client directe</strong> : Difficile de fidéliser</span>
                    </li>
                  </ul>
                </CardContent>
              </Card>
            </div>
          </section>

          {/* Section 4 - FBA vs FBM */}
          <section id="fba-vs-fbm" className="mb-12 scroll-mt-24">
            <h2 className="text-3xl font-bold mb-4">Amazon FBA vs FBM (résumé)</h2>
            <p className="mb-6">
              FBM signifie "Fulfillment by Merchant" : c'est toi qui gères la logistique. Voici un comparatif rapide :
            </p>
            <div className="overflow-x-auto not-prose">
              <table className="w-full border-collapse text-sm">
                <thead>
                  <tr className="border-b">
                    <th className="text-left py-3 px-4 font-semibold">Critère</th>
                    <th className="text-left py-3 px-4 font-semibold text-primary">FBA</th>
                    <th className="text-left py-3 px-4 font-semibold text-secondary">FBM</th>
                  </tr>
                </thead>
                <tbody>
                  <tr className="border-b">
                    <td className="py-3 px-4">Logistique</td>
                    <td className="py-3 px-4">Amazon gère tout</td>
                    <td className="py-3 px-4">Tu gères tout</td>
                  </tr>
                  <tr className="border-b">
                    <td className="py-3 px-4">Badge Prime</td>
                    <td className="py-3 px-4">✅ Oui</td>
                    <td className="py-3 px-4">❌ Non (sauf Seller Fulfilled Prime)</td>
                  </tr>
                  <tr className="border-b">
                    <td className="py-3 px-4">Frais</td>
                    <td className="py-3 px-4">Plus élevés (stockage + expé)</td>
                    <td className="py-3 px-4">Plus faibles (mais ton temps)</td>
                  </tr>
                  <tr className="border-b">
                    <td className="py-3 px-4">Contrôle</td>
                    <td className="py-3 px-4">Limité</td>
                    <td className="py-3 px-4">Total</td>
                  </tr>
                  <tr className="border-b">
                    <td className="py-3 px-4">SAV</td>
                    <td className="py-3 px-4">Amazon</td>
                    <td className="py-3 px-4">Toi</td>
                  </tr>
                </tbody>
              </table>
            </div>
            <p className="mt-4">
              <strong>En résumé :</strong> FBA est idéal si tu veux te concentrer sur le business et déléguer la logistique. FBM convient si tu as déjà une logistique en place ou si tu veux garder le contrôle total.
            </p>
            <p>
              <Link to="/guide/amazon-fba-vs-fbm" className="text-primary hover:underline inline-flex items-center gap-1">
                Lire le comparatif complet FBA vs FBM <ArrowRight className="w-4 h-4" />
              </Link>
            </p>
          </section>

          {/* Section 5 - Coûts */}
          <section id="couts" className="mb-12 scroll-mt-24">
            <h2 className="text-3xl font-bold mb-4 flex items-center gap-3">
              <DollarSign className="w-8 h-8 text-primary" />
              Combien ça coûte (aperçu)
            </h2>
            <p>Voici les principaux coûts à prévoir pour vendre sur Amazon FBA :</p>
            <div className="not-prose grid md:grid-cols-2 gap-4 my-6">
              <Card>
                <CardContent className="pt-6">
                  <h3 className="font-semibold mb-2">Abonnement vendeur Pro</h3>
                  <p className="text-2xl font-bold text-primary">39€/mois</p>
                  <p className="text-sm text-muted-foreground">Obligatoire pour vendre en volume</p>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="pt-6">
                  <h3 className="font-semibold mb-2">Commission Amazon</h3>
                  <p className="text-2xl font-bold text-primary">8% à 15%</p>
                  <p className="text-sm text-muted-foreground">Selon la catégorie produit</p>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="pt-6">
                  <h3 className="font-semibold mb-2">Frais FBA (expédition)</h3>
                  <p className="text-2xl font-bold text-primary">2€ à 5€</p>
                  <p className="text-sm text-muted-foreground">Par unité vendue (selon taille/poids)</p>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="pt-6">
                  <h3 className="font-semibold mb-2">Stockage mensuel</h3>
                  <p className="text-2xl font-bold text-primary">~26€/m³</p>
                  <p className="text-sm text-muted-foreground">Plus cher en Q4 (oct-déc)</p>
                </CardContent>
              </Card>
            </div>
            <p>
              <Link to="/guide/combien-coute-amazon-fba" className="text-primary hover:underline inline-flex items-center gap-1">
                Voir le détail complet des coûts Amazon FBA <ArrowRight className="w-4 h-4" />
              </Link>
            </p>
          </section>

          {/* Section 6 - Pour qui */}
          <section id="pour-qui" className="mb-12 scroll-mt-24">
            <h2 className="text-3xl font-bold mb-4 flex items-center gap-3">
              <Users className="w-8 h-8 text-primary" />
              Pour qui c'est adapté
            </h2>
            <div className="not-prose grid gap-4">
              <Card className="border-l-4 border-l-primary">
                <CardContent className="pt-6">
                  <h3 className="font-semibold mb-2 flex items-center gap-2">
                    <Target className="w-5 h-5 text-primary" /> Débutants
                  </h3>
                  <p className="text-muted-foreground">
                    Tu veux te lancer dans l'e-commerce sans gérer la logistique. FBA te permet de te concentrer sur l'essentiel : trouver des produits rentables et développer ton business.
                  </p>
                </CardContent>
              </Card>
              <Card className="border-l-4 border-l-secondary">
                <CardContent className="pt-6">
                  <h3 className="font-semibold mb-2 flex items-center gap-2">
                    <Package className="w-5 h-5 text-secondary" /> Créateurs de marque
                  </h3>
                  <p className="text-muted-foreground">
                    Tu développes ta propre marque (private label). FBA te donne accès à l'audience Amazon et au badge Prime, essentiels pour la crédibilité.
                  </p>
                </CardContent>
              </Card>
              <Card className="border-l-4 border-l-green-500">
                <CardContent className="pt-6">
                  <h3 className="font-semibold mb-2 flex items-center gap-2">
                    <Truck className="w-5 h-5 text-green-500" /> Arbitrageurs
                  </h3>
                  <p className="text-muted-foreground">
                    Tu fais du retail ou online arbitrage. FBA te permet de traiter un volume important sans y passer tes journées sur la logistique.
                  </p>
                </CardContent>
              </Card>
            </div>
          </section>

          {/* Section 7 - Démarrer */}
          <section id="demarrer" className="mb-12 scroll-mt-24">
            <h2 className="text-3xl font-bold mb-4">Comment démarrer (mini-checklist)</h2>
            <div className="not-prose bg-muted/50 p-6 rounded-xl">
              <ul className="space-y-3">
                <li className="flex items-start gap-3">
                  <CheckCircle2 className="w-5 h-5 text-green-500 shrink-0 mt-0.5" />
                  <span><strong>Créer un compte Amazon Seller Central</strong> (plan Pro recommandé)</span>
                </li>
                <li className="flex items-start gap-3">
                  <CheckCircle2 className="w-5 h-5 text-green-500 shrink-0 mt-0.5" />
                  <span><strong>Choisir ton modèle</strong> : wholesale, retail arbitrage, ou private label</span>
                </li>
                <li className="flex items-start gap-3">
                  <CheckCircle2 className="w-5 h-5 text-green-500 shrink-0 mt-0.5" />
                  <span><strong>Trouver des produits rentables</strong> avec des outils d'analyse (BSR, concurrence, marge)</span>
                </li>
                <li className="flex items-start gap-3">
                  <CheckCircle2 className="w-5 h-5 text-green-500 shrink-0 mt-0.5" />
                  <span><strong>Sourcer tes premiers produits</strong> auprès de fournisseurs fiables</span>
                </li>
                <li className="flex items-start gap-3">
                  <CheckCircle2 className="w-5 h-5 text-green-500 shrink-0 mt-0.5" />
                  <span><strong>Préparer et envoyer ton stock</strong> à Amazon (étiquetage, expédition)</span>
                </li>
                <li className="flex items-start gap-3">
                  <CheckCircle2 className="w-5 h-5 text-green-500 shrink-0 mt-0.5" />
                  <span><strong>Lancer tes ventes</strong> et optimiser tes listings</span>
                </li>
              </ul>
            </div>
            <p className="mt-4">
              <Link to="/guide/comment-debuter-amazon-fba" className="text-primary hover:underline inline-flex items-center gap-1">
                Voir le guide complet pour débuter <ArrowRight className="w-4 h-4" />
              </Link>
            </p>
          </section>

          {/* Section 8 - CTA */}
          <section id="aller-plus-loin" className="mb-12 scroll-mt-24">
            <h2 className="text-3xl font-bold mb-4">Aller plus loin</h2>
            <div className="not-prose">
              <Card className="bg-gradient-to-br from-primary/10 to-secondary/10 border-primary/30">
                <CardContent className="pt-6 text-center">
                  <h3 className="text-xl font-bold mb-3">Tu veux te lancer sérieusement sur Amazon FBA ?</h3>
                  <p className="text-muted-foreground mb-6">
                    AMZing FBA t'accompagne avec une méthode structurée, des moniteurs de produits rentables, 
                    un catalogue fournisseurs et une communauté active.
                  </p>
                  <Button variant="hero" size="lg" asChild>
                    <Link to="/formation">
                      Accéder à la formation Amazon FBA <ArrowRight className="ml-2" />
                    </Link>
                  </Button>
                  <p className="text-sm text-muted-foreground mt-3">34,99€/mois • Sans engagement</p>
                </CardContent>
              </Card>
            </div>

            {/* Articles liés */}
            <div className="mt-8">
              <h3 className="font-semibold mb-4 flex items-center gap-2">
                <BookOpen className="w-5 h-5" /> Guides connexes
              </h3>
              <div className="not-prose grid md:grid-cols-2 gap-4">
                <Link to="/guide/amazon-fba-vs-fbm" className="block p-4 border rounded-lg hover:border-primary transition-colors">
                  <span className="font-medium">Amazon FBA vs FBM : lequel choisir ?</span>
                  <p className="text-sm text-muted-foreground mt-1">Comparatif détaillé des deux modèles</p>
                </Link>
                <Link to="/guide/comment-debuter-amazon-fba" className="block p-4 border rounded-lg hover:border-primary transition-colors">
                  <span className="font-medium">Comment débuter sur Amazon FBA</span>
                  <p className="text-sm text-muted-foreground mt-1">Guide étape par étape pour démarrer</p>
                </Link>
                <Link to="/guide/combien-coute-amazon-fba" className="block p-4 border rounded-lg hover:border-primary transition-colors">
                  <span className="font-medium">Combien coûte Amazon FBA ?</span>
                  <p className="text-sm text-muted-foreground mt-1">Tous les frais expliqués</p>
                </Link>
                <Link to="/guide/formation-amazon-fba-debutant" className="block p-4 border rounded-lg hover:border-primary transition-colors">
                  <span className="font-medium">Formation Amazon FBA débutant</span>
                  <p className="text-sm text-muted-foreground mt-1">Comment bien se former</p>
                </Link>
              </div>
            </div>
          </section>

          {/* FAQ */}
          <section id="faq" className="scroll-mt-24">
            <h2 className="text-3xl font-bold mb-6 flex items-center gap-3">
              <HelpCircle className="w-8 h-8 text-primary" />
              Questions fréquentes
            </h2>
            <div className="not-prose">
              <Accordion type="single" collapsible className="w-full">
                {faqItems.map((item, index) => (
                  <AccordionItem key={index} value={`faq-${index}`}>
                    <AccordionTrigger className="text-left font-medium">
                      {item.question}
                    </AccordionTrigger>
                    <AccordionContent className="text-muted-foreground">
                      {item.answer}
                    </AccordionContent>
                  </AccordionItem>
                ))}
              </Accordion>
            </div>
          </section>
        </div>
      </article>

      <Footer />
    </div>
  );
};

export default AmazonFbaCestQuoi;
