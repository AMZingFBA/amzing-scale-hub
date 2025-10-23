import { Link } from "react-router-dom";
import logo from "@/assets/logo.png";

const Footer = () => {
  return (
    <footer className="bg-card border-t border-border mt-20">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Logo & Description */}
          <div className="md:col-span-2">
            <img src={logo} alt="AMZing FBA" className="h-12 mb-4" />
            <p className="text-muted-foreground max-w-md">
              Votre partenaire complet pour réussir sur Amazon FBA : formation, sourcing, logistique et communauté.
            </p>
          </div>

          {/* Services */}
          <div>
            <h3 className="font-bold text-foreground mb-4">Services</h3>
            <ul className="space-y-2">
              <li>
                <Link to="/formation" className="text-muted-foreground hover:text-primary transition-colors">
                  Formation
                </Link>
              </li>
              <li>
                <Link to="/catalogue" className="text-muted-foreground hover:text-primary transition-colors">
                  Catalogue Produits
                </Link>
              </li>
              <li>
                <Link to="/fulfilment" className="text-muted-foreground hover:text-primary transition-colors">
                  Stockage & Fulfilment
                </Link>
              </li>
              <li>
                <Link to="/coaching" className="text-muted-foreground hover:text-primary transition-colors">
                  Coaching Premium
                </Link>
              </li>
            </ul>
          </div>

          {/* Informations */}
          <div>
            <h3 className="font-bold text-foreground mb-4">Informations</h3>
            <ul className="space-y-2">
              <li>
                <Link to="/about" className="text-muted-foreground hover:text-primary transition-colors">
                  À propos
                </Link>
              </li>
              <li>
                <Link to="/case-studies" className="text-muted-foreground hover:text-primary transition-colors">
                  Études de cas
                </Link>
              </li>
              <li>
                <Link to="/faq" className="text-muted-foreground hover:text-primary transition-colors">
                  FAQ
                </Link>
              </li>
              <li>
                <Link to="/contact" className="text-muted-foreground hover:text-primary transition-colors">
                  Contact
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-12 pt-8 border-t border-border flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-muted-foreground text-sm">
            © {new Date().getFullYear()} AMZing FBA. Tous droits réservés.
          </p>
          <div className="flex gap-6 text-sm">
            <Link to="/legal/privacy" className="text-muted-foreground hover:text-primary transition-colors">
              Politique de confidentialité
            </Link>
            <Link to="/legal/terms" className="text-muted-foreground hover:text-primary transition-colors">
              CGV
            </Link>
            <Link to="/legal/mentions" className="text-muted-foreground hover:text-primary transition-colors">
              Mentions légales
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
