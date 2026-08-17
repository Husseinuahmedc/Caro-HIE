import type { CarouselTemplate } from "../template-definition";

export const codeWalkthroughTemplate: CarouselTemplate = {
  id: "code-walkthrough",
  name: "تفكيك كود",
  description: "من السطر إلى المعنى، مخصص للمحتوى البرمجي العربي.",
  icon: "</>",
  roles: [
    { id: "cover", label: "الغلاف", hint: "السؤال البرمجي", layout: "cover" },
    { id: "context", label: "السياق", hint: "شنو نريد نسوي؟", layout: "body" },
    { id: "code", label: "الكود", hint: "السطر المهم", layout: "code" },
    { id: "explanation", label: "التفسير", hint: "اقرأه معاً", layout: "body" },
    { id: "pitfall", label: "انتبه", hint: "الفخ الشائع", layout: "body" },
    { id: "summary", label: "الخلاصة", hint: "قاعدة تحفظها", layout: "body" },
    { id: "cta", label: "جرّب", hint: "خطوة تطبيقية", layout: "cta" },
  ],
};
