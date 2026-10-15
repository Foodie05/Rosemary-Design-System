# @rosemary-ui/tokens 0.4.1

Shared Forma 1.2.0 theme roles, component tokens, motion and local date helpers.
Import `defaultThemes`, `createTheme`, `resolveTheme`, `validateTheme`,
`themeCssVariables`, `componentTokens`, `motion` and `metrics` from the package.
Import CSS from `@rosemary-ui/tokens/css`.

`createTheme(parent, overrides)` merges a local palette with its complete parent.
Invalid structure/color throws. Call `validateTheme(colors)` for role-pair
contrast diagnostics; values are never recolored. All 24 opaque sRGB fields are
required for a complete palette. `resolveTheme({mode, systemDark, parent,
overrides})` supports light/dark/system and inherited palettes. The consumer
provider observes system changes and exposes contrast diagnostics.

Local date helpers never construct timezone-bearing JavaScript Date objects.
Parse invalid input as null and preserve the user's text for error correction.

This package is locally installable and is not published to a public registry.
MIT for code and tokens; protected brand assets are described separately.
