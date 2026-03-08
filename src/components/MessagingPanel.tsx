import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import MessageThread from "./MessageThread";
import type { Database } from "@/integrations/supabase/types";

type AppRole = Database["public"]["Enums"]["app_role"];

interface Contact {
  id: string;
  userId: string;
  name: string;
  role: AppRole;
  threadId: string;
  lastMessage?: string;
  unread: number;
}

interface MessagingPanelProps {
  /** For admin: load all threads. For candidate/company: load their threads */
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

  useEffect(() => {
    loadThreads();
  }, [user, externalContacts]);

  const loadThreads = async () => {
    if (!user) return;
    setLoading(true);

    // Get all messages involving this user
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

    // Build contact list from external contacts + discovered threads
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
          unread: existing?.unread || 0,
        });
      });
    }

    // Also add any threads not in externalContacts (discovered from messages)
    threadMap.forEach((val, threadId) => {
      if (!contactList.find(c => c.threadId === threadId)) {
        const otherId = val.lastMsg.sender_id === user.id ? val.lastMsg.recipient_id : val.lastMsg.sender_id;
        const otherRole = val.lastMsg.sender_id === user.id ? val.lastMsg.recipient_role : val.lastMsg.sender_role;
        contactList.push({
          id: otherId,
          userId: otherId,
          name: otherRole === "admin" ? "Admin Team" : `User`,
          role: otherRole,
          threadId,
          lastMessage: val.lastMsg.content,
          unread: val.unread,
        });
      }
    });

    // Sort: unread first, then by last message
    contactList.sort((a, b) => (b.unread - a.unread));
    setThreads(contactList);
    setLoading(false);
  };

  if (!user) return null;

  return (
    <div className="flex h-[500px] border border-border rounded-lg overflow-hidden bg-background">
      {/* Thread list */}
      <div className="w-64 border-r border-border flex flex-col shrink-0">
        <div className="px-4 py-3 border-b border-border">
          <span className="font-mono text-[10px] uppercase tracking-wider text-muted-foreground">Conversations</span>
        </div>
        <div className="flex-1 overflow-y-auto">
          {threads.length === 0 && !loading && (
            <div className="p-4 text-sm text-muted-foreground text-center">No conversations yet</div>
          )}
          {threads.map(t => (
            <button
              key={t.threadId}
              onClick={() => setActiveThread(t)}
              className={`w-full text-left px-4 py-3 border-b border-border hover:bg-muted/30 transition-colors ${
                activeThread?.threadId === t.threadId ? "bg-muted/40" : ""
              }`}
            >
              <div className="flex items-center justify-between">
                <span className="font-bold text-sm text-foreground truncate">{t.name}</span>
                {t.unread > 0 && (
                  <span className="w-5 h-5 bg-primary text-primary-foreground text-[9px] font-bold rounded-full flex items-center justify-center shrink-0">
                    {t.unread}
                  </span>
                )}
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
