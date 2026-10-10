import { chooseSelect } from "./select-helpers";
import { describe, it, expect, beforeEach } from "vitest";
import { render, screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { DoDontGalleryView } from "../src/components/views/DoDontGalleryView";
import { ComponentsView } from "../src/components/views/ComponentsView";
import { Playground } from "../src/components/playground/Playground";
import { BrandStudies } from "../src/components/brand/BrandStudies";
import { COMPONENT_SPECS } from "../src/data/componentsSpec";
import { DO_DONT_CASES } from "../src/data/doDontCases";
import { getCaseImplementation } from "../src/components/cases/registry";
beforeEach(() => sessionStorage.clear());
describe("Catalogue and configuration paths", () => {
  it("case keyword, platform, interactive filters compose and reset", async () => {
    const u = userEvent.setup();
    render(<DoDontGalleryView />);
    await u.type(screen.getByLabelText("搜索案例"), "表单");
    chooseSelect(screen.getByLabelText("平台"), "Web");
    await u.click(screen.getByLabelText("仅交互案例"));
    const count = DO_DONT_CASES.filter(
      (c) =>
        `${getCaseImplementation(c.id).title} ${c.title} ${c.summary} ${c.tags.join(" ")} ${c.id}`.includes(
          "表单",
        ) &&
        c.applicablePlatforms.includes("Web") &&
        getCaseImplementation(c.id).interactive,
    ).length;
    expect(screen.getByRole("status").textContent).toBe(`找到 ${count} 组案例`);
    await u.click(screen.getByRole("button", { name: "重置筛选" }));
    expect(screen.getByRole("status").textContent).toBe("找到 65 组案例");
    expect((screen.getByLabelText("搜索案例") as HTMLInputElement).value).toBe(
      "",
    );
  });
  it("directory query survives detail and return", async () => {
    const u = userEvent.setup();
    const { unmount } = render(<DoDontGalleryView />);
    await u.type(screen.getByLabelText("搜索案例"), "撤销");
    unmount();
    render(<DoDontGalleryView />);
    expect((screen.getByLabelText("搜索案例") as HTMLInputElement).value).toBe(
      "撤销",
    );
    expect(screen.getByRole("status").textContent).not.toBe("找到 65 组案例");
  });
  it("component search and category intersection can recover empty results", async () => {
    const u = userEvent.setup();
    render(<ComponentsView />);
    await u.type(screen.getByLabelText("搜索组件"), "Button");
    await u.click(
      within(screen.getByRole("group", { name: "组件族" })).getByRole(
        "button",
        { name: /输入/ },
      ),
    );
    expect(screen.getByRole("status").textContent).toBe("1 个组件");
    await u.clear(screen.getByLabelText("搜索组件"));
    await u.type(screen.getByLabelText("搜索组件"), "no-such-control");
    expect(screen.getByRole("heading", { name: "没有匹配组件" })).toBeDefined();
    await u.click(screen.getByRole("button", { name: "清除筛选" }));
    expect(screen.getByRole("status").textContent).toBe("61 个组件");
  });
  it("button props affect the real element, reset restores behavior", async () => {
    const u = userEvent.setup();
    render(
      <Playground spec={COMPONENT_SPECS.find((c) => c.id === "button")!} />,
    );
    chooseSelect(screen.getByRole("combobox", { name: "Variant" }), "danger");
    chooseSelect(screen.getByRole("combobox", { name: "Size" }), "lg");
    await u.type(screen.getByRole("textbox", { name: "内容" }), "删除草稿");
    chooseSelect(screen.getByRole("combobox", { name: "State" }), "Loading");
    chooseSelect(screen.getByRole("combobox", { name: "Theme" }), "Dark");
    const b = screen.getByRole("button", {
      name: "删除草稿",
    }) as HTMLButtonElement;
    expect(b.disabled).toBe(true);
    expect(b.getAttribute("aria-busy")).toBe("true");
    expect(b.className).toContain("r-danger r-lg");
    expect(b.closest("[data-theme]")?.getAttribute("data-theme")).toBe("dark");
    await u.click(screen.getByRole("button", { name: "重置配置与交互" }));
    await u.click(screen.getByRole("button", { name: "保存更改" }));
    expect(screen.getByRole("status").textContent).toBe("已保存 1 次");
  });
  it("button matrix shows all variants, states, sizes and both icon layouts", async () => {
    const u = userEvent.setup();
    const { container } = render(
      <Playground spec={COMPONENT_SPECS.find((c) => c.id === "button")!} />,
    );
    await u.click(screen.getByRole("button", { name: /查看变体与状态矩阵/ }));
    const matrix = container.querySelector(".r-state-matrix")!;
    for (const name of [
      "primary",
      "secondary",
      "tertiary",
      "ghost",
      "danger",
      "Disabled",
      "Loading",
      "Size sm",
      "Size md",
      "Size lg",
      "Leading icon",
      "Trailing icon",
    ])
      expect(matrix.textContent).toContain(name);
  });
  it("three brand directions change four concrete visual scenes", async () => {
    const u = userEvent.setup();
    const { container } = render(<BrandStudies />);
    expect(
      container.querySelector(".r-study-tabs .r-tab-indicator"),
    ).toBeNull();
    for (const name of ["人文档案", "精密仪器", "自然秩序"]) {
      await u.click(screen.getByRole("button", { name: new RegExp(name) }));
      expect(
        screen
          .getByRole("button", { name: new RegExp(name) })
          .getAttribute("aria-pressed"),
      ).toBe("true");
      expect(container.querySelectorAll(".r-study-board > div").length).toBe(4);
      expect(
        screen.getByRole("heading", { name: new RegExp(`^${name}$`) }),
      ).toBeDefined();
    }
  });
});
