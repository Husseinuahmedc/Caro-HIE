import { describe, expect, it } from "vitest";

import { createBlankProjectDocument } from "@/core/document";
import { DocumentTransactionHistory } from "@/core/history";

describe("domain transaction history", () => {
  it("records many transient pointer updates as one entry", () => {
    const history = new DocumentTransactionHistory();
    const before = createBlankProjectDocument();
    history.begin(before, { label: "Move", kind: "layer" });
    const after = structuredClone(before);
    after.slides[0]!.layers[0]!.x += 320;
    expect(history.commit(after)).toBe(true);
    expect(history.undo()?.slides[0]?.layers[0]?.x).toBe(before.slides[0]?.layers[0]?.x);
    expect(history.canUndo).toBe(false);
    expect(history.redo()?.slides[0]?.layers[0]?.x).toBe(after.slides[0]?.layers[0]?.x);
  });

  it("does not record a transaction with no document change", () => {
    const history = new DocumentTransactionHistory();
    const document = createBlankProjectDocument();
    history.begin(document, { label: "No-op", kind: "layer" });
    expect(history.commit(document)).toBe(false);
    expect(history.canUndo).toBe(false);
  });
});
