import { Link } from "react-router-dom";
import { Shield, Users, Lock, FileText, AlertCircle, CheckCircle, Scale, Database } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

const Rules = () => {
  const rules = [
    {
      icon: <Users className="w-6 h-6" />,
      title: "Respect et professionnalisme",
      content: "Chaque utilisateur s'engage à adopter une attitude respectueuse et bienveillante envers l'ensemble de la communauté. Les propos haineux, diffamatoires, discriminatoires ou irrespectueux ne sont pas tolérés. Les échanges doivent demeurer professionnels et constructifs, même en cas de désaccord."
    },
    {
      icon: <AlertCircle className="w-6 h-6" />,
      title: "Interdiction de publicité non autorisée",
      content: "La promotion de produits, services, formations ou plateformes externes sans autorisation préalable est strictement interdite. Toute forme de spam, de sollicitation commerciale non approuvée ou de messages répétitifs entraînera une suspension immédiate du compte utilisateur."
    },
    {
      icon: <Lock className="w-6 h-6" />,
      title: "Confidentialité et propriété intellectuelle",
      content: "L'ensemble des contenus, documents, stratégies, outils et méthodes partagés sur AMZing FBA sont strictement confidentiels et protégés. Toute reproduction, diffusion, revente ou partage en dehors de la plateforme est formellement interdite et constitue une violation de la propriété intellectuelle."
    },
    {
      icon: <CheckCircle className="w-6 h-6" />,
      title: "Utilisation appropriée de la plateforme",
      content: "Chaque fonctionnalité de la plateforme (formations, catalogue, outils, support) est conçue pour un usage spécifique. Merci d'utiliser les sections appropriées pour vos demandes et publications. Un usage abusif ou détourné des services pourra entraîner une limitation ou suspension d'accès."
    },
    {
      icon: <Scale className="w-6 h-6" />,
      title: "Intégrité et conformité légale",
      content: "AMZing FBA promeut un écosystème professionnel fondé sur l'intégrité et la conformité. Sont strictement interdits : les pratiques trompeuses, frauduleuses ou illégales, ainsi que le non-respect des conditions d'utilisation des marketplaces (Amazon, TikTok Shop, etc.). Tout manquement entraîne la fermeture immédiate du compte."
    },
    {
      icon: <FileText className="w-6 h-6" />,
      title: "Services logistiques et paiements",
      content: "L'accès aux services de stockage, d'emballage et d'expédition implique l'acceptation des conditions commerciales associées (délais, tarifs, volumes). Tout abus, impayé ou non-respect des conditions contractuelles peut entraîner la suspension du service et du compte utilisateur."
    },
    {
      icon: <Database className="w-6 h-6" />,
      title: "Protection des données personnelles",
      content: "Ne partagez jamais vos identifiants, coordonnées bancaires ou informations sensibles avec d'autres utilisateurs. En cas de doute, contactez exclusivement le support officiel AMZing FBA. La plateforme est conforme au RGPD et garantit la protection de vos données personnelles."
    },
    {
      icon: <Shield className="w-6 h-6" />,
      title: "Sanctions et modération",
      content: "Tout manquement aux présentes règles peut entraîner un avertissement, une suspension temporaire ou une exclusion définitive de la plateforme. L'équipe AMZing FBA se réserve le droit de supprimer tout contenu ou compte ne respectant pas ces règles d'utilisation."
    }
  ];

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      <div className="container mx-auto px-4 py-16 max-w-5xl">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold mb-4 bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">
            Règles d'utilisation
          </h1>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Votre plateforme professionnelle dédiée à l'achat-revente, à la formation et aux outils d'optimisation Amazon FBA/FBM et e-commerce
          </p>
        </div>

        <Card className="mb-8 border-primary/20">
          <CardContent className="pt-6">
            <p className="text-center text-foreground/90 leading-relaxed">
              Afin de garantir un environnement sûr, professionnel et collaboratif, chaque membre s'engage à respecter les règles d'utilisation ci-dessous. En accédant à AMZing FBA, vous confirmez avoir lu, compris et accepté l'ensemble de ces conditions.
            </p>
          </CardContent>
        </Card>

        <div className="grid gap-6 mb-8">
          {rules.map((rule, index) => (
            <Card key={index} className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <CardTitle className="flex items-center gap-3 text-xl">
                  <div className="p-2 rounded-lg bg-primary/10 text-primary">
                    {rule.icon}
                  </div>
                  <span>{index + 1}. {rule.title}</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground leading-relaxed">
                  {rule.content}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>

        <Card className="bg-primary/5 border-primary/20">
          <CardContent className="pt-6 text-center">
            <p className="text-lg font-semibold text-foreground mb-4">
              Merci de contribuer à faire d'AMZing FBA un espace professionnel, fiable et performant 💪
            </p>
            <div className="flex gap-4 justify-center flex-wrap">
              <Link to="/contact">
                <button className="px-6 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors">
                  Contacter le support
                </button>
              </Link>
              <Link to="/dashboard">
                <button className="px-6 py-2 border border-primary text-primary rounded-lg hover:bg-primary/10 transition-colors">
                  Retour au tableau de bord
                </button>
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>

      <Footer />
    </div>
  );
};

export default Rules;
