import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import PageLayout from "@/components/PageLayout";

const AuthCallback = () => {
  const navigate = useNavigate();
  const [error, setError] = useState("");

  useEffect(() => {
    const handleCallback = async () => {
      // Supabase auto-processes tokens from the URL hash
      const { data: { session }, error: sessionError } = await supabase.auth.getSession();
      
      if (sessionError || !session) {
        setError("Verification failed. Please try again.");
        return;
      }

      // Determine role and redirect
      const { data: roleData } = await supabase
        .from("user_roles")
        .select("role")
        .eq("user_id", session.user.id)
        .single();

      const role = roleData?.role;

      if (role === "company") {
        navigate("/auth/company-verified", { replace: true });
      } else if (role === "candidate") {
        navigate("/auth/verified", { replace: true });
      } else {
        navigate("/", { replace: true });
      }
    };

    handleCallback();
  }, [navigate]);

  return (
    <PageLayout>
      <section className="py-20 md:py-28">
        <div className="container mx-auto px-4 max-w-md text-center">
          {error ? (
            <p className="text-destructive">{error}</p>
          ) : (
            <p className="text-muted-foreground font-mono text-sm animate-pulse">
              Verifying your email...
            </p>
          )}
        </div>
      </section>
    </PageLayout>
  );
};

export default AuthCallback;
