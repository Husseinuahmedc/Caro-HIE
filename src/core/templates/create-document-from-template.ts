import {
  CURRENT_SCHEMA_VERSION,
  DEFAULT_BRAND_SETTINGS,
  createDocumentId,
  getFramePreset,
  type BrandSettings,
  type ContentPlan,
  type FramePresetId,
  type ProjectDocument,
} from "../document";
import {
  createFamilyBrand,
  createFamilySlide,
  getFamilyContentDefaults,
} from "./visual-families";
import type { TemplateRole } from "./template-definition";
import { getTemplateContentDefaults } from "./content-defaults";
import { getTemplate } from "./registry";
import { createSlideFromTemplateRole } from "./role-layouts";

export interface CreateProjectFromTemplateOptions {
  name?: string;
  series?: string;
  framePresetId?: FramePresetId;
  brand?: BrandSettings;
  brandKitId?: string | null;
  slideCount?: number;
  visualFamilyId?: string;
  customFrame?: { width: number; height: number };
  /** Gallery samples only; project content always comes from its outline. */
  exampleContent?: boolean;
}

export function createDocumentFromTemplate(
  templateId: string,
  options: CreateProjectFromTemplateOptions = {},
): ProjectDocument {
  const template = getTemplate(templateId);
  const brand = structuredClone(
    options.brand ??
      (options.visualFamilyId
        ? createFamilyBrand(options.visualFamilyId)
        : DEFAULT_BRAND_SETTINGS),
  );
  const count = options.slideCount ?? template.roles.length;
  if (!Number.isSafeInteger(count) || count < 1)
    throw new Error("عدد الشرائح يجب أن يكون عدداً صحيحاً موجباً.");
  const middle = template.roles.slice(1, -1);
  const roles: TemplateRole[] =
    options.slideCount === undefined
      ? template.roles
      : Array.from({ length: count }, (_, index) => {
          const original =
            index === 0
              ? template.roles[0]!
              : index === count - 1
                ? template.roles.at(-1)!
                : (middle[(index - 1) % Math.max(1, middle.length)] ??
                  template.roles[0]!);
          return original;
        });
  const framePresetId = options.framePresetId ?? "square";
  const frame = getFramePreset(framePresetId, options.customFrame);
  const isBlank = templateId === "blank";
  const contents = roles.map((role, index) => {
    if (isBlank) return { title: "", body: "" };
    const content = options.exampleContent && options.visualFamilyId
      ? getFamilyContentDefaults(options.visualFamilyId, role)
      : getTemplateContentDefaults(template.id, role.id, index);
    // The developer composition has a code region on each slide.
    if (options.visualFamilyId === "developer" && content.code === undefined)
      content.code = "const data =\n  await fetchData();\nconsole.log(data);";
    return content;
  });
  const plan: ContentPlan = {
    goal: isBlank ? "تصميم حر" : "شرح الفكرة بدون حشو",
    audience: isBlank ? "الجمهور" : "صنّاع المحتوى والمطورون العرب",
    hook: isBlank ? "" : contents[0]!.title,
    tone: "واضح ومباشر",
    slides: roles.map((role, index) => ({
      id: role.id,
      role: isBlank ? "custom" : role.id,
      label: isBlank ? `شريحة ${index + 1}` : role.label,
      hint: role.hint,
      ...contents[index]!,
    })),
  };
  const now = new Date().toISOString();
  const result: ProjectDocument = {
    schemaVersion: CURRENT_SCHEMA_VERSION,
    id: createDocumentId("project"),
    name: options.name?.trim() || `${template.name} جديد`,
    series: options.series?.trim() || "سلسلة جديدة",
    framePresetId,
    templateId: template.id,
    ...(options.visualFamilyId
      ? { visualFamilyId: options.visualFamilyId }
      : {}),
    ...(options.customFrame ? { customFrame: options.customFrame } : {}),
    brandKitId: options.brandKitId ?? null,
    brand,
    slides: isBlank
      ? roles.map((_, index) => ({
          id: createDocumentId("slide"),
          name: `شريحة ${index + 1}`,
          role: "custom",
          layers: [],
        }))
      : roles.map((role, index) =>
          options.visualFamilyId
            ? createFamilySlide(
                options.visualFamilyId,
                role,
                contents[index]!,
                brand,
                frame,
                index,
                count,
              )
            : createSlideFromTemplateRole({
                role,
                content: contents[index]!,
                brand,
                frame,
              }),
        ),
    contentPlan: plan,
    revision: 0,
    createdAt: now,
    updatedAt: now,
  };
  result.contentPlan.slides = result.slides.map((slide, index) => ({
    ...(plan.slides[index] ?? {
      role: slide.role ?? "custom",
      label: slide.name,
      hint: "",
      title: "",
      body: "",
    }),
    id: slide.id,
  }));
  return result;
}
