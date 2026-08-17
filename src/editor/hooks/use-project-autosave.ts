"use client";

import { useCallback, useEffect, useRef, useState } from "react";

import { saveProject } from "@/storage";
import { useDocumentSession } from "./use-document-session";

export type AutosaveStatus = "saved" | "saving" | "pending" | "error";

export function useProjectAutosave(delay = 900) {
  const session = useDocumentSession();
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const savingRef = useRef(false);
  const [status, setStatus] = useState<AutosaveStatus>("saved");
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const saveNow = useCallback(async () => {
    if (savingRef.current || !session.isDirty || session.isTransactionOpen) return;
    savingRef.current = true;
    setStatus("saving");
    setErrorMessage(null);
    const source = structuredClone(session.getSnapshot());
    try {
      const saved = await saveProject(source, source.revision);
      session.acceptPersistedDocument(saved, source);
      setStatus(session.isDirty ? "pending" : "saved");
    } catch (error) {
      setStatus("error");
      setErrorMessage(error instanceof Error ? error.message : "تعذر حفظ المشروع محلياً.");
    } finally {
      savingRef.current = false;
    }
  }, [session]);

  useEffect(() => session.subscribe(() => {
    if (!session.isDirty || session.isTransactionOpen) return;
    setStatus("pending");
    if (timerRef.current) clearTimeout(timerRef.current);
    timerRef.current = setTimeout(() => void saveNow(), delay);
  }), [delay, saveNow, session]);

  useEffect(() => () => {
    if (timerRef.current) clearTimeout(timerRef.current);
  }, []);

  return { status, errorMessage, saveNow };
}
