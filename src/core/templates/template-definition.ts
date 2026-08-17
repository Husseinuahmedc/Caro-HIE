export type TemplateLayoutId = "cover" | "body" | "code" | "comparison" | "cta";

export interface TemplateRole {
  id: string;
  label: string;
  hint: string;
  layout: TemplateLayoutId;
}

export interface CarouselTemplate {
  id: string;
  name: string;
  description: string;
  icon: string;
  roles: TemplateRole[];
}
