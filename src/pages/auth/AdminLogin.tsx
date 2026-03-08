import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { signIn } from "@/lib/auth";
import { toast } from "@/hooks/use-toast";
import logoIcon from "@/assets/logo-icon.png";

const AdminLogin = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    const { error } = await signIn(email, password);
    setLoading(false);
    if (error) {
      toast({ title: "Login failed", description: error.message, variant: "destructive" });
    } else {
      navigate("/admin");
    }
  };

  const inputClass = "w-full bg-background border border-border rounded px-4 py-3.5 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary";

  return (
    <div className="min-h-screen flex items-center justify-center bg-background px-4">
      <div className="w-full max-w-sm">
        <div className="flex items-center justify-center gap-3 mb-8">
          <img src={logoIcon} alt="Remote LaborLink" className="h-10 w-10" style={{ background: 'transparent' }} />
          <span className="font-body font-bold text-sm tracking-[2px] text-foreground">ADMIN</span>
        </div>
        <div className="card-surface p-8">
          <form className="space-y-4" onSubmit={handleSubmit}>
            <div>
              <label className="text-xs font-mono text-muted-foreground uppercase tracking-wider mb-1 block">Email</label>
              <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="admin@remotelaborlink.com" required className={inputClass} />
            </div>
            <div>
              <label className="text-xs font-mono text-muted-foreground uppercase tracking-wider mb-1 block">Password</label>
              <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="••••••••" required className={inputClass} />
            </div>
            <Button type="submit" disabled={loading} className="w-full bg-primary text-primary-foreground font-bold py-3.5 hover:opacity-90">
              {loading ? "Logging in..." : "Log In"}
            </Button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default AdminLogin;
