import PageLayout from "@/components/PageLayout";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { ArrowRight, MessageCircle, Target, Flame, DollarSign, Handshake, Building2, Shield } from "lucide-react";
import { motion } from "framer-motion";
import TestimonialsSection from "@/components/TestimonialsSection";

const fadeUp = { hidden: { opacity: 0, y: 30 }, visible: { opacity: 1, y: 0 } };
const stagger = { visible: { transition: { staggerChildren: 0.1 } } };

const expectations = [
  { icon: MessageCircle, title: "English Fluency", desc: "You communicate clearly in English — written and verbal. No exceptions." },
  { icon: Target, title: "Senior Experience", desc: "You have 3+ years in your field with demonstrable results." },
  { icon: Flame, title: "Ownership Mindset", desc: "You work autonomously, meet deadlines, and take pride in your craft." },
];

const benefits = [
  { icon: DollarSign, title: "Better Pay", desc: "Access US-level compensation through premium client placements." },
  { icon: Handshake, title: "Long-Term Roles", desc: "We focus on placements that last years, not months." },
  { icon: Building2, title: "Quality Clients", desc: "Work with funded US startups and established mid-market companies." },
  { icon: Shield, title: "Career Support", desc: "Ongoing check-ins, performance reviews, and growth opportunities." },
];

const process = [
  { num: "01", title: "Apply", desc: "Fill out your profile, upload your resume, and record a short Loom intro." },
  { num: "02", title: "Get Vetted", desc: "Our team reviews your application, conducts a screening call, and verifies your skills." },
  { num: "03", title: "Get Matched", desc: "We match you with companies looking for your exact skillset and experience." },
  { num: "04", title: "Start Working", desc: "Begin your new role with ongoing support from our team for the first 90 days." },
];

const ForTalent = () => (
  <PageLayout>
    {/* Hero */}
    <section className="py-24 md:py-36 relative overflow-hidden">
      <div className="absolute inset-0 glow-bg opacity-30" />
      <div className="container mx-auto px-4 max-w-3xl text-center relative z-10">
        <motion.div initial="hidden" animate="visible" variants={stagger}>
          <span className="section-tag">For Talent</span>
          <motion.h1 variants={fadeUp} className="font-display text-6xl md:text-7xl lg:text-[96px]">
            WORK WITH THE BEST <span className="text-primary">US TEAMS.</span>
          </motion.h1>
          <motion.p variants={fadeUp} className="mt-6 text-lg md:text-xl text-muted-foreground leading-relaxed">
            Join a curated network of elite LATAM professionals placed with top US companies. Better pay, long-term roles, real career growth.
          </motion.p>
          <motion.div variants={fadeUp} className="mt-10">
            <Button asChild size="lg" className="bg-primary text-primary-foreground font-bold text-base px-8 py-6 hover:opacity-90 hover:-translate-y-0.5 transition-all group">
              <Link to="/signup/talent">Apply Now <ArrowRight size={16} className="ml-2 group-hover:translate-x-1 transition-transform" /></Link>
            </Button>
          </motion.div>
        </motion.div>
      </div>
    </section>

    {/* Expectations */}
    <section className="py-24 bg-card">
      <div className="container mx-auto px-4">
        <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={stagger}>
          <span className="section-tag">What We Expect</span>
          <h2 className="font-display text-5xl md:text-6xl mb-14">OUR STANDARD IS HIGH</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {expectations.map((e) => (
              <motion.div key={e.title} variants={fadeUp} className="card-surface p-8 hover:border-primary/40 transition-colors group">
                <div className="w-12 h-12 rounded-2xl bg-primary/10 flex items-center justify-center mb-4 group-hover:bg-primary/20 transition-colors">
                  <e.icon size={24} className="text-primary" />
                </div>
                <h3 className="font-display text-2xl mb-3">{e.title}</h3>
                <p className="text-[15px] text-muted-foreground leading-relaxed">{e.desc}</p>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </section>

    {/* How It Works */}
    <section className="py-24">
      <div className="container mx-auto px-4">
        <span className="section-tag">Your Journey</span>
        <h2 className="font-display text-5xl md:text-6xl mb-16">HOW IT WORKS</h2>
        <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={stagger} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {process.map((step) => (
            <motion.div key={step.num} variants={fadeUp} className="relative group">
              <div className="font-display text-7xl text-primary/10 group-hover:text-primary/20 transition-colors">{step.num}</div>
              <h3 className="font-display text-2xl mb-2 -mt-2">{step.title}</h3>
              <p className="text-[15px] text-muted-foreground leading-relaxed">{step.desc}</p>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>

    {/* Benefits */}
    <section className="py-24 bg-card">
      <div className="container mx-auto px-4">
        <span className="section-tag">Why Join</span>
        <h2 className="font-display text-5xl md:text-6xl mb-14">WHAT YOU GET</h2>
        <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={stagger} className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          {benefits.map((b) => (
            <motion.div key={b.title} variants={fadeUp} className="card-surface p-8 hover:border-primary hover:-translate-y-1 transition-all duration-300 group">
              <div className="w-12 h-12 rounded-2xl bg-primary/10 flex items-center justify-center mb-4 group-hover:bg-primary/20 group-hover:scale-110 transition-all">
                <b.icon size={24} className="text-primary" />
              </div>
              <h3 className="font-display text-2xl mb-3">{b.title}</h3>
              <p className="text-[15px] text-muted-foreground leading-relaxed">{b.desc}</p>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>

    {/* Testimonials (DB-driven only) */}
    <TestimonialsSection />

    {/* CTA */}
    <section className="py-28 relative overflow-hidden">
      <div className="glow-bg absolute inset-0" />
      <div className="container mx-auto px-4 text-center relative z-10">
        <motion.h2 initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="font-display text-6xl md:text-7xl mb-4">
          APPLY. GET VETTED. <span className="text-primary">GET PLACED.</span>
        </motion.h2>
        <p className="text-muted-foreground text-lg mb-8">The process starts with a single application.</p>
        <Button asChild size="lg" className="bg-primary text-primary-foreground font-bold text-base px-8 py-6 hover:opacity-90 hover:-translate-y-0.5 transition-all group">
          <Link to="/signup/talent">Apply Now <ArrowRight size={16} className="ml-2 group-hover:translate-x-1 transition-transform" /></Link>
        </Button>
      </div>
    </section>
  </PageLayout>
);

export default ForTalent;
