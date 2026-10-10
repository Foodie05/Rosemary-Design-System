import XCTest

final class WorkflowTests: XCTestCase {
  var app: XCUIApplication!
  override func setUpWithError() throws {
    continueAfterFailure = false
    app = XCUIApplication()
    app.launch()
  }
  func testFailureRetryAndCancellation() throws {
    app.swipeUp()
    let save = app.buttons["保存项目"]
    XCTAssertTrue(save.waitForExistence(timeout: 5))
    save.tap()
    XCTAssertTrue(app.staticTexts["保存失败，草稿已保留，请重试"].waitForExistence(timeout: 5))
    app.buttons["重试保存"].tap()
    XCTAssertTrue(app.staticTexts["已保存"].waitForExistence(timeout: 5))
    app.swipeDown()
    app.buttons["修改名称"].tap()
    XCTAssertTrue(app.buttons["取消"].waitForExistence(timeout: 5))
    app.buttons["取消"].tap()
    XCTAssertTrue(app.textFields["项目名称"].waitForExistence(timeout: 5))
    XCTAssertEqual(app.textFields["项目名称"].value as? String, "Rosemary Notes")
    let screenshot = XCTAttachment(screenshot: app.screenshot())
    screenshot.name = "SwiftUI workflow"
    screenshot.lifetime = .keepAlways
    add(screenshot)
  }
  func testNativeSelectionAndDestructiveCancellation() throws {
    app.buttons["分类"].tap()
    app.buttons["团队"].tap()
    app.buttons["状态"].tap()
    app.buttons["清空草稿"].tap()
    XCTAssertTrue(app.alerts.firstMatch.waitForExistence(timeout: 5))
    app.alerts.buttons["取消"].tap()
    app.buttons["编辑"].tap()
    XCTAssertEqual(app.textFields["项目名称"].value as? String, "Rosemary Notes")
  }
}
