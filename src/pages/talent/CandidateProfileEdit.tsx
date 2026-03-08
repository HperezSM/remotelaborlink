import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";
import PageLayout from "@/components/PageLayout";
import { CheckCircle2, Upload, X, FileText } from "lucide-react";

const COUNTRIES = [
  "Guatemala", "El Salvador", "Honduras", "Nicaragua", "Costa Rica",
  "Panama", "Colombia", "Venezuela", "Ecuador", "Peru", "Other",
];

const ROLE_OPTIONS = [
  "Virtual Assistant (VA)", "Project Manager / Operations", "Software Development / Engineering",
  "Customer Success / Support", "Marketing / Growth", "Sales / Business Development",
  "Data / Analytics", "Finance / Accounting", "Other",
];

const INDUSTRIES = ["SaaS", "Fintech", "Healthtech", "E-commerce", "Agency", "Hospitality Tech", "Cybersecurity", "Other"];

const TOTAL_STEPS = 6;
const STEP_LABELS = ["Personal Info", "Professional", "Skills", "Media & Portfolio", "Screening", "Review"];

const CandidateProfileEdit = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [loadingProfile, setLoadingProfile] = useState(true);
  const [skillInput, setSkillInput] = useState("");
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [profileId, setProfileId] = useState<string | null>(null);

  // Certifications state
  const [certifications, setCertifications] = useState<any[]>([]);
  const [portfolioLinks, setPortfolioLinks] = useState<{ link_type: string; url: string; label: string }[]>([]);
  const [additionalPhotos, setAdditionalPhotos] = useState<string[]>([]);

  const [form, setForm] = useState({
    first_name: "", last_name: "", full_name: "", country: "", other_country: "", city: "",
    phone: "", linkedin_url: "", profile_photo_url: "",
    field_of_study: "", roles_applied: [] as string[], years_experience: "", seniority_level: "",
    employment_status: "", availability: "", expected_rate_usd: "", work_type_preference: "",
    english_proficiency: "", us_hours_available: "",
    technical_skills: [] as string[], bio: "", proud_achievement: "", industries: [] as string[],
    github_url: "", portfolio_url: "",
    resume_url: "", loom_video_url: "", portfolio_link: "",
    confirmed: false,
  });

  useEffect(() => {
    if (!user) return;
    const load = async () => {
      const { data } = await supabase.from("candidate_profiles").select("*").eq("user_id", user.id).single();
      if (data) {
        setProfileId(data.id);
        const names = (data.full_name || "").split(" ");
        setForm(f => ({
          ...f,
          first_name: (data as any).first_name || names[0] || "",
          last_name: (data as any).last_name || names.slice(1).join(" ") || "",
          full_name: data.full_name || "",
          country: data.country || "", city: data.city || "",
          phone: (data as any).phone || "",
          linkedin_url: data.linkedin_url || "", portfolio_url: data.portfolio_url || "",
          profile_photo_url: data.profile_photo_url || "",
          field_of_study: (data as any).field_of_study || "",
          roles_applied: data.roles_applied || [], years_experience: data.years_experience || "",
          seniority_level: data.seniority_level || "", employment_status: data.employment_status || "",
          availability: data.availability || "",
          expected_rate_usd: data.expected_rate_usd?.toString() || "",
          work_type_preference: data.work_type_preference || "",
          english_proficiency: data.english_proficiency || "",
          us_hours_available: (data as any).us_hours_available || "",
          technical_skills: data.technical_skills || [], bio: data.bio || "",
          proud_achievement: data.proud_achievement || "", industries: data.industries || [],
          github_url: (data as any).github_url || "",
          resume_url: data.resume_url || "", loom_video_url: data.loom_video_url || "",
          portfolio_link: data.portfolio_link || "",
        }));

        // Load certifications
        const { data: certs } = await supabase.from("candidate_certifications").select("*").eq("candidate_id", data.id);
        if (certs) setCertifications(certs);

        // Load portfolio links
        const { data: links } = await supabase.from("candidate_portfolio_links").select("*").eq("candidate_id", data.id);
        if (links) setPortfolioLinks(links.map((l: any) => ({ link_type: l.link_type, url: l.url, label: l.label || "" })));
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

  const validateStep = (s: number): boolean => {
    const errs: Record<string, string> = {};
    if (s === 1) {
      if (!form.first_name.trim()) errs.first_name = "First name is required";
      if (!form.last_name.trim()) errs.last_name = "Last name is required";
      if (!form.country) errs.country = "Country is required";
      if (form.country === "Other" && !form.other_country.trim()) errs.other_country = "Please specify your country";
      if (!form.city.trim()) errs.city = "City is required";
      if (!form.phone.trim()) errs.phone = "Phone number is required";
      if (!form.linkedin_url.trim()) errs.linkedin_url = "LinkedIn URL is required";
    }
    if (s === 2) {
      if (form.roles_applied.length === 0) errs.roles_applied = "Select at least one role";
      if (!form.english_proficiency) errs.english_proficiency = "English level is required";
      if (!form.expected_rate_usd) errs.expected_rate_usd = "Salary expectation is required";
      if (!form.us_hours_available) errs.us_hours_available = "Please select availability for US hours";
    }
    if (s === 5) {
      if (!form.loom_video_url.trim()) errs.loom_video_url = "Loom video is required";
      if (form.loom_video_url && !form.loom_video_url.includes("loom.com")) errs.loom_video_url = "Must be a valid Loom URL";
      if (!form.resume_url) errs.resume_url = "Resume is required";
    }
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const goNext = () => { if (validateStep(step)) setStep(s => s + 1); };

  const computeFullName = () => `${form.first_name.trim()} ${form.last_name.trim()}`.trim();

  // Auto-save draft
  useEffect(() => {
    if (!user || loadingProfile || step === 1) return;
    const timer = setTimeout(() => {
      const fullName = computeFullName();
      supabase.from("candidate_profiles").upsert({
        user_id: user.id,
        full_name: fullName || "Draft",
        first_name: form.first_name || null,
        last_name: form.last_name || null,
        country: form.country === "Other" ? form.other_country || "Other" : form.country || "Unknown",
        city: form.city || "Unknown",
        phone: form.phone || null,
        roles_applied: form.roles_applied,
        linkedin_url: form.linkedin_url || null,
        portfolio_url: form.portfolio_url || null,
        profile_photo_url: form.profile_photo_url || null,
        field_of_study: form.field_of_study || null,
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
        us_hours_available: form.us_hours_available || null,
        github_url: form.github_url || null,
        onboarding_completed: false,
      } as any, { onConflict: "user_id" });
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

  const handleAdditionalPhotoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !user || additionalPhotos.length >= 3) return;
    if (file.size > 5 * 1024 * 1024) { toast({ title: "Max 5MB per photo", variant: "destructive" }); return; }
    const path = `${user.id}/extra-${Date.now()}.${file.name.split('.').pop()}`;
    const { error } = await supabase.storage.from("candidate-photos").upload(path, file, { upsert: true });
    if (error) { toast({ title: "Upload failed", description: error.message, variant: "destructive" }); return; }
    const { data: { publicUrl } } = supabase.storage.from("candidate-photos").getPublicUrl(path);
    setAdditionalPhotos(prev => [...prev, publicUrl]);
    toast({ title: "Photo added!" });
  };

  const handleCertUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !user || !profileId || certifications.length >= 5) return;
    if (file.size > 5 * 1024 * 1024) { toast({ title: "Max 5MB", variant: "destructive" }); return; }
    const path = `${user.id}/${Date.now()}-${file.name}`;
    const { error: uploadErr } = await supabase.storage.from("certifications").upload(path, file);
    if (uploadErr) { toast({ title: "Upload failed", description: uploadErr.message, variant: "destructive" }); return; }
    const { error } = await supabase.from("candidate_certifications").insert({
      candidate_id: profileId,
      file_url: path,
      file_name: file.name,
      file_type: file.type.includes("pdf") ? "pdf" : "image",
    });
    if (error) { toast({ title: "Error saving cert", description: error.message, variant: "destructive" }); return; }
    const { data: certs } = await supabase.from("candidate_certifications").select("*").eq("candidate_id", profileId);
    if (certs) setCertifications(certs);
    toast({ title: "Certification uploaded!" });
  };

  const removeCert = async (certId: string) => {
    await supabase.from("candidate_certifications").delete().eq("id", certId);
    setCertifications(prev => prev.filter(c => c.id !== certId));
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
    const fullName = computeFullName();
    const country = form.country === "Other" ? form.other_country : form.country;
    const { error } = await supabase.from("candidate_profiles").upsert({
      user_id: user.id,
      full_name: fullName,
      first_name: form.first_name,
      last_name: form.last_name,
      country,
      city: form.city,
      phone: form.phone || null,
      linkedin_url: form.linkedin_url || null,
      portfolio_url: form.portfolio_url || null,
      profile_photo_url: form.profile_photo_url || null,
      field_of_study: form.field_of_study || null,
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
      us_hours_available: form.us_hours_available || null,
      github_url: form.github_url || null,
      onboarding_completed: true,
      status: "pending_review",
    } as any, { onConflict: "user_id" });

    // Save portfolio links
    if (profileId) {
      await supabase.from("candidate_portfolio_links").delete().eq("candidate_id", profileId);
      const linksToInsert = portfolioLinks.filter(l => l.url.trim());
      if (linksToInsert.length > 0) {
        await supabase.from("candidate_portfolio_links").insert(
          linksToInsert.map(l => ({ candidate_id: profileId, link_type: l.link_type, url: l.url, label: l.label || null }))
        );
      }
    }

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
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className={labelClass}>Full First Name (as in your ID) *</label>
                    <input value={form.first_name} onChange={e => updateField("first_name", e.target.value)} placeholder="First name" className={`${inputClass} ${errors.first_name ? 'border-destructive' : ''}`} />
                    {errors.first_name && <p className={errorClass}>{errors.first_name}</p>}
                  </div>
                  <div>
                    <label className={labelClass}>Full Last Name (as in your ID) *</label>
                    <input value={form.last_name} onChange={e => updateField("last_name", e.target.value)} placeholder="Last name" className={`${inputClass} ${errors.last_name ? 'border-destructive' : ''}`} />
                    {errors.last_name && <p className={errorClass}>{errors.last_name}</p>}
                  </div>
                </div>
                <div>
                  <label className={labelClass}>Email (preferably Gmail) *</label>
                  <input value={user?.email || ""} disabled className={`${inputClass} opacity-60`} />
                  <p className="text-[10px] text-muted-foreground mt-1">Uses your account email</p>
                </div>
                <div>
                  <label className={labelClass}>Mobile Phone Number (with area code) *</label>
                  <input value={form.phone} onChange={e => updateField("phone", e.target.value)} placeholder="+502 1234 5678" className={`${inputClass} ${errors.phone ? 'border-destructive' : ''}`} />
                  {errors.phone && <p className={errorClass}>{errors.phone}</p>}
                </div>
                <div>
                  <label className={labelClass}>LinkedIn Profile URL *</label>
                  <input value={form.linkedin_url} onChange={e => updateField("linkedin_url", e.target.value)} placeholder="https://linkedin.com/in/..." className={`${inputClass} ${errors.linkedin_url ? 'border-destructive' : ''}`} />
                  {errors.linkedin_url && <p className={errorClass}>{errors.linkedin_url}</p>}
                </div>
                <div>
                  <label className={labelClass}>Country of Residence *</label>
                  <select value={form.country} onChange={e => updateField("country", e.target.value)} className={`${inputClass} ${errors.country ? 'border-destructive' : ''}`}>
                    <option value="">Select country...</option>
                    {COUNTRIES.map(c => <option key={c} value={c}>{c}</option>)}
                  </select>
                  {errors.country && <p className={errorClass}>{errors.country}</p>}
                  {form.country === "Other" && (
                    <div className="mt-2">
                      <input value={form.other_country} onChange={e => updateField("other_country", e.target.value)} placeholder="Enter your country" className={`${inputClass} ${errors.other_country ? 'border-destructive' : ''}`} />
                      {errors.other_country && <p className={errorClass}>{errors.other_country}</p>}
                    </div>
                  )}
                </div>
                <div>
                  <label className={labelClass}>City *</label>
                  <input value={form.city} onChange={e => updateField("city", e.target.value)} placeholder="Your city" className={`${inputClass} ${errors.city ? 'border-destructive' : ''}`} />
                  {errors.city && <p className={errorClass}>{errors.city}</p>}
                </div>
                <div>
                  <label className={labelClass}>Profile Photo *</label>
                  <div className="flex items-center gap-4">
                    {form.profile_photo_url ? (
                      <img src={form.profile_photo_url} alt="Preview" className="avatar-md" style={{ width: '56px', height: '56px' }} />
                    ) : (
                      <div className="avatar-initials-md" style={{ width: '56px', height: '56px', fontSize: '18px' }}>
                        {form.first_name ? form.first_name.charAt(0) + (form.last_name?.charAt(0) || "") : "?"}
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
                  <label className={labelClass}>Field of Study / Major</label>
                  <input value={form.field_of_study} onChange={e => updateField("field_of_study", e.target.value)} placeholder="e.g. Computer Science, Business Administration" className={inputClass} />
                </div>
                <div>
                  <label className={labelClass}>Years of full-time remote work experience *</label>
                  <select value={form.years_experience} onChange={e => updateField("years_experience", e.target.value)} className={inputClass}>
                    <option value="">Select...</option>
                    <option value="Less than 1 year">Less than 1 year</option>
                    <option value="1-2 years">1–2 years</option>
                    <option value="3-5 years">3–5 years</option>
                    <option value="5-10 years">5–10 years</option>
                    <option value="10+">10+ years</option>
                  </select>
                </div>
                <div>
                  <label className={labelClass}>Current Employment Status *</label>
                  <select value={form.employment_status} onChange={e => updateField("employment_status", e.target.value)} className={inputClass}>
                    <option value="">Select...</option>
                    <option value="Employed full-time">Employed full-time</option>
                    <option value="Employed full-time & Open">Employed full-time & Open to opportunities</option>
                    <option value="Employed part-time">Employed part-time</option>
                    <option value="Freelancing">Freelancing</option>
                    <option value="Open to opportunities">Open to opportunities</option>
                    <option value="Actively seeking">Actively seeking</option>
                  </select>
                </div>
                <div>
                  <label className={labelClass}>English Level *</label>
                  <select value={form.english_proficiency} onChange={e => updateField("english_proficiency", e.target.value)} className={`${inputClass} ${errors.english_proficiency ? 'border-destructive' : ''}`}>
                    <option value="">Select...</option>
                    <option value="A1-A2">A1–A2 (Basic)</option>
                    <option value="B1">B1 (Intermediate)</option>
                    <option value="B2">B2 (Upper Intermediate)</option>
                    <option value="C1">C1 (Advanced)</option>
                    <option value="C2/Native">C2 / Native</option>
                  </select>
                  {errors.english_proficiency && <p className={errorClass}>{errors.english_proficiency}</p>}
                  <p className="text-[10px] text-muted-foreground mt-1">An English test will be required later in the process</p>
                </div>
                <div>
                  <label className={labelClass}>Role(s) Interested In *</label>
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
                <div>
                  <label className={labelClass}>Salary Expectation (USD/month) *</label>
                  <input type="number" value={form.expected_rate_usd} onChange={e => updateField("expected_rate_usd", e.target.value)} placeholder="3000" className={`${inputClass} ${errors.expected_rate_usd ? 'border-destructive' : ''}`} />
                  {errors.expected_rate_usd && <p className={errorClass}>{errors.expected_rate_usd}</p>}
                </div>
                <div>
                  <label className={labelClass}>Available for US Business Hours *</label>
                  <select value={form.us_hours_available} onChange={e => updateField("us_hours_available", e.target.value)} className={`${inputClass} ${errors.us_hours_available ? 'border-destructive' : ''}`}>
                    <option value="">Select...</option>
                    <option value="Yes">Yes (at least 2–3 hour overlap)</option>
                    <option value="No">No</option>
                    <option value="Flexible">Flexible</option>
                  </select>
                  {errors.us_hours_available && <p className={errorClass}>{errors.us_hours_available}</p>}
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

            {/* Step 4: Media & Portfolio */}
            {step === 4 && (
              <div className="space-y-4">
                <h2 className="font-display text-2xl mb-4">MAKE YOUR PROFILE STAND OUT</h2>
                <p className="text-sm text-muted-foreground mb-2">Add photos, certifications, and links to showcase your work.</p>

                {/* Additional photos */}
                <div>
                  <label className={labelClass}>Additional Photos (up to 3)</label>
                  <p className="text-xs text-muted-foreground mb-2">Add photos that show your work environment or professional presence</p>
                  <div className="flex gap-3 mb-2">
                    {additionalPhotos.map((url, i) => (
                      <div key={i} className="relative">
                        <img src={url} alt="" className="w-[160px] h-[120px] object-cover rounded-lg border border-border" />
                        <button onClick={() => setAdditionalPhotos(prev => prev.filter((_, idx) => idx !== i))}
                          className="absolute -top-2 -right-2 w-5 h-5 bg-destructive text-destructive-foreground rounded-full flex items-center justify-center text-xs">
                          <X size={10} />
                        </button>
                      </div>
                    ))}
                  </div>
                  {additionalPhotos.length < 3 && (
                    <input type="file" accept="image/*" onChange={handleAdditionalPhotoUpload} className={inputClass} />
                  )}
                  <p className="text-[10px] text-muted-foreground mt-1">JPG/PNG, max 5MB each</p>
                </div>

                {/* Certifications */}
                <div>
                  <label className={labelClass}>Certifications & Credentials (up to 5)</label>
                  <p className="text-xs text-muted-foreground mb-2">Upload certifications, diplomas, or credentials (PDF or image)</p>
                  {certifications.map(cert => (
                    <div key={cert.id} className="flex items-center gap-3 mb-2 card-surface p-3">
                      <div className="file-card-icon w-8 h-8">
                        <FileText size={14} />
                      </div>
                      <span className="text-sm flex-1 truncate">{cert.file_name}</span>
                      <button onClick={() => removeCert(cert.id)} className="text-xs text-destructive hover:underline">Remove</button>
                    </div>
                  ))}
                  {certifications.length < 5 && (
                    <input type="file" accept=".pdf,image/*" onChange={handleCertUpload} className={inputClass} />
                  )}
                </div>

                {/* GitHub */}
                <div>
                  <label className={labelClass}>GitHub</label>
                  <input value={form.github_url} onChange={e => updateField("github_url", e.target.value)} placeholder="https://github.com/username" className={inputClass} />
                </div>

                {/* Portfolio / project link */}
                <div>
                  <label className={labelClass}>Portfolio, Notion Page, or Project Showcase</label>
                  <input value={form.portfolio_url} onChange={e => updateField("portfolio_url", e.target.value)} placeholder="https://yourproject.com or Notion link" className={inputClass} />
                </div>

                {/* Additional links */}
                <div>
                  <label className={labelClass}>Other Links (Behance, Dribbble, personal site, etc.)</label>
                  {portfolioLinks.map((link, i) => (
                    <div key={i} className="flex gap-2 mb-2">
                      <input value={link.url} onChange={e => {
                        const updated = [...portfolioLinks];
                        updated[i] = { ...updated[i], url: e.target.value };
                        setPortfolioLinks(updated);
                      }} placeholder="https://..." className={`${inputClass} flex-1`} />
                      <button onClick={() => setPortfolioLinks(prev => prev.filter((_, idx) => idx !== i))}
                        className="text-destructive hover:underline text-xs px-2">Remove</button>
                    </div>
                  ))}
                  {portfolioLinks.length < 2 && (
                    <Button type="button" variant="outline" size="sm"
                      onClick={() => setPortfolioLinks(prev => [...prev, { link_type: "other", url: "", label: "" }])}>
                      + Add Link
                    </Button>
                  )}
                </div>
              </div>
            )}

            {/* Step 5: Screening Materials */}
            {step === 5 && (
              <div className="space-y-4">
                <h2 className="font-display text-2xl mb-4">SCREENING MATERIALS</h2>
                <p className="text-sm text-muted-foreground mb-2">Upload your resume and record a short intro video.</p>
                <div>
                  <label className={labelClass}>Loom Video Introduction *</label>
                  <p className="text-xs text-muted-foreground mb-2">Record a 2–3 min Loom video. Tell us who you are, what you do best, and what you're looking for. Paste the link here. <a href="https://loom.com/record" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">🎥 Record on Loom</a></p>
                  <input value={form.loom_video_url} onChange={e => updateField("loom_video_url", e.target.value)} placeholder="https://www.loom.com/share/..." className={`${inputClass} ${errors.loom_video_url ? 'border-destructive' : ''}`} />
                  {errors.loom_video_url && <p className={errorClass}>{errors.loom_video_url}</p>}
                </div>
                <div>
                  <label className={labelClass}>Resume (PDF only, max 5MB) *</label>
                  <input type="file" accept=".pdf" onChange={handleResumeUpload} className={inputClass} />
                  {form.resume_url && <p className="text-xs text-primary mt-1 flex items-center gap-1"><CheckCircle2 size={12} /> Resume uploaded</p>}
                  {errors.resume_url && <p className={errorClass}>{errors.resume_url}</p>}
                </div>
              </div>
            )}

            {/* Step 6: Review & Submit */}
            {step === 6 && (
              <div className="space-y-6">
                <h2 className="font-display text-2xl mb-4">REVIEW & SUBMIT</h2>
                <p className="text-sm text-muted-foreground mb-2">Double-check everything before submitting. You can always edit later.</p>
                <div className="space-y-3 text-sm">
                  {[
                    ["Name", computeFullName()],
                    ["Location", `${form.city}, ${form.country === "Other" ? form.other_country : form.country}`],
                    ["Phone", form.phone || "—"],
                    ["Roles", form.roles_applied.join(", ")],
                    ["Experience", form.years_experience || "—"],
                    ["Rate", form.expected_rate_usd ? `$${form.expected_rate_usd}/mo` : "—"],
                    ["Skills", form.technical_skills.join(", ") || "—"],
                    ["English", form.english_proficiency || "—"],
                    ["US Hours", form.us_hours_available || "—"],
                    ["Resume", form.resume_url ? "✓ Uploaded" : "Not uploaded"],
                    ["Loom", form.loom_video_url ? "✓ Provided" : "Not provided"],
                    ["Certifications", certifications.length > 0 ? `${certifications.length} uploaded` : "None"],
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

          {step > 1 && step < TOTAL_STEPS && (
            <p className="text-center text-[10px] text-muted-foreground mt-3 font-mono">Progress auto-saved as draft</p>
          )}
        </div>
      </section>
    </PageLayout>
  );
};

export default CandidateProfileEdit;
