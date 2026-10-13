import { test, expect } from "@playwright/test";

// Chromium implements Playwright's forced-colors emulation. Other projects keep
// the shared interaction suite; this capability check does not emulate Windows.
test("forced colors preserves keyboard focus, selection and brand feedback geometry", async ({
  page,
}, testInfo) => {
  await page.emulateMedia({ forcedColors: "active", reducedMotion: "reduce" });
  await page.goto("/");
  expect(
    await page.evaluate(() => matchMedia("(forced-colors: active)").matches),
  ).toBe(true);
  const section = (id) => page.locator(`[data-component="${id}"]`);
  async function screenshot(name, locator) {
    const path = testInfo.outputPath(`${name}.png`);
    await locator.screenshot({ path });
    await testInfo.attach(name, { path, contentType: "image/png" });
  }
  const save = section("button").getByRole("button", { name: "保存记录" });
  await save.focus();
  await page.keyboard.press("Tab");
  await page.keyboard.press("Shift+Tab");
  await expect(save).toBeFocused();
  const outline = await save.evaluate((element) => {
    const style = getComputedStyle(element);
    return {
      visible: element.matches(":focus-visible"),
      width: parseFloat(style.outlineWidth),
      style: style.outlineStyle,
      color: style.outlineColor,
      background: style.backgroundColor,
    };
  });
  expect(outline.visible).toBe(true);
  expect(outline.width).toBeGreaterThan(0);
  expect(outline.style).not.toBe("none");
  expect(outline.color).not.toBe(outline.background);
  await screenshot("keyboard-focus", section("button"));

  const checkbox = section("checkbox").getByRole("checkbox");
  await expect(checkbox).toHaveAttribute("aria-checked", "mixed");
  const mixedColors = await section("checkbox")
    .locator(".rm-check-mixed")
    .evaluate((element) => ({
      mark: getComputedStyle(element).backgroundColor,
      surface: getComputedStyle(element.parentElement).backgroundColor,
    }));
  expect(mixedColors.mark).not.toBe(mixedColors.surface);
  await screenshot("mixed-selection", section("checkbox"));
  await checkbox.focus();
  await page.keyboard.press("Space");
  await expect(checkbox).toBeChecked();
  const checkColors = await section("checkbox")
    .locator(".rm-check-visual")
    .evaluate((element) => ({
      mark: getComputedStyle(element.querySelector("svg")).color,
      surface: getComputedStyle(element).backgroundColor,
      border: getComputedStyle(element).borderTopWidth,
    }));
  expect(checkColors.mark).not.toBe(checkColors.surface);
  expect(parseFloat(checkColors.border)).toBeGreaterThan(0);
  await screenshot("checked-selection", section("checkbox"));

  const loading = section("loading").locator(".rm-loading");
  await expect(loading).toHaveAttribute("data-visible", "true");
  const folds = await loading
    .locator(".rm-fold-back, .rm-fold-front")
    .evaluateAll((elements) =>
      elements.map((element) => {
        const rect = element.getBoundingClientRect(),
          style = getComputedStyle(element);
        return {
          width: rect.width,
          height: rect.height,
          color: style.backgroundColor,
          animation: style.animationName,
        };
      }),
    );
  expect(folds).toHaveLength(2);
  for (const fold of folds) {
    expect(fold.width).toBeGreaterThan(0);
    expect(fold.height).toBeGreaterThan(0);
    expect(fold.color).not.toBe("rgba(0, 0, 0, 0)");
    expect(fold.animation).toBe("none");
  }
  await screenshot("static-brand-loading", section("loading"));
  const progress = section("progress").getByRole("progressbar");
  await expect(progress).toHaveAttribute("aria-valuenow", "40");
  const progressColors = await progress.evaluate((element) => {
    const fill = element.querySelector("span"),
      trackStyle = getComputedStyle(element),
      fillStyle = getComputedStyle(fill),
      rect = fill.getBoundingClientRect();
    return {
      track: trackStyle.backgroundColor,
      fill: fillStyle.backgroundColor,
      width: rect.width,
      height: rect.height,
      sweep: getComputedStyle(fill, "::after").display,
    };
  });
  expect(progressColors.fill).not.toBe(progressColors.track);
  expect(progressColors.width).toBeGreaterThan(0);
  expect(progressColors.height).toBeGreaterThan(0);
  expect(progressColors.sweep).toBe("none");
  await screenshot("determinate-progress", section("progress"));
});
