"use client";

import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Loader2Icon } from "lucide-react";
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
import { useLogin } from "../hooks/use-login";
import { loginSchema, type LoginFormValues } from "../schemas/auth.schema";
import { ROUTES } from "@/config/routes";
import { SocialLoginButtons } from "./social-login-buttons";

export function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const login = useLogin();

  const form = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: { email: "", password: "" },
  });

  function onSubmit(values: LoginFormValues) {
    login.mutate(values, {
      onSuccess: () => {
        const redirectTo = searchParams.get("redirectTo");
        router.push(redirectTo && redirectTo.startsWith("/") ? redirectTo : ROUTES.home);
      },
    });
  }

  // Per the spec: 401 is deliberately non-specific (don't reveal which
  // field was wrong / whether the account exists). 403 and 429 get their
  // own actionable messages instead of the generic one.
  const errorMessage = (() => {
    const error = login.error;
    if (!error) return null;
    if (error.status === 401) return "Email or password is incorrect.";
    if (error.status === 403)
      return "Your account isn't verified yet. Check your email, or resend the verification link.";
    if (error.isRateLimited) return "Too many attempts — please try again in a moment.";
    return error.message;
  })();

  return (
    <div className="space-y-6">
      <div className="space-y-1 text-center">
        <h1 className="font-display text-2xl font-semibold">Log in</h1>
        <p className="text-muted-foreground text-sm">Welcome back to AgriVerse.</p>
      </div>

      {errorMessage && (
        <Alert variant="destructive" role="alert">
          <AlertDescription>{errorMessage}</AlertDescription>
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
          <FormField
            control={form.control}
            name="password"
            render={({ field }) => (
              <FormItem>
                <div className="flex items-center justify-between">
                  <FormLabel>Password</FormLabel>
                  <Link
                    href={ROUTES.forgotPassword}
                    className="link-underline text-primary text-xs font-medium"
                  >
                    Forgot password?
                  </Link>
                </div>
                <FormControl>
                  <Input type="password" autoComplete="current-password" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <Button type="submit" className="w-full" disabled={login.isPending}>
            {login.isPending && <Loader2Icon className="animate-spin" />}
            Log in
          </Button>
        </form>
      </Form>

      <div className="text-muted-foreground relative text-center text-xs">
        <span className="bg-card relative px-2">Or continue with</span>
        <div className="bg-border absolute inset-x-0 top-1/2 -z-10 h-px" />
      </div>

      <SocialLoginButtons />

      <p className="text-muted-foreground text-center text-sm">
        Don&apos;t have an account?{" "}
        <Link href={ROUTES.register} className="link-underline text-primary font-medium">
          Sign up
        </Link>
      </p>
    </div>
  );
}
