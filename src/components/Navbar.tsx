import { useState } from "react";
import { Link } from "react-router-dom";
import { Menu, X, User, LogOut, Crown, Shield, LayoutDashboard, MessageSquare, ShoppingBag, Store, Handshake } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useAuth } from "@/hooks/use-auth";
import { useAdmin } from "@/hooks/use-admin";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Capacitor } from "@capacitor/core";
import logo from "@/assets/logo-amzing.png";

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { user, isVIP, signOut } = useAuth();
  const { isAdmin } = useAdmin();
  
  // Détection si on est dans l'app native pour ajuster le padding pour la safe area
  const isNativeApp = Capacitor.isNativePlatform();

  // Native App - Floating menu button only
  if (isNativeApp) {
    return (
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button 
            variant="outline" 
            className="fixed top-[46px] right-[18px] z-[100] h-14 w-14 border-2 border-primary bg-primary/10 hover:bg-primary/20 hover:scale-110 active:scale-95 transition-all duration-300 rounded-lg animate-border-glow font-bold shadow-glow backdrop-blur-sm"
          >
            <Menu className="h-7 w-7 text-primary" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent 
          align="end" 
          className="w-72 bg-background/98 backdrop-blur-lg z-50 shadow-elegant border-2 border-primary/20 mr-4 mt-2 animate-in slide-in-from-top-4 fade-in duration-300"
        >
          {user ? (
            <>
              <div className="px-4 py-3 bg-gradient-to-r from-primary/10 to-secondary/10 rounded-lg m-2">
                <p className="text-base font-semibold">{user.email}</p>
                {isVIP && (
                  <Badge className="mt-2 bg-gradient-to-r from-primary to-secondary text-white border-0 shadow-glow">
                    VIP
                  </Badge>
                )}
              </div>
              <DropdownMenuSeparator className="my-2" />
              <DropdownMenuItem asChild className="py-3 text-base">
                <Link to="/affiliate" className="cursor-pointer">
                  <Handshake className="w-5 h-5 mr-3" />
                  Deviens partenaire
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem asChild className="py-3 text-base">
                <Link to="/profile" className="cursor-pointer">
                  <User className="w-5 h-5 mr-3" />
                  Profil
                </Link>
              </DropdownMenuItem>
              {isVIP && (
                // Menu VIP
                <>
                  <DropdownMenuItem asChild className="py-3 text-base">
                    <Link to="/dashboard" className="cursor-pointer">
                      <LayoutDashboard className="w-5 h-5 mr-3" />
                      Dashboard
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild className="py-3 text-base">
                    <Link to="/chat" className="cursor-pointer">
                      <MessageSquare className="w-5 h-5 mr-3" />
                      Chat
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild className="py-3 text-base">
                    <Link to="/catalogue-produits" className="cursor-pointer">
                      <ShoppingBag className="w-5 h-5 mr-3" />
                      Catalogue
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild className="py-3 text-base">
                    <Link to="/marketplace" className="cursor-pointer">
                      <Store className="w-5 h-5 mr-3" />
                      Marketplace
                    </Link>
                  </DropdownMenuItem>
                </>
              )}
              {isAdmin && (
                <DropdownMenuItem asChild className="py-3 text-base">
                  <Link to="/admin/tickets" className="cursor-pointer">
                    <Shield className="w-5 h-5 mr-3" />
                    Administration
                  </Link>
                </DropdownMenuItem>
              )}
              <DropdownMenuSeparator className="my-2" />
              <DropdownMenuItem onClick={signOut} className="py-3 text-base text-destructive focus:text-destructive">
                <LogOut className="w-5 h-5 mr-3" />
                Se déconnecter
              </DropdownMenuItem>
            </>
          ) : (
            <>
              <DropdownMenuItem asChild className="py-3 text-base">
                <Link to="/contact" className="cursor-pointer">
                  Contact
                </Link>
              </DropdownMenuItem>
              <DropdownMenuSeparator className="my-2" />
              <DropdownMenuItem asChild className="py-3 text-base bg-gradient-to-r from-primary/10 to-secondary/10">
                <Link to="/affiliate" className="cursor-pointer font-semibold">
                  <Handshake className="w-5 h-5 mr-3" />
                  Deviens partenaire
                </Link>
              </DropdownMenuItem>
              <DropdownMenuSeparator className="my-2" />
              <DropdownMenuItem asChild className="py-3 text-base">
                <Link to="/auth" className="cursor-pointer">
                  Connexion
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem asChild className="py-3 text-base bg-gradient-to-r from-primary/10 to-secondary/10">
                <Link to="/auth?tab=signup" className="cursor-pointer font-semibold">
                  Inscription
                </Link>
              </DropdownMenuItem>
            </>
          )}
        </DropdownMenuContent>
      </DropdownMenu>
    );
  }

  // Web version - Full navbar
  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-background/95 backdrop-blur-sm border-b border-border">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-20">
          <Link to={isVIP || isAdmin ? "/dashboard" : "/"} className="flex items-center group select-none">
            <img src={logo} alt="AMZing FBA" className="h-12 transition-transform group-hover:scale-105 select-none pointer-events-none" draggable="false" />
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            {user ? (
              <>
                <Button variant="outline" size="lg" asChild className="hover-scale transition-all duration-300">
                  <Link to="/affiliate" className="gap-2">
                    <Handshake className="w-4 h-4" />
                    Deviens partenaire
                  </Link>
                </Button>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button 
                      variant="outline" 
                      size="lg" 
                      className={`gap-2 transition-all ${isVIP ? 'border-primary/50 hover:border-primary bg-gradient-to-r from-primary/5 to-secondary/5' : ''}`}
                    >
                      <User className="w-5 h-5" />
                      <span className="font-semibold">Mon compte</span>
                      {isVIP && (
                        <Badge className="ml-1 bg-gradient-to-r from-primary to-secondary text-white border-0 shadow-lg">
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
                  <DropdownMenuItem asChild>
                    <Link to="/profile" className="cursor-pointer">
                      <User className="w-4 h-4 mr-2" />
                      Profil
                    </Link>
                  </DropdownMenuItem>
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
              </>
            ) : (
              <div className="flex items-center gap-2">
                <Button variant="outline" size="lg" asChild className="hover-scale transition-all duration-300">
                  <Link to="/affiliate" className="gap-2">
                    <Handshake className="w-4 h-4" />
                    Deviens partenaire
                  </Link>
                </Button>
                <Button variant="outline" size="lg" asChild>
                  <Link to="/auth">Connexion</Link>
                </Button>
                <Button variant="hero" size="lg" asChild>
                  <Link to="/auth?tab=signup">Commencer</Link>
                </Button>
              </div>
            )}
          </div>

          {/* Web Mobile Menu Button */}
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
            {user ? (
              <div className="space-y-2 pt-2 border-t">
                <div className="px-2 py-3 bg-gradient-to-r from-primary/10 to-secondary/10 rounded-lg">
                  <p className="text-sm font-semibold">{user.email}</p>
                  {isVIP && (
                    <Badge className="mt-2 bg-gradient-to-r from-primary to-secondary text-white border-0 shadow-lg">
                      Membre VIP
                    </Badge>
                  )}
                </div>
                <Button variant="outline" size="lg" className="w-full" asChild>
                  <Link to="/affiliate" onClick={() => setIsOpen(false)}>
                    <Handshake className="w-4 h-4 mr-2" />
                    Deviens partenaire
                  </Link>
                </Button>
                <Button
                  variant="outline"
                  size="lg"
                  className="w-full"
                  asChild
                >
                  <Link to="/profile" onClick={() => setIsOpen(false)}>
                    <User className="w-4 h-4 mr-2" />
                    Profil
                  </Link>
                </Button>
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
                  <Link to="/affiliate" onClick={() => setIsOpen(false)}>
                    <Handshake className="w-4 h-4 mr-2" />
                    Deviens partenaire
                  </Link>
                </Button>
                <Button variant="outline" size="lg" className="w-full" asChild>
                  <Link to="/auth" onClick={() => setIsOpen(false)}>
                    Connexion
                  </Link>
                </Button>
                <Button variant="hero" size="lg" className="w-full" asChild>
                  <Link to="/auth?tab=signup" onClick={() => setIsOpen(false)}>
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
