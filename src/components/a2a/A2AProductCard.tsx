import { Copy, ExternalLink, TrendingUp, BarChart3 } from 'lucide-react';
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
  lien_amazon_achat: string;
  lien_amazon_vente: string;
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

// Map Keepa domain codes
const KEEPA_DOMAIN: Record<string, number> = {
  'fr': 4, 'france': 4,
  'de': 3, 'allemagne': 3, 'germany': 3,
  'it': 8, 'italie': 8, 'italy': 8,
  'es': 9, 'espagne': 9, 'spain': 9,
  'uk': 2, 'gb': 2,
};

function inferCountryFromSource(source: string): string {
  if (!source) return '';
  const s = source.toLowerCase();
  if (s.includes('.fr')) return 'FR';
  if (s.includes('.de')) return 'DE';
  if (s.includes('.it')) return 'IT';
  if (s.includes('.es')) return 'ES';
  if (s.includes('.co.uk') || s.includes('.uk')) return 'UK';
  if (s.includes('.nl')) return 'NL';
  if (s.includes('.be')) return 'BE';
  if (s.includes('.pl')) return 'PL';
  if (s.includes('.se')) return 'SE';
  return '';
}

function getFlag(country: string): string {
  if (!country) return '';
  return FLAG_MAP[country.toLowerCase().trim()] || '';
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

function getKeepaChartUrl(asin: string, country: string): string | null {
  if (!asin) return null;
  const c = country?.toLowerCase().trim();
  const domain = KEEPA_DOMAIN[c] || 4; // default FR
  return `https://graph.keepa.com/pricehistory.png?asin=${asin}&domain=${domain}&range=90`;
}

interface A2AProductCardProps {
  product: A2AProduct;
  onCopy: (text: string) => void;
}

export function A2AProductCard({ product, onCopy }: A2AProductCardProps) {
  const roiValue = parseNumericValue(product.roi);
  const roiColor = product.roi ? (roiValue >= 30 ? 'text-green-400' : roiValue >= 15 ? 'text-orange-400' : 'text-foreground') : 'text-muted-foreground';

  // Fix empty pays_achat by inferring from source
  const paysAchat = product.pays_achat || inferCountryFromSource(product.source);
  const paysVente = product.pays_vente;

  const keepaChartUrl = getKeepaChartUrl(product.asin, paysVente);

  return (
    <Card className="overflow-hidden border border-border/60 bg-card hover:border-primary/40 transition-all duration-300">
      <CardContent className="p-0">
        {/* Top bar */}
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

          {/* Country comparison */}
          <div className="grid grid-cols-2 gap-2">
            <a href={product.lien_amazon_achat || undefined} target="_blank" rel="noopener noreferrer" className={`bg-muted/40 rounded-lg p-2.5 text-center ${product.lien_amazon_achat ? 'hover:ring-1 hover:ring-primary/50 transition-all cursor-pointer' : ''}`}>
              <div className="flex items-center justify-center gap-1.5 mb-1">
                {getFlag(paysAchat) && <span className="text-base">{getFlag(paysAchat)}</span>}
                <span className="text-[11px] font-medium text-muted-foreground">Achat | {getLabel(paysAchat)}</span>
              </div>
              <p className="text-base font-bold text-green-400">{val(product.prix_achat)}</p>
              {product.lien_amazon_achat && <span className="text-[10px] text-primary underline">Voir sur Amazon</span>}
            </a>
            <a href={product.lien_amazon_vente || undefined} target="_blank" rel="noopener noreferrer" className={`bg-muted/40 rounded-lg p-2.5 text-center ${product.lien_amazon_vente ? 'hover:ring-1 hover:ring-primary/50 transition-all cursor-pointer' : ''}`}>
              <div className="flex items-center justify-center gap-1.5 mb-1">
                {getFlag(paysVente) && <span className="text-base">{getFlag(paysVente)}</span>}
                <span className="text-[11px] font-medium text-muted-foreground">Vente | {getLabel(paysVente)}</span>
              </div>
              <p className="text-base font-bold text-primary">{val(product.prix_vente)}</p>
              {product.lien_amazon_vente && <span className="text-[10px] text-primary underline">Voir sur Amazon</span>}
            </a>
          </div>

          {/* Calculs + Ventes */}
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

          {/* ASIN + Offers */}
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

          {/* Links */}
          <div className="bg-muted/40 rounded-lg p-2.5">
            <span className="text-[11px] font-semibold block mb-1.5">🔗 Liens</span>
            <div className="flex flex-wrap gap-x-3 gap-y-1">
              {product.lien_sas ? (
                <a href={product.lien_sas} target="_blank" rel="noopener noreferrer" className="text-xs text-primary hover:underline font-medium">SAS</a>
              ) : (
                <span className="text-xs text-muted-foreground">SAS —</span>
              )}
              {product.lien_bbp ? (
                <a href={product.lien_bbp} target="_blank" rel="noopener noreferrer" className="text-xs text-primary hover:underline font-medium">BBP</a>
              ) : (
                <span className="text-xs text-muted-foreground">BBP —</span>
              )}
              {product.lien_keepa ? (
                <a href={product.lien_keepa} target="_blank" rel="noopener noreferrer" className="text-xs text-primary hover:underline font-medium">Keepa</a>
              ) : (
                <span className="text-xs text-muted-foreground">Keepa —</span>
              )}
              {product.lien_idealo ? (
                <a href={product.lien_idealo} target="_blank" rel="noopener noreferrer" className="text-xs text-primary hover:underline font-medium">Idealo</a>
              ) : null}
            </div>
          </div>

          {/* Keepa Chart */}
          {keepaChartUrl && (
            <div className="rounded-lg overflow-hidden border border-border/40 bg-white">
              <img
                src={keepaChartUrl}
                alt={`Keepa chart for ${product.asin}`}
                className="w-full h-auto"
                loading="lazy"
                onError={(e) => { (e.target as HTMLImageElement).style.display = 'none'; }}
              />
            </div>
          )}

          {/* Amazon link button */}
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
