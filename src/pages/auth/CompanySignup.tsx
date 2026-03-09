import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { signUpCompany, isFreeEmailDomain } from "@/lib/auth";
import { toast } from "@/hooks/use-toast";
import PageLayout from "@/components/PageLayout";
import PasswordRequirements, { isPasswordValid } from "@/components/PasswordRequirements";
import GoogleSSOButton from "@/components/GoogleSSOButton";

const companySizes = ["1–10", "11–50", "51–200", "201–500", "500+"];
const industries = ["SaaS", "Fintech", "Healthtech", "E-commerce", "Agency", "Hospitality Tech", "Cybersecurity", "Other"];
const hearSources = ["Google Search", "LinkedIn", "Referral", "Social Media", "Event/Conference", "Other"];

const CompanySignup = () => {
  const [form, setForm] = useState({
    contactName: "", companyName: "", email: "", password: "", confirmPassword: "",
    website: "", size: "", industry: "", howHeard: ""
  });
  const [termsAccepted, setTermsAccepted] = useState(false);
  const [authorizedConfirmed, setAuthorizedConfirmed] = useState(false);
  const [loading, setLoading] = useState(false);
  const [emailError, setEmailError] = useState("");
  const navigate = useNavigate();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setForm((f) => ({ ...f, [name]: value }));
    if (name === "email") {
      setEmailError(value && isFreeEmailDomain(value) ? "Please use your official company email address" : "");
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (emailError) return;
    if (!form.contactName || !form.companyName || !form.email || !form.password) return;
    if (!isPasswordValid(form.password)) {
      toast({ title: "Password does not meet requirements", variant: "destructive" });
      return;
    }
    if (form.password !== form.confirmPassword) {
      toast({ title: "Passwords don't match", variant: "destructive" });
      return;
    }
    if (!termsAccepted || !authorizedConfirmed) {
      toast({ title: "Please accept all required checkboxes", variant: "destructive" });
      return;
    }
    setLoading(true);
    const { error } = await signUpCompany(
      form.email, form.password, form.companyName, form.contactName,
      form.website, form.size, form.industry, form.howHeard
    );
    setLoading(false);
    if (error) {
      toast({ title: "Signup failed", description: (error as any).message, variant: "destructive" });
    } else {
      // No email verification — go to company pending page
      navigate("/auth/company-pending");
    }
  };

  const inputClass = "w-full bg-background border border-border rounded px-4 py-3.5 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary";
  const labelClass = "text-xs font-mono text-muted-foreground uppercase tracking-wider mb-1 block";

  return (
    <PageLayout>
      <section className="py-20 md:py-28">
        <div className="container mx-auto px-4 max-w-md">
          <div className="text-center mb-8">
            <span className="section-tag">Get Started</span>
            <h1 className="font-display text-4xl md:text-5xl">HIRE TALENT</h1>
            <p className="mt-3 text-sm text-muted-foreground">Create your company account to access pre-vetted LATAM professionals.</p>
          </div>
          <div className="card-surface p-8">
            <form className="space-y-4" onSubmit={handleSubmit}>
              <div>
                <label className={labelClass}>Contact Person Full Name *</label>
                <input name="contactName" value={form.contactName} onChange={handleChange} placeholder="Jane Smith" required className={inputClass} />
              </div>
              <div>
                <label className={labelClass}>Company Name *</label>
                <input name="companyName" value={form.companyName} onChange={handleChange} placeholder="Acme Inc." required className={inputClass} />
              </div>
              <div>
                <label className={labelClass}>Company Email *</label>
                <input name="email" type="email" value={form.email} onChange={handleChange} placeholder="you@company.com" required className={`${inputClass} ${emailError ? "border-destructive" : ""}`} />
                {emailError && <p className="text-xs text-destructive mt-1">{emailError}</p>}
              </div>
              <div>
                <label className={labelClass}>Password *</label>
                <input name="password" type="password" value={form.password} onChange={handleChange} placeholder="••••••••" required className={inputClass} />
                <PasswordRequirements password={form.password} />
              </div>
              <div>
                <label className={labelClass}>Confirm Password *</label>
                <input name="confirmPassword" type="password" value={form.confirmPassword} onChange={handleChange} placeholder="••••••••" required className={inputClass} />
                {form.confirmPassword && form.password !== form.confirmPassword && (
                  <p className="text-xs text-destructive mt-1">Passwords don't match</p>
                )}
              </div>
              <div>
                <label className={labelClass}>Company Website</label>
                <input name="website" value={form.website} onChange={handleChange} placeholder="https://company.com" className={inputClass} />
              </div>
              <div>
                <label className={labelClass}>Company Size</label>
                <select name="size" value={form.size} onChange={handleChange} className={inputClass}>
                  <option value="">Select...</option>
                  {companySizes.map((s) => <option key={s} value={s}>{s}</option>)}
                </select>
              </div>
              <div>
                <label className={labelClass}>Industry</label>
                <select name="industry" value={form.industry} onChange={handleChange} className={inputClass}>
                  <option value="">Select...</option>
                  {industries.map((i) => <option key={i} value={i}>{i}</option>)}
                </select>
              </div>
              <div>
                <label className={labelClass}>How did you hear about us?</label>
                <select name="howHeard" value={form.howHeard} onChange={handleChange} className={inputClass}>
                  <option value="">Select...</option>
                  {hearSources.map((h) => <option key={h} value={h}>{h}</option>)}
                </select>
              </div>
              <div className="space-y-3 pt-2">
                <label className="flex items-start gap-3 text-xs text-muted-foreground cursor-pointer">
                  <input type="checkbox" checked={termsAccepted} onChange={(e) => setTermsAccepted(e.target.checked)} className="mt-0.5 accent-primary" />
                  <span>
                    I agree to the{" "}
                    <Link to="/legal" className="text-primary hover:underline">Terms of Service and Privacy Policy</Link>
                  </span>
                </label>
                <label className="flex items-start gap-3 text-xs text-muted-foreground cursor-pointer">
                  <input type="checkbox" checked={authorizedConfirmed} onChange={(e) => setAuthorizedConfirmed(e.target.checked)} className="mt-0.5 accent-primary" />
                  <span>I confirm I am authorized to act on behalf of {form.companyName || "this company"}</span>
                </label>
              </div>
              <Button
                type="submit"
                disabled={loading || !!emailError || !termsAccepted || !authorizedConfirmed || !isPasswordValid(form.password)}
                className="w-full bg-primary text-primary-foreground font-bold py-3.5 hover:opacity-90"
              >
                {loading ? "Creating account..." : "Create Company Account"}
              </Button>
            </form>
            <p className="mt-4 text-xs text-muted-foreground text-center">
              Already have an account?{" "}
              <Link to="/login/company" className="text-primary hover:underline">Log in</Link>
            </p>
          </div>
        </div>
      </section>
    </PageLayout>
  );
};

export default CompanySignup;
