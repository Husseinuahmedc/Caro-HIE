import type { CarouselTemplate } from "../template-definition";

export const questionAnswerTemplate: CarouselTemplate = {
  id: "question-answer",
  name: "سؤال وجواب",
  description: "ابدأ بسؤال مألوف ثم أعطِ جواباً سريعاً ومفيداً.",
  icon: "؟",
  roles: [
    { id: "cover", label: "السؤال", hint: "خطف الانتباه", layout: "cover" },
    { id: "answer", label: "الجواب المختصر", hint: "الإجابة أولاً", layout: "body" },
    { id: "why", label: "لماذا؟", hint: "سبب أو سياق", layout: "body" },
    { id: "example", label: "مثال", hint: "حوّلها لتطبيق", layout: "body" },
    { id: "summary", label: "الخلاصة", hint: "احفظ هذه النقطة", layout: "body" },
    { id: "cta", label: "تفاعل", hint: "سؤال للجمهور", layout: "cta" },
  ],
};
