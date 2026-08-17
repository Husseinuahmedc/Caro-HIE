import { ArrowUpLeft } from "lucide-react";

import { SiteBrand } from "./site-brand";

const FOOTER_LINKS = [
  { href: "#new-project", label: "مشروع جديد" },
  { href: "#projects", label: "المشاريع" },
  { href: "#features", label: "المزايا" },
];

export function SiteFooter() {
  return (
    <footer className="border-t border-brand-border bg-surface-strong text-primary" aria-label="تذييل الموقع">
      <div className="mx-auto max-w-[1440px] px-4 py-10 sm:px-8 lg:px-12">
        <div className="flex flex-col gap-8 sm:flex-row sm:items-center sm:justify-between">
          <SiteBrand />
          <nav aria-label="روابط التذييل">
            <ul className="flex flex-wrap gap-x-7 gap-y-3 text-xs font-black">
              {FOOTER_LINKS.map((link) => (
                <li key={link.href}><a className="transition hover:text-brand-accent-strong" href={link.href}>{link.label}</a></li>
              ))}
              <li>
                <a className="inline-flex items-center gap-1 transition hover:text-brand-accent-strong" href="https://sitehie.info" target="_blank" rel="noreferrer">
                  sitehie
                  <ArrowUpLeft className="size-3.5" />
                </a>
              </li>
            </ul>
          </nav>
        </div>

        <div className="mt-8 flex flex-col gap-2 border-t border-brand-border pt-5 text-[11px] text-brand-muted sm:flex-row sm:items-center sm:justify-between">
          <span>Carousel Studio © 2026</span>
          <span className="font-bold text-primary">صُمم وطُوّر في بغداد <span className="text-brand-accent-strong">●</span></span>
        </div>
      </div>
    </footer>
  );
}
