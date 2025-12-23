import { useScrollReveal } from '@/hooks/use-scroll-reveal';
import { cn } from '@/lib/utils';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Package, CheckCircle, Sparkles, Truck, Settings, MessageCircle, ArrowLeft } from 'lucide-react';
import { Link } from 'react-router-dom';
import SEO from '@/components/SEO';
import { seoData, schemas } from '@/lib/seo-data';

const GestionProduitsInfo = () => {
  const { ref: heroRef, isVisible: heroVisible } = useScrollReveal({ delay: 0.1 });
  const { ref: servicesRef, isVisible: servicesVisible } = useScrollReveal({ delay: 0.2 });
  const { ref: benefitsRef, isVisible: benefitsVisible } = useScrollReveal({ delay: 0.3 });
  const { ref: ctaRef, isVisible: ctaVisible } = useScrollReveal({ delay: 0.4 });

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-b from-background via-background to-accent/20">
      <SEO 
        title={seoData.gestionProduitsInfo.title}
        description={seoData.gestionProduitsInfo.description}
        keywords={seoData.gestionProduitsInfo.keywords}
        robots={seoData.gestionProduitsInfo.robots}
      />
      <Navbar />
      
      {/* SEO H1/H2 - Invisible */}
      <h1 className="sr-only">
        Gestion des produits et informations pour Amazon FBA
      </h1>
      <h2 className="sr-only">
        Organisation, suivi et gestion des fiches produits pour optimiser son catalogue Amazon
      </h2>
      
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
                    <div className="p-4 bg-primary/20 rounded-2xl animate-[pulse_3s_ease-in-out_infinite]">
                      <Package className="w-12 h-12 text-primary" />
                    </div>
                    <div className="flex-1">
                      <h1 className="text-4xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
                        Gestion complète de vos produits — sans effort
                      </h1>
                      <p className="text-xl text-muted-foreground mb-4">
                        AMZing FBA 360 : Votre partenaire logistique intégral pour Amazon
                      </p>
                      <div className="bg-background/80 backdrop-blur-sm rounded-lg p-6 border border-primary/20">
                        <p className="text-2xl font-semibold text-center">
                          Vous vendez, nous faisons le reste. 🚀
                        </p>
                      </div>
                    </div>
                  </div>
                  
                  <div className="mt-6 p-6 rounded-xl bg-gradient-to-r from-accent/50 to-transparent border border-border">
                    <p className="text-lg leading-relaxed">
                      Avec AMZing FBA 360, nous prenons en charge <strong>100 % du processus logistique</strong> pour les vendeurs professionnels Amazon. Confiez-nous la logistique : nous stockons, préparons, expédions et gérons le SAV de vos produits.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Services Grid */}
          <div ref={servicesRef} className={cn("mb-12", servicesVisible && "animate-fade-in")}>
            <h2 className="text-3xl font-bold mb-6 flex items-center gap-3">
              <Sparkles className="w-8 h-8 text-primary" />
              Nos Services
            </h2>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              <Card className="border-primary/20 hover:border-primary/40 transition-all duration-300 hover:shadow-lg hover:shadow-primary/10 hover:scale-105">
                <CardHeader className="pb-3">
                  <CardTitle className="text-lg flex items-center gap-3">
                    <div className="p-3 bg-primary/10 rounded-lg">
                      <Package className="w-6 h-6 text-primary" />
                    </div>
                    Entrepôt sécurisé
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">
                    Stockage sécurisé de vos produits dans nos locaux avec gestion complète de l'inventaire en temps réel.
                  </p>
                </CardContent>
              </Card>

              <Card className="border-primary/20 hover:border-primary/40 transition-all duration-300 hover:shadow-lg hover:shadow-primary/10 hover:scale-105">
                <CardHeader className="pb-3">
                  <CardTitle className="text-lg flex items-center gap-3">
                    <div className="p-3 bg-primary/10 rounded-lg">
                      <CheckCircle className="w-6 h-6 text-primary" />
                    </div>
                    Emballage conforme Amazon
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">
                    Préparation et emballage conformes aux normes Amazon FBA pour garantir l'acceptation de vos envois.
                  </p>
                </CardContent>
              </Card>

              <Card className="border-primary/20 hover:border-primary/40 transition-all duration-300 hover:shadow-lg hover:shadow-primary/10 hover:scale-105">
                <CardHeader className="pb-3">
                  <CardTitle className="text-lg flex items-center gap-3">
                    <div className="p-3 bg-primary/10 rounded-lg">
                      <Truck className="w-6 h-6 text-primary" />
                    </div>
                    Expédition Amazon FBA
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">
                    Envoi direct de vos produits vers les centres de distribution Amazon avec suivi complet.
                  </p>
                </CardContent>
              </Card>

              <Card className="border-primary/20 hover:border-primary/40 transition-all duration-300 hover:shadow-lg hover:shadow-primary/10 hover:scale-105">
                <CardHeader className="pb-3">
                  <CardTitle className="text-lg flex items-center gap-3">
                    <div className="p-3 bg-primary/10 rounded-lg">
                      <Settings className="w-6 h-6 text-primary" />
                    </div>
                    Gestion des retours
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">
                    Traitement professionnel de vos retours clients avec reconditionnement si nécessaire.
                  </p>
                </CardContent>
              </Card>

              <Card className="border-primary/20 hover:border-primary/40 transition-all duration-300 hover:shadow-lg hover:shadow-primary/10 hover:scale-105">
                <CardHeader className="pb-3">
                  <CardTitle className="text-lg flex items-center gap-3">
                    <div className="p-3 bg-primary/10 rounded-lg">
                      <MessageCircle className="w-6 h-6 text-primary" />
                    </div>
                    Support dédié
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">
                    Équipe dédiée disponible pour répondre à toutes vos questions et besoins logistiques.
                  </p>
                </CardContent>
              </Card>

              <Card className="border-primary/20 hover:border-primary/40 transition-all duration-300 hover:shadow-lg hover:shadow-primary/10 hover:scale-105">
                <CardHeader className="pb-3">
                  <CardTitle className="text-lg flex items-center gap-3">
                    <div className="p-3 bg-primary/10 rounded-lg">
                      <Sparkles className="w-6 h-6 text-primary" />
                    </div>
                    Étiquetage personnalisé
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">
                    Étiquetage FNSKU et préparation selon vos besoins spécifiques Amazon.
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>

          {/* Benefits Section */}
          <div ref={benefitsRef} className={cn("mb-12", benefitsVisible && "animate-fade-in")}>
            <Card className="border-primary/20 bg-gradient-to-br from-accent/50 to-transparent">
              <CardHeader>
                <CardTitle className="text-2xl flex items-center gap-3">
                  <CheckCircle className="w-8 h-8 text-primary" />
                  Pourquoi choisir AMZing FBA 360 ?
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-start gap-4 p-4 rounded-lg bg-background/60 backdrop-blur-sm border border-primary/10 hover:border-primary/30 transition-colors">
                    <CheckCircle className="w-6 h-6 text-primary mt-1 flex-shrink-0" />
                    <div>
                      <p className="text-lg">
                        <strong>Infrastructure complète :</strong> Nous agissons comme votre grossiste, entrepôt et partenaire logistique tout-en-un.
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex items-start gap-4 p-4 rounded-lg bg-background/60 backdrop-blur-sm border border-primary/10 hover:border-primary/30 transition-colors">
                    <CheckCircle className="w-6 h-6 text-primary mt-1 flex-shrink-0" />
                    <div>
                      <p className="text-lg">
                        <strong>Solution clé en main :</strong> De la réception de vos produits à la livraison finale, nous gérons l'intégralité de la chaîne.
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex items-start gap-4 p-4 rounded-lg bg-background/60 backdrop-blur-sm border border-primary/10 hover:border-primary/30 transition-colors">
                    <CheckCircle className="w-6 h-6 text-primary mt-1 flex-shrink-0" />
                    <div>
                      <p className="text-lg">
                        <strong>Gain de temps maximal :</strong> Concentrez-vous uniquement sur le développement de vos ventes et votre stratégie commerciale.
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex items-start gap-4 p-4 rounded-lg bg-background/60 backdrop-blur-sm border border-primary/10 hover:border-primary/30 transition-colors">
                    <CheckCircle className="w-6 h-6 text-primary mt-1 flex-shrink-0" />
                    <div>
                      <p className="text-lg">
                        <strong>Conformité garantie :</strong> Respect strict des normes et exigences Amazon pour éviter tout refus d'envoi.
                      </p>
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
                <Sparkles className="w-16 h-16 text-primary mx-auto mb-6 animate-[spin_3s_linear_infinite]" />
                <h3 className="text-3xl font-bold mb-4">
                  Vous n'avez plus qu'à vendre — on s'occupe de tout le reste. ✨
                </h3>
                <p className="text-xl text-muted-foreground mb-8">
                  Solution logistique clé en main pour vendeurs Amazon professionnels
                </p>
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <Button size="lg" asChild className="text-lg px-8">
                    <Link to="/support">
                      Demander un devis
                    </Link>
                  </Button>
                  <Button size="lg" variant="outline" asChild className="text-lg px-8">
                    <Link to="/contact">
                      Nous contacter
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

export default GestionProduitsInfo;
