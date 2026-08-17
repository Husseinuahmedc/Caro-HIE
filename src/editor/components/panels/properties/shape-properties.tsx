"use client";

import type { Layer, ShapeLayer } from "@/core/document";
import { ColorField, NumberField, PropertiesSection, SelectField } from "./property-fields";
import type { PatchLayer } from "./types";

export function ShapeProperties({ layer, patch }: { layer: ShapeLayer; patch: PatchLayer }) {
  return (
    <PropertiesSection title="الشكل">
      <SelectField label="نوع الشكل" value={layer.shape} onChange={(shape) => patch({ shape } as Partial<Layer>)}>
        <option value="rect">مستطيل</option>
        <option value="circle">دائرة / بيضاوي</option>
        <option value="line">خط</option>
      </SelectField>
      <div className="grid grid-cols-2 gap-3">
        <ColorField label="التعبئة" value={layer.fill} onChange={(fill) => patch({ fill } as Partial<Layer>)} />
        <ColorField label="الإطار" value={layer.stroke} onChange={(stroke) => patch({ stroke } as Partial<Layer>)} />
        <NumberField label="سمك الإطار" value={layer.strokeWidth} min={0} max={100} step={0.5} onChange={(strokeWidth) => patch({ strokeWidth } as Partial<Layer>)} />
        <NumberField label="استدارة الحواف" value={layer.radius} min={0} max={500} onChange={(radius) => patch({ radius } as Partial<Layer>)} />
      </div>
    </PropertiesSection>
  );
}
