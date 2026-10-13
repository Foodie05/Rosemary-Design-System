import XCTest

final class GalleryUITests: XCTestCase {
  private func launch(_ args: [String] = []) -> XCUIApplication {
    let app = XCUIApplication()
    app.launchArguments = args
    app.launch()
    XCTAssertTrue(app.buttons["Forms"].waitForExistence(timeout: 10))
    return app
  }
  private func reveal(_ element: XCUIElement, in app: XCUIApplication) {
    let gallery = app.scrollViews["gallery-scroll"]
    let container = gallery.exists ? gallery : app
    for _ in 0..<12 {
      if element.exists && element.isHittable { return }
      // Move towards the element instead of repeatedly overshooting it.
      if element.exists && element.frame.maxY < container.frame.midY {
        container.coordinate(withNormalizedOffset: CGVector(dx: 0.98, dy: 0.25)).press(
          forDuration: 0.05, thenDragTo: container.coordinate(withNormalizedOffset: CGVector(dx: 0.98, dy: 0.75)))
      } else {
        container.coordinate(withNormalizedOffset: CGVector(dx: 0.98, dy: 0.75)).press(
          forDuration: 0.05, thenDragTo: container.coordinate(withNormalizedOffset: CGVector(dx: 0.98, dy: 0.25)))
      }
    }
    XCTAssertTrue(element.isHittable)
  }
  func testInputBindingAndCheckboxSemantics() {
    let app = launch()
    let input = app.textFields["Name"]
    input.tap()
    input.typeText("Rosemary")
    XCTAssertTrue(app.staticTexts["Name value: Rosemary"].exists)
    app.buttons["Navigation"].tap()
    app.buttons["Forms"].tap()
    let checkbox = app.descendants(matching: .any).matching(identifier: "checkbox").firstMatch
    reveal(checkbox, in: app)
    checkbox.tap()
    XCTAssertTrue(app.staticTexts["Remembered"].exists)
  }
  func testModalContainsBackgroundAndCancelDoesNotSave() {
    let app = launch()
    app.buttons["Overlays"].tap()
    app.buttons["Open dialog"].tap()
    XCTAssertTrue(app.textFields["Dialog notes"].waitForExistence(timeout: 3))
    XCTAssertFalse(app.buttons["Open drawer"].isHittable)
    app.textFields["Dialog notes"].tap()
    app.textFields["Dialog notes"].typeText("Uncommitted")
    app.buttons["Cancel dialog"].tap()
    XCTAssertTrue(app.buttons["Open dialog"].waitForExistence(timeout: 3))
    XCTAssertFalse(app.staticTexts["Saved: Uncommitted"].exists)
    app.buttons["Open dialog"].tap()
    app.buttons["Close Confirm changes"].tap()
    XCTAssertTrue(app.buttons["Open dialog"].waitForExistence(timeout: 3))
  }
  func testDrawerCanReopenAndDismiss() {
    let app = launch()
    app.buttons["Overlays"].tap()
    for _ in 0..<2 {
      app.buttons["Open drawer"].tap()
      XCTAssertTrue(app.buttons["Close Record details"].waitForExistence(timeout: 3))
      app.buttons["Close Record details"].tap()
      XCTAssertTrue(app.buttons["Open drawer"].waitForExistence(timeout: 3))
    }
  }
  func testDateCancelPreservesValueAndInvalidDirectInputReportsError() {
    let app = XCUIApplication()
    app.launchArguments = ["--capture", "date"]
    app.launch()
    let trigger = app.buttons["Choose Local date"]
    XCTAssertTrue(trigger.waitForExistence(timeout: 10))
    let monday = app.buttons["2026-10-05"]
    reveal(monday, in: app)
    let sunday = app.buttons["2026-10-04"]
    XCTAssertTrue(sunday.exists)
    XCTAssertLessThan(monday.frame.minX, sunday.frame.minX)
    XCTAssertGreaterThan(app.buttons["2026-10-01"].frame.minX, monday.frame.minX)
    app.buttons["Year 2026"].tap()
    XCTAssertTrue(app.textFields["Year 1–9999"].waitForExistence(timeout: 3))
    let year = app.buttons["2027"]
    reveal(year, in: app)
    year.tap()
    let next = app.buttons["Next month"]
    reveal(next, in: app)
    next.tap()
    XCTAssertTrue(app.buttons["2027-11-15"].waitForExistence(timeout: 3))
    app.buttons["Month 11"].tap()
    app.buttons["Month 12"].tap()
    let day = app.buttons["2027-12-15"]
    reveal(day, in: app)
    day.tap()
    let cancel = app.buttons["Cancel"].firstMatch
    reveal(cancel, in: app)
    cancel.tap()
    XCTAssertTrue(app.staticTexts["Date value: 2026-10-13"].exists)
    let field = app.textFields["Local date"]
    reveal(field, in: app)
    field.tap()
    field.press(forDuration: 1.1)
    if app.menuItems["Select All"].exists { app.menuItems["Select All"].tap() }
    field.typeText(String(repeating: XCUIKeyboardKey.delete.rawValue, count: 10) + "1900-02-29\n")
    XCTAssertTrue(
      app.staticTexts["Use YYYY-MM-DD within the permitted range"].waitForExistence(timeout: 3))
    XCTAssertTrue(app.staticTexts["Date value: 2026-10-13"].exists)
  }
  func testThemeLocaleAndAllConsumerSectionsRemainUsable() {
    let app = launch()
    app.buttons["theme"].tap()
    app.buttons["theme"].tap()
    XCTAssertEqual(app.buttons["theme"].label, "Dark")
    app.buttons["language"].tap()
    app.buttons["Navigation"].tap()
    XCTAssertTrue(app.buttons["上一页"].exists)
    app.buttons["下一页"].tap()
    app.buttons["Feedback"].tap()
    XCTAssertTrue(app.staticTexts["Consumer supplied content"].exists)
    app.buttons["Overlays"].tap()
    app.buttons["Open dialog"].tap()
    XCTAssertTrue(app.buttons["关闭 Confirm changes"].waitForExistence(timeout: 3))
    app.buttons["关闭 Confirm changes"].tap()
    app.terminate()
    app.launchArguments = ["--capture", "nested-theme"]
    app.launch()
    let host = app.staticTexts["host-appearance"]
    XCTAssertTrue(host.waitForExistence(timeout: 10))
    XCTAssertEqual(app.staticTexts["dark-subtree-appearance"].label, "dark")
    XCTAssertEqual(app.staticTexts["system-subtree-appearance"].label, host.label)
  }
  func testAnchoredSelectDoesNotReflowAndPointerSelectionCommits() {
    let app = XCUIApplication()
    app.launchArguments = ["--capture", "select"]
    app.launch()
    let trigger = app.buttons["Long choices"]
    XCTAssertTrue(trigger.waitForExistence(timeout: 10))
    let following = app.staticTexts["select-following"]
    let originalY = following.frame.minY
    trigger.tap()
    XCTAssertEqual(following.frame.minY, originalY, accuracy: 1)
    trigger.tap()
    let option = app.buttons["Choice 3"]
    XCTAssertTrue(option.waitForExistence(timeout: 3))
    option.tap()
    XCTAssertTrue(trigger.value as? String == "Choice 3, Collapsed")
    XCTAssertEqual(following.frame.minY, originalY, accuracy: 1)
  }
  func testBottomRightPopoverFlipsWithinWindow() {
    let app = XCUIApplication()
    app.launchArguments = ["--capture", "edge-popover"]
    app.launch()
    let title = app.staticTexts["Boundary placement"]
    XCTAssertTrue(title.waitForExistence(timeout: 10))
    let field = app.textFields["Popover notes"]
    XCTAssertTrue(field.isHittable)
    XCTAssertGreaterThanOrEqual(field.frame.minX, app.frame.minX)
    XCTAssertLessThanOrEqual(field.frame.maxX, app.frame.maxX)
    XCTAssertLessThan(title.frame.minY, app.buttons["Edge trigger"].frame.minY)
    app.buttons["Close Boundary placement"].tap()
    XCTAssertFalse(title.exists)
  }

  func testToastControlledPauseAndRuntimePersistentDuration() {
    let app = XCUIApplication()
    app.launchArguments = ["--capture", "toast"]
    app.launch()
    let notice = app.staticTexts["Timed notification"]
    XCTAssertTrue(notice.waitForExistence(timeout: 10))
    let vanishedWhilePaused = expectation(for: NSPredicate(format: "exists == false"), evaluatedWith: notice)
    vanishedWhilePaused.isInverted = true
    wait(for: [vanishedWhilePaused], timeout: 1.4)
    app.buttons["Resume notification"].tap()
    let vanishedAfterResume = expectation(for: NSPredicate(format: "exists == false"), evaluatedWith: notice)
    wait(for: [vanishedAfterResume], timeout: 4)
    XCTAssertTrue(app.staticTexts["Dismissals: 1"].exists)
    app.buttons["Show persistent notification"].tap()
    XCTAssertTrue(notice.waitForExistence(timeout: 3))
    let vanishedWithoutDuration = expectation(for: NSPredicate(format: "exists == false"), evaluatedWith: notice)
    vanishedWithoutDuration.isInverted = true
    wait(for: [vanishedWithoutDuration], timeout: 1.4)
    app.buttons["Dismiss Timed notification"].tap()
    XCTAssertTrue(app.staticTexts["Dismissals: 2"].exists)
  }

}
