import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import PageLayout from "@/components/PageLayout";
import { CheckCircle } from "lucide-react";

const CompanyVerified = () => {
  return (
    <PageLayout>
      <section className="py-20 md:py-28">
        <div className="container mx-auto px-4 max-w-md">
          <div className="text-center mb-8">
            <span className="section-tag">Success</span>
            <h1 className="font-display text-4xl md:text-5xl">EMAIL CONFIRMED</h1>
          </div>
          <div className="card-surface p-8 text-center">
            <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-6">
              <CheckCircle className="h-8 w-8 text-primary" />
            </div>
            <p className="text-sm text-foreground mb-2">Your email has been verified.</p>
            <p className="text-sm text-muted-foreground mb-6">
              Your company account is now under review.
              <br />
              We verify all company accounts within 1 business day.
              <br />
              You'll receive an email once your access is activated.
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

export default CompanyVerified;
