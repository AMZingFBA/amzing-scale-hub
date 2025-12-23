import { ArrowRight, CheckCircle2, AlertTriangle, Search, TrendingUp, BarChart3, Target, Lightbulb, DollarSign, Package } from 'lucide-react';
import { Link } from 'react-router-dom';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import SEO from '@/components/SEO';
import { seoData } from '@/lib/seo-data';
import { useScrollReveal } from '@/hooks/use-scroll-reveal';
import { cn } from '@/lib/utils';
import produitsRentablesHero from '@/assets/produits-rentables-hero.jpg';

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
                Guide pratique
              </span>
              <h1 className="text-4xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-green-500 via-primary to-green-500 bg-clip-text text-transparent">
                Comment trouver des produits rentables sur Amazon
              </h1>
              <p className="text-xl text-muted-foreground mb-8 max-w-3xl mx-auto">
                La recherche de produits est la clé du succès sur Amazon FBA. Découvre la méthode pour identifier des produits gagnants et éviter les erreurs coûteuses.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button size="lg" asChild className="text-lg px-8 bg-green-600 hover:bg-green-700">
                  <Link to="/tarifs">
                    <ArrowRight className="w-5 h-5 mr-2" />
                    Accéder aux opportunités AMZing FBA
                  </Link>
                </Button>
              </div>
            </div>
          </div>
        </section>

        {/* Section 1: Qu'est-ce qu'un produit rentable */}
        <section 
          ref={section1Anim.ref}
          className={cn(
            "py-20 transition-all duration-700",
            section1Anim.isVisible ? "opacity-100 translate-x-0" : "opacity-0 -translate-x-10"
          )}
        >
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto">
              <div className="flex items-center gap-3 mb-8">
                <div className="p-3 bg-green-500/20 rounded-xl">
                  <DollarSign className="w-8 h-8 text-green-500" />
                </div>
                <h2 className="text-3xl md:text-4xl font-bold">Qu'est-ce qu'un produit rentable sur Amazon</h2>
              </div>
              
              <p className="text-lg text-muted-foreground mb-8">
                Un produit rentable, ce n'est pas juste un produit qui "se vend bien". C'est un produit qui te laisse <strong>une marge suffisante</strong> après avoir payé tous les frais : achat, transport, frais Amazon, TVA...
              </p>
              
              <div className="grid md:grid-cols-2 gap-6 mb-8">
                <Card className="border-green-500/30">
                  <CardHeader className="pb-2">
                    <CardTitle className="text-lg flex items-center gap-2">
                      <CheckCircle2 className="w-5 h-5 text-green-500" />
                      Critères d'un bon produit
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ul className="space-y-2 text-muted-foreground">
                      <li>• ROI minimum de 30% (idéalement 50%+)</li>
                      <li>• Marge nette d'au moins 5€ par unité</li>
                      <li>• Demande régulière (ventes stables)</li>
                      <li>• Concurrence raisonnable</li>
                      <li>• Pas de restrictions de vente</li>
                    </ul>
                  </CardContent>
                </Card>
                
                <Card className="border-primary/30">
                  <CardHeader className="pb-2">
                    <CardTitle className="text-lg flex items-center gap-2">
                      <BarChart3 className="w-5 h-5 text-primary" />
                      Indicateurs à surveiller
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ul className="space-y-2 text-muted-foreground">
                      <li>• BSR (Best Sellers Rank)</li>
                      <li>• Nombre de vendeurs sur la fiche</li>
                      <li>• Historique des prix</li>
                      <li>• Estimation des ventes mensuelles</li>
                      <li>• Frais FBA associés</li>
                    </ul>
                  </CardContent>
                </Card>
              </div>
              
              <Card className="border-primary/30 bg-gradient-to-r from-green-500/5 to-primary/5">
                <CardContent className="pt-6">
                  <p className="text-lg text-center">
                    <strong>À retenir :</strong> Un produit rentable = bonne marge + demande suffisante + concurrence gérable
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>

        {/* Section 2: Les erreurs dans la recherche */}
        <section 
          ref={section2Anim.ref}
          className={cn(
            "py-20 bg-accent/30 transition-all duration-700",
            section2Anim.isVisible ? "opacity-100 translate-x-0" : "opacity-0 translate-x-10"
          )}
        >
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto">
              <div className="flex items-center gap-3 mb-8">
                <div className="p-3 bg-destructive/20 rounded-xl">
                  <AlertTriangle className="w-8 h-8 text-destructive" />
                </div>
                <h2 className="text-3xl md:text-4xl font-bold">Les erreurs dans la recherche de produits</h2>
              </div>
              
              <p className="text-lg text-muted-foreground mb-8">
                La majorité des échecs sur Amazon viennent d'une <strong>mauvaise sélection de produits</strong>. Voici les erreurs les plus fréquentes à éviter absolument :
              </p>
              
              <div className="space-y-4">
                {[
                  {
                    error: "Se fier uniquement au prix de vente",
                    solution: "Analyse tous les coûts : achat, transport, frais Amazon, TVA. C'est la marge nette qui compte !"
                  },
                  {
                    error: "Ignorer la concurrence",
                    solution: "Vérifie le nombre de vendeurs, la présence d'Amazon en tant que vendeur, et la qualité des offres concurrentes."
                  },
                  {
                    error: "Ne pas vérifier les restrictions",
                    solution: "Certaines catégories sont bloquées. Vérifie AVANT d'acheter si tu peux vendre le produit."
                  },
                  {
                    error: "Sous-estimer les frais Amazon",
                    solution: "Les frais FBA varient selon la taille et le poids. Utilise le calculateur Amazon pour être précis."
                  },
                  {
                    error: "Se baser sur une seule source de données",
                    solution: "Croise plusieurs indicateurs : BSR, historique des prix, avis, variations saisonnières..."
                  },
                  {
                    error: "Acheter en trop grande quantité au départ",
                    solution: "Teste avec une petite quantité avant de scaler. Valide la demande réelle avant d'investir gros."
                  }
                ].map((item, index) => (
                  <Card key={index} className="border-destructive/20">
                    <CardContent className="pt-6">
                      <div className="flex items-start gap-4">
                        <div className="p-2 bg-destructive/10 rounded-lg">
                          <span className="text-destructive font-bold">✗</span>
                        </div>
                        <div className="flex-1">
                          <h3 className="font-bold text-lg mb-2 text-destructive">{item.error}</h3>
                          <p className="text-muted-foreground flex items-start gap-2">
                            <CheckCircle2 className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
                            {item.solution}
                          </p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* Section 3: Méthode professionnelle */}
        <section 
          ref={section3Anim.ref}
          className={cn(
            "py-20 transition-all duration-700",
            section3Anim.isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"
          )}
        >
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto">
              <div className="flex items-center gap-3 mb-8">
                <div className="p-3 bg-primary/20 rounded-xl">
                  <Search className="w-8 h-8 text-primary" />
                </div>
                <h2 className="text-3xl md:text-4xl font-bold">Méthode professionnelle pour analyser un produit</h2>
              </div>
              
              <p className="text-lg text-muted-foreground mb-8">
                Voici la méthode utilisée par les vendeurs professionnels pour valider un produit avant de l'acheter :
              </p>
              
              <div className="space-y-6">
                {[
                  {
                    step: 1,
                    title: "Identifier une opportunité",
                    description: "Utilise un outil comme SellerAmp pour scanner des produits en magasin ou en ligne. Recherche des produits avec un bon différentiel de prix."
                  },
                  {
                    step: 2,
                    title: "Analyser la demande",
                    description: "Vérifie le BSR (Best Sellers Rank) et l'historique des ventes. Un BSR stable et bas indique une demande régulière."
                  },
                  {
                    step: 3,
                    title: "Calculer la rentabilité",
                    description: "Utilise le calculateur FBA pour obtenir la marge exacte. Inclus tous les frais : achat, transport, FBA fees, TVA."
                  },
                  {
                    step: 4,
                    title: "Évaluer la concurrence",
                    description: "Compte le nombre de vendeurs FBA sur la fiche. Évite les fiches avec Amazon en vendeur principal."
                  },
                  {
                    step: 5,
                    title: "Vérifier les restrictions",
                    description: "Confirme que tu peux vendre ce produit dans cette catégorie sans autorisation spéciale."
                  },
                  {
                    step: 6,
                    title: "Valider avec un test",
                    description: "Achète une petite quantité pour tester la demande réelle avant d'investir davantage."
                  }
                ].map((item) => (
                  <Card key={item.step} className="border-primary/20 hover:border-primary/40 transition-all hover:shadow-lg">
                    <CardContent className="pt-6">
                      <div className="flex items-start gap-4">
                        <div className="p-3 rounded-xl bg-gradient-to-br from-primary to-secondary text-white text-xl font-bold min-w-[50px] text-center">
                          {item.step}
                        </div>
                        <div>
                          <h3 className="font-bold text-xl mb-2">{item.title}</h3>
                          <p className="text-muted-foreground">{item.description}</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* Section 4: Comment AMZing FBA facilite */}
        <section 
          ref={section4Anim.ref}
          className={cn(
            "py-20 bg-gradient-to-br from-green-500/10 via-background to-primary/10 transition-all duration-700",
            section4Anim.isVisible ? "opacity-100 scale-100" : "opacity-0 scale-95"
          )}
        >
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto">
              <div className="flex items-center gap-3 mb-8">
                <div className="p-3 bg-green-500/20 rounded-xl">
                  <Lightbulb className="w-8 h-8 text-green-500" />
                </div>
                <h2 className="text-3xl md:text-4xl font-bold">Comment AMZing FBA facilite la recherche</h2>
              </div>
              
              <p className="text-lg text-muted-foreground mb-8">
                Chez AMZing FBA, nous faisons le travail de recherche pour toi. Notre équipe analyse des centaines de produits chaque semaine pour te proposer uniquement les <strong>meilleures opportunités</strong>.
              </p>
              
              <div className="grid md:grid-cols-2 gap-6 mb-10">
                <Card className="border-green-500/30">
                  <CardContent className="pt-6">
                    <div className="flex items-center gap-3 mb-4">
                      <Package className="w-8 h-8 text-green-500" />
                      <h3 className="font-bold text-lg">Catalogue de produits validés</h3>
                    </div>
                    <p className="text-muted-foreground mb-4">
                      Accède à notre catalogue de produits rentables, analysés et validés par notre équipe d'experts.
                    </p>
                    <ul className="space-y-2 text-sm">
                      <li className="flex items-center gap-2">
                        <CheckCircle2 className="w-4 h-4 text-green-500" />
                        ROI calculé et vérifié
                      </li>
                      <li className="flex items-center gap-2">
                        <CheckCircle2 className="w-4 h-4 text-green-500" />
                        Sources d'approvisionnement
                      </li>
                      <li className="flex items-center gap-2">
                        <CheckCircle2 className="w-4 h-4 text-green-500" />
                        Mise à jour régulière
                      </li>
                    </ul>
                  </CardContent>
                </Card>
                
                <Card className="border-primary/30">
                  <CardContent className="pt-6">
                    <div className="flex items-center gap-3 mb-4">
                      <TrendingUp className="w-8 h-8 text-primary" />
                      <h3 className="font-bold text-lg">Alertes opportunités</h3>
                    </div>
                    <p className="text-muted-foreground mb-4">
                      Reçois des alertes en temps réel sur les nouvelles opportunités détectées par nos outils.
                    </p>
                    <ul className="space-y-2 text-sm">
                      <li className="flex items-center gap-2">
                        <CheckCircle2 className="w-4 h-4 text-primary" />
                        Notifications push
                      </li>
                      <li className="flex items-center gap-2">
                        <CheckCircle2 className="w-4 h-4 text-primary" />
                        Analyse automatique
                      </li>
                      <li className="flex items-center gap-2">
                        <CheckCircle2 className="w-4 h-4 text-primary" />
                        Filtres personnalisés
                      </li>
                    </ul>
                  </CardContent>
                </Card>
              </div>
              
              <Card className="bg-gradient-to-r from-green-600 to-primary text-white border-none">
                <CardContent className="py-10 text-center">
                  <h3 className="text-2xl font-bold mb-4">Prêt à trouver des produits rentables ?</h3>
                  <p className="text-white/90 mb-6 max-w-2xl mx-auto">
                    Rejoins AMZing FBA et accède à notre catalogue de produits analysés, nos outils de recherche et notre communauté de vendeurs.
                  </p>
                  <Button size="lg" variant="secondary" asChild className="text-lg px-8">
                    <Link to="/tarifs">
                      Accéder aux opportunités AMZing FBA
                      <ArrowRight className="w-5 h-5 ml-2" />
                    </Link>
                  </Button>
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
