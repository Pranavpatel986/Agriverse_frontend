import type { Metadata } from "next";
import { quizService } from "@/features/quiz/api/quiz.service";
import { QuizContent } from "@/features/quiz/components/quiz-content";
import { ErrorState } from "@/shared/components/feedback/error-state";

// Not statically generated — quizzes are gated behind interaction and
// aren't a primary SEO asset, per the spec. Server-fetched once per
// request purely for a fast first paint + shallow title/description
// indexing, not for caching/ISR.
export const dynamic = "force-dynamic";

interface QuizPageProps {
  params: Promise<{ id: string }>;
}

export async function generateMetadata({ params }: QuizPageProps): Promise<Metadata> {
  const { id } = await params;
  try {
    const quiz = await quizService.byId(id);
    return { title: quiz.title, robots: { index: true, follow: true } };
  } catch {
    return { title: "Quiz" };
  }
}

export default async function QuizPage({ params }: QuizPageProps) {
  const { id } = await params;

  let quiz: Awaited<ReturnType<typeof quizService.byId>> | null = null;
  try {
    quiz = await quizService.byId(id);
  } catch {
    quiz = null;
  }

  if (!quiz) {
    return (
      <div className="mx-auto max-w-2xl px-4 py-16">
        <ErrorState title="Quiz unavailable" description="We couldn't load this quiz." />
      </div>
    );
  }

  return <QuizContent quiz={quiz} />;
}
