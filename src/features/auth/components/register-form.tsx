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
import { useRegister } from "../hooks/use-register";
import { registerSchema, type RegisterFormValues } from "../schemas/auth.schema";
import { ROUTES } from "@/config/routes";
import { SocialLoginButtons } from "./social-login-buttons";
import { PasswordStrengthMeter } from "./password-strength-meter";

export function RegisterForm() {
  const register = useRegister();
  const [submittedEmail, setSubmittedEmail] = useState<string | null>(null);

  const form = useForm<RegisterFormValues>({
    resolver: zodResolver(registerSchema),
    defaultValues: { fullName: "", email: "", password: "", confirmPassword: "" },
  });

  function onSubmit(values: RegisterFormValues) {
    register.mutate(
      { fullName: values.fullName, email: values.email, password: values.password },
      { onSuccess: () => setSubmittedEmail(values.email) },
    );
  }

  if (submittedEmail) {
    return (
      <div className="space-y-4 text-center">
        <MailCheckIcon className="text-primary mx-auto size-10" aria-hidden="true" />
        <h1 className="font-display text-2xl font-semibold">Check your email</h1>
        <p className="text-muted-foreground text-sm">
          We sent a verification link to <strong>{submittedEmail}</strong>. Verify your
          address to finish setting up your account.
        </p>
        <Button variant="outline" asChild className="w-full">
          <Link href={ROUTES.login}>Back to log in</Link>
        </Button>
      </div>
    );
  }

  const errorMessage =
    register.error?.status === 409
      ? null // handled inline below with a link, not a plain string
      : register.error?.message;

  return (
    <div className="space-y-6">
      <div className="space-y-1 text-center">
        <h1 className="font-display text-2xl font-semibold">Create your account</h1>
        <p className="text-muted-foreground text-sm">
          Join AgriVerse to save articles and get personalized guidance.
        </p>
      </div>

      {register.error?.status === 409 && (
        <Alert variant="destructive" role="alert">
          <AlertDescription>
            An account with that email already exists.{" "}
            <Link href={ROUTES.login} className="link-underline font-medium">
              Log in instead
            </Link>
            .
          </AlertDescription>
        </Alert>
      )}
      {errorMessage && (
        <Alert variant="destructive" role="alert">
          <AlertDescription>{errorMessage}</AlertDescription>
        </Alert>
      )}

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4" noValidate>
          <FormField
            control={form.control}
            name="fullName"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Full name</FormLabel>
                <FormControl>
                  <Input autoComplete="name" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
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
          <FormField
            control={form.control}
            name="password"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Password</FormLabel>
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
                <FormLabel>Confirm password</FormLabel>
                <FormControl>
                  <Input type="password" autoComplete="new-password" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <Button type="submit" className="w-full" disabled={register.isPending}>
            {register.isPending && <Loader2Icon className="animate-spin" />}
            Create account
          </Button>
        </form>
      </Form>

      <div className="text-muted-foreground relative text-center text-xs">
        <span className="bg-card relative px-2">Or continue with</span>
        <div className="bg-border absolute inset-x-0 top-1/2 -z-10 h-px" />
      </div>

      <SocialLoginButtons />

      <p className="text-muted-foreground text-center text-sm">
        Already have an account?{" "}
        <Link href={ROUTES.login} className="link-underline text-primary font-medium">
          Log in
        </Link>
      </p>
    </div>
  );
}
