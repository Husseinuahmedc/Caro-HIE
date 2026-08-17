import { applyBrandSettings, BUILT_IN_BRAND_KITS } from "@/brand";
import {
  createCodeLayer,
  createImageLayer,
  createTextLayer,
  type FramePresetId,
  type ProjectDocument,
} from "@/core/document";
import { groupLayers } from "@/core/engine";
import { createDocumentFromTemplate } from "@/core/templates";

function project(framePresetId: FramePresetId = "square"): ProjectDocument {
  return createDocumentFromTemplate("tech-explainer", { name: `Fixture ${framePresetId}`, framePresetId });
}

export const arabicCoverFixture = project("square");

export const arabicEnglishFixture = (() => {
  const document = project("portrait");
  document.slides[0]?.layers.push(createTextLayer({ content: "واجهة عربية + TypeScript API", direction: "rtl" }));
  return document;
})();

export const codeSlideFixture = (() => {
  const document = project("square");
  document.slides[1]?.layers.push(createCodeLayer({ code: "const greeting = 'مرحباً';\nconsole.log(greeting);" }));
  return document;
})();

export const imageSlideFixture = (() => {
  const document = project("portrait");
  document.slides[1]?.layers.push(createImageLayer({ assetId: "asset_fixture", alt: "صورة تجريبية" }));
  return document;
})();

export const groupsFixture = (() => {
  const document = project("square");
  const slide = document.slides[1];
  if (slide) {
    const first = createTextLayer({ x: 100, y: 100, width: 300 });
    const second = createTextLayer({ x: 500, y: 100, width: 300 });
    slide.layers = groupLayers({ ...slide, layers: [first, second] }, [first.id, second.id]).slide.layers;
  }
  return document;
})();

export const squareFixture = project("square");
export const portraitFixture = project("portrait");
export const storyFixture = project("story");

const lightKit = BUILT_IN_BRAND_KITS.find((kit) => kit.id === "paper-ink");
const darkKit = BUILT_IN_BRAND_KITS.find((kit) => kit.id === "midnight");
export const lightBrandFixture = lightKit ? applyBrandSettings(project(), lightKit.settings, lightKit.id) : project();
export const darkBrandFixture = darkKit ? applyBrandSettings(project(), darkKit.settings, darkKit.id) : project();
