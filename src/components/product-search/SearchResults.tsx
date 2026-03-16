import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Package, TrendingUp, DollarSign, BarChart3, Tag, ShoppingCart } from 'lucide-react';
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
  return <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium border ${v.class}`}>{v.label}</span>;
}

export default function SearchResults({ results, cacheHit, processingDuration, resultsCount }: SearchResultsProps) {
  if (results.length === 0) {
    return (
      <Card>
        <CardContent className="py-12 text-center">
          <Package className="w-12 h-12 mx-auto text-muted-foreground mb-4" />
          <p className="text-muted-foreground text-lg">Aucun résultat trouvé</p>
          <p className="text-muted-foreground text-sm mt-1">Essayez d'élargir vos critères de recherche</p>
        </CardContent>
      </Card>
    );
  }

  const avgRoi = Math.round(results.reduce((s, r) => s + r.roi, 0) / results.length * 100) / 100;
  const avgMargin = Math.round(results.reduce((s, r) => s + r.margin, 0) / results.length * 100) / 100;
  const avgProfit = Math.round(results.reduce((s, r) => s + r.profit, 0) / results.length * 100) / 100;

  return (
    <div className="space-y-4">
      {/* Stats summary */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <Card>
          <CardContent className="p-4 text-center">
            <Package className="w-5 h-5 mx-auto text-primary mb-1" />
            <p className="text-2xl font-bold">{resultsCount ?? results.length}</p>
            <p className="text-xs text-muted-foreground">Produits trouvés</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <TrendingUp className="w-5 h-5 mx-auto text-green-600 mb-1" />
            <p className="text-2xl font-bold text-green-600">{avgRoi}%</p>
            <p className="text-xs text-muted-foreground">ROI moyen</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <BarChart3 className="w-5 h-5 mx-auto text-blue-600 mb-1" />
            <p className="text-2xl font-bold text-blue-600">{avgMargin}%</p>
            <p className="text-xs text-muted-foreground">Marge moyenne</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <DollarSign className="w-5 h-5 mx-auto text-amber-600 mb-1" />
            <p className="text-2xl font-bold text-amber-600">{avgProfit}€</p>
            <p className="text-xs text-muted-foreground">Profit moyen</p>
          </CardContent>
        </Card>
      </div>

      {/* Meta info */}
      <div className="flex flex-wrap gap-2 items-center text-sm text-muted-foreground">
        {cacheHit !== undefined && (
          <Badge variant={cacheHit ? 'secondary' : 'outline'}>
            {cacheHit ? 'Résultat en cache' : 'Recherche fraîche'}
          </Badge>
        )}
        {processingDuration !== undefined && (
          <span>Traité en {processingDuration}ms</span>
        )}
      </div>

      {/* Results table */}
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-lg flex items-center gap-2">
            <ShoppingCart className="w-5 h-5 text-primary" />
            Résultats
          </CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <ScrollArea className="w-full">
            <div className="min-w-[800px]">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-[250px]">Produit</TableHead>
                    <TableHead>ASIN</TableHead>
                    <TableHead className="text-right">Prix achat</TableHead>
                    <TableHead className="text-right">Prix vente</TableHead>
                    <TableHead className="text-right">ROI</TableHead>
                    <TableHead className="text-right">Marge</TableHead>
                    <TableHead className="text-right">Profit</TableHead>
                    <TableHead className="text-right">Ventes/mois</TableHead>
                    <TableHead className="text-right">BSR</TableHead>
                    <TableHead>Concurrence</TableHead>
                    <TableHead>Marketplace</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {results.map((product) => (
                    <TableRow key={product.id} className="hover:bg-accent/50">
                      <TableCell>
                        <div>
                          <p className="font-medium text-sm truncate max-w-[250px]" title={product.title}>
                            {product.title}
                          </p>
                          <div className="flex gap-1 mt-1">
                            {product.brand && (
                              <Badge variant="outline" className="text-xs">
                                <Tag className="w-3 h-3 mr-1" />
                                {product.brand}
                              </Badge>
                            )}
                            {product.category && (
                              <Badge variant="outline" className="text-xs">{product.category}</Badge>
                            )}
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <code className="text-xs bg-muted px-1.5 py-0.5 rounded">{product.asin || '-'}</code>
                      </TableCell>
                      <TableCell className="text-right font-medium">{product.price.toFixed(2)}€</TableCell>
                      <TableCell className="text-right font-medium">{product.sale_price?.toFixed(2) || '-'}€</TableCell>
                      <TableCell className="text-right">
                        <span className={`font-bold ${product.roi >= 30 ? 'text-green-600' : product.roi >= 15 ? 'text-yellow-600' : 'text-red-600'}`}>
                          {product.roi.toFixed(1)}%
                        </span>
                      </TableCell>
                      <TableCell className="text-right">
                        <span className={`font-medium ${product.margin >= 25 ? 'text-green-600' : 'text-muted-foreground'}`}>
                          {product.margin.toFixed(1)}%
                        </span>
                      </TableCell>
                      <TableCell className="text-right font-medium text-amber-600">{product.profit.toFixed(2)}€</TableCell>
                      <TableCell className="text-right">{product.monthly_sales ?? '-'}</TableCell>
                      <TableCell className="text-right">{product.bsr?.toLocaleString() ?? '-'}</TableCell>
                      <TableCell><CompetitionBadge level={product.competition_level} /></TableCell>
                      <TableCell>
                        <Badge variant="secondary" className="text-xs">{product.marketplace || '-'}</Badge>
                      </TableCell>
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
