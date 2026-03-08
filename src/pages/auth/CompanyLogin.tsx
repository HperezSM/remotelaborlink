import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { signIn } from "@/lib/auth";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";
import PageLayout from "@/components/PageLayout";

const CompanyLogin = () => {
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
      return;
    }

    // Check company status
    const { data: company } = await supabase
      .from("companies")
      .select("status")
      .eq("user_id", data.user.id)
      .single();

    if (company?.status === "pending") {
      await supabase.auth.signOut();
      toast({
        title: "Account under review",
        description: "Your account is pending review. We'll email you once it's approved.",
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
            <form className="space-y-4" onSubmit={handleSubmit}>
              <div>
                <label className="text-xs font-mono text-muted-foreground uppercase tracking-wider mb-1 block">Company Email</label>
                <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="you@company.com" required className={inputClass} />
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
