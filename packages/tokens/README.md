# @rosemary-ui/tokens 0.5.0

> 0.5.0 implements Forma 1.3.0 with 45 semantic roles, paired scheme imports, and portal-aligned controls and disclosure curves. See `docs/sdk/0.5.0-migration.md` and `docs/sdk/0.5.0-parity.md`. The Release manifest records exact-main CI provenance; historical evidence below is not a substitute.


Shared Forma 1.3.0 theme roles, component tokens, motion and local date helpers.
Import `defaultThemes`, `createTheme`, `resolveTheme`, `validateTheme`,
`themeCssVariables`, `componentTokens`, `motion` and `metrics` from the package.
Import CSS from `@rosemary-ui/tokens/css`.

`createTheme(parent, overrides)` merges a local palette with its complete parent.
Invalid structure/color throws. Call `validateTheme(colors)` for role-pair
contrast diagnostics; values are never recolored. All 45 opaque sRGB fields are
required for a complete palette. `resolveTheme({mode, systemDark, parent,
overrides})` supports light/dark/system and inherited palettes. The consumer
provider observes system changes and exposes contrast diagnostics.

Local date helpers never construct timezone-bearing JavaScript Date objects.
Parse invalid input as null and preserve the user's text for error correction.

This package is locally installable and is not published to a public registry.
MIT for code and tokens; protected brand assets are described separately.
