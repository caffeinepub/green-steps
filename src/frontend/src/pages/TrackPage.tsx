import type { EntryResult } from "@/backend.d";
import { AuthGuard } from "@/components/AuthGuard";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { useSubmitEntry } from "@/hooks/useQueries";
import { useNavigate } from "@tanstack/react-router";
import {
  Calculator,
  Car,
  Flame,
  Info,
  Loader2,
  Trash2,
  Zap,
} from "lucide-react";
import { motion } from "motion/react";
import { useState } from "react";
import { toast } from "sonner";

const FIELDS = [
  {
    key: "transportation" as const,
    label: "Transportation",
    unit: "km/week",
    placeholder: "e.g. 150",
    icon: Car,
    color: "icon-bg-blue",
    hint: "Total kilometers driven by car or motorbike per week",
    factor: "~0.21 kg CO₂/km",
  },
  {
    key: "electricity" as const,
    label: "Electricity Usage",
    unit: "kWh/month",
    placeholder: "e.g. 300",
    icon: Zap,
    color: "icon-bg-amber",
    hint: "Monthly electricity consumption in kilowatt-hours",
    factor: "~0.42 kg CO₂/kWh",
  },
  {
    key: "gas" as const,
    label: "Gas Usage",
    unit: "m³/month",
    placeholder: "e.g. 20",
    icon: Flame,
    color: "icon-bg-purple",
    hint: "Monthly natural gas consumption in cubic meters",
    factor: "~2.0 kg CO₂/m³",
  },
  {
    key: "waste" as const,
    label: "Waste Generated",
    unit: "kg/week",
    placeholder: "e.g. 5",
    icon: Trash2,
    color: "icon-bg-green",
    hint: "Total household waste generated per week",
    factor: "~0.5 kg CO₂/kg waste",
  },
];

type FormValues = {
  transportation: string;
  electricity: string;
  gas: string;
  waste: string;
};

type FormErrors = Partial<Record<keyof FormValues, string>>;

function validateForm(values: FormValues): FormErrors {
  const errors: FormErrors = {};
  for (const field of FIELDS) {
    const raw = values[field.key];
    if (!raw || raw.trim() === "") {
      errors[field.key] = "This field is required";
    } else {
      const num = Number.parseFloat(raw);
      if (Number.isNaN(num) || num < 0) {
        errors[field.key] = "Must be a non-negative number";
      }
    }
  }
  return errors;
}

function TrackContent() {
  const navigate = useNavigate();
  const submitEntry = useSubmitEntry();

  const [values, setValues] = useState<FormValues>({
    transportation: "",
    electricity: "",
    gas: "",
    waste: "",
  });
  const [errors, setErrors] = useState<FormErrors>({});
  const [touched, setTouched] = useState<
    Partial<Record<keyof FormValues, boolean>>
  >({});

  const handleChange = (key: keyof FormValues, value: string) => {
    setValues((prev) => ({ ...prev, [key]: value }));
    if (touched[key]) {
      const errs = validateForm({ ...values, [key]: value });
      setErrors((prev) => ({ ...prev, [key]: errs[key] }));
    }
  };

  const handleBlur = (key: keyof FormValues) => {
    setTouched((prev) => ({ ...prev, [key]: true }));
    const errs = validateForm(values);
    setErrors((prev) => ({ ...prev, [key]: errs[key] }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const allTouched = Object.fromEntries(FIELDS.map((f) => [f.key, true]));
    setTouched(allTouched);
    const errs = validateForm(values);
    setErrors(errs);
    if (Object.keys(errs).length > 0) return;

    try {
      const result: EntryResult = await submitEntry.mutateAsync({
        transportation: Number.parseFloat(values.transportation),
        electricity: Number.parseFloat(values.electricity),
        gas: Number.parseFloat(values.gas),
        waste: Number.parseFloat(values.waste),
      });

      // Store result in localStorage for Result page
      localStorage.setItem(
        "greenSteps_lastResult",
        JSON.stringify({
          ...result,
          inputs: {
            transportation: Number.parseFloat(values.transportation),
            electricity: Number.parseFloat(values.electricity),
            gas: Number.parseFloat(values.gas),
            waste: Number.parseFloat(values.waste),
          },
        }),
      );

      toast.success("Carbon footprint calculated!", {
        description: `Total: ${result.totalCO2.toFixed(2)} kg CO₂ — Level: ${result.carbonLevel}`,
      });
      void navigate({ to: "/result" });
    } catch (err) {
      console.error(err);
      toast.error("Failed to submit entry", {
        description: "Please try again.",
      });
    }
  };

  return (
    <TooltipProvider>
      <div className="container mx-auto max-w-3xl px-4 md:px-6 py-10">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <div className="flex items-center gap-2 mb-2">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-primary/10">
              <Calculator className="h-5 w-5 text-primary" />
            </div>
            <h1 className="font-display text-3xl font-bold">Track Carbon</h1>
          </div>
          <p className="text-muted-foreground">
            Enter your usage data to calculate your carbon footprint. All values
            will be saved to your history.
          </p>
        </motion.div>

        <form onSubmit={(e) => void handleSubmit(e)} noValidate>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
            {FIELDS.map((field, i) => (
              <motion.div
                key={field.key}
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.08 }}
              >
                <Card
                  className={`shadow-card transition-all duration-200 ${touched[field.key] && errors[field.key] ? "border-destructive" : "hover:shadow-card-hover"}`}
                >
                  <CardContent className="p-5">
                    <div className="flex items-start gap-3 mb-4">
                      <div
                        className={`flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-xl ${field.color}`}
                      >
                        <field.icon className="h-5 w-5" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-1.5">
                          <Label
                            className="font-semibold text-sm"
                            htmlFor={field.key}
                          >
                            {field.label}
                          </Label>
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <button
                                type="button"
                                className="text-muted-foreground hover:text-foreground transition-colors"
                              >
                                <Info className="h-3.5 w-3.5" />
                              </button>
                            </TooltipTrigger>
                            <TooltipContent
                              side="top"
                              className="max-w-48 text-xs"
                            >
                              {field.hint}
                            </TooltipContent>
                          </Tooltip>
                        </div>
                        <p className="text-xs text-muted-foreground">
                          {field.factor}
                        </p>
                      </div>
                    </div>

                    <div className="relative">
                      <Input
                        id={field.key}
                        type="number"
                        min="0"
                        step="0.01"
                        placeholder={field.placeholder}
                        value={values[field.key]}
                        onChange={(e) =>
                          handleChange(field.key, e.target.value)
                        }
                        onBlur={() => handleBlur(field.key)}
                        data-ocid={`track.${field.key}_input`}
                        className={`pr-16 ${touched[field.key] && errors[field.key] ? "border-destructive focus-visible:ring-destructive" : ""}`}
                      />
                      <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-muted-foreground font-medium pointer-events-none">
                        {field.unit}
                      </span>
                    </div>

                    {touched[field.key] && errors[field.key] && (
                      <p className="text-xs text-destructive mt-1.5">
                        {errors[field.key]}
                      </p>
                    )}
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>

          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.35 }}
          >
            <Card className="shadow-card bg-primary/4 border-primary/20">
              <CardHeader className="pb-2">
                <CardTitle className="font-display text-base">
                  Calculation Method
                </CardTitle>
                <CardDescription className="text-xs">
                  We use standard IPCC emission factors to calculate your CO₂
                  equivalent output.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                  {FIELDS.map((f) => (
                    <div key={f.key} className="text-center">
                      <p className="text-xs font-semibold text-foreground">
                        {f.label}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {f.factor}
                      </p>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="mt-6 flex justify-end"
          >
            <Button
              type="submit"
              size="lg"
              disabled={submitEntry.isPending}
              data-ocid="track.submit_button"
              className="gap-2 px-8 shadow-green-glow hover:-translate-y-0.5 transition-all duration-300"
            >
              {submitEntry.isPending ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <Calculator className="h-4 w-4" />
              )}
              {submitEntry.isPending ? "Calculating..." : "Calculate & Save"}
            </Button>
          </motion.div>
        </form>
      </div>
    </TooltipProvider>
  );
}

export default function TrackPage() {
  return (
    <AuthGuard>
      <TrackContent />
    </AuthGuard>
  );
}
