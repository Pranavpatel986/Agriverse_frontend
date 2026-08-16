"use client";

import { useState } from "react";
import { CheckCircle2Icon, InfoIcon } from "lucide-react";
import { Alert, AlertDescription } from "@/shared/components/ui/alert";
import { Badge } from "@/shared/components/ui/badge";
import { QuizForm } from "./quiz-form";

export function QuizManagementPanel() {
  // The backend has no GET /quizzes list-all endpoint (confirmed against
  // the REST API Specification — only byId, attempts, and create exist;
  // quizzes are discovered through the roadmap step or article they're
  // attached to, not browsed directly). So unlike Categories/Crops/
  // Roadmaps, this panel can't show "all quizzes" — only a running record
  // of what's been created this session, with the ID needed to attach it
  // to a roadmap step or article elsewhere.
  const [createdThisSession, setCreatedThisSession] = useState<{ id: string; title: string }[]>([]);

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-lg font-semibold">Quizzes</h2>
        <Alert className="mt-2">
          <InfoIcon className="size-4" />
          <AlertDescription>
            There&apos;s no listing of existing quizzes yet — copy the ID after creating one to
            attach it to an article or roadmap step.
          </AlertDescription>
        </Alert>
      </div>

      {createdThisSession.length > 0 && (
        <div className="space-y-2">
          <h3 className="text-sm font-medium">Created this session</h3>
          <div className="divide-border bg-card divide-y rounded-lg border">
            {createdThisSession.map((quiz) => (
              <div key={quiz.id} className="flex items-center justify-between gap-3 px-4 py-3">
                <span className="flex items-center gap-2 font-medium">
                  <CheckCircle2Icon className="text-canopy-700 size-4" />
                  {quiz.title}
                </span>
                <Badge variant="secondary" className="font-mono text-xs">
                  {quiz.id}
                </Badge>
              </div>
            ))}
          </div>
        </div>
      )}

      <QuizForm onCreated={(quiz) => setCreatedThisSession((prev) => [quiz, ...prev])} />
    </div>
  );
}
