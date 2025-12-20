import { useState } from "react";
import { Mail, Smartphone, CheckCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import logo from "@/assets/logo-amzing.png";
import SEO from "@/components/SEO";

const AndroidApp = () => {
  const { toast } = useToast();
  const [email, setEmail] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim()) return;

    setIsSubmitting(true);
    try {
      const { error } = await supabase.functions.invoke('airtable-android', {
        body: { email: email.trim() }
      });

      if (error) throw error;

      setIsSubmitted(true);
      setEmail("");
    } catch (error) {
      console.error('Error submitting android request:', error);
      toast({
        title: "Erreur",
        description: "Une erreur est survenue. Réessayez plus tard.",
        variant: "destructive"
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      <SEO
        title="Télécharger l'application Android | AMZing FBA"
        description="Téléchargez l'application AMZing FBA sur Android pour accéder à tous nos outils Amazon FBA depuis votre smartphone."
      />
      
      <div className="min-h-screen bg-gradient-to-b from-background to-card flex items-center justify-center p-4">
        <Card className="w-full max-w-md border-border/50 shadow-xl">
          <CardHeader className="text-center space-y-4">
            <div className="flex justify-center">
              <img src={logo} alt="AMZing FBA" className="h-12" />
            </div>
            <div className="space-y-2">
              <CardTitle className="flex items-center justify-center gap-2 text-xl">
                <Smartphone className="w-6 h-6 text-primary" />
                Application Android
              </CardTitle>
              <CardDescription className="text-base">
                Accédez à tous nos outils Amazon FBA directement depuis votre smartphone Android.
              </CardDescription>
            </div>
          </CardHeader>

          <CardContent>
            {isSubmitted ? (
              <div className="py-8 text-center space-y-4">
                <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto">
                  <CheckCircle className="w-8 h-8 text-primary" />
                </div>
                <div className="space-y-2">
                  <p className="text-lg font-medium text-foreground">
                    Demande enregistrée !
                  </p>
                  <p className="text-sm text-muted-foreground">
                    Vous recevrez le lien de téléchargement par email très prochainement.
                  </p>
                </div>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-2">
                  <label htmlFor="email" className="text-sm font-medium text-foreground">
                    Votre adresse email
                  </label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                    <Input
                      id="email"
                      type="email"
                      placeholder="exemple@email.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                      className="pl-10"
                    />
                  </div>
                </div>
                <Button 
                  type="submit" 
                  className="w-full"
                  disabled={isSubmitting || !email.trim()}
                >
                  {isSubmitting ? 'Envoi en cours...' : 'Recevoir le lien de téléchargement'}
                </Button>
                <p className="text-xs text-center text-muted-foreground">
                  En soumettant ce formulaire, vous acceptez de recevoir le lien de téléchargement par email.
                </p>
              </form>
            )}
          </CardContent>
        </Card>
      </div>
    </>
  );
};

export default AndroidApp;
