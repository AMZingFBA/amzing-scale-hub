import { Star, TrendingUp, Quote, CheckCircle2, ArrowRight, Users, Award, Sparkles } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Link } from "react-router-dom";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import SEO from "@/components/SEO";

interface Testimonial {
  name: string;
  city: string;
  role: string;
  rating: number;
  text: string;
  result: string;
  duration: string;
  initials: string;
  color: string;
}

const featured: Testimonial[] = [
  {
    name: "Thomas G.",
    city: "Lyon",
    role: "Vendeur Amazon FBA",
    rating: 5,
    text: "Je galérais à trouver des produits rentables depuis 6 mois. Avec AMZing FBA et leur outil IA de sourcing, j'ai validé 4 produits en 3 semaines. Mes marges sont passées de 12% à 34%. Je ne reviendrai jamais en arrière.",
    result: "+8 400€ / mois",
    duration: "Après 3 mois",
    initials: "TG",
    color: "from-amber-400 to-orange-500",
  },
  {
    name: "Lina P.",
    city: "Paris",
    role: "Entrepreneure e-commerce",
    rating: 5,
    text: "La formation est ultra concrète. Pas de blabla, que du pratique. J'ai lancé mon premier produit en 18 jours et fait 2 100€ de CA dès le premier mois. Le suivi Discord change tout, on n'est jamais seul.",
    result: "2 100€ CA premier mois",
    duration: "18 jours",
    initials: "LP",
    color: "from-rose-400 to-pink-500",
  },
  {
    name: "Arthur S.",
    city: "Bordeaux",
    role: "Salarié reconverti",
    rating: 5,
    text: "J'étais cadre dans la banque, j'avais zéro idée du e-commerce. En 4 mois avec leur accompagnement, j'ai dépassé mon ancien salaire. Aujourd'hui je vis à 100% d'Amazon FBA grâce à eux.",
    result: "+5 200€ / mois net",
    duration: "4 mois",
    initials: "AS",
    color: "from-emerald-400 to-teal-500",
  },
];

const stories: Testimonial[] = [
  { name: "Sabrina K.", city: "Marseille", role: "Étudiante", rating: 5, text: "Débutante totale, j'ai lancé mon premier produit rentable en 6 jours grâce aux guides Notion. Aujourd'hui je finance mes études avec Amazon.", result: "+1 800€ / mois", duration: "2 mois", initials: "SK", color: "from-violet-400 to-purple-500" },
  { name: "Yanis R.", city: "Lille", role: "Freelance", rating: 5, text: "Support hyper réactif, ils répondent toujours. L'outil de scan des grossistes m'a fait gagner 15h par semaine.", result: "ROI moyen 47%", duration: "Continu", initials: "YR", color: "from-cyan-400 to-blue-500" },
  { name: "Clémence D.", city: "Toulouse", role: "Maman au foyer", rating: 5, text: "J'avais testé 3 formations avant. AMZing FBA est la seule qui m'a réellement fait passer à l'action. Tout est clair, étape par étape.", result: "+3 600€ / mois", duration: "5 mois", initials: "CD", color: "from-pink-400 to-rose-500" },
  { name: "Mickaël T.", city: "Nantes", role: "Indépendant", rating: 5, text: "Le Discord est une mine d'or. Une question = réponse en moins d'une heure. La communauté est top, tout le monde s'entraide.", result: "12 produits actifs", duration: "6 mois", initials: "MT", color: "from-orange-400 to-amber-500" },
  { name: "Nora J.", city: "Strasbourg", role: "Auto-entrepreneure", rating: 5, text: "Les templates Notion m'ont sauvé un temps fou. Tout est prêt, plus qu'à exécuter. Mon CA a explosé.", result: "x3 en 4 mois", duration: "4 mois", initials: "NJ", color: "from-fuchsia-400 to-pink-500" },
  { name: "Léo F.", city: "Rennes", role: "Vendeur multi-canaux", rating: 5, text: "Résultats concrets dès la première semaine, j'ai validé 2 produits avec plus de 35% de marge nette. Énorme.", result: "+35% marge nette", duration: "1 semaine", initials: "LF", color: "from-teal-400 to-emerald-500" },
  { name: "Camille R.", city: "Nice", role: "Vendeuse Amazon", rating: 5, text: "Leur système d'alertes produits est une pépite. J'ai trouvé une opportunité avec 120% de ROI sur un seul deal.", result: "ROI 120%", duration: "Coup unique", initials: "CR", color: "from-blue-400 to-indigo-500" },
  { name: "Adam B.", city: "Montpellier", role: "Reconversion pro", rating: 5, text: "Vraiment bluffé par la clarté du contenu. Aucun blabla, on va droit au but. J'ai compris en 1 semaine ce que d'autres formations expliquent en 3 mois.", result: "Lancé en 21 jours", duration: "3 semaines", initials: "AB", color: "from-amber-400 to-yellow-500" },
  { name: "Lucie N.", city: "Grenoble", role: "Co-fondatrice", rating: 5, text: "Leur outil de suivi de stock est génial. Fini les ruptures et les sur-stocks. Tout est automatisé.", result: "0 rupture en 6 mois", duration: "6 mois", initials: "LN", color: "from-purple-400 to-violet-500" },
];

const stats = [
  { value: "2 400+", label: "Clients accompagnés", icon: Users },
  { value: "4.9/5", label: "Note moyenne", icon: Star },
  { value: "94%", label: "Atteignent leurs objectifs", icon: Award },
  { value: "32%", label: "Marge nette moyenne", icon: TrendingUp },
];

const Temoignages = () => {
  return (
    <div className="min-h-screen bg-background">
      <SEO
        title="Témoignages clients AMZing FBA — résultats réels d'Amazon FBA"
        description="Découvrez les témoignages de nos clients : vendeurs Amazon FBA qui ont multiplié leur CA, atteint la liberté financière et lancé leur business grâce à AMZing FBA."
        canonical="https://amzingfba.com/temoignages"
      />
      <Navbar />

      {/* Hero */}
      <section className="relative pt-32 pb-16 px-4 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-primary/10 pointer-events-none" />
        <div className="absolute top-20 -left-20 w-72 h-72 bg-primary/20 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 -right-20 w-96 h-96 bg-amber-300/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative max-w-5xl mx-auto text-center">
          <Badge className="mb-6 bg-primary/10 text-primary border-primary/20 hover:bg-primary/20">
            <Sparkles className="w-3 h-3 mr-1" />
            Plus de 2 400 clients accompagnés
          </Badge>
          <h1 className="text-4xl md:text-6xl font-bold tracking-tight mb-6">
            Ils ont construit leur business
            <span className="block bg-gradient-to-r from-primary via-amber-500 to-orange-500 bg-clip-text text-transparent mt-2">
              avec AMZing FBA
            </span>
          </h1>
          <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto mb-8">
            Des résultats concrets, vérifiables, partagés par nos clients. Aucun témoignage scénarisé, que du réel.
          </p>
          <div className="flex flex-wrap gap-3 justify-center">
            <Button asChild size="lg" className="bg-primary hover:bg-primary/90">
              <Link to="/formation">
                Démarrer ma formation
                <ArrowRight className="w-4 h-4 ml-2" />
              </Link>
            </Button>
            <Button asChild size="lg" variant="outline">
              <Link to="/contact">Parler à l'équipe</Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="px-4 pb-16">
        <div className="max-w-6xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-4">
          {stats.map((stat) => {
            const Icon = stat.icon;
            return (
              <Card key={stat.label} className="border-primary/10 bg-card/50 backdrop-blur">
                <CardContent className="p-6 text-center">
                  <Icon className="w-7 h-7 text-primary mx-auto mb-3" />
                  <div className="text-3xl md:text-4xl font-bold text-foreground">{stat.value}</div>
                  <div className="text-sm text-muted-foreground mt-1">{stat.label}</div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </section>

      {/* Featured testimonials */}
      <section className="px-4 pb-20">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-3">Histoires à la une</h2>
            <p className="text-muted-foreground">Trois parcours marquants, trois transformations.</p>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            {featured.map((t) => (
              <Card key={t.name} className="relative overflow-hidden border-primary/20 hover:border-primary/40 transition-all hover:shadow-xl hover:-translate-y-1 group">
                <div className={`absolute top-0 left-0 right-0 h-1 bg-gradient-to-r ${t.color}`} />
                <CardContent className="p-7">
                  <Quote className="w-8 h-8 text-primary/30 mb-4" />
                  <div className="flex gap-1 mb-4">
                    {[...Array(t.rating)].map((_, i) => (
                      <Star key={i} className="w-4 h-4 text-primary fill-primary" />
                    ))}
                  </div>
                  <p className="text-foreground leading-relaxed mb-6 text-[15px]">"{t.text}"</p>

                  <div className="rounded-lg bg-primary/5 border border-primary/10 p-4 mb-5">
                    <div className="flex items-center gap-2 text-xs text-muted-foreground mb-1">
                      <TrendingUp className="w-3.5 h-3.5" />
                      Résultat • {t.duration}
                    </div>
                    <div className="text-2xl font-bold text-primary">{t.result}</div>
                  </div>

                  <div className="flex items-center gap-3 pt-4 border-t border-border">
                    <div className={`w-11 h-11 rounded-full bg-gradient-to-br ${t.color} flex items-center justify-center text-white font-bold text-sm shadow-md`}>
                      {t.initials}
                    </div>
                    <div>
                      <div className="font-semibold text-foreground flex items-center gap-1">
                        {t.name}
                        <CheckCircle2 className="w-4 h-4 text-primary" />
                      </div>
                      <div className="text-xs text-muted-foreground">{t.role} • {t.city}</div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Stories grid */}
      <section className="px-4 pb-20 bg-gradient-to-b from-transparent via-primary/[0.03] to-transparent">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-3">Tous les retours de nos clients</h2>
            <p className="text-muted-foreground">Des dizaines de vendeurs partagent leur expérience.</p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
            {stories.map((t) => (
              <Card key={t.name} className="border-border hover:border-primary/30 transition-all hover:shadow-lg">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex gap-0.5">
                      {[...Array(t.rating)].map((_, i) => (
                        <Star key={i} className="w-3.5 h-3.5 text-primary fill-primary" />
                      ))}
                    </div>
                    <Badge variant="outline" className="text-xs border-primary/20 text-primary bg-primary/5">
                      {t.result}
                    </Badge>
                  </div>
                  <p className="text-sm text-foreground/80 leading-relaxed mb-5 line-clamp-5">"{t.text}"</p>
                  <div className="flex items-center gap-3 pt-4 border-t border-border">
                    <div className={`w-9 h-9 rounded-full bg-gradient-to-br ${t.color} flex items-center justify-center text-white font-bold text-xs`}>
                      {t.initials}
                    </div>
                    <div className="min-w-0">
                      <div className="text-sm font-semibold text-foreground truncate flex items-center gap-1">
                        {t.name}
                        <CheckCircle2 className="w-3.5 h-3.5 text-primary shrink-0" />
                      </div>
                      <div className="text-xs text-muted-foreground truncate">{t.role} • {t.city}</div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="px-4 pb-24">
        <div className="max-w-4xl mx-auto">
          <Card className="relative overflow-hidden border-primary/30 bg-gradient-to-br from-primary/10 via-amber-100/30 to-primary/5">
            <div className="absolute top-0 right-0 w-64 h-64 bg-primary/20 rounded-full blur-3xl" />
            <CardContent className="relative p-10 md:p-14 text-center">
              <Badge className="mb-5 bg-primary text-primary-foreground">
                <Sparkles className="w-3 h-3 mr-1" />
                À votre tour
              </Badge>
              <h2 className="text-3xl md:text-4xl font-bold mb-4">
                Et si la prochaine histoire, c'était la vôtre ?
              </h2>
              <p className="text-muted-foreground text-lg max-w-2xl mx-auto mb-8">
                Rejoignez les 2 400+ vendeurs qui ont fait confiance à AMZing FBA pour construire un business Amazon rentable et durable.
              </p>
              <div className="flex flex-wrap gap-3 justify-center">
                <Button asChild size="lg" className="bg-primary hover:bg-primary/90">
                  <Link to="/formation">
                    Découvrir la formation
                    <ArrowRight className="w-4 h-4 ml-2" />
                  </Link>
                </Button>
                <Button asChild size="lg" variant="outline">
                  <Link to="/tarifs">Voir les tarifs</Link>
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Temoignages;
