# Carousel Studio — approved implementation direction

Status: user approved “approve start implement the plan”; implemented on a feature branch, not yet merged or deployed.

THESIS: expressive carousel artwork inside a calm Arabic-first workspace.
OWN-WORLD: warm paper and white chrome, dark ink, restrained teal/cyan controls; lime editorial, dark developer, lavender comparison, rust steps, cobalt story, and paper diagram artwork. Bundled Noto Sans Arabic, IBM Plex Mono, and DM Sans. Actual tokens and components are recorded in DESIGN.md and .impeccable/design.json.
STORY: choose a visual family → configure size/count/content outline → write a selected slide with live preview → edit native layers → export locally.
FIRST VIEWPORT: real editable family examples beside the main create choices; saved projects show actual local content and truthful empty states.
FORM: RTL desktop navigator on the right, canvas central, contextual inspector on the left; mobile filmstrip, bottom tools, and progressive panels. Shared controls have 44px targets; main actions are 48px. Global focus and reduced-motion behavior are implemented.

Visual families and content outlines are independent. Positive safe-integer slide counts have no fixed product cap; device resources constrain practical project size. Schema-v5 supports compatible legacy upgrade, 3:4, and custom dimensions from 64 to 8192px per axis. Custom previews use actual geometry. Comparison has independent before/after text; family changes retain additional edited keyed text/code and other user layers.

Projects/images persist locally without an account. Optional external image search and Google-font loading may make network requests. Exports support all/current/range scopes, sequential shared resources, progress/cancel, and optional 20-slide output groups independent of project capacity or publishing rules.

Evidence: ten desktop/mobile captures in .impeccable/review; final reviewer disposition ship after the three material fixes. Parent reports lint/typecheck, 90 unit tests, production build, and 22 browser tests passing. The detector ran once; 36px mobile display is intentional, while an unused legacy preview advisory remains outside the live flow. No detector rerun or further visual correction is claimed by this documentation pass.

Figma https://www.figma.com/design/SbKbcyPh9uXBd30nn49bJK is the approved reference. Current code defines actual runtime behavior; original Figma specimens are not executable production components.
