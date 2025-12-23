import { ArrowRight, CheckCircle2, AlertTriangle, Users, BookOpen, Target, Lightbulb, TrendingUp, ShoppingCart, Package } from 'lucide-react';
import { Link } from 'react-router-dom';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import SEO from '@/components/SEO';
import { seoData } from '@/lib/seo-data';
import { useScrollReveal } from '@/hooks/use-scroll-reveal';
import { cn } from '@/lib/utils';

const AmazonFbaDebutant = () => {
  const heroAnim = useScrollReveal({ animation: 'fade-up', delay: 100 });
  const section1Anim = useScrollReveal({ animation: 'fade-left', delay: 100 });
  const section2Anim = useScrollReveal({ animation: 'fade-right', delay: 100 });
  const section3Anim = useScrollReveal({ animation: 'fade-up', delay: 100 });
  const section4Anim = useScrollReveal({ animation: 'scale', delay: 100 });

  return (
    <div className="min-h-screen flex flex-col">
      <SEO 
        title={seoData.amazonFbaDebutant.title}
        description={seoData.amazonFbaDebutant.description}
        keywords={seoData.amazonFbaDebutant.keywords}
        robots={seoData.amazonFbaDebutant.robots}
      />
      <Navbar />
      
      <main className="flex-grow">
        {/* Hero Section */}
        <section 
          ref={heroAnim.ref}
          className={cn(
            "pt-32 pb-20 bg-gradient-to-br from-primary/10 via-background to-secondary/10 transition-all duration-700",
            heroAnim.isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"
          )}
        >
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto text-center">
              <span className="inline-block px-4 py-2 bg-primary/20 text-primary rounded-full text-sm font-medium mb-6">
                Guide 2025
              </span>
              <h1 className="text-4xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-primary via-secondary to-primary bg-clip-text text-transparent">
                Amazon FBA : comment se lancer quand on débute
              </h1>
              <p className="text-xl text-muted-foreground mb-8 max-w-3xl mx-auto">
                Tu veux vendre sur Amazon mais tu ne sais pas par où commencer ? Ce guide t'explique tout, étape par étape, pour démarrer ton business Amazon FBA en toute sérénité.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button size="lg" asChild className="text-lg px-8">
                  <Link to="/tarifs">
                    <ArrowRight className="w-5 h-5 mr-2" />
                    Accéder à l'espace membre AMZing FBA
                  </Link>
                </Button>
              </div>
            </div>
          </div>
        </section>

        {/* Section 1: C'est quoi Amazon FBA ? */}
        <section 
          ref={section1Anim.ref}
          className={cn(
            "py-20 transition-all duration-700",
            section1Anim.isVisible ? "opacity-100 translate-x-0" : "opacity-0 -translate-x-10"
          )}
        >
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto">
              <div className="flex items-center gap-3 mb-6">
                <div className="p-3 bg-primary/20 rounded-xl">
                  <Package className="w-8 h-8 text-primary" />
                </div>
                <h2 className="text-3xl md:text-4xl font-bold">C'est quoi Amazon FBA ?</h2>
              </div>
              
              <div className="prose prose-lg max-w-none">
                <p className="text-lg text-muted-foreground mb-6">
                  <strong>FBA signifie "Fulfillment By Amazon"</strong>, c'est-à-dire "Expédié par Amazon". Concrètement, tu envoies tes produits dans les entrepôts Amazon, et c'est Amazon qui se charge de tout : stockage, emballage, livraison, service client et gestion des retours.
                </p>
                
                <Card className="border-primary/30 mb-6">
                  <CardContent className="pt-6">
                    <div className="grid md:grid-cols-2 gap-6">
                      <div>
                        <h3 className="font-semibold text-lg mb-3 flex items-center gap-2">
                          <CheckCircle2 className="w-5 h-5 text-green-500" />
                          Avantages FBA
                        </h3>
                        <ul className="space-y-2 text-muted-foreground">
                          <li>• Livraison rapide (Prime)</li>
                          <li>• Gestion logistique simplifiée</li>
                          <li>• Service client géré par Amazon</li>
                          <li>• Meilleure visibilité sur la marketplace</li>
                        </ul>
                      </div>
                      <div>
                        <h3 className="font-semibold text-lg mb-3 flex items-center gap-2">
                          <TrendingUp className="w-5 h-5 text-primary" />
                          Pourquoi c'est intéressant
                        </h3>
                        <ul className="space-y-2 text-muted-foreground">
                          <li>• Business scalable</li>
                          <li>• Pas besoin de gérer les colis</li>
                          <li>• Accès à des millions de clients</li>
                          <li>• Travail depuis n'importe où</li>
                        </ul>
                      </div>
                    </div>
                  </CardContent>
                </Card>
                
                <p className="text-lg text-muted-foreground">
                  Avec <strong>AMZing FBA</strong>, tu bénéficies d'une solution tout-en-un : nous trouvons les produits rentables pour toi, te mettons en contact avec des fournisseurs fiables, te donnons accès à des listings exclusifs, et proposons des services de livraison et une marketplace dédiée.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Section 2: Comment vendre sur Amazon */}
        <section 
          ref={section2Anim.ref}
          className={cn(
            "py-20 bg-accent/30 transition-all duration-700",
            section2Anim.isVisible ? "opacity-100 translate-x-0" : "opacity-0 translate-x-10"
          )}
        >
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto">
              <div className="flex items-center gap-3 mb-8">
                <div className="p-3 bg-secondary/20 rounded-xl">
                  <ShoppingCart className="w-8 h-8 text-secondary" />
                </div>
                <h2 className="text-3xl md:text-4xl font-bold">Comment vendre sur Amazon étape par étape</h2>
              </div>
              
              <div className="space-y-6">
                {[
                  {
                    step: 1,
                    title: "Créer ta société",
                    description: "Pour vendre sur Amazon, tu dois avoir un statut professionnel : micro-entreprise, SASU, SARL... C'est obligatoire pour ouvrir un compte vendeur."
                  },
                  {
                    step: 2,
                    title: "Ouvrir un compte Amazon Seller",
                    description: "Inscription sur Amazon Seller Central avec les informations de ta société. Compte professionnel à 39€/mois (hors TVA)."
                  },
                  {
                    step: 3,
                    title: "Rejoindre AMZing FBA",
                    description: "Abonne-toi à AMZing FBA et reçois chaque semaine des produits rentables prêts à vendre. Tu n'as plus qu'à copier-coller nos opportunités validées."
                  },
                  {
                    step: 4,
                    title: "Acheter, lister et encaisser",
                    description: "Commande les produits chez nos fournisseurs partenaires, mets-les en vente sur ton compte Amazon Seller, et encaisse tes bénéfices. Simple, efficace, rentable."
                  },
                  {
                    step: 5,
                    title: "Stocker et expédier",
                    description: "Envoie tes produits dans les entrepôts Amazon (FBA), ou stocke-les chez toi et expédie à chaque vente (FBM), ou délègue tout à notre service AMZing FBA 360. À toi de choisir !"
                  },
                  {
                    step: 6,
                    title: "Scaler ton business",
                    description: "Réinvestis tes gains, développe ton catalogue et fais grandir ton business Amazon mois après mois."
                  }
                ].map((item) => (
                  <Card key={item.step} className="border-primary/20 hover:border-primary/40 transition-all hover:shadow-lg">
                    <CardContent className="pt-6">
                      <div className="flex items-start gap-4">
                        <div className="p-3 rounded-xl bg-primary text-white text-xl font-bold min-w-[50px] text-center">
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

        {/* Section 3: Les erreurs des débutants */}
        <section 
          ref={section3Anim.ref}
          className={cn(
            "py-20 transition-all duration-700",
            section3Anim.isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"
          )}
        >
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto">
              <div className="flex items-center gap-3 mb-8">
                <div className="p-3 bg-destructive/20 rounded-xl">
                  <AlertTriangle className="w-8 h-8 text-destructive" />
                </div>
                <h2 className="text-3xl md:text-4xl font-bold">Les erreurs des débutants sur Amazon FBA</h2>
              </div>
              
              <div className="grid md:grid-cols-2 gap-6">
                {[
                  {
                    title: "Se lancer sans formation",
                    description: "Amazon FBA a ses règles et ses subtilités. Sans connaissances, tu risques de perdre temps et argent."
                  },
                  {
                    title: "Choisir des produits au hasard",
                    description: "Un produit qui te plaît n'est pas forcément rentable. L'analyse des données est essentielle."
                  },
                  {
                    title: "Sous-estimer les frais",
                    description: "Frais Amazon, frais de port, TVA... Il faut tout calculer avant d'acheter pour éviter les mauvaises surprises."
                  },
                  {
                    title: "Ignorer les restrictions",
                    description: "Certaines catégories nécessitent des autorisations. Vérifie toujours avant d'investir dans un produit."
                  },
                  {
                    title: "Négliger la trésorerie",
                    description: "Amazon te paie tous les 15 jours. Prévois une trésorerie suffisante pour tes premiers mois."
                  },
                  {
                    title: "Vouloir aller trop vite",
                    description: "Commence petit, apprends, puis scale. C'est la méthode la plus sûre pour réussir."
                  }
                ].map((error, index) => (
                  <Card key={index} className="border-destructive/20 bg-destructive/5">
                    <CardHeader className="pb-2">
                      <CardTitle className="text-lg flex items-center gap-2">
                        <span className="text-destructive">✗</span>
                        {error.title}
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-muted-foreground">{error.description}</p>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* Section 4: Pourquoi AMZing FBA */}
        <section 
          ref={section4Anim.ref}
          className={cn(
            "py-20 bg-gradient-to-br from-primary/10 via-background to-secondary/10 transition-all duration-700",
            section4Anim.isVisible ? "opacity-100 scale-100" : "opacity-0 scale-95"
          )}
        >
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto">
              <div className="flex items-center gap-3 mb-8">
                <div className="p-3 bg-primary/20 rounded-xl">
                  <Lightbulb className="w-8 h-8 text-primary" />
                </div>
                <h2 className="text-3xl md:text-4xl font-bold">Pourquoi utiliser AMZing FBA pour se lancer</h2>
              </div>
              
              <p className="text-lg text-muted-foreground mb-8">
                AMZing FBA a été créé pour accompagner les vendeurs Amazon, du débutant au professionnel. Notre plateforme combine <strong>formation, outils et communauté</strong> pour t'aider à réussir plus vite.
              </p>
              
              <div className="grid md:grid-cols-3 gap-6 mb-10">
                <Card className="border-primary/30 text-center">
                  <CardContent className="pt-6">
                    <BookOpen className="w-12 h-12 text-primary mx-auto mb-4" />
                    <h3 className="font-bold text-lg mb-2">Formation complète</h3>
                    <p className="text-muted-foreground text-sm">Guides détaillés pour maîtriser Amazon FBA de A à Z</p>
                  </CardContent>
                </Card>
                
                <Card className="border-primary/30 text-center">
                  <CardContent className="pt-6">
                    <Target className="w-12 h-12 text-primary mx-auto mb-4" />
                    <h3 className="font-bold text-lg mb-2">Produits analysés</h3>
                    <p className="text-muted-foreground text-sm">Catalogue de produits rentables mis à jour régulièrement</p>
                  </CardContent>
                </Card>
                
                <Card className="border-primary/30 text-center">
                  <CardContent className="pt-6">
                    <Users className="w-12 h-12 text-primary mx-auto mb-4" />
                    <h3 className="font-bold text-lg mb-2">Communauté active</h3>
                    <p className="text-muted-foreground text-sm">Échange avec des vendeurs expérimentés 7j/7</p>
                  </CardContent>
                </Card>
              </div>
              
              <Card className="bg-gradient-to-r from-primary to-secondary text-white border-none">
                <CardContent className="py-10 text-center">
                  <h3 className="text-2xl font-bold mb-4">Prêt à te lancer sur Amazon FBA ?</h3>
                  <p className="text-white/90 mb-6 max-w-2xl mx-auto">
                    Rejoins AMZing FBA et accède à tout ce dont tu as besoin pour démarrer ton business Amazon en toute confiance.
                  </p>
                  <Button size="lg" variant="secondary" asChild className="text-lg px-8">
                    <Link to="/tarifs">
                      Accéder à l'espace membre AMZing FBA
                      <ArrowRight className="w-5 h-5 ml-2" />
                    </Link>
                  </Button>
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
