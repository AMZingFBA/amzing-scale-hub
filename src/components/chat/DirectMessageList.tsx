import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/use-auth';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Input } from '@/components/ui/input';
import { Users, Trash2, MessageCircle } from 'lucide-react';
import { toast } from 'sonner';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';

interface DirectConversation {
  id: string;
  user1_id: string;
  user2_id: string;
  created_at: string;
  other_user: {
    id: string;
    email: string;
    nickname?: string;
  };
}

interface Profile {
  id: string;
  email: string;
  nickname?: string;
  full_name?: string;
}

interface Props {
  selectedConversation: string | null;
  onSelectConversation: (id: string) => void;
}

export const DirectMessageList = ({ selectedConversation, onSelectConversation }: Props) => {
  const { user } = useAuth();
  const [conversations, setConversations] = useState<DirectConversation[]>([]);
  const [allUsers, setAllUsers] = useState<Profile[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [conversationToDelete, setConversationToDelete] = useState<string | null>(null);

  useEffect(() => {
    if (user) {
      fetchConversations();
      fetchAllUsers();
    }
  }, [user]);

  const fetchConversations = async () => {
    if (!user) return;

    try {
      // Fetch conversations
      const { data: convos, error: convosError } = await supabase
        .from('direct_conversations')
        .select('*')
        .or(`user1_id.eq.${user.id},user2_id.eq.${user.id}`)
        .order('updated_at', { ascending: false });

      if (convosError) throw convosError;

      // Get other users' profiles
      const userIds = convos?.map(c => 
        c.user1_id === user.id ? c.user2_id : c.user1_id
      ) || [];

      const { data: profiles, error: profilesError } = await supabase
        .from('profiles')
        .select('id, email, nickname, full_name')
        .in('id', userIds);

      if (profilesError) throw profilesError;

      const profilesMap = new Map(
        profiles?.map(p => [p.id, p]) || []
      );

      const formattedConvos = convos?.map(c => {
        const otherUserId = c.user1_id === user.id ? c.user2_id : c.user1_id;
        const otherUser = profilesMap.get(otherUserId);

        return {
          ...c,
          other_user: {
            id: otherUserId,
            email: otherUser?.email || 'Utilisateur',
            nickname: otherUser?.nickname || otherUser?.full_name
          }
        };
      }) || [];

      setConversations(formattedConvos);
    } catch (error: any) {
      console.error('Error fetching conversations:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchAllUsers = async () => {
    if (!user) return;

    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('id, email, nickname, full_name')
        .neq('id', user.id);

      if (error) throw error;
      setAllUsers(data || []);
    } catch (error: any) {
      console.error('Error fetching users:', error);
    }
  };

  const startConversation = async (otherUserId: string) => {
    try {
      const { data, error } = await supabase
        .rpc('get_or_create_conversation', { other_user_id: otherUserId });

      if (error) throw error;

      toast.success('Conversation ouverte');
      setDialogOpen(false);
      onSelectConversation(data);
      fetchConversations();
    } catch (error: any) {
      console.error('Error creating conversation:', error);
      toast.error('Erreur lors de la création de la conversation');
    }
  };

  const toggleHideConversation = async (conversationId: string, currentlyHidden: boolean) => {
    if (!user) return;

    try {
      const { data: existing } = await supabase
        .from('direct_conversation_visibility')
        .select('id')
        .eq('conversation_id', conversationId)
        .eq('user_id', user.id)
        .maybeSingle();

      if (existing) {
        const { error } = await supabase
          .from('direct_conversation_visibility')
          .update({ is_hidden: !currentlyHidden })
          .eq('conversation_id', conversationId)
          .eq('user_id', user.id);

        if (error) throw error;
      } else {
        const { error } = await supabase
          .from('direct_conversation_visibility')
          .insert({
            conversation_id: conversationId,
            user_id: user.id,
            is_hidden: !currentlyHidden
          });

        if (error) throw error;
      }

      toast.success(currentlyHidden ? 'Conversation affichée' : 'Conversation masquée');
      fetchConversations();
    } catch (error: any) {
      console.error('Error toggling visibility:', error);
      toast.error('Erreur lors du masquage');
    }
  };

  const deleteConversation = async () => {
    if (!conversationToDelete) return;

    try {
      const { error } = await supabase
        .from('direct_conversations')
        .delete()
        .eq('id', conversationToDelete);

      if (error) throw error;

      toast.success('Conversation supprimée');
      setDeleteDialogOpen(false);
      setConversationToDelete(null);
      
      // If deleting current conversation, deselect it
      if (selectedConversation === conversationToDelete) {
        onSelectConversation('');
      }
      
      fetchConversations();
    } catch (error: any) {
      console.error('Error deleting conversation:', error);
      toast.error('Erreur lors de la suppression');
    }
  };

  const filteredUsers = allUsers.filter(u => {
    const displayName = u.nickname || u.full_name || u.email;
    return displayName.toLowerCase().includes(searchQuery.toLowerCase());
  });

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="font-semibold flex items-center gap-2">
          <MessageCircle className="h-4 w-4" />
          Messages Directs
        </h3>
        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <DialogTrigger asChild>
            <Button size="sm" variant="outline">
              <Users className="h-4 w-4" />
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Nouveau message</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <Input
                placeholder="Rechercher un membre..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
              <ScrollArea className="h-[300px]">
                <div className="space-y-2">
                  {filteredUsers.map(user => (
                    <Button
                      key={user.id}
                      variant="ghost"
                      className="w-full justify-start"
                      onClick={() => startConversation(user.id)}
                    >
                      <div className="text-left">
                        <div className="font-medium">
                          {user.nickname || user.full_name || 'Utilisateur'}
                        </div>
                        <div className="text-xs text-muted-foreground">
                          {user.email}
                        </div>
                      </div>
                    </Button>
                  ))}
                  {filteredUsers.length === 0 && (
                    <p className="text-center text-sm text-muted-foreground py-4">
                      Aucun membre trouvé
                    </p>
                  )}
                </div>
              </ScrollArea>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      <div className="space-y-2">
        {loading ? (
          <p className="text-sm text-muted-foreground text-center py-4">
            Chargement...
          </p>
        ) : conversations.length === 0 ? (
          <p className="text-sm text-muted-foreground text-center py-4">
            Aucune conversation
          </p>
        ) : (
          conversations.map(convo => (
            <div
              key={convo.id}
              className={`rounded-lg transition-colors ${
                selectedConversation === convo.id
                  ? 'bg-primary text-primary-foreground'
                  : 'hover:bg-accent'
              }`}
            >
              <div className="flex items-center">
                <button
                  onClick={() => onSelectConversation(convo.id)}
                  className="flex-1 text-left p-3"
                >
                  <div className="font-medium">
                    {convo.other_user.nickname || 'Utilisateur'}
                  </div>
                  <div className="text-xs opacity-70">
                    {convo.other_user.email}
                  </div>
                </button>
                <div className="flex items-center gap-1 pr-2">
                  <Button
                    size="sm"
                    variant="ghost"
                    className="h-8 w-8 p-0"
                    onClick={() => {
                      setConversationToDelete(convo.id);
                      setDeleteDialogOpen(true);
                    }}
                    title="Supprimer"
                  >
                    <Trash2 className="h-3 w-3" />
                  </Button>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Supprimer la conversation ?</AlertDialogTitle>
            <AlertDialogDescription>
              Cette action est irréversible. Tous les messages de cette conversation seront définitivement supprimés.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Annuler</AlertDialogCancel>
            <AlertDialogAction onClick={deleteConversation} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">
              Supprimer
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};
