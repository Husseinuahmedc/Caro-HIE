"use client";

import { useEffect, useMemo } from "react";

import { useProjectDocument } from "@/editor/hooks/use-document-session";
import { collectDocumentFontIds, loadDocumentFonts } from "@/fonts";

export function DocumentFontLoader() {
  const document = useProjectDocument();
  const fontSignature = useMemo(() => collectDocumentFontIds(document).sort().join("|"), [document]);
  useEffect(() => {
    void loadDocumentFonts(fontSignature ? fontSignature.split("|") : []).catch(() => undefined);
  }, [fontSignature]);
  return null;
}
