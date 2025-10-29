import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/hooks/use-auth';
import { useMarkAsRead } from '@/hooks/use-mark-as-read';
import { supabase } from '@/integrations/supabase/client';
import { Capacitor } from '@capacitor/core';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { BookOpen, Link2, Image, Video, Mic, FileText, ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';

const RulesAlerts = () => {
  const { user, isLoading: isAuthLoading } = useAuth();
  const navigate = useNavigate();
  const [alerts, setAlerts] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const isNativeApp = Capacitor.isNativePlatform();

  // Mark alerts as read when visiting this page
  useMarkAsRead({ category: 'introduction', subcategory: 'règles' });

  useEffect(() => {
    if (!user && !isAuthLoading) {
      navigate('/auth');
      return;
    }

    if (user) {
      loadAlerts();
    }
  }, [user, isAuthLoading, navigate]);

  const loadAlerts = async () => {
    try {
      const { data, error } = await supabase
        .from('admin_alerts')
        .select('*')
        .eq('category', 'introduction')
        .eq('subcategory', 'règles')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setAlerts(data || []);
    } catch (error) {
      console.error('Error loading alerts:', error);
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

  if (isAuthLoading || isLoading) {
    return (
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <main className="flex-grow pt-20">
          <div className="container mx-auto px-4 py-8">
            <Skeleton className="h-8 w-64 mb-6" />
            <div className="space-y-4">
              <Skeleton className="h-32 w-full" />
              <Skeleton className="h-32 w-full" />
              <Skeleton className="h-32 w-full" />
            </div>
          </div>
        </main>
        {!isNativeApp && <Footer />}
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-grow pt-20">
        <div className="container mx-auto px-4 py-8">
          <Button
            variant="ghost"
            onClick={() => navigate('/dashboard')}
            className="mb-6"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Retour au Dashboard
          </Button>

          <div className="flex items-center gap-3 mb-8">
            <BookOpen className="w-8 h-8 text-primary" />
            <h1 className="text-3xl font-bold">Alertes - Règles</h1>
          </div>

          {alerts.length === 0 ? (
            <Card>
              <CardContent className="p-8 text-center">
                <p className="text-muted-foreground">Aucune alerte pour le moment</p>
              </CardContent>
            </Card>
          ) : (
            <div className="space-y-4">
              {alerts.map((alert) => (
                <Card key={alert.id} className="border-l-4 border-l-primary">
                  <CardContent className="p-6 space-y-4">
                    <div className="flex items-start justify-between gap-4">
                      <h2 className="text-xl font-semibold">{alert.title}</h2>
                      <Badge variant="secondary" className="text-xs shrink-0">
                        {new Date(alert.created_at).toLocaleDateString('fr-FR', {
                          day: 'numeric',
                          month: 'short',
                          year: 'numeric'
                        })}
                      </Badge>
                    </div>

                    {alert.content && (
                      <p className="text-muted-foreground whitespace-pre-wrap leading-relaxed">
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
                      <div className="space-y-3">
                        {alert.file_type === 'image' && (
                          <img
                            src={alert.file_url}
                            alt={alert.file_name}
                            className="w-full rounded-lg border"
                          />
                        )}
                        {alert.file_type === 'video' && (
                          <video
                            src={alert.file_url}
                            controls
                            className="w-full rounded-lg border"
                          />
                        )}
                        {alert.file_type === 'audio' && (
                          <audio src={alert.file_url} controls className="w-full" />
                        )}
                        <Badge variant="outline" className="text-xs">
                          {getFileIcon(alert.file_type)}
                          <span className="ml-2">{alert.file_name}</span>
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
      {!isNativeApp && <Footer />}
    </div>
  );
};

export default RulesAlerts;
