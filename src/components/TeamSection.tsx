import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";

type TeamMember = {
  id: string;
  name: string;
  role: string;
  initials: string;
  photo_url: string | null;
  bullets: string[];
  quote: string | null;
};

const TeamSection = () => {
  const [teamMembers, setTeamMembers] = useState<TeamMember[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTeam = async () => {
      const { data } = await supabase
        .from("team_members")
        .select("id, name, role, initials, photo_url, bullets, quote")
        .order("display_order");
      setTeamMembers((data as TeamMember[]) || []);
      setLoading(false);
    };
    fetchTeam();
  }, []);

  if (loading) {
    return (
      <section className="py-24 bg-card">
        <div className="container mx-auto px-4 text-center">
          <div className="animate-pulse">Loading team...</div>
        </div>
      </section>
    );
  }

  if (teamMembers.length === 0) return null;

  return (
    <section className="py-24 bg-card">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <span className="section-tag">The Team</span>
          <h2 className="font-display text-5xl md:text-6xl">
            WHO IS BEHIND<br />
            <span className="text-primary">REMOTE LABORLINK.</span>
          </h2>
          <p className="mt-4 font-body text-lg text-foreground/60 max-w-lg mx-auto">
            Built by operators who've lived both sides of the hiring problem.
          </p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
          {teamMembers.map((m) => (
            <div key={m.id} className="relative pt-[70px] group">
              {/* Photo / initials circle */}
              <div className="absolute top-0 left-1/2 -translate-x-1/2 z-10">
                {m.photo_url ? (
                  <img
                    src={m.photo_url}
                    alt={m.name}
                    className="w-[100px] h-[100px] rounded-full object-cover"
                    style={{ border: "3px solid hsl(var(--primary))" }}
                  />
                ) : (
                  <div
                    className="avatar-initials-lg"
                    style={{ border: "3px solid hsl(var(--primary))" }}
                  >
                    {m.initials}
                  </div>
                )}
              </div>
              {/* Card */}
              <div className="card-surface rounded-xl p-8 pt-16 text-center h-full transition-all duration-300 group-hover:border-primary group-hover:-translate-y-1">
                {/* Role badge */}
                <div className="inline-block border border-primary text-primary font-body text-xs font-bold uppercase tracking-[1px] rounded-full px-4 py-1.5 mb-4">
                  {m.role}
                </div>
                {/* Bullets */}
                <ul className="text-left space-y-2 mb-6">
                  {m.bullets.map((b, i) => (
                    <li key={i} className="flex items-start gap-2 text-[14px] font-body text-foreground/70">
                      <span className="text-primary mt-0.5 text-xs">•</span>
                      {b}
                    </li>
                  ))}
                </ul>
                {/* Quote */}
                {m.quote && (
                  <p className="font-body italic text-sm text-muted-foreground mb-4">
                    "{m.quote}"
                  </p>
                )}
                {/* Name */}
                <p className="font-display text-[28px] text-foreground">{m.name}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default TeamSection;
