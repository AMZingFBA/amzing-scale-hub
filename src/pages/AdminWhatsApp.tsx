import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, MessageSquare, RefreshCw, Send, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { useAdmin } from "@/hooks/use-admin";
import { useAuth } from "@/hooks/use-auth";

const WHATSAPP_SUPABASE_URL = "https://bxynpsxxalxcchewxmvf.supabase.co";
const WHATSAPP_ANON_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJ4eW5wc3h4YWx4Y2NoZXd4bXZmIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzM2MjAwMjIsImV4cCI6MjA4OTE5NjAyMn0.gLYq9wofJIKAYSNfhTCl87SVvrQ8JaSkt81c2kUSzKI";
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

const AdminWhatsApp = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { isAdmin, isLoading: adminLoading } = useAdmin();
  const { session } = useAuth();

  const [messages, setMessages] = useState<WhatsAppMessage[]>([]);
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [selectedPhone, setSelectedPhone] = useState<string | null>(null);
  const [reply, setReply] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [isFirstLoad, setIsFirstLoad] = useState(true);
  const [isSending, setIsSending] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!adminLoading && !isAdmin) {
      navigate("/");
    }
  }, [isAdmin, adminLoading, navigate]);

  const fetchMessages = async () => {
    if (isFirstLoad) setIsLoading(true);
    try {
      // Fetch all messages with pagination (Supabase max 1000 per request)
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

      setMessages(allMessages);

      // Group by phone number
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
        // Conversations avec réponses en premier, puis par date
        .sort((a, b) => {
          if (a.hasIncoming && !b.hasIncoming) return -1;
          if (!a.hasIncoming && b.hasIncoming) return 1;
          return new Date(b.lastDate).getTime() - new Date(a.lastDate).getTime();
        });

      setConversations(convos);
    } catch {
      toast({ variant: "destructive", title: "Erreur", description: "Impossible de charger les messages" });
    } finally {
      setIsLoading(false);
      setIsFirstLoad(false);
    }
  };

  useEffect(() => {
    if (isAdmin) {
      fetchMessages();
      const interval = setInterval(fetchMessages, 10000);
      return () => clearInterval(interval);
    }
  }, [isAdmin]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [selectedPhone, messages]);

  const selectedConvo = conversations.find((c) => c.phone === selectedPhone);

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

      if (!res.ok) {
        throw new Error(data.error || "Erreur envoi");
      }

      setReply("");
      toast({ title: "Message envoyé" });
      await fetchMessages();
    } catch (err: any) {
      toast({ variant: "destructive", title: "Erreur", description: err.message });
    } finally {
      setIsSending(false);
    }
  };

  const formatTime = (dateStr: string) => {
    const d = new Date(dateStr);
    return d.toLocaleString("fr-FR", { day: "2-digit", month: "2-digit", hour: "2-digit", minute: "2-digit" });
  };

  const formatPhone = (raw: string) => {
    const digits = raw.replace(/\D/g, "");
    // FR: 33601148619 -> +33 6 01 14 86 19
    if (digits.startsWith("33") && digits.length === 11) {
      const n = digits.slice(2);
      return `+33 ${n[0]} ${n.slice(1, 3)} ${n.slice(3, 5)} ${n.slice(5, 7)} ${n.slice(7, 9)}`;
    }
    // International: group by 2-3
    return "+" + digits.replace(/(\d{2})(?=\d)/g, "$1 ");
  };

  if (adminLoading || isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">Chargement...</div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Button
        variant="ghost"
        onClick={() => navigate(-1)}
        className="fixed top-4 left-4 z-50 text-primary hover:scale-110 transition-transform"
      >
        <ArrowLeft className="h-6 w-6" />
      </Button>

      <div className="max-w-7xl mx-auto p-4 pt-16">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <MessageSquare className="h-8 w-8 text-green-500" />
            <h1 className="text-3xl font-bold">WhatsApp</h1>
            <Badge variant="secondary">{conversations.length} conversations</Badge>
          </div>
          <Button variant="outline" onClick={fetchMessages}>
            <RefreshCw className="h-4 w-4 mr-2" />
            Actualiser
          </Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 h-[calc(100vh-160px)]">
          {/* Liste des conversations */}
          <Card className="md:col-span-1 overflow-hidden">
            <CardHeader className="pb-2">
              <CardTitle className="text-lg">Conversations</CardTitle>
            </CardHeader>
            <CardContent className="p-0 overflow-y-auto max-h-[calc(100vh-260px)]">
              {conversations.length === 0 ? (
                <p className="text-center text-muted-foreground py-8">Aucune conversation</p>
              ) : (
                conversations.map((convo) => (
                  <button
                    key={convo.phone}
                    onClick={() => setSelectedPhone(convo.phone)}
                    className={`w-full text-left p-4 border-b hover:bg-muted/50 transition-colors ${
                      selectedPhone === convo.phone ? "bg-muted" : ""
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2 min-w-0">
                        <div className="h-10 w-10 rounded-full bg-green-100 flex items-center justify-center shrink-0">
                          <User className="h-5 w-5 text-green-600" />
                        </div>
                        <div className="min-w-0">
                          <p className="font-medium truncate">{convo.contactName}</p>
                          <p className="text-sm text-muted-foreground truncate">{convo.lastMessage}</p>
                        </div>
                      </div>
                      <div className="text-right shrink-0 ml-2">
                        <p className="text-xs text-muted-foreground">{formatTime(convo.lastDate)}</p>
                        {convo.unread > 0 && (
                          <Badge className="bg-green-500 text-white mt-1">{convo.unread}</Badge>
                        )}
                      </div>
                    </div>
                  </button>
                ))
              )}
            </CardContent>
          </Card>

          {/* Zone de chat */}
          <Card className="md:col-span-2 flex flex-col overflow-hidden">
            {selectedConvo ? (
              <>
                <CardHeader className="pb-2 border-b">
                  <div className="flex items-center gap-3">
                    <div className="h-10 w-10 rounded-full bg-green-100 flex items-center justify-center">
                      <User className="h-5 w-5 text-green-600" />
                    </div>
                    <div>
                      <CardTitle className="text-lg">{selectedConvo.contactName}</CardTitle>
                      <p className="text-sm text-muted-foreground">{formatPhone(selectedConvo.phone)}</p>
                    </div>
                  </div>
                </CardHeader>

                <CardContent className="flex-1 overflow-y-auto p-4 space-y-3 max-h-[calc(100vh-360px)]">
                  {selectedConvo.messages.map((msg) => (
                    <div
                      key={msg.id}
                      className={`flex ${msg.direction === "outgoing" ? "justify-end" : "justify-start"}`}
                    >
                      <div
                        className={`max-w-[75%] rounded-2xl px-4 py-2 ${
                          msg.direction === "outgoing"
                            ? "bg-green-500 text-white rounded-br-md"
                            : "bg-muted rounded-bl-md"
                        }`}
                      >
                        <p className="text-sm whitespace-pre-wrap">{msg.body || `[${msg.message_type}]`}</p>
                        {msg.direction === "outgoing" && msg.body && msg.body.includes("bouton ci-dessous") && (
                          <a
                            href="https://amzingfba.com"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="mt-2 block text-center bg-white/20 hover:bg-white/30 text-white text-sm font-medium py-2 px-4 rounded-lg border border-white/30 transition-colors"
                          >
                            Découvrir AMZing FBA
                          </a>
                        )}
                        <p
                          className={`text-xs mt-1 ${
                            msg.direction === "outgoing" ? "text-green-100" : "text-muted-foreground"
                          }`}
                        >
                          {formatTime(msg.created_at)}
                        </p>
                      </div>
                    </div>
                  ))}
                  <div ref={messagesEndRef} />
                </CardContent>

                <div className="p-4 border-t">
                  <form
                    onSubmit={(e) => {
                      e.preventDefault();
                      handleSend();
                    }}
                    className="flex gap-2"
                  >
                    <Input
                      value={reply}
                      onChange={(e) => setReply(e.target.value)}
                      placeholder="Tapez votre message..."
                      disabled={isSending}
                      className="flex-1"
                    />
                    <Button type="submit" disabled={isSending || !reply.trim()} className="bg-green-500 hover:bg-green-600">
                      <Send className="h-4 w-4" />
                    </Button>
                  </form>
                </div>
              </>
            ) : (
              <div className="flex-1 flex items-center justify-center text-muted-foreground">
                <div className="text-center">
                  <MessageSquare className="h-16 w-16 mx-auto mb-4 opacity-30" />
                  <p>Sélectionnez une conversation</p>
                </div>
              </div>
            )}
          </Card>
        </div>
      </div>
    </div>
  );
};

export default AdminWhatsApp;
