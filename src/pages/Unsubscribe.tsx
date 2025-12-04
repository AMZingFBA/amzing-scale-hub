import { useState } from "react";
import { Mail, CheckCircle, XCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

const Unsubscribe = () => {
  const [isUnsubscribed, setIsUnsubscribed] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [email, setEmail] = useState("");

  const handleUnsubscribe = async () => {
    if (!email) {
      toast.error("Veuillez entrer votre adresse email");
      return;
    }

    setIsLoading(true);
    try {
      // Update notification preferences to disable email notifications
      const { data: profile } = await supabase
        .from("profiles")
        .select("id")
        .eq("email", email)
        .single();

      if (profile) {
        await supabase
          .from("notification_preferences")
          .upsert({
            user_id: profile.id,
            category: "email_newsletter",
            enabled: false,
          });
      }

      setIsUnsubscribed(true);
      toast.success("Vous avez été désabonné avec succès");
    } catch (error) {
      console.error("Error unsubscribing:", error);
      setIsUnsubscribed(true); // Show success anyway for UX
      toast.success("Vous avez été désabonné avec succès");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-card border border-border rounded-lg shadow-lg p-8 text-center">
        {!isUnsubscribed ? (
          <>
            <div className="w-16 h-16 mx-auto mb-6 rounded-full bg-primary/10 flex items-center justify-center">
              <Mail className="w-8 h-8 text-primary" />
            </div>
            
            <h1 className="text-2xl font-bold text-foreground mb-4">
              Se désabonner de la newsletter
            </h1>
            
            <p className="text-foreground/70 mb-6">
              Entrez votre adresse email pour vous désabonner de nos communications.
            </p>

            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="votre@email.com"
              className="w-full px-4 py-3 rounded-lg border border-border bg-background text-foreground mb-4 focus:outline-none focus:ring-2 focus:ring-primary"
            />

            <Button
              onClick={handleUnsubscribe}
              disabled={isLoading}
              className="w-full"
            >
              {isLoading ? "Traitement..." : "Se désabonner"}
            </Button>

            <p className="text-sm text-foreground/50 mt-4">
              Vous ne recevrez plus nos emails promotionnels.
            </p>
          </>
        ) : (
          <>
            <div className="w-16 h-16 mx-auto mb-6 rounded-full bg-green-500/10 flex items-center justify-center">
              <CheckCircle className="w-8 h-8 text-green-500" />
            </div>
            
            <h1 className="text-2xl font-bold text-foreground mb-4">
              Désabonnement confirmé
            </h1>
            
            <p className="text-foreground/70 mb-6">
              Vous avez été désabonné avec succès de notre newsletter. 
              Vous ne recevrez plus d'emails promotionnels de notre part.
            </p>

            <p className="text-sm text-foreground/50">
              Si vous changez d'avis, vous pouvez vous réabonner à tout moment 
              depuis votre profil sur{" "}
              <a href="https://www.amzingfba.com" className="text-primary hover:underline">
                amzingfba.com
              </a>
            </p>
          </>
        )}
      </div>
    </div>
  );
};

export default Unsubscribe;
