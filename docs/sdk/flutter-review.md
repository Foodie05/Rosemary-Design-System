# Flutter consistency review — 2026-10-15

Scope: Flutter package and gallery, against portal component-demos.js/component-demos.css and SDK design/contracts.json, generated shared tokens/icons. Based on 0.4.0 source; no published release assets changed.

## Findings and changes

- Select now uses field colors (surface/ink; dangerSoft/danger for errors; canvas/muted disabled with one overall .65 opacity), 12px horizontal padding and a labelled accessible trigger. Its former secondary button used transparent/primary styling.
- Select had a text-only trigger, unlike portal native select affordance. Added shared `down` icon (18px), retained in both open and closed states, matching the portal.
- Select's keyboard active row was its only selection marker. Added persistent shared `check` for consumer-selected value; selection semantics now follows that value, while keyboard active background stays separate. Select options now use RosemaryText so the theme typography and ink apply.
- Date/time Choose and calendar year/month selection buttons lacked visual entry cues. Added shared calendar/clock and down icons; no date API or ownership changes.
- Gallery Menu supplied a text-only Actions trigger. Added shared down icon, matching portal “更多操作”. Generic Menu still accepts arbitrary consumer trigger widgets.
- Checkbox is not a dropdown and was not given an arrow. Its mixed state referenced an absent `minus` generated icon and threw ArgumentError; replaced with a centered 10×2px onPrimary dash and verified null value renders without exception.

## Coverage and checks

Inspected controls.dart, primitives.dart, date_upload.dart, navigation.dart, overlays.dart, feedback.dart, theme.dart and gallery.dart. All 33 component demos mounted with both light and dark palettes in existing example/test/widget_test.dart (66 mounts, no exceptions). This is rendering smoke coverage, not 66 manual visual acceptances.

Package `flutter test`: 16 tests passed, including new regression in existing review_regressions_test.dart: cue remains visible without rotation, ArrowDown does not move committed check, Escape closes while preserving cue; disabled field receives exactly one .65 outer opacity. Existing tests cover overlays/focus return, 320px popup bounds, disabled choices, date year/month boundaries, time columns, reduced-motion delayed loader, determinate/stopped progress, and upload cancellation.

Package and example `flutter analyze`: no issues. Example `flutter test`: passed. `flutter test integration_test -d macos`: real application built and passed native editing, both theme loading, date draft cancellation and stopped progress checks. Build produced only existing third-party file_selector_macos allowedFileTypes deprecation and Xcode script-phase warnings.

Real browser operation at localhost:5578 (Flutter web debug server): selected Select demo, opened Overview, observed dropdown arrow, check and disabled option; chose Activity, switched dark, reopened and observed check move to Activity with legible dark-theme text; Escape closed and restored trigger focus. Saved screenshots:

- /Volumes/MacData/Rosemary/artifacts/flutter-consistency/select-open-light.png
- /Volumes/MacData/Rosemary/artifacts/flutter-consistency/select-open-dark.png

macOS CUA screenshot of separately launched debug sample was black despite passing integration test; visual acceptance therefore uses Flutter Web. Flutter mobile native screenshot coverage, exhaustive 33-component manual interactions, and Windows/Linux runtime verification remain outside this pass. Dialog-position investigation was withdrawn by user; no changes made for it.

Final alignment pass retained the shared down icon without rotation and applied one .65 outer disabled opacity, matching portal/Android/Swift. The 16 package tests were rerun. Earlier screenshot arrow orientation predates this final alignment; other field/selection behavior is unchanged.
