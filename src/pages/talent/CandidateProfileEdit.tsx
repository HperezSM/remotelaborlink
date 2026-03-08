import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";
import PageLayout from "@/components/PageLayout";
import { CheckCircle2 } from "lucide-react";

const LATAM_COUNTRIES = [
  "Mexico", "Colombia", "Argentina", "Brazil", "Chile", "Peru", "Costa Rica", "Ecuador",
  "Uruguay", "Panama", "Guatemala", "Dominican Republic", "Honduras", "El Salvador",
  "Bolivia", "Paraguay", "Nicaragua", "Venezuela", "Cuba", "Puerto Rico",
];

const ROLE_OPTIONS = [
  "Project Manager", "Scrum Master", "Full Stack Developer", "Frontend Developer",
  "Backend Developer", "UX/UI Designer", "Customer Support", "Operations Manager", "Other",
];

const INDUSTRIES = ["SaaS", "Fintech", "Healthtech", "E-commerce", "Agency", "Hospitality Tech", "Cybersecurity", "Other"];

const TOTAL_STEPS = 5;
const STEP_LABELS = ["Personal Info", "Professional", "Skills", "Screening", "Review"];

const CandidateProfileEdit = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [loadingProfile, setLoadingProfile] = useState(true);
  const [skillInput, setSkillInput] = useState("");
  const [errors, setErrors] = useState<Record<string, string>>({});

  const [form, setForm] = useState({
    full_name: "", country: "", city: "", linkedin_url: "", portfolio_url: "", profile_photo_url: "",
    roles_applied: [] as string[], years_experience: "", seniority_level: "", employment_status: "",
    availability: "", expected_rate_usd: "", work_type_preference: "",
    technical_skills: [] as string[], bio: "", proud_achievement: "", industries: [] as string[],
    resume_url: "", loom_video_url: "", portfolio_link: "", english_proficiency: "",
    confirmed: false,
  });

  // Load existing profile data
  useEffect(() => {
    if (!user) return;
    const load = async () => {
      const { data } = await supabase.from("candidate_profiles").select("*").eq("user_id", user.id).single();
      if (data) {
        setForm(f => ({
          ...f,
          full_name: data.full_name || "",
          country: data.country || "",
          city: data.city || "",
          linkedin_url: data.linkedin_url || "",
          portfolio_url: data.portfolio_url || "",
          profile_photo_url: data.profile_photo_url || "",
          roles_applied: data.roles_applied || [],
          years_experience: data.years_experience || "",
          seniority_level: data.seniority_level || "",
          employment_status: data.employment_status || "",
          availability: data.availability || "",
          expected_rate_usd: data.expected_rate_usd?.toString() || "",
          work_type_preference: data.work_type_preference || "",
          technical_skills: data.technical_skills || [],
          bio: data.bio || "",
          proud_achievement: data.proud_achievement || "",
          industries: data.industries || [],
          resume_url: data.resume_url || "",
          loom_video_url: data.loom_video_url || "",
          portfolio_link: data.portfolio_link || "",
          english_proficiency: data.english_proficiency || "",
        }));
      }
      setLoadingProfile(false);
    };
    load();
  }, [user]);

  const updateField = (field: string, value: any) => {
    setForm(f => ({ ...f, [field]: value }));
    setErrors(e => { const n = { ...e }; delete n[field]; return n; });
  };

  const toggleArrayItem = (field: string, item: string) => {
    const arr = (form as any)[field] as string[];
    updateField(field, arr.includes(item) ? arr.filter(i => i !== item) : [...arr, item]);
  };

  const addSkill = () => {
    const s = skillInput.trim();
    if (s && form.technical_skills.length < 10 && !form.technical_skills.includes(s)) {
      updateField("technical_skills", [...form.technical_skills, s]);
      setSkillInput("");
    }
  };

  const removeSkill = (skill: string) => {
    updateField("technical_skills", form.technical_skills.filter(s => s !== skill));
  };

  // Validation per step
  const validateStep = (s: number): boolean => {
    const errs: Record<string, string> = {};
    if (s === 1) {
      if (!form.full_name.trim()) errs.full_name = "Name is required";
      if (!form.country) errs.country = "Country is required";
      if (!form.city.trim()) errs.city = "City is required";
    }
    if (s === 2) {
      if (form.roles_applied.length === 0) errs.roles_applied = "Select at least one role";
    }
    if (s === 4) {
      if (form.loom_video_url && !form.loom_video_url.includes("loom.com")) errs.loom_video_url = "Must be a valid Loom URL";
    }
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const goNext = () => {
    if (validateStep(step)) setStep(s => s + 1);
  };

  // Auto-save draft on step change
  useEffect(() => {
    if (!user || loadingProfile || step === 1) return;
    const timer = setTimeout(() => {
      supabase.from("candidate_profiles").upsert({
        user_id: user.id,
        full_name: form.full_name || "Draft",
        country: form.country || "Unknown",
        city: form.city || "Unknown",
        roles_applied: form.roles_applied,
        linkedin_url: form.linkedin_url || null,
        portfolio_url: form.portfolio_url || null,
        profile_photo_url: form.profile_photo_url || null,
        years_experience: form.years_experience || null,
        seniority_level: form.seniority_level || null,
        employment_status: form.employment_status || null,
        availability: form.availability || null,
        expected_rate_usd: form.expected_rate_usd ? parseInt(form.expected_rate_usd) : null,
        work_type_preference: form.work_type_preference || null,
        technical_skills: form.technical_skills,
        bio: form.bio || null,
        proud_achievement: form.proud_achievement || null,
        industries: form.industries,
        resume_url: form.resume_url || null,
        loom_video_url: form.loom_video_url || null,
        portfolio_link: form.portfolio_link || null,
        english_proficiency: form.english_proficiency || null,
        onboarding_completed: false,
      }, { onConflict: "user_id" });
    }, 1000);
    return () => clearTimeout(timer);
  }, [step]);

  const handlePhotoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !user) return;
    if (file.size > 2 * 1024 * 1024) { toast({ title: "Max 2MB for photos", variant: "destructive" }); return; }
    const path = `${user.id}/photo.${file.name.split('.').pop()}`;
    const { error } = await supabase.storage.from("profile-photos").upload(path, file, { upsert: true });
    if (error) { toast({ title: "Upload failed", description: error.message, variant: "destructive" }); return; }
    const { data: { publicUrl } } = supabase.storage.from("profile-photos").getPublicUrl(path);
    updateField("profile_photo_url", publicUrl);
    toast({ title: "Photo uploaded!" });
  };

  const handleResumeUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !user) return;
    if (file.type !== "application/pdf") { toast({ title: "PDF files only", variant: "destructive" }); return; }
    if (file.size > 5 * 1024 * 1024) { toast({ title: "Max 5MB", variant: "destructive" }); return; }
    const path = `${user.id}/resume.pdf`;
    const { error } = await supabase.storage.from("resumes").upload(path, file, { upsert: true });
    if (error) { toast({ title: "Upload failed", description: error.message, variant: "destructive" }); return; }
    updateField("resume_url", path);
    toast({ title: "Resume uploaded!" });
  };

  const handleSubmit = async () => {
    if (!user || !form.confirmed) return;
    setLoading(true);
    const { error } = await supabase.from("candidate_profiles").upsert({
      user_id: user.id,
      full_name: form.full_name,
      country: form.country,
      city: form.city,
      linkedin_url: form.linkedin_url || null,
      portfolio_url: form.portfolio_url || null,
      profile_photo_url: form.profile_photo_url || null,
      roles_applied: form.roles_applied,
      years_experience: form.years_experience || null,
      seniority_level: form.seniority_level || null,
      employment_status: form.employment_status || null,
      availability: form.availability || null,
      expected_rate_usd: form.expected_rate_usd ? parseInt(form.expected_rate_usd) : null,
      work_type_preference: form.work_type_preference || null,
      technical_skills: form.technical_skills,
      bio: form.bio || null,
      proud_achievement: form.proud_achievement || null,
      industries: form.industries,
      resume_url: form.resume_url || null,
      loom_video_url: form.loom_video_url || null,
      portfolio_link: form.portfolio_link || null,
      english_proficiency: form.english_proficiency || null,
      onboarding_completed: true,
      status: "pending_review",
    }, { onConflict: "user_id" });
    setLoading(false);
    if (error) {
      toast({ title: "Error saving profile", description: error.message, variant: "destructive" });
    } else {
      toast({ title: "Application submitted!", description: "Our team reviews every submission. We'll reach out within 3–5 business days." });
      navigate("/talent/dashboard");
    }
  };

  const inputClass = "w-full bg-background border border-border rounded px-4 py-3.5 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary transition-colors";
  const labelClass = "text-xs font-mono text-muted-foreground uppercase tracking-wider mb-1 block";
  const errorClass = "text-xs text-destructive mt-1";

  const stepComplete = (s: number) => {
    if (s === 1) return !!form.full_name && !!form.country && !!form.city;
    if (s === 2) return form.roles_applied.length > 0;
    if (s === 3) return form.technical_skills.length > 0;
    if (s === 4) return !!form.resume_url || !!form.loom_video_url;
    return false;
  };

  if (loadingProfile) {
    return (
      <PageLayout>
        <div className="flex items-center justify-center py-24">
          <div className="text-muted-foreground font-mono text-sm">Loading profile...</div>
        </div>
      </PageLayout>
    );
  }

  return (
    <PageLayout>
      <section className="py-12">
        <div className="container mx-auto px-4 max-w-2xl">
          {/* Step indicators */}
          <div className="mb-8">
            <div className="flex items-center justify-between mb-4">
              {STEP_LABELS.map((label, i) => (
                <button
                  key={label}
                  onClick={() => { if (i + 1 < step) setStep(i + 1); }}
                  className={`flex items-center gap-2 text-xs font-mono transition-colors ${
                    i + 1 === step ? "text-primary" : i + 1 < step ? "text-foreground cursor-pointer hover:text-primary" : "text-muted-foreground"
                  }`}
                >
                  <div className={`w-7 h-7 rounded-full flex items-center justify-center text-[10px] font-bold shrink-0 ${
                    i + 1 < step ? "bg-primary text-primary-foreground" :
                    i + 1 === step ? "border-2 border-primary text-primary" :
                    "border border-border text-muted-foreground"
                  }`}>
                    {i + 1 < step ? <CheckCircle2 size={14} /> : i + 1}
                  </div>
                  <span className="hidden sm:inline">{label}</span>
                </button>
              ))}
            </div>
            <Progress value={(step / TOTAL_STEPS) * 100} className="h-1.5" />
            <div className="flex justify-between mt-1">
              <span className="font-mono text-[10px] text-muted-foreground">Step {step} of {TOTAL_STEPS}</span>
              <span className="font-mono text-[10px] text-primary">{Math.round((step / TOTAL_STEPS) * 100)}%</span>
            </div>
          </div>

          <div className="card-surface p-8">
            {/* Step 1: Personal Info */}
            {step === 1 && (
              <div className="space-y-4">
                <h2 className="font-display text-2xl mb-4">PERSONAL INFO</h2>
                <p className="text-sm text-muted-foreground mb-2">Start with the basics so we know who you are.</p>
                <div>
                  <label className={labelClass}>Full Name *</label>
                  <input value={form.full_name} onChange={e => updateField("full_name", e.target.value)} placeholder="Your full name" className={`${inputClass} ${errors.full_name ? 'border-destructive' : ''}`} />
                  {errors.full_name && <p className={errorClass}>{errors.full_name}</p>}
                </div>
                <div>
                  <label className={labelClass}>Country *</label>
                  <select value={form.country} onChange={e => updateField("country", e.target.value)} className={`${inputClass} ${errors.country ? 'border-destructive' : ''}`}>
                    <option value="">Select country...</option>
                    {LATAM_COUNTRIES.map(c => <option key={c} value={c}>{c}</option>)}
                  </select>
                  {errors.country && <p className={errorClass}>{errors.country}</p>}
                </div>
                <div>
                  <label className={labelClass}>City *</label>
                  <input value={form.city} onChange={e => updateField("city", e.target.value)} placeholder="Your city" className={`${inputClass} ${errors.city ? 'border-destructive' : ''}`} />
                  {errors.city && <p className={errorClass}>{errors.city}</p>}
                </div>
                <div>
                  <label className={labelClass}>LinkedIn URL</label>
                  <input value={form.linkedin_url} onChange={e => updateField("linkedin_url", e.target.value)} placeholder="https://linkedin.com/in/..." className={inputClass} />
                </div>
                <div>
                  <label className={labelClass}>Portfolio / Website</label>
                  <input value={form.portfolio_url} onChange={e => updateField("portfolio_url", e.target.value)} placeholder="https://..." className={inputClass} />
                </div>
                <div>
                  <label className={labelClass}>Profile Photo</label>
                  <div className="flex items-center gap-4">
                    {form.profile_photo_url ? (
                      <img src={form.profile_photo_url} alt="Preview" className="avatar-md" style={{ width: '56px', height: '56px' }} />
                    ) : (
                      <div className="avatar-initials-md" style={{ width: '56px', height: '56px', fontSize: '18px' }}>
                        {form.full_name ? form.full_name.split(" ").map(n => n.charAt(0)).join("").slice(0, 2) : "?"}
                      </div>
                    )}
                    <div className="flex-1">
                      <input type="file" accept="image/*" onChange={handlePhotoUpload} className={inputClass} />
                      <p className="text-[10px] text-muted-foreground mt-1">JPG or PNG, max 2MB</p>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Step 2: Professional Identity */}
            {step === 2 && (
              <div className="space-y-4">
                <h2 className="font-display text-2xl mb-4">PROFESSIONAL IDENTITY</h2>
                <p className="text-sm text-muted-foreground mb-2">Tell us about your experience and what you're looking for.</p>
                <div>
                  <label className={labelClass}>Role(s) applying for *</label>
                  <div className="flex flex-wrap gap-2">
                    {ROLE_OPTIONS.map(role => (
                      <button key={role} type="button" onClick={() => toggleArrayItem("roles_applied", role)}
                        className={`text-xs px-3 py-1.5 rounded-full border transition-colors ${
                          form.roles_applied.includes(role) ? "border-primary text-primary bg-primary/10" : "border-border text-muted-foreground hover:border-foreground"
                        }`}>
                        {role}
                      </button>
                    ))}
                  </div>
                  {errors.roles_applied && <p className={errorClass}>{errors.roles_applied}</p>}
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className={labelClass}>Years of Experience</label>
                    <select value={form.years_experience} onChange={e => updateField("years_experience", e.target.value)} className={inputClass}>
                      <option value="">Select...</option>
                      <option value="1-3">1–3 years</option>
                      <option value="4-6">4–6 years</option>
                      <option value="7-10">7–10 years</option>
                      <option value="10+">10+ years</option>
                    </select>
                  </div>
                  <div>
                    <label className={labelClass}>Seniority Level</label>
                    <select value={form.seniority_level} onChange={e => updateField("seniority_level", e.target.value)} className={inputClass}>
                      <option value="">Select...</option>
                      <option value="Mid">Mid</option>
                      <option value="Senior">Senior</option>
                      <option value="Lead/Principal">Lead / Principal</option>
                    </select>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className={labelClass}>Employment Status</label>
                    <select value={form.employment_status} onChange={e => updateField("employment_status", e.target.value)} className={inputClass}>
                      <option value="">Select...</option>
                      <option value="Employed">Employed</option>
                      <option value="Freelancing">Freelancing</option>
                      <option value="Open to work">Open to work</option>
                      <option value="Between roles">Between roles</option>
                    </select>
                  </div>
                  <div>
                    <label className={labelClass}>Availability</label>
                    <select value={form.availability} onChange={e => updateField("availability", e.target.value)} className={inputClass}>
                      <option value="">Select...</option>
                      <option value="Immediate">Immediate</option>
                      <option value="2 weeks">2 weeks</option>
                      <option value="1 month">1 month</option>
                      <option value="Just exploring">Just exploring</option>
                    </select>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className={labelClass}>Expected Rate (USD/mo)</label>
                    <input type="number" value={form.expected_rate_usd} onChange={e => updateField("expected_rate_usd", e.target.value)} placeholder="3000" className={inputClass} />
                  </div>
                  <div>
                    <label className={labelClass}>Work Type</label>
                    <select value={form.work_type_preference} onChange={e => updateField("work_type_preference", e.target.value)} className={inputClass}>
                      <option value="">Select...</option>
                      <option value="Full-time">Full-time</option>
                      <option value="Part-time">Part-time</option>
                      <option value="Contract">Contract</option>
                      <option value="Any">Any</option>
                    </select>
                  </div>
                </div>
              </div>
            )}

            {/* Step 3: Skills & Experience */}
            {step === 3 && (
              <div className="space-y-4">
                <h2 className="font-display text-2xl mb-4">SKILLS & EXPERIENCE</h2>
                <p className="text-sm text-muted-foreground mb-2">Highlight what makes you stand out.</p>
                <div>
                  <label className={labelClass}>Top Technical Skills (max 10)</label>
                  <div className="flex gap-2 mb-2">
                    <input value={skillInput} onChange={e => setSkillInput(e.target.value)}
                      onKeyDown={e => e.key === "Enter" && (e.preventDefault(), addSkill())}
                      placeholder="Type a skill and press Enter" className={`${inputClass} flex-1`} />
                    <Button type="button" onClick={addSkill} variant="outline" size="sm">Add</Button>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {form.technical_skills.map(s => (
                      <span key={s} className="text-xs px-3 py-1.5 rounded-full border border-primary text-primary flex items-center gap-1">
                        {s} <button onClick={() => removeSkill(s)} className="text-primary/60 hover:text-primary">×</button>
                      </span>
                    ))}
                  </div>
                  <p className="text-[10px] text-muted-foreground mt-1">{form.technical_skills.length}/10 skills added</p>
                </div>
                <div>
                  <label className={labelClass}>Professional Summary (max 400 chars)</label>
                  <textarea value={form.bio} onChange={e => updateField("bio", e.target.value.slice(0, 400))} rows={4} placeholder="Tell us about yourself..." className={inputClass} />
                  <span className="text-[10px] text-muted-foreground">{form.bio.length}/400</span>
                </div>
                <div>
                  <label className={labelClass}>Proudest Achievement (max 300 chars)</label>
                  <textarea value={form.proud_achievement} onChange={e => updateField("proud_achievement", e.target.value.slice(0, 300))} rows={3} placeholder="What's one thing you've shipped or led?" className={inputClass} />
                  <span className="text-[10px] text-muted-foreground">{form.proud_achievement.length}/300</span>
                </div>
                <div>
                  <label className={labelClass}>Industries</label>
                  <div className="flex flex-wrap gap-2">
                    {INDUSTRIES.map(ind => (
                      <button key={ind} type="button" onClick={() => toggleArrayItem("industries", ind)}
                        className={`text-xs px-3 py-1.5 rounded-full border transition-colors ${
                          form.industries.includes(ind) ? "border-primary text-primary bg-primary/10" : "border-border text-muted-foreground hover:border-foreground"
                        }`}>
                        {ind}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* Step 4: Screening Materials */}
            {step === 4 && (
              <div className="space-y-4">
                <h2 className="font-display text-2xl mb-4">SCREENING MATERIALS</h2>
                <p className="text-sm text-muted-foreground mb-2">Upload your resume and record a short intro video.</p>
                <div>
                  <label className={labelClass}>Resume (PDF, max 5MB)</label>
                  <input type="file" accept=".pdf" onChange={handleResumeUpload} className={inputClass} />
                  {form.resume_url && <p className="text-xs text-primary mt-1 flex items-center gap-1"><CheckCircle2 size={12} /> Resume uploaded</p>}
                </div>
                <div>
                  <label className={labelClass}>Loom Video Introduction</label>
                  <p className="text-xs text-muted-foreground mb-2">Record a 2–3 min intro. Tell us who you are and what you do best. <a href="https://loom.com/record" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">🎥 Record on Loom</a></p>
                  <input value={form.loom_video_url} onChange={e => updateField("loom_video_url", e.target.value)} placeholder="https://www.loom.com/share/..." className={`${inputClass} ${errors.loom_video_url ? 'border-destructive' : ''}`} />
                  {errors.loom_video_url && <p className={errorClass}>{errors.loom_video_url}</p>}
                </div>
                <div>
                  <label className={labelClass}>GitHub / Behance / Dribbble (optional)</label>
                  <input value={form.portfolio_link} onChange={e => updateField("portfolio_link", e.target.value)} placeholder="https://github.com/..." className={inputClass} />
                </div>
                <div>
                  <label className={labelClass}>English Proficiency</label>
                  <select value={form.english_proficiency} onChange={e => updateField("english_proficiency", e.target.value)} className={inputClass}>
                    <option value="">Select...</option>
                    <option value="B1">B1 — Intermediate</option>
                    <option value="B2">B2 — Upper Intermediate</option>
                    <option value="C1">C1 — Advanced</option>
                    <option value="Native">Native / Near-native</option>
                  </select>
                  <p className="text-[10px] text-muted-foreground mt-1">We verify this during our screening call</p>
                </div>
              </div>
            )}

            {/* Step 5: Review & Submit */}
            {step === 5 && (
              <div className="space-y-6">
                <h2 className="font-display text-2xl mb-4">REVIEW & SUBMIT</h2>
                <p className="text-sm text-muted-foreground mb-2">Double-check everything before submitting. You can always edit later.</p>
                <div className="space-y-3 text-sm">
                  {[
                    ["Name", form.full_name],
                    ["Location", `${form.city}, ${form.country}`],
                    ["Roles", form.roles_applied.join(", ")],
                    ["Experience", `${form.years_experience} · ${form.seniority_level}`],
                    ["Rate", form.expected_rate_usd ? `$${form.expected_rate_usd}/mo` : "—"],
                    ["Skills", form.technical_skills.join(", ") || "—"],
                    ["English", form.english_proficiency || "—"],
                    ["Resume", form.resume_url ? "✓ Uploaded" : "Not uploaded"],
                    ["Loom", form.loom_video_url ? "✓ Provided" : "Not provided"],
                  ].map(([label, value]) => (
                    <div key={label} className="flex justify-between py-2 border-b border-border">
                      <span className="text-muted-foreground">{label}</span>
                      <span className="text-right max-w-[60%] truncate">{value}</span>
                    </div>
                  ))}
                </div>
                {form.bio && (
                  <div className="card-surface p-4 mt-4">
                    <p className="text-[10px] font-mono text-muted-foreground uppercase tracking-wider mb-1">Bio</p>
                    <p className="text-sm text-foreground/80">{form.bio}</p>
                  </div>
                )}
                <label className="flex items-center gap-3 cursor-pointer mt-4">
                  <input type="checkbox" checked={form.confirmed} onChange={e => updateField("confirmed", e.target.checked)}
                    className="w-4 h-4 rounded border-border accent-primary" />
                  <span className="text-sm text-foreground">I confirm all information is accurate</span>
                </label>
              </div>
            )}

            {/* Navigation */}
            <div className="flex justify-between mt-8 pt-6 border-t border-border">
              {step > 1 ? (
                <Button variant="outline" onClick={() => setStep(s => s - 1)}>Back</Button>
              ) : <div />}
              {step < TOTAL_STEPS ? (
                <Button onClick={goNext} className="bg-primary text-primary-foreground font-bold">
                  Next →
                </Button>
              ) : (
                <Button onClick={handleSubmit} disabled={loading || !form.confirmed} className="bg-primary text-primary-foreground font-bold">
                  {loading ? "Submitting..." : "Submit My Application"}
                </Button>
              )}
            </div>
          </div>

          {/* Auto-save indicator */}
          {step > 1 && step < 5 && (
            <p className="text-center text-[10px] text-muted-foreground mt-3 font-mono">Progress auto-saved as draft</p>
          )}
        </div>
      </section>
    </PageLayout>
  );
};

export default CandidateProfileEdit;
