import { useAuth } from '@/hooks/use-auth';
import { useUnreadMessages } from '@/hooks/use-unread-messages';
import { Navigate, Link } from 'react-router-dom';
import { useState } from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { ScrollArea } from '@/components/ui/scroll-area';
import { 
  Crown, BookOpen, Bell, CheckCircle, DollarSign, HelpCircle, 
  Settings, Eye, FileText, Star, Calculator, Sparkles, Package,
  Truck, Megaphone, Newspaper, MessageCircle, LightbulbIcon, Trophy,
  ShoppingCart, Info, Users, Lock, AlertCircle, Scale, Database, Shield
} from 'lucide-react';

interface CategoryItemProps {
  icon: React.ElementType;
  label: string;
  link?: string;
  onClick?: () => void;
  badge?: number;
}

const CategoryItem = ({ icon: Icon, label, link, onClick, badge }: CategoryItemProps) => {
  const content = (
    <Card className="hover:bg-accent/50 transition-colors cursor-pointer" onClick={onClick}>
      <CardContent className="p-4">
        <div className="flex items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <Icon className="w-5 h-5 text-primary" />
            <span className="font-medium">{label}</span>
          </div>
          {badge && badge > 0 && (
            <Badge variant="destructive" className="ml-auto">
              {badge}
            </Badge>
          )}
        </div>
      </CardContent>
    </Card>
  );

  if (link) {
    return <Link to={link}>{content}</Link>;
  }

  return content;
};

const Dashboard = () => {
  const { user, isVIP, subscription, isLoading } = useAuth();
  const { unreadCount } = useUnreadMessages();
  const [rulesOpen, setRulesOpen] = useState(false);
  const [invoiceAuthOpen, setInvoiceAuthOpen] = useState(false);
  const [reviewsOpen, setReviewsOpen] = useState(false);

  const rules = [
    {
      icon: <Users className="w-5 h-5" />,
      title: "Respect et professionnalisme",
      content: "Chaque utilisateur s'engage à adopter une attitude respectueuse et bienveillante envers l'ensemble de la communauté. Les propos haineux, diffamatoires, discriminatoires ou irrespectueux ne sont pas tolérés. Les échanges doivent demeurer professionnels et constructifs, même en cas de désaccord."
    },
    {
      icon: <AlertCircle className="w-5 h-5" />,
      title: "Interdiction de publicité non autorisée",
      content: "La promotion de produits, services, formations ou plateformes externes sans autorisation préalable est strictement interdite. Toute forme de spam, de sollicitation commerciale non approuvée ou de messages répétitifs entraînera une suspension immédiate du compte utilisateur."
    },
    {
      icon: <Lock className="w-5 h-5" />,
      title: "Confidentialité et propriété intellectuelle",
      content: "L'ensemble des contenus, documents, stratégies, outils et méthodes partagés sur AMZing FBA sont strictement confidentiels et protégés. Toute reproduction, diffusion, revente ou partage en dehors de la plateforme est formellement interdite et constitue une violation de la propriété intellectuelle."
    },
    {
      icon: <CheckCircle className="w-5 h-5" />,
      title: "Utilisation appropriée de la plateforme",
      content: "Chaque fonctionnalité de la plateforme (formations, catalogue, outils, support) est conçue pour un usage spécifique. Merci d'utiliser les sections appropriées pour vos demandes et publications. Un usage abusif ou détourné des services pourra entraîner une limitation ou suspension d'accès."
    },
    {
      icon: <Scale className="w-5 h-5" />,
      title: "Intégrité et conformité légale",
      content: "AMZing FBA promeut un écosystème professionnel fondé sur l'intégrité et la conformité. Sont strictement interdits : les pratiques trompeuses, frauduleuses ou illégales, ainsi que le non-respect des conditions d'utilisation des marketplaces (Amazon, TikTok Shop, etc.). Tout manquement entraîne la fermeture immédiate du compte."
    },
    {
      icon: <FileText className="w-5 h-5" />,
      title: "Services logistiques et paiements",
      content: "L'accès aux services de stockage, d'emballage et d'expédition implique l'acceptation des conditions commerciales associées (délais, tarifs, volumes). Tout abus, impayé ou non-respect des conditions contractuelles peut entraîner la suspension du service et du compte utilisateur."
    },
    {
      icon: <Database className="w-5 h-5" />,
      title: "Protection des données personnelles",
      content: "Ne partagez jamais vos identifiants, coordonnées bancaires ou informations sensibles avec d'autres utilisateurs. En cas de doute, contactez exclusivement le support officiel AMZing FBA. La plateforme est conforme au RGPD et garantit la protection de vos données personnelles."
    },
    {
      icon: <Shield className="w-5 h-5" />,
      title: "Sanctions et modération",
      content: "Tout manquement aux présentes règles peut entraîner un avertissement, une suspension temporaire ou une exclusion définitive de la plateforme. L'équipe AMZing FBA se réserve le droit de supprimer tout contenu ou compte ne respectant pas ces règles d'utilisation."
    }
  ];

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  // Redirect to auth if not logged in
  if (!user) {
    return <Navigate to="/auth" replace />;
  }

  // Redirect to home if not VIP
  if (!isVIP) {
    return <Navigate to="/" replace />;
  }

  const daysRemaining = subscription?.expires_at 
    ? Math.ceil((new Date(subscription.expires_at).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24))
    : null;
  
  const isTrialActive = subscription?.is_trial && daysRemaining && daysRemaining > 0;

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-grow pt-20">
        <div className="container mx-auto px-4 py-8">
          <div className="max-w-4xl mx-auto">
            <div className="flex items-center gap-3 mb-8">
              <Crown className="w-8 h-8 text-primary" />
              <h1 className="text-4xl font-bold">Espace VIP</h1>
            </div>

            {isTrialActive && (
              <div className="bg-primary/10 border border-primary/20 rounded-lg p-4 mb-6">
                <p className="text-center">
                  🎉 Essai gratuit actif - Il vous reste <strong>{daysRemaining} jours</strong>
                </p>
              </div>
            )}

            <Accordion type="multiple" className="space-y-4">
              {/* INTRODUCTION */}
              <AccordionItem value="introduction" className="border rounded-lg px-6 bg-card">
                <AccordionTrigger className="hover:no-underline">
                  <div className="flex items-center gap-3">
                    <BookOpen className="w-6 h-6 text-primary" />
                    <span className="text-xl font-bold">INTRODUCTION</span>
                  </div>
                </AccordionTrigger>
                <AccordionContent>
                  <div className="grid gap-3 pt-2">
                    <CategoryItem icon={Bell} label="notifications" />
                    <CategoryItem icon={BookOpen} label="règles" onClick={() => setRulesOpen(true)} />
                    <CategoryItem icon={CheckCircle} label="débuter" />
                    <CategoryItem icon={BookOpen} label="guides" link="/guides" />
                    <CategoryItem icon={DollarSign} label="affiliation" />
                    <CategoryItem icon={HelpCircle} label="support" link="/support" badge={unreadCount} />
                  </div>
                </AccordionContent>
              </AccordionItem>

              {/* OUTILS */}
              <AccordionItem value="outils" className="border rounded-lg px-6 bg-card">
                <AccordionTrigger className="hover:no-underline">
                  <div className="flex items-center gap-3">
                    <Settings className="w-6 h-6 text-primary" />
                    <span className="text-xl font-bold">OUTILS</span>
                  </div>
                </AccordionTrigger>
                <AccordionContent>
                  <div className="grid gap-3 pt-2">
                    <CategoryItem icon={Eye} label="création-société" />
                    <CategoryItem icon={FileText} label="facture-autorisation" onClick={() => setInvoiceAuthOpen(true)} />
                    <CategoryItem icon={DollarSign} label="cashback" />
                    <CategoryItem icon={Star} label="avis" onClick={() => setReviewsOpen(true)} />
                    <CategoryItem icon={Calculator} label="fiscalité-simplifiée" />
                  </div>
                </AccordionContent>
              </AccordionItem>

              {/* PRODUITS GAGNANTS */}
              <AccordionItem value="produits" className="border rounded-lg px-6 bg-card">
                <AccordionTrigger className="hover:no-underline">
                  <div className="flex items-center gap-3">
                    <Sparkles className="w-6 h-6 text-primary" />
                    <span className="text-xl font-bold">PRODUITS GAGNANTS</span>
                  </div>
                </AccordionTrigger>
                <AccordionContent>
                  <div className="grid gap-3 pt-2">
                    <CategoryItem icon={Sparkles} label="produits-find" />
                    <CategoryItem icon={Sparkles} label="produits-qogita" />
                    <CategoryItem icon={Sparkles} label="produits-eany" />
                    <CategoryItem icon={Package} label="grossistes" />
                    <CategoryItem icon={DollarSign} label="promotions" />
                    <CategoryItem icon={FileText} label="sitelist" />
                  </div>
                </AccordionContent>
              </AccordionItem>

              {/* EXPÉDITION */}
              <AccordionItem value="expedition" className="border rounded-lg px-6 bg-card">
                <AccordionTrigger className="hover:no-underline">
                  <div className="flex items-center gap-3">
                    <Truck className="w-6 h-6 text-primary" />
                    <span className="text-xl font-bold">EXPÉDITION</span>
                  </div>
                </AccordionTrigger>
                <AccordionContent>
                  <div className="grid gap-3 pt-2">
                    <CategoryItem icon={Settings} label="fournitures" />
                    <CategoryItem icon={Package} label="cartons" />
                  </div>
                </AccordionContent>
              </AccordionItem>

              {/* INFORMATIONS */}
              <AccordionItem value="informations" className="border rounded-lg px-6 bg-card">
                <AccordionTrigger className="hover:no-underline">
                  <div className="flex items-center gap-3">
                    <Bell className="w-6 h-6 text-primary" />
                    <span className="text-xl font-bold">INFORMATIONS</span>
                  </div>
                </AccordionTrigger>
                <AccordionContent>
                  <div className="grid gap-3 pt-2">
                    <CategoryItem icon={Megaphone} label="annonces" />
                    <CategoryItem icon={Newspaper} label="actualités" />
                  </div>
                </AccordionContent>
              </AccordionItem>

              {/* COMMUNAUTÉ */}
              <AccordionItem value="communaute" className="border rounded-lg px-6 bg-card">
                <AccordionTrigger className="hover:no-underline">
                  <div className="flex items-center gap-3">
                    <MessageCircle className="w-6 h-6 text-primary" />
                    <span className="text-xl font-bold">COMMUNAUTÉ</span>
                  </div>
                </AccordionTrigger>
                <AccordionContent>
                  <div className="grid gap-3 pt-2">
                    <CategoryItem icon={MessageCircle} label="général" link="/chat" />
                    <CategoryItem icon={LightbulbIcon} label="suggestions" link="/suggestions" />
                    <CategoryItem icon={Trophy} label="succès" link="/success" />
                    <CategoryItem icon={ShoppingCart} label="ventes" link="/sales" />
                  </div>
                </AccordionContent>
              </AccordionItem>

              {/* MARKETPLACE */}
              <AccordionItem value="marketplace" className="border rounded-lg px-6 bg-card">
                <AccordionTrigger className="hover:no-underline">
                  <div className="flex items-center gap-3">
                    <ShoppingCart className="w-6 h-6 text-primary" />
                    <span className="text-xl font-bold">MARKETPLACE</span>
                  </div>
                </AccordionTrigger>
                <AccordionContent>
                  <div className="grid gap-3 pt-2">
                    <CategoryItem icon={ShoppingCart} label="acheter" link="/acheter" />
                    <CategoryItem icon={Package} label="vendre" link="/vendre" />
                  </div>
                </AccordionContent>
              </AccordionItem>

              {/* GESTION PRODUITS */}
              <AccordionItem value="gestion" className="border rounded-lg px-6 bg-card">
                <AccordionTrigger className="hover:no-underline">
                  <div className="flex items-center gap-3">
                    <Package className="w-6 h-6 text-primary" />
                    <span className="text-xl font-bold">GESTION PRODUITS</span>
                  </div>
                </AccordionTrigger>
                <AccordionContent>
                  <div className="grid gap-3 pt-2">
                    <CategoryItem icon={Info} label="informations" />
                    <CategoryItem icon={Package} label="catalogue-produits" />
                    <CategoryItem icon={MessageCircle} label="questions" />
                  </div>
                </AccordionContent>
              </AccordionItem>
            </Accordion>
          </div>
        </div>
      </main>
      <Footer />

      {/* Rules Dialog */}
      <Dialog open={rulesOpen} onOpenChange={setRulesOpen}>
        <DialogContent className="max-w-4xl max-h-[80vh]">
          <DialogHeader>
            <DialogTitle className="text-2xl">Règles d'utilisation</DialogTitle>
            <DialogDescription>
              Votre plateforme professionnelle dédiée à l'achat-revente, à la formation et aux outils d'optimisation Amazon FBA/FBM et e-commerce
            </DialogDescription>
          </DialogHeader>
          <ScrollArea className="h-[60vh] pr-4">
            <div className="space-y-4">
              <Card className="border-primary/20">
                <CardContent className="pt-6">
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    Afin de garantir un environnement sûr, professionnel et collaboratif, chaque membre s'engage à respecter les règles d'utilisation ci-dessous. En accédant à AMZing FBA, vous confirmez avoir lu, compris et accepté l'ensemble de ces conditions.
                  </p>
                </CardContent>
              </Card>

              {rules.map((rule, index) => (
                <Card key={index}>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-3 text-base">
                      <div className="p-2 rounded-lg bg-primary/10 text-primary">
                        {rule.icon}
                      </div>
                      <span>{index + 1}. {rule.title}</span>
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-muted-foreground leading-relaxed">
                      {rule.content}
                    </p>
                  </CardContent>
                </Card>
              ))}

              <Card className="bg-primary/5 border-primary/20">
                <CardContent className="pt-6 text-center">
                  <p className="text-sm font-semibold text-foreground">
                    Merci de contribuer à faire d'AMZing FBA un espace professionnel, fiable et performant 💪
                  </p>
                </CardContent>
              </Card>
            </div>
          </ScrollArea>
        </DialogContent>
      </Dialog>

      {/* Invoice Authorization Dialog */}
      <Dialog open={invoiceAuthOpen} onOpenChange={setInvoiceAuthOpen}>
        <DialogContent className="max-w-4xl max-h-[80vh]">
          <DialogHeader>
            <DialogTitle className="text-2xl flex items-center gap-2">
              <FileText className="w-6 h-6 text-primary" />
              Vos autorisations de ventes assurées avec AMZing FBA ! 📝
            </DialogTitle>
            <DialogDescription>
              Service professionnel d'accompagnement pour l'obtention des autorisations de marques sur Amazon
            </DialogDescription>
          </DialogHeader>
          <ScrollArea className="h-[60vh] pr-4">
            <div className="space-y-6">
              <Card className="border-primary/20 bg-primary/5">
                <CardContent className="pt-6">
                  <p className="text-base leading-relaxed">
                    Nous proposons un service d'assistance spécialisé pour faciliter l'obtention des autorisations de vente de marques sur la plateforme Amazon. Notre expertise vous permet de naviguer efficacement dans les processus de validation imposés par Amazon.
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-lg">
                    <CheckCircle className="w-5 h-5 text-primary" />
                    Procédure pour obtenir une autorisation
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <p className="text-sm leading-relaxed">
                    Pour solliciter une autorisation de vente pour la marque de votre choix, veuillez suivre ces étapes :
                  </p>
                  
                  <div className="bg-accent/50 rounded-lg p-4">
                    <p className="font-semibold mb-3">1️⃣ Créer une demande d'assistance</p>
                    <Link to="/support?category=facture_autorisation">
                      <div className="flex items-center gap-2 p-3 rounded-md border border-primary/30 bg-primary/5 hover:bg-primary/10 hover:border-primary/50 transition-all cursor-pointer group">
                        <MessageCircle className="w-5 h-5 text-primary group-hover:scale-110 transition-transform" />
                        <span className="text-primary font-medium group-hover:underline">Accéder au service support - Facture & Autorisation</span>
                      </div>
                    </Link>
                  </div>

                  <div className="space-y-2">
                    <p className="font-semibold">2️⃣ Informations requises à communiquer :</p>
                    <ul className="list-none space-y-2 ml-4">
                      <li className="flex items-start gap-2">
                        <span className="text-primary font-bold">•</span>
                        <span>Adresse postale officielle de votre entreprise</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="text-primary font-bold">•</span>
                        <span>Dénomination sociale complète de votre entreprise</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="text-primary font-bold">•</span>
                        <span>Code EAN du produit concerné</span>
                      </li>
                    </ul>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-lg">
                    <Info className="w-5 h-5 text-primary" />
                    Contexte réglementaire Amazon
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground leading-relaxed mb-4">
                    Amazon applique des critères d'acceptation de plus en plus stricts pour les vendeurs souhaitant commercialiser certaines marques. Cette politique vise à garantir la traçabilité et l'authenticité des produits distribués sur la plateforme.
                  </p>
                  
                  <div className="space-y-4">
                    <div className="border-l-4 border-primary/30 pl-4">
                      <h4 className="font-semibold mb-2">Scénario 1 : Autorisation sans justificatif</h4>
                      <p className="text-sm text-muted-foreground">
                        Dans de rares cas, Amazon accorde l'autorisation de commercialisation sans exiger de facture d'achat.
                      </p>
                    </div>

                    <div className="border-l-4 border-primary/30 pl-4">
                      <h4 className="font-semibold mb-2">Scénario 2 : Validation automatisée</h4>
                      <p className="text-sm text-muted-foreground">
                        Amazon utilise un système automatisé d'évaluation des demandes. Les factures provenant d'enseignes reconnues (ex : grandes surfaces) sont généralement validées en quelques minutes si elles correspondent aux critères internes d'Amazon.
                      </p>
                    </div>

                    <div className="border-l-4 border-amber-500/50 pl-4">
                      <h4 className="font-semibold mb-2">Scénario 3 : Révision manuelle approfondie</h4>
                      <p className="text-sm text-muted-foreground mb-3">
                        Lorsque la validation automatique échoue, un examen manuel est déclenché. Les documents suivants peuvent être requis :
                      </p>
                      <ul className="list-disc list-inside text-sm text-muted-foreground space-y-1 ml-2">
                        <li>Facture émise par un fabricant, fournisseur ou distributeur agréé</li>
                        <li>Lettre d'autorisation officielle de la marque</li>
                        <li>Justificatif de traçabilité complet de la chaîne d'approvisionnement</li>
                      </ul>
                      <p className="text-sm text-muted-foreground mt-3 italic">
                        Ces exigences sont particulièrement contraignantes et difficiles à obtenir pour de nombreux vendeurs.
                      </p>
                    </div>

                    <div className="border-l-4 border-destructive/50 pl-4">
                      <h4 className="font-semibold mb-2">Scénario 4 : Compte non éligible</h4>
                      <p className="text-sm text-muted-foreground">
                        Si votre demande est refusée sans justification détaillée, votre compte vendeur n'est actuellement pas éligible pour cette marque spécifique. Il est recommandé de poursuivre vos activités avec d'autres produits afin de renforcer progressivement la crédibilité de votre compte.
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-accent/30">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-lg">
                    <LightbulbIcon className="w-5 h-5 text-primary" />
                    Recommandations stratégiques
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <p className="text-sm leading-relaxed">
                    Amazon évalue la fiabilité de votre compte vendeur selon plusieurs critères essentiels :
                  </p>
                  <ul className="list-disc list-inside text-sm space-y-2 ml-2 text-muted-foreground">
                    <li>Historique et volume des ventes réalisées</li>
                    <li>État de santé global du compte (taux de défauts, réclamations, retours)</li>
                    <li>Nombre et qualité des évaluations client</li>
                  </ul>
                  <p className="text-sm font-semibold mt-4">
                    Plus votre activité est régulière et conforme aux standards Amazon, plus vous obtiendrez de facilités pour les autorisations de nouvelles marques.
                  </p>
                </CardContent>
              </Card>

              <Card className="border-amber-500/50 bg-amber-500/5">
                <CardContent className="pt-6">
                  <p className="text-sm text-center font-semibold">
                    🚨 Ces informations concernent principalement les vendeurs récents ou disposant d'un historique limité sur Amazon.
                  </p>
                  <p className="text-xs text-center text-muted-foreground mt-2">
                    Cette analyse est basée sur notre expertise terrain et nos échanges réguliers avec les équipes Amazon concernant les demandes d'autorisation de nos membres.
                  </p>
                </CardContent>
              </Card>
            </div>
          </ScrollArea>
        </DialogContent>
      </Dialog>

      {/* Reviews Dialog */}
      <Dialog open={reviewsOpen} onOpenChange={setReviewsOpen}>
        <DialogContent className="max-w-4xl max-h-[80vh]">
          <DialogHeader>
            <DialogTitle className="text-2xl flex items-center gap-2">
              <Star className="w-6 h-6 text-primary" />
              Plus d'avis, plus de ventes. On s'entraide ? ⭐
            </DialogTitle>
            <DialogDescription>
              Programme d'entraide communautaire pour développer la crédibilité de votre boutique Amazon
            </DialogDescription>
          </DialogHeader>
          <ScrollArea className="h-[60vh] pr-4">
            <div className="space-y-6">
              <Card className="border-primary/20 bg-primary/5">
                <CardContent className="pt-6">
                  <p className="text-base leading-relaxed">
                    Nous encourageons l'entraide au sein de la communauté AMZing FBA afin que chaque membre puisse bénéficier d'un avantage concret. Cette fonctionnalité a pour objectif de vous accompagner dans l'augmentation des avis positifs sur votre boutique Amazon.
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-lg">
                    <CheckCircle className="w-5 h-5 text-primary" />
                    Comment ça fonctionne ? 🤝
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <p className="text-sm leading-relaxed">
                    Le principe repose sur la mise en relation de deux membres du groupe via la création d'un ticket support. Chaque participant endosse alternativement le rôle de vendeur et d'acheteur.
                  </p>

                  <div className="bg-accent/50 rounded-lg p-4">
                    <p className="font-semibold mb-3">📋 Pour participer au programme d'entraide</p>
                    <Link to="/support?category=avis">
                      <div className="flex items-center gap-2 p-3 rounded-md border border-primary/30 bg-primary/5 hover:bg-primary/10 hover:border-primary/50 transition-all cursor-pointer group">
                        <MessageCircle className="w-5 h-5 text-primary group-hover:scale-110 transition-transform" />
                        <span className="text-primary font-medium group-hover:underline">Créer une demande - Programme Avis</span>
                      </div>
                    </Link>
                  </div>

                  <div className="space-y-4 mt-6">
                    <p className="font-semibold text-base">Deux options sont disponibles :</p>
                    
                    <Card className="border-primary/20">
                      <CardHeader className="pb-3">
                        <CardTitle className="text-base flex items-center gap-2">
                          <Badge className="bg-primary">Option 1</Badge>
                          <span>Achat avec retour</span>
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <p className="text-sm text-muted-foreground">
                          L'acheteur commande le produit du vendeur, le reçoit, effectue un retour, puis dépose un avis 5 étoiles sur la fiche produit.
                        </p>
                      </CardContent>
                    </Card>

                    <Card className="border-primary/20">
                      <CardHeader className="pb-3">
                        <CardTitle className="text-base flex items-center gap-2">
                          <Badge className="bg-primary">Option 2</Badge>
                          <span>Achat définitif petit prix</span>
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <p className="text-sm text-muted-foreground">
                          Le vendeur propose un article à prix réduit. L'acheteur l'acquiert définitivement et laisse un avis 5 étoiles sans nécessité de retour.
                        </p>
                      </CardContent>
                    </Card>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-lg">
                    <Trophy className="w-5 h-5 text-primary" />
                    Pourquoi les avis sont-ils essentiels ? 📈
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="space-y-3">
                    <div className="flex items-start gap-3 p-3 rounded-lg bg-accent/30">
                      <CheckCircle className="w-5 h-5 text-primary mt-0.5 flex-shrink-0" />
                      <p className="text-sm">
                        <strong>Crédibilité renforcée :</strong> Les avis positifs inspirent confiance aux acheteurs potentiels et augmentent significativement votre taux de conversion.
                      </p>
                    </div>
                    
                    <div className="flex items-start gap-3 p-3 rounded-lg bg-accent/30">
                      <CheckCircle className="w-5 h-5 text-primary mt-0.5 flex-shrink-0" />
                      <p className="text-sm">
                        <strong>Facilitation des autorisations Amazon :</strong> Un historique d'avis positifs joue un rôle déterminant dans l'obtention d'autorisations de vente pour certaines catégories de produits.
                      </p>
                    </div>
                    
                    <div className="flex items-start gap-3 p-3 rounded-lg bg-accent/30">
                      <CheckCircle className="w-5 h-5 text-primary mt-0.5 flex-shrink-0" />
                      <p className="text-sm">
                        <strong>Visibilité accrue :</strong> Les produits avec de nombreux avis bénéficient d'un meilleur classement dans les résultats de recherche Amazon.
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-primary/5 border-primary/20">
                <CardContent className="pt-6 text-center">
                  <p className="text-sm font-semibold text-foreground">
                    Rejoignez le programme d'entraide AMZing FBA et développez votre activité ensemble ! 🚀
                  </p>
                </CardContent>
              </Card>
            </div>
          </ScrollArea>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Dashboard;
