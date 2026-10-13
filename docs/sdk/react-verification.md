# React local verification · SDK 0.4.0

Executed on macOS arm64 on 2026-10-13 using Node 22.23.2, pnpm 11.25.0, TypeScript 5.9.3 and Playwright 1.64.0. Linux CI [run 38408120857](https://github.com/Foodie05/Rosemary-Design-System/actions/runs/38408120857) passed on head `132d945` with the complete 18-path browser matrix and both tarball consumers. It followed an initial workflow context failure (38406647256) and clean-checkout build-order failure (38406980507); both are recorded rather than treated as passes. This includes the idle-loading presentation patch. The new forced-colors correction below has targeted local evidence and awaits its next CI run.

- Frozen workspace install passed.
- `pnpm design:check`: both schemas, 33 unique contracts, aliases, deterministic 82 generated outputs, default/Vigilo palettes with 44 actual contrast checks each passed.
- Seven shared Node regression cases passed; the latest generated Swift token source typechecked.
- Strict React and gallery TypeScript builds passed.
- Eight behavior groups passed in both fresh tarball installations: React 18.3.1/@types18.3.31 and React 19.2.8/@types19.2.18, with corresponding React DOM. Tests cover SSR/local providers, all 71 icon renderings, controlled refusal, keyboard/navigation, year 0001–9999/date/time/range, upload validation/per-file retry/cancel, actual drawer animation promise completion, feedback/lifecycle, avatar reset, delayed loading cancellation and hidden-document pause. Collection rendering keeps consumer data immutable.
- Chromium 156.0.8078.4, Firefox 157.0 and WebKit 27.2: five representative scenarios per engine passed (15 total), with no skips/flaky cases. These cover actual use of all 33 examples; modal containment/trigger restoration; drawer 220/180 ms animation completion and interruption; nonmodal date/time/range editing and roving focus; 390 px/reduced motion/200% font size; long select scrolling; viewport edge clamp/flip; tabs changing width in place; nested RTL→LTR direction and disabled Search. A focused per-file upload and exceptional Stepper scenario was then added and passed in all three engines after the final API update. The original 15-result JSON is retained separately rather than presenting the targeted rerun as a full suite rerun.

The locally verified tarballs after the idle-loading presentation patch are:

| Package | SHA-256                                                            |
| ------- | ------------------------------------------------------------------ |
| tokens  | `6350196f671119720b00dac3538fc7eb41d4e311a1340ea1db6051207203730f` |
| icons   | `a7960bf307edc5170cabd129819623c13bd351393e8a47000fdbc3cb34fc5daa` |
| react   | `55bcc8309ddf9d05fd53bddbb42a1f6821314e0bbedc8a6c72b8b674d5dadf4f` |

Local artifacts were written under `$ROSEMARY_ARTIFACT_ROOT`: `shared/*.tgz`, `react/*.tgz`, `react/consumer-18.3.1-evidence.json`, `react/consumer-19.2.8-evidence.json`, `react/browser-full-15-results.json`, `react/browser-results.json` (focused final run), `react/browser-versions.json`, and desktop/mobile/reduced-loader screenshots. CI runs the complete six-scenario, three-engine suite and uploads the same classes of artifacts. Scripts default to portable paths when the environment variables are absent.

Engine tests do not establish real Safari behavior, the latest two released browser-major matrix, VoiceOver/NVDA/TalkBack, real-device touch or all visual/theme/state combinations. These manual paths remain unverified. States supplied through host composition are explicitly documented in the package's state mapping; export counts are not behavioral evidence.

The idle-loading patch additionally passed the existing feedback/lifecycle test, both fresh tarball consumers, and the drawer/loader scenario in all three engines. The browser assertions verify inactive geometry stays visible without busy/status semantics and motion stops. Use `idlePresentation="hidden"` for transient request indicators. CI artifact digests are recorded separately by its per-consumer evidence JSON because archives can differ from local platform packing.

## Forced-colors simulation

A focused Chromium 156.0.8078.4 run emulated `forcedColors: "active"` and reduced motion against the actual gallery. The initial run reproduced a mixed Checkbox marker disappearing: marker and surface both resolved to white. The correction uses system `CanvasText`, `Highlight` and `HighlightText` with `forced-color-adjust: none` only on the corresponding self-drawn geometry; it does not fix those shapes to brand colors. Strict React/gallery builds and the focused test then passed.

The test verifies actual keyboard Tab/Shift+Tab focus and an outline distinct from its background, mixed/checked marker separation and Space activation, both visible static brand folds, a nonzero determinate fill distinct from its track, and no decorative sweep. Five attached screenshots were inspected: `keyboard-focus.png`, `mixed-selection.png`, `checked-selection.png`, `static-brand-loading.png`, and `determinate-progress.png`, under `react/browser-results/forced-colors-forced-color-ca516-and-brand-feedback-geometry-chromium/`. The focused result JSON is separate from the preserved downloaded 18-path CI evidence at `ci/web-38408120857`. The next full CI suite includes this one Chromium capability case in addition to the existing three-engine interaction paths.

This is browser forced-colors emulation on macOS, not a real Windows high-contrast setting, palette matrix or assistive-technology result. Firefox/WebKit retain the interaction suite but do not run this Chromium emulation capability check. Real Windows high-contrast themes and screen readers remain unverified.
