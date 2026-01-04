import { useEffect, useState } from 'react';
import { useSearchParams, useNavigate, Link } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/use-auth';
import { toast } from 'sonner';
import { CheckCircle2, Loader2, LogIn, UserPlus, XCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import SEO from '@/components/SEO';

const SuiteSuccess = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [verifying, setVerifying] = useState(true);
  const [verified, setVerified] = useState(false);
  const [paymentEmail, setPaymentEmail] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const sessionId = searchParams.get('session_id');

  useEffect(() => {
    const verifyPayment = async () => {
      if (!sessionId) {
        setError('Session de paiement invalide');
        setVerifying(false);
        return;
      }

      try {
        const { data, error: fnError } = await supabase.functions.invoke('verify-suite-payment', {
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
          setPaymentEmail(data.email);
          toast.success('Paiement confirmé !');
          
          // If user is already logged in, redirect to dashboard
          if (user) {
            setTimeout(() => {
              navigate('/dashboard');
            }, 2000);
          } else {
            // Force redirect to signup after 3 seconds if not logged in
            if (data.email) {
              sessionStorage.setItem('suite_payment_email', data.email);
            }
            setTimeout(() => {
              navigate('/auth?mode=signup&redirect=/dashboard');
            }, 3000);
          }
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
  }, [sessionId, user, navigate]);

  const handleAuth = (mode: 'login' | 'signup') => {
    // Store payment email for pre-fill
    if (paymentEmail) {
      sessionStorage.setItem('suite_payment_email', paymentEmail);
    }
    navigate(`/auth?mode=${mode}&redirect=/dashboard`);
  };

  return (
    <div className="min-h-screen bg-suite-bg flex items-center justify-center p-4">
      <SEO 
        title="Paiement Suite - AMZing FBA"
        description="Confirmation de votre achat AMZing FBA Suite"
        robots="noindex,nofollow"
      />
      
      <Card className="max-w-lg w-full bg-suite-card border-white/10">
        <CardContent className="p-8 text-center">
          {verifying ? (
            <div className="py-12">
              <Loader2 className="h-16 w-16 animate-spin text-suite-orange mx-auto mb-6" />
              <h1 className="text-2xl font-bold text-white mb-2">Vérification du paiement...</h1>
              <p className="text-suite-gray">
                Merci de patienter quelques instants.
              </p>
            </div>
          ) : verified ? (
            <div className="py-8">
              <div className="w-20 h-20 rounded-full bg-green-500/20 flex items-center justify-center mx-auto mb-6">
                <CheckCircle2 className="h-12 w-12 text-green-400" />
              </div>
              
              <h1 className="text-3xl font-bold mb-4 text-white">
                Paiement confirmé ! 🎉
              </h1>
              
              <p className="text-lg text-suite-gray mb-8">
                Bienvenue dans AMZing FBA Suite !<br />
                Ton accès à vie est maintenant actif.
              </p>

              {user ? (
                <div className="space-y-4">
                  <p className="text-suite-gray text-sm">
                    Redirection automatique vers le dashboard...
                  </p>
                  <Button 
                    onClick={() => navigate('/dashboard')}
                    className="bg-suite-orange hover:bg-suite-orange/90 text-white"
                  >
                    Accéder au Dashboard maintenant
                  </Button>
                </div>
              ) : (
                <div className="space-y-6">
                  <div className="bg-gradient-to-r from-suite-orange/20 to-transparent border border-suite-orange/30 rounded-xl p-6">
                    <h3 className="text-white font-bold text-lg mb-2">
                      🎓 Dernière étape : Crée ton compte
                    </h3>
                    <p className="text-suite-gray mb-4">
                      Redirection automatique vers la création de compte...
                    </p>
                    
                    {paymentEmail && (
                      <div className="bg-white/10 rounded-lg p-3 mb-4">
                        <p className="text-sm text-suite-gray">
                          Email de paiement :
                        </p>
                        <p className="text-white font-medium">{paymentEmail}</p>
                      </div>
                    )}
                    
                    <div className="flex flex-col gap-3">
                      <Button 
                        onClick={() => handleAuth('signup')}
                        className="w-full bg-suite-orange hover:bg-suite-orange/90 text-white font-bold py-3"
                      >
                        <UserPlus className="w-5 h-5 mr-2" />
                        Créer mon compte maintenant
                      </Button>
                      <Button 
                        onClick={() => handleAuth('login')}
                        variant="outline"
                        className="w-full border-white/20 text-white hover:bg-white/10"
                      >
                        <LogIn className="w-4 h-4 mr-2" />
                        J'ai déjà un compte
                      </Button>
                    </div>
                  </div>
                  
                  <p className="text-suite-gray/60 text-sm">
                    ⚠️ Utilise le même email que pour le paiement pour lier automatiquement ton achat.
                  </p>
                </div>
              )}
              
              <div className="mt-8 p-4 bg-white/5 rounded-lg text-sm text-suite-gray">
                <p>
                  Un email de confirmation t'a été envoyé à {paymentEmail}.<br />
                  En cas de question, contacte-nous via le support.
                </p>
              </div>
            </div>
          ) : (
            <div className="py-8">
              <div className="w-20 h-20 rounded-full bg-red-500/20 flex items-center justify-center mx-auto mb-6">
                <XCircle className="h-12 w-12 text-red-400" />
              </div>
              
              <h1 className="text-2xl font-bold mb-4 text-red-400">
                Erreur de vérification
              </h1>
              
              <p className="text-suite-gray mb-6">
                {error || 'Une erreur est survenue lors de la vérification.'}
              </p>
              
              <div className="space-y-4">
                <Button 
                  variant="outline"
                  onClick={() => navigate('/suite#pricing')}
                  className="border-white/20 text-white hover:bg-white/10"
                >
                  Retourner à la page Suite
                </Button>
                
                <p className="text-sm text-suite-gray">
                  Si le problème persiste, <Link to="/contact" className="text-suite-orange hover:underline">contacte le support</Link>.
                </p>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default SuiteSuccess;
