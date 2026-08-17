# Contributing

شكراً لمساهمتك في Carousel Studio. الهدف هو إبقاء المحرر صغيراً، سريعاً، محلياً، وسهل الفهم.

## قبل فتح Pull Request

```bash
pnpm install
pnpm check
pnpm exec playwright install chromium
pnpm test:e2e
```

حدّث visual baselines فقط عندما يكون التغيير المرئي مقصوداً:

```bash
pnpm exec playwright test --update-snapshots
```

## قواعد التصميم

- `ProjectDocument` هو مصدر الحقيقة الوحيد لحالة المحتوى.
- لا تضف business logic داخل React components.
- اجعل عمليات geometry/history/template/preflight pure وقابلة للاختبار.
- لا تجعل `src/core` يعتمد على React أو Next.js أو Zustand أو APIs المتصفح.
- لا تكرر domain operation؛ أضف implementation canonical واحدة.
- لا تضف dependency إلا إذا كانت فائدتها أوضح من تكلفة الصيانة والحزمة.
- الصور Blob منفصلة، ويحتوي المستند على `assetId` فقط.
- أي تعديل schema يحتاج migration واختباراً ورفع `CURRENT_SCHEMA_VERSION`.
- تعامل مع RTL/LTR كخاصية للطبقة، لا كافتراض عام.

## أسلوب الملفات

ضع كل feature في boundary معروف. أمثلة:

- snapping: `src/core/engine/snapping.ts`
- storage: `src/storage/`
- SVG export: `src/export/svg/`
- fonts: `src/fonts/`
- preflight: `src/core/preflight/`

تجنّب أسماء `utils.ts` أو `helpers.ts` العامة. سمِّ الملف والدالة وفق مسؤوليتهما المحددة.

## Pull Requests

صف السلوك قبل وبعد، الاختبارات التي أضفتها، وأي أثر على schema أو migration أو حجم الحزمة. لا تخلط refactor غير مرتبط مع feature أو bug fix.
