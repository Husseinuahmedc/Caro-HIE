import { afterEach, describe, expect, it } from "vitest";
import {
  createDocumentFromTemplate,
  restyleDocument,
  VISUAL_FAMILIES,
} from "@/core/templates";
import {
  CURRENT_SCHEMA_VERSION,
  getSlidePresentationLayers,
  getFramePreset,
  flattenLayers,
  parseProjectDocument,
  migrateProjectDocument,
} from "@/core/document";
import {
  addBlankSlide,
  duplicateSlide,
  deleteSlide,
  reorderSlides,
} from "@/editor/commands";
import { DocumentSession } from "@/editor/state/document-session";
import {
  createProject,
  saveProject,
  loadProject,
  getCarouselStudioDatabase,
} from "@/storage";
import { importProjectBackup } from "@/storage/recovery/project-backup";
import {
  selectExportSlides,
  exportSlideFilename,
} from "@/export/shared/export-job";
import { runPreflight } from "@/core/preflight";
import { moveLayer } from "@/core/engine";

afterEach(async () => {
  const db = getCarouselStudioDatabase();
  await db.projects.clear();
  await db.assets.clear();
  await db.recoveries.clear();
});
it("preserves extra code and duplicated keyed text through family changes", () => {
  const document = createDocumentFromTemplate("tech-explainer", { visualFamilyId: "developer", slideCount: 1 });
  const slide = document.slides[0]!;
  const originals = slide.layers.filter((layer) => layer.type === "code" || (layer.type === "text" && (layer.contentKey === "title" || layer.contentKey === "body")));
  const extras = originals.map((layer, index) => ({ ...structuredClone(layer), id: `extra-${index}` }));
  slide.layers.push(...extras);
  for (const family of VISUAL_FAMILIES) {
    const changed = restyleDocument(document, family.id);
    for (const extra of extras) expect(changed.slides[0]!.layers.find((layer) => layer.id === extra.id)).toEqual(extra);
  }
});
it("provides separate populated comparison regions and retains both texts on reflow", () => {
  const document = createDocumentFromTemplate("before-after", { visualFamilyId: "comparison", slideCount: 1 });
  const regions = document.slides[0]!.layers.filter((layer) => layer.type === "text" && ["نص قبل", "نص بعد"].includes(layer.name));
  expect(regions).toHaveLength(2);
  expect(regions[0]!.x + regions[0]!.width).toBeLessThan(regions[1]!.x);
  for (const [index, layer] of regions.entries()) if (layer.type === "text") layer.content = `my-region-${index}`;
  const changed = restyleDocument(document, "comparison");
  const texts = changed.slides[0]!.layers.filter((layer) => layer.type === "text").map((layer) => layer.type === "text" ? layer.content : "");
  expect(texts).toContain("my-region-0");
  expect(texts).toContain("my-region-1");
});
describe("flexible project size", () => {
  it.each([1, 9, 10, 20, 24, 100])(
    "edits, saves, restores and imports %i slides",
    async (count) => {
      let document = createDocumentFromTemplate("practical-steps", {
        slideCount: count,
        visualFamilyId: "steps",
      });
      expect(document.slides).toHaveLength(count);
      expect(new Set(document.slides.map((slide) => slide.id)).size).toBe(
        count,
      );
      expect(
        new Set(document.contentPlan.slides.map((slide) => slide.id)).size,
      ).toBe(count);
      document = await createProject(document);
      const first = document.slides[0]!;
      const changed = duplicateSlide(document, first.id);
      expect(changed.slides[1]!.id).not.toBe(first.id);
      const moved = reorderSlides(
        changed,
        changed.slides[1]!.id,
        changed.slides.at(-1)!.id,
      );
      const added = addBlankSlide(moved);
      const session = new DocumentSession(document);
      session.update(() => added, { label: "Edit slides", kind: "slide" });
      expect(session.getSnapshot().slides).toHaveLength(count + 2);
      session.undo();
      expect(session.getSnapshot().slides.map((slide) => slide.id)).toEqual(
        document.slides.map((slide) => slide.id),
      );
      session.redo();
      expect(session.getSnapshot().slides.map((slide) => slide.id)).toEqual(
        added.slides.map((slide) => slide.id),
      );
      const saved = await saveProject(session.getSnapshot());
      expect(
        (await loadProject(saved.id)).slides.map((slide) => slide.id),
      ).toEqual(added.slides.map((slide) => slide.id));
      const imported = await importProjectBackup({
        format: "caro-hie-backup",
        version: 1,
        document: saved,
        assets: [],
      });
      expect(imported.slides).toHaveLength(count + 2);
      expect(deleteSlide(imported, imported.slides[0]!.id).slides).toHaveLength(
        count + 1,
      );
    },
  );
  it.each([0, -1, 1.5, NaN, Infinity])(
    "rejects invalid initial count %s",
    (count) =>
      expect(() =>
        createDocumentFromTemplate("tech-explainer", { slideCount: count }),
      ).toThrow(),
  );
  it("retains the final slide", () => {
    const document = createDocumentFromTemplate("blank", { slideCount: 1 });
    expect(deleteSlide(document, document.slides[0]!.id)).toBe(document);
  });
  it("keeps old schema-v4 projects readable without restyling", () => {
    const old = {
      ...createDocumentFromTemplate("tech-explainer"),
      schemaVersion: 4,
    };
    expect(migrateProjectDocument(old).document).toEqual({
      ...old,
      schemaVersion: CURRENT_SCHEMA_VERSION,
    });
  });
});
describe("visual families and dimensions", () => {
  it("preserves edited title/body/code and IDs when changing every family", () => {
    const document = createDocumentFromTemplate("code-walkthrough", {
      slideCount: 24,
      visualFamilyId: "developer",
    });
    const first = document.slides[0]!;
    const texts = first.layers.filter(
      (layer) => layer.type === "text" && layer.contentKey,
    );
    for (const layer of texts)
      if (layer.type === "text") layer.content = `edited ${layer.contentKey}`;
    for (const family of VISUAL_FAMILIES) {
      const result = restyleDocument(document, family.id);
      expect(parseProjectDocument(result).slides).toHaveLength(24);
      expect(result.slides.map((slide) => slide.id)).toEqual(
        document.slides.map((slide) => slide.id),
      );
      const layers = flattenLayers(result.slides[0]!.layers).map(
        ({ layer }) => layer,
      );
      expect(layers).toEqual(
        expect.arrayContaining([
          expect.objectContaining({ content: "edited title" }),
          expect.objectContaining({ content: "edited body" }),
          expect.objectContaining({
            type: "code",
            code: first.layers.find((layer) => layer.type === "code")?.code,
          }),
        ]),
      );
    }
  });
  it("uses custom geometry for renderer and engine", () => {
    const document = createDocumentFromTemplate("tech-explainer", {
      framePresetId: "custom",
      customFrame: { width: 720, height: 960 },
      visualFamilyId: "editorial",
    });
    const frame = getFramePreset(document.framePresetId, document.customFrame);
    expect(frame.width).toBe(720);
    expect(frame.height).toBe(960);
    expect(parseProjectDocument(document).customFrame).toEqual({
      width: 720,
      height: 960,
    });
    const slide = document.slides[0]!,
      layer = slide.layers[0]!;
    const moved = moveLayer(slide, layer.id, { x: 10000, y: 10000 }, frame)
      .slide.layers[0]!;
    expect(moved.x + moved.width).toBeLessThanOrEqual(720);
    expect(moved.y + moved.height).toBeLessThanOrEqual(960);
  });
});
describe("export selection", () => {
  const slides = createDocumentFromTemplate("blank", {
    slideCount: 100,
  }).slides;
  it("deduplicates mixed ranges in project order", () =>
    expect(selectExportSlides(slides, "8, 1-3, 2, 99-100")).toEqual([
      slides[0],
      slides[1],
      slides[2],
      slides[7],
      slides[98],
      slides[99],
    ]));
  it.each(["", "0", "1-101", "4-2", "x", "2.5"])(
    "rejects invalid range %s",
    (range) => expect(() => selectExportSlides(slides, range)).toThrow(),
  );
  it("uses stable padded project indices", () =>
    expect(exportSlideFilename("series", 8, 100, "png")).toBe(
      "series-009.png",
    ));
});

it("derives numbering after duplication and selected-range export", () => {
  const document = createDocumentFromTemplate("tech-explainer", {
    slideCount: 24,
    visualFamilyId: "editorial",
  });
  const duplicated = duplicateSlide(document, document.slides[0]!.id);
  expect(
    getSlidePresentationLayers(duplicated, duplicated.slides[10]!),
  ).toEqual(
    expect.arrayContaining([
      expect.objectContaining({
        content: "11 / 25",
        contentKey: "slide-number",
      }),
    ]),
  );
});

it("starts each visual family within bounds at supported sizes", () => {
  for (const family of VISUAL_FAMILIES)
    for (const framePresetId of [
      "square",
      "portrait",
      "portrait34",
      "story",
    ] as const) {
      const document = createDocumentFromTemplate("tech-explainer", {
        visualFamilyId: family.id,
        slideCount: 3,
        framePresetId,
      });
      expect(runPreflight(document), `${family.id}/${framePresetId}`).toEqual(
        [],
      );
    }
});
