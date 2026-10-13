import { copyFileSync, mkdirSync } from "node:fs";
const name = process.argv[2];
if (!["tokens", "icons", "react"].includes(name))
  throw new Error("Expected tokens, icons or react");
mkdirSync("dist", { recursive: true });
if (name === "tokens") {
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
