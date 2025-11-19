import { useScrollReveal } from '@/hooks/use-scroll-reveal';
import { cn } from '@/lib/utils';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { FileText, CheckCircle, AlertCircle, Sparkles, ArrowLeft, Shield, Lock } from 'lucide-react';
import { Link } from 'react-router-dom';

const FactureAutorisation = () => {
  const heroReveal = useScrollReveal({ animation: "fade-up", delay: 0 });
  const card1Reveal = useScrollReveal({ animation: "fade-left", delay: 100 });
  const card2Reveal = useScrollReveal({ animation: "fade-right", delay: 200 });
  const benefitsReveal = useScrollReveal({ animation: "scale", delay: 100 });
  const ctaReveal = useScrollReveal({ animation: "scale", delay: 200 });

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
              <div className="absolute top-0 right-0 w-64 h-64 bg-primary/10 rounded-full blur-3xl animate-pulse" />
              <CardContent className="pt-8 pb-10 relative">
                <div className="space-y-6">
                  <div className="flex flex-col md:flex-row items-start gap-6">
                    <div className="p-4 bg-primary/20 rounded-2xl">
                      <FileText className="w-12 h-12 text-primary" />
                    </div>
                    <div className="flex-1">
                      <h1 className="text-4xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
                        Facture ou autorisation d'utilisation de marque
                      </h1>
                      <p className="text-xl text-muted-foreground mb-4">
                        Tous les documents essentiels pour vendre en toute conformité sur Amazon
                      </p>
                      <div className="bg-background/80 backdrop-blur-sm rounded-lg p-6 border border-primary/20">
                        <p className="text-lg font-semibold">
                          📄 Obtenez vos documents officiels en 24-48h via notre partenaire de confiance
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Main Content */}
          <div ref={contentRef} className={cn("mb-12", contentVisible && "animate-fade-in")}>
            <div className="grid md:grid-cols-2 gap-6 mb-8">
              <Card className="border-primary/20 hover:border-primary/40 transition-all duration-300 hover:shadow-lg hover:shadow-primary/10">
                <CardHeader>
                  <CardTitle className="flex items-center gap-3">
                    <div className="p-3 bg-primary/10 rounded-lg">
                      <FileText className="w-6 h-6 text-primary" />
                    </div>
                    Facture d'achat
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <p className="text-muted-foreground">
                    Document officiel prouvant l'achat de vos produits auprès d'un fournisseur légitime.
                  </p>
                  <div className="flex items-start gap-2 p-3 rounded-lg bg-accent/30">
                    <CheckCircle className="w-5 h-5 text-primary mt-0.5 flex-shrink-0" />
                    <p className="text-sm">Exigée par Amazon pour certaines catégories</p>
                  </div>
                  <div className="flex items-start gap-2 p-3 rounded-lg bg-accent/30">
                    <CheckCircle className="w-5 h-5 text-primary mt-0.5 flex-shrink-0" />
                    <p className="text-sm">Prouve l'authenticité de vos produits</p>
                  </div>
                </CardContent>
              </Card>

              <Card className="border-primary/20 hover:border-primary/40 transition-all duration-300 hover:shadow-lg hover:shadow-primary/10">
                <CardHeader>
                  <CardTitle className="flex items-center gap-3">
                    <div className="p-3 bg-primary/10 rounded-lg">
                      <Shield className="w-6 h-6 text-primary" />
                    </div>
                    Autorisation de marque
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <p className="text-muted-foreground">
                    Lettre officielle du fabricant vous autorisant à vendre ses produits de marque.
                  </p>
                  <div className="flex items-start gap-2 p-3 rounded-lg bg-accent/30">
                    <CheckCircle className="w-5 h-5 text-primary mt-0.5 flex-shrink-0" />
                    <p className="text-sm">Nécessaire pour les marques protégées</p>
                  </div>
                  <div className="flex items-start gap-2 p-3 rounded-lg bg-accent/30">
                    <CheckCircle className="w-5 h-5 text-primary mt-0.5 flex-shrink-0" />
                    <p className="text-sm">Évite les suspensions de compte</p>
                  </div>
                </CardContent>
              </Card>
            </div>

            <Card className="border-primary/20 bg-gradient-to-br from-accent/50 to-transparent">
              <CardHeader>
                <CardTitle className="flex items-center gap-3">
                  <Lock className="w-6 h-6 text-primary" />
                  Pourquoi ces documents sont-ils importants ?
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-start gap-4 p-4 rounded-lg bg-background/60 backdrop-blur-sm border border-primary/10">
                  <AlertCircle className="w-6 h-6 text-primary mt-1 flex-shrink-0" />
                  <div>
                    <p className="font-semibold mb-2">Protection contre les suspensions</p>
                    <p className="text-sm text-muted-foreground">
                      Amazon peut demander ces documents à tout moment. Sans eux, votre compte risque d'être suspendu.
                    </p>
                  </div>
                </div>
                
                <div className="flex items-start gap-4 p-4 rounded-lg bg-background/60 backdrop-blur-sm border border-primary/10">
                  <CheckCircle className="w-6 h-6 text-primary mt-1 flex-shrink-0" />
                  <div>
                    <p className="font-semibold mb-2">Conformité légale</p>
                    <p className="text-sm text-muted-foreground">
                      Ces documents prouvent que vous êtes un vendeur légitime et que vos produits sont authentiques.
                    </p>
                  </div>
                </div>
                
                <div className="flex items-start gap-4 p-4 rounded-lg bg-background/60 backdrop-blur-sm border border-primary/10">
                  <Shield className="w-6 h-6 text-primary mt-1 flex-shrink-0" />
                  <div>
                    <p className="font-semibold mb-2">Crédibilité professionnelle</p>
                    <p className="text-sm text-muted-foreground">
                      Montrez à Amazon que vous êtes un vendeur sérieux et professionnel.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Steps Section */}
          <div ref={stepsRef} className={cn("mb-12", stepsVisible && "animate-fade-in")}>
            <h2 className="text-3xl font-bold mb-6 flex items-center gap-3">
              <Sparkles className="w-8 h-8 text-primary" />
              Comment obtenir vos documents ?
            </h2>
            <div className="space-y-4">
              <Card className="border-primary/20 hover:border-primary/40 transition-colors">
                <CardContent className="pt-6">
                  <div className="flex items-start gap-4">
                    <div className="flex items-center justify-center w-12 h-12 rounded-full bg-primary/20 text-primary font-bold text-xl flex-shrink-0">
                      1
                    </div>
                    <div>
                      <h3 className="text-xl font-bold mb-2">Contactez notre partenaire</h3>
                      <p className="text-muted-foreground">
                        Envoyez un message via notre système de support en précisant les documents dont vous avez besoin.
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
                      <h3 className="text-xl font-bold mb-2">Fournissez les informations</h3>
                      <p className="text-muted-foreground">
                        Donnez les détails sur les produits, marques et quantités que vous souhaitez vendre.
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
                      <h3 className="text-xl font-bold mb-2">Recevez vos documents</h3>
                      <p className="text-muted-foreground">
                        Obtenez vos factures et autorisations officielles sous 24-48h, prêtes pour Amazon.
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>

          {/* CTA Final */}
          <div ref={ctaRef} className={cn("", ctaVisible && "animate-fade-in")}>
            <Card className="bg-gradient-to-r from-primary/20 via-primary/10 to-transparent border-primary/30 overflow-hidden relative">
              <div className="absolute inset-0 bg-gradient-to-r from-primary/5 to-secondary/5 animate-pulse" />
              <CardContent className="pt-10 pb-12 text-center relative">
                <FileText className="w-16 h-16 text-primary mx-auto mb-6" />
                <h3 className="text-3xl font-bold mb-4">
                  Vendez en toute conformité dès aujourd'hui 🚀
                </h3>
                <p className="text-xl text-muted-foreground mb-8">
                  Ne prenez aucun risque avec votre compte Amazon
                </p>
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <Button size="lg" asChild className="text-lg px-8">
                    <Link to="/support">
                      Demander mes documents
                    </Link>
                  </Button>
                  <Button size="lg" variant="outline" asChild className="text-lg px-8">
                    <Link to="/contact">
                      Poser une question
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

export default FactureAutorisation;
