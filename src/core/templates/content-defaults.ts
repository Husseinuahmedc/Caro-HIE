export interface RoleContentDefaults {
  title: string;
  body: string;
  code?: string;
}

const ROLE_CONTENT: Record<string, RoleContentDefaults> = {
  cover: { title: "أخطاء شائعة في JavaScript", body: "لماذا الكود الخاص بك لا يعمل؟" },
  problem: { title: "الخطأ مو دائماً من الكود نفسه", body: "قد تكون المشكلة في افتراضاتك عن التنفيذ غير المتزامن، أو شكل البيانات، أو ترتيب التنفيذ." },
  explanation: { title: "افهم async / await", body: "تعلن async أن الدالة تعيد Promise، ويجعل await التنفيذ ينتظر النتيجة قبل الانتقال للسطر التالي." },
  code: { title: "مثال عملي", body: "النسخة الأولى لا تنتظر اكتمال الطلب. استخدم await داخل دالة async.", code: "const data = fetchData();\n\nconsole.log(data);\n\n// تأكد من جلب البيانات قبل الاستمرار\n\nconst data = await fetchData();\n\nconsole.log(data);" },
  summary: { title: "قبل / بعد", body: "قبل: تقرأ data قبل اكتمال الطلب. بعد: تنتظر fetchData ثم تتعامل مع النتيجة. أضف try/catch عند الحاجة." },
  cta: { title: "هل واجهت هذا الخطأ؟", body: "احفظ السلسلة وشاركها!" },
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
