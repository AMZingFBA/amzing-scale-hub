import { useState, useMemo } from 'react';
import type { MPResult } from '@/hooks/use-mp';
import { COUNTRY_OPTIONS } from '@/hooks/use-mp';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Heart, ExternalLink, Package, Users, AlertTriangle, TrendingUp, TrendingDown, ShoppingCart, Info } from 'lucide-react';

interface ProductCardProps {
  result: MPResult;
  onFavorite?: (asin: string, countryCode: string, productName?: string, imageUrl?: string) => void;
  isFavorite?: boolean;
}

// Exact SellerAmp profit formula (GetProfit + CalculateVatDue + GetTotalFees)
function computeProfit(result: MPResult, buyPrice: number) {
  if (!buyPrice || buyPrice <= 0 || !result.sell_price) return null;

  const country = COUNTRY_OPTIONS.find(c => c.code === result.country_code);
  const vatRate = (country?.vat || 1.20) - 1; // 0.20 for FR
  const sell = result.sell_price;

  // Worker pre-calculates total fees (including DST, FBA fee from fee table)
  const totalFeesFba = result.total_fees_fba;
  const totalFeesFbm = result.total_fees_fbm ?? 0;

  // VAT (SellerAmp vat_scheme=3 STANDARD, vat_on_sale=1, vat_on_cost=1)
  const vatOnSale = sell - sell / (1 + vatRate);
  const vatOnCost = buyPrice - buyPrice / (1 + vatRate);
  const vatOnFees = 0; // useAmazonFeeVatRules20240801=0
  const vatDue = vatOnSale - vatOnCost - vatOnFees;

  // FBM profit: sale - totalFees - cost - vatOnFees - vatDue
  const profitFbm = Math.round((sell - totalFeesFbm - buyPrice - vatOnFees - vatDue) * 100) / 100;
  const roiFbm = Math.round((profitFbm / buyPrice) * 10000) / 100;

  // FBA profit
  let profitFba = null as number | null;
  let roiFba = null as number | null;
  if (totalFeesFba != null) {
    profitFba = Math.round((sell - totalFeesFba - buyPrice - vatOnFees - vatDue) * 100) / 100;
    roiFba = Math.round((profitFba / buyPrice) * 10000) / 100;
  }

  // Max cost (FBA): find cost where profit = 0
  // 0 = sell - fees - cost - (vatOnSale - cost + cost/(1+vat)) = sell - fees - vatOnSale - cost/(1+vat)
  // cost/(1+vat) = sell - fees - vatOnSale => cost = (sell - fees - vatOnSale) * (1+vat)
  // Simplified: maxCost where vatDue cancels out
  let maxCost = null as number | null;
  if (totalFeesFba != null) {
    // profit = sell - fees - cost - (sell - sell/(1+v)) + (cost - cost/(1+v))
    // profit = sell/(1+v) - fees - cost/(1+v)
    // 0 = sell/(1+v) - fees - maxCost/(1+v)
    // maxCost = sell - fees*(1+v)
    maxCost = Math.round((sell - totalFeesFba * (1 + vatRate)) * 100) / 100;
  }

  const profitMargin = profitFba != null ? Math.round((profitFba / sell) * 10000) / 100 : null;

  // DST fee from worker
  const dstFee = result.dst_fee || 0;

  return {
    profitFba, roiFba, profitFbm, roiFbm,
    totalFeesFba, totalFeesFbm,
    dstFee, maxCost, profitMargin,
    vatOnSale: Math.round(vatOnSale * 100) / 100,
    vatOnCost: Math.round(vatOnCost * 100) / 100,
    vatDue: Math.round(vatDue * 100) / 100,
  };
}

const ProductCard = ({ result, onFavorite, isFavorite }: ProductCardProps) => {
  const [buyPrice, setBuyPrice] = useState('');
  const alerts = result.alerts ? result.alerts.split(',').map(a => a.trim()).filter(Boolean) : [];

  const calc = useMemo(() => {
    const bp = parseFloat(buyPrice);
    if (!bp || bp <= 0) return null;
    return computeProfit(result, bp);
  }, [buyPrice, result]);

  const fmt = (v: number | null | undefined) => v != null ? `${v.toFixed(2)}€` : '—';
  const fmtPct = (v: number | null | undefined) => v != null ? `${v.toFixed(2)}%` : '—';

  const roiColor = (roi: number | null | undefined) => {
    if (roi == null) return '';
    if (roi >= 30) return 'text-green-600';
    if (roi >= 10) return 'text-yellow-600';
    return 'text-red-600';
  };

  const profitColor = (p: number | null | undefined) => {
    if (p == null) return '';
    return p >= 0 ? 'text-green-600' : 'text-red-600';
  };

  return (
    <Card className="overflow-hidden">
      <CardContent className="p-0">
        {/* Top banner: image + title + quick info */}
        <div className="flex gap-4 p-4 pb-3 border-b bg-muted/20">
          {/* Image */}
          <div className="shrink-0 w-24 h-24 rounded-md overflow-hidden bg-white border flex items-center justify-center">
            {result.image_url ? (
              <img src={result.image_url} alt="" className="w-full h-full object-contain" />
            ) : (
              <Package className="h-10 w-10 text-muted-foreground/40" />
            )}
          </div>

          {/* Title + identifiers */}
          <div className="flex-1 min-w-0">
            <div className="flex items-start justify-between gap-2">
              <div className="min-w-0">
                <p className="font-semibold text-sm leading-tight line-clamp-2">
                  {result.product_name || result.asin}
                </p>
                <p className="text-xs text-muted-foreground mt-0.5">
                  {result.category || '—'}
                </p>
              </div>
              <div className="flex gap-1 shrink-0">
                {onFavorite && (
                  <Button variant="ghost" size="icon" className="h-7 w-7"
                    onClick={() => onFavorite(result.asin, result.country_code, result.product_name || undefined, result.image_url || undefined)}>
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

            {/* ASIN + EAN */}
            <div className="flex flex-wrap gap-x-3 gap-y-0.5 mt-1 text-xs text-muted-foreground font-mono">
              <span>ASIN: {result.asin}</span>
              {result.ean && <span>EAN: {result.ean}</span>}
            </div>

            {/* Alerts */}
            {alerts.length > 0 && (
              <div className="flex flex-wrap gap-1 mt-1.5">
                {alerts.map(alert => (
                  <Badge key={alert} variant="destructive" className="text-[10px] py-0 px-1.5 h-4">
                    <AlertTriangle className="h-2.5 w-2.5 mr-0.5" />
                    {alert}
                  </Badge>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Quick Info bar */}
        <div className="grid grid-cols-4 sm:grid-cols-6 gap-px bg-border">
          {[
            { label: 'BSR', value: result.bsr?.toLocaleString('fr-FR') || '—' },
            { label: 'Ventes/mois', value: result.sales_monthly?.toString() || '—' },
            { label: 'FBA Sellers', value: result.fba_sellers?.toString() || '0' },
            { label: 'FBM Sellers', value: result.fbm_sellers?.toString() || '0' },
            { label: 'Variations', value: result.variations?.toString() || '0' },
            { label: 'Commission', value: `${result.commission_pct || 15}%` },
          ].map(item => (
            <div key={item.label} className="bg-background px-2 py-1.5 text-center">
              <p className="text-[10px] text-muted-foreground leading-none">{item.label}</p>
              <p className="text-xs font-semibold mt-0.5">{item.value}</p>
            </div>
          ))}
        </div>

        {/* Profit Calculator */}
        <div className="p-4">
          <div className="flex items-center gap-2 mb-3">
            <ShoppingCart className="h-4 w-4 text-primary" />
            <span className="text-sm font-semibold">Profit Calculator</span>
          </div>

          <div className="grid sm:grid-cols-2 gap-4">
            {/* Left: Cost + Sale inputs */}
            <div className="space-y-3">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs text-muted-foreground block mb-1">Prix d'achat (Cost)</label>
                  <Input
                    type="number"
                    step="0.01"
                    min="0"
                    placeholder="0.00 €"
                    value={buyPrice}
                    onChange={(e) => setBuyPrice(e.target.value)}
                    className="h-9 text-sm font-mono"
                  />
                </div>
                <div>
                  <label className="text-xs text-muted-foreground block mb-1">Prix de vente</label>
                  <div className="h-9 flex items-center px-3 rounded-md border bg-muted/30 text-sm font-mono">
                    {fmt(result.sell_price)}
                  </div>
                </div>
              </div>

              {/* FBA result */}
              <div className={`rounded-lg border p-3 ${calc?.profitFba != null && calc.profitFba >= 0 ? 'border-green-200 bg-green-50/50 dark:bg-green-950/20' : calc?.profitFba != null ? 'border-red-200 bg-red-50/50 dark:bg-red-950/20' : ''}`}>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-semibold">FBA</span>
                  <Badge variant="outline" className="text-[10px] h-4">{result.fba_sellers || 0} sellers</Badge>
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <p className="text-[10px] text-muted-foreground">Profit</p>
                    <p className={`text-lg font-bold ${profitColor(calc?.profitFba)}`}>
                      {calc ? fmt(calc.profitFba) : '—'}
                    </p>
                  </div>
                  <div>
                    <p className="text-[10px] text-muted-foreground">ROI</p>
                    <p className={`text-lg font-bold ${roiColor(calc?.roiFba)}`}>
                      {calc ? fmtPct(calc.roiFba) : '—'}
                    </p>
                  </div>
                </div>
              </div>

              {/* FBM result */}
              <div className={`rounded-lg border p-3 ${calc?.profitFbm != null && calc.profitFbm >= 0 ? 'border-green-200 bg-green-50/50 dark:bg-green-950/20' : calc?.profitFbm != null ? 'border-red-200 bg-red-50/50 dark:bg-red-950/20' : ''}`}>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-semibold">FBM</span>
                  <Badge variant="outline" className="text-[10px] h-4">{result.fbm_sellers || 0} sellers</Badge>
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <p className="text-[10px] text-muted-foreground">Profit</p>
                    <p className={`text-lg font-bold ${profitColor(calc?.profitFbm)}`}>
                      {calc ? fmt(calc.profitFbm) : '—'}
                    </p>
                  </div>
                  <div>
                    <p className="text-[10px] text-muted-foreground">ROI</p>
                    <p className={`text-lg font-bold ${roiColor(calc?.roiFbm)}`}>
                      {calc ? fmtPct(calc.roiFbm) : '—'}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Right: Fees detail */}
            <div className="space-y-2 text-xs">
              <div className="flex items-center gap-1 mb-2">
                <Info className="h-3.5 w-3.5 text-muted-foreground" />
                <span className="text-xs font-semibold text-muted-foreground">Détail Fees</span>
              </div>
              <div className="space-y-1.5">
                {[
                  { label: 'Prix de vente', value: fmt(result.sell_price) },
                  { label: `Commission (${result.commission_pct || 15}%)`, value: fmt(result.commission_eur) },
                  { label: 'FBA Fee', value: fmt(result.fba_fee) },
                  { label: 'DST', value: fmt(result.dst_fee) },
                  { label: 'Closing Fee', value: fmt(result.closing_fee) },
                  { label: 'Total Fees (FBA)', value: fmt(result.total_fees_fba), bold: true },
                ].map(item => (
                  <div key={item.label} className={`flex justify-between ${item.bold ? 'font-semibold border-t pt-1.5' : ''}`}>
                    <span className="text-muted-foreground">{item.label}</span>
                    <span className="font-mono">{item.value}</span>
                  </div>
                ))}
              </div>

              {calc && (
                <div className="mt-3 pt-2 border-t space-y-1.5">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">VAT on Sale</span>
                    <span className="font-mono">{fmt(calc.vatOnSale)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">VAT on Cost</span>
                    <span className="font-mono">-{fmt(calc.vatOnCost)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">VAT Due</span>
                    <span className="font-mono font-semibold">{fmt(calc.vatDue)}</span>
                  </div>
                  <div className="flex justify-between border-t pt-1.5">
                    <span className="text-muted-foreground">Max Cost (FBA)</span>
                    <span className="font-mono font-semibold text-green-600">{fmt(calc.maxCost)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Profit Margin</span>
                    <span className="font-mono">{fmtPct(calc.profitMargin)}</span>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default ProductCard;
