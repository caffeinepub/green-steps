import { useAuth } from "@/components/auth/useAuth";
import { Button } from "@/components/ui/button";
import { Loader2, Lock } from "lucide-react";
import type { ReactNode } from "react";

interface AuthGuardProps {
  children: ReactNode;
}

export function AuthGuard({ children }: AuthGuardProps) {
  const { isAuthenticated, isInitializing, login, isLoggingIn } = useAuth();

  if (isInitializing) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <div className="flex flex-col items-center gap-4 text-center">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
          <p className="text-muted-foreground text-sm">Loading...</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center px-4">
        <div className="max-w-sm w-full text-center space-y-6">
          <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-primary/10 mx-auto">
            <Lock
              className="h-8 w-8 text-primary"
              aria-label="Login required"
            />
          </div>
          <div>
            <h2 className="font-display text-2xl font-bold mb-2">
              Login Required
            </h2>
            <p className="text-muted-foreground text-sm">
              You need to log in to access this page. Your data is securely
              stored on the Internet Computer.
            </p>
          </div>
          <Button
            size="lg"
            onClick={login}
            disabled={isLoggingIn}
            data-ocid="nav.login_button"
            className="w-full gap-2"
          >
            {isLoggingIn ? <Loader2 className="h-4 w-4 animate-spin" /> : null}
            {isLoggingIn ? "Connecting..." : "Login to Continue"}
          </Button>
          <p className="text-xs text-muted-foreground">
            Secured by Internet Identity — no password required
          </p>
        </div>
      </div>
    );
  }

  return <>{children}</>;
}
