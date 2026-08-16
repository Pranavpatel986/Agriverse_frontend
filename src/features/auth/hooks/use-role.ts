import { useAuth } from "../context/auth-context";
import type { Role } from "@/shared/types/api";

/**
 * Role hierarchy matches the Software Architecture Document's Role/
 * Permission Matrix (Section 10): each role includes everything the
 * roles before it can do.
 */
const ROLE_RANK: Record<Role, number> = {
  READER: 0,
  AUTHOR: 1,
  EDITOR: 2,
  ADMIN: 3,
};

/**
 * Client-side convenience for conditionally rendering UI (e.g. hiding
 * the "Admin" nav link from a Reader). This is NOT the authorization
 * boundary — every protected endpoint enforces its own role requirement
 * server-side via @PreAuthorize regardless of what the UI shows.
 */
export function useHasMinimumRole(minimumRole: Role): boolean {
  const { user } = useAuth();
  if (!user) return false;
  return ROLE_RANK[user.role] >= ROLE_RANK[minimumRole];
}

export function useCurrentUser() {
  const { user, status } = useAuth();
  return { user, status, isAuthenticated: status === "authenticated" };
}
