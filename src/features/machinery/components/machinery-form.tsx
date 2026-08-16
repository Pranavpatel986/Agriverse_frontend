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
import { CropPicker } from "@/shared/components/composite/crop-picker";
import { useCreateMachinery, useUpdateMachinery } from "../hooks/use-machinery";
import type { MachineryDetail } from "../types/machinery.types";

const machineryFormSchema = z.object({
  name: z.string().min(1, "Required."),
  category: z.string().min(1, "Required."),
  description: z.string().min(1, "Required."),
  priceRangeMin: z.string().optional(),
  priceRangeMax: z.string().optional(),
  applicableCropId: z.string().optional(),
  articleId: z.string().optional(),
});

type MachineryFormValues = z.infer<typeof machineryFormSchema>;

interface MachineryFormProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  editing?: MachineryDetail;
}

export function MachineryForm({ open, onOpenChange, editing }: MachineryFormProps) {
  const createMachinery = useCreateMachinery();
  const updateMachinery = useUpdateMachinery();
  const isPending = createMachinery.isPending || updateMachinery.isPending;

  const form = useForm<MachineryFormValues>({
    resolver: zodResolver(machineryFormSchema),
    values: editing
      ? {
          name: editing.name,
          category: editing.category,
          description: editing.description,
          priceRangeMin: editing.priceRangeMin?.toString() ?? "",
          priceRangeMax: editing.priceRangeMax?.toString() ?? "",
          applicableCropId: editing.applicableCrop?.id,
          articleId: editing.article?.id,
        }
      : { name: "", category: "", description: "" },
  });

  function onSubmit(values: MachineryFormValues) {
    const payload = {
      ...values,
      priceRangeMin: values.priceRangeMin ? Number(values.priceRangeMin) : undefined,
      priceRangeMax: values.priceRangeMax ? Number(values.priceRangeMax) : undefined,
    };
    const action = editing
      ? updateMachinery.mutateAsync({ id: editing.id, payload })
      : createMachinery.mutateAsync(payload);

    action.then(() => {
      onOpenChange(false);
      form.reset();
    });
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[85vh] overflow-y-auto sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>{editing ? "Edit machinery" : "Add machinery"}</DialogTitle>
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
              name="category"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Category</FormLabel>
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
                  <FormLabel>Description</FormLabel>
                  <FormControl>
                    <Textarea rows={3} {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <div className="grid grid-cols-2 gap-3">
              <FormField
                control={form.control}
                name="priceRangeMin"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Min price (₹)</FormLabel>
                    <FormControl>
                      <Input type="number" {...field} value={field.value ?? ""} />
                    </FormControl>
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="priceRangeMax"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Max price (₹)</FormLabel>
                    <FormControl>
                      <Input type="number" {...field} value={field.value ?? ""} />
                    </FormControl>
                  </FormItem>
                )}
              />
            </div>
            <FormField
              control={form.control}
              name="applicableCropId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Applicable crop (optional)</FormLabel>
                  <CropPicker value={field.value} onChange={field.onChange} />
                </FormItem>
              )}
            />

            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
                Cancel
              </Button>
              <Button type="submit" disabled={isPending}>
                {isPending && <Loader2Icon className="animate-spin" />}
                {editing ? "Save changes" : "Create machinery"}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
