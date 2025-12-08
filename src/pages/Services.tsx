import { Check, GraduationCap, BarChart3, Truck, Users, ArrowRight, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import SEO from "@/components/SEO";
import { Link, useNavigate } from "react-router-dom";
import { useScrollReveal } from "@/hooks/use-scroll-reveal";
import { Capacitor } from "@capacitor/core";
import { seoData } from "@/lib/seo-data";
import { ArrowLeft } from "lucide-react";

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
      <SEO
        title={seoData.services.title}
        description={seoData.services.description}
        keywords={seoData.services.keywords}
      />
      <Navbar />
      
      {/* SEO H1/H2 - Invisible */}
      <h1 className="sr-only">
        Services professionnels AMZing FBA pour vendeurs Amazon
      </h1>
      <h2 className="sr-only">
        Formation, plateforme, logistique et communauté pour réussir sur Amazon FBA
      </h2>
      
      {/* Back button for mobile app */}
      {isNativeApp && (
        <button
          onClick={() => navigate('/')}
          className="fixed top-[46px] left-[18px] z-50 bg-primary/10 backdrop-blur-sm p-2 rounded-full shadow-lg hover:bg-primary/20 transition-colors border border-primary/20"
          aria-label="Retour"
        >
          <ArrowLeft className="h-5 w-5 text-primary" />
        </button>
      )}
      
      <div className="pt-32 pb-20">
        <div className="container mx-auto px-4">
          
          {/* Section A: Intro claire */}
          <section 
            ref={isNativeApp ? headerReveal.ref : undefined}
            className={`text-center mb-20 max-w-4xl mx-auto ${
              isNativeApp && headerReveal.isVisible
                ? "opacity-100 translate-y-0 transition-all duration-500"
                : isNativeApp
                ? "opacity-0 translate-y-4"
                : ""
            }`}
          >
            <Badge className="mb-6 bg-primary/10 text-primary border-primary/20 px-4 py-2 text-sm">
              Plateforme complète pour vendeurs Amazon
            </Badge>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 leading-tight">
              Nos services pour ton business Amazon FBA
            </h1>
            <p className="text-xl md:text-2xl text-muted-foreground leading-relaxed">
              AMZing FBA, c'est une <strong className="text-foreground">formation</strong>, une <strong className="text-foreground">plateforme</strong> et des <strong className="text-foreground">services</strong> conçus pour t'aider sur tout le cycle : trouver des produits rentables, décider où acheter, organiser ta logistique, optimiser ta marge et avancer avec une communauté.
            </p>
          </section>

          {/* Section B: Les 4 piliers */}
          <section className="mb-24">
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-bold mb-4">
                Nos 4 piliers pour ta réussite
              </h2>
              <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                Tout ce dont tu as besoin pour lancer et développer ton business Amazon FBA
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-6xl mx-auto">
              
              {/* Pilier 1: Formation */}
              <ServiceCard delay={0}>
                <Card className="h-full border-2 hover:border-primary/50 transition-all duration-300 hover:shadow-xl group">
                  <CardHeader className="pb-4">
                    <div className="w-16 h-16 bg-gradient-to-br from-primary to-primary/70 rounded-2xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300">
                      <GraduationCap className="w-8 h-8 text-white" />
                    </div>
                    <CardTitle className="text-2xl mb-2">Formation & Méthode</CardTitle>
                    <CardDescription className="text-base">
                      Pour débutants & vendeurs qui veulent structurer leur approche
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <p className="text-muted-foreground mb-6 leading-relaxed">
                      Une formation structurée qui te montre comment fonctionne Amazon FBA, comment choisir une stratégie, analyser les produits, éviter les erreurs fréquentes et poser des bases solides.
                    </p>
                    <ul className="space-y-3 mb-6">
                      <li className="flex items-start gap-3">
                        <Check className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
                        <span>Guides pas à pas illustrés</span>
                      </li>
                      <li className="flex items-start gap-3">
                        <Check className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
                        <span>Stratégies de sourcing détaillées</span>
                      </li>
                      <li className="flex items-start gap-3">
                        <Check className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
                        <span>Templates & checklists prêts à l'emploi</span>
                      </li>
                    </ul>
                    <Button variant="outline" className="w-full group/btn" asChild>
                      <Link to="/formation">
                        Découvrir la formation
                        <ArrowRight className="w-4 h-4 ml-2 group-hover/btn:translate-x-1 transition-transform" />
                      </Link>
                    </Button>
                  </CardContent>
                </Card>
              </ServiceCard>

              {/* Pilier 2: Plateforme & Moniteurs */}
              <ServiceCard delay={100}>
                <Card className="h-full border-2 border-primary hover:shadow-xl transition-all duration-300 group relative overflow-hidden">
                  <div className="absolute top-4 right-4">
                    <Badge className="bg-primary text-primary-foreground">
                      <Sparkles className="w-3 h-3 mr-1" />
                      Populaire
                    </Badge>
                  </div>
                  <CardHeader className="pb-4">
                    <div className="w-16 h-16 bg-gradient-to-br from-primary to-secondary rounded-2xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300">
                      <BarChart3 className="w-8 h-8 text-white" />
                    </div>
                    <CardTitle className="text-2xl mb-2">Plateforme & Moniteurs</CardTitle>
                    <CardDescription className="text-base">
                      Pour ceux qui veulent gagner du temps sur le sourcing
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <p className="text-muted-foreground mb-6 leading-relaxed">
                      Des moniteurs qui scannent des sites et grossistes, un catalogue de produits et de fournisseurs, des alertes pour t'aider à repérer des opportunités. Tu passes moins de temps à chercher, plus de temps à décider.
                    </p>
                    <ul className="space-y-3 mb-6">
                      <li className="flex items-start gap-3">
                        <Check className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
                        <span>Alertes produits rentables en temps réel</span>
                      </li>
                      <li className="flex items-start gap-3">
                        <Check className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
                        <span>Catalogue fournisseurs vérifiés</span>
                      </li>
                      <li className="flex items-start gap-3">
                        <Check className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
                        <span>Analyse ROI automatique</span>
                      </li>
                    </ul>
                    <Button className="w-full group/btn" asChild>
                      <Link to="/tarifs">
                        Voir les fonctionnalités VIP
                        <ArrowRight className="w-4 h-4 ml-2 group-hover/btn:translate-x-1 transition-transform" />
                      </Link>
                    </Button>
                  </CardContent>
                </Card>
              </ServiceCard>

              {/* Pilier 3: Logistique */}
              <ServiceCard delay={200}>
                <Card className="h-full border-2 hover:border-primary/50 transition-all duration-300 hover:shadow-xl group">
                  <CardHeader className="pb-4">
                    <div className="w-16 h-16 bg-gradient-to-br from-secondary to-primary/70 rounded-2xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300">
                      <Truck className="w-8 h-8 text-white" />
                    </div>
                    <CardTitle className="text-2xl mb-2">Logistique & Préparation</CardTitle>
                    <CardDescription className="text-base">
                      Pour ceux qui ont des produits ou veulent structurer leurs flux
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <p className="text-muted-foreground mb-6 leading-relaxed">
                      Ressources et partenariats pour organiser ton stockage, ta préparation de commandes et tes envois vers les entrepôts Amazon ou autres solutions, avec un focus sur la rentabilité.
                    </p>
                    <ul className="space-y-3 mb-6">
                      <li className="flex items-start gap-3">
                        <Check className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
                        <span>Contacts fournisseurs logistiques</span>
                      </li>
                      <li className="flex items-start gap-3">
                        <Check className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
                        <span>Guides préparation FBA & FBM</span>
                      </li>
                      <li className="flex items-start gap-3">
                        <Check className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
                        <span>Réductions partenaires (emballages, expédition)</span>
                      </li>
                    </ul>
                    <Button variant="outline" className="w-full group/btn" asChild>
                      <Link to="/tarifs">
                        En savoir plus
                        <ArrowRight className="w-4 h-4 ml-2 group-hover/btn:translate-x-1 transition-transform" />
                      </Link>
                    </Button>
                  </CardContent>
                </Card>
              </ServiceCard>

              {/* Pilier 4: Communauté */}
              <ServiceCard delay={300}>
                <Card className="h-full border-2 hover:border-primary/50 transition-all duration-300 hover:shadow-xl group">
                  <CardHeader className="pb-4">
                    <div className="w-16 h-16 bg-gradient-to-br from-primary/70 to-secondary rounded-2xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300">
                      <Users className="w-8 h-8 text-white" />
                    </div>
                    <CardTitle className="text-2xl mb-2">Accompagnement & Communauté</CardTitle>
                    <CardDescription className="text-base">
                      Pour ceux qui ont besoin d'un cadre et de réponses
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <p className="text-muted-foreground mb-6 leading-relaxed">
                      Un espace membre avec chat, salons "Questions", "Succès", "Ventes", et un support pour t'aider à avancer. Tu n'es pas seul dans ton coin à douter de chaque décision.
                    </p>
                    <ul className="space-y-3 mb-6">
                      <li className="flex items-start gap-3">
                        <Check className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
                        <span>Chat communautaire actif</span>
                      </li>
                      <li className="flex items-start gap-3">
                        <Check className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
                        <span>Support réactif</span>
                      </li>
                      <li className="flex items-start gap-3">
                        <Check className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
                        <span>Partage d'expériences entre vendeurs</span>
                      </li>
                    </ul>
                    <Button variant="outline" className="w-full group/btn" asChild>
                      <Link to="/tarifs">
                        Rejoindre la communauté
                        <ArrowRight className="w-4 h-4 ml-2 group-hover/btn:translate-x-1 transition-transform" />
                      </Link>
                    </Button>
                  </CardContent>
                </Card>
              </ServiceCard>
            </div>
          </section>

          {/* Section C: Inclus vs Optionnel */}
          <section className="mb-24 max-w-5xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-bold mb-4">
                Ce qui est inclus dans ton abonnement
              </h2>
              <p className="text-lg text-muted-foreground">
                Tout ce que tu obtiens pour 34,99€/mois
              </p>
            </div>

            <div className="grid md:grid-cols-2 gap-8">
              {/* Inclus */}
              <Card className="border-2 border-primary/30 bg-primary/5">
                <CardHeader>
                  <div className="flex items-center gap-3 mb-2">
                    <div className="w-10 h-10 bg-primary rounded-full flex items-center justify-center">
                      <Check className="w-5 h-5 text-primary-foreground" />
                    </div>
                    <CardTitle className="text-xl">Inclus avec l'abonnement</CardTitle>
                  </div>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-4">
                    <li className="flex items-start gap-3">
                      <Check className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
                      <span>Accès complet à la formation Amazon FBA</span>
                    </li>
                    <li className="flex items-start gap-3">
                      <Check className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
                      <span>Accès à la plateforme (moniteurs, catalogue, alertes)</span>
                    </li>
                    <li className="flex items-start gap-3">
                      <Check className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
                      <span>Accès à la communauté & salons privés</span>
                    </li>
                    <li className="flex items-start gap-3">
                      <Check className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
                      <span>Guides, templates & ressources</span>
                    </li>
                    <li className="flex items-start gap-3">
                      <Check className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
                      <span>Réductions partenaires (emballages, expédition)</span>
                    </li>
                    <li className="flex items-start gap-3">
                      <Check className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
                      <span>Support par ticket</span>
                    </li>
                  </ul>
                </CardContent>
              </Card>

              {/* Optionnel */}
              <Card className="border-2 border-muted">
                <CardHeader>
                  <div className="flex items-center gap-3 mb-2">
                    <div className="w-10 h-10 bg-muted rounded-full flex items-center justify-center">
                      <Sparkles className="w-5 h-5 text-muted-foreground" />
                    </div>
                    <CardTitle className="text-xl">Services complémentaires</CardTitle>
                  </div>
                  <CardDescription>Sur devis ou à la demande</CardDescription>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-4 text-muted-foreground">
                    <li className="flex items-start gap-3">
                      <div className="w-5 h-5 rounded-full border-2 border-muted-foreground/30 flex-shrink-0 mt-0.5" />
                      <span>Accompagnement personnalisé (coaching)</span>
                    </li>
                    <li className="flex items-start gap-3">
                      <div className="w-5 h-5 rounded-full border-2 border-muted-foreground/30 flex-shrink-0 mt-0.5" />
                      <span>Services logistiques spécifiques (AMZing 360)</span>
                    </li>
                    <li className="flex items-start gap-3">
                      <div className="w-5 h-5 rounded-full border-2 border-muted-foreground/30 flex-shrink-0 mt-0.5" />
                      <span>Aide à la création de société</span>
                    </li>
                    <li className="flex items-start gap-3">
                      <div className="w-5 h-5 rounded-full border-2 border-muted-foreground/30 flex-shrink-0 mt-0.5" />
                      <span>Partenariats & services tiers</span>
                    </li>
                  </ul>
                  <p className="text-sm text-muted-foreground mt-6 pt-4 border-t">
                    Besoin d'un service spécifique ? <Link to="/contact" className="text-primary hover:underline">Contacte-nous</Link> pour en discuter.
                  </p>
                </CardContent>
              </Card>
            </div>
          </section>

          {/* Section D: CTAs */}
          <section className="max-w-4xl mx-auto">
            <Card className="bg-gradient-to-r from-primary to-secondary text-white border-none overflow-hidden relative">
              <div className="absolute inset-0 overflow-hidden pointer-events-none">
                <div className="absolute top-10 left-10 w-32 h-32 bg-white/10 rounded-full blur-3xl"></div>
                <div className="absolute bottom-10 right-10 w-40 h-40 bg-white/10 rounded-full blur-3xl"></div>
              </div>
              <CardContent className="p-12 text-center relative z-10">
                <h2 className="text-3xl md:text-4xl font-bold mb-4">
                  Prêt à développer ton business Amazon ?
                </h2>
                <p className="text-xl mb-8 text-white/90 max-w-2xl mx-auto">
                  Rejoins l'espace VIP pour accéder à la formation, la plateforme et la communauté
                </p>
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <Button variant="hero" size="xl" asChild>
                    <Link to="/tarifs">
                      Découvrir les formules
                      <ArrowRight className="w-5 h-5 ml-2" />
                    </Link>
                  </Button>
                  <Button variant="outline" size="xl" className="border-white text-white hover:bg-white/10" asChild>
                    <Link to="/contact">
                      Un besoin spécifique ? Parlons-en
                    </Link>
                  </Button>
                </div>
              </CardContent>
            </Card>
          </section>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default Services;
