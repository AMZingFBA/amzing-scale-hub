import { useState, useEffect } from 'react';
import { useAuth } from '@/hooks/use-auth';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { Loader2, Users, Mail, Phone, UserCircle, ArrowLeft, Search, Calendar, MessageCircle, Crown, Shield, Filter, ChevronLeft, ChevronRight, Clock, AlertCircle, Trash2, Copy, CheckCircle, RefreshCw, Eye, Bell, BellOff, Activity, Wifi, WifiOff, UserPlus, UserMinus, Building2, Pencil } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import CompanyLookup from '@/components/CompanyLookup';
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
  siren?: string | null;
  company_name?: string | null;
  subscription?: {
    plan_type: string;
    status: string;
    expires_at: string | null;
    is_trial: boolean;
  };
  role?: string;
  last_sign_in_at?: string | null;
  unread_notifications?: number;
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
  const [filterActivity, setFilterActivity] = useState<string>('all');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 20;
  const [copiedText, setCopiedText] = useState<string>('');
  const [syncing, setSyncing] = useState(false);
  const [generatingLink, setGeneratingLink] = useState<string | null>(null);
  const [togglingVip, setTogglingVip] = useState<string | null>(null);
  const [editingSirenProfile, setEditingSirenProfile] = useState<ProfileData | null>(null);
  const [editSiren, setEditSiren] = useState('');
  const [editCompanyName, setEditCompanyName] = useState('');
  const [savingSiren, setSavingSiren] = useState(false);
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
      setLoading(true);

      const { data: sessionData, error: sessionError } = await supabase.auth.getSession();
      if (sessionError) throw sessionError;
      if (!sessionData.session?.access_token) throw new Error('Session expirée');

      const { data, error } = await supabase.functions.invoke('admin-get-profiles', {
        headers: {
          Authorization: `Bearer ${sessionData.session.access_token}`,
        },
      });

      if (error) throw error;

      setProfiles((data?.profiles as ProfileData[]) || []);
    } catch (error: any) {
      console.error('Error loading profiles:', error);
      toast.error('Erreur lors du chargement des profils');
      setProfiles([]);
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

  const copyToClipboard = async (text: string, label: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopiedText(text);
      toast.success(`${label} copié !`);
      setTimeout(() => setCopiedText(''), 2000);
    } catch (error) {
      toast.error('Erreur lors de la copie');
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

  const syncStripePayments = async () => {
    try {
      setSyncing(true);
      toast.info('Synchronisation avec Stripe en cours...');

      const { data, error } = await supabase.functions.invoke('sync-stripe-payments');

      if (error) throw error;

      if (data.success) {
        toast.success(
          `Synchronisation terminée : ${data.summary.subscriptions_updated} abonnements mis à jour, ${data.summary.failed_payments_found} paiements échoués trouvés`
        );

        if (data.failed_payments.length > 0) {
          console.log('[STRIPE-SYNC] Paiements échoués détectés:', data.failed_payments);
        }

        // Recharger les profils
        await loadProfiles();
      } else {
        throw new Error('Erreur lors de la synchronisation');
      }
    } catch (error: any) {
      console.error('Error syncing Stripe:', error);
      toast.error(error.message || 'Erreur lors de la synchronisation avec Stripe');
    } finally {
      setSyncing(false);
    }
  };

  const handleViewAsUser = async (userId: string) => {
    try {
      setGeneratingLink(userId);
      
      const { data: sessionData } = await supabase.auth.getSession();
      if (!sessionData.session?.access_token) {
        toast.error('Session expirée');
        return;
      }

      // Save admin session before impersonating
      localStorage.setItem('admin_original_session', JSON.stringify({
        access_token: sessionData.session.access_token,
        refresh_token: sessionData.session.refresh_token,
        user: sessionData.session.user
      }));

      const { data, error } = await supabase.functions.invoke('admin-impersonation', {
        headers: {
          Authorization: `Bearer ${sessionData.session.access_token}`,
        },
        body: { action: 'impersonate', targetUserId: userId }
      });

      if (error || !data.success) {
        localStorage.removeItem('admin_original_session');
        toast.error(data?.error || 'Erreur lors de l\'impersonation');
        return;
      }

      // The actionLink is a magic link that will log in as the user
      if (data.actionLink) {
        toast.success('Connexion en tant que ' + data.user.email + ' en cours...');
        // Redirect to the magic link - this will create a real session for the target user
        window.location.href = data.actionLink;
      } else {
        localStorage.removeItem('admin_original_session');
        toast.error('Erreur: lien de connexion non généré');
      }
    } catch (error: any) {
      console.error('Error impersonating user:', error);
      localStorage.removeItem('admin_original_session');
      toast.error('Erreur lors de l\'impersonation');
    } finally {
      setGeneratingLink(null);
    }
  };

  const handleToggleVip = async (userId: string, userEmail: string, currentlyVip: boolean) => {
    const action = currentlyVip ? 'revoke' : 'grant';
    const confirmMsg = currentlyVip
      ? `Retirer le VIP de ${userEmail} ?`
      : `Accorder le VIP à ${userEmail} pour 12 mois ?`;

    if (!confirm(confirmMsg)) return;

    try {
      setTogglingVip(userId);

      const { data: sessionData } = await supabase.auth.getSession();
      if (!sessionData.session?.access_token) {
        toast.error('Session expirée');
        return;
      }

      const { data, error } = await supabase.functions.invoke('admin-toggle-vip', {
        headers: { Authorization: `Bearer ${sessionData.session.access_token}` },
        body: { userId, action },
      });

      if (error) throw error;

      toast.success(currentlyVip ? `VIP retiré pour ${userEmail}` : `VIP accordé à ${userEmail}`);
      await loadProfiles();
    } catch (error: any) {
      console.error('Error toggling VIP:', error);
      toast.error(error.message || 'Erreur lors de la modification du VIP');
    } finally {
      setTogglingVip(null);
    }
  };
  const handleSaveSiren = async () => {
    if (!editingSirenProfile) return;
    try {
      setSavingSiren(true);
      const { error } = await supabase
        .from('profiles')
        .update({ siren: editSiren || null, company_name: editCompanyName || null })
        .eq('id', editingSirenProfile.id);
      if (error) throw error;
      toast.success('SIREN mis à jour');
      setEditingSirenProfile(null);
      await loadProfiles();
    } catch (error: any) {
      console.error('Error updating SIREN:', error);
      toast.error('Erreur lors de la mise à jour du SIREN');
    } finally {
      setSavingSiren(false);
    }
  };

  const now = new Date();

  const getActivityStatus = (lastSignIn: string | null | undefined) => {
    if (!lastSignIn) return { label: 'Jamais connecté', color: 'text-muted-foreground', icon: WifiOff, bg: 'bg-muted' };
    const last = new Date(lastSignIn);
    const diffDays = Math.floor((now.getTime() - last.getTime()) / (1000 * 60 * 60 * 24));
    if (diffDays <= 3) return { label: 'Actif', color: 'text-green-500', icon: Wifi, bg: 'bg-green-500/10' };
    if (diffDays <= 14) return { label: 'Récent', color: 'text-blue-500', icon: Activity, bg: 'bg-blue-500/10' };
    if (diffDays <= 30) return { label: 'Inactif', color: 'text-orange-500', icon: Clock, bg: 'bg-orange-500/10' };
    return { label: 'Dormant', color: 'text-red-500', icon: WifiOff, bg: 'bg-red-500/10' };
  };

  const formatRelativeDate = (dateString: string | null | undefined) => {
    if (!dateString) return 'Jamais';
    const date = new Date(dateString);
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / (1000 * 60));
    const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));
    
    if (diffMins < 1) return "À l'instant";
    if (diffMins < 60) return `Il y a ${diffMins} min`;
    if (diffHours < 24) return `Il y a ${diffHours}h`;
    if (diffDays === 1) return 'Hier';
    if (diffDays < 7) return `Il y a ${diffDays} jours`;
    if (diffDays < 30) return `Il y a ${Math.floor(diffDays / 7)} sem.`;
    return date.toLocaleDateString('fr-FR', { day: 'numeric', month: 'short' });
  };

  const isVipActive = (sub?: ProfileData['subscription']) => {
    if (!sub) return false;
    const validUntil = !sub.expires_at || new Date(sub.expires_at) > now;
    return sub.plan_type === 'vip' && (sub.status === 'active' || sub.status === 'canceled') && validUntil;
  };

  const isExpiringSoon = (sub?: ProfileData['subscription']) => {
    if (!isVipActive(sub) || !sub?.expires_at) return false;
    const expiresAt = new Date(sub.expires_at);
    const daysUntilExpiry = Math.ceil((expiresAt.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
    return daysUntilExpiry <= 7 && daysUntilExpiry > 0;
  };

  const isExpired = (sub?: ProfileData['subscription']) => {
    if (!sub?.expires_at) return false;
    return new Date(sub.expires_at) < now && sub.status !== 'unpaid';
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
    const matchesPlan = filterPlan === 'all' || 
      (filterPlan === 'unpaid' ? profile.subscription?.status === 'unpaid' : profile.subscription?.plan_type === filterPlan);

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

    // Filter by activity
    let matchesActivity = true;
    if (filterActivity !== 'all') {
      const activity = getActivityStatus(profile.last_sign_in_at);
      if (filterActivity === 'active') matchesActivity = activity.label === 'Actif';
      else if (filterActivity === 'recent') matchesActivity = activity.label === 'Récent';
      else if (filterActivity === 'inactive') matchesActivity = activity.label === 'Inactif';
      else if (filterActivity === 'dormant') matchesActivity = activity.label === 'Dormant';
      else if (filterActivity === 'never') matchesActivity = activity.label === 'Jamais connecté';
    }

    return matchesSearch && matchesRole && matchesPlan && matchesExpiry && matchesActivity;
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
          <div className="mb-6">
            <div className="flex items-start gap-3 mb-4">
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

            <div className="flex gap-2">
              {filterPlan === 'unpaid' && (
                <Button
                  variant="outline"
                  onClick={() => {
                    setFilterPlan('all');
                    setCurrentPage(1);
                  }}
                  className="gap-2 w-full sm:w-auto"
                >
                  <ArrowLeft className="w-4 h-4" />
                  Retour
                </Button>
              )}
              <Button
                onClick={syncStripePayments}
                disabled={syncing}
                variant="outline"
                className="gap-2 w-full sm:w-auto"
              >
                {syncing ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    Synchronisation en cours...
                  </>
                ) : (
                  <>
                    <RefreshCw className="w-4 h-4" />
                    Synchroniser avec Stripe
                  </>
                )}
              </Button>
            </div>
          </div>

          {/* Search & Filters */}
          <Card className="mb-6">
            <CardContent className="pt-6">
              <div className="grid gap-4 md:grid-cols-5">
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
                      <SelectItem value="unpaid">Paiements échoués</SelectItem>
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

                <div>
                  <Select value={filterActivity} onValueChange={(value) => {
                    setFilterActivity(value);
                    setCurrentPage(1);
                  }}>
                    <SelectTrigger>
                      <SelectValue placeholder="Filtrer par activité" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">Toutes les activités</SelectItem>
                      <SelectItem value="active">Actifs (3j)</SelectItem>
                      <SelectItem value="recent">Récents (14j)</SelectItem>
                      <SelectItem value="inactive">Inactifs (30j)</SelectItem>
                      <SelectItem value="dormant">Dormants (+30j)</SelectItem>
                      <SelectItem value="never">Jamais connectés</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Stats */}
          <div className="grid grid-cols-1 md:grid-cols-6 gap-4 mb-6">
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
                <div className="text-2xl font-bold">{profiles.filter((p) => isVipActive(p.subscription)).length}</div>
              </CardContent>
            </Card>

            <Card className="border-orange-200 dark:border-orange-800">
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-medium flex items-center gap-2">
                  <Clock className="w-4 h-4 text-orange-500" />
                  Anciens VIP
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-orange-500">
                  {profiles.filter((p) => p.subscription?.status === 'canceled').length}
                </div>
                <p className="text-xs text-muted-foreground">ont résilié</p>
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
                  {profiles.filter((p) => isExpiringSoon(p.subscription)).length}
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
                  {profiles.filter((p) => isExpired(p.subscription)).length}
                </div>
                <p className="text-xs text-muted-foreground">à traiter</p>
              </CardContent>
            </Card>

            <Card
              className="border-red-200 dark:border-red-800 cursor-pointer hover:shadow-md transition-shadow"
              onClick={() => {
                setFilterPlan('unpaid');
                setCurrentPage(1);
              }}
            >
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-medium flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 text-red-500" />
                  Paiements échoués
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-red-500">
                  {profiles.filter((p) => p.subscription?.status === 'unpaid').length}
                </div>
                <p className="text-xs text-muted-foreground">cliquez pour filtrer</p>
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
                          <TableHead>SIREN / Société</TableHead>
                          <TableHead>Activité</TableHead>
                          <TableHead>Notifications</TableHead>
                          <TableHead>Abonnement</TableHead>
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
                                  <button
                                    onClick={() => copyToClipboard(profile.email, 'Email')}
                                    className="truncate max-w-[200px] hover:text-primary transition-colors flex items-center gap-1 group"
                                  >
                                    <span>{profile.email}</span>
                                    {copiedText === profile.email ? (
                                      <CheckCircle className="w-3 h-3 text-green-500" />
                                    ) : (
                                      <Copy className="w-3 h-3 opacity-0 group-hover:opacity-100 transition-opacity" />
                                    )}
                                  </button>
                                </div>
                                <div className="flex items-center gap-2">
                                  <Phone className="w-3 h-3 text-muted-foreground" />
                                  {profile.phone ? (
                                    <button
                                      onClick={() => copyToClipboard(profile.phone!, 'Téléphone')}
                                      className="hover:text-primary transition-colors flex items-center gap-1 group"
                                    >
                                      <span>{profile.phone}</span>
                                      {copiedText === profile.phone ? (
                                        <CheckCircle className="w-3 h-3 text-green-500" />
                                      ) : (
                                        <Copy className="w-3 h-3 opacity-0 group-hover:opacity-100 transition-opacity" />
                                      )}
                                    </button>
                                  ) : (
                                    <span className="text-muted-foreground italic text-xs">Non renseigné</span>
                                  )}
                                </div>
                              </div>
                            </TableCell>
                            <TableCell>
                              <div className="flex items-center gap-2">
                                <div className="min-w-0">
                                  {profile.siren ? (
                                    <div>
                                      <div className="text-sm font-mono">{profile.siren}</div>
                                      {profile.company_name && (
                                        <div className="text-xs text-muted-foreground truncate max-w-[150px]">{profile.company_name}</div>
                                      )}
                                    </div>
                                  ) : (
                                    <span className="text-xs text-muted-foreground italic">Non renseigné</span>
                                  )}
                                </div>
                                <Button
                                  size="icon"
                                  variant="ghost"
                                  className="h-7 w-7 shrink-0"
                                  onClick={() => {
                                    setEditingSirenProfile(profile);
                                    setEditSiren(profile.siren || '');
                                    setEditCompanyName(profile.company_name || '');
                                  }}
                                >
                                  <Pencil className="w-3 h-3" />
                                </Button>
                              </div>
                            </TableCell>
                            <TableCell>
                              {(() => {
                                const activity = getActivityStatus(profile.last_sign_in_at);
                                const ActivityIcon = activity.icon;
                                return (
                                  <div className="flex flex-col gap-1">
                                    <div className={`inline-flex items-center gap-1.5 px-2 py-1 rounded-full text-xs font-medium ${activity.bg} ${activity.color} w-fit`}>
                                      <ActivityIcon className="w-3 h-3" />
                                      {activity.label}
                                    </div>
                                    <span className="text-xs text-muted-foreground">
                                      {formatRelativeDate(profile.last_sign_in_at)}
                                    </span>
                                  </div>
                                );
                              })()}
                            </TableCell>
                            <TableCell>
                              <div className="flex items-center gap-2">
                                {(profile.unread_notifications ?? 0) > 0 ? (
                                  <div className="flex items-center gap-1.5">
                                    <Bell className="w-4 h-4 text-orange-500" />
                                    <span className="text-sm font-semibold text-orange-500">
                                      {profile.unread_notifications}
                                    </span>
                                    <span className="text-xs text-muted-foreground">non lues</span>
                                  </div>
                                ) : (
                                  <div className="flex items-center gap-1.5 text-muted-foreground">
                                    <BellOff className="w-4 h-4" />
                                    <span className="text-xs">Tout lu</span>
                                  </div>
                                )}
                              </div>
                            </TableCell>
                            <TableCell>
                              <div className="flex flex-col gap-1">
                                {(() => {
                                  const sub = profile.subscription;

                                  if (!sub) {
                                    return <Badge variant="outline">Gratuit</Badge>;
                                  }

                                  if (sub.status === 'unpaid') {
                                    return (
                                      <Badge variant="destructive">
                                        <AlertCircle className="w-3 h-3 mr-1" />
                                        Paiement échoué
                                      </Badge>
                                    );
                                  }

                                  const hasVipAccess =
                                    sub.plan_type === 'vip' &&
                                    (sub.status === 'active' || sub.status === 'canceled') &&
                                    (!sub.expires_at || new Date(sub.expires_at) > now);

                                  if (hasVipAccess) {
                                    if (sub.status === 'canceled') {
                                      return (
                                        <Badge variant="secondary">
                                          <Crown className="w-3 h-3 mr-1" />
                                          VIP Annulé
                                        </Badge>
                                      );
                                    }

                                    return (
                                      <Badge className="bg-green-500 hover:bg-green-600">
                                        <Crown className="w-3 h-3 mr-1" />
                                        VIP Actif
                                      </Badge>
                                    );
                                  }

                                  if (sub.expires_at && new Date(sub.expires_at) <= now) {
                                    return (
                                      <Badge variant="outline" className="text-red-500 border-red-500">
                                        <Crown className="w-3 h-3 mr-1" />
                                        VIP Expiré
                                      </Badge>
                                    );
                                  }

                                  if (sub.status === 'canceled' || sub.status === 'expired' || sub.expires_at) {
                                    return (
                                      <div className="flex flex-col gap-1">
                                        <Badge variant="outline">Gratuit</Badge>
                                        <Badge variant="outline" className="text-orange-500 border-orange-500">
                                          <Clock className="w-3 h-3 mr-1" />
                                          Ancien VIP
                                        </Badge>
                                      </div>
                                    );
                                  }

                                  return <Badge variant="outline">Gratuit</Badge>;
                                })()}
                              </div>
                            </TableCell>
                            <TableCell>
                              {profile.subscription?.expires_at ? (
                                (() => {
                                  const expiresAt = new Date(profile.subscription.expires_at);
                                  const now = new Date();
                                  const daysUntilExpiry = Math.ceil((expiresAt.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
                                  const daysSinceExpiry = Math.abs(daysUntilExpiry);
                                  
                                  // Affichage spécifique pour paiements échoués
                                  if (profile.subscription?.status === 'unpaid') {
                                    return (
                                      <div className="flex items-center gap-2">
                                        <AlertCircle className="w-4 h-4 text-red-500" />
                                        <div>
                                          <div className="text-sm font-medium text-red-500">
                                            Paiement refusé
                                          </div>
                                          <div className="text-xs text-muted-foreground">
                                            Le {expiresAt.toLocaleDateString('fr-FR')}
                                          </div>
                                        </div>
                                      </div>
                                    );
                                  }
                                  
                                  if (daysUntilExpiry < 0) {
                                    return (
                                      <div className="flex items-center gap-2">
                                        <AlertCircle className="w-4 h-4 text-red-500" />
                                        <div>
                                          <div className="text-sm font-medium text-red-500">
                                            {profile.subscription?.status === 'canceled' || profile.subscription?.status === 'expired' ? 'Résilié' : 'Expiré'}
                                          </div>
                                          <div className="text-xs text-muted-foreground">
                                            Il y a {daysSinceExpiry} jour{daysSinceExpiry > 1 ? 's' : ''}
                                          </div>
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
                              <div className="flex gap-2 justify-end flex-wrap">
                                <Button
                                  size="sm"
                                  variant="secondary"
                                  onClick={() => handleViewAsUser(profile.id)}
                                  className="gap-2"
                                  disabled={generatingLink === profile.id}
                                  title="Voir ce que voit l'utilisateur (lien valide 5 min)"
                                >
                                  {generatingLink === profile.id ? (
                                    <Loader2 className="w-4 h-4 animate-spin" />
                                  ) : (
                                    <Eye className="w-4 h-4" />
                                  )}
                                  Voir
                                </Button>
                                <Button
                                  size="sm"
                                  variant="outline"
                                  onClick={() => handleContactUser(profile.id)}
                                  className="gap-2"
                                >
                                  <MessageCircle className="w-4 h-4" />
                                  Contact
                                </Button>
                                {profile.role !== 'admin' && (() => {
                                  const vipActive = isVipActive(profile.subscription);
                                  return (
                                    <Button
                                      size="sm"
                                      variant={vipActive ? "outline" : "default"}
                                      onClick={() => handleToggleVip(profile.id, profile.email, vipActive)}
                                      className={`gap-2 ${vipActive ? 'border-red-500 text-red-500 hover:bg-red-50 dark:hover:bg-red-950' : ''}`}
                                      disabled={togglingVip === profile.id}
                                    >
                                      {togglingVip === profile.id ? (
                                        <Loader2 className="w-4 h-4 animate-spin" />
                                      ) : vipActive ? (
                                        <UserMinus className="w-4 h-4" />
                                      ) : (
                                        <UserPlus className="w-4 h-4" />
                                      )}
                                      {vipActive ? 'Retirer VIP' : 'Donner VIP'}
                                    </Button>
                                  );
                                })()}
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

      {/* Dialog édition SIREN */}
      <Dialog open={!!editingSirenProfile} onOpenChange={(open) => !open && setEditingSirenProfile(null)}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Building2 className="w-5 h-5" />
              Modifier le SIREN — {editingSirenProfile?.full_name}
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <CompanyLookup
              onSelect={(siren, companyName) => {
                setEditSiren(siren);
                setEditCompanyName(companyName);
              }}
              defaultSiren={editSiren}
              defaultCompanyName={editCompanyName}
            />
            <div className="flex justify-end gap-2">
              <Button variant="outline" onClick={() => setEditingSirenProfile(null)}>
                Annuler
              </Button>
              <Button onClick={handleSaveSiren} disabled={savingSiren}>
                {savingSiren ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : null}
                Enregistrer
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      <Footer />
    </div>
  );
};

export default AdminProfiles;
