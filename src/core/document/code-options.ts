import type { CodeLanguage, CodeThemeId } from "./types";

export const CODE_LANGUAGE_OPTIONS: ReadonlyArray<{ value: CodeLanguage; label: string }> = [
  { value: "typescript", label: "TypeScript" },
  { value: "tsx", label: "TSX" },
  { value: "javascript", label: "JavaScript" },
  { value: "jsx", label: "JSX" },
  { value: "json", label: "JSON" },
  { value: "html", label: "HTML" },
  { value: "css", label: "CSS" },
  { value: "sql", label: "SQL" },
  { value: "python", label: "Python" },
  { value: "bash", label: "Shell / Bash" },
  { value: "text", label: "Plain text" },
];

export const CODE_THEME_OPTIONS: ReadonlyArray<{ value: CodeThemeId; label: string }> = [
  { value: "sand", label: "SiteHie Sand" },
  { value: "midnight", label: "Midnight" },
  { value: "github-dark", label: "GitHub Dark" },
  { value: "paper", label: "Paper Light" },
];
