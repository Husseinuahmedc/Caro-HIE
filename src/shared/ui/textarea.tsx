import type { TextareaHTMLAttributes } from "react";

import { cn } from "@/shared/class-names";

export function Textarea({ className, ...props }: TextareaHTMLAttributes<HTMLTextAreaElement>) {
  return <textarea className={cn("min-h-24 w-full resize-y rounded-xl border border-brand-border bg-surface-strong px-3 py-2 text-sm leading-6 text-stone-950 outline-none transition placeholder:text-stone-400 focus:border-brand-ring focus:ring-2 focus:ring-brand-accent-soft", className)} {...props} />;
}
