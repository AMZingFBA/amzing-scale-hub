import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { ExternalLink, Download } from 'lucide-react';
import type { AnalysisResult } from '@/hooks/use-file-analysis';

interface AnalysisResultsProps {
  results: AnalysisResult[];
  analysisName?: string;
}

export default function AnalysisResults({ results, analysisName }: AnalysisResultsProps) {
  if (results.length === 0) return null;

  const handleExportCSV = () => {
    const headers = [
      'ASIN', 'EAN', 'Produit', 'Prix Achat', 'Prix Vente',
      'Profit FBA', 'ROI FBA %', 'Profit FBM', 'ROI FBM %',
      'BSR', 'Ventes/mois', 'Vendeurs FBA', 'Vendeurs FBM',
      'Categorie', 'Variations', 'Alertes', 'Commission %', 'FBA Fee', 'URL'
    ];
    const rows = results.map(r => [
      r.asin, r.ean || '', r.product_name || '',
      r.buy_price, r.sell_price,
      r.profit_fba ?? '', r.roi_fba ?? '', r.profit_fbm ?? '', r.roi_fbm ?? '',
      r.bsr, r.sales_monthly, r.fba_sellers, r.fbm_sellers,
      r.category, r.variations, r.alerts, r.commission_pct, r.fba_fee ?? '',
      r.amazon_url
    ]);

    const csv = [headers, ...rows].map(row =>
      row.map(cell => `"${String(cell).replace(/"/g, '""')}"`).join(',')
    ).join('\n');

    const blob = new Blob(['\ufeff' + csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `analyse_${analysisName || 'results'}_${new Date().toISOString().slice(0, 10)}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle className="text-lg">
          Resultats ({results.length} produits)
        </CardTitle>
        <Button variant="outline" size="sm" onClick={handleExportCSV}>
          <Download className="h-4 w-4 mr-1" />
          Exporter CSV
        </Button>
      </CardHeader>
      <CardContent>
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>ASIN</TableHead>
                <TableHead>Produit</TableHead>
                <TableHead className="text-right">Achat</TableHead>
                <TableHead className="text-right">Vente</TableHead>
                <TableHead className="text-right">Profit FBA</TableHead>
                <TableHead className="text-right">ROI FBA</TableHead>
                <TableHead className="text-right">Profit FBM</TableHead>
                <TableHead className="text-right">ROI FBM</TableHead>
                <TableHead className="text-right">BSR</TableHead>
                <TableHead className="text-right">Ventes/m</TableHead>
                <TableHead className="text-right">FBA</TableHead>
                <TableHead className="text-right">FBM</TableHead>
                <TableHead>Alertes</TableHead>
                <TableHead></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {results.map((r) => (
                <TableRow key={r.id}>
                  <TableCell className="font-mono text-xs">{r.asin}</TableCell>
                  <TableCell className="max-w-[200px] truncate text-sm">
                    {r.product_name || r.category || '-'}
                  </TableCell>
                  <TableCell className="text-right">{r.buy_price.toFixed(2)}€</TableCell>
                  <TableCell className="text-right">{r.sell_price.toFixed(2)}€</TableCell>
                  <TableCell className={`text-right font-medium ${(r.profit_fba ?? 0) > 0 ? 'text-green-600' : 'text-red-500'}`}>
                    {r.profit_fba != null ? `${r.profit_fba.toFixed(2)}€` : 'N/A'}
                  </TableCell>
                  <TableCell className={`text-right font-medium ${(r.roi_fba ?? 0) > 0 ? 'text-green-600' : 'text-red-500'}`}>
                    {r.roi_fba != null ? `${r.roi_fba.toFixed(1)}%` : 'N/A'}
                  </TableCell>
                  <TableCell className={`text-right ${(r.profit_fbm ?? 0) > 0 ? 'text-green-600' : 'text-red-500'}`}>
                    {r.profit_fbm != null ? `${r.profit_fbm.toFixed(2)}€` : 'N/A'}
                  </TableCell>
                  <TableCell className={`text-right ${(r.roi_fbm ?? 0) > 0 ? 'text-green-600' : 'text-red-500'}`}>
                    {r.roi_fbm != null ? `${r.roi_fbm.toFixed(1)}%` : 'N/A'}
                  </TableCell>
                  <TableCell className="text-right text-sm">{r.bsr?.toLocaleString() || '-'}</TableCell>
                  <TableCell className="text-right text-sm">{r.sales_monthly || '-'}</TableCell>
                  <TableCell className="text-right text-sm">{r.fba_sellers}</TableCell>
                  <TableCell className="text-right text-sm">{r.fbm_sellers}</TableCell>
                  <TableCell>
                    {r.alerts && (
                      <div className="flex gap-1">
                        {r.alerts.split(',').map(a => a.trim()).filter(Boolean).map(alert => (
                          <Badge key={alert} variant="destructive" className="text-xs">
                            {alert}
                          </Badge>
                        ))}
                      </div>
                    )}
                  </TableCell>
                  <TableCell>
                    <a href={r.amazon_url} target="_blank" rel="noopener noreferrer">
                      <ExternalLink className="h-4 w-4 text-muted-foreground hover:text-foreground" />
                    </a>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  );
}
