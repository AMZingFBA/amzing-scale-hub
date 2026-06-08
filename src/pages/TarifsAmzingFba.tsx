import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import LandingLayout from "@/components/lead/LandingLayout";
import { ArrowRight, CheckCircle2 } from "lucide-react";

const inclus = [
  { title: "Formation", desc: "Modules pédagogiques sur Amazon FBA, du démarrage aux notions plus avancées." },
  { title: "Accompagnement", desc: "Accompagnement de l'équipe AMZing FBA tout au long de votre parcours." },
  { title: "Méthode de sourcing", desc: "Méthode structurée pour rechercher, analyser et comparer les produits et fournisseurs." },
  { title: "Analyse produit", desc: "Outils et critères pour estimer marges, ROI et niveau de concurrence." },
  { title: "Support", desc: "Support pour vos questions techniques et organisationnelles." },
];

const TarifsAmzingFba = () => {
  return (
    <LandingLayout
      title="Tarifs AMZing FBA | Formation et accompagnement Amazon FBA"
      description="Tarifs AMZing FBA : accès annuel à 700 € TTC ou paiement en 12 mensualités d'environ 64 €/mois, avec un engagement annuel de 12 mois."
    >
      <section className="border-b border-border/50 bg-muted/20">
        <div className="container mx-auto px-4 py-10 lg:py-14 space-y-6">
          <h1 className="text-3xl font-bold sm:text-4xl lg:text-5xl">Tarifs AMZing FBA</h1>
          <p className="max-w-3xl text-base text-muted-foreground sm:text-lg leading-relaxed">
            Une offre claire pour accéder à la formation et à l'accompagnement Amazon FBA d'AMZing FBA.
          </p>
        </div>
      </section>

      <section className="container mx-auto px-4 py-10 lg:py-14">
        <Card className="max-w-3xl mx-auto p-6 sm:p-8 space-y-4 border-primary/40">
          <h2 className="text-2xl font-bold">Accès annuel AMZing FBA</h2>
          <p className="text-lg">
            <span className="font-semibold">700 € TTC / an</span>, ou paiement en{" "}
            <span className="font-semibold">12 mensualités d'environ 64 €/mois</span>, soit un{" "}
            <span className="font-semibold">engagement annuel de 12 mois</span>.
          </p>
          <div className="space-y-3 pt-2">
            <h3 className="font-semibold">Ce qui est inclus :</h3>
            <ul className="space-y-2">
              {inclus.map((i) => (
                <li key={i.title} className="flex items-start gap-3">
                  <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-primary" />
                  <span><span className="font-medium">{i.title}</span> — <span className="text-muted-foreground">{i.desc}</span></span>
                </li>
              ))}
            </ul>
          </div>
          <Button asChild size="lg" className="h-12 w-full sm:w-auto">
            <Link to="/demander-rappel">Demander un rappel <ArrowRight className="ml-2 h-4 w-4" /></Link>
          </Button>
          <p className="text-xs text-muted-foreground leading-relaxed">
            Les résultats dépendent du profil, du budget, du marché, du travail fourni et de la stratégie appliquée. Aucun résultat financier n'est garanti.
          </p>
        </Card>
      </section>
    </LandingLayout>
  );
};

export default TarifsAmzingFba;
