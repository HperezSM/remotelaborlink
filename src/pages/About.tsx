import PageLayout from "@/components/PageLayout";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Gem, Flame, Zap, Search, Brain, RefreshCw, Handshake, Globe, Clock, Users, MessageCircle, DollarSign, ArrowRight } from "lucide-react";
import logoIcon from "@/assets/logo-icon.png";
import TeamSection from "@/components/TeamSection";
import PartnersCarousel from "@/components/PartnersCarousel";
import TestimonialsSection from "@/components/TestimonialsSection";
import { SocialIconRow } from "@/components/SocialLinks";

const fadeUp = { hidden: { opacity: 0, y: 30 }, visible: { opacity: 1, y: 0, transition: { duration: 0.5 } } };
const stagger = { visible: { transition: { staggerChildren: 0.12 } } };

const values = [
  { icon: Gem, title: "Quality", desc: "Every candidate, every process, every interaction reflects our commitment to excellence." },
  { icon: Flame, title: "Ownership", desc: "We treat your hiring needs like our own. No hand-offs. No excuses." },
  { icon: Zap, title: "Speed", desc: "72-hour candidate delivery. Because the best talent doesn't wait." },
  { icon: Search, title: "Transparency", desc: "Full visibility into our process, your pipeline, and every placement decision." },
];

const coreValues = [
  { icon: Brain, name: "Human Intelligence vs AI", desc: "We prioritize values, communication, and long-term fit. Great teams are built on people, not profiles." },
  { icon: RefreshCw, name: "Agile Recruiting", desc: "We adapt with your evolving needs, combining speed with flexibility to find the right fit at the right time." },
  { icon: Handshake, name: "Partnership, Over Transactions.", desc: "We partner with startups as they grow, thinking long-term, not just about the next hire." },
  { icon: Globe, name: "Culture-Driven, Remote Work.", desc: "It's about the momentum of collaboration, and building global teams that value time, culture, and talent." },
];

const latamRows = [
  { icon: Clock, label: "Time Zone", value: "1–4 hours from US (real-time collaboration)" },
  { icon: Users, label: "Cultural Fit", value: "Western business culture, similar work expectations" },
  { icon: MessageCircle, label: "English Proficiency", value: "Higher baseline in professional roles" },
  { icon: DollarSign, label: "Cost", value: "50–70% savings vs US market rates" },
];

const YellowRule = () => (
  <div className="w-[60px] h-[2px] bg-primary mx-auto my-3" />
);

const About = () => (
  <PageLayout>
    {/* S1 — Hero */}
    <section className="py-24 md:py-36 relative overflow-hidden">
      <div className="absolute inset-0 glow-bg opacity-30" />
      <div className="container mx-auto px-4 max-w-3xl text-center relative z-10">
        <motion.span initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="section-tag">About Remote LaborLink</motion.span>
        <motion.h1
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="font-display text-6xl md:text-7xl lg:text-[96px]"
        >
          BUILT BY <span className="text-primary">OPERATORS.</span><br />
          DRIVEN BY <span className="text-primary">PEOPLE.</span>
        </motion.h1>
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="mt-6 text-lg md:text-xl text-muted-foreground leading-relaxed max-w-2xl mx-auto"
        >
          We've managed distributed teams, made bad hires, fixed broken processes, and built something better because of it.
        </motion.p>
      </div>
    </section>

    {/* S2 — Mission */}
    <motion.section className="py-24" initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-80px" }} variants={stagger}>
      <div className="container mx-auto px-4 max-w-[680px] text-center">
        <motion.span variants={fadeUp} className="section-tag">Core Purpose</motion.span>
        <motion.h2 variants={fadeUp} className="font-display text-5xl md:text-6xl">MISSION</motion.h2>
        <YellowRule />
        <motion.p variants={fadeUp} className="mt-8 text-xl font-body leading-[1.8] text-foreground/80">
          Partner with ambitious <strong className="text-foreground">startups</strong> by connecting them with{" "}
          <strong className="text-foreground">exceptional</strong> remote LATAM{" "}
          <strong className="text-foreground">talent</strong>, driving long-term growth and mutual success.
        </motion.p>
        <motion.img variants={fadeUp} src={logoIcon} alt="Remote LaborLink" className="logo-blend w-12 h-auto mx-auto mt-8" />
      </div>
    </motion.section>

    {/* S3 — Vision */}
    <motion.section className="py-24 bg-card" initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-80px" }} variants={stagger}>
      <div className="container mx-auto px-4 max-w-[680px] text-center">
        <motion.span variants={fadeUp} className="section-tag">Where We're Going</motion.span>
        <motion.h2 variants={fadeUp} className="font-display text-5xl md:text-6xl">VISION</motion.h2>
        <YellowRule />
        <motion.p variants={fadeUp} className="mt-8 text-xl font-body leading-[1.8] text-foreground/80">
          To become the most trusted remote <strong className="text-foreground">talent partner</strong> for startups,
          elevating global teams, building cross-border collaboration, and unlocking opportunity through remote work.
        </motion.p>
        <motion.img variants={fadeUp} src={logoIcon} alt="Remote LaborLink" className="logo-blend w-12 h-auto mx-auto mt-8" />
      </div>
    </motion.section>

    {/* S4 — Values (2 col) */}
    <motion.section className="py-24" initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-80px" }} variants={stagger}>
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 md:gap-20">
          <motion.div variants={fadeUp}>
            <h2 className="font-display text-5xl md:text-6xl">VALUES</h2>
            <div className="w-[60px] h-[2px] bg-primary my-3" />
            <p className="mt-6 text-lg font-body text-foreground/70">
              These are the values you can partner with, live by, and hire by.
            </p>
          </motion.div>
          <div>
            {coreValues.map((v, i) => (
              <motion.div key={i} variants={fadeUp} className="py-6 border-b border-border group hover:border-primary/40 transition-colors">
                <div className="flex items-start gap-4">
                  <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center shrink-0 group-hover:bg-primary/20 transition-colors">
                    <v.icon size={16} className="text-primary" />
                  </div>
                  <div>
                    <p className="font-body font-bold text-xl text-foreground">{v.name}</p>
                    <p className="font-body italic text-sm text-foreground/55 mt-1">{v.desc}</p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </motion.section>

    {/* S5 — How We Hire */}
    <motion.section className="py-24 bg-card" initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-80px" }} variants={stagger}>
      <div className="container mx-auto px-4 text-center">
        <motion.h2 variants={fadeUp} className="font-display text-5xl md:text-6xl">HOW WE HIRE</motion.h2>
        <motion.div variants={fadeUp} className="mt-8 inline-block bg-primary text-primary-foreground font-body font-bold text-[13px] uppercase tracking-[2px] rounded-full px-8 py-3">
          Hiring Philosophy
        </motion.div>
        <motion.p variants={fadeUp} className="mt-6 text-base font-body text-foreground/60 max-w-lg mx-auto">
          We don't start recruiting when you sign with us.
        </motion.p>
        <motion.div variants={fadeUp} className="mt-12 flex flex-col md:flex-row items-center justify-center gap-6">
          {[
            <>We maintain a continuously <strong>qualified pool</strong> of remote professionals.</>,
            <>Already screened, assessed, and <strong>ready to work</strong> with international clients.</>,
            <>This allows us to move quickly while maintaining consistently high quality.</>,
          ].map((text, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.15 }}
              className="bg-foreground text-background rounded-2xl px-8 py-7 font-body text-[15px] text-center max-w-[280px] hover:-translate-y-1 transition-transform duration-300"
            >
              {text}
            </motion.div>
          ))}
        </motion.div>
      </div>
    </motion.section>

    {/* S6 — Core Principles */}
    <motion.section className="py-24" initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-80px" }} variants={stagger}>
      <div className="container mx-auto px-4 text-center">
        <motion.h2 variants={fadeUp} className="font-display text-5xl md:text-6xl">CORE PRINCIPLES</motion.h2>
        <motion.p variants={fadeUp} className="mt-4 text-base font-body text-foreground/60">Our process is designed around three pillars</motion.p>
        <div className="mt-12 flex flex-col md:flex-row items-center justify-center gap-6">
          {[
            { label: "SPEED", desc: "Shortlists in days, not weeks", icon: Zap },
            { label: "QUALITY", desc: "Multi-layer vetting before you ever see a candidate", icon: Gem },
            { label: "FIT", desc: "Skills, communication, and culture all matter", icon: Users },
          ].map((p, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.15 }}
              className={`bg-primary text-primary-foreground rounded-2xl px-9 py-8 text-center max-w-[280px] hover:-translate-y-1 transition-transform duration-300 ${i === 1 ? 'scale-105' : ''}`}
            >
              <p.icon size={24} className="mx-auto mb-3 opacity-80" />
              <p className="font-body font-bold text-sm uppercase tracking-[1px]">{p.label}</p>
              <p className="font-body text-sm mt-1 opacity-90">{p.desc}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </motion.section>

    {/* S7 — Cultural Fit Intro */}
    <motion.section className="py-24 bg-card" initial="hidden" whileInView="visible" viewport={{ once: true }} variants={stagger}>
      <div className="container mx-auto px-4 max-w-[600px] text-center">
        <motion.span variants={fadeUp} className="section-tag">First 90 Days</motion.span>
        <motion.h2 variants={fadeUp} className="font-display text-5xl md:text-6xl">CULTURAL FIT</motion.h2>
        <YellowRule />
        <motion.p variants={fadeUp} className="mt-8 font-body font-bold text-xl text-foreground">
          Remote LaborLink understands you've made a smart hire.
        </motion.p>
        <motion.p variants={fadeUp} className="mt-3 font-body text-lg text-foreground/65">
          Now let's make sure you get maximum value from day one.
        </motion.p>
      </div>
    </motion.section>

    {/* S8 — Cultural Fit Detail */}
    <motion.section className="py-24" initial="hidden" whileInView="visible" viewport={{ once: true }} variants={stagger}>
      <div className="container mx-auto px-4 max-w-4xl">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-0">
          {/* Left col */}
          <motion.div variants={fadeUp} className="md:border-r md:border-border md:pr-10">
            <div className="bg-primary text-primary-foreground rounded-2xl px-6 py-3 font-body font-bold text-[13px] uppercase tracking-[1px] text-center inline-block">
              Bi-Weekly Performance Check-ins
            </div>
            <p className="mt-2 font-body text-sm text-foreground/50 text-center">With LATAM hire</p>
            <div className="mt-8 space-y-0">
              {[
                "Review any blockers, and team feedback",
                "Address any cultural or communication gaps early",
                "Celebrate wins and course-correct quickly",
              ].map((t, i) => (
                <div key={i} className="py-4 border-b border-border flex items-start gap-3 hover:bg-primary/[0.03] transition-colors">
                  <span className="text-primary text-sm mt-0.5">
                    <Gem size={12} />
                  </span>
                  <p className="font-body text-[15px] text-foreground/75">{t}</p>
                </div>
              ))}
            </div>
          </motion.div>
          {/* Right col */}
          <motion.div variants={fadeUp} className="md:pl-10">
            <div className="bg-background text-foreground border border-border rounded-2xl px-6 py-3 font-body font-bold text-[13px] uppercase tracking-[1px] text-center inline-block">
              Monthly Strategic Reviews
            </div>
            <p className="mt-2 font-body text-sm text-foreground/50 text-center">With employee & Startup</p>
            <div className="mt-8 space-y-0">
              {[
                "Review role fit and performance vs KPIs",
                "Gather feedback from both client and LATAM hire",
                "Identify growth opportunities or hiring needs",
              ].map((t, i) => (
                <div key={i} className="py-4 border-b border-border flex items-start gap-3 hover:bg-primary/[0.03] transition-colors">
                  <span className="text-primary text-sm mt-0.5">
                    <Gem size={12} />
                  </span>
                  <p className="font-body text-[15px] text-foreground/75">{t}</p>
                </div>
              ))}
            </div>
          </motion.div>
        </div>
        <motion.div variants={fadeUp} className="mt-8 pt-6 border-t border-border flex items-start gap-3 justify-center">
          <span className="text-primary text-sm"><Gem size={12} /></span>
          <p className="font-body text-[15px] text-foreground/75">Proactive issue resolution before problems escalate</p>
        </motion.div>
      </div>
    </motion.section>

    {/* S9 — Team (Dynamic) */}
    <TeamSection />

    {/* Connect with us */}
    <section className="py-12 bg-card">
      <div className="container mx-auto px-4 text-center">
        <SocialIconRow label="Connect with us" className="flex flex-col items-center" />
      </div>
    </section>

    {/* Partners Carousel */}
    <PartnersCarousel />

    {/* Testimonials (DB-driven only) */}
    <TestimonialsSection />

    {/* S10 — Why LATAM */}
    <motion.section className="py-24" initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-80px" }} variants={stagger}>
      <div className="container mx-auto px-4 max-w-3xl">
        <motion.span variants={fadeUp} className="section-tag">The Case for LATAM</motion.span>
        <motion.h2 variants={fadeUp} className="font-display text-5xl md:text-6xl mb-12">WHY LATAM?</motion.h2>
        <div>
          {latamRows.map((r, i) => (
            <motion.div
              key={i}
              variants={fadeUp}
              className="flex items-center py-7 border-b border-border transition-colors hover:bg-primary/[0.03] group"
            >
              <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center shrink-0 mr-4 group-hover:bg-primary/20 transition-colors">
                <r.icon size={18} className="text-primary" />
              </div>
              <span className="font-body font-semibold text-[15px] text-foreground w-[160px] shrink-0">{r.label}</span>
              <div className="flex-1 mx-4 border-b-2 border-primary/30" />
              <span className="font-body text-[15px] text-foreground/65 text-right">{r.value}</span>
            </motion.div>
          ))}
        </div>
      </div>
    </motion.section>

    {/* S11 — Values Grid */}
    <motion.section className="py-24 bg-card" initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-80px" }} variants={stagger}>
      <div className="container mx-auto px-4">
        <motion.span variants={fadeUp} className="section-tag">Values</motion.span>
        <motion.h2 variants={fadeUp} className="font-display text-5xl md:text-6xl mb-14">WHAT DRIVES US</motion.h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {values.map((v, i) => (
            <motion.div
              key={v.title}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className="card-surface p-8 text-center group hover:border-primary/40 hover:-translate-y-1 transition-all duration-300"
            >
              <div className="w-14 h-14 rounded-2xl bg-primary/10 flex items-center justify-center mx-auto mb-5 group-hover:bg-primary/20 group-hover:scale-110 transition-all duration-300">
                <v.icon size={24} className="text-primary" />
              </div>
              <h3 className="font-display text-2xl text-primary mb-3">{v.title}</h3>
              <p className="text-[15px] text-muted-foreground leading-relaxed">{v.desc}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </motion.section>

    {/* CTA */}
    <section className="py-28 relative overflow-hidden">
      <div className="glow-bg absolute inset-0" />
      <div className="container mx-auto px-4 text-center relative z-10">
        <motion.h2
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="font-display text-6xl md:text-7xl mb-8"
        >
          LET'S WORK TOGETHER
        </motion.h2>
        <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: 0.2 }}>
          <Button asChild size="lg" className="bg-primary text-primary-foreground font-bold text-base px-8 py-6 hover:opacity-90 hover:-translate-y-0.5 transition-all group">
            <Link to="/contact">Get in Touch <ArrowRight size={16} className="ml-2 group-hover:translate-x-1 transition-transform" /></Link>
          </Button>
        </motion.div>
      </div>
    </section>
  </PageLayout>
);

export default About;
