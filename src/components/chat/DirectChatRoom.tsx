import { useState, useEffect, useRef } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/use-auth';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { ArrowLeft, Loader2 } from 'lucide-react';
import { toast } from 'sonner';
import DirectMessageInput from './DirectMessageInput';

interface DirectMessage {
  id: string;
  conversation_id: string;
  sender_id: string;
  content: string | null;
  file_url: string | null;
  file_name: string | null;
  file_type: string | null;
  created_at: string;
}

interface Profile {
  id: string;
  email: string;
  nickname?: string;
  full_name?: string;
}

interface Props {
  conversationId: string;
  onBack: () => void;
}

export const DirectChatRoom = ({ conversationId, onBack }: Props) => {
  const { user } = useAuth();
  const [messages, setMessages] = useState<DirectMessage[]>([]);
  const [otherUser, setOtherUser] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (conversationId) {
      fetchMessages();
      fetchOtherUser();
      subscribeToMessages();
    }
  }, [conversationId]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  };

  const fetchMessages = async () => {
    try {
      const { data, error } = await supabase
        .from('direct_messages')
        .select('*')
        .eq('conversation_id', conversationId)
        .order('created_at', { ascending: true });

      if (error) throw error;
      setMessages(data || []);
    } catch (error: any) {
      console.error('Error fetching messages:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchOtherUser = async () => {
    if (!user) return;

    try {
      const { data: conversation, error: convoError } = await supabase
        .from('direct_conversations')
        .select('user1_id, user2_id')
        .eq('id', conversationId)
        .single();

      if (convoError) throw convoError;

      const otherUserId = conversation.user1_id === user.id 
        ? conversation.user2_id 
        : conversation.user1_id;

      const { data: profile, error: profileError } = await supabase
        .from('profiles')
        .select('id, email, nickname, full_name')
        .eq('id', otherUserId)
        .single();

      if (profileError) throw profileError;
      setOtherUser(profile);
    } catch (error: any) {
      console.error('Error fetching other user:', error);
    }
  };

  const subscribeToMessages = () => {
    const channel = supabase
      .channel(`direct-messages-${conversationId}`)
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'direct_messages',
          filter: `conversation_id=eq.${conversationId}`
        },
        (payload) => {
          setMessages(prev => [...prev, payload.new as DirectMessage]);
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  };

  if (loading) {
    return (
      <div className="h-full flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="h-full flex flex-col">
      {/* Header */}
      <div className="border-b p-4 flex items-center gap-4">
        <Button
          variant="ghost"
          size="icon"
          onClick={onBack}
          className="md:hidden"
        >
          <ArrowLeft className="h-5 w-5" />
        </Button>
        <div>
          <h3 className="font-semibold">
            {otherUser?.nickname || otherUser?.full_name || 'Utilisateur'}
          </h3>
        </div>
      </div>

      {/* Messages */}
      <ScrollArea className="flex-1 p-4" ref={scrollRef}>
        <div className="space-y-4">
          {messages.length === 0 ? (
            <p className="text-center text-muted-foreground py-8">
              Aucun message. Commencez la conversation !
            </p>
          ) : (
            messages.map((message) => (
              <div
                key={message.id}
                className={`flex ${
                  message.sender_id === user?.id ? 'justify-end' : 'justify-start'
                }`}
              >
                <div
                  className={`max-w-[80%] rounded-lg p-3 ${
                    message.sender_id === user?.id
                      ? 'bg-primary text-primary-foreground'
                      : 'bg-muted'
                  }`}
                >
                  {message.content && (
                    <p className="whitespace-pre-wrap break-words">{message.content}</p>
                  )}
                  {message.file_url && (
                    <div className="mt-2">
                      {message.file_type === 'image' && (
                        <img
                          src={message.file_url}
                          alt={message.file_name || 'Image'}
                          className="max-w-full rounded"
                        />
                      )}
                      {message.file_type === 'video' && (
                        <video src={message.file_url} controls className="max-w-full rounded" />
                      )}
                      {message.file_type === 'audio' && (
                        <audio src={message.file_url} controls className="w-full" />
                      )}
                      {message.file_type && !['image', 'video', 'audio'].includes(message.file_type) && (
                        <a
                          href={message.file_url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-sm underline"
                        >
                          📎 {message.file_name}
                        </a>
                      )}
                    </div>
                  )}
                  <p className="text-xs opacity-70 mt-1">
                    {new Date(message.created_at).toLocaleString('fr-FR')}
                  </p>
                </div>
              </div>
            ))
          )}
        </div>
      </ScrollArea>

      {/* Input */}
      <div className="border-t p-4">
        <DirectMessageInput conversationId={conversationId} />
      </div>
    </div>
  );
};
