import { useState, useEffect } from "react";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";
import PageLayout from "@/components/PageLayout";
import NotificationBell from "@/components/NotificationBell";
import MessagingPanel from "@/components/MessagingPanel";

const CandidateDashboard = () => {
  const { user } = useAuth();
  const [profile, setProfile] = useState<any>(null);
  const [activeTab, setActiveTab] = useState<"dashboard" | "messages">("dashboard");

  useEffect(() => {
    if (!user) return;
    supabase.from("candidate_profiles").select("*").eq("user_id", user.id).single().then(({ data }) => setProfile(data));
  }, [user]);

  const statusSteps = [
    { label: "Submitted", key: "pending_review" },
    { label: "Under Review", key: "screening" },
    { label: "Screening Call", key: "screening" },
    { label: "Active in Portal", key: "active" },
    { label: "Placed", key: "placed" },
  ];

  const currentStepIndex = () => {
    if (!profile) return 0;
    const map: Record<string, number> = { pending_review: 0, screening: 2, active: 3, placed: 4 };
    return map[profile.status] ?? 0;
  };

  return (
    <PageLayout>
      <section className="py-12">
        <div className="container mx-auto px-4 max-w-4xl">
          <div className="flex items-center justify-between mb-8">
            <div>
              <span className="section-tag">Dashboard</span>
              <h1 className="font-display text-4xl md:text-5xl">YOUR DASHBOARD</h1>
            </div>
            <div className="flex items-center gap-2">
              <NotificationBell />
            </div>
          </div>

          {/* Tab nav */}
          <div className="flex gap-4 mb-8 border-b border-border">
            <button onClick={() => setActiveTab("dashboard")} className={`pb-3 text-sm font-bold ${activeTab === "dashboard" ? "text-foreground border-b-2 border-primary" : "text-muted-foreground"}`}>Overview</button>
            <button onClick={() => setActiveTab("messages")} className={`pb-3 text-sm font-bold ${activeTab === "messages" ? "text-foreground border-b-2 border-primary" : "text-muted-foreground"}`}>Messages</button>
          </div>

          {activeTab === "dashboard" && (
            <>
              {/* Status tracker */}
              <div className="card-surface p-8 mb-8">
                <h2 className="font-body font-bold text-sm mb-6 normal-case text-foreground">Application Status</h2>
                <div className="flex items-center gap-2">
                  {statusSteps.map((step, i) => (
                    <div key={step.label} className="flex items-center gap-2 flex-1">
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-mono shrink-0 ${
                        i <= currentStepIndex() ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground"
                      }`}>
                        {i + 1}
                      </div>
                      <span className={`text-xs hidden sm:block ${i <= currentStepIndex() ? "text-foreground" : "text-muted-foreground"}`}>
                        {step.label}
                      </span>
                      {i < statusSteps.length - 1 && <div className="flex-1 h-px bg-border" />}
                    </div>
                  ))}
                </div>
              </div>

              {/* Quick actions */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="card-surface p-8 flex flex-col items-center text-center">
                  <h3 className="font-display text-xl mb-2">EDIT PROFILE</h3>
                  <p className="text-sm text-muted-foreground mb-4">Update your professional information</p>
                  <a href="/talent/profile/edit" className="text-primary text-sm font-bold hover:underline">Edit Profile →</a>
                </div>
                <div className="card-surface p-8 flex flex-col items-center text-center cursor-pointer hover:border-primary/30 transition-colors" onClick={() => setActiveTab("messages")}>
                  <h3 className="font-display text-xl mb-2">MESSAGES</h3>
                  <p className="text-sm text-muted-foreground mb-4">Chat with the Remote LaborLink team</p>
                  <span className="text-primary text-sm font-bold">Open Messages →</span>
                </div>
              </div>
            </>
          )}

          {activeTab === "messages" && <MessagingPanel />}
        </div>
      </section>
    </PageLayout>
  );
};

export default CandidateDashboard;
