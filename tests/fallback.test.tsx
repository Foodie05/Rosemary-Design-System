import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { act, fireEvent, render, screen } from "@testing-library/react";
import axe from "axe-core";
import { renderToStaticMarkup } from "react-dom/server";
import { NotFoundPage } from "../src/components/common/NotFoundPage";
import { parseRoute, routeFromLocation, sections } from "../src/routing";
import { COMPONENT_SPECS } from "../src/data/componentsSpec";
import { DO_DONT_CASES } from "../src/data/doDontCases";
import { pageMotionFor } from "../src/pageMotion";
import App from "../src/App";

beforeEach(() => {
  localStorage.clear();
  vi.stubGlobal("matchMedia", () => ({ matches: false }));
  window.scrollTo = vi.fn();
});
afterEach(() => {
  history.replaceState(null, "", "/");
  vi.unstubAllGlobals();
});

describe("Shared branded recovery", () => {
  it.each([
    "#/missing",
    "#/components/missing",
    "#/dodont/missing",
    "#/brand/unknown",
    "#/components/button/extra",
    "#/components/%E0%A4%A",
  ])("rejects unresolved routes: %s", (hash) => {
    expect(parseRoute(hash).notFound).toBe(true);
  });
  it("keeps every registered section, component and case reachable", () => {
    for (const section of sections)
      expect(parseRoute(`#/${section}`).notFound).toBe(false);
    for (const spec of COMPONENT_SPECS)
      expect(parseRoute(`#/components/${spec.id}`).notFound).toBe(false);
    for (const item of DO_DONT_CASES)
      expect(parseRoute(`#/dodont/${item.id}`).notFound).toBe(false);
    for (const hash of [
      "",
      "#",
      "#/",
      "#/components/",
      "#/components/%62utton?anchor=usage",
      "#/tokens?query=color&anchor=tokens",
    ])
      expect(parseRoute(hash).notFound).toBe(false);
  });
  it("a physical missing URL cannot masquerade as a working hash route", () => {
    expect(
      routeFromLocation({ pathname: "/missing/deep/file", hash: "#/overview" })
        .notFound,
    ).toBe(true);
    expect(
      routeFromLocation({ pathname: "/index.html", hash: "#/overview" })
        .notFound,
    ).toBe(false);
    expect(routeFromLocation({ pathname: "/", hash: "#/brand" }).notFound).toBe(
      false,
    );
  });
  it("renders real recovery links in HTML without application JavaScript", async () => {
    const html = renderToStaticMarkup(<NotFoundPage />);
    const { container } = render(<NotFoundPage />);
    expect(html).toContain('href="/#/overview"');
    expect(
      screen.getByRole("link", { name: "返回首页" }).getAttribute("href"),
    ).toBe("/#/overview");
    expect(container.querySelectorAll("main")).toHaveLength(1);
    expect(container.querySelector("script")).toBeNull();
    const result = await axe.run(container, {
      rules: { "color-contrast": { enabled: false } },
    });
    expect(result.violations).toEqual([]);
  });
  it("unknown pages have their own title and focus; recovery and history do not hide the error", async () => {
    history.replaceState(null, "", "/#/components/missing?anchor=never-exists");
    render(<App />);
    expect(screen.getByRole("heading", { name: "页面未找到。" })).toBeDefined();
    expect(document.title).toBe("404 · 页面未找到 — Rosemary Design");
    expect(document.activeElement?.id).toBe("not-found-content");
    const missingHash = location.hash;
    document.getElementById("not-found-content")!.scrollIntoView = vi.fn();
    expect(
      fireEvent.click(screen.getByRole("link", { name: "跳到主要内容" })),
    ).toBe(false);
    expect(location.hash).toBe(missingHash);
    expect(screen.queryByRole("navigation", { name: "主导航" })).toBeNull();
    fireEvent.keyDown(document, { key: "k", ctrlKey: true });
    expect(screen.queryByRole("combobox")).toBeNull();
    act(() => {
      history.pushState(null, "", "/#/overview");
      window.dispatchEvent(new Event("hashchange"));
    });
    expect(
      screen.getByRole("heading", { name: /Organic.*precision/ }),
    ).toBeDefined();
    act(() => {
      history.replaceState(null, "", "/#/components/missing");
      window.dispatchEvent(new Event("hashchange"));
    });
    expect(screen.getByRole("heading", { name: "页面未找到。" })).toBeDefined();
    expect(pageMotionFor(parseRoute("#/brand"), parseRoute("#/missing"))).toBe(
      "cross",
    );
  });
  it("an invalid case offers the same single recovery action", () => {
    history.replaceState(null, "", "/#/dodont/missing");
    render(<App />);
    expect(
      screen.getByRole("link", { name: "返回首页" }).getAttribute("href"),
    ).toBe("/#/overview");
    expect(
      screen.queryByRole("link", { name: /浏览组件库|浏览案例指南/ }),
    ).toBeNull();
  });
});
