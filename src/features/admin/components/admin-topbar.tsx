"use client";

import { useCurrentUser } from "@/features/auth/hooks/use-role";

export function AdminTopbar() {
  const { user } = useCurrentUser();
  return (
    <header className="border-border flex items-center justify-between border-b pb-4">
      <h1 className="font-display text-2xl font-semibold">Admin</h1>
      {user && (
        <p className="text-muted-foreground text-sm">
          Signed in as {user.fullName} ·{" "}
          <span className="capitalize">{user.role.toLowerCase()}</span>
        </p>
      )}
    </header>
  );
}
