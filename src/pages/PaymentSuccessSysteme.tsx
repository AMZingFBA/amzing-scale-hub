import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { CheckCircle2, Loader2, AlertCircle } from "lucide-react";
import SEO from "@/components/SEO";
import OptimizedImage from "@/components/OptimizedImage";
import logo from "@/assets/logo.png";

export default function PaymentSuccessSysteme() {
  const navigate = useNavigate();
  const [status, setStatus] = useState<'checking' | 'success' | 'pending' | 'error'>('checking');
  const [attempts, setAttempts] = useState(0);
  const [userEmail, setUserEmail] = useState<string | null>(null);
  const maxAttempts = 10; // 10 tentatives = ~30 secondes max

  useEffect(() => {
    const checkVIPStatus = async () => {
      try {
        // Vérifier si l'utilisateur est connecté
        const { data: { session } } = await supabase.auth.getSession();
        
        if (!session?.user) {
          // Pas connecté - rediriger vers login
          setStatus('pending');
          return;
        }

        setUserEmail(session.user.email || null);

        // Vérifier le statut VIP
        const { data: subscription } = await supabase
          .from('subscriptions')
          .select('plan_type, status, expires_at')
          .eq('user_id', session.user.id)
          .single();

        const isVIP = subscription?.plan_type === 'vip' && 
          (subscription?.status === 'active' || subscription?.status === 'canceled') &&
          (!subscription?.expires_at || new Date(subscription.expires_at) > new Date());

        if (isVIP) {
          setStatus('success');
          // Redirection automatique après 2 secondes
          setTimeout(() => {
            navigate('/dashboard', { replace: true });
          }, 2000);
        } else if (attempts < maxAttempts) {
          // Pas encore VIP, réessayer dans 3 secondes
          setAttempts(prev => prev + 1);
          setTimeout(checkVIPStatus, 3000);
        } else {
          // Après 30 secondes, afficher un message
          setStatus('pending');
        }
      } catch (error) {
        console.error('Error checking VIP status:', error);
        setStatus('error');
      }
    };

    checkVIPStatus();
  }, [navigate, attempts]);

  return (
    <>
      <SEO 
        title="Paiement confirmé - AMZing FBA"
        description="Votre paiement a été confirmé. Bienvenue dans l'espace VIP AMZing FBA."
      />
      
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#FFF7E6] via-background to-background p-4">
        <Card className="w-full max-w-md border-border/50 shadow-elegant">
          <CardContent className="pt-8 pb-8 text-center space-y-6">
            {/* Logo */}
            <div className="flex justify-center">
              <OptimizedImage src={logo} alt="AMZing FBA" className="h-12 w-auto" />
            </div>

            {status === 'checking' && (
              <>
                <div className="flex justify-center">
                  <Loader2 className="h-16 w-16 text-primary animate-spin" />
                </div>
                <div className="space-y-2">
                  <h1 className="text-2xl font-bold">Vérification en cours...</h1>
                  <p className="text-muted-foreground">
                    Nous vérifions votre paiement. Cela peut prendre quelques secondes.
                  </p>
                  <p className="text-sm text-muted-foreground">
                    Tentative {attempts + 1}/{maxAttempts}
                  </p>
                </div>
              </>
            )}

            {status === 'success' && (
              <>
                <div className="flex justify-center">
                  <div className="rounded-full bg-green-100 p-4">
                    <CheckCircle2 className="h-16 w-16 text-green-600" />
                  </div>
                </div>
                <div className="space-y-2">
                  <h1 className="text-2xl font-bold text-green-600">Paiement confirmé !</h1>
                  <p className="text-muted-foreground">
                    Bienvenue dans l'espace VIP AMZing FBA !
                  </p>
                  <p className="text-sm text-muted-foreground">
                    Redirection vers votre Dashboard...
                  </p>
                </div>
              </>
            )}

            {status === 'pending' && (
              <>
                <div className="flex justify-center">
                  <div className="rounded-full bg-yellow-100 p-4">
                    <AlertCircle className="h-16 w-16 text-yellow-600" />
                  </div>
                </div>
                <div className="space-y-4">
                  <h1 className="text-2xl font-bold">Paiement en cours de traitement</h1>
                  <p className="text-muted-foreground">
                    Votre paiement est en cours de validation. 
                    {userEmail ? (
                      <> Vous recevrez un email de confirmation à <strong>{userEmail}</strong>.</>
                    ) : (
                      <> Connectez-vous pour accéder à votre espace VIP.</>
                    )}
                  </p>
                  
                  <div className="flex flex-col gap-3 pt-4">
                    {userEmail ? (
                      <Button onClick={() => navigate('/dashboard')} className="w-full">
                        Accéder au Dashboard
                      </Button>
                    ) : (
                      <Button onClick={() => navigate('/auth?tab=login')} className="w-full">
                        Se connecter
                      </Button>
                    )}
                    <Button 
                      variant="outline" 
                      onClick={() => {
                        setAttempts(0);
                        setStatus('checking');
                      }}
                      className="w-full"
                    >
                      Réessayer la vérification
                    </Button>
                  </div>
                </div>
              </>
            )}

            {status === 'error' && (
              <>
                <div className="flex justify-center">
                  <div className="rounded-full bg-red-100 p-4">
                    <AlertCircle className="h-16 w-16 text-red-600" />
                  </div>
                </div>
                <div className="space-y-4">
                  <h1 className="text-2xl font-bold text-red-600">Erreur de vérification</h1>
                  <p className="text-muted-foreground">
                    Une erreur est survenue. Si vous avez payé, votre accès VIP sera activé sous peu.
                  </p>
                  <div className="flex flex-col gap-3 pt-4">
                    <Button onClick={() => navigate('/dashboard')} className="w-full">
                      Accéder au Dashboard
                    </Button>
                    <Button variant="outline" onClick={() => navigate('/support')} className="w-full">
                      Contacter le support
                    </Button>
                  </div>
                </div>
              </>
            )}
          </CardContent>
        </Card>
      </div>
    </>
  );
}