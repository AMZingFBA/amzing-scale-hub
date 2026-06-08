import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { CheckCircle2 } from "lucide-react";
import SEO from "@/components/SEO";

const Merci = () => (
  <div className="min-h-screen flex items-center justify-center bg-background px-4">
    <SEO
      title="Demande reçue — AMZing FBA"
      description="Votre demande a bien été envoyée. L'équipe AMZing FBA vous recontactera rapidement."
      robots="noindex,nofollow"
    />
    <div className="max-w-lg text-center space-y-6">
      <div className="w-16 h-16 mx-auto rounded-full bg-primary/10 text-primary flex items-center justify-center">
        <CheckCircle2 className="w-9 h-9" />
      </div>
      <h1 className="text-3xl font-bold">Votre demande a bien été envoyée</h1>
      <p className="text-muted-foreground leading-relaxed">
        Merci ! L'équipe AMZing FBA vous recontactera rapidement pour échanger
        sur votre projet et vous proposer l'accompagnement le plus adapté.
      </p>
      <Button asChild size="lg">
        <Link to="/">Retour à l'accueil</Link>
      </Button>
    </div>
  </div>
);

export default Merci;
