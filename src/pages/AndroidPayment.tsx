import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Capacitor } from "@capacitor/core";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Checkbox } from "@/components/ui/checkbox";
import { Link } from "react-router-dom";
import { toast } from "sonner";
import { Check, CreditCard, Shield, Zap, ArrowLeft } from "lucide-react";

const AndroidPayment = () => {
  const navigate = useNavigate();
  const [isProcessing, setIsProcessing] = useState(false);
  const [showCGVModal, setShowCGVModal] = useState(false);
  const [acceptedCGV, setAcceptedCGV] = useState(false);

  // Rediriger si pas sur Android
  if (!Capacitor.isNativePlatform() || Capacitor.getPlatform() !== 'android') {
    navigate('/tarifs');
    return null;
  }

  const handleSubscribe = async () => {
    setShowCGVModal(true);
  };

  const handleConfirmPayment = async () => {
    if (!acceptedCGV) {
      return;
    }

    setShowCGVModal(false);
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
          <div className="text-center mb-8 px-4 animate-fade-in" style={{ animationDelay: '0.1s' }}>
            <div className="relative w-full flex justify-center">
              <div className="absolute inset-0 bg-gradient-to-r from-primary/20 to-secondary/20 blur-2xl animate-pulse"></div>
              <div className="relative flex items-baseline justify-center gap-2 w-full max-w-xs px-6 py-5 rounded-2xl bg-gradient-to-br from-primary/10 to-secondary/10 border-2 border-primary/30">
                <span className="text-5xl sm:text-6xl font-black bg-gradient-to-r from-primary via-primary to-secondary bg-clip-text text-transparent">
                  34,99€
                </span>
                <span className="text-xl sm:text-2xl font-semibold text-muted-foreground">/mois</span>
              </div>
            </div>
            <p className="text-xs sm:text-sm text-muted-foreground mt-4 font-medium px-4">Sans engagement • Annulable à tout moment</p>
          </div>

          {/* Features */}
          <div className="space-y-3 mb-8">
            {[
              { icon: Zap, text: "Moniteurs automatiques Qogita, Auchan & plus", subtext: "Notifications instantanées sur produits rentables", delay: '0.2s' },
              { icon: Shield, text: "Guides Amazon FBA complets", subtext: "De zéro aux premières ventes", delay: '0.3s' },
              { icon: Check, text: "Fournisseurs privés exclusifs", subtext: "Produits sourcés et testés", delay: '0.4s' },
              { icon: Check, text: "Outils pro inclus", subtext: "Stock Checker, alertes, conseils niches", delay: '0.5s' },
            ].map((feature, index) => (
              <div
                key={index}
                className="relative group"
              >
                <div className="absolute inset-0 bg-gradient-to-r from-primary/5 to-secondary/5 rounded-xl blur group-hover:blur-md transition-all"></div>
                <div
                  className="relative flex items-start gap-4 p-4 rounded-xl bg-card/50 backdrop-blur border border-primary/10 hover:border-primary/30 transition-all duration-300 hover-scale animate-fade-in"
                  style={{ animationDelay: feature.delay }}
                >
                  <div className="flex-shrink-0 w-10 h-10 rounded-full bg-gradient-to-br from-primary/20 to-secondary/20 flex items-center justify-center group-hover:scale-110 transition-transform">
                    <feature.icon className="h-5 w-5 text-primary" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold text-foreground mb-0.5">{feature.text}</p>
                    <p className="text-xs text-muted-foreground">{feature.subtext}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* CTA Button */}
          <div className="relative animate-fade-in" style={{ animationDelay: '0.6s' }}>
            <div className="absolute inset-0 bg-gradient-to-r from-primary to-secondary blur-xl opacity-50 animate-pulse"></div>
            <Button
              onClick={handleSubscribe}
              disabled={isProcessing}
              className="relative w-full h-16 text-lg font-bold bg-gradient-to-r from-primary to-secondary hover:from-primary/90 hover:to-secondary/90 shadow-2xl hover:shadow-primary/50 transition-all duration-300 hover-scale"
            >
              {isProcessing ? (
                <div className="flex items-center gap-3">
                  <div className="w-5 h-5 border-3 border-primary-foreground border-t-transparent rounded-full animate-spin" />
                  <span>Traitement...</span>
                </div>
              ) : (
                <div className="flex items-center gap-3">
                  <CreditCard className="h-6 w-6" />
                  <span>S'abonner maintenant</span>
                </div>
              )}
            </Button>
          </div>

          {/* Security Badge */}
          <div className="mt-8 pt-6 border-t border-border/50 animate-fade-in" style={{ animationDelay: '0.7s' }}>
            <div className="flex flex-col items-center gap-3">
              <div className="flex items-center justify-center gap-2 text-sm font-medium text-muted-foreground">
                <Shield className="h-5 w-5 text-primary" />
                <span>Paiement 100% sécurisé par Stripe</span>
              </div>
              <div className="flex items-center gap-4 text-xs text-muted-foreground">
                <span>🔒 SSL Crypté</span>
                <span>•</span>
                <span>💳 Cartes acceptées</span>
                <span>•</span>
                <span>✨ Sans engagement</span>
              </div>
            </div>
          </div>
        </Card>

        {/* Info Cards */}
        <div className="max-w-lg mx-auto mt-6 grid grid-cols-3 gap-3">
          {[
            { icon: "✓", title: "Sans engagement", desc: "Annulez en 1 clic" },
            { icon: "⚡", title: "Accès immédiat", desc: "Dès le paiement" },
            { icon: "💬", title: "Support 24/7", desc: "Réponse rapide" },
          ].map((info, index) => (
            <Card
              key={index}
              className="relative group overflow-hidden animate-fade-in bg-card/90 backdrop-blur border-primary/20 hover:border-primary/40"
              style={{ animationDelay: `${0.8 + index * 0.1}s` }}
            >
              <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
              <div className="relative p-4 text-center">
                <div className="text-2xl mb-2 group-hover:scale-110 transition-transform">{info.icon}</div>
                <p className="font-bold text-xs mb-1">{info.title}</p>
                <p className="text-[10px] text-muted-foreground">{info.desc}</p>
              </div>
            </Card>
          ))}
        </div>
      </div>

      {/* CGV Modal */}
      <Dialog open={showCGVModal} onOpenChange={setShowCGVModal}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Confirmation d'abonnement</DialogTitle>
            <DialogDescription>
              Veuillez accepter les conditions avant de continuer
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4 py-4">
            <div className="bg-primary/5 p-4 rounded-lg border border-primary/20">
              <p className="text-sm font-semibold mb-2">Abonnement VIP AMZing FBA</p>
              <p className="text-2xl font-bold text-primary">34,99€<span className="text-sm font-normal text-muted-foreground">/mois</span></p>
              <p className="text-xs text-muted-foreground mt-2">Sans engagement • Résiliable à tout moment</p>
            </div>

            <div className="flex items-start space-x-3">
              <Checkbox 
                id="cgv-payment" 
                checked={acceptedCGV}
                onCheckedChange={(checked) => setAcceptedCGV(checked === true)}
                className="mt-1"
              />
              <label htmlFor="cgv-payment" className="text-sm leading-relaxed cursor-pointer select-none">
                Je reconnais avoir lu et accepté les{" "}
                <Link 
                  to="/cgv" 
                  target="_blank"
                  className="text-primary hover:underline font-medium"
                  onClick={(e) => e.stopPropagation()}
                >
                  Conditions Générales de Vente
                </Link>
                {" "}et je demande l'exécution immédiate du service.
              </label>
            </div>
          </div>

          <DialogFooter>
            <Button 
              variant="outline" 
              onClick={() => setShowCGVModal(false)}
            >
              Annuler
            </Button>
            <Button 
              onClick={handleConfirmPayment}
              disabled={!acceptedCGV || isProcessing}
              className="bg-gradient-to-r from-primary to-secondary"
            >
              {isProcessing ? 'Traitement...' : 'Confirmer le paiement'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default AndroidPayment;
