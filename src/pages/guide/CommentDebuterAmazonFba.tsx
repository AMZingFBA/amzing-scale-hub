import { ArrowRight, ArrowLeft, CheckCircle2, XCircle, BookOpen, HelpCircle, FileText, Package, Calculator, Truck, Rocket, Target, Search, Shield, AlertTriangle, Users } from "lucide-react";
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

const CommentDebuterAmazonFba = () => {
  const navigate = useNavigate();

  const tableOfContents = [
    { id: "prerequis", label: "Les prérequis" },
    { id: "etapes", label: "Les étapes de A à Z" },
    { id: "produit", label: "Trouver un produit" },
    { id: "rentabilite", label: "Calculer la rentabilité" },
    { id: "sourcing", label: "Sourcer les produits" },
    { id: "envoi", label: "Envoyer au centre Amazon" },
    { id: "lancement", label: "Lancer et optimiser" },
    { id: "erreurs", label: "10 erreurs de débutant" },
    { id: "cta", label: "Se former" },
    { id: "faq", label: "FAQ" },
  ];

  const faqItems = [
    {
      question: "Quel budget pour débuter sur Amazon FBA ?",
      answer: "Pour débuter sérieusement, prévois entre 500€ et 1500€ : abonnement vendeur Pro (39€/mois), stock initial (300-1000€), et outils d'analyse. Tu peux commencer plus petit mais les résultats seront plus lents. L'important est de bien choisir tes premiers produits pour rentabiliser rapidement."
    },
    {
      question: "Faut-il une société pour vendre sur Amazon ?",
      answer: "Pour vendre sur Amazon.fr en tant que professionnel, tu as besoin d'un statut juridique (micro-entreprise, SASU, EURL, etc.). La micro-entreprise est souvent le choix des débutants car simple à créer. Attention aux seuils de TVA et aux limites de chiffre d'affaires selon ton statut."
    },
    {
      question: "Peut-on commencer sans publicité ?",
      answer: "Oui, tu peux faire tes premières ventes sans pub Amazon (PPC). Si ton produit est bien sourcé (bonne demande, peu de concurrence, bon prix), il peut se vendre naturellement. La pub devient utile pour accélérer ou pour des produits plus concurrentiels."
    },
    {
      question: "Combien de temps pour démarrer ?",
      answer: "De la création du compte vendeur à ta première vente, compte 4 à 8 semaines minimum. Cela dépend du temps que tu y consacres, de la vitesse de sourcing, et des délais de livraison fournisseur + réception Amazon. Ne te précipite pas : bien préparer évite les erreurs coûteuses."
    },
    {
      question: "Est-ce compliqué sans expérience ?",
      answer: "Amazon FBA a une courbe d'apprentissage, mais c'est accessible aux débutants motivés. Les principales difficultés sont : comprendre les frais, trouver des produits rentables, et maîtriser l'envoi FBA. Une bonne formation et des outils adaptés réduisent considérablement la difficulté."
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

  const howToSchema = {
    "@context": "https://schema.org",
    "@type": "HowTo",
    "name": "Comment débuter sur Amazon FBA",
    "description": "Guide étape par étape pour lancer ton business Amazon FBA de zéro",
    "step": [
      { "@type": "HowToStep", "name": "Créer un compte vendeur Amazon", "text": "Inscription sur Amazon Seller Central avec le plan Professionnel" },
      { "@type": "HowToStep", "name": "Choisir ton modèle", "text": "Wholesale, retail arbitrage ou private label" },
      { "@type": "HowToStep", "name": "Trouver des produits rentables", "text": "Analyser la demande, la concurrence et les marges" },
      { "@type": "HowToStep", "name": "Sourcer tes produits", "text": "Contacter des fournisseurs et négocier" },
      { "@type": "HowToStep", "name": "Envoyer à Amazon", "text": "Préparer et expédier ton stock vers les entrepôts FBA" },
      { "@type": "HowToStep", "name": "Lancer tes ventes", "text": "Optimiser tes listings et générer tes premières ventes" }
    ]
  };

  const breadcrumbSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    "itemListElement": [
      { "@type": "ListItem", "position": 1, "name": "Accueil", "item": "https://amzingfba.com/" },
      { "@type": "ListItem", "position": 2, "name": "Comment débuter Amazon FBA", "item": "https://amzingfba.com/guide/comment-debuter-amazon-fba" }
    ]
  };

  const erreurs = [
    "Se lancer sans comprendre les frais Amazon (commission + FBA + stockage)",
    "Acheter du stock sans vérifier la demande réelle (BSR, historique)",
    "Ignorer la concurrence et se retrouver face à 50 vendeurs",
    "Oublier la TVA dans ses calculs de marge",
    "Commander trop de stock pour un premier test",
    "Négliger la qualité des images et du listing",
    "Ne pas avoir de factures conformes (risque de suspension)",
    "Sous-estimer les délais (fournisseur + réception Amazon)",
    "Vouloir tout faire seul sans formation ni outils",
    "Abandonner trop vite après les premières difficultés"
  ];

  return (
    <div className="min-h-screen bg-background">
      <SEO
        title="Comment débuter sur Amazon FBA : étapes, checklist, erreurs à éviter"
        description="Guide complet pour débuter sur Amazon FBA : prérequis, étapes de A à Z, trouver des produits, calculer la rentabilité, sourcing et lancement. Évite les erreurs."
        keywords="comment débuter amazon fba, debuter amazon fba, commencer amazon fba, lancer business amazon, étapes amazon fba, guide débutant amazon"
        schema={[faqSchema, howToSchema, breadcrumbSchema]}
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
      <section className="pt-32 pb-16 bg-gradient-to-br from-green-500/10 via-background to-primary/10">
        <div className="container mx-auto px-4 max-w-4xl">
          <Badge className="mb-4 bg-green-500/10 text-green-600 border-green-500/20">Guide pas à pas</Badge>
          <h1 className="text-4xl md:text-5xl font-bold mb-6">Comment débuter sur Amazon FBA ?</h1>
          <p className="text-xl text-muted-foreground mb-8">
            Tu veux te lancer sur Amazon FBA mais tu ne sais pas par où commencer ? 
            Ce guide te donne les étapes concrètes, de la création du compte à ta première vente.
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
          
          {/* Prérequis */}
          <section id="prerequis" className="mb-12 scroll-mt-24">
            <h2 className="text-3xl font-bold mb-6 flex items-center gap-3">
              <FileText className="w-8 h-8 text-primary" />
              Les prérequis (compte vendeur, TVA, documents)
            </h2>
            <p>Avant de te lancer, assure-toi d'avoir ces éléments en place :</p>
            
            <div className="not-prose space-y-4 mt-6">
              <Card>
                <CardContent className="pt-6">
                  <h3 className="font-semibold mb-2 flex items-center gap-2">
                    <Shield className="w-5 h-5 text-primary" /> Statut juridique
                  </h3>
                  <p className="text-sm text-muted-foreground">
                    Tu as besoin d'un numéro SIRET pour vendre sur Amazon en France. Options courantes : 
                    <strong> micro-entreprise</strong> (simple, idéal pour débuter), <strong>SASU/EURL</strong> (pour scaler). 
                    Créer une micro-entreprise est gratuit et se fait en ligne.
                  </p>
                </CardContent>
              </Card>
              
              <Card>
                <CardContent className="pt-6">
                  <h3 className="font-semibold mb-2 flex items-center gap-2">
                    <FileText className="w-5 h-5 text-primary" /> Compte vendeur Amazon
                  </h3>
                  <p className="text-sm text-muted-foreground">
                    Inscription sur <strong>Amazon Seller Central</strong>. Choisis le plan <strong>Professionnel</strong> (39€/mois) 
                    si tu prévois de vendre plus de 40 articles/mois. Tu auras besoin de : pièce d'identité, 
                    RIB, carte bancaire, justificatif d'adresse.
                  </p>
                </CardContent>
              </Card>
              
              <Card>
                <CardContent className="pt-6">
                  <h3 className="font-semibold mb-2 flex items-center gap-2">
                    <Calculator className="w-5 h-5 text-primary" /> Numéro de TVA (si applicable)
                  </h3>
                  <p className="text-sm text-muted-foreground">
                    En micro-entreprise, tu es en franchise de TVA jusqu'à 91 900€ de CA (vente de biens). 
                    Si tu dépasses ou si tu optes pour la TVA, tu devras l'afficher et la reverser. 
                    Pense aussi à la TVA à l'importation si tu sources hors UE.
                  </p>
                </CardContent>
              </Card>
              
              <Card>
                <CardContent className="pt-6">
                  <h3 className="font-semibold mb-2 flex items-center gap-2">
                    <Package className="w-5 h-5 text-primary" /> Budget initial
                  </h3>
                  <p className="text-sm text-muted-foreground">
                    Prévois <strong>500€ à 1500€</strong> minimum : abonnement Pro (39€), stock test (300-1000€), 
                    outils d'analyse (~35€/mois). Tu peux commencer plus petit, mais les résultats seront plus lents.
                  </p>
                </CardContent>
              </Card>
            </div>
          </section>

          {/* Étapes */}
          <section id="etapes" className="mb-12 scroll-mt-24">
            <h2 className="text-3xl font-bold mb-6 flex items-center gap-3">
              <Rocket className="w-8 h-8 text-primary" />
              Les étapes de A à Z (checklist)
            </h2>
            
            <div className="not-prose bg-muted/50 p-6 rounded-xl">
              <ol className="space-y-4">
                <li className="flex items-start gap-4">
                  <div className="w-8 h-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-bold shrink-0">1</div>
                  <div>
                    <strong>Crée ton statut juridique</strong>
                    <p className="text-sm text-muted-foreground">Micro-entreprise sur autoentrepreneur.urssaf.fr (gratuit, 15 min)</p>
                  </div>
                </li>
                <li className="flex items-start gap-4">
                  <div className="w-8 h-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-bold shrink-0">2</div>
                  <div>
                    <strong>Crée ton compte Amazon Seller Central</strong>
                    <p className="text-sm text-muted-foreground">Plan Pro recommandé. Vérification d'identité sous 24-48h.</p>
                  </div>
                </li>
                <li className="flex items-start gap-4">
                  <div className="w-8 h-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-bold shrink-0">3</div>
                  <div>
                    <strong>Choisis ton modèle</strong>
                    <p className="text-sm text-muted-foreground">Wholesale (grossistes), Retail Arbitrage (magasins), Private Label (ta marque)</p>
                  </div>
                </li>
                <li className="flex items-start gap-4">
                  <div className="w-8 h-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-bold shrink-0">4</div>
                  <div>
                    <strong>Équipe-toi d'outils d'analyse</strong>
                    <p className="text-sm text-muted-foreground">Pour analyser les produits : demande, concurrence, rentabilité</p>
                  </div>
                </li>
                <li className="flex items-start gap-4">
                  <div className="w-8 h-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-bold shrink-0">5</div>
                  <div>
                    <strong>Recherche des produits rentables</strong>
                    <p className="text-sm text-muted-foreground">Critères : demande (BSR), concurrence, marge supérieure à 20%, pas de restrictions</p>
                  </div>
                </li>
                <li className="flex items-start gap-4">
                  <div className="w-8 h-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-bold shrink-0">6</div>
                  <div>
                    <strong>Source tes produits</strong>
                    <p className="text-sm text-muted-foreground">Contacte des fournisseurs, négocie, obtiens des factures conformes</p>
                  </div>
                </li>
                <li className="flex items-start gap-4">
                  <div className="w-8 h-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-bold shrink-0">7</div>
                  <div>
                    <strong>Prépare et envoie ton stock à Amazon</strong>
                    <p className="text-sm text-muted-foreground">Étiquetage FNSKU, création envoi Seller Central, expédition</p>
                  </div>
                </li>
                <li className="flex items-start gap-4">
                  <div className="w-8 h-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-bold shrink-0">8</div>
                  <div>
                    <strong>Lance tes ventes</strong>
                    <p className="text-sm text-muted-foreground">Optimise ton listing (titre, bullets, images), ajuste ton prix</p>
                  </div>
                </li>
              </ol>
            </div>
          </section>

          {/* Trouver un produit */}
          <section id="produit" className="mb-12 scroll-mt-24">
            <h2 className="text-3xl font-bold mb-6 flex items-center gap-3">
              <Search className="w-8 h-8 text-primary" />
              Trouver un produit (principes + critères simples)
            </h2>
            <p>
              Trouver un bon produit, c'est la clé. Voici les critères à vérifier avant d'acheter :
            </p>
            
            <div className="not-prose grid md:grid-cols-2 gap-4 mt-6">
              <Card className="border-green-500/30">
                <CardContent className="pt-6">
                  <h3 className="font-semibold text-green-600 mb-3">✓ Un bon produit</h3>
                  <ul className="space-y-2 text-sm">
                    <li>• BSR correct (signe de demande)</li>
                    <li>• Moins de 10-15 vendeurs FBA</li>
                    <li>• Marge nette supérieure à 20%</li>
                    <li>• Prix de vente supérieur à 15€</li>
                    <li>• Pas de restrictions Amazon</li>
                    <li>• Stock disponible chez fournisseur</li>
                  </ul>
                </CardContent>
              </Card>
              <Card className="border-red-500/30">
                <CardContent className="pt-6">
                  <h3 className="font-semibold text-red-600 mb-3">✗ À éviter</h3>
                  <ul className="space-y-2 text-sm">
                    <li>• Amazon comme vendeur principal</li>
                    <li>• Trop de vendeurs (50+)</li>
                    <li>• Marge inférieure à 10%</li>
                    <li>• Catégorie restreinte</li>
                    <li>• Produit fragile ou lourd (frais FBA élevés)</li>
                    <li>• Variations complexes</li>
                  </ul>
                </CardContent>
              </Card>
            </div>
            
            <p className="mt-4">
              Utilise des outils comme SellerAmp, Keepa ou les moniteurs AMZing FBA pour analyser rapidement 
              les produits et identifier les opportunités.
            </p>
          </section>

          {/* Calculer la rentabilité */}
          <section id="rentabilite" className="mb-12 scroll-mt-24">
            <h2 className="text-3xl font-bold mb-6 flex items-center gap-3">
              <Calculator className="w-8 h-8 text-primary" />
              Calculer la rentabilité (marge, frais, ROI)
            </h2>
            <p>
              Avant d'acheter, calcule TOUJOURS ta marge réelle. Voici la formule simplifiée :
            </p>
            
            <div className="not-prose bg-muted/50 p-6 rounded-xl my-6 font-mono text-sm">
              <p><strong>Marge nette</strong> = Prix de vente</p>
              <p className="pl-4">- Prix d'achat (HT)</p>
              <p className="pl-4">- Commission Amazon (~15%)</p>
              <p className="pl-4">- Frais FBA (~3-5€/unité)</p>
              <p className="pl-4">- Frais d'envoi vers Amazon</p>
              <p className="pl-4">- TVA (si applicable)</p>
            </div>
            
            <p><strong>Exemple concret :</strong></p>
            <ul className="not-prose mt-2 space-y-1 text-sm">
              <li>• Prix de vente : 30€</li>
              <li>• Prix d'achat : 12€</li>
              <li>• Commission Amazon (15%) : 4,50€</li>
              <li>• Frais FBA : 4€</li>
              <li>• Envoi Amazon : 0,50€</li>
              <li>• <strong>Marge nette : 9€ (30%)</strong></li>
            </ul>
            
            <p className="mt-4">
              <strong>ROI (Return on Investment)</strong> = (Marge nette / Prix d'achat) × 100
              <br />
              Dans cet exemple : (9 / 12) × 100 = <strong>75% de ROI</strong>
            </p>
            
            <p>
              <Link to="/guide/combien-coute-amazon-fba" className="text-primary hover:underline inline-flex items-center gap-1">
                Voir le détail complet des frais Amazon FBA <ArrowRight className="w-4 h-4" />
              </Link>
            </p>
          </section>

          {/* Sourcing */}
          <section id="sourcing" className="mb-12 scroll-mt-24">
            <h2 className="text-3xl font-bold mb-6 flex items-center gap-3">
              <Package className="w-8 h-8 text-primary" />
              Sourcer (fournisseurs, factures, conformité)
            </h2>
            <p>
              Une fois ton produit identifié, il faut le sourcer. Plusieurs options selon ton modèle :
            </p>
            
            <div className="not-prose space-y-4 mt-6">
              <Card>
                <CardContent className="pt-6">
                  <h3 className="font-semibold mb-2">Wholesale (grossistes)</h3>
                  <p className="text-sm text-muted-foreground">
                    Contacte des distributeurs officiels ou des grossistes européens. 
                    Demande des tarifs et des conditions. Exige des factures conformes (TVA, nom de la marque, etc.).
                    Plateformes : Ankorstore, Faire, catalogues fournisseurs AMZing FBA.
                  </p>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="pt-6">
                  <h3 className="font-semibold mb-2">Retail Arbitrage</h3>
                  <p className="text-sm text-muted-foreground">
                    Achète des produits en promo en magasin (Lidl, Action, Carrefour...) ou en ligne (Amazon, Cdiscount...). 
                    Garde tes tickets de caisse comme justificatif. Attention aux quantités limitées.
                  </p>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="pt-6">
                  <h3 className="font-semibold mb-2">Private Label</h3>
                  <p className="text-sm text-muted-foreground">
                    Trouve un fabricant (Alibaba, fournisseurs UE) pour créer ta propre marque. 
                    Plus de marge potentielle, mais plus de risques et de capital nécessaire.
                  </p>
                </CardContent>
              </Card>
            </div>
            
            <div className="not-prose bg-yellow-50 dark:bg-yellow-950/20 border border-yellow-200 dark:border-yellow-800 rounded-xl p-4 mt-6">
              <p className="flex items-start gap-2 text-sm">
                <AlertTriangle className="w-5 h-5 text-yellow-600 shrink-0 mt-0.5" />
                <span><strong>Important :</strong> Amazon peut te demander des factures d'achat à tout moment. Sans facture conforme, tu risques la suspension. Garde toujours des preuves d'achat légitimes.</span>
              </p>
            </div>
          </section>

          {/* Envoi Amazon */}
          <section id="envoi" className="mb-12 scroll-mt-24">
            <h2 className="text-3xl font-bold mb-6 flex items-center gap-3">
              <Truck className="w-8 h-8 text-primary" />
              Envoyer au centre Amazon (prep, étiquettes, expédition)
            </h2>
            <p>
              Une fois tes produits reçus, il faut les préparer et les envoyer à Amazon. Voici les étapes :
            </p>
            
            <div className="not-prose bg-muted/50 p-6 rounded-xl mt-6">
              <ol className="space-y-4">
                <li className="flex items-start gap-3">
                  <div className="w-6 h-6 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-bold text-sm shrink-0">1</div>
                  <div>
                    <strong>Crée un plan d'envoi dans Seller Central</strong>
                    <p className="text-sm text-muted-foreground">Indique les produits, quantités, et état (neuf/occasion)</p>
                  </div>
                </li>
                <li className="flex items-start gap-3">
                  <div className="w-6 h-6 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-bold text-sm shrink-0">2</div>
                  <div>
                    <strong>Imprime les étiquettes FNSKU</strong>
                    <p className="text-sm text-muted-foreground">Chaque unité doit avoir son étiquette Amazon (couvre le code-barres d'origine)</p>
                  </div>
                </li>
                <li className="flex items-start gap-3">
                  <div className="w-6 h-6 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-bold text-sm shrink-0">3</div>
                  <div>
                    <strong>Prépare tes produits</strong>
                    <p className="text-sm text-muted-foreground">Emballage, protection, mise en sachet si nécessaire (respect des normes Amazon)</p>
                  </div>
                </li>
                <li className="flex items-start gap-3">
                  <div className="w-6 h-6 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-bold text-sm shrink-0">4</div>
                  <div>
                    <strong>Emballe et étiquette tes cartons</strong>
                    <p className="text-sm text-muted-foreground">Étiquettes de carton Amazon + étiquette transporteur</p>
                  </div>
                </li>
                <li className="flex items-start gap-3">
                  <div className="w-6 h-6 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-bold text-sm shrink-0">5</div>
                  <div>
                    <strong>Expédie vers l'entrepôt assigné</strong>
                    <p className="text-sm text-muted-foreground">Chronopost, GLS, UPS... ou le partenaire Amazon (tarifs négociés)</p>
                  </div>
                </li>
              </ol>
            </div>
            
            <p className="mt-4">
              La réception par Amazon prend généralement 3 à 10 jours. 
              Une fois "disponible", ton produit est en vente avec le badge Prime.
            </p>
          </section>

          {/* Lancement */}
          <section id="lancement" className="mb-12 scroll-mt-24">
            <h2 className="text-3xl font-bold mb-6 flex items-center gap-3">
              <Rocket className="w-8 h-8 text-primary" />
              Lancer et optimiser (prix, stock, pub)
            </h2>
            <p>
              Tes produits sont en ligne ! Maintenant, il faut générer des ventes et optimiser :
            </p>
            
            <div className="not-prose space-y-3 mt-6">
              <div className="flex items-start gap-3">
                <CheckCircle2 className="w-5 h-5 text-green-500 shrink-0 mt-0.5" />
                <span><strong>Optimise ton listing :</strong> titre avec mots-clés, bullets points clairs, images de qualité</span>
              </div>
              <div className="flex items-start gap-3">
                <CheckCircle2 className="w-5 h-5 text-green-500 shrink-0 mt-0.5" />
                <span><strong>Ajuste ton prix :</strong> surveille la Buy Box, reste compétitif sans sacrifier ta marge</span>
              </div>
              <div className="flex items-start gap-3">
                <CheckCircle2 className="w-5 h-5 text-green-500 shrink-0 mt-0.5" />
                <span><strong>Surveille ton stock :</strong> évite les ruptures (tu perds le ranking) et le surstockage (frais)</span>
              </div>
              <div className="flex items-start gap-3">
                <CheckCircle2 className="w-5 h-5 text-green-500 shrink-0 mt-0.5" />
                <span><strong>Lance de la pub (optionnel) :</strong> Amazon PPC pour booster la visibilité au début</span>
              </div>
              <div className="flex items-start gap-3">
                <CheckCircle2 className="w-5 h-5 text-green-500 shrink-0 mt-0.5" />
                <span><strong>Analyse et itère :</strong> regarde ce qui marche, double les produits gagnants</span>
              </div>
            </div>
          </section>

          {/* Erreurs */}
          <section id="erreurs" className="mb-12 scroll-mt-24">
            <h2 className="text-3xl font-bold mb-6 flex items-center gap-3">
              <AlertTriangle className="w-8 h-8 text-red-500" />
              10 erreurs de débutant à éviter
            </h2>
            
            <div className="not-prose bg-red-50 dark:bg-red-950/20 border border-red-200 dark:border-red-800 rounded-xl p-6">
              <ol className="space-y-3">
                {erreurs.map((erreur, index) => (
                  <li key={index} className="flex items-start gap-3">
                    <span className="w-6 h-6 rounded-full bg-red-500 text-white flex items-center justify-center font-bold text-sm shrink-0">{index + 1}</span>
                    <span>{erreur}</span>
                  </li>
                ))}
              </ol>
            </div>
          </section>

          {/* CTA */}
          <section id="cta" className="mb-12 scroll-mt-24">
            <h2 className="text-3xl font-bold mb-4">Passe à l'action avec un accompagnement</h2>
            <div className="not-prose">
              <Card className="bg-gradient-to-br from-green-500/10 to-primary/10 border-green-500/30">
                <CardContent className="pt-6 text-center">
                  <h3 className="text-xl font-bold mb-3">Tu veux être guidé pas à pas ?</h3>
                  <p className="text-muted-foreground mb-6">
                    AMZing FBA te donne la méthode complète, les outils d'analyse, 
                    un catalogue fournisseurs et une communauté pour répondre à tes questions.
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
                  <span className="font-medium">FBA vs FBM : lequel choisir ?</span>
                  <p className="text-sm text-muted-foreground mt-1">Comparatif détaillé</p>
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

export default CommentDebuterAmazonFba;
