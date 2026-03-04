import { UserLevel } from "@/backend.d";
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
import { Progress } from "@/components/ui/progress";
import { Skeleton } from "@/components/ui/skeleton";
import { useTotalPoints, useUserLevel } from "@/hooks/useQueries";
import { useNavigate } from "@tanstack/react-router";
import {
  Award,
  ChevronRight,
  Crown,
  Leaf,
  Loader2,
  Lock,
  Shield,
  Star,
  TrendingUp,
  Trophy,
  Zap,
} from "lucide-react";
import { motion } from "motion/react";

// Level configuration
const LEVEL_CONFIG = {
  [UserLevel.beginner]: {
    label: "Beginner",
    icon: Leaf,
    color: "text-blue-600",
    bg: "bg-blue-50",
    border: "border-blue-200",
    next: UserLevel.ecoWarrior,
    nextLabel: "Eco Warrior",
    pointsNeeded: 200,
    pointsStart: 0,
    description: "You're starting your eco journey!",
  },
  [UserLevel.ecoWarrior]: {
    label: "Eco Warrior",
    icon: Shield,
    color: "text-primary",
    bg: "bg-primary/10",
    border: "border-primary/30",
    next: UserLevel.greenChampion,
    nextLabel: "Green Champion",
    pointsNeeded: 500,
    pointsStart: 200,
    description: "You're making a real difference!",
  },
  [UserLevel.greenChampion]: {
    label: "Green Champion",
    icon: Crown,
    color: "text-amber-600",
    bg: "bg-amber-50",
    border: "border-amber-200",
    next: null,
    nextLabel: null,
    pointsNeeded: null,
    pointsStart: 500,
    description:
      "You've reached the highest level — you're an environmental hero!",
  },
};

interface BadgeItem {
  id: string;
  title: string;
  description: string;
  icon: React.ElementType;
  color: string;
  threshold: number;
  unlocked: boolean;
}

function getAchievementBadges(points: number): BadgeItem[] {
  return [
    {
      id: "first_tracker",
      title: "First Tracker",
      description: "Logged your first carbon footprint entry",
      icon: Zap,
      color: "icon-bg-blue",
      threshold: 1,
      unlocked: points >= 1,
    },
    {
      id: "low_emitter",
      title: "Low Emitter",
      description: "Achieved low emission level in a tracking",
      icon: Leaf,
      color: "icon-bg-green",
      threshold: 50,
      unlocked: points >= 50,
    },
    {
      id: "consistent_tracker",
      title: "Consistent Tracker",
      description: "Reached 100 eco points through regular tracking",
      icon: TrendingUp,
      color: "icon-bg-amber",
      threshold: 100,
      unlocked: points >= 100,
    },
    {
      id: "eco_warrior_badge",
      title: "Eco Warrior",
      description: "Earned 200 points — you're making a real impact",
      icon: Shield,
      color: "icon-bg-purple",
      threshold: 200,
      unlocked: points >= 200,
    },
    {
      id: "green_champion_badge",
      title: "Green Champion",
      description: "Reached 500 points — the highest eco achievement",
      icon: Crown,
      color: "icon-bg-amber",
      threshold: 500,
      unlocked: points >= 500,
    },
    {
      id: "half_way",
      title: "Halfway There",
      description: "Earned 250 eco points on your green journey",
      icon: Star,
      color: "icon-bg-green",
      threshold: 250,
      unlocked: points >= 250,
    },
  ];
}

function getLevelProgress(level: UserLevel, points: number) {
  const cfg = LEVEL_CONFIG[level];
  if (!cfg.next) return 100;
  const range = cfg.pointsNeeded! - cfg.pointsStart;
  const earned = Math.max(0, Math.min(points - cfg.pointsStart, range));
  return Math.round((earned / range) * 100);
}

function RewardContent() {
  const navigate = useNavigate();
  const { data: totalPoints, isLoading: pointsLoading } = useTotalPoints();
  const { data: userLevel, isLoading: levelLoading } = useUserLevel();

  const isLoading = pointsLoading || levelLoading;
  const points = Number(totalPoints ?? BigInt(0));
  const level = userLevel ?? UserLevel.beginner;
  const levelCfg = LEVEL_CONFIG[level];
  const LevelIcon = levelCfg.icon;
  const progress = getLevelProgress(level, points);
  const badges = getAchievementBadges(points);

  return (
    <div className="container mx-auto max-w-3xl px-4 md:px-6 py-10">
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-8"
      >
        <div className="flex items-center gap-2 mb-2">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-amber-100">
            <Trophy className="h-5 w-5 text-amber-600" />
          </div>
          <h1 className="font-display text-3xl font-bold">Eco Rewards</h1>
        </div>
        <p className="text-muted-foreground">
          Your achievements and progress on the path to Green Champion.
        </p>
      </motion.div>

      {/* Points + Level Card */}
      <motion.div
        initial={{ opacity: 0, scale: 0.97 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.1 }}
        data-ocid="reward.level_card"
      >
        <Card className={`shadow-card border-2 ${levelCfg.border} mb-6`}>
          <CardContent className="p-8">
            {isLoading ? (
              <div className="flex flex-col items-center gap-4">
                <Skeleton className="h-16 w-16 rounded-2xl" />
                <Skeleton className="h-10 w-32" />
                <Skeleton className="h-4 w-64" />
              </div>
            ) : (
              <div className="text-center">
                <div
                  className={`flex h-16 w-16 items-center justify-center rounded-2xl ${levelCfg.bg} mx-auto mb-4 animate-pulse-ring`}
                >
                  <LevelIcon className={`h-8 w-8 ${levelCfg.color}`} />
                </div>

                <Badge className="mb-3 px-4 py-1.5 text-sm font-semibold">
                  {levelCfg.label}
                </Badge>

                <p className="font-display text-5xl font-extrabold text-foreground mb-1">
                  {points.toLocaleString()}
                </p>
                <p className="text-muted-foreground text-sm mb-3">
                  Total Eco Points
                </p>
                <p className="text-sm text-foreground font-medium">
                  {levelCfg.description}
                </p>
              </div>
            )}
          </CardContent>
        </Card>
      </motion.div>

      {/* Progress Bar */}
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.15 }}
      >
        <Card className="shadow-card mb-6">
          <CardHeader>
            <div className="flex items-center gap-2">
              <TrendingUp className="h-5 w-5 text-primary" />
              <CardTitle className="font-display text-lg">
                Level Progress
              </CardTitle>
            </div>
            <CardDescription>
              {levelCfg.next
                ? `Progress toward ${levelCfg.nextLabel}`
                : "You've reached the maximum level — Green Champion!"}
            </CardDescription>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <Skeleton className="h-4 w-full rounded-full" />
            ) : (
              <div>
                <div className="flex justify-between text-xs text-muted-foreground mb-2">
                  <span>
                    {levelCfg.label} ({levelCfg.pointsStart} pts)
                  </span>
                  {levelCfg.next && (
                    <span>
                      {levelCfg.nextLabel} ({levelCfg.pointsNeeded} pts)
                    </span>
                  )}
                </div>
                <Progress
                  value={progress}
                  data-ocid="reward.progress_bar"
                  className="h-3 rounded-full"
                />
                <p className="text-sm text-center mt-2 text-muted-foreground">
                  {levelCfg.next
                    ? `${progress}% — ${Math.max(0, (levelCfg.pointsNeeded ?? 0) - points)} more points to ${levelCfg.nextLabel}`
                    : "🎉 Maximum level achieved!"}
                </p>
              </div>
            )}
          </CardContent>
        </Card>
      </motion.div>

      {/* Level Breakdown */}
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="mb-6"
      >
        <h2 className="font-display font-bold text-xl mb-4">Level Tiers</h2>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          {[
            { level: UserLevel.beginner, range: "0–199 pts" },
            { level: UserLevel.ecoWarrior, range: "200–499 pts" },
            { level: UserLevel.greenChampion, range: "500+ pts" },
          ].map(({ level: lvl, range }, i) => {
            const cfg = LEVEL_CONFIG[lvl];
            const Icon = cfg.icon;
            const isCurrent = lvl === level;
            return (
              <motion.div
                key={lvl}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.22 + i * 0.07 }}
              >
                <Card
                  className={`shadow-card transition-all duration-200 ${isCurrent ? `border-2 ${cfg.border} ${cfg.bg}` : "opacity-70"}`}
                >
                  <CardContent className="p-4 text-center">
                    <div
                      className={`flex h-10 w-10 items-center justify-center rounded-xl ${cfg.bg} mx-auto mb-2`}
                    >
                      <Icon className={`h-5 w-5 ${cfg.color}`} />
                    </div>
                    <p className="font-semibold text-sm">{cfg.label}</p>
                    <p className="text-xs text-muted-foreground">{range}</p>
                    {isCurrent && (
                      <Badge className="mt-2 text-xs" variant="secondary">
                        Current
                      </Badge>
                    )}
                  </CardContent>
                </Card>
              </motion.div>
            );
          })}
        </div>
      </motion.div>

      {/* Achievement Badges */}
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
      >
        <Card className="shadow-card mb-6">
          <CardHeader>
            <div className="flex items-center gap-2">
              <Award className="h-5 w-5 text-amber-600" />
              <CardTitle className="font-display text-lg">
                Achievement Badges
              </CardTitle>
            </div>
            <CardDescription>
              {badges.filter((b) => b.unlocked).length} / {badges.length}{" "}
              unlocked
            </CardDescription>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                {[1, 2, 3, 4, 5, 6].map((i) => (
                  <Skeleton key={i} className="h-24 rounded-xl" />
                ))}
              </div>
            ) : (
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                {badges.map((badge, i) => (
                  <motion.div
                    key={badge.id}
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.35 + i * 0.05 }}
                  >
                    <div
                      className={`p-4 rounded-xl border text-center transition-all duration-200 ${
                        badge.unlocked
                          ? "border-border bg-card shadow-card hover:shadow-card-hover hover:-translate-y-0.5"
                          : "border-dashed border-border bg-muted/40 opacity-60"
                      }`}
                    >
                      <div
                        className={`flex h-10 w-10 items-center justify-center rounded-xl mx-auto mb-2 ${badge.unlocked ? badge.color : "bg-muted"}`}
                      >
                        {badge.unlocked ? (
                          <badge.icon className="h-5 w-5" />
                        ) : (
                          <Lock className="h-4 w-4 text-muted-foreground" />
                        )}
                      </div>
                      <p className="font-semibold text-xs text-foreground">
                        {badge.title}
                      </p>
                      <p className="text-xs text-muted-foreground mt-0.5 leading-tight">
                        {badge.description}
                      </p>
                      {!badge.unlocked && (
                        <p className="text-xs text-primary mt-1">
                          {badge.threshold} pts needed
                        </p>
                      )}
                    </div>
                  </motion.div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </motion.div>

      {/* CTA */}
      <motion.div
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.45 }}
        className="flex flex-col sm:flex-row gap-3"
      >
        <Button
          variant="outline"
          onClick={() => void navigate({ to: "/track" })}
          className="flex-1 gap-2"
        >
          Track More Carbon
          <ChevronRight className="h-4 w-4" />
        </Button>
        <Button
          onClick={() => void navigate({ to: "/suggestions" })}
          className="flex-1 gap-2"
        >
          View Suggestions
          <ChevronRight className="h-4 w-4" />
        </Button>
      </motion.div>
    </div>
  );
}

export default function RewardPage() {
  return (
    <AuthGuard>
      <RewardContent />
    </AuthGuard>
  );
}
