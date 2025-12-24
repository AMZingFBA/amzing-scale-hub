import { ArrowRight, ArrowLeft, DollarSign, Calculator, Package, Warehouse, Truck, AlertTriangle, CheckCircle2, BookOpen, HelpCircle, TrendingDown, Percent } from "lucide-react";
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

const CombienCouteAmazonFba = () => {
  const navigate = useNavigate();

  const tableOfContents = [
    { id: "liste-couts", label: "Liste des coûts" },
    { id: "frais-fba", label: "Détail des frais FBA" },
    { id: "couts-caches", label: "Coûts \"cachés\"" },
    { id: "exemples", label: "Exemples chiffrés" },
    { id: "reduire", label: "Comment réduire les coûts" },
    { id: "budget", label: "Quel budget minimum" },
    { id: "cta", label: "Se former" },
    { id: "faq", label: "FAQ" },
  ];

  const faqItems = [
    {
      question: "Quel est le coût mensuel minimum ?",
      answer: "Le minimum incompressible est l'abonnement vendeur Pro à 39€/mois (gratuit si plan Individuel mais 0,99€/vente). Ensuite, tout dépend de ton volume : stock, frais FBA, outils. Pour un démarrage sérieux, prévois 100-200€/mois hors stock."
    },
    {
      question: "Quels frais Amazon prennent le plus ?",
      answer: "La commission de référencement (8-15% selon la catégorie) est généralement le plus gros poste, suivie des frais d'expédition FBA. Le stockage peut devenir important si tes produits ne tournent pas vite ou en Q4 (oct-déc) où les tarifs augmentent."
    },
    {
      question: "Est-ce qu'on peut commencer avec 100€ / 500€ / 1000€ ?",
      answer: "100€ : très difficile, marge de manœuvre quasi nulle. 500€ : possible mais limité (2-3 produits test). 1000€ : confortable pour débuter, tu peux tester plusieurs produits et avoir une réserve. Plus tu as de capital, plus tu peux diversifier et absorber les erreurs."
    },
    {
      question: "Comment calculer la marge réelle ?",
      answer: "Marge nette = Prix de vente - Prix d'achat - Commission Amazon - Frais FBA - Frais d'envoi Amazon - TVA (si applicable). Utilise le calculateur Amazon ou des outils comme SellerAmp pour avoir une estimation précise avant d'acheter."
    },
    {
      question: "Les retours coûtent combien ?",
      answer: "Amazon ne facture généralement pas le retour au vendeur FBA (c'est inclus dans le service). Par contre, tu perds la vente et parfois le produit est endommagé et invendable. Certaines catégories ont des taux de retour élevés (vêtements, électronique) : à prendre en compte dans ta marge."
    },
    {
      question: "Faut-il payer la TVA en micro-entreprise ?",
      answer: "En franchise de base (micro-entreprise), tu ne factures pas la TVA jusqu'à 91 900€ de CA annuel (vente de biens). Mais si tu achètes à des fournisseurs assujettis, tu paies la TVA sur tes achats sans pouvoir la récupérer. À calculer dans ta marge."
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
      { "@type": "ListItem", "position": 2, "name": "Combien coûte Amazon FBA", "item": "https://amzingfba.com/guide/combien-coute-amazon-fba" }
    ]
  };

  return (
    <div className="min-h-screen bg-background">
      <SEO
        title="Combien coûte Amazon FBA ? Tous les frais expliqués + exemples"
        description="Découvre tous les coûts Amazon FBA : abonnement, commissions, frais de stockage et expédition, coûts cachés. Exemples chiffrés et conseils pour optimiser."
        keywords="combien coute amazon fba, frais amazon fba, cout amazon fba, prix amazon fba, tarif amazon fba, budget amazon fba"
        schema={[faqSchema, breadcrumbSchema]}
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
      <section className="pt-32 pb-16 bg-gradient-to-br from-yellow-500/10 via-background to-primary/10">
        <div className="container mx-auto px-4 max-w-4xl">
          <Badge className="mb-4 bg-yellow-500/10 text-yellow-600 border-yellow-500/20">Transparence totale</Badge>
          <h1 className="text-4xl md:text-5xl font-bold mb-6">Combien coûte Amazon FBA ?</h1>
          <p className="text-xl text-muted-foreground mb-8">
            Avant de te lancer, tu dois comprendre tous les coûts. Commission Amazon, frais FBA, 
            stockage, outils... Voici le détail complet pour éviter les mauvaises surprises.
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
          
          {/* Liste des coûts */}
          <section id="liste-couts" className="mb-12 scroll-mt-24">
            <h2 className="text-3xl font-bold mb-6 flex items-center gap-3">
              <DollarSign className="w-8 h-8 text-primary" />
              Liste des coûts (abonnement, frais Amazon, logistique)
            </h2>
            
            <div className="not-prose grid gap-4">
              <Card className="border-l-4 border-l-primary">
                <CardContent className="pt-6">
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="font-semibold mb-1">Abonnement vendeur Pro</h3>
                      <p className="text-sm text-muted-foreground">Obligatoire pour vendre en volume. Donne accès aux rapports, pub, etc.</p>
                    </div>
                    <div className="text-right">
                      <span className="text-2xl font-bold text-primary">39€</span>
                      <span className="text-muted-foreground">/mois</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
              
              <Card className="border-l-4 border-l-secondary">
                <CardContent className="pt-6">
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="font-semibold mb-1">Commission de référencement</h3>
                      <p className="text-sm text-muted-foreground">Pourcentage du prix de vente, variable selon la catégorie</p>
                    </div>
                    <div className="text-right">
                      <span className="text-2xl font-bold text-secondary">8-15%</span>
                      <span className="text-muted-foreground">/vente</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
              
              <Card className="border-l-4 border-l-green-500">
                <CardContent className="pt-6">
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="font-semibold mb-1">Frais d'expédition FBA</h3>
                      <p className="text-sm text-muted-foreground">Amazon emballe et expédie ton produit. Dépend de la taille/poids.</p>
                    </div>
                    <div className="text-right">
                      <span className="text-2xl font-bold text-green-500">2-7€</span>
                      <span className="text-muted-foreground">/unité</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
              
              <Card className="border-l-4 border-l-purple-500">
                <CardContent className="pt-6">
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="font-semibold mb-1">Frais de stockage mensuel</h3>
                      <p className="text-sm text-muted-foreground">Facturation au m³ par mois. Plus cher en Q4 (oct-déc).</p>
                    </div>
                    <div className="text-right">
                      <span className="text-2xl font-bold text-purple-500">~26€</span>
                      <span className="text-muted-foreground">/m³/mois</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </section>

          {/* Détail frais FBA */}
          <section id="frais-fba" className="mb-12 scroll-mt-24">
            <h2 className="text-3xl font-bold mb-6 flex items-center gap-3">
              <Package className="w-8 h-8 text-primary" />
              Détail des frais FBA (stockage, expédition, retours)
            </h2>
            
            <h3 className="text-xl font-semibold mt-6 mb-4">Frais d'expédition FBA (par unité)</h3>
            <p>Ces frais dépendent de la taille et du poids de ton produit :</p>
            
            <div className="overflow-x-auto not-prose my-4">
              <table className="w-full border-collapse text-sm">
                <thead>
                  <tr className="border-b bg-muted/50">
                    <th className="text-left py-3 px-4">Catégorie de taille</th>
                    <th className="text-left py-3 px-4">Dimensions max</th>
                    <th className="text-left py-3 px-4">Frais approx.</th>
                  </tr>
                </thead>
                <tbody>
                  <tr className="border-b">
                    <td className="py-3 px-4">Enveloppe</td>
                    <td className="py-3 px-4">33×23×2,5 cm, ≤460g</td>
                    <td className="py-3 px-4 font-semibold">2,00-2,50€</td>
                  </tr>
                  <tr className="border-b bg-muted/30">
                    <td className="py-3 px-4">Petit colis standard</td>
                    <td className="py-3 px-4">35×25×12 cm, ≤1kg</td>
                    <td className="py-3 px-4 font-semibold">3,00-4,00€</td>
                  </tr>
                  <tr className="border-b">
                    <td className="py-3 px-4">Colis standard</td>
                    <td className="py-3 px-4">45×34×26 cm, ≤12kg</td>
                    <td className="py-3 px-4 font-semibold">4,00-6,00€</td>
                  </tr>
                  <tr className="border-b bg-muted/30">
                    <td className="py-3 px-4">Hors gabarit (petit)</td>
                    <td className="py-3 px-4">&gt;45cm, ≤25kg</td>
                    <td className="py-3 px-4 font-semibold">7,00-15,00€</td>
                  </tr>
                </tbody>
              </table>
            </div>
            
            <h3 className="text-xl font-semibold mt-8 mb-4">Frais de stockage mensuel</h3>
            <div className="not-prose grid md:grid-cols-2 gap-4">
              <Card>
                <CardContent className="pt-6">
                  <h4 className="font-semibold mb-2">Janvier - Septembre</h4>
                  <p className="text-3xl font-bold text-primary">~26€/m³</p>
                  <p className="text-sm text-muted-foreground">Tarif standard</p>
                </CardContent>
              </Card>
              <Card className="border-yellow-500/30">
                <CardContent className="pt-6">
                  <h4 className="font-semibold mb-2">Octobre - Décembre (Q4)</h4>
                  <p className="text-3xl font-bold text-yellow-600">~42€/m³</p>
                  <p className="text-sm text-muted-foreground">Tarif majoré (+60%)</p>
                </CardContent>
              </Card>
            </div>
            
            <div className="not-prose bg-yellow-50 dark:bg-yellow-950/20 border border-yellow-200 dark:border-yellow-800 rounded-xl p-4 mt-6">
              <p className="flex items-start gap-2 text-sm">
                <AlertTriangle className="w-5 h-5 text-yellow-600 shrink-0 mt-0.5" />
                <span><strong>Attention aux frais de stockage longue durée :</strong> si ton stock reste plus de 365 jours, Amazon facture des frais supplémentaires importants. Évite d'envoyer trop de stock d'un coup.</span>
              </p>
            </div>

            <h3 className="text-xl font-semibold mt-8 mb-4">Retours clients</h3>
            <p>
              Les retours sont gérés par Amazon (inclus dans le service FBA). 
              Cependant, pour certaines catégories comme les vêtements, Amazon peut facturer 
              des frais de traitement des retours. Le produit retourné peut aussi être invendable.
            </p>
          </section>

          {/* Coûts cachés */}
          <section id="couts-caches" className="mb-12 scroll-mt-24">
            <h2 className="text-3xl font-bold mb-6 flex items-center gap-3">
              <AlertTriangle className="w-8 h-8 text-yellow-500" />
              Coûts "cachés" (prep, TVA, conformité, outils)
            </h2>
            <p>
              Au-delà des frais Amazon, n'oublie pas ces coûts souvent sous-estimés :
            </p>
            
            <div className="not-prose space-y-4 mt-6">
              <Card>
                <CardContent className="pt-6">
                  <h3 className="font-semibold mb-2 flex items-center gap-2">
                    <Package className="w-5 h-5" /> Préparation des produits
                  </h3>
                  <p className="text-sm text-muted-foreground">
                    Étiquetage, emballage, mise en sachet... Si tu le fais toi-même, c'est du temps. 
                    Si tu délègues : 0,30€ à 1€/unité selon le service.
                  </p>
                </CardContent>
              </Card>
              
              <Card>
                <CardContent className="pt-6">
                  <h3 className="font-semibold mb-2 flex items-center gap-2">
                    <Truck className="w-5 h-5" /> Expédition vers Amazon
                  </h3>
                  <p className="text-sm text-muted-foreground">
                    Le transport de tes produits vers l'entrepôt Amazon. 
                    Compter 5-15€ par carton selon le poids et le transporteur.
                  </p>
                </CardContent>
              </Card>
              
              <Card>
                <CardContent className="pt-6">
                  <h3 className="font-semibold mb-2 flex items-center gap-2">
                    <Percent className="w-5 h-5" /> TVA sur les achats
                  </h3>
                  <p className="text-sm text-muted-foreground">
                    En micro-entreprise, tu paies la TVA sur tes achats sans pouvoir la récupérer. 
                    C'est 20% de plus sur ton coût d'achat si le fournisseur est assujetti.
                  </p>
                </CardContent>
              </Card>
              
              <Card>
                <CardContent className="pt-6">
                  <h3 className="font-semibold mb-2 flex items-center gap-2">
                    <Calculator className="w-5 h-5" /> Outils et logiciels
                  </h3>
                  <p className="text-sm text-muted-foreground">
                    Outils d'analyse produit, gestion de stock, repricing... 
                    Budget de 30-100€/mois selon tes besoins.
                  </p>
                </CardContent>
              </Card>
            </div>
          </section>

          {/* Exemples chiffrés */}
          <section id="exemples" className="mb-12 scroll-mt-24">
            <h2 className="text-3xl font-bold mb-6 flex items-center gap-3">
              <Calculator className="w-8 h-8 text-primary" />
              Exemples chiffrés (scénarios types)
            </h2>
            <p>
              Voici deux exemples concrets pour comprendre la structure de coûts :
            </p>
            
            <div className="not-prose space-y-6 mt-6">
              <Card className="border-green-500/30">
                <CardContent className="pt-6">
                  <h3 className="font-semibold mb-4 text-green-600">Exemple 1 : Produit rentable ✓</h3>
                  <div className="grid md:grid-cols-2 gap-4 text-sm">
                    <div>
                      <p className="font-medium mb-2">Données produit :</p>
                      <ul className="space-y-1 text-muted-foreground">
                        <li>Prix de vente : 29,99€</li>
                        <li>Prix d'achat HT : 10€</li>
                        <li>Catégorie : Maison (15%)</li>
                        <li>Taille : Petit colis standard</li>
                      </ul>
                    </div>
                    <div>
                      <p className="font-medium mb-2">Calcul des frais :</p>
                      <ul className="space-y-1 text-muted-foreground">
                        <li>Commission (15%) : -4,50€</li>
                        <li>Frais FBA : -3,50€</li>
                        <li>Envoi Amazon : -0,50€</li>
                        <li className="font-semibold text-foreground pt-2 border-t">Marge nette : 11,49€ (38%)</li>
                        <li className="font-semibold text-green-600">ROI : 115%</li>
                      </ul>
                    </div>
                  </div>
                </CardContent>
              </Card>
              
              <Card className="border-red-500/30">
                <CardContent className="pt-6">
                  <h3 className="font-semibold mb-4 text-red-600">Exemple 2 : Produit peu rentable ✗</h3>
                  <div className="grid md:grid-cols-2 gap-4 text-sm">
                    <div>
                      <p className="font-medium mb-2">Données produit :</p>
                      <ul className="space-y-1 text-muted-foreground">
                        <li>Prix de vente : 14,99€</li>
                        <li>Prix d'achat HT : 8€</li>
                        <li>Catégorie : Électronique (8%)</li>
                        <li>Taille : Enveloppe</li>
                      </ul>
                    </div>
                    <div>
                      <p className="font-medium mb-2">Calcul des frais :</p>
                      <ul className="space-y-1 text-muted-foreground">
                        <li>Commission (8%) : -1,20€</li>
                        <li>Frais FBA : -2,50€</li>
                        <li>Envoi Amazon : -0,30€</li>
                        <li className="font-semibold text-foreground pt-2 border-t">Marge nette : 2,99€ (20%)</li>
                        <li className="font-semibold text-red-600">ROI : 37%</li>
                      </ul>
                    </div>
                  </div>
                  <p className="text-sm text-muted-foreground mt-4">
                    ⚠️ Marge trop faible pour absorber les imprévus (retours, erreurs de stock, baisse de prix).
                  </p>
                </CardContent>
              </Card>
            </div>
          </section>

          {/* Comment réduire les coûts */}
          <section id="reduire" className="mb-12 scroll-mt-24">
            <h2 className="text-3xl font-bold mb-6 flex items-center gap-3">
              <TrendingDown className="w-8 h-8 text-green-500" />
              Comment réduire les coûts
            </h2>
            
            <div className="not-prose space-y-3">
              <div className="flex items-start gap-3">
                <CheckCircle2 className="w-5 h-5 text-green-500 shrink-0 mt-0.5" />
                <span><strong>Optimise la taille de tes produits :</strong> plus c'est petit et léger, moins chers sont les frais FBA</span>
              </div>
              <div className="flex items-start gap-3">
                <CheckCircle2 className="w-5 h-5 text-green-500 shrink-0 mt-0.5" />
                <span><strong>Gère ton stock intelligemment :</strong> évite le surstockage (frais mensuels) et les ruptures (perte de ranking)</span>
              </div>
              <div className="flex items-start gap-3">
                <CheckCircle2 className="w-5 h-5 text-green-500 shrink-0 mt-0.5" />
                <span><strong>Négocie avec tes fournisseurs :</strong> quelques % de moins sur le prix d'achat = gros impact sur ta marge</span>
              </div>
              <div className="flex items-start gap-3">
                <CheckCircle2 className="w-5 h-5 text-green-500 shrink-0 mt-0.5" />
                <span><strong>Groupe tes envois :</strong> un gros carton coûte moins cher que plusieurs petits en transport</span>
              </div>
              <div className="flex items-start gap-3">
                <CheckCircle2 className="w-5 h-5 text-green-500 shrink-0 mt-0.5" />
                <span><strong>Évite les catégories à forte commission :</strong> bijoux (20%), mode (15%) vs. maison/jardin (15%)</span>
              </div>
              <div className="flex items-start gap-3">
                <CheckCircle2 className="w-5 h-5 text-green-500 shrink-0 mt-0.5" />
                <span><strong>Vise des produits >15€ :</strong> les frais fixes (FBA) pèsent moins sur la marge</span>
              </div>
            </div>
          </section>

          {/* Budget minimum */}
          <section id="budget" className="mb-12 scroll-mt-24">
            <h2 className="text-3xl font-bold mb-6">Quel budget minimum recommandé</h2>
            
            <div className="not-prose grid md:grid-cols-3 gap-4">
              <Card className="border-yellow-500/30">
                <CardContent className="pt-6 text-center">
                  <p className="text-3xl font-bold text-yellow-600">500€</p>
                  <p className="font-semibold mt-2">Minimum serré</p>
                  <p className="text-sm text-muted-foreground mt-2">
                    2-3 produits test, peu de marge d'erreur. Possible mais stressant.
                  </p>
                </CardContent>
              </Card>
              
              <Card className="border-green-500/30 border-2">
                <CardContent className="pt-6 text-center">
                  <Badge className="mb-2 bg-green-500/10 text-green-600">Recommandé</Badge>
                  <p className="text-3xl font-bold text-green-600">1000€</p>
                  <p className="font-semibold mt-2">Confortable</p>
                  <p className="text-sm text-muted-foreground mt-2">
                    5-10 produits, tests variés, marge pour absorber les erreurs.
                  </p>
                </CardContent>
              </Card>
              
              <Card className="border-primary/30">
                <CardContent className="pt-6 text-center">
                  <p className="text-3xl font-bold text-primary">2000€+</p>
                  <p className="font-semibold mt-2">Optimal</p>
                  <p className="text-sm text-muted-foreground mt-2">
                    Diversification, scaling rapide, réinvestissement des bénéfices.
                  </p>
                </CardContent>
              </Card>
            </div>
            
            <p className="mt-6">
              L'important n'est pas d'avoir un gros budget, mais de bien choisir tes produits. 
              Mieux vaut 500€ bien investis que 2000€ sur de mauvais produits.
            </p>
          </section>

          {/* CTA */}
          <section id="cta" className="mb-12 scroll-mt-24">
            <h2 className="text-3xl font-bold mb-4">Maîtrise tes coûts avec les bons outils</h2>
            <div className="not-prose">
              <Card className="bg-gradient-to-br from-yellow-500/10 to-primary/10 border-yellow-500/30">
                <CardContent className="pt-6 text-center">
                  <h3 className="text-xl font-bold mb-3">Calcule ta rentabilité avant d'acheter</h3>
                  <p className="text-muted-foreground mb-6">
                    Avec AMZing FBA, tu as accès à des calculateurs, des moniteurs de produits rentables 
                    et une communauté pour valider tes décisions avant d'investir.
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
                <Link to="/guide/amazon-fba-vs-fbm" className="block p-4 border rounded-lg hover:border-primary transition-colors">
                  <span className="font-medium">FBA vs FBM</span>
                  <p className="text-sm text-muted-foreground mt-1">Comparatif des modèles</p>
                </Link>
                <Link to="/guide/comment-debuter-amazon-fba" className="block p-4 border rounded-lg hover:border-primary transition-colors">
                  <span className="font-medium">Comment débuter</span>
                  <p className="text-sm text-muted-foreground mt-1">Guide étape par étape</p>
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

export default CombienCouteAmazonFba;
