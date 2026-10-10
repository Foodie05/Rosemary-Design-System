import { chooseSelect } from "./select-helpers";
import { describe, it, expect, vi, afterEach, beforeEach } from "vitest";
import { render, screen, fireEvent, act } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { readFileSync } from "node:fs";
import postcss from "postcss";
import { TokenBrowser } from "../src/components/tokens/TokenBrowser";
import { CommandSearch } from "../src/components/search/CommandSearch";
import { PopoverExample, ContextExample } from "../src/components/ui/overlays";
import { Tooltip, Button } from "../src/components/ui/core";
import { DataGridExample } from "../src/components/ui/data";
import { DialogExample, ProgressExample } from "../src/components/ui/feedback";
import { CodeBlock } from "../src/components/common/CodeBlock";
import { SitePreferences } from "../src/context/SitePreferences";
import App from "../src/App";
beforeEach(() => {
  sessionStorage.clear();
  localStorage.clear();
  vi.stubGlobal("matchMedia", () => ({ matches: false }));
  window.scrollTo = vi.fn();
});
afterEach(() => vi.useRealTimers());
describe("The website applies its own documented principles", () => {
  for (const query of ["component.button.background", "primitive.space.16"])
    it(`a deep token link exposes its target: ${query}`, () => {
      render(<TokenBrowser initialQuery={query} />);
      expect(screen.getByText(query)).toBeDefined();
      expect(screen.queryByText("0 个令牌")).toBeNull();
    });
  it("token values follow the website's selected dark mode", () => {
    render(
      <SitePreferences.Provider value={{ mode: "dark", isMac: false }}>
        <TokenBrowser initialQuery="semantic.color.accent" />
      </SitePreferences.Provider>,
    );
    expect(screen.getAllByText("#b8cbb5").length).toBeGreaterThan(0);
  });
  it("search announces arrow selection through active descendant and selected option", async () => {
    render(<CommandSearch isOpen onClose={() => {}} />);
    const input = screen.getByRole("combobox");
    fireEvent.keyDown(input, { key: "ArrowDown" });
    const option = screen.getAllByRole("option")[1];
    expect(input.getAttribute("aria-activedescendant")).toBe(option.id);
    expect(option.getAttribute("aria-selected")).toBe("true");
    fireEvent.change(input, { target: { value: "no-such-result-xyz" } });
    fireEvent.keyDown(input, { key: "ArrowDown" });
    expect(input.hasAttribute("aria-activedescendant")).toBe(false);
    expect(screen.getByRole("status").textContent).toContain("没有匹配结果");
  });
  it("system theme updates are observed, and explicit preference wins", async () => {
    const media = {
      matches: false,
      addEventListener: vi.fn(),
      removeEventListener: vi.fn(),
    };
    vi.stubGlobal("matchMedia", (query: string) =>
      query.includes("color-scheme")
        ? media
        : {
            matches: false,
            addEventListener: vi.fn(),
            removeEventListener: vi.fn(),
          },
    );
    location.hash = "#/overview";
    render(<App />);
    const change = media.addEventListener.mock.calls[0][1];
    act(() => {
      media.matches = true;
      change();
    });
    expect(document.documentElement.dataset.theme).toBe("dark");
    chooseSelect(screen.getByRole("combobox", { name: "网站主题" }), "浅色");
    act(() => {
      media.matches = true;
      change();
    });
    expect(document.documentElement.dataset.theme).toBe("light");
  });
  it("tooltip waits, then can be dismissed while focus remains", () => {
    vi.useFakeTimers();
    render(
      <Tooltip text="说明">
        <Button>操作</Button>
      </Tooltip>,
    );
    fireEvent.keyDown(document, { key: "Tab" });
    fireEvent.focus(screen.getByRole("button"));
    act(() => vi.advanceTimersByTime(299));
    expect(screen.queryByRole("tooltip")).toBeNull();
    act(() => vi.advanceTimersByTime(1));
    expect(screen.getByRole("tooltip").textContent).toBe("说明");
    fireEvent.keyDown(document, { key: "Escape" });
    expect(screen.queryByRole("tooltip")).toBeNull();
  });
  for (const [Component, label, action] of [
    [PopoverExample, "筛选文件", "应用并关闭"],
    [ContextExample, "文件操作（也可右键）", "关闭菜单"],
  ] as const)
    it(`${label}: closing the popup restores focus`, async () => {
      render(<Component />);
      const trigger = screen.getByRole("button", { name: label });
      await userEvent.click(trigger);
      await userEvent.click(screen.getByRole("button", { name: action }));
      expect(document.activeElement).toBe(trigger);
    });
  it("popover changes apply only on confirmation and Escape discards the draft", async () => {
    render(<PopoverExample />);
    const trigger = screen.getByRole("button", { name: "筛选文件" });
    await userEvent.click(trigger);
    await userEvent.click(screen.getByRole("checkbox", { name: "仅看已收藏" }));
    fireEvent.keyDown(document, { key: "Escape" });
    expect(screen.getByRole("status").textContent).toBe("显示全部文件");
    await userEvent.click(trigger);
    expect((screen.getByRole("checkbox") as HTMLInputElement).checked).toBe(
      false,
    );
    await userEvent.click(screen.getByRole("checkbox"));
    await userEvent.click(screen.getByRole("button", { name: "应用并关闭" }));
    expect(screen.getByRole("status").textContent).toBe("筛选：仅看已收藏");
  });
  it("outside pointer dismissal does not steal focus", async () => {
    render(
      <>
        <PopoverExample />
        <button>外部操作</button>
      </>,
    );
    await userEvent.click(screen.getByRole("button", { name: "筛选文件" }));
    await userEvent.click(screen.getByRole("button", { name: "外部操作" }));
    expect(screen.queryByRole("button", { name: "应用并关闭" })).toBeNull();
    expect(document.activeElement).toBe(
      screen.getByRole("button", { name: "外部操作" }),
    );
  });
  it("the data table has a separate action region and reversible empty state", async () => {
    render(<DataGridExample />);
    expect(
      screen
        .getByRole("group", { name: "批量文件操作" })
        .closest(".r-table-scroll"),
    ).toBeNull();
    for (const checkbox of screen.getAllByRole("checkbox"))
      await userEvent.click(checkbox);
    await userEvent.click(screen.getByRole("button", { name: "归档所选" }));
    expect(screen.getByText(/所有文件已归档/)).toBeDefined();
    await userEvent.click(screen.getByRole("button", { name: "恢复全部" }));
    expect(screen.getAllByRole("checkbox")).toHaveLength(3);
  });
  it("dialog cancellation discards changes instead of silently retaining them", async () => {
    render(<DialogExample />);
    await userEvent.click(screen.getByRole("button", { name: "打开对话框" }));
    await userEvent.clear(screen.getByRole("textbox", { name: "项目名称" }));
    await userEvent.type(
      screen.getByRole("textbox", { name: "项目名称" }),
      "临时名称",
    );
    await userEvent.click(screen.getByRole("button", { name: "取消" }));
    await userEvent.click(screen.getByRole("button", { name: "打开对话框" }));
    expect(
      (screen.getByRole("textbox", { name: "项目名称" }) as HTMLInputElement)
        .value,
    ).toBe("设计规范");
  });
  it("paused progress reports its true state and has a working resume/reset", () => {
    vi.useFakeTimers();
    render(<ProgressExample />);
    fireEvent.click(screen.getByRole("button", { name: "开始导出" }));
    act(() => vi.advanceTimersByTime(200));
    fireEvent.click(screen.getByRole("button", { name: "暂停" }));
    expect(screen.getByText("已暂停，可继续导出")).toBeDefined();
    expect(screen.getByRole("progressbar").getAttribute("value")).toBe("10");
    fireEvent.click(screen.getByRole("button", { name: "继续导出" }));
    fireEvent.click(screen.getByRole("button", { name: "取消并重置" }));
    expect(screen.getByRole("progressbar").getAttribute("value")).toBe("0");
  });
  it("copy failure leaves selectable content and clear recovery feedback", async () => {
    Object.defineProperty(navigator, "clipboard", {
      value: { writeText: vi.fn().mockRejectedValue(new Error("denied")) },
      configurable: true,
    });
    render(<CodeBlock code="example text" />);
    await userEvent.click(screen.getByRole("button", { name: "复制代码" }));
    expect((await screen.findByRole("status")).textContent).toContain(
      "系统复制快捷键",
    );
    expect(window.getSelection()?.toString()).toBe("example text");
  });
  it("site typography never falls below the 12px caption role except an explicit reading counterexample", () => {
    const css = postcss.parse(readFileSync("src/index.css", "utf8"));
    const violations: string[] = [];
    css.walkDecls((d) => {
      if ((d.parent as any).selector?.includes("r-reading-bad")) return;
      if (d.prop === "font-size" || d.prop === "font")
        for (const m of d.value.matchAll(/(\d+(?:\.\d+)?)(px|rem)/g))
          if (Number(m[1]) * (m[2] === "rem" ? 16 : 1) < 12)
            violations.push(`${(d.parent as any).selector}: ${d.value}`);
    });
    expect(violations).toEqual([]);
  });
});
