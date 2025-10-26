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
import { Loader2, MessageSquare, X } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const AdminTickets = () => {
  const { user } = useAuth();
  const { isAdmin, isLoading: isAdminLoading } = useAdmin();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [tickets, setTickets] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

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
      
      const channel = supabase
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

      return () => {
        supabase.removeChannel(channel);
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
    if (!status) return tickets;
    return tickets.filter(t => t.status === status);
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

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-grow pt-20">
        <div className="container mx-auto px-4 py-8 max-w-6xl">
          <h1 className="text-4xl font-bold mb-2">Administration - Tickets</h1>
          <p className="text-muted-foreground mb-8">
            Gérez tous les tickets de support
          </p>

          <Tabs defaultValue="all" className="w-full">
            <TabsList>
              <TabsTrigger value="all">
                Tous ({tickets.length})
              </TabsTrigger>
              <TabsTrigger value="open">
                Ouverts ({filterTickets('open').length})
              </TabsTrigger>
              <TabsTrigger value="in_progress">
                En cours ({filterTickets('in_progress').length})
              </TabsTrigger>
              <TabsTrigger value="closed">
                Fermés ({filterTickets('closed').length})
              </TabsTrigger>
            </TabsList>

            <TabsContent value="all" className="space-y-4 mt-6">
              {tickets.length === 0 ? (
                <Card>
                  <CardContent className="pt-6 text-center">
                    <MessageSquare className="w-12 h-12 mx-auto mb-4 text-muted-foreground" />
                    <p className="text-muted-foreground">
                      Aucun ticket pour le moment
                    </p>
                  </CardContent>
                </Card>
              ) : (
                tickets.map((ticket) => (
                  <Card
                    key={ticket.id}
                    className="hover:shadow-lg transition-shadow cursor-pointer"
                    onClick={() => navigate(`/ticket/${ticket.id}`)}
                  >
                    <CardHeader>
                      <div className="flex justify-between items-start gap-4">
                        <div className="flex-1">
                          <CardTitle className="text-lg">{ticket.subject}</CardTitle>
                          <CardDescription>
                            De: {ticket.profiles?.full_name || ticket.profiles?.email || 'Utilisateur'}
                          </CardDescription>
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

            {['open', 'in_progress', 'closed'].map((status) => (
              <TabsContent key={status} value={status} className="space-y-4 mt-6">
                {filterTickets(status).map((ticket) => (
                  <Card
                    key={ticket.id}
                    className="hover:shadow-lg transition-shadow cursor-pointer"
                    onClick={() => navigate(`/ticket/${ticket.id}`)}
                  >
                    <CardHeader>
                      <div className="flex justify-between items-start gap-4">
                        <div className="flex-1">
                          <CardTitle className="text-lg">{ticket.subject}</CardTitle>
                          <CardDescription>
                            De: {ticket.profiles?.full_name || ticket.profiles?.email || 'Utilisateur'}
                          </CardDescription>
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
                            >
                              <X className="w-4 h-4" />
                            </Button>
                          )}
                        </div>
                      </div>
                    </CardHeader>
                  </Card>
                ))}
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
