import { Link } from "react-router-dom";
import logoFull from "@/assets/logo-full.png";

const Footer = () => (
  <footer className="border-t border-border bg-background py-12">
    <div className="container mx-auto px-4">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
        <div>
          <Link to="/" className="block mb-4">
            <img src={logoFull} alt="Remote LaborLink" className="h-20 w-auto" />
          </Link>
          <p className="text-sm text-muted-foreground">We Place People, Not Resumes.</p>
        </div>
        <div>
          <h4 className="font-display text-sm mb-3 text-foreground">Company</h4>
          <div className="space-y-2 text-sm text-muted-foreground">
            <Link to="/about" className="block hover:text-primary transition-colors">About</Link>
            <Link to="/contact" className="block hover:text-primary transition-colors">Contact</Link>
          </div>
        </div>
        <div>
          <h4 className="font-display text-sm mb-3 text-foreground">Services</h4>
          <div className="space-y-2 text-sm text-muted-foreground">
            <Link to="/for-companies" className="block hover:text-primary transition-colors">For Companies</Link>
            <Link to="/for-talent" className="block hover:text-primary transition-colors">For Talent</Link>
          </div>
        </div>
        <div>
          <h4 className="font-display text-sm mb-3 text-foreground">Access</h4>
          <div className="space-y-2 text-sm text-muted-foreground">
            <Link to="/client-portal" className="block hover:text-primary transition-colors">Client Portal</Link>
          </div>
        </div>
      </div>
      <div className="mt-12 pt-8 border-t border-border text-center text-xs text-muted-foreground font-mono">
        © {new Date().getFullYear()} Remote LaborLink. All rights reserved.
      </div>
    </div>
  </footer>
);

export default Footer;
