import { useState, useEffect, useRef } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { Send, Search } from "lucide-react";
import type { Database } from "@/integrations/supabase/types";

type AppRole = Database["public"]["Enums"]["app_role"];

interface MessageThreadProps {
  threadId: string;
  recipientId: string;
  recipientRole: AppRole;
  recipientName: string;
}

const MessageThread = ({ threadId, recipientId, recipientRole, recipientName }: MessageThreadProps) => {
  const { user, role } = useAuth();
  const [messages, setMessages] = useState<any[]>([]);
  const [newMsg, setNewMsg] = useState("");
  const [sending, setSending] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [showSearch, setShowSearch] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);

  const fetchMessages = async () => {
    const { data } = await supabase
      .from("messages")
      .select("*")
      .eq("thread_id", threadId)
      .order("created_at", { ascending: true });
    setMessages(data || []);

    if (user && data) {
      const unread = data.filter(m => m.recipient_id === user.id && !m.read).map(m => m.id);
      if (unread.length > 0) {
        await supabase.from("messages").update({ read: true }).in("id", unread);
      }
    }
  };

  useEffect(() => {
    fetchMessages();
    const channel = supabase
      .channel(`messages-${threadId}`)
      .on("postgres_changes", { event: "INSERT", schema: "public", table: "messages", filter: `thread_id=eq.${threadId}` }, () => {
        fetchMessages();
      })
      .subscribe();
    return () => { supabase.removeChannel(channel); };
  }, [threadId]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const sendMessage = async () => {
    if (!newMsg.trim() || !user || !role) return;
    setSending(true);
    await supabase.from("messages").insert({
      thread_id: threadId,
      sender_id: user.id,
      sender_role: role as AppRole,
      recipient_id: recipientId,
      recipient_role: recipientRole,
      content: newMsg.trim(),
    });
    setNewMsg("");
    setSending(false);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); sendMessage(); }
  };

  const filteredMessages = searchQuery
    ? messages.filter(m => m.content.toLowerCase().includes(searchQuery.toLowerCase()))
    : messages;

  const formatTime = (date: string) => {
    const d = new Date(date);
    const now = new Date();
    const isToday = d.toDateString() === now.toDateString();
    if (isToday) return d.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
    return d.toLocaleDateString([], { month: "short", day: "numeric" }) + " " + d.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
  };

  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="px-4 py-3 border-b border-border flex items-center justify-between">
        <div>
          <h3 className="font-bold text-sm text-foreground">{recipientName}</h3>
          <span className="text-[10px] font-mono text-muted-foreground uppercase">{recipientRole}</span>
        </div>
        <button onClick={() => setShowSearch(!showSearch)} className="text-muted-foreground hover:text-foreground transition-colors">
          <Search size={14} />
        </button>
      </div>

      {/* Search bar */}
      {showSearch && (
        <div className="px-4 py-2 border-b border-border">
          <input
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            placeholder="Search messages..."
            className="w-full bg-background border border-border rounded px-3 py-1.5 text-xs text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary"
            autoFocus
          />
          {searchQuery && (
            <p className="text-[10px] text-muted-foreground mt-1">{filteredMessages.length} result{filteredMessages.length !== 1 ? "s" : ""}</p>
          )}
        </div>
      )}

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-3">
        {filteredMessages.length === 0 && !searchQuery && (
          <div className="text-center text-sm text-muted-foreground py-8">No messages yet. Start the conversation.</div>
        )}
        {filteredMessages.length === 0 && searchQuery && (
          <div className="text-center text-sm text-muted-foreground py-8">No messages match "{searchQuery}"</div>
        )}
        {filteredMessages.map((m, i) => {
          const isMine = m.sender_id === user?.id;
          const showDate = i === 0 || new Date(m.created_at).toDateString() !== new Date(filteredMessages[i - 1].created_at).toDateString();
          return (
            <div key={m.id}>
              {showDate && (
                <div className="text-center my-4">
                  <span className="text-[10px] font-mono text-muted-foreground bg-card px-3 py-1 rounded-full">
                    {new Date(m.created_at).toLocaleDateString([], { weekday: "short", month: "short", day: "numeric" })}
                  </span>
                </div>
              )}
              <div className={`flex ${isMine ? "justify-end" : "justify-start"}`}>
                <div className={`max-w-[75%] rounded-lg px-4 py-2.5 ${isMine ? "bg-primary text-primary-foreground" : "bg-muted text-foreground"}`}>
                  <p className="text-sm whitespace-pre-wrap">{m.content}</p>
                  <div className={`flex items-center gap-1 mt-1 ${isMine ? "justify-end" : ""}`}>
                    <span className={`text-[9px] font-mono ${isMine ? "text-primary-foreground/60" : "text-muted-foreground"}`}>
                      {formatTime(m.created_at)}
                    </span>
                    {isMine && m.read && (
                      <span className="text-[9px] text-primary-foreground/60">✓✓</span>
                    )}
                  </div>
                </div>
              </div>
            </div>
          );
        })}
        <div ref={bottomRef} />
      </div>

      {/* Input */}
      <div className="p-4 border-t border-border">
        <div className="flex gap-2">
          <textarea
            value={newMsg}
            onChange={e => setNewMsg(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Type a message..."
            rows={1}
            className="flex-1 bg-background border border-border rounded px-4 py-2.5 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary resize-none"
          />
          <button
            onClick={sendMessage}
            disabled={sending || !newMsg.trim()}
            className="px-3 py-2 bg-primary text-primary-foreground rounded hover:opacity-90 disabled:opacity-40 transition-opacity"
          >
            <Send size={16} />
          </button>
        </div>
      </div>
    </div>
  );
};

export default MessageThread;
