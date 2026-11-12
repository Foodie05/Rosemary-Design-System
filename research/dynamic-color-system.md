# Rosemary dynamic color system

Reviewed 2026-11-12. Material provides the HCT color space and gamut-mapping implementation; Rosemary provides the role recipes and application rules.

## Primary references

- [Material Color Utilities](https://github.com/material-foundation/material-color-utilities): HCT combines hue/chroma with perceptual tone, supports tonal palettes, image quantization and seed scoring. We vendor a pinned subset of the official Apache-2.0 package 0.4.0, with source archive, integrity and license. No CDN or runtime network request is required.
- [Google dynamic-color codelab](https://codelabs.developers.google.com/codelabs/apply-dynamic-color): use semantic groups and their paired on-colors rather than copying one seed value onto every surface.
- [Material color roles](https://m3.material.io/styles/color/the-color-system): reference role vocabulary. The current Material page is client-rendered; detailed engineering behavior in this implementation is grounded in the official library source and the codelab, not inferred from an empty scrape.
- [W3C non-text contrast](https://www.w3.org/WAI/WCAG22/Understanding/non-text-contrast.html): necessary state indicators and editing baselines require sufficient contrast; a full perimeter is not universally required.

## Rosemary recipe

The seed supplies hue. Calm caps primary chroma and uses restrained secondary, tertiary and surface palettes. Vivid raises primary/secondary chroma and gives navigation a stronger tonal presence. Near-neutral seeds use the Rosemary purple hue so gray, white or black input does not silently create an uncolored fallback.

Each recipe generates light and dark values separately. Navigation, topbar, page canvas, group, inset, floating surface, editing surface and their content roles are explicit. In both modes the navigation is lower in tone than the topbar, which is lower than the page canvas. Group/floating surfaces have their own tone rather than an arbitrary black/white mix. Semantic feedback hues remain stable across different seeds. Every generated recipe checks text and state contrast before it can be used.

The export contains the exact 24-role SDK theme adapter under `themes`, additional portal role values under `colors`, tonal palettes and numerical checks. This does not release a new native SDK or change its required fields. Product cases keep their brand seed and share the same mood/role algorithm. Manual top-layer listboxes inherit the roles of their triggering container.

The workbench separates draft preview from application, supports valid six-digit HEX, native color selection, presets, client-only PNG/JPEG/WebP extraction, light/dark paired previews, copyable role/tonal swatches, actual example interactions, JSON export and restoration. Applying saves only seed/mood in this browser; image data is not stored or uploaded. Runtime dependencies are inline in the offline HTML.

`color-roles.css` is generated as a no-JavaScript/default-color fallback; the same engine supplies runtime roles. `scripts/generate-portal-colors.mjs --check` verifies default roles and pinned dependency hashes. `scripts/vendor-material.mjs --check` reproduces the subset from the verified local source archive with esbuild 0.28.2. The standard portal build needs no package installation or external service.

## Shell controls and scroll

Topbar actions share 20px primary icons, a 24-unit canvas, 1.6px rounded strokes, consistent height and a shared shape/background family. Down-chevron remains a smaller disclosure hint. The system icon is a simple monitor; the sun has the same optical bounds as adjacent icons. Close actions use the shared SVG rather than a text multiplication sign.

Only the page and sidebar scrollbar tracks/thumbs are hidden. Normal document scrolling, keyboard scrolling, touch scrolling and independent sidebar containment remain. Code, table and popup scroll affordances remain available. No global wheel interception or body scroll replacement is introduced.
