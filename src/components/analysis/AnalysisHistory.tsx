import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Eye, Trash2, Loader2, Clock, FileSpreadsheet } from 'lucide-react';
import type { FileAnalysis } from '@/hooks/use-file-analysis';

interface AnalysisHistoryProps {
  analyses: FileAnalysis[];
  selectedId: string | null;
  onViewResults: (id: string) => void;
  onDelete: (id: string) => void;
}

const STATUS_CONFIG: Record<string, { label: string; variant: 'default' | 'secondary' | 'destructive' | 'outline' }> = {
  pending: { label: 'En attente', variant: 'secondary' },
  processing: { label: 'En cours...', variant: 'default' },
  completed: { label: 'Terminé', variant: 'outline' },
  error: { label: 'Erreur', variant: 'destructive' },
};

export default function AnalysisHistory({ analyses, selectedId, onViewResults, onDelete }: AnalysisHistoryProps) {
  if (analyses.length === 0) {
    return (
      <Card>
        <CardContent className="pt-6 text-center text-muted-foreground">
          <FileSpreadsheet className="mx-auto h-8 w-8 mb-2 opacity-50" />
          <p>Aucune analyse pour l'instant</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">Historique</CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        {analyses.map(a => {
          const status = STATUS_CONFIG[a.status] || STATUS_CONFIG.pending;
          const isSelected = a.id === selectedId;

          return (
            <div
              key={a.id}
              className={`flex items-center justify-between p-3 rounded-lg border transition-colors ${
                isSelected ? 'border-primary bg-accent/50' : 'hover:bg-accent/30'
              }`}
            >
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <p className="font-medium text-sm truncate">{a.file_name}</p>
                  <Badge variant={status.variant} className="text-xs shrink-0">
                    {a.status === 'processing' && <Loader2 className="h-3 w-3 mr-1 animate-spin" />}
                    {status.label}
                  </Badge>
                </div>
                <div className="flex items-center gap-3 mt-1 text-xs text-muted-foreground">
                  <span className="flex items-center gap-1">
                    <Clock className="h-3 w-3" />
                    {new Date(a.created_at).toLocaleString('fr-FR')}
                  </span>
                  {a.status === 'completed' && (
                    <span>
                      {a.results_count} / {a.total_rows} produits
                      {a.processing_duration_ms && ` — ${(a.processing_duration_ms / 1000).toFixed(0)}s`}
                    </span>
                  )}
                  {a.status === 'error' && a.error_message && (
                    <span className="text-destructive truncate max-w-[200px]">{a.error_message}</span>
                  )}
                </div>
              </div>

              <div className="flex items-center gap-1 ml-2">
                {a.status === 'completed' && (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => onViewResults(a.id)}
                  >
                    <Eye className="h-4 w-4" />
                  </Button>
                )}
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => onDelete(a.id)}
                >
                  <Trash2 className="h-4 w-4 text-muted-foreground hover:text-destructive" />
                </Button>
              </div>
            </div>
          );
        })}
      </CardContent>
    </Card>
  );
}
