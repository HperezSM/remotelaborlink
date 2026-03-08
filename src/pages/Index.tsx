import PageLayout from "@/components/PageLayout";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { Check } from "lucide-react";

const stats = [
  { value: "72h", label: "Avg. Candidate Delivery" },
  { value: "94%", label: "Placement Retention" },
  { value: "5x", label: "Vetting Filter" },
];

const trustItems = [
  "English-fluent professionals",
  "US time zone overlap",
  "Technical skill screening",
  "Culture fit assessment",
  "Private talent portal access",
];

const whyLatam = [
  { emoji: "🕐", title: "Time Zone Alignment", desc: "LATAM professionals work your hours. Real-time collaboration, no overnight handoffs." },
  { emoji: "🗣️", title: "English Proficiency", desc: "Every candidate passes rigorous English assessments. Written and verbal fluency required." },
  { emoji: "💰", title: "Cost Efficiency", desc: "Access senior-level talent at 40-60% lower cost than US equivalents without sacrificing quality." },
];

const vettingSteps = [
  "Application Screen",
  "Technical Assessment",
  "Live Interview",
  "Reference Check",
  "Portal Upload",
];

const portalFeatures = [
  { icon: "📋", label: "Pre-vetted candidate profiles with skill summaries" },
  { icon: "📥", label: "Downloadable CVs and work samples" },
  { icon: "⭐", label: "Shortlist and compare candidates side-by-side" },
  { icon: "📅", label: "Request interviews directly through the portal" },
];

const portalCandidates = [
  { initials: "MC", name: "Maria C.", role: "Full-Stack Developer", status: "Vetted", statusColor: "bg-green-500/20 text-green-400" },
  { initials: "JR", name: "Juan R.", role: "Project Manager", status: "Vetted", statusColor: "bg-green-500/20 text-green-400" },
  { initials: "AS", name: "Ana S.", role: "UX/UI Designer", status: "Interview Requested", statusColor: "bg-primary/20 text-primary" },
  { initials: "DL", name: "Diego L.", role: "Scrum Master", status: "Vetted", statusColor: "bg-green-500/20 text-green-400" },
];

const roles = [
  { emoji: "📊", name: "Project Managers", desc: "Experienced PMs who keep distributed teams aligned and shipping on time." },
  { emoji: "🔄", name: "Scrum Masters", desc: "Certified professionals who drive agile processes and remove blockers." },
  { emoji: "💻", name: "Developers", desc: "Full-stack, frontend, backend, and mobile engineers across modern stacks." },
  { emoji: "🎨", name: "UX/UI Designers", desc: "Product designers who craft user-centered experiences that convert." },
  { emoji: "🎧", name: "Customer Support", desc: "Bilingual support specialists who deliver exceptional client experiences." },
  { emoji: "⚙️", name: "Operations", desc: "Ops professionals who streamline workflows and scale processes." },
];

const howItWorks = [
  { num: "01", title: "Brief Us", desc: "Tell us the role, skills, and culture fit you need. We'll scope the search in under 24 hours." },
  { num: "02", title: "Review Profiles", desc: "Access pre-vetted candidates through your private portal. Compare, shortlist, and request interviews." },
  { num: "03", title: "Hire & Start", desc: "Select your candidate. We handle onboarding logistics so they're productive from day one." },
];

const testimonials = [
  { quote: "Remote LaborLink cut our hiring timeline from 6 weeks to 3 days. The quality of candidates was unmatched.", initials: "JM", name: "Jake Morrison", title: "CTO, ScaleOps Inc." },
  { quote: "We've retained every placement for over a year. Their vetting process actually works.", initials: "SR", name: "Sarah Rivera", title: "VP People, GrowthBase" },
  { quote: "The portal changed everything. No more back-and-forth emails — just curated profiles ready to go.", initials: "KP", name: "Kevin Park", title: "Founder, BuildRight" },
];

const Index = () => {
  return (
    <PageLayout>
      {/* Hero */}
      <section className="py-20 md:py-32">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <h1 className="font-display text-5xl md:text-7xl lg:text-8xl animate-fade-up">
                WE PLACE PEOPLE,{" "}
                <span className="text-primary">NOT</span> RESUMES.
              </h1>
              <p className="mt-6 text-lg text-muted-foreground max-w-lg animate-fade-up-delay-1">
                Pre-vetted LATAM professionals delivered in 72 hours. Nearshore talent built for speed, quality, and US time zone alignment.
              </p>
              <div className="mt-8 flex flex-wrap gap-4 animate-fade-up-delay-2">
                <Button asChild variant="hero" size="lg">
                  <Link to="/contact">Book a Call</Link>
                </Button>
                <Button asChild variant="hero-outline" size="lg">
                  <a href="#how-it-works">How It Works</a>
                </Button>
              </div>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 animate-fade-up-delay-3">
              {stats.map((s) => (
                <div key={s.label} className="card-surface p-6 text-center">
                  <div className="font-display text-4xl text-primary">{s.value}</div>
                  <div className="mt-2 text-xs font-mono text-muted-foreground tracking-wide uppercase">{s.label}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Trust Bar */}
      <section className="bg-card border-y border-border py-6">
        <div className="container mx-auto px-4">
          <div className="flex flex-wrap justify-center gap-x-8 gap-y-3">
            {trustItems.map((item) => (
              <div key={item} className="flex items-center gap-2 text-sm text-muted-foreground">
                <Check size={14} className="text-primary" />
                {item}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Why LATAM */}
      <section className="py-20 bg-card">
        <div className="container mx-auto px-4">
          <span className="section-tag">Why LATAM</span>
          <h2 className="font-display text-4xl md:text-5xl mb-12">THE NEARSHORE ADVANTAGE</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {whyLatam.map((item) => (
              <div key={item.title} className="card-surface p-8">
                <div className="text-3xl mb-4">{item.emoji}</div>
                <h3 className="font-display text-2xl mb-3">{item.title}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Vetting Framework */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <span className="section-tag">Our Process</span>
          <h2 className="font-display text-4xl md:text-5xl mb-16">5-STEP VETTING FRAMEWORK</h2>
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 relative">
            {/* Connecting line */}
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

      {/* Client Talent Portal */}
      <section className="py-20 bg-primary text-primary-foreground">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <span className="font-mono text-[11px] tracking-[3px] uppercase mb-4 inline-block opacity-70">Portal</span>
              <h2 className="font-display text-4xl md:text-5xl mb-6">CLIENT TALENT PORTAL</h2>
              <p className="mb-8 opacity-80">Your private dashboard for reviewing, shortlisting, and requesting interviews with pre-vetted candidates.</p>
              <div className="space-y-4">
                {portalFeatures.map((f) => (
                  <div key={f.label} className="flex items-start gap-4">
                    <div className="w-10 h-10 bg-background rounded-lg flex items-center justify-center text-lg shrink-0">{f.icon}</div>
                    <span className="text-sm pt-2">{f.label}</span>
                  </div>
                ))}
              </div>
            </div>
            <div className="bg-background rounded-lg p-1">
              <div className="rounded-t-lg bg-card border-b border-border px-4 py-2 flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-destructive/60" />
                <div className="w-3 h-3 rounded-full bg-primary/60" />
                <div className="w-3 h-3 rounded-full bg-green-500/60" />
                <span className="ml-2 text-xs font-mono text-muted-foreground">portal.remotelaborlink.com</span>
              </div>
              <div className="p-4 space-y-3">
                {portalCandidates.map((c) => (
                  <div key={c.name} className="flex items-center gap-4 p-3 rounded-lg bg-card border border-border">
                    <div className="w-9 h-9 rounded-full bg-muted flex items-center justify-center font-mono text-xs text-muted-foreground">{c.initials}</div>
                    <div className="flex-1 min-w-0">
                      <div className="text-sm font-medium text-foreground">{c.name}</div>
                      <div className="text-xs text-muted-foreground">{c.role}</div>
                    </div>
                    <span className={`text-[10px] font-mono px-2 py-1 rounded-full ${c.statusColor}`}>{c.status}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Roles */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <span className="section-tag">Specializations</span>
          <h2 className="font-display text-4xl md:text-5xl mb-12">ROLES WE PLACE</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {roles.map((r) => (
              <div key={r.name} className="card-surface p-8 hover:border-primary transition-colors">
                <div className="text-3xl mb-4">{r.emoji}</div>
                <h3 className="font-display text-2xl mb-2">{r.name}</h3>
                <p className="text-sm text-muted-foreground">{r.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section id="how-it-works" className="py-20 bg-card">
        <div className="container mx-auto px-4">
          <span className="section-tag">Process</span>
          <h2 className="font-display text-4xl md:text-5xl mb-16">HOW IT WORKS</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {howItWorks.map((step) => (
              <div key={step.num} className="relative">
                <div className="font-display text-8xl text-primary/10 absolute -top-4 left-0">{step.num}</div>
                <div className="relative pt-12">
                  <h3 className="font-display text-3xl mb-3">{step.title}</h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">{step.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <span className="section-tag">Testimonials</span>
          <h2 className="font-display text-4xl md:text-5xl mb-12">WHAT CLIENTS SAY</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {testimonials.map((t) => (
              <div key={t.name} className="card-surface p-8">
                <p className="italic text-sm text-muted-foreground leading-relaxed mb-6">"{t.quote}"</p>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center font-mono text-xs text-primary">{t.initials}</div>
                  <div>
                    <div className="text-sm font-medium">{t.name}</div>
                    <div className="text-xs font-mono text-muted-foreground">{t.title}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Bottom CTA */}
      <section className="py-24 relative overflow-hidden">
        <div className="glow-bg absolute inset-0" />
        <div className="container mx-auto px-4 text-center relative z-10">
          <h2 className="font-display text-5xl md:text-7xl mb-8">
            STOP REVIEWING{" "}
            <span className="text-primary">BAD RESUMES.</span>
          </h2>
          <Button asChild variant="hero" size="lg">
            <Link to="/contact">Book a Call</Link>
          </Button>
        </div>
      </section>
    </PageLayout>
  );
};

export default Index;
