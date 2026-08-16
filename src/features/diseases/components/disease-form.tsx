"use client";

import { useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm, useWatch } from "react-hook-form";
import { z } from "zod";
import { Loader2Icon, XIcon } from "lucide-react";
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
import { Badge } from "@/shared/components/ui/badge";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/shared/components/ui/form";
import { CropPicker } from "@/shared/components/composite/crop-picker";
import { useCreateDisease, useUpdateDisease } from "../hooks/use-diseases";
import type { DiseaseDetail } from "../types/disease.types";

const diseaseFormSchema = z.object({
  name: z.string().min(1, "Required."),
  pathogenType: z.string().min(1, "Required."),
  severity: z.string().min(1, "Required."),
  symptoms: z.string().min(1, "Required."),
  treatment: z.string().min(1, "Required."),
  prevention: z.string().optional(),
  cropIds: z.array(z.string()).min(1, "Select at least one crop."),
  articleId: z.string().optional(),
});

type DiseaseFormValues = z.infer<typeof diseaseFormSchema>;

interface DiseaseFormProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  editing?: DiseaseDetail;
}

export function DiseaseForm({ open, onOpenChange, editing }: DiseaseFormProps) {
  const createDisease = useCreateDisease();
  const updateDisease = useUpdateDisease();
  const isPending = createDisease.isPending || updateDisease.isPending;
  const [cropPickerValue, setCropPickerValue] = useState<string | undefined>();

  const form = useForm<DiseaseFormValues>({
    resolver: zodResolver(diseaseFormSchema),
    values: editing
      ? {
          name: editing.name,
          pathogenType: editing.pathogenType,
          severity: editing.severity,
          symptoms: editing.symptoms,
          treatment: editing.treatment,
          prevention: editing.prevention,
          cropIds: editing.crops.map((c) => c.id),
          articleId: editing.article?.id,
        }
      : {
          name: "",
          pathogenType: "",
          severity: "",
          symptoms: "",
          treatment: "",
          cropIds: [],
        },
  });

  const selectedCropIds = useWatch({ control: form.control, name: "cropIds" });
  const selectedCropNames =
    editing?.crops.filter((c) => selectedCropIds.includes(c.id)) ?? [];

  function addCrop(cropId: string | undefined) {
    if (!cropId || selectedCropIds.includes(cropId)) return;
    form.setValue("cropIds", [...selectedCropIds, cropId], { shouldValidate: true });
    setCropPickerValue(undefined);
  }

  function removeCrop(cropId: string) {
    form.setValue(
      "cropIds",
      selectedCropIds.filter((id) => id !== cropId),
      { shouldValidate: true },
    );
  }

  function onSubmit(values: DiseaseFormValues) {
    const action = editing
      ? updateDisease.mutateAsync({ id: editing.id, payload: values })
      : createDisease.mutateAsync(values);

    action.then(() => {
      onOpenChange(false);
      form.reset();
    });
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[85vh] overflow-y-auto sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>{editing ? "Edit disease" : "Add disease"}</DialogTitle>
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
            <div className="grid grid-cols-2 gap-3">
              <FormField
                control={form.control}
                name="pathogenType"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Pathogen type</FormLabel>
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="severity"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Severity</FormLabel>
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
              name="symptoms"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Symptoms</FormLabel>
                  <FormControl>
                    <Textarea rows={2} {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="treatment"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Treatment</FormLabel>
                  <FormControl>
                    <Textarea rows={2} {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="prevention"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Prevention (optional)</FormLabel>
                  <FormControl>
                    <Textarea rows={2} {...field} />
                  </FormControl>
                </FormItem>
              )}
            />

            <FormItem>
              <FormLabel>Affected crops</FormLabel>
              <CropPicker
                value={cropPickerValue}
                onChange={addCrop}
                placeholder="Add a crop…"
              />
              {selectedCropNames.length > 0 && (
                <div className="flex flex-wrap gap-1.5 pt-1">
                  {selectedCropNames.map((crop) => (
                    <Badge key={crop.id} variant="secondary" className="gap-1">
                      {crop.name}
                      <button
                        type="button"
                        onClick={() => removeCrop(crop.id)}
                        aria-label={`Remove ${crop.name}`}
                      >
                        <XIcon className="size-3" />
                      </button>
                    </Badge>
                  ))}
                </div>
              )}
              {form.formState.errors.cropIds && (
                <p className="text-destructive text-sm font-medium">
                  {form.formState.errors.cropIds.message}
                </p>
              )}
            </FormItem>

            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
                Cancel
              </Button>
              <Button type="submit" disabled={isPending}>
                {isPending && <Loader2Icon className="animate-spin" />}
                {editing ? "Save changes" : "Create disease"}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
