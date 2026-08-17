import type { ProjectDocument } from "./types";

export function copyProjectDocument(document: ProjectDocument): ProjectDocument {
  return structuredClone(document);
}
