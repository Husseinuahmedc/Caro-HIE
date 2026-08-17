import { getFramePreset, type ProjectDocument } from "../document";
import { contrastRule } from "./rules/contrast";
import { missingCoverRule, weakCoverRule } from "./rules/cover";
import { denseCodeRule } from "./rules/dense-code";
import { emptySlideRule } from "./rules/empty-slide";
import { longTextRule } from "./rules/long-text";
import { overflowRule, safeAreaRule } from "./rules/bounds";
import type { PreflightIssue, PreflightRule } from "./preflight-types";

export const PREFLIGHT_RULES: readonly PreflightRule[] = [
  missingCoverRule,
  weakCoverRule,
  emptySlideRule,
  longTextRule,
  denseCodeRule,
  safeAreaRule,
  overflowRule,
  contrastRule,
];

export function runPreflight(document: ProjectDocument): PreflightIssue[] {
  const frame = getFramePreset(document.framePresetId);
  return PREFLIGHT_RULES.flatMap((rule) => {
    if (rule.scope === "document") return rule.run({ document, frame });
    return document.slides.flatMap((slide) => rule.run({ document, frame, slide }));
  });
}
