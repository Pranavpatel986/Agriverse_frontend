"use client";

import { useState } from "react";
import { MailIcon } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/shared/components/ui/button";
import { Input } from "@/shared/components/ui/input";

/**
 * The REST API Specification has no /newsletter endpoint — this
 * component is built to the Home page's UI spec but intentionally
 * doesn't call anything real yet. Wire the mutation here once that
 * endpoint exists rather than adding one speculatively.
 */
export function NewsletterSignup() {
  const [email, setEmail] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setIsSubmitting(true);
    setTimeout(() => {
      setIsSubmitting(false);
      setEmail("");
      toast.success("Thanks! We'll notify you at " + email + " once this is live.");
    }, 400);
  }

  return (
    <section className="border-canopy-200 bg-canopy-50 rounded-xl border p-6 text-center sm:p-10">
      <MailIcon className="text-primary mx-auto mb-3 size-8" aria-hidden="true" />
      <h2 className="font-display text-xl font-semibold">Stay in the loop</h2>
      <p className="text-muted-foreground mx-auto mt-1 max-w-md text-sm">
        Get new crop guides, scheme updates, and seasonal advisories in your inbox.
      </p>
      <form
        onSubmit={handleSubmit}
        className="mx-auto mt-4 flex max-w-sm flex-col gap-2 sm:flex-row"
      >
        <label htmlFor="newsletter-email" className="sr-only">
          Email address
        </label>
        <Input
          id="newsletter-email"
          type="email"
          required
          placeholder="you@example.com"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="bg-background"
        />
        <Button type="submit" disabled={isSubmitting}>
          Subscribe
        </Button>
      </form>
    </section>
  );
}
