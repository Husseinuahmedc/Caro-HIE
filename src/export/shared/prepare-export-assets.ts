import { collectAssetIds, type ProjectDocument } from "@/core/document";
import { loadAsset } from "@/storage";
import { blobToDataUrl } from "./blob-to-data-url";

export async function prepareExportAssets(document: ProjectDocument): Promise<Map<string, string>> {
  const entries = await Promise.all(
    collectAssetIds(document).map(async (assetId) => {
      const record = await loadAsset(assetId);
      return record ? ([assetId, await blobToDataUrl(record.blob)] as const) : null;
    }),
  );
  return new Map(entries.filter((entry): entry is readonly [string, string] => entry !== null));
}
