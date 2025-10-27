import { Link } from "react-router-dom";
import logo from "@/assets/logo.png";
import { useAuth } from "@/hooks/use-auth";
import { Mail, Phone, Clock } from "lucide-react";

const Footer = () => {
  const { isVIP } = useAuth();
  
  return (
    <footer className="relative bg-gradient-to-b from-card via-card to-background border-t border-border mt-20 overflow-hidden">
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none opacity-20">
        <div className="absolute top-0 left-1/4 w-64 h-64 bg-primary/20 rounded-full blur-3xl animate-float" style={{ animationDelay: '0s' }}></div>
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-secondary/20 rounded-full blur-3xl animate-float" style={{ animationDelay: '3s' }}></div>
      </div>

      <div className="container mx-auto px-4 py-12 relative z-10">
        {/* Main Footer Content - Always visible */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
          {/* Logo & Description - Enhanced */}
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
                <Link to="/tarifs" className="text-muted-foreground hover:text-primary transition-all duration-300 hover:translate-x-1 inline-block">
                  Tarifs
                </Link>
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

          {/* Contact Info */}
          <div className="animate-fade-in" style={{ animationDelay: '0.3s' }}>
            <h3 className="text-lg font-semibold mb-4 text-foreground">Nous Contacter</h3>
            <ul className="space-y-3">
              <li className="flex items-start gap-3 group">
                <div className="p-2 rounded-lg bg-primary/10 group-hover:bg-primary/20 transition-colors">
                  <Mail className="w-4 h-4 text-primary" />
                </div>
                <div>
                  <p className="text-xs text-muted-foreground mb-1">Email</p>
                  <a 
                    href="mailto:support@amzingfba.com"
                    className="text-sm text-foreground hover:text-primary transition-colors"
                  >
                    support@amzingfba.com
                  </a>
                </div>
              </li>
              <li className="flex items-start gap-3 group">
                <div className="p-2 rounded-lg bg-primary/10 group-hover:bg-primary/20 transition-colors">
                  <Phone className="w-4 h-4 text-primary" />
                </div>
                <div>
                  <p className="text-xs text-muted-foreground mb-1">Téléphone</p>
                  <Link 
                    to="/contact"
                    className="text-sm text-foreground hover:text-primary transition-colors"
                  >
                    Nous contacter
                  </Link>
                </div>
              </li>
              <li className="flex items-start gap-3 group">
                <div className="p-2 rounded-lg bg-primary/10 group-hover:bg-primary/20 transition-colors">
                  <Clock className="w-4 h-4 text-primary" />
                </div>
                <div>
                  <p className="text-xs text-muted-foreground mb-1">Horaires</p>
                  <p className="text-sm text-foreground">Lundi - Vendredi</p>
                  <p className="text-xs text-muted-foreground">9h00 - 18h00</p>
                </div>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar - Enhanced with animations */}
        <div className="pt-8 border-t border-border/50 flex flex-col md:flex-row justify-between items-center gap-4 animate-fade-in" style={{ animationDelay: '0.4s' }}>
          <p className="text-muted-foreground text-sm">
            © {new Date().getFullYear()} <span className="text-primary font-semibold">AMZing FBA</span>. Tous droits réservés.
          </p>
          <div className="flex gap-6 text-sm">
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
    </footer>
  );
};

export default Footer;
