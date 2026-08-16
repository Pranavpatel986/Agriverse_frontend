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
import { useCreateScheme, useUpdateScheme } from "../hooks/use-schemes";
import type { SchemeDetail } from "../types/scheme.types";

// Mirrors CreateSchemeRequest's required fields exactly.
const schemeFormSchema = z.object({
  name: z.string().min(5, "Must be at least 5 characters."),
  description: z.string().min(1, "Required."),
  beneficiaryType: z.string().min(1, "Required."),
  state: z.string().optional(),
  cropId: z.string().optional(),
  benefitSummary: z.string().min(1, "Required."),
  applicationDeadline: z.string().optional(),
  officialUrl: z.string().url("Enter a valid URL."),
  source: z.string().min(1, "Required."),
});

type SchemeFormValues = z.infer<typeof schemeFormSchema>;

interface SchemeFormProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  editing?: SchemeDetail;
}

export function SchemeForm({ open, onOpenChange, editing }: SchemeFormProps) {
  const createScheme = useCreateScheme();
  const updateScheme = useUpdateScheme();
  const isPending = createScheme.isPending || updateScheme.isPending;

  const form = useForm<SchemeFormValues>({
    resolver: zodResolver(schemeFormSchema),
    values: editing
      ? {
          name: editing.name,
          description: editing.description,
          beneficiaryType: editing.beneficiaryType,
          state: editing.state,
          cropId: editing.crop?.id,
          benefitSummary: editing.benefitSummary,
          applicationDeadline: editing.applicationDeadline,
          officialUrl: editing.officialUrl,
          source: editing.source,
        }
      : {
          name: "",
          description: "",
          beneficiaryType: "",
          benefitSummary: "",
          officialUrl: "",
          source: "",
        },
  });

  function onSubmit(values: SchemeFormValues) {
    const action = editing
      ? updateScheme.mutateAsync({ id: editing.id, payload: values })
      : createScheme.mutateAsync(values);

    action.then(() => {
      onOpenChange(false);
      form.reset();
    });
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[85vh] overflow-y-auto sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>{editing ? "Edit scheme" : "Add scheme"}</DialogTitle>
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
                name="beneficiaryType"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Beneficiary type</FormLabel>
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="state"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>State</FormLabel>
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                  </FormItem>
                )}
              />
            </div>
            <FormField
              control={form.control}
              name="cropId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Crop (optional)</FormLabel>
                  <CropPicker value={field.value} onChange={field.onChange} />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="benefitSummary"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Benefit summary</FormLabel>
                  <FormControl>
                    <Textarea rows={2} {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <div className="grid grid-cols-2 gap-3">
              <FormField
                control={form.control}
                name="applicationDeadline"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Deadline</FormLabel>
                    <FormControl>
                      <Input type="date" {...field} />
                    </FormControl>
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="source"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Source</FormLabel>
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <FormField
              control={form.control}
              name="officialUrl"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Official URL</FormLabel>
                  <FormControl>
                    <Input type="url" {...field} />
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
                {editing ? "Save changes" : "Create scheme"}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
