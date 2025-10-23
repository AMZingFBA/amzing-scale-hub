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
              Support & Logistique | Accès Discord Privé | Paiement Sécurisé
            </Badge>
            
            <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold mb-6 leading-tight">
              AMZing FBA — De 0 à 100k €
            </h1>
            
            <p className="text-xl md:text-2xl text-muted-foreground mb-8 max-w-3xl mx-auto">
              Formation pratique + catalogue produits rentables + stockage & expédition. 
              Tout ce qu'il faut pour lancer et scaler sur Amazon.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button variant="hero" size="xl" asChild>
                <Link to="/formation">
                  Découvrir la formation <ArrowRight className="ml-2" />
                </Link>
              </Button>
              <Button variant="outline" size="xl" asChild>
                <Link to="/catalogue">
                  Voir le catalogue
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* 3 Reasons Section */}
      <section className="py-20 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <Card className="border-2 hover:border-primary transition-colors">
              <CardContent className="pt-8 text-center">
                <div className="w-16 h-16 bg-gradient-to-br from-primary to-primary-glow rounded-2xl flex items-center justify-center mx-auto mb-6">
                  <GraduationCap className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-2xl font-bold mb-4">Formation sans bullshit</h3>
                <p className="text-muted-foreground">
                  Méthode pas à pas, retours concrets. Apprenez ce qui fonctionne vraiment.
                </p>
              </CardContent>
            </Card>

            <Card className="border-2 hover:border-primary transition-colors">
              <CardContent className="pt-8 text-center">
                <div className="w-16 h-16 bg-gradient-to-br from-secondary to-accent rounded-2xl flex items-center justify-center mx-auto mb-6">
                  <Package className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-2xl font-bold mb-4">Produits sourcés et testés</h3>
                <p className="text-muted-foreground">
                  Catalogue actualisé chaque semaine. Des produits rentables prêts à vendre.
                </p>
              </CardContent>
            </Card>

            <Card className="border-2 hover:border-primary transition-colors">
              <CardContent className="pt-8 text-center">
                <div className="w-16 h-16 bg-gradient-to-br from-primary to-secondary rounded-2xl flex items-center justify-center mx-auto mb-6">
                  <Warehouse className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-2xl font-bold mb-4">Logistique clé en main</h3>
                <p className="text-muted-foreground">
                  Stockage, emballage et expédition à la demande. Focus sur la vente.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Services Overview */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold mb-4">
              Nos Services
            </h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Un écosystème complet pour votre réussite sur Amazon
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            {/* Formation */}
            <div className="flex flex-col md:flex-row gap-6">
              <div className="w-16 h-16 bg-gradient-to-br from-primary to-primary-glow rounded-2xl flex items-center justify-center flex-shrink-0">
                <GraduationCap className="w-8 h-8 text-white" />
              </div>
              <div>
                <h3 className="text-2xl font-bold mb-3">Formation Amazon FBA</h3>
                <p className="text-muted-foreground mb-4">
                  Modules étape-par-étape de 0 aux premières ventes et au scaling. Templates Excel, checklists et support via Discord.
                </p>
                <Button variant="link" className="p-0" asChild>
                  <Link to="/formation">
                    En savoir plus <ArrowRight className="ml-2 w-4 h-4" />
                  </Link>
                </Button>
              </div>
            </div>

            {/* Discord Community */}
            <div className="flex flex-col md:flex-row gap-6">
              <div className="w-16 h-16 bg-gradient-to-br from-secondary to-accent rounded-2xl flex items-center justify-center flex-shrink-0">
                <Users className="w-8 h-8 text-white" />
              </div>
              <div>
                <h3 className="text-2xl font-bold mb-3">Communauté Discord Privée</h3>
                <p className="text-muted-foreground mb-4">
                  Abonnement mensuel avec alertes produits, hacks exclusifs, entraide et networking entre vendeurs.
                </p>
                <Button variant="link" className="p-0" asChild>
                  <a href="https://discord.com/channels/1430928328466108619/1430933836958531699" target="_blank" rel="noopener noreferrer">
                    Rejoindre maintenant <ArrowRight className="ml-2 w-4 h-4" />
                  </a>
                </Button>
              </div>
            </div>

            {/* Catalogue */}
            <div className="flex flex-col md:flex-row gap-6">
              <div className="w-16 h-16 bg-gradient-to-br from-primary to-secondary rounded-2xl flex items-center justify-center flex-shrink-0">
                <Package className="w-8 h-8 text-white" />
              </div>
              <div>
                <h3 className="text-2xl font-bold mb-3">Catalogue Produits Rentables</h3>
                <p className="text-muted-foreground mb-4">
                  Produits sourcés et testés. ROI estimé, prix gros et disponibilité en temps réel.
                </p>
                <Button variant="link" className="p-0" asChild>
                  <Link to="/catalogue">
                    Voir le catalogue <ArrowRight className="ml-2 w-4 h-4" />
                  </Link>
                </Button>
              </div>
            </div>

            {/* Fulfilment */}
            <div className="flex flex-col md:flex-row gap-6">
              <div className="w-16 h-16 bg-gradient-to-br from-secondary to-primary rounded-2xl flex items-center justify-center flex-shrink-0">
                <Warehouse className="w-8 h-8 text-white" />
              </div>
              <div>
                <h3 className="text-2xl font-bold mb-3">Stockage & Fulfilment</h3>
                <p className="text-muted-foreground mb-4">
                  Entreposage sécurisé, préparation sous 24-48h, envois nationaux et préparation FBA.
                </p>
                <Button variant="link" className="p-0" asChild>
                  <Link to="/fulfilment">
                    En savoir plus <ArrowRight className="ml-2 w-4 h-4" />
                  </Link>
                </Button>
              </div>
            </div>
          </div>
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
            Prêt à lancer votre business Amazon ?
          </h2>
          <p className="text-xl text-white/90 mb-8 max-w-2xl mx-auto">
            Rejoignez des centaines d'entrepreneurs qui ont transformé leur vie grâce à AMZing FBA
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button variant="secondary" size="xl" asChild className="bg-white text-primary hover:bg-white/90">
              <Link to="/formation">
                Commencer maintenant
              </Link>
            </Button>
            <Button variant="outline" size="xl" className="border-white text-white hover:bg-white/10" asChild>
              <Link to="/contact">
                Nous contacter
              </Link>
            </Button>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Index;
