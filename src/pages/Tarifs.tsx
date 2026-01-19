import { Check, Star, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Checkbox } from "@/components/ui/checkbox";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import SEO from "@/components/SEO";
import { Link, useNavigate } from "react-router-dom";
import { Capacitor } from "@capacitor/core";
import { useTrial } from "@/hooks/use-trial";
import { useAuth } from "@/hooks/use-auth";
import { seoData, schemas } from "@/lib/seo-data";
import { useState } from "react";
import PromoCountdown from "@/components/PromoCountdown";

const Tarifs = () => {
  const navigate = useNavigate();
  const { startFreeTrial, isStarting, showCGVModal, setShowCGVModal, acceptedCGV, setAcceptedCGV, handleConfirmPayment } = useTrial();
  const { user } = useAuth();

  return (
    <div className="min-h-screen relative overflow-hidden">
      <SEO
        title={seoData.tarifs.title}
        description={seoData.tarifs.description}
        keywords={seoData.tarifs.keywords}
        schema={schemas.product}
      />
      <Navbar />
      
      {/* SEO H1/H2 - Invisible */}
      <h1 className="sr-only">
        Tarifs et abonnements AMZing FBA pour vendeurs Amazon FBA et FBM
      </h1>
      <h2 className="sr-only">
        Comparaison des offres, abonnements et formules AMZing FBA pour accompagner les vendeurs Amazon
      </h2>
      
      {Capacitor.isNativePlatform() && (
        <div className="fixed top-[46px] left-[18px] z-50">
          <Button
            variant="outline"
            size="icon"
            onClick={() => navigate('/')}
            className="rounded-full shadow-lg bg-background/80 backdrop-blur-sm hover:bg-primary hover:text-white border-2 border-primary/20 hover:border-primary transition-all duration-300 hover:scale-110"
          >
            <ArrowLeft className="h-5 w-5" />
          </Button>
        </div>
      )}
      
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none opacity-20">
        <div className="absolute top-20 left-10 w-64 h-64 bg-primary/30 rounded-full blur-3xl animate-float" style={{ animationDelay: '0s' }}></div>
        <div className="absolute bottom-40 right-20 w-96 h-96 bg-secondary/30 rounded-full blur-3xl animate-float" style={{ animationDelay: '2s' }}></div>
        <div className="absolute top-1/2 left-1/3 w-48 h-48 bg-accent/20 rounded-full blur-3xl animate-float" style={{ animationDelay: '4s' }}></div>
      </div>

      <div className="pt-32 pb-20 relative z-10">
        <div className="container mx-auto px-4">
          {/* Hero */}
          <div className="text-center mb-16">
            <Badge className="mb-4 bg-primary/10 text-primary border-primary/20 animate-fade-in">
              Une seule offre, tout inclus
            </Badge>
            <h1 className="text-5xl md:text-6xl font-bold mb-6 animate-fade-in" style={{ animationDelay: '0.1s' }}>
              Accès VIP AMZing FBA
            </h1>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto animate-fade-in" style={{ animationDelay: '0.2s' }}>
              Tout ce dont tu as besoin pour réussir sur Amazon FBA en un seul abonnement
            </p>
          </div>

          {/* Single Pricing Card */}
          <div className="max-w-2xl mx-auto mb-16 animate-fade-in" style={{ animationDelay: '0.3s' }}>
            <Card className="border-2 border-primary shadow-2xl relative group hover:scale-[1.02] hover:shadow-primary/30 transition-all duration-500">
              <CardHeader className="text-center pb-8 pt-8">
                <CardTitle className="text-4xl mb-4 group-hover:text-primary transition-colors">Espace VIP AMZing FBA</CardTitle>
                <CardDescription className="text-lg">Accès complet à tous les outils et services</CardDescription>
                <div className="mt-8">
                  <div className="flex items-center justify-center gap-2 mb-2">
                    <Badge className="bg-red-500 text-white border-0 animate-pulse">🔥 OFFRE FLASH -200€</Badge>
                  </div>
                  <span className="text-2xl text-muted-foreground line-through">700€</span>
                  <span className="text-5xl font-bold bg-gradient-to-r from-red-500 via-orange-500 to-yellow-500 bg-clip-text text-transparent animate-fade-in ml-2">500€</span>
                  <span className="text-xl text-muted-foreground">/an TTC</span>
                  <p className="text-lg text-muted-foreground mt-2">ou ~64€/mois × 12 mois</p>
                </div>
                <PromoCountdown />
              </CardHeader>
              <CardContent className="px-8">
                <div className="space-y-4 mb-8">
                  <div className="flex items-start gap-3 group/item hover:translate-x-2 transition-transform duration-300 animate-fade-in" style={{ animationDelay: '0.4s' }}>
                    <Check className="w-6 h-6 text-primary flex-shrink-0 mt-1 group-hover/item:scale-110 transition-transform" />
                    <div>
                      <span className="font-semibold text-lg">Moniteurs automatiques</span>
                      <p className="text-muted-foreground text-sm">Robots qui notifient dès qu'un produit rentable est détecté (Qogita, Auchan, King Jouet...)</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3 group/item hover:translate-x-2 transition-transform duration-300 animate-fade-in" style={{ animationDelay: '0.5s' }}>
                    <Check className="w-6 h-6 text-primary flex-shrink-0 mt-1 group-hover/item:scale-110 transition-transform" />
                    <div>
                      <span className="font-semibold text-lg">Guides complets Amazon FBA</span>
                      <p className="text-muted-foreground text-sm">Formation pas à pas de 0 aux premières ventes</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3 group/item hover:translate-x-2 transition-transform duration-300 animate-fade-in" style={{ animationDelay: '0.6s' }}>
                    <Check className="w-6 h-6 text-primary flex-shrink-0 mt-1 group-hover/item:scale-110 transition-transform" />
                    <div>
                      <span className="font-semibold text-lg">Fournisseurs privés</span>
                      <p className="text-muted-foreground text-sm">Listing exclusif de produits sourcés et testés</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3 group/item hover:translate-x-2 transition-transform duration-300 animate-fade-in" style={{ animationDelay: '0.7s' }}>
                    <Check className="w-6 h-6 text-primary flex-shrink-0 mt-1 group-hover/item:scale-110 transition-transform" />
                    <div>
                      <span className="font-semibold text-lg">Analyses de marché</span>
                      <p className="text-muted-foreground text-sm">Tendances et opportunités du marché Amazon</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3 group/item hover:translate-x-2 transition-transform duration-300 animate-fade-in" style={{ animationDelay: '0.8s' }}>
                    <Check className="w-6 h-6 text-primary flex-shrink-0 mt-1 group-hover/item:scale-110 transition-transform" />
                    <div>
                      <span className="font-semibold text-lg">Notifications produits</span>
                      <p className="text-muted-foreground text-sm">Alertes instore et online pour opportunités</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3 group/item hover:translate-x-2 transition-transform duration-300 animate-fade-in" style={{ animationDelay: '0.9s' }}>
                    <Check className="w-6 h-6 text-primary flex-shrink-0 mt-1 group-hover/item:scale-110 transition-transform" />
                    <div>
                      <span className="font-semibold text-lg">Conseils niches privées</span>
                      <p className="text-muted-foreground text-sm">Investissements stratégiques et opportunités exclusives</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3 group/item hover:translate-x-2 transition-transform duration-300 animate-fade-in" style={{ animationDelay: '1s' }}>
                    <Check className="w-6 h-6 text-primary flex-shrink-0 mt-1 group-hover/item:scale-110 transition-transform" />
                    <div>
                      <span className="font-semibold text-lg">Réductions exclusives</span>
                      <p className="text-muted-foreground text-sm">Tarifs préférentiels sur emballages et bordereaux</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3 group/item hover:translate-x-2 transition-transform duration-300 animate-fade-in" style={{ animationDelay: '1.1s' }}>
                    <Check className="w-6 h-6 text-primary flex-shrink-0 mt-1 group-hover/item:scale-110 transition-transform" />
                    <div>
                      <span className="font-semibold text-lg">Service logistique</span>
                      <p className="text-muted-foreground text-sm">Stockage et expédition sous 24h disponibles</p>
                    </div>
                  </div>
                </div>
              </CardContent>
              <CardFooter className="px-8 pb-8">
                <Button 
                  variant="hero" 
                  className="w-full text-lg py-6 hover:scale-105 transition-transform" 
                  size="lg"
                  onClick={startFreeTrial}
                  disabled={isStarting}
                >
                  {isStarting ? 'Chargement...' : 'S\'abonner maintenant'}
                </Button>
              </CardFooter>
            </Card>
          </div>

          {/* Trust Section */}
          <Card className="mb-16 bg-gradient-to-r from-primary/10 via-secondary/10 to-primary/10 border-2 border-primary/20">
            <CardContent className="p-8 text-center">
              <h3 className="text-2xl font-bold mb-2">Accès annuel (12 mois)</h3>
              <p className="text-muted-foreground mb-4">
                Payez à l'année et profitez de l'accès pendant 12 mois complets.
              </p>
              <div className="flex flex-wrap justify-center gap-4">
                <Badge className="bg-primary/20 text-primary border-primary/30">Paiement sécurisé</Badge>
                <Badge className="bg-primary/20 text-primary border-primary/30">Accès 12 mois</Badge>
                <Badge className="bg-primary/20 text-primary border-primary/30">Support réactif</Badge>
              </div>
            </CardContent>
          </Card>

          {/* FAQ Pricing */}
          <div className="max-w-3xl mx-auto">
            <h2 className="text-3xl font-bold text-center mb-8 animate-fade-in">Questions Fréquentes</h2>
            
            <div className="space-y-4">
              <Card className="group hover:shadow-lg hover:shadow-primary/10 hover:scale-[1.02] hover:border-primary/30 transition-all duration-300 animate-fade-in" style={{ animationDelay: '0.1s' }}>
                <CardHeader>
                  <CardTitle className="text-lg group-hover:text-primary transition-colors">Y a-t-il un engagement ?</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground group-hover:translate-x-1 transition-transform duration-300">
                    Oui, l{"'"}abonnement est sur 12 mois. Cela vous permet de bénéficier du meilleur tarif annuel et d{"'"}un accès complet à tous nos services pendant une année entière.
                  </p>
                </CardContent>
              </Card>

              <Card className="group hover:shadow-lg hover:shadow-secondary/10 hover:scale-[1.02] hover:border-secondary/30 transition-all duration-300 animate-fade-in" style={{ animationDelay: '0.2s' }}>
                <CardHeader>
                  <CardTitle className="text-lg group-hover:text-secondary transition-colors">Quels moyens de paiement acceptez-vous ?</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground group-hover:translate-x-1 transition-transform duration-300">
                    Nous acceptons les cartes bancaires (Visa, Mastercard, Amex) via notre plateforme de paiement sécurisée.
                  </p>
                </CardContent>
              </Card>

              <Card className="group hover:shadow-lg hover:shadow-primary/10 hover:scale-[1.02] hover:border-primary/30 transition-all duration-300 animate-fade-in" style={{ animationDelay: '0.3s' }}>
                <CardHeader>
                  <CardTitle className="text-lg group-hover:text-primary transition-colors">Que comprend l{"'"}abonnement ?</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground group-hover:translate-x-1 transition-transform duration-300">
                    L{"'"}abonnement vous donne accès complet à tous les services : formation, catalogue produits, outils et communauté Discord VIP.
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>

          {/* CTA */}
          <Card className="mt-16 bg-gradient-to-r from-primary to-secondary text-white border-none animate-fade-in hover:shadow-2xl hover:shadow-primary/30 transition-all duration-500 animate-gradient-shift group">
            <CardContent className="p-12 text-center relative overflow-hidden">
              {/* Animated floating elements inside the card */}
              <div className="absolute inset-0 overflow-hidden pointer-events-none opacity-20">
                <div className="absolute top-10 left-10 w-32 h-32 bg-white/20 rounded-full blur-2xl animate-float"></div>
                <div className="absolute bottom-10 right-10 w-40 h-40 bg-white/10 rounded-full blur-2xl animate-float" style={{ animationDelay: '2s' }}></div>
              </div>
              
              <div className="relative z-10">
                <h2 className="text-3xl md:text-4xl font-bold mb-4 animate-fade-in group-hover:scale-105 transition-transform">
                  Besoin d{"'"}un Devis Personnalisé ?
                </h2>
                <p className="text-xl mb-8 text-white/90 max-w-2xl mx-auto animate-fade-in" style={{ animationDelay: '0.1s' }}>
                  Contactez-nous pour discuter de vos besoins spécifiques
                </p>
                <Link to="/contact">
                  <Button variant="hero" size="xl" className="hover:scale-105 transition-all duration-300 animate-fade-in" style={{ animationDelay: '0.2s' }}>
                    Nous contacter
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

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
              <p className="text-sm font-semibold mb-2">Abonnement VIP AMZing FBA - Annuel</p>
              <Badge className="bg-red-500 text-white border-0 text-xs mb-2">🔥 OFFRE FLASH -200€</Badge>
              <p className="text-2xl font-bold">
                <span className="line-through text-muted-foreground text-lg mr-2">700€</span>
                <span className="bg-gradient-to-r from-red-500 via-orange-500 to-yellow-500 bg-clip-text text-transparent">500€</span>
                <span className="text-sm font-normal text-muted-foreground">/an TTC</span>
              </p>
              <p className="text-sm text-muted-foreground">ou ~64€/mois × 12 mois</p>
              <p className="text-xs text-muted-foreground mt-2">Accès pendant 12 mois</p>
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

      <Footer />
    </div>
  );
};

export default Tarifs;
