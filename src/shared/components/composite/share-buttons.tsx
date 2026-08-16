"use client";

import { useState } from "react";
import { LinkIcon, CheckIcon, Share2Icon } from "lucide-react";
import { Button } from "@/shared/components/ui/button";

export function ShareButtons({ url, title }: { url: string; title: string }) {
  const [copied, setCopied] = useState(false);

  async function handleCopy() {
    await navigator.clipboard.writeText(url);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  // lucide-react no longer ships brand marks (Twitter/Facebook), so
  // share targets use a generic share icon + text label rather than a
  // brand logo — text labels also keep this understandable without
  // relying on icon shape alone.
  const shareTargets = [
    {
      label: "X",
      href: `https://twitter.com/intent/tweet?url=${encodeURIComponent(url)}&text=${encodeURIComponent(title)}`,
    },
    {
      label: "Facebook",
      href: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`,
    },
  ];

  return (
    <div className="flex items-center gap-1">
      {shareTargets.map((target) => (
        <Button key={target.label} variant="ghost" size="sm" asChild>
          <a
            href={target.href}
            target="_blank"
            rel="noopener noreferrer"
            aria-label={`Share on ${target.label}`}
          >
            <Share2Icon className="size-4" />
            {target.label}
          </a>
        </Button>
      ))}
      <Button variant="ghost" size="icon" aria-label="Copy link" onClick={handleCopy}>
        {copied ? (
          <CheckIcon className="text-canopy-600 size-4" />
        ) : (
          <LinkIcon className="size-4" />
        )}
      </Button>
    </div>
  );
}
