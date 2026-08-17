import type { LabelHTMLAttributes } from "react";

import { cn } from "@/shared/class-names";

export function Label({ className, ...props }: LabelHTMLAttributes<HTMLLabelElement>) {
  return <label className={cn("mb-1.5 block text-xs font-semibold text-stone-600", className)} {...props} />;
}
