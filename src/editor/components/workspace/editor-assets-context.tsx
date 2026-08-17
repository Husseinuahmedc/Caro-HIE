"use client";

import { createContext, useContext, type PropsWithChildren } from "react";

interface EditorAssetsValue {
  assetUrls: ReadonlyMap<string, string>;
  reloadAssets: () => Promise<void>;
}

const EditorAssetsContext = createContext<EditorAssetsValue | null>(null);

export function EditorAssetsProvider({ value, children }: PropsWithChildren<{ value: EditorAssetsValue }>) {
  return <EditorAssetsContext value={value}>{children}</EditorAssetsContext>;
}

export function useEditorAssets(): EditorAssetsValue {
  const value = useContext(EditorAssetsContext);
  if (!value) throw new Error("useEditorAssets must be used inside EditorAssetsProvider.");
  return value;
}
