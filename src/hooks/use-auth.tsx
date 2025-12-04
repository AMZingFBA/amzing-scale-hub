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
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [subscription, setSubscription] = useState<Subscription | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();

  // Un utilisateur est VIP si:
  // - plan_type est 'vip'
  // - status est 'active' ou 'canceled' (résilié mais encore dans la période payée)
  // - expires_at est null (illimité) ou dans le futur
  const isVIP = subscription?.plan_type === 'vip' && 
    (subscription?.status === 'active' || subscription?.status === 'canceled') &&
    (!subscription?.expires_at || new Date(subscription.expires_at) > new Date());

  const fetchSubscription = async (userId: string) => {
    try {
      const { data, error } = await supabase
        .from('subscriptions')
        .select('plan_type, status, expires_at, is_trial')
        .eq('user_id', userId)
        .single();

      if (error) throw error;
      setSubscription(data as Subscription);
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

  useEffect(() => {
    // Set up auth state listener
    const { data: { subscription: authSubscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        setSession(session);
        setUser(session?.user ?? null);
        
        // Fetch subscription when user logs in
        if (session?.user) {
          setTimeout(() => {
            fetchSubscription(session.user.id);
          }, 0);
          
          // Sync to Airtable on SIGNED_IN event
          if (event === 'SIGNED_IN') {
            setTimeout(async () => {
              try {
                const { data: profile } = await supabase
                  .from('profiles')
                  .select('full_name, nickname')
                  .eq('id', session.user.id)
                  .single();
                
                const { data: sub } = await supabase
                  .from('subscriptions')
                  .select('plan_type, status, started_at, stripe_customer_id, stripe_subscription_id')
                  .eq('user_id', session.user.id)
                  .single();
                
                await supabase.functions.invoke('sync-user-to-airtable', {
                  body: {
                    user: {
                      email: session.user.email,
                      full_name: profile?.full_name,
                      nickname: profile?.nickname,
                      plan_type: sub?.plan_type || 'free',
                      status: sub?.status || 'active',
                      started_at: sub?.started_at,
                      stripe_customer_id: sub?.stripe_customer_id,
                      stripe_subscription_id: sub?.stripe_subscription_id,
                    },
                  },
                });
                console.log('[Auth] User synced to Airtable on SIGNED_IN');
              } catch (error) {
                console.error('[Auth] Failed to sync to Airtable:', error);
              }
            }, 100);
          }
        } else {
          setSubscription(null);
        }
      }
    );

    // Check for existing session
    supabase.auth.getSession().then(({ data: { session }, error }) => {
      // Si erreur ou pas de session, forcer la déconnexion complète
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
        console.log('[Auth] User synced to Airtable:', data);
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
        
        // Sync user to Airtable
        await syncUserToAirtable(email, fullName, nickname, 'free', 'active');
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

      // Sync user to Airtable (update last login)
      if (data.user) {
        const { data: profile } = await supabase
          .from('profiles')
          .select('full_name, nickname')
          .eq('id', data.user.id)
          .single();
        
        const { data: sub } = await supabase
          .from('subscriptions')
          .select('plan_type, status, started_at, stripe_customer_id, stripe_subscription_id')
          .eq('user_id', data.user.id)
          .single();
        
        await syncUserToAirtable(
          email,
          profile?.full_name || undefined,
          profile?.nickname || undefined,
          sub?.plan_type || 'free',
          sub?.status || 'active',
          sub?.started_at || undefined,
          sub?.stripe_customer_id || undefined,
          sub?.stripe_subscription_id || undefined
        );
      }

      toast.success('Connexion réussie !');
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
      
      toast.success('Déconnexion réussie');
      navigate('/auth');
    } catch (error: any) {
      console.error('Logout error:', error);
      toast.error('Erreur lors de la déconnexion');
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