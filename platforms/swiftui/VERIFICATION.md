# SwiftUI 0.4.0 verification — 2026-10-13

The root SwiftPM product is consumed by the checked-in iOS sample. Deployment minimum is iOS 17.0; local validation used Xcode 27 beta (Swift 6.4, Swift 5 language mode). Stable Xcode 26.3/macOS 15 CI is configured in `sdk-swiftui.yml`. Stable [run 38417217654](https://github.com/Foodie05/Rosemary-Design-System/actions/runs/38417217654), for PR head a1a44ec and merge checkout f20d31cc570ee270fbcd43b1b3e462b1ff079b5c, passed the consumer, all eight UI tests and independently extracted archive consumption. The final Release manifest identifies the separately verified main commit and its artifacts.

| Check | Actual local result |
|---|---|
| Root `swift test` | Passed: 6 XCTest functions, 0 failures |
| Root-package iOS sample `xcodebuild build-for-testing`, generic iOS Simulator | Passed: app, unit-test target and UI-test target compiled |
| Generated icon references | Passed: 25 literal SDK calls checked against 71 generated names |
| Vigilo sample resource | Byte-identical to `design/themes/vigilo.json`; complete light/dark palettes validated by sample |
| Dedicated iOS 26.5 and 27 simulator app install/launch | Passed via `simctl`; latest app installed and launched on 26.5 |
| Representative screenshots | Saved and visually inspected: light, dark, local Vigilo theme, Gregorian day/month/year views, time, drawer, RTL with accessibility3 text, accessibility3 date, busy buttons; latest long-select and bottom/right anchored popover |
| Local iOS unit/UI execution | **Not passed.** Runner service initialization/authorization prevents execution of test assertions |

Stable CI run 38417217654 passed six host and six simulator model tests, then executed eight UI functions with zero failures in 187.437 seconds: input/checkbox bindings and hittable semantics; anchored select/pointer commit without reflow; bottom/right popover; drawer reopen/dismiss; modal containment/cancellation; theme/locale/sections including nested system appearance; controlled toast pause/resume/persistent duration/dismiss callbacks; and date year/month/day, next month, cancellation and invalid direct input. Earlier runs exposed the locale-grouped civil year heading and consumer hit areas; these paths now execute successfully.

The actual distribution tar was independently extracted outside the checkout: all six package tests and its simulator consumer build passed. `provenance.json` records `gitHead` and `githubSHA` both as `f20d31cc570ee270fbcd43b1b3e462b1ff079b5c`, `dirty:false`, `testExitStatus:0`, and `archiveConsumerExitStatus:{swiftPackage:0,simulatorSample:0}`. XcodeGen 2.46.0 normalization produced an exact committed-project match. SHA256 checks passed for both artifacts: source `8064fe5c175f4a0366c8cf72fc0e3781d6e16baba22f8912d9d894cfd5bdbea2`; simulator zip `64fa56c57041a8f64845900b85a457dc4b05c8dc35fd332abf97273dd0d61c95`. These are this PR run's artifacts; install the final version using the Release manifest's main provenance and digests.

The six passing host XCTest functions verify:

- Gregorian 1–9999 boundaries, century leap rules, strict timezone-free serialization, extreme arithmetic deltas.
- All 1,440 local minutes and invalid/reversed date ranges, including decoding.
- Cancelled drafts preserve the committed value; confirmed drafts become the next original value.
- Complete/malformed themes, 22 contrast pairs, inheritance, actual native light/dark Color resolution, low-contrast overrides and transparent-color rejection.
- Anchored placement flips above the trigger and clamps to the viewport, including RTL positioning.
- Fold rest state, bounded keyframes/layer exchange and progress derived from actual values, plus unknown progress without a numeric fraction.

All eight UI functions above executed in stable CI. No assertion from these tests is claimed as a local pass.

Local execution attempts on iOS 26.5/27 recorded `DTServiceHubClient failed to bless service hub`. Xcode `-checkFirstLaunchStatus` returns 69. Authorized `-runFirstLaunch` remained blocked in `AuthorizationCopyRights`/Security XPC (process sample preserved), and was stopped without bypassing authorization or deleting simulators. The final UI-only attempt failed installing/launching `design.rosemary.sample.uitests.xctrunner` with `Unknown application display identifier`. The final failed xcresult and logs are retained in release evidence. No additional runner retries are planned before stable CI.

An additional local consumer scene verifies nested appearance restoration: a system-light host contains an explicit Rosemary dark parent and a system-light child; changing the dedicated simulator to dark without relaunch updates the host and system child to dark. The `nested-system` and `nested-system-dark` screenshots were viewed. This verifies live rendering on the installed iOS 27 runtime; the existing CI theme function also compares the nested system label with the host label, passed in the stable run above.

Screenshots demonstrate actual simulator rendering, including a Monday-first calendar with 2026-10-01 in Thursday's column, logical RTL fill and switch thumb, unmirrored fold geometry, and native theme colors. Accessibility3 day columns retain readable scaled cells in a horizontal ScrollView; this is not a claim of manually tested scroll gestures. Busy primary/danger buttons use their foreground colors for the loader.

Manual VoiceOver, external keyboard traversal, pointer edge placement, maximum accessibility text, device execution and an actual iOS 17 runtime have not been tested. The produced zip contains an unsigned installable simulator `.app`, not a device IPA. Source archive and simulator zip are verified with SHA256 checksums. No public registry publication is performed.

Earlier local archives are workingtree snapshots without a recorded Git HEAD; do not attribute them to a later commit. `verify.sh` outputs include `provenance.json` with HEAD, dirty status, input hashes and artifact hashes. XcodeGen 2.46.0 is pinned by release SHA256; only the repository-name-dependent package navigator reference is normalized, followed by an exact Git diff check of the generated project. The actual source tar is extracted outside the repository and must pass root SwiftPM tests and build its own simulator consumer. Both exit statuses are recorded separately and required for success.

Local artifacts: `/Volumes/MacData/Rosemary/artifacts/ios/`. `verify.sh` preserves failure evidence and emits build products when present, while returning nonzero for failed tests; CI success is a separate release gate.
