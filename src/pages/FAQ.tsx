import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Card } from "@/components/ui/card";
import { MessageCircle, ArrowLeft } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Capacitor } from "@capacitor/core";

const FAQ = () => {
  const faqData = [
    {
      question: "🧠 Qu'est-ce qu'AMZing FBA ?",
      answer: "AMZing FBA est une solution 360° pour les vendeurs Amazon et e-commerce. Nous proposons une formation complète, un catalogue de produits rentables, une logistique clé-en-main (stockage, emballage, expédition), ainsi qu'un accès exclusif à notre communauté VIP. En clair : on t'aide à lancer, automatiser et développer ton business Amazon sans stress."
    },
    {
      question: "💰 Combien coûte le service AMZing FBA ?",
      answer: "Nous avons plusieurs formules selon tes besoins :\n\n• Accès formation + communauté VIP : abonnement mensuel (tarif sur la page \"Rejoindre\")\n• Service logistique AMZing FBA 360 : facturation à l'usage (stockage + expéditions)\n• Catalogue grossiste : prix variables selon les produits et volumes d'achat\n\nTu ne payes que ce dont tu as réellement besoin, sans engagement caché."
    },
    {
      question: "📦 Comment fonctionne le service logistique AMZing FBA 360 ?",
      answer: "1️⃣ Tu commandes ton stock depuis notre catalogue ou ton propre fournisseur.\n2️⃣ Tu l'envoies directement dans nos entrepôts sécurisés.\n3️⃣ Nous stockons, préparons et expédions chaque commande sous 24 heures à ton client.\n4️⃣ Tu reçois un suivi complet (tracking, état du stock, rapports hebdos).\n\nC'est l'alternative parfaite à Amazon FBA : plus rapide, plus souple et 30 % moins chère."
    },
    {
      question: "🏭 Êtes-vous un grossiste ?",
      answer: "Oui ✅\n\nAMZing FBA est aussi un grossiste. Nous proposons aux vendeurs un catalogue exclusif de produits à fort ROI, mis à jour chaque semaine. Tu peux acheter des produits en petit ou grand volume, sans contrainte minimum. Tous nos articles sont testés, référencés et prêts à la revente."
    },
    {
      question: "🚛 En combien de temps expédiez-vous les commandes ?",
      answer: "Nos équipes expédient sous 24 heures ouvrées, du lundi au vendredi. Les délais de livraison pour le client final varient selon la destination (généralement 1 à 3 jours ouvrés). Chaque colis est suivi avec un numéro de tracking transmis automatiquement."
    },
    {
      question: "📦 Est-ce que je peux stocker mes produits chez AMZing FBA ?",
      answer: "Oui !\n\nNous proposons un stockage sécurisé dans nos entrepôts partenaires, sans engagement de durée. Tu peux envoyer ton stock à tout moment et demander une expédition partielle ou complète selon tes besoins. Nous gérons également l'étiquetage, le contrôle qualité et la préparation FBA/FBM."
    },
    {
      question: "🧾 Comment accéder au catalogue produits rentables ?",
      answer: "Le catalogue est réservé aux membres VIP. Une fois inscrit, tu auras accès à tous les produits avec :\n\n• le prix d'achat\n• le prix de revente Amazon\n• le ROI moyen\n• et le nombre de ventes mensuelles estimé"
    },
    {
      question: "💬 Comment rejoindre la communauté VIP ?",
      answer: "Tu peux t'inscrire directement via notre page \"Rejoindre la communauté\". Une fois le paiement effectué, ton accès est automatiquement débloqué :\n\n• Accès complet à la plateforme VIP\n• Outils, guides, alertes produits et tickets support\n• Coaching et entraide entre vendeurs"
    },
    {
      question: "🧑‍🏫 Est-ce que la formation est adaptée aux débutants ?",
      answer: "Oui, complètement.\n\nNotre programme a été conçu pour accompagner les débutants pas à pas, sans jargon technique. Tu apprendras comment :\n\n• Créer ton entreprise\n• Ouvrir ton compte Amazon Seller\n• Trouver tes premiers produits\n• Gérer la logistique et les marges\n• Et automatiser ton activité\n\nMême sans aucune expérience, tu peux commencer sereinement."
    },
    {
      question: "📈 Est-ce que c'est rentable de vendre sur Amazon aujourd'hui ?",
      answer: "Oui, à condition d'avoir les bonnes stratégies de sourcing et de logistique. Les vendeurs qui appliquent notre méthode réalisent souvent leurs premières ventes en moins de 30 jours, avec des marges de 40 à 100 % selon les produits. AMZing FBA t'aide à identifier ces opportunités et à réduire les erreurs coûteuses."
    },
    {
      question: "🔐 Est-ce sécurisé ?",
      answer: "100 % sécurisé ✅\n\nToutes les transactions passent par Stripe, Whop ou Paypal, et ton stock est conservé dans des entrepôts surveillés et assurés. Tes données et ton activité sont confidentielles."
    },
    {
      question: "🧾 Puis-je vendre mes propres produits ?",
      answer: "Oui.\n\nTu peux utiliser AMZing FBA 360 uniquement pour la logistique de tes produits personnels. Nous stockons, préparons et expédions tes commandes, même si ton stock ne provient pas de notre catalogue."
    },
    {
      question: "🛠️ Que se passe-t-il en cas de problème sur une commande ?",
      answer: "Notre service client prend le relais immédiatement. Nous assurons un SAV complet : vérification, retour, échange ou remboursement selon les cas. Tu n'as aucun contact à gérer avec le client final."
    },
    {
      question: "🌍 Travaillez-vous uniquement avec Amazon ?",
      answer: "Non.\n\nTu peux utiliser AMZing FBA 360 pour toutes les marketplaces : eBay, TikTok Shop, Etsy, Shopify, Vinted Pro, etc. Notre logistique s'adapte à tes besoins multicanaux."
    },
    {
      question: "⏰ Sous combien de temps puis-je commencer ?",
      answer: "Dès ton inscription !\n\nTu peux rejoindre l'espace VIP, accéder au catalogue et commencer à vendre dans la même journée. Nos formations et outils sont accessibles immédiatement après ton inscription."
    },
    {
      question: "📩 Comment contacter l'équipe ?",
      answer: "Directement via ton espace VIP dans le support. Tu peux aussi nous contacter via le formulaire du site. Notre équipe est disponible 7j/7 pour les membres Premium."
    },
    {
      question: "📊 Quelle est la différence entre AMZing FBA et Amazon FBA ?",
      answer: "**Critère | Amazon FBA | AMZing FBA 360**\n\nFrais logistiques : Élevés | -30 % en moyenne\nDélais expédition : 48-72h | 24h max\nFlexibilité : Limitée | Totale\nVolume minimum : Obligatoire | Aucun\nSAV : Standard | Personnalisé\nContrôle stock : Restreint | Transparent\nService client : Robotisé | Humain"
    },
    {
      question: "💼 Puis-je annuler mon abonnement ?",
      answer: "Oui, à tout moment.\n\nTu restes libre : aucun engagement à long terme, aucune pénalité."
    },
    {
      question: "💎 Pourquoi choisir AMZing FBA ?",
      answer: "Parce que c'est le raccourci intelligent pour réussir sur Amazon.\n\nTu apprends, tu sources, tu stockes et tu expédies — sans stress et sans intermédiaire. Notre équipe regroupe des experts du e-commerce, des vendeurs expérimentés et des logisticiens certifiés.\n\nAvec AMZing FBA, tu gagnes du temps, de l'argent et de la clarté."
    }
  ];

  const navigate = useNavigate();
  const isNativeApp = Capacitor.isNativePlatform();

  return (
    <div className="min-h-screen relative overflow-hidden">
      <Navbar />
      
      <Link
        to="/"
        className="fixed top-[140px] left-4 z-50 bg-primary text-white p-2 rounded-full shadow-lg hover:scale-110 transition-transform"
      >
        <ArrowLeft className="w-5 h-5" />
      </Link>
      
      {isNativeApp && (
        <div className="fixed top-[46px] left-[18px] z-50">
          <Button
            variant="outline"
            size="icon"
            onClick={() => navigate('/')}
            className="rounded-full shadow-lg bg-background/80 backdrop-blur-sm hover:bg-primary hover:text-white border-2 border-primary/20 hover:border-primary transition-all duration-300 hover:scale-110"
          >
            <ArrowLeft className="h-5 w-5" />
          </Button>
        </div>
      )}
      
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none opacity-20">
        <div className="absolute top-20 left-10 w-64 h-64 bg-primary/30 rounded-full blur-3xl animate-float" style={{ animationDelay: '0s' }}></div>
        <div className="absolute bottom-40 right-20 w-96 h-96 bg-secondary/30 rounded-full blur-3xl animate-float" style={{ animationDelay: '2s' }}></div>
        <div className="absolute top-1/2 left-1/3 w-48 h-48 bg-accent/20 rounded-full blur-3xl animate-float" style={{ animationDelay: '4s' }}></div>
      </div>

      <div className="pt-32 pb-20 relative z-10">
        <div className="container mx-auto px-4">
          {/* Hero */}
          <div className="text-center mb-16">
            <h1 className="text-5xl md:text-6xl font-bold mb-6 animate-fade-in">
              Questions Fréquentes
            </h1>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto animate-fade-in" style={{ animationDelay: '0.1s' }}>
              Trouvez rapidement les réponses à toutes vos questions
            </p>
          </div>

          {/* FAQ Accordion */}
          <Card className="max-w-4xl mx-auto p-6 md:p-8 shadow-xl hover:shadow-2xl transition-shadow duration-500 animate-fade-in border-2 border-primary/10" style={{ animationDelay: '0.2s' }}>
            <Accordion type="single" collapsible className="w-full">
              {faqData.map((faq, index) => (
                <AccordionItem 
                  key={index} 
                  value={`item-${index}`} 
                  className="group hover:bg-primary/5 px-4 rounded-lg transition-colors animate-fade-in"
                  style={{ animationDelay: `${0.1 * (index + 1)}s` }}
                >
                  <AccordionTrigger className="text-left text-lg hover:text-primary transition-colors group-hover:translate-x-2 duration-300">
                    {faq.question}
                  </AccordionTrigger>
                  <AccordionContent className="text-muted-foreground whitespace-pre-line">
                    {faq.answer}
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </Card>

          {/* Contact CTA */}
          <Card className="mt-16 max-w-4xl mx-auto bg-gradient-to-r from-primary/10 via-secondary/10 to-primary/10 border-2 border-primary/20 hover:shadow-2xl hover:shadow-primary/20 transition-all duration-500 animate-fade-in group">
            <div className="p-8 text-center">
              <div className="inline-block p-4 bg-primary/10 rounded-full mb-4 group-hover:scale-110 group-hover:rotate-6 transition-all duration-300">
                <MessageCircle className="w-8 h-8 text-primary animate-pulse" />
              </div>
              <h3 className="text-2xl font-bold mb-2">Vous n'avez pas trouvé votre réponse ?</h3>
              <p className="text-muted-foreground mb-6">
                Notre équipe est là pour vous aider et répondre à toutes vos questions
              </p>
              <Link to="/contact">
                <button className="px-8 py-3 bg-primary text-primary-foreground rounded-lg font-semibold hover:scale-105 hover:shadow-lg hover:shadow-primary/30 transition-all duration-300">
                  Nous contacter
                </button>
              </Link>
            </div>
          </Card>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default FAQ;
