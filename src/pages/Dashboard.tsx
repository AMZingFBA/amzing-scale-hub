import { useAuth } from '@/hooks/use-auth';
import { useAdmin } from '@/hooks/use-admin';
import { useNotifications } from '@/hooks/use-notifications';
import { usePullRefresh } from '@/hooks/use-pull-refresh';
import { useAutoRefresh } from '@/hooks/use-auto-refresh';
import { Navigate, Link, useNavigate } from 'react-router-dom';
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
import { Crown, BookOpen, Bell, CheckCircle, CheckCircle2, DollarSign, HelpCircle, Settings, Eye, FileText, Star, Calculator, Sparkles, Package, Truck, Megaphone, Newspaper, MessageCircle, LightbulbIcon, Trophy, ShoppingCart, Info, Users, Lock, AlertCircle, Scale, Database, Shield, UserCog, Building2, Store, Euro, Wrench, Search, CreditCard } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
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
  const navigate = useNavigate();
  const {
    user,
    isVIP,
    subscription,
    isLoading
  } = useAuth();
  const { isAdmin, isLoading: isAdminLoading } = useAdmin();
  const { notifications, markAsRead, loadNotifications } = useNotifications();
  const { toast } = useToast();
  const [invoiceAuthOpen, setInvoiceAuthOpen] = useState(false);
  const [reviewsOpen, setReviewsOpen] = useState(false);
  const [gestionInfoOpen, setGestionInfoOpen] = useState(false);
  const [cashbackOpen, setCashbackOpen] = useState(false);
  const [debuterOpen, setDebuterOpen] = useState(false);
  const [isSyncing, setIsSyncing] = useState(false);

  const handleQogitaClick = async () => {
    setIsSyncing(true);
    toast({
      title: "🔄 Synchronisation...",
      description: "Mise à jour des produits Qogita en cours..."
    });
    
    try {
      const { error } = await supabase.functions.invoke('sync-gist-to-db');
      
      if (error) {
        console.error('Erreur sync:', error);
        toast({
          title: "⚠️ Erreur",
          description: "Impossible de synchroniser les produits",
          variant: "destructive"
        });
        setIsSyncing(false);
        return;
      }
      
      // Attendre un peu pour que la DB se mette à jour
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      toast({
        title: "✅ Synchronisé !",
        description: "Produits mis à jour avec succès"
      });
      
      // Naviguer avec un paramètre pour forcer le reload
      navigate('/produits-gagnants/produits-qogita?refresh=true');
    } catch (error) {
      console.error('Erreur:', error);
      toast({
        title: "⚠️ Erreur",
        description: "Impossible de synchroniser les produits",
        variant: "destructive"
      });
    } finally {
      setIsSyncing(false);
    }
  };

  const handleRefreshDashboard = async () => {
    await loadNotifications();
  };

  const { isRefreshing, handleRefresh } = usePullRefresh(handleRefreshDashboard);
  
  // Auto-refresh every 30 seconds
  useAutoRefresh(loadNotifications, { enabled: true, interval: 30000 });
  
  if (isLoading || isAdminLoading) {
    return <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>;
  }

  // Redirect to auth if not logged in
  if (!user) {
    return <Navigate to="/auth" replace />;
  }

  // Redirect to home if not VIP and not admin
  if (!isVIP && !isAdmin) {
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
              {isVIP && (
                <RefreshButton 
                  onRefresh={handleRefresh} 
                  isRefreshing={isRefreshing}
                  className="bg-primary hover:bg-primary/90 text-primary-foreground"
                />
              )}
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
                    <CategoryItem icon={Bell} label="débuter" onClick={() => setDebuterOpen(true)} badge={notifications.introduction?.subcategories?.débuter} />
                    <CategoryItem icon={BookOpen} label="règles" link="/rules-alerts" badge={notifications.introduction?.subcategories?.règles} />
                    <CategoryItem icon={BookOpen} label="guides" link="/guides" badge={notifications.introduction?.subcategories?.guides} />
                    <CategoryItem icon={DollarSign} label="affiliation" link="/affiliate" badge={notifications.introduction?.subcategories?.affiliation} />
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
                    <CategoryItem icon={DollarSign} label="cashback" onClick={() => setCashbackOpen(true)} badge={notifications.outils?.subcategories?.cashback} />
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
                    <CategoryItem 
                      icon={Sparkles} 
                      label="produits qogita" 
                      onClick={handleQogitaClick}
                      badge={notifications.produits?.subcategories?.['produits-qogita']} 
                    />
                    <CategoryItem icon={Sparkles} label="produits eany" link="/products/eany" badge={notifications.produits?.subcategories?.['produits-eany']} />
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

      {/* Cashback Dialog */}
      <Dialog open={cashbackOpen} onOpenChange={setCashbackOpen}>
        <DialogContent className="max-w-4xl max-h-[80vh]">
          <DialogHeader>
            <DialogTitle className="text-2xl flex items-center gap-3">
              <DollarSign className="w-7 h-7 text-primary" />
              💸 Gagne plus à chaque achat avec le Cashback !
            </DialogTitle>
            <DialogDescription>
              Récupère une partie de ton argent sur tes achats en ligne
            </DialogDescription>
          </DialogHeader>
          <ScrollArea className="h-[70vh] pr-4">
            <div className="space-y-6">
              {/* Hero Section */}
              <Card className="border-primary/30 bg-gradient-to-br from-primary/10 via-primary/5 to-transparent overflow-hidden relative">
                <div className="absolute top-0 right-0 w-32 h-32 bg-primary/10 rounded-full blur-3xl" />
                <CardContent className="pt-6 relative">
                  <div className="space-y-4">
                    <div className="flex items-start gap-4">
                      <div className="p-3 bg-primary/20 rounded-xl animate-pulse">
                        <Sparkles className="w-8 h-8 text-primary" />
                      </div>
                      <div>
                        <h3 className="text-xl font-bold mb-3">Le cashback, c'est un moyen simple de récupérer une partie de ton argent à chaque achat en ligne 🛍️</h3>
                        <p className="text-base leading-relaxed text-muted-foreground mb-2">
                          <strong className="text-foreground">Tu achètes → tu gagnes un pourcentage → tu encaisses 💰</strong>
                        </p>
                        <p className="text-base leading-relaxed text-muted-foreground">
                          En passant par <strong className="text-foreground">Widilo</strong>, tu profites de centaines de partenaires : Amazon, Nike, Sephora, Shein, et plein d'autres !
                        </p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Features Grid */}
              <div className="grid md:grid-cols-3 gap-4">
                <Card className="border-primary/20 hover:border-primary/40 transition-all duration-300 hover:scale-105">
                  <CardHeader className="pb-3">
                    <CardTitle className="text-lg flex items-center gap-2">
                      <div className="p-2 bg-primary/10 rounded-lg">
                        <ShoppingCart className="w-5 h-5 text-primary" />
                      </div>
                      Achète normalement
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-muted-foreground">
                      Fais tes achats comme d'habitude sur tes sites préférés
                    </p>
                  </CardContent>
                </Card>

                <Card className="border-primary/20 hover:border-primary/40 transition-all duration-300 hover:scale-105">
                  <CardHeader className="pb-3">
                    <CardTitle className="text-lg flex items-center gap-2">
                      <div className="p-2 bg-primary/10 rounded-lg">
                        <DollarSign className="w-5 h-5 text-primary" />
                      </div>
                      Gagne du cashback
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-muted-foreground">
                      Récupère automatiquement un pourcentage sur chaque achat
                    </p>
                  </CardContent>
                </Card>

                <Card className="border-primary/20 hover:border-primary/40 transition-all duration-300 hover:scale-105">
                  <CardHeader className="pb-3">
                    <CardTitle className="text-lg flex items-center gap-2">
                      <div className="p-2 bg-primary/10 rounded-lg">
                        <CheckCircle className="w-5 h-5 text-primary" />
                      </div>
                      Encaisse ton argent
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-muted-foreground">
                      Retire tes gains facilement sur ton compte bancaire
                    </p>
                  </CardContent>
                </Card>
              </div>

              {/* Stats Section */}
              <Card className="border-primary/30 bg-gradient-to-r from-primary/10 via-primary/5 to-transparent">
                <CardContent className="pt-6">
                  <div className="grid md:grid-cols-2 gap-6">
                    <div className="text-center p-4 bg-background/80 rounded-lg backdrop-blur-sm">
                      <div className="text-4xl font-bold text-primary mb-2">Centaines €</div>
                      <p className="text-sm text-muted-foreground">Économisés par an 💰</p>
                    </div>
                    <div className="text-center p-4 bg-background/80 rounded-lg backdrop-blur-sm">
                      <div className="text-4xl font-bold text-primary mb-2">100% Gratuit</div>
                      <p className="text-sm text-muted-foreground">Extension automatique 🚀</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* How it Works */}
              <Card className="border-primary/20">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-lg">
                    <Sparkles className="w-5 h-5 text-primary" />
                    Comment ça marche ?
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="flex items-start gap-3 p-3 rounded-lg bg-accent/30">
                      <div className="w-8 h-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-bold flex-shrink-0">1</div>
                      <p className="text-sm pt-1">
                        Installe l'extension gratuite Widilo sur ton navigateur
                      </p>
                    </div>
                    
                    <div className="flex items-start gap-3 p-3 rounded-lg bg-accent/30">
                      <div className="w-8 h-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-bold flex-shrink-0">2</div>
                      <p className="text-sm pt-1">
                        L'extension active automatiquement ton cashback sur les sites partenaires
                      </p>
                    </div>
                    
                    <div className="flex items-start gap-3 p-3 rounded-lg bg-accent/30">
                      <div className="w-8 h-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-bold flex-shrink-0">3</div>
                      <p className="text-sm pt-1">
                        Achète normalement, sans rien changer à tes habitudes
                      </p>
                    </div>
                    
                    <div className="flex items-start gap-3 p-3 rounded-lg bg-accent/30">
                      <div className="w-8 h-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-bold flex-shrink-0">4</div>
                      <p className="text-sm pt-1">
                        Regarde ton cashback s'accumuler et retire-le quand tu veux ! 💸
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Partner Brands */}
              <Card className="border-primary/20">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-lg">
                    <Star className="w-5 h-5 text-primary" />
                    Partenaires disponibles
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-wrap gap-3 justify-center">
                    {['Amazon', 'Nike', 'Sephora', 'Shein', 'AliExpress', 'Booking', 'H&M', 'Zalando'].map((brand) => (
                      <Badge key={brand} variant="secondary" className="text-sm px-4 py-2">
                        {brand}
                      </Badge>
                    ))}
                  </div>
                  <p className="text-sm text-muted-foreground text-center mt-4">
                    Et des centaines d'autres partenaires ! 🎉
                  </p>
                </CardContent>
              </Card>

              {/* CTA Section */}
              <Card className="bg-gradient-to-r from-primary/20 via-primary/10 to-transparent border-primary/30">
                <CardContent className="pt-6">
                  <div className="text-center space-y-4">
                    <p className="text-lg font-bold">
                      🚀 Sur une année, ça peut représenter des centaines d'euros économisés — sans rien changer à tes habitudes d'achat !
                    </p>
                    <a 
                      href="https://www.widilo.fr/i/2U26W5" 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 px-6 py-3 bg-primary text-primary-foreground rounded-lg font-semibold hover:bg-primary/90 transition-all duration-300 hover:scale-105"
                    >
                      Commencer à gagner maintenant
                      <Sparkles className="w-5 h-5" />
                    </a>
                    <p className="text-xs text-muted-foreground">
                      Installation gratuite • Activation automatique • Aucun engagement
                    </p>
                  </div>
                </CardContent>
              </Card>
            </div>
          </ScrollArea>
        </DialogContent>
      </Dialog>

      {/* Dialog Débuter */}
      <Dialog open={debuterOpen} onOpenChange={setDebuterOpen}>
        <DialogContent className="max-w-6xl max-h-[90vh] p-0">
          <ScrollArea className="max-h-[90vh]">
            <div className="p-6 md:p-8 space-y-8">
              <DialogHeader>
                <DialogTitle className="text-3xl font-bold flex items-center gap-3">
                  <span className="text-4xl">🎉</span>
                  Bienvenue sur AMZing FBA !
                </DialogTitle>
              </DialogHeader>

              {/* Hero Welcome Section */}
              <section className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-primary via-primary/90 to-primary/70 p-8 md:p-12 shadow-2xl">
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
              <Card className="bg-gradient-to-br from-orange-500/10 to-red-500/10 border-orange-500/30">
                <CardHeader>
                  <CardTitle className="text-2xl md:text-3xl flex items-center gap-3">
                    <span className="text-3xl">🔥</span>
                    Tout comprendre en 2 minutes
                  </CardTitle>
                  <div className="text-muted-foreground">
                    Pour commencer l'achat-revente sur Amazon, tu dois maîtriser quelques bases essentielles. Voici les étapes à suivre dans l'ordre, simples et efficaces :
                  </div>
                </CardHeader>
              </Card>

              {/* Step 1: Read Guides */}
              <Card className="border-blue-500/30 hover:border-blue-500/60 transition-all">
                <CardHeader className="bg-gradient-to-r from-blue-500/10 to-blue-600/10">
                  <div className="flex items-start gap-4">
                    <div className="p-3 rounded-xl bg-blue-500 text-white text-2xl font-bold shadow-lg">2</div>
                    <div className="flex-1">
                      <CardTitle className="text-2xl flex items-center gap-2 mb-2">
                        <BookOpen className="w-6 h-6 text-blue-500" />
                        Débute correctement
                      </CardTitle>
                      <div className="text-sm text-muted-foreground">La base solide pour ton succès</div>
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
                  <Link to="/guides" onClick={() => setDebuterOpen(false)}>
                    <button className="w-full bg-blue-500 hover:bg-blue-600 text-white py-3 rounded-lg font-medium transition-colors">
                      <BookOpen className="w-4 h-4 inline mr-2" />
                      Consulter les guides
                    </button>
                  </Link>
                </CardContent>
              </Card>

              {/* Step 2: Create Company */}
              <Card className="border-green-500/30 hover:border-green-500/60 transition-all">
                <CardHeader className="bg-gradient-to-r from-green-500/10 to-green-600/10">
                  <div className="flex items-start gap-4">
                    <div className="p-3 rounded-xl bg-green-500 text-white text-2xl font-bold shadow-lg">3</div>
                    <div className="flex-1">
                      <CardTitle className="text-2xl flex items-center gap-2 mb-2">
                        <Building2 className="w-6 h-6 text-green-500" />
                        Créer ta société
                      </CardTitle>
                      <div className="text-sm text-muted-foreground">Obligatoire pour vendre sur Amazon</div>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4 pt-6">
                  <p className="text-lg font-semibold">Pour vendre sur Amazon, tu dois avoir un statut professionnel :</p>
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
                    <p className="text-sm">Il faut aussi ajouter l'activité e-commerce dans ton entreprise.</p>
                  </div>
                  <div className="bg-muted/50 rounded-lg p-4 space-y-2">
                    <p className="font-medium">Tu peux créer ta société facilement avec notre partenaire.</p>
                    <p className="text-sm text-muted-foreground">Avec LegalPlace, tout est simple, rapide et fiable.</p>
                  </div>
                  <Link to="/contact" onClick={() => setDebuterOpen(false)}>
                    <button className="w-full bg-green-500 hover:bg-green-600 text-white py-3 rounded-lg font-medium transition-colors">
                      <Building2 className="w-4 h-4 inline mr-2" />
                      En savoir plus
                    </button>
                  </Link>
                </CardContent>
              </Card>

              {/* Step 3: Amazon Seller */}
              <Card className="border-yellow-500/30 hover:border-yellow-500/60 transition-all">
                <CardHeader className="bg-gradient-to-r from-yellow-500/10 to-yellow-600/10">
                  <div className="flex items-start gap-4">
                    <div className="p-3 rounded-xl bg-yellow-500 text-white text-2xl font-bold shadow-lg">4</div>
                    <div className="flex-1">
                      <CardTitle className="text-2xl flex items-center gap-2 mb-2">
                        <Store className="w-6 h-6 text-yellow-500" />
                        Créer ton compte vendeur Amazon
                      </CardTitle>
                      <div className="text-sm text-muted-foreground">Amazon Seller - Ta boutique professionnelle</div>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4 pt-6">
                  <p className="text-lg">Quand ta société est créée → tu peux t'inscrire sur Amazon.</p>
                  <div className="bg-gradient-to-r from-[#FF9900]/10 to-[#FF9900]/5 border border-[#FF9900]/30 rounded-lg p-5">
                    <div className="flex items-start gap-3">
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

              {/* Step 4: SellerAmp */}
              <Card className="border-purple-500/30 hover:border-purple-500/60 transition-all">
                <CardHeader className="bg-gradient-to-r from-purple-500/10 to-purple-600/10">
                  <div className="flex items-start gap-4">
                    <div className="p-3 rounded-xl bg-purple-500 text-white text-2xl font-bold shadow-lg">5</div>
                    <div className="flex-1">
                      <CardTitle className="text-2xl flex items-center gap-2 mb-2">
                        <Wrench className="w-6 h-6 text-purple-500" />
                        L'outil obligatoire : SellerAmp
                      </CardTitle>
                      <div className="text-sm text-muted-foreground">L'outil N°1 pour scanner et analyser tes produits</div>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4 pt-6">
                  <p className="text-lg font-semibold">SellerAmp est l'outil N°1 pour :</p>
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
                    <p className="font-semibold text-center">Sans SellerAmp → impossible d'avancer proprement.</p>
                  </div>
                  <a href="https://selleramp.idevaffiliate.com/2167.html" target="_blank" rel="noopener noreferrer">
                    <button className="w-full bg-purple-500 hover:bg-purple-600 text-white py-3 rounded-lg font-medium transition-colors">
                      <Search className="w-4 h-4 inline mr-2" />
                      Découvrir SellerAmp
                    </button>
                  </a>
                </CardContent>
              </Card>

              {/* Step 5: Qonto */}
              <Card className="border-cyan-500/30 hover:border-cyan-500/60 transition-all">
                <CardHeader className="bg-gradient-to-r from-cyan-500/10 to-cyan-600/10">
                  <div className="flex items-start gap-4">
                    <div className="p-3 rounded-xl bg-cyan-500 text-white text-2xl font-bold shadow-lg">6</div>
                    <div className="flex-1">
                      <CardTitle className="text-2xl flex items-center gap-2 mb-2">
                        <CreditCard className="w-6 h-6 text-cyan-500" />
                        Choisir ton compte bancaire pro
                      </CardTitle>
                      <div className="text-sm text-muted-foreground">Recommandé : Qonto</div>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4 pt-6">
                  <p className="text-lg font-semibold">Pourquoi Qonto ?</p>
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

              {/* Step 6: Help */}
              <Card className="border-primary/30 bg-gradient-to-br from-primary/5 to-primary/10">
                <CardHeader>
                  <div className="flex items-start gap-4">
                    <div className="p-3 rounded-xl bg-primary text-white text-2xl font-bold shadow-lg">7</div>
                    <div className="flex-1">
                      <CardTitle className="text-2xl flex items-center gap-2 mb-2">
                        <Users className="w-6 h-6 text-primary" />
                        Besoin d'aide ?
                      </CardTitle>
                      <div className="text-sm text-muted-foreground">La communauté est là pour toi</div>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <p className="text-lg">Chez AMZing FBA, tu n'es pas seul : on t'explique chaque étape pour réussir.</p>
                  <div className="grid md:grid-cols-2 gap-4">
                    <Link to="/chat" onClick={() => setDebuterOpen(false)}>
                      <button className="w-full border border-primary hover:bg-primary/10 py-4 rounded-lg transition-colors">
                        <div className="flex flex-col items-start gap-1 w-full px-4">
                          <span className="font-semibold">💬 Chat général</span>
                          <span className="text-xs text-muted-foreground">Pose tes questions à la communauté</span>
                        </div>
                      </button>
                    </Link>
                    <Link to="/support" onClick={() => setDebuterOpen(false)}>
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
            </div>
          </ScrollArea>
        </DialogContent>
      </Dialog>
    </div>;
};
export default Dashboard;