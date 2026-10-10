import { COMPONENT_SPECS } from "./componentsSpec";
export const NATIVE_LIBRARIES = [
  {
    id: "flutter",
    title: "Flutter SDK",
    package: "Rosemary Flutter",
    document: "flutter-sdk",
    approach: "Dart 控件与平台策略，适配 Material / Cupertino。",
  },
  {
    id: "android",
    title: "Android 原生",
    package: "Rosemary Compose",
    document: "android-compose",
    approach: "Kotlin / Compose，保留系统返回与 TalkBack。",
  },
  {
    id: "ios",
    title: "iOS Swift",
    package: "Rosemary SwiftUI",
    document: "ios-swiftui",
    approach: "SwiftUI / SwiftPM，保留导航手势与 Dynamic Type。",
  },
] as const;
export const NATIVE_FIRST_WAVE = [
  "button",
  "icon-button",
  "text-field",
  "text-area",
  "checkbox",
  "switch",
  "slider",
  "select",
  "tabs",
  "dialog",
  "alert-dialog",
  "progress",
  "spinner",
  "empty-state",
] as const;
const secondWave = [
  "password-field",
  "search-field",
  "number-field",
  "radio",
  "combo-box",
  "date-picker",
  "time-picker",
  "file-upload",
  "color-picker",
  "segmented-control",
  "list",
  "description-list",
  "badge",
  "tag",
  "avatar",
  "sheet",
  "toast",
  "snackbar",
  "banner",
  "card",
  "accordion",
  "divider",
];
/** Implemented platform adapters. Release stage is separate from API availability. */
const primitives: Record<string, [string, string, string]> = {
  button: [
    "FilledButton / CupertinoButton",
    "Material 3 Button",
    "Button / ButtonStyle",
  ],
  "icon-button": [
    "IconButton / CupertinoButton",
    "IconButton",
    "Button + accessibilityLabel",
  ],
  "button-group": [
    "Row / Wrap of actions",
    "Row / FlowRow of actions",
    "HStack of Buttons",
  ],
  "split-button": [
    "Button + MenuAnchor",
    "Button + DropdownMenu",
    "Button + Menu",
  ],
  "link-button": [
    "Link action with route callback",
    "TextButton with navigation callback",
    "NavigationLink / Link",
  ],
  "floating-action-button": [
    "FloatingActionButton; iOS toolbar action",
    "FloatingActionButton",
    "Toolbar primary action",
  ],
  "text-field": [
    "TextField / CupertinoTextField",
    "TextFieldValue / String adapter",
    "TextField + Binding",
  ],
  "text-area": ["Multiline TextField", "Multiline TextField", "TextEditor"],
  "password-field": ["Obscured TextField", "Secure text field", "SecureField"],
  "search-field": [
    "SearchBar / CupertinoSearchTextField",
    "SearchBar",
    "searchable / TextField",
  ],
  "number-field": [
    "TextField + step actions",
    "TextField + step actions",
    "TextField + Stepper",
  ],
  checkbox: [
    "Checkbox; iOS checkmark choice row",
    "TriStateCheckbox",
    "Checkmark choice Button / List selection",
  ],
  radio: [
    "RadioGroup; iOS single-choice list",
    "RadioButton + selectableGroup",
    "Picker single selection",
  ],
  switch: ["Switch.adaptive", "Switch", "Toggle"],
  slider: ["Slider / CupertinoSlider", "Slider", "Slider"],
  select: [
    "MenuAnchor / adaptive picker sheet",
    "ExposedDropdownMenuBox / selection sheet",
    "Picker / Menu; long-list sheet",
  ],
  "combo-box": [
    "Controlled text + keyboard suggestions",
    "TextField + suggestions",
    "TextField + suggestions",
  ],
  "date-picker": [
    "showDatePicker / CupertinoDatePicker",
    "DatePickerDialog",
    "DatePicker",
  ],
  "time-picker": [
    "showTimePicker / CupertinoDatePicker",
    "TimePickerDialog",
    "DatePicker hourAndMinute",
  ],
  "file-upload": [
    "Host document picker adapter",
    "Activity Result document picker",
    "fileImporter",
  ],
  "color-picker": [
    "Accessible color choices",
    "Accessible color choices",
    "ColorPicker",
  ],
  tabs: [
    "TabBar / adaptive section selector",
    "PrimaryTabRow",
    "Section selector + one content panel",
  ],
  "segmented-control": [
    "SegmentedButton / CupertinoSegmentedControl",
    "SingleChoiceSegmentedButtonRow",
    "Picker segmented style",
  ],
  breadcrumb: [
    "Wide-layout path links",
    "Wide-layout path links",
    "Wide-layout NavigationLink path",
  ],
  sidebar: [
    "NavigationRail / split layout",
    "NavigationRail / permanent drawer",
    "NavigationSplitView",
  ],
  "top-navigation": [
    "AppBar / CupertinoNavigationBar",
    "TopAppBar",
    "NavigationStack toolbar",
  ],
  "bottom-navigation": [
    "NavigationBar / CupertinoTabBar",
    "NavigationBar",
    "TabView",
  ],
  pagination: ["Page action group", "Page action group", "Page action group"],
  stepper: [
    "Step selection + controlled content",
    "Step selection + controlled content",
    "Step selection + controlled content",
  ],
  "command-palette": [
    "Shortcuts / Actions + search overlay",
    "Keyboard commands + search overlay",
    "Native search controller + keyboard commands",
  ],
  table: [
    "DataTable; compact list on narrow widths",
    "Lazy layout / compact list",
    "List; wide table adapter later",
  ],
  "data-grid": [
    "Virtual rows + pinned column + edit/filter/keyboard",
    "Virtual rows + pinned column + edit/filter/keyboard",
    "Virtual rows + pinned column + edit/filter/keyboard",
  ],
  list: [
    "ListView + stable item keys",
    "LazyColumn + stable keys",
    "List + stable identity",
  ],
  "description-list": [
    "Label-value layout",
    "Label-value layout",
    "LabeledContent",
  ],
  "tree-view": [
    "Hierarchical disclosure + focus model",
    "Hierarchical lazy list + focus model",
    "UITableView tree + keyboard / reader actions",
  ],
  badge: ["Badge / semantic status", "Badge", "Text status badge"],
  tag: [
    "Chip / input choice",
    "FilterChip / InputChip",
    "Label / choice Button",
  ],
  avatar: [
    "Image + fallback semantics",
    "Image + fallback semantics",
    "Image + fallback semantics",
  ],
  dialog: [
    "showAdaptiveDialog",
    "AlertDialog / Dialog",
    "sheet for form; native alert for message",
  ],
  "alert-dialog": [
    "Adaptive alert",
    "AlertDialog",
    "alert / confirmationDialog",
  ],
  sheet: [
    "showModalBottomSheet / adaptive sheet",
    "ModalBottomSheet",
    "Native sheet + adaptive scroll content",
  ],
  toast: [
    "Nonmodal status overlay",
    "Nonmodal status overlay",
    "Nonmodal status overlay",
  ],
  snackbar: [
    "ScaffoldMessenger + stable recovery",
    "SnackbarHost + stable recovery",
    "Status with persistent Undo action",
  ],
  banner: ["MaterialBanner / inline notice", "Inline notice", "Inline notice"],
  progress: [
    "LinearProgressIndicator",
    "LinearProgressIndicator",
    "Determinate ProgressView",
  ],
  skeleton: [
    "Static placeholder",
    "Static placeholder",
    "redacted placeholder",
  ],
  spinner: [
    "CircularProgressIndicator / CupertinoActivityIndicator",
    "CircularProgressIndicator",
    "Indeterminate ProgressView",
  ],
  tooltip: [
    "Tooltip for pointer; keyboard help",
    "TooltipBox for pointer/keyboard",
    "help on pointer platforms; accessible hint",
  ],
  popover: [
    "MenuAnchor / adaptive overlay",
    "Popup / adaptive sheet",
    "popover / adaptive sheet",
  ],
  "dropdown-menu": ["MenuAnchor", "DropdownMenu", "Menu"],
  "context-menu": [
    "Context actions / MenuAnchor",
    "Context actions",
    "contextMenu",
  ],
  drawer: [
    "Wide side panel / narrow sheet",
    "ModalNavigationDrawer / side panel",
    "NavigationSplitView / sheet",
  ],
  card: ["Card / quiet grouped surface", "Card", "Grouped content surface"],
  accordion: [
    "ExpansionTile / native disclosure",
    "Expandable content + semantics",
    "DisclosureGroup",
  ],
  divider: ["Divider", "HorizontalDivider / VerticalDivider", "Divider"],
  "empty-state": [
    "Text + optional real action",
    "Text + optional real action",
    "ContentUnavailableView / compatible content",
  ],
  "scroll-area": [
    "ScrollView + Scrollbar with controller",
    "Native scroll state + platform indicators",
    "ScrollView; system indicators",
  ],
  "resizable-panels": [
    "Wide-layout split adapter",
    "Wide-layout split adapter",
    "Wide split adapter; macOS later",
  ],
  "metric-card": [
    "Value + meaning; no animated counts",
    "Value + meaning",
    "Value + meaning",
  ],
  "prober-status": [
    "Semantic status + optional recovery",
    "Semantic status + optional recovery",
    "Semantic status + optional recovery",
  ],
  "file-row": [
    "Selectable row + host actions",
    "Selectable lazy row + host actions",
    "List row + swipeActions / contextMenu",
  ],
};
export const NATIVE_COMPONENT_PLAN = COMPONENT_SPECS.map((spec) => {
  const hosts = primitives[spec.id];
  if (!hosts) throw Error(`Missing native design: ${spec.id}`);
  return {
    id: spec.id,
    name: spec.name,
    status: "Prototype" as const,
    wave: NATIVE_FIRST_WAVE.includes(
      spec.id as (typeof NATIVE_FIRST_WAVE)[number],
    )
      ? 1
      : secondWave.includes(spec.id)
        ? 2
        : 3,
    flutter: hosts[0],
    android: hosts[1],
    ios: hosts[2],
    specification: `#/components/${spec.id}`,
  };
});
