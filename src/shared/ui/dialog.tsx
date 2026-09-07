"use client";

import { Dialog as Primitive } from "radix-ui";
import { X } from "lucide-react";
import type { ReactNode } from "react";

export function Dialog({ open, onOpenChange, title, description, children, wide = false }: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title: string;
  description?: string;
  children: ReactNode;
  wide?: boolean;
}) {
  return <Primitive.Root open={open} onOpenChange={onOpenChange}>
    <Primitive.Portal>
      <Primitive.Overlay className="fixed inset-0 z-50 bg-primary/30 backdrop-blur-sm" />
      <Primitive.Content dir="rtl" className={`fixed inset-x-0 bottom-0 z-50 flex max-h-[92dvh] flex-col rounded-t-2xl border border-brand-border bg-surface-strong text-primary shadow-xl sm:inset-auto sm:left-1/2 sm:top-1/2 sm:w-[calc(100%-3rem)] sm:-translate-x-1/2 sm:-translate-y-1/2 sm:rounded-xl ${wide ? "sm:max-w-5xl" : "sm:max-w-xl"}`}>
        <div className="flex shrink-0 items-start justify-between gap-4 border-b border-brand-border px-5 py-4">
          <div><Primitive.Title className="text-xl font-bold">{title}</Primitive.Title>
            <Primitive.Description className={description ? "mt-1 text-sm text-brand-muted" : "sr-only"}>{description ?? title}</Primitive.Description>
          </div>
          <Primitive.Close className="grid size-11 shrink-0 place-items-center rounded-lg hover:bg-background" aria-label="إغلاق"><X className="size-5" /></Primitive.Close>
        </div>
        <div className="min-h-0 overflow-y-auto overscroll-contain p-5">{children}</div>
      </Primitive.Content>
    </Primitive.Portal>
  </Primitive.Root>;
}
