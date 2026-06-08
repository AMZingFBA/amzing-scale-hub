import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import SEO from "@/components/SEO";

interface LandingLayoutProps {
  title: string;
  description: string;
  canonical?: string;
  children: React.ReactNode;
}

export const LandingLayout = ({ title, description, children }: LandingLayoutProps) => {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <SEO title={title} description={description} />
      <header className="sticky top-0 z-30 border-b border-border/60 bg-background/95 backdrop-blur">
        <div className="container mx-auto flex h-16 items-center justify-between px-4">
          <Link to="/" className="text-lg font-bold tracking-tight">
            AMZing <span className="text-primary">FBA</span>
          </Link>
          <Button asChild size="sm" className="h-10 px-4">
            <Link to="/demander-rappel">Demander un rappel</Link>
          </Button>
        </div>
      </header>
      <main>{children}</main>
      <footer className="border-t border-border/60 bg-muted/20 py-10">
        <div className="container mx-auto px-4 space-y-4 text-sm text-muted-foreground">
          <p className="text-xs leading-relaxed">
            AMZing FBA est une plateforme indépendante et n'est pas affiliée, sponsorisée ou approuvée par Amazon.
          </p>
          <div className="flex flex-wrap gap-x-4 gap-y-2">
            <Link to="/mentions-legales" className="hover:underline">Mentions légales</Link>
            <Link to="/cgv" className="hover:underline">CGV</Link>
            <Link to="/confidentialite" className="hover:underline">Politique de confidentialité</Link>
          </div>
          <p className="text-xs">© {new Date().getFullYear()} N.Z Consulting — AMZing FBA</p>
        </div>
      </footer>
    </div>
  );
};

export default LandingLayout;
