import { ArrowRight, CheckCircle2, Star, ShieldCheck, Zap, TrendingUp, Users, Package, GraduationCap, Sparkles, Clock, Lock, BadgeCheck, Smartphone, MessageCircle, Building2, HelpCircle, PlayCircle, LineChart, Target } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import TestimonialsCarousel from "@/components/TestimonialsCarousel";
import TestimonialsMobile from "@/components/TestimonialsMobile";
import AppInstallBanner from "@/components/AppInstallBanner";
import SEO from "@/components/SEO";
import { useTrial } from "@/hooks/use-trial";
import { useAuth } from "@/hooks/use-auth";
import { useIsMobile } from "@/hooks/use-mobile";
import { Capacitor } from "@capacitor/core";
import { supabase } from "@/integrations/supabase/client";
import { seoData, schemas } from "@/lib/seo-data";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Checkbox } from "@/components/ui/checkbox";
import { useRegistrationSource } from "@/hooks/use-registration-source";
import HomeDashboardPreview from "@/components/home/HomeDashboardPreview";
import MultiDeviceMockup from "@/components/home/MultiDeviceMockup";


const Index = () => {
  const {
    startFreeTrial,
    isStarting,
    showCGVModal,
    setShowCGVModal,
    acceptedCGV,
    setAcceptedCGV,
    handleConfirmPayment,
  } = useTrial();
  const { isVIP, isLoading, user, subscription } = useAuth();
  const navigate = useNavigate();
  const isMobile = useIsMobile();
  const isNativeApp = Capacitor.isNativePlatform();

  useRegistrationSource();

  useEffect(() => {
    if (isLoading || !user || !subscription) return;
    if (isVIP) {
      navigate("/dashboard", { replace: true });
      return;
    }
    (async () => {
      const { data: roleData } = await supabase
        .from("user_roles")
        .select("role")
        .eq("user_id", user.id)
        .eq("role", "admin")
        .maybeSingle();
      if (roleData?.role === "admin") navigate("/dashboard", { replace: true });
    })();
  }, [isVIP, isLoading, user, navigate, subscription]);

  const homeSchema = [...schemas.homePageSchemas, schemas.homeFAQ];

  return (
    <div className="min-h-screen bg-background">
      <SEO
        title={seoData.home.title}
        description={seoData.home.description}
        keywords={seoData.home.keywords}
        schema={homeSchema}
      />
      <Navbar />
      <AppInstallBanner />

      <h1 className="sr-only">AMZing FBA — Plateforme + formation Amazon FBA</h1>

      {/* ============== HERO — Light SaaS premium ============== */}
      <section className="relative pt-24 lg:pt-32 pb-16 lg:pb-24 bg-slate-50 text-slate-900" style={{ fontFamily: "'Plus Jakarta Sans', system-ui, sans-serif" }}>
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center space-y-8">
            {/* Eyebrow */}
            <div className="flex justify-center">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-slate-200/60 border border-slate-200 text-[11px] font-bold uppercase tracking-[0.18em] text-slate-500">
                <span className="w-2 h-2 rounded-full bg-[#FF9900] animate-pulse" />
                Plateforme Amazon FBA · Édition 2026
              </div>
            </div>

            {/* Headline */}
            <h2 className="text-[40px] sm:text-6xl lg:text-7xl font-extrabold tracking-tight leading-[1.05] text-slate-900">
              Construisez un business
              <br className="hidden sm:block" />
              Amazon FBA{" "}
              <span className="italic font-normal text-[#FF9900]" style={{ fontFamily: "'Instrument Serif', serif" }}>
                rentable.
              </span>
            </h2>

            {/* Subtitle */}
            <p className="text-base sm:text-lg lg:text-xl text-slate-600 max-w-2xl mx-auto leading-relaxed">
              Une méthode, des outils de sourcing et un accompagnement par un vendeur en activité.
              Tout réuni dans une seule plateforme française.
            </p>

            {/* CTAs */}
            <div className="flex flex-col sm:flex-row gap-3 justify-center items-center pt-2">
              <Button
                size="xl"
                onClick={startFreeTrial}
                disabled={isStarting}
                className="w-full sm:w-auto min-w-[260px] bg-[#FF9900] hover:bg-[#FFA826] text-white font-bold rounded-xl shadow-[0_8px_30px_rgba(255,153,0,0.25)] hover:shadow-[0_12px_40px_rgba(255,153,0,0.35)] hover:-translate-y-0.5 transition-all"
              >
                {isStarting ? "Activation..." : "Accéder à la plateforme"}
                <ArrowRight className="ml-1" />
              </Button>
              <Button
                variant="outline"
                size="xl"
                asChild
                className="w-full sm:w-auto min-w-[220px] bg-white border-slate-200 text-slate-900 hover:bg-slate-50 hover:text-slate-900 font-bold rounded-xl"
              >
                <Link to="/formation">
                  <PlayCircle className="mr-1 text-slate-400" /> Voir la formation
                </Link>
              </Button>
            </div>

            {/* Price */}
            <div className="space-y-1 pt-2">
              <div className="flex items-center justify-center gap-3">
                <span className="text-slate-400 line-through text-lg">700€</span>
                <span className="text-2xl font-extrabold text-slate-900">500€ TTC</span>
              </div>
              <p className="text-sm font-medium text-slate-500">
                Ou seulement <span className="text-slate-900 font-semibold">64€/mois</span> × 12 mois sans frais
              </p>
            </div>

            {/* Trust bar */}
            <div className="pt-10 border-t border-slate-200">
              <div className="flex flex-wrap justify-center items-center gap-x-10 gap-y-5">
                <div className="flex items-center gap-3">
                  <div className="flex -space-x-2">
                    {["A","M","Z"].map((c, i) => (
                      <span key={i} className="w-8 h-8 rounded-full bg-gradient-to-br from-[#FF9900] to-[#FF7A18] border-2 border-slate-50 text-[10px] font-bold flex items-center justify-center text-white">
                        {c}
                      </span>
                    ))}
                  </div>
                  <div className="text-left">
                    <p className="text-xs font-bold text-slate-900">500+ vendeurs</p>
                    <p className="text-[10px] text-slate-500 uppercase tracking-tighter">Accompagnés</p>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <div className="flex text-[#FF9900] gap-0.5">
                    {[...Array(5)].map((_, i) => <Star key={i} className="w-4 h-4 fill-current" />)}
                  </div>
                  <div className="text-left">
                    <p className="text-xs font-bold text-slate-900">4,9/5</p>
                    <p className="text-[10px] text-slate-500 uppercase tracking-tighter">Avis vérifiés</p>
                  </div>
                </div>

                <div className="flex items-center gap-2 text-slate-500">
                  <ShieldCheck className="w-5 h-5 opacity-60" />
                  <span className="text-xs font-medium">N.Z Consulting · Société française</span>
                </div>

                <div className="flex items-center gap-2 text-slate-500">
                  <Lock className="w-5 h-5 opacity-60" />
                  <span className="text-xs font-medium">Paiement Stripe sécurisé</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ============== COMPATIBLE LOGOS BAR ============== */}
      <section className="bg-slate-50 border-t border-slate-200/70 py-10">
        <div className="container mx-auto px-4">
          <p className="text-center text-[11px] uppercase tracking-[0.22em] text-slate-400 mb-5 font-semibold">
            Conçu pour les vendeurs actifs sur
          </p>
          <div className="flex flex-wrap items-center justify-center gap-x-10 gap-y-3 text-slate-500">
            {["Amazon Seller", "Stripe", "Discord", "App Store", "Google Play", "Keepa"].map((name) => (
              <span key={name} className="text-sm font-semibold tracking-wide hover:text-slate-900 transition-colors">
                {name}
              </span>
            ))}
          </div>
        </div>
      </section>


      {/* ============== STATS BAR ============== */}
      <section className="border-y border-border bg-muted/30">
        <div className="container mx-auto px-4 py-12">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 max-w-5xl mx-auto">
            {[
              { value: "500+", label: "Vendeurs accompagnés" },
              { value: "5,2 M€", label: "CA généré (8 mois)" },
              { value: "1 700+", label: "Produits sourcés" },
              { value: "92%", label: "Taux de renouvellement" },
            ].map((s) => (
              <div key={s.label} className="text-center">
                <div className="text-4xl lg:text-5xl font-bold text-foreground tracking-tight">
                  {s.value}
                </div>
                <div className="text-sm text-muted-foreground mt-2 uppercase tracking-wider">{s.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ============== PROBLEM → SOLUTION ============== */}
      <section className="py-20 lg:py-28">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center mb-14">
            <Badge variant="outline" className="mb-4">Pourquoi 9 vendeurs sur 10 échouent</Badge>
            <h2 className="text-3xl lg:text-4xl font-bold mb-4">
              Vendre sur Amazon sans méthode, c'est perdre du temps et de l'argent
            </h2>
            <p className="text-lg text-muted-foreground">
              Trop d'outils dispersés, des "gourous" qui revendent des PDF, aucun suivi réel.
              AMZing FBA réunit tout dans un seul écosystème, avec un vendeur actif à vos côtés.
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-6 max-w-5xl mx-auto">
            <Card className="border-destructive/20 bg-destructive/[0.03]">
              <CardContent className="p-8">
                <Badge variant="outline" className="mb-4 border-destructive/30 text-destructive">Sans AMZing FBA</Badge>
                <ul className="space-y-3">
                  {[
                    "Sourcing manuel chronophage, produits non rentables",
                    "Outils éparpillés à 30, 50, 100€/mois chacun",
                    "Formations PDF sans accompagnement réel",
                    "Aucun retour terrain sur vos décisions",
                    "Risque élevé de blocage de compte",
                  ].map((t) => (
                    <li key={t} className="flex items-start gap-3 text-muted-foreground">
                      <span className="mt-1 w-5 h-5 rounded-full bg-destructive/10 flex items-center justify-center flex-shrink-0">
                        <span className="w-2 h-2 rounded-full bg-destructive" />
                      </span>
                      <span>{t}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>

            <Card className="border-primary/30 bg-primary/[0.04] shadow-glow">
              <CardContent className="p-8">
                <Badge className="mb-4 bg-primary/15 text-primary border-primary/30 hover:bg-primary/20">Avec AMZing FBA</Badge>
                <ul className="space-y-3">
                  {[
                    "Produits rentables détectés automatiquement chaque jour",
                    "Plateforme tout-en-un, un seul abonnement",
                    "Méthode pas-à-pas + support direct par chat",
                    "Coaching hebdo avec un vendeur en activité",
                    "Process testés pour rester conforme aux règles Amazon",
                  ].map((t) => (
                    <li key={t} className="flex items-start gap-3">
                      <CheckCircle2 className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
                      <span>{t}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* ============== WHAT YOU GET ============== */}
      <section className="py-20 lg:py-28 bg-muted/30 border-y border-border">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center mb-14">
            <Badge variant="outline" className="mb-4">Ce qui est inclus</Badge>
            <h2 className="text-3xl lg:text-4xl font-bold mb-4">
              Tout ce qu'il faut pour réussir, dans un seul abonnement
            </h2>
            <p className="text-lg text-muted-foreground">
              Outils, méthode, sourcing, communauté et coaching. Pas besoin d'acheter 5 logiciels en plus.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5 max-w-6xl mx-auto">
            {[
              { icon: TrendingUp, title: "Moniteurs de produits rentables", desc: "Alertes temps réel sur Qogita, Auchan, King Jouet et + de 20 sources." },
              { icon: GraduationCap, title: "Formation complète A → Z", desc: "Plus de 60 vidéos pour passer de zéro à votre premier produit livré." },
              { icon: Package, title: "Fournisseurs vérifiés", desc: "Catalogue privé de grossistes testés en Europe et hors UE." },
              { icon: LineChart, title: "Analyse rentabilité automatique", desc: "ROI, marge, frais Amazon et estimation des ventes calculés pour vous." },
              { icon: Users, title: "Communauté privée", desc: "Discord actif, retours d'expérience, entraide entre vendeurs sérieux." },
              { icon: MessageCircle, title: "Coaching hebdomadaire", desc: "Sessions live 30 à 60 min pour débloquer vos sujets en direct." },
            ].map(({ icon: Icon, title, desc }) => (
              <Card key={title} className="border-border/60 bg-background hover:border-primary/40 hover:shadow-glow transition-all duration-300 group">
                <CardContent className="p-6">
                  <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-primary/15 to-secondary/15 flex items-center justify-center mb-4 group-hover:scale-105 transition-transform">
                    <Icon className="w-5 h-5 text-primary" />
                  </div>
                  <h3 className="font-semibold text-lg mb-1.5">{title}</h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">{desc}</p>
                </CardContent>
              </Card>
            ))}
          </div>

          <div className="text-center mt-10">
            <Button size="lg" variant="outline" asChild>
              <Link to="/services">Voir tout en détail <ArrowRight className="ml-1" /></Link>
            </Button>
          </div>
        </div>
      </section>

      {/* ============== DASHBOARD PREVIEW ============== */}
      <HomeDashboardPreview />

      {/* ============== HOW IT WORKS ============== */}
      <section className="py-20 lg:py-28 bg-muted/30 border-y border-border">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center mb-14">
            <Badge variant="outline" className="mb-4">Comment ça marche</Badge>
            <h2 className="text-3xl lg:text-4xl font-bold mb-4">Vos premiers résultats en 3 étapes</h2>
          </div>

          <div className="grid md:grid-cols-3 gap-6 max-w-5xl mx-auto">
            {[
              { step: "01", title: "Activez votre accès", desc: "Inscription en 2 min, accès immédiat à la plateforme et aux formations." },
              { step: "02", title: "Recevez vos produits", desc: "Nos moniteurs détectent les opportunités rentables, vous validez les bonnes." },
              { step: "03", title: "Vendez et scalez", desc: "Méthode + support pour vos premières ventes, puis automatisez progressivement." },
            ].map(({ step, title, desc }, i) => (
              <div key={step} className="relative">
                <div className="absolute -top-3 -left-3 text-7xl font-bold text-primary/10 select-none">{step}</div>
                <Card className="relative h-full border-border bg-background">
                  <CardContent className="p-7">
                    <div className="text-sm font-semibold text-primary mb-2">Étape {i + 1}</div>
                    <h3 className="text-xl font-bold mb-2">{title}</h3>
                    <p className="text-muted-foreground">{desc}</p>
                  </CardContent>
                </Card>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ============== TESTIMONIALS ============== */}
      <section className="py-20 lg:py-28">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center mb-14">
            <Badge variant="outline" className="mb-4">Témoignages</Badge>
            <h2 className="text-3xl lg:text-4xl font-bold mb-4">Ils ont franchi le cap avec AMZing FBA</h2>
            <div className="flex items-center justify-center gap-2 text-muted-foreground">
              <span className="flex items-center gap-0.5 text-amber-500">
                {[...Array(5)].map((_, i) => <Star key={i} className="w-4 h-4 fill-current" />)}
              </span>
              <span>4,9/5 · 500+ vendeurs actifs</span>
            </div>
          </div>
          {(isNativeApp || isMobile) ? <TestimonialsMobile /> : <TestimonialsCarousel />}
        </div>
      </section>

      {/* ============== PRICING ============== */}
      <section id="pricing" className="py-20 lg:py-28 bg-muted/30 border-y border-border">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center mb-12">
            <Badge variant="outline" className="mb-4">Tarif</Badge>
            <h2 className="text-3xl lg:text-4xl font-bold mb-4">Un tarif, tout inclus</h2>
            <p className="text-lg text-muted-foreground">
              Accès 12 mois à la plateforme, à la formation, aux fournisseurs et au coaching.
            </p>
          </div>

          <Card className="max-w-2xl mx-auto border-2 border-primary/40 shadow-glow relative overflow-hidden">
            <div className="absolute top-0 right-0 bg-gradient-to-r from-primary to-secondary text-primary-foreground text-xs font-bold px-4 py-1.5 rounded-bl-xl">
              OFFRE LANCEMENT -29%
            </div>
            <CardContent className="p-8 lg:p-10">
              <div className="flex flex-col items-center text-center">
                <Badge className="mb-4 bg-primary/15 text-primary border-primary/30 hover:bg-primary/20">Accès complet AMZing FBA</Badge>
                <div className="flex items-baseline gap-3 mb-2">
                  <span className="text-2xl text-muted-foreground line-through">700€</span>
                  <span className="text-5xl lg:text-6xl font-bold">500€</span>
                  <span className="text-muted-foreground">TTC</span>
                </div>
                <p className="text-muted-foreground mb-6">ou <span className="font-semibold text-foreground">64€/mois × 12</span> sans frais cachés</p>

                <div className="w-full border-t border-border pt-6 mb-6">
                  <ul className="grid sm:grid-cols-2 gap-3 text-left">
                    {[
                      "Plateforme complète 12 mois",
                      "Formation A → Z (60+ vidéos)",
                      "Moniteurs produits temps réel",
                      "Catalogue fournisseurs privé",
                      "Communauté Discord active",
                      "Coaching hebdomadaire",
                      "Support chat 7j/7",
                      "Apps iOS + Android",
                    ].map((f) => (
                      <li key={f} className="flex items-center gap-2 text-sm">
                        <CheckCircle2 className="w-4 h-4 text-primary flex-shrink-0" />
                        <span>{f}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <Button variant="hero" size="xl" className="w-full sm:w-auto min-w-[280px]" onClick={startFreeTrial} disabled={isStarting}>
                  {isStarting ? "Activation..." : "Accéder maintenant"} <ArrowRight className="ml-1" />
                </Button>
                <div className="mt-4 flex items-center gap-2 text-xs text-muted-foreground">
                  <ShieldCheck className="w-4 h-4" /> Paiement sécurisé Stripe · Accès immédiat
                </div>
                
              </div>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* ============== GUARANTEE / WHO ============== */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <Card className="max-w-4xl mx-auto border-2 border-border bg-gradient-to-br from-background to-muted/30">
            <CardContent className="p-8 lg:p-10">
              <div className="grid md:grid-cols-[auto,1fr] gap-6 items-start">
                <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-primary to-secondary flex items-center justify-center flex-shrink-0">
                  <Building2 className="w-8 h-8 text-primary-foreground" />
                </div>
                <div>
                  <h3 className="text-2xl font-bold mb-3">Qui se cache derrière AMZing FBA ?</h3>
                  <p className="text-muted-foreground mb-4 leading-relaxed">
                    AMZing FBA est édité par <strong className="text-foreground">N.Z Consulting</strong>, société française.
                    Notre mission : rendre le e-commerce sur Amazon accessible avec des outils concrets, une méthode claire
                    et un accompagnement humain. Aucune promesse de revenus magiques, juste un cadre éprouvé.
                  </p>
                  <div className="flex flex-wrap items-center gap-x-6 gap-y-2 text-sm text-muted-foreground">
                    <span className="inline-flex items-center gap-1.5"><Smartphone className="w-4 h-4 text-primary" /> Apps iOS & Android</span>
                    <span className="inline-flex items-center gap-1.5"><Clock className="w-4 h-4 text-primary" /> Support 7j/7</span>
                    <span className="inline-flex items-center gap-1.5"><ShieldCheck className="w-4 h-4 text-primary" /> Paiement Stripe sécurisé</span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* ============== FAQ ============== */}
      <section className="py-20 lg:py-28 bg-muted/30 border-y border-border">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center mb-12">
            <Badge variant="outline" className="mb-4">FAQ</Badge>
            <h2 className="text-3xl lg:text-4xl font-bold mb-4">Vos questions, nos réponses</h2>
          </div>

          <div className="max-w-3xl mx-auto">
            <Accordion type="single" collapsible className="space-y-3">
              {[
                { q: "Qu'est-ce qu'AMZing FBA exactement ?", a: "Une plateforme tout-en-un qui combine outils de sourcing, formation Amazon FBA complète, catalogue de fournisseurs vérifiés, communauté privée et coaching hebdomadaire. Tout est inclus dans un seul abonnement." },
                { q: "Combien coûte l'accès ?", a: "500€ TTC en offre de lancement (au lieu de 700€), ou 64€/mois sur 12 mois. Aucun frais caché, l'accès dure 12 mois complets." },
                { q: "C'est adapté aux débutants ?", a: "Oui. La formation reprend depuis zéro : création de société, ouverture de compte vendeur, premier produit, expédition. Le support et le coaching sont là pour vous accompagner." },
                { q: "Combien de temps avant les premiers résultats ?", a: "La plupart de nos membres lancent leur premier produit entre 3 et 8 semaines après l'inscription. Les résultats dépendent de votre implication et de votre budget de départ." },
                { q: "Quel budget pour démarrer en plus de l'abonnement ?", a: "Comptez 500 à 2 000€ de stock initial selon les produits choisis. La méthode privilégie les produits à faible mise de fonds pour limiter le risque." },
                { q: "Puis-je payer en plusieurs fois ?", a: "Oui, le paiement en 12 fois sans frais est disponible (64€/mois). Paiement sécurisé via Stripe." },
                { q: "Y a-t-il une application mobile ?", a: "Oui, AMZing FBA est disponible en application iOS native (App Store) et Android. Vous suivez vos alertes et la communauté depuis votre smartphone." },
                { q: "Comment résilier ?", a: "L'abonnement est annuel et engage sur 12 mois. À l'issue, vous pouvez ne pas renouveler en 2 clics depuis votre espace." },
              ].map((item, i) => (
                <AccordionItem key={i} value={`item-${i}`} className="bg-background rounded-xl border border-border px-5">
                  <AccordionTrigger className="text-left font-semibold hover:no-underline py-5">
                    <span className="flex items-center gap-3">
                      <HelpCircle className="w-5 h-5 text-primary flex-shrink-0" />
                      {item.q}
                    </span>
                  </AccordionTrigger>
                  <AccordionContent className="text-muted-foreground pl-8 pb-5">{item.a}</AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>

            <div className="text-center mt-8">
              <Link to="/faq" className="text-primary hover:underline font-medium inline-flex items-center gap-2">
                Voir toutes les questions <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* ============== FINAL CTA ============== */}
      <section className="relative overflow-hidden bg-gradient-to-br from-primary via-primary to-secondary py-20 lg:py-28">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(255,255,255,0.18),transparent_55%)] pointer-events-none" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_75%_80%,rgba(255,255,255,0.12),transparent_50%)] pointer-events-none" />

        <div className="container mx-auto px-4 relative text-center text-white">
          <Badge className="mb-6 bg-white/15 text-white border-white/25 hover:bg-white/20 backdrop-blur">
            <Sparkles className="w-3 h-3 mr-1" /> Offre de lancement -29%
          </Badge>
          <h2 className="text-3xl lg:text-5xl font-bold mb-5 max-w-3xl mx-auto leading-tight">
            Prêt à lancer votre business Amazon FBA ?
          </h2>
          <p className="text-lg lg:text-xl text-white/90 mb-8 max-w-2xl mx-auto">
            Rejoignez les 500+ vendeurs qui utilisent AMZing FBA pour sourcer, vendre et scaler chaque mois.
          </p>

          <div className="flex flex-col sm:flex-row gap-3 justify-center items-center">
            <Button
              size="xl"
              onClick={startFreeTrial}
              disabled={isStarting}
              className="bg-white text-primary hover:bg-white/95 min-w-[260px] shadow-2xl font-semibold"
            >
              {isStarting ? "Activation..." : "Accéder à AMZing FBA"} <ArrowRight className="ml-1" />
            </Button>
            <Button size="xl" variant="outline" asChild className="bg-transparent border-2 border-white/60 text-white hover:bg-white/10 hover:text-white min-w-[220px]">
              <Link to="/formation">Voir la formation</Link>
            </Button>
          </div>

          <p className="mt-6 text-white/95">
            <span className="line-through opacity-70 mr-1">700€</span>
            <span className="font-bold text-xl">500€ TTC</span>
            <span className="mx-2 opacity-70">·</span>
            <span>ou 64€/mois × 12 sans frais</span>
          </p>
          <div className="mt-3 flex flex-wrap items-center justify-center gap-x-5 gap-y-1 text-sm text-white/85">
            <span className="inline-flex items-center gap-1"><ShieldCheck className="w-4 h-4" /> Paiement sécurisé Stripe</span>
            <span className="inline-flex items-center gap-1"><Zap className="w-4 h-4" /> Accès immédiat</span>
            <span className="inline-flex items-center gap-1"><BadgeCheck className="w-4 h-4" /> Société française</span>
          </div>
        </div>
      </section>

      <Footer />

      {/* CGV Modal */}
      <Dialog open={showCGVModal} onOpenChange={setShowCGVModal}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Confirmation d'abonnement</DialogTitle>
            <DialogDescription>Veuillez accepter les conditions avant de continuer</DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-4">
            <div className="bg-primary/5 p-4 rounded-lg border border-primary/20">
              <p className="text-sm font-semibold mb-2">Abonnement VIP AMZing FBA — Annuel</p>
              <p className="text-2xl font-bold text-primary">
                700€<span className="text-sm font-normal text-muted-foreground">/an TTC</span>
              </p>
              <p className="text-sm text-muted-foreground">ou ~64€/mois × 12 mois</p>
              <p className="text-xs text-muted-foreground mt-2">Accès pendant 12 mois</p>
            </div>

            <div className="flex items-start space-x-3">
              <Checkbox
                id="cgv-payment"
                checked={acceptedCGV}
                onCheckedChange={(checked) => setAcceptedCGV(checked === true)}
                className="mt-1"
              />
              <label htmlFor="cgv-payment" className="text-sm leading-relaxed cursor-pointer select-none">
                Je reconnais avoir lu et accepté les{" "}
                <Link to="/cgv" target="_blank" className="text-primary hover:underline font-medium" onClick={(e) => e.stopPropagation()}>
                  Conditions Générales de Vente
                </Link>{" "}
                et je demande l'exécution immédiate du service.
              </label>
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setShowCGVModal(false)}>Annuler</Button>
            <Button onClick={handleConfirmPayment} disabled={!acceptedCGV || isStarting} className="bg-gradient-to-r from-primary to-secondary">
              {isStarting ? "Traitement..." : "Confirmer le paiement"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Index;
