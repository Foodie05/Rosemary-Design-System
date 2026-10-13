# Contract state mapping

This table maps every `design/contracts.json` state key to a reachable React API or an explicit host composition. It describes capabilities, not a claim that every combination has been exercised with assistive technology. Public values remain controlled. The SDK does not infer network or business success.

| ID | State keys and entry points |
| --- | --- |
| button | idle: ordinary `Button`; disabled: `disabled`; busy: `loading` suppresses duplicate activation |
| link | default/visited: real anchor and browser history; current: host `aria-current="page"` |
| iconButton | idle/disabled/busy: Button props; pressed: controlled `aria-pressed` |
| input | empty/filled: `value`; readonly: `readOnly`; disabled: `disabled`; invalid: `error` with associated text |
| textarea | Same controlled field props as Input |
| select | closed/open: transient expansion; disabled: `disabled`; invalid: `error` |
| search | idle: Search; loading/results/empty/error: host `SearchResults` composition below |
| checkbox | unchecked/checked/mixed: `checked` false/true/'mixed'; disabled: `disabled` |
| radio | unchecked/checked: value versus option key; disabled: whole control or individual option |
| switch | off/on: `checked`; disabled: `disabled`; busy/error: host `aria-busy`, `aria-invalid`, `aria-describedby`, adjacent error and disabled request control below |
| slider | idle/dragging: native range interaction; disabled: `disabled` |
| date | closed/open: panel or optional controlled DatePicker `open`; invalid: malformed local text or min/max rejection; reversed-range: DateRange; disabled: `disabled` |
| upload | empty/selected: `files`; uploading: `fileStates` uploading with real progress; failed/cancelled: file states; partial: completed and failed files coexist. Retry/cancel are proposals only |
| tabs | idle/selected/disabled: controlled value and item.disabled; loading: host content can render Skeleton/Loading in the selected item's panel |
| breadcrumb | ancestor/current: preceding destination links and final current item |
| pagination | idle/first/last: page/pageCount; loading/error: host disable the control and render associated Loading/Alert while retaining current page |
| menu | closed/open: controlled `open`; disabled: item.disabled (host may disable its surrounding action while busy) |
| tooltip | closed/open/dismissed: focus/hover, blur/leave, Escape; its presentation state is internal |
| popover | closed/open: controlled `open`; invalid: host Input error/Alert inside interactive content |
| dialog | closed/opening/open/closing: controlled `open`, real animation lifecycle; submitting/invalid: host busy Button, disabled fields and associated Alert/Input error within body/footer |
| drawer | Same dialog composition; enter/exit completion uses actual 220/180 ms animation promises |
| toast | visible/dismissed: controlled `open`; paused: host lifetime pause on hover/focus using inherited DOM event props; no SDK auto-dismiss timer |
| alert | info/success/warning/danger: `tone` |
| card | idle: Card; selected: `data-selected="true"` plus a visible Badge and host accessible description; loading/error: host composition below |
| list | empty/loading/ready/error: host Empty/Skeleton/List/Alert branches below |
| table | empty/ready/sorted: immutable rows, optional empty content and controlled sort; loading/error: host wrapper and feedback below |
| badge | neutral/info/success/warning/danger: `tone` (primary also available) |
| avatar | loading/image/fallback: pending image, load event, missing/failed source; source changes reset the attempt; pending state has aria-busy |
| empty | first-use/filtered/offline/denied: supplied title/description/icon/action; host picks the cause and next action |
| skeleton | loading: active; finished/error: host replaces it with content/Alert. `active={false}` only freezes its animation |
| loading | idle/finished/cancelled: `active={false}` keeps the static brand pose without busy/live semantics; `idlePresentation="hidden"` or unmount removes it; running: active after delay; error/timeout: host stops it and renders an associated Alert/action |
| progress | idle/running/partial/finished: actual numeric value; unknown: omitted value; cancelled/error: host `flowing={false}` plus text/Alert; no inferred successful completion |
| stepper | upcoming/current/complete: current item ordering defaults; error/unavailable: item.state with visible text/icon and unavailable activation blocked. Explicit item.state can override a derived presentation state; current still identifies the navigation step |

## Host composition examples

The following patterns supply actual reachable business states without adding transport to the SDK. `error` is a user-facing string; the application owns `phase`, results and retry behavior.

```tsx
import { Search, Loading, Empty, Alert, List, Card, Badge, Table, Switch } from '@rosemary-ui/react';

function SearchResults({ query, setQuery, phase, items, error, retry }) {
  return <section aria-busy={phase === 'loading'}>
    <Search label="Search records" value={query} onValueChange={setQuery}
      onSearch={retry} disabled={phase === 'loading'} />
    {phase === 'loading' ? <Loading label="Searching" /> :
      phase === 'error' ? <Alert tone="danger" title={error}><button onClick={retry}>Retry</button></Alert> :
      items.length === 0 ? <Empty title="No matching records" description="Change the search terms." /> :
      <List label="Search results" items={items} />}
  </section>;
}

function RecordCard({ selected, phase, error, children }) {
  return <Card data-selected={selected} aria-busy={phase === 'loading'}>
    {selected && <Badge>Selected</Badge>}
    {phase === 'loading' ? <Loading label="Loading record" /> :
      phase === 'error' ? <Alert tone="danger" title={error} /> : children}
  </Card>;
}

function RecordsTable({ phase, error, rows, columns, sort, onSortChange }) {
  return <section aria-busy={phase === 'loading'}>
    {phase === 'loading' && <Loading label="Refreshing records" />}
    {phase === 'error' && <Alert tone="danger" title={error} />}
    <Table caption="Records" rows={rows} columns={columns} rowKey={row => row.id}
      sort={sort} onSortChange={onSortChange} empty={<Empty title="No records" />} />
  </section>;
}

function SavedSwitch({ checked, busy, error, onCheckedChange }) {
  return <div>
    <span id="switch-label">Enable reminders</span>
    <Switch label="Enable reminders" checked={checked} onCheckedChange={onCheckedChange}
      disabled={busy} aria-busy={busy} aria-invalid={!!error}
      aria-describedby={error ? 'switch-error' : undefined} />
    {error && <p id="switch-error" role="alert">{error}</p>}
  </div>;
}
```

Use `useId()` for description IDs when rendering several copies. Keep prior table/list results during refresh when appropriate. Toast hosts can pause their own remaining-duration timer on `onPointerEnter`/`onFocusCapture`, resume on leave/blur, and change `open` only when the remaining duration expires; these are ordinary inherited event props. This capability has no internal timer or SDK assertion of completion.
