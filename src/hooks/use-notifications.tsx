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

    console.log('🔍 Fetching notifications for user:', user.id);

    try {
      // Load user notification preferences
      const { data: preferencesData } = await supabase
        .from('notification_preferences')
        .select('*')
        .eq('user_id', user.id);

      const prefsMap = new Map(
        preferencesData?.map(pref => [
          `${pref.category}${pref.subcategory ? `-${pref.subcategory}` : ''}`,
          pref.enabled
        ]) || []
      );
      // Fetch all tickets with unread messages
      const { data: tickets } = await supabase
        .from('tickets')
        .select('id, category, subcategory')
        .eq('user_id', user.id)
        .in('status', ['open', 'in_progress']);

      // Fetch all unread alerts counts by category
      const categories = [
        'produits', 'expedition', 'informations', 'communaute', 'marketplace'
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
            // Check user preferences for this alert
            const prefKey = `${category}${alert.subcategory ? `-${alert.subcategory}` : ''}`;
            const isEnabled = prefsMap.get(prefKey) !== false; // Default to enabled if no preference
            
            if (!isEnabled) {
              console.log(`Alert ${alert.id} (${category}/${alert.subcategory}) is DISABLED by user preferences`);
              continue; // Skip this alert
            }

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
              console.log(`Alert ${alert.id} (${alert.subcategory}) is UNREAD for user`);
              if (!counts[category]) {
                counts[category] = { total: 0, subcategories: {} };
              }
              
              counts[category].total += 1;
              
              if (alert.subcategory) {
                counts[category].subcategories[alert.subcategory] = 
                  (counts[category].subcategories[alert.subcategory] || 0) + 1;
              }
            } else {
              console.log(`Alert ${alert.id} (${alert.subcategory}) is READ for user`);
            }
          }
        }
      }

      setNotifications(counts);
      console.log('📊 Notifications updated:', counts);
    } catch (error) {
      console.error('Error fetching notifications:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const markAsRead = async (category: string, subcategory?: string) => {
    if (!user) return;

    console.log(`🔄 markAsRead called for category: ${category}, subcategory: ${subcategory}`);

    try {
      // Mark alerts as read
      const { error: alertError } = await supabase.rpc('mark_alerts_as_read', {
        category_param: category,
        subcategory_param: subcategory || null
      });

      if (alertError) {
        console.error('❌ Error in mark_alerts_as_read RPC:', alertError);
        throw alertError;
      }
      
      console.log('✅ Alerts marked as read successfully');

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

      // Refresh notifications after a small delay to ensure DB sync
      console.log('⏳ Waiting 500ms before refreshing...');
      await new Promise(resolve => setTimeout(resolve, 500));
      console.log('🔄 Refreshing notifications now...');
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
      console.log('🔄 Received refreshNotifications event, fetching...');
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
