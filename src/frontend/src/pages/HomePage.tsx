import { useAuth } from "@/components/auth/useAuth";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { useNavigate } from "@tanstack/react-router";
import {
  ArrowRight,
  BarChart3,
  CheckCircle2,
  Globe,
  Leaf,
  Lightbulb,
  TrendingDown,
  Trophy,
  Users,
} from "lucide-react";
import { motion } from "motion/react";

const FEATURES = [
  {
    icon: BarChart3,
    title: "Track & Measure",
    description:
      "Log your transportation, electricity, gas, and waste usage to calculate your precise carbon footprint.",
    color: "icon-bg-green",
  },
  {
    icon: Lightbulb,
    title: "Smart Suggestions",
    description:
      "Get personalized eco-friendly tips tailored to your specific emission levels and lifestyle habits.",
    color: "icon-bg-blue",
  },
  {
    icon: TrendingDown,
    title: "Track Progress",
    description:
      "Visualize your reduction over time with beautiful charts and see how your choices make an impact.",
    color: "icon-bg-amber",
  },
  {
    icon: Trophy,
    title: "Earn Rewards",
    description:
      "Collect eco points, level up from Beginner to Green Champion, and unlock achievement badges.",
    color: "icon-bg-purple",
  },
];

const STATS = [
  { value: "8.1t", label: "Average CO₂/person/year globally", icon: Globe },
  { value: "40%", label: "Of emissions from household activities", icon: Leaf },
  {
    value: "2°C",
    label: "Target temperature rise to prevent",
    icon: TrendingDown,
  },
  { value: "1B+", label: "People actively reducing footprint", icon: Users },
];

const WHY_MATTERS = [
  "Climate change threatens food security for billions",
  "Every 1kg CO₂ reduction makes a measurable difference",
  "Individual action drives systemic change",
  "Your choices inspire others in your community",
];

const fadeInUp = {
  hidden: { opacity: 0, y: 24 },
  visible: { opacity: 1, y: 0 },
};

const stagger = {
  visible: { transition: { staggerChildren: 0.1 } },
};

export default function HomePage() {
  const navigate = useNavigate();
  const { isAuthenticated, login } = useAuth();

  const handleStartTracking = () => {
    if (isAuthenticated) {
      void navigate({ to: "/track" });
    } else {
      login();
    }
  };

  return (
    <main>
      {/* ── Hero ── */}
      <section className="relative hero-gradient overflow-hidden py-20 md:py-28">
        {/* Decorative floating shapes */}
        <div className="absolute top-16 right-10 w-48 h-48 rounded-full bg-primary/5 animate-float pointer-events-none hidden lg:block" />
        <div className="absolute bottom-8 left-16 w-32 h-32 rounded-full bg-primary/8 animate-float [animation-delay:1.5s] pointer-events-none hidden md:block" />

        <div className="container mx-auto max-w-7xl px-4 md:px-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <motion.div initial="hidden" animate="visible" variants={stagger}>
              <motion.div
                variants={fadeInUp}
                className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-primary/10 text-primary text-sm font-medium mb-6 border border-primary/20"
              >
                <Leaf className="h-3.5 w-3.5" />
                Environmental Impact Tracker
              </motion.div>

              <motion.h1
                variants={fadeInUp}
                className="font-display text-5xl md:text-6xl font-extrabold tracking-tight leading-[1.05] mb-6 text-foreground"
              >
                Track Your <span className="text-primary">Carbon</span>{" "}
                Footprint
              </motion.h1>

              <motion.p
                variants={fadeInUp}
                className="text-lg md:text-xl text-muted-foreground mb-8 max-w-xl leading-relaxed"
              >
                Understand your environmental impact, get actionable
                suggestions, and earn rewards as you work toward a sustainable
                lifestyle.
              </motion.p>

              <motion.div
                variants={fadeInUp}
                className="flex flex-col sm:flex-row gap-4"
              >
                <Button
                  size="lg"
                  onClick={handleStartTracking}
                  data-ocid="home.cta_button"
                  className="gap-2 px-8 shadow-green-glow hover:shadow-card-hover transition-all duration-300 hover:-translate-y-0.5 text-base"
                >
                  Start Tracking
                  <ArrowRight className="h-4 w-4" />
                </Button>
                <Button
                  variant="outline"
                  size="lg"
                  onClick={() => {
                    document
                      .getElementById("features")
                      ?.scrollIntoView({ behavior: "smooth" });
                  }}
                  className="text-base hover:-translate-y-0.5 transition-transform"
                >
                  Learn More
                </Button>
              </motion.div>
            </motion.div>

            {/* Hero Image */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95, x: 20 }}
              animate={{ opacity: 1, scale: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.3, ease: "easeOut" }}
              className="hidden lg:flex items-center justify-center"
            >
              <div className="relative">
                <div className="absolute inset-0 rounded-3xl bg-primary/5 blur-3xl scale-110 pointer-events-none" />
                <img
                  src="/assets/generated/hero-earth.dim_800x600.png"
                  alt="Carbon footprint visualization"
                  className="relative rounded-3xl shadow-card-hover w-full max-w-lg object-cover animate-float"
                />
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* ── Stats ── */}
      <section className="py-16 border-y border-border bg-muted/30">
        <div className="container mx-auto max-w-7xl px-4 md:px-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {STATS.map((stat, i) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.08, duration: 0.4 }}
                className="flex flex-col items-center text-center gap-2"
              >
                <div className="flex h-10 w-10 items-center justify-center rounded-xl icon-bg-green">
                  <stat.icon className="h-5 w-5" />
                </div>
                <span className="font-display text-3xl font-extrabold text-foreground">
                  {stat.value}
                </span>
                <span className="text-xs text-muted-foreground leading-tight max-w-24">
                  {stat.label}
                </span>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Features ── */}
      <section id="features" className="py-20 md:py-28">
        <div className="container mx-auto max-w-7xl px-4 md:px-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-14"
          >
            <p className="text-primary font-semibold text-sm uppercase tracking-wider mb-3">
              Platform Features
            </p>
            <h2 className="font-display text-4xl md:text-5xl font-bold tracking-tight">
              Everything you need to go green
            </h2>
            <p className="mt-4 text-muted-foreground text-lg max-w-2xl mx-auto">
              A comprehensive toolkit for understanding and reducing your
              environmental impact.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {FEATURES.map((feature, i) => (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
              >
                <Card className="h-full shadow-card hover:shadow-card-hover transition-all duration-300 hover:-translate-y-1 border-border group">
                  <CardContent className="p-6 flex gap-4">
                    <div
                      className={`flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-xl ${feature.color} transition-transform group-hover:scale-110`}
                    >
                      <feature.icon className="h-6 w-6" />
                    </div>
                    <div>
                      <h3 className="font-display font-bold text-lg mb-2">
                        {feature.title}
                      </h3>
                      <p className="text-muted-foreground text-sm leading-relaxed">
                        {feature.description}
                      </p>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Why It Matters ── */}
      <section className="py-20 bg-muted/20 border-y border-border">
        <div className="container mx-auto max-w-7xl px-4 md:px-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
            >
              <p className="text-primary font-semibold text-sm uppercase tracking-wider mb-3">
                Why It Matters
              </p>
              <h2 className="font-display text-4xl font-bold tracking-tight mb-6">
                Small actions, <br />
                <span className="text-primary">massive impact</span>
              </h2>
              <p className="text-muted-foreground leading-relaxed mb-8">
                The climate crisis is the defining challenge of our time. But
                individual action matters more than you think. When you
                understand your footprint, you can make informed decisions that
                collectively drive real change.
              </p>
              <ul className="space-y-3">
                {WHY_MATTERS.map((item) => (
                  <li key={item} className="flex items-start gap-3 text-sm">
                    <CheckCircle2 className="h-5 w-5 text-primary flex-shrink-0 mt-0.5" />
                    <span className="text-foreground">{item}</span>
                  </li>
                ))}
              </ul>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="relative"
            >
              <div className="rounded-2xl bg-card border border-border p-8 shadow-card">
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="font-display font-semibold text-sm">
                      Your Monthly Footprint
                    </span>
                    <span className="text-xs text-muted-foreground">
                      Example
                    </span>
                  </div>
                  {[
                    {
                      label: "Transportation",
                      value: 45,
                      max: 100,
                      color: "bg-blue-400",
                    },
                    {
                      label: "Electricity",
                      value: 30,
                      max: 100,
                      color: "bg-primary",
                    },
                    {
                      label: "Gas",
                      value: 15,
                      max: 100,
                      color: "bg-amber-400",
                    },
                    {
                      label: "Waste",
                      value: 10,
                      max: 100,
                      color: "bg-purple-400",
                    },
                  ].map((item) => (
                    <div key={item.label} className="space-y-1.5">
                      <div className="flex justify-between text-xs text-muted-foreground">
                        <span>{item.label}</span>
                        <span>{item.value}%</span>
                      </div>
                      <div className="h-2 rounded-full bg-muted overflow-hidden">
                        <motion.div
                          initial={{ width: 0 }}
                          whileInView={{ width: `${item.value}%` }}
                          viewport={{ once: true }}
                          transition={{
                            duration: 0.8,
                            delay: 0.2,
                            ease: "easeOut",
                          }}
                          className={`h-full rounded-full ${item.color}`}
                        />
                      </div>
                    </div>
                  ))}
                  <p className="text-xs text-muted-foreground pt-2 border-t border-border">
                    Average emission:{" "}
                    <strong className="text-foreground">
                      8.1 tonnes CO₂/year
                    </strong>
                  </p>
                </div>
              </div>

              {/* Floating badge */}
              <div className="absolute -top-4 -right-4 flex items-center gap-1.5 rounded-xl bg-primary px-3 py-2 text-primary-foreground text-xs font-semibold shadow-lg">
                <Trophy className="h-3.5 w-3.5" />
                Earn Eco Points
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* ── CTA Banner ── */}
      <section className="py-20">
        <div className="container mx-auto max-w-7xl px-4 md:px-6">
          <motion.div
            initial={{ opacity: 0, scale: 0.97 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="rounded-2xl bg-primary/8 border border-primary/20 p-10 md:p-16 text-center"
          >
            <Leaf className="h-12 w-12 text-primary mx-auto mb-4" />
            <h2 className="font-display text-4xl md:text-5xl font-bold tracking-tight mb-4">
              Ready to make a difference?
            </h2>
            <p className="text-muted-foreground text-lg mb-8 max-w-xl mx-auto">
              Join thousands of eco-conscious people tracking their footprint
              and working toward a more sustainable planet.
            </p>
            <Button
              size="lg"
              onClick={handleStartTracking}
              data-ocid="home.cta_button"
              className="gap-2 px-10 text-base shadow-green-glow hover:-translate-y-0.5 transition-all duration-300"
            >
              Start Tracking Today
              <ArrowRight className="h-4 w-4" />
            </Button>
          </motion.div>
        </div>
      </section>
    </main>
  );
}
