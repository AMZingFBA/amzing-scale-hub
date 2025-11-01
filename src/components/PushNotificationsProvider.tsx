import { useEffect } from 'react';
import { usePushNotifications } from '@/hooks/use-push-notifications';

export const PushNotificationsProvider = ({ children }: { children: React.ReactNode }) => {
  // Initialiser les notifications push
  usePushNotifications();
  
  return <>{children}</>;
};
