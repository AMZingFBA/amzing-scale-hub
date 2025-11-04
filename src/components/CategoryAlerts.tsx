import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { AlertCircle, Link2, Image, Video, Mic, FileText } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { useNotifications } from '@/hooks/use-notifications';

interface CategoryAlertsProps {
  category: string;
  subcategory?: string;
}

const CategoryAlerts = ({ category, subcategory }: CategoryAlertsProps) => {
  const [alerts, setAlerts] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedAlert, setSelectedAlert] = useState<any>(null);
  const { toast } = useToast();
  const { markAsRead } = useNotifications();

  const handleAlertClick = (alert: any) => {
    setSelectedAlert(alert);
    // Mark as read when opening the alert
    markAsRead(category, subcategory);
    toast({
      description: "✓ Alerte ouverte",
    });
  };

  useEffect(() => {
    loadAlerts();
    
    // Real-time subscription
    const alertsChannel = supabase
      .channel(`alerts-${category}-${subcategory || 'all'}`)
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'admin_alerts',
          filter: subcategory 
            ? `category=eq.${category},subcategory=eq.${subcategory}`
            : `category=eq.${category}`
        },
        (payload) => {
          toast({
            title: "🔔 Nouvelle alerte !",
            description: payload.new.title,
          });
          loadAlerts();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(alertsChannel);
    };
  }, [category, subcategory]);

  const loadAlerts = async () => {
    try {
      let query = supabase
        .from('admin_alerts')
        .select('*')
        .eq('category', category)
        .order('created_at', { ascending: false })
        .limit(5);

      // Si une sous-catégorie est spécifiée, filtrer uniquement sur cette sous-catégorie
      if (subcategory) {
        query = query.eq('subcategory', subcategory);
      } else {
        // Si pas de sous-catégorie spécifiée, ne montrer que les alertes sans sous-catégorie
        // (les alertes générales de la catégorie)
        query = query.is('subcategory', null);
      }

      const { data, error } = await query;

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

  if (isLoading) {
    return null;
  }

  if (alerts.length === 0) {
    return null;
  }

  return (
    <>
      <div className="mb-6 space-y-3">
        <div className="flex items-center gap-2 text-sm font-medium text-muted-foreground">
          <AlertCircle className="w-4 h-4" />
          <span>Alertes récentes</span>
        </div>
        
        {alerts.map((alert) => (
          <Card 
            key={alert.id} 
            className="border-l-4 border-l-primary bg-primary/5"
          >
            <CardContent className="pt-4 space-y-3">
              <div className="flex items-start justify-between gap-2">
                <h4 className="font-semibold text-sm">{alert.title}</h4>
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
                  className="inline-flex items-center gap-2 text-primary hover:underline text-sm font-medium"
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

              <button
                onClick={() => handleAlertClick(alert)}
                className="text-sm text-primary hover:underline font-medium"
              >
                Voir plus de détails
              </button>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Alert Detail Dialog */}
      <Dialog open={!!selectedAlert} onOpenChange={() => setSelectedAlert(null)}>
        <DialogContent className="max-w-3xl max-h-[80vh]" onClick={(e) => e.stopPropagation()}>
          <DialogHeader>
            <DialogTitle>{selectedAlert?.title}</DialogTitle>
          </DialogHeader>
          
          <div className="space-y-4 overflow-y-auto max-h-[60vh]">
            {selectedAlert?.content && (
              <p className="text-sm text-muted-foreground whitespace-pre-wrap">
                {selectedAlert.content}
              </p>
            )}

            {selectedAlert?.link_url && (
              <a
                href={selectedAlert.link_url}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 text-primary hover:underline text-sm font-medium"
                onClick={(e) => e.stopPropagation()}
              >
                <Link2 className="w-4 h-4" />
                Voir le lien
              </a>
            )}

            {selectedAlert?.file_url && (
              <div className="space-y-2">
                {selectedAlert.file_type === 'image' && (
                  <img
                    src={selectedAlert.file_url}
                    alt={selectedAlert.file_name}
                    className="w-full rounded-lg"
                  />
                )}
                {selectedAlert.file_type === 'video' && (
                  <video
                    src={selectedAlert.file_url}
                    controls
                    className="w-full rounded-lg"
                  />
                )}
                {selectedAlert.file_type === 'audio' && (
                  <audio src={selectedAlert.file_url} controls className="w-full" />
                )}
                <Badge variant="outline" className="text-xs">
                  {getFileIcon(selectedAlert?.file_type)}
                  <span className="ml-1">{selectedAlert?.file_name}</span>
                </Badge>
              </div>
            )}

            <p className="text-xs text-muted-foreground pt-2 border-t">
              Publié le {selectedAlert && new Date(selectedAlert.created_at).toLocaleDateString('fr-FR', {
                day: 'numeric',
                month: 'long',
                year: 'numeric',
                hour: '2-digit',
                minute: '2-digit'
              })}
            </p>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default CategoryAlerts;
