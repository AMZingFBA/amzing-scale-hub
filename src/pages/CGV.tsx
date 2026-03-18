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
        description="Consultez les conditions générales de vente du site et des services AMZing FBA."
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
          <p className="text-center text-muted-foreground mb-12">(Édités par N.Z Consulting)</p>

          <div className="max-w-4xl mx-auto space-y-6">
            <Card className="border-primary/20 hover:border-primary/40 transition-colors">
              <CardContent className="p-6 space-y-4">
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
                      Les présentes CGV complètent les <Link to="/cgu" className="text-primary hover:underline">Conditions Générales d'Utilisation (CGU)</Link> du Site.
                    </p>
                    <p className="text-muted-foreground leading-relaxed mb-3">
                      En cas de contradiction, les présentes CGV prévalent pour les aspects commerciaux et contractuels de la vente.
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
                        <p className="text-sm text-muted-foreground">formule de souscription donnant accès à des Services pour une durée annuelle ferme de douze (12) mois.</p>
                      </div>
                    </div>
                  </section>

                  <section>
                    <h2 className="text-2xl font-semibold mb-3 text-primary">4. Informations précontractuelles</h2>
                    <p className="text-muted-foreground leading-relaxed">
                      Avant toute commande, le Client reconnaît avoir reçu, de manière lisible et compréhensible, toutes les informations prévues par le Code de la consommation, et notamment : les caractéristiques essentielles des Services, le prix total TTC, les modalités de paiement, de fourniture et d'exécution, l'existence ou non d'un droit de rétractation, ses conditions, délais et modalités, ainsi que l'identité du Prestataire et ses coordonnées.
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
                      Le Prestataire propose des formations en ligne (modules vidéo, PDF, replays, supports pédagogiques), des programmes d'accompagnement (individuels ou collectifs), ainsi que des contenus numériques mis à disposition via un espace membre sécurisé.
                    </p>

                    <h3 className="text-xl font-semibold mb-2 mt-4">6.2 Abonnement annuel</h3>
                    <p className="text-muted-foreground leading-relaxed mb-3">
                      Les Services sont fournis exclusivement dans le cadre d'un abonnement annuel, conclu pour une durée ferme et incompressible de douze (12) mois.
                    </p>
                    <p className="text-muted-foreground leading-relaxed mb-3">
                      Aucun abonnement mensuel autonome n'est proposé.
                    </p>

                    <h3 className="text-xl font-semibold mb-2 mt-4">6.3 Coaching et accompagnement individualisé</h3>
                    <p className="text-muted-foreground leading-relaxed">
                      Les prestations de coaching ou de conseil sont fournies selon les modalités indiquées sur la page de vente. Les conseils fournis sont de nature générale et pédagogique et ne constituent en aucun cas un conseil juridique, fiscal, comptable ou financier personnalisé, ni une promesse ou garantie de résultat.
                    </p>
                  </section>

                  <section>
                    <h2 className="text-2xl font-semibold mb-3 text-primary">7. Prix</h2>
                    <p className="text-muted-foreground leading-relaxed mb-3">
                      Les prix sont indiqués en euros (€), hors TVA (TVA non applicable – article 293 B du CGI).
                    </p>
                    <p className="text-muted-foreground leading-relaxed mb-3">
                      Le prix de l'abonnement annuel est fixé :
                    </p>
                    <ul className="list-disc pl-6 space-y-2 text-muted-foreground mb-3">
                      <li>à 700 € en cas de paiement comptant annuel,</li>
                      <li>ou à 770 €, correspondant au prix annuel total, lorsque le Client opte pour une facilité de paiement en douze (12) échéances mensuelles.</li>
                    </ul>
                    <p className="text-muted-foreground leading-relaxed">
                      Des offres promotionnelles temporaires peuvent être proposées. Le prix applicable est celui affiché au moment de la commande.
                    </p>
                  </section>

                  <section>
                    <h2 className="text-2xl font-semibold mb-3 text-primary">8. Commande</h2>
                    
                    <h3 className="text-xl font-semibold mb-2">8.1 Processus de commande</h3>
                    <p className="text-muted-foreground leading-relaxed mb-3">
                      Le Client sélectionne l'offre souhaitée, vérifie le détail de sa commande, renseigne les informations demandées, accepte les présentes CGV et procède au paiement.
                    </p>
                    <p className="text-muted-foreground leading-relaxed">
                      La commande n'est définitive qu'après validation du paiement et confirmation par e-mail.
                    </p>

                    <h3 className="text-xl font-semibold mb-2 mt-4">8.2 Vérification des erreurs</h3>
                    <p className="text-muted-foreground leading-relaxed">
                      Le Client peut corriger toute erreur avant validation définitive de la commande.
                    </p>
                  </section>

                  <section>
                    <h2 className="text-2xl font-semibold mb-3 text-primary">9. Paiement</h2>
                    
                    <h3 className="text-xl font-semibold mb-2">9.1 Modalités de paiement</h3>
                    <p className="text-muted-foreground leading-relaxed mb-3">
                      Le paiement s'effectue en ligne via les solutions proposées sur le Site (notamment Stripe et Systeme.io).
                    </p>
                    <p className="text-muted-foreground leading-relaxed mb-3">
                      Le Client peut choisir :
                    </p>
                    <ul className="list-disc pl-6 space-y-2 text-muted-foreground mb-3">
                      <li>soit un paiement unique annuel,</li>
                      <li>soit un paiement en douze (12) échéances mensuelles, à titre de facilité de paiement.</li>
                    </ul>
                    <p className="text-muted-foreground leading-relaxed mb-3">
                      Le paiement échelonné ne constitue en aucun cas un abonnement mensuel, mais un échelonnement du prix annuel total, lequel demeure intégralement dû dès la souscription.
                    </p>
                    <p className="text-muted-foreground leading-relaxed">
                      Le Client reconnaît que la facilité de paiement constitue un engagement de paiement irrévocable portant sur l'intégralité du prix annuel, et autorise expressément le Prestataire (ou son prestataire de paiement) à procéder aux prélèvements/encaissements des échéances, conformément au plan choisi.
                    </p>

                    <h3 className="text-xl font-semibold mb-2 mt-4">9.2 Engagement ferme – Paiement intégral dû</h3>
                    <p className="text-muted-foreground leading-relaxed mb-3">
                      Toute souscription engage le Client pour la totalité de la durée annuelle de douze (12) mois.
                    </p>
                    <p className="text-muted-foreground leading-relaxed">
                      Le montant total de l'abonnement annuel est intégralement exigible, y compris en cas de paiement échelonné, de non-utilisation des Services ou de suspension de l'accès.
                    </p>

                    <h3 className="text-xl font-semibold mb-2 mt-4">9.3 Défaut de paiement – Suspension – Exigibilité immédiate</h3>
                    <p className="text-muted-foreground leading-relaxed mb-3">
                      En cas d'échec de paiement ou de non-paiement d'une échéance :
                    </p>
                    <ul className="list-disc pl-6 space-y-2 text-muted-foreground mb-3">
                      <li>l'accès aux Services est suspendu immédiatement et sans préavis ;</li>
                      <li>une mise en demeure est adressée au Client (par e-mail et/ou courrier recommandé).</li>
                    </ul>
                    <p className="text-muted-foreground leading-relaxed">
                      À défaut de régularisation dans un délai de cinq (5) jours calendaires à compter de l'envoi de la mise en demeure, le solde total restant dû de l'abonnement annuel devient immédiatement exigible.
                    </p>

                    <h3 className="text-xl font-semibold mb-2 mt-4">9.4 Clause pénale (indemnité forfaitaire de retard)</h3>
                    <p className="text-muted-foreground leading-relaxed">
                      En cas de défaut de paiement non régularisé dans le délai indiqué à l'article 9.3, le Client sera redevable, à titre de clause pénale, d'une indemnité forfaitaire égale à 15 % du montant total restant dû, sans préjudice des intérêts légaux éventuels et des frais de recouvrement et/ou de procédure.
                    </p>

                    <h3 className="text-xl font-semibold mb-2 mt-4">9.5 Recouvrement – Frais (distinction Client professionnel / Consommateur)</h3>
                    <p className="text-muted-foreground leading-relaxed mb-3">
                      À défaut de paiement après mise en demeure, le Prestataire se réserve le droit de confier le recouvrement de la créance à un tiers mandaté.
                    </p>
                    <p className="text-muted-foreground leading-relaxed mb-3">
                      <strong>Pour les Clients professionnels :</strong> conformément à l'article L441-10 du Code de commerce, une indemnité forfaitaire de 40 € pour frais de recouvrement sera exigible de plein droit, sans préjudice des frais supplémentaires engagés.
                    </p>
                    <p className="text-muted-foreground leading-relaxed">
                      <strong>Pour les Clients consommateurs :</strong> seuls les frais de recouvrement et/ou de procédure réellement engagés et légalement justifiables pourront être réclamés, dans les limites prévues par la réglementation applicable.
                    </p>
                  </section>

                  <section>
                    <h2 className="text-2xl font-semibold mb-3 text-primary">10. Résiliation</h2>
                    
                    <h3 className="text-xl font-semibold mb-2">10.1 Résiliation par le Client</h3>
                    <p className="text-muted-foreground leading-relaxed mb-3">
                      La résiliation n'est possible qu'à l'issue de la période annuelle de douze (12) mois.
                    </p>
                    <p className="text-muted-foreground leading-relaxed">
                      Aucune résiliation anticipée ne donne lieu à remboursement, total ou partiel, y compris en cas de paiement échelonné ou de suspension de l'accès.
                    </p>

                    <h3 className="text-xl font-semibold mb-2 mt-4">10.2 Résiliation par le Prestataire</h3>
                    <p className="text-muted-foreground leading-relaxed">
                      Le Prestataire se réserve le droit de résilier l'abonnement en cas de manquement grave, de comportement frauduleux ou de non-paiement.
                    </p>
                  </section>

                  <section>
                    <h2 className="text-2xl font-semibold mb-3 text-primary">11. Droit de rétractation</h2>
                    
                    <h3 className="text-xl font-semibold mb-2">11.1 Principe (Clients consommateurs)</h3>
                    <p className="text-muted-foreground leading-relaxed mb-3">
                      Conformément au Code de la consommation, le Client consommateur dispose en principe d'un droit de rétractation, sauf exceptions légales.
                    </p>

                    <h3 className="text-xl font-semibold mb-2 mt-4">11.2 Exception – Contenus numériques / services exécutés immédiatement (L221-28)</h3>
                    <p className="text-muted-foreground leading-relaxed mb-3">
                      Lorsque l'accès aux contenus numériques ou services est fourni immédiatement après achat, le Client consommateur reconnaît expressément :
                    </p>
                    <ul className="list-disc pl-6 space-y-2 text-muted-foreground mb-3">
                      <li>demander l'exécution immédiate des Services avant la fin du délai de rétractation ;</li>
                      <li>reconnaître qu'il perd son droit de rétractation conformément à l'article L221-28 du Code de la consommation.</li>
                    </ul>
                    <p className="text-muted-foreground leading-relaxed">
                      Cette renonciation est matérialisée au moment de la commande par une case à cocher dédiée (non pré-cochée) et/ou toute mention expresse équivalente. À défaut de recueil effectif de cet accord exprès, les règles légales de rétractation demeurent applicables.
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
