#!/usr/bin/env bash
set -euo pipefail
cd "$(dirname "$0")/.."
: "${ROSEMARY_BUILD_ROOT:=$PWD/build}"
: "${ROSEMARY_ARTIFACT_ROOT:=$PWD/artifacts}"
export ROSEMARY_BUILD_ROOT ROSEMARY_ARTIFACT_ROOT
mkdir -p "$ROSEMARY_ARTIFACT_ROOT/android/evidence"
mode="${1:-library}"
trap 'result=$?; if [ "$result" -eq 0 ]; then outcome=passed; else outcome=failed; fi; python3 scripts/evidence.py "$mode" "$outcome"; exit "$result"' EXIT
case "$mode" in
 library) ./gradlew :rosemary-compose:assembleRelease :rosemary-compose:testDebugUnitTest :rosemary-compose:lint :rosemary-compose:localMavenZip --console=plain | tee "$ROSEMARY_ARTIFACT_ROOT/android/evidence/library.log" ;;
 consumer) ./gradlew :sample:assembleDebug :sample:lint --console=plain | tee "$ROSEMARY_ARTIFACT_ROOT/android/evidence/consumer.log"
  cp "$ROSEMARY_BUILD_ROOT/android/sample/outputs/apk/debug/sample-debug.apk" "$ROSEMARY_ARTIFACT_ROOT/android/rosemary-compose-sample-0.4.0.apk" ;;
 device) ./gradlew :rosemary-compose:connectedDebugAndroidTest :sample:connectedDebugAndroidTest --console=plain | tee "$ROSEMARY_ARTIFACT_ROOT/android/evidence/device.log" ;;
 *) echo "Usage: $0 library|consumer|device" >&2; exit 2 ;;
esac
