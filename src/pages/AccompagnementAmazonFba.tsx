import { useMemo, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { z } from "zod";
import SEO from "@/components/SEO";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { supabase } from "@/integrations/supabase/client";
import { cn } from "@/lib/utils";
import { ArrowRight, CheckCircle2, Lightbulb, PhoneCall, Route, ShieldCheck } from "lucide-react";
import { toast } from "sonner";

const LEVELS = ["Débutant", "Déjà vendeur Amazon", "E-commerçant hors Amazon", "Autre"] as const;
const OBJECTIVES = ["Me former", "Être accompagné", "Trouver des produits", "Structurer mon activité", "Autre"] as const;
const BUDGETS = ["Moins de 500 €", "500 à 1 500 €", "1 500 à 5 000 €", "Plus de 5 000 €"] as const;

declare global {
  interface Window {
    dataLayer?: Array<Record<string, unknown>>;
    gtag?: (...args: unknown[]) => void;
  }
}

const leadSchema = z.object({
  first_name: z.string().trim().min(1, "Le prénom est requis").max(100, "Le prénom est trop long"),
  last_name: z.string().trim().min(1, "Le nom est requis").max(100, "Le nom est trop long"),
  email: z.string().trim().email("Merci de saisir une adresse email valide.").max(255, "L'email est trop long"),
  phone: z.string().trim().min(1, "Le téléphone est requis").max(40, "Le téléphone est trop long"),
  level: z.enum(LEVELS, { message: "Sélectionnez votre niveau actuel." }),
  objective: z.enum(OBJECTIVES, { message: "Sélectionnez votre objectif principal." }),
  budget: z.enum(BUDGETS, { message: "Sélectionnez votre budget de départ approximatif." }),
  message: z.string().trim().max(2000, "Le message est trop long").optional(),
  consent: z.literal(true, { errorMap: () => ({ message: "Merci d'accepter d'être recontacté par AMZing FBA concernant votre demande." }) }),
});

type LeadFormValues = {
  first_name: string;
  last_name: string;
  email: string;
  phone: string;
  level: string;
  objective: string;
  budget: string;
  message: string;
  consent: boolean;
};

const initialValues: LeadFormValues = {
  first_name: "",
  last_name: "",
  email: "",
  phone: "",
  level: "",
  objective: "",
  budget: "",
  message: "",
  consent: false,
};

const heroPoints = [
  "Outils d’analyse produit avec estimation de marge et de ROI",
  "Opportunités de sourcing analysées selon des critères de marge, de frais et de concurrence",
  "Accompagnement sur la compréhension des frais, du sourcing et de la logistique FBA/FBM",
];

const whyCallCards = [
  {
    icon: Lightbulb,
    title: "Vérifier si Amazon FBA est adapté à votre profil",
    description: "Évaluez si ce modèle correspond à votre situation, votre budget et votre niveau d’avancement.",
  },
  {
    icon: Route,
    title: "Comprendre les étapes avant de vous lancer",
    description: "Identifiez les priorités de départ, les points de vigilance et la logique de mise en place.",
  },
  {
    icon: PhoneCall,
    title: "Découvrir la méthode AMZing FBA sans engagement",
    description: "Obtenez une vision claire de l’accompagnement et posez vos questions avant toute décision.",
  },
];

const buildFieldErrorMap = (error: z.ZodError) => {
  const fieldErrors: Partial<Record<keyof LeadFormValues, string>> = {};

  error.errors.forEach((issue) => {
    const field = issue.path[0];
    if (typeof field === "string" && !fieldErrors[field as keyof LeadFormValues]) {
      fieldErrors[field as keyof LeadFormValues] = issue.message;
    }
  });

  return fieldErrors;
};

const LeadForm = ({ id, compact = false }: { id: string; compact?: boolean }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const [loading, setLoading] = useState(false);
  const [values, setValues] = useState<LeadFormValues>(initialValues);
  const [errors, setErrors] = useState<Partial<Record<keyof LeadFormValues, string>>>({});

  const legalNotice = "AMZing FBA propose un accompagnement pédagogique et opérationnel. Les résultats dépendent du profil, du budget, du marché, du travail fourni et de la stratégie appliquée. Aucun résultat financier n’est garanti.";

  const updateField = <K extends keyof LeadFormValues>(field: K, value: LeadFormValues[K]) => {
    setValues((current) => ({ ...current, [field]: value }));
    setErrors((current) => ({ ...current, [field]: undefined }));
  };

  const submit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setErrors({});

    const payload = {
      ...values,
      first_name: values.first_name.trim(),
      last_name: values.last_name.trim(),
      email: values.email.trim(),
      phone: values.phone.trim(),
      message: values.message.trim(),
    };

    const parsed = leadSchema.safeParse(payload);
    if (!parsed.success) {
      const fieldErrors = buildFieldErrorMap(parsed.error);
      setErrors(fieldErrors);
      toast.error(parsed.error.errors[0]?.message ?? "Merci de vérifier les champs du formulaire.");
      return;
    }

    setLoading(true);

    try {
      const { data, error } = await supabase.functions.invoke("submit-lead", {
        body: {
          ...parsed.data,
          source_page: location.pathname,
          source: "google_ads",
        },
      });

      if (error || !data?.ok) {
        throw new Error(error?.message || "Une erreur est survenue lors de l'envoi du formulaire.");
      }

      window.dataLayer = window.dataLayer || [];
      window.dataLayer.push({
        event: "lead_submit_amzingfba",
        page: location.pathname,
      });

      if (typeof window.gtag === "function") {
        window.gtag("event", "lead_submit_amzingfba", { page: location.pathname });
      }

      setValues(initialValues);
      navigate("/demande-recue");
    } catch (error) {
      const message = error instanceof Error ? error.message : "Une erreur est survenue. Réessayez.";
      toast.error(message);
    } finally {
      setLoading(false);
    }
  };

  const formSpacing = compact ? "space-y-3" : "space-y-4";
  const gridGap = compact ? "gap-3" : "gap-4";

  return (
    <form id={id} onSubmit={submit} className={formSpacing} noValidate>
      <div className={cn("grid grid-cols-1 sm:grid-cols-2", gridGap)}>
        <div className="space-y-1.5">
          <Label htmlFor={`${id}-first_name`}>Prénom</Label>
          <Input
            id={`${id}-first_name`}
            autoComplete="given-name"
            maxLength={100}
            value={values.first_name}
            onChange={(event) => updateField("first_name", event.target.value)}
            className={errors.first_name ? "border-destructive focus-visible:ring-destructive" : ""}
          />
          {errors.first_name && <p className="text-sm text-destructive">{errors.first_name}</p>}
        </div>
        <div className="space-y-1.5">
          <Label htmlFor={`${id}-last_name`}>Nom</Label>
          <Input
            id={`${id}-last_name`}
            autoComplete="family-name"
            maxLength={100}
            value={values.last_name}
            onChange={(event) => updateField("last_name", event.target.value)}
            className={errors.last_name ? "border-destructive focus-visible:ring-destructive" : ""}
          />
          {errors.last_name && <p className="text-sm text-destructive">{errors.last_name}</p>}
        </div>
      </div>

      <div className={cn("grid grid-cols-1 sm:grid-cols-2", gridGap)}>
        <div className="space-y-1.5">
          <Label htmlFor={`${id}-email`}>Email</Label>
          <Input
            id={`${id}-email`}
            type="email"
            autoComplete="email"
            maxLength={255}
            value={values.email}
            onChange={(event) => updateField("email", event.target.value)}
            className={errors.email ? "border-destructive focus-visible:ring-destructive" : ""}
          />
          {errors.email && <p className="text-sm text-destructive">{errors.email}</p>}
        </div>
        <div className="space-y-1.5">
          <Label htmlFor={`${id}-phone`}>Téléphone</Label>
          <Input
            id={`${id}-phone`}
            type="tel"
            autoComplete="tel"
            maxLength={40}
            value={values.phone}
            onChange={(event) => updateField("phone", event.target.value)}
            className={errors.phone ? "border-destructive focus-visible:ring-destructive" : ""}
          />
          {errors.phone && <p className="text-sm text-destructive">{errors.phone}</p>}
        </div>
      </div>

      <div className={cn("grid grid-cols-1", compact ? "gap-3" : "gap-4")}>
        <div className="space-y-1.5">
          <Label>Niveau actuel</Label>
          <Select value={values.level} onValueChange={(value) => updateField("level", value)}>
            <SelectTrigger className={errors.level ? "border-destructive focus:ring-destructive" : ""}>
              <SelectValue placeholder="Débutant / Déjà vendeur Amazon / E-commerçant hors Amazon / Autre" />
            </SelectTrigger>
            <SelectContent>
              {LEVELS.map((level) => (
                <SelectItem key={level} value={level}>
                  {level}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          {errors.level && <p className="text-sm text-destructive">{errors.level}</p>}
        </div>

        <div className="space-y-1.5">
          <Label>Objectif principal</Label>
          <Select value={values.objective} onValueChange={(value) => updateField("objective", value)}>
            <SelectTrigger className={errors.objective ? "border-destructive focus:ring-destructive" : ""}>
              <SelectValue placeholder="Me former / Être accompagné / Trouver des produits / Structurer mon activité / Autre" />
            </SelectTrigger>
            <SelectContent>
              {OBJECTIVES.map((objective) => (
                <SelectItem key={objective} value={objective}>
                  {objective}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          {errors.objective && <p className="text-sm text-destructive">{errors.objective}</p>}
        </div>

        <div className="space-y-1.5">
          <Label>Budget de départ approximatif</Label>
          <Select value={values.budget} onValueChange={(value) => updateField("budget", value)}>
            <SelectTrigger className={errors.budget ? "border-destructive focus:ring-destructive" : ""}>
              <SelectValue placeholder="Moins de 500 € / 500 à 1 500 € / 1 500 à 5 000 € / Plus de 5 000 €" />
            </SelectTrigger>
            <SelectContent>
              {BUDGETS.map((budget) => (
                <SelectItem key={budget} value={budget}>
                  {budget}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          {errors.budget && <p className="text-sm text-destructive">{errors.budget}</p>}
        </div>
      </div>

      <div className="space-y-1.5">
        <Label htmlFor={`${id}-message`}>Message libre</Label>
        <Textarea
          id={`${id}-message`}
          rows={compact ? 3 : 4}
          maxLength={2000}
          value={values.message}
          onChange={(event) => updateField("message", event.target.value)}
          placeholder="Décrivez brièvement votre projet, votre situation actuelle ou vos questions."
          className={errors.message ? "border-destructive focus-visible:ring-destructive" : ""}
        />
        {errors.message && <p className="text-sm text-destructive">{errors.message}</p>}
      </div>

      <div className="space-y-2">
        <div className="flex items-start gap-3">
          <Checkbox
            id={`${id}-consent`}
            checked={values.consent}
            onCheckedChange={(checked) => updateField("consent", checked === true)}
            className={errors.consent ? "border-destructive" : ""}
          />
          <Label htmlFor={`${id}-consent`} className="cursor-pointer text-sm font-normal leading-relaxed text-muted-foreground">
            J’accepte d’être recontacté par AMZing FBA concernant ma demande.
          </Label>
        </div>
        {errors.consent && <p className="text-sm text-destructive">{errors.consent}</p>}
      </div>

      <Button type="submit" size="lg" disabled={loading} className="h-12 w-full text-base sm:h-14">
        {loading ? "Envoi en cours…" : "Être recontacté par AMZing FBA"}
        {!loading && <ArrowRight className="ml-2 h-4 w-4" />}
      </Button>

      <p className="text-xs leading-relaxed text-muted-foreground">{legalNotice}</p>

      <div className="flex flex-wrap gap-x-4 gap-y-2 text-xs text-muted-foreground">
        <Link to="/mentions-legales" className="hover:underline">
          Mentions légales
        </Link>
        <Link to="/cgv" className="hover:underline">
          Conditions générales
        </Link>
        <Link to="/confidentialite" className="hover:underline">
          Politique de confidentialité
        </Link>
      </div>
    </form>
  );
};

const AccompagnementAmazonFba = () => {
  const canonicalUrl = "https://amzingfba.com/accompagnement-amazon-fba";

  const schema = useMemo(
    () => ({
      "@context": "https://schema.org",
      "@type": "Service",
      name: "Formation et accompagnement Amazon FBA",
      provider: {
        "@type": "Organization",
        name: "AMZing FBA",
        url: "https://amzingfba.com",
      },
      areaServed: "FR",
      url: canonicalUrl,
      description:
        "Formation et accompagnement Amazon FBA avec analyse produit, compréhension des frais, sourcing et logistique FBA/FBM.",
    }),
    [canonicalUrl],
  );

  return (
    <div className="min-h-screen bg-background text-foreground">
      <SEO
        title="Formation et accompagnement Amazon FBA | AMZing FBA"
        description="Formation et accompagnement Amazon FBA avec analyse produit, compréhension des frais, sourcing et logistique FBA/FBM. Demander un rappel."
        schema={schema}
      />

      <header className="sticky top-0 z-30 border-b border-border/60 bg-background/95 backdrop-blur">
        <div className="container mx-auto flex h-16 items-center justify-between px-4">
          <Link to="/" className="text-lg font-bold tracking-tight">
            AMZing <span className="text-primary">FBA</span>
          </Link>
          <Button asChild size="sm" className="h-10 px-4">
            <a href="#formulaire-lead">Demander un rappel</a>
          </Button>
        </div>
      </header>

      <main>
        <section className="border-b border-border/50 bg-muted/20">
          <div className="container mx-auto px-4 py-8 sm:py-10 lg:py-14">
            <div className="grid items-start gap-6 lg:grid-cols-[minmax(0,1.05fr)_minmax(340px,460px)] lg:gap-8">
              <div className="order-1 max-w-2xl space-y-5 lg:space-y-6 lg:pt-4">
                <div className="inline-flex w-fit items-center gap-2 rounded-full border border-primary/30 bg-primary/5 px-3 py-1 text-xs font-medium text-primary">
                  <ShieldCheck className="h-3.5 w-3.5" />
                  Formation et accompagnement Amazon FBA
                </div>

                <div className="space-y-3">
                  <h1 className="max-w-xl text-4xl font-bold leading-none sm:text-5xl lg:text-6xl">
                    Structurez votre activité Amazon FBA avec une méthode claire et progressive
                  </h1>
                  <p className="max-w-2xl text-base leading-relaxed text-muted-foreground sm:text-lg">
                    AMZing FBA accompagne les entrepreneurs et e-commerçants dans la formation Amazon FBA,
                    l’analyse produit, la compréhension des frais, le sourcing et la logistique FBA/FBM.
                  </p>
                </div>

                <div className="order-2 lg:hidden">
                  <Card id="formulaire-lead" className="border-border/60 p-4 shadow-xl sm:p-5">
                    <div className="mb-4 space-y-1">
                      <h2 className="text-xl font-semibold">Demander un rappel</h2>
                      <p className="text-sm text-muted-foreground">
                        Laissez vos coordonnées pour être recontacté par l’équipe AMZing FBA.
                      </p>
                    </div>
                    <LeadForm id="lead-mobile" compact />
                  </Card>
                </div>

                <div className="grid gap-3 pt-1">
                  {heroPoints.map((point) => (
                    <div key={point} className="flex items-start gap-3 text-sm leading-relaxed text-muted-foreground sm:text-base">
                      <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
                      <span>{point}</span>
                    </div>
                  ))}
                </div>

                <div className="rounded-lg border border-border/60 bg-background px-4 py-4 sm:px-5">
                  <p className="text-sm font-semibold text-foreground sm:text-base">
                    Accès annuel : 700 € TTC/an, ou paiement en 12 mensualités d’environ 64 €/mois, soit un engagement annuel de 12 mois.
                  </p>
                </div>
              </div>

              <div className="order-2 hidden lg:block">
                <Card id="formulaire-lead" className="border-border/60 p-6 shadow-xl lg:sticky lg:top-24">
                  <div className="mb-5 space-y-1">
                    <h2 className="text-2xl font-semibold">Demander un rappel</h2>
                    <p className="text-sm text-muted-foreground">
                      Laissez vos coordonnées pour être recontacté par l’équipe AMZing FBA.
                    </p>
                  </div>
                  <LeadForm id="lead-desktop" />
                </Card>
              </div>
            </div>
          </div>
        </section>

        <section className="py-14 lg:py-20">
          <div className="container mx-auto px-4">
            <div className="mx-auto max-w-2xl text-center">
              <h2 className="text-2xl font-bold sm:text-3xl">Pourquoi demander un rappel ?</h2>
            </div>

            <div className="mt-8 grid gap-4 md:grid-cols-3">
              {whyCallCards.map((card) => (
                <Card key={card.title} className="border-border/60 p-6 shadow-sm">
                  <div className="mb-4 flex h-11 w-11 items-center justify-center rounded-lg bg-primary/10 text-primary">
                    <card.icon className="h-5 w-5" />
                  </div>
                  <h3 className="text-lg font-semibold leading-snug">{card.title}</h3>
                  <p className="mt-3 text-sm leading-relaxed text-muted-foreground">{card.description}</p>
                </Card>
              ))}
            </div>
          </div>
        </section>

        <section className="border-y border-border/50 bg-muted/20 py-16">
          <div className="container mx-auto px-4">
            <div className="mx-auto max-w-3xl text-center">
              <h2 className="text-2xl font-bold sm:text-3xl">Vous souhaitez en savoir plus ?</h2>
              <p className="mt-3 text-base leading-relaxed text-muted-foreground">
                Laissez vos coordonnées et l’équipe AMZing FBA vous recontactera.
              </p>
              <Button asChild size="lg" className="mt-8 h-12 px-8 text-base sm:h-14">
                <a href="#formulaire-lead">
                  Demander un rappel
                  <ArrowRight className="ml-2 h-4 w-4" />
                </a>
              </Button>
            </div>
          </div>
        </section>
      </main>

      <footer className="border-t border-border/60 py-8 text-center text-xs text-muted-foreground">
        <div className="container mx-auto max-w-3xl space-y-3 px-4">
          <p className="leading-relaxed">
            AMZing FBA est une plateforme indépendante et n’est pas affiliée, sponsorisée ou approuvée par Amazon.
          </p>
          <p>© {new Date().getFullYear()} AMZing FBA — N.Z Consulting</p>
          <div className="flex flex-wrap justify-center gap-4">
            <Link to="/mentions-legales" className="hover:underline">
              Mentions légales
            </Link>
            <Link to="/cgv" className="hover:underline">
              Conditions générales
            </Link>
            <Link to="/confidentialite" className="hover:underline">
              Politique de confidentialité
            </Link>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default AccompagnementAmazonFba;