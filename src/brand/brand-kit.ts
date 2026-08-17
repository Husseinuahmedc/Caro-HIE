import { z } from "zod";

import { brandSettingsSchema, type BrandSettings } from "@/core/document";

export interface BrandKit {
  id: string;
  name: string;
  description: string;
  settings: BrandSettings;
}

export const brandKitSchema: z.ZodType<BrandKit> = z.object({
  id: z.string().min(1),
  name: z.string().min(1),
  description: z.string(),
  settings: brandSettingsSchema,
});
