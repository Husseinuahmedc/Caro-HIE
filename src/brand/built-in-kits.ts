import type { BrandKit } from "./brand-kit";

export const BUILT_IN_BRAND_KITS = [
  {
    id: "sitehie",
    name: "sitehie",
    description: "هوية هادئة بخلفية حجرية وأخضر داكن ولمسة سماوية.",
    settings: {
      colors: {
        background: "#f0eee9",
        surface: "#ffffff",
        accent: "#0ad8e2",
        accentSoft: "#dff7f7",
        text: "#19454b",
        muted: "#66777a",
        codeBackground: "#123a3f",
        codeText: "#efffff",
        border: "#b9cecf",
      },
      headingFontId: "noto-naskh-arabic",
      bodyFontId: "cairo",
      codeFontId: "system-mono",
      radius: 18,
    },
  },
  {
    id: "sandstone",
    name: "حجر رملي",
    description: "دافئ وهادئ للمحتوى التعليمي.",
    settings: {
      colors: {
        background: "#eadfce",
        surface: "#fffaf2",
        accent: "#c97950",
        accentSoft: "#e9b896",
        text: "#32231f",
        muted: "#90786d",
        codeBackground: "#2d211d",
        codeText: "#fff8ec",
        border: "#d9aa88",
      },
      headingFontId: "noto-kufi-arabic",
      bodyFontId: "ibm-plex-sans-arabic",
      codeFontId: "system-mono",
      radius: 28,
    },
  },
  {
    id: "midnight",
    name: "منتصف الليل",
    description: "تباين عالٍ وواجهة داكنة للكود والتقنية.",
    settings: {
      colors: {
        background: "#111827",
        surface: "#1f2937",
        accent: "#38bdf8",
        accentSoft: "#164e63",
        text: "#f8fafc",
        muted: "#cbd5e1",
        codeBackground: "#020617",
        codeText: "#e2e8f0",
        border: "#334155",
      },
      headingFontId: "noto-kufi-arabic",
      bodyFontId: "ibm-plex-sans-arabic",
      codeFontId: "system-mono",
      radius: 20,
    },
  },
  {
    id: "paper-ink",
    name: "حبر وورق",
    description: "ألوان محايدة مع لمسة زرقاء واضحة.",
    settings: {
      colors: {
        background: "#f8f7f3",
        surface: "#ffffff",
        accent: "#2563eb",
        accentSoft: "#dbeafe",
        text: "#172033",
        muted: "#667085",
        codeBackground: "#172033",
        codeText: "#f8fafc",
        border: "#d0d5dd",
      },
      headingFontId: "noto-kufi-arabic",
      bodyFontId: "ibm-plex-sans-arabic",
      codeFontId: "system-mono",
      radius: 16,
    },
  },
] as const satisfies readonly BrandKit[];

export function getBuiltInBrandKit(id: string): BrandKit | undefined {
  return BUILT_IN_BRAND_KITS.find((kit) => kit.id === id);
}
