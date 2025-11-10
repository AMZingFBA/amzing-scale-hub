import { useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { ArrowLeft, RefreshCw } from "lucide-react";

const AffiliateVerify = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const email = searchParams.get("email") || "";

  const [code, setCode] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isResending, setIsResending] = useState(false);
  const [countdown, setCountdown] = useState(0);

  const handleResendCode = async () => {
    if (countdown > 0) return;

    setIsResending(true);

    try {
      const { data, error } = await supabase.functions.invoke("affiliate-resend-code", {
        body: { email },
      });

      if (error) {
        console.error("Resend error:", error);
        toast.error("Erreur lors du renvoi du code");
        return;
      }

      if (data?.error) {
        toast.error(data.error);
        return;
      }

      toast.success("Nouveau code envoyé par email !");
      
      // Start 30 second countdown
      setCountdown(30);
      const timer = setInterval(() => {
        setCountdown((prev) => {
          if (prev <= 1) {
            clearInterval(timer);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    } catch (error: any) {
      console.error("Resend error:", error);
      toast.error("Erreur lors du renvoi du code");
    } finally {
      setIsResending(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (code.length !== 6) {
      toast.error("Le code doit contenir 6 chiffres");
      return;
    }

    setIsLoading(true);

    try {
      const { data, error } = await supabase.functions.invoke("affiliate-verify-code", {
        body: {
          email,
          code,
        },
      });

      console.log("Response data:", data);
      console.log("Response error:", error);

      // Check for data.error first (this is the backend error response)
      if (data?.error) {
        const errorMessage = data.errorType === "expired" 
          ? "Code de vérification expiré. Renvoyez un nouveau code."
          : data.errorType === "invalid"
          ? "Code de vérification incorrect. Veuillez réessayer."
          : data.errorType === "already_verified"
          ? "Email déjà vérifié. Connectez-vous directement."
          : data.error;
        
        toast.error(errorMessage);
        return;
      }

      // Then check for network/function errors
      if (error) {
        console.error("API Error:", error);
        toast.error("Une erreur est survenue. Veuillez réessayer.");
        return;
      }

      toast.success("Email vérifié avec succès !");
      
      // Store user data in localStorage for affiliate system
      localStorage.setItem("affiliate_user", JSON.stringify(data.user));
      
      navigate("/affiliate/dashboard");
    } catch (error: any) {
      console.error("Verify error:", error);
      toast.error("Une erreur est survenue. Veuillez réessayer.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-secondary/20 py-12 flex items-center">
      <div className="container mx-auto px-4 max-w-md">
        <Button
          variant="ghost"
          className="mb-4"
          onClick={() => navigate("/affiliate/signup")}
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Retour
        </Button>

        <Card>
          <CardHeader>
            <CardTitle className="text-2xl">Vérification de l'email</CardTitle>
            <CardDescription>
              Entrez le code à 6 chiffres envoyé à <strong>{email}</strong>
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="code">Code de vérification</Label>
                <Input
                  id="code"
                  value={code}
                  onChange={(e) => setCode(e.target.value.replace(/\D/g, "").slice(0, 6))}
                  placeholder="123456"
                  className="text-center text-2xl tracking-widest"
                  maxLength={6}
                  required
                />
              </div>

              <Button type="submit" className="w-full" disabled={isLoading}>
                {isLoading ? "Vérification..." : "Valider"}
              </Button>

              <div className="text-center space-y-2">
                <p className="text-sm text-muted-foreground">
                  Vous n'avez pas reçu le code ?
                </p>
                <Button
                  type="button"
                  variant="outline"
                  className="w-full"
                  onClick={handleResendCode}
                  disabled={isResending || countdown > 0}
                >
                  <RefreshCw className={`mr-2 h-4 w-4 ${isResending ? 'animate-spin' : ''}`} />
                  {countdown > 0 
                    ? `Renvoyer le code (${countdown}s)`
                    : isResending 
                    ? "Envoi en cours..." 
                    : "Renvoyer le code"
                  }
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default AffiliateVerify;
