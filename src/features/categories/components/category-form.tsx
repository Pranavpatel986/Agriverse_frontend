"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Loader2Icon } from "lucide-react";
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
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/shared/components/ui/form";
import { CategoryPicker } from "./category-picker";
import { useCreateCategory, useUpdateCategory } from "../hooks/use-categories";
import type { CategoryDetail } from "../types/category.types";

const categoryFormSchema = z.object({
  name: z.string().min(2, "At least 2 characters."),
  // "none" is a real Select option value standing in for "no parent" —
  // Radix Select can't take an empty-string item value, so this is
  // translated to/from undefined at the form boundary, not sent as-is.
  parentCategoryId: z.string().optional(),
  description: z.string().optional(),
});

type CategoryFormValues = z.infer<typeof categoryFormSchema>;

interface CategoryFormProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  editing?: CategoryDetail;
}

export function CategoryForm({ open, onOpenChange, editing }: CategoryFormProps) {
  const createCategory = useCreateCategory();
  const updateCategory = useUpdateCategory();
  const isPending = createCategory.isPending || updateCategory.isPending;

  const form = useForm<CategoryFormValues>({
    resolver: zodResolver(categoryFormSchema),
    values: editing
      ? {
          name: editing.name,
          parentCategoryId: editing.parentCategoryId,
          description: editing.description ?? "",
        }
      : { name: "", description: "" },
  });

  function onSubmit(values: CategoryFormValues) {
    // A category can't be its own parent, and the backend rejects a
    // cycle anyway (ConflictException) — but excluding self here means
    // that error surfaces as an obviously-wrong picker state, not a
    // 409 the person has to interpret.
    const payload = {
      name: values.name,
      parentCategoryId: values.parentCategoryId,
      description: values.description || undefined,
    };
    const action = editing
      ? updateCategory.mutateAsync({ id: editing.id, payload })
      : createCategory.mutateAsync(payload);

    action.then(() => {
      onOpenChange(false);
      form.reset();
    });
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>{editing ? "Edit category" : "Add category"}</DialogTitle>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Name</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="parentCategoryId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Parent category (optional)</FormLabel>
                  <FormControl>
                    <CategoryPicker
                      value={field.value}
                      onChange={field.onChange}
                      excludeId={editing?.id}
                      allowNone
                    />
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
                    <Textarea rows={3} {...field} />
                  </FormControl>
                </FormItem>
              )}
            />

            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
                Cancel
              </Button>
              <Button type="submit" disabled={isPending}>
                {isPending && <Loader2Icon className="animate-spin" />}
                {editing ? "Save changes" : "Create category"}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
