# Rosemary SDK shared contracts

SDK version **0.4.0** implements Forma specification **1.2.0**. `tokens.json`
and `contracts.json` are authoritative SDK sources. Their JSON Schemas validate
the machine-readable structure. The original portal remains a reference, not
a runtime dependency of the SDK.

Run `pnpm design:generate` to generate the 24-role typed palettes and 71 icon
resources for TypeScript, Compose, SwiftUI and Flutter. `pnpm design:check`
validates schemas, semantic references, contrast, asset hashes and generated
file equality. Run `pnpm build:shared` before `pnpm test:shared`.

Color sources accept opaque sRGB `#RRGGBB` or a same-theme role alias such as
`{surface}`. The generator rejects missing roles, unknown aliases and cycles.
Runtime palettes contain exactly 24 camelCase fields; JSON/CSS role names remain
kebab-case (`on-primary` → `onPrimary`). Components inherit a complete parent
palette and merge local overrides. Malformed colors or incomplete structures
raise errors. Contrast diagnostics include foreground role, background role,
actual ratio and minimum; colors are never silently adjusted. Default themes
must pass all 22 applicable color pairs per mode. Transparent overlays, hover
effects and real backgrounds still require platform rendering validation.

Generated native paths are:

- Android `platforms/android/rosemary-compose/src/main/java/design/rosemary/compose/generated`
- SwiftUI `platforms/swiftui/Sources/RosemaryUI/Generated`
- Flutter `platforms/flutter/rosemary_ui/lib/src/generated`

`RosemaryColors` exposes the same 24 fields, `RosemaryTokens.light/dark` supplies
the default palettes, and the motion/metric constants use logical units and
milliseconds. Each platform implements the theme provider and validation UI.
Typography roles must respect platform font scaling; Web pixel reference sizes
are not a command to disable dynamic type.

`RosemaryIcons.paths[name]` contains separate shape command lists. Commands are
absolute `M(x,y)`, `L(x,y)`, `C(x1,y1,x2,y2,x,y)`, `Z()`. Render at a 24-unit
viewBox with 1.6-unit stroke, round caps/joins, and no fill. Arc primitives use
cubic segments of at most 90 degrees, rounded to six decimal places. The
original SVG sources are retained unchanged. This geometry is shared across
platforms; substituting Material or SF Symbols is not the default renderer.

`brand/` preserves the five latest product badges. Their CSS geometry classes
map core to the brand color, background to brand color at 0.13 opacity, frame
to a 2-unit brand stroke at 0.48 opacity, cutout to the surrounding surface,
and secondary layer to 0.68 opacity. These are brand assets subject to `BRAND-ASSETS.md`, not
functional icons. The official PNG remains unchanged in `assets/`.

The 33 contracts define stable IDs, normative prose, machine states, events,
token references and acceptance paths. They do not claim device or screen
reader acceptance merely because generated files exist. Date values are
proleptic Gregorian 0001–9999, local `YYYY-MM-DD` / `HH:mm`, without a timezone.
