import { useEffect } from 'react';

interface UseAutoRefreshOptions {
  enabled?: boolean;
  interval?: number; // en millisecondes
}

export const useAutoRefresh = (
  onRefresh: () => Promise<void> | void,
  options: UseAutoRefreshOptions = {}
) => {
  const { enabled = true, interval = 30000 } = options; // 30 secondes par défaut

  useEffect(() => {
    if (!enabled) return;

    const intervalId = setInterval(() => {
      onRefresh();
    }, interval);

    return () => clearInterval(intervalId);
  }, [onRefresh, enabled, interval]);
};
