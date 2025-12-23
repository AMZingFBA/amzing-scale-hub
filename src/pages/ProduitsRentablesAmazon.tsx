import { ArrowRight, ArrowLeft, CheckCircle2, Search, TrendingUp, BarChart3, Lightbulb, DollarSign, Package, Zap, Clock, Eye, ShoppingCart } from 'lucide-react';
import { Link } from 'react-router-dom';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import SEO from '@/components/SEO';
import { seoData, schemas } from '@/lib/seo-data';
import { useScrollReveal } from '@/hooks/use-scroll-reveal';
import { cn } from '@/lib/utils';

const ProduitsRentablesAmazon = () => {
  const heroAnim = useScrollReveal({ animation: 'fade-up', delay: 100 });
  const section1Anim = useScrollReveal({ animation: 'fade-left', delay: 100 });
  const section2Anim = useScrollReveal({ animation: 'fade-right', delay: 100 });
  const section3Anim = useScrollReveal({ animation: 'fade-up', delay: 100 });
  const section4Anim = useScrollReveal({ animation: 'scale', delay: 100 });

  return (
    <div className="min-h-screen flex flex-col">
      <SEO 
        title={seoData.produitsRentablesAmazon.title}
        description={seoData.produitsRentablesAmazon.description}
        keywords={seoData.produitsRentablesAmazon.keywords}
        robots={seoData.produitsRentablesAmazon.robots}
        schema={schemas.produitsRentablesAmazonArticle}
      />
      <Navbar />
      
      {/* Back Button */}
      <div className="fixed top-24 left-4 z-40">
        <Link 
          to="/" 
          className="flex items-center justify-center w-10 h-10 rounded-full bg-primary text-primary-foreground shadow-lg hover:bg-primary/90 hover:scale-110 transition-all duration-200"
        >
          <ArrowLeft className="w-5 h-5" />
        </Link>
      </div>

      <main className="flex-grow">
        {/* Hero Section */}
        <section 
          ref={heroAnim.ref}
          className={cn(
            "pt-32 pb-20 bg-gradient-to-br from-green-500/10 via-background to-primary/10 transition-all duration-700",
            heroAnim.isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"
          )}
        >
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto text-center">
              <span className="inline-block px-4 py-2 bg-green-500/20 text-green-600 dark:text-green-400 rounded-full text-sm font-medium mb-6">
                Nouveaux produits tous les jours
              </span>
              <h1 className="text-4xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-green-500 via-primary to-green-500 bg-clip-text text-transparent">
                Des produits rentables analysés pour toi
              </h1>
              <p className="text-xl text-muted-foreground mb-8 max-w-3xl mx-auto">
                Chaque jour, on ajoute de nouveaux produits dans l'app avec le ROI, la marge et le lien fournisseur. Tu choisis ce qui t'intéresse et tu passes à l'action.
              </p>
              
              {/* Stats rapides */}
              <div className="grid grid-cols-3 gap-4 max-w-2xl mx-auto mb-10">
                <div className="text-center">
                  <div className="text-3xl md:text-4xl font-bold text-green-500">+50</div>
                  <div className="text-sm text-muted-foreground">produits/jour</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl md:text-4xl font-bold text-primary">30%+</div>
                  <div className="text-sm text-muted-foreground">ROI minimum</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl md:text-4xl font-bold text-green-500">0h</div>
                  <div className="text-sm text-muted-foreground">de recherche</div>
                </div>
              </div>
              
              <Button size="lg" asChild className="text-lg px-8 bg-green-600 hover:bg-green-700">
                <Link to="/tarifs">
                  <ArrowRight className="w-5 h-5 mr-2" />
                  Accéder aux produits
                </Link>
              </Button>
            </div>
          </div>
        </section>

        {/* Section 1: Ce que tu reçois chaque jour */}
        <section 
          ref={section1Anim.ref}
          className={cn(
            "py-20 transition-all duration-700",
            section1Anim.isVisible ? "opacity-100 translate-x-0" : "opacity-0 -translate-x-10"
          )}
        >
          <div className="container mx-auto px-4">
            <div className="max-w-5xl mx-auto">
              <div className="text-center mb-12">
                <h2 className="text-3xl md:text-4xl font-bold mb-4">Ce que tu trouves dans l'app</h2>
                <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                  Chaque produit est analysé. Tu vois tout ce qu'il faut pour décider si ça vaut le coup.
                </p>
              </div>
              
              <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
                <Card className="border-green-500/30 text-center group hover:shadow-lg transition-all">
                  <CardContent className="pt-8 pb-6">
                    <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-green-500/10 flex items-center justify-center group-hover:bg-green-500/20 transition-colors">
                      <DollarSign className="w-8 h-8 text-green-500" />
                    </div>
                    <h3 className="font-bold text-lg mb-2">ROI calculé</h3>
                    <p className="text-muted-foreground text-sm">Marge nette, ROI FBA et FBM. Tu sais exactement combien tu gagnes.</p>
                  </CardContent>
                </Card>
                
                <Card className="border-primary/30 text-center group hover:shadow-lg transition-all">
                  <CardContent className="pt-8 pb-6">
                    <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-primary/10 flex items-center justify-center group-hover:bg-primary/20 transition-colors">
                      <ShoppingCart className="w-8 h-8 text-primary" />
                    </div>
                    <h3 className="font-bold text-lg mb-2">Lien fournisseur</h3>
                    <p className="text-muted-foreground text-sm">Tu veux acheter ? Le lien direct vers le fournisseur est inclus.</p>
                  </CardContent>
                </Card>
                
                <Card className="border-green-500/30 text-center group hover:shadow-lg transition-all">
                  <CardContent className="pt-8 pb-6">
                    <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-green-500/10 flex items-center justify-center group-hover:bg-green-500/20 transition-colors">
                      <BarChart3 className="w-8 h-8 text-green-500" />
                    </div>
                    <h3 className="font-bold text-lg mb-2">Données SellerAmp</h3>
                    <p className="text-muted-foreground text-sm">BSR, ventes estimées, nombre de vendeurs. Tout est là.</p>
                  </CardContent>
                </Card>
                
                <Card className="border-primary/30 text-center group hover:shadow-lg transition-all">
                  <CardContent className="pt-8 pb-6">
                    <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-primary/10 flex items-center justify-center group-hover:bg-primary/20 transition-colors">
                      <TrendingUp className="w-8 h-8 text-primary" />
                    </div>
                    <h3 className="font-bold text-lg mb-2">Tendances</h3>
                    <p className="text-muted-foreground text-sm">On surveille le marché pour toi et on détecte les opportunités.</p>
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
        </section>

        {/* Section 2: Comment ça marche */}
        <section 
          ref={section2Anim.ref}
          className={cn(
            "py-20 bg-muted/30 transition-all duration-700",
            section2Anim.isVisible ? "opacity-100 translate-x-0" : "opacity-0 translate-x-10"
          )}
        >
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto">
              <div className="text-center mb-12">
                <h2 className="text-3xl md:text-4xl font-bold mb-4">Comment ça marche</h2>
                <p className="text-lg text-muted-foreground">
                  Simple. Tu ouvres l'app, tu regardes les produits, tu décides.
                </p>
              </div>
              
              <div className="space-y-8">
                <div className="flex items-start gap-6">
                  <div className="flex-shrink-0 w-16 h-16 rounded-2xl bg-gradient-to-br from-green-500 to-green-600 text-white flex items-center justify-center text-2xl font-bold shadow-lg">
                    1
                  </div>
                  <div className="flex-1 pt-2">
                    <h3 className="text-xl font-bold mb-2">Consulte les produits dans l'app</h3>
                    <p className="text-muted-foreground">Chaque jour, de nouveaux produits rentables apparaissent. Tu peux filtrer par ROI, catégorie ou marge.</p>
                  </div>
                </div>
                
                <div className="flex items-start gap-6">
                  <div className="flex-shrink-0 w-16 h-16 rounded-2xl bg-gradient-to-br from-primary to-secondary text-white flex items-center justify-center text-2xl font-bold shadow-lg">
                    2
                  </div>
                  <div className="flex-1 pt-2">
                    <h3 className="text-xl font-bold mb-2">Analyse et décide</h3>
                    <p className="text-muted-foreground">Tu vois le ROI, la marge, le BSR, les ventes estimées. Tu sais exactement si le produit vaut le coup.</p>
                  </div>
                </div>
                
                <div className="flex items-start gap-6">
                  <div className="flex-shrink-0 w-16 h-16 rounded-2xl bg-gradient-to-br from-green-500 to-primary text-white flex items-center justify-center text-2xl font-bold shadow-lg">
                    3
                  </div>
                  <div className="flex-1 pt-2">
                    <h3 className="text-xl font-bold mb-2">Achète et revends sur Amazon</h3>
                    <p className="text-muted-foreground">Le produit t'intéresse ? Va sur le site du fournisseur, achète, et revends sur Amazon en FBA, FBM ou via AMZing FBA 360.</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Section 3: Types de produits */}
        <section 
          ref={section3Anim.ref}
          className={cn(
            "py-20 transition-all duration-700",
            section3Anim.isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"
          )}
        >
          <div className="container mx-auto px-4">
            <div className="max-w-5xl mx-auto">
              <div className="text-center mb-12">
                <h2 className="text-3xl md:text-4xl font-bold mb-4">Ce qu'on analyse pour toi</h2>
                <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                  On fait le travail de recherche. Tu récupères les résultats.
                </p>
              </div>
              
              <div className="grid md:grid-cols-3 gap-6">
                <Card className="border-green-500/30 overflow-hidden">
                  <div className="h-2 bg-gradient-to-r from-green-500 to-green-600" />
                  <CardContent className="pt-6">
                    <div className="flex items-center gap-3 mb-4">
                      <Package className="w-8 h-8 text-green-500" />
                      <h3 className="font-bold text-lg">Produits wholesale</h3>
                    </div>
                    <p className="text-muted-foreground text-sm mb-4">
                      Des produits de grossistes avec de bonnes marges pour faire du volume.
                    </p>
                    <ul className="space-y-2 text-sm">
                      <li className="flex items-center gap-2">
                        <CheckCircle2 className="w-4 h-4 text-green-500" />
                        Prix HT compétitifs
                      </li>
                      <li className="flex items-center gap-2">
                        <CheckCircle2 className="w-4 h-4 text-green-500" />
                        Stock disponible
                      </li>
                      <li className="flex items-center gap-2">
                        <CheckCircle2 className="w-4 h-4 text-green-500" />
                        Fournisseurs vérifiés
                      </li>
                    </ul>
                  </CardContent>
                </Card>
                
                <Card className="border-primary/30 overflow-hidden">
                  <div className="h-2 bg-gradient-to-r from-primary to-secondary" />
                  <CardContent className="pt-6">
                    <div className="flex items-center gap-3 mb-4">
                      <TrendingUp className="w-8 h-8 text-primary" />
                      <h3 className="font-bold text-lg">Tendances du marché</h3>
                    </div>
                    <p className="text-muted-foreground text-sm mb-4">
                      On surveille les tendances et les variations de prix pour détecter les opportunités.
                    </p>
                    <ul className="space-y-2 text-sm">
                      <li className="flex items-center gap-2">
                        <CheckCircle2 className="w-4 h-4 text-primary" />
                        Suivi des prix
                      </li>
                      <li className="flex items-center gap-2">
                        <CheckCircle2 className="w-4 h-4 text-primary" />
                        Produits en hausse
                      </li>
                      <li className="flex items-center gap-2">
                        <CheckCircle2 className="w-4 h-4 text-primary" />
                        Saisonnalité
                      </li>
                    </ul>
                  </CardContent>
                </Card>
                
                <Card className="border-green-500/30 overflow-hidden">
                  <div className="h-2 bg-gradient-to-r from-green-500 to-primary" />
                  <CardContent className="pt-6">
                    <div className="flex items-center gap-3 mb-4">
                      <Zap className="w-8 h-8 text-green-500" />
                      <h3 className="font-bold text-lg">Alertes temps réel</h3>
                    </div>
                    <p className="text-muted-foreground text-sm mb-4">
                      Promotions flash, destockages, opportunités limitées. Tu es le premier informé.
                    </p>
                    <ul className="space-y-2 text-sm">
                      <li className="flex items-center gap-2">
                        <CheckCircle2 className="w-4 h-4 text-green-500" />
                        Notifications push
                      </li>
                      <li className="flex items-center gap-2">
                        <CheckCircle2 className="w-4 h-4 text-green-500" />
                        Durée limitée
                      </li>
                      <li className="flex items-center gap-2">
                        <CheckCircle2 className="w-4 h-4 text-green-500" />
                        Fort potentiel
                      </li>
                    </ul>
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
        </section>

        {/* Section 4: CTA Final */}
        <section 
          ref={section4Anim.ref}
          className={cn(
            "py-20 bg-gradient-to-br from-green-500/10 via-background to-primary/10 transition-all duration-700",
            section4Anim.isVisible ? "opacity-100 scale-100" : "opacity-0 scale-95"
          )}
        >
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto">
              <Card className="bg-gradient-to-r from-green-600 to-primary text-white border-none overflow-hidden">
                <CardContent className="py-12 px-8 md:px-12">
                  <div className="grid md:grid-cols-2 gap-8 items-center">
                    <div>
                      <h3 className="text-2xl md:text-3xl font-bold mb-4">Accède aux produits rentables dès maintenant</h3>
                      <p className="text-white/90 mb-6">
                        Deviens membre AMZing FBA et consulte les produits analysés, les fournisseurs et échange avec la communauté.
                      </p>
                      <Button size="lg" variant="secondary" asChild className="text-lg px-8">
                        <Link to="/tarifs">
                          Voir les offres
                          <ArrowRight className="w-5 h-5 ml-2" />
                        </Link>
                      </Button>
                    </div>
                    <div className="hidden md:block">
                      <div className="grid grid-cols-2 gap-4">
                        <div className="bg-white/10 rounded-xl p-4 text-center backdrop-blur-sm">
                          <Clock className="w-8 h-8 mx-auto mb-2" />
                          <div className="text-sm">Gagne du temps</div>
                        </div>
                        <div className="bg-white/10 rounded-xl p-4 text-center backdrop-blur-sm">
                          <Eye className="w-8 h-8 mx-auto mb-2" />
                          <div className="text-sm">Zéro recherche</div>
                        </div>
                        <div className="bg-white/10 rounded-xl p-4 text-center backdrop-blur-sm">
                          <DollarSign className="w-8 h-8 mx-auto mb-2" />
                          <div className="text-sm">Marges garanties</div>
                        </div>
                        <div className="bg-white/10 rounded-xl p-4 text-center backdrop-blur-sm">
                          <TrendingUp className="w-8 h-8 mx-auto mb-2" />
                          <div className="text-sm">Tendances suivies</div>
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
};

export default ProduitsRentablesAmazon;
