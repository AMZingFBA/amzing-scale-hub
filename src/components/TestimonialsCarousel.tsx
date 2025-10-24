import { Star } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

const testimonials = [
  {
    name: "Sarah M.",
    rating: 5,
    text: "J'ai commencé avec la formation AMZing FBA sans aucune expérience, et en deux semaines j'avais mes premiers bénéfices. Tout est clair, structuré et concret."
  },
  {
    name: "Julien R.",
    rating: 5,
    text: "Le service de stockage AMZing FBA 360 m'a changé la vie. Je ne gère plus rien, ils expédient sous 24h à mes clients, c'est fluide et moins cher que FBA !"
  },
  {
    name: "Élodie B.",
    rating: 5,
    text: "J'ai acheté plusieurs produits depuis leur catalogue VIP, tous étaient rentables et validés. Leur sourcing est ultra pro et mis à jour chaque semaine."
  },
  {
    name: "Maxime D.",
    rating: 5,
    text: "Le Discord est juste incroyable. Une vraie communauté active avec des vendeurs sérieux, de l'entraide et des alertes produits quotidiennes."
  },
  {
    name: "Yohan C.",
    rating: 5,
    text: "J'ai fait appel à leur service d'expédition pour tester le FBM et franchement, c'est rapide et propre. Le colis est parti le jour même."
  },
  {
    name: "Amine S.",
    rating: 4,
    text: "Service pro et réactif, j'ai juste eu un petit retard de 24h sur un envoi, mais l'équipe m'a prévenu immédiatement. Super suivi."
  },
  {
    name: "Laura T.",
    rating: 5,
    text: "Leur accompagnement personnalisé vaut de l'or. On m'a aidée à choisir mes premiers produits, à créer ma boutique et à comprendre Amazon Seller."
  },
  {
    name: "Romain V.",
    rating: 5,
    text: "Je fais du FBA depuis 3 ans, et honnêtement AMZing FBA m'a permis d'optimiser mes marges. Leurs frais logistiques sont vraiment plus bas."
  },
  {
    name: "Anaïs P.",
    rating: 5,
    text: "J'ai commandé un lot de jouets via leur service grossiste, reçus en 48h. Produits impeccables et emballage nickel."
  },
  {
    name: "Hugo L.",
    rating: 5,
    text: "Les guides Notion sont super bien faits. On sent que tout est réfléchi pour faciliter le business. Bravo l'équipe !"
  },
  {
    name: "Thomas G.",
    rating: 5,
    text: "L'équipe m'a aidé à obtenir mes autorisations de vente sur Amazon. Service rapide, tout a été validé du premier coup."
  },
  {
    name: "Claire F.",
    rating: 5,
    text: "Le module sur la gestion de trésorerie m'a évité plein d'erreurs de débutante. C'est une vraie formation professionnelle, pas juste des vidéos."
  },
  {
    name: "Benjamin H.",
    rating: 5,
    text: "J'ai pu commander du stock directement chez eux et ils l'ont expédié à mes clients Amazon. Le système AMZing FBA 360 est juste parfait."
  },
  {
    name: "Lina J.",
    rating: 5,
    text: "Ils m'ont accompagnée de A à Z : création d'entreprise, compte Amazon, sourcing… Même mon logo a été optimisé grâce à leurs conseils."
  },
  {
    name: "Nicolas E.",
    rating: 5,
    text: "Le support Discord est ultra réactif. J'ai eu une question sur un blocage de fiche produit, réponse en moins d'une heure."
  },
  {
    name: "Camille D.",
    rating: 5,
    text: "Le service logistique est top : j'envoie mes produits, ils gèrent le reste. J'ai reçu des retours clients ultra positifs sur la qualité d'emballage."
  },
  {
    name: "Adam K.",
    rating: 5,
    text: "Grâce à leur Discord VIP, j'ai trouvé trois produits gagnants que je n'aurais jamais repérés seul. Rentables dès le premier mois."
  },
  {
    name: "Inès L.",
    rating: 4,
    text: "Tout est très pro, juste dommage qu'il n'y ait pas encore de dashboard automatisé, mais on m'a dit que ça arrive bientôt."
  },
  {
    name: "Mehdi Z.",
    rating: 5,
    text: "Leur service grossiste m'a permis de commander 100 unités d'un produit à super prix. Marge de 280 %, rien à dire."
  },
  {
    name: "Eva M.",
    rating: 5,
    text: "L'équipe d'AMZing FBA m'a même aidée à corriger mes fiches produits Amazon. On sent qu'ils veulent vraiment que tu réussisses."
  },
  {
    name: "Thomas P.",
    rating: 5,
    text: "Expéditions rapides, SAV réactif, rien à redire. C'est fluide et surtout bien organisé."
  },
  {
    name: "Marion R.",
    rating: 5,
    text: "J'ai découvert le business Amazon grâce à eux. Leur approche est humaine, claire, et surtout efficace."
  },
  {
    name: "Kevin N.",
    rating: 5,
    text: "Les alertes produits dans le Discord, c'est une pépite. J'ai trouvé un Monopoly rentable à 400 % de ROI grâce à eux !"
  },
  {
    name: "Chloé S.",
    rating: 5,
    text: "Je recommande leur service de préparation FBA. Les produits arrivent propres, étiquetés et conformes, Amazon valide tout sans erreur."
  },
  {
    name: "Jérôme A.",
    rating: 5,
    text: "AMZing FBA, c'est plus qu'un service, c'est un vrai partenaire de croissance. Je fais 2x plus de ventes depuis que je travaille avec eux."
  },
  {
    name: "Léa D.",
    rating: 5,
    text: "Tout est géré pour toi : stock, expéditions, support client. Tu n'as qu'à vendre. C'est littéralement du business clé-en-main."
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
