import XCTest

@testable import RosemaryUI

final class FieldValidationTests: XCTestCase {
  func testFirstBlurClearAndComposition() {
    var state = RosemaryFieldValidationState()
    state.blur("abc")
    XCTAssertFalse(state.armed)
    state.focus()
    state.edit("abc")
    XCTAssertFalse(state.armed)
    state.blur("abc", isComposing: true)
    XCTAssertFalse(state.armed)
    state.focus()
    state.blur("abc")
    XCTAssertTrue(state.armed)
    state.edit("")
    XCTAssertFalse(state.armed)
    state.edit("abc12345")
    XCTAssertFalse(state.armed)
    state.focus()
    state.blur("abc12345")
    XCTAssertTrue(state.armed)
    XCTAssertTrue(RosemaryFieldRequirement.password().allSatisfy { $0.check("abcdefg!") })
  }
}
