import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Capacitor } from "@capacitor/core";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { toast } from "sonner";
import { Check, CreditCard, Shield, Zap, ArrowLeft } from "lucide-react";

const AndroidPayment = () => {
  const navigate = useNavigate();
  const [isProcessing, setIsProcessing] = useState(false);

  // Rediriger si pas sur Android
  if (!Capacitor.isNativePlatform() || Capacitor.getPlatform() !== 'android') {
    navigate('/tarifs');
    return null;
  }

  const handleSubscribe = async () => {
    setIsProcessing(true);
    try {
      const { data: { session } } = await supabase.auth.getSession();
      
      if (!session) {
        toast.error("Vous devez être connecté");
        navigate('/auth');
        return;
      }

      const { data, error } = await supabase.functions.invoke('create-checkout', {
        headers: {
          Authorization: `Bearer ${session.access_token}`
        }
      });

      if (error) throw error;

      if (data?.url) {
        // Ouvrir Stripe Checkout dans le navigateur externe
        window.open(data.url, '_blank');
        toast.success("Redirection vers le paiement...");
      }
    } catch (error: any) {
      console.error('Erreur paiement:', error);
      toast.error("Erreur lors du paiement");
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-primary/5 relative overflow-hidden">
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-10 w-72 h-72 bg-primary/10 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-secondary/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }} />
      </div>

      <div className="relative z-10 container mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => navigate(-1)}
            className="hover-scale"
          >
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <h1 className="text-2xl font-bold bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">
            Paiement Sécurisé
          </h1>
          <div className="w-10" />
        </div>

        {/* Main Card */}
        <Card className="max-w-lg mx-auto p-8 animate-fade-in shadow-2xl border-2 border-primary/20 bg-card/95 backdrop-blur">
          {/* Icon Header */}
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-gradient-to-br from-primary to-primary/60 mb-4 animate-scale-in">
              <CreditCard className="h-10 w-10 text-primary-foreground" />
            </div>
            <h2 className="text-3xl font-bold mb-2">Espace VIP</h2>
            <p className="text-muted-foreground">Accès illimité à tous les outils</p>
          </div>

          {/* Price */}
          <div className="text-center mb-8 animate-fade-in" style={{ animationDelay: '0.1s' }}>
            <div className="inline-flex items-baseline gap-2">
              <span className="text-5xl font-bold bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">
                29,90€
              </span>
              <span className="text-lg text-muted-foreground">/mois</span>
            </div>
            <p className="text-sm text-muted-foreground mt-2">Annulable à tout moment</p>
          </div>

          {/* Features */}
          <div className="space-y-4 mb-8">
            {[
              { icon: Zap, text: "Accès à tous les produits rentables", delay: '0.2s' },
              { icon: Shield, text: "Alertes personnalisées en temps réel", delay: '0.3s' },
              { icon: Check, text: "Support prioritaire 24/7", delay: '0.4s' },
              { icon: Check, text: "Outils d'analyse avancés", delay: '0.5s' },
            ].map((feature, index) => (
              <div
                key={index}
                className="flex items-center gap-3 p-3 rounded-lg bg-primary/5 hover:bg-primary/10 transition-all duration-300 hover-scale animate-fade-in"
                style={{ animationDelay: feature.delay }}
              >
                <div className="flex-shrink-0 w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center">
                  <feature.icon className="h-4 w-4 text-primary" />
                </div>
                <span className="text-sm font-medium">{feature.text}</span>
              </div>
            ))}
          </div>

          {/* CTA Button */}
          <Button
            onClick={handleSubscribe}
            disabled={isProcessing}
            className="w-full h-14 text-lg font-semibold hover-scale animate-fade-in"
            style={{ animationDelay: '0.6s' }}
          >
            {isProcessing ? (
              <div className="flex items-center gap-2">
                <div className="w-5 h-5 border-2 border-primary-foreground border-t-transparent rounded-full animate-spin" />
                <span>Chargement...</span>
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <CreditCard className="h-5 w-5" />
                <span>S'abonner maintenant</span>
              </div>
            )}
          </Button>

          {/* Security Badge */}
          <div className="mt-6 pt-6 border-t border-border animate-fade-in" style={{ animationDelay: '0.7s' }}>
            <div className="flex items-center justify-center gap-2 text-sm text-muted-foreground">
              <Shield className="h-4 w-4" />
              <span>Paiement 100% sécurisé par Stripe</span>
            </div>
          </div>
        </Card>

        {/* Info Cards */}
        <div className="max-w-lg mx-auto mt-6 grid grid-cols-2 gap-4">
          {[
            { title: "Sans engagement", desc: "Annulez quand vous voulez" },
            { title: "Support 24/7", desc: "Assistance prioritaire" },
          ].map((info, index) => (
            <Card
              key={index}
              className="p-4 text-center hover-scale animate-fade-in bg-card/80 backdrop-blur"
              style={{ animationDelay: `${0.8 + index * 0.1}s` }}
            >
              <p className="font-semibold text-sm mb-1">{info.title}</p>
              <p className="text-xs text-muted-foreground">{info.desc}</p>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
};

export default AndroidPayment;
