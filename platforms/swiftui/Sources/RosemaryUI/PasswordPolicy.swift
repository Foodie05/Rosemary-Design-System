// Generated from design/input-validation.json; run pnpm design:generate.
public struct RosemaryPasswordResult: Equatable, Sendable {
  public let length: Bool
  public let characters: Bool
  public let categories: Bool
  public var valid: Bool { length && characters && categories }
}
public enum RosemaryPasswordPolicy {
  public static let minLength = 8
  public static let maxLength = 32
  public static let minimumCategories = 2
  public static let requirements = ["8–32 个字符","仅使用英文字母、数字和英文符号，不含空格","字母、数字、英文符号中至少包含两类"]
  public static func check(_ value: String) -> RosemaryPasswordResult {
    let points = value.unicodeScalars.map { $0.value }
    var letters = false, digits = false, symbols = false
    for n in points {
      if (65...90).contains(n) || (97...122).contains(n) { letters = true }
      else if (48...57).contains(n) { digits = true }
      else if (33...126).contains(n) { symbols = true }
    }
    return RosemaryPasswordResult(length: points.count >= minLength && points.count <= maxLength,
      characters: !points.isEmpty && points.allSatisfy { (33...126).contains($0) },
      categories: [letters, digits, symbols].filter { $0 }.count >= minimumCategories)
  }
}
