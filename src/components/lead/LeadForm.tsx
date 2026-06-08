import { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { z } from "zod";
import { Button } from "@/components/ui/button";
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
import { ArrowRight } from "lucide-react";
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
  first_name: z.string().trim().min(1, "Le prénom est requis").max(100),
  last_name: z.string().trim().min(1, "Le nom est requis").max(100),
  email: z.string().trim().email("Merci de saisir une adresse email valide.").max(255),
  phone: z.string().trim().min(1, "Le téléphone est requis").max(40),
  level: z.enum(LEVELS, { message: "Sélectionnez votre niveau actuel." }),
  objective: z.enum(OBJECTIVES, { message: "Sélectionnez votre objectif principal." }),
  budget: z.enum(BUDGETS, { message: "Sélectionnez votre budget de départ approximatif." }),
  message: z.string().trim().max(2000).optional(),
  consent: z.literal(true, { errorMap: () => ({ message: "Merci d'accepter d'être recontacté par AMZing FBA." }) }),
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
  first_name: "", last_name: "", email: "", phone: "",
  level: "", objective: "", budget: "", message: "", consent: false,
};

export const LeadForm = ({
  id,
  compact = false,
  submitLabel = "Être recontacté par AMZing FBA",
}: {
  id: string;
  compact?: boolean;
  submitLabel?: string;
}) => {
  const navigate = useNavigate();
  const location = useLocation();
  const [loading, setLoading] = useState(false);
  const [values, setValues] = useState<LeadFormValues>(initialValues);
  const [errors, setErrors] = useState<Partial<Record<keyof LeadFormValues, string>>>({});

  const updateField = <K extends keyof LeadFormValues>(field: K, value: LeadFormValues[K]) => {
    setValues((c) => ({ ...c, [field]: value }));
    setErrors((c) => ({ ...c, [field]: undefined }));
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
      const fieldErrors: Partial<Record<keyof LeadFormValues, string>> = {};
      parsed.error.errors.forEach((iss) => {
        const f = iss.path[0];
        if (typeof f === "string" && !fieldErrors[f as keyof LeadFormValues]) {
          fieldErrors[f as keyof LeadFormValues] = iss.message;
        }
      });
      setErrors(fieldErrors);
      toast.error(parsed.error.errors[0]?.message ?? "Merci de vérifier les champs.");
      return;
    }
    setLoading(true);
    try {
      const { data, error } = await supabase.functions.invoke("submit-lead", {
        body: { ...parsed.data, source_page: location.pathname, source: "google_ads" },
      });
      if (error || !data?.ok) throw new Error(error?.message || "Erreur lors de l'envoi.");
      window.dataLayer = window.dataLayer || [];
      window.dataLayer.push({ event: "lead_submit_amzingfba", page: location.pathname });
      if (typeof window.gtag === "function") {
        window.gtag("event", "lead_submit_amzingfba", { page: location.pathname });
      }
      setValues(initialValues);
      navigate("/demande-recue");
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Une erreur est survenue.");
    } finally {
      setLoading(false);
    }
  };

  const gridGap = compact ? "gap-3" : "gap-4";

  return (
    <form id={id} onSubmit={submit} className={compact ? "space-y-3" : "space-y-4"} noValidate>
      <div className={cn("grid grid-cols-1 sm:grid-cols-2", gridGap)}>
        <div className="space-y-1.5">
          <Label htmlFor={`${id}-fn`}>Prénom</Label>
          <Input id={`${id}-fn`} autoComplete="given-name" maxLength={100}
            value={values.first_name} onChange={(e) => updateField("first_name", e.target.value)}
            className={errors.first_name ? "border-destructive" : ""} />
          {errors.first_name && <p className="text-sm text-destructive">{errors.first_name}</p>}
        </div>
        <div className="space-y-1.5">
          <Label htmlFor={`${id}-ln`}>Nom</Label>
          <Input id={`${id}-ln`} autoComplete="family-name" maxLength={100}
            value={values.last_name} onChange={(e) => updateField("last_name", e.target.value)}
            className={errors.last_name ? "border-destructive" : ""} />
          {errors.last_name && <p className="text-sm text-destructive">{errors.last_name}</p>}
        </div>
      </div>
      <div className={cn("grid grid-cols-1 sm:grid-cols-2", gridGap)}>
        <div className="space-y-1.5">
          <Label htmlFor={`${id}-em`}>Email</Label>
          <Input id={`${id}-em`} type="email" autoComplete="email" maxLength={255}
            value={values.email} onChange={(e) => updateField("email", e.target.value)}
            className={errors.email ? "border-destructive" : ""} />
          {errors.email && <p className="text-sm text-destructive">{errors.email}</p>}
        </div>
        <div className="space-y-1.5">
          <Label htmlFor={`${id}-ph`}>Téléphone</Label>
          <Input id={`${id}-ph`} type="tel" autoComplete="tel" maxLength={40}
            value={values.phone} onChange={(e) => updateField("phone", e.target.value)}
            className={errors.phone ? "border-destructive" : ""} />
          {errors.phone && <p className="text-sm text-destructive">{errors.phone}</p>}
        </div>
      </div>
      <div className={cn("grid grid-cols-1", gridGap)}>
        <div className="space-y-1.5">
          <Label>Niveau actuel</Label>
          <Select value={values.level} onValueChange={(v) => updateField("level", v)}>
            <SelectTrigger className={errors.level ? "border-destructive" : ""}>
              <SelectValue placeholder="Sélectionnez votre niveau" />
            </SelectTrigger>
            <SelectContent>
              {LEVELS.map((l) => <SelectItem key={l} value={l}>{l}</SelectItem>)}
            </SelectContent>
          </Select>
          {errors.level && <p className="text-sm text-destructive">{errors.level}</p>}
        </div>
        <div className="space-y-1.5">
          <Label>Objectif principal</Label>
          <Select value={values.objective} onValueChange={(v) => updateField("objective", v)}>
            <SelectTrigger className={errors.objective ? "border-destructive" : ""}>
              <SelectValue placeholder="Sélectionnez votre objectif" />
            </SelectTrigger>
            <SelectContent>
              {OBJECTIVES.map((o) => <SelectItem key={o} value={o}>{o}</SelectItem>)}
            </SelectContent>
          </Select>
          {errors.objective && <p className="text-sm text-destructive">{errors.objective}</p>}
        </div>
        <div className="space-y-1.5">
          <Label>Budget de départ approximatif</Label>
          <Select value={values.budget} onValueChange={(v) => updateField("budget", v)}>
            <SelectTrigger className={errors.budget ? "border-destructive" : ""}>
              <SelectValue placeholder="Sélectionnez votre budget" />
            </SelectTrigger>
            <SelectContent>
              {BUDGETS.map((b) => <SelectItem key={b} value={b}>{b}</SelectItem>)}
            </SelectContent>
          </Select>
          {errors.budget && <p className="text-sm text-destructive">{errors.budget}</p>}
        </div>
      </div>
      <div className="space-y-1.5">
        <Label htmlFor={`${id}-msg`}>Message</Label>
        <Textarea id={`${id}-msg`} rows={compact ? 3 : 4} maxLength={2000}
          value={values.message} onChange={(e) => updateField("message", e.target.value)}
          placeholder="Décrivez brièvement votre projet ou vos questions." />
      </div>
      <div className="space-y-2">
        <div className="flex items-start gap-3">
          <Checkbox id={`${id}-cs`} checked={values.consent}
            onCheckedChange={(c) => updateField("consent", c === true)}
            className={errors.consent ? "border-destructive" : ""} />
          <Label htmlFor={`${id}-cs`} className="cursor-pointer text-sm font-normal leading-relaxed text-muted-foreground">
            J'accepte d'être recontacté par AMZing FBA concernant ma demande.
          </Label>
        </div>
        {errors.consent && <p className="text-sm text-destructive">{errors.consent}</p>}
      </div>
      <Button type="submit" size="lg" disabled={loading} className="h-12 w-full text-base sm:h-14">
        {loading ? "Envoi en cours…" : submitLabel}
        {!loading && <ArrowRight className="ml-2 h-4 w-4" />}
      </Button>
      <p className="text-xs leading-relaxed text-muted-foreground">
        AMZing FBA propose un accompagnement pédagogique et opérationnel. Les résultats dépendent du profil, du budget, du marché, du travail fourni et de la stratégie appliquée. Aucun résultat financier n'est garanti.
      </p>
      <div className="flex flex-wrap gap-x-4 gap-y-2 text-xs text-muted-foreground">
        <Link to="/mentions-legales" className="hover:underline">Mentions légales</Link>
        <Link to="/cgv" className="hover:underline">CGV</Link>
        <Link to="/confidentialite" className="hover:underline">Politique de confidentialité</Link>
      </div>
    </form>
  );
};

export default LeadForm;
