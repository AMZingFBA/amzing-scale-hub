import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

const Confidentialite = () => {
  return (
    <div className="min-h-screen">
      <Navbar />
      
      <div className="pt-32 pb-20">
        <div className="container mx-auto px-4 max-w-3xl">
          <h1 className="text-4xl md:text-5xl font-bold mb-4 text-center">
            Politique de confidentialité — AMZing FBA
          </h1>
          
          <p className="text-center text-muted-foreground mb-12">
            Dernière mise à jour : 2 novembre 2025
          </p>

          <div className="prose prose-lg max-w-none space-y-8">
            <p className="text-lg">
              Chez AMZing FBA, nous respectons la confidentialité de vos données.
            </p>

            <section>
              <h2 className="text-2xl font-semibold mb-3">1. Données collectées</h2>
              <p>
                Nous ne collectons que les informations strictement nécessaires au bon fonctionnement de l'application : identifiant, email et données d'abonnement.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-3">2. Utilisation des données</h2>
              <p>
                Ces données servent uniquement à vous authentifier, gérer votre abonnement VIP et améliorer votre expérience utilisateur.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-3">3. Partage des données</h2>
              <p>
                Aucune donnée personnelle n'est partagée, vendue ou transmise à des tiers.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-3">4. Sécurité</h2>
              <p>
                Vos informations sont stockées de manière sécurisée via Firebase (Google Cloud) et chiffrées selon les standards industriels.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-3">5. Contact</h2>
              <p>
                Pour toute question : <a href="mailto:contact@amzingfba.com" className="text-primary hover:underline">contact@amzingfba.com</a>
              </p>
            </section>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default Confidentialite;
