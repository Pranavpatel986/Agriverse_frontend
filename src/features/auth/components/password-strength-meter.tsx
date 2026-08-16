import { cn } from "@/shared/lib/utils";

function scorePassword(password: string): number {
  let score = 0;
  if (password.length >= 8) score++;
  if (password.length >= 12) score++;
  if (/[A-Z]/.test(password) && /[a-z]/.test(password)) score++;
  if (/[0-9]/.test(password)) score++;
  if (/[^A-Za-z0-9]/.test(password)) score++;
  return score;
}

const LEVELS = [
  { label: "Too short", color: "bg-clay-500" },
  { label: "Weak", color: "bg-clay-500" },
  { label: "Fair", color: "bg-harvest-500" },
  { label: "Good", color: "bg-harvest-500" },
  { label: "Strong", color: "bg-canopy-500" },
  { label: "Strong", color: "bg-canopy-500" },
] as const;

export function PasswordStrengthMeter({ password }: { password: string }) {
  if (!password) return null;
  const score = scorePassword(password);
  const level = LEVELS[Math.min(score, LEVELS.length - 1)];

  return (
    <div className="space-y-1" aria-live="polite">
      <div className="flex gap-1">
        {Array.from({ length: 4 }, (_, i) => (
          <div
            key={i}
            className={cn(
              "bg-muted h-1 flex-1 rounded-full transition-colors",
              i < score && level.color,
            )}
          />
        ))}
      </div>
      {/* Text label, not color alone, per the Register page's a11y requirement */}
      <p className="text-muted-foreground text-xs">Password strength: {level.label}</p>
    </div>
  );
}
