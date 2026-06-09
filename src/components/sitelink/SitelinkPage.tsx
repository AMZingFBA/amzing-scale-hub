import { ReactNode } from "react";
import { Link } from "react-router-dom";
import SEO from "@/components/SEO";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import {
  ArrowRight,
  CheckCircle2,
  ShieldCheck,
  Sparkles,
  Clock,
  Target,
  LineChart,
  Users,
  PhoneCall,
} from "lucide-react";

const CTA_HREF = "/accompagnement";

interface Feature {
  icon: "sparkles" | "clock" | "target" | "line" | "users" | "shield" | "phone";
  title: string;
  description: string;
}

const iconMap = {
  sparkles: Sparkles,
  clock: Clock,
  target: Target,
  line: LineChart,
  users: Users,
  shield: ShieldCheck,
  phone: PhoneCall,
};

export interface SitelinkPageProps {
  seoTitle: string;
  seoDescription: string;
  canonicalPath: string;
  badge: string;
  h1: string;
  intro: string;
  heroBullets: string[];
  ctaPrimaryLabel: string;
  ctaSecondaryLabel?: string;
  sections: { title: string; body: ReactNode }[];
  features: Feature[];
  faq: { q: string; a: string }[];
}

const ReassuranceBadges = () => (
  <div className="mt-6 flex flex-wrap gap-3 text-xs text-muted-foreground">
    <span className="inline-flex items-center gap-1.5 rounded-full border border-border/60 bg-background px-3 py-1.5">
      <ShieldCheck className="h-3.5 w-3.5 text-primary" /> Méthode structurée
    </span>
    <span className="inline-flex items-center gap-1.5 rounded-full border border-border/60 bg-background px-3 py-1.5">
      <Sparkles className="h-3.5 w-3.5 text-primary" /> Outils IA
    </span>
    <span className="inline-flex items-center gap-1.5 rounded-full border border-border/60 bg-background px-3 py-1.5">
      <Users className="h-3.5 w-3.5 text-primary" /> Accompagnement humain
    </span>
    <span className="inline-flex items-center gap-1.5 rounded-full border border-border/60 bg-background px-3 py-1.5">
      <Clock className="h-3.5 w-3.5 text-primary" /> Gain de temps
    </span>
  </div>
);

const SITELINKS: { label: string; to: string }[] = [
  { label: "Accompagnement Amazon FBA", to: "/accompagnement-amazon-fba" },
  { label: "Sourcing automatique IA", to: "/sourcing-automatique-ia" },
  { label: "Analyse de rentabilité", to: "/analyse-rentabilite-amazon" },
  { label: "Outils vendeurs Amazon", to: "/outils-vendeurs-amazon" },
  { label: "Programme AMZing FBA", to: "/programme-amzing-fba" },
  { label: "Appel gratuit", to: "/appel-gratuit" },
];

export const SitelinkPage = ({
  seoTitle,
  seoDescription,
  canonicalPath,
  badge,
  h1,
  intro,
  heroBullets,
  ctaPrimaryLabel,
  ctaSecondaryLabel = "Être rappelé",
  sections,
  features,
  faq,
}: SitelinkPageProps) => {
  const canonicalUrl = `https://amzingfba.com${canonicalPath}`;
  const schema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faq.map((item) => ({
      "@type": "Question",
      name: item.q,
      acceptedAnswer: { "@type": "Answer", text: item.a },
    })),
  };

  return (
    <div className="min-h-screen bg-background text-foreground">
      <SEO title={seoTitle} description={seoDescription} canonical={canonicalUrl} schema={schema} />

      {/* HEADER */}
      <header className="sticky top-0 z-30 border-b border-border/60 bg-background/95 backdrop-blur">
        <div className="container mx-auto flex h-16 items-center justify-between gap-4 px-4">
          <Link to="/" className="text-lg font-bold tracking-tight">
            AMZing <span className="text-primary">FBA</span>
          </Link>
          <Button asChild size="sm" className="h-10 px-4">
            <Link to={CTA_HREF}>{ctaPrimaryLabel}</Link>
          </Button>
        </div>
      </header>

      <main>
        {/* HERO */}
        <section className="border-b border-border/50 bg-muted/20">
          <div className="container mx-auto px-4 py-12 sm:py-16 lg:py-20">
            <div className="mx-auto max-w-3xl text-center">
              <div className="inline-flex items-center gap-2 rounded-full border border-primary/30 bg-primary/5 px-3 py-1 text-xs font-medium text-primary">
                <ShieldCheck className="h-3.5 w-3.5" />
                {badge}
              </div>
              <h1 className="mt-5 text-4xl font-bold leading-tight sm:text-5xl lg:text-6xl">
                {h1}
              </h1>
              <p className="mt-5 text-base leading-relaxed text-muted-foreground sm:text-lg">
                {intro}
              </p>

              <div className="mt-7 flex flex-wrap justify-center gap-3">
                <Button asChild size="lg" className="h-12 px-6 text-base sm:h-14">
                  <Link to={CTA_HREF}>
                    {ctaPrimaryLabel} <ArrowRight className="ml-2 h-4 w-4" />
                  </Link>
                </Button>
                <Button asChild size="lg" variant="outline" className="h-12 px-6 text-base sm:h-14">
                  <Link to={CTA_HREF}>{ctaSecondaryLabel}</Link>
                </Button>
              </div>

              <div className="mt-8 grid gap-3 text-left sm:grid-cols-2">
                {heroBullets.map((b) => (
                  <div key={b} className="flex items-start gap-3 text-sm leading-relaxed text-muted-foreground sm:text-base">
                    <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
                    <span>{b}</span>
                  </div>
                ))}
              </div>

              <div className="flex justify-center">
                <ReassuranceBadges />
              </div>
            </div>
          </div>
        </section>

        {/* FEATURES */}
        <section className="py-14 lg:py-20">
          <div className="container mx-auto px-4">
            <div className="mx-auto max-w-2xl text-center">
              <h2 className="text-2xl font-bold sm:text-3xl">Ce que vous obtenez avec AMZing FBA</h2>
              <p className="mt-3 text-muted-foreground">
                Une méthode, des outils et un accompagnement pour avancer avec clarté.
              </p>
            </div>
            <div className="mt-10 grid gap-4 md:grid-cols-3">
              {features.map((f) => {
                const Icon = iconMap[f.icon];
                return (
                  <Card key={f.title} className="border-border/60 p-6 shadow-sm">
                    <div className="mb-4 flex h-11 w-11 items-center justify-center rounded-lg bg-primary/10 text-primary">
                      <Icon className="h-5 w-5" />
                    </div>
                    <h3 className="text-lg font-semibold leading-snug">{f.title}</h3>
                    <p className="mt-3 text-sm leading-relaxed text-muted-foreground">{f.description}</p>
                  </Card>
                );
              })}
            </div>
          </div>
        </section>

        {/* CONTENT SECTIONS */}
        <section className="border-y border-border/50 bg-muted/20 py-14 lg:py-20">
          <div className="container mx-auto max-w-4xl px-4 space-y-10">
            {sections.map((s) => (
              <article key={s.title}>
                <h2 className="text-2xl font-bold sm:text-3xl">{s.title}</h2>
                <div className="mt-4 space-y-4 text-base leading-relaxed text-muted-foreground">
                  {s.body}
                </div>
              </article>
            ))}

            <div className="rounded-lg border border-border/60 bg-background p-5 text-sm leading-relaxed text-muted-foreground">
              <strong className="text-foreground">Important :</strong> les résultats dépendent du
              profil, du budget, du marché, de l’implication et de la stratégie appliquée. AMZing FBA
              fournit un accompagnement pédagogique et opérationnel, sans aucune garantie de résultat
              financier.
            </div>

            <div className="text-center">
              <Button asChild size="lg" className="h-12 px-8 text-base sm:h-14">
                <Link to={CTA_HREF}>
                  {ctaPrimaryLabel} <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
            </div>
          </div>
        </section>

        {/* FAQ */}
        <section className="py-14 lg:py-20">
          <div className="container mx-auto max-w-3xl px-4">
            <div className="text-center">
              <h2 className="text-2xl font-bold sm:text-3xl">Questions fréquentes</h2>
            </div>
            <Accordion type="single" collapsible className="mt-8">
              {faq.map((item, i) => (
                <AccordionItem key={item.q} value={`item-${i}`}>
                  <AccordionTrigger className="text-left text-base font-semibold">
                    {item.q}
                  </AccordionTrigger>
                  <AccordionContent className="text-base leading-relaxed text-muted-foreground">
                    {item.a}
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </div>
        </section>

        {/* INTERNAL LINKS */}
        <section className="border-t border-border/50 bg-muted/20 py-12">
          <div className="container mx-auto px-4">
            <h2 className="text-center text-xl font-bold sm:text-2xl">Explorer aussi</h2>
            <div className="mx-auto mt-6 flex max-w-3xl flex-wrap justify-center gap-2">
              {SITELINKS.filter((l) => l.to !== canonicalPath).map((l) => (
                <Link
                  key={l.to}
                  to={l.to}
                  className="rounded-full border border-border/60 bg-background px-4 py-2 text-sm text-foreground transition hover:border-primary hover:text-primary"
                >
                  {l.label}
                </Link>
              ))}
            </div>
          </div>
        </section>

        {/* FINAL CTA */}
        <section className="bg-primary/5 py-16">
          <div className="container mx-auto max-w-3xl px-4 text-center">
            <h2 className="text-2xl font-bold sm:text-3xl">Prêt à passer à l’étape suivante ?</h2>
            <p className="mt-3 text-base leading-relaxed text-muted-foreground">
              Demandez un accompagnement personnalisé avec AMZing FBA et bénéficiez d’une méthode
              claire pour structurer votre activité Amazon.
            </p>
            <div className="mt-7 flex flex-wrap justify-center gap-3">
              <Button asChild size="lg" className="h-12 px-6 text-base sm:h-14">
                <Link to={CTA_HREF}>
                  Demander un accompagnement <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
              <Button asChild size="lg" variant="outline" className="h-12 px-6 text-base sm:h-14">
                <Link to={CTA_HREF}>Accéder au formulaire</Link>
              </Button>
            </div>
          </div>
        </section>
      </main>

      <footer className="border-t border-border/60 py-8 text-center text-xs text-muted-foreground">
        <div className="container mx-auto max-w-3xl space-y-3 px-4">
          <p className="leading-relaxed">
            AMZing FBA est une plateforme indépendante et n’est pas affiliée, sponsorisée ou
            approuvée par Amazon.
          </p>
          <p>© {new Date().getFullYear()} AMZing FBA — N.Z Consulting</p>
          <div className="flex flex-wrap justify-center gap-4">
            <Link to="/mentions-legales" className="hover:underline">Mentions légales</Link>
            <Link to="/cgv" className="hover:underline">CGV</Link>
            <Link to="/confidentialite" className="hover:underline">Confidentialité</Link>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default SitelinkPage;
