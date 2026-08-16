import type { Metadata } from "next";
import { Suspense } from "react";
import { VerifyEmailHandler } from "@/features/auth/components/verify-email-handler";
import { Skeleton } from "@/shared/components/ui/skeleton";

export const metadata: Metadata = {
  title: "Verify email",
  robots: { index: false, follow: false },
};

export default function VerifyEmailPage() {
  return (
    <Suspense fallback={<Skeleton className="h-64 w-full" />}>
      <VerifyEmailHandler />
    </Suspense>
  );
}
