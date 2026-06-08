import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import LandingLayout from "@/components/lead/LandingLayout";
import { ArrowRight } from "lucide-react";

const elements = [
  { title: "Prix d'achat", desc: "Coût d'acquisition du produit auprès du fournisseur, avant remises et options." },
  { title: "Prix de vente", desc: "Prix affiché sur Amazon, à confronter avec le marché et la concurrence." },
  { title: "Frais Amazon", desc: "Commissions de référencement appliquées par Amazon sur chaque vente." },
  { title: "Frais FBA / FBM", desc: "Coûts logistiques liés au modèle choisi : FBA (Amazon) ou FBM (vendeur)." },
  { title: "TVA", desc: "Taxe sur la valeur ajoutée à intégrer dans le calcul selon votre statut et votre marché." },
  { title: "Livraison", desc: "Frais d'envoi vers les entrepôts Amazon ou directement vers les clients." },
  { title: "Marge estimée", desc: "Différence entre le prix de vente et l'ensemble des coûts identifiés." },
  { title: "ROI estimé", desc: "Retour sur investissement calculé à partir de la marge et du capital engagé." },
];

const AnalyseMargesFba = () => {
  return (
    <LandingLayout
      title="Analyse des marges et frais Amazon FBA | AMZing FBA"
      description="Comprendre les marges et les frais Amazon FBA : prix d'achat, prix de vente, frais Amazon, FBA/FBM, TVA, livraison, marge et ROI estimés."
    >
      <section className="border-b border-border/50 bg-muted/20">
        <div className="container mx-auto px-4 py-10 lg:py-14 space-y-6">
          <h1 className="text-3xl font-bold sm:text-4xl lg:text-5xl">Analyse des marges et frais Amazon FBA</h1>
          <p className="max-w-3xl text-base text-muted-foreground sm:text-lg leading-relaxed">
            Comprendre la structure des frais et des marges est essentiel pour analyser sérieusement un produit Amazon FBA.
            AMZing FBA vous aide à intégrer chaque poste de coût dans vos calculs.
          </p>
          <Button asChild size="lg" className="h-12 px-6">
            <Link to="/demander-rappel">Être accompagné <ArrowRight className="ml-2 h-4 w-4" /></Link>
          </Button>
        </div>
      </section>

      <section className="container mx-auto px-4 py-10 lg:py-14">
        <h2 className="text-2xl font-bold sm:text-3xl mb-6">Les éléments à prendre en compte</h2>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {elements.map((e) => (
            <Card key={e.title} className="p-5 space-y-1.5">
              <h3 className="font-semibold">{e.title}</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">{e.desc}</p>
            </Card>
          ))}
        </div>
        <p className="mt-8 text-sm text-muted-foreground italic max-w-3xl">
          Les résultats dépendent du marché, des coûts, de la fiscalité applicable et de la stratégie appliquée. Aucun résultat financier n'est garanti.
        </p>
        <div className="mt-10 text-center">
          <Button asChild size="lg" className="h-12 px-6">
            <Link to="/demander-rappel">Être accompagné <ArrowRight className="ml-2 h-4 w-4" /></Link>
          </Button>
        </div>
      </section>
    </LandingLayout>
  );
};

export default AnalyseMargesFba;
