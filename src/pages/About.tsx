import PageLayout from "@/components/PageLayout";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import logoFull from "@/assets/logo-full.png";

const values = [
  { emoji: "💎", title: "Quality", desc: "Every candidate, every process, every interaction reflects our commitment to excellence." },
  { emoji: "🔥", title: "Ownership", desc: "We treat your hiring needs like our own. No hand-offs. No excuses." },
  { emoji: "⚡", title: "Speed", desc: "72-hour candidate delivery. Because the best talent doesn't wait." },
  { emoji: "🔍", title: "Transparency", desc: "Full visibility into our process, your pipeline, and every placement decision." },
];

const About = () => (
  <PageLayout>
    {/* Hero */}
    <section className="py-24 md:py-36">
      <div className="container mx-auto px-4 max-w-3xl text-center">
        <span className="section-tag">About Us</span>
        <h1 className="font-display text-6xl md:text-7xl lg:text-[96px] animate-fade-up">
          BUILT BY <span className="text-primary">OPERATORS.</span>
        </h1>
        <p className="mt-6 text-lg md:text-xl text-muted-foreground animate-fade-up-delay-1 leading-relaxed">
          Remote LaborLink was founded by operators who spent years managing distributed US-LATAM teams. We saw firsthand how broken traditional staffing was — and built something better.
        </p>
      </div>
    </section>

    {/* Logo showcase */}
    <section className="py-12 flex justify-center">
      <img src={logoFull} alt="Remote LaborLink" className="logo-blend h-28 w-auto" />
    </section>

    {/* Mission / Vision */}
    <section className="py-24 bg-card">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="card-surface p-10">
            <span className="section-tag">Mission</span>
            <h2 className="font-display text-3xl md:text-4xl mb-4">BRIDGE US COMPANIES WITH ELITE LATAM TALENT</h2>
            <p className="text-[15px] text-muted-foreground leading-relaxed">
              We exist to connect high-growth US companies with the best professionals Latin America has to offer — through rigorous vetting, structured access, and long-term partnership.
            </p>
          </div>
          <div className="card-surface p-10">
            <span className="section-tag">Vision</span>
            <h2 className="font-display text-3xl md:text-4xl mb-4">BECOME THE MOST TRUSTED NEARSHORE NETWORK</h2>
            <p className="text-[15px] text-muted-foreground leading-relaxed">
              We're building the definitive platform for premium nearshore talent — where quality, speed, and transparency aren't features. They're the standard.
            </p>
          </div>
        </div>
      </div>
    </section>

    {/* Values */}
    <section className="py-24">
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
