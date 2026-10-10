import { describe, it, expect } from "vitest";
import { readFileSync } from "node:fs";
import {
  flatten,
  merge,
  resolve,
  cssValue,
  contrast,
} from "../scripts/token-engine.mjs";
describe("Token pipeline errors and outputs", () => {
  it("resolves typed chains to the primitive value", () => {
    const value = { value: 8, unit: "px" };
    const map = flatten({
      primitive: { space: { $type: "dimension", $value: value } },
      semantic: { space: { $type: "dimension", $value: "{primitive.space}" } },
      component: { gap: { $type: "dimension", $value: "{semantic.space}" } },
    });
    expect(resolve(map, "component.gap")).toEqual(value);
  });
  it("rejects missing and cyclic aliases", () => {
    expect(() =>
      resolve(flatten({ a: { $type: "dimension", $value: "{missing}" } }), "a"),
    ).toThrow();
    expect(() =>
      resolve(
        flatten({
          a: { $type: "dimension", $value: "{b}" },
          b: { $type: "dimension", $value: "{a}" },
        }),
        "a",
      ),
    ).toThrow(/Circular/);
  });
  it("rejects invalid names, missing types and alias type mismatch", () => {
    expect(() =>
      flatten({ "bad.name": { $type: "number", $value: 1 } }),
    ).toThrow(/Invalid/);
    expect(() => flatten({ a: { $value: 1 } })).toThrow(/Missing/);
    expect(() =>
      resolve(
        flatten({
          a: { $type: "color", $value: "{b}" },
          b: { $type: "dimension", $value: { value: 4, unit: "px" } },
        }),
        "a",
      ),
    ).toThrow(/mismatch/);
  });
  it("merges theme override without replacing component aliases", () => {
    const tree = merge(
      { semantic: { accent: { $value: "light" } } },
      { semantic: { accent: { $value: "dark" } } },
    );
    expect(tree.semantic.accent.$value).toBe("dark");
  });
  it("checks known contrast values and dark button text", () => {
    expect(contrast("#ffffff", "#000000")).toBe(21);
    const report = JSON.parse(
      readFileSync("public/generated/validation.json", "utf8"),
    );
    expect(report.contrast.length).toBe(20);
    expect(report.contrast.every((p: any) => p.ratio >= p.minimum)).toBe(true);
  });
  it("exports CSS declarations, not var() as property names", () => {
    const css = readFileSync("public/generated/rosemary.css", "utf8");
    expect(css).toContain(
      "--r-component-button-background: var(--r-semantic-color-accent)",
    );
    expect(css).not.toMatch(/var\([^\)]+\):/);
  });
  it("native output uses typed values and same generated semantic names", () => {
    const dart = readFileSync("public/generated/rosemary_tokens.dart", "utf8");
    expect(dart).toContain(
      "static const semantic_color_accent = Color(0xFF315747)",
    );
    expect(dart).toContain("class RosemaryDarkTokens");
    const kotlin = readFileSync("public/generated/RosemaryTokens.kt", "utf8");
    expect(kotlin).toContain("semantic_size_body = 16.sp");
    expect(kotlin).toContain("semantic_space_16 = 16.dp");
  });
});
