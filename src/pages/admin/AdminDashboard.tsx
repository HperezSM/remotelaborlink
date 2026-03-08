import { useAuth } from "@/hooks/useAuth";

const AdminDashboard = () => {
  const { user } = useAuth();

  const kpis = [
    { label: "Total Candidates", value: "0" },
    { label: "Pending Review", value: "0" },
    { label: "Active Candidates", value: "0" },
    { label: "Total Companies", value: "0" },
    { label: "Pending Approvals", value: "0" },
    { label: "Open Roles", value: "0" },
    { label: "Active Matches", value: "0" },
  ];

  return (
    <div className="min-h-screen bg-background">
      {/* Simple admin header */}
      <header className="border-b border-border px-6 py-4 flex items-center justify-between" style={{ background: 'rgba(10,10,10,0.95)' }}>
        <span className="font-body font-bold text-sm tracking-[2px] text-foreground">ADMIN DASHBOARD</span>
        <span className="text-xs font-mono text-muted-foreground">{user?.email}</span>
      </header>

      <div className="p-6 max-w-6xl mx-auto">
        <h1 className="font-display text-4xl mb-8">OVERVIEW</h1>

        {/* KPI cards */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 mb-8">
          {kpis.map((kpi) => (
            <div key={kpi.label} className="card-surface p-5 border-l-[3px] border-l-primary">
              <div className="font-display text-3xl text-foreground">{kpi.value}</div>
              <div className="text-[10px] font-mono text-muted-foreground uppercase tracking-wider mt-1">{kpi.label}</div>
            </div>
          ))}
        </div>

        {/* Empty state */}
        <div className="card-surface p-12 text-center">
          <h2 className="font-display text-2xl mb-3">NO DATA YET</h2>
          <p className="text-sm text-muted-foreground">Candidates and companies will appear here once they sign up.</p>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
