import { test, expect } from "@playwright/test";
import { defaultThemes } from "@rosemary-ui/tokens";
const rgb = (hex) =>
  `rgb(${[1, 3, 5].map((i) => parseInt(hex.slice(i, i + 2), 16)).join(", ")})`;
const section = (page, id) => page.locator(`[data-component="${id}"]`);
test("real browser consumes all 33 examples with theme, controlled data and keyboard state changes", async ({
  page,
}) => {
  const errors = [];
  page.on("pageerror", (error) => errors.push(error.message));
  await page.goto("/");
  await expect(
    page.getByRole("heading", { name: /Components that belong/ }),
  ).toBeVisible();
  await section(page, "input").getByRole("textbox").fill("Updated");
  await expect(section(page, "input").getByRole("textbox")).toHaveValue(
    "Updated",
  );
  await section(page, "textarea").getByRole("textbox").fill("Notes");
  await expect(section(page, "textarea").getByRole("textbox")).toHaveValue(
    "Notes",
  );
  await section(page, "select").getByRole("combobox").click();
  await page.getByRole("listbox").press("ArrowDown");
  await page.getByRole("listbox").press("Enter");
  await expect(section(page, "select").getByRole("combobox")).toHaveText(
    "epass",
  );
  await section(page, "search").getByRole("searchbox").fill("forma");
  await section(page, "search").getByRole("searchbox").press("Enter");
  await expect(page.locator(".gallery-events")).toHaveText(
    "search submitted: forma",
  );
  await section(page, "checkbox").getByRole("checkbox").click();
  await expect(section(page, "checkbox").getByRole("checkbox")).toBeChecked();
  await section(page, "radio").getByRole("radio", { name: "邀请链接" }).check();
  await expect(
    section(page, "radio").getByRole("radio", { name: "邀请链接" }),
  ).toBeChecked();
  await section(page, "switch").getByRole("switch").click();
  await expect(section(page, "switch").getByRole("switch")).toHaveAttribute(
    "aria-checked",
    "true",
  );
  await section(page, "slider").getByRole("slider").focus();
  await section(page, "slider").getByRole("slider").press("ArrowRight");
  await expect(section(page, "slider").getByRole("slider")).toHaveValue("31");
  await section(page, "tabs").getByRole("tab", { name: "动态" }).click();
  await expect(section(page, "tabs").getByRole("tabpanel")).toHaveText(
    "最近的活动记录。",
  );
  await section(page, "pagination")
    .getByRole("button", { name: "下一页" })
    .click();
  await expect(
    section(page, "pagination").getByRole("button", { name: "第 2 页" }),
  ).toHaveAttribute("aria-current", "page");
  await section(page, "menu").getByRole("button", { name: "更多操作" }).click();
  await page.getByRole("menuitem", { name: "复制链接" }).press("Enter");
  await expect(page.getByRole("menu")).toHaveCount(0);
  await section(page, "tooltip").getByRole("button").focus();
  await expect(page.getByRole("tooltip")).toBeVisible();
  await section(page, "tooltip").getByRole("button").press("Escape");
  await expect(page.getByRole("tooltip")).toHaveCount(0);
  await section(page, "popover")
    .getByRole("button", { name: "记录详情" })
    .click();
  await expect(page.getByRole("region", { name: "记录详情" })).toBeVisible();
  await page.getByRole("region", { name: "记录详情" }).press("Escape");
  await expect(page.getByRole("region", { name: "记录详情" })).toHaveCount(0);
  await section(page, "upload")
    .locator("input[type=file]")
    .setInputFiles({
      name: "notes.txt",
      mimeType: "text/plain",
      buffer: Buffer.from("Rosemary"),
    });
  await expect(section(page, "upload").getByText("notes.txt")).toBeVisible();
  await section(page, "upload")
    .getByRole("button", { name: "移除 notes.txt" })
    .click();
  await expect(section(page, "upload").getByText("notes.txt")).toHaveCount(0);
  await section(page, "table").getByRole("button", { name: "名称" }).click();
  await expect(
    section(page, "table").getByRole("columnheader", { name: "名称" }),
  ).toHaveAttribute("aria-sort", "descending");
  await section(page, "progress")
    .getByRole("button", { name: "推进 20%" })
    .click();
  await expect(
    section(page, "progress").getByRole("progressbar"),
  ).toHaveAttribute("aria-valuenow", "60");
  await section(page, "stepper").getByRole("button", { name: "发布" }).click();
  await expect(
    section(page, "stepper").getByText("发布").locator("..").locator(".."),
  ).toHaveAttribute("aria-current", "step");
  await section(page, "button")
    .getByRole("button", { name: "保存记录" })
    .click();
  await expect(section(page, "toast").getByText("记录已保存")).toBeVisible();
  await section(page, "toast")
    .getByRole("button", { name: "关闭提示" })
    .click();
  await expect(section(page, "toast").getByText("记录已保存")).toHaveCount(0);
  await section(page, "alert")
    .getByRole("button", { name: "关闭提示" })
    .click();
  await expect(section(page, "alert").getByText("需要补充信息")).toHaveCount(0);
  for (const id of [
    "link",
    "iconButton",
    "breadcrumb",
    "card",
    "list",
    "badge",
    "avatar",
    "empty",
    "skeleton",
    "loading",
  ])
    await expect(section(page, id)).toBeVisible();
  await section(page, "link").getByRole("link").click();
  await expect(page).toHaveURL(/#example-table/);
  await section(page, "iconButton")
    .getByRole("button", { name: "收藏" })
    .click();
  await expect(section(page, "toast").getByText("记录已保存")).toBeVisible();
  await section(page, "card").getByRole("button", { name: "查看计划" }).click();
  await expect(section(page, "card").getByRole("article")).toBeVisible();
  await page.getByRole("radio", { name: "深色", exact: true }).check();
  await expect(page.locator(".rm-theme").first()).toHaveAttribute(
    "data-rm-theme",
    "dark",
  );
  await expect(page.locator(".rm-theme").first()).toHaveCSS(
    "background-color",
    rgb(defaultThemes.dark.canvas),
  );
  await page.getByRole("checkbox", { name: "RTL", exact: true }).check();
  await section(page, "tabs").getByRole("tab", { name: "动态" }).focus();
  await section(page, "tabs")
    .getByRole("tab", { name: "动态" })
    .press("ArrowLeft");
  await expect(
    section(page, "tabs").getByRole("tab", { name: "概览" }),
  ).toHaveAttribute("aria-selected", "true");
  await page.getByRole("checkbox", { name: "拒绝状态更新（验收）" }).check();
  await section(page, "input").getByRole("textbox").fill("Rejected");
  await expect(section(page, "input").getByRole("textbox")).toHaveValue(
    "Updated",
  );
  await section(page, "switch").getByRole("switch").click();
  await expect(section(page, "switch").getByRole("switch")).toHaveAttribute(
    "aria-checked",
    "true",
  );
  expect(errors).toEqual([]);
});
test("custom calendar year boundaries, cancellation, native modal focus trap and restoration", async ({
  page,
}) => {
  await page.goto("/");
  const dateTrigger = section(page, "date").getByRole("button", {
    name: /日期 0001/,
  });
  await dateTrigger.click();
  const dialog = page.getByRole("dialog", { name: "日期", exact: true });
  await expect(dialog).toBeVisible();
  await dialog.getByRole("button", { name: "年份", exact: true }).click();
  await dialog.getByRole("textbox", { name: "年份", exact: true }).fill("9999");
  await dialog.getByRole("button", { name: "月份", exact: true }).click();
  await dialog.getByRole("button", { name: "12 月", exact: true }).click();
  await dialog.getByRole("gridcell", { name: "9999-12-31" }).click();
  await dialog.getByRole("button", { name: "取消", exact: true }).click();
  await expect(section(page, "date").getByRole("textbox")).toHaveValue(
    "0001-01-01",
  );
  await dateTrigger.click();
  await dialog.getByRole("gridcell", { name: "0001-01-01" }).focus();
  await dialog
    .getByRole("gridcell", { name: "0001-01-01" })
    .press("ArrowRight");
  await expect(
    dialog.getByRole("gridcell", { name: "0001-01-02" }),
  ).toBeFocused();
  await dialog.getByRole("gridcell", { name: "0001-01-02" }).press("Enter");
  await dialog.getByRole("button", { name: "确认", exact: true }).click();
  await expect(section(page, "date").getByRole("textbox")).toHaveValue(
    "0001-01-02",
  );
  const trigger = section(page, "dialog").getByRole("button", {
    name: "打开对话框",
  });
  await trigger.click();
  const modal = page.getByRole("dialog", { name: "确认归档" });
  await expect(modal).toBeVisible();
  for (let i = 0; i < 8; i++) {
    await page.keyboard.press("Tab");
    expect(
      await page.evaluate(
        () => !!document.activeElement.closest("dialog[open]"),
      ),
    ).toBe(true);
  }
  await page.keyboard.press("Escape");
  await expect(modal).not.toBeVisible();
  await expect(trigger).toBeFocused();
});
test("drawer actual 220/180ms completion and interruption, modal=false, narrow reduced motion and measured progress", async ({
  page,
}) => {
  await page.goto("/");
  await page.setViewportSize({ width: 390, height: 844 });
  await section(page, "drawer")
    .getByRole("button", { name: "打开抽屉" })
    .click();
  const drawer = page.getByRole("dialog", { name: "记录设置" });
  await expect(drawer).toBeVisible();
  await expect(page.locator(".gallery-events")).toHaveText(
    "drawer animation completed: true",
  );
  await drawer.getByRole("button", { name: "关闭抽屉", exact: true }).click();
  await expect(drawer).not.toBeVisible();
  await expect(page.locator(".gallery-events")).toHaveText(
    "drawer animation completed: false",
  );
  await section(page, "drawer")
    .getByRole("checkbox", { name: "模态抽屉" })
    .uncheck();
  await section(page, "drawer")
    .getByRole("button", { name: "打开抽屉" })
    .click();
  await expect(drawer).toBeVisible();
  await section(page, "drawer")
    .getByRole("button", { name: "打开抽屉" })
    .click({ force: true });
  await drawer.getByRole("button", { name: "关闭抽屉", exact: true }).click();
  await section(page, "drawer")
    .getByRole("button", { name: "打开抽屉" })
    .click({ force: true });
  await expect(drawer).toBeVisible();
  await expect(page.locator(".gallery-events")).toHaveText(
    "drawer animation completed: true",
  );
  await drawer.getByRole("button", { name: "关闭抽屉", exact: true }).click();
  await expect(drawer).not.toBeVisible();
  await page.emulateMedia({ colorScheme: "dark", reducedMotion: "reduce" });
  await expect(page.locator(".rm-theme").first()).toHaveAttribute(
    "data-rm-reduced-motion",
    "true",
  );
  await expect(section(page, "loading").locator(".rm-fold-front")).toHaveCSS(
    "animation-name",
    "none",
  );
  expect(
    await section(page, "loading")
      .locator(".rm-fold-front")
      .evaluate(
        (element) =>
          new DOMMatrixReadOnly(getComputedStyle(element).transform).isIdentity,
      ),
  ).toBe(true);
  await section(page, "loading")
    .getByRole("button", { name: "切换加载状态" })
    .click();
  const stopped = section(page, "loading").locator(".rm-loading");
  await expect(stopped).toHaveAttribute("data-visible", "true");
  await expect(stopped).toHaveAttribute("data-active", "false");
  await expect(stopped).not.toHaveAttribute("aria-busy", "true");
  await expect(stopped).not.toHaveAttribute("role", "status");
  await expect(stopped.locator(".rm-fold-front")).toHaveCSS(
    "animation-name",
    "none",
  );
  const bounds = await section(page, "progress")
    .getByRole("progressbar")
    .boundingBox();
  const fill = await section(page, "progress")
    .locator(".rm-progress>span")
    .boundingBox();
  expect(Math.abs(fill.width / bounds.width - 0.4)).toBeLessThan(0.01);
  expect(
    await page.evaluate(
      () => document.documentElement.scrollWidth <= window.innerWidth,
    ),
  ).toBe(true);
});
test("nonmodal text and time/range variants, roving columns, outside/Tab dismissal and 200 percent type", async ({
  page,
}) => {
  await page.goto("/");
  const date = section(page, "date");
  await date
    .getByRole("textbox", { name: "日期", exact: true })
    .fill("9999-12-31");
  await expect(
    date.getByRole("textbox", { name: "日期", exact: true }),
  ).toHaveValue("9999-12-31");
  await date
    .getByRole("textbox", { name: "日期", exact: true })
    .press("ArrowDown");
  const panel = page.getByRole("dialog", { name: "日期", exact: true });
  await expect(panel).toHaveAttribute("aria-modal", "false");
  await panel.getByRole("button", { name: "上个月" }).click();
  await expect(panel.getByRole("grid").locator('[tabindex="0"]')).toHaveCount(
    1,
  );
  await panel.getByRole("button", { name: "确认", exact: true }).focus();
  await page.keyboard.press("Tab");
  await expect(panel).toHaveCount(0);
  await date.getByRole("button", { name: /日期 9999/ }).click();
  await page.getByRole("heading", { name: /Components that belong/ }).click();
  await expect(panel).toHaveCount(0);
  const variants = page.getByRole("region", { name: "日期变体" });
  await variants.getByRole("button", { name: "本地时间 09:30" }).click();
  const timePanel = page.getByRole("dialog", { name: "本地时间" });
  const hours = timePanel.getByRole("listbox", { name: "小时" }),
    minutes = timePanel.getByRole("listbox", { name: "分钟" });
  await expect(hours.locator('[tabindex="0"]')).toHaveCount(1);
  await hours.locator('[tabindex="0"]').press("End");
  await hours.locator('[tabindex="0"]').press("ArrowRight");
  await expect(minutes.locator('[tabindex="0"]')).toBeFocused();
  await minutes.locator('[tabindex="0"]').press("End");
  await timePanel.getByRole("button", { name: "确认", exact: true }).click();
  await expect(
    variants.getByRole("textbox", { name: "本地时间", exact: true }),
  ).toHaveValue("23:59");
  await variants
    .getByRole("textbox", { name: "结束日期", exact: true })
    .fill("0001-01-01");
  await expect(
    variants.getByRole("textbox", { name: "结束日期", exact: true }),
  ).toHaveValue("0001-01-01");
  await variants
    .getByRole("textbox", { name: "开始日期", exact: true })
    .fill("0001-01-02");
  await expect(variants.getByRole("alert")).toContainText(
    "结束日期不能早于开始日期",
  );
  await expect(
    variants.getByRole("textbox", { name: "开始日期", exact: true }),
  ).toHaveValue("0001-01-01");
  await page.setViewportSize({ width: 780, height: 1000 });
  await page.evaluate(() => (document.documentElement.style.fontSize = "32px"));
  await expect(section(page, "input").getByRole("textbox")).toHaveCSS(
    "font-size",
    "32px",
  );
  expect(
    await page.evaluate(
      () => document.documentElement.scrollWidth <= window.innerWidth,
    ),
  ).toBe(true);
});
test("live tab geometry, long-list visibility, viewport edges and nested RTL to LTR remain independent", async ({
  page,
}) => {
  await page.setViewportSize({ width: 390, height: 640 });
  await page.goto("/?geometry");
  const tabs = page.getByRole("tablist", { name: "Mutable tabs" }),
    selected = tabs.getByRole("tab", { name: "Third" });
  await tabs.evaluate((el) => {
    window.originalTabs = el;
    el.querySelector("button").style.paddingInline = "70px";
  });
  await expect
    .poll(() =>
      tabs.evaluate((el) => {
        const active = el.querySelector('[aria-selected="true"]'),
          indicator = el.querySelector(".rm-tab-indicator");
        return Math.abs(
          new DOMMatrix(getComputedStyle(indicator).transform).m41 -
            active.offsetLeft,
        );
      }),
    )
    .toBeLessThan(1);
  await tabs.evaluate((el) => {
    el.querySelector("button").style.paddingInline = "2px";
  });
  await expect
    .poll(() =>
      tabs.evaluate((el) => {
        const active = el.querySelector('[aria-selected="true"]'),
          indicator = el.querySelector(".rm-tab-indicator");
        return Math.abs(
          new DOMMatrix(getComputedStyle(indicator).transform).m41 -
            active.offsetLeft,
        );
      }),
    )
    .toBeLessThan(1);
  await selected.evaluate((el) => (el.style.paddingInline = "40px"));
  await expect
    .poll(() =>
      tabs.evaluate((el) => {
        const active = el.querySelector('[aria-selected="true"]'),
          indicator = el.querySelector(".rm-tab-indicator");
        return Math.abs(
          indicator.getBoundingClientRect().width - active.offsetWidth,
        );
      }),
    )
    .toBeLessThan(1);
  await page.setViewportSize({ width: 780, height: 640 });
  expect(await tabs.evaluate((el) => el === window.originalTabs)).toBe(true);
  await expect(
    page
      .getByRole("progressbar", { name: "Inner LTR progress" })
      .locator("span"),
  ).toHaveCSS("transform-origin", /^0px /);
  await expect
    .poll(() =>
      page
        .getByRole("progressbar", { name: "Outer RTL progress" })
        .locator("span")
        .evaluate((el) => parseFloat(getComputedStyle(el).transformOrigin)),
    )
    .toBeGreaterThan(0);
  const innerPrev = page
    .getByRole("navigation", { name: "Inner LTR pages" })
    .getByRole("button", { name: "Previous page" })
    .locator("svg");
  const outerNext = page
    .getByRole("navigation", { name: "Outer RTL pages" })
    .getByRole("button", { name: "Next page" })
    .locator("svg");
  expect(await innerPrev.innerHTML()).toEqual(await outerNext.innerHTML());
  await expect(page.getByRole("search").getByRole("button")).toBeDisabled();
  await page
    .getByRole("search")
    .evaluate((el) =>
      el.dispatchEvent(
        new Event("submit", { bubbles: true, cancelable: true }),
      ),
    );
  await expect(page.getByLabel("Search count")).toHaveText("0");
  await page.getByRole("combobox", { name: "Long list" }).click();
  const list = page.getByRole("listbox");
  await list.press("End");
  await expect
    .poll(() =>
      list.evaluate((el) => {
        const active = document.getElementById(
          el.getAttribute("aria-activedescendant"),
        );
        return (
          active.getBoundingClientRect().bottom <=
          el.getBoundingClientRect().bottom + 1
        );
      }),
    )
    .toBe(true);
  const bounds = await list.boundingBox();
  const headBounds = await page
    .getByRole("combobox", { name: "Long list" })
    .boundingBox();
  expect(Math.abs(bounds.width - headBounds.width)).toBeLessThan(1);
  expect(bounds.x).toBeGreaterThanOrEqual(8);
  expect(bounds.x + bounds.width).toBeLessThanOrEqual(773);
  expect(bounds.y).toBeGreaterThanOrEqual(8);
  expect(bounds.y + bounds.height).toBeLessThanOrEqual(633);
  await list.press("Home");
  const beforeWheel = await page.evaluate(() => scrollY);
  await list.hover();
  await page.mouse.wheel(0, 180);
  await expect
    .poll(() => list.evaluate((el) => el.scrollTop))
    .toBeGreaterThan(40);
  expect(await page.evaluate(() => scrollY)).toBe(beforeWheel);
  await list.press("End");
  await list.press("Enter");
  await expect(page.getByRole("combobox")).toHaveText("Option 59");
  await page.getByRole("button", { name: "Edge menu" }).click();
  const menu = page.getByRole("menu");
  const mb = await menu.boundingBox();
  expect(mb.x + mb.width).toBeLessThanOrEqual(773);
  expect(mb.y + mb.height).toBeLessThanOrEqual(633);
  await menu
    .getByRole("menuitem", { name: "Action 0", exact: true })
    .press("End");
  await expect(menu.getByRole("menuitem", { name: "Action 19" })).toBeFocused();
});
test("per-file upload states, controlled progress and retry/cancel, exceptional step states", async ({
  page,
}) => {
  await page.goto("/?geometry");
  const transfer = page.getByRole("region", { name: "Transfer" });
  await expect(transfer).toHaveAttribute("data-state", "partial");
  await expect(transfer.getByRole("alert")).toContainText("Connection lost");
  await transfer.getByRole("button", { name: "Retry retry.txt" }).click();
  await expect(transfer.getByRole("progressbar")).toHaveAttribute(
    "aria-valuenow",
    "45",
  );
  await transfer.getByRole("button", { name: "Cancel retry.txt" }).click();
  await expect(transfer.getByText("Cancelled", { exact: true })).toBeVisible();
  await expect(transfer.getByRole("progressbar")).toHaveCount(0);
  await expect(
    transfer.getByText("Upload complete", { exact: true }),
  ).toBeVisible();
  const steps = page.getByRole("navigation", { name: "Exceptional steps" });
  await expect(steps.getByText("Step failed", { exact: true })).toBeVisible();
  await expect(
    steps.getByRole("button", { name: "Locked step" }),
  ).toBeDisabled();
  await expect(steps.getByText("Unavailable", { exact: true })).toBeVisible();
});

test("field states and long disclosure labels preserve semantic colors and full icon sizes", async ({
  page,
}, testInfo) => {
  for (const theme of ["light", "dark"]) {
    for (const width of [1280, 375]) {
      await page.setViewportSize({ width, height: 1100 });
      await page.goto(`/?fields&theme=${theme}`);
      const colors = await page.locator(".rm-theme").evaluate((root) => {
        const resolved = (name) => {
          const probe = document.createElement("span");
          probe.style.color = `var(--rm-${name})`;
          root.append(probe);
          const color = getComputedStyle(probe).color;
          probe.remove();
          return color;
        };
        return Object.fromEntries(
          ["surface-inset", "muted", "danger-soft"].map((name) => [
            name,
            resolved(name),
          ]),
        );
      });
      await expect(page.getByLabel("Read only", { exact: true })).toHaveCSS(
        "background-color",
        colors["surface-inset"],
      );
      for (const name of ["Unavailable", "Unavailable notes"]) {
        const field = page.getByLabel(name, { exact: true });
        await expect(field).toBeDisabled();
        await expect(field).toHaveCSS(
          "background-color",
          colors["surface-inset"],
        );
        await expect(field).toHaveCSS("color", colors.muted);
        await expect(field).toHaveCSS("opacity", "0.65");
      }
      await expect(page.getByLabel("Invalid", { exact: true })).toHaveCSS(
        "background-color",
        colors["danger-soft"],
      );
      const select = page.getByRole("combobox", { name: "Long choice" });
      const menu = page.getByRole("button", {
        name: "More actions for this deliberately long record name",
      });
      for (const [trigger, size] of [
        [select, 18],
        [menu, 16],
      ]) {
        const geometry = await trigger.evaluate((button) => {
          const icon = button.querySelector("svg").getBoundingClientRect();
          const label = button
            .querySelector(".rm-disclosure-label")
            .getBoundingClientRect();
          const box = button.getBoundingClientRect();
          return {
            iconWidth: icon.width,
            iconHeight: icon.height,
            inside:
              icon.left >= box.left &&
              icon.right <= box.right &&
              label.right <= icon.left,
          };
        });
        expect(geometry.iconWidth).toBe(size);
        expect(geometry.iconHeight).toBe(size);
        expect(geometry.inside).toBe(true);
      }
      await page.screenshot({
        path: testInfo.outputPath(`fields-${theme}-${width}.png`),
        fullPage: true,
      });
      await select.click();
      await page.getByRole("listbox").press("ArrowDown");
      await page.getByRole("listbox").press("Enter");
      await expect(select).toHaveText("Ready");
      await menu.click();
      await expect(menu).toHaveAttribute("aria-expanded", "true");
      await page.getByRole("menu").press("Escape");
      await expect(menu).toHaveAttribute("aria-expanded", "false");
      await expect(page.locator("body")).toHaveJSProperty("scrollWidth", width);
    }
  }
});

test("semantic floating surfaces retain readable paired content in both appearances", async ({
  page,
}) => {
  await page.goto("/");
  for (const [label, mode] of [
    ["浅色", "light"],
    ["深色", "dark"],
  ]) {
    await page.getByRole("radio", { name: label, exact: true }).check();
    const colors = defaultThemes[mode];
    await section(page, "tooltip").getByRole("button").focus();
    const tip = section(page, "tooltip").getByRole("tooltip");
    await expect(tip).toBeVisible();
    await expect(tip).toHaveCSS(
      "background-color",
      rgb(colors.surfaceFloating),
    );
    await expect(tip).toHaveCSS("color", rgb(colors.ink));
    await section(page, "tooltip").getByRole("button").press("Escape");
    await section(page, "select").getByRole("combobox").click();
    await expect(section(page, "select").getByRole("listbox")).toHaveCSS(
      "background-color",
      rgb(colors.fieldHover),
    );
    await expect(section(page, "select").getByRole("combobox")).toHaveCSS(
      "background-color",
      rgb(colors.fieldHover),
    );
    await section(page, "select").getByRole("listbox").press("Escape");
    await expect(section(page, "card").getByRole("article")).toHaveCSS(
      "background-color",
      rgb(colors.surfaceGroup),
    );
    await section(page, "input").getByRole("textbox").focus();
    await expect(section(page, "input").getByRole("textbox")).toHaveCSS(
      "outline-style",
      "none",
    );
    await expect(section(page, "input").getByRole("textbox")).toHaveCSS(
      "background-color",
      rgb(colors.fieldFill),
    );
  }
});

test("button paint correction preserves geometry and follows appearance changes", async ({
  page,
}) => {
  await page.goto("/");
  const buttons = section(page, "button").locator(".rm-button");
  const primary = buttons.first();
  const geometry = () =>
    buttons.evaluateAll((es) =>
      es.map((e) => {
        const r = e.getBoundingClientRect();
        return {
          width: e.offsetWidth,
          height: e.offsetHeight,
          padding: getComputedStyle(e).padding,
          lineHeight: getComputedStyle(e).lineHeight,
        };
      }),
    );
  const light = await geometry();
  await expect(primary).toHaveCSS("background-clip", "border-box");
  await page.getByRole("radio", { name: "深色", exact: true }).check();
  await expect(primary).toHaveCSS("background-clip", "padding-box");
  await expect(buttons.nth(1)).toHaveCSS("background-clip", "border-box");
  expect(await geometry()).toEqual(light);
  await primary.focus();
  await expect(primary).toBeFocused();
  await primary.press("Enter");
  await expect(page.locator(".gallery-events")).toHaveText("button: true");
  await page.getByRole("radio", { name: "浅色", exact: true }).check();
  await expect(primary).toHaveCSS("background-clip", "border-box");
  expect(await geometry()).toEqual(light);
});

test("field requirements stay adjacent, arm on blur and reset without truncating passwords", async ({
  page,
}) => {
  await page.goto("/");
  const input = page.getByLabel("创建密码", { exact: true });
  const field = page.locator(".rm-field").filter({ has: input });
  const rules = field.locator(".rm-requirements");
  await expect(rules.locator("li")).toHaveCount(3);
  await expect(rules.locator('[data-result="invalid"]')).toHaveCount(0);
  await input.fill("abc");
  await expect(rules.locator('[data-result="invalid"]')).toHaveCount(0);
  await input.press("Tab");
  await expect(input).toHaveAttribute("aria-invalid", "true");
  await expect(rules.locator('[data-result="invalid"]')).toHaveCount(2);
  await expect(field.locator(".rm-field-outline path").first()).toHaveCSS(
    "stroke-width",
    "1.5px",
  );
  await input.fill("abcdefg!");
  await expect(rules.locator('[data-result="valid"]')).toHaveCount(3);
  await expect(input).not.toHaveAttribute("aria-invalid", "true");
  const raw = "A".repeat(32) + "1";
  await input.fill(raw);
  await expect(input).toHaveValue(raw);
  await expect(rules.locator('[data-result="invalid"]')).toHaveCount(1);
  await input.fill("");
  await expect(
    rules.locator('[data-result="invalid"],[data-result="valid"]'),
  ).toHaveCount(0);
  await expect(input).not.toHaveAttribute("aria-invalid", "true");
});

test("portal and SDK use the same default visual metrics and disclosure easing", async ({
  page,
}, testInfo) => {
  await page.setViewportSize({ width: 1280, height: 900 });
  await page.goto("/portal.html#/components?component=button");
  const metrics = (el) => {
    const s = getComputedStyle(el);
    return {
      height: el.offsetHeight,
      font: s.fontSize,
      line: Math.round(parseFloat(s.lineHeight) * 1000) / 1000,
      padding: s.padding,
      radius: s.borderRadius,
    };
  };
  const portal = await page
    .getByRole("button", { name: "保存更改", exact: true })
    .evaluate(metrics);
  await page.screenshot({
    path: testInfo.outputPath("portal-buttons.png"),
    fullPage: true,
  });
  await page.goto("/");
  const sdk = await section(page, "button")
    .getByRole("button", { name: "保存记录", exact: true })
    .evaluate(metrics);
  expect(sdk).toEqual(portal);
  await expect(page.locator(".rm-range-thumb")).toHaveCSS("width", "16px");
  await section(page, "select").getByRole("combobox").click();
  const list = page.getByRole("listbox");
  const details = await list.evaluate((el) => ({
    topLayer:
      typeof el.showPopover !== "function" || el.matches(":popover-open"),
    easing:
      el.getAnimations()[0]?.effect?.getTiming().easing ??
      getComputedStyle(el.parentElement).getPropertyValue(
        "--rm-disclosure-ease",
      ),
  }));
  expect(details.topLayer).toBe(true);
  if (
    await page.evaluate(() =>
      CSS.supports("animation-timing-function", "linear(0,1)"),
    )
  )
    expect(details.easing).toMatch(/^linear\(/);
  await list.press("Escape");
  await page.screenshot({
    path: testInfo.outputPath("sdk-buttons.png"),
    fullPage: true,
  });
});

test("field focus draws intermediate perimeter frames, blurs cleanly and respects reduced motion", async ({
  page,
}, testInfo) => {
  await page.goto("/");
  const input = section(page, "search").getByRole("searchbox");
  await input.scrollIntoViewIfNeeded();
  // Arm before the input event: a final solid outline alone cannot pass this test.
  await input.evaluate((el) => {
    window.__fieldTrace = new Promise((resolve) =>
      el.addEventListener(
        "focus",
        () => {
          const path = el.closest(".rm-field-frame").querySelector("path");
          const frames = [],
            start = performance.now();
          const sample = () => {
            frames.push({
              ms: performance.now() - start,
              dash: parseFloat(getComputedStyle(path).strokeDasharray),
            });
            if (performance.now() - start < 320) requestAnimationFrame(sample);
            else resolve(frames);
          };
          requestAnimationFrame(sample);
        },
        { once: true },
      ),
    );
  });
  await input.click();
  const frames = await page.evaluate(() => window.__fieldTrace);
  expect(frames.some((f) => f.dash > 0.005 && f.dash < 0.49)).toBe(true);
  expect(frames.at(-1).dash).toBeCloseTo(0.501, 3);
  await testInfo.attach("field-outline-frames.json", {
    body: JSON.stringify(frames),
    contentType: "application/json",
  });
  await input.press("Tab");
  await expect(section(page, "search").locator(".rm-field-outline")).toHaveCSS(
    "opacity",
    "0",
  );
  await page.getByRole("checkbox", { name: "减少动态", exact: true }).check();
  await input.click();
  const reduced = await input.evaluate((el) => {
    const path = el.closest(".rm-field-frame").querySelector("path");
    return {
      dash: parseFloat(getComputedStyle(path).strokeDasharray),
      running: path.getAnimations().length,
    };
  });
  expect(reduced.dash).toBeCloseTo(0.501, 3);
  expect(reduced.running).toBe(0);
});

test("checkbox and radio markers shrink, overshoot and settle without moving their labels", async ({
  page,
}, testInfo) => {
  await page.goto("/");
  for (const id of ["checkbox", "radio"]) {
    const control = section(page, id).locator("input").last();
    const label = control.locator("..");
    const marker = label.locator(
      id === "checkbox" ? ".rm-check-visual" : ".rm-radio-visual",
    );
    await label.scrollIntoViewIfNeeded();
    const box = await label.boundingBox();
    const textBox = await label.locator("span").last().boundingBox();
    await page.mouse.move(box.x + box.width / 2, box.y + box.height / 2);
    await page.mouse.down();
    await expect
      .poll(async () =>
        marker.evaluate((el) => parseFloat(getComputedStyle(el).scale) || 1),
      )
      .toBeLessThan(0.95);
    expect(await label.locator("span").last().boundingBox()).toEqual(textBox);
    await marker.evaluate((el) => {
      window.__selectionTrace = new Promise((resolve) => {
        const values = [],
          start = performance.now();
        const sample = () => {
          values.push(parseFloat(getComputedStyle(el).scale) || 1);
          if (performance.now() - start < 600) requestAnimationFrame(sample);
          else resolve(values);
        };
        requestAnimationFrame(sample);
      });
    });
    await page.mouse.up();
    const values = await page.evaluate(() => window.__selectionTrace);
    expect(Math.max(...values)).toBeGreaterThan(1.003);
    expect(values.at(-1)).toBeCloseTo(1, 3);
    await testInfo.attach(`${id}-spring-frames.json`, {
      body: JSON.stringify(values),
      contentType: "application/json",
    });
  }
  await page.getByRole("checkbox", { name: "减少动态", exact: true }).check();
  const label = section(page, "checkbox").locator("label");
  await label.scrollIntoViewIfNeeded();
  const box = await label.boundingBox();
  await page.mouse.move(box.x + 10, box.y + box.height / 2);
  await page.mouse.down();
  expect(
    await label
      .locator(".rm-check-visual")
      .evaluate((el) => parseFloat(getComputedStyle(el).scale) || 1),
  ).toBe(1);
  await page.mouse.up();
});
