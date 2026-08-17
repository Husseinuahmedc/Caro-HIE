import { ArrowDownLeft, Check, Download, Layers3 } from "lucide-react";

import { Badge, Button } from "@/shared/ui";

const TRUST_POINTS = ["حتى 9 شرائح", "حفظ تلقائي", "JSON · SVG · PNG · PDF"];

export function DashboardHero({ hasProjects }: { hasProjects: boolean }) {
  return (
    <section className="grid items-center gap-12 py-14 sm:py-20 lg:grid-cols-[1.1fr_0.9fr] lg:py-24">
      <div>
        <Badge className="mb-5 border border-brand-accent/60 bg-brand-accent-soft text-primary">محرر كاروسيل عربي</Badge>
        <h1 className="max-w-4xl text-4xl font-black leading-[1.18] tracking-tight text-primary sm:text-6xl lg:text-7xl">
          صمّم فكرتك، رتّبها، وصدّرها كاروسيل جاهز للنشر.
        </h1>
        <p className="mt-6 max-w-2xl text-base leading-8 text-brand-muted sm:text-lg">
          ابدأ من قالب واضح، عدّل النصوص والطبقات بصرياً، واحفظ مشاريعك داخل المتصفح من دون حساب.
        </p>
        <div className="mt-8 flex flex-wrap gap-3">
          <Button asChild size="default" variant="accent" className="h-12 px-6">
            <a href="#new-project">ابدأ مشروعاً <ArrowDownLeft /></a>
          </Button>
          {hasProjects ? <Button asChild size="default" variant="secondary" className="h-12 px-6"><a href="#projects">افتح مشاريعك</a></Button> : null}
        </div>
        <ul className="mt-8 flex flex-wrap gap-x-5 gap-y-2 text-xs font-semibold text-brand-muted">
          {TRUST_POINTS.map((point) => <li key={point} className="flex items-center gap-1.5"><Check className="size-4 text-brand-accent-strong" />{point}</li>)}
        </ul>
      </div>

      <div className="relative mx-auto w-full max-w-xl" aria-label="مراحل إنشاء الكاروسيل">
        <div className="absolute -inset-5 -z-10 rounded-[2rem] bg-brand-accent-soft/70" />
        <div className="rounded-[1.75rem] border border-primary/15 bg-surface-strong p-4 shadow-[0_28px_90px_rgba(25,69,75,0.13)] sm:p-6">
          <div className="mb-5 flex items-center justify-between border-b border-brand-border pb-4">
            <div><strong className="block text-sm text-primary">مسار عمل واضح</strong><span className="text-xs text-brand-muted">من الفكرة إلى الملف النهائي</span></div>
            <span className="grid size-10 place-items-center rounded-xl bg-primary text-white"><Layers3 className="size-5" /></span>
          </div>
          <div className="grid grid-cols-3 gap-3" dir="rtl">
            <Stage number="01" title="اختر" description="قالب ومقاس" />
            <Stage number="02" title="عدّل" description="نص وطبقات" active />
            <Stage number="03" title="صدّر" description="أربع صيغ" icon={<Download className="size-4" />} />
          </div>
          <div className="mt-4 grid grid-cols-[0.72fr_1fr_0.82fr] items-end gap-3 rounded-2xl bg-[#ebe8e1] p-4">
            <SlideMock className="aspect-square bg-[#dff7f7]" />
            <SlideMock className="aspect-[4/5] bg-primary" active />
            <SlideMock className="aspect-square bg-[#e7e2ff]" />
          </div>
        </div>
      </div>
    </section>
  );
}

function Stage({ number, title, description, active = false, icon }: { number: string; title: string; description: string; active?: boolean; icon?: React.ReactNode }) {
  return (
    <div className={`rounded-xl border p-3 ${active ? "border-brand-accent bg-brand-accent-soft" : "border-brand-border bg-surface"}`}>
      <span className="flex items-center justify-between text-[10px] font-black text-brand-accent-strong"><span>{number}</span>{icon}</span>
      <strong className="mt-4 block text-sm text-primary">{title}</strong>
      <span className="mt-1 block text-[11px] text-brand-muted">{description}</span>
    </div>
  );
}

function SlideMock({ className, active = false }: { className: string; active?: boolean }) {
  return <div className={`rounded-xl border p-3 shadow-sm ${active ? "border-brand-accent ring-2 ring-brand-accent/30" : "border-black/5"} ${className}`}><span className={`block h-2 w-2/3 rounded-full ${active ? "bg-white/80" : "bg-primary/65"}`} /><span className={`mt-2 block h-2 w-1/2 rounded-full ${active ? "bg-white/30" : "bg-primary/20"}`} /></div>;
}
