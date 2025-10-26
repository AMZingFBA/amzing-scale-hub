import { useState, useEffect, useRef } from 'react';
import { useAuth } from '@/hooks/use-auth';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { Loader2, Trash2, Reply, AtSign } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import MessageInput from './MessageInput';
import { useAdmin } from '@/hooks/use-admin';
import { formatDistanceToNow } from 'date-fns';
import { fr } from 'date-fns/locale';

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
  reply_to: string | null;
  mentions: string[] | null;
  created_at: string;
  profile?: Profile;
}

interface ChatRoomProps {
  roomId: string;
  onBack?: () => void;
}

const ChatRoom = ({ roomId, onBack }: ChatRoomProps) => {
  const { user } = useAuth();
  const { isAdmin } = useAdmin();
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(true);
  const [replyTo, setReplyTo] = useState<Message | null>(null);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    fetchMessages();
    subscribeToMessages();
  }, [roomId]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const fetchMessages = async () => {
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
    const channel = supabase
      .channel(`chat-${roomId}`)
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
          <div>
            {message.content && <p className="mb-2">{message.content}</p>}
            <audio src={message.file_url || ''} controls className="w-full max-w-md" />
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
      <div className="h-full flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  const createPrivateConversation = async (withUserId: string, withUserNickname: string) => {
    if (!user) return;

    try {
      // Check if private room already exists between these users
      const { data: existingRooms } = await supabase
        .from('chat_rooms')
        .select('id, created_by')
        .eq('type', 'private');

      // For each existing room, check if both users are members
      for (const room of existingRooms || []) {
        const { data: members } = await supabase
          .from('chat_room_members')
          .select('user_id')
          .eq('room_id', room.id);

        const memberIds = members?.map(m => m.user_id) || [];
        if (memberIds.includes(user.id) && memberIds.includes(withUserId)) {
          // Room already exists - redirect to it
          toast.success(`Ouverture de la conversation avec ${withUserNickname}`);
          window.location.href = `/chat`;
          return;
        }
      }

      // Create new private room
      const { data: newRoom, error: roomError } = await supabase
        .from('chat_rooms')
        .insert({
          name: `Privé: ${withUserNickname}`,
          type: 'private',
          created_by: user.id
        })
        .select()
        .single();

      if (roomError) throw roomError;

      // Add both users as members
      const { error: membersError } = await supabase
        .from('chat_room_members')
        .insert([
          { room_id: newRoom.id, user_id: user.id },
          { room_id: newRoom.id, user_id: withUserId }
        ]);

      if (membersError) throw membersError;

      toast.success(`Conversation privée créée avec ${withUserNickname}`);
      
      // Reload to show new room
      window.location.reload();
    } catch (error: any) {
      console.error('Error creating private conversation:', error);
      toast.error('Erreur lors de la création de la conversation privée');
    }
  };

  return (
    <div className="h-full flex flex-col">
      {/* Mobile header with back button */}
      {onBack && (
        <div className="md:hidden flex items-center gap-2 p-4 border-b bg-card">
          <Button
            variant="ghost"
            size="icon"
            onClick={onBack}
          >
            <Reply className="h-4 w-4 rotate-180" />
          </Button>
          <h3 className="font-semibold">Conversation</h3>
        </div>
      )}
      
      <ScrollArea className="flex-1 p-4">
        <div className="space-y-4">
          {messages.map((message) => {
            const isOwn = message.user_id === user?.id;
            const replyToMessage = message.reply_to 
              ? messages.find(m => m.id === message.reply_to)
              : null;

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
                    <div className="flex items-center gap-1">
                      {!isOwn && (
                        <>
                          <Button
                            size="sm"
                            variant="ghost"
                            className="h-6 w-6 p-0"
                            onClick={() => setReplyTo(message)}
                            title="Répondre en public"
                          >
                            <Reply className="h-3 w-3" />
                          </Button>
                          <Button
                            size="sm"
                            variant="ghost"
                            className="h-6 w-6 p-0"
                            onClick={() => createPrivateConversation(message.user_id, message.profile?.nickname || message.profile?.full_name || 'Utilisateur')}
                            title="Répondre en privé"
                          >
                            <AtSign className="h-3 w-3" />
                          </Button>
                        </>
                      )}
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
                  </div>

                  {replyToMessage && (
                    <div className="mb-2 p-2 rounded bg-black/10 text-xs opacity-70">
                      <Reply className="h-3 w-3 inline mr-1" />
                      Réponse à {replyToMessage.profile?.nickname || replyToMessage.profile?.full_name}
                    </div>
                  )}

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

      {replyTo && (
        <div className="px-4 py-2 bg-muted border-t flex items-center justify-between">
          <div className="text-sm">
            <Reply className="h-4 w-4 inline mr-1" />
            Réponse à {replyTo.profile?.nickname || replyTo.profile?.full_name}
          </div>
          <Button
            size="sm"
            variant="ghost"
            onClick={() => setReplyTo(null)}
          >
            ✕
          </Button>
        </div>
      )}

      <div className="border-t p-4">
        <MessageInput roomId={roomId} replyTo={replyTo?.id} onMessageSent={() => setReplyTo(null)} />
      </div>
    </div>
  );
};

export default ChatRoom;
