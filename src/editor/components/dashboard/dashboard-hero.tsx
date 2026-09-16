export function DashboardHero({ hasProjects }: { hasProjects: boolean }) {
  return <section className="flex flex-col justify-between gap-6 py-10 sm:flex-row sm:items-end sm:py-14">
    <div>
      <span className="text-xs font-bold text-brand-accent-strong">محرر كاروسيل عربي</span>
      <h1 className="mt-3 max-w-3xl text-3xl font-black leading-[1.35] tracking-tight text-primary sm:text-5xl">صمّم سلاسل كاروسيل تقنية وعربية بضغطة زر</h1>
      <p className="mt-4 max-w-2xl text-base leading-8 text-brand-muted">محرر سريع، مجاني، بخطوط مضبوطة وكتل برمجية. لا حساب، حفظ محلي.</p>
    </div>
    {hasProjects ? <a href="#projects" className="shrink-0 text-sm font-bold text-primary underline decoration-brand-accent decoration-2 underline-offset-8">متابعة مشروع محفوظ</a> : null}
  </section>;
}
