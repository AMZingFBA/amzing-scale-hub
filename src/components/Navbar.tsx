import { useState } from "react";
import { Link } from "react-router-dom";
import { Menu, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import logo from "@/assets/logo.png";

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-background/95 backdrop-blur-sm border-b border-border">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-20">
          <Link to="/" className="flex items-center">
            <img src={logo} alt="AMZing FBA" className="h-12" />
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            <Link to="/services" className="text-foreground hover:text-primary transition-colors font-medium">
              Services
            </Link>
            <Link to="/formation" className="text-foreground hover:text-primary transition-colors font-medium">
              Formation
            </Link>
            <Link to="/catalogue" className="text-foreground hover:text-primary transition-colors font-medium">
              Catalogue
            </Link>
            <Link to="/tarifs" className="text-foreground hover:text-primary transition-colors font-medium">
              Tarifs
            </Link>
            <Link to="/contact" className="text-foreground hover:text-primary transition-colors font-medium">
              Contact
            </Link>
            <Button variant="hero" size="lg" asChild>
              <a href="https://discord.com/channels/1430928328466108619/1430933836958531699" target="_blank" rel="noopener noreferrer">
                Rejoindre Discord
              </a>
            </Button>
          </div>

          {/* Mobile Menu Button */}
          <button
            className="md:hidden text-foreground"
            onClick={() => setIsOpen(!isOpen)}
            aria-label="Toggle menu"
          >
            {isOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>

        {/* Mobile Navigation */}
        {isOpen && (
          <div className="md:hidden py-4 space-y-4">
            <Link
              to="/services"
              className="block text-foreground hover:text-primary transition-colors font-medium py-2"
              onClick={() => setIsOpen(false)}
            >
              Services
            </Link>
            <Link
              to="/formation"
              className="block text-foreground hover:text-primary transition-colors font-medium py-2"
              onClick={() => setIsOpen(false)}
            >
              Formation
            </Link>
            <Link
              to="/catalogue"
              className="block text-foreground hover:text-primary transition-colors font-medium py-2"
              onClick={() => setIsOpen(false)}
            >
              Catalogue
            </Link>
            <Link
              to="/tarifs"
              className="block text-foreground hover:text-primary transition-colors font-medium py-2"
              onClick={() => setIsOpen(false)}
            >
              Tarifs
            </Link>
            <Link
              to="/contact"
              className="block text-foreground hover:text-primary transition-colors font-medium py-2"
              onClick={() => setIsOpen(false)}
            >
              Contact
            </Link>
            <Button variant="hero" size="lg" className="w-full" asChild>
              <a href="https://discord.com/channels/1430928328466108619/1430933836958531699" target="_blank" rel="noopener noreferrer">
                Rejoindre Discord
              </a>
            </Button>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
