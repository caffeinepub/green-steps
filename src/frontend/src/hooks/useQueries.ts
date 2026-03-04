import type { EntryInput, UserProfile } from "@/backend.d";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useActor } from "./useActor";

// ─── Query Keys ──────────────────────────────────────────────────────────────
export const QUERY_KEYS = {
  profile: ["profile"] as const,
  history: ["history"] as const,
  latestEntry: ["latestEntry"] as const,
  totalPoints: ["totalPoints"] as const,
  userLevel: ["userLevel"] as const,
};

// ─── Queries ─────────────────────────────────────────────────────────────────

export function useCallerProfile() {
  const { actor, isFetching } = useActor();
  return useQuery({
    queryKey: QUERY_KEYS.profile,
    queryFn: async () => {
      if (!actor) return null;
      return actor.getCallerUserProfile();
    },
    enabled: !!actor && !isFetching,
  });
}

export function useHistory() {
  const { actor, isFetching } = useActor();
  return useQuery({
    queryKey: QUERY_KEYS.history,
    queryFn: async () => {
      if (!actor) return [];
      return actor.getHistory();
    },
    enabled: !!actor && !isFetching,
  });
}

export function useLatestEntry() {
  const { actor, isFetching } = useActor();
  return useQuery({
    queryKey: QUERY_KEYS.latestEntry,
    queryFn: async () => {
      if (!actor) return null;
      return actor.getLatestEntry();
    },
    enabled: !!actor && !isFetching,
  });
}

export function useTotalPoints() {
  const { actor, isFetching } = useActor();
  return useQuery({
    queryKey: QUERY_KEYS.totalPoints,
    queryFn: async () => {
      if (!actor) return BigInt(0);
      return actor.getTotalPoints();
    },
    enabled: !!actor && !isFetching,
  });
}

export function useUserLevel() {
  const { actor, isFetching } = useActor();
  return useQuery({
    queryKey: QUERY_KEYS.userLevel,
    queryFn: async () => {
      if (!actor) return null;
      return actor.getUserLevel();
    },
    enabled: !!actor && !isFetching,
  });
}

// ─── Mutations ───────────────────────────────────────────────────────────────

export function useSubmitEntry() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (input: EntryInput) => {
      if (!actor) throw new Error("Actor not available");
      return actor.submitEntry(input);
    },
    onSuccess: () => {
      // Invalidate all relevant queries after submitting an entry
      void queryClient.invalidateQueries({ queryKey: QUERY_KEYS.history });
      void queryClient.invalidateQueries({ queryKey: QUERY_KEYS.latestEntry });
      void queryClient.invalidateQueries({ queryKey: QUERY_KEYS.totalPoints });
      void queryClient.invalidateQueries({ queryKey: QUERY_KEYS.userLevel });
    },
  });
}

export function useSaveProfile() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (profile: UserProfile) => {
      if (!actor) throw new Error("Actor not available");
      return actor.saveCallerUserProfile(profile);
    },
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: QUERY_KEYS.profile });
    },
  });
}
