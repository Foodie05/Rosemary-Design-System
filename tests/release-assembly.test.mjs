import test from "node:test";
import assert from "node:assert/strict";
import {
  selectRun,
  validateProvenance,
} from "../scripts/assemble-sdk-release.mjs";
const head = "a".repeat(40);
const success = {
  id: 1,
  head_sha: head,
  head_branch: "main",
  event: "workflow_dispatch",
  created_at: "2026-10-13T00:00:00Z",
  status: "completed",
  conclusion: "success",
};
test("release selection refuses PR evidence, another SHA and a newer failed/incomplete run", () => {
  assert.equal(selectRun([success], head, "fixture").id, 1);
  for (const invalid of [
    { ...success, event: "pull_request" },
    { ...success, head_sha: "b".repeat(40) },
    { ...success, head_branch: "codex/sdk-0.4.0" },
  ])
    assert.throws(() => selectRun([invalid], head, "fixture"));
  for (const conclusion of ["failure", "cancelled", null])
    assert.throws(() =>
      selectRun(
        [
          success,
          {
            ...success,
            id: 2,
            created_at: "2026-10-13T01:00:00Z",
            conclusion,
            status: conclusion ? "completed" : "in_progress",
          },
        ],
        head,
        "fixture",
      ),
    );
});
test("native records must explicitly identify a clean exact source and CI SHA", () => {
  for (const kind of ["android", "flutter"]) {
    const record = { head, dirtyWorkingTree: false, githubSha: head };
    assert.doesNotThrow(() => validateProvenance(record, kind, head));
    for (const invalid of [
      { ...record, dirtyWorkingTree: true },
      { ...record, dirtyWorkingTree: undefined },
      { ...record, head: "b".repeat(40) },
      { ...record, githubSha: "b".repeat(40) },
    ])
      assert.throws(() => validateProvenance(invalid, kind, head));
  }
});
test("Swift release evidence requires actual tests, extracted consumers and exact normalized project", () => {
  const record = {
    gitHead: head,
    dirty: false,
    githubSHA: head,
    testExitStatus: 0,
    archiveConsumerExitStatus: { swiftPackage: 0, simulatorSample: 0 },
    projectGenerator: {
      version: "2.46.0",
      normalizedRootPackageReference: true,
      committedProjectExactMatch: true,
    },
  };
  assert.doesNotThrow(() => validateProvenance(record, "swift", head));
  for (const invalid of [
    { ...record, dirty: true },
    { ...record, testExitStatus: 1 },
    {
      ...record,
      archiveConsumerExitStatus: { swiftPackage: 0, simulatorSample: 1 },
    },
    {
      ...record,
      projectGenerator: {
        ...record.projectGenerator,
        committedProjectExactMatch: false,
      },
    },
  ])
    assert.throws(() => validateProvenance(invalid, "swift", head));
});
