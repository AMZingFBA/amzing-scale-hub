import { Star, Quote } from 'lucide-react';

const SuiteTestimonials = () => {
  const testimonials = [
    {
      name: "Thomas D.",
      role: "Vendeur FBA depuis 6 mois",
      content: "J'ai enfin une structure claire. Le moniteur ROI m'a fait gagner un temps fou sur le sourcing.",
      rating: 5
    },
    {
      name: "Sophie M.",
      role: "Ex-salariée en reconversion",
      content: "Le support est vraiment réactif. L'appel hebdo m'a permis de débloquer plusieurs situations.",
      rating: 5
    },
    {
      name: "Alexandre P.",
      role: "Vendeur multi-marketplace",
      content: "Les templates et checklists sont top. Je ne fais plus d'erreurs sur mes listings.",
      rating: 5
    },
    {
      name: "Marie L.",
      role: "Débutante FBA",
      content: "La Forma en ligne est super bien structurée. Parfait pour quelqu'un qui part de zéro.",
      rating: 5
    },
    {
      name: "Julien R.",
      role: "Vendeur expérimenté",
      content: "Le catalogue fournisseurs m'a ouvert de nouvelles opportunités que je n'aurais pas trouvées seul.",
      rating: 5
    },
    {
      name: "Camille B.",
      role: "Vendeuse FBA à temps plein",
      content: "La communauté est vraiment active. On s'entraide et on partage les bons plans.",
      rating: 5
    }
  ];

  return (
    <section className="py-20 lg:py-28 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
            Ce qu'en disent les membres
          </h2>
          <p className="text-suite-gray text-lg max-w-2xl mx-auto">
            Des vendeurs comme toi qui utilisent AMZing FBA Suite au quotidien.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {testimonials.map((testimonial, index) => (
            <div
              key={index}
              className="bg-suite-card border border-white/10 rounded-2xl p-6 hover:border-suite-orange/20 transition-all duration-300"
            >
              {/* Quote icon */}
              <Quote className="w-8 h-8 text-suite-orange/30 mb-4" />
              
              {/* Content */}
              <p className="text-white/90 mb-6 leading-relaxed">"{testimonial.content}"</p>
              
              {/* Rating */}
              <div className="flex gap-1 mb-4">
                {[...Array(testimonial.rating)].map((_, i) => (
                  <Star key={i} className="w-4 h-4 text-yellow-400" fill="currentColor" />
                ))}
              </div>
              
              {/* Author */}
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-suite-orange to-suite-blue flex items-center justify-center text-white font-semibold">
                  {testimonial.name.charAt(0)}
                </div>
                <div>
                  <p className="font-semibold text-white">{testimonial.name}</p>
                  <p className="text-sm text-suite-gray">{testimonial.role}</p>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Disclaimer */}
        <p className="text-center text-suite-gray/60 text-sm mt-8">
          Résultats variables selon implication, aucune garantie de gains.
        </p>
      </div>
    </section>
  );
};

export default SuiteTestimonials;
