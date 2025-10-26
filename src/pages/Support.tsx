import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/hooks/use-auth';
import { supabase } from '@/integrations/supabase/client';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Loader2, Plus, MessageSquare } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const Support = () => {
  const { user, isVIP } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [tickets, setTickets] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isCreating, setIsCreating] = useState(false);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [newTicket, setNewTicket] = useState({
    subject: '',
    priority: 'normal',
    initialMessage: ''
  });

  useEffect(() => {
    if (!user || !isVIP) {
      navigate('/');
      return;
    }

    loadTickets();
  }, [user, isVIP, navigate]);

  const loadTickets = async () => {
    try {
      const { data, error } = await supabase
        .from('tickets')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setTickets(data || []);
    } catch (error) {
      console.error('Error loading tickets:', error);
      toast({
        title: "Erreur",
        description: "Impossible de charger vos tickets",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const createTicket = async () => {
    if (!newTicket.subject.trim() || !newTicket.initialMessage.trim()) {
      toast({
        title: "Erreur",
        description: "Veuillez remplir tous les champs",
        variant: "destructive",
      });
      return;
    }

    setIsCreating(true);
    try {
      const { data: ticket, error: ticketError } = await supabase
        .from('tickets')
        .insert({
          user_id: user!.id,
          subject: newTicket.subject,
          priority: newTicket.priority,
          status: 'open'
        })
        .select()
        .single();

      if (ticketError) throw ticketError;

      const { error: messageError } = await supabase
        .from('messages')
        .insert({
          ticket_id: ticket.id,
          user_id: user!.id,
          content: newTicket.initialMessage
        });

      if (messageError) throw messageError;

      toast({
        title: "Ticket créé",
        description: "Votre demande a été envoyée. Un admin vous répondra bientôt.",
      });

      setDialogOpen(false);
      setNewTicket({ subject: '', priority: 'normal', initialMessage: '' });
      loadTickets();
      navigate(`/ticket/${ticket.id}`);
    } catch (error) {
      console.error('Error creating ticket:', error);
      toast({
        title: "Erreur",
        description: "Impossible de créer le ticket",
        variant: "destructive",
      });
    } finally {
      setIsCreating(false);
    }
  };

  const getStatusBadge = (status: string) => {
    const variants: Record<string, any> = {
      open: 'default',
      in_progress: 'secondary',
      closed: 'outline'
    };
    return <Badge variant={variants[status] || 'default'}>{status}</Badge>;
  };

  const getPriorityBadge = (priority: string) => {
    const colors: Record<string, string> = {
      low: 'bg-blue-500',
      normal: 'bg-green-500',
      high: 'bg-orange-500',
      urgent: 'bg-red-500'
    };
    return (
      <Badge className={colors[priority] || 'bg-gray-500'}>
        {priority}
      </Badge>
    );
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-grow pt-20">
        <div className="container mx-auto px-4 py-8 max-w-4xl">
          <div className="flex justify-between items-center mb-8">
            <div>
              <h1 className="text-4xl font-bold mb-2">Support</h1>
              <p className="text-muted-foreground">
                Contactez notre équipe pour obtenir de l'aide
              </p>
            </div>
            <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
              <DialogTrigger asChild>
                <Button>
                  <Plus className="w-4 h-4 mr-2" />
                  Nouveau ticket
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Créer un ticket de support</DialogTitle>
                  <DialogDescription>
                    Décrivez votre demande et notre équipe vous répondra rapidement
                  </DialogDescription>
                </DialogHeader>
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="subject">Sujet</Label>
                    <Input
                      id="subject"
                      value={newTicket.subject}
                      onChange={(e) => setNewTicket({ ...newTicket, subject: e.target.value })}
                      placeholder="Résumé de votre demande"
                    />
                  </div>
                  <div>
                    <Label htmlFor="priority">Priorité</Label>
                    <Select
                      value={newTicket.priority}
                      onValueChange={(value) => setNewTicket({ ...newTicket, priority: value })}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="low">Basse</SelectItem>
                        <SelectItem value="normal">Normale</SelectItem>
                        <SelectItem value="high">Haute</SelectItem>
                        <SelectItem value="urgent">Urgente</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label htmlFor="message">Message</Label>
                    <Textarea
                      id="message"
                      value={newTicket.initialMessage}
                      onChange={(e) => setNewTicket({ ...newTicket, initialMessage: e.target.value })}
                      placeholder="Décrivez votre demande en détail..."
                      rows={5}
                    />
                  </div>
                  <Button
                    onClick={createTicket}
                    disabled={isCreating}
                    className="w-full"
                  >
                    {isCreating && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
                    Créer le ticket
                  </Button>
                </div>
              </DialogContent>
            </Dialog>
          </div>

          {tickets.length === 0 ? (
            <Card>
              <CardContent className="pt-6 text-center">
                <MessageSquare className="w-12 h-12 mx-auto mb-4 text-muted-foreground" />
                <p className="text-muted-foreground mb-4">
                  Vous n'avez pas encore de ticket de support
                </p>
                <Button onClick={() => setDialogOpen(true)}>
                  Créer votre premier ticket
                </Button>
              </CardContent>
            </Card>
          ) : (
            <div className="space-y-4">
              {tickets.map((ticket) => (
                <Card
                  key={ticket.id}
                  className="hover:shadow-lg transition-shadow cursor-pointer"
                  onClick={() => navigate(`/ticket/${ticket.id}`)}
                >
                  <CardHeader>
                    <div className="flex justify-between items-start">
                      <CardTitle className="text-lg">{ticket.subject}</CardTitle>
                      <div className="flex gap-2">
                        {getPriorityBadge(ticket.priority)}
                        {getStatusBadge(ticket.status)}
                      </div>
                    </div>
                    <CardDescription>
                      Créé le {new Date(ticket.created_at).toLocaleDateString('fr-FR', {
                        day: 'numeric',
                        month: 'long',
                        year: 'numeric'
                      })}
                    </CardDescription>
                  </CardHeader>
                </Card>
              ))}
            </div>
          )}
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Support;
