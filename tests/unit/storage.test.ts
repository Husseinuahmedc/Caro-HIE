import { afterEach, describe, expect, it } from "vitest";

import { createBlankProjectDocument } from "@/core/document";
import { createLocalBrandKit, createProject, getCarouselStudioDatabase, listLocalBrandKits, listProjects, loadProject, migrateLegacyLocalStorageData, RevisionConflictError, saveProject, storeAsset } from "@/storage";

afterEach(async () => {
  const database = getCarouselStudioDatabase();
  await database.projects.clear();
  await database.assets.clear();
  await database.recoveries.clear();
  await database.brandKits.clear();
  await database.metadata.clear();
});

describe("IndexedDB repositories", () => {
  it("protects project revisions and writes recovery snapshots", async () => {
    const created = await createProject(createBlankProjectDocument());
    const edited = { ...created, name: "Edited" };
    const saved = await saveProject(edited, created.revision);
    expect(saved.revision).toBe(created.revision + 1);
    await expect(saveProject(edited, created.revision)).rejects.toBeInstanceOf(RevisionConflictError);
    expect((await loadProject(created.id)).name).toBe("Edited");
    expect(await getCarouselStudioDatabase().recoveries.where("projectId").equals(created.id).count()).toBe(1);
  });

  it("stores image blobs separately from JSON documents", async () => {
    const project = await createProject(createBlankProjectDocument());
    const asset = await storeAsset(project.id, new Blob(["image"], { type: "image/png" }), "fixture.png");
    expect(asset.mimeType).toBe("image/png");
    expect(JSON.stringify(await loadProject(project.id))).not.toContain("data:image");
  });

  it("stores reusable custom Brand Kits locally", async () => {
    const document = createBlankProjectDocument();
    const kit = await createLocalBrandKit("My kit", "Local", document.brand);
    expect((await listLocalBrandKits())[0]).toMatchObject({ id: kit.id, name: "My kit" });
  });

  it("imports V1 localStorage projects only once", async () => {
    const legacy = {
      legacy: {
        id: "legacy",
        revision: 2,
        updatedAt: new Date().toISOString(),
        document: { id: "legacy", name: "Legacy project", frame: "square", slides: [{ id: "cover", name: "Cover", role: "cover", layers: [] }] },
      },
    };
    const storage = { getItem: (key: string) => key.includes("projects") ? JSON.stringify(legacy) : null };
    expect(await migrateLegacyLocalStorageData(storage)).toBe(1);
    expect((await listProjects()).some((project) => project.id === "legacy")).toBe(true);
    expect(await migrateLegacyLocalStorageData(storage)).toBe(0);
  });
});
