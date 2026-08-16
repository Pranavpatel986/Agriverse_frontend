"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useFieldArray, useForm } from "react-hook-form";
import { z } from "zod";
import { Loader2Icon, PlusIcon, TrashIcon } from "lucide-react";
import { Button } from "@/shared/components/ui/button";
import { Input } from "@/shared/components/ui/input";
import { Textarea } from "@/shared/components/ui/textarea";
import { Label } from "@/shared/components/ui/label";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/shared/components/ui/form";
import { useCreateQuiz } from "../hooks/use-quiz";

const optionSchema = z.object({ optionText: z.string().min(1, "Required.") });
const questionSchema = z.object({
  questionText: z.string().min(1, "Required."),
  correctIndex: z.string(), // radio value is a string index into options
  options: z.array(optionSchema).min(2, "At least 2 options."),
});

const quizFormSchema = z.object({
  title: z.string().min(5, "At least 5 characters."),
  description: z.string().optional(),
  // Kept as a string in form state (avoids z.coerce's input/output type
  // split, which fights useForm's generic inference); parsed to a number
  // only at submit time, in onSubmit below.
  passingScore: z
    .string()
    .refine((v) => {
      const n = Number(v);
      return Number.isInteger(n) && n >= 0 && n <= 100;
    }, "Must be a whole number between 0 and 100."),
  questions: z.array(questionSchema).min(1, "Add at least one question."),
});

type QuizFormValues = z.infer<typeof quizFormSchema>;

function emptyQuestion() {
  return {
    questionText: "",
    correctIndex: "0",
    options: [{ optionText: "" }, { optionText: "" }],
  };
}

interface QuizFormProps {
  onCreated: (result: { id: string; title: string }) => void;
}

export function QuizForm({ onCreated }: QuizFormProps) {
  const createQuiz = useCreateQuiz();

  const form = useForm<QuizFormValues>({
    resolver: zodResolver(quizFormSchema),
    defaultValues: {
      title: "",
      description: "",
      passingScore: "70",
      questions: [emptyQuestion()],
    },
  });
  const questionFields = useFieldArray({ control: form.control, name: "questions" });

  function onSubmit(values: QuizFormValues) {
    const payload = {
      title: values.title,
      description: values.description || undefined,
      passingScore: Number(values.passingScore),
      questions: values.questions.map((q) => ({
        questionText: q.questionText,
        options: q.options.map((opt, i) => ({
          optionText: opt.optionText,
          isCorrect: String(i) === q.correctIndex,
        })),
      })),
    };
    createQuiz.mutateAsync(payload).then((result) => {
      onCreated({ id: result.id, title: values.title });
      form.reset({ title: "", description: "", passingScore: "70", questions: [emptyQuestion()] });
    });
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <FormField
          control={form.control}
          name="title"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Title</FormLabel>
              <FormControl>
                <Input {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="description"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Description (optional)</FormLabel>
              <FormControl>
                <Textarea rows={2} {...field} />
              </FormControl>
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="passingScore"
          render={({ field }) => (
            <FormItem className="max-w-40">
              <FormLabel>Passing score (%)</FormLabel>
              <FormControl>
                <Input type="number" min={0} max={100} {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="space-y-4">
          <Label>Questions</Label>
          {questionFields.fields.map((questionField, qIndex) => (
            <QuestionEditor
              key={questionField.id}
              form={form}
              questionIndex={qIndex}
              onRemoveQuestion={() => questionFields.remove(qIndex)}
              canRemoveQuestion={questionFields.fields.length > 1}
            />
          ))}
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() => questionFields.append(emptyQuestion())}
          >
            <PlusIcon />
            Add question
          </Button>
        </div>

        <Button type="submit" disabled={createQuiz.isPending}>
          {createQuiz.isPending && <Loader2Icon className="animate-spin" />}
          Create quiz
        </Button>
      </form>
    </Form>
  );
}

function QuestionEditor({
  form,
  questionIndex,
  onRemoveQuestion,
  canRemoveQuestion,
}: {
  form: ReturnType<typeof useForm<QuizFormValues>>;
  questionIndex: number;
  onRemoveQuestion: () => void;
  canRemoveQuestion: boolean;
}) {
  const optionFields = useFieldArray({
    control: form.control,
    name: `questions.${questionIndex}.options`,
  });

  return (
    <div className="bg-muted/30 space-y-3 rounded-lg border p-4">
      <div className="flex items-start gap-2">
        <FormField
          control={form.control}
          name={`questions.${questionIndex}.questionText`}
          render={({ field }) => (
            <FormItem className="flex-1">
              <FormControl>
                <Input {...field} placeholder={`Question ${questionIndex + 1}`} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button
          type="button"
          variant="ghost"
          size="icon"
          className="text-destructive shrink-0"
          disabled={!canRemoveQuestion}
          onClick={onRemoveQuestion}
          aria-label={`Remove question ${questionIndex + 1}`}
        >
          <TrashIcon className="size-3.5" />
        </Button>
      </div>

      <FormField
        control={form.control}
        name={`questions.${questionIndex}.correctIndex`}
        render={({ field }) => (
          <FormItem>
            <FormLabel className="text-muted-foreground text-xs font-normal">
              Select the correct option
            </FormLabel>
            <div role="radiogroup" className="space-y-2">
              {optionFields.fields.map((optionField, oIndex) => (
                <div key={optionField.id} className="flex items-center gap-2">
                  <input
                    type="radio"
                    name={`question-${questionIndex}-correct`}
                    value={oIndex}
                    checked={field.value === String(oIndex)}
                    onChange={() => field.onChange(String(oIndex))}
                    id={`q${questionIndex}-opt${oIndex}`}
                    className="border-input text-canopy-700 focus-visible:ring-ring size-4 shrink-0 accent-current"
                    aria-label={`Mark option ${oIndex + 1} as correct`}
                  />
                  <FormField
                    control={form.control}
                    name={`questions.${questionIndex}.options.${oIndex}.optionText`}
                    render={({ field: optField }) => (
                      <FormItem className="flex-1">
                        <FormControl>
                          <Input {...optField} placeholder={`Option ${oIndex + 1}`} />
                        </FormControl>
                      </FormItem>
                    )}
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    className="text-destructive size-8 shrink-0"
                    disabled={optionFields.fields.length <= 2}
                    onClick={() => {
                      optionFields.remove(oIndex);
                      // If the removed option was marked correct, default
                      // back to the first remaining option rather than
                      // leaving correctIndex pointing at a gap.
                      if (String(oIndex) === field.value) {
                        field.onChange("0");
                      }
                    }}
                    aria-label={`Remove option ${oIndex + 1}`}
                  >
                    <TrashIcon className="size-3.5" />
                  </Button>
                </div>
              ))}
            </div>
            <FormMessage />
          </FormItem>
        )}
      />
      <Button
        type="button"
        variant="ghost"
        size="sm"
        onClick={() => optionFields.append({ optionText: "" })}
      >
        <PlusIcon className="size-3.5" />
        Add option
      </Button>
    </div>
  );
}
