"use client";

import { useEffect, useState } from "react";
import dynamic from "next/dynamic";

import type { ProjectDocument } from "@/core/document";
import { createDocumentFromTemplate } from "@/core/templates";
import { createProject, deleteProject, listProjects, loadProject, migrateLegacyLocalStorageData, type ProjectSummary } from "@/storage";
import { Button } from "@/shared/ui";
import { ProjectDashboard } from "../dashboard/project-dashboard";
import type { NewProjectValues } from "../dashboard/new-project-form";
import { useEditorUiStore } from "@/editor/state/editor-ui-store";

const EditorWorkspace = dynamic(
  () => import("../workspace/editor-workspace").then((module) => module.EditorWorkspace),
  { ssr: false, loading: () => <div className="grid min-h-screen place-items-center bg-background text-sm font-semibold text-brand-muted">جارٍ تحميل المحرر…</div> },
);

export function StudioBootstrap() {
  const [projects, setProjects] = useState<ProjectSummary[]>([]);
  const [activeDocument, setActiveDocument] = useState<ProjectDocument | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  async function refreshProjects() {
    setProjects(await listProjects());
  }

  useEffect(() => {
    let cancelled = false;
    void migrateLegacyLocalStorageData()
      .then(() => listProjects())
      .then((items) => { if (!cancelled) setProjects(items); })
      .catch((reason: unknown) => { if (!cancelled) setError(reason instanceof Error ? reason.message : "تعذر فتح التخزين المحلي."); })
      .finally(() => { if (!cancelled) setLoading(false); });
    return () => { cancelled = true; };
  }, []);

  async function create(values: NewProjectValues) {
    const draft = createDocumentFromTemplate(values.templateId, { name: values.name, framePresetId: values.framePresetId });
    setActiveDocument(await createProject(draft));
    const initialPanel = values.templateId === "blank" ? "properties" : "planner";
    useEditorUiStore.setState({ openPanel: initialPanel, selectedLayerIds: [], inspectorOpen: false, focusMode: false });
  }

  async function open(projectId: string) {
    setActiveDocument(await loadProject(projectId));
    useEditorUiStore.setState({ openPanel: "properties", selectedLayerIds: [], inspectorOpen: false, focusMode: false });
  }

  async function remove(projectId: string) {
    if (!window.confirm("سيُحذف المشروع وصوره ونسخ الاستعادة من هذا الجهاز. هل أنت متأكد؟")) return;
    await deleteProject(projectId);
    await refreshProjects();
  }

  if (loading) return <div className="grid min-h-screen place-items-center bg-background"><div className="text-center"><span className="mx-auto mb-4 grid size-12 animate-pulse place-items-center rounded-2xl bg-primary text-xl font-black text-brand-accent">C</span><p className="text-sm font-semibold text-brand-muted">جارٍ فتح الاستوديو…</p></div></div>;
  if (error) return <div className="grid min-h-screen place-items-center bg-background p-6 text-center"><div><h1 className="text-2xl font-black text-primary">تعذر تشغيل Carousel Studio</h1><p className="mt-3 max-w-md text-brand-muted">{error}</p><Button className="mt-6" onClick={() => window.location.reload()}>إعادة المحاولة</Button></div></div>;
  if (activeDocument) return <EditorWorkspace document={activeDocument} onExit={async () => { await refreshProjects(); setActiveDocument(null); }} />;
  return <ProjectDashboard projects={projects} onCreate={create} onOpen={open} onDelete={remove} onImported={(document) => { useEditorUiStore.setState({openPanel: "properties", selectedLayerIds: [], inspectorOpen: false, focusMode: false}); setActiveDocument(document); }} />;
}
