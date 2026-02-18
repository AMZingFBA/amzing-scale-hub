import { Copy, ExternalLink, TrendingUp, Package, Search } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

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
  'fr': '🇫🇷',
  'france': '🇫🇷',
  'it': '🇮🇹',
  'italie': '🇮🇹',
  'italy': '🇮🇹',
  'de': '🇩🇪',
  'allemagne': '🇩🇪',
  'germany': '🇩🇪',
  'es': '🇪🇸',
  'espagne': '🇪🇸',
  'spain': '🇪🇸',
  'uk': '🇬🇧',
  'gb': '🇬🇧',
  'nl': '🇳🇱',
  'be': '🇧🇪',
  'pl': '🇵🇱',
  'se': '🇸🇪',
};

const COUNTRY_LABEL: Record<string, string> = {
  'fr': 'FR',
  'france': 'FR',
  'it': 'IT',
  'italie': 'IT',
  'italy': 'IT',
  'de': 'DE',
  'allemagne': 'DE',
  'germany': 'DE',
  'es': 'ES',
  'espagne': 'ES',
  'spain': 'ES',
  'uk': 'UK',
  'gb': 'GB',
  'nl': 'NL',
  'be': 'BE',
  'pl': 'PL',
  'se': 'SE',
};

function getFlag(country: string): string {
  return FLAG_MAP[country.toLowerCase().trim()] || '🏳️';
}

function getLabel(country: string): string {
  return COUNTRY_LABEL[country.toLowerCase().trim()] || country.toUpperCase();
}

export function parseNumericValue(value: string): number {
  if (!value) return 0;
  const cleaned = value.replace(/[^\d.,%-]/g, '').replace(',', '.');
  return parseFloat(cleaned) || 0;
}

interface A2AProductCardProps {
  product: A2AProduct;
  onCopy: (text: string) => void;
}

export function A2AProductCard({ product, onCopy }: A2AProductCardProps) {
  const roiValue = parseNumericValue(product.roi);
  const roiColor = roiValue >= 30 ? 'text-green-400' : roiValue >= 15 ? 'text-orange-400' : 'text-muted-foreground';

  return (
    <Card className="overflow-hidden border border-border/60 bg-card hover:border-primary/40 transition-all duration-300">
      <CardContent className="p-0">
        {/* Top bar: source + date */}
        <div className="flex items-center justify-between px-4 py-2 border-b border-border/40 bg-muted/30">
          <span className="text-xs text-muted-foreground capitalize">{product.source || product.canal.replace('-', ' ')}</span>
          <span className="text-xs text-muted-foreground">{product.date}</span>
        </div>

        <div className="p-4 space-y-4">
          {/* Title + Image row */}
          <div className="flex gap-3">
            <div className="flex-1 min-w-0">
              <h3 className="font-semibold text-sm leading-tight line-clamp-2">{product.titre}</h3>
            </div>
            {product.image && (
              <img
                src={product.image}
                alt={product.titre}
                className="w-16 h-16 object-contain rounded-lg border border-border bg-white shrink-0"
                loading="lazy"
                onError={(e) => { (e.target as HTMLImageElement).style.display = 'none'; }}
              />
            )}
          </div>

          {/* Country comparison: Buy vs Sell */}
          <div className="grid grid-cols-2 gap-3">
            <div className="bg-muted/40 rounded-lg p-3 text-center space-y-1">
              <div className="flex items-center justify-center gap-1.5">
                <span className="text-lg">{getFlag(product.pays_achat)}</span>
                <span className="text-xs font-medium text-muted-foreground">| {getLabel(product.pays_achat)}</span>
              </div>
              <p className="text-lg font-bold text-green-400">{product.prix_achat || '—'}</p>
            </div>
            <div className="bg-muted/40 rounded-lg p-3 text-center space-y-1">
              <div className="flex items-center justify-center gap-1.5">
                <span className="text-lg">{getFlag(product.pays_vente)}</span>
                <span className="text-xs font-medium text-muted-foreground">| {getLabel(product.pays_vente)}</span>
              </div>
              <p className="text-lg font-bold text-primary">{product.prix_vente || '—'}</p>
            </div>
          </div>

          {/* Calculs + Ventes */}
          <div className="grid grid-cols-2 gap-3">
            {/* Calculs */}
            <div className="bg-muted/40 rounded-lg p-3 space-y-1">
              <div className="flex items-center gap-1.5 mb-1">
                <TrendingUp className="w-3.5 h-3.5 text-primary" />
                <span className="text-xs font-semibold">Calculs</span>
              </div>
              {product.profit && (
                <p className="text-xs">Profit: <span className="font-bold text-green-400">{product.profit}</span></p>
              )}
              {product.marge_profit && (
                <p className="text-xs">Marge: <span className="font-bold">{product.marge_profit}</span></p>
              )}
              {product.roi && (
                <p className="text-xs">ROI: <span className={`font-bold ${roiColor}`}>{product.roi}</span></p>
              )}
            </div>

            {/* Ventes */}
            <div className="bg-muted/40 rounded-lg p-3 space-y-1">
              <div className="flex items-center gap-1.5 mb-1">
                <Package className="w-3.5 h-3.5 text-primary" />
                <span className="text-xs font-semibold">Ventes</span>
              </div>
              {product.ventes_amazon && (
                <p className="text-xs">Sales: <span className="font-bold">{product.ventes_amazon}</span></p>
              )}
              {product.classement && (
                <p className="text-xs">Rank: <span className="font-bold">{product.classement}</span></p>
              )}
            </div>
          </div>

          {/* ASIN + Offers */}
          <div className="grid grid-cols-2 gap-3">
            <div className="bg-muted/40 rounded-lg p-3">
              <span className="text-xs font-semibold block mb-1">ASIN</span>
              {product.asin ? (
                <div className="flex items-center gap-1.5">
                  <code className="text-xs font-mono">{product.asin}</code>
                  <Button variant="ghost" size="icon" className="h-5 w-5" onClick={() => onCopy(product.asin)}>
                    <Copy className="w-3 h-3" />
                  </Button>
                </div>
              ) : (
                <span className="text-xs text-muted-foreground">—</span>
              )}
            </div>
            <div className="bg-muted/40 rounded-lg p-3">
              <span className="text-xs font-semibold block mb-1">Offres</span>
              <span className="text-xs font-bold">{product.offres || '—'}</span>
            </div>
          </div>

          {/* Links row */}
          <div className="grid grid-cols-2 gap-3">
            {/* Research links */}
            <div className="bg-muted/40 rounded-lg p-3">
              <div className="flex items-center gap-1.5 mb-2">
                <Search className="w-3.5 h-3.5 text-primary" />
                <span className="text-xs font-semibold">Liens</span>
              </div>
              <div className="flex flex-wrap gap-1.5">
                {product.lien_sas && (
                  <a href={product.lien_sas} target="_blank" rel="noopener noreferrer" className="text-xs text-primary hover:underline font-medium">SAS</a>
                )}
                {product.lien_bbp && (
                  <>
                    {product.lien_sas && <span className="text-muted-foreground text-xs">|</span>}
                    <a href={product.lien_bbp} target="_blank" rel="noopener noreferrer" className="text-xs text-primary hover:underline font-medium">BBP</a>
                  </>
                )}
                {product.lien_keepa && (
                  <>
                    {(product.lien_sas || product.lien_bbp) && <span className="text-muted-foreground text-xs">|</span>}
                    <a href={product.lien_keepa} target="_blank" rel="noopener noreferrer" className="text-xs text-primary hover:underline font-medium">Keepa</a>
                  </>
                )}
              </div>
            </div>

            {/* Idealo + Note */}
            <div className="flex gap-2">
              {product.lien_idealo && (
                <div className="bg-muted/40 rounded-lg p-3 flex-1">
                  <span className="text-xs font-semibold block mb-1">Idealo</span>
                  <a href={product.lien_idealo} target="_blank" rel="noopener noreferrer" className="text-xs text-primary hover:underline font-medium">Idealo</a>
                </div>
              )}
              {product.note && (
                <div className="bg-muted/40 rounded-lg p-3 flex-1">
                  <span className="text-xs font-semibold block mb-1">Note</span>
                  <p className="text-xs text-muted-foreground line-clamp-2">{product.note}</p>
                </div>
              )}
            </div>
          </div>

          {/* Amazon link button */}
          {product.lien_amazon && (
            <a href={product.lien_amazon} target="_blank" rel="noopener noreferrer" className="block">
              <Button variant="outline" size="sm" className="w-full gap-1.5 text-xs">
                <ExternalLink className="w-3 h-3" /> Voir sur Amazon
              </Button>
            </a>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
