import { useAuth } from '@/hooks/use-auth';
import { Navigate, Link } from 'react-router-dom';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { 
  Crown, BookOpen, Bell, CheckCircle, DollarSign, HelpCircle, 
  Settings, Eye, FileText, Star, Calculator, Sparkles, Package,
  Truck, Megaphone, Newspaper, MessageCircle, LightbulbIcon, Trophy,
  ShoppingCart, Info
} from 'lucide-react';

interface CategoryItemProps {
  icon: React.ElementType;
  label: string;
  link?: string;
}

const CategoryItem = ({ icon: Icon, label, link }: CategoryItemProps) => {
  const content = (
    <Card className="hover:bg-accent/50 transition-colors cursor-pointer">
      <CardContent className="p-4">
        <div className="flex items-center gap-3">
          <Icon className="w-5 h-5 text-primary" />
          <span className="font-medium">{label}</span>
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
                    <CategoryItem icon={BookOpen} label="règles" />
                    <CategoryItem icon={CheckCircle} label="débuter" />
                    <CategoryItem icon={BookOpen} label="guides" link="/guides" />
                    <CategoryItem icon={DollarSign} label="affiliation" />
                    <CategoryItem icon={HelpCircle} label="support" />
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
                    <CategoryItem icon={FileText} label="facture-autorisation" />
                    <CategoryItem icon={DollarSign} label="cashback" />
                    <CategoryItem icon={Star} label="avis" />
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
                    <CategoryItem icon={MessageCircle} label="général" />
                    <CategoryItem icon={LightbulbIcon} label="suggestions" />
                    <CategoryItem icon={Trophy} label="succès" />
                    <CategoryItem icon={DollarSign} label="ventes" />
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
                    <CategoryItem icon={ShoppingCart} label="acheter" />
                    <CategoryItem icon={ShoppingCart} label="vendre" />
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
    </div>
  );
};

export default Dashboard;
