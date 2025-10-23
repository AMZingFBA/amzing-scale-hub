import { GraduationCap, Users, Package, Warehouse, TrendingUp, HeadphonesIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Link } from "react-router-dom";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

const Services = () => {
  return (
    <div className="min-h-screen">
      <Navbar />
      
      <div className="pt-32 pb-20">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h1 className="text-5xl md:text-6xl font-bold mb-6">
              Nos Services
            </h1>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              Un écosystème complet pour démarrer, développer et scaler votre activité Amazon FBA
            </p>
          </div>

          <div className="space-y-20">
            {/* Formation */}
            <Card className="overflow-hidden">
              <CardContent className="p-0">
                <div className="grid md:grid-cols-2 gap-0">
                  <div className="bg-gradient-to-br from-primary to-primary-glow p-12 flex items-center justify-center">
                    <GraduationCap className="w-32 h-32 text-white" />
                  </div>
                  <div className="p-12">
                    <h2 className="text-3xl font-bold mb-4">Formation Amazon FBA</h2>
                    <p className="text-muted-foreground mb-6">
                      Apprenez à lancer et développer votre business Amazon avec notre formation complète. 
                      De la recherche de produits à l'optimisation de vos listings, en passant par la gestion des stocks et le scaling.
                    </p>
                    <ul className="space-y-3 mb-6">
                      <li className="flex items-start gap-2">
                        <div className="w-6 h-6 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0 mt-0.5">
                          <div className="w-2 h-2 rounded-full bg-primary" />
                        </div>
                        <span>Modules vidéo étape par étape</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <div className="w-6 h-6 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0 mt-0.5">
                          <div className="w-2 h-2 rounded-full bg-primary" />
                        </div>
                        <span>Templates Excel et checklists</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <div className="w-6 h-6 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0 mt-0.5">
                          <div className="w-2 h-2 rounded-full bg-primary" />
                        </div>
                        <span>Accès au Discord privé inclus</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <div className="w-6 h-6 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0 mt-0.5">
                          <div className="w-2 h-2 rounded-full bg-primary" />
                        </div>
                        <span>Mises à jour régulières</span>
                      </li>
                    </ul>
                    <Button variant="hero" size="lg" asChild>
                      <Link to="/formation">Découvrir la formation</Link>
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Discord Community */}
            <Card className="overflow-hidden">
              <CardContent className="p-0">
                <div className="grid md:grid-cols-2 gap-0">
                  <div className="p-12 order-2 md:order-1">
                    <h2 className="text-3xl font-bold mb-4">Communauté Discord Privée</h2>
                    <p className="text-muted-foreground mb-6">
                      Rejoignez une communauté active de vendeurs Amazon. Partagez vos expériences, 
                      recevez des alertes produits exclusives et bénéficiez du support de membres expérimentés.
                    </p>
                    <ul className="space-y-3 mb-6">
                      <li className="flex items-start gap-2">
                        <div className="w-6 h-6 rounded-full bg-secondary/10 flex items-center justify-center flex-shrink-0 mt-0.5">
                          <div className="w-2 h-2 rounded-full bg-secondary" />
                        </div>
                        <span>Alertes produits rentables en temps réel</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <div className="w-6 h-6 rounded-full bg-secondary/10 flex items-center justify-center flex-shrink-0 mt-0.5">
                          <div className="w-2 h-2 rounded-full bg-secondary" />
                        </div>
                        <span>Hacks et stratégies exclusives</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <div className="w-6 h-6 rounded-full bg-secondary/10 flex items-center justify-center flex-shrink-0 mt-0.5">
                          <div className="w-2 h-2 rounded-full bg-secondary" />
                        </div>
                        <span>Networking avec d'autres vendeurs</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <div className="w-6 h-6 rounded-full bg-secondary/10 flex items-center justify-center flex-shrink-0 mt-0.5">
                          <div className="w-2 h-2 rounded-full bg-secondary" />
                        </div>
                        <span>Support réactif de l'équipe</span>
                      </li>
                    </ul>
                    <Button variant="secondary" size="lg" asChild>
                      <a href="https://discord.com/channels/1430928328466108619/1430933836958531699" target="_blank" rel="noopener noreferrer">
                        Rejoindre Discord
                      </a>
                    </Button>
                  </div>
                  <div className="bg-gradient-to-br from-secondary to-accent p-12 flex items-center justify-center order-1 md:order-2">
                    <Users className="w-32 h-32 text-white" />
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Catalogue */}
            <Card className="overflow-hidden">
              <CardContent className="p-0">
                <div className="grid md:grid-cols-2 gap-0">
                  <div className="bg-gradient-to-br from-primary via-secondary to-accent p-12 flex items-center justify-center">
                    <Package className="w-32 h-32 text-white" />
                  </div>
                  <div className="p-12">
                    <h2 className="text-3xl font-bold mb-4">Catalogue Produits Rentables</h2>
                    <p className="text-muted-foreground mb-6">
                      Accédez à notre catalogue de produits sourcés, testés et validés. 
                      Prix gros, ROI estimé et disponibilité en temps réel pour faciliter vos décisions.
                    </p>
                    <ul className="space-y-3 mb-6">
                      <li className="flex items-start gap-2">
                        <div className="w-6 h-6 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0 mt-0.5">
                          <div className="w-2 h-2 rounded-full bg-primary" />
                        </div>
                        <span>Produits sourcés et vérifiés</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <div className="w-6 h-6 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0 mt-0.5">
                          <div className="w-2 h-2 rounded-full bg-primary" />
                        </div>
                        <span>ROI et estimations de ventes</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <div className="w-6 h-6 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0 mt-0.5">
                          <div className="w-2 h-2 rounded-full bg-primary" />
                        </div>
                        <span>Mise à jour hebdomadaire</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <div className="w-6 h-6 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0 mt-0.5">
                          <div className="w-2 h-2 rounded-full bg-primary" />
                        </div>
                        <span>Prix gros compétitifs</span>
                      </li>
                    </ul>
                    <Button variant="hero" size="lg" asChild>
                      <Link to="/catalogue">Voir le catalogue</Link>
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Fulfilment */}
            <Card className="overflow-hidden">
              <CardContent className="p-0">
                <div className="grid md:grid-cols-2 gap-0">
                  <div className="p-12 order-2 md:order-1">
                    <h2 className="text-3xl font-bold mb-4">Stockage & Fulfilment</h2>
                    <p className="text-muted-foreground mb-6">
                      Concentrez-vous sur la vente pendant que nous gérons la logistique. 
                      Stockage sécurisé, préparation rapide et expédition fiable.
                    </p>
                    <ul className="space-y-3 mb-6">
                      <li className="flex items-start gap-2">
                        <div className="w-6 h-6 rounded-full bg-secondary/10 flex items-center justify-center flex-shrink-0 mt-0.5">
                          <div className="w-2 h-2 rounded-full bg-secondary" />
                        </div>
                        <span>Entreposage sécurisé et traçable</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <div className="w-6 h-6 rounded-full bg-secondary/10 flex items-center justify-center flex-shrink-0 mt-0.5">
                          <div className="w-2 h-2 rounded-full bg-secondary" />
                        </div>
                        <span>Préparation sous 24-48h</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <div className="w-6 h-6 rounded-full bg-secondary/10 flex items-center justify-center flex-shrink-0 mt-0.5">
                          <div className="w-2 h-2 rounded-full bg-secondary" />
                        </div>
                        <span>Préparation FBA incluse</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <div className="w-6 h-6 rounded-full bg-secondary/10 flex items-center justify-center flex-shrink-0 mt-0.5">
                          <div className="w-2 h-2 rounded-full bg-secondary" />
                        </div>
                        <span>Tarifs transparents et compétitifs</span>
                      </li>
                    </ul>
                    <Button variant="secondary" size="lg" asChild>
                      <Link to="/fulfilment">En savoir plus</Link>
                    </Button>
                  </div>
                  <div className="bg-gradient-to-br from-secondary to-primary p-12 flex items-center justify-center order-1 md:order-2">
                    <Warehouse className="w-32 h-32 text-white" />
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Coaching */}
            <Card className="overflow-hidden">
              <CardContent className="p-0">
                <div className="grid md:grid-cols-2 gap-0">
                  <div className="bg-gradient-to-br from-accent to-primary p-12 flex items-center justify-center">
                    <HeadphonesIcon className="w-32 h-32 text-white" />
                  </div>
                  <div className="p-12">
                    <h2 className="text-3xl font-bold mb-4">Coaching Premium</h2>
                    <p className="text-muted-foreground mb-6">
                      Bénéficiez d'un accompagnement personnalisé avec nos experts. 
                      Audits de compte, optimisation de listings et stratégies sur mesure.
                    </p>
                    <ul className="space-y-3 mb-6">
                      <li className="flex items-start gap-2">
                        <div className="w-6 h-6 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0 mt-0.5">
                          <div className="w-2 h-2 rounded-full bg-primary" />
                        </div>
                        <span>Sessions 1:1 avec un expert</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <div className="w-6 h-6 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0 mt-0.5">
                          <div className="w-2 h-2 rounded-full bg-primary" />
                        </div>
                        <span>Audit complet de votre compte</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <div className="w-6 h-6 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0 mt-0.5">
                          <div className="w-2 h-2 rounded-full bg-primary" />
                        </div>
                        <span>Plan d'action personnalisé</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <div className="w-6 h-6 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0 mt-0.5">
                          <div className="w-2 h-2 rounded-full bg-primary" />
                        </div>
                        <span>Suivi et optimisation continue</span>
                      </li>
                    </ul>
                    <Button variant="hero" size="lg" asChild>
                      <Link to="/coaching">Réserver un coaching</Link>
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default Services;
