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

interface Profile {
  id: string;
  email: string;
  nickname?: string;
  full_name?: string;
  isFake?: boolean;
}

interface Props {
  onGroupCreated: () => void;
}

// 104 faux membres pour donner l'impression d'une grande communauté
const FAKE_MEMBERS: Profile[] = [
  { id: 'fake-1', email: 'lucas.martin@email.com', nickname: 'Lucas M.', full_name: 'Lucas Martin', isFake: true },
  { id: 'fake-2', email: 'emma.bernard@email.com', nickname: 'Emma B.', full_name: 'Emma Bernard', isFake: true },
  { id: 'fake-3', email: 'hugo.dubois@email.com', nickname: 'Hugo D.', full_name: 'Hugo Dubois', isFake: true },
  { id: 'fake-4', email: 'chloe.thomas@email.com', nickname: 'Chloé T.', full_name: 'Chloé Thomas', isFake: true },
  { id: 'fake-5', email: 'nathan.robert@email.com', nickname: 'Nathan R.', full_name: 'Nathan Robert', isFake: true },
  { id: 'fake-6', email: 'lea.richard@email.com', nickname: 'Léa R.', full_name: 'Léa Richard', isFake: true },
  { id: 'fake-7', email: 'louis.petit@email.com', nickname: 'Louis P.', full_name: 'Louis Petit', isFake: true },
  { id: 'fake-8', email: 'manon.durand@email.com', nickname: 'Manon D.', full_name: 'Manon Durand', isFake: true },
  { id: 'fake-9', email: 'jules.leroy@email.com', nickname: 'Jules L.', full_name: 'Jules Leroy', isFake: true },
  { id: 'fake-10', email: 'camille.moreau@email.com', nickname: 'Camille M.', full_name: 'Camille Moreau', isFake: true },
  { id: 'fake-11', email: 'gabriel.simon@email.com', nickname: 'Gabriel S.', full_name: 'Gabriel Simon', isFake: true },
  { id: 'fake-12', email: 'ines.laurent@email.com', nickname: 'Inès L.', full_name: 'Inès Laurent', isFake: true },
  { id: 'fake-13', email: 'raphael.michel@email.com', nickname: 'Raphaël M.', full_name: 'Raphaël Michel', isFake: true },
  { id: 'fake-14', email: 'lola.garcia@email.com', nickname: 'Lola G.', full_name: 'Lola Garcia', isFake: true },
  { id: 'fake-15', email: 'adam.david@email.com', nickname: 'Adam D.', full_name: 'Adam David', isFake: true },
  { id: 'fake-16', email: 'jade.bertrand@email.com', nickname: 'Jade B.', full_name: 'Jade Bertrand', isFake: true },
  { id: 'fake-17', email: 'arthur.roux@email.com', nickname: 'Arthur R.', full_name: 'Arthur Roux', isFake: true },
  { id: 'fake-18', email: 'zoe.vincent@email.com', nickname: 'Zoé V.', full_name: 'Zoé Vincent', isFake: true },
  { id: 'fake-19', email: 'liam.fournier@email.com', nickname: 'Liam F.', full_name: 'Liam Fournier', isFake: true },
  { id: 'fake-20', email: 'julia.morel@email.com', nickname: 'Julia M.', full_name: 'Julia Morel', isFake: true },
  { id: 'fake-21', email: 'ethan.girard@email.com', nickname: 'Ethan G.', full_name: 'Ethan Girard', isFake: true },
  { id: 'fake-22', email: 'rose.andre@email.com', nickname: 'Rose A.', full_name: 'Rose André', isFake: true },
  { id: 'fake-23', email: 'noah.lefebvre@email.com', nickname: 'Noah L.', full_name: 'Noah Lefebvre', isFake: true },
  { id: 'fake-24', email: 'alice.mercier@email.com', nickname: 'Alice M.', full_name: 'Alice Mercier', isFake: true },
  { id: 'fake-25', email: 'leo.dupont@email.com', nickname: 'Léo D.', full_name: 'Léo Dupont', isFake: true },
  { id: 'fake-26', email: 'anna.lambert@email.com', nickname: 'Anna L.', full_name: 'Anna Lambert', isFake: true },
  { id: 'fake-27', email: 'paul.bonnet@email.com', nickname: 'Paul B.', full_name: 'Paul Bonnet', isFake: true },
  { id: 'fake-28', email: 'eva.francois@email.com', nickname: 'Eva F.', full_name: 'Eva François', isFake: true },
  { id: 'fake-29', email: 'tom.martinez@email.com', nickname: 'Tom M.', full_name: 'Tom Martinez', isFake: true },
  { id: 'fake-30', email: 'louise.legrand@email.com', nickname: 'Louise L.', full_name: 'Louise Legrand', isFake: true },
  { id: 'fake-31', email: 'theo.garnier@email.com', nickname: 'Théo G.', full_name: 'Théo Garnier', isFake: true },
  { id: 'fake-32', email: 'sarah.faure@email.com', nickname: 'Sarah F.', full_name: 'Sarah Faure', isFake: true },
  { id: 'fake-33', email: 'maxime.rousseau@email.com', nickname: 'Maxime R.', full_name: 'Maxime Rousseau', isFake: true },
  { id: 'fake-34', email: 'lucie.blanc@email.com', nickname: 'Lucie B.', full_name: 'Lucie Blanc', isFake: true },
  { id: 'fake-35', email: 'antoine.guerin@email.com', nickname: 'Antoine G.', full_name: 'Antoine Guérin', isFake: true },
  { id: 'fake-36', email: 'clara.muller@email.com', nickname: 'Clara M.', full_name: 'Clara Muller', isFake: true },
  { id: 'fake-37', email: 'alexis.henry@email.com', nickname: 'Alexis H.', full_name: 'Alexis Henry', isFake: true },
  { id: 'fake-38', email: 'marie.roussel@email.com', nickname: 'Marie R.', full_name: 'Marie Roussel', isFake: true },
  { id: 'fake-39', email: 'victor.nicolas@email.com', nickname: 'Victor N.', full_name: 'Victor Nicolas', isFake: true },
  { id: 'fake-40', email: 'elisa.perrin@email.com', nickname: 'Elisa P.', full_name: 'Elisa Perrin', isFake: true },
  { id: 'fake-41', email: 'axel.dumont@email.com', nickname: 'Axel D.', full_name: 'Axel Dumont', isFake: true },
  { id: 'fake-42', email: 'lisa.fontaine@email.com', nickname: 'Lisa F.', full_name: 'Lisa Fontaine', isFake: true },
  { id: 'fake-43', email: 'mathis.chevalier@email.com', nickname: 'Mathis C.', full_name: 'Mathis Chevalier', isFake: true },
  { id: 'fake-44', email: 'oceane.robin@email.com', nickname: 'Océane R.', full_name: 'Océane Robin', isFake: true },
  { id: 'fake-45', email: 'enzo.masson@email.com', nickname: 'Enzo M.', full_name: 'Enzo Masson', isFake: true },
  { id: 'fake-46', email: 'clemence.sanchez@email.com', nickname: 'Clémence S.', full_name: 'Clémence Sanchez', isFake: true },
  { id: 'fake-47', email: 'timothe.schmitt@email.com', nickname: 'Timothé S.', full_name: 'Timothé Schmitt', isFake: true },
  { id: 'fake-48', email: 'margot.roy@email.com', nickname: 'Margot R.', full_name: 'Margot Roy', isFake: true },
  { id: 'fake-49', email: 'mael.moulin@email.com', nickname: 'Maël M.', full_name: 'Maël Moulin', isFake: true },
  { id: 'fake-50', email: 'agathe.lemoine@email.com', nickname: 'Agathe L.', full_name: 'Agathe Lemoine', isFake: true },
  { id: 'fake-51', email: 'baptiste.picard@email.com', nickname: 'Baptiste P.', full_name: 'Baptiste Picard', isFake: true },
  { id: 'fake-52', email: 'charlotte.renard@email.com', nickname: 'Charlotte R.', full_name: 'Charlotte Renard', isFake: true },
  { id: 'fake-53', email: 'quentin.arnaud@email.com', nickname: 'Quentin A.', full_name: 'Quentin Arnaud', isFake: true },
  { id: 'fake-54', email: 'justine.giraud@email.com', nickname: 'Justine G.', full_name: 'Justine Giraud', isFake: true },
  { id: 'fake-55', email: 'benjamin.fabre@email.com', nickname: 'Benjamin F.', full_name: 'Benjamin Fabre', isFake: true },
  { id: 'fake-56', email: 'pauline.caron@email.com', nickname: 'Pauline C.', full_name: 'Pauline Caron', isFake: true },
  { id: 'fake-57', email: 'clement.gauthier@email.com', nickname: 'Clément G.', full_name: 'Clément Gauthier', isFake: true },
  { id: 'fake-58', email: 'mathilde.boyer@email.com', nickname: 'Mathilde B.', full_name: 'Mathilde Boyer', isFake: true },
  { id: 'fake-59', email: 'valentin.meyer@email.com', nickname: 'Valentin M.', full_name: 'Valentin Meyer', isFake: true },
  { id: 'fake-60', email: 'anais.adam@email.com', nickname: 'Anaïs A.', full_name: 'Anaïs Adam', isFake: true },
  { id: 'fake-61', email: 'alexandre.marchand@email.com', nickname: 'Alexandre M.', full_name: 'Alexandre Marchand', isFake: true },
  { id: 'fake-62', email: 'marine.jean@email.com', nickname: 'Marine J.', full_name: 'Marine Jean', isFake: true },
  { id: 'fake-63', email: 'romain.ferreira@email.com', nickname: 'Romain F.', full_name: 'Romain Ferreira', isFake: true },
  { id: 'fake-64', email: 'ambre.olivier@email.com', nickname: 'Ambre O.', full_name: 'Ambre Olivier', isFake: true },
  { id: 'fake-65', email: 'florian.philippe@email.com', nickname: 'Florian P.', full_name: 'Florian Philippe', isFake: true },
  { id: 'fake-66', email: 'noemie.breton@email.com', nickname: 'Noémie B.', full_name: 'Noémie Breton', isFake: true },
  { id: 'fake-67', email: 'dylan.fleury@email.com', nickname: 'Dylan F.', full_name: 'Dylan Fleury', isFake: true },
  { id: 'fake-68', email: 'aurelie.gilles@email.com', nickname: 'Aurélie G.', full_name: 'Aurélie Gilles', isFake: true },
  { id: 'fake-69', email: 'jeremy.boucher@email.com', nickname: 'Jérémy B.', full_name: 'Jérémy Boucher', isFake: true },
  { id: 'fake-70', email: 'elsa.carpentier@email.com', nickname: 'Elsa C.', full_name: 'Elsa Carpentier', isFake: true },
  { id: 'fake-71', email: 'kevin.charles@email.com', nickname: 'Kévin C.', full_name: 'Kévin Charles', isFake: true },
  { id: 'fake-72', email: 'audrey.hubert@email.com', nickname: 'Audrey H.', full_name: 'Audrey Hubert', isFake: true },
  { id: 'fake-73', email: 'william.dufour@email.com', nickname: 'William D.', full_name: 'William Dufour', isFake: true },
  { id: 'fake-74', email: 'laura.renaud@email.com', nickname: 'Laura R.', full_name: 'Laura Renaud', isFake: true },
  { id: 'fake-75', email: 'jordan.lacroix@email.com', nickname: 'Jordan L.', full_name: 'Jordan Lacroix', isFake: true },
  { id: 'fake-76', email: 'melanie.maillard@email.com', nickname: 'Mélanie M.', full_name: 'Mélanie Maillard', isFake: true },
  { id: 'fake-77', email: 'vincent.baron@email.com', nickname: 'Vincent B.', full_name: 'Vincent Baron', isFake: true },
  { id: 'fake-78', email: 'ophelie.prevost@email.com', nickname: 'Ophélie P.', full_name: 'Ophélie Prévost', isFake: true },
  { id: 'fake-79', email: 'thomas.jacquet@email.com', nickname: 'Thomas J.', full_name: 'Thomas Jacquet', isFake: true },
  { id: 'fake-80', email: 'elodie.girard@email.com', nickname: 'Elodie G.', full_name: 'Elodie Girard', isFake: true },
  { id: 'fake-81', email: 'julien.lemaire@email.com', nickname: 'Julien L.', full_name: 'Julien Lemaire', isFake: true },
  { id: 'fake-82', email: 'coralie.poirier@email.com', nickname: 'Coralie P.', full_name: 'Coralie Poirier', isFake: true },
  { id: 'fake-83', email: 'pierre.collet@email.com', nickname: 'Pierre C.', full_name: 'Pierre Collet', isFake: true },
  { id: 'fake-84', email: 'elea.charpentier@email.com', nickname: 'Eléa C.', full_name: 'Eléa Charpentier', isFake: true },
  { id: 'fake-85', email: 'samuel.boulay@email.com', nickname: 'Samuel B.', full_name: 'Samuel Boulay', isFake: true },
  { id: 'fake-86', email: 'celia.weber@email.com', nickname: 'Célia W.', full_name: 'Célia Weber', isFake: true },
  { id: 'fake-87', email: 'dorian.berger@email.com', nickname: 'Dorian B.', full_name: 'Dorian Berger', isFake: true },
  { id: 'fake-88', email: 'estelle.lecomte@email.com', nickname: 'Estelle L.', full_name: 'Estelle Lecomte', isFake: true },
  { id: 'fake-89', email: 'matheo.gomez@email.com', nickname: 'Mathéo G.', full_name: 'Mathéo Gomez', isFake: true },
  { id: 'fake-90', email: 'marion.faure@email.com', nickname: 'Marion F.', full_name: 'Marion Faure', isFake: true },
  { id: 'fake-91', email: 'adrien.colin@email.com', nickname: 'Adrien C.', full_name: 'Adrien Colin', isFake: true },
  { id: 'fake-92', email: 'helene.vidal@email.com', nickname: 'Hélène V.', full_name: 'Hélène Vidal', isFake: true },
  { id: 'fake-93', email: 'morgan.noel@email.com', nickname: 'Morgan N.', full_name: 'Morgan Noël', isFake: true },
  { id: 'fake-94', email: 'fanny.brun@email.com', nickname: 'Fanny B.', full_name: 'Fanny Brun', isFake: true },
  { id: 'fake-95', email: 'damien.perez@email.com', nickname: 'Damien P.', full_name: 'Damien Perez', isFake: true },
  { id: 'fake-96', email: 'laetitia.louis@email.com', nickname: 'Laetitia L.', full_name: 'Laetitia Louis', isFake: true },
  { id: 'fake-97', email: 'sebastien.huet@email.com', nickname: 'Sébastien H.', full_name: 'Sébastien Huet', isFake: true },
  { id: 'fake-98', email: 'victoria.marechal@email.com', nickname: 'Victoria M.', full_name: 'Victoria Maréchal', isFake: true },
  { id: 'fake-99', email: 'nicolas.bousquet@email.com', nickname: 'Nicolas B.', full_name: 'Nicolas Bousquet', isFake: true },
  { id: 'fake-100', email: 'caroline.poulain@email.com', nickname: 'Caroline P.', full_name: 'Caroline Poulain', isFake: true },
  { id: 'fake-101', email: 'loic.guyot@email.com', nickname: 'Loïc G.', full_name: 'Loïc Guyot', isFake: true },
  { id: 'fake-102', email: 'sarah.perret@email.com', nickname: 'Sarah P.', full_name: 'Sarah Perret', isFake: true },
  { id: 'fake-103', email: 'yoann.guillon@email.com', nickname: 'Yoann G.', full_name: 'Yoann Guillon', isFake: true },
  { id: 'fake-104', email: 'emilie.tanguy@email.com', nickname: 'Emilie T.', full_name: 'Emilie Tanguy', isFake: true },
];

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
      
      // Combiner les vrais utilisateurs avec les faux membres
      const realUsers = (data || []).map(u => ({ ...u, isFake: false }));
      setAllUsers([...realUsers, ...FAKE_MEMBERS]);
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

    // Filtrer les faux membres - ne garder que les vrais utilisateurs
    const realSelectedUsers = Array.from(selectedUsers).filter(userId => !userId.startsWith('fake-'));

    if (realSelectedUsers.length === 0) {
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

      // Add only real selected members to the group (exclude fake members)
      const members = realSelectedUsers.map(userId => ({
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
                  className="flex items-center space-x-3 p-2 rounded-md hover:bg-accent cursor-pointer"
                  onClick={() => toggleUserSelection(user.id)}
                >
                  <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center transition-colors ${
                    selectedUsers.has(user.id) 
                      ? 'bg-green-500 border-green-500' 
                      : 'border-muted-foreground'
                  }`}>
                    {selectedUsers.has(user.id) && (
                      <div className="w-2 h-2 bg-white rounded-full" />
                    )}
                  </div>
                  <div className="flex-1">
                    <div className="font-medium text-sm">
                      {user.nickname || user.full_name || 'Utilisateur'}
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