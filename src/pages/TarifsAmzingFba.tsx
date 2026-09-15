import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import LandingLayout from "@/components/lead/LandingLayout";
import LeadForm from "@/components/lead/LeadForm";
import { ArrowRight, CheckCircle2, PhoneCall, ShieldCheck, Clock } from "lucide-react";

const inclus = [
  { title: "Formation", desc: "Modules pédagogiques sur Amazon FBA, du démarrage aux notions plus avancées." },
  { title: "Accompagnement", desc: "Accompagnement de l'équipe AMZing FBA tout au long de votre parcours." },
  { title: "Méthode de sourcing", desc: "Méthode structurée pour rechercher, analyser et comparer les produits et fournisseurs." },
  { title: "Analyse produit", desc: "Outils et critères pour estimer marges, ROI et niveau de concurrence." },
  { title: "Support", desc: "Support pour vos questions techniques et organisationnelles." },
];

const faq = [
  {
    q: "Pourquoi le tarif n'est-il pas affiché ?",
    a: "Le programme est construit sur mesure selon votre profil, votre budget et vos objectifs. Le tarif est communiqué après un court appel de diagnostic, pour vous proposer une formule réellement adaptée.",
  },
  {
    q: "L'appel de diagnostic est-il payant ?",
    a: "Non, l'appel dure environ 15 minutes, il est gratuit et sans engagement.",
  },
  {
    q: "Y a-t-il un engagement après l'appel ?",
    a: "Aucun. Vous recevez une proposition claire et prenez le temps de la réflexion avant toute décision.",
  },
];

const TarifsAmzingFba = () => {
  return (
    <LandingLayout
      title="Tarifs sur devis AMZing FBA | Programme Amazon FBA sur mesure"
      description="Le tarif du programme AMZing FBA est personnalisé selon votre projet. Réservez un appel de diagnostic gratuit de 15 minutes, sans engagement, pour recevoir une proposition sur mesure."
    >
      <section className="border-b border-border/50 bg-muted/20">
        <div className="container mx-auto px-4 py-10 lg:py-14 space-y-6">
          <h1 className="text-3xl font-bold sm:text-4xl lg:text-5xl">Tarifs AMZing FBA — sur devis</h1>
          <p className="max-w-3xl text-base text-muted-foreground sm:text-lg leading-relaxed">
            Nous ne communiquons pas de prix générique : chaque programme AMZing FBA est construit après un échange téléphonique de 15 minutes, gratuit et sans engagement, pour s'adapter à votre profil et à votre budget.
          </p>
        </div>
      </section>

      <section className="container mx-auto px-4 py-10 lg:py-14">
        <div className="grid md:grid-cols-3 gap-6 max-w-4xl mx-auto mb-12">
          <Card className="text-center">
            <CardContent className="pt-8 pb-6">
              <PhoneCall className="w-8 h-8 text-primary mx-auto mb-3" />
              <h3 className="font-semibold mb-1">Appel de 15 min</h3>
              <p className="text-sm text-muted-foreground">On échange sur votre projet et vos objectifs.</p>
            </CardContent>
          </Card>
          <Card className="text-center">
            <CardContent className="pt-8 pb-6">
              <ShieldCheck className="w-8 h-8 text-primary mx-auto mb-3" />
              <h3 className="font-semibold mb-1">Proposition sur mesure</h3>
              <p className="text-sm text-muted-foreground">Un tarif et un programme adaptés à votre situation.</p>
            </CardContent>
          </Card>
          <Card className="text-center">
            <CardContent className="pt-8 pb-6">
              <Clock className="w-8 h-8 text-primary mx-auto mb-3" />
              <h3 className="font-semibold mb-1">Sans engagement</h3>
              <p className="text-sm text-muted-foreground">Vous décidez à votre rythme, aucune pression.</p>
            </CardContent>
          </Card>
        </div>

        <Card className="max-w-3xl mx-auto p-6 sm:p-8 space-y-4 border-primary/40 mb-12">
          <h2 className="text-2xl font-bold">Ce que comprend le programme AMZing FBA</h2>
          <div className="space-y-3 pt-2">
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

        <div className="max-w-3xl mx-auto mb-12">
          <h2 className="text-2xl font-bold mb-6 text-center">Questions fréquentes sur le tarif</h2>
          <div className="space-y-4">
            {faq.map((item) => (
              <Card key={item.q}>
                <CardHeader>
                  <CardTitle className="text-lg">{item.q}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">{item.a}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        <Card className="max-w-2xl mx-auto border-2 border-primary/40">
          <CardHeader className="text-center">
            <CardTitle className="text-2xl">Demander un appel de diagnostic gratuit</CardTitle>
          </CardHeader>
          <CardContent>
            <LeadForm id="tarifs-amzingfba-lead-form" submitLabel="Demander mon appel de diagnostic" />
          </CardContent>
        </Card>
      </section>
    </LandingLayout>
  );
};

export default TarifsAmzingFba;
