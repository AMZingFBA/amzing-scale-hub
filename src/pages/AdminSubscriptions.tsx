import { useState, useEffect, useMemo, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/hooks/use-auth';
import { useAdmin } from '@/hooks/use-admin';
import { supabase } from '@/integrations/supabase/client';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { useToast } from '@/hooks/use-toast';
import { ArrowLeft, Users, Euro, CalendarDays, TrendingUp, Search, RefreshCw, CreditCard, AlertCircle, CheckCircle2, XCircle, Clock, ChevronLeft, ChevronRight, X } from 'lucide-react';

interface MemberPayment {
  id: string;
  amount: number;
  date: string;
  status: string;
}

interface Member {
  user_id: string;
  email: string;
  full_name: string | null;
  phone: string | null;
  registered_at: string;
  subscription: {
    status: string;
    plan_type: string;
    payment_provider: string | null;
    stripe_customer_id: string | null;
    started_at: string;
    expires_at: string | null;
    is_trial: boolean;
  };
  stripe: {
    payments: MemberPayment[];
    total_paid: number;
    payment_count: number;
    active_subscription: {
      status: string;
      current_period_end: string;
      cancel_at_period_end: boolean;
    } | null;
    upcoming_invoice: {
      amount: number;
      date: string;
    } | null;
  };
}

interface ForecastMonth {
  amount: number;
  members: string[];
}

interface Summary {
  total_members: number;
  active_vip: number;
  revenue_this_month: number;
  total_revenue: number;
  monthly_forecast: Record<string, ForecastMonth>;
}

const AdminSubscriptions = () => {
  const { user, isLoading: authLoading } = useAuth();
  const { isAdmin, isLoading: adminLoading } = useAdmin();
  const navigate = useNavigate();
  const { toast } = useToast();

  const [members, setMembers] = useState<Member[]>([]);
  const [summary, setSummary] = useState<Summary | null>(null);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedMember, setSelectedMember] = useState<Member | null>(null);

  useEffect(() => {
    if (!authLoading && !adminLoading) {
      if (!user || !isAdmin) {
        navigate('/dashboard');
        return;
      }
      fetchData();
    }
  }, [user, isAdmin, authLoading, adminLoading]);

  const fetchData = async () => {
    setLoading(true);
    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) throw new Error('No session');

      const response = await supabase.functions.invoke('admin-get-subscriptions', {
        headers: { Authorization: `Bearer ${session.access_token}` },
      });

      if (response.error) throw response.error;

      setMembers(response.data.members);
      setSummary(response.data.summary);
    } catch (err: any) {
      toast({
        title: 'Erreur',
        description: err.message || 'Impossible de charger les données',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const filteredMembers = useMemo(() => {
    if (!searchQuery.trim()) return members;
    const q = searchQuery.toLowerCase();
    return members.filter(
      (m) =>
        m.email.toLowerCase().includes(q) ||
        (m.full_name && m.full_name.toLowerCase().includes(q))
    );
  }, [members, searchQuery]);

  const formatDate = (dateStr: string | null) => {
    if (!dateStr) return '—';
    return new Date(dateStr).toLocaleDateString('fr-FR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
    });
  };

  const formatMonth = (monthKey: string) => {
    const [year, month] = monthKey.split('-');
    const date = new Date(parseInt(year), parseInt(month) - 1);
    return date.toLocaleDateString('fr-FR', { month: 'long', year: 'numeric' });
  };

  const getStatusBadge = (member: Member) => {
    const { status, plan_type } = member.subscription;
    if (plan_type === 'vip' && status === 'active') {
      return <Badge className="bg-green-500/20 text-green-400 border-green-500/30">VIP Actif</Badge>;
    }
    if (status === 'canceled') {
      return <Badge className="bg-yellow-500/20 text-yellow-400 border-yellow-500/30">Annulé</Badge>;
    }
    if (status === 'unpaid') {
      return <Badge className="bg-red-500/20 text-red-400 border-red-500/30">Impayé</Badge>;
    }
    if (status === 'expired') {
      return <Badge className="bg-gray-500/20 text-gray-400 border-gray-500/30">Expiré</Badge>;
    }
    return <Badge variant="outline">{status}</Badge>;
  };

  const sortedForecastMonths = useMemo(() => {
    if (!summary) return [];
    return Object.entries(summary.monthly_forecast)
      .sort(([a], [b]) => a.localeCompare(b))
      .slice(0, 12);
  }, [summary]);

  if (authLoading || adminLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="container mx-auto px-4 py-8 max-w-7xl">
        {/* Header */}
        <div className="flex items-center gap-4 mb-6">
          <Button variant="ghost" size="icon" onClick={() => navigate('/dashboard')}>
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <div>
            <h1 className="text-2xl font-bold">Gestion des Abonnements</h1>
            <p className="text-muted-foreground text-sm">Suivi des paiements et prévisions de revenus</p>
          </div>
          <Button variant="outline" size="sm" className="ml-auto" onClick={fetchData} disabled={loading}>
            <RefreshCw className={`h-4 w-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
            Actualiser
          </Button>
        </div>

        {loading ? (
          <div className="flex items-center justify-center py-20">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary" />
          </div>
        ) : (
          <>
            {/* Summary Cards */}
            {summary && (
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                <Card>
                  <CardContent className="p-4">
                    <div className="flex items-center gap-3">
                      <Users className="h-8 w-8 text-primary" />
                      <div>
                        <p className="text-2xl font-bold">{summary.active_vip}</p>
                        <p className="text-xs text-muted-foreground">VIP Actifs</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="p-4">
                    <div className="flex items-center gap-3">
                      <Euro className="h-8 w-8 text-green-500" />
                      <div>
                        <p className="text-2xl font-bold">{summary.revenue_this_month.toFixed(0)}€</p>
                        <p className="text-xs text-muted-foreground">Ce mois-ci</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="p-4">
                    <div className="flex items-center gap-3">
                      <TrendingUp className="h-8 w-8 text-blue-500" />
                      <div>
                        <p className="text-2xl font-bold">{summary.total_revenue.toFixed(0)}€</p>
                        <p className="text-xs text-muted-foreground">Total encaissé</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="p-4">
                    <div className="flex items-center gap-3">
                      <CreditCard className="h-8 w-8 text-orange-500" />
                      <div>
                        <p className="text-2xl font-bold">{summary.total_members}</p>
                        <p className="text-xs text-muted-foreground">Total membres</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            )}

            <Tabs defaultValue="members" className="space-y-4">
              <TabsList>
                <TabsTrigger value="members">👥 Membres</TabsTrigger>
                <TabsTrigger value="calendar">📅 Calendrier Revenus</TabsTrigger>
                <TabsTrigger value="detail">📋 Détail membre</TabsTrigger>
              </TabsList>

              {/* Members Tab */}
              <TabsContent value="members" className="space-y-4">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Rechercher par email ou nom..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-10"
                  />
                </div>

                <Card>
                  <div className="overflow-x-auto">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Email</TableHead>
                          <TableHead>Statut</TableHead>
                          <TableHead className="text-right">Total payé</TableHead>
                          <TableHead className="text-right">Nb paiements</TableHead>
                          <TableHead>Prochain paiement</TableHead>
                          <TableHead>Expire le</TableHead>
                          <TableHead></TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {filteredMembers.map((member) => (
                          <TableRow key={member.user_id} className="cursor-pointer hover:bg-accent/50">
                            <TableCell>
                              <div>
                                <p className="font-medium text-sm">{member.email}</p>
                                {member.full_name && (
                                  <p className="text-xs text-muted-foreground">{member.full_name}</p>
                                )}
                              </div>
                            </TableCell>
                            <TableCell>{getStatusBadge(member)}</TableCell>
                            <TableCell className="text-right font-semibold">
                              {member.stripe.total_paid > 0 ? `${member.stripe.total_paid.toFixed(0)}€` : '0€'}
                            </TableCell>
                            <TableCell className="text-right">{member.stripe.payment_count}</TableCell>
                            <TableCell>
                              {member.stripe.upcoming_invoice ? (
                                <div className="text-sm">
                                  <p className="font-medium text-green-500">{member.stripe.upcoming_invoice.amount}€</p>
                                  <p className="text-xs text-muted-foreground">
                                    {formatDate(member.stripe.upcoming_invoice.date)}
                                  </p>
                                </div>
                              ) : (
                                <span className="text-xs text-muted-foreground">—</span>
                              )}
                            </TableCell>
                            <TableCell className="text-sm">{formatDate(member.subscription.expires_at)}</TableCell>
                            <TableCell>
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => setSelectedMember(member)}
                              >
                                Voir
                              </Button>
                            </TableCell>
                          </TableRow>
                        ))}
                        {filteredMembers.length === 0 && (
                          <TableRow>
                            <TableCell colSpan={7} className="text-center py-8 text-muted-foreground">
                              Aucun membre trouvé
                            </TableCell>
                          </TableRow>
                        )}
                      </TableBody>
                    </Table>
                  </div>
                </Card>
              </TabsContent>

              {/* Calendar Tab */}
              <TabsContent value="calendar" className="space-y-4">
                <RevenueCalendar members={members} />
              </TabsContent>

              {/* Member Detail Tab */}
              <TabsContent value="detail" className="space-y-4">
                {selectedMember ? (
                  <MemberDetail member={selectedMember} formatDate={formatDate} />
                ) : (
                  <Card>
                    <CardContent className="py-12 text-center text-muted-foreground">
                      <Users className="h-12 w-12 mx-auto mb-4 opacity-30" />
                      <p>Sélectionne un membre dans l'onglet "Membres" pour voir ses détails</p>
                    </CardContent>
                  </Card>
                )}
              </TabsContent>
            </Tabs>
          </>
        )}
      </div>
      <Footer />
    </div>
  );
};

// Revenue Calendar Component — real day-by-day calendar
interface DayPayment {
  email: string;
  amount: number;
  type: 'past' | 'upcoming';
}

const RevenueCalendar = ({ members }: { members: Member[] }) => {
  const [currentDate, setCurrentDate] = useState(() => new Date());
  const [selectedDay, setSelectedDay] = useState<string | null>(null);

  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();

  const prevMonth = useCallback(() => setCurrentDate(new Date(year, month - 1, 1)), [year, month]);
  const nextMonth = useCallback(() => setCurrentDate(new Date(year, month + 1, 1)), [year, month]);

  // Build a map of date -> payments
  const dayPayments = useMemo(() => {
    const map: Record<string, DayPayment[]> = {};
    const addEntry = (dateStr: string, email: string, amount: number, type: 'past' | 'upcoming') => {
      const dayKey = dateStr.substring(0, 10); // YYYY-MM-DD
      if (!map[dayKey]) map[dayKey] = [];
      map[dayKey].push({ email, amount, type });
    };

    for (const member of members) {
      // Past payments
      for (const payment of member.stripe.payments) {
        addEntry(payment.date, member.email, payment.amount, 'past');
      }
      // Upcoming invoice
      if (member.stripe.upcoming_invoice) {
        addEntry(member.stripe.upcoming_invoice.date, member.email, member.stripe.upcoming_invoice.amount, 'upcoming');
      }
      // Forecast: if active sub with upcoming, project next 11 months
      if (member.stripe.active_subscription && member.stripe.upcoming_invoice && !member.stripe.active_subscription.cancel_at_period_end) {
        const baseDate = new Date(member.stripe.upcoming_invoice.date);
        const amt = member.stripe.upcoming_invoice.amount;
        for (let i = 1; i < 12; i++) {
          const futureDate = new Date(baseDate);
          futureDate.setMonth(futureDate.getMonth() + i);
          addEntry(futureDate.toISOString(), member.email, amt, 'upcoming');
        }
      }
    }
    return map;
  }, [members]);

  // Calendar grid
  const firstDayOfMonth = new Date(year, month, 1);
  const lastDayOfMonth = new Date(year, month + 1, 0);
  const daysInMonth = lastDayOfMonth.getDate();
  // Monday = 0, Sunday = 6
  let startDow = firstDayOfMonth.getDay() - 1;
  if (startDow < 0) startDow = 6;

  const weeks: (number | null)[][] = [];
  let currentWeek: (number | null)[] = [];
  for (let i = 0; i < startDow; i++) currentWeek.push(null);
  for (let d = 1; d <= daysInMonth; d++) {
    currentWeek.push(d);
    if (currentWeek.length === 7) {
      weeks.push(currentWeek);
      currentWeek = [];
    }
  }
  if (currentWeek.length > 0) {
    while (currentWeek.length < 7) currentWeek.push(null);
    weeks.push(currentWeek);
  }

  const monthLabel = firstDayOfMonth.toLocaleDateString('fr-FR', { month: 'long', year: 'numeric' });

  const getDayKey = (day: number) => {
    const mm = String(month + 1).padStart(2, '0');
    const dd = String(day).padStart(2, '0');
    return `${year}-${mm}-${dd}`;
  };

  const todayKey = (() => {
    const now = new Date();
    return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')}`;
  })();

  // Monthly totals
  const monthTotals = useMemo(() => {
    let past = 0;
    let upcoming = 0;
    let count = 0;
    for (let d = 1; d <= daysInMonth; d++) {
      const key = getDayKey(d);
      const entries = dayPayments[key];
      if (entries) {
        for (const e of entries) {
          if (e.type === 'past') past += e.amount;
          else upcoming += e.amount;
          count++;
        }
      }
    }
    return { past, upcoming, total: past + upcoming, count };
  }, [dayPayments, year, month, daysInMonth]);

  const selectedEntries = selectedDay ? (dayPayments[selectedDay] || []) : [];
  const selectedTotal = selectedEntries.reduce((s, e) => s + e.amount, 0);

  const dayNames = ['Lun', 'Mar', 'Mer', 'Jeu', 'Ven', 'Sam', 'Dim'];

  return (
    <div className="space-y-4">
      {/* Month summary */}
      <div className="grid grid-cols-3 gap-3">
        <Card>
          <CardContent className="p-3 text-center">
            <p className="text-xs text-muted-foreground">Encaissé</p>
            <p className="text-xl font-bold text-green-500">{monthTotals.past.toFixed(0)}€</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-3 text-center">
            <p className="text-xs text-muted-foreground">Prévu</p>
            <p className="text-xl font-bold text-blue-500">{monthTotals.upcoming.toFixed(0)}€</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-3 text-center">
            <p className="text-xs text-muted-foreground">Total mois</p>
            <p className="text-xl font-bold">{monthTotals.total.toFixed(0)}€</p>
          </CardContent>
        </Card>
      </div>

      {/* Calendar */}
      <Card>
        <CardHeader className="pb-2">
          <div className="flex items-center justify-between">
            <Button variant="ghost" size="icon" onClick={prevMonth}>
              <ChevronLeft className="h-5 w-5" />
            </Button>
            <CardTitle className="capitalize text-lg">{monthLabel}</CardTitle>
            <Button variant="ghost" size="icon" onClick={nextMonth}>
              <ChevronRight className="h-5 w-5" />
            </Button>
          </div>
        </CardHeader>
        <CardContent className="p-2 sm:p-4">
          {/* Day headers */}
          <div className="grid grid-cols-7 gap-1 mb-1">
            {dayNames.map((dn) => (
              <div key={dn} className="text-center text-xs font-medium text-muted-foreground py-1">
                {dn}
              </div>
            ))}
          </div>
          {/* Weeks */}
          {weeks.map((week, wi) => (
            <div key={wi} className="grid grid-cols-7 gap-1">
              {week.map((day, di) => {
                if (day === null) return <div key={di} className="aspect-square" />;
                const key = getDayKey(day);
                const entries = dayPayments[key];
                const isToday = key === todayKey;
                const isSelected = key === selectedDay;
                const totalAmount = entries ? entries.reduce((s, e) => s + e.amount, 0) : 0;
                const hasPast = entries?.some(e => e.type === 'past');
                const hasUpcoming = entries?.some(e => e.type === 'upcoming');

                return (
                  <button
                    key={di}
                    onClick={() => setSelectedDay(isSelected ? null : key)}
                    className={`
                      aspect-square rounded-lg flex flex-col items-center justify-center text-xs relative transition-all border
                      ${isToday ? 'border-primary ring-1 ring-primary/30' : 'border-transparent'}
                      ${isSelected ? 'bg-primary text-primary-foreground' : entries ? 'bg-accent/50 hover:bg-accent' : 'hover:bg-muted/50'}
                    `}
                  >
                    <span className={`font-medium ${isSelected ? '' : isToday ? 'text-primary' : ''}`}>{day}</span>
                    {entries && !isSelected && (
                      <span className={`text-[10px] font-bold mt-0.5 ${hasPast ? 'text-green-500' : 'text-blue-500'}`}>
                        {totalAmount.toFixed(0)}€
                      </span>
                    )}
                    {entries && isSelected && (
                      <span className="text-[10px] font-bold mt-0.5">{totalAmount.toFixed(0)}€</span>
                    )}
                    {/* Dot indicators */}
                    {entries && !isSelected && (
                      <div className="flex gap-0.5 mt-0.5">
                        {hasPast && <span className="w-1 h-1 rounded-full bg-green-500" />}
                        {hasUpcoming && <span className="w-1 h-1 rounded-full bg-blue-500" />}
                      </div>
                    )}
                  </button>
                );
              })}
            </div>
          ))}
        </CardContent>
      </Card>

      {/* Selected day details */}
      {selectedDay && (
        <Card>
          <CardHeader className="pb-2">
            <div className="flex items-center justify-between">
              <CardTitle className="text-base">
                {new Date(selectedDay + 'T00:00:00').toLocaleDateString('fr-FR', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })}
              </CardTitle>
              <Button variant="ghost" size="icon" onClick={() => setSelectedDay(null)}>
                <X className="h-4 w-4" />
              </Button>
            </div>
            <p className="text-sm text-muted-foreground">
              {selectedEntries.length} paiement{selectedEntries.length > 1 ? 's' : ''} — Total : <span className="font-bold text-foreground">{selectedTotal.toFixed(0)}€</span>
            </p>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {selectedEntries.map((entry, i) => (
                <div key={i} className="flex items-center justify-between p-2 rounded-lg border">
                  <div className="flex items-center gap-2">
                    {entry.type === 'past' ? (
                      <CheckCircle2 className="h-4 w-4 text-green-500 shrink-0" />
                    ) : (
                      <Clock className="h-4 w-4 text-blue-500 shrink-0" />
                    )}
                    <span className="text-sm truncate">{entry.email}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className={`font-bold text-sm ${entry.type === 'past' ? 'text-green-500' : 'text-blue-500'}`}>
                      {entry.amount.toFixed(0)}€
                    </span>
                    <Badge variant="outline" className="text-[10px]">
                      {entry.type === 'past' ? 'Encaissé' : 'Prévu'}
                    </Badge>
                  </div>
                </div>
              ))}
              {selectedEntries.length === 0 && (
                <p className="text-center text-muted-foreground py-4 text-sm">Aucun paiement ce jour</p>
              )}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Legend */}
      <div className="flex items-center gap-4 text-xs text-muted-foreground px-1">
        <div className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-green-500" /> Encaissé</div>
        <div className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-blue-500" /> Prévu</div>
        <div className="flex items-center gap-1"><span className="w-3 h-3 rounded border border-primary" /> Aujourd'hui</div>
      </div>
    </div>
  );
};

// Past revenue history component (kept for reference data)
const PastRevenueHistory = ({ members }: { members: Member[] }) => {
  const monthlyRevenue = useMemo(() => {
    const months: Record<string, number> = {};
    for (const member of members) {
      for (const payment of member.stripe.payments) {
        const monthKey = payment.date.substring(0, 7);
        months[monthKey] = (months[monthKey] || 0) + payment.amount;
      }
    }
    return Object.entries(months)
      .sort(([a], [b]) => b.localeCompare(a))
      .slice(0, 12);
  }, [members]);

  if (monthlyRevenue.length === 0) {
    return <p className="text-center text-muted-foreground py-4">Aucun historique de paiement</p>;
  }

  return (
    <div className="space-y-2">
      {monthlyRevenue.map(([month, amount]) => {
        const [year, m] = month.split('-');
        const date = new Date(parseInt(year), parseInt(m) - 1);
        const label = date.toLocaleDateString('fr-FR', { month: 'long', year: 'numeric' });
        return (
          <div key={month} className="flex items-center justify-between p-3 rounded-lg border">
            <span className="capitalize font-medium">{label}</span>
            <span className="font-bold text-green-500">{amount.toFixed(0)}€</span>
          </div>
        );
      })}
    </div>
  );
};

// Member detail component
const MemberDetail = ({ member, formatDate }: { member: Member; formatDate: (d: string | null) => string }) => {
  return (
    <div className="space-y-4">
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">{member.email}</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div>
              <p className="text-xs text-muted-foreground">Nom</p>
              <p className="font-medium">{member.full_name || '—'}</p>
            </div>
            <div>
              <p className="text-xs text-muted-foreground">Téléphone</p>
              <p className="font-medium">{member.phone || '—'}</p>
            </div>
            <div>
              <p className="text-xs text-muted-foreground">Inscrit le</p>
              <p className="font-medium">{formatDate(member.registered_at)}</p>
            </div>
            <div>
              <p className="text-xs text-muted-foreground">Fournisseur</p>
              <p className="font-medium">{member.subscription.payment_provider || 'free'}</p>
            </div>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div>
              <p className="text-xs text-muted-foreground">Statut</p>
              <p className="font-medium flex items-center gap-1">
                {member.subscription.status === 'active' ? (
                  <CheckCircle2 className="h-4 w-4 text-green-500" />
                ) : member.subscription.status === 'unpaid' ? (
                  <XCircle className="h-4 w-4 text-red-500" />
                ) : (
                  <Clock className="h-4 w-4 text-yellow-500" />
                )}
                {member.subscription.status}
              </p>
            </div>
            <div>
              <p className="text-xs text-muted-foreground">Plan</p>
              <p className="font-medium uppercase">{member.subscription.plan_type}</p>
            </div>
            <div>
              <p className="text-xs text-muted-foreground">Total payé</p>
              <p className="font-bold text-green-500 text-lg">{member.stripe.total_paid.toFixed(0)}€</p>
            </div>
            <div>
              <p className="text-xs text-muted-foreground">Nb paiements</p>
              <p className="font-bold text-lg">{member.stripe.payment_count}</p>
            </div>
          </div>

          {member.stripe.upcoming_invoice && (
            <div className="p-3 rounded-lg border border-green-500/30 bg-green-500/10">
              <div className="flex items-center gap-2">
                <CalendarDays className="h-4 w-4 text-green-500" />
                <span className="text-sm font-medium">Prochain paiement :</span>
                <span className="font-bold text-green-500">{member.stripe.upcoming_invoice.amount}€</span>
                <span className="text-sm text-muted-foreground">le {formatDate(member.stripe.upcoming_invoice.date)}</span>
              </div>
            </div>
          )}

          {member.stripe.active_subscription?.cancel_at_period_end && (
            <div className="p-3 rounded-lg border border-yellow-500/30 bg-yellow-500/10">
              <div className="flex items-center gap-2">
                <AlertCircle className="h-4 w-4 text-yellow-500" />
                <span className="text-sm">Annulation programmée en fin de période</span>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Payment History */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base flex items-center gap-2">
            <CreditCard className="h-4 w-4" />
            Historique des paiements
          </CardTitle>
        </CardHeader>
        <CardContent>
          {member.stripe.payments.length === 0 ? (
            <p className="text-center text-muted-foreground py-4">Aucun paiement enregistré</p>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Date</TableHead>
                  <TableHead className="text-right">Montant</TableHead>
                  <TableHead>Statut</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {member.stripe.payments
                  .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
                  .map((payment) => (
                    <TableRow key={payment.id}>
                      <TableCell>{formatDate(payment.date)}</TableCell>
                      <TableCell className="text-right font-semibold">{payment.amount.toFixed(2)}€</TableCell>
                      <TableCell>
                        <Badge className="bg-green-500/20 text-green-400 border-green-500/30">
                          {payment.status === 'paid' || payment.status === 'succeeded' ? 'Payé' : payment.status}
                        </Badge>
                      </TableCell>
                    </TableRow>
                  ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>

      {/* Engagement Calculation */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base flex items-center gap-2">
            <TrendingUp className="h-4 w-4" />
            Résumé engagement
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            <div className="p-3 rounded-lg border text-center">
              <p className="text-xs text-muted-foreground">Mois d'engagement</p>
              <p className="text-2xl font-bold">{member.stripe.payment_count}</p>
            </div>
            <div className="p-3 rounded-lg border text-center">
              <p className="text-xs text-muted-foreground">1er paiement</p>
              <p className="text-2xl font-bold">
                {member.stripe.payments.length > 0
                  ? `${member.stripe.payments[member.stripe.payments.length - 1].amount.toFixed(0)}€`
                  : '—'}
              </p>
            </div>
            <div className="p-3 rounded-lg border text-center">
              <p className="text-xs text-muted-foreground">Paiement mensuel</p>
              <p className="text-2xl font-bold">
                {member.stripe.payment_count > 1
                  ? `${(member.stripe.payments[0].amount).toFixed(0)}€`
                  : '—'}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default AdminSubscriptions;
