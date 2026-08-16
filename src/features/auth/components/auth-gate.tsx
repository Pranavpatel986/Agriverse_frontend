"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "../context/auth-context";
import { useHasMinimumRole } from "../hooks/use-role";
import { ROUTES } from "@/config/routes";
import type { Role } from "@/shared/types/api";
import { Skeleton } from "@/shared/components/ui/skeleton";

interface AuthGateProps {
  children: React.ReactNode;
  minimumRole?: Role;
}

/**
 * `proxy.ts` already redirects obviously-logged-out visitors at the edge
 * (see its doc comment for why that check is best-effort). This
 * component is the second, authoritative layer for the loading window
 * proxy.ts can't see into: while AuthProvider is still resolving the
 * silent refresh, we show a skeleton rather than flashing protected
 * content; once resolved, an unauthenticated or under-privileged session
 * is redirected client-side too, so a stale session-hint cookie can
 * never actually expose this content.
 */
export function AuthGate({ children, minimumRole }: AuthGateProps) {
  const { status } = useAuth();
  const hasRole = useHasMinimumRole(minimumRole ?? "READER");
  const router = useRouter();

  useEffect(() => {
    if (status === "unauthenticated") {
      router.replace(ROUTES.login);
    } else if (status === "authenticated" && minimumRole && !hasRole) {
      router.replace(ROUTES.home);
    }
  }, [status, hasRole, minimumRole, router]);

  if (status === "loading" || status === "unauthenticated") {
    return (
      <div className="mx-auto w-full max-w-7xl space-y-4 px-4 py-16">
        <Skeleton className="h-8 w-64" />
        <Skeleton className="h-64 w-full" />
      </div>
    );
  }

  if (minimumRole && !hasRole) {
    return null; // redirect effect above is already in flight
  }

  return <>{children}</>;
}
