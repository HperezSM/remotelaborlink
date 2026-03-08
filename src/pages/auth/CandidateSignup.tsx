import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { signUpCandidate } from "@/lib/auth";
import { toast } from "@/hooks/use-toast";
import PageLayout from "@/components/PageLayout";

const CandidateSignup = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) return;
    if (password.length < 6) {
      toast({ title: "Password must be at least 6 characters", variant: "destructive" });
      return;
    }
    setLoading(true);
    const { error } = await signUpCandidate(email, password);
    setLoading(false);
    if (error) {
      toast({ title: "Signup failed", description: (error as any).message, variant: "destructive" });
    } else {
      toast({ title: "Account created!", description: "Check your email to confirm, then complete your profile." });
      navigate("/talent/profile/edit");
    }
  };

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
                <label className="text-xs font-mono text-muted-foreground uppercase tracking-wider mb-1 block">Email</label>
                <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="you@email.com" required
                  className="w-full bg-background border border-border rounded px-4 py-3.5 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary" />
              </div>
              <div>
                <label className="text-xs font-mono text-muted-foreground uppercase tracking-wider mb-1 block">Password</label>
                <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="••••••••" required minLength={6}
                  className="w-full bg-background border border-border rounded px-4 py-3.5 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary" />
              </div>
              <Button type="submit" disabled={loading} className="w-full bg-primary text-primary-foreground font-bold py-3.5 hover:opacity-90">
                {loading ? "Creating account..." : "Create Account"}
              </Button>
            </form>
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
