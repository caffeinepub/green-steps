import { AuthGuard } from "@/components/AuthGuard";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { useLatestEntry } from "@/hooks/useQueries";
import { useNavigate } from "@tanstack/react-router";
import {
  AlertTriangle,
  ArrowRight,
  Bike,
  Car,
  CheckCircle2,
  Droplets,
  Flame,
  Leaf,
  Loader2,
  Recycle,
  ShoppingBag,
  Sun,
  TreePine,
  TrendingUp,
  XCircle,
  Zap,
} from "lucide-react";
import { motion } from "motion/react";

interface Tip {
  icon: React.ElementType;
  title: string;
  description: string;
}

const LOW_TIPS: Tip[] = [
  {
    icon: CheckCircle2,
    title: "Keep it up! You're an eco-leader",
    description:
      "Your emissions are well below average. Share your habits with friends and inspire others to follow suit.",
  },
  {
    icon: Bike,
    title: "Maintain your sustainable transport habits",
    description:
      "Continue walking, cycling, or using public transit. You're already making a significant impact.",
  },
  {
    icon: Sun,
    title: "Consider renewable energy upgrades",
    description:
      "Since you're already efficient, look into rooftop solar or green energy plans to reach near-zero emissions.",
  },
  {
    icon: Recycle,
    title: "Explore zero-waste lifestyle",
    description:
      "Your waste levels are low — take the next step with composting, upcycling, and buying secondhand.",
  },
  {
    icon: TreePine,
    title: "Offset your remaining footprint",
    description:
      "Plant trees or support certified carbon offset programs to make your net footprint even smaller.",
  },
];

const MEDIUM_TIPS: Tip[] = [
  {
    icon: Car,
    title: "Reduce car trips",
    description:
      "Try carpooling, using public transit once or twice a week. Even small changes in commuting reduce CO₂ significantly.",
  },
  {
    icon: Zap,
    title: "Switch to energy-efficient appliances",
    description:
      "LED bulbs, smart thermostats, and energy-star appliances can cut your electricity usage by 20–30%.",
  },
  {
    icon: ShoppingBag,
    title: "Adopt a low-carbon diet",
    description:
      "Reduce red meat consumption by 50% and replace with plant-based foods. This is one of the highest-impact changes you can make.",
  },
  {
    icon: Droplets,
    title: "Reduce hot water usage",
    description:
      "Shorter showers and cold-wash laundry cycles save both energy and water. Small habits = big savings over time.",
  },
  {
    icon: Recycle,
    title: "Improve recycling and composting",
    description:
      "Separate organic waste for composting. It prevents methane emissions from landfill and creates nutrient-rich soil.",
  },
];

const HIGH_TIPS: Tip[] = [
  {
    icon: Car,
    title: "Drastically cut transportation emissions",
    description:
      "Consider switching to an electric or hybrid vehicle. Eliminate unnecessary flights — they're among the highest per-trip emissions.",
  },
  {
    icon: Flame,
    title: "Transition away from gas heating",
    description:
      "Switch to heat pumps or district heating. Gas heating is a major contributor to high household emissions.",
  },
  {
    icon: Zap,
    title: "Conduct a home energy audit",
    description:
      "Professional audits identify the biggest energy drains. Insulation improvements alone can cut heating needs by 40%.",
  },
  {
    icon: Sun,
    title: "Install solar panels urgently",
    description:
      "With your current electricity consumption, solar would pay back in 4–7 years and dramatically cut your grid dependency.",
  },
  {
    icon: Leaf,
    title: "Make a 30-day carbon reduction challenge",
    description:
      "Set a concrete target — e.g. reduce driving by 30%, cut meat to 3 days/week, switch 50% of energy to renewables.",
  },
];

const PROGRESS_STEPS = [
  {
    step: 1,
    title: "Measure",
    desc: "Track consistently for 4 weeks to establish a baseline",
  },
  {
    step: 2,
    title: "Identify",
    desc: "Find your highest-impact category and focus there first",
  },
  {
    step: 3,
    title: "Act",
    desc: "Make one significant change per month for sustainable progress",
  },
  {
    step: 4,
    title: "Share",
    desc: "Encourage friends and family — collective action multiplies impact",
  },
];

function SuggestionContent() {
  const navigate = useNavigate();
  const { data: latestEntry, isLoading } = useLatestEntry();

  if (isLoading) {
    return (
      <div className="container mx-auto max-w-3xl px-4 py-10">
        <Skeleton className="h-10 w-64 mb-4" />
        <Skeleton className="h-5 w-80 mb-8" />
        <div className="space-y-4">
          {[1, 2, 3, 4].map((i) => (
            <Skeleton key={i} className="h-20 w-full rounded-xl" />
          ))}
        </div>
      </div>
    );
  }

  const totalCO2 = latestEntry?.totalCO2 ?? 0;
  const level =
    latestEntry?.totalCO2 != null
      ? totalCO2 < 5
        ? "Low"
        : totalCO2 < 15
          ? "Medium"
          : "High"
      : null;

  const tips =
    level === "Low" ? LOW_TIPS : level === "High" ? HIGH_TIPS : MEDIUM_TIPS;

  const alertConfig = {
    Low: {
      icon: CheckCircle2,
      bg: "bg-level-low",
      border: "border-level-low",
      text: "text-level-low",
      badge: "bg-level-low text-white",
      headline: "Great work! Your emissions are low.",
      sub: `${totalCO2.toFixed(2)} kg CO₂ — You're below the global average of 8.1 tonnes/year. Here's how to maintain and improve:`,
    },
    Medium: {
      icon: AlertTriangle,
      bg: "bg-level-medium",
      border: "border-level-medium",
      text: "text-level-medium",
      badge: "bg-level-medium text-white",
      headline: "Room for improvement — you're at medium emissions.",
      sub: `${totalCO2.toFixed(2)} kg CO₂ — You're around the global average. These targeted actions will help you reduce:`,
    },
    High: {
      icon: XCircle,
      bg: "bg-level-high",
      border: "border-level-high",
      text: "text-level-high",
      badge: "bg-level-high text-white",
      headline: "Urgent action needed — high emissions detected.",
      sub: `${totalCO2.toFixed(2)} kg CO₂ — Your footprint is significantly above average. Take these steps to reduce it:`,
    },
  };

  const alertCfg = level ? alertConfig[level] : null;

  return (
    <div className="container mx-auto max-w-3xl px-4 md:px-6 py-10">
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-8"
      >
        <div className="flex items-center gap-2 mb-2">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-primary/10">
            <Leaf className="h-5 w-5 text-primary" />
          </div>
          <h1 className="font-display text-3xl font-bold">Eco Suggestions</h1>
        </div>
        <p className="text-muted-foreground">
          Personalized tips based on your latest carbon tracking data.
        </p>
      </motion.div>

      {/* No data state */}
      {!latestEntry && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-center py-16"
          data-ocid="suggestion.empty_state"
        >
          <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-muted mx-auto mb-4">
            <Leaf className="h-8 w-8 text-muted-foreground" />
          </div>
          <h2 className="font-display text-xl font-bold mb-2">No data yet</h2>
          <p className="text-muted-foreground mb-6">
            Track your carbon footprint first to get personalized suggestions.
          </p>
          <Button
            onClick={() => void navigate({ to: "/track" })}
            className="gap-2"
          >
            <TrendingUp className="h-4 w-4" />
            Track Now
          </Button>
        </motion.div>
      )}

      {/* Alert Banner */}
      {alertCfg && level && (
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          data-ocid={`suggestion.${level.toLowerCase()}_section`}
        >
          <div
            className={`rounded-2xl border-2 ${alertCfg.border} ${alertCfg.bg}/10 p-6 mb-6`}
          >
            <div className="flex items-start gap-3">
              <alertCfg.icon
                className={`h-6 w-6 ${alertCfg.text} flex-shrink-0 mt-0.5`}
              />
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <h2
                    className={`font-display font-bold text-lg ${alertCfg.text}`}
                  >
                    {alertCfg.headline}
                  </h2>
                  <Badge className={alertCfg.badge}>{level}</Badge>
                </div>
                <p className="text-sm text-muted-foreground">{alertCfg.sub}</p>
              </div>
            </div>
          </div>

          {/* Tips List */}
          <div className="space-y-3 mb-8">
            {tips.map((tip, i) => (
              <motion.div
                key={tip.title}
                initial={{ opacity: 0, x: -12 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.15 + i * 0.08 }}
              >
                <Card className="shadow-card hover:shadow-card-hover transition-all duration-200">
                  <CardContent className="p-4 flex gap-3">
                    <div className="flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-lg icon-bg-green">
                      <tip.icon className="h-4 w-4" />
                    </div>
                    <div>
                      <p className="font-semibold text-sm text-foreground mb-0.5">
                        {tip.title}
                      </p>
                      <p className="text-sm text-muted-foreground leading-relaxed">
                        {tip.description}
                      </p>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </motion.div>
      )}

      {/* Progress Improvement Section */}
      {latestEntry && (
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
        >
          <Card className="shadow-card">
            <CardHeader>
              <div className="flex items-center gap-2">
                <TrendingUp className="h-5 w-5 text-primary" />
                <CardTitle className="font-display text-lg">
                  Your Improvement Roadmap
                </CardTitle>
              </div>
              <CardDescription>
                Four steps to meaningful, lasting change
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {PROGRESS_STEPS.map((step, i) => (
                  <motion.div
                    key={step.step}
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.55 + i * 0.07 }}
                    className="flex gap-3 p-3 rounded-xl bg-muted/40"
                  >
                    <div className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full bg-primary text-primary-foreground text-sm font-bold">
                      {step.step}
                    </div>
                    <div>
                      <p className="font-semibold text-sm">{step.title}</p>
                      <p className="text-xs text-muted-foreground mt-0.5">
                        {step.desc}
                      </p>
                    </div>
                  </motion.div>
                ))}
              </div>

              <div className="mt-4 pt-4 border-t border-border flex flex-col sm:flex-row gap-3">
                <Button
                  variant="outline"
                  onClick={() => void navigate({ to: "/track" })}
                  className="flex-1 gap-2"
                >
                  Track Again
                  <ArrowRight className="h-4 w-4" />
                </Button>
                <Button
                  onClick={() => void navigate({ to: "/rewards" })}
                  className="flex-1 gap-2"
                >
                  View Rewards
                  <ArrowRight className="h-4 w-4" />
                </Button>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      )}
    </div>
  );
}

export default function SuggestionPage() {
  return (
    <AuthGuard>
      <SuggestionContent />
    </AuthGuard>
  );
}
