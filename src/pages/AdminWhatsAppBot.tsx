import { useState, useEffect, useRef, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, Send, Trash2, Plus, Loader2, CheckCircle, XCircle, Clock, Bot, Upload, FileSpreadsheet } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useAdmin } from "@/hooks/use-admin";
import { useAuth } from "@/hooks/use-auth";
import { createClient } from "@supabase/supabase-js";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import Papa from "papaparse";
import * as XLSX from "xlsx";

// Client Supabase dédié au bot (projet séparé)
const botSupabase = createClient(
  "https://bxynpsxxalxcchewxmvf.supabase.co",
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJ4eW5wc3h4YWx4Y2NoZXd4bXZmIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzM2MjAwMjIsImV4cCI6MjA4OTE5NjAyMn0.gLYq9wofJIKAYSNfhTCl87SVvrQ8JaSkt81c2kUSzKI"
);

// Comptes WhatsApp disponibles (profils Chrome sur le serveur)
const WHATSAPP_ACCOUNTS = [
  { phone: "+33780930274", label: "+33 7 80 93 02 74" },
  { phone: "+33601148619", label: "+33 6 01 14 86 19" },
];

const DEFAULT_MESSAGE = `Bonjour {name},

Nous avons récemment identifié votre boutique Amazon et celle de {company}.

Nous collaborons actuellement avec plusieurs vendeurs FBA afin d'optimiser leur sourcing via un logiciel comprenant :
– partenariats directs fabricants (LEGO, Playmobil, DJI, Android…)
– des moniteurs automatisés sur une vingtaine de sites (Qogita, EANY, Leclerc, Auchan, Stockomani…)
– des opportunités quotidiennes à fort ROI
– une marketplace entre vendeurs Amazon
– des outils IA facilitant l'analyse et le gain de temps
– formation + accompagnement dédié

Voici le lien de notre site si cela peut vous intéresser :
https://amzingfba.com

Restant à votre disposition si vous souhaitez échanger.

L'équipe AMZing FBA`;

interface Contact {
  phone: string;
  name: string;
  company?: string;
}

// Normalize headers for detection
function normalizeHeader(value: string): string {
  return value
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, " ")
    .trim();
}

// Detect phone column
function detectPhoneColumn(headers: string[], rows: Record<string, string>[]): string | null {
  const phoneMatchers = [
    "phone", "telephone", "numero telephone", "numero de telephone",
    "num telephone", "mobile", "whatsapp", "phone number", "numero", "tel",
  ];

  for (const h of headers) {
    const norm = normalizeHeader(h);
    if (phoneMatchers.some((m) => norm === m || norm.includes(m))) return h;
  }

  let bestCol = "";
  let bestScore = 0;
  for (const h of headers) {
    let score = 0;
    for (const row of rows.slice(0, 20)) {
      const val = String(row[h] || "").replace(/[\s\-()]/g, "");
      if (/^\+?\d{8,15}$/.test(val)) score++;
    }
    if (score > bestScore) {
      bestScore = score;
      bestCol = h;
    }
  }
  return bestScore >= 2 ? bestCol : null;
}

// Detect company column
function detectCompanyColumn(headers: string[]): string | null {
  const companyMatchers = [
    "company", "entreprise", "societe", "société", "nom", "name",
    "business", "raison sociale", "enseigne", "marque", "société",
  ];

  for (const h of headers) {
    const norm = normalizeHeader(h);
    if (companyMatchers.some((m) => norm === m || norm.includes(m))) return h;
  }
  return null;
}

// Normalize phone (French 0X -> +33X)
function normalizePhone(raw: string): string {
  let digits = raw.replace(/[^0-9+]/g, "");
  if (digits.startsWith("0") && digits.length === 10) {
    digits = "33" + digits.slice(1);
  }
  digits = digits.replace(/^\+/, "");
  return digits;
}

interface Job {
  id: string;
  created_at: string;
  contacts: Contact[];
  message_template: string;
  account_phone: string;
  status: string;
  progress: { sent: number; failed: number; total: number; current_contact: string };
  results: { phone: string; name: string; status: string; error?: string }[];
}

const AdminWhatsAppBot = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { user } = useAuth();
  const { isAdmin, isLoading: isAdminLoading } = useAdmin();

  // File upload
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [dragOver, setDragOver] = useState(false);

  // Contacts
  const [contactsText, setContactsText] = useState("");
  const [contacts, setContacts] = useState<Contact[]>([]);

  // Message
  const [message, setMessage] = useState(DEFAULT_MESSAGE);

  // Account
  const [selectedAccount, setSelectedAccount] = useState(WHATSAPP_ACCOUNTS[0].phone);

  // Job state
  const [sending, setSending] = useState(false);
  const [activeJob, setActiveJob] = useState<Job | null>(null);

  // History
  const [jobs, setJobs] = useState<Job[]>([]);
  const [loadingJobs, setLoadingJobs] = useState(true);

  const logRef = useRef<HTMLDivElement>(null);

  // Auth guard
  useEffect(() => {
    if (!isAdminLoading && !isAdmin) {
      navigate("/dashboard");
    }
  }, [isAdmin, isAdminLoading, navigate]);

  // Load job history
  const loadJobs = useCallback(async () => {
    const { data } = await botSupabase
      .from("whatsapp_bot_jobs" as any)
      .select("*")
      .order("created_at", { ascending: false })
      .limit(20);
    if (data) setJobs(data as any);
    setLoadingJobs(false);
  }, []);

  useEffect(() => {
    loadJobs();
  }, [loadJobs]);

  // Realtime: listen to job updates
  useEffect(() => {
    const channel = botSupabase
      .channel("whatsapp-bot-jobs")
      .on(
        "postgres_changes",
        { event: "UPDATE", schema: "public", table: "whatsapp_bot_jobs" },
        (payload: any) => {
          const updated = payload.new as Job;
          // Update active job if it matches
          setActiveJob((prev) => (prev && prev.id === updated.id ? updated : prev));
          // Update in history
          setJobs((prev) => prev.map((j) => (j.id === updated.id ? updated : j)));
          // Auto-scroll log
          setTimeout(() => logRef.current?.scrollTo({ top: logRef.current.scrollHeight, behavior: "smooth" }), 100);
        }
      )
      .on(
        "postgres_changes",
        { event: "INSERT", schema: "public", table: "whatsapp_bot_jobs" },
        (payload: any) => {
          setJobs((prev) => [payload.new as Job, ...prev]);
        }
      )
      .subscribe();

    return () => { botSupabase.removeChannel(channel); };
  }, []);

  // Parse contacts from textarea
  const addContacts = () => {
    const lines = contactsText.split("\n").filter((l) => l.trim());
    const newContacts: Contact[] = [];

    for (const line of lines) {
      const parts = line.split(",").map((p) => p.trim());
      const phone = parts[0]?.replace(/[\s\-()]/g, "");
      const name = parts[1] || "Inconnu";
      const company = parts[2];

      if (!phone) continue;

      // Avoid duplicates
      if (contacts.some((c) => c.phone === phone) || newContacts.some((c) => c.phone === phone)) continue;

      newContacts.push({ phone: normalizePhone(phone), name, company });
    }

    if (newContacts.length === 0) {
      toast({ title: "Aucun nouveau contact", description: "Vérifiez le format: +33612345678, Nom, Société", variant: "destructive" });
      return;
    }

    setContacts((prev) => [...prev, ...newContacts]);
    setContactsText("");
    toast({ title: `${newContacts.length} contact(s) ajouté(s)` });
  };

  // Process Excel/CSV file
  const processFile = useCallback((file: File) => {
    const isXlsx = file.name.endsWith(".xlsx") || file.name.endsWith(".xls");
    const isCsv = file.name.endsWith(".csv");

    if (isXlsx) {
      const reader = new FileReader();
      reader.onload = (e) => {
        try {
          const workbook = XLSX.read(e.target?.result, { type: "array" });
          const sheet = workbook.Sheets[workbook.SheetNames[0]];
          const rows = XLSX.utils.sheet_to_json<Record<string, string>>(sheet);
          proceedWithRows(rows, file.name);
        } catch (err: any) {
          toast({ title: "Erreur fichier Excel", description: err.message, variant: "destructive" });
        }
      };
      reader.readAsArrayBuffer(file);
    } else if (isCsv) {
      Papa.parse(file, {
        complete: (results) => {
          const rows = results.data.slice(1).filter((r: any) => r.length > 0).map((r: any) => {
            const headers = (results.data[0] as any) || [];
            const row: Record<string, string> = {};
            headers.forEach((h: string, i: number) => {
              row[h] = String(r[i] || "");
            });
            return row;
          });
          proceedWithRows(rows, file.name);
        },
      });
    } else {
      toast({ title: "Format non supporté", description: "Utilisez Excel (.xlsx) ou CSV", variant: "destructive" });
    }
  }, [toast]);

  const proceedWithRows = (rows: Record<string, string>[], fileName: string) => {
    if (!rows.length) {
      toast({ title: "Fichier vide", variant: "destructive" });
      return;
    }

    const headers = Object.keys(rows[0]);
    const phoneCol = detectPhoneColumn(headers, rows);
    const companyCol = detectCompanyColumn(headers);

    if (!phoneCol) {
      toast({ title: "Colonne téléphone non trouvée", variant: "destructive" });
      return;
    }

    const imported: Contact[] = [];
    for (const row of rows) {
      const phone = normalizePhone(row[phoneCol] || "");
      const company = companyCol ? (row[companyCol] || "").trim() : undefined;
      const name = company || "Inconnu";

      if (!phone || phone.length < 8) continue;
      if (contacts.some((c) => c.phone === phone) || imported.some((c) => c.phone === phone)) continue;

      imported.push({ phone, name, company });
    }

    if (imported.length === 0) {
      toast({ title: "Aucun contact importé", description: "Vérifiez le format du fichier", variant: "destructive" });
      return;
    }

    setContacts((prev) => [...prev, ...imported]);
    toast({ title: `${imported.length} contact(s) importé(s) depuis ${fileName}` });
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const removeContact = (phone: string) => {
    setContacts((prev) => prev.filter((c) => c.phone !== phone));
  };

  const clearContacts = () => setContacts([]);

  // Launch job
  const launchJob = async () => {
    if (contacts.length === 0) {
      toast({ title: "Ajoutez des contacts d'abord", variant: "destructive" });
      return;
    }
    if (!message.trim()) {
      toast({ title: "Le message est vide", variant: "destructive" });
      return;
    }

    setSending(true);
    try {
      const { data, error } = await botSupabase
        .from("whatsapp_bot_jobs" as any)
        .insert({
          created_by: user?.id,
          contacts: contacts,
          message_template: message,
          account_phone: selectedAccount,
          status: "pending",
          progress: { sent: 0, failed: 0, total: contacts.length, current_contact: "" },
          results: [],
        } as any)
        .select()
        .single();

      if (error) throw error;

      setActiveJob(data as any);
      setContacts([]);
      toast({ title: "Job lancé !", description: "Le worker va traiter l'envoi." });
    } catch (e: any) {
      toast({ title: "Erreur", description: e.message, variant: "destructive" });
    } finally {
      setSending(false);
    }
  };

  const statusBadge = (status: string) => {
    const styles: Record<string, string> = {
      pending: "bg-yellow-100 text-yellow-800",
      running: "bg-blue-100 text-blue-800",
      completed: "bg-green-100 text-green-800",
      failed: "bg-red-100 text-red-800",
    };
    const icons: Record<string, any> = {
      pending: <Clock className="w-3 h-3" />,
      running: <Loader2 className="w-3 h-3 animate-spin" />,
      completed: <CheckCircle className="w-3 h-3" />,
      failed: <XCircle className="w-3 h-3" />,
    };
    return (
      <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium ${styles[status] || "bg-gray-100 text-gray-800"}`}>
        {icons[status]} {status}
      </span>
    );
  };

  if (isAdminLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-grow pt-20">
        <div className="container mx-auto px-4 py-8 max-w-5xl">
          {/* Header */}
          <div className="flex items-center gap-3 mb-6">
            <button onClick={() => navigate("/dashboard")} className="p-2 hover:bg-gray-100 rounded-lg">
              <ArrowLeft className="w-5 h-5" />
            </button>
            <Bot className="w-6 h-6 text-green-600" />
            <h1 className="text-2xl font-bold">Bot WhatsApp Selenium</h1>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Left column: Contacts + Message */}
            <div className="space-y-6">
              {/* Contacts input */}
              <div className="bg-white rounded-xl border p-5 shadow-sm">
                <h2 className="font-semibold text-lg mb-3">Contacts</h2>

                {/* File upload */}
                <div
                  onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
                  onDragLeave={() => setDragOver(false)}
                  onDrop={(e) => {
                    e.preventDefault();
                    setDragOver(false);
                    if (e.dataTransfer.files[0]) processFile(e.dataTransfer.files[0]);
                  }}
                  className={`border-2 border-dashed rounded-lg p-4 mb-4 text-center transition ${dragOver ? "border-green-500 bg-green-50" : "border-gray-300"}`}
                >
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept=".xlsx,.xls,.csv"
                    onChange={(e) => e.target.files && processFile(e.target.files[0])}
                    className="hidden"
                  />
                  <button
                    onClick={() => fileInputRef.current?.click()}
                    className="flex items-center justify-center gap-2 text-sm text-gray-600 hover:text-green-600 mx-auto"
                  >
                    <FileSpreadsheet className="w-4 h-4" />
                    Importer un fichier Excel/CSV ou glisser-déposer
                  </button>
                  <p className="text-xs text-gray-400 mt-1">Colonnes: Téléphone, Nom/Société (auto-détectées)</p>
                </div>

                <p className="text-sm text-gray-500 mb-2">Ou saisir manuellement (1 par ligne) : <code className="bg-gray-100 px-1 rounded">+33612345678, Nom, Société</code></p>
                <textarea
                  value={contactsText}
                  onChange={(e) => setContactsText(e.target.value)}
                  placeholder={"+33612345678, Jean Dupont, Dupont SARL\n+33698765432, Marie Martin, Martin Boutique"}
                  className="w-full border rounded-lg p-3 text-sm font-mono resize-y min-h-[100px] focus:ring-2 focus:ring-green-500 focus:border-green-500 outline-none"
                  rows={4}
                />
                <div className="flex gap-2 mt-2">
                  <button
                    onClick={addContacts}
                    className="flex items-center gap-1 bg-green-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-green-700 transition"
                  >
                    <Plus className="w-4 h-4" /> Ajouter
                  </button>
                  {contacts.length > 0 && (
                    <button
                      onClick={clearContacts}
                      className="flex items-center gap-1 bg-red-50 text-red-600 px-4 py-2 rounded-lg text-sm font-medium hover:bg-red-100 transition"
                    >
                      <Trash2 className="w-4 h-4" /> Tout effacer
                    </button>
                  )}
                </div>

                {/* Contact list */}
                {contacts.length > 0 && (
                  <div className="mt-4 max-h-[200px] overflow-y-auto border rounded-lg divide-y">
                    {contacts.map((c, i) => (
                      <div key={c.phone} className="flex items-center justify-between px-3 py-2 text-sm">
                        <span>
                          <span className="font-medium">{c.name}</span>
                          <span className="text-gray-500 ml-2">{c.phone}</span>
                        </span>
                        <button onClick={() => removeContact(c.phone)} className="text-red-400 hover:text-red-600">
                          <XCircle className="w-4 h-4" />
                        </button>
                      </div>
                    ))}
                  </div>
                )}
                {contacts.length > 0 && (
                  <p className="text-xs text-gray-400 mt-2">{contacts.length} contact(s)</p>
                )}
              </div>

              {/* Message */}
              <div className="bg-white rounded-xl border p-5 shadow-sm">
                <h2 className="font-semibold text-lg mb-3">Message</h2>
                <p className="text-sm text-gray-500 mb-2">Utilisez <code className="bg-gray-100 px-1 rounded">{"{name}"}</code> pour le nom et <code className="bg-gray-100 px-1 rounded">{"{company}"}</code> pour la société</p>
                <textarea
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  className="w-full border rounded-lg p-3 text-sm resize-y min-h-[250px] focus:ring-2 focus:ring-green-500 focus:border-green-500 outline-none"
                />
              </div>
            </div>

            {/* Right column: Account + Launch + Log + History */}
            <div className="space-y-6">
              {/* Account selection + Launch */}
              <div className="bg-white rounded-xl border p-5 shadow-sm">
                <h2 className="font-semibold text-lg mb-3">Compte WhatsApp</h2>
                <select
                  value={selectedAccount}
                  onChange={(e) => setSelectedAccount(e.target.value)}
                  className="w-full border rounded-lg p-2.5 text-sm mb-4 focus:ring-2 focus:ring-green-500 focus:border-green-500 outline-none"
                >
                  {WHATSAPP_ACCOUNTS.map((a) => (
                    <option key={a.phone} value={a.phone}>{a.label}</option>
                  ))}
                </select>

                <button
                  onClick={launchJob}
                  disabled={sending || contacts.length === 0}
                  className="w-full flex items-center justify-center gap-2 bg-green-600 text-white px-4 py-3 rounded-lg font-semibold hover:bg-green-700 transition disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {sending ? <Loader2 className="w-5 h-5 animate-spin" /> : <Send className="w-5 h-5" />}
                  {sending ? "Lancement..." : `Envoyer à ${contacts.length} contact(s)`}
                </button>
              </div>

              {/* Active job log */}
              {activeJob && (
                <div className="bg-white rounded-xl border p-5 shadow-sm">
                  <div className="flex items-center justify-between mb-3">
                    <h2 className="font-semibold text-lg">Envoi en cours</h2>
                    {statusBadge(activeJob.status)}
                  </div>

                  {/* Progress bar */}
                  <div className="mb-3">
                    <div className="flex justify-between text-xs text-gray-500 mb-1">
                      <span>{activeJob.progress.sent + activeJob.progress.failed} / {activeJob.progress.total}</span>
                      <span>{activeJob.progress.current_contact && `En cours: ${activeJob.progress.current_contact}`}</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div
                        className="bg-green-500 h-2 rounded-full transition-all"
                        style={{ width: `${activeJob.progress.total ? ((activeJob.progress.sent + activeJob.progress.failed) / activeJob.progress.total) * 100 : 0}%` }}
                      />
                    </div>
                  </div>

                  {/* Results log */}
                  <div ref={logRef} className="max-h-[300px] overflow-y-auto border rounded-lg bg-gray-50 p-3 text-xs font-mono space-y-1">
                    {activeJob.results.length === 0 && activeJob.status === "pending" && (
                      <p className="text-gray-400">En attente du worker...</p>
                    )}
                    {activeJob.results.length === 0 && activeJob.status === "running" && (
                      <p className="text-gray-400">Traitement en cours...</p>
                    )}
                    {activeJob.results.map((r, i) => (
                      <div key={i} className={r.status === "sent" ? "text-green-700" : "text-red-600"}>
                        {r.status === "sent" ? "✓" : "✗"} {r.name} ({r.phone}) — {r.status}
                        {r.error && <span className="text-red-400"> ({r.error})</span>}
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* History */}
              <div className="bg-white rounded-xl border p-5 shadow-sm">
                <h2 className="font-semibold text-lg mb-3">Historique</h2>
                {loadingJobs ? (
                  <div className="flex justify-center py-4"><Loader2 className="w-5 h-5 animate-spin text-gray-400" /></div>
                ) : jobs.length === 0 ? (
                  <p className="text-sm text-gray-400 text-center py-4">Aucun envoi pour le moment</p>
                ) : (
                  <div className="max-h-[300px] overflow-y-auto divide-y">
                    {jobs.map((job) => (
                      <div
                        key={job.id}
                        className="py-3 cursor-pointer hover:bg-gray-50 px-2 rounded"
                        onClick={() => setActiveJob(job)}
                      >
                        <div className="flex items-center justify-between">
                          <span className="text-sm font-medium">
                            {(job.contacts as any)?.length || 0} contacts via {job.account_phone}
                          </span>
                          {statusBadge(job.status)}
                        </div>
                        <div className="text-xs text-gray-400 mt-1">
                          {new Date(job.created_at).toLocaleString("fr-FR")}
                          {job.progress && (
                            <span className="ml-2">
                              — {(job.progress as any).sent || 0} envoyé(s), {(job.progress as any).failed || 0} échoué(s)
                            </span>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default AdminWhatsAppBot;
