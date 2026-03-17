import { useAuth } from "@/hooks/use-auth";
import { useAdmin } from "@/hooks/use-admin";
import { useNotifications } from "@/hooks/use-notifications";
import { usePullRefresh } from "@/hooks/use-pull-refresh";
import { useAutoRefresh } from "@/hooks/use-auto-refresh";
import { useAdminTicketsUnread } from "@/hooks/use-admin-tickets-unread";
import { Navigate, Link, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import CategoryAlerts from "@/components/CategoryAlerts";
import { RecentUpdates } from "@/components/RecentUpdates";
import ProductSearchBanner from "@/components/dashboard/ProductSearchBanner";
import { NotificationBadge } from "@/components/NotificationBadge";
import { RefreshButton } from "@/components/RefreshButton";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Crown,
  BookOpen,
  Bell,
  CheckCircle,
  CheckCircle2,
  DollarSign,
  HelpCircle,
  Settings,
  Eye,
  FileText,
  Star,
  Calculator,
  Sparkles,
  Package,
  Truck,
  Megaphone,
  Newspaper,
  MessageCircle,
  LightbulbIcon,
  Trophy,
  ShoppingCart,
  Info,
  Users,
  Lock,
  AlertCircle,
  Scale,
  Database,
  Shield,
  UserCog,
  Building2,
  Store,
  Euro,
  Wrench,
  Search,
  CreditCard,
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
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
            <div className="flex items-center">
              <NotificationBadge count={badge} className="relative" />
            </div>
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
  const navigate = useNavigate();
  const { user, isVIP, subscription, isLoading } = useAuth();
  const { isAdmin, isLoading: isAdminLoading } = useAdmin();
  const { notifications: rawNotifications, markAsRead, loadNotifications } = useNotifications();
  // Hide notification badges for admin
  const notifications = isAdmin ? ({} as typeof rawNotifications) : rawNotifications;
  const { unreadCount: adminTicketsUnread } = useAdminTicketsUnread();
  const { toast } = useToast();
  const [isSyncing, setIsSyncing] = useState(false);

  const handleQogitaClick = async () => {
    setIsSyncing(true);
    toast({
      title: "🔄 Synchronisation...",
      description: "Mise à jour des produits Qogita en cours...",
    });

    try {
      const { error } = await supabase.functions.invoke("sync-gist-to-db");

      if (error) {
        console.error("Erreur sync:", error);
        toast({
          title: "⚠️ Erreur",
          description: "Impossible de synchroniser les produits",
          variant: "destructive",
        });
        setIsSyncing(false);
        return;
      }

      // Attendre un peu pour que la DB se mette à jour
      await new Promise((resolve) => setTimeout(resolve, 1000));

      toast({
        title: "✅ Synchronisé !",
        description: "Produits mis à jour avec succès",
      });

      // Naviguer avec un paramètre pour forcer le reload
      navigate("/produits-gagnants/produits-qogita?refresh=true");
    } catch (error) {
      console.error("Erreur:", error);
      toast({
        title: "⚠️ Erreur",
        description: "Impossible de synchroniser les produits",
        variant: "destructive",
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

  // Redirect to home if not VIP and not admin
  if (!isVIP && !isAdmin) {
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

            <ProductSearchBanner />

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
                    <CategoryItem
                      icon={Bell}
                      label="notifications"
                      link="/notification-alerts"
                      badge={notifications.introduction?.subcategories?.notifications}
                    />
                    <CategoryItem
                      icon={Bell}
                      label="débuter"
                      link="/debuter"
                      badge={notifications.introduction?.subcategories?.débuter}
                    />
                    <CategoryItem
                      icon={BookOpen}
                      label="règles"
                      link="/rules-alerts"
                      badge={notifications.introduction?.subcategories?.règles}
                    />
                    <CategoryItem
                      icon={BookOpen}
                      label="guides"
                      link="/guides"
                      badge={notifications.introduction?.subcategories?.guides}
                    />
                    <CategoryItem
                      icon={DollarSign}
                      label="affiliation"
                      link="/affiliate"
                      badge={notifications.introduction?.subcategories?.affiliation}
                    />
                    <CategoryItem
                      icon={HelpCircle}
                      label="support"
                      link="/support"
                      badge={notifications.introduction?.subcategories?.support}
                    />
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
                    <CategoryItem
                      icon={Eye}
                      label="création-société"
                      onClick={() => navigate("/creation-societe")}
                      badge={notifications.outils?.subcategories?.["création-société"]}
                    />
                    {isAdmin && (
                      <CategoryItem
                        icon={FileText}
                        label="facture-autorisation"
                        link="/facture-autorisation"
                        badge={notifications.outils?.subcategories?.["facture-autorisation"]}
                      />
                    )}
                    <CategoryItem
                      icon={DollarSign}
                      label="cashback"
                      link="/cashback"
                      badge={notifications.outils?.subcategories?.cashback}
                    />
                    <CategoryItem
                      icon={Star}
                      label="avis"
                      link="/avis-page"
                      badge={notifications.outils?.subcategories?.avis}
                    />
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
                    <CategoryItem icon={Search} label="Recherche produits" link="/product-search" />
                    <CategoryItem
                      icon={Search}
                      label="Product Find"
                      link="/produits-find"
                      badge={notifications.produits?.subcategories?.["produits-find"]}
                    />
                    <CategoryItem
                      icon={Store}
                      label="Produits Leclerc"
                      link="/product-alerts/leclerc"
                      badge={notifications.produits?.subcategories?.["produits-leclerc"]}
                    />
                    <CategoryItem
                      icon={Store}
                      label="Produits Ibood"
                      link="/produits-ibood"
                      badge={notifications.produits?.subcategories?.["produits-ibood"]}
                    />
                    <CategoryItem
                      icon={Store}
                      label="Produits Carrefour"
                      link="/product-alerts/carrefour"
                      badge={notifications.produits?.subcategories?.["produits-carrefour"]}
                    />
                    <CategoryItem
                      icon={Store}
                      label="Produits Auchan"
                      link="/produits-auchan"
                      badge={notifications.produits?.subcategories?.["produits-auchan"]}
                    />
                    <CategoryItem
                      icon={Store}
                      label="Produits SmythsToys"
                      link="/product-alerts/smyth-toys"
                      badge={notifications.produits?.subcategories?.["produits-smythstoys"]}
                    />
                    <CategoryItem
                      icon={Store}
                      label="Produits Miamland"
                      link="/product-alerts/miamland"
                      badge={notifications.produits?.subcategories?.["produits-miamland"]}
                    />
                    <CategoryItem
                      icon={Store}
                      label="Produits Stokomani"
                      link="/product-alerts/stokomani"
                      badge={notifications.produits?.subcategories?.["produits-stokomani"]}
                    />
                    <CategoryItem
                      icon={Store}
                      label="Produits Eany"
                      link="/product-alerts/eany"
                      badge={notifications.produits?.subcategories?.["produits-eany"]}
                    />
                    <CategoryItem
                      icon={Store}
                      label="Produits Qogita 2"
                      link="/product-alerts/qogita2"
                      badge={notifications.produits?.subcategories?.["produits-qogita2"]}
                    />
                    <CategoryItem
                      icon={Sparkles}
                      label="produits qogita"
                      onClick={handleQogitaClick}
                      badge={notifications.produits?.subcategories?.["produits-qogita"]}
                    />
                    <CategoryItem
                      icon={DollarSign}
                      label="promotions"
                      link="/promotions"
                      badge={notifications.produits?.subcategories?.["promotions"]}
                    />
                    <CategoryItem
                      icon={FileText}
                      label="sitelist"
                      link="/sitelist"
                      badge={notifications.produits?.subcategories?.["sitelist"]}
                    />
                  </div>
                </AccordionContent>
              </AccordionItem>

              {/* AMAZON TO AMAZON */}
              <AccordionItem value="amazon-to-amazon" className="border rounded-lg px-6 bg-card">
                <AccordionTrigger className="hover:no-underline">
                  <div className="flex items-center gap-3 w-full">
                    <Euro className="w-6 h-6 text-primary" />
                    <span className="text-xl font-bold">AMAZON TO AMAZON</span>
                    <NotificationBadge count={notifications.amazon_to_amazon?.total} size="md" className="ml-2" />
                  </div>
                </AccordionTrigger>
                <AccordionContent>
                  <div className="grid gap-3 pt-2">
                    <CategoryItem
                      icon={Store}
                      label="France Medium"
                      link="/a2a/a2a-france-medium"
                      badge={notifications.amazon_to_amazon?.subcategories?.["france-medium"]}
                    />
                    <CategoryItem
                      icon={Store}
                      label="France High"
                      link="/a2a/a2a-france-high"
                      badge={notifications.amazon_to_amazon?.subcategories?.["france-high"]}
                    />
                    <CategoryItem
                      icon={Store}
                      label="Allemagne"
                      link="/a2a/a2a-allemagne"
                      badge={notifications.amazon_to_amazon?.subcategories?.["allemagne"]}
                    />
                    <CategoryItem
                      icon={Store}
                      label="Espagne"
                      link="/a2a/a2a-espagne"
                      badge={notifications.amazon_to_amazon?.subcategories?.["espagne"]}
                    />
                    <CategoryItem
                      icon={Store}
                      label="Italie"
                      link="/a2a/a2a-italie"
                      badge={notifications.amazon_to_amazon?.subcategories?.["italie"]}
                    />
                  </div>
                </AccordionContent>
              </AccordionItem>

              {/* GROSSISTES */}
              <AccordionItem value="grossistes" className="border rounded-lg px-6 bg-card">
                <AccordionTrigger className="hover:no-underline">
                  <div className="flex items-center gap-3 w-full">
                    <Package className="w-6 h-6 text-primary" />
                    <span className="text-xl font-bold">GROSSISTES</span>
                    <NotificationBadge count={notifications.grossistes?.total} size="md" className="ml-2" />
                  </div>
                </AccordionTrigger>
                <AccordionContent>
                  <div className="grid gap-3 pt-2">
                    <CategoryItem
                      icon={Database}
                      label="Catalogue Qogita"
                      link="/catalogue/qogita"
                      badge={notifications.grossistes?.subcategories?.["catalogue-qogita"]}
                    />
                    <CategoryItem
                      icon={Database}
                      label="Catalogue Eany"
                      link="/catalogue/eany"
                      badge={notifications.grossistes?.subcategories?.["catalogue-eany"]}
                    />
                    <CategoryItem
                      icon={Database}
                      label="Catalogue Vibraforce"
                      link="/catalogue/vibraforce"
                      badge={notifications.grossistes?.subcategories?.["catalogue-vibraforce"]}
                    />
                    <CategoryItem
                      icon={Package}
                      label="Alertes grossistes"
                      link="/grossistes"
                      badge={notifications.grossistes?.subcategories?.["alertes"]}
                    />
                  </div>
                </AccordionContent>
              </AccordionItem>

              {/* CATALOGUE EXCLUSIF */}
              <AccordionItem value="catalogue-exclusif" className="border rounded-lg px-6 bg-card">
                <AccordionTrigger className="hover:no-underline">
                  <div className="flex items-center gap-3 w-full">
                    <Store className="w-6 h-6 text-primary" />
                    <span className="text-xl font-bold">CATALOGUE EXCLUSIF</span>
                    <NotificationBadge count={notifications.catalogue_exclusif?.total} size="md" className="ml-2" />
                  </div>
                </AccordionTrigger>
                <AccordionContent>
                  <div className="grid gap-3 pt-2">
                    <CategoryItem
                      icon={Building2}
                      label="DJI"
                      link="/catalogue/dji"
                      badge={notifications.catalogue_exclusif?.subcategories?.dji}
                    />
                    <CategoryItem
                      icon={Building2}
                      label="Xiaomi"
                      link="/catalogue/xiaomi"
                      badge={notifications.catalogue_exclusif?.subcategories?.xiaomi}
                    />
                    <CategoryItem
                      icon={Building2}
                      label="playmobil"
                      link="/catalogue/playmobil"
                      badge={notifications.catalogue_exclusif?.subcategories?.playmobil}
                    />
                    <CategoryItem
                      icon={Building2}
                      label="Lego"
                      link="/catalogue/lego"
                      badge={notifications.catalogue_exclusif?.subcategories?.lego}
                    />
                    <p className="text-sm font-semibold text-muted-foreground uppercase tracking-wider pt-3 pb-1">
                      Grossistes
                    </p>
                    <CategoryItem
                      icon={Building2}
                      label="France Hexagone"
                      link="/catalogue/france-hexagone"
                      badge={notifications.catalogue_exclusif?.subcategories?.["france-hexagone"]}
                    />
                    <CategoryItem
                      icon={Building2}
                      label="BH Distribution"
                      link="/catalogue/bh-distribution"
                      badge={notifications.catalogue_exclusif?.subcategories?.["bh-distribution"]}
                    />
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
                    <CategoryItem
                      icon={Megaphone}
                      label="annonces"
                      link="/annonces"
                      badge={notifications.informations?.subcategories?.annonces}
                    />
                    <CategoryItem
                      icon={Newspaper}
                      label="actualités"
                      link="/actualite"
                      badge={notifications.informations?.subcategories?.actualités}
                    />
                  </div>
                </AccordionContent>
              </AccordionItem>

              {/* COMMUNAUTÉ - Masqué temporairement */}
              {/* <AccordionItem value="communaute" className="border rounded-lg px-6 bg-card">
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
                    <CategoryItem icon={Trophy} label="succès" link="/success" badge={notifications.communaute?.succès} />
                    <CategoryItem icon={ShoppingCart} label="ventes" link="/sales" badge={notifications.communaute?.subcategories?.ventes} />
                  </div>
                </AccordionContent>
              </AccordionItem> */}

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
                    <CategoryItem
                      icon={ShoppingCart}
                      label="Want to Buy"
                      link="/acheter"
                      badge={notifications.marketplace?.subcategories?.["Want to Buy"]}
                    />
                    <CategoryItem
                      icon={Package}
                      label="Want to Sell"
                      link="/vendre"
                      badge={notifications.marketplace?.subcategories?.["Want to Sell"]}
                    />
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
                    <CategoryItem
                      icon={Info}
                      label="informations"
                      link="/gestion-produits-info"
                      badge={notifications.gestion_produit?.subcategories?.informations}
                    />
                    <CategoryItem
                      icon={Package}
                      label="catalogue-produits"
                      link="/catalogue-produits"
                      badge={notifications.gestion_produit?.subcategories?.["catalogue-produits"]}
                    />
                    <CategoryItem
                      icon={MessageCircle}
                      label="questions"
                      link="/questions"
                      badge={notifications.gestion_produit?.subcategories?.questions}
                    />
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
                      <NotificationBadge count={adminTicketsUnread} size="md" className="ml-2" />
                    </div>
                  </AccordionTrigger>
                  <AccordionContent>
                    <div className="grid gap-3 pt-2">
                      <CategoryItem icon={Users} label="gestion des profils" link="/admin/profiles" />
                      <CategoryItem
                        icon={Eye}
                        label="gestion des tickets"
                        link="/admin/tickets"
                        badge={adminTicketsUnread}
                      />
                      <CategoryItem icon={Bell} label="gestion des alertes" link="/admin/alerts" />
                      <CategoryItem icon={CreditCard} label="gestion des abonnements" link="/admin/subscriptions" />
                    </div>
                  </AccordionContent>
                </AccordionItem>
              )}
            </Accordion>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Dashboard;
