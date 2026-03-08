import { useMemo } from "react";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, LineChart, Line, CartesianGrid } from "recharts";

interface Props {
  candidates: any[];
  companies: any[];
  roleRequests: any[];
  pushes: any[];
}

const COLORS = ["hsl(46, 85%, 58%)", "hsl(0, 0%, 42%)", "hsl(131, 70%, 45%)", "hsl(0, 75%, 55%)", "hsl(42, 99%, 59%)"];

const AnalyticsTab = ({ candidates, companies, roleRequests, pushes }: Props) => {
  const signupsByMonth = useMemo(() => {
    const months: Record<string, { candidates: number; companies: number }> = {};
    const fmt = (d: string) => {
      const date = new Date(d);
      return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}`;
    };
    candidates.forEach(c => {
      const m = fmt(c.created_at);
      if (!months[m]) months[m] = { candidates: 0, companies: 0 };
      months[m].candidates++;
    });
    companies.forEach(c => {
      const m = fmt(c.created_at);
      if (!months[m]) months[m] = { candidates: 0, companies: 0 };
      months[m].companies++;
    });
    return Object.entries(months)
      .sort(([a], [b]) => a.localeCompare(b))
      .slice(-6)
      .map(([month, data]) => ({ month, ...data }));
  }, [candidates, companies]);

  const candidateStatusData = useMemo(() => {
    const counts: Record<string, number> = {};
    candidates.forEach(c => { counts[c.status] = (counts[c.status] || 0) + 1; });
    return Object.entries(counts).map(([name, value]) => ({ name: name.replace("_", " "), value }));
  }, [candidates]);

  const pushActionData = useMemo(() => {
    const counts: Record<string, number> = {};
    pushes.forEach(p => { counts[p.company_action] = (counts[p.company_action] || 0) + 1; });
    return Object.entries(counts).map(([name, value]) => ({ name: name === "none" ? "pending" : name.replace("_", " "), value }));
  }, [pushes]);

  const rolesByType = useMemo(() => {
    const counts: Record<string, number> = {};
    roleRequests.forEach(r => { counts[r.role_type] = (counts[r.role_type] || 0) + 1; });
    return Object.entries(counts).map(([name, value]) => ({ name, value }));
  }, [roleRequests]);

  const placementRate = candidates.length > 0
    ? Math.round((candidates.filter(c => c.status === "placed").length / candidates.length) * 100)
    : 0;

  const avgResponseTime = pushes.length > 0
    ? Math.round(pushes.filter(p => p.company_action !== "none").length / pushes.length * 100)
    : 0;

  const chartTooltipStyle = {
    contentStyle: { background: "hsl(0, 0%, 10%)", border: "1px solid hsl(0, 0%, 16%)", borderRadius: 8, fontSize: 12 },
    labelStyle: { color: "hsl(55, 14%, 95%)" },
  };

  return (
    <div className="space-y-8">
      {/* KPI row */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: "Placement Rate", value: `${placementRate}%`, sub: "candidates placed" },
          { label: "Company Response", value: `${avgResponseTime}%`, sub: "pushes acted on" },
          { label: "Open Roles", value: roleRequests.filter(r => !["filled", "closed"].includes(r.status)).length, sub: "active requests" },
          { label: "Pipeline", value: pushes.length, sub: "total matches" },
        ].map(k => (
          <div key={k.label} className="card-surface p-5 border-l-[3px] border-l-primary">
            <div className="font-display text-3xl text-foreground">{k.value}</div>
            <div className="text-[10px] font-mono text-muted-foreground uppercase tracking-wider mt-1">{k.label}</div>
            <div className="text-[10px] font-body text-muted-foreground mt-0.5">{k.sub}</div>
          </div>
        ))}
      </div>

      {/* Charts row 1 */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="card-surface p-6">
          <h3 className="font-display text-lg mb-4">SIGNUP TRENDS</h3>
          <ResponsiveContainer width="100%" height={240}>
            <BarChart data={signupsByMonth}>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(0, 0%, 16%)" />
              <XAxis dataKey="month" tick={{ fill: "hsl(0, 0%, 42%)", fontSize: 11 }} />
              <YAxis tick={{ fill: "hsl(0, 0%, 42%)", fontSize: 11 }} />
              <Tooltip {...chartTooltipStyle} />
              <Bar dataKey="candidates" fill="hsl(46, 85%, 58%)" radius={[4, 4, 0, 0]} name="Candidates" />
              <Bar dataKey="companies" fill="hsl(0, 0%, 42%)" radius={[4, 4, 0, 0]} name="Companies" />
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div className="card-surface p-6">
          <h3 className="font-display text-lg mb-4">CANDIDATE STATUS</h3>
          <ResponsiveContainer width="100%" height={240}>
            <PieChart>
              <Pie data={candidateStatusData} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={80} label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}>
                {candidateStatusData.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
              </Pie>
              <Tooltip {...chartTooltipStyle} />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Charts row 2 */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="card-surface p-6">
          <h3 className="font-display text-lg mb-4">COMPANY ENGAGEMENT</h3>
          <ResponsiveContainer width="100%" height={240}>
            <PieChart>
              <Pie data={pushActionData} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={80} label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}>
                {pushActionData.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
              </Pie>
              <Tooltip {...chartTooltipStyle} />
            </PieChart>
          </ResponsiveContainer>
        </div>

        <div className="card-surface p-6">
          <h3 className="font-display text-lg mb-4">ROLES BY TYPE</h3>
          <ResponsiveContainer width="100%" height={240}>
            <BarChart data={rolesByType} layout="vertical">
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(0, 0%, 16%)" />
              <XAxis type="number" tick={{ fill: "hsl(0, 0%, 42%)", fontSize: 11 }} />
              <YAxis type="category" dataKey="name" tick={{ fill: "hsl(0, 0%, 42%)", fontSize: 11 }} width={120} />
              <Tooltip {...chartTooltipStyle} />
              <Bar dataKey="value" fill="hsl(46, 85%, 58%)" radius={[0, 4, 4, 0]} name="Requests" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};

export default AnalyticsTab;
