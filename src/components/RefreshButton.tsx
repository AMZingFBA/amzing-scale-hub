import { RefreshCw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

interface RefreshButtonProps {
  onRefresh: () => void;
  isRefreshing: boolean;
  className?: string;
}

export const RefreshButton = ({ onRefresh, isRefreshing, className }: RefreshButtonProps) => {
  return (
    <Button
      onClick={onRefresh}
      disabled={isRefreshing}
      variant="outline"
      size="icon"
      className={cn(
        "shrink-0 shadow-lg hover:shadow-xl transition-all",
        isRefreshing && "opacity-50 cursor-not-allowed",
        className
      )}
      aria-label="Rafraîchir"
    >
      <RefreshCw 
        className={cn(
          "w-5 h-5",
          isRefreshing && "animate-spin"
        )} 
      />
    </Button>
  );
};
