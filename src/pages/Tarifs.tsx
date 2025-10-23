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
              Tarifs transparents
            </Badge>
            <h1 className="text-5xl md:text-6xl font-bold mb-6">
              Choisissez Votre Pack
            </h1>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              Des offres adaptées à votre niveau, de débutant à entrepreneur confirmé
            </p>
          </div>

          {/* Pricing Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto mb-16">
            {/* Starter */}
            <Card className="border-2">
              <CardHeader>
                <CardTitle className="text-2xl">Starter</CardTitle>
                <CardDescription>Pour tester le marché</CardDescription>
                <div className="mt-4">
                  <span className="text-4xl font-bold">97€</span>
                  <span className="text-muted-foreground">/mois</span>
                </div>
              </CardHeader>
              <CardContent>
                <ul className="space-y-3">
                  <li className="flex items-start gap-2">
                    <Check className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
                    <span>Accès formation complète</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <Check className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
                    <span>Discord privé</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <Check className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
                    <span>Accès catalogue produits</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <Check className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
                    <span>Templates & checklists</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <Check className="w-5 h-5 text-muted-foreground flex-shrink-0 mt-0.5" />
                    <span className="text-muted-foreground">Stockage (50 colis/mois)</span>
                  </li>
                </ul>
              </CardContent>
              <CardFooter>
                <Button variant="outline" className="w-full" size="lg">
                  Choisir Starter
                </Button>
              </CardFooter>
            </Card>

            {/* Business - Most Popular */}
            <Card className="border-2 border-primary shadow-xl relative">
              <div className="absolute -top-4 left-1/2 -translate-x-1/2">
                <Badge className="bg-gradient-to-r from-primary to-secondary text-white px-4 py-1">
                  <Star className="w-4 h-4 inline mr-1" />
                  Plus populaire
                </Badge>
              </div>
              <CardHeader>
                <CardTitle className="text-2xl">Business</CardTitle>
                <CardDescription>Pour scaler votre activité</CardDescription>
                <div className="mt-4">
                  <span className="text-4xl font-bold">297€</span>
                  <span className="text-muted-foreground">/mois</span>
                </div>
              </CardHeader>
              <CardContent>
                <ul className="space-y-3">
                  <li className="flex items-start gap-2">
                    <Check className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
                    <span className="font-semibold">Tout du pack Starter</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <Check className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
                    <span>Stockage illimité</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <Check className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
                    <span>Préparation FBA incluse</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <Check className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
                    <span>Support prioritaire</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <Check className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
                    <span>Alertes produits avancées</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <Check className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
                    <span>1 session coaching/mois</span>
                  </li>
                </ul>
              </CardContent>
              <CardFooter>
                <Button variant="hero" className="w-full" size="lg">
                  Choisir Business
                </Button>
              </CardFooter>
            </Card>

            {/* Premium */}
            <Card className="border-2 border-secondary">
              <CardHeader>
                <CardTitle className="text-2xl">Premium</CardTitle>
                <CardDescription>Accompagnement personnalisé</CardDescription>
                <div className="mt-4">
                  <span className="text-4xl font-bold">697€</span>
                  <span className="text-muted-foreground">/mois</span>
                </div>
              </CardHeader>
              <CardContent>
                <ul className="space-y-3">
                  <li className="flex items-start gap-2">
                    <Check className="w-5 h-5 text-secondary flex-shrink-0 mt-0.5" />
                    <span className="font-semibold">Tout du pack Business</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <Check className="w-5 h-5 text-secondary flex-shrink-0 mt-0.5" />
                    <span>Manager dédié</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <Check className="w-5 h-5 text-secondary flex-shrink-0 mt-0.5" />
                    <span>Coaching illimité</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <Check className="w-5 h-5 text-secondary flex-shrink-0 mt-0.5" />
                    <span>Audit compte mensuel</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <Check className="w-5 h-5 text-secondary flex-shrink-0 mt-0.5" />
                    <span>Stratégie personnalisée</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <Check className="w-5 h-5 text-secondary flex-shrink-0 mt-0.5" />
                    <span>Accès anticipé nouveautés</span>
                  </li>
                </ul>
              </CardContent>
              <CardFooter>
                <Button variant="secondary" className="w-full" size="lg">
                  Choisir Premium
                </Button>
              </CardFooter>
            </Card>
          </div>

          {/* Annual Discount */}
          <Card className="mb-16 bg-gradient-to-r from-primary/10 via-secondary/10 to-primary/10 border-2 border-primary/20">
            <CardContent className="p-8 text-center">
              <h3 className="text-2xl font-bold mb-2">Économisez avec l'abonnement annuel</h3>
              <p className="text-muted-foreground mb-4">
                Payez 10 mois, profitez de 12 mois - soit 2 mois offerts sur tous les packs
              </p>
              <Badge className="bg-primary text-white">-17% sur l'année</Badge>
            </CardContent>
          </Card>

          {/* Fulfilment Pricing */}
          <div className="mb-16">
            <h2 className="text-4xl font-bold text-center mb-8">Tarifs Stockage & Fulfilment</h2>
            <p className="text-center text-muted-foreground mb-12 max-w-2xl mx-auto">
              Tarification transparente pour nos services de logistique
            </p>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
              <Card>
                <CardHeader>
                  <CardTitle>Stockage</CardTitle>
                  <CardDescription>Par palette et par mois</CardDescription>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-3">
                    <li className="flex justify-between items-center">
                      <span>Première palette</span>
                      <span className="font-bold">80€/mois</span>
                    </li>
                    <li className="flex justify-between items-center">
                      <span>Palettes supplémentaires</span>
                      <span className="font-bold">60€/mois</span>
                    </li>
                    <li className="flex justify-between items-center">
                      <span>Stockage petit colis</span>
                      <span className="font-bold">2€/colis/mois</span>
                    </li>
                  </ul>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Préparation & Expédition</CardTitle>
                  <CardDescription>À l'unité</CardDescription>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-3">
                    <li className="flex justify-between items-center">
                      <span>Préparation colis standard</span>
                      <span className="font-bold">1.50€</span>
                    </li>
                    <li className="flex justify-between items-center">
                      <span>Préparation FBA</span>
                      <span className="font-bold">2€</span>
                    </li>
                    <li className="flex justify-between items-center">
                      <span>Expédition nationale</span>
                      <span className="font-bold">À partir de 5€</span>
                    </li>
                  </ul>
                </CardContent>
              </Card>
            </div>
          </div>

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
