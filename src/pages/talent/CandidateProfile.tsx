import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import PageLayout from "@/components/PageLayout";
import { Skeleton } from "@/components/ui/skeleton";
import { MapPin, Briefcase, DollarSign, Globe, Clock, ExternalLink, FileText } from "lucide-react";

const CandidateProfile = () => {
  const { id } = useParams<{ id: string }>();
  const { role } = useAuth();
  const [profile, setProfile] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!id) return;
    const fetch = async () => {
      const { data } = await supabase.from("candidate_profiles").select("*").eq("id", id).single();
      setProfile(data);
      setLoading(false);
    };
    fetch();
  }, [id]);

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
              <img src={profile.profile_photo_url} alt={profile.full_name} className="w-24 h-24 rounded-full object-cover border-2 border-border" />
            ) : (
              <div className="w-24 h-24 rounded-full bg-muted flex items-center justify-center font-display text-3xl text-muted-foreground">
                {profile.full_name?.charAt(0)}
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

        {/* Skills */}
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
          ].filter(d => d.value).map((d) => (
            <div key={d.label} className="card-surface p-4">
              <div className="text-[10px] font-mono text-muted-foreground uppercase tracking-wider mb-1">{d.label}</div>
              <div className="text-sm font-bold">{d.value}</div>
            </div>
          ))}
        </div>

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

        {/* Links */}
        <div className="flex flex-wrap gap-4 mt-6">
          {profile.linkedin_url && (
            <a href={profile.linkedin_url} target="_blank" rel="noopener noreferrer" className="card-surface px-4 py-3 flex items-center gap-2 text-sm text-muted-foreground hover:text-primary transition-colors">
              <Globe size={14} /> LinkedIn
            </a>
          )}
          {profile.portfolio_url && (
            <a href={profile.portfolio_url} target="_blank" rel="noopener noreferrer" className="card-surface px-4 py-3 flex items-center gap-2 text-sm text-muted-foreground hover:text-primary transition-colors">
              <Globe size={14} /> Portfolio
            </a>
          )}
          {profile.portfolio_link && (
            <a href={profile.portfolio_link} target="_blank" rel="noopener noreferrer" className="card-surface px-4 py-3 flex items-center gap-2 text-sm text-muted-foreground hover:text-primary transition-colors">
              <Globe size={14} /> GitHub / Behance
            </a>
          )}
        </div>

        {/* Admin-only: Resume download */}
        {isAdmin && profile.resume_url && (
          <div className="mt-6">
            <button
              onClick={async () => {
                const { data } = await supabase.storage.from("resumes").createSignedUrl(profile.resume_url, 60);
                if (data?.signedUrl) window.open(data.signedUrl, "_blank");
              }}
              className="text-sm text-primary font-bold hover:underline"
            >
              📄 Download Resume (Admin only)
            </button>
          </div>
        )}
      </div>
    </PageLayout>
  );
};

export default CandidateProfile;
