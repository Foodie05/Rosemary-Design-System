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
  func testDisclosureUsesPortalCurveSamplesAndInterruptionEndpoints() {
    for opening in [true, false] {
      let curve = RosemaryDisclosureAnimation(opening: opening)
      let points =
        opening ? RosemaryInteraction.disclosureEnter : RosemaryInteraction.disclosureExit
      for i in 0...40 {
        XCTAssertEqual(curve.progress(Double(i) / 40), points[i], accuracy: 0.000001)
      }
      XCTAssertGreaterThan(curve.progress(0.25), 0.3)
      XCTAssertEqual(curve.progress(-1), 0)
      XCTAssertEqual(curve.progress(2), 1)
    }
  }

}
