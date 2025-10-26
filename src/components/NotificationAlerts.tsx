import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { AlertCircle, Link2, Image, Video, Mic, FileText, Bell } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

const NotificationAlerts = () => {
  const [alerts, setAlerts] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
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
            });
            loadAlerts();
          }
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(alertsChannel);
    };
  }, []);

  const loadAlerts = async () => {
    try {
      const { data, error } = await supabase
        .from('admin_alerts')
        .select('*')
        .in('category', ['guides', 'produits', 'informations'])
        .order('created_at', { ascending: false })
        .limit(10);

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

  const getCategoryLabel = (category: string) => {
    switch (category) {
      case 'guides': return 'Nouveau Guide';
      case 'produits': return 'Produits Gagnants';
      case 'informations': return 'Informations';
      default: return category;
    }
  };

  if (isLoading) {
    return null;
  }

  if (alerts.length === 0) {
    return null;
  }

  return (
    <div className="mb-6 space-y-3">
      <div className="flex items-center gap-2 px-4 py-3 bg-destructive/10 border-l-4 border-l-destructive rounded-md">
        <Bell className="w-5 h-5 text-destructive animate-pulse" />
        <span className="font-semibold text-destructive">Notifications Importantes</span>
        <Badge variant="destructive" className="ml-auto">{alerts.length}</Badge>
      </div>
      
      {alerts.map((alert) => (
        <Card key={alert.id} className="border-l-4 border-l-destructive bg-destructive/5">
          <CardContent className="pt-4 space-y-3">
            <div className="flex items-start justify-between gap-2">
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <Badge variant="outline" className="text-xs border-destructive text-destructive">
                    {getCategoryLabel(alert.category)}
                  </Badge>
                  {alert.subcategory && (
                    <Badge variant="secondary" className="text-xs">
                      {alert.subcategory}
                    </Badge>
                  )}
                </div>
                <h4 className="font-semibold text-sm">{alert.title}</h4>
              </div>
              <Badge variant="destructive" className="text-xs">Nouveau</Badge>
            </div>

            {alert.content && (
              <p className="text-sm text-muted-foreground whitespace-pre-wrap line-clamp-3">
                {alert.content}
              </p>
            )}
            
            {alert.link_url && (
              <a
                href={alert.link_url}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 text-primary hover:underline text-sm font-medium"
              >
                <Link2 className="w-3 h-3" />
                Voir le lien
              </a>
            )}

            {alert.file_url && (
              <div className="space-y-2">
                {alert.file_type === 'image' && (
                  <img
                    src={alert.file_url}
                    alt={alert.file_name}
                    className="w-full max-h-48 object-cover rounded-lg"
                  />
                )}
                {alert.file_type === 'video' && (
                  <video
                    src={alert.file_url}
                    controls
                    className="w-full max-h-48 rounded-lg"
                  />
                )}
                {alert.file_type === 'audio' && (
                  <audio src={alert.file_url} controls className="w-full" />
                )}
                <Badge variant="outline" className="text-xs">
                  {getFileIcon(alert.file_type)}
                  <span className="ml-1">{alert.file_name}</span>
                </Badge>
              </div>
            )}

            <p className="text-xs text-muted-foreground">
              {new Date(alert.created_at).toLocaleDateString('fr-FR', {
                day: 'numeric',
                month: 'long',
                hour: '2-digit',
                minute: '2-digit'
              })}
            </p>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};

export default NotificationAlerts;
