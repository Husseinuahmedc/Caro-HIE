import type { CarouselTemplate } from "../template-definition";

export const practicalStepsTemplate: CarouselTemplate = {
  id: "practical-steps",
  name: "خطوات عملية",
  description: "حوّل أي شرح إلى خطوات سهلة المتابعة.",
  icon: "①",
  roles: [
    { id: "cover", label: "الغلاف", hint: "النتيجة التي سيصل لها القارئ", layout: "cover" },
    { id: "step-1", label: "الخطوة الأولى", hint: "ابدأ من الأساس", layout: "body" },
    { id: "step-2", label: "الخطوة الثانية", hint: "نفّذ الحركة الأهم", layout: "body" },
    { id: "step-3", label: "الخطوة الثالثة", hint: "ثبّت النتيجة", layout: "body" },
    { id: "mistake", label: "خطأ شائع", hint: "ما الذي تتجنبه؟", layout: "body" },
    { id: "summary", label: "الخلاصة", hint: "قائمة تحقق سريعة", layout: "body" },
    { id: "cta", label: "طبّقها", hint: "دعوة للتجربة", layout: "cta" },
  ],
};
