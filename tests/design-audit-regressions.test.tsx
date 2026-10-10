import { render, screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it } from "vitest";
import { Tabs, BreadcrumbExample } from "../src/components/ui/navigation";
import { TokenBrowser } from "../src/components/tokens/TokenBrowser";
describe("Independent design audit regressions", () => {
  it("every tab controls a real panel before and after a keyboard selection", async () => {
    const user = userEvent.setup();
    render(<Tabs />);
    const assertReferences = () => {
      for (const tab of screen.getAllByRole("tab"))
        expect(
          document.getElementById(tab.getAttribute("aria-controls")!),
        ).not.toBeNull();
    };
    assertReferences();
    await user.click(screen.getByRole("tab", { name: "概览" }));
    await user.keyboard("{End}");
    assertReferences();
    expect(screen.getByRole("tabpanel").getAttribute("aria-labelledby")).toBe(
      screen.getByRole("tab", { name: "设置" }).id,
    );
  });
  it("teaching breadcrumbs use real parents and a non-interactive current page", () => {
    render(<BreadcrumbExample />);
    const nav = screen.getByRole("navigation", { name: "面包屑" });
    expect(within(nav).getByRole("list")).toBeTruthy();
    expect(
      within(nav)
        .getByRole("link", { name: "Rosemary Design" })
        .getAttribute("href"),
    ).toBe("#/overview");
    expect(
      within(nav).getByRole("link", { name: "组件库" }).getAttribute("href"),
    ).toBe("#/components");
    expect(
      within(nav).getByText("Breadcrumb").getAttribute("aria-current"),
    ).toBe("page");
    expect(within(nav).queryByRole("button")).toBeNull();
  });
  it("Tokens reveal twelve at a time and search still covers the entire catalogue", async () => {
    const user = userEvent.setup();
    const { container } = render(<TokenBrowser />);
    expect(container.querySelectorAll(".r-token-card").length).toBe(12);
    await user.click(screen.getByRole("button", { name: "再显示 12 个令牌" }));
    expect(container.querySelectorAll(".r-token-card").length).toBe(24);
    await user.type(
      screen.getByRole("searchbox", { name: "搜索令牌" }),
      "semantic.color.chart-two",
    );
    expect(container.querySelectorAll(".r-token-card").length).toBe(1);
    expect(
      screen.getByRole("heading", { name: "semantic.color.chart-two" }),
    ).toBeTruthy();
    await user.clear(screen.getByRole("searchbox", { name: "搜索令牌" }));
    expect(container.querySelectorAll(".r-token-card").length).toBe(12);
  });
});
