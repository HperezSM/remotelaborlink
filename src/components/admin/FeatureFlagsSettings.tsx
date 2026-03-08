import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";

const FeatureFlagsSettings = () => {
  const [flags, setFlags] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => { fetchFlags(); }, []);

  const fetchFlags = async () => {
    const { data } = await supabase.from("feature_flags").select("*").order("flag_key");
    setFlags(data || []);
    setLoading(false);
  };

  const toggleFlag = async (id: string, enabled: boolean) => {
    const { error } = await supabase.from("feature_flags").update({ enabled }).eq("id", id);
    if (error) toast({ title: "Error", description: error.message, variant: "destructive" });
    else {
      setFlags(prev => prev.map(f => f.id === id ? { ...f, enabled } : f));
      toast({ title: `Feature ${enabled ? "enabled" : "disabled"}` });
    }
  };

  if (loading) return <p className="text-sm text-muted-foreground">Loading flags...</p>;

  return (
    <div className="card-surface p-6 max-w-lg">
      <h4 className="font-display text-lg mb-6">FEATURE FLAGS</h4>
      <div className="space-y-5">
        {flags.map(flag => (
          <div key={flag.id} className="flex items-center justify-between">
            <Label className="text-sm">{flag.flag_label}</Label>
            <Switch
              checked={flag.enabled}
              onCheckedChange={(v) => toggleFlag(flag.id, v)}
            />
          </div>
        ))}
      </div>
    </div>
  );
};

export default FeatureFlagsSettings;
