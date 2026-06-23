import { useEffect, useState } from "react";
import { Navigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useAdmin } from "@/hooks/use-admin";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { toast } from "@/hooks/use-toast";
import { Loader2, RefreshCw, Eye, Send } from "lucide-react";
import SEO from "@/components/SEO";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

interface SyncRow {
  id: string;
  event: string;
  external_id: string;
  user_id: string | null;
  payload: any;
  status: "pending" | "success" | "failed" | "retrying";
  http_status: number | null;
  response_body: string | null;
  retry_count: number;
  last_attempt_at: string | null;
  next_retry_at: string | null;
  error_message: string | null;
  created_at: string;
}

const statusColor: Record<string, string> = {
  success: "bg-green-500/15 text-green-700 dark:text-green-300",
  failed: "bg-red-500/15 text-red-700 dark:text-red-300",
  pending: "bg-yellow-500/15 text-yellow-700 dark:text-yellow-300",
  retrying: "bg-blue-500/15 text-blue-700 dark:text-blue-300",
};

export default function AdminCredarisSync() {
  const { isAdmin, isLoading: adminLoading } = useAdmin();
  const [rows, setRows] = useState<SyncRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<"all" | "failed" | "success" | "pending">("all");
  const [sending, setSending] = useState<string | null>(null);

  const fetchRows = async () => {
    setLoading(true);
    let q = supabase
      .from("credaris_sync_log")
      .select("*")
      .order("created_at", { ascending: false })
      .limit(200);
    if (filter !== "all") q = q.eq("status", filter);
    const { data, error } = await q;
    if (error) toast({ title: "Erreur", description: error.message, variant: "destructive" });
    setRows((data as any) || []);
    setLoading(false);
  };

  useEffect(() => {
    if (isAdmin) fetchRows();
  }, [isAdmin, filter]);

  const resend = async (row: SyncRow) => {
    setSending(row.id);
    const { data, error } = await supabase.functions.invoke("notify-credaris", {
      body: {
        event: row.event,
        external_id: row.external_id,
        user_id: row.user_id,
        payload: row.payload,
        retry: true,
      },
    });
    setSending(null);
    if (error) {
      toast({ title: "Échec", description: error.message, variant: "destructive" });
    } else {
      toast({ title: "Renvoyé", description: JSON.stringify(data).slice(0, 200) });
      fetchRows();
    }
  };

  const sendTest = async () => {
    setSending("test");
    const { data, error } = await supabase.functions.invoke("credaris-manual-dossier", {
      body: { test: true },
    });
    setSending(null);
    if (error) toast({ title: "Échec test", description: error.message, variant: "destructive" });
    else toast({ title: "Test envoyé", description: JSON.stringify(data).slice(0, 300) });
    fetchRows();
  };

  if (adminLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="animate-spin" />
      </div>
    );
  }
  if (!isAdmin) return <Navigate to="/" replace />;

  return (
    <div className="min-h-screen flex flex-col">
      <SEO title="Sync Credaris — Admin" />
      <Navbar />
      <main className="flex-1 container py-8 space-y-6">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <h1 className="text-3xl font-bold">Sync Credaris</h1>
            <p className="text-muted-foreground">
              Journal des webhooks envoyés à Credaris (recouvrement).
            </p>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" onClick={fetchRows}>
              <RefreshCw className="w-4 h-4 mr-2" /> Rafraîchir
            </Button>
            <Button onClick={sendTest} disabled={sending === "test"}>
              {sending === "test" ? (
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              ) : (
                <Send className="w-4 h-4 mr-2" />
              )}
              Envoyer un test
            </Button>
          </div>
        </div>

        <div className="flex gap-2 flex-wrap">
          {(["all", "pending", "failed", "success"] as const).map((f) => (
            <Button
              key={f}
              variant={filter === f ? "default" : "outline"}
              size="sm"
              onClick={() => setFilter(f)}
            >
              {f === "all" ? "Tous" : f}
            </Button>
          ))}
        </div>

        {loading ? (
          <div className="flex justify-center py-12">
            <Loader2 className="animate-spin" />
          </div>
        ) : rows.length === 0 ? (
          <Card>
            <CardContent className="py-12 text-center text-muted-foreground">
              Aucun envoi trouvé.
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-3">
            {rows.map((r) => (
              <Card key={r.id}>
                <CardHeader className="pb-3">
                  <div className="flex items-start justify-between gap-3 flex-wrap">
                    <div>
                      <CardTitle className="text-base">{r.event}</CardTitle>
                      <p className="text-xs text-muted-foreground mt-1">
                        {new Date(r.created_at).toLocaleString("fr-FR")} •{" "}
                        <span className="font-mono">{r.external_id}</span>
                      </p>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge className={statusColor[r.status] || ""}>{r.status}</Badge>
                      {r.http_status && (
                        <Badge variant="outline">HTTP {r.http_status}</Badge>
                      )}
                      {r.retry_count > 0 && (
                        <Badge variant="outline">retry {r.retry_count}</Badge>
                      )}
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="space-y-2">
                  {r.error_message && (
                    <p className="text-sm text-red-600 dark:text-red-400">
                      {r.error_message}
                    </p>
                  )}
                  {r.response_body && (
                    <p className="text-xs font-mono bg-muted p-2 rounded max-h-24 overflow-auto">
                      {r.response_body}
                    </p>
                  )}
                  <div className="flex gap-2">
                    <Dialog>
                      <DialogTrigger asChild>
                        <Button variant="outline" size="sm">
                          <Eye className="w-4 h-4 mr-2" /> Payload
                        </Button>
                      </DialogTrigger>
                      <DialogContent className="max-w-3xl max-h-[80vh] overflow-auto">
                        <DialogHeader>
                          <DialogTitle>Payload — {r.event}</DialogTitle>
                        </DialogHeader>
                        <pre className="text-xs bg-muted p-3 rounded overflow-auto">
                          {JSON.stringify(r.payload, null, 2)}
                        </pre>
                      </DialogContent>
                    </Dialog>
                    <Button
                      size="sm"
                      onClick={() => resend(r)}
                      disabled={sending === r.id}
                    >
                      {sending === r.id ? (
                        <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      ) : (
                        <Send className="w-4 h-4 mr-2" />
                      )}
                      Renvoyer
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </main>
      <Footer />
    </div>
  );
}
