import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const Privacy = () => {
  return (
    <div className="min-h-screen">
      <Navbar />
      
      <div className="pt-32 pb-20">
        <div className="container mx-auto px-4 max-w-4xl">
          <h1 className="text-4xl md:text-5xl font-bold mb-8 text-center">
            🔒 Politique de Confidentialité (RGPD)
          </h1>
          
          <Card className="mb-8">
            <CardHeader>
              <CardTitle>Collecte des données</CardTitle>
            </CardHeader>
            <CardContent className="prose prose-lg max-w-none">
              <p>Nous collectons des informations personnelles lorsque tu t'inscris, passes une commande ou accèdes à ton espace client.</p>
              <p>Les données concernées peuvent inclure : nom, prénom, e-mail, adresse, historique de commandes et données de paiement.</p>
            </CardContent>
          </Card>

          <Card className="mb-8">
            <CardHeader>
              <CardTitle>Finalité du traitement</CardTitle>
            </CardHeader>
            <CardContent className="prose prose-lg max-w-none">
              <p>Ces données sont collectées pour :</p>
              <ul>
                <li>Gérer les commandes et abonnements,</li>
                <li>Fournir un support client,</li>
                <li>Améliorer les services,</li>
                <li>Envoyer des actualités et offres marketing (si accord explicite).</li>
              </ul>
            </CardContent>
          </Card>

          <Card className="mb-8">
            <CardHeader>
              <CardTitle>Conservation des données</CardTitle>
            </CardHeader>
            <CardContent className="prose prose-lg max-w-none">
              <p>Tes données sont conservées pendant la durée légale nécessaire à la gestion du service.</p>
              <p>Tu peux demander la suppression de tes données à tout moment en écrivant à :<br />
              📧 contact@amzingfba.com</p>
            </CardContent>
          </Card>

          <Card className="mb-8">
            <CardHeader>
              <CardTitle>Sécurité</CardTitle>
            </CardHeader>
            <CardContent className="prose prose-lg max-w-none">
              <p>AMZing FBA met en œuvre toutes les mesures techniques et organisationnelles nécessaires pour garantir la sécurité de tes données (chiffrement SSL, hébergement sécurisé, authentification renforcée).</p>
            </CardContent>
          </Card>

          <Card className="mb-8">
            <CardHeader>
              <CardTitle>Partage des données</CardTitle>
            </CardHeader>
            <CardContent className="prose prose-lg max-w-none">
              <p>Aucune donnée n'est vendue ni cédée à des tiers.</p>
              <p>Certaines données peuvent être transmises à des partenaires techniques (Stripe, Whop) strictement pour la gestion du service.</p>
            </CardContent>
          </Card>

          <Card className="mb-8">
            <CardHeader>
              <CardTitle>Tes droits</CardTitle>
            </CardHeader>
            <CardContent className="prose prose-lg max-w-none">
              <p>Conformément au RGPD, tu disposes d'un droit d'accès, de rectification, d'opposition, de portabilité et de suppression.</p>
              <p>Tu peux exercer ces droits à tout moment via notre adresse e-mail.</p>
            </CardContent>
          </Card>

          <Card className="mb-8">
            <CardHeader>
              <CardTitle>⚙️ Politique de Cookies</CardTitle>
            </CardHeader>
            <CardContent className="prose prose-lg max-w-none">
              <p>Ce site utilise des cookies afin de :</p>
              <ul>
                <li>Assurer le bon fonctionnement technique du site,</li>
                <li>Analyser la fréquentation (Google Analytics),</li>
                <li>Améliorer ton expérience utilisateur.</li>
              </ul>
              <p>Tu peux gérer tes préférences à tout moment depuis ton navigateur.</p>
              <p>Le refus des cookies peut limiter certaines fonctionnalités.</p>
            </CardContent>
          </Card>

          <div className="text-center mt-12 p-6 bg-muted rounded-lg">
            <p className="text-lg font-semibold mb-2">📬 Contact</p>
            <p className="text-muted-foreground">
              Pour toute question concernant la politique de confidentialité :<br />
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

export default Privacy;
