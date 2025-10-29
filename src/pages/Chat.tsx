import { useState, useEffect } from 'react';
import { useAuth } from '@/hooks/use-auth';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { Capacitor } from '@capacitor/core';
import { toast } from 'sonner';
import { Loader2, Users, Plus, Edit2, Check, X, Pin, PinOff, EyeOff, Trash2, ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
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
import ChatRoom from '@/components/chat/ChatRoom';
import { DirectMessageList } from '@/components/chat/DirectMessageList';
import { DirectChatRoom } from '@/components/chat/DirectChatRoom';
import { GroupDialog } from '@/components/chat/GroupDialog';
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
  const [searchParams] = useSearchParams();
  const isNativeApp = Capacitor.isNativePlatform();
  const [rooms, setRooms] = useState<Room[]>([]);
  const [selectedRoom, setSelectedRoom] = useState<string | null>(null);
  const [selectedDirectConversation, setSelectedDirectConversation] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'rooms' | 'direct'>('rooms');
  const [loading, setLoading] = useState(true);
  const [createDialogOpen, setCreateDialogOpen] = useState(false);
  const [newRoomName, setNewRoomName] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [roomFilter, setRoomFilter] = useState<'all' | 'public' | 'private'>('all');
  const [editingRoomId, setEditingRoomId] = useState<string | null>(null);
  const [editingRoomName, setEditingRoomName] = useState('');
  const [pinnedRooms, setPinnedRooms] = useState<Set<string>>(new Set());
  const [hiddenRooms, setHiddenRooms] = useState<Set<string>>(new Set());
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [roomToDelete, setRoomToDelete] = useState<string | null>(null);

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
    fetchPinnedRooms();
    fetchHiddenRooms();
    
    // Check if there's a room ID in the URL
    const roomId = searchParams.get('room');
    if (roomId) {
      setSelectedRoom(roomId);
    }
  }, [user, isVIP, isAdmin, navigate, searchParams]);

  const fetchPinnedRooms = async () => {
    if (!user) return;
    try {
      const { data, error } = await supabase
        .from('chat_room_pins')
        .select('room_id')
        .eq('user_id', user.id);

      if (error) throw error;
      setPinnedRooms(new Set(data?.map(p => p.room_id) || []));
    } catch (error: any) {
      console.error('Error fetching pinned rooms:', error);
    }
  };

  const fetchHiddenRooms = async () => {
    if (!user) return;
    try {
      const { data, error } = await supabase
        .from('chat_room_visibility')
        .select('room_id')
        .eq('user_id', user.id)
        .eq('is_hidden', true);

      if (error) throw error;
      setHiddenRooms(new Set(data?.map(v => v.room_id) || []));
    } catch (error: any) {
      console.error('Error fetching hidden rooms:', error);
    }
  };

  const fetchRooms = async () => {
    try {
      const { data, error } = await supabase
        .from('chat_rooms')
        .select('*')
        .order('created_at', { ascending: true });

      if (error) throw error;

      setRooms(data || []);
      
      // Auto-select general room if not already selected
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

  const togglePin = async (roomId: string) => {
    if (!user) return;

    try {
      if (pinnedRooms.has(roomId)) {
        // Unpin
        const { error } = await supabase
          .from('chat_room_pins')
          .delete()
          .eq('room_id', roomId)
          .eq('user_id', user.id);

        if (error) throw error;
        toast.success('Conversation désépinglée');
      } else {
        // Check if already have 3 pinned
        if (pinnedRooms.size >= 3) {
          toast.error('Vous pouvez épingler maximum 3 conversations');
          return;
        }

        // Pin
        const { error } = await supabase
          .from('chat_room_pins')
          .insert({ room_id: roomId, user_id: user.id });

        if (error) throw error;
        toast.success('Conversation épinglée');
      }

      fetchPinnedRooms();
    } catch (error: any) {
      console.error('Error toggling pin:', error);
      toast.error('Erreur lors de l\'épinglage');
    }
  };

  const hideRoom = async (roomId: string) => {
    if (!user) return;

    try {
      // First check if visibility record exists
      const { data: existing } = await supabase
        .from('chat_room_visibility')
        .select('id')
        .eq('room_id', roomId)
        .eq('user_id', user.id)
        .single();

      if (existing) {
        // Update existing record
        const { error } = await supabase
          .from('chat_room_visibility')
          .update({ is_hidden: true })
          .eq('room_id', roomId)
          .eq('user_id', user.id);

        if (error) throw error;
      } else {
        // Insert new record
        const { error } = await supabase
          .from('chat_room_visibility')
          .insert({ 
            room_id: roomId, 
            user_id: user.id, 
            is_hidden: true 
          });

        if (error) throw error;
      }

      // Update local state immediately
      setHiddenRooms(prev => new Set([...prev, roomId]));
      
      toast.success('Conversation masquée');
      
      // If hiding currently selected room, deselect it
      if (selectedRoom === roomId) {
        setSelectedRoom(null);
      }
    } catch (error: any) {
      console.error('Error hiding room:', error);
      toast.error('Erreur lors du masquage');
    }
  };

  const deleteRoom = async () => {
    if (!roomToDelete) return;

    try {
      const { error } = await supabase
        .from('chat_rooms')
        .delete()
        .eq('id', roomToDelete);

      if (error) {
        console.error('Supabase error:', error);
        toast.error(`Erreur: ${error.message}`);
        return;
      }

      // Update local state immediately
      setRooms(prev => prev.filter(room => room.id !== roomToDelete));
      
      toast.success('Salon supprimé');
      setDeleteDialogOpen(false);
      
      // If deleting current room, deselect it
      if (selectedRoom === roomToDelete) {
        setSelectedRoom(null);
      }
      
      setRoomToDelete(null);
    } catch (error: any) {
      console.error('Error deleting room:', error);
      toast.error(`Erreur: ${error.message || 'Erreur lors de la suppression'}`);
    }
  };

  const filteredRooms = rooms
    .filter(room => {
      // Show general and group rooms
      if (room.type !== 'general' && room.type !== 'group') {
        return false;
      }

      // Don't show hidden rooms for non-admins
      if (!isAdmin && hiddenRooms.has(room.id)) {
        return false;
      }

      const matchesSearch = !searchQuery || 
        room.name?.toLowerCase().includes(searchQuery.toLowerCase());
      
      return matchesSearch;
    })
    .sort((a, b) => {
      // 1. General room always on top
      if (a.type === 'general') return -1;
      if (b.type === 'general') return 1;

      // 2. Pinned rooms next
      const aIsPinned = pinnedRooms.has(a.id);
      const bIsPinned = pinnedRooms.has(b.id);
      if (aIsPinned && !bIsPinned) return -1;
      if (!aIsPinned && bIsPinned) return 1;

      // 3. Then by creation date
      return new Date(a.created_at).getTime() - new Date(b.created_at).getTime();
    });

  // Separate marketplace rooms by role (acheter vs vendre)
  const marketplaceAcheterRooms = filteredRooms.filter(room => 
    room.type === 'marketplace' && room.name?.startsWith('Achat')
  );
  const marketplaceVendreRooms = filteredRooms.filter(room => 
    room.type === 'marketplace' && room.name?.startsWith('Vente')
  );
  const otherRooms = filteredRooms.filter(room => 
    room.type === 'general'
  );
  const groupRooms = filteredRooms.filter(room => room.type === 'group');

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {isNativeApp && (
        <button
          onClick={() => navigate('/dashboard')}
          className="fixed top-[46px] left-[18px] z-50 bg-primary/90 backdrop-blur-sm p-2 rounded-full shadow-lg hover:bg-primary transition-all"
          aria-label="Retour"
        >
          <ArrowLeft className="w-5 h-5 text-primary-foreground" />
        </button>
      )}
      <div className="container mx-auto py-8 px-4">
        <div className="flex gap-4 h-[calc(100vh-8rem)]">
          {/* Sidebar - Room List */}
          <div className={`${(selectedRoom || selectedDirectConversation) ? 'hidden md:flex' : 'flex'} w-full md:w-80 bg-card border rounded-lg p-4 flex-col`}>
            <Tabs value={activeTab} onValueChange={(v) => setActiveTab(v as 'rooms' | 'direct')} className="flex-1 flex flex-col">
              <TabsList className="grid w-full grid-cols-2 mb-4">
                <TabsTrigger value="rooms">Salons</TabsTrigger>
                <TabsTrigger value="direct">Directs</TabsTrigger>
              </TabsList>

              <TabsContent value="rooms" className="flex-1 flex flex-col">
                <div className="space-y-4 mb-4">
                  <h2 className="text-xl font-bold flex items-center gap-2">
                    <Users className="h-5 w-5" />
                    Conversations
                  </h2>
                  
                  <GroupDialog onGroupCreated={fetchRooms} />

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
                    <>
                      {/* Regular rooms */}
                      {otherRooms.map((room) => (
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
                          onClick={() => {
                            setSelectedRoom(room.id);
                            setSelectedDirectConversation(null);
                          }}
                          className="flex-1 text-left p-3"
                        >
                          <div className="font-medium flex items-center gap-2">
                            {pinnedRooms.has(room.id) && <Pin className="h-3 w-3" />}
                            {room.name || 'Conversation'}
                          </div>
                        </button>
                        <div className="flex items-center gap-1 pr-2">
                          {room.type === 'private' && (
                            <>
                              <Button
                                size="sm"
                                variant="ghost"
                                className="h-8 w-8 p-0"
                                onClick={() => togglePin(room.id)}
                                title={pinnedRooms.has(room.id) ? 'Désépingler' : 'Épingler'}
                              >
                                {pinnedRooms.has(room.id) ? (
                                  <PinOff className="h-3 w-3" />
                                ) : (
                                  <Pin className="h-3 w-3" />
                                )}
                              </Button>
                              {(room.created_by === user?.id || isAdmin) && (
                                <Button
                                  size="sm"
                                  variant="ghost"
                                  className="h-8 w-8 p-0"
                                  onClick={() => startEditing(room)}
                                  title="Renommer"
                                >
                                  <Edit2 className="h-3 w-3" />
                                </Button>
                              )}
                              <Button
                                size="sm"
                                variant="ghost"
                                className="h-8 w-8 p-0"
                                onClick={() => hideRoom(room.id)}
                                title="Masquer cette conversation"
                              >
                                <EyeOff className="h-3 w-3" />
                              </Button>
                              {(room.created_by === user?.id || isAdmin) && (
                                <Button
                                  size="sm"
                                  variant="ghost"
                                  className="h-8 w-8 p-0"
                                  onClick={() => {
                                    setRoomToDelete(room.id);
                                    setDeleteDialogOpen(true);
                                  }}
                                  title="Supprimer ce salon"
                                >
                                  <Trash2 className="h-3 w-3" />
                                </Button>
                              )}
                            </>
                          )}
                        </div>
                      </div>
                    )}
                  </div>
                  ))
                  }
                  
                  {/* Marketplace sections */}
                  {(marketplaceAcheterRooms.length > 0 || marketplaceVendreRooms.length > 0) && (
                    <>
                      <div className="pt-4 pb-2 px-2">
                        <h3 className="text-sm font-semibold text-muted-foreground uppercase">🛒 Marketplace</h3>
                      </div>
                      
                      {/* Acheter section */}
                      {marketplaceAcheterRooms.length > 0 && (
                        <>
                          <div className="pt-2 pb-1 px-4">
                            <h4 className="text-xs font-medium text-muted-foreground">🛍️ acheter</h4>
                          </div>
                          {marketplaceAcheterRooms.map((room) => (
                            <div
                              key={room.id}
                              className={`rounded-lg transition-colors ${
                                selectedRoom === room.id
                                  ? 'bg-primary text-primary-foreground'
                                  : 'hover:bg-accent'
                              }`}
                            >
                              <div className="flex items-center">
                                <button
                                  onClick={() => setSelectedRoom(room.id)}
                                  className="flex-1 text-left p-3"
                                >
                                  <div className="font-medium text-sm">
                                    {room.name?.replace('Achat - ', '') || 'Transaction'}
                                  </div>
                                  <div className="text-xs opacity-70">
                                    💬 Vous + Staff
                                  </div>
                                </button>
                                <div className="flex items-center gap-1 pr-2">
                                  <Button
                                    size="sm"
                                    variant="ghost"
                                    className="h-8 w-8 p-0"
                                    onClick={() => hideRoom(room.id)}
                                    title="Masquer"
                                  >
                                    <EyeOff className="h-3 w-3" />
                                  </Button>
                                  {(room.created_by === user?.id || isAdmin) && (
                                    <Button
                                      size="sm"
                                      variant="ghost"
                                      className="h-8 w-8 p-0"
                                      onClick={() => {
                                        setRoomToDelete(room.id);
                                        setDeleteDialogOpen(true);
                                      }}
                                      title="Supprimer"
                                    >
                                      <Trash2 className="h-3 w-3" />
                                    </Button>
                                  )}
                                </div>
                              </div>
                            </div>
                          ))}
                        </>
                      )}
                      
                      {/* Vendre section */}
                      {marketplaceVendreRooms.length > 0 && (
                        <>
                          <div className="pt-2 pb-1 px-4">
                            <h4 className="text-xs font-medium text-muted-foreground">💰 vendre</h4>
                          </div>
                          {marketplaceVendreRooms.map((room) => (
                            <div
                              key={room.id}
                              className={`rounded-lg transition-colors ${
                                selectedRoom === room.id
                                  ? 'bg-primary text-primary-foreground'
                                  : 'hover:bg-accent'
                              }`}
                            >
                              <div className="flex items-center">
                                <button
                                  onClick={() => setSelectedRoom(room.id)}
                                  className="flex-1 text-left p-3"
                                >
                                  <div className="font-medium text-sm">
                                    {room.name?.replace('Vente - ', '') || 'Transaction'}
                                  </div>
                                  <div className="text-xs opacity-70">
                                    💬 Vous + Staff
                                  </div>
                                </button>
                                <div className="flex items-center gap-1 pr-2">
                                  <Button
                                    size="sm"
                                    variant="ghost"
                                    className="h-8 w-8 p-0"
                                    onClick={() => hideRoom(room.id)}
                                    title="Masquer"
                                  >
                                    <EyeOff className="h-3 w-3" />
                                  </Button>
                                  {(room.created_by === user?.id || isAdmin) && (
                                    <Button
                                      size="sm"
                                      variant="ghost"
                                      className="h-8 w-8 p-0"
                                      onClick={() => {
                                        setRoomToDelete(room.id);
                                        setDeleteDialogOpen(true);
                                      }}
                                      title="Supprimer"
                                    >
                                      <Trash2 className="h-3 w-3" />
                                    </Button>
                                  )}
                                </div>
                              </div>
                            </div>
                          ))}
                        </>
                      )}
                    </>
                  )}
                  
                  {/* Groups section */}
                  {groupRooms.length > 0 && (
                    <>
                      <div className="pt-4 pb-2 px-2">
                        <h3 className="text-sm font-semibold text-muted-foreground uppercase">👥 Groupes</h3>
                      </div>
                      {groupRooms.map((room) => (
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
                                onClick={() => {
                                  setSelectedRoom(room.id);
                                  setSelectedDirectConversation(null);
                                }}
                                className="flex-1 text-left p-3"
                              >
                                <div className="font-medium flex items-center gap-2">
                                  {pinnedRooms.has(room.id) && <Pin className="h-3 w-3" />}
                                  {room.name || 'Groupe'}
                                </div>
                              </button>
                              <div className="flex items-center gap-1 pr-2">
                                <Button
                                  size="sm"
                                  variant="ghost"
                                  className="h-8 w-8 p-0"
                                  onClick={() => togglePin(room.id)}
                                  title={pinnedRooms.has(room.id) ? 'Désépingler' : 'Épingler'}
                                >
                                  {pinnedRooms.has(room.id) ? (
                                    <PinOff className="h-3 w-3" />
                                  ) : (
                                    <Pin className="h-3 w-3" />
                                  )}
                                </Button>
                                {(room.created_by === user?.id || isAdmin) && (
                                  <Button
                                    size="sm"
                                    variant="ghost"
                                    className="h-8 w-8 p-0"
                                    onClick={() => startEditing(room)}
                                    title="Renommer"
                                  >
                                    <Edit2 className="h-3 w-3" />
                                  </Button>
                                )}
                                <Button
                                  size="sm"
                                  variant="ghost"
                                  className="h-8 w-8 p-0"
                                  onClick={() => hideRoom(room.id)}
                                  title="Masquer"
                                >
                                  <EyeOff className="h-3 w-3" />
                                </Button>
                                {(room.created_by === user?.id || isAdmin) && (
                                  <Button
                                    size="sm"
                                    variant="ghost"
                                    className="h-8 w-8 p-0"
                                    onClick={() => {
                                      setRoomToDelete(room.id);
                                      setDeleteDialogOpen(true);
                                    }}
                                    title="Supprimer"
                                  >
                                    <Trash2 className="h-3 w-3" />
                                  </Button>
                                )}
                              </div>
                            </div>
                          )}
                        </div>
                      ))}
                    </>
                  )}
                </>
              )}
            </div>
          </TabsContent>

          <TabsContent value="direct" className="flex-1 overflow-y-auto">
            <DirectMessageList
              selectedConversation={selectedDirectConversation}
              onSelectConversation={(id) => {
                setSelectedDirectConversation(id);
                setSelectedRoom(null);
              }}
            />
          </TabsContent>
        </Tabs>
      </div>

      {/* Chat Area */}
      <div className={`${(selectedRoom || selectedDirectConversation) ? 'flex' : 'hidden md:flex'} flex-1 bg-card border rounded-lg overflow-hidden`}>
        {selectedRoom ? (
          <ChatRoom roomId={selectedRoom} onBack={() => setSelectedRoom(null)} />
        ) : selectedDirectConversation ? (
          <DirectChatRoom 
            conversationId={selectedDirectConversation} 
            onBack={() => setSelectedDirectConversation(null)} 
          />
        ) : (
          <div className="h-full flex items-center justify-center text-muted-foreground">
            Sélectionnez une conversation pour commencer
          </div>
        )}
          </div>
        </div>
      </div>

      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Supprimer le salon ?</AlertDialogTitle>
            <AlertDialogDescription>
              Cette action est irréversible. Tous les messages de ce salon seront définitivement supprimés.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Annuler</AlertDialogCancel>
            <AlertDialogAction onClick={deleteRoom} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">
              Supprimer
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default Chat;
