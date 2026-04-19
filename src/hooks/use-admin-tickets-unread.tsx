import { useState, useEffect, useRef, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from './use-auth';
import { useAdmin } from './use-admin';

export const useAdminTicketsUnread = () => {
  const { user } = useAuth();
  const { isAdmin, isLoading: isAdminLoading } = useAdmin();
  const [unreadCount, setUnreadCount] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const fetchUnreadCount = useCallback(async () => {
    if (!user || !isAdmin) {
      setUnreadCount(0);
      setIsLoading(false);
      return;
    }

    try {
      // 1) Get all open/in_progress ticket IDs (lightweight)
      const { data: tickets, error: ticketsError } = await supabase
        .from('tickets')
        .select('id')
        .in('status', ['open', 'in_progress']);

      if (ticketsError) {
        console.error('Error fetching tickets:', ticketsError);
        setIsLoading(false);
        return;
      }

      const ticketIds = (tickets ?? []).map(t => t.id);
      if (ticketIds.length === 0) {
        setUnreadCount(0);
        setIsLoading(false);
        return;
      }

      // 2) Fetch all messages for these tickets that are NOT from the admin (id only)
      const { data: msgs, error: msgsError } = await supabase
        .from('messages')
        .select('id')
        .in('ticket_id', ticketIds)
        .neq('user_id', user.id);

      if (msgsError) {
        console.error('Error fetching messages:', msgsError);
        setIsLoading(false);
        return;
      }

      const messageIds = (msgs ?? []).map(m => m.id);
      if (messageIds.length === 0) {
        setUnreadCount(0);
        setIsLoading(false);
        return;
      }

      // 3) Fetch read statuses for these messages in a single query
      const { data: reads, error: readsError } = await supabase
        .from('message_read_status')
        .select('message_id')
        .eq('user_id', user.id)
        .eq('is_read', true)
        .in('message_id', messageIds);

      if (readsError) {
        console.error('Error fetching read statuses:', readsError);
        setIsLoading(false);
        return;
      }

      const readSet = new Set((reads ?? []).map(r => r.message_id));
      const unread = messageIds.filter(id => !readSet.has(id)).length;
      setUnreadCount(unread);
    } catch (error) {
      console.error('Error fetching admin tickets unread count:', error);
    } finally {
      setIsLoading(false);
    }
  }, [user, isAdmin]);

  const debouncedFetch = useCallback(() => {
    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => {
      fetchUnreadCount();
    }, 2000);
  }, [fetchUnreadCount]);

  useEffect(() => {
    if (!user || isAdminLoading) return;
    if (!isAdmin) {
      setUnreadCount(0);
      setIsLoading(false);
      return;
    }

    fetchUnreadCount();

    const channel = supabase
      .channel('admin-tickets-unread')
      .on(
        'postgres_changes',
        { event: 'INSERT', schema: 'public', table: 'messages' },
        () => debouncedFetch()
      )
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'message_read_status' },
        () => debouncedFetch()
      )
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'tickets' },
        () => debouncedFetch()
      )
      .subscribe();

    return () => {
      if (debounceRef.current) clearTimeout(debounceRef.current);
      supabase.removeChannel(channel);
    };
  }, [user, isAdmin, isAdminLoading, fetchUnreadCount, debouncedFetch]);

  return { unreadCount, isLoading, refresh: fetchUnreadCount };
};
