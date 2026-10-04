"use client";
export function SiteFooter({
  onCreate,
  onGallery,
}: {
  onCreate?: () => void;
  onGallery?: () => void;
}) {
  return (
    <footer className="border-t border-brand-border px-4 py-6 text-sm text-brand-muted sm:px-8 lg:px-12">
      <div className="mx-auto flex max-w-[1344px] flex-wrap items-center justify-between gap-4">
        <span>Carousel Studio · بغداد</span>
        <nav className="flex items-center gap-6" aria-label="روابط التذييل">
          <button className="min-h-11" onClick={onCreate}>
            مشروع جديد
          </button>
          <button className="min-h-11" onClick={onGallery}>
            القوالب
          </button>
          <a href="#projects" className="flex min-h-11 items-center">
            المشاريع
          </a>
        </nav>
        <span className="text-xs">مجاني · بدون حساب</span>
      </div>
    </footer>
  );
}
