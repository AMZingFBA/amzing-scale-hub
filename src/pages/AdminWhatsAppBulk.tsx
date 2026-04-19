import { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import {
  ArrowLeft, Upload, FileSpreadsheet, Send, CheckCheck, AlertCircle,
  Loader2, Trash2, Search, X, Users, Clock, ChevronDown,
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useAdmin } from "@/hooks/use-admin";
import { useAuth } from "@/hooks/use-auth";
import Papa from "papaparse";
import * as XLSX from "xlsx";

const WHATSAPP_SUPABASE_URL = "https://qyizaluzwueymavidxic.supabase.co";

interface ContactRow {
  phone: string;
  company: string;
  raw: Record<string, string>;
}

interface SendResult {
  phone: string;
  company: string;
  success: boolean;
  error?: string;
}

type SendStatus = "idle" | "sending" | "done";

// Auto-detect which column contains phone numbers
function normalizeHeader(value: string): string {
  return value
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, " ")
    .trim();
}

function detectPhoneColumn(headers: string[], rows: Record<string, string>[]): string | null {
  const normalizedHeaders = headers.map((h) => ({ original: h, normalized: normalizeHeader(h) }));
  const phoneMatchers = [
    "phone",
    "telephone",
    "numero telephone",
    "numero de telephone",
    "num telephone",
    "mobile",
    "whatsapp",
    "phone number",
    "numero",
    "tel",
  ];

  for (const header of normalizedHeaders) {
    if (phoneMatchers.some((matcher) => header.normalized === matcher || header.normalized.includes(matcher))) {
      return header.original;
    }
  }

  let bestCol = "";
  let bestScore = 0;
  for (const h of headers) {
    let score = 0;
    for (const row of rows.slice(0, 20)) {
      const val = String(row[h] || "").replace(/[\s\-\.\(\)]/g, "");
      if (/^\+?\d{8,15}$/.test(val)) score++;
    }
    if (score > bestScore) {
      bestScore = score;
      bestCol = h;
    }
  }
  return bestScore >= 2 ? bestCol : null;
}

// Auto-detect company/name column
function detectCompanyColumn(headers: string[], _rows: Record<string, string>[]): string | null {
  const companyHeaders = [
    "company", "entreprise", "societe", "nom", "name", "business",
    "raison sociale", "enseigne", "marque", "brand",
    "nom entreprise", "company name", "societe", "society",
  ];
  for (const h of headers) {
    const normalized = normalizeHeader(h);
    if (companyHeaders.some((keyword) => normalized === keyword || normalized.includes(keyword))) return h;
  }
  return null;
}

// Normalize phone to match what WhatsApp expects
function normalizePhone(raw: string): string {
  let digits = raw.replace(/[^0-9+]/g, "");
  // French number starting with 0 → +33
  if (digits.startsWith("0") && digits.length === 10) {
    digits = "33" + digits.slice(1);
  }
  // Remove leading +
  digits = digits.replace(/^\+/, "");
  return digits;
}

const AdminWhatsAppBulk = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { isAdmin, isLoading: adminLoading } = useAdmin();
  const { session } = useAuth();

  const [contacts, setContacts] = useState<ContactRow[]>([]);
  const [headers, setHeaders] = useState<string[]>([]);
  const [phoneCol, setPhoneCol] = useState<string | null>(null);
  const [companyCol, setCompanyCol] = useState<string | null>(null);
  const [fileName, setFileName] = useState("");
  const [templateName, setTemplateName] = useState("55555");
  const [templateLang, setTemplateLang] = useState("fr");
  const [sendStatus, setSendStatus] = useState<SendStatus>("idle");
  const [results, setResults] = useState<SendResult[]>([]);
  const [search, setSearch] = useState("");
  const [dragOver, setDragOver] = useState(false);

  useEffect(() => {
    if (!adminLoading && !isAdmin) navigate("/");
  }, [isAdmin, adminLoading, navigate]);

  const processData = useCallback((rows: Record<string, string>[], file: string) => {
    if (!rows.length) {
      toast({ variant: "destructive", title: "Fichier vide" });
      return;
    }

    const hdrs = Object.keys(rows[0]);
    setHeaders(hdrs);
    setFileName(file);

    const autoPhone = detectPhoneColumn(hdrs, rows);
    const autoCompany = detectCompanyColumn(hdrs, rows);
    setPhoneCol(autoPhone);
    setCompanyCol(autoCompany);

    if (autoPhone) {
      const parsed: ContactRow[] = rows
        .filter((r) => r[autoPhone]?.trim())
        .map((r) => ({
          phone: normalizePhone(r[autoPhone]),
          company: autoCompany ? (r[autoCompany] || "").trim() : "",
          raw: r,
        }))
        .filter((c) => c.phone.length >= 8);

      // Deduplicate by phone
      const seen = new Set<string>();
      const unique = parsed.filter((c) => {
        if (seen.has(c.phone)) return false;
        seen.add(c.phone);
        return true;
      });

      setContacts(unique);
      toast({
        title: `${unique.length} contacts importés`,
        description: `Colonne téléphone: "${autoPhone}"${autoCompany ? `, Société: "${autoCompany}"` : ""}`,
      });
    } else {
      toast({ variant: "destructive", title: "Colonne téléphone non détectée", description: "Sélectionnez-la manuellement" });
      // Still load raw data for manual selection
      setContacts(rows.map((r) => ({ phone: "", company: "", raw: r })));
    }
  }, [toast]);

  const handleFile = useCallback(async (file: File) => {
    const ext = file.name.split(".").pop()?.toLowerCase();

    try {
      if (ext === "csv" || ext === "txt") {
        Papa.parse(file, {
          header: true,
          skipEmptyLines: true,
          complete: (result) => processData(result.data as Record<string, string>[], file.name),
          error: (error) => {
            toast({ variant: "destructive", title: "Erreur de lecture", description: error.message });
          },
        });
        return;
      }

      if (ext === "xlsx" || ext === "xls") {
        const buffer = await file.arrayBuffer();
        const wb = XLSX.read(buffer, { type: "array" });
        const ws = wb.Sheets[wb.SheetNames[0]];
        const data = XLSX.utils.sheet_to_json<(string | number | boolean | null)[]>(ws, {
          header: 1,
          defval: "",
          raw: false,
        });

        if (!data.length) {
          toast({ variant: "destructive", title: "Fichier vide" });
          return;
        }

        const headers = (data[0] ?? []).map((value) => String(value ?? "").trim());
        const rows = data
          .slice(1)
          .filter((row) => row.some((value) => String(value ?? "").trim() !== ""))
          .map((row) => {
            const record: Record<string, string> = {};
            headers.forEach((header, index) => {
              const key = header || `col_${index + 1}`;
              record[key] = String(row[index] ?? "").trim();
            });
            return record;
          });

        processData(rows, file.name);
        return;
      }

      toast({ variant: "destructive", title: "Format non supporté", description: "Utilisez .csv, .xlsx ou .xls" });
    } catch (err: any) {
      console.error("File import error:", err);
      toast({ variant: "destructive", title: "Erreur de lecture", description: err?.message || "Impossible de lire ce fichier" });
    }
  }, [processData, toast]);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
    const file = e.dataTransfer.files[0];
    if (file) handleFile(file);
  }, [handleFile]);

  // Re-map columns manually
  const remapColumns = () => {
    if (!phoneCol) return;
    const parsed: ContactRow[] = contacts
      .map((c) => ({
        phone: normalizePhone(c.raw[phoneCol] || ""),
        company: companyCol ? (c.raw[companyCol] || "").trim() : "",
        raw: c.raw,
      }))
      .filter((c) => c.phone.length >= 8);

    const seen = new Set<string>();
    const unique = parsed.filter((c) => {
      if (seen.has(c.phone)) return false;
      seen.add(c.phone);
      return true;
    });
    setContacts(unique);
  };

  const removeContact = (phone: string) => {
    setContacts((prev) => prev.filter((c) => c.phone !== phone));
  };

  const handleSend = async () => {
    if (!contacts.length) return;

    setSendStatus("sending");
    setResults([]);

    try {
      const res = await fetch(`${WHATSAPP_SUPABASE_URL}/functions/v1/bulk-send`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          contacts: contacts.map((c) => ({ phone: c.phone, company: c.company })),
          template_name: templateName,
          template_language: templateLang,
        }),
      });

      const data = await res.json();
      if (data.results) setResults(data.results);
      setSendStatus("done");

      toast({
        title: "Envoi terminé",
        description: `${data.sent || 0} envoyés, ${data.failed || 0} échoués`,
      });
    } catch (err: any) {
      toast({ variant: "destructive", title: "Erreur", description: err.message });
      setSendStatus("done");
    }
  };

  const filteredContacts = search
    ? contacts.filter(
        (c) =>
          c.phone.includes(search) ||
          c.company.toLowerCase().includes(search.toLowerCase())
      )
    : contacts;

  const successCount = results.filter((r) => r.success).length;
  const failCount = results.filter((r) => !r.success).length;

  if (adminLoading) {
    return (
      <div className="h-screen flex items-center justify-center" style={{ background: "#111b21" }}>
        <div className="w-12 h-12 border-4 border-[#00a884] border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen" style={{ background: "#111b21", color: "#e9edef" }}>
      {/* Header */}
      <div className="flex items-center gap-3 px-4 py-3 sticky top-0 z-10" style={{ background: "#202c33", borderBottom: "1px solid #233138" }}>
        <button onClick={() => navigate("/dashboard")} className="hover:opacity-70">
          <ArrowLeft className="w-5 h-5" style={{ color: "#aebac1" }} />
        </button>
        <FileSpreadsheet className="w-5 h-5" style={{ color: "#00a884" }} />
        <span className="font-medium text-lg">Envoi en masse</span>
        {contacts.length > 0 && (
          <span className="text-xs px-2 py-0.5 rounded-full" style={{ background: "#00a884", color: "#111b21" }}>
            {contacts.length} contacts
          </span>
        )}
      </div>

      <div className="max-w-5xl mx-auto p-4 space-y-4">
        {/* Upload Zone */}
        {contacts.length === 0 ? (
          <div
            onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
            onDragLeave={() => setDragOver(false)}
            onDrop={handleDrop}
            className="border-2 border-dashed rounded-xl p-12 text-center transition-all cursor-pointer"
            style={{
              borderColor: dragOver ? "#00a884" : "#233138",
              background: dragOver ? "#1a2e35" : "#0b141a",
            }}
            onClick={() => {
              const input = document.createElement("input");
              input.type = "file";
              input.accept = ".csv,.xlsx,.xls,.txt";
              input.onchange = (e) => {
                const f = (e.target as HTMLInputElement).files?.[0];
                if (f) handleFile(f);
              };
              input.click();
            }}
          >
            <Upload className="w-12 h-12 mx-auto mb-4" style={{ color: "#00a884" }} />
            <h3 className="text-xl font-medium mb-2">Importez votre fichier</h3>
            <p className="text-sm mb-1" style={{ color: "#8696a0" }}>
              Glissez-déposez ou cliquez pour sélectionner
            </p>
            <p className="text-xs" style={{ color: "#8696a0" }}>
              Formats supportés : CSV, XLSX, XLS — Le numéro de téléphone et le nom de société seront détectés automatiquement
            </p>
          </div>
        ) : (
          <>
            {/* File info + Column mapping */}
            <div className="rounded-xl p-4 space-y-3" style={{ background: "#202c33" }}>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <FileSpreadsheet className="w-5 h-5" style={{ color: "#00a884" }} />
                  <span className="text-sm font-medium">{fileName}</span>
                  <span className="text-xs px-2 py-0.5 rounded" style={{ background: "#233138", color: "#8696a0" }}>
                    {contacts.length} lignes
                  </span>
                </div>
                <button
                  onClick={() => { setContacts([]); setHeaders([]); setFileName(""); setResults([]); setSendStatus("idle"); }}
                  className="text-xs flex items-center gap-1 px-2 py-1 rounded hover:opacity-80"
                  style={{ color: "#f15c6d" }}
                >
                  <Trash2 className="w-3 h-3" /> Supprimer
                </button>
              </div>

              {/* Column mapping */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs mb-1 block" style={{ color: "#8696a0" }}>Colonne téléphone</label>
                  <div className="relative">
                    <select
                      value={phoneCol || ""}
                      onChange={(e) => { setPhoneCol(e.target.value || null); }}
                      className="w-full text-sm rounded-lg px-3 py-2 appearance-none"
                      style={{ background: "#2a3942", color: "#e9edef", border: "1px solid #233138" }}
                    >
                      <option value="">— Sélectionner —</option>
                      {headers.map((h) => (
                        <option key={h} value={h}>{h}</option>
                      ))}
                    </select>
                    <ChevronDown className="absolute right-2 top-1/2 -translate-y-1/2 w-4 h-4 pointer-events-none" style={{ color: "#8696a0" }} />
                  </div>
                </div>
                <div>
                  <label className="text-xs mb-1 block" style={{ color: "#8696a0" }}>Colonne société (→ {"{{1}}"})</label>
                  <div className="relative">
                    <select
                      value={companyCol || ""}
                      onChange={(e) => { setCompanyCol(e.target.value || null); }}
                      className="w-full text-sm rounded-lg px-3 py-2 appearance-none"
                      style={{ background: "#2a3942", color: "#e9edef", border: "1px solid #233138" }}
                    >
                      <option value="">— Aucune —</option>
                      {headers.map((h) => (
                        <option key={h} value={h}>{h}</option>
                      ))}
                    </select>
                    <ChevronDown className="absolute right-2 top-1/2 -translate-y-1/2 w-4 h-4 pointer-events-none" style={{ color: "#8696a0" }} />
                  </div>
                </div>
              </div>

              <button
                onClick={remapColumns}
                className="text-xs px-3 py-1.5 rounded-lg transition-opacity hover:opacity-80"
                style={{ background: "#00a884", color: "#111b21" }}
              >
                Réappliquer le mapping
              </button>
            </div>

            {/* Template config */}
            <div className="rounded-xl p-4" style={{ background: "#202c33" }}>
              <h3 className="text-sm font-medium mb-2 flex items-center gap-2">
                <Send className="w-4 h-4" style={{ color: "#00a884" }} />
                Template WhatsApp
              </h3>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs mb-1 block" style={{ color: "#8696a0" }}>Nom du template</label>
                  <input
                    type="text"
                    value={templateName}
                    onChange={(e) => setTemplateName(e.target.value)}
                    className="w-full text-sm rounded-lg px-3 py-2"
                    style={{ background: "#2a3942", color: "#e9edef", border: "1px solid #233138" }}
                  />
                </div>
                <div>
                  <label className="text-xs mb-1 block" style={{ color: "#8696a0" }}>Langue</label>
                  <input
                    type="text"
                    value={templateLang}
                    onChange={(e) => setTemplateLang(e.target.value)}
                    className="w-full text-sm rounded-lg px-3 py-2"
                    style={{ background: "#2a3942", color: "#e9edef", border: "1px solid #233138" }}
                  />
                </div>
              </div>

              {/* Rate limit info */}
              <div className="flex items-start gap-2 mt-3 p-2 rounded-lg" style={{ background: "#1a2e35" }}>
                <Clock className="w-4 h-4 mt-0.5 flex-shrink-0" style={{ color: "#00a884" }} />
                <p className="text-xs" style={{ color: "#8696a0" }}>
                  Délai de 6.5s entre chaque envoi (limite Meta). Temps estimé : <strong style={{ color: "#e9edef" }}>~{Math.ceil(contacts.length * 6.5 / 60)} min</strong> pour {contacts.length} messages.
                </p>
              </div>
            </div>

            {/* Search + Contact list */}
            <div className="rounded-xl overflow-hidden" style={{ background: "#202c33" }}>
              <div className="px-4 py-3 flex items-center justify-between" style={{ borderBottom: "1px solid #233138" }}>
                <span className="text-sm font-medium flex items-center gap-2">
                  <Users className="w-4 h-4" />
                  Contacts ({filteredContacts.length})
                </span>
                <div className="relative">
                  <Search className="absolute left-2 top-1/2 -translate-y-1/2 w-3.5 h-3.5" style={{ color: "#8696a0" }} />
                  <input
                    type="text"
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    placeholder="Filtrer..."
                    className="pl-7 pr-6 py-1 text-xs rounded-lg"
                    style={{ background: "#2a3942", color: "#e9edef", border: "none", width: "180px" }}
                  />
                  {search && (
                    <button onClick={() => setSearch("")} className="absolute right-1.5 top-1/2 -translate-y-1/2">
                      <X className="w-3 h-3" style={{ color: "#8696a0" }} />
                    </button>
                  )}
                </div>
              </div>

              <div className="max-h-[350px] overflow-y-auto">
                {filteredContacts.map((c, i) => {
                  const result = results.find((r) => r.phone === c.phone);
                  return (
                    <div
                      key={`${c.phone}-${i}`}
                      className="flex items-center gap-3 px-4 py-2.5 text-sm"
                      style={{ borderBottom: "1px solid #233138" }}
                    >
                      <div
                        className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-medium flex-shrink-0"
                        style={{ background: "#6b7c85", color: "#cfd9df" }}
                      >
                        {(c.company || c.phone).slice(0, 2).toUpperCase()}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="font-medium truncate" style={{ color: "#e9edef", fontSize: "13px" }}>
                          {c.company || "—"}
                        </div>
                        <div className="text-xs" style={{ color: "#8696a0" }}>+{c.phone}</div>
                      </div>
                      {result ? (
                        result.success ? (
                          <CheckCheck className="w-4 h-4 flex-shrink-0" style={{ color: "#53bdeb" }} />
                        ) : (
                          <div className="flex items-center gap-1 flex-shrink-0">
                            <AlertCircle className="w-4 h-4" style={{ color: "#f15c6d" }} />
                            <span className="text-[10px] max-w-[120px] truncate" style={{ color: "#f15c6d" }}>{result.error}</span>
                          </div>
                        )
                      ) : sendStatus === "idle" ? (
                        <button onClick={() => removeContact(c.phone)} className="hover:opacity-70 flex-shrink-0">
                          <X className="w-4 h-4" style={{ color: "#8696a0" }} />
                        </button>
                      ) : null}
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Results summary */}
            {sendStatus === "done" && (
              <div className="rounded-xl p-4 flex items-center gap-4" style={{ background: "#1a2e35", border: "1px solid #233138" }}>
                <CheckCheck className="w-6 h-6" style={{ color: "#00a884" }} />
                <div>
                  <p className="font-medium">Envoi terminé</p>
                  <p className="text-sm" style={{ color: "#8696a0" }}>
                    {successCount} envoyé{successCount > 1 ? "s" : ""}
                    {failCount > 0 && <span style={{ color: "#f15c6d" }}> · {failCount} échoué{failCount > 1 ? "s" : ""}</span>}
                  </p>
                </div>
              </div>
            )}

            {/* Send button */}
            <div className="flex gap-3">
              {sendStatus === "idle" ? (
                <button
                  onClick={handleSend}
                  disabled={contacts.length === 0 || !templateName}
                  className="flex-1 flex items-center justify-center gap-2 py-3 rounded-xl font-medium text-sm transition-all disabled:opacity-40"
                  style={{ background: "#00a884", color: "#111b21" }}
                >
                  <Send className="w-5 h-5" />
                  Envoyer à {contacts.length} contact{contacts.length > 1 ? "s" : ""}
                </button>
              ) : sendStatus === "sending" ? (
                <div className="flex-1 flex items-center justify-center gap-2 py-3 rounded-xl" style={{ background: "#233138" }}>
                  <Loader2 className="w-5 h-5 animate-spin" style={{ color: "#00a884" }} />
                  <span className="text-sm">Envoi en cours... (≈{Math.ceil(contacts.length * 6.5 / 60)} min)</span>
                </div>
              ) : (
                <button
                  onClick={() => { setContacts([]); setHeaders([]); setFileName(""); setResults([]); setSendStatus("idle"); }}
                  className="flex-1 py-3 rounded-xl font-medium text-sm"
                  style={{ background: "#233138", color: "#e9edef" }}
                >
                  Nouvel envoi
                </button>
              )}
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default AdminWhatsAppBulk;
