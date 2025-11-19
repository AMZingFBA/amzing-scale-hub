import { useScrollReveal } from '@/hooks/use-scroll-reveal';
import { cn } from '@/lib/utils';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Star, CheckCircle, Sparkles, ArrowLeft, MessageSquare, TrendingUp, Award } from 'lucide-react';
import { Link } from 'react-router-dom';

const AvisPage = () => {
  const heroReveal = useScrollReveal({ animation: "fade-up", delay: 0 });
  const benefitsReveal = useScrollReveal({ animation: "scale", delay: 100 });
  const strategiesReveal = useScrollReveal({ animation: "fade-up", delay: 200 });
  const ctaReveal = useScrollReveal({ animation: "scale", delay: 300 });

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
                      <Star className="w-12 h-12 text-primary" />
                    </div>
                    <div className="flex-1">
                      <h1 className="text-4xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
                        ⭐ Booster tes avis clients Amazon
                      </h1>
                      <p className="text-xl text-muted-foreground mb-4">
                        Obtiens plus d'avis positifs et améliore ta réputation sur Amazon
                      </p>
                      <div className="bg-background/80 backdrop-blur-sm rounded-lg p-6 border border-primary/20">
                        <p className="text-2xl font-semibold text-center">
                          Les avis clients = clé du succès sur Amazon 🚀
                        </p>
                      </div>
                    </div>
                  </div>
                  
                  <div className="mt-6 p-6 rounded-xl bg-gradient-to-r from-accent/50 to-transparent border border-border">
                    <p className="text-lg leading-relaxed">
                      Sur Amazon, les avis clients jouent un rôle <strong>crucial</strong> dans les décisions d'achat. Plus tu as d'avis positifs, plus tu vends. C'est aussi simple que ça.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Benefits Section */}
          <div ref={benefitsRef} className={cn("mb-12", benefitsVisible && "animate-fade-in")}>
            <h2 className="text-3xl font-bold mb-6 flex items-center gap-3">
              <Sparkles className="w-8 h-8 text-primary" />
              Pourquoi les avis sont-ils si importants ?
            </h2>
            <div className="grid md:grid-cols-3 gap-6">
              <Card className="border-primary/20 hover:border-primary/40 transition-all duration-300 hover:shadow-lg hover:shadow-primary/10 hover:scale-105">
                <CardHeader>
                  <CardTitle className="flex items-center gap-3">
                    <div className="p-3 bg-primary/10 rounded-lg">
                      <TrendingUp className="w-6 h-6 text-primary" />
                    </div>
                    Augmente tes ventes
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">
                    Les produits avec beaucoup d'avis positifs se vendent jusqu'à <strong>270% de plus</strong> que ceux sans avis.
                  </p>
                </CardContent>
              </Card>

              <Card className="border-primary/20 hover:border-primary/40 transition-all duration-300 hover:shadow-lg hover:shadow-primary/10 hover:scale-105">
                <CardHeader>
                  <CardTitle className="flex items-center gap-3">
                    <div className="p-3 bg-primary/10 rounded-lg">
                      <Award className="w-6 h-6 text-primary" />
                    </div>
                    Améliore ton ranking
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">
                    Amazon privilégie les produits bien notés dans ses résultats de recherche et recommandations.
                  </p>
                </CardContent>
              </Card>

              <Card className="border-primary/20 hover:border-primary/40 transition-all duration-300 hover:shadow-lg hover:shadow-primary/10 hover:scale-105">
                <CardHeader>
                  <CardTitle className="flex items-center gap-3">
                    <div className="p-3 bg-primary/10 rounded-lg">
                      <MessageSquare className="w-6 h-6 text-primary" />
                    </div>
                    Inspire confiance
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">
                    Les clients font confiance aux avis d'autres acheteurs. C'est la preuve sociale la plus puissante.
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>

          {/* How it works */}
          <div ref={howItWorksRef} className={cn("mb-12", howItWorksVisible && "animate-fade-in")}>
            <h2 className="text-3xl font-bold mb-6 flex items-center gap-3">
              <CheckCircle className="w-8 h-8 text-primary" />
              Comment obtenir plus d'avis conformes ?
            </h2>
            <div className="space-y-4">
              <Card className="border-primary/20 hover:border-primary/40 transition-colors">
                <CardContent className="pt-6">
                  <div className="flex items-start gap-4">
                    <div className="flex items-center justify-center w-12 h-12 rounded-full bg-primary/20 text-primary font-bold text-xl flex-shrink-0">
                      1
                    </div>
                    <div>
                      <h3 className="text-xl font-bold mb-2">📧 Utilise le programme Amazon Vine</h3>
                      <p className="text-muted-foreground">
                        Programme officiel d'Amazon qui permet aux "Vine Voices" (reviewers vérifiés) de tester tes produits gratuitement en échange d'avis honnêtes.
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
                      <h3 className="text-xl font-bold mb-2">✉️ Demande des avis via le système Amazon</h3>
                      <p className="text-muted-foreground">
                        Utilise la fonctionnalité "Demander un avis" dans Seller Central pour solliciter des avis de manière conforme aux règles Amazon.
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
                      <h3 className="text-xl font-bold mb-2">📦 Offre une expérience client exceptionnelle</h3>
                      <p className="text-muted-foreground">
                        Qualité produit irréprochable, livraison rapide, emballage soigné et service client réactif = avis 5 étoiles naturels.
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="border-primary/20 hover:border-primary/40 transition-colors">
                <CardContent className="pt-6">
                  <div className="flex items-start gap-4">
                    <div className="flex items-center justify-center w-12 h-12 rounded-full bg-primary/20 text-primary font-bold text-xl flex-shrink-0">
                      4
                    </div>
                    <div>
                      <h3 className="text-xl font-bold mb-2">🎁 Inclus des inserts dans tes colis</h3>
                      <p className="text-muted-foreground">
                        Petite carte de remerciement avec ton contact SAV (sans solliciter directement des avis, ce qui est interdit).
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>

          {/* Warning Section */}
          <div className="mb-12">
            <Card className="border-destructive/30 bg-destructive/5">
              <CardHeader>
                <CardTitle className="text-xl flex items-center gap-3">
                  <Star className="w-6 h-6 text-destructive" />
                  ⚠️ Important : Respecte les règles Amazon
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="p-4 rounded-lg bg-background/60 border border-destructive/20">
                  <p className="font-semibold mb-2">❌ Interdit par Amazon :</p>
                  <ul className="space-y-2 text-sm text-muted-foreground">
                    <li>• Acheter des avis (risque de bannissement définitif)</li>
                    <li>• Offrir des cadeaux/réductions en échange d'avis positifs</li>
                    <li>• Demander uniquement des avis 5 étoiles</li>
                    <li>• Manipuler le système d'avis de quelque manière que ce soit</li>
                  </ul>
                </div>
                
                <div className="p-4 rounded-lg bg-background/60 border border-primary/20">
                  <p className="font-semibold mb-2">✅ Autorisé et recommandé :</p>
                  <ul className="space-y-2 text-sm text-muted-foreground">
                    <li>• Utiliser le bouton "Demander un avis" d'Amazon</li>
                    <li>• Participer au programme Amazon Vine</li>
                    <li>• Offrir un excellent service client</li>
                    <li>• Répondre professionnellement aux avis négatifs</li>
                  </ul>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* CTA Final */}
          <div ref={ctaRef} className={cn("", ctaVisible && "animate-fade-in")}>
            <Card className="bg-gradient-to-r from-primary/20 via-primary/10 to-transparent border-primary/30 overflow-hidden relative">
              <div className="absolute inset-0 bg-gradient-to-r from-primary/5 to-secondary/5 animate-pulse" />
              <CardContent className="pt-10 pb-12 text-center relative">
                <Star className="w-16 h-16 text-primary mx-auto mb-6" />
                <h3 className="text-3xl font-bold mb-4">
                  Besoin d'aide pour gérer tes avis ? 💬
                </h3>
                <p className="text-xl text-muted-foreground mb-8">
                  Notre équipe peut t'accompagner dans ta stratégie d'avis conformes
                </p>
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <Button size="lg" asChild className="text-lg px-8">
                    <Link to="/support">
                      Demander conseil
                    </Link>
                  </Button>
                  <Button size="lg" variant="outline" asChild className="text-lg px-8">
                    <Link to="/avis">
                      Voir tous les avis AMZing
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

export default AvisPage;
