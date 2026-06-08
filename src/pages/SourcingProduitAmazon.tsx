import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import LandingLayout from "@/components/lead/LandingLayout";
import { ArrowRight, Search, BarChart3, Building2, Calculator, TrendingUp } from "lucide-react";

const blocs = [
  { icon: Search, title: "Recherche de produits", desc: "Identifier des références à étudier à partir de catégories, de niches ou d'idées de sourcing." },
  { icon: BarChart3, title: "Analyse de la demande", desc: "Étudier l'historique de ventes, la saisonnalité et la stabilité de la demande." },
  { icon: Building2, title: "Comparaison des fournisseurs", desc: "Comparer plusieurs sources d'approvisionnement, les conditions et les délais." },
  { icon: Calculator, title: "Étude des frais et de la concurrence", desc: "Prendre en compte les frais Amazon, la TVA, la logistique et le niveau de concurrence." },
  { icon: TrendingUp, title: "Vérification des marges potentielles", desc: "Estimer la marge et le ROI en fonction du prix d'achat, du prix de vente et des coûts." },
];

const SourcingProduitAmazon = () => {
  return (
    <LandingLayout
      title="Sourcing produit pour Amazon FBA | AMZing FBA"
      description="Méthode de sourcing produit pour Amazon FBA : recherche, analyse de la demande, comparaison fournisseurs et étude des marges potentielles."
    >
      <section className="border-b border-border/50 bg-muted/20">
        <div className="container mx-auto px-4 py-10 lg:py-14 space-y-6">
          <h1 className="text-3xl font-bold sm:text-4xl lg:text-5xl">Sourcing produit pour Amazon FBA</h1>
          <p className="max-w-3xl text-base text-muted-foreground sm:text-lg leading-relaxed">
            Le sourcing produit est une étape clé pour un vendeur Amazon FBA. AMZing FBA vous accompagne dans la mise en place
            d'une méthode structurée pour étudier les produits, les fournisseurs, les frais et la concurrence avant toute décision d'achat.
          </p>
          <Button asChild size="lg" className="h-12 px-6">
            <Link to="/demander-rappel">Parler de mon projet <ArrowRight className="ml-2 h-4 w-4" /></Link>
          </Button>
        </div>
      </section>

      <section className="container mx-auto px-4 py-10 lg:py-14">
        <h2 className="text-2xl font-bold sm:text-3xl mb-6">Une méthode de sourcing en plusieurs étapes</h2>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {blocs.map(({ icon: Icon, title, desc }) => (
            <Card key={title} className="p-5 space-y-2">
              <Icon className="h-6 w-6 text-primary" />
              <h3 className="font-semibold">{title}</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">{desc}</p>
            </Card>
          ))}
        </div>
        <p className="mt-8 text-sm text-muted-foreground italic max-w-3xl">
          AMZing FBA ne garantit aucun produit rentable. La rentabilité dépend du marché, des coûts, de la concurrence et de la stratégie appliquée par le vendeur.
        </p>
        <div className="mt-10 text-center">
          <Button asChild size="lg" className="h-12 px-6">
            <Link to="/demander-rappel">Parler de mon projet <ArrowRight className="ml-2 h-4 w-4" /></Link>
          </Button>
        </div>
      </section>
    </LandingLayout>
  );
};

export default SourcingProduitAmazon;
