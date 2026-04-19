import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from './use-auth';

export const useAdmin = () => {
  const { user } = useAuth();
  const [isAdmin, setIsAdmin] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;

    const checkAdminStatus = async () => {
      if (!user) {
        if (!isMounted) return;
        setIsAdmin(false);
        setIsLoading(false);
        return;
      }

      if (isMounted) {
        setIsLoading(true);
      }

      try {
        const result = await Promise.race([
          supabase
            .from('user_roles')
            .select('role')
            .eq('user_id', user.id)
            .eq('role', 'admin')
            .maybeSingle(),
          new Promise<never>((_, reject) =>
            setTimeout(() => reject(new Error('admin-check-timeout')), 5000)
          ),
        ]);

        const { data, error } = result;

        if (error && error.code !== 'PGRST116') {
          console.error('Error checking admin status:', error);
        }

        if (!isMounted) return;
        setIsAdmin(!!data);
      } catch (error) {
        console.error('Error checking admin status:', error);
        if (!isMounted) return;
        setIsAdmin(false);
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    };

    checkAdminStatus();

    return () => {
      isMounted = false;
    };
  }, [user]);

  return { isAdmin, isLoading };
};
