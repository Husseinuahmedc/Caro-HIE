"use client";
import { useMemo, useState } from "react";
import { z } from "zod";
import { FRAME_PRESETS, type FramePresetId } from "@/core/document";
import {
  createDocumentFromTemplate,
  listTemplates,
  getTemplate,
  getVisualFamily,
} from "@/core/templates";
import { Button, Input, Label, Select } from "@/shared/ui";
import { ArtworkPreview } from "./artwork-preview";

const formSchema = z.object({
  name: z.string().trim().min(2, "اكتب اسماً أوضح للمشروع.").max(80),
  templateId: z.string().min(1),
  visualFamilyId: z.string().optional(),
  framePresetId: z.enum([
    "square",
    "portrait",
    "portrait34",
    "story",
    "custom",
  ]),
  slideCount: z
    .number()
    .int()
    .positive()
    .refine(Number.isSafeInteger, "أدخل عدداً صحيحاً موجباً."),
  width: z.number().int().min(64).max(8192),
  height: z.number().int().min(64).max(8192),
});
export type NewProjectValues = z.infer<typeof formSchema>;
export function NewProjectForm({
  onCreate,
  visualFamilyId,
  onBack,
}: {
  onCreate: (values: NewProjectValues) => Promise<void>;
  visualFamilyId?: string;
  onBack?: () => void;
}) {
  const [name, setName] = useState("كاروسيل عربي جديد"),
    [templateId, setTemplateId] = useState(
      visualFamilyId ? "tech-explainer" : "blank",
    ),
    [framePresetId, setFrame] = useState<FramePresetId>("portrait"),
    [slideCount, setCount] = useState(visualFamilyId ? "6" : "1"),
    [countEdited, setCountEdited] = useState(false),
    [width, setWidth] = useState(1080),
    [height, setHeight] = useState(1350),
    [busy, setBusy] = useState(false),
    [error, setError] = useState("");
  const family = getVisualFamily(visualFamilyId);
  const validCount = Number(slideCount);
  const previewCount = Number.isSafeInteger(validCount) && validCount > 0 ? validCount : 1;
  // Render one cover even for very large counts; numbering reflects the chosen total.
  const preview = useMemo(
    () => createDocumentFromTemplate(templateId, {
      visualFamilyId,
      framePresetId,
      ...(framePresetId === "custom"
        ? { customFrame: {
            width: Math.min(8192, Math.max(64, Math.round(width) || 64)),
            height: Math.min(8192, Math.max(64, Math.round(height) || 64)),
          } }
        : {}),
      slideCount: 1,
    }),
    [templateId, visualFamilyId, framePresetId, width, height],
  );
  return (
    <div className="grid items-start gap-8 lg:grid-cols-2 lg:gap-16">
      <form
        className="space-y-6"
        onSubmit={async (event) => {
          event.preventDefault();
          const parsed = formSchema.safeParse({
            name,
            templateId,
            visualFamilyId,
            framePresetId,
            slideCount: Number(slideCount),
            width: framePresetId === "custom" ? width : 1080,
            height: framePresetId === "custom" ? height : 1350,
          });
          if (!parsed.success) {
            setError(parsed.error.issues[0]?.message ?? "راجع بيانات المشروع.");
            return;
          }
          setBusy(true);
          setError("");
          try {
            await onCreate(parsed.data);
          } catch {
            setError(
              "تعذر إنشاء المشروع. جرّب عدداً أقل من الشرائح أو حرّر مساحة التخزين، ثم أعد المحاولة.",
            );
          } finally {
            setBusy(false);
          }
        }}
      >
        <div>
          <Button type="button" variant="ghost" onClick={onBack}>
            العودة إلى القوالب
          </Button>
          <h1 className="mt-4 text-3xl font-bold">ابدأ السلسلة بطريقتك.</h1>
          <p className="mt-3 text-brand-muted">
            {visualFamilyId ? family.name : "تصميم فارغ"} · يمكنك تعديل العدد
            والتصميم لاحقاً.
          </p>
        </div>
        <div>
          <Label htmlFor="project-name">اسم المشروع</Label>
          <Input
            id="project-name"
            value={name}
            maxLength={80}
            onChange={(event) => setName(event.target.value)}
          />
        </div>
        <fieldset>
          <legend className="mb-3 font-bold">مقاس المنشور</legend>
          <div className="flex flex-wrap gap-2">
            {Object.values(FRAME_PRESETS).map((preset) => (
              <Button
                key={preset.id}
                type="button"
                variant="secondary"
                aria-pressed={framePresetId === preset.id}
                onClick={() => setFrame(preset.id)}
              >
                {preset.label}
              </Button>
            ))}
          </div>
        </fieldset>
        {framePresetId === "custom" ? (
          <div className="grid grid-cols-2 gap-4">
            <label>
              العرض بالبكسل
              <Input
                type="number"
                min={64}
                max={8192}
                value={width}
                onChange={(event) => setWidth(Number(event.target.value))}
                dir="ltr"
              />
            </label>
            <label>
              الارتفاع بالبكسل
              <Input
                type="number"
                min={64}
                max={8192}
                value={height}
                onChange={(event) => setHeight(Number(event.target.value))}
                dir="ltr"
              />
            </label>
          </div>
        ) : null}
        <div>
          <Label htmlFor="slide-count">عدد الشرائح</Label>
          <Input
            id="slide-count"
            type="number"
            min={1}
            step={1}
            value={slideCount}
            onChange={(event) => {
              setCount(event.target.value);
              setCountEdited(true);
            }}
            dir="ltr"
          />
          <p className="mt-2 text-sm text-brand-muted">
            اختر العدد الذي تحتاجه، ويشمل الغلاف والخاتمة. لا يوجد حد ثابت
            للمشروع.
          </p>
        </div>
        <div>
          <Label htmlFor="content-outline">بنية المحتوى</Label>
          <Select
            id="content-outline"
            aria-describedby="content-outline-help"
            value={templateId}
            onChange={(event) => {
              const id = event.target.value;
              setTemplateId(id);
              if (!countEdited) setCount(String(getTemplate(id).roles.length));
            }}
          >
            <option value="blank">بدون محتوى — تصميم فارغ</option>
            {listTemplates().map((template) => (
              <option key={template.id} value={template.id}>
                {template.name}
              </option>
            ))}
          </Select>
          <p id="content-outline-help" className="mt-2 text-sm text-brand-muted">
            البنية ترتّب أفكارك؛ القالب يحدد شكلها.
            {" "}{getTemplate(templateId).description}
          </p>
        </div>
        {error ? (
          <p role="alert" className="text-red-800">
            {error}
          </p>
        ) : null}
        <Button type="submit" disabled={busy} className="min-h-12 w-full">
          {busy
            ? "جارٍ الإنشاء…"
            : templateId === "blank"
              ? "إنشاء وبدء التصميم"
              : "إنشاء وكتابة المحتوى"}
        </Button>
      </form>
      <aside className="bg-[#E9ECE5] p-6 sm:p-8">
        <div className="mx-auto max-w-[380px]">
          <ArtworkPreview document={preview} totalSlides={previewCount} />
        </div>
        <p className="mt-4 text-center text-sm text-brand-muted">
          معاينة الغلاف · عدد الشرائح: {previewCount} · النصوص قابلة للتعديل
        </p>
      </aside>
    </div>
  );
}
