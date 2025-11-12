import { useAuth } from '@/hooks/use-auth';
import { useAdmin } from '@/hooks/use-admin';
import { Navigate, Link } from 'react-router-dom';
import { useState, useEffect } from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { AlertCircle, Crown, Database, ExternalLink, RefreshCw } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface QogitaAlert {
  id: string;
  title: string;
  description: string;
  price?: number;
  url?: string;
  timestamp: string;
  category?: string;
}

const MonitorQogita = () => {
  const { user, isVIP, isLoading } = useAuth();
  const { isAdmin } = useAdmin();
  const { toast } = useToast();
  const [alerts, setAlerts] = useState<QogitaAlert[]>([]);
  const [isLoadingAlerts, setIsLoadingAlerts] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadAlerts = async () => {
    setIsLoadingAlerts(true);
    setError(null);
    try {
      const response = await fetch('http://localhost:3000/monitor/qogita');
      if (!response.ok) {
        throw new Error('Erreur lors du chargement des alertes');
      }
      const data = await response.json();
      setAlerts(data);
    } catch (err) {
      setError('Impossible de charger les alertes Qogita');
      toast({
        title: "Erreur",
        description: "Impossible de charger les alertes",
        variant: "destructive",
      });
    } finally {
      setIsLoadingAlerts(false);
    }
  };

  useEffect(() => {
    if (user && (isVIP || isAdmin)) {
      loadAlerts();
    }
  }, [user, isVIP, isAdmin]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/auth" replace />;
  }

  // Page de restriction pour non-VIP
  if (!isVIP && !isAdmin) {
    return (
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <main className="flex-grow pt-20">
          <div className="container mx-auto px-4 py-16">
            <div className="max-w-2xl mx-auto">
              <Card className="border-2 border-primary/20">
                <CardHeader className="text-center space-y-4">
                  <div className="mx-auto w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center">
                    <Crown className="w-8 h-8 text-primary" />
                  </div>
                  <CardTitle className="text-2xl">Accès réservé aux membres VIP</CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="bg-muted/50 rounded-lg p-6 space-y-3">
                    <div className="flex items-start gap-3">
                      <AlertCircle className="w-5 h-5 text-primary mt-0.5 flex-shrink-0" />
                      <p className="text-muted-foreground">
                        💳 Ton abonnement ne permet pas d'accéder au moniteur Qogita.
                      </p>
                    </div>
                    <p className="text-foreground font-medium">
                      Mets à niveau ton compte pour débloquer les alertes produits en temps réel.
                    </p>
                  </div>
                  
                  <div className="space-y-3">
                    <h3 className="font-semibold">Avec le moniteur Qogita :</h3>
                    <ul className="space-y-2 text-sm text-muted-foreground">
                      <li className="flex items-center gap-2">
                        <Database className="w-4 h-4 text-primary" />
                        Alertes produits en temps réel
                      </li>
                      <li className="flex items-center gap-2">
                        <Database className="w-4 h-4 text-primary" />
                        Meilleures opportunités Qogita
                      </li>
                      <li className="flex items-center gap-2">
                        <Database className="w-4 h-4 text-primary" />
                        Accès prioritaire aux deals
                      </li>
                    </ul>
                  </div>

                  <Button asChild className="w-full" size="lg">
                    <Link to="/tarifs">
                      <Crown className="w-4 h-4 mr-2" />
                      Devenir VIP
                    </Link>
                  </Button>
                </CardContent>
              </Card>
            </div>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  // Page pour les membres VIP
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-grow pt-20">
        <div className="container mx-auto px-4 py-8">
          <div className="max-w-6xl mx-auto">
            <div className="flex items-center justify-between mb-8">
              <div className="flex items-center gap-3">
                <Database className="w-8 h-8 text-primary" />
                <div>
                  <h1 className="text-4xl font-bold">Qogita Monitor</h1>
                  <p className="text-muted-foreground mt-1">
                    Alertes produits Qogita en temps réel
                  </p>
                </div>
              </div>
              <Button
                onClick={loadAlerts}
                disabled={isLoadingAlerts}
                variant="outline"
              >
                <RefreshCw className={`w-4 h-4 mr-2 ${isLoadingAlerts ? 'animate-spin' : ''}`} />
                Actualiser
              </Button>
            </div>

            {error && (
              <Card className="mb-6 border-destructive/50 bg-destructive/5">
                <CardContent className="pt-6">
                  <div className="flex items-center gap-3 text-destructive">
                    <AlertCircle className="w-5 h-5" />
                    <p>{error}</p>
                  </div>
                </CardContent>
              </Card>
            )}

            {isLoadingAlerts ? (
              <div className="flex items-center justify-center py-12">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
              </div>
            ) : alerts.length === 0 ? (
              <Card>
                <CardContent className="py-12 text-center">
                  <Database className="w-12 h-12 mx-auto mb-4 text-muted-foreground" />
                  <h3 className="text-lg font-semibold mb-2">Aucune alerte disponible</h3>
                  <p className="text-muted-foreground">
                    Les alertes Qogita apparaîtront ici dès qu'elles seront disponibles.
                  </p>
                </CardContent>
              </Card>
            ) : (
              <div className="grid gap-4">
                {alerts.map((alert) => (
                  <Card key={alert.id} className="hover:shadow-md transition-shadow">
                    <CardHeader>
                      <div className="flex items-start justify-between gap-4">
                        <div className="flex-1">
                          <CardTitle className="text-xl mb-2">{alert.title}</CardTitle>
                          <p className="text-muted-foreground">{alert.description}</p>
                        </div>
                        {alert.category && (
                          <Badge variant="secondary">{alert.category}</Badge>
                        )}
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-4 text-sm text-muted-foreground">
                          {alert.price && (
                            <span className="font-semibold text-primary">
                              {alert.price.toFixed(2)} €
                            </span>
                          )}
                          <span>
                            {new Date(alert.timestamp).toLocaleDateString('fr-FR', {
                              day: '2-digit',
                              month: 'short',
                              year: 'numeric',
                              hour: '2-digit',
                              minute: '2-digit',
                            })}
                          </span>
                        </div>
                        {alert.url && (
                          <Button asChild variant="outline" size="sm">
                            <a href={alert.url} target="_blank" rel="noopener noreferrer">
                              Voir le produit
                              <ExternalLink className="w-3 h-3 ml-2" />
                            </a>
                          </Button>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default MonitorQogita;
