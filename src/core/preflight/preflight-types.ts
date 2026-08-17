import type { FramePreset, ProjectDocument, SlideDocument } from "../document";

export type PreflightSeverity = "info" | "warning" | "error";

export interface PreflightTarget {
  slideId?: string;
  layerId?: string;
}

export interface PreflightIssue {
  id: string;
  ruleId: string;
  severity: PreflightSeverity;
  message: string;
  target: PreflightTarget;
}

export interface PreflightContext {
  document: ProjectDocument;
  frame: FramePreset;
  slide?: SlideDocument;
}

export interface PreflightRule {
  id: string;
  scope: "document" | "slide";
  run(context: PreflightContext): PreflightIssue[];
}

export function issue(
  ruleId: string,
  severity: PreflightSeverity,
  message: string,
  target: PreflightTarget = {},
): PreflightIssue {
  return {
    id: `${ruleId}:${target.slideId ?? "document"}:${target.layerId ?? "all"}`,
    ruleId,
    severity,
    message,
    target,
  };
}
