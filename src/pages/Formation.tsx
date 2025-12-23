import { 
  CheckCircle2, 
  Users, 
  TrendingUp, 
  Target, 
  Rocket, 
  BarChart3,
  ShoppingCart,
  Bell,
  MessageSquare,
  Package,
  Shield,
  RefreshCw,
  Smartphone,
  ChevronDown,
  ArrowRight,
  ArrowLeft,
  BookOpen,
  Zap,
  Award,
  AlertTriangle,
  Gift,
  Database,
  Coins,
  Star,
  ExternalLink,
  HelpCircle,
  Megaphone,
  DollarSign,
  Clock,
  GraduationCap,
  List
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Link, useNavigate } from "react-router-dom";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import SEO from "@/components/SEO";
import { seoData, schemas } from "@/lib/seo-data";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { useState, useEffect } from "react";

const Formation = () => {
  const navigate = useNavigate();
  const [activeSection, setActiveSection] = useState("");

  // Table des matières
  const tableOfContents = [
    { id: "cest-quoi-amazon-fba", label: "C'est quoi Amazon FBA ?" },
    { id: "a-qui-sadresse", label: "À qui s'adresse cette formation" },
    { id: "programme", label: "Programme détaillé" },
    { id: "trouver-produit-rentable", label: "Trouver un produit rentable" },
    { id: "verifier-rentabilite", label: "Vérifier la rentabilité" },
    { id: "amazon-ads", label: "Amazon Ads : bases" },
    { id: "erreurs-debutants", label: "Erreurs des débutants" },
    { id: "pourquoi-amzing", label: "Pourquoi AMZing FBA" },
    { id: "avis-temoignages", label: "Avis & témoignages" },
    { id: "faq", label: "FAQ" },
  ];

  // Scroll spy pour la table des matières
  useEffect(() => {
    const handleScroll = () => {
      const sections = tableOfContents.map(item => document.getElementById(item.id));
      const scrollPosition = window.scrollY + 150;

      for (let i = sections.length - 1; i >= 0; i--) {
        const section = sections[i];
        if (section && section.offsetTop <= scrollPosition) {
          setActiveSection(tableOfContents[i].id);
          break;
        }
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const scrollToSection = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      const offset = 100;
      const elementPosition = element.offsetTop - offset;
      window.scrollTo({ top: elementPosition, behavior: "smooth" });
    }
  };

  const personas = [
    {
      icon: Target,
      title: "Tu démarres de zéro sur Amazon",
      description: "Tu n'as jamais vendu sur Amazon FBA ? Ce n'est pas un problème. On t'accompagne dès les bases : comprendre le modèle, choisir ta stratégie, ouvrir ton compte, éviter les erreurs classiques et lancer tes premiers produits en limitant les risques."
    },
    {
      icon: TrendingUp,
      title: "Tu vends déjà mais tu stagnes",
      description: "Tu as déjà testé des produits, mais tu n'arrives pas à passer un cap. Tu perds du temps à chercher des idées, tu doutes sur chaque achat, tu n'as pas une vision claire de la rentabilité. AMZing FBA t'aide à structurer ton sourcing, tes décisions et tes chiffres."
    },
    {
      icon: Rocket,
      title: "Tu veux ajouter Amazon à ton écosystème",
      description: "Tu as déjà une activité (boutique en ligne, grossiste, autre business) et tu veux utiliser Amazon comme canal supplémentaire. On t'aide à adapter ton catalogue, tes prix et ta logistique pour que ça reste rentable et gérable."
    }
  ];

  const modules = [
    {
      number: 1,
      title: "Comprendre Amazon FBA et les modèles possibles",
      description: "Fonctionnement d'Amazon FBA, FBA vs FBM, arbitrage, wholesale, private label. Comment choisir le modèle adapté à ta situation et tes objectifs.",
      icon: BookOpen
    },
    {
      number: 2,
      title: "Mettre en place ton compte vendeur et ton cadre légal",
      description: "Création et paramétrage du compte vendeur Amazon, aspects administratifs, structure d'entreprise (micro, SASU, EURL) et points de vigilance fiscaux.",
      icon: Shield
    },
    {
      number: 3,
      title: "Les bases de la recherche de produits rentables",
      description: "Comment lire les données, interpréter la demande, analyser la concurrence, calculer la rotation, les frais Amazon, la marge et le ROI.",
      icon: BarChart3
    },
    {
      number: 4,
      title: "Utiliser les moniteurs et alertes produits AMZing FBA",
      description: "Comment exploiter la plateforme AMZing FBA, comprendre les colonnes, les filtres, les alertes et les signaux importants avant de prendre une décision.",
      icon: Bell
    },
    {
      number: 5,
      title: "Passer commande, négocier et sécuriser la logistique",
      description: "Bonnes pratiques pour commander chez les fournisseurs, vérifier les conditions, organiser l'envoi vers Amazon (ou entrepôts), anticiper les délais.",
      icon: ShoppingCart
    },
    {
      number: 6,
      title: "Suivre tes ventes, ajuster et scaler",
      description: "Comment suivre les performances de tes produits, décider quoi réassortir, quoi arrêter, comment réinvestir intelligemment et diversifier ton catalogue.",
      icon: TrendingUp
    },
    {
      number: 7,
      title: "Amazon Ads : bases et erreurs fréquentes",
      description: "Introduction à Amazon PPC, création de campagnes, structure, ciblage, budget, analyse des résultats et erreurs à éviter pour ne pas gaspiller ton argent.",
      icon: Megaphone
    },
    {
      number: 8,
      title: "Gestion du risque et erreurs à éviter",
      description: "Liste détaillée des erreurs fréquentes observées chez les vendeurs Amazon FBA et comment les éviter grâce à la data et aux retours de la communauté.",
      icon: AlertTriangle
    }
  ];

  const erreursList = [
    {
      erreur: "Se précipiter sur le premier produit trouvé",
      solution: "Utilise les moniteurs pour comparer plusieurs opportunités et prends le temps d'analyser les données avant d'acheter."
    },
    {
      erreur: "Ignorer les frais Amazon dans le calcul de marge",
      solution: "La formation t'apprend à calculer le vrai ROI en incluant tous les frais : commission, FBA, stockage, expédition."
    },
    {
      erreur: "Commander trop de stock au début",
      solution: "Commence petit, teste le marché, puis réassortis si ça fonctionne. AMZing FBA t'aide à trouver le bon équilibre."
    },
    {
      erreur: "Négliger la concurrence et le nombre de vendeurs",
      solution: "Analyse le nombre de vendeurs FBA sur le listing et leur historique avant de te positionner."
    },
    {
      erreur: "Lancer des Amazon Ads sans stratégie",
      solution: "La formation couvre les bases d'Amazon PPC pour éviter de gaspiller ton budget publicitaire."
    },
    {
      erreur: "Travailler seul sans feedback",
      solution: "La communauté AMZing FBA te permet de demander des avis et d'apprendre des erreurs des autres."
    }
  ];

  const testimonials = [
    {
      name: "Julien",
      initial: "J",
      context: "Vendeur débutant",
      quote: "Je tournais en rond depuis des mois sur la recherche de produits. Les moniteurs AMZing FBA et les retours de la communauté m'ont permis de faire mes premiers vrais achats avec une stratégie claire."
    },
    {
      name: "Sophie",
      initial: "S",
      context: "Vendeuse intermédiaire",
      quote: "J'avais déjà testé plusieurs formations Amazon FBA, mais il me manquait toujours la partie data et outils. Avec AMZing FBA, j'ai enfin une vision claire sur quoi me positionner."
    },
    {
      name: "Marc",
      initial: "M",
      context: "Entrepreneur e-commerce",
      quote: "La plateforme m'a permis de structurer mon sourcing et de gagner un temps fou. Le cashback et les alertes produits sont de vrais plus pour la rentabilité."
    }
  ];

  const faqItems = [
    {
      question: "Quelle est la meilleure formation Amazon FBA en 2025 ?",
      answer: "AMZing FBA est considérée comme une des meilleures formations Amazon FBA car elle combine une méthode structurée, des outils de recherche de produits (moniteurs), un catalogue fournisseurs et une communauté active. Contrairement aux formations classiques, elle offre un écosystème complet pour passer de la théorie à la pratique."
    },
    {
      question: "Combien coûte la formation Amazon FBA AMZing FBA ?",
      answer: "L'abonnement AMZing FBA est à partir de 34,99€/mois. Il inclut l'accès à la formation complète, aux moniteurs de produits rentables, au catalogue fournisseurs, au cashback et à la communauté. Il n'y a pas de frais cachés."
    },
    {
      question: "Puis-je commencer sans expérience sur Amazon ?",
      answer: "Oui, la formation Amazon FBA AMZing FBA est conçue pour les débutants. Elle part des bases : comprendre le modèle FBA, créer son compte vendeur, choisir sa stratégie, et avancer étape par étape jusqu'aux premières ventes."
    },
    {
      question: "Combien de temps faut-il pour devenir rentable sur Amazon FBA ?",
      answer: "Cela dépend du temps investi, du budget et des décisions prises. Certains membres réalisent leurs premières ventes rentables en 2-4 mois. AMZing FBA t'aide à réduire le temps de recherche et à prendre de meilleures décisions pour accélérer ce processus."
    },
    {
      question: "La formation inclut-elle Amazon Ads ?",
      answer: "Oui, AMZing FBA aborde les bases d'Amazon Ads (PPC) : comment créer des campagnes, quelles erreurs éviter, comment analyser les résultats et optimiser le budget publicitaire pour maximiser le ROI."
    },
    {
      question: "Quel budget minimum pour commencer sur Amazon FBA ?",
      answer: "Il est possible de démarrer avec 500-1000€ pour tester quelques produits. L'important n'est pas d'avoir un gros budget, mais de bien choisir ses produits. AMZing FBA t'aide à optimiser chaque euro investi grâce aux outils d'analyse et aux retours de la communauté."
    },
    {
      question: "Quelle est la différence entre FBA et FBM ?",
      answer: "FBA (Fulfillment by Amazon) : Amazon stocke, emballe et expédie tes produits. Tu bénéficies du badge Prime. FBM (Fulfillment by Merchant) : tu gères toi-même le stockage et l'expédition. La formation explique les avantages de chaque modèle pour choisir celui adapté à ta situation."
    },
    {
      question: "Est-ce que les moniteurs choisissent les produits à ma place ?",
      answer: "Non. Les moniteurs et alertes te proposent des idées basées sur des données (prix, demande, concurrence, marge), mais la décision finale t'appartient. La formation t'apprend à analyser ces informations et à décider en fonction de ta stratégie et de ton budget."
    },
    {
      question: "Puis-je annuler mon abonnement à tout moment ?",
      answer: "Oui, l'abonnement AMZing FBA est flexible. Tu peux l'annuler à tout moment depuis ton espace membre. Tant que ton abonnement est actif, tu gardes l'accès complet à la formation, aux outils et à la communauté."
    },
    {
      question: "Y a-t-il un support et une communauté ?",
      answer: "Oui. AMZing FBA inclut un chat communautaire, des salons thématiques (succès, ventes, questions), un support client réactif et des échanges réguliers avec les autres membres. Tu n'es jamais seul face à tes décisions."
    }
  ];

  // Combine schemas for rich results
  const combinedSchema = [
    schemas.course,
    schemas.formationFAQ,
    schemas.organization,
    schemas.breadcrumbList([
      { name: "Accueil", url: "https://amzingfba.com/" },
      { name: "Formation Amazon FBA", url: "https://amzingfba.com/formation" }
    ])
  ];

  return (
    <div className="min-h-screen bg-background">
      <SEO
        title={seoData.formation.title}
        description={seoData.formation.description}
        keywords={seoData.formation.keywords}
        schema={combinedSchema}
        robots={seoData.formation.robots}
      />
      <Navbar />

      {/* Back Arrow */}
      <Button
        variant="default"
        size="icon"
        className="fixed top-[140px] left-4 z-50 bg-primary hover:bg-primary/90 text-primary-foreground rounded-full shadow-lg transition-transform hover:scale-110"
        onClick={() => navigate('/')}
      >
        <ArrowLeft className="h-5 w-5" />
      </Button>

      {/* Table des matières sticky - Desktop */}
      <nav className="hidden xl:block fixed left-4 top-1/2 -translate-y-1/2 z-40 w-56">
        <div className="bg-card border rounded-lg shadow-lg p-4">
          <div className="flex items-center gap-2 mb-3 pb-2 border-b">
            <List className="w-4 h-4 text-primary" />
            <span className="font-semibold text-sm">Sommaire</span>
          </div>
          <ul className="space-y-1">
            {tableOfContents.map((item) => (
              <li key={item.id}>
                <button
                  onClick={() => scrollToSection(item.id)}
                  className={`text-left text-xs w-full py-1.5 px-2 rounded transition-colors hover:bg-muted ${
                    activeSection === item.id ? "bg-primary/10 text-primary font-medium" : "text-muted-foreground"
                  }`}
                >
                  {item.label}
                </button>
              </li>
            ))}
          </ul>
        </div>
      </nav>

      {/* Breadcrumb */}
      <div className="container mx-auto px-4 pt-24 pb-4">
        <nav className="flex items-center gap-2 text-sm text-muted-foreground">
          <Link to="/" className="hover:text-primary transition-colors">Accueil</Link>
          <span>/</span>
          <span className="text-foreground">Formation Amazon FBA</span>
        </nav>
      </div>
      
      {/* Hero Section */}
      <section className="pt-4 pb-16 relative overflow-hidden">
        {/* Background decorations */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-20 left-10 w-64 h-64 bg-primary/10 rounded-full blur-3xl"></div>
          <div className="absolute bottom-20 right-20 w-96 h-96 bg-secondary/10 rounded-full blur-3xl"></div>
        </div>

        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-4xl mx-auto text-center">
            <Badge className="mb-6 bg-primary/10 text-primary border-primary/20 text-sm px-4 py-1">
              Formation Amazon FBA + Plateforme complète 2025
            </Badge>
            
            {/* H1 SEO optimisé */}
            <h1 className="text-3xl md:text-5xl lg:text-6xl font-bold mb-6 leading-tight">
              Formation Amazon FBA : apprendre à vendre sur Amazon{" "}
              <span className="text-primary">étape par étape</span>
            </h1>
            
            {/* Intro avec mot-clé exact dans les 2 premières lignes */}
            <p className="text-lg md:text-xl text-muted-foreground mb-4 max-w-3xl mx-auto">
              <strong>La formation Amazon FBA</strong> AMZing FBA te donne une méthode claire pour <strong>vendre sur Amazon</strong> de façon rentable. 
              Pas une énième formation vidéo : un écosystème complet avec outils, moniteurs de produits, catalogue fournisseurs et communauté active.
            </p>
            <p className="text-base text-muted-foreground mb-8 max-w-3xl mx-auto">
              Que tu sois débutant ou vendeur qui veut passer un cap, AMZing FBA t'accompagne de A à Z pour structurer ton business Amazon FBA.
            </p>

            {/* Bullet points */}
            <div className="flex flex-col gap-3 mb-8 max-w-2xl mx-auto text-left">
              <div className="flex items-start gap-3">
                <CheckCircle2 className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
                <span>Une <strong>méthode étape par étape</strong> pour lancer ou relancer ton business Amazon FBA</span>
              </div>
              <div className="flex items-start gap-3">
                <CheckCircle2 className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
                <span>Des <strong>moniteurs automatisés</strong> qui scannent des sites et grossistes pour identifier des produits rentables</span>
              </div>
              <div className="flex items-start gap-3">
                <CheckCircle2 className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
                <span>Un <strong>catalogue fournisseurs</strong> et des pistes produits pour ne pas partir de zéro</span>
              </div>
              <div className="flex items-start gap-3">
                <CheckCircle2 className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
                <span>Une <strong>communauté active</strong> et un support pour ne plus être seul face à tes décisions</span>
              </div>
            </div>

            {/* CTA haut de page */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center mb-8">
              <Button variant="hero" size="xl" asChild>
                <Link to="/tarifs">
                  Accéder à AMZing FBA
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Link>
              </Button>
              <Button variant="outline" size="xl" asChild>
                <a href="#programme">
                  Voir le programme
                  <ChevronDown className="ml-2 h-5 w-5" />
                </a>
              </Button>
            </div>

            {/* Trust badges */}
            <div className="flex flex-wrap justify-center gap-6 text-sm text-muted-foreground">
              <div className="flex items-center gap-2">
                <Users className="w-4 h-4 text-primary" />
                <span>+280 membres actifs</span>
              </div>
              <div className="flex items-center gap-2">
                <Star className="w-4 h-4 text-primary" />
                <span>4.8/5 de satisfaction</span>
              </div>
              <div className="flex items-center gap-2">
                <Smartphone className="w-4 h-4 text-primary" />
                <span>App iOS & Android</span>
              </div>
              <div className="flex items-center gap-2">
                <RefreshCw className="w-4 h-4 text-primary" />
                <span>Mises à jour régulières</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Section : C'est quoi Amazon FBA */}
      <section id="cest-quoi-amazon-fba" className="py-16 bg-muted/30 scroll-mt-24">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-3xl md:text-4xl font-bold mb-6">
              C'est quoi Amazon FBA ? Explication simple
            </h2>
            <div className="prose prose-lg max-w-none text-muted-foreground">
              <p className="mb-4">
                <strong>Amazon FBA</strong> (Fulfillment by Amazon) est un modèle de vente en ligne où tu envoies tes produits dans les entrepôts d'Amazon, et Amazon s'occupe du reste : stockage, emballage, expédition aux clients, service après-vente et retours.
              </p>
              <p className="mb-4">
                En tant que vendeur Amazon FBA, ton rôle est de <strong>trouver des produits rentables</strong>, de les acheter chez des fournisseurs (grossistes, marques, fabricants), puis de les expédier vers Amazon. Tu bénéficies du badge Prime et de la logistique ultra-performante d'Amazon.
              </p>
              
              {/* Encadré Glossaire */}
              <div className="bg-card border-l-4 border-primary p-6 rounded-r-lg my-6 not-prose">
                <h3 className="font-bold text-foreground mb-3 flex items-center gap-2">
                  <HelpCircle className="w-5 h-5 text-primary" />
                  Glossaire rapide
                </h3>
                <ul className="space-y-2 text-sm">
                  <li><strong>FBA</strong> : Fulfillment by Amazon – Amazon gère la logistique</li>
                  <li><strong>FBM</strong> : Fulfillment by Merchant – Tu gères toi-même l'expédition</li>
                  <li><strong>ASIN</strong> : Identifiant unique d'un produit sur Amazon</li>
                  <li><strong>BSR</strong> : Best Sellers Rank – Classement des ventes d'un produit</li>
                  <li><strong>ROI</strong> : Return on Investment – Retour sur investissement</li>
                </ul>
              </div>

              <p>
                Il existe plusieurs modèles : <strong>arbitrage</strong> (acheter en promo et revendre), <strong>wholesale</strong> (acheter en gros chez des distributeurs), <strong>private label</strong> (créer sa propre marque). La formation AMZing FBA t'aide à choisir le modèle adapté à ta situation et à tes objectifs.
              </p>
            </div>

            {/* Lien interne vers page SEO */}
            <div className="mt-8 p-4 bg-primary/5 border border-primary/20 rounded-lg">
              <p className="text-sm mb-2">Pour aller plus loin :</p>
              <Link to="/amazon-fba-debutant" className="inline-flex items-center gap-2 text-primary font-medium hover:underline">
                Guide complet : Amazon FBA pour débutant (2025)
                <ExternalLink className="w-4 h-4" />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Section : À qui s'adresse cette formation */}
      <section id="a-qui-sadresse" className="py-16 scroll-mt-24">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              À qui s'adresse cette formation Amazon FBA ?
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              AMZing FBA est fait pour toi si tu veux construire un vrai business Amazon, pas juste "tester un truc".
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            {personas.map((persona, index) => (
              <Card key={index} className="group hover:shadow-xl hover:scale-[1.02] transition-all duration-300 border-2 hover:border-primary/30">
                <CardHeader className="text-center pb-2">
                  <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-4 group-hover:bg-primary/20 transition-colors">
                    <persona.icon className="w-8 h-8 text-primary" />
                  </div>
                  <CardTitle className="text-xl">{persona.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground text-center">{persona.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Section : Ce que tu obtiens */}
      <section className="py-16 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Ce que tu obtiens avec AMZing FBA
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Pas juste des vidéos : un écosystème complet pour passer à l'action.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-6xl mx-auto">
            <Card className="group hover:shadow-xl transition-all duration-300">
              <CardContent className="pt-6">
                <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4 group-hover:bg-primary group-hover:text-primary-foreground transition-all">
                  <GraduationCap className="w-6 h-6 text-primary group-hover:text-primary-foreground" />
                </div>
                <h3 className="font-bold text-lg mb-2">Formation complète</h3>
                <p className="text-muted-foreground text-sm">Parcours structuré en 8 modules, du débutant au vendeur confirmé.</p>
              </CardContent>
            </Card>

            <Card className="group hover:shadow-xl transition-all duration-300">
              <CardContent className="pt-6">
                <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4 group-hover:bg-primary group-hover:text-primary-foreground transition-all">
                  <Bell className="w-6 h-6 text-primary group-hover:text-primary-foreground" />
                </div>
                <h3 className="font-bold text-lg mb-2">Moniteurs & alertes</h3>
                <p className="text-muted-foreground text-sm">Des outils qui scannent les sites et grossistes pour identifier des produits rentables.</p>
              </CardContent>
            </Card>

            <Card className="group hover:shadow-xl transition-all duration-300">
              <CardContent className="pt-6">
                <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4 group-hover:bg-primary group-hover:text-primary-foreground transition-all">
                  <Database className="w-6 h-6 text-primary group-hover:text-primary-foreground" />
                </div>
                <h3 className="font-bold text-lg mb-2">Catalogue fournisseurs</h3>
                <p className="text-muted-foreground text-sm">Accès à des pistes fournisseurs et produits pour ne pas partir de zéro.</p>
              </CardContent>
            </Card>

            <Card className="group hover:shadow-xl transition-all duration-300">
              <CardContent className="pt-6">
                <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4 group-hover:bg-primary group-hover:text-primary-foreground transition-all">
                  <Users className="w-6 h-6 text-primary group-hover:text-primary-foreground" />
                </div>
                <h3 className="font-bold text-lg mb-2">Communauté & support</h3>
                <p className="text-muted-foreground text-sm">Chat, salons thématiques, partages de ventes et support réactif.</p>
              </CardContent>
            </Card>
          </div>

          {/* Lien vers outils */}
          <div className="text-center mt-8">
            <Link to="/outil-amazon-fba" className="inline-flex items-center gap-2 text-primary font-medium hover:underline">
              Découvre les outils Amazon FBA en détail
              <ExternalLink className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </section>

      {/* Section : Comment ça fonctionne */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Comment ça fonctionne ? 3 étapes simples
            </h2>
          </div>

          <div className="max-w-5xl mx-auto">
            <div className="grid md:grid-cols-3 gap-8">
              <div className="relative text-center">
                <div className="w-20 h-20 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-2xl font-bold mx-auto mb-6 shadow-lg">
                  1
                </div>
                <h3 className="text-xl font-bold mb-3">Tu suis la formation</h3>
                <p className="text-muted-foreground">On te prend par la main pour poser les fondations : comprendre Amazon FBA, choisir ta stratégie, configurer ton compte.</p>
              </div>

              <div className="relative text-center">
                <div className="w-20 h-20 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-2xl font-bold mx-auto mb-6 shadow-lg">
                  2
                </div>
                <h3 className="text-xl font-bold mb-3">Tu utilises les moniteurs</h3>
                <p className="text-muted-foreground">Tu accèdes aux alertes produits, aux moniteurs et tu apprends à filtrer, analyser et sélectionner les opportunités.</p>
              </div>

              <div className="relative text-center">
                <div className="w-20 h-20 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-2xl font-bold mx-auto mb-6 shadow-lg">
                  3
                </div>
                <h3 className="text-xl font-bold mb-3">Tu passes à l'action</h3>
                <p className="text-muted-foreground">Tu commandes chez les fournisseurs, tu organises la logistique et tu suis tes résultats avec la communauté.</p>
              </div>
            </div>

            {/* CTA milieu de page */}
            <div className="text-center mt-12">
              <Button variant="hero" size="lg" asChild>
                <Link to="/tarifs">
                  Voir la méthode + outils inclus
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Section : Programme détaillé */}
      <section id="programme" className="py-16 bg-muted/30 scroll-mt-24">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Programme détaillé de la formation Amazon FBA
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              8 modules structurés, mis à jour régulièrement en fonction de l'évolution d'Amazon.
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-6 max-w-5xl mx-auto">
            {modules.map((module) => (
              <Card key={module.number} className="group hover:shadow-xl hover:scale-[1.01] transition-all duration-300">
                <CardHeader className="pb-2">
                  <CardTitle className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center font-bold text-primary group-hover:bg-primary group-hover:text-primary-foreground transition-all">
                      {module.number}
                    </div>
                    <span className="flex-1 text-base">{module.title}</span>
                  </CardTitle>
                </CardHeader>
                <CardContent className="pl-20">
                  <p className="text-muted-foreground text-sm">{module.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Section : Trouver un produit rentable */}
      <section id="trouver-produit-rentable" className="py-16 scroll-mt-24">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-3xl md:text-4xl font-bold mb-6">
              Méthode pour trouver un produit rentable sur Amazon
            </h2>
            <div className="prose prose-lg max-w-none text-muted-foreground">
              <p className="mb-6">
                Trouver des <strong>produits rentables sur Amazon</strong> est la compétence clé d'un vendeur FBA. Voici la méthode structurée enseignée dans la formation :
              </p>

              <div className="grid md:grid-cols-2 gap-6 not-prose mb-8">
                <div className="bg-card border rounded-lg p-6">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                      <span className="font-bold text-primary">1</span>
                    </div>
                    <h3 className="font-bold">Identifier des sources</h3>
                  </div>
                  <p className="text-sm text-muted-foreground">Utiliser les moniteurs AMZing FBA, les grossistes, les promotions et les catalogues pour alimenter tes idées.</p>
                </div>

                <div className="bg-card border rounded-lg p-6">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                      <span className="font-bold text-primary">2</span>
                    </div>
                    <h3 className="font-bold">Analyser la demande</h3>
                  </div>
                  <p className="text-sm text-muted-foreground">Vérifier le BSR (Best Sellers Rank), estimer les ventes mensuelles et comprendre si le marché est actif.</p>
                </div>

                <div className="bg-card border rounded-lg p-6">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                      <span className="font-bold text-primary">3</span>
                    </div>
                    <h3 className="font-bold">Étudier la concurrence</h3>
                  </div>
                  <p className="text-sm text-muted-foreground">Compter le nombre de vendeurs FBA sur le listing, analyser leur ancienneté et leurs prix.</p>
                </div>

                <div className="bg-card border rounded-lg p-6">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                      <span className="font-bold text-primary">4</span>
                    </div>
                    <h3 className="font-bold">Calculer la rentabilité</h3>
                  </div>
                  <p className="text-sm text-muted-foreground">Intégrer tous les frais (achat, FBA, commission, expédition) et calculer le ROI avant d'acheter.</p>
                </div>
              </div>
            </div>

            {/* Lien interne */}
            <div className="p-4 bg-primary/5 border border-primary/20 rounded-lg">
              <Link to="/produits-rentables-amazon" className="inline-flex items-center gap-2 text-primary font-medium hover:underline">
                Guide complet : Comment trouver des produits rentables sur Amazon
                <ExternalLink className="w-4 h-4" />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Section : Vérifier la rentabilité */}
      <section id="verifier-rentabilite" className="py-16 bg-muted/30 scroll-mt-24">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-3xl md:text-4xl font-bold mb-6">
              Comment vérifier la rentabilité d'un produit Amazon FBA
            </h2>
            <div className="prose prose-lg max-w-none text-muted-foreground">
              <p className="mb-6">
                Avant d'acheter un produit, tu dois calculer précisément ta marge et ton ROI. Voici les éléments à prendre en compte :
              </p>
            </div>

            <div className="grid md:grid-cols-3 gap-6 mb-8">
              <Card>
                <CardContent className="pt-6">
                  <DollarSign className="w-8 h-8 text-primary mb-4" />
                  <h3 className="font-bold mb-2">Prix d'achat</h3>
                  <p className="text-sm text-muted-foreground">Coût du produit + frais de livraison jusqu'à l'entrepôt Amazon.</p>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="pt-6">
                  <Package className="w-8 h-8 text-primary mb-4" />
                  <h3 className="font-bold mb-2">Frais Amazon FBA</h3>
                  <p className="text-sm text-muted-foreground">Commission de vente (8-15%) + frais FBA (stockage + expédition).</p>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="pt-6">
                  <TrendingUp className="w-8 h-8 text-primary mb-4" />
                  <h3 className="font-bold mb-2">Marge et ROI</h3>
                  <p className="text-sm text-muted-foreground">Prix de vente - (achat + frais) = marge. ROI = marge / investissement.</p>
                </CardContent>
              </Card>
            </div>

            {/* Encadré conseil */}
            <div className="bg-card border-l-4 border-primary p-6 rounded-r-lg">
              <h3 className="font-bold text-foreground mb-2 flex items-center gap-2">
                <Zap className="w-5 h-5 text-primary" />
                Conseil AMZing FBA
              </h3>
              <p className="text-muted-foreground">
                Ne te fie pas aux premières estimations. Intègre toujours une marge de sécurité de 10-15% pour les imprévus (casse, retours, stockage prolongé). 
                Les moniteurs AMZing FBA t'affichent directement les calculs de marge et de ROI pour chaque produit identifié.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Section : Amazon Ads */}
      <section id="amazon-ads" className="py-16 scroll-mt-24">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-3xl md:text-4xl font-bold mb-6">
              Amazon Ads : bases et erreurs à éviter
            </h2>
            <div className="prose prose-lg max-w-none text-muted-foreground">
              <p className="mb-6">
                <strong>Amazon Ads</strong> (anciennement Amazon PPC) te permet de promouvoir tes produits dans les résultats de recherche. 
                C'est un levier puissant pour accélérer tes ventes, mais mal géré, il peut ruiner ta rentabilité.
              </p>
            </div>

            <div className="grid md:grid-cols-2 gap-6 mb-8">
              <Card className="border-green-500/30 bg-green-500/5">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-green-600">
                    <CheckCircle2 className="w-5 h-5" />
                    Ce que tu apprendras
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2 text-sm">
                    <li>• Types de campagnes (Sponsored Products, Brands, Display)</li>
                    <li>• Structure de campagne efficace</li>
                    <li>• Ciblage automatique vs manuel</li>
                    <li>• Analyse des rapports et optimisation</li>
                    <li>• Calcul de l'ACoS cible</li>
                  </ul>
                </CardContent>
              </Card>

              <Card className="border-destructive/30 bg-destructive/5">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-destructive">
                    <AlertTriangle className="w-5 h-5" />
                    Erreurs à éviter
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2 text-sm">
                    <li>• Lancer des pubs avant d'optimiser le listing</li>
                    <li>• Budgets trop élevés au démarrage</li>
                    <li>• Ignorer les termes de recherche non pertinents</li>
                    <li>• Ne pas suivre l'ACoS et le TACOS</li>
                    <li>• Abandonner trop vite ou persister trop longtemps</li>
                  </ul>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* Section : Erreurs des débutants */}
      <section id="erreurs-debutants" className="py-16 bg-muted/30 scroll-mt-24">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-3xl md:text-4xl font-bold mb-6">
              Les erreurs des débutants sur Amazon FBA (et comment les éviter)
            </h2>
            <p className="text-lg text-muted-foreground mb-8">
              Voici les erreurs les plus fréquentes que nous observons chez les nouveaux vendeurs Amazon FBA. La formation t'aide à les anticiper et les éviter.
            </p>

            <div className="space-y-4">
              {erreursList.map((item, index) => (
                <Card key={index} className="overflow-hidden">
                  <div className="grid md:grid-cols-2">
                    <div className="p-6 bg-destructive/5 border-r">
                      <div className="flex items-start gap-3">
                        <AlertTriangle className="w-5 h-5 text-destructive flex-shrink-0 mt-0.5" />
                        <div>
                          <p className="font-medium text-destructive">Erreur</p>
                          <p className="text-sm text-muted-foreground mt-1">{item.erreur}</p>
                        </div>
                      </div>
                    </div>
                    <div className="p-6 bg-green-500/5">
                      <div className="flex items-start gap-3">
                        <CheckCircle2 className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                        <div>
                          <p className="font-medium text-green-600">Solution</p>
                          <p className="text-sm text-muted-foreground mt-1">{item.solution}</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Section : Pourquoi AMZing FBA */}
      <section id="pourquoi-amzing" className="py-16 scroll-mt-24">
        <div className="container mx-auto px-4">
          <div className="max-w-5xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-bold mb-4">
                Pourquoi AMZing FBA est différent des autres formations Amazon FBA
              </h2>
              <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                AMZing FBA n'est pas une simple formation vidéo. C'est un écosystème complet conçu pour passer de la théorie à la pratique.
              </p>
            </div>

            <div className="overflow-x-auto mb-12">
              <table className="w-full border-collapse">
                <thead>
                  <tr>
                    <th className="text-left p-4 bg-muted/50 rounded-tl-lg font-medium">Critère</th>
                    <th className="text-left p-4 bg-muted/50 font-medium">Formation classique</th>
                    <th className="text-left p-4 bg-primary/10 rounded-tr-lg font-bold text-primary">AMZing FBA</th>
                  </tr>
                </thead>
                <tbody>
                  <tr className="border-b border-muted">
                    <td className="p-4 font-medium">Format</td>
                    <td className="p-4 text-muted-foreground">Vidéos + quelques PDFs</td>
                    <td className="p-4 bg-primary/5 font-medium">Formation + plateforme + outils + communauté</td>
                  </tr>
                  <tr className="border-b border-muted">
                    <td className="p-4 font-medium">Recherche de produits</td>
                    <td className="p-4 text-muted-foreground">À toi de te débrouiller</td>
                    <td className="p-4 bg-primary/5 font-medium">Moniteurs automatisés + alertes + catalogue</td>
                  </tr>
                  <tr className="border-b border-muted">
                    <td className="p-4 font-medium">Accompagnement</td>
                    <td className="p-4 text-muted-foreground">Groupe Facebook peu actif</td>
                    <td className="p-4 bg-primary/5 font-medium">Communauté structurée + salons + support</td>
                  </tr>
                  <tr className="border-b border-muted">
                    <td className="p-4 font-medium">Mise à jour</td>
                    <td className="p-4 text-muted-foreground">Contenu figé</td>
                    <td className="p-4 bg-primary/5 font-medium">Mises à jour régulières + nouveaux modules</td>
                  </tr>
                  <tr>
                    <td className="p-4 font-medium rounded-bl-lg">Accès</td>
                    <td className="p-4 text-muted-foreground">Paiement unique parfois &gt; 1000€</td>
                    <td className="p-4 bg-primary/5 font-medium rounded-br-lg">34,99€/mois, flexible, sans engagement</td>
                  </tr>
                </tbody>
              </table>
            </div>

            {/* Section Qui est derrière AMZing FBA */}
            <Card className="bg-gradient-to-br from-primary/5 to-secondary/5 border-primary/20">
              <CardContent className="p-8">
                <h3 className="text-2xl font-bold mb-4">Qui est derrière AMZing FBA ?</h3>
                <p className="text-muted-foreground mb-6">
                  AMZing FBA a été créé par une équipe de vendeurs Amazon expérimentés qui ont constaté un problème récurrent : 
                  les formations existantes donnent de la théorie, mais laissent les vendeurs seuls face à la partie la plus difficile : 
                  trouver des produits rentables et prendre de bonnes décisions.
                </p>
                <p className="text-muted-foreground mb-6">
                  Notre mission : fournir une infrastructure complète (formation + outils + data + communauté) pour que chaque membre puisse 
                  avancer concrètement, à son rythme, avec un vrai accompagnement.
                </p>
                <div className="flex flex-wrap gap-4">
                  <Badge variant="outline" className="px-3 py-1">
                    <Shield className="w-4 h-4 mr-2" />
                    Support réactif
                  </Badge>
                  <Badge variant="outline" className="px-3 py-1">
                    <RefreshCw className="w-4 h-4 mr-2" />
                    Mises à jour régulières
                  </Badge>
                  <Badge variant="outline" className="px-3 py-1">
                    <Smartphone className="w-4 h-4 mr-2" />
                    App iOS & Android
                  </Badge>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Section : Avis et témoignages */}
      <section id="avis-temoignages" className="py-16 bg-muted/30 scroll-mt-24">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Avis et retours sur la formation Amazon FBA AMZing FBA
            </h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Les résultats dépendent du travail fourni et des décisions de chacun. 
              AMZing FBA n'est pas une promesse d'enrichissement rapide, mais un cadre pour prendre de meilleures décisions.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto mb-12">
            {testimonials.map((testimonial, index) => (
              <Card key={index} className="group hover:shadow-xl transition-all duration-300">
                <CardContent className="pt-6">
                  <div className="flex items-center gap-4 mb-4">
                    <div className="w-12 h-12 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-xl font-bold">
                      {testimonial.initial}
                    </div>
                    <div>
                      <p className="font-bold">{testimonial.name}</p>
                      <p className="text-sm text-muted-foreground">{testimonial.context}</p>
                    </div>
                  </div>
                  <div className="flex gap-1 mb-3">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <Star key={star} className="w-4 h-4 fill-primary text-primary" />
                    ))}
                  </div>
                  <p className="text-muted-foreground italic">"{testimonial.quote}"</p>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Stats de confiance */}
          <div className="flex flex-wrap justify-center gap-8 text-center">
            <div>
              <p className="text-4xl font-bold text-primary">+280</p>
              <p className="text-sm text-muted-foreground">Membres actifs</p>
            </div>
            <div>
              <p className="text-4xl font-bold text-primary">4.8/5</p>
              <p className="text-sm text-muted-foreground">Satisfaction moyenne</p>
            </div>
            <div>
              <p className="text-4xl font-bold text-primary">127</p>
              <p className="text-sm text-muted-foreground">Avis vérifiés</p>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section id="faq" className="py-16 scroll-mt-24">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              FAQ : Questions fréquentes sur la formation Amazon FBA
            </h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Tu as des questions sur AMZing FBA, le budget nécessaire, le temps requis ou les résultats possibles ? Voici les réponses les plus demandées.
            </p>
          </div>

          <div className="max-w-3xl mx-auto">
            <Accordion type="single" collapsible className="space-y-4">
              {faqItems.map((item, index) => (
                <AccordionItem 
                  key={index} 
                  value={`item-${index}`}
                  className="border rounded-lg px-6 bg-card hover:shadow-md transition-shadow"
                >
                  <AccordionTrigger className="text-left font-semibold hover:no-underline py-4">
                    {item.question}
                  </AccordionTrigger>
                  <AccordionContent className="text-muted-foreground pb-4">
                    {item.answer}
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </div>
        </div>
      </section>

      {/* Final CTA Section */}
      <section className="py-20 bg-gradient-to-br from-primary/10 via-background to-secondary/10">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="text-3xl md:text-4xl font-bold mb-6">
              Prêt à démarrer ta formation Amazon FBA ?
            </h2>
            <p className="text-xl text-muted-foreground mb-8">
              Rejoins AMZing FBA et accède à la méthode, aux outils et à la communauté pour construire un business Amazon rentable.
            </p>

            {/* CTA bas de page */}
            <Button variant="hero" size="xl" asChild className="mb-6">
              <Link to="/tarifs">
                Rejoindre l'espace membre
                <ArrowRight className="ml-2 h-5 w-5" />
              </Link>
            </Button>

            <p className="text-sm text-muted-foreground max-w-xl mx-auto mb-8">
              À partir de 34,99€/mois. Sans engagement, annulable à tout moment.
            </p>

            {/* Liens vers tarifs et autres ressources */}
            <div className="flex flex-wrap justify-center gap-4 text-sm">
              <Link to="/tarifs" className="text-primary hover:underline flex items-center gap-1">
                Voir les tarifs <ArrowRight className="w-3 h-3" />
              </Link>
              <Link to="/faq" className="text-primary hover:underline flex items-center gap-1">
                Autres questions <ArrowRight className="w-3 h-3" />
              </Link>
              <Link to="/contact" className="text-primary hover:underline flex items-center gap-1">
                Nous contacter <ArrowRight className="w-3 h-3" />
              </Link>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Formation;
