import type { MPLookup } from '@/hooks/use-mp';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { History, Trash2, Loader2, CheckCircle, XCircle, Clock } from 'lucide-react';

interface SearchHistoryProps {
  lookups: MPLookup[];
  selectedId: string | null;
  onViewResults: (lookupId: string) => void;
  onDelete: (lookupId: string) => void;
}

const statusConfig = {
  pending: { icon: Clock, label: 'En attente', variant: 'secondary' as const },
  processing: { icon: Loader2, label: 'En cours', variant: 'default' as const },
  completed: { icon: CheckCircle, label: 'Terminée', variant: 'default' as const },
  error: { icon: XCircle, label: 'Erreur', variant: 'destructive' as const },
};

const SearchHistory = ({ lookups, selectedId, onViewResults, onDelete }: SearchHistoryProps) => {
  if (lookups.length === 0) return null;

  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="text-base flex items-center gap-2">
          <History className="h-4 w-4" />
          Historique
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-2">
        {lookups.slice(0, 20).map(lookup => {
          const config = statusConfig[lookup.status];
          const Icon = config.icon;
          const isSelected = lookup.id === selectedId;
          const displayText = lookup.query_input.length > 30
            ? lookup.query_input.substring(0, 30) + '...'
            : lookup.query_input;

          return (
            <div
              key={lookup.id}
              className={`flex items-center justify-between p-2 rounded-md cursor-pointer transition-colors ${
                isSelected ? 'bg-primary/10 border border-primary/20' : 'hover:bg-muted/50'
              }`}
              onClick={() => lookup.status === 'completed' && onViewResults(lookup.id)}
            >
              <div className="flex items-center gap-2 min-w-0 flex-1">
                <Icon className={`h-4 w-4 shrink-0 ${lookup.status === 'processing' ? 'animate-spin' : ''} ${
                  lookup.status === 'completed' ? 'text-green-500' : ''
                } ${lookup.status === 'error' ? 'text-red-500' : ''}`} />
                <div className="min-w-0">
                  <p className="text-sm font-mono truncate">{displayText}</p>
                  <p className="text-xs text-muted-foreground">
                    {new Date(lookup.created_at).toLocaleString('fr-FR', { day: '2-digit', month: '2-digit', hour: '2-digit', minute: '2-digit' })}
                    {lookup.results_count > 0 && ` · ${lookup.results_count} résultat(s)`}
                    {lookup.processing_ms && ` · ${(lookup.processing_ms / 1000).toFixed(1)}s`}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-1 shrink-0">
                <Badge variant={config.variant} className="text-xs">
                  {lookup.country_code}
                </Badge>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-7 w-7 text-muted-foreground hover:text-destructive"
                  onClick={(e) => { e.stopPropagation(); onDelete(lookup.id); }}
                >
                  <Trash2 className="h-3.5 w-3.5" />
                </Button>
              </div>
            </div>
          );
        })}
      </CardContent>
    </Card>
  );
};

export default SearchHistory;
