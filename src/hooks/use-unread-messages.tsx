import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from './use-auth';

export const useUnreadMessages = () => {
  const { user } = useAuth();
  const [unreadCount, setUnreadCount] = useState(0);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!user) {
      setUnreadCount(0);
      setIsLoading(false);
      return;
    }

    const loadUnreadCount = async () => {
      try {
        // Get all user's tickets
        const { data: tickets, error: ticketsError } = await supabase
          .from('tickets')
          .select('id')
          .eq('user_id', user.id);

        if (ticketsError) throw ticketsError;

        if (!tickets || tickets.length === 0) {
          setUnreadCount(0);
          setIsLoading(false);
          return;
        }

        // Get unread count for each ticket and sum them
        let totalUnread = 0;
        for (const ticket of tickets) {
          const { data: count } = await supabase
            .rpc('get_unread_count', {
              ticket_id_param: ticket.id,
              user_id_param: user.id
            });
          totalUnread += (count || 0);
        }

        setUnreadCount(totalUnread);
      } catch (error) {
        console.error('Error loading unread count:', error);
        setUnreadCount(0);
      } finally {
        setIsLoading(false);
      }
    };

    loadUnreadCount();

    // Listen for new messages
    const channel = supabase
      .channel('unread-messages-count')
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'messages'
        },
        () => {
          loadUnreadCount();
        }
      )
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'message_read_status'
        },
        () => {
          loadUnreadCount();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [user]);

  return { unreadCount, isLoading };
};
