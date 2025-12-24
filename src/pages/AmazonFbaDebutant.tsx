import { ArrowRight, ArrowLeft, CheckCircle2, XCircle, Package, Truck, Headphones, Clock, Euro, Scale, AlertTriangle, TrendingUp, Users, BookOpen, Target, Lightbulb, ShoppingCart, BarChart3, Warehouse, BadgeCheck, ChevronRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import SEO from '@/components/SEO';
import { seoData, schemas } from '@/lib/seo-data';
import { useScrollReveal } from '@/hooks/use-scroll-reveal';
import { cn } from '@/lib/utils';
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";

// FAQ data for rendering and schema
const faqItems = [
  {
    question: "C'est quoi Amazon FBA exactement ?",
    answer: "Amazon FBA (Fulfillment By Amazon) signifie 'Expédié par Amazon'. C'est un service où tu envoies tes produits dans les entrepôts Amazon, et Amazon gère tout : stockage, emballage, livraison, service client et retours. Tu te concentres sur la vente, Amazon s'occupe de la logistique."
  },
  {
    question: "Quelle est la différence entre FBA et FBM ?",
    answer: "En FBA, Amazon gère la logistique (stockage, expédition, SAV). En FBM (Fulfilled By Merchant), tu gères tout toi-même depuis chez toi. FBA offre l'accès Prime et une meilleure visibilité, mais avec des frais Amazon. FBM donne plus de contrôle et des marges potentiellement plus élevées sur certains produits."
  },
  {
    question: "Combien ça coûte de vendre en Amazon FBA ?",
    answer: "Les coûts incluent : l'abonnement vendeur pro (39€/mois HT), les frais de fulfillment (2-5€ par unité selon taille/poids), les frais de stockage (25-40€/m³/mois) et la commission Amazon (7-15% selon catégorie). Prévois un budget initial de 500-2000€ pour ton premier stock."
  },
  {
    question: "Est-ce que Amazon FBA est rentable en 2025 ?",
    answer: "Oui, Amazon FBA reste rentable en 2025, mais la réussite dépend de plusieurs facteurs : choix des produits (marge suffisante), gestion des coûts, qualité du sourcing et stratégie marketing. Avec une bonne méthode et des outils adaptés, des marges de 15-30% sont réalistes."
  },
  {
    question: "Quel budget pour commencer Amazon FBA ?",
    answer: "Pour débuter sérieusement, prévois 1000-3000€ : 500-2000€ pour ton premier stock, 39€/mois pour le compte vendeur Amazon, et un budget optionnel pour les outils et la formation. Tu peux démarrer avec moins, mais tes premiers résultats seront limités."
  },
  {
    question: "Comment trouver des produits rentables pour Amazon FBA ?",
    answer: "Plusieurs méthodes : l'arbitrage (achat en promo et revente), le wholesale (achat en gros chez des grossistes) ou le private label (création de ta marque). Des outils comme AMZing FBA analysent automatiquement les opportunités et t'envoient des produits rentables validés chaque jour."
  },
  {
    question: "Faut-il une entreprise pour vendre sur Amazon FBA ?",
    answer: "Oui, un statut professionnel est obligatoire : micro-entreprise (le plus simple pour débuter), SASU, EURL ou SAS. La micro-entreprise suffit pour commencer, mais attention au plafond de chiffre d'affaires (77 700€/an en prestations, 188 700€ en vente)."
  },
  {
    question: "Combien de temps pour être rentable avec Amazon FBA ?",
    answer: "Avec une bonne formation et les bons outils, la plupart des vendeurs sérieux deviennent rentables en 2-4 mois. Le premier mois sert à apprendre et tester, les mois suivants à optimiser. La clé : bien choisir ses produits dès le départ."
  }
];

// Table of contents items
const tocItems = [
  { id: "definition", label: "Définition simple" },
  { id: "fonctionnement", label: "Comment ça fonctionne" },
  { id: "fba-vs-fbm", label: "FBA vs FBM" },
  { id: "couts", label: "Combien ça coûte" },
  { id: "avantages-inconvenients", label: "Avantages / Inconvénients" },
  { id: "rentabilite", label: "Est-ce rentable ?" },
  { id: "comment-debuter", label: "Comment débuter" },
  { id: "erreurs", label: "Erreurs fréquentes" },
  { id: "faq", label: "FAQ" },
];

// Combined schema for the page
const combinedSchema = {
  "@context": "https://schema.org",
  "@graph": [
    schemas.amazonFbaDebutantArticle,
    schemas.amazonFbaDebutantFAQ,
    schemas.amazonFbaDebutantBreadcrumb,
    schemas.organization
  ]
};

const AmazonFbaDebutant = () => {
  const heroAnim = useScrollReveal({ animation: 'fade-up', delay: 100 });

  const scrollToSection = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      <SEO 
        title={seoData.amazonFbaDebutant.title}
        description={seoData.amazonFbaDebutant.description}
        keywords={seoData.amazonFbaDebutant.keywords}
        robots={seoData.amazonFbaDebutant.robots}
        schema={combinedSchema}
      />
      <Navbar />
      
      {/* Back Button */}
      <div className="fixed top-24 left-4 z-40">
        <Link 
          to="/" 
          className="flex items-center justify-center w-10 h-10 rounded-full bg-primary text-primary-foreground shadow-lg hover:bg-primary/90 hover:scale-110 transition-all duration-200"
          aria-label="Retour à l'accueil"
        >
          <ArrowLeft className="w-5 h-5" />
        </Link>
      </div>

      <main className="flex-grow">
        {/* Breadcrumb */}
        <div className="container mx-auto px-4 pt-24 pb-4">
          <Breadcrumb>
            <BreadcrumbList>
              <BreadcrumbItem>
                <BreadcrumbLink asChild>
                  <Link to="/">Accueil</Link>
                </BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator>
                <ChevronRight className="h-4 w-4" />
              </BreadcrumbSeparator>
              <BreadcrumbItem>
                <BreadcrumbPage>Amazon FBA : c'est quoi ?</BreadcrumbPage>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>
        </div>

        {/* Hero Section with Quick Answer */}
        <section 
          ref={heroAnim.ref}
          className={cn(
            "pb-16 bg-gradient-to-br from-primary/10 via-background to-secondary/10 transition-all duration-700",
            heroAnim.isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"
          )}
        >
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto">
              <span className="inline-block px-4 py-2 bg-primary/20 text-primary rounded-full text-sm font-medium mb-6">
                Guide complet 2025
              </span>
              
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 text-foreground">
                Amazon FBA : c'est quoi ?
              </h1>
              
              {/* Quick Answer Box - Above the fold */}
              <Card className="border-primary/30 bg-primary/5 mb-8">
                <CardContent className="pt-6">
                  <div className="flex items-start gap-4">
                    <div className="p-2 bg-primary/20 rounded-lg shrink-0">
                      <BadgeCheck className="w-6 h-6 text-primary" />
                    </div>
                    <div>
                      <p className="text-lg font-semibold mb-2 text-foreground">Réponse rapide</p>
                      <p className="text-muted-foreground">
                        <strong>Amazon FBA (Fulfillment By Amazon)</strong> = "Expédié par Amazon". Tu envoies tes produits dans les entrepôts Amazon, et Amazon s'occupe de tout : stockage, emballage, livraison aux clients, service client et retours. Tu te concentres uniquement sur le choix des produits et la vente.
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <p className="text-lg text-muted-foreground mb-8">
                Tu te demandes ce qu'est Amazon FBA, comment ça fonctionne et si c'est rentable ? Ce guide t'explique tout : définition, différences avec FBM, coûts, avantages, inconvénients et comment te lancer concrètement.
              </p>

              {/* Table of Contents */}
              <Card className="border-border/50">
                <CardHeader className="pb-3">
                  <CardTitle className="text-lg flex items-center gap-2">
                    <BookOpen className="w-5 h-5 text-primary" />
                    Sommaire
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <nav aria-label="Sommaire de l'article">
                    <ol className="grid sm:grid-cols-2 gap-2">
                      {tocItems.map((item, index) => (
                        <li key={item.id}>
                          <button
                            onClick={() => scrollToSection(item.id)}
                            className="text-left w-full px-3 py-2 rounded-lg hover:bg-accent/50 transition-colors text-muted-foreground hover:text-foreground flex items-center gap-2"
                          >
                            <span className="text-primary font-medium">{index + 1}.</span>
                            {item.label}
                          </button>
                        </li>
                      ))}
                    </ol>
                  </nav>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>

        {/* Section 1: Definition */}
        <section id="definition" className="py-16 scroll-mt-24">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto">
              <div className="flex items-center gap-3 mb-6">
                <div className="p-3 bg-primary/20 rounded-xl">
                  <Package className="w-8 h-8 text-primary" />
                </div>
                <h2 className="text-3xl md:text-4xl font-bold">Amazon FBA : définition simple</h2>
              </div>
              
              {/* Definition Box */}
              <Card className="border-secondary/30 bg-secondary/5 mb-8">
                <CardContent className="pt-6">
                  <p className="text-lg">
                    <strong className="text-secondary">FBA = Fulfillment By Amazon</strong>, soit "Expédié par Amazon" en français. 
                  </p>
                  <p className="text-muted-foreground mt-2">
                    C'est un service proposé par Amazon où le vendeur (toi) envoie ses produits dans les centres logistiques d'Amazon. Ensuite, Amazon prend en charge :
                  </p>
                  <ul className="mt-4 space-y-2 text-muted-foreground">
                    <li className="flex items-start gap-2">
                      <Warehouse className="w-5 h-5 text-primary shrink-0 mt-0.5" />
                      <span><strong>Le stockage</strong> dans ses entrepôts</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <Package className="w-5 h-5 text-primary shrink-0 mt-0.5" />
                      <span><strong>L'emballage</strong> et la préparation des commandes</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <Truck className="w-5 h-5 text-primary shrink-0 mt-0.5" />
                      <span><strong>L'expédition</strong> aux clients (dont livraison Prime)</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <Headphones className="w-5 h-5 text-primary shrink-0 mt-0.5" />
                      <span><strong>Le service client</strong> et la gestion des retours</span>
                    </li>
                  </ul>
                </CardContent>
              </Card>

              <p className="text-muted-foreground mb-4">
                En utilisant FBA, tes produits deviennent éligibles à <strong>Amazon Prime</strong>, ce qui améliore ta visibilité et tes conversions. Les clients Prime préfèrent acheter des produits avec livraison rapide et gratuite.
              </p>
              
              <p className="text-muted-foreground">
                Concrètement, FBA te permet de <strong>vendre sur Amazon sans gérer la logistique</strong>. Tu te concentres sur ce qui compte : trouver des produits rentables, négocier avec les fournisseurs et développer tes ventes.
              </p>
            </div>
          </div>
        </section>

        {/* Section 2: How it works */}
        <section id="fonctionnement" className="py-16 bg-accent/30 scroll-mt-24">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto">
              <div className="flex items-center gap-3 mb-8">
                <div className="p-3 bg-secondary/20 rounded-xl">
                  <ShoppingCart className="w-8 h-8 text-secondary" />
                </div>
                <h2 className="text-3xl md:text-4xl font-bold">Comment fonctionne Amazon FBA ? (étapes)</h2>
              </div>
              
              <p className="text-muted-foreground mb-8">
                Voici le fonctionnement d'Amazon FBA en 5 étapes simples :
              </p>
              
              <div className="space-y-4">
                {[
                  {
                    step: 1,
                    title: "Tu choisis tes produits",
                    description: "Tu identifies des produits rentables à vendre (arbitrage, wholesale ou private label). L'objectif : trouver des produits avec une marge suffisante après frais Amazon."
                  },
                  {
                    step: 2,
                    title: "Tu crées ta fiche produit",
                    description: "Tu listes ton produit sur Amazon Seller Central : titre, description, photos, prix. Si le produit existe déjà, tu te rattaches à la fiche existante."
                  },
                  {
                    step: 3,
                    title: "Tu envoies ton stock à Amazon",
                    description: "Tu prépares tes colis selon les normes Amazon et tu les expédies vers les entrepôts FBA. Amazon te dit où envoyer (souvent plusieurs centres)."
                  },
                  {
                    step: 4,
                    title: "Amazon gère tout le reste",
                    description: "Dès qu'un client commande, Amazon prélève le produit, l'emballe et l'expédie. Il gère aussi le service client, les questions et les retours."
                  },
                  {
                    step: 5,
                    title: "Tu reçois ton paiement",
                    description: "Amazon te verse tes ventes toutes les 2 semaines, après déduction des frais (commission, stockage, fulfillment). Tu suis tout dans Seller Central."
                  }
                ].map((item) => (
                  <Card key={item.step} className="border-primary/20 hover:border-primary/40 transition-all hover:shadow-lg">
                    <CardContent className="pt-6">
                      <div className="flex items-start gap-4">
                        <div className="p-3 rounded-xl bg-primary text-primary-foreground text-xl font-bold min-w-[50px] text-center shrink-0">
                          {item.step}
                        </div>
                        <div>
                          <h3 className="font-bold text-xl mb-2">{item.title}</h3>
                          <p className="text-muted-foreground">{item.description}</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* Section 3: FBA vs FBM */}
        <section id="fba-vs-fbm" className="py-16 scroll-mt-24">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto">
              <div className="flex items-center gap-3 mb-8">
                <div className="p-3 bg-primary/20 rounded-xl">
                  <Scale className="w-8 h-8 text-primary" />
                </div>
                <h2 className="text-3xl md:text-4xl font-bold">FBA vs FBM : quelles différences ?</h2>
              </div>

              <p className="text-muted-foreground mb-8">
                <strong>FBM (Fulfilled By Merchant)</strong> signifie "Expédié par le vendeur". Contrairement à FBA, c'est toi qui gères tout depuis chez toi. Voici un comparatif clair :
              </p>

              {/* Comparison Table */}
              <Card className="border-border/50 mb-8 overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b bg-muted/50">
                        <th className="text-left p-4 font-semibold">Critère</th>
                        <th className="text-center p-4 font-semibold text-primary">FBA (Amazon)</th>
                        <th className="text-center p-4 font-semibold text-secondary">FBM (Toi)</th>
                      </tr>
                    </thead>
                    <tbody>
                      {[
                        { criteria: "Stockage", fba: "Entrepôts Amazon", fbm: "Chez toi" },
                        { criteria: "Expédition", fba: "Amazon expédie", fbm: "Tu expédies" },
                        { criteria: "Service client", fba: "Géré par Amazon", fbm: "Tu gères" },
                        { criteria: "Retours", fba: "Amazon s'en occupe", fbm: "À ta charge" },
                        { criteria: "Délai livraison", fba: "1-2 jours (Prime)", fbm: "3-7 jours" },
                        { criteria: "Frais", fba: "Frais FBA", fbm: "Tes propres coûts" },
                        { criteria: "Éligible Prime", fba: "✓ Oui", fbm: "✗ Non (sauf SFP)" },
                        { criteria: "Contrôle qualité", fba: "Limité", fbm: "Total" },
                        { criteria: "Pour quel profil", fba: "Scaler rapidement", fbm: "Produits volumineux, marges serrées" },
                      ].map((row, i) => (
                        <tr key={i} className="border-b last:border-0">
                          <td className="p-4 font-medium">{row.criteria}</td>
                          <td className="p-4 text-center text-muted-foreground">{row.fba}</td>
                          <td className="p-4 text-center text-muted-foreground">{row.fbm}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </Card>

              <Card className="border-primary/30 bg-primary/5">
                <CardContent className="pt-6">
                  <p className="font-semibold mb-2">En résumé :</p>
                  <ul className="space-y-2 text-muted-foreground">
                    <li>• <strong>Choisis FBA</strong> si tu veux scaler, profiter de Prime et déléguer la logistique</li>
                    <li>• <strong>Choisis FBM</strong> pour des produits volumineux, fragiles ou à faible rotation</li>
                    <li>• Beaucoup de vendeurs utilisent <strong>les deux</strong> selon les produits</li>
                  </ul>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>

        {/* Section 4: Costs */}
        <section id="couts" className="py-16 bg-accent/30 scroll-mt-24">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto">
              <div className="flex items-center gap-3 mb-8">
                <div className="p-3 bg-secondary/20 rounded-xl">
                  <Euro className="w-8 h-8 text-secondary" />
                </div>
                <h2 className="text-3xl md:text-4xl font-bold">Combien ça coûte Amazon FBA ?</h2>
              </div>

              <p className="text-muted-foreground mb-8">
                Vendre en FBA implique plusieurs types de frais. Voici les principaux à connaître :
              </p>

              <div className="grid md:grid-cols-2 gap-6 mb-8">
                <Card className="border-border/50">
                  <CardHeader>
                    <CardTitle className="text-lg">1. Abonnement vendeur Pro</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-2xl font-bold text-primary mb-2">39€/mois <span className="text-sm font-normal text-muted-foreground">HT</span></p>
                    <p className="text-muted-foreground text-sm">Obligatoire pour vendre sérieusement. Donne accès à toutes les fonctionnalités Seller Central.</p>
                  </CardContent>
                </Card>

                <Card className="border-border/50">
                  <CardHeader>
                    <CardTitle className="text-lg">2. Commission sur vente (Referral fee)</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-2xl font-bold text-primary mb-2">7-15% <span className="text-sm font-normal text-muted-foreground">du prix de vente</span></p>
                    <p className="text-muted-foreground text-sm">Varie selon la catégorie (ex: 15% en électronique, 8% en informatique).</p>
                  </CardContent>
                </Card>

                <Card className="border-border/50">
                  <CardHeader>
                    <CardTitle className="text-lg">3. Frais de fulfillment FBA</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-2xl font-bold text-primary mb-2">2-5€ <span className="text-sm font-normal text-muted-foreground">par unité</span></p>
                    <p className="text-muted-foreground text-sm">Dépend du poids et de la taille du produit. Inclut picking, packing et livraison.</p>
                  </CardContent>
                </Card>

                <Card className="border-border/50">
                  <CardHeader>
                    <CardTitle className="text-lg">4. Frais de stockage</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-2xl font-bold text-primary mb-2">25-40€ <span className="text-sm font-normal text-muted-foreground">/m³/mois</span></p>
                    <p className="text-muted-foreground text-sm">Plus élevés d'octobre à décembre. Évite le sur-stockage pour limiter les coûts.</p>
                  </CardContent>
                </Card>
              </div>

              {/* Margin calculation example */}
              <Card className="border-secondary/30 bg-secondary/5">
                <CardHeader>
                  <CardTitle className="text-lg flex items-center gap-2">
                    <BarChart3 className="w-5 h-5 text-secondary" />
                    Exemple de calcul de marge (pédagogique)
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3 text-muted-foreground">
                    <div className="flex justify-between">
                      <span>Prix de vente Amazon</span>
                      <span className="font-semibold">25,00 €</span>
                    </div>
                    <div className="flex justify-between text-red-500">
                      <span>- Commission Amazon (15%)</span>
                      <span>- 3,75 €</span>
                    </div>
                    <div className="flex justify-between text-red-500">
                      <span>- Frais FBA (fulfillment)</span>
                      <span>- 3,50 €</span>
                    </div>
                    <div className="flex justify-between text-red-500">
                      <span>- Coût d'achat produit</span>
                      <span>- 10,00 €</span>
                    </div>
                    <div className="flex justify-between text-red-500">
                      <span>- Frais stockage (estimé)</span>
                      <span>- 0,50 €</span>
                    </div>
                    <div className="border-t pt-3 flex justify-between font-bold text-green-600">
                      <span>= Marge nette</span>
                      <span>7,25 € (29% ROI)</span>
                    </div>
                  </div>
                  <p className="text-sm text-muted-foreground mt-4 italic">
                    Cet exemple est simplifié. Utilise le calculateur FBA d'Amazon pour des estimations précises.
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>

        {/* Section 5: Pros and Cons */}
        <section id="avantages-inconvenients" className="py-16 scroll-mt-24">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto">
              <div className="flex items-center gap-3 mb-8">
                <div className="p-3 bg-primary/20 rounded-xl">
                  <Scale className="w-8 h-8 text-primary" />
                </div>
                <h2 className="text-3xl md:text-4xl font-bold">Avantages et inconvénients d'Amazon FBA</h2>
              </div>

              <div className="grid md:grid-cols-2 gap-8">
                {/* Advantages */}
                <Card className="border-green-500/30 bg-green-500/5">
                  <CardHeader>
                    <CardTitle className="text-lg flex items-center gap-2 text-green-600">
                      <CheckCircle2 className="w-5 h-5" />
                      5 avantages de FBA
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ul className="space-y-3">
                      <li className="flex items-start gap-2">
                        <CheckCircle2 className="w-5 h-5 text-green-500 shrink-0 mt-0.5" />
                        <span><strong>Éligibilité Prime</strong> : tes produits bénéficient de la livraison rapide et gratuite pour les membres Prime</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <CheckCircle2 className="w-5 h-5 text-green-500 shrink-0 mt-0.5" />
                        <span><strong>Logistique déléguée</strong> : plus besoin de gérer les colis, Amazon s'occupe de tout</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <CheckCircle2 className="w-5 h-5 text-green-500 shrink-0 mt-0.5" />
                        <span><strong>SAV géré par Amazon</strong> : service client et retours pris en charge</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <CheckCircle2 className="w-5 h-5 text-green-500 shrink-0 mt-0.5" />
                        <span><strong>Meilleure visibilité</strong> : les produits FBA sont favorisés dans les résultats de recherche</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <CheckCircle2 className="w-5 h-5 text-green-500 shrink-0 mt-0.5" />
                        <span><strong>Scalabilité</strong> : facile de passer de 10 à 1000 ventes/jour</span>
                      </li>
                    </ul>
                  </CardContent>
                </Card>

                {/* Disadvantages */}
                <Card className="border-red-500/30 bg-red-500/5">
                  <CardHeader>
                    <CardTitle className="text-lg flex items-center gap-2 text-red-600">
                      <XCircle className="w-5 h-5" />
                      5 inconvénients de FBA
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ul className="space-y-3">
                      <li className="flex items-start gap-2">
                        <XCircle className="w-5 h-5 text-red-500 shrink-0 mt-0.5" />
                        <span><strong>Frais élevés</strong> : les frais FBA réduisent tes marges, surtout sur les petits produits</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <XCircle className="w-5 h-5 text-red-500 shrink-0 mt-0.5" />
                        <span><strong>Perte de contrôle</strong> : tu ne maîtrises pas la qualité d'emballage ni l'expérience client</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <XCircle className="w-5 h-5 text-red-500 shrink-0 mt-0.5" />
                        <span><strong>Règles strictes</strong> : Amazon impose des normes d'étiquetage et d'emballage précises</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <XCircle className="w-5 h-5 text-red-500 shrink-0 mt-0.5" />
                        <span><strong>Frais de stockage long terme</strong> : pénalités si ton stock reste trop longtemps</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <XCircle className="w-5 h-5 text-red-500 shrink-0 mt-0.5" />
                        <span><strong>Dépendance à Amazon</strong> : si ton compte est suspendu, tout s'arrête</span>
                      </li>
                    </ul>
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
        </section>

        {/* Section 6: Profitability */}
        <section id="rentabilite" className="py-16 bg-accent/30 scroll-mt-24">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto">
              <div className="flex items-center gap-3 mb-8">
                <div className="p-3 bg-secondary/20 rounded-xl">
                  <TrendingUp className="w-8 h-8 text-secondary" />
                </div>
                <h2 className="text-3xl md:text-4xl font-bold">Est-ce que Amazon FBA est rentable ?</h2>
              </div>

              <p className="text-muted-foreground mb-8">
                Oui, <strong>Amazon FBA reste rentable en 2025</strong>, mais ce n'est pas automatique. La rentabilité dépend de plusieurs facteurs :
              </p>

              <div className="grid md:grid-cols-2 gap-6 mb-8">
                <Card className="border-border/50">
                  <CardContent className="pt-6">
                    <h3 className="font-semibold mb-3 flex items-center gap-2">
                      <Target className="w-5 h-5 text-primary" />
                      Facteurs de succès
                    </h3>
                    <ul className="space-y-2 text-muted-foreground">
                      <li>• Choix de produits avec marge suffisante (min. 20%)</li>
                      <li>• Bonne gestion des coûts (stockage, pub, retours)</li>
                      <li>• Sourcing auprès de fournisseurs fiables</li>
                      <li>• Stratégie de prix compétitive</li>
                      <li>• Utilisation intelligente d'Amazon Ads</li>
                    </ul>
                  </CardContent>
                </Card>

                <Card className="border-border/50">
                  <CardContent className="pt-6">
                    <h3 className="font-semibold mb-3 flex items-center gap-2">
                      <AlertTriangle className="w-5 h-5 text-orange-500" />
                      Ce qui tue la rentabilité
                    </h3>
                    <ul className="space-y-2 text-muted-foreground">
                      <li>• Produits avec marges trop faibles (&lt;15%)</li>
                      <li>• Sur-stockage = frais de stockage explosent</li>
                      <li>• Taux de retours élevé (&gt;5%)</li>
                      <li>• Concurrence féroce sans différenciation</li>
                      <li>• Dépenses publicitaires non maîtrisées</li>
                    </ul>
                  </CardContent>
                </Card>
              </div>

              {/* Checklist */}
              <Card className="border-primary/30 bg-primary/5">
                <CardHeader>
                  <CardTitle className="text-lg flex items-center gap-2">
                    <CheckCircle2 className="w-5 h-5 text-primary" />
                    Checklist avant de te lancer
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="grid sm:grid-cols-2 gap-3">
                    {[
                      "J'ai un budget de départ (500-2000€)",
                      "J'ai créé ma société ou micro-entreprise",
                      "J'ai identifié une méthode (arbitrage, wholesale...)",
                      "Je connais mes frais Amazon (calculateur FBA)",
                      "J'ai accès à des outils de recherche produits",
                      "Je suis prêt à apprendre et tester",
                    ].map((item, i) => (
                      <li key={i} className="flex items-center gap-2 text-muted-foreground">
                        <div className="w-5 h-5 rounded border-2 border-primary/50 flex items-center justify-center shrink-0">
                          <span className="text-xs text-primary">✓</span>
                        </div>
                        {item}
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>

        {/* Section 7: How to start */}
        <section id="comment-debuter" className="py-16 scroll-mt-24">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto">
              <div className="flex items-center gap-3 mb-8">
                <div className="p-3 bg-primary/20 rounded-xl">
                  <Lightbulb className="w-8 h-8 text-primary" />
                </div>
                <h2 className="text-3xl md:text-4xl font-bold">Comment débuter sur Amazon FBA (plan d'action)</h2>
              </div>

              <p className="text-muted-foreground mb-8">
                Voici les 7 étapes concrètes pour lancer ton business Amazon FBA :
              </p>

              <div className="space-y-4 mb-10">
                {[
                  {
                    step: 1,
                    title: "Créer ton statut juridique",
                    description: "Micro-entreprise pour commencer (gratuit, simple). Tu auras besoin d'un SIRET pour ouvrir ton compte vendeur Amazon.",
                    link: { to: "/creation-societe", text: "Guide création société" }
                  },
                  {
                    step: 2,
                    title: "Ouvrir un compte Amazon Seller Central",
                    description: "Inscription avec compte Pro (39€/mois). Prépare : pièce d'identité, relevé bancaire, facture récente, numéro de téléphone."
                  },
                  {
                    step: 3,
                    title: "Choisir ta stratégie de sourcing",
                    description: "Arbitrage (achat-revente), wholesale (grossistes) ou private label (ta marque). Le wholesale est idéal pour débuter."
                  },
                  {
                    step: 4,
                    title: "Trouver des produits rentables",
                    description: "Utilise des outils comme AMZing FBA pour recevoir des produits analysés chaque jour. Calcule toujours ta marge avant d'acheter.",
                    link: { to: "/", text: "Découvrir AMZing FBA" }
                  },
                  {
                    step: 5,
                    title: "Commander et envoyer à Amazon",
                    description: "Commande chez ton fournisseur, réceptionne et prépare tes produits selon les normes Amazon, puis expédie vers les entrepôts FBA."
                  },
                  {
                    step: 6,
                    title: "Optimiser tes fiches produits",
                    description: "Travaille tes titres, bullet points et descriptions pour le référencement. Des photos de qualité augmentent tes conversions."
                  },
                  {
                    step: 7,
                    title: "Analyser et scaler",
                    description: "Suis tes ventes, identifie ce qui fonctionne, réinvestis tes gains et développe progressivement ton catalogue."
                  }
                ].map((item) => (
                  <Card key={item.step} className="border-primary/20 hover:border-primary/40 transition-all hover:shadow-md">
                    <CardContent className="pt-6">
                      <div className="flex items-start gap-4">
                        <div className="p-3 rounded-xl bg-gradient-to-br from-primary to-secondary text-white text-xl font-bold min-w-[50px] text-center shrink-0">
                          {item.step}
                        </div>
                        <div className="flex-1">
                          <h3 className="font-bold text-xl mb-2">{item.title}</h3>
                          <p className="text-muted-foreground mb-2">{item.description}</p>
                          {item.link && (
                            <Link to={item.link.to} className="text-primary hover:underline font-medium inline-flex items-center gap-1">
                              {item.link.text}
                              <ChevronRight className="w-4 h-4" />
                            </Link>
                          )}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>

              {/* CTA 1 - Après "Comment débuter" */}
              <Card className="bg-gradient-to-r from-primary to-secondary text-white border-none">
                <CardContent className="py-8 text-center">
                  <h3 className="text-xl font-bold mb-3">Tu veux gagner du temps sur la recherche de produits ?</h3>
                  <p className="text-white/90 mb-6 max-w-xl mx-auto">
                    AMZing FBA t'envoie chaque jour des opportunités de produits rentables déjà analysés. Plus besoin de chercher pendant des heures.
                  </p>
                  <Button size="lg" variant="secondary" asChild className="text-lg px-8">
                    <Link to="/">
                      Découvrir l'outil AMZing FBA
                      <ArrowRight className="w-5 h-5 ml-2" />
                    </Link>
                  </Button>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>

        {/* Section 8: Common mistakes */}
        <section id="erreurs" className="py-16 bg-accent/30 scroll-mt-24">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto">
              <div className="flex items-center gap-3 mb-8">
                <div className="p-3 bg-red-500/20 rounded-xl">
                  <AlertTriangle className="w-8 h-8 text-red-500" />
                </div>
                <h2 className="text-3xl md:text-4xl font-bold">Erreurs fréquentes des débutants</h2>
              </div>

              <p className="text-muted-foreground mb-8">
                Voici les 6 erreurs les plus courantes et comment les éviter :
              </p>

              <div className="space-y-4">
                {[
                  {
                    error: "Ne pas calculer sa marge avant d'acheter",
                    solution: "Utilise toujours le calculateur FBA d'Amazon. Vise minimum 20% de marge nette après tous les frais."
                  },
                  {
                    error: "Acheter trop de stock au début",
                    solution: "Commence petit (10-30 unités) pour tester la demande. Tu pourras réapprovisionner si ça marche."
                  },
                  {
                    error: "Négliger les frais de stockage",
                    solution: "Évite le sur-stockage. Ajuste tes quantités pour que ton stock tourne en 2-3 mois maximum."
                  },
                  {
                    error: "Ignorer la concurrence",
                    solution: "Vérifie toujours le nombre de vendeurs, les avis et le BSR (Best Seller Rank) avant d'acheter."
                  },
                  {
                    error: "Vendre des produits à restrictions sans autorisation",
                    solution: "Certaines catégories (beauté, alimentaire...) nécessitent des autorisations. Vérifie avant de commander."
                  },
                  {
                    error: "Se lancer sans formation ni accompagnement",
                    solution: "Investir dans une formation et des outils te fera gagner du temps et éviter des erreurs coûteuses."
                  }
                ].map((item, index) => (
                  <Card key={index} className="border-border/50">
                    <CardContent className="pt-6">
                      <div className="grid md:grid-cols-2 gap-4">
                        <div className="flex items-start gap-3">
                          <XCircle className="w-5 h-5 text-red-500 shrink-0 mt-0.5" />
                          <div>
                            <p className="font-medium text-red-600">Erreur</p>
                            <p className="text-muted-foreground">{item.error}</p>
                          </div>
                        </div>
                        <div className="flex items-start gap-3">
                          <CheckCircle2 className="w-5 h-5 text-green-500 shrink-0 mt-0.5" />
                          <div>
                            <p className="font-medium text-green-600">Solution</p>
                            <p className="text-muted-foreground">{item.solution}</p>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* Section 9: FAQ */}
        <section id="faq" className="py-16 scroll-mt-24">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto">
              <div className="flex items-center gap-3 mb-8">
                <div className="p-3 bg-primary/20 rounded-xl">
                  <BookOpen className="w-8 h-8 text-primary" />
                </div>
                <h2 className="text-3xl md:text-4xl font-bold">FAQ Amazon FBA</h2>
              </div>

              <div className="space-y-4 mb-10">
                {faqItems.map((item, index) => (
                  <Card key={index} className="border-border/50">
                    <CardHeader className="pb-2">
                      <CardTitle className="text-lg font-semibold">{item.question}</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-muted-foreground">{item.answer}</p>
                    </CardContent>
                  </Card>
                ))}
              </div>

              {/* Pour aller plus loin */}
              <Card className="border-primary/30 bg-primary/5">
                <CardHeader className="pb-3">
                  <CardTitle className="text-lg flex items-center gap-2">
                    <BookOpen className="w-5 h-5 text-primary" />
                    Pour aller plus loin
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground mb-4">
                    Tu veux approfondir et passer à l'action ? Voici des ressources complémentaires :
                  </p>
                  <ul className="space-y-3">
                    <li>
                      <Link 
                        to="/" 
                        className="text-primary hover:underline font-medium inline-flex items-center gap-2"
                      >
                        <ArrowRight className="w-4 h-4" />
                        Découvrir la plateforme AMZing FBA
                      </Link>
                      <p className="text-sm text-muted-foreground ml-6">Outils, moniteurs de produits rentables et communauté</p>
                    </li>
                    <li>
                      <Link 
                        to="/formation" 
                        className="text-primary hover:underline font-medium inline-flex items-center gap-2"
                      >
                        <ArrowRight className="w-4 h-4" />
                        Accéder à la formation Amazon FBA
                      </Link>
                      <p className="text-sm text-muted-foreground ml-6">Méthode complète étape par étape</p>
                    </li>
                    <li>
                      <Link 
                        to="/tarifs" 
                        className="text-primary hover:underline font-medium inline-flex items-center gap-2"
                      >
                        <ArrowRight className="w-4 h-4" />
                        Découvrir les offres AMZing FBA
                      </Link>
                      <p className="text-sm text-muted-foreground ml-6">Abonnements et tarifs</p>
                    </li>
                  </ul>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>

        {/* About Section (E-E-A-T) */}
        <section className="py-16 bg-accent/30">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto">
              <Card className="border-border/50">
                <CardHeader>
                  <CardTitle className="text-lg flex items-center gap-2">
                    <Users className="w-5 h-5 text-primary" />
                    À propos de AMZing FBA
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <p className="text-muted-foreground">
                    <strong>AMZing FBA</strong> est une plateforme française dédiée aux vendeurs Amazon. Nous accompagnons les débutants comme les vendeurs expérimentés avec des outils de recherche de produits rentables, une formation complète et une communauté active de +500 membres.
                  </p>
                  <p className="text-muted-foreground">
                    Notre équipe est basée à Paris et accompagne les e-commerçants depuis 2023.
                  </p>
                  
                  {/* Legal disclaimer */}
                  <div className="bg-muted/50 p-4 rounded-lg mt-4">
                    <p className="text-sm text-muted-foreground italic">
                      <strong>Avertissement :</strong> Les résultats sur Amazon FBA varient selon l'investissement, le temps consacré et la stratégie adoptée. Les informations de ce guide sont fournies à titre informatif. Le succès n'est pas garanti et dépend de nombreux facteurs. Faites toujours vos propres recherches avant d'investir.
                    </p>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>

        {/* Final CTA - En bas de page */}
        <section className="py-16">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto">
              <Card className="bg-gradient-to-r from-primary to-secondary text-white border-none">
                <CardContent className="py-10 text-center">
                  <h3 className="text-2xl font-bold mb-4">Prêt à te lancer sur Amazon FBA ?</h3>
                  <p className="text-white/90 mb-6 max-w-2xl mx-auto">
                    Rejoins AMZing FBA et accède à la méthode complète : formation, outils de recherche de produits rentables et communauté de vendeurs.
                  </p>
                  <div className="flex flex-col sm:flex-row gap-4 justify-center">
                    <Button size="lg" variant="secondary" asChild className="text-lg px-8">
                      <Link to="/formation">
                        Voir la méthode complète
                        <ArrowRight className="w-5 h-5 ml-2" />
                      </Link>
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
};

export default AmazonFbaDebutant;