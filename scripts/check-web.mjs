import { spawnSync } from "node:child_process";
import { mkdirSync, writeFileSync } from "node:fs";
import { sourceFingerprint } from "./evidence-source.mjs";
mkdirSync("docs", { recursive: true });
const steps = [];
let log = "";
for (const script of ["tokens:check", "lint", "test", "build"]) {
  console.log(`\nChecking ${script}…`);
  const result = spawnSync("npm", ["run", script], {
    encoding: "utf8",
    timeout: 180000,
  });
  const output = (result.stdout || "") + (result.stderr || "");
  process.stdout.write(output);
  log += `\n$ npm run ${script}\n${output}`;
  steps.push({ script, exitCode: result.status, error: result.error?.message });
  if (result.status !== 0 || result.error) break;
}
const passed =
  steps.length === 4 && steps.every((s) => s.exitCode === 0 && !s.error);
writeFileSync("docs/web-check.log", log);
writeFileSync(
  "docs/engineering-checks.json",
  JSON.stringify(
    {
      checkedAt: new Date().toISOString(),
      command: "npm run check",
      passed,
      exitCode: passed ? 0 : 1,
      source: sourceFingerprint(),
      steps,
      recording:
        "Actual subprocess results. Complete output is docs/web-check.log.",
    },
    null,
    2,
  ) + "\n",
);
if (!passed) process.exitCode = 1;
