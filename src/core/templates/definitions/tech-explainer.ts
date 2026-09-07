import type { CarouselTemplate } from "../template-definition";

export const techExplainerTemplate: CarouselTemplate = {
  id: "tech-explainer",
  name: "شرح تقني",
  description: "فكرة تقنية مرتبة من المشكلة إلى الخلاصة.",
  icon: "⌘",
  roles: [
    { id: "cover", label: "الغلاف", hint: "وعد واضح للقارئ", layout: "cover" },
    { id: "problem", label: "المشكلة", hint: "لماذا يهم الموضوع؟", layout: "body" },
    { id: "explanation", label: "الشرح", hint: "الفكرة بلغة بسيطة", layout: "body" },
    { id: "code", label: "بطاقة كود", hint: "مثال قابل للحفظ", layout: "code" },
    { id: "summary", label: "الخلاصة", hint: "أهم نقطة", layout: "body" },
    { id: "cta", label: "الخطوة التالية", hint: "سؤال أو دعوة للفعل", layout: "cta" },
  ],
};
