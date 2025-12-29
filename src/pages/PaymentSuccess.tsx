import { useEffect, useState, useRef } from 'react';
import { useSearchParams, useNavigate, Link } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/use-auth';
import { toast } from 'sonner';
import { CheckCircle2, Loader2, ArrowRight, Home } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import ScrollToTop from '@/components/ScrollToTop';
import SEO from '@/components/SEO';

// Declare global tdconv function for Tradedoubler
declare global {
  interface Window {
    tdconv?: (action: string, type?: string, data?: object) => void;
  }
}

// Tradedoubler Grow SDK URL with org and program IDs
const TD_SDK_URL = 'https://svht.tradedoubler.com/tr_sdk.js?org=2458850&prog=394307&dr=true';
const TD_ORG_ID = '2458850';
const TD_EVENT_ID = 469662;

// Ensure Tradedoubler SDK is loaded and ready
const ensureTdConvReady = (timeoutMs = 5000): Promise<boolean> => {
  return new Promise((resolve) => {
    // Check if already available
    if (typeof window !== 'undefined' && typeof window.tdconv === 'function') {
      console.log('[TD] tdconv already available');
      resolve(true);
      return;
    }

    const timer = setTimeout(() => {
      console.warn('[TD] Timeout waiting for tdconv');
      resolve(typeof window.tdconv === 'function');
    }, timeoutMs);

    // Check periodically if tdconv becomes available
    const interval = setInterval(() => {
      if (typeof window.tdconv === 'function') {
        clearTimeout(timer);
        clearInterval(interval);
        console.log('[TD] tdconv now available');
        resolve(true);
      }
    }, 100);
  });
};

const PaymentSuccess = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { user, refreshSubscription } = useAuth();
  const [verifying, setVerifying] = useState(true);
  const [verified, setVerified] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const trackingAttempted = useRef(false);

  const sessionId = searchParams.get('session_id');

  useEffect(() => {
    const verifyPayment = async () => {
      if (!sessionId) {
        setError('Session de paiement invalide');
        setVerifying(false);
        return;
      }

      // Anti-double tracking: check localStorage
      const trackingKey = `td_sale_tracked_${sessionId}`;
      const alreadyTracked = localStorage.getItem(trackingKey);

      try {
        // Call verify-stripe-session edge function
        const { data, error: fnError } = await supabase.functions.invoke('verify-stripe-session', {
          body: { session_id: sessionId }
        });

        if (fnError) {
          console.error('Verification error:', fnError);
          setError('Erreur lors de la vérification du paiement');
          setVerifying(false);
          return;
        }

        if (data?.paid) {
          setVerified(true);
          
          // Refresh user subscription status
          if (refreshSubscription) {
            await refreshSubscription();
          }

          // Tradedoubler conversion tracking (only once per session)
          if (!alreadyTracked && !trackingAttempted.current) {
            trackingAttempted.current = true;
            
            const tdReady = await ensureTdConvReady();

            if (!tdReady || typeof window.tdconv !== 'function') {
              console.warn('[TD] tdconv not available (script blocked or not loaded)');
            } else {
              try {
                // Step 1: Initialize Tradedoubler (as per official documentation)
                window.tdconv('init', TD_ORG_ID, { element: 'iframe' });
                
                // Step 2: Track the sale conversion (exact format from Tradedoubler docs)
                window.tdconv('track', 'sale', {
                  transactionId: sessionId,
                  ordervalue: Number(data.amount) || 0,
                  voucher: data.voucher || '',
                  currency: 'EUR',
                  event: TD_EVENT_ID
                });

                // Mark as tracked to prevent duplicates
                localStorage.setItem(trackingKey, '1');
                console.log('[TD] Conversion tracked successfully', {
                  sessionId,
                  amount: data.amount,
                  voucher: data.voucher,
                  event: TD_EVENT_ID
                });
              } catch (tdError) {
                console.error('[TD] Tracking error:', tdError);
              }
            }
          }

          toast.success('Paiement confirmé ! Bienvenue dans la communauté AMZing FBA !');
        } else {
          setError('Le paiement n\'a pas été confirmé. Veuillez réessayer.');
        }
      } catch (err) {
        console.error('Verification error:', err);
        setError('Erreur de connexion. Veuillez réessayer.');
      } finally {
        setVerifying(false);
      }
    };

    verifyPayment();
  }, [sessionId, refreshSubscription]);

  return (
    <div className="min-h-screen flex flex-col">
      <SEO 
        title="Paiement confirmé - AMZing FBA"
        description="Votre paiement a été confirmé. Bienvenue dans la communauté AMZing FBA !"
        robots="noindex,nofollow"
      />
      <ScrollToTop />
      <Navbar />
      
      <main className="flex-grow pt-24 md:pt-20">
        <div className="container mx-auto px-4 py-12 max-w-2xl">
          <Card className="overflow-hidden">
            <CardContent className="p-8 text-center">
              {verifying ? (
                <div className="py-12">
                  <Loader2 className="h-16 w-16 animate-spin text-primary mx-auto mb-6" />
                  <h1 className="text-2xl font-bold mb-2">Vérification du paiement...</h1>
                  <p className="text-muted-foreground">
                    Merci de patienter quelques instants.
                  </p>
                </div>
              ) : verified ? (
                <div className="py-8">
                  <div className="w-20 h-20 rounded-full bg-green-100 dark:bg-green-900/30 flex items-center justify-center mx-auto mb-6">
                    <CheckCircle2 className="h-12 w-12 text-green-600 dark:text-green-400" />
                  </div>
                  
                  <h1 className="text-3xl font-bold mb-4 bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">
                    Paiement confirmé !
                  </h1>
                  
                  <p className="text-lg text-muted-foreground mb-8">
                    Bienvenue dans la communauté AMZing FBA ! 🎉<br />
                    Tu as maintenant accès à toutes les fonctionnalités VIP.
                  </p>
                  
                  <div className="space-y-4">
                    <Button 
                      size="lg" 
                      className="w-full sm:w-auto"
                      onClick={() => navigate('/dashboard')}
                    >
                      Accéder au Dashboard
                      <ArrowRight className="ml-2 h-5 w-5" />
                    </Button>
                    
                    <div className="flex justify-center gap-4 text-sm">
                      <Link to="/formation" className="text-primary hover:underline">
                        Voir la formation
                      </Link>
                      <span className="text-muted-foreground">•</span>
                      <Link to="/produits-find" className="text-primary hover:underline">
                        Produits rentables
                      </Link>
                    </div>
                  </div>
                  
                  <div className="mt-8 p-4 bg-muted/50 rounded-lg text-sm text-muted-foreground">
                    <p>
                      Un email de confirmation t'a été envoyé.<br />
                      En cas de question, contacte-nous via le support.
                    </p>
                  </div>
                </div>
              ) : (
                <div className="py-8">
                  <div className="w-20 h-20 rounded-full bg-red-100 dark:bg-red-900/30 flex items-center justify-center mx-auto mb-6">
                    <Home className="h-12 w-12 text-red-600 dark:text-red-400" />
                  </div>
                  
                  <h1 className="text-2xl font-bold mb-4 text-red-600 dark:text-red-400">
                    Erreur de vérification
                  </h1>
                  
                  <p className="text-muted-foreground mb-6">
                    {error || 'Une erreur est survenue lors de la vérification.'}
                  </p>
                  
                  <div className="space-y-4">
                    <Button 
                      variant="outline" 
                      onClick={() => navigate('/tarifs')}
                    >
                      Retourner aux tarifs
                    </Button>
                    
                    <p className="text-sm text-muted-foreground">
                      Si le problème persiste, contacte le support.
                    </p>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default PaymentSuccess;
