import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/hooks/use-auth';
import { supabase } from '@/integrations/supabase/client';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Calendar } from '@/components/ui/calendar';
import { Badge } from '@/components/ui/badge';
import { ArrowLeft, CalendarDays, Clock, GraduationCap, Loader2, CheckCircle2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';

const TIME_SLOTS = [
  '09:00', '09:30', '10:00', '10:30', '11:00', '11:30',
  '14:00', '14:30', '15:00', '15:30', '16:00', '16:30',
  '17:00', '17:30', '18:00', '18:30', '19:00', '19:30',
];

const TOPICS = [
  { value: 'sourcing', label: '🔍 Sourcing produits' },
  { value: 'listing', label: '📝 Création de listing' },
  { value: 'ppc', label: '📊 Publicité Amazon (PPC)' },
  { value: 'compte', label: '👤 Gestion du compte Seller Central' },
  { value: 'logistique', label: '📦 Logistique & FBA' },
  { value: 'rentabilite', label: '💰 Calcul de rentabilité' },
  { value: 'lancement', label: '🚀 Lancement de produit' },
  { value: 'autre', label: '💬 Autre sujet' },
];

const CoursParticulier = () => {
  const { user, isVIP } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [selectedDate, setSelectedDate] = useState<Date | undefined>();
  const [selectedTime, setSelectedTime] = useState<string | null>(null);
  const [selectedTopic, setSelectedTopic] = useState<string | null>(null);
  const [description, setDescription] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const handleSubmit = async () => {
    if (!selectedDate || !selectedTime || !selectedTopic) {
      toast({
        title: "Champs manquants",
        description: "Veuillez sélectionner une date, un créneau horaire et un sujet.",
        variant: "destructive",
      });
      return;
    }

    setIsSubmitting(true);
    try {
      const topicLabel = TOPICS.find(t => t.value === selectedTopic)?.label || selectedTopic;
      const dateFormatted = format(selectedDate, "EEEE d MMMM yyyy", { locale: fr });

      const subject = `📅 Cours particulier — ${dateFormatted} à ${selectedTime}`;
      const message = `**Demande de cours particulier**\n\n` +
        `📅 **Date souhaitée :** ${dateFormatted}\n` +
        `🕐 **Créneau :** ${selectedTime}\n` +
        `📚 **Sujet :** ${topicLabel}\n\n` +
        `${description ? `💬 **Détails :**\n${description}` : ''}` +
        `\n\n---\n_En attente de confirmation de l'admin._`;

      // Create ticket
      const { data: ticket, error: ticketError } = await supabase
        .from('tickets')
        .insert({
          user_id: user!.id,
          subject,
          priority: 'normal',
          category: 'cours_particulier',
          status: 'open'
        })
        .select()
        .single();

      if (ticketError) throw ticketError;

      // Add initial message
      const { error: messageError } = await supabase
        .from('messages')
        .insert({
          ticket_id: ticket.id,
          user_id: user!.id,
          content: message,
        });

      if (messageError) throw messageError;

      setIsSuccess(true);
      toast({
        title: "Demande envoyée ✅",
        description: "Votre demande de cours particulier a été envoyée. Nous vous répondrons rapidement.",
      });

      // Redirect to ticket after delay
      setTimeout(() => navigate(`/ticket/${ticket.id}`), 2000);
    } catch (error) {
      console.error('Error creating booking:', error);
      toast({
        title: "Erreur",
        description: "Impossible d'envoyer la demande. Réessayez.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!user || !isVIP) {
    return (
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <main className="flex-grow pt-24 flex items-center justify-center">
          <Card className="max-w-md mx-4">
            <CardContent className="pt-6 text-center">
              <GraduationCap className="w-12 h-12 mx-auto mb-4 text-muted-foreground" />
              <p className="text-muted-foreground mb-4">
                Les cours particuliers sont réservés aux membres VIP.
              </p>
              <Button onClick={() => navigate('/tarifs')}>Devenir VIP</Button>
            </CardContent>
          </Card>
        </main>
        <Footer />
      </div>
    );
  }

  if (isSuccess) {
    return (
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <main className="flex-grow pt-24 flex items-center justify-center">
          <Card className="max-w-md mx-4">
            <CardContent className="pt-8 pb-8 text-center space-y-4">
              <CheckCircle2 className="w-16 h-16 mx-auto text-green-500" />
              <h2 className="text-xl font-bold">Demande envoyée !</h2>
              <p className="text-muted-foreground">
                Votre demande de cours particulier a bien été reçue. Vous allez être redirigé vers votre ticket.
              </p>
              <Loader2 className="w-5 h-5 animate-spin mx-auto text-primary" />
            </CardContent>
          </Card>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-grow pt-24 md:pt-20">
        <div className="container mx-auto px-4 py-8 max-w-3xl">
          {/* Header */}
          <div className="flex items-center gap-3 mb-8">
            <button
              onClick={() => navigate('/support')}
              className="bg-[#FF9900] hover:bg-[#FF9900]/90 p-3 md:p-2 rounded-full shadow-lg transition-all shrink-0"
              aria-label="Retour"
            >
              <ArrowLeft className="w-6 h-6 md:w-5 md:h-5 text-white" />
            </button>
            <div>
              <h1 className="text-2xl md:text-3xl font-bold flex items-center gap-2">
                <GraduationCap className="w-7 h-7 text-primary" />
                Cours Particulier
              </h1>
              <p className="text-sm text-muted-foreground">
                Réservez un créneau pour un accompagnement individuel
              </p>
            </div>
          </div>

          <div className="grid gap-6">
            {/* Step 1: Date */}
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-lg flex items-center gap-2">
                  <CalendarDays className="w-5 h-5 text-primary" />
                  <span>1. Choisissez une date</span>
                </CardTitle>
                <CardDescription>Sélectionnez le jour souhaité</CardDescription>
              </CardHeader>
              <CardContent className="flex justify-center">
                <Calendar
                  mode="single"
                  selected={selectedDate}
                  onSelect={setSelectedDate}
                  disabled={(date) => {
                    const today = new Date();
                    today.setHours(0, 0, 0, 0);
                    // Disable past dates and Sundays
                    return date < today || date.getDay() === 0;
                  }}
                  locale={fr}
                  className="pointer-events-auto"
                />
              </CardContent>
              {selectedDate && (
                <div className="px-6 pb-4 text-center">
                  <Badge variant="secondary" className="text-sm">
                    📅 {format(selectedDate, "EEEE d MMMM yyyy", { locale: fr })}
                  </Badge>
                </div>
              )}
            </Card>

            {/* Step 2: Time */}
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-lg flex items-center gap-2">
                  <Clock className="w-5 h-5 text-primary" />
                  <span>2. Choisissez un créneau</span>
                </CardTitle>
                <CardDescription>Sélectionnez l'heure souhaitée (heure de Paris)</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 gap-2">
                  {TIME_SLOTS.map((time) => (
                    <Button
                      key={time}
                      variant={selectedTime === time ? 'default' : 'outline'}
                      size="sm"
                      onClick={() => setSelectedTime(time)}
                      className="text-sm"
                    >
                      {time}
                    </Button>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Step 3: Topic */}
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-lg flex items-center gap-2">
                  <GraduationCap className="w-5 h-5 text-primary" />
                  <span>3. Sujet du cours</span>
                </CardTitle>
                <CardDescription>Sur quoi souhaitez-vous travailler ?</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 mb-4">
                  {TOPICS.map((topic) => (
                    <Button
                      key={topic.value}
                      variant={selectedTopic === topic.value ? 'default' : 'outline'}
                      className="justify-start text-left h-auto py-3 px-4"
                      onClick={() => setSelectedTopic(topic.value)}
                    >
                      {topic.label}
                    </Button>
                  ))}
                </div>
                <div className="space-y-2">
                  <Label htmlFor="details">Détails supplémentaires (optionnel)</Label>
                  <Textarea
                    id="details"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    placeholder="Décrivez votre besoin, vos questions spécifiques..."
                    rows={3}
                  />
                </div>
              </CardContent>
            </Card>

            {/* Summary & Submit */}
            <Card className="border-primary/30 bg-primary/5">
              <CardContent className="pt-6">
                <div className="space-y-3 mb-6">
                  <h3 className="font-semibold text-lg">Récapitulatif</h3>
                  <div className="grid gap-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Date :</span>
                      <span className="font-medium">
                        {selectedDate
                          ? format(selectedDate, "EEEE d MMMM yyyy", { locale: fr })
                          : '—'}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Créneau :</span>
                      <span className="font-medium">{selectedTime || '—'}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Sujet :</span>
                      <span className="font-medium">
                        {TOPICS.find(t => t.value === selectedTopic)?.label || '—'}
                      </span>
                    </div>
                  </div>
                </div>

                <Button
                  onClick={handleSubmit}
                  disabled={isSubmitting || !selectedDate || !selectedTime || !selectedTopic}
                  className="w-full h-12 text-base"
                  size="lg"
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                      Envoi en cours...
                    </>
                  ) : (
                    <>
                      <CalendarDays className="w-5 h-5 mr-2" />
                      Demander ce créneau
                    </>
                  )}
                </Button>
                <p className="text-xs text-muted-foreground text-center mt-3">
                  Un ticket sera créé pour confirmer votre créneau avec l'admin.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default CoursParticulier;
