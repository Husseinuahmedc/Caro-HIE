import { describe, expect, it } from "vitest";

import {
  createBlankProjectDocument,
  createShapeLayer,
  createTextLayer,
  type GroupLayer,
  type SlideDocument,
} from "@/core/document";
import { moveLayerToPosition } from "@/core/engine";
import { changeLayerPosition } from "@/editor/commands";
import { DocumentSession } from "@/editor/state/document-session";

describe("layer ordering", () => {
  it("moves a layer to the target visual position", () => {
    const back = createShapeLayer({ id: "back" });
    const middle = createTextLayer({ id: "middle" });
    const front = createTextLayer({ id: "front" });
    const slide: SlideDocument = {
      id: "slide",
      name: "Slide",
      layers: [back, middle, front],
    };

    const result = moveLayerToPosition(slide, front.id, back.id);

    expect(result.changed).toBe(true);
    expect(result.slide.layers.map((layer) => layer.id)).toEqual(["front", "back", "middle"]);
  });

  it("reorders children without changing their group", () => {
    const first = createTextLayer({ id: "first", x: 0, y: 0 });
    const second = createTextLayer({ id: "second", x: 0, y: 0 });
    const group: GroupLayer = {
      id: "group",
      type: "group",
      name: "Group",
      x: 0,
      y: 0,
      width: 500,
      height: 500,
      rotation: 0,
      opacity: 1,
      visible: true,
      locked: false,
      children: [first, second],
    };
    const slide: SlideDocument = { id: "slide", name: "Slide", layers: [group] };

    const result = moveLayerToPosition(slide, second.id, first.id);
    const nextGroup = result.slide.layers[0];

    expect(result.changed).toBe(true);
    expect(nextGroup?.type === "group" ? nextGroup.children.map((layer) => layer.id) : []).toEqual([
      "second",
      "first",
    ]);
  });

  it("rejects moving a locked layer or moving between collections", () => {
    const locked = createTextLayer({ id: "locked", locked: true });
    const child = createTextLayer({ id: "child", x: 0, y: 0 });
    const group: GroupLayer = {
      id: "group",
      type: "group",
      name: "Group",
      x: 0,
      y: 0,
      width: 500,
      height: 500,
      rotation: 0,
      opacity: 1,
      visible: true,
      locked: false,
      children: [child],
    };
    const slide: SlideDocument = { id: "slide", name: "Slide", layers: [locked, group] };

    expect(moveLayerToPosition(slide, locked.id, group.id).changed).toBe(false);
    expect(moveLayerToPosition(slide, child.id, locked.id).changed).toBe(false);
  });

  it("records drag ordering as one undoable document action", () => {
    const document = createBlankProjectDocument();
    const slide = document.slides[0]!;
    const shape = createShapeLayer({ id: "shape" });
    slide.layers.push(shape);
    const originalOrder = slide.layers.map((layer) => layer.id);
    const session = new DocumentSession(document);

    changeLayerPosition(session, slide.id, shape.id, originalOrder[0]!);

    expect(session.getSnapshot().slides[0]?.layers.map((layer) => layer.id)).toEqual([
      shape.id,
      originalOrder[0],
    ]);
    expect(session.canUndo).toBe(true);
    expect(session.undo()).toBe(true);
    expect(session.getSnapshot().slides[0]?.layers.map((layer) => layer.id)).toEqual(originalOrder);
  });
});
