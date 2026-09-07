import {
  createCodeLayer,
  createDocumentId,
  createIconLayer,
  createShapeLayer,
  createTextLayer,
  type BrandSettings,
  type FramePreset,
  type SlideDocument,
} from "../document";
import type { RoleContentDefaults } from "./content-defaults";
import type { TemplateLayoutId, TemplateRole } from "./template-definition";
import { contrastRatio } from "../preflight/color-contrast";

export interface LayoutContext {
  role: TemplateRole;
  content: RoleContentDefaults;
  brand: BrandSettings;
  frame: FramePreset;
}

type RoleLayoutFactory = (context: LayoutContext) => SlideDocument;

function slide(role: TemplateRole, layers: SlideDocument["layers"]): SlideDocument {
  return { id: createDocumentId("slide"), name: role.label, role: role.id, layers };
}

const coverLayout: RoleLayoutFactory = ({ role, content, brand, frame }) => {
  const { top, bottom, left, right } = frame.safeArea;
  const availableHeight = frame.height - top - bottom;
  const contentWidth = frame.width - left - right;
  return slide(role, [
    createIconLayer({
      name: "علامة الغلاف",
      x: frame.width / 2 - 60,
      y: top + availableHeight * 0.08,
      color: brand.colors.accent,
    }),
    createTextLayer({
      name: "العنوان الرئيسي",
      contentKey: "title",
      x: left,
      y: top + availableHeight * 0.3,
      width: contentWidth,
      height: Math.min(260, availableHeight * 0.25),
      content: content.title,
      fontFamilyId: brand.headingFontId,
      fontSize: 76,
      color: brand.colors.text,
    }),
    createTextLayer({
      name: "العنوان الفرعي",
      contentKey: "body",
      x: left + 40,
      y: top + availableHeight * 0.59,
      width: contentWidth - 80,
      height: Math.min(180, availableHeight * 0.17),
      content: content.body,
      fontFamilyId: brand.bodyFontId,
      fontSize: 36,
      fontWeight: 500,
      color: brand.colors.muted,
    }),
  ]);
};

const bodyLayout: RoleLayoutFactory = ({ role, content, brand, frame }) => {
  const { top, bottom, left, right } = frame.safeArea;
  const availableHeight = frame.height - top - bottom;
  const contentWidth = frame.width - left - right;
  return slide(role, [
    createTextLayer({
      name: "العنوان الرئيسي",
      contentKey: "title",
      x: left,
      y: top + availableHeight * 0.14,
      width: contentWidth,
      height: Math.min(220, availableHeight * 0.25),
      content: content.title,
      fontFamilyId: brand.headingFontId,
      fontSize: role.id.startsWith("step") ? 58 : 64,
      color: brand.colors.text,
    }),
    createTextLayer({
      name: "الوصف",
      contentKey: "body",
      x: left + 36,
      y: top + availableHeight * 0.49,
      width: contentWidth - 72,
      height: Math.min(300, availableHeight * 0.3),
      content: content.body,
      fontFamilyId: brand.bodyFontId,
      fontSize: 38,
      fontWeight: 500,
      lineHeight: 1.45,
      color: brand.colors.muted,
    }),
  ]);
};

const codeLayout: RoleLayoutFactory = ({ role, content, brand, frame }) => {
  const { top, bottom, left, right } = frame.safeArea;
  const availableHeight = frame.height - top - bottom;
  const contentWidth = frame.width - left - right;
  return slide(role, [
    createTextLayer({
      name: "العنوان الرئيسي",
      contentKey: "title",
      x: left,
      y: top + availableHeight * 0.08,
      width: contentWidth,
      height: Math.min(190, availableHeight * 0.2),
      content: content.title,
      fontFamilyId: brand.headingFontId,
      fontSize: 60,
      color: brand.colors.text,
    }),
    createCodeLayer({
      name: "بطاقة الكود",
      x: left,
      y: top + availableHeight * 0.38,
      width: contentWidth,
      height: Math.min(430, availableHeight * 0.42),
      code: content.code ?? "const result = await doSomething()",
      radius: brand.radius,
      background: brand.colors.codeBackground,
      color: brand.colors.codeText,
    }),
  ]);
};

const comparisonLayout: RoleLayoutFactory = ({ role, content, brand, frame }) => {
  const { top, bottom, left, right } = frame.safeArea;
  const availableHeight = frame.height - top - bottom;
  const contentWidth = frame.width - left - right;
  return slide(role, [
    createShapeLayer({
      name: "سطح المقارنة",
      contentKey: "surface",
      x: left,
      y: top + availableHeight * 0.08,
      width: contentWidth,
      height: availableHeight * 0.78,
      fill: brand.colors.accentSoft,
      stroke: brand.colors.accent,
      radius: brand.radius,
    }),
    createTextLayer({
      name: "العنوان الرئيسي",
      contentKey: "title",
      x: left + 48,
      y: top + availableHeight * 0.23,
      width: contentWidth - 96,
      height: 170,
      content: content.title,
      fontFamilyId: brand.headingFontId,
      fontSize: 68,
      color: brand.colors.text,
    }),
    createTextLayer({
      name: "الوصف",
      contentKey: "body",
      x: left + 68,
      y: top + availableHeight * 0.52,
      width: contentWidth - 136,
      height: 220,
      content: content.body,
      fontFamilyId: brand.bodyFontId,
      fontSize: 36,
      fontWeight: 500,
      color: brand.colors.muted,
    }),
  ]);
};

const ctaLayout: RoleLayoutFactory = ({ role, content, brand, frame }) => {
  const { top, bottom, left, right } = frame.safeArea;
  const availableHeight = frame.height - top - bottom;
  const contentWidth = frame.width - left - right;
  return slide(role, [
    createTextLayer({
      name: "الخلاصة",
      contentKey: "title",
      x: left,
      y: top + availableHeight * 0.27,
      width: contentWidth,
      height: 220,
      content: content.title,
      fontFamilyId: brand.headingFontId,
      fontSize: 70,
      color: brand.colors.text,
    }),
    createTextLayer({
      name: "الدعوة للفعل",
      contentKey: "body",
      x: left + 40,
      y: top + availableHeight * 0.6,
      width: contentWidth - 80,
      height: 180,
      content: content.body,
      fontFamilyId: brand.bodyFontId,
      fontSize: 44,
      fontWeight: 600,
      color: contrastRatio(brand.colors.accent, brand.colors.background) >= 3 ? brand.colors.accent : brand.colors.text,
    }),
  ]);
};

const ROLE_LAYOUTS: Record<TemplateLayoutId, RoleLayoutFactory> = {
  cover: coverLayout,
  body: bodyLayout,
  code: codeLayout,
  comparison: comparisonLayout,
  cta: ctaLayout,
};

export function createSlideFromTemplateRole(context: LayoutContext): SlideDocument {
  return ROLE_LAYOUTS[context.role.layout](context);
}
