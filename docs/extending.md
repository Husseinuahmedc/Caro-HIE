# Extending Carousel Studio

Extensions are source-level registries in V2. There is intentionally no plugin marketplace or runtime plugin loader.

## Add a template

1. Add one `CarouselTemplate` definition in `src/core/templates/definitions/`.
2. Compose roles from the registered layouts in `role-layouts.ts`.
3. Register the definition in `src/core/templates/registry.ts`.
4. Add content defaults only when a new role needs them.
5. Add a fixture/test proving the slide count never exceeds nine.

Do not add template-specific `if/else` branches to React components.

## Add an editor font

Every selectable font is registered once in `src/fonts/font-registry.ts`. The editor, Brand Kits, renderer, and exporters consume the same entry.

### Google Fonts

1. Add a registry entry with `provider: "google"`.
2. Use the official `fonts.googleapis.com/css2` URL in `stylesheetUrl`.
3. Keep `sources: []`; the on-demand loader adds the stylesheet only after the font is selected.
4. Record the font's real license in the registry.

Export resolves the Google stylesheet, downloads its WOFF2 files, and embeds them into SVG/PNG/PDF output. A Google font needs an internet connection when first loaded or exported.

### Bundled fonts

1. Confirm the license permits redistribution and web embedding.
2. Add optimized WOFF2 files under `public/fonts/<font-id>/`.
3. Add the full license under `third-party/font-licenses/` and a served copy under `public/licenses/`.
4. Register metadata and Unicode-range sources with `provider: "bundled"`.

Do not import editor fonts from global CSS; the on-demand loader handles both providers.

UI/application fonts stay under `src/fonts/ui/` and are configured separately with `next/font/local`.

## Add an exporter

1. Create `src/export/<format>/` with a narrow public function accepting `ProjectDocument`.
2. Reuse `serializeSlideToSvg` or canonical renderer primitives where applicable.
3. Resolve assets through `prepare-export-assets.ts`; never read editor DOM or screenshot the editor.
4. Dynamically import it from `export-actions.tsx`.
5. Add an E2E download assertion.

## Add a preflight rule

1. Create a single file under `src/core/preflight/rules/`.
2. Implement `PreflightRule` with document or slide scope.
3. Return stable `id`, `severity`, Arabic `message`, and a precise `target`.
4. Register it in `PREFLIGHT_RULES`.
5. Add a focused Vitest case.

Rules must not import UI code or mutate the document.

## Add a Brand Kit

1. Add a `BrandKit` entry in `src/brand/built-in-kits.ts`.
2. Use font IDs that exist in the registry.
3. Keep application logic in `apply-brand-kit.ts`, based on semantic `contentKey` values.
4. Add light/dark fixture coverage when the palette introduces a new contrast profile.

## Change ProjectDocument

1. Increment `CURRENT_SCHEMA_VERSION`.
2. Add the new Zod schema expectation.
3. Add an isolated migration from the immediately previous version.
4. Chain it in `migrateProjectDocument`.
5. Add validation and migration tests with real old input.

Never edit old migration semantics after release; add the next migration instead.
