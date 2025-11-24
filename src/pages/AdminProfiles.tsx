import { useState, useEffect } from 'react';
import { useAuth } from '@/hooks/use-auth';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { Loader2, Users, Mail, Phone, UserCircle, ArrowLeft, Search, Calendar, MessageCircle, Crown, Shield, Filter, ChevronLeft, ChevronRight, Clock, AlertCircle, Trash2 } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import ScrollToTop from '@/components/ScrollToTop';
import { useAdmin } from '@/hooks/use-admin';

interface ProfileData {
  id: string;
  full_name: string;
  email: string;
  phone: string | null;
  nickname: string | null;
  avatar_url: string | null;
  created_at: string;
  updated_at: string;
  subscription?: {
    plan_type: string;
    status: string;
    expires_at: string | null;
    is_trial: boolean;
  };
  role?: string;
}

const AdminProfiles = () => {
  const { user } = useAuth();
  const { isAdmin, isLoading: isAdminLoading } = useAdmin();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [profiles, setProfiles] = useState<ProfileData[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterRole, setFilterRole] = useState<string>('all');
  const [filterPlan, setFilterPlan] = useState<string>('all');
  const [filterExpiry, setFilterExpiry] = useState<string>('all');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 20;

  useEffect(() => {
    if (!user) {
      navigate('/auth');
      return;
    }

    // Wait for admin check to complete before redirecting
    if (!isAdminLoading && !isAdmin) {
      toast.error('Accès réservé aux administrateurs');
      navigate('/dashboard');
      return;
    }

    // Only load profiles if user is confirmed admin
    if (!isAdminLoading && isAdmin) {
      loadProfiles();
    }
  }, [user, isAdmin, isAdminLoading, navigate]);

  const loadProfiles = async () => {
    try {
      // Fetch profiles with their subscriptions and roles
      const { data: profilesData, error: profilesError } = await supabase
        .from('profiles')
        .select('id, full_name, email, phone, nickname, avatar_url, created_at, updated_at')
        .order('created_at', { ascending: false });

      if (profilesError) throw profilesError;

      // Fetch subscriptions for all users
      const { data: subscriptionsData, error: subsError } = await supabase
        .from('subscriptions')
        .select('user_id, plan_type, status, expires_at, is_trial');

      if (subsError) throw subsError;

      // Fetch roles for all users
      const { data: rolesData, error: rolesError } = await supabase
        .from('user_roles')
        .select('user_id, role');

      if (rolesError) throw rolesError;

      // Combine the data
      const enrichedProfiles = profilesData?.map(profile => {
        const subscription = subscriptionsData?.find(s => s.user_id === profile.id);
        const userRole = rolesData?.find(r => r.user_id === profile.id);
        
        return {
          ...profile,
          subscription: subscription || undefined,
          role: userRole?.role || 'user'
        };
      });

      setProfiles(enrichedProfiles || []);
    } catch (error: any) {
      console.error('Error loading profiles:', error);
      toast.error('Erreur lors du chargement des profils');
    } finally {
      setLoading(false);
    }
  };

  const handleContactUser = async (userId: string) => {
    try {
      // Create or get conversation with the user
      const { data, error } = await supabase.rpc('get_or_create_conversation', {
        other_user_id: userId
      });

      if (error) throw error;

      // Navigate to the direct messages
      navigate('/chat', { state: { openDirectMessage: userId } });
      toast.success('Conversation ouverte');
    } catch (error) {
      console.error('Error opening conversation:', error);
      toast.error('Erreur lors de l\'ouverture de la conversation');
    }
  };

  const handleDeleteUser = async (userId: string, userEmail: string) => {
    if (!confirm(`Êtes-vous sûr de vouloir supprimer définitivement le compte de ${userEmail} ?\n\nCette action est irréversible et supprimera :\n- Le profil utilisateur\n- Tous les messages\n- L'abonnement\n- Toutes les données associées`)) {
      return;
    }

    try {
      setLoading(true);
      
      // Rafraîchir la session pour s'assurer d'avoir un token valide
      const { data: refreshData, error: refreshError } = await supabase.auth.refreshSession();
      if (refreshError) throw refreshError;
      
      if (!refreshData.session?.access_token) {
        throw new Error("Session non établie");
      }

      const { data, error } = await supabase.functions.invoke('admin-delete-user', {
        headers: {
          Authorization: `Bearer ${refreshData.session.access_token}`,
        },
        body: {
          userId
        }
      });

      if (error) throw error;

      toast.success('Utilisateur supprimé avec succès');
      
      // Recharger la liste des profils
      await loadProfiles();
    } catch (error: any) {
      console.error('Error deleting user:', error);
      toast.error(error.message || 'Erreur lors de la suppression de l\'utilisateur');
    } finally {
      setLoading(false);
    }
  };

  const filteredProfiles = profiles.filter(profile => {
    const search = searchTerm.toLowerCase();
    const matchesSearch = (
      profile.full_name.toLowerCase().includes(search) ||
      profile.email.toLowerCase().includes(search) ||
      (profile.nickname && profile.nickname.toLowerCase().includes(search)) ||
      (profile.phone && profile.phone.includes(search)) ||
      profile.id.toLowerCase().includes(search)
    );

    const matchesRole = filterRole === 'all' || profile.role === filterRole;
    const matchesPlan = filterPlan === 'all' || profile.subscription?.plan_type === filterPlan;

    // Filter by expiry status
    let matchesExpiry = true;
    if (filterExpiry !== 'all' && profile.subscription?.expires_at) {
      const expiresAt = new Date(profile.subscription.expires_at);
      const now = new Date();
      const daysUntilExpiry = Math.ceil((expiresAt.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
      
      if (filterExpiry === 'expiring_soon') {
        matchesExpiry = daysUntilExpiry <= 7 && daysUntilExpiry > 0;
      } else if (filterExpiry === 'expired') {
        matchesExpiry = daysUntilExpiry < 0;
      }
    } else if (filterExpiry !== 'all') {
      matchesExpiry = false;
    }

    return matchesSearch && matchesRole && matchesPlan && matchesExpiry;
  });

  // Pagination
  const totalPages = Math.ceil(filteredProfiles.length / itemsPerPage);
  const paginatedProfiles = filteredProfiles.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('fr-FR', {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col">
      <ScrollToTop />
      <Navbar />
      <main className="flex-grow pt-20 bg-gradient-to-b from-background to-muted/20 p-4 md:p-8">
        <div className="max-w-7xl mx-auto">
          {/* Header avec flèche retour */}
          <div className="mb-6 flex items-start gap-3">
            <button
              onClick={() => navigate('/dashboard')}
              className="bg-[#FF9900] hover:bg-[#FF9900]/90 p-2 rounded-full shadow-lg transition-all shrink-0 mt-1"
              aria-label="Retour"
            >
              <ArrowLeft className="w-5 h-5 text-white" />
            </button>
            
            <div className="flex-1">
              <h1 className="text-4xl font-bold bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent mb-2">
                Gestion des Profils
              </h1>
              <p className="text-muted-foreground">
                Vue d'ensemble de tous les profils utilisateurs
              </p>
            </div>
          </div>

          {/* Search & Filters */}
          <Card className="mb-6">
            <CardContent className="pt-6">
              <div className="grid gap-4 md:grid-cols-4">
                <div className="md:col-span-1">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                    <Input
                      type="text"
                      placeholder="Rechercher..."
                      value={searchTerm}
                      onChange={(e) => {
                        setSearchTerm(e.target.value);
                        setCurrentPage(1);
                      }}
                      className="pl-10"
                    />
                  </div>
                </div>
                
                <div>
                  <Select value={filterRole} onValueChange={(value) => {
                    setFilterRole(value);
                    setCurrentPage(1);
                  }}>
                    <SelectTrigger>
                      <SelectValue placeholder="Filtrer par rôle" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">Tous les rôles</SelectItem>
                      <SelectItem value="admin">Administrateurs</SelectItem>
                      <SelectItem value="user">Utilisateurs</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Select value={filterPlan} onValueChange={(value) => {
                    setFilterPlan(value);
                    setCurrentPage(1);
                  }}>
                    <SelectTrigger>
                      <SelectValue placeholder="Filtrer par plan" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">Tous les plans</SelectItem>
                      <SelectItem value="vip">VIP</SelectItem>
                      <SelectItem value="free">Gratuit</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Select value={filterExpiry} onValueChange={(value) => {
                    setFilterExpiry(value);
                    setCurrentPage(1);
                  }}>
                    <SelectTrigger>
                      <SelectValue placeholder="Filtrer par expiration" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">Toutes les expirations</SelectItem>
                      <SelectItem value="expiring_soon">Expire bientôt (7j)</SelectItem>
                      <SelectItem value="expired">Expirés</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Stats */}
          <div className="grid grid-cols-1 md:grid-cols-5 gap-4 mb-6">
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-medium flex items-center gap-2">
                  <Users className="w-4 h-4 text-primary" />
                  Total
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{filteredProfiles.length}</div>
                <p className="text-xs text-muted-foreground">sur {profiles.length}</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-medium flex items-center gap-2">
                  <Crown className="w-4 h-4 text-primary" />
                  VIP Actifs
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {profiles.filter(p => p.subscription?.plan_type === 'vip' && p.subscription?.status === 'active').length}
                </div>
              </CardContent>
            </Card>

            <Card className="border-orange-200 dark:border-orange-800">
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-medium flex items-center gap-2">
                  <Clock className="w-4 h-4 text-orange-500" />
                  Expire bientôt
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-orange-500">
                  {profiles.filter(p => {
                    if (!p.subscription?.expires_at) return false;
                    const expiresAt = new Date(p.subscription.expires_at);
                    const now = new Date();
                    const daysUntilExpiry = Math.ceil((expiresAt.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
                    return daysUntilExpiry <= 7 && daysUntilExpiry > 0;
                  }).length}
                </div>
                <p className="text-xs text-muted-foreground">dans 7 jours</p>
              </CardContent>
            </Card>

            <Card className="border-red-200 dark:border-red-800">
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-medium flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 text-red-500" />
                  Expirés
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-red-500">
                  {profiles.filter(p => {
                    if (!p.subscription?.expires_at) return false;
                    const expiresAt = new Date(p.subscription.expires_at);
                    const now = new Date();
                    return expiresAt < now && p.subscription.plan_type === 'vip';
                  }).length}
                </div>
                <p className="text-xs text-muted-foreground">à traiter</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-medium flex items-center gap-2">
                  <Shield className="w-4 h-4 text-primary" />
                  Admins
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {profiles.filter(p => p.role === 'admin').length}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Profiles Table */}
          <Card>
            <CardContent className="p-0">
              {paginatedProfiles.length === 0 ? (
                <div className="p-12 text-center">
                  <Users className="w-12 h-12 mx-auto mb-4 text-muted-foreground opacity-50" />
                  <p className="text-muted-foreground">
                    {searchTerm || filterRole !== 'all' || filterPlan !== 'all' 
                      ? 'Aucun profil trouvé avec ces critères' 
                      : 'Aucun profil disponible'}
                  </p>
                </div>
              ) : (
                <>
                  <div className="overflow-x-auto">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Utilisateur</TableHead>
                          <TableHead>Contact</TableHead>
                          <TableHead>Statut</TableHead>
                          <TableHead>Plan</TableHead>
                          <TableHead>Expiration</TableHead>
                          <TableHead>Inscrit</TableHead>
                          <TableHead className="text-right">Actions</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {paginatedProfiles.map((profile) => (
                          <TableRow key={profile.id}>
                            <TableCell>
                              <div className="flex items-center gap-3">
                                <div className="bg-primary/10 p-2 rounded-full">
                                  <Users className="w-4 h-4 text-primary" />
                                </div>
                                <div>
                                  <div className="font-semibold flex items-center gap-2">
                                    {profile.full_name}
                                    {profile.role === 'admin' && (
                                      <Badge variant="destructive" className="text-xs">
                                        <Shield className="w-3 h-3 mr-1" />
                                        Admin
                                      </Badge>
                                    )}
                                  </div>
                                  {profile.nickname && (
                                    <div className="text-xs text-muted-foreground">
                                      @{profile.nickname}
                                    </div>
                                  )}
                                </div>
                              </div>
                            </TableCell>
                            <TableCell>
                              <div className="space-y-1 text-sm">
                                <div className="flex items-center gap-2">
                                  <Mail className="w-3 h-3 text-muted-foreground" />
                                  <span className="truncate max-w-[200px]">{profile.email}</span>
                                </div>
                                {profile.phone && (
                                  <div className="flex items-center gap-2">
                                    <Phone className="w-3 h-3 text-muted-foreground" />
                                    <span>{profile.phone}</span>
                                  </div>
                                )}
                              </div>
                            </TableCell>
                            <TableCell>
                              {profile.subscription?.status === 'active' ? (
                                <Badge variant="default" className="bg-green-500">Actif</Badge>
                              ) : profile.subscription?.status === 'canceled' ? (
                                <Badge variant="secondary">Annulé</Badge>
                              ) : (
                                <Badge variant="outline">Expiré</Badge>
                              )}
                            </TableCell>
                            <TableCell>
                              {profile.subscription?.plan_type === 'vip' ? (
                                <Badge className="bg-[#FF9900] hover:bg-[#FF9900]/90">
                                  <Crown className="w-3 h-3 mr-1" />
                                  VIP
                                </Badge>
                              ) : (
                                <Badge variant="outline">Gratuit</Badge>
                              )}
                            </TableCell>
                            <TableCell>
                              {profile.subscription?.expires_at ? (
                                (() => {
                                  const expiresAt = new Date(profile.subscription.expires_at);
                                  const now = new Date();
                                  const daysUntilExpiry = Math.ceil((expiresAt.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
                                  
                                  if (daysUntilExpiry < 0) {
                                    return (
                                      <div className="flex items-center gap-2">
                                        <AlertCircle className="w-4 h-4 text-red-500" />
                                        <div>
                                          <div className="text-sm font-medium text-red-500">Expiré</div>
                                          <div className="text-xs text-muted-foreground">
                                            {expiresAt.toLocaleDateString('fr-FR')}
                                          </div>
                                        </div>
                                      </div>
                                    );
                                  } else if (daysUntilExpiry <= 7) {
                                    return (
                                      <div className="flex items-center gap-2">
                                        <Clock className="w-4 h-4 text-orange-500" />
                                        <div>
                                          <div className="text-sm font-medium text-orange-500">
                                            {daysUntilExpiry} jour{daysUntilExpiry > 1 ? 's' : ''}
                                          </div>
                                          <div className="text-xs text-muted-foreground">
                                            {expiresAt.toLocaleDateString('fr-FR')}
                                          </div>
                                        </div>
                                      </div>
                                    );
                                  } else {
                                    return (
                                      <div className="flex items-center gap-2">
                                        <Calendar className="w-4 h-4 text-muted-foreground" />
                                        <div>
                                          <div className="text-sm">
                                            {daysUntilExpiry} jours
                                          </div>
                                          <div className="text-xs text-muted-foreground">
                                            {expiresAt.toLocaleDateString('fr-FR')}
                                          </div>
                                        </div>
                                      </div>
                                    );
                                  }
                                })()
                              ) : (
                                <span className="text-sm text-muted-foreground">-</span>
                              )}
                            </TableCell>
                            <TableCell>
                              <div className="text-sm text-muted-foreground">
                                {formatDate(profile.created_at)}
                              </div>
                            </TableCell>
                            <TableCell className="text-right">
                              <div className="flex gap-2 justify-end">
                                <Button
                                  size="sm"
                                  variant="outline"
                                  onClick={() => handleContactUser(profile.id)}
                                  className="gap-2"
                                >
                                  <MessageCircle className="w-4 h-4" />
                                  Contact
                                </Button>
                                {profile.role !== 'admin' && (
                                  <Button
                                    size="sm"
                                    variant="destructive"
                                    onClick={() => handleDeleteUser(profile.id, profile.email)}
                                    className="gap-2"
                                    disabled={loading}
                                  >
                                    <Trash2 className="w-4 h-4" />
                                    Supprimer
                                  </Button>
                                )}
                              </div>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </div>

                  {/* Pagination */}
                  {totalPages > 1 && (
                    <div className="flex items-center justify-between p-4 border-t">
                      <div className="text-sm text-muted-foreground">
                        Page {currentPage} sur {totalPages} ({filteredProfiles.length} résultat{filteredProfiles.length > 1 ? 's' : ''})
                      </div>
                      <div className="flex gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                          disabled={currentPage === 1}
                        >
                          <ChevronLeft className="w-4 h-4" />
                          Précédent
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
                          disabled={currentPage === totalPages}
                        >
                          Suivant
                          <ChevronRight className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  )}
                </>
              )}
            </CardContent>
          </Card>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default AdminProfiles;
