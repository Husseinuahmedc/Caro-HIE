import { brandKitSchema } from "@/brand";
import { DEFAULT_BRAND_SETTINGS, migrateProjectDocument, type BrandColors } from "@/core/document";
import { getCarouselStudioDatabase } from "../indexed-db/database";
import { legacySourceToBlob } from "./import-legacy-project";

const LEGACY_PROJECTS_KEY = "carousel-studio:projects:v1";
const LEGACY_BRAND_KITS_KEY = "carousel-studio:brand-kits:v1";
const MIGRATION_MARKER = "legacy-local-storage-imported";

interface LegacyStorageReader {
  getItem(key: string): string | null;
}

function parseRecordMap(source: string | null): Record<string, unknown> {
  if (!source) return {};
  try {
    const parsed: unknown = JSON.parse(source);
    return typeof parsed === "object" && parsed !== null && !Array.isArray(parsed) ? parsed as Record<string, unknown> : {};
  } catch {
    return {};
  }
}

function asRecord(value: unknown): Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value) ? value as Record<string, unknown> : {};
}

function legacyColor(value: unknown, fallback: string): string {
  return typeof value === "string" && /^#[0-9a-f]{6}$/i.test(value) ? value : fallback;
}

function migrateLegacyColors(value: unknown): BrandColors {
  const colors = asRecord(value);
  const fallback = DEFAULT_BRAND_SETTINGS.colors;
  return {
    background: legacyColor(colors.background, fallback.background),
    surface: legacyColor(colors.surface, fallback.surface),
    accent: legacyColor(colors.accent, fallback.accent),
    accentSoft: legacyColor(colors.accentSoft, fallback.accentSoft),
    text: legacyColor(colors.text, fallback.text),
    muted: legacyColor(colors.muted, fallback.muted),
    codeBackground: legacyColor(colors.codeBackground, fallback.codeBackground),
    codeText: legacyColor(colors.codeText, fallback.codeText),
    border: legacyColor(colors.border, fallback.border),
  };
}

export async function migrateLegacyLocalStorageData(
  storage: LegacyStorageReader | null = typeof localStorage === "undefined" ? null : localStorage,
): Promise<number> {
  const database = getCarouselStudioDatabase();
  if ((await database.metadata.get(MIGRATION_MARKER)) || !storage) return 0;
  let projectMap: Record<string, unknown> = {};
  let brandKitMap: Record<string, unknown> = {};
  try {
    projectMap = parseRecordMap(storage.getItem(LEGACY_PROJECTS_KEY));
    brandKitMap = parseRecordMap(storage.getItem(LEGACY_BRAND_KITS_KEY));
  } catch {
    await database.metadata.put({ key: MIGRATION_MARKER, value: { imported: 0 } });
    return 0;
  }

  let imported = 0;
  await database.transaction("rw", database.projects, database.assets, database.brandKits, database.metadata, async () => {
    for (const rawEntry of Object.values(projectMap)) {
      const entry = asRecord(rawEntry);
      try {
        const result = migrateProjectDocument(entry.document ?? rawEntry);
        if (await database.projects.get(result.document.id)) continue;
        const document = { ...result.document, revision: Math.max(1, result.document.revision) };
        await database.projects.put({ id: document.id, name: document.name, revision: document.revision, updatedAt: document.updatedAt, document });
        for (const asset of result.extractedAssets) {
          try {
            const blob = legacySourceToBlob(asset.source);
            await database.assets.put({ id: asset.id, projectId: document.id, name: asset.name, mimeType: blob.type || "application/octet-stream", byteLength: blob.size, blob, createdAt: new Date().toISOString() });
          } catch {
            // A broken legacy image must not block the rest of the project import.
          }
        }
        imported += 1;
      } catch {
        // Skip corrupted legacy records and continue with recoverable projects.
      }
    }

    for (const [fallbackId, rawKit] of Object.entries(brandKitMap)) {
      const kit = asRecord(rawKit);
      const parsed = brandKitSchema.safeParse({
        id: typeof kit.id === "string" ? kit.id : fallbackId,
        name: typeof kit.name === "string" ? kit.name : "هوية مستوردة",
        description: typeof kit.description === "string" ? kit.description : "مستوردة من Carousel Studio V1",
        settings: {
          ...DEFAULT_BRAND_SETTINGS,
          colors: migrateLegacyColors(kit.colors),
          radius: typeof kit.radius === "number" ? Math.min(240, Math.max(0, kit.radius)) : DEFAULT_BRAND_SETTINGS.radius,
        },
      });
      if (!parsed.success) continue;
      const now = new Date().toISOString();
      await database.brandKits.put({ ...parsed.data, createdAt: now, updatedAt: now });
    }
    await database.metadata.put({ key: MIGRATION_MARKER, value: { imported, completedAt: new Date().toISOString() } });
  });
  return imported;
}
