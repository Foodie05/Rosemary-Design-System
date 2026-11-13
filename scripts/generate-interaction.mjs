import { readFileSync, writeFileSync } from "node:fs";
import vm from "node:vm";
const source = JSON.parse(
  readFileSync(new URL("../design/interaction-motion.json", import.meta.url)),
);
const flat = {
  pressScale: source.press.scale,
  selectionScale: source.selection.scale,
  pressMs: source.press.durationMs,
  releaseMs: source.release.durationMs,
  pressStiffness: source.press.stiffness,
  pressDamping: source.press.dampingRatio,
  releaseStiffness: source.release.stiffness,
  releaseDamping: source.release.dampingRatio,
  travelStiffness: source.travel.stiffness,
  travelDamping: source.travel.dampingRatio,
  disclosureMs: source.disclosure.durationMs,
  disclosureExitMs: source.disclosure.exitMs,
  fieldWidth: source.field.width,
  fieldEnterMs: source.field.enterMs,
  fieldExitMs: source.field.exitMs,
  layoutMs: source.layout.durationMs,
};
const header =
  "// Generated from design/interaction-motion.json. Do not edit.\n";
// Use the portal's actual model and its 41 rounded CSS linear() samples.
// Every renderer interpolates this same table, including the forced final 1.
const context = vm.createContext({ window: {} });
vm.runInContext(
  readFileSync(new URL("../motion-physics.js", import.meta.url), "utf8"),
  context,
);
const curves = Object.fromEntries(
  [
    ["disclosureEnter", source.disclosure.durationMs],
    ["disclosureExit", source.disclosure.exitMs],
  ].map(([name, durationMs]) => [
    name,
    context.window.RosemaryPhysics.cssEasing({
      ...source.disclosure,
      durationMs,
    })
      .slice(7, -1)
      .split(",")
      .map(Number),
  ]),
);
const outputs = {
  "packages/tokens/src/interaction.ts":
    header +
    "export const rosemaryInteraction = Object.freeze(" +
    JSON.stringify(flat, null, 2) +
    ");\n" +
    "export const rosemaryDisclosure = Object.freeze(" +
    JSON.stringify(curves, null, 2) +
    ");\n",
  "platforms/swiftui/Sources/RosemaryUI/InteractionTokens.swift":
    header +
    "public enum RosemaryInteraction {\n" +
    Object.entries(flat)
      .map(([k, v]) => "  public static let " + k + ": Double = " + v)
      .join("\n") +
    "\n" +
    Object.entries(curves)
      .map(
        ([k, v]) =>
          "  public static let " + k + ": [Double] = " + JSON.stringify(v),
      )
      .join("\n") +
    "\n}\n",
  "platforms/android/rosemary-compose/src/main/java/design/rosemary/compose/InteractionTokens.kt":
    header +
    "package design.rosemary.compose\nobject RosemaryInteraction {\n" +
    Object.entries(flat)
      .map(
        ([k, v]) => "    const val " + k + " = " + Number(v).toFixed(3) + "f",
      )
      .join("\n") +
    "\n" +
    Object.entries(curves)
      .map(
        ([k, v]) =>
          "    val " +
          k +
          " = listOf(" +
          v.map((n) => Number(n).toFixed(5) + "f").join(", ") +
          ")",
      )
      .join("\n") +
    "\n}\n",
  "platforms/flutter/rosemary_ui/lib/src/interaction_tokens.dart":
    header +
    "class RosemaryInteraction {\n" +
    Object.entries(flat)
      .map(([k, v]) => "  static const double " + k + " = " + v + ";")
      .join("\n") +
    "\n" +
    Object.entries(curves)
      .map(
        ([k, v]) =>
          "  static const " + k + " = <double>" + JSON.stringify(v) + ";",
      )
      .join("\n") +
    "\n}\n",
};
for (const [file, content] of Object.entries(outputs)) {
  const target = new URL("../" + file, import.meta.url);
  if (process.argv.includes("--check")) {
    if (readFileSync(target, "utf8") !== content)
      throw Error("Stale interaction tokens: " + file);
  } else writeFileSync(target, content);
}
console.log("Interaction tokens: 4 SDK adapters in sync.");
