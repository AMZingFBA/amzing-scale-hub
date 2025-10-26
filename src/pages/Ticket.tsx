import { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '@/hooks/use-auth';
import { useAdmin } from '@/hooks/use-admin';
import { supabase } from '@/integrations/supabase/client';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { Loader2, Send, ArrowLeft, Paperclip, X, Lock } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';

const Ticket = () => {
  const { id } = useParams();
  const { user } = useAuth();
  const { isAdmin } = useAdmin();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [ticket, setTicket] = useState<any>(null);
  const [messages, setMessages] = useState<any[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [isSending, setIsSending] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (!user || !id) {
      navigate('/support');
      return;
    }

    loadTicketData();

    const channel = supabase
      .channel(`ticket-${id}`)
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'messages',
          filter: `ticket_id=eq.${id}`
        },
        (payload) => {
          setMessages((prev) => [...prev, payload.new]);
          scrollToBottom();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [user, id, navigate]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const closeTicket = async () => {
    try {
      const { error } = await supabase
        .from('tickets')
        .update({ 
          status: 'closed',
          closed_at: new Date().toISOString()
        })
        .eq('id', id);

      if (error) throw error;

      toast({
        title: "Ticket fermé",
        description: "Le ticket a été fermé avec succès",
      });
      
      loadTicketData();
    } catch (error) {
      console.error('Error closing ticket:', error);
      toast({
        title: "Erreur",
        description: "Impossible de fermer le ticket",
        variant: "destructive",
      });
    }
  };

  const loadTicketData = async () => {
    try {
      const { data: ticketData, error: ticketError } = await supabase
        .from('tickets')
        .select('*')
        .eq('id', id)
        .single();

      if (ticketError) throw ticketError;

      if (!isAdmin && ticketData.user_id !== user!.id) {
        toast({
          title: "Accès refusé",
          description: "Vous n'avez pas accès à ce ticket",
          variant: "destructive",
        });
        navigate('/support');
        return;
      }

      setTicket(ticketData);

      const { data: messagesData, error: messagesError } = await supabase
        .from('messages')
        .select('*')
        .eq('ticket_id', id)
        .order('created_at', { ascending: true });

      if (messagesError) throw messagesError;
      setMessages(messagesData || []);
      setTimeout(scrollToBottom, 100);
    } catch (error) {
      console.error('Error loading ticket:', error);
      toast({
        title: "Erreur",
        description: "Impossible de charger le ticket",
        variant: "destructive",
      });
      navigate('/support');
    } finally {
      setIsLoading(false);
    }
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 10 * 1024 * 1024) {
        toast({
          title: "Fichier trop volumineux",
          description: "La taille maximale est de 10MB",
          variant: "destructive",
        });
        return;
      }
      setSelectedFile(file);
    }
  };

  const uploadFile = async (): Promise<string | null> => {
    if (!selectedFile) return null;

    setIsUploading(true);
    try {
      const fileExt = selectedFile.name.split('.').pop();
      const fileName = `${user!.id}/${Date.now()}.${fileExt}`;
      
      const { error: uploadError } = await supabase.storage
        .from('ticket-attachments')
        .upload(fileName, selectedFile);

      if (uploadError) throw uploadError;

      const { data } = supabase.storage
        .from('ticket-attachments')
        .getPublicUrl(fileName);

      return data.publicUrl;
    } catch (error) {
      console.error('Error uploading file:', error);
      toast({
        title: "Erreur",
        description: "Impossible d'envoyer le fichier",
        variant: "destructive",
      });
      return null;
    } finally {
      setIsUploading(false);
    }
  };

  const sendMessage = async () => {
    if (!newMessage.trim() && !selectedFile) return;

    setIsSending(true);
    try {
      let fileUrl = null;
      let fileName = null;
      let fileType = null;

      if (selectedFile) {
        fileUrl = await uploadFile();
        if (!fileUrl) {
          setIsSending(false);
          return;
        }
        fileName = selectedFile.name;
        fileType = selectedFile.type;
      }

      const { error } = await supabase
        .from('messages')
        .insert({
          ticket_id: id,
          user_id: user!.id,
          content: newMessage.trim() || null,
          file_url: fileUrl,
          file_name: fileName,
          file_type: fileType
        });

      if (error) throw error;

      setNewMessage('');
      setSelectedFile(null);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    } catch (error) {
      console.error('Error sending message:', error);
      toast({
        title: "Erreur",
        description: "Impossible d'envoyer le message",
        variant: "destructive",
      });
    } finally {
      setIsSending(false);
    }
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
          <Button
            variant="ghost"
            onClick={() => navigate(isAdmin ? '/admin/tickets' : '/support')}
            className="mb-4"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Retour
          </Button>

          <Card className="mb-4">
            <CardHeader>
              <div className="flex justify-between items-start">
                <div>
                  <CardTitle>{ticket?.subject}</CardTitle>
                  {ticket?.status === 'closed' && (
                    <p className="text-sm text-muted-foreground mt-1">
                      Ce ticket est fermé
                    </p>
                  )}
                </div>
                <div className="flex gap-2 items-center">
                  <Badge>{ticket?.priority}</Badge>
                  <Badge variant="outline">{ticket?.status}</Badge>
                  {ticket?.status !== 'closed' && (isAdmin || ticket?.user_id === user?.id) && (
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={closeTicket}
                    >
                      <Lock className="w-4 h-4 mr-2" />
                      Fermer
                    </Button>
                  )}
                </div>
              </div>
            </CardHeader>
          </Card>

          <Card className="mb-4">
            <CardContent className="pt-6">
              <div className="space-y-4 max-h-[500px] overflow-y-auto mb-4">
                {messages.map((message) => (
                  <div
                    key={message.id}
                    className={`flex gap-3 ${
                      message.user_id === user!.id ? 'flex-row-reverse' : ''
                    }`}
                  >
                    <Avatar className="w-8 h-8">
                      <AvatarFallback>
                        {message.user_id === user!.id ? 'V' : 'A'}
                      </AvatarFallback>
                    </Avatar>
                    <div
                      className={`rounded-lg p-3 max-w-[70%] ${
                        message.user_id === user!.id
                          ? 'bg-primary text-primary-foreground'
                          : 'bg-muted'
                      }`}
                    >
                      {message.content && <p className="text-sm">{message.content}</p>}
                      {message.file_url && (
                        <a
                          href={message.file_url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-sm underline flex items-center gap-2 mt-2"
                        >
                          <Paperclip className="w-4 h-4" />
                          {message.file_name}
                        </a>
                      )}
                      <p className="text-xs mt-2 opacity-70">
                        {new Date(message.created_at).toLocaleTimeString('fr-FR', {
                          hour: '2-digit',
                          minute: '2-digit'
                        })}
                      </p>
                    </div>
                  </div>
                ))}
                <div ref={messagesEndRef} />
              </div>

              {selectedFile && (
                <div className="flex items-center gap-2 mb-2 p-2 bg-muted rounded">
                  <Paperclip className="w-4 h-4" />
                  <span className="text-sm flex-1">{selectedFile.name}</span>
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => {
                      setSelectedFile(null);
                      if (fileInputRef.current) {
                        fileInputRef.current.value = '';
                      }
                    }}
                  >
                    <X className="w-4 h-4" />
                  </Button>
                </div>
              )}

              <div className="flex gap-2">
                <Input
                  ref={fileInputRef}
                  type="file"
                  onChange={handleFileSelect}
                  className="hidden"
                  id="file-upload"
                  disabled={ticket?.status === 'closed'}
                />
                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => fileInputRef.current?.click()}
                  disabled={isSending || isUploading || ticket?.status === 'closed'}
                >
                  <Paperclip className="w-4 h-4" />
                </Button>
                <Textarea
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                  placeholder={ticket?.status === 'closed' ? 'Ce ticket est fermé' : 'Écrivez votre message...'}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' && !e.shiftKey) {
                      e.preventDefault();
                      sendMessage();
                    }
                  }}
                  rows={2}
                  className="flex-1"
                  disabled={ticket?.status === 'closed'}
                />
                <Button
                  onClick={sendMessage}
                  disabled={isSending || isUploading || (!newMessage.trim() && !selectedFile) || ticket?.status === 'closed'}
                  size="icon"
                >
                  {(isSending || isUploading) ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : (
                    <Send className="w-4 h-4" />
                  )}
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Ticket;
