import { Link } from "react-router-dom";
import logo from "@/assets/logo.png";
import { useAuth } from "@/hooks/use-auth";

const Footer = () => {
  const { isVIP } = useAuth();
  
  // Hide footer for VIP members
  if (isVIP) return null;
  
  return (
    <footer className="bg-card border-t border-border mt-20">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Logo & Description */}
          <div>
            <img src={logo} alt="AMZing FBA" className="h-12 mb-4" />
            <p className="text-muted-foreground max-w-md">
              Votre partenaire complet pour réussir sur Amazon FBA : formation, sourcing, logistique et communauté.
            </p>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-12 pt-8 border-t border-border flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-muted-foreground text-sm">
            © {new Date().getFullYear()} AMZing FBA. Tous droits réservés.
          </p>
          <div className="flex gap-6 text-sm">
            <Link to="/faq" className="text-muted-foreground hover:text-primary transition-colors">
              FAQ
            </Link>
            <Link to="/contact" className="text-muted-foreground hover:text-primary transition-colors">
              Contact
            </Link>
            <Link to="/cgv" className="text-muted-foreground hover:text-primary transition-colors">
              CGV
            </Link>
            <Link to="/privacy" className="text-muted-foreground hover:text-primary transition-colors">
              Confidentialité
            </Link>
            <Link to="/refund" className="text-muted-foreground hover:text-primary transition-colors">
              Remboursement
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
