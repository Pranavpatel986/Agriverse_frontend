"use client";

import { useEffect, useRef } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { CheckCircle2Icon, Loader2Icon, XCircleIcon } from "lucide-react";
import { Button } from "@/shared/components/ui/button";
import { useVerifyEmail } from "../hooks/use-verify-email";
import { ROUTES } from "@/config/routes";

export function VerifyEmailHandler() {
  const searchParams = useSearchParams();
  const token = searchParams.get("token");
  const verifyEmail = useVerifyEmail();

  // Verification tokens are single-use server-side, so firing the mutation
  // twice for the same token (React 18 Strict Mode runs effects twice in
  // dev, and this effect would otherwise re-run on any re-render) would
  // make the *second* call fail with "invalid or expired" right after the
  // first one succeeded -- confusing if a race lets the second response
  // land and overwrite the success state. Guard with a ref, not just an
  // effect dependency array, since the guard needs to survive re-renders
  // within the same mount.
  const hasAttempted = useRef(false);

  useEffect(() => {
    if (!token || hasAttempted.current) return;
    hasAttempted.current = true;
    verifyEmail.mutate({ token });
    // eslint-disable-next-line react-hooks/exhaustive-deps -- intentionally only re-run if the token itself changes
  }, [token]);

  if (!token) {
    return (
      <div className="space-y-4 text-center">
        <XCircleIcon className="text-destructive mx-auto size-10" aria-hidden="true" />
        <h1 className="font-display text-2xl font-semibold">Invalid verification link</h1>
        <p className="text-muted-foreground text-sm">
          This page needs a verification link from your email.
        </p>
        <Button variant="outline" asChild className="w-full">
          <Link href={ROUTES.login}>Back to log in</Link>
        </Button>
      </div>
    );
  }

  if (verifyEmail.isPending || verifyEmail.isIdle) {
    return (
      <div className="space-y-4 text-center">
        <Loader2Icon className="text-primary mx-auto size-10 animate-spin" aria-hidden="true" />
        <h1 className="font-display text-2xl font-semibold">Verifying your email…</h1>
      </div>
    );
  }

  if (verifyEmail.isSuccess) {
    return (
      <div className="space-y-4 text-center">
        <CheckCircle2Icon className="text-primary mx-auto size-10" aria-hidden="true" />
        <h1 className="font-display text-2xl font-semibold">Email verified</h1>
        <p className="text-muted-foreground text-sm">
          Your account is now active. You can log in.
        </p>
        <Button asChild className="w-full">
          <Link href={ROUTES.login}>Continue to log in</Link>
        </Button>
      </div>
    );
  }

  // Error state: link expired (48h), already used, or malformed.
  return (
    <div className="space-y-4 text-center">
      <XCircleIcon className="text-destructive mx-auto size-10" aria-hidden="true" />
      <h1 className="font-display text-2xl font-semibold">Verification link expired</h1>
      <p className="text-muted-foreground text-sm">
        This link is invalid or has expired. Log in and we&apos;ll offer to resend it.
      </p>
      <Button variant="outline" asChild className="w-full">
        <Link href={ROUTES.login}>Back to log in</Link>
      </Button>
    </div>
  );
}
