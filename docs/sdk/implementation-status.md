# SDK implementation status

Design specification **1.2.0** and SDK release **0.4.0** are separate versions. The target catalog is the same 33 IDs in `design/contracts.json` on React, Android Compose, SwiftUI and Flutter. Code/functional icons use MIT; names, five badges and official raster artwork use the separate root brand policy.

| Area | Evidence recorded so far | Remaining work |
| --- | --- | --- |
| Shared tokens/contracts | Both JSON schemas; 33 semantic contracts; light/dark 24 roles; 44 actual default contrast checks; full vigilo example with 44 checks; 71 original SVGs and normalized geometry; 7 Node tests; deterministic output check; Swift generated sources typechecked; tokens/icons tgz independently installed and imported | Platform consumer builds are recorded by each platform owner |
| React | Strict TypeScript/gallery build; eight semantic/controlled/SSR/draft groups (all 71 icons rendered); final tarballs independently installed under React 18.3.1 and 19.2.8 with strict types and SSR; 15 three-engine browser paths passed, followed by three upload/exceptional-step paths after the focused update | Remote SDK Web CI is pending; real Safari and assistive technology remain unverified |
| Android Compose | Implementation/build/consumer verification in progress | See platform README and CI evidence |
| SwiftUI | Implementation/build/consumer verification in progress | See platform README and CI evidence |
| Flutter | Implementation/build/consumer verification in progress | Six-platform compile and runtime matrix |

Executable shared entry points: `pnpm design:check`, `pnpm test:shared`, `pnpm build:shared`, `node scripts/check-shared-consumer.mjs`. Web entry points are documented in `packages/react/README.md` and `examples/react-gallery/README.md`. Do not turn file counts/export counts into behavioral acceptance claims.

Automated 200% root font-size and 390 px viewport checks passed in the three Playwright engines. Manual acceptance is not complete: real Safari, real devices/touch input, VoiceOver/NVDA/TalkBack, platform text scaling and visual review across the latest two stable browser majors. Playwright WebKit is an engine test rather than a real Safari result. An unexecuted platform/assistive-technology path must remain explicitly unverified.

The historical 61-component prototype is not the SDK catalog. Selected old logic may be adapted; old system picker/spinner visuals and old themes are not restored. This implementation starts from the latest portal specification and includes installable private-distribution artifacts, controlled consumer examples and CI rather than a public registry release.

Platform documentation: [React](../../packages/react/README.md), [React state mapping](../../packages/react/STATE-MAPPING.md), [Android Compose](../../platforms/android/README.md), [SwiftUI](../../platforms/swiftui/README.md). Flutter documentation and CI evidence will be added by its owner. [Local React verification](react-verification.md) records the executed tests and artifact digests.
