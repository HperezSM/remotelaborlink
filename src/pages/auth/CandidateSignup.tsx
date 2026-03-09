import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { signUpCandidate } from "@/lib/auth";
import { toast } from "@/hooks/use-toast";
import PageLayout from "@/components/PageLayout";
import PasswordRequirements, { isPasswordValid } from "@/components/PasswordRequirements";
import GoogleSSOButton from "@/components/GoogleSSOButton";

const CandidateSignup = () => {
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [ageConfirmed, setAgeConfirmed] = useState(false);
  const [termsAccepted, setTermsAccepted] = useState(false);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!fullName || !email || !password) return;
    if (!isPasswordValid(password)) {
      toast({ title: "Password does not meet requirements", variant: "destructive" });
      return;
    }
    if (password !== confirmPassword) {
      toast({ title: "Passwords don't match", variant: "destructive" });
      return;
    }
    if (!ageConfirmed || !termsAccepted) {
      toast({ title: "Please accept all required checkboxes", variant: "destructive" });
      return;
    }
    setLoading(true);
    const { error } = await signUpCandidate(email, password, fullName);
    setLoading(false);
    if (error) {
      toast({ title: "Signup failed", description: (error as any).message, variant: "destructive" });
    } else {
      // Go to dashboard — profile completion is encouraged but not forced
      navigate("/talent/dashboard");
    }
  };

  const inputClass = "w-full bg-background border border-border rounded px-4 py-3.5 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary";
  const labelClass = "text-xs font-mono text-muted-foreground uppercase tracking-wider mb-1 block";

  return (
    <PageLayout>
      <section className="py-20 md:py-28">
        <div className="container mx-auto px-4 max-w-md">
          <div className="text-center mb-8">
            <span className="section-tag">Join Our Network</span>
            <h1 className="font-display text-4xl md:text-5xl">APPLY AS TALENT</h1>
            <p className="mt-3 text-sm text-muted-foreground">Join the most exclusive nearshore talent network.</p>
          </div>
          <div className="card-surface p-8">
            <form className="space-y-4" onSubmit={handleSubmit}>
              <div>
                <label className={labelClass}>Full Name *</label>
                <input value={fullName} onChange={(e) => setFullName(e.target.value)} placeholder="John Doe" required className={inputClass} />
              </div>
              <div>
                <label className={labelClass}>Email *</label>
                <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="you@email.com" required className={inputClass} />
              </div>
              <div>
                <label className={labelClass}>Password *</label>
                <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="••••••••" required className={inputClass} />
                <PasswordRequirements password={password} />
              </div>
              <div>
                <label className={labelClass}>Confirm Password *</label>
                <input type="password" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} placeholder="••••••••" required className={inputClass} />
                {confirmPassword && password !== confirmPassword && (
                  <p className="text-xs text-destructive mt-1">Passwords don't match</p>
                )}
              </div>
              <div className="space-y-3 pt-2">
                <label className="flex items-start gap-3 text-xs text-muted-foreground cursor-pointer">
                  <input type="checkbox" checked={ageConfirmed} onChange={(e) => setAgeConfirmed(e.target.checked)} className="mt-0.5 accent-primary" />
                  <span>I am 18 years of age or older</span>
                </label>
                <label className="flex items-start gap-3 text-xs text-muted-foreground cursor-pointer">
                  <input type="checkbox" checked={termsAccepted} onChange={(e) => setTermsAccepted(e.target.checked)} className="mt-0.5 accent-primary" />
                  <span>
                    I agree to the{" "}
                    <Link to="/legal" className="text-primary hover:underline">Terms of Service and Privacy Policy</Link>
                  </span>
                </label>
              </div>
              <Button
                type="submit"
                disabled={loading || !ageConfirmed || !termsAccepted || !isPasswordValid(password)}
                className="w-full bg-primary text-primary-foreground font-bold py-3.5 hover:opacity-90"
              >
                {loading ? "Creating account..." : "Create My Account"}
              </Button>
            </form>
            <div className="relative my-6">
              <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-border" /></div>
              <div className="relative flex justify-center text-xs"><span className="bg-card px-3 text-muted-foreground font-mono uppercase">or</span></div>
            </div>
            <GoogleSSOButton label="Sign up with Google" />
            <p className="mt-4 text-xs text-muted-foreground text-center">
              Already have an account?{" "}
              <Link to="/login/talent" className="text-primary hover:underline">Log in</Link>
            </p>
          </div>
        </div>
      </section>
    </PageLayout>
  );
};

export default CandidateSignup;
