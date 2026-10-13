import { JSDOM } from "jsdom";
import assert from "node:assert/strict";
import test, { afterEach } from "node:test";
const dom = new JSDOM("<!doctype html><html><body></body></html>", {
  url: "http://localhost/",
  pretendToBeVisual: true,
});
for (const key of [
  "window",
  "document",
  "HTMLElement",
  "HTMLInputElement",
  "HTMLDialogElement",
  "Node",
  "MutationObserver",
  "File",
  "Event",
  "MouseEvent",
  "KeyboardEvent",
])
  Object.defineProperty(globalThis, key, {
    value: dom.window[key],
    configurable: true,
  });
Object.defineProperty(globalThis, "navigator", {
  value: dom.window.navigator,
  configurable: true,
});
globalThis.getComputedStyle = (element) => dom.window.getComputedStyle(element);
globalThis.IS_REACT_ACT_ENVIRONMENT = true;
let systemDark = false,
  systemReduce = false;
const mediaListeners = new Set();
window.matchMedia = (query) => ({
  get matches() {
    return query.includes("color-scheme") ? systemDark : systemReduce;
  },
  addEventListener: (_, fn) => mediaListeners.add(fn),
  removeEventListener: (_, fn) => mediaListeners.delete(fn),
});
HTMLDialogElement.prototype.showModal = function () {
  this.setAttribute("open", "");
  this.querySelector('button,input,[tabindex="0"]')?.focus();
};
HTMLDialogElement.prototype.show = function () {
  this.setAttribute("open", "");
};
HTMLDialogElement.prototype.close = function () {
  this.removeAttribute("open");
};
const React = await import("react");
const { createElement: h, useState } = React;
const { render, screen, fireEvent, cleanup, act } =
  await import("@testing-library/react");
const { renderToString } = await import("react-dom/server");
const UI = await import("../dist/index.js");
const { iconNames } = await import("@rosemary-ui/icons");
const { defaultThemes } = await import("@rosemary-ui/tokens");
afterEach(() => {
  cleanup();
  systemDark = false;
  systemReduce = false;
});
const wrap = (child, props = {}) => h(UI.RosemaryProvider, props, child);
test("SSR and nested providers preserve independent colors, report contrast, honor system reduction and inherit strings", async () => {
  const html = renderToString(
    wrap(
      h(
        UI.RosemaryProvider,
        { colors: { surface: "#FFFFFF" } },
        h(UI.Button, null, "SSR"),
      ),
      { mode: "dark" },
    ),
  );
  assert.ok(html.includes(`--rm-primary:${defaultThemes.dark.primary}`));
  assert.match(html, /--rm-surface:#FFFFFF/);
  assert.match(html, /data-rm-theme="dark"/);
  const diagnostics = [];
  render(
    wrap(
      h(
        UI.RosemaryProvider,
        {
          colors: { primary: "#FFFFFF", onPrimary: "#FFFFFF" },
          onDiagnostics: (d) => diagnostics.push(...d),
        },
        h(UI.Button, null, "Nested"),
      ),
      {
        mode: "dark",
        language: "en",
        strings: { close: "Dismiss" },
        direction: "rtl",
      },
    ),
  );
  const nodes = document.querySelectorAll(".rm-theme");
  assert.equal(
    nodes[1].style.getPropertyValue("--rm-ink"),
    defaultThemes.dark.ink,
  );
  assert.equal(nodes[1].lang, "en");
  assert.equal(nodes[1].dir, "rtl");
  assert.ok(
    diagnostics.some((d) => d.kind === "contrast" && d.ratio < d.target),
  );
  assert.equal(nodes[1].style.getPropertyValue("--rm-primary"), "#FFFFFF");
  await act(() => {
    systemReduce = true;
    mediaListeners.forEach((fn) => fn());
  });
  assert.equal(nodes[1].dataset.rmReducedMotion, "true");
  assert.throws(
    () =>
      renderToString(
        wrap(h(UI.Button, null, "x"), { colors: { primary: "transparent" } }),
      ),
    /Invalid theme color/,
  );
  cleanup();
  let reports = 0;
  const reportedRevisions = [];
  function ReportingHost() {
    const [diagnostics, setDiagnostics] = useState([]);
    const [primary, setPrimary] = useState("#FFFFFF");
    const [focus, setFocus] = useState(defaultThemes.light.focus);
    const [revision, setRevision] = useState(0);
    return wrap(
      h(
        "div",
        null,
        h("output", { "data-testid": "diagnostics" }, diagnostics.length),
        h("output", { "data-testid": "revision" }, revision),
        h("button", { onClick: () => setRevision((n) => n + 1) }, "Rerender"),
        h("button", { onClick: () => setPrimary("#614578") }, "Change primary"),
        h("button", { onClick: () => setFocus("#FFFFFF") }, "Change focus"),
      ),
      {
        mode: "light",
        colors: { primary, focus },
        onDiagnostics: (next) => {
          reports++;
          reportedRevisions.push(revision);
          // Bound a regression instead of letting a broken provider hang the suite.
          assert.ok(
            reports <= 3,
            "Equal palette/callback identities must not renotify",
          );
          setDiagnostics([...next]);
        },
      },
    );
  }
  render(h(React.StrictMode, null, h(ReportingHost)));
  assert.equal(reports, 1);
  assert.ok(Number(screen.getByTestId("diagnostics").textContent) > 0);
  fireEvent.click(screen.getByRole("button", { name: "Rerender" }));
  assert.equal(reports, 1);
  assert.equal(screen.getByTestId("revision").textContent, "1");
  fireEvent.click(screen.getByRole("button", { name: "Change primary" }));
  assert.equal(reports, 2);
  assert.equal(screen.getByTestId("diagnostics").textContent, "0");
  fireEvent.click(screen.getByRole("button", { name: "Change focus" }));
  assert.equal(reports, 3);
  assert.deepEqual(reportedRevisions, [0, 1, 1]);
  assert.ok(Number(screen.getByTestId("diagnostics").textContent) > 0);
});
test("buttons, link and 71 original icons expose real semantics; busy actions refuse duplicate activation", () => {
  let clicks = 0;
  render(
    wrap(
      h(
        "div",
        null,
        h(UI.Button, { loading: true, onClick: () => clicks++ }, "Busy"),
        h(UI.IconButton, {
          icon: "close",
          label: "Remove",
          onClick: () => clicks++,
        }),
        h(UI.Link, { href: "#target" }, "Read"),
      ),
    ),
  );
  const icons = render(
    wrap(
      h(
        "div",
        { "data-testid": "all-icons" },
        iconNames.map((name) => h(UI.Icon, { key: name, name, label: name })),
      ),
    ),
  );
  assert.equal(
    icons.getByTestId("all-icons").querySelectorAll("svg").length,
    71,
  );
  for (const name of iconNames)
    assert.ok(
      screen
        .getByRole("img", { name })
        .querySelector("path,circle,rect,line,polyline,polygon,ellipse"),
    );
  fireEvent.click(screen.getByRole("button", { name: "Busy" }));
  assert.equal(clicks, 0);
  fireEvent.click(screen.getByRole("button", { name: "Remove" }));
  assert.equal(clicks, 1);
  assert.equal(
    screen.getByRole("link", { name: "Read" }).getAttribute("href"),
    "#target",
  );
  assert.equal(
    screen
      .getByRole("button", { name: "Remove" })
      .querySelector("svg")
      .getAttribute("viewBox"),
    "0 0 24 24",
  );
});
test("input, textarea, search, mixed checkbox, radio, switch and slider delegate controlled state without optimistic mutations", () => {
  const proposals = [];
  render(
    wrap(
      h(
        "div",
        null,
        h(UI.Input, {
          label: "Input",
          value: "fixed",
          onValueChange: (v) => proposals.push(v),
        }),
        h(UI.Textarea, {
          label: "Textarea",
          value: "fixed",
          onValueChange: (v) => proposals.push(v),
        }),
        h(UI.Search, {
          label: "Query",
          value: "fixed",
          onValueChange: (v) => proposals.push(v),
          onSearch: (v) => proposals.push(`search:${v}`),
        }),
        h(UI.Checkbox, {
          label: "Check",
          checked: "mixed",
          onCheckedChange: (v) => proposals.push(v),
        }),
        h(UI.Radio, {
          label: "Radio",
          value: "a",
          options: [
            { value: "a", label: "A" },
            { value: "b", label: "B" },
          ],
          onValueChange: (v) => proposals.push(v),
        }),
        h(UI.Switch, {
          label: "Switch",
          checked: false,
          onCheckedChange: (v) => proposals.push(v),
        }),
        h(UI.Slider, {
          label: "Slider",
          value: 10,
          min: 0,
          max: 20,
          onValueChange: (v) => proposals.push(v),
        }),
      ),
    ),
  );
  fireEvent.change(screen.getByLabelText("Input"), {
    target: { value: "proposal" },
  });
  assert.equal(screen.getByLabelText("Input").value, "fixed");
  fireEvent.change(screen.getByLabelText("Textarea"), {
    target: { value: "proposal" },
  });
  assert.equal(screen.getByLabelText("Textarea").value, "fixed");
  fireEvent.submit(screen.getByRole("search"));
  assert.ok(proposals.includes("search:fixed"));
  const checkbox = screen.getByRole("checkbox");
  assert.equal(checkbox.indeterminate, true);
  assert.equal(checkbox.getAttribute("aria-checked"), "mixed");
  fireEvent.click(checkbox);
  assert.equal(checkbox.checked, false);
  fireEvent.click(screen.getByRole("radio", { name: "B" }));
  assert.equal(screen.getByRole("radio", { name: "A" }).checked, true);
  fireEvent.click(screen.getByRole("switch"));
  assert.equal(
    screen.getByRole("switch").getAttribute("aria-checked"),
    "false",
  );
  fireEvent.change(screen.getByRole("slider"), { target: { value: "17" } });
  assert.equal(screen.getByRole("slider").value, "10");
  assert.ok(proposals.includes(17));
  cleanup();
  let searches = 0;
  render(
    wrap(
      h(UI.Search, {
        label: "Disabled search",
        disabled: true,
        value: "fixed",
        onValueChange: () => {},
        onSearch: () => searches++,
      }),
    ),
  );
  assert.equal(screen.getByRole("button").disabled, true);
  fireEvent.submit(screen.getByRole("search"));
  assert.equal(searches, 0);
});
test("select keyboard/typeahead, tabs RTL, breadcrumb, pagination, menu and stepper honor host refusals", () => {
  const calls = [];
  render(
    wrap(
      h(
        "div",
        null,
        h(UI.Select, {
          label: "Select",
          value: "a",
          options: [
            { value: "a", label: "Apple" },
            { value: "x", label: "Disabled", disabled: true },
            { value: "b", label: "Banana" },
          ],
          onValueChange: (v) => calls.push(v),
        }),
        h(UI.Tabs, {
          label: "Tabs",
          value: "a",
          items: [
            { value: "a", label: "Tab A", content: "Panel A" },
            { value: "b", label: "Tab B", content: "Panel B" },
          ],
          onValueChange: (v) => calls.push(v),
        }),
        h(UI.Breadcrumb, {
          items: [{ label: "Home", href: "#home" }, { label: "Current" }],
        }),
        h(UI.Pagination, {
          page: 1,
          pageCount: 10,
          onPageChange: (p) => calls.push(p),
        }),
        h(UI.Menu, {
          label: "Actions",
          open: true,
          onOpenChange: (v) => calls.push(v),
          items: [
            { id: "copy", label: "Copy", onSelect: () => calls.push("copy") },
            {
              id: "delete",
              label: "Delete",
              onSelect: () => calls.push("delete"),
            },
          ],
        }),
        h(UI.Stepper, {
          current: "a",
          items: [
            { id: "a", title: "Step A" },
            { id: "b", title: "Step B" },
          ],
          onStepChange: (v) => calls.push(v),
        }),
      ),
      { direction: "rtl" },
    ),
  );
  fireEvent.click(screen.getByRole("combobox"));
  const list = screen.getByRole("listbox");
  fireEvent.keyDown(list, { key: "b" });
  fireEvent.keyDown(list, { key: "Enter" });
  assert.ok(calls.includes("b"));
  assert.equal(screen.getByRole("combobox").textContent, "Apple");
  fireEvent.keyDown(screen.getByRole("tab", { name: "Tab A" }), {
    key: "ArrowLeft",
  });
  assert.equal(
    document.activeElement,
    screen.getByRole("tab", { name: "Tab B" }),
  );
  assert.equal(
    screen.getByRole("tab", { name: "Tab A" }).getAttribute("aria-selected"),
    "true",
  );
  assert.equal(
    screen.getByText("Current").getAttribute("aria-current"),
    "page",
  );
  fireEvent.click(screen.getByRole("button", { name: "下一页" }));
  assert.ok(calls.includes(2));
  assert.equal(
    screen
      .getByRole("button", { name: "第 1 页" })
      .getAttribute("aria-current"),
    "page",
  );
  fireEvent.click(screen.getByRole("menuitem", { name: "Delete" }));
  assert.ok(calls.includes("delete"));
  assert.ok(screen.getByRole("menu"));
  fireEvent.click(screen.getByRole("button", { name: "Step B" }));
  assert.equal(
    screen.getByText("Step A").closest("li").getAttribute("aria-current"),
    "step",
  );
  cleanup();
  const stepCalls = [];
  render(
    wrap(
      h(UI.Stepper, {
        current: "error",
        items: [
          { id: "error", title: "Failed step", state: "error" },
          { id: "locked", title: "Locked step", state: "unavailable" },
        ],
        onStepChange: (id) => stepCalls.push(id),
      }),
    ),
  );
  assert.equal(
    screen.getByText("Failed step").closest("li").dataset.state,
    "error",
  );
  assert.ok(screen.getByText("步骤失败"));
  assert.equal(
    screen.getByRole("button", { name: "Locked step" }).disabled,
    true,
  );
  fireEvent.click(screen.getByRole("button", { name: "Locked step" }));
  assert.equal(stepCalls.length, 0);
  fireEvent.click(screen.getByRole("button", { name: "Failed step" }));
  assert.deepEqual(stepCalls, ["error"]);
});
test("date drafts cancel cleanly, support year 0001 and 9999, reject invalid year/time, keyboard and min/max", () => {
  const values = [],
    times = [];
  render(
    wrap(
      h(UI.DatePicker, {
        label: "Date",
        value: "0001-01-01",
        onValueChange: (v) => values.push(v),
        withTime: true,
        time: "09:30",
        onTimeChange: (v) => times.push(v),
      }),
    ),
  );
  const trigger = screen.getByRole("button", { name: /Date 0001/ });
  fireEvent.click(trigger);
  fireEvent.click(screen.getByRole("button", { name: "年份" }));
  assert.equal(screen.getByLabelText("年份", { selector: "input" }).value, "1");
  fireEvent.click(screen.getByRole("button", { name: "年份" }));
  fireEvent.keyDown(screen.getByRole("gridcell", { name: "0001-01-01" }), {
    key: "ArrowRight",
  });
  assert.equal(
    document.activeElement,
    screen.getByRole("gridcell", { name: "0001-01-02" }),
  );
  fireEvent.click(screen.getByRole("button", { name: "取消" }));
  assert.equal(values.length, 0);
  fireEvent.click(trigger);
  fireEvent.click(screen.getByRole("button", { name: "年份" }));
  fireEvent.change(screen.getByLabelText("年份", { selector: "input" }), {
    target: { value: "9999" },
  });
  fireEvent.click(screen.getByRole("button", { name: "月份" }));
  fireEvent.click(screen.getByRole("button", { name: "12 月" }));
  fireEvent.click(screen.getByRole("gridcell", { name: "9999-12-31" }));
  fireEvent.change(screen.getByLabelText("时间（HH:mm）"), {
    target: { value: "24:00" },
  });
  assert.equal(screen.getByRole("button", { name: "确认" }).disabled, true);
  fireEvent.change(screen.getByLabelText("时间（HH:mm）"), {
    target: { value: "23:59" },
  });
  fireEvent.click(screen.getByRole("button", { name: "确认" }));
  assert.deepEqual(values, ["9999-12-31"]);
  assert.deepEqual(times, ["23:59"]);
  assert.equal(
    screen.getByLabelText("Date", { selector: "input" }).value,
    "0001-01-01",
  );
  cleanup();
  render(
    wrap(
      h(UI.DatePicker, {
        label: "Bounded",
        value: "2000-02-28",
        min: "2000-02-28",
        max: "2000-03-01",
        onValueChange: () => {},
      }),
    ),
  );
  fireEvent.click(screen.getByRole("button", { name: /Bounded/ }));
  assert.equal(
    screen
      .getByRole("gridcell", { name: "2000-02-27" })
      .getAttribute("aria-disabled"),
    "true",
  );
  assert.equal(
    screen
      .getByRole("gridcell", { name: "2000-02-29" })
      .getAttribute("aria-disabled"),
    null,
  );
  assert.equal(
    screen.getByRole("dialog", { name: "Bounded" }).getAttribute("aria-modal"),
    "false",
  );
  for (const row of screen.getByRole("grid").querySelectorAll("[role=row]"))
    assert.equal(row.children.length, 7);
  fireEvent.click(screen.getByRole("button", { name: "下个月" }));
  assert.equal(
    screen.getByRole("grid").querySelectorAll('[tabindex=\"0\"]').length,
    1,
  );
  fireEvent.pointerDown(document.body);
  assert.equal(screen.queryByRole("dialog"), null);
  fireEvent.change(screen.getByLabelText("Bounded", { selector: "input" }), {
    target: { value: "2000-03-01" },
  });
  assert.equal(
    screen.getByLabelText("Bounded", { selector: "input" }).value,
    "2000-02-28",
  );
  cleanup();
  const timeValues = [];
  render(
    wrap(
      h(UI.TimePicker, {
        label: "Time",
        value: "00:00",
        onValueChange: (v) => timeValues.push(v),
      }),
    ),
  );
  fireEvent.click(screen.getByRole("button", { name: "Time 00:00" }));
  const hours = screen.getByRole("listbox", { name: "小时" }),
    minutes = screen.getByRole("listbox", { name: "分钟" });
  assert.equal(hours.querySelectorAll('[tabindex=\"0\"]').length, 1);
  fireEvent.keyDown(hours.querySelector('[tabindex=\"0\"]'), { key: "End" });
  fireEvent.keyDown(document.activeElement, { key: "ArrowRight" });
  assert.equal(document.activeElement.closest("[role=listbox]"), minutes);
  fireEvent.keyDown(document.activeElement, { key: "End" });
  fireEvent.click(screen.getByRole("button", { name: "确认" }));
  assert.deepEqual(timeValues, ["23:59"]);
  assert.equal(screen.getByLabelText("Time").value, "00:00");
  cleanup();
  const ranges = [];
  render(
    wrap(
      h(UI.DateRange, {
        label: "Range",
        value: { start: "2000-02-02", end: "2000-02-03" },
        onValueChange: (r) => ranges.push(r),
      }),
    ),
  );
  fireEvent.change(screen.getByLabelText("结束日期"), {
    target: { value: "2000-02-01" },
  });
  assert.equal(ranges.length, 0);
  assert.ok(screen.getByRole("alert"));
  assert.equal(screen.getByLabelText("结束日期").value, "2000-02-03");
});
test("upload rejects type/size/count, removes by proposal only, and dialog/popover/tooltip remain themed with focus semantics", () => {
  const proposals = [],
    rejections = [];
  const file = new File(["a"], "a.txt", { type: "text/plain" });
  render(
    wrap(
      h(
        "div",
        null,
        h(UI.Upload, {
          label: "Files",
          files: [file],
          maxCount: 1,
          accept: ".txt",
          maxSize: 2,
          onFilesChange: (f) => proposals.push(f),
          onReject: (r) => rejections.push(...r),
        }),
        h(UI.Popover, {
          label: "Details",
          open: true,
          onOpenChange: () => {},
          children: h("p", null, "Themed content"),
        }),
        h(
          UI.Tooltip,
          { content: "Help content", delay: 0 },
          h(UI.Button, null, "Help"),
        ),
        h(UI.Dialog, {
          open: true,
          title: "Dialog",
          onOpenChange: () => {},
          children: h(UI.Input, {
            label: "Modal field",
            value: "",
            onValueChange: () => {},
          }),
        }),
      ),
      { mode: "dark" },
    ),
  );
  fireEvent.change(screen.getByLabelText("Files", { selector: "input" }), {
    target: {
      files: [
        new File(["a"], "a.png", { type: "image/png" }),
        new File(["abcd"], "b.txt", { type: "text/plain" }),
        new File(["b"], "c.txt", { type: "text/plain" }),
      ],
    },
  });
  assert.deepEqual(
    rejections.map((r) => r.reason),
    ["type", "size", "count"],
  );
  fireEvent.click(screen.getByRole("button", { name: "移除 a.txt" }));
  assert.deepEqual(proposals, [[]]);
  assert.ok(screen.getByText("a.txt"));
  assert.ok(
    screen
      .getByRole("region", { name: "Details" })
      .closest("[data-rm-theme=dark]"),
  );
  fireEvent.focus(screen.getByRole("button", { name: "Help" }));
  assert.equal(screen.getByRole("tooltip").textContent, "Help content");
  fireEvent.keyDown(screen.getByRole("button", { name: "Help" }), {
    key: "Escape",
  });
  assert.equal(screen.queryByRole("tooltip"), null);
  assert.ok(screen.getByRole("dialog", { name: "Dialog" }).open);
  fireEvent.click(screen.getByRole("button", { name: "关闭" }));
  assert.ok(screen.getByRole("dialog", { name: "Dialog" }).open);
  cleanup();
  const retry = [],
    cancel = [];
  const done = new File(["b"], "done.txt");
  const props = {
    label: "Transfer",
    files: [file, done],
    onFilesChange: () => {},
    onRetry: (f) => retry.push(f),
    onCancel: (f) => cancel.push(f),
  };
  const upload = render(
    wrap(
      h(UI.Upload, {
        ...props,
        fileStates: new Map([
          [file, { status: "failed", error: "Connection lost" }],
          [done, { status: "complete" }],
        ]),
      }),
    ),
  );
  assert.equal(
    screen.getByRole("region", { name: "Transfer" }).dataset.state,
    "partial",
  );
  assert.ok(screen.getByRole("alert").textContent.includes("Connection lost"));
  fireEvent.click(screen.getByRole("button", { name: "重试 a.txt" }));
  assert.deepEqual(retry, [file]);
  assert.ok(screen.getByRole("alert"));
  upload.rerender(
    wrap(
      h(UI.Upload, {
        ...props,
        fileStates: new Map([
          [file, { status: "uploading", progress: 45 }],
          [done, { status: "complete" }],
        ]),
      }),
    ),
  );
  assert.equal(
    screen
      .getByRole("progressbar", { name: "正在上传 a.txt" })
      .getAttribute("aria-valuenow"),
    "45",
  );
  fireEvent.click(screen.getByRole("button", { name: "取消 a.txt" }));
  assert.deepEqual(cancel, [file]);
  assert.ok(screen.getByRole("progressbar"));
  upload.rerender(
    wrap(
      h(UI.Upload, {
        ...props,
        fileStates: new Map([
          [file, { status: "cancelled" }],
          [done, { status: "complete" }],
        ]),
      }),
    ),
  );
  assert.equal(screen.queryByRole("progressbar"), null);
  assert.ok(screen.getByText("已取消"));
});
test("drawer completes only resolved animation promises, supports nonmodal, never closes refused dismissals", async () => {
  let pending = [];
  HTMLElement.prototype.animate = function (frames, options) {
    let resolve, reject;
    const finished = new Promise((a, b) => {
      resolve = a;
      reject = b;
    });
    const item = {
      frames,
      options,
      resolve,
      cancel: () => reject(new Error("cancelled")),
      finished,
    };
    pending.push(item);
    return item;
  };
  let completed = [];
  const props = {
    title: "Drawer",
    onOpenChange: () => {},
    onAnimationComplete: (v) => completed.push(v),
    modal: false,
  };
  const view = render(wrap(h(UI.Drawer, { ...props, open: true })));
  assert.equal(completed.length, 0);
  assert.equal(pending[0].options.duration, 220);
  await act(async () => pending.splice(0).forEach((x) => x.resolve()));
  assert.deepEqual(completed, [true]);
  view.rerender(wrap(h(UI.Drawer, { ...props, open: false })));
  assert.equal(pending[0].options.duration, 180);
  assert.ok(screen.getByRole("dialog", { name: "Drawer" }).open);
  await act(async () => pending.splice(0).forEach((x) => x.resolve()));
  assert.equal(document.querySelector("dialog").open, false);
  assert.deepEqual(completed, [true, false]);
  delete HTMLElement.prototype.animate;
});
test("feedback, card/list/table data, badges/avatar/empty/skeleton/loading/progress are real semantic renderings and controlled actions", async () => {
  const rows = Object.freeze([Object.freeze({ id: "1", name: "Record" })]);
  let sort,
    dismiss = 0;
  const view = render(
    wrap(
      h(
        "div",
        null,
        h(UI.Card, null, h("h3", null, "Card")),
        h(UI.List, {
          label: "Records",
          items: [
            {
              id: "1",
              content: "List record",
              action: h(UI.Button, { onClick: () => dismiss++ }, "List action"),
            },
          ],
        }),
        h(UI.Table, {
          caption: "Data",
          rows,
          rowKey: (r) => r.id,
          columns: [
            {
              id: "name",
              header: "Name",
              sortable: true,
              render: (r) => r.name,
            },
          ],
          sort: { column: "name", direction: "ascending" },
          onSortChange: (s) => (sort = s),
        }),
        h(UI.Badge, { tone: "success" }, "Success"),
        h(UI.Avatar, { name: "Rosemary", src: "bad.png" }),
        h(UI.Empty, {
          title: "Empty",
          action: h(UI.Button, { onClick: () => dismiss++ }, "Create"),
        }),
        h(UI.Skeleton, { lines: 3 }),
        h(UI.Loading, { label: "Task loading" }),
        h(UI.Progress, { label: "Task progress", value: 100 }),
        h(
          UI.Alert,
          { title: "Alert", tone: "danger", onDismiss: () => dismiss++ },
          "Problem",
        ),
        h(
          UI.Toast,
          { open: true, title: "Toast", onDismiss: () => dismiss++ },
          "Saved",
        ),
      ),
    ),
  );
  fireEvent.click(screen.getByRole("button", { name: "Name" }));
  assert.deepEqual(sort, { column: "name", direction: "descending" });
  assert.equal(
    screen
      .getByRole("columnheader", { name: "Name" })
      .getAttribute("aria-sort"),
    "ascending",
  );
  assert.equal(rows[0].name, "Record");
  fireEvent.click(screen.getByRole("button", { name: "List action" }));
  fireEvent.click(screen.getByRole("button", { name: "Create" }));
  fireEvent.click(screen.getAllByRole("button", { name: "关闭提示" })[0]);
  assert.equal(dismiss, 3);
  assert.equal(
    screen.getByRole("progressbar").getAttribute("aria-valuenow"),
    "100",
  );
  assert.equal(
    screen.getByRole("progressbar").firstElementChild.dataset.flowing,
    "false",
  );
  assert.equal(screen.getByRole("alert").textContent.includes("Problem"), true);
  assert.ok(screen.getByText("Toast"));
  assert.equal(
    screen.getByRole("img", { name: "Rosemary" }).dataset.state,
    "loading",
  );
  fireEvent.load(
    screen.getByRole("img", { name: "Rosemary" }).querySelector("img"),
  );
  assert.equal(
    screen.getByRole("img", { name: "Rosemary" }).dataset.state,
    "image",
  );
  fireEvent.error(
    screen.getByRole("img", { name: "Rosemary" }).querySelector("img"),
  );
  assert.equal(screen.getByRole("img", { name: "Rosemary" }).textContent, "Ro");
  view.rerender(wrap(h(UI.Avatar, { name: "Rosemary", src: "new.png" })));
  assert.equal(
    screen
      .getByRole("img", { name: "Rosemary" })
      .querySelector("img")
      .getAttribute("src"),
    "new.png",
  );
  assert.throws(
    () => renderToString(wrap(h(UI.Skeleton, { lines: Infinity }))),
    /Skeleton lines/,
  );
  assert.throws(
    () => renderToString(wrap(h(UI.Progress, { label: "Bad", value: 101 }))),
    /Progress requires/,
  );
  cleanup();
  const loader = render(
    wrap(h(UI.Loading, { label: "Delayed loading", delay: 30 })),
  );
  assert.equal(screen.queryByRole("status"), null);
  loader.rerender(
    wrap(h(UI.Loading, { label: "Delayed loading", delay: 30, active: false })),
  );
  await act(async () => {
    await new Promise((resolve) => setTimeout(resolve, 40));
  });
  assert.equal(screen.queryByRole("status"), null);
  assert.equal(
    loader.container.querySelector(".rm-loading").dataset.visible,
    "true",
  );
  assert.equal(
    loader.container.querySelector(".rm-loading").dataset.active,
    "false",
  );
  assert.equal(
    loader.container.querySelector(".rm-loading").hasAttribute("aria-busy"),
    false,
  );
  loader.rerender(
    wrap(
      h(UI.Loading, {
        label: "Delayed loading",
        delay: 30,
        active: false,
        idlePresentation: "hidden",
      }),
    ),
  );
  assert.equal(
    loader.container.querySelector(".rm-loading").dataset.visible,
    "false",
  );
  loader.rerender(
    wrap(h(UI.Loading, { label: "Delayed loading", delay: 30, active: true })),
  );
  await act(async () => {
    await new Promise((resolve) => setTimeout(resolve, 40));
  });
  assert.ok(screen.getByRole("status", { name: "Delayed loading" }));
  Object.defineProperty(document, "hidden", {
    configurable: true,
    value: true,
  });
  fireEvent(document, new Event("visibilitychange"));
  assert.equal(screen.getByRole("status").dataset.active, "false");
  Object.defineProperty(document, "hidden", {
    configurable: true,
    value: false,
  });
  fireEvent(document, new Event("visibilitychange"));
  assert.equal(screen.getByRole("status").dataset.active, "true");
});
