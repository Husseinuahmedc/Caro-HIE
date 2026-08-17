import type { ContentPlan } from "../types";
import { arrayOrEmpty, recordOrEmpty, stringOr, type UnknownRecord } from "./migration-values";

function seedContentPlan(document: UnknownRecord): ContentPlan {
  const existing = recordOrEmpty(document.contentPlan);
  const existingSlides = arrayOrEmpty(existing.slides);
  const slides = arrayOrEmpty(document.slides);

  return {
    goal: stringOr(existing.goal, "شرح الفكرة بدون حشو"),
    audience: stringOr(existing.audience, "صنّاع المحتوى والمطورون العرب"),
    hook: stringOr(existing.hook, ""),
    tone: stringOr(existing.tone, "واضح ومباشر"),
    slides: slides.map((slideValue, index) => {
      const slide = recordOrEmpty(slideValue);
      const planned = recordOrEmpty(existingSlides[index]);
      const role = stringOr(planned.role, stringOr(slide.role, `slide-${index + 1}`));
      const layers = arrayOrEmpty(slide.layers).map(recordOrEmpty);
      const texts = layers.filter((layer) => layer.type === "text");
      const code = layers.find((layer) => layer.type === "code");
      return {
        id: stringOr(planned.id, role),
        role,
        label: stringOr(planned.label, stringOr(slide.name, `شريحة ${index + 1}`)),
        hint: stringOr(planned.hint, "محتوى الشريحة"),
        title: stringOr(planned.title, stringOr(texts[0]?.content, "")),
        body: stringOr(planned.body, stringOr(texts[1]?.content, "")),
        ...(planned.code !== undefined || code
          ? { code: stringOr(planned.code, stringOr(code?.code, "")) }
          : {}),
      };
    }),
  };
}

export function migrateVersionTwoToThree(input: UnknownRecord): UnknownRecord {
  return {
    ...input,
    schemaVersion: 3,
    templateId: stringOr(input.templateId, "custom"),
    brandKitId: typeof input.brandKitId === "string" ? input.brandKitId : null,
    contentPlan: seedContentPlan(input),
  };
}
