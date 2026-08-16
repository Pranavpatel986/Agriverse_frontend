"use client";

import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { CheckCircle2Icon, Loader2Icon } from "lucide-react";
import { Button } from "@/shared/components/ui/button";
import { Input } from "@/shared/components/ui/input";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/shared/components/ui/form";
import { Alert, AlertDescription } from "@/shared/components/ui/alert";
import { useResetPassword } from "../hooks/use-reset-password";
import { resetPasswordSchema, type ResetPasswordFormValues } from "../schemas/auth.schema";
import { PasswordStrengthMeter } from "./password-strength-meter";
import { ROUTES } from "@/config/routes";

export function ResetPasswordForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const token = searchParams.get("token");
  const resetPassword = useResetPassword();

  const form = useForm<ResetPasswordFormValues>({
    resolver: zodResolver(resetPasswordSchema),
    defaultValues: { newPassword: "", confirmPassword: "" },
  });

  function onSubmit(values: ResetPasswordFormValues) {
    if (!token) return;
    resetPassword.mutate({ token, newPassword: values.newPassword });
  }

  // No token in the URL at all — someone navigated here directly rather
  // than via the emailed link. Different message from "token expired"
  // (a 401 from the mutation), since this case has no token to have
  // expired in the first place.
  if (!token) {
    return (
      <div className="space-y-4 text-center">
        <h1 className="font-display text-2xl font-semibold">Invalid reset link</h1>
        <p className="text-muted-foreground text-sm">
          This page needs a reset link from your email. Request a new one below.
        </p>
        <Button asChild className="w-full">
          <Link href={ROUTES.forgotPassword}>Request a new link</Link>
        </Button>
      </div>
    );
  }

  if (resetPassword.isSuccess) {
    return (
      <div className="space-y-4 text-center">
        <CheckCircle2Icon className="text-primary mx-auto size-10" aria-hidden="true" />
        <h1 className="font-display text-2xl font-semibold">Password updated</h1>
        <p className="text-muted-foreground text-sm">
          Your password has been changed. Log in with your new password.
        </p>
        <Button className="w-full" onClick={() => router.push(ROUTES.login)}>
          Continue to log in
        </Button>
      </div>
    );
  }

  const errorMessage =
    resetPassword.error?.status === 401
      ? "This reset link is invalid or has expired. Request a new one below."
      : resetPassword.error?.message;

  return (
    <div className="space-y-6">
      <div className="space-y-1 text-center">
        <h1 className="font-display text-2xl font-semibold">Set a new password</h1>
        <p className="text-muted-foreground text-sm">Choose a new password for your account.</p>
      </div>

      {errorMessage && (
        <Alert variant="destructive" role="alert">
          <AlertDescription>
            {errorMessage}
            {resetPassword.error?.status === 401 && (
              <>
                {" "}
                <Link href={ROUTES.forgotPassword} className="link-underline font-medium">
                  Request a new link
                </Link>
              </>
            )}
          </AlertDescription>
        </Alert>
      )}

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4" noValidate>
          <FormField
            control={form.control}
            name="newPassword"
            render={({ field }) => (
              <FormItem>
                <FormLabel>New password</FormLabel>
                <FormControl>
                  <Input type="password" autoComplete="new-password" {...field} />
                </FormControl>
                <PasswordStrengthMeter password={field.value} />
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="confirmPassword"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Confirm new password</FormLabel>
                <FormControl>
                  <Input type="password" autoComplete="new-password" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <Button type="submit" className="w-full" disabled={resetPassword.isPending}>
            {resetPassword.isPending && <Loader2Icon className="animate-spin" />}
            Reset password
          </Button>
        </form>
      </Form>
    </div>
  );
}
