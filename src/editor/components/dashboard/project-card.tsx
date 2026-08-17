import { ArrowLeft, Trash2 } from "lucide-react";

import type { ProjectSummary } from "@/storage";

const DATE_FORMATTER = new Intl.DateTimeFormat("ar-IQ", { dateStyle: "medium", timeStyle: "short" });

export function ProjectCard({ project, onOpen, onDelete }: { project: ProjectSummary; onOpen: () => void; onDelete: () => void }) {
  return (
    <article className="group flex min-h-72 flex-col border-b border-brand-border p-5 transition hover:bg-surface-strong sm:border-s">
      <div className="flex items-start justify-between">
        <span className="text-4xl font-black text-primary">{String(project.slideCount).padStart(2, "0")}</span>
        <button
          type="button"
          aria-label={`حذف ${project.name}`}
          onClick={onDelete}
          className="grid size-9 place-items-center rounded-md text-brand-muted transition hover:bg-red-50 hover:text-red-700"
        >
          <Trash2 className="size-4" />
        </button>
      </div>

      <div className="mt-auto">
        <h3 className="truncate text-lg font-black text-primary">{project.name}</h3>
        <div className="mt-2 flex items-center gap-3 text-xs text-brand-muted">
          <span>{project.slideCount} شرائح</span>
          <span className="h-3 w-px bg-brand-border" />
          <span>{project.framePresetId}</span>
        </div>
        <time className="mt-3 block text-[11px] text-stone-400" dateTime={project.updatedAt}>
          {DATE_FORMATTER.format(new Date(project.updatedAt))}
        </time>
        <button
          type="button"
          className="mt-5 flex h-10 w-full items-center justify-between border-t border-brand-border pt-3 text-sm font-black text-primary transition group-hover:text-brand-accent-strong"
          onClick={onOpen}
        >
          فتح المشروع
          <ArrowLeft className="size-4" />
        </button>
      </div>
    </article>
  );
}
