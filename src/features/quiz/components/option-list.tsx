import { cn } from "@/shared/lib/utils";
import type { QuizOption } from "../types/quiz.types";

interface OptionListProps {
  questionText: string;
  options: QuizOption[];
  selectedOptionId: string | undefined;
  onSelect: (optionId: string) => void;
  name: string;
}

export function OptionList({
  questionText,
  options,
  selectedOptionId,
  onSelect,
  name,
}: OptionListProps) {
  return (
    <fieldset className="space-y-2">
      <legend className="sr-only">{questionText}</legend>
      {options.map((option) => {
        const isSelected = selectedOptionId === option.id;
        return (
          <label
            key={option.id}
            className={cn(
              "border-border bg-card has-[:checked]:border-primary has-[:checked]:bg-canopy-50 flex cursor-pointer items-center gap-3 rounded-lg border p-4 text-sm transition-colors",
            )}
          >
            <input
              type="radio"
              name={name}
              value={option.id}
              checked={isSelected}
              onChange={() => onSelect(option.id)}
              className="size-4 accent-[var(--color-primary)]"
            />
            {option.optionText}
          </label>
        );
      })}
    </fieldset>
  );
}
