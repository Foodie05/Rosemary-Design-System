import { execFileSync } from "node:child_process";
import { createHash } from "node:crypto";
import { createReadStream } from "node:fs";
import {
  mkdir,
  readdir,
  readFile,
  copyFile,
  writeFile,
  open,
} from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

export const releaseWorkflows = [
  {
    workflow: "sdk-web.yml",
    kind: "web",
    artifacts: ["rosemary-sdk-web-0.4.1"],
  },
  {
    workflow: "sdk-android.yml",
    kind: "android",
    artifacts: ["rosemary-compose-0.4.1-api26", "rosemary-compose-0.4.1-api36"],
  },
  {
    workflow: "sdk-swiftui.yml",
    kind: "swift",
    artifacts: ["rosemary-swiftui-0.4.1"],
  },
  {
    workflow: "sdk-flutter.yml",
    kind: "flutter",
    artifacts: [
      "rosemary-flutter-0.4.1-linux-web-android",
      "rosemary-flutter-0.4.1-macos-ios",
      "rosemary-flutter-0.4.1-windows",
    ],
  },
];
function requireThat(condition, message) {
  if (!condition) throw new Error(message);
}
export function selectRun(runs, head, workflow) {
  const matching = runs.filter(
    (r) =>
      r.head_sha === head &&
      r.head_branch === "main" &&
      ["push", "workflow_dispatch"].includes(r.event),
  );
  matching.sort((a, b) => Date.parse(b.created_at) - Date.parse(a.created_at));
  const run = matching[0];
  requireThat(
    run?.status === "completed" && run.conclusion === "success",
    `${workflow}: latest exact-main run is missing, incomplete or unsuccessful`,
  );
  return run;
}
export function validateProvenance(record, kind, head) {
  const source = kind === "swift" ? record.gitHead : record.head;
  requireThat(
    source === head,
    `${kind}: provenance source differs from final main HEAD`,
  );
  const dirty = kind === "swift" ? record.dirty : record.dirtyWorkingTree;
  requireThat(
    dirty === false,
    `${kind}: source provenance must explicitly be clean`,
  );
  if (kind === "swift") {
    requireThat(record.testExitStatus === 0, "swift: tests did not pass");
    requireThat(
      record.archiveConsumerExitStatus?.swiftPackage === 0 &&
        record.archiveConsumerExitStatus?.simulatorSample === 0,
      "swift: archived package/sample consumer did not pass",
    );
    requireThat(
      record.projectGenerator?.version === "2.46.0" &&
        record.projectGenerator.normalizedRootPackageReference === true &&
        record.projectGenerator.committedProjectExactMatch === true,
      "swift: committed generated project exact match was not established",
    );
  }
  const githubSHA = kind === "swift" ? record.githubSHA : record.githubSha;
  requireThat(
    githubSHA === head,
    `${kind}: CI source is missing or differs from main`,
  );
}
async function sha256(file) {
  const hash = createHash("sha256");
  for await (const chunk of createReadStream(file)) hash.update(chunk);
  return hash.digest("hex");
}
function api(endpoint) {
  return JSON.parse(
    execFileSync(
      "gh",
      ["api", endpoint, "-H", "X-GitHub-Api-Version: 2026-03-10"],
      { encoding: "utf8", maxBuffer: 32 * 1024 * 1024 },
    ),
  );
}
async function filesUnder(directory) {
  const files = [];
  for (const entry of await readdir(directory, { withFileTypes: true })) {
    const file = path.join(directory, entry.name);
    requireThat(
      !entry.isSymbolicLink(),
      `Unexpected evidence symlink: ${file}`,
    );
    if (entry.isDirectory()) files.push(...(await filesUnder(file)));
    else if (entry.isFile()) files.push(file);
  }
  return files;
}
function findOne(files, name) {
  const matches = files.filter((file) => path.basename(file) === name);
  requireThat(
    matches.length === 1,
    `Expected exactly one ${name}, received ${matches.length}`,
  );
  return matches[0];
}
async function readJSON(files, name) {
  return JSON.parse(await readFile(findOne(files, name), "utf8"));
}
async function validateDigests(files, entries) {
  for (const entry of entries) {
    const file = findOne(
      files,
      path.basename(entry.file.replaceAll("\\", "/")),
    );
    requireThat(
      (await sha256(file)) === entry.sha256,
      `Consumer/provenance digest differs: ${entry.file}`,
    );
  }
}
const extractScript = `import pathlib,stat,sys,zipfile
archive,target=map(pathlib.Path,sys.argv[1:])
with zipfile.ZipFile(archive) as source:
 for member in source.infolist():
  name=pathlib.PurePosixPath(member.filename)
  if name.is_absolute() or '..' in name.parts or '\\\\' in member.filename or stat.S_ISLNK(member.external_attr >> 16): raise ValueError('Unsafe archive member')
 source.extractall(target)
`;
async function validateEvidence(files, kind, head, artifactName) {
  if (kind === "web") {
    for (const version of ["18.3.1", "19.2.8"]) {
      const consumer = await readJSON(
        files,
        `consumer-${version}-evidence.json`,
      );
      for (const key of [
        "typecheck",
        "ssrAndControlledInteractions",
        "cssAndBrandAssets",
      ])
        requireThat(
          consumer[key] === "passed",
          `React ${version}: ${key} did not pass`,
        );
      await validateDigests(files, consumer.packages);
    }
    await validateDigests(
      files,
      (await readJSON(files, "consumer-evidence.json")).packages,
    );
    const results = await readJSON(files, "browser-results.json");
    requireThat(
      results.stats?.expected > 0 &&
        results.stats.unexpected === 0 &&
        results.stats.skipped === 0 &&
        results.stats.flaky === 0,
      "Web browser evidence contains missing, failing, skipped or flaky paths",
    );
    return;
  }
  const record = await readJSON(
    files,
    kind === "swift" ? "provenance.json" : "verification.json",
  );
  validateProvenance(record, kind, head);
  if (kind !== "swift") {
    const phases =
      kind === "android"
        ? ["library", "consumer", "device"]
        : artifactName.endsWith("linux-web-android")
          ? ["test", "linux", "web", "android", "device-linux", "device"]
          : artifactName.endsWith("macos-ios")
            ? ["test", "macos", "ios", "device-macOS"]
            : ["test", "windows", "device-Windows"];
    for (const phase of phases)
      requireThat(
        record.phases?.[phase]?.result === "passed",
        `${artifactName}: missing successful ${phase} evidence`,
      );
    if (kind === "android") {
      const expectedAPI = artifactName.endsWith("api26") ? "26" : "36",
        device = record.phases.device;
      requireThat(
        String(device.device?.api) === expectedAPI,
        `${artifactName}: tested Android API mismatch`,
      );
      requireThat(
        device.testResults?.length > 0 &&
          device.testResults.every(
            (r) =>
              r.tests > 0 &&
              r.failures === 0 &&
              r.errors === 0 &&
              r.skipped === 0 &&
              !r.invalidXml,
          ),
        `${artifactName}: device XML has missing, failing or skipped tests`,
      );
      for (const result of device.testResults) {
        const matching = files.filter((f) =>
          f
            .replaceAll(path.sep, "/")
            .endsWith("/" + result.file.replaceAll("\\", "/")),
        );
        requireThat(
          matching.length === 1 &&
            (await sha256(matching[0])) === result.sha256,
          `${artifactName}: actual device XML digest mismatch`,
        );
      }
    } else
      requireThat(
        (await sha256(findOne(files, "rosemary-ui-0.4.1-source.tar.gz"))) ===
          record.sourceArchiveSha256,
        `${artifactName}: archived consumer source digest mismatch`,
      );
  }
  const entries = Array.isArray(record.artifacts)
    ? record.artifacts
    : Object.entries(record.artifacts || {}).map(([file, sha256]) => ({
        file,
        sha256,
      }));
  requireThat(entries.length > 0, `${kind}: no artifact digests recorded`);
  await validateDigests(files, entries);
}
async function main() {
  const argv = process.argv.slice(2),
    options = {};
  for (let i = 0; i < argv.length; i++) {
    if (argv[i] === "--dry-run") options.dryRun = true;
    else if (["--head", "--output", "--repo"].includes(argv[i]))
      options[argv[i].slice(2)] = argv[++i];
    else throw new Error(`Unknown argument: ${argv[i]}`);
  }
  const repo = options.repo || "Foodie05/Rosemary-Design-System",
    head = options.head;
  requireThat(/^[\w.-]+\/[\w.-]+$/.test(repo), "Expected owner/repository");
  requireThat(
    /^[a-f0-9]{40}$/.test(head || ""),
    "Pass --head with the complete reviewed final main SHA",
  );
  const base = `repos/${repo}`;
  requireThat(
    api(`${base}/commits/main`).sha === head,
    "Requested SHA is not the current main HEAD",
  );
  const selected = releaseWorkflows.map((spec) => {
    const runs = api(
      `${base}/actions/workflows/${spec.workflow}/runs?branch=main&head_sha=${head}&per_page=100`,
    ).workflow_runs;
    const run = selectRun(runs, head, spec.workflow);
    const jobs = api(
      `${base}/actions/runs/${run.id}/attempts/${run.run_attempt}/jobs?per_page=100`,
    ).jobs;
    requireThat(
      jobs.length > 0 && jobs.every((j) => j.conclusion === "success"),
      `${spec.workflow}: every job must have succeeded`,
    );
    const available = api(
      `${base}/actions/runs/${run.id}/artifacts?per_page=100`,
    ).artifacts;
    const artifacts = spec.artifacts.map((name) => {
      const found = available.filter((a) => a.name === name && !a.expired);
      requireThat(
        found.length === 1,
        `${name}: expected one unexpired artifact`,
      );
      const artifact = found[0];
      requireThat(
        artifact.workflow_run?.head_sha === head &&
          artifact.workflow_run.head_branch === "main",
        `${name}: artifact source mismatch`,
      );
      requireThat(
        /^sha256:[a-f0-9]{64}$/.test(artifact.digest || ""),
        `${name}: missing GitHub archive digest`,
      );
      return artifact;
    });
    return { ...spec, run, artifacts };
  });
  if (options.dryRun) {
    console.log(
      JSON.stringify(
        {
          repo,
          head,
          selected: selected.map(({ workflow, run, artifacts }) => ({
            workflow,
            runID: run.id,
            attempt: run.run_attempt,
            artifacts: artifacts.map((a) => ({
              name: a.name,
              id: a.id,
              digest: a.digest,
            })),
          })),
        },
        null,
        2,
      ),
    );
    return;
  }
  requireThat(
    options.output,
    "Pass --output with a new, empty assembly directory",
  );
  const output = path.resolve(options.output);
  try {
    await mkdir(output);
  } catch (error) {
    if (error.code === "EEXIST")
      throw new Error(
        "Assembly output already exists; choose a fresh directory",
      );
    throw error;
  }
  const assets = path.join(output, "assets"),
    extracted = path.join(output, "extracted");
  await mkdir(assets);
  await mkdir(extracted);
  const manifest = {
    version: "0.4.1",
    specification: "1.2.0",
    repo,
    head,
    assembledUTC: new Date().toISOString(),
    canonicalSource: { android: "api36", flutter: "linux-web-android" },
    runs: [],
    assets: [],
  };
  for (const { workflow, kind, run, artifacts } of selected) {
    const runRecord = {
      workflow,
      id: run.id,
      attempt: run.run_attempt,
      url: run.html_url,
      head,
      artifacts: [],
    };
    for (const artifact of artifacts) {
      const zipName = `evidence-${artifact.name}.zip`,
        zipFile = path.join(assets, zipName);
      const fd = await open(zipFile, "wx");
      try {
        execFileSync(
          "gh",
          [
            "api",
            `${base}/actions/artifacts/${artifact.id}/zip`,
            "-H",
            "X-GitHub-Api-Version: 2026-03-10",
          ],
          { stdio: ["ignore", fd.fd, "inherit"] },
        );
      } finally {
        await fd.close();
      }
      const digest = await sha256(zipFile);
      requireThat(
        `sha256:${digest}` === artifact.digest,
        `${artifact.name}: downloaded GitHub ZIP digest mismatch`,
      );
      const directory = path.join(extracted, artifact.name);
      await mkdir(directory);
      execFileSync(
        process.env.ROSEMARY_PYTHON || "python3",
        ["-c", extractScript, zipFile, directory],
        { stdio: "inherit" },
      );
      const files = await filesUnder(directory);
      await validateEvidence(files, kind, head, artifact.name);
      const names =
        kind === "web"
          ? [
              "rosemary-ui-tokens-0.4.1.tgz",
              "rosemary-ui-icons-0.4.1.tgz",
              "rosemary-ui-react-0.4.1.tgz",
            ]
          : kind === "swift"
            ? [
                "RosemaryUI-0.4.1-source.tar.gz",
                "RosemarySample-0.4.1-simulator.zip",
              ]
            : kind === "android" && artifact.name.endsWith("api36")
              ? [
                  "rosemary-compose-0.4.1-maven.zip",
                  "rosemary-compose-0.4.1.aar",
                  "rosemary-compose-0.4.1-sources.jar",
                  "rosemary-compose-sample-0.4.1.apk",
                ]
              : kind === "flutter"
                ? artifact.name.endsWith("linux-web-android")
                  ? [
                      "rosemary-ui-0.4.1-source.tar.gz",
                      "rosemary-flutter-0.4.1-linux.tar.gz",
                      "rosemary-flutter-0.4.1-web.zip",
                      "rosemary-flutter-0.4.1-android.apk",
                    ]
                  : artifact.name.endsWith("macos-ios")
                    ? [
                        "rosemary-flutter-0.4.1-macos.zip",
                        "rosemary-flutter-0.4.1-ios-simulator.zip",
                      ]
                    : ["rosemary-flutter-0.4.1-windows.zip"]
                : [];
      const packageDigests = [];
      for (const file of files.filter((f) =>
        /\.(tgz|aar|jar|apk|zip|tar\.gz)$/.test(f),
      ))
        packageDigests.push({
          path: path.relative(directory, file).replaceAll(path.sep, "/"),
          sha256: await sha256(file),
        });
      for (const name of names) {
        const file = findOne(files, name);
        await copyFile(file, path.join(assets, name));
        manifest.assets.push({
          name,
          sha256: await sha256(file),
          artifactID: artifact.id,
          runID: run.id,
        });
      }
      manifest.assets.push({
        name: zipName,
        sha256: digest,
        artifactID: artifact.id,
        runID: run.id,
      });
      runRecord.artifacts.push({
        id: artifact.id,
        name: artifact.name,
        githubDigest: artifact.digest,
        packages: packageDigests,
      });
    }
    manifest.runs.push(runRecord);
  }
  // Reject main moving during a long download; a new commit needs fresh CI.
  requireThat(
    api(`${base}/commits/main`).sha === head,
    "main changed during assembly; do not release these assets as its latest HEAD",
  );
  await writeFile(
    path.join(assets, "release-manifest.json"),
    JSON.stringify(manifest, null, 2) + "\n",
  );
  const names = (await readdir(assets)).sort();
  await writeFile(
    path.join(assets, "SHA256SUMS"),
    (
      await Promise.all(
        names.map(
          async (name) => `${await sha256(path.join(assets, name))}  ${name}`,
        ),
      )
    ).join("\n") + "\n",
  );
  await writeFile(path.join(output, "READY"), `${head}\n`);
  console.log(
    `Verified assembly: ${assets}\nNo Git tag or GitHub Release was created.`,
  );
}
if (
  process.argv[1] &&
  path.resolve(process.argv[1]) === fileURLToPath(import.meta.url)
)
  main().catch((error) => {
    console.error(error.message);
    process.exitCode = 1;
  });
