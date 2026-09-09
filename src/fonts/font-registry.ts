export interface EditorFontSource {
  path: string;
  format: "woff2" | "truetype" | "opentype";
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
  category: "core" | "display";
  license: string;
  licensePath: string | null;
  sources: readonly EditorFontSource[];
  stylesheetUrl?: string;
}

const ARABIC_UNICODE_RANGE = "U+0600-06FF,U+0750-077F,U+0870-08FF,U+200C-200E,U+FB50-FDFF,U+FE70-FEFC";
const LATIN_UNICODE_RANGE = "U+0000-024F,U+2000-206F,U+20AC,U+2122";

function uploadedDisplayFont(
  id: string,
  displayName: string,
  folder: string,
  weights: readonly number[],
  sources: ReadonlyArray<readonly [fileName: string, weight: string]>,
): EditorFontDefinition {
  return {
    id,
    displayName,
    family: `Carousel ${displayName}`,
    weights,
    style: "normal",
    provider: "bundled",
    category: "display",
    license: "User-supplied font; terms vary by family",
    licensePath: "/licenses/Uploaded-Font-Terms.txt",
    sources: sources.map(([fileName, weight]) => ({
      path: `/fonts/${folder}/${fileName}`,
      format: fileName.toLowerCase().endsWith(".otf") ? "opentype" : "truetype",
      weight,
    })),
  };
}

const UPLOADED_DISPLAY_FONTS: readonly EditorFontDefinition[] = [
  uploadedDisplayFont("qahwa-arabic", "Qahwa Arabic", "qahwa-arabic", [400, 500, 700, 900], [
    ["Qahwa Arabic.otf", "400"], ["Qahwa Arabic Medium.otf", "500"], ["Qahwa Arabic Bold.otf", "700"], ["Qahwa Arabic Black.otf", "900"],
  ]),
  uploadedDisplayFont("qahwa-arabic-salt", "Qahwa Arabic Salt", "qahwa-arabic", [400], [["Qahwa Arabic Salt.otf", "400"]]),
  uploadedDisplayFont("al-awwal", "Al-Awwal", "al-awwal", [400, 700], [["Al-Awwal-Regular.otf", "400"], ["Al-Awwal-Bold.otf", "700"]]),
  uploadedDisplayFont("jarood", "Jarood", "jarood", [400], [["Jarood.ttf", "400"]]),
  uploadedDisplayFont("founding-day", "FoundingDay Free", "founding-day", [400], [["FoundingDay-Regular-Free.otf", "400"]]),
  uploadedDisplayFont("sa-hazm", "SA Hazm", "sa-hazm", [300, 400, 500, 600, 700], [["SAHazmVF.ttf", "300 700"]]),
  uploadedDisplayFont("arsenica-arabic-trial", "Arsenica Arabic Trial", "arsenica-arabic", [100, 300, 400, 500, 600, 700, 800], [
    ["Arsenica-Arabic-Thin-TRIAL.ttf", "100"], ["Arsenica-Arabic-Light-TRIAL.ttf", "300"], ["Arsenica-Arabic-Regular-TRIAL.ttf", "400"],
    ["Arsenica-Arabic-Medium-TRIAL.ttf", "500"], ["Arsenica-Arabic-Demibold-TRIAL.ttf", "600"], ["Arsenica-Arabic-Bold-TRIAL.ttf", "700"],
    ["Arsenica-Arabic-Extrabold-TRIAL.ttf", "800"],
  ]),
  uploadedDisplayFont("milligram-arabic-trial", "Milligram Arabic Trial", "milligram-arabic", [200, 300, 400, 500, 700, 800, 900], [
    ["Milligram-Arabic-Thin-TRIAL.ttf", "200"], ["Milligram-Arabic-Light-TRIAL.ttf", "300"], ["Milligram-Arabic-Regular-TRIAL.ttf", "400"],
    ["Milligram-Arabic-Medium-TRIAL.ttf", "500"], ["Milligram-Arabic-Bold-TRIAL.ttf", "700"], ["Milligram-Arabic-Extrabold-TRIAL.ttf", "800"],
    ["Milligram-Arabic-Heavy-TRIAL.ttf", "900"],
  ]),
  uploadedDisplayFont("madika-arabic-trial", "Madika Arabic Trial", "madika-arabic", [100, 300, 400, 500, 600, 700, 900], [
    ["MadikaArabicTRIAL-Thin.otf", "100"], ["MadikaArabicTRIAL-Light.otf", "300"], ["MadikaArabicTRIAL-Regular.otf", "400"],
    ["MadikaArabicTRIAL-Medium.otf", "500"], ["MadikaArabicTRIAL-Bold.otf", "600"], ["MadikaArabicTRIAL-ExtraBold.otf", "700"],
    ["MadikaArabicTRIAL-Black.otf", "900"],
  ]),
  uploadedDisplayFont("lenos", "Lenos", "lenos", [100, 200, 300, 400, 500, 600, 700, 800, 900], [
    ["Lenos-Thin.otf", "100"], ["Lenos-ExtraLight.otf", "200"], ["Lenos-Light.otf", "300"], ["Lenos-Regular.otf", "400"],
    ["Lenos-Medium.otf", "500"], ["Lenos-SemiBold.otf", "600"], ["Lenos-Bold.otf", "700"], ["Lenos-ExtraBold.otf", "800"], ["Lenos-Black.otf", "900"],
  ]),
  uploadedDisplayFont("nan-superx-arabic-trial", "NaN SuperX Arabic Trial", "nan-superx-arabic", [100, 300, 400, 500, 600, 700, 800, 900], [
    ["NaNSuperXSansDisplayArabic-VF-TRIAL.ttf", "100 900"], ["NaNSuperXSansDisplayArabic-Thin-TRIAL.ttf", "100"],
    ["NaNSuperXSansDisplayArabic-Light-TRIAL.ttf", "300"], ["NaNSuperXSansDisplayArabic-Regular-TRIAL.ttf", "400"],
    ["NaNSuperXSansDisplayArabic-Medium-TRIAL.ttf", "500"], ["NaNSuperXSansDisplayArabic-Semibold-TRIAL.ttf", "600"],
    ["NaNSuperXSansDisplayArabic-Bold-TRIAL.ttf", "700"], ["NaNSuperXSansDisplayArabic-ExtraBold-TRIAL.ttf", "800"],
    ["NaNSuperXSansDisplayArabic-Black-TRIAL.ttf", "900"],
  ]),
  uploadedDisplayFont("mayson-arabic-trial", "Mayson Arabic Trial", "mayson-arabic", [100, 200, 300, 400, 500, 700, 800], [
    ["Mayson-Arabic-Mayson-Arabic-Thin-Trial.ttf", "100"], ["Mayson-Arabic-Mayson-Arabic-Extralight-Trial.ttf", "200"],
    ["Mayson-Arabic-Mayson-Arabic-Light-Trial.ttf", "300"], ["Mayson-Arabic-Mayson-Arabic-Regular-Trial.ttf", "400"],
    ["Mayson-Arabic-Mayson-Arabic-Medium-Trial.ttf", "500"], ["Mayson-Arabic-Mayson-Arabic-Bold-Trial.ttf", "700"],
    ["Mayson-Arabic-Mayson-Arabic-Extrabold-Trial.ttf", "800"],
  ]),
  uploadedDisplayFont("codec-pro-me-trial", "Codec Pro ME Trial", "codec-pro-me", [100, 200, 250, 300, 400, 500, 600, 700, 800, 850, 900], [
    ["Codec-Pro-ME-Codec-Pro-ME-Thin-Trial.ttf", "100"], ["Codec-Pro-ME-Codec-Pro-ME-Extralight-Trial.ttf", "200"],
    ["Codec-Pro-ME-Codec-Pro-ME-Light-Trial.ttf", "250"], ["Codec-Pro-ME-Codec-Pro-ME-News-Trial.ttf", "300"],
    ["Codec-Pro-ME-Codec-Pro-ME-Regular-Trial.ttf", "400"], ["Codec-Pro-ME-Codec-Pro-ME-Bold-Trial.ttf", "500"],
    ["Codec-Pro-ME-Codec-Pro-ME-Extrabold-Trial.ttf", "600"], ["Codec-Pro-ME-Codec-Pro-ME-Heavy-Trial.ttf", "700"],
    ["Codec-Pro-ME-Codec-Pro-ME-Ultra-Trial.ttf", "800"], ["Codec-Pro-ME-Codec-Pro-ME-Ultrablack-Trial.ttf", "850"],
    ["Codec-Pro-ME-Codec-Pro-ME-Fat-Trial.ttf", "900"],
  ]),
  uploadedDisplayFont("milan-display", "Milan Display", "milan-display", [900], [["Milan Display Black (1).otf", "900"]]),
  uploadedDisplayFont("milan-display-swashes", "Milan Display Swashes", "milan-display", [900], [["Milan Display Black Swashes (1).otf", "900"]]),
  uploadedDisplayFont("hagrid-arabic-trial", "Hagrid Arabic Trial", "hagrid-arabic", [100, 300, 400, 700, 800, 900], [
    ["Hagrid-Arabic-Hagrid-Arabic-Thin-Trial.ttf", "100"], ["Hagrid-Arabic-Hagrid-Arabic-Light-Trial.ttf", "300"],
    ["Hagrid-Arabic-Hagrid-Arabic-Regular-Trial.ttf", "400"], ["Hagrid-Arabic-Hagrid-Arabic-Bold-Trial.ttf", "700"],
    ["Hagrid-Arabic-Hagrid-Arabic-Extrabold-Trial.ttf", "800"], ["Hagrid-Arabic-Hagrid-Arabic-Heavy-Trial.ttf", "900"],
  ]),
  uploadedDisplayFont("hagrid-arabic-black-trial", "Hagrid Arabic Black Trial", "hagrid-arabic", [900], [["Hagrid-Arabic-Hagrid-Arabic-Black-Trial.ttf", "900"]]),
  uploadedDisplayFont("hagrid-text-arabic-trial", "Hagrid Text Arabic Trial", "hagrid-text-arabic", [400, 500, 700, 800, 900], [
    ["Hagrid-Arabic-Hagrid-Text-Arabic-Regular-Trial.ttf", "400"], ["Hagrid-Arabic-Hagrid-Text-Arabic-Medium-Trial.ttf", "500"],
    ["Hagrid-Arabic-Hagrid-Text-Arabic-Bold-Trial.ttf", "700"], ["Hagrid-Arabic-Hagrid-Text-Arabic-Extrabold-Trial.ttf", "800"],
    ["Hagrid-Arabic-Hagrid-Text-Arabic-Heavy-Trial.ttf", "900"],
  ]),
  uploadedDisplayFont("hagrid-variable-trial", "Hagrid Variable Trial", "hagrid-variable", [100, 200, 300, 400, 500, 600, 700, 800, 900], [["Hagrid-Variable-trial.ttf", "100 900"]]),
  uploadedDisplayFont("metras", "Metras", "metras", [700], [["Metras-Bold.ttf", "700"]]),
  uploadedDisplayFont("trox", "TROX", "trox", [400], [["Trox R.ttf", "400"]]),
  uploadedDisplayFont("insta-arabi", "InstaArabi", "insta-arabi", [400], [["InstaArabi-Regular.ttf", "400"]]),
  uploadedDisplayFont("f37-wicklow-arabic-trial", "F37 Wicklow Arabic Trial", "f37-wicklow-arabic", [300, 400, 500, 700, 800, 900], [
    ["F37WicklowArabicTrial-Light.otf", "300"], ["F37WicklowArabicTrial-Regular.otf", "400"], ["F37WicklowArabicTrial-Medium.otf", "500"],
    ["F37WicklowArabicTrial-Bold.otf", "700"], ["F37WicklowArabicTrial-ExtraBold.otf", "800"], ["F37WicklowArabicTrial-Black.otf", "900"],
  ]),
  uploadedDisplayFont("f37-wicklow-arabic-stencil-trial", "F37 Wicklow Arabic Stencil Trial", "f37-wicklow-arabic-stencil", [300, 400, 500, 700, 800, 900], [
    ["F37WicklowArabicStencilTrial-Light.otf", "300"], ["F37WicklowArabicStencilTrial-Regular.otf", "400"],
    ["F37WicklowArabicStencilTrial-Medium.otf", "500"], ["F37WicklowArabicStencilTrial-Bold.otf", "700"],
    ["F37WicklowArabicStencilTrial-ExtraBold.otf", "800"], ["F37WicklowArabicStencilTrial-Black.otf", "900"],
  ]),
];

export const EDITOR_FONT_REGISTRY = [
  {
    id: "noto-kufi-arabic",
    displayName: "Noto Kufi Arabic",
    family: "Carousel Noto Kufi Arabic",
    weights: [100, 200, 300, 400, 500, 600, 700, 800, 900],
    style: "normal",
    provider: "bundled",
    category: "core",
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
    category: "core",
    license: "SIL Open Font License 1.1",
    licensePath: "/licenses/IBM-Plex-Sans-Arabic-OFL.txt",
    sources: [400, 500, 600, 700].flatMap((weight) => [
      { path: `/fonts/ibm-plex-sans-arabic/ibm-plex-sans-arabic-arabic-${weight}-normal.woff2`, format: "woff2" as const, weight: String(weight), unicodeRange: ARABIC_UNICODE_RANGE },
      { path: `/fonts/ibm-plex-sans-arabic/ibm-plex-sans-arabic-latin-${weight}-normal.woff2`, format: "woff2" as const, weight: String(weight), unicodeRange: LATIN_UNICODE_RANGE },
    ]),
  },
  {
    id: "rooyin-free",
    displayName: "Rooyin Free",
    family: "Carousel Rooyin Free",
    weights: [400, 700],
    style: "normal",
    provider: "bundled",
    category: "display",
    license: "SIL Open Font License 1.1",
    licensePath: "/licenses/Ario-Rooyin-OFL.txt",
    sources: [
      { path: "/fonts/rooyin-free/RooyinFree-Regular.ttf", format: "truetype", weight: "400" },
      { path: "/fonts/rooyin-free/RooyinFree-Bold.ttf", format: "truetype", weight: "700" },
    ],
  },
  {
    id: "rooyin-free-dots-2",
    displayName: "Rooyin Free Dots 2",
    family: "Carousel Rooyin Free Dots 2",
    weights: [400],
    style: "normal",
    provider: "bundled",
    category: "display",
    license: "SIL Open Font License 1.1",
    licensePath: "/licenses/Ario-Rooyin-OFL.txt",
    sources: [
      { path: "/fonts/rooyin-free/RooyinFree-RegularDots2.ttf", format: "truetype", weight: "400" },
    ],
  },
  ...UPLOADED_DISPLAY_FONTS,
  {
    id: "cairo",
    displayName: "Cairo",
    family: "Cairo",
    weights: [300, 400, 500, 600, 700, 800, 900],
    style: "normal",
    provider: "google",
    category: "core",
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
    category: "core",
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
    category: "core",
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
    category: "core",
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
    category: "core",
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
    category: "core",
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
    category: "core",
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
