"use client";

import { useState } from "react";
import Link from "next/link";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Loader2Icon, MailCheckIcon } from "lucide-react";
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
import { useForgotPassword } from "../hooks/use-forgot-password";
import { forgotPasswordSchema, type ForgotPasswordFormValues } from "../schemas/auth.schema";
import { ROUTES } from "@/config/routes";

export function ForgotPasswordForm() {
  const forgotPassword = useForgotPassword();
  const [submitted, setSubmitted] = useState(false);

  const form = useForm<ForgotPasswordFormValues>({
    resolver: zodResolver(forgotPasswordSchema),
    defaultValues: { email: "" },
  });

  function onSubmit(values: ForgotPasswordFormValues) {
    // The backend deliberately returns the same generic response whether
    // or not the email exists (doesn't reveal account existence) — so
    // "submitted" always shows the same success state regardless.
    forgotPassword.mutate(values, { onSuccess: () => setSubmitted(true) });
  }

  if (submitted) {
    return (
      <div className="space-y-4 text-center">
        <MailCheckIcon className="text-primary mx-auto size-10" aria-hidden="true" />
        <h1 className="font-display text-2xl font-semibold">Check your email</h1>
        <p className="text-muted-foreground text-sm">
          If an account exists for <strong>{form.getValues("email")}</strong>, we&apos;ve sent a
          link to reset your password. It expires in 30 minutes.
        </p>
        <Button variant="outline" asChild className="w-full">
          <Link href={ROUTES.login}>Back to log in</Link>
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="space-y-1 text-center">
        <h1 className="font-display text-2xl font-semibold">Forgot your password?</h1>
        <p className="text-muted-foreground text-sm">
          Enter your email and we&apos;ll send you a reset link.
        </p>
      </div>

      {forgotPassword.error && (
        <Alert variant="destructive" role="alert">
          <AlertDescription>{forgotPassword.error.message}</AlertDescription>
        </Alert>
      )}

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4" noValidate>
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Email</FormLabel>
                <FormControl>
                  <Input type="email" autoComplete="email" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <Button type="submit" className="w-full" disabled={forgotPassword.isPending}>
            {forgotPassword.isPending && <Loader2Icon className="animate-spin" />}
            Send reset link
          </Button>
        </form>
      </Form>

      <p className="text-muted-foreground text-center text-sm">
        Remembered your password?{" "}
        <Link href={ROUTES.login} className="link-underline text-primary font-medium">
          Log in
        </Link>
      </p>
    </div>
  );
}
