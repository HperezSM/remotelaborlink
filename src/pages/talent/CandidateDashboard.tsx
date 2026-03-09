import { useState, useEffect } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";
import PageLayout from "@/components/PageLayout";
import NotificationBell from "@/components/NotificationBell";
import MessagingPanel from "@/components/MessagingPanel";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { toast } from "@/hooks/use-toast";
import {
  Eye, User, Pencil, Wrench, FileText, Link2, Image, Activity,
  MessageCircle, ChevronRight, Upload, X, Trash2, Download, XCircle, AlertTriangle, Briefcase, Award
} from "lucide-react";

type Tab = "overview" | "skills" | "certifications" | "portfolio" | "photos" | "applications" | "views" | "messages" | "notifications";

const CandidateDashboard = () => {
  const { user, profile: authProfile } = useAuth();
  const [searchParams] = useSearchParams();
  const [profile, setProfile] = useState<any>(null);
  const [activeTab, setActiveTab] = useState<Tab>((searchParams.get("tab") as Tab) || "overview");
  const [profileViews, setProfileViews] = useState<any[]>([]);
  const [applications, setApplications] = useState<any[]>([]);
  const [certifications, setCertifications] = useState<any[]>([]);
  const [portfolioLinks, setPortfolioLinks] = useState<any[]>([]);
  const [photos, setPhotos] = useState<any[]>([]);
  const [bannerDismissed, setBannerDismissed] = useState(false);

  // Skills editing
  const [editSkills, setEditSkills] = useState<string[]>([]);
  const [skillInput, setSkillInput] = useState("");
  const [editEnglish, setEditEnglish] = useState("");
  const [editWorkType, setEditWorkType] = useState("");
  const [editIndustries, setEditIndustries] = useState<string[]>([]);

  // Portfolio editing
  const [linkForms, setLinkForms] = useState({ linkedin_url: "", github_url: "", portfolio_url: "", portfolio_link: "" });
  const [extraLinks, setExtraLinks] = useState<{ label: string; url: string }[]>([]);

  useEffect(() => {
    const tab = searchParams.get("tab") as Tab;
    if (tab) setActiveTab(tab);
  }, [searchParams]);

  useEffect(() => {
    if (!user) return;
    const load = async () => {
      const { data } = await supabase.from("candidate_profiles").select("*").eq("user_id", user.id).single();
      setProfile(data);
      if (data) {
        setEditSkills(data.technical_skills || []);
        setEditEnglish(data.english_proficiency || "");
        setEditWorkType(data.work_type_preference || "");
        setEditIndustries(data.industries || []);
        setLinkForms({
          linkedin_url: data.linkedin_url || "",
          github_url: data.github_url || "",
          portfolio_url: data.portfolio_url || "",
          portfolio_link: data.portfolio_link || "",
        });

        const [viewsRes, appsRes, certsRes, linksRes, photosRes] = await Promise.all([
          supabase.from("profile_views").select("viewed_at").eq("candidate_id", data.id).order("viewed_at", { ascending: false }),
          supabase.from("job_applications").select("*, jobs(title, role_type)").eq("candidate_id", data.id).order("applied_at", { ascending: false }),
          supabase.from("candidate_certifications").select("*").eq("candidate_id", data.id),
          supabase.from("candidate_portfolio_links").select("*").eq("candidate_id", data.id),
          supabase.from("candidate_photos").select("*").eq("candidate_id", data.id).order("display_order"),
        ]);
        setProfileViews(viewsRes.data || []);
        setApplications(appsRes.data || []);
        setCertifications(certsRes.data || []);
        setPortfolioLinks(linksRes.data || []);
        setPhotos(photosRes.data || []);
        setExtraLinks((linksRes.data || []).map((l: any) => ({ label: l.label || l.link_type, url: l.url })));
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

  // Profile completion
  const completionFields = [
    { key: "bio", label: "Add a bio to introduce yourself" },
    { key: "loom_video_url", label: "Add a Loom video to increase visibility" },
    { key: "resume_url", label: "Upload your resume" },
    { key: "linkedin_url", label: "Add your LinkedIn URL" },
    { key: "profile_photo_url", label: "Upload a profile photo" },
    { key: "technical_skills", label: "Add your skills", check: (v: any) => v?.length > 0 },
  ];
  const completedCount = completionFields.filter(f => f.check ? f.check(profile?.[f.key]) : !!profile?.[f.key]).length;
  const completionPct = Math.round((completedCount / completionFields.length) * 100);
  const missingFields = completionFields.filter(f => !(f.check ? f.check(profile?.[f.key]) : !!profile?.[f.key]));
  const isProfileIncomplete = completionPct < 100;

  const firstName = profile?.first_name || profile?.full_name?.split(" ")[0] || "there";

  const saveSkills = async () => {
    if (!profile) return;
    await supabase.from("candidate_profiles").update({
      technical_skills: editSkills,
      english_proficiency: editEnglish,
      work_type_preference: editWorkType,
      industries: editIndustries,
    }).eq("id", profile.id);
    setProfile((p: any) => ({ ...p, technical_skills: editSkills, english_proficiency: editEnglish, work_type_preference: editWorkType, industries: editIndustries }));
    toast({ title: "Profile updated." });
  };

  const saveLinks = async () => {
    if (!profile) return;
    await supabase.from("candidate_profiles").update({
      linkedin_url: linkForms.linkedin_url || null,
      github_url: linkForms.github_url || null,
      portfolio_url: linkForms.portfolio_url || null,
      portfolio_link: linkForms.portfolio_link || null,
    }).eq("id", profile.id);
    await supabase.from("candidate_portfolio_links").delete().eq("candidate_id", profile.id);
    const validLinks = extraLinks.filter(l => l.url.trim());
    if (validLinks.length > 0) {
      await supabase.from("candidate_portfolio_links").insert(
        validLinks.map(l => ({ candidate_id: profile.id, label: l.label, url: l.url, link_type: "other" }))
      );
    }
    toast({ title: "Links saved." });
  };

  const uploadCert = async (file: File) => {
    if (!profile) return;
    const path = `${profile.id}/${Date.now()}_${file.name}`;
    const { error } = await supabase.storage.from("certifications").upload(path, file);
    if (error) { toast({ title: "Upload failed", variant: "destructive" }); return; }
    await supabase.from("candidate_certifications").insert({ candidate_id: profile.id, file_url: path, file_name: file.name, file_type: file.type || "pdf" });
    const { data } = await supabase.from("candidate_certifications").select("*").eq("candidate_id", profile.id);
    setCertifications(data || []);
    toast({ title: "Certification uploaded." });
  };

  const deleteCert = async (cert: any) => {
    await supabase.storage.from("certifications").remove([cert.file_url]);
    await supabase.from("candidate_certifications").delete().eq("id", cert.id);
    setCertifications(c => c.filter(cc => cc.id !== cert.id));
    toast({ title: "Certification deleted." });
  };

  const uploadPhoto = async (file: File) => {
    if (!profile || photos.length >= 3) return;
    const path = `${profile.id}/${Date.now()}_${file.name}`;
    const { error } = await supabase.storage.from("candidate-photos").upload(path, file);
    if (error) { toast({ title: "Upload failed", variant: "destructive" }); return; }
    const { data: urlData } = supabase.storage.from("candidate-photos").getPublicUrl(path);
    await supabase.from("candidate_photos").insert({ candidate_id: profile.id, photo_url: urlData.publicUrl, display_order: photos.length });
    const { data } = await supabase.from("candidate_photos").select("*").eq("candidate_id", profile.id).order("display_order");
    setPhotos(data || []);
    toast({ title: "Photo uploaded." });
  };

  const deletePhoto = async (photo: any) => {
    const path = photo.photo_url.split("/candidate-photos/")[1];
    if (path) await supabase.storage.from("candidate-photos").remove([path]);
    await supabase.from("candidate_photos").delete().eq("id", photo.id);
    setPhotos(p => p.filter(pp => pp.id !== photo.id));
    toast({ title: "Photo deleted." });
  };

  const withdrawApplication = async (appId: string) => {
    await supabase.from("job_applications").delete().eq("id", appId);
    setApplications(a => a.filter(app => app.id !== appId));
    toast({ title: "Application withdrawn." });
  };

  const sidebarItems: { label: string; icon: any; tab: Tab; section: string }[] = [
    { label: "Overview", icon: User, tab: "overview", section: "MY PROFILE" },
    { label: "Edit Profile", icon: Pencil, tab: "overview", section: "MY PROFILE" },
    { label: "My Skills", icon: Wrench, tab: "skills", section: "MY PROFILE" },
    { label: "Certifications", icon: FileText, tab: "certifications", section: "MY PROFILE" },
    { label: "Portfolio Links", icon: Link2, tab: "portfolio", section: "MY PROFILE" },
    { label: "Photos", icon: Image, tab: "photos", section: "MY PROFILE" },
    { label: "Application Status", icon: Activity, tab: "applications", section: "ACTIVITY" },
    { label: "Profile Views", icon: Eye, tab: "views", section: "ACTIVITY" },
    { label: "Messages", icon: MessageCircle, tab: "messages", section: "ACTIVITY" },
  ];

  const sections = [...new Set(sidebarItems.map(s => s.section))];

  return (
    <PageLayout>
      <section className="py-8">
        <div className="container mx-auto px-4 max-w-6xl">
          {/* Welcome bar */}
          <div className="flex items-center justify-between mb-2">
            <div>
              <h1 className="font-display text-4xl md:text-[36px]">Welcome back, {firstName}.</h1>
              <p className="text-[15px] text-muted-foreground mt-1">Here's your profile overview.</p>
            </div>
            <NotificationBell />
          </div>

          {/* Profile incomplete banner */}
          {isProfileIncomplete && !bannerDismissed && (
            <div className="mb-6 rounded-lg border border-primary p-4 flex items-center justify-between gap-4" style={{ background: '#1a1a1a' }}>
              <div className="flex items-center gap-3">
                <AlertTriangle size={18} className="text-primary shrink-0" />
                <p className="text-sm text-foreground">
                  Your profile is incomplete. Complete it to get matched with US companies.
                </p>
              </div>
              <div className="flex items-center gap-2 shrink-0">
                <Button asChild size="sm" className="bg-primary text-primary-foreground font-bold text-xs">
                  <Link to="/talent/profile/edit">Complete My Profile →</Link>
                </Button>
                <button onClick={() => setBannerDismissed(true)} className="text-muted-foreground hover:text-foreground p-1">
                  <X size={16} />
                </button>
              </div>
            </div>
          )}

          <div className="flex flex-col md:flex-row gap-8">
            {/* Sidebar */}
            <div className="md:w-56 shrink-0">
              <nav className="space-y-6">
                {sections.map(section => (
                  <div key={section}>
                    <span className="font-mono text-[10px] text-muted-foreground uppercase tracking-widest block mb-2">// {section}</span>
                    <div className="space-y-1">
                      {sidebarItems.filter(s => s.section === section).map(item => {
                        if (item.label === "Edit Profile") {
                          return (
                            <Link key={item.label} to="/talent/profile/edit"
                              className="flex items-center gap-2.5 px-3 py-2 rounded text-sm text-muted-foreground hover:text-foreground hover:bg-card transition-colors">
                              <item.icon size={15} /> {item.label}
                            </Link>
                          );
                        }
                        return (
                          <button key={item.label} onClick={() => setActiveTab(item.tab)}
                            className={`w-full flex items-center gap-2.5 px-3 py-2 rounded text-sm transition-colors text-left ${
                              activeTab === item.tab ? "text-primary bg-primary/10 font-bold" : "text-muted-foreground hover:text-foreground hover:bg-card"
                            }`}>
                            <item.icon size={15} /> {item.label}
                            {item.tab === "views" && profileViews.length > 0 && (
                              <span className="ml-auto w-5 h-5 bg-primary text-primary-foreground text-[9px] font-bold rounded-full flex items-center justify-center">
                                {profileViews.length}
                              </span>
                            )}
                          </button>
                        );
                      })}
                    </div>
                  </div>
                ))}
              </nav>
            </div>

            {/* Main content */}
            <div className="flex-1 min-w-0">
              {/* OVERVIEW */}
              {activeTab === "overview" && (
                <div className="space-y-6">
                  {/* Mini profile + completion */}
                  <div className="card-surface p-8">
                    <div className="flex items-center gap-4 mb-6">
                      {profile?.profile_photo_url ? (
                        <img src={profile.profile_photo_url} alt="" className="w-16 h-16 rounded-full object-cover border-2 border-primary" />
                      ) : (
                        <div className="w-16 h-16 rounded-full bg-muted flex items-center justify-center border-2 border-primary">
                          <span className="font-display text-xl text-muted-foreground">{profile?.full_name?.charAt(0)}</span>
                        </div>
                      )}
                      <div>
                        <h2 className="font-display text-2xl">{profile?.full_name}</h2>
                        <p className="text-sm text-muted-foreground">{(profile?.roles_applied || []).join(" · ")}</p>
                      </div>
                    </div>

                    <div className="mb-2 flex items-center justify-between text-sm">
                      <span className="text-muted-foreground">Profile completion</span>
                      <span className="font-bold text-primary">{completionPct}%</span>
                    </div>
                    <Progress value={completionPct} className="h-2 mb-4" />

                    {missingFields.length > 0 && (
                      <div className="space-y-1">
                        {missingFields.map(f => (
                          <p key={f.key} className="text-xs text-muted-foreground">• {f.label}</p>
                        ))}
                      </div>
                    )}

                    <div className="flex flex-wrap gap-3 mt-6">
                      {profile && (
                        <Button asChild variant="outline" size="sm">
                          <Link to={`/talent/${profile.id}`}><Eye size={14} className="mr-1" /> View Public Profile</Link>
                        </Button>
                      )}
                      {profile && (
                        <Button asChild variant="ghost" size="sm">
                          <Link to={`/talent/${profile.id}?preview=company`}>Preview as Company</Link>
                        </Button>
                      )}
                    </div>
                  </div>

                  {/* Quick action cards */}
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="card-surface p-6 cursor-pointer hover:border-primary/30 transition-colors" onClick={() => setActiveTab("skills")}>
                      <Wrench size={20} className="text-primary mb-3" />
                      <h3 className="font-display text-lg mb-1">UPDATE SKILLS</h3>
                      <p className="text-xs text-muted-foreground mb-3">Last updated {profile?.updated_at ? new Date(profile.updated_at).toLocaleDateString() : "never"}</p>
                      <span className="text-primary text-xs font-bold">Go →</span>
                    </div>
                    <div className="card-surface p-6 cursor-pointer hover:border-primary/30 transition-colors" onClick={() => setActiveTab("certifications")}>
                      <Award size={20} className="text-primary mb-3" />
                      <h3 className="font-display text-lg mb-1">ADD CERT</h3>
                      <p className="text-xs text-muted-foreground mb-3">{certifications.length} uploaded</p>
                      <span className="text-primary text-xs font-bold">Go →</span>
                    </div>
                    <Link to="/jobs" className="card-surface p-6 hover:border-primary/30 transition-colors block">
                      <Briefcase size={20} className="text-primary mb-3" />
                      <h3 className="font-display text-lg mb-1">VIEW JOBS</h3>
                      <p className="text-xs text-muted-foreground mb-3">Browse open roles</p>
                      <span className="text-primary text-xs font-bold">Go →</span>
                    </Link>
                  </div>

                  {/* Status tracker */}
                  <div className="card-surface p-8">
                    <h2 className="font-body font-bold text-sm mb-6 normal-case text-foreground">Application Status</h2>
                    <div className="flex items-center gap-2">
                      {statusSteps.map((step, i) => (
                        <div key={step.label} className="flex items-center gap-2 flex-1">
                          <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-mono shrink-0 ${
                            i <= currentStepIndex() ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground"
                          }`}>{i + 1}</div>
                          <span className={`text-xs hidden sm:block ${i <= currentStepIndex() ? "text-foreground" : "text-muted-foreground"}`}>{step.label}</span>
                          {i < statusSteps.length - 1 && <div className="flex-1 h-px bg-border" />}
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {/* SKILLS */}
              {activeTab === "skills" && (
                <div className="card-surface p-8 space-y-6">
                  <h2 className="font-display text-xl">MY SKILLS</h2>
                  <div className="flex flex-wrap gap-2">
                    {editSkills.map(skill => (
                      <span key={skill} className="border border-primary text-primary rounded-full px-3 py-1.5 font-mono text-[11px] font-semibold flex items-center gap-1.5">
                        {skill}
                        <button onClick={() => setEditSkills(s => s.filter(ss => ss !== skill))} className="hover:text-foreground"><X size={12} /></button>
                      </span>
                    ))}
                  </div>
                  {editSkills.length < 10 && (
                    <div className="flex gap-2">
                      <input value={skillInput} onChange={e => setSkillInput(e.target.value)}
                        onKeyDown={e => { if (e.key === "Enter" && skillInput.trim()) { setEditSkills(s => [...s, skillInput.trim()]); setSkillInput(""); } }}
                        placeholder="Add a skill..." className="flex-1 bg-background border border-border rounded px-3 py-2 text-sm" />
                      <Button size="sm" onClick={() => { if (skillInput.trim()) { setEditSkills(s => [...s, skillInput.trim()]); setSkillInput(""); } }}>Add</Button>
                    </div>
                  )}
                  <p className="text-xs text-muted-foreground">Max 10 skills</p>

                  <div className="space-y-4 pt-4 border-t border-border">
                    <div>
                      <label className="text-sm text-muted-foreground block mb-1">English Level</label>
                      <select value={editEnglish} onChange={e => setEditEnglish(e.target.value)} className="w-full bg-background border border-border rounded px-3 py-2 text-sm">
                        <option value="">Select</option>
                        {["Basic", "Conversational", "Fluent", "Native"].map(o => <option key={o} value={o}>{o}</option>)}
                      </select>
                    </div>
                    <div>
                      <label className="text-sm text-muted-foreground block mb-1">Work Type</label>
                      <select value={editWorkType} onChange={e => setEditWorkType(e.target.value)} className="w-full bg-background border border-border rounded px-3 py-2 text-sm">
                        <option value="">Select</option>
                        {["Full-time", "Part-time", "Contract", "Any"].map(o => <option key={o} value={o}>{o}</option>)}
                      </select>
                    </div>
                    <div>
                      <label className="text-sm text-muted-foreground block mb-1">Industries</label>
                      <div className="flex flex-wrap gap-2">
                        {["SaaS", "Fintech", "Healthtech", "E-commerce", "Agency", "Hospitality Tech", "Cybersecurity", "Other"].map(ind => (
                          <button key={ind} onClick={() => setEditIndustries(ii => ii.includes(ind) ? ii.filter(i => i !== ind) : [...ii, ind])}
                            className={`text-xs px-3 py-1.5 rounded-full border font-mono ${editIndustries.includes(ind) ? "border-primary text-primary bg-primary/10" : "border-border text-muted-foreground"}`}>
                            {ind}
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>

                  <Button onClick={saveSkills} className="bg-primary text-primary-foreground font-bold">Save Changes</Button>
                </div>
              )}

              {/* CERTIFICATIONS */}
              {activeTab === "certifications" && (
                <div className="card-surface p-8 space-y-6">
                  <h2 className="font-display text-xl">CERTIFICATIONS</h2>
                  {certifications.length === 0 ? (
                    <p className="text-sm text-muted-foreground">No certifications uploaded yet.</p>
                  ) : (
                    <div className="space-y-3">
                      {certifications.map(cert => (
                        <div key={cert.id} className="bg-card border border-border rounded-lg p-4 flex items-center gap-3">
                          <div className="w-10 h-10 rounded bg-primary/10 flex items-center justify-center"><FileText size={16} className="text-primary" /></div>
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-bold truncate">{cert.file_name}</p>
                            <p className="text-[10px] text-muted-foreground font-mono">{new Date(cert.uploaded_at).toLocaleDateString()}</p>
                          </div>
                          <Button variant="outline" size="sm" onClick={async () => {
                            const { data } = await supabase.storage.from("certifications").createSignedUrl(cert.file_url, 60);
                            if (data?.signedUrl) window.open(data.signedUrl, "_blank");
                          }}><Download size={12} /></Button>
                          <Button variant="ghost" size="sm" onClick={() => deleteCert(cert)}><Trash2 size={12} className="text-destructive" /></Button>
                        </div>
                      ))}
                    </div>
                  )}
                  {certifications.length < 10 && (
                    <label className="card-surface border-dashed p-6 flex flex-col items-center gap-2 cursor-pointer hover:border-primary transition-colors">
                      <Upload size={20} className="text-primary" />
                      <span className="text-sm text-muted-foreground">Upload certification (PDF/JPG/PNG, max 5MB)</span>
                      <input type="file" accept=".pdf,.jpg,.jpeg,.png" className="hidden" onChange={e => { if (e.target.files?.[0]) uploadCert(e.target.files[0]); }} />
                    </label>
                  )}
                </div>
              )}

              {/* PORTFOLIO LINKS */}
              {activeTab === "portfolio" && (
                <div className="card-surface p-8 space-y-6">
                  <h2 className="font-display text-xl">PORTFOLIO & LINKS</h2>
                  <div className="space-y-4">
                    {[
                      { key: "linkedin_url", label: "LinkedIn URL", icon: "🔗" },
                      { key: "github_url", label: "GitHub URL", icon: "🐙" },
                      { key: "portfolio_url", label: "Portfolio URL", icon: "🌐" },
                      { key: "portfolio_link", label: "Projects / AI Portfolio", icon: "🤖" },
                    ].map(field => (
                      <div key={field.key}>
                        <label className="text-sm text-muted-foreground block mb-1">{field.icon} {field.label}</label>
                        <input value={(linkForms as any)[field.key]} onChange={e => setLinkForms(f => ({ ...f, [field.key]: e.target.value }))}
                          placeholder={`https://...`} className="w-full bg-background border border-border rounded px-3 py-2 text-sm" />
                      </div>
                    ))}

                    <div className="border-t border-border pt-4">
                      <label className="text-sm text-muted-foreground block mb-2">Additional Links</label>
                      {extraLinks.map((link, i) => (
                        <div key={i} className="flex gap-2 mb-2">
                          <input value={link.label} onChange={e => setExtraLinks(ll => ll.map((l, ii) => ii === i ? { ...l, label: e.target.value } : l))}
                            placeholder="Label" className="w-1/3 bg-background border border-border rounded px-3 py-2 text-sm" />
                          <input value={link.url} onChange={e => setExtraLinks(ll => ll.map((l, ii) => ii === i ? { ...l, url: e.target.value } : l))}
                            placeholder="https://..." className="flex-1 bg-background border border-border rounded px-3 py-2 text-sm" />
                          <Button variant="ghost" size="sm" onClick={() => setExtraLinks(ll => ll.filter((_, ii) => ii !== i))}><X size={14} /></Button>
                        </div>
                      ))}
                      {extraLinks.length < 4 && (
                        <Button variant="outline" size="sm" onClick={() => setExtraLinks(l => [...l, { label: "", url: "" }])}>+ Add Link</Button>
                      )}
                    </div>
                  </div>
                  <Button onClick={saveLinks} className="bg-primary text-primary-foreground font-bold">Save Links</Button>
                </div>
              )}

              {/* PHOTOS */}
              {activeTab === "photos" && (
                <div className="card-surface p-8 space-y-6">
                  <h2 className="font-display text-xl">PHOTOS</h2>
                  <div>
                    <label className="text-sm text-muted-foreground block mb-2">Profile Photo</label>
                    <div className="flex items-center gap-4">
                      {profile?.profile_photo_url ? (
                        <img src={profile.profile_photo_url} alt="" className="w-20 h-20 rounded-full object-cover border-2 border-primary" />
                      ) : (
                        <div className="w-20 h-20 rounded-full bg-muted flex items-center justify-center border-2 border-primary">
                          <User size={24} className="text-muted-foreground" />
                        </div>
                      )}
                      <Button asChild variant="outline" size="sm"><Link to="/talent/profile/edit">Change Profile Photo</Link></Button>
                    </div>
                  </div>
                  <div className="border-t border-border pt-4">
                    <label className="text-sm text-muted-foreground block mb-3">Additional Photos (max 3)</label>
                    <div className="grid grid-cols-3 gap-3">
                      {photos.map(photo => (
                        <div key={photo.id} className="relative group">
                          <img src={photo.photo_url} alt="" className="w-full h-32 object-cover rounded-lg border border-border" />
                          <button onClick={() => deletePhoto(photo)}
                            className="absolute top-2 right-2 w-6 h-6 bg-destructive text-destructive-foreground rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                            <X size={12} />
                          </button>
                        </div>
                      ))}
                      {photos.length < 3 && (
                        <label className="h-32 border border-dashed border-border rounded-lg flex flex-col items-center justify-center gap-1 cursor-pointer hover:border-primary transition-colors">
                          <Upload size={16} className="text-primary" />
                          <span className="text-[10px] text-muted-foreground">Upload</span>
                          <input type="file" accept="image/*" className="hidden" onChange={e => { if (e.target.files?.[0]) uploadPhoto(e.target.files[0]); }} />
                        </label>
                      )}
                    </div>
                  </div>
                </div>
              )}

              {/* APPLICATIONS */}
              {activeTab === "applications" && (
                <div className="space-y-4">
                  <h2 className="font-display text-xl mb-4">YOUR APPLICATIONS</h2>
                  <div className="card-surface p-8 mb-4">
                    <h3 className="font-body font-bold text-sm mb-6 normal-case text-foreground">Application Progress</h3>
                    <div className="flex items-center gap-2">
                      {statusSteps.map((step, i) => (
                        <div key={step.label} className="flex items-center gap-2 flex-1">
                          <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-mono shrink-0 ${
                            i <= currentStepIndex() ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground"
                          }`}>{i + 1}</div>
                          <span className={`text-xs hidden sm:block ${i <= currentStepIndex() ? "text-foreground" : "text-muted-foreground"}`}>{step.label}</span>
                          {i < statusSteps.length - 1 && <div className="flex-1 h-px bg-border" />}
                        </div>
                      ))}
                    </div>
                  </div>
                  {applications.length === 0 ? (
                    <div className="card-surface p-12 text-center">
                      <Activity size={32} className="mx-auto mb-4 text-muted-foreground" />
                      <p className="text-sm text-muted-foreground">No job applications yet.</p>
                    </div>
                  ) : (
                    <div className="space-y-3">
                      {applications.map((app: any) => (
                        <div key={app.id} className="card-surface p-5 flex items-center justify-between">
                          <div>
                            <h4 className="font-bold text-sm">{app.jobs?.title || "Job"}</h4>
                            <p className="text-xs text-muted-foreground">{app.jobs?.role_type} · Applied {new Date(app.applied_at).toLocaleDateString()}</p>
                          </div>
                          <div className="flex items-center gap-3">
                            <span className={`text-[10px] font-mono px-2.5 py-1 rounded-full font-semibold ${
                              app.status === "shortlisted" ? "status-active" :
                              app.status === "rejected" ? "status-rejected" :
                              app.status === "reviewed" ? "status-screening" : "status-pending"
                            }`}>{app.status}</span>
                            {app.status === "applied" && (
                              <Button variant="ghost" size="sm" className="text-destructive hover:text-destructive text-xs"
                                onClick={() => withdrawApplication(app.id)}>
                                <XCircle size={12} className="mr-1" /> Withdraw
                              </Button>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}

              {/* VIEWS */}
              {activeTab === "views" && (
                <div>
                  <div className="card-surface p-8 mb-6">
                    <div className="flex items-center gap-3 mb-2">
                      <Eye size={20} className="text-primary" />
                      <span className="text-sm text-muted-foreground">Profile views this month</span>
                    </div>
                    <p className="font-display text-5xl text-primary">{profileViews.length}</p>
                  </div>
                  {profileViews.length === 0 ? (
                    <div className="card-surface p-12 text-center">
                      <Eye size={32} className="mx-auto mb-4 text-muted-foreground" />
                      <p className="text-sm text-muted-foreground">No views yet. Complete your profile to get noticed.</p>
                    </div>
                  ) : (
                    <div className="space-y-2">
                      {profileViews.map((v: any, i: number) => (
                        <div key={i} className="card-surface px-6 py-4 flex items-center gap-3">
                          <Eye size={14} className="text-muted-foreground" />
                          <span className="text-sm">
                            Viewed on {new Date(v.viewed_at).toLocaleDateString([], { month: "long", day: "numeric", year: "numeric" })} at {new Date(v.viewed_at).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                          </span>
                        </div>
                      ))}
                    </div>
                  )}
                  <p className="text-[10px] text-muted-foreground mt-4 font-mono text-center">Company identities are kept confidential</p>
                </div>
              )}

              {/* MESSAGES */}
              {activeTab === "messages" && <MessagingPanel />}
            </div>
          </div>
        </div>
      </section>
    </PageLayout>
  );
};

export default CandidateDashboard;
