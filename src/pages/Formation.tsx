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
  List,
  FileText,
  Truck,
  Scale,
  Search,
  Calculator,
  Settings,
  HeadphonesIcon,
  Play,
  Check,
  X,
  ChevronRight
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
  const [showStickyCta, setShowStickyCta] = useState(false);

  // Table des matières
  const tableOfContents = [
    { id: "pour-qui", label: "À qui s'adresse cette formation" },
    { id: "ce-que-tu-obtiens", label: "Ce que tu obtiens" },
    { id: "programme", label: "Programme détaillé" },
    { id: "methode", label: "La méthode AMZing FBA" },
    { id: "outils", label: "Les outils & moniteurs" },
    { id: "fournisseurs", label: "Accès fournisseurs" },
    { id: "communaute", label: "Communauté & support" },
    { id: "prix", label: "Tarifs" },
    { id: "objections", label: "Tes questions" },
    { id: "faq", label: "FAQ" },
  ];

  // Scroll spy pour la table des matières + sticky CTA
  useEffect(() => {
    const handleScroll = () => {
      const sections = tableOfContents.map(item => document.getElementById(item.id));
      const scrollPosition = window.scrollY + 150;

      // Sticky CTA after hero
      setShowStickyCta(window.scrollY > 600);

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
      title: "Débutant complet (0 expérience)",
      problems: ["Je ne sais pas par où commencer", "J'ai peur de me tromper", "Je ne connais pas les règles Amazon"],
      solution: "La formation te guide pas à pas : création de compte, choix du modèle, premiers produits, tout est structuré pour éviter les erreurs classiques."
    },
    {
      icon: TrendingUp,
      title: "Vendeur qui veut passer à Amazon",
      problems: ["J'ai déjà une boutique mais je veux un nouveau canal", "Je ne connais pas les spécificités d'Amazon", "Je veux profiter du trafic Amazon"],
      solution: "On t'aide à adapter ton catalogue, tes prix et ta logistique pour que ça reste rentable. Tu bénéficies du badge Prime et de l'audience Amazon."
    },
    {
      icon: Rocket,
      title: "Vendeur Amazon qui veut optimiser",
      problems: ["Je stagne depuis des mois", "Je perds du temps à chercher des produits", "Je doute sur mes calculs de rentabilité"],
      solution: "Les moniteurs et le catalogue fournisseurs te font gagner un temps fou. La communauté te donne des retours concrets pour améliorer tes décisions."
    }
  ];

  const modules = [
    {
      number: 1,
      title: "Comprendre Amazon FBA, règles, risques, budget",
      objective: "Maîtriser les fondamentaux avant de te lancer",
      deliverables: "Checklist pré-lancement, estimation budget initial",
      errorsAvoided: "Se lancer sans comprendre les frais cachés ou les règles Amazon",
      icon: BookOpen
    },
    {
      number: 2,
      title: "Choisir son modèle (wholesale, retail, private label)",
      objective: "Décider quel modèle correspond à ta situation",
      deliverables: "Tableau comparatif des modèles, quiz de sélection",
      errorsAvoided: "Choisir le private label sans budget ou le wholesale sans fournisseurs",
      icon: Scale
    },
    {
      number: 3,
      title: "Recherche de produits rentables (critères, concurrence, demande)",
      objective: "Identifier des opportunités avec un vrai potentiel",
      deliverables: "Template analyse produit, liste de critères",
      errorsAvoided: "Acheter un produit sans vérifier la demande ou la concurrence",
      icon: Search
    },
    {
      number: 4,
      title: "Sourcing & fournisseurs (approche, négociation, documents)",
      objective: "Trouver et sécuriser tes sources de produits",
      deliverables: "Accès catalogue fournisseurs, templates négociation",
      errorsAvoided: "Travailler avec des fournisseurs sans factures conformes",
      icon: Package
    },
    {
      number: 5,
      title: "Calculs : ROI, frais Amazon, marges, TVA",
      objective: "Savoir si un produit est vraiment rentable avant d'acheter",
      deliverables: "Calculateur ROI, template suivi marge",
      errorsAvoided: "Oublier des frais et découvrir qu'on perd de l'argent après coup",
      icon: Calculator
    },
    {
      number: 6,
      title: "Création/optimisation listing (SEO Amazon, images, titres)",
      objective: "Créer des listings qui convertissent et se positionnent",
      deliverables: "Checklist listing, exemples optimisés",
      errorsAvoided: "Créer un listing sans mots-clés ou avec des images de mauvaise qualité",
      icon: FileText
    },
    {
      number: 7,
      title: "Logistique FBA (préparation, expédition, étiquetage)",
      objective: "Envoyer tes produits à Amazon sans rejet",
      deliverables: "Guide d'expédition, checklist préparation",
      errorsAvoided: "Avoir des produits refusés ou perdus à cause d'un mauvais étiquetage",
      icon: Truck
    },
    {
      number: 8,
      title: "Lancement & premières ventes (stratégie, suivi)",
      objective: "Réussir ton lancement et générer tes premières ventes",
      deliverables: "Plan de lancement, tableau de suivi",
      errorsAvoided: "Lancer un produit sans stratégie et attendre que les ventes arrivent",
      icon: Rocket
    },
    {
      number: 9,
      title: "Publicité Amazon (bases PPC, quand l'utiliser)",
      objective: "Utiliser Amazon Ads efficacement sans gaspiller ton budget",
      deliverables: "Structure campagne type, tutoriel création",
      errorsAvoided: "Dépenser des centaines d'euros en pub sans retour",
      icon: Megaphone
    },
    {
      number: 10,
      title: "Process & scaling (tableaux de bord, réassort, multi-produits)",
      objective: "Structurer ton business pour le faire grandir",
      deliverables: "Dashboard de suivi, process réassort",
      errorsAvoided: "Rester bloqué à 2-3 produits sans pouvoir scaler",
      icon: TrendingUp
    }
  ];

  const methodSteps = [
    {
      step: 1,
      title: "Formation des bases",
      description: "Tu comprends Amazon FBA, tu crées ton compte vendeur, tu choisis ton modèle (wholesale, retail, private label)."
    },
    {
      step: 2,
      title: "Recherche produit",
      description: "Tu utilises les moniteurs AMZing FBA pour identifier des produits avec un bon ROI, tu analyses la concurrence et la demande."
    },
    {
      step: 3,
      title: "Sourcing & commande",
      description: "Tu contactes les fournisseurs du catalogue, tu négocies, tu sécurises tes premières commandes."
    },
    {
      step: 4,
      title: "Lancement & ventes",
      description: "Tu crées tes listings, tu envoies tes produits à Amazon, tu lances tes premières ventes."
    },
    {
      step: 5,
      title: "Scaling & optimisation",
      description: "Tu analyses tes résultats, tu réassorts, tu diversifies, tu utilises Amazon Ads pour accélérer."
    }
  ];

  const objections = [
    {
      objection: "Je n'ai pas le temps",
      response: "La plateforme est conçue pour te faire gagner du temps. Les moniteurs scannent les produits pour toi. Tu peux avancer à ton rythme, même 30 min/jour."
    },
    {
      objection: "J'ai peur de me tromper",
      response: "La formation structure chaque étape. La communauté te donne des retours avant d'acheter. Tu n'es plus seul face à tes décisions."
    },
    {
      objection: "Je ne sais pas quoi vendre",
      response: "Les moniteurs et le catalogue fournisseurs te proposent des idées concrètes avec les données de rentabilité. Tu ne pars jamais de zéro."
    },
    {
      objection: "C'est trop cher pour commencer",
      response: "L'abonnement annuel est accessible en plusieurs fois (~64€/mois sur 12 mois). Pour le stock, tu peux démarrer avec 500-1000€ et tester quelques produits avant de réinvestir."
    },
    {
      objection: "J'ai déjà essayé et ça n'a pas marché",
      response: "Si tu as échoué seul, c'est normal. Avec une méthode structurée, des outils et une communauté, tu prends de meilleures décisions et tu évites les erreurs classiques."
    }
  ];

  const comparisonRows = [
    { feature: "Méthode pas à pas", youtube: false, formation: "Partielle", amzing: true },
    { feature: "Moniteurs produits rentables", youtube: false, formation: false, amzing: true },
    { feature: "Catalogue fournisseurs", youtube: false, formation: false, amzing: true },
    { feature: "Communauté active", youtube: false, formation: "Parfois", amzing: true },
    { feature: "Support réactif", youtube: false, formation: "Variable", amzing: true },
    { feature: "Mises à jour régulières", youtube: false, formation: "Variable", amzing: true },
    { feature: "Tarif", youtube: "Gratuit", formation: "500-2000€", amzing: "700€/mois" },
  ];

  const faqItems = [
    {
      question: "C'est quoi Amazon FBA ? Différence FBA vs FBM ?",
      answer: "Amazon FBA (Fulfillment by Amazon) signifie qu'Amazon stocke, emballe et expédie tes produits. Tu bénéficies du badge Prime et du service client Amazon. FBM (Fulfillment by Merchant) signifie que tu gères toi-même la logistique. FBA est plus simple à gérer mais a des frais de stockage. FBM te laisse plus de contrôle mais demande plus de travail. La formation t'aide à choisir selon ta situation."
    },
    {
      question: "Est-ce adapté si je débute de zéro ?",
      answer: "Oui, la formation est conçue pour les débutants. On commence par les bases : comprendre le modèle, créer son compte, choisir sa stratégie. Chaque module est structuré pour que tu puisses avancer progressivement, sans te sentir perdu. La communauté est là pour répondre à tes questions."
    },
    {
      question: "Combien faut-il investir pour commencer ?",
      answer: "L'abonnement AMZing FBA est à 64€/mois × 12 ou 700€ TTC en une fois (-10%). Pour le stock initial, tu peux démarrer avec 500-1000€ pour tester quelques produits. L'important n'est pas d'avoir un gros budget mais de bien choisir tes produits. Les moniteurs t'aident à optimiser chaque euro investi."
    },
    {
      question: "Combien de temps pour faire ses premières ventes ?",
      answer: "Ça dépend du temps investi et des décisions prises. Certains membres font leurs premières ventes en 4-8 semaines. D'autres préfèrent prendre plus de temps pour bien se former avant de passer commande. AMZing FBA t'aide à accélérer le processus en évitant les erreurs classiques."
    },
    {
      question: "Quelle différence entre wholesale, retail et private label ?",
      answer: "Wholesale : tu achètes en gros chez des distributeurs et tu revends sur Amazon. Retail arbitrage : tu achètes des produits en promo (magasins, sites) et tu les revends. Private label : tu crées ta propre marque avec des produits fabriqués pour toi. La formation t'aide à choisir le modèle adapté à ton budget et tes objectifs."
    },
    {
      question: "Est-ce que vous donnez des produits / listings ?",
      answer: "Non, on ne donne pas de produits clé en main. Les moniteurs et le catalogue fournisseurs te proposent des opportunités avec les données de rentabilité, mais la décision finale t'appartient. On t'apprend à pêcher, on ne te donne pas le poisson. C'est ce qui te rendra autonome à long terme."
    },
    {
      question: "Comment fonctionnent vos moniteurs produits rentables ?",
      answer: "Les moniteurs scannent automatiquement des sites de grossistes, des catalogues fournisseurs et des promotions. Ils analysent le prix, la marge potentielle, la demande (BSR) et la concurrence. Tu reçois des alertes sur des opportunités filtrées selon tes critères. À toi ensuite de valider et de passer commande."
    },
    {
      question: "Est-ce qu'il y a un accompagnement/support ?",
      answer: "Oui. Tu as accès à un support client réactif par ticket, une communauté chat avec des salons thématiques (succès, ventes, questions), et des échanges réguliers avec les autres membres. Tu n'es jamais seul face à tes décisions."
    },
    {
      question: "Puis-je arrêter quand je veux ? (sans engagement)",
      answer: "Oui, l'abonnement est sans engagement. Tu peux l'annuler à tout moment depuis ton espace membre. Tant que ton abonnement est actif, tu gardes l'accès complet à la formation, aux outils et à la communauté."
    },
    {
      question: "Est-ce compatible France (TVA, factures, conformité) ?",
      answer: "Oui, la formation est adaptée aux vendeurs français. On aborde les questions de TVA, de structure juridique (micro, SASU, EURL) et de conformité des factures. Le catalogue fournisseurs inclut des fournisseurs européens avec factures conformes."
    },
    {
      question: "Est-ce une formation CPF ?",
      answer: "Non, AMZing FBA n'est pas éligible au CPF. L'abonnement est à 700€/mois TTC ou payable en 12 fois (~64€/mois), ce qui te permet d'étaler le coût."
    },
    {
      question: "Pourquoi vous plutôt qu'une formation classique ?",
      answer: "Les formations classiques coûtent souvent 500-2000€ et te donnent des vidéos sans outils concrets. AMZing FBA combine une méthode structurée + des moniteurs automatisés + un catalogue fournisseurs + une communauté active. Tu as tout ce qu'il faut pour passer de la théorie à l'action, pour 64€/mois × 12 ou 700€ TTC (-10%)."
    },
    {
      question: "Amazon FBA est-il toujours rentable en 2026 ?",
      answer: "Oui, mais il faut être plus structuré qu'avant. La concurrence a augmenté, donc la recherche produit et l'analyse des données sont cruciales. C'est exactement ce que les moniteurs et la méthode AMZing FBA te permettent de faire."
    },
    {
      question: "Combien de temps dois-je consacrer par semaine ?",
      answer: "Tu peux avancer avec 3-5h par semaine minimum. La formation est accessible à ton rythme. Les moniteurs te font gagner du temps en scannant les opportunités pour toi. Plus tu y consacres de temps, plus tu avances vite, mais ce n'est pas un full-time obligatoire."
    }
  ];

  // Combine schemas for rich results
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

  const combinedSchema = [
    schemas.course,
    faqSchema,
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

      {/* Sticky CTA - Desktop */}
      <div className={`hidden lg:block fixed right-6 top-1/2 -translate-y-1/2 z-40 transition-all duration-300 ${showStickyCta ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-10'}`}>
        <div className="bg-card border rounded-xl shadow-xl p-4 space-y-3 max-w-[200px]">
          <p className="text-sm font-semibold text-center">Formation + Outils</p>
          <p className="text-2xl font-bold text-center text-primary">700€<span className="text-sm font-normal text-muted-foreground">/mois</span></p>
          <Button variant="hero" size="sm" asChild className="w-full">
            <Link to="/tarifs">
              Accéder <ArrowRight className="ml-1 h-4 w-4" />
            </Link>
          </Button>
          <p className="text-xs text-muted-foreground text-center">Accès 12 mois</p>
        </div>
      </div>

      {/* Sticky CTA - Mobile */}
      <div className={`lg:hidden fixed bottom-0 left-0 right-0 z-50 bg-background/95 backdrop-blur-sm border-t shadow-lg p-4 transition-all duration-300 ${showStickyCta ? 'translate-y-0' : 'translate-y-full'}`}>
        <div className="flex items-center justify-between gap-4 max-w-lg mx-auto">
          <div>
            <p className="font-semibold">700€/mois TTC</p>
            <p className="text-xs text-muted-foreground">ou ~64€/mois × 12</p>
          </div>
          <Button variant="hero" asChild>
            <Link to="/tarifs">
              Accéder à la plateforme <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </Button>
        </div>
      </div>

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
      <nav className="container mx-auto px-4 pt-24 pb-4" aria-label="Breadcrumb">
        <ol className="flex items-center gap-2 text-sm text-muted-foreground">
          <li><Link to="/" className="hover:text-primary transition-colors">Accueil</Link></li>
          <li><span>/</span></li>
          <li><span className="text-foreground" aria-current="page">Formation Amazon FBA</span></li>
        </ol>
      </nav>
      
      {/* Hero Section */}
      <header className="pt-4 pb-16 relative overflow-hidden">
        {/* Background decorations */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-20 left-10 w-64 h-64 bg-primary/10 rounded-full blur-3xl"></div>
          <div className="absolute bottom-20 right-20 w-96 h-96 bg-secondary/10 rounded-full blur-3xl"></div>
        </div>

        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-4xl mx-auto text-center">
            <Badge className="mb-6 bg-primary/10 text-primary border-primary/20 text-sm px-4 py-1">
              Formation Amazon FBA + Plateforme complète 2026
            </Badge>
            
            {/* H1 SEO optimisé - unique sur la page */}
            <h1 className="text-3xl md:text-5xl lg:text-6xl font-bold mb-6 leading-tight">
              Formation Amazon FBA : la méthode complète + outils pour{" "}
              <span className="text-primary">lancer et scaler</span>
            </h1>
            
            {/* Intro optimisée SEO */}
            <div className="text-lg md:text-xl text-muted-foreground mb-6 max-w-3xl mx-auto space-y-4">
              <p>
                <strong>Amazon FBA</strong> (Fulfillment by Amazon) te permet de vendre sur Amazon sans gérer la logistique. 
                Tu envoies tes produits dans les entrepôts Amazon, et Amazon s'occupe du stockage, de l'expédition et du service client.
                <strong> FBM</strong> (Fulfillment by Merchant), c'est quand tu gères toi-même l'expédition.
              </p>
              <p>
                <strong>AMZing FBA</strong> est une plateforme tout-en-un : <strong>formation</strong> pas à pas + <strong>moniteurs de produits rentables</strong> + catalogue fournisseurs + communauté active.
                On t'apprend, on t'accompagne, et on te donne les outils pour passer à l'action.
              </p>
            </div>

            {/* Promesse réaliste */}
            <div className="bg-card border rounded-lg p-4 mb-8 max-w-2xl mx-auto text-left">
              <p className="text-sm text-muted-foreground">
                <strong className="text-foreground">Notre promesse :</strong> une méthode claire pour <em>apprendre</em>, des outils concrets pour <em>appliquer</em>, et une communauté pour <em>être accompagné</em>. 
                Pas de promesses irréalistes. Les résultats dépendent de ton travail, ton budget et le marché.
              </p>
            </div>

            {/* CTA haut de page */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center mb-8">
              <Button variant="hero" size="xl" asChild>
                <Link to="/tarifs">
                  Accéder à la plateforme (700€/mois)
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
                <RefreshCw className="w-4 h-4 text-primary" />
                <span>Sans engagement</span>
              </div>
              <div className="flex items-center gap-2">
                <Smartphone className="w-4 h-4 text-primary" />
                <span>App iOS & Android</span>
              </div>
              <div className="flex items-center gap-2">
                <Bell className="w-4 h-4 text-primary" />
                <span>Alertes produits</span>
              </div>
              <div className="flex items-center gap-2">
                <Users className="w-4 h-4 text-primary" />
                <span>Communauté active</span>
              </div>
            </div>
          </div>
        </div>
      </header>

      <main>
        {/* Table des matières mobile */}
        <section className="xl:hidden py-6 bg-muted/30">
          <div className="container mx-auto px-4">
            <div className="bg-card border rounded-lg p-4">
              <div className="flex items-center gap-2 mb-3 pb-2 border-b">
                <List className="w-4 h-4 text-primary" />
                <span className="font-semibold text-sm">Sommaire</span>
              </div>
              <div className="grid grid-cols-2 gap-2">
                {tableOfContents.map((item) => (
                  <button
                    key={item.id}
                    onClick={() => scrollToSection(item.id)}
                    className="text-left text-xs py-2 px-3 rounded transition-colors hover:bg-muted text-muted-foreground"
                  >
                    {item.label}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* Section : À qui s'adresse cette formation */}
        <section id="pour-qui" className="py-16 scroll-mt-24">
          <div className="container mx-auto px-4">
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-bold mb-4">
                À qui s'adresse cette formation Amazon FBA ?
              </h2>
              <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                Que tu démarres de zéro ou que tu veuilles passer un cap, AMZing FBA s'adapte à ton profil.
              </p>
            </div>

            <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
              {personas.map((persona, index) => (
                <Card key={index} className="group hover:shadow-xl hover:scale-[1.02] transition-all duration-300 border-2 hover:border-primary/30">
                  <CardHeader className="text-center pb-2">
                    <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-4 group-hover:bg-primary/20 transition-colors">
                      <persona.icon className="w-8 h-8 text-primary" />
                    </div>
                    <CardTitle className="text-lg">{persona.title}</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div>
                      <p className="text-xs font-medium text-muted-foreground mb-2">Problèmes typiques :</p>
                      <ul className="space-y-1">
                        {persona.problems.map((problem, i) => (
                          <li key={i} className="text-sm text-muted-foreground flex items-start gap-2">
                            <span className="text-destructive">•</span>
                            {problem}
                          </li>
                        ))}
                      </ul>
                    </div>
                    <div className="pt-3 border-t">
                      <p className="text-sm">{persona.solution}</p>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* Section : Ce que tu obtiens */}
        <section id="ce-que-tu-obtiens" className="py-16 bg-muted/30 scroll-mt-24">
          <div className="container mx-auto px-4">
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-bold mb-4">
                Ce que tu obtiens avec AMZing FBA
              </h2>
              <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                Pas juste des vidéos : un écosystème complet pour passer de la théorie à l'action.
              </p>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto mb-12">
              <Card className="group hover:shadow-xl transition-all duration-300">
                <CardContent className="pt-6">
                  <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4 group-hover:bg-primary group-hover:text-primary-foreground transition-all">
                    <GraduationCap className="w-6 h-6 text-primary group-hover:text-primary-foreground" />
                  </div>
                  <h3 className="font-bold text-lg mb-2">Formation pas à pas</h3>
                  <p className="text-muted-foreground text-sm mb-3">De la création de compte vendeur aux premières ventes, en passant par le sourcing et le scaling. 10 modules structurés.</p>
                  <ul className="text-xs text-muted-foreground space-y-1">
                    <li className="flex items-center gap-2"><CheckCircle2 className="w-3 h-3 text-primary" /> Vidéos + guides écrits</li>
                    <li className="flex items-center gap-2"><CheckCircle2 className="w-3 h-3 text-primary" /> Templates et checklists</li>
                    <li className="flex items-center gap-2"><CheckCircle2 className="w-3 h-3 text-primary" /> Mises à jour régulières</li>
                  </ul>
                </CardContent>
              </Card>

              <Card className="group hover:shadow-xl transition-all duration-300">
                <CardContent className="pt-6">
                  <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4 group-hover:bg-primary group-hover:text-primary-foreground transition-all">
                    <Bell className="w-6 h-6 text-primary group-hover:text-primary-foreground" />
                  </div>
                  <h3 className="font-bold text-lg mb-2">Moniteurs produits rentables</h3>
                  <p className="text-muted-foreground text-sm mb-3">Des outils automatisés qui scannent des sites et grossistes pour identifier des opportunités avec un bon ROI.</p>
                  <ul className="text-xs text-muted-foreground space-y-1">
                    <li className="flex items-center gap-2"><CheckCircle2 className="w-3 h-3 text-primary" /> Alertes temps réel</li>
                    <li className="flex items-center gap-2"><CheckCircle2 className="w-3 h-3 text-primary" /> Calcul ROI automatique</li>
                    <li className="flex items-center gap-2"><CheckCircle2 className="w-3 h-3 text-primary" /> Filtrage par critères</li>
                  </ul>
                </CardContent>
              </Card>

              <Card className="group hover:shadow-xl transition-all duration-300">
                <CardContent className="pt-6">
                  <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4 group-hover:bg-primary group-hover:text-primary-foreground transition-all">
                    <Database className="w-6 h-6 text-primary group-hover:text-primary-foreground" />
                  </div>
                  <h3 className="font-bold text-lg mb-2">Catalogue fournisseurs</h3>
                  <p className="text-muted-foreground text-sm mb-3">Accès à des pistes fournisseurs vérifiés (grossistes, marques) pour ne pas partir de zéro dans ton sourcing.</p>
                  <ul className="text-xs text-muted-foreground space-y-1">
                    <li className="flex items-center gap-2"><CheckCircle2 className="w-3 h-3 text-primary" /> Fournisseurs Europe</li>
                    <li className="flex items-center gap-2"><CheckCircle2 className="w-3 h-3 text-primary" /> Factures conformes</li>
                    <li className="flex items-center gap-2"><CheckCircle2 className="w-3 h-3 text-primary" /> Catégories variées</li>
                  </ul>
                </CardContent>
              </Card>

              <Card className="group hover:shadow-xl transition-all duration-300">
                <CardContent className="pt-6">
                  <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4 group-hover:bg-primary group-hover:text-primary-foreground transition-all">
                    <Users className="w-6 h-6 text-primary group-hover:text-primary-foreground" />
                  </div>
                  <h3 className="font-bold text-lg mb-2">Communauté active</h3>
                  <p className="text-muted-foreground text-sm mb-3">Chat en direct, salons thématiques (succès, ventes, questions), retours sur tes listings et produits.</p>
                  <ul className="text-xs text-muted-foreground space-y-1">
                    <li className="flex items-center gap-2"><CheckCircle2 className="w-3 h-3 text-primary" /> Échanges en temps réel</li>
                    <li className="flex items-center gap-2"><CheckCircle2 className="w-3 h-3 text-primary" /> Partages de résultats</li>
                    <li className="flex items-center gap-2"><CheckCircle2 className="w-3 h-3 text-primary" /> Feedback sur tes choix</li>
                  </ul>
                </CardContent>
              </Card>

              <Card className="group hover:shadow-xl transition-all duration-300">
                <CardContent className="pt-6">
                  <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4 group-hover:bg-primary group-hover:text-primary-foreground transition-all">
                    <HeadphonesIcon className="w-6 h-6 text-primary group-hover:text-primary-foreground" />
                  </div>
                  <h3 className="font-bold text-lg mb-2">Support réactif</h3>
                  <p className="text-muted-foreground text-sm mb-3">Un support client disponible pour répondre à tes questions techniques, pratiques ou stratégiques.</p>
                  <ul className="text-xs text-muted-foreground space-y-1">
                    <li className="flex items-center gap-2"><CheckCircle2 className="w-3 h-3 text-primary" /> Tickets support</li>
                    <li className="flex items-center gap-2"><CheckCircle2 className="w-3 h-3 text-primary" /> Réponses rapides</li>
                    <li className="flex items-center gap-2"><CheckCircle2 className="w-3 h-3 text-primary" /> Aide personnalisée</li>
                  </ul>
                </CardContent>
              </Card>

              <Card className="group hover:shadow-xl transition-all duration-300">
                <CardContent className="pt-6">
                  <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4 group-hover:bg-primary group-hover:text-primary-foreground transition-all">
                    <FileText className="w-6 h-6 text-primary group-hover:text-primary-foreground" />
                  </div>
                  <h3 className="font-bold text-lg mb-2">Templates & checklists</h3>
                  <p className="text-muted-foreground text-sm mb-3">Calculateur ROI, template analyse produit, checklist listing, guide d'expédition et plus encore.</p>
                  <ul className="text-xs text-muted-foreground space-y-1">
                    <li className="flex items-center gap-2"><CheckCircle2 className="w-3 h-3 text-primary" /> Prêts à l'emploi</li>
                    <li className="flex items-center gap-2"><CheckCircle2 className="w-3 h-3 text-primary" /> Format téléchargeable</li>
                    <li className="flex items-center gap-2"><CheckCircle2 className="w-3 h-3 text-primary" /> Mis à jour</li>
                  </ul>
                </CardContent>
              </Card>
            </div>

            {/* Résumé en 30 secondes */}
            <div className="max-w-3xl mx-auto bg-card border-2 border-primary/30 rounded-xl p-6">
              <h3 className="font-bold text-lg mb-4 flex items-center gap-2">
                <Clock className="w-5 h-5 text-primary" />
                En résumé (30 secondes)
              </h3>
              <div className="grid sm:grid-cols-2 gap-4">
                <div className="flex items-start gap-3">
                  <CheckCircle2 className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
                  <span className="text-sm">Formation complète de A à Z (10 modules)</span>
                </div>
                <div className="flex items-start gap-3">
                  <CheckCircle2 className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
                  <span className="text-sm">Moniteurs qui scannent des produits pour toi</span>
                </div>
                <div className="flex items-start gap-3">
                  <CheckCircle2 className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
                  <span className="text-sm">Catalogue fournisseurs avec factures conformes</span>
                </div>
                <div className="flex items-start gap-3">
                  <CheckCircle2 className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
                  <span className="text-sm">Communauté active + support réactif</span>
                </div>
                <div className="flex items-start gap-3">
                  <CheckCircle2 className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
                  <span className="text-sm">700€/mois TTC, accès 12 mois</span>
                </div>
                <div className="flex items-start gap-3">
                  <CheckCircle2 className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
                  <span className="text-sm">App iOS & Android</span>
                </div>
              </div>
            </div>

            {/* Liens internes */}
            <div className="text-center mt-8">
              <Link to="/outil-amazon-fba" className="inline-flex items-center gap-2 text-primary font-medium hover:underline">
                Découvre les outils Amazon FBA en détail
                <ExternalLink className="w-4 h-4" />
              </Link>
            </div>
          </div>
        </section>

        {/* Section : Programme détaillé */}
        <section id="programme" className="py-16 scroll-mt-24">
          <div className="container mx-auto px-4">
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-bold mb-4">
                Programme de la formation (système A à Z)
              </h2>
              <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                10 modules structurés pour passer de débutant à vendeur actif. Mises à jour régulières.
              </p>
            </div>

            <div className="max-w-4xl mx-auto">
              <Accordion type="single" collapsible className="space-y-4">
                {modules.map((module) => (
                  <AccordionItem key={module.number} value={`module-${module.number}`} className="bg-card border rounded-lg px-6">
                    <AccordionTrigger className="hover:no-underline py-4">
                      <div className="flex items-center gap-4 text-left">
                        <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center font-bold text-primary flex-shrink-0">
                          {module.number}
                        </div>
                        <span className="font-semibold">{module.title}</span>
                      </div>
                    </AccordionTrigger>
                    <AccordionContent className="pl-14 pb-4">
                      <div className="space-y-3">
                        <div className="flex items-start gap-2">
                          <Target className="w-4 h-4 text-primary flex-shrink-0 mt-0.5" />
                          <div>
                            <span className="text-xs font-medium text-muted-foreground">Objectif :</span>
                            <p className="text-sm">{module.objective}</p>
                          </div>
                        </div>
                        <div className="flex items-start gap-2">
                          <FileText className="w-4 h-4 text-primary flex-shrink-0 mt-0.5" />
                          <div>
                            <span className="text-xs font-medium text-muted-foreground">Livrables/outils :</span>
                            <p className="text-sm">{module.deliverables}</p>
                          </div>
                        </div>
                        <div className="flex items-start gap-2">
                          <AlertTriangle className="w-4 h-4 text-amber-500 flex-shrink-0 mt-0.5" />
                          <div>
                            <span className="text-xs font-medium text-muted-foreground">Erreur évitée :</span>
                            <p className="text-sm">{module.errorsAvoided}</p>
                          </div>
                        </div>
                      </div>
                    </AccordionContent>
                  </AccordionItem>
                ))}
              </Accordion>
            </div>

            {/* CTA milieu de page */}
            <div className="text-center mt-12">
              <Button variant="hero" size="lg" asChild>
                <Link to="/tarifs">
                  Accéder au programme complet
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Link>
              </Button>
            </div>
          </div>
        </section>

        {/* Section : La méthode */}
        <section id="methode" className="py-16 bg-muted/30 scroll-mt-24">
          <div className="container mx-auto px-4">
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-bold mb-4">
                La méthode AMZing FBA (simple, concrète)
              </h2>
              <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                De zéro à tes premières ventes, puis au scaling. Voici le process en 5 étapes.
              </p>
            </div>

            {/* Timeline visuelle */}
            <div className="max-w-5xl mx-auto mb-12">
              <div className="relative">
                {/* Ligne de connexion - desktop */}
                <div className="hidden md:block absolute top-12 left-0 right-0 h-1 bg-primary/20"></div>
                
                <div className="grid md:grid-cols-5 gap-6">
                  {methodSteps.map((step, index) => (
                    <div key={step.step} className="relative text-center">
                      <div className="w-16 h-16 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-xl font-bold mx-auto mb-4 shadow-lg relative z-10">
                        {step.step}
                      </div>
                      <h3 className="font-bold mb-2">{step.title}</h3>
                      <p className="text-sm text-muted-foreground">{step.description}</p>
                      {index < methodSteps.length - 1 && (
                        <ChevronRight className="hidden md:block absolute top-10 -right-3 w-6 h-6 text-primary z-20" />
                      )}
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Disclaimer */}
            <div className="max-w-3xl mx-auto bg-amber-500/10 border border-amber-500/30 rounded-lg p-4">
              <p className="text-sm text-center">
                <AlertTriangle className="w-4 h-4 inline mr-2 text-amber-500" />
                <strong>Disclaimer :</strong> Les résultats dépendent de ton travail, de ton budget et des conditions de marché. 
                AMZing FBA te donne la méthode et les outils, mais le succès n'est pas garanti. C'est un vrai business qui demande du temps et de l'investissement.
              </p>
            </div>

            {/* Lien interne */}
            <div className="text-center mt-8">
              <Link to="/amazon-fba-debutant" className="inline-flex items-center gap-2 text-primary font-medium hover:underline">
                Lire le guide complet : Amazon FBA pour débutant
                <ExternalLink className="w-4 h-4" />
              </Link>
            </div>
          </div>
        </section>

        {/* Section : Les outils */}
        <section id="outils" className="py-16 scroll-mt-24">
          <div className="container mx-auto px-4">
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-bold mb-4">
                Les outils : moniteurs produits rentables & suivi
              </h2>
              <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                Les moniteurs AMZing FBA scannent automatiquement des sources pour identifier des opportunités.
              </p>
            </div>

            <div className="max-w-4xl mx-auto">
              <div className="grid md:grid-cols-2 gap-8 mb-12">
                <div>
                  <h3 className="font-bold text-xl mb-4">Ce que font les moniteurs</h3>
                  <ul className="space-y-3">
                    <li className="flex items-start gap-3">
                      <CheckCircle2 className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
                      <span>Scannent des sites de grossistes et catalogues fournisseurs</span>
                    </li>
                    <li className="flex items-start gap-3">
                      <CheckCircle2 className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
                      <span>Calculent automatiquement la marge et le ROI potentiel</span>
                    </li>
                    <li className="flex items-start gap-3">
                      <CheckCircle2 className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
                      <span>Analysent la demande (BSR) et la concurrence</span>
                    </li>
                    <li className="flex items-start gap-3">
                      <CheckCircle2 className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
                      <span>T'envoient des alertes sur les opportunités intéressantes</span>
                    </li>
                    <li className="flex items-start gap-3">
                      <CheckCircle2 className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
                      <span>Te permettent de filtrer selon tes critères (ROI, catégorie...)</span>
                    </li>
                  </ul>
                </div>
                <div>
                  <h3 className="font-bold text-xl mb-4">Ton workflow chaque semaine</h3>
                  <div className="space-y-4">
                    <div className="flex items-start gap-3 bg-card border rounded-lg p-4">
                      <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0 font-bold text-primary">1</div>
                      <div>
                        <p className="font-medium">Tu consultes les alertes produits</p>
                        <p className="text-sm text-muted-foreground">Les moniteurs t'ont identifié X opportunités avec les données.</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-3 bg-card border rounded-lg p-4">
                      <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0 font-bold text-primary">2</div>
                      <div>
                        <p className="font-medium">Tu vérifies les critères</p>
                        <p className="text-sm text-muted-foreground">ROI, BSR, concurrence, conformité. Tu valides ou tu passes.</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-3 bg-card border rounded-lg p-4">
                      <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0 font-bold text-primary">3</div>
                      <div>
                        <p className="font-medium">Tu achètes / tu listes</p>
                        <p className="text-sm text-muted-foreground">Tu passes commande chez le fournisseur et tu prépares ton envoi FBA.</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-3 bg-card border rounded-lg p-4">
                      <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0 font-bold text-primary">4</div>
                      <div>
                        <p className="font-medium">Tu suis tes KPI</p>
                        <p className="text-sm text-muted-foreground">Ventes, marge réelle, réassort. Tu ajustes et tu scales.</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Lien interne */}
              <div className="text-center">
                <Link to="/produits-rentables-amazon" className="inline-flex items-center gap-2 text-primary font-medium hover:underline">
                  Comment trouver des produits rentables sur Amazon
                  <ExternalLink className="w-4 h-4" />
                </Link>
              </div>
            </div>
          </div>
        </section>

        {/* Section : Fournisseurs */}
        <section id="fournisseurs" className="py-16 bg-muted/30 scroll-mt-24">
          <div className="container mx-auto px-4">
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-bold mb-4">
                Accès fournisseurs & sourcing (ce que ça change)
              </h2>
              <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                Le catalogue fournisseurs te donne des pistes concrètes pour ne pas partir de zéro.
              </p>
            </div>

            <div className="max-w-4xl mx-auto">
              <div className="grid md:grid-cols-2 gap-8 mb-12">
                <div>
                  <h3 className="font-bold text-xl mb-4">Types de fournisseurs</h3>
                  <ul className="space-y-3">
                    <li className="flex items-start gap-3">
                      <Package className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
                      <div>
                        <p className="font-medium">Grossistes européens</p>
                        <p className="text-sm text-muted-foreground">Factures conformes, livraison rapide, TVA récupérable.</p>
                      </div>
                    </li>
                    <li className="flex items-start gap-3">
                      <Package className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
                      <div>
                        <p className="font-medium">Distributeurs officiels</p>
                        <p className="text-sm text-muted-foreground">Produits de marque avec autorisation de vente.</p>
                      </div>
                    </li>
                    <li className="flex items-start gap-3">
                      <Package className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
                      <div>
                        <p className="font-medium">Plateformes B2B</p>
                        <p className="text-sm text-muted-foreground">Catalogues larges avec des opportunités variées.</p>
                      </div>
                    </li>
                  </ul>
                </div>
                <div>
                  <h3 className="font-bold text-xl mb-4">Comment tu les utilises</h3>
                  <ul className="space-y-3">
                    <li className="flex items-start gap-3">
                      <CheckCircle2 className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
                      <span>Tu accèdes au catalogue dans ton espace membre</span>
                    </li>
                    <li className="flex items-start gap-3">
                      <CheckCircle2 className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
                      <span>Tu filtres par catégorie, minimum de commande, zone</span>
                    </li>
                    <li className="flex items-start gap-3">
                      <CheckCircle2 className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
                      <span>Tu contactes les fournisseurs avec les templates fournis</span>
                    </li>
                    <li className="flex items-start gap-3">
                      <CheckCircle2 className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
                      <span>Tu vérifies la conformité des factures avant d'acheter</span>
                    </li>
                  </ul>
                </div>
              </div>

              {/* Mini FAQ fournisseurs */}
              <div className="bg-card border rounded-lg p-6">
                <h3 className="font-bold text-lg mb-4 flex items-center gap-2">
                  <HelpCircle className="w-5 h-5 text-primary" />
                  Questions fréquentes sur le sourcing
                </h3>
                <div className="space-y-4">
                  <div>
                    <p className="font-medium">Est-ce légal d'acheter chez des grossistes et revendre sur Amazon ?</p>
                    <p className="text-sm text-muted-foreground mt-1">Oui, c'est le modèle wholesale classique. Tu achètes des produits légitimes avec une facture conforme et tu les revends. C'est parfaitement légal tant que tu respectes les règles Amazon et que tu as les documents nécessaires.</p>
                  </div>
                  <div>
                    <p className="font-medium">Comment être sûr que les factures sont conformes ?</p>
                    <p className="text-sm text-muted-foreground mt-1">La formation t'apprend à vérifier les éléments obligatoires (mentions légales, TVA, identité du fournisseur). Les fournisseurs du catalogue ont été vérifiés pour fournir des factures exploitables.</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Section : Communauté & support */}
        <section id="communaute" className="py-16 scroll-mt-24">
          <div className="container mx-auto px-4">
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-bold mb-4">
                Communauté & support
              </h2>
              <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                Tu n'es jamais seul face à tes décisions. La communauté et le support sont là pour t'aider.
              </p>
            </div>

            <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
              <Card>
                <CardHeader>
                  <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4">
                    <MessageSquare className="w-6 h-6 text-primary" />
                  </div>
                  <CardTitle>Communauté</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <p className="text-muted-foreground text-sm">Chat en direct avec les autres membres pour échanger, poser des questions et partager tes avancées.</p>
                  <ul className="text-sm space-y-2">
                    <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-primary" /> Salons thématiques (succès, ventes, questions)</li>
                    <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-primary" /> Retours sur tes listings et produits</li>
                    <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-primary" /> Partage des erreurs et apprentissages</li>
                    <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-primary" /> Entraide entre vendeurs</li>
                  </ul>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4">
                    <HeadphonesIcon className="w-6 h-6 text-primary" />
                  </div>
                  <CardTitle>Support</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <p className="text-muted-foreground text-sm">Un support dédié pour répondre à tes questions techniques, pratiques ou stratégiques.</p>
                  <ul className="text-sm space-y-2">
                    <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-primary" /> Système de tickets dans l'app</li>
                    <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-primary" /> Réponses rapides</li>
                    <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-primary" /> Aide personnalisée</li>
                    <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-primary" /> Escalade si besoin</li>
                  </ul>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>

        {/* Section : Tarifs */}
        <section id="prix" className="py-16 bg-muted/30 scroll-mt-24">
          <div className="container mx-auto px-4">
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-bold mb-4">
                Tarifs
              </h2>
              <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                Un abonnement simple, sans engagement, qui inclut tout.
              </p>
            </div>

            <div className="max-w-lg mx-auto">
              <Card className="border-2 border-primary shadow-xl">
                <CardHeader className="text-center pb-2">
                  <Badge className="mb-4 mx-auto bg-primary/10 text-primary border-primary/20">
                    Tout inclus
                  </Badge>
                  <CardTitle className="text-3xl">AMZing FBA VIP</CardTitle>
                  <div className="mt-4">
                    <span className="text-5xl font-bold">700€</span>
                    <span className="text-muted-foreground">/mois TTC</span>
                  </div>
                  <p className="text-sm text-muted-foreground mt-2">ou ~64€/mois × 12 • Accès annuel</p>
                </CardHeader>
                <CardContent className="space-y-6">
                  <ul className="space-y-3">
                    <li className="flex items-center gap-3">
                      <CheckCircle2 className="w-5 h-5 text-primary flex-shrink-0" />
                      <span>Formation complète (10 modules)</span>
                    </li>
                    <li className="flex items-center gap-3">
                      <CheckCircle2 className="w-5 h-5 text-primary flex-shrink-0" />
                      <span>Moniteurs produits rentables</span>
                    </li>
                    <li className="flex items-center gap-3">
                      <CheckCircle2 className="w-5 h-5 text-primary flex-shrink-0" />
                      <span>Catalogue fournisseurs</span>
                    </li>
                    <li className="flex items-center gap-3">
                      <CheckCircle2 className="w-5 h-5 text-primary flex-shrink-0" />
                      <span>Communauté active + chat</span>
                    </li>
                    <li className="flex items-center gap-3">
                      <CheckCircle2 className="w-5 h-5 text-primary flex-shrink-0" />
                      <span>Support réactif</span>
                    </li>
                    <li className="flex items-center gap-3">
                      <CheckCircle2 className="w-5 h-5 text-primary flex-shrink-0" />
                      <span>App iOS & Android</span>
                    </li>
                    <li className="flex items-center gap-3">
                      <CheckCircle2 className="w-5 h-5 text-primary flex-shrink-0" />
                      <span>Mises à jour régulières</span>
                    </li>
                  </ul>

                  <Button variant="hero" size="xl" asChild className="w-full">
                    <Link to="/tarifs">
                      Voir les détails des tarifs
                      <ArrowRight className="ml-2 h-5 w-5" />
                    </Link>
                  </Button>
                </CardContent>
              </Card>

              {/* Encadré budget */}
              <div className="mt-6 bg-card border rounded-lg p-4 text-center">
                <p className="text-sm text-muted-foreground">
                  <DollarSign className="w-4 h-4 inline mr-1 text-primary" />
                  <strong>Pour démarrer</strong>, prévois aussi un budget stock (500-1000€ minimum pour tester). 
                  L'abonnement te donne les outils et la méthode, mais le stock est ton investissement.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Section : Tableau comparatif */}
        <section className="py-16 scroll-mt-24">
          <div className="container mx-auto px-4">
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-bold mb-4">
                Pourquoi AMZing FBA plutôt qu'autre chose ?
              </h2>
              <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                Comparaison objective avec les autres options disponibles.
              </p>
            </div>

            <div className="max-w-4xl mx-auto overflow-x-auto">
              <table className="w-full border-collapse bg-card rounded-lg overflow-hidden">
                <thead>
                  <tr className="border-b">
                    <th className="text-left p-4 font-semibold">Critère</th>
                    <th className="text-center p-4 font-semibold">YouTube / Gratuit</th>
                    <th className="text-center p-4 font-semibold">Formation classique</th>
                    <th className="text-center p-4 font-semibold bg-primary/5 border-x-2 border-primary/20">AMZing FBA</th>
                  </tr>
                </thead>
                <tbody>
                  {comparisonRows.map((row, index) => (
                    <tr key={index} className="border-b last:border-b-0">
                      <td className="p-4 font-medium">{row.feature}</td>
                      <td className="text-center p-4">
                        {row.youtube === false ? (
                          <X className="w-5 h-5 text-destructive mx-auto" />
                        ) : row.youtube === true ? (
                          <Check className="w-5 h-5 text-primary mx-auto" />
                        ) : (
                          <span className="text-muted-foreground text-sm">{row.youtube}</span>
                        )}
                      </td>
                      <td className="text-center p-4">
                        {row.formation === false ? (
                          <X className="w-5 h-5 text-destructive mx-auto" />
                        ) : row.formation === true ? (
                          <Check className="w-5 h-5 text-primary mx-auto" />
                        ) : (
                          <span className="text-muted-foreground text-sm">{row.formation}</span>
                        )}
                      </td>
                      <td className="text-center p-4 bg-primary/5 border-x-2 border-primary/20">
                        {row.amzing === false ? (
                          <X className="w-5 h-5 text-destructive mx-auto" />
                        ) : row.amzing === true ? (
                          <Check className="w-5 h-5 text-primary mx-auto" />
                        ) : (
                          <span className="font-semibold text-primary">{row.amzing}</span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </section>

        {/* Section : Objections */}
        <section id="objections" className="py-16 bg-muted/30 scroll-mt-24">
          <div className="container mx-auto px-4">
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-bold mb-4">
                Tu hésites encore ? Voici les réponses à tes doutes
              </h2>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
              {objections.map((item, index) => (
                <Card key={index} className="hover:shadow-lg transition-shadow">
                  <CardHeader className="pb-2">
                    <CardTitle className="text-lg flex items-start gap-2">
                      <HelpCircle className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
                      "{item.objection}"
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-muted-foreground">{item.response}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* Section : FAQ */}
        <section id="faq" className="py-16 scroll-mt-24">
          <div className="container mx-auto px-4">
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-bold mb-4">
                FAQ – Formation Amazon FBA
              </h2>
              <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                Les réponses aux questions les plus fréquentes sur AMZing FBA.
              </p>
            </div>

            <div className="max-w-4xl mx-auto">
              <Accordion type="single" collapsible className="space-y-4">
                {faqItems.map((item, index) => (
                  <AccordionItem key={index} value={`faq-${index}`} className="bg-card border rounded-lg px-6">
                    <AccordionTrigger className="hover:no-underline py-4 text-left">
                      <span className="font-semibold">{item.question}</span>
                    </AccordionTrigger>
                    <AccordionContent className="pb-4 text-muted-foreground">
                      {item.answer}
                    </AccordionContent>
                  </AccordionItem>
                ))}
              </Accordion>
            </div>

            {/* CTA final */}
            <div className="text-center mt-12">
              <Button variant="hero" size="xl" asChild>
                <Link to="/tarifs">
                  Accéder à la plateforme (700€/mois)
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Link>
              </Button>
              <p className="text-sm text-muted-foreground mt-4">Accès annuel (12 mois)</p>
            </div>
          </div>
        </section>

        {/* Liens internes finaux */}
        <section className="py-12 bg-muted/30">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto">
              <h3 className="font-bold text-lg mb-6 text-center">Pour aller plus loin</h3>
              <div className="grid sm:grid-cols-2 md:grid-cols-4 gap-4">
                <Link to="/amazon-fba-debutant" className="flex items-center gap-2 p-4 bg-card border rounded-lg hover:border-primary/50 transition-colors">
                  <BookOpen className="w-5 h-5 text-primary flex-shrink-0" />
                  <span className="text-sm font-medium">Guide Amazon FBA débutant</span>
                </Link>
                <Link to="/produits-rentables-amazon" className="flex items-center gap-2 p-4 bg-card border rounded-lg hover:border-primary/50 transition-colors">
                  <Target className="w-5 h-5 text-primary flex-shrink-0" />
                  <span className="text-sm font-medium">Trouver des produits rentables</span>
                </Link>
                <Link to="/outil-amazon-fba" className="flex items-center gap-2 p-4 bg-card border rounded-lg hover:border-primary/50 transition-colors">
                  <Settings className="w-5 h-5 text-primary flex-shrink-0" />
                  <span className="text-sm font-medium">Outils Amazon FBA</span>
                </Link>
                <Link to="/services" className="flex items-center gap-2 p-4 bg-card border rounded-lg hover:border-primary/50 transition-colors">
                  <Truck className="w-5 h-5 text-primary flex-shrink-0" />
                  <span className="text-sm font-medium">Services & logistique</span>
                </Link>
              </div>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
};

export default Formation;
