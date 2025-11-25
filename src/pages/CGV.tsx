import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Link } from "react-router-dom";
import { ArrowLeft } from "lucide-react";

const CGV = () => {
  return (
    <div className="min-h-screen">
      <Navbar />
      
      {/* SEO H1/H2 - Invisible */}
      <h1 className="sr-only">
        Conditions générales de vente AMZing FBA
      </h1>
      <h2 className="sr-only">
        Conditions d'utilisation, achat, abonnement et prestations proposées par AMZing FBA
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
            ⚖️ Conditions Générales de Vente
          </h1>
          
          <Card className="mb-8">
            <CardHeader>
              <CardTitle>Article 1 — Objet</CardTitle>
            </CardHeader>
            <CardContent className="prose prose-lg max-w-none">
              <p>Les présentes conditions régissent la vente de services proposés par AMZing FBA, notamment :</p>
              <ul>
                <li>Formations en ligne et ressources éducatives,</li>
                <li>Accès à la communauté privée VIP,</li>
                <li>Services de sourcing, stockage, expédition et accompagnement e-commerce.</li>
              </ul>
            </CardContent>
          </Card>

          <Card className="mb-8">
            <CardHeader>
              <CardTitle>Article 2 — Commandes et accès</CardTitle>
            </CardHeader>
            <CardContent className="prose prose-lg max-w-none">
              <p>L'accès aux produits et services s'effectue via le site amzingfba.com ou ses plateformes partenaires (Whop, Stripe).</p>
              <p>Toute commande validée implique l'acceptation pleine et entière des présentes conditions générales.</p>
            </CardContent>
          </Card>

          <Card className="mb-8">
            <CardHeader>
              <CardTitle>Article 3 — Tarifs</CardTitle>
            </CardHeader>
            <CardContent className="prose prose-lg max-w-none">
              <p>Les prix sont exprimés en euros (€), hors taxes.</p>
              <p>AMZing FBA se réserve le droit de modifier ses tarifs à tout moment, mais les services restent facturés sur la base du tarif en vigueur au moment de la commande.</p>
            </CardContent>
          </Card>

          <Card className="mb-8">
            <CardHeader>
              <CardTitle>Article 4 — Paiement</CardTitle>
            </CardHeader>
            <CardContent className="prose prose-lg max-w-none">
              <p>Le paiement est exigible immédiatement lors de la commande.</p>
              <p>Les transactions sont sécurisées via Stripe, Whop ou PayPal.</p>
              <p>Aucun remboursement n'est effectué après activation du service (cf. politique de remboursement).</p>
            </CardContent>
          </Card>

          <Card className="mb-8">
            <CardHeader>
              <CardTitle>Article 5 — Abonnements</CardTitle>
            </CardHeader>
            <CardContent className="prose prose-lg max-w-none">
              <p>Les abonnements VIP sont sans engagement et peuvent être annulés à tout moment via le compte client Whop.</p>
              <p>Toute période entamée reste due.</p>
            </CardContent>
          </Card>

          <Card className="mb-8">
            <CardHeader>
              <CardTitle>Article 6 — Prestations logistiques</CardTitle>
            </CardHeader>
            <CardContent className="prose prose-lg max-w-none">
              <p>Les prestations AMZing FBA 360 (stockage, emballage, expédition) sont exécutées selon les délais convenus avec le client.</p>
              <p>Les colis sont expédiés sous 24h ouvrées sauf cas de force majeure.</p>
              <p>AMZing FBA ne saurait être tenu responsable en cas de retard ou de perte due au transporteur.</p>
            </CardContent>
          </Card>

          <Card className="mb-8">
            <CardHeader>
              <CardTitle>Article 7 — Responsabilité</CardTitle>
            </CardHeader>
            <CardContent className="prose prose-lg max-w-none">
              <p>AMZing FBA agit comme prestataire de service logistique et ne peut être tenu responsable des erreurs de prix, de descriptions ou de conformité des produits appartenant à un tiers.</p>
            </CardContent>
          </Card>

          <Card className="mb-8">
            <CardHeader>
              <CardTitle>Article 8 — Propriété intellectuelle</CardTitle>
            </CardHeader>
            <CardContent className="prose prose-lg max-w-none">
              <p>Les contenus, formations et supports AMZing FBA sont protégés par le droit d'auteur.</p>
              <p>Toute reproduction, vente ou diffusion sans autorisation est strictement interdite.</p>
            </CardContent>
          </Card>

          <Card className="mb-8">
            <CardHeader>
              <CardTitle>Article 9 — Données personnelles</CardTitle>
            </CardHeader>
            <CardContent className="prose prose-lg max-w-none">
              <p>Les données collectées sont traitées conformément à la politique de confidentialité.</p>
              <p>Le client dispose d'un droit d'accès, de rectification et de suppression de ses données.</p>
            </CardContent>
          </Card>

          <Card className="mb-8">
            <CardHeader>
              <CardTitle>Article 10 — Droit applicable</CardTitle>
            </CardHeader>
            <CardContent className="prose prose-lg max-w-none">
              <p>Les présentes conditions sont régies par le droit français.</p>
              <p>En cas de litige, le tribunal compétent sera celui du siège social d'AMZing FBA.</p>
            </CardContent>
          </Card>

          <div className="text-center mt-12 p-6 bg-muted rounded-lg">
            <p className="text-lg font-semibold mb-2">📬 Contact</p>
            <p className="text-muted-foreground">
              Pour toute question concernant les conditions générales :<br />
              📧 contact@amzingfba.com
            </p>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default CGV;
