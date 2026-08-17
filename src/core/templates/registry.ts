import { beforeAfterTemplate } from "./definitions/before-after";
import { codeWalkthroughTemplate } from "./definitions/code-walkthrough";
import { practicalStepsTemplate } from "./definitions/practical-steps";
import { questionAnswerTemplate } from "./definitions/question-answer";
import { techExplainerTemplate } from "./definitions/tech-explainer";
import type { CarouselTemplate } from "./template-definition";

const templates: CarouselTemplate[] = [
  techExplainerTemplate,
  questionAnswerTemplate,
  practicalStepsTemplate,
  beforeAfterTemplate,
  codeWalkthroughTemplate,
];

export const TEMPLATE_REGISTRY: ReadonlyMap<string, CarouselTemplate> = new Map(
  templates.map((template) => [template.id, template]),
);

export function listTemplates(): CarouselTemplate[] {
  return [...templates];
}

export function getTemplate(templateId: string): CarouselTemplate {
  return TEMPLATE_REGISTRY.get(templateId) ?? techExplainerTemplate;
}
