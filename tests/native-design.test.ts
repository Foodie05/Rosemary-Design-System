import { describe, expect, it } from "vitest";
import { existsSync, readFileSync } from "node:fs";
import {
  NATIVE_COMPONENT_PLAN,
  NATIVE_FIRST_WAVE,
  NATIVE_LIBRARIES,
} from "../src/data/nativeLibraries";
import { COMPONENT_SPECS } from "../src/data/componentsSpec";
describe("Native library design covers real specifications without claiming implementation", () => {
  it("maps every registered component once across all three platforms", () => {
    expect(NATIVE_COMPONENT_PLAN.map((x) => x.id).sort()).toEqual(
      COMPONENT_SPECS.map((x) => x.id).sort(),
    );
    expect(new Set(NATIVE_COMPONENT_PLAN.map((x) => x.id)).size).toBe(61);
    for (const component of NATIVE_COMPONENT_PLAN)
      for (const host of ["flutter", "android", "ios"] as const)
        expect(component[host].trim().length).toBeGreaterThan(0);
  });
  it("separates first-wave Prototype from later Draft and partitions implementation into explicit batches", () => {
    expect(
      NATIVE_COMPONENT_PLAN.every(
        (x) => x.status === (x.wave === 1 ? "Prototype" : "Draft"),
      ),
    ).toBe(true);
    expect(
      [1, 2, 3].map(
        (wave) => NATIVE_COMPONENT_PLAN.filter((x) => x.wave === wave).length,
      ),
    ).toEqual([14, 22, 25]);
    expect(
      NATIVE_FIRST_WAVE.every((id) => COMPONENT_SPECS.some((x) => x.id === id)),
    ).toBe(true);
  });
  it("each platform links to an existing, stage-labelled design document", () => {
    for (const platform of NATIVE_LIBRARIES) {
      const path = `docs/native/${platform.document}.md`;
      expect(existsSync(path)).toBe(true);
      expect(readFileSync(path, "utf8")).toContain("Prototype");
    }
  });
});
