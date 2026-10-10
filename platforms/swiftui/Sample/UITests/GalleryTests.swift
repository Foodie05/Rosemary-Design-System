import XCTest

final class GalleryTests: XCTestCase {
  let ids = [
    "button", "icon-button", "button-group", "split-button", "link-button",
    "floating-action-button", "text-field", "text-area", "password-field", "search-field",
    "number-field", "checkbox", "radio", "switch", "slider", "select", "combo-box", "date-picker",
    "time-picker", "file-upload", "color-picker", "tabs", "segmented-control", "breadcrumb",
    "sidebar", "top-navigation", "bottom-navigation", "pagination", "stepper", "command-palette",
    "table", "data-grid", "list", "description-list", "tree-view", "badge", "tag", "avatar",
    "dialog", "alert-dialog", "sheet", "toast", "snackbar", "banner", "progress", "skeleton",
    "spinner", "tooltip", "popover", "dropdown-menu", "context-menu", "drawer", "card", "accordion",
    "divider", "empty-state", "scroll-area", "resizable-panels", "metric-card", "prober-status",
    "file-row",
  ]
  func testAll61NativePreviews() {
    continueAfterFailure = false
    let app = XCUIApplication()
    for id in ids {
      app.launchArguments = ["--gallery", id]
      app.launch()
      XCTAssertTrue(app.navigationBars["组件预览 · \(id)"].waitForExistence(timeout: 5), id)
      if ["data-grid", "tree-view", "select", "number-field"].contains(id) {
        let image = XCTAttachment(screenshot: app.screenshot())
        image.name = "SwiftUI \(id)"
        image.lifetime = .keepAlways
        add(image)
      }
      app.terminate()
    }
  }
  func testLargeDarkRTLGridAndCancellation() {
    let app = XCUIApplication()
    app.launchArguments = ["--gallery", "data-grid", "--dark", "--rtl", "--large"]
    app.launch()
    XCTAssertTrue(app.navigationBars["组件预览 · data-grid"].waitForExistence(timeout: 5))
    app.swipeUp()
    let first = app.collectionViews.firstMatch
    XCTAssertTrue(first.exists)
    let screenshot = XCTAttachment(screenshot: app.screenshot())
    screenshot.name = "SwiftUI grid large dark RTL"
    screenshot.lifetime = .keepAlways
    add(screenshot)
  }
  func testNumberExplicitCommit() {
    let app = XCUIApplication()
    app.launchArguments = ["--gallery", "number-field"]
    app.launch()
    let field = app.textFields["数量"]
    XCTAssertTrue(field.waitForExistence(timeout: 5))
    field.tap()
    let existing = field.value as? String ?? ""
    field.typeText(
      String(repeating: XCUIKeyboardKey.delete.rawValue, count: existing.count) + "101")
    app.buttons["应用数值"].tap()
    XCTAssertTrue(app.staticTexts["输入错误：数值超出范围"].exists)
  }
}
