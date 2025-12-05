import { useCallback } from "react";
import { useAuth } from "@/context/AuthContext";

/**
 * Returns a click handler that ensures the user is authenticated
 * before executing the provided onSuccess action.
 */
export function useRequireAuth(onSuccess: () => void | Promise<void>) {
  const { requireAuth } = useAuth();

  return useCallback(() => {
    requireAuth(onSuccess);
  }, [requireAuth, onSuccess]);
}
