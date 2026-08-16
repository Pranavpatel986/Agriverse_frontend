"use client";

import { useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/shared/components/ui/table";
import { Badge } from "@/shared/components/ui/badge";
import { Button } from "@/shared/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/shared/components/ui/select";
import { ConfirmDialog } from "@/shared/components/composite/confirm-dialog";
import { CreateUserDialog } from "./create-user-dialog";
import { EmptyState } from "@/shared/components/feedback/empty-state";
import { ErrorState } from "@/shared/components/feedback/error-state";
import { TableRowSkeleton } from "@/shared/components/feedback/skeletons";
import {
  useAdminUsers,
  useUpdateUserRole,
  useUpdateUserStatus,
} from "../hooks/use-admin";
import { ROLES } from "@/shared/types/api";
import type { AdminUserSummary } from "../types/admin.types";

interface PendingRoleChange {
  user: AdminUserSummary;
  newRole: (typeof ROLES)[number];
}

export function UserManagementTable() {
  const { data, isLoading, isError, refetch } = useAdminUsers();
  const updateRole = useUpdateUserRole();
  const updateStatus = useUpdateUserStatus();
  const [rowErrors, setRowErrors] = useState<Record<string, string>>({});
  const [suspendTarget, setSuspendTarget] = useState<AdminUserSummary | null>(null);
  const [pendingRoleChange, setPendingRoleChange] = useState<PendingRoleChange | null>(null);

  // Role changes require confirmation, same as Suspend already does --
  // this is a genuine privilege-escalation surface (any role change here
  // can grant ADMIN), so an instant fire-on-select was a real gap: one
  // misclick on the dropdown silently changed someone's access with no
  // "are you sure?" step at all. Granting ADMIN specifically gets a
  // stronger warning than granting AUTHOR/EDITOR/demoting to READER.
  function requestRoleChange(user: AdminUserSummary, newRole: (typeof ROLES)[number]) {
    if (newRole === user.role) return;
    setPendingRoleChange({ user, newRole });
  }

  function confirmRoleChange() {
    if (!pendingRoleChange) return;
    const { user, newRole } = pendingRoleChange;
    setRowErrors((prev) => ({ ...prev, [user.id]: "" }));
    updateRole.mutate(
      { userId: user.id, payload: { role: newRole } },
      {
        onSuccess: () => setPendingRoleChange(null),
        onError: (error) => {
          setRowErrors((prev) => ({ ...prev, [user.id]: error.message }));
          setPendingRoleChange(null);
        },
      },
    );
  }

  function confirmSuspend() {
    if (!suspendTarget) return;
    updateStatus.mutate(
      { userId: suspendTarget.id, payload: { status: "suspended" } },
      {
        onSuccess: () => setSuspendTarget(null),
        onError: (error) =>
          setRowErrors((prev) => ({ ...prev, [suspendTarget.id]: error.message })),
      },
    );
  }

  function reactivate(userId: string) {
    setRowErrors((prev) => ({ ...prev, [userId]: "" }));
    updateStatus.mutate(
      { userId, payload: { status: "active" } },
      {
        onError: (error) =>
          setRowErrors((prev) => ({ ...prev, [userId]: error.message })),
      },
    );
  }

  if (isError) {
    return <ErrorState description="Couldn't load users." onRetry={() => refetch()} />;
  }

  if (!isLoading && data?.content.length === 0) {
    return (
      <>
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-lg font-semibold">Users</h2>
          <CreateUserDialog />
        </div>
        <EmptyState title="No users found" />
      </>
    );
  }

  const roleChangeIsAdminGrant = pendingRoleChange?.newRole === "ADMIN";

  return (
    <>
      <div className="mb-4 flex items-center justify-between">
        <h2 className="text-lg font-semibold">Users</h2>
        <CreateUserDialog />
      </div>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Name</TableHead>
            <TableHead>Email</TableHead>
            <TableHead>Role</TableHead>
            <TableHead>Status</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {isLoading
            ? Array.from({ length: 5 }, (_, i) => (
                <TableRowSkeleton key={i} columns={5} />
              ))
            : data?.content.map((user) => (
                <TableRow key={user.id}>
                  <TableCell className="font-medium">{user.fullName}</TableCell>
                  <TableCell className="text-muted-foreground">{user.email}</TableCell>
                  <TableCell>
                    <Select
                      value={user.role}
                      onValueChange={(role) =>
                        requestRoleChange(user, role as (typeof ROLES)[number])
                      }
                    >
                      <SelectTrigger size="sm" className="w-32">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {ROLES.map((role) => (
                          <SelectItem key={role} value={role} className="capitalize">
                            {role.toLowerCase()}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    {rowErrors[user.id] && (
                      <p className="text-destructive mt-1 text-xs">
                        {rowErrors[user.id]}
                      </p>
                    )}
                  </TableCell>
                  <TableCell>
                    <Badge
                      variant="secondary"
                      className={
                        user.status === "active"
                          ? "bg-canopy-100 text-canopy-800"
                          : "bg-clay-100 text-clay-700"
                      }
                    >
                      {user.status}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right">
                    {user.status === "active" ? (
                      <Button
                        size="sm"
                        variant="outline"
                        className="text-destructive hover:bg-clay-100"
                        aria-label={`Suspend user: ${user.fullName}`}
                        onClick={() => setSuspendTarget(user)}
                      >
                        Suspend
                      </Button>
                    ) : (
                      <Button
                        size="sm"
                        variant="outline"
                        aria-label={`Reactivate user: ${user.fullName}`}
                        onClick={() => reactivate(user.id)}
                      >
                        Reactivate
                      </Button>
                    )}
                  </TableCell>
                </TableRow>
              ))}
        </TableBody>
      </Table>

      <ConfirmDialog
        open={Boolean(pendingRoleChange)}
        onOpenChange={(open) => !open && setPendingRoleChange(null)}
        title={roleChangeIsAdminGrant ? "Grant Admin access?" : "Change this user's role?"}
        description={
          pendingRoleChange
            ? roleChangeIsAdminGrant
              ? `${pendingRoleChange.user.fullName} will get full platform administration: user management, role changes, and reference data. Only do this for people you'd trust with an admin account.`
              : `${pendingRoleChange.user.fullName}'s role will change from ${pendingRoleChange.user.role.toLowerCase()} to ${pendingRoleChange.newRole.toLowerCase()}.`
            : ""
        }
        confirmLabel={roleChangeIsAdminGrant ? "Grant Admin access" : "Change role"}
        isConfirming={updateRole.isPending}
        onConfirm={confirmRoleChange}
      />

      <ConfirmDialog
        open={Boolean(suspendTarget)}
        onOpenChange={(open) => !open && setSuspendTarget(null)}
        title="Suspend this user?"
        description={`${suspendTarget?.fullName} will lose access to their account until reactivated.`}
        confirmLabel="Suspend"
        isConfirming={updateStatus.isPending}
        onConfirm={confirmSuspend}
      />
    </>
  );
}
