import PageLayout from "@/components/PageLayout";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { X, Shield, ArrowRight, CheckCircle2 } from "lucide-react";
import { motion } from "framer-motion";

const fadeUp = { hidden: { opacity: 0, y: 30 }, visible: { opacity: 1, y: 0 } };
const stagger = { visible: { transition: { staggerChildren: 0.1 } } };

const problems = [
  { icon: <X className="text-destructive" size={20} />, title: "Slow Recruiters", desc: "Traditional agencies take 4-8 weeks. You needed someone yesterday." },
  { icon: <X className="text-destructive" size={20} />, title: "Poor Fit, High Churn", desc: "Résumé-matched hires leave within months. Culture and skill alignment are afterthoughts." },
  { icon: <X className="text-destructive" size={20} />, title: "Resume Overload", desc: "Hundreds of unfiltered applications. Zero signal. All noise." },
];

const vettingSteps = ["Application Screen", "Technical Assessment", "Live Interview", "Reference Check", "Portal Upload"];

const benefits = [
  { icon: "⚡", title: "72-Hour Delivery", desc: "Get shortlisted, vetted candidates within 3 business days." },
  { icon: "🎯", title: "Culture-First Matching", desc: "We assess communication style, work ethic, and team fit — not just skills." },
  { icon: "📊", title: "Full Transparency", desc: "Track every step through your private portal. No black boxes." },
  { icon: "🔄", title: "30-Day Guarantee", desc: "If a placement doesn't work out, we replace them at no extra cost." },
];

const caseStudies = [
  { company: "ScaleOps Inc.", result: "Hired 3 senior devs in 5 days", metric: "6 weeks → 5 days", quote: "Remote LaborLink cut our hiring timeline from 6 weeks to 3 days." },
  { company: "GrowthBase", result: "100% retention after 12 months", metric: "0% turnover", quote: "We've retained every placement for over a year." },
  { company: "BuildRight", result: "Filled 5 roles in 2 weeks", metric: "5 hires in 14 days", quote: "The portal changed everything." },
];

const ForCompanies = () => (
  <PageLayout>
    {/* Hero */}
    <section className="py-24 md:py-36 relative overflow-hidden">
      <div className="absolute inset-0 glow-bg opacity-30" />
      <div className="container mx-auto px-4 max-w-3xl text-center relative z-10">
        <motion.div initial="hidden" animate="visible" variants={stagger}>
          <span className="section-tag">For Companies</span>
          <motion.h1 variants={fadeUp} className="font-display text-6xl md:text-7xl lg:text-[96px]">
            YOUR HIRING PROCESS IS <span className="text-primary">BROKEN.</span>
          </motion.h1>
          <motion.p variants={fadeUp} className="mt-6 text-lg md:text-xl text-muted-foreground leading-relaxed">
            Resume overload, slow agencies, poor fit. Sound familiar? There's a better way to hire nearshore talent.
          </motion.p>
          <motion.div variants={fadeUp} className="mt-10 flex flex-wrap gap-4 justify-center">
            <Button asChild size="lg" className="bg-primary text-primary-foreground font-bold text-base px-8 py-6 hover:opacity-90 hover:-translate-y-0.5 transition-all group">
              <Link to="/contact">Book a Strategy Call <ArrowRight size={16} className="ml-2 group-hover:translate-x-1 transition-transform" /></Link>
            </Button>
            <Button asChild variant="outline" size="lg" className="text-base px-8 py-6 font-bold">
              <Link to="/login/company">Access Portal</Link>
            </Button>
          </motion.div>
        </motion.div>
      </div>
    </section>

    {/* Problems */}
    <section className="py-20 bg-card">
      <div className="container mx-auto px-4">
        <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={stagger} className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {problems.map((p) => (
            <motion.div key={p.title} variants={fadeUp} className="card-surface p-8 hover:border-destructive/30 transition-colors">
              <div className="mb-4">{p.icon}</div>
              <h3 className="font-display text-2xl mb-3">{p.title}</h3>
              <p className="text-[15px] text-muted-foreground leading-relaxed">{p.desc}</p>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>

    {/* Benefits */}
    <section className="py-24">
      <div className="container mx-auto px-4">
        <span className="section-tag">The Remote LaborLink Difference</span>
        <h2 className="font-display text-5xl md:text-6xl mb-14">WHY COMPANIES CHOOSE US</h2>
        <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={stagger} className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          {benefits.map((b) => (
            <motion.div key={b.title} variants={fadeUp} className="card-surface p-8 hover:border-primary/40 hover:-translate-y-1 transition-all duration-300">
              <div className="text-3xl mb-4">{b.icon}</div>
              <h3 className="font-display text-2xl mb-3">{b.title}</h3>
              <p className="text-[15px] text-muted-foreground leading-relaxed">{b.desc}</p>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>

    {/* Vetting */}
    <section className="py-24 bg-card">
      <div className="container mx-auto px-4">
        <span className="section-tag">Our Solution</span>
        <h2 className="font-display text-5xl md:text-6xl mb-16">5-STEP VETTING FRAMEWORK</h2>
        <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={stagger} className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 relative">
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

    {/* Case Studies */}
    <section className="py-24">
      <div className="container mx-auto px-4">
        <span className="section-tag">Results</span>
        <h2 className="font-display text-5xl md:text-6xl mb-14">REAL RESULTS</h2>
        <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={stagger} className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {caseStudies.map((cs) => (
            <motion.div key={cs.company} variants={fadeUp} className="card-surface p-8 border-l-[3px] border-l-primary">
              <div className="font-display text-3xl text-primary mb-2">{cs.metric}</div>
              <h3 className="font-body font-bold text-foreground mb-1">{cs.company}</h3>
              <p className="text-sm text-muted-foreground mb-4">{cs.result}</p>
              <p className="text-sm italic text-foreground/60">"{cs.quote}"</p>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>

    {/* Portal */}
    <section className="py-24 bg-primary text-primary-foreground">
      <div className="container mx-auto px-4 max-w-3xl text-center">
        <span className="font-mono text-[11px] tracking-[3px] uppercase mb-4 inline-block opacity-70">// Portal</span>
        <h2 className="font-display text-5xl md:text-6xl mb-6">FULL TRANSPARENCY. TOTAL CONTROL.</h2>
        <p className="opacity-80 mb-8 text-base leading-relaxed">
          No black-box recruiting. Access your private talent portal, review curated profiles, download CVs, and request interviews — all on your terms.
        </p>
        <Button asChild variant="outline" size="lg" className="border-primary-foreground text-primary-foreground hover:bg-primary-foreground hover:text-primary font-bold text-base px-8 py-6">
          <Link to="/login/company">Access Portal</Link>
        </Button>
      </div>
    </section>

    {/* Guarantee */}
    <section className="py-24">
      <div className="container mx-auto px-4 max-w-2xl">
        <motion.div initial={{ opacity: 0, scale: 0.95 }} whileInView={{ opacity: 1, scale: 1 }} viewport={{ once: true }} className="card-surface p-10 border-primary border-2 text-center">
          <Shield className="text-primary mx-auto mb-4" size={40} />
          <h2 className="font-display text-3xl md:text-4xl mb-4">30-DAY REPLACEMENT GUARANTEE</h2>
          <p className="text-[15px] text-muted-foreground leading-relaxed">
            If a placement doesn't work out within the first 30 days, we replace them at no additional cost. We stand behind every candidate we present.
          </p>
        </motion.div>
      </div>
    </section>

    {/* CTA */}
    <section className="py-28 relative overflow-hidden">
      <div className="glow-bg absolute inset-0" />
      <div className="container mx-auto px-4 text-center relative z-10">
        <motion.h2 initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="font-display text-6xl md:text-7xl mb-8">
          SCHEDULE A TALENT STRATEGY CALL
        </motion.h2>
        <Button asChild size="lg" className="bg-primary text-primary-foreground font-bold text-base px-8 py-6 hover:opacity-90 hover:-translate-y-0.5 transition-all group">
          <Link to="/contact">Book a Call <ArrowRight size={16} className="ml-2 group-hover:translate-x-1 transition-transform" /></Link>
        </Button>
      </div>
    </section>
  </PageLayout>
);

export default ForCompanies;
