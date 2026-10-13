# Public Flutter API

The following constructors are taken from the implementation. Named values are controlled by the host; callbacks propose changes. Enabled false blocks corresponding actions. Use stable IDs for options, files, list/table rows and steps. No library component fetches business data.

Date values are Gregorian local calendar dates from 0001–9999 and strict HH:mm times; no timezone conversion occurs. Direct input commits on Enter. The inline non-modal picker maintains a draft until Apply; Escape, Cancel, outside and Tab leaving discard it. Time has two roving columns with arrows/Home/End.

Progress uses actual completed work: null means unknown. Set state cancelled/error/paused to stop flow without resetting the value; completed stops automatically at max. Loading waits the shared 300 ms before appearing, stops at the brand pose and cancels pending work on unmount. Toast pauses its own scoped timeout for hover, focus within, inactive app or explicit paused. Dialog and Drawer keep their overlay through reversible exit animations and expose animation-finished callbacks.

Shared typography is mapped through rosemaryTextStyle roles and platform font fallbacks; no proprietary font files are bundled. English/Chinese strings are built in; supply strings for another language. Native semantic actions and focus are implemented, but runtime tests do not certify assistive technology compatibility.

## RosemaryLoading

Implemented in `feedback.dart`.

```dart
const RosemaryLoading({
    super.key,
    this.size = 32,
    this.color,
    this.label = 'Loading',
    this.state = RosemaryLoadingState.running,
    this.onCancel,
    this.appearanceDelay,
  })
```

## RosemaryProgress

Implemented in `feedback.dart`.

```dart
const RosemaryProgress({
    super.key,
    required this.value,
    this.max = 100,
    this.label = 'Progress',
    this.onCancel,
    this.onRetry,
    this.paused = false,
    this.state = RosemaryProgressState.running,
  })
```

## RosemarySkeleton

Implemented in `feedback.dart`.

```dart
const RosemarySkeleton({
    super.key,
    this.width,
    this.height = 16,
    this.label = 'Loading',
  })
```

## RosemaryBadge

Implemented in `feedback.dart`.

```dart
const RosemaryBadge(
    this.label, {
    super.key,
    this.tone = RosemaryTone.neutral,
  })
```

## RosemaryAlert

Implemented in `feedback.dart`.

```dart
const RosemaryAlert(
    this.message, {
    super.key,
    this.tone = RosemaryTone.info,
    this.action,
  })
```

## RosemaryEmpty

Implemented in `feedback.dart`.

```dart
const RosemaryEmpty({
    super.key,
    required this.title,
    required this.description,
    this.action,
  })
```

## RosemaryAvatar

Implemented in `feedback.dart`.

```dart
const RosemaryAvatar({
    super.key,
    required this.label,
    this.image,
    this.size = 48,
  })
```

## RosemaryToast

Implemented in `feedback.dart`.

```dart
const RosemaryToast({
    super.key,
    required this.message,
    required this.onDismiss,
    this.actionLabel,
    this.onAction,
    this.timeout,
    this.paused = false,
  })
```

## RosemaryAnchoredOverlay

Implemented in `overlays.dart`.

```dart
const RosemaryAnchoredOverlay({
    super.key,
    required this.anchor,
    required this.child,
  })
```

## RosemaryDialog

Implemented in `overlays.dart`.

```dart
const RosemaryDialog({
    super.key,
    required this.open,
    required this.title,
    required this.child,
    required this.onDismiss,
    this.onAnimationFinished,
    this.modal = true,
    this.padding = const EdgeInsets.all(24),
  })
```

## RosemaryDrawer

Implemented in `overlays.dart`.

```dart
const RosemaryDrawer({
    super.key,
    required super.open,
    required super.title,
    required super.child,
    required super.onDismiss,
    super.onAnimationFinished,
    super.modal = true,
    this.width = 420,
  })
```

## RosemaryPopover

Implemented in `overlays.dart`.

```dart
const RosemaryPopover({
    super.key,
    required this.open,
    required this.trigger,
    required this.child,
    required this.onDismiss,
    this.onOpenChanged,
  })
```

## RosemaryTooltip

Implemented in `overlays.dart`.

```dart
const RosemaryTooltip({
    super.key,
    required this.message,
    required this.child,
    this.onOpenChanged,
  })
```

## RosemaryActionSurface

Implemented in `primitives.dart`.

```dart
const RosemaryActionSurface({
    super.key,
    required this.child,
    this.onActivate,
    this.focusNode,
    this.label,
    this.background,
    this.foreground,
    this.border,
    this.selected = false,
    this.link = false,
    this.button = true,
    this.enabled = true,
    this.radius,
    this.padding = const EdgeInsets.symmetric(horizontal: 16, vertical: 8),
    this.semanticsKey,
  })
```

## RosemaryButton

Implemented in `primitives.dart`.

```dart
const RosemaryButton({
    super.key,
    required this.label,
    this.semanticLabel,
    required this.onPressed,
    this.enabled = true,
    this.busy = false,
    this.variant = RosemaryButtonVariant.primary,
    this.leading,
    this.trailing,
    this.focusNode,
  })
```

## RosemaryIconButton

Implemented in `primitives.dart`.

```dart
const RosemaryIconButton({
    super.key,
    required this.label,
    required this.onPressed,
    required this.icon,
    this.enabled = true,
    this.busy = false,
    this.pressed = false,
    this.danger = false,
    this.focusNode,
  })
```

## RosemaryLink

Implemented in `primitives.dart`.

```dart
const RosemaryLink({
    super.key,
    required this.label,
    required this.onNavigate,
    this.current = false,
  })
```

## RosemaryIcon

Implemented in `primitives.dart`.

```dart
const RosemaryIcon(this.name, {super.key, this.size = 24, this.color})
```

## RosemaryInput

Implemented in `primitives.dart`.

```dart
const RosemaryInput({
    super.key,
    required this.value,
    required this.onChanged,
    required this.label,
    this.placeholder = '',
    this.enabled = true,
    this.readOnly = false,
    this.password = false,
    this.error,
    this.keyboardType,
    this.onCommit,
    this.focusNode,
    this.minLines = 1,
    this.maxLines = 1,
  })
```

## RosemaryTextarea

Implemented in `primitives.dart`.

```dart
const RosemaryTextarea({
    super.key,
    required this.value,
    required this.onChanged,
    required this.label,
    this.placeholder = '',
    this.enabled = true,
    this.readOnly = false,
    this.error,
    this.minLines = 4,
  })
```

## RosemarySearch

Implemented in `primitives.dart`.

```dart
const RosemarySearch({
    super.key,
    required this.query,
    required this.onQueryChanged,
    required this.onSubmit,
    this.label = 'Search',
    this.onClear,
    this.busy = false,
  })
```

## RosemaryDate

Implemented in `date_upload.dart`.

```dart
const RosemaryDate({
    super.key,
    this.value,
    this.onChanged,
    this.time,
    this.onTimeChanged,
    this.range,
    this.onRangeChanged,
    this.mode = RosemaryDateMode.date,
    required this.label,
    this.enabled = true,
    this.expanded,
    this.onOpenChanged,
  })
```

## RosemaryCalendar

Implemented in `date_upload.dart`.

```dart
const RosemaryCalendar({
    super.key,
    required this.value,
    required this.onChanged,
  })
```

## RosemaryTimeColumns

Implemented in `date_upload.dart`.

```dart
const RosemaryTimeColumns({
    super.key,
    required this.value,
    required this.onChanged,
  })
```

## RosemaryFile

Implemented in `date_upload.dart`.

```dart
const RosemaryFile({
    required this.id,
    required this.name,
    this.status = '',
    this.progress,
    this.canRetry = false,
    this.canCancel = false,
    this.state = RosemaryFileState.selected,
    this.error,
  })
```

## RosemaryUpload

Implemented in `date_upload.dart`.

```dart
const RosemaryUpload({
    super.key,
    required this.label,
    required this.files,
    required this.onFilesSelected,
    this.onRemoved,
    this.onRetry,
    this.onCancel,
    this.acceptedTypes = const [],
    this.enabled = true,
    this.multiple = true,
    this.chooseFiles,
    this.onPickerError,
  })
```

## RosemaryOption

Implemented in `controls.dart`.

```dart
const RosemaryOption(this.id, this.label, {this.enabled = true})
```

## RosemaryCheckbox

Implemented in `controls.dart`.

```dart
const RosemaryCheckbox({
    super.key,
    required this.value,
    required this.onChanged,
    required this.label,
    this.enabled = true,
    this.error,
  })
```

## RosemaryRadio

Implemented in `controls.dart`.

```dart
const RosemaryRadio({
    super.key,
    required this.value,
    required this.onChanged,
    required this.label,
    required this.options,
    this.enabled = true,
    this.error,
  })
```

## RosemarySwitch

Implemented in `controls.dart`.

```dart
const RosemarySwitch({
    super.key,
    required this.value,
    required this.onChanged,
    required this.label,
    this.enabled = true,
    this.busy = false,
    this.error,
  })
```

## RosemarySlider

Implemented in `controls.dart`.

```dart
const RosemarySlider({
    super.key,
    required this.value,
    required this.onChanged,
    required this.label,
    this.min = 0,
    this.max = 100,
    this.step = 1,
    this.onCommit,
    this.enabled = true,
  })
```

## RosemarySelect

Implemented in `controls.dart`.

```dart
const RosemarySelect({
    super.key,
    required this.value,
    required this.onChanged,
    required this.options,
    required this.label,
    this.enabled = true,
    this.error,
    this.onOpenChanged,
  })
```

## RosemaryTabs

Implemented in `navigation.dart`.

```dart
const RosemaryTabs({
    super.key,
    required this.value,
    required this.options,
    required this.onChanged,
    this.panelBuilder,
  })
```

## RosemaryBreadcrumb

Implemented in `navigation.dart`.

```dart
const RosemaryBreadcrumb({
    super.key,
    required this.items,
    required this.onNavigate,
  })
```

## RosemaryPagination

Implemented in `navigation.dart`.

```dart
const RosemaryPagination({
    super.key,
    required this.page,
    required this.count,
    required this.onChanged,
    this.busy = false,
    this.error,
  })
```

## RosemaryMenu

Implemented in `navigation.dart`.

```dart
const RosemaryMenu({
    super.key,
    required this.open,
    required this.trigger,
    required this.items,
    required this.onActivate,
    required this.onOpenChanged,
  })
```

## RosemaryCard

Implemented in `navigation.dart`.

```dart
const RosemaryCard({
    super.key,
    required this.child,
    this.onActivate,
    this.selected = false,
  })
```

## RosemaryListItem

Implemented in `navigation.dart`.

```dart
const RosemaryListItem(
    this.id,
    this.title, {
    this.description,
    this.enabled = true,
  })
```

## RosemaryList

Implemented in `navigation.dart`.

```dart
const RosemaryList({
    super.key,
    required this.items,
    this.selected = const {},
    this.onSelectionChanged,
    this.onActivate,
    this.empty,
  })
```

## RosemaryTableColumn

Implemented in `navigation.dart`.

```dart
const RosemaryTableColumn(this.id, this.label, {this.sortable = false})
```

## RosemaryTableRow

Implemented in `navigation.dart`.

```dart
const RosemaryTableRow(this.id, this.cells)
```

## RosemaryTable

Implemented in `navigation.dart`.

```dart
const RosemaryTable({
    super.key,
    required this.label,
    required this.columns,
    required this.rows,
    this.sortColumn,
    this.ascending = true,
    this.onSortChanged,
    this.selected = const {},
    this.onSelectionChanged,
    this.onActivate,
    this.empty,
  })
```

## RosemaryStep

Implemented in `navigation.dart`.

```dart
const RosemaryStep(
    this.id,
    this.label, {
    this.state = RosemaryStepState.notStarted,
    this.enabled = true,
  })
```

## RosemaryStepper

Implemented in `navigation.dart`.

```dart
const RosemaryStepper({
    super.key,
    required this.steps,
    required this.value,
    this.onChanged,
  })
```

## RosemaryThemeData

Implemented in `theme.dart`.

```dart
const RosemaryThemeData({
    required this.colors,
    this.reduceMotion = false,
    this.strings = _identity,
  })
```

## RosemaryThemeData

Implemented in `theme.dart`.

```dart
const RosemaryThemeData(colors: RosemaryTokens.light)
```

## RosemaryContrastDiagnostic

Implemented in `theme.dart`.

```dart
const RosemaryContrastDiagnostic(
    this.foreground,
    this.background,
    this.ratio,
    this.target,
  )
```

## RosemaryTheme

Implemented in `theme.dart`.

```dart
const RosemaryTheme({
    super.key,
    required this.child,
    this.mode = RosemaryThemeMode.inherit,
    this.colors,
    this.highContrastColors,
    this.reduceMotion = false,
    this.direction,
    this.locale,
    this.strings,
    this.onContrastDiagnostics,
  })
```

## RosemaryText

Implemented in `theme.dart`.

```dart
const RosemaryText(
    this.text, {
    super.key,
    this.role = 'body',
    this.color,
    this.textAlign,
  })
```

Menu options use stable IDs. Opening initially or through controlled state establishes menu focus. Arrow/Home/End/typeahead skip disabled items and reveal the active row in a scrollable popup. Dynamic replacement preserves the active ID when possible, otherwise moves to the first enabled item; Enter cannot submit a removed/disabled row. Tab proposes closing and continues native traversal.
