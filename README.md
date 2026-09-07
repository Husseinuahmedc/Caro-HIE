# Caro-HIE

## الإصدار الثاني — 2.2

كتابة المحتوى أصبحت أول خطوة بعد اختيار القالب، مع معاينة قبل الإنشاء. داخل المحرر، انقر مرتين على النص لتحريره مباشرة، أو استخدم لوحة المحتوى لتعديل السلسلة كاملة.

الشرائح والطبقات في جهة واحدة، والخصائص تعرض إعدادات العنصر قبل التفاصيل المتقدمة. على الهاتف تفتح اللوحات عند الحاجة وتترك مساحة التصميم ظاهرة.

قائمة التصدير تدعم الشريحة الحالية أو السلسلة كاملة، وتجمع ملفات PNG وSVG في ZIP. النسخة الاحتياطية تشمل الصور ويمكن استعادتها كمشروع مستقل دون استبدال الأصل. ملفات JSON المجرّدة تبقى متاحة لتكاملات البيانات.

أُضيف دليل للاختصارات، وفحص يوضح مكان المشكلة مع إصلاح سريع للتباين. لم يتغير تنسيق المستند أو مكان تخزين المشاريع السابقة.

محرر كاروسيل عربي مفتوح المصدر، مبني باستخدام Next.js وReact وTypeScript.

يعمل بالكامل داخل المتصفح. تُحفظ المشاريع والصور محلياً في IndexedDB، ولا يحتاج إلى حساب أو Backend أو قاعدة بيانات خارجية.

## المميزات

* دعم المقاسات المربعة والعمودية والقصص.
* حد أقصى 9 شرائح للمشروع.
* دعم النصوص العربية واتجاهي RTL وLTR.
* طبقات قابلة للسحب، مجموعات، محاذاة، قفل وترتيب أمامي وخلفي للعناصر.
* بطاقات كود متعددة اللغات مع تلوين نحوي، وأرقام أسطر وثيمات قابلة للتخصيص.
* مكتبة أيقونات متجهية قابلة للبحث مع تحكم باللون والتعبئة وسمك الخط.
* حفظ تلقائي مع Undo وRedo.
* خطوط عربية مضمّنة وخطوط Google تُحمّل عند الاستخدام.
* تصدير JSON وSVG وPNG وPDF.
* Brand Kits وقوالب جاهزة وفحص للمحتوى قبل التصدير.

## التشغيل

يتطلب Node.js 22.13 أو أحدث وpnpm 11.

```bash
git clone <repository-url>
cd Caro-HIE
pnpm install
pnpm dev
```

افتح:

```text
http://localhost:3000
```

لا توجد متغيرات بيئة أو خدمات خارجية مطلوبة.

## الأوامر

```bash
pnpm dev
pnpm build
pnpm lint
pnpm typecheck
pnpm test
pnpm test:e2e
pnpm check
```

## المعمارية

`ProjectDocument` هو مصدر الحقيقة الوحيد للمشروع.

```text
src/
  core/       Document, Engine, History, Templates, Preflight
  editor/     React UI, Commands, Shortcuts, UI State
  renderer/   Slide and Layer Rendering
  storage/    IndexedDB, Assets, Recovery
  export/     JSON, SVG, PNG, PDF
  brand/      Brand Kits
  fonts/      Font Registry and Loading
  shared/     Shared UI Components
```

الـCore مكتوب بـPure TypeScript ولا يعتمد على React أو Next.js أو Zustand.

للتفاصيل:

* [Architecture](docs/architecture.md)
* [Extending the project](docs/extending.md)
* [Contributing](CONTRIBUTING.md)

## الترخيص

المشروع متاح تحت رخصة [MIT](LICENSE). تراخيص الخطوط موجودة داخل `third-party/font-licenses/`.
