"use client";

import { createContext, useContext, useState, useSyncExternalStore, type PropsWithChildren } from "react";

import type { ProjectDocument } from "@/core/document";
import { DocumentSession } from "../state/document-session";

const DocumentSessionContext = createContext<DocumentSession | null>(null);

export function DocumentSessionProvider({ initialDocument, children }: PropsWithChildren<{ initialDocument: ProjectDocument }>) {
  const [session] = useState(() => new DocumentSession(initialDocument));
  return <DocumentSessionContext value={session}>{children}</DocumentSessionContext>;
}

export function useDocumentSession(): DocumentSession {
  const session = useContext(DocumentSessionContext);
  if (!session) throw new Error("useDocumentSession must be used inside DocumentSessionProvider.");
  return session;
}

export function useProjectDocument(): ProjectDocument {
  const session = useDocumentSession();
  return useSyncExternalStore(session.subscribe, session.getSnapshot, session.getServerSnapshot);
}
