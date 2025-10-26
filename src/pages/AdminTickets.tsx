import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/hooks/use-auth';
import { useAdmin } from '@/hooks/use-admin';
import { supabase } from '@/integrations/supabase/client';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Loader2, MessageSquare, X, Search, ShoppingCart, BookOpen, Settings, Truck, Bell, Package, AlertCircle, Clock, CheckCircle2, Sparkles } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

const AdminTickets = () => {
  const { user } = useAuth();
  const { isAdmin, isLoading: isAdminLoading } = useAdmin();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [tickets, setTickets] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [unreadCounts, setUnreadCounts] = useState<Record<string, number>>({});
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedPriority, setSelectedPriority] = useState<string>('all');

  useEffect(() => {
    if (!user) {
      navigate('/auth');
      return;
    }

    if (!isAdminLoading && !isAdmin) {
      toast({
        title: "Accès refusé",
        description: "Vous n'avez pas les permissions nécessaires",
        variant: "destructive",
      });
      navigate('/dashboard');
      return;
    }

    if (isAdmin) {
      loadTickets();
      
      const ticketsChannel = supabase
        .channel('admin-tickets')
        .on(
          'postgres_changes',
          {
            event: '*',
            schema: 'public',
            table: 'tickets'
          },
          () => {
            loadTickets();
          }
        )
        .subscribe();

      const messagesChannel = supabase
        .channel('admin-messages')
        .on(
          'postgres_changes',
          {
            event: 'INSERT',
            schema: 'public',
            table: 'messages'
          },
          (payload) => {
            // Notify admin of new user message
            toast({
              title: "Nouveau message",
              description: "Un utilisateur a envoyé un message",
            });
            loadTickets();
          }
        )
        .subscribe();

      return () => {
        supabase.removeChannel(ticketsChannel);
        supabase.removeChannel(messagesChannel);
      };
    }
  }, [user, isAdmin, isAdminLoading, navigate]);

  const loadTickets = async () => {
    try {
      // First get all tickets
      const { data: ticketsData, error: ticketsError } = await supabase
        .from('tickets')
        .select('*')
        .order('created_at', { ascending: false });

      if (ticketsError) throw ticketsError;

      // Then get all profiles for these tickets
      const userIds = [...new Set(ticketsData?.map(t => t.user_id) || [])];
      
      let profilesData: any[] = [];
      if (userIds.length > 0) {
        const { data, error: profilesError } = await supabase
          .from('profiles')
          .select('id, full_name, email')
          .in('id', userIds);
        
        if (profilesError) {
          console.error('Error loading profiles:', profilesError);
        } else {
          profilesData = data || [];
        }
      }

      // Merge tickets with profiles
      const ticketsWithProfiles = ticketsData?.map(ticket => ({
        ...ticket,
        profiles: profilesData.find(p => p.id === ticket.user_id) || null
      })) || [];

      setTickets(ticketsWithProfiles);

      // Load unread counts for each ticket
      if (user) {
        const counts: Record<string, number> = {};
        for (const ticket of ticketsWithProfiles) {
          const { data: countData } = await supabase
            .rpc('get_unread_count', { 
              ticket_id_param: ticket.id, 
              user_id_param: user.id 
            });
          counts[ticket.id] = countData || 0;
        }
        setUnreadCounts(counts);
      }
    } catch (error) {
      console.error('Error loading tickets:', error);
      toast({
        title: "Erreur",
        description: "Impossible de charger les tickets",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const getStatusBadge = (status: string) => {
    const variants: Record<string, any> = {
      open: 'default',
      in_progress: 'secondary',
      closed: 'outline'
    };
    return <Badge variant={variants[status] || 'default'}>{status}</Badge>;
  };

  const getPriorityBadge = (priority: string) => {
    const colors: Record<string, string> = {
      low: 'bg-blue-500',
      normal: 'bg-green-500',
      high: 'bg-orange-500',
      urgent: 'bg-red-500'
    };
    return (
      <Badge className={colors[priority] || 'bg-gray-500'}>
        {priority}
      </Badge>
    );
  };

  const filterTickets = (status?: string) => {
    let filtered = tickets;
    
    // Filter by status
    if (status) {
      filtered = filtered.filter(t => t.status === status);
    }
    
    // Filter by category
    if (selectedCategory !== 'all') {
      filtered = filtered.filter(t => t.category === selectedCategory);
    }
    
    // Filter by priority
    if (selectedPriority !== 'all') {
      filtered = filtered.filter(t => t.priority === selectedPriority);
    }
    
    // Filter by search query
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(t => 
        t.subject?.toLowerCase().includes(query) ||
        t.profiles?.full_name?.toLowerCase().includes(query) ||
        t.profiles?.email?.toLowerCase().includes(query) ||
        t.subcategory?.toLowerCase().includes(query)
      );
    }
    
    return filtered;
  };

  const getCategoryStats = () => {
    const stats: Record<string, { total: number; unread: number; icon: any }> = {
      introduction: { total: 0, unread: 0, icon: BookOpen },
      outils: { total: 0, unread: 0, icon: Settings },
      expedition: { total: 0, unread: 0, icon: Truck },
      informations: { total: 0, unread: 0, icon: Bell },
      marketplace: { total: 0, unread: 0, icon: ShoppingCart },
      gestion_produit: { total: 0, unread: 0, icon: Package },
      autre: { total: 0, unread: 0, icon: MessageSquare },
    };

    tickets.forEach(ticket => {
      const category = ticket.category || 'autre';
      if (stats[category]) {
        stats[category].total++;
        if (unreadCounts[ticket.id] > 0) {
          stats[category].unread += unreadCounts[ticket.id];
        }
      }
    });

    return stats;
  };

  const getCatalogueProStats = () => {
    const catalogueProTickets = tickets.filter(t => 
      t.category === 'gestion_produit' && t.subcategory === 'catalogue_pro'
    );
    const unreadCatalogueProCount = catalogueProTickets.reduce((sum, ticket) => 
      sum + (unreadCounts[ticket.id] || 0), 0
    );
    return { total: catalogueProTickets.length, unread: unreadCatalogueProCount };
  };

  const getStatusStats = () => {
    const open = tickets.filter(t => t.status === 'open').length;
    const inProgress = tickets.filter(t => t.status === 'in_progress').length;
    const closed = tickets.filter(t => t.status === 'closed').length;
    const totalUnread = Object.values(unreadCounts).reduce((sum, count) => sum + count, 0);

    return { open, inProgress, closed, totalUnread };
  };

  const categoryLabels: Record<string, string> = {
    introduction: 'Introduction',
    outils: 'Outils',
    expedition: 'Expédition',
    informations: 'Informations',
    marketplace: 'Marketplace',
    gestion_produit: 'Gestion Produits',
    autre: 'Autre',
  };

  const closeTicket = async (ticketId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    try {
      const { error } = await supabase
        .from('tickets')
        .update({ 
          status: 'closed',
          closed_at: new Date().toISOString()
        })
        .eq('id', ticketId);

      if (error) throw error;

      toast({
        title: "Ticket fermé",
        description: "Le ticket a été fermé avec succès",
      });
    } catch (error) {
      console.error('Error closing ticket:', error);
      toast({
        title: "Erreur",
        description: "Impossible de fermer le ticket",
        variant: "destructive",
      });
    }
  };

  if (isLoading || isAdminLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  const statusStats = getStatusStats();
  const categoryStats = getCategoryStats();
  const catalogueProStats = getCatalogueProStats();

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-grow pt-20">
        <div className="container mx-auto px-4 py-8 max-w-7xl">
          <div className="mb-8 flex items-center justify-between">
            <div>
              <h1 className="text-4xl font-bold mb-2">Panneau d'Administration</h1>
              <p className="text-muted-foreground">Vue d'ensemble et gestion des tickets</p>
            </div>
            <Button onClick={() => navigate('/admin/alerts')} variant="outline">
              <Sparkles className="w-4 h-4 mr-2" />
              Gérer les alertes produits
            </Button>
          </div>

          {/* Statistiques globales */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
            <Card>
              <CardContent className="pt-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">Ouverts</p>
                    <p className="text-3xl font-bold text-orange-500">{statusStats.open}</p>
                  </div>
                  <AlertCircle className="w-10 h-10 text-orange-500 opacity-20" />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="pt-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">En cours</p>
                    <p className="text-3xl font-bold text-blue-500">{statusStats.inProgress}</p>
                  </div>
                  <Clock className="w-10 h-10 text-blue-500 opacity-20" />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="pt-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">Fermés</p>
                    <p className="text-3xl font-bold text-green-500">{statusStats.closed}</p>
                  </div>
                  <CheckCircle2 className="w-10 h-10 text-green-500 opacity-20" />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="pt-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">Messages non lus</p>
                    <p className="text-3xl font-bold text-red-500">{statusStats.totalUnread}</p>
                  </div>
                  <MessageSquare className="w-10 h-10 text-red-500 opacity-20" />
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Statistiques par catégorie */}
          <Card className="mb-8">
            <CardHeader>
              <CardTitle>Tickets par Catégorie</CardTitle>
              <CardDescription>Répartition des tickets selon les catégories</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                {Object.entries(categoryStats).map(([key, stat]) => {
                  const Icon = stat.icon;
                  return (
                    <div key={key} className="flex items-center justify-between p-4 border rounded-lg hover:bg-accent/50 transition-colors">
                      <div className="flex items-center gap-3">
                        <Icon className="w-5 h-5 text-primary" />
                        <div>
                          <p className="font-medium">{categoryLabels[key]}</p>
                          <p className="text-sm text-muted-foreground">{stat.total} tickets</p>
                        </div>
                      </div>
                      {stat.unread > 0 && (
                        <Badge variant="destructive">{stat.unread}</Badge>
                      )}
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>

          {/* Filtres */}
          <Card className="mb-6">
            <CardContent className="pt-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
                  <Input
                    placeholder="Rechercher..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-10"
                  />
                </div>

                <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                  <SelectTrigger>
                    <SelectValue placeholder="Toutes les catégories" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Toutes les catégories</SelectItem>
                    {Object.entries(categoryLabels).map(([key, label]) => (
                      <SelectItem key={key} value={key}>{label}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>

                <Select value={selectedPriority} onValueChange={setSelectedPriority}>
                  <SelectTrigger>
                    <SelectValue placeholder="Toutes les priorités" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Toutes les priorités</SelectItem>
                    <SelectItem value="low">Basse</SelectItem>
                    <SelectItem value="normal">Normale</SelectItem>
                    <SelectItem value="high">Haute</SelectItem>
                    <SelectItem value="urgent">Urgente</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>

          {/* Notification Banner for Catalogue Pro */}
          {catalogueProStats.unread > 0 && (
            <Card className="mb-6 bg-gradient-to-r from-amber-50 via-amber-50/50 to-transparent dark:from-amber-950/20 dark:via-amber-950/10 dark:to-transparent border-l-4 border-l-amber-500">
              <CardHeader className="pb-3">
                <div className="flex items-start gap-3">
                  <div className="p-2 bg-amber-500/10 rounded-lg">
                    <Package className="w-5 h-5 text-amber-600 dark:text-amber-500" />
                  </div>
                  <div className="flex-1">
                    <CardTitle className="text-base mb-1 text-amber-900 dark:text-amber-100">
                      {catalogueProStats.unread} nouveau{catalogueProStats.unread > 1 ? 'x' : ''} message{catalogueProStats.unread > 1 ? 's' : ''} - Catalogue Pro
                    </CardTitle>
                    <CardDescription className="text-sm text-amber-700 dark:text-amber-300">
                      Catégorie: Gestion Produits • Sous-catégorie: Catalogue Pro
                    </CardDescription>
                  </div>
                </div>
              </CardHeader>
            </Card>
          )}

          {/* Liste des tickets avec onglets */}
          <Tabs defaultValue="open" className="w-full">
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="open">
                <AlertCircle className="w-4 h-4 mr-2" />
                Ouverts ({filterTickets('open').length})
              </TabsTrigger>
              <TabsTrigger value="in_progress">
                <Clock className="w-4 h-4 mr-2" />
                En cours ({filterTickets('in_progress').length})
              </TabsTrigger>
              <TabsTrigger value="closed">
                <CheckCircle2 className="w-4 h-4 mr-2" />
                Fermés ({filterTickets('closed').length})
              </TabsTrigger>
              <TabsTrigger value="all">
                Tous ({filterTickets().length})
              </TabsTrigger>
            </TabsList>

            {['open', 'in_progress', 'closed', 'all'].map((status) => (
              <TabsContent key={status} value={status} className="space-y-3 mt-6">
                {filterTickets(status === 'all' ? undefined : status).length === 0 ? (
                  <Card>
                    <CardContent className="pt-6 text-center">
                      <MessageSquare className="w-12 h-12 mx-auto mb-4 text-muted-foreground" />
                      <p className="text-muted-foreground">Aucun ticket dans cette catégorie</p>
                    </CardContent>
                  </Card>
                ) : (
                  filterTickets(status === 'all' ? undefined : status).map((ticket) => (
                    <Card
                      key={ticket.id}
                      className={`hover:shadow-lg transition-all cursor-pointer border-l-4 ${
                        unreadCounts[ticket.id] > 0 
                          ? 'bg-red-50/50 dark:bg-red-950/10 border-red-500 shadow-md' 
                          : ''
                      }`}
                      style={{
                        borderLeftColor: unreadCounts[ticket.id] > 0 
                          ? '#ef4444' 
                          : ticket.priority === 'urgent' ? '#ef4444' :
                            ticket.priority === 'high' ? '#f97316' :
                            ticket.priority === 'normal' ? '#22c55e' : '#3b82f6'
                      }}
                      onClick={() => navigate(`/ticket/${ticket.id}`)}
                    >
                      <CardHeader className="pb-3">
                        <div className="flex justify-between items-start gap-4">
                          <div className="flex-1">
                            <div className="flex items-center gap-2 flex-wrap mb-2">
                              <CardTitle className="text-lg flex items-center gap-2">
                                {ticket.subject}
                                {unreadCounts[ticket.id] > 0 && (
                                  <span className="w-2 h-2 bg-red-500 rounded-full animate-pulse" title="Messages non lus" />
                                )}
                              </CardTitle>
                              {unreadCounts[ticket.id] > 0 && (
                                <Badge variant="destructive" className="animate-pulse font-bold">
                                  {unreadCounts[ticket.id]} message{unreadCounts[ticket.id] > 1 ? 's' : ''} non lu{unreadCounts[ticket.id] > 1 ? 's' : ''}
                                </Badge>
                              )}
                            </div>
                            
                            <div className="flex items-center gap-2 flex-wrap text-sm">
                              <Badge variant="outline">
                                {categoryLabels[ticket.category] || 'Autre'}
                              </Badge>
                              {ticket.subcategory && (
                                <Badge variant="secondary" className="text-xs">
                                  {ticket.subcategory}
                                </Badge>
                              )}
                              <span className="text-muted-foreground">
                                • {ticket.profiles?.full_name || ticket.profiles?.email || 'Utilisateur'}
                              </span>
                            </div>
                          </div>
                          
                          <div className="flex gap-2 items-center">
                            {getPriorityBadge(ticket.priority)}
                            {getStatusBadge(ticket.status)}
                            {ticket.status !== 'closed' && (
                              <Button
                                variant="ghost"
                                size="icon"
                                onClick={(e) => closeTicket(ticket.id, e)}
                                title="Fermer le ticket"
                                className="hover:bg-destructive/10 hover:text-destructive"
                              >
                                <X className="w-4 h-4" />
                              </Button>
                            )}
                          </div>
                        </div>
                      </CardHeader>
                    </Card>
                  ))
                )}
              </TabsContent>
            ))}
          </Tabs>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default AdminTickets;
