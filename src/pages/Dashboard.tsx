import { useAuth } from '@/hooks/use-auth';
import { Navigate } from 'react-router-dom';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Crown } from 'lucide-react';

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

            {daysRemaining && daysRemaining > 0 && (
              <div className="bg-primary/10 border border-primary/20 rounded-lg p-4 mb-6">
                <p className="text-center">
                  🎉 Essai gratuit actif - Il vous reste <strong>{daysRemaining} jours</strong>
                </p>
              </div>
            )}

            <div className="grid gap-6 md:grid-cols-2">
              <Card>
                <CardHeader>
                  <CardTitle>Formations Exclusives</CardTitle>
                  <CardDescription>Accédez à toutes nos formations premium</CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">
                    Contenu des formations VIP à venir...
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Outils Avancés</CardTitle>
                  <CardDescription>Outils réservés aux membres VIP</CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">
                    Outils VIP à venir...
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Support Prioritaire</CardTitle>
                  <CardDescription>Assistance rapide et personnalisée</CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">
                    Contactez notre équipe support VIP...
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Catalogue Complet</CardTitle>
                  <CardDescription>Accès à tous les produits</CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">
                    Parcourez notre catalogue exclusif...
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Dashboard;
