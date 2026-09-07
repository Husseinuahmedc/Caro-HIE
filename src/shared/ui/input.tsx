import type { InputHTMLAttributes } from "react";

import { cn } from "@/shared/class-names";

export function Input({ className, ...props }: InputHTMLAttributes<HTMLInputElement>) {
  return <input className={cn("h-11 w-full rounded-lg border border-brand-border bg-surface-strong px-3 text-base sm:text-sm text-stone-950 outline-none transition placeholder:text-stone-400 focus:border-brand-ring focus:ring-2 focus:ring-brand-accent-soft disabled:bg-stone-50 disabled:text-stone-400", className)} {...props} />;
}
