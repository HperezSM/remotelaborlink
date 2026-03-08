import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";
import PageLayout from "@/components/PageLayout";
import PasswordRequirements, { isPasswordValid } from "@/components/PasswordRequirements";
import { CheckCircle } from "lucide-react";

const ResetPassword = () => {
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [isRecovery, setIsRecovery] = useState(false);
  const [success, setSuccess] = useState(false);
  const [expired, setExpired] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const hashParams = new URLSearchParams(window.location.hash.substring(1));
    if (hashParams.get("type") === "recovery") {
      setIsRecovery(true);
    }

    const { data: { subscription } } = supabase.auth.onAuthStateChange((event) => {
      if (event === "PASSWORD_RECOVERY") {
        setIsRecovery(true);
      }
    });

    // If no recovery detected after 3s, assume expired
    const timeout = setTimeout(() => {
      setIsRecovery((current) => {
        if (!current) setExpired(true);
        return current;
      });
    }, 3000);

    return () => {
      subscription.unsubscribe();
      clearTimeout(timeout);
    };
  }, []);

  useEffect(() => {
    if (success) {
      const timeout = setTimeout(() => navigate("/login/talent"), 3000);
      return () => clearTimeout(timeout);
    }
  }, [success, navigate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isPasswordValid(password)) {
      toast({ title: "Password does not meet requirements", variant: "destructive" });
      return;
    }
    if (password !== confirmPassword) {
      toast({ title: "Passwords don't match", variant: "destructive" });
      return;
    }

    setLoading(true);
    const { error } = await supabase.auth.updateUser({ password });
    setLoading(false);

    if (error) {
      toast({ title: "Error", description: error.message, variant: "destructive" });
    } else {
      setSuccess(true);
    }
  };

  const inputClass = "w-full bg-background border border-border rounded px-4 py-3.5 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary";

  return (
    <PageLayout>
      <section className="py-20 md:py-28">
        <div className="container mx-auto px-4 max-w-md">
          <div className="text-center mb-8">
            <span className="section-tag">Security</span>
            <h1 className="font-display text-4xl md:text-5xl">SET NEW PASSWORD</h1>
          </div>
          <div className="card-surface p-8">
            {success ? (
              <div className="text-center">
                <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-4">
                  <CheckCircle className="h-8 w-8 text-primary" />
                </div>
                <p className="text-sm text-foreground mb-2">Password updated.</p>
                <p className="text-xs text-muted-foreground mb-4">Redirecting to login...</p>
                <Button asChild className="w-full bg-primary text-primary-foreground font-bold py-3.5 hover:opacity-90">
                  <Link to="/login/talent">Go to Login</Link>
                </Button>
              </div>
            ) : expired ? (
              <div className="text-center">
                <p className="text-sm text-foreground mb-2">This link has expired or is invalid.</p>
                <p className="text-xs text-muted-foreground mb-4">Request a new one.</p>
                <Button asChild className="w-full bg-primary text-primary-foreground font-bold py-3.5 hover:opacity-90">
                  <Link to="/auth/forgot-password">Request New Link</Link>
                </Button>
              </div>
            ) : !isRecovery ? (
              <div className="text-center">
                <p className="text-sm text-muted-foreground animate-pulse">Loading recovery session...</p>
              </div>
            ) : (
              <form className="space-y-4" onSubmit={handleSubmit}>
                <div>
                  <label className="text-xs font-mono text-muted-foreground uppercase tracking-wider mb-1 block">New Password</label>
                  <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="••••••••" required className={inputClass} />
                  <PasswordRequirements password={password} />
                </div>
                <div>
                  <label className="text-xs font-mono text-muted-foreground uppercase tracking-wider mb-1 block">Confirm Password</label>
                  <input type="password" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} placeholder="••••••••" required className={inputClass} />
                  {confirmPassword && password !== confirmPassword && (
                    <p className="text-xs text-destructive mt-1">Passwords don't match</p>
                  )}
                </div>
                <Button type="submit" disabled={loading} className="w-full bg-primary text-primary-foreground font-bold py-3.5 hover:opacity-90">
                  {loading ? "Updating..." : "Update Password"}
                </Button>
              </form>
            )}
          </div>
        </div>
      </section>
    </PageLayout>
  );
};

export default ResetPassword;
