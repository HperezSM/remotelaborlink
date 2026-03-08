import { useAuth } from "@/hooks/useAuth";
import PageLayout from "@/components/PageLayout";

const CandidateDashboard = () => {
  const { user } = useAuth();

  const statusSteps = [
    { label: "Submitted", active: true },
    { label: "Under Review", active: false },
    { label: "Screening Call", active: false },
    { label: "Active in Portal", active: false },
    { label: "Placed", active: false },
  ];

  return (
    <PageLayout>
      <section className="py-12">
        <div className="container mx-auto px-4 max-w-4xl">
          <span className="section-tag">Dashboard</span>
          <h1 className="font-display text-4xl md:text-5xl mb-8">YOUR DASHBOARD</h1>

          {/* Status tracker */}
          <div className="card-surface p-8 mb-8">
            <h2 className="font-body font-bold text-sm mb-6 normal-case text-foreground">Application Status</h2>
            <div className="flex items-center gap-2">
              {statusSteps.map((step, i) => (
                <div key={step.label} className="flex items-center gap-2 flex-1">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-mono shrink-0 ${
                    step.active ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground"
                  }`}>
                    {i + 1}
                  </div>
                  <span className={`text-xs hidden sm:block ${step.active ? "text-foreground" : "text-muted-foreground"}`}>
                    {step.label}
                  </span>
                  {i < statusSteps.length - 1 && <div className="flex-1 h-px bg-border" />}
                </div>
              ))}
            </div>
          </div>

          {/* Quick actions */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="card-surface p-8 flex flex-col items-center text-center">
              <h3 className="font-display text-xl mb-2">EDIT PROFILE</h3>
              <p className="text-sm text-muted-foreground mb-4">Update your professional information</p>
              <a href="/talent/profile/edit" className="text-primary text-sm font-bold hover:underline">Edit Profile →</a>
            </div>
            <div className="card-surface p-8 flex flex-col items-center text-center">
              <h3 className="font-display text-xl mb-2">MESSAGES</h3>
              <p className="text-sm text-muted-foreground mb-4">No new messages</p>
              <span className="text-muted-foreground text-sm">Coming soon</span>
            </div>
          </div>
        </div>
      </section>
    </PageLayout>
  );
};

export default CandidateDashboard;
