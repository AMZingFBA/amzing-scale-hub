import { useState, useCallback } from 'react';
import { Capacitor } from '@capacitor/core';

export const usePullRefresh = (onRefresh: () => Promise<void>) => {
  const [isRefreshing, setIsRefreshing] = useState(false);
  const isNative = Capacitor.isNativePlatform();

  const handleRefresh = useCallback(async () => {
    if (isRefreshing) return;
    
    setIsRefreshing(true);
    try {
      await onRefresh();
    } finally {
      setIsRefreshing(false);
    }
  }, [onRefresh, isRefreshing]);

  return {
    isRefreshing,
    handleRefresh,
    isNative
  };
};
