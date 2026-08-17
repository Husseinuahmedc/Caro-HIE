"use client";

import type { ProjectSummary } from "@/storage";
import { SiteFooter } from "@/shared/site/site-footer";
import { SiteHeader } from "@/shared/site/site-header";
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

        <section
          id="new-project"
          className="-mx-4 scroll-mt-20 border-y border-brand-border bg-surface-strong px-4 py-12 sm:-mx-8 sm:px-8 sm:py-14 lg:-mx-12 lg:px-12"
          aria-labelledby="new-project-title"
        >
          <div className="mx-auto max-w-[1296px]">
            <div className="mb-10 flex items-start justify-between gap-6">
              <div>
                <h2 id="new-project-title" className="text-3xl font-black tracking-tight text-primary sm:text-4xl">
                  ابدأ بالسلسلة، مو بالشريحة.
                </h2>
                <p className="mt-2 text-sm text-brand-muted">سمِّ المشروع، اختر بنية المحتوى، وحدد المقاس.</p>
              </div>
              <span className="text-6xl font-black leading-none text-primary sm:text-8xl">02</span>
            </div>
            <NewProjectForm onCreate={onCreate} />
          </div>
        </section>

        <section id="projects" className="scroll-mt-28 py-12 sm:py-16" aria-labelledby="projects-title">
          <div className="mb-8 flex items-end justify-between gap-5 border-b border-brand-border pb-7">
            <span className="text-6xl font-black leading-none text-primary sm:text-8xl">03</span>
            <div className="text-left sm:text-right">
              <span className="text-xs font-black text-brand-muted">محفوظة في هذا المتصفح</span>
              <h2 id="projects-title" className="mt-2 text-3xl font-black text-primary sm:text-4xl">مشاريعك، مرتبة كسلاسل.</h2>
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
