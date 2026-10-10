import { readFileSync, readdirSync, writeFileSync } from "node:fs";
import { COMPONENT_SPECS } from "../src/data/componentsSpec.ts";
const roots = {
  flutter: "platforms/flutter/lib",
  android:
    "platforms/android/rosemary-compose/src/main/java/design/rosemary/compose",
  ios: "platforms/swiftui/Sources/RosemaryUI",
};
const walk = (dir: string): string[] =>
  readdirSync(dir, { withFileTypes: true }).flatMap((e) =>
    e.isDirectory()
      ? walk(`${dir}/${e.name}`)
      : /\.(dart|kt|swift)$/.test(e.name)
        ? [`${dir}/${e.name}`]
        : [],
  );
const gallery = {
  flutter: readFileSync("platforms/flutter/example/lib/gallery.dart", "utf8"),
  android: readFileSync(
    "platforms/android/sample/src/main/java/design/rosemary/sample/Gallery.kt",
    "utf8",
  ),
  ios: readFileSync("platforms/swiftui/Sample/Sources/Gallery.swift", "utf8"),
};
const components = COMPONENT_SPECS.map((spec) => {
  const symbol =
    "Rosemary" +
    spec.id
      .split("-")
      .map((x) => x[0].toUpperCase() + x.slice(1))
      .join("");
  const platforms = Object.fromEntries(
    Object.entries(roots).map(([platform, root]) => {
      const api =
        spec.id === "alert-dialog"
          ? platform === "flutter"
            ? "showRosemaryAlertDialog"
            : platform === "ios"
              ? "rosemaryAlertDialog"
              : symbol
          : symbol;
      const files = walk(root).filter((file) =>
        new RegExp(
          `\\b(?:(?:class|struct|fun|func)\\s+(?:<[^>]+>\\s+)?|Future<[^;\\n]+>\\s+)${api}\\b`,
        ).test(readFileSync(file, "utf8")),
      );
      const example = new RegExp(
        `(?:case\\s+(?:['"][^'"]+['"]\\s*,\\s*)*['"]${spec.id}['"]\\s*(?:,\\s*['"][^'"]+['"]\\s*)*:|['"]${spec.id}['"]\\s*(?:,\\s*['"][^'"]+['"]\\s*)*->)`,
      ).test(gallery[platform as keyof typeof gallery]);
      if (!files.length || !example)
        throw Error(
          `Missing native API or gallery: ${platform}/${spec.id} (${api})`,
        );
      return [
        platform,
        { api, files, example, stage: "Prototype", betaApproved: false },
      ];
    }),
  );
  return {
    id: spec.id,
    name: spec.name,
    specification: `#/components/${spec.id}`,
    platforms,
  };
});
if (
  components.length !== 61 ||
  new Set(components.map((c) => c.id)).size !== 61
)
  throw Error("Native catalogue must contain 61 unique components");
writeFileSync(
  "docs/native/component-coverage.json",
  JSON.stringify(
    {
      schemaVersion: 1,
      componentsPerPlatform: 61,
      implementations: 183,
      targetStage: "Beta",
      evidenceType:
        "API declarations and exhaustive host examples; not device or screen reader acceptance",
      components,
    },
    null,
    2,
  ) + "\n",
);
console.log(
  "Native coverage: 61 APIs × 3 platforms = 183 declarations and host examples.",
);
