import { Link } from "react-router-dom";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { ArrowLeft } from "lucide-react";

const MentionsLegales = () => {
  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-muted/20">
      <Navbar />
      
      <main className="container mx-auto px-4 py-12 max-w-4xl">
        <Link
          to="/"
          className="inline-flex items-center gap-2 text-muted-foreground hover:text-primary transition-colors mb-8"
        >
          <ArrowLeft className="w-4 h-4" />
          Retour à l'accueil
        </Link>

        <div className="bg-card rounded-lg shadow-lg p-8 space-y-8">
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold mb-4 bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">
              ✅ MENTIONS LÉGALES
            </h1>
            <p className="text-lg text-muted-foreground">AMZing FBA</p>
          </div>

          <div className="prose prose-sm max-w-none space-y-6">
            <p className="text-muted-foreground">
              Conformément aux dispositions des articles 6-III et 19 de la Loi n°2004-575 du 21 juin 2004 pour la Confiance dans l'Économie Numérique (LCEN), il est porté à la connaissance des utilisateurs du site AMZing FBA les présentes mentions légales.
            </p>

            <section>
              <h2 className="text-2xl font-semibold text-foreground mb-4">1. Éditeur du site</h2>
              <p className="text-muted-foreground mb-2">Le site AMZing FBA est édité par :</p>
              <div className="bg-muted/50 p-4 rounded-lg space-y-1 text-foreground">
                <p><strong>N.Z Consulting</strong></p>
                <p>Statut : Auto-entrepreneur</p>
                <p>SIRET : 993 348 929 00015</p>
                <p>Adresse : 59 Rue de Ponthieu, 75008 Paris, France</p>
                <p>Email : <a href="mailto:contact@amzingfba.com" className="text-primary hover:underline">contact@amzingfba.com</a></p>
              </div>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-foreground mb-4">2. Hébergeur du site</h2>
              <p className="text-muted-foreground mb-2">Le site est hébergé par :</p>
              <div className="bg-muted/50 p-4 rounded-lg space-y-1 text-foreground">
                <p><strong>OVH SAS</strong></p>
                <p>Adresse : 2 rue Kellermann, 59100 Roubaix, France</p>
                <p>Téléphone : 09 72 10 10 07</p>
                <p>Site : <a href="https://www.ovh.com" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">https://www.ovh.com</a></p>
              </div>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-foreground mb-4">3. Propriété intellectuelle</h2>
              <p className="text-muted-foreground">
                L'ensemble du contenu du site AMZing FBA (textes, images, vidéos, logo, éléments graphiques, structure…) est protégé par le droit d'auteur.
              </p>
              <p className="text-muted-foreground">
                Toute reproduction, distribution, modification ou exploitation sans autorisation préalable est interdite.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-foreground mb-4">4. Responsabilité</h2>
              <p className="text-muted-foreground">
                AMZing FBA s'efforce de fournir des informations exactes et mises à jour.
                Toutefois, aucune garantie n'est donnée concernant l'exactitude ou la complétude des contenus.
              </p>
              <p className="text-muted-foreground">
                L'utilisateur est seul responsable de l'usage qu'il fait du site.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-foreground mb-4">5. Données personnelles</h2>
              <p className="text-muted-foreground">
                Pour connaître les modalités de traitement des données personnelles, l'utilisateur est invité à consulter la page{" "}
                <Link to="/privacy" className="text-primary hover:underline">
                  Politique de confidentialité
                </Link>{" "}
                du site.
              </p>
              <p className="text-muted-foreground">
                Conformément au RGPD et à la loi Informatique et Libertés, l'utilisateur peut exercer ses droits (accès, rectification, suppression…) en écrivant à :
              </p>
              <p className="text-primary font-semibold">
                📧 <a href="mailto:contact@amzingfba.com" className="hover:underline">contact@amzingfba.com</a>
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-foreground mb-4">6. Cookies</h2>
              <p className="text-muted-foreground">
                Le site peut utiliser des cookies à des fins de fonctionnement, statistiques ou amélioration de l'expérience utilisateur.
                L'utilisateur peut gérer ses préférences via son navigateur.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-foreground mb-4">7. Contact</h2>
              <p className="text-muted-foreground">Pour toute question ou demande d'information :</p>
              <p className="text-primary font-semibold">
                📧 <a href="mailto:contact@amzingfba.com" className="hover:underline">contact@amzingfba.com</a>
              </p>
            </section>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default MentionsLegales;
