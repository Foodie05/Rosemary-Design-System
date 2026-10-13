# RosemaryUI 0.4.0 — SwiftUI

RosemaryUI supports iOS 17+ (Swift tools 5.9+, Swift 5 language mode). The root `Package.swift` exposes product/module `RosemaryUI`; the checked-in sample consumes that product through a local package reference to the repository root. macOS 14 is also declared to allow host-side SwiftPM compilation and model tests. iOS simulator build and UI tests are separate checks.

```swift
.package(url: "https://github.com/Foodie05/Rosemary-Design-System.git", exact: "0.4.0")
// Add .product(name: "RosemaryUI", package: "rosemary-design-system") to your target.
import RosemaryUI
```

The planned release tag is `v0.4.0`; the exact-version example resolves only after that tag is created following final acceptance. Until then use the candidate branch or a local root package. No public registry publication is performed. Source is MIT; see repository `BRAND-ASSETS.md` for separate brand asset terms.

## Theme, localization and accessibility

```swift
ContentView()
    .rosemaryTheme(.system) // .light / .dark or a complete RosemaryTheme
    .rosemaryReduceMotion(false) // system Reduce Motion still takes precedence
    .environment(\.locale, Locale(identifier: "zh-Hans"))
    .environment(\.layoutDirection, .rightToLeft)
    .rosemaryStrings(RosemaryStrings(["Cancel": "Return without saving"]))
```

`RosemaryTheme(colors:)` accepts a complete `RosemaryColors` palette. `RosemaryTheme(hex:)` requires all 24 semantic roles (camelCase or generated kebab-case) (`RosemaryTheme.semanticNames`), exactly `#RRGGBB`; missing, duplicate aliases, unknown, or malformed values throw `RosemaryThemeError`. `contrastDiagnostics(hex:)` evaluates all 22 generated pairs and returns failing foreground/background, actual ratio and required ratio. It never silently recolors a theme. Platform `Color` values supplied directly are typed; use the hex path for strict serialized theme validation.

A theme is inherited through the SwiftUI environment. `try content.rosemaryTheme(overrides: ["primary": .purple])` merges a local subset over its inherited palette; camelCase or generated kebab-case role names are accepted for overrides, unknown roles throw. Call `try resultingTheme.contrastDiagnostics(colorScheme: .light)` and `.dark` for actual native Color overrides. It resolves the requested appearance to opaque sRGB, evaluates all 22 pairs, and throws for unresolved, translucent or invalid color values. Constructors and view modifiers do not silently repair or reject low contrast; the host receives diagnostics and chooses its palette. `.rosemaryTheme(.system)` explicitly restores system selection at that subtree. Generated typography roles are mapped by `.rosemaryTypography(.body)` (caption/small/body/lead/heading/title/display), with generated size, weight and line-height, native UI/serif family fallback and Dynamic Type scaling; controls provide minimum 44pt touch targets, flexible labels, logical RTL layout, and stronger control strokes under increased contrast. Hosts provide localized business text; English/Chinese built-in status strings follow `Locale`, with per-key `RosemaryStrings` overrides.

## Component APIs

All business data stays in the consumer. Values are controlled by `Binding`; callbacks perform host work. `.disabled(true)` uses SwiftUI's disabled environment. No component sends network data (except optional avatar image retrieval by `AsyncImage`) or persists consumer values.

| ID / API | Consumer value and event | State, behavior and accessible semantics |
|---|---|---|
| button / `RosemaryButton` | title, variant, `isLoading`, action | primary/secondary/quiet/danger; native Button keyboard activation; loading disables duplicate activation and exposes status |
| link / `RosemaryLink` | destination URL, host isCurrent/isVisited | native Link navigation; independent text label and underlined Rosemary styling |
| iconButton / `RosemaryIconButton` | valid generated icon name, label, optional rotation/isLoading, action | native Button with explicit accessible name; decorative path icon hidden |
| input / `RosemaryInput` | `Binding<String>`, placeholder, error, secure, isReadOnly, onSubmit | native TextField/SecureField editing; visible label, error hint, focus ring |
| textarea / `RosemaryTextarea` | `Binding<String>`, error/isReadOnly | native TextEditor multiline selection/input; visible label and error; readonly text remains selectable |
| select / `RosemarySelect<Value>` | `Binding<Value?>`, `Binding<Bool>` expanded, options | anchored viewport-clamped list; outside/Escape/Tab close, cursor scrolls into view; disabled/invalid; Up/Down, Home/End, Enter, Escape, timed prefix matching; selected value/state exposed |
| search / `RosemarySearch` | `Binding<String>`, onSearch | native text input, submit and real clear action; host provides results |
| checkbox / `RosemaryCheckbox` | `Binding<Bool>`, isMixed | visual check/mixed; accessible native Toggle representation; state change animates unless reduced |
| radio / `RosemaryRadio<Value>` | value, `Binding<Value>` selection | mutually exclusive host binding; native Button with selected trait and readable selected value (iOS has no native SwiftUI radio-group control) |
| switch / `RosemarySwitch` | `Binding<Bool>` | custom Rosemary track/thumb with native Toggle accessibility representation; RTL thumb, 180ms state transition |
| slider / `RosemarySlider` | `Binding<Double>`, range, step | custom track/drag/thumb; adjustable accessibility; RTL arrows; Home/End; disabled gestures/adjustments do not mutate |
| date / `RosemaryDate`, `RosemaryTime`, `RosemaryDateRange` | local civil values, expanded binding, bounds, onCommit | custom calendar with day/month/year views and direct input; time has all 24 hours/60 minutes; draft cancellation; invalid/range errors |
| upload / `RosemaryUpload` | allowed UTTypes, files `[RosemaryUploadFile]`, selection Result callback, remove/retry/cancel callbacks | OS file selection; consumer file list with selected/uploading/uploaded/failed/cancelled, actual optional progress and error; SDK renders feedback, host owns transfer and security-scoped URLs |
| tabs / `RosemaryTabs<Value,Content>` | selection binding, options, content builder | one matched-geometry 180ms indicator and content fade, no queued obsolete transitions; arrows respect RTL and focus selection; Home/End skip disabled options; selected traits |
| breadcrumb / `RosemaryBreadcrumb` | array of ids, labels, optional actions | current location is text; ancestors are buttons calling host navigation; RTL chevrons |
| pagination / `RosemaryPagination` | page binding, pageCount, onChange | 1-based bounded pages; previous/next disabled at limits; readable current/total and adjustable action |
| menu / `RosemaryMenu` | expanded binding, action array | anchored viewport-clamped disclosure action list, native focus traversal; outside/Escape/Tab close; disabled/destructive actions; action closes; Escape returns trigger focus; no unsupported ARIA menu claims |
| tooltip / `RosemaryTooltip` | presented binding, explanatory text, content | anchored supplementary text; hover/focus and explicit accessible explanation action; no additional interactive tooltip contents; Escape closes |
| popover / `RosemaryPopover` | presented binding, trigger/content builders, onDismiss | anchored custom surface, flips above trigger and clamps to usable host-window viewport, scrollable content; outside/Escape/close; trigger focus return; no modal focus trap |
| dialog / `RosemaryDialog`, `.rosemaryDialog` | presented binding, background/content, onDismiss, restoreFocus | genuine mounted modal; background disabled and accessibility-hidden during entry/exit; accessible modal trait; close/Escape/outside, completed exit cleanup |
| drawer / `RosemaryDrawer`, `.rosemaryDrawer` | presented binding, edge, isModal, background/content, onDismiss, restoreFocus | leading/trailing/bottom custom surface; 220ms enter/180ms exit; interrupted transition generation guards; nonmodal variant does not steal or trap focus |
| toast / `RosemaryToast` | presented binding, status, optional duration, onDismiss | inline notification controlled by host placement; explicit dismiss; lifetime timer pauses on hover/background and cancels on unmount; `duration:nil` for essential information |
| alert / `RosemaryAlert` | title/message/status, optional onDismiss | persistent status surface with explicit text/icon; optional named dismiss |
| card / `RosemaryCard` | content builder | themed content surface; no invented click behavior; embed a host button/link for actionable cards |
| list / `RosemaryList` | identifiable consumer collection, row builder, optional onSelect | real consumer rows; selection uses native buttons; readonly rows remain noninteractive |
| table / `RosemaryTable` | identifiable rows, columns/value closures/comparators, sort-column/ascending bindings | horizontal scrolling and header sort actions; every cell is read with column name; sorting optional per column |
| badge / `RosemaryBadge` | label and semantic status | noninteractive text; semantic color never sole status information |
| avatar / `RosemaryAvatar` | name, optional image URL, size | accessible name; initials fallback for missing/loading/failed image; native asynchronous image loading |
| empty / `RosemaryEmpty` | title/message/icon, action builder | consumer supplies actual empty cause and appropriate action; title/message remain readable |
| skeleton / `RosemarySkeleton` | positive line count | static layout placeholder, hidden from accessibility; host replaces with real content and announces loading/result |
| loading / `RosemaryLoading` | label, isRunning, size | exact upright overlapping portal facet geometry; primary color/opacities, long-edge ±58° shuffle, layer exchange, 1200ms; idle/reduced/background is static |
| progress / `RosemaryProgress` | actual finite value and positive finite total, isRunning; unknown-work initializer without value/total | actual clamped fill fraction; unknown mode has a moving segment or static reduced/stopped pose and exposes no fake percent; stable primary and full-height 80pt moving highlight; 320ms actual-value transition; ends/paused/reduced/background stop flow; accessible numeric value |
| stepper / `RosemaryStepper` | host steps/state/canEnter and onSelect | current/complete/error/unavailable text/icon states; only permitted entries are actionable; readable ordered position |

## Civil date values and commit boundaries

`RosemaryLocalDate` accepts strict ASCII `YYYY-MM-DD`, Gregorian year 1–9999. `RosemaryLocalTime` accepts strict `HH:mm` (00:00–23:59). Their Codable representation is that string. Neither converts to `Date`, UTC, or a timezone. `RosemaryLocalDate.weekday` is Sunday=0; the calendar UI starts on Monday in every locale, matching the shared component contract. Day/month arithmetic returns nil beyond year boundaries and for `Int.min/max` deltas. `RosemaryLocalDateRange` rejects reversed ranges, including during decoding.

```swift
@State var date: RosemaryLocalDate? = RosemaryLocalDate("2026-10-13")
@State var expanded = false
RosemaryDate("Start date", value: $date, isExpanded: $expanded,
             initialMonth: RosemaryLocalDate("2026-10-13")!) { committed in
    // Persist only this confirmed value, if appropriate.
}
```

`initialMonth` is explicit so the library cannot silently infer today's date from a timezone. Calendar selection changes a local draft; Apply commits to the binding and calls onCommit. Cancel/Escape/unmount discard the picker draft and do not call onCommit. Direct field submit validates before committing. A host value change reconciles an open draft. A range stages both endpoint controls until Apply range; invalid reverse ranges preserve the old host value.

## Modal focus and lifecycle

Mount a modal at the screen root so its background closure/modifier contains the complete screen. Give `restoreFocus` a host `FocusState` update to the actual opener. The panel focuses its close button/header on entry; background SwiftUI controls are disabled and hidden from accessibility until exit completes. Dismiss callbacks report reason (`confirm`, `cancel`, `outside`, `escape`, `back`, `programmatic`, `unmount`); modal children read `@Environment(\.rosemaryDismiss)` and call the action with `.confirm` after the business commit, or `.cancel` to discard the draft. A host changing the binding directly reports `.programmatic`. Do not nest multiple modal modifiers with simultaneously open bindings.

```swift
screen.rosemaryDialog("Review", isPresented: $open,
    onDismiss: { reason in /* observe close */ },
    restoreFocus: { openerFocused = true }) {
        ReviewEditor(draft: $draft, save: persist)
    }

struct ReviewEditor: View {
    @Environment(\.rosemaryDismiss) private var dismiss
    @Binding var draft: String
    let save: (String) -> Void
    var body: some View {
        RosemaryInput("Notes", text: $draft)
        RosemaryButton("Save") { save(draft); dismiss(.confirm) }
        RosemaryButton("Cancel", variant: .secondary) { dismiss(.cancel) }
    }
}
```

Animations obey system/app reduction. Drawer exiting views are removed by SwiftUI animation completion, guarded against reopen. Pending work is cancelled on unmount. Nonmodal drawer focus remains in the host until the user enters it. Toast timers are display lifetimes, not fabricated task progress.

## Build and evidence

`platforms/swiftui/scripts/verify.sh` regenerates the real sample with XcodeGen, runs SwiftPM model tests and simulator app/unit/UI tests, archives source, emits unsigned simulator `.app` zip and SHA256 checksums, and records toolchain, Git HEAD/dirty state, build start, GitHub run and source-input/artifact SHA256 provenance. `ROSEMARY_BUILD_ROOT`, `ROSEMARY_ARTIFACT_ROOT`, and optional `ROSEMARY_IOS_DESTINATION` control paths. `.github/workflows/sdk-swiftui.yml` selects stable Xcode 26.3 on macOS 15. Local Xcode 27 beta verification is additional compatibility evidence; it is not a completed stable-CI run. A simulator zip is not a device IPA.

Current automated model coverage (six XCTest functions): civil date boundaries/leap centuries/strict serialization, all 1440 minutes, invalid ranges, cancellation/commit draft, malformed/full theme and 22 contrast pairs, local overrides, fold keyframes actual progress fraction/unknown mode, and anchored placement flip/clamp. UI coverage exercises consumer input/checkbox state, locale/theme, modal background containment/cancel, drawer reopen, and date cancel/invalid input, pointer selection without reflow, and bottom/right popover placement. Actual command results and limitations are recorded with release artifacts; merely having these test sources does not assert they passed.

Manual VoiceOver, hardware keyboard focus cycling, pointer edge placement, maximum Dynamic Type and an actual iOS 17 runtime require separate verification. Native accessibility metadata and automated query tests are present; they are not a claim of manual assistive-technology testing.

The sample bundles `App/Resources/vigilo.json` as consumer data, validates both complete palettes with all generated contrast pairs, and mounts the matching light/dark palette only on its Vigilo card. Reproducible real simulator capture routes: `--capture theme --dark`, `--capture date`, `--capture year`, `--capture month`, `--capture time`, `--capture drawer`, `--capture theme --rtl --large`, `--capture date --large`, `--capture busy`, `--capture select`, and `--capture edge-popover`. Large-text calendars preserve scaled cell widths in a horizontally scrollable week and stack year/month navigation; years/months use adaptive columns.

For a local override that inherits the complete current theme, use `try child.rosemaryTheme(overrides: ["primary": customPrimary, "on-primary": customForeground])`; for a complete subbrand palette loaded by the host, construct `try RosemaryTheme(hex: decodedTheme["light"]!)` and apply `.rosemaryTheme(theme)` only at that subtree.

## State ownership and composition

The 33 IDs cover APIs and their reachable states; app request/error/empty data is still host-owned. Button accepts busy/disabled; fields accept error; select options accept disabled and error; toggles/slider inherit disabled; date/time stage invalid/committed/cancelled drafts; upload renders every supplied file state. Tabs/pagination/menu expose selection and disabled choices. Overlay visibility is bound; modal dismissal is reasoned. Feedback APIs expose semantic status, optional image fallback, placeholder/result replacement and running/stopped/unknown progress. Table sort and stepper complete/error/unavailable belong to consumer data.

For Search, Card and List, compose request states with actual host state instead of embedding service data in the library:

```swift
RosemaryCard {
    RosemarySearch("Find records", text: $query, onSearch: search)
    if isLoading { RosemaryLoading("Finding records", isRunning: true) }
    else if let error { RosemaryAlert("Search failed", message: error, status: .danger) }
    else if records.isEmpty { RosemaryEmpty("No matches", message: "Try another query") }
    else { RosemaryList(records, onSelect: openRecord) { Text($0.name) } }
}
RosemaryProgress("Importing", isRunning: importing) // unknown amount, no fabricated percentage
RosemaryProgress("Imported", value: completed, total: total, isRunning: importing)
```

Anchored select/menu/popover/tooltip calculate placement in the hosting window, flip upward when needed, and clamp horizontal position; docked software keyboard frames reduce the available viewport. They remain nonmodal. Mount a surface outside an explicitly clipped custom ancestor: a host `.clipped()` can still clip descendant overlays. The sample's root ScrollView edge placement is exercised by a dedicated UI regression; its direct-launch screenshot is additional visual evidence, not a keyboard/interaction pass.

The contract's app-state keys are reachable through composition: switch busy/error uses disabled binding plus Loading/Alert; tabs/pagination loading/error places feedback in consumer content; popover/dialog/drawer submitting/invalid disables submit and renders field/Alert errors in its content. Card selected uses consumer selection styling and a named button; Table empty/loading/error chooses Empty/Loading/Alert before supplying ready rows. Skeleton finished/error replaces the placeholder; Loading finished/error/cancelled/timeout sets `isRunning:false` and renders the host's actual result/error message. Unknown/partial/cancelled/error progress never fabricates completed work: host supplies real completed values or the unknown initializer, stops `isRunning` for terminal states, and composes the named result. Empty first-use/filtered/offline/denied is consumer title/message/action. Upload partial is a file collection with mixed per-file states. Link current/visited flags are host navigation/history data; IconButton has an explicit busy flag; Input/Textarea readonly values are selectable static text.
