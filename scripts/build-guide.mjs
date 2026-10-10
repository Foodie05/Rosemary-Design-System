import { NATIVE_COMPONENT_PLAN } from "../src/data/nativeLibraries.ts";
import {
  readFileSync,
  writeFileSync,
  mkdirSync,
  existsSync,
  copyFileSync,
} from "node:fs";
const publication = JSON.parse(readFileSync("publication.json", "utf8"));
for (const key of ["repositoryUrl", "websiteUrl"]) {
  const value = publication[key];
  if (value !== null) {
    const url = new URL(value);
    if (url.protocol !== "https:" || url.username || url.password)
      throw Error(`Invalid publication ${key}`);
  }
}
mkdirSync("public/guide", { recursive: true });
const documents = [
  ["ai-integration", "docs/AI-INTEGRATION.md", "#/ai-guide"],
  ["content", "docs/CONTENT.md", "#/content?anchor=content-clarity"],
  ["motion", "docs/MOTION.md", "#/foundations?anchor=foundations-motion"],
  [
    "agents-reference",
    "docs/AGENTS.template.md",
    "#/ai-guide?anchor=project-integration",
  ],
];
if (existsSync("docs/NATIVE-SDK-DESIGN.md"))
  documents.push([
    "native-sdk-design",
    "docs/NATIVE-SDK-DESIGN.md",
    "#/platforms?anchor=native-libraries",
  ]);
for (const document of ["flutter-sdk", "android-compose", "ios-swiftui"])
  documents.push([
    document,
    `docs/native/${document}.md`,
    "#/platforms?anchor=native-libraries",
  ]);
writeFileSync(
  "public/guide/native-component-plan.json",
  JSON.stringify(
    {
      status: "Prototype",
      implementedFirstWave: 14,
      betaApproved: false,
      components: NATIVE_COMPONENT_PLAN,
    },
    null,
    2,
  ) + "\n",
);
for (const [id, file] of documents) {
  const content = readFileSync(file, "utf8")
    .replaceAll("(../native-checks.json)", "(native-checks.json)")
    .replaceAll("(../NATIVE-SDK-DESIGN.md)", "(native-sdk-design.md)");
  writeFileSync(`public/guide/${id}.md`, content);
}
if (existsSync("docs/native-checks.json"))
  copyFileSync("docs/native-checks.json", "public/guide/native-checks.json");
const catalogue = JSON.parse(readFileSync("docs/catalogue.json", "utf8"));
copyFileSync("docs/catalogue.json", "public/guide/catalogue.json");
const manifest = {
  ...publication,
  publicationStatus:
    publication.repositoryUrl && publication.websiteUrl && publication.sourceRef
      ? "configured"
      : "unconfigured",
  entry: "ai-integration.md",
  documents: documents.map(([id, source, route]) => ({
    id,
    source,
    file: `${id}.md`,
    route,
  })),
  catalogue: "catalogue.json",
  nativeComponentPlan: "native-component-plan.json",
  tokens: "../generated/rosemary.tokens.json",
  validation: "../generated/validation.json",
  acceptance: "../generated/acceptance.json",
  componentCount: catalogue.components.length,
  caseCount: catalogue.cases.length,
};
writeFileSync(
  "public/guide/manifest.json",
  JSON.stringify(manifest, null, 2) + "\n",
);
console.log(
  `Guide: ${documents.length} readable documents; ${manifest.publicationStatus} publication slots.`,
);
