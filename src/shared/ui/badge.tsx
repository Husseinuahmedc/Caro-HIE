import type { HTMLAttributes } from "react";

import { cn } from "@/shared/class-names";

export function Badge({ className, ...props }: HTMLAttributes<HTMLSpanElement>) {
  return <span className={cn("inline-flex items-center rounded-full bg-brand-accent-soft px-2.5 py-1 text-xs font-semibold text-primary", className)} {...props} />;
}
