export interface RoleContentDefaults {
  title: string;
  body: string;
  code?: string;
}

const ROLE_CONTENT: Record<string, RoleContentDefaults> = {
  cover: { title: "عنوان السلسلة هنا", body: "وعد واضح للقارئ من أول نظرة" },
  problem: { title: "المشكلة خلف التفاصيل", body: "اكتب المشكلة التي يعيشها جمهورك بجملة قصيرة ومباشرة." },
  explanation: { title: "لنشرح الفكرة", body: "اشرح الفكرة خطوة بخطوة، واجعل كل شريحة تحمل معنى واحداً." },
  code: { title: "السطر المهم", body: "اقرأ الكود ضمن سياقه.", code: "const result = await doSomething()" },
  summary: { title: "الخلاصة", body: "نقطة واحدة يتذكرها القارئ بعد قراءة السلسلة." },
  cta: { title: "ما خطوتك التالية؟", body: "احفظها وجرّبها اليوم." },
  answer: { title: "الجواب: نعم، ولكن…", body: "ابدأ بالجواب ثم أضف السبب الذي يحتاجه القارئ." },
  why: { title: "لماذا يحدث هذا؟", body: "أعطِ سياقاً بسيطاً يربط السؤال بالنتيجة." },
  example: { title: "مثال سريع", body: "حوّل الفكرة إلى موقف أو مثال يمكن تخيله." },
  "step-1": { title: "1. ابدأ من الأساس", body: "اكتب أول حركة بوضوح، بدون تفاصيل جانبية." },
  "step-2": { title: "2. نفّذ الحركة الأهم", body: "هنا يحصل التحول الحقيقي في الطريقة." },
  "step-3": { title: "3. ثبّت النتيجة", body: "اختم التنفيذ بخطوة تحقق أو مراجعة." },
  mistake: { title: "انتبه من هذا الخطأ", body: "اذكر الشيء الذي يضيّع وقت القارئ أو يربكه." },
  before: { title: "قبل", body: "الوضع القديم أو المشكلة قبل التغيير." },
  decision: { title: "القرار الفاصل", body: "الحركة الصغيرة التي غيّرت النتيجة." },
  after: { title: "بعد", body: "النتيجة بعد تطبيق الفكرة." },
  lesson: { title: "الدرس", body: "القاعدة التي تستحق أن تتكرر." },
  context: { title: "السياق أولاً", body: "قبل الكود، وضّح المدخلات والنتيجة المطلوبة." },
  pitfall: { title: "الفخ الشائع", body: "الخطأ الذي يظهر عندما ننسخ السطر بدون فهم." },
};

export function getRoleContentDefaults(roleId: string, index: number): RoleContentDefaults {
  return structuredClone(
    ROLE_CONTENT[roleId] ?? {
      title: `محتوى الشريحة ${index + 1}`,
      body: "اكتب الفكرة هنا.",
    },
  );
}
