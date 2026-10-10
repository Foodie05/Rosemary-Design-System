import { spawnSync } from "node:child_process";
import { existsSync, mkdirSync, writeFileSync } from "node:fs";
import { sourceFingerprint, nativeFingerprint } from "./evidence-source.mjs";
const env = { ...process.env };
if (!env.JAVA_HOME && existsSync("/opt/homebrew/opt/openjdk@21"))
  env.JAVA_HOME = "/opt/homebrew/opt/openjdk@21";
if (!env.ANDROID_HOME && existsSync("/Volumes/Apps/Library/Android/sdk"))
  env.ANDROID_HOME = "/Volumes/Apps/Library/Android/sdk";
const redactHostPaths = (value) =>
  value
    .replaceAll(process.cwd(), "[workspace]")
    .replaceAll(process.env.HOME || "/Users/studio", "[home]");
const run = (label, command, args, cwd = ".") => {
  const result = spawnSync(command, args, {
    cwd,
    env,
    encoding: "utf8",
    timeout: 240000,
    maxBuffer: 32 * 1024 * 1024,
  });
  const status =
    result.error?.code === "ENOENT"
      ? "unavailable"
      : result.status === 0 && !result.error
        ? "passed"
        : "failed";
  console.log(`${label}: ${status}`);
  return {
    label,
    command: redactHostPaths([command, ...args].join(" ")),
    cwd,
    status,
    exitCode: result.status,
    output: redactHostPaths(
      ((result.stdout || "") + (result.stderr || "")).trim(),
    ),
    error: result.error?.message
      ? redactHostPaths(result.error.message)
      : undefined,
  };
};
const flutter = env.FLUTTER_BIN || "flutter";
const gradle = env.GRADLE_BIN || "./gradlew";
const coverage = run("All 61 APIs and host examples", process.execPath, [
  "--import",
  "tsx",
  "scripts/check-native-coverage.mts",
]);
const sourceAtStart = sourceFingerprint();
const nativeAtStart = nativeFingerprint();
const checks = [
  coverage,
  run("Flutter version", flutter, ["--version"]),
  run("Flutter analyze", flutter, ["analyze"], "platforms/flutter"),
  run(
    "Flutter widget tests",
    flutter,
    ["test", "--machine"],
    "platforms/flutter",
  ),
  run(
    "Flutter sample workflow",
    flutter,
    ["test", "--machine"],
    "platforms/flutter/example",
  ),
  run(
    "Flutter iOS Simulator app",
    flutter,
    ["build", "ios", "--simulator", "--no-codesign"],
    "platforms/flutter/example",
  ),
  run(
    "Flutter Android app",
    flutter,
    ["build", "apk", "--debug"],
    "platforms/flutter/example",
  ),
  run("Swift version", "swift", ["--version"]),
  run("Swift package tests", "swift", [
    "test",
    "--package-path",
    "platforms/swiftui",
  ]),
  run(
    "SwiftUI iOS app and UI test compilation",
    "xcodebuild",
    [
      "-project",
      "RosemarySample.xcodeproj",
      "-scheme",
      "RosemarySample",
      "-destination",
      "generic/platform=iOS Simulator",
      "-derivedDataPath",
      "build",
      "CODE_SIGNING_ALLOWED=NO",
      "build-for-testing",
    ],
    "platforms/swiftui/Sample",
  ),
  run(
    "Compose AAR, sample APK and unit tests",
    gradle,
    [
      ":rosemary-compose:testDebugUnitTest",
      ":rosemary-compose:assembleDebug",
      ":sample:assembleDebug",
      "--write-locks",
    ],
    "platforms/android",
  ),
];
if (env.NATIVE_ANDROID_DEVICE) {
  env.ANDROID_SERIAL = env.NATIVE_ANDROID_DEVICE;
  checks.push(
    run(
      "Compose device UI tests",
      gradle,
      [
        ":rosemary-compose:connectedDebugAndroidTest",
        ":sample:connectedDebugAndroidTest",
        "--write-locks",
      ],
      "platforms/android",
    ),
  );
}
if (env.NATIVE_IOS_DEVICE)
  checks.push(
    run(
      "SwiftUI device workflow tests",
      "xcodebuild",
      [
        "-project",
        "RosemarySample.xcodeproj",
        "-scheme",
        "RosemarySample",
        "-destination",
        `id=${env.NATIVE_IOS_DEVICE}`,
        "-derivedDataPath",
        "build",
        "CODE_SIGNING_ALLOWED=NO",
        "test",
      ],
      "platforms/swiftui/Sample",
    ),
  );
for (const [platform, device] of [
  ["Android", env.NATIVE_FLUTTER_ANDROID_DEVICE],
  ["iOS", env.NATIVE_FLUTTER_IOS_DEVICE],
]) {
  if (device)
    checks.push(
      run(
        `Flutter ${platform} engine gallery integration`,
        flutter,
        ["test", "integration_test/gallery_test.dart", "-d", device],
        "platforms/flutter/example",
      ),
    );
}
const sourceAtEnd = sourceFingerprint(),
  nativeAtEnd = nativeFingerprint();
const sourceUnchanged = sourceAtStart.sha256 === sourceAtEnd.sha256;
const nativeUnchanged = nativeAtStart.sha256 === nativeAtEnd.sha256;
if (!sourceUnchanged || !nativeUnchanged)
  checks.push({
    label: "Source stayed unchanged during checks",
    status: "failed",
    output: "Source changed while checks ran; repeat on the final snapshot.",
  });
const unexecutedChecks = [];
if (!env.NATIVE_IOS_DEVICE)
  unexecutedChecks.push({
    label: "SwiftUI iOS UI execution",
    status: "not-run",
    reason:
      env.NATIVE_IOS_BLOCK_REASON ||
      "No NATIVE_IOS_DEVICE supplied. Compilation is a separate check.",
  });
if (!env.NATIVE_ANDROID_DEVICE)
  unexecutedChecks.push({
    label: "Compose device UI and gallery",
    status: "not-run",
  });
for (const [platform, device] of [
  ["Android", env.NATIVE_FLUTTER_ANDROID_DEVICE],
  ["iOS", env.NATIVE_FLUTTER_IOS_DEVICE],
]) {
  if (!device)
    unexecutedChecks.push({
      label: `Flutter ${platform} engine gallery integration`,
      status: "not-run",
    });
}
const iosFailure = checks.find(
  (c) => c.label === "SwiftUI device workflow tests" && c.status !== "passed",
);
const blockedChecks = [];
if (
  iosFailure &&
  /DTServiceHub|deviceservice.lockdown/.test(iosFailure.output)
) {
  blockedChecks.push({
    label: iosFailure.label,
    status: "blocked",
    reason:
      "Xcode could not connect to its device service; no successful UI execution.",
    output: iosFailure.output,
  });
}
mkdirSync("docs", { recursive: true });
writeFileSync(
  "docs/native-checks.json",
  JSON.stringify(
    {
      schemaVersion: 2,
      checkedAt: new Date().toISOString(),
      version: "0.3.0-prototype.2",
      source: sourceAtEnd,
      nativeSource: nativeAtEnd,
      sourceAtStart,
      nativeAtStart,
      sourceUnchanged,
      nativeUnchanged,
      status: "Prototype",
      targetStage: "Beta",
      implementedComponentsPerPlatform: 61,
      implementations: 183,
      engineeringPassed: checks.every((c) => c.status === "passed"),
      betaApproved: false,
      checks,
      blockedChecks,
      unexecutedChecks,
      manualAcceptance: {
        status: "not-run",
        paths: [
          "Flutter iOS VoiceOver",
          "Flutter Android TalkBack",
          "SwiftUI iOS VoiceOver",
          "Compose Android TalkBack",
        ],
        source: "docs/native/manual-acceptance.md",
      },
      limitations: [
        "Real-device and manual screen reader acceptance is pending.",
        "Initial layout matrices do not replace complete interaction and OS/device coverage.",
        "SwiftPM macOS tests and UI compilation are not iOS UI execution.",
        "Unavailable, failed, blocked and unexecuted checks are not passing evidence.",
      ],
    },
    null,
    2,
  ) + "\n",
);
if (checks.some((c) => c.status !== "passed")) process.exitCode = 1;
