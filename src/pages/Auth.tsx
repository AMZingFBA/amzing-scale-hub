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

export default function Auth() {
  const navigate = useNavigate();
  const { user, signUp, signIn } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const isNativeApp = Capacitor.isNativePlatform();
  
  // Check URL params for default tab
  const searchParams = new URLSearchParams(window.location.search);
  const defaultTab = searchParams.get("tab") === "signup" ? "signup" : "login";
  const [activeTab, setActiveTab] = useState(defaultTab);

  useEffect(() => {
    if (user) {
      navigate("/");
    }
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
      toast.success("Connexion réussie!");
      navigate("/");
    }

    setIsLoading(false);
  };

  const handleSignUp = async (e: React.FormEvent<HTMLFormElement>) => {
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

    const { error } = await signUp(email, password, fullName, nickname, phone);

    if (error) {
      toast.error("Erreur d'inscription", {
        description: error.message,
      });
      setIsLoading(false);
      return;
    }

    toast.success("Inscription réussie! Redirection vers le paiement...");

    // Sur le site web (pas l'app native), rediriger vers Stripe après inscription
    if (!isNativeApp) {
      try {
        const { supabase } = await import("@/integrations/supabase/client");
        const { data, error: checkoutError } = await supabase.functions.invoke('create-checkout', {
          headers: {
            Authorization: `Bearer ${(await supabase.auth.getSession()).data.session?.access_token}`,
          },
        });

        if (checkoutError) {
          console.error('Error creating checkout:', checkoutError);
          toast.error('Erreur lors de la redirection vers le paiement');
          setIsLoading(false);
          return;
        }

        if (data?.url) {
          // Ouvrir Stripe Checkout dans un nouvel onglet
          window.open(data.url, '_blank');
        }
      } catch (error: any) {
        console.error('Error starting checkout:', error);
        toast.error('Erreur lors de la redirection vers le paiement');
      }
    }

    setIsLoading(false);
  };

  return (
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
                  <form onSubmit={handleSignUp} className="space-y-4">
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
                        {isLoading ? "Création..." : "Créer mon compte"}
                      </Button>
                    </div>
                    
                    <p className="text-xs text-muted-foreground text-center">
                      Un email de vérification sera envoyé à votre adresse
                    </p>
                  </form>
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
  );
}
