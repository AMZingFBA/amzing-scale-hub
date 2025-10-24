import { ArrowLeft, CheckCircle2, Lightbulb, TrendingUp, Euro, Package, Store, Shield, Clock, Target, Building2, Wrench } from 'lucide-react';
import { Link } from 'react-router-dom';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import processFlow from '@/assets/amazon-process-flow.png';

const Guides = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-grow pt-20">
        <div className="container mx-auto px-4 py-8">
          <div className="max-w-6xl mx-auto">
            <Link 
              to="/dashboard" 
              className="inline-flex items-center gap-2 text-muted-foreground hover:text-primary mb-6 transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
              Retour à l'Espace VIP
            </Link>

            <div className="mb-8">
              <h1 className="text-4xl font-bold mb-3">📘 Guides AMZing FBA</h1>
              <p className="text-xl text-muted-foreground">
                Tout ce que tu dois savoir pour réussir dans l'achat-revente sur Amazon.
              </p>
            </div>

            <Tabs defaultValue="debuter" className="w-full">
              <TabsList className="grid w-full grid-cols-2 lg:grid-cols-4 mb-8">
                <TabsTrigger value="debuter">🚀 Débuter</TabsTrigger>
                <TabsTrigger value="entreprise">🏢 Entreprise</TabsTrigger>
                <TabsTrigger value="vendre">🛍️ Vendre</TabsTrigger>
                <TabsTrigger value="outils">🧰 Outils</TabsTrigger>
              </TabsList>

              {/* ONGLET DÉBUTER */}
              <TabsContent value="debuter" className="space-y-6">
                <h2 className="text-2xl font-bold mb-4">Commence ton aventure Amazon</h2>
                
                {/* Introduction avec image */}
                <Card className="bg-gradient-to-br from-primary/5 to-primary/10 border-primary/20">
                  <CardHeader>
                    <CardTitle className="text-xl">💼 L'achat-revente sur Amazon, c'est quoi ?</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <p className="text-lg">
                      C'est un modèle de business très développé aux États-Unis 🇺🇸 qui se démocratise rapidement en France 🇫🇷.
                    </p>
                    <p>
                      Une version beaucoup plus professionnelle, stable et scalable de l'achat-revente classique.
                    </p>
                    <div className="bg-background/80 rounded-lg p-6 my-6">
                      <img 
                        src={processFlow} 
                        alt="Processus d'achat-revente sur Amazon" 
                        className="w-full max-w-3xl mx-auto"
                      />
                    </div>
                    <div className="grid md:grid-cols-2 gap-4 mt-6">
                      <div className="flex items-start gap-3">
                        <TrendingUp className="w-5 h-5 text-primary mt-1 flex-shrink-0" />
                        <div>
                          <h4 className="font-semibold mb-1">3 milliards de visites/mois</h4>
                          <p className="text-sm text-muted-foreground">Amazon est la plus grande marketplace au monde</p>
                        </div>
                      </div>
                      <div className="flex items-start gap-3">
                        <Euro className="w-5 h-5 text-primary mt-1 flex-shrink-0" />
                        <div>
                          <h4 className="font-semibold mb-1">1,4 milliard $/jour</h4>
                          <p className="text-sm text-muted-foreground">De chiffre d'affaires généré quotidiennement</p>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Accordion pour Débuter */}
                <Accordion type="single" collapsible className="space-y-4">
                  <AccordionItem value="comment" className="border rounded-lg px-6 bg-card">
                    <AccordionTrigger className="text-lg font-semibold hover:no-underline">
                      <div className="flex items-center gap-3">
                        <Euro className="w-5 h-5 text-primary" />
                        <span>Comment ça fonctionne ?</span>
                      </div>
                    </AccordionTrigger>
                    <AccordionContent className="space-y-4 pt-4">
                      <p>Tu achètes des produits à bas prix (en ligne ou en magasin), puis tu les revends plus cher sur Amazon.</p>
                      <p className="font-medium">La différence entre ton prix d'achat et ton prix de vente, c'est ton bénéfice 💰</p>
                      
                      <div className="bg-primary/5 rounded-lg p-4 space-y-2">
                        <h4 className="font-semibold">Quelques exemples concrets :</h4>
                        <ul className="space-y-2 text-sm">
                          <li>🎲 Un UNO Edition Deluxe acheté 5,80 € → revendu 19,90 € en 3 jours (+240% de marge)</li>
                          <li>🧸 Un jouet acheté 12 € → revendu 35 € en 1 semaine</li>
                          <li>💄 Des produits beauté achetés 8 € → revendus 24 € en quelques jours</li>
                        </ul>
                      </div>
                    </AccordionContent>
                  </AccordionItem>

                  <AccordionItem value="pourquoi" className="border rounded-lg px-6 bg-card">
                    <AccordionTrigger className="text-lg font-semibold hover:no-underline">
                      <div className="flex items-center gap-3">
                        <CheckCircle2 className="w-5 h-5 text-primary" />
                        <span>Pourquoi Amazon plutôt qu'ailleurs ?</span>
                      </div>
                    </AccordionTrigger>
                    <AccordionContent className="space-y-4 pt-4">
                      <div className="grid md:grid-cols-2 gap-4">
                        <Card>
                          <CardHeader className="pb-3">
                            <CardTitle className="text-base">📦 Expédition simplifiée</CardTitle>
                          </CardHeader>
                          <CardContent className="text-sm text-muted-foreground">
                            Avec FBA, Amazon gère le stockage, l'emballage et la livraison
                          </CardContent>
                        </Card>
                        <Card>
                          <CardHeader className="pb-3">
                            <CardTitle className="text-base">👥 Trafic énorme</CardTitle>
                          </CardHeader>
                          <CardContent className="text-sm text-muted-foreground">
                            Des millions de clients potentiels visitent Amazon chaque jour
                          </CardContent>
                        </Card>
                        <Card>
                          <CardHeader className="pb-3">
                            <CardTitle className="text-base">🔒 Confiance client</CardTitle>
                          </CardHeader>
                          <CardContent className="text-sm text-muted-foreground">
                            Les acheteurs font confiance à Amazon, donc à tes produits
                          </CardContent>
                        </Card>
                        <Card>
                          <CardHeader className="pb-3">
                            <CardTitle className="text-base">⚡ Automatisation</CardTitle>
                          </CardHeader>
                          <CardContent className="text-sm text-muted-foreground">
                            Gère tout depuis ton ordinateur ou smartphone
                          </CardContent>
                        </Card>
                      </div>
                    </AccordionContent>
                  </AccordionItem>

                  <AccordionItem value="bases" className="border rounded-lg px-6 bg-card">
                    <AccordionTrigger className="text-lg font-semibold hover:no-underline">
                      <div className="flex items-center gap-3">
                        <Lightbulb className="w-5 h-5 text-primary" />
                        <span>Les bases avant de vendre</span>
                      </div>
                    </AccordionTrigger>
                    <AccordionContent className="space-y-6 pt-4">
                      <div className="space-y-4">
                        <h3 className="text-lg font-semibold flex items-center gap-2">
                          <Euro className="w-5 h-5 text-primary" />
                          Définir ton budget
                        </h3>
                        
                        <Card className="bg-primary/5">
                          <CardHeader>
                            <CardTitle className="text-base">💵 Budget de 300 à 500 €</CardTitle>
                          </CardHeader>
                          <CardContent className="space-y-2 text-sm">
                            <p>Commence petit mais malin.</p>
                            <p>Concentre-toi sur des produits à bas coût (15-30 € max), avec un ROI d'au moins 50% et 100 ventes/mois minimum.</p>
                            <p className="font-medium">👉 Exemple : petits jouets, accessoires tech, beauté, fournitures de bureau</p>
                          </CardContent>
                        </Card>

                        <Card className="bg-primary/5">
                          <CardHeader>
                            <CardTitle className="text-base">💸 Budget de 1000 € ou plus</CardTitle>
                          </CardHeader>
                          <CardContent className="space-y-2 text-sm">
                            <p>Tu peux viser une gamme plus large de produits (20-60 €).</p>
                            <p>Cherche des produits avec 80-150 ventes/mois et un ROI de 40% minimum.</p>
                            <p className="font-medium">Moins de rotation, mais plus de marge par unité.</p>
                          </CardContent>
                        </Card>
                      </div>

                      <div className="space-y-4">
                        <h3 className="text-lg font-semibold flex items-center gap-2">
                          <Shield className="w-5 h-5 text-primary" />
                          Les obligations légales
                        </h3>
                        <p>Pour vendre légalement sur Amazon, tu dois créer une entreprise.</p>
                        <div className="bg-background/80 rounded-lg p-4 space-y-2 text-sm">
                          <p>✅ Micro-entrepreneur : idéal pour débuter facilement</p>
                          <p>✅ SASU/SAS : meilleur pour scaler et optimiser fiscalement</p>
                          <p>⚠️ Sans structure légale, tu ne peux pas ouvrir de compte vendeur</p>
                        </div>
                      </div>

                      <div className="space-y-4">
                        <h3 className="text-lg font-semibold flex items-center gap-2">
                          <Clock className="w-5 h-5 text-primary" />
                          Le temps à y consacrer
                        </h3>
                        <p>L'achat-revente peut être une activité à temps partiel ou temps plein.</p>
                        <div className="grid md:grid-cols-2 gap-4">
                          <div className="bg-background/80 rounded-lg p-4">
                            <h4 className="font-semibold mb-2">⏰ Débutant (5-10h/semaine)</h4>
                            <p className="text-sm">Recherche de produits, commandes, gestion basique</p>
                          </div>
                          <div className="bg-background/80 rounded-lg p-4">
                            <h4 className="font-semibold mb-2">🚀 Intermédiaire (15-25h/semaine)</h4>
                            <p className="text-sm">Scaling, optimisation, diversification des sources</p>
                          </div>
                        </div>
                      </div>

                      <div className="space-y-4">
                        <h3 className="text-lg font-semibold flex items-center gap-2">
                          <Target className="w-5 h-5 text-primary" />
                          Le retour sur investissement (ROI)
                        </h3>
                        <p>Vise toujours un ROI minimum de 40-50% pour couvrir les frais Amazon et dégager du bénéfice.</p>
                        <div className="bg-primary/5 rounded-lg p-4">
                          <p className="font-semibold mb-2">Exemple de calcul :</p>
                          <ul className="space-y-1 text-sm">
                            <li>• Produit acheté : 10 €</li>
                            <li>• Prix de vente : 25 €</li>
                            <li>• Frais Amazon (~15%) : 3,75 €</li>
                            <li>• Bénéfice net : 11,25 € (112% de ROI)</li>
                          </ul>
                        </div>
                      </div>
                    </AccordionContent>
                  </AccordionItem>
                </Accordion>
              </TabsContent>

              {/* ONGLET ENTREPRISE */}
              <TabsContent value="entreprise" className="space-y-6">
                <h2 className="text-2xl font-bold mb-4">Structure ton activité</h2>
                
                <Accordion type="single" collapsible className="space-y-4">
                  <AccordionItem value="creer" className="border rounded-lg px-6 bg-card">
                    <AccordionTrigger className="text-lg font-semibold hover:no-underline">
                      <div className="flex items-center gap-3">
                        <Building2 className="w-5 h-5 text-primary" />
                        <span>Créer son entreprise facilement</span>
                      </div>
                    </AccordionTrigger>
                    <AccordionContent className="space-y-6 pt-4">
                      <p className="text-lg">Tu peux créer ton entreprise à partir de 84,15 € avec des services comme LegalPlace.</p>
                      
                      <div className="space-y-4">
                        <h3 className="text-lg font-semibold">Créer une micro-entreprise</h3>
                        
                        <Card>
                          <CardHeader>
                            <CardTitle className="text-base">🧾 Option 1 : Gratuitement par toi-même</CardTitle>
                          </CardHeader>
                          <CardContent className="space-y-2 text-sm">
                            <p>Rends-toi sur le site officiel du gouvernement</p>
                            <p>Connecte-toi avec France Connect ou INPI Connect</p>
                            <p>Remplis les formulaires en ligne</p>
                            <p className="font-medium">💡 Délai moyen : 1 à 2 semaines</p>
                          </CardContent>
                        </Card>

                        <Card>
                          <CardHeader>
                            <CardTitle className="text-base">🧰 Option 2 : Via un gestionnaire (LegalPlace)</CardTitle>
                          </CardHeader>
                          <CardContent className="space-y-2 text-sm">
                            <p>Délègue toute la paperasse à un service professionnel</p>
                            <p>Prix : environ 84 €</p>
                            <p>Tout est géré pour toi, tu reçois ton SIREN rapidement</p>
                          </CardContent>
                        </Card>
                      </div>
                    </AccordionContent>
                  </AccordionItem>

                  <AccordionItem value="statuts" className="border rounded-lg px-6 bg-card">
                    <AccordionTrigger className="text-lg font-semibold hover:no-underline">
                      <div className="flex items-center gap-3">
                        <Shield className="w-5 h-5 text-primary" />
                        <span>Auto-entrepreneur ou SASU ?</span>
                      </div>
                    </AccordionTrigger>
                    <AccordionContent className="space-y-6 pt-4">
                      <Card className="bg-primary/5">
                        <CardHeader>
                          <CardTitle className="text-base">👤 Micro-entrepreneur (auto-entrepreneur)</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-2 text-sm">
                          <p>C'est le statut idéal pour démarrer facilement et tester ton activité sans gros investissement.</p>
                          <div className="mt-3 space-y-1">
                            <p>✅ Idéal pour débuter facilement</p>
                            <p>✅ Peu de démarches et frais réduits</p>
                            <p>❌ Limité par les plafonds de CA</p>
                            <p>❌ Pas de récupération de TVA</p>
                            <p>❌ Ne peux pas amortir ton matériel ni déduire certaines charges</p>
                          </div>
                          <p className="font-medium mt-3">💡 En résumé : excellent pour débuter, mais vite limité si ton activité décolle.</p>
                        </CardContent>
                      </Card>

                      <Card className="bg-primary/5">
                        <CardHeader>
                          <CardTitle className="text-base">🏢 SASU/SAS (Société par Actions Simplifiée)</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-2 text-sm">
                          <p>La SASU est une forme de SAS avec un seul associé. C'est le statut le plus prisé pour scaler.</p>
                          <div className="mt-3 space-y-1">
                            <p>✅ Récupération de la TVA sur tes achats</p>
                            <p>✅ Pas de plafond de CA</p>
                            <p>✅ Meilleure image professionnelle</p>
                            <p>✅ Optimisation fiscale possible</p>
                            <p>❌ Comptabilité plus complexe</p>
                            <p>❌ Frais de création plus élevés (84-300 €)</p>
                            <p>❌ Cotisations sociales plus élevées</p>
                          </div>
                          <p className="font-medium mt-3">💡 Idéal si tu prévois de dépasser 30k€/an de CA ou si tu veux optimiser fiscalement.</p>
                        </CardContent>
                      </Card>

                      <Card className="bg-muted/50">
                        <CardHeader>
                          <CardTitle className="text-base">🌍 LTD (Limited Company)</CardTitle>
                        </CardHeader>
                        <CardContent className="text-sm">
                          <p>La LTD est une forme juridique étrangère (souvent britannique). Mieux vaut rester sur une structure française au début (SAS, SASU ou SARL). Les obligations administratives à l'étranger sont plus complexes.</p>
                        </CardContent>
                      </Card>
                    </AccordionContent>
                  </AccordionItem>

                  <AccordionItem value="profil" className="border rounded-lg px-6 bg-card">
                    <AccordionTrigger className="text-lg font-semibold hover:no-underline">
                      <div className="flex items-center gap-3">
                        <Store className="w-5 h-5 text-primary" />
                        <span>Créer son profil professionnel</span>
                      </div>
                    </AccordionTrigger>
                    <AccordionContent className="space-y-6 pt-4">
                      <p>Ton profil vendeur influence directement la confiance des clients. Un nom clair et professionnel est essentiel.</p>
                      
                      <div className="space-y-4">
                        <h3 className="text-lg font-semibold">🏪 Choisir un bon nom de boutique</h3>
                        <p className="text-sm">Lors de la création de ton compte vendeur, Amazon te demandera de choisir le nom de ta boutique. Ce nom apparaîtra sur chaque commande de tes clients.</p>
                        
                        <div className="bg-background/80 rounded-lg p-4 space-y-2">
                          <p className="font-semibold">Conseils :</p>
                          <ul className="space-y-1 text-sm">
                            <li>❌ Évite les noms trop longs ou compliqués</li>
                            <li>❌ N'utilise pas de mots personnels ou fantaisistes</li>
                            <li>✅ Préfère un ou deux mots maximum, simples et mémorisables</li>
                            <li>✅ Utilise des mots qui inspirent confiance : France, Ventes, Conseil, Toys, Shop, Solutions...</li>
                          </ul>
                        </div>

                        <Card className="bg-primary/5">
                          <CardHeader>
                            <CardTitle className="text-base">💬 Astuce simple</CardTitle>
                          </CardHeader>
                          <CardContent className="text-sm">
                            <p>Prends la première lettre de ton prénom et de ton nom, puis ajoute un mot crédible :</p>
                            <p className="mt-2 font-medium">Exemple : "AMZ Conseil", "JS Sales", "Ecom Paris"</p>
                          </CardContent>
                        </Card>
                      </div>

                      <div className="space-y-4">
                        <h3 className="text-lg font-semibold">📧 Créer une adresse mail professionnelle</h3>
                        <p className="text-sm">Évite les adresses personnelles comme "jean.dupont123@gmail.com"</p>
                        <p className="text-sm font-medium">Préfère : contact@tamarque.fr ou info@tamarque.com</p>
                        <p className="text-sm text-muted-foreground">Tu peux créer une adresse mail gratuite via Google Workspace, ProtonMail, ou directement chez ton hébergeur de site web.</p>
                      </div>
                    </AccordionContent>
                  </AccordionItem>
                </Accordion>
              </TabsContent>

              {/* ONGLET VENDRE */}
              <TabsContent value="vendre" className="space-y-6">
                <h2 className="text-2xl font-bold mb-4">Lance-toi sur Amazon</h2>
                
                <Accordion type="single" collapsible className="space-y-4">
                  <AccordionItem value="seller" className="border rounded-lg px-6 bg-card">
                    <AccordionTrigger className="text-lg font-semibold hover:no-underline">
                      <div className="flex items-center gap-3">
                        <Store className="w-5 h-5 text-primary" />
                        <span>Ouvrir ton compte Amazon Seller</span>
                      </div>
                    </AccordionTrigger>
                    <AccordionContent className="space-y-6 pt-4">
                      <p className="text-lg">Tu es enfin prêt à vendre sur Amazon ! 🚀</p>
                      
                      <div className="space-y-4">
                        <h3 className="text-lg font-semibold">💸 Les frais à prévoir</h3>
                        <div className="grid md:grid-cols-2 gap-3">
                          <div className="bg-background/80 rounded-lg p-3 text-sm">
                            <p className="font-semibold">💳 Abonnement Seller Pro</p>
                            <p className="text-muted-foreground">39 € HT/mois (46,80 € TTC)</p>
                          </div>
                          <div className="bg-background/80 rounded-lg p-3 text-sm">
                            <p className="font-semibold">📱 SellerAmp</p>
                            <p className="text-muted-foreground">~20 $/mois</p>
                          </div>
                          <div className="bg-background/80 rounded-lg p-3 text-sm">
                            <p className="font-semibold">🚚 Frais de livraison</p>
                            <p className="text-muted-foreground">Variables selon FBM/FBA</p>
                          </div>
                          <div className="bg-background/80 rounded-lg p-3 text-sm">
                            <p className="font-semibold">💰 Commissions Amazon</p>
                            <p className="text-muted-foreground">~15% par vente</p>
                          </div>
                          <div className="bg-background/80 rounded-lg p-3 text-sm">
                            <p className="font-semibold">📦 Frais d'emballage</p>
                            <p className="text-muted-foreground">Cartons, étiquettes, ruban</p>
                          </div>
                          <div className="bg-background/80 rounded-lg p-3 text-sm">
                            <p className="font-semibold">🖨️ Imprimante thermique</p>
                            <p className="text-muted-foreground">Obligatoire pour FBA</p>
                          </div>
                        </div>
                        <p className="text-sm text-muted-foreground">💡 Ces frais peuvent paraître élevés, mais ils te permettent d'avoir un business complet, automatisé et professionnel.</p>
                      </div>

                      <div className="space-y-4">
                        <h3 className="text-lg font-semibold">🖥️ Étapes de création</h3>
                        <div className="space-y-3">
                          <Card>
                            <CardHeader className="pb-3">
                              <CardTitle className="text-base">1️⃣ Rendez-vous sur sell.amazon.fr</CardTitle>
                            </CardHeader>
                            <CardContent className="text-sm text-muted-foreground">
                              Clique sur "S'inscrire" en haut à droite. Amazon te proposera soit de créer un nouveau compte, soit de te connecter à ton compte existant.
                            </CardContent>
                          </Card>
                          <Card>
                            <CardHeader className="pb-3">
                              <CardTitle className="text-base">2️⃣ Remplis tes informations personnelles</CardTitle>
                            </CardHeader>
                            <CardContent className="text-sm text-muted-foreground">
                              Nom complet, adresse mail professionnelle, numéro de téléphone
                            </CardContent>
                          </Card>
                          <Card>
                            <CardHeader className="pb-3">
                              <CardTitle className="text-base">3️⃣ Informations légales de ton entreprise</CardTitle>
                            </CardHeader>
                            <CardContent className="text-sm text-muted-foreground">
                              Numéro SIREN, statut juridique, adresse professionnelle
                            </CardContent>
                          </Card>
                          <Card>
                            <CardHeader className="pb-3">
                              <CardTitle className="text-base">4️⃣ Vérification d'identité</CardTitle>
                            </CardHeader>
                            <CardContent className="text-sm text-muted-foreground">
                              Carte d'identité, justificatif de domicile récent, RIB professionnel
                            </CardContent>
                          </Card>
                          <Card>
                            <CardHeader className="pb-3">
                              <CardTitle className="text-base">5️⃣ Validation et activation</CardTitle>
                            </CardHeader>
                            <CardContent className="text-sm text-muted-foreground">
                              Amazon vérifie tes documents (24-48h). Une fois validé, ton compte est actif !
                            </CardContent>
                          </Card>
                        </div>
                      </div>
                    </AccordionContent>
                  </AccordionItem>

                  <AccordionItem value="vente" className="border rounded-lg px-6 bg-card">
                    <AccordionTrigger className="text-lg font-semibold hover:no-underline">
                      <div className="flex items-center gap-3">
                        <Package className="w-5 h-5 text-primary" />
                        <span>Mettre en vente tes produits</span>
                      </div>
                    </AccordionTrigger>
                    <AccordionContent className="space-y-6 pt-4">
                      <p>Une fois ton compte validé, tu peux commencer à mettre des produits en vente.</p>
                      
                      <Card className="bg-primary/5">
                        <CardHeader>
                          <CardTitle className="text-base">📝 Étapes pour publier une offre</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-2 text-sm">
                          <p>1. Recherche le produit par son code-barres (EAN) ou ASIN</p>
                          <p>2. Clique sur "Vendre le vôtre"</p>
                          <p>3. Définis ton prix de vente</p>
                          <p>4. Indique ta quantité en stock</p>
                          <p>5. Choisis ton mode d'expédition (FBM ou FBA)</p>
                          <p>6. Publie ton offre !</p>
                        </CardContent>
                      </Card>

                      <div className="space-y-3">
                        <h3 className="font-semibold">💰 Fixer le bon prix</h3>
                        <p className="text-sm">Analyse la concurrence et positionne-toi légèrement en dessous du prix moyen pour maximiser tes chances de gagner la Buy Box.</p>
                      </div>

                      <div className="space-y-3">
                        <h3 className="font-semibold">📦 Gérer le stock</h3>
                        <p className="text-sm">En FBM, tu gères toi-même ton stock. En FBA, tu envoies tes produits à Amazon qui gère tout pour toi.</p>
                      </div>
                    </AccordionContent>
                  </AccordionItem>
                </Accordion>
              </TabsContent>

              {/* ONGLET OUTILS */}
              <TabsContent value="outils" className="space-y-6">
                <h2 className="text-2xl font-bold mb-4">Optimise ton business</h2>
                
                <div className="grid md:grid-cols-2 gap-6">
                  <Card className="hover:shadow-lg transition-all">
                    <CardHeader>
                      <div className="flex items-start gap-3">
                        <Wrench className="w-6 h-6 text-primary flex-shrink-0 mt-1" />
                        <div>
                          <CardTitle className="text-lg">🔍 Seller AMP</CardTitle>
                          <CardDescription className="mt-2">
                            Analyse instantanément la rentabilité, la concurrence et les ventes estimées d'un produit.
                          </CardDescription>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent className="space-y-3">
                      <div className="bg-primary/5 rounded-lg p-3 text-sm space-y-2">
                        <p className="font-semibold">Fonctionnalités principales :</p>
                        <ul className="space-y-1 text-muted-foreground">
                          <li>• Calcul automatique du ROI</li>
                          <li>• Estimation des ventes mensuelles</li>
                          <li>• Analyse de la concurrence</li>
                          <li>• Scan en magasin via l'app mobile</li>
                        </ul>
                      </div>
                      <p className="text-sm text-muted-foreground">Prix : ~20$/mois</p>
                    </CardContent>
                  </Card>

                  <Card className="hover:shadow-lg transition-all">
                    <CardHeader>
                      <div className="flex items-start gap-3">
                        <Wrench className="w-6 h-6 text-primary flex-shrink-0 mt-1" />
                        <div>
                          <CardTitle className="text-lg">📊 Seller Toolkit</CardTitle>
                          <CardDescription className="mt-2">
                            Gère automatiquement ton stock, tes marges, tes alertes de rentabilité et tes statistiques Amazon.
                          </CardDescription>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent className="space-y-3">
                      <div className="bg-primary/5 rounded-lg p-3 text-sm space-y-2">
                        <p className="font-semibold">Fonctionnalités principales :</p>
                        <ul className="space-y-1 text-muted-foreground">
                          <li>• Gestion des stocks et inventaires</li>
                          <li>• Calcul des marges en temps réel</li>
                          <li>• Alertes de prix et rentabilité</li>
                          <li>• Statistiques détaillées de performance</li>
                        </ul>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </TabsContent>
            </Tabs>

            <Card className="mt-8 bg-gradient-to-br from-primary/10 to-primary/5 border-primary/20">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  💡 Conseil
                </CardTitle>
                <CardDescription className="text-base">
                  Suis les guides dans l'ordre pour une progression optimale. Commence par "Débuter" avant de passer aux sections "Entreprise" et "Vendre".
                </CardDescription>
              </CardHeader>
            </Card>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Guides;
