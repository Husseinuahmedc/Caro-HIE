import Dexie, { type EntityTable } from "dexie";

import type { ProjectDocument } from "@/core/document";
import type { BrandSettings } from "@/core/document";

export interface StoredProjectRecord {
  id: string;
  name: string;
  revision: number;
  updatedAt: string;
  document: ProjectDocument | unknown;
}

export interface StoredAssetRecord {
  id: string;
  projectId: string;
  name: string;
  mimeType: string;
  byteLength: number;
  blob: Blob;
  createdAt: string;
}

export interface RecoveryRecord {
  id: string;
  projectId: string;
  revision: number;
  createdAt: string;
  document: ProjectDocument | unknown;
}

export interface StoredBrandKitRecord {
  id: string;
  name: string;
  description: string;
  settings: BrandSettings;
  createdAt: string;
  updatedAt: string;
}

export interface MetadataRecord {
  key: string;
  value: unknown;
}

export class CarouselStudioDatabase extends Dexie {
  projects!: EntityTable<StoredProjectRecord, "id">;
  assets!: EntityTable<StoredAssetRecord, "id">;
  recoveries!: EntityTable<RecoveryRecord, "id">;
  brandKits!: EntityTable<StoredBrandKitRecord, "id">;
  metadata!: EntityTable<MetadataRecord, "key">;

  constructor() {
    super("carousel-studio-v2");
    this.version(1).stores({
      projects: "id, name, revision, updatedAt",
      assets: "id, projectId, createdAt",
      recoveries: "id, projectId, revision, createdAt",
    });
    this.version(2).stores({
      projects: "id, name, revision, updatedAt",
      assets: "id, projectId, createdAt",
      recoveries: "id, projectId, revision, createdAt",
      brandKits: "id, name, updatedAt",
      metadata: "key",
    });
  }
}

let database: CarouselStudioDatabase | null = null;

export function getCarouselStudioDatabase(): CarouselStudioDatabase {
  if (typeof indexedDB === "undefined") {
    throw new Error("IndexedDB is available in the browser only.");
  }
  database ??= new CarouselStudioDatabase();
  return database;
}
