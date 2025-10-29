import { ArrowLeft, CheckCircle2, TrendingUp, Euro, Package, Store, Shield, Clock, Target, Building2, Wrench, BookOpen, GraduationCap, Search, Users, CreditCard, ShoppingCart, TrendingDown, AlertTriangle } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { Capacitor } from '@capacitor/core';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import processFlow from '@/assets/amazon-process-flow.png';

const Guides = () => {
  const navigate = useNavigate();
  const isNativeApp = Capacitor.isNativePlatform();

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <button
        onClick={() => navigate('/dashboard')}
        className="fixed top-[46px] left-[18px] z-50 bg-primary/90 backdrop-blur-sm p-2 rounded-full shadow-lg hover:bg-primary transition-all"
        aria-label="Retour"
      >
        <ArrowLeft className="w-5 h-5 text-primary-foreground" />
      </button>
      <main className="flex-grow pt-20">
        <div className="container mx-auto px-4 py-8">
          <div className="max-w-6xl mx-auto">
            {!isNativeApp && (
              <Link 
                to="/dashboard" 
                className="inline-flex items-center gap-2 text-muted-foreground hover:text-primary mb-6 transition-colors"
              >
                <ArrowLeft className="w-4 h-4" />
                Retour à l'Espace VIP
              </Link>
            )}

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
                        Service d'Amazon qui gère le stockage, l'emballage et l'expédition de tes produits.
                      </CardContent>
                    </Card>

                    <Card>
                      <CardHeader>
                        <CardTitle className="text-base">🚚 FBM (Fulfillment by Merchant)</CardTitle>
                      </CardHeader>
                      <CardContent className="text-sm text-muted-foreground">
                        Tu gères toi-même le stockage et l'expédition de tes produits.
                      </CardContent>
                    </Card>

                    <Card>
                      <CardHeader>
                        <CardTitle className="text-base">🔍 ASIN</CardTitle>
                      </CardHeader>
                      <CardContent className="text-sm text-muted-foreground">
                        Code unique à 10 caractères attribué par Amazon à chaque produit.
                      </CardContent>
                    </Card>

                    <Card>
                      <CardHeader>
                        <CardTitle className="text-base">📊 Buy Box</CardTitle>
                      </CardHeader>
                      <CardContent className="text-sm text-muted-foreground">
                        L'encadré "Ajouter au panier" qui génère 80% des ventes.
                      </CardContent>
                    </Card>

                    <Card>
                      <CardHeader>
                        <CardTitle className="text-base">💰 ROI (Return on Investment)</CardTitle>
                      </CardHeader>
                      <CardContent className="text-sm text-muted-foreground">
                        Retour sur investissement. Un bon ROI en FBA est d'au moins 40-50%.
                      </CardContent>
                    </Card>

                    <Card>
                      <CardHeader>
                        <CardTitle className="text-base">📈 BSR (Best Seller Rank)</CardTitle>
                      </CardHeader>
                      <CardContent className="text-sm text-muted-foreground">
                        Classement des meilleures ventes. Plus le chiffre est bas, mieux ça vend.
                      </CardContent>
                    </Card>
                  </div>
                </section>
              </TabsContent>

              {/* ========== ONGLET ENTREPRISE ========== */}
              <TabsContent value="entreprise" className="space-y-8">
                
                <Accordion type="single" collapsible className="space-y-4">
                  
                  {/* Créer son entreprise facilement */}
                  <AccordionItem value="creer-entreprise" className="border rounded-lg px-6 bg-card">
                    <AccordionTrigger className="text-lg font-semibold hover:no-underline">
                      <div className="flex items-center gap-3">
                        <Building2 className="w-5 h-5 text-primary" />
                        <span>Créer son entreprise facilement</span>
                      </div>
                    </AccordionTrigger>
                    <AccordionContent className="space-y-6 pt-4">
                      <div className="prose prose-sm max-w-none">
                        <h3 className="text-xl font-bold mb-4">Comment démarrer simplement et à moindre coût</h3>
                        
                        <p className="mb-4">
                          Pour vendre sur Amazon, tu dois posséder une structure juridique (micro-entreprise, SASU, SARL, etc.). 
                          La bonne nouvelle ? C'est aujourd'hui plus simple et abordable que jamais !
                        </p>

                        <div className="bg-primary/5 border-l-4 border-primary p-4 my-6">
                          <h4 className="font-semibold mb-2">📌 Notre recommandation : LegalPlace</h4>
                          <p className="mb-2">
                            Pour créer ton entreprise rapidement et sans complications, nous te conseillons d'utiliser LegalPlace.
                          </p>
                          <a 
                            href="https://www.legalplace.fr/creation/landing/creation-entreprise-ads?utm_source=google&utm_medium=cpc&utm_campaign=Cr%C3%A9er%20entreprise&utm_content=Cr%C3%A9ation%20Entreprise%20France&k=%2Bcreation%20%2Bsociete%20%2Bfrance&gad_source=1&gad_campaignid=1444619687&gbraid=0AAAAADkacZmzyP6m_4HfIk1osKVZ0zgZI&gclid=CjwKCAjw6vHHBhBwEiwAq4zvA8snAcyVNVTv4O5rj0W1LZeIDwjavVj8Gga-1X1LaNhu2TKKCjD2txoCzRMQAvD_BwE" 
                            target="_blank" 
                            rel="noopener noreferrer"
                            className="text-primary hover:underline font-medium"
                          >
                            → Créer mon entreprise avec LegalPlace
                          </a>
                        </div>

                        <h4 className="text-lg font-semibold mt-6 mb-3">Option 1 : Créer une micro-entreprise seul (gratuit)</h4>
                        <p className="mb-3">
                          Si tu souhaites créer ton statut de micro-entrepreneur toi-même, c'est totalement possible et gratuit !
                        </p>
                        <p className="mb-2">
                          Il suffit de te rendre sur le site officiel du gouvernement et de suivre les étapes :
                        </p>
                        <a 
                          href="https://www.economie.gouv.fr/cedef/fiches-pratiques/micro-entrepreneur-auto-entrepreneur#:~:text=D%C3%A9claration%20d'activit%C3%A9%20en%20ligne,activit%C3%A9%2C%20via%20le%20guichet%20unique." 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="text-primary hover:underline mb-4 inline-block"
                        >
                          → Déclarer mon activité de micro-entrepreneur
                        </a>

                        <h4 className="text-lg font-semibold mt-6 mb-3">Option 2 : Passer par un gestionnaire de service</h4>
                        <p className="mb-3">
                          Si tu préfères déléguer cette tâche administrative pour gagner du temps et éviter les erreurs, tu peux utiliser 
                          des services comme LegalPlace. Ils s'occupent de toutes les démarches pour toi moyennant des frais raisonnables.
                        </p>

                        <h4 className="text-lg font-semibold mt-6 mb-3">Option 3 : Créer une société via un expert-comptable</h4>
                        <p className="mb-3">
                          Pour des structures plus complexes (SASU, SARL, etc.), il peut être judicieux de faire appel à un expert-comptable 
                          qui pourra te guider et s'assurer que tout est conforme aux réglementations en vigueur.
                        </p>

                        <div className="bg-amber-50 dark:bg-amber-950/20 border border-amber-200 dark:border-amber-800 rounded-lg p-4 mt-6">
                          <p className="text-sm">
                            💡 <strong>Conseil :</strong> Quelle que soit l'option choisie, assure-toi d'avoir tous les documents nécessaires 
                            (pièce d'identité, justificatif de domicile, etc.) avant de commencer les démarches.
                          </p>
                        </div>
                      </div>
                    </AccordionContent>
                  </AccordionItem>

                  {/* Auto-entrepreneur ou SASU */}
                  <AccordionItem value="auto-sasu" className="border rounded-lg px-6 bg-card">
                    <AccordionTrigger className="text-lg font-semibold hover:no-underline">
                      <div className="flex items-center gap-3">
                        <Target className="w-5 h-5 text-primary" />
                        <span>Auto-entrepreneur ou SASU : Que choisir ?</span>
                      </div>
                    </AccordionTrigger>
                    <AccordionContent className="space-y-6 pt-4">
                      <div className="prose prose-sm max-w-none">
                        <h3 className="text-xl font-bold mb-4">Les différences entre les statuts juridiques</h3>
                        
                        <h4 className="text-lg font-semibold mt-6 mb-3">1. Micro-entrepreneur (anciennement Auto-entrepreneur)</h4>
                        <div className="space-y-2 mb-4">
                          <p><strong>Avantages :</strong></p>
                          <ul className="list-disc pl-6 space-y-1">
                            <li>Création simple et gratuite</li>
                            <li>Comptabilité allégée</li>
                            <li>Pas de TVA à collecter jusqu'à un certain seuil</li>
                            <li>Charges sociales proportionnelles au chiffre d'affaires</li>
                          </ul>
                          <p className="mt-3"><strong>Inconvénients :</strong></p>
                          <ul className="list-disc pl-6 space-y-1">
                            <li>Plafond de CA limité (188 700 € pour la vente)</li>
                            <li>Patrimoine personnel non protégé</li>
                            <li>Difficile de lever des fonds</li>
                            <li>Moins crédible auprès des fournisseurs</li>
                          </ul>
                        </div>

                        <h4 className="text-lg font-semibold mt-6 mb-3">2. SAS / SASU (Société par Actions Simplifiée)</h4>
                        <div className="space-y-2 mb-4">
                          <p><strong>Avantages :</strong></p>
                          <ul className="list-disc pl-6 space-y-1">
                            <li>Patrimoine personnel protégé</li>
                            <li>Possibilité de s'associer facilement</li>
                            <li>Crédibilité professionnelle accrue</li>
                            <li>Déduction des frais réels (bureau, matériel, etc.)</li>
                            <li>Optimisation fiscale possible</li>
                          </ul>
                          <p className="mt-3"><strong>Inconvénients :</strong></p>
                          <ul className="list-disc pl-6 space-y-1">
                            <li>Coûts de création plus élevés (environ 200-500€)</li>
                            <li>Comptabilité obligatoire avec expert-comptable</li>
                            <li>Charges sociales minimales même sans CA</li>
                            <li>Formalités administratives plus lourdes</li>
                          </ul>
                        </div>

                        <h4 className="text-lg font-semibold mt-6 mb-3">3. SARL vs EURL</h4>
                        <p className="mb-3">
                          Structure similaire à la SAS mais avec plus de rigidité. Convient surtout aux projets familiaux 
                          ou entre associés de confiance. L'EURL est la version à associé unique.
                        </p>

                        <h4 className="text-lg font-semibold mt-6 mb-3">4. LTD (pour vendre à l'international)</h4>
                        <p className="mb-3">
                          Société britannique qui peut être intéressante pour certains vendeurs Amazon visant plusieurs marchés européens. 
                          Nécessite des démarches spécifiques.
                        </p>

                        {/* Tableau comparatif */}
                        <div className="my-8 overflow-x-auto">
                          <table className="min-w-full border-collapse border border-border">
                            <thead>
                              <tr className="bg-muted">
                                <th className="border border-border p-3 text-left font-semibold">Critère</th>
                                <th className="border border-border p-3 text-left font-semibold">Auto-entrepreneur</th>
                                <th className="border border-border p-3 text-left font-semibold">SASU</th>
                              </tr>
                            </thead>
                            <tbody>
                              <tr>
                                <td className="border border-border p-3">Création</td>
                                <td className="border border-border p-3">Gratuite et rapide</td>
                                <td className="border border-border p-3">200-500€ + frais</td>
                              </tr>
                              <tr className="bg-muted/30">
                                <td className="border border-border p-3">Plafond CA</td>
                                <td className="border border-border p-3">188 700€/an</td>
                                <td className="border border-border p-3">Illimité</td>
                              </tr>
                              <tr>
                                <td className="border border-border p-3">Comptabilité</td>
                                <td className="border border-border p-3">Simplifiée</td>
                                <td className="border border-border p-3">Expert-comptable obligatoire</td>
                              </tr>
                              <tr className="bg-muted/30">
                                <td className="border border-border p-3">Protection patrimoine</td>
                                <td className="border border-border p-3">Non</td>
                                <td className="border border-border p-3">Oui</td>
                              </tr>
                              <tr>
                                <td className="border border-border p-3">Charges sociales</td>
                                <td className="border border-border p-3">12,8% du CA</td>
                                <td className="border border-border p-3">Sur salaire versé</td>
                              </tr>
                              <tr className="bg-muted/30">
                                <td className="border border-border p-3">Crédibilité</td>
                                <td className="border border-border p-3">Moyenne</td>
                                <td className="border border-border p-3">Élevée</td>
                              </tr>
                            </tbody>
                          </table>
                        </div>

                        <div className="bg-primary/5 border-l-4 border-primary p-4 mt-6">
                          <p className="font-semibold mb-2">💡 Notre recommandation :</p>
                          <ul className="list-disc pl-6 space-y-1 text-sm">
                            <li><strong>Micro-entrepreneur :</strong> Si tu débutes avec moins de 1000€ de budget et veux tester</li>
                            <li><strong>SASU :</strong> Si tu vises un CA &gt; 50k€/an ou veux protéger ton patrimoine</li>
                          </ul>
                        </div>
                      </div>
                    </AccordionContent>
                  </AccordionItem>

                  {/* Se créer un profil professionnel */}
                  <AccordionItem value="profil-pro" className="border rounded-lg px-6 bg-card">
                    <AccordionTrigger className="text-lg font-semibold hover:no-underline">
                      <div className="flex items-center gap-3">
                        <Users className="w-5 h-5 text-primary" />
                        <span>Se créer un profil professionnel</span>
                      </div>
                    </AccordionTrigger>
                    <AccordionContent className="space-y-6 pt-4">
                      <div className="prose prose-sm max-w-none">
                        <h3 className="text-xl font-bold mb-4">Une étape cruciale pour ton succès sur Amazon</h3>
                        
                        <p className="mb-4">
                          Lors de la création de ton compte vendeur Amazon, il est primordial de soigner ton identité professionnelle. 
                          Un bon nom, une adresse email sérieuse... tout compte pour inspirer confiance !
                        </p>

                        <h4 className="text-lg font-semibold mt-6 mb-3">1. Choisir ton nom de boutique</h4>
                        <p className="mb-3">
                          Amazon te demandera de définir un nom de boutique. C'est ce nom qui apparaîtra sur les commandes de tes clients. 
                          Un nom professionnel et rassurant peut vraiment faire la différence dans la décision d'achat !
                        </p>

                        <p className="mb-3">
                          Comme tu peux le constater, avoir un nom clair et professionnel permet de vendre davantage, 
                          car ton identité inspire confiance et donne plus envie d'acheter chez toi plutôt qu'ailleurs.
                        </p>

                        <p className="mb-3">
                          Lorsqu'un client achète sur Amazon, la Buy Box affiche l'expédition via Amazon (FBA) et l'expédition par les vendeurs (FBM). 
                          Amazon met naturellement plus en avant l'expédition par Amazon que celle gérée par nous, les vendeurs. 
                          D'où l'importance d'avoir un nom vendeur percutant pour te démarquer !
                        </p>

                        <div className="bg-primary/5 rounded-lg p-4 my-6">
                          <h4 className="font-semibold mb-3">Conseils pour choisir ton nom de vendeur :</h4>
                          <ul className="list-disc pl-6 space-y-2">
                            <li>Évite les noms trop longs et compliqués</li>
                            <li>Évite les significations trop personnelles</li>
                            <li>Privilégie un nom court : un ou deux mots maximum</li>
                            <li>Utilise des termes qui inspirent confiance : "Conseil", "France", "Ventes", "Jouets", "Toys"...</li>
                          </ul>
                        </div>

                        <p className="mb-4">
                          <strong>Astuce simple :</strong> Si tu peines à trouver un nom, prends la première lettre de ton prénom et de ton nom, 
                          puis ajoute un mot pertinent. Exemple : "LD France".
                        </p>

                        <p className="mb-4">
                          Pour le nom de ton entreprise, c'est différent ! Il s'agit de ton statut juridique. 
                          Là aussi, opte pour quelque chose de simple et professionnel. Voici des acronymes souvent utilisés :
                        </p>
                        <ul className="list-disc pl-6 space-y-1 mb-6">
                          <li>Conseil</li>
                          <li>Ventes / Sales</li>
                          <li>France</li>
                          <li>Solutions</li>
                        </ul>

                        <h4 className="text-lg font-semibold mt-6 mb-3">2. Créer un mail professionnel</h4>
                        <p className="mb-3">
                          Avoir une adresse email professionnelle est indispensable pour échanger avec les clients et gérer ton activité sérieusement. 
                          Ton adresse doit être simple et inspirante de confiance.
                        </p>

                        <p className="mb-3">
                          Tu peux facilement créer un email professionnel via Gmail avec Google Workspace :
                        </p>
                        <a 
                          href="https://workspace.google.com/intl/fr/lp/gmail-for-business/" 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="text-primary hover:underline mb-4 inline-block"
                        >
                          → Créer mon email professionnel sur Google Workspace
                        </a>

                        <p className="mt-4 mb-3">
                          Clique sur "Démarrer" et renseigne tes informations. Ensuite, choisis l'option appropriée.
                        </p>

                        <p className="mb-3">
                          Si tu n'as pas encore de nom de domaine, clique sur "Non, j'ai besoin d'un domaine". 
                          Recherche le nom de domaine qui te correspond et achète-le.
                        </p>

                        <p className="mb-3">
                          Une fois ton domaine acheté, tu disposes d'un email professionnel sur Gmail ! 
                          Tu pourras l'utiliser lors de ton inscription Amazon Seller et pour tous tes échanges professionnels futurs.
                        </p>

                        <div className="bg-green-50 dark:bg-green-950/20 border border-green-200 dark:border-green-800 rounded-lg p-4 mt-6">
                          <p className="text-sm">
                            ✅ <strong>En résumé :</strong> Un nom de boutique percutant + un email professionnel = une image sérieuse 
                            qui inspire confiance et booste tes ventes !
                          </p>
                        </div>
                      </div>
                    </AccordionContent>
                  </AccordionItem>

                  {/* Ouvrir son compte Amazon Seller */}
                  <AccordionItem value="compte-seller" className="border rounded-lg px-6 bg-card">
                    <AccordionTrigger className="text-lg font-semibold hover:no-underline">
                      <div className="flex items-center gap-3">
                        <CreditCard className="w-5 h-5 text-primary" />
                        <span>Ouvrir son compte Amazon Seller</span>
                      </div>
                    </AccordionTrigger>
                    <AccordionContent className="space-y-6 pt-4">
                      <div className="prose prose-sm max-w-none">
                        <h3 className="text-xl font-bold mb-4">La dernière étape avant de pouvoir vendre !</h3>
                        
                        <div className="bg-amber-50 dark:bg-amber-950/20 border border-amber-200 dark:border-amber-800 rounded-lg p-4 mb-6">
                          <h4 className="font-semibold mb-3">💰 Frais à prévoir pour créer ton compte Amazon Seller :</h4>
                          <ul className="list-disc pl-6 space-y-1 text-sm">
                            <li>46,80€ / mois</li>
                            <li>L'application Seller AMP (environ 20$/mois)</li>
                            <li>La livraison à ta charge</li>
                            <li>Commissions sur tes ventes</li>
                            <li>Les emballages</li>
                            <li>Une imprimante thermique (obligatoire pour le FBA, mais pas nécessaire pour le FBM)</li>
                          </ul>
                        </div>

                        <h4 className="text-lg font-semibold mt-6 mb-3">Étape 1 : Se rendre sur le site Amazon Seller</h4>
                        <p className="mb-3">
                          Pour démarrer, rends-toi sur :
                        </p>
                        <a 
                          href="https://sell.amazon.fr/" 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="text-primary hover:underline mb-4 inline-block font-medium"
                        >
                          → https://sell.amazon.fr/
                        </a>

                        <p className="mt-4 mb-3">
                          En haut à droite, clique sur "S'inscrire". Amazon te demandera soit de créer un nouveau compte Amazon, 
                          soit de te connecter à un compte déjà existant.
                        </p>

                        <h4 className="text-lg font-semibold mt-6 mb-3">Étape 2 : Remplir les informations</h4>
                        <p className="mb-3">
                          Ensuite, c'est assez simple ! Il suffit d'indiquer quelques informations te concernant et d'attendre la validation de ton compte.
                        </p>

                        <ul className="list-disc pl-6 space-y-2 mb-4">
                          <li>Renseigne tes informations (type d'activité, nom d'entreprise, pays...)</li>
                          <li><strong>Nom commercial</strong> = Ton nom d'entreprise</li>
                          <li><strong>Numéro d'enregistrement</strong> = Ton numéro SIRET</li>
                        </ul>

                        <p className="mb-4">
                          Ensuite, de nombreuses autres informations te seront demandées, notamment tes coordonnées bancaires 
                          (pour être payé et pour débiter ton compte lors de la création de ton compte vendeur).
                        </p>

                        <p className="mb-4">
                          Amazon te demandera également de définir ton nom de boutique.
                        </p>

                        <h4 className="text-lg font-semibold mt-6 mb-3">Étape 3 : Vérification du compte</h4>
                        <p className="mb-3">
                          Dernière étape : tu devras faire vérifier ton compte. Pour cela, tu devras passer un appel avec le service d'Amazon. 
                          Tu devras attendre d'être mis en relation avec un conseiller qui te posera quelques questions sur toi, 
                          ce que tu comptes vendre et vérifiera ton identité.
                        </p>

                        <p className="mb-3">
                          Une fois l'appel terminé, ton dossier sera validé en quelques jours ! 😄
                        </p>

                        <div className="bg-green-50 dark:bg-green-950/20 border border-green-200 dark:border-green-800 rounded-lg p-4 mt-6">
                          <p className="text-sm">
                            🎉 <strong>Félicitations !</strong> Tu vas enfin pouvoir vendre sur Amazon ! 
                            Si tu as des questions, n'hésite pas à nous contacter via le support.
                          </p>
                        </div>
                      </div>
                    </AccordionContent>
                  </AccordionItem>

                </Accordion>
              </TabsContent>

              {/* ========== ONGLET VENDRE ========== */}
              <TabsContent value="vendre" className="space-y-8">
                
                <Accordion type="single" collapsible className="space-y-4">
                  
                  {/* Comment trouver des produits rentables */}
                  <AccordionItem value="produits-rentables" className="border rounded-lg px-6 bg-card">
                    <AccordionTrigger className="text-lg font-semibold hover:no-underline">
                      <div className="flex items-center gap-3">
                        <Search className="w-5 h-5 text-primary" />
                        <span>Comment trouver des produits rentables à revendre ?</span>
                      </div>
                    </AccordionTrigger>
                    <AccordionContent className="space-y-6 pt-4">
                      <div className="prose prose-sm max-w-none">
                        <div className="bg-primary/5 border-l-4 border-primary p-4 mb-6">
                          <p className="mb-2">
                            Il existe une multitude de possibilités pour dénicher des produits rentables ! 
                            Il te suffit d'y consacrer un peu de temps et d'être débrouillard.
                          </p>
                          <p className="text-sm italic">
                            Suis ces conseils, ça pourrait bien t'aider.
                          </p>
                        </div>

                        <p className="mb-4 font-medium">
                          Pour commencer, il faut savoir qu'il n'existe pas de formule magique ! 
                          Tu dois scanner tous les produits que tu croises.
                        </p>

                        <p className="mb-4">
                          Ne te concentre pas uniquement sur une seule catégorie, sinon tu risques de passer à côté de nombreuses opportunités. 
                          Bien sûr, certaines catégories fonctionnent mieux que d'autres, comme les jeux/jouets, l'outillage, 
                          les articles pour enfants/bébés et le secteur pharmaceutique.
                        </p>

                        <div className="bg-amber-50 dark:bg-amber-950/20 border border-amber-200 dark:border-amber-800 rounded-lg p-4 my-6">
                          <p className="text-sm">
                            💡 <strong>Astuce :</strong> Avant même de chercher en ligne, réfléchis à ce qui t'entoure ! 
                            Chez toi, autour de chez toi, dans ta ville, via tes proches... 
                            Tu as peut-être des articles qui se revendent très bien sur Amazon.
                          </p>
                        </div>

                        <p className="mb-4">
                          Pense aussi aux contacts que tu as. Tu connais sûrement des gens qui travaillent dans divers secteurs : 
                          salon de coiffure, garage, etc. Ils connaissent bien les prix, les produits populaires et surtout les meilleurs fournisseurs. 
                          En tant que professionnels, ils peuvent également commander directement auprès des grandes marques.
                        </p>

                        <h4 className="text-lg font-semibold mt-8 mb-3">1. En ligne sur les sites commerçants français</h4>
                        <p className="mb-3">
                          La méthode la plus populaire consiste à chercher des produits en ligne. 
                          Quand on débute, c'est ce qui est le plus recommandé car cela permet de comprendre rapidement le business Amazon FBA. 
                          En scannant, tu apprendras à identifier les produits rentables et les niches qui fonctionnent.
                        </p>

                        <p className="mb-3">
                          Il existe des millions de sites ! N'hésite pas à faire tes propres recherches. 
                          Voici quelques recommandations pour trouver d'autres sites :
                        </p>
                        <ul className="list-disc pl-6 space-y-2 mb-4">
                          <li>Recherche un mot-clé comme "Jouets" sur Google et consulte la liste des différents sites</li>
                          <li>Explore des plateformes comme Dealabs, Twitter, Les Pages Jaunes</li>
                          <li>Utilise LinkedIn ou Facebook pour repérer des opportunités</li>
                        </ul>

                        <div className="bg-primary/5 rounded-lg p-4 my-6">
                          <p className="text-sm">
                            💡 Pense à créer une note regroupant tous les produits rentables que tu trouves, 
                            ainsi que les différents sites intéressants. Cela te permettra de garder une trace de tes découvertes !
                          </p>
                        </div>

                        <h4 className="text-lg font-semibold mt-8 mb-3">2. En magasin (commerçants, enseignes, déstockage...)</h4>
                        <p className="mb-3">
                          C'est un excellent moyen de trouver des produits rentables ! Dans ta ville, il y a sûrement des Carrefour, Auchan, Leclerc, 
                          et à proximité, des enseignes comme Fnac, King Jouet, etc.
                        </p>

                        <p className="mb-3">
                          Mais ne t'arrête pas là ! En creusant un peu plus, tu découvriras forcément des petites boutiques qui proposent 
                          aussi des articles intéressants. Pense à leur rendre visite !
                        </p>

                        <div className="bg-amber-50 dark:bg-amber-950/20 border border-amber-200 dark:border-amber-800 rounded-lg p-4 my-6">
                          <p className="text-sm">
                            ⚡ <strong>Important :</strong> Ne néglige aucun commerce ! Les pharmacies, les superettes... 
                            Tous les produits peuvent être rentables.
                          </p>
                        </div>

                        <h4 className="text-lg font-semibold mt-8 mb-3">3. Sur les plateformes entre particuliers (Vinted, LeBoncoin...)</h4>
                        <p className="mb-3">
                          Acheter sur des plateformes comme Vinted, Leboncoin, Ebay, Facebook Marketplace est une excellente idée ! 
                          Tu peux trouver des articles neufs à prix réduit.
                        </p>

                        <div className="bg-red-50 dark:bg-red-950/20 border border-red-200 dark:border-red-800 rounded-lg p-4 my-6">
                          <p className="text-sm">
                            ⚠️ <strong>Attention :</strong> En achetant sur ces plateformes, il ne sera pas possible de collecter la TVA sur l'achat. 
                            Pense-y dans tes calculs de rentabilité !
                          </p>
                        </div>

                        <h4 className="text-lg font-semibold mt-8 mb-3">4. Recherche inversée</h4>
                        <p className="mb-3">
                          Le principe est simple : tu analyses la boutique d'un vendeur concurrent, tu repères les produits qu'il vend, 
                          puis tu fais des recherches pour voir si tu peux les trouver ailleurs à un prix plus bas.
                        </p>

                        <p className="mb-3">
                          C'est une méthode très efficace ! Sur SellerAmp, rends-toi sur un produit et tout en bas, 
                          tu auras la liste des vendeurs. Clique sur le profil du vendeur et tu verras tous ses produits en vente.
                        </p>

                        <h4 className="text-lg font-semibold mt-8 mb-3">5. Ventes aux enchères</h4>
                        <p className="mb-3">
                          L'avantage avec les ventes aux enchères, c'est qu'on peut collecter la TVA ! 
                          Mais attention aux frais qui peuvent être élevés. Il est très intéressant de te créer un compte sur ces sites :
                        </p>
                        <ul className="list-disc pl-6 space-y-2 mb-4">
                          <li><a href="https://www.interencheres.com/" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">InterEnchères</a></li>
                          <li><a href="https://www.catawiki.com/" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">Catawiki</a> (Frais : 9% + 3€ fixe)</li>
                          <li><a href="https://www.moniteurdesventes.com/fr" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">Moniteur des Ventes</a></li>
                        </ul>

                        <h4 className="text-lg font-semibold mt-8 mb-3">6. Acheter chez des grossistes</h4>
                        <p className="mb-3">
                          Avant de te présenter différents moyens, nous te recommandons vivement Qogita, 
                          un grossiste spécialisé pour les vendeurs Amazon !
                        </p>
                        <a 
                          href="https://www.qogita.com/?ref=zdc3yjk" 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="text-primary hover:underline mb-2 inline-block font-medium"
                        >
                          → Découvrir Qogita
                        </a>

                        <div className="bg-green-50 dark:bg-green-950/20 border border-green-200 dark:border-green-800 rounded-lg p-4 mt-6">
                          <p className="text-sm">
                            ✅ <strong>En résumé :</strong> Trouver des produits rentables nécessite de combiner plusieurs méthodes 
                            et d'éviter certains pièges (frais cachés, TVA non récupérable, contrefaçons). 
                            En diversifiant tes sources et en utilisant les bons outils, tu peux optimiser tes marges et construire un business solide !
                          </p>
                        </div>
                      </div>
                    </AccordionContent>
                  </AccordionItem>

                  {/* Comment vendre en FBA */}
                  <AccordionItem value="vendre-fba" className="border rounded-lg px-6 bg-card">
                    <AccordionTrigger className="text-lg font-semibold hover:no-underline">
                      <div className="flex items-center gap-3">
                        <Package className="w-5 h-5 text-primary" />
                        <span>Comment vendre en FBA ?</span>
                      </div>
                    </AccordionTrigger>
                    <AccordionContent className="space-y-6 pt-4">
                      <div className="prose prose-sm max-w-none">
                        <div className="bg-primary/5 border-l-4 border-primary p-4 mb-6">
                          <p className="mb-2">
                            <strong>Pour rappel :</strong> FBA signifie "Fulfillment by Amazon" (Expédié par Amazon en français).
                          </p>
                          <p className="text-sm">
                            Le principe est simple : au lieu d'expédier ton stock chez le client (en FBM), 
                            le FBA te permet d'envoyer ton stock dans les entrepôts d'Amazon. Ils s'occupent de tout le reste !
                          </p>
                        </div>

                        <blockquote className="border-l-4 border-muted pl-4 italic mb-6">
                          Ce guide t'expliquera comment expédier tes produits efficacement et quels matériaux utiliser.
                        </blockquote>

                        <h4 className="text-lg font-semibold mt-6 mb-3">Pourquoi choisir la vente en FBA ?</h4>
                        <p className="mb-3">
                          Le choix du FBA dépend des articles et des quantités. Nous te le recommandons vivement ! 
                          Certains articles ont une énorme différence de bénéfice entre FBM et FBA, 
                          tandis que pour d'autres, la différence est minime. Dans ces cas-là, privilégier le FBA devient plus intéressant.
                        </p>

                        <div className="bg-primary/5 rounded-lg p-4 my-6">
                          <h5 className="font-semibold mb-3">Autres avantages :</h5>
                          <ul className="list-disc pl-6 space-y-2 text-sm">
                            <li><strong>Gagner du temps :</strong> Amazon gère l'entreposage, l'expédition et le service client</li>
                            <li><strong>Accès au programme Prime :</strong> Tes produits deviennent éligibles pour la livraison rapide</li>
                            <li><strong>Crédibilité accrue :</strong> Amazon garantit la qualité du service de livraison</li>
                          </ul>
                        </div>

                        <h4 className="text-lg font-semibold mt-8 mb-3">1. Préparation de l'expédition</h4>
                        <p className="mb-3">
                          Avec Seller Amp, vérifie bien le poids et la taille du produit avant de l'acheter. 
                          C'est très important car un produit lourd coûtera plus cher au moment d'envoyer ton stock à Amazon ! 
                          Vérifie aussi que tu as l'autorisation de vendre le produit.
                        </p>

                        <h4 className="text-lg font-semibold mt-6 mb-3">2. Choisir les bons cartons</h4>
                        <p className="mb-3">
                          Amazon impose des exigences strictes concernant les cartons d'expédition :
                        </p>
                        <ul className="list-disc pl-6 space-y-2 mb-4">
                          <li>Dimensions maximales : 63,5 cm × 48,26 cm × 73,66 cm</li>
                          <li>Poids maximum : 22,68 kg (sauf exceptions pour produits volumineux)</li>
                          <li>Cartons solides et neufs de préférence</li>
                        </ul>

                        <h4 className="text-lg font-semibold mt-6 mb-3">3. Matériaux recommandés</h4>
                        <ul className="list-disc pl-6 space-y-2 mb-4">
                          <li>Scotch résistant</li>
                          <li>Imprimante thermique (recommandée pour les étiquettes)</li>
                          <li>Étiquettes adhésives (format standard Amazon)</li>
                          <li>Papier bulle (pour protéger les articles fragiles)</li>
                        </ul>

                        <h4 className="text-lg font-semibold mt-6 mb-3">4. Création de l'expédition sur Seller Central</h4>
                        <p className="mb-3">
                          Connecte-toi à ton compte Amazon Seller Central et suis ces étapes :
                        </p>
                        <ol className="list-decimal pl-6 space-y-2 mb-4">
                          <li>Accède à "Inventaire" &gt; "Gérer les expéditions FBA"</li>
                          <li>Crée un nouveau plan d'expédition</li>
                          <li>Ajoute les produits à expédier avec leurs quantités</li>
                          <li>Imprime les étiquettes FNSKU pour chaque produit</li>
                          <li>Prépare tes cartons et imprime les étiquettes d'expédition</li>
                        </ol>

                        <h4 className="text-lg font-semibold mt-6 mb-3">5. Envoi des colis</h4>
                        <p className="mb-3">
                          Une fois tes cartons prêts et étiquetés, tu peux choisir entre :
                        </p>
                        <ul className="list-disc pl-6 space-y-2 mb-4">
                          <li><strong>Programme de partenariat transporteur Amazon</strong> : Tarifs négociés via Amazon</li>
                          <li><strong>Ton propre transporteur</strong> : UPS, DHL, Chronopost, etc.</li>
                        </ul>

                        <div className="bg-green-50 dark:bg-green-950/20 border border-green-200 dark:border-green-800 rounded-lg p-4 mt-6">
                          <p className="text-sm">
                            ✅ <strong>Astuce :</strong> Le FBA permet de gagner un temps précieux et d'accéder au badge Prime. 
                            C'est un investissement qui vaut le coup si tu veux scaler ton business !
                          </p>
                        </div>
                      </div>
                    </AccordionContent>
                  </AccordionItem>

                  {/* Comment vendre en FBM */}
                  <AccordionItem value="vendre-fbm" className="border rounded-lg px-6 bg-card">
                    <AccordionTrigger className="text-lg font-semibold hover:no-underline">
                      <div className="flex items-center gap-3">
                        <ShoppingCart className="w-5 h-5 text-primary" />
                        <span>Comment vendre en FBM ?</span>
                      </div>
                    </AccordionTrigger>
                    <AccordionContent className="space-y-6 pt-4">
                      <div className="prose prose-sm max-w-none">
                        <div className="bg-primary/5 border-l-4 border-primary p-4 mb-6">
                          <p className="mb-2">
                            <strong>Pour rappel :</strong> FBM signifie "Fulfilled by Merchant", 
                            ce qui veut dire que c'est le vendeur lui-même qui gère la logistique de ses commandes sur Amazon.
                          </p>
                          <p className="text-sm">
                            Contrairement à FBA où Amazon s'occupe du stockage, de l'emballage et de l'expédition, 
                            avec FBM, c'est toi (le vendeur) qui expédies directement les produits au client.
                          </p>
                        </div>

                        <blockquote className="border-l-4 border-muted pl-4 italic mb-6">
                          Ce guide t'expliquera comment expédier tes produits efficacement et quels matériaux utiliser.
                        </blockquote>

                        <h4 className="text-lg font-semibold mt-6 mb-3">Pourquoi choisir la vente en FBM ?</h4>
                        <p className="mb-3">
                          Le choix du FBM dépend des articles et des quantités. Nous te le recommandons vivement quand tu commences 
                          avec un petit budget (moins de 500€) ou selon certains articles. 
                          Certains produits ont une énorme différence de bénéfice entre FBM et FBA, 
                          alors que d'autres peuvent avoir une différence de quelques euros seulement.
                        </p>

                        <h4 className="text-lg font-semibold mt-8 mb-3">1. Préparation de ton expédition</h4>
                        <p className="mb-3">
                          Avec Seller Amp, vérifie bien le poids et la taille du produit avant de l'acheter. 
                          C'est très important car un produit lourd coûtera plus cher au moment d'acheter un bordereau d'expédition ! 
                          Vérifie aussi que tu as l'autorisation de vendre le produit et les éventuelles alertes 
                          (produit liquide, inflammable, etc.).
                        </p>

                        <h4 className="text-lg font-semibold mt-6 mb-3">1.1 Choisir les bons cartons</h4>
                        <p className="mb-3">
                          Quand tu expédies en FBM, pas d'inquiétude : pas besoin d'avoir une taille spécifique ! 
                          Tu expédies dans le carton de ton choix. Fais juste en sorte que ton colis soit soigné.
                        </p>
                        <p className="mb-3">
                          Tu peux acheter des cartons un peu partout. Nous avons des partenaires qui vendent des cartons à prix réduit !
                        </p>

                        <h4 className="text-lg font-semibold mt-6 mb-3">1.2 Matériaux recommandés</h4>
                        <ul className="list-disc pl-6 space-y-2 mb-4">
                          <li>Scotch résistant</li>
                          <li>Imprimante thermique (recommandée, mais pas obligatoire)</li>
                          <li>Étiquettes pour imprimante thermique (format 40mm x 30mm)</li>
                          <li>Papier bulle (pas obligatoire mais recommandé)</li>
                        </ul>

                        <h4 className="text-lg font-semibold mt-6 mb-3">2. Création de l'expédition sur Amazon Seller Central</h4>
                        <p className="mb-3">
                          Tu dois te rendre sur Amazon Seller et trouver l'option "Ajouter des produits".
                        </p>
                        <p className="mb-3">
                          Ensuite, tu cherches l'EAN ou l'ASIN du produit et tu cliques sur le bon produit proposé.
                        </p>
                        <p className="mb-3">
                          Choisis l'état "Neuf" et clique sur "Vendre ce produit".
                        </p>
                        <p className="mb-3">
                          Remplis quelques informations comme la quantité, ton prix et l'état du produit. 
                          Le SKU du vendeur n'est pas essentiel.
                        </p>
                        <div className="bg-amber-50 dark:bg-amber-950/20 border border-amber-200 dark:border-amber-800 rounded-lg p-4 my-4">
                          <p className="text-sm">
                            <strong>Important :</strong> Choisis bien "Je vais expédier cet article moi-même" pour faire du FBM !
                          </p>
                        </div>
                        <p className="mb-3">
                          Voilà ! Tu viens de créer une offre FBM. Attends environ 15 minutes avant que ton stock soit visible sur la page produit d'Amazon.
                        </p>

                        <h4 className="text-lg font-semibold mt-6 mb-3">3. Envoi des colis</h4>
                        <p className="mb-3">
                          Une fois ton listing validé sur Amazon Seller, tu dois maintenant attendre les ventes ! 
                          Si tu vends un article, tu recevras une notification sur ton application Amazon Seller et un email.
                        </p>
                        <p className="mb-3">
                          Pour expédier, c'est facile :
                        </p>
                        <ol className="list-decimal pl-6 space-y-2 mb-4">
                          <li>Va sur l'onglet "Gérer les commandes"</li>
                          <li>Clique sur la commande</li>
                          <li>Va tout en bas de la commande et renseigne le numéro de suivi</li>
                          <li>Clique sur "Confirmer l'expédition"</li>
                        </ol>
                        <p className="mb-3">
                          Pour acheter un bordereau d'expédition, va sur le site d'un transporteur comme La Poste !
                        </p>

                        <h4 className="text-lg font-semibold mt-6 mb-3">3.2 Choix du transporteur</h4>
                        <p className="mb-3">
                          Choisis La Poste, c'est souvent le moins cher pour des envois en France. 
                          Sinon, UPS est une bonne alternative car ils passent récupérer tes colis directement depuis chez toi.
                        </p>

                        <div className="bg-green-50 dark:bg-green-950/20 border border-green-200 dark:border-green-800 rounded-lg p-4 mt-6">
                          <p className="text-sm">
                            💬 Si tu as la moindre question, pense à venir nous contacter. On t'aidera avec plaisir !
                          </p>
                        </div>
                      </div>
                    </AccordionContent>
                  </AccordionItem>

                  {/* Comment reconnaître un bon d'un mauvais produit */}
                  <AccordionItem value="reconnaitre-produit" className="border rounded-lg px-6 bg-card">
                    <AccordionTrigger className="text-lg font-semibold hover:no-underline">
                      <div className="flex items-center gap-3">
                        <TrendingDown className="w-5 h-5 text-primary" />
                        <span>Comment reconnaître un bon d'un mauvais produit ?</span>
                      </div>
                    </AccordionTrigger>
                    <AccordionContent className="space-y-6 pt-4">
                      <div className="prose prose-sm max-w-none">
                        <div className="bg-primary/5 border-l-4 border-primary p-4 mb-6">
                          <p>
                            Avant d'acheter n'importe quel produit sur un site, il est crucial de s'assurer que le produit est réellement profitable. 
                            On te l'explique dans ce guide !
                          </p>
                        </div>

                        <div className="grid md:grid-cols-2 gap-6 mb-8">
                          <Card className="bg-green-50 dark:bg-green-950/20 border-green-200 dark:border-green-800">
                            <CardHeader>
                              <CardTitle className="text-base">✅ Un "bon" produit, c'est :</CardTitle>
                            </CardHeader>
                            <CardContent className="text-sm">
                              <ul className="list-disc pl-5 space-y-1">
                                <li>Faible concurrence</li>
                                <li>Forte demande</li>
                                <li>Rentabilité intéressante</li>
                              </ul>
                            </CardContent>
                          </Card>

                          <Card className="bg-red-50 dark:bg-red-950/20 border-red-200 dark:border-red-800">
                            <CardHeader>
                              <CardTitle className="text-base">❌ Un "mauvais" produit, c'est :</CardTitle>
                            </CardHeader>
                            <CardContent className="text-sm">
                              <ul className="list-disc pl-5 space-y-1">
                                <li>Trop concurrentiel</li>
                                <li>Faible volume de recherche</li>
                                <li>Prix instable</li>
                                <li>Faible marge de profit</li>
                              </ul>
                            </CardContent>
                          </Card>
                        </div>

                        <h4 className="text-lg font-semibold mt-8 mb-3">Les critères essentiels pour analyser un produit</h4>
                        <p className="mb-3">
                          Dans un premier temps, tu vas pouvoir commencer à analyser un produit à l'aide de l'application SellerAmp.
                        </p>
                        <p className="mb-3">
                          Quand tu vas scanner des produits, ils peuvent être profitables à première vue. 
                          Mais il faut vérifier quelques paramètres pour s'assurer si le produit est vraiment profitable ou non !
                        </p>

                        <h4 className="text-lg font-semibold mt-8 mb-3">Reconnaître un bon d'un mauvais graphique</h4>
                        <p className="mb-3">
                          L'indicateur <strong>"Est. Sales"</strong> dans SellerAmp fournit une estimation des ventes mensuelles d'un produit. 
                          Cependant, il peut parfois afficher "Unknown" (inconnu). 
                          Cela pose problème car sans cette donnée, il est difficile d'évaluer le potentiel de vente du produit.
                        </p>

                        <p className="mb-3">
                          Le <strong>BSR (Best Seller Rank)</strong> indique le classement d'un produit dans sa catégorie. 
                          Ce classement peut varier considérablement d'un pays à l'autre. 
                          Active l'option "European Marketplaces" dans tes réglages SellerAmp pour évaluer les performances du produit 
                          dans les différents pays européens.
                        </p>

                        <p className="mb-3">
                          Une autre information cruciale concerne le graphique ! Plus un article grimpe dans le classement (BSR augmente), 
                          moins il se vend généralement.
                        </p>

                        <div className="bg-amber-50 dark:bg-amber-950/20 border border-amber-200 dark:border-amber-800 rounded-lg p-4 my-6">
                          <p className="text-sm mb-2">
                            <strong>Signification des traits dans le graphique :</strong>
                          </p>
                          <ul className="list-disc pl-6 space-y-1 text-sm">
                            <li><strong>Trait jaune :</strong> Amazon vend ce produit (souvent mauvais signe)</li>
                            <li><strong>Traits bleu et orange :</strong> Différents vendeurs FBA et FBM</li>
                            <li><strong>Trait violet :</strong> La Buy Box (boîte d'achat). Si elle n'a jamais été là, c'est problématique</li>
                          </ul>
                        </div>

                        <h4 className="text-lg font-semibold mt-8 mb-3">Vérifie les vendeurs, leur stock et leurs prix !</h4>
                        <p className="mb-3">
                          Un autre critère important est de vérifier le stock et le prix des vendeurs sur la fiche produit.
                        </p>
                        <p className="mb-3">
                          Parfois, dans le "Sale Price", le prix indiqué ne correspond pas toujours au prix des vendeurs actuels ! 
                          Assure-toi donc de vérifier et de remplacer ce prix par le prix du vendeur le plus bas ou par le prix moyen 
                          des trois derniers mois.
                        </p>

                        <h4 className="text-lg font-semibold mt-8 mb-3">Les caractéristiques du produit (poids, taille, réglementations)</h4>
                        <p className="mb-3">
                          Analyse impérativement la taille et le poids de ton produit. 
                          Un produit lourd coûtera forcément plus cher à expédier, que ce soit en FBA ou en FBM.
                        </p>

                        <h4 className="text-lg font-semibold mt-8 mb-3">Les alertes autour du produit</h4>
                        <p className="mb-3">
                          Dernière chose : vérifie les alertes sur le produit ! 
                          Très déterminant dans ton analyse, elles te permettent de suivre des indications données par SellerAmp 
                          comme la taille/poids du produit, les variations, ou si c'est un produit dangereux à transporter, etc.
                        </p>

                        <div className="bg-green-50 dark:bg-green-950/20 border border-green-200 dark:border-green-800 rounded-lg p-4 mt-6">
                          <p className="text-sm">
                            💬 N'hésite pas à venir nous contacter si tu as besoin d'avis sur un produit ou si tu as besoin d'aide !
                          </p>
                        </div>
                      </div>
                    </AccordionContent>
                  </AccordionItem>

                </Accordion>
              </TabsContent>

              {/* ========== ONGLET OUTILS ========== */}
              <TabsContent value="outils" className="space-y-8">
                
                <Accordion type="single" collapsible className="space-y-4">
                  
                  {/* Seller AMP */}
                  <AccordionItem value="seller-amp" className="border rounded-lg px-6 bg-card">
                    <AccordionTrigger className="text-lg font-semibold hover:no-underline">
                      <div className="flex items-center gap-3">
                        <Search className="w-5 h-5 text-primary" />
                        <span>Seller AMP - Scanner de produits</span>
                      </div>
                    </AccordionTrigger>
                    <AccordionContent className="space-y-6 pt-4">
                      <div className="prose prose-sm max-w-none">
                        <div className="bg-primary/5 border-l-4 border-primary p-4 mb-6">
                          <p className="mb-2">
                            L'application Seller Amp est remplie d'informations importantes ! 
                            Il est essentiel de les comprendre pour bien vendre sur Amazon.
                          </p>
                          <a 
                            href="https://selleramp.com/?gc_id=18474664952&utm_campaign=SEARCH%20-%20BRAND%20BROAD&utm_source=google&utm_medium=cpc&utm_content=BRAND&utm_term=seller%20amp&utm_term=seller%20amp&utm_campaign=SEARCH+-+BRAND&utm_source=adwords&utm_medium=ppc&hsa_acc=9738693668&hsa_cam=19603041783&hsa_grp=145757011659&hsa_ad=646160900057&hsa_src=g&hsa_tgt=kwd-30666654175&hsa_kw=seller%20amp&hsa_mt=e&hsa_net=adwords&hsa_ver=3&gad_source=1&gad_campaignid=19603041783&gbraid=0AAAAAoif9_eRkWO_UXNZBSdciGfz1qHQO&gclid=CjwKCAjw6vHHBhBwEiwAq4zvA50baDeM_odyrsEQ0fKNAY41Rkwlox15bxrpCPLC1YqIqUW2-w_vTxoCHzwQAvD_BwE" 
                            target="_blank" 
                            rel="noopener noreferrer"
                            className="text-primary hover:underline font-medium"
                          >
                            → Découvrir Seller AMP
                          </a>
                        </div>

                        <p className="mb-4">
                          Quand tu vas scanner un article à l'aide de Seller Amp, il y a cet espace "Alerts" qui peut paraître inutile 
                          quand tu as déjà les informations sur le nombre de ventes par mois et le bénéfice que tu vas pouvoir réaliser. 
                          Pourtant, l'une des informations les plus importantes reste justement cet espace "Alerts".
                        </p>

                        <p className="mb-4">
                          Tu vas rencontrer différentes alertes et il faut les comprendre ! Nous t'expliquons tout juste en dessous.
                        </p>

                        <h4 className="text-lg font-semibold mt-8 mb-3">✅ Pas d'alerte - Tout est OK !</h4>
                        <p className="mb-3">
                          On commence avec un exemple où tu n'as aucun souci ! Aucune inquiétude, tu peux vendre ce produit 
                          et il n'y a pas de privatisation ou de danger lié à cet objet (exemple : produit chimique).
                        </p>
                        <p className="mb-4">
                          Quand c'est en vert, c'est qu'il n'y a pas de "souci" ! 
                          Cependant, l'indication du carré vert avec un chiffre indique quelque chose.
                        </p>

                        <div className="bg-green-50 dark:bg-green-950/20 border border-green-200 dark:border-green-800 rounded-lg p-4 my-6">
                          <h5 className="font-semibold mb-2">Quand on clique dessus, voici ce qui s'affiche :</h5>
                          <ul className="list-disc pl-6 space-y-1 text-sm">
                            <li><strong>Eligibility</strong> (Éligibilité) : Tu peux vendre ce produit</li>
                            <li><strong>Amazon Share Buy Box</strong> : Tu auras la buy box</li>
                            <li><strong>Private Label</strong> : Unlikely = Peu probable</li>
                            <li><strong>Size</strong> : Standard Size = Taille standard</li>
                            <li><strong>Meltable</strong> : Fondable (exemple : le chocolat peut fondre)</li>
                            <li><strong>Variations</strong> : No (pas de variation de couleur/taille)</li>
                          </ul>
                        </div>

                        <h4 className="text-lg font-semibold mt-8 mb-3">🚨 L'alerte "V" pour Variations</h4>
                        <p className="mb-3">
                          L'alerte V signifie variations, ce qui indique que le produit a des variations sur la page produit. 
                          Par exemple, une variation avec une taille différente ou une autre couleur.
                        </p>
                        <p className="mb-4">
                          Les variations peuvent être problématiques car tu n'as peut-être pas la meilleure ! 
                          Certaines variations de l'article se vendent parfois mieux car le prix est plus bas 
                          ou tout simplement c'est une couleur plus populaire. 
                          Donc plus il y a de variations, plus c'est risqué selon le nombre de ventes par mois.
                        </p>

                        <h4 className="text-lg font-semibold mt-8 mb-3">🚨 L'alerte "M" pour Meltable</h4>
                        <p className="mb-4">
                          Meltable veut dire "Fondable". Certains produits peuvent fondre à cause de la chaleur, 
                          donc fais attention ! Un produit doit toujours arriver neuf chez le client ou chez Amazon.
                        </p>

                        <h4 className="text-lg font-semibold mt-8 mb-3">🚨 L'alerte "S" pour Oversize</h4>
                        <p className="mb-4">
                          C'est une alerte pour prévenir que l'article est grand ! 
                          Donc compliqué à expédier, voire cher à expédier selon le poids.
                        </p>

                        <h4 className="text-lg font-semibold mt-8 mb-3">🚨 L'alerte "PL" pour Private Label</h4>
                        <div className="bg-red-50 dark:bg-red-950/20 border border-red-200 dark:border-red-800 rounded-lg p-4 my-4">
                          <p className="text-sm">
                            <strong>⚠️ C'est sûrement l'alerte la plus importante !</strong> 
                            Le Private Label sur un article signifie une privatisation de l'article par la marque. 
                            Tu n'es donc PAS autorisé à vendre ce produit.
                          </p>
                        </div>

                        <h4 className="text-lg font-semibold mt-8 mb-3">🚨 L'alerte "BB" pour Buy Box</h4>
                        <p className="mb-4">
                          BB signifie "Amazon Share Buy Box". SellerAmp indique qu'Amazon vend le produit 
                          et détient souvent la Buy Box. Ce n'est pas une exclusivité cependant, 
                          Amazon peut partager la Buy Box et donc tu peux aussi régulièrement l'avoir.
                        </p>

                        <h4 className="text-lg font-semibold mt-8 mb-3">🚨 L'alerte "DG" pour Dangerous Goods</h4>
                        <p className="mb-3">
                          C'est pour indiquer que le produit est fragile ou possiblement dangereux 
                          (inflammable ou un produit avec de l'alcool par exemple).
                        </p>
                        <p className="mb-4">
                          Cette alerte ne t'empêche pas de l'acheter, elle te prévient uniquement 
                          que c'est un produit fragile ou possiblement dangereux !
                        </p>

                        <div className="bg-primary/5 rounded-lg p-4 mt-6">
                          <p className="text-sm">
                            💡 Il y a pleins d'autres alertes plus ou moins rares, mais nous venons de te présenter 
                            les plus importantes et récurrentes ! Il existe par exemple des alertes sur le poids du produit, 
                            sur la suppression du listing, ou sur le fait qu'il n'y a pas de buy box.
                          </p>
                        </div>
                      </div>
                    </AccordionContent>
                  </AccordionItem>

                  {/* Seller Toolkit */}
                  <AccordionItem value="seller-toolkit" className="border rounded-lg px-6 bg-card">
                    <AccordionTrigger className="text-lg font-semibold hover:no-underline">
                      <div className="flex items-center gap-3">
                        <Wrench className="w-5 h-5 text-primary" />
                        <span>Seller Toolkit - Gestion complète</span>
                      </div>
                    </AccordionTrigger>
                    <AccordionContent className="space-y-6 pt-4">
                      <div className="prose prose-sm max-w-none">
                        <div className="bg-primary/5 border-l-4 border-primary p-4 mb-6">
                          <p className="mb-2">
                            Seller Toolkit est une plateforme complète de gestion pour les vendeurs Amazon. 
                            Elle regroupe tous les outils dont tu as besoin pour analyser, optimiser et développer ton business.
                          </p>
                          <a 
                            href="https://app.sellertoolkit.co.uk/#/login" 
                            target="_blank" 
                            rel="noopener noreferrer"
                            className="text-primary hover:underline font-medium"
                          >
                            → Découvrir Seller Toolkit
                          </a>
                        </div>

                        <h4 className="text-lg font-semibold mt-6 mb-3">Fonctionnalités principales :</h4>
                        
                        <div className="space-y-4">
                          <Card className="bg-primary/5">
                            <CardHeader className="pb-3">
                              <CardTitle className="text-base">📊 Analyse des ventes</CardTitle>
                            </CardHeader>
                            <CardContent className="text-sm">
                              <p className="mb-2">
                                Suivis détaillés de tes performances avec graphiques et statistiques en temps réel. 
                                Visualise ton chiffre d'affaires, tes marges et identifie rapidement tes produits les plus rentables.
                              </p>
                            </CardContent>
                          </Card>

                          <Card className="bg-primary/5">
                            <CardHeader className="pb-3">
                              <CardTitle className="text-base">💰 Gestion des profits</CardTitle>
                            </CardHeader>
                            <CardContent className="text-sm">
                              <p className="mb-2">
                                Calcule automatiquement tes bénéfices réels en prenant en compte tous les frais Amazon, 
                                les coûts d'achat, les frais d'expédition et la TVA. Plus besoin de calculer manuellement !
                              </p>
                            </CardContent>
                          </Card>

                          <Card className="bg-primary/5">
                            <CardHeader className="pb-3">
                              <CardTitle className="text-base">📦 Suivi des stocks</CardTitle>
                            </CardHeader>
                            <CardContent className="text-sm">
                              <p className="mb-2">
                                Reçois des alertes quand ton stock devient faible et évite les ruptures. 
                                Optimise ton inventaire pour ne jamais manquer une vente.
                              </p>
                            </CardContent>
                          </Card>

                          <Card className="bg-primary/5">
                            <CardHeader className="pb-3">
                              <CardTitle className="text-base">🔍 Recherche de produits</CardTitle>
                            </CardHeader>
                            <CardContent className="text-sm">
                              <p className="mb-2">
                                Utilise les filtres avancés pour trouver des produits rentables selon tes critères : 
                                marges, volume de ventes, concurrence, etc.
                              </p>
                            </CardContent>
                          </Card>

                          <Card className="bg-primary/5">
                            <CardHeader className="pb-3">
                              <CardTitle className="text-base">📈 Surveillance des prix</CardTitle>
                            </CardHeader>
                            <CardContent className="text-sm">
                              <p className="mb-2">
                                Configure des alertes pour être notifié quand les prix de tes concurrents changent 
                                ou quand des opportunités d'achat apparaissent.
                              </p>
                            </CardContent>
                          </Card>
                        </div>

                        <div className="bg-amber-50 dark:bg-amber-950/20 border border-amber-200 dark:border-amber-800 rounded-lg p-4 mt-6">
                          <h5 className="font-semibold mb-2">💡 Pourquoi utiliser Seller Toolkit ?</h5>
                          <ul className="list-disc pl-6 space-y-1 text-sm">
                            <li>Gagne du temps sur la gestion administrative</li>
                            <li>Prends des décisions basées sur des données fiables</li>
                            <li>Évite les erreurs de calcul de rentabilité</li>
                            <li>Reste compétitif grâce aux alertes en temps réel</li>
                          </ul>
                        </div>
                      </div>
                    </AccordionContent>
                  </AccordionItem>

                  {/* Imprimantes thermiques */}
                  <AccordionItem value="imprimantes" className="border rounded-lg px-6 bg-card">
                    <AccordionTrigger className="text-lg font-semibold hover:no-underline">
                      <div className="flex items-center gap-3">
                        <Package className="w-5 h-5 text-primary" />
                        <span>Imprimantes thermiques recommandées</span>
                      </div>
                    </AccordionTrigger>
                    <AccordionContent className="space-y-6 pt-4">
                      <div className="prose prose-sm max-w-none">
                        <p className="mb-4">
                          Une imprimante thermique est indispensable pour imprimer rapidement tes étiquettes d'expédition 
                          et tes codes-barres. Voici nos recommandations testées et approuvées par la communauté.
                        </p>

                        <div className="space-y-6">
                          {/* Imprimante 1 */}
                          <Card className="bg-gradient-to-br from-primary/5 to-primary/10 border-primary/20">
                            <CardHeader>
                              <CardTitle className="text-base">🖨️ MUNBYN ITC 4x6 - Le meilleur rapport qualité/prix</CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-3">
                              <a 
                                href="https://www.amazon.fr/MUNBYN-Thermique-Bluetooth-Compatible-Transporteur/dp/B0CTKD26XW" 
                                target="_blank" 
                                rel="noopener noreferrer"
                                className="text-primary hover:underline font-medium inline-block mb-2"
                              >
                                → Voir sur Amazon
                              </a>
                              
                              <div className="grid md:grid-cols-2 gap-4">
                                <div>
                                  <h5 className="font-semibold mb-2 text-green-700 dark:text-green-400">✅ Avantages :</h5>
                                  <ul className="list-disc pl-6 space-y-1 text-sm">
                                    <li>Excellente qualité d'impression</li>
                                    <li>Compatible FBA et FBM</li>
                                    <li>Connexion USB et Bluetooth</li>
                                    <li>Installation simple et rapide</li>
                                    <li>Prix abordable (environ 100-130€)</li>
                                  </ul>
                                </div>
                                <div>
                                  <h5 className="font-semibold mb-2 text-red-700 dark:text-red-400">❌ Inconvénients :</h5>
                                  <ul className="list-disc pl-6 space-y-1 text-sm">
                                    <li>Peut être bruyante</li>
                                    <li>Format d'étiquettes limité (4x6)</li>
                                  </ul>
                                </div>
                              </div>
                              
                              <div className="bg-primary/10 rounded-lg p-3 mt-3">
                                <p className="text-sm">
                                  <strong>Idéale pour :</strong> Les débutants et vendeurs intermédiaires qui cherchent 
                                  une solution fiable sans se ruiner.
                                </p>
                              </div>
                            </CardContent>
                          </Card>

                          {/* Imprimante 2 */}
                          <Card className="bg-gradient-to-br from-primary/5 to-primary/10 border-primary/20">
                            <CardHeader>
                              <CardTitle className="text-base">🖨️ Rollo Label Printer - Le choix premium</CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-3">
                              <a 
                                href="https://www.amazon.fr/Rollo-Thermique-%C3%89tiquettes-Commerciale-Compatible/dp/B082WZ3MPF" 
                                target="_blank" 
                                rel="noopener noreferrer"
                                className="text-primary hover:underline font-medium inline-block mb-2"
                              >
                                → Voir sur Amazon
                              </a>
                              
                              <div className="grid md:grid-cols-2 gap-4">
                                <div>
                                  <h5 className="font-semibold mb-2 text-green-700 dark:text-green-400">✅ Avantages :</h5>
                                  <ul className="list-disc pl-6 space-y-1 text-sm">
                                    <li>Qualité professionnelle supérieure</li>
                                    <li>Très silencieuse</li>
                                    <li>Grande vitesse d'impression</li>
                                    <li>Compatible multi-formats</li>
                                    <li>Logiciel intégré performant</li>
                                    <li>Durabilité exceptionnelle</li>
                                  </ul>
                                </div>
                                <div>
                                  <h5 className="font-semibold mb-2 text-red-700 dark:text-red-400">❌ Inconvénients :</h5>
                                  <ul className="list-disc pl-6 space-y-1 text-sm">
                                    <li>Prix élevé (environ 250-300€)</li>
                                    <li>Surdimensionnée pour petits volumes</li>
                                  </ul>
                                </div>
                              </div>
                              
                              <div className="bg-primary/10 rounded-lg p-3 mt-3">
                                <p className="text-sm">
                                  <strong>Idéale pour :</strong> Les vendeurs confirmés avec un gros volume d'expéditions 
                                  qui recherchent la meilleure qualité et fiabilité.
                                </p>
                              </div>
                            </CardContent>
                          </Card>

                          {/* Imprimante 3 */}
                          <Card className="bg-gradient-to-br from-primary/5 to-primary/10 border-primary/20">
                            <CardHeader>
                              <CardTitle className="text-base">🖨️ Phomemo M110 - La compacte</CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-3">
                              <a 
                                href="https://www.amazon.fr/Phomemo-Imprimante-Thermique-Portable-Bluetooth/dp/B0BXCN4KHT" 
                                target="_blank" 
                                rel="noopener noreferrer"
                                className="text-primary hover:underline font-medium inline-block mb-2"
                              >
                                → Voir sur Amazon
                              </a>
                              
                              <div className="grid md:grid-cols-2 gap-4">
                                <div>
                                  <h5 className="font-semibold mb-2 text-green-700 dark:text-green-400">✅ Avantages :</h5>
                                  <ul className="list-disc pl-6 space-y-1 text-sm">
                                    <li>Très compacte et portable</li>
                                    <li>Connexion Bluetooth facile</li>
                                    <li>Prix d'entrée de gamme (60-80€)</li>
                                    <li>Parfaite pour débuter</li>
                                    <li>Silencieuse</li>
                                  </ul>
                                </div>
                                <div>
                                  <h5 className="font-semibold mb-2 text-red-700 dark:text-red-400">❌ Inconvénients :</h5>
                                  <ul className="list-disc pl-6 space-y-1 text-sm">
                                    <li>Qualité d'impression moyenne</li>
                                    <li>Vitesse d'impression plus lente</li>
                                    <li>Ne convient pas aux gros volumes</li>
                                    <li>Formats d'étiquettes limités</li>
                                  </ul>
                                </div>
                              </div>
                              
                              <div className="bg-primary/10 rounded-lg p-3 mt-3">
                                <p className="text-sm">
                                  <strong>Idéale pour :</strong> Les débutants qui veulent tester le business Amazon FBM 
                                  avec un petit budget et peu de volume.
                                </p>
                              </div>
                            </CardContent>
                          </Card>
                        </div>

                        <div className="bg-green-50 dark:bg-green-950/20 border border-green-200 dark:border-green-800 rounded-lg p-4 mt-6">
                          <h5 className="font-semibold mb-2">💡 Notre recommandation :</h5>
                          <p className="text-sm mb-2">
                            Pour 90% des vendeurs, la <strong>MUNBYN ITC 4x6</strong> est le meilleur choix. 
                            Elle offre un excellent équilibre entre prix, qualité et fonctionnalités.
                          </p>
                          <p className="text-sm">
                            Si tu fais plus de 50 expéditions par semaine, investis dans la <strong>Rollo</strong> 
                            pour sa fiabilité et sa rapidité.
                          </p>
                        </div>

                        <div className="bg-amber-50 dark:bg-amber-950/20 border border-amber-200 dark:border-amber-800 rounded-lg p-4 mt-4">
                          <p className="text-sm">
                            ⚠️ <strong>Important :</strong> Pense aussi à acheter des rouleaux d'étiquettes compatibles ! 
                            Le format standard est 4x6 pouces (10x15 cm) pour la plupart des expéditions Amazon.
                          </p>
                        </div>
                      </div>
                    </AccordionContent>
                  </AccordionItem>

                </Accordion>
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
