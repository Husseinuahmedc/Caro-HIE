export const CURRENT_SCHEMA_VERSION = 4 as const;
export const MAX_SLIDES = 9 as const;

export const CODE_LANGUAGES = [
  "typescript",
  "tsx",
  "javascript",
  "jsx",
  "json",
  "html",
  "css",
  "sql",
  "python",
  "bash",
  "text",
] as const;
export const CODE_THEMES = ["midnight", "github-dark", "sand", "paper"] as const;
export const ICON_NAMES = [
  "sparkles",
  "star",
  "heart",
  "circle-check",
  "circle-x",
  "circle-alert",
  "info",
  "lightbulb",
  "zap",
  "rocket",
  "code-xml",
  "terminal",
  "database",
  "server",
  "shield-check",
  "lock",
  "user",
  "users",
  "mail",
  "phone",
  "globe",
  "link",
  "camera",
  "image",
  "play",
  "download",
  "upload",
  "settings",
  "search",
  "house",
  "calendar",
  "clock",
  "arrow-right",
  "arrow-left",
  "arrow-up",
  "arrow-down",
] as const;

export type FramePresetId = "square" | "portrait" | "story";
export type TextDirection = "rtl" | "ltr";
export type TextAlignment = "right" | "center" | "left";
export type VerticalAlignment = "top" | "middle" | "bottom";
export type ImageFit = "cover" | "contain";
export type ShapeKind = "rect" | "circle" | "line";
export type CodeLanguage = (typeof CODE_LANGUAGES)[number];
export type CodeThemeId = (typeof CODE_THEMES)[number];
export type IconName = (typeof ICON_NAMES)[number];

export interface LayerBase {
  id: string;
  name: string;
  x: number;
  y: number;
  width: number;
  height: number;
  rotation: number;
  opacity: number;
  visible: boolean;
  locked: boolean;
}

export interface TextLayer extends LayerBase {
  type: "text";
  content: string;
  direction: TextDirection;
  align: TextAlignment;
  verticalAlign: VerticalAlignment;
  fontFamilyId: string;
  fontSize: number;
  fontWeight: number;
  lineHeight: number;
  letterSpacing: number;
  color: string;
  contentKey?: "title" | "body";
}

export interface CodeLayer extends LayerBase {
  type: "code";
  code: string;
  language: CodeLanguage;
  theme: CodeThemeId;
  showLineNumbers: boolean;
  highlightedLines: number[];
  fontFamilyId: string;
  fontSize: number;
  lineHeight: number;
  padding: number;
  radius: number;
  background: string;
  color: string;
}

export interface ShapeLayer extends LayerBase {
  type: "shape";
  shape: ShapeKind;
  fill: string;
  stroke: string;
  strokeWidth: number;
  radius: number;
  contentKey?: "surface";
}

export interface IconLayer extends LayerBase {
  type: "icon";
  icon: IconName;
  color: string;
  fill: string;
  strokeWidth: number;
  fontSize: number;
}

export interface ImageLayer extends LayerBase {
  type: "image";
  assetId: string | null;
  alt: string;
  fit: ImageFit;
  radius: number;
}

export interface GroupLayer extends LayerBase {
  type: "group";
  children: Layer[];
}

export type Layer =
  | TextLayer
  | CodeLayer
  | ShapeLayer
  | IconLayer
  | ImageLayer
  | GroupLayer;

export interface SlideDocument {
  id: string;
  name: string;
  role?: string;
  /** Back-to-front paint order: index 0 is the backmost layer. */
  layers: Layer[];
}

export interface BrandColors {
  background: string;
  surface: string;
  accent: string;
  accentSoft: string;
  text: string;
  muted: string;
  codeBackground: string;
  codeText: string;
  border: string;
}

export interface BrandSettings {
  colors: BrandColors;
  headingFontId: string;
  bodyFontId: string;
  codeFontId: string;
  radius: number;
}

export interface ContentPlanSlide {
  id: string;
  role: string;
  label: string;
  hint: string;
  title: string;
  body: string;
  code?: string;
}

export interface ContentPlan {
  goal: string;
  audience: string;
  hook: string;
  tone: string;
  slides: ContentPlanSlide[];
}

export interface ProjectDocument {
  schemaVersion: typeof CURRENT_SCHEMA_VERSION;
  id: string;
  name: string;
  series: string;
  framePresetId: FramePresetId;
  templateId: string;
  brandKitId: string | null;
  brand: BrandSettings;
  slides: SlideDocument[];
  contentPlan: ContentPlan;
  revision: number;
  createdAt: string;
  updatedAt: string;
}

export interface FramePreset {
  id: FramePresetId;
  label: string;
  width: number;
  height: number;
  safeArea: { top: number; right: number; bottom: number; left: number };
}
