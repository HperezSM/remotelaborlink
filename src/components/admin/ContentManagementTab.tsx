import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Plus, Trash2, Upload, GripVertical, Star } from "lucide-react";

type TeamMember = {
  id: string;
  name: string;
  role: string;
  initials: string;
  photo_url: string | null;
  bullets: string[];
  quote: string | null;
  display_order: number;
};

type Partner = {
  id: string;
  company_name: string;
  logo_url: string;
  website_url: string | null;
  display_order: number;
  is_active: boolean;
};

type Testimonial = {
  id: string;
  client_name: string;
  client_role: string | null;
  company_name: string | null;
  content: string;
  rating: number;
  photo_url: string | null;
  is_active: boolean;
  display_order: number;
};

const ContentManagementTab = () => {
  const [teamMembers, setTeamMembers] = useState<TeamMember[]>([]);
  const [partners, setPartners] = useState<Partner[]>([]);
  const [testimonials, setTestimonials] = useState<Testimonial[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchAll();
  }, []);

  const fetchAll = async () => {
    setLoading(true);
    const [tmRes, pRes, tRes] = await Promise.all([
      supabase.from("team_members").select("*").order("display_order"),
      supabase.from("partners").select("*").order("display_order"),
      supabase.from("testimonials").select("*").order("display_order"),
    ]);
    setTeamMembers((tmRes.data as TeamMember[]) || []);
    setPartners((pRes.data as Partner[]) || []);
    setTestimonials((tRes.data as Testimonial[]) || []);
    setLoading(false);
  };

  // Team Member handlers
  const [editingMember, setEditingMember] = useState<TeamMember | null>(null);
  const [memberForm, setMemberForm] = useState({ name: "", role: "", initials: "", quote: "", bullets: "" });
  const [uploadingPhoto, setUploadingPhoto] = useState<string | null>(null);

  const handlePhotoUpload = async (memberId: string, file: File) => {
    setUploadingPhoto(memberId);
    const ext = file.name.split(".").pop();
    const path = `team/${memberId}.${ext}`;
    const { error: uploadError } = await supabase.storage.from("content-images").upload(path, file, { upsert: true });
    if (uploadError) {
      toast({ title: "Upload failed", description: uploadError.message, variant: "destructive" });
      setUploadingPhoto(null);
      return;
    }
    const { data: urlData } = supabase.storage.from("content-images").getPublicUrl(path);
    await supabase.from("team_members").update({ photo_url: urlData.publicUrl }).eq("id", memberId);
    toast({ title: "Photo uploaded!" });
    setUploadingPhoto(null);
    fetchAll();
  };

  const updateMember = async (id: string, updates: Partial<TeamMember>) => {
    const { error } = await supabase.from("team_members").update(updates).eq("id", id);
    if (error) toast({ title: "Error", description: error.message, variant: "destructive" });
    else { toast({ title: "Team member updated" }); fetchAll(); }
  };

  // Partner handlers
  const [newPartner, setNewPartner] = useState({ company_name: "", website_url: "" });
  const [uploadingLogo, setUploadingLogo] = useState(false);

  const addPartner = async (logoFile: File) => {
    if (!newPartner.company_name) {
      toast({ title: "Enter company name first", variant: "destructive" });
      return;
    }
    setUploadingLogo(true);
    const id = crypto.randomUUID();
    const ext = logoFile.name.split(".").pop();
    const path = `partners/${id}.${ext}`;
    const { error: uploadError } = await supabase.storage.from("content-images").upload(path, logoFile);
    if (uploadError) {
      toast({ title: "Upload failed", description: uploadError.message, variant: "destructive" });
      setUploadingLogo(false);
      return;
    }
    const { data: urlData } = supabase.storage.from("content-images").getPublicUrl(path);
    const { error } = await supabase.from("partners").insert({
      id,
      company_name: newPartner.company_name,
      logo_url: urlData.publicUrl,
      website_url: newPartner.website_url || null,
      display_order: partners.length,
    });
    if (error) toast({ title: "Error", description: error.message, variant: "destructive" });
    else { toast({ title: "Partner added!" }); setNewPartner({ company_name: "", website_url: "" }); fetchAll(); }
    setUploadingLogo(false);
  };

  const deletePartner = async (id: string) => {
    const { error } = await supabase.from("partners").delete().eq("id", id);
    if (error) toast({ title: "Error", description: error.message, variant: "destructive" });
    else { toast({ title: "Partner removed" }); fetchAll(); }
  };

  // Testimonial handlers
  const [newTestimonial, setNewTestimonial] = useState({ client_name: "", client_role: "", company_name: "", content: "", rating: 5 });

  const addTestimonial = async () => {
    if (!newTestimonial.client_name || !newTestimonial.content) {
      toast({ title: "Name and review content required", variant: "destructive" });
      return;
    }
    const { error } = await supabase.from("testimonials").insert({
      ...newTestimonial,
      display_order: testimonials.length,
    });
    if (error) toast({ title: "Error", description: error.message, variant: "destructive" });
    else { toast({ title: "Testimonial added!" }); setNewTestimonial({ client_name: "", client_role: "", company_name: "", content: "", rating: 5 }); fetchAll(); }
  };

  const deleteTestimonial = async (id: string) => {
    const { error } = await supabase.from("testimonials").delete().eq("id", id);
    if (error) toast({ title: "Error", description: error.message, variant: "destructive" });
    else { toast({ title: "Testimonial removed" }); fetchAll(); }
  };

  const toggleTestimonialActive = async (id: string, is_active: boolean) => {
    await supabase.from("testimonials").update({ is_active: !is_active }).eq("id", id);
    fetchAll();
  };

  if (loading) return <div className="text-center py-12 text-muted-foreground">Loading...</div>;

  return (
    <Tabs defaultValue="team" className="w-full">
      <TabsList className="mb-6">
        <TabsTrigger value="team">Team Members</TabsTrigger>
        <TabsTrigger value="partners">Partners</TabsTrigger>
        <TabsTrigger value="testimonials">Testimonials</TabsTrigger>
      </TabsList>

      {/* Team Members */}
      <TabsContent value="team">
        <div className="space-y-4">
          {teamMembers.map((member) => (
            <div key={member.id} className="card-surface p-6 flex gap-6 items-start">
              <div className="relative">
                {member.photo_url ? (
                  <img src={member.photo_url} alt={member.name} className="w-20 h-20 rounded-full object-cover border-2 border-primary" />
                ) : (
                  <div className="w-20 h-20 rounded-full bg-card border-2 border-primary flex items-center justify-center font-display text-xl">
                    {member.initials}
                  </div>
                )}
                <label className="absolute -bottom-1 -right-1 bg-primary text-primary-foreground rounded-full p-1.5 cursor-pointer hover:opacity-80 transition-opacity">
                  <Upload size={14} />
                  <input
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={(e) => e.target.files?.[0] && handlePhotoUpload(member.id, e.target.files[0])}
                    disabled={uploadingPhoto === member.id}
                  />
                </label>
              </div>
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-2">
                  <span className="font-display text-xl">{member.name}</span>
                  <span className="text-xs bg-primary/20 text-primary px-2 py-0.5 rounded">{member.role}</span>
                </div>
                <p className="text-sm text-muted-foreground italic mb-2">"{member.quote}"</p>
                <ul className="text-xs text-muted-foreground space-y-1">
                  {member.bullets.map((b, i) => <li key={i}>• {b}</li>)}
                </ul>
              </div>
              {uploadingPhoto === member.id && <span className="text-xs text-primary animate-pulse">Uploading...</span>}
            </div>
          ))}
        </div>
      </TabsContent>

      {/* Partners */}
      <TabsContent value="partners">
        <div className="card-surface p-6 mb-6">
          <h4 className="font-display text-lg mb-4">ADD NEW PARTNER</h4>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Input
              placeholder="Company name *"
              value={newPartner.company_name}
              onChange={(e) => setNewPartner({ ...newPartner, company_name: e.target.value })}
            />
            <Input
              placeholder="Website URL (optional)"
              value={newPartner.website_url}
              onChange={(e) => setNewPartner({ ...newPartner, website_url: e.target.value })}
            />
            <label className="flex items-center gap-2 cursor-pointer">
              <Button variant="outline" size="sm" disabled={uploadingLogo || !newPartner.company_name} asChild>
                <span>
                  <Upload size={14} className="mr-2" />
                  {uploadingLogo ? "Uploading..." : "Upload Logo"}
                </span>
              </Button>
              <input
                type="file"
                accept="image/*"
                className="hidden"
                onChange={(e) => e.target.files?.[0] && addPartner(e.target.files[0])}
                disabled={uploadingLogo || !newPartner.company_name}
              />
            </label>
          </div>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {partners.map((partner) => (
            <div key={partner.id} className="card-surface p-4 text-center relative group">
              <img src={partner.logo_url} alt={partner.company_name} className="h-12 object-contain mx-auto mb-2 grayscale group-hover:grayscale-0 transition-all" />
              <p className="text-xs font-medium">{partner.company_name}</p>
              <button
                onClick={() => deletePartner(partner.id)}
                className="absolute top-2 right-2 text-destructive opacity-0 group-hover:opacity-100 transition-opacity"
              >
                <Trash2 size={14} />
              </button>
            </div>
          ))}
        </div>
        {partners.length === 0 && (
          <div className="text-center py-8 text-muted-foreground">No partners yet. Add your first trusted partner above.</div>
        )}
      </TabsContent>

      {/* Testimonials */}
      <TabsContent value="testimonials">
        <div className="card-surface p-6 mb-6">
          <h4 className="font-display text-lg mb-4">ADD NEW TESTIMONIAL</h4>
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Input
                placeholder="Client name *"
                value={newTestimonial.client_name}
                onChange={(e) => setNewTestimonial({ ...newTestimonial, client_name: e.target.value })}
              />
              <Input
                placeholder="Role (e.g., CEO)"
                value={newTestimonial.client_role}
                onChange={(e) => setNewTestimonial({ ...newTestimonial, client_role: e.target.value })}
              />
              <Input
                placeholder="Company name"
                value={newTestimonial.company_name}
                onChange={(e) => setNewTestimonial({ ...newTestimonial, company_name: e.target.value })}
              />
            </div>
            <Textarea
              placeholder="Review content *"
              value={newTestimonial.content}
              onChange={(e) => setNewTestimonial({ ...newTestimonial, content: e.target.value })}
              rows={3}
            />
            <div className="flex items-center gap-4">
              <span className="text-sm text-muted-foreground">Rating:</span>
              <div className="flex gap-1">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    onClick={() => setNewTestimonial({ ...newTestimonial, rating: star })}
                    className={star <= newTestimonial.rating ? "text-primary" : "text-muted-foreground"}
                  >
                    <Star size={18} fill={star <= newTestimonial.rating ? "currentColor" : "none"} />
                  </button>
                ))}
              </div>
              <Button onClick={addTestimonial} size="sm" className="ml-auto bg-primary text-primary-foreground font-bold">
                <Plus size={14} className="mr-1" /> Add Testimonial
              </Button>
            </div>
          </div>
        </div>

        <div className="space-y-4">
          {testimonials.map((t) => (
            <div key={t.id} className={`card-surface p-6 ${!t.is_active ? "opacity-50" : ""}`}>
              <div className="flex justify-between items-start">
                <div>
                  <div className="flex items-center gap-2 mb-2">
                    <span className="font-bold">{t.client_name}</span>
                    {t.client_role && <span className="text-sm text-muted-foreground">• {t.client_role}</span>}
                    {t.company_name && <span className="text-sm text-muted-foreground">@ {t.company_name}</span>}
                  </div>
                  <p className="text-sm text-foreground/80 mb-2">"{t.content}"</p>
                  <div className="flex gap-0.5">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <Star key={star} size={12} className={star <= t.rating ? "text-primary fill-primary" : "text-muted-foreground"} />
                    ))}
                  </div>
                </div>
                <div className="flex gap-2">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => toggleTestimonialActive(t.id, t.is_active)}
                  >
                    {t.is_active ? "Hide" : "Show"}
                  </Button>
                  <Button variant="ghost" size="sm" onClick={() => deleteTestimonial(t.id)} className="text-destructive">
                    <Trash2 size={14} />
                  </Button>
                </div>
              </div>
            </div>
          ))}
        </div>
        {testimonials.length === 0 && (
          <div className="text-center py-8 text-muted-foreground">No testimonials yet. Add your first client review above.</div>
        )}
      </TabsContent>
    </Tabs>
  );
};

export default ContentManagementTab;
