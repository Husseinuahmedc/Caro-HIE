import { describe, expect, it } from "vitest";
import { flattenLayers, parseProjectDocument } from "@/core/document";
import { applyContentPlan, createDocumentFromTemplate, listTemplates, VISUAL_FAMILIES } from "@/core/templates";

describe("content outlines stay independent from artwork", () => {
  for (const template of listTemplates()) {
    it.each(VISUAL_FAMILIES.map((family) => family.id))(`${template.id} retains its outline in %s`, (visualFamilyId) => {
      const count = template.roles.length;
      const document = createDocumentFromTemplate(template.id, { visualFamilyId, slideCount: count });
      expect(parseProjectDocument(document).slides).toHaveLength(count);
      expect(document.slides.map((slide) => slide.role)).toEqual(template.roles.map((role) => role.id));
      expect(document.slides.map((slide) => slide.name)).toEqual(template.roles.map((role) => role.label));
      document.slides.forEach((slide, index) => {
        const item = document.contentPlan.slides[index]!;
        const layers = flattenLayers(slide.layers).map(({ layer }) => layer);
        expect(item.id).toBe(slide.id);
        expect(layers.find((layer) => layer.type === "text" && layer.contentKey === "title")).toMatchObject({ content: item.title });
        expect(layers.find((layer) => layer.type === "text" && layer.contentKey === "body")).toMatchObject({ content: item.body });
        if (item.code !== undefined) expect(layers.find((layer) => layer.type === "code")).toMatchObject({ code: item.code });
      });
      expect(applyContentPlan(document)).toEqual(document);
      if (template.id !== "tech-explainer") expect(document.contentPlan.slides[0]!.title).not.toContain("JavaScript");
    });
  }
  it("cycles semantic roles without damaging numbered step IDs", () => {
    const document = createDocumentFromTemplate("practical-steps", { visualFamilyId: "editorial", slideCount: 24 });
    expect(document.slides[1]!.role).toBe("step-1");
    expect(document.slides[6]!.role).toBe("step-1");
    expect(document.contentPlan.slides[1]!.title).toBe("1. ابدأ من الأساس");
    expect(document.contentPlan.slides[6]!.title).toBe("1. ابدأ من الأساس");
    expect(document.slides.at(-1)!.role).toBe("cta");
  });
  it("keeps blank artwork blank even with a visual family", () => {
    const document = createDocumentFromTemplate("blank", { visualFamilyId: "developer", slideCount: 24 });
    expect(document.slides.every((slide) => slide.layers.length === 0)).toBe(true);
    expect(document.contentPlan.slides.every((item) => item.title === "" && item.body === "")).toBe(true);
  });
  it("uses family samples only for explicit gallery examples", () => {
    const project = createDocumentFromTemplate("question-answer", { visualFamilyId: "editorial" });
    const example = createDocumentFromTemplate("question-answer", { visualFamilyId: "editorial", exampleContent: true });
    expect(project.contentPlan.slides[0]!.title).toBe("سؤال يستحق جواباً");
    expect(example.contentPlan.slides[0]!.title).toBe("فكرتك\nتستحق\nالسحبة.");
  });
});
