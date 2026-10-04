"use client";
import { useMemo, useState } from "react";
import { ArrowLeft, Search, Plus } from "lucide-react";
import type { ProjectSummary } from "@/storage";
import type { ProjectDocument } from "@/core/document";
import { createDocumentFromTemplate, VISUAL_FAMILIES } from "@/core/templates";
import { Button, Input } from "@/shared/ui";
import { SiteFooter } from "@/shared/site/site-footer";
import { NewProjectForm, type NewProjectValues } from "./new-project-form";
import { ProjectCard } from "./project-card";
import { ImportBackup } from "./import-backup";
import { ArtworkPreview } from "./artwork-preview";

interface ProjectDashboardProps {
  projects: ProjectSummary[];
  onCreate: (values: NewProjectValues) => Promise<void>;
  onOpen: (id: string) => Promise<void>;
  onDelete: (id: string) => Promise<void>;
  onImported: (document: ProjectDocument) => void;
}
export function ProjectDashboard({
  projects,
  onCreate,
  onOpen,
  onDelete,
  onImported,
}: ProjectDashboardProps) {
  const [view, setView] = useState<"home" | "gallery" | "setup">("home"),
    [family, setFamily] = useState<string | undefined>(),
    [filter, setFilter] = useState("الكل"),
    [search, setSearch] = useState("");
  const examples = useMemo(
    () =>
      new Map(
        VISUAL_FAMILIES.map((family) => [
          family.id,
          createDocumentFromTemplate(
            family.id === "developer"
              ? "code-walkthrough"
              : family.id === "steps"
                ? "practical-steps"
                : family.id === "comparison"
                  ? "before-after"
                  : "tech-explainer",
            {
              visualFamilyId: family.id,
              framePresetId: "portrait",
              slideCount: 3,
            },
          ),
        ]),
      ),
    [],
  );
  const choose = (id?: string) => {
    setFamily(id);
    setView("setup");
    window.scrollTo({ top: 0 });
  };
  const gallery = VISUAL_FAMILIES.filter(
    (family) =>
      (filter === "الكل" || family.category === filter) &&
      `${family.name} ${family.description}`.includes(search),
  );
  return (
    <div
      id="top"
      className="flex min-h-screen flex-col bg-background text-foreground"
    >
      <header className="border-b border-brand-border">
        <div className="mx-auto flex min-h-20 max-w-[1440px] items-center justify-between gap-4 px-4 sm:px-8 lg:px-12">
          <button
            className="brand-wordmark min-h-11"
            onClick={() => setView("home")}
          >
            Carousel Studio
          </button>
          <nav className="flex gap-4 sm:gap-8" aria-label="التنقل الرئيسي">
            <button
              className="min-h-11 font-semibold"
              onClick={() => {
                setView("gallery");
                window.scrollTo({ top: 0 });
              }}
            >
              القوالب
            </button>
            <a
              className="flex min-h-11 items-center font-semibold"
              href="#projects"
              onClick={() => setView("home")}
            >
              المشاريع
            </a>
          </nav>
          <span className="hidden text-xs text-brand-muted sm:block">
            محفوظ على جهازك
          </span>
        </div>
      </header>
      <main className="mx-auto w-full max-w-[1440px] flex-1 px-4 py-8 sm:px-8 lg:px-12 lg:py-12">
        {view === "setup" ? (
          <NewProjectForm
            key={family ?? "blank"}
            visualFamilyId={family}
            onCreate={onCreate}
            onBack={() => setView("gallery")}
          />
        ) : (
          <>
            {view === "home" ? (
              <section className="grid items-center gap-8 pb-12 lg:grid-cols-[0.85fr_1.15fr] lg:gap-12">
                <div>
                  <h1 className="text-[36px] font-black leading-[1.4] sm:text-[48px]">
                    الفكرة عندك.
                    <br />
                    خلّها كاروسيل.
                  </h1>
                  <p className="mt-5 max-w-md text-base leading-8 text-brand-muted">
                    محرر عربي مجاني، بدون حساب. اكتب، صمّم، وصدّر سلسلة تستحق
                    السحبة الجاية.
                  </p>
                  <div className="mt-6 flex flex-wrap gap-3">
                    <Button
                      className="min-h-12"
                      onClick={() => setView("gallery")}
                    >
                      اختر تصميماً <ArrowLeft />
                    </Button>
                    <Button
                      className="min-h-12"
                      variant="secondary"
                      onClick={() => choose()}
                    >
                      ابدأ من صفحة فارغة
                    </Button>
                  </div>
                  <p className="mt-4 text-xs text-brand-muted">
                    بيانات المشروع والصور تُحفظ محلياً في متصفحك.
                  </p>
                </div>
                <div
                  className="grid grid-cols-3 items-center gap-3 sm:gap-4"
                  aria-label="أمثلة تصاميم قابلة للتعديل"
                >
                  {["developer", "editorial", "comparison"].map((id, index) => (
                    <button
                      key={id}
                      className={`min-w-0 text-right ${index === 1 ? "py-0" : "py-6"}`}
                      onClick={() => choose(id)}
                      aria-label={`اختيار ${VISUAL_FAMILIES.find((f) => f.id === id)?.name}`}
                    >
                      <ArtworkPreview
                        document={examples.get(
                          id as (typeof VISUAL_FAMILIES)[number]["id"],
                        )!}
                      />
                      <span className="mt-3 block text-xs font-bold sm:text-sm">
                        {VISUAL_FAMILIES.find((f) => f.id === id)?.name}
                      </span>
                    </button>
                  ))}
                </div>
              </section>
            ) : (
              <div className="mb-8">
                <Button variant="ghost" onClick={() => setView("home")}>
                  العودة إلى الاستوديو
                </Button>
                <h1 className="mt-4 text-3xl font-bold">قالب يشبه فكرتك.</h1>
                <p className="mt-3 text-brand-muted">
                  اختر الشكل أولاً. المحتوى وعدد الشرائح بيدك.
                </p>
              </div>
            )}
            <section aria-labelledby="gallery-title">
              <div className="mb-6 flex flex-wrap items-center justify-between gap-4">
                <h2 id="gallery-title" className="text-2xl font-bold">
                  {view === "home" ? "ابدأ من تصميم، مو من فراغ." : "التصاميم"}
                </h2>
                {view === "home" ? (
                  <Button variant="ghost" onClick={() => setView("gallery")}>
                    كل القوالب <ArrowLeft />
                  </Button>
                ) : (
                  <div className="flex items-center gap-2">
                    <Search className="size-5 text-brand-muted" />
                    <Input
                      aria-label="ابحث عن قالب"
                      placeholder="ابحث عن قالب"
                      value={search}
                      onChange={(event) => setSearch(event.target.value)}
                    />
                  </div>
                )}
              </div>
              {view === "gallery" ? (
                <div className="mb-6 flex flex-wrap gap-2">
                  {["الكل", "تقني", "تعليمي", "أفكار"].map((category) => (
                    <Button
                      key={category}
                      variant="secondary"
                      aria-pressed={filter === category}
                      onClick={() => setFilter(category)}
                    >
                      {category}
                    </Button>
                  ))}
                </div>
              ) : null}
              <div className="grid gap-x-6 gap-y-8 sm:grid-cols-2 lg:grid-cols-3">
                {(view === "home" ? VISUAL_FAMILIES.slice(0, 3) : gallery).map(
                  (family) => {
                    const document = examples.get(family.id)!;
                    return (
                      <article key={family.id}>
                        <button
                          className="block w-full bg-[#E9ECE5] p-4 text-right sm:p-6"
                          onClick={() => choose(family.id)}
                          aria-label={`استخدام ${family.name}`}
                        >
                          <div className="grid grid-cols-[1fr_0.55fr_0.55fr] items-end gap-2">
                            <ArtworkPreview document={document} />
                            <ArtworkPreview
                              document={document}
                              slide={document.slides[1]}
                            />
                            <ArtworkPreview
                              document={document}
                              slide={document.slides[2]}
                            />
                          </div>
                        </button>
                        <div className="mt-4 flex items-center justify-between gap-3">
                          <div>
                            <h3 className="text-lg font-bold">{family.name}</h3>
                            <p className="mt-1 text-sm text-brand-muted">
                              {family.description}
                            </p>
                          </div>
                          <Button
                            variant="secondary"
                            onClick={() => choose(family.id)}
                          >
                            استخدمه
                          </Button>
                        </div>
                      </article>
                    );
                  },
                )}
              </div>
              {view === "gallery" && !gallery.length ? (
                <p role="status" className="py-12 text-center text-brand-muted">
                  لا توجد قوالب بهذه الكلمات. جرّب بحثاً آخر أو اختر «الكل».
                </p>
              ) : null}
            </section>
          </>
        )}
        {view === "home" ? (
          <section id="projects" className="scroll-mt-8 pt-16">
            <div className="mb-6 flex flex-wrap items-center justify-between gap-4 border-b border-brand-border pb-5">
              <div>
                <h2 className="text-2xl font-bold">مشاريعك</h2>
                <p className="mt-2 text-sm text-brand-muted">
                  {projects.length} مشروع · محفوظة في هذا المتصفح
                </p>
              </div>
              <Button variant="secondary" onClick={() => choose()}>
                <Plus />
                مشروع جديد
              </Button>
            </div>
            {projects.length ? (
              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
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
              <div className="flex flex-wrap items-center justify-between gap-4 py-6">
                <p className="text-brand-muted">
                  أول فكرة تستحق مكاناً هنا. اختر تصميماً لتبدأ.
                </p>
                <Button variant="secondary" onClick={() => setView("gallery")}>
                  اختيار تصميم
                </Button>
              </div>
            )}
            <ImportBackup onImported={onImported} />
          </section>
        ) : null}
      </main>
      <SiteFooter onCreate={()=>choose()} onGallery={()=>{setView("gallery");window.scrollTo({top:0});}} />
    </div>
  );
}
