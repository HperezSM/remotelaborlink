import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { signIn } from "@/lib/auth";
import { toast } from "@/hooks/use-toast";
import PageLayout from "@/components/PageLayout";
import { isLockedOut, recordFailedAttempt, resetAttempts, formatLockoutTime } from "@/lib/loginLockout";

const CandidateLogin = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [lockoutRemaining, setLockoutRemaining] = useState(0);
  const navigate = useNavigate();

  // Countdown timer for lockout
  useEffect(() => {
    if (lockoutRemaining <= 0) return;
    const t = setInterval(() => {
      if (email) {
        const { locked, remainingMs } = isLockedOut(email);
        if (!locked) {
          setLockoutRemaining(0);
        } else {
          setLockoutRemaining(remainingMs);
        }
      }
    }, 1000);
    return () => clearInterval(t);
  }, [lockoutRemaining, email]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Check lockout
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
    const { error } = await signIn(email, password);
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
    } else {
      resetAttempts(email);
      navigate("/talent/dashboard");
    }
  };

  const inputClass = "w-full bg-background border border-border rounded px-4 py-3.5 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary";
  const isLocked = lockoutRemaining > 0;

  return (
    <PageLayout>
      <section className="py-20 md:py-28">
        <div className="container mx-auto px-4 max-w-md">
          <div className="text-center mb-8">
            <span className="section-tag">Welcome Back</span>
            <h1 className="font-display text-4xl md:text-5xl">TALENT LOGIN</h1>
          </div>
          <div className="card-surface p-8">
            {isLocked && (
              <div className="mb-4 p-3 rounded bg-destructive/10 text-destructive text-xs text-center font-mono">
                Account temporarily locked. Try again in {formatLockoutTime(lockoutRemaining)}.
              </div>
            )}
            <form className="space-y-4" onSubmit={handleSubmit}>
              <div>
                <label className="text-xs font-mono text-muted-foreground uppercase tracking-wider mb-1 block">Email</label>
                <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="you@email.com" required className={inputClass} />
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
                Don't have an account?{" "}
                <Link to="/signup/talent" className="text-primary hover:underline">Apply as Talent</Link>
              </p>
            </div>
          </div>
        </div>
      </section>
    </PageLayout>
  );
};

export default CandidateLogin;
