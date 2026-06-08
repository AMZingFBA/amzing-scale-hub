import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import LandingLayout from "@/components/lead/LandingLayout";
import { ArrowRight, CheckCircle2 } from "lucide-react";

const etapes = [
  { title: "Comprendre Amazon FBA et FBM", desc: "Différences entre les deux modèles logistiques, avantages, contraintes et choix selon votre projet." },
  { title: "Créer et structurer son compte vendeur", desc: "Ouverture du compte Seller Central, paramétrage, vérifications et bonnes pratiques." },
  { title: "Comprendre les frais Amazon", desc: "Commissions, frais FBA, frais de stockage, TVA et autres coûts à intégrer dans vos calculs." },
  { title: "Analyser des produits", desc: "Méthode d'analyse des produits avec estimation de marge, ROI et niveau de concurrence." },
  { title: "Trouver des fournisseurs", desc: "Identification de fournisseurs, prise de contact et critères d'évaluation." },
  { title: "Construire une méthode de sourcing", desc: "Mise en place d'une routine de sourcing claire, reproductible et adaptée à votre temps disponible." },
  { title: "Suivre son activité", desc: "Tableaux de bord, indicateurs de performance et suivi de la rentabilité." },
];

const ProgrammeAmazonFba = () => {
  return (
    <LandingLayout
      title="Programme de formation Amazon FBA | AMZing FBA"
      description="Découvrez les grandes étapes du programme de formation et d'accompagnement Amazon FBA proposé par AMZing FBA."
    >
      <section className="border-b border-border/50 bg-muted/20">
        <div className="container mx-auto px-4 py-10 lg:py-14 space-y-6">
          <h1 className="text-3xl font-bold sm:text-4xl lg:text-5xl">Programme de formation Amazon FBA</h1>
          <p className="max-w-3xl text-base text-muted-foreground sm:text-lg leading-relaxed">
            Le programme AMZing FBA est conçu pour vous accompagner pas à pas dans la compréhension d'Amazon FBA,
            l'analyse produit, la compréhension des frais, le sourcing et le suivi de votre activité.
          </p>
          <Button asChild size="lg" className="h-12 px-6">
            <Link to="/demander-rappel">Demander un rappel <ArrowRight className="ml-2 h-4 w-4" /></Link>
          </Button>
        </div>
      </section>

      <section className="container mx-auto px-4 py-10 lg:py-14">
        <h2 className="text-2xl font-bold sm:text-3xl mb-6">Les grandes étapes du programme</h2>
        <div className="grid gap-4 sm:grid-cols-2">
          {etapes.map((e, i) => (
            <Card key={e.title} className="p-5 space-y-2">
              <div className="flex items-start gap-3">
                <CheckCircle2 className="mt-1 h-5 w-5 shrink-0 text-primary" />
                <div>
                  <h3 className="font-semibold">{i + 1}. {e.title}</h3>
                  <p className="text-sm text-muted-foreground leading-relaxed mt-1">{e.desc}</p>
                </div>
              </div>
            </Card>
          ))}
        </div>
        <div className="mt-10 text-center">
          <Button asChild size="lg" className="h-12 px-6">
            <Link to="/demander-rappel">Demander un rappel <ArrowRight className="ml-2 h-4 w-4" /></Link>
          </Button>
        </div>
      </section>
    </LandingLayout>
  );
};

export default ProgrammeAmazonFba;
