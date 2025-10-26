import { useAuth } from '@/hooks/use-auth';
import { Navigate, Link } from 'react-router-dom';
import { useState } from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
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
}

const CategoryItem = ({ icon: Icon, label, link, onClick }: CategoryItemProps) => {
  const content = (
    <Card className="hover:bg-accent/50 transition-colors cursor-pointer" onClick={onClick}>
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
  const [rulesOpen, setRulesOpen] = useState(false);

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
    </div>
  );
};

export default Dashboard;
