import type { CarouselTemplate } from "../template-definition";

export const beforeAfterTemplate: CarouselTemplate = {
  id: "before-after",
  name: "قبل / بعد",
  description: "اعرض التحول بوضوح: الوضع القديم، القرار، والنتيجة.",
  icon: "↔",
  roles: [
    { id: "cover", label: "التحول", hint: "ما الذي تغيّر؟", layout: "cover" },
    { id: "before", label: "قبل", hint: "الوضع المربك", layout: "comparison" },
    { id: "decision", label: "القرار", hint: "الحركة الفاصلة", layout: "body" },
    { id: "after", label: "بعد", hint: "النتيجة الجديدة", layout: "comparison" },
    { id: "lesson", label: "الدرس", hint: "ما الذي نتعلمه؟", layout: "body" },
    { id: "cta", label: "سؤال", hint: "ادعُ الجمهور للمشاركة", layout: "cta" },
  ],
};
