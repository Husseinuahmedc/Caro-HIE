import { z } from "zod";

import {
  CURRENT_SCHEMA_VERSION,
  MAX_SLIDES,
  type GroupLayer,
  type Layer,
  type ProjectDocument,
} from "./types";

const colorSchema = z.string().regex(/^#[0-9a-f]{6}$/i, "Expected a six-digit hex color");
const finiteNumber = z.number().finite();

const layerBaseSchema = z.object({
  id: z.string().min(1),
  name: z.string().min(1),
  x: finiteNumber,
  y: finiteNumber,
  width: finiteNumber.positive(),
  height: finiteNumber.positive(),
  rotation: finiteNumber,
  opacity: finiteNumber.min(0).max(1),
  visible: z.boolean(),
  locked: z.boolean(),
});

export const textLayerSchema = layerBaseSchema.extend({
  type: z.literal("text"),
  content: z.string(),
  direction: z.enum(["rtl", "ltr"]),
  align: z.enum(["right", "center", "left"]),
  verticalAlign: z.enum(["top", "middle", "bottom"]),
  fontFamilyId: z.string().min(1),
  fontSize: finiteNumber.min(8).max(400),
  fontWeight: z.number().int().min(100).max(900),
  lineHeight: finiteNumber.min(0.7).max(3),
  letterSpacing: finiteNumber.min(-20).max(100),
  color: colorSchema,
  contentKey: z.enum(["title", "body"]).optional(),
});

export const codeLayerSchema = layerBaseSchema.extend({
  type: z.literal("code"),
  code: z.string(),
  language: z.string().min(1),
  fontFamilyId: z.string().min(1),
  fontSize: finiteNumber.min(8).max(200),
  lineHeight: finiteNumber.min(0.7).max(3),
  padding: finiteNumber.min(0).max(240),
  radius: finiteNumber.min(0).max(240),
  background: colorSchema,
  color: colorSchema,
});

export const shapeLayerSchema = layerBaseSchema.extend({
  type: z.literal("shape"),
  shape: z.enum(["rect", "circle", "line"]),
  fill: colorSchema,
  stroke: colorSchema,
  strokeWidth: finiteNumber.min(0).max(100),
  radius: finiteNumber.min(0).max(500),
  contentKey: z.literal("surface").optional(),
});

export const iconLayerSchema = layerBaseSchema.extend({
  type: z.literal("icon"),
  icon: z.string().min(1),
  color: colorSchema,
  fontSize: finiteNumber.min(8).max(500),
});

export const imageLayerSchema = layerBaseSchema.extend({
  type: z.literal("image"),
  assetId: z.string().min(1).nullable(),
  alt: z.string(),
  fit: z.enum(["cover", "contain"]),
  radius: finiteNumber.min(0).max(500),
});

const groupLayerSchema: z.ZodType<GroupLayer> = layerBaseSchema.extend({
  type: z.literal("group"),
  children: z.lazy(() => z.array(layerSchema).min(1)),
});

export const layerSchema: z.ZodType<Layer> = z.lazy(() =>
  z.union([
    textLayerSchema,
    codeLayerSchema,
    shapeLayerSchema,
    iconLayerSchema,
    imageLayerSchema,
    groupLayerSchema,
  ]),
) as z.ZodType<Layer>;

export const brandColorsSchema = z.object({
  background: colorSchema,
  surface: colorSchema,
  accent: colorSchema,
  accentSoft: colorSchema,
  text: colorSchema,
  muted: colorSchema,
  codeBackground: colorSchema,
  codeText: colorSchema,
  border: colorSchema,
});

export const brandSettingsSchema = z.object({
  colors: brandColorsSchema,
  headingFontId: z.string().min(1),
  bodyFontId: z.string().min(1),
  codeFontId: z.string().min(1),
  radius: finiteNumber.min(0).max(240),
});

export const contentPlanSchema = z.object({
  goal: z.string(),
  audience: z.string(),
  hook: z.string(),
  tone: z.string(),
  slides: z.array(
    z.object({
      id: z.string().min(1),
      role: z.string().min(1),
      label: z.string().min(1),
      hint: z.string(),
      title: z.string(),
      body: z.string(),
      code: z.string().optional(),
    }),
  ),
});

export const projectDocumentSchema: z.ZodType<ProjectDocument> = z.object({
  schemaVersion: z.literal(CURRENT_SCHEMA_VERSION),
  id: z.string().min(1),
  name: z.string().min(1),
  series: z.string(),
  framePresetId: z.enum(["square", "portrait", "story"]),
  templateId: z.string().min(1),
  brandKitId: z.string().min(1).nullable(),
  brand: brandSettingsSchema,
  slides: z
    .array(
      z.object({
        id: z.string().min(1),
        name: z.string().min(1),
        role: z.string().optional(),
        layers: z.array(layerSchema),
      }),
    )
    .min(1)
    .max(MAX_SLIDES),
  contentPlan: contentPlanSchema,
  revision: z.number().int().nonnegative(),
  createdAt: z.string().datetime(),
  updatedAt: z.string().datetime(),
});

export function parseProjectDocument(input: unknown): ProjectDocument {
  return projectDocumentSchema.parse(input);
}

export function validateProjectDocument(input: unknown) {
  return projectDocumentSchema.safeParse(input);
}
