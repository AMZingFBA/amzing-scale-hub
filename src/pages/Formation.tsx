import { CheckCircle2, Clock, Users, TrendingUp, Download } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Link } from "react-router-dom";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

const Formation = () => {
  return (
    <div className="min-h-screen">
      <Navbar />
      
      <div className="pt-32 pb-20">
        <div className="container mx-auto px-4">
          {/* Hero */}
          <div className="text-center mb-16">
            <Badge className="mb-4 bg-primary/10 text-primary border-primary/20">
              Formation complète Amazon FBA
            </Badge>
            <h1 className="text-5xl md:text-6xl font-bold mb-6">
              De 0 aux Premières Ventes
            </h1>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto mb-8">
              Méthode éprouvée pour lancer votre business Amazon FBA. 
              Modules vidéo, templates et accès Discord inclus.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button variant="hero" size="xl">
                Commencer la formation
              </Button>
              <Button variant="outline" size="xl" asChild>
                <Link to="/contact">Poser une question</Link>
              </Button>
            </div>
          </div>

          {/* Key Features */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-20">
            <Card className="relative">
              <CardContent className="pt-6 text-center">
                <Badge className="absolute top-2 right-2 bg-green-500 text-white">Gratuit</Badge>
                <Clock className="w-10 h-10 text-primary mx-auto mb-3" />
                <h3 className="font-bold mb-2">Cours privé</h3>
                <p className="text-sm text-muted-foreground">à la demande sous 24h</p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="pt-6 text-center">
                <Users className="w-10 h-10 text-secondary mx-auto mb-3" />
                <h3 className="font-bold mb-2">500+</h3>
                <p className="text-sm text-muted-foreground">élèves actifs</p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="pt-6 text-center">
                <Download className="w-10 h-10 text-primary mx-auto mb-3" />
                <h3 className="font-bold mb-2">Templates</h3>
                <p className="text-sm text-muted-foreground">Excel & docs</p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="pt-6 text-center">
                <TrendingUp className="w-10 h-10 text-secondary mx-auto mb-3" />
                <h3 className="font-bold mb-2">MAJ</h3>
                <p className="text-sm text-muted-foreground">régulières</p>
              </CardContent>
            </Card>
          </div>

          {/* Modules */}
          <div className="mb-20">
            <h2 className="text-4xl font-bold text-center mb-12">Programme de Formation</h2>
            
            <div className="space-y-6 max-w-4xl mx-auto">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center font-bold text-primary">
                      1
                    </div>
                    Introduction à Amazon FBA
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2">
                    <li className="flex items-start gap-2">
                      <CheckCircle2 className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
                      <span>Comprendre le modèle FBA</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle2 className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
                      <span>Créer son compte vendeur Amazon</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle2 className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
                      <span>Aspects légaux et fiscaux (SASU/EURL)</span>
                    </li>
                  </ul>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center font-bold text-primary">
                      2
                    </div>
                    Recherche de Produits Gagnants
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2">
                    <li className="flex items-start gap-2">
                      <CheckCircle2 className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
                      <span>Méthodologie de recherche produit</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle2 className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
                      <span>Outils d'analyse (Jungle Scout, Helium 10, Seller Amp)</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle2 className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
                      <span>Critères de sélection et calcul ROI</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle2 className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
                      <span>Utilisation de Sellertoolkit</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle2 className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
                      <span>Template Excel inclus</span>
                    </li>
                  </ul>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center font-bold text-primary">
                      3
                    </div>
                    Sourcing & Négociation Fournisseurs
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2">
                    <li className="flex items-start gap-2">
                      <CheckCircle2 className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
                      <span>Trouver des fournisseurs fiables</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle2 className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
                      <span>Techniques de négociation</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle2 className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
                      <span>Échantillons et contrôle qualité</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle2 className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
                      <span>Templates emails et contrats</span>
                    </li>
                  </ul>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center font-bold text-primary">
                      4
                    </div>
                    Création de Listing Optimisé
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2">
                    <li className="flex items-start gap-2">
                      <CheckCircle2 className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
                      <span>Recherche de mots-clés Amazon SEO</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle2 className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
                      <span>Rédaction de titre et bullet points</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle2 className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
                      <span>Images et A+ Content</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle2 className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
                      <span>Checklist listing parfait</span>
                    </li>
                  </ul>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center font-bold text-primary">
                      5
                    </div>
                    Lancement et Premières Ventes
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2">
                    <li className="flex items-start gap-2">
                      <CheckCircle2 className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
                      <span>Stratégies de lancement produit</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle2 className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
                      <span>PPC Amazon Ads (Sponsored Products)</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle2 className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
                      <span>Obtenir vos premiers avis clients</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle2 className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
                      <span>Gérer les commandes et le SAV</span>
                    </li>
                  </ul>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center font-bold text-primary">
                      6
                    </div>
                    Scaling et Optimisation
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2">
                    <li className="flex items-start gap-2">
                      <CheckCircle2 className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
                      <span>Analyse des performances et KPI</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle2 className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
                      <span>Optimisation continue du listing</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle2 className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
                      <span>Expansion catalogue produits</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle2 className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
                      <span>Stratégies de croissance long terme</span>
                    </li>
                  </ul>
                </CardContent>
              </Card>
            </div>
          </div>

          {/* Bonuses */}
          <div className="mb-20">
            <h2 className="text-4xl font-bold text-center mb-12">Bonus Inclus</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
              <Card className="border-2 border-primary">
                <CardContent className="pt-8 text-center">
                  <div className="w-16 h-16 bg-gradient-to-br from-primary to-primary-glow rounded-2xl flex items-center justify-center mx-auto mb-4">
                    <Users className="w-8 h-8 text-white" />
                  </div>
                  <h3 className="font-bold text-xl mb-3">Accès Discord Privé</h3>
                  <p className="text-muted-foreground">
                    Rejoignez la communauté, posez vos questions et recevez des alertes produits
                  </p>
                </CardContent>
              </Card>

              <Card className="border-2 border-secondary">
                <CardContent className="pt-8 text-center">
                  <div className="w-16 h-16 bg-gradient-to-br from-secondary to-accent rounded-2xl flex items-center justify-center mx-auto mb-4">
                    <Download className="w-8 h-8 text-white" />
                  </div>
                  <h3 className="font-bold text-xl mb-3">Templates & Checklists</h3>
                  <p className="text-muted-foreground">
                    Excel, Google Sheets, documents prêts à l'emploi pour gagner du temps
                  </p>
                </CardContent>
              </Card>

              <Card className="border-2 border-primary">
                <CardContent className="pt-8 text-center">
                  <div className="w-16 h-16 bg-gradient-to-br from-primary to-secondary rounded-2xl flex items-center justify-center mx-auto mb-4">
                    <TrendingUp className="w-8 h-8 text-white" />
                  </div>
                  <h3 className="font-bold text-xl mb-3">Mises à Jour Gratuites</h3>
                  <p className="text-muted-foreground">
                    Accès à vie avec tous les nouveaux modules et contenus ajoutés
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>

          {/* CTA */}
          <Card className="bg-gradient-to-r from-primary to-secondary text-white border-none">
            <CardContent className="p-12 text-center">
              <h2 className="text-4xl font-bold mb-4">
                Prêt à Démarrer ?
              </h2>
              <p className="text-xl mb-8 text-white/90 max-w-2xl mx-auto">
                Rejoignez des centaines d'élèves qui ont lancé leur business Amazon grâce à notre formation
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button variant="secondary" size="xl" className="bg-white text-primary hover:bg-white/90">
                  Accéder à la formation
                </Button>
                <Button variant="outline" size="xl" className="border-white text-white hover:bg-white/10">
                  Voir les tarifs
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default Formation;
