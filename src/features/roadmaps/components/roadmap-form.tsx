"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useFieldArray, useForm } from "react-hook-form";
import { z } from "zod";
import { GripVerticalIcon, Loader2Icon, PlusIcon, TrashIcon } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/shared/components/ui/dialog";
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
import { CategoryPicker } from "@/features/categories/components/category-picker";
import { useCreateRoadmap } from "../hooks/use-roadmaps";

const roadmapFormSchema = z.object({
  title: z.string().min(5, "At least 5 characters."),
  description: z.string().max(1000).optional(),
  categoryId: z.string().optional(),
  steps: z
    .array(z.object({ title: z.string().min(1, "Step title is required.") }))
    .min(1, "Add at least one step."),
});

type RoadmapFormValues = z.infer<typeof roadmapFormSchema>;

interface RoadmapFormProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function RoadmapForm({ open, onOpenChange }: RoadmapFormProps) {
  const createRoadmap = useCreateRoadmap();

  const form = useForm<RoadmapFormValues>({
    resolver: zodResolver(roadmapFormSchema),
    defaultValues: { title: "", description: "", steps: [{ title: "" }] },
  });
  const stepFields = useFieldArray({ control: form.control, name: "steps" });

  function onSubmit(values: RoadmapFormValues) {
    createRoadmap
      .mutateAsync({
        title: values.title,
        description: values.description || undefined,
        categoryId: values.categoryId,
        // Article/quiz linking per step (the backend supports it — see
        // CreateRoadmapStepRequest) is left out of this form deliberately:
        // it needs article and quiz pickers that don't exist as reusable
        // components yet, and title-only steps still let an editor stand
        // up a complete, orderable roadmap. Linking specific steps to
        // content can be a fast-follow once those pickers exist.
        steps: values.steps.map((step, index) => ({ order: index + 1, title: step.title })),
      })
      .then(() => {
        onOpenChange(false);
        form.reset({ title: "", description: "", steps: [{ title: "" }] });
      });
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>Create roadmap</DialogTitle>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
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
              name="categoryId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Category (optional)</FormLabel>
                  <FormControl>
                    <CategoryPicker value={field.value} onChange={field.onChange} allowNone />
                  </FormControl>
                </FormItem>
              )}
            />

            <div className="space-y-2">
              <Label>Steps</Label>
              {stepFields.fields.map((stepField, index) => (
                <div key={stepField.id} className="flex items-center gap-2">
                  <GripVerticalIcon className="text-muted-foreground size-4 shrink-0" />
                  <FormField
                    control={form.control}
                    name={`steps.${index}.title`}
                    render={({ field }) => (
                      <FormItem className="flex-1">
                        <FormControl>
                          <Input {...field} placeholder={`Step ${index + 1} title`} />
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
                    disabled={stepFields.fields.length === 1}
                    onClick={() => stepFields.remove(index)}
                    aria-label={`Remove step ${index + 1}`}
                  >
                    <TrashIcon className="size-3.5" />
                  </Button>
                </div>
              ))}
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => stepFields.append({ title: "" })}
              >
                <PlusIcon />
                Add step
              </Button>
            </div>

            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
                Cancel
              </Button>
              <Button type="submit" disabled={createRoadmap.isPending}>
                {createRoadmap.isPending && <Loader2Icon className="animate-spin" />}
                Create roadmap
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
