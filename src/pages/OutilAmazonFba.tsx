import { ArrowRight, ArrowLeft, CheckCircle2, Clock, TrendingUp, Search, BarChart3, Shield, Zap, Users, Target } from 'lucide-react';
import { Link } from 'react-router-dom';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import SEO from '@/components/SEO';
import { seoData, schemas } from '@/lib/seo-data';
import { useScrollReveal } from '@/hooks/use-scroll-reveal';
import { cn } from '@/lib/utils';

const OutilAmazonFba = () => {
  const heroAnim = useScrollReveal({ animation: 'fade-up', delay: 100 });
  const section1Anim = useScrollReveal({ animation: 'fade-left', delay: 100 });
  const section2Anim = useScrollReveal({ animation: 'fade-right', delay: 100 });
  const section3Anim = useScrollReveal({ animation: 'fade-up', delay: 100 });
  const section4Anim = useScrollReveal({ animation: 'scale', delay: 100 });

  return (
    <div className="min-h-screen flex flex-col">
      <SEO 
        title={seoData.outilAmazonFba.title}
        description={seoData.outilAmazonFba.description}
        keywords={seoData.outilAmazonFba.keywords}
        robots={seoData.outilAmazonFba.robots}
        schema={schemas.outilAmazonFbaArticle}
      />
      <Navbar />
      
      {/* Back Button */}
      <div className="fixed top-24 left-4 z-40">
        <Link 
          to="/" 
          className="flex items-center justify-center w-10 h-10 rounded-full bg-primary text-primary-foreground shadow-lg hover:bg-primary/90 hover:scale-110 transition-all duration-200"
        >
          <ArrowLeft className="w-5 h-5" />
        </Link>
      </div>

      <main className="flex-grow">
        {/* Hero Section */}
        <section 
          ref={heroAnim.ref}
          className={cn(
            "pt-32 pb-20 bg-gradient-to-br from-secondary/10 via-background to-primary/10 transition-all duration-700",
            heroAnim.isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"
          )}
        >
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto text-center">
              <span className="inline-block px-4 py-2 bg-secondary/20 text-secondary rounded-full text-sm font-medium mb-6">
                Solution tout-en-un
              </span>
              <h1 className="text-4xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-secondary via-primary to-secondary bg-clip-text text-transparent">
                Outil Amazon FBA : gagner du temps et éviter les erreurs
              </h1>
              <p className="text-xl text-muted-foreground mb-8 max-w-3xl mx-auto">
                Tu cherches un outil performant pour développer ton business Amazon FBA ? Découvre comment AMZing FBA t'aide à trouver des produits rentables et à optimiser tes ventes.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button size="lg" asChild className="text-lg px-8">
                  <Link to="/tarifs">
                    <ArrowRight className="w-5 h-5 mr-2" />
                    Découvrir AMZing FBA
                  </Link>
                </Button>
              </div>
            </div>
          </div>
        </section>

        {/* Section 1: Pourquoi utiliser un outil */}
        <section 
          ref={section1Anim.ref}
          className={cn(
            "py-20 transition-all duration-700",
            section1Anim.isVisible ? "opacity-100 translate-x-0" : "opacity-0 -translate-x-10"
          )}
        >
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto">
              <div className="flex items-center gap-3 mb-8">
                <div className="p-3 bg-primary/20 rounded-xl">
                  <Clock className="w-8 h-8 text-primary" />
                </div>
                <h2 className="text-3xl md:text-4xl font-bold">Pourquoi utiliser un outil pour Amazon FBA</h2>
              </div>
              
              <p className="text-lg text-muted-foreground mb-8">
                Vendre sur Amazon sans outil, c'est comme naviguer sans boussole. Un bon outil Amazon FBA te permet de <strong>prendre des décisions éclairées</strong>, d'économiser du temps et surtout d'éviter les erreurs coûteuses.
              </p>
              
              <div className="grid md:grid-cols-2 gap-6">
                <Card className="border-primary/30">
                  <CardContent className="pt-6">
                    <div className="flex items-start gap-4">
                      <div className="p-3 bg-green-500/20 rounded-lg">
                        <Clock className="w-6 h-6 text-green-500" />
                      </div>
                      <div>
                        <h3 className="font-bold text-lg mb-2">Gain de temps considérable</h3>
                        <p className="text-muted-foreground">
                          Analyse automatique des produits, calcul des marges en temps réel, identification rapide des opportunités.
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
                
                <Card className="border-primary/30">
                  <CardContent className="pt-6">
                    <div className="flex items-start gap-4">
                      <div className="p-3 bg-blue-500/20 rounded-lg">
                        <Shield className="w-6 h-6 text-blue-500" />
                      </div>
                      <div>
                        <h3 className="font-bold text-lg mb-2">Réduction des risques</h3>
                        <p className="text-muted-foreground">
                          Données fiables pour éviter les produits non rentables ou les catégories trop compétitives.
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
                
                <Card className="border-primary/30">
                  <CardContent className="pt-6">
                    <div className="flex items-start gap-4">
                      <div className="p-3 bg-purple-500/20 rounded-lg">
                        <TrendingUp className="w-6 h-6 text-purple-500" />
                      </div>
                      <div>
                        <h3 className="font-bold text-lg mb-2">Meilleure rentabilité</h3>
                        <p className="text-muted-foreground">
                          Identification des produits à forte marge et optimisation de ton catalogue pour maximiser tes profits.
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
                
                <Card className="border-primary/30">
                  <CardContent className="pt-6">
                    <div className="flex items-start gap-4">
                      <div className="p-3 bg-orange-500/20 rounded-lg">
                        <Zap className="w-6 h-6 text-orange-500" />
                      </div>
                      <div>
                        <h3 className="font-bold text-lg mb-2">Avantage concurrentiel</h3>
                        <p className="text-muted-foreground">
                          Détection rapide des nouvelles opportunités avant les autres vendeurs.
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
        </section>

        {/* Section 2: Ce que doit faire un bon outil */}
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
                  <Search className="w-8 h-8 text-secondary" />
                </div>
                <h2 className="text-3xl md:text-4xl font-bold">Ce que doit faire un bon outil Amazon</h2>
              </div>
              
              <p className="text-lg text-muted-foreground mb-8">
                Un outil Amazon FBA efficace doit couvrir l'ensemble des besoins d'un vendeur professionnel. Voici les fonctionnalités essentielles à rechercher :
              </p>
              
              <div className="space-y-4">
                {[
                  {
                    icon: Search,
                    title: "Recherche de produits",
                    description: "Scanner des codes-barres, analyser des ASIN, identifier des niches rentables avec des critères précis."
                  },
                  {
                    icon: BarChart3,
                    title: "Analyse de rentabilité",
                    description: "Calcul automatique du ROI, des frais Amazon (FBA fees), de la marge nette et du point mort."
                  },
                  {
                    icon: TrendingUp,
                    title: "Suivi des ventes",
                    description: "Estimation des ventes mensuelles, historique des prix, évolution du BSR (Best Sellers Rank)."
                  },
                  {
                    icon: Shield,
                    title: "Vérification des restrictions",
                    description: "Détection automatique des catégories bloquées et des produits nécessitant une autorisation."
                  },
                  {
                    icon: Zap,
                    title: "Alertes et notifications",
                    description: "Alerte sur les baisses de prix, les opportunités d'achat et les changements de marché."
                  }
                ].map((feature, index) => {
                  const Icon = feature.icon;
                  return (
                    <Card key={index} className="border-primary/20 hover:border-primary/40 transition-all hover:shadow-lg">
                      <CardContent className="pt-6">
                        <div className="flex items-start gap-4">
                          <div className="p-3 rounded-xl bg-primary/10">
                            <Icon className="w-6 h-6 text-primary" />
                          </div>
                          <div>
                            <h3 className="font-bold text-xl mb-2">{feature.title}</h3>
                            <p className="text-muted-foreground">{feature.description}</p>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  );
                })}
              </div>
            </div>
          </div>
        </section>

        {/* Section 3: Comment AMZing FBA aide */}
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
                <div className="p-3 bg-primary/20 rounded-xl">
                  <Target className="w-8 h-8 text-primary" />
                </div>
                <h2 className="text-3xl md:text-4xl font-bold">Comment AMZing FBA aide les vendeurs</h2>
              </div>
              
              <p className="text-lg text-muted-foreground mb-8">
                AMZing FBA n'est pas qu'un simple outil : c'est une <strong>plateforme complète</strong> qui combine outils, formation et communauté pour t'accompagner à chaque étape de ton business.
              </p>
              
              <div className="grid md:grid-cols-2 gap-6 mb-8">
                {[
                  "Catalogue de produits rentables analysés et validés",
                  "Alertes en temps réel sur les nouvelles opportunités",
                  "Calculs de rentabilité automatiques (ROI, marge, frais)",
                  "Formation complète pour maîtriser Amazon FBA",
                  "Support réactif et communauté d'entraide",
                  "Outils de sourcing et analyse de marché"
                ].map((feature, index) => (
                  <div key={index} className="flex items-center gap-3 p-4 rounded-lg bg-primary/5 border border-primary/20">
                    <CheckCircle2 className="w-6 h-6 text-green-500 flex-shrink-0" />
                    <span className="font-medium">{feature}</span>
                  </div>
                ))}
              </div>
              
              <Card className="border-primary/30 bg-gradient-to-r from-primary/5 to-secondary/5">
                <CardContent className="pt-6">
                  <p className="text-lg text-center">
                    <strong>Résultat :</strong> Tu gagnes du temps, tu évites les erreurs de débutant et tu développes ton business Amazon FBA plus rapidement.
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>

        {/* Section 4: Pour qui est fait AMZing FBA */}
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
                <div className="p-3 bg-secondary/20 rounded-xl">
                  <Users className="w-8 h-8 text-secondary" />
                </div>
                <h2 className="text-3xl md:text-4xl font-bold">Pour qui est fait AMZing FBA</h2>
              </div>
              
              <div className="grid md:grid-cols-3 gap-6 mb-10">
                <Card className="border-primary/30 text-center hover:shadow-lg transition-all">
                  <CardContent className="pt-6">
                    <div className="w-16 h-16 bg-green-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
                      <span className="text-3xl">🌱</span>
                    </div>
                    <h3 className="font-bold text-lg mb-2">Débutants</h3>
                    <p className="text-muted-foreground text-sm">
                      Tu veux te lancer sur Amazon mais tu ne sais pas par où commencer ? AMZing FBA te guide pas à pas.
                    </p>
                  </CardContent>
                </Card>
                
                <Card className="border-primary/30 text-center hover:shadow-lg transition-all">
                  <CardContent className="pt-6">
                    <div className="w-16 h-16 bg-blue-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
                      <span className="text-3xl">📈</span>
                    </div>
                    <h3 className="font-bold text-lg mb-2">Vendeurs actifs</h3>
                    <p className="text-muted-foreground text-sm">
                      Tu vends déjà sur Amazon et tu veux accélérer ta croissance ? Nos outils t'aident à scaler.
                    </p>
                  </CardContent>
                </Card>
                
                <Card className="border-primary/30 text-center hover:shadow-lg transition-all">
                  <CardContent className="pt-6">
                    <div className="w-16 h-16 bg-purple-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
                      <span className="text-3xl">🎯</span>
                    </div>
                    <h3 className="font-bold text-lg mb-2">Professionnels</h3>
                    <p className="text-muted-foreground text-sm">
                      Tu cherches une solution fiable et des produits validés ? Notre catalogue répond à tes exigences.
                    </p>
                  </CardContent>
                </Card>
              </div>
              
              <Card className="bg-gradient-to-r from-secondary to-primary text-white border-none">
                <CardContent className="py-10 text-center">
                  <h3 className="text-2xl font-bold mb-4">Prêt à booster ton business Amazon FBA ?</h3>
                  <p className="text-white/90 mb-6 max-w-2xl mx-auto">
                    Rejoins les centaines de vendeurs qui utilisent AMZing FBA pour développer leur activité sur Amazon.
                  </p>
                  <Button size="lg" variant="secondary" asChild className="text-lg px-8">
                    <Link to="/tarifs">
                      Découvrir AMZing FBA
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

export default OutilAmazonFba;
