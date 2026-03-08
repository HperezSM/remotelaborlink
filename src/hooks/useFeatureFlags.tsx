import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";

type FeatureFlags = Record<string, boolean>;

export const useFeatureFlags = () => {
  const [flags, setFlags] = useState<FeatureFlags>({});
  const [loading, setLoading] = useState(true);

  const fetchFlags = async () => {
    const { data } = await supabase.from("feature_flags").select("flag_key, enabled");
    if (data) {
      const map: FeatureFlags = {};
      data.forEach((f: any) => { map[f.flag_key] = f.enabled; });
      setFlags(map);
    }
    setLoading(false);
  };

  useEffect(() => { fetchFlags(); }, []);

  const isEnabled = (key: string) => flags[key] === true;

  return { flags, loading, isEnabled, refetch: fetchFlags };
};
