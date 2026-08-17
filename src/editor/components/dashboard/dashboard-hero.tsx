import { ArrowLeft } from "lucide-react";

const TRUST_POINTS = ["حتى 9 شرائح", "حفظ تلقائي", "JSON · SVG · PNG · PDF"];

export function DashboardHero({ hasProjects }: { hasProjects: boolean }) {
  return (
    <section className="grid items-center gap-10 py-14 sm:py-20 lg:min-h-[650px] lg:grid-cols-[1.05fr_0.95fr] lg:gap-16 lg:py-14">
      <div className="max-w-3xl">
        <div className="mb-6 flex items-center gap-3 text-xs font-black text-primary sm:text-sm">
          <span className="h-0.5 w-11 bg-brand-accent" />
          <span>محرر كاروسيل عربي، مصنوع للمحتوى العربي</span>
        </div>

        <h1 className="text-5xl font-black leading-[1.16] tracking-[-0.04em] text-primary sm:text-6xl lg:text-7xl">
          الفكرة أولاً.
          <br />
          ثم تتحول إلى
          <br />
          سلسلة تُقرأ.
        </h1>

        <p className="mt-7 max-w-2xl text-base leading-8 text-brand-muted sm:text-lg">
          ابدأ من قالب واضح، اكتب المعنى قبل الزينة، ثم رتّب الشرائح والطبقات وصدّرها جاهزة للنشر.
        </p>

        <div className="mt-8 flex flex-wrap items-center gap-5">
          <a
            href="#new-project"
            className="inline-flex h-12 items-center gap-2 rounded-lg bg-brand-accent px-6 text-sm font-black text-primary transition hover:-translate-y-0.5 hover:bg-[#22e3ec]"
          >
            ابدأ مشروعاً
            <ArrowLeft className="size-4" />
          </a>
          {hasProjects ? (
            <a className="text-sm font-black text-primary underline decoration-brand-accent decoration-2 underline-offset-8" href="#projects">
              افتح مشاريعك
            </a>
          ) : (
            <a className="text-sm font-black text-primary underline decoration-brand-accent decoration-2 underline-offset-8" href="#new-project">
              شاهد كيف يعمل <span className="me-1 text-brand-accent-strong">02</span>
            </a>
          )}
        </div>

        <ul className="mt-9 flex flex-wrap items-center gap-y-3 text-xs font-medium text-brand-muted">
          {TRUST_POINTS.map((point, index) => (
            <li key={point} className="flex items-center">
              {index > 0 ? <span className="mx-4 h-4 w-px bg-brand-border" /> : null}
              {point}
            </li>
          ))}
        </ul>
      </div>

      <CarouselMotif />
    </section>
  );
}

function CarouselMotif() {
  return (
    <div className="relative mx-auto h-[430px] w-full max-w-[540px] sm:h-[510px]" aria-label="الفكرة، الترتيب، ثم النشر">
      <div className="absolute end-[32%] top-[16%] aspect-[4/5] w-[58%] -rotate-[7deg] rounded-xl border border-primary/15 bg-[#ddd6fa] shadow-[0_28px_70px_rgba(25,69,75,0.12)]">
        <SlideLabel number="01" label="الفكرة" />
      </div>
      <div className="absolute end-[17%] top-[8%] aspect-[4/5] w-[58%] rotate-2 rounded-xl border border-primary/15 bg-primary text-white shadow-[0_28px_70px_rgba(25,69,75,0.14)]">
        <SlideLabel number="02" label="الترتيب" inverse />
      </div>
      <div className="absolute end-0 top-[18%] aspect-[4/5] w-[58%] rotate-[8deg] rounded-xl border border-primary/15 bg-[#e8dbc2] shadow-[0_30px_80px_rgba(25,69,75,0.16)]">
        <SlideLabel number="03" label="النشر" />
      </div>
      <div className="absolute start-0 top-0 grid size-24 place-items-center rounded-full bg-brand-accent text-center text-xs font-black leading-5 text-primary sm:size-28 sm:text-sm">
        من الفكرة
        <br />
        إلى الملف
      </div>
    </div>
  );
}

function SlideLabel({ number, label, inverse = false }: { number: string; label: string; inverse?: boolean }) {
  return (
    <div className="flex h-full flex-col justify-between p-7 sm:p-9">
      <div>
        <strong className="block text-5xl font-black sm:text-7xl">{number}</strong>
        <span className={`mt-3 block h-0.5 w-20 ${inverse ? "bg-brand-accent" : "bg-[#d96d4a]"}`} />
      </div>
      <strong className={`text-lg font-black sm:text-xl ${inverse ? "text-white" : "text-primary"}`}>{label}</strong>
    </div>
  );
}
