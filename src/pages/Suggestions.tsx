import { useState, useEffect } from 'react';
import { useAuth } from '@/hooks/use-auth';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { Lightbulb, Plus, MessageCircle, Clock, CheckCircle, Loader2, ArrowLeft } from 'lucide-react';
import { Capacitor } from '@capacitor/core';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { ScrollArea } from '@/components/ui/scroll-area';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { formatDistanceToNow } from 'date-fns';
import { fr } from 'date-fns/locale';

interface Suggestion {
  id: string;
  subject: string;
  status: string;
  created_at: string;
  updated_at: string;
}

interface Message {
  id: string;
  content: string | null;
  user_id: string;
  created_at: string;
  file_url: string | null;
  file_name: string | null;
}

const Suggestions = () => {
  const { user, isVIP } = useAuth();
  const navigate = useNavigate();
  const [suggestions, setSuggestions] = useState<Suggestion[]>([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [createDialogOpen, setCreateDialogOpen] = useState(false);
  const [selectedSuggestion, setSelectedSuggestion] = useState<Suggestion | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [loadingMessages, setLoadingMessages] = useState(false);
  const [newMessage, setNewMessage] = useState('');
  const [newSubject, setNewSubject] = useState('');
  const [newContent, setNewContent] = useState('');
  const isNativeApp = Capacitor.isNativePlatform();

  useEffect(() => {
    if (!user) {
      navigate('/auth');
      return;
    }

    if (!isVIP) {
      toast.error('Accès réservé aux membres VIP');
      navigate('/');
      return;
    }

    fetchSuggestions();
  }, [user, isVIP, navigate]);

  const fetchSuggestions = async () => {
    try {
      const { data, error } = await supabase
        .from('tickets')
        .select('id, subject, status, created_at, updated_at')
        .eq('category', 'suggestion')
        .eq('user_id', user?.id)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setSuggestions(data || []);
    } catch (error: any) {
      console.error('Error fetching suggestions:', error);
      toast.error('Erreur lors du chargement');
    } finally {
      setLoading(false);
    }
  };

  const createSuggestion = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newSubject.trim() || !newContent.trim()) {
      toast.error('Veuillez remplir tous les champs');
      return;
    }

    setSubmitting(true);
    try {
      // Create ticket
      const { data: ticket, error: ticketError } = await supabase
        .from('tickets')
        .insert({
          user_id: user?.id,
          subject: newSubject,
          category: 'suggestion',
          status: 'open',
          priority: 'normal'
        })
        .select()
        .single();

      if (ticketError) throw ticketError;

      // Create first message
      const { error: messageError } = await supabase
        .from('messages')
        .insert({
          ticket_id: ticket.id,
          user_id: user?.id,
          content: newContent
        });

      if (messageError) throw messageError;

      toast.success('Suggestion envoyée avec succès !');
      setNewSubject('');
      setNewContent('');
      setCreateDialogOpen(false);
      fetchSuggestions();
    } catch (error: any) {
      console.error('Error creating suggestion:', error);
      toast.error('Erreur lors de l\'envoi');
    } finally {
      setSubmitting(false);
    }
  };

  const openSuggestion = async (suggestion: Suggestion) => {
    setSelectedSuggestion(suggestion);
    setLoadingMessages(true);

    try {
      const { data, error } = await supabase
        .from('messages')
        .select('*')
        .eq('ticket_id', suggestion.id)
        .order('created_at', { ascending: true });

      if (error) throw error;
      setMessages(data || []);
    } catch (error: any) {
      console.error('Error fetching messages:', error);
      toast.error('Erreur lors du chargement des messages');
    } finally {
      setLoadingMessages(false);
    }
  };

  const sendMessage = async () => {
    if (!newMessage.trim() || !selectedSuggestion) return;

    try {
      const { error } = await supabase
        .from('messages')
        .insert({
          ticket_id: selectedSuggestion.id,
          user_id: user?.id,
          content: newMessage
        });

      if (error) throw error;

      setNewMessage('');
      openSuggestion(selectedSuggestion);
      toast.success('Message envoyé');
    } catch (error: any) {
      console.error('Error sending message:', error);
      toast.error('Erreur lors de l\'envoi');
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'open':
        return <Badge variant="outline" className="bg-blue-500/10 text-blue-500 border-blue-500/20">En attente</Badge>;
      case 'in_progress':
        return <Badge variant="outline" className="bg-yellow-500/10 text-yellow-500 border-yellow-500/20">En cours</Badge>;
      case 'closed':
        return <Badge variant="outline" className="bg-green-500/10 text-green-500 border-green-500/20">Traité</Badge>;
      default:
        return <Badge>{status}</Badge>;
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-grow pt-24 md:pt-20">
        <div className="container mx-auto px-4 py-8 max-w-5xl">
          <div className="mb-8">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
              <div className="flex items-start gap-3">
                <button
                  onClick={() => navigate('/dashboard')}
                  className="bg-[#FF9900] hover:bg-[#FF9900]/90 p-3 md:p-2 rounded-full shadow-lg transition-all shrink-0 mt-1"
                  aria-label="Retour au dashboard"
                >
                  <ArrowLeft className="w-6 h-6 md:w-5 md:h-5 text-white" />
                </button>
                <div className="flex items-center gap-3">
                  <div className="bg-primary/10 p-3 rounded-lg">
                    <Lightbulb className="h-6 w-6 md:h-8 md:w-8 text-primary" />
                  </div>
                  <div>
                    <h1 className="text-2xl md:text-3xl font-bold">Mes Suggestions</h1>
                    <p className="text-sm md:text-base text-muted-foreground">Partagez vos idées avec notre équipe</p>
                  </div>
                </div>
              </div>
              <Dialog open={createDialogOpen} onOpenChange={setCreateDialogOpen}>
                <DialogTrigger asChild>
                  <Button size="lg" className="gap-2 w-full md:w-auto">
                    <Plus className="h-5 w-5" />
                    Nouvelle suggestion
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-w-2xl">
                  <DialogHeader>
                    <DialogTitle className="flex items-center gap-2">
                      <Lightbulb className="h-5 w-5 text-primary" />
                      Partager une suggestion
                    </DialogTitle>
                  </DialogHeader>
                  <form onSubmit={createSuggestion} className="space-y-4">
                    <div>
                      <label className="text-sm font-medium mb-2 block">
                        Titre de votre suggestion
                      </label>
                      <Input
                        placeholder="Ex: Ajouter un filtre par catégorie dans le catalogue"
                        value={newSubject}
                        onChange={(e) => setNewSubject(e.target.value)}
                        required
                      />
                    </div>
                    <div>
                      <label className="text-sm font-medium mb-2 block">
                        Décrivez votre idée
                      </label>
                      <Textarea
                        placeholder="Expliquez votre suggestion en détail : à quoi ça servirait, comment ça pourrait être implémenté, etc."
                        value={newContent}
                        onChange={(e) => setNewContent(e.target.value)}
                        rows={6}
                        required
                      />
                    </div>
                    <div className="bg-primary/5 border border-primary/10 rounded-lg p-4">
                      <p className="text-sm text-muted-foreground">
                        💡 <strong>Conseil :</strong> Plus votre suggestion est détaillée, plus nous pourrons l'étudier efficacement !
                      </p>
                    </div>
                    <div className="flex gap-3 justify-end">
                      <Button
                        type="button"
                        variant="outline"
                        onClick={() => setCreateDialogOpen(false)}
                      >
                        Annuler
                      </Button>
                      <Button type="submit" variant="hero" disabled={submitting}>
                        {submitting ? (
                          <>
                            <Loader2 className="h-4 w-4 animate-spin mr-2" />
                            Envoi...
                          </>
                        ) : (
                          'Envoyer la suggestion'
                        )}
                      </Button>
                    </div>
                  </form>
                </DialogContent>
              </Dialog>
            </div>

            {suggestions.length === 0 ? (
              <Card className="border-dashed">
                <CardContent className="flex flex-col items-center justify-center py-12">
                  <Lightbulb className="h-16 w-16 text-muted-foreground mb-4" />
                  <h3 className="text-xl font-semibold mb-2">Aucune suggestion pour le moment</h3>
                  <p className="text-muted-foreground mb-4">
                    Vous avez une idée pour améliorer la plateforme ?
                  </p>
                  <Button onClick={() => setCreateDialogOpen(true)} className="gap-2">
                    <Plus className="h-4 w-4" />
                    Créer une suggestion
                  </Button>
                </CardContent>
              </Card>
            ) : (
              <div className="grid gap-4">
                {suggestions.map((suggestion) => (
                  <Card
                    key={suggestion.id}
                    className="hover:shadow-md transition-shadow cursor-pointer"
                    onClick={() => openSuggestion(suggestion)}
                  >
                    <CardHeader className="pb-3">
                      <div className="flex items-start justify-between gap-4">
                        <div className="flex-1">
                          <CardTitle className="text-lg mb-2">{suggestion.subject}</CardTitle>
                          <div className="flex items-center gap-3 text-sm text-muted-foreground">
                            <div className="flex items-center gap-1">
                              <Clock className="h-4 w-4" />
                              {formatDistanceToNow(new Date(suggestion.created_at), {
                                addSuffix: true,
                                locale: fr
                              })}
                            </div>
                          </div>
                        </div>
                        {getStatusBadge(suggestion.status)}
                      </div>
                    </CardHeader>
                  </Card>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Dialog pour voir les messages */}
        <Dialog open={!!selectedSuggestion} onOpenChange={() => setSelectedSuggestion(null)}>
          <DialogContent className="max-w-3xl max-h-[80vh]">
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2">
                <MessageCircle className="h-5 w-5 text-primary" />
                {selectedSuggestion?.subject}
              </DialogTitle>
            </DialogHeader>

            {loadingMessages ? (
              <div className="flex items-center justify-center py-8">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
              </div>
            ) : (
              <>
                <ScrollArea className="h-[400px] pr-4">
                  <div className="space-y-4">
                    {messages.map((message) => {
                      const isOwn = message.user_id === user?.id;
                      return (
                        <div
                          key={message.id}
                          className={`flex ${isOwn ? 'justify-end' : 'justify-start'}`}
                        >
                          <div
                            className={`max-w-[80%] rounded-lg p-4 ${
                              isOwn
                                ? 'bg-primary text-primary-foreground'
                                : 'bg-muted'
                            }`}
                          >
                            <div className="text-xs font-semibold mb-2">
                              {isOwn ? 'Vous' : '👨‍💼 Équipe AMZing FBA'}
                            </div>
                            <p className="whitespace-pre-wrap">{message.content}</p>
                            {message.file_url && (
                              <a
                                href={message.file_url}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-xs underline mt-2 block"
                              >
                                📎 {message.file_name}
                              </a>
                            )}
                            <div className="text-xs opacity-70 mt-2">
                              {formatDistanceToNow(new Date(message.created_at), {
                                addSuffix: true,
                                locale: fr
                              })}
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </ScrollArea>

                {selectedSuggestion?.status !== 'closed' && (
                  <div className="flex gap-2 pt-4 border-t">
                    <Textarea
                      placeholder="Ajouter un commentaire..."
                      value={newMessage}
                      onChange={(e) => setNewMessage(e.target.value)}
                      rows={2}
                    />
                    <Button onClick={sendMessage} disabled={!newMessage.trim()}>
                      Envoyer
                    </Button>
                  </div>
                )}
              </>
            )}
          </DialogContent>
        </Dialog>
      </main>
      <Footer />
    </div>
  );
};

export default Suggestions;
