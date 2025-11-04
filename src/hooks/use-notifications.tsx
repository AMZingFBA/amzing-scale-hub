import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from './use-auth';
import { Capacitor } from '@capacitor/core';
import { Badge } from '@capawesome/capacitor-badge';

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
      // Appeler la fonction SQL optimisée qui calcule tout en une seule requête
      const { data, error } = await supabase
        .rpc('get_all_notification_counts', {
          user_id_param: user.id
        });

      if (error) {
        console.error('Error fetching notifications:', error);
        return;
      }

      console.log('📊 Final notification counts:', JSON.stringify(data, null, 2));
      setNotifications((data as unknown as NotificationCounts) || {});
      console.log('📊 Notifications updated:', data);
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

      // Refresh notifications immediately
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

  // RESET BADGE SIMPLE - Quand l'app s'ouvre → badge iOS = 0
  useEffect(() => {
    const isNative = Capacitor.isNativePlatform();
    
    if (!isNative || !user) {
      return;
    }

    const resetBadgeSimple = async () => {
      try {
        console.log('🔄 RESET BADGE - User:', user.id);
        
        // 1. Reset iOS badge IMMÉDIATEMENT
        if (Badge && Badge.set) {
          await Badge.set({ count: 0 });
          console.log('✅ Badge iOS → 0');
        }

        // 2. Reset compteur en DB
        const { error } = await supabase.rpc('reset_user_badge', {
          user_id_param: user.id
        });

        if (error) {
          console.error('❌ Erreur reset DB:', error);
        } else {
          console.log('✅ Badge DB → 0');
        }
      } catch (error) {
        console.error('❌ Erreur reset badge:', error);
      }
    };

    // Reset au montage
    resetBadgeSimple();

    // Reset quand l'app revient au premier plan
    const handleVisibilityChange = () => {
      if (!document.hidden) {
        console.log('📱 App visible → reset badge');
        resetBadgeSimple();
      }
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);

    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, [user]);

  return { notifications, isLoading, markAsRead, loadNotifications: fetchNotifications };
};
