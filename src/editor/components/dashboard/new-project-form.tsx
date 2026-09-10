"use client";

import { ArrowLeft } from "lucide-react";
import { useState } from "react";
import { useForm, useWatch } from "react-hook-form";
import { z } from "zod";

import { FRAME_PRESETS, type FramePresetId } from "@/core/document";
import { blankTemplate, listTemplates } from "@/core/templates";
import { TemplatePreview } from "./template-preview";

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
  const templates = [...listTemplates(), blankTemplate];
  const [formError, setFormError] = useState<string | null>(null);
  const { register, handleSubmit, control, setValue, formState } = useForm<NewProjectValues>({
    defaultValues: { name: "كاروسيل عربي جديد", templateId: templates[0]?.id ?? "tech-explainer", framePresetId: "square" },
  });
  const templateId = useWatch({ control, name: "templateId" });
  const framePresetId = useWatch({ control, name: "framePresetId" });

  return (
    <form
      className="space-y-5"
      onSubmit={handleSubmit(async (rawValues) => {
        const parsed = formSchema.safeParse(rawValues);
        if (!parsed.success) {
          setFormError(parsed.error.issues[0]?.message ?? "راجع بيانات المشروع.");
          return;
        }
        setFormError(null);
        try { await onCreate(parsed.data); }
        catch { setFormError("تعذر إنشاء المشروع. قد يكون التخزين ممتلئاً؛ نزّل نسخة من مشاريعك ثم أعد المحاولة."); }
      })}
    >
      <label htmlFor="project-name" className="flex flex-col gap-3 border-b border-brand-border pb-4 sm:flex-row sm:items-center sm:justify-between">
        <span className="text-sm font-black text-primary">اسم المشروع</span>
        <input
          id="project-name"
          autoComplete="off"
          className="min-w-0 rounded-lg border border-brand-border bg-surface-strong px-3 py-2 text-right text-base font-semibold text-primary focus-visible:ring-2 focus-visible:ring-brand-ring sm:w-2/3"
          {...register("name")}
        />
      </label>

      <fieldset>
        <legend className="mb-4 text-sm font-black text-primary">بنية المحتوى</legend>
        <div className="grid grid-cols-2 gap-2 sm:grid-cols-3 lg:grid-cols-6">
          {templates.map((template) => {
            const selected = templateId === template.id;
            return (
              <button
                key={template.id}
                type="button"
                aria-pressed={selected}
                onClick={() => setValue("templateId", template.id)}
                className={`group flex min-h-28 flex-col gap-2 rounded-lg border p-3 text-right outline-none transition focus-visible:ring-2 focus-visible:ring-brand-ring ${selected ? "border-primary bg-primary text-white" : "border-brand-border bg-surface-strong text-primary hover:bg-surface"}`}
              >
                <span className={`text-xl font-black ${selected ? "text-brand-accent" : "text-[#d96d4a]"}`} dir="ltr">
                  {template.icon}
                </span>
                <span className="mt-auto">
                  <strong className="block text-base font-black">{template.name}</strong>
                  <span className={`mt-2 hidden text-sm leading-5 sm:block ${selected ? "text-white/80" : "text-brand-muted"}`}>
                    {template.description}
                  </span>
                </span>
              </button>
            );
          })}
        </div>
      </fieldset>
      <div className="overflow-hidden border-y border-brand-border py-2">
        <p className="text-sm text-brand-muted">
          معاينة {templates.find((template) => template.id === templateId)?.name} ·{" "}
          {templateId === "blank"
            ? "شريحة واحدة فارغة"
            : `${templates.find((template) => template.id === templateId)?.roles.length} شرائح قابلة للتعديل`}
        </p>
        <TemplatePreview templateId={templateId} framePresetId={framePresetId} />
      </div>

      <div className="flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
        <fieldset>
          <legend className="sr-only">مقاس الإطار</legend>
          <div className="flex flex-wrap gap-2">
            {(Object.values(FRAME_PRESETS) as Array<(typeof FRAME_PRESETS)[FramePresetId]>).map((preset) => {
              const selected = framePresetId === preset.id;
              return (
                <button
                  key={preset.id}
                  type="button"
                  aria-pressed={selected}
                  onClick={() => setValue("framePresetId", preset.id)}
                  className={`flex h-12 items-center gap-2 rounded-md border px-4 text-xs font-semibold outline-none transition focus-visible:ring-2 focus-visible:ring-brand-ring ${selected ? "border-primary bg-brand-accent-soft text-primary" : "border-brand-border bg-surface-strong text-brand-muted hover:border-primary/30"}`}
                >
                  <span
                    className="block rounded-[2px] border border-current"
                    style={{
                      width: preset.width >= preset.height ? 16 : 16 * (preset.width / preset.height),
                      height: preset.height >= preset.width ? 16 : 16 * (preset.height / preset.width),
                    }}
                  />
                  {preset.label}
                </button>
              );
            })}
          </div>
        </fieldset>

        <button
          type="submit"
          disabled={formState.isSubmitting}
          className="inline-flex h-[52px] items-center justify-center gap-2 rounded-lg bg-brand-accent px-6 text-sm font-black text-primary transition hover:-translate-y-0.5 hover:bg-[#22e3ec] disabled:pointer-events-none disabled:opacity-50"
        >
          {formState.isSubmitting
            ? "جارٍ الإنشاء…"
            : templateId === "blank"
              ? "إنشاء وبدء التصميم"
              : "إنشاء وكتابة المحتوى"}
          {!formState.isSubmitting ? <ArrowLeft className="size-4" /> : null}
        </button>
      </div>

      <input type="hidden" {...register("templateId")} />
      <input type="hidden" {...register("framePresetId")} />
      {formError ? <p className="text-sm font-semibold text-red-600">{formError}</p> : null}
    </form>
  );
}
