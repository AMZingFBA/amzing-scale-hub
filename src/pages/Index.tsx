import { ArrowRight, Package, GraduationCap, Warehouse, Users, CheckCircle2, TrendingUp, BookOpen, Wrench, Target, Smartphone, Shield, Headphones, RefreshCw, Building2, Mail, HelpCircle } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import TestimonialsCarousel from "@/components/TestimonialsCarousel";
import TestimonialsMobile from "@/components/TestimonialsMobile";
import AppInstallBanner from "@/components/AppInstallBanner";
import SEO from "@/components/SEO";
import OptimizedImage from "@/components/OptimizedImage";
import heroWarehouse from "@/assets/hero-warehouse.jpg";
import teamWorking from "@/assets/team-working.jpg";
import logistics from "@/assets/logistics.jpg";
import { useTrial } from "@/hooks/use-trial";
import { useAuth } from "@/hooks/use-auth";
import { useScrollReveal } from "@/hooks/use-scroll-reveal";
import { useIsMobile } from "@/hooks/use-mobile";
import { Capacitor } from "@capacitor/core";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { seoData, schemas } from "@/lib/seo-data";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Checkbox } from "@/components/ui/checkbox";
import { useRegistrationSource } from "@/hooks/use-registration-source";

const ServiceCard = ({ 
  children, 
  delay, 
  animation = "fade-up" 
}: { 
  children: React.ReactNode; 
  delay: number;
  animation?: "fade-up" | "fade-left" | "fade-right" | "scale" | "rotate" | "slide-rotate";
}) => {
  const { ref, isVisible } = useScrollReveal({ delay, animation });
  const isNativeApp = Capacitor.isNativePlatform();

  if (!isNativeApp) {
    return <>{children}</>;
  }

  const getAnimationClasses = () => {
    const base = "transition-all duration-500";
    
    if (!isVisible) {
      switch (animation) {
        case "fade-left":
          return `${base} opacity-0 -translate-x-8`;
        case "fade-right":
          return `${base} opacity-0 translate-x-8`;
        case "scale":
          return `${base} opacity-0 scale-90`;
        case "rotate":
          return `${base} opacity-0 rotate-[-3deg] translate-y-4`;
        case "slide-rotate":
          return `${base} opacity-0 translate-y-4 rotate-[2deg] scale-95`;
        default: // fade-up
          return `${base} opacity-0 translate-y-4`;
      }
    }
    
    return `${base} opacity-100 translate-y-0 translate-x-0 scale-100 rotate-0`;
  };

  return (
    <div
      ref={ref}
      className={getAnimationClasses()}
    >
      {children}
    </div>
  );
};

const Index = () => {
  const { 
    startFreeTrial, 
    isStarting, 
    showCGVModal, 
    setShowCGVModal, 
    acceptedCGV, 
    setAcceptedCGV, 
    handleConfirmPayment 
  } = useTrial();
  const { isVIP, isLoading, user } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();
  const isNativeApp = Capacitor.isNativePlatform();
  const isMobile = useIsMobile();
  
  // Capture UTM parameters when user lands on page
  useRegistrationSource();

  // Redirect VIP users and admins to dashboard immediately when they land on homepage
  useEffect(() => {
    if (isLoading || !user) return;
    
    const checkAndRedirect = async () => {
      // Check admin status
      const { data: roleData } = await supabase
        .from('user_roles')
        .select('role')
        .eq('user_id', user.id)
        .eq('role', 'admin')
        .maybeSingle();
      
      const isAdmin = roleData?.role === 'admin';
      
      if (isVIP || isAdmin) {
        console.log('Redirecting to dashboard - VIP:', isVIP, 'Admin:', isAdmin);
        navigate('/dashboard', { replace: true });
      }
    };
    
    checkAndRedirect();
  }, [isVIP, isLoading, user, navigate]);

  // Schéma combiné pour la home
  const homeSchema = [...schemas.homePageSchemas, schemas.homeFAQ];

  return (
    <div className="min-h-screen">
      <SEO
        title={seoData.home.title}
        description={seoData.home.description}
        keywords={seoData.home.keywords}
        schema={homeSchema}
      />
      <Navbar />
      <AppInstallBanner />
      
      {/* H1 SEO - Visible */}
      <h1 className="sr-only">
        Plateforme tout-en-un pour réussir sur Amazon FBA
      </h1>

      {/* Hero Section */}
      <section className="relative pt-32 pb-20 overflow-hidden">
        <div className="absolute inset-0 z-0">
          <OptimizedImage 
            src={heroWarehouse} 
            alt="Entrepôt logistique Amazon FBA avec produits stockés" 
            loading="eager"
            className="w-full h-full object-cover opacity-10"
          />
          <div className="absolute inset-0 bg-gradient-to-br from-primary/20 via-background to-secondary/20" />
        </div>
        
        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-4xl mx-auto text-center">
            <Badge className="mb-6 bg-primary/10 text-primary border-primary/20">
              Sans engagement | Outils + Méthode + Communauté
            </Badge>
            
            <h2 className="text-5xl md:text-6xl lg:text-7xl font-bold mb-6 leading-tight">
              Plateforme tout-en-un pour réussir sur Amazon FBA
            </h2>
            
            <p className="text-xl md:text-2xl text-muted-foreground mb-8 max-w-3xl mx-auto">
              Moniteurs de produits rentables, méthode structurée, sourcing et communauté active. 
              Tout ce qu'il faut pour lancer ton business Amazon FBA.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button 
                variant="hero" 
                size="xl" 
                onClick={startFreeTrial}
                disabled={isStarting}
              >
                {isStarting ? 'Activation...' : 'Accéder à AMZing FBA'} <ArrowRight className="ml-2" />
              </Button>
              <Button variant="outline" size="xl" asChild>
                <Link to="/formation">
                  Voir la formation Amazon FBA
                </Link>
              </Button>
            </div>
            <p className="mt-6 text-muted-foreground text-lg">
              34,99€/mois • Sans engagement
            </p>
          </div>
        </div>
      </section>

      {/* Micro-bloc Formation CTA */}
      <section className="py-6 bg-primary/5 border-y border-primary/10">
        <div className="container mx-auto px-4 text-center">
          <p className="text-lg">
            Tu cherches une <strong>formation Amazon FBA</strong> complète ?{" "}
            <Link to="/formation" className="text-primary font-semibold hover:underline inline-flex items-center gap-1">
              Voir la formation complète <ArrowRight className="w-4 h-4" />
            </Link>
          </p>
        </div>
      </section>

      {/* Comment ça marche - 3 étapes */}
      <section className="py-20 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <Badge className="mb-4 bg-secondary/10 text-secondary border-secondary/20">
              En 3 étapes simples
            </Badge>
            <h2 className="text-4xl font-bold mb-4">Comment ça marche ?</h2>
            <p className="text-xl text-muted-foreground">De la découverte à l'action</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            <ServiceCard delay={0} animation="scale">
              <Card className="border-2 hover:border-primary transition-colors text-center relative overflow-hidden group h-full">
                <div className="absolute top-4 left-4 w-10 h-10 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-bold text-lg">1</div>
                <CardContent className="pt-16 pb-8">
                  <div className="w-16 h-16 bg-gradient-to-br from-primary to-primary-glow rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform">
                    <GraduationCap className="w-8 h-8 text-white" />
                  </div>
                  <h3 className="text-2xl font-bold mb-4">Apprends la méthode</h3>
                  <p className="text-muted-foreground">
                    Accède aux guides et à la formation pour comprendre Amazon FBA et éviter les erreurs de débutant.
                  </p>
                </CardContent>
              </Card>
            </ServiceCard>

            <ServiceCard delay={100} animation="fade-up">
              <Card className="border-2 hover:border-secondary transition-colors text-center relative overflow-hidden group h-full">
                <div className="absolute top-4 left-4 w-10 h-10 rounded-full bg-secondary text-secondary-foreground flex items-center justify-center font-bold text-lg">2</div>
                <CardContent className="pt-16 pb-8">
                  <div className="w-16 h-16 bg-gradient-to-br from-secondary to-accent rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform">
                    <Target className="w-8 h-8 text-white" />
                  </div>
                  <h3 className="text-2xl font-bold mb-4">Identifie des opportunités</h3>
                  <p className="text-muted-foreground">
                    Utilise les moniteurs automatiques pour recevoir des alertes sur des produits à fort potentiel.
                  </p>
                </CardContent>
              </Card>
            </ServiceCard>

            <ServiceCard delay={200} animation="rotate">
              <Card className="border-2 hover:border-green-500 transition-colors text-center relative overflow-hidden group h-full">
                <div className="absolute top-4 left-4 w-10 h-10 rounded-full bg-green-500 text-white flex items-center justify-center font-bold text-lg">3</div>
                <CardContent className="pt-16 pb-8">
                  <div className="w-16 h-16 bg-gradient-to-br from-green-500 to-green-600 rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform">
                    <TrendingUp className="w-8 h-8 text-white" />
                  </div>
                  <h3 className="text-2xl font-bold mb-4">Passe à l'action</h3>
                  <p className="text-muted-foreground">
                    Lance tes premières commandes avec la communauté et le support pour t'accompagner.
                  </p>
                </CardContent>
              </Card>
            </ServiceCard>
          </div>
          
          <div className="text-center mt-10">
            <Button variant="hero" size="xl" onClick={startFreeTrial} disabled={isStarting}>
              {isStarting ? 'Activation...' : 'Commencer maintenant'} <ArrowRight className="ml-2" />
            </Button>
          </div>
        </div>
      </section>

      {/* Guides Amazon FBA - Section SEO - Bold banner style */}
      <section className="py-16 relative overflow-hidden">
        {/* Animated background */}
        <div className="absolute inset-0 bg-gradient-to-r from-primary/20 via-secondary/10 to-primary/20" />
        <div className="absolute top-0 left-1/4 w-64 h-64 bg-primary/20 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-0 right-1/4 w-48 h-48 bg-secondary/20 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }} />
        
        <div className="container mx-auto px-4 relative z-10">
          <div className="text-center mb-10">
            <Badge className="mb-4 bg-primary/20 text-primary border-primary/30 animate-fade-in">
              📚 Ressources gratuites
            </Badge>
            <h2 className="text-3xl md:text-4xl font-bold mb-3">Guides Amazon FBA</h2>
            <p className="text-muted-foreground max-w-md mx-auto">
              Maîtrise les fondamentaux avant de te lancer
            </p>
          </div>
          
          <div className="flex flex-wrap justify-center gap-6 max-w-4xl mx-auto">
            <Link to="/amazon-fba-debutant" className="group relative">
              <div className="absolute inset-0 bg-gradient-to-r from-primary to-primary-glow rounded-2xl blur-lg opacity-50 group-hover:opacity-80 transition-opacity" />
              <div className="relative flex items-center gap-4 px-6 py-4 rounded-2xl bg-background/90 backdrop-blur border-2 border-primary/30 hover:border-primary hover:scale-105 transition-all duration-300 shadow-lg">
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-primary to-primary-glow flex items-center justify-center group-hover:rotate-6 transition-transform">
                  <BookOpen className="w-6 h-6 text-white" />
                </div>
                <div className="text-left">
                  <span className="font-bold block">FBA Débutant</span>
                  <span className="text-sm text-muted-foreground">Se lancer de zéro</span>
                </div>
                <ArrowRight className="w-5 h-5 text-primary group-hover:translate-x-1 transition-transform" />
              </div>
            </Link>
            
            <Link to="/outil-amazon-fba" className="group relative">
              <div className="absolute inset-0 bg-gradient-to-r from-secondary to-accent rounded-2xl blur-lg opacity-50 group-hover:opacity-80 transition-opacity" />
              <div className="relative flex items-center gap-4 px-6 py-4 rounded-2xl bg-background/90 backdrop-blur border-2 border-secondary/30 hover:border-secondary hover:scale-105 transition-all duration-300 shadow-lg">
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-secondary to-accent flex items-center justify-center group-hover:rotate-6 transition-transform">
                  <Wrench className="w-6 h-6 text-white" />
                </div>
                <div className="text-left">
                  <span className="font-bold block">Outils FBA</span>
                  <span className="text-sm text-muted-foreground">Analyser efficacement</span>
                </div>
                <ArrowRight className="w-5 h-5 text-secondary group-hover:translate-x-1 transition-transform" />
              </div>
            </Link>
            
            <Link to="/produits-rentables-amazon" className="group relative">
              <div className="absolute inset-0 bg-gradient-to-r from-green-500 to-green-600 rounded-2xl blur-lg opacity-50 group-hover:opacity-80 transition-opacity" />
              <div className="relative flex items-center gap-4 px-6 py-4 rounded-2xl bg-background/90 backdrop-blur border-2 border-green-500/30 hover:border-green-500 hover:scale-105 transition-all duration-300 shadow-lg">
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-green-500 to-green-600 flex items-center justify-center group-hover:rotate-6 transition-transform">
                  <Target className="w-6 h-6 text-white" />
                </div>
                <div className="text-left">
                  <span className="font-bold block">Produits rentables</span>
                  <span className="text-sm text-muted-foreground">Trouver les pépites</span>
                </div>
                <ArrowRight className="w-5 h-5 text-green-500 group-hover:translate-x-1 transition-transform" />
              </div>
            </Link>
          </div>
        </div>
      </section>

      {/* What's Included */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          {/* SEO H2 - Outils de sourcing */}
          <h2 className="sr-only">
            Outils de sourcing produits rentables pour Amazon FBA et arbitrage en ligne
          </h2>
          
          {/* SEO H2 - Catalogue */}
          <h2 className="sr-only">
            Catalogue de produits optimisés pour la revente sur Amazon FBA
          </h2>
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
            <ServiceCard delay={0} animation="fade-left">
            <Card className={`border-2 border-primary/20 cursor-pointer transition-all duration-300 ${isNativeApp ? 'hover:border-primary hover:shadow-[0_0_20px_rgba(255,153,0,0.3)]' : 'hover:border-primary hover:shadow-glow'} hover:scale-105 active:scale-95 active:border-primary`}>
              <CardContent className="pt-6">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-gradient-to-br from-primary to-primary-glow rounded-xl flex items-center justify-center flex-shrink-0 transition-transform duration-200 group-hover:rotate-6">
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
            </ServiceCard>

            <ServiceCard delay={80} animation="fade-right">
            <Card className={`border-2 border-primary/20 cursor-pointer transition-all duration-300 ${isNativeApp ? 'hover:border-secondary hover:shadow-[0_0_20px_rgba(33,150,243,0.3)]' : 'hover:border-secondary hover:shadow-blue'} hover:scale-105 active:scale-95 active:border-secondary`}>
              <CardContent className="pt-6">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-gradient-to-br from-secondary to-accent rounded-xl flex items-center justify-center flex-shrink-0 transition-transform duration-200 group-hover:rotate-6">
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
            </ServiceCard>

            <ServiceCard delay={160} animation="scale">
            <Card className={`border-2 border-primary/20 cursor-pointer transition-all duration-300 ${isNativeApp ? 'hover:border-primary hover:shadow-[0_0_20px_rgba(255,153,0,0.3)]' : 'hover:border-primary hover:shadow-glow'} hover:scale-105 active:scale-95 active:border-primary`}>
              <CardContent className="pt-6">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-gradient-to-br from-primary to-secondary rounded-xl flex items-center justify-center flex-shrink-0 transition-transform duration-200 group-hover:rotate-6">
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
            </ServiceCard>

            <ServiceCard delay={240} animation="rotate">
            <Card className={`border-2 border-primary/20 cursor-pointer transition-all duration-300 ${isNativeApp ? 'hover:border-secondary hover:shadow-[0_0_20px_rgba(33,150,243,0.3)]' : 'hover:border-secondary hover:shadow-blue'} hover:scale-105 active:scale-95 active:border-secondary`}>
              <CardContent className="pt-6">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-gradient-to-br from-secondary to-primary rounded-xl flex items-center justify-center flex-shrink-0 transition-transform duration-200 group-hover:rotate-6">
                    <CheckCircle2 className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold mb-2">Analyses de marché</h3>
                    <p className="text-muted-foreground text-sm">
                      Tendances et opportunités du marché Amazon
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
            </ServiceCard>

            <ServiceCard delay={320} animation="slide-rotate">
            <Card className={`border-2 border-primary/20 cursor-pointer transition-all duration-300 ${isNativeApp ? 'hover:border-primary hover:shadow-[0_0_20px_rgba(255,153,0,0.3)]' : 'hover:border-primary hover:shadow-glow'} hover:scale-105 active:scale-95 active:border-primary`}>
              <CardContent className="pt-6">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-gradient-to-br from-primary to-secondary rounded-xl flex items-center justify-center flex-shrink-0 transition-transform duration-200 group-hover:rotate-6">
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
            </ServiceCard>

            <ServiceCard delay={400} animation="fade-up">
            <Card className={`border-2 border-primary/20 cursor-pointer transition-all duration-300 ${isNativeApp ? 'hover:border-secondary hover:shadow-[0_0_20px_rgba(33,150,243,0.3)]' : 'hover:border-secondary hover:shadow-blue'} hover:scale-105 active:scale-95 active:border-secondary`}>
              <CardContent className="pt-6">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-gradient-to-br from-secondary to-accent rounded-xl flex items-center justify-center flex-shrink-0 transition-transform duration-200 group-hover:rotate-6">
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
            </ServiceCard>
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
          {/* SEO H2 - Marketplace et services */}
          <h2 className="sr-only">
            Marketplace de services spécialisés pour vendeurs Amazon FBA et FBM
          </h2>
          <Card className="border-2 border-primary/20 shadow-2xl overflow-hidden max-w-6xl mx-auto hover:shadow-glow transition-all duration-500 hover:scale-102 animate-fade-in">
            <div className="grid md:grid-cols-2 gap-0">
              <div className="bg-gradient-to-br from-primary/10 via-secondary/10 to-primary/5 p-12 flex flex-col justify-center relative overflow-hidden">
                {/* Animated background orbs */}
                <div className="absolute top-10 right-10 w-32 h-32 bg-primary/10 rounded-full blur-2xl animate-float" />
                <div className="absolute bottom-10 left-10 w-40 h-40 bg-secondary/10 rounded-full blur-2xl animate-float" style={{ animationDelay: "1s" }} />
                
                <Badge className="mb-4 bg-primary/20 text-primary border-primary/30 w-fit animate-fade-in hover:scale-110 transition-transform cursor-pointer" style={{ animationDelay: "0.1s" }}>
                  Service Premium Inclus
                </Badge>
                <h2 className="text-4xl font-bold mb-6 text-gradient animate-fade-in" style={{ animationDelay: "0.2s" }}>
                  🚛 AMZing FBA 360
                </h2>
                <p className="text-xl font-semibold mb-4 animate-fade-in" style={{ animationDelay: "0.3s" }}>
                  Votre solution logistique tout-en-un
                </p>
                <p className="text-muted-foreground text-lg leading-relaxed mb-4 animate-fade-in" style={{ animationDelay: "0.4s" }}>
                  AMZing FBA 360 est une solution complète pensée pour les vendeurs Amazon.
                </p>
                <p className="text-muted-foreground leading-relaxed animate-fade-in" style={{ animationDelay: "0.5s" }}>
                  Nous agissons comme votre propre centre logistique, <strong className="text-foreground">plus flexible et plus abordable que le FBA d'Amazon</strong>.
                </p>
              </div>
              <div className="p-12 bg-background">
                <div className="space-y-6">
                  <div>
                    <h3 className="text-xl font-bold mb-3 animate-fade-in" style={{ animationDelay: "0.2s" }}>Comment ça marche ?</h3>
                    <ul className="space-y-3 text-muted-foreground">
                      <li className="flex items-start gap-3 group hover:translate-x-2 transition-all duration-300 animate-fade-in" style={{ animationDelay: "0.3s" }}>
                        <CheckCircle2 className="w-5 h-5 text-primary flex-shrink-0 mt-1 group-hover:scale-125 group-hover:text-primary-glow transition-all" />
                        <span className="group-hover:text-foreground transition-colors">Nous fournissons vos produits rentables</span>
                      </li>
                      <li className="flex items-start gap-3 group hover:translate-x-2 transition-all duration-300 animate-fade-in" style={{ animationDelay: "0.4s" }}>
                        <CheckCircle2 className="w-5 h-5 text-primary flex-shrink-0 mt-1 group-hover:scale-125 group-hover:text-primary-glow transition-all" />
                        <span className="group-hover:text-foreground transition-colors">Stockage dans nos entrepôts sécurisés</span>
                      </li>
                      <li className="flex items-start gap-3 group hover:translate-x-2 transition-all duration-300 animate-fade-in" style={{ animationDelay: "0.5s" }}>
                        <CheckCircle2 className="w-5 h-5 text-primary flex-shrink-0 mt-1 group-hover:scale-125 group-hover:text-primary-glow transition-all" />
                        <span className="group-hover:text-foreground transition-colors">Emballage aux standards Amazon</span>
                      </li>
                      <li className="flex items-start gap-3 group hover:translate-x-2 transition-all duration-300 animate-fade-in" style={{ animationDelay: "0.6s" }}>
                        <CheckCircle2 className="w-5 h-5 text-primary flex-shrink-0 mt-1 group-hover:scale-125 group-hover:text-primary-glow transition-all" />
                        <span className="group-hover:text-foreground transition-colors">Expédition sous 24h à vos clients</span>
                      </li>
                      <li className="flex items-start gap-3 group hover:translate-x-2 transition-all duration-300 animate-fade-in" style={{ animationDelay: "0.7s" }}>
                        <CheckCircle2 className="w-5 h-5 text-primary flex-shrink-0 mt-1 group-hover:scale-125 group-hover:text-primary-glow transition-all" />
                        <span className="group-hover:text-foreground transition-colors">Gestion du SAV et suivi des commandes</span>
                      </li>
                    </ul>
                  </div>
                  <div className="pt-4 border-t animate-fade-in" style={{ animationDelay: "0.8s" }}>
                    <div className="bg-primary/10 rounded-lg p-4 hover:bg-primary/20 transition-all duration-300 hover:scale-105 cursor-pointer group">
                      <p className="font-semibold text-lg mb-2 group-hover:text-primary transition-colors">
                        <span className="inline-block animate-pulse">💰</span> Économisez jusqu'à 30%
                      </p>
                      <p className="text-sm text-muted-foreground group-hover:text-foreground transition-colors">
                        Frais de stockage et d'expédition inférieurs à Amazon FBA, avec un contrôle total sur vos marges
                      </p>
                    </div>
                  </div>
                  <p className="text-sm text-muted-foreground italic pt-4 animate-fade-in" style={{ animationDelay: "0.9s" }}>
                    AMZing FBA 360 = Votre grossiste + Votre entrepôt + Votre partenaire logistique
                  </p>
                </div>
              </div>
            </div>
          </Card>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-20 bg-muted/30">
        <h2 className="sr-only">
          Témoignages et avis des membres AMZing FBA
        </h2>
        {(isNativeApp || isMobile) ? (
          <TestimonialsMobile />
        ) : (
          <div className="container mx-auto px-4">
            <div className="text-center mb-16">
              <Badge className="mb-4 bg-primary/10 text-primary border-primary/20">
                Témoignages clients
              </Badge>
              <h2 className="text-4xl md:text-5xl font-bold mb-4">
                Ce que disent nos membres
              </h2>
            </div>

            <TestimonialsCarousel />
          </div>
        )}
      </section>

      {/* Stats & Confiance Section */}
      <section className="py-20 bg-gradient-to-br from-primary/10 via-background to-secondary/10">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <Badge className="mb-4 bg-green-500/10 text-green-600 border-green-500/20">
              AMZing FBA en chiffres
            </Badge>
            <h2 className="text-4xl font-bold mb-4">Une communauté qui grandit</h2>
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 max-w-4xl mx-auto mb-16">
            <div className="text-center">
              <div className="text-4xl md:text-5xl font-bold text-gradient mb-2">500+</div>
              <div className="text-muted-foreground">Membres actifs</div>
            </div>
            <div className="text-center">
              <div className="text-4xl md:text-5xl font-bold text-gradient mb-2">1700+</div>
              <div className="text-muted-foreground">Produits sourcés</div>
            </div>
            <div className="text-center">
              <div className="text-4xl md:text-5xl font-bold text-gradient mb-2">5,2M €</div>
              <div className="text-muted-foreground">CA généré en 8 mois</div>
            </div>
            <div className="text-center">
              <div className="text-4xl md:text-5xl font-bold text-gradient mb-2">92%</div>
              <div className="text-muted-foreground">Taux de renouvellement</div>
            </div>
          </div>

          {/* Points de confiance */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 max-w-4xl mx-auto mb-12">
            <div className="text-center p-6 rounded-2xl bg-background/80 backdrop-blur border">
              <Smartphone className="w-10 h-10 text-primary mx-auto mb-3" />
              <div className="font-bold">iOS & Android</div>
              <div className="text-sm text-muted-foreground">Apps natives</div>
            </div>
            <div className="text-center p-6 rounded-2xl bg-background/80 backdrop-blur border">
              <Headphones className="w-10 h-10 text-secondary mx-auto mb-3" />
              <div className="font-bold">Support réactif</div>
              <div className="text-sm text-muted-foreground">7j/7 par chat</div>
            </div>
            <div className="text-center p-6 rounded-2xl bg-background/80 backdrop-blur border">
              <RefreshCw className="w-10 h-10 text-primary mx-auto mb-3" />
              <div className="font-bold">Sans engagement</div>
              <div className="text-sm text-muted-foreground">Résiliable en 2 clics</div>
            </div>
            <div className="text-center p-6 rounded-2xl bg-background/80 backdrop-blur border">
              <Shield className="w-10 h-10 text-secondary mx-auto mb-3" />
              <div className="font-bold">Société française</div>
              <div className="text-sm text-muted-foreground">Basée à Paris</div>
            </div>
          </div>

          {/* Qui est derrière AMZing FBA */}
          <Card className="max-w-3xl mx-auto border-2 border-primary/10 bg-background/80 backdrop-blur">
            <CardContent className="p-8">
              <div className="flex items-start gap-6 flex-col md:flex-row">
                <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-primary to-secondary flex items-center justify-center flex-shrink-0">
                  <Building2 className="w-8 h-8 text-white" />
                </div>
                <div>
                  <h3 className="text-xl font-bold mb-2">Qui est derrière AMZing FBA ?</h3>
                  <p className="text-muted-foreground mb-4">
                    AMZing FBA est édité par <strong className="text-foreground">N.Z Consulting</strong>, société française. 
                    Notre mission : rendre le business Amazon FBA accessible grâce à des outils concrets et une méthode claire.
                  </p>
                  <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
                    <Link to="/contact" className="flex items-center gap-1 hover:text-primary transition-colors">
                      <Mail className="w-4 h-4" /> contact@amzingfba.com
                    </Link>
                    <span>Paris, France</span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-20 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <Badge className="mb-4 bg-primary/10 text-primary border-primary/20">
              Questions fréquentes
            </Badge>
            <h2 className="text-4xl font-bold mb-4">FAQ</h2>
            <p className="text-xl text-muted-foreground">Les réponses aux questions les plus courantes</p>
          </div>
          
          <div className="max-w-3xl mx-auto">
            <Accordion type="single" collapsible className="space-y-4">
              <AccordionItem value="item-1" className="bg-background rounded-lg border px-6">
                <AccordionTrigger className="text-left font-semibold hover:no-underline">
                  <span className="flex items-center gap-3">
                    <HelpCircle className="w-5 h-5 text-primary flex-shrink-0" />
                    C'est quoi Amazon FBA exactement ?
                  </span>
                </AccordionTrigger>
                <AccordionContent className="text-muted-foreground pl-8">
                  FBA signifie "Fulfillment by Amazon". Concrètement, vous envoyez vos produits dans les entrepôts Amazon, et c'est Amazon qui s'occupe du stockage, de l'emballage et de l'expédition aux clients. Vous bénéficiez du badge Prime et vous vous concentrez uniquement sur le sourcing et les ventes.
                </AccordionContent>
              </AccordionItem>
              
              <AccordionItem value="item-2" className="bg-background rounded-lg border px-6">
                <AccordionTrigger className="text-left font-semibold hover:no-underline">
                  <span className="flex items-center gap-3">
                    <HelpCircle className="w-5 h-5 text-primary flex-shrink-0" />
                    Qu'est-ce qu'AMZing FBA propose concrètement ?
                  </span>
                </AccordionTrigger>
                <AccordionContent className="text-muted-foreground pl-8">
                  AMZing FBA combine une méthode structurée pour comprendre Amazon FBA, des moniteurs automatiques qui détectent des produits rentables, un catalogue de fournisseurs vérifiés, et une communauté active pour échanger et progresser. C'est un écosystème complet, pas juste une formation.
                </AccordionContent>
              </AccordionItem>
              
              <AccordionItem value="item-3" className="bg-background rounded-lg border px-6">
                <AccordionTrigger className="text-left font-semibold hover:no-underline">
                  <span className="flex items-center gap-3">
                    <HelpCircle className="w-5 h-5 text-primary flex-shrink-0" />
                    Quel budget pour démarrer sur Amazon FBA ?
                  </span>
                </AccordionTrigger>
                <AccordionContent className="text-muted-foreground pl-8">
                  Comptez 500 à 1000€ minimum pour vos premiers achats de stock. L'abonnement AMZing FBA est à 34,99€/mois. Il n'y a pas de miracle : le budget initial dépend de votre stratégie (arbitrage, wholesale, private label). On vous aide à optimiser chaque euro investi.
                </AccordionContent>
              </AccordionItem>
              
              <AccordionItem value="item-4" className="bg-background rounded-lg border px-6">
                <AccordionTrigger className="text-left font-semibold hover:no-underline">
                  <span className="flex items-center gap-3">
                    <HelpCircle className="w-5 h-5 text-primary flex-shrink-0" />
                    Faut-il créer une société pour vendre sur Amazon ?
                  </span>
                </AccordionTrigger>
                <AccordionContent className="text-muted-foreground pl-8">
                  Oui, pour facturer légalement vous avez besoin d'une structure : micro-entreprise, SASU, EURL... La micro-entreprise est souvent le choix des débutants car elle est simple à créer. AMZing FBA inclut des ressources sur la création de société et les obligations légales.
                </AccordionContent>
              </AccordionItem>
              
              <AccordionItem value="item-5" className="bg-background rounded-lg border px-6">
                <AccordionTrigger className="text-left font-semibold hover:no-underline">
                  <span className="flex items-center gap-3">
                    <HelpCircle className="w-5 h-5 text-primary flex-shrink-0" />
                    C'est quoi la différence entre FBA et FBM ?
                  </span>
                </AccordionTrigger>
                <AccordionContent className="text-muted-foreground pl-8">
                  <strong>FBA</strong> : Amazon gère tout (stockage, expédition, SAV). Vous avez le badge Prime. Frais Amazon plus élevés mais moins de travail.<br/>
                  <strong>FBM</strong> : Vous gérez vous-même l'expédition. Plus de contrôle, frais réduits, mais plus de travail logistique. AMZing FBA couvre les deux modèles et propose même un service logistique (AMZing FBA 360) pour ceux qui veulent le meilleur des deux mondes.
                </AccordionContent>
              </AccordionItem>
              
              <AccordionItem value="item-6" className="bg-background rounded-lg border px-6">
                <AccordionTrigger className="text-left font-semibold hover:no-underline">
                  <span className="flex items-center gap-3">
                    <HelpCircle className="w-5 h-5 text-primary flex-shrink-0" />
                    Puis-je annuler mon abonnement à tout moment ?
                  </span>
                </AccordionTrigger>
                <AccordionContent className="text-muted-foreground pl-8">
                  Oui, AMZing FBA fonctionne sans engagement. Vous pouvez annuler directement depuis votre espace membre en 2 clics. Pas de période minimum, pas de frais cachés.
                </AccordionContent>
              </AccordionItem>
            </Accordion>
            
            <div className="text-center mt-8">
              <Link to="/faq" className="text-primary hover:underline font-medium inline-flex items-center gap-2">
                Voir toutes les questions <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
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
            Accède à la plateforme complète : outils, méthode et communauté
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button 
              variant="secondary" 
              size="xl" 
              className="bg-gradient-to-r from-white via-primary/5 to-white bg-[length:200%_100%] animate-[gradient_3s_ease_infinite] text-primary hover:scale-105 hover:shadow-[0_0_40px_rgba(255,153,0,0.4)] transition-all duration-300 relative overflow-hidden group font-semibold border-2 border-primary/10"
              onClick={startFreeTrial}
              disabled={isStarting}
              style={{
                animation: 'gradient 3s ease infinite, pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite'
              }}
            >
              <span className="relative z-10 flex items-center gap-2">
                {isStarting ? 'Activation...' : 'Accéder à AMZing FBA'}
                <span className="inline-block group-hover:translate-x-1 transition-transform duration-300">→</span>
              </span>
              <span className="absolute inset-0 bg-gradient-to-r from-primary/0 via-primary/20 to-primary/0 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000"></span>
            </Button>
            <Button variant="outline" size="xl" className="border-white text-white hover:bg-white/10" asChild>
              <Link to="/formation">
                Voir la formation
              </Link>
            </Button>
          </div>
          <p className="mt-6 text-white/90 text-lg">
            34,99€/mois • Sans engagement
          </p>
        </div>
      </section>

      <Footer />

      {/* CGV Modal */}
      <Dialog open={showCGVModal} onOpenChange={setShowCGVModal}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Confirmation d'abonnement</DialogTitle>
            <DialogDescription>
              Veuillez accepter les conditions avant de continuer
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4 py-4">
            <div className="bg-primary/5 p-4 rounded-lg border border-primary/20">
              <p className="text-sm font-semibold mb-2">Abonnement VIP AMZing FBA</p>
              <p className="text-2xl font-bold text-primary">34,99€<span className="text-sm font-normal text-muted-foreground">/mois</span></p>
              <p className="text-xs text-muted-foreground mt-2">Sans engagement • Résiliable à tout moment</p>
            </div>

            <div className="flex items-start space-x-3">
              <Checkbox 
                id="cgv-payment" 
                checked={acceptedCGV}
                onCheckedChange={(checked) => setAcceptedCGV(checked === true)}
                className="mt-1"
              />
              <label htmlFor="cgv-payment" className="text-sm leading-relaxed cursor-pointer select-none">
                Je reconnais avoir lu et accepté les{" "}
                <Link 
                  to="/cgv" 
                  target="_blank"
                  className="text-primary hover:underline font-medium"
                  onClick={(e) => e.stopPropagation()}
                >
                  Conditions Générales de Vente
                </Link>
                {" "}et je demande l'exécution immédiate du service.
              </label>
            </div>
          </div>

          <DialogFooter>
            <Button 
              variant="outline" 
              onClick={() => setShowCGVModal(false)}
            >
              Annuler
            </Button>
            <Button 
              onClick={handleConfirmPayment}
              disabled={!acceptedCGV || isStarting}
              className="bg-gradient-to-r from-primary to-secondary"
            >
              {isStarting ? 'Traitement...' : 'Confirmer le paiement'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Index;
