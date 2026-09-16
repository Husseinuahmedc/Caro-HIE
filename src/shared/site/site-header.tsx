import { LockKeyhole } from "lucide-react";

import { SiteBrand } from "./site-brand";

export function SiteHeader() {
  return (
    <header className="sticky top-0 z-50 border-b border-brand-border/80 bg-background/95 backdrop-blur-xl">
      <div className="mx-auto flex h-16 max-w-[1440px] items-center gap-4 px-4 sm:px-8 lg:px-12">
        <a href="#top" aria-label="Carousel Studio — الرئيسية" className="shrink-0">
          <SiteBrand compact />
        </a>

        <div className="ms-auto flex items-center gap-3">
          <span className="flex items-center gap-2 text-xs font-semibold text-brand-muted">
            <LockKeyhole className="size-3.5 text-brand-accent-strong" />
            الحفظ محلي في متصفحك
          </span>
        </div>
      </div>
    </header>
  );
}
