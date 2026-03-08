import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Plus, ArrowLeft, Eye, Pencil, Users } from "lucide-react";

const roleTypes = [
  "Virtual Assistant (VA)", "Project Manager / Operations", "Software Development / Engineering",
  "Customer Success / Support", "Marketing / Growth", "Sales / Business Development",
  "Data / Analytics", "Finance / Accounting", "Other"
];
const engagementTypes = ["Full-time", "Part-time", "Contract"];
const seniorityLevels = ["Junior", "Mid-Level", "Senior", "Lead", "Executive"];
const jobStatuses = ["draft", "active", "closed"];
const appStatuses = ["applied", "reviewed", "shortlisted", "rejected"];

const emptyJob = {
  title: "", role_type: roleTypes[0], company_id: "", show_company_name: false,
  engagement_type: "Full-time", seniority: "Mid-Level",
  salary_min: "", salary_max: "",
  short_description: "", full_description: "", requirements: "", nice_to_haves: "",
  status: "draft",
};

interface Props {
  companies: any[];
}

const JobsManagementTab = ({ companies }: Props) => {
  const [jobs, setJobs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [view, setView] = useState<"list" | "form" | "applications">("list");
  const [editingJob, setEditingJob] = useState<any>(null);
  const [form, setForm] = useState<any>({ ...emptyJob });
  const [saving, setSaving] = useState(false);
  const [selectedJob, setSelectedJob] = useState<any>(null);
  const [applications, setApplications] = useState<any[]>([]);

  useEffect(() => { fetchJobs(); }, []);

  const fetchJobs = async () => {
    setLoading(true);
    const { data } = await supabase
      .from("jobs")
      .select("*, companies(company_name)")
      .order("created_at", { ascending: false });
    setJobs(data || []);
    setLoading(false);
  };

  const openCreate = () => {
    setEditingJob(null);
    setForm({ ...emptyJob });
    setView("form");
  };

  const openEdit = (job: any) => {
    setEditingJob(job);
    setForm({
      title: job.title, role_type: job.role_type, company_id: job.company_id || "",
      show_company_name: job.show_company_name, engagement_type: job.engagement_type || "Full-time",
      seniority: job.seniority || "Mid-Level", salary_min: job.salary_min || "",
      salary_max: job.salary_max || "", short_description: job.short_description || "",
      full_description: job.full_description || "", requirements: job.requirements || "",
      nice_to_haves: job.nice_to_haves || "", status: job.status,
    });
    setView("form");
  };

  const openApplications = async (job: any) => {
    setSelectedJob(job);
    const { data } = await supabase
      .from("job_applications")
      .select("*, candidate_profiles(full_name, roles_applied, country, seniority_level)")
      .eq("job_id", job.id)
      .order("applied_at", { ascending: false });
    setApplications(data || []);
    setView("applications");
  };

  const saveJob = async () => {
    if (!form.title.trim() || !form.role_type) {
      toast({ title: "Title and role type are required", variant: "destructive" });
      return;
    }
    setSaving(true);
    const payload = {
      title: form.title.trim(),
      role_type: form.role_type,
      company_id: form.company_id || null,
      show_company_name: form.show_company_name,
      engagement_type: form.engagement_type || null,
      seniority: form.seniority || null,
      salary_min: form.salary_min ? Number(form.salary_min) : null,
      salary_max: form.salary_max ? Number(form.salary_max) : null,
      short_description: form.short_description.trim().slice(0, 200) || null,
      full_description: form.full_description.trim() || null,
      requirements: form.requirements.trim() || null,
      nice_to_haves: form.nice_to_haves.trim() || null,
      status: form.status,
    };

    let error;
    if (editingJob) {
      ({ error } = await supabase.from("jobs").update(payload).eq("id", editingJob.id));
    } else {
      ({ error } = await supabase.from("jobs").insert(payload));
    }

    if (error) toast({ title: "Error", description: error.message, variant: "destructive" });
    else { toast({ title: editingJob ? "Job updated" : "Job created" }); fetchJobs(); setView("list"); }
    setSaving(false);
  };

  const updateAppStatus = async (appId: string, status: string) => {
    const { error } = await supabase.from("job_applications").update({ status }).eq("id", appId);
    if (error) toast({ title: "Error", description: error.message, variant: "destructive" });
    else {
      setApplications(prev => prev.map(a => a.id === appId ? { ...a, status } : a));
      toast({ title: `Status updated to ${status}` });
    }
  };

  const inputClass = "bg-background border border-border rounded px-3 py-2 text-sm text-foreground focus:outline-none focus:border-primary";

  const getStatusBadge = (status: string) => {
    const map: Record<string, string> = {
      active: "status-active", draft: "status-pending", closed: "status-rejected",
      applied: "status-pending", reviewed: "status-screening", shortlisted: "status-active", rejected: "status-rejected",
    };
    return map[status] || "status-pending";
  };

  // LIST VIEW
  if (view === "list") {
    return (
      <div>
        <div className="flex items-center justify-between mb-6">
          <p className="text-sm text-muted-foreground">{jobs.length} job{jobs.length !== 1 ? "s" : ""} total</p>
          <Button onClick={openCreate} size="sm" className="bg-primary text-primary-foreground font-bold">
            <Plus size={14} className="mr-1" /> New Job
          </Button>
        </div>

        {jobs.length === 0 ? (
          <div className="card-surface p-12 text-center">
            <h3 className="font-display text-xl mb-2">NO JOBS YET</h3>
            <p className="text-sm text-muted-foreground mb-4">Create your first job posting.</p>
            <Button onClick={openCreate} className="bg-primary text-primary-foreground font-bold">Create Job</Button>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border">
                  <th className="text-left py-3 px-3 font-mono text-[10px] text-muted-foreground uppercase tracking-wider">Title</th>
                  <th className="text-left py-3 px-3 font-mono text-[10px] text-muted-foreground uppercase tracking-wider">Type</th>
                  <th className="text-left py-3 px-3 font-mono text-[10px] text-muted-foreground uppercase tracking-wider">Company</th>
                  <th className="text-left py-3 px-3 font-mono text-[10px] text-muted-foreground uppercase tracking-wider">Status</th>
                  <th className="text-left py-3 px-3 font-mono text-[10px] text-muted-foreground uppercase tracking-wider">Posted</th>
                  <th className="text-left py-3 px-3 font-mono text-[10px] text-muted-foreground uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody>
                {jobs.map(job => (
                  <tr key={job.id} className="border-b border-border hover:bg-card/50 transition-colors">
                    <td className="py-3 px-3 font-bold">{job.title}</td>
                    <td className="py-3 px-3 text-muted-foreground text-xs">{job.role_type}</td>
                    <td className="py-3 px-3 text-muted-foreground">{job.companies?.company_name || "—"}</td>
                    <td className="py-3 px-3">
                      <span className={`text-[10px] font-mono px-2.5 py-1 rounded-full font-semibold ${getStatusBadge(job.status)}`}>
                        {job.status}
                      </span>
                    </td>
                    <td className="py-3 px-3 text-muted-foreground text-xs">{new Date(job.posted_at).toLocaleDateString()}</td>
                    <td className="py-3 px-3">
                      <div className="flex gap-2">
                        <button onClick={() => openEdit(job)} className="text-xs text-primary hover:underline flex items-center gap-1"><Pencil size={11} /> Edit</button>
                        <button onClick={() => openApplications(job)} className="text-xs text-primary hover:underline flex items-center gap-1"><Users size={11} /> Apps</button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    );
  }

  // FORM VIEW
  if (view === "form") {
    return (
      <div>
        <button onClick={() => setView("list")} className="flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground mb-6">
          <ArrowLeft size={14} /> Back to Jobs
        </button>
        <div className="card-surface p-6 max-w-2xl">
          <h3 className="font-display text-xl mb-6">{editingJob ? "EDIT JOB" : "CREATE JOB"}</h3>
          <div className="space-y-4">
            <div>
              <Label className="text-xs font-mono text-muted-foreground uppercase tracking-wider">Role Title *</Label>
              <Input value={form.title} onChange={e => setForm({ ...form, title: e.target.value })} placeholder="e.g. Senior Full-Stack Developer" />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label className="text-xs font-mono text-muted-foreground uppercase tracking-wider">Role Type *</Label>
                <select value={form.role_type} onChange={e => setForm({ ...form, role_type: e.target.value })} className={`${inputClass} w-full`}>
                  {roleTypes.map(r => <option key={r} value={r}>{r}</option>)}
                </select>
              </div>
              <div>
                <Label className="text-xs font-mono text-muted-foreground uppercase tracking-wider">Engagement</Label>
                <select value={form.engagement_type} onChange={e => setForm({ ...form, engagement_type: e.target.value })} className={`${inputClass} w-full`}>
                  {engagementTypes.map(e => <option key={e} value={e}>{e}</option>)}
                </select>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label className="text-xs font-mono text-muted-foreground uppercase tracking-wider">Seniority</Label>
                <select value={form.seniority} onChange={e => setForm({ ...form, seniority: e.target.value })} className={`${inputClass} w-full`}>
                  {seniorityLevels.map(s => <option key={s} value={s}>{s}</option>)}
                </select>
              </div>
              <div>
                <Label className="text-xs font-mono text-muted-foreground uppercase tracking-wider">Status</Label>
                <select value={form.status} onChange={e => setForm({ ...form, status: e.target.value })} className={`${inputClass} w-full`}>
                  {jobStatuses.map(s => <option key={s} value={s}>{s}</option>)}
                </select>
              </div>
            </div>
            <div>
              <Label className="text-xs font-mono text-muted-foreground uppercase tracking-wider">Company</Label>
              <select value={form.company_id} onChange={e => setForm({ ...form, company_id: e.target.value })} className={`${inputClass} w-full`}>
                <option value="">No company / manual</option>
                {companies.map(c => <option key={c.id} value={c.id}>{c.company_name}</option>)}
              </select>
            </div>
            <div className="flex items-center gap-3">
              <Switch checked={form.show_company_name} onCheckedChange={v => setForm({ ...form, show_company_name: v })} />
              <Label className="text-sm">Show company name publicly</Label>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label className="text-xs font-mono text-muted-foreground uppercase tracking-wider">Salary Min (USD/mo)</Label>
                <Input type="number" value={form.salary_min} onChange={e => setForm({ ...form, salary_min: e.target.value })} placeholder="e.g. 2000" />
              </div>
              <div>
                <Label className="text-xs font-mono text-muted-foreground uppercase tracking-wider">Salary Max (USD/mo)</Label>
                <Input type="number" value={form.salary_max} onChange={e => setForm({ ...form, salary_max: e.target.value })} placeholder="e.g. 4000" />
              </div>
            </div>
            <div>
              <Label className="text-xs font-mono text-muted-foreground uppercase tracking-wider">Short Description (max 200 chars)</Label>
              <Textarea value={form.short_description} onChange={e => setForm({ ...form, short_description: e.target.value })} maxLength={200} rows={2} />
            </div>
            <div>
              <Label className="text-xs font-mono text-muted-foreground uppercase tracking-wider">Full Description</Label>
              <Textarea value={form.full_description} onChange={e => setForm({ ...form, full_description: e.target.value })} rows={5} />
            </div>
            <div>
              <Label className="text-xs font-mono text-muted-foreground uppercase tracking-wider">Requirements</Label>
              <Textarea value={form.requirements} onChange={e => setForm({ ...form, requirements: e.target.value })} rows={3} />
            </div>
            <div>
              <Label className="text-xs font-mono text-muted-foreground uppercase tracking-wider">Nice to Haves</Label>
              <Textarea value={form.nice_to_haves} onChange={e => setForm({ ...form, nice_to_haves: e.target.value })} rows={3} />
            </div>
            <div className="flex gap-3 pt-4">
              <Button variant="outline" onClick={() => setView("list")}>Cancel</Button>
              <Button onClick={saveJob} disabled={saving} className="bg-primary text-primary-foreground font-bold">
                {saving ? "Saving..." : editingJob ? "Update Job" : "Create Job"}
              </Button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // APPLICATIONS VIEW
  return (
    <div>
      <button onClick={() => setView("list")} className="flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground mb-6">
        <ArrowLeft size={14} /> Back to Jobs
      </button>
      <h3 className="font-display text-xl mb-2">APPLICATIONS — {selectedJob?.title}</h3>
      <p className="text-sm text-muted-foreground mb-6">{applications.length} application{applications.length !== 1 ? "s" : ""}</p>

      {applications.length === 0 ? (
        <div className="card-surface p-12 text-center">
          <h3 className="font-display text-lg mb-2">NO APPLICATIONS YET</h3>
          <p className="text-sm text-muted-foreground">Applications will appear here once candidates apply.</p>
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border">
                <th className="text-left py-3 px-3 font-mono text-[10px] text-muted-foreground uppercase tracking-wider">Candidate</th>
                <th className="text-left py-3 px-3 font-mono text-[10px] text-muted-foreground uppercase tracking-wider">Roles</th>
                <th className="text-left py-3 px-3 font-mono text-[10px] text-muted-foreground uppercase tracking-wider">Country</th>
                <th className="text-left py-3 px-3 font-mono text-[10px] text-muted-foreground uppercase tracking-wider">Applied</th>
                <th className="text-left py-3 px-3 font-mono text-[10px] text-muted-foreground uppercase tracking-wider">Status</th>
              </tr>
            </thead>
            <tbody>
              {applications.map(app => (
                <tr key={app.id} className="border-b border-border hover:bg-card/50 transition-colors">
                  <td className="py-3 px-3 font-bold">{app.candidate_profiles?.full_name || "Unknown"}</td>
                  <td className="py-3 px-3 text-muted-foreground text-xs">{(app.candidate_profiles?.roles_applied || []).join(", ")}</td>
                  <td className="py-3 px-3 text-muted-foreground">{app.candidate_profiles?.country}</td>
                  <td className="py-3 px-3 text-muted-foreground text-xs">{new Date(app.applied_at).toLocaleDateString()}</td>
                  <td className="py-3 px-3">
                    <select
                      value={app.status}
                      onChange={e => updateAppStatus(app.id, e.target.value)}
                      className="bg-transparent text-xs font-mono cursor-pointer focus:outline-none"
                    >
                      {appStatuses.map(s => <option key={s} value={s}>{s}</option>)}
                    </select>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default JobsManagementTab;
