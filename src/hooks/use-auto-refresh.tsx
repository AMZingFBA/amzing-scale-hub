import { useEffect } from 'react';
import { Capacitor } from '@capacitor/core';

interface UseAutoRefreshOptions {
  enabled?: boolean;
  interval?: number; // en millisecondes
}

export const useAutoRefresh = (
  onRefresh: () => Promise<void> | void,
  options: UseAutoRefreshOptions = {}
) => {
  // Sur mobile, rafraîchir moins souvent pour économiser batterie et data
  const isNative = Capacitor.isNativePlatform();
  const defaultInterval = isNative ? 120000 : 60000; // 120s sur mobile, 60s sur web
  const { enabled = true, interval = defaultInterval } = options;

  useEffect(() => {
    if (!enabled) return;

    const intervalId = setInterval(() => {
      onRefresh();
    }, interval);

    return () => clearInterval(intervalId);
  }, [onRefresh, enabled, interval]);
};
