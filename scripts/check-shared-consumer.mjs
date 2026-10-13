import { mkdirSync, mkdtempSync, writeFileSync, readFileSync } from "node:fs";
import path from "node:path";
import os from "node:os";
import { execFileSync } from "node:child_process";
import { createHash } from "node:crypto";
const artifactRoot =
  process.env.ROSEMARY_ARTIFACT_ROOT || path.resolve("artifacts");
const buildRoot = process.env.ROSEMARY_BUILD_ROOT || os.tmpdir();
mkdirSync(buildRoot, { recursive: true });
const fixture = mkdtempSync(path.join(buildRoot, "shared-consumer-"));
const files = ["tokens", "icons"].map((name) =>
  path.join(artifactRoot, "shared", `rosemary-ui-${name}-0.4.0.tgz`),
);
for (const file of files) readFileSync(file);
writeFileSync(
  path.join(fixture, "package.json"),
  JSON.stringify({
    name: "rosemary-independent-shared-consumer",
    version: "0.0.0",
    private: true,
    type: "module",
  }),
);
execFileSync(
  "npm",
  ["install", "--ignore-scripts", "--no-audit", "--no-fund", ...files],
  { cwd: fixture, env: process.env, stdio: "pipe" },
);
const source = `
import assert from 'node:assert/strict';
import fs from 'node:fs';
import {createRequire} from 'node:module';
import {defaultThemes,createTheme,validateTheme,parseLocalDate,formatLocalDate} from '@rosemary-ui/tokens';
import {getIconSvg,iconNames} from '@rosemary-ui/icons';
const require=createRequire(import.meta.url);
assert.equal(validateTheme(defaultThemes.dark).length,0);
assert.equal(createTheme(defaultThemes.dark,{surface:'#25212D'}).primary,defaultThemes.dark.primary);
assert.equal(formatLocalDate(parseLocalDate('0001-01-01')),'0001-01-01');
assert.equal(iconNames.length,71);
assert.match(getIconSvg('calendar'),/viewBox="0 0 24 24"/);
assert.match(fs.readFileSync(require.resolve('@rosemary-ui/tokens/css'),'utf8'),/--rm-primary:/);
assert.match(fs.readFileSync(require.resolve('@rosemary-ui/icons/svg/leaf.svg'),'utf8'),/<svg/);
console.log('Independent tarball consumer: theme, local date, SVG geometry and exported CSS/assets passed.');
`;
writeFileSync(path.join(fixture, "consumer.mjs"), source);
const result = execFileSync(process.execPath, ["consumer.mjs"], {
  cwd: fixture,
  encoding: "utf8",
});
const evidence = {
  fixture,
  result: result.trim(),
  packages: files.map((file) => ({
    file,
    sha256: createHash("sha256").update(readFileSync(file)).digest("hex"),
  })),
};
writeFileSync(
  path.join(artifactRoot, "shared", "consumer-evidence.json"),
  JSON.stringify(evidence, null, 2) + "\n",
);
console.log(JSON.stringify(evidence, null, 2));
