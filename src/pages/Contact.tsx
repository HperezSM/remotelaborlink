import PageLayout from "@/components/PageLayout";
import { Button } from "@/components/ui/button";
import { Calendar, Mail } from "lucide-react";
import { useState, useEffect } from "react";
import { SocialIconRow, contactInfo } from "@/components/SocialLinks";

const Contact = () => {
  const [form, setForm] = useState({ name: "", company: "", email: "", type: "", message: "" });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  return (
    <PageLayout>
      <section className="py-20 md:py-28">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <span className="section-tag">Contact</span>
            <h1 className="font-display text-5xl md:text-7xl animate-fade-up">LET'S TALK</h1>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 max-w-5xl mx-auto">
            {/* Form */}
            <div className="card-surface p-8">
              <h2 className="font-display text-2xl mb-6">SEND US A MESSAGE</h2>
              <form className="space-y-4" onSubmit={(e) => e.preventDefault()}>
                <div>
                  <label className="text-xs font-mono text-muted-foreground uppercase tracking-wider mb-1 block">Name</label>
                  <input name="name" value={form.name} onChange={handleChange} placeholder="Your full name"
                    className="w-full bg-background border border-border rounded-lg px-4 py-3 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary" />
                </div>
                <div>
                  <label className="text-xs font-mono text-muted-foreground uppercase tracking-wider mb-1 block">Company / Role</label>
                  <input name="company" value={form.company} onChange={handleChange} placeholder="Company name or current role"
                    className="w-full bg-background border border-border rounded-lg px-4 py-3 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary" />
                </div>
                <div>
                  <label className="text-xs font-mono text-muted-foreground uppercase tracking-wider mb-1 block">Email</label>
                  <input name="email" type="email" value={form.email} onChange={handleChange} placeholder="you@company.com"
                    className="w-full bg-background border border-border rounded-lg px-4 py-3 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary" />
                </div>
                <div>
                  <label className="text-xs font-mono text-muted-foreground uppercase tracking-wider mb-1 block">I am a</label>
                  <select name="type" value={form.type} onChange={handleChange}
                    className="w-full bg-background border border-border rounded-lg px-4 py-3 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary">
                    <option value="">Select one...</option>
                    <option value="company">US Company</option>
                    <option value="talent">LATAM Professional</option>
                  </select>
                </div>
                <div>
                  <label className="text-xs font-mono text-muted-foreground uppercase tracking-wider mb-1 block">Message</label>
                  <textarea name="message" value={form.message} onChange={handleChange} rows={4} placeholder="Tell us about your needs..."
                    className="w-full bg-background border border-border rounded-lg px-4 py-3 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary resize-none" />
                </div>
                <Button variant="hero" size="lg" className="w-full">
                  Send Message
                </Button>
              </form>
            </div>

            {/* Right side: Calendly + Contact info */}
            <div className="flex flex-col gap-8">
              <div className="card-surface rounded-lg overflow-hidden w-full">
                <div
                  className="calendly-inline-widget"
                  data-url="https://calendly.com/team-remotelaborlink/30min"
                  style={{ minWidth: "320px", height: "700px" }}
                />
              </div>

              {/* Contact details & social */}
              <div className="card-surface p-8">
                <h3 className="font-display text-lg mb-4">REACH US DIRECTLY</h3>
                <div className="space-y-3 mb-6">
                  <a href={`mailto:${contactInfo.email}`} className="flex items-center gap-3 text-sm text-muted-foreground hover:text-foreground transition-colors">
                    <Mail size={16} className="text-primary" /> {contactInfo.email}
                  </a>
                </div>
                <SocialIconRow label="Follow us" />
              </div>
            </div>
          </div>
        </div>
      </section>
    </PageLayout>
  );
};

export default Contact;
