import Foundation

/// Gregorian civil date. No timezone, epoch or implicit Date conversion.
public struct RosemaryLocalDate: Hashable, Comparable, Codable, CustomStringConvertible {
  public let year: Int
  public let month: Int
  public let day: Int
  public init?(year: Int, month: Int, day: Int) {
    guard (1...9999).contains(year), (1...12).contains(month),
      (1...Self.daysInMonth(year: year, month: month)).contains(day)
    else { return nil }
    self.year = year
    self.month = month
    self.day = day
  }
  public init?(_ value: String) {
    let p = value.split(separator: "-", omittingEmptySubsequences: false)
    guard value.count == 10, p.count == 3, p[0].count == 4, p[1].count == 2, p[2].count == 2,
      value.allSatisfy({ $0.isASCII && ($0.isNumber || $0 == "-") }), let y = Int(p[0]),
      let m = Int(p[1]), let d = Int(p[2])
    else { return nil }
    self.init(year: y, month: m, day: d)
  }
  public var description: String { String(format: "%04d-%02d-%02d", year, month, day) }
  public static func < (a: Self, b: Self) -> Bool {
    (a.year, a.month, a.day) < (b.year, b.month, b.day)
  }
  public static func daysInMonth(year: Int, month: Int) -> Int {
    guard (1...12).contains(month) else { return 0 }
    if month == 2 { return year % 4 == 0 && (year % 100 != 0 || year % 400 == 0) ? 29 : 28 }
    return [4, 6, 9, 11].contains(month) ? 30 : 31
  }
  /// Sunday = 0. Proleptic Gregorian arithmetic works at years 1 and 9999.
  public var weekday: Int {
    let y = year - 1
    let before = y * 365 + y / 4 - y / 100 + y / 400
    let months = (1..<month).reduce(0) { $0 + Self.daysInMonth(year: year, month: $1) }
    return (before + months + day) % 7
  }
  public func addingDays(_ delta: Int) -> Self? {
    guard (-3_652_058...3_652_058).contains(delta) else { return nil }
    var y = year
    var m = month
    var d = day + delta
    while d > Self.daysInMonth(year: y, month: m) {
      d -= Self.daysInMonth(year: y, month: m)
      m += 1
      if m > 12 {
        m = 1
        y += 1
      }
      guard y <= 9999 else { return nil }
    }
    while d < 1 {
      m -= 1
      if m < 1 {
        m = 12
        y -= 1
      }
      guard y >= 1 else { return nil }
      d += Self.daysInMonth(year: y, month: m)
    }
    return Self(year: y, month: m, day: d)
  }
  public func addingMonths(_ delta: Int) -> Self? {
    guard (-119_987...119_987).contains(delta) else { return nil }
    let n = (year - 1) * 12 + month - 1 + delta
    guard (0..<9999 * 12).contains(n) else { return nil }
    let y = n / 12 + 1
    let m = n % 12 + 1
    return Self(year: y, month: m, day: min(day, Self.daysInMonth(year: y, month: m)))
  }
  public init(from decoder: Decoder) throws {
    let c = try decoder.singleValueContainer()
    let s = try c.decode(String.self)
    guard let value = Self(s) else {
      throw DecodingError.dataCorruptedError(
        in: c, debugDescription: "Expected Gregorian YYYY-MM-DD in years 0001–9999")
    }
    self = value
  }
  public func encode(to encoder: Encoder) throws {
    var c = encoder.singleValueContainer()
    try c.encode(description)
  }
}
public struct RosemaryLocalTime: Hashable, Comparable, Codable, CustomStringConvertible {
  public let hour: Int
  public let minute: Int
  public init?(hour: Int, minute: Int) {
    guard (0...23).contains(hour), (0...59).contains(minute) else { return nil }
    self.hour = hour
    self.minute = minute
  }
  public init?(_ value: String) {
    let p = value.split(separator: ":", omittingEmptySubsequences: false)
    guard value.count == 5, p.count == 2, p[0].count == 2, p[1].count == 2,
      value.allSatisfy({ $0.isASCII && ($0.isNumber || $0 == ":") }), let h = Int(p[0]),
      let m = Int(p[1])
    else { return nil }
    self.init(hour: h, minute: m)
  }
  public var description: String { String(format: "%02d:%02d", hour, minute) }
  public static func < (a: Self, b: Self) -> Bool { (a.hour, a.minute) < (b.hour, b.minute) }
  public init(from decoder: Decoder) throws {
    let c = try decoder.singleValueContainer()
    let s = try c.decode(String.self)
    guard let value = Self(s) else {
      throw DecodingError.dataCorruptedError(in: c, debugDescription: "Expected HH:mm local time")
    }
    self = value
  }
  public func encode(to encoder: Encoder) throws {
    var c = encoder.singleValueContainer()
    try c.encode(description)
  }
}
public struct RosemaryLocalDateRange: Hashable, Codable {
  public let start: RosemaryLocalDate
  public let end: RosemaryLocalDate
  public init?(start: RosemaryLocalDate, end: RosemaryLocalDate) {
    guard start <= end else { return nil }
    self.start = start
    self.end = end
  }
  private enum CodingKeys: String, CodingKey { case start, end }
  public init(from decoder: Decoder) throws {
    let c = try decoder.container(keyedBy: CodingKeys.self)
    let s = try c.decode(RosemaryLocalDate.self, forKey: .start)
    let e = try c.decode(RosemaryLocalDate.self, forKey: .end)
    guard let r = Self(start: s, end: e) else {
      throw DecodingError.dataCorruptedError(
        forKey: .end, in: c, debugDescription: "End precedes start")
    }
    self = r
  }
}
/// Draft state allows hosts to test or reuse cancellation/commit semantics independently of rendering.
public struct RosemaryDateDraft {
  public private(set) var original: RosemaryLocalDate?
  public var value: RosemaryLocalDate?
  public init(_ value: RosemaryLocalDate?) {
    original = value
    self.value = value
  }
  public mutating func cancel() { value = original }
  public mutating func commit() -> RosemaryLocalDate? {
    original = value
    return value
  }
}
