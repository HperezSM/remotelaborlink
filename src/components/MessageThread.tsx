import { useState, useEffect, useRef } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { Send } from "lucide-react";
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
  const bottomRef = useRef<HTMLDivElement>(null);

  const fetchMessages = async () => {
    const { data } = await supabase
      .from("messages")
      .select("*")
      .eq("thread_id", threadId)
      .order("created_at", { ascending: true });
    setMessages(data || []);

    // Mark unread as read
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

  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="px-4 py-3 border-b border-border">
        <h3 className="font-bold text-sm text-foreground">{recipientName}</h3>
        <span className="text-[10px] font-mono text-muted-foreground uppercase">{recipientRole}</span>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-3">
        {messages.length === 0 && (
          <div className="text-center text-sm text-muted-foreground py-8">No messages yet. Start the conversation.</div>
        )}
        {messages.map(m => {
          const isMine = m.sender_id === user?.id;
          return (
            <div key={m.id} className={`flex ${isMine ? "justify-end" : "justify-start"}`}>
              <div className={`max-w-[75%] rounded-lg px-4 py-2.5 ${isMine ? "bg-primary text-primary-foreground" : "bg-muted text-foreground"}`}>
                <p className="text-sm whitespace-pre-wrap">{m.content}</p>
                <span className={`text-[9px] font-mono mt-1 block ${isMine ? "text-primary-foreground/60" : "text-muted-foreground"}`}>
                  {new Date(m.created_at).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                </span>
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
