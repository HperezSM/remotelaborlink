import { Link, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Menu, X } from "lucide-react";
import { useState, useEffect } from "react";
import logoIcon from "@/assets/logo-icon.png";
import { SocialIconRow } from "@/components/SocialLinks";
import { supabase } from "@/integrations/supabase/client";

const baseNavLinks = [
  { label: "Home", to: "/" },
  { label: "For Companies", to: "/for-companies" },
  { label: "For Talent", to: "/for-talent" },
  { label: "About", to: "/about" },
  { label: "Contact", to: "/contact" },
];

const Navbar = () => {
  const location = useLocation();
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <nav className="fixed top-0 left-0 right-0 z-[100]" style={{ background: 'rgba(10,10,10,0.95)', backdropFilter: 'blur(12px)' }}>
      <div className="border-b border-border">
        <div className="flex items-center justify-between h-[68px] px-[5%]">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-3">
            <img src={logoIcon} alt="Remote LaborLink" className="logo-blend h-11 w-auto" />
            <span className="font-body font-bold text-sm tracking-[2px] text-foreground">REMOTE LABORLINK</span>
          </Link>

          {/* Desktop links */}
          <div className="hidden md:flex items-center gap-8">
            {navLinks.map((link) => (
              <Link
                key={link.to}
                to={link.to}
                className={`text-[13px] font-body font-medium transition-colors hover:text-foreground ${
                  location.pathname === link.to ? "text-primary" : "text-muted-foreground"
                }`}
              >
                {link.label}
              </Link>
            ))}
          </div>

          <div className="hidden md:flex items-center gap-3">
            <Button asChild variant="ghost" size="sm" className="text-muted-foreground hover:text-foreground">
              <Link to="/signup/talent">Apply as Talent</Link>
            </Button>
            <Button asChild variant="ghost" size="sm" className="text-muted-foreground hover:text-foreground">
              <Link to="/signup/company">Hire Talent</Link>
            </Button>
            <Button asChild size="default" className="bg-primary text-primary-foreground font-bold rounded hover:opacity-90">
              <Link to="/login/company">Client Portal</Link>
            </Button>
          </div>

          {/* Mobile toggle */}
          <button className="md:hidden text-foreground" onClick={() => setMobileOpen(!mobileOpen)}>
            {mobileOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      {mobileOpen && (
        <div className="md:hidden border-b border-border px-[5%] pb-4 pt-2 space-y-3" style={{ background: 'rgba(10,10,10,0.98)' }}>
          {navLinks.map((link) => (
            <Link
              key={link.to}
              to={link.to}
              onClick={() => setMobileOpen(false)}
              className={`block text-sm font-medium py-1 ${
                location.pathname === link.to ? "text-primary" : "text-muted-foreground"
              }`}
            >
              {link.label}
            </Link>
          ))}
          <div className="pt-2 space-y-2">
            <Button asChild variant="outline" size="default" className="w-full">
              <Link to="/signup/talent" onClick={() => setMobileOpen(false)}>Apply as Talent</Link>
            </Button>
            <Button asChild variant="outline" size="default" className="w-full">
              <Link to="/signup/company" onClick={() => setMobileOpen(false)}>Hire Talent</Link>
            </Button>
            <Button asChild size="default" className="w-full bg-primary text-primary-foreground font-bold">
              <Link to="/login/company" onClick={() => setMobileOpen(false)}>Client Portal</Link>
            </Button>
          </div>
          <div className="pt-3 border-t border-border">
            <SocialIconRow />
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
