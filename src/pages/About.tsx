import PageLayout from "@/components/PageLayout";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import logoIcon from "@/assets/logo-icon.png";
import TeamSection from "@/components/TeamSection";
import PartnersCarousel from "@/components/PartnersCarousel";
import TestimonialsSection from "@/components/TestimonialsSection";

const values = [
  { emoji: "💎", title: "Quality", desc: "Every candidate, every process, every interaction reflects our commitment to excellence." },
  { emoji: "🔥", title: "Ownership", desc: "We treat your hiring needs like our own. No hand-offs. No excuses." },
  { emoji: "⚡", title: "Speed", desc: "72-hour candidate delivery. Because the best talent doesn't wait." },
  { emoji: "🔍", title: "Transparency", desc: "Full visibility into our process, your pipeline, and every placement decision." },
];

const coreValues = [
  { name: "Human Intelligence vs AI", desc: "We prioritize values, communication, and long-term fit. Great teams are built on people, not profiles." },
  { name: "Agile Recruiting", desc: "We adapt with your evolving needs, combining speed with flexibility to find the right fit at the right time." },
  { name: "Partnership, Over Transactions.", desc: "We partner with startups as they grow, thinking long-term, not just about the next hire." },
  { name: "Culture-Driven, Remote Work.", desc: "It's about the momentum of collaboration, and building global teams that value time, culture, and talent." },
];

const latamRows = [
  { label: "Time Zone", value: "1–4 hours from US (real-time collaboration)" },
  { label: "Cultural Fit", value: "Western business culture, similar work expectations" },
  { label: "English Proficiency", value: "Higher baseline in professional roles" },
  { label: "Cost", value: "50–70% savings vs US market rates" },
];

const YellowRule = () => (
  <div className="w-[60px] h-[2px] bg-primary mx-auto my-3" />
);

const About = () => (
  <PageLayout>
    {/* S1 — Hero */}
    <section className="py-24 md:py-36">
      <div className="container mx-auto px-4 max-w-3xl text-center">
        <span className="section-tag">About Remote LaborLink</span>
        <h1 className="font-display text-6xl md:text-7xl lg:text-[96px] animate-fade-up">
          BUILT BY <span className="text-primary">OPERATORS.</span><br />
          DRIVEN BY <span className="text-primary">PEOPLE.</span>
        </h1>
        <p className="mt-6 text-lg md:text-xl text-muted-foreground animate-fade-up-delay-1 leading-relaxed max-w-2xl mx-auto">
          We've managed distributed teams, made bad hires, fixed broken processes, and built something better because of it.
        </p>
      </div>
    </section>

    {/* S2 — Mission */}
    <section className="py-24">
      <div className="container mx-auto px-4 max-w-[680px] text-center">
        <span className="section-tag">Core Purpose</span>
        <h2 className="font-display text-5xl md:text-6xl">MISSION</h2>
        <YellowRule />
        <p className="mt-8 text-xl font-body leading-[1.8] text-foreground/80">
          Partner with ambitious <strong className="text-foreground">startups</strong> by connecting them with{" "}
          <strong className="text-foreground">exceptional</strong> remote LATAM{" "}
          <strong className="text-foreground">talent</strong>, driving long-term growth and mutual success.
        </p>
        <img src={logoIcon} alt="Remote LaborLink" className="logo-blend w-12 h-auto mx-auto mt-8" />
      </div>
    </section>

    {/* S3 — Vision */}
    <section className="py-24 bg-card">
      <div className="container mx-auto px-4 max-w-[680px] text-center">
        <span className="section-tag">Where We're Going</span>
        <h2 className="font-display text-5xl md:text-6xl">VISION</h2>
        <YellowRule />
        <p className="mt-8 text-xl font-body leading-[1.8] text-foreground/80">
          To become the most trusted remote <strong className="text-foreground">talent partner</strong> for startups,
          elevating global teams, building cross-border collaboration, and unlocking opportunity through remote work.
        </p>
        <img src={logoIcon} alt="Remote LaborLink" className="logo-blend w-12 h-auto mx-auto mt-8" />
      </div>
    </section>

    {/* S4 — Values (2 col) */}
    <section className="py-24">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 md:gap-20">
          <div>
            <h2 className="font-display text-5xl md:text-6xl">VALUES</h2>
            <div className="w-[60px] h-[2px] bg-primary my-3" />
            <p className="mt-6 text-lg font-body text-foreground/70">
              These are the values you can partner with, live by, and hire by.
            </p>
          </div>
          <div>
            {coreValues.map((v, i) => (
              <div key={i} className="py-6 border-b border-border">
                <div className="flex items-start gap-3">
                  <span className="text-primary text-xs mt-1">■</span>
                  <div>
                    <p className="font-body font-bold text-xl text-foreground">{v.name}</p>
                    <p className="font-body italic text-sm text-foreground/55 mt-1">{v.desc}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>

    {/* S5 — How We Hire */}
    <section className="py-24 bg-card">
      <div className="container mx-auto px-4 text-center">
        <h2 className="font-display text-5xl md:text-6xl">HOW WE HIRE?</h2>
        <div className="mt-8 inline-block bg-primary text-primary-foreground font-body font-bold text-[13px] uppercase tracking-[2px] rounded-full px-8 py-3">
          Hiring Philosophy
        </div>
        <p className="mt-6 text-base font-body text-foreground/60 max-w-lg mx-auto">
          We don't start recruiting when you sign with us.
        </p>
        <div className="mt-12 flex flex-col md:flex-row items-center justify-center gap-6">
          {[
            <>We maintain a continuously <strong>qualified pool</strong> of remote professionals.</>,
            <>Already screened, assessed, and <strong>ready to work</strong> with international clients.</>,
            <>This allows us to move quickly while maintaining consistently high quality.</>,
          ].map((text, i) => (
            <div key={i} className="bg-foreground text-background rounded-full px-8 py-7 font-body text-[15px] text-center max-w-[280px]">
              {text}
            </div>
          ))}
        </div>
      </div>
    </section>

    {/* S6 — Core Principles */}
    <section className="py-24">
      <div className="container mx-auto px-4 text-center">
        <h2 className="font-display text-5xl md:text-6xl">HOW WE HIRE?</h2>
        <p className="mt-4 text-base font-body text-foreground/60">Our process is designed around three</p>
        <div className="mt-4 inline-block bg-foreground text-background font-body font-bold text-[13px] uppercase tracking-[2px] rounded-full px-8 py-3">
          Core Principles
        </div>
        <div className="mt-12 flex flex-col md:flex-row items-center justify-center gap-6">
          {[
            { label: "SPEED", desc: "Shortlists in days, not weeks" },
            { label: "QUALITY", desc: "Multi-layer vetting before you ever see a candidate" },
            { label: "FIT", desc: "Skills, communication, and culture all matter" },
          ].map((p, i) => (
            <div key={i} className={`bg-primary text-primary-foreground rounded-full px-9 py-7 text-center max-w-[280px] ${i === 1 ? 'scale-105' : ''}`}>
              <p className="font-body font-bold text-sm uppercase tracking-[1px]">{p.label}</p>
              <p className="font-body text-sm mt-1">{p.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>

    {/* S7 — Cultural Fit Intro */}
    <section className="py-24 bg-card">
      <div className="container mx-auto px-4 max-w-[600px] text-center">
        <span className="section-tag">First 90 Days</span>
        <h2 className="font-display text-5xl md:text-6xl">CULTURAL FIT</h2>
        <YellowRule />
        <p className="mt-8 font-body font-bold text-xl text-foreground">
          Remote LaborLink understands you've made a smart hire.
        </p>
        <p className="mt-3 font-body text-lg text-foreground/65">
          Now let's make sure you get maximum value from day one.
        </p>
      </div>
    </section>

    {/* S8 — Cultural Fit Detail */}
    <section className="py-24">
      <div className="container mx-auto px-4 max-w-4xl">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-0">
          {/* Left col */}
          <div className="md:border-r md:border-border md:pr-10">
            <div className="bg-primary text-primary-foreground rounded-full px-6 py-3 font-body font-bold text-[13px] uppercase tracking-[1px] text-center inline-block">
              Bi-Weekly Performance Check-ins
            </div>
            <p className="mt-2 font-body text-sm text-foreground/50 text-center">With LATAM hire</p>
            <div className="mt-8 space-y-0">
              {[
                "Review any blockers, and team feedback",
                "Address any cultural or communication gaps early",
                "Celebrate wins and course-correct quickly",
              ].map((t, i) => (
                <div key={i} className="py-4 border-b border-border flex items-start gap-3">
                  <span className="text-primary text-sm">✦</span>
                  <p className="font-body text-[15px] text-foreground/75">{t}</p>
                </div>
              ))}
            </div>
          </div>
          {/* Right col */}
          <div className="md:pl-10">
            <div className="bg-background text-foreground border border-border rounded-full px-6 py-3 font-body font-bold text-[13px] uppercase tracking-[1px] text-center inline-block">
              Monthly Strategic Reviews
            </div>
            <p className="mt-2 font-body text-sm text-foreground/50 text-center">With employee & Startup</p>
            <div className="mt-8 space-y-0">
              {[
                "Review role fit and performance vs KPIs",
                "Gather feedback from both client and LATAM hire",
                "Identify growth opportunities or hiring needs",
              ].map((t, i) => (
                <div key={i} className="py-4 border-b border-border flex items-start gap-3">
                  <span className="text-primary text-sm">✦</span>
                  <p className="font-body text-[15px] text-foreground/75">{t}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
        {/* Bottom shared row */}
        <div className="mt-8 pt-6 border-t border-border flex items-start gap-3 justify-center">
          <span className="text-primary text-sm">✦</span>
          <p className="font-body text-[15px] text-foreground/75">Proactive issue resolution before problems escalate</p>
        </div>
      </div>
    </section>

    {/* S9 — Team */}
    <section className="py-24 bg-card">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <span className="section-tag">The Team</span>
          <h2 className="font-display text-5xl md:text-6xl">
            WHO IS BEHIND<br />
            <span className="text-primary">REMOTE LABORLINK.</span>
          </h2>
          <p className="mt-4 font-body text-lg text-foreground/60 max-w-lg mx-auto">
            Built by operators who've lived both sides of the hiring problem.
          </p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
          {teamMembers.map((m) => (
            <div
              key={m.name}
              className="relative pt-[70px] group"
            >
              {/* Photo / initials circle */}
              <div className="absolute top-0 left-1/2 -translate-x-1/2 z-10">
                <div className="avatar-initials-lg" style={{ border: '3px solid hsl(var(--primary))' }}>
                  {m.initials}
                </div>
              </div>
              {/* Card */}
              <div className="card-surface rounded-xl p-8 pt-16 text-center h-full transition-all duration-300 group-hover:border-primary group-hover:-translate-y-1">
                {/* Role badge */}
                <div className="inline-block border border-primary text-primary font-body text-xs font-bold uppercase tracking-[1px] rounded-full px-4 py-1.5 mb-4">
                  {m.role}
                </div>
                {/* Bullets */}
                <ul className="text-left space-y-2 mb-6">
                  {m.bullets.map((b, i) => (
                    <li key={i} className="flex items-start gap-2 text-[14px] font-body text-foreground/70">
                      <span className="text-primary mt-0.5 text-xs">•</span>
                      {b}
                    </li>
                  ))}
                </ul>
                {/* Quote */}
                <p className="font-body italic text-sm text-muted-foreground mb-4">"{m.quote}"</p>
                {/* Name */}
                <p className="font-display text-[28px] text-foreground">{m.name}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>

    {/* S10 — Why LATAM */}
    <section className="py-24">
      <div className="container mx-auto px-4 max-w-3xl">
        <span className="section-tag">The Case for LATAM</span>
        <h2 className="font-display text-5xl md:text-6xl mb-12">WHY LATAM?</h2>
        <div>
          {latamRows.map((r, i) => (
            <div
              key={i}
              className="flex items-center py-7 border-b border-border transition-colors hover:bg-primary/[0.03]"
            >
              <span className="font-body font-semibold text-[15px] text-foreground w-[200px] shrink-0">{r.label}</span>
              <div className="flex-1 mx-6 border-b-2 border-primary/60" />
              <span className="font-body text-[15px] text-foreground/65 text-right">{r.value}</span>
            </div>
          ))}
        </div>
      </div>
    </section>

    {/* S11 — Values Grid */}
    <section className="py-24 bg-card">
      <div className="container mx-auto px-4">
        <span className="section-tag">Values</span>
        <h2 className="font-display text-5xl md:text-6xl mb-14">WHAT DRIVES US</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {values.map((v) => (
            <div key={v.title} className="card-surface p-8 text-center">
              <div className="text-3xl mb-4">{v.emoji}</div>
              <h3 className="font-display text-2xl text-primary mb-3">{v.title}</h3>
              <p className="text-[15px] text-muted-foreground leading-relaxed">{v.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>

    {/* CTA */}
    <section className="py-28 relative overflow-hidden">
      <div className="glow-bg absolute inset-0" />
      <div className="container mx-auto px-4 text-center relative z-10">
        <h2 className="font-display text-6xl md:text-7xl mb-8">LET'S WORK TOGETHER</h2>
        <Button asChild size="lg" className="bg-primary text-primary-foreground font-bold text-base px-8 py-6 hover:opacity-90 hover:-translate-y-0.5 transition-all">
          <Link to="/contact">Get in Touch</Link>
        </Button>
      </div>
    </section>
  </PageLayout>
);

export default About;
