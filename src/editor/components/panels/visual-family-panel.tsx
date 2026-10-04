"use client";
import { useMemo, useState } from "react";
import { restyleDocument, VISUAL_FAMILIES } from "@/core/templates";
import {
  useDocumentSession,
  useProjectDocument,
} from "@/editor/hooks/use-document-session";
import { useEditorUiStore } from "@/editor/state/editor-ui-store";
import { Button, Select } from "@/shared/ui";
import { ArtworkPreview } from "../dashboard/artwork-preview";
import { useEditorAssets } from "../workspace/editor-assets-context";
export function VisualFamilyPanel() {
  const document = useProjectDocument(),
    session = useDocumentSession(),
    ui = useEditorUiStore();
  const [family, setFamily] = useState(document.visualFamilyId ?? "editorial");
  const preview = useMemo(
    () => restyleDocument(document, family),
    [document, family],
  );
  const { assetUrls } = useEditorAssets();
  const slide =
    preview.slides.find((slide) => slide.id === ui.activeSlideId) ??
    preview.slides[0]!;
  return (
    <main className="min-h-0 flex-1 overflow-y-auto p-4 sm:p-8">
      <div className="mx-auto grid max-w-5xl gap-8 md:grid-cols-2">
        <section>
          <h1 className="text-3xl font-bold">نفس الفكرة، شكل جديد.</h1>
          <p className="my-4 leading-7 text-brand-muted">
            راجع المعاينة قبل التطبيق. نحتفظ بنصوصك والكود والصور؛ ترتيب عناصر
            القالب يتغير. يمكنك التراجع عن التغيير.
          </p>
          <label className="font-bold">
            التصميم
            <Select aria-label="التصميم"
              value={family}
              onChange={(event) => setFamily(event.target.value)}
            >
              {VISUAL_FAMILIES.map((family) => (
                <option key={family.id} value={family.id}>
                  {family.name}
                </option>
              ))}
            </Select>
          </label>
          <div className="mt-6 flex gap-3">
            <Button
              onClick={() => {
                session.update((current) => restyleDocument(current, family), {
                  label: "تغيير التصميم",
                  kind: "layer",
                });
                ui.setOpenPanel("properties");
              }}
            >
              تطبيق على السلسلة
            </Button>
            <Button
              variant="secondary"
              onClick={() => ui.setOpenPanel("properties")}
            >
              إلغاء
            </Button>
          </div>
        </section>
        <aside className="bg-[#E9ECE5] p-6">
          <ArtworkPreview
            document={preview}
            slide={slide}
            assetUrls={assetUrls}
          />
        </aside>
      </div>
    </main>
  );
}
