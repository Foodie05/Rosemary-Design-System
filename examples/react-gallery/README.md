# React gallery

An interactive consumer of all 33 SDK components with light/dark/system, RTL, reduced motion and a host-refusal switch. Buttons and lists act on local state; this example does not perform network calls.

From the repository root:

```sh
pnpm install --frozen-lockfile
pnpm build:react
pnpm --filter rosemary-react-gallery build
pnpm --filter rosemary-react-gallery serve
pnpm exec playwright install chromium firefox webkit
pnpm exec playwright test --config examples/react-gallery/playwright.config.mjs
```

In CI, Playwright uses `--with-deps`. Override `ROSEMARY_ARTIFACT_ROOT` for reports/artifacts and `ROSEMARY_BUILD_ROOT` for temporary independent consumers. Browser reports include failures/traces rather than silently excluding unsupported paths. Actual Safari and assistive-technology manual results are not implied by engine tests.
