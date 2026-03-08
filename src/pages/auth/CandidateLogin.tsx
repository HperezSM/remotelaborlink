import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { signIn } from "@/lib/auth";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";
import PageLayout from "@/components/PageLayout";

const CandidateLogin = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    const { data, error } = await signIn(email, password);
    setLoading(false);

    if (error) {
      if (error.message?.toLowerCase().includes("email not confirmed")) {
        toast({
          title: "Email not verified",
          description: "Please verify your email before logging in.",
          variant: "destructive",
          action: (
            <button
              className="text-xs text-primary underline whitespace-nowrap"
              onClick={async () => {
                await supabase.auth.resend({ type: "signup", email });
                toast({ title: "Verification email resent" });
              }}
            >
              Resend
            </button>
          ),
        });
      } else {
        toast({ title: "Login failed", description: "Incorrect email or password", variant: "destructive" });
      }
    } else {
      navigate("/talent/dashboard");
    }
  };

  const inputClass = "w-full bg-background border border-border rounded px-4 py-3.5 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary";

  return (
    <PageLayout>
      <section className="py-20 md:py-28">
        <div className="container mx-auto px-4 max-w-md">
          <div className="text-center mb-8">
            <span className="section-tag">Welcome Back</span>
            <h1 className="font-display text-4xl md:text-5xl">TALENT LOGIN</h1>
          </div>
          <div className="card-surface p-8">
            <form className="space-y-4" onSubmit={handleSubmit}>
              <div>
                <label className="text-xs font-mono text-muted-foreground uppercase tracking-wider mb-1 block">Email</label>
                <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="you@email.com" required className={inputClass} />
              </div>
              <div>
                <label className="text-xs font-mono text-muted-foreground uppercase tracking-wider mb-1 block">Password</label>
                <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="••••••••" required className={inputClass} />
              </div>
              <Button type="submit" disabled={loading} className="w-full bg-primary text-primary-foreground font-bold py-3.5 hover:opacity-90">
                {loading ? "Logging in..." : "Log In"}
              </Button>
            </form>
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
