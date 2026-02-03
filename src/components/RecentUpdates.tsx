import { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Card } from '@/components/ui/card';
import { Bell, ExternalLink } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useAuth } from '@/hooks/use-auth';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';
import { useToast } from '@/hooks/use-toast';

interface RecentUpdate {
  id: string;
  title: string;
  category: string;
  subcategory: string | null;
  created_at: string;
  link?: string;
  type: 'admin_alert' | 'product_find';
}

const getCategoryRoute = (category: string, subcategory: string | null) => {
  // Introduction
  if (category === 'introduction') {
    if (subcategory === 'notifications') return '/notification-alerts';
    if (subcategory === 'règles') return '/rules-alerts';
    if (subcategory === 'support') return '/support';
    if (subcategory === 'guides') return '/guides';
    return '/dashboard';
  }
  
  // Guides
  if (category === 'guides') {
    const guideRoutes: Record<string, string> = {
      'vendre': '/guides/vendre',
      'trouver': '/guides/trouver',
      'fba': '/guides/fba',
      'fbm': '/guides/fbm',
      'compte': '/guides/compte',
    };
    return guideRoutes[subcategory || ''] || '/guides';
  }
  
  // Produits
  if (category === 'produits') {
    const productRoutes: Record<string, string> = {
      'produits-find': '/produits-find',
      'produits-qogita': '/produits-qogita',
      'produits-eany': '/produits-eany',
      'grossistes': '/grossistes',
      'promotions': '/promotions',
      'sitelist': '/sitelist',
    };
    return productRoutes[subcategory || ''] || '/dashboard';
  }
  
  // Informations
  if (category === 'informations') {
    if (subcategory === 'annonces') return '/annonces';
    if (subcategory === 'actualités') return '/actualite';
    return '/dashboard';
  }
  
  // Communauté
  if (category === 'communaute') {
    if (subcategory === 'général') return '/chat';
    if (subcategory === 'suggestions') return '/suggestions';
    if (subcategory === 'succès') return '/success';
    if (subcategory === 'ventes') return '/sales';
    return '/chat';
  }
  
  // Marketplace
  if (category === 'marketplace') {
    if (subcategory === 'Want to Buy') return '/acheter';
    if (subcategory === 'Want to Sell') return '/vendre';
    return '/marketplace';
  }
  
  // Gestion produits
  if (category === 'gestion_produit') {
    if (subcategory === 'catalogue-produits') return '/catalogue-produits';
    if (subcategory === 'questions') return '/questions';
    return '/catalogue-produits';
  }
  
  // Outils - Return to dashboard for modal-based items
  if (category === 'outils') {
    return '/dashboard';
  }
  
  // Expédition
  if (category === 'expedition') {
    return '/dashboard';
  }

  return '/dashboard';
};

export const RecentUpdates = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [updates, setUpdates] = useState<RecentUpdate[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchRecentUpdates = async () => {
      if (!user) return;

      try {
        // Fetch admin alerts
        const { data: adminAlerts } = await supabase
          .from('admin_alerts')
          .select('id, title, category, subcategory, created_at, link_url')
          .order('created_at', { ascending: false })
          .limit(5);

        // Fetch product find alerts
        const { data: productAlerts } = await supabase
          .from('product_find_alerts')
          .select('id, product_title, source_name, created_at, source_url')
          .order('created_at', { ascending: false })
          .limit(5);

        const allUpdates: RecentUpdate[] = [];

        if (adminAlerts) {
          adminAlerts.forEach(alert => {
            allUpdates.push({
              id: alert.id,
              title: alert.title,
              category: alert.category,
              subcategory: alert.subcategory,
              created_at: alert.created_at,
              link: alert.link_url || undefined,
              type: 'admin_alert'
            });
          });
        }

        if (productAlerts) {
          productAlerts.forEach(alert => {
            const sourceMap: Record<string, string> = {
              'Leclerc': 'produits-leclerc',
              'Carrefour': 'produits-carrefour',
              'Auchan': 'produits-auchan',
              'SmythsToys': 'produits-smythstoys',
              'Miamland': 'produits-miamland',
              'Stokomani': 'produits-stokomani',
              'Eany': 'produits-eany'
            };
            allUpdates.push({
              id: alert.id,
              title: alert.product_title,
              category: 'produits',
              subcategory: sourceMap[alert.source_name] || 'produits-find',
              created_at: alert.created_at,
              link: alert.source_url || undefined,
              type: 'product_find'
            });
          });
        }

        // Sort by date and take 3 most recent
        allUpdates.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
        setUpdates(allUpdates.slice(0, 3));
      } catch (error) {
        console.error('Error fetching recent updates:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchRecentUpdates();

    // Subscribe to new alerts
    const channel = supabase
      .channel('recent-updates')
      .on(
        'postgres_changes',
        { event: 'INSERT', schema: 'public', table: 'admin_alerts' },
        () => fetchRecentUpdates()
      )
      .on(
        'postgres_changes',
        { event: 'INSERT', schema: 'public', table: 'product_find_alerts' },
        () => fetchRecentUpdates()
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [user]);

  if (isLoading || updates.length === 0) return null;

  return (
    <Card className="p-4 mb-6 bg-gradient-to-r from-primary/5 to-primary/10 border-primary/20">
      <div className="flex items-center gap-2 mb-3">
        <Bell className="w-5 h-5 text-primary animate-pulse" />
        <h3 className="font-semibold text-foreground">🆕 Nouveautés</h3>
      </div>
      <div className="space-y-2">
        {updates.map((update) => (
          <Link
            key={update.id}
            to={getCategoryRoute(update.category, update.subcategory)}
            onClick={() => toast({ description: "✓ Ouverture de la section" })}
            className="flex items-start gap-2 p-2 rounded-lg hover:bg-primary/5 transition-colors group"
          >
            <ExternalLink className="w-4 h-4 text-muted-foreground group-hover:text-primary mt-0.5 flex-shrink-0" />
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-foreground truncate group-hover:text-primary">
                {update.title}
              </p>
              <p className="text-xs text-muted-foreground">
                {update.subcategory || update.category}
              </p>
            </div>
            <div className="flex-shrink-0 text-right">
              <p className="text-xs text-muted-foreground whitespace-nowrap">
                {format(new Date(update.created_at), 'dd/MM/yyyy', { locale: fr })}
              </p>
              <p className="text-xs text-muted-foreground whitespace-nowrap">
                {format(new Date(update.created_at), 'HH:mm')}
              </p>
            </div>
          </Link>
        ))}
      </div>
    </Card>
  );
};
