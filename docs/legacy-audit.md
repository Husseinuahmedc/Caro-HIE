# Legacy project audit

The attached V1 project was read before the rebuild. It was a zero-dependency static application with a large `src/app.js`, CSS-driven editor UI, localStorage persistence, and a small pure JavaScript core.

## Retained and evolved

- Fixed-frame model and the three social formats.
- Maximum nine slides.
- Layer factories and semantic `contentKey` usage.
- Move, resize, rotate, snapping, bounds, alignment, grouping, ordering, locking, duplication, and multi-select concepts.
- Five content templates: tech explainer, Q&A, practical steps, before/after, and code walkthrough.
- Local Brand Kits and content planner.
- Preflight concepts and a single renderer-driven preview/export flow.

These parts were ported to typed, immutable, independently tested modules instead of rewritten inside React.

V2 also performs a one-time browser migration from `carousel-studio:projects:v1` and `carousel-studio:brand-kits:v1`; embedded legacy images become Blob asset records.

## Replaced

| V1 | V2 |
|---|---|
| One 1,500+ line application module | Small editor components and explicit public boundaries |
| Global mutable UI/document state | `DocumentSession` plus UI-only Zustand store |
| localStorage and embedded Base64 images | Dexie/IndexedDB with JSON documents and separate Blob assets |
| Manual shape checks | Versioned Zod schema and sequential migrations |
| Full snapshots during pointer movement | One domain-aware history transaction per gesture |
| Template branches in the application | Template and role-layout registries |
| Ad-hoc warnings | Independent preflight rules with stable targets |
| Print dialog as PDF | Isolated deterministic PDF exporter |
| Unverified font files | OFL fonts with licenses and on-demand loading |

## Deliberate renderer choice

The mature geometry logic did not require React-Konva. DOM/SVG kept editable Arabic text, per-layer bidi support, and portable SVG export simpler while preserving fixed-frame performance. The core remains renderer-agnostic, so a future renderer can be introduced without changing `ProjectDocument` or geometry commands.
