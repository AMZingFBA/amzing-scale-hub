import { useState, useEffect } from "react";
import { MessageCircle, X } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { createClient } from "@supabase/supabase-js";

const WA_SUPABASE_URL = "https://qyizaluzwueymavidxic.supabase.co";
const WA_SUPABASE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InF5aXphbHV6d3VleW1hdmlkeGljIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzYxNzYyNTUsImV4cCI6MjA5MTc1MjI1NX0.dTXh63wV1qRm5_b3ICon6wIAlvYMat6XWeVbH9ebamU";
const waSupabase = createClient(WA_SUPABASE_URL, WA_SUPABASE_KEY);

export function WhatsAppNotificationBanner() {
  const navigate = useNavigate();
  const [unreadCount, setUnreadCount] = useState(0);
  const [lastMessage, setLastMessage] = useState<{ contact: string; content: string } | null>(null);
  const [dismissed, setDismissed] = useState(false);

  const fetchUnread = async () => {
    const { data } = await waSupabase
      .from("conversations")
      .select("unread_count, contacts(display_name, phone_e164)")
      .gt("unread_count", 0);

    if (data?.length) {
      const total = data.reduce((sum: number, c: any) => sum + (c.unread_count || 0), 0);
      setUnreadCount(total);

      // Get the most recent unread message
      const { data: msg } = await waSupabase
        .from("messages")
        .select("content, contacts(display_name, phone_e164)")
        .eq("direction", "inbound")
        .order("created_at", { ascending: false })
        .limit(1)
        .single();

      if (msg) {
        const contact = (msg as any).contacts;
        setLastMessage({
          contact: contact?.display_name || contact?.phone_e164 || "Inconnu",
          content: (msg.content || "").substring(0, 80),
        });
      }
      setDismissed(false);
    } else {
      setUnreadCount(0);
    }
  };

  useEffect(() => {
    fetchUnread();

    // Listen for new inbound messages in realtime
    const channel = waSupabase
      .channel("wa-notif-banner")
      .on(
        "postgres_changes",
        { event: "INSERT", schema: "public", table: "messages", filter: "direction=eq.inbound" },
        (payload) => {
          fetchUnread();
        }
      )
      .on(
        "postgres_changes",
        { event: "UPDATE", schema: "public", table: "conversations" },
        () => {
          fetchUnread();
        }
      )
      .subscribe();

    // Also poll every 30s as fallback
    const interval = setInterval(fetchUnread, 30000);

    return () => {
      waSupabase.removeChannel(channel);
      clearInterval(interval);
    };
  }, []);

  if (unreadCount === 0 || dismissed) return null;

  return (
    <div
      className="fixed top-0 left-0 right-0 z-[9999] px-4 py-3 flex items-center justify-between gap-3 shadow-lg cursor-pointer animate-in slide-in-from-top"
      style={{
        background: "linear-gradient(135deg, #dc2626 0%, #b91c1c 100%)",
        color: "white",
      }}
      onClick={() => navigate("/admin/whatsapp-crm")}
    >
      <div className="flex items-center gap-3 flex-1 min-w-0">
        <div className="relative flex-shrink-0">
          <MessageCircle className="w-6 h-6" />
          <span className="absolute -top-1.5 -right-1.5 bg-white text-red-600 text-[10px] font-bold w-5 h-5 rounded-full flex items-center justify-center">
            {unreadCount > 99 ? "99+" : unreadCount}
          </span>
        </div>
        <div className="min-w-0">
          <p className="text-sm font-semibold">
            {unreadCount} message{unreadCount > 1 ? "s" : ""} WhatsApp non lu{unreadCount > 1 ? "s" : ""}
          </p>
          {lastMessage && (
            <p className="text-xs opacity-90 truncate">
              <strong>{lastMessage.contact}</strong> : {lastMessage.content}
            </p>
          )}
        </div>
      </div>

      <div className="flex items-center gap-2 flex-shrink-0">
        <span className="text-xs bg-white/20 px-3 py-1 rounded-full font-medium">
          Voir
        </span>
        <button
          onClick={(e) => {
            e.stopPropagation();
            setDismissed(true);
          }}
          className="p-1 hover:bg-white/20 rounded-full transition-colors"
        >
          <X className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}
