import { useState, useEffect, useCallback, useRef } from "react";
import { useNavigate } from "react-router-dom";
import {
  ArrowLeft, Upload, Send, CheckCheck, AlertCircle,
  Loader2, Trash2, X, Users, Pause, Play, Square, Download, Moon, Sun,
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useAdmin } from "@/hooks/use-admin";
import { useAuth } from "@/hooks/use-auth";
import { supabase } from "@/integrations/supabase/client";
import Papa from "papaparse";

interface Contact {
  name: string;
  phone: string;
}

interface SendResult {
  recipient: string;
  name: string;
  success: boolean;
  error?: string;
  timestamp: string;
}

interface JobState {
  id: string;
  status: string;
  total: number;
  sent: number;
  failed: number;
  current_recipient: string | null;
  results: SendResult[];
}

export default function AdminIMessageBulk() {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { isAdmin, isLoading: isAdminLoading } = useAdmin();
  const { user } = useAuth();

  const [message, setMessage] = useState("");
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [manualInput, setManualInput] = useState("");
  const [job, setJob] = useState<JobState | null>(null);
  const [dark, setDark] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const pollRef = useRef<ReturnType<typeof setInterval> | null>(null);

  // Auth guard
  useEffect(() => {
    if (!user) { navigate("/auth"); return; }
    if (!isAdminLoading && !isAdmin) {
      toast({ title: "Accès refusé", variant: "destructive" });
      navigate("/");
    }
  }, [user, isAdmin, isAdminLoading, navigate, toast]);

  // Poll job status
  const pollJob = useCallback(async (jobId: string) => {
    const { data } = await (supabase as any)
      .from("imessage_jobs")
      .select("*")
      .eq("id", jobId)
      .single();
    if (data) {
      setJob({
        id: data.id,
        status: data.status,
        total: data.total,
        sent: data.sent,
        failed: data.failed,
        current_recipient: data.current_recipient,
        results: data.results || [],
      });
      if (data.status === "done" || data.status === "stopped") {
        clearInterval(pollRef.current!);
        pollRef.current = null;
        toast({ title: data.status === "done" ? `✅ Envoi terminé — ${data.sent} envoyés` : "⛔ Envoi stoppé" });
      }
    }
  }, [toast]);

  // Cleanup
  useEffect(() => () => { if (pollRef.current) clearInterval(pollRef.current); }, []);

  const addManualContacts = useCallback(() => {
    if (!manualInput.trim()) return;
    const lines = manualInput.split(/[\n,;]+/).map((s) => s.trim()).filter(Boolean);
    setContacts((prev) => [...prev, ...lines.map((line) => ({ name: "", phone: line }))]);
    setManualInput("");
    toast({ title: `${lines.length} contact(s) ajouté(s)` });
  }, [manualInput, toast]);

  const handleCSVUpload = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    Papa.parse(file, {
      header: true,
      skipEmptyLines: true,
      complete: (results) => {
        const parsed: Contact[] = (results.data as any[])
          .map((row) => ({
            name: row.name || row.nom || "",
            phone: row.phone || row.telephone || row.tel || row.email || "",
          }))
          .filter((c) => c.phone);
        setContacts((prev) => [...prev, ...parsed]);
        toast({ title: `${parsed.length} contact(s) importés` });
      },
    });
    e.target.value = "";
  }, [toast]);

  const sendViaIPhone = () => {
    if (!message.trim() || contacts.length === 0) return;
    const phones = contacts.map((c) => c.phone).join("|");
    const payload = encodeURIComponent(`${message}|${phones}`);
    window.location.href = `shortcuts://run-shortcut?name=AMZing%20Sender&input=text&text=${payload}`;
  };

  const startSend = async () => {
    if (!message.trim() || contacts.length === 0) return;
    const { data, error } = await (supabase as any)
      .from("imessage_jobs")
      .insert({ message, contacts, total: contacts.length, status: "pending" })
      .select()
      .single();

    if (error || !data) {
      toast({ title: "Erreur création du job", description: error?.message, variant: "destructive" });
      return;
    }

    setJob({ id: data.id, status: "pending", total: contacts.length, sent: 0, failed: 0, current_recipient: null, results: [] });
    toast({ title: `🚀 Job créé — ${contacts.length} contacts en attente` });

    pollRef.current = setInterval(() => pollJob(data.id), 1500);
  };

  const pauseJob = async () => {
    if (!job) return;
    await (supabase as any).from("imessage_jobs").update({ status: "paused" }).eq("id", job.id);
    setJob((j) => j ? { ...j, status: "paused" } : j);
  };

  const resumeJob = async () => {
    if (!job) return;
    await (supabase as any).from("imessage_jobs").update({ status: "running" }).eq("id", job.id);
    setJob((j) => j ? { ...j, status: "running" } : j);
  };

  const stopJob = async () => {
    if (!job) return;
    await (supabase as any).from("imessage_jobs").update({ status: "stopped" }).eq("id", job.id);
    setJob((j) => j ? { ...j, status: "stopped" } : j);
    if (pollRef.current) { clearInterval(pollRef.current); pollRef.current = null; }
  };

  const exportCSV = () => {
    if (!job?.results?.length) return;
    const header = "nom,contact,statut,erreur,timestamp\n";
    const rows = job.results.map((r) =>
      `"${r.name || ""}","${r.recipient}","${r.success ? "OK" : "ECHEC"}","${r.error || ""}","${r.timestamp}"`
    ).join("\n");
    const blob = new Blob([header + rows], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url; a.download = "rapport-imessage.csv"; a.click();
    URL.revokeObjectURL(url);
  };

  const isActive = job && (job.status === "running" || job.status === "pending" || job.status === "paused");
  const progress = job ? Math.round(((job.sent + job.failed) / (job.total || 1)) * 100) : 0;

  if (isAdminLoading) {
    return <div className="min-h-screen flex items-center justify-center"><Loader2 className="h-8 w-8 animate-spin text-blue-500" /></div>;
  }

  return (
    <div className={`min-h-screen transition-colors ${dark ? "bg-slate-950 text-slate-100" : "bg-slate-50 text-slate-900"}`}>
      <div className="max-w-5xl mx-auto p-4 md:p-8">

        {/* Top bar */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-3">
            <button onClick={() => navigate("/admin/tickets")} className={`p-2 rounded-lg transition ${dark ? "hover:bg-slate-800" : "hover:bg-slate-200"}`}>
              <ArrowLeft className="h-5 w-5" />
            </button>
            <div>
              <h1 className="text-2xl font-bold tracking-tight">iMessage Bulk Sender</h1>
              <p className="text-sm text-slate-500">Envoi en masse · Aucune config requise</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <div className="flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
              <div className="w-2 h-2 rounded-full bg-green-500" />
              Connecté via Supabase
            </div>
            <button onClick={() => setDark(!dark)} className={`p-2 rounded-lg transition ${dark ? "hover:bg-slate-800" : "hover:bg-slate-200"}`}>
              {dark ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
            </button>
          </div>
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          {/* Message */}
          <div className={`rounded-xl p-6 border shadow-sm ${dark ? "bg-slate-900 border-slate-800" : "bg-white border-slate-200"}`}>
            <h2 className="text-lg font-semibold mb-4 flex items-center gap-2"><Send className="h-5 w-5 text-blue-500" /> Message</h2>
            <textarea
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Tapez votre message ici..."
              rows={8}
              className={`w-full rounded-lg p-3 text-sm resize-none focus:outline-none focus:ring-2 focus:ring-blue-500 border ${dark ? "bg-slate-800 border-slate-700 text-white" : "bg-slate-50 border-slate-200"}`}
            />
            <p className="mt-2 text-xs text-slate-500">{message.length} caractères</p>
          </div>

          {/* Contacts */}
          <div className={`rounded-xl p-6 border shadow-sm ${dark ? "bg-slate-900 border-slate-800" : "bg-white border-slate-200"}`}>
            <h2 className="text-lg font-semibold mb-4 flex items-center gap-2"><Users className="h-5 w-5 text-blue-500" /> Contacts ({contacts.length})</h2>
            <textarea
              value={manualInput}
              onChange={(e) => setManualInput(e.target.value)}
              placeholder={"+33612345678\nexample@icloud.com"}
              rows={3}
              className={`w-full rounded-lg p-3 text-sm resize-none focus:outline-none focus:ring-2 focus:ring-blue-500 border ${dark ? "bg-slate-800 border-slate-700 text-white" : "bg-slate-50 border-slate-200"}`}
            />
            <div className="flex gap-2 mt-3">
              <button onClick={addManualContacts} className="flex-1 py-2.5 rounded-lg text-sm font-medium text-white bg-blue-500 hover:bg-blue-600 transition">
                Ajouter
              </button>
              <button onClick={() => fileInputRef.current?.click()} className={`flex-1 py-2.5 rounded-lg text-sm font-medium flex items-center justify-center gap-2 border transition ${dark ? "border-slate-700 hover:bg-slate-800" : "border-slate-200 hover:bg-slate-50"}`}>
                <Upload className="h-4 w-4" /> CSV
                <input ref={fileInputRef} type="file" accept=".csv" onChange={handleCSVUpload} className="hidden" />
              </button>
            </div>
            {contacts.length > 0 && (
              <>
                <div className={`mt-4 max-h-44 overflow-y-auto rounded-lg p-2 ${dark ? "bg-slate-800" : "bg-slate-50"}`}>
                  {contacts.map((c, i) => (
                    <div key={i} className={`flex items-center justify-between py-1.5 px-2 text-sm rounded ${dark ? "hover:bg-slate-700" : "hover:bg-slate-100"}`}>
                      <span className="truncate">{c.name && <span className="font-medium">{c.name} — </span>}{c.phone}</span>
                      <button onClick={() => setContacts((p) => p.filter((_, j) => j !== i))} className="text-red-500 ml-2"><X className="h-3.5 w-3.5" /></button>
                    </div>
                  ))}
                </div>
                <button onClick={() => setContacts([])} className="mt-2 text-xs text-red-500 hover:text-red-700 flex items-center gap-1">
                  <Trash2 className="h-3 w-3" /> Tout supprimer
                </button>
              </>
            )}
          </div>
        </div>

        {/* Actions */}
        <div className={`mt-6 rounded-xl p-6 border shadow-sm ${dark ? "bg-slate-900 border-slate-800" : "bg-white border-slate-200"}`}>
          {!isActive ? (
            <div className="flex gap-3">
              <button
                onClick={sendViaIPhone}
                disabled={!message.trim() || contacts.length === 0}
                className="flex-1 py-3 rounded-lg text-white font-semibold text-sm bg-green-500 hover:bg-green-600 disabled:opacity-40 disabled:cursor-not-allowed transition flex items-center justify-center gap-2"
              >
                📱 iPhone → Tout le monde ({contacts.length})
              </button>
              <button
                onClick={startSend}
                disabled={!message.trim() || contacts.length === 0}
                className="flex-1 py-3 rounded-lg text-white font-semibold text-sm bg-blue-500 hover:bg-blue-600 disabled:opacity-40 disabled:cursor-not-allowed transition flex items-center justify-center gap-2"
              >
                <Send className="h-4 w-4" /> Mac → iPhones uniquement
              </button>
              {job?.results && job.results.length > 0 && (
                <button onClick={exportCSV} className={`py-3 px-5 rounded-lg text-sm font-medium flex items-center gap-2 border transition ${dark ? "border-slate-700 hover:bg-slate-800" : "border-slate-200 hover:bg-slate-50"}`}>
                  <Download className="h-4 w-4" /> Rapport
                </button>
              )}
            </div>
          ) : (
            <div className="flex gap-3">
              {job.status !== "paused" ? (
                <button onClick={pauseJob} className="flex-1 py-3 rounded-lg font-semibold text-sm text-white bg-yellow-500 hover:bg-yellow-600 transition flex items-center justify-center gap-2">
                  <Pause className="h-4 w-4" /> Pause
                </button>
              ) : (
                <button onClick={resumeJob} className="flex-1 py-3 rounded-lg font-semibold text-sm text-white bg-blue-500 hover:bg-blue-600 transition flex items-center justify-center gap-2">
                  <Play className="h-4 w-4" /> Reprendre
                </button>
              )}
              <button onClick={stopJob} className="flex-1 py-3 rounded-lg font-semibold text-sm text-white bg-red-500 hover:bg-red-600 transition flex items-center justify-center gap-2">
                <Square className="h-4 w-4" /> Arrêter
              </button>
            </div>
          )}

          {/* Progress */}
          {job && (
            <div className="mt-5">
              <div className="flex justify-between text-sm mb-2 text-slate-500">
                <span>
                  {job.status === "pending" && "⏳ En attente du worker Mac..."}
                  {job.status === "running" && `En cours : ${job.sent + job.failed} / ${job.total}`}
                  {job.status === "paused" && "⏸ En pause"}
                  {job.status === "done" && `✅ Terminé : ${job.sent + job.failed} / ${job.total}`}
                  {job.status === "stopped" && "⛔ Stoppé"}
                </span>
                <span>{progress}%</span>
              </div>
              <div className={`w-full h-2.5 rounded-full overflow-hidden ${dark ? "bg-slate-800" : "bg-slate-200"}`}>
                <div className={`h-full rounded-full transition-all duration-500 ${job.status === "done" ? "bg-green-500" : "bg-blue-500"}`} style={{ width: `${progress}%` }} />
              </div>
              <div className="flex gap-6 mt-3 text-sm">
                <span className="text-green-500 flex items-center gap-1"><CheckCheck className="h-4 w-4" /> {job.sent} envoyés</span>
                <span className="text-red-500 flex items-center gap-1"><AlertCircle className="h-4 w-4" /> {job.failed} échoués</span>
                {job.current_recipient && job.status === "running" && (
                  <span className="text-slate-500 truncate">→ {job.current_recipient}</span>
                )}
              </div>

              {job.results.length > 0 && (
                <div className={`mt-4 max-h-52 overflow-y-auto rounded-lg p-3 text-xs ${dark ? "bg-slate-800" : "bg-slate-50"}`}>
                  {job.results.map((r, i) => (
                    <div key={i} className={`flex justify-between py-1.5 ${i > 0 ? "border-t" : ""} ${dark ? "border-slate-700" : "border-slate-100"}`}>
                      <span>{r.name ? `${r.name} (${r.recipient})` : r.recipient}</span>
                      <span className={r.success ? "text-green-500" : "text-red-500"}>
                        {r.success ? "Envoyé" : (r.error || "Erreur").substring(0, 60)}
                      </span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>

        <p className="text-center mt-6 text-xs text-slate-400">
          iMessage Bulk Sender · Admin · Pense à lancer <code className="bg-slate-100 px-1 rounded">node server.js</code> sur ton Mac
        </p>
      </div>
    </div>
  );
}

