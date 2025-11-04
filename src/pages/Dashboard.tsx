import { useAuth } from '@/hooks/use-auth';
import { useAdmin } from '@/hooks/use-admin';
import { useNotifications } from '@/hooks/use-notifications';
import { usePullRefresh } from '@/hooks/use-pull-refresh';
import { Navigate, Link } from 'react-router-dom';
import { useState, useEffect } from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import CategoryAlerts from '@/components/CategoryAlerts';
import { RecentUpdates } from '@/components/RecentUpdates';
import { NotificationBadge } from '@/components/NotificationBadge';
import { RefreshButton } from '@/components/RefreshButton';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Crown, BookOpen, Bell, CheckCircle, DollarSign, HelpCircle, Settings, Eye, FileText, Star, Calculator, Sparkles, Package, Truck, Megaphone, Newspaper, MessageCircle, LightbulbIcon, Trophy, ShoppingCart, Info, Users, Lock, AlertCircle, Scale, Database, Shield, UserCog } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
interface CategoryItemProps {
  icon: React.ElementType;
  label: string;
  link?: string;
  onClick?: () => void;
  badge?: number;
}
const CategoryItem = ({
  icon: Icon,
  label,
  link,
  onClick,
  badge
}: CategoryItemProps) => {
  const content = <Card className="hover:bg-accent/50 transition-colors cursor-pointer" onClick={onClick}>
      <CardContent className="p-4">
        <div className="flex items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <Icon className="w-5 h-5 text-primary" />
            <span className="font-medium">{label}</span>
          </div>
          {badge && badge > 0 && (
            <div className="flex items-center">
              <NotificationBadge count={badge} className="relative" />
            </div>
          )}
        </div>
      </CardContent>
    </Card>;
  if (link) {
    return <Link to={link}>{content}</Link>;
  }
  return content;
};
const Dashboard = () => {
  const {
    user,
    isVIP,
    subscription,
    isLoading
  } = useAuth();
  const { isAdmin } = useAdmin();
  const { notifications, markAsRead, loadNotifications } = useNotifications();
  const { toast } = useToast();
  const [invoiceAuthOpen, setInvoiceAuthOpen] = useState(false);
  const [reviewsOpen, setReviewsOpen] = useState(false);
  const [gestionInfoOpen, setGestionInfoOpen] = useState(false);

  const handleRefreshDashboard = async () => {
    await loadNotifications();
    toast({
      title: "✅ Rafraîchi",
      description: "Dashboard mis à jour",
    });
  };

  const { isRefreshing, handleRefresh } = usePullRefresh(handleRefreshDashboard);
  if (isLoading) {
    return <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>;
  }

  // Redirect to auth if not logged in
  if (!user) {
    return <Navigate to="/auth" replace />;
  }

  // Redirect to home if not VIP
  if (!isVIP) {
    return <Navigate to="/" replace />;
  }
  const daysRemaining = subscription?.expires_at ? Math.ceil((new Date(subscription.expires_at).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24)) : null;
  const isTrialActive = subscription?.is_trial && daysRemaining && daysRemaining > 0;
  return <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-grow pt-20">
        <div className="container mx-auto px-4 py-8">
          <div className="max-w-4xl mx-auto">
            <div className="flex items-center gap-3 mb-8">
              <Crown className="w-8 h-8 text-primary" />
              <div className="flex-1">
                <h1 className="text-4xl font-bold">Espace VIP</h1>
              </div>
              <RefreshButton 
                onRefresh={handleRefresh} 
                isRefreshing={isRefreshing}
                className="bg-primary hover:bg-primary/90 text-primary-foreground"
              />
            </div>

            <RecentUpdates />

            <Accordion type="multiple" className="space-y-4">
              {/* INTRODUCTION */}
              <AccordionItem value="introduction" className="border rounded-lg px-6 bg-card">
                <AccordionTrigger className="hover:no-underline">
                  <div className="flex items-center gap-3 w-full">
                    <BookOpen className="w-6 h-6 text-primary" />
                    <span className="text-xl font-bold">INTRODUCTION</span>
                    <NotificationBadge count={notifications.introduction?.total} size="md" className="ml-2" />
                  </div>
                </AccordionTrigger>
                <AccordionContent className="px-4 pb-4">
                  <div className="grid gap-3 pt-2">
                    <CategoryItem icon={Bell} label="notifications" link="/notification-alerts" badge={notifications.introduction?.subcategories?.notifications} />
                    <CategoryItem icon={BookOpen} label="règles" link="/rules-alerts" badge={notifications.introduction?.subcategories?.règles} />
                    <CategoryItem icon={CheckCircle} label="débuter" badge={notifications.introduction?.subcategories?.débuter} />
                    <CategoryItem icon={BookOpen} label="guides" link="/guides" badge={notifications.introduction?.subcategories?.guides} />
                    <CategoryItem icon={DollarSign} label="affiliation" badge={notifications.introduction?.subcategories?.affiliation} />
                    <CategoryItem icon={HelpCircle} label="support" link="/support" badge={notifications.introduction?.subcategories?.support} />
                  </div>
                </AccordionContent>
              </AccordionItem>

              {/* OUTILS */}
              <AccordionItem value="outils" className="border rounded-lg px-6 bg-card">
                <AccordionTrigger className="hover:no-underline">
                  <div className="flex items-center gap-3 w-full">
                    <Settings className="w-6 h-6 text-primary" />
                    <span className="text-xl font-bold">OUTILS</span>
                    <NotificationBadge count={notifications.outils?.total} size="md" className="ml-2" />
                  </div>
                </AccordionTrigger>
                <AccordionContent>
                  <div className="grid gap-3 pt-2">
                    <CategoryItem icon={Eye} label="création-société" badge={notifications.outils?.subcategories?.['création-société']} />
                    <CategoryItem icon={FileText} label="facture-autorisation" onClick={() => setInvoiceAuthOpen(true)} badge={notifications.outils?.subcategories?.['facture-autorisation']} />
                    <CategoryItem icon={DollarSign} label="cashback" badge={notifications.outils?.subcategories?.cashback} />
                    <CategoryItem icon={Star} label="avis" onClick={() => setReviewsOpen(true)} badge={notifications.outils?.subcategories?.avis} />
                  </div>
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="produits" className="border rounded-lg px-6 bg-card">
                <AccordionTrigger className="hover:no-underline">
                  <div className="flex items-center gap-3 w-full">
                    <Sparkles className="w-6 h-6 text-primary" />
                    <span className="text-xl font-bold">PRODUITS GAGNANTS</span>
                    <NotificationBadge count={notifications.produits?.total} size="md" className="ml-2" />
                  </div>
                </AccordionTrigger>
                <AccordionContent>
                  <div className="grid gap-3 pt-2">
                    <CategoryItem icon={Sparkles} label="product find" link="/produits-find" badge={notifications.produits?.subcategories?.['produits-find']} />
                    <CategoryItem icon={Sparkles} label="produits qogita" link="/produits-qogita" badge={notifications.produits?.subcategories?.['produits-qogita']} />
                    <CategoryItem icon={Sparkles} label="produits eany" link="/produits-eany" badge={notifications.produits?.subcategories?.['produits-eany']} />
                    <CategoryItem icon={Package} label="grossistes" link="/grossistes" badge={notifications.produits?.subcategories?.['grossistes']} />
                    <CategoryItem icon={DollarSign} label="promotions" link="/promotions" badge={notifications.produits?.subcategories?.['promotions']} />
                    <CategoryItem icon={FileText} label="sitelist" link="/sitelist" badge={notifications.produits?.subcategories?.['sitelist']} />
                  </div>
                </AccordionContent>
              </AccordionItem>

              {/* EXPÉDITION */}
              <AccordionItem value="expedition" className="border rounded-lg px-6 bg-card">
                <AccordionTrigger className="hover:no-underline">
                  <div className="flex items-center gap-3 w-full">
                    <Truck className="w-6 h-6 text-primary" />
                    <span className="text-xl font-bold">EXPÉDITION</span>
                    <NotificationBadge count={notifications.expedition?.total} size="md" className="ml-2" />
                  </div>
                </AccordionTrigger>
                <AccordionContent>
                  <div className="grid gap-3 pt-2">
                    <CategoryItem icon={Settings} label="fournitures" badge={notifications.expedition?.subcategories?.fournitures} />
                    <CategoryItem icon={Package} label="cartons" badge={notifications.expedition?.subcategories?.cartons} />
                  </div>
                </AccordionContent>
              </AccordionItem>

              {/* INFORMATIONS */}
              <AccordionItem value="informations" className="border rounded-lg px-6 bg-card">
                <AccordionTrigger className="hover:no-underline">
                  <div className="flex items-center gap-3 w-full">
                    <Bell className="w-6 h-6 text-primary" />
                    <span className="text-xl font-bold">INFORMATIONS</span>
                    <NotificationBadge count={notifications.informations?.total} size="md" className="ml-2" />
                  </div>
                </AccordionTrigger>
                <AccordionContent className="px-4 pb-4">
                  <CategoryAlerts category="informations" />
                  <div className="grid gap-3 pt-2">
                    <CategoryItem icon={Megaphone} label="annonces" link="/annonces" badge={notifications.informations?.subcategories?.annonces} />
                    <CategoryItem icon={Newspaper} label="actualités" link="/actualite" badge={notifications.informations?.subcategories?.actualités} />
                  </div>
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="communaute" className="border rounded-lg px-6 bg-card">
                <AccordionTrigger className="hover:no-underline">
                  <div className="flex items-center gap-3 w-full">
                    <MessageCircle className="w-6 h-6 text-primary" />
                    <span className="text-xl font-bold">COMMUNAUTÉ</span>
                    <NotificationBadge count={notifications.communaute?.total} size="md" className="ml-2" />
                  </div>
                </AccordionTrigger>
                <AccordionContent>
                  <div className="grid gap-3 pt-2">
                    <CategoryItem icon={MessageCircle} label="général" link="/chat" badge={notifications.communaute?.subcategories?.général} />
                    <CategoryItem icon={LightbulbIcon} label="suggestions" link="/suggestions" badge={notifications.communaute?.subcategories?.suggestions} />
                    <CategoryItem icon={Trophy} label="succès" link="/success" badge={notifications.communaute?.subcategories?.succès} />
                    <CategoryItem icon={ShoppingCart} label="ventes" link="/sales" badge={notifications.communaute?.subcategories?.ventes} />
                  </div>
                </AccordionContent>
              </AccordionItem>

              {/* MARKETPLACE */}
              <AccordionItem value="marketplace" className="border rounded-lg px-6 bg-card">
                <AccordionTrigger className="hover:no-underline">
                  <div className="flex items-center gap-3 w-full">
                    <ShoppingCart className="w-6 h-6 text-primary" />
                    <span className="text-xl font-bold">MARKETPLACE</span>
                    <NotificationBadge count={notifications.marketplace?.total} size="md" className="ml-2" />
                  </div>
                </AccordionTrigger>
                <AccordionContent>
                  <div className="grid gap-3 pt-2">
                    <CategoryItem icon={ShoppingCart} label="Want to Buy" link="/acheter" badge={notifications.marketplace?.subcategories?.['Want to Buy']} />
                    <CategoryItem icon={Package} label="Want to Sell" link="/vendre" badge={notifications.marketplace?.subcategories?.['Want to Sell']} />
                  </div>
                </AccordionContent>
              </AccordionItem>

              {/* GESTION PRODUITS */}
              <AccordionItem value="gestion" className="border rounded-lg px-6 bg-card">
                <AccordionTrigger className="hover:no-underline">
                  <div className="flex items-center gap-3 w-full">
                    <Package className="w-6 h-6 text-primary" />
                    <span className="text-xl font-bold">GESTION PRODUITS</span>
                    <NotificationBadge count={notifications.gestion_produit?.total} size="md" className="ml-2" />
                  </div>
                </AccordionTrigger>
                <AccordionContent className="px-4 pb-4">
                  <div className="grid gap-3 pt-2">
                    <CategoryItem icon={Info} label="informations" onClick={() => setGestionInfoOpen(true)} badge={notifications.gestion_produit?.subcategories?.informations} />
                    <CategoryItem icon={Package} label="catalogue-produits" link="/catalogue-produits" badge={notifications.gestion_produit?.subcategories?.['catalogue-produits']} />
                    <CategoryItem icon={MessageCircle} label="questions" link="/questions" badge={notifications.gestion_produit?.subcategories?.questions} />
                  </div>
                </AccordionContent>
              </AccordionItem>

              {/* ADMINISTRATION - Visible uniquement pour les admins */}
              {isAdmin && (
                <AccordionItem value="administration" className="border rounded-lg px-6 bg-card border-primary/30">
                  <AccordionTrigger className="hover:no-underline">
                    <div className="flex items-center gap-3">
                      <Shield className="w-6 h-6 text-primary" />
                      <span className="text-xl font-bold">ADMINISTRATION</span>
                    </div>
                  </AccordionTrigger>
                  <AccordionContent>
                    <div className="grid gap-3 pt-2">
                      <CategoryItem icon={Users} label="gestion des profils" link="/admin/profiles" />
                      <CategoryItem icon={Eye} label="gestion des tickets" link="/admin/tickets" />
                      <CategoryItem icon={Bell} label="gestion des alertes" link="/admin/alerts" />
                    </div>
                  </AccordionContent>
                </AccordionItem>
              )}
            </Accordion>
          </div>
        </div>
      </main>
      <Footer />

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

      {/* Dialog Gestion Produits - Informations */}
      <Dialog open={gestionInfoOpen} onOpenChange={setGestionInfoOpen}>
        <DialogContent className="max-w-4xl mt-24 md:mt-0">
          <DialogHeader>
            <DialogTitle className="text-2xl flex items-center gap-3">
              <Package className="w-7 h-7 text-primary" />
              Gestion complète de vos produits — sans effort
            </DialogTitle>
            <DialogDescription>
              AMZing FBA 360 : Votre partenaire logistique intégral pour Amazon
            </DialogDescription>
          </DialogHeader>
          <ScrollArea className="h-[70vh] pr-4">
            <div className="space-y-6">
              {/* Hero Section */}
              <Card className="border-primary/30 bg-gradient-to-br from-primary/10 via-primary/5 to-transparent">
                <CardContent className="pt-6">
                  <div className="space-y-4">
                    <div className="flex items-start gap-4">
                      <div className="p-3 bg-primary/20 rounded-xl">
                        <Sparkles className="w-8 h-8 text-primary" />
                      </div>
                      <div>
                        <h3 className="text-xl font-bold mb-2">Votre business Amazon, simplifié à 100 %</h3>
                        <p className="text-base leading-relaxed text-muted-foreground">
                          Avec AMZing FBA 360, nous prenons en charge 100 % du processus logistique pour les vendeurs professionnels Amazon. Confiez-nous la logistique : nous stockons, préparons, expédions et gérons le SAV de vos produits.
                        </p>
                      </div>
                    </div>
                    
                    <div className="bg-background/80 backdrop-blur-sm rounded-lg p-5 mt-4">
                      <p className="text-lg font-semibold text-center">
                        Vous vendez, nous faisons le reste. 🚀
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Services Grid */}
              <div className="grid md:grid-cols-2 gap-4">
                <Card className="border-primary/20 hover:border-primary/40 transition-colors">
                  <CardHeader className="pb-3">
                    <CardTitle className="text-lg flex items-center gap-2">
                      <div className="p-2 bg-primary/10 rounded-lg">
                        <Package className="w-5 h-5 text-primary" />
                      </div>
                      Entrepôt sécurisé
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-muted-foreground">
                      Stockage sécurisé de vos produits dans nos locaux avec gestion complète de l'inventaire en temps réel.
                    </p>
                  </CardContent>
                </Card>

                <Card className="border-primary/20 hover:border-primary/40 transition-colors">
                  <CardHeader className="pb-3">
                    <CardTitle className="text-lg flex items-center gap-2">
                      <div className="p-2 bg-primary/10 rounded-lg">
                        <CheckCircle className="w-5 h-5 text-primary" />
                      </div>
                      Emballage conforme Amazon
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-muted-foreground">
                      Préparation et emballage conformes aux normes Amazon FBA pour garantir l'acceptation de vos envois.
                    </p>
                  </CardContent>
                </Card>

                <Card className="border-primary/20 hover:border-primary/40 transition-colors">
                  <CardHeader className="pb-3">
                    <CardTitle className="text-lg flex items-center gap-2">
                      <div className="p-2 bg-primary/10 rounded-lg">
                        <Truck className="w-5 h-5 text-primary" />
                      </div>
                      Livraison rapide sous 24h
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-muted-foreground">
                      Expédition rapide sous 24h à vos clients avec suivi en temps réel de toutes vos commandes.
                    </p>
                  </CardContent>
                </Card>

                <Card className="border-primary/20 hover:border-primary/40 transition-colors">
                  <CardHeader className="pb-3">
                    <CardTitle className="text-lg flex items-center gap-2">
                      <div className="p-2 bg-primary/10 rounded-lg">
                        <Users className="w-5 h-5 text-primary" />
                      </div>
                      Gestion du SAV client
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-muted-foreground">
                      Gestion complète du service après-vente (SAV), retours et suivi client pour vous libérer du temps.
                    </p>
                  </CardContent>
                </Card>
              </div>

              {/* Objectif Section */}
              <Card className="border-primary/30 bg-primary/5">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-lg">
                    <Trophy className="w-5 h-5 text-primary" />
                    Notre objectif
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <p className="text-base leading-relaxed">
                    Vous permettre de vous concentrer sur vos ventes pendant que nous gérons toute la logistique, du stock au client final.
                  </p>
                  <p className="text-base font-semibold">
                    Grâce à notre modèle intégré, vous bénéficiez d'un contrôle total sur vos marges et d'un gain de temps maximal.
                  </p>
                </CardContent>
              </Card>

              {/* Avantages */}
              <Card className="border-primary/20">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-lg">
                    <Star className="w-5 h-5 text-primary" />
                    Vos avantages avec AMZing FBA 360
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="flex items-start gap-3 p-3 rounded-lg bg-accent/30">
                      <CheckCircle className="w-5 h-5 text-primary mt-0.5 flex-shrink-0" />
                      <p className="text-sm">
                        <strong>Infrastructure complète :</strong> Nous agissons comme votre grossiste, entrepôt et partenaire logistique tout-en-un.
                      </p>
                    </div>
                    
                    <div className="flex items-start gap-3 p-3 rounded-lg bg-accent/30">
                      <CheckCircle className="w-5 h-5 text-primary mt-0.5 flex-shrink-0" />
                      <p className="text-sm">
                        <strong>Solution clé en main :</strong> De la réception de vos produits à la livraison finale, nous gérons l'intégralité de la chaîne.
                      </p>
                    </div>
                    
                    <div className="flex items-start gap-3 p-3 rounded-lg bg-accent/30">
                      <CheckCircle className="w-5 h-5 text-primary mt-0.5 flex-shrink-0" />
                      <p className="text-sm">
                        <strong>Gain de temps maximal :</strong> Concentrez-vous uniquement sur le développement de vos ventes et votre stratégie commerciale.
                      </p>
                    </div>
                    
                    <div className="flex items-start gap-3 p-3 rounded-lg bg-accent/30">
                      <CheckCircle className="w-5 h-5 text-primary mt-0.5 flex-shrink-0" />
                      <p className="text-sm">
                        <strong>Conformité garantie :</strong> Respect strict des normes et exigences Amazon pour éviter tout refus d'envoi.
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* CTA Final */}
              <Card className="bg-gradient-to-r from-primary/20 via-primary/10 to-transparent border-primary/30">
                <CardContent className="pt-6 text-center">
                  <p className="text-lg font-bold mb-2">
                    Vous n'avez plus qu'à vendre — on s'occupe de tout le reste. ✨
                  </p>
                  <p className="text-sm text-muted-foreground">
                    Solution logistique clé en main pour vendeurs Amazon professionnels
                  </p>
                </CardContent>
              </Card>
            </div>
          </ScrollArea>
        </DialogContent>
      </Dialog>
    </div>;
};
export default Dashboard;