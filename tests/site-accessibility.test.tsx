import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen } from "@testing-library/react";
import axe from "axe-core";
import App from "../src/App";
import { sections } from "../src/routing";
beforeEach(() => {
  localStorage.clear();
  sessionStorage.clear();
  vi.stubGlobal("matchMedia", () => ({ matches: false }));
  window.scrollTo = vi.fn();
});
describe("Website AA structure with actual shell", () => {
  for (const section of sections)
    it(section, async () => {
      location.hash = "#/" + section;
      const { container } = render(<App />);
      await screen.findByRole("heading", { level: 1 });
      const result = await axe.run(container, {
        runOnly: {
          type: "tag",
          values: ["wcag2a", "wcag2aa", "wcag21aa", "wcag22aa"],
        },
        rules: { "color-contrast": { enabled: false } },
      });
      expect(
        result.violations.map((v) => ({
          rule: v.id,
          elements: v.nodes.map((n) => n.html),
        })),
      ).toEqual([]);
    });
});
