import SwiftUI
import XCTest

@testable import RosemaryUI

final class RosemaryTests: XCTestCase {
  func testGregorianBoundariesLeapYearsAndTimezoneFreeRoundTrip() throws {
    XCTAssertNil(RosemaryLocalDate("0000-01-01"))
    XCTAssertNil(RosemaryLocalDate("10000-01-01"))
    XCTAssertNil(RosemaryLocalDate("2026-1-01"))
    XCTAssertNil(RosemaryLocalDate("２０２６-01-01"))
    XCTAssertNotNil(RosemaryLocalDate("0001-01-01"))
    XCTAssertNotNil(RosemaryLocalDate("9999-12-31"))
    XCTAssertNil(RosemaryLocalDate("1900-02-29"))
    XCTAssertNotNil(RosemaryLocalDate("2000-02-29"))
    XCTAssertNil(RosemaryLocalDate("2100-02-29"))
    let leap = RosemaryLocalDate("2000-02-29")!
    XCTAssertEqual(leap.addingDays(1)?.description, "2000-03-01")
    XCTAssertEqual(leap.addingMonths(12)?.description, "2001-02-28")
    XCTAssertEqual(RosemaryLocalDate("0001-01-01")!.weekday, 1)
    XCTAssertEqual(RosemaryLocalDate("2026-10-13")!.weekday, 2)
    XCTAssertNil(RosemaryLocalDate("0001-01-01")!.addingDays(-1))
    XCTAssertNil(RosemaryLocalDate("9999-12-31")!.addingDays(1))
    for delta in [Int.min, Int.max] {
      XCTAssertNil(leap.addingDays(delta))
      XCTAssertNil(leap.addingMonths(delta))
    }
    let encoded = try JSONEncoder().encode(leap)
    XCTAssertEqual(String(data: encoded, encoding: .utf8), "\"2000-02-29\"")
    XCTAssertEqual(try JSONDecoder().decode(RosemaryLocalDate.self, from: encoded), leap)
    XCTAssertThrowsError(
      try JSONDecoder().decode(RosemaryLocalDate.self, from: Data("\"1900-02-29\"".utf8)))
  }
  func testEveryMinuteAndRejectedDateRange() throws {
    for minute in 0..<1440 {
      let t = RosemaryLocalTime(hour: minute / 60, minute: minute % 60)!
      XCTAssertEqual(RosemaryLocalTime(t.description), t)
    }
    XCTAssertNil(RosemaryLocalTime("24:00"))
    XCTAssertNil(RosemaryLocalTime("12:60"))
    XCTAssertNil(RosemaryLocalTime("1:05"))
    let a = RosemaryLocalDate("2026-10-13")!
    let b = RosemaryLocalDate("2026-10-14")!
    XCTAssertNil(RosemaryLocalDateRange(start: b, end: a))
    XCTAssertNotNil(RosemaryLocalDateRange(start: a, end: a))
    XCTAssertThrowsError(
      try JSONDecoder().decode(
        RosemaryLocalDateRange.self,
        from: Data("{\"start\":\"2026-10-14\",\"end\":\"2026-10-13\"}".utf8)))
  }
  func testCancelledDraftPreservesCommittedValueAndCommitUsesDraft() {
    let a = RosemaryLocalDate("2026-10-13")!
    let b = RosemaryLocalDate("2027-01-01")!
    var draft = RosemaryDateDraft(a)
    draft.value = b
    draft.cancel()
    XCTAssertEqual(draft.value, a)
    XCTAssertEqual(draft.original, a)
    draft.value = b
    XCTAssertEqual(draft.commit(), b)
    draft.value = nil
    draft.cancel()
    XCTAssertEqual(draft.value, b)
  }
  func testCompleteThemeValidationContrastAndInheritance() throws {
    var hex = Dictionary(uniqueKeysWithValues: RosemaryTheme.semanticNames.map { ($0, "#FFFFFF") })
    XCTAssertEqual(
      try RosemaryTheme.contrastDiagnostics(hex: hex).count, RosemaryTokens.contrastPairs.count)
    XCTAssertEqual(RosemaryTokens.contrastPairs.count, 22)
    hex["ink"] = "#000000"
    let theme = try RosemaryTheme(hex: hex)
    XCTAssertNotNil(theme.colors.toMap()["ink"])
    XCTAssertEqual(
      try theme.contrastDiagnostics(colorScheme: .light),
      try RosemaryTheme.contrastDiagnostics(hex: hex))
    XCTAssertTrue(try RosemaryTheme.light.contrastDiagnostics(colorScheme: .light).isEmpty)
    XCTAssertTrue(try RosemaryTheme.dark.contrastDiagnostics(colorScheme: .dark).isEmpty)
    let transparent = try theme.overriding(["primary": .white.opacity(0.5)])
    XCTAssertThrowsError(try transparent.contrastDiagnostics(colorScheme: .light))
    let lowContrast = try RosemaryTheme.light.overriding(["primary": RosemaryTokens.light.onPrimary]
    )
    XCTAssertTrue(
      try lowContrast.contrastDiagnostics(colorScheme: .light).contains {
        $0.foreground == "on-primary" && $0.background == "primary"
      })
    var bad = hex
    bad["primary"] = "red"
    XCTAssertThrowsError(try RosemaryTheme(hex: bad)) {
      XCTAssertEqual($0 as? RosemaryThemeError, .invalidColor("primary"))
    }
    bad = hex
    bad.removeValue(forKey: "focus")
    XCTAssertThrowsError(try RosemaryTheme(hex: bad)) {
      XCTAssertEqual($0 as? RosemaryThemeError, .missingColor("focus"))
    }
    bad = hex
    bad["unexpected"] = "#000000"
    XCTAssertThrowsError(try RosemaryTheme(hex: bad))
    let inherited = try theme.overriding(["primary": .purple])
    XCTAssertEqual(inherited.colors.toMap().count, 24)
    XCTAssertThrowsError(try theme.overriding(["not-a-role": .red]))
  }
  func testAnchoredPlacementFlipsClampsAndPreservesRTLLeadingEdge() {
    let viewport = CGRect(x: 12, y: 44, width: 366, height: 760)
    let bottom = CGRect(x: 340, y: 730, width: 28, height: 44)
    let result = RosemaryOverlayPlacement.resolve(
      anchor: bottom, viewport: viewport,
      preferredWidth: 320, preferredHeight: 240, rightToLeft: false)
    XCTAssertLessThan(result.origin.y, 0)
    XCTAssertGreaterThanOrEqual(bottom.minX + result.origin.x, viewport.minX)
    XCTAssertLessThanOrEqual(bottom.minX + result.origin.x + result.size.width, viewport.maxX)
    XCTAssertLessThanOrEqual(bottom.minY + result.origin.y + result.size.height, bottom.minY)
    let top = CGRect(x: 40, y: 60, width: 300, height: 44)
    let rtl = RosemaryOverlayPlacement.resolve(
      anchor: top, viewport: viewport,
      preferredWidth: 320, preferredHeight: 200, rightToLeft: true)
    XCTAssertEqual(top.minX + rtl.origin.x + rtl.size.width, top.maxX)
    XCTAssertGreaterThan(rtl.origin.y, 0)
  }
  func testFoldRestLayerExchangeBoundedMotionAndProgressTruth() {
    let start = RosemaryFoldFrame.at(0)
    let end = RosemaryFoldFrame.at(1)
    XCTAssertEqual(start, end)
    XCTAssertEqual(start.backOpacity, 0.4)
    XCTAssertEqual(start.frontOpacity, 1)
    XCTAssertTrue(RosemaryFoldFrame.at(0.45).backOnTop)
    XCTAssertFalse(RosemaryFoldFrame.at(0.8).backOnTop)
    for i in 0...120 {
      let frame = RosemaryFoldFrame.at(Double(i) / 120)
      XCTAssertLessThanOrEqual(abs(frame.backAngle), 58)
      XCTAssertLessThanOrEqual(abs(frame.frontAngle), 58)
    }
    XCTAssertNil(RosemaryProgress("Unknown", isRunning: false).fraction)
    XCTAssertTrue(RosemaryProgress("Unknown").isIndeterminate)
    XCTAssertEqual(RosemaryProgress("Task", value: 3, total: 6).fraction, 0.5)
    XCTAssertEqual(RosemaryProgress("Task", value: 9, total: 6).fraction, 1)
    XCTAssertEqual(RosemaryProgress("Task", value: -1, total: 6).fraction, 0)
  }
}
