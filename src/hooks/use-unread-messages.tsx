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
        const { data, error } = await supabase
          .rpc('get_all_unread_messages_count' as any, {
            user_id_param: user.id
          });

        if (error) throw error;

        setUnreadCount(data || 0);
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
