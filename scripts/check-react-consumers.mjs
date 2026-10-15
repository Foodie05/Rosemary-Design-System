import {
  mkdirSync,
  mkdtempSync,
  writeFileSync,
  readFileSync,
  copyFileSync,
} from "node:fs";
import path from "node:path";
import os from "node:os";
import { execFileSync } from "node:child_process";
import { createHash } from "node:crypto";
const artifactRoot =
  process.env.ROSEMARY_ARTIFACT_ROOT || path.resolve("artifacts");
const buildRoot = process.env.ROSEMARY_BUILD_ROOT || os.tmpdir();
mkdirSync(buildRoot, { recursive: true });
mkdirSync(path.join(artifactRoot, "react"), { recursive: true });
const matrix = [
  { react: "18.3.1", types: "18.3.31", domTypes: "18.3.7" },
  { react: "19.2.8", types: "19.2.18", domTypes: "19.2.3" },
].filter((row) => !process.argv[2] || row.react === process.argv[2]);
if (!matrix.length)
  throw new Error("Supported consumer versions: 18.3.1, 19.2.8");
const files = ["tokens", "icons", "react"].map((name) =>
  path.join(
    artifactRoot,
    name === "react" ? "react" : "shared",
    `rosemary-ui-${name}-0.4.2.tgz`,
  ),
);
files.forEach((file) => readFileSync(file));
const evidence = [];
for (const row of matrix) {
  const fixture = mkdtempSync(
    path.join(buildRoot, `react-${row.react}-consumer-`),
  );
  writeFileSync(
    path.join(fixture, "package.json"),
    JSON.stringify({
      name: "rosemary-independent-react-consumer",
      version: "0.0.0",
      private: true,
      type: "module",
    }),
  );
  execFileSync(
    process.platform === "win32" ? "npm.cmd" : "npm",
    [
      "install",
      "--ignore-scripts",
      "--no-audit",
      "--no-fund",
      ...files,
      `react@${row.react}`,
      `react-dom@${row.react}`,
      `@types/react@${row.types}`,
      `@types/react-dom@${row.domTypes}`,
      "typescript@5.9.3",
      "jsdom@30.1.2",
      "@testing-library/react@16.3.3",
    ],
    {
      cwd: fixture,
      env: process.env,
      stdio: "pipe",
      shell: process.platform === "win32",
    },
  );
  const tests = readFileSync(
    "packages/react/tests/components.test.mjs",
    "utf8",
  ).replace(
    /await import\((['"])\.\.\/dist\/index\.js\1\)/,
    "await import('@rosemary-ui/react')",
  );
  writeFileSync(path.join(fixture, "consumer.test.mjs"), tests);
  writeFileSync(
    path.join(fixture, "consumer.tsx"),
    `import {createRef} from 'react';
import {RosemaryProvider,Button,Checkbox,Input,DatePicker,Drawer,Table,Icon,ThemeProvider,Upload,Stepper} from '@rosemary-ui/react';
const ref=createRef<HTMLButtonElement>();const rows=[{id:'1',value:'record'}];const file=new File([],'file.txt');
export const app=<RosemaryProvider mode="system" language="en" colors={{primary:'#614578'}} onDiagnostics={diagnostics=>diagnostics.map(d=>d.ratio/d.target)}><ThemeProvider><Button ref={ref}>Save</Button><Checkbox label="All" checked="mixed" onCheckedChange={checked=>void checked}/><Input label="Name" value="" onValueChange={value=>void value}/><DatePicker label="Date" value="0001-01-01" onValueChange={value=>void value}/><Drawer title="Settings" open={false} modal={false} onOpenChange={(open,reason)=>void [open,reason]}/><Table caption="Rows" rows={rows} rowKey={r=>r.id} columns={[{id:'value',header:'Value',render:r=>r.value}]}/><Icon name="leaf"/><Upload label="Files" files={[file]} fileStates={new Map([[file,{status:"uploading",progress:45}]])} onFilesChange={()=>{}} onRetry={file=>void file.name} onCancel={file=>void file.name}/><Stepper current="failed" items={[{id:"failed",title:"Failed",state:"error"},{id:"locked",title:"Locked",state:"unavailable"}]}/></ThemeProvider></RosemaryProvider>;`,
  );
  writeFileSync(
    path.join(fixture, "tsconfig.json"),
    JSON.stringify({
      compilerOptions: {
        target: "ES2022",
        module: "NodeNext",
        moduleResolution: "NodeNext",
        jsx: "react-jsx",
        strict: true,
        noEmit: true,
        skipLibCheck: false,
      },
      include: ["consumer.tsx"],
    }),
  );
  execFileSync(
    process.execPath,
    ["node_modules/typescript/bin/tsc", "-p", "tsconfig.json"],
    { cwd: fixture, encoding: "utf8" },
  );
  const result = execFileSync(
    process.execPath,
    ["--test", "consumer.test.mjs"],
    { cwd: fixture, encoding: "utf8" },
  );
  console.log(result);
  writeFileSync(
    path.join(fixture, "exports.mjs"),
    `import fs from 'node:fs';import assert from 'node:assert/strict';import {createRequire} from 'node:module';const require=createRequire(import.meta.url);assert.ok(fs.readFileSync(require.resolve('@rosemary-ui/react/css'),'utf8').includes('rotateY(-58deg)'));assert.ok(fs.readFileSync(require.resolve('@rosemary-ui/react/brand-assets'),'utf8').includes('MIT'));assert.ok(fs.existsSync(new URL('./node_modules/@rosemary-ui/react/dist/assets/rosemary-logo.png',import.meta.url)));`,
  );
  execFileSync(process.execPath, ["exports.mjs"], { cwd: fixture });
  const item = {
    ...row,
    fixture,
    typecheck: "passed",
    ssrAndControlledInteractions: "passed",
    tests: 8,
    cssAndBrandAssets: "passed",
    packages: files.map((file) => ({
      file,
      sha256: createHash("sha256").update(readFileSync(file)).digest("hex"),
    })),
  };
  evidence.push(item);
  writeFileSync(
    path.join(artifactRoot, "react", `consumer-${row.react}-evidence.json`),
    JSON.stringify(item, null, 2) + "\n",
  );
}
console.log(JSON.stringify(evidence, null, 2));
