import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, Users, RefreshCw, Search, Crown, XCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { useAdmin } from "@/hooks/use-admin";
import { airtableUsersService, AirtableUser } from "@/services/airtableUsersService";

const AdminAirtableUsers = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { isAdmin, isLoading: adminLoading } = useAdmin();
  
  const [users, setUsers] = useState<AirtableUser[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchEmail, setSearchEmail] = useState('');
  const [searchResult, setSearchResult] = useState<AirtableUser | null>(null);
  const [isSearching, setIsSearching] = useState(false);

  useEffect(() => {
    if (!adminLoading && !isAdmin) {
      navigate('/');
    }
  }, [isAdmin, adminLoading, navigate]);

  const fetchUsers = async () => {
    setIsLoading(true);
    try {
      const data = await airtableUsersService.fetchUsers();
      setUsers(data);
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Erreur",
        description: "Impossible de charger les utilisateurs Airtable",
      });
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (isAdmin) {
      fetchUsers();
    }
  }, [isAdmin]);

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchEmail) return;
    
    setIsSearching(true);
    try {
      const user = await airtableUsersService.fetchUserByEmail(searchEmail);
      setSearchResult(user);
      if (!user) {
        toast({ title: "Aucun utilisateur trouvé", variant: "destructive" });
      }
    } catch (error) {
      toast({ variant: "destructive", title: "Erreur de recherche" });
    } finally {
      setIsSearching(false);
    }
  };

  const handleActivateVIP = async (email: string, type: 'Mensuel' | 'Annuel') => {
    try {
      await airtableUsersService.activateVIP(email, type);
      toast({ title: `VIP ${type} activé pour ${email}` });
      fetchUsers();
      if (searchResult?.email === email) {
        const updated = await airtableUsersService.fetchUserByEmail(email);
        setSearchResult(updated);
      }
    } catch (error) {
      toast({ variant: "destructive", title: "Erreur" });
    }
  };

  const handleDeactivate = async (email: string) => {
    if (!confirm(`Désactiver l'abonnement de ${email} ?`)) return;
    try {
      await airtableUsersService.deactivateSubscription(email);
      toast({ title: `Abonnement désactivé pour ${email}` });
      fetchUsers();
      if (searchResult?.email === email) {
        const updated = await airtableUsersService.fetchUserByEmail(email);
        setSearchResult(updated);
      }
    } catch (error) {
      toast({ variant: "destructive", title: "Erreur" });
    }
  };

  if (adminLoading || isLoading) {
    return <div className="min-h-screen bg-background flex items-center justify-center">Chargement...</div>;
  }

  const UserCard = ({ user }: { user: AirtableUser }) => (
    <div className="flex items-center justify-between p-4 border rounded-lg">
      <div className="flex-1">
        <div className="flex items-center gap-2">
          <span className="font-medium">{user.email}</span>
          {user.abonnementActif && (
            <Badge className="bg-primary text-primary-foreground">
              <Crown className="h-3 w-3 mr-1" />
              VIP
            </Badge>
          )}
          {user.typeAbonnement && (
            <Badge variant="outline">{user.typeAbonnement}</Badge>
          )}
        </div>
        <div className="text-sm text-muted-foreground mt-1">
          {user.nom && <span>{user.nom} • </span>}
          {user.dateActivation && (
            <span>Activé le: {new Date(user.dateActivation).toLocaleDateString('fr-FR')}</span>
          )}
          {user.idStripe && <span> • Stripe: {user.idStripe.slice(0, 12)}...</span>}
          {user.permissions && <span> • {user.permissions}</span>}
        </div>
      </div>
      <div className="flex gap-2">
        {!user.abonnementActif && (
          <>
            <Button size="sm" onClick={() => handleActivateVIP(user.email, 'Mensuel')}>
              VIP Mensuel
            </Button>
            <Button size="sm" variant="secondary" onClick={() => handleActivateVIP(user.email, 'Annuel')}>
              VIP Annuel
            </Button>
          </>
        )}
        {user.abonnementActif && (
          <Button size="sm" variant="destructive" onClick={() => handleDeactivate(user.email)}>
            <XCircle className="h-4 w-4 mr-1" />
            Désactiver
          </Button>
        )}
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-background p-4 md:p-8">
      <Button 
        variant="ghost" 
        onClick={() => navigate(-1)}
        className="fixed top-[140px] left-4 z-50 text-primary hover:scale-110 transition-transform"
      >
        <ArrowLeft className="h-6 w-6" />
      </Button>

      <div className="max-w-6xl mx-auto pt-16">
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-3">
            <Users className="h-8 w-8 text-primary" />
            <h1 className="text-3xl font-bold">Utilisateurs Airtable</h1>
          </div>
          <Button variant="outline" onClick={fetchUsers}>
            <RefreshCw className="h-4 w-4 mr-2" />
            Actualiser
          </Button>
        </div>

        {/* Search by email */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Search className="h-5 w-5" />
              Rechercher par email
            </CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSearch} className="flex gap-2">
              <Input 
                type="email"
                placeholder="email@exemple.com"
                value={searchEmail}
                onChange={e => setSearchEmail(e.target.value)}
                className="flex-1"
              />
              <Button type="submit" disabled={isSearching}>
                {isSearching ? 'Recherche...' : 'Rechercher'}
              </Button>
            </form>
            {searchResult && (
              <div className="mt-4">
                <UserCard user={searchResult} />
              </div>
            )}
          </CardContent>
        </Card>

        {/* All users */}
        <Card>
          <CardHeader>
            <CardTitle>
              {users.length} utilisateurs • {users.filter(u => u.abonnementActif).length} VIP actifs
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {users.map(user => (
                <UserCard key={user.id} user={user} />
              ))}
              {users.length === 0 && (
                <p className="text-center text-muted-foreground py-8">Aucun utilisateur dans Airtable</p>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default AdminAirtableUsers;
