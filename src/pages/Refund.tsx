import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Link } from "react-router-dom";
import { ArrowLeft } from "lucide-react";

const Refund = () => {
  return (
    <div className="min-h-screen">
      <Navbar />
      
      {/* SEO H1/H2 - Invisible */}
      <h1 className="sr-only">
        Politique de remboursement AMZing FBA
      </h1>
      <h2 className="sr-only">
        Conditions de remboursement, annulation et rétractation pour les services AMZing FBA
      </h2>
      
      <Link
        to="/"
        className="fixed top-[140px] left-4 z-50 bg-primary text-white p-2 rounded-full shadow-lg hover:scale-110 transition-transform"
      >
        <ArrowLeft className="w-5 h-5" />
      </Link>
      
      <div className="pt-32 pb-20">
        <div className="container mx-auto px-4 max-w-4xl">
          <h1 className="text-4xl md:text-5xl font-bold mb-8 text-center">
            💸 Politique de Remboursement
          </h1>
          
          <Card className="mb-8">
            <CardHeader>
              <CardTitle>Formations et abonnements</CardTitle>
            </CardHeader>
            <CardContent className="prose prose-lg max-w-none">
              <p>Les formations et abonnements AMZing FBA étant des contenus numériques activés immédiatement après l'achat, ils ne sont pas remboursables conformément à l'article L121-21-8 du Code de la consommation.</p>
            </CardContent>
          </Card>

          <Card className="mb-8">
            <CardHeader>
              <CardTitle>Services logistiques</CardTitle>
            </CardHeader>
            <CardContent className="prose prose-lg max-w-none">
              <p>Les prestations AMZing FBA 360 sont réalisées sur mesure et à la demande du client.</p>
              <p>Aucun remboursement n'est possible une fois la prestation exécutée.</p>
              <p>Toute erreur ou anomalie doit être signalée dans un délai de 48 heures après réception.</p>
            </CardContent>
          </Card>

          <Card className="mb-8">
            <CardHeader>
              <CardTitle>Erreur de facturation</CardTitle>
            </CardHeader>
            <CardContent className="prose prose-lg max-w-none">
              <p>En cas d'erreur ou de double paiement, un remboursement intégral sera effectué sous 7 jours ouvrés après vérification par notre service comptable.</p>
            </CardContent>
          </Card>

          <Card className="mb-8">
            <CardHeader>
              <CardTitle>Annulation d'abonnement</CardTitle>
            </CardHeader>
            <CardContent className="prose prose-lg max-w-none">
              <p>Tu peux annuler ton abonnement VIP à tout moment via ton compte Whop ou en contactant le support.</p>
              <p>L'annulation prend effet à la prochaine échéance mensuelle.</p>
            </CardContent>
          </Card>

          <div className="text-center mt-12 p-6 bg-muted rounded-lg">
            <p className="text-lg font-semibold mb-2">📬 Contact</p>
            <p className="text-muted-foreground">
              Pour toute question concernant la politique de remboursement :<br />
              📧 contact@amzingfba.com<br />
              📍 AMZing FBA — Service Client
            </p>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default Refund;
