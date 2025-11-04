import { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '@/hooks/use-auth';
import { useMarkAsRead } from '@/hooks/use-mark-as-read';
import { usePullRefresh } from '@/hooks/use-pull-refresh';
import { supabase } from '@/integrations/supabase/client';
import { Capacitor } from '@capacitor/core';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { RefreshButton } from '@/components/RefreshButton';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Loader2, AlertCircle, Link2, Image, Video, Mic, FileText, Sparkles, ArrowLeft } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

const ProductAlerts = () => {
  const { user, isVIP, isLoading: isAuthLoading } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const { toast } = useToast();
  const [alerts, setAlerts] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const isNativeApp = Capacitor.isNativePlatform();

  // Déterminer la sous-catégorie basée sur l'URL
  const getSubcategoryFromPath = () => {
    const path = location.pathname;
    if (path.includes('produits-find')) return 'produits-find';
    if (path.includes('produits-qogita')) return 'produits-qogita';
    if (path.includes('produits-eany')) return 'produits-eany';
    if (path.includes('grossistes')) return 'grossistes';
    if (path.includes('promotions')) return 'promotions';
    if (path.includes('sitelist')) return 'sitelist';
    return null;
  };

  const currentSubcategory = getSubcategoryFromPath();

  // Mark alerts as read when visiting this page
  useMarkAsRead({ category: 'produits', subcategory: currentSubcategory || undefined });

  useEffect(() => {
    if (!user && !isAuthLoading) {
      navigate('/auth');
      return;
    }

    if (!isAuthLoading && !isVIP) {
      toast({
        title: "Accès VIP requis",
        description: "Cette section est réservée aux membres VIP",
        variant: "destructive",
      });
      navigate('/dashboard');
      return;
    }

    if (isVIP) {
      loadAlerts();
      
      // Real-time subscription
      const alertsChannel = supabase
        .channel('product-alerts')
        .on(
          'postgres_changes',
          {
            event: '*',
            schema: 'public',
            table: 'admin_alerts'
          },
          (payload) => {
            if (payload.eventType === 'INSERT') {
              toast({
                title: "🎯 Nouvelle alerte !",
                description: "Un nouveau produit gagnant a été publié",
              });
            }
            loadAlerts();
          }
        )
        .subscribe();

      return () => {
        supabase.removeChannel(alertsChannel);
      };
    }
  }, [user, isVIP, isAuthLoading, navigate]);

  const loadAlerts = async () => {
    try {
      let query = supabase
        .from('admin_alerts')
        .select('*')
        .eq('category', 'produits');

      // Filtrer par sous-catégorie si définie
      if (currentSubcategory) {
        query = query.eq('subcategory', currentSubcategory);
      }

      const { data, error } = await query.order('created_at', { ascending: false });

      if (error) throw error;
      setAlerts(data || []);
      
      toast({
        title: "✅ Rafraîchi",
        description: `${data?.length || 0} alertes chargées`,
      });
    } catch (error) {
      console.error('Error loading alerts:', error);
      toast({
        title: "Erreur",
        description: "Impossible de charger les alertes",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const { isRefreshing, handleRefresh } = usePullRefresh(loadAlerts);

  const getFileIcon = (fileType: string) => {
    switch (fileType) {
      case 'image': return <Image className="w-4 h-4" />;
      case 'video': return <Video className="w-4 h-4" />;
      case 'audio': return <Mic className="w-4 h-4" />;
      default: return <FileText className="w-4 h-4" />;
    }
  };

  const getPageTitle = () => {
    switch (currentSubcategory) {
      case 'produits-find': return 'Product Find';
      case 'produits-qogita': return 'Produits Qogita';
      case 'produits-eany': return 'Produits Eany';
      case 'grossistes': return 'Grossistes';
      case 'promotions': return 'Promotions';
      case 'sitelist': return 'Sitelist';
      default: return 'Produits Gagnants';
    }
  };

  const getSubcategoryLabel = (subcategory: string) => {
    switch (subcategory) {
      case 'produits-find': return 'Product Find';
      case 'produits-qogita': return 'Produits rentables sur Qogita';
      case 'produits-eany': return 'Produits rentables sur Eany';
      case 'grossistes': return 'Liste de produits rentables de grossistes';
      case 'promotions': return 'Promotions';
      case 'sitelist': return 'Liste de sites internet à consulter';
      default: return subcategory;
    }
  };

  if (isLoading || isAuthLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-grow pt-24 md:pt-20">
        <div className="container mx-auto px-4 py-8 max-w-4xl">
          <div className="flex items-center gap-3 mb-8">
            <button
              onClick={() => navigate('/dashboard')}
              className="bg-[#FF9900] hover:bg-[#FF9900]/90 p-3 md:p-2 rounded-full shadow-lg transition-all shrink-0"
              aria-label="Retour au dashboard"
            >
              <ArrowLeft className="w-6 h-6 md:w-5 md:h-5 text-white" />
            </button>
            <Sparkles className="w-8 h-8 text-primary" />
            <div className="flex-1">
              <h1 className="text-3xl md:text-4xl font-bold">{getPageTitle()}</h1>
              <p className="text-sm md:text-base text-muted-foreground">
                Produits gagnants sélectionnés pour vous
              </p>
            </div>
            <RefreshButton 
              onRefresh={handleRefresh} 
              isRefreshing={isRefreshing}
              className="bg-primary hover:bg-primary/90 text-primary-foreground"
            />
          </div>

          {alerts.length === 0 ? (
            <Card>
              <CardContent className="pt-6 text-center">
                <AlertCircle className="w-12 h-12 mx-auto mb-4 text-muted-foreground" />
                <p className="text-muted-foreground">
                  Aucune alerte pour le moment. Revenez bientôt !
                </p>
              </CardContent>
            </Card>
          ) : (
            <div className="space-y-6">
              {alerts.map((alert) => (
                <Card key={alert.id} className="border-l-4 border-l-primary">
                  <CardHeader>
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex-1">
                        <CardTitle className="text-2xl mb-2">{alert.title}</CardTitle>
                        {alert.subcategory && (
                          <Badge variant="secondary" className="text-sm mb-2">
                            {getSubcategoryLabel(alert.subcategory)}
                          </Badge>
                        )}
                        <CardDescription>
                          Publié le {new Date(alert.created_at).toLocaleDateString('fr-FR', {
                            day: 'numeric',
                            month: 'long',
                            year: 'numeric',
                            hour: '2-digit',
                            minute: '2-digit'
                          })}
                        </CardDescription>
                      </div>
                      <Badge variant="default" className="bg-primary">
                        <Sparkles className="w-3 h-3 mr-1" />
                        Nouveau
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {alert.content && (
                      <p className="whitespace-pre-wrap text-base leading-relaxed">
                        {alert.content}
                      </p>
                    )}
                    
                    {alert.link_url && (
                      <a
                        href={alert.link_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-2 text-primary hover:underline font-medium"
                      >
                        <Link2 className="w-4 h-4" />
                        Voir le produit
                      </a>
                    )}

                    {alert.file_url && (
                      <div className="mt-4 space-y-3">
                        {alert.file_type === 'image' && (
                          <img
                            src={alert.file_url}
                            alt={alert.file_name}
                            className="w-full rounded-lg shadow-lg"
                          />
                        )}
                        {alert.file_type === 'video' && (
                          <video
                            src={alert.file_url}
                            controls
                            className="w-full rounded-lg shadow-lg"
                          />
                        )}
                        {alert.file_type === 'audio' && (
                          <div className="bg-accent/50 p-4 rounded-lg">
                            <audio src={alert.file_url} controls className="w-full" />
                          </div>
                        )}
                        <Badge variant="outline">
                          {getFileIcon(alert.file_type)}
                          <span className="ml-1">{alert.file_name}</span>
                        </Badge>
                      </div>
                    )}
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default ProductAlerts;
