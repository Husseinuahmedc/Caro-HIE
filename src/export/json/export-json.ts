import type { ProjectDocument } from "@/core/document";

export function exportProjectAsJson(document: ProjectDocument): Blob {
  return new Blob([JSON.stringify(document, null, 2)], { type: "application/json;charset=utf-8" });
}
