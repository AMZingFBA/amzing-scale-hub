import { Link } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import SEO from "@/components/SEO";
import { seoData } from "@/lib/seo-data";

const CGU = () => {
  return (
    <>
      <SEO 
        title={seoData.cgu.title}
        description={seoData.cgu.description}
        keywords={seoData.cgu.keywords}
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
          <h1 className="text-4xl md:text-5xl font-bold text-center mb-12 bg-gradient-to-r from-primary via-purple-500 to-pink-500 bg-clip-text text-transparent">
            Conditions Générales d'Utilisation
          </h1>

          <div className="max-w-4xl mx-auto space-y-6">
            <Card className="border-primary/20 hover:border-primary/40 transition-colors">
              <CardContent className="p-6 space-y-4">
                <p className="text-sm text-muted-foreground">Dernière mise à jour : 25 novembre 2025</p>
                
                <div className="space-y-6">
                  <section>
                    <h2 className="text-2xl font-semibold mb-3 text-primary">1. Objet des CGU</h2>
                    <p className="text-muted-foreground leading-relaxed">
                      Les présentes Conditions Générales d'Utilisation (ci-après les « CGU ») ont pour objet de définir les conditions et modalités d'accès et d'utilisation :
                    </p>
                    <ul className="list-disc pl-6 mt-2 space-y-2 text-muted-foreground">
                      <li>du site internet accessible à l'adresse : <a href="https://amzingfba.com" className="text-primary hover:underline">https://amzingfba.com</a>,</li>
                      <li>et, le cas échéant, de toute application mobile, progressive web app ou interface associée sous la marque « AMZing FBA » (ci-après ensemble le « Service »),</li>
                    </ul>
                    <p className="text-muted-foreground leading-relaxed mt-4">
                      édités et exploités par :
                    </p>
                    <div className="bg-background/50 p-4 rounded-lg mt-2">
                      <p className="font-semibold">AMZing FBA</p>
                      <p className="text-sm text-muted-foreground mt-2">Adresse électronique de contact : <a href="mailto:contact@amzingfba.com" className="text-primary hover:underline">contact@amzingfba.com</a></p>
                    </div>
                    <p className="text-muted-foreground leading-relaxed mt-4">
                      L'accès au Service et son utilisation impliquent l'acceptation pleine, entière et sans réserve des présentes CGU par toute personne physique ou morale utilisant le Service (ci-après l'« Utilisateur » ou « Vous »).
                    </p>
                  </section>

                  <section>
                    <h2 className="text-2xl font-semibold mb-3 text-primary">2. Définitions</h2>
                    <p className="text-muted-foreground leading-relaxed mb-3">
                      Aux fins des présentes CGU, les termes ci-dessous auront la signification suivante :
                    </p>
                    <div className="space-y-3">
                      <div>
                        <p className="font-semibold">« Service »</p>
                        <p className="text-sm text-muted-foreground">le site internet, les applications, espaces membres, outils numériques, contenus, fonctionnalités, ainsi que l'ensemble des services, gratuits ou payants, proposés sous la marque AMZing FBA.</p>
                      </div>
                      <div>
                        <p className="font-semibold">« Utilisateur »</p>
                        <p className="text-sm text-muted-foreground">toute personne qui accède au Service, à quelque titre que ce soit, qu'elle soit simple visiteur ou titulaire d'un Compte.</p>
                      </div>
                      <div>
                        <p className="font-semibold">« Compte »</p>
                        <p className="text-sm text-muted-foreground">l'espace personnel de l'Utilisateur sur le Service, créé après inscription, accessible via des Identifiants, et permettant d'accéder à certains contenus, fonctionnalités ou services.</p>
                      </div>
                      <div>
                        <p className="font-semibold">« Identifiants »</p>
                        <p className="text-sm text-muted-foreground">les données personnelles permettant d'identifier l'Utilisateur, telles que l'adresse e-mail, le mot de passe et/ou tout autre moyen d'authentification (code, double authentification, connexion via service tiers, etc.).</p>
                      </div>
                      <div>
                        <p className="font-semibold">« Contenus Utilisateur »</p>
                        <p className="text-sm text-muted-foreground">toutes informations, données, textes, images, avis, commentaires, messages, fichiers, etc. mis en ligne par l'Utilisateur sur le Service.</p>
                      </div>
                      <div>
                        <p className="font-semibold">« Données personnelles »</p>
                        <p className="text-sm text-muted-foreground">toutes informations se rapportant à une personne physique identifiée ou identifiable, au sens de la réglementation applicable (RGPD, loi Informatique et Libertés, etc.).</p>
                      </div>
                    </div>
                  </section>

                  <section>
                    <h2 className="text-2xl font-semibold mb-3 text-primary">3. Acceptation des CGU</h2>
                    <h3 className="text-xl font-semibold mb-2">3.1 Acceptation lors de la création de Compte</h3>
                    <p className="text-muted-foreground leading-relaxed mb-3">
                      Lors de la création d'un Compte, l'Utilisateur est obligatoirement invité à :
                    </p>
                    <ul className="list-disc pl-6 space-y-2 text-muted-foreground">
                      <li>prendre connaissance des présentes CGU,</li>
                      <li>cocher la case suivante (ou équivalente) : « Je reconnais avoir lu et accepté les Conditions Générales d'Utilisation. »</li>
                    </ul>
                    <p className="text-muted-foreground leading-relaxed mt-3">
                      Cette case ne peut pas être pré-cochée. En l'absence de cette acceptation expresse, la création du Compte ne peut pas être finalisée.
                    </p>
                    
                    <h3 className="text-xl font-semibold mb-2 mt-4">3.2 Acceptation en poursuivant la navigation</h3>
                    <p className="text-muted-foreground leading-relaxed">
                      À défaut de création de Compte, le simple accès et la navigation sur le Service valent acceptation pleine et entière des présentes CGU. Si l'Utilisateur refuse tout ou partie des CGU, il doit immédiatement cesser d'utiliser le Service.
                    </p>
                  </section>

                  <section>
                    <h2 className="text-2xl font-semibold mb-3 text-primary">4. Modification des CGU</h2>
                    <p className="text-muted-foreground leading-relaxed">
                      L'Éditeur se réserve le droit de modifier à tout moment les présentes CGU, notamment pour tenir compte des évolutions techniques du Service, de la législation ou de la réglementation, et de l'évolution de ses offres, fonctionnalités ou de son modèle économique.
                    </p>
                    <p className="text-muted-foreground leading-relaxed mt-3">
                      En cas de modification substantielle, les Utilisateurs titulaires d'un Compte pourront être informés par tout moyen approprié. La poursuite de l'utilisation du Service après l'entrée en vigueur des nouvelles CGU vaut acceptation de ces dernières.
                    </p>
                  </section>

                  <section>
                    <h2 className="text-2xl font-semibold mb-3 text-primary">5. Description du Service</h2>
                    <p className="text-muted-foreground leading-relaxed mb-3">
                      Le Service AMZing FBA a pour objet de proposer notamment, sans que cette liste soit limitative :
                    </p>
                    <ul className="list-disc pl-6 space-y-2 text-muted-foreground">
                      <li>des services de conseil, formation et accompagnement dans les domaines du commerce en ligne, de l'e-commerce (notamment Amazon FBA/FBM et marketplaces), du marketing digital, de l'optimisation des ventes, de l'automatisation et du développement d'activités digitales ;</li>
                      <li>la mise à disposition de contenus pédagogiques (articles, vidéos, modules de formation, supports écrits, check-lists, outils, etc.) ;</li>
                      <li>l'accès à une académie numérique orientée business, e-commerce, investissement et entrepreneuriat digital ;</li>
                      <li>l'organisation de sessions de suivi, de coaching ou d'accompagnement, individuels ou collectifs, en présentiel ou à distance ;</li>
                      <li>la gestion et l'animation d'une communauté (forums, groupes, salons privés, espaces d'échange, etc.) dédiée aux vendeurs et entrepreneurs ;</li>
                      <li>à terme, la mise à disposition d'outils numériques, applications ou plateformes éducatives destinés à faciliter la formation en ligne et l'entrepreneuriat digital.</li>
                    </ul>

                    <h3 className="text-xl font-semibold mb-2 mt-4">5.1 Absence de conseil personnalisé et de garantie de résultats</h3>
                    <p className="text-muted-foreground leading-relaxed">
                      Les informations, formations, outils, simulations, contenus, stratégies et exemples fournis via le Service sont de nature générale et pédagogique, ne constituent ni un conseil juridique, fiscal, social, comptable ou financier personnalisé, ni un conseil en investissement financier au sens du Code monétaire et financier, et ne valent en aucun cas promesse, garantie ou obligation de résultat.
                    </p>
                  </section>

                  <section>
                    <h2 className="text-2xl font-semibold mb-3 text-primary">6. Création de Compte</h2>
                    <p className="text-muted-foreground leading-relaxed mb-3">
                      Certaines fonctionnalités nécessitent la création d'un Compte. Pour ce faire, l'Utilisateur doit :
                    </p>
                    <ul className="list-disc pl-6 space-y-2 text-muted-foreground">
                      <li>fournir des informations exactes, complètes et à jour ;</li>
                      <li>choisir un mot de passe suffisamment robuste ;</li>
                      <li>lire et accepter expressément les présentes CGU en cochant la case dédiée ;</li>
                      <li>le cas échéant, accepter également les conditions générales de vente (CGV) applicables aux offres payantes.</li>
                    </ul>
                  </section>

                  <section>
                    <h2 className="text-2xl font-semibold mb-3 text-primary">7. Propriété intellectuelle</h2>
                    <p className="text-muted-foreground leading-relaxed">
                      Le Service et chacun des éléments qui le composent (structure, design, textes, images, vidéos, logos, bases de données, logiciels, etc.) sont protégés par les lois relatives à la propriété intellectuelle et appartiennent à l'Éditeur ou à ses partenaires.
                    </p>
                  </section>

                  <section>
                    <h2 className="text-2xl font-semibold mb-3 text-primary">8. Données personnelles</h2>
                    <p className="text-muted-foreground leading-relaxed">
                      La gestion des Données personnelles est décrite dans notre <Link to="/confidentialite" className="text-primary hover:underline">Politique de Confidentialité</Link>. Conformément à la réglementation applicable, l'Utilisateur dispose de droits (accès, rectification, effacement, opposition, limitation, portabilité, etc.).
                    </p>
                  </section>

                  <section>
                    <h2 className="text-2xl font-semibold mb-3 text-primary">9. Responsabilité</h2>
                    <p className="text-muted-foreground leading-relaxed">
                      L'Éditeur n'est responsable que des dommages directs prouvés subis par l'Utilisateur, résultant d'un manquement à ses obligations contractuelles. L'Éditeur ne saurait être tenu responsable des dommages indirects, des conséquences de décisions ou d'investissements pris par l'Utilisateur, ou de l'inadéquation du Service aux objectifs particuliers de l'Utilisateur.
                    </p>
                  </section>

                  <section>
                    <h2 className="text-2xl font-semibold mb-3 text-primary">10. Droit applicable</h2>
                    <p className="text-muted-foreground leading-relaxed">
                      Les présentes CGU sont régies par le droit français. En cas de difficulté ou de litige, l'Utilisateur est invité à contacter l'Éditeur afin de rechercher une solution amiable.
                    </p>
                  </section>

                  <section>
                    <h2 className="text-2xl font-semibold mb-3 text-primary">11. Contact</h2>
                    <p className="text-muted-foreground leading-relaxed">
                      Pour toute question relative aux présentes CGU, contactez-nous :
                    </p>
                    <div className="bg-background/50 p-4 rounded-lg mt-2">
                      <p>Par e-mail : <a href="mailto:contact@amzingfba.com" className="text-primary hover:underline">contact@amzingfba.com</a></p>
                      <p>Ou via notre <Link to="/contact" className="text-primary hover:underline">formulaire de contact</Link></p>
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

export default CGU;
