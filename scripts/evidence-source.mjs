import { readFileSync, readdirSync } from "node:fs";
import { createHash } from "node:crypto";
const walk = (dir) =>
  readdirSync(dir, { withFileTypes: true }).flatMap((entry) =>
    entry.isDirectory()
      ? [
          ".build",
          ".swiftpm",
          "build",
          ".gradle",
          ".dart_tool",
          "Pods",
          "ephemeral",
          ".kotlin",
          ".idea",
          "xcuserdata",
        ].includes(entry.name)
        ? []
        : walk(`${dir}/${entry.name}`)
      : entry.name.startsWith(".flutter-plugins") ||
          [
            ".DS_Store",
            "local.properties",
            "Generated.xcconfig",
            "flutter_export_environment.sh",
          ].includes(entry.name)
        ? []
        : [`${dir}/${entry.name}`],
  );
export function sourceFingerprint() {
  const files = [
    ".github",
    "src",
    "docs/native",
    "tokens",
    "tests",
    "platforms/flutter",
    "platforms/swiftui",
    "platforms/android",
  ]
    .flatMap(walk)
    .concat([
      "publication.json",
      "docs/NATIVE-SDK-DESIGN.md",
      "docs/MOTION.md",
      "docs/AI-INTEGRATION.md",
      "docs/AGENTS.template.md",
      "docs/CONTENT.md",
      "scripts/build-guide.mjs",
      "package.json",
      "package-lock.json",
      "vite.config.ts",
      "vitest.config.ts",
      "tsconfig.json",
      "index.html",
      "platforms/flutter/pubspec.yaml",
      "platforms/flutter/pubspec.lock",
      "platforms/flutter/example/pubspec.yaml",
      "platforms/flutter/example/pubspec.lock",
      "platforms/flutter/example/ios/Runner.xcodeproj/project.pbxproj",
      "platforms/flutter/example/android/app/build.gradle.kts",
      ".github/workflows/native-sdk.yml",
      "scripts/evidence-source.mjs",
      "scripts/check-native.mjs",
      "scripts/check-native-coverage.mts",
      "scripts/package-native.mjs",
      "scripts/build-tokens.mjs",
      "scripts/token-engine.mjs",
      "scripts/check-tokens.mjs",
      "scripts/check-web.mjs",
    ])
    .filter((path, index, paths) => paths.indexOf(path) === index)
    .sort();
  const hash = createHash("sha256");
  for (const file of files) {
    hash.update(file);
    hash.update("\0");
    hash.update(readFileSync(file));
    hash.update("\0");
  }
  return { sha256: hash.digest("hex"), fileCount: files.length };
}

// Native build receipts use a scope that does not change when unrelated Web copy changes.
export function nativeFingerprint() {
  const files = [
    "platforms/flutter",
    "platforms/android",
    "platforms/swiftui",
    "tokens",
    "docs/native",
  ]
    .flatMap(walk)
    .concat([
      "platforms/flutter/pubspec.yaml",
      "platforms/flutter/pubspec.lock",
      "platforms/flutter/example/pubspec.yaml",
      "platforms/flutter/example/pubspec.lock",
      "platforms/flutter/example/ios/Runner.xcodeproj/project.pbxproj",
      "platforms/flutter/example/android/app/build.gradle.kts",
      "docs/NATIVE-SDK-DESIGN.md",
      "src/data/nativeLibraries.ts",
      ".github/workflows/native-sdk.yml",
      "scripts/evidence-source.mjs",
      "scripts/check-native.mjs",
      "scripts/check-native-coverage.mts",
      "scripts/build-tokens.mjs",
      "scripts/token-engine.mjs",
      ".github/workflows/native-sdk.yml",
      "scripts/evidence-source.mjs",
    ])
    .filter((path, index, paths) => paths.indexOf(path) === index)
    .sort();
  const hash = createHash("sha256");
  for (const file of files) {
    hash.update(file);
    hash.update("\0");
    hash.update(readFileSync(file));
    hash.update("\0");
  }
  return { sha256: hash.digest("hex"), fileCount: files.length };
}
