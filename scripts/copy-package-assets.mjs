import { createHash } from "node:crypto";
import { copyFileSync, mkdirSync, readFileSync, writeFileSync } from "node:fs";
const name = process.argv[2];
if (!["tokens", "icons", "react"].includes(name))
  throw new Error("Expected tokens, icons or react");
mkdirSync("dist", { recursive: true });
if (name === "tokens") {
  copyFileSync("../../vendor/material-color-utilities.LICENSE", "MATERIAL-LICENSE");
  const provenance=JSON.parse(readFileSync("../../vendor/material-color-utilities.json","utf8"));
  provenance.packageModule={file:"dist/material-runtime.js",transformation:"Replace browser global assignment with an ESM default export; algorithm bytes are unchanged.",sha256:createHash("sha256").update(readFileSync("dist/material-runtime.js")).digest("hex")};
  writeFileSync("MATERIAL-PROVENANCE.json",JSON.stringify(provenance,null,2)+"\n");
  copyFileSync("src/tokens.css", "dist/tokens.css");
  copyFileSync("../../design/tokens.json", "dist/tokens.json");
}
if (name === "react") {
  copyFileSync("src/styles.css", "dist/styles.css");
  mkdirSync("dist/assets", { recursive: true });
  copyFileSync(
    "../../assets/rosemary-logo.png",
    "dist/assets/rosemary-logo.png",
  );
  copyFileSync("../../BRAND-ASSETS.md", "BRAND-ASSETS.md");
}
copyFileSync("../../LICENSE", "LICENSE");
