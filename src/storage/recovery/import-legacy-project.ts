import { migrateProjectDocument } from "@/core/document";
import { storeAssetWithId } from "../assets/asset-repository";

export function legacySourceToBlob(source: string): Blob {
  const match = /^data:([^;,]+)?(;base64)?,(.*)$/s.exec(source);
  if (!match) throw new Error("Unsupported legacy image source.");
  const mimeType = match[1] || "application/octet-stream";
  const content = match[3] ?? "";
  const binary = match[2] ? atob(content) : decodeURIComponent(content);
  const bytes = Uint8Array.from(binary, (character) => character.charCodeAt(0));
  return new Blob([bytes], { type: mimeType });
}

export async function importLegacyProject(input: unknown) {
  const result = migrateProjectDocument(input);
  for (const asset of result.extractedAssets) {
    await storeAssetWithId(result.document.id, asset.id, legacySourceToBlob(asset.source), asset.name);
  }
  return result.document;
}
