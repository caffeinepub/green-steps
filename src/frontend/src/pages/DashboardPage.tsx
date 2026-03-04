import { AuthGuard } from "@/components/AuthGuard";
import { ProfileModal } from "@/components/ProfileModal";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import {
  useCallerProfile,
  useHistory,
  useLatestEntry,
} from "@/hooks/useQueries";
import { useSaveProfile } from "@/hooks/useQueries";
import { useNavigate } from "@tanstack/react-router";
import {
  Activity,
  BarChart3,
  Leaf,
  Lightbulb,
  Loader2,
  Plus,
  Star,
  TrendingDown,
  Trophy,
} from "lucide-react";
import { motion } from "motion/react";
import { useEffect, useState } from "react";
import {
  Bar,
  BarChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

function getLevelBadge(level: string) {
  if (level === "Low")
    return { className: "bg-level-low text-white", label: "Low" };
  if (level === "High")
    return { className: "bg-level-high text-white", label: "High" };
  return { className: "bg-level-medium text-white", label: "Medium" };
}

function DashboardContent() {
  const navigate = useNavigate();
  const profileQuery = useCallerProfile();
  const historyQuery = useHistory();
  const latestEntryQuery = useLatestEntry();
  const saveProfile = useSaveProfile();

  const [showProfileModal, setShowProfileModal] = useState(false);
  const [editingName, setEditingName] = useState(false);
  const [nameValue, setNameValue] = useState("");
  const [nameError, setNameError] = useState("");

  const profile = profileQuery.data;
  const history = historyQuery.data ?? [];
  const latestEntry = latestEntryQuery.data;

  // Show profile modal if no profile exists
  useEffect(() => {
    if (!profileQuery.isLoading && profile === null) {
      setShowProfileModal(true);
    }
  }, [profile, profileQuery.isLoading]);

  // Compute summary stats
  const totalCO2 = latestEntry?.totalCO2 ?? 0;
  const weeklyAvg =
    history.length > 0
      ? history.slice(0, 7).reduce((sum, e) => sum + e.totalCO2, 0) /
        Math.min(history.length, 7)
      : 0;

  // Chart data — last 7 entries
  const chartData = history
    .slice(0, 7)
    .reverse()
    .map((entry, i) => ({
      name: `Entry ${i + 1}`,
      co2: Math.round(entry.totalCO2 * 100) / 100,
    }));

  const handleNameSave = async () => {
    const trimmed = nameValue.trim();
    if (!trimmed || trimmed.length < 2) {
      setNameError("Name must be at least 2 characters");
      return;
    }
    try {
      await saveProfile.mutateAsync({ name: trimmed });
      setEditingName(false);
      setNameError("");
    } catch {
      setNameError("Failed to save");
    }
  };

  const isLoading =
    profileQuery.isLoading ||
    historyQuery.isLoading ||
    latestEntryQuery.isLoading;

  return (
    <div className="container mx-auto max-w-7xl px-4 md:px-6 py-10">
      <ProfileModal
        open={showProfileModal}
        onComplete={() => setShowProfileModal(false)}
      />

      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-8"
      >
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
          <div>
            {isLoading ? (
              <Skeleton className="h-8 w-56 mb-2" />
            ) : (
              <div className="flex items-center gap-2">
                {editingName ? (
                  <div className="flex items-center gap-2">
                    <Input
                      value={nameValue}
                      onChange={(e) => setNameValue(e.target.value)}
                      className="h-8 text-lg font-bold w-40"
                      autoFocus
                      data-ocid="dashboard.name_input"
                      onKeyDown={(e) =>
                        e.key === "Enter" && void handleNameSave()
                      }
                    />
                    <Button
                      size="sm"
                      onClick={() => void handleNameSave()}
                      disabled={saveProfile.isPending}
                      data-ocid="dashboard.name_save_button"
                    >
                      {saveProfile.isPending ? (
                        <Loader2 className="h-3.5 w-3.5 animate-spin" />
                      ) : (
                        "Save"
                      )}
                    </Button>
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => {
                        setEditingName(false);
                        setNameError("");
                      }}
                    >
                      Cancel
                    </Button>
                  </div>
                ) : (
                  <h1 className="font-display text-3xl font-bold">
                    Welcome back,{" "}
                    <button
                      type="button"
                      className="text-primary cursor-pointer hover:underline bg-transparent border-0 p-0 font-display text-3xl font-bold"
                      onClick={() => {
                        setNameValue(profile?.name ?? "");
                        setEditingName(true);
                      }}
                      title="Click to edit name"
                    >
                      {profile?.name ?? "Eco Hero"}
                    </button>
                    !
                  </h1>
                )}
              </div>
            )}
            {nameError && (
              <p className="text-sm text-destructive mt-1">{nameError}</p>
            )}
            <p className="text-muted-foreground mt-1">
              Here's your environmental impact overview.
            </p>
          </div>
          <Button
            onClick={() => void navigate({ to: "/track" })}
            data-ocid="dashboard.track_button"
            className="gap-2 shrink-0"
          >
            <Plus className="h-4 w-4" />
            Track Now
          </Button>
        </div>
      </motion.div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
        {/* Total CO2 */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          data-ocid="dashboard.total_card"
        >
          <Card className="shadow-card hover:shadow-card-hover transition-all duration-300">
            <CardContent className="p-6">
              <div className="flex items-start justify-between mb-4">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl icon-bg-green">
                  <Leaf className="h-5 w-5" />
                </div>
                {latestEntry && (
                  <Badge
                    className={
                      getLevelBadge(
                        latestEntry.totalCO2 < 5
                          ? "Low"
                          : latestEntry.totalCO2 < 15
                            ? "Medium"
                            : "High",
                      ).className
                    }
                  >
                    {latestEntry.totalCO2 < 5
                      ? "Low"
                      : latestEntry.totalCO2 < 15
                        ? "Medium"
                        : "High"}
                  </Badge>
                )}
              </div>
              {isLoading ? (
                <Skeleton className="h-8 w-28 mb-1" />
              ) : (
                <p className="font-display text-3xl font-bold text-foreground">
                  {totalCO2.toFixed(2)}
                  <span className="text-base font-normal text-muted-foreground ml-1">
                    kg CO₂
                  </span>
                </p>
              )}
              <p className="text-sm text-muted-foreground mt-1">
                Total Carbon Footprint
              </p>
            </CardContent>
          </Card>
        </motion.div>

        {/* Weekly Average */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15 }}
          data-ocid="dashboard.weekly_card"
        >
          <Card className="shadow-card hover:shadow-card-hover transition-all duration-300">
            <CardContent className="p-6">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl icon-bg-blue mb-4">
                <Activity className="h-5 w-5" />
              </div>
              {isLoading ? (
                <Skeleton className="h-8 w-28 mb-1" />
              ) : (
                <p className="font-display text-3xl font-bold text-foreground">
                  {weeklyAvg.toFixed(2)}
                  <span className="text-base font-normal text-muted-foreground ml-1">
                    kg CO₂
                  </span>
                </p>
              )}
              <p className="text-sm text-muted-foreground mt-1">
                Weekly Average
              </p>
            </CardContent>
          </Card>
        </motion.div>

        {/* Eco Score */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          data-ocid="dashboard.eco_score_card"
        >
          <Card className="shadow-card hover:shadow-card-hover transition-all duration-300">
            <CardContent className="p-6">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl icon-bg-amber mb-4">
                <Star className="h-5 w-5" />
              </div>
              {isLoading ? (
                <Skeleton className="h-8 w-20 mb-1" />
              ) : (
                <p className="font-display text-3xl font-bold text-foreground">
                  {latestEntry
                    ? Number(
                        latestEntry.totalCO2 < 5
                          ? 85
                          : latestEntry.totalCO2 < 15
                            ? 60
                            : 35,
                      )
                    : 0}
                  <span className="text-base font-normal text-muted-foreground ml-1">
                    / 100
                  </span>
                </p>
              )}
              <p className="text-sm text-muted-foreground mt-1">Eco Score</p>
            </CardContent>
          </Card>
        </motion.div>
      </div>

      {/* Chart + Quick Nav */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Bar Chart */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.25 }}
          className="lg:col-span-2"
        >
          <Card className="shadow-card h-full">
            <CardHeader>
              <div className="flex items-center gap-2">
                <BarChart3 className="h-5 w-5 text-primary" />
                <CardTitle className="font-display text-lg">
                  CO₂ History
                </CardTitle>
              </div>
              <CardDescription>Your last 7 tracked entries</CardDescription>
            </CardHeader>
            <CardContent>
              {isLoading ? (
                <Skeleton className="h-56 w-full rounded-lg" />
              ) : chartData.length === 0 ? (
                <div
                  className="h-56 flex flex-col items-center justify-center text-center gap-3"
                  data-ocid="dashboard.empty_state"
                >
                  <TrendingDown className="h-10 w-10 text-muted-foreground/40" />
                  <div>
                    <p className="font-semibold text-foreground">No data yet</p>
                    <p className="text-sm text-muted-foreground">
                      Track your first entry to see your history
                    </p>
                  </div>
                </div>
              ) : (
                <ResponsiveContainer width="100%" height={224}>
                  <BarChart
                    data={chartData}
                    margin={{ top: 4, right: 4, left: -20, bottom: 0 }}
                  >
                    <CartesianGrid
                      strokeDasharray="3 3"
                      stroke="oklch(0.9 0.01 150)"
                    />
                    <XAxis
                      dataKey="name"
                      tick={{ fontSize: 11 }}
                      stroke="oklch(0.7 0.01 165)"
                    />
                    <YAxis
                      tick={{ fontSize: 11 }}
                      stroke="oklch(0.7 0.01 165)"
                    />
                    <Tooltip
                      contentStyle={{
                        background: "oklch(0.998 0 0)",
                        border: "1px solid oklch(0.9 0.01 150)",
                        borderRadius: "0.75rem",
                        fontSize: "12px",
                      }}
                      formatter={(value: number) => [
                        `${value} kg CO₂`,
                        "Emission",
                      ]}
                    />
                    <Bar
                      dataKey="co2"
                      fill="oklch(0.52 0.13 155)"
                      radius={[4, 4, 0, 0]}
                    />
                  </BarChart>
                </ResponsiveContainer>
              )}
            </CardContent>
          </Card>
        </motion.div>

        {/* Quick Navigation */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <Card className="shadow-card h-full">
            <CardHeader>
              <CardTitle className="font-display text-lg">
                Quick Actions
              </CardTitle>
              <CardDescription>Jump to a section</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              {[
                {
                  label: "Track Carbon",
                  desc: "Log a new entry",
                  icon: BarChart3,
                  path: "/track",
                  color: "icon-bg-green",
                  ocid: "dashboard.track_button",
                },
                {
                  label: "View Suggestions",
                  desc: "Eco-friendly tips",
                  icon: Lightbulb,
                  path: "/suggestions",
                  color: "icon-bg-blue",
                  ocid: "dashboard.suggestions_button",
                },
                {
                  label: "Rewards",
                  desc: "Your eco points & badges",
                  icon: Trophy,
                  path: "/rewards",
                  color: "icon-bg-amber",
                  ocid: "dashboard.rewards_button",
                },
              ].map((item) => (
                <button
                  type="button"
                  key={item.label}
                  onClick={() => void navigate({ to: item.path })}
                  data-ocid={item.ocid}
                  className="w-full flex items-center gap-3 p-3 rounded-xl border border-border hover:bg-accent/50 hover:border-primary/30 transition-all duration-200 text-left group"
                >
                  <div
                    className={`flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-lg ${item.color} group-hover:scale-105 transition-transform`}
                  >
                    <item.icon className="h-4 w-4" />
                  </div>
                  <div>
                    <p className="font-semibold text-sm text-foreground">
                      {item.label}
                    </p>
                    <p className="text-xs text-muted-foreground">{item.desc}</p>
                  </div>
                </button>
              ))}
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  );
}

export default function DashboardPage() {
  return (
    <AuthGuard>
      <DashboardContent />
    </AuthGuard>
  );
}
