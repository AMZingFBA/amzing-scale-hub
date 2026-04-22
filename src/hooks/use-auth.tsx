import { createContext, useContext, useEffect, useState } from 'react';
import { User, Session } from '@supabase/supabase-js';
import { supabase } from '@/integrations/supabase/client';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';

interface Subscription {
  plan_type: 'free' | 'vip';
  status: 'active' | 'inactive' | 'canceled' | 'cancelled' | 'expired';
  expires_at: string | null;
  is_trial?: boolean;
}

interface AuthContextType {
  user: User | null;
  session: Session | null;
  subscription: Subscription | null;
  isVIP: boolean;
  isLoading: boolean;
  signUp: (email: string, password: string, fullName: string, nickname: string, phone: string) => Promise<{ error: any }>;
  signIn: (email: string, password: string) => Promise<{ error: any }>;
  signOut: () => Promise<void>;
  refreshSubscription: () => Promise<void>;
  // Admin impersonation - check if we have an original admin session stored
  hasOriginalAdminSession: boolean;
  returnToAdminSession: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [subscription, setSubscription] = useState<Subscription | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [hasOriginalAdminSession, setHasOriginalAdminSession] = useState(false);
  const navigate = useNavigate();

  const isVIP = subscription?.plan_type === 'vip' && 
    (subscription?.status === 'active' || subscription?.status === 'canceled') &&
    (!subscription?.expires_at || new Date(subscription.expires_at) > new Date());

  const fetchSubscription = async (userId: string) => {
    try {
      const result = await Promise.race([
        supabase
          .from('subscriptions')
          .select('plan_type, status, expires_at, is_trial')
          .eq('user_id', userId)
          .single(),
        new Promise<never>((_, reject) => setTimeout(() => reject(new Error('timeout')), 5000))
      ]);

      if (result.error) throw result.error;
      setSubscription(result.data as Subscription);
    } catch (error) {
      console.error('Error fetching subscription:', error);
      setSubscription({ plan_type: 'free', status: 'active', expires_at: null, is_trial: false });
    }
  };

  const refreshSubscription = async () => {
    if (user) {
      await fetchSubscription(user.id);
    }
  };

  const syncToAirtable = async (userId: string, email: string) => {
    try {
      const { data: profile } = await supabase
        .from('profiles')
        .select('full_name, nickname, phone, siren, company_name')
        .eq('id', userId)
        .single();
      
      const { data: sub } = await supabase
        .from('subscriptions')
        .select('plan_type, status, started_at, expires_at, stripe_customer_id, stripe_subscription_id')
        .eq('user_id', userId)
        .single();
      
      const { error } = await supabase.functions.invoke('sync-user-to-airtable', {
        body: {
          user: {
            email,
            full_name: profile?.full_name,
            nickname: profile?.nickname,
            phone: profile?.phone,
            siren: profile?.siren,
            company_name: profile?.company_name,
            plan_type: sub?.plan_type || 'free',
            status: sub?.status || 'active',
            started_at: sub?.started_at,
            expires_at: sub?.expires_at,
            stripe_customer_id: sub?.stripe_customer_id,
            stripe_subscription_id: sub?.stripe_subscription_id,
          },
        },
      });
      
      if (error) {
        console.error('[Auth] Airtable sync error:', error);
      } else {
        console.log('[Auth] User synced to Airtable on login');
      }
    } catch (error) {
      console.error('[Auth] Failed to sync to Airtable:', error);
    }
  };

  // Check for stored admin session on mount
  useEffect(() => {
    const storedSession = localStorage.getItem('admin_original_session');
    setHasOriginalAdminSession(!!storedSession);
  }, []);

  useEffect(() => {
    let initialSessionHandled = false;
    let lastSyncedUserId: string | null = null;

    // Set up auth state listener FIRST
    const { data: { subscription: authSubscription } } = supabase.auth.onAuthStateChange(
      (event, session) => {
        setSession(session);
        setUser(session?.user ?? null);
        
        if (session?.user) {
          // Only fetch subscription if this is a real auth change (not the initial session)
          if (initialSessionHandled) {
            fetchSubscription(session.user.id);
          }
          
          // Sync to Airtable ONLY on actual SIGNED_IN (not TOKEN_REFRESHED, not INITIAL_SESSION)
          // Also skip impersonation sessions and prevent duplicate syncs for same user
          if (
            event === 'SIGNED_IN' && 
            !localStorage.getItem('admin_original_session') &&
            lastSyncedUserId !== session.user.id
          ) {
            lastSyncedUserId = session.user.id;
            setTimeout(() => {
              syncToAirtable(session.user.id, (session.user.email || '').toLowerCase());
            }, 100);
          }
        } else {
          setSubscription(null);
          lastSyncedUserId = null;
        }
        
        setHasOriginalAdminSession(!!localStorage.getItem('admin_original_session'));
      }
    );

    // Then check for existing session
    supabase.auth.getSession().then(({ data: { session }, error }) => {
      initialSessionHandled = true;
      
      if (error || !session) {
        setSession(null);
        setUser(null);
        setSubscription(null);
        setIsLoading(false);
        return;
      }
      
      setSession(session);
      setUser(session.user);
      
      if (session.user) {
        fetchSubscription(session.user.id).finally(() => setIsLoading(false));
      } else {
        setIsLoading(false);
      }
    });

    return () => authSubscription.unsubscribe();
  }, []);

  const syncUserToAirtable = async (
    email: string, 
    fullName?: string, 
    nickname?: string, 
    phone?: string,
    planType?: string,
    status?: string,
    startedAt?: string,
    stripeCustomerId?: string,
    stripeSubscriptionId?: string
  ) => {
    try {
      const { data, error } = await supabase.functions.invoke('sync-user-to-airtable', {
        body: {
          user: {
            email,
            full_name: fullName,
            nickname,
            phone,
            plan_type: planType || 'free',
            status: status || 'active',
            started_at: startedAt,
            stripe_customer_id: stripeCustomerId,
            stripe_subscription_id: stripeSubscriptionId,
          },
        },
      });
      
      if (error) {
        console.error('[Auth] Airtable sync error:', error);
      } else {
        console.log('[Auth] User synced to Airtable on login');
      }
    } catch (error) {
      console.error('[Auth] Failed to sync user to Airtable:', error);
    }
  };

  const signUp = async (email: string, password: string, fullName: string, nickname: string, phone: string) => {
    try {
      const redirectUrl = `${window.location.origin}/`;
      
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          emailRedirectTo: redirectUrl,
          data: {
            full_name: fullName,
            nickname: nickname,
            phone: phone,
          },
        },
      });

      if (error) throw error;

      // Update profile with phone number
      if (data.user) {
        await supabase
          .from('profiles')
          .update({ phone: phone })
          .eq('id', data.user.id);
        
        // NOTE: Ne pas appeler syncUserToAirtable ici car l'événement SIGNED_IN
        // dans onAuthStateChange le fait déjà automatiquement
      }

      toast.success('Compte créé avec succès ! Veuillez vérifier votre email pour confirmer votre inscription.');
      navigate('/');
      return { error: null };
    } catch (error: any) {
      toast.error(error.message || 'Erreur lors de l\'inscription');
      return { error };
    }
  };

  const signIn = async (email: string, password: string) => {
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) throw error;

      // NOTE: Ne pas synchroniser ici : l'événement SIGNED_IN dans onAuthStateChange
      // déclenche déjà la synchro vers Airtable (évite doublons / appels multiples).

      toast.success('Connexion réussie !');
      navigate('/dashboard');
      return { error: null };
    } catch (error: any) {
      toast.error(error.message || 'Erreur lors de la connexion');
      return { error };
    }
  };

  const signOut = async () => {
    try {
      // Sign out and clear all sessions
      await supabase.auth.signOut();

      // Clear all state
      setUser(null);
      setSession(null);
      setSubscription(null);
      
      // Clear any stored admin session
      localStorage.removeItem('admin_original_session');
      setHasOriginalAdminSession(false);
      
      toast.success('Déconnexion réussie');
      navigate('/auth');
    } catch (error: any) {
      console.error('Logout error:', error);
      toast.error('Erreur lors de la déconnexion');
    }
  };

  // Return to original admin session
  const returnToAdminSession = async () => {
    try {
      const storedSession = localStorage.getItem('admin_original_session');
      if (!storedSession) {
        toast.error('Aucune session admin sauvegardée');
        return;
      }

      const adminSession = JSON.parse(storedSession);
      
      // Sign out current user first
      await supabase.auth.signOut();
      
      // Set the admin session
      const { data, error } = await supabase.auth.setSession({
        access_token: adminSession.access_token,
        refresh_token: adminSession.refresh_token,
      });

      if (error) {
        // If token is expired, try to refresh it
        console.error('Error restoring admin session:', error);
        toast.error('Session admin expirée. Veuillez vous reconnecter.');
        localStorage.removeItem('admin_original_session');
        setHasOriginalAdminSession(false);
        navigate('/auth');
        return;
      }

      // Clear stored admin session
      localStorage.removeItem('admin_original_session');
      setHasOriginalAdminSession(false);
      
      toast.success('Retour à votre session admin');
      navigate('/admin/profiles');
    } catch (error: any) {
      console.error('Error returning to admin session:', error);
      toast.error('Erreur lors du retour à la session admin');
      localStorage.removeItem('admin_original_session');
      setHasOriginalAdminSession(false);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        session,
        subscription,
        isVIP,
        isLoading,
        signUp,
        signIn,
        signOut,
        refreshSubscription,
        hasOriginalAdminSession,
        returnToAdminSession,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
