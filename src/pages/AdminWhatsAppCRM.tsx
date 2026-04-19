import { useState, useEffect, useRef, useCallback, KeyboardEvent } from "react";
import { Link } from "react-router-dom";
import { createClient, RealtimeChannel } from "@supabase/supabase-js";
import {
  ArrowLeft, Send, Search, X, MessageCircle, Phone, User, Clock,
  Check, CheckCheck, AlertCircle, Loader2, Plus, ChevronRight,
  FileText, Tag, StickyNote, RefreshCw,
} from "lucide-react";
import { formatDistanceToNow, format, isToday, isYesterday } from "date-fns";
import { fr } from "date-fns/locale";

// Separate Supabase client for WhatsApp CRM
const WA_SUPABASE_URL = "https://qyizaluzwueymavidxic.supabase.co";
const WA_SUPABASE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InF5aXphbHV6d3VleW1hdmlkeGljIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzYxNzYyNTUsImV4cCI6MjA5MTc1MjI1NX0.dTXh63wV1qRm5_b3ICon6wIAlvYMat6XWeVbH9ebamU";
const waSupabase = createClient(WA_SUPABASE_URL, WA_SUPABASE_KEY);

// ============ TYPES ============
interface Contact {
  id: string;
  phone_e164: string;
  display_name: string | null;
  status: string;
  notes_internal: string | null;
  created_at: string;
  last_message_at: string | null;
}

interface Conversation {
  id: string;
  contact_id: string;
  unread_count: number;
  last_message_preview: string | null;
  last_message_at: string | null;
  status: string;
  contacts?: Contact;
}

interface Message {
  id: string;
  conversation_id: string;
  direction: "inbound" | "outbound";
  type: string;
  content: string | null;
  status: string;
  created_at: string;
  sent_at: string | null;
  delivered_at: string | null;
  read_at: string | null;
  error_message: string | null;
}

interface ContactTag {
  id: string;
  name: string;
  color: string;
}

// ============ UTILS ============
function formatDate(dateStr: string | null) {
  if (!dateStr) return "";
  const d = new Date(dateStr);
  if (isToday(d)) return format(d, "HH:mm");
  if (isYesterday(d)) return "Hier";
  return format(d, "dd/MM/yy");
}

function formatMsgTime(dateStr: string) {
  return format(new Date(dateStr), "HH:mm");
}

function formatPhoneDisplay(phone: string) {
  if (phone.startsWith("+33")) {
    const n = phone.slice(3);
    return "0" + n.replace(/(\d{1})(\d{2})(\d{2})(\d{2})(\d{2})/, "$1 $2 $3 $4 $5");
  }
  return phone;
}

function getInitials(name: string | null | undefined) {
  if (!name) return "?";
  return name.split(" ").map(w => w[0]).join("").toUpperCase().slice(0, 2);
}

const AVATAR_COLORS = [
  "#25D366", "#128C7E", "#075E54", "#34B7F1",
  "#00A884", "#0088CC", "#7C3AED", "#DB4437",
];

function getAvatarColor(id: string) {
  let hash = 0;
  for (let i = 0; i < id.length; i++) hash = ((hash << 5) - hash + id.charCodeAt(i)) | 0;
  return AVATAR_COLORS[Math.abs(hash) % AVATAR_COLORS.length];
}

// ============ STATUS ICON ============
function StatusIcon({ status }: { status: string }) {
  switch (status) {
    case "pending": return <Clock className="w-3.5 h-3.5 text-gray-400" />;
    case "sent": return <Check className="w-3.5 h-3.5 text-gray-400" />;
    case "delivered": return <CheckCheck className="w-3.5 h-3.5 text-gray-400" />;
    case "read": return <CheckCheck className="w-3.5 h-3.5 text-blue-500" />;
    case "failed": return <AlertCircle className="w-3.5 h-3.5 text-red-500" />;
    default: return null;
  }
}

// ============ AVATAR ============
function Avatar({ name, id, size = "md" }: { name?: string | null; id: string; size?: "sm" | "md" | "lg" }) {
  const s = size === "sm" ? "w-10 h-10 text-xs" : size === "lg" ? "w-14 h-14 text-lg" : "w-12 h-12 text-sm";
  return (
    <div className={`${s} rounded-full flex items-center justify-center text-white font-semibold flex-shrink-0`}
      style={{ backgroundColor: getAvatarColor(id) }}>
      {getInitials(name)}
    </div>
  );
}

// ============ MAIN COMPONENT ============
export default function AdminWhatsAppCRM() {
  // State
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [messages, setMessages] = useState<Message[]>([]);
  const [tags, setTags] = useState<ContactTag[]>([]);
  const [activeConvId, setActiveConvId] = useState<string | null>(null);
  const [activeContact, setActiveContact] = useState<Contact | null>(null);
  const [search, setSearch] = useState("");
  const [messageText, setMessageText] = useState("");
  const [sending, setSending] = useState(false);
  const [loading, setLoading] = useState(true);
  const [loadingMessages, setLoadingMessages] = useState(false);
  const [showContactPanel, setShowContactPanel] = useState(false);
  const [showNewConv, setShowNewConv] = useState(false);
  const [newPhone, setNewPhone] = useState("");
  const [newName, setNewName] = useState("");
  const [newMessage, setNewMessage] = useState("");
  const [creatingConv, setCreatingConv] = useState(false);
  const [editingNotes, setEditingNotes] = useState(false);
  const [notesText, setNotesText] = useState("");
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const channelRef = useRef<RealtimeChannel | null>(null);

  // ============ FETCH CONVERSATIONS ============
  const fetchConversations = useCallback(async () => {
    const { data } = await waSupabase
      .from("conversations")
      .select("*, contacts(*)")
      .order("last_message_at", { ascending: false, nullsFirst: false });
    if (data) setConversations(data as Conversation[]);
    setLoading(false);
  }, []);

  // ============ FETCH MESSAGES ============
  const fetchMessages = useCallback(async (convId: string) => {
    setLoadingMessages(true);
    const { data } = await waSupabase
      .from("messages")
      .select("*")
      .eq("conversation_id", convId)
      .order("created_at", { ascending: true });
    if (data) setMessages(data as Message[]);
    setLoadingMessages(false);

    // Reset unread
    await waSupabase.from("conversations").update({ unread_count: 0 }).eq("id", convId);
    setConversations(prev => prev.map(c => c.id === convId ? { ...c, unread_count: 0 } : c));
  }, []);

  // ============ FETCH TAGS ============
  useEffect(() => {
    waSupabase.from("contact_tags").select("*").then(({ data }) => {
      if (data) setTags(data as ContactTag[]);
    });
  }, []);

  // ============ INIT ============
  useEffect(() => {
    fetchConversations();
  }, [fetchConversations]);

  // ============ REALTIME ============
  useEffect(() => {
    const channel = waSupabase
      .channel("crm-realtime")
      .on("postgres_changes", { event: "*", schema: "public", table: "messages" }, (payload) => {
        const newMsg = payload.new as Message;
        if (payload.eventType === "INSERT") {
          if (newMsg.conversation_id === activeConvId) {
            setMessages(prev => {
              if (prev.find(m => m.id === newMsg.id)) return prev;
              return [...prev, newMsg];
            });
          }
          fetchConversations();
        } else if (payload.eventType === "UPDATE") {
          setMessages(prev => prev.map(m => m.id === newMsg.id ? newMsg : m));
        }
      })
      .on("postgres_changes", { event: "*", schema: "public", table: "conversations" }, () => {
        fetchConversations();
      })
      .subscribe();

    channelRef.current = channel;
    return () => { channel.unsubscribe(); };
  }, [activeConvId, fetchConversations]);

  // ============ AUTO SCROLL ============
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // ============ SELECT CONVERSATION ============
  const selectConversation = useCallback((conv: Conversation) => {
    setActiveConvId(conv.id);
    setActiveContact(conv.contacts as Contact || null);
    setShowContactPanel(false);
    fetchMessages(conv.id);
    setTimeout(() => textareaRef.current?.focus(), 100);
  }, [fetchMessages]);

  // ============ SEND MESSAGE ============
  const handleSend = async () => {
    if (!messageText.trim() || !activeConvId || !activeContact || sending) return;
    const content = messageText.trim();
    setMessageText("");
    setSending(true);

    // Optimistic insert
    const tempId = crypto.randomUUID();
    const optimistic: Message = {
      id: tempId, conversation_id: activeConvId, direction: "outbound",
      type: "text", content, status: "pending", created_at: new Date().toISOString(),
      sent_at: null, delivered_at: null, read_at: null, error_message: null,
    };
    setMessages(prev => [...prev, optimistic]);

    try {
      const res = await fetch(`${WA_SUPABASE_URL}/functions/v1/send-message`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          conversation_id: activeConvId,
          contact_id: activeContact.id,
          phone: activeContact.phone_e164,
          content,
        }),
      });
      const data = await res.json();
      if (!res.ok) {
        setMessages(prev => prev.map(m => m.id === tempId ? { ...m, status: "failed", error_message: data.error } : m));
      } else {
        // Remove optimistic, real one will come via realtime
        setMessages(prev => prev.filter(m => m.id !== tempId));
      }
    } catch {
      setMessages(prev => prev.map(m => m.id === tempId ? { ...m, status: "failed", error_message: "Erreur réseau" } : m));
    }
    setSending(false);
    textareaRef.current?.focus();
  };

  const handleKeyDown = (e: KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); handleSend(); }
  };

  // ============ NEW CONVERSATION ============
  const handleNewConversation = async () => {
    if (!newPhone.trim() || creatingConv) return;
    setCreatingConv(true);

    let phone = newPhone.trim().replace(/\s/g, "");
    if (phone.startsWith("0")) phone = "+33" + phone.slice(1);
    if (!phone.startsWith("+")) phone = "+" + phone;

    try {
      // Upsert contact
      const { data: contact } = await waSupabase
        .from("contacts")
        .upsert({ phone_e164: phone, display_name: newName || null }, { onConflict: "phone_e164" })
        .select("id")
        .single();

      if (!contact) throw new Error("Erreur création contact");

      // Upsert conversation
      const { data: conv } = await waSupabase
        .from("conversations")
        .upsert({ contact_id: contact.id, status: "active" }, { onConflict: "contact_id" })
        .select("*, contacts(*)")
        .single();

      if (!conv) throw new Error("Erreur création conversation");

      // Send first message if provided
      if (newMessage.trim()) {
        await fetch(`${WA_SUPABASE_URL}/functions/v1/send-message`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            conversation_id: conv.id,
            contact_id: contact.id,
            phone,
            content: newMessage.trim(),
          }),
        });
      }

      await fetchConversations();
      selectConversation(conv as Conversation);
      setShowNewConv(false);
      setNewPhone(""); setNewName(""); setNewMessage("");
    } catch (err: any) {
      alert(err.message || "Erreur");
    }
    setCreatingConv(false);
  };

  // ============ SAVE NOTES ============
  const saveNotes = async () => {
    if (!activeContact) return;
    await waSupabase.from("contacts").update({ notes_internal: notesText }).eq("id", activeContact.id);
    setActiveContact(prev => prev ? { ...prev, notes_internal: notesText } : null);
    setEditingNotes(false);
  };

  // ============ FILTER ============
  const filtered = conversations.filter(c => {
    if (!search) return true;
    const q = search.toLowerCase();
    const name = (c.contacts?.display_name || "").toLowerCase();
    const phone = (c.contacts?.phone_e164 || "");
    const preview = (c.last_message_preview || "").toLowerCase();
    return name.includes(q) || phone.includes(q) || preview.includes(q);
  });

  const activeConv = conversations.find(c => c.id === activeConvId);

  // ============ RENDER ============
  return (
    <div className="flex h-screen bg-[#eae6df]">
      {/* ===== SIDEBAR ===== */}
      <div className="w-[380px] flex flex-col bg-white border-r border-gray-200 flex-shrink-0">
        {/* Sidebar Header */}
        <div className="flex items-center justify-between px-4 py-3 bg-[#f0f2f5] border-b border-gray-200">
          <div className="flex items-center gap-3">
            <Link to="/dashboard" className="p-1.5 rounded-full hover:bg-gray-300/50 transition-colors">
              <ArrowLeft className="w-5 h-5 text-gray-600" />
            </Link>
            <h1 className="text-base font-semibold text-gray-800">WhatsApp CRM</h1>
          </div>
          <div className="flex items-center gap-1">
            <button onClick={() => fetchConversations()} className="p-2 rounded-full hover:bg-gray-300/50 transition-colors">
              <RefreshCw className="w-4 h-4 text-gray-600" />
            </button>
            <button onClick={() => setShowNewConv(true)} className="p-2 rounded-full hover:bg-gray-300/50 transition-colors">
              <Plus className="w-5 h-5 text-gray-600" />
            </button>
          </div>
        </div>

        {/* Search */}
        <div className="px-3 py-2 bg-[#f0f2f5]">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
            <input type="text" value={search} onChange={e => setSearch(e.target.value)}
              placeholder="Rechercher ou démarrer une discussion"
              className="w-full pl-10 pr-8 py-1.5 bg-white rounded-lg text-sm border-none focus:outline-none focus:ring-1 focus:ring-[#00a884]" />
            {search && <button onClick={() => setSearch("")} className="absolute right-2 top-1/2 -translate-y-1/2"><X className="w-4 h-4 text-gray-400" /></button>}
          </div>
        </div>

        {/* Conversation List */}
        <div className="flex-1 overflow-y-auto">
          {loading ? (
            <div className="p-8 text-center text-gray-400"><Loader2 className="w-6 h-6 animate-spin mx-auto" /></div>
          ) : filtered.length === 0 ? (
            <div className="p-8 text-center text-gray-400 text-sm">
              {search ? "Aucun résultat" : "Aucune conversation"}
            </div>
          ) : (
            filtered.map(conv => {
              const contact = conv.contacts;
              const isActive = conv.id === activeConvId;
              return (
                <button key={conv.id} onClick={() => selectConversation(conv)}
                  className={`w-full flex items-center gap-3 px-3 py-3 text-left transition-colors border-b border-gray-100/80 hover:bg-[#f0f2f5] ${isActive ? "bg-[#f0f2f5]" : ""}`}>
                  <Avatar name={contact?.display_name} id={conv.id} />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <span className="text-[15px] font-medium text-gray-900 truncate">
                        {contact?.display_name || formatPhoneDisplay(contact?.phone_e164 || "")}
                      </span>
                      <span className={`text-[11px] flex-shrink-0 ${conv.unread_count > 0 ? "text-[#00a884] font-medium" : "text-gray-500"}`}>
                        {formatDate(conv.last_message_at)}
                      </span>
                    </div>
                    <div className="flex items-center justify-between mt-0.5">
                      <span className="text-[13px] text-gray-500 truncate pr-2">
                        {conv.last_message_preview || "Pas de message"}
                      </span>
                      {conv.unread_count > 0 && (
                        <span className="bg-[#00a884] text-white text-[11px] font-bold rounded-full min-w-[20px] h-5 flex items-center justify-center px-1.5 flex-shrink-0">
                          {conv.unread_count}
                        </span>
                      )}
                    </div>
                  </div>
                </button>
              );
            })
          )}
        </div>

        {/* Bottom nav */}
        <div className="border-t border-gray-200 bg-[#f0f2f5] py-2 flex justify-around">
          <Link to="/admin/whatsapp-bulk" className="flex flex-col items-center gap-0.5 px-3 py-1 text-gray-500 hover:text-[#00a884] transition-colors">
            <Send className="w-4 h-4" />
            <span className="text-[10px]">Bulk</span>
          </Link>
          <Link to="/admin/whatsapp-crm" className="flex flex-col items-center gap-0.5 px-3 py-1 text-gray-500 hover:text-[#00a884] transition-colors">
            <FileText className="w-4 h-4" />
            <span className="text-[10px]">Admin</span>
          </Link>
        </div>
      </div>

      {/* ===== CHAT AREA ===== */}
      {activeConvId && activeConv ? (
        <div className="flex-1 flex flex-col" style={{ backgroundImage: "url('data:image/svg+xml,%3Csvg width=\"60\" height=\"60\" xmlns=\"http://www.w3.org/2000/svg\"%3E%3Cpath d=\"M30 5 L35 15 L30 25 L25 15Z\" fill=\"%23d4cfc4\" opacity=\"0.15\"/%3E%3C/svg%3E')", backgroundColor: "#eae6df" }}>
          {/* Chat Header */}
          <div className="flex items-center justify-between px-4 py-2.5 bg-[#f0f2f5] border-b border-gray-200 flex-shrink-0">
            <div className="flex items-center gap-3 cursor-pointer" onClick={() => setShowContactPanel(!showContactPanel)}>
              <Avatar name={activeContact?.display_name} id={activeConvId} size="sm" />
              <div>
                <div className="text-[15px] font-medium text-gray-900">
                  {activeContact?.display_name || formatPhoneDisplay(activeContact?.phone_e164 || "")}
                </div>
                <div className="text-[12px] text-gray-500">
                  {activeContact?.display_name ? formatPhoneDisplay(activeContact?.phone_e164 || "") : ""}
                </div>
              </div>
            </div>
            <button onClick={() => setShowContactPanel(!showContactPanel)} className="p-2 rounded-full hover:bg-gray-300/50 transition-colors">
              <User className="w-5 h-5 text-gray-600" />
            </button>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto px-4 md:px-16 py-4">
            {loadingMessages ? (
              <div className="flex justify-center py-12"><Loader2 className="w-6 h-6 animate-spin text-gray-400" /></div>
            ) : messages.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-full text-gray-400 text-sm">
                <MessageCircle className="w-16 h-16 mb-3 opacity-30" />
                <p>Aucun message dans cette conversation</p>
              </div>
            ) : (
              <>
                {messages.map((msg, i) => {
                  const isOut = msg.direction === "outbound";
                  // Date separator
                  const showDate = i === 0 || format(new Date(msg.created_at), "yyyy-MM-dd") !== format(new Date(messages[i - 1].created_at), "yyyy-MM-dd");
                  return (
                    <div key={msg.id}>
                      {showDate && (
                        <div className="flex justify-center my-3">
                          <span className="bg-white/90 text-gray-500 text-[11px] px-3 py-1 rounded-lg shadow-sm">
                            {isToday(new Date(msg.created_at)) ? "Aujourd'hui" :
                              isYesterday(new Date(msg.created_at)) ? "Hier" :
                                format(new Date(msg.created_at), "d MMMM yyyy", { locale: fr })}
                          </span>
                        </div>
                      )}
                      <div className={`flex mb-1 ${isOut ? "justify-end" : "justify-start"}`}>
                        <div className={`max-w-[65%] px-3 py-1.5 rounded-lg shadow-sm relative ${isOut
                          ? "bg-[#d9fdd3] text-gray-900 rounded-tr-none"
                          : "bg-white text-gray-900 rounded-tl-none"
                          }`}>
                          <p className="text-[14px] leading-relaxed whitespace-pre-wrap break-words pr-14">
                            {msg.content || "[média]"}
                          </p>
                          <div className={`flex items-center gap-1 justify-end -mt-3 ${isOut ? "pr-0" : ""}`}>
                            <span className="text-[10px] text-gray-500">{formatMsgTime(msg.created_at)}</span>
                            {isOut && <StatusIcon status={msg.status} />}
                          </div>
                          {msg.status === "failed" && msg.error_message && (
                            <p className="text-[10px] text-red-500 mt-1">{msg.error_message}</p>
                          )}
                        </div>
                      </div>
                    </div>
                  );
                })}
                <div ref={messagesEndRef} />
              </>
            )}
          </div>

          {/* Message Input */}
          <div className="bg-[#f0f2f5] px-4 py-3 border-t border-gray-200 flex-shrink-0">
            <div className="flex items-end gap-2 max-w-4xl mx-auto">
              <div className="flex-1 bg-white rounded-lg">
                <textarea ref={textareaRef} value={messageText}
                  onChange={e => { setMessageText(e.target.value); e.target.style.height = "0"; e.target.style.height = Math.min(e.target.scrollHeight, 120) + "px"; }}
                  onKeyDown={handleKeyDown}
                  placeholder="Tapez un message"
                  rows={1}
                  className="w-full px-4 py-2.5 text-[14px] resize-none focus:outline-none rounded-lg max-h-[120px]" />
              </div>
              <button onClick={handleSend} disabled={!messageText.trim() || sending}
                className={`p-3 rounded-full transition-all flex-shrink-0 ${messageText.trim() && !sending
                  ? "bg-[#00a884] hover:bg-[#008f73] text-white"
                  : "bg-gray-200 text-gray-400 cursor-not-allowed"
                  }`}>
                <Send className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>
      ) : (
        /* Empty state */
        <div className="flex-1 flex flex-col items-center justify-center bg-[#f0f2f5]">
          <div className="text-center">
            <div className="w-[320px] h-[200px] mx-auto mb-6 flex items-center justify-center">
              <MessageCircle className="w-32 h-32 text-gray-300" strokeWidth={0.8} />
            </div>
            <h2 className="text-2xl font-light text-gray-700 mb-2">WhatsApp CRM</h2>
            <p className="text-sm text-gray-500 mb-6">Sélectionnez une conversation pour commencer</p>
            <button onClick={() => setShowNewConv(true)}
              className="inline-flex items-center gap-2 px-6 py-2.5 bg-[#00a884] hover:bg-[#008f73] text-white rounded-full text-sm font-medium transition-colors">
              <Plus className="w-4 h-4" />
              Nouvelle conversation
            </button>
          </div>
        </div>
      )}

      {/* ===== CONTACT PANEL ===== */}
      {showContactPanel && activeContact && (
        <div className="w-[340px] bg-white border-l border-gray-200 flex flex-col flex-shrink-0 overflow-y-auto">
          {/* Panel Header */}
          <div className="flex items-center gap-3 px-4 py-3 bg-[#f0f2f5] border-b border-gray-200">
            <button onClick={() => setShowContactPanel(false)} className="p-1.5 rounded-full hover:bg-gray-300/50">
              <X className="w-5 h-5 text-gray-600" />
            </button>
            <span className="text-base font-medium text-gray-800">Info contact</span>
          </div>

          {/* Contact Info */}
          <div className="flex flex-col items-center py-6 border-b border-gray-100">
            <Avatar name={activeContact.display_name} id={activeContact.id} size="lg" />
            <h3 className="mt-3 text-xl font-medium text-gray-900">
              {activeContact.display_name || "Sans nom"}
            </h3>
            <p className="text-sm text-gray-500 flex items-center gap-1 mt-1">
              <Phone className="w-3.5 h-3.5" />
              {formatPhoneDisplay(activeContact.phone_e164)}
            </p>
            <span className={`mt-2 text-[11px] px-2.5 py-0.5 rounded-full font-medium ${activeContact.status === "client" ? "bg-green-100 text-green-700" :
              activeContact.status === "vip" ? "bg-amber-100 text-amber-700" :
                activeContact.status === "lead" ? "bg-blue-100 text-blue-700" :
                  "bg-gray-100 text-gray-600"
              }`}>
              {activeContact.status}
            </span>
          </div>

          {/* Tags */}
          <div className="px-4 py-4 border-b border-gray-100">
            <h4 className="text-[12px] font-semibold text-gray-500 uppercase flex items-center gap-1.5 mb-2">
              <Tag className="w-3.5 h-3.5" /> Tags
            </h4>
            <div className="flex flex-wrap gap-1.5">
              {tags.map(tag => (
                <span key={tag.id} className="text-[11px] px-2 py-0.5 rounded-full text-white font-medium"
                  style={{ backgroundColor: tag.color }}>
                  {tag.name}
                </span>
              ))}
            </div>
          </div>

          {/* Notes */}
          <div className="px-4 py-4 border-b border-gray-100">
            <h4 className="text-[12px] font-semibold text-gray-500 uppercase flex items-center gap-1.5 mb-2">
              <StickyNote className="w-3.5 h-3.5" /> Notes internes
            </h4>
            {editingNotes ? (
              <div>
                <textarea value={notesText} onChange={e => setNotesText(e.target.value)}
                  className="w-full text-sm p-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-[#00a884] min-h-[80px]" />
                <div className="flex gap-2 mt-2">
                  <button onClick={saveNotes} className="text-xs px-3 py-1 bg-[#00a884] text-white rounded-lg hover:bg-[#008f73]">Sauvegarder</button>
                  <button onClick={() => setEditingNotes(false)} className="text-xs px-3 py-1 bg-gray-100 text-gray-600 rounded-lg hover:bg-gray-200">Annuler</button>
                </div>
              </div>
            ) : (
              <div onClick={() => { setNotesText(activeContact.notes_internal || ""); setEditingNotes(true); }}
                className="text-sm text-gray-600 cursor-pointer hover:bg-gray-50 p-2 rounded-lg min-h-[40px]">
                {activeContact.notes_internal || <span className="text-gray-400 italic">Cliquez pour ajouter des notes...</span>}
              </div>
            )}
          </div>

          {/* Dates */}
          <div className="px-4 py-4">
            <h4 className="text-[12px] font-semibold text-gray-500 uppercase mb-2">Infos</h4>
            <div className="space-y-2 text-sm text-gray-600">
              <div className="flex justify-between">
                <span>Premier contact</span>
                <span className="text-gray-800">{format(new Date(activeContact.created_at), "dd/MM/yy")}</span>
              </div>
              {activeContact.last_message_at && (
                <div className="flex justify-between">
                  <span>Dernier message</span>
                  <span className="text-gray-800">{formatDistanceToNow(new Date(activeContact.last_message_at), { locale: fr, addSuffix: true })}</span>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* ===== NEW CONVERSATION MODAL ===== */}
      {showNewConv && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50" onClick={() => setShowNewConv(false)}>
          <div className="bg-white rounded-xl p-6 w-[90%] max-w-md shadow-2xl" onClick={e => e.stopPropagation()}>
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Nouvelle conversation</h2>

            <div className="space-y-3">
              <div>
                <label className="text-xs font-medium text-gray-500 block mb-1">Numéro de téléphone *</label>
                <div className="relative">
                  <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <input type="tel" value={newPhone} onChange={e => setNewPhone(e.target.value)}
                    placeholder="06 01 02 03 04"
                    className="w-full pl-10 pr-4 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#00a884]" />
                </div>
              </div>

              <div>
                <label className="text-xs font-medium text-gray-500 block mb-1">Nom du contact</label>
                <input type="text" value={newName} onChange={e => setNewName(e.target.value)}
                  placeholder="Nom (optionnel)"
                  className="w-full px-4 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#00a884]" />
              </div>

              <div>
                <label className="text-xs font-medium text-gray-500 block mb-1">Premier message</label>
                <textarea value={newMessage} onChange={e => setNewMessage(e.target.value)}
                  placeholder="Message (optionnel)"
                  className="w-full px-4 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#00a884] min-h-[60px]" />
              </div>
            </div>

            <div className="flex gap-2 mt-5">
              <button onClick={() => setShowNewConv(false)} className="flex-1 py-2.5 text-sm text-gray-600 bg-gray-100 rounded-lg hover:bg-gray-200">
                Annuler
              </button>
              <button onClick={handleNewConversation} disabled={!newPhone.trim() || creatingConv}
                className="flex-1 py-2.5 text-sm text-white bg-[#00a884] rounded-lg hover:bg-[#008f73] disabled:opacity-50 flex items-center justify-center gap-2">
                {creatingConv ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
                Démarrer
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
