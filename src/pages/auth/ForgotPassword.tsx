import { useState } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";
import PageLayout from "@/components/PageLayout";
import { Mail } from "lucide-react";

const ForgotPassword = () => {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/auth/reset-password`,
    });
    setLoading(false);
    if (error) {
      toast({ title: "Error", description: error.message, variant: "destructive" });
    } else {
      setSent(true);
    }
  };

  const inputClass = "w-full bg-background border border-border rounded px-4 py-3.5 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary";

  return (
    <PageLayout>
      <section className="py-20 md:py-28">
        <div className="container mx-auto px-4 max-w-md">
          <div className="text-center mb-8">
            <span className="section-tag">Account Recovery</span>
            <h1 className="font-display text-4xl md:text-5xl">RESET YOUR PASSWORD</h1>
          </div>
          <div className="card-surface p-8">
            {sent ? (
              <div className="text-center">
                <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-4">
                  <Mail className="h-8 w-8 text-primary" />
                </div>
                <h3 className="font-display text-xl mb-2">CHECK YOUR EMAIL</h3>
                <p className="text-sm text-muted-foreground mb-2">
                  If an account exists for <strong className="text-foreground">{email}</strong>, you'll receive a password reset link shortly.
                </p>
                <p className="text-xs text-muted-foreground mb-4">The link expires in 1 hour.</p>
                <Button asChild variant="outline" className="w-full">
                  <Link to="/login/talent">Back to Login</Link>
                </Button>
              </div>
            ) : (
              <>
                <p className="text-sm text-muted-foreground mb-6">Enter your email and we'll send you a reset link.</p>
                <form className="space-y-4" onSubmit={handleSubmit}>
                  <div>
                    <label className="text-xs font-mono text-muted-foreground uppercase tracking-wider mb-1 block">Email</label>
                    <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="you@email.com" required className={inputClass} />
                  </div>
                  <Button type="submit" disabled={loading} className="w-full bg-primary text-primary-foreground font-bold py-3.5 hover:opacity-90">
                    {loading ? "Sending..." : "Send Reset Link"}
                  </Button>
                </form>
                <p className="mt-4 text-xs text-muted-foreground text-center">
                  Remember your password?{" "}
                  <Link to="/login/talent" className="text-primary hover:underline">Log in</Link>
                </p>
              </>
            )}
          </div>
        </div>
      </section>
    </PageLayout>
  );
};

export default ForgotPassword;
