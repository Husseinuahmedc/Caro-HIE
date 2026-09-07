import { z } from "zod";
import { collectAssetIds, createDocumentId, migrateProjectDocument, type Layer, type ProjectDocument } from "@/core/document";
import { loadProjectAssets } from "../assets/asset-repository";
import { getCarouselStudioDatabase } from "../indexed-db/database";
import { createProject } from "../indexed-db/project-repository";
import { blobToDataUrl } from "@/export/shared/blob-to-data-url";
import { legacySourceToBlob } from "./import-legacy-project";

const backupSchema = z.object({
  format: z.literal("caro-hie-backup"), version: z.literal(1), document: z.unknown(),
  assets: z.array(z.object({ id: z.string(), name: z.string(), source: z.string() })).max(200),
});

export async function exportProjectBackup(document: ProjectDocument): Promise<Blob> {
  const records = await loadProjectAssets(document.id);
  const ids = collectAssetIds(document);
  if (ids.some((id) => !records.some((asset) => asset.id === id))) throw new Error("إحدى الصور غير متاحة. أعد إرفاقها قبل حفظ النسخة.");
  const assets = await Promise.all(records.filter((asset) => ids.includes(asset.id)).map(async (asset) => ({id: asset.id, name: asset.name, source: await blobToDataUrl(asset.blob)})));
  return new Blob([JSON.stringify({ format: "caro-hie-backup", version: 1, document, assets })], {type: "application/json"});
}

export async function importProjectBackup(input: unknown): Promise<ProjectDocument> {
  const parsed = backupSchema.safeParse(input);
  if (input && typeof input === "object" && "format" in input && !parsed.success) throw new Error("صيغة النسخة الاحتياطية غير مدعومة أو غير مكتملة.");
  const result = migrateProjectDocument(parsed.success ? parsed.data.document : input);
  const sourceAssets = parsed.success ? parsed.data.assets : result.extractedAssets;
  const assetIds = new Map(sourceAssets.map((asset) => [asset.id, createDocumentId("asset")]));
  if (collectAssetIds(result.document).some((id) => !assetIds.has(id))) throw new Error("ملف المشروع لا يحتوي صوره. صدّر نسخة احتياطية كاملة من الجهاز الأصلي.");
  const projectId = createDocumentId("project");
  const now = new Date().toISOString();
  const assets = sourceAssets.map((asset) => {
    const blob = legacySourceToBlob(asset.source);
    if (!/^image\/(png|jpeg|webp|gif|avif|svg\+xml)$/.test(blob.type)) throw new Error("صيغة صورة غير مدعومة في النسخة الاحتياطية.");
    return {id: assetIds.get(asset.id)!, projectId, name: asset.name, mimeType: blob.type, byteLength: blob.size, blob, createdAt: now};
  });
  function remap(layers: Layer[]): Layer[] {
    return layers.map((layer) => layer.type === "group" ? {...layer, children: remap(layer.children)} : layer.type === "image" && layer.assetId ? {...layer, assetId: assetIds.get(layer.assetId)!} : layer);
  }
  const document = {...result.document, id: projectId, name: `${result.document.name} — مستعاد`, slides: result.document.slides.map((slide) => ({...slide, layers: remap(slide.layers)}))};
  const database = getCarouselStudioDatabase();
  return database.transaction("rw", database.projects, database.assets, async () => {
    const created = await createProject(document);
    await database.assets.bulkAdd(assets);
    return created;
  });
}
