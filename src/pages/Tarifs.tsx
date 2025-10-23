import { Check, Star } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

const Tarifs = () => {
  return (
    <div className="min-h-screen">
      <Navbar />
      
      <div className="pt-32 pb-20">
        <div className="container mx-auto px-4">
          {/* Hero */}
          <div className="text-center mb-16">
            <Badge className="mb-4 bg-primary/10 text-primary border-primary/20">
              Une seule offre, tout inclus
            </Badge>
            <h1 className="text-5xl md:text-6xl font-bold mb-6">
              Accès Discord VIP
            </h1>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              Tout ce dont tu as besoin pour réussir sur Amazon FBA en un seul abonnement
            </p>
          </div>

          {/* Single Pricing Card */}
          <div className="max-w-2xl mx-auto mb-16">
            <Card className="border-2 border-primary shadow-2xl relative">
              <div className="absolute -top-4 left-1/2 -translate-x-1/2">
                <Badge className="bg-gradient-to-r from-primary to-secondary text-white px-6 py-2 text-lg">
                  <Star className="w-5 h-5 inline mr-2" />
                  15 jours gratuits
                </Badge>
              </div>
              <CardHeader className="text-center pb-8 pt-12">
                <CardTitle className="text-4xl mb-4">Discord VIP AMZing FBA</CardTitle>
                <CardDescription className="text-lg">Accès complet à tous les outils et services</CardDescription>
                <div className="mt-8">
                  <span className="text-6xl font-bold text-gradient">34,99€</span>
                  <span className="text-2xl text-muted-foreground">/mois HT</span>
                </div>
              </CardHeader>
              <CardContent className="px-8">
                <div className="space-y-4 mb-8">
                  <div className="flex items-start gap-3">
                    <Check className="w-6 h-6 text-primary flex-shrink-0 mt-1" />
                    <div>
                      <span className="font-semibold text-lg">Moniteurs automatiques</span>
                      <p className="text-muted-foreground text-sm">Robots qui notifient dès qu'un produit rentable est détecté (Qogita, Auchan, King Jouet...)</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <Check className="w-6 h-6 text-primary flex-shrink-0 mt-1" />
                    <div>
                      <span className="font-semibold text-lg">Guides complets Amazon FBA</span>
                      <p className="text-muted-foreground text-sm">Formation pas à pas de 0 aux premières ventes</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <Check className="w-6 h-6 text-primary flex-shrink-0 mt-1" />
                    <div>
                      <span className="font-semibold text-lg">Fournisseurs privés</span>
                      <p className="text-muted-foreground text-sm">Listing exclusif de produits sourcés et testés</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <Check className="w-6 h-6 text-primary flex-shrink-0 mt-1" />
                    <div>
                      <span className="font-semibold text-lg">Stock Checker</span>
                      <p className="text-muted-foreground text-sm">Vérifie le stock en magasin en temps réel</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <Check className="w-6 h-6 text-primary flex-shrink-0 mt-1" />
                    <div>
                      <span className="font-semibold text-lg">Notifications produits</span>
                      <p className="text-muted-foreground text-sm">Alertes instore et online pour opportunités</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <Check className="w-6 h-6 text-primary flex-shrink-0 mt-1" />
                    <div>
                      <span className="font-semibold text-lg">Conseils niches privées</span>
                      <p className="text-muted-foreground text-sm">Investissements stratégiques et opportunités exclusives</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <Check className="w-6 h-6 text-primary flex-shrink-0 mt-1" />
                    <div>
                      <span className="font-semibold text-lg">Réductions exclusives</span>
                      <p className="text-muted-foreground text-sm">Tarifs préférentiels sur emballages et bordereaux</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <Check className="w-6 h-6 text-primary flex-shrink-0 mt-1" />
                    <div>
                      <span className="font-semibold text-lg">Service logistique</span>
                      <p className="text-muted-foreground text-sm">Stockage et expédition sous 24h disponibles</p>
                    </div>
                  </div>
                </div>
              </CardContent>
              <CardFooter className="px-8 pb-8">
                <Button variant="hero" className="w-full text-lg py-6" size="lg">
                  Commencer l'essai gratuit (15 jours)
                </Button>
              </CardFooter>
            </Card>
          </div>

          {/* Trust Section */}
          <Card className="mb-16 bg-gradient-to-r from-primary/10 via-secondary/10 to-primary/10 border-2 border-primary/20">
            <CardContent className="p-8 text-center">
              <h3 className="text-2xl font-bold mb-2">Sans engagement</h3>
              <p className="text-muted-foreground mb-4">
                Teste pendant 15 jours gratuitement. Annule à tout moment sans frais.
              </p>
              <div className="flex flex-wrap justify-center gap-4">
                <Badge className="bg-primary/20 text-primary border-primary/30">Paiement sécurisé</Badge>
                <Badge className="bg-primary/20 text-primary border-primary/30">Sans engagement</Badge>
                <Badge className="bg-primary/20 text-primary border-primary/30">Support réactif</Badge>
              </div>
            </CardContent>
          </Card>

          {/* FAQ Pricing */}
          <div className="max-w-3xl mx-auto">
            <h2 className="text-3xl font-bold text-center mb-8">Questions Fréquentes</h2>
            
            <div className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Puis-je changer de pack ?</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">
                    Oui, vous pouvez upgrader ou downgrader votre pack à tout moment. 
                    Les changements prennent effet au prochain cycle de facturation.
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Y a-t-il un engagement ?</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">
                    Aucun engagement. Vous pouvez annuler votre abonnement à tout moment. 
                    Les abonnements annuels bénéficient d'une réduction mais sont non remboursables.
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Quels moyens de paiement acceptez-vous ?</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">
                    Nous acceptons les cartes bancaires (Visa, Mastercard, Amex) et les virements bancaires 
                    pour les abonnements annuels.
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>

          {/* CTA */}
          <Card className="mt-16 bg-gradient-to-r from-primary to-secondary text-white border-none">
            <CardContent className="p-12 text-center">
              <h2 className="text-3xl md:text-4xl font-bold mb-4">
                Besoin d'un Devis Personnalisé ?
              </h2>
              <p className="text-xl mb-8 text-white/90 max-w-2xl mx-auto">
                Contactez-nous pour discuter de vos besoins spécifiques
              </p>
              <Button variant="secondary" size="xl" className="bg-white text-primary hover:bg-white/90">
                Nous contacter
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default Tarifs;
