import { FileDown, Frame, Languages, MousePointer2 } from "lucide-react";

const HIGHLIGHTS = [
  { icon: Frame, title: "إطارات ثابتة", description: "مربع، عمودي، وستوري بقياسات واضحة." },
  { icon: MousePointer2, title: "تحرير بصري", description: "طبقات، محاذاة، تجميع، وتحريك مباشر." },
  { icon: Languages, title: "خطوط عربية", description: "خطوط مضمّنة وخيارات Google Fonts عند الطلب." },
  { icon: FileDown, title: "تصدير مرن", description: "نزّل المشروع أو الشريحة بالصيغة المناسبة." },
];

export function ProductHighlights() {
  return (
    <section id="features" className="scroll-mt-28 py-10 sm:py-16" aria-labelledby="features-title">
      <div className="mb-8 max-w-2xl">
        <span className="text-xs font-black text-brand-accent-strong">أدواتك الأساسية في مكان واحد</span>
        <h2 id="features-title" className="mt-2 text-3xl font-black text-primary sm:text-4xl">محرر مركز على الكاروسيل فقط.</h2>
      </div>
      <div className="grid gap-px overflow-hidden rounded-3xl border border-brand-border bg-brand-border sm:grid-cols-2 lg:grid-cols-4">
        {HIGHLIGHTS.map(({ icon: Icon, title, description }) => (
          <article key={title} className="bg-surface-strong p-6">
            <span className="grid size-11 place-items-center rounded-xl bg-brand-accent-soft text-brand-accent-strong"><Icon className="size-5" /></span>
            <h3 className="mt-5 text-base font-black text-primary">{title}</h3>
            <p className="mt-2 text-sm leading-6 text-brand-muted">{description}</p>
          </article>
        ))}
      </div>
    </section>
  );
}
