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
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/shared/components/ui/form";
import { CategoryPicker } from "@/features/categories/components/category-picker";
import { useCreateCrop, useUpdateCrop } from "../hooks/use-crops";
import type { Crop } from "../types/crop.types";

const cropFormSchema = z.object({
  name: z.string().min(2, "At least 2 characters."),
  scientificName: z.string().optional(),
  categoryId: z.string().optional(),
});

type CropFormValues = z.infer<typeof cropFormSchema>;

interface CropFormProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  editing?: Crop;
}

export function CropForm({ open, onOpenChange, editing }: CropFormProps) {
  const createCrop = useCreateCrop();
  const updateCrop = useUpdateCrop();
  const isPending = createCrop.isPending || updateCrop.isPending;

  const form = useForm<CropFormValues>({
    resolver: zodResolver(cropFormSchema),
    values: editing
      ? {
          name: editing.name,
          scientificName: editing.scientificName ?? "",
          categoryId: editing.categoryId,
        }
      : { name: "", scientificName: "" },
  });

  function onSubmit(values: CropFormValues) {
    const payload = {
      name: values.name,
      scientificName: values.scientificName || undefined,
      categoryId: values.categoryId,
    };
    const action = editing
      ? updateCrop.mutateAsync({ id: editing.id, payload })
      : createCrop.mutateAsync(payload);

    action.then(() => {
      onOpenChange(false);
      form.reset();
    });
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>{editing ? "Edit crop" : "Add crop"}</DialogTitle>
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
              name="scientificName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Scientific name (optional)</FormLabel>
                  <FormControl>
                    <Input {...field} placeholder="e.g. Triticum aestivum" />
                  </FormControl>
                  <FormMessage />
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
                  <FormMessage />
                </FormItem>
              )}
            />

            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
                Cancel
              </Button>
              <Button type="submit" disabled={isPending}>
                {isPending && <Loader2Icon className="animate-spin" />}
                {editing ? "Save changes" : "Create crop"}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
