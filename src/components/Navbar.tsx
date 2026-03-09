import { Link, useLocation, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Menu, X, ChevronDown, LogOut, User, Pencil, Wrench, FileText, LayoutDashboard, Users, MessageSquare, Settings, Briefcase } from "lucide-react";
import { useState, useEffect, useRef } from "react";
import logoIcon from "@/assets/logo-icon.png";
import { SocialIconRow } from "@/components/SocialLinks";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { toast } from "@/hooks/use-toast";

const baseNavLinks = [
  { label: "Home", to: "/" },
  { label: "For Companies", to: "/for-companies" },
  { label: "For Talent", to: "/for-talent" },
  { label: "About", to: "/about" },
  { label: "Contact", to: "/contact" },
];

const Navbar = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { user, role, profile, company, signOut, loading } = useAuth();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [jobBoardEnabled, setJobBoardEnabled] = useState(false);
  const [subscriptionsEnabled, setSubscriptionsEnabled] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    supabase.from("feature_flags").select("flag_key, enabled").in("flag_key", ["job_board", "company_subscriptions"])
      .then(({ data }) => {
        if (data) {
          data.forEach((f: any) => {
            if (f.flag_key === "job_board") setJobBoardEnabled(f.enabled);
            if (f.flag_key === "company_subscriptions") setSubscriptionsEnabled(f.enabled);
          });
        }
      });
  }, []);

  // Close dropdown on outside click
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  // Close mobile menu on route change
  useEffect(() => {
    setMobileOpen(false);
    setDropdownOpen(false);
  }, [location.pathname]);

  const handleLogout = async () => {
    await signOut();
    toast({ title: "You've been logged out." });
    navigate("/");
  };

  const navLinks = [
    ...baseNavLinks.slice(0, 3),
    ...(jobBoardEnabled ? [{ label: "Jobs", to: "/jobs" }] : []),
    ...baseNavLinks.slice(3),
    ...(subscriptionsEnabled ? [{ label: "Pricing", to: "/pricing" }] : []),
  ];

  const isCandidate = role === "candidate";
  const isCompany = role === "company";
  const isAdmin = role === "admin";
  const isLoggedIn = !!user && !loading;

  const displayName = isCandidate
    ? (profile?.first_name || profile?.full_name?.split(" ")[0] || "Talent")
    : isCompany
    ? (company?.company_name || "Company")
    : isAdmin
    ? "Admin"
    : "";

  const displaySubtext = isCandidate
    ? (profile?.roles_applied?.[0] || "Candidate")
    : isCompany
    ? (company?.contact_person_name || "")
    : "";

  const photoUrl = isCandidate ? profile?.profile_photo_url : null;
  const initials = isCandidate
    ? (profile?.full_name?.split(" ").map((n: string) => n.charAt(0)).join("").slice(0, 2) || "T")
    : isCompany
    ? (company?.company_name?.charAt(0) || "C")
    : "A";

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

          {/* Desktop right side */}
          <div className="hidden md:flex items-center gap-3">
            {!isLoggedIn ? (
              <>
                <Button asChild variant="ghost" size="sm" className="text-muted-foreground hover:text-foreground">
                  <Link to="/signup/talent">Apply as Talent</Link>
                </Button>
                <Button asChild variant="ghost" size="sm" className="text-muted-foreground hover:text-foreground">
                  <Link to="/signup/company">Hire Talent</Link>
                </Button>
                <Button asChild variant="outline" size="sm" className="border-border text-foreground hover:border-primary hover:text-primary text-[13px] font-semibold">
                  <Link to="/login/talent">Talent Login</Link>
                </Button>
                <Button asChild size="default" className="bg-primary text-primary-foreground font-bold rounded hover:opacity-90">
                  <Link to="/login/company">Client Portal</Link>
                </Button>
              </>
            ) : (
              <>
                {/* Dashboard button */}
                <Button asChild size="sm" className="bg-primary text-primary-foreground font-bold rounded hover:opacity-90">
                  <Link to={isCandidate ? "/talent/dashboard" : isCompany ? "/company/dashboard" : "/admin"}>
                    {isCandidate ? "Dashboard" : isCompany ? "Portal" : "Admin Dashboard"}
                  </Link>
                </Button>

                {/* Profile dropdown */}
                <div className="relative" ref={dropdownRef}>
                  <button
                    onClick={() => setDropdownOpen(!dropdownOpen)}
                    className="flex items-center gap-2.5 px-2 py-1.5 rounded-lg hover:bg-card transition-colors"
                  >
                    {photoUrl ? (
                      <img src={photoUrl} alt="" className="w-7 h-7 rounded-full object-cover border-2 border-primary" />
                    ) : (
                      <div className="w-7 h-7 rounded-full flex items-center justify-center text-[10px] font-bold border-2 border-primary bg-card text-primary">
                        {initials}
                      </div>
                    )}
                    <div className="text-left hidden lg:block">
                      <p className="text-[13px] font-bold text-foreground leading-tight">{displayName}</p>
                      {displaySubtext && <p className="text-[11px] text-muted-foreground leading-tight">{displaySubtext}</p>}
                    </div>
                    <ChevronDown size={14} className={`text-muted-foreground transition-transform ${dropdownOpen ? "rotate-180" : ""}`} />
                  </button>

                  {dropdownOpen && (
                    <div className="absolute right-0 top-full mt-2 min-w-[220px] rounded-lg border border-border shadow-xl z-50" style={{ background: '#1a1a1a' }}>
                      {/* Header */}
                      <div className="px-4 py-3 border-b border-border">
                        <div className="flex items-center gap-3">
                          {photoUrl ? (
                            <img src={photoUrl} alt="" className="w-9 h-9 rounded-full object-cover border-2 border-primary" />
                          ) : (
                            <div className="w-9 h-9 rounded-full flex items-center justify-center text-xs font-bold border-2 border-primary bg-card text-primary">
                              {initials}
                            </div>
                          )}
                          <div>
                            <p className="text-sm font-bold text-foreground">{isCandidate ? profile?.full_name : isCompany ? company?.company_name : "Admin"}</p>
                            <p className="text-[11px] text-muted-foreground">{displaySubtext}</p>
                          </div>
                        </div>
                      </div>

                      {/* Menu items */}
                      <div className="py-1">
                        {isCandidate && (
                          <>
                            <DropdownItem icon={LayoutDashboard} label="Dashboard" to="/talent/dashboard" />
                            <DropdownItem icon={User} label="My Profile" to={profile?.id ? `/talent/${profile.id}` : "/talent/dashboard"} />
                            <DropdownItem icon={Pencil} label="Edit Profile" to="/talent/profile/edit" />
                            <DropdownItem icon={Wrench} label="My Skills" to="/talent/dashboard?tab=skills" />
                            <DropdownItem icon={FileText} label="Certifications" to="/talent/dashboard?tab=certifications" />
                          </>
                        )}
                        {isCompany && (
                          <>
                            <DropdownItem icon={LayoutDashboard} label="Dashboard" to="/company/dashboard" />
                            <DropdownItem icon={Briefcase} label="Role Requests" to="/company/dashboard?tab=roles" />
                            <DropdownItem icon={Users} label="Talent Pool" to="/company/dashboard?tab=talent" />
                            <DropdownItem icon={MessageSquare} label="Messages" to="/company/dashboard?tab=messages" />
                            <DropdownItem icon={Settings} label="Account Settings" to="/company/dashboard?tab=settings" />
                          </>
                        )}
                        {isAdmin && (
                          <>
                            <DropdownItem icon={LayoutDashboard} label="Admin Dashboard" to="/admin" />
                          </>
                        )}
                      </div>

                      {/* Logout */}
                      <div className="border-t border-border py-1">
                        <button
                          onClick={handleLogout}
                          className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-destructive hover:bg-card transition-colors"
                        >
                          <LogOut size={14} /> Log Out
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              </>
            )}
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
          {/* Logged-in user info */}
          {isLoggedIn && (
            <div className="flex items-center gap-3 pb-3 border-b border-border">
              {photoUrl ? (
                <img src={photoUrl} alt="" className="w-10 h-10 rounded-full object-cover border-2 border-primary" />
              ) : (
                <div className="w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold border-2 border-primary bg-card text-primary">
                  {initials}
                </div>
              )}
              <div>
                <p className="text-sm font-bold text-foreground">{isCandidate ? profile?.full_name : isCompany ? company?.company_name : "Admin"}</p>
                <p className="text-[11px] text-muted-foreground">{displaySubtext}</p>
              </div>
            </div>
          )}

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
            {!isLoggedIn ? (
              <>
                <Button asChild variant="outline" size="default" className="w-full">
                  <Link to="/signup/talent" onClick={() => setMobileOpen(false)}>Apply as Talent</Link>
                </Button>
                <Button asChild variant="outline" size="default" className="w-full">
                  <Link to="/signup/company" onClick={() => setMobileOpen(false)}>Hire Talent</Link>
                </Button>
                <Button asChild variant="outline" size="default" className="w-full border-border text-foreground">
                  <Link to="/login/talent" onClick={() => setMobileOpen(false)}>Talent Login</Link>
                </Button>
                <Button asChild size="default" className="w-full bg-primary text-primary-foreground font-bold">
                  <Link to="/login/company" onClick={() => setMobileOpen(false)}>Client Portal</Link>
                </Button>
              </>
            ) : (
              <>
                {isCandidate && (
                  <>
                    <MobileMenuItem icon={LayoutDashboard} label="Dashboard" to="/talent/dashboard" />
                    <MobileMenuItem icon={User} label="My Profile" to={profile?.id ? `/talent/${profile.id}` : "/talent/dashboard"} />
                    <MobileMenuItem icon={Pencil} label="Edit Profile" to="/talent/profile/edit" />
                    <MobileMenuItem icon={Wrench} label="My Skills" to="/talent/dashboard?tab=skills" />
                    <MobileMenuItem icon={FileText} label="Certifications" to="/talent/dashboard?tab=certifications" />
                  </>
                )}
                {isCompany && (
                  <>
                    <MobileMenuItem icon={LayoutDashboard} label="Dashboard" to="/company/dashboard" />
                    <MobileMenuItem icon={Briefcase} label="Role Requests" to="/company/dashboard?tab=roles" />
                    <MobileMenuItem icon={Users} label="Talent Pool" to="/company/dashboard?tab=talent" />
                    <MobileMenuItem icon={MessageSquare} label="Messages" to="/company/dashboard?tab=messages" />
                    <MobileMenuItem icon={Settings} label="Account Settings" to="/company/dashboard?tab=settings" />
                  </>
                )}
                {isAdmin && (
                  <MobileMenuItem icon={LayoutDashboard} label="Admin Dashboard" to="/admin" />
                )}
                <button
                  onClick={() => { setMobileOpen(false); handleLogout(); }}
                  className="w-full flex items-center gap-2 px-3 py-2 text-sm text-destructive hover:bg-card rounded transition-colors"
                >
                  <LogOut size={14} /> Log Out
                </button>
              </>
            )}
          </div>
          <div className="pt-3 border-t border-border">
            <SocialIconRow />
          </div>
        </div>
      )}
    </nav>
  );
};

function DropdownItem({ icon: Icon, label, to }: { icon: any; label: string; to: string }) {
  return (
    <Link
      to={to}
      className="flex items-center gap-3 px-4 py-2.5 text-sm text-muted-foreground hover:text-foreground hover:bg-card transition-colors"
    >
      <Icon size={14} /> {label}
    </Link>
  );
}

function MobileMenuItem({ icon: Icon, label, to }: { icon: any; label: string; to: string }) {
  return (
    <Link
      to={to}
      className="flex items-center gap-2 px-3 py-2 text-sm text-muted-foreground hover:text-foreground hover:bg-card rounded transition-colors"
    >
      <Icon size={14} /> {label}
    </Link>
  );
}

export default Navbar;
