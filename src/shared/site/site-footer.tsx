import { ArrowUpLeft, GitFork } from "lucide-react";

import { SiteBrand } from "./site-brand";

const PRODUCT_LINKS = [
  { href: "#new-project", label: "مشروع جديد" },
  { href: "#projects", label: "المشاريع" },
  { href: "#features", label: "مزايا المحرر" },
];

const SITEHIE_LINKS = [
  { href: "https://sitehie.info", label: "الموقع الرئيسي" },
  { href: "https://sitehie.info/#projects", label: "الأعمال" },
  { href: "https://sitehie.info/#contact", label: "تواصل" },
];

export function SiteFooter() {
  return (
    <footer className="mt-20 bg-primary text-white" aria-label="تذييل الموقع">
      <div className="mx-auto grid max-w-[1440px] gap-10 px-4 py-12 sm:px-8 md:grid-cols-[1.4fr_1fr_1fr] lg:px-12">
        <div>
          <SiteBrand inverse />
          <p className="mt-5 max-w-sm text-sm leading-7 text-white/65">
            محرر كاروسيل عربي واضح، منظم، ويعمل مباشرة من المتصفح.
          </p>
          <span className="mt-5 inline-flex items-center gap-2 rounded-full border border-white/15 px-3 py-1.5 text-xs text-white/70">
            <GitFork className="size-4" />
            مفتوح المصدر
          </span>
        </div>

        <FooterLinks title="المحرر" links={PRODUCT_LINKS} />
        <FooterLinks title="sitehie" links={SITEHIE_LINKS} external />
      </div>

      <div className="border-t border-white/10">
        <div className="mx-auto flex max-w-[1440px] flex-col gap-2 px-4 py-5 text-xs text-white/55 sm:flex-row sm:items-center sm:justify-between sm:px-8 lg:px-12">
          <span>Carousel Studio © 2026</span>
          <span>صُمم وطُوّر في بغداد.</span>
        </div>
      </div>
    </footer>
  );
}

function FooterLinks({ title, links, external = false }: { title: string; links: Array<{ href: string; label: string }>; external?: boolean }) {
  return (
    <div>
      <h2 className="text-sm font-black">{title}</h2>
      <ul className="mt-4 space-y-3 text-sm text-white/65">
        {links.map((link) => (
          <li key={link.href}>
            <a className="inline-flex items-center gap-1.5 transition hover:text-white" href={link.href} target={external ? "_blank" : undefined} rel={external ? "noreferrer" : undefined}>
              {link.label}
              {external ? <ArrowUpLeft className="size-3.5" /> : null}
            </a>
          </li>
        ))}
      </ul>
    </div>
  );
}
