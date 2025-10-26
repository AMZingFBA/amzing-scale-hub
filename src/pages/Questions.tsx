import { useState, useEffect, useRef } from 'react';
import { useAuth } from '@/hooks/use-auth';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { Loader2, MessageCircle, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import MessageInput from '@/components/chat/MessageInput';
import { useAdmin } from '@/hooks/use-admin';
import { formatDistanceToNow } from 'date-fns';
import { fr } from 'date-fns/locale';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';

interface Profile {
  full_name: string;
  email: string;
  nickname: string | null;
}

interface Message {
  id: string;
  user_id: string;
  content: string | null;
  message_type: string;
  file_url: string | null;
  file_name: string | null;
  created_at: string;
  profile?: Profile;
}

const Questions = () => {
  const { user, isVIP } = useAuth();
  const { isAdmin } = useAdmin();
  const navigate = useNavigate();
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(true);
  const [roomId, setRoomId] = useState<string | null>(null);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!user) {
      navigate('/auth');
      return;
    }

    if (!isVIP && !isAdmin) {
      toast.error('Accès réservé aux membres VIP');
      navigate('/');
      return;
    }

    fetchQuestionsRoom();
  }, [user, isVIP, isAdmin, navigate]);

  useEffect(() => {
    if (roomId) {
      fetchMessages();
      subscribeToMessages();
    }
  }, [roomId]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const fetchQuestionsRoom = async () => {
    try {
      const { data, error } = await supabase
        .from('chat_rooms')
        .select('id')
        .eq('type', 'questions')
        .single();

      if (error) throw error;
      setRoomId(data.id);
    } catch (error: any) {
      console.error('Error fetching questions room:', error);
      toast.error('Erreur lors du chargement');
      navigate('/dashboard');
    }
  };

  const fetchMessages = async () => {
    if (!roomId) return;

    try {
      const { data: messagesData, error } = await supabase
        .from('chat_messages')
        .select('*')
        .eq('room_id', roomId)
        .order('created_at', { ascending: true });

      if (error) throw error;

      // Fetch profiles separately
      const userIds = [...new Set(messagesData?.map(m => m.user_id) || [])];
      const { data: profilesData } = await supabase
        .from('profiles')
        .select('id, full_name, email, nickname')
        .in('id', userIds);

      const profilesMap = new Map(profilesData?.map(p => [p.id, p]) || []);

      const enrichedMessages = messagesData?.map(msg => ({
        ...msg,
        profile: profilesMap.get(msg.user_id)
      })) || [];

      setMessages(enrichedMessages);
    } catch (error: any) {
      console.error('Error fetching messages:', error);
      toast.error('Erreur lors du chargement des messages');
    } finally {
      setLoading(false);
    }
  };

  const subscribeToMessages = () => {
    if (!roomId) return;

    const channel = supabase
      .channel(`questions-${roomId}`)
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'chat_messages',
          filter: `room_id=eq.${roomId}`
        },
        async (payload) => {
          const { data: messageData } = await supabase
            .from('chat_messages')
            .select('*')
            .eq('id', payload.new.id)
            .single();

          if (messageData) {
            const { data: profileData } = await supabase
              .from('profiles')
              .select('full_name, email, nickname')
              .eq('id', messageData.user_id)
              .single();

            setMessages((prev) => [...prev, {
              ...messageData,
              profile: profileData || undefined
            }]);
          }
        }
      )
      .on(
        'postgres_changes',
        {
          event: 'DELETE',
          schema: 'public',
          table: 'chat_messages',
          filter: `room_id=eq.${roomId}`
        },
        (payload) => {
          setMessages((prev) => prev.filter((msg) => msg.id !== payload.old.id));
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  };

  const scrollToBottom = () => {
    if (scrollRef.current) {
      scrollRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const deleteMessage = async (messageId: string) => {
    try {
      const { error } = await supabase
        .from('chat_messages')
        .delete()
        .eq('id', messageId);

      if (error) throw error;
      toast.success('Message supprimé');
    } catch (error: any) {
      console.error('Error deleting message:', error);
      toast.error('Erreur lors de la suppression');
    }
  };

  const renderMessageContent = (message: Message) => {
    switch (message.message_type) {
      case 'image':
        return (
          <div>
            {message.content && <p className="mb-2">{message.content}</p>}
            <img 
              src={message.file_url || ''} 
              alt={message.file_name || 'Image'}
              className="max-w-md rounded-lg"
            />
          </div>
        );
      case 'video':
        return (
          <div>
            {message.content && <p className="mb-2">{message.content}</p>}
            <video 
              src={message.file_url || ''} 
              controls
              className="max-w-md rounded-lg"
            />
          </div>
        );
      case 'audio':
        return (
          <div className="w-full max-w-sm">
            {message.content && <p className="mb-2">{message.content}</p>}
            <audio 
              src={message.file_url || ''} 
              controls 
              className="w-full"
              preload="auto"
              controlsList="nodownload"
            >
              Votre navigateur ne supporte pas la lecture audio.
            </audio>
            <p className="text-xs mt-1 opacity-50">🎤 Message vocal</p>
          </div>
        );
      case 'file':
        return (
          <div>
            {message.content && <p className="mb-2">{message.content}</p>}
            <a 
              href={message.file_url || ''} 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-primary hover:underline flex items-center gap-2"
            >
              📎 {message.file_name}
            </a>
          </div>
        );
      default:
        return <p className="whitespace-pre-wrap">{message.content}</p>;
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
      <main className="flex-grow pt-20">
        <div className="container mx-auto px-4 py-8 max-w-5xl">
          <div className="bg-card border rounded-lg overflow-hidden h-[calc(100vh-12rem)] flex flex-col">
            {/* Header */}
            <div className="p-4 border-b bg-primary/5">
              <div className="flex items-center gap-3">
                <MessageCircle className="h-6 w-6 text-primary" />
                <div>
                  <h1 className="text-2xl font-bold">Questions & Entraide</h1>
                  <p className="text-sm text-muted-foreground">
                    Posez vos questions produits et partagez vos conseils avec la communauté 💡
                  </p>
                </div>
              </div>
            </div>

            {/* Messages */}
            <ScrollArea className="flex-1 p-4">
              <div className="space-y-4">
                {messages.map((message) => {
                  const isOwn = message.user_id === user?.id;

                  return (
                    <div
                      key={message.id}
                      className={`flex ${isOwn ? 'justify-end' : 'justify-start'}`}
                    >
                      <div
                        className={`max-w-[70%] rounded-lg p-3 ${
                          isOwn
                            ? 'bg-primary text-primary-foreground'
                            : 'bg-muted'
                        }`}
                      >
                        <div className="flex items-center justify-between gap-2 mb-1">
                          <span className="text-xs font-semibold">
                            {isOwn ? 'Vous' : message.profile?.nickname || message.profile?.full_name || 'Utilisateur'}
                          </span>
                          {(isOwn || isAdmin) && (
                            <Button
                              size="sm"
                              variant="ghost"
                              className="h-6 w-6 p-0"
                              onClick={() => deleteMessage(message.id)}
                            >
                              <Trash2 className="h-3 w-3" />
                            </Button>
                          )}
                        </div>

                        {renderMessageContent(message)}

                        <div className="text-xs opacity-70 mt-1">
                          {formatDistanceToNow(new Date(message.created_at), {
                            addSuffix: true,
                            locale: fr
                          })}
                        </div>
                      </div>
                    </div>
                  );
                })}
                <div ref={scrollRef} />
              </div>
            </ScrollArea>

            {/* Input */}
            {roomId && (
              <div className="border-t p-4">
                <MessageInput roomId={roomId} />
              </div>
            )}
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Questions;
