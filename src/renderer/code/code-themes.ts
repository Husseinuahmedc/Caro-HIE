import type { CodeThemeId } from "@/core/document";

export type CodeTokenKind =
  | "plain"
  | "keyword"
  | "string"
  | "number"
  | "comment"
  | "property"
  | "tag"
  | "punctuation";

export interface CodeThemeDefinition {
  background: string;
  text: string;
  keyword: string;
  string: string;
  number: string;
  comment: string;
  property: string;
  tag: string;
  punctuation: string;
  lineNumber: string;
  highlight: string;
}

export const CODE_THEME_DEFINITIONS: Record<CodeThemeId, CodeThemeDefinition> = {
  midnight: {
    background: "#0f172a",
    text: "#e2e8f0",
    keyword: "#c084fc",
    string: "#86efac",
    number: "#fbbf24",
    comment: "#94a3b8",
    property: "#7dd3fc",
    tag: "#67e8f9",
    punctuation: "#cbd5e1",
    lineNumber: "#64748b",
    highlight: "#1e293b",
  },
  "github-dark": {
    background: "#0d1117",
    text: "#e6edf3",
    keyword: "#ff7b72",
    string: "#a5d6ff",
    number: "#79c0ff",
    comment: "#8b949e",
    property: "#d2a8ff",
    tag: "#7ee787",
    punctuation: "#c9d1d9",
    lineNumber: "#6e7681",
    highlight: "#161b22",
  },
  sand: {
    background: "#2d211d",
    text: "#fff8ec",
    keyword: "#e9b896",
    string: "#a7d7c5",
    number: "#f4c57a",
    comment: "#aa9388",
    property: "#f3c5a6",
    tag: "#86d3dc",
    punctuation: "#e5d6ca",
    lineNumber: "#8f766b",
    highlight: "#49352d",
  },
  paper: {
    background: "#fffaf2",
    text: "#32231f",
    keyword: "#a6461f",
    string: "#277557",
    number: "#8c5f00",
    comment: "#90786d",
    property: "#7049a3",
    tag: "#0f7280",
    punctuation: "#5c4540",
    lineNumber: "#b09a8e",
    highlight: "#f3e4d2",
  },
};

export function getCodeTheme(themeId: CodeThemeId): CodeThemeDefinition {
  return CODE_THEME_DEFINITIONS[themeId];
}

export function getCodeTokenColor(
  themeId: CodeThemeId,
  kind: CodeTokenKind,
  plainColor: string,
): string {
  return kind === "plain" ? plainColor : getCodeTheme(themeId)[kind];
}
