#!/bin/bash
set -euo pipefail
SDK_ROOT=$(cd "$(dirname "$0")/../../.." && pwd)
BUILD_ROOT=${ROSEMARY_BUILD_ROOT:-${TMPDIR:-/tmp}/rosemary-build}/ios
ARTIFACT_ROOT=${ROSEMARY_ARTIFACT_ROOT:-${TMPDIR:-/tmp}/rosemary-artifacts}/ios
mkdir -p "$BUILD_ROOT" "$ARTIFACT_ROOT"
cd "$SDK_ROOT"
BUILD_STARTED_UTC=$(date -u +%Y-%m-%dT%H:%M:%SZ)
export ROSEMARY_IOS_BUILD_STARTED_UTC="$BUILD_STARTED_UTC"
if ! command -v xcodegen >/dev/null; then echo 'xcodegen is required to regenerate the checked-in sample project.' >&2; exit 1; fi
[[ "$(xcodegen --version)" == "Version: 2.46.0" ]] || { echo "XcodeGen 2.46.0 is required" >&2; exit 1; }
python3 platforms/swiftui/scripts/check-icons.py
xcodegen generate --spec platforms/swiftui/Sample/project.yml
python3 platforms/swiftui/scripts/normalize-project.py platforms/swiftui/Sample/RosemarySample.xcodeproj/project.pbxproj
git diff --exit-code -- platforms/swiftui/Sample/RosemarySample.xcodeproj
swift test --scratch-path "$BUILD_ROOT/swiftpm" 2>&1 | tee "$ARTIFACT_ROOT/swift-test.log"
DESTINATION=${ROSEMARY_IOS_DESTINATION:-}
if [[ -z "$DESTINATION" ]]; then
  DEVICE_ID=$(xcrun simctl list devices available --json | python3 -c 'import json,sys; d=json.load(sys.stdin)["devices"]; print(next(x["udid"] for runtime,items in d.items() if "iOS" in runtime for x in items if x["name"].startswith("iPhone")))')
  DESTINATION="platform=iOS Simulator,id=$DEVICE_ID"
fi
RESULT="$BUILD_ROOT/Results-$(date +%Y%m%d-%H%M%S).xcresult"
TEST_STATUS=0
xcodebuild -project platforms/swiftui/Sample/RosemarySample.xcodeproj -scheme RosemarySample -parallel-testing-enabled NO -destination "$DESTINATION" -derivedDataPath "$BUILD_ROOT/sample" -resultBundlePath "$RESULT" test CODE_SIGNING_ALLOWED=NO 2>&1 | tee "$ARTIFACT_ROOT/xcode-test.log" || TEST_STATUS=$?
if [[ -d "$RESULT" ]]; then cp -R "$RESULT" "$ARTIFACT_ROOT/"; fi
APP="$BUILD_ROOT/sample/Build/Products/Debug-iphonesimulator/RosemarySample.app"
if [[ -f "$APP/RosemarySample" ]]; then ditto -c -k --keepParent "$APP" "$ARTIFACT_ROOT/RosemarySample-0.4.0-simulator.zip"; fi
tar --exclude='*.xcuserstate' --exclude='xcuserdata' -czf "$ARTIFACT_ROOT/RosemaryUI-0.4.0-source.tar.gz" Package.swift LICENSE BRAND-ASSETS.md platforms/swiftui .github/workflows/sdk-swiftui.yml

# Consume the actual distribution archive in an unrelated directory; no repository fallback.
CONSUMER_ROOT=$(mktemp -d "$BUILD_ROOT/archive-consumer.XXXXXX")
tar -xzf "$ARTIFACT_ROOT/RosemaryUI-0.4.0-source.tar.gz" -C "$CONSUMER_ROOT"
ARCHIVE_PACKAGE_STATUS=0
swift test --package-path "$CONSUMER_ROOT" --scratch-path "$BUILD_ROOT/archive-swiftpm" 2>&1 | tee "$ARTIFACT_ROOT/archive-swift-test.log" || ARCHIVE_PACKAGE_STATUS=$?
ARCHIVE_SAMPLE_STATUS=0
xcodebuild -project "$CONSUMER_ROOT/platforms/swiftui/Sample/RosemarySample.xcodeproj" -scheme RosemarySample -destination 'generic/platform=iOS Simulator' -derivedDataPath "$BUILD_ROOT/archive-sample" build CODE_SIGNING_ALLOWED=NO 2>&1 | tee "$ARTIFACT_ROOT/archive-sample-build.log" || ARCHIVE_SAMPLE_STATUS=$?

{
  xcodebuild -version
  swift --version
  xcodegen --version
  echo "Simulator destination: $DESTINATION"
  echo "Build started UTC: $BUILD_STARTED_UTC"
  echo "Git HEAD: $(git rev-parse HEAD)"
  echo "Git dirty status (empty means clean):"
  git status --porcelain
  echo "CI source SHA: ${GITHUB_SHA:-local workingtree}; run: ${GITHUB_RUN_ID:-local}"
  echo 'Deployment minimum: iOS 17.0. Installed simulator runtimes above this minimum do not establish actual iOS 17 runtime coverage.'
  echo 'Simulator app only: unsigned, not a device IPA.'
  echo "Archive consumer: package=$ARCHIVE_PACKAGE_STATUS, simulator sample=$ARCHIVE_SAMPLE_STATUS"
  echo "xcodebuild test exit status: $TEST_STATUS. The xcresult and log determine whether assertions executed."
  echo 'Manual VoiceOver, external keyboard and device tests are not established by this script.'
} > "$ARTIFACT_ROOT/ENVIRONMENT.txt"
python3 - "$SDK_ROOT" "$ARTIFACT_ROOT" "$TEST_STATUS" "$ARCHIVE_PACKAGE_STATUS" "$ARCHIVE_SAMPLE_STATUS" <<'PY_PROVENANCE'
import hashlib, json, os, pathlib, subprocess, sys
root, out = map(pathlib.Path, sys.argv[1:3])
paths = [root/'Package.swift', root/'LICENSE', root/'BRAND-ASSETS.md', root/'.github/workflows/sdk-swiftui.yml']
paths += sorted(p for p in (root/'platforms/swiftui').rglob('*') if p.is_file() and 'xcuserdata' not in p.parts and p.suffix != '.xcuserstate')
inputs = {str(p.relative_to(root)): hashlib.sha256(p.read_bytes()).hexdigest() for p in paths}
dirty = subprocess.check_output(['git', 'status', '--porcelain'], cwd=root, text=True).splitlines()
record = {'gitHead': subprocess.check_output(['git','rev-parse','HEAD'],cwd=root,text=True).strip(),
          'dirty': bool(dirty), 'dirtyDescription': dirty, 'inputOrigin': 'workingtree' if dirty else 'git checkout',
          'buildStartedUTC': os.environ['ROSEMARY_IOS_BUILD_STARTED_UTC'], 'githubSHA': os.getenv('GITHUB_SHA'),
          'githubRunID': os.getenv('GITHUB_RUN_ID'), 'testExitStatus': int(sys.argv[3]),
          'archiveConsumerExitStatus': {'swiftPackage': int(sys.argv[4]), 'simulatorSample': int(sys.argv[5])},
          'projectGenerator': {'version': '2.46.0', 'normalizedRootPackageReference': True, 'committedProjectExactMatch': True},
          'sourceInputSHA256': inputs,
          'artifacts': {p.name: hashlib.sha256(p.read_bytes()).hexdigest() for p in out.glob('*') if p.is_file() and p.suffix in ['.zip','.gz']}}
(out/'provenance.json').write_text(json.dumps(record,indent=2)+'\n')
PY_PROVENANCE
cd "$ARTIFACT_ROOT"
shasum -a 256 RosemaryUI-0.4.0-source.tar.gz > SHA256SUMS
if [[ -f RosemarySample-0.4.0-simulator.zip ]]; then shasum -a 256 RosemarySample-0.4.0-simulator.zip >> SHA256SUMS; fi
shasum -a 256 -c SHA256SUMS
if [[ "$TEST_STATUS" != 0 ]]; then exit "$TEST_STATUS"; fi
if [[ "$ARCHIVE_PACKAGE_STATUS" != 0 ]]; then exit "$ARCHIVE_PACKAGE_STATUS"; fi
exit "$ARCHIVE_SAMPLE_STATUS"
