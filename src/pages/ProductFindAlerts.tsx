import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useAuth } from '@/hooks/use-auth';
import { useAdmin } from '@/hooks/use-admin';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Loader2, ArrowLeft, Copy, ExternalLink, TrendingUp, Package, Users, AlertTriangle, Sparkles, Store, Plus } from 'lucide-react';
import { toast } from 'sonner';
import AdminProductAlertForm from '@/components/AdminProductAlertForm';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';

// Mapping des slugs URL vers les noms de source dans la BDD
const SOURCE_MAP: Record<string, string> = {
  'leclerc': 'Leclerc',
  'carrefour': 'Carrefour',
  'auchan': 'Auchan',
  'smyth-toys': 'Smyth-toys',
  'miamland': 'Miamland',
  'stockmani': 'Stockmani',
  'eany': 'Eany',
};

const SOURCE_TITLES: Record<string, string> = {
  'leclerc': 'Produits Leclerc',
  'carrefour': 'Produits Carrefour',
  'auchan': 'Produits Auchan',
  'smyth-toys': 'Produits Smyth-toys',
  'miamland': 'Produits Miamland',
  'stockmani': 'Produits Stockmani',
  'eany': 'Produits Eany',
};

interface ProductAlert {
  id: string;
  source_name: string;
  product_title: string;
  ean: string;
  original_price: number | null;
  current_price: number;
  bsr: string | null;
  bsr_percent: string | null;
  cost_price: number | null;
  sale_price: number | null;
  monthly_sales: string | null;
  fulfillment_type: string | null;
  profit: number | null;
  roi: number | null;
  fba_profit: number | null;
  fba_roi: number | null;
  private_label: string | null;
  product_size: string | null;
  meltable: string | null;
  variations: string | null;
  sellers: string | null;
  amazon_url: string | null;
  sas_url: string | null;
  source_url: string | null;
  created_at: string;
}

export default function ProductFindAlerts() {
  const navigate = useNavigate();
  const { source } = useParams<{ source?: string }>();
  const { user, isLoading: authLoading, isVIP } = useAuth();
  const { isAdmin } = useAdmin();
  const [alerts, setAlerts] = useState<ProductAlert[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showAdminForm, setShowAdminForm] = useState(false);

  // Déterminer le filtre source basé sur l'URL
  const sourceFilter = source ? SOURCE_MAP[source] : null;
  const pageTitle = source ? SOURCE_TITLES[source] || 'Product Find' : '🔥 Product Find';

  const loadAlerts = async () => {
    try {
      let query = supabase
        .from('product_find_alerts')
        .select('*');
      
      // Filtrer par source si spécifié dans l'URL
      if (sourceFilter) {
        query = query.ilike('source_name', `%${sourceFilter}%`);
      }
      
      const { data, error } = await query.order('created_at', { ascending: false });

      if (error) throw error;
      setAlerts(data || []);
    } catch (error) {
      console.error('Error loading alerts:', error);
      toast.error('Erreur lors du chargement des alertes');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (!authLoading && user) {
      loadAlerts();
    }
  }, [user, authLoading]);

  // Real-time subscription
  useEffect(() => {
    const channel = supabase
      .channel('product-find-alerts')
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'product_find_alerts' },
        () => {
          loadAlerts();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [sourceFilter]);

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    toast.success('Copié !');
  };

  if (authLoading || isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!user) {
    navigate('/auth');
    return null;
  }

  if (!isVIP && !isAdmin) {
    return (
      <div className="min-h-screen flex items-center justify-center p-6">
        <Card className="max-w-md w-full">
          <CardHeader>
            <h2 className="text-xl font-bold text-center">💳 Accès VIP requis</h2>
          </CardHeader>
          <CardContent className="text-center">
            <p className="text-muted-foreground mb-4">Cette section est réservée aux membres VIP.</p>
            <Button onClick={() => navigate('/tarifs')}>Devenir VIP</Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-secondary/10 to-primary/5">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-4">
            <button
              onClick={() => navigate('/dashboard')}
              className="bg-primary hover:bg-primary/90 p-3 md:p-2 rounded-full shadow-lg transition-all shrink-0"
              aria-label="Retour au dashboard"
            >
              <ArrowLeft className="w-6 h-6 md:w-5 md:h-5 text-white" />
            </button>
            <div className="text-center flex-1">
              <h1 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent pb-2">
                {pageTitle}
              </h1>
              <p className="text-muted-foreground">
                {sourceFilter ? `Alertes ${sourceFilter} en temps réel` : 'Alertes produits rentables en temps réel'}
              </p>
            </div>
          </div>

          {/* Admin button */}
          {isAdmin && (
            <div className="flex justify-center">
              <Dialog open={showAdminForm} onOpenChange={setShowAdminForm}>
                <DialogTrigger asChild>
                  <Button className="gap-2">
                    <Plus className="w-4 h-4" />
                    Ajouter une alerte
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
                  <DialogHeader>
                    <DialogTitle>Nouvelle alerte produit</DialogTitle>
                  </DialogHeader>
                  <AdminProductAlertForm 
                    onSuccess={() => {
                      setShowAdminForm(false);
                      loadAlerts();
                    }} 
                  />
                </DialogContent>
              </Dialog>
            </div>
          )}
        </div>

        {/* Alerts list */}
        {alerts.length === 0 ? (
          <Card className="text-center py-12">
            <CardContent>
              <Sparkles className="w-12 h-12 mx-auto text-muted-foreground mb-4" />
              <h3 className="text-xl font-semibold mb-2">Aucune alerte pour le moment</h3>
              <p className="text-muted-foreground">Les nouvelles alertes produits apparaîtront ici.</p>
            </CardContent>
          </Card>
        ) : (
          <div className="grid gap-6">
            {alerts.map((alert) => (
              <ProductAlertCard key={alert.id} alert={alert} onCopy={copyToClipboard} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

function ProductAlertCard({ alert, onCopy }: { alert: ProductAlert; onCopy: (text: string) => void }) {
  const hasDiscount = alert.original_price && alert.original_price > alert.current_price;
  const discountPercent = hasDiscount 
    ? Math.round(((alert.original_price! - alert.current_price) / alert.original_price!) * 100)
    : 0;

  return (
    <Card className="overflow-hidden border-2 hover:border-primary/50 transition-all duration-300 hover:shadow-xl">
      {/* Header with source */}
      <div className="bg-gradient-to-r from-primary/20 to-secondary/20 px-6 py-3 border-b">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Store className="w-5 h-5 text-primary" />
            <span className="font-bold text-lg">{alert.source_name}</span>
          </div>
          <span className="text-sm text-muted-foreground">
            {new Date(alert.created_at).toLocaleDateString('fr-FR', {
              day: 'numeric',
              month: 'short',
              hour: '2-digit',
              minute: '2-digit'
            })}
          </span>
        </div>
      </div>

      <CardContent className="p-6 space-y-6">
        {/* Product title */}
        <h3 className="text-xl font-semibold leading-tight">{alert.product_title}</h3>

        {/* EAN & Price */}
        <div className="flex flex-wrap items-center gap-4">
          <div className="flex items-center gap-2">
            <span className="text-sm text-muted-foreground">EAN:</span>
            <code className="bg-muted px-3 py-1 rounded font-mono text-sm">{alert.ean}</code>
            <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => onCopy(alert.ean)}>
              <Copy className="w-4 h-4" />
            </Button>
          </div>
          
          <div className="flex items-center gap-2">
            <span className="text-sm text-muted-foreground">Prix:</span>
            {hasDiscount && (
              <span className="text-muted-foreground line-through">{alert.original_price?.toFixed(2)} €</span>
            )}
            <span className="text-xl font-bold text-green-500">{alert.current_price.toFixed(2)} €</span>
            {hasDiscount && (
              <Badge variant="destructive" className="ml-1">-{discountPercent}%</Badge>
            )}
          </div>
        </div>

        {/* SAS Info */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 p-4 bg-muted/30 rounded-xl">
          {alert.bsr && (
            <div className="space-y-1">
              <span className="text-xs text-muted-foreground block">BSR</span>
              <span className="font-semibold">{alert.bsr}</span>
              {alert.bsr_percent && <span className="text-xs text-muted-foreground"> ({alert.bsr_percent})</span>}
            </div>
          )}
          {alert.cost_price && (
            <div className="space-y-1">
              <span className="text-xs text-muted-foreground block">Coût</span>
              <span className="font-semibold">{alert.cost_price.toFixed(2)} €</span>
            </div>
          )}
          {alert.sale_price && (
            <div className="space-y-1">
              <span className="text-xs text-muted-foreground block">Prix vente</span>
              <span className="font-semibold">{alert.sale_price.toFixed(2)} €</span>
            </div>
          )}
          {alert.monthly_sales && (
            <div className="space-y-1">
              <span className="text-xs text-muted-foreground block">Ventes/mois</span>
              <span className="font-semibold">{alert.monthly_sales}</span>
            </div>
          )}
        </div>

        {/* Profit Info */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* FBM */}
          {alert.profit && alert.roi && (
            <div className="p-4 rounded-xl bg-blue-500/10 border border-blue-500/30">
              <div className="flex items-center gap-2 mb-2">
                <Badge className="bg-blue-500">FBM 🔹</Badge>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <span className="text-xs text-muted-foreground block">Profit</span>
                  <span className="text-lg font-bold text-green-500">{alert.profit.toFixed(2)} €</span>
                </div>
                <div>
                  <span className="text-xs text-muted-foreground block">ROI</span>
                  <span className="text-lg font-bold text-primary">{alert.roi.toFixed(2)} %</span>
                </div>
              </div>
            </div>
          )}

          {/* FBA */}
          {alert.fba_profit && alert.fba_roi && (
            <div className="p-4 rounded-xl bg-orange-500/10 border border-orange-500/30">
              <div className="flex items-center gap-2 mb-2">
                <Badge className="bg-orange-500">FBA 🔸</Badge>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <span className="text-xs text-muted-foreground block">Profit</span>
                  <span className="text-lg font-bold text-green-500">{alert.fba_profit.toFixed(2)} €</span>
                </div>
                <div>
                  <span className="text-xs text-muted-foreground block">ROI</span>
                  <span className="text-lg font-bold text-primary">{alert.fba_roi.toFixed(2)} %</span>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Alerts/Info */}
        <div className="flex flex-wrap gap-2">
          {alert.private_label && (
            <Badge variant="outline" className="gap-1">
              <AlertTriangle className="w-3 h-3" />
              Private Label: {alert.private_label}
            </Badge>
          )}
          {alert.product_size && (
            <Badge variant="outline">Size: {alert.product_size}</Badge>
          )}
          {alert.meltable && (
            <Badge variant="outline">Meltable: {alert.meltable}</Badge>
          )}
          {alert.variations && (
            <Badge variant="outline">
              <Package className="w-3 h-3 mr-1" />
              Variations: {alert.variations}
            </Badge>
          )}
          {alert.sellers && (
            <Badge variant="outline">
              <Users className="w-3 h-3 mr-1" />
              Sellers: {alert.sellers}
            </Badge>
          )}
        </div>

        {/* Links */}
        <div className="flex flex-wrap gap-3 pt-4 border-t">
          {alert.amazon_url && (
            <Button variant="outline" size="sm" className="gap-2" asChild>
              <a href={alert.amazon_url} target="_blank" rel="noopener noreferrer">
                <ExternalLink className="w-4 h-4" />
                Amazon
              </a>
            </Button>
          )}
          {alert.sas_url && (
            <Button variant="outline" size="sm" className="gap-2" asChild>
              <a href={alert.sas_url} target="_blank" rel="noopener noreferrer">
                <TrendingUp className="w-4 h-4" />
                SAS
              </a>
            </Button>
          )}
          {alert.source_url && (
            <Button variant="outline" size="sm" className="gap-2" asChild>
              <a href={alert.source_url} target="_blank" rel="noopener noreferrer">
                <Store className="w-4 h-4" />
                {alert.source_name}
              </a>
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
