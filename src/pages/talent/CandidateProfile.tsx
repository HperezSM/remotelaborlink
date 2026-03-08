import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import PageLayout from "@/components/PageLayout";
import { Skeleton } from "@/components/ui/skeleton";
import { MapPin, Briefcase, DollarSign, Globe, Clock, ExternalLink, FileText, Github, Eye } from "lucide-react";

const CandidateProfile = () => {
  const { id } = useParams<{ id: string }>();
  const { user, role } = useAuth();
  const [profile, setProfile] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [portfolioLinks, setPortfolioLinks] = useState<any[]>([]);
  const [certifications, setCertifications] = useState<any[]>([]);
  const [profileViews, setProfileViews] = useState<any[]>([]);

  useEffect(() => {
    if (!id) return;
    const fetchAll = async () => {
      const [profileRes, linksRes, certsRes] = await Promise.all([
        supabase.from("candidate_profiles").select("*").eq("id", id).single(),
        supabase.from("candidate_portfolio_links").select("*").eq("candidate_id", id),
        supabase.from("candidate_certifications").select("*").eq("candidate_id", id),
      ]);
      setProfile(profileRes.data);
      setPortfolioLinks(linksRes.data || []);
      setCertifications(certsRes.data || []);

      // Log profile view for companies
      if (user && role === "company") {
        const { data: company } = await supabase.from("companies").select("id").eq("user_id", user.id).single();
        if (company) {
          await supabase.from("profile_views").insert({
            candidate_id: id,
            company_id: company.id,
          });
        }
      }

      // Fetch profile views for candidate
      if (user && role === "candidate") {
        const { data: views } = await supabase.from("profile_views").select("viewed_at").eq("candidate_id", id);
        setProfileViews(views || []);
      }

      setLoading(false);
    };
    fetchAll();
  }, [id, user, role]);

  if (loading) {
    return (
      <PageLayout>
        <div className="py-12 container mx-auto px-4 max-w-3xl space-y-6">
          <Skeleton className="h-32 w-full rounded-lg" />
          <Skeleton className="h-48 w-full rounded-lg" />
          <Skeleton className="h-32 w-full rounded-lg" />
        </div>
      </PageLayout>
    );
  }

  if (!profile) {
    return (
      <PageLayout>
        <div className="py-20 text-center">
          <h1 className="font-display text-4xl mb-4">PROFILE NOT FOUND</h1>
          <p className="text-muted-foreground">This candidate profile doesn't exist or you don't have access.</p>
        </div>
      </PageLayout>
    );
  }

  const isAdmin = role === "admin";
  const isLoomUrl = profile.loom_video_url?.includes("loom.com/share/");
  const loomEmbedUrl = isLoomUrl ? profile.loom_video_url.replace("/share/", "/embed/") : null;

  const getAvailabilityColor = () => {
    if (profile.availability === "Immediate") return "status-active";
    if (profile.availability === "2 weeks") return "status-screening";
    return "status-pending";
  };

  const allLinks = [
    profile.linkedin_url && { type: "linkedin", url: profile.linkedin_url, label: "LinkedIn" },
    (profile as any).github_url && { type: "github", url: (profile as any).github_url, label: "GitHub" },
    profile.portfolio_url && { type: "portfolio", url: profile.portfolio_url, label: "Portfolio" },
    profile.portfolio_link && { type: "other", url: profile.portfolio_link, label: "Projects" },
    ...portfolioLinks.map((l: any) => ({ type: l.link_type, url: l.url, label: l.label || l.link_type })),
  ].filter(Boolean);

  return (
    <PageLayout>
      <div className="py-12 container mx-auto px-4 max-w-3xl">
        {/* Top Card */}
        <div className="card-surface p-8 relative">
          {isAdmin && (
            <span className={`absolute top-4 right-4 text-[10px] font-mono px-3 py-1 rounded-full font-semibold ${
              profile.status === "active" ? "status-active" :
              profile.status === "rejected" ? "status-rejected" :
              profile.status === "screening" ? "status-screening" :
              profile.status === "placed" ? "status-active" : "status-pending"
            }`}>
              {profile.status?.replace("_", " ")}
            </span>
          )}
          <div className="flex flex-col sm:flex-row items-start gap-6">
            {profile.profile_photo_url ? (
              <img src={profile.profile_photo_url} alt={profile.full_name} className="avatar-lg" />
            ) : (
              <div className="avatar-initials-lg">
                {profile.full_name?.split(" ").map((n: string) => n.charAt(0)).join("").slice(0, 2)}
              </div>
            )}
            <div className="flex-1">
              <h1 className="font-display text-4xl mb-1">{profile.full_name}</h1>
              <p className="text-lg text-muted-foreground font-medium mb-3">{(profile.roles_applied || []).join(" · ")}</p>
              <div className="flex flex-wrap items-center gap-3 text-sm text-muted-foreground">
                <span className="flex items-center gap-1"><MapPin size={14} /> {profile.city}, {profile.country}</span>
                <span className="flex items-center gap-1"><Briefcase size={14} /> {profile.seniority_level}</span>
                <span className={`text-[10px] font-mono px-2.5 py-1 rounded-full font-semibold ${getAvailabilityColor()}`}>
                  {profile.availability}
                </span>
                {profile.expected_rate_usd && (
                  <span className="flex items-center gap-1"><DollarSign size={14} /> ${profile.expected_rate_usd}/mo</span>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Skills Strip */}
        {profile.technical_skills?.length > 0 && (
          <div className="mt-6">
            <div className="flex flex-wrap gap-2">
              {profile.technical_skills.map((skill: string) => (
                <span key={skill} className="text-xs px-3 py-1.5 rounded-full border border-primary text-primary font-mono font-semibold">
                  {skill}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* Portfolio Row */}
        {allLinks.length > 0 && (
          <div className="flex flex-wrap gap-3 mt-6">
            {allLinks.map((link: any, i: number) => (
              <a key={i} href={link.url} target="_blank" rel="noopener noreferrer"
                className="card-surface px-4 py-3 flex items-center gap-2 text-sm text-muted-foreground hover:text-primary hover:border-primary transition-colors">
                {link.type === "github" ? <Github size={14} /> : <Globe size={14} />}
                {link.label}
              </a>
            ))}
          </div>
        )}

        {/* Bio */}
        {profile.bio && (
          <div className="card-surface p-8 mt-6">
            <h2 className="font-display text-xl mb-3">ABOUT</h2>
            <p className="text-[15px] text-foreground/75 leading-relaxed">{profile.bio}</p>
          </div>
        )}

        {/* Proud Achievement */}
        {profile.proud_achievement && (
          <div className="card-surface p-8 mt-6">
            <h2 className="font-display text-xl mb-3">BEST WORK</h2>
            <p className="text-[15px] text-foreground/75 leading-relaxed">{profile.proud_achievement}</p>
          </div>
        )}

        {/* Details Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6">
          {[
            { label: "Experience", value: profile.years_experience },
            { label: "Industries", value: (profile.industries || []).join(", ") },
            { label: "Work Type", value: profile.work_type_preference },
            { label: "English", value: profile.english_proficiency },
            { label: "US Hours", value: (profile as any).us_hours_available },
            { label: "Field of Study", value: (profile as any).field_of_study },
          ].filter(d => d.value).map((d) => (
            <div key={d.label} className="card-surface p-4">
              <div className="text-[10px] font-mono text-muted-foreground uppercase tracking-wider mb-1">{d.label}</div>
              <div className="text-sm font-bold">{d.value}</div>
            </div>
          ))}
        </div>

        {/* Certifications */}
        {certifications.length > 0 && (isAdmin || role === "company") && (
          <div className="card-surface p-8 mt-6">
            <h2 className="font-display text-xl mb-4">CERTIFICATIONS & CREDENTIALS</h2>
            <div className="space-y-3">
              {certifications.map((cert: any) => (
                <div key={cert.id} className="flex items-center gap-3 card-surface p-4 border border-border">
                  <div className="file-card-icon w-10 h-10">
                    <FileText size={16} />
                  </div>
                  <span className="text-sm flex-1 truncate">{cert.file_name}</span>
                  {isAdmin && (
                    <button
                      onClick={async () => {
                        const { data } = await supabase.storage.from("certifications").createSignedUrl(cert.file_url, 60);
                        if (data?.signedUrl) window.open(data.signedUrl, "_blank");
                      }}
                      className="text-xs text-primary font-bold hover:underline border border-primary/30 rounded px-3 py-1.5"
                    >
                      Download
                    </button>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Loom Video */}
        {profile.loom_video_url && (
          <div className="card-surface p-8 mt-6">
            <h2 className="font-display text-xl mb-4">INTRODUCTION VIDEO</h2>
            {loomEmbedUrl ? (
              <div className="aspect-video rounded-lg overflow-hidden">
                <iframe src={loomEmbedUrl} frameBorder="0" allowFullScreen className="w-full h-full" />
              </div>
            ) : (
              <a href={profile.loom_video_url} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 text-primary hover:underline text-sm font-bold">
                <ExternalLink size={14} /> Watch Introduction
              </a>
            )}
          </div>
        )}

        {/* Admin-only: Resume download */}
        {isAdmin && profile.resume_url && (
          <div className="file-card mt-6">
            <div className="file-card-icon">
              <FileText size={20} />
            </div>
            <div className="flex-1">
              <p className="text-sm font-bold text-foreground">Resume</p>
              <p className="text-[11px] font-mono text-muted-foreground">PDF · Admin only</p>
            </div>
            <button
              onClick={async () => {
                const { data } = await supabase.storage.from("resumes").createSignedUrl(profile.resume_url, 60);
                if (data?.signedUrl) window.open(data.signedUrl, "_blank");
              }}
              className="text-xs text-primary font-bold hover:underline border border-primary/30 rounded px-3 py-1.5"
            >
              Download
            </button>
          </div>
        )}

        {/* Profile Views (visible to candidate) */}
        {role === "candidate" && profileViews.length > 0 && (
          <div className="card-surface p-8 mt-6">
            <h2 className="font-display text-xl mb-4 flex items-center gap-2">
              <Eye size={18} /> PROFILE VIEWS
            </h2>
            <p className="text-sm text-muted-foreground mb-4">{profileViews.length} view{profileViews.length !== 1 ? "s" : ""} this period</p>
            <div className="space-y-2">
              {profileViews.slice(0, 10).map((v: any, i: number) => (
                <div key={i} className="flex items-center gap-2 text-sm text-muted-foreground py-1 border-b border-border">
                  <Eye size={12} />
                  Viewed on {new Date(v.viewed_at).toLocaleDateString([], { month: "long", day: "numeric", year: "numeric" })} at {new Date(v.viewed_at).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </PageLayout>
  );
};

export default CandidateProfile;
