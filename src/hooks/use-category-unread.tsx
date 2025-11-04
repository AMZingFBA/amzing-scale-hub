import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from './use-auth';

interface CategoryUnreadCounts {
  [category: string]: {
    total: number;
    subcategories: {
      [subcategory: string]: number;
    };
  };
}

export const useCategoryUnread = () => {
  const { user } = useAuth();
  const [unreadCounts, setUnreadCounts] = useState<CategoryUnreadCounts>({});
  const [isLoading, setIsLoading] = useState(true);

  const fetchUnreadCounts = async () => {
    if (!user) return;

    try {
      // Appeler la fonction SQL optimisée
      const { data, error } = await supabase
        .rpc('get_category_unread_counts' as any, {
          user_id_param: user.id
        });

      if (error) {
        console.error('Error fetching category unread counts:', error);
        return;
      }

      setUnreadCounts((data as unknown as CategoryUnreadCounts) || {});
    } catch (error) {
      console.error('Error in fetchUnreadCounts:', error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (!user) {
      setIsLoading(false);
      return;
    }

    fetchUnreadCounts();

    // Subscribe to message changes
    const messageChannel = supabase
      .channel('category-messages-changes')
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'messages'
        },
        () => {
          fetchUnreadCounts();
        }
      )
      .on(
        'postgres_changes',
        {
          event: 'UPDATE',
          schema: 'public',
          table: 'message_read_status'
        },
        () => {
          fetchUnreadCounts();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(messageChannel);
    };
  }, [user]);

  return { unreadCounts, isLoading };
};
