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
import { getRoleContentDefaults } from "./content-defaults";
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
          return {
            ...original,
            id:
              index === 0 || index === count - 1
                ? original.id
                : `${original.id}-${index}`,
            label:
              index === 0 || index === count - 1
                ? original.label
                : `${original.label} ${index}`,
          };
        });
  const framePresetId = options.framePresetId ?? "square";
  const frame = getFramePreset(framePresetId, options.customFrame);
  const isBlank = templateId === "blank";
  const plan: ContentPlan = isBlank
    ? {
        goal: "تصميم حر",
        audience: "الجمهور",
        hook: "",
        tone: "مباشر",
        slides: [
          {
            id: "blank-slide",
            role: "custom",
            label: "شريحة 1",
            hint: "شريحة فارغة",
            title: "",
            body: "",
          },
        ],
      }
    : {
        goal: "شرح الفكرة بدون حشو",
        audience: "صنّاع المحتوى والمطورون العرب",
        hook: "ماذا يحدث فعلياً؟",
        tone: "واضح ومباشر",
        slides: roles.map((role, index) => ({
          id: role.id,
          role: role.id,
          label: role.label,
          hint: role.hint,
          ...getRoleContentDefaults(
            template.roles.find((candidate) => candidate.id === role.id)?.id ??
              role.id.replace(/-\d+$/, ""),
            index,
          ),
        })),
      };
  const roleContent = (role: TemplateRole, index: number) =>
    options.visualFamilyId
      ? getFamilyContentDefaults(options.visualFamilyId, role)
      : getRoleContentDefaults(
          template.roles.find((candidate) => candidate.id === role.id)?.id ??
            role.id.replace(/-\d+$/, ""),
          index,
        );
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
                roleContent(role, index),
                brand,
                frame,
                index,
                count,
              )
            : createSlideFromTemplateRole({
                role,
                content: getRoleContentDefaults(
                  template.roles.find((candidate) => candidate.id === role.id)
                    ?.id ?? role.id.replace(/-\d+$/, ""),
                  index,
                ),
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
