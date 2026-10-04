"use client";
import { flattenLayers } from "@/core/document";
import { findLayerContext } from "@/core/engine";
import { editLayerContent } from "@/core/engine/edit-content";
import { applySlideOperation } from "@/editor/commands";
import {
  useDocumentSession,
  useProjectDocument,
} from "@/editor/hooks/use-document-session";
import { useEditorUiStore } from "@/editor/state/editor-ui-store";
import { useSlideControls } from "@/editor/hooks/use-slide-controls";
import { Button, Input, Label, Textarea } from "@/shared/ui";
import { useEditorAssets } from "../workspace/editor-assets-context";
import { ArtworkPreview } from "../dashboard/artwork-preview";

export function PlannerPanel() {
  const document = useProjectDocument(),
    session = useDocumentSession(),
    ui = useEditorUiStore(),
    controls = useSlideControls();
  const { assetUrls } = useEditorAssets();
  const slide =
    document.slides.find((slide) => slide.id === ui.activeSlideId) ??
    document.slides[0]!;
  const fields = flattenLayers(slide.layers).filter(
    ({ layer }) => (layer.type === "text" && layer.contentKey !== "slide-number" && layer.name !== "السلسلة") || layer.type === "code",
  );
  return (
    <main className="min-h-0 flex-1 overflow-y-auto p-4 sm:p-8">
      <div className="mx-auto max-w-[1344px]">
        <div className="mb-6 flex flex-wrap items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold">فكرة واحدة في كل سحبة.</h1>
            <p className="mt-2 text-brand-muted">
              اكتب شريحة، وشوفها تتشكل قدامك. التعديلات تُحفظ تلقائياً.
            </p>
          </div>
          <Button onClick={() => ui.setOpenPanel("properties")}>
            متابعة إلى التصميم
          </Button>
        </div>
        <div className="grid items-start gap-6 lg:grid-cols-[220px_1fr_0.9fr]">
          <nav
            aria-label="محتوى الشرائح"
            className="flex gap-2 overflow-x-auto lg:max-h-[65dvh] lg:flex-col lg:overflow-y-auto"
          >
            {document.slides.map((entry, index) => (
              <button
                key={entry.id}
                aria-current={slide.id === entry.id ? "step" : undefined}
                onClick={() => ui.setActiveSlide(entry.id)}
                className={`min-h-12 shrink-0 rounded-lg border px-4 py-3 text-right ${entry.id === slide.id ? "border-primary bg-brand-accent-soft font-bold" : "border-brand-border bg-surface-strong"}`}
              >
                <span className="me-3 tabular-nums">{index + 1}</span>
                {entry.name}
              </button>
            ))}
            <Button
              variant="secondary"
              disabled={!controls.canAdd}
              onClick={controls.add}
            >
              إضافة شريحة
            </Button>
          </nav>
          <section className="space-y-5 bg-surface-strong p-4 sm:p-6">
            <h2 className="text-lg font-bold">{slide.name}</h2>
            {fields.map(({ layer }) => (
              <div key={layer.id}>
                <Label htmlFor={`plan-${layer.id}`}>{layer.name}</Label>
                <Textarea
                  id={`plan-${layer.id}`}
                  dir={
                    layer.type === "code"
                      ? "ltr"
                      : layer.type === "text"
                        ? layer.direction
                        : undefined
                  }
                  className={
                    layer.type === "code" ? "font-mono min-h-44" : "min-h-28"
                  }
                  value={
                    layer.type === "text"
                      ? layer.content
                      : layer.type === "code"
                        ? layer.code
                        : ""
                  }
                  disabled={
                    layer.locked ||
                    findLayerContext(slide.layers, layer.id)?.parentLocked
                  }
                  onChange={(event) =>
                    session.update(
                      (current) =>
                        applySlideOperation(current, slide.id, (source) =>
                          editLayerContent(
                            source,
                            layer.id,
                            event.target.value,
                          ),
                        ),
                      {
                        label: "تعديل محتوى السلسلة",
                        kind: "content",
                        affectedIds: [layer.id],
                      },
                    )
                  }
                />
              </div>
            ))}
            {!fields.length ? (
              <p className="leading-7 text-brand-muted">
                شريحة فارغة. افتح التصميم وأضف نصاً لتبدأ الكتابة هنا.
              </p>
            ) : null}
            <details className="border-t border-brand-border pt-4">
              <summary className="min-h-11 cursor-pointer font-bold">
                ملاحظات الكتابة الخاصة بك
              </summary>
              <div className="space-y-4">
                {(
                  [
                    ["goal", "الهدف"],
                    ["audience", "الجمهور"],
                    ["hook", "الفكرة الافتتاحية"],
                    ["tone", "نبرة الكتابة"],
                  ] as const
                ).map(([field, label]) => (
                  <label key={field} className="block">
                    {label}
                    <Input
                      value={document.contentPlan[field]}
                      onChange={(event) =>
                        session.update(
                          (current) => ({
                            ...current,
                            contentPlan: {
                              ...current.contentPlan,
                              [field]: event.target.value,
                            },
                          }),
                          { label: "تعديل ملاحظات الكتابة", kind: "content" },
                        )
                      }
                    />
                  </label>
                ))}
              </div>
            </details>
          </section>
          <aside className="bg-[#E9ECE5] p-4 lg:sticky lg:top-0">
            <div className="mx-auto max-w-[400px]">
              <ArtworkPreview
                document={document}
                slide={slide}
                assetUrls={assetUrls}
              />
            </div>
            <p className="mt-3 text-center text-xs text-brand-muted">
              {document.slides.indexOf(slide) + 1} / {document.slides.length} ·
              معاينة مباشرة
            </p>
          </aside>
        </div>
      </div>
    </main>
  );
}
