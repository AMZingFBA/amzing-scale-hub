import { ArrowRight, CheckCircle2, Search, TrendingUp, BarChart3, Lightbulb, DollarSign, Package, Zap, Clock, Eye, ShoppingCart } from 'lucide-react';
import { Link } from 'react-router-dom';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import SEO from '@/components/SEO';
import { seoData } from '@/lib/seo-data';
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
      />
      <Navbar />
      
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
                Produits analysés tous les jours
              </span>
              <h1 className="text-4xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-green-500 via-primary to-green-500 bg-clip-text text-transparent">
                Des produits rentables livrés dans ta boîte mail
              </h1>
              <p className="text-xl text-muted-foreground mb-8 max-w-3xl mx-auto">
                Pourquoi passer des heures à chercher ? Chaque jour, on t'envoie des produits analysés avec ROI, marge et fournisseur. Tu n'as plus qu'à choisir et commander.
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
                  <div className="text-3xl md:text-4xl font-bold text-green-500">5min</div>
                  <div className="text-sm text-muted-foreground">pour commander</div>
                </div>
              </div>
              
              <Button size="lg" asChild className="text-lg px-8 bg-green-600 hover:bg-green-700">
                <Link to="/tarifs">
                  <ArrowRight className="w-5 h-5 mr-2" />
                  Recevoir les produits du jour
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
                <h2 className="text-3xl md:text-4xl font-bold mb-4">Ce que tu reçois chaque jour</h2>
                <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                  Pas juste une liste de produits. On te donne tout ce qu'il faut pour décider en 2 minutes.
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
                    <p className="text-muted-foreground text-sm">Le produit te plaît ? Clique et commande directement.</p>
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
            "py-20 bg-accent/30 transition-all duration-700",
            section2Anim.isVisible ? "opacity-100 translate-x-0" : "opacity-0 translate-x-10"
          )}
        >
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto">
              <div className="text-center mb-12">
                <h2 className="text-3xl md:text-4xl font-bold mb-4">Du produit à la vente en 3 étapes</h2>
                <p className="text-lg text-muted-foreground">
                  On simplifie tout. Tu te concentres sur ce qui compte : vendre.
                </p>
              </div>
              
              <div className="space-y-8">
                <div className="flex items-start gap-6">
                  <div className="flex-shrink-0 w-16 h-16 rounded-2xl bg-gradient-to-br from-green-500 to-green-600 text-white flex items-center justify-center text-2xl font-bold shadow-lg">
                    1
                  </div>
                  <div className="flex-1 pt-2">
                    <h3 className="text-xl font-bold mb-2">Tu reçois les produits du jour</h3>
                    <p className="text-muted-foreground">Chaque matin, les meilleures opportunités arrivent dans ton espace membre. Filtre par ROI, catégorie ou prix.</p>
                  </div>
                </div>
                
                <div className="flex items-start gap-6">
                  <div className="flex-shrink-0 w-16 h-16 rounded-2xl bg-gradient-to-br from-primary to-secondary text-white flex items-center justify-center text-2xl font-bold shadow-lg">
                    2
                  </div>
                  <div className="flex-1 pt-2">
                    <h3 className="text-xl font-bold mb-2">Tu choisis et tu commandes</h3>
                    <p className="text-muted-foreground">Un produit te plaît ? Clique sur le lien fournisseur et passe commande. C'est direct, pas d'intermédiaire.</p>
                  </div>
                </div>
                
                <div className="flex items-start gap-6">
                  <div className="flex-shrink-0 w-16 h-16 rounded-2xl bg-gradient-to-br from-green-500 to-primary text-white flex items-center justify-center text-2xl font-bold shadow-lg">
                    3
                  </div>
                  <div className="flex-1 pt-2">
                    <h3 className="text-xl font-bold mb-2">Tu envoies sur Amazon et tu vends</h3>
                    <p className="text-muted-foreground">Envoie tes produits en FBA, FBM, ou utilise AMZing FBA 360 pour qu'on gère la logistique à ta place.</p>
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
                <h2 className="text-3xl md:text-4xl font-bold mb-4">Plusieurs sources, plus d'opportunités</h2>
                <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                  On analyse plusieurs fournisseurs et marketplaces pour te trouver les meilleures marges.
                </p>
              </div>
              
              <div className="grid md:grid-cols-3 gap-6">
                <Card className="border-green-500/30 overflow-hidden">
                  <div className="h-2 bg-gradient-to-r from-green-500 to-green-600" />
                  <CardContent className="pt-6">
                    <div className="flex items-center gap-3 mb-4">
                      <Package className="w-8 h-8 text-green-500" />
                      <h3 className="font-bold text-lg">Produits Qogita</h3>
                    </div>
                    <p className="text-muted-foreground text-sm mb-4">
                      Grossiste européen avec des milliers de références. Idéal pour le wholesale.
                    </p>
                    <ul className="space-y-2 text-sm">
                      <li className="flex items-center gap-2">
                        <CheckCircle2 className="w-4 h-4 text-green-500" />
                        Prix HT compétitifs
                      </li>
                      <li className="flex items-center gap-2">
                        <CheckCircle2 className="w-4 h-4 text-green-500" />
                        Stock en temps réel
                      </li>
                      <li className="flex items-center gap-2">
                        <CheckCircle2 className="w-4 h-4 text-green-500" />
                        Livraison rapide
                      </li>
                    </ul>
                  </CardContent>
                </Card>
                
                <Card className="border-primary/30 overflow-hidden">
                  <div className="h-2 bg-gradient-to-r from-primary to-secondary" />
                  <CardContent className="pt-6">
                    <div className="flex items-center gap-3 mb-4">
                      <Search className="w-8 h-8 text-primary" />
                      <h3 className="font-bold text-lg">Produits eAny</h3>
                    </div>
                    <p className="text-muted-foreground text-sm mb-4">
                      Opportunités détectées sur d'autres sources. Des pépites à fort ROI.
                    </p>
                    <ul className="space-y-2 text-sm">
                      <li className="flex items-center gap-2">
                        <CheckCircle2 className="w-4 h-4 text-primary" />
                        ROI élevés
                      </li>
                      <li className="flex items-center gap-2">
                        <CheckCircle2 className="w-4 h-4 text-primary" />
                        Produits exclusifs
                      </li>
                      <li className="flex items-center gap-2">
                        <CheckCircle2 className="w-4 h-4 text-primary" />
                        Analyse complète
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
                      <h3 className="text-2xl md:text-3xl font-bold mb-4">Commence à recevoir des produits rentables dès demain</h3>
                      <p className="text-white/90 mb-6">
                        Rejoins AMZing FBA et accède aux produits analysés, aux fournisseurs et à la communauté de vendeurs.
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
