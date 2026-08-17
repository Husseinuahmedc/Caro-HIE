import { parseProjectDocument } from "../schema";
import {
  CODE_LANGUAGES,
  CODE_THEMES,
  CURRENT_SCHEMA_VERSION,
  ICON_NAMES,
  type ProjectDocument,
} from "../types";
import {
  arrayOrEmpty,
  booleanOr,
  hexOr,
  numberOr,
  recordOrEmpty,
  type UnknownRecord,
} from "./migration-values";

function optionOr<T extends readonly string[]>(
  value: unknown,
  options: T,
  fallback: T[number],
): T[number] {
  return typeof value === "string" && (options as readonly string[]).includes(value)
    ? value as T[number]
    : fallback;
}

function migrateLayer(value: unknown): UnknownRecord {
  const layer = recordOrEmpty(value);

  if (layer.type === "group") {
    return {
      ...layer,
      children: arrayOrEmpty(layer.children).map(migrateLayer),
    };
  }

  if (layer.type === "code") {
    return {
      ...layer,
      language: optionOr(layer.language, CODE_LANGUAGES, "typescript"),
      theme: optionOr(layer.theme, CODE_THEMES, "sand"),
      showLineNumbers: booleanOr(layer.showLineNumbers, true),
      highlightedLines: arrayOrEmpty(layer.highlightedLines)
        .filter((line): line is number => typeof line === "number" && Number.isInteger(line))
        .filter((line) => line > 0 && line <= 999),
    };
  }

  if (layer.type === "icon") {
    return {
      ...layer,
      icon: optionOr(layer.icon, ICON_NAMES, "sparkles"),
      fill: layer.fill === "none" ? "none" : hexOr(layer.fill, "none"),
      strokeWidth: Math.min(4, Math.max(0.5, numberOr(layer.strokeWidth, 2))),
    };
  }

  return layer;
}

export function migrateVersionThreeToFour(input: UnknownRecord): ProjectDocument {
  return parseProjectDocument({
    ...input,
    schemaVersion: CURRENT_SCHEMA_VERSION,
    slides: arrayOrEmpty(input.slides).map((slideValue) => {
      const slide = recordOrEmpty(slideValue);
      return {
        ...slide,
        layers: arrayOrEmpty(slide.layers).map(migrateLayer),
      };
    }),
  });
}
