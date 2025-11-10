import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { Copy, LogOut, Users, Mail, Phone, User } from "lucide-react";
import { format } from "date-fns";
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
    const affiliateUser = localStorage.getItem("affiliate_user");
    
    if (!affiliateUser) {
      navigate("/affiliate/login");
      return;
    }

    const userData = JSON.parse(affiliateUser);
    setUser(userData);
    fetchReferrals(userData.id);
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
              const subject = encodeURIComponent('Question sur mon programme d\'affiliation');
              window.location.href = `mailto:amzingfba26@gmail.com?subject=${subject}`;
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
                    <TableHead>Téléphone</TableHead>
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
                        <div className="flex items-center gap-2">
                          <Phone className="h-4 w-4 text-muted-foreground" />
                          {referral.profile?.phone || "Non renseigné"}
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

        <Card className="mt-6">
          <CardHeader>
            <CardTitle>Prochain paiement</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground">
              Les paiements sont effectués chaque mois sur le RIB fourni lors de votre inscription.
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default AffiliateDashboard;
