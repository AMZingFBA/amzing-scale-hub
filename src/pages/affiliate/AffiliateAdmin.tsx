import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { LogOut, Copy, Check, Euro, TrendingUp, Users, Calendar, Award, CreditCard } from "lucide-react";
import { format, addMonths, addDays, startOfMonth, endOfMonth, isSameDay } from "date-fns";
import { fr } from "date-fns/locale";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

interface AffiliateUser {
  id: string;
  email: string;
  first_name: string;
  last_name: string;
  iban: string;
  bic: string;
  phone: string;
  referral_code: string;
}

interface Referral {
  id: string;
  referred_email: string;
  signup_date: string;
  referred_user_id: string;
  referrer_user_id: string;
  payment_status: string;
  payment_date: string | null;
  payment_month: string | null;
  profile?: {
    full_name: string | null;
    nickname: string | null;
  };
  affiliate?: AffiliateUser;
}

interface PaymentsByDate {
  [date: string]: {
    referrals: Referral[];
    total: number;
  };
}

const AffiliateAdmin = () => {
  const navigate = useNavigate();
  const [referrals, setReferrals] = useState<Referral[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [copiedRIB, setCopiedRIB] = useState<string | null>(null);
  const [selectedMonth, setSelectedMonth] = useState(new Date());

  useEffect(() => {
    checkAdminAccess();
    fetchAllReferrals();
  }, [navigate]);

  const checkAdminAccess = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user || user.email !== 'amzingfba26@gmail.com') {
      toast.error("Accès non autorisé");
      navigate("/affiliate");
      return;
    }
  };

  const fetchAllReferrals = async () => {
    try {
      // Fetch all referrals with VIP subscriptions
      const { data: allReferrals, error: referralsError } = await supabase
        .from("affiliate_referrals")
        .select("*")
        .order("signup_date", { ascending: false });

      if (referralsError) throw referralsError;

      if (!allReferrals || allReferrals.length === 0) {
        setReferrals([]);
        setIsLoading(false);
        return;
      }

      // Get subscription status for each referred user
      const referredUserIds = allReferrals.map(r => r.referred_user_id);
      const { data: subscriptions, error: subsError } = await supabase
        .from("subscriptions")
        .select("user_id, plan_type, status")
        .in("user_id", referredUserIds)
        .eq("plan_type", "vip")
        .eq("status", "active");

      if (subsError) throw subsError;

      // Get profile info for each referred user
      const { data: profiles, error: profilesError } = await supabase
        .from("profiles")
        .select("id, nickname, full_name")
        .in("id", referredUserIds);

      if (profilesError) throw profilesError;

      // Get affiliate users info
      const affiliateUserIds = [...new Set(allReferrals.map(r => r.referrer_user_id))];
      const { data: affiliateUsers, error: affiliateError } = await supabase
        .from("affiliate_users")
        .select("*")
        .in("id", affiliateUserIds);

      if (affiliateError) throw affiliateError;

      const profilesMap = new Map(profiles?.map(p => [p.id, p]) || []);
      const affiliateMap = new Map(affiliateUsers?.map(a => [a.id, a]) || []);
      const vipUserIds = new Set(subscriptions?.map(s => s.user_id) || []);

      // Filter and enrich referrals
      const enrichedReferrals = allReferrals
        .filter(r => vipUserIds.has(r.referred_user_id))
        .map(r => ({
          ...r,
          profile: profilesMap.get(r.referred_user_id),
          affiliate: affiliateMap.get(r.referrer_user_id)
        }));

      setReferrals(enrichedReferrals);
    } catch (error) {
      console.error("Error fetching referrals:", error);
      toast.error("Erreur lors du chargement des données");
    } finally {
      setIsLoading(false);
    }
  };

  const handleMarkAsPaid = async (referralId: string, paymentDate: Date) => {
    try {
      const { error } = await supabase
        .from("affiliate_referrals")
        .update({
          payment_status: "payé",
          payment_date: paymentDate.toISOString(),
          payment_month: format(paymentDate, "yyyy-MM")
        })
        .eq("id", referralId);

      if (error) throw error;

      toast.success("Paiement marqué comme effectué");
      fetchAllReferrals();
    } catch (error) {
      console.error("Error marking as paid:", error);
      toast.error("Erreur lors de la mise à jour");
    }
  };

  const handleCopyRIB = (iban: string, bic: string, affiliateId: string) => {
    const ribText = `IBAN: ${iban}\nBIC: ${bic}`;
    navigator.clipboard.writeText(ribText);
    setCopiedRIB(affiliateId);
    toast.success("RIB copié dans le presse-papier");
    setTimeout(() => setCopiedRIB(null), 2000);
  };

  const handleLogout = () => {
    toast.success("Déconnexion réussie");
    navigate("/affiliate");
  };

  // Group payments by date
  const getPaymentsByDate = (): PaymentsByDate => {
    const paymentsByDate: PaymentsByDate = {};
    
    referrals.forEach(referral => {
      const signupDate = new Date(referral.signup_date);
      const paymentDate = addDays(addMonths(signupDate, 1), 7);
      const dateKey = format(paymentDate, "yyyy-MM-dd");
      
      if (!paymentsByDate[dateKey]) {
        paymentsByDate[dateKey] = {
          referrals: [],
          total: 0
        };
      }
      
      paymentsByDate[dateKey].referrals.push(referral);
      if (referral.payment_status === "en attente") {
        paymentsByDate[dateKey].total += 6.99;
      }
    });
    
    return paymentsByDate;
  };

  // Get today's payments
  const getTodayPayments = () => {
    const today = new Date();
    const paymentsByDate = getPaymentsByDate();
    
    return Object.entries(paymentsByDate)
      .filter(([dateStr]) => isSameDay(new Date(dateStr), today))
      .flatMap(([_, data]) => data.referrals.filter(r => r.payment_status === "en attente"));
  };

  // Get monthly statistics
  const getMonthlyStats = () => {
    const startDate = startOfMonth(selectedMonth);
    const endDate = endOfMonth(selectedMonth);
    
    const monthReferrals = referrals.filter(r => {
      const signupDate = new Date(r.signup_date);
      const paymentDate = addDays(addMonths(signupDate, 1), 7);
      return paymentDate >= startDate && paymentDate <= endDate;
    });

    const paidReferrals = monthReferrals.filter(r => r.payment_status === "payé");
    const totalPaid = paidReferrals.length * 6.99;
    const totalPending = monthReferrals.filter(r => r.payment_status === "en attente").length * 6.99;

    return {
      totalReferrals: monthReferrals.length,
      paidCount: paidReferrals.length,
      totalPaid,
      totalPending,
      uniqueAffiliates: new Set(monthReferrals.map(r => r.referrer_user_id)).size
    };
  };

  // Get top affiliates
  const getTopAffiliates = () => {
    const affiliateStats = new Map<string, { affiliate: AffiliateUser; count: number; earned: number }>();
    
    referrals.forEach(r => {
      if (!r.affiliate) return;
      
      const current = affiliateStats.get(r.referrer_user_id) || {
        affiliate: r.affiliate,
        count: 0,
        earned: 0
      };
      
      current.count++;
      if (r.payment_status === "payé") {
        current.earned += 6.99;
      }
      
      affiliateStats.set(r.referrer_user_id, current);
    });
    
    return Array.from(affiliateStats.values())
      .sort((a, b) => b.count - a.count)
      .slice(0, 10);
  };

  const todayPayments = getTodayPayments();
  const paymentsByDate = getPaymentsByDate();
  const monthlyStats = getMonthlyStats();
  const topAffiliates = getTopAffiliates();

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-background to-secondary/20 flex items-center justify-center">
        <p className="text-muted-foreground">Chargement...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-secondary/20">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold mb-2">
              Administration Affiliation
            </h1>
            <p className="text-muted-foreground">
              Gestion des paiements et statistiques
            </p>
          </div>
          <Button variant="outline" onClick={handleLogout}>
            <LogOut className="mr-2 h-4 w-4" />
            Déconnexion
          </Button>
        </div>

        {/* Today's Payments Alert */}
        {todayPayments.length > 0 && (
          <Card className="mb-6 border-2 border-primary bg-gradient-to-r from-primary/10 to-secondary/10">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Calendar className="h-5 w-5 text-primary" />
                Paiements à effectuer aujourd'hui
              </CardTitle>
              <CardDescription>
                {todayPayments.length} paiement{todayPayments.length > 1 ? "s" : ""} à traiter ({(todayPayments.length * 6.99).toFixed(2)} €)
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {todayPayments.map((referral) => (
                  <Card key={referral.id} className="p-4">
                    <div className="grid md:grid-cols-5 gap-4 items-center">
                      <div>
                        <p className="text-sm text-muted-foreground">Parrain</p>
                        <p className="font-semibold">
                          {referral.affiliate?.first_name} {referral.affiliate?.last_name}
                        </p>
                        <p className="text-xs text-muted-foreground">{referral.affiliate?.email}</p>
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground">Filleul</p>
                        <p className="font-medium">
                          {referral.profile?.full_name || referral.profile?.nickname || referral.referred_email}
                        </p>
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground">RIB</p>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleCopyRIB(
                            referral.affiliate?.iban || "",
                            referral.affiliate?.bic || "",
                            referral.affiliate?.id || ""
                          )}
                        >
                          {copiedRIB === referral.affiliate?.id ? (
                            <Check className="h-4 w-4 mr-2" />
                          ) : (
                            <Copy className="h-4 w-4 mr-2" />
                          )}
                          {copiedRIB === referral.affiliate?.id ? "Copié" : "Copier"}
                        </Button>
                      </div>
                      <div className="text-center">
                        <div className="inline-flex items-center gap-1 px-3 py-2 bg-gradient-to-r from-primary to-primary-glow text-white rounded-lg font-bold">
                          <Euro className="h-4 w-4" />
                          6,99 €
                        </div>
                      </div>
                      <div>
                        <Button
                          onClick={() => handleMarkAsPaid(referral.id, new Date())}
                          className="w-full"
                        >
                          <Check className="mr-2 h-4 w-4" />
                          Marquer payé
                        </Button>
                      </div>
                    </div>
                  </Card>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Monthly Statistics */}
        <div className="grid md:grid-cols-4 gap-6 mb-8">
          <Card className="border-2 border-primary/20">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium flex items-center gap-2">
                <Users className="h-4 w-4 text-primary" />
                Filleuls ce mois
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-bold">{monthlyStats.totalReferrals}</p>
              <p className="text-xs text-muted-foreground mt-1">
                {monthlyStats.uniqueAffiliates} parrains actifs
              </p>
            </CardContent>
          </Card>

          <Card className="border-2 border-secondary/20">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium flex items-center gap-2">
                <Check className="h-4 w-4 text-secondary" />
                Payés
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-bold">{monthlyStats.paidCount}</p>
              <p className="text-xs text-muted-foreground mt-1">
                {monthlyStats.totalPaid.toFixed(2)} € versés
              </p>
            </CardContent>
          </Card>

          <Card className="border-2 border-primary/20">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium flex items-center gap-2">
                <CreditCard className="h-4 w-4 text-primary" />
                En attente
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-bold">
                {monthlyStats.totalReferrals - monthlyStats.paidCount}
              </p>
              <p className="text-xs text-muted-foreground mt-1">
                {monthlyStats.totalPending.toFixed(2)} € à verser
              </p>
            </CardContent>
          </Card>

          <Card className="border-2 border-secondary/20 bg-gradient-to-br from-primary/5 to-secondary/5">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium flex items-center gap-2">
                <TrendingUp className="h-4 w-4 text-secondary" />
                Total
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-bold">
                {(monthlyStats.totalPaid + monthlyStats.totalPending).toFixed(2)} €
              </p>
              <p className="text-xs text-muted-foreground mt-1">
                Revenus du mois
              </p>
            </CardContent>
          </Card>
        </div>

        <Tabs defaultValue="payments" className="space-y-6">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="payments">Calendrier des paiements</TabsTrigger>
            <TabsTrigger value="affiliates">Top parrains</TabsTrigger>
          </TabsList>

          <TabsContent value="payments">
            <Card>
              <CardHeader>
                <CardTitle>Tous les paiements</CardTitle>
                <CardDescription>
                  Organisés par date de paiement prévue
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  {Object.entries(paymentsByDate)
                    .sort(([dateA], [dateB]) => new Date(dateA).getTime() - new Date(dateB).getTime())
                    .map(([dateStr, data]) => {
                      const paymentDate = new Date(dateStr);
                      const pendingCount = data.referrals.filter(r => r.payment_status === "en attente").length;
                      
                      return (
                        <div key={dateStr} className="space-y-3">
                          <div className="flex items-center justify-between">
                            <h3 className="text-lg font-semibold flex items-center gap-2">
                              <Calendar className="h-5 w-5 text-primary" />
                              {format(paymentDate, "EEEE dd MMMM yyyy", { locale: fr })}
                            </h3>
                            <div className="flex items-center gap-4">
                              <Badge variant="secondary">
                                {data.referrals.length} paiement{data.referrals.length > 1 ? "s" : ""}
                              </Badge>
                              {pendingCount > 0 && (
                                <Badge variant="destructive">
                                  {pendingCount} en attente
                                </Badge>
                              )}
                            </div>
                          </div>

                          <Table>
                            <TableHeader>
                              <TableRow>
                                <TableHead>Parrain</TableHead>
                                <TableHead>Filleul</TableHead>
                                <TableHead>Contact</TableHead>
                                <TableHead>RIB</TableHead>
                                <TableHead>Montant</TableHead>
                                <TableHead>Statut</TableHead>
                                <TableHead>Action</TableHead>
                              </TableRow>
                            </TableHeader>
                            <TableBody>
                              {data.referrals.map((referral) => (
                                <TableRow key={referral.id}>
                                  <TableCell>
                                    <div>
                                      <p className="font-medium">
                                        {referral.affiliate?.first_name} {referral.affiliate?.last_name}
                                      </p>
                                      <p className="text-xs text-muted-foreground">
                                        {referral.affiliate?.email}
                                      </p>
                                    </div>
                                  </TableCell>
                                  <TableCell>
                                    <p className="font-medium">
                                      {referral.profile?.full_name || referral.profile?.nickname || "Non renseigné"}
                                    </p>
                                    <p className="text-xs text-muted-foreground">
                                      {referral.referred_email}
                                    </p>
                                  </TableCell>
                                  <TableCell>
                                    <p className="text-sm">{referral.affiliate?.phone}</p>
                                  </TableCell>
                                  <TableCell>
                                    <Button
                                      variant="ghost"
                                      size="sm"
                                      onClick={() => handleCopyRIB(
                                        referral.affiliate?.iban || "",
                                        referral.affiliate?.bic || "",
                                        referral.affiliate?.id || ""
                                      )}
                                    >
                                      {copiedRIB === referral.affiliate?.id ? (
                                        <Check className="h-4 w-4" />
                                      ) : (
                                        <Copy className="h-4 w-4" />
                                      )}
                                    </Button>
                                  </TableCell>
                                  <TableCell>
                                    <span className="font-bold">6,99 €</span>
                                  </TableCell>
                                  <TableCell>
                                    {referral.payment_status === "payé" ? (
                                      <Badge variant="secondary">
                                        <Check className="h-3 w-3 mr-1" />
                                        Payé
                                      </Badge>
                                    ) : (
                                      <Badge variant="outline">En attente</Badge>
                                    )}
                                  </TableCell>
                                  <TableCell>
                                    {referral.payment_status === "en attente" && (
                                      <Button
                                        size="sm"
                                        onClick={() => handleMarkAsPaid(referral.id, paymentDate)}
                                      >
                                        Marquer payé
                                      </Button>
                                    )}
                                  </TableCell>
                                </TableRow>
                              ))}
                            </TableBody>
                          </Table>
                        </div>
                      );
                    })}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="affiliates">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Award className="h-5 w-5 text-primary" />
                  Top 10 Parrains
                </CardTitle>
                <CardDescription>
                  Classement par nombre de filleuls
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Rang</TableHead>
                      <TableHead>Parrain</TableHead>
                      <TableHead>Contact</TableHead>
                      <TableHead>Filleuls</TableHead>
                      <TableHead>Revenus générés</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {topAffiliates.map((stat, index) => (
                      <TableRow key={stat.affiliate.id}>
                        <TableCell>
                          <div className="flex items-center justify-center w-8 h-8 rounded-full bg-gradient-to-br from-primary to-primary-glow text-white font-bold">
                            {index + 1}
                          </div>
                        </TableCell>
                        <TableCell>
                          <div>
                            <p className="font-medium">
                              {stat.affiliate.first_name} {stat.affiliate.last_name}
                            </p>
                            <p className="text-xs text-muted-foreground">
                              {stat.affiliate.email}
                            </p>
                          </div>
                        </TableCell>
                        <TableCell>
                          <p className="text-sm">{stat.affiliate.phone}</p>
                        </TableCell>
                        <TableCell>
                          <Badge variant="secondary">{stat.count} filleuls</Badge>
                        </TableCell>
                        <TableCell>
                          <span className="font-bold text-primary">
                            {stat.earned.toFixed(2)} €
                          </span>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default AffiliateAdmin;