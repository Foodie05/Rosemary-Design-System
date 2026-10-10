import XCTest

@testable import RosemaryUI

final class ProjectDraftTests: XCTestCase {
  func testCancelKeepsSavedName() {
    var d = ProjectDraft()
    d.edit("Changed")
    d.cancel()
    XCTAssertEqual(d.name, "Rosemary Notes")
  }
  func testFailureKeepsDraftAndRetryCommits() {
    var d = ProjectDraft()
    d.edit("Changed")
    XCTAssertTrue(d.beginSave())
    d.complete(success: false, operation: d.saveOperation!)
    XCTAssertEqual(d.name, "Changed")
    XCTAssertNotNil(d.error)
    XCTAssertTrue(d.beginSave())
    d.complete(success: true, operation: d.saveOperation!)
    XCTAssertEqual(d.savedName, "Changed")
  }
  func testCompletionUsesSubmittedSnapshot() {
    var d = ProjectDraft(name: "A")
    XCTAssertTrue(d.beginSave())
    let operation = d.saveOperation!
    d.edit("B")
    XCTAssertTrue(d.complete(success: true, operation: operation))
    XCTAssertEqual(d.savedName, "A")
    XCTAssertEqual(d.name, "B")
  }
  func testCancelledOperationCannotCompleteNewSave() {
    var d = ProjectDraft(name: "A")
    d.beginSave()
    let old = d.saveOperation!
    d.cancel()
    XCTAssertFalse(d.busy)
    d.edit("B")
    d.beginSave()
    let current = d.saveOperation!
    XCTAssertFalse(d.complete(success: true, operation: old))
    XCTAssertTrue(d.busy)
    XCTAssertTrue(d.complete(success: true, operation: current))
    XCTAssertEqual(d.savedName, "B")
  }
  func testBlankAndDuplicateSubmission() {
    var d = ProjectDraft()
    d.edit(" ")
    XCTAssertFalse(d.beginSave())
    d.edit("Valid")
    XCTAssertTrue(d.beginSave())
    XCTAssertFalse(d.beginSave())
  }
}
