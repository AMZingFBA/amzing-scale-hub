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
  Coins
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

const Formation = () => {
  const navigate = useNavigate();
  
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

  const pillars = [
    {
      icon: BookOpen,
      title: "La formation Amazon FBA complète",
      description: "Un parcours structuré, en plusieurs modules, qui t'explique clairement comment fonctionne Amazon FBA, comment choisir ta stratégie, lire les données, analyser les produits, gérer ton cash et éviter les pièges détectés dans la vraie vie."
    },
    {
      icon: Bell,
      title: "La plateforme de moniteurs & alertes produits",
      description: "Des moniteurs automatisés scannent des sites, des grossistes et des catalogues partenaires pour identifier des produits potentiellement rentables. Tu gagnes du temps sur la recherche et tu te concentres sur la décision."
    },
    {
      icon: Package,
      title: "Catalogue fournisseurs & logistique",
      description: "Un accès structuré à des fournisseurs, des pistes de produits, des informations sur la logistique, le stockage, l'expédition et des bonus comme le cashback pour améliorer ta marge."
    },
    {
      icon: Users,
      title: "Communauté & accompagnement",
      description: "Un espace membre avec chat, salons thématiques, partages de ventes, questions/réponses et support. Tu peux poser tes questions, demander un avis sur une idée produit et t'inspirer de ceux qui sont un peu plus loin que toi."
    }
  ];

  const steps = [
    {
      number: "1",
      title: "Tu suis le parcours de base",
      description: "On te prend par la main pour poser les fondations : comprendre Amazon FBA, choisir ta stratégie, configurer ton compte, te familiariser avec les outils essentiels et les indicateurs qui comptent."
    },
    {
      number: "2",
      title: "Tu utilises les moniteurs pour alimenter tes idées produits",
      description: "Tu accèdes aux alertes produits, aux moniteurs Qogita/Eany/autres sites, et tu vois remonter des opportunités. Tu apprends à filtrer, analyser et sélectionner ce qui correspond à ta stratégie et à ton budget."
    },
    {
      number: "3",
      title: "Tu passes à l'achat, au stock et aux ventes",
      description: "Tu décides des produits sur lesquels te positionner, tu commandes chez les fournisseurs, tu organises la logistique (en utilisant les ressources et contacts de la plateforme) et tu suis tes résultats avec la communauté."
    }
  ];

  const modules = [
    {
      number: 1,
      title: "Comprendre Amazon FBA et les modèles possibles",
      description: "Fonctionnement d'Amazon FBA, FBA vs FBM, arbitrage, wholesale, private label, comment choisir le modèle adapté à ta situation.",
      icon: BookOpen
    },
    {
      number: 2,
      title: "Mettre en place ton compte et ton cadre légal",
      description: "Création / paramétrage du compte vendeur, aspects administratifs de base, structure d'entreprise (vue d'ensemble) et points de vigilance.",
      icon: Shield
    },
    {
      number: 3,
      title: "Les bases de la recherche de produits rentables",
      description: "Comment lire les données, interpréter la demande, la concurrence, la rotation, les frais Amazon, la marge et le ROI.",
      icon: BarChart3
    },
    {
      number: 4,
      title: "Utiliser les moniteurs et les alertes produits AMZing FBA",
      description: "Comment exploiter la plateforme AMZing FBA, comprendre les colonnes, les filtres, les alertes et les signaux importants avant de prendre une décision.",
      icon: Bell
    },
    {
      number: 5,
      title: "Passer commande, négocier et sécuriser la logistique",
      description: "Bonnes pratiques pour commander chez les fournisseurs, vérifier les conditions, organiser l'envoi vers Amazon (ou entrepôts), anticiper les délais et problèmes.",
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
      title: "Gestion du risque et erreurs à éviter",
      description: "Liste détaillée des erreurs fréquentes observées chez les vendeurs (et comment les éviter grâce à la data et à l'expérience des membres).",
      icon: AlertTriangle
    },
    {
      number: 8,
      title: "Bonus & mises à jour",
      description: "Sessions bonus, replays, cas pratiques issus de la communauté, contenus ajoutés au fur et à mesure.",
      icon: Gift
    }
  ];

  const platformFeatures = [
    {
      icon: Bell,
      title: "Moniteurs & alertes produits",
      description: "Des moniteurs scannent des sites et des grossistes partenaires et te remontent des fiches produits avec les informations clés pour décider : prix, demande estimée, concurrence, marge potentielle…"
    },
    {
      icon: Database,
      title: "Catalogue & fournisseurs",
      description: "Tu accèdes à des pistes de fournisseurs et de produits. Tu ne pars pas de zéro ; tu peux t'appuyer sur ce qui a déjà été identifié comme intéressant."
    },
    {
      icon: Coins,
      title: "Cashback & optimisations",
      description: "Certaines offres te permettent de récupérer une partie de tes achats via du cashback ou des conditions négociées."
    },
    {
      icon: MessageSquare,
      title: "Communauté & salons privés",
      description: "Chat, salons \"succès\" et \"ventes\", questions/réponses : tu peux partager tes résultats, demander des avis et rester motivé."
    }
  ];

  const comparisonItems = [
    {
      feature: "Format",
      classic: "Vidéos + quelques documents",
      amzing: "Vidéos + plateforme de moniteurs + catalogue + communauté"
    },
    {
      feature: "Recherche de produits",
      classic: "À toi de te débrouiller",
      amzing: "Moniteurs et alertes qui t'aident à alimenter tes idées"
    },
    {
      feature: "Accompagnement",
      classic: "Groupe Facebook peu actif",
      amzing: "Communauté structurée + salons de partage + support"
    },
    {
      feature: "Mise à jour",
      classic: "Accès figé",
      amzing: "Plateforme et contenus mis à jour régulièrement"
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
      question: "Est-ce que je peux commencer même si je n'ai jamais vendu sur Amazon ?",
      answer: "Oui. Le parcours est pensé pour les débutants : on t'explique les bases d'Amazon FBA, les modèles possibles et les erreurs à éviter. Tu peux suivre pas à pas, même sans expérience."
    },
    {
      question: "De quel budget j'ai besoin pour me lancer ?",
      answer: "Il est possible de commencer avec un petit budget en testant peu de produits mais bien choisis. L'objectif d'AMZing FBA est de t'aider à faire des choix plus intelligents avec le budget que tu as, pas de t'inciter à prendre des risques démesurés."
    },
    {
      question: "Combien de temps par semaine dois-je y consacrer ?",
      answer: "Tout dépend de ton objectif. Certains membres avancent 2 à 3 heures par semaine en parallèle de leurs études ou de leur travail, d'autres en font une activité principale. Le plus important est la régularité."
    },
    {
      question: "Est-ce que les moniteurs choisissent les produits à ma place ?",
      answer: "Non. Les moniteurs et alertes te proposent des idées basées sur des données, mais la décision finale t'appartient. On t'apprend à analyser ces informations et à décider en fonction de ta stratégie, de ton budget et de ton appétit pour le risque."
    },
    {
      question: "Je suis déjà une autre formation Amazon FBA, est-ce que ça vaut le coup ?",
      answer: "AMZing FBA peut compléter une autre formation, surtout si tu manques de structure pour la recherche de produits et la prise de décision. Le cœur de notre valeur vient de la data, des moniteurs et de la communauté."
    },
    {
      question: "Est-ce que je peux arrêter quand je veux ?",
      answer: "Oui, l'abonnement est géré de manière flexible selon les conditions visibles sur la page tarifs. Tant que ton abonnement est actif, tu gardes l'accès à la plateforme."
    },
    {
      question: "Est-ce que l'accès est valable à vie ?",
      answer: "L'accès à la plateforme et aux contenus est relié à ton abonnement. Tu y as accès tant que ton abonnement est actif."
    },
    {
      question: "Comment se passe le support ?",
      answer: "Tu peux utiliser le chat, les salons dédiés et le support client pour poser tes questions. Selon ton offre, tu peux aussi avoir accès à des échanges plus personnalisés."
    }
  ];

  return (
    <div className="min-h-screen bg-background">
      <SEO
        title={seoData.formation.title}
        description={seoData.formation.description}
        keywords={seoData.formation.keywords}
        schema={schemas.course}
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
      
      {/* Hero Section */}
      <section className="pt-28 pb-20 relative overflow-hidden">
        {/* Background decorations */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-20 left-10 w-64 h-64 bg-primary/10 rounded-full blur-3xl"></div>
          <div className="absolute bottom-20 right-20 w-96 h-96 bg-secondary/10 rounded-full blur-3xl"></div>
        </div>

        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-4xl mx-auto text-center">
            <Badge className="mb-6 bg-primary/10 text-primary border-primary/20 text-sm px-4 py-1">
              Formation + Plateforme complète
            </Badge>
            
            <h1 className="text-3xl md:text-5xl lg:text-6xl font-bold mb-6 leading-tight">
              AMZing FBA : l'outil clé pour bâtir{" "}
              <span className="text-primary">un business e-commerce vraiment rentable</span>
            </h1>
            
            <p className="text-lg md:text-xl text-muted-foreground mb-8 max-w-3xl mx-auto">
              Pas une énième formation vidéo. AMZing FBA, c'est une méthode complète + des outils concrets : 
              moniteurs de produits rentables, catalogue fournisseurs, cashback, logistique et communauté 
              pour t'aider à passer à l'action sur Amazon.
            </p>

            {/* Bullet points */}
            <div className="flex flex-col gap-3 mb-8 max-w-2xl mx-auto text-left">
              <div className="flex items-start gap-3">
                <CheckCircle2 className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
                <span>Une méthode étape par étape pour lancer ou relancer ton business Amazon FBA</span>
              </div>
              <div className="flex items-start gap-3">
                <CheckCircle2 className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
                <span>Des moniteurs qui scannent des sites et grossistes pour dénicher des produits vraiment rentables</span>
              </div>
              <div className="flex items-start gap-3">
                <CheckCircle2 className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
                <span>Un catalogue de fournisseurs et de produits pour ne pas partir de zéro</span>
              </div>
              <div className="flex items-start gap-3">
                <CheckCircle2 className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
                <span>Une communauté et un support pour ne plus être seul face à tes décisions d'achat</span>
              </div>
            </div>

            {/* CTAs */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center mb-8">
              <Button variant="hero" size="xl" asChild>
                <Link to="/tarifs">
                  Rejoindre AMZing FBA
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Link>
              </Button>
              <Button variant="outline" size="xl" asChild>
                <Link to="/services">Voir les services</Link>
              </Button>
            </div>

            {/* Trust badges */}
            <div className="flex flex-wrap justify-center gap-6 text-sm text-muted-foreground">
              <div className="flex items-center gap-2">
                <Shield className="w-4 h-4 text-primary" />
                <span>Paiement sécurisé</span>
              </div>
              <div className="flex items-center gap-2">
                <RefreshCw className="w-4 h-4 text-primary" />
                <span>Accès renouvelé tant que ton abonnement est actif</span>
              </div>
              <div className="flex items-center gap-2">
                <Smartphone className="w-4 h-4 text-primary" />
                <span>Accès web + application mobile</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Section À qui s'adresse */}
      <section className="py-20 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              À qui s'adresse la formation Amazon FBA AMZing FBA ?
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

      {/* Section Ce que tu obtiens */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Concrètement, qu'est-ce que tu obtiens avec AMZing FBA ?
            </h2>
            <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
              AMZing FBA, ce n'est pas seulement une formation. C'est une <strong>infrastructure</strong> pensée 
              pour t'aider à trouver, analyser, acheter, stocker et expédier des produits rentables sur Amazon.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-6xl mx-auto">
            {pillars.map((pillar, index) => (
              <Card key={index} className="group hover:shadow-xl hover:scale-[1.02] transition-all duration-300 h-full">
                <CardHeader className="pb-2">
                  <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4 group-hover:bg-primary group-hover:text-primary-foreground transition-all">
                    <pillar.icon className="w-6 h-6 text-primary group-hover:text-primary-foreground" />
                  </div>
                  <CardTitle className="text-lg">{pillar.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground text-sm">{pillar.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Section Comment ça fonctionne */}
      <section className="py-20 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Comment ça se passe, concrètement, quand tu rejoins AMZing FBA ?
            </h2>
          </div>

          <div className="max-w-5xl mx-auto">
            <div className="grid md:grid-cols-3 gap-8">
              {steps.map((step, index) => (
                <div key={index} className="relative">
                  {/* Connector line */}
                  {index < steps.length - 1 && (
                    <div className="hidden md:block absolute top-12 left-full w-full h-0.5 bg-primary/20 -translate-x-1/2 z-0" />
                  )}
                  
                  <div className="relative z-10 text-center">
                    <div className="w-24 h-24 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-3xl font-bold mx-auto mb-6 shadow-lg">
                      {step.number}
                    </div>
                    <h3 className="text-xl font-bold mb-3">{step.title}</h3>
                    <p className="text-muted-foreground">{step.description}</p>
                  </div>
                </div>
              ))}
            </div>

            <div className="text-center mt-12">
              <Button variant="hero" size="lg" asChild>
                <Link to="/tarifs">
                  Je veux accéder à la méthode et à la plateforme
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Section Programme détaillé */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Le programme détaillé de la formation Amazon FBA
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Voici une vision simplifiée des modules. Le contenu est mis à jour en fonction 
              de l'évolution d'Amazon et des retours des membres.
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
                    <span className="flex-1">{module.title}</span>
                  </CardTitle>
                </CardHeader>
                <CardContent className="pl-20">
                  <p className="text-muted-foreground">{module.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Section Plateforme en détails */}
      <section className="py-20 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              La plateforme AMZing FBA : ton tableau de bord pour les produits rentables
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Tu n'as pas seulement des vidéos : tu as un espace membre et une app pour 
              suivre tes alertes, ton catalogue et ta progression.
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto mb-12">
            {platformFeatures.map((feature, index) => (
              <Card key={index} className="group hover:shadow-xl transition-all duration-300">
                <CardContent className="pt-6">
                  <div className="flex gap-4">
                    <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0 group-hover:bg-primary/20 transition-colors">
                      <feature.icon className="w-6 h-6 text-primary" />
                    </div>
                    <div>
                      <h3 className="font-bold text-lg mb-2">{feature.title}</h3>
                      <p className="text-muted-foreground">{feature.description}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

        </div>
      </section>

      {/* Section Comparatif */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              AMZing FBA vs une formation Amazon FBA classique
            </h2>
          </div>

          <div className="max-w-4xl mx-auto overflow-x-auto">
            <table className="w-full border-collapse">
              <thead>
                <tr>
                  <th className="text-left p-4 bg-muted/50 rounded-tl-lg font-medium">Critère</th>
                  <th className="text-left p-4 bg-muted/50 font-medium">Formation classique</th>
                  <th className="text-left p-4 bg-primary/10 rounded-tr-lg font-bold text-primary">AMZing FBA</th>
                </tr>
              </thead>
              <tbody>
                {comparisonItems.map((item, index) => (
                  <tr key={index} className="border-b border-muted">
                    <td className="p-4 font-medium">{item.feature}</td>
                    <td className="p-4 text-muted-foreground">{item.classic}</td>
                    <td className="p-4 bg-primary/5 font-medium">{item.amzing}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* Section Témoignages */}
      <section className="py-20 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Résultats & retours des membres
            </h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Les résultats dépendent toujours du travail fourni, de la stratégie et des décisions de chacun. 
              AMZing FBA n'est pas une promesse d'enrichissement rapide, mais un cadre pour prendre de meilleures décisions.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
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
                  <p className="text-muted-foreground italic">"{testimonial.quote}"</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              FAQ – Questions fréquentes sur la formation AMZing FBA
            </h2>
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
              Tu veux arrêter de chercher des produits au hasard et construire un vrai système sur Amazon FBA ?
            </h2>
            <p className="text-xl text-muted-foreground mb-8">
              Rejoins AMZing FBA et avance avec une méthode, des outils et une communauté.
            </p>

            <Button variant="hero" size="xl" asChild className="mb-6">
              <Link to="/tarifs">
                Je rejoins AMZing FBA
                <ArrowRight className="ml-2 h-5 w-5" />
              </Link>
            </Button>

            <p className="text-sm text-muted-foreground max-w-xl mx-auto">
              Tu restes libre de ton rythme, de ta stratégie et de tes décisions. 
              AMZing FBA est là pour t'aider à y voir plus clair, pas pour décider à ta place.
            </p>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Formation;
