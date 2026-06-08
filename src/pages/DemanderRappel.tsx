import { Card } from "@/components/ui/card";
import LandingLayout from "@/components/lead/LandingLayout";
import LeadForm from "@/components/lead/LeadForm";

const DemanderRappel = () => {
  return (
    <LandingLayout
      title="Demander un rappel AMZing FBA | Formation Amazon FBA"
      description="Laissez vos coordonnées pour être recontacté par AMZing FBA au sujet de la formation et de l'accompagnement Amazon FBA."
    >
      <section className="border-b border-border/50 bg-muted/20">
        <div className="container mx-auto px-4 py-10 lg:py-14">
          <div className="grid items-start gap-8 lg:grid-cols-2">
            <div className="space-y-5">
              <h1 className="text-3xl font-bold sm:text-4xl lg:text-5xl">Demander un rappel AMZing FBA</h1>
              <p className="text-base text-muted-foreground sm:text-lg leading-relaxed">
                Vous souhaitez en savoir plus sur la formation et l'accompagnement Amazon FBA proposés par AMZing FBA ?
                Laissez vos coordonnées ci-dessous et un membre de l'équipe vous recontactera pour échanger sur votre projet.
              </p>
              <ul className="space-y-2 text-sm text-muted-foreground sm:text-base">
                <li>• Échange sans engagement avec l'équipe AMZing FBA</li>
                <li>• Présentation de la méthode, des outils et de l'accompagnement</li>
                <li>• Réponses à vos questions sur Amazon FBA</li>
              </ul>
            </div>
            <Card className="border-border/60 p-5 shadow-xl sm:p-6">
              <div className="mb-4 space-y-1">
                <h2 className="text-xl font-semibold">Vos coordonnées</h2>
                <p className="text-sm text-muted-foreground">Remplissez le formulaire pour être recontacté.</p>
              </div>
              <LeadForm id="rappel" submitLabel="Être recontacté par AMZing FBA" />
            </Card>
          </div>
        </div>
      </section>
    </LandingLayout>
  );
};

export default DemanderRappel;
