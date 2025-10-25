import { ArrowLeft, CheckCircle2, TrendingUp, Euro, Package, Store, Shield, Clock, Target, Building2, Wrench, BookOpen, GraduationCap, Search } from 'lucide-react';
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
              <TabsList className="grid w-full grid-cols-4 mb-8">
                <TabsTrigger value="debuter">Débuter</TabsTrigger>
                <TabsTrigger value="entreprise">Entreprise</TabsTrigger>
                <TabsTrigger value="vendre">Vendre</TabsTrigger>
                <TabsTrigger value="outils">Outils</TabsTrigger>
              </TabsList>

              {/* ========== ONGLET DÉBUTER ========== */}
              <TabsContent value="debuter" className="space-y-8">
                
                {/* Découvrir l'achat-revente sur Amazon */}
                <section>
                  <div className="flex items-center gap-3 mb-6">
                    <div className="p-3 rounded-lg bg-primary/10">
                      <TrendingUp className="w-8 h-8 text-primary" />
                    </div>
                    <div>
                      <h2 className="text-3xl font-bold">Découvrir l'achat-revente sur Amazon</h2>
                      <p className="text-muted-foreground">Comprends le concept et les bases du business model</p>
                    </div>
                  </div>

                  <Card className="bg-gradient-to-br from-primary/5 to-primary/10 border-primary/20 mb-6">
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
                          alt="Processus d'achat-revente sur Amazon : Tu trouves un bon produit → tu l'achètes au bon prix → tu le mets sur Amazon → tu encaisses" 
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
                  </Accordion>
                </section>

                {/* Lexique Amazon */}
                <section>
                  <div className="flex items-center gap-3 mb-6">
                    <div className="p-3 rounded-lg bg-primary/10">
                      <BookOpen className="w-8 h-8 text-primary" />
                    </div>
                    <div>
                      <h2 className="text-3xl font-bold">Lexique Amazon</h2>
                      <p className="text-muted-foreground">Les mots-clés indispensables pour comprendre la plateforme</p>
                    </div>
                  </div>

                  <div className="grid md:grid-cols-2 gap-4">
                    <Card>
                      <CardHeader>
                        <CardTitle className="text-base">📦 FBA (Fulfillment by Amazon)</CardTitle>
                      </CardHeader>
                      <CardContent className="text-sm text-muted-foreground">
                        Service d'Amazon qui gère le stockage, l'emballage et l'expédition de tes produits. Tu envoies tes articles à un entrepôt Amazon, et ils s'occupent du reste.
                      </CardContent>
                    </Card>

                    <Card>
                      <CardHeader>
                        <CardTitle className="text-base">🚚 FBM (Fulfillment by Merchant)</CardTitle>
                      </CardHeader>
                      <CardContent className="text-sm text-muted-foreground">
                        Tu gères toi-même le stockage et l'expédition de tes produits. Moins de frais, mais plus de travail manuel.
                      </CardContent>
                    </Card>

                    <Card>
                      <CardHeader>
                        <CardTitle className="text-base">🔍 ASIN</CardTitle>
                      </CardHeader>
                      <CardContent className="text-sm text-muted-foreground">
                        Amazon Standard Identification Number - Code unique à 10 caractères attribué par Amazon à chaque produit sur sa plateforme.
                      </CardContent>
                    </Card>

                    <Card>
                      <CardHeader>
                        <CardTitle className="text-base">📊 Buy Box</CardTitle>
                      </CardHeader>
                      <CardContent className="text-sm text-muted-foreground">
                        L'encadré "Ajouter au panier" visible sur une page produit. C'est la position la plus convoitée car elle génère 80% des ventes.
                      </CardContent>
                    </Card>

                    <Card>
                      <CardHeader>
                        <CardTitle className="text-base">💰 ROI (Return on Investment)</CardTitle>
                      </CardHeader>
                      <CardContent className="text-sm text-muted-foreground">
                        Retour sur investissement. Calcul : (Bénéfice net / Coût d'achat) × 100. Un bon ROI en FBA est d'au moins 40-50%.
                      </CardContent>
                    </Card>

                    <Card>
                      <CardHeader>
                        <CardTitle className="text-base">📦 SKU (Stock Keeping Unit)</CardTitle>
                      </CardHeader>
                      <CardContent className="text-sm text-muted-foreground">
                        Code unique que tu crées pour identifier et suivre tes produits dans ton inventaire.
                      </CardContent>
                    </Card>

                    <Card>
                      <CardHeader>
                        <CardTitle className="text-base">🏷️ EAN (European Article Number)</CardTitle>
                      </CardHeader>
                      <CardContent className="text-sm text-muted-foreground">
                        Code-barres à 13 chiffres utilisé en Europe pour identifier un produit. Essentiel pour créer une fiche produit sur Amazon.
                      </CardContent>
                    </Card>

                    <Card>
                      <CardHeader>
                        <CardTitle className="text-base">📈 BSR (Best Seller Rank)</CardTitle>
                      </CardHeader>
                      <CardContent className="text-sm text-muted-foreground">
                        Classement des meilleures ventes. Plus le chiffre est bas, plus le produit se vend bien. Utile pour estimer la vélocité de vente.
                      </CardContent>
                    </Card>

                    <Card>
                      <CardHeader>
                        <CardTitle className="text-base">💸 Marge</CardTitle>
                      </CardHeader>
                      <CardContent className="text-sm text-muted-foreground">
                        Différence entre ton prix de vente et tous tes coûts (achat, frais Amazon, expédition). C'est ton profit réel par unité.
                      </CardContent>
                    </Card>

                    <Card>
                      <CardHeader>
                        <CardTitle className="text-base">🎯 PPC (Pay Per Click)</CardTitle>
                      </CardHeader>
                      <CardContent className="text-sm text-muted-foreground">
                        Publicité sponsorisée sur Amazon. Tu paies uniquement quand quelqu'un clique sur ton annonce.
                      </CardContent>
                    </Card>

                    <Card>
                      <CardHeader>
                        <CardTitle className="text-base">📦 Ungating</CardTitle>
                      </CardHeader>
                      <CardContent className="text-sm text-muted-foreground">
                        Processus pour obtenir l'autorisation de vendre certaines marques ou catégories restreintes sur Amazon.
                      </CardContent>
                    </Card>

                    <Card>
                      <CardHeader>
                        <CardTitle className="text-base">⚡ Lightning Deal</CardTitle>
                      </CardHeader>
                      <CardContent className="text-sm text-muted-foreground">
                        Promotion à durée limitée (quelques heures) qui met en avant ton produit sur la page des offres Amazon.
                      </CardContent>
                    </Card>
                  </div>
                </section>

                {/* Les bases avant de vendre */}
                <section>
                  <div className="flex items-center gap-3 mb-6">
                    <div className="p-3 rounded-lg bg-primary/10">
                      <GraduationCap className="w-8 h-8 text-primary" />
                    </div>
                    <div>
                      <h2 className="text-3xl font-bold">Les bases avant de vendre</h2>
                      <p className="text-muted-foreground">Ce qu'il faut savoir avant d'ouvrir ton compte vendeur</p>
                    </div>
                  </div>

                  <Accordion type="single" collapsible className="space-y-4">
                    <AccordionItem value="budget" className="border rounded-lg px-6 bg-card">
                      <AccordionTrigger className="text-lg font-semibold hover:no-underline">
                        <div className="flex items-center gap-3">
                          <Euro className="w-5 h-5 text-primary" />
                          <span>Définir ton budget</span>
                        </div>
                      </AccordionTrigger>
                      <AccordionContent className="space-y-4 pt-4">
                        <div className="space-y-4">
                          <p>Le budget recommandé varie selon tes ambitions, mais voici les fourchettes classiques :</p>
                          
                          <Card className="bg-primary/5">
                            <CardHeader>
                              <CardTitle className="text-base">💵 Budget de 300 à 500 €</CardTitle>
                            </CardHeader>
                            <CardContent className="text-sm space-y-2">
                              <p><strong>Pour qui :</strong> Débutant qui veut tester le concept sans risque.</p>
                              <p><strong>Résultat attendu :</strong> Petit stock, apprentissage rapide, mais croissance lente.</p>
                            </CardContent>
                          </Card>

                          <Card className="bg-primary/5">
                            <CardHeader>
                              <CardTitle className="text-base">💶 Budget de 1000 à 2000 €</CardTitle>
                            </CardHeader>
                            <CardContent className="text-sm space-y-2">
                              <p><strong>Pour qui :</strong> Quelqu'un qui veut lancer sérieusement.</p>
                              <p><strong>Résultat attendu :</strong> Stock correct, premières ventes régulières, réinvestissements possibles.</p>
                            </CardContent>
                          </Card>

                          <Card className="bg-primary/5">
                            <CardHeader>
                              <CardTitle className="text-base">💷 Budget de 3000 € et +</CardTitle>
                            </CardHeader>
                            <CardContent className="text-sm space-y-2">
                              <p><strong>Pour qui :</strong> Personne ambitieuse prête à scaler rapidement.</p>
                              <p><strong>Résultat attendu :</strong> Gros volume de ventes, potentiellement rentable dès le 1er mois.</p>
                            </CardContent>
                          </Card>

                          <div className="bg-amber-500/10 border border-amber-500/20 rounded-lg p-4 mt-4">
                            <p className="font-semibold text-amber-700 dark:text-amber-400">⚠️ Important</p>
                            <p className="text-sm mt-2">Ne mise jamais de l'argent dont tu as absolument besoin. Comme tout business, il y a un risque (même minime) de perte.</p>
                          </div>
                        </div>
                      </AccordionContent>
                    </AccordionItem>

                    <AccordionItem value="obligations" className="border rounded-lg px-6 bg-card">
                      <AccordionTrigger className="text-lg font-semibold hover:no-underline">
                        <div className="flex items-center gap-3">
                          <Shield className="w-5 h-5 text-primary" />
                          <span>Les obligations légales</span>
                        </div>
                      </AccordionTrigger>
                      <AccordionContent className="space-y-4 pt-4">
                        <p>Pour vendre sur Amazon en toute légalité en France, tu dois :</p>
                        
                        <div className="space-y-3">
                          <Card>
                            <CardHeader className="pb-3">
                              <CardTitle className="text-base flex items-center gap-2">
                                <CheckCircle2 className="w-4 h-4 text-primary" />
                                Avoir un statut juridique
                              </CardTitle>
                            </CardHeader>
                            <CardContent className="text-sm text-muted-foreground">
                              Auto-entrepreneur, SASU, EURL, etc. (voir section Entreprise)
                            </CardContent>
                          </Card>

                          <Card>
                            <CardHeader className="pb-3">
                              <CardTitle className="text-base flex items-center gap-2">
                                <CheckCircle2 className="w-4 h-4 text-primary" />
                                Déclarer ton activité
                              </CardTitle>
                            </CardHeader>
                            <CardContent className="text-sm text-muted-foreground">
                              Immatriculer ton entreprise (URSSAF, INPI, Greffe)
                            </CardContent>
                          </Card>

                          <Card>
                            <CardHeader className="pb-3">
                              <CardTitle className="text-base flex items-center gap-2">
                                <CheckCircle2 className="w-4 h-4 text-primary" />
                                Disposer d'un compte bancaire pro
                              </CardTitle>
                            </CardHeader>
                            <CardContent className="text-sm text-muted-foreground">
                              Obligatoire si tu dépasses 10 000 € de CA annuel (recommandé dès le début)
                            </CardContent>
                          </Card>

                          <Card>
                            <CardHeader className="pb-3">
                              <CardTitle className="text-base flex items-center gap-2">
                                <CheckCircle2 className="w-4 h-4 text-primary" />
                                Respecter les règles fiscales
                              </CardTitle>
                            </CardHeader>
                            <CardContent className="text-sm text-muted-foreground">
                              TVA, impôts sur le revenu ou sur les sociétés
                            </CardContent>
                          </Card>
                        </div>
                      </AccordionContent>
                    </AccordionItem>

                    <AccordionItem value="temps" className="border rounded-lg px-6 bg-card">
                      <AccordionTrigger className="text-lg font-semibold hover:no-underline">
                        <div className="flex items-center gap-3">
                          <Clock className="w-5 h-5 text-primary" />
                          <span>Le temps à y consacrer</span>
                        </div>
                      </AccordionTrigger>
                      <AccordionContent className="space-y-4 pt-4">
                        <p>Le temps nécessaire dépend de ton objectif :</p>
                        
                        <div className="space-y-3">
                          <Card className="bg-primary/5">
                            <CardHeader>
                              <CardTitle className="text-base">⏱️ Activité secondaire (5-10h/semaine)</CardTitle>
                            </CardHeader>
                            <CardContent className="text-sm space-y-2">
                              <p>Tu cherches des produits pendant tes temps libres, tu gères tes stocks le soir ou le week-end.</p>
                              <p className="text-muted-foreground">Objectif : 500 à 2000 € de bénéfices par mois.</p>
                            </CardContent>
                          </Card>

                          <Card className="bg-primary/5">
                            <CardHeader>
                              <CardTitle className="text-base">⏰ Activité principale (20-40h/semaine)</CardTitle>
                            </CardHeader>
                            <CardContent className="text-sm space-y-2">
                              <p>Tu te consacres pleinement à la recherche de produits, à la gestion de ton stock et à l'optimisation de tes listings.</p>
                              <p className="text-muted-foreground">Objectif : 3000 à 10 000 € de bénéfices par mois (voire plus).</p>
                            </CardContent>
                          </Card>
                        </div>

                        <div className="bg-blue-500/10 border border-blue-500/20 rounded-lg p-4 mt-4">
                          <p className="font-semibold">💡 Astuce</p>
                          <p className="text-sm mt-2">Plus tu investis de temps au début, plus tu apprends vite. Une fois que tu maîtrises, tu peux automatiser une partie du processus.</p>
                        </div>
                      </AccordionContent>
                    </AccordionItem>

                    <AccordionItem value="roi" className="border rounded-lg px-6 bg-card">
                      <AccordionTrigger className="text-lg font-semibold hover:no-underline">
                        <div className="flex items-center gap-3">
                          <Target className="w-5 h-5 text-primary" />
                          <span>Le retour sur investissement (ROI)</span>
                        </div>
                      </AccordionTrigger>
                      <AccordionContent className="space-y-4 pt-4">
                        <p>Le ROI en FBA Amazon est généralement excellent si tu appliques les bonnes stratégies.</p>
                        
                        <div className="space-y-4">
                          <div>
                            <h4 className="font-semibold mb-2">Objectif de ROI minimum :</h4>
                            <Card className="bg-primary/5">
                              <CardContent className="pt-6">
                                <p className="text-xl font-bold text-primary mb-2">40-50% de ROI minimum</p>
                                <p className="text-sm text-muted-foreground">
                                  Cela signifie que pour 100 € investis, tu récupères 140 à 150 € de bénéfice net (après tous les frais).
                                </p>
                              </CardContent>
                            </Card>
                          </div>

                          <div>
                            <h4 className="font-semibold mb-2">Exemples concrets :</h4>
                            <div className="space-y-2">
                              <Card>
                                <CardContent className="pt-6 text-sm">
                                  <p><strong>Produit acheté à 10 €</strong></p>
                                  <p>Vendu à 25 € → ROI de 50% → Bénéfice net : 5 €</p>
                                </CardContent>
                              </Card>
                              <Card>
                                <CardContent className="pt-6 text-sm">
                                  <p><strong>Produit acheté à 20 €</strong></p>
                                  <p>Vendu à 50 € → ROI de 60% → Bénéfice net : 12 €</p>
                                </CardContent>
                              </Card>
                            </div>
                          </div>

                          <div className="bg-green-500/10 border border-green-500/20 rounded-lg p-4">
                            <p className="font-semibold text-green-700 dark:text-green-400">✅ Bon à savoir</p>
                            <p className="text-sm mt-2">Certains produits peuvent avoir des ROI de 100%, 200%, voire plus ! Tout dépend de ta capacité à dénicher les bonnes opportunités.</p>
                          </div>
                        </div>
                      </AccordionContent>
                    </AccordionItem>
                  </Accordion>
                </section>
              </TabsContent>

              {/* ========== ONGLET ENTREPRISE ========== */}
              <TabsContent value="entreprise" className="space-y-8">
                <section>
                  <div className="flex items-center gap-3 mb-6">
                    <div className="p-3 rounded-lg bg-primary/10">
                      <Building2 className="w-8 h-8 text-primary" />
                    </div>
                    <div>
                      <h2 className="text-3xl font-bold">Créer son entreprise</h2>
                      <p className="text-muted-foreground">Toutes les informations pour lancer ton activité légalement</p>
                    </div>
                  </div>

                  <Accordion type="single" collapsible className="space-y-4">
                    <AccordionItem value="creer-facilement" className="border rounded-lg px-6 bg-card">
                      <AccordionTrigger className="text-lg font-semibold hover:no-underline">
                        <div className="flex items-center gap-3">
                          <Building2 className="w-5 h-5 text-primary" />
                          <span>Comment créer son entreprise facilement ?</span>
                        </div>
                      </AccordionTrigger>
                      <AccordionContent className="space-y-6 pt-4">
                        <div className="bg-yellow-500/10 border border-yellow-500/20 rounded-lg p-4">
                          <p className="flex items-start gap-2">
                            <span className="text-lg">💡</span>
                            <span className="text-sm">Dans ce guide, nous t'expliquons comment il est possible de créer ta société de la manière la plus simple et la moins chère possible.</span>
                          </p>
                        </div>

                        <div>
                          <h3 className="text-xl font-bold mb-4">Explication rapide</h3>
                          <p className="mb-4">Créer sa société à partir de <strong>84,15€</strong> ici :</p>
                          
                          <Card className="bg-primary/5">
                            <CardContent className="pt-6">
                              <div className="flex items-start gap-3">
                                <div className="flex-1">
                                  <h4 className="font-semibold mb-2">LegalPlace - Lancez votre société, on s'occupe de tout !</h4>
                                  <p className="text-sm text-muted-foreground mb-3">
                                    Créez votre entreprise simplement et rapidement. Gérez votre juridique et votre comptabilité ultra efficacement.
                                  </p>
                                  <a 
                                    href="https://www.legalplace.fr/creation/landing/creation-entreprise-ads?utm_source=google&utm_medium=cpc&utm_campaign=Cr%C3%A9er%20entreprise&utm_content=Cr%C3%A9ation%20Entreprise%20France&k=%2Bcreation%20%2Bsociete%20%2Bfrance&gad_source=1&gad_campaignid=1444619687&gbraid=0AAAAADkacZmzyP6m_4HfIk1osKVZ0zgZI&gclid=CjwKCAjw6vHHBhBwEiwAq4zvA8snAcyVNVTv4O5rj0W1LZeIDwjavVj8Gga-1X1LaNhu2TKKCjD2txoCzRMQAvD_BwE" 
                                    target="_blank" 
                                    rel="noopener noreferrer"
                                    className="text-primary hover:underline text-sm font-medium"
                                  >
                                    🔗 Créer mon entreprise sur LegalPlace
                                  </a>
                                </div>
                              </div>
                            </CardContent>
                          </Card>
                        </div>

                        <div>
                          <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
                            <span>🤔</span>
                            <span>Comment créer une micro-entreprise ?</span>
                          </h3>
                          
                          <p className="mb-4 font-semibold">Pour créer sa micro-entreprise, il existe deux moyens de le faire :</p>

                          <div className="space-y-6">
                            <div>
                              <h4 className="font-semibold mb-3">Créer sa micro-entreprise soi-même gratuitement :</h4>
                              
                              <p className="mb-3">
                                - Rends-toi sur le site du ministère de l'Économie et des Finances à l'adresse suivante : 
                                <a 
                                  href="https://www.economie.gouv.fr/cedef/fiches-pratiques/micro-entrepreneur-auto-entrepreneur#:~:text=D%C3%A9claration%20d'activit%C3%A9%20en%20ligne,activit%C3%A9%2C%20via%20le%20guichet%20unique." 
                                  target="_blank" 
                                  rel="noopener noreferrer"
                                  className="text-primary hover:underline ml-1"
                                >
                                  lien
                                </a>.
                              </p>

                              <Card className="bg-primary/5 mb-4">
                                <CardContent className="pt-6">
                                  <h5 className="font-semibold mb-2">Comment devenir micro-entrepreneur (auto-entrepreneur) ?</h5>
                                  <p className="text-sm text-muted-foreground mb-3">
                                    Le micro-entrepreneur, ou auto-entrepreneur, bénéficie d'un régime unique et simplifié, destiné à faciliter un début d'activité.
                                  </p>
                                  <a 
                                    href="https://www.economie.gouv.fr/cedef/fiches-pratiques/micro-entrepreneur-auto-entrepreneur#:~:text=D%C3%A9claration%20d'activit%C3%A9%20en%20ligne,activit%C3%A9%2C%20via%20le%20guichet%20unique." 
                                    target="_blank" 
                                    rel="noopener noreferrer"
                                    className="text-primary hover:underline text-sm font-medium inline-flex items-center gap-1"
                                  >
                                    🇫🇷 Ministère de l'Économie et des Finances
                                  </a>
                                </CardContent>
                              </Card>

                              <p className="mb-3">
                                - Crée un compte INPI Connect ou France Connect pour accéder aux prochaines étapes de création de ton entreprise.
                              </p>

                              <p className="mb-3">
                                - Après avoir rempli les formulaires nécessaires en ligne, tu recevras ton numéro de <strong>SIREN</strong> attribué par ta préfecture dans un délai d'une à deux semaines au maximum.
                              </p>

                              <p className="text-sm text-muted-foreground">
                                Ce numéro est indispensable lorsque tu souhaites créer un profil de vendeur sur Amazon ou pour toute autre démarche administrative liée à ton entreprise.
                              </p>
                            </div>

                            <div>
                              <h4 className="font-semibold mb-3 flex items-center gap-2">
                                <span>👨‍💼</span>
                                <span>Créer sa micro-entreprise grâce à un gestionnaire de service :</span>
                              </h4>
                              
                              <p className="mb-4">
                                Nous te recommandons vivement d'utiliser le site internet <strong>LegalPlace</strong>, reconnu dans toute la France pour la qualité de son service de création d'entreprise.
                              </p>

                              <p className="mb-4">
                                En ce qui concerne le prix de ces services, pour une <strong>SARL</strong>, prévois entre <strong>400 et 700 euros</strong> de frais de gestionnaire de service et de frais légaux.
                              </p>

                              <p className="mb-4">
                                Le prix va dépendre du statut que tu vas choisir ainsi que l'activité, dans notre cas, l'achat-revente en ligne de produits diverses.
                              </p>

                              <div className="bg-blue-500/10 border border-blue-500/20 rounded-lg p-4 mb-4">
                                <p className="font-semibold mb-2">💬 Besoin d'aide ?</p>
                                <p className="text-sm">
                                  N'hésite pas à venir en discuter dans le groupe, nous sommes nombreux à avoir des entreprises et nous serons là pour t'aider si tu as des questions !
                                </p>
                              </div>

                              <p className="mb-3">
                                Pour justement bien choisir son statut, nous t'invitons à lire ce prochain guide :
                              </p>

                              <div className="flex items-center gap-2 text-primary font-medium">
                                <span>🏢</span>
                                <span>Les différences entre auto-entrepreneur / SASU</span>
                              </div>
                            </div>
                          </div>
                        </div>

                        <div>
                          <h3 className="text-xl font-bold mb-4">Pour créer sa société, il existe deux moyens de le faire :</h3>

                          <div className="space-y-6">
                            <div>
                              <h4 className="font-semibold mb-4 flex items-center gap-2">
                                <span>👨‍💼</span>
                                <span>Créer son entreprise via un avocat fiscaliste :</span>
                              </h4>

                              <p className="mb-4">
                                Créer une entreprise avec l'aide d'un avocat fiscaliste peut être une excellente décision, surtout si tu veux assurer une bonne gestion fiscale dès le départ.
                              </p>

                              <p className="mb-3 font-semibold">Voici quelques points clé à considérer :</p>

                              <div className="space-y-3 mb-4">
                                <Card>
                                  <CardContent className="pt-6">
                                    <h5 className="font-semibold mb-2">1. Conseils sur la structure juridique :</h5>
                                    <p className="text-sm text-muted-foreground">
                                      Un avocat fiscaliste peut te conseiller sur la meilleure structure juridique pour ton entreprise en fonction de tes besoins spécifiques, qu'il s'agisse d'une SARL, d'une SAS, ou autre.
                                    </p>
                                  </CardContent>
                                </Card>

                                <Card>
                                  <CardContent className="pt-6">
                                    <h5 className="font-semibold mb-2">2. Optimisation fiscale :</h5>
                                    <p className="text-sm text-muted-foreground">
                                      L'avocat fiscaliste peut t'aider à optimiser ta situation fiscale en te conseillant sur les différentes options fiscales disponibles et en élaborant des stratégies pour minimiser ta charge fiscale tout en respectant la législation.
                                    </p>
                                  </CardContent>
                                </Card>

                                <Card>
                                  <CardContent className="pt-6">
                                    <h5 className="font-semibold mb-2">3. Formalités administratives :</h5>
                                    <p className="text-sm text-muted-foreground">
                                      Ils peuvent également t'aider à remplir toutes les formalités administratives nécessaires à la création de votre entreprise, ce qui peut te faire gagner du temps et t'assurer que tout est en ordre.
                                    </p>
                                  </CardContent>
                                </Card>
                              </div>

                              <p className="mb-4">
                                En ce qui concerne les coûts, cela varie énormément des honoraires de ton avocat, de la région où tu habites ou encore même du tarif horaire ou forfaitaire de ton avocat.
                              </p>

                              <p className="mb-4">
                                Si nous devions donner une échelle de prix, comptez entre <strong>700 et 1500€</strong>.
                              </p>

                              <p className="text-sm text-muted-foreground">
                                Concernant le délai de création de votre entreprise, cela dépendra également de ton avocat, mais en règle générale, tu pourras t'attendre à ce que le processus prenne plusieurs semaines.
                              </p>
                            </div>

                            <div>
                              <h4 className="font-semibold mb-4 flex items-center gap-2">
                                <span>👨‍💼</span>
                                <span>Créer son entreprise grâce à un gestionnaire de service :</span>
                              </h4>

                              <p className="mb-4">
                                Nous te recommandons vivement d'utiliser le site internet <strong>LegalPlace</strong> reconnu dans toute la France pour la qualité de son service de création d'entreprise.
                              </p>

                              <p className="mb-4">
                                En ce qui concerne le prix de ces services, pour une <strong>SARL</strong>, prévois entre <strong>400 et 700 euros</strong> de frais de gestionnaire de service et de frais légaux.
                              </p>

                              <p className="mb-4">
                                Le prix va dépendre du statut que tu vas choisir ainsi que l'activité, dans notre cas, l'achat-revente en ligne de produits diverses.
                              </p>

                              <div className="bg-blue-500/10 border border-blue-500/20 rounded-lg p-4 mb-4">
                                <p className="font-semibold mb-2">💬 Besoin d'aide ?</p>
                                <p className="text-sm">
                                  N'hésite pas à venir en discuter dans le groupe, nous sommes nombreux à avoir des entreprises et nous serons là pour t'aider si tu as des questions !
                                </p>
                              </div>

                              <p className="mb-3">
                                Pour justement bien choisir son statut, nous t'invitons à lire ce prochain guide :
                              </p>

                              <div className="flex items-center gap-2 text-primary font-medium">
                                <span>🏢</span>
                                <span>Les différences entre auto-entrepreneur / SASU</span>
                              </div>
                            </div>
                          </div>
                        </div>
                      </AccordionContent>
                    </AccordionItem>

                    <AccordionItem value="ae-ou-sasu" className="border rounded-lg px-6 bg-card">
                      <AccordionTrigger className="text-lg font-semibold hover:no-underline">
                        <div className="flex items-center gap-3">
                          <Target className="w-5 h-5 text-primary" />
                          <span>Les différences entre auto-entrepreneur / SASU</span>
                        </div>
                      </AccordionTrigger>
                      <AccordionContent className="space-y-6 pt-4">
                        <div className="bg-yellow-500/10 border border-yellow-500/20 rounded-lg p-4">
                          <p className="text-sm">
                            Il faut savoir que pour la plupart des statuts, tu peux toi-même créer et rédiger les statuts pour minimiser les coûts, mais si tu n'as aucune connaissance (ce qui est normal), évite absolument ! Passe plutôt par une entreprise spécialisée ou par un avocat fiscaliste.
                          </p>
                        </div>

                        <div className="space-y-6">
                          <Card className="bg-primary/5">
                            <CardHeader>
                              <CardTitle className="text-base flex items-center gap-2">
                                <span>👨‍⚖️</span>
                                <span>Micro Entrepreneur (Auto-entrepreneur)</span>
                              </CardTitle>
                            </CardHeader>
                            <CardContent className="text-sm space-y-2">
                              <p>Si tu veux commencer pour tester et sans investir trop d'argent dans ton entreprise, c'est un bon début !</p>
                              <p className="font-medium text-amber-600 dark:text-amber-400">
                                ⚠️ Cependant ce n'est pas le meilleur choix à la longue, tu vas être limité et surtout un manque à gagner important, car tu ne récupères pas la TVA !
                              </p>
                            </CardContent>
                          </Card>

                          <Card className="bg-primary/5">
                            <CardHeader>
                              <CardTitle className="text-base flex items-center gap-2">
                                <span>🏢</span>
                                <span>SAS (Société par Actions Simplifiée)</span>
                              </CardTitle>
                            </CardHeader>
                            <CardContent className="text-sm space-y-3">
                              <p>Une SAS est l'une des formes juridiques les plus réputées pour le commerce. Elle se caractérise essentiellement par sa souplesse de fonctionnement.</p>
                              
                              <div className="bg-red-500/10 border border-red-500/20 rounded-lg p-3">
                                <p className="font-semibold mb-1">🚨 Informations importantes :</p>
                                <p className="text-xs">Tu peux créer une SAS à partir de 2 actionnaires, tu peux choisir ton capital social, rien n'est imposé par la loi, tu peux déposer 1€ symbolique.</p>
                              </div>

                              <p>Tu peux être le seul actionnaire d'une SAS, on parle alors d'une <strong>SASU (Société par Actions Simplifiée Unipersonnelle)</strong>.</p>
                              <p className="font-medium">(Si tu es seul à créer ton entreprise alors oui il vaut mieux privilégier une SASU).</p>

                              <div className="mt-4">
                                <p className="font-semibold mb-2">Avantages de la SAS/SASU :</p>
                                <ul className="list-disc list-inside space-y-1 text-xs">
                                  <li>Capital social à partir de 1€</li>
                                  <li>De faibles obligations légales</li>
                                  <li>Un régime fiscal avantageux (La SASU est soumise par défaut au régime fiscal de l'impôt sur les sociétés (IS). Les bénéfices sont imposés à un taux de 15% jusqu'à 42 500€, puis 25% au-delà)</li>
                                </ul>
                                <p className="text-xs mt-2">La SASU est souvent choisie pour sa flexibilité et son régime fiscal avantageux pour les entreprises en croissance.</p>
                              </div>

                              <div className="mt-4">
                                <p className="font-semibold mb-2">😬 Inconvénients :</p>
                                <ul className="list-disc list-inside space-y-1 text-xs">
                                  <li>Frais de constitution élevés</li>
                                  <li>Une extrême rigueur dans la rédaction des statuts (Il faut des connaissances et passer par des professionnels comme un avocat fiscaliste ou une entreprise comme LegalPlace)</li>
                                  <li>Tu ne vas pas cotiser, alors qu'en SARL il y a un minimum obligatoire pour la cotisation</li>
                                </ul>
                              </div>
                            </CardContent>
                          </Card>

                          <Card className="bg-primary/5">
                            <CardHeader>
                              <CardTitle className="text-base flex items-center gap-2">
                                <span>🤔</span>
                                <span>La différence entre SARL et EURL</span>
                              </CardTitle>
                            </CardHeader>
                            <CardContent className="text-sm space-y-3">
                              <div>
                                <p className="font-semibold mb-1">SARL (Société à Responsabilité Limitée) :</p>
                                <ul className="list-disc list-inside space-y-1 text-xs text-muted-foreground">
                                  <li>Une société commerciale constituée de deux associés au minimum et de cent associés au maximum</li>
                                  <li>La responsabilité des associés est limitée au montant de leurs apports dans la société</li>
                                  <li>Souvent choisie pour sa simplicité de fonctionnement et son cadre juridique bien établi</li>
                                </ul>
                              </div>

                              <div>
                                <p className="font-semibold mb-1">EURL (Entreprise Unipersonnelle à Responsabilité Limitée) :</p>
                                <ul className="list-disc list-inside space-y-1 text-xs text-muted-foreground">
                                  <li>Une EURL est une SARL avec un seul associé</li>
                                  <li>Offre une responsabilité limitée pour l'associé unique, qui n'est responsable qu'à concurrence de ses apports</li>
                                  <li>Son fonctionnement est similaire à celui d'une SARL, avec un gérant qui peut être l'associé unique ou une autre personne</li>
                                </ul>
                              </div>

                              <p className="mt-3 text-xs">
                                <strong>En résumé :</strong> La principale différence réside dans le nombre d'associés et la structure de gouvernance, avec la SASU étant la plus flexible et la mieux adaptée aux entreprises individuelles, tandis que la SARL peut accueillir plusieurs associés et offre une structure plus traditionnelle.
                              </p>
                            </CardContent>
                          </Card>

                          <Card className="bg-primary/5">
                            <CardHeader>
                              <CardTitle className="text-base flex items-center gap-2">
                                <span>🌍</span>
                                <span>LTD (Limited Company)</span>
                              </CardTitle>
                            </CardHeader>
                            <CardContent className="text-sm">
                              <p>Une LTD est une forme juridique d'entreprise qui est intéressante à l'étranger, mais il vaut mieux commencer avec une SAS/SARL en France.</p>
                            </CardContent>
                          </Card>

                          <div className="bg-blue-500/10 border border-blue-500/20 rounded-lg p-4">
                            <p className="font-semibold mb-2">💭 Autres paramètres à considérer :</p>
                            <ul className="list-disc list-inside space-y-1 text-sm">
                              <li>Est-ce que tu vas vivre grâce à cette activité ?</li>
                              <li>Les bénéfices que tu estimes atteindre</li>
                              <li>Auras-tu qu'une seule activité professionnelle pour ta société ?</li>
                            </ul>
                          </div>

                          <div className="bg-green-500/10 border border-green-500/20 rounded-lg p-4">
                            <p className="font-semibold text-green-700 dark:text-green-400 mb-2">👨‍⚖️ Recommandation</p>
                            <p className="text-sm">
                              Il faut bien se renseigner et poser des questions sur le groupe, mais il est préférable d'opter pour une <strong>SASU ou EURL</strong>.
                            </p>
                          </div>
                        </div>

                        <div>
                          <h3 className="text-lg font-bold mb-4">📊 Tableau comparatif</h3>
                          <div className="overflow-x-auto">
                            <table className="w-full text-sm border-collapse border">
                              <thead>
                                <tr className="border-b bg-muted/50">
                                  <th className="text-left py-3 px-4 border-r">Critère</th>
                                  <th className="text-left py-3 px-4 border-r">Auto-entrepreneur</th>
                                  <th className="text-left py-3 px-4">SASU</th>
                                </tr>
                              </thead>
                              <tbody>
                                <tr className="border-b">
                                  <td className="py-3 px-4 font-medium border-r">Création</td>
                                  <td className="py-3 px-4 text-muted-foreground border-r">Gratuite et rapide</td>
                                  <td className="py-3 px-4 text-muted-foreground">Payante (200-500 €)</td>
                                </tr>
                                <tr className="border-b">
                                  <td className="py-3 px-4 font-medium border-r">Plafond CA</td>
                                  <td className="py-3 px-4 text-muted-foreground border-r">188 700 €</td>
                                  <td className="py-3 px-4 text-muted-foreground">Illimité</td>
                                </tr>
                                <tr className="border-b">
                                  <td className="py-3 px-4 font-medium border-r">TVA</td>
                                  <td className="py-3 px-4 text-muted-foreground border-r">Franchise si &lt; 36 800 €</td>
                                  <td className="py-3 px-4 text-muted-foreground">Obligatoire dès le début</td>
                                </tr>
                                <tr className="border-b">
                                  <td className="py-3 px-4 font-medium border-r">Comptabilité</td>
                                  <td className="py-3 px-4 text-muted-foreground border-r">Simplifiée</td>
                                  <td className="py-3 px-4 text-muted-foreground">Expert-comptable requis</td>
                                </tr>
                                <tr>
                                  <td className="py-3 px-4 font-medium border-r">Idéal pour</td>
                                  <td className="py-3 px-4 text-muted-foreground border-r">Débutants, side-business</td>
                                  <td className="py-3 px-4 text-muted-foreground">Gros volumes, professionnels</td>
                                </tr>
                              </tbody>
                            </table>
                          </div>
                        </div>
                      </AccordionContent>
                    </AccordionItem>

                    <AccordionItem value="profil-pro" className="border rounded-lg px-6 bg-card">
                      <AccordionTrigger className="text-lg font-semibold hover:no-underline">
                        <div className="flex items-center gap-3">
                          <Store className="w-5 h-5 text-primary" />
                          <span>Créer son profil professionnel</span>
                        </div>
                      </AccordionTrigger>
                      <AccordionContent className="space-y-4 pt-4">
                        <p>Une fois ton entreprise créée, tu dois professionnaliser ton image. Voici ce qu'il te faut :</p>
                        
                        <div className="space-y-3">
                          <Card>
                            <CardHeader className="pb-3">
                              <CardTitle className="text-base flex items-center gap-2">
                                <CheckCircle2 className="w-4 h-4 text-primary" />
                                Compte bancaire professionnel
                              </CardTitle>
                            </CardHeader>
                            <CardContent className="text-sm text-muted-foreground space-y-2">
                              <p>Obligatoire si ton CA dépasse 10 000 €/an (mais conseillé dès le début).</p>
                              <p className="font-medium">Banques recommandées : Shine, Qonto, N26 Business</p>
                            </CardContent>
                          </Card>

                          <Card>
                            <CardHeader className="pb-3">
                              <CardTitle className="text-base flex items-center gap-2">
                                <CheckCircle2 className="w-4 h-4 text-primary" />
                                Email professionnel
                              </CardTitle>
                            </CardHeader>
                            <CardContent className="text-sm text-muted-foreground">
                              <p>Utilise une adresse type contact@tonentreprise.com pour paraître plus sérieux.</p>
                            </CardContent>
                          </Card>

                          <Card>
                            <CardHeader className="pb-3">
                              <CardTitle className="text-base flex items-center gap-2">
                                <CheckCircle2 className="w-4 h-4 text-primary" />
                                Logo et identité visuelle
                              </CardTitle>
                            </CardHeader>
                            <CardContent className="text-sm text-muted-foreground">
                              <p>Pas obligatoire pour débuter, mais crée une meilleure impression auprès d'Amazon et des clients.</p>
                            </CardContent>
                          </Card>
                        </div>
                      </AccordionContent>
                    </AccordionItem>
                  </Accordion>
                </section>
              </TabsContent>

              {/* ========== ONGLET VENDRE ========== */}
              <TabsContent value="vendre" className="space-y-8">
                <section>
                  <div className="flex items-center gap-3 mb-6">
                    <div className="p-3 rounded-lg bg-primary/10">
                      <Store className="w-8 h-8 text-primary" />
                    </div>
                    <div>
                      <h2 className="text-3xl font-bold">Commencer à vendre</h2>
                      <p className="text-muted-foreground">Guide complet pour lancer tes premières ventes sur Amazon</p>
                    </div>
                  </div>

                  <Accordion type="single" collapsible className="space-y-4">
                    <AccordionItem value="compte-seller" className="border rounded-lg px-6 bg-card">
                      <AccordionTrigger className="text-lg font-semibold hover:no-underline">
                        <div className="flex items-center gap-3">
                          <Store className="w-5 h-5 text-primary" />
                          <span>Ouvrir ton compte Amazon Seller</span>
                        </div>
                      </AccordionTrigger>
                      <AccordionContent className="space-y-4 pt-4">
                        <p>Pour commencer à vendre, tu dois créer un compte vendeur Amazon. Voici les étapes :</p>
                        
                        <div className="space-y-4">
                          <div>
                            <h4 className="font-semibold mb-2">📝 Ce dont tu as besoin :</h4>
                            <ul className="list-disc list-inside space-y-1 text-sm text-muted-foreground">
                              <li>Une adresse email professionnelle</li>
                              <li>Un numéro de téléphone valide</li>
                              <li>Une carte bancaire internationale (Visa ou Mastercard)</li>
                              <li>Les informations de ton entreprise (SIRET, adresse, etc.)</li>
                              <li>Une pièce d'identité valide</li>
                              <li>Un relevé bancaire récent (moins de 3 mois)</li>
                            </ul>
                          </div>

                          <Card className="bg-primary/5">
                            <CardHeader>
                              <CardTitle className="text-base">💰 Coûts d'un compte vendeur</CardTitle>
                            </CardHeader>
                            <CardContent className="text-sm space-y-2">
                              <p><strong>Abonnement mensuel :</strong> 39 € HT/mois</p>
                              <p><strong>Frais de vente :</strong> Variable selon la catégorie (8% à 15% du prix de vente)</p>
                              <p><strong>Frais FBA :</strong> Stockage + expédition (dépend de la taille du produit)</p>
                            </CardContent>
                          </Card>

                          <div className="bg-amber-500/10 border border-amber-500/20 rounded-lg p-4">
                            <p className="font-semibold text-amber-700 dark:text-amber-400">⚠️ Important</p>
                            <p className="text-sm mt-2">Le processus de vérification peut prendre 24 à 48h. Assure-toi d'avoir tous les documents prêts avant de commencer.</p>
                          </div>
                        </div>
                      </AccordionContent>
                    </AccordionItem>

                    <AccordionItem value="mettre-en-vente" className="border rounded-lg px-6 bg-card">
                      <AccordionTrigger className="text-lg font-semibold hover:no-underline">
                        <div className="flex items-center gap-3">
                          <Package className="w-5 h-5 text-primary" />
                          <span>Mettre en vente tes produits</span>
                        </div>
                      </AccordionTrigger>
                      <AccordionContent className="space-y-4 pt-4">
                        <p>Une fois ton compte vendeur actif, voici comment mettre tes produits en ligne :</p>
                        
                        <div className="space-y-4">
                          <div>
                            <h4 className="font-semibold mb-3">Les étapes :</h4>
                            <div className="space-y-3">
                              <Card>
                                <CardHeader className="pb-3">
                                  <CardTitle className="text-base">1️⃣ Recherche le produit sur Amazon</CardTitle>
                                </CardHeader>
                                <CardContent className="text-sm text-muted-foreground">
                                  Utilise le code-barres (EAN) ou le nom du produit pour trouver la fiche existante.
                                </CardContent>
                              </Card>

                              <Card>
                                <CardHeader className="pb-3">
                                  <CardTitle className="text-base">2️⃣ Crée ton offre</CardTitle>
                                </CardHeader>
                                <CardContent className="text-sm text-muted-foreground">
                                  Fixe ton prix, indique la quantité disponible et choisis le mode d'expédition (FBA ou FBM).
                                </CardContent>
                              </Card>

                              <Card>
                                <CardHeader className="pb-3">
                                  <CardTitle className="text-base">3️⃣ Envoie tes produits en FBA</CardTitle>
                                </CardHeader>
                                <CardContent className="text-sm text-muted-foreground">
                                  Crée un envoi FBA, imprime les étiquettes et envoie ton stock à l'entrepôt Amazon.
                                </CardContent>
                              </Card>

                              <Card>
                                <CardHeader className="pb-3">
                                  <CardTitle className="text-base">4️⃣ Amazon gère tout</CardTitle>
                                </CardHeader>
                                <CardContent className="text-sm text-muted-foreground">
                                  Une fois reçu, Amazon stocke, emballe et expédie tes produits automatiquement.
                                </CardContent>
                              </Card>
                            </div>
                          </div>

                          <div className="bg-blue-500/10 border border-blue-500/20 rounded-lg p-4">
                            <p className="font-semibold">💡 Astuce</p>
                            <p className="text-sm mt-2">Commence avec 3 à 5 produits pour tester le processus avant de te lancer à grande échelle.</p>
                          </div>
                        </div>
                      </AccordionContent>
                    </AccordionItem>
                  </Accordion>
                </section>
              </TabsContent>

              {/* ========== ONGLET OUTILS ========== */}
              <TabsContent value="outils" className="space-y-8">
                <section>
                  <div className="flex items-center gap-3 mb-6">
                    <div className="p-3 rounded-lg bg-primary/10">
                      <Wrench className="w-8 h-8 text-primary" />
                    </div>
                    <div>
                      <h2 className="text-3xl font-bold">Les outils indispensables</h2>
                      <p className="text-muted-foreground">Les meilleurs outils pour optimiser ton activité Amazon FBA</p>
                    </div>
                  </div>

                  <Accordion type="single" collapsible className="space-y-4">
                    <AccordionItem value="outils-essentiels" className="border rounded-lg px-6 bg-card">
                      <AccordionTrigger className="text-lg font-semibold hover:no-underline">
                        <div className="flex items-center gap-3">
                          <Wrench className="w-5 h-5 text-primary" />
                          <span>Les outils indispensables</span>
                        </div>
                      </AccordionTrigger>
                      <AccordionContent className="space-y-4 pt-4">
                        <p>Pour réussir en FBA, tu as besoin de ces outils essentiels :</p>
                        
                        <div className="space-y-4">
                          <Card className="bg-primary/5">
                            <CardHeader>
                              <CardTitle className="text-base">🔍 Keepa</CardTitle>
                            </CardHeader>
                            <CardContent className="text-sm space-y-2">
                              <p className="font-medium">Suivi des prix et de l'historique des ventes</p>
                              <p className="text-muted-foreground">Indispensable pour analyser si un produit se vend bien et à quel prix.</p>
                              <p className="text-primary font-medium">Prix : ~19 €/mois</p>
                            </CardContent>
                          </Card>

                          <Card className="bg-primary/5">
                            <CardHeader>
                              <CardTitle className="text-base">📱 Application Amazon Seller</CardTitle>
                            </CardHeader>
                            <CardContent className="text-sm space-y-2">
                              <p className="font-medium">Scanner de codes-barres en magasin</p>
                              <p className="text-muted-foreground">Scanne les produits en boutique pour voir s'ils sont rentables avant d'acheter.</p>
                              <p className="text-primary font-medium">Prix : Gratuit</p>
                            </CardContent>
                          </Card>

                          <Card className="bg-primary/5">
                            <CardHeader>
                              <CardTitle className="text-base">💰 Calculateur de frais Amazon</CardTitle>
                            </CardHeader>
                            <CardContent className="text-sm space-y-2">
                              <p className="font-medium">Estime tes marges nettes</p>
                              <p className="text-muted-foreground">Calcule automatiquement tous les frais (FBA, commission, TVA) pour connaître ton bénéfice réel.</p>
                              <p className="text-primary font-medium">Prix : Gratuit (intégré à Seller Central)</p>
                            </CardContent>
                          </Card>

                          <Card className="bg-primary/5">
                            <CardHeader>
                              <CardTitle className="text-base">📊 Helium 10 / Jungle Scout</CardTitle>
                            </CardHeader>
                            <CardContent className="text-sm space-y-2">
                              <p className="font-medium">Recherche avancée de produits</p>
                              <p className="text-muted-foreground">Pour ceux qui veulent aller plus loin dans l'analyse de produits et la recherche de niches.</p>
                              <p className="text-primary font-medium">Prix : À partir de 39 €/mois</p>
                            </CardContent>
                          </Card>

                          <Card className="bg-primary/5">
                            <CardHeader>
                              <CardTitle className="text-base">🏷️ Étiqueteuse thermique</CardTitle>
                            </CardHeader>
                            <CardContent className="text-sm space-y-2">
                              <p className="font-medium">Imprime tes étiquettes FBA</p>
                              <p className="text-muted-foreground">Gain de temps énorme pour préparer tes envois Amazon.</p>
                              <p className="text-primary font-medium">Prix : 100-200 € (Rollo, Munbyn)</p>
                            </CardContent>
                          </Card>
                        </div>
                      </AccordionContent>
                    </AccordionItem>

                    <AccordionItem value="sourcing" className="border rounded-lg px-6 bg-card">
                      <AccordionTrigger className="text-lg font-semibold hover:no-underline">
                        <div className="flex items-center gap-3">
                          <Search className="w-5 h-5 text-primary" />
                          <span>Où trouver des produits à revendre ?</span>
                        </div>
                      </AccordionTrigger>
                      <AccordionContent className="space-y-4 pt-4">
                        <p>Voici les meilleurs endroits pour sourcer tes produits :</p>
                        
                        <div className="space-y-3">
                          <Card>
                            <CardHeader className="pb-3">
                              <CardTitle className="text-base">🏬 Grandes surfaces (Auchan, Leclerc, Carrefour)</CardTitle>
                            </CardHeader>
                            <CardContent className="text-sm text-muted-foreground">
                              Promotions, déstockages, fins de série. Idéal pour les débutants.
                            </CardContent>
                          </Card>

                          <Card>
                            <CardHeader className="pb-3">
                              <CardTitle className="text-base">🛍️ Magasins discount (Action, Gifi, La Foir'Fouille)</CardTitle>
                            </CardHeader>
                            <CardContent className="text-sm text-muted-foreground">
                              Produits à très bas prix. Attention à la qualité.
                            </CardContent>
                          </Card>

                          <Card>
                            <CardHeader className="pb-3">
                              <CardTitle className="text-base">💻 Sites e-commerce (Cdiscount, Rue du Commerce, Fnac)</CardTitle>
                            </CardHeader>
                            <CardContent className="text-sm text-muted-foreground">
                              Ventes flash, codes promo. Gain de temps, pas besoin de se déplacer.
                            </CardContent>
                          </Card>

                          <Card>
                            <CardHeader className="pb-3">
                              <CardTitle className="text-base">🏭 Grossistes (Alibaba, made-in-china.com)</CardTitle>
                            </CardHeader>
                            <CardContent className="text-sm text-muted-foreground">
                              Pour acheter en gros volume. Réservé aux vendeurs avec un budget plus élevé.
                            </CardContent>
                          </Card>

                          <Card>
                            <CardHeader className="pb-3">
                              <CardTitle className="text-base">📦 Liquidations et déstockages</CardTitle>
                            </CardHeader>
                            <CardContent className="text-sm text-muted-foreground">
                              Sites comme Destockplus, B-Stock. Opportunités intéressantes mais risque plus élevé.
                            </CardContent>
                          </Card>
                        </div>

                        <div className="bg-green-500/10 border border-green-500/20 rounded-lg p-4">
                          <p className="font-semibold text-green-700 dark:text-green-400">✅ Conseil</p>
                          <p className="text-sm mt-2">Combine plusieurs sources pour maximiser tes chances de trouver des produits rentables.</p>
                        </div>
                      </AccordionContent>
                    </AccordionItem>
                  </Accordion>
                </section>
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Guides;