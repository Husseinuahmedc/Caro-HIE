import { ArrowLeft, Layers3, Trash2 } from "lucide-react";

import type { ProjectSummary } from "@/storage";
import { Badge, Button, Panel } from "@/shared/ui";

const DATE_FORMATTER = new Intl.DateTimeFormat("ar-IQ", { dateStyle: "medium", timeStyle: "short" });

export function ProjectCard({ project, onOpen, onDelete }: { project: ProjectSummary; onOpen: () => void; onDelete: () => void }) {
  return (
    <Panel className="group overflow-hidden p-5 transition duration-200 hover:-translate-y-1 hover:border-primary/25 hover:shadow-[0_22px_60px_rgba(25,69,75,0.11)]">
      <div className="mb-8 flex items-start justify-between">
        <span className="grid size-11 place-items-center rounded-xl bg-primary text-white"><Layers3 className="size-5" /></span>
        <Button type="button" variant="ghost" size="icon" aria-label={`حذف ${project.name}`} onClick={onDelete}><Trash2 /></Button>
      </div>
      <h3 className="truncate text-lg font-black text-primary">{project.name}</h3>
      <div className="mt-2 flex flex-wrap gap-2">
        <Badge>{project.slideCount} شرائح</Badge>
        <Badge className="bg-stone-100 text-brand-muted">{project.framePresetId}</Badge>
      </div>
      <time className="mt-4 block text-xs text-stone-400" dateTime={project.updatedAt}>{DATE_FORMATTER.format(new Date(project.updatedAt))}</time>
      <Button type="button" variant="secondary" className="mt-5 w-full justify-between" onClick={onOpen}>فتح المشروع <ArrowLeft /></Button>
    </Panel>
  );
}
