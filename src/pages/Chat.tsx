import { useState, useEffect } from 'react';
import { useAuth } from '@/hooks/use-auth';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { Loader2, Users, Plus, Edit2, Check, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import ChatRoom from '@/components/chat/ChatRoom';
import { useAdmin } from '@/hooks/use-admin';

interface Room {
  id: string;
  name: string | null;
  type: string;
  created_at: string;
  created_by: string | null;
}

const Chat = () => {
  const { user, isVIP } = useAuth();
  const { isAdmin } = useAdmin();
  const navigate = useNavigate();
  const [rooms, setRooms] = useState<Room[]>([]);
  const [selectedRoom, setSelectedRoom] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [createDialogOpen, setCreateDialogOpen] = useState(false);
  const [newRoomName, setNewRoomName] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [roomFilter, setRoomFilter] = useState<'all' | 'public' | 'private'>('all');
  const [editingRoomId, setEditingRoomId] = useState<string | null>(null);
  const [editingRoomName, setEditingRoomName] = useState('');

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

    fetchRooms();
  }, [user, isVIP, isAdmin, navigate]);

  const fetchRooms = async () => {
    try {
      const { data, error } = await supabase
        .from('chat_rooms')
        .select('*')
        .order('created_at', { ascending: true });

      if (error) throw error;

      setRooms(data || []);
      
      // Auto-select general room
      const generalRoom = data?.find(r => r.type === 'general');
      if (generalRoom && !selectedRoom) {
        setSelectedRoom(generalRoom.id);
      }
    } catch (error: any) {
      console.error('Error fetching rooms:', error);
      toast.error('Erreur lors du chargement des salles');
    } finally {
      setLoading(false);
    }
  };

  const createPrivateRoom = async () => {
    if (!newRoomName.trim()) {
      toast.error('Veuillez entrer un nom pour la conversation');
      return;
    }

    try {
      const { data, error } = await supabase
        .from('chat_rooms')
        .insert({
          name: newRoomName,
          type: 'private',
          created_by: user?.id
        })
        .select()
        .single();

      if (error) throw error;

      toast.success('Conversation privée créée');
      setNewRoomName('');
      setCreateDialogOpen(false);
      setRooms([...rooms, data]);
      setSelectedRoom(data.id);
    } catch (error: any) {
      console.error('Error creating room:', error);
      toast.error('Erreur lors de la création de la conversation');
    }
  };

  const renameRoom = async (roomId: string, newName: string) => {
    if (!newName.trim()) {
      toast.error('Le nom ne peut pas être vide');
      return;
    }

    try {
      const { error } = await supabase
        .from('chat_rooms')
        .update({ name: newName })
        .eq('id', roomId);

      if (error) throw error;

      toast.success('Conversation renommée');
      setEditingRoomId(null);
      setEditingRoomName('');
      fetchRooms();
    } catch (error: any) {
      console.error('Error renaming room:', error);
      toast.error('Erreur lors du renommage');
    }
  };

  const startEditing = (room: Room) => {
    setEditingRoomId(room.id);
    setEditingRoomName(room.name || '');
  };

  const cancelEditing = () => {
    setEditingRoomId(null);
    setEditingRoomName('');
  };

  const filteredRooms = rooms.filter(room => {
    const matchesSearch = !searchQuery || 
      room.name?.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesFilter = 
      roomFilter === 'all' ||
      (roomFilter === 'public' && room.type === 'general') ||
      (roomFilter === 'private' && room.type === 'private');

    return matchesSearch && matchesFilter;
  });

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto py-8 px-4">
        <div className="flex gap-4 h-[calc(100vh-8rem)]">
          {/* Sidebar - Room List */}
          <div className={`${selectedRoom ? 'hidden md:flex' : 'flex'} w-full md:w-80 bg-card border rounded-lg p-4 flex-col`}>
            <div className="space-y-4 mb-4">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-bold flex items-center gap-2">
                  <Users className="h-5 w-5" />
                  Conversations
                </h2>
                <Dialog open={createDialogOpen} onOpenChange={setCreateDialogOpen}>
                  <DialogTrigger asChild>
                    <Button size="sm" variant="outline">
                      <Plus className="h-4 w-4" />
                    </Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>Nouvelle conversation privée</DialogTitle>
                    </DialogHeader>
                    <div className="space-y-4">
                      <div>
                        <Label htmlFor="room-name">Nom de la conversation</Label>
                        <Input
                          id="room-name"
                          value={newRoomName}
                          onChange={(e) => setNewRoomName(e.target.value)}
                          placeholder="Ex: Discussion produits"
                        />
                      </div>
                      <Button onClick={createPrivateRoom} className="w-full">
                        Créer
                      </Button>
                    </div>
                  </DialogContent>
                </Dialog>
              </div>

              {/* Search */}
              <Input
                placeholder="Rechercher une conversation..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />

              {/* Filter for admins */}
              {isAdmin && (
                <div className="flex gap-2">
                  <Button
                    size="sm"
                    variant={roomFilter === 'all' ? 'default' : 'outline'}
                    onClick={() => setRoomFilter('all')}
                    className="flex-1"
                  >
                    Toutes
                  </Button>
                  <Button
                    size="sm"
                    variant={roomFilter === 'public' ? 'default' : 'outline'}
                    onClick={() => setRoomFilter('public')}
                    className="flex-1"
                  >
                    Publiques
                  </Button>
                  <Button
                    size="sm"
                    variant={roomFilter === 'private' ? 'default' : 'outline'}
                    onClick={() => setRoomFilter('private')}
                    className="flex-1"
                  >
                    Privées
                  </Button>
                </div>
              )}
            </div>

            <div className="flex-1 overflow-y-auto space-y-2">
              {filteredRooms.length === 0 ? (
                <p className="text-sm text-muted-foreground text-center py-4">
                  Aucune conversation trouvée
                </p>
              ) : (
                filteredRooms.map((room) => (
                  <div
                    key={room.id}
                    className={`rounded-lg transition-colors ${
                      selectedRoom === room.id
                        ? 'bg-primary text-primary-foreground'
                        : 'hover:bg-accent'
                    }`}
                  >
                    {editingRoomId === room.id ? (
                      <div className="p-3 flex items-center gap-2">
                        <Input
                          value={editingRoomName}
                          onChange={(e) => setEditingRoomName(e.target.value)}
                          className="flex-1 h-8"
                          onKeyPress={(e) => {
                            if (e.key === 'Enter') {
                              renameRoom(room.id, editingRoomName);
                            }
                          }}
                        />
                        <Button
                          size="sm"
                          variant="ghost"
                          className="h-8 w-8 p-0"
                          onClick={() => renameRoom(room.id, editingRoomName)}
                        >
                          <Check className="h-4 w-4" />
                        </Button>
                        <Button
                          size="sm"
                          variant="ghost"
                          className="h-8 w-8 p-0"
                          onClick={cancelEditing}
                        >
                          <X className="h-4 w-4" />
                        </Button>
                      </div>
                    ) : (
                      <div className="flex items-center">
                        <button
                          onClick={() => setSelectedRoom(room.id)}
                          className="flex-1 text-left p-3"
                        >
                          <div className="font-medium">
                            {room.name || 'Conversation'}
                          </div>
                          <div className="text-xs opacity-70">
                            {room.type === 'general' ? '🌍 Public' : '🔒 Privé'}
                          </div>
                        </button>
                        {room.type === 'private' && (room.created_by === user?.id || isAdmin) && (
                          <Button
                            size="sm"
                            variant="ghost"
                            className="h-8 w-8 p-0 mr-2"
                            onClick={() => startEditing(room)}
                          >
                            <Edit2 className="h-3 w-3" />
                          </Button>
                        )}
                      </div>
                    )}
                  </div>
                ))
              )}
            </div>
          </div>

          {/* Chat Area */}
          <div className={`${selectedRoom ? 'flex' : 'hidden md:flex'} flex-1 bg-card border rounded-lg overflow-hidden`}>
            {selectedRoom ? (
              <ChatRoom roomId={selectedRoom} onBack={() => setSelectedRoom(null)} />
            ) : (
              <div className="h-full flex items-center justify-center text-muted-foreground">
                Sélectionnez une conversation pour commencer
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Chat;
