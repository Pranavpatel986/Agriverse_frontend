"use client";

import { toast } from "sonner";
import { Button } from "@/shared/components/ui/button";
import { useSocialLogin } from "../hooks/use-social-login";
import type { SocialProvider } from "../api/auth.types";

/**
 * The mutation layer (useSocialLogin → POST /auth/social-login) is fully
 * wired. What's intentionally NOT here yet: an actual Google/GitHub SDK
 * integration to obtain the idToken the endpoint expects — that requires
 * real OAuth client IDs/redirect URIs this spec doesn't provide. Wiring
 * a fake token would silently produce a broken "successful" login, so
 * each button surfaces that plainly instead of pretending to work.
 */
export function SocialLoginButtons() {
  const socialLogin = useSocialLogin();

  function handleClick(provider: SocialProvider) {
    toast.info(`${provider === "google" ? "Google" : "GitHub"} sign-in is coming soon.`);
  }

  return (
    <div className="grid grid-cols-2 gap-3">
      <Button
        type="button"
        variant="outline"
        disabled={socialLogin.isPending}
        onClick={() => handleClick("google")}
      >
        Google
      </Button>
      <Button
        type="button"
        variant="outline"
        disabled={socialLogin.isPending}
        onClick={() => handleClick("github")}
      >
        GitHub
      </Button>
    </div>
  );
}
