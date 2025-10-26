import { useEffect, useState } from 'react';
import { useParams, Navigate } from 'react-router-dom';
import { useAuth } from '@/hooks/use-auth';
import { supabase } from '@/integrations/supabase/client';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import CategoryAlerts from '@/components/CategoryAlerts';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import { Loader2, Send } from 'lucide-react';

interface Message {
  id: string;
  content: string;
  user_id: string;
  created_at: string;
  is_admin?: boolean;
}

const CategoryTicket = () => {
  const { category, subcategory } = useParams<{ category: string; subcategory: string }>();
  const { user, isVIP, isLoading: authLoading } = useAuth();
  const { toast } = useToast();
  const [ticket, setTicket] = useState<any>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [isSending, setIsSending] = useState(false);

  useEffect(() => {
    if (user && category && subcategory) {
      loadOrCreateTicket();
    }
  }, [user, category, subcategory]);

  useEffect(() => {
    if (!ticket) return;

    // Mark messages as read when viewing
    markMessagesAsRead();

    // Real-time subscription
    const messagesChannel = supabase
      .channel(`messages-${ticket.id}`)
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'messages',
          filter: `ticket_id=eq.${ticket.id}`
        },
        (payload) => {
          setMessages((prev) => [...prev, payload.new as Message]);
          markMessagesAsRead();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(messagesChannel);
    };
  }, [ticket]);

  const loadOrCreateTicket = async () => {
    try {
      // Try to find existing open ticket for this category/subcategory
      let { data: existingTicket, error: fetchError } = await supabase
        .from('tickets')
        .select('*')
        .eq('user_id', user!.id)
        .eq('category', category!)
        .eq('subcategory', subcategory!)
        .in('status', ['open', 'in_progress'])
        .maybeSingle();

      if (fetchError) throw fetchError;

      if (!existingTicket) {
        // Create new ticket
        const { data: newTicket, error: createError } = await supabase
          .from('tickets')
          .insert({
            user_id: user!.id,
            category: category!,
            subcategory: subcategory!,
            subject: `Discussion - ${subcategory}`,
            status: 'open'
          })
          .select()
          .single();

        if (createError) throw createError;
        existingTicket = newTicket;
      }

      setTicket(existingTicket);

      // Load messages
      const { data: messagesData, error: messagesError } = await supabase
        .from('messages')
        .select('*')
        .eq('ticket_id', existingTicket.id)
        .order('created_at', { ascending: true });

      if (messagesError) throw messagesError;
      setMessages(messagesData || []);
    } catch (error: any) {
      console.error('Error loading ticket:', error);
      toast({
        title: 'Erreur',
        description: 'Impossible de charger la conversation',
        variant: 'destructive'
      });
    } finally {
      setIsLoading(false);
    }
  };

  const markMessagesAsRead = async () => {
    if (!ticket) return;
    try {
      await supabase.rpc('mark_ticket_messages_as_read', {
        ticket_id_param: ticket.id
      });
    } catch (error) {
      console.error('Error marking messages as read:', error);
    }
  };

  const sendMessage = async () => {
    if (!newMessage.trim() || !ticket) return;

    setIsSending(true);
    try {
      const { error } = await supabase
        .from('messages')
        .insert({
          ticket_id: ticket.id,
          user_id: user!.id,
          content: newMessage.trim()
        });

      if (error) throw error;

      setNewMessage('');
      toast({
        title: 'Message envoyé',
        description: 'Votre message a été envoyé avec succès'
      });
    } catch (error: any) {
      console.error('Error sending message:', error);
      toast({
        title: 'Erreur',
        description: 'Impossible d\'envoyer le message',
        variant: 'destructive'
      });
    } finally {
      setIsSending(false);
    }
  };

  if (authLoading || isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!user || !isVIP) {
    return <Navigate to="/auth" replace />;
  }

  const getCategoryTitle = () => {
    const titles: Record<string, string> = {
      expedition: 'Expédition',
      introduction: 'Introduction',
      outils: 'Outils',
      informations: 'Informations'
    };
    return titles[category || ''] || category;
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-grow pt-20">
        <div className="container mx-auto px-4 py-8">
          <div className="max-w-4xl mx-auto">
            <div className="mb-6">
              <h1 className="text-3xl font-bold mb-2">
                {getCategoryTitle()} - {subcategory}
              </h1>
              <p className="text-muted-foreground">
                Posez vos questions et échangez avec l'équipe
              </p>
            </div>

            <CategoryAlerts category={category!} subcategory={subcategory} />

            <Card className="mt-6">
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <span>Discussion</span>
                  {ticket && (
                    <Badge variant={ticket.status === 'open' ? 'default' : 'secondary'}>
                      {ticket.status === 'open' ? 'Ouvert' : ticket.status === 'in_progress' ? 'En cours' : 'Fermé'}
                    </Badge>
                  )}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ScrollArea className="h-[400px] pr-4 mb-4">
                  <div className="space-y-4">
                    {messages.length === 0 ? (
                      <p className="text-center text-muted-foreground py-8">
                        Aucun message. Soyez le premier à écrire !
                      </p>
                    ) : (
                      messages.map((message) => (
                        <div
                          key={message.id}
                          className={`flex ${
                            message.user_id === user?.id ? 'justify-end' : 'justify-start'
                          }`}
                        >
                          <div
                            className={`max-w-[80%] rounded-lg p-3 ${
                              message.user_id === user?.id
                                ? 'bg-primary text-primary-foreground'
                                : 'bg-muted'
                            }`}
                          >
                            {message.is_admin && message.user_id !== user?.id && (
                              <Badge variant="secondary" className="mb-2">Admin</Badge>
                            )}
                            <p className="whitespace-pre-wrap break-words">{message.content}</p>
                            <p className="text-xs opacity-70 mt-1">
                              {new Date(message.created_at).toLocaleString('fr-FR')}
                            </p>
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                </ScrollArea>

                <div className="flex gap-2">
                  <Textarea
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                    placeholder="Écrivez votre message..."
                    className="resize-none"
                    rows={3}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' && !e.shiftKey) {
                        e.preventDefault();
                        sendMessage();
                      }
                    }}
                  />
                  <Button
                    onClick={sendMessage}
                    disabled={!newMessage.trim() || isSending}
                    size="icon"
                    className="h-auto"
                  >
                    {isSending ? (
                      <Loader2 className="w-5 h-5 animate-spin" />
                    ) : (
                      <Send className="w-5 h-5" />
                    )}
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default CategoryTicket;
