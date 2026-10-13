# Rosemary Compose 0.4.0

API 26+, Compose foundation UI primitives, Gregorian local date/time, host-controlled values. This module implements the 33 contracts in `design/contracts.json`. Theme roles and icon geometry come from generated shared design data.

Use `RosemaryTheme(mode = RosemaryThemeMode.System) { … }`. Nested themes inherit. Pass `RosemaryTheme.colors.copy(primary = …)` for role overrides, `direction` for RTL, and `reduceMotion = true` when the application requests reduced motion. Text uses scalable sp. Native Android focus, text IME, selection semantics, modal windows and Storage Access Framework are retained. Theme colors must be opaque finite sRGB; wide-gamut values require explicit host conversion. Contrast diagnostics report ratios without changing host colors. Supply a complete `highContrastColors` palette and optionally `highContrast = true`; API36+ observes the public OS high-contrast-text preference, while API26–35 use the application setting. See API.md for the explicit palette and coverage limits.

```kotlin
RosemaryInput(name, { name = it }, label = "Project name")
RosemaryDate(date, { date = it }, label = "Appointment")
RosemaryProgress(completed.toFloat(), max = total.toFloat(), label = "Upload")
```

Values are supplied by the host. File selection returns content URIs; the host owns permissions/persisting URI access and transfer. `RosemaryDate` buffers its draft and commits only Apply, supports years 1–9999 and every `HH:mm`, and reports reversed ranges as invalid. No timezone conversion is performed. Animations and toast timeout are scoped to composition and pause when the lifecycle is inactive. Timer pause can additionally be set explicitly by the host.

## Build and consume the local artifact

JDK17, Gradle8.13, AGP8.13.2, Kotlin/Compose compiler2.3.20, Compose BOM2025.10.01, compileSDK36. Set `ANDROID_HOME`, optional `GRADLE_USER_HOME`, `ROSEMARY_BUILD_ROOT`, `ROSEMARY_ARTIFACT_ROOT`.

```sh
./gradlew :rosemary-compose:assembleRelease :rosemary-compose:lint :rosemary-compose:testDebugUnitTest :rosemary-compose:localMavenZip
./gradlew :sample:assembleDebug :sample:lint
./gradlew :rosemary-compose:connectedDebugAndroidTest
```

Run the first command before configuring/building the sample: sample depends on `design.rosemary:rosemary-compose:0.4.0` in the local Maven repository, never a project dependency. Publish output is `$ROSEMARY_ARTIFACT_ROOT/android/maven`; transfer the Maven ZIP, extract it into a local repository, and add `maven { url = uri("/path/to/maven") }` to a consumer's repositories. The ZIP includes AAR, POM, Gradle module metadata, sources and MIT/brand notices. The AAR and sources JAR also contain the notices. The debug sample APK is installable with `adb install -r …/sample-debug.apk`.

Instrumented tests must run on an API26+ device. Semantics checks are automated evidence, not screen-reader certification. Windows/Linux CI can assemble and run API26/36 x86_64 emulator tests; local Apple Silicon uses API36 arm64. Release APK signing and external deployment are host application concerns.

See [API.md](API.md) for every component signature, host callbacks, localization and constraints. `scripts/verify.sh library`, `consumer`, `device` are the exact local/CI entry points. API26 CI disables system animations to exercise reduced motion; API36 retains animations and checks an actual drawer intermediate frame. Native window focus return is separately observed, with event delivery awaited.

## Migration from v0.3.0-prototype.2

This is a breaking API migration, not a compatibility release. The historical tag is available for inspection; no historical implementation is restored into this module.

- The old `RosemaryTheme(dark: Boolean, reducedMotion: Boolean)` used Material3 `MaterialTheme`. Replace it with `RosemaryTheme(mode = Light/Dark/System, reduceMotion = …)` and read `RosemaryTheme.colors`. Existing applications reading MaterialTheme colors must change explicitly.
- `design.rosemary.tokens.RosemaryLightTokens/RosemaryDarkTokens` exposed `semantic_color_*`. Import `design.rosemary.compose.generated.RosemaryTokens` and `RosemaryColors` instead. Verified semantic mappings: `canvas→canvas`, `surface→surface`, `surface_subtle→raised`, `text→ink`, `text_secondary→muted`, `border→border`, `border_control→control`, `accent→primary`, `on_accent→onPrimary`, `accent_subtle→primarySoft`, `focus→focus`; `danger/warning/success/info→` their same-named roles and `*_subtle→*Soft`. These map purpose, not identical color values. `text_tertiary`, `disabled`, chart colors and `overlay` have no one-to-one public role. The 24-role palette additionally supplies sun/onSun, sky/onSky and onDanger; pass a complete `RosemaryColors` or copy a default palette. See the sample's complete Vigilo JSON import.
- Replace `RosemaryTextField`/`RosemaryTextArea` with `RosemaryInput`/`RosemaryTextarea`; the historical `TextFieldValue` overloads are not retained. The current API takes host-controlled strings and preserves native text editing/IME internally. Reconcile any host-owned selection/composition requirements explicitly.
- Old `RosemaryDatePicker(valueMillis: Long?)` delegated to Material3 `DatePicker` and `RosemaryTimePicker(hour, minute)` delegated to Material3 `TimePicker`. Use `RosemaryDate` with `LocalDate`/`LocalTime` and the required mode. Convert milliseconds using your application's intended calendar/date semantics; do not assume a timezone conversion. The custom year/month/day and hour/minute views buffer drafts until Apply; Cancel discards them.
- Old `RosemarySpinner(label, reducedMotion)` is replaced by controlled `RosemaryLoading(state = …)`. The 0.4.0 visual is the two-facet long-axis 1200ms motion and a static brand pose on reduced motion or stopped states. `RosemaryProgress` now receives actual completed work and `max`, with null for indeterminate work; check its new signature.
- Historical extra components are outside the 33 foundation scope. Verified examples with no direct replacement: `RosemaryButtonGroup`, `RosemarySplitButton`, `RosemaryFloatingActionButton`, `RosemaryColorPicker`, `RosemarySidebar`, `RosemaryTopNavigation`, `RosemaryBottomNavigation`, `RosemaryDescriptionList`, `RosemaryDataGrid`, `RosemaryAccordion`, `RosemaryResizablePanels`, `RosemaryMetricCard`, `RosemaryProberStatus` and `RosemaryFileRow`. Build host composition from the current primitives or retain those features in application code; same-name historical APIs can also have changed signatures. Consult API.md for every current signature rather than assuming source compatibility.
- Build the 0.4.0 local Maven ZIP first, extract it into a consumer repository and depend on `design.rosemary:rosemary-compose:0.4.0`. The sample itself consumes that published artifact. Do not copy old sources or substitute `project(":rosemary-compose")` when validating delivery.
