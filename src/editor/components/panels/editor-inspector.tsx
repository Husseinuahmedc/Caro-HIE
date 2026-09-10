import { useState } from "react";
import { ChevronDown, ChevronUp, X } from "lucide-react";

import { useEditorUiStore } from "@/editor/state/editor-ui-store";
import { Button } from "@/shared/ui";
import { PropertiesPanel } from "./properties-panel";

export function EditorInspector() {
  const inspectorOpen = useEditorUiStore((state) => state.inspectorOpen);
  const setInspectorOpen = useEditorUiStore((state) => state.setInspectorOpen);
  const [expanded, setExpanded] = useState(false);

  return (
    <>
      <aside
        className="hidden w-72 shrink-0 flex-col border-r border-brand-border bg-surface-strong lg:flex xl:w-80"
        aria-label="خصائص العنصر"
      >
        <h2 className="border-b border-brand-border px-4 py-3 text-sm font-bold">خصائص العنصر</h2>
        <div className="min-h-0 flex-1 overflow-y-auto">
          <PropertiesPanel />
        </div>
      </aside>

      {inspectorOpen ? (
        <section
          role="dialog"
          aria-modal="false"
          aria-label="خصائص العنصر"
          dir="rtl"
          className={`fixed inset-x-0 bottom-0 z-40 flex flex-col rounded-t-2xl border-t border-brand-border bg-surface-strong text-primary shadow-2xl transition-[height] duration-200 lg:hidden ${
            expanded ? "h-[80dvh] max-h-[80dvh]" : "h-[46dvh] max-h-[46dvh]"
          }`}
        >
          <div className="flex shrink-0 items-center justify-between border-b border-brand-border px-4 py-2.5">
            <div className="flex items-center gap-2">
              <span className="text-sm font-bold text-primary">خصائص العنصر</span>
              <Button
                type="button"
                variant="ghost"
                size="sm"
                className="h-8 px-2 text-xs font-semibold text-brand-muted"
                onClick={() => setExpanded(!expanded)}
                aria-label={expanded ? "تصغير اللوحة" : "توسيع اللوحة"}
              >
                {expanded ? (
                  <>
                    <ChevronDown className="size-3.5" />
                    <span>تصغير</span>
                  </>
                ) : (
                  <>
                    <ChevronUp className="size-3.5" />
                    <span>توسيع</span>
                  </>
                )}
              </Button>
            </div>
            <button
              type="button"
              className="grid size-9 place-items-center rounded-lg hover:bg-background text-stone-600"
              aria-label="إغلاق"
              onClick={() => setInspectorOpen(false)}
            >
              <X className="size-4" />
            </button>
          </div>
          <div className="min-h-0 flex-1 overflow-y-auto overscroll-contain">
            <PropertiesPanel />
          </div>
        </section>
      ) : null}
    </>
  );
}

