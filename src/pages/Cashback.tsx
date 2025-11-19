import { useScrollReveal } from '@/hooks/use-scroll-reveal';
import { cn } from '@/lib/utils';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { DollarSign, CheckCircle, Sparkles, ArrowLeft, TrendingUp, Gift, Zap } from 'lucide-react';
import { Link } from 'react-router-dom';

const Cashback = () => {
  const { ref: heroRef, isVisible: heroVisible } = useScrollReveal({ delay: 0.1 });
  const { ref: benefitsRef, isVisible: benefitsVisible } = useScrollReveal({ delay: 0.2 });
  const { ref: howItWorksRef, isVisible: howItWorksVisible } = useScrollReveal({ delay: 0.3 });
  const { ref: ctaRef, isVisible: ctaVisible } = useScrollReveal({ delay: 0.4 });

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-b from-background via-background to-accent/20">
      <Navbar />
      
      <main className="flex-1 pt-24 pb-16">
        <div className="container mx-auto px-4">
          {/* Back Button */}
          <Button variant="ghost" asChild className="mb-8">
            <Link to="/dashboard" className="gap-2">
              <ArrowLeft className="w-4 h-4" />
              Retour au Dashboard
            </Link>
          </Button>

          {/* Hero Section */}
          <div ref={heroRef} className={cn("mb-12", heroVisible && "animate-fade-in")}>
            <Card className="border-primary/30 bg-gradient-to-br from-primary/10 via-primary/5 to-transparent relative overflow-hidden">
              <div className="absolute top-0 right-0 w-64 h-64 bg-primary/10 rounded-full blur-3xl" />
              <div className="absolute bottom-0 left-0 w-48 h-48 bg-secondary/10 rounded-full blur-3xl" />
              <CardContent className="pt-8 pb-10 relative">
                <div className="space-y-6">
                  <div className="flex flex-col md:flex-row items-start gap-6">
                    <div className="p-4 bg-primary/20 rounded-2xl animate-pulse">
                      <DollarSign className="w-12 h-12 text-primary" />
                    </div>
                    <div className="flex-1">
                      <h1 className="text-4xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
                        💸 Gagne plus à chaque achat avec le Cashback !
                      </h1>
                      <p className="text-xl text-muted-foreground mb-4">
                        Récupère une partie de ton argent sur tes achats en ligne
                      </p>
                      <div className="bg-background/80 backdrop-blur-sm rounded-lg p-6 border border-primary/20">
                        <p className="text-2xl font-semibold text-center">
                          Le cashback, c'est un moyen simple de récupérer une partie de ton argent à chaque achat en ligne 🛍️
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Benefits Section */}
          <div ref={benefitsRef} className={cn("mb-12", benefitsVisible && "animate-fade-in")}>
            <h2 className="text-3xl font-bold mb-6 flex items-center gap-3">
              <Sparkles className="w-8 h-8 text-primary" />
              Pourquoi utiliser le cashback ?
            </h2>
            <div className="grid md:grid-cols-3 gap-6">
              <Card className="border-primary/20 hover:border-primary/40 transition-all duration-300 hover:shadow-lg hover:shadow-primary/10 hover:scale-105">
                <CardHeader>
                  <CardTitle className="flex items-center gap-3">
                    <div className="p-3 bg-primary/10 rounded-lg">
                      <TrendingUp className="w-6 h-6 text-primary" />
                    </div>
                    Économise sur chaque achat
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">
                    Récupère jusqu'à 15% de cashback sur tes achats chez plus de 1500 marchands partenaires.
                  </p>
                </CardContent>
              </Card>

              <Card className="border-primary/20 hover:border-primary/40 transition-all duration-300 hover:shadow-lg hover:shadow-primary/10 hover:scale-105">
                <CardHeader>
                  <CardTitle className="flex items-center gap-3">
                    <div className="p-3 bg-primary/10 rounded-lg">
                      <Gift className="w-6 h-6 text-primary" />
                    </div>
                    Bonus de bienvenue
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">
                    Profite d'un bonus de 3€ offerts dès ton inscription via notre lien partenaire exclusif.
                  </p>
                </CardContent>
              </Card>

              <Card className="border-primary/20 hover:border-primary/40 transition-all duration-300 hover:shadow-lg hover:shadow-primary/10 hover:scale-105">
                <CardHeader>
                  <CardTitle className="flex items-center gap-3">
                    <div className="p-3 bg-primary/10 rounded-lg">
                      <Zap className="w-6 h-6 text-primary" />
                    </div>
                    Simple et rapide
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">
                    Achète normalement sur tes sites préférés et reçois ton cashback automatiquement.
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>

          {/* How it works */}
          <div ref={howItWorksRef} className={cn("mb-12", howItWorksVisible && "animate-fade-in")}>
            <h2 className="text-3xl font-bold mb-6 flex items-center gap-3">
              <CheckCircle className="w-8 h-8 text-primary" />
              Comment ça marche ?
            </h2>
            <div className="space-y-4">
              <Card className="border-primary/20 hover:border-primary/40 transition-colors">
                <CardContent className="pt-6">
                  <div className="flex items-start gap-4">
                    <div className="flex items-center justify-center w-12 h-12 rounded-full bg-primary/20 text-primary font-bold text-xl flex-shrink-0">
                      1
                    </div>
                    <div>
                      <h3 className="text-xl font-bold mb-2">📝 Inscris-toi gratuitement</h3>
                      <p className="text-muted-foreground">
                        Crée ton compte iGraal via notre lien partenaire et reçois ton bonus de bienvenue de 3€.
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="border-primary/20 hover:border-primary/40 transition-colors">
                <CardContent className="pt-6">
                  <div className="flex items-start gap-4">
                    <div className="flex items-center justify-center w-12 h-12 rounded-full bg-primary/20 text-primary font-bold text-xl flex-shrink-0">
                      2
                    </div>
                    <div>
                      <h3 className="text-xl font-bold mb-2">🛒 Fais tes achats normalement</h3>
                      <p className="text-muted-foreground">
                        Passe par iGraal avant d'acheter sur tes sites préférés (Amazon, Cdiscount, Fnac, etc.).
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="border-primary/20 hover:border-primary/40 transition-colors">
                <CardContent className="pt-6">
                  <div className="flex items-start gap-4">
                    <div className="flex items-center justify-center w-12 h-12 rounded-full bg-primary/20 text-primary font-bold text-xl flex-shrink-0">
                      3
                    </div>
                    <div>
                      <h3 className="text-xl font-bold mb-2">💰 Récupère ton cashback</h3>
                      <p className="text-muted-foreground">
                        Ton cashback est crédité automatiquement et tu peux le retirer par virement bancaire dès 20€.
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>

          {/* Examples Section */}
          <div className="mb-12">
            <Card className="border-primary/20 bg-gradient-to-br from-accent/50 to-transparent">
              <CardHeader>
                <CardTitle className="text-2xl flex items-center gap-3">
                  <Sparkles className="w-8 h-8 text-primary" />
                  Exemples de cashback
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center justify-between p-4 rounded-lg bg-background/60 backdrop-blur-sm border border-primary/10">
                    <div>
                      <p className="font-semibold">Amazon</p>
                      <p className="text-sm text-muted-foreground">Achats en ligne</p>
                    </div>
                    <div className="text-right">
                      <p className="text-2xl font-bold text-primary">3%</p>
                      <p className="text-xs text-muted-foreground">de cashback</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center justify-between p-4 rounded-lg bg-background/60 backdrop-blur-sm border border-primary/10">
                    <div>
                      <p className="font-semibold">Cdiscount</p>
                      <p className="text-sm text-muted-foreground">Électronique & high-tech</p>
                    </div>
                    <div className="text-right">
                      <p className="text-2xl font-bold text-primary">5%</p>
                      <p className="text-xs text-muted-foreground">de cashback</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center justify-between p-4 rounded-lg bg-background/60 backdrop-blur-sm border border-primary/10">
                    <div>
                      <p className="font-semibold">Booking.com</p>
                      <p className="text-sm text-muted-foreground">Réservations voyages</p>
                    </div>
                    <div className="text-right">
                      <p className="text-2xl font-bold text-primary">4%</p>
                      <p className="text-xs text-muted-foreground">de cashback</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* CTA Final */}
          <div ref={ctaRef} className={cn("", ctaVisible && "animate-fade-in")}>
            <Card className="bg-gradient-to-r from-primary/20 via-primary/10 to-transparent border-primary/30 overflow-hidden relative">
              <div className="absolute inset-0 bg-gradient-to-r from-primary/5 to-secondary/5 animate-pulse" />
              <CardContent className="pt-10 pb-12 text-center relative">
                <DollarSign className="w-16 h-16 text-primary mx-auto mb-6 animate-bounce" />
                <h3 className="text-3xl font-bold mb-4">
                  Commence à économiser dès maintenant 🚀
                </h3>
                <p className="text-xl text-muted-foreground mb-8">
                  + de 1500 sites partenaires · Bonus de 3€ offerts · Gratuit à vie
                </p>
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <Button size="lg" asChild className="text-lg px-8">
                    <Link to="/support">
                      Obtenir le lien iGraal
                    </Link>
                  </Button>
                  <Button size="lg" variant="outline" asChild className="text-lg px-8">
                    <Link to="/contact">
                      Une question ?
                    </Link>
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default Cashback;
