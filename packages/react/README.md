# @rosemary-ui/react 0.4.1

Rosemary Forma 1.2.0 components for React 18.3.1 and 19.2.8. Install the three supplied tarballs together; packages are not published to a public registry.

```sh
npm install ./rosemary-ui-tokens-0.4.1.tgz ./rosemary-ui-icons-0.4.1.tgz ./rosemary-ui-react-0.4.1.tgz react@19.2.8 react-dom@19.2.8
```

```tsx
import { useState } from "react";
import { RosemaryProvider, Input, Button } from "@rosemary-ui/react";
import "@rosemary-ui/react/css";

export function RecordForm() {
  const [name, setName] = useState("");
  return (
    <RosemaryProvider mode="system" language="en">
      <Input label="Name" value={name} onValueChange={setName} />
      <Button onClick={() => saveRecord(name)}>Save</Button>
    </RosemaryProvider>
  );
}
```

The application owns network calls, persistence, business validation and every public value/open state. A callback proposes a change; declining that proposal leaves the component's public state unchanged. Date editing and keyboard navigation may hold a temporary draft or focus position. A date only commits on Confirm or Clear. Tooltip visibility, select expansion and image failure are transient presentation state.

## Theme, language and direction

`RosemaryProvider` (`ThemeProvider` alias) accepts `mode: 'light' | 'dark' | 'system'`, partial `colors`, `direction: 'ltr' | 'rtl'`, `language`, partial `strings`, `reducedMotion`, and `onDiagnostics`. Omitted mode and direction inherit the nearest provider. An explicit mode uses its complete built-in palette; color overrides merge into that palette once. Missing/invalid complete palettes and unsupported colors throw. Contrast failures report foreground/background role, measured ratio and target; colors are never silently changed. In production, supply `onDiagnostics` when accepting user palettes. It reports the initial effective palette and subsequent changes to any of its 24 color values, using the latest callback. Equivalent inline color objects and new callback identities do not repeat the report; updating parent state from the callback is supported.

All 24 roles use camelCase in TypeScript (for example `onPrimary`, `primarySoft`, `successSoft`) and raw role names in the source JSON/CSS (`on-primary`, `primary-soft`, `success-soft`). Complete vigilo light/dark examples live in `design/themes/vigilo.json`; their 44 contrast checks run in `design:check`. Local themes remain independent, and menus, popovers and native dialog top layers inherit their enclosing provider's variables. Keep components inside a provider and import the CSS exactly once.

System or parent reduced motion always wins over an application `false`. Server rendering chooses light for `system`; hydration reads the actual system preference through `useSyncExternalStore`, without browser access on the server. Explicit light/dark renders deterministically. `language="en"` selects English default strings; other language tags use Chinese defaults, so supply the complete translated string overrides for other languages. `useRosemaryTheme()` exposes the resolved colors, mode, direction, motion preference, language and strings.

## Component API

All exported prop interfaces are included in the package declarations. Input-like controls require an accessible label. Arbitrary DOM props/ref are supported on basic controls. Collections use stable consumer keys. The complete catalog maps to these APIs:

| Catalog ID | React API and principal controlled input                                                                                       |
| ---------- | ------------------------------------------------------------------------------------------------------------------------------ |
| button     | `Button`, `variant`, `size`, `loading`, `onClick` (busy suppresses duplicate clicks)                                           |
| link       | `Link`, ordinary anchor `href`                                                                                                 |
| iconButton | `IconButton`, required `icon`, `label`, `onClick`                                                                              |
| input      | `Input`, `value`, `onValueChange`, `label`, `description`, `error`                                                             |
| textarea   | `Textarea`, same field contract, editable multiline text                                                                       |
| select     | `Select`, `value`, `options`, `onValueChange`                                                                                  |
| search     | `Search`, field contract plus `onSearch` on explicit submit                                                                    |
| checkbox   | `Checkbox`, `checked: boolean                                                                                                  | 'mixed'`, `onCheckedChange`                                                       |
| radio      | `Radio`, `value`, `options`, `onValueChange`                                                                                   |
| switch     | `Switch`, `checked`, `onCheckedChange`; render a visible text label nearby (its required `label` supplies its accessible name) |
| slider     | `Slider`, numeric `value`, `min`, `max`, `step`, `onValueChange`, optional `valueText`                                         |
| date       | `DatePicker` / `TimePicker` / `DateRange`, direct local text and custom panel; local ISO `value: string                        | null`, `onValueChange`, optional `min`, `max`, `withTime`, `time`, `onTimeChange` |
| upload     | `Upload`, `files`, `onFilesChange`, limits/`onReject`, optional `fileStates`, `onRetry(file)`, `onCancel(file)`                |
| tabs       | `Tabs`, `value`, `items`, `onValueChange`, `activation: 'automatic'                                                            | 'manual'`                                                                         |
| breadcrumb | `Breadcrumb`, `items` with optional destinations; final item marks current page                                                |
| pagination | `Pagination`, `page`, `pageCount`, `onPageChange` (pages are one-based)                                                        |
| menu       | `Menu`, `open`, `onOpenChange`, `items` with `onSelect` actions                                                                |
| tooltip    | `Tooltip`, `content`, one accessible focusable React child, optional hover `delay`                                             |
| popover    | `Popover`, `label`, `open`, `onOpenChange`, interactive children                                                               |
| dialog     | `Dialog`, `open`, `onOpenChange(open, reason)`, title/description/body/footer                                                  |
| drawer     | `Drawer`, dialog contract plus `modal` (default true), actual `onAnimationComplete`                                            |
| toast      | `Toast`, `open`, tone/title/content and `onDismiss`; host owns its lifetime                                                    |
| alert      | `Alert`, tone/title/content, optional `onDismiss`                                                                              |
| card       | `Card`, semantic article with content                                                                                          |
| list       | `List`, immutable `items` with id/content/description/action                                                                   |
| table      | `Table<T>`, immutable `rows`, `rowKey`, `columns`, controlled `sort`, `onSortChange`                                           |
| badge      | `Badge`, text and semantic `tone`                                                                                              |
| avatar     | `Avatar`, accessible `name`, optional `src`, initials/error fallback                                                           |
| empty      | `Empty`, title/description/icon/consumer action                                                                                |
| skeleton   | `Skeleton`, label, `lines` (integer 1–100), `active`                                                                           |
| loading    | `Loading`, label/size/active; Rosemary's exact two-card 3D folding geometry                                                    |
| progress   | `Progress`, label, `value`, `max`, `flowing`; omit value for indeterminate progress                                            |
| stepper    | `Stepper`, `items` with optional `state`, `current` id and optional `onStepChange`; error/unavailable are explicit             |

`Icon` renders one of the shared Rosemary paths, including `sun`, `moon`, `theme-system` and `globe`, with decorative default semantics or `label` for an image name. `BrandBadge` renders the five current product marks (`forma`, `epass`, `lilt`, `vigilo`, `folio`) in the current primary hue; a local provider supplies another approved theme. `RosemaryLogo` includes the unchanged official PNG. Brand names, badges and PNG are subject to [BRAND-ASSETS.md](./BRAND-ASSETS.md), separate from MIT code and functional icons.

All contract states are mapped to concrete API props or host composition in [STATE-MAPPING.md](./STATE-MAPPING.md). Search/card/list/table loading and errors, modal submitting, toast lifetime and failure/timeout outcomes use the documented host composition; they are not inferred by the SDK.

## Interaction boundaries

The date picker implements Gregorian years 0001–9999 and `YYYY-MM-DD`; optional time uses `HH:mm` (00:00–23:59). Values never become timestamps or pass through timezone conversion. Calendar arrows move days/weeks, Home/End move within a Monday-first week, PageUp/PageDown move months and Shift+PageUp/PageDown move years. A custom year field, month buttons and hour/minute lists preserve the Rosemary visual language.

Select supports arrows, Home/End, one-character typeahead, Enter/Space commit and Escape dismissal. Tabs use directional arrows respecting RTL and optional manual activation. Menus use arrow/Home/End focus, Escape and ordinary activation. Every focusable target has a visible focus treatment; non-color text/icons accompany feedback.

Date and time panels are nonmodal: Escape cancels, outside click/Tab leaving closes without committing; years/months use dedicated views, and time columns have one tabbable selected option each. `DateRange` rejects reversed proposals and displays an associated error.

Modal dialogs use native `showModal()` for top-layer focus containment and background inertness; accepted close restores the connected trigger. SDK buttons focus on pointer activation for consistent WebKit restoration; for a custom external opener, pass `returnFocusRef` explicitly. Escape and outside dismissal propose changes and are prevented while the host refuses. `closeOnOutside` is opt-in. `Drawer modal={false}` uses `show()` and does not make the background inert. Drawer enter/exit lasts 220/180 ms, waits for actual animation completion, and reverses from the computed intermediate transform. Reduced motion closes immediately. No animation timer is used as a completion proxy. Overlay components stay inside the provider; no hard-coded body portal discards the theme or native modal scope.

Progress stops its sheen at completion; failure/cancel may set `flowing={false}`. Loading defaults to the source 300 ms running appearance threshold (`delay={0}` for immediate feedback). `active={false}` retains the static brand pose and removes busy/live-status semantics; use `idlePresentation="hidden"` or unmount when a completed/cancelled request should disappear. A transient request using the hidden idle presentation never flashes if cancelled before the threshold. Loading and progress pause when the document is hidden. Reduced motion removes fold, shimmer and interpolation; forced colors preserve essential boundaries and progress. Upload validates type/size/count before proposing a new immutable file list; it never uploads anything.

## Validation and remaining manual work

On a fresh source checkout, run `pnpm build:shared` before `pnpm test:shared`; the shared tests import the built public package. `pnpm build:react` builds those dependencies before React tests.

`pnpm build:react`, `pnpm test:react`, `node scripts/pack-sdk-web.mjs`, and `node scripts/check-react-consumers.mjs` compile, test and independently install the artifacts under both supported React majors. The latter executes SSR and semantic/controlled interaction tests against the installed package, not workspace imports. The gallery's Playwright suite exercises Chromium, Firefox and WebKit, including calendar/focus/motion/RTL and a 390 px viewport. WebKit is not a claim of testing actual Safari. VoiceOver/NVDA/TalkBack, real Safari, real-device touch, and visual review across the last two stable browser majors remain separately tracked manual acceptance work.

This 0.4.0 API replaces the historical private Vite demonstration app; no prior publicly installable Web SDK API existed. Applications must adopt controlled props and the 24-role theme contract instead of importing portal globals/CSS classes.

## Per-file transfer state

`Upload` accepts `fileStates?: ReadonlyMap<File, UploadFileState>`. Map keys use the same stable `File` objects present in `files`; retained retries preserve that identity. A file state is `{status: 'uploading', progress?: number, message?}`, `{status: 'failed', error}`, or `{status: 'selected' | 'complete' | 'cancelled', message?}`. Progress is 0–100; omitted progress is indeterminate. Completed and failed files together display a partial batch. Errors are associated with their file row and accompanied by text/icons.

```tsx
const states = new Map<File, UploadFileState>([
  [selectedFile, { status: "failed", error: "Connection lost" }],
]);
<Upload
  label="Attachments"
  files={[selectedFile]}
  fileStates={states}
  onFilesChange={setFiles}
  onRetry={(file) => retryTransfer(file)}
  onCancel={(file) => cancelTransfer(file)}
/>;
```

Import `UploadFileState` from the package. `onRetry` and `onCancel` do not optimistically alter the visible state or remove files. The host updates `fileStates` only after accepting the action. No files are transmitted by this component.
