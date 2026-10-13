# SwiftUI 0.4.0 verification — 2026-10-13

The root SwiftPM product is consumed by the checked-in iOS sample. Deployment minimum is iOS 17.0; local validation used Xcode 27 beta (Swift 6.4, Swift 5 language mode). Stable Xcode 26.3/macOS 15 CI is configured in `sdk-swiftui.yml`. Run 38410571844 on PR head 6e00eeea compiled the consumer and executed tests; its two failing UI paths are being repaired, so the stable release gate is not yet passed.

| Check | Actual local result |
|---|---|
| Root `swift test` | Passed: 6 XCTest functions, 0 failures |
| Root-package iOS sample `xcodebuild build-for-testing`, generic iOS Simulator | Passed: app, unit-test target and UI-test target compiled |
| Generated icon references | Passed: 25 literal SDK calls checked against 71 generated names |
| Vigilo sample resource | Byte-identical to `design/themes/vigilo.json`; complete light/dark palettes validated by sample |
| Dedicated iOS 26.5 and 27 simulator app install/launch | Passed via `simctl`; latest app installed and launched on 26.5 |
| Representative screenshots | Saved and visually inspected: light, dark, local Vigilo theme, Gregorian day/month/year views, time, drawer, RTL with accessibility3 text, accessibility3 date, busy buttons; latest long-select and bottom/right anchored popover |
| Local iOS unit/UI execution | **Not passed.** Runner service initialization/authorization prevents execution of test assertions |

Stable CI [run 38410571844](https://github.com/Foodie05/Rosemary-Design-System/actions/runs/38410571844) passed all six host and six simulator model tests, then executed seven UI tests. Five passed: anchored select/pointer commit without reflow, bottom/right popover, drawer reopen/dismiss, modal containment/cancellation, and theme/locale/sections. Date and checkbox paths still failed (three assertions across two test functions). Exported video frames showed a visible calendar whose next-month tap did not advance, and a checkbox scroll trapped in the nested text editor with the keyboard visible. Quiet buttons now define their full rectangular hit region, picker initialization is guarded against reappearance, and the test scrolls along the gallery edge after removing the focused input through normal navigation. The date test uses the actual focused consumer scene and still clicks year/month/day, next month, cancellation and invalid direct input. These repairs await stable CI; they are not recorded as passed.

The six passing host XCTest functions verify:

- Gregorian 1–9999 boundaries, century leap rules, strict timezone-free serialization, extreme arithmetic deltas.
- All 1,440 local minutes and invalid/reversed date ranges, including decoding.
- Cancelled drafts preserve the committed value; confirmed drafts become the next original value.
- Complete/malformed themes, 22 contrast pairs, inheritance, actual native light/dark Color resolution, low-contrast overrides and transparent-color rejection.
- Anchored placement flips above the trigger and clamps to the viewport, including RTL positioning.
- Fold rest state, bounded keyframes/layer exchange and progress derived from actual values, plus unknown progress without a numeric fraction.

Eight iOS UI tests compile and are configured for CI: consumer input/checkbox bindings; modal containment/cancellation; drawer reopen/dismiss; date cancellation/invalid input and Monday-first day placement; theme/locale and all sample sections; pointer select without reflow; bottom/right popover containment; controlled toast pause/resume, runtime persistent duration and dismiss callback. The five stable-CI paths above executed successfully; no assertion from these tests is claimed as a local pass.

Local execution attempts on iOS 26.5/27 recorded `DTServiceHubClient failed to bless service hub`. Xcode `-checkFirstLaunchStatus` returns 69. Authorized `-runFirstLaunch` remained blocked in `AuthorizationCopyRights`/Security XPC (process sample preserved), and was stopped without bypassing authorization or deleting simulators. The final UI-only attempt failed installing/launching `design.rosemary.sample.uitests.xctrunner` with `Unknown application display identifier`. The final failed xcresult and logs are retained in release evidence. No additional runner retries are planned before stable CI.

Screenshots demonstrate actual simulator rendering, including a Monday-first calendar with 2026-10-01 in Thursday's column, logical RTL fill and switch thumb, unmirrored fold geometry, and native theme colors. Accessibility3 day columns retain readable scaled cells in a horizontal ScrollView; this is not a claim of manually tested scroll gestures. Busy primary/danger buttons use their foreground colors for the loader.

Manual VoiceOver, external keyboard traversal, pointer edge placement, maximum accessibility text, device execution and an actual iOS 17 runtime have not been tested. The produced zip contains an unsigned installable simulator `.app`, not a device IPA. Source archive and simulator zip are verified with SHA256 checksums. No public registry publication is performed.

Earlier local archives are workingtree snapshots without a recorded Git HEAD; do not attribute them to a later commit. Future `verify.sh` outputs include `provenance.json` with HEAD, dirty status, input hashes and artifact hashes. XcodeGen 2.46.0 is pinned by release SHA256; only the repository-name-dependent package navigator reference is normalized, followed by an exact Git diff check of the generated project. The actual source tar is extracted outside the repository and must pass root SwiftPM tests and build its own simulator consumer. Both exit statuses are recorded separately and required for success.

Local artifacts: `/Volumes/MacData/Rosemary/artifacts/ios/`. `verify.sh` preserves failure evidence and emits build products when present, while returning nonzero for failed tests; CI success is a separate release gate.
