import { useState, useEffect, useCallback, useRef } from "react";
import { useNavigate } from "react-router-dom";
import {
  ArrowLeft, Upload, Send, CheckCheck, AlertCircle,
  Loader2, Trash2, X, Users, Pause, Play, Square, Download, Moon, Sun, Settings,
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useAdmin } from "@/hooks/use-admin";
import { useAuth } from "@/hooks/use-auth";
import Papa from "papaparse";
import { supabase } from "@/integrations/supabase/client";

// iMessage Bulk Sender - Admin only
const DEFAULT_BACKEND = "http://localhost:3001";
function getSavedBackendUrl(): string {
  return localStorage.getItem("imessage_backend_url") || DEFAULT_BACKEND;
}

async function fetchBackendUrlFromSupabase(): Promise<string | null> {
  try {
    const { data } = await supabase
      .from("app_config" as any)
      .select("value")
      .eq("key", "imessage_backend_url")
      .single();
    return (data as any)?.value ?? null;
  } catch {
    return null;
  }
}

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

interface SendStatus {
  active: boolean;
  paused: boolean;
  total: number;
  sent: number;
  failed: number;
  current: string | null;
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
  const [status, setStatus] = useState<SendStatus | null>(null);
  const [sending, setSending] = useState(false);
  const [paused, setPaused] = useState(false);
  const [dark, setDark] = useState(false);
  const [backendOnline, setBackendOnline] = useState<boolean | null>(null);
  const [backendUrl, setBackendUrl] = useState(getSavedBackendUrl);
  const [showSettings, setShowSettings] = useState(false);
  const pollRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const apiUrl = `${backendUrl.replace(/\/+$/, "")}/api`;

  // Auth guard
  useEffect(() => {
    if (!user) { navigate("/auth"); return; }
    if (!isAdminLoading && !isAdmin) {
      toast({ title: "Accès refusé", description: "Réservé aux administrateurs.", variant: "destructive" });
      navigate("/");
    }
  }, [user, isAdmin, isAdminLoading, navigate, toast]);

  // Fetch backend URL from Supabase on mount (auto-configured via tunnel)
  useEffect(() => {
    fetchBackendUrlFromSupabase().then((url) => {
      if (url) {
        setBackendUrl(url);
        localStorage.setItem("imessage_backend_url", url);
      }
    });
  }, []);

  // Check backend connectivity
  const checkBackend = useCallback(() => {
    fetch(`${apiUrl}/status`).then(() => setBackendOnline(true)).catch(() => setBackendOnline(false));
  }, [apiUrl]);
  useEffect(() => { checkBackend(); }, [checkBackend]);

  function saveBackendUrl() {
    localStorage.setItem("imessage_backend_url", backendUrl);
    checkBackend();
    toast({ title: "URL sauvegardée" });
  }

  // Poll status
  useEffect(() => {
    if (sending) {
      pollRef.current = setInterval(async () => {
        try {
          const res = await fetch(`${apiUrl}/status`);
          const data: SendStatus = await res.json();
          setStatus(data);
          if (!data.active) {
            setSending(false);
            clearInterval(pollRef.current!);
          }
        } catch {}
      }, 1000);
    }
    return () => { if (pollRef.current) clearInterval(pollRef.current); };
  }, [sending]);

  const addManualContacts = useCallback(() => {
    if (!manualInput.trim()) return;
    const lines = manualInput.split(/[\n,;]+/).map((s) => s.trim()).filter(Boolean);
    const newContacts: Contact[] = lines.map((line) => ({ name: "", phone: line }));
    setContacts((prev) => [...prev, ...newContacts]);
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
        const parsed: Contact[] = results.data
          .map((row: any) => ({
            name: row.name || row.nom || row.prenom || "",
            phone: row.phone || row.telephone || row.tel || row.email || row.contact || "",
          }))
          .filter((c: Contact) => c.phone);
        setContacts((prev) => [...prev, ...parsed]);
        toast({ title: `${parsed.length} contact(s) importés depuis le CSV` });
      },
      error: () => toast({ title: "Erreur de parsing CSV", variant: "destructive" }),
    });
    e.target.value = "";
  }, [toast]);

  const removeContact = (index: number) => setContacts((prev) => prev.filter((_, i) => i !== index));

  const startSend = async () => {
    if (!message.trim() || contacts.length === 0) return;
    try {
      const res = await fetch(`${apiUrl}/send`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message, contacts }),
      });
      const data = await res.json();
      if (data.status === "started") {
        setSending(true);
        setPaused(false);
        setStatus({ active: true, paused: false, total: data.total, sent: 0, failed: 0, current: null, results: [] });
        toast({ title: `Envoi lancé pour ${data.total} contacts` });
      } else {
        toast({ title: data.error || "Erreur", variant: "destructive" });
      }
    } catch {
      toast({ title: "Impossible de contacter le backend local", description: "Vérifie que le serveur tourne sur localhost:3001", variant: "destructive" });
    }
  };

  const pauseSend = async () => { await fetch(`${apiUrl}/pause`, { method: "POST" }); setPaused(true); };
  const resumeSend = async () => { await fetch(`${apiUrl}/resume`, { method: "POST" }); setPaused(false); };
  const stopSend = async () => { await fetch(`${apiUrl}/stop`, { method: "POST" }); setSending(false); setPaused(false); };
  const exportCSV = () => window.open(`${apiUrl}/export`, "_blank");

  const progress = status ? Math.round(((status.sent + status.failed) / (status.total || 1)) * 100) : 0;

  if (isAdminLoading) {
    return <div className="min-h-screen flex items-center justify-center"><Loader2 className="h-8 w-8 animate-spin text-blue-500" /></div>;
  }

  return (
    <div className={`min-h-screen transition-colors ${dark ? "bg-slate-950 text-slate-100" : "bg-slate-50 text-slate-900"}`}>
      <div className="max-w-5xl mx-auto p-4 md:p-8">
        {/* Top bar */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-3">
            <button onClick={() => navigate("/admin/tickets")} className="p-2 rounded-lg hover:bg-slate-200 dark:hover:bg-slate-800 transition">
              <ArrowLeft className="h-5 w-5" />
            </button>
            <div>
              <h1 className="text-2xl font-bold tracking-tight">iMessage Bulk Sender</h1>
              <p className="text-sm text-slate-500">Envoi en masse via l'app Messages macOS</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <div className={`flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-medium ${backendOnline ? "bg-green-100 text-green-800" : backendOnline === false ? "bg-red-100 text-red-800" : "bg-slate-100 text-slate-600"}`}>
              <div className={`w-2 h-2 rounded-full ${backendOnline ? "bg-green-500" : backendOnline === false ? "bg-red-500" : "bg-slate-400"}`} />
              {backendOnline ? "Backend connecté" : backendOnline === false ? "Backend hors ligne" : "Vérification..."}
            </div>
            <button onClick={() => setShowSettings(!showSettings)} className={`p-2 rounded-lg transition ${dark ? "hover:bg-slate-800" : "hover:bg-slate-200"}`}>
              <Settings className="h-5 w-5" />
            </button>
            <button onClick={() => setDark(!dark)} className={`p-2 rounded-lg transition ${dark ? "hover:bg-slate-800" : "hover:bg-slate-200"}`}>
              {dark ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
            </button>
          </div>
        </div>

        {/* Settings panel */}
        {showSettings && (
          <div className={`mb-6 p-4 rounded-xl border ${dark ? "bg-slate-900 border-slate-800" : "bg-white border-slate-200"}`}>
            <h3 className="text-sm font-semibold mb-2">URL du backend Mac</h3>
            <p className="text-xs text-slate-500 mb-3">Colle ici l'URL ngrok/tunnel ou laisse localhost si tu es sur ton Mac</p>
            <div className="flex gap-2">
              <input
                value={backendUrl}
                onChange={(e) => setBackendUrl(e.target.value)}
                placeholder="https://xxxxx.ngrok-free.app"
                className={`flex-1 rounded-lg px-3 py-2 text-sm border focus:outline-none focus:ring-2 focus:ring-blue-500 ${dark ? "bg-slate-800 border-slate-700 text-white" : "bg-slate-50 border-slate-200"}`}
              />
              <button onClick={saveBackendUrl} className="px-4 py-2 rounded-lg text-sm font-medium text-white bg-blue-500 hover:bg-blue-600 transition">
                Sauvegarder
              </button>
            </div>
          </div>
        )}

        {/* Backend offline warning */}
        {backendOnline === false && (
          <div className="mb-6 p-4 rounded-xl bg-red-50 border border-red-200 text-red-800 text-sm">
            <p className="font-semibold">Backend local non détecté</p>
            <p className="mt-1">1. Lance le serveur sur ton Mac : <code className="bg-red-100 px-2 py-0.5 rounded">cd backend && node server.js</code></p>
            <p className="mt-1">2. Lance un tunnel : <code className="bg-red-100 px-2 py-0.5 rounded">ngrok http 3001</code></p>
            <p className="mt-1">3. Colle l'URL ngrok dans les réglages (icône engrenage)</p>
          </div>
        )}

        <div className="grid md:grid-cols-2 gap-6">
          {/* Message */}
          <div className={`rounded-xl p-6 border ${dark ? "bg-slate-900 border-slate-800" : "bg-white border-slate-200"} shadow-sm`}>
            <h2 className="text-lg font-semibold mb-4 flex items-center gap-2"><Send className="h-5 w-5 text-blue-500" /> Message</h2>
            <textarea
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Tapez votre message ici..."
              rows={7}
              className={`w-full rounded-lg p-3 text-sm resize-none focus:outline-none focus:ring-2 focus:ring-blue-500 border ${dark ? "bg-slate-800 border-slate-700 text-white" : "bg-slate-50 border-slate-200"}`}
            />
            <p className="mt-2 text-xs text-slate-500">{message.length} caractères</p>
          </div>

          {/* Contacts */}
          <div className={`rounded-xl p-6 border ${dark ? "bg-slate-900 border-slate-800" : "bg-white border-slate-200"} shadow-sm`}>
            <h2 className="text-lg font-semibold mb-4 flex items-center gap-2"><Users className="h-5 w-5 text-blue-500" /> Contacts ({contacts.length})</h2>
            <textarea
              value={manualInput}
              onChange={(e) => setManualInput(e.target.value)}
              placeholder={"Collez les numéros / emails\n+33612345678\nexample@icloud.com"}
              rows={3}
              className={`w-full rounded-lg p-3 text-sm resize-none focus:outline-none focus:ring-2 focus:ring-blue-500 border ${dark ? "bg-slate-800 border-slate-700 text-white" : "bg-slate-50 border-slate-200"}`}
            />
            <div className="flex gap-2 mt-3">
              <button onClick={addManualContacts} className="flex-1 py-2.5 rounded-lg text-sm font-medium text-white bg-blue-500 hover:bg-blue-600 transition flex items-center justify-center gap-2">
                Ajouter
              </button>
              <button onClick={() => fileInputRef.current?.click()} className={`flex-1 py-2.5 rounded-lg text-sm font-medium transition flex items-center justify-center gap-2 border ${dark ? "border-slate-700 hover:bg-slate-800" : "border-slate-200 hover:bg-slate-50"}`}>
                <Upload className="h-4 w-4" /> CSV
                <input ref={fileInputRef} type="file" accept=".csv" onChange={handleCSVUpload} className="hidden" />
              </button>
            </div>

            {contacts.length > 0 && (
              <>
                <div className={`mt-4 max-h-44 overflow-y-auto rounded-lg p-2 ${dark ? "bg-slate-800" : "bg-slate-50"}`}>
                  {contacts.map((c, i) => (
                    <div key={i} className={`flex items-center justify-between py-1.5 px-2 text-sm rounded ${dark ? "hover:bg-slate-700" : "hover:bg-slate-100"}`}>
                      <span className="truncate">
                        {c.name && <span className="font-medium">{c.name} — </span>}
                        {c.phone}
                      </span>
                      <button onClick={() => removeContact(i)} className="text-red-500 hover:text-red-700 ml-2 flex-shrink-0"><X className="h-3.5 w-3.5" /></button>
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
          {!sending ? (
            <div className="flex gap-3">
              <button
                onClick={startSend}
                disabled={!message.trim() || contacts.length === 0 || !backendOnline}
                className="flex-1 py-3 rounded-lg text-white font-semibold text-sm bg-blue-500 hover:bg-blue-600 disabled:opacity-40 disabled:cursor-not-allowed transition flex items-center justify-center gap-2"
              >
                <Send className="h-4 w-4" /> Envoyer à {contacts.length} contact{contacts.length > 1 ? "s" : ""}
              </button>
              {status && status.results && status.results.length > 0 && (
                <button onClick={exportCSV} className={`py-3 px-5 rounded-lg text-sm font-medium flex items-center gap-2 border transition ${dark ? "border-slate-700 hover:bg-slate-800" : "border-slate-200 hover:bg-slate-50"}`}>
                  <Download className="h-4 w-4" /> Rapport
                </button>
              )}
            </div>
          ) : (
            <div className="flex gap-3">
              {!paused ? (
                <button onClick={pauseSend} className="flex-1 py-3 rounded-lg font-semibold text-sm text-white bg-yellow-500 hover:bg-yellow-600 transition flex items-center justify-center gap-2">
                  <Pause className="h-4 w-4" /> Pause
                </button>
              ) : (
                <button onClick={resumeSend} className="flex-1 py-3 rounded-lg font-semibold text-sm text-white bg-blue-500 hover:bg-blue-600 transition flex items-center justify-center gap-2">
                  <Play className="h-4 w-4" /> Reprendre
                </button>
              )}
              <button onClick={stopSend} className="flex-1 py-3 rounded-lg font-semibold text-sm text-white bg-red-500 hover:bg-red-600 transition flex items-center justify-center gap-2">
                <Square className="h-4 w-4" /> Arrêter
              </button>
            </div>
          )}

          {/* Progress */}
          {status && (status.active || (status.results && status.results.length > 0)) && (
            <div className="mt-5">
              <div className="flex justify-between text-sm mb-2 text-slate-500">
                <span>Progression : {status.sent + status.failed} / {status.total}</span>
                <span>{progress}%</span>
              </div>
              <div className={`w-full h-2.5 rounded-full overflow-hidden ${dark ? "bg-slate-800" : "bg-slate-200"}`}>
                <div className="h-full rounded-full bg-blue-500 transition-all duration-500" style={{ width: `${progress}%` }} />
              </div>
              <div className="flex gap-6 mt-3 text-sm">
                <span className="text-green-500 flex items-center gap-1"><CheckCheck className="h-4 w-4" /> {status.sent}</span>
                <span className="text-red-500 flex items-center gap-1"><AlertCircle className="h-4 w-4" /> {status.failed}</span>
                {status.current && <span className="text-slate-500">En cours : {status.current}</span>}
                {status.active && paused && <span className="text-yellow-500 font-medium">⏸ En pause</span>}
              </div>

              {/* Detailed results */}
              {status.results.length > 0 && (
                <div className={`mt-4 max-h-52 overflow-y-auto rounded-lg p-3 text-xs ${dark ? "bg-slate-800" : "bg-slate-50"}`}>
                  {status.results.map((r, i) => (
                    <div key={i} className={`flex justify-between py-1.5 ${i > 0 ? "border-t" : ""} ${dark ? "border-slate-700" : "border-slate-100"}`}>
                      <span>{r.name ? `${r.name} (${r.recipient})` : r.recipient}</span>
                      <span className={r.success ? "text-green-500" : "text-red-500"}>
                        {r.success ? "Envoyé" : (r.error || "Erreur").substring(0, 50)}
                      </span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>

        <p className="text-center mt-8 text-xs text-slate-400">
          iMessage Bulk Sender — Outil admin interne — Messages envoyés via macOS Messages app
        </p>
      </div>
    </div>
  );
}
