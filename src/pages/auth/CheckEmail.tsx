import { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";
import PageLayout from "@/components/PageLayout";
import { Mail } from "lucide-react";

const CheckEmail = () => {
  const location = useLocation();
  const email = (location.state as any)?.email || "";
  const [cooldown, setCooldown] = useState(0);

  useEffect(() => {
    if (cooldown <= 0) return;
    const t = setTimeout(() => setCooldown((c) => c - 1), 1000);
    return () => clearTimeout(t);
  }, [cooldown]);

  const handleResend = async () => {
    if (!email) {
      toast({ title: "No email found", description: "Please sign up again.", variant: "destructive" });
      return;
    }
    const { error } = await supabase.auth.resend({ type: "signup", email });
    if (error) {
      toast({ title: "Error", description: error.message, variant: "destructive" });
    } else {
      toast({ title: "Verification email resent" });
      setCooldown(60);
    }
  };

  return (
    <PageLayout>
      <section className="py-20 md:py-28">
        <div className="container mx-auto px-4 max-w-md">
          <div className="text-center mb-8">
            <span className="section-tag">Almost There</span>
            <h1 className="font-display text-4xl md:text-5xl">CHECK YOUR EMAIL</h1>
          </div>
          <div className="card-surface p-8 text-center">
            <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-6">
              <Mail className="h-8 w-8 text-primary" />
            </div>
            <p className="text-sm text-foreground mb-2">
              We sent a verification link to{" "}
              {email ? <strong className="text-primary">{email}</strong> : "your email"}.
            </p>
            <p className="text-sm text-muted-foreground mb-6">
              Click the link in that email to activate your account.
              <br />
              Check your spam folder if you don't see it.
            </p>
            <Button
              variant="outline"
              onClick={handleResend}
              disabled={cooldown > 0 || !email}
              className="w-full"
            >
              {cooldown > 0 ? `Resend in ${cooldown}s` : "Resend Verification Email"}
            </Button>
          </div>
        </div>
      </section>
    </PageLayout>
  );
};

export default CheckEmail;
