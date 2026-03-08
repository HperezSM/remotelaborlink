import PageLayout from "@/components/PageLayout";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { Check, ArrowRight, Zap, Clock, Shield, FileText, Code, Palette, Headphones, Settings } from "lucide-react";
import { motion } from "framer-motion";
import TestimonialsSection from "@/components/TestimonialsSection";
import PartnersCarousel from "@/components/PartnersCarousel";

const fadeUp = { hidden: { opacity: 0, y: 30 }, visible: { opacity: 1, y: 0 } };
const stagger = { visible: { transition: { staggerChildren: 0.1 } } };

const stats = [
  { value: "72h", label: "Avg. Candidate Delivery", icon: Clock },
  { value: "94%", label: "Placement Retention", icon: Shield },
  { value: "5x", label: "Vetting Filter", icon: Zap },
];

const trustItems = [
  "English-fluent professionals",
  "US time zone overlap",
  "Technical skill screening",
  "Culture fit assessment",
  "Private talent portal access",
];

const whyLatam = [
  { icon: Clock, title: "Time Zone Alignment", desc: "LATAM professionals work your hours. Real-time collaboration, no overnight handoffs." },
  { icon: Zap, title: "English Proficiency", desc: "Every candidate passes rigorous English assessments. Written and verbal fluency required." },
  { icon: Shield, title: "Cost Efficiency", desc: "Access senior-level talent at 40-60% lower cost than US equivalents without sacrificing quality." },
];

const vettingSteps = ["Application Screen", "Technical Assessment", "Live Interview", "Reference Check", "Portal Upload"];

const portalFeatures = [
  { icon: FileText, label: "Pre-vetted candidate profiles with skill summaries" },
  { icon: Check, label: "Downloadable CVs and work samples" },
  { icon: Shield, label: "Shortlist and compare candidates side-by-side" },
  { icon: Clock, label: "Request interviews directly through the portal" },
];

const portalCandidates = [
  { initials: "MC", name: "Maria C.", role: "Full-Stack Developer", status: "Vetted", statusClass: "status-active" },
  { initials: "JR", name: "Juan R.", role: "Project Manager", status: "Vetted", statusClass: "status-active" },
  { initials: "AS", name: "Ana S.", role: "UX/UI Designer", status: "Interview Requested", statusClass: "status-screening" },
  { initials: "DL", name: "Diego L.", role: "Scrum Master", status: "Vetted", statusClass: "status-active" },
];

const roles = [
  { icon: FileText, name: "Project Managers", desc: "Experienced PMs who keep distributed teams aligned and shipping on time." },
  { icon: Settings, name: "Scrum Masters", desc: "Certified professionals who drive agile processes and remove blockers." },
  { icon: Code, name: "Developers", desc: "Full-stack, frontend, backend, and mobile engineers across modern stacks." },
  { icon: Palette, name: "UX/UI Designers", desc: "Product designers who craft user-centered experiences that convert." },
  { icon: Headphones, name: "Customer Support", desc: "Bilingual support specialists who deliver exceptional client experiences." },
  { icon: Settings, name: "Operations", desc: "Ops professionals who streamline workflows and scale processes." },
];

const howItWorks = [
  { num: "01", title: "Brief Us", desc: "Tell us the role, skills, and culture fit you need. We'll scope the search in under 24 hours." },
  { num: "02", title: "Review Profiles", desc: "Access pre-vetted candidates through your private portal. Compare, shortlist, and request interviews." },
  { num: "03", title: "Hire & Start", desc: "Select your candidate. We handle onboarding logistics so they're productive from day one." },
];

const testimonials = [
  { quote: "Remote LaborLink cut our hiring timeline from 6 weeks to 3 days. The quality of candidates was unmatched.", initials: "JM", name: "Jake Morrison", title: "CTO, ScaleOps Inc.", stars: 5 },
  { quote: "We've retained every placement for over a year. Their vetting process actually works.", initials: "SR", name: "Sarah Rivera", title: "VP People, GrowthBase", stars: 5 },
  { quote: "The portal changed everything. No more back-and-forth emails — just curated profiles ready to go.", initials: "KP", name: "Kevin Park", title: "Founder, BuildRight", stars: 5 },
];

const Index = () => {
  return (
    <PageLayout>
      {/* Hero */}
      <section className="py-24 md:py-36 relative overflow-hidden">
        <div className="absolute inset-0 glow-bg opacity-40" />
        <div className="container mx-auto px-4 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <motion.div initial="hidden" animate="visible" variants={stagger}>
              <motion.h1 variants={fadeUp} className="font-display text-6xl md:text-7xl lg:text-[96px]">
                WE PLACE PEOPLE,{" "}
                <span className="text-primary">NOT</span> RESUMES.
              </motion.h1>
              <motion.p variants={fadeUp} className="mt-6 text-lg md:text-xl text-muted-foreground max-w-lg leading-relaxed">
                Pre-vetted LATAM professionals delivered in 72 hours. Nearshore talent built for speed, quality, and US time zone alignment.
              </motion.p>
              <motion.div variants={fadeUp} className="mt-10 flex flex-wrap gap-4">
                <Button asChild size="lg" className="bg-primary text-primary-foreground font-bold text-base px-8 py-6 hover:opacity-90 hover:-translate-y-0.5 transition-all group">
                  <Link to="/contact">Book a Call <ArrowRight size={16} className="ml-2 group-hover:translate-x-1 transition-transform" /></Link>
                </Button>
                <Button asChild variant="outline" size="lg" className="text-base px-8 py-6 font-bold">
                  <a href="#how-it-works">How It Works</a>
                </Button>
              </motion.div>
            </motion.div>
            <motion.div
              initial="hidden" animate="visible" variants={stagger}
              className="grid grid-cols-1 sm:grid-cols-3 gap-4"
            >
              {stats.map((s) => (
                <motion.div key={s.label} variants={fadeUp} className="card-surface p-6 text-center hover:border-primary/50 transition-colors group">
                  <s.icon size={20} className="text-primary mx-auto mb-3 group-hover:scale-110 transition-transform" />
                  <div className="font-display text-5xl text-primary">{s.value}</div>
                  <div className="mt-2 text-xs font-mono text-muted-foreground tracking-wide uppercase">{s.label}</div>
                </motion.div>
              ))}
            </motion.div>
          </div>
        </div>
      </section>

      {/* Trust Bar */}
      <section className="bg-card border-y border-border py-6">
        <div className="container mx-auto px-4">
          <div className="flex flex-wrap justify-center gap-x-8 gap-y-3">
            {trustItems.map((item) => (
              <div key={item} className="flex items-center gap-2 text-sm font-medium text-muted-foreground">
                <Check size={14} className="text-primary" />
                {item}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Why LATAM */}
      <section className="py-24 bg-card">
        <div className="container mx-auto px-4">
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-100px" }} variants={stagger}>
            <span className="section-tag">Why LATAM</span>
            <h2 className="font-display text-5xl md:text-6xl mb-14">THE NEARSHORE ADVANTAGE</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {whyLatam.map((item) => (
                <motion.div key={item.title} variants={fadeUp} className="card-surface p-8 hover:border-primary/40 hover:-translate-y-1 transition-all duration-300">
                  <div className="text-3xl mb-4">{item.emoji}</div>
                  <h3 className="font-display text-2xl mb-3">{item.title}</h3>
                  <p className="text-[15px] text-muted-foreground leading-relaxed">{item.desc}</p>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      {/* Vetting Framework */}
      <section className="py-24">
        <div className="container mx-auto px-4">
          <span className="section-tag">Our Process</span>
          <h2 className="font-display text-5xl md:text-6xl mb-16">5-STEP VETTING FRAMEWORK</h2>
          <motion.div
            initial="hidden" whileInView="visible" viewport={{ once: true }} variants={stagger}
            className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 relative"
          >
            <div className="hidden md:block absolute top-6 left-0 right-0 h-px bg-border" />
            {vettingSteps.map((step, i) => (
              <motion.div key={step} variants={fadeUp} className="flex flex-col items-center text-center relative z-10 flex-1">
                <div className="w-12 h-12 rounded-full border-2 border-primary flex items-center justify-center font-display text-lg text-primary bg-background mb-3 hover:bg-primary hover:text-primary-foreground transition-colors">
                  {i + 1}
                </div>
                <span className="text-sm font-bold">{step}</span>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Client Talent Portal */}
      <section className="py-24 bg-primary text-primary-foreground">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={stagger}>
              <span className="font-mono text-[11px] tracking-[3px] uppercase mb-4 inline-block opacity-70">// Portal</span>
              <motion.h2 variants={fadeUp} className="font-display text-5xl md:text-6xl mb-6">CLIENT TALENT PORTAL</motion.h2>
              <motion.p variants={fadeUp} className="opacity-80 mb-8 text-base leading-relaxed">Your private dashboard for reviewing, shortlisting, and requesting interviews with pre-vetted candidates.</motion.p>
              <motion.div variants={fadeUp} className="space-y-4">
                {portalFeatures.map((f) => (
                  <div key={f.label} className="flex items-start gap-4">
                    <div className="w-10 h-10 bg-background rounded-lg flex items-center justify-center text-lg shrink-0">{f.icon}</div>
                    <span className="text-[15px] pt-2 font-medium">{f.label}</span>
                  </div>
                ))}
              </motion.div>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, x: 40 }} whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }} transition={{ duration: 0.6 }}
              className="bg-background rounded-lg p-1"
            >
              <div className="rounded-t-lg bg-card border-b border-border px-4 py-2 flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-destructive/60" />
                <div className="w-3 h-3 rounded-full bg-primary/60" />
                <div className="w-3 h-3 rounded-full bg-green-500/60" />
                <span className="ml-2 text-xs font-mono text-muted-foreground">portal.remotelaborlink.com</span>
              </div>
              <div className="p-4 space-y-3">
                {portalCandidates.map((c, i) => (
                  <motion.div
                    key={c.name}
                    initial={{ opacity: 0, y: 10 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: i * 0.1 + 0.3 }}
                    className="flex items-center gap-4 p-3 rounded-lg bg-card border border-border"
                  >
                    <div className="w-9 h-9 rounded-full bg-muted flex items-center justify-center font-mono text-xs text-muted-foreground">{c.initials}</div>
                    <div className="flex-1 min-w-0">
                      <div className="text-sm font-bold text-foreground">{c.name}</div>
                      <div className="text-xs text-muted-foreground">{c.role}</div>
                    </div>
                    <span className={`text-[10px] font-mono px-2.5 py-1 rounded-full font-semibold ${c.statusClass}`}>{c.status}</span>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Roles */}
      <section className="py-24">
        <div className="container mx-auto px-4">
          <span className="section-tag">Specializations</span>
          <h2 className="font-display text-5xl md:text-6xl mb-14">ROLES WE PLACE</h2>
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={stagger} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {roles.map((r) => (
              <motion.div key={r.name} variants={fadeUp} className="card-surface p-8 hover:border-primary hover:-translate-y-1 transition-all duration-300 group">
                <div className="text-3xl mb-4 group-hover:scale-110 transition-transform">{r.emoji}</div>
                <h3 className="font-display text-2xl mb-2">{r.name}</h3>
                <p className="text-[15px] text-muted-foreground leading-relaxed">{r.desc}</p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* How It Works */}
      <section id="how-it-works" className="py-24 bg-card">
        <div className="container mx-auto px-4">
          <span className="section-tag">Process</span>
          <h2 className="font-display text-5xl md:text-6xl mb-16">HOW IT WORKS</h2>
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={stagger} className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {howItWorks.map((step) => (
              <motion.div key={step.num} variants={fadeUp} className="relative group">
                <div className="font-display text-8xl text-primary/10 absolute -top-4 left-0 group-hover:text-primary/20 transition-colors">{step.num}</div>
                <div className="relative pt-12">
                  <h3 className="font-display text-3xl mb-3">{step.title}</h3>
                  <p className="text-[15px] text-muted-foreground leading-relaxed">{step.desc}</p>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-24">
        <div className="container mx-auto px-4">
          <span className="section-tag">Testimonials</span>
          <h2 className="font-display text-5xl md:text-6xl mb-14">WHAT CLIENTS SAY</h2>
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={stagger} className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {testimonials.map((t) => (
              <motion.div key={t.name} variants={fadeUp} className="card-surface p-8 hover:border-primary/30 transition-colors">
                <div className="flex gap-1 mb-4">
                  {Array.from({ length: t.stars }).map((_, i) => (
                    <Star key={i} size={14} className="fill-primary text-primary" />
                  ))}
                </div>
                <p className="italic text-[15px] text-muted-foreground leading-relaxed mb-6">"{t.quote}"</p>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center font-mono text-xs text-primary">{t.initials}</div>
                  <div>
                    <div className="text-sm font-bold">{t.name}</div>
                    <div className="text-xs font-mono text-muted-foreground">{t.title}</div>
                  </div>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Bottom CTA */}
      <section className="py-28 relative overflow-hidden">
        <div className="glow-bg absolute inset-0" />
        <div className="container mx-auto px-4 text-center relative z-10">
          <motion.h2
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="font-display text-6xl md:text-8xl mb-8"
          >
            STOP REVIEWING{" "}
            <span className="text-primary">BAD RESUMES.</span>
          </motion.h2>
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: 0.2 }}>
            <Button asChild size="lg" className="bg-primary text-primary-foreground font-bold text-base px-8 py-6 hover:opacity-90 hover:-translate-y-0.5 transition-all group">
              <Link to="/contact">Book a Call <ArrowRight size={16} className="ml-2 group-hover:translate-x-1 transition-transform" /></Link>
            </Button>
          </motion.div>
        </div>
      </section>
    </PageLayout>
  );
};

export default Index;
