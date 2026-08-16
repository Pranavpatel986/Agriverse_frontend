import type { PublicId } from "@/shared/types/api";

export interface QuizOption {
  id: PublicId;
  optionText: string;
}

export interface QuizQuestion {
  id: PublicId;
  questionText: string;
  options: QuizOption[];
}

/** Correct answers are withheld — GET /quizzes/{id} never reveals which
 *  option is correct, per the spec. */
export interface QuizDetail {
  id: PublicId;
  title: string;
  passingScore: number;
  questions: QuizQuestion[];
}

export interface SubmitAnswer {
  questionId: PublicId;
  selectedOptionId: PublicId;
}

export interface SubmitQuizAttemptRequest {
  answers: SubmitAnswer[];
}

export interface QuizAttemptResult {
  score: number;
  totalQuestions: number;
  passed: boolean;
}

export interface QuizAttemptHistoryItem {
  score: number;
  totalQuestions: number;
  passed: boolean;
  attemptedAt: string;
}

// --- Admin authoring (QuizManagementPanel) -------------------------------

export interface CreateQuizOptionInput {
  optionText: string;
  isCorrect: boolean;
}

export interface CreateQuizQuestionInput {
  questionText: string;
  options: CreateQuizOptionInput[];
}

export interface CreateQuizInput {
  title: string;
  description?: string;
  passingScore: number;
  questions: CreateQuizQuestionInput[];
}
