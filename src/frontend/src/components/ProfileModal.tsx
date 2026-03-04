import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useSaveProfile } from "@/hooks/useQueries";
import { Leaf, Loader2 } from "lucide-react";
import { useState } from "react";

interface ProfileModalProps {
  open: boolean;
  onComplete: () => void;
}

export function ProfileModal({ open, onComplete }: ProfileModalProps) {
  const [name, setName] = useState("");
  const [error, setError] = useState("");
  const saveProfile = useSaveProfile();

  const handleSave = async () => {
    const trimmed = name.trim();
    if (!trimmed) {
      setError("Please enter your name");
      return;
    }
    if (trimmed.length < 2) {
      setError("Name must be at least 2 characters");
      return;
    }
    setError("");
    try {
      await saveProfile.mutateAsync({ name: trimmed });
      onComplete();
    } catch {
      setError("Failed to save profile. Please try again.");
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") void handleSave();
  };

  return (
    <Dialog open={open}>
      <DialogContent
        className="sm:max-w-md"
        data-ocid="profile.modal"
        onInteractOutside={(e) => e.preventDefault()}
      >
        <DialogHeader className="text-center items-center">
          <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10 mb-2">
            <Leaf className="h-6 w-6 text-primary" />
          </div>
          <DialogTitle className="font-display text-xl">
            Welcome to Green Steps!
          </DialogTitle>
          <DialogDescription>
            Let's set up your profile to personalize your eco journey.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-2">
          <div className="space-y-2">
            <Label htmlFor="profile-name">Your Name</Label>
            <Input
              id="profile-name"
              placeholder="e.g. Alex Green"
              value={name}
              onChange={(e) => {
                setName(e.target.value);
                setError("");
              }}
              onKeyDown={handleKeyDown}
              autoFocus
              data-ocid="profile.name_input"
              className={error ? "border-destructive" : ""}
            />
            {error && <p className="text-sm text-destructive">{error}</p>}
          </div>
        </div>

        <DialogFooter>
          <Button
            onClick={() => void handleSave()}
            disabled={saveProfile.isPending}
            data-ocid="profile.save_button"
            className="w-full gap-2"
          >
            {saveProfile.isPending ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <Leaf className="h-4 w-4" />
            )}
            {saveProfile.isPending ? "Saving..." : "Get Started"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
