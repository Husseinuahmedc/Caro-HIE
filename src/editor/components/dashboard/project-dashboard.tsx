"use client";

import { Plus } from "lucide-react";

import type { ProjectSummary } from "@/storage";
import { SiteFooter } from "@/shared/site/site-footer";
import { SiteHeader } from "@/shared/site/site-header";
import { Badge, Panel } from "@/shared/ui";
import { DashboardHero } from "./dashboard-hero";
import { NewProjectForm, type NewProjectValues } from "./new-project-form";
import { ProductHighlights } from "./product-highlights";
import { ProjectCard } from "./project-card";

interface ProjectDashboardProps {
  projects: ProjectSummary[];
  onCreate: (values: NewProjectValues) => Promise<void>;
  onOpen: (projectId: string) => Promise<void>;
  onDelete: (projectId: string) => Promise<void>;
}

export function ProjectDashboard({ projects, onCreate, onOpen, onDelete }: ProjectDashboardProps) {
  return (
    <div id="top" className="flex min-h-screen flex-col bg-background text-stone-950">
      <SiteHeader />
      <main className="mx-auto w-full max-w-[1440px] flex-1 px-4 sm:px-8 lg:px-12">
        <DashboardHero hasProjects={projects.length > 0} />

        <section id="new-project" className="scroll-mt-28 py-8 sm:py-12" aria-labelledby="new-project-title">
          <Panel className="overflow-hidden">
            <div className="border-b border-brand-border bg-surface px-5 py-5 sm:px-8">
              <div className="flex items-center gap-3">
                <span className="grid size-11 place-items-center rounded-xl bg-brand-accent-soft text-brand-accent-strong"><Plus /></span>
                <div>
                  <h2 id="new-project-title" className="text-xl font-black text-primary sm:text-2xl">مشروع جديد</h2>
                  <p className="mt-1 text-sm text-brand-muted">سمِّ المشروع، اختر القالب، وحدد المقاس.</p>
                </div>
              </div>
            </div>
            <div className="p-5 sm:p-8"><NewProjectForm onCreate={onCreate} /></div>
          </Panel>
        </section>

        <section id="projects" className="scroll-mt-28 py-10 sm:py-14" aria-labelledby="projects-title">
          <div className="mb-6 flex items-end justify-between gap-4">
            <div>
              <span className="text-xs font-black text-brand-accent-strong">محفوظة في هذا المتصفح</span>
              <h2 id="projects-title" className="mt-2 text-3xl font-black text-primary sm:text-4xl">مشاريعك</h2>
            </div>
            <Badge>{projects.length} محفوظ</Badge>
          </div>

          {projects.length ? (
            <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
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
            <div className="rounded-3xl border border-dashed border-primary/25 bg-surface px-6 py-12 text-center">
              <strong className="block text-base text-primary">لا توجد مشاريع محفوظة بعد.</strong>
              <p className="mt-2 text-sm text-brand-muted">أنشئ مشروعك الأول وسيظهر هنا تلقائياً.</p>
            </div>
          )}
        </section>

        <ProductHighlights />
      </main>
      <SiteFooter />
    </div>
  );
}
