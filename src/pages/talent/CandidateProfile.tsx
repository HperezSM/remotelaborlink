import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import PageLayout from "@/components/PageLayout";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import {
  MapPin, Briefcase, DollarSign, Globe, ExternalLink, FileText,
  Github, Eye, Pencil, Download, Play, Linkedin, X
} from "lucide-react";

const CandidateProfile = () => {
  const { id } = useParams<{ id: string }>();
  const { user, role } = useAuth();
  const [profile, setProfile] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [portfolioLinks, setPortfolioLinks] = useState<any[]>([]);
  const [certifications, setCertifications] = useState<any[]>([]);
  const [photos, setPhotos] = useState<any[]>([]);
  const [lightboxUrl, setLightboxUrl] = useState<string | null>(null);
  const [isPreviewMode, setIsPreviewMode] = useState(false);

  const isOwner = profile && user && profile.user_id === user.id;
  const isAdmin = role === "admin";
  const isCompany = role === "company";
  const isCandidate = role === "candidate";

  useEffect(() => {
    if (!id) return;
    const fetchAll = async () => {
      const [profileRes, linksRes, certsRes, photosRes] = await Promise.all([
        supabase.from("candidate_profiles").select("*").eq("id", id).single(),
        supabase.from("candidate_portfolio_links").select("*").eq("candidate_id", id),
        supabase.from("candidate_certifications").select("*").eq("candidate_id", id),
        supabase.from("candidate_photos").select("*").eq("candidate_id", id).order("display_order"),
      ]);
      setProfile(profileRes.data);
      setPortfolioLinks(linksRes.data || []);
      setCertifications(certsRes.data || []);
      setPhotos(photosRes.data || []);

      if (user && role === "company") {
        const { data: company } = await supabase.from("companies").select("id").eq("user_id", user.id).single();
        if (company) {
          await supabase.from("profile_views").insert({ candidate_id: id, company_id: company.id });
        }
      }
      setLoading(false);
    };
    fetchAll();
  }, [id, user, role]);

  if (loading) {
    return (
      <PageLayout>
        <div className="py-12 container mx-auto px-4 max-w-[900px] space-y-6">
          <Skeleton className="h-48 w-full rounded-lg" />
          <Skeleton className="h-32 w-full rounded-lg" />
          <Skeleton className="h-64 w-full rounded-lg" />
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

  const effectiveRole = isPreviewMode ? "company" : role;
  const showEdit = isOwner && !isPreviewMode;
  const isLoomUrl = profile.loom_video_url?.includes("loom.com/share/");
  const loomEmbedUrl = isLoomUrl ? profile.loom_video_url.replace("/share/", "/embed/") : null;
  const bioFirstSentence = profile.bio?.split(/[.!?]/)?.[0]?.trim();

  const getAvailabilityStyle = () => {
    if (profile.availability === "Immediate") return "bg-[hsl(var(--success)/0.12)] text-[hsl(var(--success))]";
    if (profile.availability === "2 weeks") return "bg-[hsl(var(--warning)/0.12)] text-[hsl(var(--warning))]";
    return "bg-muted/30 text-muted-foreground";
  };

  const getAvailabilityLabel = () => {
    if (profile.availability === "Immediate") return "● Available Now";
    if (profile.availability === "2 weeks") return "● Available in 2 weeks";
    return "● Open to Offers";
  };

  const allLinks = [
    profile.linkedin_url && { type: "linkedin", url: profile.linkedin_url, label: "LinkedIn", icon: Linkedin },
    profile.github_url && { type: "github", url: profile.github_url, label: "GitHub", icon: Github },
    profile.portfolio_url && { type: "portfolio", url: profile.portfolio_url, label: "Portfolio", icon: Globe },
    profile.portfolio_link && { type: "other", url: profile.portfolio_link, label: "Projects", icon: ExternalLink },
    ...portfolioLinks.map((l: any) => ({ type: l.link_type, url: l.url, label: l.label || l.link_type, icon: Globe })),
  ].filter(Boolean) as { type: string; url: string; label: string; icon: any }[];

  const statPills = [
    profile.years_experience && `${profile.years_experience} Exp`,
    profile.seniority_level,
    profile.expected_rate_usd && `$${Number(profile.expected_rate_usd).toLocaleString()}/mo`,
    profile.work_type_preference,
  ].filter(Boolean);

  return (
    <PageLayout>
      {/* Preview banner */}
      {isPreviewMode && (
        <div className="bg-primary text-primary-foreground px-[5%] py-3 text-center text-sm font-bold flex items-center justify-center gap-3">
          You're viewing your profile as a company sees it.
          <button onClick={() => setIsPreviewMode(false)} className="underline font-bold">Exit Preview</button>
        </div>
      )}

      {/* Section A — Hero Card */}
      <section className="bg-card border-b border-border">
        <div className="container mx-auto px-4 max-w-[900px] py-12">
          <div className="flex flex-col sm:flex-row items-start gap-6">
            {/* Photo */}
            <div className="shrink-0">
              {profile.profile_photo_url ? (
                <img src={profile.profile_photo_url} alt={profile.full_name}
                  className="w-[120px] h-[120px] rounded-full object-cover border-[3px] border-primary" />
              ) : (
                <div className="w-[120px] h-[120px] rounded-full bg-muted flex items-center justify-center border-[3px] border-primary">
                  <span className="font-display text-3xl text-muted-foreground">
                    {profile.full_name?.split(" ").map((n: string) => n.charAt(0)).join("").slice(0, 2)}
                  </span>
                </div>
              )}
              <div className={`mt-3 text-center text-xs font-mono font-semibold px-3 py-1.5 rounded-full ${getAvailabilityStyle()}`}>
                {getAvailabilityLabel()}
              </div>
            </div>

            {/* Info */}
            <div className="flex-1 min-w-0">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <h1 className="font-display text-5xl md:text-[52px] leading-none">{profile.full_name}</h1>
                  <p className="text-lg font-bold text-primary mt-1">{(profile.roles_applied || []).join(" · ")}</p>
                  <p className="text-sm text-muted-foreground flex items-center gap-1 mt-2">
                    <MapPin size={14} /> {profile.city}, {profile.country}
                  </p>
                  {bioFirstSentence && (
                    <p className="text-[15px] italic text-foreground/60 mt-2">{bioFirstSentence}.</p>
                  )}
                </div>

                {/* Action buttons */}
                <div className="hidden sm:flex items-center gap-2 shrink-0">
                  {showEdit && (
                    <>
                      <Button asChild variant="outline" size="sm"><Link to="/talent/profile/edit"><Pencil size={14} className="mr-1" /> Edit Profile</Link></Button>
                      <Button variant="ghost" size="sm" onClick={() => setIsPreviewMode(true)}>Preview as Company</Button>
                    </>
                  )}
                  {isAdmin && profile.resume_url && (
                    <Button variant="outline" size="sm" onClick={async () => {
                      const { data } = await supabase.storage.from("resumes").createSignedUrl(profile.resume_url, 60);
                      if (data?.signedUrl) window.open(data.signedUrl, "_blank");
                    }}><Download size={14} className="mr-1" /> Download CV</Button>
                  )}
                </div>
              </div>

              {/* Stat pills */}
              {statPills.length > 0 && (
                <div className="flex flex-wrap gap-2 mt-4">
                  {statPills.map((pill) => (
                    <span key={pill} className="bg-background border border-border rounded-full px-3.5 py-1.5 font-mono text-[11px] text-foreground">
                      {pill}
                    </span>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Mobile action buttons */}
          <div className="sm:hidden flex flex-wrap gap-2 mt-4">
            {showEdit && (
              <>
                <Button asChild variant="outline" size="sm" className="flex-1"><Link to="/talent/profile/edit"><Pencil size={14} className="mr-1" /> Edit</Link></Button>
                <Button variant="ghost" size="sm" className="flex-1" onClick={() => setIsPreviewMode(true)}>Preview</Button>
              </>
            )}
          </div>

          {/* Admin status badge */}
          {isAdmin && (
            <span className={`inline-block mt-4 text-[10px] font-mono px-3 py-1 rounded-full font-semibold ${
              profile.status === "active" ? "status-active" :
              profile.status === "rejected" ? "status-rejected" :
              profile.status === "screening" ? "status-screening" :
              profile.status === "placed" ? "status-active" : "status-pending"
            }`}>
              {profile.status?.replace("_", " ")}
            </span>
          )}
        </div>
      </section>

      {/* Section B — Skills Strip */}
      {profile.technical_skills?.length > 0 && (
        <section className="bg-background border-b border-border px-[5%] py-5">
          <div className="container mx-auto max-w-[900px]">
            <span className="font-mono text-[10px] text-muted-foreground uppercase tracking-widest block mb-3">// TOP SKILLS</span>
            <div className="flex flex-wrap gap-2 overflow-x-auto">
              {profile.technical_skills.map((skill: string) => (
                <span key={skill} className="border border-primary text-primary bg-transparent rounded-full px-3.5 py-1.5 font-mono text-[11px] font-semibold whitespace-nowrap">
                  {skill}
                </span>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Section C — Main Content */}
      <section className="container mx-auto px-4 max-w-[900px] py-12">
        <div className="grid grid-cols-1 md:grid-cols-5 gap-10">
          {/* Left Column (3/5) */}
          <div className="md:col-span-3 space-y-8">
            {/* About */}
            {profile.bio && (
              <div>
                <span className="font-mono text-[10px] text-muted-foreground uppercase tracking-widest block mb-3">// ABOUT</span>
                <p className="text-[15px] text-foreground/75 leading-relaxed">{profile.bio}</p>
              </div>
            )}

            {/* Best Work */}
            {profile.proud_achievement && (
              <div>
                <span className="font-mono text-[10px] text-muted-foreground uppercase tracking-widest block mb-3">// BEST WORK</span>
                <div className="border-l-[3px] border-primary pl-5">
                  <p className="text-[15px] italic text-foreground/70 leading-relaxed">{profile.proud_achievement}</p>
                </div>
              </div>
            )}

            {/* Experience */}
            <div>
              <span className="font-mono text-[10px] text-muted-foreground uppercase tracking-widest block mb-3">// EXPERIENCE</span>
              <div className="space-y-0">
                {[
                  { label: "Years of Experience", value: profile.years_experience },
                  { label: "Field of Study", value: profile.field_of_study },
                  { label: "US Hours Availability", value: profile.us_hours_available },
                ].filter(d => d.value).map((d) => (
                  <div key={d.label} className="flex items-center justify-between py-3 border-b border-border text-sm">
                    <span className="text-muted-foreground">{d.label}</span>
                    <span className="font-bold">{d.value}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Certifications */}
            {(isAdmin || isCompany || isOwner) && (
              <div>
                <span className="font-mono text-[10px] text-muted-foreground uppercase tracking-widest block mb-3">// CERTIFICATIONS & CREDENTIALS</span>
                {certifications.length === 0 ? (
                  <p className="text-sm text-muted-foreground">No certifications added yet.</p>
                ) : (
                  <div className="space-y-3">
                    {certifications.map((cert: any) => (
                      <div key={cert.id} className="bg-card border border-border rounded-lg p-4 flex items-center gap-3">
                        <div className="w-10 h-10 rounded bg-primary/10 flex items-center justify-center">
                          <FileText size={16} className="text-primary" />
                        </div>
                        <span className="text-sm flex-1 truncate">{cert.file_name}</span>
                        {(isAdmin) && (
                          <Button variant="outline" size="sm" onClick={async () => {
                            const { data } = await supabase.storage.from("certifications").createSignedUrl(cert.file_url, 60);
                            if (data?.signedUrl) window.open(data.signedUrl, "_blank");
                          }}>
                            <Download size={12} className="mr-1" /> Download
                          </Button>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* Photo Strip */}
            {photos.length > 0 && (
              <div>
                <span className="font-mono text-[10px] text-muted-foreground uppercase tracking-widest block mb-3">// PHOTOS</span>
                <div className="flex gap-3 overflow-x-auto">
                  {photos.slice(0, 3).map((photo: any) => (
                    <img key={photo.id} src={photo.photo_url} alt="Portfolio"
                      onClick={() => setLightboxUrl(photo.photo_url)}
                      className="w-[180px] h-[130px] object-cover rounded-lg border border-border cursor-pointer hover:border-primary transition-colors" />
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Right Column (2/5) */}
          <div className="md:col-span-2 space-y-6">
            {/* Details card */}
            <div className="bg-card border border-border rounded-lg p-7 space-y-0">
              {[
                { label: "English Level", value: profile.english_proficiency },
                { label: "Availability", value: profile.availability },
                { label: "Work Type", value: profile.work_type_preference },
                { label: "Salary", value: profile.expected_rate_usd ? `$${Number(profile.expected_rate_usd).toLocaleString()}/mo` : null },
                { label: "Employment", value: profile.employment_status },
              ].filter(d => d.value).map((d, i, arr) => (
                <div key={d.label} className={`flex items-center justify-between py-3 text-sm ${i < arr.length - 1 ? "border-b border-border" : ""}`}>
                  <span className="text-muted-foreground">{d.label}</span>
                  <span className="font-bold text-foreground">{d.value}</span>
                </div>
              ))}
            </div>

            {/* Links card */}
            {allLinks.length > 0 && (
              <div className="bg-card border border-border rounded-lg p-7">
                <span className="font-mono text-[10px] text-muted-foreground uppercase tracking-widest block mb-4">// LINKS</span>
                <div className="space-y-3">
                  {allLinks.map((link, i) => (
                    <a key={i} href={link.url} target="_blank" rel="noopener noreferrer"
                      className="flex items-center gap-3 text-sm text-foreground/70 hover:text-foreground transition-colors group">
                      <link.icon size={16} className="text-primary" />
                      <span className="flex-1">{link.label}</span>
                      <ExternalLink size={12} className="opacity-0 group-hover:opacity-100 transition-opacity" />
                    </a>
                  ))}
                </div>
              </div>
            )}

            {/* Video card */}
            {profile.loom_video_url && (
              <div className="bg-card border border-border rounded-lg p-7">
                <span className="font-mono text-[10px] text-muted-foreground uppercase tracking-widest block mb-4">// INTRODUCTION VIDEO</span>
                {loomEmbedUrl ? (
                  <div className="aspect-video rounded-lg overflow-hidden">
                    <iframe src={loomEmbedUrl} frameBorder="0" allowFullScreen className="w-full h-full" />
                  </div>
                ) : (
                  <a href={profile.loom_video_url} target="_blank" rel="noopener noreferrer"
                    className="flex items-center gap-3 text-sm text-primary hover:underline font-bold">
                    <Play size={16} /> Watch on Loom
                  </a>
                )}
              </div>
            )}

            {/* Industries card */}
            {profile.industries?.length > 0 && (
              <div className="bg-card border border-border rounded-lg p-7">
                <span className="font-mono text-[10px] text-muted-foreground uppercase tracking-widest block mb-4">// INDUSTRIES</span>
                <div className="flex flex-wrap gap-2">
                  {profile.industries.map((ind: string) => (
                    <span key={ind} className="border border-foreground/30 text-foreground/70 rounded-full px-3 py-1 font-mono text-[11px]">
                      {ind}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Lightbox */}
      {lightboxUrl && (
        <div className="fixed inset-0 z-50 bg-background/90 flex items-center justify-center p-4" onClick={() => setLightboxUrl(null)}>
          <button className="absolute top-6 right-6 text-foreground" onClick={() => setLightboxUrl(null)}><X size={24} /></button>
          <img src={lightboxUrl} alt="Full size" className="max-w-full max-h-[90vh] object-contain rounded-lg" />
        </div>
      )}
    </PageLayout>
  );
};

export default CandidateProfile;
