import { Link } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import SEO from "@/components/SEO";

const CGV = () => {
  return (
    <>
      <SEO 
        title="Conditions Générales de Vente - AMZing FBA"
        description="Consultez les conditions générales de vente du site et des services AMZing FBA édités par N.Z Consulting."
        keywords="cgv, conditions générales vente, amzing fba, formations, abonnements"
      />
      <div className="min-h-screen bg-gradient-to-br from-background via-background/95 to-primary/5">
        <Navbar />
        
        <Link to="/">
          <Button
            variant="ghost"
            size="icon"
            className="fixed top-[140px] left-4 z-50 bg-primary text-primary-foreground hover:bg-primary/90 hover:scale-105 transition-transform"
          >
            <ArrowLeft className="h-4 w-4" />
          </Button>
        </Link>

        <div className="container mx-auto px-4 pt-32 pb-16">
          <h1 className="text-4xl md:text-5xl font-bold text-center mb-4 bg-gradient-to-r from-primary via-purple-500 to-pink-500 bg-clip-text text-transparent">
            Conditions Générales de Vente
          </h1>
          <p className="text-center text-muted-foreground mb-12">du site et des services AMZing FBA</p>

          <div className="max-w-4xl mx-auto space-y-6">
            <Card className="border-primary/20 hover:border-primary/40 transition-colors">
              <CardContent className="p-6 space-y-4">
                <p className="text-sm text-muted-foreground">(Édités par N.Z Consulting)</p>
                <p className="text-sm text-muted-foreground">Dernière mise à jour : 25 novembre 2025</p>
                
                <div className="space-y-8">
                  <section>
                    <h2 className="text-2xl font-semibold mb-3 text-primary">1. Champ d'application</h2>
                    <p className="text-muted-foreground leading-relaxed mb-3">
                      Les présentes Conditions Générales de Vente (ci-après les « CGV ») s'appliquent, sans restriction ni réserve, à l'ensemble des ventes de :
                    </p>
                    <ul className="list-disc pl-6 space-y-2 text-muted-foreground mb-3">
                      <li>formations en ligne,</li>
                      <li>programmes d'accompagnement, de coaching et de conseil,</li>
                      <li>abonnements, accès membres et contenus numériques,</li>
                      <li>outils, ressources et services proposés sous la marque « AMZing FBA »,</li>
                    </ul>
                    <p className="text-muted-foreground leading-relaxed mb-3">
                      effectuées par N.Z Consulting auprès de clients professionnels ou consommateurs (ci-après le « Client »), via le site internet <a href="https://amzingfba.com" className="text-primary hover:underline">https://amzingfba.com</a> et, le cas échéant, via toute autre interface ou application associée (ci-après le « Site »).
                    </p>
                    <p className="text-muted-foreground leading-relaxed mb-3">
                      Les présentes CGV complètent les <Link to="/cgu" className="text-primary hover:underline">Conditions Générales d'Utilisation (CGU)</Link> du Site. En cas de contradiction, les présentes CGV prévalent pour les aspects commerciaux et contractuels de la vente.
                    </p>
                    <p className="text-muted-foreground leading-relaxed font-semibold">
                      Toute commande implique l'acceptation pleine et entière des présentes CGV par le Client.
                    </p>
                  </section>

                  <section>
                    <h2 className="text-2xl font-semibold mb-3 text-primary">2. Identification du vendeur / prestataire</h2>
                    <p className="text-muted-foreground leading-relaxed mb-3">
                      Les services sont proposés par :
                    </p>
                    <div className="bg-background/50 p-4 rounded-lg">
                      <p className="font-semibold">N.Z Consulting</p>
                      <p className="text-sm text-muted-foreground">Entreprise individuelle immatriculée au Registre National des Entreprises (RNE)</p>
                      <p className="text-sm text-muted-foreground">sous le n° SIREN 993 348 929,</p>
                      <p className="text-sm text-muted-foreground">micro-entreprise relevant du régime spécial BNC,</p>
                      <p className="text-sm text-muted-foreground">dont l'établissement principal est domicilié au :</p>
                      <p className="text-sm text-muted-foreground">59 rue de Ponthieu, Bureau 326, 75008 Paris, France.</p>
                      <p className="text-sm text-muted-foreground mt-2 font-semibold">TVA : TVA non applicable, article 293 B du CGI.</p>
                      <p className="text-sm text-muted-foreground mt-2">Adresse électronique de contact : <a href="mailto:contact@amzingfba.com" className="text-primary hover:underline">contact@amzingfba.com</a></p>
                    </div>
                  </section>

                  <section>
                    <h2 className="text-2xl font-semibold mb-3 text-primary">3. Définitions</h2>
                    <div className="space-y-3">
                      <div>
                        <p className="font-semibold">« Client »</p>
                        <p className="text-sm text-muted-foreground">toute personne physique ou morale procédant à une commande sur le Site, à titre professionnel ou non.</p>
                      </div>
                      <div>
                        <p className="font-semibold">« Consommateur »</p>
                        <p className="text-sm text-muted-foreground">toute personne physique agissant à des fins n'entrant pas dans le cadre de son activité commerciale, industrielle, artisanale, libérale ou agricole.</p>
                      </div>
                      <div>
                        <p className="font-semibold">« Contenu numérique »</p>
                        <p className="text-sm text-muted-foreground">données produites et fournies sous forme numérique (vidéos, modules en ligne, PDF, replays, etc.).</p>
                      </div>
                      <div>
                        <p className="font-semibold">« Service »</p>
                        <p className="text-sm text-muted-foreground">toute prestation de formation, accompagnement, coaching, abonnement, mise à disposition d'outils ou de contenus numériques fournie par le Prestataire.</p>
                      </div>
                      <div>
                        <p className="font-semibold">« Abonnement »</p>
                        <p className="text-sm text-muted-foreground">formule de souscription donnant accès à des Services récurrents pour une durée déterminée, renouvelable ou non.</p>
                      </div>
                    </div>
                  </section>

                  <section>
                    <h2 className="text-2xl font-semibold mb-3 text-primary">4. Informations précontractuelles</h2>
                    <p className="text-muted-foreground leading-relaxed">
                      Avant toute commande, le Client reconnaît avoir reçu, de manière lisible et compréhensible, toutes les informations prévues par le Code de la consommation, et notamment : les caractéristiques essentielles des Services, le prix total TTC, les modalités de paiement, de fourniture et d'exécution, l'existence ou non d'un droit de rétractation, ses conditions, délais et modalités, l'identité du Prestataire et ses coordonnées.
                    </p>
                  </section>

                  <section>
                    <h2 className="text-2xl font-semibold mb-3 text-primary">5. Création de compte et acceptation des CGV</h2>
                    <p className="text-muted-foreground leading-relaxed mb-3">
                      Certaines offres nécessitent la création d'un compte sur le Site.
                    </p>
                    <p className="text-muted-foreground leading-relaxed mb-3">
                      Lors de la validation de la commande, le Client doit cocher la case confirmant qu'il a pris connaissance et accepte les présentes CGV et, le cas échéant, les CGU, la Politique de confidentialité et/ou toute condition spécifique liée à l'offre.
                    </p>
                    <p className="text-muted-foreground leading-relaxed font-semibold">
                      Sans cette acceptation expresse, la commande ne pourra pas être finalisée.
                    </p>
                  </section>

                  <section>
                    <h2 className="text-2xl font-semibold mb-3 text-primary">6. Description des Services</h2>
                    
                    <h3 className="text-xl font-semibold mb-2 mt-4">6.1 Formations, programmes et contenus numériques</h3>
                    <p className="text-muted-foreground leading-relaxed mb-3">
                      Le Prestataire propose notamment des formations en ligne (modules vidéo, PDF, replays, supports pédagogiques) portant principalement sur l'e-commerce, Amazon FBA/FBM, le marketing digital, l'automatisation, l'investissement et l'entrepreneuriat, des programmes d'accompagnement (individuels ou collectifs) pouvant inclure coaching, suivi, sessions en visio, et des contenus numériques mis à disposition via un espace membre sécurisé.
                    </p>

                    <h3 className="text-xl font-semibold mb-2 mt-4">6.2 Abonnements et accès membres</h3>
                    <p className="text-muted-foreground leading-relaxed mb-3">
                      Le Prestataire peut proposer des abonnements mensuels ou annuels donnant accès à des espaces membres, communautés privées, mises à jour de contenus, outils, salons d'échange, etc.
                    </p>

                    <h3 className="text-xl font-semibold mb-2 mt-4">6.3 Coaching et accompagnement individualisé</h3>
                    <p className="text-muted-foreground leading-relaxed">
                      Les prestations de coaching ou conseil individualisé sont fournies selon les modalités indiquées sur la page de vente. Les conseils fournis sont de nature générale et pédagogique et ne constituent en aucun cas un conseil juridique, fiscal, social, comptable ou financier personnalisé, ni un conseil en investissement, ni une promesse ou garantie de résultat.
                    </p>
                  </section>

                  <section>
                    <h2 className="text-2xl font-semibold mb-3 text-primary">7. Prix</h2>
                    <p className="text-muted-foreground leading-relaxed mb-3">
                      Les prix sont indiqués en euros (€), hors TVA, la micro-entreprise du Prestataire n'étant pas assujettie à la TVA : TVA non applicable, article 293 B du CGI.
                    </p>
                    <p className="text-muted-foreground leading-relaxed">
                      Les prix applicables sont ceux affichés sur le Site au moment de la commande. Le Prestataire se réserve la possibilité de modifier ses tarifs à tout moment pour l'avenir.
                    </p>
                  </section>

                  <section>
                    <h2 className="text-2xl font-semibold mb-3 text-primary">8. Commande</h2>
                    
                    <h3 className="text-xl font-semibold mb-2">8.1 Processus de commande</h3>
                    <p className="text-muted-foreground leading-relaxed mb-3">
                      Pour commander, le Client doit sélectionner l'offre souhaitée, vérifier le détail de sa commande, renseigner les informations demandées, accepter les présentes CGV en cochant la case prévue à cet effet, et procéder au paiement.
                    </p>
                    <p className="text-muted-foreground leading-relaxed">
                      La commande n'est définitive qu'après validation du paiement et confirmation par e-mail par le Prestataire.
                    </p>

                    <h3 className="text-xl font-semibold mb-2 mt-4">8.2 Vérification et correction des erreurs</h3>
                    <p className="text-muted-foreground leading-relaxed">
                      Le Client a la possibilité, à chaque étape du processus de commande, de vérifier le détail de sa commande et de corriger d'éventuelles erreurs avant de la valider.
                    </p>
                  </section>

                  <section>
                    <h2 className="text-2xl font-semibold mb-3 text-primary">9. Paiement</h2>
                    
                    <h3 className="text-xl font-semibold mb-2">9.1 Modalités de paiement</h3>
                    <p className="text-muted-foreground leading-relaxed mb-3">
                      Le paiement s'effectue en ligne, de manière sécurisée, par les moyens indiqués sur le Site (carte bancaire, Stripe, etc.). Le Client garantit être pleinement habilité à utiliser le moyen de paiement choisi.
                    </p>

                    <h3 className="text-xl font-semibold mb-2 mt-4">9.2 Défaut de paiement</h3>
                    <p className="text-muted-foreground leading-relaxed">
                      En cas de refus de paiement, de non-paiement ou d'incident de paiement, la commande sera automatiquement annulée ou suspendue, l'accès aux Services pourra être suspendu ou refusé, et le Prestataire se réserve le droit de résilier l'Abonnement.
                    </p>
                  </section>

                  <section>
                    <h2 className="text-2xl font-semibold mb-3 text-primary">10. Abonnements – Renouvellement – Résiliation</h2>
                    
                    <h3 className="text-xl font-semibold mb-2">10.1 Renouvellement</h3>
                    <p className="text-muted-foreground leading-relaxed mb-3">
                      Sauf mention contraire, les abonnements sont reconduits tacitement pour des périodes successives de même durée. Le montant est prélevé à chaque échéance jusqu'à résiliation.
                    </p>

                    <h3 className="text-xl font-semibold mb-2 mt-4">10.2 Résiliation par le Client</h3>
                    <p className="text-muted-foreground leading-relaxed mb-3">
                      Le Client peut résilier son abonnement selon la procédure indiquée dans son espace compte. La résiliation prend effet à l'issue de la période en cours.
                    </p>

                    <h3 className="text-xl font-semibold mb-2 mt-4">10.3 Résiliation par le Prestataire</h3>
                    <p className="text-muted-foreground leading-relaxed">
                      Le Prestataire se réserve le droit de résilier l'abonnement du Client en cas de manquement grave, de comportement frauduleux ou de non-paiement répété.
                    </p>
                  </section>

                  <section>
                    <h2 className="text-2xl font-semibold mb-3 text-primary">11. Droit de rétractation</h2>
                    
                    <h3 className="text-xl font-semibold mb-2">11.1 Principe</h3>
                    <p className="text-muted-foreground leading-relaxed mb-3">
                      Lorsqu'il agit en tant que Consommateur, le Client bénéficie d'un délai de quatorze (14) jours pour exercer son droit de rétractation, conformément au Code de la consommation.
                    </p>

                    <h3 className="text-xl font-semibold mb-2 mt-4">11.2 Exceptions – Contenu numérique et services exécutés</h3>
                    <p className="text-muted-foreground leading-relaxed mb-3">
                      Le droit de rétractation ne s'applique pas à la fourniture de contenus numériques non fournis sur un support matériel, lorsque l'exécution a commencé après accord préalable exprès du consommateur et renoncement exprès à son droit de rétractation.
                    </p>
                    <p className="text-muted-foreground leading-relaxed">
                      Pour accéder immédiatement à un contenu numérique ou une formation, il sera demandé au Client de confirmer sa demande d'exécution immédiate et de reconnaître qu'il perd son droit de rétractation.
                    </p>

                    <h3 className="text-xl font-semibold mb-2 mt-4">11.3 Modalités d'exercice</h3>
                    <p className="text-muted-foreground leading-relaxed">
                      Lorsque applicable, le Client peut exercer son droit de rétractation en adressant une déclaration au Prestataire à <a href="mailto:contact@amzingfba.com" className="text-primary hover:underline">contact@amzingfba.com</a>.
                    </p>
                  </section>

                  <section>
                    <h2 className="text-2xl font-semibold mb-3 text-primary">12. Mise à disposition et accès aux Services</h2>
                    
                    <h3 className="text-xl font-semibold mb-2">12.1 Formations et contenus numériques</h3>
                    <p className="text-muted-foreground leading-relaxed mb-3">
                      Les formations et contenus numériques sont généralement mis à disposition immédiatement après confirmation du paiement via un espace membre.
                    </p>

                    <h3 className="text-xl font-semibold mb-2 mt-4">12.2 Coaching et services</h3>
                    <p className="text-muted-foreground leading-relaxed">
                      Les services de coaching sont fournis selon le calendrier convenu. Le Client s'engage à respecter les rendez-vous fixés.
                    </p>
                  </section>

                  <section>
                    <h2 className="text-2xl font-semibold mb-3 text-primary">13. Obligations du Client</h2>
                    <p className="text-muted-foreground leading-relaxed mb-3">
                      Le Client s'engage à fournir des informations exactes, ne pas partager ses accès personnels avec des tiers, respecter les droits de propriété intellectuelle du Prestataire, et adopter un comportement respectueux.
                    </p>
                    <p className="text-muted-foreground leading-relaxed">
                      Tout manquement grave pourra entraîner la suspension ou la résiliation du compte, sans préjudice de dommages-intérêts.
                    </p>
                  </section>

                  <section>
                    <h2 className="text-2xl font-semibold mb-3 text-primary">14. Propriété intellectuelle</h2>
                    <p className="text-muted-foreground leading-relaxed">
                      Les contenus fournis sont protégés par les lois relatives à la propriété intellectuelle. Le Client bénéficie d'un droit d'usage strictement personnel. Il est interdit de reproduire, diffuser, partager ou revendre les contenus sans accord écrit préalable.
                    </p>
                  </section>

                  <section>
                    <h2 className="text-2xl font-semibold mb-3 text-primary">15. Données personnelles</h2>
                    <p className="text-muted-foreground leading-relaxed">
                      Les données personnelles collectées sont traitées conformément à notre <Link to="/confidentialite" className="text-primary hover:underline">Politique de Confidentialité</Link>. Le Client dispose des droits d'accès, rectification, effacement, opposition, etc.
                    </p>
                  </section>

                  <section>
                    <h2 className="text-2xl font-semibold mb-3 text-primary">16. Responsabilité</h2>
                    <p className="text-muted-foreground leading-relaxed mb-3">
                      Le Prestataire n'est tenu qu'à une obligation de moyens. Il ne garantit pas l'obtention d'un résultat déterminé. Le Client est seul responsable de la mise en œuvre des informations et de la conformité de son activité à la réglementation.
                    </p>
                    <p className="text-muted-foreground leading-relaxed">
                      Le Prestataire ne saurait être tenu responsable des dommages indirects. Pour les Clients professionnels, la responsabilité est limitée au montant effectivement payé sur les douze derniers mois.
                    </p>
                  </section>

                  <section>
                    <h2 className="text-2xl font-semibold mb-3 text-primary">17. Force majeure</h2>
                    <p className="text-muted-foreground leading-relaxed">
                      Le Prestataire ne pourra être tenu responsable en cas de force majeure (événement imprévisible, irrésistible et extérieur).
                    </p>
                  </section>

                  <section>
                    <h2 className="text-2xl font-semibold mb-3 text-primary">18. Médiation (Clients consommateurs)</h2>
                    <p className="text-muted-foreground leading-relaxed">
                      Le Client Consommateur peut recourir gratuitement à un médiateur de la consommation en vue de la résolution amiable d'un litige. Les modalités seront communiquées sur simple demande à <a href="mailto:contact@amzingfba.com" className="text-primary hover:underline">contact@amzingfba.com</a>.
                    </p>
                  </section>

                  <section>
                    <h2 className="text-2xl font-semibold mb-3 text-primary">19. Droit applicable – Juridiction compétente</h2>
                    <p className="text-muted-foreground leading-relaxed">
                      Les présentes CGV sont régies par le droit français. En cas de litige, les parties s'efforceront de rechercher une solution amiable. Pour les Clients professionnels, les tribunaux compétents de Paris seront seuls compétents. Pour les Clients consommateurs, les règles légales de compétence s'appliquent.
                    </p>
                  </section>

                  <section>
                    <h2 className="text-2xl font-semibold mb-3 text-primary">20. Contact</h2>
                    <p className="text-muted-foreground leading-relaxed">
                      Pour toute question relative aux présentes CGV ou aux Services, le Client peut contacter :
                    </p>
                    <div className="bg-background/50 p-4 rounded-lg mt-2">
                      <p className="font-semibold">N.Z Consulting</p>
                      <p>par e-mail : <a href="mailto:contact@amzingfba.com" className="text-primary hover:underline">contact@amzingfba.com</a></p>
                      <p>par courrier : 59 rue de Ponthieu, Bureau 326, 75008 Paris, France</p>
                      <p className="mt-2">ou via notre <Link to="/contact" className="text-primary hover:underline">formulaire de contact</Link></p>
                    </div>
                  </section>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        <Footer />
      </div>
    </>
  );
};

export default CGV;
