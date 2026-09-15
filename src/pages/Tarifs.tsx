import { Check, ArrowLeft, PhoneCall, Clock, ShieldCheck, MessageCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import SEO from "@/components/SEO";
import LeadForm from "@/components/lead/LeadForm";
import { Link, useNavigate } from "react-router-dom";
import { Capacitor } from "@capacitor/core";
import { schemas } from "@/lib/seo-data";

// Service schema sans prix : nos tarifs sont communiqués après un appel de diagnostic.
const serviceSchema = {
  "@context": "https://schema.org",
  "@type": "Service",
  "name": "Accompagnement AMZing FBA",
  "description": "Programme d'accompagnement Amazon FBA sur mesure : formation, outils, catalogue fournisseurs et communauté. Tarif communiqué après un appel de diagnostic gratuit.",
  "provider": {
    "@type": "Organization",
    "name": "AMZing FBA",
    "url": "https://amzingfba.com"
  },
  "areaServed": "FR",
  "url": "https://amzingfba.com/tarifs"
};

const inclus = [
  "Moniteurs automatiques : robots qui notifient dès qu'un produit rentable est détecté",
  "Guides complets Amazon FBA : formation pas à pas de 0 aux premières ventes",
  "Fournisseurs privés : listing exclusif de produits sourcés et testés",
  "Analyses de marché : tendances et opportunités du marché Amazon",
  "Notifications produits : alertes instore et online pour opportunités",
  "Conseils niches privées : investissements stratégiques et opportunités exclusives",
  "Réductions exclusives : tarifs préférentiels sur emballages et bordereaux",
  "Service logistique : stockage et expédition disponibles",
];

const faq = [
  {
    q: "Pourquoi les tarifs ne sont-ils pas affichés directement ?",
    a: "Chaque projet est différent : niveau d'expérience, objectifs, budget disponible. Nous préférons comprendre ta situation lors d'un court appel avant de te proposer un programme réellement adapté, plutôt qu'une offre standard qui ne te correspond pas.",
  },
  {
    q: "Comment se déroule l'appel de diagnostic ?",
    a: "C'est un échange téléphonique d'environ 15 minutes, gratuit et sans engagement. On fait le point sur ton profil, tes objectifs et ton budget, on répond à tes questions, et si l'accompagnement AMZing FBA est pertinent pour toi, on te présente une proposition sur mesure.",
  },
  {
    q: "Suis-je engagé après l'appel ?",
    a: "Non. L'appel de diagnostic ne t'engage à rien. Tu repars avec une vision claire de ce qui est possible et, si tu le souhaites, une proposition personnalisée à étudier à ton rythme.",
  },
  {
    q: "Que comprend l'accompagnement AMZing FBA ?",
    a: "Selon le programme retenu, l'accompagnement peut inclure la formation complète, les moniteurs de produits rentables, le catalogue fournisseurs, la communauté et le support, ainsi que des services logistiques. Le détail exact est défini avec toi selon tes besoins.",
  },
  {
    q: "Quel budget prévoir pour démarrer sur Amazon FBA ?",
    a: "Au-delà de l'accompagnement, prévois un budget de stock pour tester quelques produits (souvent entre 500 et 1000 € pour un premier test). Ce montant dépend du modèle choisi (wholesale, retail, private label) et sera discuté ensemble lors de l'appel.",
  },
];

const Tarifs = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen relative overflow-hidden">
      <SEO
        title="Tarifs sur devis – Programme AMZing FBA après appel de diagnostic"
        description="Les tarifs AMZing FBA sont personnalisés selon ton projet. Réserve un appel de diagnostic gratuit de 15 minutes, sans engagement, et reçois une proposition sur mesure."
        keywords="tarif formation amazon fba, devis amazon fba, accompagnement amazon fba sur mesure"
        schema={serviceSchema}
      />
      <Navbar />

      <h1 className="sr-only">
        Tarifs sur mesure AMZing FBA pour vendeurs Amazon FBA et FBM
      </h1>

      {Capacitor.isNativePlatform() && (
        <div className="fixed top-[46px] left-[18px] z-50">
          <Button
            variant="outline"
            size="icon"
            onClick={() => navigate('/')}
            className="rounded-full shadow-lg bg-background/80 backdrop-blur-sm hover:bg-primary hover:text-primary-foreground border-2 border-primary/20 hover:border-primary transition-all duration-300 hover:scale-110"
          >
            <ArrowLeft className="h-5 w-5" />
          </Button>
        </div>
      )}

      <div className="absolute inset-0 overflow-hidden pointer-events-none opacity-20">
        <div className="absolute top-20 left-10 w-64 h-64 bg-primary/30 rounded-full blur-3xl animate-float" style={{ animationDelay: '0s' }}></div>
        <div className="absolute bottom-40 right-20 w-96 h-96 bg-secondary/30 rounded-full blur-3xl animate-float" style={{ animationDelay: '2s' }}></div>
      </div>

      <div className="pt-32 pb-20 relative z-10">
        <div className="container mx-auto px-4">
          {/* Hero */}
          <div className="text-center mb-16">
            <Badge className="mb-4 bg-primary/10 text-primary border-primary/20 animate-fade-in">
              Programme sur mesure
            </Badge>
            <h2 className="text-5xl md:text-6xl font-bold mb-6 animate-fade-in" style={{ animationDelay: '0.1s' }}>
              Un tarif sur devis, adapté à ton projet
            </h2>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto animate-fade-in" style={{ animationDelay: '0.2s' }}>
              Nous n'affichons pas de prix figé : chaque accompagnement est construit après un appel de diagnostic gratuit et sans engagement, pour te proposer un programme réellement adapté à ton niveau et à ton budget.
            </p>
          </div>

          {/* Comment ça marche */}
          <div className="grid md:grid-cols-3 gap-6 max-w-5xl mx-auto mb-16">
            <Card className="text-center hover:shadow-lg transition-all">
              <CardContent className="pt-8 pb-6">
                <div className="w-14 h-14 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-4">
                  <PhoneCall className="w-7 h-7 text-primary" />
                </div>
                <h3 className="font-bold text-lg mb-2">1. Appel de diagnostic</h3>
                <p className="text-sm text-muted-foreground">15 minutes au téléphone pour comprendre ton profil, tes objectifs et ton budget.</p>
              </CardContent>
            </Card>
            <Card className="text-center hover:shadow-lg transition-all">
              <CardContent className="pt-8 pb-6">
                <div className="w-14 h-14 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-4">
                  <ShieldCheck className="w-7 h-7 text-primary" />
                </div>
                <h3 className="font-bold text-lg mb-2">2. Proposition sur mesure</h3>
                <p className="text-sm text-muted-foreground">Un programme et un tarif adaptés à ta situation, sans engagement de ta part.</p>
              </CardContent>
            </Card>
            <Card className="text-center hover:shadow-lg transition-all">
              <CardContent className="pt-8 pb-6">
                <div className="w-14 h-14 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-4">
                  <Clock className="w-7 h-7 text-primary" />
                </div>
                <h3 className="font-bold text-lg mb-2">3. Tu décides</h3>
                <p className="text-sm text-muted-foreground">Tu prends le temps de réfléchir avant de te lancer. Aucune pression commerciale.</p>
              </CardContent>
            </Card>
          </div>

          {/* Ce qui est inclus */}
          <div className="max-w-3xl mx-auto mb-16 animate-fade-in">
            <Card className="border-2 border-primary/30 shadow-xl">
              <CardHeader className="text-center pb-4 pt-8">
                <CardTitle className="text-3xl mb-2">Ce que peut comprendre ton accompagnement</CardTitle>
                <CardDescription className="text-lg">Le contenu exact est défini avec toi selon tes besoins</CardDescription>
              </CardHeader>
              <CardContent className="px-8 pb-8">
                <div className="space-y-4">
                  {inclus.map((item, i) => (
                    <div key={i} className="flex items-start gap-3">
                      <Check className="w-5 h-5 text-primary flex-shrink-0 mt-1" />
                      <p className="text-muted-foreground">{item}</p>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Lead form */}
          <div id="devis" className="max-w-2xl mx-auto mb-16 scroll-mt-24">
            <Card className="border-2 border-primary/40 shadow-2xl">
              <CardHeader className="text-center">
                <MessageCircle className="w-10 h-10 text-primary mx-auto mb-2" />
                <CardTitle className="text-2xl">Demande ton appel de diagnostic gratuit</CardTitle>
                <CardDescription>15 minutes, sans engagement. On te rappelle rapidement.</CardDescription>
              </CardHeader>
              <CardContent>
                <LeadForm id="tarifs-lead-form" submitLabel="Demander mon appel de diagnostic" />
              </CardContent>
            </Card>
          </div>

          {/* FAQ Pricing */}
          <div className="max-w-3xl mx-auto">
            <h2 className="text-3xl font-bold text-center mb-8 animate-fade-in">Questions sur les tarifs</h2>

            <div className="space-y-4">
              {faq.map((item, i) => (
                <Card key={i} className="group hover:shadow-lg hover:scale-[1.01] hover:border-primary/30 transition-all duration-300 animate-fade-in" style={{ animationDelay: `${i * 0.1}s` }}>
                  <CardHeader>
                    <CardTitle className="text-lg group-hover:text-primary transition-colors">{item.q}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-muted-foreground">{item.a}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>

          {/* CTA */}
          <Card className="mt-16 bg-gradient-to-r from-primary to-secondary text-primary-foreground border-none animate-fade-in hover:shadow-2xl hover:shadow-primary/30 transition-all duration-500 group">
            <CardContent className="p-12 text-center relative overflow-hidden">
              <div className="absolute inset-0 overflow-hidden pointer-events-none opacity-20">
                <div className="absolute top-10 left-10 w-32 h-32 bg-primary-foreground/20 rounded-full blur-2xl animate-float"></div>
                <div className="absolute bottom-10 right-10 w-40 h-40 bg-primary-foreground/10 rounded-full blur-2xl animate-float" style={{ animationDelay: '2s' }}></div>
              </div>

              <div className="relative z-10">
                <h2 className="text-3xl md:text-4xl font-bold mb-4 group-hover:scale-105 transition-transform">
                  Prêt à en discuter ?
                </h2>
                <p className="text-xl mb-8 text-primary-foreground/90 max-w-2xl mx-auto">
                  Réserve ton appel de diagnostic gratuit de 15 minutes, sans engagement.
                </p>
                <Button variant="hero" size="xl" asChild className="hover:scale-105 transition-all duration-300">
                  <Link to="/demander-rappel">Demander un rappel</Link>
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default Tarifs;
