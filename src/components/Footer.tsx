import { Link } from "react-router-dom";
import logoFull from "@/assets/logo-full.png";

const Footer = () => (
  <footer className="border-t border-border bg-background">
    <div className="px-[5%] py-12">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
        <div>
          <Link to="/" className="block mb-4">
            <img src={logoFull} alt="Remote LaborLink" className="logo-blend h-20 w-auto" />
          </Link>
          <p className="text-sm text-muted-foreground">We Place People, Not Resumes.</p>
        </div>
        <div>
          <h4 className="font-body font-bold text-sm mb-3 text-foreground normal-case">Company</h4>
          <div className="space-y-2 text-sm text-muted-foreground">
            <Link to="/about" className="block hover:text-foreground transition-colors">About</Link>
            <Link to="/contact" className="block hover:text-foreground transition-colors">Contact</Link>
          </div>
        </div>
        <div>
          <h4 className="font-body font-bold text-sm mb-3 text-foreground normal-case">Services</h4>
          <div className="space-y-2 text-sm text-muted-foreground">
            <Link to="/for-companies" className="block hover:text-foreground transition-colors">For Companies</Link>
            <Link to="/for-talent" className="block hover:text-foreground transition-colors">For Talent</Link>
          </div>
        </div>
        <div>
          <h4 className="font-body font-bold text-sm mb-3 text-foreground normal-case">Access</h4>
          <div className="space-y-2 text-sm text-muted-foreground">
            <Link to="/login/company" className="block hover:text-foreground transition-colors">Client Portal</Link>
            <Link to="/signup/talent" className="block hover:text-foreground transition-colors">Apply as Talent</Link>
            <Link to="/signup/company" className="block hover:text-foreground transition-colors">Hire Talent</Link>
          </div>
        </div>
      </div>
    </div>
    {/* Legal bar */}
    <div className="border-t border-border px-[5%] py-6 flex flex-col sm:flex-row items-center justify-between gap-2">
      <span className="font-mono text-[11px] text-muted-foreground">
        © {new Date().getFullYear()} Remote LaborLink. All rights reserved.
      </span>
      <div className="flex items-center gap-4 font-mono text-[11px] text-muted-foreground">
        <Link to="/legal#privacy" className="hover:text-foreground transition-colors">Privacy Policy</Link>
        <span>·</span>
        <Link to="/legal#terms" className="hover:text-foreground transition-colors">Terms of Service</Link>
        <span>·</span>
        <Link to="/legal#cookies" className="hover:text-foreground transition-colors">Cookie Policy</Link>
      </div>
    </div>
  </footer>
);

export default Footer;
