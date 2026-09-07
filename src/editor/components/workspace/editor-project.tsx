"use client";

import { useEffect, useMemo } from "react";

import { getFramePreset, type ProjectDocument } from "@/core/document";
import { useDocumentSession } from "@/editor/hooks/use-document-session";
import { useInitialCanvasZoom } from "@/editor/hooks/use-initial-canvas-zoom";
import { useProjectAssets } from "@/editor/hooks/use-project-assets";
import { useProjectAutosave } from "@/editor/hooks/use-project-autosave";
import { useEditorShortcuts } from "@/editor/shortcuts/use-editor-shortcuts";
import { useEditorUiStore } from "@/editor/state/editor-ui-store";
import { EditorCanvas } from "../canvas/editor-canvas";
import { EditorInspector } from "../panels/editor-inspector";
import { SlideSidebar } from "../slides/slide-sidebar";
import { EditorTopbar } from "../topbar/editor-topbar";
import { EditorAssetsProvider } from "./editor-assets-context";
import { DocumentFontLoader } from "./document-font-loader";
import { WorkspacePanels } from "./workspace-panels";

interface EditorProjectProps {
  initialDocument: ProjectDocument;
  onExit: () => Promise<void>;
}

export function EditorProject({ initialDocument, onExit }: EditorProjectProps) {
  const session = useDocumentSession();
  const autosave = useProjectAutosave();
  const frame = getFramePreset(initialDocument.framePresetId);
  const { assetUrls, reloadAssets } = useProjectAssets(initialDocument.id);
  const assetsContext = useMemo(() => ({ assetUrls, reloadAssets }), [assetUrls, reloadAssets]);
  const focusMode = useEditorUiStore((state) => state.focusMode);
  const setActiveSlide = useEditorUiStore((state) => state.setActiveSlide);
  useEditorShortcuts(autosave.saveNow);
  useInitialCanvasZoom(initialDocument.id, frame.width, frame.height);

  useEffect(() => {
    const firstSlideId = initialDocument.slides[0]?.id;
    if (firstSlideId) setActiveSlide(firstSlideId);
  }, [initialDocument.id, initialDocument.slides, setActiveSlide]);

  async function exitEditor() {
    await autosave.saveNow();
    if (session.isDirty && !window.confirm("لم يكتمل حفظ آخر التغييرات. هل تريد مغادرة المحرر؟")) return;
    await onExit();
  }

  return (
    <EditorAssetsProvider value={assetsContext}>
      <DocumentFontLoader />
      <div className="flex h-dvh min-h-0 flex-col overflow-hidden bg-background text-stone-950">
        <EditorTopbar status={autosave.status} errorMessage={autosave.errorMessage} onSave={autosave.saveNow} onExit={exitEditor} />
        <div className="flex min-h-0 flex-1">
          {!focusMode ? <SlideSidebar /> : null}
          <EditorCanvas />
          {!focusMode ? <EditorInspector /> : null}
        </div>
        <WorkspacePanels />
      </div>
    </EditorAssetsProvider>
  );
}
