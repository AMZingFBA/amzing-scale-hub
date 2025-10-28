import { Users, Crown, Zap, BookOpen, TrendingUp, MessageSquare, Gift, Target, CheckCircle2, Star, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Capacitor } from "@capacitor/core";
import { useScrollReveal } from "@/hooks/use-scroll-reveal";

const Catalogue = () => {
  const isNativeApp = Capacitor.isNativePlatform();
  const heroReveal = useScrollReveal({ animation: "fade-up", delay: 100 });
  const statsReveal = useScrollReveal({ animation: "scale", delay: 200 });
  const testimonialsReveal = useScrollReveal({ animation: "fade-up", delay: 100 });
  
  const benefits = [
    {
      icon: BookOpen,
      title: "Formation Complète",
      description: "Accès à toutes nos formations pour maîtriser Amazon FBA de A à Z",
    },
    {
      icon: Gift,
      title: "Catalogue Produits Rentables",
      description: "Produits sourcés avec ROI transparent, mis à jour chaque semaine",
    },
    {
      icon: TrendingUp,
      title: "Analyses de Marché",
      description: "Outils et données exclusives pour identifier les meilleures opportunités",
    },
    {
      icon: Users,
      title: "Communauté Active",
      description: "Échange avec des vendeurs expérimentés et partage d'expériences",
    },
    {
      icon: MessageSquare,
      title: "Support Prioritaire",
      description: "Notre équipe répond à toutes vos questions 7j/7",
    },
    {
      icon: Zap,
      title: "Alertes en Temps Réel",
      description: "Soyez le premier informé des nouvelles opportunités",
    },
  ];

  const testimonials = [
    {
      name: "Thomas R.",
      text: "Grâce à AMZing FBA, j'ai lancé mon premier produit en 3 semaines et généré 5000€ de CA le premier mois !",
      rating: 5,
    },
    {
      name: "Sophie M.",
      text: "La communauté est incroyable. J'ai trouvé mes meilleurs produits grâce aux recommandations des membres.",
      rating: 5,
    },
    {
      name: "Karim L.",
      text: "Le catalogue produits est une mine d'or. Les ROI sont réalistes et les produits validés. Je recommande !",
      rating: 5,
    },
  ];

  return (
    <div className="min-h-screen relative overflow-hidden">
      <Navbar />
      
      {/* Animated background - Only for native app */}
      {isNativeApp && (
        <>
          <div className="absolute inset-0 overflow-hidden pointer-events-none">
            <div className="absolute top-20 left-10 w-72 h-72 bg-primary/20 rounded-full blur-3xl animate-pulse" />
            <div className="absolute top-40 right-10 w-96 h-96 bg-secondary/20 rounded-full blur-3xl animate-pulse" style={{ animationDelay: "1s" }} />
            <div className="absolute bottom-20 left-1/3 w-80 h-80 bg-accent/20 rounded-full blur-3xl animate-pulse" style={{ animationDelay: "2s" }} />
          </div>
          
          {/* Floating particles */}
          <div className="absolute inset-0 overflow-hidden pointer-events-none opacity-30">
            {[...Array(20)].map((_, i) => (
              <div
                key={i}
                className="absolute w-2 h-2 bg-primary rounded-full animate-pulse"
                style={{
                  top: `${Math.random() * 100}%`,
                  left: `${Math.random() * 100}%`,
                  animationDelay: `${Math.random() * 3}s`,
                  animationDuration: `${2 + Math.random() * 3}s`,
                }}
              />
            ))}
          </div>
        </>
      )}
      
      <div className="pt-32 pb-20 relative">
        <div className="container mx-auto px-4">
          {/* Hero Section */}
          <div 
            ref={isNativeApp ? heroReveal.ref : undefined}
            className={`text-center mb-20 relative ${isNativeApp && !heroReveal.isVisible ? 'opacity-0 translate-y-10' : ''} ${isNativeApp ? 'transition-all duration-1000 ease-out' : ''}`}
          >
            <div className="absolute inset-0 bg-gradient-to-r from-primary/20 via-secondary/20 to-primary/20 blur-3xl -z-10" />
            <Badge className={`mb-6 bg-gradient-to-r from-primary to-secondary text-white border-none px-6 py-2 text-base ${isNativeApp ? 'animate-pulse shadow-lg shadow-primary/50' : ''}`}>
              <Crown className="w-4 h-4 inline mr-2" />
              Communauté VIP
            </Badge>
            <h1 className={`text-5xl md:text-7xl font-bold mb-6 bg-gradient-to-r from-primary via-secondary to-primary bg-clip-text text-transparent ${isNativeApp ? 'animate-fade-in' : ''}`}>
              Rejoins la Communauté #1
            </h1>
            <h2 className={`text-3xl md:text-4xl font-bold mb-8 ${isNativeApp ? 'animate-fade-in' : ''}`} style={isNativeApp ? { animationDelay: '0.2s' } : {}}>
              des Vendeurs Amazon FBA
            </h2>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto mb-12">
              Accède à notre formation complète, catalogue exclusif de produits rentables, 
              outils pro et une communauté de vendeurs qui cartonnent 🚀
            </p>
            
            <div className={`flex flex-col sm:flex-row gap-4 justify-center items-center mb-8 ${isNativeApp ? 'animate-scale-in' : ''}`} style={isNativeApp ? { animationDelay: '0.4s' } : {}}>
              <Button 
                size="lg" 
                className={`bg-gradient-to-r from-primary to-secondary text-white border-none hover:opacity-90 px-8 py-6 text-lg font-bold ${isNativeApp ? 'shadow-2xl shadow-primary/50 hover:shadow-primary/70 transition-all duration-300 hover:scale-105' : ''}`}
                onClick={() => {
                  // TODO: Remplacer par le lien Whop
                  alert("Lien Whop à venir");
                }}
              >
                <Crown className="w-5 h-5 mr-2" />
                Accéder Maintenant
              </Button>
              <Button 
                size="lg" 
                variant="outline"
                onClick={() => window.location.href = "/formation"}
              >
                En savoir plus
              </Button>
            </div>

            <div className="flex justify-center gap-8 text-sm text-muted-foreground">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-5 h-5 text-green-500" />
                <span>Sans engagement</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-5 h-5 text-green-500" />
                <span>Accès immédiat</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-5 h-5 text-green-500" />
                <span>500+ membres actifs</span>
              </div>
            </div>
          </div>

          {/* Benefits Grid */}
          <div className="mb-20">
            <h2 className={`text-4xl font-bold text-center mb-12 ${isNativeApp ? 'animate-fade-in' : ''}`}>
              Ce qui t{"'"}inclut dans ton accès VIP
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {benefits.map((benefit, index) => {
                const Icon = benefit.icon;
                const cardReveal = useScrollReveal({ animation: "fade-up", delay: index * 100 });
                return (
                  <Card 
                    key={index} 
                    ref={isNativeApp ? cardReveal.ref : undefined}
                    className={`hover:shadow-xl transition-all hover:-translate-y-1 ${isNativeApp && !cardReveal.isVisible ? 'opacity-0 translate-y-10' : ''} ${isNativeApp ? 'transition-all duration-700 ease-out' : ''} ${isNativeApp ? 'border-2 border-primary/10 hover:border-primary/30' : ''}`}
                  >
                    <CardContent className="pt-6">
                      <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br from-primary to-secondary flex items-center justify-center mb-4 ${isNativeApp ? 'shadow-lg shadow-primary/30 animate-pulse' : ''}`}>
                        <Icon className="w-7 h-7 text-white" />
                      </div>
                      <h3 className="text-xl font-bold mb-3">{benefit.title}</h3>
                      <p className="text-muted-foreground">{benefit.description}</p>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          </div>

          {/* Stats Section */}
          <Card 
            ref={isNativeApp ? statsReveal.ref : undefined}
            className={`mb-20 bg-gradient-to-r from-primary/5 via-secondary/5 to-primary/5 border-2 border-primary/20 ${isNativeApp && !statsReveal.isVisible ? 'opacity-0 scale-95' : ''} ${isNativeApp ? 'transition-all duration-1000 ease-out shadow-2xl' : ''}`}
          >
            <CardContent className="p-12">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
                <div className={isNativeApp ? 'animate-fade-in' : ''} style={isNativeApp ? { animationDelay: '0.2s' } : {}}>
                  <div className={`text-5xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent mb-2 ${isNativeApp ? 'animate-pulse' : ''}`}>
                    500+
                  </div>
                  <p className="text-muted-foreground font-medium">Membres actifs</p>
                </div>
                <div className={isNativeApp ? 'animate-fade-in' : ''} style={isNativeApp ? { animationDelay: '0.4s' } : {}}>
                  <div className={`text-5xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent mb-2 ${isNativeApp ? 'animate-pulse' : ''}`}>
                    50+
                  </div>
                  <p className="text-muted-foreground font-medium">Produits validés/mois</p>
                </div>
                <div className={isNativeApp ? 'animate-fade-in' : ''} style={isNativeApp ? { animationDelay: '0.6s' } : {}}>
                  <div className={`text-5xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent mb-2 ${isNativeApp ? 'animate-pulse' : ''}`}>
                    24h
                  </div>
                  <p className="text-muted-foreground font-medium">Temps de réponse moyen</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Testimonials */}
          <div 
            ref={isNativeApp ? testimonialsReveal.ref : undefined}
            className={`mb-20 ${isNativeApp && !testimonialsReveal.isVisible ? 'opacity-0 translate-y-10' : ''} ${isNativeApp ? 'transition-all duration-1000 ease-out' : ''}`}
          >
            <h2 className="text-4xl font-bold text-center mb-4">
              Ils ont rejoint la communauté
            </h2>
            <p className="text-center text-muted-foreground mb-12 text-lg">
              Découvre ce que nos membres disent de leur expérience
            </p>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {testimonials.map((testimonial, index) => {
                const testReveal = useScrollReveal({ animation: "fade-up", delay: index * 150 });
                return (
                  <Card 
                    key={index} 
                    ref={isNativeApp ? testReveal.ref : undefined}
                    className={`hover:shadow-lg transition-shadow ${isNativeApp && !testReveal.isVisible ? 'opacity-0 translate-y-10' : ''} ${isNativeApp ? 'transition-all duration-700 ease-out border-2 border-primary/10 hover:border-primary/30 hover:scale-105' : ''}`}
                  >
                    <CardHeader>
                      <div className="flex gap-1 mb-3">
                        {[...Array(testimonial.rating)].map((_, i) => (
                          <Star key={i} className={`w-5 h-5 fill-yellow-400 text-yellow-400 ${isNativeApp ? 'animate-pulse' : ''}`} style={isNativeApp ? { animationDelay: `${i * 0.1}s` } : {}} />
                        ))}
                      </div>
                      <p className="text-muted-foreground italic">"{testimonial.text}"</p>
                    </CardHeader>
                    <CardContent>
                      <p className="font-bold text-primary">{testimonial.name}</p>
                      <p className="text-sm text-muted-foreground">Membre VIP</p>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          </div>

          {/* What You Get */}
          <Card className="mb-20 border-2 border-primary/30">
            <CardContent className="p-12">
              <h2 className="text-3xl font-bold text-center mb-12">
                Ton accès VIP débloque immédiatement
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl mx-auto">
                {[
                  "✅ Formation Amazon FBA complète (débutant à avancé)",
                  "✅ Catalogue de +200 produits rentables mis à jour",
                  "✅ Analyses de marché et tendances en temps réel",
                  "✅ Outils de calcul de rentabilité et ROI",
                  "✅ Templates et documents prêts à l'emploi",
                  "✅ Sessions Q&A en direct avec des experts",
                  "✅ Support prioritaire 7j/7",
                  "✅ Réseau de vendeurs expérimentés",
                ].map((item, index) => (
                  <div key={index} className="flex items-start gap-3">
                    <div className="text-xl">{item}</div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Final CTA */}
          <Card className={`bg-gradient-to-r from-primary via-secondary to-primary text-white border-none ${isNativeApp ? 'shadow-2xl shadow-primary/50 animate-fade-in' : ''}`}>
            <CardContent className="p-12 text-center relative overflow-hidden">
              {isNativeApp && (
                <>
                  <Sparkles className="absolute top-4 left-4 w-6 h-6 text-white/50 animate-pulse" />
                  <Sparkles className="absolute top-8 right-8 w-8 h-8 text-white/50 animate-pulse" style={{ animationDelay: '0.5s' }} />
                  <Sparkles className="absolute bottom-4 right-12 w-6 h-6 text-white/50 animate-pulse" style={{ animationDelay: '1s' }} />
                </>
              )}
              <Crown className={`w-16 h-16 mx-auto mb-6 text-white ${isNativeApp ? 'animate-bounce' : ''}`} />
              <h2 className="text-3xl md:text-5xl font-bold mb-6">
                Prêt à Lancer Ton Business Amazon ?
              </h2>
              <p className="text-xl mb-8 text-white/90 max-w-2xl mx-auto">
                Rejoins dès maintenant des centaines de vendeurs qui réussissent grâce à AMZing FBA
              </p>
              <Button 
                size="lg" 
                className={`bg-white text-primary hover:bg-white/90 px-10 py-6 text-lg font-bold ${isNativeApp ? 'shadow-2xl hover:shadow-white/50 transition-all duration-300 hover:scale-110 animate-pulse' : ''}`}
                onClick={() => {
                  // TODO: Remplacer par le lien Whop
                  alert("Lien Whop à venir");
                }}
              >
                <Target className="w-5 h-5 mr-2" />
                Rejoindre la Communauté VIP
              </Button>
              <p className="mt-6 text-sm text-white/80">
                Sans engagement • Annule quand tu veux • Accès immédiat 24/7
              </p>
            </CardContent>
          </Card>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default Catalogue;
