import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Package, TrendingUp, DollarSign, BarChart3, ChevronUp, ChevronDown, ExternalLink, ChevronLeft, ChevronRight } from 'lucide-react';
import type { ProductResult } from '@/lib/product-search-types';

interface SearchResultsProps {
  results: ProductResult[];
  cacheHit?: boolean;
  processingDuration?: number;
  resultsCount?: number;
}

type SortKey = 'roi' | 'profit' | 'monthly_sales' | 'price' | 'supplier_price' | null;

const PAGE_SIZE = 25;

function avg(arr: number[]): number {
  const valid = arr.filter(n => n > 0 && isFinite(n));
  if (!valid.length) return 0;
  return valid.reduce((s, n) => s + n, 0) / valid.length;
}

function fmt2(n: number): string { return (Math.round(n * 100) / 100).toFixed(2); }

/** Build the Amazon product URL based on the marketplace field */
function amazonUrl(asin: string, marketplace?: string): string {
  const domainMap: Record<string, string> = {
    'amazon.fr': 'amazon.fr',
    'amazon.de': 'amazon.de',
    'amazon.es': 'amazon.es',
    'amazon.it': 'amazon.it',
    'amazon.co.uk': 'amazon.co.uk',
    'amazon.com': 'amazon.com',
  };
  const domain = domainMap[marketplace ?? 'amazon.fr'] ?? 'amazon.fr';
  return `https://www.${domain}/dp/${asin}`;
}

export default function SearchResults({ results, cacheHit, processingDuration, resultsCount }: SearchResultsProps) {
  const [sortKey, setSortKey] = useState<SortKey>(null);
  const [sortAsc, setSortAsc] = useState(false);
  const [page, setPage] = useState(0);

  if (results.length === 0) {
    return (
      <Card>
        <CardContent className="py-12 text-center">
          <Package className="w-12 h-12 mx-auto text-muted-foreground mb-4" />
          <p className="text-muted-foreground text-lg">Aucun résultat</p>
          <p className="text-muted-foreground text-sm mt-1">Essayez d'élargir vos critères</p>
        </CardContent>
      </Card>
    );
  }

  const sorted = sortKey === null
    ? results
    : [...results].sort((a, b) => {
        const va = (a as any)[sortKey] ?? 0;
        const vb = (b as any)[sortKey] ?? 0;
        return sortAsc ? va - vb : vb - va;
      });

  const totalPages = Math.ceil(sorted.length / PAGE_SIZE);
  const pageItems  = sorted.slice(page * PAGE_SIZE, (page + 1) * PAGE_SIZE);

  function toggleSort(key: NonNullable<SortKey>) {
    if (sortKey === key) setSortAsc(p => !p);
    else { setSortKey(key); setSortAsc(false); }
    setPage(0);
  }

  function SortIcon({ k }: { k: NonNullable<SortKey> }) {
    if (sortKey !== k) return <ChevronUp className="w-3 h-3 opacity-20" />;
    return sortAsc
      ? <ChevronUp className="w-3 h-3 text-primary" />
      : <ChevronDown className="w-3 h-3 text-primary" />;
  }

  function SortTh({ k, label, right }: { k: NonNullable<SortKey>; label: string; right?: boolean }) {
    return (
      <TableHead
        className={`cursor-pointer select-none whitespace-nowrap ${right ? 'text-right' : ''}`}
        onClick={() => toggleSort(k)}
      >
        <span className={`inline-flex items-center gap-1 ${right ? 'justify-end w-full' : ''}`}>
          {label} <SortIcon k={k} />
        </span>
      </TableHead>
    );
  }

  const avgRoi    = avg(results.map(r => r.roi));
  const avgProfit = avg(results.map(r => r.profit));
  const totalMonthlySales = results.reduce((s, r) => s + (r.monthly_sales || 0), 0);

  return (
    <div className="space-y-3">
      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
        <Card>
          <CardContent className="p-3 text-center">
            <Package className="w-4 h-4 mx-auto text-primary mb-0.5" />
            <p className="text-xl font-bold">{resultsCount ?? results.length}</p>
            <p className="text-[10px] text-muted-foreground">Produits</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-3 text-center">
            <TrendingUp className="w-4 h-4 mx-auto text-green-600 mb-0.5" />
            <p className="text-xl font-bold text-green-600">{fmt2(avgRoi)}%</p>
            <p className="text-[10px] text-muted-foreground">ROI moyen</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-3 text-center">
            <DollarSign className="w-4 h-4 mx-auto text-amber-600 mb-0.5" />
            <p className="text-xl font-bold text-amber-600">{fmt2(avgProfit)}€</p>
            <p className="text-[10px] text-muted-foreground">Profit unit. moy.</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-3 text-center">
            <BarChart3 className="w-4 h-4 mx-auto text-purple-600 mb-0.5" />
            <p className="text-xl font-bold text-purple-600">{totalMonthlySales.toLocaleString('fr')}</p>
            <p className="text-[11px] text-muted-foreground">Ventes/mois total</p>
          </CardContent>
        </Card>
      </div>

      {/* Meta */}
      <div className="flex flex-wrap gap-2 items-center text-xs text-muted-foreground">
        {cacheHit !== undefined && (
          <Badge variant={cacheHit ? 'secondary' : 'outline'} className="text-[10px]">
            {cacheHit ? 'Cache' : 'Recherche fraîche'}
          </Badge>
        )}
        {processingDuration !== undefined && <span>{processingDuration}ms</span>}
        <span className="ml-auto flex items-center gap-2">
          {sortKey === null
            ? <span className="text-[10px] text-primary font-medium">Ordre original • cliquer colonne pour trier</span>
            : <button className="text-[10px] underline hover:text-primary" onClick={() => { setSortKey(null); setPage(0); }}>
                Réinitialiser (ordre original)
              </button>
          }
        </span>
      </div>

      {/* Table */}
      <Card>
        <CardHeader className="py-2 px-4 flex flex-row items-center justify-between">
          <CardTitle className="text-sm">
            {sorted.length} résultats
            {totalPages > 1 && <span className="text-muted-foreground font-normal ml-2 text-xs">• page {page + 1}/{totalPages}</span>}
          </CardTitle>
          {totalPages > 1 && (
            <div className="flex items-center gap-1">
              <button
                onClick={() => setPage(p => Math.max(0, p - 1))}
                disabled={page === 0}
                className="p-1 rounded hover:bg-muted disabled:opacity-30"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              <span className="text-xs text-muted-foreground px-1">{page + 1} / {totalPages}</span>
              <button
                onClick={() => setPage(p => Math.min(totalPages - 1, p + 1))}
                disabled={page === totalPages - 1}
                className="p-1 rounded hover:bg-muted disabled:opacity-30"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          )}
        </CardHeader>
        <CardContent className="p-0">
          <div className="overflow-x-auto rounded-b-lg">
            <Table className="min-w-[1300px] text-xs">
              <TableHeader className="sticky top-0 bg-background z-10">
                <TableRow>
                  <TableHead className="w-[220px] whitespace-nowrap">Produit</TableHead>
                  <TableHead className="whitespace-nowrap">ASIN</TableHead>
                  <TableHead className="whitespace-nowrap">Correspond.</TableHead>
                  <TableHead className="whitespace-nowrap">Fournisseur</TableHead>
                  <SortTh k="supplier_price" label="Prix fourn." right />
                  <SortTh k="price"          label="Prix Amazon" right />
                  <SortTh k="profit"         label="Profit unit." right />
                  <SortTh k="roi"            label="ROI" right />
                  <SortTh k="monthly_sales"  label="Ventes/mois" right />
                  <TableHead className="whitespace-nowrap text-center">Keepa 90j</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {pageItems.map((p) => (
                  <TableRow key={p.id} className="hover:bg-accent/50">
                    {/* Produit */}
                    <TableCell className="max-w-[220px]">
                      <p className="font-medium truncate" title={p.title}>{p.title || '—'}</p>
                      <div className="flex gap-1 mt-0.5 flex-wrap">
                        {p.brand    && <Badge variant="outline" className="text-[9px] h-4 px-1">{p.brand}</Badge>}
                        {p.category && <Badge variant="outline" className="text-[9px] h-4 px-1">{p.category}</Badge>}
                        {p.marketplace && <Badge variant="outline" className="text-[9px] h-4 px-1">{p.marketplace}</Badge>}
                      </div>
                    </TableCell>

                    {/* ASIN */}
                    <TableCell>
                      {p.asin
                        ? <a
                            href={amazonUrl(p.asin, p.marketplace)}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="font-mono text-[10px] bg-muted px-1 py-0.5 rounded hover:underline text-primary inline-flex items-center gap-0.5"
                          >
                            {p.asin}
                            <ExternalLink className="w-2.5 h-2.5" />
                          </a>
                        : <span className="text-muted-foreground">—</span>}
                    </TableCell>

                    {/* Correspondance */}
                    <TableCell className="text-center">
                      {p.correspondance
                        ? <span className="text-[11px] font-semibold text-blue-600">{p.correspondance}</span>
                        : <span className="text-muted-foreground">—</span>}
                    </TableCell>

                    {/* Fournisseur */}
                    <TableCell>
                      {p.supplier_url
                        ? <a
                            href={p.supplier_url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-0.5 hover:underline text-primary"
                          >
                            <Badge variant="secondary" className="text-[10px] h-4 px-1 max-w-[110px] truncate">
                              {p.supplier || '—'}
                            </Badge>
                            <ExternalLink className="w-2.5 h-2.5 text-primary" />
                          </a>
                        : <Badge variant="secondary" className="text-[10px] h-4 px-1 max-w-[110px] truncate block">
                            {p.supplier || '—'}
                          </Badge>}
                    </TableCell>

                    {/* Prix fournisseur */}
                    <TableCell className="text-right font-medium">
                      {(p.supplier_price ?? 0) > 0
                        ? <span className="inline-flex items-center gap-1 justify-end">
                            {fmt2(p.supplier_price!)}€
                            {p.supplier_price_ht && (
                              <span className="text-[9px] text-amber-600 font-normal border border-amber-300 rounded px-0.5">HT</span>
                            )}
                          </span>
                        : '—'}
                    </TableCell>

                    {/* Prix Amazon */}
                    <TableCell className="text-right font-medium">
                      {p.price > 0 ? `${fmt2(p.price)}€` : '—'}
                    </TableCell>

                    {/* Profit unitaire */}
                    <TableCell className="text-right">
                      <span className={`font-bold ${p.profit >= 5 ? 'text-green-600' : p.profit >= 2 ? 'text-yellow-600' : 'text-red-500'}`}>
                        {p.profit !== 0 ? `${fmt2(p.profit)}€` : '—'}
                      </span>
                    </TableCell>

                    {/* ROI */}
                    <TableCell className="text-right">
                      <span className={`font-bold ${p.roi >= 30 ? 'text-green-600' : p.roi >= 15 ? 'text-yellow-600' : 'text-red-500'}`}>
                        {p.roi > 0 ? `${p.roi.toFixed(1)}%` : '—'}
                      </span>
                    </TableCell>

                    {/* Ventes/mois */}
                    <TableCell className="text-right">
                      {p.monthly_sales ? p.monthly_sales.toLocaleString('fr') : '—'}
                    </TableCell>

                    {/* Keepa 90j */}
                    <TableCell className="text-center">
                      {(p.keepa_b64 || p.keepa_url)
                        ? <a href={p.keepa_url || '#'} target="_blank" rel="noopener noreferrer">
                            <img
                              src={p.keepa_b64 || p.keepa_url}
                              referrerPolicy="no-referrer"
                              alt="Keepa"
                              className="h-10 w-auto rounded border border-border hover:opacity-80 transition-opacity"
                              loading="lazy"
                            />
                          </a>
                        : <span className="text-muted-foreground">—</span>}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      {/* Pagination bas */}
      {totalPages > 1 && (
        <div className="flex items-center justify-center gap-2 text-xs">
          <button
            onClick={() => setPage(p => Math.max(0, p - 1))}
            disabled={page === 0}
            className="flex items-center gap-1 px-3 py-1.5 rounded border hover:bg-muted disabled:opacity-30"
          >
            <ChevronLeft className="w-3 h-3" /> Précédent
          </button>
          <span className="text-muted-foreground">Page {page + 1} sur {totalPages} ({PAGE_SIZE} produits/page)</span>
          <button
            onClick={() => setPage(p => Math.min(totalPages - 1, p + 1))}
            disabled={page === totalPages - 1}
            className="flex items-center gap-1 px-3 py-1.5 rounded border hover:bg-muted disabled:opacity-30"
          >
            Suivant <ChevronRight className="w-3 h-3" />
          </button>
        </div>
      )}
    </div>
  );
}
