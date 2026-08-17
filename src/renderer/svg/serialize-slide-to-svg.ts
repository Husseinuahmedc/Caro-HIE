import type { Layer, ProjectDocument, SlideDocument } from "@/core/document";
import { getFramePreset } from "@/core/document";
import { getEditorFontFamily } from "@/fonts";

export type ExportAssetSources = ReadonlyMap<string, string>;

function escapeXml(value: string): string {
  return value.replaceAll("&", "&amp;").replaceAll("<", "&lt;").replaceAll(">", "&gt;").replaceAll('"', "&quot;").replaceAll("'", "&apos;");
}

function layerTransform(layer: Layer): string {
  return `translate(${layer.x} ${layer.y}) rotate(${layer.rotation} ${layer.width / 2} ${layer.height / 2})`;
}

function wrapParagraph(paragraph: string, maximumCharacters: number): string[] {
  if (!paragraph) return [""];
  const lines: string[] = [];
  let current = "";
  for (const word of paragraph.split(/\s+/)) {
    if (!word) continue;
    if (word.length > maximumCharacters) {
      if (current) lines.push(current);
      for (let offset = 0; offset < word.length; offset += maximumCharacters) {
        lines.push(word.slice(offset, offset + maximumCharacters));
      }
      current = "";
    } else if (!current) {
      current = word;
    } else if (`${current} ${word}`.length <= maximumCharacters) {
      current = `${current} ${word}`;
    } else {
      lines.push(current);
      current = word;
    }
  }
  if (current) lines.push(current);
  return lines.length ? lines : [""];
}

function wrapText(content: string, maximumCharacters: number): string[] {
  return content.split("\n").flatMap((paragraph) => wrapParagraph(paragraph, maximumCharacters));
}

function wrapCode(content: string, maximumCharacters: number): string[] {
  return content.split("\n").flatMap((line) => {
    if (!line) return [""];
    return Array.from({ length: Math.ceil(line.length / maximumCharacters) }, (_, index) =>
      line.slice(index * maximumCharacters, (index + 1) * maximumCharacters),
    );
  });
}

function serializeLayer(layer: Layer, assets: ExportAssetSources): string {
  if (!layer.visible) return "";
  const common = `transform="${layerTransform(layer)}" opacity="${layer.opacity}"`;
  if (layer.type === "group") {
    return `<g ${common}>${layer.children.map((child) => serializeLayer(child, assets)).join("")}</g>`;
  }
  if (layer.type === "shape") {
    if (layer.shape === "circle") {
      return `<ellipse ${common} cx="${layer.width / 2}" cy="${layer.height / 2}" rx="${layer.width / 2}" ry="${layer.height / 2}" fill="${layer.fill}" stroke="${layer.stroke}" stroke-width="${layer.strokeWidth}"/>`;
    }
    if (layer.shape === "line") {
      return `<line ${common} x1="0" y1="${layer.height / 2}" x2="${layer.width}" y2="${layer.height / 2}" stroke="${layer.stroke}" stroke-width="${Math.max(2, layer.strokeWidth)}" stroke-linecap="round"/>`;
    }
    return `<rect ${common} width="${layer.width}" height="${layer.height}" rx="${layer.radius}" fill="${layer.fill}" stroke="${layer.stroke}" stroke-width="${layer.strokeWidth}"/>`;
  }
  if (layer.type === "icon") {
    return `<text ${common} x="${layer.width / 2}" y="${layer.height / 2}" text-anchor="middle" dominant-baseline="central" fill="${layer.color}" font-size="${layer.fontSize}">${escapeXml(layer.icon)}</text>`;
  }
  if (layer.type === "image") {
    const source = layer.assetId ? assets.get(layer.assetId) : undefined;
    if (!source) return `<rect ${common} width="${layer.width}" height="${layer.height}" rx="${layer.radius}" fill="#e5e7eb"/>`;
    const clipId = `clip-${escapeXml(layer.id)}`;
    const preserve = layer.fit === "cover" ? "xMidYMid slice" : "xMidYMid meet";
    return `<g ${common}><defs><clipPath id="${clipId}"><rect width="${layer.width}" height="${layer.height}" rx="${layer.radius}"/></clipPath></defs><image href="${escapeXml(source)}" width="${layer.width}" height="${layer.height}" preserveAspectRatio="${preserve}" clip-path="url(#${clipId})"/></g>`;
  }
  if (layer.type === "code") {
    const clipId = `code-clip-${escapeXml(layer.id)}`;
    const usableWidth = Math.max(layer.fontSize, layer.width - layer.padding * 2);
    const maximumCharacters = Math.max(1, Math.floor(usableWidth / (layer.fontSize * 0.62)));
    const lineAdvance = layer.fontSize * layer.lineHeight;
    const lines = wrapCode(layer.code, maximumCharacters);
    const text = lines.map((line, index) => `<tspan x="${layer.padding}" dy="${index === 0 ? 0 : lineAdvance}">${escapeXml(line)}</tspan>`).join("");
    return `<g ${common}><defs><clipPath id="${clipId}"><rect width="${layer.width}" height="${layer.height}" rx="${layer.radius}"/></clipPath></defs><rect width="${layer.width}" height="${layer.height}" rx="${layer.radius}" fill="${layer.background}"/><text x="${layer.padding}" y="${layer.padding + layer.fontSize}" clip-path="url(#${clipId})" fill="${layer.color}" font-family="${escapeXml(getEditorFontFamily(layer.fontFamilyId))}" font-size="${layer.fontSize}" font-weight="500" direction="ltr" text-anchor="start" xml:space="preserve">${text}</text></g>`;
  }
  const maximumCharacters = Math.max(1, Math.floor(layer.width / (layer.fontSize * 0.55)));
  const lineAdvance = layer.fontSize * layer.lineHeight;
  const maximumLines = Math.max(1, Math.floor(layer.height / lineAdvance));
  const lines = wrapText(layer.content, maximumCharacters).slice(0, maximumLines);
  const contentHeight = lines.length * lineAdvance;
  const contentTop = layer.verticalAlign === "top" ? 0 : layer.verticalAlign === "bottom" ? layer.height - contentHeight : (layer.height - contentHeight) / 2;
  const textX = layer.align === "right" ? layer.width : layer.align === "center" ? layer.width / 2 : 0;
  const anchor = layer.align === "right" ? "end" : layer.align === "center" ? "middle" : "start";
  const clipId = `text-clip-${escapeXml(layer.id)}`;
  const text = lines.map((line, index) => `<tspan x="${textX}" dy="${index === 0 ? 0 : lineAdvance}">${escapeXml(line)}</tspan>`).join("");
  return `<g ${common}><defs><clipPath id="${clipId}"><rect width="${layer.width}" height="${layer.height}"/></clipPath></defs><text x="${textX}" y="${contentTop + layer.fontSize}" clip-path="url(#${clipId})" fill="${layer.color}" font-family="${escapeXml(getEditorFontFamily(layer.fontFamilyId))}" font-size="${layer.fontSize}" font-weight="${layer.fontWeight}" letter-spacing="${layer.letterSpacing}" direction="${layer.direction}" unicode-bidi="plaintext" text-anchor="${anchor}">${text}</text></g>`;
}

export function serializeSlideToSvg(
  document: ProjectDocument,
  slide: SlideDocument,
  assets: ExportAssetSources = new Map(),
  embeddedFontCss = "",
): string {
  const frame = getFramePreset(document.framePresetId);
  const style = embeddedFontCss ? `<style><![CDATA[${embeddedFontCss}]]></style>` : "";
  return `<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" width="${frame.width}" height="${frame.height}" viewBox="0 0 ${frame.width} ${frame.height}"><defs>${style}</defs><rect width="100%" height="100%" fill="${document.brand.colors.background}"/>${slide.layers.map((layer) => serializeLayer(layer, assets)).join("")}</svg>`;
}
