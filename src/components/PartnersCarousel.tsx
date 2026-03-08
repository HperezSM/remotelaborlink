import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { motion } from "framer-motion";

type Partner = {
  id: string;
  company_name: string;
  logo_url: string;
  website_url: string | null;
};

const PartnersCarousel = () => {
  const [partners, setPartners] = useState<Partner[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPartners = async () => {
      const { data } = await supabase
        .from("partners")
        .select("id, company_name, logo_url, website_url")
        .eq("is_active", true)
        .order("display_order");
      setPartners((data as Partner[]) || []);
      setLoading(false);
    };
    fetchPartners();
  }, []);

  if (loading) return null;
  if (partners.length === 0) return null;

  // Duplicate partners for seamless infinite scroll
  const duplicatedPartners = [...partners, ...partners, ...partners];

  return (
    <section className="py-16 overflow-hidden bg-card/50">
      <div className="container mx-auto px-4 mb-8">
        <h3 className="font-display text-3xl text-center text-foreground/80">TRUSTED BY</h3>
      </div>
      <div className="relative">
        <motion.div
          className="flex gap-16 items-center"
          animate={{
            x: [0, -100 * partners.length],
          }}
          transition={{
            x: {
              repeat: Infinity,
              repeatType: "loop",
              duration: partners.length * 4,
              ease: "linear",
            },
          }}
          style={{ width: "fit-content" }}
        >
          {duplicatedPartners.map((partner, index) => (
            <a
              key={`${partner.id}-${index}`}
              href={partner.website_url || "#"}
              target={partner.website_url ? "_blank" : undefined}
              rel="noopener noreferrer"
              className="shrink-0 grayscale hover:grayscale-0 opacity-60 hover:opacity-100 transition-all duration-300"
            >
              <img
                src={partner.logo_url}
                alt={partner.company_name}
                className="h-10 md:h-12 w-auto object-contain"
                title={partner.company_name}
              />
            </a>
          ))}
        </motion.div>
      </div>
    </section>
  );
};

export default PartnersCarousel;
