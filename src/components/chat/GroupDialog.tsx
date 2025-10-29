import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/use-auth';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Users, UserPlus } from 'lucide-react';
import { toast } from 'sonner';
import { Checkbox } from '@/components/ui/checkbox';

interface Profile {
  id: string;
  email: string;
  nickname?: string;
  full_name?: string;
}

interface Props {
  onGroupCreated: () => void;
}

export const GroupDialog = ({ onGroupCreated }: Props) => {
  const { user } = useAuth();
  const [dialogOpen, setDialogOpen] = useState(false);
  const [groupName, setGroupName] = useState('');
  const [allUsers, setAllUsers] = useState<Profile[]>([]);
  const [selectedUsers, setSelectedUsers] = useState<Set<string>>(new Set());
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (dialogOpen && user) {
      fetchAllUsers();
    }
  }, [dialogOpen, user]);

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
      toast.error('Erreur lors du chargement des membres');
    }
  };

  const toggleUserSelection = (userId: string) => {
    setSelectedUsers(prev => {
      const newSet = new Set(prev);
      if (newSet.has(userId)) {
        newSet.delete(userId);
      } else {
        newSet.add(userId);
      }
      return newSet;
    });
  };

  const createGroup = async () => {
    if (!user || !groupName.trim()) {
      toast.error('Veuillez entrer un nom de groupe');
      return;
    }

    if (selectedUsers.size === 0) {
      toast.error('Veuillez sélectionner au moins un membre');
      return;
    }

    setLoading(true);
    try {
      // Create the group room
      const { data: roomData, error: roomError } = await supabase
        .from('chat_rooms')
        .insert({
          name: groupName,
          type: 'group',
          created_by: user.id
        })
        .select()
        .single();

      if (roomError) throw roomError;

      // Add all selected members to the group
      const members = Array.from(selectedUsers).map(userId => ({
        room_id: roomData.id,
        user_id: userId
      }));

      // Also add the creator to the group
      members.push({
        room_id: roomData.id,
        user_id: user.id
      });

      const { error: membersError } = await supabase
        .from('chat_room_members')
        .insert(members);

      if (membersError) throw membersError;

      toast.success('Groupe créé avec succès');
      setDialogOpen(false);
      setGroupName('');
      setSelectedUsers(new Set());
      setSearchQuery('');
      onGroupCreated();
    } catch (error: any) {
      console.error('Error creating group:', error);
      toast.error('Erreur lors de la création du groupe');
    } finally {
      setLoading(false);
    }
  };

  const filteredUsers = allUsers.filter(u => {
    const displayName = u.nickname || u.full_name || u.email;
    return displayName.toLowerCase().includes(searchQuery.toLowerCase());
  });

  return (
    <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
      <DialogTrigger asChild>
        <Button size="sm" variant="outline">
          <UserPlus className="h-4 w-4 mr-2" />
          Créer un groupe
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Créer un groupe</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <div>
            <Label htmlFor="group-name">Nom du groupe</Label>
            <Input
              id="group-name"
              value={groupName}
              onChange={(e) => setGroupName(e.target.value)}
              placeholder="Ex: Groupe Marketplace"
            />
          </div>

          <div>
            <Label>Sélectionner les membres</Label>
            <Input
              placeholder="Rechercher un membre..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="mt-2"
            />
          </div>

          <ScrollArea className="h-[300px] border rounded-md p-2">
            <div className="space-y-2">
              {filteredUsers.map(user => (
                <div
                  key={user.id}
                  className="flex items-center space-x-2 p-2 rounded-md hover:bg-accent cursor-pointer"
                  onClick={() => toggleUserSelection(user.id)}
                >
                  <Checkbox
                    checked={selectedUsers.has(user.id)}
                    onCheckedChange={() => toggleUserSelection(user.id)}
                  />
                  <div className="flex-1">
                    <div className="font-medium text-sm">
                      {user.nickname || user.full_name || 'Utilisateur'}
                    </div>
                    <div className="text-xs text-muted-foreground">
                      {user.email}
                    </div>
                  </div>
                </div>
              ))}
              {filteredUsers.length === 0 && (
                <p className="text-center text-sm text-muted-foreground py-4">
                  Aucun membre trouvé
                </p>
              )}
            </div>
          </ScrollArea>

          <div className="flex items-center justify-between text-sm">
            <span className="text-muted-foreground">
              {selectedUsers.size} membre(s) sélectionné(s)
            </span>
          </div>

          <Button 
            onClick={createGroup} 
            className="w-full"
            disabled={loading || !groupName.trim() || selectedUsers.size === 0}
          >
            {loading ? 'Création...' : 'Créer le groupe'}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};