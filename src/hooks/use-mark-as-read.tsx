import { useEffect } from 'react';
import { useNotifications } from './use-notifications';

interface UseMarkAsReadProps {
  category: string;
  subcategory?: string;
}

export const useMarkAsRead = ({ category, subcategory }: UseMarkAsReadProps) => {
  const { markAsRead } = useNotifications();

  useEffect(() => {
    // Mark as read when component mounts (user visits the page)
    const timer = setTimeout(() => {
      markAsRead(category, subcategory);
    }, 1000); // Small delay to ensure user actually views the page

    return () => clearTimeout(timer);
  }, [category, subcategory, markAsRead]);
};
