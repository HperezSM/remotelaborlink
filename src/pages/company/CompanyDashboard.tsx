import { useAuth } from "@/hooks/useAuth";
import PageLayout from "@/components/PageLayout";

const CompanyDashboard = () => {
  const { user } = useAuth();

  return (
    <PageLayout>
      <section className="py-12">
        <div className="container mx-auto px-4 max-w-5xl">
          <span className="section-tag">Company Portal</span>
          <h1 className="font-display text-4xl md:text-5xl mb-8">DASHBOARD</h1>

          {/* Summary cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
            {[
              { label: "Active Requests", value: "0" },
              { label: "Candidates in Review", value: "0" },
              { label: "Interviews Scheduled", value: "0" },
              { label: "Placements Made", value: "0" },
            ].map((card) => (
              <div key={card.label} className="card-surface p-6 border-l-[3px] border-l-primary">
                <div className="font-display text-3xl text-foreground">{card.value}</div>
                <div className="text-xs font-mono text-muted-foreground uppercase tracking-wider mt-1">{card.label}</div>
              </div>
            ))}
          </div>

          {/* Pending state */}
          <div className="card-surface p-12 text-center">
            <h2 className="font-display text-2xl mb-3">ACCOUNT UNDER REVIEW</h2>
            <p className="text-sm text-muted-foreground max-w-md mx-auto">
              We verify all company accounts within 1 business day. You'll receive an email once your portal access is activated.
            </p>
          </div>
        </div>
      </section>
    </PageLayout>
  );
};

export default CompanyDashboard;
