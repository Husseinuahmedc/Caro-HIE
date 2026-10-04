# Product

<!-- impeccable:product-schema 1 -->

## Platform
web

## Users
Arabic technical-content creators and developers preparing carousel posts in their browser.

## Product Purpose
Create, edit, store locally, and export Arabic and bilingual carousel projects without an account.

## Capabilities and Constraints
The user approved implementation of the Figma plan. The current feature branch implements the approved scope; it is not yet merged or deployed.

- Free Next.js/React/TypeScript editor; projects and images persist locally in IndexedDB without an account or required backend.
- Positive safe-integer initial slide counts, with no fixed nine-slide or replacement project cap. Browser memory and available local storage are practical resource limits.
- Six independent visual families and separate content outlines; selected-slide writing with live preview; family-change preview and undoable application preserving additional edited text/code and other user layers.
- Square, portrait, story, 3:4, and custom geometry (integer dimensions 64–8192px per axis), including an actual custom-size setup preview.
- Schema-v5 documents and compatible legacy upgrade preserving prior content and appearance.
- Arabic/English content, bundled default fonts, code blocks, native editable layers, images, history, backup/import, and existing editor operations.
- PNG/SVG/PDF export supports all/current/range scopes, shared per-job resources, sequential rendering, progress, cancellation, padded filenames, and optional groups of 20 output slides. Grouping is not a project cap or a claim about publishing-service limits.
- Project and image persistence remains local. Optional external image-search and Google-font loading may make network requests; the local-storage promise is not a claim that every optional feature is offline.
- RTL desktop editing, mobile filmstrip/bottom tools, visible keyboard focus, 44–48px shared controls, and implemented reduced-motion support. No formal accessibility-conformance claim is made.

## Brand Commitments
Keep the Carousel Studio name, Arabic-first experience, restrained paper/teal application chrome, and expressive native carousel artwork. Default fonts are bundled Noto Sans Arabic, IBM Plex Mono, and DM Sans, with notices in public/licenses/.

## Evidence on Hand
Approved Figma direction; current schema, templates, UI, font registry, and export implementation; ten desktop/mobile review captures in .impeccable/review. Final reviewer disposition: ship after correcting content retention, independent comparison text, and custom geometry preview. Parent reports passing lint, typecheck, 90 unit tests, production build, and 22 Playwright tests. No user-research study or performance benchmark was supplied.

## Open Decisions
Merge and deployment remain separate release actions. Publishing-service advice must be reverified if introduced; optional 20-slide output grouping is not such advice. Future template inventory and visual changes should preserve the accepted world and current document compatibility.
