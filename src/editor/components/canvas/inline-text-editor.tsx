"use client";

import { useEffect, useRef } from "react";
import type { TextLayer } from "@/core/document";
import { getTextStyle, TEXT_CONTENT_STYLE } from "@/renderer/shared/layer-presentation";

export function InlineTextEditor({ layer, onCommit, onCancel }: {
  layer: TextLayer;
  onCommit: (content: string) => void;
  onCancel: () => void;
}) {
  const ref = useRef<HTMLSpanElement>(null);
  const finished = useRef(false);
  const initialContent = useRef(layer.content);
  useEffect(() => {
    const element = ref.current;
    if (!element) return;
    element.innerText = initialContent.current;
    element.focus({ preventScroll: true });
    const range = document.createRange();
    range.selectNodeContents(element);
    const selection = window.getSelection();
    selection?.removeAllRanges();
    selection?.addRange(range);
  }, []);

  return <div className="h-full w-full" style={getTextStyle(layer)} onPointerDown={(event) => event.stopPropagation()}>
    <span ref={ref} role="textbox" aria-label="تحرير النص مباشرة" aria-multiline="true" contentEditable suppressContentEditableWarning dir={layer.direction}
      className="outline-none" style={{ ...TEXT_CONTENT_STYLE, minHeight: "1em", cursor: "text", userSelect: "text" }}
      onBlur={() => { if (!finished.current) { finished.current = true; onCommit(ref.current?.innerText ?? layer.content); } }}
      onKeyDown={(event) => {
        event.stopPropagation();
        if (event.key === "Escape") { event.preventDefault(); finished.current = true; onCancel(); }
        if ((event.ctrlKey || event.metaKey) && event.key === "Enter") { event.preventDefault(); event.currentTarget.blur(); }
      }}
      onPaste={(event) => {
        event.preventDefault();
        const selection = window.getSelection();
        if (!selection?.rangeCount) return;
        const range = selection.getRangeAt(0);
        range.deleteContents();
        const text = document.createTextNode(event.clipboardData.getData("text/plain"));
        range.insertNode(text);
        range.setStartAfter(text);
        range.collapse(true);
        selection.removeAllRanges(); selection.addRange(range);
      }} />
  </div>;
}
