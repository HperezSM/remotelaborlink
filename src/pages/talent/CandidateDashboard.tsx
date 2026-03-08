import { useState, useEffect } from "react";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";
import PageLayout from "@/components/PageLayout";
import NotificationBell from "@/components/NotificationBell";
import MessagingPanel from "@/components/MessagingPanel";
import { Eye } from "lucide-react";

const CandidateDashboard = () => {
  const { user } = useAuth();
  const [profile, setProfile] = useState<any>(null);
  const [activeTab, setActiveTab] = useState<"dashboard" | "messages" | "views">("dashboard");
  const [profileViews, setProfileViews] = useState<any[]>([]);
  const [applications, setApplications] = useState<any[]>([]);

  useEffect(() => {
    if (!user) return;
    const load = async () => {
      const { data } = await supabase.from("candidate_profiles").select("*").eq("user_id", user.id).single();
      setProfile(data);
      if (data) {
        const [viewsRes, appsRes] = await Promise.all([
          supabase.from("profile_views").select("viewed_at").eq("candidate_id", data.id).order("viewed_at", { ascending: false }),
          supabase.from("job_applications").select("*, jobs(title, role_type)").eq("candidate_id", data.id).order("applied_at", { ascending: false }),
        ]);
        setProfileViews(viewsRes.data || []);
        setApplications(appsRes.data || []);
      }
    };
    load();
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
            <button onClick={() => setActiveTab("views")} className={`pb-3 text-sm font-bold flex items-center gap-1 ${activeTab === "views" ? "text-foreground border-b-2 border-primary" : "text-muted-foreground"}`}>
              <Eye size={14} /> Profile Views
              {profileViews.length > 0 && (
                <span className="w-5 h-5 bg-primary text-primary-foreground text-[9px] font-bold rounded-full flex items-center justify-center ml-1">
                  {profileViews.length}
                </span>
              )}
            </button>
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
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
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
                <div className="card-surface p-8 flex flex-col items-center text-center cursor-pointer hover:border-primary/30 transition-colors" onClick={() => setActiveTab("views")}>
                  <h3 className="font-display text-xl mb-2">PROFILE VIEWS</h3>
                  <p className="text-sm text-muted-foreground mb-4">{profileViews.length} total view{profileViews.length !== 1 ? "s" : ""}</p>
                  <span className="text-primary text-sm font-bold">View Details →</span>
                </div>
              </div>

              {/* Job Applications */}
              {applications.length > 0 && (
                <div className="mt-8">
                  <h2 className="font-display text-xl mb-4">YOUR APPLICATIONS</h2>
                  <div className="space-y-3">
                    {applications.map((app: any) => (
                      <div key={app.id} className="card-surface p-5 flex items-center justify-between">
                        <div>
                          <h4 className="font-bold text-sm">{app.jobs?.title || "Job"}</h4>
                          <p className="text-xs text-muted-foreground">{app.jobs?.role_type} · Applied {new Date(app.applied_at).toLocaleDateString()}</p>
                        </div>
                        <span className={`text-[10px] font-mono px-2.5 py-1 rounded-full font-semibold ${
                          app.status === "shortlisted" ? "status-active" :
                          app.status === "rejected" ? "status-rejected" :
                          app.status === "reviewed" ? "status-screening" : "status-pending"
                        }`}>
                          {app.status}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </>
          )}

          {activeTab === "messages" && <MessagingPanel />}

          {activeTab === "views" && (
            <div>
              <div className="card-surface p-8 mb-6">
                <div className="flex items-center gap-3 mb-4">
                  <Eye size={20} className="text-primary" />
                  <h2 className="font-display text-xl">PROFILE VIEWS</h2>
                </div>
                <p className="text-3xl font-display text-foreground mb-1">{profileViews.length}</p>
                <p className="text-sm text-muted-foreground">Total views from companies</p>
              </div>

              {profileViews.length === 0 ? (
                <div className="card-surface p-12 text-center">
                  <Eye size={32} className="mx-auto mb-4 text-muted-foreground" />
                  <h3 className="font-display text-lg mb-2">NO VIEWS YET</h3>
                  <p className="text-sm text-muted-foreground">Companies will start viewing your profile once your application is approved. Make sure your profile is complete!</p>
                </div>
              ) : (
                <div className="space-y-2">
                  {profileViews.map((v: any, i: number) => (
                    <div key={i} className="card-surface px-6 py-4 flex items-center gap-3">
                      <Eye size={14} className="text-muted-foreground" />
                      <span className="text-sm text-foreground">
                        Viewed on {new Date(v.viewed_at).toLocaleDateString([], { month: "long", day: "numeric", year: "numeric" })} at {new Date(v.viewed_at).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                      </span>
                    </div>
                  ))}
                </div>
              )}
              <p className="text-[10px] text-muted-foreground mt-4 font-mono text-center">Company identities are kept confidential</p>
            </div>
          )}
        </div>
      </section>
    </PageLayout>
  );
};

export default CandidateDashboard;
