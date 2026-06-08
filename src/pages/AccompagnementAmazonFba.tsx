import { useState } from "react";
import SEO from "@/components/SEO";
import { Link, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import {
  CheckCircle2,
  Calculator,
  ShieldCheck,
  Search,
  ArrowRight,
  PhoneCall,
  Lightbulb,
  Route,
} from "lucide-react";

const LEVELS = ["Débutant", "Déjà vendeur Amazon", "E-commerçant hors Amazon", "Autre"];
const OBJECTIVES = ["Me former", "Être accompagné", "Trouver des produits", "Structurer mon activité", "Autre"];
const BUDGETS = ["Moins de 500 €", "500 à 1 500 €", "1 500 à 5 000 €", "Plus de 5 000 €"];

declare global {
  interface Window {
    dataLayer?: any[];
    gtag?: (...args: any[]) => void;
  }
}

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const LeadForm = ({ id }: { id: string }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    first_name: "", last_name: "", email: "", phone: "",
    level: "", objective: "", budget: "", message: "", consent: false,
  });

  const update = (k: keyof typeof form, v: any) => setForm((f) => ({ ...f, [k]: v }));

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    const normalized = {
      ...form,
      first_name: form.first_name.trim(),
      last_name: form.last_name.trim(),
      email: form.email.trim(),
      phone: form.phone.trim(),
      message: form.message.trim(),
    };

    if (!form.consent) {
      toast.error("Merci d'accepter d'être recontacté.");
      return;
    }
    if (!normalized.first_name || !normalized.last_name || !normalized.email || !normalized.phone) {
      toast.error("Merci de remplir les champs obligatoires.");
      return;
    }
    if (!EMAIL_RE.test(normalized.email)) {
      toast.error("Merci de saisir une adresse email valide.");
      return;
    }
    if (!form.level || !form.objective || !form.budget) {
      toast.error("Merci de sélectionner votre niveau, votre objectif et votre budget.");
      return;
    }

    setLoading(true);
    try {
      const { data, error } = await supabase.functions.invoke("submit-lead", {
        body: { ...normalized, level: form.level, objective: form.objective, budget: form.budget, consent: form.consent, source_page: location.pathname, source: "google_ads" },
      });
      if (error || !data?.ok) throw new Error(error?.message || "Erreur");

      // Google Ads / GA4 conversion event — fires only after a successful submission
      window.dataLayer = window.dataLayer || [];
      window.dataLayer.push({
        event: "lead_submit_amzingfba",
        page: location.pathname,
      });
      if (typeof window.gtag === "function") {
        window.gtag("event", "lead_submit_amzingfba", { page: location.pathname });
      }

      navigate("/demande-recue");
    } catch (err: any) {
      toast.error(err.message || "Une erreur est survenue. Réessayez.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form id={id} onSubmit={submit} className="space-y-4">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="space-y-1.5">
          <Label htmlFor={`${id}-fn`}>Prénom *</Label>
          <Input id={`${id}-fn`} required maxLength={100} value={form.first_name} onChange={(e) => update("first_name", e.target.value)} />
        </div>
        <div className="space-y-1.5">
          <Label htmlFor={`${id}-ln`}>Nom *</Label>
          <Input id={`${id}-ln`} required maxLength={100} value={form.last_name} onChange={(e) => update("last_name", e.target.value)} />
        </div>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="space-y-1.5">
          <Label htmlFor={`${id}-em`}>Email *</Label>
          <Input id={`${id}-em`} required type="email" maxLength={255} value={form.email} onChange={(e) => update("email", e.target.value)} />
        </div>
        <div className="space-y-1.5">
          <Label htmlFor={`${id}-ph`}>Téléphone *</Label>
          <Input id={`${id}-ph`} required type="tel" maxLength={40} value={form.phone} onChange={(e) => update("phone", e.target.value)} />
        </div>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="space-y-1.5">
          <Label>Niveau actuel *</Label>
          <Select value={form.level} onValueChange={(v) => update("level", v)}>
            <SelectTrigger><SelectValue placeholder="Sélectionner" /></SelectTrigger>
            <SelectContent>{LEVELS.map((l) => <SelectItem key={l} value={l}>{l}</SelectItem>)}</SelectContent>
          </Select>
        </div>
        <div className="space-y-1.5">
          <Label>Objectif principal *</Label>
          <Select value={form.objective} onValueChange={(v) => update("objective", v)}>
            <SelectTrigger><SelectValue placeholder="Sélectionner" /></SelectTrigger>
            <SelectContent>{OBJECTIVES.map((l) => <SelectItem key={l} value={l}>{l}</SelectItem>)}</SelectContent>
          </Select>
        </div>
        <div className="space-y-1.5">
          <Label>Budget de départ approximatif *</Label>
          <Select value={form.budget} onValueChange={(v) => update("budget", v)}>
            <SelectTrigger><SelectValue placeholder="Sélectionner" /></SelectTrigger>
            <SelectContent>{BUDGETS.map((l) => <SelectItem key={l} value={l}>{l}</SelectItem>)}</SelectContent>
          </Select>
        </div>
      </div>
      <div className="space-y-1.5">
        <Label htmlFor={`${id}-msg`}>Message libre</Label>
        <Textarea id={`${id}-msg`} rows={4} maxLength={2000} value={form.message} onChange={(e) => update("message", e.target.value)} placeholder="Décrivez brièvement votre projet, votre situation actuelle ou vos questions…" />
      </div>
      <div className="flex items-start gap-3">
        <Checkbox id={`${id}-c`} checked={form.consent} onCheckedChange={(v) => update("consent", v === true)} />
        <Label htmlFor={`${id}-c`} className="text-sm leading-relaxed text-muted-foreground font-normal cursor-pointer">
          J'accepte d'être recontacté par AMZing FBA concernant ma demande. *
        </Label>
      </div>
      <Button type="submit" size="lg" disabled={loading} className="w-full h-12 text-base">
        {loading ? "Envoi en cours…" : "Être recontacté par AMZing FBA"}
        {!loading && <ArrowRight className="ml-1" />}
      </Button>
      <p className="text-xs text-muted-foreground leading-relaxed">
        AMZing FBA propose un accompagnement pédagogique et opérationnel. Les résultats dépendent
        du profil, du budget, du marché, du travail fourni et de la stratégie appliquée. Aucun
        résultat financier n'est garanti.
      </p>
      <div className="flex flex-wrap gap-x-4 gap-y-1 text-xs text-muted-foreground">
        <Link to="/mentions-legales" className="hover:underline">Mentions légales</Link>
        <Link to="/cgv" className="hover:underline">Conditions générales</Link>
        <Link to="/confidentialite" className="hover:underline">Politique de confidentialité</Link>
      </div>
    </form>
  );
};

const HERO_POINTS = [
  "Outils d'analyse produit avec estimation de marge et de ROI",
  "Opportunités de sourcing analysées selon des critères de marge, de frais et de concurrence",
  "Méthode claire pour construire une activité e-commerce structurée",
];

const WHY_CALL = [
  { icon: Lightbulb, title: "Vérifier si Amazon FBA est adapté à votre profil", desc: "Un échange pour évaluer si ce modèle correspond à votre situation, votre budget et vos objectifs." },
  { icon: Route, title: "Comprendre les étapes avant de vous lancer", desc: "Faire le point sur la méthode, les prérequis et les premières décisions à prendre." },
  { icon: PhoneCall, title: "Découvrir la méthode AMZing FBA sans engagement", desc: "Un appel d'information clair, sans pression et sans obligation d'achat." },
];

const AccompagnementAmazonFba = () => {
  const schema = {
    "@context": "https://schema.org",
    "@type": "Service",
    name: "Formation et accompagnement Amazon FBA",
    provider: {
      "@type": "Organization",
      name: "AMZing FBA",
      url: "https://amzingfba.com",
    },
    areaServed: "FR",
    url: "https://amzingfba.com/accompagnement-amazon-fba",
    description: "Landing page de demande de rappel pour la formation et l'accompagnement Amazon FBA d'AMZing FBA.",
  };

  return (
    <div className="min-h-screen bg-background text-foreground">
      <SEO
        title="Accompagnement Amazon FBA | AMZing FBA"
        description="Formation et accompagnement Amazon FBA avec méthode claire, outils d'analyse produit et rappel rapide. Demandez à être recontacté."
        schema={schema}
      />

      <header className="border-b border-border/50 bg-background/80 backdrop-blur sticky top-0 z-30">
        <div className="container mx-auto px-4 h-14 flex items-center justify-between">
          <Link to="/" className="font-bold text-lg">AMZing <span className="text-primary">FBA</span></Link>
          <a href="#form" className="text-sm font-medium hover:text-primary hidden sm:inline">Être recontacté →</a>
        </div>
      </header>

      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-background to-background pointer-events-none" />
        <div className="container mx-auto px-4 py-6 lg:py-14 relative">
          <div className="grid lg:grid-cols-2 gap-8 lg:gap-10 items-start">
            <div className="space-y-4 order-1 lg:pt-6">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-primary/30 bg-primary/5 text-xs font-medium text-primary w-fit">
                <ShieldCheck className="w-3.5 h-3.5" /> Formation et accompagnement Amazon FBA
              </div>
              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight leading-tight max-w-xl">
                Structurez votre activité Amazon FBA avec une méthode claire et progressive
              </h1>
              <p className="text-base lg:text-lg text-muted-foreground leading-relaxed max-w-xl">
                AMZing FBA accompagne les profils débutants, vendeurs Amazon et e-commerçants
                qui souhaitent clarifier leur projet, analyser leurs opportunités et mettre en
                place une activité e-commerce structurée sans promesse irréaliste.
              </p>
              <div className="hidden lg:grid gap-3 pt-2">
                {HERO_POINTS.map((point) => (
                  <div key={point} className="flex items-start gap-3 text-sm text-muted-foreground leading-relaxed">
                    <CheckCircle2 className="w-4 h-4 text-primary" /> {t}
                  </div>
                ))}
              </div>
              <div className="hidden lg:flex items-center gap-6 pt-3 text-sm text-muted-foreground">
                <span className="flex items-center gap-2"><Calculator className="w-4 h-4 text-primary" /> Accès annuel : 700 € TTC/an</span>
                <span className="flex items-center gap-2"><Search className="w-4 h-4 text-primary" /> Appel d'information sans engagement</span>
              </div>
            </div>

            <Card id="form" className="p-4 sm:p-6 shadow-xl border-border/60 scroll-mt-20 order-2 lg:sticky lg:top-20">
              <h2 className="text-xl font-semibold mb-1">Demandez un rappel</h2>
              <p className="text-sm text-muted-foreground mb-2">
                Remplissez le formulaire pour être recontacté par l'équipe AMZing FBA.
              </p>
              <p className="text-xs text-muted-foreground mb-5 leading-relaxed">
                Accès annuel : 700 € TTC/an, ou paiement en 12 mensualités d'environ 64 €/mois,
                soit un engagement annuel de 12 mois.
              </p>
              <LeadForm id="lead-top" />
            </Card>
          </div>
          <div className="grid gap-2 pt-5 lg:hidden">
            {HERO_POINTS.map((point) => (
              <div key={point} className="flex items-start gap-3 text-sm text-muted-foreground leading-relaxed">
                <CheckCircle2 className="w-4 h-4 text-primary mt-0.5 shrink-0" />
                <span>{point}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section id="decouvrir" className="py-14 lg:py-20 border-t border-border/50">
        <div className="container mx-auto px-4">
          <div className="max-w-2xl mb-10">
            <h2 className="text-2xl lg:text-3xl font-bold mb-3">Pourquoi demander un rappel ?</h2>
            <p className="text-muted-foreground">
              Un échange simple pour valider votre situation, comprendre la méthode et savoir si l'accompagnement correspond à votre profil.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {WHY_CALL.map((w) => (
              <Card key={w.title} className="p-6 hover:border-primary/40 transition-colors">
                <div className="w-11 h-11 rounded-lg bg-primary/10 text-primary flex items-center justify-center mb-4">
                  <w.icon className="w-5 h-5" />
                </div>
                <h3 className="font-semibold mb-2">{w.title}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">{w.desc}</p>
              </Card>
            ))}
          </div>
          <div className="mt-8 text-center">
            <Button asChild size="lg" className="h-12 text-base">
              <a href="#form">Demander un rappel <ArrowRight className="ml-1" /></a>
            </Button>
          </div>
        </div>
      </section>

      <section className="py-14 lg:py-20 bg-muted/30 border-y border-border/50">
        <div className="container mx-auto px-4 max-w-3xl">
          <Card className="p-6 sm:p-8 bg-background">
            <h2 className="text-2xl lg:text-3xl font-bold mb-4">Tarif de l'accompagnement</h2>
            <p className="text-base text-foreground leading-relaxed mb-3">
              <strong>Accès annuel : 700 € TTC/an</strong>, ou paiement en{" "}
              <strong>12 mensualités d'environ 64 €/mois</strong>, soit un{" "}
              <strong>engagement annuel de 12 mois</strong>.
            </p>
            <p className="text-sm text-muted-foreground leading-relaxed">
              Le tarif couvre l'accès à la méthode, aux outils d'analyse produit avec estimation
              de marge et de ROI, ainsi qu'au suivi pédagogique pendant toute la durée de
              l'engagement. Aucun résultat financier n'est garanti.
            </p>
            <div className="mt-6">
              <Button asChild size="lg" className="h-12 text-base">
                <a href="#form">Demander un rappel <ArrowRight className="ml-1" /></a>
              </Button>
            </div>
          </Card>
        </div>
      </section>

      <section className="py-14 lg:py-20">
        <div className="container mx-auto px-4 max-w-3xl text-center">
          <div className="text-center mb-8">
            <h2 className="text-2xl lg:text-3xl font-bold mb-3">Vous souhaitez en savoir plus ?</h2>
            <p className="text-muted-foreground">
              Laissez vos coordonnées et l'équipe AMZing FBA vous recontactera.
            </p>
          </div>
          <Button asChild size="lg" className="h-12 text-base">
            <a href="#form">Demander un rappel <ArrowRight className="ml-1" /></a>
          </Button>
        </div>
      </section>

      <footer className="border-t border-border/50 py-8 text-center text-xs text-muted-foreground">
        <div className="container mx-auto px-4 space-y-3 max-w-3xl">
          <p className="leading-relaxed">
            AMZing FBA est une plateforme indépendante et n'est pas affiliée, sponsorisée
            ou approuvée par Amazon.
          </p>
          <p>© {new Date().getFullYear()} AMZing FBA — N.Z Consulting</p>
          <div className="flex justify-center gap-4">
            <Link to="/mentions-legales" className="hover:underline">Mentions légales</Link>
            <Link to="/cgv" className="hover:underline">CGV</Link>
            <Link to="/confidentialite" className="hover:underline">Confidentialité</Link>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default AccompagnementAmazonFba;
