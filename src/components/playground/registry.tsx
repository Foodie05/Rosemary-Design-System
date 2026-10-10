import type { ComponentType } from "react";
import type { PreviewProps } from "../ui/core";
import * as A from "../ui/actions";
import * as I from "../ui/inputs";
import * as N from "../ui/navigation";
import * as D from "../ui/data";
import * as F from "../ui/feedback";
import * as O from "../ui/overlays";
import * as L from "../ui/layout";
export interface ComponentImplementation {
  Preview: ComponentType<PreviewProps>;
  source: string;
  interactive: boolean;
  controls: ("variant" | "size" | "disabled" | "loading" | "error" | "label")[];
  note?: string;
}
const reg = (
  Preview: ComponentType<PreviewProps>,
  source: string,
  interactive = true,
  controls: ComponentImplementation["controls"] = ["disabled", "label"],
): ComponentImplementation => ({ Preview, source, interactive, controls });
const input = (kind: string) => (p: PreviewProps) => (
  <I.TextInput {...p} kind={kind} />
);
const nav = (kind: string) => (p: PreviewProps) => (
  <N.NavExample {...p} kind={kind} />
);
const feedback = (kind: string) => (p: PreviewProps) => (
  <F.DialogExample {...p} kind={kind} />
);
export const COMPONENT_IMPLEMENTATIONS: Record<
  string,
  ComponentImplementation
> = {
  button: reg(A.ButtonExample, "actions", true, [
    "variant",
    "size",
    "disabled",
    "loading",
    "label",
  ]),
  "icon-button": reg(A.IconButtonExample, "actions", true, [
    "variant",
    "size",
    "disabled",
    "label",
  ]),
  "button-group": reg(A.ButtonGroupExample, "actions", true, [
    "size",
    "disabled",
  ]),
  "split-button": reg(A.SplitButtonExample, "actions", true, [
    "variant",
    "size",
    "disabled",
    "loading",
    "label",
  ]),
  "link-button": reg(A.LinkButtonExample, "actions"),
  "floating-action-button": reg(A.FabExample, "actions"),
  "text-field": reg(input("text"), "inputs", true, [
    "size",
    "disabled",
    "error",
    "label",
  ]),
  "text-area": reg(input("textarea"), "inputs", true, [
    "disabled",
    "error",
    "label",
  ]),
  "password-field": reg(input("password"), "inputs", true, [
    "disabled",
    "error",
    "label",
  ]),
  "search-field": reg(input("search"), "inputs"),
  "number-field": reg(input("number"), "inputs"),
  checkbox: reg(I.CheckboxExample, "inputs"),
  radio: reg(I.RadioExample, "inputs"),
  switch: reg(I.SwitchExample, "inputs"),
  slider: reg(I.SliderExample, "inputs"),
  select: reg(I.SelectExample, "inputs"),
  "combo-box": reg(I.ComboBoxExample, "inputs"),
  "date-picker": reg(input("date"), "inputs"),
  "time-picker": reg(input("time"), "inputs"),
  "file-upload": reg(I.FileUploadExample, "inputs"),
  "color-picker": reg(input("color"), "inputs"),
  tabs: reg(N.TabsExample, "navigation", true, ["disabled"]),
  "segmented-control": reg(N.SegmentedExample, "navigation", true, [
    "size",
    "disabled",
    "label",
  ]),
  breadcrumb: reg(N.BreadcrumbExample, "navigation", true, ["disabled"]),
  sidebar: reg(nav("sidebar"), "navigation"),
  "top-navigation": reg(nav("top"), "navigation"),
  "bottom-navigation": reg(nav("bottom"), "navigation"),
  pagination: reg(N.PaginationExample, "navigation", true, ["disabled"]),
  stepper: reg(N.StepperExample, "navigation", true, ["disabled"]),
  "command-palette": reg(N.CommandPaletteExample, "navigation"),
  table: reg(D.TableExample, "data"),
  "data-grid": reg(D.DataGridExample, "data", true, ["disabled"]),
  list: reg(D.ListExample, "data", true, ["disabled"]),
  "description-list": reg(D.DescriptionExample, "data", false, []),
  "tree-view": reg(D.TreeExample, "data", true, ["disabled"]),
  badge: reg(D.BadgeExample, "data", false, []),
  tag: reg(D.TagExample, "data", true, ["disabled"]),
  avatar: reg(D.AvatarExample, "data", false, []),
  dialog: reg(feedback("dialog"), "feedback"),
  "alert-dialog": reg(feedback("alert-dialog"), "feedback"),
  sheet: reg(feedback("sheet"), "feedback"),
  toast: reg(F.ToastExample, "feedback"),
  snackbar: reg((p) => <F.ToastExample {...p} kind="snackbar" />, "feedback"),
  banner: reg(F.BannerExample, "feedback", true, ["disabled"]),
  progress: reg(F.ProgressExample, "feedback"),
  skeleton: reg(F.SkeletonExample, "feedback", false, []),
  spinner: reg(F.SpinnerExample, "feedback", false, ["label"]),
  tooltip: reg(O.TooltipExample, "overlays"),
  popover: reg(O.PopoverExample, "overlays"),
  "dropdown-menu": reg(O.DropdownExample, "overlays"),
  "context-menu": reg(O.ContextExample, "overlays"),
  drawer: reg(O.DrawerExample, "overlays"),
  card: reg(L.CardExample, "layout"),
  accordion: reg(L.AccordionExample, "layout", true, []),
  divider: reg(L.DividerExample, "layout", false, []),
  "empty-state": reg(L.EmptyStateExample, "layout"),
  "scroll-area": reg(L.ScrollExample, "layout", true, []),
  "resizable-panels": reg(L.ResizableExample, "layout", true, ["disabled"]),
  "metric-card": reg(D.MetricExample, "data", false, []),
  "prober-status": reg(D.ProberExample, "data", true, ["disabled"]),
  "file-row": reg(D.FileRowExample, "data", true, ["disabled"]),
};
export const componentSourceFiles = import.meta.glob("../ui/*.tsx", {
  query: "?raw",
  import: "default",
  eager: true,
}) as Record<string, string>;
