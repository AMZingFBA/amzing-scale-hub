import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/use-auth';
import { toast } from 'sonner';

export const useSuiteCheckout = () => {
  const [isLoading, setIsLoading] = useState(false);
  const { user } = useAuth();
  const navigate = useNavigate();

  const startCheckout = async () => {
    if (!user) {
      toast.error("Veuillez vous connecter pour continuer");
      navigate('/auth?redirect=/suite');
      return;
    }

    setIsLoading(true);
    
    try {
      const { data, error } = await supabase.functions.invoke('create-suite-checkout');
      
      if (error) {
        console.error('Checkout error:', error);
        toast.error("Erreur lors de la création du checkout");
        return;
      }

      if (data?.url) {
        window.location.href = data.url;
      } else {
        toast.error("Erreur: URL de paiement non reçue");
      }
    } catch (error) {
      console.error('Checkout error:', error);
      toast.error("Erreur lors de la création du checkout");
    } finally {
      setIsLoading(false);
    }
  };

  return {
    startCheckout,
    isLoading,
  };
};
