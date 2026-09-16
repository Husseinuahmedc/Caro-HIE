import type { CarouselTemplate } from "../template-definition";

export const techExplainerTemplate: CarouselTemplate = {
  id: "tech-explainer",
  name: "شرح تقني",
  description: "فكرة تقنية مرتبة من المشكلة إلى الخلاصة.",
  icon: "⌘",
  roles: [
    { id: "cover", label: "الغلاف", hint: "أخطاء JavaScript الشائعة", layout: "cover" },
    { id: "problem", label: "المشكلة", hint: "مصدر الخطأ الحقيقي", layout: "body" },
    { id: "explanation", label: "الشرح", hint: "انتظار البيانات", layout: "body" },
    { id: "code", label: "مثال JavaScript", hint: "قبل وبعد", layout: "code" },
    { id: "summary", label: "async / await", hint: "الخلاصة التقنية", layout: "body" },
    { id: "cta", label: "دعوة للفعل", hint: "سؤال ومشاركة", layout: "cta" },
  ],
};
