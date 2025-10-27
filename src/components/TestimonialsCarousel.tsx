import { Star } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

const testimonials = [
  {
    name: "Sarah M.",
    rating: 5,
    text: "Super expérience ! J'ai suivi la formation AMZing FBA et j'ai compris en quelques jours ce que d'autres mettent des mois à apprendre. Résultats concrets, accompagnement au top."
  },
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
    name: "Julien R.",
    rating: 5,
    text: "Le service logistique AMZing FBA 360 est une pépite. Stockage, emballage et expédition en 24h : plus rapide et moins cher que FBA."
  },
  {
    name: "Élodie B.",
    rating: 5,
    text: "J'ai trouvé mes trois premiers produits rentables grâce au catalogue VIP. Très pro, et mise à jour régulière des opportunités."
  },
  {
    name: "Romain V.",
    rating: 5,
    text: "J'utilise leurs entrepôts depuis deux mois. Aucun colis perdu, délais nickel, marges plus hautes que sur Amazon FBA."
  },
  {
    name: "Lina J.",
    rating: 5,
    text: "La plateforme est d'une qualité rare : entraide, alertes produits, discussions sérieuses… On apprend tous les jours."
  },
  {
    name: "Hugo L.",
    rating: 5,
    text: "L'équipe m'a accompagné de A à Z : création de micro-entreprise, autorisations Amazon, premiers listings. Rien à dire."
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
    rating: 5,
    text: "Excellent rapport qualité-prix. On voit qu'ils sont passionnés par ce qu'ils font."
  },
  {
    name: "Cindy M.",
    rating: 4,
    text: "Le service support est super gentil et pro. Un peu d'attente parfois le week-end, mais très réactif ensuite."
  },
  {
    name: "Laura T.",
    rating: 5,
    text: "Leur accompagnement individuel est une vraie force. Je me suis sentie encadrée à chaque étape."
  },
  {
    name: "Yohan C.",
    rating: 5,
    text: "J'ai confié mes expéditions à AMZing FBA 360 : tout est automatisé, et je reçois un rapport chaque fin de semaine."
  },
  {
    name: "Anaïs P.",
    rating: 5,
    text: "J'ai testé la partie grossiste : j'ai reçu 80 unités parfaitement emballées et prêtes à envoyer. Très bon rapport qualité/prix."
  }
];

const TestimonialsCarousel = () => {
  // Split testimonials into two rows for opposite direction scrolling
  const firstHalf = testimonials.slice(0, Math.ceil(testimonials.length / 2));
  const secondHalf = testimonials.slice(Math.ceil(testimonials.length / 2));
  
  const duplicatedFirst = [...firstHalf, ...firstHalf, ...firstHalf];
  const duplicatedSecond = [...secondHalf, ...secondHalf, ...secondHalf];

  return (
    <div className="relative overflow-hidden space-y-6 py-4">
      {/* Fade masks on sides */}
      <div className="absolute left-0 top-0 bottom-0 w-32 bg-gradient-to-r from-background to-transparent z-10 pointer-events-none" />
      <div className="absolute right-0 top-0 bottom-0 w-32 bg-gradient-to-l from-background to-transparent z-10 pointer-events-none" />
      
      {/* First row - scrolling left */}
      <div className="flex animate-scroll-fast gap-6">
        {duplicatedFirst.map((testimonial, index) => (
          <Card 
            key={index} 
            className="flex-shrink-0 w-[380px] transition-all duration-300 hover:shadow-2xl hover:border-primary/50 hover:scale-102 bg-gradient-to-br from-background to-muted/30 group"
          >
            <CardContent className="pt-6 h-full flex flex-col">
              <div className="flex items-center mb-3 gap-1">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    className={`w-4 h-4 transition-all ${
                      i < testimonial.rating
                        ? "text-primary fill-primary group-hover:scale-110"
                        : "text-muted-foreground"
                    }`}
                  />
                ))}
                <span className="ml-2 text-sm font-bold text-primary">{testimonial.rating}/5</span>
              </div>
              <p className="text-muted-foreground mb-4 text-sm leading-relaxed flex-grow">
                "{testimonial.text}"
              </p>
              <p className="font-bold text-primary mt-auto">— {testimonial.name}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Second row - scrolling right */}
      <div className="flex animate-scroll-reverse gap-6">
        {duplicatedSecond.map((testimonial, index) => (
          <Card 
            key={index} 
            className="flex-shrink-0 w-[380px] transition-all duration-300 hover:shadow-2xl hover:border-secondary/50 hover:scale-102 bg-gradient-to-br from-background to-muted/30 group"
          >
            <CardContent className="pt-6 h-full flex flex-col">
              <div className="flex items-center mb-3 gap-1">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    className={`w-4 h-4 transition-all ${
                      i < testimonial.rating
                        ? "text-secondary fill-secondary group-hover:scale-110"
                        : "text-muted-foreground"
                    }`}
                  />
                ))}
                <span className="ml-2 text-sm font-bold text-secondary">{testimonial.rating}/5</span>
              </div>
              <p className="text-muted-foreground mb-4 text-sm leading-relaxed flex-grow">
                "{testimonial.text}"
              </p>
              <p className="font-bold text-secondary mt-auto">— {testimonial.name}</p>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default TestimonialsCarousel;
