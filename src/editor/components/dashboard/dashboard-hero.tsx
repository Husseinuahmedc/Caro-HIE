export function DashboardHero({ hasProjects }: { hasProjects: boolean }) {
  return <section className="flex flex-col justify-between gap-5 py-8 sm:flex-row sm:items-end sm:py-10">
    <div>
      <span className="text-sm font-bold text-brand-accent-strong">Carousel Studio / الإصدار الثاني</span>
      <h1 className="mt-3 text-4xl font-black leading-tight text-primary sm:text-5xl">الفكرة أولاً. والتصميم بين يديك.</h1>
      <p className="mt-3 max-w-2xl text-base leading-7 text-brand-muted">اختر بنية السلسلة، اكتب محتواها، ثم اضبط تصميمها. بلا حساب، والحفظ في هذا المتصفح.</p>
    </div>
    {hasProjects ? <a href="#projects" className="shrink-0 border-b-2 border-brand-accent pb-2 text-sm font-bold text-primary">متابعة مشروع محفوظ</a> : null}
  </section>;
}
