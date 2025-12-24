import { ArrowRight, ArrowLeft, Package, Warehouse, Truck, DollarSign, CheckCircle2, XCircle, Scale, Target, Users, BookOpen, HelpCircle, Clock, Shield, Zap } from "lucide-react";
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

const AmazonFbaVsFbm = () => {
  const navigate = useNavigate();

  const tableOfContents = [
    { id: "definitions", label: "Définition FBA et FBM" },
    { id: "comparatif", label: "Comparatif détaillé (tableau)" },
    { id: "avantages", label: "Avantages / inconvénients" },
    { id: "choisir", label: "Quel modèle selon ton profil" },
    { id: "hybride", label: "Stratégies hybrides" },
    { id: "erreurs", label: "Erreurs fréquentes" },
    { id: "cta", label: "Se former" },
    { id: "faq", label: "FAQ" },
  ];

  const faqItems = [
    {
      question: "FBA ou FBM : lequel est le plus rentable ?",
      answer: "Cela dépend de ta situation. FBA offre généralement un meilleur taux de conversion grâce au badge Prime, mais a des frais plus élevés. FBM peut être plus rentable si tu as déjà une logistique optimisée ou si tu vends des produits volumineux où les frais FBA seraient prohibitifs. Calcule tes marges dans les deux cas avant de décider."
    },
    {
      question: "Est-ce que FBM peut gagner la Buy Box ?",
      answer: "Oui, FBM peut gagner la Buy Box, mais c'est plus difficile. Amazon privilégie les offres Prime (donc FBA). En FBM, tu dois avoir d'excellentes métriques vendeur (taux de défaut faible, livraison rapide, bon service client) et souvent un prix plus bas pour compenser l'absence du badge Prime."
    },
    {
      question: "Quels frais sont les plus élevés ?",
      answer: "FBA a des frais plus élevés au global (stockage + expédition + préparation). Cependant, il faut aussi comptabiliser ton temps en FBM. Si tu passes 2h par jour à préparer des colis, c'est un coût caché important. Pour des produits à forte rotation et marge correcte, FBA est souvent plus intéressant malgré les frais."
    },
    {
      question: "Peut-on passer de FBM à FBA facilement ?",
      answer: "Oui, tu peux passer de FBM à FBA à tout moment. Il suffit de créer un envoi FBA dans Seller Central et d'expédier tes produits vers un entrepôt Amazon. L'inverse est aussi possible : tu peux repasser en FBM si tu décides de gérer ta propre logistique."
    },
    {
      question: "Quelle option pour un petit budget ?",
      answer: "Avec un petit budget, FBM peut sembler plus économique au départ (pas de frais de stockage Amazon). Mais attention : le temps passé sur la logistique est un coût. Si tu débutes avec peu de produits, FBA reste souvent préférable pour te concentrer sur l'essentiel : trouver des produits rentables."
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
      { "@type": "ListItem", "position": 2, "name": "Amazon FBA vs FBM", "item": "https://amzingfba.com/guide/amazon-fba-vs-fbm" }
    ]
  };

  const articleSchema = {
    "@context": "https://schema.org",
    "@type": "Article",
    "headline": "Amazon FBA vs FBM : différences, coûts, lequel choisir ?",
    "description": "Comparatif complet FBA vs FBM : logistique, coûts, avantages, inconvénients. Découvre quel modèle choisir selon ton profil de vendeur Amazon.",
    "author": { "@type": "Organization", "name": "AMZing FBA" },
    "publisher": { "@type": "Organization", "name": "AMZing FBA", "logo": { "@type": "ImageObject", "url": "https://amzingfba.com/logo-amzing.png" } },
    "datePublished": "2025-01-01",
    "dateModified": "2025-01-01"
  };

  return (
    <div className="min-h-screen bg-background">
      <SEO
        title="Amazon FBA vs FBM : différences, coûts, lequel choisir ?"
        description="Comparatif complet FBA vs FBM : logistique, coûts, avantages et inconvénients. Découvre quel modèle choisir selon ton profil de vendeur Amazon."
        keywords="amazon fba vs fbm, fba ou fbm, différence fba fbm, comparatif fba fbm, fulfillment by amazon vs merchant"
        schema={[faqSchema, breadcrumbSchema, articleSchema]}
        robots="index,follow"
      />
      <Navbar />

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
          <Badge className="mb-4 bg-secondary/10 text-secondary border-secondary/20">Comparatif</Badge>
          <h1 className="text-4xl md:text-5xl font-bold mb-6">Amazon FBA vs FBM : quelles différences ?</h1>
          <p className="text-xl text-muted-foreground mb-8">
            FBA ou FBM ? Deux façons de vendre sur Amazon, deux approches de la logistique. 
            Découvre les différences, les coûts, et choisis le modèle adapté à ta situation.
          </p>
          
          <Card className="bg-muted/50">
            <CardContent className="pt-6">
              <h2 className="font-semibold mb-4 flex items-center gap-2">
                <BookOpen className="w-5 h-5" /> Sommaire
              </h2>
              <nav className="grid grid-cols-1 md:grid-cols-2 gap-2">
                {tableOfContents.map((item) => (
                  <a key={item.id} href={`#${item.id}`} className="text-muted-foreground hover:text-primary transition-colors text-sm py-1">
                    → {item.label}
                  </a>
                ))}
              </nav>
            </CardContent>
          </Card>
        </div>
      </section>

      <article className="py-12">
        <div className="container mx-auto px-4 max-w-4xl prose prose-lg dark:prose-invert">
          
          {/* Définitions */}
          <section id="definitions" className="mb-12 scroll-mt-24">
            <h2 className="text-3xl font-bold mb-6">Définition FBA et définition FBM</h2>
            
            <div className="not-prose grid md:grid-cols-2 gap-6 mb-6">
              <Card className="border-primary/30 border-2">
                <CardContent className="pt-6">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center">
                      <Warehouse className="w-6 h-6 text-primary" />
                    </div>
                    <h3 className="text-xl font-bold">FBA</h3>
                  </div>
                  <p className="text-sm font-medium text-primary mb-2">Fulfillment by Amazon</p>
                  <p className="text-muted-foreground">
                    Tu envoies tes produits à Amazon. Ils gèrent le stockage, l'emballage, l'expédition et le SAV. 
                    Tes produits sont éligibles Prime.
                  </p>
                </CardContent>
              </Card>
              
              <Card className="border-secondary/30 border-2">
                <CardContent className="pt-6">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-12 h-12 rounded-xl bg-secondary/10 flex items-center justify-center">
                      <Package className="w-6 h-6 text-secondary" />
                    </div>
                    <h3 className="text-xl font-bold">FBM</h3>
                  </div>
                  <p className="text-sm font-medium text-secondary mb-2">Fulfillment by Merchant</p>
                  <p className="text-muted-foreground">
                    Tu gères tout toi-même : stockage chez toi, préparation des colis, expédition, SAV. 
                    Plus de contrôle, mais plus de travail.
                  </p>
                </CardContent>
              </Card>
            </div>
          </section>

          {/* Comparatif tableau */}
          <section id="comparatif" className="mb-12 scroll-mt-24">
            <h2 className="text-3xl font-bold mb-6 flex items-center gap-3">
              <Scale className="w-8 h-8 text-primary" />
              Comparatif FBA vs FBM
            </h2>
            
            <div className="overflow-x-auto not-prose">
              <table className="w-full border-collapse text-sm">
                <thead>
                  <tr className="border-b bg-muted/50">
                    <th className="text-left py-4 px-4 font-semibold">Critère</th>
                    <th className="text-center py-4 px-4 font-semibold text-primary">FBA</th>
                    <th className="text-center py-4 px-4 font-semibold text-secondary">FBM</th>
                  </tr>
                </thead>
                <tbody>
                  <tr className="border-b">
                    <td className="py-4 px-4 font-medium">Logistique</td>
                    <td className="py-4 px-4 text-center">Amazon gère tout</td>
                    <td className="py-4 px-4 text-center">Tu gères tout</td>
                  </tr>
                  <tr className="border-b bg-muted/30">
                    <td className="py-4 px-4 font-medium">Badge Prime</td>
                    <td className="py-4 px-4 text-center"><CheckCircle2 className="w-5 h-5 text-green-500 mx-auto" /></td>
                    <td className="py-4 px-4 text-center"><XCircle className="w-5 h-5 text-red-500 mx-auto" /></td>
                  </tr>
                  <tr className="border-b">
                    <td className="py-4 px-4 font-medium">Coûts logistiques</td>
                    <td className="py-4 px-4 text-center">~3-5€/unité</td>
                    <td className="py-4 px-4 text-center">Ton temps + transporteur</td>
                  </tr>
                  <tr className="border-b bg-muted/30">
                    <td className="py-4 px-4 font-medium">Stockage</td>
                    <td className="py-4 px-4 text-center">~26€/m³/mois</td>
                    <td className="py-4 px-4 text-center">Chez toi (gratuit)</td>
                  </tr>
                  <tr className="border-b">
                    <td className="py-4 px-4 font-medium">Délai de livraison</td>
                    <td className="py-4 px-4 text-center">1-2 jours (Prime)</td>
                    <td className="py-4 px-4 text-center">3-5 jours (variable)</td>
                  </tr>
                  <tr className="border-b bg-muted/30">
                    <td className="py-4 px-4 font-medium">SAV / Retours</td>
                    <td className="py-4 px-4 text-center">Amazon gère</td>
                    <td className="py-4 px-4 text-center">Tu gères</td>
                  </tr>
                  <tr className="border-b">
                    <td className="py-4 px-4 font-medium">Taux de conversion</td>
                    <td className="py-4 px-4 text-center">Plus élevé</td>
                    <td className="py-4 px-4 text-center">Plus faible</td>
                  </tr>
                  <tr className="border-b bg-muted/30">
                    <td className="py-4 px-4 font-medium">Contrôle</td>
                    <td className="py-4 px-4 text-center">Limité</td>
                    <td className="py-4 px-4 text-center">Total</td>
                  </tr>
                  <tr className="border-b">
                    <td className="py-4 px-4 font-medium">Scalabilité</td>
                    <td className="py-4 px-4 text-center">Excellente</td>
                    <td className="py-4 px-4 text-center">Limitée (ton temps)</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </section>

          {/* Avantages / Inconvénients */}
          <section id="avantages" className="mb-12 scroll-mt-24">
            <h2 className="text-3xl font-bold mb-6">Avantages / inconvénients de chaque modèle</h2>
            
            <h3 className="text-xl font-semibold mb-4 text-primary">FBA - Avantages & Inconvénients</h3>
            <div className="not-prose grid md:grid-cols-2 gap-4 mb-8">
              <Card className="border-green-500/30">
                <CardContent className="pt-6">
                  <h4 className="font-semibold text-green-600 mb-3 flex items-center gap-2">
                    <CheckCircle2 className="w-5 h-5" /> Avantages FBA
                  </h4>
                  <ul className="space-y-2 text-sm">
                    <li>✓ Badge Prime = confiance + conversion</li>
                    <li>✓ Logistique 100% déléguée</li>
                    <li>✓ SAV géré par Amazon</li>
                    <li>✓ Scalabilité sans limite</li>
                    <li>✓ Meilleur ranking Buy Box</li>
                  </ul>
                </CardContent>
              </Card>
              <Card className="border-red-500/30">
                <CardContent className="pt-6">
                  <h4 className="font-semibold text-red-600 mb-3 flex items-center gap-2">
                    <XCircle className="w-5 h-5" /> Inconvénients FBA
                  </h4>
                  <ul className="space-y-2 text-sm">
                    <li>✗ Frais plus élevés</li>
                    <li>✗ Frais stockage longue durée</li>
                    <li>✗ Moins de contrôle</li>
                    <li>✗ Dépendance à Amazon</li>
                    <li>✗ Produits endommagés parfois</li>
                  </ul>
                </CardContent>
              </Card>
            </div>

            <h3 className="text-xl font-semibold mb-4 text-secondary">FBM - Avantages & Inconvénients</h3>
            <div className="not-prose grid md:grid-cols-2 gap-4">
              <Card className="border-green-500/30">
                <CardContent className="pt-6">
                  <h4 className="font-semibold text-green-600 mb-3 flex items-center gap-2">
                    <CheckCircle2 className="w-5 h-5" /> Avantages FBM
                  </h4>
                  <ul className="space-y-2 text-sm">
                    <li>✓ Contrôle total</li>
                    <li>✓ Pas de frais de stockage Amazon</li>
                    <li>✓ Relation client directe</li>
                    <li>✓ Flexibilité produits (fragiles, volumineux)</li>
                    <li>✓ Meilleure marge brute possible</li>
                  </ul>
                </CardContent>
              </Card>
              <Card className="border-red-500/30">
                <CardContent className="pt-6">
                  <h4 className="font-semibold text-red-600 mb-3 flex items-center gap-2">
                    <XCircle className="w-5 h-5" /> Inconvénients FBM
                  </h4>
                  <ul className="space-y-2 text-sm">
                    <li>✗ Pas de badge Prime</li>
                    <li>✗ Temps passé sur la logistique</li>
                    <li>✗ Taux de conversion plus faible</li>
                    <li>✗ Gestion SAV chronophage</li>
                    <li>✗ Difficile à scaler</li>
                  </ul>
                </CardContent>
              </Card>
            </div>
          </section>

          {/* Quel modèle choisir */}
          <section id="choisir" className="mb-12 scroll-mt-24">
            <h2 className="text-3xl font-bold mb-6 flex items-center gap-3">
              <Target className="w-8 h-8 text-primary" />
              Quel modèle choisir selon ton profil
            </h2>
            
            <div className="not-prose space-y-4">
              <Card className="border-l-4 border-l-primary">
                <CardContent className="pt-6">
                  <h3 className="font-semibold mb-2">👤 Tu débutes sur Amazon</h3>
                  <p className="text-muted-foreground mb-2">
                    <strong>Recommandation : FBA</strong>
                  </p>
                  <p className="text-sm text-muted-foreground">
                    Tu n'as pas encore d'infrastructure logistique. FBA te permet de te concentrer sur l'essentiel : 
                    apprendre à sourcer des produits rentables. La logistique peut attendre.
                  </p>
                </CardContent>
              </Card>
              
              <Card className="border-l-4 border-l-secondary">
                <CardContent className="pt-6">
                  <h3 className="font-semibold mb-2">📦 Tu fais de l'arbitrage (retail/online)</h3>
                  <p className="text-muted-foreground mb-2">
                    <strong>Recommandation : FBA majoritairement</strong>
                  </p>
                  <p className="text-sm text-muted-foreground">
                    Le volume est clé en arbitrage. FBA te permet de traiter beaucoup de références sans y passer tes journées. 
                    FBM peut compléter pour les produits volumineux ou à rotation lente.
                  </p>
                </CardContent>
              </Card>
              
              <Card className="border-l-4 border-l-green-500">
                <CardContent className="pt-6">
                  <h3 className="font-semibold mb-2">🏷️ Tu développes ta propre marque (Private Label)</h3>
                  <p className="text-muted-foreground mb-2">
                    <strong>Recommandation : FBA</strong>
                  </p>
                  <p className="text-sm text-muted-foreground">
                    Le badge Prime est crucial pour la crédibilité d'une nouvelle marque. 
                    Les clients font plus confiance à "Expédié par Amazon". Concentre-toi sur le produit et le marketing.
                  </p>
                </CardContent>
              </Card>
              
              <Card className="border-l-4 border-l-purple-500">
                <CardContent className="pt-6">
                  <h3 className="font-semibold mb-2">🏭 Tu as déjà une logistique en place</h3>
                  <p className="text-muted-foreground mb-2">
                    <strong>Recommandation : FBM ou hybride</strong>
                  </p>
                  <p className="text-sm text-muted-foreground">
                    Si tu as un entrepôt et une équipe, FBM peut être plus rentable. 
                    Tu gardes le contrôle et optimises tes marges. Teste les deux et compare.
                  </p>
                </CardContent>
              </Card>
            </div>
          </section>

          {/* Stratégies hybrides */}
          <section id="hybride" className="mb-12 scroll-mt-24">
            <h2 className="text-3xl font-bold mb-6 flex items-center gap-3">
              <Zap className="w-8 h-8 text-primary" />
              Stratégies hybrides (FBA + FBM)
            </h2>
            <p>
              Tu n'es pas obligé de choisir 100% FBA ou 100% FBM. Beaucoup de vendeurs utilisent les deux :
            </p>
            <ul className="not-prose mt-4 space-y-3">
              <li className="flex items-start gap-3">
                <CheckCircle2 className="w-5 h-5 text-green-500 shrink-0 mt-0.5" />
                <span><strong>FBA pour les best-sellers</strong> : produits à forte rotation, le badge Prime maximise les ventes</span>
              </li>
              <li className="flex items-start gap-3">
                <CheckCircle2 className="w-5 h-5 text-green-500 shrink-0 mt-0.5" />
                <span><strong>FBM pour les produits volumineux</strong> : évite les frais de stockage prohibitifs</span>
              </li>
              <li className="flex items-start gap-3">
                <CheckCircle2 className="w-5 h-5 text-green-500 shrink-0 mt-0.5" />
                <span><strong>FBM en backup</strong> : si ton stock FBA est vide, FBM prend le relais</span>
              </li>
              <li className="flex items-start gap-3">
                <CheckCircle2 className="w-5 h-5 text-green-500 shrink-0 mt-0.5" />
                <span><strong>FBM pour tester</strong> : avant d'envoyer du stock FBA, teste la demande en FBM</span>
              </li>
            </ul>
          </section>

          {/* Erreurs fréquentes */}
          <section id="erreurs" className="mb-12 scroll-mt-24">
            <h2 className="text-3xl font-bold mb-6">Erreurs fréquentes à éviter</h2>
            <div className="not-prose bg-red-50 dark:bg-red-950/20 border border-red-200 dark:border-red-800 rounded-xl p-6">
              <ul className="space-y-3">
                <li className="flex items-start gap-3">
                  <XCircle className="w-5 h-5 text-red-500 shrink-0 mt-0.5" />
                  <span><strong>Choisir FBM uniquement pour "économiser"</strong> : ton temps a une valeur. Calcule le coût réel.</span>
                </li>
                <li className="flex items-start gap-3">
                  <XCircle className="w-5 h-5 text-red-500 shrink-0 mt-0.5" />
                  <span><strong>Ignorer les frais de stockage longue durée FBA</strong> : ils peuvent tuer ta marge si le produit ne tourne pas.</span>
                </li>
                <li className="flex items-start gap-3">
                  <XCircle className="w-5 h-5 text-red-500 shrink-0 mt-0.5" />
                  <span><strong>Négliger les métriques vendeur en FBM</strong> : un mauvais taux de défaut = suspension possible.</span>
                </li>
                <li className="flex items-start gap-3">
                  <XCircle className="w-5 h-5 text-red-500 shrink-0 mt-0.5" />
                  <span><strong>Ne pas comparer les marges réelles</strong> : fais le calcul FBA ET FBM avant de décider.</span>
                </li>
              </ul>
            </div>
          </section>

          {/* CTA */}
          <section id="cta" className="mb-12 scroll-mt-24">
            <h2 className="text-3xl font-bold mb-4">Passe à l'action</h2>
            <div className="not-prose">
              <Card className="bg-gradient-to-br from-primary/10 to-secondary/10 border-primary/30">
                <CardContent className="pt-6 text-center">
                  <h3 className="text-xl font-bold mb-3">Maîtrise FBA et FBM avec une formation structurée</h3>
                  <p className="text-muted-foreground mb-6">
                    AMZing FBA t'accompagne sur les deux modèles : méthode, outils d'analyse, 
                    calculateurs de rentabilité et communauté pour t'aider à faire les bons choix.
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

            <div className="mt-8">
              <h3 className="font-semibold mb-4 flex items-center gap-2">
                <BookOpen className="w-5 h-5" /> Guides connexes
              </h3>
              <div className="not-prose grid md:grid-cols-2 gap-4">
                <Link to="/guide/amazon-fba-cest-quoi" className="block p-4 border rounded-lg hover:border-primary transition-colors">
                  <span className="font-medium">Amazon FBA c'est quoi ?</span>
                  <p className="text-sm text-muted-foreground mt-1">Définition et fonctionnement</p>
                </Link>
                <Link to="/guide/comment-debuter-amazon-fba" className="block p-4 border rounded-lg hover:border-primary transition-colors">
                  <span className="font-medium">Comment débuter sur Amazon FBA</span>
                  <p className="text-sm text-muted-foreground mt-1">Guide étape par étape</p>
                </Link>
                <Link to="/guide/combien-coute-amazon-fba" className="block p-4 border rounded-lg hover:border-primary transition-colors">
                  <span className="font-medium">Combien coûte Amazon FBA ?</span>
                  <p className="text-sm text-muted-foreground mt-1">Tous les frais détaillés</p>
                </Link>
                <Link to="/guide/formation-amazon-fba-debutant" className="block p-4 border rounded-lg hover:border-primary transition-colors">
                  <span className="font-medium">Formation Amazon FBA débutant</span>
                  <p className="text-sm text-muted-foreground mt-1">Bien choisir sa formation</p>
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

export default AmazonFbaVsFbm;
