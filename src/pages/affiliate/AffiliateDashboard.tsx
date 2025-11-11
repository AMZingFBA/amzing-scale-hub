import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { Copy, LogOut, Users, Mail, User, Calendar, Euro, TrendingUp, Clock } from "lucide-react";
import { format, addMonths, addDays, isBefore } from "date-fns";
import { fr } from "date-fns/locale";

interface AffiliateUser {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  referralCode: string;
}

interface Referral {
  id: string;
  referred_email: string;
  signup_date: string;
  referred_user_id: string;
  profile?: {
    phone: string | null;
    nickname: string | null;
    full_name: string | null;
  };
}

const AffiliateDashboard = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState<AffiliateUser | null>(null);
  const [referrals, setReferrals] = useState<Referral[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const affiliateLink = `${window.location.origin}/auth?tab=signup&ref=${user?.referralCode || ""}`;

  useEffect(() => {
    const checkAccess = async () => {
      const affiliateUser = localStorage.getItem("affiliate_user");
      
      if (!affiliateUser) {
        navigate("/affiliate/login");
        return;
      }

      const userData = JSON.parse(affiliateUser);
      
      // Check if user is admin and redirect to admin page
      const { data: { user } } = await supabase.auth.getUser();
      if (user && user.email === 'amzingfba26@gmail.com') {
        navigate("/affiliate/admin");
        return;
      }
      
      setUser(userData);
      fetchReferrals(userData.id);
    };
    
    checkAccess();
  }, [navigate]);

  const fetchReferrals = async (userId: string) => {
    try {
      // Fetch all referrals first
      const { data: allReferrals, error: referralsError } = await supabase
        .from("affiliate_referrals")
        .select("*")
        .eq("referrer_user_id", userId);

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
        .select("id, phone, nickname, full_name")
        .in("id", referredUserIds);

      if (profilesError) throw profilesError;

      // Create a map of profiles for easy lookup
      const profilesMap = new Map(profiles?.map(p => [p.id, p]) || []);

      // Filter referrals to only show those with active VIP subscriptions and add profile data
      const vipUserIds = new Set(subscriptions?.map(s => s.user_id) || []);
      const vipReferrals = allReferrals
        .filter(r => vipUserIds.has(r.referred_user_id))
        .map(r => ({
          ...r,
          profile: profilesMap.get(r.referred_user_id)
        }))
        .sort((a, b) => new Date(b.signup_date).getTime() - new Date(a.signup_date).getTime());

      setReferrals(vipReferrals);
    } catch (error) {
      console.error("Error fetching referrals:", error);
      toast.error("Erreur lors du chargement des filleuls");
    } finally {
      setIsLoading(false);
    }
  };

  const handleCopyLink = () => {
    navigator.clipboard.writeText(affiliateLink);
    toast.success("Lien copié dans le presse-papier !");
  };

  const handleLogout = () => {
    localStorage.removeItem("affiliate_user");
    toast.success("Déconnexion réussie");
    navigate("/affiliate");
  };

  if (!user) return null;

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-secondary/20">
      <div className="container mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold mb-2">
              Bienvenue dans AMZing FBA Affiliate
            </h1>
            <p className="text-muted-foreground">
              {user.firstName} {user.lastName} • {user.email}
            </p>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" onClick={() => {
              window.open('https://amzingfba.com/contact', '_blank');
            }}>
              <Mail className="mr-2 h-4 w-4" />
              Contact
            </Button>
            <Button variant="outline" onClick={handleLogout}>
              <LogOut className="mr-2 h-4 w-4" />
              Déconnexion
            </Button>
          </div>
        </div>

        <div className="grid md:grid-cols-2 gap-6 mb-8">
          <Card>
            <CardHeader>
              <CardTitle>Ton lien d'affiliation</CardTitle>
              <CardDescription>
                Partage ce lien pour parrainer de nouveaux membres
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex gap-2">
                <Input
                  value={affiliateLink}
                  readOnly
                  className="flex-1"
                />
                <Button onClick={handleCopyLink}>
                  <Copy className="h-4 w-4" />
                </Button>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Users className="h-5 w-5" />
                Total filleuls VIP
              </CardTitle>
              <CardDescription>
                Nombre de personnes qui ont souscrit via ton lien
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-4xl font-bold">{referrals.length}</p>
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Tes filleuls</CardTitle>
            <CardDescription>
              Uniquement les personnes ayant souscrit à l'abonnement VIP
            </CardDescription>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <p className="text-center py-8 text-muted-foreground">Chargement...</p>
            ) : referrals.length === 0 ? (
              <p className="text-center py-8 text-muted-foreground">
                Aucun filleul VIP pour le moment. Partage ton lien et tes filleuls apparaîtront ici une fois qu'ils auront souscrit à l'abonnement !
              </p>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Nom</TableHead>
                    <TableHead>Email</TableHead>
                    <TableHead>Date d'inscription</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {referrals.map((referral) => (
                    <TableRow key={referral.id}>
                      <TableCell className="font-medium">
                        <div className="flex items-center gap-2">
                          <User className="h-4 w-4 text-muted-foreground" />
                          {referral.profile?.full_name || referral.profile?.nickname || "Non renseigné"}
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <Mail className="h-4 w-4 text-muted-foreground" />
                          {referral.referred_email}
                        </div>
                      </TableCell>
                      <TableCell>
                        {format(new Date(referral.signup_date), "dd MMM yyyy 'à' HH:mm", { locale: fr })}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            )}
          </CardContent>
        </Card>

        {/* Prochain paiement section */}
        <div className="mt-6 grid md:grid-cols-3 gap-6">
          <Card className="border-2 border-primary/20 bg-gradient-to-br from-primary/5 via-card to-card">
            <CardHeader>
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-primary to-primary-glow flex items-center justify-center shadow-glow">
                  <Calendar className="h-6 w-6 text-white" />
                </div>
                <div>
                  <CardDescription className="text-xs">Prochain versement</CardDescription>
                  <CardTitle className="text-lg">
                    {referrals.length > 0 ? (() => {
                      const nextPayment = referrals
                        .map(r => {
                          const signupDate = new Date(r.signup_date);
                          return addDays(addMonths(signupDate, 1), 7);
                        })
                        .filter(date => isBefore(new Date(), date))
                        .sort((a, b) => a.getTime() - b.getTime())[0];
                      
                      return nextPayment 
                        ? format(nextPayment, "dd MMM yyyy", { locale: fr })
                        : "Aucun prévu";
                    })() : "Aucun filleul"}
                  </CardTitle>
                </div>
              </div>
            </CardHeader>
          </Card>

          <Card className="border-2 border-secondary/20 bg-gradient-to-br from-secondary/5 via-card to-card">
            <CardHeader>
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-secondary to-secondary/80 flex items-center justify-center shadow-blue">
                  <Euro className="h-6 w-6 text-white" />
                </div>
                <div>
                  <CardDescription className="text-xs">Montant à recevoir</CardDescription>
                  <CardTitle className="text-lg">
                    {referrals.length > 0 ? (() => {
                      const activeReferrals = referrals.filter(r => {
                        const signupDate = new Date(r.signup_date);
                        const paymentDate = addDays(addMonths(signupDate, 1), 7);
                        return isBefore(new Date(), paymentDate);
                      });
                      return `${(activeReferrals.length * 6.99).toFixed(2)} €`;
                    })() : "0.00 €"}
                  </CardTitle>
                </div>
              </div>
            </CardHeader>
          </Card>

          <Card className="border-2 border-primary/20 bg-gradient-to-br from-primary/5 via-card to-card">
            <CardHeader>
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-primary to-primary-glow flex items-center justify-center shadow-glow">
                  <TrendingUp className="h-6 w-6 text-white" />
                </div>
                <div>
                  <CardDescription className="text-xs">Filleuls actifs</CardDescription>
                  <CardTitle className="text-lg">
                    {referrals.filter(r => {
                      const signupDate = new Date(r.signup_date);
                      const paymentDate = addDays(addMonths(signupDate, 1), 7);
                      return isBefore(new Date(), paymentDate);
                    }).length} filleuls
                  </CardTitle>
                </div>
              </div>
            </CardHeader>
          </Card>
        </div>

        {/* Détails des paiements à venir */}
        {referrals.length > 0 && (
          <Card className="mt-6">
            <CardHeader>
              <div className="flex items-center gap-3">
                <Clock className="h-5 w-5 text-primary" />
                <div>
                  <CardTitle>Calendrier des paiements</CardTitle>
                  <CardDescription>
                    Détail des commissions à recevoir pour chaque filleul (6,99 € par filleul)
                  </CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {referrals
                  .map(r => {
                    const signupDate = new Date(r.signup_date);
                    const paymentDate = addDays(addMonths(signupDate, 1), 7);
                    return { ...r, paymentDate };
                  })
                  .sort((a, b) => a.paymentDate.getTime() - b.paymentDate.getTime())
                  .map((referral) => {
                    const isPaid = isBefore(referral.paymentDate, new Date());
                    return (
                      <div 
                        key={referral.id}
                        className={`flex items-center justify-between p-4 rounded-xl border-2 transition-all ${
                          isPaid 
                            ? 'bg-muted/30 border-muted' 
                            : 'bg-gradient-to-r from-primary/5 to-secondary/5 border-primary/20 hover:border-primary/40'
                        }`}
                      >
                        <div className="flex items-center gap-4 flex-1">
                          <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                            isPaid ? 'bg-muted' : 'bg-gradient-to-br from-primary/20 to-secondary/20'
                          }`}>
                            <User className={`h-5 w-5 ${isPaid ? 'text-muted-foreground' : 'text-primary'}`} />
                          </div>
                          <div className="flex-1">
                            <p className={`font-semibold ${isPaid ? 'text-muted-foreground' : ''}`}>
                              {referral.profile?.full_name || referral.profile?.nickname || referral.referred_email}
                            </p>
                            <p className="text-sm text-muted-foreground">
                              Inscrit le {format(new Date(referral.signup_date), "dd MMM yyyy", { locale: fr })}
                            </p>
                          </div>
                        </div>
                        <div className="flex items-center gap-6">
                          <div className="text-right">
                            <p className={`text-sm text-muted-foreground ${isPaid ? 'line-through' : ''}`}>
                              {isPaid ? 'Payé le' : 'Paiement prévu le'}
                            </p>
                            <p className={`font-bold ${isPaid ? 'text-muted-foreground' : 'text-primary'}`}>
                              {format(referral.paymentDate, "dd MMM yyyy", { locale: fr })}
                            </p>
                          </div>
                          <div className={`px-4 py-2 rounded-lg font-bold text-lg ${
                            isPaid 
                              ? 'bg-muted text-muted-foreground' 
                              : 'bg-gradient-to-r from-primary to-primary-glow text-white'
                          }`}>
                            6,99 €
                          </div>
                        </div>
                      </div>
                    );
                  })}
              </div>
              
              <div className="mt-6 p-4 bg-gradient-to-r from-muted/50 to-muted/20 rounded-xl border border-border">
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
                    <Euro className="h-5 w-5 text-primary" />
                  </div>
                  <div className="space-y-1">
                    <p className="font-semibold">Comment ça marche ?</p>
                    <ul className="text-sm text-muted-foreground space-y-1">
                      <li>• Chaque filleul bénéficie de 7 jours d'essai gratuit</li>
                      <li>• Le premier paiement est effectué 1 mois + 7 jours après son inscription</li>
                      <li>• Tu reçois 6,99 € par filleul chaque mois tant qu'il reste abonné</li>
                      <li>• Les paiements sont virés sur ton RIB fourni lors de l'inscription</li>
                    </ul>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
};

export default AffiliateDashboard;
