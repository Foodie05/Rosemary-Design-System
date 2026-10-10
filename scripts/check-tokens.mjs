import { readFileSync, readdirSync } from "node:fs";
import { execFileSync } from "node:child_process";
const files = [
  "src/generated/tokens.css",
  "src/generated/tokens.ts",
  ...readdirSync("public/generated")
    .filter(
      (n) =>
        /\.(json|css|dart|swift|kt|cs)$/.test(n) && n !== "acceptance.json",
    )
    .map((n) => `public/generated/${n}`),
  "platforms/flutter/lib/rosemary_tokens.dart",
  "platforms/swiftui/Sources/RosemaryUI/RosemaryTokens.swift",
  "platforms/android/rosemary-compose/src/main/java/design/rosemary/tokens/RosemaryTokens.kt",
];
const before = files.map((f) => [f, readFileSync(f, "utf8")]);
execFileSync(process.execPath, ["scripts/build-tokens.mjs"], {
  stdio: "inherit",
});
const stale = before.filter(
  ([f, content]) => readFileSync(f, "utf8") !== content,
);
if (stale.length)
  throw Error(
    `Stale generated files were regenerated: ${stale.map(([f]) => f).join(", ")}`,
  );
console.log("Generated artifacts are current and deterministic.");
