import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Package, TrendingUp, DollarSign, BarChart3, ShoppingCart, Truck } from 'lucide-react';
import type { ProductResult } from '@/lib/product-search-types';

interface SearchResultsProps {
  results: ProductResult[];
  cacheHit?: boolean;
  processingDuration?: number;
  resultsCount?: number;
}

function CompetitionBadge({ level }: { level?: string }) {
  if (!level) return null;
  const variants: Record<string, { class: string; label: string }> = {
    low: { class: 'bg-green-100 text-green-800 border-green-200', label: 'Faible' },
    medium: { class: 'bg-yellow-100 text-yellow-800 border-yellow-200', label: 'Moyenne' },
    high: { class: 'bg-red-100 text-red-800 border-red-200', label: 'Forte' },
  };
  const v = variants[level] || variants.medium;
  return <span className={`inline-flex items-center px-1.5 py-0.5 rounded-full text-[10px] font-medium border ${v.class}`}>{v.label}</span>;
}

export default function SearchResults({ results, cacheHit, processingDuration, resultsCount }: SearchResultsProps) {
  if (results.length === 0) {
    return (
      <Card>
        <CardContent className="py-12 text-center">
          <Package className="w-12 h-12 mx-auto text-muted-foreground mb-4" />
          <p className="text-muted-foreground text-lg">Aucun résultat trouvé</p>
          <p className="text-muted-foreground text-sm mt-1">Essayez d'élargir vos critères</p>
        </CardContent>
      </Card>
    );
  }

  const avgRoi = Math.round(results.reduce((s, r) => s + r.roi, 0) / results.length * 100) / 100;
  const avgProfit = Math.round(results.reduce((s, r) => s + r.profit, 0) / results.length * 100) / 100;
  const totalMonthlyProfit = Math.round(results.reduce((s, r) => s + (r.monthly_profit || 0), 0) * 100) / 100;
  const totalMonthlySales = results.reduce((s, r) => s + (r.monthly_sales || 0), 0);

  return (
    <div className="space-y-3">
      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-2">
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
            <p className="text-xl font-bold text-green-600">{avgRoi}%</p>
            <p className="text-[10px] text-muted-foreground">ROI moyen</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-3 text-center">
            <DollarSign className="w-4 h-4 mx-auto text-amber-600 mb-0.5" />
            <p className="text-xl font-bold text-amber-600">{avgProfit}€</p>
            <p className="text-[10px] text-muted-foreground">Profit unit. moy.</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-3 text-center">
            <BarChart3 className="w-4 h-4 mx-auto text-blue-600 mb-0.5" />
            <p className="text-xl font-bold text-blue-600">{totalMonthlySales.toLocaleString()}</p>
            <p className="text-[10px] text-muted-foreground">Ventes/mois total</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-3 text-center">
            <DollarSign className="w-4 h-4 mx-auto text-purple-600 mb-0.5" />
            <p className="text-xl font-bold text-purple-600">{totalMonthlyProfit.toLocaleString()}€</p>
            <p className="text-[10px] text-muted-foreground">Profit/mois total</p>
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
        {processingDuration !== undefined && (
          <span>{processingDuration}ms</span>
        )}
      </div>

      {/* Table */}
      <Card>
        <CardHeader className="py-2 px-4">
          <CardTitle className="text-sm flex items-center gap-2">
            <ShoppingCart className="w-4 h-4 text-primary" />
            Résultats
          </CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <ScrollArea className="w-full">
            <div className="min-w-[1100px]">
              <Table>
                <TableHeader>
                  <TableRow className="text-xs">
                    <TableHead className="w-[200px]">Produit</TableHead>
                    <TableHead>ASIN</TableHead>
                    <TableHead className="text-right">
                      <span className="flex items-center justify-end gap-1"><Truck className="w-3 h-3" />Fournisseur</span>
                    </TableHead>
                    <TableHead className="text-right">Prix fourn.</TableHead>
                    <TableHead className="text-right">Prix Amazon</TableHead>
                    <TableHead className="text-right">Profit unit.</TableHead>
                    <TableHead className="text-right">ROI</TableHead>
                    <TableHead className="text-right">Ventes/mois</TableHead>
                    <TableHead className="text-right">Profit/mois</TableHead>
                    <TableHead className="text-right">BSR</TableHead>
                    <TableHead>Conc.</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {results.map((p) => (
                    <TableRow key={p.id} className="hover:bg-accent/50 text-xs">
                      <TableCell>
                        <p className="font-medium text-xs truncate max-w-[200px]" title={p.title}>
                          {p.title}
                        </p>
                        <div className="flex gap-1 mt-0.5">
                          {p.brand && <Badge variant="outline" className="text-[10px] h-4 px-1">{p.brand}</Badge>}
                          {p.category && <Badge variant="outline" className="text-[10px] h-4 px-1">{p.category}</Badge>}
                        </div>
                      </TableCell>
                      <TableCell>
                        <code className="text-[10px] bg-muted px-1 py-0.5 rounded">{p.asin || '-'}</code>
                      </TableCell>
                      <TableCell className="text-right">
                        <Badge variant="secondary" className="text-[10px] h-4 px-1">{p.supplier || '-'}</Badge>
                      </TableCell>
                      <TableCell className="text-right font-medium">{p.supplier_price?.toFixed(2) ?? '-'}€</TableCell>
                      <TableCell className="text-right font-medium">{p.price.toFixed(2)}€</TableCell>
                      <TableCell className="text-right">
                        <span className={`font-bold ${p.profit >= 5 ? 'text-green-600' : p.profit >= 2 ? 'text-yellow-600' : 'text-red-500'}`}>
                          {p.profit.toFixed(2)}€
                        </span>
                      </TableCell>
                      <TableCell className="text-right">
                        <span className={`font-bold ${p.roi >= 30 ? 'text-green-600' : p.roi >= 15 ? 'text-yellow-600' : 'text-red-500'}`}>
                          {p.roi.toFixed(1)}%
                        </span>
                      </TableCell>
                      <TableCell className="text-right">{p.monthly_sales ?? '-'}</TableCell>
                      <TableCell className="text-right font-medium text-purple-600">
                        {p.monthly_profit ? `${p.monthly_profit.toFixed(0)}€` : '-'}
                      </TableCell>
                      <TableCell className="text-right text-muted-foreground">{p.bsr?.toLocaleString() ?? '-'}</TableCell>
                      <TableCell><CompetitionBadge level={p.competition_level} /></TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </ScrollArea>
        </CardContent>
      </Card>
    </div>
  );
}
