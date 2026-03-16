import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Clock, CheckCircle, AlertCircle, Loader2, Database, RefreshCw, Eye, Trash2, Pencil, Check, X } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import { fr } from 'date-fns/locale';
import type { ProductSearch } from '@/lib/product-search-types';

interface SearchHistoryProps {
  searches: ProductSearch[];
  onViewResults?: (search: ProductSearch) => void;
  onDelete?: (id: string) => void;
  onRename?: (id: string, name: string) => void;
}

function StatusBadge({ status }: { status: string }) {
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

export default function SearchHistory({ searches, onViewResults, onDelete, onRename }: SearchHistoryProps) {
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editingName, setEditingName] = useState('');

  const startEdit = (search: ProductSearch) => {
    setEditingId(search.id);
    setEditingName(search.name);
  };

  const cancelEdit = () => {
    setEditingId(null);
    setEditingName('');
  };

  const saveEdit = (id: string) => {
    const trimmed = editingName.trim();
    if (trimmed && onRename) onRename(id, trimmed);
    setEditingId(null);
    setEditingName('');
  };

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
        <div className="max-h-[400px] overflow-y-auto divide-y">
          {searches.map((search) => (
            <div key={search.id} className="px-6 py-3 hover:bg-accent/30 transition-colors">
              <div className="flex items-start justify-between gap-3">
                <div className="min-w-0 flex-1">
                  {/* Name + rename */}
                  {editingId === search.id ? (
                    <div className="flex items-center gap-1.5 mb-1">
                      <Input
                        className="h-7 text-sm py-0"
                        value={editingName}
                        onChange={e => setEditingName(e.target.value)}
                        onKeyDown={e => {
                          if (e.key === 'Enter') saveEdit(search.id);
                          if (e.key === 'Escape') cancelEdit();
                        }}
                        autoFocus
                      />
                      <Button variant="ghost" size="icon" className="h-7 w-7 shrink-0 text-green-600 hover:text-green-700" onClick={() => saveEdit(search.id)}>
                        <Check className="w-3.5 h-3.5" />
                      </Button>
                      <Button variant="ghost" size="icon" className="h-7 w-7 shrink-0" onClick={cancelEdit}>
                        <X className="w-3.5 h-3.5" />
                      </Button>
                    </div>
                  ) : (
                    <div className="flex items-center gap-1.5 mb-1">
                      <p className="font-medium text-sm truncate">{search.name}</p>
                      {onRename && (
                        <Button variant="ghost" size="icon" className="h-5 w-5 shrink-0 opacity-40 hover:opacity-100" onClick={() => startEdit(search)}>
                          <Pencil className="w-3 h-3" />
                        </Button>
                      )}
                    </div>
                  )}
                  <div className="flex flex-wrap items-center gap-2">
                    <StatusBadge status={search.status} />
                    {search.results_count > 0 && (
                      <span className="text-xs text-muted-foreground">
                        {search.results_count} résultat{search.results_count > 1 ? 's' : ''}
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
                <div className="flex flex-col items-end gap-1.5 shrink-0">
                  <span className="text-xs text-muted-foreground whitespace-nowrap">
                    {formatDistanceToNow(new Date(search.created_at), { addSuffix: true, locale: fr })}
                  </span>
                  <div className="flex items-center gap-1">
                    {search.status === 'completed' && search.results_count > 0 && onViewResults && (
                      <Button
                        variant="outline"
                        size="sm"
                        className="h-7 text-xs gap-1"
                        onClick={() => onViewResults(search)}
                      >
                        <Eye className="w-3 h-3" />
                        Voir
                      </Button>
                    )}
                    {onDelete && (
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-7 w-7 text-muted-foreground hover:text-destructive"
                        onClick={() => onDelete(search.id)}
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </Button>
                    )}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
