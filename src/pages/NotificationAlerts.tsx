import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/hooks/use-auth';
import { supabase } from '@/integrations/supabase/client';
import { Capacitor } from '@capacitor/core';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Loader2, AlertCircle, Link2, Image, Video, Mic, FileText, Bell, ArrowLeft } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

const NotificationAlerts = () => {
  const { user, isVIP, isLoading: isAuthLoading } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [alerts, setAlerts] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const isNativeApp = Capacitor.isNativePlatform();

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
      
      // Real-time subscription pour toutes les catégories importantes
      const alertsChannel = supabase
        .channel('notification-alerts')
        .on(
          'postgres_changes',
          {
            event: 'INSERT',
            schema: 'public',
            table: 'admin_alerts'
          },
          (payload) => {
            // Filtrer uniquement les catégories importantes
            if (['guides', 'produits', 'informations'].includes(payload.new.category)) {
              toast({
                title: "🔔 Nouvelle notification importante !",
                description: payload.new.title,
                variant: "destructive",
              });
              loadAlerts();
            }
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
      const { data, error } = await supabase
        .from('admin_alerts')
        .select('*')
        .in('category', ['guides', 'produits', 'informations'])
        .order('created_at', { ascending: false });

      if (error) throw error;
      setAlerts(data || []);
    } catch (error) {
      console.error('Error loading alerts:', error);
      toast({
        title: "Erreur",
        description: "Impossible de charger les notifications",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const getFileIcon = (fileType: string) => {
    switch (fileType) {
      case 'image': return <Image className="w-4 h-4" />;
      case 'video': return <Video className="w-4 h-4" />;
      case 'audio': return <Mic className="w-4 h-4" />;
      default: return <FileText className="w-4 h-4" />;
    }
  };

  const getCategoryLabel = (category: string) => {
    switch (category) {
      case 'guides': return 'Nouveau Guide';
      case 'produits': return 'Produits Gagnants';
      case 'informations': return 'Informations';
      default: return category;
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
      <main className="flex-grow pt-20">
        <div className="container mx-auto px-4 py-8 max-w-4xl">
          <div className="flex items-center gap-3 mb-8 relative">
            <button
              onClick={() => navigate('/dashboard')}
              className="absolute -left-12 top-0 bg-primary/90 backdrop-blur-sm p-2 rounded-full shadow-lg hover:bg-primary transition-all"
              aria-label="Retour"
            >
              <ArrowLeft className="w-5 h-5 text-primary-foreground" />
            </button>
            <Bell className="w-8 h-8 text-destructive" />
            <div>
              <h1 className="text-4xl font-bold">Notifications Importantes</h1>
              <p className="text-muted-foreground">
                Nouveaux guides, produits gagnants et informations importantes
              </p>
            </div>
          </div>

          {alerts.length === 0 ? (
            <Card>
              <CardContent className="pt-6 text-center">
                <AlertCircle className="w-12 h-12 mx-auto mb-4 text-muted-foreground" />
                <p className="text-muted-foreground">
                  Aucune notification pour le moment. Revenez bientôt !
                </p>
              </CardContent>
            </Card>
          ) : (
            <div className="space-y-6">
              {alerts.map((alert) => (
                <Card key={alert.id} className="border-l-4 border-l-destructive">
                  <CardHeader>
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <Badge variant="outline" className="text-xs border-destructive text-destructive">
                            {getCategoryLabel(alert.category)}
                          </Badge>
                          {alert.subcategory && (
                            <Badge variant="secondary" className="text-xs">
                              {alert.subcategory}
                            </Badge>
                          )}
                        </div>
                        <CardTitle className="text-2xl mb-2">{alert.title}</CardTitle>
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
                      <Badge variant="destructive" className="bg-destructive">
                        <Bell className="w-3 h-3 mr-1" />
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
                        Voir le lien
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

export default NotificationAlerts;
