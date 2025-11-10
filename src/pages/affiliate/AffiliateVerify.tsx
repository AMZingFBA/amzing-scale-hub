import { useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { ArrowLeft } from "lucide-react";

const AffiliateVerify = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const email = searchParams.get("email") || "";

  const [code, setCode] = useState("");
  const [isLoading, setIsLoading] = useState(false);

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

      if (error) throw error;

      toast.success("Email vérifié avec succès !");
      
      // Store user data in localStorage for affiliate system
      localStorage.setItem("affiliate_user", JSON.stringify(data.user));
      
      navigate("/affiliate/dashboard");
    } catch (error: any) {
      console.error("Verify error:", error);
      toast.error(error.message || "Code de vérification invalide");
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

              <p className="text-sm text-center text-muted-foreground">
                Vous n'avez pas reçu le code ? Vérifiez vos spams
              </p>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default AffiliateVerify;
