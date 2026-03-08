import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import PageLayout from "@/components/PageLayout";
import { CheckCircle } from "lucide-react";

const Verified = () => {
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
            <p className="text-sm text-foreground mb-2">Your account is verified.</p>
            <p className="text-sm text-muted-foreground mb-6">
              Complete your profile to get matched with US companies.
            </p>
            <Button asChild className="w-full bg-primary text-primary-foreground font-bold py-3.5 hover:opacity-90">
              <Link to="/talent/profile/edit">Complete My Profile →</Link>
            </Button>
          </div>
        </div>
      </section>
    </PageLayout>
  );
};

export default Verified;
