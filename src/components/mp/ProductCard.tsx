import type { MPResult } from '@/hooks/use-mp';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Heart, ExternalLink, TrendingUp, TrendingDown, Package, Users, BarChart3, AlertTriangle } from 'lucide-react';

interface ProductCardProps {
  result: MPResult;
  onFavorite?: (asin: string, countryCode: string, productName?: string, imageUrl?: string) => void;
  isFavorite?: boolean;
}

const ProductCard = ({ result, onFavorite, isFavorite }: ProductCardProps) => {
  const roiFba = result.roi_fba;
  const roiFbm = result.roi_fbm;
  const alerts = result.alerts ? result.alerts.split(',').map(a => a.trim()).filter(Boolean) : [];

  const formatPrice = (price: number | null) => {
    if (price === null || price === undefined) return '—';
    return `${price.toFixed(2)} €`;
  };

  const formatPercent = (val: number | null) => {
    if (val === null || val === undefined) return '—';
    return `${val.toFixed(1)}%`;
  };

  const getRoiColor = (roi: number | null) => {
    if (roi === null || roi === undefined) return 'text-muted-foreground';
    if (roi >= 30) return 'text-green-500';
    if (roi >= 10) return 'text-yellow-500';
    return 'text-red-500';
  };

  return (
    <Card className="overflow-hidden">
      <CardContent className="p-4">
        <div className="flex gap-4">
          {/* Image */}
          <div className="shrink-0 w-20 h-20 rounded-md overflow-hidden bg-muted flex items-center justify-center">
            {result.image_url ? (
              <img src={result.image_url} alt={result.product_name || result.asin} className="w-full h-full object-contain" />
            ) : (
              <Package className="h-8 w-8 text-muted-foreground" />
            )}
          </div>

          {/* Info */}
          <div className="flex-1 min-w-0">
            {/* Title + ASIN */}
            <div className="flex items-start justify-between gap-2">
              <div className="min-w-0">
                <p className="font-medium text-sm truncate">{result.product_name || result.asin}</p>
                <p className="text-xs text-muted-foreground font-mono">{result.asin}</p>
              </div>
              <div className="flex gap-1 shrink-0">
                {onFavorite && (
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-7 w-7"
                    onClick={() => onFavorite(result.asin, result.country_code, result.product_name || undefined, result.image_url || undefined)}
                  >
                    <Heart className={`h-4 w-4 ${isFavorite ? 'fill-red-500 text-red-500' : ''}`} />
                  </Button>
                )}
                {result.amazon_url && (
                  <Button variant="ghost" size="icon" className="h-7 w-7" asChild>
                    <a href={result.amazon_url} target="_blank" rel="noopener noreferrer">
                      <ExternalLink className="h-4 w-4" />
                    </a>
                  </Button>
                )}
              </div>
            </div>

            {/* Alerts */}
            {alerts.length > 0 && (
              <div className="flex flex-wrap gap-1 mt-1">
                {alerts.map(alert => (
                  <Badge key={alert} variant="destructive" className="text-xs py-0 px-1.5">
                    <AlertTriangle className="h-3 w-3 mr-0.5" />
                    {alert}
                  </Badge>
                ))}
              </div>
            )}

            {/* Price + Key metrics */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-3">
              <div>
                <p className="text-xs text-muted-foreground">Prix vente</p>
                <p className="font-semibold text-sm">{formatPrice(result.sell_price)}</p>
              </div>
              <div>
                <p className="text-xs text-muted-foreground">BSR</p>
                <p className="font-semibold text-sm flex items-center gap-1">
                  <BarChart3 className="h-3 w-3" />
                  {result.bsr?.toLocaleString() || '—'}
                </p>
              </div>
              <div>
                <p className="text-xs text-muted-foreground">Ventes/mois</p>
                <p className="font-semibold text-sm">{result.sales_monthly ?? '—'}</p>
              </div>
              <div>
                <p className="text-xs text-muted-foreground">Catégorie</p>
                <p className="font-semibold text-sm truncate" title={result.category || ''}>
                  {result.category || '—'}
                </p>
              </div>
            </div>

            {/* FBA / FBM */}
            <div className="grid grid-cols-2 gap-3 mt-3">
              <div className="rounded-md bg-muted/50 p-2">
                <p className="text-xs font-medium mb-1">FBA</p>
                <div className="flex items-center gap-2">
                  {roiFba !== null && roiFba !== undefined ? (
                    <>
                      {roiFba >= 0 ? <TrendingUp className="h-3.5 w-3.5 text-green-500" /> : <TrendingDown className="h-3.5 w-3.5 text-red-500" />}
                      <span className={`font-bold text-sm ${getRoiColor(roiFba)}`}>{formatPercent(roiFba)}</span>
                    </>
                  ) : (
                    <span className="text-xs text-muted-foreground">—</span>
                  )}
                  {result.profit_fba !== null && result.profit_fba !== undefined && (
                    <span className="text-xs text-muted-foreground ml-auto">{formatPrice(result.profit_fba)}</span>
                  )}
                </div>
                <div className="flex items-center gap-1 mt-1 text-xs text-muted-foreground">
                  <Users className="h-3 w-3" />
                  <span>{result.fba_sellers ?? 0} vendeurs</span>
                  {result.fba_fee !== null && result.fba_fee !== undefined && (
                    <span className="ml-auto">Fee: {formatPrice(result.fba_fee)}</span>
                  )}
                </div>
              </div>

              <div className="rounded-md bg-muted/50 p-2">
                <p className="text-xs font-medium mb-1">FBM</p>
                <div className="flex items-center gap-2">
                  {roiFbm !== null && roiFbm !== undefined ? (
                    <>
                      {roiFbm >= 0 ? <TrendingUp className="h-3.5 w-3.5 text-green-500" /> : <TrendingDown className="h-3.5 w-3.5 text-red-500" />}
                      <span className={`font-bold text-sm ${getRoiColor(roiFbm)}`}>{formatPercent(roiFbm)}</span>
                    </>
                  ) : (
                    <span className="text-xs text-muted-foreground">—</span>
                  )}
                  {result.profit_fbm !== null && result.profit_fbm !== undefined && (
                    <span className="text-xs text-muted-foreground ml-auto">{formatPrice(result.profit_fbm)}</span>
                  )}
                </div>
                <div className="flex items-center gap-1 mt-1 text-xs text-muted-foreground">
                  <Users className="h-3 w-3" />
                  <span>{result.fbm_sellers ?? 0} vendeurs</span>
                </div>
              </div>
            </div>

            {/* Additional info */}
            <div className="flex items-center gap-3 mt-2 text-xs text-muted-foreground">
              <span>Commission: {formatPercent(result.commission_pct)}</span>
              {result.variations !== null && result.variations !== undefined && result.variations > 0 && (
                <span>{result.variations} variations</span>
              )}
              {result.ean && <span className="font-mono">EAN: {result.ean}</span>}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default ProductCard;
