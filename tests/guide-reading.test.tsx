import { act, fireEvent, render, screen } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";
import {
  DocDisclosure,
  revealAnchor,
} from "../src/components/common/DocDisclosure";
import { ComponentsView } from "../src/components/views/ComponentsView";
import { AIAgentGuideView } from "../src/components/views/AIAgentGuideView";
import { publication, publicationUrl } from "../src/data/publication";
import App from "../src/App";
beforeEach(() => {
  localStorage.clear();
  sessionStorage.clear();
  window.scrollTo = vi.fn();
  vi.stubGlobal("matchMedia", () => ({ matches: false }));
  HTMLElement.prototype.scrollIntoView = vi.fn();
});
describe("Guide retrieval and progressive disclosure", () => {
  it("opens every collapsed ancestor before an anchor becomes readable", () => {
    const { container } = render(
      <DocDisclosure title="参数">
        <details>
          <summary>源码</summary>
          <p id="destination">完整规则</p>
        </details>
      </DocDisclosure>,
    );
    const details = [...container.querySelectorAll("details")];
    expect(details.every((d) => !d.open)).toBe(true);
    revealAnchor(container.querySelector("#destination")!);
    expect(details.every((d) => d.open)).toBe(true);
  });
  it("a direct component source URL opens the actual source disclosure", async () => {
    location.hash = "#/components/button?anchor=implementation";
    render(<App />);
    await screen.findByRole("heading", { name: /Button/ });
    await act(async () => {});
    expect(
      (document.getElementById("implementation") as HTMLDetailsElement).open,
    ).toBe(true);
    expect(document.getElementById("implementation")?.textContent).toContain(
      "export function",
    );
  });
  it("initial catalogue is bounded, more reveals entries and full search still finds late components", () => {
    const { container } = render(<ComponentsView />);
    expect(container.querySelectorAll(".r-component-card")).toHaveLength(12);
    fireEvent.click(screen.getByRole("button", { name: "再显示 12 个组件" }));
    expect(container.querySelectorAll(".r-component-card")).toHaveLength(24);
    fireEvent.change(screen.getByRole("searchbox", { name: "搜索组件" }), {
      target: { value: "File Browser Row" },
    });
    expect(screen.getByRole("status").textContent).toBe("1 个组件");
    expect(
      screen.getByRole("link", { name: "File Browser Row" }),
    ).toBeDefined();
  });
  it("unset publication URLs expose a readable local guide without fictitious remote links", () => {
    const configured = { ...publication };
    publication.repositoryUrl = null;
    publication.websiteUrl = null;
    try {
    render(<AIAgentGuideView />);
    expect(screen.queryByRole("link", { name: /打开仓库/ })).toBeNull();
    expect(
      screen.getByRole("link", { name: /完整接入指南/ }).getAttribute("href"),
    ).toBe("/guide/ai-integration.md");
    expect(
      screen.getByRole("link", { name: /机器可读索引/ }).getAttribute("href"),
    ).toBe("/guide/manifest.json");
    } finally {
      Object.assign(publication, configured);
    }
  });
  it("configured publication links resolve to the declared repository and website", () => {
    render(<AIAgentGuideView />);
    expect(screen.getByRole("link", {name: /打开仓库/}).getAttribute("href"))
      .toBe(publication.repositoryUrl);
    expect(screen.getByRole("link", {name: /打开网站/}).getAttribute("href"))
      .toBe(publication.websiteUrl);
    expect(screen.getByText(publication.sourceRef!)).toBeDefined();
  });
  it("publication links accept HTTPS and reject executable or credential-bearing URLs", () => {
    expect(publicationUrl(null)).toBeNull();
    expect(publicationUrl("javascript:alert(1)")).toBeNull();
    expect(publicationUrl("https://name:secret@example.com")).toBeNull();
    expect(publicationUrl("https://github.com/example/design/")).toBe(
      "https://github.com/example/design",
    );
  });
});
