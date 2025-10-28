import { useState } from "react";
import { Link } from "react-router-dom";
import { Menu, X, User, LogOut, Crown, Shield } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useAuth } from "@/hooks/use-auth";
import { useAdmin } from "@/hooks/use-admin";
import { useMarketplaceBuyUnread } from "@/hooks/use-marketplace-buy-unread";
import { useMarketplaceSellUnread } from "@/hooks/use-marketplace-sell-unread";
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
  const { unreadCount: buyUnreadCount } = useMarketplaceBuyUnread();
  const { unreadCount: sellUnreadCount } = useMarketplaceSellUnread();
  const totalMarketplaceUnread = buyUnreadCount + sellUnreadCount;
  
  // Détection si on est dans l'app native pour ajuster le padding pour la safe area
  const isNativeApp = Capacitor.isNativePlatform();

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-background/95 backdrop-blur-sm border-b border-border">
      <div className={`container mx-auto px-4 ${isNativeApp ? 'navbar-safe-area' : ''}`}>
        <div className="flex items-center justify-between h-20">
          <Link to="/" className="flex items-center group">
            <img src={logo} alt="AMZing FBA" className="h-12 transition-transform group-hover:scale-105" />
          </Link>

          {/* Desktop Navigation - Hidden on native app */}
          <div className={`items-center space-x-8 ${isNativeApp ? 'hidden' : 'hidden md:flex'}`}>
            {!isVIP && (
              <Link to="/contact" className="text-foreground hover:text-primary transition-colors font-medium">
                Contact
              </Link>
            )}
            {user && !isVIP && (
              <>
                <Link to="/acheter" className="text-foreground hover:text-primary transition-colors font-medium relative">
                  Want to Buy
                  {buyUnreadCount > 0 && (
                    <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center">
                      {buyUnreadCount}
                    </span>
                  )}
                </Link>
                <Link to="/vendre" className="text-foreground hover:text-primary transition-colors font-medium relative">
                  Want to Sell
                  {sellUnreadCount > 0 && (
                    <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center">
                      {sellUnreadCount}
                    </span>
                  )}
                </Link>
              </>
            )}
            
            {user ? (
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

          {/* Native App Menu - Compact dropdown for mobile app */}
          {isNativeApp && (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" className="h-12 w-12 hover:bg-primary/10 transition-all">
                  <Menu className="h-6 w-6" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-72 bg-background/98 backdrop-blur-lg z-50 animate-scale-in shadow-elegant border-2 border-primary/20">
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
                    {isVIP && (
                      <DropdownMenuItem asChild className="py-3 text-base">
                        <Link to="/dashboard" className="cursor-pointer">
                          <Crown className="w-5 h-5 mr-3" />
                          Espace VIP
                        </Link>
                      </DropdownMenuItem>
                    )}
                    {!isVIP && (
                      <>
                        <DropdownMenuItem asChild className="py-3 text-base">
                          <Link to="/acheter" className="cursor-pointer relative">
                            Want to Buy
                            {buyUnreadCount > 0 && (
                              <Badge variant="destructive" className="ml-auto animate-pulse">{buyUnreadCount}</Badge>
                            )}
                          </Link>
                        </DropdownMenuItem>
                        <DropdownMenuItem asChild className="py-3 text-base">
                          <Link to="/vendre" className="cursor-pointer relative">
                            Want to Sell
                            {sellUnreadCount > 0 && (
                              <Badge variant="destructive" className="ml-auto animate-pulse">{sellUnreadCount}</Badge>
                            )}
                          </Link>
                        </DropdownMenuItem>
                        <DropdownMenuItem asChild className="py-3 text-base">
                          <Link to="/contact" className="cursor-pointer">
                            Contact
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
                    <DropdownMenuItem asChild className="py-3 text-base">
                      <Link to="/auth" className="cursor-pointer">
                        Connexion
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem asChild className="py-3 text-base bg-gradient-to-r from-primary/10 to-secondary/10">
                      <Link to="/auth" className="cursor-pointer font-semibold">
                        Commencer
                      </Link>
                    </DropdownMenuItem>
                  </>
                )}
              </DropdownMenuContent>
            </DropdownMenu>
          )}

          {/* Web Mobile Menu Button */}
          <button
            className={`text-foreground ${isNativeApp ? 'hidden' : 'md:hidden'}`}
            onClick={() => setIsOpen(!isOpen)}
            aria-label="Toggle menu"
          >
            {isOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>

        {/* Mobile Navigation */}
        {isOpen && (
          <div className="md:hidden py-4 space-y-4">
            {!isVIP && (
              <Link
                to="/contact"
                className="block text-foreground hover:text-primary transition-colors font-medium py-2"
                onClick={() => setIsOpen(false)}
              >
                Contact
              </Link>
            )}
            {user && !isVIP && (
              <>
                <Link
                  to="/acheter"
                  className="block text-foreground hover:text-primary transition-colors font-medium py-2 relative"
                  onClick={() => setIsOpen(false)}
                >
                  Want to Buy
                  {buyUnreadCount > 0 && (
                    <span className="absolute top-1 left-24 bg-red-500 text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center">
                      {buyUnreadCount}
                    </span>
                  )}
                </Link>
                <Link
                  to="/vendre"
                  className="block text-foreground hover:text-primary transition-colors font-medium py-2 relative"
                  onClick={() => setIsOpen(false)}
                >
                  Want to Sell
                  {sellUnreadCount > 0 && (
                    <span className="absolute top-1 left-28 bg-red-500 text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center">
                      {sellUnreadCount}
                    </span>
                  )}
                </Link>
              </>
            )}
            
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
