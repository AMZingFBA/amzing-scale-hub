import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from './use-auth';
import { useAdmin } from './use-admin';

export const useAdminTicketsUnread = () => {
  const { user } = useAuth();
  const { isAdmin } = useAdmin();
  const [unreadCount, setUnreadCount] = useState(0);
  const [isLoading, setIsLoading] = useState(true);

  const fetchUnreadCount = async () => {
    if (!user || !isAdmin) {
      setUnreadCount(0);
      setIsLoading(false);
      return;
    }

    try {
      // Get all open/in_progress tickets
      const { data: tickets, error: ticketsError } = await supabase
        .from('tickets')
        .select('id')
        .in('status', ['open', 'in_progress']);

      if (ticketsError) {
        console.error('Error fetching tickets:', ticketsError);
        setIsLoading(false);
        return;
      }

      if (!tickets || tickets.length === 0) {
        setUnreadCount(0);
        setIsLoading(false);
        return;
      }

      // Count unread messages for each ticket
      let totalUnread = 0;
      for (const ticket of tickets) {
        const { data: countData } = await supabase
          .rpc('get_unread_count', { 
            ticket_id_param: ticket.id, 
            user_id_param: user.id 
          });
        totalUnread += countData || 0;
      }

      setUnreadCount(totalUnread);
    } catch (error) {
      console.error('Error fetching admin tickets unread count:', error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (!user || !isAdmin) {
      setIsLoading(false);
      return;
    }

    fetchUnreadCount();

    // Subscribe to new messages
    const channel = supabase
      .channel('admin-tickets-unread')
      .on(
        'postgres_changes',
        { event: 'INSERT', schema: 'public', table: 'messages' },
        () => {
          console.log('📩 New message detected, refreshing admin unread count');
          fetchUnreadCount();
        }
      )
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'message_read_status' },
        () => {
          fetchUnreadCount();
        }
      )
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'tickets' },
        () => {
          fetchUnreadCount();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [user, isAdmin]);

  return { unreadCount, isLoading, refresh: fetchUnreadCount };
};
