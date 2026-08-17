import { parseProjectDocument } from "../schema";
import { CURRENT_SCHEMA_VERSION, type ProjectDocument } from "../types";
import { isRecord } from "./migration-values";
import { migrateVersionOneToTwo, type ExtractedLegacyAsset } from "./v1-to-v2";
import { migrateVersionTwoToThree } from "./v2-to-v3";

export interface DocumentMigrationResult {
  document: ProjectDocument;
  extractedAssets: ExtractedLegacyAsset[];
  migratedFrom: number;
}

export class UnsupportedDocumentVersionError extends Error {
  constructor(version: number) {
    super(`Project schema version ${version} is newer than this app supports.`);
    this.name = "UnsupportedDocumentVersionError";
  }
}

export function migrateProjectDocument(input: unknown): DocumentMigrationResult {
  if (!isRecord(input)) throw new Error("Project document must be an object.");
  const version = typeof input.schemaVersion === "number" ? input.schemaVersion : 1;
  if (version > CURRENT_SCHEMA_VERSION) throw new UnsupportedDocumentVersionError(version);

  if (version === CURRENT_SCHEMA_VERSION) {
    return { document: parseProjectDocument(input), extractedAssets: [], migratedFrom: version };
  }

  if (version === 2) {
    return {
      document: migrateVersionTwoToThree(input),
      extractedAssets: [],
      migratedFrom: version,
    };
  }

  const versionTwo = migrateVersionOneToTwo(input);
  return {
    document: migrateVersionTwoToThree(versionTwo.document),
    extractedAssets: versionTwo.extractedAssets,
    migratedFrom: version,
  };
}
