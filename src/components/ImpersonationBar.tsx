import { Eye, Clock, RefreshCw, X, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/hooks/use-auth';
import { useState } from 'react';

const ImpersonationBar = () => {
  const { 
    isImpersonating, 
    impersonatedUser, 
    impersonatedSubscription,
    impersonationTimeRemaining, 
    stopImpersonation, 
    refreshImpersonation 
  } = useAuth();
  const [refreshing, setRefreshing] = useState(false);

  if (!isImpersonating || !impersonatedUser) return null;

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const handleRefresh = async () => {
    setRefreshing(true);
    await refreshImpersonation();
    setRefreshing(false);
  };

  const isVIP = impersonatedSubscription?.plan_type === 'vip' && 
                impersonatedSubscription?.status === 'active';

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-amber-500 text-black z-[9999] shadow-lg">
      <div className="max-w-7xl mx-auto px-4 py-2 flex items-center justify-between gap-4">
        <div className="flex items-center gap-3 min-w-0">
          <Eye className="w-4 h-4 shrink-0" />
          <span className="text-sm font-medium truncate">
            Vue: <strong>{impersonatedUser.full_name || impersonatedUser.email}</strong>
            {isVIP && <span className="ml-2 bg-black/20 px-2 py-0.5 rounded text-xs">VIP</span>}
            {!isVIP && <span className="ml-2 bg-black/20 px-2 py-0.5 rounded text-xs">Gratuit</span>}
          </span>
        </div>
        
        <div className="flex items-center gap-3 shrink-0">
          <div className={`flex items-center gap-1 text-sm ${impersonationTimeRemaining <= 60 ? 'font-bold animate-pulse' : ''}`}>
            <Clock className="w-4 h-4" />
            <span className="font-mono">{formatTime(impersonationTimeRemaining)}</span>
          </div>
          
          <Button
            size="sm"
            variant="ghost"
            onClick={handleRefresh}
            disabled={refreshing}
            className="h-7 px-2 hover:bg-black/10"
          >
            {refreshing ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <RefreshCw className="w-4 h-4" />
            )}
          </Button>
          
          <Button
            size="sm"
            variant="ghost"
            onClick={stopImpersonation}
            className="h-7 px-2 hover:bg-black/10"
          >
            <X className="w-4 h-4" />
          </Button>
        </div>
      </div>
      
      {/* Progress bar */}
      <div className="h-1 bg-amber-600">
        <div 
          className="h-full bg-black/30 transition-all duration-1000"
          style={{ width: `${Math.min(100, (impersonationTimeRemaining / 300) * 100)}%` }}
        />
      </div>
    </div>
  );
};

export default ImpersonationBar;
