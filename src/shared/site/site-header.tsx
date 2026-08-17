import { ArrowUpLeft, ShieldCheck } from "lucide-react";

import { Button } from "@/shared/ui";
import { SiteBrand } from "./site-brand";

export function SiteHeader() {
  return (
    <header className="sticky top-0 z-50 border-b border-brand-border/80 bg-background/90 backdrop-blur-xl">
      <div className="mx-auto flex h-18 max-w-[1440px] items-center gap-5 px-4 sm:px-8 lg:px-12">
        <a href="#top" aria-label="Carousel Studio — الرئيسية" className="shrink-0">
          <SiteBrand />
        </a>

        <nav className="hidden flex-1 items-center gap-6 text-sm font-bold text-brand-muted md:flex" aria-label="التنقل الرئيسي">
          <a className="transition hover:text-primary" href="#new-project">مشروع جديد</a>
          <a className="transition hover:text-primary" href="#projects">مشاريعك</a>
          <a className="transition hover:text-primary" href="#features">عن المحرر</a>
        </nav>

        <div className="ms-auto flex items-center gap-2">
          <span className="hidden items-center gap-2 text-xs font-semibold text-brand-muted sm:flex">
            <ShieldCheck className="size-4 text-brand-accent-strong" />
            الحفظ على جهازك
          </span>
          <Button asChild size="sm" variant="secondary">
            <a href="https://sitehie.info" target="_blank" rel="noreferrer">
              sitehie
              <ArrowUpLeft />
            </a>
          </Button>
        </div>
      </div>
    </header>
  );
}
