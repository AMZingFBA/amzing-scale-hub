import { ArrowRight, ArrowLeft, GraduationCap, CheckCircle2, XCircle, BookOpen, HelpCircle, Target, Users, Award, AlertTriangle, Zap, Shield, Clock, DollarSign } from "lucide-react";
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

const FormationAmazonFbaDebutant = () => {
  const navigate = useNavigate();

  const tableOfContents = [
    { id: "competences", label: "Ce qu'un débutant doit maîtriser" },
    { id: "programme", label: "Programme type d'une formation" },
    { id: "choisir", label: "Comment choisir une bonne formation" },
    { id: "erreurs", label: "Erreurs à éviter" },
    { id: "pourquoi-formation", label: "Pourquoi formation + outils" },
    { id: "cta", label: "Découvrir AMZing FBA" },
    { id: "faq", label: "FAQ" },
  ];

  const faqItems = [
    {
      question: "Quelle est la meilleure formation Amazon FBA ?",
      answer: "Il n'y a pas de \"meilleure\" formation universelle. La bonne formation dépend de ton profil (débutant/avancé), ton budget, et tes objectifs. Cherche une formation à jour, avec des outils concrets, un support réactif et une communauté active. Évite les formations qui promettent des résultats garantis."
    },
    {
      question: "Combien coûte une formation Amazon FBA ?",
      answer: "Les formations varient de 0€ (YouTube, articles) à 2000€+ (coaching premium). Les formations classiques coûtent généralement 300-800€ en one-shot. AMZing FBA propose une approche différente : 34,99€/mois sans engagement, avec formation + outils + communauté inclus."
    },
    {
      question: "Combien de temps dure une formation ?",
      answer: "Une formation complète contient généralement 10-30h de contenu vidéo. Mais l'apprentissage réel prend 2-3 mois pour être à l'aise avec tous les aspects (sourcing, analyse, logistique). L'important est d'apprendre en faisant, pas juste en regardant des vidéos."
    },
    {
      question: "Est-ce adapté si je pars de zéro ?",
      answer: "Oui, les bonnes formations sont conçues pour les débutants. Elles commencent par les bases : qu'est-ce qu'Amazon FBA, comment créer son compte, choisir son modèle. L'essentiel est de suivre les modules dans l'ordre et de poser des questions si tu bloques."
    },
    {
      question: "Formation en ligne ou coaching ?",
      answer: "Formation en ligne : tu avances à ton rythme, moins cher, mais moins personnalisé. Coaching : accompagnement individuel, plus cher, mais adapté à ta situation. Une bonne alternative : formation en ligne + communauté active pour avoir des retours personnalisés sans payer le prix du coaching."
    },
    {
      question: "Puis-je réussir sans formation ?",
      answer: "Techniquement oui, mais c'est plus long et plus risqué. Tu vas faire des erreurs évitables, perdre du temps et de l'argent. Une formation structure ton apprentissage et t'évite les pièges classiques. Le ROI d'une bonne formation est généralement positif dès les premiers mois."
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
      { "@type": "ListItem", "position": 2, "name": "Formation Amazon FBA débutant", "item": "https://amzingfba.com/guide/formation-amazon-fba-debutant" }
    ]
  };

  const modules = [
    { title: "Introduction à Amazon FBA", description: "Comprendre le modèle, les opportunités, les risques" },
    { title: "Création du compte vendeur", description: "Inscription, vérification, configuration initiale" },
    { title: "Choisir son modèle", description: "Wholesale, retail arbitrage, private label : lequel choisir" },
    { title: "Recherche de produits", description: "Critères, outils d'analyse, identifier les opportunités" },
    { title: "Analyse de la concurrence", description: "BSR, nombre de vendeurs, prix, historique" },
    { title: "Calcul de rentabilité", description: "Marges, frais Amazon, ROI, seuil de rentabilité" },
    { title: "Sourcing & fournisseurs", description: "Trouver, contacter, négocier, obtenir des factures conformes" },
    { title: "Préparation & expédition FBA", description: "Étiquetage, emballage, envoi aux entrepôts Amazon" },
    { title: "Création de listings", description: "Titres, bullets, images, mots-clés, SEO Amazon" },
    { title: "Lancement & premières ventes", description: "Stratégie de lancement, prix, optimisation" },
    { title: "Amazon Advertising (PPC)", description: "Bases de la pub Amazon, quand et comment l'utiliser" },
    { title: "Scaling & automatisation", description: "Réassort, multi-produits, tableaux de bord, process" },
  ];

  const criteresFormation = [
    { good: "Contenu à jour (Amazon change souvent)", bad: "Vidéos de 2019 jamais mises à jour" },
    { good: "Modules progressifs et structurés", bad: "Contenu en vrac sans fil conducteur" },
    { good: "Support/communauté pour poser des questions", bad: "Formation puis silence radio" },
    { good: "Outils concrets (templates, checklists)", bad: "Que de la théorie sans application" },
    { good: "Accès à des fournisseurs ou leads", bad: "\"Trouve tes fournisseurs toi-même\"" },
    { good: "Prix transparent, sans upsells cachés", bad: "300€ puis 500€ de \"modules avancés\"" },
  ];

  return (
    <div className="min-h-screen bg-background">
      <SEO
        title="Formation Amazon FBA débutant : programme, ce qu'il faut apprendre, comment choisir"
        description="Guide pour choisir une formation Amazon FBA : compétences à acquérir, programme type, critères de sélection et erreurs à éviter. Comparatif objectif."
        keywords="formation amazon fba, formation amazon fba debutant, meilleure formation amazon fba, cours amazon fba, apprendre amazon fba, formation vendeur amazon"
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
      <section className="pt-32 pb-16 bg-gradient-to-br from-purple-500/10 via-background to-primary/10">
        <div className="container mx-auto px-4 max-w-4xl">
          <Badge className="mb-4 bg-purple-500/10 text-purple-600 border-purple-500/20">Se former efficacement</Badge>
          <h1 className="text-4xl md:text-5xl font-bold mb-6">Formation Amazon FBA débutant</h1>
          <p className="text-xl text-muted-foreground mb-8">
            Tu veux te lancer sur Amazon FBA et tu cherches une formation ? 
            Ce guide t'explique ce que tu dois apprendre, comment choisir une bonne formation, 
            et les erreurs à éviter.
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
          
          {/* Compétences */}
          <section id="competences" className="mb-12 scroll-mt-24">
            <h2 className="text-3xl font-bold mb-6 flex items-center gap-3">
              <Target className="w-8 h-8 text-primary" />
              Ce qu'un débutant doit maîtriser
            </h2>
            <p>
              Avant de chercher une formation, comprends les compétences clés que tu dois acquérir :
            </p>
            
            <div className="not-prose grid md:grid-cols-2 gap-4 mt-6">
              <Card>
                <CardContent className="pt-6">
                  <h3 className="font-semibold mb-3 flex items-center gap-2">
                    <CheckCircle2 className="w-5 h-5 text-green-500" /> Compétences techniques
                  </h3>
                  <ul className="space-y-2 text-sm">
                    <li>• Naviguer dans Seller Central</li>
                    <li>• Analyser un produit (BSR, concurrence, marge)</li>
                    <li>• Calculer la rentabilité réelle</li>
                    <li>• Préparer et envoyer du stock FBA</li>
                    <li>• Créer un listing optimisé</li>
                    <li>• Gérer les bases d'Amazon PPC</li>
                  </ul>
                </CardContent>
              </Card>
              
              <Card>
                <CardContent className="pt-6">
                  <h3 className="font-semibold mb-3 flex items-center gap-2">
                    <CheckCircle2 className="w-5 h-5 text-green-500" /> Compétences business
                  </h3>
                  <ul className="space-y-2 text-sm">
                    <li>• Choisir un modèle adapté à sa situation</li>
                    <li>• Sourcer efficacement (fournisseurs, négociation)</li>
                    <li>• Gérer sa trésorerie et son stock</li>
                    <li>• Prendre des décisions basées sur les données</li>
                    <li>• Identifier et éviter les pièges courants</li>
                    <li>• Scaler son business progressivement</li>
                  </ul>
                </CardContent>
              </Card>
            </div>
          </section>

          {/* Programme type */}
          <section id="programme" className="mb-12 scroll-mt-24">
            <h2 className="text-3xl font-bold mb-6 flex items-center gap-3">
              <GraduationCap className="w-8 h-8 text-primary" />
              Programme type d'une formation (modules)
            </h2>
            <p>
              Une formation complète devrait couvrir ces thèmes, dans cet ordre logique :
            </p>
            
            <div className="not-prose mt-6 space-y-3">
              {modules.map((module, index) => (
                <div key={index} className="flex items-start gap-4 p-4 border rounded-lg hover:border-primary/50 transition-colors">
                  <div className="w-8 h-8 rounded-full bg-primary/10 text-primary flex items-center justify-center font-bold shrink-0">
                    {index + 1}
                  </div>
                  <div>
                    <h3 className="font-semibold">{module.title}</h3>
                    <p className="text-sm text-muted-foreground">{module.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* Comment choisir */}
          <section id="choisir" className="mb-12 scroll-mt-24">
            <h2 className="text-3xl font-bold mb-6 flex items-center gap-3">
              <Award className="w-8 h-8 text-primary" />
              Comment choisir une bonne formation (critères)
            </h2>
            <p>
              Toutes les formations ne se valent pas. Voici comment distinguer une bonne formation d'une mauvaise :
            </p>
            
            <div className="overflow-x-auto not-prose my-6">
              <table className="w-full border-collapse text-sm">
                <thead>
                  <tr className="border-b bg-muted/50">
                    <th className="text-left py-3 px-4 font-semibold text-green-600">✓ Bonne formation</th>
                    <th className="text-left py-3 px-4 font-semibold text-red-600">✗ À éviter</th>
                  </tr>
                </thead>
                <tbody>
                  {criteresFormation.map((critere, index) => (
                    <tr key={index} className={index % 2 === 0 ? "" : "bg-muted/30"}>
                      <td className="py-3 px-4">{critere.good}</td>
                      <td className="py-3 px-4">{critere.bad}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            
            <div className="not-prose bg-blue-50 dark:bg-blue-950/20 border border-blue-200 dark:border-blue-800 rounded-xl p-4">
              <p className="flex items-start gap-2 text-sm">
                <Shield className="w-5 h-5 text-blue-600 shrink-0 mt-0.5" />
                <span><strong>Conseil :</strong> Cherche des avis réels (pas que sur le site du formateur). Vérifie si la communauté est active. Teste si possible avec une période d'essai ou un remboursement.</span>
              </p>
            </div>
          </section>

          {/* Erreurs à éviter */}
          <section id="erreurs" className="mb-12 scroll-mt-24">
            <h2 className="text-3xl font-bold mb-6 flex items-center gap-3">
              <AlertTriangle className="w-8 h-8 text-red-500" />
              Erreurs à éviter quand on achète une formation
            </h2>
            
            <div className="not-prose bg-red-50 dark:bg-red-950/20 border border-red-200 dark:border-red-800 rounded-xl p-6">
              <ul className="space-y-4">
                <li className="flex items-start gap-3">
                  <XCircle className="w-5 h-5 text-red-500 shrink-0 mt-0.5" />
                  <div>
                    <strong>Croire aux promesses de revenus garantis</strong>
                    <p className="text-sm text-muted-foreground">\"Gagne 5000€/mois en 3 mois\" = red flag. Personne ne peut garantir tes résultats.</p>
                  </div>
                </li>
                <li className="flex items-start gap-3">
                  <XCircle className="w-5 h-5 text-red-500 shrink-0 mt-0.5" />
                  <div>
                    <strong>Payer très cher pour \"plus de valeur\"</strong>
                    <p className="text-sm text-muted-foreground">Une formation à 2000€ n'est pas forcément meilleure qu'une à 300€. Le prix ne fait pas la qualité.</p>
                  </div>
                </li>
                <li className="flex items-start gap-3">
                  <XCircle className="w-5 h-5 text-red-500 shrink-0 mt-0.5" />
                  <div>
                    <strong>Acheter une formation sans outils</strong>
                    <p className="text-sm text-muted-foreground">La théorie sans outils concrets = tu vas devoir tout refaire toi-même.</p>
                  </div>
                </li>
                <li className="flex items-start gap-3">
                  <XCircle className="w-5 h-5 text-red-500 shrink-0 mt-0.5" />
                  <div>
                    <strong>Enchaîner les formations sans agir</strong>
                    <p className="text-sm text-muted-foreground">\"Syndrome du formé permanent\" : tu regardes des vidéos mais tu ne lances jamais. Une bonne formation suffit.</p>
                  </div>
                </li>
                <li className="flex items-start gap-3">
                  <XCircle className="w-5 h-5 text-red-500 shrink-0 mt-0.5" />
                  <div>
                    <strong>Ignorer la communauté</strong>
                    <p className="text-sm text-muted-foreground">Apprendre seul est plus dur. Une communauté active te fait gagner du temps et de la motivation.</p>
                  </div>
                </li>
              </ul>
            </div>
          </section>

          {/* Pourquoi formation + outils */}
          <section id="pourquoi-formation" className="mb-12 scroll-mt-24">
            <h2 className="text-3xl font-bold mb-6 flex items-center gap-3">
              <Zap className="w-8 h-8 text-primary" />
              Pourquoi une formation + outils (positionner AMZing FBA)
            </h2>
            <p>
              La plupart des formations te donnent de la théorie. Tu dois ensuite acheter des outils séparément, 
              chercher des fournisseurs toi-même, et espérer trouver une communauté active.
            </p>
            
            <p className="mt-4">
              AMZing FBA propose une approche différente : tout est inclus dans un seul abonnement.
            </p>
            
            <div className="not-prose grid md:grid-cols-2 gap-4 mt-6">
              <Card>
                <CardContent className="pt-6">
                  <h3 className="font-semibold mb-3 flex items-center gap-2">
                    <GraduationCap className="w-5 h-5 text-primary" /> Formation structurée
                  </h3>
                  <p className="text-sm text-muted-foreground">
                    Méthode pas à pas, de la création du compte au scaling. Contenu mis à jour régulièrement.
                  </p>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="pt-6">
                  <h3 className="font-semibold mb-3 flex items-center gap-2">
                    <Target className="w-5 h-5 text-primary" /> Moniteurs produits
                  </h3>
                  <p className="text-sm text-muted-foreground">
                    Outils qui scannent les opportunités pour toi. Tu reçois des alertes sur des produits rentables.
                  </p>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="pt-6">
                  <h3 className="font-semibold mb-3 flex items-center gap-2">
                    <Users className="w-5 h-5 text-primary" /> Catalogue fournisseurs
                  </h3>
                  <p className="text-sm text-muted-foreground">
                    Accès à des fournisseurs vérifiés avec factures conformes. Tu ne pars pas de zéro.
                  </p>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="pt-6">
                  <h3 className="font-semibold mb-3 flex items-center gap-2">
                    <Users className="w-5 h-5 text-primary" /> Communauté active
                  </h3>
                  <p className="text-sm text-muted-foreground">
                    Chat, salons thématiques, entraide entre membres. Tu n'es jamais seul.
                  </p>
                </CardContent>
              </Card>
            </div>
            
            <div className="not-prose overflow-x-auto mt-8">
              <table className="w-full border-collapse text-sm">
                <thead>
                  <tr className="border-b bg-muted/50">
                    <th className="text-left py-3 px-4"></th>
                    <th className="text-center py-3 px-4">YouTube (gratuit)</th>
                    <th className="text-center py-3 px-4">Formation classique</th>
                    <th className="text-center py-3 px-4 bg-primary/10">AMZing FBA</th>
                  </tr>
                </thead>
                <tbody>
                  <tr className="border-b">
                    <td className="py-3 px-4 font-medium">Méthode structurée</td>
                    <td className="py-3 px-4 text-center"><XCircle className="w-5 h-5 text-red-500 mx-auto" /></td>
                    <td className="py-3 px-4 text-center">Partielle</td>
                    <td className="py-3 px-4 text-center bg-primary/5"><CheckCircle2 className="w-5 h-5 text-green-500 mx-auto" /></td>
                  </tr>
                  <tr className="border-b">
                    <td className="py-3 px-4 font-medium">Moniteurs produits</td>
                    <td className="py-3 px-4 text-center"><XCircle className="w-5 h-5 text-red-500 mx-auto" /></td>
                    <td className="py-3 px-4 text-center"><XCircle className="w-5 h-5 text-red-500 mx-auto" /></td>
                    <td className="py-3 px-4 text-center bg-primary/5"><CheckCircle2 className="w-5 h-5 text-green-500 mx-auto" /></td>
                  </tr>
                  <tr className="border-b">
                    <td className="py-3 px-4 font-medium">Catalogue fournisseurs</td>
                    <td className="py-3 px-4 text-center"><XCircle className="w-5 h-5 text-red-500 mx-auto" /></td>
                    <td className="py-3 px-4 text-center"><XCircle className="w-5 h-5 text-red-500 mx-auto" /></td>
                    <td className="py-3 px-4 text-center bg-primary/5"><CheckCircle2 className="w-5 h-5 text-green-500 mx-auto" /></td>
                  </tr>
                  <tr className="border-b">
                    <td className="py-3 px-4 font-medium">Communauté active</td>
                    <td className="py-3 px-4 text-center"><XCircle className="w-5 h-5 text-red-500 mx-auto" /></td>
                    <td className="py-3 px-4 text-center">Variable</td>
                    <td className="py-3 px-4 text-center bg-primary/5"><CheckCircle2 className="w-5 h-5 text-green-500 mx-auto" /></td>
                  </tr>
                  <tr className="border-b">
                    <td className="py-3 px-4 font-medium">Support réactif</td>
                    <td className="py-3 px-4 text-center"><XCircle className="w-5 h-5 text-red-500 mx-auto" /></td>
                    <td className="py-3 px-4 text-center">Variable</td>
                    <td className="py-3 px-4 text-center bg-primary/5"><CheckCircle2 className="w-5 h-5 text-green-500 mx-auto" /></td>
                  </tr>
                  <tr>
                    <td className="py-3 px-4 font-medium">Tarif</td>
                    <td className="py-3 px-4 text-center">Gratuit</td>
                    <td className="py-3 px-4 text-center">500-2000€</td>
                    <td className="py-3 px-4 text-center bg-primary/5 font-semibold text-primary">34,99€/mois</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </section>

          {/* CTA fort */}
          <section id="cta" className="mb-12 scroll-mt-24">
            <h2 className="text-3xl font-bold mb-4">Découvre AMZing FBA</h2>
            <div className="not-prose">
              <Card className="bg-gradient-to-br from-purple-500/10 to-primary/10 border-purple-500/30">
                <CardContent className="pt-6">
                  <div className="text-center max-w-2xl mx-auto">
                    <h3 className="text-2xl font-bold mb-4">Formation + Outils + Communauté</h3>
                    <p className="text-muted-foreground mb-6">
                      Tout ce dont tu as besoin pour te lancer et réussir sur Amazon FBA. 
                      Méthode structurée, moniteurs de produits rentables, catalogue fournisseurs 
                      et communauté active pour répondre à tes questions.
                    </p>
                    
                    <div className="flex flex-wrap justify-center gap-4 mb-6">
                      <div className="flex items-center gap-2 text-sm">
                        <CheckCircle2 className="w-5 h-5 text-green-500" />
                        <span>Sans engagement</span>
                      </div>
                      <div className="flex items-center gap-2 text-sm">
                        <CheckCircle2 className="w-5 h-5 text-green-500" />
                        <span>Accès immédiat</span>
                      </div>
                      <div className="flex items-center gap-2 text-sm">
                        <CheckCircle2 className="w-5 h-5 text-green-500" />
                        <span>Mises à jour incluses</span>
                      </div>
                    </div>
                    
                    <Button variant="hero" size="lg" asChild>
                      <Link to="/formation">
                        Accéder à la formation Amazon FBA <ArrowRight className="ml-2" />
                      </Link>
                    </Button>
                    <p className="text-lg font-semibold text-primary mt-4">34,99€/mois • Sans engagement</p>
                  </div>
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
                <Link to="/guide/combien-coute-amazon-fba" className="block p-4 border rounded-lg hover:border-primary transition-colors">
                  <span className="font-medium">Combien coûte Amazon FBA</span>
                  <p className="text-sm text-muted-foreground mt-1">Tous les frais expliqués</p>
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

export default FormationAmazonFbaDebutant;
