"use client";

import type { ProjectSummary } from "@/storage";
import { SiteFooter } from "@/shared/site/site-footer";
import { SiteHeader } from "@/shared/site/site-header";
import { DashboardHero } from "./dashboard-hero";
import { NewProjectForm, type NewProjectValues } from "./new-project-form";
import { ProductHighlights } from "./product-highlights";
import { ProjectCard } from "./project-card";
import { ImportBackup } from "./import-backup";
import type { ProjectDocument } from "@/core/document";

interface ProjectDashboardProps {
  projects: ProjectSummary[];
  onCreate: (values: NewProjectValues) => Promise<void>;
  onOpen: (projectId: string) => Promise<void>;
  onDelete: (projectId: string) => Promise<void>;
  onImported: (document: ProjectDocument) => void;
}

export function ProjectDashboard({ projects, onCreate, onOpen, onDelete, onImported }: ProjectDashboardProps) {
  return (
    <div id="top" className="flex min-h-screen flex-col bg-background text-stone-950">
      <SiteHeader />
      <main className="mx-auto w-full max-w-[1440px] flex-1 px-4 sm:px-8 lg:px-12">
        <DashboardHero hasProjects={projects.length > 0} />

        <section
          id="new-project"
          className="scroll-mt-24 rounded-xl border border-brand-border bg-surface-strong p-5 sm:p-7"
          aria-labelledby="new-project-title"
        >
          <div className="mx-auto max-w-[1296px]">
            <div className="mb-5 flex items-start justify-between gap-6">
              <div>
                <h2 id="new-project-title" className="text-3xl font-black tracking-tight text-primary sm:text-4xl">
                  مشروع جديد
                </h2>
                <p className="mt-2 text-sm text-brand-muted">سمِّ المشروع، اختر بنية المحتوى، وحدد المقاس.</p>
              </div>
            </div>
            <NewProjectForm onCreate={onCreate} />
            <ImportBackup onImported={onImported} />
          </div>
        </section>

        <section id="projects" className="scroll-mt-28 py-12 sm:py-16" aria-labelledby="projects-title">
          <div className="mb-8 flex items-end justify-between gap-5 border-b border-brand-border pb-7">
            <div className="text-left sm:text-right">
              <span className="text-xs font-black text-brand-muted">محفوظة في هذا المتصفح</span>
              <h2 id="projects-title" className="mt-2 text-3xl font-black text-primary">مشاريعك</h2>
              <span className="mt-2 block text-xs font-bold text-brand-accent-strong">{projects.length} محفوظ</span>
            </div>
          </div>

          {projects.length ? (
            <div className="grid border-t border-brand-border sm:grid-cols-2 xl:grid-cols-4">
              {projects.map((project) => (
                <ProjectCard
                  key={project.id}
                  project={project}
                  onOpen={() => void onOpen(project.id)}
                  onDelete={() => void onDelete(project.id)}
                />
              ))}
            </div>
          ) : (
            <div className="flex flex-col gap-5 border border-dashed border-primary/25 px-6 py-8 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <strong className="block text-base text-primary">لا توجد مشاريع محفوظة بعد.</strong>
                <p className="mt-2 text-sm text-brand-muted">كل مشروع جديد يظهر هنا كسلسلة مستقلة.</p>
              </div>
              <a href="#new-project" className="inline-flex h-11 items-center justify-center rounded-md bg-primary px-5 text-xs font-black text-brand-accent">
                أنشئ أول مشروع ←
              </a>
            </div>
          )}
        </section>

        <ProductHighlights />
      </main>
      <SiteFooter />
    </div>
  );
}
