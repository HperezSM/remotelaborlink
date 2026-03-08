import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";
import PageLayout from "@/components/PageLayout";

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

const CandidateProfileEdit = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [skillInput, setSkillInput] = useState("");

  const [form, setForm] = useState({
    full_name: "", country: "", city: "", linkedin_url: "", portfolio_url: "", profile_photo_url: "",
    roles_applied: [] as string[], years_experience: "", seniority_level: "", employment_status: "",
    availability: "", expected_rate_usd: "", work_type_preference: "",
    technical_skills: [] as string[], bio: "", proud_achievement: "", industries: [] as string[],
    resume_url: "", loom_video_url: "", portfolio_link: "", english_proficiency: "",
    confirmed: false,
  });

  const updateField = (field: string, value: any) => setForm(f => ({ ...f, [field]: value }));

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

  const handlePhotoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !user) return;
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
      toast({ title: "Application submitted!", description: "Our team reviews every submission. If you clear initial screening, we'll reach out within 3–5 business days." });
      navigate("/talent/dashboard");
    }
  };

  const inputClass = "w-full bg-background border border-border rounded px-4 py-3.5 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary";
  const labelClass = "text-xs font-mono text-muted-foreground uppercase tracking-wider mb-1 block";

  return (
    <PageLayout>
      <section className="py-12">
        <div className="container mx-auto px-4 max-w-2xl">
          {/* Progress */}
          <div className="mb-8">
            <div className="flex items-center justify-between mb-2">
              <span className="font-mono text-xs text-muted-foreground">Step {step} of {TOTAL_STEPS}</span>
              <span className="font-mono text-xs text-primary">{Math.round((step / TOTAL_STEPS) * 100)}%</span>
            </div>
            <Progress value={(step / TOTAL_STEPS) * 100} className="h-2" />
          </div>

          <div className="card-surface p-8">
            {/* Step 1: Personal Info */}
            {step === 1 && (
              <div className="space-y-4">
                <h2 className="font-display text-2xl mb-4">PERSONAL INFO</h2>
                <div>
                  <label className={labelClass}>Full Name *</label>
                  <input value={form.full_name} onChange={e => updateField("full_name", e.target.value)} placeholder="Your full name" required className={inputClass} />
                </div>
                <div>
                  <label className={labelClass}>Country *</label>
                  <select value={form.country} onChange={e => updateField("country", e.target.value)} className={inputClass}>
                    <option value="">Select country...</option>
                    {LATAM_COUNTRIES.map(c => <option key={c} value={c}>{c}</option>)}
                  </select>
                </div>
                <div>
                  <label className={labelClass}>City *</label>
                  <input value={form.city} onChange={e => updateField("city", e.target.value)} placeholder="Your city" required className={inputClass} />
                </div>
                <div>
                  <label className={labelClass}>LinkedIn URL</label>
                  <input value={form.linkedin_url} onChange={e => updateField("linkedin_url", e.target.value)} placeholder="https://linkedin.com/in/..." className={inputClass} />
                </div>
                <div>
                  <label className={labelClass}>Portfolio / Website (optional)</label>
                  <input value={form.portfolio_url} onChange={e => updateField("portfolio_url", e.target.value)} placeholder="https://..." className={inputClass} />
                </div>
                <div>
                  <label className={labelClass}>Profile Photo *</label>
                  <input type="file" accept="image/*" onChange={handlePhotoUpload} className={inputClass} />
                  {form.profile_photo_url && <img src={form.profile_photo_url} alt="Preview" className="w-16 h-16 rounded-full mt-2 object-cover" />}
                </div>
              </div>
            )}

            {/* Step 2: Professional Identity */}
            {step === 2 && (
              <div className="space-y-4">
                <h2 className="font-display text-2xl mb-4">PROFESSIONAL IDENTITY</h2>
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
                </div>
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
                <div>
                  <label className={labelClass}>Current Employment Status</label>
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
                <div>
                  <label className={labelClass}>Expected Monthly Rate (USD)</label>
                  <input type="number" value={form.expected_rate_usd} onChange={e => updateField("expected_rate_usd", e.target.value)} placeholder="3000" className={inputClass} />
                </div>
                <div>
                  <label className={labelClass}>Work Type Preference</label>
                  <select value={form.work_type_preference} onChange={e => updateField("work_type_preference", e.target.value)} className={inputClass}>
                    <option value="">Select...</option>
                    <option value="Full-time">Full-time</option>
                    <option value="Part-time">Part-time</option>
                    <option value="Contract">Contract</option>
                    <option value="Any">Any</option>
                  </select>
                </div>
              </div>
            )}

            {/* Step 3: Skills & Experience */}
            {step === 3 && (
              <div className="space-y-4">
                <h2 className="font-display text-2xl mb-4">SKILLS & EXPERIENCE</h2>
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
                </div>
                <div>
                  <label className={labelClass}>Professional Summary (max 400 chars)</label>
                  <textarea value={form.bio} onChange={e => updateField("bio", e.target.value.slice(0, 400))} rows={4} placeholder="Tell us about yourself..." className={inputClass} />
                  <span className="text-xs text-muted-foreground">{form.bio.length}/400</span>
                </div>
                <div>
                  <label className={labelClass}>What's one thing you've shipped or led that you're proud of? (max 300 chars)</label>
                  <textarea value={form.proud_achievement} onChange={e => updateField("proud_achievement", e.target.value.slice(0, 300))} rows={3} placeholder="Your proudest achievement..." className={inputClass} />
                  <span className="text-xs text-muted-foreground">{form.proud_achievement.length}/300</span>
                </div>
                <div>
                  <label className={labelClass}>Industries Worked In</label>
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
                <div>
                  <label className={labelClass}>Resume (PDF, max 5MB) *</label>
                  <input type="file" accept=".pdf" onChange={handleResumeUpload} className={inputClass} />
                  {form.resume_url && <p className="text-xs text-primary mt-1">✓ Resume uploaded</p>}
                </div>
                <div>
                  <label className={labelClass}>Loom Video Introduction *</label>
                  <p className="text-xs text-muted-foreground mb-2">Record a 2–3 min Loom intro. Tell us who you are, what you do best, and what you're looking for. <a href="https://loom.com/record" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">🎥 Record on Loom</a></p>
                  <input value={form.loom_video_url} onChange={e => updateField("loom_video_url", e.target.value)} placeholder="https://www.loom.com/share/..." className={inputClass} />
                </div>
                <div>
                  <label className={labelClass}>GitHub / Behance / Dribbble Link (optional)</label>
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
                  <p className="text-xs text-muted-foreground mt-1">We verify this during our screening call</p>
                </div>
              </div>
            )}

            {/* Step 5: Review & Submit */}
            {step === 5 && (
              <div className="space-y-6">
                <h2 className="font-display text-2xl mb-4">REVIEW & SUBMIT</h2>
                <div className="space-y-3 text-sm">
                  <div className="flex justify-between py-2 border-b border-border"><span className="text-muted-foreground">Name</span><span>{form.full_name}</span></div>
                  <div className="flex justify-between py-2 border-b border-border"><span className="text-muted-foreground">Location</span><span>{form.city}, {form.country}</span></div>
                  <div className="flex justify-between py-2 border-b border-border"><span className="text-muted-foreground">Roles</span><span>{form.roles_applied.join(", ")}</span></div>
                  <div className="flex justify-between py-2 border-b border-border"><span className="text-muted-foreground">Experience</span><span>{form.years_experience} · {form.seniority_level}</span></div>
                  <div className="flex justify-between py-2 border-b border-border"><span className="text-muted-foreground">Rate</span><span>${form.expected_rate_usd}/mo</span></div>
                  <div className="flex justify-between py-2 border-b border-border"><span className="text-muted-foreground">Skills</span><span>{form.technical_skills.join(", ")}</span></div>
                  <div className="flex justify-between py-2 border-b border-border"><span className="text-muted-foreground">English</span><span>{form.english_proficiency}</span></div>
                  <div className="flex justify-between py-2 border-b border-border"><span className="text-muted-foreground">Resume</span><span>{form.resume_url ? "✓ Uploaded" : "Not uploaded"}</span></div>
                  <div className="flex justify-between py-2 border-b border-border"><span className="text-muted-foreground">Loom</span><span>{form.loom_video_url ? "✓ Provided" : "Not provided"}</span></div>
                </div>
                <label className="flex items-center gap-3 cursor-pointer">
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
                <Button onClick={() => setStep(s => s + 1)} className="bg-primary text-primary-foreground font-bold">Next</Button>
              ) : (
                <Button onClick={handleSubmit} disabled={loading || !form.confirmed} className="bg-primary text-primary-foreground font-bold">
                  {loading ? "Submitting..." : "Submit My Application"}
                </Button>
              )}
            </div>
          </div>
        </div>
      </section>
    </PageLayout>
  );
};

export default CandidateProfileEdit;
