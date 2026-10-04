---
name: Carousel Studio
description: Approved Arabic-first local carousel editor — implementation design system
colors:
  "background": "#F6F5F1"
  "foreground": "#222823"
  "surface": "#F6F5F1"
  "surface-strong": "#ffffff"
  "primary": "#19454b"
  "primary-hover": "#123a3f"
  "primary-foreground": "#ffffff"
  "accent": "#0ad8e2"
  "accent-soft": "#E5F5F2"
  "accent-strong": "#067983"
  "muted": "#62685F"
  "border": "#DDDFD6"
  "ring": "#0aa9b2"
  "artwork-lime": "#DEFF79"
  "artwork-blue": "#3455D7"
  "artwork-rust": "#ED936F"
  "artwork-lavender": "#D7CEF3"
  "artwork-dark": "#20272B"
  "artwork-code-text": "#DAE8DE"
  "canvas": "#E9ECE5"
  "accent-hover": "#22e3ec"
  "red-50": "oklch(97.1% 0.013 17.38)"
  "red-100": "oklch(93.6% 0.032 17.717)"
  "red-700": "oklch(50.5% 0.213 27.518)"
  "stone-50": "oklch(98.5% 0.001 106.423)"
  "stone-400": "oklch(70.9% 0.01 56.259)"
  "stone-900": "oklch(21.6% 0.006 56.043)"
  "stone-950": "oklch(14.7% 0.004 49.25)"
typography:
  display:
    fontFamily: "Noto Sans Arabic, system-ui, sans-serif"
    fontSize: "48px"
    fontWeight: 900
    lineHeight: 1.4
  display-mobile:
    fontFamily: "Noto Sans Arabic, system-ui, sans-serif"
    fontSize: "36px"
    fontWeight: 900
    lineHeight: 1.4
  headline:
    fontFamily: "Noto Sans Arabic, system-ui, sans-serif"
    fontSize: "30px"
    fontWeight: 700
    lineHeight: "36px"
  title:
    fontFamily: "Noto Sans Arabic, system-ui, sans-serif"
    fontSize: "24px"
    fontWeight: 700
    lineHeight: "32px"
  card-title:
    fontFamily: "Noto Sans Arabic, system-ui, sans-serif"
    fontSize: "18px"
    fontWeight: 700
    lineHeight: "28px"
  body:
    fontFamily: "Noto Sans Arabic, system-ui, sans-serif"
    fontSize: "14px"
    fontWeight: 400
    lineHeight: 1.5
  lead:
    fontFamily: "Noto Sans Arabic, system-ui, sans-serif"
    fontSize: "16px"
    fontWeight: 400
    lineHeight: "32px"
  label:
    fontFamily: "Noto Sans Arabic, system-ui, sans-serif"
    fontSize: "14px"
    fontWeight: 600
    lineHeight: "20px"
  small:
    fontFamily: "Noto Sans Arabic, system-ui, sans-serif"
    fontSize: "12px"
    lineHeight: "16px"
  field-mobile:
    fontFamily: "Noto Sans Arabic, system-ui, sans-serif"
    fontSize: "16px"
    lineHeight: "24px"
  field-desktop:
    fontFamily: "Noto Sans Arabic, system-ui, sans-serif"
    fontSize: "14px"
    lineHeight: "20px"
  brand:
    fontFamily: "DM Sans, Noto Sans Arabic, sans-serif"
    fontSize: "20px"
    fontWeight: 700
    lineHeight: 1.5
  artwork-text:
    fontFamily: "Noto Sans Arabic"
    lineHeight: 1.25
  artwork-code:
    fontFamily: "IBM Plex Mono"
    lineHeight: 1.4
rounded:
  "sm": "4px"
  "control": "8px"
  "dialog": "12px"
  "panel": "16px"
  "pill": "9999px"
spacing:
  "4": "4px"
  "8": "8px"
  "12": "12px"
  "16": "16px"
  "20": "20px"
  "24": "24px"
  "32": "32px"
  "48": "48px"
  "64": "64px"
components:
  button-primary:
    backgroundColor: "{colors.primary}"
    textColor: "{colors.primary-foreground}"
    typography: "{typography.label}"
    rounded: "{rounded.control}"
    padding: "0 16px"
    height: "44px"
  button-primary-hover:
    backgroundColor: "{colors.primary-hover}"
  button-accent:
    backgroundColor: "{colors.accent}"
    textColor: "{colors.primary}"
    typography: "{typography.label}"
    rounded: "{rounded.control}"
    padding: "0 16px"
    height: "44px"
  button-accent-hover:
    backgroundColor: "{colors.accent-hover}"
  button-secondary:
    backgroundColor: "{colors.surface-strong}"
    textColor: "{colors.primary}"
    typography: "{typography.label}"
    rounded: "{rounded.control}"
    padding: "0 16px"
    height: "44px"
  button-ghost:
    textColor: "{colors.muted}"
    typography: "{typography.label}"
    rounded: "{rounded.control}"
    padding: "0 16px"
    height: "44px"
  button-destructive:
    backgroundColor: "{colors.red-50}"
    textColor: "{colors.red-700}"
    typography: "{typography.label}"
    rounded: "{rounded.control}"
    padding: "0 16px"
    height: "44px"
  input:
    backgroundColor: "{colors.surface-strong}"
    textColor: "{colors.stone-950}"
    rounded: "{rounded.control}"
    padding: "0 12px"
    height: "44px"
    width: "100%"
  panel:
    backgroundColor: "{colors.surface-strong}"
    rounded: "{rounded.panel}"
  badge:
    backgroundColor: "{colors.accent-soft}"
    textColor: "{colors.primary}"
    rounded: "{rounded.pill}"
    padding: "4px 10px"
---

# Design System: Carousel Studio

## Overview

**Creative North Star: "Expressive artwork, calm editor"**

The user approved implementation of the Figma plan. This document records the current feature-branch application, whose code is the canonical implementation for this change. It has not been merged or deployed. Figma remains the approved visual reference, not a production runtime or component implementation.

The Arabic-first workspace uses warm paper, white panels, and precise teal controls. Real carousel artwork leads the home and gallery; six visual families supply expressive compositions while editing controls remain calm. Native editable text, code, shapes, and diagrams carry the artwork.

**Key Characteristics:**

- Arabic-first controls with isolated LTR code and numeric measurements.
- Restrained application chrome and distinct artwork palettes.
- Real project previews and progressively exposed mobile tools.

Sources: `src/app/globals.css`, `src/shared/ui`, current dashboard, `src/core/templates/visual-families.ts`, and bundled font registry. [Approved Figma reference](https://www.figma.com/design/SbKbcyPh9uXBd30nn49bJK).

## Colors

The frontmatter preserves actual CSS custom-property values, native artwork colors, and the reused Tailwind state colors in their source formats.

- **Primary:** deep teal main actions, darker hover, cyan accent, soft mint selected states, and stronger teal accent text.
- **Secondary:** lime editorial artwork, dark developer pages, lavender comparison, rust steps, cobalt stories, and paper diagrams. Code text uses the pale artwork code color; code-card surfaces use the family brand.
- **Neutral:** paper background/surface, white strong surface, dark foreground, muted explanatory text, subtle borders, and a separate canvas tray. Input text and placeholder/disabled states retain the shared UI stone values.
- **Feedback:** shared destructive actions use the recorded red state colors. Global focus uses teal; shared fields and buttons also use the ring and soft accent tokens.

**The Separate Palettes Rule.** Keep application controls on the chrome palette; use the selected visual family for exported artwork.

## Typography

The UI uses bundled Noto Sans Arabic, the wordmark uses bundled DM Sans, and default code uses bundled IBM Plex Mono. Their OFL notices live in `public/licenses/`. The application font is variable (100–900); the default artwork uses explicit weights and safe-area-scaled geometry.

The frontmatter describes the implemented hierarchy: home display (48px desktop, 36px mobile, weight 900, line height 1.4), gallery heading (30px), section title (24px), card title (18px), body/control text (14px), and supporting text (12px). Inputs/selects/textareas use 16px on mobile and 14px from the small breakpoint. Artwork text uses line height 1.25; developer code uses 1.4. Artwork font sizes scale with each requested frame and are not a fixed UI ramp.

The mobile display size is an intentional responsive choice recorded by the bounded review; it is not a reason to shrink future text to satisfy a detector.

**The Mixed Direction Rule.** Keep Arabic text RTL and code LTR; preserve Arabic shaping and explicit font weights.

## Layout

Dashboard content has a maximum width (1440px), page insets (16px mobile, 32px from 640px, 48px from 1024px), and a two-column artwork-led home from the large breakpoint. The gallery uses one, two, and three columns across mobile/small/large layouts. Spacing uses the frontmatter scale; the implementation also retains contextual half-step utility spacing.

The desktop editor keeps the RTL navigator on the right, canvas in the center, and contextual inspector on the left. Mobile uses filmstrip/bottom tools and opens panels as needed. Writing edits the selected slide with a live preview. Preview dimensions come from the selected preset or actual custom width/height.

Ten desktop/mobile review captures are stored in `.impeccable/review/`: home, gallery, editor, writer, and export. These evidence the implemented surfaces; they are not responsive breakpoint definitions.

## Elevation & Depth

The application uses tonal separation with restrained elevation. Default/accent buttons have the Tailwind small shadow; shared panels have a diffuse teal shadow (`0 16px 48px rgba(25,69,75,0.06)`). Dialogs use the Tailwind extra-large shadow with a translucent teal, blurred overlay. Exact shadow values are recorded in the sidecar.

## Shapes

Shared controls use gently curved corners (8px), desktop dialogs use 12px, and panels/mobile sheet tops use 16px. Badges are fully rounded. Gallery and saved-project trays retain crisp, square edges. Native artwork keeps its family-specific shapes and scaled safe areas.

## Components

**Buttons:** actual shared variants are primary, accent, secondary, ghost, and destructive. Default height is a minimum (44px), horizontal padding (16px), gap (8px), semibold label (14px); main dashboard actions increase to 48px. Small buttons retain a 44px target with 12px horizontal padding; icon buttons are 44 × 44px. Hover, pressed, focus, and disabled styles come from the shared UI implementation; disabled opacity is 45%. Width follows content rather than the Figma's 180px specimen.

**Fields:** white surfaces, subtle borders, curved controls (8px), height (44px), horizontal padding (12px), ring/soft-accent focus, and explicit labels. Textareas have a minimum height (96px), resize vertically, and use line height (24px). Native selects preserve browser interaction.

**Panels, cards, and navigation:** panels have white surfaces, border, restrained shadow, and 16px corners. Saved-project cards use square boundaries and lazy actual-artwork previews. Header controls have 44px targets; category filters expose `aria-pressed`. Badges use soft mint with teal semibold 12px text. Radix dialogs provide named, described RTL modal content and mobile bottom-sheet geometry.

**Artwork families:** تحرير جريء, ملاحظات مطور, مقارنة واضحة, خطوات عملية, حكاية بصرية, and شرح بصري are native editable layer recipes, independent from content outlines. The comparison family has separate editable before/after text. Additional keyed text and code blocks survive restyling; custom setup previews use real custom geometry.

**The Content Preservation Rule.** Preview a family change and preserve additional edited text, code, images, groups, and shapes when applying it.

Control transitions last (180ms). `prefers-reduced-motion: reduce` sets animations/transitions to 0.01ms, one animation iteration, and automatic scrolling. Global keyboard focus is a teal outline (2px, offset 3px), with additional shared control focus rings. These are implemented behaviors; this handoff does not claim a formal WCAG conformance audit.

## Do's and Don'ts

### Do:

- Do use bundled Noto Sans Arabic, IBM Plex Mono, and DM Sans for the default experience.
- Do retain 44px control targets, 48px main actions, visible focus, and reduced-motion support.
- Do scale native artwork to the actual preset or custom geometry.
- Do keep content outlines independent from visual families and preserve edited content during a family change.

### Don't:

- Don't turn output grouping or a publishing-service limit into a project slide cap.
- Don't replace actual saved-project or export previews with illustrative content.
- Don't reuse the old Figma specimen dimensions as production component defaults.
