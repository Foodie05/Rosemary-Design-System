import XCTest

@testable import RosemaryUI

final class ExtendedStateTests: XCTestCase {
  func testGridFiltersAndBounds() {
    let cfg = RosemaryGridConfiguration(widths: ["name": 999], filters: ["name": "9", "kind": "A"])
    let rows = (0..<100).map {
      RosemaryRecord("r\($0)", ["name": "项目 \($0)", "kind": $0 % 2 == 0 ? "A" : "B"])
    }
    XCTAssertEqual(cfg.visible(rows).map(\.id), ["r90", "r92", "r94", "r96", "r98"])
    XCTAssertEqual(cfg.width("name"), 480)
    cfg.widths["name"] = -100
    XCTAssertEqual(cfg.width("name"), 96)
  }
  func testTreeVisibilityKeepsParentAndDepth() {
    let roots = [RosemaryTreeNode("a", "项目", children: [RosemaryTreeNode("b", "笔记")])]
    XCTAssertEqual(rosemaryVisibleTree(roots, []).map(\.node.id), ["a"])
    let entries = rosemaryVisibleTree(roots, ["a"])
    XCTAssertEqual(entries.map(\.node.id), ["a", "b"])
    XCTAssertEqual(entries[1].parent, "a")
    XCTAssertEqual(entries[1].depth, 1)
  }
  func testModalIdentityAndOneResult() {
    var session = RosemaryModalSession()
    XCTAssertFalse(session.close(UUID(), reason: .confirm))
    XCTAssertTrue(session.close(session.id, reason: .cancel))
    XCTAssertFalse(session.close(session.id, reason: .confirm))
    XCTAssertEqual(session.result, .cancel)
  }
  @MainActor func testToastPausePreservesDeadlineAndOldIdentity() async {
    var now = 0.0
    let toast = RosemaryToastState(now: { now })
    toast.resume("detached")
    toast.show("第一条", duration: 100)
    let old = toast.id
    now = 20
    toast.pause("reader")
    XCTAssertEqual(toast.remainingTime, 80)
    now = 400
    XCTAssertEqual(toast.remainingTime, 80)
    toast.resume("reader")
    toast.show("第二条", duration: 200)
    toast.dismiss(old)
    XCTAssertEqual(toast.message, "第二条")
    now = 450
    toast.pause("app")
    XCTAssertEqual(toast.remainingTime, 150)
    toast.dismiss()
    XCTAssertNil(toast.message)
  }
}
