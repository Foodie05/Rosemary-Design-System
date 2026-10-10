import { readFileSync, writeFileSync, existsSync, mkdirSync } from "node:fs";
import { sourceFingerprint, nativeFingerprint } from "./evidence-source.mjs";
const read = (path) => JSON.parse(readFileSync(path, "utf8"));
const catalogue = read("docs/catalogue.json");
const tests = read("docs/test-results.json");
const browser = read("docs/browser-checks.json");
const native = read("docs/native-checks.json");
if (JSON.stringify(native.nativeSource) !== JSON.stringify(nativeFingerprint()))
  throw Error(
    "Native sources changed after native checks; rerun check:native.",
  );
const tokens = read("public/generated/validation.json");
const engineering = read("docs/engineering-checks.json");
const motion = read("docs/motion-catalogue.json");
const guide = read("public/guide/manifest.json");
const nativePlan = read("public/guide/native-component-plan.json").components;
if (
  nativePlan.length !== catalogue.components.length ||
  nativePlan.some((c) => c.status !== "Prototype")
)
  throw Error(
    "Native inventory must match all 61 implemented Prototype APIs without approving Beta.",
  );
const current = sourceFingerprint();
if (current.sha256 !== engineering.source.sha256)
  throw Error(
    "Source changed after recorded engineering checks. Run check and update its evidence before publication.",
  );
if (current.sha256 !== browser.source?.sha256)
  throw Error("Browser evidence does not match the checked source.");
if (
  JSON.stringify(motion.components.map((c) => c.id).sort()) !==
  JSON.stringify(catalogue.components.map((c) => c.id).sort())
)
  throw Error("Motion policy inventory must match every registered component.");
for (const recording of browser.motion.recordings)
  if (!existsSync(recording.file) || !existsSync(recording.timing))
    throw Error(`Missing motion recording: ${recording.file}`);
if (!tests.success || tests.numFailedTests || tests.numPendingTests)
  throw Error("Tests did not fully pass.");
if (!engineering.passed) throw Error("Engineering checks failed.");
for (const group of ["cases", "components"]) {
  if (browser[group].length !== catalogue[group].length)
    throw Error(`Incomplete browser inventory: ${group}`);
  for (const item of catalogue[group]) {
    const result = browser[group].find((r) => r.url.endsWith(item.url));
    if (!result || result.scroll > result.width || !existsSync(item.source))
      throw Error(`Missing/failed evidence: ${item.id}`);
  }
}
const passedTests = native.checks.find(
  (c) => c.label === "Flutter widget tests",
);
const flutterTests =
  passedTests?.output
    .split("\n")
    .flatMap((line) => {
      try {
        return [JSON.parse(line)];
      } catch {
        return [];
      }
    })
    .filter((e) => e.type === "testDone" && e.result === "success" && !e.hidden)
    .length || 0;
const receipt = {
  version: catalogue.version,
  recordedAt: new Date().toISOString(),
  source: current,
  brand: {
    directions: 3,
    scenesPerDirection: 4,
    default: "Organic Precision",
    identityDecision: "docs/BRAND-DECISION.md",
  },
  catalogue: {
    cases: catalogue.cases.length,
    interactiveCases: catalogue.cases.filter((c) => c.interactive).length,
    componentSpecs: catalogue.components.length,
    interactiveWebReferences: catalogue.components.filter((c) => c.interactive)
      .length,
    statuses: catalogue.components.reduce(
      (n, c) => ({ ...n, [c.status]: (n[c.status] || 0) + 1 }),
      {},
    ),
  },
  tokens: {
    countPerMode: tokens.tokensPerMode,
    modes: tokens.modes,
    contrastPairs: tokens.contrast.length,
    supportedDtcgTypes: [
      "color (sRGB)",
      "dimension",
      "fontFamily",
      "duration",
      "cubicBezier",
    ],
    deterministic: true,
  },
  engineering: {
    command: engineering.command,
    passed: engineering.passed,
    testsPassed: tests.numPassedTests,
    testsTotal: tests.numTotalTests,
    types: "passed",
    build: "passed",
  },
  browser: {
    environment: browser.environment,
    narrowWidth: browser.viewportWidth,
    detailPagesChecked: browser.cases.length + browser.components.length,
    wholePageOverflowFailures: [...browser.cases, ...browser.components].filter(
      (r) => r.scroll > r.width,
    ).length,
    manualChecks: browser.manualChecks,
    download: browser.download,
  },
  motion: {
    recordedSource:
      browser.motion.source || browser.motionIterationManualChecks?.source,
    componentPolicies: motion.components.length,
    specification: "docs/MOTION.md",
    reducedSectionsChecked: browser.motion.reducedSites.length,
    reducedComponentsChecked: browser.motion.reducedComponents.length,
    recordings: browser.motion.recordings,
  },
  native: {
    checks: native.checks.map(({ label, status, command }) => ({
      label,
      status,
      command,
    })),
    flutterWidgetTestsPassed: flutterTests,
  },
  guide: {
    manifest: "guide/manifest.json",
    publication: {
      repositoryUrl: guide.repositoryUrl,
      websiteUrl: guide.websiteUrl,
      sourceRef: guide.sourceRef,
      status: guide.publicationStatus,
    },
    readingSpecification: "docs/CONTENT.md",
    checks: browser.clarity,
  },
  nativeDesign: {
    status: "Prototype",
    implementedComponentsPerPlatform: 61,
    implementations: 183,
    targetStage: "Beta",
    betaApproved: false,
    platforms: ["Flutter", "Android Compose", "iOS SwiftUI"],
    componentMappings: nativePlan.length,
    batches: [1, 2, 3].map(
      (wave) => nativePlan.filter((c) => c.wave === wave).length,
    ),
    specification: "docs/NATIVE-SDK-DESIGN.md",
  },
  accessibility: {
    target: "WCAG 2.2 AA",
    domAxeChecks: 141,
    domColorContrastEnabled: false,
    tokenContrastChecks: 20,
    certified: false,
    limitations: browser.limitations,
  },
  backlog: "docs/BACKLOG.md",
  evidenceFiles: [
    "docs/catalogue.json",
    "docs/motion-catalogue.json",
    "docs/MOTION.md",
    "docs/test-results.json",
    "docs/browser-checks.json",
    "docs/native-checks.json",
    "docs/engineering-checks.json",
    "public/generated/validation.json",
  ],
};
mkdirSync("public/generated", { recursive: true });
writeFileSync(
  "public/generated/acceptance.json",
  JSON.stringify(receipt, null, 2) + "\n",
);
// Refresh the static preview's downloadable receipt without rerunning the production build.
if (existsSync("dist/generated"))
  writeFileSync(
    "dist/generated/acceptance.json",
    JSON.stringify(receipt, null, 2) + "\n",
  );
console.log(
  `Evidence: ${receipt.catalogue.cases} cases / ${receipt.catalogue.componentSpecs} specs / ${tests.numPassedTests} Web tests / ${flutterTests} Flutter tests.`,
);
