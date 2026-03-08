import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Star, Quote } from "lucide-react";

type Testimonial = {
  id: string;
  client_name: string;
  client_role: string | null;
  company_name: string | null;
  content: string;
  rating: number;
  photo_url: string | null;
};

const TestimonialsSection = () => {
  const [testimonials, setTestimonials] = useState<Testimonial[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTestimonials = async () => {
      const { data } = await supabase
        .from("testimonials")
        .select("id, client_name, client_role, company_name, content, rating, photo_url")
        .eq("is_active", true)
        .order("display_order");
      setTestimonials((data as Testimonial[]) || []);
      setLoading(false);
    };
    fetchTestimonials();
  }, []);

  if (loading) return null;
  if (testimonials.length === 0) return null;

  return (
    <section className="py-24">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <span className="section-tag">Testimonials</span>
          <h2 className="font-display text-5xl md:text-6xl">WHAT CLIENTS SAY</h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {testimonials.map((t) => (
            <div
              key={t.id}
              className="card-surface p-8 relative group hover:border-primary transition-all duration-300"
            >
              <Quote className="absolute top-4 right-4 text-primary/20 h-8 w-8" />
              <div className="flex gap-0.5 mb-4">
                {[1, 2, 3, 4, 5].map((star) => (
                  <Star
                    key={star}
                    size={14}
                    className={star <= t.rating ? "text-primary fill-primary" : "text-muted-foreground"}
                  />
                ))}
              </div>
              <p className="text-foreground/80 text-[15px] leading-relaxed mb-6 italic">
                "{t.content}"
              </p>
              <div className="flex items-center gap-3 pt-4 border-t border-border">
                {t.photo_url ? (
                  <img src={t.photo_url} alt={t.client_name} className="w-10 h-10 rounded-full object-cover" />
                ) : (
                  <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center font-display text-primary text-sm">
                    {t.client_name.split(" ").map(n => n.charAt(0)).join("").slice(0, 2)}
                  </div>
                )}
                <div>
                  <p className="font-bold text-sm">{t.client_name}</p>
                  <p className="text-xs text-muted-foreground">
                    {[t.client_role, t.company_name].filter(Boolean).join(" @ ")}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default TestimonialsSection;
