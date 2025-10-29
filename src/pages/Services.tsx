import { Check, AlertCircle, GraduationCap, Package, TrendingUp, MessageSquare, Target, DollarSign, Truck, Headphones, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Link, useNavigate } from "react-router-dom";
import { useScrollReveal } from "@/hooks/use-scroll-reveal";
import { Capacitor } from "@capacitor/core";

const ServiceCard = ({ children, delay }: { children: React.ReactNode, delay: number }) => {
  const { ref, isVisible } = useScrollReveal({ delay });
  const isNativeApp = Capacitor.isNativePlatform();

  if (!isNativeApp) {
    return <>{children}</>;
  }

  return (
    <div
      ref={ref}
      className={`transition-all duration-500 ${
        isVisible 
          ? "opacity-100 translate-y-0" 
          : "opacity-0 translate-y-4"
      }`}
    >
      {children}
    </div>
  );
};

const Services = () => {
  const isNativeApp = Capacitor.isNativePlatform();
  const headerReveal = useScrollReveal({ delay: 0 });
  const navigate = useNavigate();
  
  return (
    <div className="min-h-screen">
      <Navbar />
      
      {/* Back button for mobile app */}
      {isNativeApp && (
        <button
          onClick={() => navigate(-1)}
          className="fixed top-[46px] left-[18px] z-50 bg-primary/10 backdrop-blur-sm p-2 rounded-full shadow-lg hover:bg-primary/20 transition-colors border border-primary/20"
          aria-label="Retour"
        >
          <ArrowLeft className="h-5 w-5 text-primary" />
        </button>
      )}
      
      <div className="pt-32 pb-20">
        <div className="container mx-auto px-4">
          <div 
            ref={isNativeApp ? headerReveal.ref : undefined}
            className={`text-center mb-16 ${
              isNativeApp && headerReveal.isVisible
                ? "opacity-100 translate-y-0 transition-all duration-500"
                : isNativeApp
                ? "opacity-0 translate-y-4"
                : ""
            }`}
          >
            <Badge className="mb-4 bg-primary/10 text-primary border-primary/20">
              Tout inclus dans l'espace VIP
            </Badge>
            <h1 className="text-5xl md:text-6xl font-bold mb-6">
              Ce Que Tu Obtiens
            </h1>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              Accès complet à tous les outils, ressources et services pour 34,99€/mois
            </p>
          </div>

          {/* Services Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-6xl mx-auto mb-16">
            {/* Moniteurs */}
            <ServiceCard delay={0}>
            <Card className={`border-2 border-primary hover:shadow-xl transition-all ${isNativeApp ? 'hover:border-primary/60 hover:shadow-[0_0_20px_rgba(255,153,0,0.3)]' : ''}`}>
              <CardHeader>
                <div className="w-16 h-16 bg-gradient-to-br from-primary to-secondary rounded-lg flex items-center justify-center mb-4">
                  <AlertCircle className="w-8 h-8 text-white" />
                </div>
                <CardTitle className="text-3xl">Moniteurs Automatiques</CardTitle>
                <CardDescription className="text-lg">Détection produits rentables 24/7</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground mb-6">
                  Nos robots scannent en permanence Qogita, Auchan, King Jouet et d'autres sites pour détecter 
                  les opportunités. Reçois des notifications instantanées dès qu'un produit rentable est trouvé.
                </p>
                <ul className="space-y-3">
                  <li className="flex items-start gap-2">
                    <Check className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
                    <span>Alertes temps réel sur la plateforme</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <Check className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
                    <span>Multi-sources (Qogita, Auchan, King Jouet...)</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <Check className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
                    <span>Analyse ROI automatique</span>
                  </li>
                </ul>
              </CardContent>
            </Card>
            </ServiceCard>

            {/* Guides FBA */}
            <ServiceCard delay={80}>
            <Card className={`border-2 hover:border-primary transition-all ${isNativeApp ? 'hover:shadow-[0_0_20px_rgba(255,153,0,0.3)]' : ''}`}>
              <CardHeader>
                <div className="w-16 h-16 bg-gradient-to-br from-secondary to-primary rounded-lg flex items-center justify-center mb-4">
                  <GraduationCap className="w-8 h-8 text-white" />
                </div>
                <CardTitle className="text-3xl">Guides Amazon FBA</CardTitle>
                <CardDescription className="text-lg">Formation complète</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground mb-6">
                  Apprends Amazon FBA de A à Z avec nos guides détaillés. De la création de compte Amazon 
                  au scaling, tous les secrets pour réussir.
                </p>
                <ul className="space-y-3">
                  <li className="flex items-start gap-2">
                    <Check className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
                    <span>Guides pas à pas illustrés</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <Check className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
                    <span>Stratégies de sourcing avancées</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <Check className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
                    <span>Templates & checklists</span>
                  </li>
                </ul>
              </CardContent>
            </Card>
            </ServiceCard>

            {/* Fournisseurs Privés */}
            <ServiceCard delay={160}>
            <Card className={`border-2 hover:border-primary transition-all ${isNativeApp ? 'hover:shadow-[0_0_20px_rgba(255,153,0,0.3)]' : ''}`}>
              <CardHeader>
                <div className="w-16 h-16 bg-gradient-to-br from-primary to-secondary rounded-lg flex items-center justify-center mb-4">
                  <Package className="w-8 h-8 text-white" />
                </div>
                <CardTitle className="text-3xl">Fournisseurs Privés</CardTitle>
                <CardDescription className="text-lg">Listing exclusif</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground mb-6">
                  Accède à notre réseau de fournisseurs testés et vérifiés. Produits sourcés avec marges 
                  analysées et potentiel de vente confirmé.
                </p>
                <ul className="space-y-3">
                  <li className="flex items-start gap-2">
                    <Check className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
                    <span>Fournisseurs vérifiés en France et Europe</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <Check className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
                    <span>Produits à fort ROI</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <Check className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
                    <span>Mises à jour régulières</span>
                  </li>
                </ul>
              </CardContent>
            </Card>
            </ServiceCard>

            {/* Stock Checker */}
            <ServiceCard delay={240}>
            <Card className={`border-2 hover:border-primary transition-all ${isNativeApp ? 'hover:shadow-[0_0_20px_rgba(255,153,0,0.3)]' : ''}`}>
              <CardHeader>
                <div className="w-16 h-16 bg-gradient-to-br from-secondary to-primary rounded-lg flex items-center justify-center mb-4">
                  <TrendingUp className="w-8 h-8 text-white" />
                </div>
                <CardTitle className="text-3xl">Stock Checker</CardTitle>
                <CardDescription className="text-lg">Disponibilité temps réel</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground mb-6">
                  Vérifie instantanément la disponibilité des produits en magasin avant de te déplacer. 
                  Économise du temps et maximise tes opportunités de sourcing.
                </p>
                <ul className="space-y-3">
                  <li className="flex items-start gap-2">
                    <Check className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
                    <span>Vérification stock magasin temps réel</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <Check className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
                    <span>Multi-enseignes</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <Check className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
                    <span>Interface simple et rapide</span>
                  </li>
                </ul>
              </CardContent>
            </Card>
            </ServiceCard>

            {/* Notifications */}
            <ServiceCard delay={320}>
            <Card className={`border-2 hover:border-primary transition-all ${isNativeApp ? 'hover:shadow-[0_0_20px_rgba(255,153,0,0.3)]' : ''}`}>
              <CardHeader>
                <div className="w-16 h-16 bg-gradient-to-br from-primary to-secondary rounded-lg flex items-center justify-center mb-4">
                  <MessageSquare className="w-8 h-8 text-white" />
                </div>
                <CardTitle className="text-3xl">Notifications Produits</CardTitle>
                <CardDescription className="text-lg">Instore & Online</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground mb-6">
                  Reçois des alertes pour les opportunités de sourcing en magasin et en ligne. 
                  Ne rate plus jamais une bonne affaire.
                </p>
                <ul className="space-y-3">
                  <li className="flex items-start gap-2">
                    <Check className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
                    <span>Alertes instantanées</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <Check className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
                    <span>Deals online et en magasin</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <Check className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
                    <span>Filtrage par niche</span>
                  </li>
                </ul>
              </CardContent>
            </Card>
            </ServiceCard>

            {/* Conseils Niches */}
            <ServiceCard delay={400}>
            <Card className={`border-2 hover:border-primary transition-all ${isNativeApp ? 'hover:shadow-[0_0_20px_rgba(255,153,0,0.3)]' : ''}`}>
              <CardHeader>
                <div className="w-16 h-16 bg-gradient-to-br from-secondary to-primary rounded-lg flex items-center justify-center mb-4">
                  <Target className="w-8 h-8 text-white" />
                </div>
                <CardTitle className="text-3xl">Conseils Niches Privées</CardTitle>
                <CardDescription className="text-lg">Investissements stratégiques</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground mb-6">
                  Profite de nos analyses de niches et conseils d'investissement basés sur les données 
                  du marché. Identifie les opportunités avant la concurrence.
                </p>
                <ul className="space-y-3">
                  <li className="flex items-start gap-2">
                    <Check className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
                    <span>Analyses de niches rentables</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <Check className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
                    <span>Tendances du marché</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <Check className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
                    <span>Stratégies de positionnement</span>
                  </li>
                </ul>
              </CardContent>
            </Card>
            </ServiceCard>

            {/* Réductions */}
            <ServiceCard delay={480}>
            <Card className={`border-2 hover:border-primary transition-all ${isNativeApp ? 'hover:shadow-[0_0_20px_rgba(255,153,0,0.3)]' : ''}`}>
              <CardHeader>
                <div className="w-16 h-16 bg-gradient-to-br from-primary to-secondary rounded-lg flex items-center justify-center mb-4">
                  <DollarSign className="w-8 h-8 text-white" />
                </div>
                <CardTitle className="text-3xl">Réductions Exclusives</CardTitle>
                <CardDescription className="text-lg">Tarifs préférentiels</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground mb-6">
                  Bénéficie de réductions sur les emballages, bordereaux d'expédition et services partenaires. 
                  Augmente tes marges dès le départ.
                </p>
                <ul className="space-y-3">
                  <li className="flex items-start gap-2">
                    <Check className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
                    <span>Emballages à prix réduit</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <Check className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
                    <span>Bordereaux d'expédition</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <Check className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
                    <span>Partenaires logistique</span>
                  </li>
                </ul>
              </CardContent>
            </Card>
            </ServiceCard>

            {/* Service Logistique */}
            <ServiceCard delay={560}>
            <Card className={`border-2 hover:border-primary transition-all ${isNativeApp ? 'hover:shadow-[0_0_20px_rgba(255,153,0,0.3)]' : ''}`}>
              <CardHeader>
                <div className="w-16 h-16 bg-gradient-to-br from-secondary to-primary rounded-lg flex items-center justify-center mb-4">
                  <Truck className="w-8 h-8 text-white" />
                </div>
                <CardTitle className="text-3xl">Service Logistique</CardTitle>
                <CardDescription className="text-lg">Stockage & expédition 24h</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground mb-6">
                  Confie ton stock à notre entrepôt. Nous gérons le stockage et expédions sous 24h. 
                  Service disponible pour les membres VIP.
                </p>
                <ul className="space-y-3">
                  <li className="flex items-start gap-2">
                    <Check className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
                    <span>Stockage sécurisé</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <Check className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
                    <span>Expédition rapide sous 24h</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <Check className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
                    <span>Préparation FBA disponible</span>
                  </li>
                </ul>
              </CardContent>
            </Card>
            </ServiceCard>
          </div>

          {/* AMZing FBA 360 Detailed Section */}
          <Card 
            id="amzing-360" 
            className="relative border-2 border-primary/20 shadow-2xl mb-16 scroll-mt-24 overflow-hidden animate-fade-in hover:shadow-[0_0_50px_rgba(255,153,0,0.3)] transition-all duration-500 group"
          >
            {/* Animated floating orbs background */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
              <div className="absolute top-10 left-10 w-32 h-32 bg-primary/10 rounded-full blur-3xl animate-float" style={{ animationDelay: '0s' }}></div>
              <div className="absolute bottom-10 right-10 w-40 h-40 bg-secondary/10 rounded-full blur-3xl animate-float" style={{ animationDelay: '2s' }}></div>
              <div className="absolute top-1/2 left-1/3 w-24 h-24 bg-accent/10 rounded-full blur-2xl animate-float" style={{ animationDelay: '4s' }}></div>
            </div>

            <CardHeader className="relative bg-gradient-to-r from-primary/10 via-secondary/10 to-primary/10 pb-8 animate-gradient-shift">
              <div className="flex items-center gap-3 mb-4 animate-fade-in" style={{ animationDelay: '0.1s' }}>
                <div className="text-4xl animate-float">🚛</div>
                <div>
                  <CardTitle className="text-3xl mb-2">AMZing FBA 360</CardTitle>
                  <CardDescription className="text-lg">Votre solution logistique tout-en-un</CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent className="relative p-8 z-10">
              <div className="prose prose-lg max-w-none mb-8 animate-fade-in" style={{ animationDelay: '0.2s' }}>
                <p className="text-lg leading-relaxed text-muted-foreground">
                  AMZing FBA 360 est une solution complète pensée pour les vendeurs Amazon. 
                  Nous agissons comme votre propre centre logistique, <strong className="text-foreground">plus flexible et plus abordable que le FBA d'Amazon</strong>.
                  Nous fournissons vos produits, les stockons dans nos entrepôts sécurisés, les emballons selon les standards Amazon, 
                  puis les expédions sous 24h à vos clients.
                </p>
                <p className="text-lg leading-relaxed text-muted-foreground">
                  Notre équipe gère également le SAV et le suivi des commandes, pour que vous n'ayez rien à faire.
                </p>
              </div>

              <div className="grid md:grid-cols-2 gap-8 mb-8">
                <div className="animate-fade-in" style={{ animationDelay: '0.3s' }}>
                  <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
                    <Package className="w-6 h-6 text-primary animate-pulse" />
                    Notre service complet
                  </h3>
                  <ul className="space-y-3">
                    <li className="flex items-start gap-3 group/item hover:translate-x-2 transition-transform duration-300 animate-fade-in" style={{ animationDelay: '0.4s' }}>
                      <Check className="w-5 h-5 text-primary flex-shrink-0 mt-1 group-hover/item:scale-110 transition-transform" />
                      <div>
                        <span className="font-semibold">Sourcing produits</span>
                        <p className="text-sm text-muted-foreground">Nous fournissons les produits rentables</p>
                      </div>
                    </li>
                    <li className="flex items-start gap-3 group/item hover:translate-x-2 transition-transform duration-300 animate-fade-in" style={{ animationDelay: '0.5s' }}>
                      <Check className="w-5 h-5 text-primary flex-shrink-0 mt-1 group-hover/item:scale-110 transition-transform" />
                      <div>
                        <span className="font-semibold">Stockage sécurisé</span>
                        <p className="text-sm text-muted-foreground">Entrepôts surveillés 24/7</p>
                      </div>
                    </li>
                    <li className="flex items-start gap-3 group/item hover:translate-x-2 transition-transform duration-300 animate-fade-in" style={{ animationDelay: '0.6s' }}>
                      <Check className="w-5 h-5 text-primary flex-shrink-0 mt-1 group-hover/item:scale-110 transition-transform" />
                      <div>
                        <span className="font-semibold">Emballage professionnel</span>
                        <p className="text-sm text-muted-foreground">Standards Amazon respectés</p>
                      </div>
                    </li>
                    <li className="flex items-start gap-3 group/item hover:translate-x-2 transition-transform duration-300 animate-fade-in" style={{ animationDelay: '0.7s' }}>
                      <Check className="w-5 h-5 text-primary flex-shrink-0 mt-1 group-hover/item:scale-110 transition-transform" />
                      <div>
                        <span className="font-semibold">Expédition rapide</span>
                        <p className="text-sm text-muted-foreground">Livraison sous 24h</p>
                      </div>
                    </li>
                  </ul>
                </div>

                <div className="animate-fade-in" style={{ animationDelay: '0.4s' }}>
                  <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
                    <MessageSquare className="w-6 h-6 text-primary animate-pulse" style={{ animationDelay: '1s' }} />
                    Service après-vente inclus
                  </h3>
                  <ul className="space-y-3">
                    <li className="flex items-start gap-3 group/item hover:translate-x-2 transition-transform duration-300 animate-fade-in" style={{ animationDelay: '0.5s' }}>
                      <Check className="w-5 h-5 text-primary flex-shrink-0 mt-1 group-hover/item:scale-110 transition-transform" />
                      <div>
                        <span className="font-semibold">Gestion SAV</span>
                        <p className="text-sm text-muted-foreground">Nous gérons les retours et réclamations</p>
                      </div>
                    </li>
                    <li className="flex items-start gap-3 group/item hover:translate-x-2 transition-transform duration-300 animate-fade-in" style={{ animationDelay: '0.6s' }}>
                      <Check className="w-5 h-5 text-primary flex-shrink-0 mt-1 group-hover/item:scale-110 transition-transform" />
                      <div>
                        <span className="font-semibold">Suivi commandes</span>
                        <p className="text-sm text-muted-foreground">Tracking en temps réel</p>
                      </div>
                    </li>
                    <li className="flex items-start gap-3 group/item hover:translate-x-2 transition-transform duration-300 animate-fade-in" style={{ animationDelay: '0.7s' }}>
                      <Check className="w-5 h-5 text-primary flex-shrink-0 mt-1 group-hover/item:scale-110 transition-transform" />
                      <div>
                        <span className="font-semibold">Support dédié</span>
                        <p className="text-sm text-muted-foreground">Équipe disponible pour vous</p>
                      </div>
                    </li>
                    <li className="flex items-start gap-3 group/item hover:translate-x-2 transition-transform duration-300 animate-fade-in" style={{ animationDelay: '0.8s' }}>
                      <Check className="w-5 h-5 text-primary flex-shrink-0 mt-1 group-hover/item:scale-110 transition-transform" />
                      <div>
                        <span className="font-semibold">Flexibilité totale</span>
                        <p className="text-sm text-muted-foreground">Contrôle total sur vos stocks</p>
                      </div>
                    </li>
                  </ul>
                </div>
              </div>

              <div className="bg-gradient-to-r from-primary/10 via-secondary/10 to-primary/10 rounded-lg p-6 mb-6">
                <div className="flex items-start gap-4">
                  <div className="text-3xl">💰</div>
                  <div>
                    <h4 className="text-xl font-bold mb-2">Économisez jusqu'à 30% vs Amazon FBA</h4>
                    <p className="text-muted-foreground mb-4">
                      Vous bénéficiez de frais de stockage et d'expédition jusqu'à 30 % inférieurs à ceux d'Amazon, 
                      tout en gardant un contrôle total sur vos marges et vos stocks.
                    </p>
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div className="bg-background rounded p-3">
                        <div className="font-semibold text-primary">Tarifs transparents</div>
                        <div className="text-muted-foreground">Sans frais cachés</div>
                      </div>
                      <div className="bg-background rounded p-3">
                        <div className="font-semibold text-primary">Flexibilité totale</div>
                        <div className="text-muted-foreground">Aucun engagement long terme</div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-muted/50 rounded-lg p-6">
                <p className="text-center text-lg font-semibold mb-2">
                  🎯 AMZing FBA 360 = Votre grossiste + Votre entrepôt + Votre partenaire logistique
                </p>
                <p className="text-center text-muted-foreground">
                  Nous simplifions la revente sur Amazon en prenant tout en charge pour vous — du fournisseur au client final
                </p>
              </div>
            </CardContent>
          </Card>

          {/* CTA */}
          <Card className="bg-gradient-to-r from-primary to-secondary text-white border-none">
            <CardContent className="p-12 text-center">
              <h2 className="text-3xl md:text-4xl font-bold mb-4">
                Prêt à Démarrer ?
              </h2>
              <p className="text-xl mb-8 text-white/90 max-w-2xl mx-auto">
                Rejoins l'espace VIP pour 34,99€/mois et accède à tout
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button variant="hero" size="xl" asChild>
                  <Link to="/tarifs">
                    Commencer l'essai gratuit (15 jours)
                  </Link>
                </Button>
                <Button variant="outline" size="xl" className="border-white text-white hover:bg-white/10" asChild>
                  <Link to="/contact">
                    Nous contacter
                  </Link>
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default Services;