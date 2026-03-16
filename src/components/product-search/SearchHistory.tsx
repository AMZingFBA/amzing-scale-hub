import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Clock, CheckCircle, AlertCircle, Loader2, Database, RefreshCw, Eye } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import { fr } from 'date-fns/locale';
import type { ProductSearch } from '@/lib/product-search-types';

interface SearchHistoryProps {
  searches: ProductSearch[];
  onViewResults?: (search: ProductSearch) => void;
}

function StatusBadge({ status, cacheHit }: { status: string; cacheHit?: boolean }) {
  switch (status) {
    case 'pending':
      return (
        <Badge variant="secondary" className="gap-1">
          <Clock className="w-3 h-3" />
          En attente
        </Badge>
      );
    case 'processing':
      return (
        <Badge className="gap-1 bg-blue-100 text-blue-800 border-blue-200">
          <Loader2 className="w-3 h-3 animate-spin" />
          En cours
        </Badge>
      );
    case 'completed':
      return (
        <Badge className="gap-1 bg-green-100 text-green-800 border-green-200">
          <CheckCircle className="w-3 h-3" />
          Terminé
        </Badge>
      );
    case 'cached':
      return (
        <Badge className="gap-1 bg-purple-100 text-purple-800 border-purple-200">
          <Database className="w-3 h-3" />
          Cache
        </Badge>
      );
    case 'error':
      return (
        <Badge variant="destructive" className="gap-1">
          <AlertCircle className="w-3 h-3" />
          Erreur
        </Badge>
      );
    default:
      return <Badge variant="outline">{status}</Badge>;
  }
}

export default function SearchHistory({ searches }: SearchHistoryProps) {
  if (searches.length === 0) {
    return (
      <Card>
        <CardContent className="py-8 text-center">
          <Clock className="w-10 h-10 mx-auto text-muted-foreground mb-3" />
          <p className="text-muted-foreground">Aucune recherche récente</p>
          <p className="text-muted-foreground text-sm mt-1">Lancez votre première recherche ci-dessus</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="text-lg flex items-center gap-2">
          <RefreshCw className="w-5 h-5 text-primary" />
          Recherches récentes
        </CardTitle>
      </CardHeader>
      <CardContent className="p-0">
        <ScrollArea className="max-h-[400px]">
          <div className="divide-y">
            {searches.map((search) => (
              <div key={search.id} className="px-6 py-3 hover:bg-accent/30 transition-colors">
                <div className="flex items-start justify-between gap-3">
                  <div className="min-w-0 flex-1">
                    <p className="font-medium text-sm truncate">{search.name}</p>
                    <div className="flex flex-wrap items-center gap-2 mt-1">
                      <StatusBadge status={search.status} cacheHit={search.cache_hit} />
                      {search.results_count > 0 && (
                        <span className="text-xs text-muted-foreground">
                          {search.results_count} résultat{search.results_count > 1 ? 's' : ''}
                        </span>
                      )}
                      {search.processing_duration_ms && (
                        <span className="text-xs text-muted-foreground">
                          {search.processing_duration_ms}ms
                        </span>
                      )}
                      {search.cache_hit && (
                        <Badge variant="outline" className="text-xs">
                          <Database className="w-3 h-3 mr-1" />
                          cache
                        </Badge>
                      )}
                    </div>
                    {search.error_message && (
                      <p className="text-xs text-destructive mt-1 truncate">{search.error_message}</p>
                    )}
                    {search.results_summary && (
                      <div className="flex gap-3 mt-1 text-xs text-muted-foreground">
                        <span>ROI moy: {search.results_summary.avg_roi}%</span>
                        <span>Marge moy: {search.results_summary.avg_margin}%</span>
                      </div>
                    )}
                  </div>
                  <span className="text-xs text-muted-foreground whitespace-nowrap">
                    {formatDistanceToNow(new Date(search.created_at), { addSuffix: true, locale: fr })}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </ScrollArea>
      </CardContent>
    </Card>
  );
}
