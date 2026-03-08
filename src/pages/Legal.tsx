import { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import PageLayout from "@/components/PageLayout";

const tabs = [
  { id: "privacy", label: "Privacy Policy" },
  { id: "terms", label: "Terms of Service" },
  { id: "cookies", label: "Cookie Policy" },
];

const Legal = () => {
  const location = useLocation();
  const [activeTab, setActiveTab] = useState("privacy");

  useEffect(() => {
    const hash = location.hash.replace("#", "");
    if (["privacy", "terms", "cookies"].includes(hash)) {
      setActiveTab(hash);
    }
  }, [location.hash]);

  return (
    <PageLayout>
      <section className="py-20 md:py-28">
        <div className="container mx-auto px-4 max-w-3xl">
          <div className="text-center mb-12">
            <span className="section-tag">Legal</span>
            <h1 className="font-display text-4xl md:text-5xl">LEGAL</h1>
          </div>

          {/* Tabs */}
          <div className="flex gap-6 border-b border-border mb-10">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`pb-3 font-mono text-xs tracking-wider uppercase transition-colors border-b-2 ${
                  activeTab === tab.id
                    ? "text-primary border-primary"
                    : "text-muted-foreground border-transparent hover:text-foreground"
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          {/* Content */}
          <div className="prose-dark space-y-8 text-[15px] leading-[1.8] text-foreground/75">
            {activeTab === "privacy" && <PrivacyContent />}
            {activeTab === "terms" && <TermsContent />}
            {activeTab === "cookies" && <CookiesContent />}
          </div>
        </div>
      </section>
    </PageLayout>
  );
};

const SectionHeading = ({ children }: { children: React.ReactNode }) => (
  <h3 className="font-body font-bold text-lg text-foreground mt-10 mb-3 normal-case">{children}</h3>
);

const PrivacyContent = () => (
  <>
    <p className="text-xs font-mono text-muted-foreground">Effective date: March 2026</p>
    <SectionHeading>1. Who We Are</SectionHeading>
    <p>Remote LaborLink ("we", "us", "our") is a nearshore talent placement company connecting US-based companies with LATAM professionals. Our platform is operated at remotelaborlink.com.</p>
    <SectionHeading>2. What Data We Collect</SectionHeading>
    <p><strong className="text-foreground">From Candidates:</strong> Full name, email, country, city, profile photo, professional information (role, experience, skills, bio, industries), resume (PDF upload), Loom video introduction URL, LinkedIn/portfolio/GitHub links, English proficiency self-assessment, expected monthly rate.</p>
    <p><strong className="text-foreground">From Companies:</strong> Company name, email, website, size, industry, contact person name, role request details including budget, responsibilities, and skills needed.</p>
    <p><strong className="text-foreground">From All Users:</strong> Login credentials (email and hashed password via authentication), session data and browser metadata for security purposes, messages sent through the platform.</p>
    <SectionHeading>3. How We Use Your Data</SectionHeading>
    <p>To operate the platform and match candidates to companies. To communicate with you about your application or hiring request. To verify company accounts and prevent fraudulent signups. To improve platform performance and user experience. We do not sell your data to third parties. Ever.</p>
    <SectionHeading>4. Data Sharing</SectionHeading>
    <p>Candidate profiles (excluding contact info) may be shared with approved company clients through the Client Talent Portal, only when explicitly pushed by our admin team. Candidate contact information is never shared directly with companies — all communication routes through Remote LaborLink.</p>
    <SectionHeading>5. Data Retention</SectionHeading>
    <p>Active accounts: retained while the account is active. Rejected or inactive candidate profiles: retained for 12 months, then deleted. Company accounts: retained while the engagement is active. You may request deletion of your data at any time by contacting hello@remotelaborlink.com.</p>
    <SectionHeading>6. Your Rights</SectionHeading>
    <p>You have the right to access, correct, or delete your personal data. To exercise these rights, email hello@remotelaborlink.com. We will respond within 10 business days.</p>
    <SectionHeading>7. Cookies</SectionHeading>
    <p>We use minimal cookies for session management and analytics. See our Cookie Policy for details.</p>
    <SectionHeading>8. Security</SectionHeading>
    <p>All data is encrypted in transit (HTTPS/TLS). Resumes and files are stored in private storage buckets with access controls. Passwords are hashed and never stored in plain text.</p>
    <SectionHeading>9. Contact</SectionHeading>
    <p>Remote LaborLink · hello@remotelaborlink.com</p>
  </>
);

const TermsContent = () => (
  <>
    <p className="text-xs font-mono text-muted-foreground">Effective date: March 2026</p>
    <SectionHeading>1. Acceptance</SectionHeading>
    <p>By accessing or using the Remote LaborLink platform, you agree to these Terms. If you do not agree, do not use the platform.</p>
    <SectionHeading>2. Platform Description</SectionHeading>
    <p>Remote LaborLink provides a talent matching platform connecting US companies with LATAM professionals. We facilitate introductions, vetting, and communication — we are not an employer of record and do not guarantee employment outcomes.</p>
    <SectionHeading>3. Candidate Terms</SectionHeading>
    <p>You must provide accurate, truthful information in your profile and application. You must be located in Latin America to apply as a candidate. Submitting false credentials or misrepresenting your experience will result in immediate removal. Acceptance into our talent pool does not guarantee placement. You grant Remote LaborLink the right to share your profile (excluding direct contact info) with approved company clients through our private portal.</p>
    <SectionHeading>4. Company Terms</SectionHeading>
    <p>You must register with a valid company email address. You may only use the platform to source talent for legitimate business roles. You may not contact candidates directly outside the platform during the engagement period. Candidate profiles shared through the portal are confidential. You may not redistribute, copy, or share them outside your hiring team. Placement fees and engagement terms are agreed separately in a signed contract.</p>
    <SectionHeading>5. Admin Rights</SectionHeading>
    <p>Remote LaborLink reserves the right to approve, reject, or suspend any candidate or company account at our discretion, without notice, if we determine misuse or violation of these Terms.</p>
    <SectionHeading>6. Intellectual Property</SectionHeading>
    <p>All platform content, design, copy, and branding — including the Remote LaborLink logo and "We Place People, Not Resumes" tagline — are the exclusive property of Remote LaborLink. You may not reproduce or use them without written permission.</p>
    <SectionHeading>7. Limitation of Liability</SectionHeading>
    <p>Remote LaborLink is not liable for hiring decisions, employment outcomes, or disputes between companies and placed candidates. Our liability is limited to the fees paid for the relevant placement.</p>
    <SectionHeading>8. Modifications</SectionHeading>
    <p>We may update these Terms at any time. Continued use of the platform after changes constitutes acceptance. We will notify active users of material changes by email.</p>
    <SectionHeading>9. Governing Law</SectionHeading>
    <p>These Terms are governed by applicable law. Disputes will be resolved through good-faith negotiation first, then binding arbitration if needed.</p>
    <SectionHeading>10. Contact</SectionHeading>
    <p>Remote LaborLink · hello@remotelaborlink.com</p>
  </>
);

const CookiesContent = () => (
  <>
    <p className="text-xs font-mono text-muted-foreground">Effective date: March 2026</p>
    <SectionHeading>1. What Are Cookies</SectionHeading>
    <p>Cookies are small text files stored in your browser when you visit a website. We use them only for what's necessary to operate the platform.</p>
    <SectionHeading>2. Cookies We Use</SectionHeading>
    <div className="overflow-x-auto">
      <table className="w-full text-sm border border-border rounded-lg overflow-hidden">
        <thead>
          <tr className="bg-card">
            <th className="text-left px-4 py-2 text-xs font-mono text-muted-foreground uppercase">Cookie</th>
            <th className="text-left px-4 py-2 text-xs font-mono text-muted-foreground uppercase">Purpose</th>
            <th className="text-left px-4 py-2 text-xs font-mono text-muted-foreground uppercase">Duration</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-border">
          <tr><td className="px-4 py-2 font-mono text-xs">sb-auth-token</td><td className="px-4 py-2">Session authentication</td><td className="px-4 py-2">Session</td></tr>
          <tr><td className="px-4 py-2 font-mono text-xs">rl_session</td><td className="px-4 py-2">Platform session management</td><td className="px-4 py-2">Session</td></tr>
          <tr><td className="px-4 py-2 font-mono text-xs">rl_analytics</td><td className="px-4 py-2">Anonymous usage analytics (no PII)</td><td className="px-4 py-2">30 days</td></tr>
          <tr><td className="px-4 py-2 font-mono text-xs">rl_cookie_consent</td><td className="px-4 py-2">Stores your cookie preference</td><td className="px-4 py-2">1 year</td></tr>
        </tbody>
      </table>
    </div>
    <SectionHeading>3. What We Don't Do</SectionHeading>
    <p>We do not use advertising cookies. We do not use third-party tracking cookies. We do not sell cookie data. We do not fingerprint users.</p>
    <SectionHeading>4. Your Choices</SectionHeading>
    <p>On your first visit, you will see a cookie consent banner. You may accept all cookies or accept essential cookies only. You can change your preference at any time in your account settings or by clearing your browser cookies.</p>
    <SectionHeading>5. Third-Party Services</SectionHeading>
    <p>We use secure cloud services for authentication and database. They may set their own cookies as part of their infrastructure. We use no advertising networks or social tracking pixels.</p>
    <SectionHeading>6. Contact</SectionHeading>
    <p>Remote LaborLink · hello@remotelaborlink.com</p>
  </>
);

export default Legal;
