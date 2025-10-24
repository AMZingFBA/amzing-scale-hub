import { ArrowRight, Package, GraduationCap, Warehouse, Users, CheckCircle2, TrendingUp } from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import heroWarehouse from "@/assets/hero-warehouse.jpg";
import teamWorking from "@/assets/team-working.jpg";
import logistics from "@/assets/logistics.jpg";

const Index = () => {
  return (
    <div className="min-h-screen">
      <Navbar />
      
      {/* Hero Section */}
      <section className="relative pt-32 pb-20 overflow-hidden">
        <div className="absolute inset-0 z-0">
          <img 
            src={heroWarehouse} 
            alt="Warehouse" 
            className="w-full h-full object-cover opacity-10"
          />
          <div className="absolute inset-0 bg-gradient-to-br from-primary/20 via-background to-secondary/20" />
        </div>
        
        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-4xl mx-auto text-center">
            <Badge className="mb-6 bg-primary/10 text-primary border-primary/20">
              15 jours gratuits | Sans engagement | Moniteurs automatiques
            </Badge>
            
            <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold mb-6 leading-tight">
              AMZing FBA — De 0 à 100k €
            </h1>
            
            <p className="text-xl md:text-2xl text-muted-foreground mb-8 max-w-3xl mx-auto">
              Rejoins le Discord VIP et accède aux moniteurs de produits rentables, 
              guides Amazon FBA, fournisseurs privés, stock checker et bien plus.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button variant="hero" size="xl" asChild>
                <Link to="/tarifs">
                  Commencer l'essai gratuit <ArrowRight className="ml-2" />
                </Link>
              </Button>
              <Button variant="outline" size="xl" asChild>
                <Link to="/services">
                  Découvrir les avantages
                </Link>
              </Button>
            </div>
            <p className="mt-6 text-muted-foreground text-lg">
              34,99€/mois HT après l'essai gratuit
            </p>
          </div>
        </div>
      </section>

      {/* 3 Reasons Section */}
      <section className="py-20 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold mb-4">Tout inclus dans l'abonnement</h2>
            <p className="text-xl text-muted-foreground">34,99€/mois HT pour un accès complet</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <Card className="border-2 hover:border-primary transition-colors">
              <CardContent className="pt-8 text-center">
                <div className="w-16 h-16 bg-gradient-to-br from-primary to-primary-glow rounded-2xl flex items-center justify-center mx-auto mb-6">
                  <TrendingUp className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-2xl font-bold mb-4">Moniteurs automatiques</h3>
                <p className="text-muted-foreground">
                  Robots qui détectent les produits rentables sur Qogita, Auchan, King Jouet et plus.
                </p>
              </CardContent>
            </Card>

            <Card className="border-2 hover:border-primary transition-colors">
              <CardContent className="pt-8 text-center">
                <div className="w-16 h-16 bg-gradient-to-br from-secondary to-accent rounded-2xl flex items-center justify-center mx-auto mb-6">
                  <GraduationCap className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-2xl font-bold mb-4">Guides & Formation FBA</h3>
                <p className="text-muted-foreground">
                  Apprends Amazon FBA de A à Z avec nos guides exclusifs et conseils d'experts.
                </p>
              </CardContent>
            </Card>

            <Card className="border-2 hover:border-primary transition-colors">
              <CardContent className="pt-8 text-center">
                <div className="w-16 h-16 bg-gradient-to-br from-primary to-secondary rounded-2xl flex items-center justify-center mx-auto mb-6">
                  <Package className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-2xl font-bold mb-4">Fournisseurs privés</h3>
                <p className="text-muted-foreground">
                  Accès à notre listing de fournisseurs testés et produits à fort potentiel.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* What's Included */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <Badge className="mb-4 bg-primary/10 text-primary border-primary/20">
              Accès complet
            </Badge>
            <h2 className="text-4xl md:text-5xl font-bold mb-4">
              Ce Que Tu Obtiens
            </h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Tous les outils et ressources pour réussir sur Amazon FBA
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            <Card className="border-2 border-primary/20">
              <CardContent className="pt-6">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-gradient-to-br from-primary to-primary-glow rounded-xl flex items-center justify-center flex-shrink-0">
                    <TrendingUp className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold mb-2">Moniteurs produits</h3>
                    <p className="text-muted-foreground text-sm">
                      Notifications temps réel de produits rentables sur Qogita, Auchan, King Jouet...
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="border-2 border-primary/20">
              <CardContent className="pt-6">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-gradient-to-br from-secondary to-accent rounded-xl flex items-center justify-center flex-shrink-0">
                    <GraduationCap className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold mb-2">Guides Amazon FBA</h3>
                    <p className="text-muted-foreground text-sm">
                      Formation complète de A à Z pour maîtriser Amazon FBA
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="border-2 border-primary/20">
              <CardContent className="pt-6">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-gradient-to-br from-primary to-secondary rounded-xl flex items-center justify-center flex-shrink-0">
                    <Package className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold mb-2">Fournisseurs privés</h3>
                    <p className="text-muted-foreground text-sm">
                      Listing exclusif de produits sourcés et testés
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="border-2 border-primary/20">
              <CardContent className="pt-6">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-gradient-to-br from-secondary to-primary rounded-xl flex items-center justify-center flex-shrink-0">
                    <CheckCircle2 className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold mb-2">Stock Checker</h3>
                    <p className="text-muted-foreground text-sm">
                      Vérifie la disponibilité en magasin en temps réel
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="border-2 border-primary/20">
              <CardContent className="pt-6">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-gradient-to-br from-primary to-secondary rounded-xl flex items-center justify-center flex-shrink-0">
                    <Warehouse className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold mb-2">Service logistique</h3>
                    <p className="text-muted-foreground text-sm">
                      Stockage et expédition sous 24h disponibles
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="border-2 border-primary/20">
              <CardContent className="pt-6">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-gradient-to-br from-secondary to-accent rounded-xl flex items-center justify-center flex-shrink-0">
                    <TrendingUp className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold mb-2">Réductions exclusives</h3>
                    <p className="text-muted-foreground text-sm">
                      Tarifs préférentiels sur emballages et services
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="text-center mt-12">
            <Button variant="hero" size="xl" asChild>
              <Link to="/services">
                Voir tous les avantages <ArrowRight className="ml-2" />
              </Link>
            </Button>
          </div>
        </div>
      </section>

      {/* AMZing FBA 360 Section */}
      <section className="py-20 bg-muted/30">
        <div className="container mx-auto px-4">
          <Card className="border-2 border-primary/20 shadow-2xl overflow-hidden max-w-6xl mx-auto">
            <div className="grid md:grid-cols-2 gap-0">
              <div className="bg-gradient-to-br from-primary/10 via-secondary/10 to-primary/5 p-12 flex flex-col justify-center">
                <Badge className="mb-4 bg-primary/20 text-primary border-primary/30 w-fit">
                  Service Premium Inclus
                </Badge>
                <h2 className="text-4xl font-bold mb-6 text-gradient">
                  🚛 AMZing FBA 360
                </h2>
                <p className="text-xl font-semibold mb-4">
                  Votre solution logistique tout-en-un
                </p>
                <p className="text-muted-foreground text-lg leading-relaxed mb-4">
                  AMZing FBA 360 est une solution complète pensée pour les vendeurs Amazon.
                </p>
                <p className="text-muted-foreground leading-relaxed">
                  Nous agissons comme votre propre centre logistique, <strong className="text-foreground">plus flexible et plus abordable que le FBA d'Amazon</strong>.
                </p>
              </div>
              <div className="p-12 bg-background">
                <div className="space-y-6">
                  <div>
                    <h3 className="text-xl font-bold mb-3">Comment ça marche ?</h3>
                    <ul className="space-y-3 text-muted-foreground">
                      <li className="flex items-start gap-3">
                        <CheckCircle2 className="w-5 h-5 text-primary flex-shrink-0 mt-1" />
                        <span>Nous fournissons vos produits rentables</span>
                      </li>
                      <li className="flex items-start gap-3">
                        <CheckCircle2 className="w-5 h-5 text-primary flex-shrink-0 mt-1" />
                        <span>Stockage dans nos entrepôts sécurisés</span>
                      </li>
                      <li className="flex items-start gap-3">
                        <CheckCircle2 className="w-5 h-5 text-primary flex-shrink-0 mt-1" />
                        <span>Emballage aux standards Amazon</span>
                      </li>
                      <li className="flex items-start gap-3">
                        <CheckCircle2 className="w-5 h-5 text-primary flex-shrink-0 mt-1" />
                        <span>Expédition sous 24h à vos clients</span>
                      </li>
                      <li className="flex items-start gap-3">
                        <CheckCircle2 className="w-5 h-5 text-primary flex-shrink-0 mt-1" />
                        <span>Gestion du SAV et suivi des commandes</span>
                      </li>
                    </ul>
                  </div>
                  <div className="pt-4 border-t">
                    <div className="bg-primary/10 rounded-lg p-4">
                      <p className="font-semibold text-lg mb-2">💰 Économisez jusqu'à 30%</p>
                      <p className="text-sm text-muted-foreground">
                        Frais de stockage et d'expédition inférieurs à Amazon FBA, avec un contrôle total sur vos marges
                      </p>
                    </div>
                  </div>
                  <p className="text-sm text-muted-foreground italic pt-4">
                    AMZing FBA 360 = Votre grossiste + Votre entrepôt + Votre partenaire logistique
                  </p>
                </div>
              </div>
            </div>
          </Card>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-20 bg-gradient-to-br from-primary/10 via-background to-secondary/10">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            <div className="text-center">
              <div className="text-4xl md:text-5xl font-bold text-gradient mb-2">500+</div>
              <div className="text-muted-foreground">Membres actifs</div>
            </div>
            <div className="text-center">
              <div className="text-4xl md:text-5xl font-bold text-gradient mb-2">200+</div>
              <div className="text-muted-foreground">Produits sourcés</div>
            </div>
            <div className="text-center">
              <div className="text-4xl md:text-5xl font-bold text-gradient mb-2">24h</div>
              <div className="text-muted-foreground">Délai de préparation</div>
            </div>
            <div className="text-center">
              <div className="text-4xl md:text-5xl font-bold text-gradient mb-2">95%</div>
              <div className="text-muted-foreground">Satisfaction client</div>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold mb-4">
              Ce que disent nos clients
            </h2>
            <p className="text-muted-foreground">
              EXEMPLE - Témoignages à remplacer par de vrais avis clients
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <Card>
              <CardContent className="pt-6">
                <div className="flex items-center mb-4">
                  {[...Array(5)].map((_, i) => (
                    <CheckCircle2 key={i} className="w-5 h-5 text-primary" />
                  ))}
                </div>
                <p className="text-muted-foreground mb-4">
                  "EXEMPLE - Grâce à AMZing FBA j'ai fait mes 1ères ventes en 2 semaines. Support rapide et stockage nickel."
                </p>
                <p className="font-semibold">— Julien, client</p>
                <p className="text-sm text-muted-foreground">(À remplacer par témoignage réel)</p>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="pt-6">
                <div className="flex items-center mb-4">
                  {[...Array(5)].map((_, i) => (
                    <CheckCircle2 key={i} className="w-5 h-5 text-primary" />
                  ))}
                </div>
                <p className="text-muted-foreground mb-4">
                  "EXEMPLE - La formation est claire et actionnable. Le catalogue m'a fait gagner des mois de recherche."
                </p>
                <p className="font-semibold">— Sophie, vendeuse FBA</p>
                <p className="text-sm text-muted-foreground">(À remplacer par témoignage réel)</p>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="pt-6">
                <div className="flex items-center mb-4">
                  {[...Array(5)].map((_, i) => (
                    <CheckCircle2 key={i} className="w-5 h-5 text-primary" />
                  ))}
                </div>
                <p className="text-muted-foreground mb-4">
                  "EXEMPLE - Le service de fulfilment m'a permis de me concentrer sur la croissance. ROI incroyable!"
                </p>
                <p className="font-semibold">— Marc, entrepreneur</p>
                <p className="text-sm text-muted-foreground">(À remplacer par témoignage réel)</p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-primary to-secondary">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
            Prêt à démarrer sur Amazon ?
          </h2>
          <p className="text-xl text-white/90 mb-8 max-w-2xl mx-auto">
            Essaie gratuitement pendant 15 jours, sans engagement
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button variant="secondary" size="xl" asChild className="bg-white text-primary hover:bg-white/90">
              <Link to="/tarifs">
                Commencer l'essai gratuit
              </Link>
            </Button>
            <Button variant="outline" size="xl" className="border-white text-white hover:bg-white/10" asChild>
              <Link to="/contact">
                Nous contacter
              </Link>
            </Button>
          </div>
          <p className="mt-6 text-white/90 text-lg">
            34,99€/mois HT après l'essai gratuit
          </p>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Index;
