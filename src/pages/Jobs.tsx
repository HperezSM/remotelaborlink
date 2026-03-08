import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { toast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Link } from "react-router-dom";
import PageLayout from "@/components/PageLayout";
import { Briefcase, MapPin, Clock, DollarSign, Search, Filter } from "lucide-react";

const roleTypes = [
  "Virtual Assistant (VA)", "Project Manager / Operations", "Software Development / Engineering",
  "Customer Success / Support", "Marketing / Growth", "Sales / Business Development",
  "Data / Analytics", "Finance / Accounting", "Other"
];

const engagementTypes = ["Full-time", "Part-time", "Contract"];

const Jobs = () => {
  const { user, role } = useAuth();
  const [jobs, setJobs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [roleFilter, setRoleFilter] = useState("");
  const [engagementFilter, setEngagementFilter] = useState("");
  const [candidateProfile, setCandidateProfile] = useState<any>(null);
  const [appliedJobs, setAppliedJobs] = useState<Set<string>>(new Set());
  const [applyModal, setApplyModal] = useState<any>(null);
  const [applying, setApplying] = useState(false);

  useEffect(() => {
    fetchJobs();
    if (user && role === "candidate") {
      fetchCandidateProfile();
    }
  }, [user, role]);

  const fetchJobs = async () => {
    const { data } = await supabase
      .from("jobs")
      .select("*, companies(company_name)")
      .eq("status", "active")
      .order("posted_at", { ascending: false });
    setJobs(data || []);
    setLoading(false);
  };

  const fetchCandidateProfile = async () => {
    const { data: profile } = await supabase
      .from("candidate_profiles")
      .select("*")
      .eq("user_id", user!.id)
      .single();
    if (profile) {
      setCandidateProfile(profile);
      const { data: apps } = await supabase
        .from("job_applications")
        .select("job_id")
        .eq("candidate_id", profile.id);
      if (apps) setAppliedJobs(new Set(apps.map((a: any) => a.job_id)));
    }
  };

  const handleApply = async (job: any) => {
    if (!user) {
      setApplyModal({ type: "login", job });
      return;
    }
    if (role !== "candidate") {
      toast({ title: "Only candidates can apply", variant: "destructive" });
      return;
    }
    if (!candidateProfile) {
      setApplyModal({ type: "login", job });
      return;
    }
    setApplyModal({ type: "confirm", job });
  };

  const submitApplication = async () => {
    if (!candidateProfile || !applyModal?.job) return;
    setApplying(true);
    const { error } = await supabase.from("job_applications").insert({
      job_id: applyModal.job.id,
      candidate_id: candidateProfile.id,
    });
    if (error) {
      if (error.code === "23505") {
        toast({ title: "Already applied", description: "You've already applied to this role." });
      } else {
        toast({ title: "Error", description: error.message, variant: "destructive" });
      }
    } else {
      toast({ title: "Application submitted!", description: "We'll be in touch." });
      setAppliedJobs(prev => new Set([...prev, applyModal.job.id]));
    }
    setApplying(false);
    setApplyModal(null);
  };

  const filtered = jobs.filter(j => {
    if (search && !j.title.toLowerCase().includes(search.toLowerCase()) && 
        !(j.short_description || "").toLowerCase().includes(search.toLowerCase())) return false;
    if (roleFilter && j.role_type !== roleFilter) return false;
    if (engagementFilter && j.engagement_type !== engagementFilter) return false;
    return true;
  });

  const inputClass = "bg-card border border-border rounded px-3 py-2 text-sm text-foreground focus:outline-none focus:border-primary";

  return (
    <PageLayout>
      <section className="pt-32 pb-20 px-[5%]">
        <div className="max-w-6xl mx-auto">
          <span className="section-tag">Open Roles</span>
          <h1 className="font-display text-5xl md:text-7xl mb-4">
            CURRENT<br />OPPORTUNITIES.
          </h1>
          <p className="text-muted-foreground max-w-xl text-lg mb-12">
            Active roles from companies we work with. These are real positions — vetted clients, competitive pay, remote from LATAM.
          </p>

          {/* Filters */}
          <div className="flex flex-col sm:flex-row gap-3 mb-10">
            <div className="relative flex-1">
              <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder="Search by title or keyword..."
                value={search}
                onChange={e => setSearch(e.target.value)}
                className="pl-9"
              />
            </div>
            <select value={roleFilter} onChange={e => setRoleFilter(e.target.value)} className={inputClass}>
              <option value="">All Role Types</option>
              {roleTypes.map(r => <option key={r} value={r}>{r}</option>)}
            </select>
            <select value={engagementFilter} onChange={e => setEngagementFilter(e.target.value)} className={inputClass}>
              <option value="">All Engagement</option>
              {engagementTypes.map(e => <option key={e} value={e}>{e}</option>)}
            </select>
          </div>

          {/* Job Grid */}
          {loading ? (
            <div className="text-center py-20 text-muted-foreground">Loading roles...</div>
          ) : filtered.length === 0 ? (
            <div className="card-surface p-12 text-center">
              <Briefcase size={40} className="mx-auto mb-4 text-muted-foreground" />
              <h3 className="font-display text-xl mb-2">NO OPEN ROLES RIGHT NOW</h3>
              <p className="text-sm text-muted-foreground mb-6">Check back soon or join our talent network to get notified.</p>
              <Button asChild className="bg-primary text-primary-foreground font-bold">
                <Link to="/signup/talent">Join Talent Network</Link>
              </Button>
            </div>
          ) : (
            <div className="grid md:grid-cols-2 gap-5">
              {filtered.map(job => (
                <div key={job.id} className="card-surface p-7 hover:border-primary transition-colors group">
                  <div className="flex items-start justify-between gap-4 mb-4">
                    <h3 className="font-display text-lg">{job.title}</h3>
                  </div>
                  <div className="flex flex-wrap gap-2 mb-4">
                    <span className="text-[11px] font-mono border border-primary text-primary px-2 py-0.5 rounded">
                      {job.role_type}
                    </span>
                    <span className="text-[11px] font-mono border border-border text-muted-foreground px-2 py-0.5 rounded flex items-center gap-1">
                      <MapPin size={10} /> Remote — LATAM
                    </span>
                    {job.engagement_type && (
                      <span className="text-[11px] font-mono border border-border text-muted-foreground px-2 py-0.5 rounded flex items-center gap-1">
                        <Clock size={10} /> {job.engagement_type}
                      </span>
                    )}
                    {job.seniority && (
                      <span className="text-[11px] font-mono border border-border text-muted-foreground px-2 py-0.5 rounded">
                        {job.seniority}
                      </span>
                    )}
                  </div>
                  
                  <p className="text-sm text-muted-foreground mb-1">
                    {job.show_company_name && job.companies?.company_name
                      ? job.companies.company_name
                      : "Confidential"}
                  </p>

                  {(job.salary_min || job.salary_max) && (
                    <p className="text-sm text-foreground flex items-center gap-1 mb-3">
                      <DollarSign size={13} />
                      {job.salary_min && job.salary_max
                        ? `$${job.salary_min.toLocaleString()} – $${job.salary_max.toLocaleString()}/mo`
                        : job.salary_min ? `From $${job.salary_min.toLocaleString()}/mo` : `Up to $${job.salary_max.toLocaleString()}/mo`}
                    </p>
                  )}

                  {job.short_description && (
                    <p className="text-sm text-muted-foreground mb-5 line-clamp-2">{job.short_description}</p>
                  )}

                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-mono text-muted-foreground">
                      Posted {new Date(job.posted_at).toLocaleDateString()}
                    </span>
                    {appliedJobs.has(job.id) ? (
                      <span className="text-xs font-mono text-primary">✓ Applied</span>
                    ) : (
                      <Button size="sm" onClick={() => handleApply(job)} className="bg-primary text-primary-foreground font-bold">
                        Apply Now
                      </Button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Apply Modal */}
      {applyModal && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4">
          <div className="card-surface p-8 max-w-md w-full">
            {applyModal.type === "login" ? (
              <>
                <h3 className="font-display text-xl mb-4">CREATE YOUR PROFILE TO APPLY</h3>
                <p className="text-sm text-muted-foreground mb-6">
                  Join our talent network to apply for <strong className="text-foreground">{applyModal.job.title}</strong> and other roles.
                </p>
                <div className="flex gap-3">
                  <Button asChild className="flex-1 bg-primary text-primary-foreground font-bold">
                    <Link to="/signup/talent">Sign Up</Link>
                  </Button>
                  <Button asChild variant="outline" className="flex-1">
                    <Link to="/login/talent">Log In</Link>
                  </Button>
                </div>
                <button onClick={() => setApplyModal(null)} className="mt-4 text-sm text-muted-foreground hover:text-foreground w-full text-center">Cancel</button>
              </>
            ) : (
              <>
                <h3 className="font-display text-xl mb-4">CONFIRM APPLICATION</h3>
                <p className="text-sm text-muted-foreground mb-2">Applying as:</p>
                <div className="card-surface p-4 mb-4 border border-border">
                  <p className="font-bold">{candidateProfile?.full_name}</p>
                  <p className="text-sm text-muted-foreground">{(candidateProfile?.roles_applied || []).join(", ")}</p>
                </div>
                <p className="text-sm text-muted-foreground mb-6">
                  For: <strong className="text-foreground">{applyModal.job.title}</strong>
                </p>
                <div className="flex gap-3">
                  <Button variant="outline" onClick={() => setApplyModal(null)} className="flex-1">Cancel</Button>
                  <Button onClick={submitApplication} disabled={applying} className="flex-1 bg-primary text-primary-foreground font-bold">
                    {applying ? "Submitting..." : "Submit Application"}
                  </Button>
                </div>
              </>
            )}
          </div>
        </div>
      )}
    </PageLayout>
  );
};

export default Jobs;
