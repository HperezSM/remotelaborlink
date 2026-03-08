import { useState } from "react";
import { Search, SlidersHorizontal, X } from "lucide-react";
import { Button } from "@/components/ui/button";

const ROLE_OPTIONS = [
  "Project Manager", "Scrum Master", "Full Stack Developer", "Frontend Developer",
  "Backend Developer", "UX/UI Designer", "Customer Support", "Operations Manager",
];

const SENIORITY_OPTIONS = ["Mid", "Senior", "Lead/Principal"];

const COUNTRY_OPTIONS = [
  "Mexico", "Colombia", "Argentina", "Brazil", "Chile", "Peru", "Costa Rica", "Ecuador",
  "Uruguay", "Panama", "Guatemala", "Dominican Republic",
];

const STATUS_OPTIONS = ["pending_review", "screening", "active", "placed", "rejected"];

interface CandidateFiltersProps {
  filters: {
    search: string;
    role: string;
    seniority: string;
    country: string;
    status: string;
    minRate: string;
    maxRate: string;
  };
  onFiltersChange: (filters: any) => void;
  showStatus?: boolean;
}

const CandidateFilters = ({ filters, onFiltersChange, showStatus = true }: CandidateFiltersProps) => {
  const [showAdvanced, setShowAdvanced] = useState(false);

  const update = (key: string, value: string) => {
    onFiltersChange({ ...filters, [key]: value });
  };

  const clearAll = () => {
    onFiltersChange({ search: "", role: "", seniority: "", country: "", status: "", minRate: "", maxRate: "" });
  };

  const activeCount = Object.entries(filters).filter(([k, v]) => v && k !== "search").length;

  const inputClass = "bg-background border border-border rounded px-3 py-2 text-sm text-foreground focus:outline-none focus:border-primary";

  return (
    <div className="space-y-3">
      <div className="flex flex-wrap items-center gap-3">
        <div className="relative flex-1 min-w-[200px]">
          <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
          <input
            placeholder="Search by name or skill..."
            value={filters.search}
            onChange={e => update("search", e.target.value)}
            className={`${inputClass} w-full pl-9`}
          />
        </div>
        <select value={filters.role} onChange={e => update("role", e.target.value)} className={inputClass}>
          <option value="">All roles</option>
          {ROLE_OPTIONS.map(r => <option key={r} value={r}>{r}</option>)}
        </select>
        {showStatus && (
          <select value={filters.status} onChange={e => update("status", e.target.value)} className={inputClass}>
            <option value="">All statuses</option>
            {STATUS_OPTIONS.map(s => <option key={s} value={s}>{s.replace("_", " ")}</option>)}
          </select>
        )}
        <Button
          variant="outline"
          size="sm"
          onClick={() => setShowAdvanced(!showAdvanced)}
          className="gap-1.5"
        >
          <SlidersHorizontal size={14} />
          Filters
          {activeCount > 0 && (
            <span className="ml-1 bg-primary text-primary-foreground text-[10px] font-bold px-1.5 py-0.5 rounded-full">{activeCount}</span>
          )}
        </Button>
        {activeCount > 0 && (
          <button onClick={clearAll} className="text-xs text-muted-foreground hover:text-foreground flex items-center gap-1">
            <X size={12} /> Clear all
          </button>
        )}
      </div>

      {showAdvanced && (
        <div className="card-surface p-4 flex flex-wrap gap-4">
          <div>
            <label className="text-[10px] font-mono text-muted-foreground uppercase tracking-wider mb-1 block">Seniority</label>
            <select value={filters.seniority} onChange={e => update("seniority", e.target.value)} className={inputClass}>
              <option value="">Any</option>
              {SENIORITY_OPTIONS.map(s => <option key={s} value={s}>{s}</option>)}
            </select>
          </div>
          <div>
            <label className="text-[10px] font-mono text-muted-foreground uppercase tracking-wider mb-1 block">Country</label>
            <select value={filters.country} onChange={e => update("country", e.target.value)} className={inputClass}>
              <option value="">Any</option>
              {COUNTRY_OPTIONS.map(c => <option key={c} value={c}>{c}</option>)}
            </select>
          </div>
          <div>
            <label className="text-[10px] font-mono text-muted-foreground uppercase tracking-wider mb-1 block">Min Rate ($/hr)</label>
            <input type="number" value={filters.minRate} onChange={e => update("minRate", e.target.value)} placeholder="0" className={`${inputClass} w-24`} />
          </div>
          <div>
            <label className="text-[10px] font-mono text-muted-foreground uppercase tracking-wider mb-1 block">Max Rate ($/hr)</label>
            <input type="number" value={filters.maxRate} onChange={e => update("maxRate", e.target.value)} placeholder="200" className={`${inputClass} w-24`} />
          </div>
        </div>
      )}
    </div>
  );
};

export default CandidateFilters;

export function filterCandidates(candidates: any[], filters: {
  search: string; role: string; seniority: string; country: string; status: string; minRate: string; maxRate: string;
}) {
  return candidates.filter(c => {
    if (filters.status && c.status !== filters.status) return false;
    if (filters.role && !(c.roles_applied || []).some((r: string) => r.toLowerCase().includes(filters.role.toLowerCase()))) return false;
    if (filters.seniority && c.seniority_level !== filters.seniority) return false;
    if (filters.country && c.country !== filters.country) return false;
    if (filters.search) {
      const q = filters.search.toLowerCase();
      const nameMatch = c.full_name?.toLowerCase().includes(q);
      const skillMatch = (c.technical_skills || []).some((s: string) => s.toLowerCase().includes(q));
      if (!nameMatch && !skillMatch) return false;
    }
    if (filters.minRate && c.expected_rate_usd && c.expected_rate_usd < parseInt(filters.minRate)) return false;
    if (filters.maxRate && c.expected_rate_usd && c.expected_rate_usd > parseInt(filters.maxRate)) return false;
    return true;
  });
}
