import { describe, it, expect, vi } from "vitest";
import { render, screen, fireEvent, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { useState } from "react";
import axe from "axe-core";
import { Select, SelectOption } from "../src/components/ui/Select";
import { Breadcrumbs } from "../src/components/layout/Breadcrumbs";
import { parseRoute } from "../src/routing";
import { NAV_ITEMS } from "../src/data/navigation";
import { DO_DONT_CASES } from "../src/data/doDontCases";
import { getCaseImplementation } from "../src/components/cases/registry";
import { Modal } from "../src/components/ui/core";
import { readFileSync, readdirSync } from "node:fs";
import path from "node:path";
const options: SelectOption[] = [
  { value: "a", label: "Alpha" },
  { value: "b", label: "Beta", disabled: true },
  { value: "c", label: "Charlie" },
  { value: "d", label: "Delta" },
];
function Fixture() {
  const [value, setValue] = useState("a");
  return (
    <form aria-label="测试表单">
      <label>
        选择
        <Select
          value={value}
          onValueChange={setValue}
          options={options}
          label="选择"
          name="choice"
          id="fixture-choice"
          aria-describedby="choice-help"
        />
      </label>
      <span id="choice-help">选择需要的项目</span>
      <button type="button">下一项</button>
      <output>{value}</output>
    </form>
  );
}
describe("Real navigation hierarchy", () => {
  for (const item of NAV_ITEMS.filter((i) => i.section !== "overview"))
    it(`uses the actual section destination: ${item.section}`, () => {
      const { container } = render(
        <Breadcrumbs
          route={parseRoute(
            `#/${item.section}?query=semantic.color.chart-two&anchor=tokens`,
          )}
        />,
      );
      const nav = screen.getByRole("navigation", { name: "页面面包屑" });
      expect(
        within(nav)
          .getAllByRole("link")
          .map((a) => a.getAttribute("href")),
      ).toEqual(["#/overview"]);
      expect(
        container.querySelector('[aria-current="page"]')?.textContent,
      ).toBe(item.title);
      expect(container.querySelectorAll("ol > li").length).toBe(2);
    });
  it("does not add a redundant breadcrumb on the homepage", () => {
    render(<Breadcrumbs route={parseRoute("#/overview")} />);
    expect(screen.queryByRole("navigation")).toBeNull();
  });
  it("component hierarchy has clickable parents and a non-clickable current page", () => {
    const { container, rerender } = render(
      <Breadcrumbs route={parseRoute("#/components/button?anchor=usage")} />,
    );
    expect(
      screen.getByRole("link", { name: "组件库" }).getAttribute("href"),
    ).toBe("#/components");
    expect(container.querySelector('[aria-current="page"]')?.textContent).toBe(
      "Button",
    );
    expect(screen.queryByRole("link", { name: "Button" })).toBeNull();
    rerender(<Breadcrumbs route={parseRoute("#/components/unknown")} />);
    expect(container.querySelector('[aria-current="page"]')?.textContent).toBe(
      "未找到的组件",
    );
  });
  it("case titles come from the registered page and invalid cases retain real parents", () => {
    const id = DO_DONT_CASES[0].id;
    const { container, rerender } = render(
      <Breadcrumbs route={parseRoute(`#/dodont/${id}`)} />,
    );
    expect(container.querySelector('[aria-current="page"]')?.textContent).toBe(
      getCaseImplementation(id).title,
    );
    expect(
      screen.getByRole("link", { name: "案例指南" }).getAttribute("href"),
    ).toBe("#/dodont");
    rerender(<Breadcrumbs route={parseRoute("#/dodont/unknown")} />);
    expect(container.querySelector('[aria-current="page"]')?.textContent).toBe(
      "未找到的案例",
    );
  });
});
describe("Shared Web Select", () => {
  it("highlights without committing, skips disabled options, and Escape discards", async () => {
    render(<Fixture />);
    const u = userEvent.setup();
    await u.tab();
    await u.keyboard("{Enter}{ArrowDown}");
    const trigger = screen.getByRole("combobox", { name: "选择" });
    expect(trigger.getAttribute("aria-activedescendant")).toBe(
      screen.getByRole("option", { name: "Charlie" }).id,
    );
    expect(
      screen
        .getByRole("option", { name: "Alpha" })
        .getAttribute("aria-selected"),
    ).toBe("true");
    expect(screen.getByRole("status").textContent).toBe("a");
    await u.keyboard("{Escape}");
    expect(screen.queryByRole("listbox")).toBeNull();
    expect(document.activeElement).toBe(trigger);
    await u.keyboard(" {End}{Enter}");
    expect(screen.getByRole("status").textContent).toBe("d");
    expect(document.activeElement).toBe(trigger);
  });
  it("supports Home, End and prefix search, with confirmation through Space", async () => {
    render(<Fixture />);
    const u = userEvent.setup();
    await u.tab();
    await u.keyboard("{ArrowDown}{End}{Home}ch");
    expect(
      screen.getByRole("combobox").getAttribute("aria-activedescendant"),
    ).toBe(screen.getByRole("option", { name: "Charlie" }).id);
    await u.keyboard(" ");
    expect(screen.getByRole("status").textContent).toBe("c");
  });
  it("commits a pointer choice once without submitting the form", async () => {
    const submit = vi.fn();
    render(
      <div onSubmit={submit}>
        <Fixture />
      </div>,
    );
    const u = userEvent.setup();
    await u.click(screen.getByRole("combobox"));
    await u.click(screen.getByRole("option", { name: "Charlie" }));
    expect(screen.queryByRole("listbox")).toBeNull();
    expect(screen.getByRole("status").textContent).toBe("c");
    expect(submit).not.toHaveBeenCalled();
  });
  it("Tab closes and moves naturally; outside pointer preserves the clicked focus", async () => {
    render(<Fixture />);
    const u = userEvent.setup();
    await u.tab();
    await u.keyboard("{Enter}{ArrowDown}{Tab}");
    expect(document.activeElement).toBe(
      screen.getByRole("button", { name: "下一项" }),
    );
    expect(screen.queryByRole("listbox")).toBeNull();
    expect(screen.getByRole("status").textContent).toBe("a");
    await u.click(screen.getByRole("combobox"));
    await u.click(screen.getByRole("button", { name: "下一项" }));
    expect(document.activeElement).toBe(
      screen.getByRole("button", { name: "下一项" }),
    );
    expect(screen.queryByRole("listbox")).toBeNull();
  });
  it("keeps disabled options unselectable and exposes disabled and empty controls", async () => {
    const change = vi.fn();
    const { rerender } = render(
      <Select
        label="选择"
        value="a"
        onValueChange={change}
        options={options}
      />,
    );
    await userEvent.click(screen.getByRole("combobox"));
    await userEvent.click(screen.getByRole("option", { name: "Beta" }));
    expect(change).not.toHaveBeenCalled();
    rerender(
      <Select
        label="选择"
        value="a"
        onValueChange={change}
        options={options}
        disabled
      />,
    );
    expect((screen.getByRole("combobox") as HTMLButtonElement).disabled).toBe(
      true,
    );
    expect(screen.queryByRole("listbox")).toBeNull();
    rerender(
      <Select label="选择" value="" onValueChange={change} options={[]} />,
    );
    expect((screen.getByRole("combobox") as HTMLButtonElement).disabled).toBe(
      true,
    );
  });
  it("does not silently replace an unknown controlled value", () => {
    const change = vi.fn();
    render(
      <Select
        label="选择"
        value="obsolete"
        onValueChange={change}
        options={options}
      />,
    );
    expect(screen.getByRole("combobox").textContent).toBe("请选择");
    expect(change).not.toHaveBeenCalled();
  });
  it("submits the committed value and keeps explicit id and description associations", async () => {
    render(<Fixture />);
    await userEvent.click(screen.getByRole("combobox"));
    await userEvent.click(screen.getByRole("option", { name: "Charlie" }));
    expect(screen.getByRole("combobox").id).toBe("fixture-choice");
    expect(screen.getByRole("combobox").getAttribute("aria-describedby")).toBe(
      "choice-help",
    );
    expect(
      new FormData(
        screen.getByRole("form", { name: "测试表单" }) as HTMLFormElement,
      ).get("choice"),
    ).toBe("c");
  });
  it("closes on external value updates, page scrolling and viewport resize", async () => {
    const { rerender } = render(
      <Select
        label="选择"
        value="a"
        onValueChange={() => {}}
        options={options}
      />,
    );
    await userEvent.click(screen.getByRole("combobox"));
    rerender(
      <Select
        label="选择"
        value="c"
        onValueChange={() => {}}
        options={options}
      />,
    );
    expect(screen.queryByRole("listbox")).toBeNull();
    await userEvent.click(screen.getByRole("combobox"));
    fireEvent.scroll(window);
    expect(screen.queryByRole("listbox")).toBeNull();
    await userEvent.click(screen.getByRole("combobox"));
    fireEvent(window, new Event("resize"));
    expect(screen.queryByRole("listbox")).toBeNull();
  });
  it("fallback stays inside its dialog and preserves a scoped preview theme", async () => {
    render(
      <div data-theme="dark">
        <Modal open title="设置" onClose={() => {}}>
          <label>
            选择
            <Select
              label="选择"
              value="a"
              onValueChange={() => {}}
              options={options}
            />
          </label>
        </Modal>
      </div>,
    );
    await userEvent.click(screen.getByRole("combobox"));
    const list = screen.getByRole("listbox");
    expect(list.closest("dialog")).not.toBeNull();
    expect(list.dataset.theme).toBe("dark");
  });
  it("open combobox and listbox have valid accessibility structure", async () => {
    const { container } = render(<Fixture />);
    await userEvent.click(screen.getByRole("combobox"));
    const result = await axe.run(document.body, {
      runOnly: {
        type: "tag",
        values: ["wcag2a", "wcag2aa", "wcag21aa", "wcag22aa"],
      },
      rules: { "color-contrast": { enabled: false } },
    });
    expect(result.violations.map((v) => v.id)).toEqual([]);
    expect(container.querySelector("select")).toBeNull();
  });
  it("all former Web selects use the shared component", () => {
    function files(dir: string): string[] {
      return readdirSync(dir, { withFileTypes: true }).flatMap((e) =>
        e.isDirectory()
          ? files(path.join(dir, e.name))
          : [path.join(dir, e.name)],
      );
    }
    for (const file of files("src").filter((f) => f.endsWith(".tsx")))
      expect(readFileSync(file, "utf8")).not.toMatch(/<select(?:\s|>)/);
  });
});
