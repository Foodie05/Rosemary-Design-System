import { build } from "esbuild";
import { mkdirSync, writeFileSync, copyFileSync } from "node:fs";
mkdirSync("dist", { recursive: true });
await build({
  entryPoints: ["src/app.tsx"],
  outdir: "dist",
  bundle: true,
  format: "esm",
  sourcemap: true,
  loader: { ".png": "file" },
  entryNames: "app",
  assetNames: "assets/[name]-[hash]",
});
// The module-relative brand PNG URL is kept by esbuild; copy it at that stable runtime path.
mkdirSync("dist/assets", { recursive: true });
copyFileSync("../../assets/rosemary-logo.png", "dist/assets/rosemary-logo.png");
writeFileSync(
  "dist/index.html",
  '<!doctype html><html lang="zh-CN"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>Rosemary React SDK Gallery</title><link rel="stylesheet" href="app.css"></head><body><div id="root"></div><script type="module" src="app.js"></script></body></html>',
);
