import { useState } from "react";

import { flattenLayers, getFramePreset } from "@/core/document";
import { findLayerContext } from "@/core/engine";
import { editLayerContent } from "@/core/engine/edit-content";
import { applySlideOperation } from "@/editor/commands";
import { useDocumentSession, useProjectDocument } from "@/editor/hooks/use-document-session";
import { useEditorUiStore } from "@/editor/state/editor-ui-store";
import { SlideRenderer } from "@/renderer";
import { Button, Input, Label, Textarea } from "@/shared/ui";
import { useEditorAssets } from "../workspace/editor-assets-context";

export function PlannerPanel() {
  const document = useProjectDocument();
  const session = useDocumentSession();
  const { assetUrls } = useEditorAssets();
  const activeSlideId = useEditorUiStore((state) => state.activeSlideId);
  const setActiveSlide = useEditorUiStore((state) => state.setActiveSlide);
  const setOpenPanel = useEditorUiStore((state) => state.setOpenPanel);
  const [selectedSlideId, setSelectedSlideId] = useState<string>(
    activeSlideId ?? document.slides[0]?.id ?? ""
  );

  const frame = getFramePreset(document.framePresetId);
  const currentPreviewSlide =
    document.slides.find((s) => s.id === selectedSlideId) ?? document.slides[0];

  function edit(slideId: string, layerId: string, value: string) {
    session.update(
      (current) =>
        applySlideOperation(current, slideId, (slide) =>
          editLayerContent(slide, layerId, value)
        ),
      { label: "تعديل محتوى السلسلة", kind: "content", affectedIds: [layerId] }
    );
  }

  function handleFocusSlide(slideId: string) {
    setSelectedSlideId(slideId);
    setActiveSlide(slideId);
  }

  return (
    <div className="space-y-6">
      <p className="text-base leading-7 text-brand-muted">
        ابدأ بالعنوان الذي يشد القارئ، ثم فكرة واحدة لكل شريحة. تعديلاتك تظهر
        مباشرة في التصميم وتُحفظ تلقائياً.
      </p>

      <div className="grid gap-6 lg:grid-cols-[1fr,360px] xl:grid-cols-[1fr,400px] items-start">
        <div className="space-y-4">
          {document.slides.map((slide, index) => {
            const isSelected = slide.id === currentPreviewSlide?.id;
            return (
              <section
                key={slide.id}
                onClick={() => handleFocusSlide(slide.id)}
                className={`space-y-4 rounded-xl border p-4 transition ${
                  isSelected
                    ? "border-primary bg-surface shadow-sm"
                    : "border-brand-border bg-surface-strong"
                }`}
              >
                <div className="flex items-center justify-between">
                  <h3 className="flex items-center gap-3 font-bold">
                    <span className="grid size-8 place-items-center rounded-lg bg-primary text-sm font-bold text-white">
                      {index + 1}
                    </span>
                    {slide.name}
                  </h3>
                  {isSelected ? (
                    <span className="text-xs font-bold text-brand-accent-strong">
                      المعاينة الحالية
                    </span>
                  ) : null}
                </div>

                {flattenLayers(slide.layers)
                  .filter(({ layer }) => layer.type === "text" || layer.type === "code")
                  .map(({ layer }) => (
                    <div key={layer.id}>
                      <Label htmlFor={`plan-${layer.id}-${slide.id}`}>{layer.name}</Label>
                      {layer.type === "text" ? (
                        <Textarea
                          id={`plan-${layer.id}-${slide.id}`}
                          dir={layer.direction}
                          disabled={
                            layer.locked ||
                            findLayerContext(slide.layers, layer.id)?.parentLocked
                          }
                          value={layer.content}
                          onFocus={() => handleFocusSlide(slide.id)}
                          onChange={(event) => edit(slide.id, layer.id, event.target.value)}
                        />
                      ) : layer.type === "code" ? (
                        <Textarea
                          id={`plan-${layer.id}-${slide.id}`}
                          dir="ltr"
                          className="font-mono"
                          disabled={
                            layer.locked ||
                            findLayerContext(slide.layers, layer.id)?.parentLocked
                          }
                          value={layer.code}
                          onFocus={() => handleFocusSlide(slide.id)}
                          onChange={(event) => edit(slide.id, layer.id, event.target.value)}
                        />
                      ) : null}
                    </div>
                  ))}

                {!slide.layers.length ? (
                  <p className="text-sm text-brand-muted">
                    شريحة فارغة. أضف نصاً من المحرر للكتابة هنا.
                  </p>
                ) : null}
              </section>
            );
          })}

          <details className="border-t border-brand-border pt-4">
            <summary className="cursor-pointer text-sm font-bold">
              ملاحظات الكتابة الخاصة بك
            </summary>
            <p className="my-3 text-sm text-brand-muted">
              للتخطيط فقط؛ لا تُضاف إلى الشرائح أو تغيّر النص تلقائياً.
            </p>
            <div className="grid gap-4 sm:grid-cols-2">
              {(
                [
                  ["goal", "الهدف"],
                  ["audience", "الجمهور"],
                  ["hook", "الفكرة الافتتاحية"],
                  ["tone", "نبرة الكتابة"],
                ] as const
              ).map(([field, label]) => (
                <div key={field}>
                  <Label htmlFor={`overview-${field}`}>{label}</Label>
                  <Input
                    id={`overview-${field}`}
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
                        { label: "تعديل ملاحظات الكتابة", kind: "content" }
                      )
                    }
                  />
                </div>
              ))}
            </div>
          </details>
        </div>

        {/* Desktop Synchronized Live Preview */}
        {currentPreviewSlide ? (
          <aside className="hidden lg:block sticky top-4 space-y-3 rounded-xl border border-brand-border bg-surface-strong p-4 shadow-sm">
            <div className="flex items-center justify-between border-b border-brand-border pb-3">
              <span className="text-xs font-black text-brand-muted">معاينة مباشرة</span>
              <strong className="text-sm font-bold text-primary">
                {currentPreviewSlide.name}
              </strong>
            </div>
            <div
              className="relative mx-auto overflow-hidden rounded-lg border border-black/10 shadow-md bg-white"
              style={{
                width: "100%",
                maxWidth: 360,
                aspectRatio: `${frame.width} / ${frame.height}`,
              }}
            >
              <div
                className="absolute left-0 top-0 origin-top-left"
                style={{
                  width: frame.width,
                  height: frame.height,
                  transform: `scale(${360 / frame.width})`,
                }}
                dir="ltr"
              >
                <SlideRenderer
                  document={document}
                  slide={currentPreviewSlide}
                  assetUrls={assetUrls}
                />
              </div>
            </div>
            <p className="text-center text-xs text-brand-muted">
              التصميم يتحدث فورياً مع كل كلمة تكتبها
            </p>
          </aside>
        ) : null}
      </div>

      <div className="sticky -bottom-5 flex justify-end border-t border-brand-border bg-surface-strong py-4">
        <Button variant="accent" onClick={() => setOpenPanel("properties")}>
          متابعة إلى التصميم
        </Button>
      </div>
    </div>
  );
}

