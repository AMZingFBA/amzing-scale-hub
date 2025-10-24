import { ArrowLeft, BookOpen, Building2, ShoppingBag, Wrench } from 'lucide-react';
import { Link } from 'react-router-dom';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

const GuideCard = ({ icon: Icon, title, description, link }: { 
  icon: React.ElementType; 
  title: string; 
  description: string;
  link?: string;
}) => (
  <Card className="hover:shadow-lg transition-all hover:scale-[1.02] cursor-pointer">
    <CardHeader>
      <div className="flex items-start gap-3">
        <Icon className="w-6 h-6 text-primary flex-shrink-0 mt-1" />
        <div>
          <CardTitle className="text-lg">{title}</CardTitle>
          <CardDescription className="mt-2">{description}</CardDescription>
        </div>
      </div>
    </CardHeader>
    {link && (
      <CardContent>
        <a 
          href={link} 
          target="_blank" 
          rel="noopener noreferrer"
          className="text-primary hover:underline text-sm font-medium"
        >
          Accéder au guide →
        </a>
      </CardContent>
    )}
  </Card>
);

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
                Apprends et développe tes compétences grâce à nos guides, outils et ressources exclusives.
              </p>
            </div>

            <Tabs defaultValue="debuter" className="w-full">
              <TabsList className="grid w-full grid-cols-2 lg:grid-cols-4 mb-8">
                <TabsTrigger value="debuter">🚀 Débuter</TabsTrigger>
                <TabsTrigger value="entreprise">🏢 Entreprise</TabsTrigger>
                <TabsTrigger value="vendre">🛍️ Vendre</TabsTrigger>
                <TabsTrigger value="outils">🧰 Outils</TabsTrigger>
              </TabsList>

              <TabsContent value="debuter" className="space-y-4">
                <h2 className="text-2xl font-bold mb-4">Commence ton aventure Amazon</h2>
                <div className="grid gap-4 md:grid-cols-2">
                  <GuideCard
                    icon={BookOpen}
                    title="Découvrir l'achat-revente sur Amazon"
                    description="Comprends le concept et les bases du business model."
                    link="https://repeated-chance-975.notion.site/2938e56b7888804f8205f6e88f060340?pvs=25"
                  />
                  <GuideCard
                    icon={BookOpen}
                    title="Lexique Amazon"
                    description="Les mots-clés indispensables pour comprendre la plateforme."
                  />
                  <GuideCard
                    icon={BookOpen}
                    title="Les bases avant de vendre"
                    description="Ce qu'il faut savoir avant d'ouvrir ton compte vendeur."
                    link="https://repeated-chance-975.notion.site/2938e56b78888020831ee5a2653d5e6d?pvs=25"
                  />
                </div>
              </TabsContent>

              <TabsContent value="entreprise" className="space-y-4">
                <h2 className="text-2xl font-bold mb-4">Structure ton activité</h2>
                <div className="grid gap-4 md:grid-cols-2">
                  <GuideCard
                    icon={Building2}
                    title="Créer son entreprise facilement"
                    description="Les étapes pour devenir vendeur légalement et optimiser sa structure."
                    link="https://repeated-chance-975.notion.site/2938e56b7888804685c5c1d9a530a8fe?pvs=25"
                  />
                  <GuideCard
                    icon={Building2}
                    title="Auto-entrepreneur ou SASU ?"
                    description="Comparatif clair pour choisir le bon statut selon ton profil."
                    link="https://repeated-chance-975.notion.site/2938e56b788880388360dba39cc2e54a?pvs=25"
                  />
                  <GuideCard
                    icon={Building2}
                    title="Créer son profil professionnel"
                    description="Les astuces pour inspirer confiance à tes futurs clients."
                    link="https://repeated-chance-975.notion.site/2938e56b7888804c8505e2d7c65cdb1a?pvs=25"
                  />
                </div>
              </TabsContent>

              <TabsContent value="vendre" className="space-y-4">
                <h2 className="text-2xl font-bold mb-4">Lance-toi sur Amazon</h2>
                <div className="grid gap-4 md:grid-cols-2">
                  <GuideCard
                    icon={ShoppingBag}
                    title="Ouvrir ton compte Amazon Seller"
                    description="Étapes détaillées pour t'inscrire sur la plateforme."
                    link="https://repeated-chance-975.notion.site/2938e56b7888807aace5ef1c673f9fb8?pvs=25"
                  />
                  <GuideCard
                    icon={ShoppingBag}
                    title="Mettre en vente tes produits"
                    description="Comment publier une offre, fixer le prix et gérer le stock."
                    link="https://repeated-chance-975.notion.site/2938e56b7888809e8836cd9babbfb0b4?pvs=25"
                  />
                </div>
              </TabsContent>

              <TabsContent value="outils" className="space-y-4">
                <h2 className="text-2xl font-bold mb-4">Optimise ton business</h2>
                <div className="grid gap-4 md:grid-cols-2">
                  <GuideCard
                    icon={Wrench}
                    title="Seller AMP"
                    description="Analyse instantanément la rentabilité, la concurrence et les ventes estimées d'un produit."
                  />
                  <GuideCard
                    icon={Wrench}
                    title="Seller Toolkit"
                    description="Gère automatiquement ton stock, tes marges, tes alertes de rentabilité et tes statistiques Amazon."
                  />
                </div>
              </TabsContent>
            </Tabs>

            <Card className="mt-8 bg-primary/5 border-primary/20">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  💡 Conseil
                </CardTitle>
                <CardDescription className="text-base">
                  Suis les guides dans l'ordre pour une progression optimale. Commence par "Débuter" 
                  avant de passer aux sections "Entreprise" et "Vendre".
                </CardDescription>
              </CardHeader>
            </Card>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Guides;
