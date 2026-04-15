import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useAdmin } from "@/hooks/use-admin";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import SEO from "@/components/SEO";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { RefreshCw, AlertTriangle, CheckCircle, Clock, ExternalLink } from "lucide-react";
import { toast } from "sonner";

interface FailedPayment {
  id: string;
  user_id: string;
  email: string;
  full_name: string | null;
  phone: string | null;
  stripe_customer_id: string | null;
  stripe_invoice_id: string | null;
  amount: number;
  currency: string;
  failure_reason: string | null;
  attempt_count: number;
  email_sent: boolean;
  email_sent_at: string | null;
  rubypayeur_submitted: boolean;
  rubypayeur_ref: string | null;
  rubypayeur_status: string | null;
  resolved: boolean;
  resolved_at: string | null;
  notes: string | null;
  created_at: string;
}

const AdminFailedPayments = () => {
  const { isAdmin, isLoading: adminLoading } = useAdmin();
  const navigate = useNavigate();
  const [payments, setPayments] = useState<FailedPayment[]>([]);
  const [loading, setLoading] = useState(true);
  const [showResolved, setShowResolved] = useState(false);

  useEffect(() => {
    if (!adminLoading && !isAdmin) {
      navigate("/");
    }
  }, [isAdmin, adminLoading, navigate]);

  const fetchPayments = async () => {
    setLoading(true);
    let query = supabase
      .from("failed_payments")
      .select("*")
      .order("created_at", { ascending: false });

    if (!showResolved) {
      query = query.eq("resolved", false);
    }

    const { data, error } = await query;
    if (error) {
      toast.error("Erreur lors du chargement des impayés");
      console.error(error);
    } else {
      setPayments((data as unknown as FailedPayment[]) || []);
    }
    setLoading(false);
  };

  useEffect(() => {
    if (isAdmin) {
      fetchPayments();
    }
  }, [isAdmin, showResolved]);

  const markAsResolved = async (id: string) => {
    const { error } = await supabase
      .from("failed_payments")
      .update({ resolved: true, resolved_at: new Date().toISOString() } as any)
      .eq("id", id);

    if (error) {
      toast.error("Erreur");
    } else {
      toast.success("Marqué comme résolu");
      fetchPayments();
    }
  };

  const getStatusBadge = (payment: FailedPayment) => {
    if (payment.resolved) {
      return <Badge className="bg-green-500/20 text-green-400 border-green-500/30">✅ Résolu</Badge>;
    }
    if (payment.rubypayeur_submitted && payment.rubypayeur_ref) {
      return <Badge className="bg-blue-500/20 text-blue-400 border-blue-500/30">🏦 Rubypayeur</Badge>;
    }
    if (payment.email_sent) {
      return <Badge className="bg-yellow-500/20 text-yellow-400 border-yellow-500/30">📧 Relancé</Badge>;
    }
    return <Badge className="bg-red-500/20 text-red-400 border-red-500/30">🔴 Impayé</Badge>;
  };

  const PipelineSteps = ({ payment }: { payment: FailedPayment }) => {
    const steps = [
      { label: "Paiement échoué", icon: "❌", done: true, date: payment.created_at },
      { label: "Email relance", icon: "📧", done: payment.email_sent, date: payment.email_sent_at },
      { label: "Envoyé Rubypayeur", icon: "📤", done: payment.rubypayeur_submitted, date: payment.rubypayeur_submitted_at },
      { label: "Réf. Rubypayeur", icon: "🏦", done: !!payment.rubypayeur_ref, date: null },
      { label: "Résolu", icon: "✅", done: payment.resolved, date: payment.resolved_at },
    ];

    return (
      <div className="flex items-center gap-1 flex-wrap">
        {steps.map((step, i) => (
          <div key={i} className="flex items-center gap-1">
            <div className={`flex flex-col items-center ${step.done ? '' : 'opacity-30'}`}>
              <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm ${
                step.done 
                  ? 'bg-green-500/20 border border-green-500/40' 
                  : 'bg-muted border border-border'
              }`}>
                {step.icon}
              </div>
              <span className="text-[10px] text-muted-foreground mt-0.5 text-center max-w-[60px] leading-tight">{step.label}</span>
              {step.done && step.date && (
                <span className="text-[9px] text-muted-foreground">
                  {new Date(step.date).toLocaleDateString('fr-FR', { day: '2-digit', month: '2-digit' })}
                </span>
              )}
            </div>
            {i < steps.length - 1 && (
              <div className={`w-4 h-0.5 mb-6 ${steps[i + 1].done ? 'bg-green-500/40' : 'bg-border'}`} />
            )}
          </div>
        ))}
      </div>
    );
  };

  const unresolvedCount = payments.filter(p => !p.resolved).length;
  const totalAmount = payments.filter(p => !p.resolved).reduce((sum, p) => sum + p.amount, 0);
  const rubypayeurCount = payments.filter(p => p.rubypayeur_submitted && !p.resolved).length;

  if (adminLoading) return null;
  if (!isAdmin) return null;

  return (
    <div className="min-h-screen bg-background">
      <SEO title="Admin - Impayés" description="Gestion des impayés et recouvrement" />
      <Navbar />
      <div className="container mx-auto px-4 py-8 pt-24">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl font-bold text-foreground">💰 Gestion des Impayés</h1>
            <p className="text-muted-foreground mt-1">Suivi automatique des paiements échoués et recouvrement Rubypayeur</p>
          </div>
          <Button onClick={fetchPayments} variant="outline" size="sm">
            <RefreshCw className="h-4 w-4 mr-2" />
            Actualiser
          </Button>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm text-muted-foreground flex items-center gap-2">
                <AlertTriangle className="h-4 w-4 text-red-400" />
                Impayés en cours
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-2xl font-bold text-red-400">{unresolvedCount}</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm text-muted-foreground">Montant total dû</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-2xl font-bold text-foreground">{totalAmount.toFixed(2)} €</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm text-muted-foreground flex items-center gap-2">
                <Clock className="h-4 w-4 text-blue-400" />
                Chez Rubypayeur
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-2xl font-bold text-blue-400">{rubypayeurCount}</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm text-muted-foreground flex items-center gap-2">
                <CheckCircle className="h-4 w-4 text-green-400" />
                Résolus
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-2xl font-bold text-green-400">{payments.filter(p => p.resolved).length}</p>
            </CardContent>
          </Card>
        </div>

        {/* Filter */}
        <div className="flex gap-2 mb-4">
          <Button
            variant={!showResolved ? "default" : "outline"}
            size="sm"
            onClick={() => setShowResolved(false)}
          >
            En cours
          </Button>
          <Button
            variant={showResolved ? "default" : "outline"}
            size="sm"
            onClick={() => setShowResolved(true)}
          >
            Tous
          </Button>
        </div>

        {/* Table */}
        <Card>
          <CardContent className="p-0">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Client</TableHead>
                  <TableHead>Montant</TableHead>
                  <TableHead>Tentatives</TableHead>
                  <TableHead>Statut</TableHead>
                  <TableHead>Rubypayeur</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {loading ? (
                  <TableRow>
                    <TableCell colSpan={7} className="text-center py-8 text-muted-foreground">
                      Chargement...
                    </TableCell>
                  </TableRow>
                ) : payments.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={7} className="text-center py-8 text-muted-foreground">
                      🎉 Aucun impayé {!showResolved ? "en cours" : ""}
                    </TableCell>
                  </TableRow>
                ) : (
                  payments.map((payment) => (
                    <TableRow key={payment.id}>
                      <TableCell>
                        <div>
                          <p className="font-medium text-foreground">{payment.full_name || 'N/A'}</p>
                          <p className="text-sm text-muted-foreground">{payment.email}</p>
                          {payment.phone && <p className="text-xs text-muted-foreground">{payment.phone}</p>}
                        </div>
                      </TableCell>
                      <TableCell>
                        <span className="font-bold text-red-400">{payment.amount.toFixed(2)} {payment.currency}</span>
                      </TableCell>
                      <TableCell>
                        <Badge variant="outline">{payment.attempt_count}x</Badge>
                      </TableCell>
                      <TableCell>{getStatusBadge(payment)}</TableCell>
                      <TableCell>
                        {payment.rubypayeur_ref ? (
                          <div className="flex items-center gap-1">
                            <span className="text-sm font-mono text-blue-400">{payment.rubypayeur_ref}</span>
                            <a
                              href={`https://rubypayeur.com/mon-compte`}
                              target="_blank"
                              rel="noopener noreferrer"
                            >
                              <ExternalLink className="h-3 w-3 text-muted-foreground" />
                            </a>
                          </div>
                        ) : payment.rubypayeur_submitted ? (
                          <span className="text-sm text-yellow-400">En cours...</span>
                        ) : (
                          <span className="text-sm text-muted-foreground">—</span>
                        )}
                      </TableCell>
                      <TableCell>
                        <span className="text-sm text-muted-foreground">
                          {new Date(payment.created_at).toLocaleDateString('fr-FR', {
                            day: '2-digit', month: '2-digit', year: 'numeric'
                          })}
                        </span>
                      </TableCell>
                      <TableCell>
                        {!payment.resolved && (
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => markAsResolved(payment.id)}
                          >
                            <CheckCircle className="h-3 w-3 mr-1" />
                            Résolu
                          </Button>
                        )}
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </CardContent>
        </Card>

        {payments.length > 0 && (
          <p className="text-xs text-muted-foreground mt-4 text-center">
            Les impayés sont automatiquement enregistrés, un email de relance est envoyé et le dossier est soumis à Rubypayeur.
          </p>
        )}
      </div>
      <Footer />
    </div>
  );
};

export default AdminFailedPayments;
