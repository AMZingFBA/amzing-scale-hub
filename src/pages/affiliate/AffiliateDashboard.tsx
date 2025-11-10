import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { Copy, LogOut, Users } from "lucide-react";
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
  payment_status: string;
  payment_month: string | null;
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
      const { data, error } = await supabase
        .from("affiliate_referrals")
        .select("*")
        .eq("referrer_user_id", userId)
        .order("signup_date", { ascending: false });

      if (error) throw error;

      setReferrals(data || []);
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
          <Button variant="outline" onClick={handleLogout}>
            <LogOut className="mr-2 h-4 w-4" />
            Déconnexion
          </Button>
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
                Total filleuls
              </CardTitle>
              <CardDescription>
                Nombre de personnes inscrites via ton lien
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
              Liste de toutes les personnes que tu as parrainées
            </CardDescription>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <p className="text-center py-8 text-muted-foreground">Chargement...</p>
            ) : referrals.length === 0 ? (
              <p className="text-center py-8 text-muted-foreground">
                Aucun filleul pour le moment. Partage ton lien pour commencer !
              </p>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Email du filleul</TableHead>
                    <TableHead>Date d'inscription</TableHead>
                    <TableHead>Statut de paiement</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {referrals.map((referral) => (
                    <TableRow key={referral.id}>
                      <TableCell className="font-medium">{referral.referred_email}</TableCell>
                      <TableCell>
                        {format(new Date(referral.signup_date), "dd MMMM yyyy", { locale: fr })}
                      </TableCell>
                      <TableCell>
                        <Badge variant={referral.payment_status === "payé" ? "default" : "secondary"}>
                          {referral.payment_status}
                        </Badge>
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
