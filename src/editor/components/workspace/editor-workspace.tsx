"use client";

import type { ProjectDocument } from "@/core/document";
import { DocumentSessionProvider } from "@/editor/hooks/use-document-session";
import { EditorProject } from "./editor-project";

export function EditorWorkspace({ document, onExit }: { document: ProjectDocument; onExit: () => Promise<void> }) {
  return <DocumentSessionProvider initialDocument={document}><EditorProject initialDocument={document} onExit={onExit} /></DocumentSessionProvider>;
}
