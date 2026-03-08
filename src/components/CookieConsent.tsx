import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";

const CookieConsent = () => {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const consent = localStorage.getItem("rl_cookie_consent");
    if (!consent) setVisible(true);
  }, []);

  const accept = (type: "all" | "essential") => {
    localStorage.setItem("rl_cookie_consent", type);
    setVisible(false);
  };

  if (!visible) return null;

  return (
    <div className="fixed bottom-0 left-0 right-0 z-[200] border-t border-border" style={{ background: '#1a1a1a' }}>
      <div className="px-[5%] py-5 flex flex-col sm:flex-row items-center justify-between gap-4">
        <p className="text-sm text-muted-foreground">
          We use cookies to keep you logged in and understand how the platform is used. No advertising. No tracking.
        </p>
        <div className="flex items-center gap-3 shrink-0">
          <Button variant="outline" size="sm" onClick={() => accept("essential")}>
            Essential Only
          </Button>
          <Button size="sm" className="bg-primary text-primary-foreground font-bold" onClick={() => accept("all")}>
            Accept All
          </Button>
        </div>
      </div>
    </div>
  );
};

export default CookieConsent;
