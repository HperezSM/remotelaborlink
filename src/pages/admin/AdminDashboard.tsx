import { useState, useEffect } from "react";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Link, useNavigate } from "react-router-dom";
import logoIcon from "@/assets/logo-icon.png";
import { signOut } from "@/lib/auth";
import { Users, Building2, FileText, GitMerge, MessageSquare, Settings, LayoutDashboard, LogOut } from "lucide-react";
import NotificationBell from "@/components/NotificationBell";
import MessagingPanel from "@/components/MessagingPanel";

const sidebarItems = [
  { label: "Overview", icon: LayoutDashboard, id: "overview" },
  { label: "Candidates", icon: Users, id: "candidates" },
  { label: "Companies", icon: Building2, id: "companies" },
  { label: "Role Requests", icon: FileText, id: "roles" },
  { label: "Matches", icon: GitMerge, id: "matches" },
  { label: "Messages", icon: MessageSquare, id: "messages" },
  { label: "Settings", icon: Settings, id: "settings" },
];

const statusOptions = ["pending_review", "screening", "active", "placed", "rejected"];
const companyStatusOptions = ["pending", "active", "suspended"];

const AdminDashboard = () => {
  const { user, role } = useAuth();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("overview");
  const [candidates, setCandidates] = useState<any[]>([]);
  const [companies, setCompanies] = useState<any[]>([]);
  const [roleRequests, setRoleRequests] = useState<any[]>([]);
  const [pushes, setPushes] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // Filters
  const [candidateFilter, setCandidateFilter] = useState({ role: "", status: "", search: "" });

  useEffect(() => {
    if (role && role !== "admin") {
      navigate("/");
      return;
    }
    fetchData();
  }, [role]);

  const fetchData = async () => {
    setLoading(true);
    const [cRes, coRes, rrRes, pRes] = await Promise.all([
      supabase.from("candidate_profiles").select("*").order("created_at", { ascending: false }),
      supabase.from("companies").select("*").order("created_at", { ascending: false }),
      supabase.from("role_requests").select("*").order("created_at", { ascending: false }),
      supabase.from("candidate_pushes").select("*").order("pushed_at", { ascending: false }),
    ]);
    setCandidates(cRes.data || []);
    setCompanies(coRes.data || []);
    setRoleRequests(rrRes.data || []);
    setPushes(pRes.data || []);
    setLoading(false);
  };

  const updateCandidateStatus = async (id: string, status: string) => {
    const { error } = await supabase.from("candidate_profiles").update({ status }).eq("id", id);
    if (error) toast({ title: "Error", description: error.message, variant: "destructive" });
    else { toast({ title: `Status updated to ${status}` }); fetchData(); }
  };

  const updateCompanyStatus = async (id: string, status: string) => {
    const { error } = await supabase.from("companies").update({ status }).eq("id", id);
    if (error) toast({ title: "Error", description: error.message, variant: "destructive" });
    else { toast({ title: `Company ${status}` }); fetchData(); }
  };

  const updateRoleRequestStatus = async (id: string, status: string) => {
    const { error } = await supabase.from("role_requests").update({ status }).eq("id", id);
    if (error) toast({ title: "Error", description: error.message, variant: "destructive" });
    else { toast({ title: `Role request ${status}` }); fetchData(); }
  };

  const [pushModal, setPushModal] = useState<{ candidateId: string; candidateName: string } | null>(null);
  const [pushCompanyId, setPushCompanyId] = useState("");
  const [pushNote, setPushNote] = useState("");

  const handlePush = async () => {
    if (!pushModal || !pushCompanyId) return;
    const { error } = await supabase.from("candidate_pushes").insert({
      candidate_id: pushModal.candidateId,
      company_id: pushCompanyId,
      admin_note: pushNote || null,
    });
    if (error) toast({ title: "Error", description: error.message, variant: "destructive" });
    else { toast({ title: "Candidate pushed to company" }); fetchData(); }
    setPushModal(null);
    setPushCompanyId("");
    setPushNote("");
  };

  const filteredCandidates = candidates.filter(c => {
    if (candidateFilter.status && c.status !== candidateFilter.status) return false;
    if (candidateFilter.role && !(c.roles_applied || []).some((r: string) => r.toLowerCase().includes(candidateFilter.role.toLowerCase()))) return false;
    if (candidateFilter.search && !c.full_name?.toLowerCase().includes(candidateFilter.search.toLowerCase())) return false;
    return true;
  });

  const activeCompanies = companies.filter(c => c.status === "active");

  const getStatusBadge = (status: string) => {
    const map: Record<string, string> = {
      active: "status-active", placed: "status-active", approved: "status-active",
      pending_review: "status-pending", pending: "status-pending", submitted: "status-pending", in_review: "status-pending",
      screening: "status-screening", candidates_ready: "status-screening",
      rejected: "status-rejected", closed: "status-rejected", suspended: "status-rejected", filled: "status-active",
    };
    return map[status] || "status-pending";
  };

  const inputClass = "bg-background border border-border rounded px-3 py-2 text-sm text-foreground focus:outline-none focus:border-primary";

  return (
    <div className="min-h-screen flex bg-background">
      {/* Sidebar */}
      <aside className="w-60 border-r border-border flex flex-col shrink-0" style={{ background: '#0a0a0a' }}>
        <div className="p-6 flex items-center gap-3">
          <img src={logoIcon} alt="RL" className="logo-blend h-8 w-auto" />
          <span className="font-body font-bold text-xs tracking-[2px] text-foreground">ADMIN</span>
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
          <button onClick={() => { signOut(); navigate("/admin/login"); }} className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground w-full px-2 py-2">
            <LogOut size={14} /> Sign Out
          </button>
        </div>
      </aside>

      {/* Main */}
      <main className="flex-1 overflow-auto">
        <header className="border-b border-border px-8 py-4 flex items-center justify-between">
          <h1 className="font-display text-2xl">{sidebarItems.find(s => s.id === activeTab)?.label?.toUpperCase()}</h1>
          <div className="flex items-center gap-3">
            <NotificationBell />
            <span className="text-xs font-mono text-muted-foreground">{user?.email}</span>
          </div>
        </header>

        <div className="p-8">
          {/* Overview */}
          {activeTab === "overview" && (
            <div>
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 mb-8">
                {[
                  { label: "Total Candidates", value: candidates.length },
                  { label: "Pending Review", value: candidates.filter(c => c.status === "pending_review").length },
                  { label: "Active Candidates", value: candidates.filter(c => c.status === "active").length },
                  { label: "Total Companies", value: companies.length },
                  { label: "Pending Approvals", value: companies.filter(c => c.status === "pending").length },
                  { label: "Open Roles", value: roleRequests.filter(r => !["filled", "closed"].includes(r.status)).length },
                  { label: "Active Matches", value: pushes.length },
                ].map((kpi) => (
                  <div key={kpi.label} className="card-surface p-5 border-l-[3px] border-l-primary">
                    <div className="font-display text-3xl text-foreground">{kpi.value}</div>
                    <div className="text-[10px] font-mono text-muted-foreground uppercase tracking-wider mt-1">{kpi.label}</div>
                  </div>
                ))}
              </div>
              <div className="flex gap-3">
                <Button onClick={() => setActiveTab("candidates")} size="sm" className="bg-primary text-primary-foreground font-bold">Review Candidates</Button>
                <Button onClick={() => setActiveTab("companies")} variant="outline" size="sm">Approve Companies</Button>
              </div>
            </div>
          )}

          {/* Candidates */}
          {activeTab === "candidates" && (
            <div>
              <div className="flex flex-wrap gap-3 mb-6">
                <input placeholder="Search by name..." value={candidateFilter.search} onChange={e => setCandidateFilter(f => ({ ...f, search: e.target.value }))} className={`${inputClass} w-48`} />
                <select value={candidateFilter.status} onChange={e => setCandidateFilter(f => ({ ...f, status: e.target.value }))} className={inputClass}>
                  <option value="">All statuses</option>
                  {statusOptions.map(s => <option key={s} value={s}>{s.replace("_", " ")}</option>)}
                </select>
                <select value={candidateFilter.role} onChange={e => setCandidateFilter(f => ({ ...f, role: e.target.value }))} className={inputClass}>
                  <option value="">All roles</option>
                  {["Project Manager", "Scrum Master", "Full Stack Developer", "Frontend Developer", "Backend Developer", "UX/UI Designer", "Customer Support", "Operations Manager"].map(r => <option key={r} value={r}>{r}</option>)}
                </select>
              </div>

              {filteredCandidates.length === 0 ? (
                <div className="card-surface p-12 text-center">
                  <h3 className="font-display text-xl mb-2">NO CANDIDATES YET</h3>
                  <p className="text-sm text-muted-foreground">Candidates will appear here once they sign up and complete their profiles.</p>
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b border-border">
                        <th className="text-left py-3 px-3 font-mono text-[10px] text-muted-foreground uppercase tracking-wider">Name</th>
                        <th className="text-left py-3 px-3 font-mono text-[10px] text-muted-foreground uppercase tracking-wider">Role</th>
                        <th className="text-left py-3 px-3 font-mono text-[10px] text-muted-foreground uppercase tracking-wider">Seniority</th>
                        <th className="text-left py-3 px-3 font-mono text-[10px] text-muted-foreground uppercase tracking-wider">Country</th>
                        <th className="text-left py-3 px-3 font-mono text-[10px] text-muted-foreground uppercase tracking-wider">Status</th>
                        <th className="text-left py-3 px-3 font-mono text-[10px] text-muted-foreground uppercase tracking-wider">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredCandidates.map((c) => (
                        <tr key={c.id} className="border-b border-border hover:bg-card/50 transition-colors">
                          <td className="py-3 px-3">
                            <div className="flex items-center gap-3">
                              {c.profile_photo_url ? (
                                <img src={c.profile_photo_url} alt="" className="w-8 h-8 rounded-full object-cover" />
                              ) : (
                                <div className="w-8 h-8 rounded-full bg-muted flex items-center justify-center text-xs font-mono text-muted-foreground">
                                  {c.full_name?.charAt(0)}
                                </div>
                              )}
                              <Link to={`/talent/${c.id}`} className="font-bold text-foreground hover:text-primary">{c.full_name}</Link>
                            </div>
                          </td>
                          <td className="py-3 px-3 text-muted-foreground">{(c.roles_applied || []).join(", ")}</td>
                          <td className="py-3 px-3 text-muted-foreground">{c.seniority_level}</td>
                          <td className="py-3 px-3 text-muted-foreground">{c.country}</td>
                          <td className="py-3 px-3">
                            <select value={c.status} onChange={e => updateCandidateStatus(c.id, e.target.value)}
                              className="bg-transparent text-xs font-mono cursor-pointer focus:outline-none">
                              {statusOptions.map(s => <option key={s} value={s}>{s.replace("_", " ")}</option>)}
                            </select>
                          </td>
                          <td className="py-3 px-3">
                            <div className="flex gap-2">
                              <Link to={`/talent/${c.id}`} className="text-xs text-primary hover:underline">View</Link>
                              <button onClick={() => setPushModal({ candidateId: c.id, candidateName: c.full_name })} className="text-xs text-primary hover:underline">Push</button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          )}

          {/* Companies */}
          {activeTab === "companies" && (
            <div>
              {companies.length === 0 ? (
                <div className="card-surface p-12 text-center">
                  <h3 className="font-display text-xl mb-2">NO COMPANIES YET</h3>
                  <p className="text-sm text-muted-foreground">Companies will appear here once they sign up.</p>
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b border-border">
                        <th className="text-left py-3 px-3 font-mono text-[10px] text-muted-foreground uppercase tracking-wider">Company</th>
                        <th className="text-left py-3 px-3 font-mono text-[10px] text-muted-foreground uppercase tracking-wider">Email</th>
                        <th className="text-left py-3 px-3 font-mono text-[10px] text-muted-foreground uppercase tracking-wider">Size</th>
                        <th className="text-left py-3 px-3 font-mono text-[10px] text-muted-foreground uppercase tracking-wider">Status</th>
                        <th className="text-left py-3 px-3 font-mono text-[10px] text-muted-foreground uppercase tracking-wider">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {companies.map((co) => (
                        <tr key={co.id} className="border-b border-border hover:bg-card/50 transition-colors">
                          <td className="py-3 px-3 font-bold">{co.company_name}</td>
                          <td className="py-3 px-3 text-muted-foreground">{co.company_email}</td>
                          <td className="py-3 px-3 text-muted-foreground">{co.company_size}</td>
                          <td className="py-3 px-3">
                            <span className={`text-[10px] font-mono px-2.5 py-1 rounded-full font-semibold ${getStatusBadge(co.status)}`}>
                              {co.status}
                            </span>
                          </td>
                          <td className="py-3 px-3">
                            <div className="flex gap-2">
                              {co.status === "pending" && (
                                <>
                                  <button onClick={() => updateCompanyStatus(co.id, "active")} className="text-xs text-primary hover:underline font-bold">Approve</button>
                                  <button onClick={() => updateCompanyStatus(co.id, "suspended")} className="text-xs text-destructive hover:underline">Reject</button>
                                </>
                              )}
                              {co.status === "active" && (
                                <button onClick={() => updateCompanyStatus(co.id, "suspended")} className="text-xs text-destructive hover:underline">Suspend</button>
                              )}
                              {co.status === "suspended" && (
                                <button onClick={() => updateCompanyStatus(co.id, "active")} className="text-xs text-primary hover:underline">Reactivate</button>
                              )}
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          )}

          {/* Role Requests */}
          {activeTab === "roles" && (
            <div>
              {roleRequests.length === 0 ? (
                <div className="card-surface p-12 text-center">
                  <h3 className="font-display text-xl mb-2">NO ROLE REQUESTS YET</h3>
                  <p className="text-sm text-muted-foreground">Role requests from companies will appear here.</p>
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b border-border">
                        <th className="text-left py-3 px-3 font-mono text-[10px] text-muted-foreground uppercase tracking-wider">Role</th>
                        <th className="text-left py-3 px-3 font-mono text-[10px] text-muted-foreground uppercase tracking-wider">Seniority</th>
                        <th className="text-left py-3 px-3 font-mono text-[10px] text-muted-foreground uppercase tracking-wider">Budget</th>
                        <th className="text-left py-3 px-3 font-mono text-[10px] text-muted-foreground uppercase tracking-wider">Timeline</th>
                        <th className="text-left py-3 px-3 font-mono text-[10px] text-muted-foreground uppercase tracking-wider">Status</th>
                        <th className="text-left py-3 px-3 font-mono text-[10px] text-muted-foreground uppercase tracking-wider">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {roleRequests.map((rr) => (
                        <tr key={rr.id} className="border-b border-border hover:bg-card/50 transition-colors">
                          <td className="py-3 px-3 font-bold">{rr.role_title}</td>
                          <td className="py-3 px-3 text-muted-foreground">{rr.seniority}</td>
                          <td className="py-3 px-3 text-muted-foreground">${rr.budget_min}–${rr.budget_max}</td>
                          <td className="py-3 px-3 text-muted-foreground">{rr.start_timeline}</td>
                          <td className="py-3 px-3">
                            <select value={rr.status} onChange={e => updateRoleRequestStatus(rr.id, e.target.value)}
                              className="bg-transparent text-xs font-mono cursor-pointer focus:outline-none">
                              {["submitted", "in_review", "candidates_ready", "filled", "closed"].map(s => <option key={s} value={s}>{s.replace("_", " ")}</option>)}
                            </select>
                          </td>
                          <td className="py-3 px-3">
                            <button className="text-xs text-primary hover:underline">Details</button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          )}

          {/* Matches */}
          {activeTab === "matches" && (
            <div>
              {pushes.length === 0 ? (
                <div className="card-surface p-12 text-center">
                  <h3 className="font-display text-xl mb-2">NO MATCHES YET</h3>
                  <p className="text-sm text-muted-foreground">Push candidates to companies from the Candidates tab to create matches.</p>
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b border-border">
                        <th className="text-left py-3 px-3 font-mono text-[10px] text-muted-foreground uppercase tracking-wider">Candidate</th>
                        <th className="text-left py-3 px-3 font-mono text-[10px] text-muted-foreground uppercase tracking-wider">Company</th>
                        <th className="text-left py-3 px-3 font-mono text-[10px] text-muted-foreground uppercase tracking-wider">Pushed</th>
                        <th className="text-left py-3 px-3 font-mono text-[10px] text-muted-foreground uppercase tracking-wider">Company Action</th>
                      </tr>
                    </thead>
                    <tbody>
                      {pushes.map((p) => {
                        const cand = candidates.find(c => c.id === p.candidate_id);
                        const comp = companies.find(c => c.id === p.company_id);
                        return (
                          <tr key={p.id} className="border-b border-border hover:bg-card/50 transition-colors">
                            <td className="py-3 px-3 font-bold">{cand?.full_name || "Unknown"}</td>
                            <td className="py-3 px-3 text-muted-foreground">{comp?.company_name || "Unknown"}</td>
                            <td className="py-3 px-3 text-muted-foreground">{new Date(p.pushed_at).toLocaleDateString()}</td>
                            <td className="py-3 px-3">
                              <span className={`text-[10px] font-mono px-2.5 py-1 rounded-full font-semibold ${getStatusBadge(p.company_action === "none" ? "pending" : p.company_action)}`}>
                                {p.company_action}
                              </span>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          )}

          {/* Messages */}
          {activeTab === "messages" && (
            <MessagingPanel
              contacts={[
                ...candidates.map(c => ({ userId: c.user_id, name: c.full_name, role: "candidate" as const })),
                ...companies.map(c => ({ userId: c.user_id, name: c.company_name, role: "company" as const })),
              ]}
            />
          )}

          {/* Settings */}
          {activeTab === "settings" && (
            <div className="card-surface p-8 max-w-md">
              <h3 className="font-display text-xl mb-4">ADMIN SETTINGS</h3>
              <div className="space-y-3 text-sm">
                <div className="flex justify-between py-2 border-b border-border">
                  <span className="text-muted-foreground">Email</span>
                  <span>{user?.email}</span>
                </div>
                <div className="flex justify-between py-2 border-b border-border">
                  <span className="text-muted-foreground">Company approval required</span>
                  <span className="text-primary font-bold">Yes</span>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Push Modal */}
        {pushModal && (
          <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4">
            <div className="card-surface p-8 max-w-md w-full">
              <h3 className="font-display text-xl mb-4">PUSH TO COMPANY</h3>
              <p className="text-sm text-muted-foreground mb-4">Push <strong className="text-foreground">{pushModal.candidateName}</strong> to a company's talent pool.</p>
              <div className="space-y-4">
                <div>
                  <label className="text-xs font-mono text-muted-foreground uppercase tracking-wider mb-1 block">Company *</label>
                  <select value={pushCompanyId} onChange={e => setPushCompanyId(e.target.value)} className={`${inputClass} w-full`}>
                    <option value="">Select company...</option>
                    {activeCompanies.map(co => <option key={co.id} value={co.id}>{co.company_name}</option>)}
                  </select>
                </div>
                <div>
                  <label className="text-xs font-mono text-muted-foreground uppercase tracking-wider mb-1 block">Note (optional)</label>
                  <textarea value={pushNote} onChange={e => setPushNote(e.target.value)} rows={3} className={`${inputClass} w-full`} placeholder="Add a note..." />
                </div>
                <div className="flex gap-3 justify-end">
                  <Button variant="outline" size="sm" onClick={() => setPushModal(null)}>Cancel</Button>
                  <Button size="sm" onClick={handlePush} disabled={!pushCompanyId} className="bg-primary text-primary-foreground font-bold">Push Candidate</Button>
                </div>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
};

export default AdminDashboard;
