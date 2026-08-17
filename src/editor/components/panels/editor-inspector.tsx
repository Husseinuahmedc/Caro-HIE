"use client";

import { ClipboardCheck, Layers3, Paintbrush, SlidersHorizontal, Workflow } from "lucide-react";

import { useEditorUiStore, type EditorPanel } from "@/editor/state/editor-ui-store";
import { BrandPanel } from "./brand-panel";
import { LayersPanel } from "./layers-panel";
import { PlannerPanel } from "./planner-panel";
import { PreflightPanel } from "./preflight-panel";
import { PropertiesPanel } from "./properties-panel";

const PANELS: Array<{ id: EditorPanel; label: string; icon: typeof Layers3 }> = [
  { id: "properties", label: "خصائص", icon: SlidersHorizontal },
  { id: "layers", label: "طبقات", icon: Layers3 },
  { id: "planner", label: "مخطط", icon: Workflow },
  { id: "brand", label: "هوية", icon: Paintbrush },
  { id: "preflight", label: "فحص", icon: ClipboardCheck },
];

export function EditorInspector() {
  const openPanel = useEditorUiStore((state) => state.openPanel);
  const setOpenPanel = useEditorUiStore((state) => state.setOpenPanel);
  return (
    <aside className="flex h-72 w-full shrink-0 flex-col border-r border-t border-brand-border bg-surface-strong md:h-auto md:w-80 md:border-t-0 xl:w-96">
      <nav className="grid grid-cols-5 border-b border-brand-border bg-surface p-1.5" aria-label="لوحات المحرر">
        {PANELS.map((panel) => { const Icon = panel.icon; return <button key={panel.id} type="button" aria-current={openPanel === panel.id ? "page" : undefined} onClick={() => setOpenPanel(panel.id)} className={`flex flex-col items-center gap-1 rounded-lg px-1 py-2 text-[10px] font-bold outline-none transition focus-visible:ring-2 focus-visible:ring-brand-ring ${openPanel === panel.id ? "bg-primary text-white" : "text-brand-muted hover:bg-brand-accent-soft hover:text-primary"}`}><Icon className="size-4" />{panel.label}</button>; })}
      </nav>
      <div className="min-h-0 flex-1 overflow-y-auto">
        {openPanel === "properties" ? <PropertiesPanel /> : null}
        {openPanel === "layers" ? <LayersPanel /> : null}
        {openPanel === "planner" ? <PlannerPanel /> : null}
        {openPanel === "brand" ? <BrandPanel /> : null}
        {openPanel === "preflight" ? <PreflightPanel /> : null}
      </div>
    </aside>
  );
}
