import { execFileSync } from "node:child_process";
import { mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { createHash } from "node:crypto";
import { sourceFingerprint } from "./evidence-source.mjs";
mkdirSync("public/sdk", { recursive: true });
const packages = [];
for (const [id, directory, document] of [
  ["flutter", "flutter", "flutter-sdk"],
  ["android", "android", "android-compose"],
  ["ios", "swiftui", "ios-swiftui"],
]) {
  const file = `rosemary-${id}-prototype.tar.gz`;
  execFileSync("tar", [
    "-czf",
    `public/sdk/${file}`,
    "--exclude=build",
    "--exclude=.build",
    "--exclude=.gradle",
    "--exclude=.dart_tool",
    "--exclude=.swiftpm",
    "--exclude=Pods",
    "--exclude=ephemeral",
    "--exclude=.idea",
    "--exclude=xcuserdata",
    "--exclude=.DS_Store",
    "--exclude=local.properties",
    "--exclude=Generated.xcconfig",
    "--exclude=flutter_export_environment.sh",
    `platforms/${directory}`,
    `docs/native/${document}.md`,
    "docs/NATIVE-SDK-DESIGN.md",
  ]);
  const bytes = readFileSync(`public/sdk/${file}`);
  packages.push({
    id,
    file,
    status: "Prototype",
    implementedComponents: 14,
    betaApproved: false,
    bytes: bytes.length,
    sha256: createHash("sha256").update(bytes).digest("hex"),
  });
}
writeFileSync(
  "public/sdk/manifest.json",
  JSON.stringify({ source: sourceFingerprint(), packages }, null, 2) + "\n",
);
console.log(
  "Packaged three local Prototype SDKs; build caches and host configuration excluded.",
);
