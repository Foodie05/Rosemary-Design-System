import { writeFileSync, mkdirSync, readFileSync } from "node:fs";
import { IMPLEMENTATION_NOTES } from "../src/components/playground/implementationNotes";
import { describe, it, expect, afterAll } from "vitest";
import { renderToStaticMarkup } from "react-dom/server";
import { DO_DONT_CASES } from "../src/data/doDontCases";
import { COMPONENT_SPECS } from "../src/data/componentsSpec";
import { CASE_CATEGORIES, COMPONENT_CATEGORIES } from "../src/data/taxonomy";
import {
  getCaseImplementation,
  CASE_IMPLEMENTATIONS,
} from "../src/components/cases/registry";
import { COMPONENT_IMPLEMENTATIONS } from "../src/components/playground/registry";
import { tokenModes, tokenNames } from "../src/generated/tokens";
import { parseRoute, routeFor } from "../src/routing";
describe("Publication contracts", () => {
  it("counts actual registered scenarios, not marketing numbers", () => {
    expect(DO_DONT_CASES.length).toBeGreaterThanOrEqual(64);
    expect(
      DO_DONT_CASES.filter((c) => getCaseImplementation(c.id).interactive)
        .length,
    ).toBeGreaterThanOrEqual(32);
    expect(COMPONENT_SPECS.length).toBeGreaterThanOrEqual(55);
    expect(
      Object.values(COMPONENT_IMPLEMENTATIONS).filter((v) => v.interactive)
        .length,
    ).toBeGreaterThanOrEqual(30);
    expect(new Set(DO_DONT_CASES.map((c) => c.id)).size).toBe(
      DO_DONT_CASES.length,
    );
    expect(new Set(COMPONENT_SPECS.map((c) => c.id)).size).toBe(
      COMPONENT_SPECS.length,
    );
    expect(Object.keys(CASE_IMPLEMENTATIONS).length).toBe(DO_DONT_CASES.length);
  });
  it("all related links point to existing component specifications", () => {
    const ids = COMPONENT_SPECS.map((c) => c.id);
    for (const c of DO_DONT_CASES)
      for (const related of getCaseImplementation(c.id).relatedComponents)
        expect(ids).toContain(related);
  });
  it("category registries completely cover source data", () => {
    expect(
      DO_DONT_CASES.every((c) =>
        CASE_CATEGORIES.some((v) => v.id === c.category),
      ),
    ).toBe(true);
    expect(
      COMPONENT_SPECS.every((c) =>
        COMPONENT_CATEGORIES.some((v) => v.id === c.category),
      ),
    ).toBe(true);
  });
  it("all component token references resolve in both themes", () => {
    for (const c of [
      ...COMPONENT_SPECS,
      ...DO_DONT_CASES.map((c) => ({ tokens: c.tokensInvolved || [] })),
    ])
      for (const name of c.tokens) {
        expect(tokenNames).toContain(name);
        expect(
          tokenModes.dark[name as keyof typeof tokenModes.dark],
        ).toBeDefined();
      }
  });
  it("each spec has substantive anatomy, state and access rules; no premature Stable", () => {
    for (const c of COMPONENT_SPECS) {
      expect(IMPLEMENTATION_NOTES[c.id]).toBeDefined();
      expect(c.doAndDonts?.doText.length).toBeGreaterThan(15);
      expect(c.doAndDonts?.dontText.length).toBeGreaterThan(15);
      expect(c.anatomy.length).toBeGreaterThan(1);
      expect(c.states.length).toBeGreaterThan(0);
      expect(c.accessibilityNotes.length).toBeGreaterThan(0);
      expect(c.description.length).toBeGreaterThan(20);
      expect(c.status).not.toBe("Stable");
    }
  });
  it("direct URLs and query anchors are reproducible", () => {
    expect(routeFor("dodont", "case-04-form-validation")).toBe(
      "#/dodont/case-04-form-validation",
    );
    expect(parseRoute("#/components/dialog")).toMatchObject({
      section: "components",
      id: "dialog",
    });
    expect(parseRoute("#/tokens?query=semantic.color.accent").query).toBe(
      "semantic.color.accent",
    );
    expect(parseRoute("#/brand?anchor=visual-explorations").anchor).toBe(
      "visual-explorations",
    );
    expect(parseRoute("#/invalid").section).toBe("overview");
  });
  for (const c of DO_DONT_CASES)
    it(`renders two real scene surfaces: ${c.id}`, () => {
      const { Scene } = getCaseImplementation(c.id);
      const a = renderToStaticMarkup(<Scene good preview />),
        b = renderToStaticMarkup(<Scene good={false} preview />);
      expect(a).not.toBe("");
      expect(b).not.toBe("");
      expect(a).not.toBe(b);
      expect(a).toMatch(/<(input|button|table|svg|div|label|nav|progress|dl)/);
    });
  for (const c of COMPONENT_SPECS)
    it(`renders a concrete Web surface: ${c.id}`, () => {
      const { Preview } = COMPONENT_IMPLEMENTATIONS[c.id];
      const html = renderToStaticMarkup(<Preview />);
      expect(html).toMatch(
        /<(input|button|table|svg|div|label|nav|progress|dl)/,
      );
      expect(html).not.toContain("@rosemary");
    });
});

afterAll(() => {
  mkdirSync("docs", { recursive: true });
  writeFileSync(
    "docs/catalogue.json",
    JSON.stringify(
      {
        version: JSON.parse(readFileSync("package.json", "utf8")).version,
        cases: DO_DONT_CASES.map((c) => {
          const impl = getCaseImplementation(c.id);
          return {
            id: c.id,
            category: c.category,
            title: impl.title,
            interactive: impl.interactive,
            url: `#/dodont/${c.id}`,
            source: `src/components/cases/${impl.source}Scenarios.tsx`,
            relatedComponents: impl.relatedComponents,
          };
        }),
        components: COMPONENT_SPECS.map((c) => {
          const impl = COMPONENT_IMPLEMENTATIONS[c.id];
          return {
            id: c.id,
            category: c.category,
            status: c.status,
            interactive: impl.interactive,
            url: `#/components/${c.id}`,
            source: `src/components/ui/${impl.source}.tsx`,
            controls: impl.controls,
            tokens: c.tokens,
          };
        }),
      },
      null,
      2,
    ) + "\n",
  );
});
