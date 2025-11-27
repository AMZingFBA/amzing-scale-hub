import { Link } from "react-router-dom";
import logo from "@/assets/logo-amzing.png";
import { useAuth } from "@/hooks/use-auth";
import { useAdmin } from "@/hooks/use-admin";
import { Mail } from "lucide-react";
import { Capacitor } from "@capacitor/core";
import { Browser } from "@capacitor/browser";

const Footer = () => {
  const { isVIP } = useAuth();
  const { isAdmin } = useAdmin();
  
  return (
    <footer className="relative bg-gradient-to-b from-card via-card to-background border-t border-border mt-20 overflow-hidden">
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none opacity-20">
        <div className="absolute top-0 left-1/4 w-64 h-64 bg-primary/20 rounded-full blur-3xl animate-float" style={{ animationDelay: '0s' }}></div>
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-secondary/20 rounded-full blur-3xl animate-float" style={{ animationDelay: '3s' }}></div>
      </div>

      <div className="container mx-auto px-4 py-12 relative z-10">
        {/* Main Footer Content */}
        {(isVIP || isAdmin) ? (
          // Rich footer for VIP members and admins
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
            {/* Logo & Description */}
            <div className="group animate-fade-in">
              <div className="relative inline-block mb-4">
                <img 
                  src={logo} 
                  alt="AMZing FBA" 
                  className="h-12 transition-all duration-500 group-hover:scale-110 group-hover:drop-shadow-[0_0_15px_rgba(255,153,0,0.5)]" 
                />
                <div className="absolute -inset-2 bg-gradient-to-r from-primary/0 via-primary/20 to-primary/0 rounded-lg blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
              </div>
              <p className="text-muted-foreground max-w-sm leading-relaxed">
                Votre espace VIP pour réussir sur <span className="text-primary font-semibold">Amazon FBA</span>
              </p>
            </div>

            {/* Quick Links */}
            <div className="animate-fade-in" style={{ animationDelay: '0.1s' }}>
              <h3 className="text-lg font-semibold mb-4 text-foreground">Liens rapides</h3>
              <ul className="space-y-2">
                <li>
                  <Link to="/dashboard" className="text-muted-foreground hover:text-primary transition-all duration-300 hover:translate-x-1 inline-block">
                    Dashboard
                  </Link>
                </li>
                <li>
                  <Link to="/chat" className="text-muted-foreground hover:text-primary transition-all duration-300 hover:translate-x-1 inline-block">
                    Communauté
                  </Link>
                </li>
                <li>
                  <Link to="/support" className="text-muted-foreground hover:text-primary transition-all duration-300 hover:translate-x-1 inline-block">
                    Support
                  </Link>
                </li>
                <li>
                  <Link to="/profile" className="text-muted-foreground hover:text-primary transition-all duration-300 hover:translate-x-1 inline-block">
                    Mon profil
                  </Link>
                </li>
              </ul>
            </div>

            {/* Contact */}
            <div className="animate-fade-in" style={{ animationDelay: '0.2s' }}>
              <h3 className="text-lg font-semibold mb-4 text-foreground">Besoin d'aide ?</h3>
              <p className="text-muted-foreground mb-4 text-sm">
                Notre équipe est disponible pour vous accompagner
              </p>
              <Link 
                to="/contact"
                className="inline-flex items-center gap-2 px-6 py-3 bg-primary/10 hover:bg-primary hover:text-white text-primary rounded-lg transition-all duration-300 hover:scale-105 hover:shadow-lg hover:shadow-primary/20 group"
              >
                <Mail className="w-4 h-4 group-hover:animate-pulse" />
                <span className="font-semibold">Nous contacter</span>
              </Link>
            </div>
          </div>
        ) : (
          // Full footer for non-VIP users
          <div className="grid gap-8 mb-12 grid-cols-1 md:grid-cols-3">
            {/* Logo & Description */}
            <div className="group animate-fade-in" style={{ animationDelay: '0.1s' }}>
              <div className="relative inline-block mb-4">
                <img 
                  src={logo} 
                  alt="AMZing FBA" 
                  className="h-12 transition-all duration-500 group-hover:scale-110 group-hover:drop-shadow-[0_0_15px_rgba(255,153,0,0.5)] animate-fade-in" 
                />
                <div className="absolute -inset-2 bg-gradient-to-r from-primary/0 via-primary/20 to-primary/0 rounded-lg blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
              </div>
              <p className="text-muted-foreground max-w-md leading-relaxed animate-fade-in" style={{ animationDelay: '0.2s' }}>
                Votre partenaire complet pour réussir sur <span className="text-primary font-semibold">Amazon FBA</span> : formation, sourcing, logistique et communauté.
              </p>
            </div>

            {/* Quick Links */}
            <div className="animate-fade-in" style={{ animationDelay: '0.2s' }}>
              <h3 className="text-lg font-semibold mb-4 text-foreground">Navigation</h3>
              <ul className="space-y-2">
                <li>
                  <Link to="/services" className="text-muted-foreground hover:text-primary transition-all duration-300 hover:translate-x-1 inline-block">
                    Nos Services
                  </Link>
                </li>
                <li>
                  {Capacitor.isNativePlatform() ? (
                    <button 
                      onClick={() => Browser.open({ url: 'https://amzingfba.com/tarifs' })}
                      className="text-muted-foreground hover:text-primary transition-all duration-300 hover:translate-x-1 inline-block"
                    >
                      Tarifs
                    </button>
                  ) : (
                    <Link to="/tarifs" className="text-muted-foreground hover:text-primary transition-all duration-300 hover:translate-x-1 inline-block">
                      Tarifs
                    </Link>
                  )}
                </li>
                <li>
                  <Link to="/formation" className="text-muted-foreground hover:text-primary transition-all duration-300 hover:translate-x-1 inline-block">
                    Formation
                  </Link>
                </li>
                <li>
                  <Link to="/faq" className="text-muted-foreground hover:text-primary transition-all duration-300 hover:translate-x-1 inline-block">
                    FAQ
                  </Link>
                </li>
              </ul>
            </div>

            {/* Contact CTA */}
            <div className="animate-fade-in" style={{ animationDelay: '0.3s' }}>
              <h3 className="text-lg font-semibold mb-4 text-foreground">Besoin d'aide ?</h3>
              <p className="text-muted-foreground mb-4 text-sm">
                Notre équipe est là pour répondre à toutes vos questions
              </p>
              <Link 
                to="/contact"
                className="inline-flex items-center gap-2 px-6 py-3 bg-primary/10 hover:bg-primary hover:text-white text-primary rounded-lg transition-all duration-300 hover:scale-105 hover:shadow-lg hover:shadow-primary/20 group"
              >
                <Mail className="w-4 h-4 group-hover:animate-pulse" />
                <span className="font-semibold">Contactez-nous</span>
              </Link>
            </div>
          </div>
        )}

        {/* Bottom Bar */}
        <div className="pt-8 border-t border-border/50 animate-fade-in" style={{ animationDelay: '0.4s' }}>
          {/* Copyright et liens */}
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-muted-foreground text-sm">
              © {new Date().getFullYear()} <span className="text-primary font-semibold">AMZing FBA</span>. Tous droits réservés.
            </p>
            <div className="flex gap-6 text-sm flex-wrap justify-center">
            <Link 
              to="/mentions-legales" 
              className="relative text-muted-foreground hover:text-primary transition-all duration-300 hover:scale-110 after:absolute after:bottom-0 after:left-0 after:w-0 after:h-0.5 after:bg-primary after:transition-all after:duration-300 hover:after:w-full"
            >
              Mentions Légales
            </Link>
            <Link 
              to="/faq" 
              className="relative text-muted-foreground hover:text-primary transition-all duration-300 hover:scale-110 after:absolute after:bottom-0 after:left-0 after:w-0 after:h-0.5 after:bg-primary after:transition-all after:duration-300 hover:after:w-full"
            >
              FAQ
            </Link>
            <Link 
              to="/contact" 
              className="relative text-muted-foreground hover:text-primary transition-all duration-300 hover:scale-110 after:absolute after:bottom-0 after:left-0 after:w-0 after:h-0.5 after:bg-primary after:transition-all after:duration-300 hover:after:w-full"
            >
              Contact
            </Link>
            <Link 
              to="/cgv" 
              className="relative text-muted-foreground hover:text-primary transition-all duration-300 hover:scale-110 after:absolute after:bottom-0 after:left-0 after:w-0 after:h-0.5 after:bg-primary after:transition-all after:duration-300 hover:after:w-full"
            >
              CGV
            </Link>
            <Link 
              to="/cgu" 
              className="relative text-muted-foreground hover:text-primary transition-all duration-300 hover:scale-110 after:absolute after:bottom-0 after:left-0 after:w-0 after:h-0.5 after:bg-primary after:transition-all after:duration-300 hover:after:w-full"
            >
              CGU
            </Link>
            <Link 
              to="/privacy" 
              className="relative text-muted-foreground hover:text-primary transition-all duration-300 hover:scale-110 after:absolute after:bottom-0 after:left-0 after:w-0 after:h-0.5 after:bg-primary after:transition-all after:duration-300 hover:after:w-full"
            >
              Confidentialité
            </Link>
            <Link 
              to="/refund" 
              className="relative text-muted-foreground hover:text-primary transition-all duration-300 hover:scale-110 after:absolute after:bottom-0 after:left-0 after:w-0 after:h-0.5 after:bg-primary after:transition-all after:duration-300 hover:after:w-full"
            >
              Remboursement
            </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
