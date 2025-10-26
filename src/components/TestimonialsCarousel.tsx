import { Star } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

const testimonials = [
  {
    name: "Sarah M.",
    rating: 5,
    text: "Super expérience ! J'ai suivi la formation AMZing FBA et j'ai compris en quelques jours ce que d'autres mettent des mois à apprendre. Résultats concrets, accompagnement au top."
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
    name: "Amine S.",
    rating: 4,
    text: "Service globalement très bon, j'ai juste eu un petit souci sur un carton abîmé, mais ils ont réagi en moins de 2h."
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
  },
  {
    name: "Mehdi Z.",
    rating: 5,
    text: "Sourcing et support au top, plateforme intuitive et contenu de grande qualité."
  },
  {
    name: "Thomas G.",
    rating: 5,
    text: "Grâce à eux j'ai obtenu mes autorisations de vente sur des marques bloquées. Service rapide et efficace."
  },
  {
    name: "Benjamin H.",
    rating: 5,
    text: "Ils s'occupent du stockage et de l'envoi de mes produits Amazon. Je n'ai plus qu'à gérer la partie business."
  },
  {
    name: "Eva M.",
    rating: 5,
    text: "Leur équipe SAV m'a aidée à résoudre un souci client Amazon sans que je fasse quoi que ce soit. Très pro."
  },
  {
    name: "Inès L.",
    rating: 3,
    text: "Globalement bon service, mais j'aurais aimé plus de communication sur le suivi des colis. Ça reste sérieux, mais améliorable."
  },
  {
    name: "Kevin N.",
    rating: 5,
    text: "Le sourcing est impressionnant. J'ai trouvé un Monopoly à 400 % de ROI grâce à une alerte produit."
  },
  {
    name: "Camille D.",
    rating: 4,
    text: "Emballage parfait et délais tenus. Un léger décalage sur la facturation, mais très vite réglé."
  },
  {
    name: "Nicolas E.",
    rating: 5,
    text: "Le support technique est réactif et précis. On sent qu'ils connaissent Amazon sur le bout des doigts."
  },
  {
    name: "Chloé S.",
    rating: 5,
    text: "Leur service de préparation FBA m'a permis de déléguer sans stress. Amazon valide toutes mes réceptions sans erreur."
  },
  {
    name: "Adam K.",
    rating: 5,
    text: "En un mois, j'ai fait mes premières ventes rentables grâce à AMZing FBA. C'est carré et motivant."
  },
  {
    name: "Claire F.",
    rating: 5,
    text: "Les guides Notion sont super détaillés. On comprend vite la logique derrière la réussite sur Amazon."
  },
  {
    name: "Jérôme A.",
    rating: 3,
    text: "Bon service, mais la création du ticket de support n'a pas marché du premier coup. Une fois contact pris, tout s'est bien passé."
  },
  {
    name: "Marion R.",
    rating: 5,
    text: "J'ai rejoint la communauté VIP : ambiance pro, entraide réelle, et j'ai récupéré mon investissement dès le premier mois."
  },
  {
    name: "Thomas P.",
    rating: 5,
    text: "L'expédition sous 24h est réelle ! Testé trois fois, toujours livrés dans les temps."
  },
  {
    name: "Léa D.",
    rating: 5,
    text: "J'ai confié tout à AMZing FBA 360 : stock, expédition, SAV. Je n'ai plus rien à gérer, tout roule."
  },
  {
    name: "Antoine G.",
    rating: 5,
    text: "C'est clairement un raccourci pour réussir sur Amazon. On gagne du temps et surtout, on évite toutes les erreurs de débutant."
  }
];

const TestimonialsCarousel = () => {
  // Split testimonials into two rows for opposite direction scrolling
  const firstHalf = testimonials.slice(0, 13);
  const secondHalf = testimonials.slice(13);
  
  const duplicatedFirst = [...firstHalf, ...firstHalf, ...firstHalf];
  const duplicatedSecond = [...secondHalf, ...secondHalf, ...secondHalf];

  return (
    <div className="relative overflow-hidden space-y-6">
      {/* First row - scrolling left */}
      <div className="flex animate-scroll-fast gap-6">
        {duplicatedFirst.map((testimonial, index) => (
          <Card 
            key={index} 
            className="flex-shrink-0 w-[380px] hover:scale-105 transition-all duration-300 hover:shadow-2xl hover:border-primary/50 bg-gradient-to-br from-background to-muted/30"
          >
            <CardContent className="pt-6">
              <div className="flex items-center mb-3 gap-1">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    className={`w-4 h-4 ${
                      i < testimonial.rating
                        ? "text-primary fill-primary animate-pulse"
                        : "text-muted-foreground"
                    }`}
                  />
                ))}
                <span className="ml-2 text-sm font-bold text-primary">{testimonial.rating}/5</span>
              </div>
              <p className="text-muted-foreground mb-4 text-sm leading-relaxed min-h-[100px]">
                "{testimonial.text}"
              </p>
              <p className="font-bold text-primary">— {testimonial.name}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Second row - scrolling right */}
      <div className="flex animate-scroll-reverse gap-6">
        {duplicatedSecond.map((testimonial, index) => (
          <Card 
            key={index} 
            className="flex-shrink-0 w-[380px] hover:scale-105 transition-all duration-300 hover:shadow-2xl hover:border-secondary/50 bg-gradient-to-br from-background to-muted/30"
          >
            <CardContent className="pt-6">
              <div className="flex items-center mb-3 gap-1">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    className={`w-4 h-4 ${
                      i < testimonial.rating
                        ? "text-secondary fill-secondary animate-pulse"
                        : "text-muted-foreground"
                    }`}
                  />
                ))}
                <span className="ml-2 text-sm font-bold text-secondary">{testimonial.rating}/5</span>
              </div>
              <p className="text-muted-foreground mb-4 text-sm leading-relaxed min-h-[100px]">
                "{testimonial.text}"
              </p>
              <p className="font-bold text-secondary">— {testimonial.name}</p>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default TestimonialsCarousel;
