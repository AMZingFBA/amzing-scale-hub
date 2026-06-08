import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import LandingLayout from "@/components/lead/LandingLayout";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { ArrowRight } from "lucide-react";

const faqs = [
  {
    q: "À qui s'adresse AMZing FBA ?",
    a: "AMZing FBA s'adresse aux personnes qui souhaitent se former à Amazon FBA ou être accompagnées dans la structuration de leur activité : débutants, vendeurs Amazon en cours d'évolution, e-commerçants ou indépendants.",
  },
  {
    q: "Faut-il déjà vendre sur Amazon ?",
    a: "Non. Il n'est pas nécessaire d'avoir un compte vendeur ou de vendre déjà sur Amazon pour rejoindre AMZing FBA. La formation couvre aussi la création et la structuration du compte vendeur.",
  },
  {
    q: "Est-ce adapté aux débutants ?",
    a: "Oui. Le programme commence par les fondamentaux d'Amazon FBA (FBA vs FBM, frais, ouverture du compte) avant d'aborder l'analyse produit, le sourcing et le suivi de l'activité.",
  },
  {
    q: "L'accompagnement garantit-il des résultats ?",
    a: "Non. AMZing FBA ne garantit aucun résultat financier. Les résultats dépendent du profil, du budget, du marché, du travail fourni et de la stratégie appliquée.",
  },
  {
    q: "Comment fonctionne le paiement ?",
    a: "L'accès annuel est à 700 € TTC/an, ou en 12 mensualités d'environ 64 €/mois, soit un engagement annuel de 12 mois.",
  },
  {
    q: "Que se passe-t-il après ma demande de rappel ?",
    a: "Après l'envoi du formulaire, vous êtes redirigé vers une page de confirmation et un membre de l'équipe AMZing FBA vous recontacte pour échanger sur votre projet, sans engagement.",
  },
];

const FaqAmazonFba = () => {
  const schema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqs.map((f) => ({
      "@type": "Question",
      name: f.q,
      acceptedAnswer: { "@type": "Answer", text: f.a },
    })),
  };

  return (
    <LandingLayout
      title="Questions fréquentes sur AMZing FBA | Formation Amazon FBA"
      description="Toutes les réponses aux questions fréquentes sur AMZing FBA : profil, débutants, paiement, accompagnement et résultats."
    >
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }} />
      <section className="border-b border-border/50 bg-muted/20">
        <div className="container mx-auto px-4 py-10 lg:py-14 space-y-4">
          <h1 className="text-3xl font-bold sm:text-4xl lg:text-5xl">Questions fréquentes sur AMZing FBA</h1>
          <p className="max-w-3xl text-base text-muted-foreground sm:text-lg leading-relaxed">
            Retrouvez les réponses aux questions les plus courantes sur la formation et l'accompagnement Amazon FBA proposés par AMZing FBA.
          </p>
        </div>
      </section>

      <section className="container mx-auto px-4 py-10 lg:py-14 max-w-3xl">
        <Accordion type="single" collapsible className="w-full">
          {faqs.map((f, i) => (
            <AccordionItem key={f.q} value={`item-${i}`}>
              <AccordionTrigger className="text-left">{f.q}</AccordionTrigger>
              <AccordionContent className="text-muted-foreground leading-relaxed">{f.a}</AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
        <div className="mt-10 text-center">
          <Button asChild size="lg" className="h-12 px-6">
            <Link to="/demander-rappel">Poser une question <ArrowRight className="ml-2 h-4 w-4" /></Link>
          </Button>
        </div>
      </section>
    </LandingLayout>
  );
};

export default FaqAmazonFba;
