"use client";

import { useEditorUiStore } from "@/editor/state/editor-ui-store";
import { Dialog } from "@/shared/ui/dialog";
import { PropertiesPanel } from "./properties-panel";

export function EditorInspector() {
  const inspectorOpen = useEditorUiStore((state) => state.inspectorOpen);
  const setInspectorOpen = useEditorUiStore((state) => state.setInspectorOpen);
  return <>
    <aside className="hidden w-72 shrink-0 flex-col border-r border-brand-border bg-surface-strong lg:flex xl:w-80" aria-label="خصائص العنصر">
      <h2 className="border-b border-brand-border px-4 py-3 text-sm font-bold">خصائص العنصر</h2>
      <div className="min-h-0 flex-1 overflow-y-auto"><PropertiesPanel /></div>
    </aside>
    <Dialog open={inspectorOpen} onOpenChange={setInspectorOpen} title="خصائص العنصر"><PropertiesPanel /></Dialog>
  </>;
}
