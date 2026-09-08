import { getEditorFont, type EditorFontDefinition } from "./font-registry";

const loadedFonts = new Set<string>();
const pendingFonts = new Map<string, Promise<void>>();

async function loadBundledFont(font: EditorFontDefinition): Promise<void> {
  await Promise.all(
    font.sources.map(async (source) => {
      const response = await fetch(source.path);
      if (!response.ok) throw new Error(`Failed to load editor font: ${source.path}`);
      const descriptors: FontFaceDescriptors = {
        style: font.style,
        weight: source.weight,
      };
      if (source.unicodeRange) descriptors.unicodeRange = source.unicodeRange;
      const face = new FontFace(font.family, await response.arrayBuffer(), descriptors);
      const loaded = await face.load();
      document.fonts.add(loaded);
      return loaded;
    }),
  );
  const previewWeight = font.weights.includes(400) ? 400 : font.weights[0] ?? 400;
  await document.fonts.load(`${previewWeight} 32px "${font.family}"`, "أبجد هوز 123");
}

async function loadGoogleFont(font: EditorFontDefinition): Promise<void> {
  if (!font.stylesheetUrl) return;
  const selector = `link[data-editor-font-id="${font.id}"]`;
  let link = document.head.querySelector<HTMLLinkElement>(selector);

  if (!link) {
    link = document.createElement("link");
    link.rel = "stylesheet";
    link.href = font.stylesheetUrl;
    link.dataset.editorFontId = font.id;
    const stylesheetReady = new Promise<void>((resolve, reject) => {
      link?.addEventListener("load", () => resolve(), { once: true });
      link?.addEventListener("error", () => reject(new Error(`Failed to load font stylesheet: ${font.id}`)), { once: true });
    });
    document.head.appendChild(link);
    await stylesheetReady;
  } else if (!link.sheet) {
    await new Promise<void>((resolve, reject) => {
      link?.addEventListener("load", () => resolve(), { once: true });
      link?.addEventListener("error", () => reject(new Error(`Failed to load font stylesheet: ${font.id}`)), { once: true });
    });
  }

  const previewWeight = font.weights.includes(400) ? 400 : font.weights[0] ?? 400;
  await document.fonts.load(`${previewWeight} 16px "${font.family}"`);
}

async function loadFont(font: EditorFontDefinition): Promise<void> {
  if (font.provider === "bundled") await loadBundledFont(font);
  if (font.provider === "google") await loadGoogleFont(font);
}

export function loadEditorFont(fontId: string): Promise<void> {
  if (typeof document === "undefined" || loadedFonts.has(fontId)) return Promise.resolve();
  const pending = pendingFonts.get(fontId);
  if (pending) return pending;

  const font = getEditorFont(fontId);
  const loading = loadFont(font)
    .then(() => { loadedFonts.add(fontId); })
    .finally(() => { pendingFonts.delete(fontId); });

  pendingFonts.set(fontId, loading);
  return loading;
}

export async function loadDocumentFonts(fontIds: Iterable<string>): Promise<void> {
  await Promise.all([...new Set(fontIds)].map(loadEditorFont));
}
