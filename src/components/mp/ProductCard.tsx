import { useState, useMemo } from 'react';
import type { MPResult } from '@/hooks/use-mp';
import { COUNTRY_OPTIONS } from '@/hooks/use-mp';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { toast } from 'sonner';
import {
  Heart, ExternalLink, Package, AlertTriangle, ShoppingCart, Info,
  Copy, Search, Ruler, Weight, Box, Link2, Globe, Calculator,
} from 'lucide-react';

interface ProductCardProps {
  result: MPResult;
  onFavorite?: (asin: string, countryCode: string, productName?: string, imageUrl?: string) => void;
  isFavorite?: boolean;
}

const KEEPA_DOMAIN: Record<string, number> = { FR: 4, UK: 2, DE: 3, ES: 9, IT: 8 };
const AMAZON_DOMAIN: Record<string, string> = { FR: 'amazon.fr', UK: 'amazon.co.uk', DE: 'amazon.de', ES: 'amazon.es', IT: 'amazon.it' };

function computeProfit(sellPrice: number, buyPrice: number, fbmCost: number, result: MPResult) {
  if (!buyPrice || buyPrice <= 0 || !sellPrice || sellPrice <= 0) return null;

  const country = COUNTRY_OPTIONS.find(c => c.code === result.country_code);
  const vatRate = (country?.vat || 1.20) - 1;
  const dstPct = country?.dst_pct ?? 0.03;
  const dstOnFba = country?.dst_on_fba ?? true;
  const sell = sellPrice;
  // Always recalculate referral from sell price (not from result.commission_eur which is for the main price)
  const refPct = (result.commission_pct || 15) / 100;
  const referral = sell * refPct;
  const fbaFee = result.fba_fee;
  const closingFee = result.closing_fee || 0;

  // DST — SellerAmp formula: (closing + referral + [fba if dst_on_fba]) * dst_pct
  let dstFba = 0;
  if (dstPct > 0 && fbaFee != null) {
    dstFba = (closingFee + referral + (dstOnFba ? fbaFee : 0)) * dstPct;
  }
  // FBM DST: only on closing + referral (FBM shipping cost is NOT an Amazon fee, no DST on it)
  const dstFbm = dstPct > 0 ? (closingFee + referral) * dstPct : 0;

  // Total fees
  let totalFeesFba = null as number | null;
  if (fbaFee != null) {
    totalFeesFba = Math.round((closingFee + referral + dstFba + fbaFee) * 100) / 100;
  }
  const totalFeesFbm = Math.round((closingFee + referral + dstFbm + fbmCost) * 100) / 100;

  // VAT
  const vatOnSale = sell - sell / (1 + vatRate);
  const vatOnCost = buyPrice - buyPrice / (1 + vatRate);
  const vatDue = vatOnSale - vatOnCost;

  // FBM
  const profitFbm = Math.round((sell - totalFeesFbm - buyPrice - vatDue) * 100) / 100;
  const roiFbm = Math.round((profitFbm / buyPrice) * 10000) / 100;

  // FBA
  let profitFba = null as number | null;
  let roiFba = null as number | null;
  if (totalFeesFba != null) {
    profitFba = Math.round((sell - totalFeesFba - buyPrice - vatDue) * 100) / 100;
    roiFba = Math.round((profitFba / buyPrice) * 10000) / 100;
  }

  let maxCost = null as number | null;
  if (totalFeesFba != null) {
    maxCost = Math.round((sell - totalFeesFba * (1 + vatRate)) * 100) / 100;
  }

  const profitMargin = profitFba != null ? Math.round((profitFba / sell) * 10000) / 100 : null;

  return {
    profitFba, roiFba, profitFbm, roiFbm,
    totalFeesFba, totalFeesFbm,
    dstFba: Math.round(dstFba * 100) / 100,
    maxCost, profitMargin,
    vatOnSale: Math.round(vatOnSale * 100) / 100,
    vatOnCost: Math.round(vatOnCost * 100) / 100,
    vatDue: Math.round(vatDue * 100) / 100,
  };
}

function copyText(text: string, label: string) {
  navigator.clipboard.writeText(text);
  toast.success(`${label} copié`);
}

const ProductCard = ({ result, onFavorite, isFavorite }: ProductCardProps) => {
  const [buyPrice, setBuyPrice] = useState('');
  const [sellPriceOverride, setSellPriceOverride] = useState('');
  const [fbmCost, setFbmCost] = useState('');
  const [quantity, setQuantity] = useState('1');
  const [selectedCountry, setSelectedCountry] = useState(result.country_code);
  const alerts = result.alerts ? result.alerts.split(',').map(a => a.trim()).filter(Boolean) : [];

  // Build effective result based on selected country
  const r = useMemo(() => {
    if (selectedCountry === result.country_code) return result;
    const euData = result.eu_data?.[selectedCountry];
    if (!euData) return result;
    return {
      ...result,
      country_code: selectedCountry,
      sell_price: euData.sell_price ?? result.sell_price,
      fba_fee: euData.fba_fee ?? result.fba_fee,
      commission_eur: euData.commission_eur ?? result.commission_eur,
      commission_pct: euData.commission_pct ?? result.commission_pct,
      closing_fee: euData.closing_fee ?? result.closing_fee,
      bsr: euData.bsr ?? result.bsr,
      sales_monthly: euData.sales_monthly ?? result.sales_monthly,
      fba_sellers: euData.fba_sellers ?? result.fba_sellers,
      amazon_url: `https://www.${AMAZON_DOMAIN[selectedCountry] || 'amazon.fr'}/dp/${result.asin}`,
    } as MPResult;
  }, [selectedCountry, result]);

  // Use overridden sell price if user typed one, otherwise use effective result's value
  const effectiveSellPrice = sellPriceOverride ? parseFloat(sellPriceOverride) : (r.sell_price || 0);

  const calc = useMemo(() => {
    const bp = parseFloat(buyPrice);
    if (!bp || bp <= 0) return null;
    return computeProfit(effectiveSellPrice, bp, parseFloat(fbmCost) || 0, r);
  }, [buyPrice, fbmCost, effectiveSellPrice, r]);

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

  const keepaDomain = KEEPA_DOMAIN[r.country_code] || 4;
  const selectedCountryLabel = COUNTRY_OPTIONS.find(c => c.code === r.country_code)?.label || r.country_code;
  const googleUrl = result.product_name
    ? `https://www.google.com/search?q=${encodeURIComponent(result.product_name)}`
    : null;

  // Dimensions — check > 0 because DB stores 0 instead of null
  const weightKg = (result.weight_g && result.weight_g > 0) ? (result.weight_g / 1000).toFixed(2) : null;
  const hasAllDims = result.length_mm && result.length_mm > 0 && result.width_mm && result.width_mm > 0 && result.height_mm && result.height_mm > 0;
  const dimsStr = hasAllDims
    ? `${(result.length_mm! / 10).toFixed(1)} x ${(result.width_mm! / 10).toFixed(1)} x ${(result.height_mm! / 10).toFixed(1)} cm`
    : null;

  return (
    <Card className="overflow-hidden">
      <CardContent className="p-0">
        {/* Country selector bar */}
        {result.eu_data && Object.keys(result.eu_data).length > 1 && (
          <div className="flex items-center gap-1 px-4 py-2 bg-muted/30 border-b overflow-x-auto">
            {Object.keys(result.eu_data).map(cc => {
              const countryOpt = COUNTRY_OPTIONS.find(c => c.code === cc);
              const isActive = cc === selectedCountry;
              return (
                <button
                  key={cc}
                  onClick={() => { setSelectedCountry(cc); setSellPriceOverride(''); }}
                  className={`px-3 py-1 rounded-full text-xs font-semibold whitespace-nowrap transition-colors ${
                    isActive
                      ? 'bg-primary text-primary-foreground'
                      : 'bg-background border hover:bg-muted'
                  }`}
                >
                  {countryOpt?.label || cc}
                </button>
              );
            })}
          </div>
        )}

        {/* Top banner: image + title + quick info */}
        <div className="flex gap-4 p-4 pb-3 border-b bg-muted/20">
          <div className="shrink-0 w-24 h-24 rounded-md overflow-hidden bg-white border flex items-center justify-center">
            {result.image_url ? (
              <img src={result.image_url} alt="" className="w-full h-full object-contain" />
            ) : (
              <Package className="h-10 w-10 text-muted-foreground/40" />
            )}
          </div>

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
              </div>
            </div>

            {/* ASIN + EAN with copy */}
            <div className="flex flex-wrap gap-x-2 gap-y-1 mt-1.5">
              <button onClick={() => copyText(result.asin, 'ASIN')}
                className="inline-flex items-center gap-1 text-xs font-mono bg-muted px-1.5 py-0.5 rounded hover:bg-muted/80 transition-colors">
                ASIN: {result.asin} <Copy className="h-3 w-3 text-muted-foreground" />
              </button>
              {result.ean && (
                <button onClick={() => copyText(result.ean!, 'EAN')}
                  className="inline-flex items-center gap-1 text-xs font-mono bg-muted px-1.5 py-0.5 rounded hover:bg-muted/80 transition-colors">
                  EAN: {result.ean} <Copy className="h-3 w-3 text-muted-foreground" />
                </button>
              )}
            </div>

            {/* Links: Amazon (country-aware) + Google */}
            <div className="flex flex-wrap gap-2 mt-1.5">
              <a href={r.amazon_url || result.amazon_url} target="_blank" rel="noopener noreferrer"
                className="inline-flex items-center gap-1 text-xs text-blue-600 hover:underline">
                <Link2 className="h-3 w-3" /> Amazon {selectedCountryLabel}
              </a>
              {googleUrl && (
                <a href={googleUrl} target="_blank" rel="noopener noreferrer"
                  className="inline-flex items-center gap-1 text-xs text-blue-600 hover:underline">
                  <Search className="h-3 w-3" /> Google
                </a>
              )}
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

        {/* Quick Info bar — uses r (country-aware) */}
        <div className="grid grid-cols-5 gap-px bg-border">
          {[
            { label: 'BSR', value: r.bsr?.toLocaleString('fr-FR') || '—' },
            { label: 'Ventes/mois', value: r.sales_monthly?.toString() || '—' },
            { label: 'FBA Sellers', value: r.fba_sellers?.toString() || '0' },
            { label: 'FBM Sellers', value: r.fbm_sellers?.toString() || '0' },
            { label: 'Variations', value: r.variations?.toString() || '0' },
          ].map(item => (
            <div key={item.label} className="bg-background px-2 py-1.5 text-center">
              <p className="text-[10px] text-muted-foreground leading-none">{item.label}</p>
              <p className="text-xs font-semibold mt-0.5 truncate">{item.value}</p>
            </div>
          ))}
        </div>

        {/* Dimensions detail */}
        {(weightKg || dimsStr) && (
          <div className="flex flex-wrap gap-4 px-4 py-2 border-b text-xs text-muted-foreground bg-muted/10">
            {weightKg && (
              <span className="inline-flex items-center gap-1">
                <Weight className="h-3 w-3" /> {weightKg} kg
              </span>
            )}
            {dimsStr && (
              <span className="inline-flex items-center gap-1">
                <Ruler className="h-3 w-3" /> {dimsStr}
              </span>
            )}
            {hasAllDims && (
              <span className="inline-flex items-center gap-1">
                <Box className="h-3 w-3" />
                {((result.length_mm! / 10) * (result.width_mm! / 10) * (result.height_mm! / 10) / 5000).toFixed(2)} kg dim.
              </span>
            )}
          </div>
        )}

        {/* Profit Calculator — uses r (country-aware) */}
        <div className="p-4">
          <div className="flex items-center gap-2 mb-3">
            <ShoppingCart className="h-4 w-4 text-primary" />
            <span className="text-sm font-semibold">Profit Calculator</span>
            <Badge variant="outline" className="text-[10px] h-4">{selectedCountryLabel}</Badge>
          </div>

          <div className="grid sm:grid-cols-2 gap-4">
            {/* Left: Inputs + Results */}
            <div className="space-y-3">
              <div className="grid grid-cols-3 gap-2">
                <div>
                  <label className="text-xs text-muted-foreground block mb-1">Cost (TTC)</label>
                  <Input
                    type="number" step="0.01" min="0" placeholder="0.00€"
                    value={buyPrice} onChange={(e) => setBuyPrice(e.target.value)}
                    className="h-9 text-sm font-mono"
                  />
                </div>
                <div>
                  <label className="text-xs text-muted-foreground block mb-1">Sale Price</label>
                  <Input
                    type="number" step="0.01" min="0"
                    placeholder={r.sell_price ? `${r.sell_price.toFixed(2)}€` : '0.00€'}
                    value={sellPriceOverride}
                    onChange={(e) => setSellPriceOverride(e.target.value)}
                    className="h-9 text-sm font-mono"
                  />
                </div>
                <div>
                  <label className="text-xs text-muted-foreground block mb-1">FBM Ship</label>
                  <Input
                    type="number" step="0.01" min="0" placeholder="0.00€"
                    value={fbmCost} onChange={(e) => setFbmCost(e.target.value)}
                    className="h-9 text-sm font-mono"
                  />
                </div>
              </div>

              {/* FBA result */}
              <div className={`rounded-lg border p-3 ${calc?.profitFba != null && calc.profitFba >= 0 ? 'border-green-200 bg-green-50/50 dark:bg-green-950/20' : calc?.profitFba != null ? 'border-red-200 bg-red-50/50 dark:bg-red-950/20' : ''}`}>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-semibold">FBA</span>
                  <Badge variant="outline" className="text-[10px] h-4">{r.fba_sellers || 0} sellers</Badge>
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
                  <Badge variant="outline" className="text-[10px] h-4">{r.fbm_sellers || 0} sellers</Badge>
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

            {/* Right: Fees detail — uses r (country-aware) */}
            <div className="space-y-2 text-xs">
              <div className="flex items-center gap-1 mb-2">
                <Info className="h-3.5 w-3.5 text-muted-foreground" />
                <span className="text-xs font-semibold text-muted-foreground">Fee Breakdown</span>
              </div>
              <div className="space-y-1.5">
                {[
                  { label: 'Sale Price', value: fmt(effectiveSellPrice || null) },
                  { label: `Commission (${r.commission_pct || 15}%)`, value: fmt(r.commission_eur) },
                  { label: 'FBA Fee', value: fmt(r.fba_fee) },
                  { label: 'DST', value: calc ? fmt(calc.dstFba) : '—' },
                  { label: 'Closing Fee', value: fmt(r.closing_fee) },
                  { label: 'Total Fees (FBA)', value: calc ? fmt(calc.totalFeesFba) : '—', bold: true },
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

        {/* Quantity Calculator */}
        {calc && (
          <div className="border-t">
            <div className="p-4">
              <div className="flex items-center gap-2 mb-3">
                <Calculator className="h-4 w-4 text-primary" />
                <span className="text-sm font-semibold">Quantity Calculator</span>
              </div>
              <div className="flex items-end gap-3 mb-3">
                <div>
                  <label className="text-xs text-muted-foreground block mb-1">Quantity</label>
                  <Input
                    type="number" step="1" min="1" placeholder="1"
                    value={quantity} onChange={(e) => setQuantity(e.target.value)}
                    className="h-9 text-sm font-mono w-24"
                  />
                </div>
              </div>
              {(() => {
                const qty = parseInt(quantity) || 1;
                const bp = parseFloat(buyPrice) || 0;
                const totalInvestment = bp * qty;
                const totalRevenue = effectiveSellPrice * qty;
                const totalProfitFba = calc.profitFba != null ? calc.profitFba * qty : null;
                const totalProfitFbm = calc.profitFbm * qty;
                return (
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
                    <div className="rounded-lg border p-2.5 text-center">
                      <p className="text-[10px] text-muted-foreground">Investissement</p>
                      <p className="text-sm font-bold font-mono mt-0.5">{totalInvestment.toFixed(2)}€</p>
                    </div>
                    <div className="rounded-lg border p-2.5 text-center">
                      <p className="text-[10px] text-muted-foreground">CA Total</p>
                      <p className="text-sm font-bold font-mono mt-0.5">{totalRevenue.toFixed(2)}€</p>
                    </div>
                    <div className={`rounded-lg border p-2.5 text-center ${totalProfitFba != null && totalProfitFba >= 0 ? 'border-green-200 bg-green-50/50' : totalProfitFba != null ? 'border-red-200 bg-red-50/50' : ''}`}>
                      <p className="text-[10px] text-muted-foreground">Profit FBA x{qty}</p>
                      <p className={`text-sm font-bold font-mono mt-0.5 ${profitColor(totalProfitFba)}`}>
                        {totalProfitFba != null ? `${totalProfitFba.toFixed(2)}€` : '—'}
                      </p>
                    </div>
                    <div className={`rounded-lg border p-2.5 text-center ${totalProfitFbm >= 0 ? 'border-green-200 bg-green-50/50' : 'border-red-200 bg-red-50/50'}`}>
                      <p className="text-[10px] text-muted-foreground">Profit FBM x{qty}</p>
                      <p className={`text-sm font-bold font-mono mt-0.5 ${profitColor(totalProfitFbm)}`}>
                        {totalProfitFbm.toFixed(2)}€
                      </p>
                    </div>
                  </div>
                );
              })()}
            </div>
          </div>
        )}

        {/* Offers Table */}
        <div className="border-t">
          <div className="p-4">
            <div className="flex items-center gap-2 mb-3">
              <ShoppingCart className="h-4 w-4 text-primary" />
              <span className="text-sm font-semibold">Offers</span>
              <Badge variant="outline" className="text-[10px] h-4">{(r.fba_sellers || 0) + (r.fbm_sellers || 0)} total</Badge>
            </div>
            {result.offers && result.offers.length > 0 ? (
              <div className="overflow-x-auto">
                <table className="w-full text-xs">
                  <thead>
                    <tr className="border-b">
                      <th className="text-left py-1.5 pr-2 font-semibold text-muted-foreground">Seller</th>
                      <th className="text-center py-1.5 px-2 font-semibold text-muted-foreground">Stock</th>
                      <th className="text-right py-1.5 px-2 font-semibold text-muted-foreground">Price</th>
                      <th className="text-right py-1.5 px-2 font-semibold text-muted-foreground">Profit</th>
                      <th className="text-right py-1.5 pl-2 font-semibold text-muted-foreground">ROI</th>
                    </tr>
                  </thead>
                  <tbody>
                    {result.offers.map((offer, i) => {
                      // Compute profit for this offer's price if buyPrice is set
                      let offerProfit = null as number | null;
                      let offerRoi = null as number | null;
                      const bp = parseFloat(buyPrice);
                      if (bp > 0 && offer.total_price > 0) {
                        const offerCalc = computeProfit(offer.total_price, bp, 0, r);
                        if (offerCalc) {
                          offerProfit = offerCalc.profitFba;
                          offerRoi = offerCalc.roiFba;
                        }
                      }
                      const typeBadgeColor = offer.type === 'AMZ' ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200'
                        : offer.type === 'FBA' ? 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200'
                        : 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200';
                      return (
                        <tr key={`${offer.seller_id}-${i}`} className="border-b last:border-0">
                          <td className="py-1.5 pr-2">
                            <div className="group relative inline-block">
                              <span className={`inline-block px-1.5 py-0.5 rounded text-[10px] font-bold cursor-default ${typeBadgeColor}`}>
                                {offer.type}
                              </span>
                              <div className="absolute left-0 bottom-full mb-1 hidden group-hover:block z-10 whitespace-nowrap bg-gray-900 text-white text-[10px] px-2 py-1 rounded shadow-lg">
                                {offer.type === 'AMZ' ? 'Amazon' : offer.seller_id || 'Unknown'}
                              </div>
                            </div>
                            {offer.is_prime && <span className="ml-1 text-[9px] text-blue-600 font-bold">✓Prime</span>}
                          </td>
                          <td className="text-center py-1.5 px-2 font-mono">{offer.stock}</td>
                          <td className="text-right py-1.5 px-2 font-mono">
                            {offer.total_price.toFixed(2)}€
                            {offer.shipping > 0 && <span className="text-muted-foreground ml-1">(+{offer.shipping.toFixed(2)})</span>}
                          </td>
                          <td className={`text-right py-1.5 px-2 font-mono ${profitColor(offerProfit)}`}>
                            {offerProfit != null ? `${offerProfit.toFixed(2)}€` : '—'}
                          </td>
                          <td className={`text-right py-1.5 pl-2 font-mono ${roiColor(offerRoi)}`}>
                            {offerRoi != null ? `${offerRoi.toFixed(2)}%` : '—'}
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            ) : (
              <div className="grid grid-cols-2 gap-3">
                <div className="rounded-lg border p-3 text-center">
                  <p className="text-[10px] text-muted-foreground mb-1">FBA Sellers</p>
                  <p className="text-2xl font-bold">{r.fba_sellers || 0}</p>
                  {r.fba_price != null && (
                    <p className="text-xs text-muted-foreground mt-1">Lowest: {fmt(r.fba_price)}</p>
                  )}
                </div>
                <div className="rounded-lg border p-3 text-center">
                  <p className="text-[10px] text-muted-foreground mb-1">FBM Sellers</p>
                  <p className="text-2xl font-bold">{r.fbm_sellers || 0}</p>
                </div>
              </div>
            )}
            {r.amazon_price != null && (
              <div className="mt-2 text-xs text-muted-foreground">
                Amazon direct: {fmt(r.amazon_price)}
              </div>
            )}
          </div>
        </div>

        {/* European Marketplaces — comparison table */}
        {result.eu_data && Object.keys(result.eu_data).length > 0 && (
          <div className="border-t">
            <div className="p-4">
              <div className="flex items-center gap-2 mb-3">
                <Globe className="h-4 w-4 text-primary" />
                <span className="text-sm font-semibold">European Marketplaces</span>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-xs">
                  <thead>
                    <tr className="border-b">
                      <th className="text-left py-1.5 pr-2 font-semibold text-muted-foreground">Country</th>
                      <th className="text-right py-1.5 px-2 font-semibold text-muted-foreground">BSR</th>
                      <th className="text-right py-1.5 px-2 font-semibold text-muted-foreground">Price</th>
                      <th className="text-right py-1.5 px-2 font-semibold text-muted-foreground">FBA Fee</th>
                      <th className="text-right py-1.5 px-2 font-semibold text-muted-foreground">Profit</th>
                      <th className="text-right py-1.5 pl-2 font-semibold text-muted-foreground">ROI</th>
                    </tr>
                  </thead>
                  <tbody>
                    {Object.entries(result.eu_data).map(([cc, data]: [string, any]) => {
                      const euCountry = COUNTRY_OPTIONS.find(c => c.code === cc);
                      const isActive = cc === selectedCountry;
                      // Calculate profit for this marketplace if buyPrice is set
                      let euProfit = null as number | null;
                      let euRoi = null as number | null;
                      const bp = parseFloat(buyPrice);
                      if (bp > 0 && data.sell_price > 0) {
                        const euCalc = computeProfit(data.sell_price, bp, 0, {
                          ...result,
                          country_code: cc,
                          sell_price: data.sell_price,
                          commission_eur: data.commission_eur,
                          commission_pct: data.commission_pct,
                          fba_fee: data.fba_fee,
                          closing_fee: data.closing_fee,
                        });
                        if (euCalc) {
                          euProfit = euCalc.profitFba;
                          euRoi = euCalc.roiFba;
                        }
                      }
                      return (
                        <tr
                          key={cc}
                          onClick={() => { setSelectedCountry(cc); setSellPriceOverride(''); }}
                          className={`border-b last:border-0 cursor-pointer transition-colors hover:bg-muted/50 ${isActive ? 'bg-primary/10 font-semibold' : ''}`}
                        >
                          <td className="py-1.5 pr-2">
                            <span className="inline-flex items-center gap-1">
                              {euCountry?.label || cc}
                              {isActive && <span className="text-[9px] text-primary">●</span>}
                            </span>
                          </td>
                          <td className="text-right py-1.5 px-2 font-mono">{data.bsr?.toLocaleString('fr-FR') || '—'}</td>
                          <td className="text-right py-1.5 px-2 font-mono">{data.sell_price ? `${data.sell_price.toFixed(2)}€` : '—'}</td>
                          <td className="text-right py-1.5 px-2 font-mono">{data.fba_fee ? `${data.fba_fee.toFixed(2)}€` : '—'}</td>
                          <td className={`text-right py-1.5 px-2 font-mono ${profitColor(euProfit)}`}>
                            {euProfit != null ? `${euProfit.toFixed(2)}€` : '—'}
                          </td>
                          <td className={`text-right py-1.5 pl-2 font-mono ${roiColor(euRoi)}`}>
                            {euRoi != null ? `${euRoi.toFixed(2)}%` : '—'}
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* Keepa Charts — uses selected country's domain */}
        <div className="border-t">
          <div className="p-4 space-y-3">
            <p className="text-sm font-semibold">Keepa Charts — {selectedCountryLabel}</p>

            {/* Price History */}
            <div>
              <p className="text-xs text-muted-foreground mb-1">Price History</p>
              <img
                src={`https://graph.keepa.com/pricehistory.png?asin=${result.asin}&domain=${keepaDomain}&amazon=1&new=1&fba=1&bb=1&range=90&width=600&height=200`}
                alt="Keepa Price History"
                className="w-full rounded border bg-white"
                loading="lazy"
              />
            </div>

            {/* Sales Rank */}
            <div>
              <p className="text-xs text-muted-foreground mb-1">Sales Rank (BSR)</p>
              <img
                src={`https://graph.keepa.com/pricehistory.png?asin=${result.asin}&domain=${keepaDomain}&salesrank=1&range=90&width=600&height=150`}
                alt="Keepa Sales Rank"
                className="w-full rounded border bg-white"
                loading="lazy"
              />
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default ProductCard;
