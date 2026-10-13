import path from "node:path";
import { mkdirSync } from "node:fs";
import { execFileSync } from "node:child_process";
const root = process.env.ROSEMARY_ARTIFACT_ROOT || path.resolve("artifacts");
for (const name of ["tokens", "icons", "react"]) {
  const destination = path.join(root, name === "react" ? "react" : "shared");
  mkdirSync(destination, { recursive: true });
  execFileSync(
    process.platform === "win32" ? "pnpm.cmd" : "pnpm",
    ["--dir", `packages/${name}`, "pack", "--pack-destination", destination],
    { env: process.env, stdio: "inherit", shell: process.platform === "win32" },
  );
}
