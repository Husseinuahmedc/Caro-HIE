import { parseProjectDocument } from "../schema";
import { CURRENT_SCHEMA_VERSION, type ProjectDocument } from "../types";
import type { UnknownRecord } from "./migration-values";
/** Preserve legacy artwork exactly; the new geometry/family fields remain optional. */
export function migrateVersionFourToFive(
  input: UnknownRecord,
): ProjectDocument {
  return parseProjectDocument({
    ...input,
    schemaVersion: CURRENT_SCHEMA_VERSION,
  });
}
