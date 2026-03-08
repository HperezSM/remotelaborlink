import PageLayout from "@/components/PageLayout";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

const expectations = [
  { emoji: "🗣️", title: "English Fluency", desc: "You communicate clearly in English — written and verbal. No exceptions." },
  { emoji: "🎯", title: "Senior Experience", desc: "You have 3+ years in your field with demonstrable results." },
  { emoji: "🔥", title: "Ownership Mindset", desc: "You work autonomously, meet deadlines, and take pride in your craft." },
];

const benefits = [
  { emoji: "💰", title: "Better Pay", desc: "Access US-level compensation through premium client placements." },
  { emoji: "🤝", title: "Long-Term Roles", desc: "We focus on placements that last years, not months." },
  { emoji: "🏢", title: "Quality Clients", desc: "Work with funded US startups and established mid-market companies." },
];

const ForTalent = () => (
  <PageLayout>
    {/* Hero */}
    <section className="py-24 md:py-36">
      <div className="container mx-auto px-4 max-w-3xl text-center">
        <span className="section-tag">For Talent</span>
        <h1 className="font-display text-6xl md:text-7xl lg:text-[96px] animate-fade-up">
          WORK WITH THE BEST <span className="text-primary">US TEAMS.</span>
        </h1>
        <p className="mt-6 text-lg md:text-xl text-muted-foreground animate-fade-up-delay-1 leading-relaxed">
          Join a curated network of elite LATAM professionals placed with top US companies.
        </p>
        <div className="mt-10 animate-fade-up-delay-2">
          <Button asChild size="lg" className="bg-primary text-primary-foreground font-bold text-base px-8 py-6 hover:opacity-90 hover:-translate-y-0.5 transition-all">
            <Link to="/signup/talent">Apply Now</Link>
          </Button>
        </div>
      </div>
    </section>

    {/* Expectations */}
    <section className="py-24 bg-card">
      <div className="container mx-auto px-4">
        <span className="section-tag">What We Expect</span>
        <h2 className="font-display text-5xl md:text-6xl mb-14">OUR STANDARD IS HIGH</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {expectations.map((e) => (
            <div key={e.title} className="card-surface p-8">
              <div className="text-3xl mb-4">{e.emoji}</div>
              <h3 className="font-display text-2xl mb-3">{e.title}</h3>
              <p className="text-[15px] text-muted-foreground leading-relaxed">{e.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>

    {/* Benefits */}
    <section className="py-24">
      <div className="container mx-auto px-4">
        <span className="section-tag">Why Join</span>
        <h2 className="font-display text-5xl md:text-6xl mb-14">WHAT YOU GET</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {benefits.map((b) => (
            <div key={b.title} className="card-surface p-8 hover:border-primary transition-colors">
              <div className="text-3xl mb-4">{b.emoji}</div>
              <h3 className="font-display text-2xl mb-3">{b.title}</h3>
              <p className="text-[15px] text-muted-foreground leading-relaxed">{b.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>

    {/* CTA */}
    <section className="py-28 relative overflow-hidden">
      <div className="glow-bg absolute inset-0" />
      <div className="container mx-auto px-4 text-center relative z-10">
        <h2 className="font-display text-6xl md:text-7xl mb-4">APPLY. GET VETTED. GET PLACED.</h2>
        <p className="text-muted-foreground text-lg mb-8">The process starts with a single application.</p>
        <Button asChild size="lg" className="bg-primary text-primary-foreground font-bold text-base px-8 py-6 hover:opacity-90 hover:-translate-y-0.5 transition-all">
          <Link to="/signup/talent">Apply Now</Link>
        </Button>
      </div>
    </section>
  </PageLayout>
);

export default ForTalent;
