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
      
      <div className="pt-32 pb-20 relative overflow-hidden">
        {/* Animated background elements */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none opacity-20">
          <div className="absolute top-20 left-10 w-64 h-64 bg-primary/30 rounded-full blur-3xl animate-float" style={{ animationDelay: '0s' }}></div>
          <div className="absolute bottom-40 right-20 w-96 h-96 bg-secondary/30 rounded-full blur-3xl animate-float" style={{ animationDelay: '2s' }}></div>
          <div className="absolute top-1/2 left-1/3 w-48 h-48 bg-accent/20 rounded-full blur-3xl animate-float" style={{ animationDelay: '4s' }}></div>
        </div>

        <div className="container mx-auto px-4 relative z-10">
          {/* Hero */}
          <div className="text-center mb-16 animate-fade-in">
            <Badge className="mb-4 bg-primary/10 text-primary border-primary/20 animate-fade-in" style={{ animationDelay: '0.1s' }}>
              Formation complète Amazon FBA
            </Badge>
            <h1 className="text-5xl md:text-6xl font-bold mb-6 animate-fade-in" style={{ animationDelay: '0.2s' }}>
              De 0 aux Premières Ventes
            </h1>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto mb-8 animate-fade-in" style={{ animationDelay: '0.3s' }}>
              Méthode éprouvée pour lancer votre business Amazon FBA. 
              Modules vidéo, templates et accès plateforme inclus.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center animate-fade-in" style={{ animationDelay: '0.4s' }}>
              <Button variant="hero" size="xl" asChild className="hover:scale-105 transition-transform duration-300">
                <Link to="/tarifs">Commencer la formation</Link>
              </Button>
              <Button variant="outline" size="xl" asChild className="hover:scale-105 transition-transform duration-300">
                <Link to="/contact">Poser une question</Link>
              </Button>
            </div>
          </div>

          {/* Key Features */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-20">
            <Card className="relative group hover:scale-105 hover:shadow-xl transition-all duration-300 animate-fade-in hover:shadow-primary/20" style={{ animationDelay: '0.5s' }}>
              <CardContent className="pt-6 text-center">
                <Badge className="absolute top-2 right-2 bg-green-500 text-white">Gratuit</Badge>
                <Clock className="w-10 h-10 text-primary mx-auto mb-3 group-hover:scale-110 transition-transform" />
                <h3 className="font-bold mb-2">Cours privé</h3>
                <p className="text-sm text-muted-foreground">à la demande sous 24h</p>
              </CardContent>
            </Card>
            <Card className="group hover:scale-105 hover:shadow-xl transition-all duration-300 animate-fade-in hover:shadow-secondary/20" style={{ animationDelay: '0.6s' }}>
              <CardContent className="pt-6 text-center">
                <Users className="w-10 h-10 text-secondary mx-auto mb-3 group-hover:scale-110 transition-transform" />
                <h3 className="font-bold mb-2">500+</h3>
                <p className="text-sm text-muted-foreground">élèves actifs</p>
              </CardContent>
            </Card>
            <Card className="group hover:scale-105 hover:shadow-xl transition-all duration-300 animate-fade-in hover:shadow-primary/20" style={{ animationDelay: '0.7s' }}>
              <CardContent className="pt-6 text-center">
                <Download className="w-10 h-10 text-primary mx-auto mb-3 group-hover:scale-110 transition-transform" />
                <h3 className="font-bold mb-2">Templates</h3>
                <p className="text-sm text-muted-foreground">Excel & docs</p>
              </CardContent>
            </Card>
            <Card className="group hover:scale-105 hover:shadow-xl transition-all duration-300 animate-fade-in hover:shadow-secondary/20" style={{ animationDelay: '0.8s' }}>
              <CardContent className="pt-6 text-center">
                <TrendingUp className="w-10 h-10 text-secondary mx-auto mb-3 group-hover:scale-110 transition-transform" />
                <h3 className="font-bold mb-2">MAJ</h3>
                <p className="text-sm text-muted-foreground">régulières</p>
              </CardContent>
            </Card>
          </div>

          {/* Modules */}
          <div className="mb-20">
            <h2 className="text-4xl font-bold text-center mb-12 animate-fade-in">Programme de Formation</h2>
            
            <div className="space-y-6 max-w-4xl mx-auto">
              <Card className="group hover:shadow-xl hover:scale-[1.02] transition-all duration-300 animate-fade-in" style={{ animationDelay: '0.1s' }}>
                <CardHeader>
                  <CardTitle className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center font-bold text-primary group-hover:scale-110 group-hover:bg-primary group-hover:text-white transition-all">
                      1
                    </div>
                    Introduction à Amazon FBA
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2">
                    <li className="flex items-start gap-2 group/item hover:translate-x-2 transition-transform">
                      <CheckCircle2 className="w-5 h-5 text-primary flex-shrink-0 mt-0.5 group-hover/item:scale-110 transition-transform" />
                      <span>Comprendre le modèle FBA</span>
                    </li>
                    <li className="flex items-start gap-2 group/item hover:translate-x-2 transition-transform">
                      <CheckCircle2 className="w-5 h-5 text-primary flex-shrink-0 mt-0.5 group-hover/item:scale-110 transition-transform" />
                      <span>Créer son compte vendeur Amazon</span>
                    </li>
                    <li className="flex items-start gap-2 group/item hover:translate-x-2 transition-transform">
                      <CheckCircle2 className="w-5 h-5 text-primary flex-shrink-0 mt-0.5 group-hover/item:scale-110 transition-transform" />
                      <span>Aspects légaux et fiscaux (SASU/EURL)</span>
                    </li>
                  </ul>
                </CardContent>
              </Card>

              <Card className="group hover:shadow-xl hover:scale-[1.02] transition-all duration-300 animate-fade-in" style={{ animationDelay: '0.2s' }}>
                <CardHeader>
                  <CardTitle className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center font-bold text-primary group-hover:scale-110 group-hover:bg-primary group-hover:text-white transition-all">
                      2
                    </div>
                    Recherche de Produits Gagnants
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2">
                    <li className="flex items-start gap-2 group/item hover:translate-x-2 transition-transform">
                      <CheckCircle2 className="w-5 h-5 text-primary flex-shrink-0 mt-0.5 group-hover/item:scale-110 transition-transform" />
                      <span>Méthodologie de recherche produit</span>
                    </li>
                    <li className="flex items-start gap-2 group/item hover:translate-x-2 transition-transform">
                      <CheckCircle2 className="w-5 h-5 text-primary flex-shrink-0 mt-0.5 group-hover/item:scale-110 transition-transform" />
                      <span>Outils d'analyse (Jungle Scout, Helium 10, Seller Amp)</span>
                    </li>
                    <li className="flex items-start gap-2 group/item hover:translate-x-2 transition-transform">
                      <CheckCircle2 className="w-5 h-5 text-primary flex-shrink-0 mt-0.5 group-hover/item:scale-110 transition-transform" />
                      <span>Critères de sélection et calcul ROI</span>
                    </li>
                    <li className="flex items-start gap-2 group/item hover:translate-x-2 transition-transform">
                      <CheckCircle2 className="w-5 h-5 text-primary flex-shrink-0 mt-0.5 group-hover/item:scale-110 transition-transform" />
                      <span>Utilisation de Sellertoolkit</span>
                    </li>
                    <li className="flex items-start gap-2 group/item hover:translate-x-2 transition-transform">
                      <CheckCircle2 className="w-5 h-5 text-primary flex-shrink-0 mt-0.5 group-hover/item:scale-110 transition-transform" />
                      <span>Template Excel inclus</span>
                    </li>
                  </ul>
                </CardContent>
              </Card>

              <Card className="group hover:shadow-xl hover:scale-[1.02] transition-all duration-300 animate-fade-in" style={{ animationDelay: '0.3s' }}>
                <CardHeader>
                  <CardTitle className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center font-bold text-primary group-hover:scale-110 group-hover:bg-primary group-hover:text-white transition-all">
                      3
                    </div>
                    Sourcing & Négociation Fournisseurs
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2">
                    <li className="flex items-start gap-2 group/item hover:translate-x-2 transition-transform">
                      <CheckCircle2 className="w-5 h-5 text-primary flex-shrink-0 mt-0.5 group-hover/item:scale-110 transition-transform" />
                      <span>Trouver des fournisseurs fiables</span>
                    </li>
                    <li className="flex items-start gap-2 group/item hover:translate-x-2 transition-transform">
                      <CheckCircle2 className="w-5 h-5 text-primary flex-shrink-0 mt-0.5 group-hover/item:scale-110 transition-transform" />
                      <span>Techniques de négociation</span>
                    </li>
                    <li className="flex items-start gap-2 group/item hover:translate-x-2 transition-transform">
                      <CheckCircle2 className="w-5 h-5 text-primary flex-shrink-0 mt-0.5 group-hover/item:scale-110 transition-transform" />
                      <span>Échantillons et contrôle qualité</span>
                    </li>
                    <li className="flex items-start gap-2 group/item hover:translate-x-2 transition-transform">
                      <CheckCircle2 className="w-5 h-5 text-primary flex-shrink-0 mt-0.5 group-hover/item:scale-110 transition-transform" />
                      <span>Templates emails et contrats</span>
                    </li>
                  </ul>
                </CardContent>
              </Card>

              <Card className="group hover:shadow-xl hover:scale-[1.02] transition-all duration-300 animate-fade-in" style={{ animationDelay: '0.4s' }}>
                <CardHeader>
                  <CardTitle className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center font-bold text-primary group-hover:scale-110 group-hover:bg-primary group-hover:text-white transition-all">
                      4
                    </div>
                    Création de Listing Optimisé
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2">
                    <li className="flex items-start gap-2 group/item hover:translate-x-2 transition-transform">
                      <CheckCircle2 className="w-5 h-5 text-primary flex-shrink-0 mt-0.5 group-hover/item:scale-110 transition-transform" />
                      <span>Recherche de mots-clés Amazon SEO</span>
                    </li>
                    <li className="flex items-start gap-2 group/item hover:translate-x-2 transition-transform">
                      <CheckCircle2 className="w-5 h-5 text-primary flex-shrink-0 mt-0.5 group-hover/item:scale-110 transition-transform" />
                      <span>Rédaction de titre et bullet points</span>
                    </li>
                    <li className="flex items-start gap-2 group/item hover:translate-x-2 transition-transform">
                      <CheckCircle2 className="w-5 h-5 text-primary flex-shrink-0 mt-0.5 group-hover/item:scale-110 transition-transform" />
                      <span>Images et A+ Content</span>
                    </li>
                    <li className="flex items-start gap-2 group/item hover:translate-x-2 transition-transform">
                      <CheckCircle2 className="w-5 h-5 text-primary flex-shrink-0 mt-0.5 group-hover/item:scale-110 transition-transform" />
                      <span>Checklist listing parfait</span>
                    </li>
                  </ul>
                </CardContent>
              </Card>

              <Card className="group hover:shadow-xl hover:scale-[1.02] transition-all duration-300 animate-fade-in" style={{ animationDelay: '0.5s' }}>
                <CardHeader>
                  <CardTitle className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center font-bold text-primary group-hover:scale-110 group-hover:bg-primary group-hover:text-white transition-all">
                      5
                    </div>
                    Lancement et Premières Ventes
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2">
                    <li className="flex items-start gap-2 group/item hover:translate-x-2 transition-transform">
                      <CheckCircle2 className="w-5 h-5 text-primary flex-shrink-0 mt-0.5 group-hover/item:scale-110 transition-transform" />
                      <span>Stratégies de lancement produit</span>
                    </li>
                    <li className="flex items-start gap-2 group/item hover:translate-x-2 transition-transform">
                      <CheckCircle2 className="w-5 h-5 text-primary flex-shrink-0 mt-0.5 group-hover/item:scale-110 transition-transform" />
                      <span>PPC Amazon Ads (Sponsored Products)</span>
                    </li>
                    <li className="flex items-start gap-2 group/item hover:translate-x-2 transition-transform">
                      <CheckCircle2 className="w-5 h-5 text-primary flex-shrink-0 mt-0.5 group-hover/item:scale-110 transition-transform" />
                      <span>Obtenir vos premiers avis clients</span>
                    </li>
                    <li className="flex items-start gap-2 group/item hover:translate-x-2 transition-transform">
                      <CheckCircle2 className="w-5 h-5 text-primary flex-shrink-0 mt-0.5 group-hover/item:scale-110 transition-transform" />
                      <span>Gérer les commandes et le SAV</span>
                    </li>
                  </ul>
                </CardContent>
              </Card>

              <Card className="group hover:shadow-xl hover:scale-[1.02] transition-all duration-300 animate-fade-in" style={{ animationDelay: '0.6s' }}>
                <CardHeader>
                  <CardTitle className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center font-bold text-primary group-hover:scale-110 group-hover:bg-primary group-hover:text-white transition-all">
                      6
                    </div>
                    Scaling et Optimisation
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2">
                    <li className="flex items-start gap-2 group/item hover:translate-x-2 transition-transform">
                      <CheckCircle2 className="w-5 h-5 text-primary flex-shrink-0 mt-0.5 group-hover/item:scale-110 transition-transform" />
                      <span>Analyse des performances et KPI</span>
                    </li>
                    <li className="flex items-start gap-2 group/item hover:translate-x-2 transition-transform">
                      <CheckCircle2 className="w-5 h-5 text-primary flex-shrink-0 mt-0.5 group-hover/item:scale-110 transition-transform" />
                      <span>Optimisation continue du listing</span>
                    </li>
                    <li className="flex items-start gap-2 group/item hover:translate-x-2 transition-transform">
                      <CheckCircle2 className="w-5 h-5 text-primary flex-shrink-0 mt-0.5 group-hover/item:scale-110 transition-transform" />
                      <span>Expansion catalogue produits</span>
                    </li>
                    <li className="flex items-start gap-2 group/item hover:translate-x-2 transition-transform">
                      <CheckCircle2 className="w-5 h-5 text-primary flex-shrink-0 mt-0.5 group-hover/item:scale-110 transition-transform" />
                      <span>Stratégies de croissance long terme</span>
                    </li>
                  </ul>
                </CardContent>
              </Card>
            </div>
          </div>

          {/* Bonuses */}
          <div className="mb-20">
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
              <Link to="/tarifs" className="block group">
                <Card className="border-2 border-primary h-full cursor-pointer hover:scale-105 hover:shadow-2xl hover:shadow-primary/30 transition-all duration-500 animate-fade-in hover:border-primary/60" style={{ animationDelay: '0.1s' }}>
                  <CardContent className="pt-8 text-center">
                    <div className="w-16 h-16 bg-gradient-to-br from-primary to-primary-glow rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:scale-110 group-hover:rotate-3 transition-all duration-300 animate-float">
                      <Users className="w-8 h-8 text-white" />
                    </div>
                    <h3 className="font-bold text-xl mb-3 group-hover:text-primary transition-colors">Accès Communauté VIP</h3>
                    <p className="text-muted-foreground">
                      Rejoignez la communauté, posez vos questions et recevez des alertes produits
                    </p>
                  </CardContent>
                </Card>
              </Link>

              <Link to="/tarifs" className="block group">
                <Card className="border-2 border-secondary h-full cursor-pointer hover:scale-105 hover:shadow-2xl hover:shadow-secondary/30 transition-all duration-500 animate-fade-in hover:border-secondary/60" style={{ animationDelay: '0.2s' }}>
                  <CardContent className="pt-8 text-center">
                    <div className="w-16 h-16 bg-gradient-to-br from-secondary to-accent rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:scale-110 group-hover:rotate-3 transition-all duration-300 animate-float" style={{ animationDelay: '2s' }}>
                      <Download className="w-8 h-8 text-white" />
                    </div>
                    <h3 className="font-bold text-xl mb-3 group-hover:text-secondary transition-colors">Templates & Checklists</h3>
                    <p className="text-muted-foreground">
                      Excel, Google Sheets, documents prêts à l'emploi pour gagner du temps
                    </p>
                  </CardContent>
                </Card>
              </Link>

              <Link to="/tarifs" className="block group">
                <Card className="border-2 border-primary h-full cursor-pointer hover:scale-105 hover:shadow-2xl hover:shadow-primary/30 transition-all duration-500 animate-fade-in hover:border-primary/60" style={{ animationDelay: '0.3s' }}>
                  <CardContent className="pt-8 text-center">
                    <div className="w-16 h-16 bg-gradient-to-br from-primary to-secondary rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:scale-110 group-hover:rotate-3 transition-all duration-300 animate-float" style={{ animationDelay: '4s' }}>
                      <TrendingUp className="w-8 h-8 text-white" />
                    </div>
                    <h3 className="font-bold text-xl mb-3 group-hover:text-primary transition-colors">Mises à Jour Gratuites</h3>
                    <p className="text-muted-foreground">
                      Accès à vie avec tous les nouveaux modules et contenus ajoutés
                    </p>
                  </CardContent>
                </Card>
              </Link>
            </div>
          </div>

          {/* CTA */}
          <Card className="bg-gradient-to-r from-primary to-secondary text-white border-none animate-fade-in hover:shadow-2xl hover:shadow-primary/30 transition-all duration-500 animate-gradient-shift">
            <CardContent className="p-12 text-center">
              <h2 className="text-4xl font-bold mb-4 animate-fade-in" style={{ animationDelay: '0.1s' }}>
                Prêt à Démarrer ?
              </h2>
              <p className="text-xl mb-8 text-white/90 max-w-2xl mx-auto animate-fade-in" style={{ animationDelay: '0.2s' }}>
                Rejoignez des centaines d'élèves qui ont lancé leur business Amazon grâce à notre formation
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center animate-fade-in" style={{ animationDelay: '0.3s' }}>
                <Button variant="secondary" size="xl" asChild className="bg-white text-primary hover:bg-white/90 hover:scale-105 transition-all duration-300">
                  <Link to="/tarifs">Accéder à la formation</Link>
                </Button>
                <Button variant="outline" size="xl" asChild className="border-white text-white hover:bg-white/10 hover:scale-105 transition-all duration-300">
                  <Link to="/tarifs">Voir les tarifs</Link>
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
