import type { Metadata } from "next";
import { Suspense } from "react";
import { ResetPasswordForm } from "@/features/auth/components/reset-password-form";
import { Skeleton } from "@/shared/components/ui/skeleton";

export const metadata: Metadata = {
  title: "Reset password",
  robots: { index: false, follow: false },
};

export default function ResetPasswordPage() {
  // Suspense boundary is required here, not optional -- ResetPasswordForm
  // reads the token via useSearchParams(), which Next.js requires to be
  // wrapped in Suspense during static generation (same reason LoginForm
  // has one for its redirectTo param).
  return (
    <Suspense fallback={<Skeleton className="h-96 w-full" />}>
      <ResetPasswordForm />
    </Suspense>
  );
}
