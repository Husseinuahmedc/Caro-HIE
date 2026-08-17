import type { SelectHTMLAttributes } from "react";

import { cn } from "@/shared/class-names";

export function Select({ className, ...props }: SelectHTMLAttributes<HTMLSelectElement>) {
  return <select className={cn("h-10 w-full rounded-xl border border-brand-border bg-surface-strong px-3 text-sm text-stone-900 outline-none transition focus:border-brand-ring focus:ring-2 focus:ring-brand-accent-soft", className)} {...props} />;
}
