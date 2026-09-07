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
import { getRoleContentDefaults } from "./content-defaults";
import { getTemplate } from "./registry";
import { createSlideFromTemplateRole } from "./role-layouts";

export interface CreateProjectFromTemplateOptions {
  name?: string;
  series?: string;
  framePresetId?: FramePresetId;
  brand?: BrandSettings;
  brandKitId?: string | null;
}

export function createDocumentFromTemplate(
  templateId: string,
  options: CreateProjectFromTemplateOptions = {},
): ProjectDocument {
  const template = getTemplate(templateId);
  const brand = structuredClone(options.brand ?? DEFAULT_BRAND_SETTINGS);
  const framePresetId = options.framePresetId ?? "square";
  const frame = getFramePreset(framePresetId);
  const plan: ContentPlan = {
    goal: "شرح الفكرة بدون حشو",
    audience: "صنّاع المحتوى والمطورون العرب",
    hook: "ماذا يحدث فعلياً؟",
    tone: "واضح ومباشر",
    slides: template.roles.map((role, index) => ({
      id: role.id,
      role: role.id,
      label: role.label,
      hint: role.hint,
      ...getRoleContentDefaults(role.id, index),
    })),
  };
  const now = new Date().toISOString();
  return {
    schemaVersion: CURRENT_SCHEMA_VERSION,
    id: createDocumentId("project"),
    name: options.name?.trim() || `${template.name} جديد`,
    series: options.series?.trim() || "سلسلة جديدة",
    framePresetId,
    templateId: template.id,
    brandKitId: options.brandKitId ?? null,
    brand,
    slides: template.roles.map((role, index) =>
      createSlideFromTemplateRole({
        role,
        content: getRoleContentDefaults(role.id, index),
        brand,
        frame,
      }),
    ),
    contentPlan: plan,
    revision: 0,
    createdAt: now,
    updatedAt: now,
  };
}
