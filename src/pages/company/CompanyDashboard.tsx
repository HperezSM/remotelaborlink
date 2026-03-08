import { useState, useEffect } from "react";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Link, useNavigate } from "react-router-dom";
import { signOut } from "@/lib/auth";
import logoIcon from "@/assets/logo-icon.png";
import { LayoutDashboard, FileText, Users, MessageSquare, Settings, LogOut } from "lucide-react";
import NotificationBell from "@/components/NotificationBell";
import MessagingPanel from "@/components/MessagingPanel";

const sidebarItems = [
  { label: "Overview", icon: LayoutDashboard, id: "overview" },
  { label: "Role Requests", icon: FileText, id: "roles" },
  { label: "Talent Pool", icon: Users, id: "talent" },
  { label: "Compare", icon: Users, id: "compare" },
  { label: "Messages", icon: MessageSquare, id: "messages" },
  { label: "Settings", icon: Settings, id: "settings" },
];

const ROLE_OPTIONS = [
  "Project Manager", "Scrum Master", "Full Stack Developer", "Frontend Developer",
  "Backend Developer", "UX/UI Designer", "Customer Support", "Operations Manager", "Other",
];

const CompanyDashboard = () => {
  const { user, role } = useAuth();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("overview");
  const [company, setCompany] = useState<any>(null);
  const [roleRequests, setRoleRequests] = useState<any[]>([]);
  const [pushes, setPushes] = useState<any[]>([]);
  const [pushedCandidates, setPushedCandidates] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showRoleForm, setShowRoleForm] = useState(false);

  // Role request form
  const [roleForm, setRoleForm] = useState({
    role_title: "", role_type: "", seniority: "", num_hires: 1,
    responsibilities: "", must_have_skills: [] as string[], nice_to_have_skills: [] as string[],
    budget_min: "", budget_max: "", start_timeline: "", engagement_type: "", additional_notes: ""
  });
  const [skillInput, setSkillInput] = useState("");
  const [niceSkillInput, setNiceSkillInput] = useState("");

  useEffect(() => {
    if (role && role !== "company") { navigate("/"); return; }
    fetchData();
  }, [role, user]);

  const fetchData = async () => {
    if (!user) return;
    setLoading(true);
    const { data: co } = await supabase.from("companies").select("*").eq("user_id", user.id).single();
    setCompany(co);
    if (co) {
      const [rrRes, pRes] = await Promise.all([
        supabase.from("role_requests").select("*").eq("company_id", co.id).order("created_at", { ascending: false }),
        supabase.from("candidate_pushes").select("*").eq("company_id", co.id).order("pushed_at", { ascending: false }),
      ]);
      setRoleRequests(rrRes.data || []);
      const pushData = pRes.data || [];
      setPushes(pushData);

      // Fetch candidate profiles for pushed candidates
      if (pushData.length > 0) {
        const candidateIds = [...new Set(pushData.map(p => p.candidate_id))];
        const { data: cands } = await supabase.from("candidate_profiles").select("*").in("id", candidateIds);
        setPushedCandidates(cands || []);
      }
    }
    setLoading(false);
  };

  const submitRoleRequest = async () => {
    if (!company || !roleForm.role_title || !roleForm.role_type || !roleForm.seniority) return;
    const { error } = await supabase.from("role_requests").insert({
      company_id: company.id,
      role_title: roleForm.role_title,
      role_type: roleForm.role_type,
      seniority: roleForm.seniority,
      num_hires: roleForm.num_hires,
      responsibilities: roleForm.responsibilities || null,
      must_have_skills: roleForm.must_have_skills,
      nice_to_have_skills: roleForm.nice_to_have_skills,
      budget_min: roleForm.budget_min ? parseInt(roleForm.budget_min) : null,
      budget_max: roleForm.budget_max ? parseInt(roleForm.budget_max) : null,
      start_timeline: roleForm.start_timeline || null,
      engagement_type: roleForm.engagement_type || null,
      additional_notes: roleForm.additional_notes || null,
    });
    if (error) toast({ title: "Error", description: error.message, variant: "destructive" });
    else {
      toast({ title: "Role request submitted!" });
      setShowRoleForm(false);
      setRoleForm({ role_title: "", role_type: "", seniority: "", num_hires: 1, responsibilities: "", must_have_skills: [], nice_to_have_skills: [], budget_min: "", budget_max: "", start_timeline: "", engagement_type: "", additional_notes: "" });
      fetchData();
    }
  };

  const updatePushAction = async (pushId: string, action: string) => {
    const { error } = await supabase.from("candidate_pushes").update({ company_action: action }).eq("id", pushId);
    if (error) toast({ title: "Error", description: error.message, variant: "destructive" });
    else { toast({ title: `Candidate ${action}` }); fetchData(); }
  };

  const getStatusBadge = (status: string) => {
    const map: Record<string, string> = {
      active: "status-active", filled: "status-active", candidates_ready: "status-screening",
      submitted: "status-pending", in_review: "status-pending",
      closed: "status-rejected",
    };
    return map[status] || "status-pending";
  };

  const inputClass = "w-full bg-background border border-border rounded px-4 py-3 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary";
  const labelClass = "text-xs font-mono text-muted-foreground uppercase tracking-wider mb-1 block";

  if (company?.status === "pending") {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background p-4">
        <div className="card-surface p-12 text-center max-w-md">
          <h1 className="font-display text-3xl mb-4">ACCOUNT UNDER REVIEW</h1>
          <p className="text-sm text-muted-foreground mb-6">We verify all company accounts within 1 business day. You'll receive an email once your portal access is activated.</p>
          <button onClick={() => { signOut(); navigate("/"); }} className="text-sm text-primary hover:underline">Sign out</button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex bg-background">
      {/* Sidebar */}
      <aside className="w-60 border-r border-border flex flex-col shrink-0" style={{ background: '#0a0a0a' }}>
        <div className="p-6 flex items-center gap-3">
          <img src={logoIcon} alt="RL" className="logo-blend h-8 w-auto" />
          <div className="flex flex-col">
            <span className="font-body font-bold text-xs tracking-[2px] text-foreground">PORTAL</span>
            <span className="text-[10px] font-mono text-muted-foreground truncate max-w-[140px]">{company?.company_name}</span>
          </div>
        </div>
        <nav className="flex-1 py-2">
          {sidebarItems.map((item) => (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`w-full flex items-center gap-3 px-6 py-3 text-sm font-body transition-colors ${
                activeTab === item.id
                  ? "text-foreground bg-card border-l-[3px] border-l-primary"
                  : "text-muted-foreground hover:text-foreground hover:bg-card"
              }`}
            >
              <item.icon size={16} />
              {item.label}
            </button>
          ))}
        </nav>
        <div className="p-4 border-t border-border">
          <button onClick={() => { signOut(); navigate("/"); }} className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground w-full px-2 py-2">
            <LogOut size={14} /> Sign Out
          </button>
        </div>
      </aside>

      {/* Main */}
      <main className="flex-1 overflow-auto">
        <header className="border-b border-border px-8 py-4 flex items-center justify-between">
          <h1 className="font-display text-2xl">{sidebarItems.find(s => s.id === activeTab)?.label?.toUpperCase()}</h1>
          <NotificationBell />
        </header>

        <div className="p-8">
          {/* Overview */}
          {activeTab === "overview" && (
            <div>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
                {[
                  { label: "Active Requests", value: roleRequests.filter(r => !["filled", "closed"].includes(r.status)).length },
                  { label: "Candidates in Review", value: pushes.filter(p => p.company_action === "none").length },
                  { label: "Interviews Scheduled", value: pushes.filter(p => p.company_action === "interview_requested").length },
                  { label: "Shortlisted", value: pushes.filter(p => p.company_action === "shortlisted").length },
                ].map((card) => (
                  <div key={card.label} className="card-surface p-6 border-l-[3px] border-l-primary">
                    <div className="font-display text-3xl text-foreground">{card.value}</div>
                    <div className="text-[10px] font-mono text-muted-foreground uppercase tracking-wider mt-1">{card.label}</div>
                  </div>
                ))}
              </div>
              <div className="flex gap-3">
                <Button onClick={() => { setActiveTab("roles"); setShowRoleForm(true); }} size="sm" className="bg-primary text-primary-foreground font-bold">New Role Request</Button>
                <Button onClick={() => setActiveTab("talent")} variant="outline" size="sm">View Talent Pool</Button>
              </div>
            </div>
          )}

          {/* Role Requests */}
          {activeTab === "roles" && (
            <div>
              <div className="flex justify-between items-center mb-6">
                <div />
                <Button onClick={() => setShowRoleForm(true)} size="sm" className="bg-primary text-primary-foreground font-bold">New Role Request</Button>
              </div>

              {showRoleForm && (
                <div className="card-surface p-8 mb-8">
                  <h3 className="font-display text-xl mb-4">NEW ROLE REQUEST</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div><label className={labelClass}>Role Title *</label><input value={roleForm.role_title} onChange={e => setRoleForm(f => ({ ...f, role_title: e.target.value }))} placeholder="Senior Full-Stack Developer" className={inputClass} /></div>
                    <div><label className={labelClass}>Role Type *</label>
                      <select value={roleForm.role_type} onChange={e => setRoleForm(f => ({ ...f, role_type: e.target.value }))} className={inputClass}>
                        <option value="">Select...</option>{ROLE_OPTIONS.map(r => <option key={r} value={r}>{r}</option>)}
                      </select>
                    </div>
                    <div><label className={labelClass}>Seniority *</label>
                      <select value={roleForm.seniority} onChange={e => setRoleForm(f => ({ ...f, seniority: e.target.value }))} className={inputClass}>
                        <option value="">Select...</option><option value="Mid">Mid</option><option value="Senior">Senior</option><option value="Lead">Lead</option>
                      </select>
                    </div>
                    <div><label className={labelClass}># of Hires</label><input type="number" value={roleForm.num_hires} onChange={e => setRoleForm(f => ({ ...f, num_hires: parseInt(e.target.value) || 1 }))} className={inputClass} /></div>
                    <div><label className={labelClass}>Budget Min ($/mo)</label><input type="number" value={roleForm.budget_min} onChange={e => setRoleForm(f => ({ ...f, budget_min: e.target.value }))} placeholder="3000" className={inputClass} /></div>
                    <div><label className={labelClass}>Budget Max ($/mo)</label><input type="number" value={roleForm.budget_max} onChange={e => setRoleForm(f => ({ ...f, budget_max: e.target.value }))} placeholder="5000" className={inputClass} /></div>
                    <div><label className={labelClass}>Start Timeline</label>
                      <select value={roleForm.start_timeline} onChange={e => setRoleForm(f => ({ ...f, start_timeline: e.target.value }))} className={inputClass}>
                        <option value="">Select...</option><option value="Immediate">Immediate</option><option value="Within 1 month">Within 1 month</option><option value="Within 3 months">Within 3 months</option><option value="Flexible">Flexible</option>
                      </select>
                    </div>
                    <div><label className={labelClass}>Engagement Type</label>
                      <select value={roleForm.engagement_type} onChange={e => setRoleForm(f => ({ ...f, engagement_type: e.target.value }))} className={inputClass}>
                        <option value="">Select...</option><option value="Full-time">Full-time</option><option value="Part-time">Part-time</option><option value="Contract">Contract</option>
                      </select>
                    </div>
                  </div>
                  <div className="mt-4"><label className={labelClass}>Key Responsibilities</label><textarea value={roleForm.responsibilities} onChange={e => setRoleForm(f => ({ ...f, responsibilities: e.target.value }))} rows={3} className={inputClass} placeholder="Describe key responsibilities..." /></div>
                  <div className="mt-4"><label className={labelClass}>Additional Notes</label><textarea value={roleForm.additional_notes} onChange={e => setRoleForm(f => ({ ...f, additional_notes: e.target.value }))} rows={2} className={inputClass} placeholder="Anything else..." /></div>
                  <div className="flex gap-3 justify-end mt-6">
                    <Button variant="outline" size="sm" onClick={() => setShowRoleForm(false)}>Cancel</Button>
                    <Button size="sm" onClick={submitRoleRequest} className="bg-primary text-primary-foreground font-bold">Submit Role Request</Button>
                  </div>
                </div>
              )}

              {roleRequests.length === 0 && !showRoleForm ? (
                <div className="card-surface p-12 text-center">
                  <h3 className="font-display text-xl mb-2">NO ROLE REQUESTS YET</h3>
                  <p className="text-sm text-muted-foreground mb-4">Submit your first role request and we'll start matching candidates.</p>
                  <Button onClick={() => setShowRoleForm(true)} size="sm" className="bg-primary text-primary-foreground font-bold">New Role Request</Button>
                </div>
              ) : (
                <div className="space-y-4">
                  {roleRequests.map(rr => (
                    <div key={rr.id} className="card-surface p-6 flex items-center justify-between">
                      <div>
                        <h3 className="font-bold text-foreground">{rr.role_title}</h3>
                        <p className="text-sm text-muted-foreground">{rr.seniority} · {rr.engagement_type} · ${rr.budget_min}–${rr.budget_max}/mo</p>
                      </div>
                      <span className={`text-[10px] font-mono px-2.5 py-1 rounded-full font-semibold ${getStatusBadge(rr.status)}`}>
                        {rr.status.replace("_", " ")}
                      </span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* Talent Pool */}
          {activeTab === "talent" && (
            <div>
              {pushes.length === 0 ? (
                <div className="card-surface p-12 text-center">
                  <h3 className="font-display text-xl mb-2">NO CANDIDATES YET</h3>
                  <p className="text-sm text-muted-foreground">Our team will push matched candidates to your talent pool once we review your role requests.</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {pushes.map(p => {
                    const cand = pushedCandidates.find(c => c.id === p.candidate_id);
                    if (!cand) return null;
                    return (
                      <div key={p.id} className="card-surface p-6">
                        <div className="flex items-start gap-4 mb-4">
                          {cand.profile_photo_url ? (
                            <img src={cand.profile_photo_url} alt="" className="avatar-md" style={{ width: '56px', height: '56px' }} />
                          ) : (
                            <div className="avatar-initials-md" style={{ width: '56px', height: '56px', fontSize: '18px' }}>
                              {cand.full_name?.split(" ").map((n: string) => n.charAt(0)).join("").slice(0, 2)}
                            </div>
                          )}
                          <div className="flex-1">
                            <h3 className="font-bold text-foreground text-lg">{cand.full_name}</h3>
                            <p className="text-sm text-muted-foreground">{(cand.roles_applied || []).join(", ")} · {cand.seniority_level}</p>
                          </div>
                        </div>
                        {cand.technical_skills?.length > 0 && (
                          <div className="flex flex-wrap gap-1.5 mb-4">
                            {cand.technical_skills.slice(0, 5).map((s: string) => (
                              <span key={s} className="text-[10px] px-2 py-1 rounded-full border border-primary text-primary font-mono">{s}</span>
                            ))}
                          </div>
                        )}
                        <div className="flex items-center gap-2 text-xs text-muted-foreground mb-4">
                          <span>{cand.availability}</span>
                          <span>·</span>
                          <span>{cand.country}</span>
                        </div>
                        <div className="flex gap-2">
                          <Link to={`/talent/${cand.id}`} className="text-xs text-primary font-bold hover:underline">View Full Profile</Link>
                          {p.company_action === "none" && (
                            <>
                              <button onClick={() => updatePushAction(p.id, "shortlisted")} className="text-xs text-primary font-bold hover:underline ml-3">Shortlist</button>
                              <button onClick={() => updatePushAction(p.id, "interview_requested")} className="text-xs text-primary font-bold hover:underline">Request Interview</button>
                            </>
                          )}
                          {p.company_action !== "none" && (
                            <span className={`ml-3 text-[10px] font-mono px-2.5 py-1 rounded-full font-semibold ${p.company_action === "shortlisted" ? "status-shortlisted" : "status-screening"}`}>
                              {p.company_action.replace("_", " ")}
                            </span>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          )}

          {/* Compare */}
          {activeTab === "compare" && (
            <div>
              {pushedCandidates.length < 2 ? (
                <div className="card-surface p-12 text-center">
                  <h3 className="font-display text-xl mb-2">NOT ENOUGH CANDIDATES</h3>
                  <p className="text-sm text-muted-foreground">You need at least 2 candidates in your talent pool to compare.</p>
                </div>
              ) : (
                <div>
                  <p className="text-sm text-muted-foreground mb-6">Side-by-side comparison of shortlisted candidates.</p>
                  <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                      <thead>
                        <tr className="border-b border-border">
                          <th className="text-left py-3 px-3 font-mono text-[10px] text-muted-foreground uppercase tracking-wider w-32">Attribute</th>
                          {pushedCandidates.slice(0, 4).map(c => (
                            <th key={c.id} className="text-left py-3 px-3">
                              <div className="flex items-center gap-2">
                                {c.profile_photo_url ? (
                                  <img src={c.profile_photo_url} alt="" className="avatar-sm" />
                                ) : (
                                  <div className="avatar-initials-sm">{c.full_name?.split(" ").map((n: string) => n.charAt(0)).join("").slice(0, 2)}</div>
                                )}
                                <span className="font-bold text-foreground">{c.full_name}</span>
                              </div>
                            </th>
                          ))}
                        </tr>
                      </thead>
                      <tbody>
                        {[
                          { label: "Role", fn: (c: any) => (c.roles_applied || []).join(", ") },
                          { label: "Seniority", fn: (c: any) => c.seniority_level || "—" },
                          { label: "Experience", fn: (c: any) => c.years_experience || "—" },
                          { label: "Country", fn: (c: any) => c.country },
                          { label: "Rate", fn: (c: any) => c.expected_rate_usd ? `$${c.expected_rate_usd}/mo` : "—" },
                          { label: "English", fn: (c: any) => c.english_proficiency || "—" },
                          { label: "Availability", fn: (c: any) => c.availability || "—" },
                          { label: "Skills", fn: (c: any) => (c.technical_skills || []).slice(0, 5).join(", ") || "—" },
                        ].map(row => (
                          <tr key={row.label} className="border-b border-border">
                            <td className="py-3 px-3 font-mono text-[10px] text-muted-foreground uppercase tracking-wider">{row.label}</td>
                            {pushedCandidates.slice(0, 4).map(c => (
                              <td key={c.id} className="py-3 px-3 text-foreground/80">{row.fn(c)}</td>
                            ))}
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Messages */}
          {activeTab === "messages" && (
            <MessagingPanel />
          )}

          {/* Settings */}
          {activeTab === "settings" && company && (
            <div className="card-surface p-8 max-w-md">
              <h3 className="font-display text-xl mb-4">ACCOUNT SETTINGS</h3>
              <div className="space-y-3 text-sm">
                <div className="flex justify-between py-2 border-b border-border"><span className="text-muted-foreground">Company</span><span className="font-bold">{company.company_name}</span></div>
                <div className="flex justify-between py-2 border-b border-border"><span className="text-muted-foreground">Email</span><span>{company.company_email}</span></div>
                <div className="flex justify-between py-2 border-b border-border"><span className="text-muted-foreground">Website</span><span>{company.company_website || "—"}</span></div>
                <div className="flex justify-between py-2 border-b border-border"><span className="text-muted-foreground">Size</span><span>{company.company_size || "—"}</span></div>
                <div className="flex justify-between py-2 border-b border-border"><span className="text-muted-foreground">Industry</span><span>{company.industry || "—"}</span></div>
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default CompanyDashboard;
