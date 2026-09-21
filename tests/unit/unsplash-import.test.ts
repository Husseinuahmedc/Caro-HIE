import { describe, expect, it, vi } from "vitest";

import { fetchUnsplashImage, getUnsplashImageUrl } from "@/editor/image-import/unsplash";

describe("Unsplash image import", () => {
  it("adds the default image delivery parameters", () => {
    const url = getUnsplashImageUrl("https://images.unsplash.com/photo-123");

    expect(url.toString()).toContain("auto=format");
    expect(url.toString()).toContain("fit=crop");
    expect(url.toString()).toContain("w=1600");
    expect(url.toString()).toContain("q=80");
    expect(url.toString()).toContain("fm=jpg");
  });

  it("guides users away from Unsplash page URLs", () => {
    expect(() => getUnsplashImageUrl("https://unsplash.com/photos/photo-123")).toThrow("Copy Image Address");
  });

  it("returns a validated local image blob", async () => {
    vi.stubGlobal("fetch", vi.fn().mockResolvedValue(
      new Response(new Blob(["image"], { type: "image/jpeg" }), { status: 200 }),
    ));

    const result = await fetchUnsplashImage("https://images.unsplash.com/photo-123");

    expect(result.blob.type).toBe("image/jpeg");
    expect(result.name).toMatch(/^unsplash-\d+\.jpg$/);
    vi.unstubAllGlobals();
  });
});