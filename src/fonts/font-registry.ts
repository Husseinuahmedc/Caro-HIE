export interface EditorFontSource {
  path: string;
  format: "woff2";
  weight: string;
  unicodeRange?: string;
}

export type EditorFontProvider = "bundled" | "google" | "system";

export interface EditorFontDefinition {
  id: string;
  displayName: string;
  family: string;
  weights: readonly number[];
  style: "normal";
  provider: EditorFontProvider;
  license: string;
  licensePath: string | null;
  sources: readonly EditorFontSource[];
  stylesheetUrl?: string;
}

const ARABIC_UNICODE_RANGE = "U+0600-06FF,U+0750-077F,U+0870-08FF,U+200C-200E,U+FB50-FDFF,U+FE70-FEFC";
const LATIN_UNICODE_RANGE = "U+0000-024F,U+2000-206F,U+20AC,U+2122";

export const EDITOR_FONT_REGISTRY = [
  {
    id: "noto-kufi-arabic",
    displayName: "Noto Kufi Arabic",
    family: "Carousel Noto Kufi Arabic",
    weights: [100, 200, 300, 400, 500, 600, 700, 800, 900],
    style: "normal",
    provider: "bundled",
    license: "SIL Open Font License 1.1",
    licensePath: "/licenses/Noto-Kufi-Arabic-OFL.txt",
    sources: [
      { path: "/fonts/noto-kufi-arabic/arabic.woff2", format: "woff2", weight: "100 900", unicodeRange: ARABIC_UNICODE_RANGE },
      { path: "/fonts/noto-kufi-arabic/latin.woff2", format: "woff2", weight: "100 900", unicodeRange: LATIN_UNICODE_RANGE },
    ],
  },
  {
    id: "ibm-plex-sans-arabic",
    displayName: "IBM Plex Sans Arabic",
    family: "Carousel IBM Plex Sans Arabic",
    weights: [400, 500, 600, 700],
    style: "normal",
    provider: "bundled",
    license: "SIL Open Font License 1.1",
    licensePath: "/licenses/IBM-Plex-Sans-Arabic-OFL.txt",
    sources: [400, 500, 600, 700].flatMap((weight) => [
      { path: `/fonts/ibm-plex-sans-arabic/ibm-plex-sans-arabic-arabic-${weight}-normal.woff2`, format: "woff2" as const, weight: String(weight), unicodeRange: ARABIC_UNICODE_RANGE },
      { path: `/fonts/ibm-plex-sans-arabic/ibm-plex-sans-arabic-latin-${weight}-normal.woff2`, format: "woff2" as const, weight: String(weight), unicodeRange: LATIN_UNICODE_RANGE },
    ]),
  },
  {
    id: "cairo",
    displayName: "Cairo",
    family: "Cairo",
    weights: [300, 400, 500, 600, 700, 800, 900],
    style: "normal",
    provider: "google",
    license: "SIL Open Font License 1.1",
    licensePath: null,
    sources: [],
    stylesheetUrl: "https://fonts.googleapis.com/css2?family=Cairo:wght@300;400;500;600;700;800;900&display=swap",
  },
  {
    id: "tajawal",
    displayName: "Tajawal",
    family: "Tajawal",
    weights: [200, 300, 400, 500, 700, 800, 900],
    style: "normal",
    provider: "google",
    license: "SIL Open Font License 1.1",
    licensePath: null,
    sources: [],
    stylesheetUrl: "https://fonts.googleapis.com/css2?family=Tajawal:wght@200;300;400;500;700;800;900&display=swap",
  },
  {
    id: "alexandria",
    displayName: "Alexandria",
    family: "Alexandria",
    weights: [300, 400, 500, 600, 700, 800, 900],
    style: "normal",
    provider: "google",
    license: "SIL Open Font License 1.1",
    licensePath: null,
    sources: [],
    stylesheetUrl: "https://fonts.googleapis.com/css2?family=Alexandria:wght@300;400;500;600;700;800;900&display=swap",
  },
  {
    id: "almarai",
    displayName: "Almarai",
    family: "Almarai",
    weights: [300, 400, 700, 800],
    style: "normal",
    provider: "google",
    license: "SIL Open Font License 1.1",
    licensePath: null,
    sources: [],
    stylesheetUrl: "https://fonts.googleapis.com/css2?family=Almarai:wght@300;400;700;800&display=swap",
  },
  {
    id: "noto-naskh-arabic",
    displayName: "Noto Naskh Arabic",
    family: "Noto Naskh Arabic",
    weights: [400, 500, 600, 700],
    style: "normal",
    provider: "google",
    license: "SIL Open Font License 1.1",
    licensePath: null,
    sources: [],
    stylesheetUrl: "https://fonts.googleapis.com/css2?family=Noto+Naskh+Arabic:wght@400;500;600;700&display=swap",
  },
  {
    id: "amiri",
    displayName: "Amiri",
    family: "Amiri",
    weights: [400, 700],
    style: "normal",
    provider: "google",
    license: "SIL Open Font License 1.1",
    licensePath: null,
    sources: [],
    stylesheetUrl: "https://fonts.googleapis.com/css2?family=Amiri:wght@400;700&display=swap",
  },
  {
    id: "system-mono",
    displayName: "System Mono",
    family: "ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace",
    weights: [400, 500, 600, 700],
    style: "normal",
    provider: "system",
    license: "System font stack",
    licensePath: null,
    sources: [],
  },
] as const satisfies readonly EditorFontDefinition[];

export function getEditorFont(fontId: string): EditorFontDefinition {
  return EDITOR_FONT_REGISTRY.find((font) => font.id === fontId) ?? EDITOR_FONT_REGISTRY[1];
}

export function getEditorFontFamily(fontId: string): string {
  return getEditorFont(fontId).family;
}
