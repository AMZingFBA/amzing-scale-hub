import { Star, ArrowLeft, Filter } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Capacitor } from "@capacitor/core";
import { useNavigate } from "react-router-dom";
import { useMemo, useState } from "react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";

const testimonials = [
  {
    name: "Thomas G.",
    rating: 5,
    text: "Service ultra rapide, produits conformes et communication impeccable. J'ai reçu mes stocks en 48h, rien à dire."
  },
  {
    name: "Lina P.",
    rating: 5,
    text: "Grâce à AMZing FBA, j'ai enfin compris comment calculer mes marges nettes. Mes ventes ont doublé en un mois !"
  },
  {
    name: "Arthur S.",
    rating: 5,
    text: "Le catalogue produit est juste incroyable. Chaque jour je découvre des produits rentables sans passer des heures à chercher."
  },
  {
    name: "Sabrina K.",
    rating: 5,
    text: "J'étais totalement débutante et grâce à leurs guides Notion, j'ai lancé mon premier produit rentable en 6 jours !"
  },
  {
    name: "Yanis R.",
    rating: 5,
    text: "Super expérience, support réactif et humain. On sent qu'ils connaissent vraiment Amazon."
  },
  {
    name: "Clémence D.",
    rating: 5,
    text: "J'ai testé plusieurs services de formation, mais AMZing FBA est le seul qui m'a réellement aidé à passer à l'action."
  },
  {
    name: "Mickaël T.",
    rating: 5,
    text: "J'adore le suivi sur Discord. À chaque question, j'ai une réponse en moins d'une heure. Ultra pro."
  },
  {
    name: "Nora J.",
    rating: 5,
    text: "Leur pack de départ est très complet. Les templates Notion m'ont sauvé un temps fou."
  },
  {
    name: "Léo F.",
    rating: 5,
    text: "Résultats concrets dès la première semaine, j'ai validé 2 produits avec plus de 35 % de marge nette."
  },
  {
    name: "Camille R.",
    rating: 5,
    text: "Leur système d'alertes produits est top, j'ai trouvé une opportunité avec 120 % de ROI."
  },
  {
    name: "Adam B.",
    rating: 5,
    text: "Vraiment bluffé par la clarté du contenu. On sent que tout est pensé pour aller droit au but."
  },
  {
    name: "Lucie N.",
    rating: 5,
    text: "Leur outil de suivi est une pépite. Fini les erreurs de stock, tout est automatisé."
  },
  {
    name: "Rayan C.",
    rating: 5,
    text: "Mon entrepôt Amazon tourne beaucoup mieux depuis que j'ai appliqué leurs conseils logistiques."
  },
  {
    name: "Mélanie P.",
    rating: 4,
    text: "Bonne plateforme, bon accompagnement, un peu de délai au début mais ça vaut largement le coup."
  },
  {
    name: "Olivier H.",
    rating: 4,
    text: "Interface Notion super claire, un petit plus serait un module vidéo explicatif. Sinon top."
  },
  {
    name: "Sofiane L.",
    rating: 4,
    text: "Rien à dire sur la qualité, juste un petit bug sur le fichier d'analyse produit. Réglé rapidement."
  },
  {
    name: "Julie V.",
    rating: 4,
    text: "Un peu sceptique au départ, mais leurs fiches pratiques sont hyper utiles. J'ai enfin compris le ROI."
  },
  {
    name: "Pauline F.",
    rating: 4,
    text: "Le Discord est bien organisé, on s'y retrouve facilement. Quelques salons un peu calmes parfois."
  },
  {
    name: "Adrien D.",
    rating: 4,
    text: "Excellent rapport qualité-prix. On voit qu'ils sont passionnés par ce qu'ils font."
  },
  {
    name: "Cindy M.",
    rating: 4,
    text: "Le service support est super gentil et pro. Un peu d'attente parfois le week-end, mais très réactif ensuite."
  },
  {
    name: "Hugo N.",
    rating: 3,
    text: "Le concept est bon, mais j'aurais aimé plus d'exemples concrets sur les calculs de marge."
  },
  {
    name: "Sonia R.",
    rating: 3,
    text: "Pas mal dans l'ensemble, quelques lenteurs pour la livraison FBA. Le reste est nickel."
  },
  {
    name: "Pierre T.",
    rating: 3,
    text: "Bonne idée de base, mais interface Notion un peu chargée. En amélioration constante."
  },
  {
    name: "Nadia E.",
    rating: 3,
    text: "Support réactif, mais parfois un peu technique pour les vrais débutants."
  },
  {
    name: "Mathieu K.",
    rating: 3,
    text: "Service correct, les outils sont utiles mais demandent un peu de prise en main au début."
  },
  {
    name: "Laura S.",
    rating: 3,
    text: "Formation claire, mais j'aurais aimé plus de vidéos et moins de texte."
  },
  {
    name: "Rachid B.",
    rating: 3,
    text: "Pas encore de résultat concret, mais j'apprends beaucoup sur la logistique Amazon."
  }
];

const Avis = () => {
  const navigate = useNavigate();
  const isNativeApp = Capacitor.isNativePlatform();
  const [filterRating, setFilterRating] = useState<string>("all");

  // Randomize testimonials order
  const randomizedTestimonials = useMemo(() => {
    return [...testimonials].sort(() => 0.5 - Math.random());
  }, []);

  // Filter testimonials by rating
  const filteredTestimonials = useMemo(() => {
    if (filterRating === "all") return randomizedTestimonials;
    return randomizedTestimonials.filter(t => t.rating.toString() === filterRating);
  }, [randomizedTestimonials, filterRating]);

  // Redirect to home if not native app
  if (!isNativeApp) {
    navigate('/');
    return null;
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header with iOS safe area */}
      <div className="sticky top-0 z-10 bg-background border-b border-border pt-16">
        <div className="flex items-center justify-between gap-4 px-4 py-4">
          <div className="flex items-center gap-4">
            <button
              onClick={() => navigate(-1)}
              className="p-2 bg-primary/10 hover:bg-primary/20 rounded-lg transition-colors active:scale-95 border border-primary/20"
            >
              <ArrowLeft className="w-6 h-6 text-primary" />
            </button>
            <h1 className="text-2xl font-bold">Tous les avis</h1>
          </div>
          
          {/* Filter Dropdown */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="icon">
                <Filter className="w-5 h-5" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-48">
              <DropdownMenuLabel>Filtrer par note</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuRadioGroup value={filterRating} onValueChange={setFilterRating}>
                <DropdownMenuRadioItem value="all">Tous les avis</DropdownMenuRadioItem>
                <DropdownMenuRadioItem value="5">⭐⭐⭐⭐⭐ (5/5)</DropdownMenuRadioItem>
                <DropdownMenuRadioItem value="4">⭐⭐⭐⭐ (4/5)</DropdownMenuRadioItem>
                <DropdownMenuRadioItem value="3">⭐⭐⭐ (3/5)</DropdownMenuRadioItem>
              </DropdownMenuRadioGroup>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      {/* Testimonials List - No animations */}
      <div className="px-4 py-6 space-y-4 max-w-2xl mx-auto">
        {filteredTestimonials.map((testimonial, index) => (
          <Card 
            key={index}
            className="border border-primary/20 bg-[#FFFDF7] shadow-lg"
          >
            <CardContent className="p-5">
              {/* Stars & Rating */}
              <div className="flex items-center gap-2 mb-3">
                <div className="flex gap-1">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className={`w-5 h-5 ${
                        i < testimonial.rating
                          ? "text-primary fill-primary"
                          : "text-muted-foreground/30"
                      }`}
                    />
                  ))}
                </div>
                <span className="text-lg font-bold text-primary">{testimonial.rating}/5</span>
              </div>

              {/* Testimonial Text */}
              <p className="text-[#2A2A2A] text-[15px] leading-relaxed mb-4">
                "{testimonial.text}"
              </p>

              {/* Name */}
              <p className="font-bold text-primary text-base">
                — {testimonial.name}
              </p>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default Avis;
