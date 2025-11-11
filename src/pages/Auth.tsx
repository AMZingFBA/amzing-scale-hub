import { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "@/hooks/use-auth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { toast } from "sonner";
import logo from "@/assets/logo.png";
import { Mail, Lock, User, Phone, Package, TrendingUp, BarChart3, CheckCircle2 } from "lucide-react";
import { Capacitor } from "@capacitor/core";
import { ErrorBoundary } from "@/components/ErrorBoundary";
import { supabase } from "@/integrations/supabase/client";

export default function Auth() {
  const navigate = useNavigate();
  const { user, signIn } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [verificationStep, setVerificationStep] = useState<'form' | 'verify'>('form');
  const [signupData, setSignupData] = useState({
    email: '',
    password: '',
    fullName: '',
    nickname: '',
    phone: '',
  });
  const [verificationCode, setVerificationCode] = useState('');
  const [error, setError] = useState<string | null>(null);
  const isNativeApp = Capacitor.isNativePlatform();
  
  // Check URL params for default tab and referral code
  const searchParams = new URLSearchParams(window.location.search);
  const defaultTab = searchParams.get("tab") === "signup" ? "signup" : "login";
  const referralCode = searchParams.get("ref");
  const [activeTab, setActiveTab] = useState(defaultTab);

  useEffect(() => {
    if (!user) return;
    
    const checkAndRedirect = async () => {
      // Vérifier le rôle admin
      const { data: roleData } = await supabase
        .from('user_roles')
        .select('role')
        .eq('user_id', user.id)
        .eq('role', 'admin')
        .maybeSingle();
      
      // Vérifier le statut VIP
      const { data: subData } = await supabase
        .from('subscriptions')
        .select('plan_type, status, expires_at')
        .eq('user_id', user.id)
        .maybeSingle();

      const isUserVIP = subData?.plan_type === 'vip' && 
        (subData?.status === 'active' || subData?.status === 'canceled') &&
        (!subData?.expires_at || new Date(subData.expires_at) > new Date());

      const isUserAdmin = roleData?.role === 'admin';

      // Rediriger selon le statut
      if (isUserAdmin || isUserVIP) {
        navigate("/dashboard", { replace: true });
      } else {
        navigate("/", { replace: true });
      }
    };
    
    checkAndRedirect();
  }, [user, navigate]);

  const handleSignIn = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);

    const formData = new FormData(e.currentTarget);
    const email = formData.get("email") as string;
    const password = formData.get("password") as string;

    const { error } = await signIn(email, password);

    if (error) {
      toast.error("Erreur de connexion", {
        description: error.message,
      });
    } else {
      // Si un code de parrainage est présent, l'enregistrer
      if (referralCode) {
        try {
          const { supabase } = await import("@/integrations/supabase/client");
          const { data: userData } = await supabase.auth.getUser();
          
          if (userData.user) {
            await supabase.functions.invoke('track-referral-login', {
              body: {
                userId: userData.user.id,
                email: userData.user.email,
                referralCode: referralCode,
              }
            });
            console.log("Referral tracked for existing user");
          }
        } catch (e) {
          console.error("Failed to track referral:", e);
        }
      }
      // La redirection est gérée par le hook useAuth dans signIn
    }

    setIsLoading(false);
  };

  const handleSendVerificationCode = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);

    const formData = new FormData(e.currentTarget);
    const email = formData.get("email") as string;
    const password = formData.get("password") as string;
    const confirmPassword = formData.get("confirmPassword") as string;
    const fullName = formData.get("fullName") as string;
    const nickname = formData.get("nickname") as string;
    const phone = formData.get("phone") as string;

    if (password !== confirmPassword) {
      toast.error("Les mots de passe ne correspondent pas");
      setIsLoading(false);
      return;
    }

    // Save signup data
    setSignupData({ email, password, fullName, nickname, phone });

    try {
      const { supabase } = await import("@/integrations/supabase/client");
      const { data, error } = await supabase.functions.invoke('send-verification-code', {
        body: {
          type: 'email_signup',
          email: email.toLowerCase(),
        },
      });

      if (error) {
        throw error;
      }

      toast.success("Code de vérification envoyé par email");
      setVerificationStep('verify');
    } catch (error: any) {
      console.error('Error sending verification code:', error);
      toast.error(error.message || "Erreur lors de l'envoi du code");
    } finally {
      setIsLoading(false);
    }
  };

  const handleVerifyAndSignUp = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    try {
      const { supabase } = await import("@/integrations/supabase/client");
      
      // Get the session for authorization
      const { data: sessionData } = await supabase.auth.getSession();
      const token = sessionData.session?.access_token;
      
      // Make direct fetch call to get proper error messages
      const response = await fetch(
        `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/verify-and-signup`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token || import.meta.env.VITE_SUPABASE_ANON_KEY}`,
            'apikey': import.meta.env.VITE_SUPABASE_ANON_KEY,
          },
          body: JSON.stringify({
            code: verificationCode,
            email: signupData.email.toLowerCase(),
            password: signupData.password,
            fullName: signupData.fullName,
            nickname: signupData.nickname,
            phone: signupData.phone,
            referralCode: referralCode || null,
          }),
        }
      );

      const data = await response.json();

      // Check if there's an error
      if (!response.ok || data.error) {
        const errorMessage = data.error || 'Une erreur est survenue';
        setError(errorMessage);
        setIsLoading(false);
        return;
      }

      // Success
      toast.success("Compte créé avec succès! Connexion...");

      // Sign in the user
      const { error: signInError } = await signIn(signupData.email, signupData.password);

      if (signInError) {
        toast.error("Erreur lors de la connexion", {
          description: signInError.message,
        });
        setIsLoading(false);
        return;
      }

      // Attendre que la session soit établie
      await new Promise(resolve => setTimeout(resolve, 1000));

      // Rediriger vers le paiement selon la plateforme
      if (!isNativeApp) {
        // Sur le site web, rediriger vers Stripe
        try {
          toast.info("Préparation du paiement...");
          
          const { data: sessionData } = await supabase.auth.getSession();
          if (!sessionData.session?.access_token) {
            throw new Error("Session non établie");
          }

          const { data: checkoutData, error: checkoutError } = await supabase.functions.invoke('create-checkout', {
            headers: {
              Authorization: `Bearer ${sessionData.session.access_token}`,
            },
          });

          if (checkoutError) {
            console.error('Error creating checkout:', checkoutError);
            toast.error('Erreur lors de la redirection vers le paiement');
            setIsLoading(false);
            return;
          }

          if (checkoutData?.url) {
            toast.success("Redirection vers le paiement sécurisé...");
            // Rediriger dans le même onglet au lieu d'ouvrir un nouvel onglet
            window.location.href = checkoutData.url;
          }
        } catch (error: any) {
          console.error('Error starting checkout:', error);
          toast.error('Erreur lors de la redirection vers le paiement: ' + error.message);
          setIsLoading(false);
        }
      } else {
        // Sur l'app native iOS, lancer le processus d'achat Apple
        try {
          toast.info('Préparation du paiement Apple...');
          // Rediriger vers la page d'abonnement pour gérer le paiement Apple
          navigate('/tarifs');
        } catch (error: any) {
          console.error('Error starting Apple IAP:', error);
          toast.error('Erreur lors de la préparation du paiement');
        }
      }
    } catch (error: any) {
      console.error('Caught error in handleVerifyAndSignUp:', error);
      const errorMessage = error.message || "Une erreur est survenue";
      setError(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <ErrorBoundary>
      <div className="min-h-screen w-full flex bg-gradient-to-br from-[#FFF7E6] via-background to-background">
      {/* Left Side - Form */}
      <div className={`w-full lg:w-1/2 flex items-center justify-center p-8 relative overflow-hidden ${isNativeApp ? 'pt-16 bg-gradient-to-br from-[#FFF7E6] via-background to-primary/5' : ''}`}>
        {/* Decorative elements */}
        <div className={`absolute inset-0 overflow-hidden pointer-events-none ${isNativeApp ? 'opacity-25' : 'opacity-5'}`}>
          <Package className="absolute top-10 right-10 h-20 w-20 text-primary animate-float" style={{ animationDelay: "0s" }} />
          <TrendingUp className="absolute bottom-20 left-10 h-16 w-16 text-secondary animate-float" style={{ animationDelay: "1s" }} />
          <BarChart3 className="absolute top-1/3 left-5 h-12 w-12 text-primary animate-float" style={{ animationDelay: "2s" }} />
          <Package className="absolute bottom-10 right-20 h-14 w-14 text-secondary animate-float" style={{ animationDelay: "1.5s" }} />
          <TrendingUp className="absolute top-1/2 right-5 h-16 w-16 text-primary animate-float" style={{ animationDelay: "2.5s" }} />
          <BarChart3 className="absolute bottom-1/3 right-12 h-10 w-10 text-secondary animate-float" style={{ animationDelay: "3s" }} />
        </div>
        
        {/* Animated circles */}
        {isNativeApp && (
          <>
            <div className="absolute top-20 left-10 w-32 h-32 bg-primary/10 rounded-full blur-2xl animate-float" style={{ animationDelay: "0s" }} />
            <div className="absolute bottom-20 right-10 w-40 h-40 bg-secondary/10 rounded-full blur-2xl animate-float" style={{ animationDelay: "1.5s" }} />
            <div className="absolute top-1/2 right-20 w-24 h-24 bg-primary/10 rounded-full blur-2xl animate-float" style={{ animationDelay: "3s" }} />
          </>
        )}
        
        <div className="w-full max-w-md space-y-8 relative z-10">
          {/* Logo */}
          <Link to="/" className="flex justify-center animate-slide-in-up" style={{ animationDelay: "0ms" }}>
            <img src={logo} alt="AMZing FBA" className="h-16 w-auto hover:scale-110 transition-all duration-300" />
          </Link>

          {/* Form Card */}
          <Card className="border-border/50 shadow-elegant backdrop-blur-sm animate-slide-in-up" style={{ animationDelay: "100ms" }}>
            <CardHeader className="space-y-1 text-center">
              <CardTitle className="text-2xl font-bold">
                {activeTab === "login" ? "Bienvenue !" : "Créez votre compte"}
              </CardTitle>
              <CardDescription>
                {activeTab === "login"
                  ? "Heureux de vous revoir"
                  : "Créez votre compte en 30 secondes"}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Tabs 
                value={activeTab} 
                onValueChange={(value) => {
                  setActiveTab(value);
                }} 
                className="w-full"
              >
                <TabsList className="grid w-full grid-cols-2 mb-6">
                  <TabsTrigger 
                    value="login" 
                    className="relative data-[state=active]:after:absolute data-[state=active]:after:bottom-0 data-[state=active]:after:left-0 data-[state=active]:after:right-0 data-[state=active]:after:h-0.5 data-[state=active]:after:bg-primary data-[state=active]:after:animate-scale-in"
                  >
                    Connexion
                  </TabsTrigger>
                  <TabsTrigger 
                    value="signup"
                    className="relative data-[state=active]:after:absolute data-[state=active]:after:bottom-0 data-[state=active]:after:left-0 data-[state=active]:after:right-0 data-[state=active]:after:h-0.5 data-[state=active]:after:bg-primary data-[state=active]:after:animate-scale-in"
                  >
                    Inscription
                  </TabsTrigger>
                </TabsList>

                <TabsContent 
                  value="login" 
                  className={`space-y-4 ${activeTab === 'login' ? 'animate-in fade-in slide-in-from-right-4 duration-300' : ''}`}
                >
                  <form onSubmit={handleSignIn} className="space-y-4">
                    <div className="space-y-2 animate-slide-in-up" style={{ animationDelay: "50ms" }}>
                      <Label htmlFor="login-email">Email</Label>
                      <div className="relative group">
                        <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground group-focus-within:text-primary transition-all duration-300 group-focus-within:scale-110" />
                        <Input
                          id="login-email"
                          name="email"
                          type="email"
                          placeholder="votre@email.com"
                          required
                          disabled={isLoading}
                          className="pl-10 transition-all duration-300 focus:ring-2 focus:ring-primary/20 focus:shadow-[0_0_12px_rgba(255,186,73,0.5)] hover:border-primary/50"
                        />
                      </div>
                    </div>

                    <div className="space-y-2 animate-slide-in-up" style={{ animationDelay: "100ms" }}>
                      <Label htmlFor="login-password">Mot de passe</Label>
                      <div className="relative group">
                        <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground group-focus-within:text-primary transition-all duration-300 group-focus-within:scale-110" />
                        <Input
                          id="login-password"
                          name="password"
                          type="password"
                          placeholder="••••••••"
                          required
                          disabled={isLoading}
                          className="pl-10 transition-all duration-300 focus:ring-2 focus:ring-primary/20 focus:shadow-[0_0_12px_rgba(255,186,73,0.5)] hover:border-primary/50"
                        />
                      </div>
                    </div>

                    <div className="text-right animate-slide-in-up" style={{ animationDelay: "150ms" }}>
                      <Link to="/forgot-password" className="text-sm text-primary hover:underline transition-all hover:translate-x-1">
                        Mot de passe oublié ?
                      </Link>
                    </div>

                    <div className="animate-slide-in-up" style={{ animationDelay: "200ms" }}>
                      <Button
                        type="submit"
                        variant="hero"
                        className="w-full"
                        disabled={isLoading}
                      >
                        {isLoading ? "Connexion..." : "Se connecter"}
                      </Button>
                    </div>
                  </form>
                </TabsContent>

                <TabsContent 
                  value="signup" 
                  className={`space-y-4 ${activeTab === 'signup' ? 'animate-in fade-in slide-in-from-right-4 duration-300' : ''}`}
                >
                  {verificationStep === 'form' ? (
                    <form onSubmit={handleSendVerificationCode} className="space-y-4">
                    <div className="space-y-2 animate-slide-in-up" style={{ animationDelay: "50ms" }}>
                      <Label htmlFor="signup-fullname">Nom complet</Label>
                      <div className="relative group">
                        <User className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground group-focus-within:text-primary transition-all duration-300 group-focus-within:scale-110" />
                        <Input
                          id="signup-fullname"
                          name="fullName"
                          type="text"
                          placeholder="Jean Dupont"
                          required
                          disabled={isLoading}
                          className="pl-10 transition-all duration-300 focus:ring-2 focus:ring-primary/20 focus:shadow-[0_0_12px_rgba(255,186,73,0.5)] hover:border-primary/50"
                        />
                      </div>
                    </div>

                    <div className="space-y-2 animate-slide-in-up" style={{ animationDelay: "100ms" }}>
                      <Label htmlFor="signup-nickname">Surnom (affiché dans les conversations)</Label>
                      <div className="relative group">
                        <User className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground group-focus-within:text-primary transition-all duration-300 group-focus-within:scale-110" />
                        <Input
                          id="signup-nickname"
                          name="nickname"
                          type="text"
                          placeholder="JD"
                          required
                          disabled={isLoading}
                          className="pl-10 transition-all duration-300 focus:ring-2 focus:ring-primary/20 focus:shadow-[0_0_12px_rgba(255,186,73,0.5)] hover:border-primary/50"
                        />
                      </div>
                    </div>

                    <div className="space-y-2 animate-slide-in-up" style={{ animationDelay: "150ms" }}>
                      <Label htmlFor="signup-phone">Numéro de téléphone</Label>
                      <div className="relative group">
                        <Phone className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground group-focus-within:text-primary transition-all duration-300 group-focus-within:scale-110" />
                        <Input
                          id="signup-phone"
                          name="phone"
                          type="tel"
                          placeholder="+33 6 12 34 56 78"
                          required
                          disabled={isLoading}
                          className="pl-10 transition-all duration-300 focus:ring-2 focus:ring-primary/20 focus:shadow-[0_0_12px_rgba(255,186,73,0.5)] hover:border-primary/50"
                        />
                      </div>
                    </div>

                    <div className="space-y-2 animate-slide-in-up" style={{ animationDelay: "200ms" }}>
                      <Label htmlFor="signup-email">Email</Label>
                      <div className="relative group">
                        <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground group-focus-within:text-primary transition-all duration-300 group-focus-within:scale-110" />
                        <Input
                          id="signup-email"
                          name="email"
                          type="email"
                          placeholder="votre@email.com"
                          required
                          disabled={isLoading}
                          className="pl-10 transition-all duration-300 focus:ring-2 focus:ring-primary/20 focus:shadow-[0_0_12px_rgba(255,186,73,0.5)] hover:border-primary/50"
                        />
                      </div>
                    </div>

                    <div className="space-y-2 animate-slide-in-up" style={{ animationDelay: "250ms" }}>
                      <Label htmlFor="signup-password">Mot de passe (min. 6 caractères)</Label>
                      <div className="relative group">
                        <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground group-focus-within:text-primary transition-all duration-300 group-focus-within:scale-110" />
                        <Input
                          id="signup-password"
                          name="password"
                          type="password"
                          placeholder="••••••••"
                          required
                          minLength={6}
                          disabled={isLoading}
                          className="pl-10 transition-all duration-300 focus:ring-2 focus:ring-primary/20 focus:shadow-[0_0_12px_rgba(255,186,73,0.5)] hover:border-primary/50"
                        />
                      </div>
                    </div>

                    <div className="space-y-2 animate-slide-in-up" style={{ animationDelay: "300ms" }}>
                      <Label htmlFor="signup-confirm-password">Confirmer le mot de passe</Label>
                      <div className="relative group">
                        <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground group-focus-within:text-primary transition-all duration-300 group-focus-within:scale-110" />
                        <Input
                          id="signup-confirm-password"
                          name="confirmPassword"
                          type="password"
                          placeholder="••••••••"
                          required
                          minLength={6}
                          disabled={isLoading}
                          className="pl-10 transition-all duration-300 focus:ring-2 focus:ring-primary/20 focus:shadow-[0_0_12px_rgba(255,186,73,0.5)] hover:border-primary/50"
                        />
                      </div>
                    </div>

                    <div className="animate-slide-in-up" style={{ animationDelay: "350ms" }}>
                      <Button
                        type="submit"
                        variant="hero"
                        className="w-full"
                        disabled={isLoading}
                      >
                        {isLoading ? "Envoi du code..." : "Continuer"}
                      </Button>
                    </div>
                    
                    <p className="text-xs text-muted-foreground text-center">
                      Un code de vérification sera envoyé à votre email
                    </p>
                  </form>
                  ) : (
                    <form onSubmit={handleVerifyAndSignUp} className="space-y-4">
                      <div className="text-center space-y-2 mb-6">
                        <CheckCircle2 className="h-12 w-12 text-primary mx-auto" />
                        <h3 className="font-semibold">Code envoyé !</h3>
                        <p className="text-sm text-muted-foreground">
                          Vérifiez votre email {signupData.email}
                        </p>
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="verification-code">Code de vérification (6 chiffres)</Label>
                        <Input
                          id="verification-code"
                          type="text"
                          placeholder="123456"
                          required
                          maxLength={6}
                          pattern="[0-9]{6}"
                          value={verificationCode}
                          onChange={(e) => {
                            setVerificationCode(e.target.value);
                            setError(null); // Clear error when user types
                          }}
                          disabled={isLoading}
                          className={`text-center text-2xl tracking-widest ${error ? 'border-destructive' : ''}`}
                        />
                        {error && (
                          <p className="text-sm text-destructive flex items-center gap-2 animate-in fade-in slide-in-from-top-1">
                            <span className="inline-block w-1.5 h-1.5 rounded-full bg-destructive"></span>
                            {error}
                          </p>
                        )}
                      </div>

                      <Button
                        type="submit"
                        variant="hero"
                        className="w-full"
                        disabled={isLoading || verificationCode.length !== 6}
                      >
                        {isLoading ? "Vérification..." : "Créer mon compte"}
                      </Button>

                      <Button
                        type="button"
                        variant="ghost"
                        className="w-full"
                        onClick={() => setVerificationStep('form')}
                        disabled={isLoading}
                      >
                        Modifier mes informations
                      </Button>
                    </form>
                  )}
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>

          <p className="text-center text-sm text-muted-foreground animate-slide-in-up" style={{ animationDelay: "400ms" }}>
            <Link to="/" className="text-primary hover:underline transition-all hover:translate-x-1 inline-block">
              Retour à l'accueil
            </Link>
          </p>
        </div>
      </div>

      {/* Right Side - Branding */}
      <div className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-primary via-orange-500 to-secondary p-12 items-center justify-center relative overflow-hidden animate-fade-in" style={{ animationDelay: "0.15s" }}>
        {/* Floating Icons Background */}
        <div className="absolute inset-0 overflow-hidden opacity-10">
          <Package className="absolute top-20 left-20 h-16 w-16 animate-float" style={{ animationDelay: "0s" }} />
          <TrendingUp className="absolute top-40 right-32 h-20 w-20 animate-float" style={{ animationDelay: "1s" }} />
          <BarChart3 className="absolute bottom-32 left-32 h-24 w-24 animate-float" style={{ animationDelay: "2s" }} />
          <Package className="absolute bottom-20 right-20 h-16 w-16 animate-float" style={{ animationDelay: "1.5s" }} />
        </div>

        {/* Content */}
        <div className="relative z-10 text-white space-y-8 max-w-lg">
          <div className="space-y-4">
            <h1 className="text-5xl font-bold leading-tight animate-fade-in" style={{ animationDelay: "0.3s" }}>
              Rejoignez AMZing FBA
            </h1>
            <p className="text-xl text-white/90 animate-fade-in" style={{ animationDelay: "0.4s" }}>
              Votre succès sur Amazon commence ici
            </p>
          </div>

          <div className="space-y-4 animate-fade-in" style={{ animationDelay: "0.5s" }}>
            <div className="flex items-start gap-3 group">
              <CheckCircle2 className="h-6 w-6 flex-shrink-0 mt-0.5 group-hover:scale-110 transition-transform" />
              <div>
                <h3 className="font-semibold text-lg">Produits rentables</h3>
                <p className="text-white/80">Trouvez les meilleurs produits pour maximiser vos profits</p>
              </div>
            </div>

            <div className="flex items-start gap-3 group">
              <CheckCircle2 className="h-6 w-6 flex-shrink-0 mt-0.5 group-hover:scale-110 transition-transform" />
              <div>
                <h3 className="font-semibold text-lg">Formations complètes</h3>
                <p className="text-white/80">Apprenez les meilleures stratégies de vente Amazon</p>
              </div>
            </div>

            <div className="flex items-start gap-3 group">
              <CheckCircle2 className="h-6 w-6 flex-shrink-0 mt-0.5 group-hover:scale-110 transition-transform" />
              <div>
                <h3 className="font-semibold text-lg">Communauté active</h3>
                <p className="text-white/80">Échangez avec des vendeurs expérimentés</p>
              </div>
            </div>

            <div className="flex items-start gap-3 group">
              <CheckCircle2 className="h-6 w-6 flex-shrink-0 mt-0.5 group-hover:scale-110 transition-transform" />
              <div>
                <h3 className="font-semibold text-lg">Support dédié</h3>
                <p className="text-white/80">Une équipe à votre écoute pour vous accompagner</p>
              </div>
            </div>
          </div>
        </div>
      </div>
      </div>
    </ErrorBoundary>
  );
}
