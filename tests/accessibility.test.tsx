import { describe, it, expect } from "vitest";
import { render } from "@testing-library/react";
import axe from "axe-core";
import { COMPONENT_IMPLEMENTATIONS } from "../src/components/playground/registry";
import { DO_DONT_CASES } from "../src/data/doDontCases";
import { getCaseImplementation } from "../src/components/cases/registry";
import { Modal } from "../src/components/ui/core";
// DOM-level AA rules only. Layout/contrast and native modal behavior require browser checks.
const rules = { "color-contrast": { enabled: false } };
describe("Recommended component accessibility structure", () => {
  for (const [id, { Preview }] of Object.entries(COMPONENT_IMPLEMENTATIONS))
    it(id, async () => {
      const { container } = render(
        <main>
          <h1>Reference</h1>
          <Preview />
        </main>,
      );
      const result = await axe.run(container, {
        runOnly: {
          type: "tag",
          values: ["wcag2a", "wcag2aa", "wcag21aa", "wcag22aa"],
        },
        rules,
      });
      expect(
        result.violations.map((v) => ({
          rule: v.id,
          elements: v.nodes.map((n) => n.html),
        })),
      ).toEqual([]);
    });
  for (const c of DO_DONT_CASES)
    it(`Do case: ${c.id}`, async () => {
      const { Scene } = getCaseImplementation(c.id);
      const { container } = render(
        <main>
          <h1>Reference</h1>
          <Scene good />
        </main>,
      );
      const result = await axe.run(container, {
        runOnly: {
          type: "tag",
          values: ["wcag2a", "wcag2aa", "wcag21aa", "wcag22aa"],
        },
        rules,
      });
      expect(
        result.violations.map((v) => ({
          rule: v.id,
          elements: v.nodes.map((n) => n.html),
        })),
      ).toEqual([]);
    });
  it("opened native dialog has a name and labelled controls", async () => {
    const { container } = render(
      <Modal open title="编辑项目" onClose={() => {}}>
        <label>
          项目名称
          <input />
        </label>
      </Modal>,
    );
    const result = await axe.run(container, {
      runOnly: {
        type: "tag",
        values: ["wcag2a", "wcag2aa", "wcag21aa", "wcag22aa"],
      },
      rules,
    });
    expect(result.violations.map((v) => v.id)).toEqual([]);
  });
});
