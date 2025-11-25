import { ArrowLeft, Building2, CheckCircle2, Percent, BookOpen, HelpCircle, FileText, Sparkles, Shield } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { useMarkAsRead } from '@/hooks/use-mark-as-read';
import { useScrollReveal } from '@/hooks/use-scroll-reveal';
import { cn } from '@/lib/utils';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

const CreationSociete = () => {
  const navigate = useNavigate();
  
  // Mark as read when visiting this page
  useMarkAsRead({ category: 'outils', subcategory: 'création-société' });

  // Animations
  const heroAnim = useScrollReveal({ animation: 'fade-up', delay: 100 });
  const promoAnim = useScrollReveal({ animation: 'scale', delay: 150 });
  const servicesAnim = useScrollReveal({ animation: 'fade-left', delay: 100 });
  const benefitsAnim = useScrollReveal({ animation: 'fade-right', delay: 100 });
  const ctaAnim = useScrollReveal({ animation: 'slide-rotate', delay: 100 });
  const guidesAnim = useScrollReveal({ animation: 'fade-up', delay: 100 });
  const supportAnim = useScrollReveal({ animation: 'scale', delay: 100 });

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      {/* SEO H1/H2 - Invisible */}
      <h1 className="sr-only">
        Créer sa société pour vendre sur Amazon FBA
      </h1>
      <h2 className="sr-only">
        Conseils sur le choix de statut, la fiscalité et la création d'entreprise pour les vendeurs Amazon
      </h2>
      
      <main className="flex-grow pt-24 md:pt-20">
        <div className="container mx-auto px-4 py-8">
          <div className="max-w-6xl mx-auto">
            {/* Header */}
            <div className="mb-8">
              <div className="flex items-center gap-3 mb-4">
                <button
                  onClick={() => navigate('/dashboard')}
                  className="bg-primary hover:bg-primary/90 p-3 md:p-2 rounded-full shadow-lg transition-all shrink-0"
                  aria-label="Retour au dashboard"
                >
                  <ArrowLeft className="w-6 h-6 md:w-5 md:h-5 text-white" />
                </button>
                <div>
                  <h1 className="text-3xl md:text-5xl font-bold flex items-center gap-3">
                    <span className="text-4xl">👨‍⚖️</span>
                    Créer sa société avec AMZing FBA
                  </h1>
                </div>
              </div>
            </div>

            <div className="space-y-8">
              {/* Hero Section */}
              <section 
                ref={heroAnim.ref}
                className={cn(
                  "relative overflow-hidden rounded-2xl bg-gradient-to-br from-green-600 via-green-500 to-emerald-500 p-8 md:p-12 shadow-2xl transition-all duration-700",
                  heroAnim.isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"
                )}
              >
                <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGRlZnM+PHBhdHRlcm4gaWQ9ImdyaWQiIHdpZHRoPSI2MCIgaGVpZ2h0PSI2MCIgcGF0dGVyblVuaXRzPSJ1c2VyU3BhY2VPblVzZSI+PHBhdGggZD0iTSAxMCAwIEwgMCAwIDAgMTAiIGZpbGw9Im5vbmUiIHN0cm9rZT0id2hpdGUiIHN0cm9rZS1vcGFjaXR5PSIwLjEiIHN0cm9rZS13aWR0aD0iMSIvPjwvcGF0dGVybj48L2RlZnM+PHJlY3Qgd2lkdGg9IjEwMCUiIGhlaWdodD0iMTAwJSIgZmlsbD0idXJsKCNncmlkKSIvPjwvc3ZnPg==')] opacity-30"></div>
                <div className="relative z-10 space-y-4 text-white/95">
                  <div className="flex items-center gap-3 mb-4">
                    <Sparkles className="w-10 h-10 text-yellow-300 animate-pulse" />
                    <h2 className="text-2xl md:text-3xl font-bold">
                      Bonne nouvelle : créer sa société pas cher, c'est possible !
                    </h2>
                  </div>
                  <p className="text-xl font-semibold">
                    Grâce à notre partenariat exclusif avec LegalPlace, tu peux créer ta micro-entreprise ou ta société à un prix imbattable.
                  </p>
                  <div className="bg-white/20 backdrop-blur-sm rounded-xl p-6 border-2 border-white/30">
                    <p className="text-lg">
                      Avec LegalPlace, tu peux créer ta micro-entreprise pour <span className="font-bold text-yellow-300 text-2xl">84,15 €</span> au lieu de <span className="line-through">99 €</span>
                    </p>
                  </div>
                </div>
              </section>

              {/* Promo Code Section */}
              <section 
                ref={promoAnim.ref}
                className={cn(
                  "transition-all duration-700",
                  promoAnim.isVisible ? "opacity-100 scale-100" : "opacity-0 scale-95"
                )}
              >
                <Card className="bg-gradient-to-br from-yellow-500/20 to-orange-500/20 border-yellow-500/40 border-2 shadow-xl">
                  <CardHeader>
                    <div className="flex items-center justify-between flex-wrap gap-4">
                      <div className="flex items-center gap-3">
                        <Percent className="w-8 h-8 text-yellow-600 dark:text-yellow-400" />
                        <CardTitle className="text-2xl md:text-3xl">Code Promo Exclusif</CardTitle>
                      </div>
                      <Badge className="bg-yellow-500 hover:bg-yellow-600 text-white text-lg px-4 py-2 font-mono">
                        AMZINGFBA15
                      </Badge>
                    </div>
                    <CardDescription className="text-lg">
                      Utilise ce code pour bénéficier de -15% sur tous les services LegalPlace
                    </CardDescription>
                  </CardHeader>
                </Card>
              </section>

              {/* Services with Discount */}
              <section 
                ref={servicesAnim.ref}
                className={cn(
                  "transition-all duration-700",
                  servicesAnim.isVisible ? "opacity-100 translate-x-0" : "opacity-0 -translate-x-10"
                )}
              >
                <Card className="border-green-500/30 hover:border-green-500/60 transition-all duration-300 hover:shadow-xl">
                  <CardHeader className="bg-gradient-to-r from-green-500/10 to-emerald-500/10">
                    <CardTitle className="text-2xl flex items-center gap-2">
                      <Shield className="w-6 h-6 text-green-500" />
                      Services disponibles avec -15%
                    </CardTitle>
                    <CardDescription className="text-base">
                      Tous ces services bénéficient de la réduction
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="pt-6">
                    <div className="grid md:grid-cols-2 gap-4">
                      <div className="flex items-start gap-3 p-4 rounded-lg bg-green-500/5 border border-green-500/20 hover:bg-green-500/10 transition-colors">
                        <CheckCircle2 className="w-6 h-6 text-green-500 shrink-0 mt-0.5" />
                        <div>
                          <p className="font-semibold text-lg">Création d'entreprises</p>
                          <p className="text-sm text-muted-foreground">SASU, SARL, SAS...</p>
                        </div>
                      </div>
                      <div className="flex items-start gap-3 p-4 rounded-lg bg-green-500/5 border border-green-500/20 hover:bg-green-500/10 transition-colors">
                        <CheckCircle2 className="w-6 h-6 text-green-500 shrink-0 mt-0.5" />
                        <div>
                          <p className="font-semibold text-lg">Création de micro-entreprises</p>
                          <p className="text-sm text-muted-foreground">Auto-entrepreneur</p>
                        </div>
                      </div>
                      <div className="flex items-start gap-3 p-4 rounded-lg bg-green-500/5 border border-green-500/20 hover:bg-green-500/10 transition-colors">
                        <CheckCircle2 className="w-6 h-6 text-green-500 shrink-0 mt-0.5" />
                        <div>
                          <p className="font-semibold text-lg">Changement de statut</p>
                          <p className="text-sm text-muted-foreground">Évolution de ta structure</p>
                        </div>
                      </div>
                      <div className="flex items-start gap-3 p-4 rounded-lg bg-green-500/5 border border-green-500/20 hover:bg-green-500/10 transition-colors">
                        <CheckCircle2 className="w-6 h-6 text-green-500 shrink-0 mt-0.5" />
                        <div>
                          <p className="font-semibold text-lg">Dissolution / Radiation</p>
                          <p className="text-sm text-muted-foreground">Fermeture simplifiée</p>
                        </div>
                      </div>
                      <div className="flex items-start gap-3 p-4 rounded-lg bg-green-500/5 border border-green-500/20 hover:bg-green-500/10 transition-colors md:col-span-2">
                        <CheckCircle2 className="w-6 h-6 text-green-500 shrink-0 mt-0.5" />
                        <div>
                          <p className="font-semibold text-lg">Domiciliation d'entreprise</p>
                          <p className="text-sm text-muted-foreground">Adresse professionnelle pour ton entreprise</p>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </section>

              {/* Benefits Section */}
              <section 
                ref={benefitsAnim.ref}
                className={cn(
                  "transition-all duration-700",
                  benefitsAnim.isVisible ? "opacity-100 translate-x-0" : "opacity-0 translate-x-10"
                )}
              >
                <Card className="border-blue-500/30 hover:border-blue-500/60 transition-all duration-300 hover:shadow-xl">
                  <CardHeader className="bg-gradient-to-r from-blue-500/10 to-indigo-500/10">
                    <CardTitle className="text-2xl flex items-center gap-2">
                      <Building2 className="w-6 h-6 text-blue-500" />
                      Pourquoi choisir LegalPlace ?
                    </CardTitle>
                    <CardDescription className="text-base">
                      Un service fiable et reconnu
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="pt-6">
                    <div className="space-y-4">
                      <div className="flex items-start gap-3">
                        <div className="p-2 rounded-lg bg-blue-500/10">
                          <FileText className="w-5 h-5 text-blue-500" />
                        </div>
                        <div>
                          <p className="font-semibold">Démarches 100% en ligne</p>
                          <p className="text-sm text-muted-foreground">Tout se fait depuis chez toi, sans déplacement</p>
                        </div>
                      </div>
                      <div className="flex items-start gap-3">
                        <div className="p-2 rounded-lg bg-blue-500/10">
                          <Shield className="w-5 h-5 text-blue-500" />
                        </div>
                        <div>
                          <p className="font-semibold">Accompagnement professionnel</p>
                          <p className="text-sm text-muted-foreground">Des experts juridiques t'accompagnent à chaque étape</p>
                        </div>
                      </div>
                      <div className="flex items-start gap-3">
                        <div className="p-2 rounded-lg bg-blue-500/10">
                          <Sparkles className="w-5 h-5 text-blue-500" />
                        </div>
                        <div>
                          <p className="font-semibold">Rapidité et simplicité</p>
                          <p className="text-sm text-muted-foreground">Création en quelques jours seulement</p>
                        </div>
                      </div>
                      <div className="flex items-start gap-3">
                        <div className="p-2 rounded-lg bg-blue-500/10">
                          <CheckCircle2 className="w-5 h-5 text-blue-500" />
                        </div>
                        <div>
                          <p className="font-semibold">Partenaire de confiance</p>
                          <p className="text-sm text-muted-foreground">Recommandé par AMZing FBA</p>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </section>

              {/* CTA Section */}
              <section 
                ref={ctaAnim.ref}
                className={cn(
                  "transition-all duration-700",
                  ctaAnim.isVisible ? "opacity-100 translate-x-0 rotate-0" : "opacity-0 translate-x-10 rotate-3"
                )}
              >
                <Card className="border-primary/40 bg-gradient-to-br from-primary/5 to-primary/10 border-2 shadow-xl hover:shadow-2xl transition-all duration-300 hover:scale-[1.02]">
                  <CardContent className="p-8 md:p-12">
                    <div className="text-center space-y-6">
                      <div className="space-y-3">
                        <h3 className="text-3xl md:text-4xl font-bold">
                          Prêt à créer ta société ?
                        </h3>
                        <p className="text-xl text-muted-foreground">
                          Profite de -15% avec le code <span className="font-bold text-primary">AMZINGFBA15</span>
                        </p>
                      </div>
                      <a 
                        href="https://www.legalplace.fr/" 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="inline-block"
                      >
                        <button className="bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white px-8 py-4 rounded-xl font-semibold text-lg shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105">
                          <Building2 className="w-5 h-5 inline mr-2" />
                          Créer ma société avec LegalPlace
                        </button>
                      </a>
                      <p className="text-sm text-muted-foreground">
                        N'oublie pas d'utiliser le code promo lors de ta commande
                      </p>
                    </div>
                  </CardContent>
                </Card>
              </section>

              {/* Guides Section */}
              <section 
                ref={guidesAnim.ref}
                className={cn(
                  "transition-all duration-700",
                  guidesAnim.isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"
                )}
              >
                <Card className="border-purple-500/30 hover:border-purple-500/60 transition-all duration-300 hover:shadow-xl">
                  <CardHeader className="bg-gradient-to-r from-purple-500/10 to-pink-500/10">
                    <CardTitle className="text-2xl flex items-center gap-2">
                      <BookOpen className="w-6 h-6 text-purple-500" />
                      Besoin d'aide pour choisir ?
                    </CardTitle>
                    <CardDescription className="text-base">
                      Consulte nos guides complets
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="pt-6">
                    <div className="space-y-4">
                      <p className="text-lg">
                        Pour bien comprendre le choix entre Auto-entrepreneur, SASU, SARL... lis notre guide complet qui t'explique tout en détail.
                      </p>
                      <div className="bg-purple-500/10 border border-purple-500/30 rounded-lg p-4">
                        <p className="font-semibold mb-2">📘 Ce que tu y trouveras :</p>
                        <ul className="space-y-1 text-muted-foreground">
                          <li>• Les différents statuts juridiques</li>
                          <li>• Les avantages et inconvénients de chaque statut</li>
                          <li>• Quel statut choisir selon ta situation</li>
                          <li>• Les démarches à suivre</li>
                        </ul>
                      </div>
                      <Link to="/guides">
                        <button className="w-full bg-purple-500 hover:bg-purple-600 text-white py-3 rounded-lg font-medium transition-colors">
                          <BookOpen className="w-4 h-4 inline mr-2" />
                          Consulter les guides
                        </button>
                      </Link>
                    </div>
                  </CardContent>
                </Card>
              </section>

              {/* Support Section */}
              <section 
                ref={supportAnim.ref}
                className={cn(
                  "transition-all duration-700",
                  supportAnim.isVisible ? "opacity-100 scale-100" : "opacity-0 scale-95"
                )}
              >
                <Card className="border-red-500/30 bg-gradient-to-br from-red-500/5 to-pink-500/5">
                  <CardHeader>
                    <CardTitle className="text-2xl flex items-center gap-2">
                      <HelpCircle className="w-6 h-6 text-red-500" />
                      Besoin d'aide personnalisée ?
                    </CardTitle>
                    <CardDescription className="text-base">
                      Notre équipe est là pour t'accompagner
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <p className="text-lg">
                      Si tu as encore des questions ou besoin d'aide personnelle pour choisir le bon statut juridique, n'hésite pas à nous contacter.
                    </p>
                    <Link to="/support">
                      <button className="w-full bg-red-500 hover:bg-red-600 text-white py-3 rounded-lg font-medium transition-colors">
                        <HelpCircle className="w-4 h-4 inline mr-2" />
                        Ouvrir un ticket de support
                      </button>
                    </Link>
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

export default CreationSociete;
