import { spawnSync } from "node:child_process";
import { existsSync, mkdirSync, writeFileSync } from "node:fs";
import { sourceFingerprint, nativeFingerprint } from "./evidence-source.mjs";
const env = { ...process.env };
if (!env.JAVA_HOME && existsSync("/opt/homebrew/opt/openjdk@21"))
  env.JAVA_HOME = "/opt/homebrew/opt/openjdk@21";
if (!env.ANDROID_HOME && existsSync("/Volumes/Apps/Library/Android/sdk"))
  env.ANDROID_HOME = "/Volumes/Apps/Library/Android/sdk";
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
    command: [command, ...args].join(" "),
    cwd,
    status,
    exitCode: result.status,
    output: ((result.stdout || "") + (result.stderr || "")).trim(),
    error: result.error?.message,
  };
};
const flutter = env.FLUTTER_BIN || "flutter";
const gradle = env.GRADLE_BIN || "./gradlew";
const checks = [
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
    "SwiftUI iOS Simulator app",
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
      "build",
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
      [":rosemary-compose:connectedDebugAndroidTest", "--write-locks"],
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
mkdirSync("docs", { recursive: true });
writeFileSync(
  "docs/native-checks.json",
  JSON.stringify(
    {
      checkedAt: new Date().toISOString(),
      source: sourceFingerprint(),
      nativeSource: nativeFingerprint(),
      status: "Prototype",
      firstWaveComponentsPerPlatform: 14,
      betaApproved: false,
      checks,
      blockedChecks: [
        {
          label: "SwiftUI Simulator workflow execution",
          status: "blocked",
          attempts: ["iOS 26.5", "iOS 27.0"],
          reason:
            "Xcode 27 could not connect to com.apple.instruments.deviceservice.lockdown: DTServiceHubClient failed to bless service hub. Test code compiled; no successful iOS UI execution.",
          source: "docs/native/ios-swiftui.md",
        },
      ],
      limitations: [
        "No real-device or manual VoiceOver/TalkBack acceptance.",
        "Not all Dynamic Type, RTL, keyboard, lifecycle, long-list and dismissal-reason gates are complete.",
        "Later 47 components remain Draft. SDKs are local, unpublished Prototype packages.",
        "Unavailable or failed checks are not passing evidence.",
      ],
    },
    null,
    2,
  ) + "\n",
);
if (checks.some((c) => c.status !== "passed")) process.exitCode = 1;
