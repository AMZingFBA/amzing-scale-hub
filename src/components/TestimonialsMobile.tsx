import React from "react";
import { Star, CheckCircle } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useScrollReveal } from "@/hooks/use-scroll-reveal";
import { Capacitor } from "@capacitor/core";

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

const TestimonialCard = ({ testimonial, delay }: { testimonial: typeof testimonials[0], delay: number }) => {
  const { ref, isVisible } = useScrollReveal({ delay });

  return (
    <div
      ref={ref}
      className={`transition-all duration-300 ${
        isVisible 
          ? "opacity-100 translate-y-0" 
          : "opacity-0 translate-y-4"
      }`}
      style={{ transitionDelay: `${delay}ms` }}
    >
      <Card className="border border-primary/20 bg-[#FFFDF7] shadow-lg hover:shadow-xl transition-all duration-300">
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
    </div>
  );
};

const TestimonialsMobile = () => {
  const isNativeApp = Capacitor.isNativePlatform();
  
  // Only render mobile version on native app
  if (!isNativeApp) {
    return null;
  }

  // Select 2 random testimonials from the list
  const selectedTestimonials = React.useMemo(() => {
    const shuffled = [...testimonials].sort(() => 0.5 - Math.random());
    return shuffled.slice(0, 2);
  }, []);

  const [showAllTestimonials, setShowAllTestimonials] = React.useState(false);

  return (
    <div className="px-4">
      {/* Badge */}
      <div className="flex justify-center mb-4 opacity-0 animate-in fade-in slide-in-from-top-4 duration-200">
        <Badge className="bg-[#FFF7E6] text-primary border border-primary/30 px-4 py-2 rounded-full text-sm font-semibold flex items-center gap-2">
          <CheckCircle className="w-4 h-4" />
          Témoignages clients réels
        </Badge>
      </div>

      {/* Title */}
      <h2 className="text-3xl md:text-4xl font-bold text-center mb-6 text-foreground opacity-0 animate-in fade-in slide-in-from-bottom-4 duration-200" style={{ animationDelay: "50ms" }}>
        Ce que disent nos membres
      </h2>

      {/* Testimonials Stack */}
      <div className="max-w-2xl mx-auto space-y-4">
        {(showAllTestimonials ? testimonials : selectedTestimonials).map((testimonial, index) => (
          <TestimonialCard
            key={index}
            testimonial={testimonial}
            delay={index * 50 + 100}
          />
        ))}
      </div>

      {/* Show More Button */}
      {!showAllTestimonials && (
        <div className="flex justify-center mt-6">
          <a href="/avis">
            <button
              className="px-6 py-3 bg-gradient-to-r from-primary to-secondary text-white rounded-lg font-semibold shadow-lg hover:shadow-glow transition-all duration-300 active:scale-95"
            >
              Voir plus d'avis ({testimonials.length - 2})
            </button>
          </a>
        </div>
      )}
    </div>
  );
};

export default TestimonialsMobile;
