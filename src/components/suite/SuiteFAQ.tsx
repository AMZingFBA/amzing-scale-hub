import { useState } from 'react';
import { ChevronDown, Calendar } from 'lucide-react';

const SuiteFAQ = () => {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  const faqs = [
    {
      question: "C'est une formation ?",
      answer: "Non, c'est un logiciel tout-en-un + bibliothèque de process (Formation en ligne) + accompagnement. Tu as accès à des outils concrets, pas juste des vidéos."
    },
    {
      question: "À qui ça s'adresse ?",
      answer: "Aux débutants qui veulent se lancer avec une structure claire, aux vendeurs en reconversion qui cherchent une méthode éprouvée, et aux vendeurs actifs qui veulent scaler plus vite."
    },
    {
      question: "Combien de temps j'ai accès ?",
      answer: "À vie, accès illimité. Tu paies une fois et tu gardes l'accès pour toujours."
    },
    {
      question: "Y a-t-il des mises à jour ?",
      answer: "Oui, toutes les mises à jour sont incluses à vie. Nouvelles fonctionnalités, améliorations, nouveaux modules de la Formation en ligne... tout est inclus."
    },
    {
      question: "Comment fonctionne le support 9h–19h ?",
      answer: "Tu peux nous contacter par chat ou email pendant les jours ouvrés, de 9h à 19h (heure de Paris). On répond généralement sous quelques heures."
    },
    {
      question: "Le Coaching hebdomadaire, c'est comment ?",
      answer: "Chaque semaine, tu peux réserver un créneau de 30 à 60 minutes pour discuter de ton avancement, poser tes questions et débloquer tes situations."
    },
    {
      question: "Comment fonctionne l'accès à la communauté ?",
      answer: "Dès ton achat, tu accèdes à notre communauté privée où tu peux échanger avec d'autres membres, partager des opportunités et obtenir de l'entraide."
    },
    {
      question: "Le catalogue fournisseurs est-il mis à jour ?",
      answer: "Oui, nous ajoutons régulièrement de nouveaux fournisseurs et deals. Tu es notifié des nouvelles opportunités."
    },
    {
      question: "Puis-je annuler après l'achat ?",
      answer: "Comme c'est un accès à vie avec contenu numérique accessible immédiatement, il n'y a pas de remboursement après accès. Consulte bien la page avant d'acheter."
    }
  ];

  return (
    <section className="py-20 lg:py-28 relative">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
            Questions fréquentes
          </h2>
          <p className="text-suite-gray text-lg">
            Tout ce que tu dois savoir avant de te lancer.
          </p>
        </div>

        <div className="space-y-3">
          {faqs.map((faq, index) => (
            <div
              key={index}
              className="bg-suite-card border border-white/10 rounded-xl overflow-hidden"
            >
              <button
                onClick={() => setOpenIndex(openIndex === index ? null : index)}
                className="w-full flex items-center justify-between p-5 text-left hover:bg-white/5 transition-colors duration-200"
              >
                <span className="font-medium text-white pr-4">{faq.question}</span>
                <ChevronDown 
                  className={`w-5 h-5 text-suite-gray flex-shrink-0 transition-transform duration-200 ${
                    openIndex === index ? 'rotate-180' : ''
                  }`}
                />
              </button>
              
              <div className={`overflow-hidden transition-all duration-300 ${
                openIndex === index ? 'max-h-96' : 'max-h-0'
              }`}>
                <p className="px-5 pb-5 text-suite-gray leading-relaxed">
                  {faq.answer}
                </p>
              </div>
            </div>
          ))}
        </div>

        {/* D'autres questions */}
        <div className="mt-12 text-center bg-suite-card border border-white/10 rounded-2xl p-8">
          <h3 className="text-xl font-bold text-white mb-3">D'autres questions ?</h3>
          <p className="text-suite-gray mb-6">Réserve un appel gratuit pour en discuter avec nous.</p>
          <a
            href="https://calendly.com/amzingfba26/30min"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 bg-gradient-to-r from-suite-orange to-suite-orange/80 hover:from-suite-orange/90 hover:to-suite-orange text-white font-semibold py-3 px-6 rounded-xl transition-all duration-300 hover:shadow-lg hover:shadow-suite-orange/30"
          >
            <Calendar className="w-5 h-5" />
            Réserver un appel
          </a>
        </div>
      </div>
    </section>
  );
};

export default SuiteFAQ;
