import { createDocumentId } from "@/core/document";
import { getCarouselStudioDatabase, type StoredAssetRecord } from "../indexed-db/database";
import { normalizeStorageError, ProjectNotFoundError } from "../indexed-db/storage-errors";

export async function storeAsset(projectId: string, file: Blob, name = "asset"): Promise<StoredAssetRecord> {
  try {
    const database = getCarouselStudioDatabase();
    if (!(await database.projects.get(projectId))) throw new ProjectNotFoundError(projectId);
    const record: StoredAssetRecord = {
      id: createDocumentId("asset"),
      projectId,
      name,
      mimeType: file.type || "application/octet-stream",
      byteLength: file.size,
      blob: file,
      createdAt: new Date().toISOString(),
    };
    await database.assets.add(record);
    return record;
  } catch (error) {
    throw normalizeStorageError(error);
  }
}

export async function storeAssetWithId(
  projectId: string,
  assetId: string,
  blob: Blob,
  name = "asset",
): Promise<StoredAssetRecord> {
  const record: StoredAssetRecord = {
    id: assetId,
    projectId,
    name,
    mimeType: blob.type || "application/octet-stream",
    byteLength: blob.size,
    blob,
    createdAt: new Date().toISOString(),
  };
  await getCarouselStudioDatabase().assets.put(record);
  return record;
}

export async function loadAsset(assetId: string): Promise<StoredAssetRecord | null> {
  try {
    return (await getCarouselStudioDatabase().assets.get(assetId)) ?? null;
  } catch (error) {
    throw normalizeStorageError(error);
  }
}

export async function loadProjectAssets(projectId: string): Promise<StoredAssetRecord[]> {
  try {
    return await getCarouselStudioDatabase().assets.where("projectId").equals(projectId).toArray();
  } catch (error) {
    throw normalizeStorageError(error);
  }
}

export async function deleteAsset(assetId: string): Promise<void> {
  try {
    await getCarouselStudioDatabase().assets.delete(assetId);
  } catch (error) {
    throw normalizeStorageError(error);
  }
}
