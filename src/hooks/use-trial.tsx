import { useState } from 'react';
import { useAuth } from './use-auth';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { useNavigate } from 'react-router-dom';

export const useTrial = () => {
  const [isStarting, setIsStarting] = useState(false);
  const { user, refreshSubscription } = useAuth();
  const navigate = useNavigate();

  const startFreeTrial = async () => {
    if (!user) {
      navigate('/auth');
      return;
    }

    setIsStarting(true);
    try {
      // Calculate expiration date (15 days from now)
      const expiresAt = new Date();
      expiresAt.setDate(expiresAt.getDate() + 15);

      // Update subscription to VIP with trial period
      const { error } = await supabase
        .from('subscriptions')
        .update({
          plan_type: 'vip',
          status: 'active',
          expires_at: expiresAt.toISOString(),
        })
        .eq('user_id', user.id);

      if (error) throw error;

      await refreshSubscription();
      toast.success('🎉 Essai gratuit activé ! Profitez de 15 jours d\'accès VIP');
      navigate('/dashboard');
    } catch (error: any) {
      console.error('Error starting trial:', error);
      toast.error('Erreur lors de l\'activation de l\'essai gratuit');
    } finally {
      setIsStarting(false);
    }
  };

  return {
    startFreeTrial,
    isStarting,
  };
};
