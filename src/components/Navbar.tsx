import { useState } from "react";
import { Link } from "react-router-dom";
import { Menu, X, User, LogOut, Crown, Shield } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useAuth } from "@/hooks/use-auth";
import { useAdmin } from "@/hooks/use-admin";
import { useMarketplaceUnread } from "@/hooks/use-marketplace-unread";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import logo from "@/assets/logo.png";

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { user, isVIP, signOut } = useAuth();
  const { isAdmin } = useAdmin();
  const { unreadCount } = useMarketplaceUnread();

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
            {user && (
              <>
                <Link to="/acheter" className="text-foreground hover:text-primary transition-colors font-medium relative">
                  Want to Buy
                  {unreadCount > 0 && (
                    <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center">
                      {unreadCount}
                    </span>
                  )}
                </Link>
                <Link to="/vendre" className="text-foreground hover:text-primary transition-colors font-medium">
                  Want to Sell
                </Link>
              </>
            )}
            
            {user ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" size="lg" className="gap-2">
                    <User className="w-4 h-4" />
                    Mon compte
                    {isVIP && (
                      <Badge className="ml-2 bg-gradient-to-r from-primary to-secondary text-white border-0">
                        VIP
                      </Badge>
                    )}
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-48">
                  <div className="px-2 py-1.5">
                    <p className="text-sm font-medium">{user.email}</p>
                    {isVIP && (
                      <p className="text-xs text-muted-foreground">Membre VIP</p>
                    )}
                  </div>
                  <DropdownMenuSeparator />
                  {isVIP && (
                    <>
                      <DropdownMenuItem asChild>
                        <Link to="/dashboard" className="cursor-pointer">
                          <Crown className="w-4 h-4 mr-2" />
                          Espace VIP
                        </Link>
                      </DropdownMenuItem>
                      <DropdownMenuSeparator />
                    </>
                  )}
                  {isAdmin && (
                    <>
                      <DropdownMenuItem asChild>
                        <Link to="/admin/tickets" className="cursor-pointer">
                          <Shield className="w-4 h-4 mr-2" />
                          Administration
                        </Link>
                      </DropdownMenuItem>
                      <DropdownMenuSeparator />
                    </>
                  )}
                  <DropdownMenuItem onClick={signOut}>
                    <LogOut className="w-4 h-4 mr-2" />
                    Se déconnecter
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <div className="flex items-center gap-2">
                <Button variant="outline" size="lg" asChild>
                  <Link to="/auth">Connexion</Link>
                </Button>
                <Button variant="hero" size="lg" asChild>
                  <Link to="/auth">Commencer</Link>
                </Button>
              </div>
            )}
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
            {user && (
              <>
                <Link
                  to="/acheter"
                  className="block text-foreground hover:text-primary transition-colors font-medium py-2 relative"
                  onClick={() => setIsOpen(false)}
                >
                  Want to Buy
                  {unreadCount > 0 && (
                    <span className="absolute top-1 left-24 bg-red-500 text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center">
                      {unreadCount}
                    </span>
                  )}
                </Link>
                <Link
                  to="/vendre"
                  className="block text-foreground hover:text-primary transition-colors font-medium py-2"
                  onClick={() => setIsOpen(false)}
                >
                  Want to Sell
                </Link>
              </>
            )}
            
            {user ? (
              <div className="space-y-2 pt-2 border-t">
                <div className="px-2 py-2">
                  <p className="text-sm font-medium">{user.email}</p>
                  {isVIP && (
                    <Badge className="mt-1 bg-gradient-to-r from-primary to-secondary text-white border-0">
                      Membre VIP
                    </Badge>
                  )}
                </div>
                {isVIP && (
                  <Button
                    variant="default"
                    size="lg"
                    className="w-full"
                    asChild
                  >
                    <Link to="/dashboard" onClick={() => setIsOpen(false)}>
                      <Crown className="w-4 h-4 mr-2" />
                      Espace VIP
                    </Link>
                  </Button>
                )}
                <Button
                  variant="outline"
                  size="lg"
                  className="w-full"
                  onClick={() => {
                    signOut();
                    setIsOpen(false);
                  }}
                >
                  <LogOut className="w-4 h-4 mr-2" />
                  Se déconnecter
                </Button>
              </div>
            ) : (
              <div className="space-y-2 pt-2 border-t">
                <Button variant="outline" size="lg" className="w-full" asChild>
                  <Link to="/auth" onClick={() => setIsOpen(false)}>
                    Connexion
                  </Link>
                </Button>
                <Button variant="hero" size="lg" className="w-full" asChild>
                  <Link to="/auth" onClick={() => setIsOpen(false)}>
                    Commencer
                  </Link>
                </Button>
              </div>
            )}
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
