"use client";

import { useState } from "react";
import { ChevronLeftIcon, ChevronRightIcon, Loader2Icon } from "lucide-react";
import { Button } from "@/shared/components/ui/button";
import { ProgressIndicator } from "./progress-indicator";
import { OptionList } from "./option-list";
import { ResultSummary } from "./result-summary";
import { useSubmitQuizAttempt } from "../hooks/use-quiz";
import type { QuizDetail } from "../types/quiz.types";

export function QuizContent({ quiz }: { quiz: QuizDetail }) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const submitAttempt = useSubmitQuizAttempt(quiz.id);

  const currentQuestion = quiz.questions[currentIndex];
  const allAnswered = quiz.questions.every((q) => answers[q.id]);
  const isLastQuestion = currentIndex === quiz.questions.length - 1;

  function selectAnswer(optionId: string) {
    setAnswers((prev) => ({ ...prev, [currentQuestion.id]: optionId }));
  }

  function handleSubmit() {
    submitAttempt.mutate({
      answers: quiz.questions.map((q) => ({
        questionId: q.id,
        selectedOptionId: answers[q.id],
      })),
    });
  }

  function handleRetry() {
    setAnswers({});
    setCurrentIndex(0);
    submitAttempt.reset();
  }

  if (submitAttempt.data) {
    return <ResultSummary result={submitAttempt.data} onRetry={handleRetry} />;
  }

  return (
    <div className="mx-auto w-full max-w-xl space-y-6 px-4 py-8">
      <header className="space-y-1">
        <h1 className="font-display text-2xl font-semibold">{quiz.title}</h1>
        <p className="text-muted-foreground text-sm">
          Passing score: {quiz.passingScore}%
        </p>
      </header>

      <ProgressIndicator current={currentIndex + 1} total={quiz.questions.length} />

      <div className="border-border bg-card space-y-4 rounded-lg border p-5">
        <p className="text-base font-medium">{currentQuestion.questionText}</p>
        <OptionList
          questionText={currentQuestion.questionText}
          options={currentQuestion.options}
          selectedOptionId={answers[currentQuestion.id]}
          onSelect={selectAnswer}
          name={`question-${currentQuestion.id}`}
        />
      </div>

      {submitAttempt.isError && (
        <p role="alert" className="text-destructive text-sm">
          {submitAttempt.error.message} Your answers are still saved — try submitting
          again.
        </p>
      )}

      <div className="flex items-center justify-between gap-3">
        <Button
          variant="outline"
          disabled={currentIndex === 0}
          onClick={() => setCurrentIndex((i) => i - 1)}
        >
          <ChevronLeftIcon />
          Previous
        </Button>

        {isLastQuestion ? (
          <Button
            disabled={!allAnswered || submitAttempt.isPending}
            onClick={handleSubmit}
          >
            {submitAttempt.isPending && <Loader2Icon className="animate-spin" />}
            Submit
          </Button>
        ) : (
          <Button
            disabled={!answers[currentQuestion.id]}
            onClick={() => setCurrentIndex((i) => i + 1)}
          >
            Next
            <ChevronRightIcon />
          </Button>
        )}
      </div>
    </div>
  );
}
