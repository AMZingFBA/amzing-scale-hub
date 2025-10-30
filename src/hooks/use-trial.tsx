import { useState } from 'react';
import { useAuth } from './use-auth';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { useNavigate } from 'react-router-dom';

// Fonction pour détecter si on est sur une app mobile Capacitor
const isNativePlatform = () => {
  // Vérifier si Capacitor existe et si on est sur une plateforme native
  if (typeof window !== 'undefined' && (window as any).Capacitor) {
    return (window as any).Capacitor.isNativePlatform();
  }
  return false;
};

export const useTrial = () => {
  const [isStarting, setIsStarting] = useState(false);
  const { user } = useAuth();
  const navigate = useNavigate();

  const startFreeTrial = async () => {
    if (!user) {
      navigate('/auth');
      return;
    }

    setIsStarting(true);
    try {
      // Si c'est l'app mobile, afficher un message pour utiliser Apple Pay
      if (isNativePlatform()) {
        toast.info('Veuillez utiliser l\'option de paiement Apple Pay dans l\'application mobile');
        setIsStarting(false);
        return;
      }

      // Sur le web, créer une session de paiement Stripe
      console.log('Creating Stripe checkout session...');
      const { data, error } = await supabase.functions.invoke('create-checkout', {
        headers: {
          Authorization: `Bearer ${(await supabase.auth.getSession()).data.session?.access_token}`,
        },
      });

      if (error) {
        console.error('Error creating checkout:', error);
        throw error;
      }

      if (data?.url) {
        console.log('Redirecting to Stripe checkout:', data.url);
        // Ouvrir Stripe Checkout dans un nouvel onglet
        window.open(data.url, '_blank');
        toast.success('Redirection vers le paiement sécurisé Stripe...');
      } else {
        throw new Error('No checkout URL received');
      }
    } catch (error: any) {
      console.error('Error starting trial:', error);
      toast.error('Erreur lors de la redirection vers le paiement');
    } finally {
      setIsStarting(false);
    }
  };

  return {
    startFreeTrial,
    isStarting,
  };
};
