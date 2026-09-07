import { afterEach, describe, expect, it } from "vitest";
import { createBlankProjectDocument, createImageLayer } from "@/core/document";
import { createProject, getCarouselStudioDatabase, loadProjectAssets, listProjects } from "@/storage";
import { importProjectBackup } from "@/storage/recovery/project-backup";

afterEach(async () => {
  const db = getCarouselStudioDatabase();
  await db.projects.clear(); await db.assets.clear();
});

describe("portable project backups", () => {
  it("restores images under new IDs without overwriting the original project", async () => {
    const original = createBlankProjectDocument();
    original.slides[0]!.layers = [createImageLayer({assetId: "old-image"})];
    await createProject(original);
    const restored = await importProjectBackup({format: "caro-hie-backup", version: 1, document: original, assets: [{id: "old-image", name: "test.png", source: "data:image/png;base64,aW1hZ2U="}]});
    expect(restored.id).not.toBe(original.id);
    const assets = await loadProjectAssets(restored.id);
    expect(assets).toHaveLength(1);
    expect(await assets[0]!.blob.text()).toBe("image");
    expect(restored.slides[0]!.layers[0]).toMatchObject({assetId: assets[0]!.id});
    expect(assets[0]!.id).not.toBe("old-image");
    expect(await listProjects()).toHaveLength(2);
  });

  it("rejects incomplete backups without leaving partial projects", async () => {
    const document = createBlankProjectDocument();
    document.slides[0]!.layers = [createImageLayer({assetId: "missing"})];
    await expect(importProjectBackup({format: "caro-hie-backup", version: 1, document, assets: []})).rejects.toThrow();
    expect(await listProjects()).toHaveLength(0);
  });
});
