import { useNavigate } from "react-router-dom";
import { Capacitor } from "@capacitor/core";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Link } from "react-router-dom";
import { Check, CreditCard, Shield, Zap, ArrowLeft, PhoneCall } from "lucide-react";

const AndroidPayment = () => {
  const navigate = useNavigate();

  // Rediriger si pas sur une plateforme native (iOS ou Android)
  if (!Capacitor.isNativePlatform()) {
    navigate('/tarifs');
    return null;
  }

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
            Espace VIP
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

          {/* Pricing pitch (no amounts) */}
          <div className="text-center mb-8 px-4 animate-fade-in" style={{ animationDelay: '0.1s' }}>
            <div className="relative w-full flex justify-center">
              <div className="absolute inset-0 bg-gradient-to-r from-primary/20 to-secondary/20 blur-2xl animate-pulse"></div>
              <div className="relative flex flex-col items-center justify-center w-full max-w-xs px-6 py-5 rounded-2xl bg-gradient-to-br from-primary/10 to-secondary/10 border-2 border-primary/30">
                <span className="text-2xl sm:text-3xl font-black bg-gradient-to-r from-primary via-primary to-secondary bg-clip-text text-transparent">
                  Tarif sur mesure
                </span>
                <p className="text-sm text-muted-foreground mt-2">Discuté lors d'un appel de diagnostic gratuit</p>
              </div>
            </div>
            <p className="text-xs sm:text-sm text-muted-foreground mt-4 font-medium px-4">Accès négocié selon tes objectifs</p>
          </div>

          {/* Features */}
          <div className="space-y-3 mb-8">
            {[
              { icon: Zap, text: "Moniteurs automatiques Qogita, Auchan & plus", subtext: "Notifications instantanées sur produits rentables", delay: '0.2s' },
              { icon: Shield, text: "Guides Amazon FBA complets", subtext: "De zéro aux premières ventes", delay: '0.3s' },
              { icon: Check, text: "Fournisseurs privés exclusifs", subtext: "Produits sourcés et testés", delay: '0.4s' },
              { icon: Check, text: "Outils pro inclus", subtext: "Analyses de marché, alertes, conseils niches", delay: '0.5s' },
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
              asChild
              className="relative w-full h-16 text-lg font-bold bg-gradient-to-r from-primary to-secondary hover:from-primary/90 hover:to-secondary/90 shadow-2xl hover:shadow-primary/50 transition-all duration-300 hover-scale"
            >
              <Link to="/demander-rappel" className="flex items-center gap-3">
                <PhoneCall className="h-6 w-6" />
                <span>Demander un rappel</span>
              </Link>
            </Button>
          </div>

          {/* Security Badge */}
          <div className="mt-8 pt-6 border-t border-border/50 animate-fade-in" style={{ animationDelay: '0.7s' }}>
            <div className="flex flex-col items-center gap-3">
              <div className="flex items-center justify-center gap-2 text-sm font-medium text-muted-foreground">
                <Shield className="h-5 w-5 text-primary" />
                <span>Appel de diagnostic gratuit, sans engagement</span>
              </div>
              <div className="flex items-center gap-4 text-xs text-muted-foreground">
                <span>📞 Échange personnalisé</span>
                <span>•</span>
                <span>💬 Réponse rapide</span>
              </div>
            </div>
          </div>
        </Card>

        {/* Info Cards */}
        <div className="max-w-lg mx-auto mt-6 grid grid-cols-3 gap-3">
          {[
            { icon: "📞", title: "Appel gratuit", desc: "Diagnostic personnalisé" },
            { icon: "⚡", title: "Réponse rapide", desc: "Sous 24-48h" },
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
    </div>
  );
};

export default AndroidPayment;
