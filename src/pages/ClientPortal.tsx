import PageLayout from "@/components/PageLayout";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { Lock, Users, FileText, Star, Calendar, ShieldCheck } from "lucide-react";
import { useState } from "react";

const features = [
  { icon: <Users size={20} />, title: "Curated Profiles", desc: "Browse pre-vetted candidates matched to your requirements." },
  { icon: <FileText size={20} />, title: "CV Downloads", desc: "Download full CVs and work samples for any candidate." },
  { icon: <Star size={20} />, title: "Skill Summaries", desc: "Quick-glance skill breakdowns for fast decision making." },
  { icon: <Lock size={20} />, title: "Shortlisting", desc: "Save and compare your top candidates side-by-side." },
  { icon: <Calendar size={20} />, title: "Interview Requests", desc: "Schedule interviews directly through the portal." },
  { icon: <ShieldCheck size={20} />, title: "Secure & Private", desc: "Your candidate pipeline is private and encrypted." },
];

const ClientPortal = () => {
  const [email, setEmail] = useState("");
  const [code, setCode] = useState("");

  return (
    <PageLayout>
      {/* Hero */}
      <section className="py-20 md:py-28">
        <div className="container mx-auto px-4 max-w-lg text-center">
          <span className="section-tag">Access</span>
          <h1 className="font-display text-5xl md:text-6xl mb-6 animate-fade-up">CLIENT TALENT PORTAL</h1>
          <p className="text-muted-foreground mb-10 animate-fade-up-delay-1">
            Secure access for engaged clients only.
          </p>

          {/* Login Card */}
          <div className="card-surface p-8 text-left animate-fade-up-delay-2">
            <div className="space-y-4">
              <div>
                <label className="text-xs font-mono text-muted-foreground uppercase tracking-wider mb-1 block">Company Email</label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@company.com"
                  className="w-full bg-background border border-border rounded-lg px-4 py-3 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                />
              </div>
              <div>
                <label className="text-xs font-mono text-muted-foreground uppercase tracking-wider mb-1 block">Access Code</label>
                <input
                  type="password"
                  value={code}
                  onChange={(e) => setCode(e.target.value)}
                  placeholder="••••••••"
                  className="w-full bg-background border border-border rounded-lg px-4 py-3 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                />
              </div>
              <Button variant="hero" className="w-full" size="lg">
                Log In
              </Button>
            </div>
            <p className="mt-4 text-xs text-muted-foreground text-center">
              Don't have access?{" "}
              <Link to="/contact" className="text-primary hover:underline">Book a call</Link> to get started.
            </p>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-20 bg-card">
        <div className="container mx-auto px-4">
          <span className="section-tag">Features</span>
          <h2 className="font-display text-4xl md:text-5xl mb-12">WHAT'S INSIDE</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map((f) => (
              <div key={f.title} className="card-surface p-8 hover:bg-muted/50 transition-colors">
                <div className="text-primary mb-4">{f.icon}</div>
                <h3 className="font-display text-xl mb-2">{f.title}</h3>
                <p className="text-sm text-muted-foreground">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-24 relative overflow-hidden">
        <div className="glow-bg absolute inset-0" />
        <div className="container mx-auto px-4 text-center relative z-10">
          <h2 className="font-display text-4xl md:text-5xl mb-8">PORTAL ACCESS STARTS WITH A CALL</h2>
          <Button asChild variant="hero" size="lg">
            <Link to="/contact">Book a Call</Link>
          </Button>
        </div>
      </section>
    </PageLayout>
  );
};

export default ClientPortal;
