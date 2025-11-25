import { Mail, MessageSquare, Phone, Send, CheckCircle, Sparkles, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { useState } from "react";
import { z } from "zod";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import SEO from "@/components/SEO";
import { useNavigate, Link } from "react-router-dom";
import { Capacitor } from "@capacitor/core";
import { seoData } from "@/lib/seo-data";

const contactSchema = z.object({
  name: z.string().trim().min(1, "Le nom est requis").max(100, "Le nom est trop long"),
  email: z.string().trim().email("Email invalide").max(255, "L'email est trop long"),
  phone: z.string().optional(),
  subject: z.string().trim().min(1, "Le sujet est requis").max(200, "Le sujet est trop long"),
  message: z.string().trim().min(10, "Le message doit contenir au moins 10 caractères").max(2000, "Le message est trop long"),
});

const Contact = () => {
  const { toast } = useToast();
  const navigate = useNavigate();
  const isNativeApp = Capacitor.isNativePlatform();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    subject: "",
    message: "",
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [touched, setTouched] = useState<Record<string, boolean>>({});

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrors({});
    setIsSubmitting(true);

    try {
      // Validate form data
      const validatedData = contactSchema.parse(formData);

      // Call edge function to send email
      const { error } = await supabase.functions.invoke("send-contact-email", {
        body: validatedData,
      });

      if (error) throw error;

      toast({
        title: "Message envoyé !",
        description: "Nous vous répondrons dans les 24 heures.",
      });

      // Reset form
      setFormData({
        name: "",
        email: "",
        phone: "",
        subject: "",
        message: "",
      });
      setTouched({});
    } catch (error: any) {
      if (error instanceof z.ZodError) {
        const fieldErrors: Record<string, string> = {};
        error.errors.forEach((err) => {
          if (err.path[0]) {
            fieldErrors[err.path[0] as string] = err.message;
          }
        });
        setErrors(fieldErrors);
        toast({
          title: "Erreur de validation",
          description: "Veuillez vérifier les champs du formulaire",
          variant: "destructive",
        });
      } else {
        toast({
          title: "Erreur",
          description: "Une erreur est survenue lors de l'envoi du message",
          variant: "destructive",
        });
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleBlur = (field: string) => {
    setTouched({ ...touched, [field]: true });
    try {
      contactSchema.parse(formData);
      setErrors((prev) => ({ ...prev, [field]: "" }));
    } catch (error: any) {
      if (error instanceof z.ZodError) {
        const fieldError = error.errors.find((err) => err.path[0] === field);
        if (fieldError) {
          setErrors((prev) => ({ ...prev, [field]: fieldError.message }));
        }
      }
    }
  };

  return (
    <div className="min-h-screen">
      <SEO
        title={seoData.contact.title}
        description={seoData.contact.description}
        keywords={seoData.contact.keywords}
      />
      <Navbar />
      
      {/* SEO H1/H2 - Invisible */}
      <h1 className="sr-only">
        Contactez l'équipe AMZing FBA
      </h1>
      <h2 className="sr-only">
        Support, questions et prise de contact pour les vendeurs Amazon FBA
      </h2>
      
      <Link
        to="/"
        className="fixed top-[140px] left-4 z-50 bg-primary text-white p-2 rounded-full shadow-lg hover:scale-110 transition-transform"
      >
        <ArrowLeft className="w-5 h-5" />
      </Link>
      
      {/* Back button for mobile app */}
      {isNativeApp && (
        <div className="fixed top-[46px] left-[18px] z-50 animate-slide-in-left">
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
      
      {/* Hero Section with animated background */}
      <section className="relative pt-32 pb-20 overflow-hidden">
        <div className="absolute inset-0 z-0">
          <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-background to-secondary/10" />
          <div className="absolute top-20 left-20 w-64 h-64 bg-primary/20 rounded-full blur-3xl animate-float" />
          <div className="absolute bottom-20 right-20 w-96 h-96 bg-secondary/20 rounded-full blur-3xl animate-float" style={{ animationDelay: "1s" }} />
        </div>
        
        <div className="container mx-auto px-4 relative z-10">
          {/* Hero */}
          <div className="text-center mb-16 animate-fade-in">
            <div className="flex items-center justify-center gap-2 mb-6">
              <Sparkles className="w-8 h-8 text-primary animate-pulse" />
              <h1 className="text-5xl md:text-6xl font-bold">
                Contactez-Nous
              </h1>
              <Sparkles className="w-8 h-8 text-secondary animate-pulse" style={{ animationDelay: "0.5s" }} />
            </div>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto animate-fade-in" style={{ animationDelay: "0.1s" }}>
              Une question ? Besoin d'aide ? Notre équipe est là pour vous répondre
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 max-w-6xl mx-auto lg:items-start">
            {/* Contact Form */}
            <Card className="border-2 border-primary/20 shadow-elegant backdrop-blur-sm animate-fade-in hover:shadow-glow transition-all duration-300 h-full" style={{ animationDelay: "0.2s" }}>
              <CardHeader>
                <CardTitle className="text-2xl flex items-center gap-2">
                  <MessageSquare className="w-6 h-6 text-primary" />
                  Envoyez-nous un message
                </CardTitle>
                <CardDescription>
                  Nous vous répondrons dans les 24 heures
                </CardDescription>
              </CardHeader>
              <CardContent>
                <form className="space-y-6" onSubmit={handleSubmit}>
                  <div className="space-y-2">
                    <Label htmlFor="name" className="flex items-center gap-2">
                      Nom complet
                      {touched.name && !errors.name && formData.name && (
                        <CheckCircle className="w-4 h-4 text-green-500 animate-scale-in" />
                      )}
                    </Label>
                    <div className="relative group">
                      <Input 
                        id="name" 
                        placeholder="Jean Dupont" 
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        onBlur={() => handleBlur("name")}
                        className={`transition-all duration-300 hover:border-primary/50 hover:shadow-sm ${
                          errors.name && touched.name 
                            ? "border-destructive focus:ring-destructive" 
                            : touched.name && formData.name 
                            ? "border-green-500 focus:ring-green-500" 
                            : ""
                        } focus:scale-102 focus:border-primary`}
                      />
                    </div>
                    {errors.name && touched.name && (
                      <p className="text-sm text-destructive animate-fade-in">{errors.name}</p>
                    )}
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="email" className="flex items-center gap-2">
                      Email
                      {touched.email && !errors.email && formData.email && (
                        <CheckCircle className="w-4 h-4 text-green-500 animate-scale-in" />
                      )}
                    </Label>
                    <div className="relative group">
                      <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground group-hover:text-primary group-focus-within:text-primary transition-colors" />
                      <Input 
                        id="email" 
                        type="email" 
                        placeholder="jean@example.com" 
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        onBlur={() => handleBlur("email")}
                        className={`pl-10 transition-all duration-300 hover:border-primary/50 hover:shadow-sm ${
                          errors.email && touched.email 
                            ? "border-destructive focus:ring-destructive" 
                            : touched.email && formData.email 
                            ? "border-green-500 focus:ring-green-500" 
                            : ""
                        } focus:scale-102 focus:border-primary`}
                      />
                    </div>
                    {errors.email && touched.email && (
                      <p className="text-sm text-destructive animate-fade-in">{errors.email}</p>
                    )}
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="phone">Téléphone (optionnel)</Label>
                    <div className="relative group">
                      <Phone className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground group-hover:text-primary group-focus-within:text-primary transition-colors" />
                      <Input 
                        id="phone" 
                        type="tel" 
                        placeholder="+33 6 12 34 56 78" 
                        value={formData.phone}
                        onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                        className="pl-10 transition-all duration-300 hover:border-primary/50 hover:shadow-sm focus:scale-102 focus:border-primary"
                      />
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="subject" className="flex items-center gap-2">
                      Sujet
                      {touched.subject && !errors.subject && formData.subject && (
                        <CheckCircle className="w-4 h-4 text-green-500 animate-scale-in" />
                      )}
                    </Label>
                    <Input 
                      id="subject" 
                      placeholder="Votre sujet" 
                      value={formData.subject}
                      onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                      onBlur={() => handleBlur("subject")}
                      className={`transition-all duration-300 hover:border-primary/50 hover:shadow-sm ${
                        errors.subject && touched.subject 
                          ? "border-destructive focus:ring-destructive" 
                          : touched.subject && formData.subject 
                          ? "border-green-500 focus:ring-green-500" 
                          : ""
                      } focus:scale-102 focus:border-primary`}
                    />
                    {errors.subject && touched.subject && (
                      <p className="text-sm text-destructive animate-fade-in">{errors.subject}</p>
                    )}
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="message" className="flex items-center gap-2">
                      Message
                      {touched.message && !errors.message && formData.message && (
                        <CheckCircle className="w-4 h-4 text-green-500 animate-scale-in" />
                      )}
                    </Label>
                    <Textarea 
                      id="message" 
                      placeholder="Décrivez votre besoin ou votre question..." 
                      rows={6}
                      value={formData.message}
                      onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                      onBlur={() => handleBlur("message")}
                      className={`transition-all duration-300 resize-none hover:border-primary/50 hover:shadow-sm ${
                        errors.message && touched.message 
                          ? "border-destructive focus:ring-destructive" 
                          : touched.message && formData.message 
                          ? "border-green-500 focus:ring-green-500" 
                          : ""
                      } focus:scale-102 focus:border-primary`}
                    />
                    {errors.message && touched.message && (
                      <p className="text-sm text-destructive animate-fade-in">{errors.message}</p>
                    )}
                  </div>
                  
                  <Button 
                    size="lg" 
                    variant="hero"
                    className="w-full hover:scale-105 group" 
                    type="submit"
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? (
                      <>
                        <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                        Envoi en cours...
                      </>
                    ) : (
                      <>
                        Envoyer le message
                        <Send className="ml-2 w-4 h-4 group-hover:translate-x-1 transition-transform" />
                      </>
                    )}
                  </Button>
                </form>
              </CardContent>
            </Card>

            {/* Contact Info */}
            <div className="space-y-6 flex flex-col h-full">
              <Card className="border-2 border-primary/20 hover:border-primary hover:shadow-glow transition-all duration-300 hover:scale-105 cursor-pointer animate-fade-in group flex-1" style={{ animationDelay: "0.3s" }}>
                <CardContent className="pt-6">
                  <div className="flex items-start gap-4">
                    <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-primary to-primary-glow flex items-center justify-center flex-shrink-0 group-hover:rotate-6 transition-transform duration-300 animate-float">
                      <Mail className="w-7 h-7 text-white" />
                    </div>
                    <div className="flex-1">
                      <h3 className="font-bold text-xl mb-2">Email</h3>
                      <p className="text-muted-foreground mb-3 text-sm">
                        Réponse sous 24h
                      </p>
                      <a 
                        href="mailto:contact@amzingfba.com" 
                        className="text-primary hover:underline font-semibold text-lg hover:text-primary-glow transition-colors block mb-4"
                      >
                        contact@amzingfba.com
                      </a>
                      <div className="space-y-2 text-sm text-muted-foreground">
                        <p className="flex items-center gap-2">
                          <CheckCircle className="w-4 h-4 text-green-500" />
                          Informations générales
                        </p>
                        <p className="flex items-center gap-2">
                          <CheckCircle className="w-4 h-4 text-green-500" />
                          Questions pré-vente
                        </p>
                        <p className="flex items-center gap-2">
                          <CheckCircle className="w-4 h-4 text-green-500" />
                          Demande de renseignements
                        </p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="border-2 border-secondary/20 hover:border-secondary hover:shadow-blue transition-all duration-300 hover:scale-105 cursor-pointer animate-fade-in group flex-1" style={{ animationDelay: "0.4s" }}>
                <CardContent className="pt-6">
                  <div className="flex items-start gap-4">
                    <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-primary to-secondary flex items-center justify-center flex-shrink-0 group-hover:rotate-6 transition-transform duration-300 animate-float" style={{ animationDelay: "0.5s" }}>
                      <Phone className="w-7 h-7 text-white" />
                    </div>
                    <div className="flex-1">
                      <h3 className="font-bold text-xl mb-2">Téléphone</h3>
                      <p className="text-muted-foreground mb-3 text-sm">
                        Du lundi au vendredi, 9h-18h
                      </p>
                      <a 
                        href="tel:+33780930274" 
                        className="text-secondary hover:underline font-semibold text-lg hover:text-secondary/80 transition-colors block mb-4"
                      >
                        07 80 93 02 74
                      </a>
                      <div className="space-y-2 text-sm text-muted-foreground">
                        <p className="flex items-center gap-2">
                          <CheckCircle className="w-4 h-4 text-green-500" />
                          Découvrir nos services
                        </p>
                        <p className="flex items-center gap-2">
                          <CheckCircle className="w-4 h-4 text-green-500" />
                          Réponses à vos questions
                        </p>
                        <p className="flex items-center gap-2">
                          <CheckCircle className="w-4 h-4 text-green-500" />
                          Accompagnement personnalisé
                        </p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* FAQ Card */}
              <Card className="border-2 border-primary/20 bg-gradient-to-br from-primary/5 via-secondary/5 to-primary/5 hover:shadow-glow transition-all duration-300 hover:scale-105 animate-fade-in flex-1 flex flex-col" style={{ animationDelay: "0.5s" }}>
                <CardContent className="p-6 text-center flex-1 flex flex-col justify-center">
                  <Sparkles className="w-8 h-8 text-primary mx-auto mb-3 animate-pulse" />
                  <h3 className="text-xl font-bold mb-2">Consultez notre FAQ</h3>
                  <p className="text-sm text-muted-foreground mb-4">
                    Trouvez rapidement les réponses à vos questions
                  </p>
                  <a href="/faq">
                    <Button variant="outline" className="hover:bg-primary hover:text-primary-foreground transition-all">
                      Voir la FAQ
                    </Button>
                  </a>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Contact;
