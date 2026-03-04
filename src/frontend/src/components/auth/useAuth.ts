/**
 * useAuth – thin wrapper around useInternetIdentity.
 * Exposes a simplified auth surface consistent with the authorization component contract.
 */
import { useInternetIdentity } from "@/hooks/useInternetIdentity";

export function useAuth() {
  const {
    identity,
    login,
    clear: logout,
    loginStatus,
    isInitializing,
    isLoggingIn,
    isLoginSuccess,
    isLoginError,
  } = useInternetIdentity();

  const isAuthenticated = !!identity;

  return {
    isAuthenticated,
    login,
    logout,
    loginStatus,
    isInitializing,
    isLoggingIn,
    isLoginSuccess,
    isLoginError,
    identity,
    principalId: identity?.getPrincipal().toString() ?? null,
  };
}
