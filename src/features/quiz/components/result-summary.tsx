import { CheckCircle2Icon, XCircleIcon } from "lucide-react";
import { Button } from "@/shared/components/ui/button";
import type { QuizAttemptResult } from "../types/quiz.types";

export function ResultSummary({
  result,
  onRetry,
}: {
  result: QuizAttemptResult;
  onRetry: () => void;
}) {
  const Icon = result.passed ? CheckCircle2Icon : XCircleIcon;

  return (
    <div className="border-border bg-card space-y-4 rounded-lg border p-6 text-center">
      <Icon
        className={
          result.passed
            ? "text-canopy-600 mx-auto size-10"
            : "text-clay-600 mx-auto size-10"
        }
        aria-hidden="true"
      />
      {/* Pass/fail stated in text explicitly, not conveyed by icon/color
          alone, per the a11y requirement. */}
      <p className="font-display text-xl font-semibold">
        {result.passed ? "You passed!" : "Not quite — try again"}
      </p>
      <p className="text-muted-foreground">
        You scored {result.score} out of {result.totalQuestions}.
      </p>
      <Button variant="outline" onClick={onRetry}>
        Retake quiz
      </Button>
    </div>
  );
}
