import Image from "next/image";

import { cn } from "@/shared/class-names";

interface SiteBrandProps {
  compact?: boolean;
  inverse?: boolean;
  className?: string;
}

export function SiteBrand({ compact = false, inverse = false, className }: SiteBrandProps) {
  return (
    <span className={cn("inline-flex items-center gap-3", className)}>
      <Image
        src="/brand/sitehie-mark.svg"
        alt=""
        width={40}
        height={40}
        className="size-10 rounded-xl"
      />
      <span className="leading-tight">
        <strong className={cn("block text-base font-black tracking-tight", inverse ? "text-white" : "text-primary")}>Carousel Studio</strong>
        {!compact ? <span className={cn("text-[11px]", inverse ? "text-white/60" : "text-brand-muted")}>منتج من sitehie</span> : null}
      </span>
    </span>
  );
}
