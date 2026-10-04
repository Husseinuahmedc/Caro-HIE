"use client";
import { useEffect, useRef, useState } from "react";
import { ArrowLeft, Trash2 } from "lucide-react";
import type { ProjectSummary } from "@/storage";
import { getFramePreset } from "@/core/document";
import { useProjectAssets } from "@/editor/hooks/use-project-assets";
import { ArtworkPreview } from "./artwork-preview";
const DATE_FORMATTER = new Intl.DateTimeFormat("ar-IQ", {
  dateStyle: "medium",
  timeStyle: "short",
});
function SavedArtwork({ project }: { project: ProjectSummary }) {
  const { assetUrls } = useProjectAssets(project.id);
  return project.previewDocument ? (
    <ArtworkPreview document={project.previewDocument} assetUrls={assetUrls} />
  ) : null;
}
export function ProjectCard({
  project,
  onOpen,
  onDelete,
}: {
  project: ProjectSummary;
  onOpen: () => void;
  onDelete: () => void;
}) {
  const ref = useRef<HTMLElement>(null),
    [visible, setVisible] = useState(false);
  useEffect(() => {
    const element = ref.current;
    if (!element) return;
    const observer = new IntersectionObserver(
      ([entry]) => setVisible(entry?.isIntersecting ?? false),
      { rootMargin: "160px" },
    );
    observer.observe(element);
    return () => observer.disconnect();
  }, []);
  return (
    <article
      ref={ref}
      className="border border-brand-border bg-surface-strong p-4"
    >
      <button
        className="block w-full bg-[#E9ECE5] p-4"
        onClick={onOpen}
        aria-label={`معاينة ${project.name}`}
      >
        <div className="mx-auto max-w-[160px]" style={{ aspectRatio: "4/5" }}>
          {visible ? <SavedArtwork project={project} /> : null}
        </div>
      </button>
      <div className="mt-4 flex items-start justify-between gap-3">
        <div className="min-w-0">
          <h3 className="truncate text-lg font-bold">{project.name}</h3>
          <p className="mt-2 text-sm text-brand-muted">
            {project.slideCount} شرائح ·{" "}
            {getFramePreset(project.framePresetId).label}
          </p>
          <time
            className="mt-2 block text-xs text-brand-muted"
            dateTime={project.updatedAt}
          >
            {DATE_FORMATTER.format(new Date(project.updatedAt))}
          </time>
        </div>
        <button
          aria-label={`حذف ${project.name}`}
          className="grid size-11 shrink-0 place-items-center rounded-lg text-brand-muted hover:bg-red-50 hover:text-red-700"
          onClick={onDelete}
        >
          <Trash2 className="size-4" />
        </button>
      </div>
      <button
        className="mt-4 flex min-h-12 w-full items-center justify-between border-t border-brand-border text-sm font-bold text-primary"
        onClick={onOpen}
      >
        فتح المشروع
        <ArrowLeft className="size-4" />
      </button>
    </article>
  );
}
