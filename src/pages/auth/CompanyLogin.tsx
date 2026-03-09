import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { signIn } from "@/lib/auth";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";
import PageLayout from "@/components/PageLayout";
import { isLockedOut, recordFailedAttempt, resetAttempts, formatLockoutTime } from "@/lib/loginLockout";
import GoogleSSOButton from "@/components/GoogleSSOButton";

const CompanyLogin = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [lockoutRemaining, setLockoutRemaining] = useState(0);
  const navigate = useNavigate();

  useEffect(() => {
    if (lockoutRemaining <= 0) return;
    const t = setInterval(() => {
      if (email) {
        const { locked, remainingMs } = isLockedOut(email);
        if (!locked) setLockoutRemaining(0);
        else setLockoutRemaining(remainingMs);
      }
    }, 1000);
    return () => clearInterval(t);
  }, [lockoutRemaining, email]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const lockout = isLockedOut(email);
    if (lockout.locked) {
      setLockoutRemaining(lockout.remainingMs);
      toast({
        title: "Account temporarily locked",
        description: `Try again in ${formatLockoutTime(lockout.remainingMs)}.`,
        variant: "destructive",
      });
      return;
    }

    setLoading(true);
    const { data, error } = await signIn(email, password);
    setLoading(false);

    if (error) {
      const result = recordFailedAttempt(email);
      if (result.locked) {
        setLockoutRemaining(result.remainingMs);
        toast({
          title: "Too many failed attempts",
          description: "Try again in 15 minutes or reset your password.",
          variant: "destructive",
        });
      } else {
        toast({
          title: "Login failed",
          description: `Incorrect email or password. ${result.attemptsRemaining} attempt${result.attemptsRemaining === 1 ? "" : "s"} remaining.`,
          variant: "destructive",
        });
      }
      return;
    }

    resetAttempts(email);

    // Check company status
    const { data: company } = await supabase
      .from("companies")
      .select("status")
      .eq("user_id", data.user.id)
      .single();

    if (company?.status === "pending") {
      await supabase.auth.signOut();
      toast({
        title: "Account pending review",
        description: "Your account is pending review. We'll notify you once it's approved.",
        variant: "destructive",
      });
      return;
    }

    if (company?.status === "suspended") {
      await supabase.auth.signOut();
      toast({
        title: "Account suspended",
        description: "Your account has been suspended. Contact team@remotelaborlink.com",
        variant: "destructive",
      });
      return;
    }

    navigate("/company/dashboard");
  };

  const inputClass = "w-full bg-background border border-border rounded px-4 py-3.5 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary";
  const isLocked = lockoutRemaining > 0;

  return (
    <PageLayout>
      <section className="py-20 md:py-28">
        <div className="container mx-auto px-4 max-w-md">
          <div className="text-center mb-8">
            <span className="section-tag">Client Access</span>
            <h1 className="font-display text-4xl md:text-5xl">CLIENT PORTAL</h1>
            <p className="mt-3 text-sm text-muted-foreground">Secure access for engaged clients only.</p>
          </div>
          <div className="card-surface p-8">
            {isLocked && (
              <div className="mb-4 p-3 rounded bg-destructive/10 text-destructive text-xs text-center font-mono">
                Account temporarily locked. Try again in {formatLockoutTime(lockoutRemaining)}.
              </div>
            )}
            <form className="space-y-4" onSubmit={handleSubmit}>
              <div>
                <label className="text-xs font-mono text-muted-foreground uppercase tracking-wider mb-1 block">Company Email</label>
                <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="you@company.com" required className={inputClass} />
              </div>
              <div>
                <label className="text-xs font-mono text-muted-foreground uppercase tracking-wider mb-1 block">Password</label>
                <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="••••••••" required className={inputClass} />
              </div>
              <label className="flex items-center gap-2 text-xs text-muted-foreground cursor-pointer">
                <input type="checkbox" checked={rememberMe} onChange={(e) => setRememberMe(e.target.checked)} className="accent-primary" />
                <span>Remember me for 30 days</span>
              </label>
              <Button type="submit" disabled={loading || isLocked} className="w-full bg-primary text-primary-foreground font-bold py-3.5 hover:opacity-90">
                {loading ? "Logging in..." : "Log In"}
              </Button>
            </form>
            <div className="relative my-6">
              <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-border" /></div>
              <div className="relative flex justify-center text-xs"><span className="bg-card px-3 text-muted-foreground font-mono uppercase">or</span></div>
            </div>
            <GoogleSSOButton label="Sign in with Google" />
            <div className="mt-4 text-xs text-muted-foreground text-center space-y-1">
              <p>
                <Link to="/auth/forgot-password" className="text-primary hover:underline">Forgot your password?</Link>
              </p>
              <p>
                Don't have access?{" "}
                <Link to="/signup/company" className="text-primary hover:underline">Hire Talent</Link>
                {" · "}
                <Link to="/contact" className="text-primary hover:underline">Book a call</Link>
              </p>
            </div>
          </div>
        </div>
      </section>
    </PageLayout>
  );
};

export default CompanyLogin;
