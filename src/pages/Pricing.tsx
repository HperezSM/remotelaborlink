import { Link } from "react-router-dom";
import PageLayout from "@/components/PageLayout";
import { Button } from "@/components/ui/button";
import { Check } from "lucide-react";

const plans = [
  {
    name: "Talent Access",
    price: "$20",
    period: "/month",
    highlight: false,
    features: [
      "Browse all approved candidates",
      "Filter by role, skills, availability",
      "Download CVs",
      "10 candidate messages/month",
      "Unlimited role requests",
    ],
  },
  {
    name: "Unlimited",
    price: "$49.99",
    period: "/month",
    highlight: true,
    badge: "RECOMMENDED",
    features: [
      "Everything in Talent Access",
      "Unlimited candidate messaging",
      "Priority matching by our team",
      "Profile view notifications sent to candidates",
      "Dedicated account support",
    ],
  },
];

const Pricing = () => {
  return (
    <PageLayout>
      <section className="pt-32 pb-20 px-[5%]">
        <div className="max-w-4xl mx-auto text-center">
          <span className="section-tag">Pricing</span>
          <h1 className="font-display text-5xl md:text-7xl mb-4">
            SIMPLE<br />PRICING.
          </h1>
          <p className="text-muted-foreground max-w-xl mx-auto text-lg mb-16">
            Choose the plan that fits your hiring needs. Upgrade or cancel anytime.
          </p>

          <div className="grid md:grid-cols-2 gap-6 max-w-3xl mx-auto">
            {plans.map((plan) => (
              <div
                key={plan.name}
                className={`card-surface p-8 text-left relative ${
                  plan.highlight ? "border-primary" : ""
                }`}
              >
                {plan.badge && (
                  <span className="absolute -top-3 left-6 bg-primary text-primary-foreground text-[10px] font-mono font-bold px-3 py-1 rounded-full tracking-wider">
                    {plan.badge}
                  </span>
                )}
                <h3 className="font-display text-2xl mb-2">{plan.name.toUpperCase()}</h3>
                <div className="flex items-baseline gap-1 mb-6">
                  <span className="font-display text-5xl">{plan.price}</span>
                  <span className="text-muted-foreground font-mono text-sm">{plan.period}</span>
                </div>
                <ul className="space-y-3 mb-8">
                  {plan.features.map((feature) => (
                    <li key={feature} className="flex items-start gap-3 text-sm">
                      <Check size={16} className="text-primary shrink-0 mt-0.5" />
                      <span className="text-foreground/80">{feature}</span>
                    </li>
                  ))}
                </ul>
                <Button
                  className="w-full bg-primary text-primary-foreground font-bold"
                  disabled
                >
                  Coming Soon
                </Button>
                <p className="text-[10px] text-muted-foreground text-center mt-2 font-mono">
                  Stripe payments coming soon
                </p>
              </div>
            ))}
          </div>

          {/* Free tier info */}
          <div className="card-surface p-8 max-w-3xl mx-auto mt-10 text-left">
            <h3 className="font-display text-xl mb-3">FREE TIER</h3>
            <p className="text-sm text-muted-foreground">
              All companies start on the free tier. You'll receive candidates that our admin team manually
              pushes to your talent pool based on your role requests. Upgrade to browse and message
              candidates directly.
            </p>
          </div>
        </div>
      </section>
    </PageLayout>
  );
};

export default Pricing;
