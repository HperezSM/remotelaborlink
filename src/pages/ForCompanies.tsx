import PageLayout from "@/components/PageLayout";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { X, Shield } from "lucide-react";

const problems = [
  { icon: <X className="text-destructive" size={20} />, title: "Slow Recruiters", desc: "Traditional agencies take 4-8 weeks. You needed someone yesterday." },
  { icon: <X className="text-destructive" size={20} />, title: "Poor Fit, High Churn", desc: "Résumé-matched hires leave within months. Culture and skill alignment are afterthoughts." },
  { icon: <X className="text-destructive" size={20} />, title: "Resume Overload", desc: "Hundreds of unfiltered applications. Zero signal. All noise." },
];

const vettingSteps = [
  "Application Screen",
  "Technical Assessment",
  "Live Interview",
  "Reference Check",
  "Portal Upload",
];

const ForCompanies = () => (
  <PageLayout>
    {/* Hero */}
    <section className="py-20 md:py-32">
      <div className="container mx-auto px-4 max-w-3xl text-center">
        <span className="section-tag">For Companies</span>
        <h1 className="font-display text-5xl md:text-7xl animate-fade-up">
          YOUR HIRING PROCESS IS <span className="text-primary">BROKEN.</span>
        </h1>
        <p className="mt-6 text-lg text-muted-foreground animate-fade-up-delay-1">
          Resume overload, slow agencies, poor fit. Sound familiar? There's a better way to hire nearshore talent.
        </p>
      </div>
    </section>

    {/* Problems */}
    <section className="py-16 bg-card">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {problems.map((p) => (
            <div key={p.title} className="card-surface p-8">
              <div className="mb-4">{p.icon}</div>
              <h3 className="font-display text-2xl mb-3">{p.title}</h3>
              <p className="text-sm text-muted-foreground">{p.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>

    {/* Solution - Vetting */}
    <section className="py-20">
      <div className="container mx-auto px-4">
        <span className="section-tag">Our Solution</span>
        <h2 className="font-display text-4xl md:text-5xl mb-16">5-STEP VETTING FRAMEWORK</h2>
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 relative">
          <div className="hidden md:block absolute top-6 left-0 right-0 h-px bg-border" />
          {vettingSteps.map((step, i) => (
            <div key={step} className="flex flex-col items-center text-center relative z-10 flex-1">
              <div className="w-12 h-12 rounded-full border-2 border-primary flex items-center justify-center font-display text-lg text-primary bg-background mb-3">
                {i + 1}
              </div>
              <span className="text-sm font-medium">{step}</span>
            </div>
          ))}
        </div>
      </div>
    </section>

    {/* Portal */}
    <section className="py-20 bg-primary text-primary-foreground">
      <div className="container mx-auto px-4 max-w-3xl text-center">
        <span className="font-mono text-[11px] tracking-[3px] uppercase mb-4 inline-block opacity-70">Portal</span>
        <h2 className="font-display text-4xl md:text-5xl mb-6">FULL TRANSPARENCY. TOTAL CONTROL.</h2>
        <p className="opacity-80 mb-8">
          No black-box recruiting. Access your private talent portal, review curated profiles, download CVs, and request interviews — all on your terms.
        </p>
        <Button asChild variant="outline" size="lg" className="border-primary-foreground text-primary-foreground hover:bg-primary-foreground hover:text-primary">
          <Link to="/client-portal">Access Portal</Link>
        </Button>
      </div>
    </section>

    {/* Guarantee */}
    <section className="py-20">
      <div className="container mx-auto px-4 max-w-2xl">
        <div className="card-surface p-10 border-primary border-2 text-center">
          <Shield className="text-primary mx-auto mb-4" size={40} />
          <h2 className="font-display text-3xl md:text-4xl mb-4">30-DAY REPLACEMENT GUARANTEE</h2>
          <p className="text-muted-foreground">
            If a placement doesn't work out within the first 30 days, we replace them at no additional cost. We stand behind every candidate we present.
          </p>
        </div>
      </div>
    </section>

    {/* CTA */}
    <section className="py-24 relative overflow-hidden">
      <div className="glow-bg absolute inset-0" />
      <div className="container mx-auto px-4 text-center relative z-10">
        <h2 className="font-display text-5xl md:text-6xl mb-8">SCHEDULE A TALENT STRATEGY CALL</h2>
        <Button asChild variant="hero" size="lg">
          <Link to="/contact">Book a Call</Link>
        </Button>
      </div>
    </section>
  </PageLayout>
);

export default ForCompanies;
