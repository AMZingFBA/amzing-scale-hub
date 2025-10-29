import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from './use-auth';

interface SubcategoryNotifications {
  [subcategory: string]: number;
}

interface CategoryNotifications {
  total: number;
  subcategories: SubcategoryNotifications;
}

interface NotificationCounts {
  [category: string]: CategoryNotifications;
}

export const useNotifications = () => {
  const { user } = useAuth();
  const [notifications, setNotifications] = useState<NotificationCounts>({});
  const [isLoading, setIsLoading] = useState(true);

  const fetchNotifications = async () => {
    if (!user) return;

    try {
      // Fetch all tickets with unread messages
      const { data: tickets } = await supabase
        .from('tickets')
        .select('id, category, subcategory')
        .eq('user_id', user.id)
        .in('status', ['open', 'in_progress']);

      // Fetch all unread alerts counts by category
      const categories = [
        'introduction', 'outils', 'produits', 'expedition', 
        'informations', 'communaute', 'marketplace', 'gestion_produit'
      ];

      const counts: NotificationCounts = {};

      // Count unread ticket messages
      if (tickets && tickets.length > 0) {
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
              counts[category] = { total: 0, subcategories: {} };
            }

            counts[category].total += count;
            counts[category].subcategories[subcategory] = 
              (counts[category].subcategories[subcategory] || 0) + count;
          }
        }
      }

      // Count unread alerts for each category with subcategory details
      for (const category of categories) {
        // Get all alerts for this category with their subcategories
        const { data: unreadAlerts } = await supabase
          .from('admin_alerts')
          .select('id, subcategory')
          .eq('category', category);

        if (unreadAlerts && unreadAlerts.length > 0) {
          for (const alert of unreadAlerts) {
            // Check if this specific alert is unread for this user
            const { data: isRead } = await supabase
              .from('alert_read_status')
              .select('is_read')
              .eq('alert_id', alert.id)
              .eq('user_id', user.id)
              .eq('is_read', true)
              .maybeSingle();

            // If not marked as read, count it
            if (!isRead) {
              if (!counts[category]) {
                counts[category] = { total: 0, subcategories: {} };
              }
              
              counts[category].total += 1;
              
              if (alert.subcategory) {
                counts[category].subcategories[alert.subcategory] = 
                  (counts[category].subcategories[alert.subcategory] || 0) + 1;
              }
            }
          }
        }
      }

      setNotifications(counts);
    } catch (error) {
      console.error('Error fetching notifications:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const markAsRead = async (category: string, subcategory?: string) => {
    if (!user) return;

    try {
      // Mark alerts as read
      await supabase.rpc('mark_alerts_as_read', {
        category_param: category,
        subcategory_param: subcategory || null
      });

      // Mark ticket messages as read if there are any
      const { data: tickets } = await supabase
        .from('tickets')
        .select('id')
        .eq('user_id', user.id)
        .eq('category', category)
        .eq('subcategory', subcategory || '')
        .in('status', ['open', 'in_progress']);

      if (tickets && tickets.length > 0) {
        for (const ticket of tickets) {
          await supabase.rpc('mark_ticket_messages_as_read', {
            ticket_id_param: ticket.id
          });
        }
      }

      // Refresh notifications
      await fetchNotifications();
    } catch (error) {
      console.error('Error marking as read:', error);
    }
  };

  useEffect(() => {
    if (!user) {
      setIsLoading(false);
      return;
    }

    fetchNotifications();

    // Listen for manual refresh events
    const handleRefresh = () => {
      fetchNotifications();
    };
    window.addEventListener('refreshNotifications', handleRefresh);

    // Subscribe to changes
    const channel = supabase
      .channel('notifications-changes')
      .on(
        'postgres_changes',
        { event: 'INSERT', schema: 'public', table: 'admin_alerts' },
        () => fetchNotifications()
      )
      .on(
        'postgres_changes',
        { event: 'INSERT', schema: 'public', table: 'messages' },
        () => fetchNotifications()
      )
      .on(
        'postgres_changes',
        { event: 'UPDATE', schema: 'public', table: 'alert_read_status' },
        () => fetchNotifications()
      )
      .on(
        'postgres_changes',
        { event: 'INSERT', schema: 'public', table: 'alert_read_status' },
        () => fetchNotifications()
      )
      .on(
        'postgres_changes',
        { event: 'UPDATE', schema: 'public', table: 'message_read_status' },
        () => fetchNotifications()
      )
      .on(
        'postgres_changes',
        { event: 'INSERT', schema: 'public', table: 'message_read_status' },
        () => fetchNotifications()
      )
      .subscribe();

    return () => {
      window.removeEventListener('refreshNotifications', handleRefresh);
      supabase.removeChannel(channel);
    };
  }, [user]);

  return { notifications, isLoading, markAsRead };
};
