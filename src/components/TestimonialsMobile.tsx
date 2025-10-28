import React from "react";
import { Star, CheckCircle } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useScrollReveal } from "@/hooks/use-scroll-reveal";
import { Capacitor } from "@capacitor/core";

const testimonials = [
  {
    name: "Sarah M.",
    rating: 5,
    text: "Super expérience ! J'ai suivi la formation AMZing FBA et j'ai compris en quelques jours ce que d'autres mettent des mois à apprendre. Résultats concrets, accompagnement au top.",
    context: "3 produits trouvés en 2 semaines"
  },
  {
    name: "Thomas G.",
    rating: 5,
    text: "Service ultra rapide, produits conformes et communication impeccable. J'ai reçu mes stocks en 48h, rien à dire.",
    context: "+1 200 € de bénéfice sur son premier mois"
  },
  {
    name: "Lina P.",
    rating: 5,
    text: "Grâce à AMZing FBA, j'ai enfin compris comment calculer mes marges nettes. Mes ventes ont doublé en un mois !",
    context: "Débutante totale avant AMZing FBA"
  },
  {
    name: "Arthur S.",
    rating: 5,
    text: "Le catalogue produit est juste incroyable. Chaque jour je découvre des produits rentables sans passer des heures à chercher.",
    context: "5 produits validés avec +40% de marge"
  },
  {
    name: "Sabrina K.",
    rating: 5,
    text: "J'étais totalement débutante et grâce à leurs guides Notion, j'ai lancé mon premier produit rentable en 6 jours !",
    context: "Étudiante, première vente en 6 jours"
  },
  {
    name: "Yanis R.",
    rating: 5,
    text: "Super expérience, support réactif et humain. On sent qu'ils connaissent vraiment Amazon.",
    context: "+2 500 € de CA en 3 semaines"
  },
  {
    name: "Julien R.",
    rating: 5,
    text: "Le service logistique AMZing FBA 360 est une pépite. Stockage, emballage et expédition en 24h : plus rapide et moins cher que FBA.",
    context: "Marges +30% vs Amazon FBA"
  },
  {
    name: "Élodie B.",
    rating: 5,
    text: "J'ai trouvé mes trois premiers produits rentables grâce au catalogue VIP. Très pro, et mise à jour régulière des opportunités.",
    context: "ROI moyen de 120% sur 3 produits"
  }
];

const TestimonialCard = ({ testimonial, delay }: { testimonial: typeof testimonials[0], delay: number }) => {
  const { ref, isVisible } = useScrollReveal({ delay });

  return (
    <div
      ref={ref}
      className={`transition-all duration-500 ${
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
          <p className="font-bold text-primary text-base mb-2">
            — {testimonial.name}
          </p>

          {/* Context */}
          <p className="text-sm text-muted-foreground italic">
            {testimonial.context}
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
    <div className="py-12 px-4">
      {/* Badge */}
      <div className="flex justify-center mb-4 opacity-0 animate-in fade-in slide-in-from-top-4 duration-300">
        <Badge className="bg-[#FFF7E6] text-primary border border-primary/30 px-4 py-2 rounded-full text-sm font-semibold flex items-center gap-2">
          <CheckCircle className="w-4 h-4" />
          Témoignages clients réels
        </Badge>
      </div>

      {/* Title */}
      <h2 className="text-3xl md:text-4xl font-bold text-center mb-8 text-foreground opacity-0 animate-in fade-in slide-in-from-bottom-4 duration-300" style={{ animationDelay: "80ms" }}>
        Ce que disent nos membres
      </h2>

      {/* Testimonials Stack */}
      <div className="max-w-2xl mx-auto space-y-4">
        {(showAllTestimonials ? testimonials : selectedTestimonials).map((testimonial, index) => (
          <TestimonialCard
            key={index}
            testimonial={testimonial}
            delay={index * 80 + 160}
          />
        ))}
      </div>

      {/* Show More Button */}
      {!showAllTestimonials && (
        <div className="flex justify-center mt-6">
          <button
            onClick={() => setShowAllTestimonials(true)}
            className="px-6 py-3 bg-gradient-to-r from-primary to-secondary text-white rounded-lg font-semibold shadow-lg hover:shadow-glow transition-all duration-300 active:scale-95"
          >
            Voir plus d'avis ({testimonials.length - 2})
          </button>
        </div>
      )}
    </div>
  );
};

export default TestimonialsMobile;
