import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, Check, CheckCheck, Clock, Search, Send, Smile } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useAdmin } from "@/hooks/use-admin";
import { useAuth } from "@/hooks/use-auth";

const WHATSAPP_SUPABASE_URL = "https://bxynpsxxalxcchewxmvf.supabase.co";
const SERVICE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJ4eW5wc3h4YWx4Y2NoZXd4bXZmIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc3MzYyMDAyMiwiZXhwIjoyMDg5MTk2MDIyfQ.hmsB2CN9x18MSs26dvNsLjT6bciKl804vjR59UXEQGM";

interface WhatsAppMessage {
  id: string;
  wamid: string;
  phone: string;
  contact_name: string | null;
  direction: "incoming" | "outgoing";
  message_type: string;
  body: string | null;
  status: string;
  created_at: string;
}

interface Conversation {
  phone: string;
  contactName: string;
  lastMessage: string;
  lastDate: string;
  unread: number;
  messages: WhatsAppMessage[];
  hasIncoming: boolean;
}

const StatusIcon = ({ status, direction }: { status: string; direction: string }) => {
  if (direction !== "outgoing") return null;
  switch (status) {
    case "read":
      return <CheckCheck className="w-[14px] h-[14px] text-[#53bdeb] inline-block ml-1" />;
    case "delivered":
      return <CheckCheck className="w-[14px] h-[14px] text-[#8696a0] inline-block ml-1" />;
    case "sent":
      return <Check className="w-[14px] h-[14px] text-[#8696a0] inline-block ml-1" />;
    default:
      return <Clock className="w-3 h-3 text-[#8696a0] inline-block ml-1" />;
  }
};

const AdminWhatsApp = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { isAdmin, isLoading: adminLoading } = useAdmin();
  const { session } = useAuth();

  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [selectedPhone, setSelectedPhone] = useState<string | null>(null);
  const [reply, setReply] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [initialLoaded, setInitialLoaded] = useState(false);
  const [isSending, setIsSending] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!adminLoading && !isAdmin) {
      navigate("/");
    }
  }, [isAdmin, adminLoading, navigate]);

  const fetchMessages = async () => {
    try {
      const allMessages: WhatsAppMessage[] = [];
      let offset = 0;
      const PAGE_SIZE = 1000;
      let hasMore = true;

      while (hasMore) {
        const res = await fetch(
          `${WHATSAPP_SUPABASE_URL}/rest/v1/whatsapp_messages?order=created_at.asc&limit=${PAGE_SIZE}&offset=${offset}`,
          {
            headers: {
              apikey: SERVICE_KEY,
              Authorization: `Bearer ${SERVICE_KEY}`,
              Prefer: "count=exact",
            },
          }
        );
        const data: WhatsAppMessage[] = await res.json();
        allMessages.push(...data);
        offset += PAGE_SIZE;
        hasMore = data.length === PAGE_SIZE;
      }

      const grouped: Record<string, WhatsAppMessage[]> = {};
      for (const msg of allMessages) {
        if (!grouped[msg.phone]) grouped[msg.phone] = [];
        grouped[msg.phone].push(msg);
      }

      const convos: Conversation[] = Object.entries(grouped)
        .map(([phone, msgs]) => {
          const last = msgs[msgs.length - 1];
          const incomingName = msgs.find((m) => m.contact_name && m.direction === "incoming")?.contact_name;
          const contactName = incomingName || msgs.find((m) => m.contact_name)?.contact_name || formatPhone(phone);
          const hasIncoming = msgs.some((m) => m.direction === "incoming");
          return {
            phone,
            contactName,
            lastMessage: last.body || `[${last.message_type}]`,
            lastDate: last.created_at,
            unread: msgs.filter((m) => m.direction === "incoming" && m.status === "received").length,
            messages: msgs,
            hasIncoming,
          };
        })
        .sort((a, b) => {
          if (a.hasIncoming && !b.hasIncoming) return -1;
          if (!a.hasIncoming && b.hasIncoming) return 1;
          return new Date(b.lastDate).getTime() - new Date(a.lastDate).getTime();
        });

      setConversations(convos);
      setInitialLoaded(true);
    } catch {
      toast({ variant: "destructive", title: "Erreur", description: "Impossible de charger les messages" });
    }
  };

  useEffect(() => {
    if (isAdmin) {
      fetchMessages();
      const interval = setInterval(fetchMessages, 5000);
      return () => clearInterval(interval);
    }
  }, [isAdmin]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [selectedPhone, conversations]);

  const selectedConvo = conversations.find((c) => c.phone === selectedPhone);

  // Marquer les messages incoming comme "read" quand on ouvre la conversation
  const markAsRead = async (phone: string) => {
    try {
      await fetch(
        `${WHATSAPP_SUPABASE_URL}/rest/v1/whatsapp_messages?phone=eq.${phone}&direction=eq.incoming&status=eq.received`,
        {
          method: "PATCH",
          headers: {
            apikey: SERVICE_KEY,
            Authorization: `Bearer ${SERVICE_KEY}`,
            "Content-Type": "application/json",
            Prefer: "return=minimal",
          },
          body: JSON.stringify({ status: "read" }),
        }
      );
    } catch {}
  };

  useEffect(() => {
    if (selectedPhone) {
      markAsRead(selectedPhone);
    }
  }, [selectedPhone]);

  const filteredConvos = searchQuery
    ? conversations.filter(
        (c) =>
          c.contactName.toLowerCase().includes(searchQuery.toLowerCase()) ||
          c.phone.includes(searchQuery)
      )
    : conversations;

  const handleSend = async () => {
    if (!reply.trim() || !selectedPhone || !session?.access_token) return;
    setIsSending(true);
    try {
      const res = await fetch(`${WHATSAPP_SUPABASE_URL}/functions/v1/whatsapp-send`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${session.access_token}`,
        },
        body: JSON.stringify({ phone: selectedPhone, message: reply }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Erreur envoi");
      setReply("");
      await fetchMessages();
    } catch (err: any) {
      toast({ variant: "destructive", title: "Erreur", description: err.message });
    } finally {
      setIsSending(false);
    }
  };

  const formatTime = (dateStr: string) => {
    const d = new Date(dateStr);
    const now = new Date();
    const isToday = d.toDateString() === now.toDateString();
    const yesterday = new Date(now);
    yesterday.setDate(yesterday.getDate() - 1);
    const isYesterday = d.toDateString() === yesterday.toDateString();

    if (isToday) return d.toLocaleTimeString("fr-FR", { hour: "2-digit", minute: "2-digit" });
    if (isYesterday) return "Hier";
    return d.toLocaleDateString("fr-FR", { day: "2-digit", month: "2-digit", year: "2-digit" });
  };

  const formatMsgTime = (dateStr: string) => {
    return new Date(dateStr).toLocaleTimeString("fr-FR", { hour: "2-digit", minute: "2-digit" });
  };

  const formatPhone = (raw: string) => {
    const digits = raw.replace(/\D/g, "");
    if (digits.startsWith("33") && digits.length === 11) {
      const n = digits.slice(2);
      return `+33 ${n[0]} ${n.slice(1, 3)} ${n.slice(3, 5)} ${n.slice(5, 7)} ${n.slice(7, 9)}`;
    }
    return "+" + digits.replace(/(\d{2})(?=\d)/g, "$1 ");
  };

  const getInitials = (name: string) => {
    return name.split(" ").map((w) => w[0]).join("").slice(0, 2).toUpperCase();
  };

  if (adminLoading || !initialLoaded) {
    return (
      <div className="h-screen flex items-center justify-center" style={{ background: "#111b21" }}>
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-[#00a884] border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p style={{ color: "#8696a0" }}>Chargement des conversations...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="h-screen flex" style={{ background: "#111b21", color: "#e9edef" }}>
      {/* Sidebar - Liste conversations */}
      <div
        className={`flex flex-col border-r ${selectedPhone ? "hidden md:flex" : "flex"}`}
        style={{ width: "100%", maxWidth: "420px", borderColor: "#233138", background: "#111b21" }}
      >
        {/* Header sidebar */}
        <div className="flex items-center justify-between px-4 py-3" style={{ background: "#202c33" }}>
          <div className="flex items-center gap-3">
            <button onClick={() => navigate(-1)} className="hover:opacity-70 transition-opacity">
              <ArrowLeft className="w-5 h-5" style={{ color: "#aebac1" }} />
            </button>
            <span className="font-medium text-lg">WhatsApp</span>
            <span className="text-xs px-2 py-0.5 rounded-full" style={{ background: "#00a884", color: "#111b21" }}>
              {conversations.length}
            </span>
          </div>
        </div>

        {/* Search */}
        <div className="px-3 py-2" style={{ background: "#111b21" }}>
          <div className="flex items-center gap-3 px-3 py-1.5 rounded-lg" style={{ background: "#202c33" }}>
            <Search className="w-4 h-4 shrink-0" style={{ color: "#8696a0" }} />
            <input
              type="text"
              placeholder="Rechercher ou d\u00e9marrer une discussion"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="bg-transparent border-none outline-none text-sm w-full placeholder-[#8696a0]"
              style={{ color: "#e9edef" }}
            />
          </div>
        </div>

        {/* Conversations list */}
        <div className="flex-1 overflow-y-auto">
          {filteredConvos.length === 0 ? (
            <p className="text-center py-8 text-sm" style={{ color: "#8696a0" }}>
              Aucune conversation
            </p>
          ) : (
            filteredConvos.map((convo) => (
              <button
                key={convo.phone}
                onClick={() => setSelectedPhone(convo.phone)}
                className="w-full text-left flex items-center gap-3 px-3 py-3 hover:bg-[#2a3942] transition-colors"
                style={{
                  background: selectedPhone === convo.phone ? "#2a3942" : "transparent",
                  borderBottom: "1px solid #233138",
                }}
              >
                {/* Avatar */}
                <div
                  className="w-12 h-12 rounded-full flex items-center justify-center shrink-0 text-sm font-medium"
                  style={{ background: "#6b7c85", color: "#cfd9df" }}
                >
                  {getInitials(convo.contactName)}
                </div>

                {/* Info */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between">
                    <span className="font-medium text-[15px] truncate" style={{ color: "#e9edef" }}>
                      {convo.contactName}
                    </span>
                    <span
                      className="text-xs shrink-0 ml-2"
                      style={{ color: convo.unread > 0 ? "#00a884" : "#8696a0" }}
                    >
                      {formatTime(convo.lastDate)}
                    </span>
                  </div>
                  <div className="flex items-center justify-between mt-0.5">
                    <p className="text-sm truncate" style={{ color: "#8696a0" }}>
                      {convo.messages[convo.messages.length - 1]?.direction === "outgoing" && (
                        <StatusIcon
                          status={convo.messages[convo.messages.length - 1].status}
                          direction="outgoing"
                        />
                      )}
                      {" "}
                      {convo.lastMessage.length > 45
                        ? convo.lastMessage.slice(0, 45) + "..."
                        : convo.lastMessage}
                    </p>
                    {convo.unread > 0 && (
                      <span
                        className="ml-2 shrink-0 w-5 h-5 rounded-full flex items-center justify-center text-xs font-medium"
                        style={{ background: "#00a884", color: "#111b21" }}
                      >
                        {convo.unread}
                      </span>
                    )}
                  </div>
                </div>
              </button>
            ))
          )}
        </div>
      </div>

      {/* Chat area */}
      <div className={`flex-1 flex flex-col ${!selectedPhone ? "hidden md:flex" : "flex"}`}>
        {selectedConvo ? (
          <>
            {/* Chat header */}
            <div
              className="flex items-center gap-3 px-4 py-2.5"
              style={{ background: "#202c33", borderBottom: "1px solid #233138" }}
            >
              <button
                onClick={() => setSelectedPhone(null)}
                className="md:hidden hover:opacity-70"
              >
                <ArrowLeft className="w-5 h-5" style={{ color: "#aebac1" }} />
              </button>
              <div
                className="w-10 h-10 rounded-full flex items-center justify-center text-sm font-medium"
                style={{ background: "#6b7c85", color: "#cfd9df" }}
              >
                {getInitials(selectedConvo.contactName)}
              </div>
              <div className="flex-1">
                <p className="font-medium text-[15px]" style={{ color: "#e9edef" }}>
                  {selectedConvo.contactName}
                </p>
                <p className="text-xs" style={{ color: "#8696a0" }}>
                  {formatPhone(selectedConvo.phone)}
                </p>
              </div>
            </div>

            {/* Messages area */}
            <div
              className="flex-1 overflow-y-auto px-[6%] py-4 space-y-1"
              style={{
                background: "#0b141a",
                backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23182229' fill-opacity='0.6'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
              }}
            >
              {selectedConvo.messages.map((msg) => (
                <div
                  key={msg.id}
                  className={`flex ${msg.direction === "outgoing" ? "justify-end" : "justify-start"} mb-0.5`}
                >
                  <div
                    className="relative max-w-[65%] rounded-lg px-[9px] pt-1.5 pb-2 shadow-sm"
                    style={{
                      background: msg.direction === "outgoing" ? "#005c4b" : "#202c33",
                      borderTopLeftRadius: msg.direction === "incoming" ? "2px" : "8px",
                      borderTopRightRadius: msg.direction === "outgoing" ? "2px" : "8px",
                    }}
                  >
                    <p className="text-[14.2px] leading-[19px] whitespace-pre-wrap" style={{ color: "#e9edef" }}>
                      {msg.body || `[${msg.message_type}]`}
                    </p>
                    {msg.direction === "outgoing" && msg.body && msg.body.includes("bouton ci-dessous") && (
                      <a
                        href="https://amzingfba.com"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="mt-2 flex items-center justify-center gap-2 py-2 rounded-md text-sm font-medium transition-opacity hover:opacity-80"
                        style={{ background: "#0b6156", color: "#53bdeb" }}
                      >
                        <Smile className="w-4 h-4" />
                        D\u00e9couvrir AMZing FBA
                      </a>
                    )}
                    <span className="flex items-center justify-end gap-0.5 mt-0.5">
                      <span className="text-[11px]" style={{ color: msg.direction === "outgoing" ? "#ffffff99" : "#8696a0" }}>
                        {formatMsgTime(msg.created_at)}
                      </span>
                      <StatusIcon status={msg.status} direction={msg.direction} />
                    </span>
                  </div>
                </div>
              ))}
              <div ref={messagesEndRef} />
            </div>

            {/* Input bar */}
            <div className="flex items-center gap-2 px-4 py-3" style={{ background: "#202c33" }}>
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  handleSend();
                }}
                className="flex items-center gap-2 flex-1"
              >
                <div className="flex-1 flex items-center rounded-lg px-3 py-2" style={{ background: "#2a3942" }}>
                  <input
                    type="text"
                    value={reply}
                    onChange={(e) => setReply(e.target.value)}
                    placeholder="Tapez un message"
                    disabled={isSending}
                    className="bg-transparent border-none outline-none text-[15px] w-full placeholder-[#8696a0]"
                    style={{ color: "#e9edef" }}
                  />
                </div>
                <button
                  type="submit"
                  disabled={isSending || !reply.trim()}
                  className="w-10 h-10 rounded-full flex items-center justify-center transition-opacity disabled:opacity-40"
                  style={{ background: "#00a884" }}
                >
                  <Send className="w-5 h-5" style={{ color: "#111b21" }} />
                </button>
              </form>
            </div>
          </>
        ) : (
          <div className="flex-1 flex items-center justify-center" style={{ background: "#222e35" }}>
            <div className="text-center">
              <div className="w-[320px] mx-auto mb-6">
                <svg viewBox="0 0 303 172" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full opacity-20">
                  <path d="M229.565 160.229c32.647-16.023 55.191-48.862 58.5-87.108C295.805-7.677 234.263-52.702 165.249-41.969 96.236-31.236 45.074 30.691 37.334 111.489c-3.309 38.246 11.138 74.09 38.067 99.74h154.164Z" fill="#364147"/>
                </svg>
              </div>
              <h2 className="text-[32px] font-light mb-3" style={{ color: "#e9edef" }}>AMZing FBA WhatsApp</h2>
              <p className="text-sm" style={{ color: "#8696a0" }}>
                S\u00e9lectionnez une conversation pour commencer
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminWhatsApp;
