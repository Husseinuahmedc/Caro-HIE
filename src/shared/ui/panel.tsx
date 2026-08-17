import type { HTMLAttributes } from "react";

import { cn } from "@/shared/class-names";

export function Panel({ className, ...props }: HTMLAttributes<HTMLDivElement>) {
  return <section className={cn("rounded-2xl border border-brand-border bg-surface-strong shadow-[0_16px_48px_rgba(25,69,75,0.06)]", className)} {...props} />;
}
