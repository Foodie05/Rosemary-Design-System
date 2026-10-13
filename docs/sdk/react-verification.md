# React local verification · SDK 0.4.0

Executed on macOS arm64 on 2026-10-13 using Node 22.23.2, pnpm 11.25.0, TypeScript 5.9.3 and Playwright 1.64.0. Remote CI is pending at this point; its logs are separate evidence.

- Frozen workspace install passed.
- `pnpm design:check`: both schemas, 33 unique contracts, aliases, deterministic 82 generated outputs, default/Vigilo palettes with 44 actual contrast checks each passed.
- Seven shared Node regression cases passed; the latest generated Swift token source typechecked.
- Strict React and gallery TypeScript builds passed.
- Eight behavior groups passed in both fresh tarball installations: React 18.3.1/@types18.3.31 and React 19.2.8/@types19.2.18, with corresponding React DOM. Tests cover SSR/local providers, all 71 icon renderings, controlled refusal, keyboard/navigation, year 0001–9999/date/time/range, upload validation/per-file retry/cancel, actual drawer animation promise completion, feedback/lifecycle, avatar reset, delayed loading cancellation and hidden-document pause. Collection rendering keeps consumer data immutable.
- Chromium 156.0.8078.4, Firefox 157.0 and WebKit 27.2: five representative scenarios per engine passed (15 total), with no skips/flaky cases. These cover actual use of all 33 examples; modal containment/trigger restoration; drawer 220/180 ms animation completion and interruption; nonmodal date/time/range editing and roving focus; 390 px/reduced motion/200% font size; long select scrolling; viewport edge clamp/flip; tabs changing width in place; nested RTL→LTR direction and disabled Search. A focused per-file upload and exceptional Stepper scenario was then added and passed in all three engines after the final API update. The original 15-result JSON is retained separately rather than presenting the targeted rerun as a full suite rerun.

The current final tarballs are:

| Package | SHA-256 |
| --- | --- |
| tokens | `6350196f671119720b00dac3538fc7eb41d4e311a1340ea1db6051207203730f` |
| icons | `a7960bf307edc5170cabd129819623c13bd351393e8a47000fdbc3cb34fc5daa` |
| react | `5fea296444f8c86b934e3aea96a321133d9a57c1544aae7830984a38ed389fa3` |

Local artifacts were written under `$ROSEMARY_ARTIFACT_ROOT`: `shared/*.tgz`, `react/*.tgz`, `react/consumer-18.3.1-evidence.json`, `react/consumer-19.2.8-evidence.json`, `react/browser-full-15-results.json`, `react/browser-results.json` (focused final run), `react/browser-versions.json`, and desktop/mobile/reduced-loader screenshots. CI runs the complete six-scenario, three-engine suite and uploads the same classes of artifacts. Scripts default to portable paths when the environment variables are absent.

Engine tests do not establish real Safari behavior, the latest two released browser-major matrix, VoiceOver/NVDA/TalkBack, real-device touch or all visual/theme/state combinations. These manual paths remain unverified. States supplied through host composition are explicitly documented in the package's state mapping; export counts are not behavioral evidence.
