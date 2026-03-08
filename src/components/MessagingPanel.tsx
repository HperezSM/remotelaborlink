import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import MessageThread from "./MessageThread";
import { Search } from "lucide-react";
import type { Database } from "@/integrations/supabase/types";

type AppRole = Database["public"]["Enums"]["app_role"];

interface Contact {
  id: string;
  userId: string;
  name: string;
  role: AppRole;
  threadId: string;
  lastMessage?: string;
  lastTime?: string;
  unread: number;
}

interface MessagingPanelProps {
  contacts?: { userId: string; name: string; role: AppRole }[];
}

function generateThreadId(id1: string, id2: string) {
  return [id1, id2].sort().join("-");
}

const MessagingPanel = ({ contacts: externalContacts }: MessagingPanelProps) => {
  const { user, role } = useAuth();
  const [threads, setThreads] = useState<Contact[]>([]);
  const [activeThread, setActiveThread] = useState<Contact | null>(null);
  const [loading, setLoading] = useState(true);
  const [searchFilter, setSearchFilter] = useState("");

  useEffect(() => {
    loadThreads();
  }, [user, externalContacts]);

  const loadThreads = async () => {
    if (!user) return;
    setLoading(true);

    const { data: msgs } = await supabase
      .from("messages")
      .select("*")
      .or(`sender_id.eq.${user.id},recipient_id.eq.${user.id}`)
      .order("created_at", { ascending: false });

    const threadMap = new Map<string, { lastMsg: any; unread: number }>();

    (msgs || []).forEach(m => {
      if (!threadMap.has(m.thread_id)) {
        threadMap.set(m.thread_id, { lastMsg: m, unread: 0 });
      }
      if (m.recipient_id === user.id && !m.read) {
        const entry = threadMap.get(m.thread_id)!;
        entry.unread++;
      }
    });

    const contactList: Contact[] = [];

    if (externalContacts) {
      externalContacts.forEach(c => {
        const threadId = generateThreadId(user.id, c.userId);
        const existing = threadMap.get(threadId);
        contactList.push({
          id: c.userId,
          userId: c.userId,
          name: c.name,
          role: c.role,
          threadId,
          lastMessage: existing?.lastMsg?.content,
          lastTime: existing?.lastMsg?.created_at,
          unread: existing?.unread || 0,
        });
      });
    }

    threadMap.forEach((val, threadId) => {
      if (!contactList.find(c => c.threadId === threadId)) {
        const otherId = val.lastMsg.sender_id === user.id ? val.lastMsg.recipient_id : val.lastMsg.sender_id;
        const otherRole = val.lastMsg.sender_id === user.id ? val.lastMsg.recipient_role : val.lastMsg.sender_role;
        contactList.push({
          id: otherId,
          userId: otherId,
          name: otherRole === "admin" ? "Admin Team" : "User",
          role: otherRole,
          threadId,
          lastMessage: val.lastMsg.content,
          lastTime: val.lastMsg.created_at,
          unread: val.unread,
        });
      }
    });

    contactList.sort((a, b) => {
      if (a.unread !== b.unread) return b.unread - a.unread;
      if (a.lastTime && b.lastTime) return new Date(b.lastTime).getTime() - new Date(a.lastTime).getTime();
      return 0;
    });

    setThreads(contactList);
    setLoading(false);
  };

  const filteredThreads = searchFilter
    ? threads.filter(t => t.name.toLowerCase().includes(searchFilter.toLowerCase()))
    : threads;

  const formatRelativeTime = (dateStr?: string) => {
    if (!dateStr) return "";
    const d = new Date(dateStr);
    const now = new Date();
    const diffMs = now.getTime() - d.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    if (diffMins < 1) return "now";
    if (diffMins < 60) return `${diffMins}m`;
    const diffHours = Math.floor(diffMins / 60);
    if (diffHours < 24) return `${diffHours}h`;
    const diffDays = Math.floor(diffHours / 24);
    return `${diffDays}d`;
  };

  if (!user) return null;

  return (
    <div className="flex h-[500px] border border-border rounded-lg overflow-hidden bg-background">
      {/* Thread list */}
      <div className="w-72 border-r border-border flex flex-col shrink-0">
        <div className="px-4 py-3 border-b border-border">
          <span className="font-mono text-[10px] uppercase tracking-wider text-muted-foreground">Conversations</span>
          <div className="mt-2 relative">
            <Search size={12} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
            <input
              value={searchFilter}
              onChange={e => setSearchFilter(e.target.value)}
              placeholder="Search contacts..."
              className="w-full bg-card border border-border rounded pl-8 pr-3 py-1.5 text-xs text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary"
            />
          </div>
        </div>
        <div className="flex-1 overflow-y-auto">
          {filteredThreads.length === 0 && !loading && (
            <div className="p-4 text-sm text-muted-foreground text-center">
              {searchFilter ? "No contacts match" : "No conversations yet"}
            </div>
          )}
          {filteredThreads.map(t => (
            <button
              key={t.threadId}
              onClick={() => setActiveThread(t)}
              className={`w-full text-left px-4 py-3 border-b border-border hover:bg-muted/30 transition-colors ${
                activeThread?.threadId === t.threadId ? "bg-muted/40" : ""
              }`}
            >
              <div className="flex items-center justify-between">
                <span className="font-bold text-sm text-foreground truncate">{t.name}</span>
                <div className="flex items-center gap-2 shrink-0">
                  {t.lastTime && <span className="text-[9px] font-mono text-muted-foreground">{formatRelativeTime(t.lastTime)}</span>}
                  {t.unread > 0 && (
                    <span className="w-5 h-5 bg-primary text-primary-foreground text-[9px] font-bold rounded-full flex items-center justify-center">
                      {t.unread}
                    </span>
                  )}
                </div>
              </div>
              <span className="text-[10px] font-mono text-muted-foreground uppercase">{t.role}</span>
              {t.lastMessage && <p className="text-xs text-muted-foreground truncate mt-0.5">{t.lastMessage}</p>}
            </button>
          ))}
        </div>
      </div>

      {/* Thread content */}
      <div className="flex-1 flex flex-col">
        {activeThread ? (
          <MessageThread
            threadId={activeThread.threadId}
            recipientId={activeThread.userId}
            recipientRole={activeThread.role}
            recipientName={activeThread.name}
          />
        ) : (
          <div className="flex-1 flex items-center justify-center text-sm text-muted-foreground">
            Select a conversation to start messaging
          </div>
        )}
      </div>
    </div>
  );
};

export default MessagingPanel;
