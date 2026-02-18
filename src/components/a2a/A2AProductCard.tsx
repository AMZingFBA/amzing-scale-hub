import { Copy, ExternalLink, TrendingUp, Package, Search, BarChart3 } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

export interface A2AProduct {
  id: string;
  date: string;
  canal: string;
  source: string;
  titre: string;
  pays_achat: string;
  pays_vente: string;
  prix_achat: string;
  prix_vente: string;
  profit: string;
  marge_profit: string;
  roi: string;
  ventes_amazon: string;
  classement: string;
  asin: string;
  offres: string;
  lien_sas: string;
  lien_bbp: string;
  lien_keepa: string;
  lien_idealo: string;
  lien_amazon: string;
  image: string;
  note: string;
}

const FLAG_MAP: Record<string, string> = {
  'fr': '🇫🇷', 'france': '🇫🇷',
  'it': '🇮🇹', 'italie': '🇮🇹', 'italy': '🇮🇹',
  'de': '🇩🇪', 'allemagne': '🇩🇪', 'germany': '🇩🇪',
  'es': '🇪🇸', 'espagne': '🇪🇸', 'spain': '🇪🇸',
  'uk': '🇬🇧', 'gb': '🇬🇧',
  'nl': '🇳🇱', 'be': '🇧🇪', 'pl': '🇵🇱', 'se': '🇸🇪',
};

const COUNTRY_LABEL: Record<string, string> = {
  'fr': 'FR', 'france': 'FR',
  'it': 'IT', 'italie': 'IT', 'italy': 'IT',
  'de': 'DE', 'allemagne': 'DE', 'germany': 'DE',
  'es': 'ES', 'espagne': 'ES', 'spain': 'ES',
  'uk': 'UK', 'gb': 'GB',
  'nl': 'NL', 'be': 'BE', 'pl': 'PL', 'se': 'SE',
};

function getFlag(country: string): string {
  if (!country) return '🏳️';
  return FLAG_MAP[country.toLowerCase().trim()] || '🏳️';
}

function getLabel(country: string): string {
  if (!country) return '—';
  return COUNTRY_LABEL[country.toLowerCase().trim()] || country.toUpperCase();
}

export function parseNumericValue(value: string): number {
  if (!value) return 0;
  const cleaned = value.replace(/[^\d.,%-]/g, '').replace(',', '.');
  return parseFloat(cleaned) || 0;
}

function val(v: string): string {
  return v && v.trim() ? v.trim() : '—';
}

interface A2AProductCardProps {
  product: A2AProduct;
  onCopy: (text: string) => void;
}

export function A2AProductCard({ product, onCopy }: A2AProductCardProps) {
  const roiValue = parseNumericValue(product.roi);
  const roiColor = product.roi ? (roiValue >= 30 ? 'text-green-400' : roiValue >= 15 ? 'text-orange-400' : 'text-foreground') : 'text-muted-foreground';

  const hasAnyLink = product.lien_sas || product.lien_bbp || product.lien_keepa || product.lien_idealo || product.lien_amazon;

  return (
    <Card className="overflow-hidden border border-border/60 bg-card hover:border-primary/40 transition-all duration-300">
      <CardContent className="p-0">
        {/* Top bar: source + canal + date */}
        <div className="flex items-center justify-between px-4 py-2 border-b border-border/40 bg-muted/30">
          <div className="flex items-center gap-2">
            <span className="text-xs font-medium text-foreground capitalize">{val(product.source)}</span>
            <span className="text-xs text-muted-foreground">•</span>
            <span className="text-xs text-muted-foreground capitalize">{val(product.canal).replace('-', ' ')}</span>
          </div>
          <span className="text-xs text-muted-foreground">{val(product.date)}</span>
        </div>

        <div className="p-4 space-y-3">
          {/* Title + Image */}
          <div className="flex gap-3">
            <div className="flex-1 min-w-0">
              <h3 className="font-semibold text-sm leading-tight line-clamp-2">{val(product.titre)}</h3>
            </div>
            <div className="w-16 h-16 shrink-0 rounded-lg border border-border bg-white flex items-center justify-center overflow-hidden">
              {product.image ? (
                <img
                  src={product.image}
                  alt={product.titre}
                  className="w-full h-full object-contain"
                  loading="lazy"
                  onError={(e) => { (e.target as HTMLImageElement).parentElement!.innerHTML = '<span class="text-xs text-muted-foreground">📦</span>'; }}
                />
              ) : (
                <span className="text-2xl">📦</span>
              )}
            </div>
          </div>

          {/* Country comparison: Buy vs Sell - ALWAYS shown */}
          <div className="grid grid-cols-2 gap-2">
            <div className="bg-muted/40 rounded-lg p-2.5 text-center">
              <div className="flex items-center justify-center gap-1.5 mb-1">
                <span className="text-base">{getFlag(product.pays_achat)}</span>
                <span className="text-[11px] font-medium text-muted-foreground">| {getLabel(product.pays_achat)}</span>
              </div>
              <p className="text-base font-bold text-green-400">{val(product.prix_achat)}</p>
            </div>
            <div className="bg-muted/40 rounded-lg p-2.5 text-center">
              <div className="flex items-center justify-center gap-1.5 mb-1">
                <span className="text-base">{getFlag(product.pays_vente)}</span>
                <span className="text-[11px] font-medium text-muted-foreground">| {getLabel(product.pays_vente)}</span>
              </div>
              <p className="text-base font-bold text-primary">{val(product.prix_vente)}</p>
            </div>
          </div>

          {/* Calculs + Ventes - ALWAYS shown */}
          <div className="grid grid-cols-2 gap-2">
            <div className="bg-muted/40 rounded-lg p-2.5 space-y-0.5">
              <div className="flex items-center gap-1.5 mb-1">
                <TrendingUp className="w-3.5 h-3.5 text-primary" />
                <span className="text-[11px] font-semibold">Calculs</span>
              </div>
              <p className="text-xs">Profit: <span className="font-bold text-green-400">{val(product.profit)}</span></p>
              <p className="text-xs">Marge: <span className="font-bold">{val(product.marge_profit)}</span></p>
              <p className="text-xs">ROI: <span className={`font-bold ${roiColor}`}>{val(product.roi)}</span></p>
            </div>

            <div className="bg-muted/40 rounded-lg p-2.5 space-y-0.5">
              <div className="flex items-center gap-1.5 mb-1">
                <BarChart3 className="w-3.5 h-3.5 text-primary" />
                <span className="text-[11px] font-semibold">Ventes</span>
              </div>
              <p className="text-xs">Amazon Sales: <span className="font-bold">{val(product.ventes_amazon)}</span></p>
              <p className="text-xs">Salesrank: <span className="font-bold">{val(product.classement)}</span></p>
            </div>
          </div>

          {/* ASIN + Offers - ALWAYS shown */}
          <div className="grid grid-cols-2 gap-2">
            <div className="bg-muted/40 rounded-lg p-2.5">
              <span className="text-[11px] font-semibold block mb-1">🔢 | ASIN</span>
              <div className="flex items-center gap-1.5">
                <code className="text-xs font-mono truncate">{val(product.asin)}</code>
                {product.asin && (
                  <Button variant="ghost" size="icon" className="h-5 w-5 shrink-0" onClick={() => onCopy(product.asin)}>
                    <Copy className="w-3 h-3" />
                  </Button>
                )}
              </div>
            </div>
            <div className="bg-muted/40 rounded-lg p-2.5">
              <span className="text-[11px] font-semibold block mb-1">👥 | Offres</span>
              <span className="text-xs font-bold">{val(product.offres)}</span>
            </div>
          </div>

          {/* Links - ALWAYS shown */}
          <div className="grid grid-cols-2 gap-2">
            <div className="bg-muted/40 rounded-lg p-2.5">
              <div className="flex items-center gap-1.5 mb-1.5">
                <Search className="w-3.5 h-3.5 text-primary" />
                <span className="text-[11px] font-semibold">Liens de recherche</span>
              </div>
              <div className="flex flex-wrap gap-x-2 gap-y-1">
                {product.lien_sas ? (
                  <a href={product.lien_sas} target="_blank" rel="noopener noreferrer" className="text-xs text-primary hover:underline font-medium">SAS</a>
                ) : (
                  <span className="text-xs text-muted-foreground">SAS —</span>
                )}
                <span className="text-muted-foreground text-xs">|</span>
                {product.lien_bbp ? (
                  <a href={product.lien_bbp} target="_blank" rel="noopener noreferrer" className="text-xs text-primary hover:underline font-medium">BBP</a>
                ) : (
                  <span className="text-xs text-muted-foreground">BBP —</span>
                )}
                <span className="text-muted-foreground text-xs">|</span>
                {product.lien_keepa ? (
                  <a href={product.lien_keepa} target="_blank" rel="noopener noreferrer" className="text-xs text-primary hover:underline font-medium">Keepa</a>
                ) : (
                  <span className="text-xs text-muted-foreground">Keepa —</span>
                )}
              </div>
            </div>

            <div className="bg-muted/40 rounded-lg p-2.5">
              <span className="text-[11px] font-semibold block mb-1.5">ℹ️ | Idealo</span>
              {product.lien_idealo ? (
                <a href={product.lien_idealo} target="_blank" rel="noopener noreferrer" className="text-xs text-primary hover:underline font-medium">Idealo</a>
              ) : (
                <span className="text-xs text-muted-foreground">—</span>
              )}
            </div>
          </div>

          {/* Note - ALWAYS shown */}
          <div className="bg-muted/40 rounded-lg p-2.5">
            <span className="text-[11px] font-semibold block mb-1">📝 Note</span>
            <p className="text-xs text-muted-foreground">{val(product.note)}</p>
          </div>

          {/* Amazon link button - ALWAYS shown */}
          {product.lien_amazon ? (
            <a href={product.lien_amazon} target="_blank" rel="noopener noreferrer" className="block">
              <Button variant="outline" size="sm" className="w-full gap-1.5 text-xs">
                <ExternalLink className="w-3 h-3" /> Voir sur Amazon
              </Button>
            </a>
          ) : (
            <Button variant="outline" size="sm" className="w-full gap-1.5 text-xs opacity-50 cursor-default" disabled>
              <ExternalLink className="w-3 h-3" /> Lien Amazon non disponible
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
