import type { ProjectDocument } from "@/core/document";
import { getCarouselStudioDatabase, type RecoveryRecord } from "../indexed-db/database";

const RECOVERY_LIMIT_PER_PROJECT = 8;

export async function writeRecoverySnapshot(document: ProjectDocument): Promise<void> {
  const database = getCarouselStudioDatabase();
  const record: RecoveryRecord = {
    id: `${document.id}:${document.revision}`,
    projectId: document.id,
    revision: document.revision,
    createdAt: new Date().toISOString(),
    document: structuredClone(document),
  };
  await database.recoveries.put(record);
  const snapshots = await database.recoveries.where("projectId").equals(document.id).sortBy("revision");
  const stale = snapshots.slice(0, Math.max(0, snapshots.length - RECOVERY_LIMIT_PER_PROJECT));
  if (stale.length) await database.recoveries.bulkDelete(stale.map((snapshot) => snapshot.id));
}

export async function listRecoverySnapshots(projectId: string): Promise<RecoveryRecord[]> {
  const snapshots = await getCarouselStudioDatabase().recoveries.where("projectId").equals(projectId).sortBy("revision");
  return snapshots.reverse();
}
