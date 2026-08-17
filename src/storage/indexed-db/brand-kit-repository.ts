import { brandKitSchema, type BrandKit } from "@/brand";
import { createDocumentId } from "@/core/document";
import { getCarouselStudioDatabase, type StoredBrandKitRecord } from "./database";
import { normalizeStorageError } from "./storage-errors";

function toBrandKit(record: StoredBrandKitRecord): BrandKit {
  return brandKitSchema.parse({ id: record.id, name: record.name, description: record.description, settings: record.settings });
}

export async function listLocalBrandKits(): Promise<BrandKit[]> {
  try {
    const records = await getCarouselStudioDatabase().brandKits.orderBy("updatedAt").reverse().toArray();
    return records.map(toBrandKit);
  } catch (error) {
    throw normalizeStorageError(error);
  }
}

export async function saveLocalBrandKit(kit: BrandKit): Promise<BrandKit> {
  try {
    const parsed = brandKitSchema.parse(kit);
    const database = getCarouselStudioDatabase();
    const existing = await database.brandKits.get(parsed.id);
    const now = new Date().toISOString();
    await database.brandKits.put({ ...structuredClone(parsed), createdAt: existing?.createdAt ?? now, updatedAt: now });
    return parsed;
  } catch (error) {
    throw normalizeStorageError(error);
  }
}

export async function createLocalBrandKit(name: string, description: string, settings: BrandKit["settings"]): Promise<BrandKit> {
  return saveLocalBrandKit({ id: createDocumentId("brand"), name: name.trim() || "هوية مخصصة", description: description.trim(), settings: structuredClone(settings) });
}

export async function deleteLocalBrandKit(brandKitId: string): Promise<void> {
  try {
    await getCarouselStudioDatabase().brandKits.delete(brandKitId);
  } catch (error) {
    throw normalizeStorageError(error);
  }
}
