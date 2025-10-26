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
      // Fetch all tickets for categories: introduction, outils, expedition, informations
      const { data: tickets, error } = await supabase
        .from('tickets')
        .select('id, category, subcategory')
        .eq('user_id', user.id)
        .in('category', ['introduction', 'outils', 'expedition', 'informations'])
        .in('status', ['open', 'in_progress']);

      if (error) {
        console.error('Error fetching tickets:', error);
        return;
      }

      if (!tickets || tickets.length === 0) {
        setUnreadCounts({});
        return;
      }

      // Get unread count for each ticket
      const counts: CategoryUnreadCounts = {};
      
      for (const ticket of tickets) {
        const { data: unreadCount } = await supabase
          .rpc('get_unread_count', {
            ticket_id_param: ticket.id,
            user_id_param: user.id
          });

        const count = unreadCount || 0;
        
        if (count > 0) {
          const category = ticket.category || 'general';
          const subcategory = ticket.subcategory || 'general';

          if (!counts[category]) {
            counts[category] = {
              total: 0,
              subcategories: {}
            };
          }

          counts[category].total += count;
          counts[category].subcategories[subcategory] = 
            (counts[category].subcategories[subcategory] || 0) + count;
        }
      }

      setUnreadCounts(counts);
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
