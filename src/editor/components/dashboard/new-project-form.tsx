"use client";

import { ArrowLeft } from "lucide-react";
import { useState } from "react";
import { useForm, useWatch } from "react-hook-form";
import { z } from "zod";

import { FRAME_PRESETS, type FramePresetId } from "@/core/document";
import { listTemplates } from "@/core/templates";
import { Button, Input, Label } from "@/shared/ui";

const formSchema = z.object({
  name: z.string().trim().min(2, "اكتب اسماً أوضح للمشروع.").max(80),
  templateId: z.string().min(1),
  framePresetId: z.enum(["square", "portrait", "story"]),
});

export type NewProjectValues = z.infer<typeof formSchema>;

interface NewProjectFormProps {
  onCreate: (values: NewProjectValues) => Promise<void>;
}

export function NewProjectForm({ onCreate }: NewProjectFormProps) {
  const templates = listTemplates();
  const [formError, setFormError] = useState<string | null>(null);
  const { register, handleSubmit, control, setValue, formState } = useForm<NewProjectValues>({
    defaultValues: { name: "كاروسيل عربي جديد", templateId: templates[0]?.id ?? "tech-explainer", framePresetId: "square" },
  });
  const templateId = useWatch({ control, name: "templateId" });
  const framePresetId = useWatch({ control, name: "framePresetId" });

  return (
    <form className="space-y-8" onSubmit={handleSubmit(async (rawValues) => {
      const parsed = formSchema.safeParse(rawValues);
      if (!parsed.success) {
        setFormError(parsed.error.issues[0]?.message ?? "راجع بيانات المشروع.");
        return;
      }
      setFormError(null);
      await onCreate(parsed.data);
    })}>
      <div className="max-w-2xl">
        <Label htmlFor="project-name">اسم المشروع</Label>
        <Input id="project-name" autoComplete="off" className="h-12 text-base" {...register("name")} />
      </div>

      <fieldset>
        <legend className="mb-3 text-sm font-black text-primary">القالب</legend>
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5">
          {templates.map((template) => (
            <button key={template.id} type="button" aria-pressed={templateId === template.id} onClick={() => setValue("templateId", template.id)} className={`min-h-36 rounded-2xl border p-4 text-right outline-none transition focus-visible:ring-2 focus-visible:ring-brand-ring ${templateId === template.id ? "border-brand-accent bg-brand-accent-soft ring-2 ring-brand-accent/25" : "border-brand-border bg-surface-strong hover:-translate-y-0.5 hover:border-primary/25"}`}>
              <span className={`mb-4 grid size-9 place-items-center rounded-xl text-sm font-black ${templateId === template.id ? "bg-primary text-white" : "bg-stone-100 text-primary"}`} dir="ltr">{template.icon}</span>
              <strong className="block text-sm text-primary">{template.name}</strong>
              <span className="mt-1 block text-xs leading-5 text-brand-muted">{template.description}</span>
            </button>
          ))}
        </div>
      </fieldset>

      <fieldset>
        <legend className="mb-3 text-sm font-black text-primary">مقاس الإطار</legend>
        <div className="flex flex-wrap gap-2">
          {(Object.values(FRAME_PRESETS) as Array<(typeof FRAME_PRESETS)[FramePresetId]>).map((preset) => (
            <button key={preset.id} type="button" aria-pressed={framePresetId === preset.id} onClick={() => setValue("framePresetId", preset.id)} className={`flex min-w-36 items-center gap-3 rounded-xl border px-4 py-3 text-sm font-semibold outline-none transition focus-visible:ring-2 focus-visible:ring-brand-ring ${framePresetId === preset.id ? "border-primary bg-primary text-white" : "border-brand-border bg-surface-strong text-brand-muted hover:border-primary/25"}`}>
              <span className={`block rounded-sm border ${framePresetId === preset.id ? "border-brand-accent bg-brand-accent/20" : "border-current"}`} style={{ width: preset.width >= preset.height ? 18 : 18 * (preset.width / preset.height), height: preset.height >= preset.width ? 18 : 18 * (preset.height / preset.width) }} />
              {preset.label}
            </button>
          ))}
        </div>
      </fieldset>

      <input type="hidden" {...register("templateId")} />
      <input type="hidden" {...register("framePresetId")} />
      {formError ? <p className="text-sm font-semibold text-red-600">{formError}</p> : null}
      <Button type="submit" variant="accent" disabled={formState.isSubmitting} className="h-12 w-full px-6 sm:w-auto">
        {formState.isSubmitting ? "جارٍ الإنشاء…" : "إنشاء وفتح المحرر"}
        {!formState.isSubmitting ? <ArrowLeft /> : null}
      </Button>
    </form>
  );
}
