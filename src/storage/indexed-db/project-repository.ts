import { migrateProjectDocument, parseProjectDocument, type ProjectDocument } from "@/core/document";
import { getCarouselStudioDatabase, type StoredProjectRecord } from "./database";
import { normalizeStorageError, ProjectNotFoundError, RevisionConflictError } from "./storage-errors";

export interface ProjectSummary {
  id: string;
  name: string;
  revision: number;
  updatedAt: string;
  slideCount: number;
  framePresetId: ProjectDocument["framePresetId"];
}

function asRecord(document: ProjectDocument): StoredProjectRecord {
  return {
    id: document.id,
    name: document.name,
    revision: document.revision,
    updatedAt: document.updatedAt,
    document: structuredClone(document),
  };
}

export async function listProjects(): Promise<ProjectSummary[]> {
  try {
    const records = await getCarouselStudioDatabase().projects.orderBy("updatedAt").reverse().toArray();
    return records.map((record) => {
      const document = migrateProjectDocument(record.document).document;
      return {
        id: document.id,
        name: document.name,
        revision: document.revision,
        updatedAt: document.updatedAt,
        slideCount: document.slides.length,
        framePresetId: document.framePresetId,
      };
    });
  } catch (error) {
    throw normalizeStorageError(error);
  }
}

export async function loadProject(projectId: string): Promise<ProjectDocument> {
  try {
    const record = await getCarouselStudioDatabase().projects.get(projectId);
    if (!record) throw new ProjectNotFoundError(projectId);
    return migrateProjectDocument(record.document).document;
  } catch (error) {
    throw normalizeStorageError(error);
  }
}

export async function createProject(document: ProjectDocument): Promise<ProjectDocument> {
  try {
    const database = getCarouselStudioDatabase();
    const existing = await database.projects.get(document.id);
    if (existing) throw new RevisionConflictError(document.id, 0, existing.revision);
    const now = new Date().toISOString();
    const created = parseProjectDocument({ ...document, revision: 1, createdAt: now, updatedAt: now });
    await database.projects.add(asRecord(created));
    return created;
  } catch (error) {
    throw normalizeStorageError(error);
  }
}

export async function saveProject(
  document: ProjectDocument,
  expectedRevision = document.revision,
): Promise<ProjectDocument> {
  try {
    const database = getCarouselStudioDatabase();
    return await database.transaction("rw", database.projects, database.recoveries, async () => {
      const current = await database.projects.get(document.id);
      if (!current) throw new ProjectNotFoundError(document.id);
      if (current.revision !== expectedRevision) {
        throw new RevisionConflictError(document.id, expectedRevision, current.revision);
      }
      const currentDocument = migrateProjectDocument(current.document).document;
      await database.recoveries.put({
        id: `${currentDocument.id}:${currentDocument.revision}`,
        projectId: currentDocument.id,
        revision: currentDocument.revision,
        createdAt: new Date().toISOString(),
        document: currentDocument,
      });
      const saved = parseProjectDocument({
        ...document,
        revision: current.revision + 1,
        updatedAt: new Date().toISOString(),
      });
      await database.projects.put(asRecord(saved));
      const snapshots = await database.recoveries.where("projectId").equals(document.id).sortBy("revision");
      if (snapshots.length > 8) {
        await database.recoveries.bulkDelete(snapshots.slice(0, snapshots.length - 8).map((snapshot) => snapshot.id));
      }
      return saved;
    });
  } catch (error) {
    throw normalizeStorageError(error);
  }
}

export async function restoreProject(projectId: string, recoveryRevision: number): Promise<ProjectDocument> {
  try {
    const database = getCarouselStudioDatabase();
    const current = await database.projects.get(projectId);
    if (!current) throw new ProjectNotFoundError(projectId);
    const recovery = await database.recoveries.get(`${projectId}:${recoveryRevision}`);
    if (!recovery) throw new ProjectNotFoundError(`${projectId}:${recoveryRevision}`);
    const recoveredDocument = migrateProjectDocument(recovery.document).document;
    return saveProject({ ...recoveredDocument, revision: current.revision }, current.revision);
  } catch (error) {
    throw normalizeStorageError(error);
  }
}

export async function deleteProject(projectId: string): Promise<void> {
  try {
    const database = getCarouselStudioDatabase();
    await database.transaction("rw", database.projects, database.assets, database.recoveries, async () => {
      await database.projects.delete(projectId);
      await database.assets.where("projectId").equals(projectId).delete();
      await database.recoveries.where("projectId").equals(projectId).delete();
    });
  } catch (error) {
    throw normalizeStorageError(error);
  }
}
