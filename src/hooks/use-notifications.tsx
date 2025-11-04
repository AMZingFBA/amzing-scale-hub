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

  // RESET BADGE - EXECUTÉ À CHAQUE OUVERTURE ET DE MANIÈRE SYNCHRONE
  useEffect(() => {
    const isNative = Capacitor.isNativePlatform();
    const platform = Capacitor.getPlatform();
    
    console.log('🔍 Badge reset hook - Platform check:', {
      isNative,
      platform,
      hasCapacitor: !!Capacitor,
      hasBadge: !!Badge,
      hasUser: !!user,
      userId: user?.id
    });
    
    // Vérifier si on est sur iOS ou Android (natif)
    if (!isNative && platform !== 'ios' && platform !== 'android') {
      console.log('⚠️ Pas une plateforme native - reset ignoré', { platform, isNative });
      return;
    }
    
    if (!user) {
      console.log('⚠️ Pas d\'utilisateur - reset ignoré');
      return;
    }

    const resetBadge = async () => {
      const timestamp = new Date().toISOString();
      console.log(`🔄 [${timestamp}] DÉBUT RESET BADGE pour user ${user.id}`);
      
      try {
        // Vérifier que Badge est disponible
        if (!Badge || !Badge.set) {
          console.error('❌ Badge API non disponible');
          return;
        }

        // 1. Reset badge iOS EN PREMIER (synchrone, immédiat)
        console.log('📱 Reset badge iOS IMMÉDIAT...');
        await Badge.set({ count: 0 });
        console.log('✅ Badge iOS = 0');

        // 2. PUIS reset dans la base de données
        console.log('📤 Appel reset_user_badge...');
        const { error: dbError } = await supabase.rpc('reset_user_badge', {
          user_id_param: user.id
        });
        
        if (dbError) {
          console.error('❌ ERREUR reset DB:', dbError);
          throw dbError;
        }
        
        console.log('✅ Compteur DB = 0');
        console.log(`✅ [${timestamp}] RESET TERMINÉ - Prochaine notif doit être badge=1`);
      } catch (error) {
        console.error('❌ ERREUR critique lors du reset:', error);
      }
    };

    // Reset IMMÉDIAT ET SYNCHRONE au montage
    console.log('🚀 Exécution reset initial SYNCHRONE...');
    
    // Vérifier que Badge est disponible avant de l'utiliser
    if (Badge && Badge.set) {
      // Forcer le reset iOS IMMÉDIATEMENT de manière synchrone
      Badge.set({ count: 0 }).then(() => {
        console.log('✅ Badge iOS mis à 0 de manière synchrone');
      }).catch((error) => {
        console.error('❌ Erreur lors du reset synchrone:', error);
      });
    } else {
      console.error('❌ Badge API non disponible pour reset synchrone');
    }
    
    // Puis faire le reset complet
    resetBadge();
    
    // Reset à CHAQUE retour au premier plan
    const handleVisibilityChange = () => {
      console.log('👁️ Visibility change event:', { hidden: document.hidden });
      
      if (!document.hidden) {
        console.log('📱 App revenue visible - DÉCLENCHEMENT RESET');
        // Reset iOS immédiat
        Badge.set({ count: 0 });
        resetBadge();
      }
    };

    // Ajouter aussi un listener pour l'événement resume de Capacitor
    const handleAppResume = () => {
      console.log('📱 App resume event - DÉCLENCHEMENT RESET');
      // Reset iOS immédiat
      Badge.set({ count: 0 });
      resetBadge();
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);
    
    // Écouter aussi l'événement resume si disponible
    if (typeof window !== 'undefined') {
      window.addEventListener('resume', handleAppResume);
    }

    return () => {
      console.log('🧹 Nettoyage listeners badge reset');
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      if (typeof window !== 'undefined') {
        window.removeEventListener('resume', handleAppResume);
      }
    };
  }, [user]);

  return { notifications, isLoading, markAsRead, loadNotifications: fetchNotifications };
};
