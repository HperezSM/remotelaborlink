import { Linkedin, Instagram, Facebook, Phone, Mail } from "lucide-react";

export const socialLinks = [
  { label: "LinkedIn", href: "https://www.linkedin.com/company/remote-laborlink", icon: Linkedin },
  { label: "Instagram", href: "https://www.instagram.com/remotelaborlink", icon: Instagram },
  { label: "Facebook", href: "https://www.facebook.com/remotelaborlink", icon: Facebook },
  { label: "Pinterest", href: "https://www.pinterest.com/remotelaborlink", icon: PinterestIcon },
  { label: "TikTok", href: "https://www.tiktok.com/@remotelaborlink", icon: TikTokIcon },
];

export const contactInfo = {
  email: "team@remotelaborlink.com",
};

// Custom Pinterest icon (not in lucide)
function PinterestIcon({ size = 24, className = "" }: { size?: number; className?: string }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
      <path d="M8 12a4 4 0 1 1 8 0c0 4-2 6-4 8" />
      <path d="M9 17l1.5-5" />
      <circle cx="12" cy="12" r="10" />
    </svg>
  );
}

// Custom TikTok icon (not in lucide)
function TikTokIcon({ size = 24, className = "" }: { size?: number; className?: string }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
      <path d="M9 12a4 4 0 1 0 4 4V4a5 5 0 0 0 5 5" />
    </svg>
  );
}

type SocialIconRowProps = {
  label?: string;
  className?: string;
};

export const SocialIconRow = ({ label, className = "" }: SocialIconRowProps) => (
  <div className={className}>
    {label && <p className="text-sm text-muted-foreground mb-3">{label}</p>}
    <div className="flex items-center gap-3">
      {socialLinks.map((link) => (
        <a
          key={link.label}
          href={link.href}
          target="_blank"
          rel="noopener noreferrer"
          aria-label={link.label}
          className="w-9 h-9 rounded-full flex items-center justify-center border transition-all duration-200"
          style={{
            background: "hsl(var(--card))",
            borderColor: "hsl(var(--border))",
            color: "hsl(var(--muted-foreground))",
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.borderColor = "hsl(var(--primary))";
            e.currentTarget.style.color = "hsl(var(--primary))";
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.borderColor = "hsl(var(--border))";
            e.currentTarget.style.color = "hsl(var(--muted-foreground))";
          }}
        >
          <link.icon size={16} />
        </a>
      ))}
    </div>
  </div>
);

export default SocialIconRow;
