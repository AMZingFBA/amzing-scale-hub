import { ArrowLeft, CheckCircle2, Building2, Store, Euro, Wrench, Search, CreditCard, Users, BookOpen, ShoppingCart, AlertCircle } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { useMarkAsRead } from '@/hooks/use-mark-as-read';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

const Debuter = () => {
  const navigate = useNavigate();

  // Mark as read when visiting this page
  useMarkAsRead({ category: 'introduction', subcategory: 'débuter' });

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-grow pt-24 md:pt-20">
        <div className="container mx-auto px-4 py-8">
          <div className="max-w-6xl mx-auto">
            {/* Header */}
            <div className="mb-8">
              <div className="flex items-center gap-3 mb-4">
                <button
                  onClick={() => navigate('/dashboard')}
                  className="bg-[#FF9900] hover:bg-[#FF9900]/90 p-3 md:p-2 rounded-full shadow-lg transition-all shrink-0"
                  aria-label="Retour au dashboard"
                >
                  <ArrowLeft className="w-6 h-6 md:w-5 md:h-5 text-white" />
                </button>
                <div>
                  <h1 className="text-3xl md:text-5xl font-bold flex items-center gap-3">
                    <span className="text-4xl">🎉</span>
                    Bienvenue sur AMZing FBA !
                  </h1>
                </div>
              </div>
            </div>

            <div className="space-y-8">
              {/* Hero Welcome Section */}
              <section className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-primary via-primary/90 to-primary/70 p-8 md:p-12 shadow-2xl animate-fade-in">
                <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGRlZnM+PHBhdHRlcm4gaWQ9ImdyaWQiIHdpZHRoPSI2MCIgaGVpZ2h0PSI2MCIgcGF0dGVyblVuaXRzPSJ1c2VyU3BhY2VPblVzZSI+PHBhdGggZD0iTSAxMCAwIEwgMCAwIDAgMTAiIGZpbGw9Im5vbmUiIHN0cm9rZT0id2hpdGUiIHN0cm9rZS1vcGFjaXR5PSIwLjEiIHN0cm9rZS13aWR0aD0iMSIvPjwvcGF0dGVybj48L2RlZnM+PHJlY3Qgd2lkdGg9IjEwMCUiIGhlaWdodD0iMTAwJSIgZmlsbD0idXJsKCNncmlkKSIvPjwvc3ZnPg==')] opacity-30"></div>
                <div className="relative z-10 space-y-4 text-white/95 text-lg">
                  <p className="flex items-center gap-2">
                    Nous sommes ravis de t'accueillir parmi les membres AMZing FBA <span className="text-2xl">🤝</span>
                  </p>
                  <p className="font-semibold text-xl">
                    Prépare-toi : tu entres dans l'un des meilleurs écosystèmes francophones pour réussir sur Amazon FBA/FBM.
                  </p>
                  <p className="text-white/90">
                    Lis tout attentivement : tu vas comprendre exactement comment démarrer, comment utiliser ton abonnement et comment faire tes premiers bénéfices rapidement. ⬇️
                  </p>
                </div>
              </section>

              {/* Quick Start */}
              <section className="animate-fade-in" style={{ animationDelay: '0.1s' }}>
                <Card className="bg-gradient-to-br from-orange-500/10 to-red-500/10 border-orange-500/30">
                  <CardHeader>
                    <CardTitle className="text-2xl md:text-3xl flex items-center gap-3">
                      <span className="text-3xl">🔥</span>
                      Tout comprendre en 2 minutes
                    </CardTitle>
                    <CardDescription className="text-lg">
                      Pour commencer l'achat-revente sur Amazon, tu dois maîtriser quelques bases essentielles.
                      Voici les étapes à suivre dans l'ordre, simples et efficaces :
                    </CardDescription>
                  </CardHeader>
                </Card>
              </section>

              {/* Step 1: Read Guides */}
              <section className="animate-fade-in" style={{ animationDelay: '0.2s' }}>
                <Card className="border-blue-500/30 hover:border-blue-500/60 transition-all duration-300 hover:shadow-xl hover:scale-[1.02]">
                  <CardHeader className="bg-gradient-to-r from-blue-500/10 to-blue-600/10">
                    <div className="flex items-start gap-4">
                      <div className="p-3 rounded-xl bg-blue-500 text-white text-2xl font-bold shadow-lg">2</div>
                      <div className="flex-1">
                        <CardTitle className="text-2xl flex items-center gap-2 mb-2">
                          <BookOpen className="w-6 h-6 text-blue-500" />
                          Débute correctement
                        </CardTitle>
                        <CardDescription className="text-base">
                          La base solide pour ton succès
                        </CardDescription>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-4 pt-6">
                    <p className="text-lg">
                      Si tu es débutant → va lire nos guides complets.
                    </p>
                    <p className="text-muted-foreground">
                      Tu y trouveras tout : FBA, FBM, produits rentables, règles Amazon, taxes, etc.
                    </p>
                    <Link to="/guides">
                      <button className="w-full bg-blue-500 hover:bg-blue-600 text-white py-3 rounded-lg font-medium transition-colors">
                        <BookOpen className="w-4 h-4 inline mr-2" />
                        Consulter les guides
                      </button>
                    </Link>
                  </CardContent>
                </Card>
              </section>

              {/* Step 2: Create Company */}
              <section className="animate-fade-in" style={{ animationDelay: '0.3s' }}>
                <Card className="border-green-500/30 hover:border-green-500/60 transition-all duration-300 hover:shadow-xl hover:scale-[1.02]">
                  <CardHeader className="bg-gradient-to-r from-green-500/10 to-green-600/10">
                    <div className="flex items-start gap-4">
                      <div className="p-3 rounded-xl bg-green-500 text-white text-2xl font-bold shadow-lg">3</div>
                      <div className="flex-1">
                        <CardTitle className="text-2xl flex items-center gap-2 mb-2">
                          <Building2 className="w-6 h-6 text-green-500" />
                          Créer ta société
                        </CardTitle>
                        <CardDescription className="text-base">
                          Obligatoire pour vendre sur Amazon
                        </CardDescription>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-4 pt-6">
                    <p className="text-lg font-semibold">
                      Pour vendre sur Amazon, tu dois avoir un statut professionnel :
                    </p>
                    <ul className="space-y-2">
                      <li className="flex items-center gap-2">
                        <CheckCircle2 className="w-5 h-5 text-green-500" />
                        <span>Micro-entreprise</span>
                      </li>
                      <li className="flex items-center gap-2">
                        <CheckCircle2 className="w-5 h-5 text-green-500" />
                        <span>SASU</span>
                      </li>
                      <li className="flex items-center gap-2">
                        <CheckCircle2 className="w-5 h-5 text-green-500" />
                        <span>SARL</span>
                      </li>
                      <li className="flex items-center gap-2">
                        <CheckCircle2 className="w-5 h-5 text-green-500" />
                        <span>Ou toute autre forme de société adaptée</span>
                      </li>
                    </ul>
                    <div className="bg-yellow-500/10 border border-yellow-500/30 rounded-lg p-4 flex items-start gap-3">
                      <AlertCircle className="w-5 h-5 text-yellow-500 shrink-0 mt-0.5" />
                      <p className="text-sm">
                        Il faut aussi ajouter l'activité e-commerce dans ton entreprise.
                      </p>
                    </div>
                    <div className="bg-muted/50 rounded-lg p-4 space-y-2">
                      <p className="font-medium">
                        Tu peux créer ta société facilement avec notre partenaire.
                      </p>
                      <p className="text-sm text-muted-foreground">
                        Avec LegalPlace, tout est simple, rapide et fiable.
                      </p>
                    </div>
                    <Link to="/contact">
                      <button className="w-full bg-green-500 hover:bg-green-600 text-white py-3 rounded-lg font-medium transition-colors">
                        <Building2 className="w-4 h-4 inline mr-2" />
                        En savoir plus sur la création de société
                      </button>
                    </Link>
                  </CardContent>
                </Card>
              </section>

              {/* Step 3: Amazon Seller Account */}
              <section className="animate-fade-in" style={{ animationDelay: '0.4s' }}>
                <Card className="border-yellow-500/30 hover:border-yellow-500/60 transition-all duration-300 hover:shadow-xl hover:scale-[1.02]">
                  <CardHeader className="bg-gradient-to-r from-yellow-500/10 to-yellow-600/10">
                    <div className="flex items-start gap-4">
                      <div className="p-3 rounded-xl bg-yellow-500 text-white text-2xl font-bold shadow-lg">4</div>
                      <div className="flex-1">
                        <CardTitle className="text-2xl flex items-center gap-2 mb-2">
                          <Store className="w-6 h-6 text-yellow-500" />
                          Créer ton compte vendeur Amazon
                        </CardTitle>
                        <CardDescription className="text-base">
                          Amazon Seller - Ta boutique professionnelle
                        </CardDescription>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-4 pt-6">
                    <p className="text-lg">
                      Quand ta société est créée → tu peux t'inscrire sur Amazon.
                    </p>
                    <div className="bg-gradient-to-r from-[#FF9900]/10 to-[#FF9900]/5 border border-[#FF9900]/30 rounded-lg p-5">
                      <div className="flex items-start gap-3 mb-3">
                        <Euro className="w-6 h-6 text-[#FF9900] shrink-0" />
                        <div>
                          <p className="font-semibold text-lg mb-2">Coût Amazon :</p>
                          <ul className="space-y-1 text-muted-foreground">
                            <li>– 39 €/mois (hors TVA)</li>
                            <li>– + frais de vente par produit</li>
                          </ul>
                        </div>
                      </div>
                    </div>
                    <p className="text-sm text-muted-foreground italic">
                      Ton compte Seller est la base de ton business = prends ton temps pour bien le remplir.
                    </p>
                    <a href="https://sell.amazon.fr/" target="_blank" rel="noopener noreferrer">
                      <button className="w-full bg-[#FF9900] hover:bg-[#FF9900]/90 text-white py-3 rounded-lg font-medium transition-colors">
                        <ShoppingCart className="w-4 h-4 inline mr-2" />
                        Créer mon compte Amazon Seller
                      </button>
                    </a>
                  </CardContent>
                </Card>
              </section>

              {/* Step 4: SellerAmp */}
              <section className="animate-fade-in" style={{ animationDelay: '0.5s' }}>
                <Card className="border-purple-500/30 hover:border-purple-500/60 transition-all duration-300 hover:shadow-xl hover:scale-[1.02]">
                  <CardHeader className="bg-gradient-to-r from-purple-500/10 to-purple-600/10">
                    <div className="flex items-start gap-4">
                      <div className="p-3 rounded-xl bg-purple-500 text-white text-2xl font-bold shadow-lg">5</div>
                      <div className="flex-1">
                        <CardTitle className="text-2xl flex items-center gap-2 mb-2">
                          <Wrench className="w-6 h-6 text-purple-500" />
                          L'outil obligatoire : SellerAmp
                        </CardTitle>
                        <CardDescription className="text-base">
                          L'outil N°1 pour scanner et analyser tes produits
                        </CardDescription>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-4 pt-6">
                    <p className="text-lg font-semibold">
                      SellerAmp est l'outil N°1 pour :
                    </p>
                    <div className="grid md:grid-cols-2 gap-3">
                      <div className="flex items-start gap-2">
                        <CheckCircle2 className="w-5 h-5 text-purple-500 shrink-0 mt-0.5" />
                        <span>Scanner les codes-barres</span>
                      </div>
                      <div className="flex items-start gap-2">
                        <CheckCircle2 className="w-5 h-5 text-purple-500 shrink-0 mt-0.5" />
                        <span>Vérifier si un produit est rentable</span>
                      </div>
                      <div className="flex items-start gap-2">
                        <CheckCircle2 className="w-5 h-5 text-purple-500 shrink-0 mt-0.5" />
                        <span>Vérifier si tu es autorisé à le vendre</span>
                      </div>
                      <div className="flex items-start gap-2">
                        <CheckCircle2 className="w-5 h-5 text-purple-500 shrink-0 mt-0.5" />
                        <span>Voir les ventes/mois</span>
                      </div>
                      <div className="flex items-start gap-2">
                        <CheckCircle2 className="w-5 h-5 text-purple-500 shrink-0 mt-0.5" />
                        <span>Voir les ROI, FEES Amazon</span>
                      </div>
                      <div className="flex items-start gap-2">
                        <CheckCircle2 className="w-5 h-5 text-purple-500 shrink-0 mt-0.5" />
                        <span>Analyser le BSR</span>
                      </div>
                    </div>
                    <div className="bg-red-500/10 border border-red-500/30 rounded-lg p-4">
                      <p className="font-semibold text-center">
                        Sans SellerAmp → impossible d'avancer proprement.
                      </p>
                    </div>
                    <a href="https://selleramp.idevaffiliate.com/2167.html" target="_blank" rel="noopener noreferrer">
                      <button className="w-full bg-purple-500 hover:bg-purple-600 text-white py-3 rounded-lg font-medium transition-colors">
                        <Search className="w-4 h-4 inline mr-2" />
                        Découvrir SellerAmp
                      </button>
                    </a>
                  </CardContent>
                </Card>
              </section>

              {/* Step 5: Qonto Bank */}
              <section className="animate-fade-in" style={{ animationDelay: '0.6s' }}>
                <Card className="border-cyan-500/30 hover:border-cyan-500/60 transition-all duration-300 hover:shadow-xl hover:scale-[1.02]">
                  <CardHeader className="bg-gradient-to-r from-cyan-500/10 to-cyan-600/10">
                    <div className="flex items-start gap-4">
                      <div className="p-3 rounded-xl bg-cyan-500 text-white text-2xl font-bold shadow-lg">6</div>
                      <div className="flex-1">
                        <CardTitle className="text-2xl flex items-center gap-2 mb-2">
                          <CreditCard className="w-6 h-6 text-cyan-500" />
                          Choisir ton compte bancaire pro
                        </CardTitle>
                        <CardDescription className="text-base">
                          Recommandé : Qonto
                        </CardDescription>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-4 pt-6">
                    <p className="text-lg font-semibold">
                      Pourquoi Qonto ?
                    </p>
                    <div className="space-y-2">
                      <div className="flex items-start gap-2">
                        <CheckCircle2 className="w-5 h-5 text-cyan-500 shrink-0 mt-0.5" />
                        <span>Ultra simple</span>
                      </div>
                      <div className="flex items-start gap-2">
                        <CheckCircle2 className="w-5 h-5 text-cyan-500 shrink-0 mt-0.5" />
                        <span>Comptabilité automatisée</span>
                      </div>
                      <div className="flex items-start gap-2">
                        <CheckCircle2 className="w-5 h-5 text-cyan-500 shrink-0 mt-0.5" />
                        <span>Factures / reçus faciles</span>
                      </div>
                      <div className="flex items-start gap-2">
                        <CheckCircle2 className="w-5 h-5 text-cyan-500 shrink-0 mt-0.5" />
                        <span>Support client très réactif</span>
                      </div>
                      <div className="flex items-start gap-2">
                        <CheckCircle2 className="w-5 h-5 text-cyan-500 shrink-0 mt-0.5" />
                        <span>Parfait si tu as des associés (multi-utilisateurs)</span>
                      </div>
                    </div>
                    <a href="https://qonto.com/r/i79cui" target="_blank" rel="noopener noreferrer">
                      <button className="w-full bg-cyan-500 hover:bg-cyan-600 text-white py-3 rounded-lg font-medium transition-colors">
                        <CreditCard className="w-4 h-4 inline mr-2" />
                        Ouvrir mon compte Qonto
                      </button>
                    </a>
                  </CardContent>
                </Card>
              </section>

              {/* Step 6: Help */}
              <section className="animate-fade-in" style={{ animationDelay: '0.7s' }}>
                <Card className="border-primary/30 bg-gradient-to-br from-primary/5 to-primary/10">
                  <CardHeader>
                    <div className="flex items-start gap-4">
                      <div className="p-3 rounded-xl bg-primary text-white text-2xl font-bold shadow-lg">7</div>
                      <div className="flex-1">
                        <CardTitle className="text-2xl flex items-center gap-2 mb-2">
                          <Users className="w-6 h-6 text-primary" />
                          Besoin d'aide ?
                        </CardTitle>
                        <CardDescription className="text-base">
                          La communauté est là pour toi
                        </CardDescription>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <p className="text-lg">
                      Chez AMZing FBA, tu n'es pas seul : on t'explique chaque étape pour réussir.
                    </p>
                    <div className="grid md:grid-cols-2 gap-4">
                      <Link to="/chat">
                        <button className="w-full border border-primary hover:bg-primary/10 py-4 rounded-lg transition-colors">
                          <div className="flex flex-col items-start gap-1 w-full px-4">
                            <span className="font-semibold">💬 Chat général</span>
                            <span className="text-xs text-muted-foreground">Pose tes questions à la communauté</span>
                          </div>
                        </button>
                      </Link>
                      <Link to="/support">
                        <button className="w-full border border-primary hover:bg-primary/10 py-4 rounded-lg transition-colors">
                          <div className="flex flex-col items-start gap-1 w-full px-4">
                            <span className="font-semibold">📥 Support privé</span>
                            <span className="text-xs text-muted-foreground">Aide personnalisée</span>
                          </div>
                        </button>
                      </Link>
                    </div>
                  </CardContent>
                </Card>
              </section>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Debuter;
