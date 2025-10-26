import { Link } from "react-router-dom";
import { useState } from "react";
import { Shield, Users, Lock, FileText, AlertCircle, CheckCircle, Scale, Database } from "lucide-react";
import logo from "@/assets/logo.png";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";

const Footer = () => {
  const [rulesOpen, setRulesOpen] = useState(false);

  const rules = [
    {
      icon: <Users className="w-5 h-5" />,
      title: "Respect et professionnalisme",
      content: "Chaque utilisateur s'engage à adopter une attitude respectueuse et bienveillante envers l'ensemble de la communauté. Les propos haineux, diffamatoires, discriminatoires ou irrespectueux ne sont pas tolérés. Les échanges doivent demeurer professionnels et constructifs, même en cas de désaccord."
    },
    {
      icon: <AlertCircle className="w-5 h-5" />,
      title: "Interdiction de publicité non autorisée",
      content: "La promotion de produits, services, formations ou plateformes externes sans autorisation préalable est strictement interdite. Toute forme de spam, de sollicitation commerciale non approuvée ou de messages répétitifs entraînera une suspension immédiate du compte utilisateur."
    },
    {
      icon: <Lock className="w-5 h-5" />,
      title: "Confidentialité et propriété intellectuelle",
      content: "L'ensemble des contenus, documents, stratégies, outils et méthodes partagés sur AMZing FBA sont strictement confidentiels et protégés. Toute reproduction, diffusion, revente ou partage en dehors de la plateforme est formellement interdite et constitue une violation de la propriété intellectuelle."
    },
    {
      icon: <CheckCircle className="w-5 h-5" />,
      title: "Utilisation appropriée de la plateforme",
      content: "Chaque fonctionnalité de la plateforme (formations, catalogue, outils, support) est conçue pour un usage spécifique. Merci d'utiliser les sections appropriées pour vos demandes et publications. Un usage abusif ou détourné des services pourra entraîner une limitation ou suspension d'accès."
    },
    {
      icon: <Scale className="w-5 h-5" />,
      title: "Intégrité et conformité légale",
      content: "AMZing FBA promeut un écosystème professionnel fondé sur l'intégrité et la conformité. Sont strictement interdits : les pratiques trompeuses, frauduleuses ou illégales, ainsi que le non-respect des conditions d'utilisation des marketplaces (Amazon, TikTok Shop, etc.). Tout manquement entraîne la fermeture immédiate du compte."
    },
    {
      icon: <FileText className="w-5 h-5" />,
      title: "Services logistiques et paiements",
      content: "L'accès aux services de stockage, d'emballage et d'expédition implique l'acceptation des conditions commerciales associées (délais, tarifs, volumes). Tout abus, impayé ou non-respect des conditions contractuelles peut entraîner la suspension du service et du compte utilisateur."
    },
    {
      icon: <Database className="w-5 h-5" />,
      title: "Protection des données personnelles",
      content: "Ne partagez jamais vos identifiants, coordonnées bancaires ou informations sensibles avec d'autres utilisateurs. En cas de doute, contactez exclusivement le support officiel AMZing FBA. La plateforme est conforme au RGPD et garantit la protection de vos données personnelles."
    },
    {
      icon: <Shield className="w-5 h-5" />,
      title: "Sanctions et modération",
      content: "Tout manquement aux présentes règles peut entraîner un avertissement, une suspension temporaire ou une exclusion définitive de la plateforme. L'équipe AMZing FBA se réserve le droit de supprimer tout contenu ou compte ne respectant pas ces règles d'utilisation."
    }
  ];

  return (
    <footer className="bg-card border-t border-border mt-20">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Logo & Description */}
          <div className="md:col-span-2">
            <img src={logo} alt="AMZing FBA" className="h-12 mb-4" />
            <p className="text-muted-foreground max-w-md">
              Votre partenaire complet pour réussir sur Amazon FBA : formation, sourcing, logistique et communauté.
            </p>
          </div>

          {/* Services */}
          <div>
            <h3 className="font-bold text-foreground mb-4">Services</h3>
            <ul className="space-y-2">
              <li>
                <Link to="/formation" className="text-muted-foreground hover:text-primary transition-colors">
                  Formation
                </Link>
              </li>
              <li>
                <Link to="/catalogue" className="text-muted-foreground hover:text-primary transition-colors">
                  Catalogue Produits
                </Link>
              </li>
              <li>
                <Link to="/services#amzing-360" className="text-muted-foreground hover:text-primary transition-colors">
                  Stockage & Fulfilment
                </Link>
              </li>
              <li>
                <Link to="/tarifs" className="text-muted-foreground hover:text-primary transition-colors">
                  Tarifs
                </Link>
              </li>
            </ul>
          </div>

          {/* Informations */}
          <div>
            <h3 className="font-bold text-foreground mb-4">Informations</h3>
            <ul className="space-y-2">
              <li>
                <Link to="/faq" className="text-muted-foreground hover:text-primary transition-colors">
                  FAQ
                </Link>
              </li>
              <li>
                <Link to="/contact" className="text-muted-foreground hover:text-primary transition-colors">
                  Contact
                </Link>
              </li>
              <li>
                <a 
                  href="https://discord.gg/tHQhCSDn" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-muted-foreground hover:text-primary transition-colors"
                >
                  Discord
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-12 pt-8 border-t border-border flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-muted-foreground text-sm">
            © {new Date().getFullYear()} AMZing FBA. Tous droits réservés.
          </p>
          <div className="flex gap-6 text-sm">
            <Link to="/cgv" className="text-muted-foreground hover:text-primary transition-colors">
              CGV
            </Link>
            <Link to="/privacy" className="text-muted-foreground hover:text-primary transition-colors">
              Confidentialité
            </Link>
            <Link to="/refund" className="text-muted-foreground hover:text-primary transition-colors">
              Remboursement
            </Link>
            <Dialog open={rulesOpen} onOpenChange={setRulesOpen}>
              <DialogTrigger asChild>
                <button className="text-muted-foreground hover:text-primary transition-colors">
                  Règles
                </button>
              </DialogTrigger>
              <DialogContent className="max-w-4xl max-h-[80vh]">
                <DialogHeader>
                  <DialogTitle className="text-2xl">Règles d'utilisation</DialogTitle>
                  <DialogDescription>
                    Votre plateforme professionnelle dédiée à l'achat-revente, à la formation et aux outils d'optimisation Amazon FBA/FBM et e-commerce
                  </DialogDescription>
                </DialogHeader>
                <ScrollArea className="h-[60vh] pr-4">
                  <div className="space-y-4">
                    <Card className="border-primary/20">
                      <CardContent className="pt-6">
                        <p className="text-sm text-muted-foreground leading-relaxed">
                          Afin de garantir un environnement sûr, professionnel et collaboratif, chaque membre s'engage à respecter les règles d'utilisation ci-dessous. En accédant à AMZing FBA, vous confirmez avoir lu, compris et accepté l'ensemble de ces conditions.
                        </p>
                      </CardContent>
                    </Card>

                    {rules.map((rule, index) => (
                      <Card key={index}>
                        <CardHeader>
                          <CardTitle className="flex items-center gap-3 text-base">
                            <div className="p-2 rounded-lg bg-primary/10 text-primary">
                              {rule.icon}
                            </div>
                            <span>{index + 1}. {rule.title}</span>
                          </CardTitle>
                        </CardHeader>
                        <CardContent>
                          <p className="text-sm text-muted-foreground leading-relaxed">
                            {rule.content}
                          </p>
                        </CardContent>
                      </Card>
                    ))}

                    <Card className="bg-primary/5 border-primary/20">
                      <CardContent className="pt-6 text-center">
                        <p className="text-sm font-semibold text-foreground">
                          Merci de contribuer à faire d'AMZing FBA un espace professionnel, fiable et performant 💪
                        </p>
                      </CardContent>
                    </Card>
                  </div>
                </ScrollArea>
              </DialogContent>
            </Dialog>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
