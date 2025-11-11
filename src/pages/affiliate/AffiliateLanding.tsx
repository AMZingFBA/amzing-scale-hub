import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { useNavigate } from "react-router-dom";
import { Users, TrendingUp, Euro, Gift, Award, Zap, CheckCircle, AlertCircle, Handshake, ArrowLeft } from "lucide-react";

const AffiliateLanding = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-primary/5 to-secondary/10">
      {/* Back Button */}
      <div className="container mx-auto px-4 pt-6">
        <Button
          variant="ghost"
          size="lg"
          onClick={() => navigate(-1)}
          className="gap-2 hover:bg-primary/10 transition-all duration-300"
        >
          <ArrowLeft className="h-6 w-6 text-primary" />
        </Button>
      </div>

      {/* Hero Section with Gradient Background */}
      <div className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-primary/10 via-transparent to-secondary/10 animate-gradient-shift" />
        
        <div className="container relative mx-auto px-4 py-20 md:py-32">
          <div className="text-center max-w-4xl mx-auto animate-fade-in">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r from-primary/20 to-secondary/20 border border-primary/30 mb-6 animate-fade-in" style={{ animationDelay: '0.1s' }}>
              <Zap className="h-4 w-4 text-primary" />
              <span className="text-sm font-semibold text-foreground">Programme d'affiliation exclusif</span>
            </div>
            
            <h1 className="text-5xl md:text-7xl font-bold mb-6 animate-fade-in" style={{ animationDelay: '0.2s' }}>
              <span className="bg-gradient-to-r from-primary via-primary to-secondary bg-clip-text text-transparent">
                Génère des revenus
              </span>
              <br />
              <span className="text-foreground">passifs illimités</span>
            </h1>
            
            <p className="text-xl md:text-2xl text-muted-foreground mb-10 max-w-2xl mx-auto animate-fade-in" style={{ animationDelay: '0.3s' }}>
              Recommande AMZing FBA à ton réseau et génère des revenus passifs récurrents
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center animate-fade-in" style={{ animationDelay: '0.4s' }}>
              <Button 
                size="lg" 
                onClick={() => navigate("/affiliate/signup")} 
                className="text-lg px-8 py-6 shadow-glow hover:shadow-xl transition-all duration-300 hover-scale bg-gradient-to-r from-primary to-primary-glow"
              >
                <Handshake className="mr-2 h-5 w-5" />
                Rejoindre maintenant
              </Button>
              <Button 
                size="lg" 
                variant="outline" 
                onClick={() => navigate("/affiliate/login")} 
                className="text-lg px-8 py-6 border-2 hover:border-primary hover:bg-primary/5 transition-all duration-300"
              >
                Se connecter
              </Button>
            </div>
            
            <div className="mt-12 flex items-center justify-center gap-8 text-sm text-muted-foreground animate-fade-in" style={{ animationDelay: '0.5s' }}>
              <div className="flex items-center gap-2">
                <CheckCircle className="h-5 w-5 text-primary" />
                <span>Inscription gratuite</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle className="h-5 w-5 text-primary" />
                <span>Paiements mensuels</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle className="h-5 w-5 text-primary" />
                <span>Commissions à vie</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="container mx-auto px-4 py-16">
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
          <Card className="hover-scale transition-all duration-300 hover:shadow-lg animate-fade-in" style={{ animationDelay: '0.1s' }}>
            <CardHeader>
              <Users className="h-12 w-12 mb-4 text-primary transition-transform duration-300 hover:scale-110" />
              <CardTitle>Parrainez facilement</CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription>
                Obtenez votre lien unique et partagez-le avec votre réseau
              </CardDescription>
            </CardContent>
          </Card>

          <Card className="hover-scale transition-all duration-300 hover:shadow-lg animate-fade-in" style={{ animationDelay: '0.2s' }}>
            <CardHeader>
              <TrendingUp className="h-12 w-12 mb-4 text-primary transition-transform duration-300 hover:scale-110" />
              <CardTitle>Suivez vos gains</CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription>
                Dashboard complet pour suivre tous vos filleuls et commissions
              </CardDescription>
            </CardContent>
          </Card>

          <Card className="hover-scale transition-all duration-300 hover:shadow-lg animate-fade-in" style={{ animationDelay: '0.3s' }}>
            <CardHeader>
              <Euro className="h-12 w-12 mb-4 text-primary transition-transform duration-300 hover:scale-110" />
              <CardTitle>Paiements mensuels</CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription>
                Recevez vos commissions chaque mois directement sur votre compte
              </CardDescription>
            </CardContent>
          </Card>

          <Card className="hover-scale transition-all duration-300 hover:shadow-lg animate-fade-in" style={{ animationDelay: '0.4s' }}>
            <CardHeader>
              <Gift className="h-12 w-12 mb-4 text-primary transition-transform duration-300 hover:scale-110" />
              <CardTitle>Commissions attractives</CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription>
                Gagnez pour chaque nouvel abonné que vous parrainez
              </CardDescription>
            </CardContent>
          </Card>
        </div>

        {/* How it Works Section */}
        <div className="max-w-4xl mx-auto mb-20 animate-fade-in" style={{ animationDelay: '0.5s' }}>
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              <span className="text-gradient">Comment ça marche ?</span>
            </h2>
            <p className="text-lg text-muted-foreground">Simple, rapide et efficace en 3 étapes</p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8">
            <Card className="relative overflow-hidden hover-scale transition-all duration-300 hover:shadow-xl border-2 border-transparent hover:border-primary/30 bg-gradient-to-br from-card to-primary/5">
              <div className="absolute top-0 right-0 w-20 h-20 bg-primary/10 rounded-full -mr-10 -mt-10" />
              <CardHeader>
                <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-primary to-primary-glow flex items-center justify-center text-white text-2xl font-bold mb-4 shadow-glow">
                  1
                </div>
                <CardTitle className="text-xl">Inscris-toi</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  Crée ton compte affilié gratuitement en 2 minutes chrono
                </p>
              </CardContent>
            </Card>

            <Card className="relative overflow-hidden hover-scale transition-all duration-300 hover:shadow-xl border-2 border-transparent hover:border-secondary/30 bg-gradient-to-br from-card to-secondary/5">
              <div className="absolute top-0 right-0 w-20 h-20 bg-secondary/10 rounded-full -mr-10 -mt-10" />
              <CardHeader>
                <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-secondary to-secondary/80 flex items-center justify-center text-white text-2xl font-bold mb-4 shadow-blue">
                  2
                </div>
                <CardTitle className="text-xl">Récupère ton lien</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  Obtiens instantanément ton lien de parrainage unique
                </p>
              </CardContent>
            </Card>

            <Card className="relative overflow-hidden hover-scale transition-all duration-300 hover:shadow-xl border-2 border-transparent hover:border-primary/30 bg-gradient-to-br from-card to-primary/5">
              <div className="absolute top-0 right-0 w-20 h-20 bg-primary/10 rounded-full -mr-10 -mt-10" />
              <CardHeader>
                <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-primary to-primary-glow flex items-center justify-center text-white text-2xl font-bold mb-4 shadow-glow">
                  3
                </div>
                <CardTitle className="text-xl">Partage & gagne</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  Partage ton lien et commence à gagner des commissions
                </p>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Program Details */}
        <div className="max-w-6xl mx-auto mb-20">
          <div className="text-center mb-12 animate-fade-in" style={{ animationDelay: '0.6s' }}>
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r from-primary/10 to-secondary/10 border border-primary/20 mb-6">
              <Zap className="h-5 w-5 text-primary" />
              <span className="text-sm font-semibold">Programme exclusif</span>
            </div>
            <h2 className="text-4xl md:text-5xl font-bold mb-4">
              <span className="text-gradient">Gagne de l'argent</span>
              <br />
              <span className="text-foreground">chaque mois automatiquement</span>
            </h2>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              Un système simple et transparent avec un seul niveau de parrainage
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8 mb-12">
            <Card className="relative overflow-hidden border-2 border-primary/20 bg-gradient-to-br from-primary/10 via-card to-card hover-scale transition-all duration-300 hover:shadow-2xl animate-fade-in" style={{ animationDelay: '0.7s' }}>
              <div className="absolute -top-10 -right-10 w-40 h-40 bg-primary/20 rounded-full blur-3xl" />
              <CardHeader className="relative z-10">
                <div className="flex items-center gap-4">
                  <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-primary to-primary-glow flex items-center justify-center shadow-glow">
                    <Award className="h-8 w-8 text-white" />
                  </div>
                  <div>
                    <CardTitle className="text-2xl md:text-3xl">34,99 € / mois</CardTitle>
                    <CardDescription className="text-base mt-1">Prix de l'abonnement</CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="relative z-10">
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <CheckCircle className="h-4 w-4 text-primary" />
                  <span>1 seul niveau – 100% automatique</span>
                </div>
              </CardContent>
            </Card>

            <Card className="relative overflow-hidden border-2 border-secondary/20 bg-gradient-to-br from-secondary/10 via-card to-card hover-scale transition-all duration-300 hover:shadow-2xl animate-fade-in" style={{ animationDelay: '0.8s' }}>
              <div className="absolute -top-10 -right-10 w-40 h-40 bg-secondary/20 rounded-full blur-3xl" />
              <CardHeader className="relative z-10">
                <div className="flex items-center gap-4">
                  <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-secondary to-secondary/80 flex items-center justify-center shadow-blue">
                    <Euro className="h-8 w-8 text-white" />
                  </div>
                  <div>
                    <CardTitle className="text-2xl md:text-3xl text-gradient">6,99 € / mois</CardTitle>
                    <CardDescription className="text-base mt-1">Ta commission (20%)</CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="relative z-10">
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <CheckCircle className="h-4 w-4 text-secondary" />
                  <span>Par filleul actif – À vie</span>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Commission Table */}
          <Card className="mb-12 overflow-hidden border-2 border-primary/30 hover-scale transition-all duration-300 hover:shadow-2xl animate-fade-in" style={{ animationDelay: '0.9s' }}>
            <div className="bg-gradient-to-r from-primary/10 to-secondary/10 p-6 border-b">
              <CardTitle className="text-2xl md:text-3xl flex items-center gap-3">
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-primary to-primary-glow flex items-center justify-center shadow-glow">
                  <Euro className="h-6 w-6 text-white" />
                </div>
                Barème de commission
              </CardTitle>
            </div>
            <CardContent className="p-8">
              <div className="bg-gradient-to-br from-primary/5 to-transparent rounded-2xl p-8 border-2 border-primary/20 mb-6">
                <div className="flex items-center justify-between flex-wrap gap-4">
                  <div>
                    <div className="text-sm text-muted-foreground mb-2">🥇 Parrain direct</div>
                    <div className="text-4xl font-bold text-gradient">20%</div>
                    <div className="text-sm text-muted-foreground mt-1">sur chaque abonnement</div>
                  </div>
                  <div className="text-center">
                    <div className="text-6xl font-bold text-primary">=</div>
                  </div>
                  <div className="text-right">
                    <div className="text-sm text-muted-foreground mb-2">Ta commission</div>
                    <div className="text-4xl md:text-5xl font-bold text-primary">6,99 €</div>
                    <div className="text-sm text-muted-foreground mt-1">par filleul / mois</div>
                  </div>
                </div>
              </div>
              
              <div className="bg-muted/30 rounded-xl p-6 border border-primary/20">
                <div className="space-y-3">
                  <div className="flex items-start gap-3">
                    <CheckCircle className="h-6 w-6 text-primary flex-shrink-0 mt-0.5" />
                    <p className="text-sm font-medium">
                      <strong className="text-primary">Commissions automatiques</strong> – Tant que ton filleul reste abonné, tu touches 6,99 € chaque mois
                    </p>
                  </div>
                  <div className="flex items-start gap-3">
                    <CheckCircle className="h-6 w-6 text-primary flex-shrink-0 mt-0.5" />
                    <p className="text-sm font-medium">
                      <strong className="text-primary">Paiements mensuels</strong> – Versés à la fin du mois après validation du paiement du filleul
                    </p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Examples Section */}
          <Card className="mb-12 overflow-hidden border-2 border-secondary/30 hover-scale transition-all duration-300 hover:shadow-2xl animate-fade-in" style={{ animationDelay: '1s' }}>
            <div className="bg-gradient-to-r from-secondary/10 to-primary/10 p-6 border-b">
              <CardTitle className="text-2xl md:text-3xl flex items-center gap-3">
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-secondary to-secondary/80 flex items-center justify-center shadow-blue">
                  <TrendingUp className="h-6 w-6 text-white" />
                </div>
                Potentiel de revenus
              </CardTitle>
            </div>
            <CardContent className="p-8">
              <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
                <div className="bg-gradient-to-br from-muted/50 to-muted/20 rounded-2xl p-6 text-center border border-border hover:border-primary/30 transition-all">
                  <div className="text-5xl font-bold mb-2">1</div>
                  <div className="text-sm text-muted-foreground mb-3">filleul</div>
                  <div className="text-2xl font-bold text-primary">6,99 €</div>
                  <div className="text-xs text-muted-foreground mt-1">par mois</div>
                </div>
                
                <div className="bg-gradient-to-br from-primary/10 to-primary/5 rounded-2xl p-6 text-center border-2 border-primary/30 hover:border-primary/50 transition-all">
                  <div className="text-5xl font-bold mb-2">5</div>
                  <div className="text-sm text-muted-foreground mb-3">filleuls</div>
                  <div className="text-2xl font-bold text-primary">34,95 €</div>
                  <div className="text-xs text-muted-foreground mt-1">par mois</div>
                </div>
                
                <div className="bg-gradient-to-br from-secondary/10 to-secondary/5 rounded-2xl p-6 text-center border-2 border-secondary/30 hover:border-secondary/50 transition-all">
                  <div className="text-5xl font-bold mb-2">10</div>
                  <div className="text-sm text-muted-foreground mb-3">filleuls</div>
                  <div className="text-2xl font-bold text-secondary">69,90 €</div>
                  <div className="text-xs text-muted-foreground mt-1">par mois</div>
                </div>
                
                <div className="bg-gradient-to-br from-primary/20 to-secondary/20 rounded-2xl p-6 text-center border-2 border-primary/50 hover:border-primary transition-all shadow-glow">
                  <div className="text-5xl font-bold mb-2">20</div>
                  <div className="text-sm text-muted-foreground mb-3">filleuls</div>
                  <div className="text-3xl font-bold text-gradient">139,80 €</div>
                  <div className="text-xs text-muted-foreground mt-1">par mois</div>
                </div>
              </div>
              
              <div className="mt-8 space-y-3">
                <div className="flex items-center gap-3 bg-primary/5 rounded-lg p-4">
                  <CheckCircle className="h-6 w-6 text-primary flex-shrink-0" />
                  <p className="font-medium">Pas de limite – Parraine autant de personnes que tu veux</p>
                </div>
                <div className="flex items-center gap-3 bg-secondary/5 rounded-lg p-4">
                  <CheckCircle className="h-6 w-6 text-secondary flex-shrink-0" />
                  <p className="font-medium">Revenus récurrents – Chaque filleul te rapporte à vie</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* How it Works Details */}
          <Card className="mb-12 border-2 border-border hover-scale transition-all duration-300 hover:shadow-xl animate-fade-in" style={{ animationDelay: '1.1s' }}>
            <CardHeader className="bg-gradient-to-r from-muted/50 to-muted/20 border-b">
              <CardTitle className="text-2xl">🧾 Comment ça fonctionne ?</CardTitle>
            </CardHeader>
            <CardContent className="p-8">
              <div className="grid md:grid-cols-2 gap-6">
                <div className="flex gap-4 bg-gradient-to-br from-primary/5 to-transparent rounded-xl p-6 border border-primary/20">
                  <div className="w-12 h-12 rounded-xl bg-primary/20 flex items-center justify-center flex-shrink-0">
                    <CheckCircle className="h-6 w-6 text-primary" />
                  </div>
                  <div>
                    <p className="font-bold mb-2">Calcul automatique</p>
                    <p className="text-sm text-muted-foreground">
                      Commissions calculées en fin de mois après validation du paiement
                    </p>
                  </div>
                </div>
                
                <div className="flex gap-4 bg-gradient-to-br from-secondary/5 to-transparent rounded-xl p-6 border border-secondary/20">
                  <div className="w-12 h-12 rounded-xl bg-secondary/20 flex items-center justify-center flex-shrink-0">
                    <CheckCircle className="h-6 w-6 text-secondary" />
                  </div>
                  <div>
                    <p className="font-bold mb-2">Virement bancaire</p>
                    <p className="text-sm text-muted-foreground">
                      Paiement direct sur ton RIB fourni à l'inscription
                    </p>
                  </div>
                </div>
                
                <div className="flex gap-4 bg-gradient-to-br from-secondary/5 to-transparent rounded-xl p-6 border border-secondary/20">
                  <div className="w-12 h-12 rounded-xl bg-secondary/20 flex items-center justify-center flex-shrink-0">
                    <CheckCircle className="h-6 w-6 text-secondary" />
                  </div>
                  <div>
                    <p className="font-bold mb-2">Dashboard en temps réel</p>
                    <p className="text-sm text-muted-foreground">
                      Suis tes filleuls et tes gains depuis ton espace
                    </p>
                  </div>
                </div>
                
                <div className="flex gap-4 bg-gradient-to-br from-primary/5 to-transparent rounded-xl p-6 border border-primary/20">
                  <div className="w-12 h-12 rounded-xl bg-primary/20 flex items-center justify-center flex-shrink-0">
                    <CheckCircle className="h-6 w-6 text-primary" />
                  </div>
                  <div>
                    <p className="font-bold mb-2">Aucun frais</p>
                    <p className="text-sm text-muted-foreground">
                      Inscription gratuite, aucun frais caché
                    </p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Important Notice */}
          <Card className="border-2 border-primary/40 bg-gradient-to-br from-primary/10 via-card to-card hover-scale transition-all duration-300 hover:shadow-2xl mb-12 animate-fade-in" style={{ animationDelay: '1.2s' }}>
            <CardContent className="p-8">
              <div className="flex items-start gap-4">
                <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-primary to-primary-glow flex items-center justify-center flex-shrink-0 shadow-glow">
                  <AlertCircle className="h-7 w-7 text-white animate-pulse" />
                </div>
                <div className="space-y-3">
                  <h3 className="text-xl font-bold">Programme 100% conforme</h3>
                  <div className="space-y-2 text-muted-foreground">
                    <p className="flex items-start gap-2">
                      <span className="text-primary font-bold">•</span>
                      <span>Système d'affiliation à <strong className="text-foreground">un seul niveau</strong> – Simple et transparent</span>
                    </p>
                    <p className="flex items-start gap-2">
                      <span className="text-primary font-bold">•</span>
                      <span>Commissions versées uniquement sur les abonnements <strong className="text-foreground">réellement payés et validés</strong></span>
                    </p>
                    <p className="flex items-start gap-2">
                      <span className="text-primary font-bold">•</span>
                      <span>Structure <strong className="text-primary">100% conforme à la loi française</strong> et durable</span>
                    </p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Final CTA */}
          <div className="text-center py-12 animate-fade-in" style={{ animationDelay: '1.3s' }}>
            <div className="max-w-2xl mx-auto">
              <h3 className="text-3xl md:text-4xl font-bold mb-4">
                <span className="text-gradient">Prêt à générer</span>
                <br />
                <span className="text-foreground">des revenus passifs ?</span>
              </h3>
              <p className="text-lg text-muted-foreground mb-8">
                Rejoins des centaines d'affiliés qui gagnent déjà de l'argent chaque mois
              </p>
              <Button 
                size="lg" 
                onClick={() => navigate("/affiliate/signup")} 
                className="text-lg px-10 py-7 shadow-glow hover:shadow-xl transition-all duration-300 hover-scale bg-gradient-to-r from-primary to-primary-glow"
              >
                <Handshake className="mr-2 h-6 w-6" />
                Je crée mon compte affilié
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AffiliateLanding;
