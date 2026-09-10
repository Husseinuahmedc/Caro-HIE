import { beforeAfterTemplate } from "./definitions/before-after";
import { blankTemplate } from "./definitions/blank-project";
import { codeWalkthroughTemplate } from "./definitions/code-walkthrough";
import { practicalStepsTemplate } from "./definitions/practical-steps";
import { questionAnswerTemplate } from "./definitions/question-answer";
import { techExplainerTemplate } from "./definitions/tech-explainer";
import type { CarouselTemplate } from "./template-definition";

export { blankTemplate };

const templates: CarouselTemplate[] = [
  techExplainerTemplate,
  questionAnswerTemplate,
  practicalStepsTemplate,
  beforeAfterTemplate,
  codeWalkthroughTemplate,
];

export const TEMPLATE_REGISTRY: ReadonlyMap<string, CarouselTemplate> = new Map([
  ...templates.map((template) => [template.id, template] as const),
  [blankTemplate.id, blankTemplate],
]);

export function listTemplates(): CarouselTemplate[] {
  return [...templates];
}

export function getTemplate(templateId: string): CarouselTemplate {
  return TEMPLATE_REGISTRY.get(templateId) ?? techExplainerTemplate;
}
