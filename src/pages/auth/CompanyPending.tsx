import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import PageLayout from "@/components/PageLayout";
import { Clock } from "lucide-react";

const CompanyPending = () => {
  return (
    <PageLayout>
      <section className="py-20 md:py-28">
        <div className="container mx-auto px-4 max-w-md">
          <div className="text-center mb-8">
            <span className="section-tag">Under Review</span>
            <h1 className="font-display text-4xl md:text-5xl">ACCOUNT SUBMITTED</h1>
          </div>
          <div className="card-surface p-8 text-center">
            <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-6">
              <Clock className="h-8 w-8 text-primary" />
            </div>
            <p className="text-sm text-foreground mb-2">Your company account is under review.</p>
            <p className="text-sm text-muted-foreground mb-6">
              We verify all company accounts within 1 business day.
              <br />
              You'll receive confirmation once your access is activated.
              <br /><br />
              Questions? Email{" "}
              <a href="mailto:team@remotelaborlink.com" className="text-primary hover:underline">
                team@remotelaborlink.com
              </a>
            </p>
            <Button asChild variant="outline" className="w-full">
              <Link to="/">Return to Homepage</Link>
            </Button>
          </div>
        </div>
      </section>
    </PageLayout>
  );
};

export default CompanyPending;
